import React, { useEffect, useRef } from 'react';
import {
  PsychrometricResult,
  SVP_TABLE_0_TO_50,
  getSVP,
} from '../physics/hygrometry';
import { Translations } from '../i18n/translations';

interface Module2CanvasProps {
  psychro: PsychrometricResult;
  t: Translations;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
}

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
}

export const Module2Canvas: React.FC<Module2CanvasProps> = ({ psychro, t }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ psychro, t });
  stateRef.current = { psychro, t };

  const hoverRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const animRef = useRef({
    time: 0,
    clouds: [] as Cloud[],
    rain: [] as RainDrop[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 700;
    let height = 580;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(480, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);

    if (animRef.current.clouds.length === 0) {
      for (let i = 0; i < 7; i++) {
        animRef.current.clouds.push({
          x: Math.random() * 800,
          y: 36 + Math.random() * 90,
          scale: 0.65 + Math.random() * 0.65,
          speed: 10 + Math.random() * 14,
        });
      }
      for (let i = 0; i < 65; i++) {
        animRef.current.rain.push({
          x: Math.random() * 800,
          y: Math.random() * 240,
          len: 10 + Math.random() * 10,
          speed: 260 + Math.random() * 140,
        });
      }
    }

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

    const drawCloud = (cx: number, cy: number, scale: number, fill: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.arc(22, -6, 24, 0, Math.PI * 2);
      ctx.arc(46, 0, 18, 0, Math.PI * 2);
      ctx.arc(24, 8, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let lastTs = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const anim = animRef.current;
      anim.time += dt;

      const { psychro: p, t: tr } = stateRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      const pad = 14;
      const skyH = Math.round(height * 0.41);
      const skyW = width - pad * 2;
      const skyX = pad;
      const skyY = pad;

      // ================================================================
      // TOP HALF: Dynamic Atmospheric Sky & Weather Window
      // ================================================================
      ctx.save();
      drawRoundRect(skyX, skyY, skyW, skyH, 14);
      ctx.clip();

      const skyGrad = ctx.createLinearGradient(0, skyY, 0, skyY + skyH);
      if (p.weatherCategory === 'storm') {
        skyGrad.addColorStop(0, '#1e293b');
        skyGrad.addColorStop(0.6, '#334155');
        skyGrad.addColorStop(1, '#475569');
      } else if (p.weatherCategory === 'humid') {
        skyGrad.addColorStop(0, '#64748b');
        skyGrad.addColorStop(0.6, '#94a3b8');
        skyGrad.addColorStop(1, '#cbd5e1');
      } else if (p.weatherCategory === 'dry') {
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.65, '#7dd3fc');
        skyGrad.addColorStop(1, '#fef3c7');
      } else {
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.65, '#38bdf8');
        skyGrad.addColorStop(1, '#e0f2fe');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(skyX, skyY, skyW, skyH);

      // Sun for pleasant / dry / partially veiled humid
      if (p.weatherCategory !== 'storm') {
        const sunX = skyX + skyW - 76;
        const sunY = skyY + 54;
        const sunAlpha = p.weatherCategory === 'humid' ? 0.35 : 0.95;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 54);
        sunGlow.addColorStop(0, `rgba(253, 224, 71, ${sunAlpha})`);
        sunGlow.addColorStop(0.5, `rgba(250, 204, 21, ${sunAlpha * 0.35})`);
        sunGlow.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 54, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(254, 240, 138, ${sunAlpha})`;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drifting Clouds
      const cloudCount =
        p.weatherCategory === 'storm'
          ? 7
          : p.weatherCategory === 'humid'
          ? 5
          : p.weatherCategory === 'pleasant'
          ? 3
          : 1;
      const cloudFill =
        p.weatherCategory === 'storm'
          ? 'rgba(30, 41, 59, 0.85)'
          : p.weatherCategory === 'humid'
          ? 'rgba(241, 245, 249, 0.82)'
          : 'rgba(255, 255, 255, 0.9)';

      for (let i = 0; i < cloudCount; i++) {
        const cl = anim.clouds[i];
        cl.x += cl.speed * dt * (p.weatherCategory === 'storm' ? 1.8 : 0.8);
        if (cl.x > skyX + skyW + 80) cl.x = skyX - 100;
        drawCloud(cl.x, skyY + cl.y * 0.75, cl.scale, cloudFill);
      }

      // Rain streaks in storm mode
      if (p.weatherCategory === 'storm') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
        ctx.lineWidth = 1.4;
        for (const drop of anim.rain) {
          drop.y += drop.speed * dt;
          drop.x -= 40 * dt;
          if (drop.y > skyY + skyH) {
            drop.y = skyY + 10;
            drop.x = skyX + Math.random() * (skyW + 60);
          }
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 3, drop.y + drop.len);
          ctx.stroke();
        }
      }

      // Dry horizon shimmer particles
      if (p.weatherCategory === 'dry') {
        ctx.fillStyle = 'rgba(254, 243, 199, 0.45)';
        for (let i = 0; i < 16; i++) {
          const px =
            skyX + ((i * 59 + anim.time * 48) % skyW);
          const py =
            skyY + skyH - 28 + Math.sin(anim.time * 2 + i) * 10;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Subtle horizon hills silhouette
      ctx.fillStyle =
        p.weatherCategory === 'storm'
          ? '#0f172a'
          : p.weatherCategory === 'dry'
          ? '#d97706'
          : '#059669';
      ctx.globalAlpha = p.weatherCategory === 'dry' ? 0.25 : 0.35;
      ctx.beginPath();
      ctx.moveTo(skyX, skyY + skyH);
      ctx.quadraticCurveTo(
        skyX + skyW * 0.28,
        skyY + skyH - 34,
        skyX + skyW * 0.55,
        skyY + skyH - 16
      );
      ctx.quadraticCurveTo(
        skyX + skyW * 0.8,
        skyY + skyH - 2,
        skyX + skyW,
        skyY + skyH - 26
      );
      ctx.lineTo(skyX + skyW, skyY + skyH);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // Top Sky HUD bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      drawRoundRect(skyX + 12, skyY + 10, Math.min(310, skyW - 24), 30, 8);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(tr.canvas.skyTitle, skyX + 22, skyY + 25);

      // Forecast badge inside sky window bottom-left
      const weatherInfo = tr.telemetry.weather[p.weatherCategory];
      const badgeW = Math.min(340, skyW - 24);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      drawRoundRect(skyX + 12, skyY + skyH - 44, badgeW, 32, 8);
      ctx.fill();

      ctx.fillStyle =
        p.weatherCategory === 'storm'
          ? '#fca5a5'
          : p.weatherCategory === 'humid'
          ? '#fde047'
          : p.weatherCategory === 'dry'
          ? '#fdba74'
          : '#6ee7b7';
      ctx.font = '700 12.5px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.fillText(
        `${weatherInfo.badge}  ·  R = ${p.measuredRH.toFixed(1)}%`,
        skyX + 24,
        skyY + skyH - 28
      );

      ctx.restore();

      // Sky border
      ctx.save();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      drawRoundRect(skyX, skyY, skyW, skyH, 14);
      ctx.stroke();
      ctx.restore();

      // ================================================================
      // BOTTOM HALF: Live SVP Interpolation Curve (P vs θ)
      // ================================================================
      const graphTop = skyY + skyH + 14;
      const graphH = height - graphTop - pad;
      const graphX = pad;
      const graphW = skyW;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      drawRoundRect(graphX, graphTop, graphW, graphH, 14);
      ctx.fill();
      ctx.stroke();

      // Title
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12.5px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(tr.canvas.svpGraphTitle, graphX + 16, graphTop + 22);

      const plotLeft = graphX + 56;
      const plotRight = graphX + graphW - 24;
      const plotTop = graphTop + 40;
      const plotBottom = graphTop + graphH - 38;
      const plotW = plotRight - plotLeft;
      const plotH = plotBottom - plotTop;

      const minTemp = 0;
      const maxTemp = 45;
      const maxP = 75;

      const toPxX = (temp: number) =>
        plotLeft + ((temp - minTemp) / (maxTemp - minTemp)) * plotW;
      const toPxY = (pres: number) =>
        plotBottom - (pres / maxP) * plotH;

      // Grid lines
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let pTick = 0; pTick <= maxP; pTick += 15) {
        const y = toPxY(pTick);
        ctx.beginPath();
        ctx.moveTo(plotLeft, y);
        ctx.lineTo(plotRight, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '500 10.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${pTick}`, plotLeft - 8, y);
      }

      for (let tTick = 0; tTick <= maxTemp; tTick += 5) {
        const x = toPxX(tTick);
        ctx.beginPath();
        ctx.moveTo(x, plotTop);
        ctx.lineTo(x, plotBottom);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '500 10.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`${tTick}°`, x, plotBottom + 6);
      }

      // Axes
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(plotLeft, plotTop);
      ctx.lineTo(plotLeft, plotBottom);
      ctx.lineTo(plotRight, plotBottom);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#475569';
      ctx.font = '600 10.5px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tr.canvas.svpAxisX, (plotLeft + plotRight) / 2, plotBottom + 21);

      ctx.save();
      ctx.translate(graphX + 16, (plotTop + plotBottom) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(tr.canvas.svpAxisY, 0, 0);
      ctx.restore();

      // Subtle shaded area under SVP curve
      ctx.beginPath();
      ctx.moveTo(toPxX(0), plotBottom);
      for (let temp = 0; temp <= maxTemp; temp++) {
        const svp = SVP_TABLE_0_TO_50[temp].svpMmHg;
        ctx.lineTo(toPxX(temp), toPxY(svp));
      }
      ctx.lineTo(toPxX(maxTemp), plotBottom);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, plotTop, 0, plotBottom);
      areaGrad.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
      areaGrad.addColorStop(1, 'rgba(14, 165, 233, 0.02)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Primary SVP Curve
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let temp = 0; temp <= maxTemp; temp++) {
        const svp = SVP_TABLE_0_TO_50[temp].svpMmHg;
        const px = toPxX(temp);
        const py = toPxY(svp);
        if (temp === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Coordinates for θ1 (F) and Dew Point θ (f)
      const clampedDew = Math.max(0, Math.min(maxTemp, p.dewPointC));
      const xAir = toPxX(p.dryBulbC);
      const yAir = toPxY(p.svpAtAirF);
      const xDew = toPxX(clampedDew);
      const yDew = toPxY(p.svpAtDewf);

      // Highlight Vapor Pressure Deficit segment at xAir (between f and F)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xAir, yAir);
      ctx.lineTo(xAir, yDew);
      ctx.stroke();

      // Horizontal guide from Dew Point to Air Temp at pressure f
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(plotLeft, yDew);
      ctx.lineTo(xAir, yDew);
      ctx.moveTo(xDew, yDew);
      ctx.lineTo(xDew, plotBottom);
      ctx.stroke();

      // Dashed guide for F at θ1
      ctx.strokeStyle = '#2563eb';
      ctx.beginPath();
      ctx.moveTo(plotLeft, yAir);
      ctx.lineTo(xAir, yAir);
      ctx.moveTo(xAir, yDew);
      ctx.lineTo(xAir, plotBottom);
      ctx.stroke();
      ctx.restore();

      // Integer bracket dots around θ1 and Dew Point θ to show linear interpolation
      if (p.airBracket.lowTemp >= 0 && p.airBracket.highTemp <= maxTemp) {
        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.arc(
          toPxX(p.airBracket.lowTemp),
          toPxY(p.airBracket.lowSVP),
          3.5,
          0,
          Math.PI * 2
        );
        ctx.arc(
          toPxX(p.airBracket.highTemp),
          toPxY(p.airBracket.highSVP),
          3.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      if (p.dewBracket.lowTemp >= 0 && p.dewBracket.highTemp <= maxTemp) {
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        ctx.arc(
          toPxX(p.dewBracket.lowTemp),
          toPxY(p.dewBracket.lowSVP),
          3.5,
          0,
          Math.PI * 2
        );
        ctx.arc(
          toPxX(p.dewBracket.highTemp),
          toPxY(p.dewBracket.highSVP),
          3.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Main marker: Air Temp (θ1, F)
      ctx.fillStyle = '#2563eb';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xAir, yAir, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Main marker: Dew Point (θ, f)
      if (p.dewPointC >= 0) {
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(xDew, yDew, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Marker Labels
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = xAir > plotRight - 90 ? 'right' : 'left';
      const airLblOff = xAir > plotRight - 90 ? -10 : 10;
      ctx.fillStyle = '#1d4ed8';
      ctx.fillText(
        `F(θ₁)=${p.svpAtAirF.toFixed(2)}`,
        xAir + airLblOff,
        Math.max(plotTop + 10, yAir - 10)
      );

      if (p.dewPointC >= 0) {
        ctx.fillStyle = '#047857';
        ctx.textAlign = xDew < plotLeft + 90 ? 'left' : 'right';
        const dewLblOff = xDew < plotLeft + 90 ? 10 : -10;
        ctx.fillText(
          `f(θ)=${p.svpAtDewf.toFixed(2)}`,
          xDew + dewLblOff,
          Math.max(plotTop + 20, yDew - 12)
        );
      }

      // Hover Crosshair Probe
      const hv = hoverRef.current;
      if (
        hv.active &&
        hv.x >= plotLeft &&
        hv.x <= plotRight &&
        hv.y >= plotTop &&
        hv.y <= plotBottom
      ) {
        const hoverTemp =
          minTemp + ((hv.x - plotLeft) / plotW) * (maxTemp - minTemp);
        const hoverSVP = getSVP(hoverTemp);
        const curveY = toPxY(hoverSVP);

        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hv.x, plotTop);
        ctx.lineTo(hv.x, plotBottom);
        ctx.moveTo(plotLeft, curveY);
        ctx.lineTo(plotRight, curveY);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(hv.x, curveY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        const tipW = 144;
        const tipH = 26;
        const tipX = Math.min(plotRight - tipW - 4, Math.max(plotLeft + 4, hv.x - tipW / 2));
        const tipY = Math.max(plotTop + 4, curveY - 34);

        ctx.fillStyle = '#0f172a';
        drawRoundRect(tipX, tipY, tipW, tipH, 6);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `${hoverTemp.toFixed(1)}°C → ${hoverSVP.toFixed(2)} mmHg`,
          tipX + tipW / 2,
          tipY + tipH / 2
        );
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '500 11px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(tr.canvas.hoverPrompt, plotLeft + 10, plotTop + 4);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    hoverRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    hoverRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[500px] lg:min-h-[560px] block rounded-xl cursor-crosshair"
    />
  );
};
