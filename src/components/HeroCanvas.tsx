"use client";

import "@/app/three-patch";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

// ── Shape generators ──────────────────────────────────────────────

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

function generatePhone() {
  const positions = new Float32Array(COUNT * 3);
  const radials = new Float32Array(COUNT * 3);
  const hw = 0.55;
  const hh = 1.2;
  const hd = 0.055;

  const set = (i: number, x: number, y: number, z: number) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    radials[i * 3] = x / len;
    radials[i * 3 + 1] = y / len;
    radials[i * 3 + 2] = z / len;
  };

  let idx = 0;

  // Front face (screen) — densest
  const frontN = Math.floor(COUNT * 0.42);
  for (let i = 0; i < frontN; i++, idx++) {
    set(idx, (Math.random() - 0.5) * 2 * hw, (Math.random() - 0.5) * 2 * hh, hd);
  }
  // Camera notch cluster
  const notchN = Math.floor(COUNT * 0.02);
  for (let i = 0; i < notchN; i++, idx++) {
    set(idx, (Math.random() - 0.5) * 0.2, hh * 0.84 + (Math.random() - 0.5) * 0.04, hd);
  }

  // Back face
  const backN = Math.floor(COUNT * 0.28);
  for (let i = 0; i < backN; i++, idx++) {
    set(idx, (Math.random() - 0.5) * 2 * hw, (Math.random() - 0.5) * 2 * hh, -hd);
  }

  // Top edge
  const topN = Math.floor(COUNT * 0.07);
  for (let i = 0; i < topN; i++, idx++) {
    set(idx, (Math.random() - 0.5) * 2 * hw, hh, (Math.random() - 0.5) * 2 * hd);
  }
  // Bottom edge
  const botN = Math.floor(COUNT * 0.07);
  for (let i = 0; i < botN; i++, idx++) {
    set(idx, (Math.random() - 0.5) * 2 * hw, -hh, (Math.random() - 0.5) * 2 * hd);
  }
  // Left edge
  const leftN = Math.floor(COUNT * 0.07);
  for (let i = 0; i < leftN; i++, idx++) {
    set(idx, -hw, (Math.random() - 0.5) * 2 * hh, (Math.random() - 0.5) * 2 * hd);
  }
  // Right edge (remaining)
  while (idx < COUNT) {
    set(idx, hw, (Math.random() - 0.5) * 2 * hh, (Math.random() - 0.5) * 2 * hd);
    idx++;
  }

  return { positions, radials };
}

// ── Morphing Particle System ──────────────────────────────────────

function Particles({ morphProgress }: { morphProgress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastCursor = useRef({ x: 0, y: 0, z: 0 });
  const lastMorph = useRef(-1);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 16 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 16 });

  const sphere = useMemo(() => generateSphere(), []);
  const phone = useMemo(() => generatePhone(), []);

  // Per-particle morph delay: inner particles (closer to origin) morph first
  const delays = useMemo(() => {
    const d = new Float32Array(COUNT);
    const sp = sphere.positions;
    let maxR = 0;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = Math.sqrt(sp[i3] * sp[i3] + sp[i3 + 1] * sp[i3 + 1] + sp[i3 + 2] * sp[i3 + 2]);
      d[i] = r;
      if (r > maxR) maxR = r;
    }
    for (let i = 0; i < COUNT; i++) d[i] = 1 - d[i] / maxR;
    return d;
  }, [sphere.positions]);

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
    const t = morphProgress.get();
    const mx = springX.get();
    const my = springY.get();

    // Cursor → 3D
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
    const morphChanged = Math.abs(t - lastMorph.current) > 0.0005;

    // Only run the expensive vertex loop when something actually changed
    if (cursorMoved || morphChanged) {
      lastCursor.current = { x: cx, y: cy, z: cz };
      lastMorph.current = t;

      const pos = pointsRef.current!.geometry.attributes.position;
      const sp = sphere.positions;
      const sr = sphere.radials;
      const pp = phone.positions;
      const pr = phone.radials;

      const sigma = 0.65;
      const maxDisp = 0.38;
      const twoSigmaSq = 2 * sigma * sigma;
      const cutoffSq = 3.5;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;

        // ── Staggered morph interpolation ──
        const delay = delays[i];
        const pt = Math.max(0, Math.min(1, (t - (1 - delay) * 0.25) / 0.75));
        const eased = pt < 0.5 ? 2 * pt * pt : 1 - Math.pow(-2 * pt + 2, 2) / 2;

        const bx = sp[i3] + (pp[i3] - sp[i3]) * eased;
        const by = sp[i3 + 1] + (pp[i3 + 1] - sp[i3 + 1]) * eased;
        const bz = sp[i3 + 2] + (pp[i3 + 2] - sp[i3 + 2]) * eased;

        // Interpolate radial direction
        const rx = sr[i3] + (pr[i3] - sr[i3]) * eased;
        const ry = sr[i3 + 1] + (pr[i3 + 1] - sr[i3 + 1]) * eased;
        const rz = sr[i3 + 2] + (pr[i3 + 2] - sr[i3 + 2]) * eased;
        const rlen = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1;

        // ── Liquid displacement ──
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

    // Auto-revolution — always runs
    if (pointsRef.current) {
      pointsRef.current.rotation.x =
        my * 0.08 + Math.sin(clock.elapsedTime * 0.18) * 0.06;
      pointsRef.current.rotation.y =
        mx * 0.08 + clock.elapsedTime * 0.15;
      pointsRef.current.rotation.z =
        Math.cos(clock.elapsedTime * 0.14) * 0.06;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
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

// ── Orbiting Ring ─────────────────────────────────────────────────

function OrbitingRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  const ringGeo = useMemo(() => new THREE.TorusGeometry(2.3, 0.008, 16, 200), []);
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(2.5, 0.006, 16, 180), []);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.6;
      ringRef.current.rotation.y = clock.elapsedTime * 0.25;
      ringRef.current.rotation.z = Math.cos(clock.elapsedTime * 0.2) * 0.4;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.cos(clock.elapsedTime * 0.25) * 0.5;
      ringRef2.current.rotation.y = -clock.elapsedTime * 0.2;
      ringRef2.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.35;
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

// ── Cursor Spotlight ──────────────────────────────────────────────

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

  return <pointLight ref={lightRef} intensity={1.5} color="#ffffff" distance={6} decay={2} />;
}

// ── Scene ─────────────────────────────────────────────────────────

function Scene({ morphProgress }: { morphProgress: MotionValue<number> }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#d4d4d8" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#a1a1aa" />
      <pointLight position={[-2, 3, -2]} intensity={0.8} color="#f5f5f5" />
      <CursorSpotlight />
      {/* Subtle center core */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.025} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <OrbitingRing />
      <Particles morphProgress={morphProgress} />
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  );
}

// ── Export — persistent full-page background ──────────────────────

export function BackgroundCanvas({ morphProgress }: { morphProgress: MotionValue<number> }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
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
          <Scene morphProgress={morphProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
