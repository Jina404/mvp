"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let w = 0;
    let h = 0;
    const CONNECT_DIST = 180;
    const MOUSE_RADIUS = 200;
    const FOV = 500;
    const MAX_Z = 500;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const area = w * h;
      const count = Math.min(Math.max(Math.floor(area / 5000), 60), 180);
      particles = [];
      for (let i = 0; i < count; i++) {
        // Cluster particles toward the left and right edges, sparse in center
        const roll = Math.random();
        let px: number;
        if (roll < 0.4) {
          // Left 25%
          px = Math.random() * w * 0.25;
        } else if (roll < 0.8) {
          // Right 25%
          px = w * 0.75 + Math.random() * w * 0.25;
        } else {
          // Sparse middle
          px = w * 0.25 + Math.random() * w * 0.5;
        }
        particles.push({
          x: px,
          y: Math.random() * h,
          z: Math.random() * MAX_Z,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          vz: (Math.random() - 0.5) * 0.08,
          baseRadius: Math.random() * 2 + 1.2,
        });
      }
    };

    const project = (p: Particle) => {
      const scale = FOV / (FOV + p.z);
      const cx = w / 2;
      const cy = h / 2;
      return {
        x: cx + (p.x - cx) * scale,
        y: cy + (p.y - cy) * scale,
        scale,
      };
    };

    const animate = () => {
      // Clear with dark purple background
      ctx.fillStyle = "rgba(30, 15, 60, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // Update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
        if (p.z < 0 || p.z > MAX_Z) p.vz *= -1;

        // Mouse interaction — very gentle
        const proj = project(p);
        const dx = proj.x - mouseX;
        const dy = proj.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.005;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.25) {
          p.vx = (p.vx / speed) * 0.25;
          p.vy = (p.vy / speed) * 0.25;
        }
      }

      // Project all particles once
      const projected = particles.map((p) => project(p));

      // Build tap-root connections: each node connects to its 3 nearest neighbours
      // This creates branching tree/root-like structures instead of a uniform mesh
      const drawn = new Set<string>();
      for (let i = 0; i < particles.length; i++) {
        const a = projected[i];
        // Compute distances to all other nodes
        const neighbours: { j: number; dist: number }[] = [];
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST * 1.5) {
            neighbours.push({ j, dist });
          }
        }
        // Sort by distance and take closest 3
        neighbours.sort((x, y) => x.dist - y.dist);
        const top = neighbours.slice(0, 3);

        for (const n of top) {
          const key = i < n.j ? `${i}-${n.j}` : `${n.j}-${i}`;
          if (drawn.has(key)) continue;
          drawn.add(key);

          const b = projected[n.j];
          const depthFade = a.scale * b.scale;
          const distRatio = n.dist / (CONNECT_DIST * 1.5);
          const opacity = (1 - distRatio) * 0.1 * depthFade;
          const lineWidth = (1 - distRatio) * 1.0 * depthFade + 0.15;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      // Draw particles — dim purple glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const proj = projected[i];
        const r = p.baseRadius * proj.scale;
        const brightness = 0.08 + proj.scale * 0.12;

        // Outer bloom (large soft glow)
        const outerGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r * 12);
        outerGrad.addColorStop(0, `rgba(139, 92, 246, ${brightness * 0.06})`);
        outerGrad.addColorStop(0.4, `rgba(124, 58, 237, ${brightness * 0.02})`);
        outerGrad.addColorStop(1, "rgba(124, 58, 237, 0)");
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r * 12, 0, Math.PI * 2);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Inner glow
        const innerGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r * 4);
        innerGrad.addColorStop(0, `rgba(167, 139, 250, ${brightness * 0.15})`);
        innerGrad.addColorStop(0.5, `rgba(139, 92, 246, ${brightness * 0.06})`);
        innerGrad.addColorStop(1, "rgba(124, 58, 237, 0)");
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = innerGrad;
        ctx.fill();

        // Core dot
        const coreGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r * 1.2);
        coreGrad.addColorStop(0, `rgba(196, 181, 253, ${brightness * 0.25})`);
        coreGrad.addColorStop(0.6, `rgba(167, 139, 250, ${brightness * 0.15})`);
        coreGrad.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    resize();
    initParticles();

    // Prime the canvas with the dark purple background
    ctx.fillStyle = "rgba(30, 15, 60, 1)";
    ctx.fillRect(0, 0, w, h);

    animate();

    const onResize = () => { resize(); initParticles(); };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "auto" }}
    />
  );
}
