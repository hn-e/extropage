"use client";

import "@/app/three-patch";
import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

  const circleTexture = useMemo(() => {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,1)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
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

    const theta = mx * Math.PI;
    const phi = my * Math.PI * 0.45;
    const R = 1.8;
    let cx = R * Math.cos(phi) * Math.sin(theta);
    let cy = R * Math.sin(phi);
    let cz = R * Math.cos(phi) * Math.cos(theta);

    const cursorMoved =
      Math.abs(cx - lastCursor.current.x) > 0.003 ||
      Math.abs(cy - lastCursor.current.y) > 0.003 ||
      Math.abs(cz - lastCursor.current.z) > 0.003;

    // Compute rotation exactly as it will be applied to the mesh
    const rx = my * 0.08 + Math.sin(clock.elapsedTime * 0.12) * 0.06;
    const ry = mx * 0.08 + clock.elapsedTime * 0.10;
    const rz = Math.cos(clock.elapsedTime * 0.09) * 0.06;

    if (cursorMoved) {
      lastCursor.current = { x: cx, y: cy, z: cz };

      // Inverse-rotate cursor from world space into mesh local space
      // Euler XYZ order: R = Rz(rz)·Ry(ry)·Rx(rx), so inverse = Rx(-rx)·Ry(-ry)·Rz(-rz)
      // Step 1: rotate around Z by -rz
      const cosRz = Math.cos(-rz), sinRz = Math.sin(-rz);
      let lx = cx * cosRz - cy * sinRz;
      let ly = cx * sinRz + cy * cosRz;
      let lz = cz;
      // Step 2: rotate around Y by -ry
      const cosRy = Math.cos(-ry), sinRy = Math.sin(-ry);
      const tx = lx * cosRy + lz * sinRy;
      lz = lz * cosRy - lx * sinRy;
      lx = tx;
      // Step 3: rotate around X by -rx
      const cosRx = Math.cos(-rx), sinRx = Math.sin(-rx);
      const lyPrev = ly;
      ly = lyPrev * cosRx - lz * sinRx;
      lz = lyPrev * sinRx + lz * cosRx;

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
        const rdx = sr[i3];
        const rdy = sr[i3 + 1];
        const rdz = sr[i3 + 2];
        const rlen = Math.sqrt(rdx * rdx + rdy * rdy + rdz * rdz) || 1;

        const dx = bx - lx;
        const dy = by - ly;
        const dz = bz - lz;
        const dSq = dx * dx + dy * dy + dz * dz;

        if (dSq < cutoffSq) {
          const influence = Math.exp(-dSq / twoSigmaSq) * maxDisp;
          pos.setXYZ(i, bx + (rdx / rlen) * influence, by + (rdy / rlen) * influence, bz + (rdz / rlen) * influence);
        } else {
          pos.setXYZ(i, bx, by, bz);
        }
      }

      pos.needsUpdate = true;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.x = rx;
      pointsRef.current.rotation.y = ry;
      pointsRef.current.rotation.z = rz;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        map={circleTexture}
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

function CameraZoom() {
  const { camera } = useThree();
  const scrollZ = useMotionValue(6);
  const springZ = useSpring(scrollZ, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const t = Math.min(window.scrollY / (vh * 0.8), 1);
      scrollZ.set(6 - t * 5.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollZ]);

  useFrame(() => {
    camera.position.z = springZ.get();
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#d4d4d8" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#a1a1aa" />
      <pointLight position={[-2, 3, -2]} intensity={0.8} color="#f5f5f5" />
      <CameraZoom />
      <CursorSpotlight />
      <Particles />
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  );
}

export function BackgroundCanvas() {
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
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
