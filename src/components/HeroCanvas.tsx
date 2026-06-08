"use client";

import "@/app/three-patch";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useMotionValue, useSpring } from "framer-motion";

function BlobMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const basePositions = useRef<Float32Array | null>(null);
  const baseRadials = useRef<Float32Array | null>(null);
  const lastCursor = useRef({ x: 0, y: 0, z: 0 });

  const springX = useSpring(mouseX, { stiffness: 100, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 18 });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.8, 48);
    const pos = geo.attributes.position;
    const count = pos.count;
    const radials = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      const noise =
        Math.sin(nx * 4.5) * Math.cos(ny * 4.5) * Math.sin(nz * 4.5) * 0.15 +
        Math.sin(nx * 7.0 + 1.5) * Math.cos(nz * 7.0) * 0.08 +
        Math.cos(ny * 5.5 + 2.0) * Math.sin(nx * 5.5) * 0.06;

      const bx = x + nx * noise;
      const by = y + ny * noise;
      const bz = z + nz * noise;

      pos.setXYZ(i, bx, by, bz);

      // Pre-compute radial direction (avoids sqrt + normalize per frame)
      const blen = Math.sqrt(bx * bx + by * by + bz * bz);
      radials[i * 3] = bx / blen;
      radials[i * 3 + 1] = by / blen;
      radials[i * 3 + 2] = bz / blen;
    }

    geo.computeVertexNormals();
    basePositions.current = new Float32Array(pos.array);
    baseRadials.current = radials;
    return geo;
  }, []);

  const wireframeGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.85, 80);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame(({ clock }) => {
    const mx = springX.get();
    const my = springY.get();

    // Map cursor to 3D point on sphere
    const theta = mx * Math.PI;
    const phi = my * Math.PI * 0.45;
    const R = 1.8;
    const cx = R * Math.cos(phi) * Math.sin(theta);
    const cy = R * Math.sin(phi);
    const cz = R * Math.cos(phi) * Math.cos(theta);

    // Only displace if cursor moved noticeably (skips redundant work)
    const lc = lastCursor.current;
    const moved =
      Math.abs(cx - lc.x) > 0.003 ||
      Math.abs(cy - lc.y) > 0.003 ||
      Math.abs(cz - lc.z) > 0.003;

    if (moved && meshRef.current && basePositions.current && baseRadials.current) {
      lc.x = cx;
      lc.y = cy;
      lc.z = cz;

      const pos = meshRef.current.geometry.attributes.position;
      const bp = basePositions.current;
      const br = baseRadials.current;
      const sigma = 0.65;
      const maxDisp = 0.38;
      const twoSigmaSq = 2 * sigma * sigma;
      const cutoffSq = 3.5;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = bp[i3];
        const by = bp[i3 + 1];
        const bz = bp[i3 + 2];

        const dx = bx - cx;
        const dy = by - cy;
        const dz = bz - cz;
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < cutoffSq) {
          const t = Math.exp(-dSq / twoSigmaSq) * maxDisp;
          pos.setXYZ(i, bx + br[i3] * t, by + br[i3 + 1] * t, bz + br[i3 + 2] * t);
        } else {
          pos.setXYZ(i, bx, by, bz);
        }
      }

      pos.needsUpdate = true;
      // Normals NOT recomputed — base normals are close enough for subtle displacement
    }

    // Subtle rotation
    if (meshRef.current) {
      meshRef.current.rotation.x =
        mx * 0.12 + Math.sin(clock.elapsedTime * 0.15) * 0.05;
      meshRef.current.rotation.y =
        my * 0.12 + clock.elapsedTime * 0.06;
      meshRef.current.rotation.z =
        Math.cos(clock.elapsedTime * 0.12) * 0.04;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.copy(
        meshRef.current?.rotation ?? new THREE.Euler(),
      );
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Main blob — JS vertex displacement */}
        <mesh ref={meshRef} geometry={geometry}>
          <meshPhysicalMaterial
            color="#f0f0f0"
            metalness={0.08}
            roughness={0.12}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            reflectivity={1}
            iridescence={0.25}
            iridescenceIOR={0.9}
            sheen={1}
            sheenRoughness={0.4}
            sheenColor="#ffffff"
            envMapIntensity={0.5}
            transparent
            opacity={0.94}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh ref={wireframeRef} geometry={wireframeGeo}>
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.035}
            depthWrite={false}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.02}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitingRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  const ringGeo = useMemo(() => {
    return new THREE.TorusGeometry(2.3, 0.008, 16, 200);
  }, []);

  const ringGeo2 = useMemo(() => {
    return new THREE.TorusGeometry(2.5, 0.006, 16, 180);
  }, []);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.6;
      ringRef.current.rotation.y = clock.elapsedTime * 0.25;
      ringRef.current.rotation.z =
        Math.cos(clock.elapsedTime * 0.2) * 0.4;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x =
        Math.cos(clock.elapsedTime * 0.25) * 0.5;
      ringRef2.current.rotation.y = -clock.elapsedTime * 0.2;
      ringRef2.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.3) * 0.35;
    }
  });

  return (
    <group>
      <mesh ref={ringRef} geometry={ringGeo}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ringRef2} geometry={ringGeo2}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const basePositions = useRef<Float32Array | null>(null);
  const baseRadials = useRef<Float32Array | null>(null);
  const lastCursor = useRef({ x: 0, y: 0, z: 0 });

  const springX = useSpring(mouseX, { stiffness: 90, damping: 16 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 16 });

  const geometry = useMemo(() => {
    const count = 7000;
    const positions = new Float32Array(count * 3);
    const radials = new Float32Array(count * 3);
    const phiGold = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere — evenly spaced points on surface
      const y = 1 - (i / (count - 1)) * 2;
      const rAtY = Math.sqrt(1 - y * y);
      const theta = phiGold * i;

      // Slight radial scatter for depth
      const r = 1.8 + (Math.random() - 0.5) * 0.15;

      const x = Math.cos(theta) * rAtY * r;
      const z = Math.sin(theta) * rAtY * r;
      const wy = y * r;

      positions[i * 3] = x;
      positions[i * 3 + 1] = wy;
      positions[i * 3 + 2] = z;

      // Pre-compute radial direction
      const len = Math.sqrt(x * x + wy * wy + z * z);
      radials[i * 3] = x / len;
      radials[i * 3 + 1] = wy / len;
      radials[i * 3 + 2] = z / len;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    basePositions.current = new Float32Array(positions);
    baseRadials.current = radials;
    return geo;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame(({ clock }) => {
    const mx = springX.get();
    const my = springY.get();

    // Map cursor to 3D point on sphere
    const theta = mx * Math.PI;
    const phi = my * Math.PI * 0.45;
    const R = 1.8;
    const cx = R * Math.cos(phi) * Math.sin(theta);
    const cy = R * Math.sin(phi);
    const cz = R * Math.cos(phi) * Math.cos(theta);

    const lc = lastCursor.current;
    const moved =
      Math.abs(cx - lc.x) > 0.003 ||
      Math.abs(cy - lc.y) > 0.003 ||
      Math.abs(cz - lc.z) > 0.003;

    if (moved && particlesRef.current && basePositions.current && baseRadials.current) {
      lc.x = cx;
      lc.y = cy;
      lc.z = cz;

      const pos = particlesRef.current.geometry.attributes.position;
      const bp = basePositions.current;
      const br = baseRadials.current;
      const sigma = 0.65;
      const maxDisp = 0.38;
      const twoSigmaSq = 2 * sigma * sigma;
      const cutoffSq = 3.5;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = bp[i3];
        const by = bp[i3 + 1];
        const bz = bp[i3 + 2];

        const dx = bx - cx;
        const dy = by - cy;
        const dz = bz - cz;
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < cutoffSq) {
          const t = Math.exp(-dSq / twoSigmaSq) * maxDisp;
          pos.setXYZ(i, bx + br[i3] * t, by + br[i3 + 1] * t, bz + br[i3 + 2] * t);
        } else {
          pos.setXYZ(i, bx, by, bz);
        }
      }
      pos.needsUpdate = true;
    }

    // Subtle rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.x =
        mx * 0.12 + Math.sin(clock.elapsedTime * 0.15) * 0.05;
      particlesRef.current.rotation.y =
        mx * 0.12 + clock.elapsedTime * 0.06;
      particlesRef.current.rotation.z =
        Math.cos(clock.elapsedTime * 0.12) * 0.04;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.008}
        color="#f0f0f0"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function CursorSpotlight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 8 - 4;
      const y = -(e.clientY / window.innerHeight) * 4 + 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = springX.get();
      lightRef.current.position.y = springY.get();
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={1.5}
      color="#ffffff"
      distance={6}
      decay={2}
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#d4d4d8" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#a1a1aa" />
      <pointLight position={[-2, 3, -2]} intensity={0.8} color="#f5f5f5" />
      <CursorSpotlight />
      {/* Subtle center core — anchor for the particle field */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.025}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      <OrbitingRing />
      <Particles />
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  );
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
