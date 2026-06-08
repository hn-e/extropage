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

function generateTerminal() {
  const positions = new Float32Array(COUNT * 3);
  const radials = new Float32Array(COUNT * 3);

  const set = (i: number, x: number, y: number, z: number) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    radials[i * 3] = x / len;
    radials[i * 3 + 1] = y / len;
    radials[i * 3 + 2] = z / len;
  };

  const hd = 0.09; // half-depth for 3D extrusion
  const strokeW = 0.18;

  // ── > chevron ──
  const ax = -1.0, ayT = 1.0, ayB = -1.0;
  const px = 0.28, py = 0;

  // ── _ underscore ──
  const usX0 = 0.52, usX1 = 1.45, usY = -0.55;

  // ── Corner points for rounding ──
  const corners = [
    { x: ax, y: ayT },        // top-left
    { x: ax, y: ayB },        // bottom-left
    { x: px, y: py },         // meeting point
    { x: usX0, y: usY },      // underscore left
    { x: usX1, y: usY },      // underscore right
  ];

  // Pick a random point inside the 2D stroke shape
  const shapeXY = () => {
    const r = Math.random();
    if (r < 0.40) {
      // > top arm
      const t = Math.random();
      const dx = px - ax, dy = py - ayT;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len, ny = dx / len;
      const off = (Math.random() - 0.5) * strokeW;
      return { x: ax + dx * t + nx * off, y: ayT + dy * t + ny * off };
    }
    if (r < 0.80) {
      // > bottom arm
      const t = Math.random();
      const dx = px - ax, dy = py - ayB;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len, ny = dx / len;
      const off = (Math.random() - 0.5) * strokeW;
      return { x: ax + dx * t + nx * off, y: ayB + dy * t + ny * off };
    }
    // _ underscore
    return {
      x: usX0 + Math.random() * (usX1 - usX0),
      y: usY + (Math.random() - 0.5) * strokeW * 1.2,
    };
  };

  let idx = 0;

  // ── Front face (z = hd) — 30% ──
  const frontN = Math.floor(COUNT * 0.30);
  for (let i = 0; i < frontN; i++, idx++) {
    const { x, y } = shapeXY();
    set(idx, x, y, hd + (Math.random() - 0.5) * 0.008);
  }

  // ── Back face (z = -hd) — 20% ──
  const backN = Math.floor(COUNT * 0.20);
  for (let i = 0; i < backN; i++, idx++) {
    const { x, y } = shapeXY();
    set(idx, x, y, -hd + (Math.random() - 0.5) * 0.008);
  }

  // ── Volume body (z random -hd..hd) — 30% ──
  const bodyN = Math.floor(COUNT * 0.30);
  for (let i = 0; i < bodyN; i++, idx++) {
    const { x, y } = shapeXY();
    set(idx, x, y, (Math.random() - 0.5) * 2 * hd);
  }

  // ── Rounded corner blobs — 12% ──
  const cornerN = Math.floor(COUNT * 0.12);
  const cr = strokeW * 0.75; // corner radius
  for (let i = 0; i < cornerN; i++, idx++) {
    const c = corners[i % 5];
    // Uniform distribution inside a sphere
    const u = Math.random();
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = cr * Math.cbrt(u);
    set(idx, c.x + r * Math.sin(phi) * Math.cos(theta), c.y + r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
  }

  // ── Edge loop — fill remaining with boundary-edge emphasis ──
  while (idx < COUNT) {
    // Favour the stroke outline for edge definition
    const r = Math.random();
    let x: number, y: number;
    if (r < 0.45) {
      // > top arm, forced to edge
      const t = Math.random();
      const dx = px - ax, dy = py - ayT;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len, ny = dx / len;
      const side = Math.random() < 0.5 ? 1 : -1;
      x = ax + dx * t + nx * strokeW * 0.5 * side;
      y = ayT + dy * t + ny * strokeW * 0.5 * side;
    } else if (r < 0.90) {
      // > bottom arm, forced to edge
      const t = Math.random();
      const dx = px - ax, dy = py - ayB;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len, ny = dx / len;
      const side = Math.random() < 0.5 ? 1 : -1;
      x = ax + dx * t + nx * strokeW * 0.5 * side;
      y = ayB + dy * t + ny * strokeW * 0.5 * side;
    } else {
      // _ underscore edges
      x = usX0 + Math.random() * (usX1 - usX0);
      y = usY + (Math.random() < 0.5 ? 1 : -1) * strokeW * 0.6;
    }
    // Wide z spread for extrusion sides
    set(idx, x, y, (Math.random() - 0.5) * 2 * hd * 1.15);
    idx++;
  }

  return { positions, radials };
}

// ── Morphing Particle System ──────────────────────────────────────

function Particles({
  phoneProgress,
  terminalProgress,
}: {
  phoneProgress: MotionValue<number>;
  terminalProgress: MotionValue<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastCursor = useRef({ x: 0, y: 0, z: 0 });
  const lastPhone = useRef(-1);
  const lastTerminal = useRef(-1);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 16 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 16 });

  const sphere = useMemo(() => generateSphere(), []);
  const phone = useMemo(() => generatePhone(), []);
  const terminal = useMemo(() => generateTerminal(), []);

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
    const phoneT = phoneProgress.get();
    const terminalT = terminalProgress.get();
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
    const phoneChanged = Math.abs(phoneT - lastPhone.current) > 0.0005;
    const terminalChanged = Math.abs(terminalT - lastTerminal.current) > 0.0005;
    const morphChanged = phoneChanged || terminalChanged;

    // Only run the expensive vertex loop when something actually changed
    if (cursorMoved || morphChanged) {
      lastCursor.current = { x: cx, y: cy, z: cz };
      lastPhone.current = phoneT;
      lastTerminal.current = terminalT;

      const pos = pointsRef.current!.geometry.attributes.position;
      const sp = sphere.positions;
      const sr = sphere.radials;
      const pp = phone.positions;
      const pr = phone.radials;
      const tp = terminal.positions;
      const tr = terminal.radials;

      const sigma = 0.65;
      const maxDisp = 0.38;
      const twoSigmaSq = 2 * sigma * sigma;
      const cutoffSq = 3.5;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;

        // ── Stage 1: sphere → phone (staggered) ──
        const delay = delays[i];
        const pt1 = Math.max(0, Math.min(1, (phoneT - (1 - delay) * 0.25) / 0.75));
        const eased1 = pt1 < 0.5 ? 2 * pt1 * pt1 : 1 - Math.pow(-2 * pt1 + 2, 2) / 2;

        // Base position after stage 1
        const s1x = sp[i3] + (pp[i3] - sp[i3]) * eased1;
        const s1y = sp[i3 + 1] + (pp[i3 + 1] - sp[i3 + 1]) * eased1;
        const s1z = sp[i3 + 2] + (pp[i3 + 2] - sp[i3 + 2]) * eased1;

        // Base radial after stage 1
        const s1rx = sr[i3] + (pr[i3] - sr[i3]) * eased1;
        const s1ry = sr[i3 + 1] + (pr[i3 + 1] - sr[i3 + 1]) * eased1;
        const s1rz = sr[i3 + 2] + (pr[i3 + 2] - sr[i3 + 2]) * eased1;

        // ── Stage 2: stage1 → terminal (staggered) ──
        const pt2 = Math.max(0, Math.min(1, (terminalT - (1 - delay) * 0.25) / 0.75));
        const eased2 = pt2 < 0.5 ? 2 * pt2 * pt2 : 1 - Math.pow(-2 * pt2 + 2, 2) / 2;

        const bx = s1x + (tp[i3] - s1x) * eased2;
        const by = s1y + (tp[i3 + 1] - s1y) * eased2;
        const bz = s1z + (tp[i3 + 2] - s1z) * eased2;

        // Final radial
        const rx = s1rx + (tr[i3] - s1rx) * eased2;
        const ry = s1ry + (tr[i3 + 1] - s1ry) * eased2;
        const rz = s1rz + (tr[i3 + 2] - s1rz) * eased2;
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

function Scene({
  phoneProgress,
  terminalProgress,
}: {
  phoneProgress: MotionValue<number>;
  terminalProgress: MotionValue<number>;
}) {
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
      <Particles phoneProgress={phoneProgress} terminalProgress={terminalProgress} />
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  );
}

// ── Export — persistent full-page background ──────────────────────

export function BackgroundCanvas({
  phoneProgress,
  terminalProgress,
}: {
  phoneProgress: MotionValue<number>;
  terminalProgress: MotionValue<number>;
}) {
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
          <Scene phoneProgress={phoneProgress} terminalProgress={terminalProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
