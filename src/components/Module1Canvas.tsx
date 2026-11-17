import React, { useEffect, useRef } from 'react';
import { PsychrometricResult } from '../physics/hygrometry';
import { Translations } from '../i18n/translations';

interface Module1CanvasProps {
  psychro: PsychrometricResult;
  showLoupes: boolean;
  t: Translations;
}

interface VaporParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
  returning?: boolean;
}

interface WindStreak {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

export const Module1Canvas: React.FC<Module1CanvasProps> = ({
  psychro,
  showLoupes,
  t,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ psychro, showLoupes, t });
  stateRef.current = { psychro, showLoupes, t };

  const animStateRef = useRef({
    displayDryC: psychro.dryBulbC,
    displayWetC: psychro.wetBulbC,
    particles: [] as VaporParticle[],
    windStreaks: [] as WindStreak[],
    time: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 700;
    let height = 560;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(420, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);

    // Initialize subtle wind streaks
    if (animStateRef.current.windStreaks.length === 0) {
      for (let i = 0; i < 14; i++) {
        animStateRef.current.windStreaks.push({
          x: Math.random() * 700,
          y: 100 + Math.random() * 340,
          len: 32 + Math.random() * 44,
          speed: 1.6 + Math.random() * 1.4,
          alpha: 0.25 + Math.random() * 0.35,
        });
      }
    }

    let lastTs = performance.now();

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

    const tempToY = (tempC: number, scaleTopY: number, scaleBottomY: number) => {
      const clamped = Math.max(0, Math.min(50, tempC));
      return scaleBottomY - (clamped / 50) * (scaleBottomY - scaleTopY);
    };

    const drawLoupe = (
      cx: number,
      cy: number,
      radius: number,
      targetX: number,
      targetY: number,
      tempValue: number,
      title: string,
      accentColor: string,
      liquidColor: string
    ) => {
      // Leader line from meniscus to loupe
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.restore();

      // Target ring at meniscus
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Drop shadow for loupe
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Clip inside circular lens
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 3, 0, Math.PI * 2);
      ctx.clip();

      // Clean white-blue lens tint
      const lensGrad = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        4,
        cx,
        cy,
        radius
      );
      lensGrad.addColorStop(0, '#ffffff');
      lensGrad.addColorStop(1, '#f0f9ff');
      ctx.fillStyle = lensGrad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Magnified capillary tube inside loupe
      const magTubeW = 14;
      const magTubeX = cx - magTubeW / 2 - 14;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(magTubeX, cy - radius, magTubeW, radius * 2);

      // Magnified liquid column up to cy (since lens centers on meniscus!)
      const liqGrad = ctx.createLinearGradient(
        magTubeX,
        0,
        magTubeX + magTubeW,
        0
      );
      liqGrad.addColorStop(0, liquidColor);
      liqGrad.addColorStop(0.5, '#fb7185');
      liqGrad.addColorStop(1, liquidColor);
      ctx.fillStyle = liqGrad;
      ctx.fillRect(magTubeX + 2, cy, magTubeW - 4, radius + 6);

      // Meniscus curve
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.ellipse(cx - 14, cy, (magTubeW - 4) / 2, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Magnified tick marks around tempValue (0.2°C resolution, 18px per 1°C)
      const pxPerDeg = 22;
      const minT = Math.floor((tempValue - 3) * 5) / 5;
      const maxT = Math.ceil((tempValue + 3) * 5) / 5;

      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      for (let tTick = minT; tTick <= maxT + 0.001; tTick += 0.2) {
        const rounded = Math.round(tTick * 10) / 10;
        if (rounded < 0 || rounded > 50) continue;
        const tickY = cy - (rounded - tempValue) * pxPerDeg;
        if (tickY < cy - radius || tickY > cy + radius) continue;

        const isInteger = Math.abs(rounded - Math.round(rounded)) < 0.01;
        const tickLen = isInteger ? 18 : 9;
        ctx.strokeStyle = isInteger ? '#0f172a' : '#64748b';
        ctx.lineWidth = isInteger ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(magTubeX + magTubeW + 3, tickY);
        ctx.lineTo(magTubeX + magTubeW + 3 + tickLen, tickY);
        ctx.stroke();

        if (isInteger) {
          ctx.fillStyle = '#0f172a';
          ctx.fillText(
            `${Math.round(rounded)}°`,
            magTubeX + magTubeW + 25,
            tickY
          );
        }
      }

      // Crosshair at exact meniscus
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Lens glass sheen
      ctx.fillStyle = 'rgba(255, 255, 255, 0.26)';
      ctx.beginPath();
      ctx.ellipse(
        cx - radius * 0.35,
        cy - radius * 0.4,
        radius * 0.45,
        radius * 0.2,
        -0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();

      // Outer metallic bezel
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Label badge directly under loupe
      const labelW = 128;
      const labelH = 38;
      const labelX = cx - labelW / 2;
      const labelY = cy + radius + 8;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      drawRoundRect(labelX, labelY, labelW, labelH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '600 10px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, cx, labelY + 13);

      ctx.fillStyle = '#020617';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`${tempValue.toFixed(1)} °C`, cx, labelY + 29);
      ctx.restore();
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      const { psychro: p, showLoupes: loupes, t: tr } = stateRef.current;
      const anim = animStateRef.current;
      anim.time += dt;

      // Smooth mercury column settling
      const lerpFactor = 1 - Math.exp(-dt * 9);
      anim.displayDryC += (p.dryBulbC - anim.displayDryC) * lerpFactor;
      anim.displayWetC += (p.wetBulbC - anim.displayWetC) * lerpFactor;

      ctx.clearRect(0, 0, width, height);

      // Background subtle scientific wash & grid
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#f0f9ff');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;
      const gridStep = 28;
      for (let gx = 0; gx < width; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Compute apparatus geometry centered on canvas
      const centerX = width / 2;
      const boardW = Math.min(276, width * 0.44);
      const boardH = Math.min(410, height * 0.76);
      const boardX = centerX - boardW / 2;
      const boardY = Math.max(32, (height - boardH) / 2 - 16);

      const dryX = centerX - boardW * 0.25;
      const wetX = centerX + boardW * 0.25;

      const scaleTopY = boardY + 48;
      const scaleBottomY = boardY + boardH - 86;
      const bulbY = scaleBottomY + 26;

      // Gentle Airflow streamlines (behind/around apparatus when enabled)
      if (p.airflowActive) {
        ctx.save();
        for (const streak of anim.windStreaks) {
          streak.x += streak.speed * (dt * 60);
          if (streak.x > width + 40) {
            streak.x = -streak.len - 20;
            streak.y = boardY + 40 + Math.random() * (boardH - 40);
          }
          const grad = ctx.createLinearGradient(
            streak.x,
            streak.y,
            streak.x + streak.len,
            streak.y
          );
          grad.addColorStop(0, 'rgba(14, 165, 233, 0)');
          grad.addColorStop(0.5, `rgba(14, 165, 233, ${streak.alpha})`);
          grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(streak.x, streak.y);
          ctx.quadraticCurveTo(
            streak.x + streak.len * 0.5,
            streak.y - 4 * Math.sin(anim.time * 2 + streak.x * 0.02),
            streak.x + streak.len,
            streak.y
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      // Wooden / Anodized Stand Base & Plaque
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;

      const plaqueGrad = ctx.createLinearGradient(
        boardX,
        boardY,
        boardX + boardW,
        boardY + boardH
      );
      plaqueGrad.addColorStop(0, '#ffffff');
      plaqueGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = plaqueGrad;
      drawRoundRect(boardX, boardY, boardW, boardH, 16);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      drawRoundRect(boardX, boardY, boardW, boardH, 16);
      ctx.stroke();

      // Inner brushed metal mounting face
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      drawRoundRect(boardX + 10, boardY + 10, boardW - 20, boardH - 20, 10);
      ctx.fill();
      ctx.stroke();

      // Brass hanging eyelet at top center
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, boardY - 6, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Column headers on plaque
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tr.canvas.dryBulb, dryX, boardY + 28);
      ctx.fillText(tr.canvas.wetBulb, wetX, boardY + 28);

      // Center vertical divider on plaque
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, boardY + 36);
      ctx.lineTo(centerX, boardY + boardH - 18);
      ctx.stroke();
      ctx.restore();

      // Draw Thermometer Scales (0°C to 50°C)
      const drawScale = (tx: number, side: 'left' | 'right') => {
        const dir = side === 'left' ? -1 : 1;
        ctx.save();
        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        ctx.textAlign = side === 'left' ? 'right' : 'left';

        for (let deg = 0; deg <= 50; deg += 1) {
          const y = tempToY(deg, scaleTopY, scaleBottomY);
          const isMajor = deg % 10 === 0;
          const isMid = deg % 5 === 0 && !isMajor;
          const len = isMajor ? 11 : isMid ? 7 : 4;

          ctx.strokeStyle = isMajor ? '#0f172a' : '#64748b';
          ctx.lineWidth = isMajor ? 1.4 : 0.9;
          ctx.beginPath();
          ctx.moveTo(tx + dir * 9, y);
          ctx.lineTo(tx + dir * (9 + len), y);
          ctx.stroke();

          if (isMajor) {
            ctx.fillStyle = '#334155';
            ctx.fillText(`${deg}°`, tx + dir * 24, y);
          }
        }
        ctx.restore();
      };

      drawScale(dryX, 'left');
      drawScale(wetX, 'right');

      // Draw Distilled Water Reservoir below Wet Bulb
      const resW = 74;
      const resH = 54;
      const resX = wetX - resW / 2;
      const resY = bulbY + 28;

      // Reservoir glass container
      ctx.save();
      ctx.fillStyle = 'rgba(224, 242, 254, 0.65)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      drawRoundRect(resX, resY, resW, resH, 10);
      ctx.fill();
      ctx.stroke();

      // Water inside reservoir with subtle surface wave
      ctx.save();
      drawRoundRect(resX + 2, resY + 2, resW - 4, resH - 4, 8);
      ctx.clip();
      const waterTop = resY + 14;
      const waterGrad = ctx.createLinearGradient(0, waterTop, 0, resY + resH);
      waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0.72)');
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(resX, resY + resH);
      ctx.lineTo(resX, waterTop);
      for (let wx = 0; wx <= resW; wx += 6) {
        const waveY =
          waterTop + Math.sin(anim.time * 2.5 + wx * 0.14) * 1.4;
        ctx.lineTo(resX + wx, waveY);
      }
      ctx.lineTo(resX + resW, resY + resH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#0369a1';
      ctx.font = '600 10px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tr.canvas.waterReservoir, wetX, resY + resH + 14);
      ctx.restore();

      // Helper to draw each thermometer tube + liquid column
      const drawThermometer = (
        tx: number,
        tempC: number,
        liquidMain: string,
        liquidLight: string,
        isWet: boolean
      ) => {
        const tubeW = 12;
        const tubeTop = scaleTopY - 14;
        const meniscusY = tempToY(tempC, scaleTopY, scaleBottomY);

        // Glass backing tube
        ctx.save();
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        drawRoundRect(
          tx - tubeW / 2,
          tubeTop,
          tubeW,
          bulbY - tubeTop,
          tubeW / 2
        );
        ctx.fill();
        ctx.stroke();

        // Mounting clamps
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(tx - 10, scaleTopY + 12, 20, 4);
        ctx.fillRect(tx - 10, scaleBottomY - 18, 20, 4);

        // Liquid column
        const colGrad = ctx.createLinearGradient(tx - 3, 0, tx + 3, 0);
        colGrad.addColorStop(0, liquidMain);
        colGrad.addColorStop(0.5, liquidLight);
        colGrad.addColorStop(1, liquidMain);
        ctx.fillStyle = colGrad;
        ctx.fillRect(tx - 3, meniscusY, 6, bulbY - meniscusY);

        // Thermometer glass bulb
        const bulbGrad = ctx.createRadialGradient(
          tx - 3,
          bulbY - 3,
          2,
          tx,
          bulbY,
          12
        );
        bulbGrad.addColorStop(0, liquidLight);
        bulbGrad.addColorStop(1, liquidMain);
        ctx.fillStyle = bulbGrad;
        ctx.beginPath();
        ctx.arc(tx, bulbY, 11.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // If wet bulb, wrap bulb in wet muslin cloth wick dipping into water reservoir
        if (isWet) {
          // Muslin wick ribbon dipping into water
          const wickGrad = ctx.createLinearGradient(
            wetX - 8,
            bulbY,
            wetX + 8,
            resY + 34
          );
          wickGrad.addColorStop(0, '#f8fafc');
          wickGrad.addColorStop(0.5, '#e0f2fe');
          wickGrad.addColorStop(1, '#bae6fd');
          ctx.fillStyle = wickGrad;
          ctx.strokeStyle = '#7dd3fc';
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(tx - 9, bulbY + 4);
          ctx.quadraticCurveTo(tx - 11, bulbY + 28, tx - 6, resY + 32);
          ctx.lineTo(tx + 6, resY + 32);
          ctx.quadraticCurveTo(tx + 11, bulbY + 28, tx + 9, bulbY + 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Muslin wrap around the bulb itself
          ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(tx, bulbY, 13.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Subtle woven cross-hatch texture on muslin
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
          ctx.lineWidth = 0.8;
          for (let a = -8; a <= 8; a += 4) {
            ctx.beginPath();
            ctx.moveTo(tx - 10, bulbY + a);
            ctx.lineTo(tx + 10, bulbY + a);
            ctx.stroke();
          }

          // Animated capillary blue droplets climbing up wick
          for (let c = 0; c < 4; c++) {
            const phase = ((anim.time * 0.45 + c * 0.25) % 1);
            const cyCap = resY + 28 - phase * (resY + 28 - (bulbY + 4));
            const cxCap = tx + Math.sin(phase * 10 + c) * 3;
            ctx.fillStyle = `rgba(14, 165, 233, ${0.75 * (1 - phase * 0.4)})`;
            ctx.beginPath();
            ctx.arc(cxCap, cyCap, 2.1, 0, Math.PI * 2);
            ctx.fill();
          }

          // Stagnant boundary pocket halo when airflow is OFF
          if (!p.airflowActive && p.trueRH < 100) {
            const pulse = 1 + 0.05 * Math.sin(anim.time * 2.5);
            const pocketGrad = ctx.createRadialGradient(
              tx,
              bulbY,
              14,
              tx,
              bulbY,
              38 * pulse
            );
            pocketGrad.addColorStop(0, 'rgba(56, 189, 248, 0.34)');
            pocketGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = pocketGrad;
            ctx.beginPath();
            ctx.arc(tx, bulbY, 38 * pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#0369a1';
            ctx.font = '600 10px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(tr.canvas.stagnantPocket, tx + 42, bulbY - 22);
          }
        }

        // Glass specular reflection along tube
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(tx - 4, tubeTop + 4, 2, bulbY - tubeTop - 12);

        ctx.restore();
        return meniscusY;
      };

      const dryMeniscusY = drawThermometer(
        dryX,
        anim.displayDryC,
        '#dc2626',
        '#f87171',
        false
      );
      const wetMeniscusY = drawThermometer(
        wetX,
        anim.displayWetC,
        '#0284c7',
        '#38bdf8',
        true
      );

      // Update & Draw Evaporative Water Vapor Molecules around Wet Bulb
      const evapRate = p.evaporationRateNorm;
      const isEquilibrium = p.trueRH >= 99.5;
      const spawnProb = isEquilibrium ? 0.14 : 0.08 + evapRate * 0.65;

      if (Math.random() < spawnProb && anim.particles.length < 75) {
        const angle = (Math.random() - 0.5) * Math.PI * 0.9;
        const speedBase = isEquilibrium
          ? 14
          : (p.airflowActive ? 34 : 18) + evapRate * 46;
        anim.particles.push({
          x: wetX + Math.sin(angle) * 14,
          y: bulbY - Math.cos(angle) * 10 + (Math.random() - 0.5) * 8,
          vx:
            (p.airflowActive ? 22 : 0) +
            Math.sin(angle) * speedBase * 0.55 +
            (Math.random() - 0.5) * 10,
          vy: -Math.abs(Math.cos(angle) * speedBase) - 8,
          r: 2.5 + Math.random() * 2,
          alpha: 0.9,
          life: 0,
          maxLife: isEquilibrium ? 1.1 : 1.5 + Math.random() * 0.9,
          returning: isEquilibrium && Math.random() < 0.5,
        });
      }

      ctx.save();
      for (let i = anim.particles.length - 1; i >= 0; i--) {
        const pt = anim.particles[i];
        pt.life += dt;
        if (pt.life >= pt.maxLife) {
          anim.particles.splice(i, 1);
          continue;
        }
        if (pt.returning) {
          pt.x += (wetX - pt.x) * dt * 1.6;
          pt.y += (bulbY - pt.y) * dt * 1.6;
        } else {
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          if (p.airflowActive) {
            pt.vx += 14 * dt;
          }
        }
        const progress = pt.life / pt.maxLife;
        const alpha = (1 - progress) * 0.85;

        // Draw H2O vapor sphere
        ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(pt.x - pt.r * 0.3, pt.y - pt.r * 0.3, pt.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Visual comparison bridge between dry & wet meniscus levels
      if (Math.abs(dryMeniscusY - wetMeniscusY) > 3) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(dryX + 8, dryMeniscusY);
        ctx.lineTo(centerX + 4, dryMeniscusY);
        ctx.moveTo(wetX - 8, wetMeniscusY);
        ctx.lineTo(centerX - 4, wetMeniscusY);
        ctx.stroke();

        // Vertical delta arrow at center line
        ctx.setLineDash([]);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, dryMeniscusY);
        ctx.lineTo(centerX, wetMeniscusY);
        ctx.stroke();

        // Delta badge
        const midY = (dryMeniscusY + wetMeniscusY) / 2;
        ctx.fillStyle = '#ecfdf5';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.2;
        drawRoundRect(centerX - 32, midY - 11, 64, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = '700 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Δ${p.depressionC.toFixed(1)}°`, centerX, midY);
        ctx.restore();
      }

      // Draw Dual 4x Magnifying Loupes if enabled
      if (loupes) {
        const loupeRadius = Math.min(54, Math.max(40, width * 0.085));
        const leftLoupeX = Math.max(
          loupeRadius + 14,
          boardX - loupeRadius - 24
        );
        const rightLoupeX = Math.min(
          width - loupeRadius - 14,
          boardX + boardW + loupeRadius + 24
        );
        const clampedDryLoupeY = Math.max(
          loupeRadius + 16,
          Math.min(height - loupeRadius - 56, dryMeniscusY)
        );
        const clampedWetLoupeY = Math.max(
          loupeRadius + 16,
          Math.min(height - loupeRadius - 56, wetMeniscusY)
        );

        drawLoupe(
          leftLoupeX,
          clampedDryLoupeY,
          loupeRadius,
          dryX,
          dryMeniscusY,
          anim.displayDryC,
          tr.canvas.loupeDry,
          '#dc2626',
          '#dc2626'
        );

        drawLoupe(
          rightLoupeX,
          clampedWetLoupeY,
          loupeRadius,
          wetX,
          wetMeniscusY,
          anim.displayWetC,
          tr.canvas.loupeWet,
          '#0284c7',
          '#0284c7'
        );
      }

      // Bottom Status Bar inside Canvas (Evaporation flux meter & equilibrium note)
      const barW = Math.min(460, width - 32);
      const barH = 38;
      const barX = centerX - barW / 2;
      const barY = height - barH - 12;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.2;
      drawRoundRect(barX, barY, barW, barH, 10);
      ctx.fill();
      ctx.stroke();

      if (isEquilibrium) {
        ctx.fillStyle = '#0369a1';
        ctx.font = '700 12px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.canvas.equilibriumZeroNet, centerX, barY + barH / 2);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.font = '600 11.5px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.canvas.evaporationFlux, barX + 14, barY + barH / 2);

        const meterX = barX + 145;
        const meterW = barW - 215;
        const meterY = barY + barH / 2 - 4;
        ctx.fillStyle = '#e0f2fe';
        drawRoundRect(meterX, meterY, meterW, 8, 4);
        ctx.fill();

        const fillW = Math.max(4, meterW * evapRate);
        const meterGrad = ctx.createLinearGradient(
          meterX,
          0,
          meterX + meterW,
          0
        );
        meterGrad.addColorStop(0, '#0284c7');
        meterGrad.addColorStop(1, '#059669');
        ctx.fillStyle = meterGrad;
        drawRoundRect(meterX, meterY, fillW, 8, 4);
        ctx.fill();

        ctx.fillStyle = '#047857';
        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(
          `${Math.round(evapRate * 100)}%`,
          barX + barW - 14,
          barY + barH / 2
        );
      }
      ctx.restore();

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
      className="w-full h-full min-h-[460px] lg:min-h-[560px] block rounded-xl"
    />
  );
};
