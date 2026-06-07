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

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.8, 64);
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
    return geo;
  }, []);

  const wireframeGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.84, 60);
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
    if (meshRef.current) {
      meshRef.current.rotation.x =
        springX.get() * 0.3 + Math.sin(clock.elapsedTime * 0.15) * 0.1;
      meshRef.current.rotation.y =
        springX.get() * 0.3 + clock.elapsedTime * 0.1;
      meshRef.current.rotation.z =
        Math.cos(clock.elapsedTime * 0.12) * 0.08;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.copy(meshRef.current?.rotation ?? new THREE.Euler());
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={meshRef} geometry={geometry}>
          <meshPhysicalMaterial
            color="#f5f5f5"
            metalness={0.05}
            roughness={0.15}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
            reflectivity={1}
            envMapIntensity={0.6}
            transparent
            opacity={0.92}
            side={THREE.FrontSide}
          />
        </mesh>

        <mesh ref={wireframeRef} geometry={wireframeGeo}>
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.03}
            depthWrite={false}
          />
        </mesh>
      </Float>
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
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.2 + Math.random() * 1.8;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
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
        size={0.004}
        color="#ffffff"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -2, -3]} intensity={0.8} color="#a1a1aa" />
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#52525b" />
      <BlobMesh />
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
          toneMappingExposure: 1.2,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
