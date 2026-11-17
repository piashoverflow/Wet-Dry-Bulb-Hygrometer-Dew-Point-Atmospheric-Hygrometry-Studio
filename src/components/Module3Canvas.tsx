import React, { useEffect, useRef } from 'react';
import {
  computeApparentTempC,
  computePsychrometrics,
  getSVP,
} from '../physics/hygrometry';
import { PhenomenonId, Translations } from '../i18n/translations';

export interface PhenomenonParams {
  // 1. Cities
  cityTempC: number;
  dhakaRH: number;
  coxsRH: number;
  // 2. Glasses
  lensTempC: number;
  outdoorTempC: number;
  outdoorRH: number;
  // 3. Winter
  winterTempC: number;
  winterRH: number;
  // 4. Pitcher
  pitcherAmbientC: number;
  pitcherRH: number;
  pitcherMaterial: 'clay' | 'metal';
}

interface Module3CanvasProps {
  phenomenon: PhenomenonId;
  params: PhenomenonParams;
  t: Translations;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  side?: 'left' | 'right';
}

interface FogDroplet {
  rx: number; // relative x in [-1, 1]
  ry: number; // relative y in [-1, 1]
  r: number;
  threshold: number;
}

export const Module3Canvas: React.FC<Module3CanvasProps> = ({
  phenomenon,
  params,
  t,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ phenomenon, params, t });
  stateRef.current = { phenomenon, params, t };

  const animRef = useRef({
    time: 0,
    particles: [] as Particle[],
    fogLevel: 0,
    pitcherWaterTemp: params.pitcherAmbientC,
    fogDroplets: [] as FogDroplet[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pre-generate deterministic lens fog droplet distribution
    if (animRef.current.fogDroplets.length === 0) {
      for (let i = 0; i < 160; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * 0.92;
        animRef.current.fogDroplets.push({
          rx: Math.cos(angle) * rad,
          ry: Math.sin(angle) * rad,
          r: 1.5 + Math.random() * 3.8,
          threshold: Math.random() * 0.85,
        });
      }
    }

    let rafId = 0;
    let width = 700;
    let height = 560;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(460, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);

    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    let lastTs = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const anim = animRef.current;
      anim.time += dt;

      const { phenomenon: ph, params: pr, t: tr } = stateRef.current;

      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#f8fafc');
      bg.addColorStop(1, '#f0f9ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const pad = 16;

      // ================================================================
      // SCENARIO 1: Dhaka vs Cox's Bazar Comfort Comparison
      // ================================================================
      if (ph === 'cities') {
        const halfW = (width - pad * 3) / 2;
        const cardH = height - pad * 2 - 44;
        const cardY = pad + 38;

        // Title strip
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 14px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.phenomena.cities.title, width / 2, pad + 14);

        const drawCityCard = (
          cx: number,
          name: string,
          rh: number,
          side: 'left' | 'right'
        ) => {
          const isHighHumid = rh >= 68;
          const evapRate = Math.max(0.05, (100 - rh) / 90);
          const heatIndex = computeApparentTempC(pr.cityTempC, rh);

          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = isHighHumid ? '#fda4af' : '#7dd3fc';
          ctx.lineWidth = 1.6;
          drawRoundRect(cx, cardY, halfW, cardH, 14);
          ctx.fill();
          ctx.stroke();

          // Sky/atmosphere banner inside card
          const skyH = cardH * 0.56;
          ctx.save();
          drawRoundRect(cx + 8, cardY + 8, halfW - 16, skyH, 10);
          ctx.clip();

          const skyGrad = ctx.createLinearGradient(0, cardY + 8, 0, cardY + 8 + skyH);
          if (isHighHumid) {
            skyGrad.addColorStop(0, '#fef2f2');
            skyGrad.addColorStop(1, '#fee2e2');
          } else {
            skyGrad.addColorStop(0, '#e0f2fe');
            skyGrad.addColorStop(1, '#f0f9ff');
          }
          ctx.fillStyle = skyGrad;
          ctx.fillRect(cx + 8, cardY + 8, halfW - 16, skyH);

          // City Name Header
          ctx.fillStyle = '#0f172a';
          ctx.font = '700 13px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(name, cx + halfW / 2, cardY + 28);

          // Temperature & RH badge
          ctx.fillStyle = isHighHumid ? '#be123c' : '#0369a1';
          ctx.font = '700 12px "JetBrains Mono", monospace';
          ctx.fillText(
            `θ₁=${pr.cityTempC.toFixed(1)}°C  ·  R=${rh.toFixed(0)}%`,
            cx + halfW / 2,
            cardY + 48
          );

          // Stylized Person Silhouette (Head + Torso) showing skin & sweat cooling
          const px = cx + halfW / 2;
          const py = cardY + skyH * 0.62;

          // Aura glow: warm red if trapped heat, cool cyan if evaporating
          const auraGrad = ctx.createRadialGradient(px, py, 14, px, py, 74);
          if (isHighHumid) {
            auraGrad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
            auraGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          } else {
            auraGrad.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
            auraGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
          }
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(px, py, 74, 0, Math.PI * 2);
          ctx.fill();

          // Torso
          ctx.fillStyle = isHighHumid ? '#fb7185' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, py + 50, 34, Math.PI, 0);
          ctx.fill();

          // Head
          ctx.fillStyle = '#fde68a';
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(px, py - 4, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Facial expression (calm vs stressed/sweating)
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(px - 7, py - 7, 2.2, 0, Math.PI * 2);
          ctx.arc(px + 7, py - 7, 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          if (isHighHumid) {
            ctx.arc(px, py + 9, 6, Math.PI * 1.15, Math.PI * 1.85);
          } else {
            ctx.arc(px, py + 3, 7, 0.15 * Math.PI, 0.85 * Math.PI);
          }
          ctx.stroke();

          // Sweat beads remaining on forehead when humidity is high
          if (rh > 55) {
            const beadCount = Math.min(5, Math.round((rh - 50) / 10));
            ctx.fillStyle = '#0284c7';
            for (let b = 0; b < beadCount; b++) {
              const bx = px - 14 + b * 7;
              const by = py - 15 + ((anim.time * 8 + b * 3) % 6);
              ctx.beginPath();
              ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Spawn evaporative sweat vapor particles proportional to evapRate
          if (Math.random() < evapRate * 0.5 && anim.particles.length < 70) {
            anim.particles.push({
              x: px + (Math.random() - 0.5) * 44,
              y: py - 10 + (Math.random() - 0.5) * 32,
              vx: (Math.random() - 0.5) * 18,
              vy: -24 - evapRate * 42,
              r: 2.5 + Math.random() * 1.6,
              life: 0,
              maxLife: 1.25,
              side,
            });
          }

          // Draw particles belonging to this side
          for (let i = anim.particles.length - 1; i >= 0; i--) {
            const pt = anim.particles[i];
            if (pt.side !== side) continue;
            pt.life += dt;
            if (pt.life >= pt.maxLife) {
              anim.particles.splice(i, 1);
              continue;
            }
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            const alpha = (1 - pt.life / pt.maxLife) * 0.85;
            ctx.fillStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          // Bottom Metrics inside Card
          const infoTop = cardY + skyH + 22;
          ctx.fillStyle = '#475569';
          ctx.font = '600 11px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(tr.phenomena.cities.evapRate, cx + 16, infoTop);

          ctx.fillStyle = '#0f172a';
          ctx.font = '700 12px "JetBrains Mono", monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`${Math.round(evapRate * 100)}%`, cx + halfW - 16, infoTop);

          // Progress bar for evaporation rate
          ctx.fillStyle = '#e2e8f0';
          drawRoundRect(cx + 16, infoTop + 10, halfW - 32, 8, 4);
          ctx.fill();
          ctx.fillStyle = isHighHumid ? '#f43f5e' : '#059669';
          drawRoundRect(
            cx + 16,
            infoTop + 10,
            Math.max(6, (halfW - 32) * evapRate),
            8,
            4
          );
          ctx.fill();

          // Heat Index Readout
          const hiY = infoTop + 42;
          ctx.fillStyle = '#475569';
          ctx.font = '600 11px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(tr.phenomena.cities.apparentTemp, cx + 16, hiY);

          ctx.fillStyle = isHighHumid ? '#be123c' : '#047857';
          ctx.font = '700 16px "JetBrains Mono", monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`${heatIndex.toFixed(1)} °C`, cx + halfW - 16, hiY);

          // Comfort verdict strip
          const verdictY = hiY + 28;
          ctx.fillStyle = isHighHumid ? '#fff1f2' : '#ecfdf5';
          ctx.strokeStyle = isHighHumid ? '#fecdd3' : '#a7f3d0';
          ctx.lineWidth = 1;
          drawRoundRect(cx + 16, verdictY, halfW - 32, 34, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isHighHumid ? '#9f1239' : '#065f46';
          ctx.font = '700 11px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            isHighHumid
              ? tr.phenomena.cities.comfortMuggy
              : tr.phenomena.cities.comfortGood,
            cx + halfW / 2,
            verdictY + 17
          );

          ctx.restore();
        };

        drawCityCard(pad, tr.phenomena.cities.dhakaName, pr.dhakaRH, 'left');
        drawCityCard(
          pad * 2 + halfW,
          tr.phenomena.cities.coxsName,
          pr.coxsRH,
          'right'
        );
      }

      // ================================================================
      // SCENARIO 2: AC Room Glasses Condensation
      // ================================================================
      else if (ph === 'glasses') {
        const psychroOut = computePsychrometrics(
          pr.outdoorTempC,
          pr.outdoorRH,
          true
        );
        const dewPt = psychroOut.dewPointC;
        const isFogging = pr.lensTempC < dewPt;
        const targetFog = isFogging
          ? Math.min(1, (dewPt - pr.lensTempC) / 8 + 0.2)
          : 0;
        anim.fogLevel += (targetFog - anim.fogLevel) * Math.min(1, dt * 4.5);

        // Title
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 14px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.phenomena.glasses.title, width / 2, pad + 14);

        // Main glasses viewport box
        const boxX = pad;
        const boxY = pad + 38;
        const boxW = width - pad * 2;
        const boxH = height - boxY - pad;

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = isFogging ? '#93c5fd' : '#bae6fd';
        ctx.lineWidth = 1.6;
        drawRoundRect(boxX, boxY, boxW, boxH, 14);
        ctx.fill();
        ctx.stroke();

        // Warm outdoor humid air particles drifting toward glasses
        if (Math.random() < 0.35 && anim.particles.length < 55) {
          anim.particles.push({
            x: boxX + 20 + Math.random() * (boxW - 40),
            y: boxY + boxH - 20,
            vx: (Math.random() - 0.5) * 20,
            vy: -28 - Math.random() * 24,
            r: 2.8,
            life: 0,
            maxLife: 2.2,
          });
        }
        for (let i = anim.particles.length - 1; i >= 0; i--) {
          const pt = anim.particles[i];
          pt.life += dt;
          if (pt.life >= pt.maxLife) {
            anim.particles.splice(i, 1);
            continue;
          }
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          const a = (1 - pt.life / pt.maxLife) * 0.45;
          ctx.fillStyle = `rgba(14, 165, 233, ${a})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Pair of Eyeglasses in Center
        const centerX = width / 2;
        const glassY = boxY + boxH * 0.42;
        const lensR = Math.min(82, boxW * 0.16);
        const offset = lensR + 24;

        // Temple arms (behind)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - offset - lensR, glassY - 8);
        ctx.lineTo(centerX - offset - lensR - 36, glassY - 26);
        ctx.moveTo(centerX + offset + lensR, glassY - 8);
        ctx.lineTo(centerX + offset + lensR + 36, glassY - 26);
        ctx.stroke();

        // Bridge
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(centerX, glassY - 2, 24, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        const drawLens = (lx: number, ly: number) => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(lx, ly, lensR, 0, Math.PI * 2);
          ctx.clip();

          // Scenic view seen through clear lens (sun & hills)
          const viewGrad = ctx.createLinearGradient(0, ly - lensR, 0, ly + lensR);
          viewGrad.addColorStop(0, '#7dd3fc');
          viewGrad.addColorStop(0.65, '#e0f2fe');
          viewGrad.addColorStop(1, '#86efac');
          ctx.fillStyle = viewGrad;
          ctx.fillRect(lx - lensR, ly - lensR, lensR * 2, lensR * 2);

          // Crisp geometric tree/mountain shape behind lens so fogging blur is unmistakably visible!
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.moveTo(lx - lensR, ly + lensR);
          ctx.lineTo(lx - 20, ly - 10);
          ctx.lineTo(lx + 22, ly + 30);
          ctx.lineTo(lx + lensR, ly - 4);
          ctx.lineTo(lx + lensR, ly + lensR);
          ctx.closePath();
          ctx.fill();

          // Condensation Fog Layer when θ_lens < θ_dew
          if (anim.fogLevel > 0.01) {
            ctx.fillStyle = `rgba(241, 245, 249, ${anim.fogLevel * 0.84})`;
            ctx.fillRect(lx - lensR, ly - lensR, lensR * 2, lensR * 2);

            // Individual nucleated microscopic water droplets
            for (const drop of anim.fogDroplets) {
              if (anim.fogLevel > drop.threshold) {
                const dAlpha = Math.min(
                  0.85,
                  (anim.fogLevel - drop.threshold) * 1.8
                );
                const dx = lx + drop.rx * lensR;
                const dy = ly + drop.ry * lensR;
                ctx.fillStyle = `rgba(186, 230, 253, ${dAlpha})`;
                ctx.beginPath();
                ctx.arc(dx, dy, drop.r, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(255, 255, 255, ${dAlpha * 0.9})`;
                ctx.beginPath();
                ctx.arc(dx - drop.r * 0.3, dy - drop.r * 0.3, drop.r * 0.35, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // Specular glass highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.ellipse(lx - lensR * 0.35, ly - lensR * 0.35, lensR * 0.4, lensR * 0.16, -0.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Lens frame
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(lx, ly, lensR, 0, Math.PI * 2);
          ctx.stroke();
        };

        drawLens(centerX - offset, glassY);
        drawLens(centerX + offset, glassY);

        // Temperature Comparison Gauge Bar at bottom of canvas
        const barW = Math.min(460, boxW - 48);
        const barX = centerX - barW / 2;
        const barY = boxY + boxH - 96;

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.2;
        drawRoundRect(barX, barY, barW, 74, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isFogging ? '#be123c' : '#047857';
        ctx.font = '700 13px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          isFogging
            ? tr.phenomena.glasses.lensStatusFogged
            : tr.phenomena.glasses.lensStatusClear,
          centerX,
          barY + 22
        );

        ctx.fillStyle = '#0f172a';
        ctx.font = '700 13px "JetBrains Mono", monospace';
        ctx.fillText(
          `θ_lens = ${pr.lensTempC.toFixed(1)}°C   ${isFogging ? '<' : '≥'}   θ_dew = ${dewPt.toFixed(1)}°C`,
          centerX,
          barY + 49
        );

        ctx.restore();
      }

      // ================================================================
      // SCENARIO 3: Winter Chapped Lips & Fast Clothes Drying
      // ================================================================
      else if (ph === 'winter') {
        const psychroWin = computePsychrometrics(
          pr.winterTempC,
          pr.winterRH,
          true
        );
        const svpAir = getSVP(pr.winterTempC);
        const actualVP = svpAir * (pr.winterRH / 100);
        const deficit = Math.max(0, svpAir - actualVP);
        const evapIntensity = Math.min(1, (100 - pr.winterRH) / 85);

        ctx.fillStyle = '#0f172a';
        ctx.font = '700 14px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.phenomena.winter.title, width / 2, pad + 14);

        const halfW = (width - pad * 3) / 2;
        const cardY = pad + 38;
        const cardH = height - cardY - pad;

        // Left Card: Wet Clothes on Clothesline
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.5;
        drawRoundRect(pad, cardY, halfW, cardH, 14);
        ctx.fill();
        ctx.stroke();

        const cx1 = pad + halfW / 2;
        const lineY = cardY + 72;

        // Clothesline wire
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pad + 20, lineY);
        ctx.quadraticCurveTo(cx1, lineY + 14, pad + halfW - 20, lineY);
        ctx.stroke();

        // Fluttering wet shirt
        const sway = Math.sin(anim.time * (2 + evapIntensity * 3)) * (4 + evapIntensity * 8);
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx1 - 28, lineY + 8);
        ctx.lineTo(cx1 - 54 + sway * 0.4, lineY + 34);
        ctx.lineTo(cx1 - 40 + sway * 0.4, lineY + 52);
        ctx.lineTo(cx1 - 26 + sway * 0.6, lineY + 42);
        ctx.lineTo(cx1 - 28 + sway, lineY + 114);
        ctx.lineTo(cx1 + 28 + sway, lineY + 114);
        ctx.lineTo(cx1 + 26 + sway * 0.6, lineY + 42);
        ctx.lineTo(cx1 + 40 + sway * 0.4, lineY + 52);
        ctx.lineTo(cx1 + 54 + sway * 0.4, lineY + 34);
        ctx.lineTo(cx1 + 28, lineY + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Clothespins
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cx1 - 22, lineY + 2, 5, 12);
        ctx.fillRect(cx1 + 17, lineY + 2, 5, 12);

        // Right Card: Exposed Lips / Skin Moisture Loss
        const rx = pad * 2 + halfW;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.5;
        drawRoundRect(rx, cardY, halfW, cardH, 14);
        ctx.fill();
        ctx.stroke();

        const cx2 = rx + halfW / 2;
        const lipY = cardY + 125;

        // Stylized Lips showing dehydration cracks when RH < 45%
        ctx.fillStyle = pr.winterRH < 40 ? '#e11d48' : '#fb7185';
        ctx.beginPath();
        ctx.moveTo(cx2 - 54, lipY);
        ctx.quadraticCurveTo(cx2 - 22, lipY - 26, cx2, lipY - 14);
        ctx.quadraticCurveTo(cx2 + 22, lipY - 26, cx2 + 54, lipY);
        ctx.quadraticCurveTo(cx2, lipY + 34, cx2 - 54, lipY);
        ctx.closePath();
        ctx.fill();

        // Center lip crease
        ctx.strokeStyle = '#9f1239';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx2 - 48, lipY);
        ctx.quadraticCurveTo(cx2, lipY + 6, cx2 + 48, lipY);
        ctx.stroke();

        // Micro-fissures / chapping lines when dry
        if (pr.winterRH < 50) {
          const cracks = Math.round((55 - pr.winterRH) / 8);
          ctx.strokeStyle = '#fff1f2';
          ctx.lineWidth = 1.4;
          for (let k = 0; k < cracks; k++) {
            const kx = cx2 - 32 + k * 14;
            ctx.beginPath();
            ctx.moveTo(kx, lipY + 4);
            ctx.lineTo(kx + 2, lipY + 15);
            ctx.stroke();
          }
        }

        // Spawn escaping water molecules from BOTH shirt and lips
        if (Math.random() < evapIntensity * 0.7 && anim.particles.length < 80) {
          const isLeft = Math.random() < 0.5;
          anim.particles.push({
            x: (isLeft ? cx1 : cx2) + (Math.random() - 0.5) * 60,
            y: isLeft ? lineY + 60 + Math.random() * 40 : lipY + (Math.random() - 0.5) * 16,
            vx: 14 + evapIntensity * 28,
            vy: -24 - evapIntensity * 34,
            r: 2.6,
            life: 0,
            maxLife: 1.3,
          });
        }
        for (let i = anim.particles.length - 1; i >= 0; i--) {
          const pt = anim.particles[i];
          pt.life += dt;
          if (pt.life >= pt.maxLife) {
            anim.particles.splice(i, 1);
            continue;
          }
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          const a = (1 - pt.life / pt.maxLife) * 0.8;
          ctx.fillStyle = `rgba(14, 165, 233, ${a})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bottom metrics inside cards
        const statY = cardY + cardH - 86;
        // Left stat
        ctx.fillStyle = '#475569';
        ctx.font = '600 11.5px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tr.phenomena.winter.dryingTime, cx1, statY);
        ctx.fillStyle = '#059669';
        ctx.font = '700 18px "JetBrains Mono", monospace';
        ctx.fillText(`${Math.round(evapIntensity * 100)}%`, cx1, statY + 26);
        ctx.fillStyle = '#64748b';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillText(
          `ΔP = ${deficit.toFixed(2)} mmHg`,
          cx1,
          statY + 50
        );

        // Right stat
        ctx.fillStyle = '#475569';
        ctx.font = '600 11.5px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.fillText(tr.phenomena.winter.skinMoistureLoss, cx2, statY);
        ctx.fillStyle = pr.winterRH < 40 ? '#e11d48' : '#0284c7';
        ctx.font = '700 18px "JetBrains Mono", monospace';
        ctx.fillText(
          `${Math.round(evapIntensity * 100)}%`,
          cx2,
          statY + 26
        );
        ctx.fillStyle = '#64748b';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillText(
          `θ_dew = ${psychroWin.dewPointC.toFixed(1)}°C`,
          cx2,
          statY + 50
        );

        ctx.restore();
      }

      // ================================================================
      // SCENARIO 4: Earthen Pitcher (Matka) Evaporative Cooling
      // ================================================================
      else if (ph === 'pitcher') {
        const psychroMatka = computePsychrometrics(
          pr.pitcherAmbientC,
          pr.pitcherRH,
          true
        );
        const isClay = pr.pitcherMaterial === 'clay';
        // Water inside porous clay cools significantly toward wet-bulb temperature θ2
        const targetWaterTemp = isClay
          ? psychroMatka.wetBulbC + 0.15 * (pr.pitcherAmbientC - psychroMatka.wetBulbC)
          : pr.pitcherAmbientC;

        anim.pitcherWaterTemp +=
          (targetWaterTemp - anim.pitcherWaterTemp) * Math.min(1, dt * 4);

        ctx.fillStyle = '#0f172a';
        ctx.font = '700 14px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.phenomena.pitcher.title, width / 2, pad + 14);

        const boxX = pad;
        const boxY = pad + 38;
        const boxW = width - pad * 2;
        const boxH = height - boxY - pad;

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.5;
        drawRoundRect(boxX, boxY, boxW, boxH, 14);
        ctx.fill();
        ctx.stroke();

        const cx = width / 2;
        const cy = boxY + boxH * 0.45;
        const potR = Math.min(108, boxH * 0.28);

        // Draw Pitcher Body (Clay terracotta or Brushed Steel/Glass)
        const bodyGrad = ctx.createRadialGradient(
          cx - potR * 0.3,
          cy - potR * 0.2,
          12,
          cx,
          cy,
          potR
        );
        if (isClay) {
          bodyGrad.addColorStop(0, '#ea580c');
          bodyGrad.addColorStop(0.65, '#c2410c');
          bodyGrad.addColorStop(1, '#7c2d12');
        } else {
          bodyGrad.addColorStop(0, '#f1f5f9');
          bodyGrad.addColorStop(0.6, '#94a3b8');
          bodyGrad.addColorStop(1, '#475569');
        }

        // Pitcher Neck
        ctx.fillStyle = isClay ? '#9a3412' : '#64748b';
        drawRoundRect(cx - potR * 0.36, cy - potR - 24, potR * 0.72, 30, 8);
        ctx.fill();

        // Pitcher Rim
        ctx.fillStyle = isClay ? '#c2410c' : '#94a3b8';
        drawRoundRect(cx - potR * 0.44, cy - potR - 30, potR * 0.88, 12, 6);
        ctx.fill();

        // Pitcher Sphere
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, potR, 0, Math.PI * 2);
        ctx.fill();

        // Cross-section window showing cool blue water inside!
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, potR - 14, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(cx - potR, cy - potR, potR * 2, potR * 2);

        const waterTop = cy - potR * 0.35;
        const wGrad = ctx.createLinearGradient(0, waterTop, 0, cy + potR);
        wGrad.addColorStop(0, isClay ? '#38bdf8' : '#fb923c');
        wGrad.addColorStop(1, isClay ? '#0284c7' : '#ea580c');
        ctx.fillStyle = wGrad;

        ctx.beginPath();
        ctx.moveTo(cx - potR, cy + potR);
        ctx.lineTo(cx - potR, waterTop);
        for (let wx = -potR; wx <= potR; wx += 8) {
          ctx.lineTo(
            cx + wx,
            waterTop + Math.sin(anim.time * 2.2 + wx * 0.08) * 2
          );
        }
        ctx.lineTo(cx + potR, cy + potR);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Rim border around cut-away window
        ctx.strokeStyle = isClay ? '#7c2d12' : '#334155';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, potR - 14, 0, Math.PI * 2);
        ctx.stroke();

        // Draw microscopic pores & seepage droplets + evaporating vapor if Clay
        if (isClay) {
          const evapStrength = Math.max(0.05, (100 - pr.pitcherRH) / 90);
          ctx.fillStyle = '#38bdf8';
          for (let a = 0; a < 10; a++) {
            const ang = (a / 10) * Math.PI * 1.4 - Math.PI * 0.2;
            const px = cx + Math.cos(ang) * (potR - 2);
            const py = cy + Math.sin(ang) * (potR - 2);
            ctx.beginPath();
            ctx.arc(px, py, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }

          if (Math.random() < evapStrength * 0.65 && anim.particles.length < 70) {
            const ang = (Math.random() - 0.5) * Math.PI * 1.3;
            const sideSign = Math.random() < 0.5 ? -1 : 1;
            anim.particles.push({
              x: cx + sideSign * Math.cos(ang * 0.5) * potR,
              y: cy + Math.sin(ang) * potR * 0.7,
              vx: sideSign * (16 + evapStrength * 28),
              vy: -22 - evapStrength * 26,
              r: 2.6,
              life: 0,
              maxLife: 1.3,
            });
          }

          for (let i = anim.particles.length - 1; i >= 0; i--) {
            const pt = anim.particles[i];
            pt.life += dt;
            if (pt.life >= pt.maxLife) {
              anim.particles.splice(i, 1);
              continue;
            }
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            const alpha = (1 - pt.life / pt.maxLife) * 0.85;
            ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Digital Temperature Pill inside Water Window
        ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
        ctx.strokeStyle = isClay ? '#0284c7' : '#ea580c';
        ctx.lineWidth = 1.8;
        drawRoundRect(cx - 54, cy + 4, 108, 36, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isClay ? '#0369a1' : '#c2410c';
        ctx.font = '700 16px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${anim.pitcherWaterTemp.toFixed(1)} °C`,
          cx,
          cy + 22
        );

        // Bottom Summary Strip
        const drop = Math.max(0, pr.pitcherAmbientC - anim.pitcherWaterTemp);
        const barW = Math.min(440, boxW - 40);
        const barX = cx - barW / 2;
        const barY = boxY + boxH - 72;

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.2;
        drawRoundRect(barX, barY, barW, 54, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '600 11px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(tr.phenomena.pitcher.waterTempLabel, barX + 16, barY + 18);
        ctx.fillText(tr.phenomena.pitcher.coolingDropLabel, barX + 16, barY + 38);

        ctx.textAlign = 'right';
        ctx.font = '700 13px "JetBrains Mono", monospace';
        ctx.fillStyle = isClay ? '#0284c7' : '#dc2626';
        ctx.fillText(
          `${anim.pitcherWaterTemp.toFixed(1)} °C (θ₂=${psychroMatka.wetBulbC.toFixed(1)}°C)`,
          barX + barW - 16,
          barY + 18
        );
        ctx.fillStyle = isClay ? '#059669' : '#64748b';
        ctx.fillText(`−${drop.toFixed(1)} °C`, barX + barW - 16, barY + 38);

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[480px] lg:min-h-[560px] block rounded-xl"
    />
  );
};
