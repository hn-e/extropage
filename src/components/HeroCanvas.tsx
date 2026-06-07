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

  const springX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 22 });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.8, 32);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
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

      pos.setXYZ(i, x + nx * noise, y + ny * noise, z + nz * noise);
    }

    geo.computeVertexNormals();
    basePositions.current = new Float32Array(pos.array);
    return geo;
  }, []);

  const wireframeGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.85, 60);
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

    // Map cursor to a 3D point on a virtual sphere around the blob
    const theta = mx * Math.PI;
    const phi = my * Math.PI * 0.45;
    const R = 1.8;
    const cx = R * Math.cos(phi) * Math.sin(theta);
    const cy = R * Math.sin(phi);
    const cz = R * Math.cos(phi) * Math.cos(theta);

    // --- Vertex displacement: bulge toward cursor ---
    if (meshRef.current && basePositions.current) {
      const pos = meshRef.current.geometry.attributes.position;
      const sigma = 0.65;
      const maxDisp = 0.38;
      const cutoffSq = 3.5;

      for (let i = 0; i < pos.count; i++) {
        const i3 = i * 3;
        const bx = basePositions.current[i3];
        const by = basePositions.current[i3 + 1];
        const bz = basePositions.current[i3 + 2];

        const dx = bx - cx;
        const dy = by - cy;
        const dz = bz - cz;
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < cutoffSq) {
          const influence =
            Math.exp(-dSq / (2 * sigma * sigma)) * maxDisp;
          const len = Math.sqrt(bx * bx + by * by + bz * bz);
          const nx = bx / len;
          const ny = by / len;
          const nz = bz / len;

          pos.setXYZ(
            i,
            bx + nx * influence,
            by + ny * influence,
            bz + nz * influence,
          );
        } else {
          pos.setXYZ(i, bx, by, bz);
        }
      }

      pos.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }

    // --- Subtle rotation (reduced — deformation is the star now) ---
    if (meshRef.current) {
      meshRef.current.rotation.x =
        mx * 0.15 + Math.sin(clock.elapsedTime * 0.15) * 0.05;
      meshRef.current.rotation.y =
        my * 0.15 + clock.elapsedTime * 0.06;
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
        {/* Main blob */}
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

  const springX = useSpring(mouseX, { stiffness: 20, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 20, damping: 25 });

  const geometry = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.1 + Math.random() * 2.2;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = Math.random() * 0.008 + 0.002;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x =
        springY.get() * 0.15 + Math.sin(clock.elapsedTime * 0.08) * 0.05;
      particlesRef.current.rotation.y =
        springX.get() * 0.15 + clock.elapsedTime * 0.06;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.005}
        color="#ffffff"
        transparent
        opacity={0.45}
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
      <BlobMesh />
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
