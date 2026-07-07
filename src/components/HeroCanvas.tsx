"use client";

import "@/app/three-patch";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMotionValue, useSpring } from "framer-motion";

const COUNT = 4000;

function generateSphere() {
  const positions = new Float32Array(COUNT * 3);
  const radials = new Float32Array(COUNT * 3);
  const phiGold = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const rAtY = Math.sqrt(1 - y * y);
    const theta = phiGold * i;
    const r = 1.8 + (Math.random() - 0.5) * 0.15;

    const x = Math.cos(theta) * rAtY * r;
    const z = Math.sin(theta) * rAtY * r;
    const wy = y * r;

    positions[i * 3] = x;
    positions[i * 3 + 1] = wy;
    positions[i * 3 + 2] = z;

    const len = Math.sqrt(x * x + wy * wy + z * z);
    radials[i * 3] = x / len;
    radials[i * 3 + 1] = wy / len;
    radials[i * 3 + 2] = z / len;
  }

  return { positions, radials };
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastCursor = useRef({ x: 0, y: 0, z: 0 });

  const springX = useSpring(mouseX, { stiffness: 90, damping: 16 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 16 });

  const sphere = useMemo(() => generateSphere(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(COUNT * 3);
    arr.set(sphere.positions);
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, [sphere.positions]);

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

    const theta = mx * Math.PI;
    const phi = my * Math.PI * 0.45;
    const R = 1.8;
    const cx = R * Math.cos(phi) * Math.sin(theta);
    const cy = R * Math.sin(phi);
    const cz = R * Math.cos(phi) * Math.cos(theta);

    const cursorMoved =
      Math.abs(cx - lastCursor.current.x) > 0.003 ||
      Math.abs(cy - lastCursor.current.y) > 0.003 ||
      Math.abs(cz - lastCursor.current.z) > 0.003;

    if (cursorMoved) {
      lastCursor.current = { x: cx, y: cy, z: cz };

      const pos = pointsRef.current!.geometry.attributes.position;
      const sp = sphere.positions;
      const sr = sphere.radials;

      const sigma = 0.65;
      const maxDisp = 0.38;
      const twoSigmaSq = 2 * sigma * sigma;
      const cutoffSq = 3.5;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const bx = sp[i3];
        const by = sp[i3 + 1];
        const bz = sp[i3 + 2];
        const rx = sr[i3];
        const ry = sr[i3 + 1];
        const rz = sr[i3 + 2];
        const rlen = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1;

        const dx = bx - cx;
        const dy = by - cy;
        const dz = bz - cz;
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < cutoffSq) {
          const influence = Math.exp(-dSq / twoSigmaSq) * maxDisp;
          pos.setXYZ(i, bx + (rx / rlen) * influence, by + (ry / rlen) * influence, bz + (rz / rlen) * influence);
        } else {
          pos.setXYZ(i, bx, by, bz);
        }
      }

      pos.needsUpdate = true;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.x = my * 0.08 + Math.sin(clock.elapsedTime * 0.18) * 0.06;
      pointsRef.current.rotation.y = mx * 0.08 + clock.elapsedTime * 0.15;
      pointsRef.current.rotation.z = Math.cos(clock.elapsedTime * 0.14) * 0.06;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#D97706"
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.NormalBlending}
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
      mouseX.set((e.clientX / window.innerWidth) * 8 - 4);
      mouseY.set(-(e.clientY / window.innerHeight) * 4 + 2);
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

  return <pointLight ref={lightRef} intensity={2.5} color="#FBBF24" distance={6} decay={2} />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 4]} intensity={2.5} color="#FBBF24" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#D97706" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#F59E0B" />
      <pointLight position={[-2, 3, -2]} intensity={0.8} color="#FDE68A" />
      <CursorSpotlight />
      <Particles />
      <Environment preset="studio" environmentIntensity={0.5} />
    </>
  );
}

export function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: "#FFFBF0" }}>
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
