export const TWO_PI = Math.PI * 2;

export { drawBirds, drawPlanes } from "./atmo-weather-fauna.js";

export function fillCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TWO_PI);
  ctx.fill();
}

export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
      p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [(r * 255 + 0.5) | 0, (g * 255 + 0.5) | 0, (b * 255 + 0.5) | 0];
}

export class CloudShapeGenerator {
  static generateOrganicPuffs(isStorm, seed, baseUnit = 100, quality = 1.0) {
    const puffs = [],
      seededRandom = this._seededRandom(seed),
      s = baseUnit / 100,
      puffCount = Math.max(4, Math.round((isStorm ? 14 : 12) * quality));
    const baseWidth = (isStorm ? 110 : 105) * s,
      baseHeight = (isStorm ? 60 : 42) * s;
    for (let i = 0; i < puffCount; i++) {
      const angle = (i / puffCount) * TWO_PI + seededRandom() * 0.5,
        distFromCenter = seededRandom() * 0.6 + 0.2;
      let dx = Math.cos(angle) * (baseWidth / 2) * distFromCenter,
        dy = Math.sin(angle) * (baseHeight / 2) * distFromCenter * 0.6;
      if (isStorm) {
        if (dy > 0) {
          dy *= 0.4;
        } else if (Math.abs(dx) < baseWidth * 0.4) {
          dy -= seededRandom() * 28 * s;
        }
      }
      const centerDist = Math.sqrt(dx * dx + dy * dy) / (baseWidth / 2),
        baseRad = (isStorm ? 62 : 50) * s,
        radVariation = (isStorm ? 22 : 16) * s;
      const rad = baseRad + seededRandom() * radVariation - centerDist * 12 * s;
      const verticalShade =
        0.4 + (1 - (dy + baseHeight / 2) / baseHeight) * 0.4;
      const shade = verticalShade + seededRandom() * 0.05,
        softness = 0.3 + seededRandom() * 0.4,
        squash = 0.75 + seededRandom() * 0.25;
      const rotation = (seededRandom() - 0.5) * 0.6;
      puffs.push({
        offsetX: dx,
        offsetY: dy,
        rad: Math.max(15 * s, rad),
        shade: Math.min(1, shade),
        softness,
        squash,
        rotation,
        depth: seededRandom(),
      });
    }
    const detailCount = Math.max(1, Math.round((isStorm ? 8 : 6) * quality));
    for (let i = 0; i < detailCount; i++) {
      const angle = seededRandom() * TWO_PI,
        dist = 0.3 + seededRandom() * 0.45;
      puffs.push({
        offsetX: Math.cos(angle) * (baseWidth / 2) * dist,
        offsetY: Math.sin(angle) * (baseHeight / 2) * dist * 0.5 - 10 * s,
        rad: (14 + seededRandom() * 16) * s,
        shade: 0.5 + seededRandom() * 0.3,
        softness: 0.5 + seededRandom() * 0.3,
        squash: 0.6 + seededRandom() * 0.3,
        rotation: (seededRandom() - 0.5) * 0.8,
        depth: 0.8 + seededRandom() * 0.2,
      });
    }
    puffs.sort((a, b) => a.depth - b.depth);
    return puffs;
  }
  static generateWispyPuffs(seed, baseUnit = 100, quality = 1.0) {
    const puffs = [],
      seededRandom = this._seededRandom(seed),
      s = baseUnit / 100,
      puffCount = Math.max(
        3,
        Math.round((8 + Math.floor(seededRandom() * 4)) * quality),
      );
    const aspectH = 30 + seededRandom() * 10,
      aspectV = 20 + seededRandom() * 6;
    for (let i = 0; i < puffCount; i++) {
      const angle = (i / puffCount) * TWO_PI + seededRandom() * 0.8,
        dist = 0.05 + seededRandom() * 0.85;
      puffs.push({
        offsetX: Math.cos(angle) * aspectH * s * dist,
        offsetY: Math.sin(angle) * aspectV * s * dist,
        rad: (15 + seededRandom() * 18) * s,
        shade: 0.5 + seededRandom() * 0.4,
        softness: 0.4 + seededRandom() * 0.4,
        squash: 0.85 + seededRandom() * 0.18,
        rotation: seededRandom() * 0.5,
        depth: seededRandom(),
      });
    }
    puffs.sort((a, b) => a.depth - b.depth);
    return puffs;
  }
  static generateSunDecorationPuffs(seed, baseUnit = 100, quality = 1.0) {
    const puffs = [],
      seededRandom = this._seededRandom(seed),
      s = baseUnit / 100,
      halfWidth = (54 + seededRandom() * 16) * s;
    const baselineY = (10 + seededRandom() * 4) * s,
      totalSpan = halfWidth * 2,
      bottomCount = Math.max(
        2,
        Math.round((6 + Math.floor(seededRandom() * 2)) * quality),
      );
    for (let i = 0; i < bottomCount; i++) {
      const t = bottomCount === 1 ? 0.5 : i / (bottomCount - 1);
      const x = -halfWidth + totalSpan * t + (seededRandom() - 0.5) * 22 * s;
      const edge = Math.abs(x) / (halfWidth + 1),
        taper = 1 - Math.pow(edge, 1.6) * 0.3,
        rad = (20 + seededRandom() * 14) * s * taper;
      const y =
        baselineY -
        rad * (0.7 + seededRandom() * 0.25) +
        (seededRandom() - 0.5) * 10 * s;
      puffs.push({
        offsetX: x,
        offsetY: y,
        rad,
        shade: 0.42 + seededRandom() * 0.14,
        softness: 0.38 + seededRandom() * 0.14,
        squash: 0.62 + seededRandom() * 0.18,
        rotation: (seededRandom() - 0.5) * 0.55,
        depth: seededRandom() * 0.28,
      });
    }
    const bodyCount = Math.max(
      2,
      Math.round((6 + Math.floor(seededRandom() * 3)) * quality),
    );
    for (let i = 0; i < bodyCount; i++) {
      const t = bodyCount === 1 ? 0.5 : i / (bodyCount - 1);
      const x =
        -halfWidth * 0.85 +
        totalSpan * 0.85 * t +
        (seededRandom() - 0.5) * 26 * s;
      const edge = Math.abs(x) / (halfWidth + 1),
        taper = 1 - Math.pow(edge, 1.6) * 0.35,
        rad = (16 + seededRandom() * 18) * s * taper;
      const y =
        baselineY -
        rad -
        (6 + seededRandom() * 14) * s +
        (seededRandom() - 0.5) * 12 * s;
      puffs.push({
        offsetX: x,
        offsetY: y,
        rad,
        shade: 0.58 + seededRandom() * 0.18,
        softness: 0.32 + seededRandom() * 0.14,
        squash: 0.68 + seededRandom() * 0.18,
        rotation: (seededRandom() - 0.5) * 0.45,
        depth: 0.32 + seededRandom() * 0.3,
      });
    }
    const crownCount = Math.max(
      1,
      Math.round((3 + Math.floor(seededRandom() * 3)) * quality),
    );
    for (let i = 0; i < crownCount; i++) {
      const t = crownCount === 1 ? 0.5 : i / (crownCount - 1);
      const x =
        -halfWidth * 0.55 +
        totalSpan * 0.55 * t +
        (seededRandom() - 0.5) * 24 * s;
      const edge = Math.abs(x) / (halfWidth + 1),
        taper = 1 - Math.pow(edge, 1.8) * 0.35,
        rad = (12 + seededRandom() * 14) * s * taper;
      const y =
        baselineY -
        (26 + seededRandom() * 16) * s -
        rad * 0.5 +
        (seededRandom() - 0.5) * 10 * s;
      puffs.push({
        offsetX: x,
        offsetY: y,
        rad,
        shade: 0.74 + seededRandom() * 0.18,
        softness: 0.28 + seededRandom() * 0.14,
        squash: 0.7 + seededRandom() * 0.18,
        rotation: (seededRandom() - 0.5) * 0.5,
        depth: 0.7 + seededRandom() * 0.3,
      });
    }
    puffs.sort((a, b) => a.depth - b.depth);
    return puffs;
  }
  static generateCirrusLayeredPuffs(seed, baseUnit = 100, quality = 1.0) {
    const puffs = [],
      seededRandom = this._seededRandom(seed),
      s = baseUnit / 100,
      layerCount = 2 + Math.floor(seededRandom() * 2);
    const layerSpan = 90 * s;
    for (let L = 0; L < layerCount; L++) {
      const layerY = (seededRandom() - 0.5) * 14 * s,
        layerOpacity = 0.65 + seededRandom() * 0.35,
        puffsInLayer = Math.max(
          3,
          Math.round((7 + Math.floor(seededRandom() * 3)) * quality),
        );
      const spacing = layerSpan / (puffsInLayer - 1);
      for (let i = 0; i < puffsInLayer; i++) {
        const x =
          -layerSpan / 2 +
          i * spacing +
          (seededRandom() - 0.5) * spacing * 0.45;
        const yJitter = (seededRandom() - 0.5) * 8 * s;
        const taper = Math.max(
          0.6,
          1 - Math.pow(Math.abs(x) / (layerSpan / 2 + 1), 1.6) * 0.4,
        );
        puffs.push({
          offsetX: x,
          offsetY: layerY + yJitter,
          rad: (14 + seededRandom() * 10) * s * taper,
          shade: (0.55 + seededRandom() * 0.3) * layerOpacity,
          softness: 0.45 + seededRandom() * 0.3,
          squash: 0.7 + seededRandom() * 0.2,
          rotation: (seededRandom() - 0.5) * 0.25,
          depth: L * 0.3 + seededRandom() * 0.3,
        });
      }
    }
    puffs.sort((a, b) => a.depth - b.depth);
    return puffs;
  }
  static generateCirrusUncinusPuffs(seed, baseUnit = 100, quality = 1.0) {
    const puffs = [],
      seededRandom = this._seededRandom(seed),
      s = baseUnit / 100,
      length = (170 + seededRandom() * 80) * s;
    const waveAmp = (14 + seededRandom() * 10) * s,
      waveFreq = 0.7 + seededRandom() * 0.5,
      hookStart = 0.7 + seededRandom() * 0.1;
    const hookDir = seededRandom() < 0.5 ? -1 : 1,
      hookAmp = (24 + seededRandom() * 18) * s,
      strokeCount = seededRandom() < 0.55 ? 2 : 1;
    const sampleCurve = (t) => {
      const x = -length / 2 + t * length;
      let y = Math.sin(t * waveFreq * TWO_PI) * waveAmp;
      if (t > hookStart) {
        const h = (t - hookStart) / (1 - hookStart);
        y += hookDir * hookAmp * h * h;
      }
      return { x, y };
    };
    for (let stroke = 0; stroke < strokeCount; stroke++) {
      const echoOffsetY = stroke === 0 ? 0 : (9 + seededRandom() * 9) * s,
        echoOpacity = stroke === 0 ? 1.0 : 0.55 + seededRandom() * 0.2;
      const startT = stroke === 0 ? 0 : 0.15 + seededRandom() * 0.2,
        endT = stroke === 0 ? 1 : 0.7 + seededRandom() * 0.2;
      const puffCount = Math.max(
        4,
        Math.round((13 + Math.floor(seededRandom() * 5)) * quality),
      );
      for (let i = 0; i < puffCount; i++) {
        const tNorm = i / (puffCount - 1),
          t = startT + (endT - startT) * tNorm,
          p = sampleCurve(t),
          pNext = sampleCurve(Math.min(1, t + 0.004));
        const rawTangent = Math.atan2(pNext.y - p.y, pNext.x - p.x),
          tangent = Math.max(-0.38, Math.min(0.38, rawTangent));
        const edge = Math.min(tNorm, 1 - tNorm) * 2,
          taper = 0.65 + edge * 0.35;
        puffs.push({
          offsetX: p.x + (seededRandom() - 0.5) * 4 * s,
          offsetY: p.y + echoOffsetY + (seededRandom() - 0.5) * 3 * s,
          rad: (12 + seededRandom() * 7) * s * taper,
          shade: (0.5 + seededRandom() * 0.28) * echoOpacity,
          softness: 0.45 + seededRandom() * 0.22,
          squash: 0.55 + seededRandom() * 0.15,
          rotation: tangent + (seededRandom() - 0.5) * 0.12,
          depth: stroke * 0.35 + seededRandom() * 0.55,
        });
      }
    }
    puffs.sort((a, b) => a.depth - b.depth);
    return puffs;
  }
  static generateMixedPuffs(
    seed,
    variety = "cumulus",
    baseUnit = 100,
    quality = 1.0,
  ) {
    const puffs = [],
      seededRandom = this._seededRandom(seed),
      s = baseUnit / 100;
    if (variety === "cumulus") {
      const baseWidth = 110 * s,
        towerFactor = 0.5 + seededRandom() * 0.9,
        asymShift = (seededRandom() - 0.5) * 22 * s;
      const baseCount = Math.max(
        2,
        Math.round((4 + Math.floor(seededRandom() * 2)) * quality),
      );
      for (let i = 0; i < baseCount; i++) {
        const t = baseCount > 1 ? i / (baseCount - 1) - 0.5 : 0;
        puffs.push({
          offsetX: t * baseWidth * 0.88 + (seededRandom() - 0.5) * 15 * s,
          offsetY: (6 + seededRandom() * 10) * s,
          rad: (26 + seededRandom() * 18) * s,
          shade: 0.38 + seededRandom() * 0.05,
          softness: 0.35,
          squash: 1.0,
          rotation: 0,
          depth: seededRandom() * 0.25,
        });
      }
      const bodyCount = Math.max(
        2,
        Math.round((8 + Math.floor(seededRandom() * 4)) * quality),
      );
      for (let i = 0; i < bodyCount; i++) {
        puffs.push({
          offsetX:
            (seededRandom() - 0.5) * baseWidth * (0.4 + seededRandom() * 0.25) +
            asymShift * 0.35,
          offsetY: -(20 + seededRandom() * 58) * s,
          rad: (22 + seededRandom() * 20) * s,
          shade: 0.62 + seededRandom() * 0.08,
          softness: 0.28,
          squash: 1.0,
          rotation: 0,
          depth: 0.22 + seededRandom() * 0.48,
        });
      }
      const crownCount = Math.max(
        1,
        Math.round(
          (4 + Math.floor(seededRandom() * 2 + towerFactor * 1.5)) * quality,
        ),
      );
      for (let i = 0; i < crownCount; i++) {
        puffs.push({
          offsetX: (seededRandom() - 0.5) * baseWidth * 0.42 + asymShift * 0.6,
          offsetY: -(82 + towerFactor * 54 + seededRandom() * 52) * s,
          rad: (16 + seededRandom() * 18) * s,
          shade: 0.8 + seededRandom() * 0.05,
          softness: 0.22,
          squash: 1.0,
          rotation: 0,
          depth: 0.68 + seededRandom() * 0.32,
        });
      }
      const detailMixed = Math.max(0, Math.round(3 * quality));
      for (let i = 0; i < detailMixed; i++) {
        const a = seededRandom() * TWO_PI;
        puffs.push({
          offsetX: Math.cos(a) * (baseWidth * 0.35 + seededRandom() * 10 * s),
          offsetY: -(28 + seededRandom() * 48) * s,
          rad: (14 + seededRandom() * 15) * s,
          shade: 0.6 + seededRandom() * 0.1,
          softness: 0.38,
          squash: 1.0,
          rotation: 0,
          depth: seededRandom(),
        });
      }
    } else if (variety === "stratus") {
      const puffCount = Math.max(
        4,
        Math.round((14 + Math.floor(seededRandom() * 6)) * quality),
      );
      for (let i = 0; i < puffCount; i++) {
        const spreadX =
          (i - puffCount / 2) * 18 * s + (seededRandom() - 0.5) * 10 * s;
        const spreadY = (seededRandom() - 0.5) * 14 * s,
          normalY = (spreadY + 7 * s) / (14 * s);
        puffs.push({
          offsetX: spreadX,
          offsetY: spreadY,
          rad: (16 + seededRandom() * 14) * s,
          shade: 0.48 + (1 - normalY) * 0.3 + seededRandom() * 0.06,
          softness: 0.2 + seededRandom() * 0.3,
          squash: 0.55,
          rotation: 0,
          depth: seededRandom(),
        });
      }
      const coreCount = Math.max(
        1,
        Math.round((4 + Math.floor(seededRandom() * 3)) * quality),
      );
      for (let i = 0; i < coreCount; i++) {
        const spreadX =
          (i - coreCount / 2) * 26 * s + (seededRandom() - 0.5) * 12 * s;
        puffs.push({
          offsetX: spreadX,
          offsetY: (seededRandom() - 0.5) * 6 * s,
          rad: (18 + seededRandom() * 12) * s,
          shade: 0.6 + seededRandom() * 0.15,
          softness: 0.25 + seededRandom() * 0.2,
          squash: 0.6,
          rotation: 0,
          depth: 0.4 + seededRandom() * 0.3,
        });
      }
    } else if (variety === "cirrus") {
      const layerCount = 2 + Math.floor(seededRandom() * 2),
        layerGap = 11 * s,
        layerSpan = 95 * s,
        baseY = -((layerCount - 1) * layerGap) / 2;
      for (let L = 0; L < layerCount; L++) {
        const layerY = baseY + L * layerGap + (seededRandom() - 0.5) * 5 * s,
          layerOpacity = 0.65 + seededRandom() * 0.35;
        const puffsInLayer = Math.max(
            3,
            Math.round((13 + Math.floor(seededRandom() * 4)) * quality),
          ),
          stepX = layerSpan / (puffsInLayer - 1);
        for (let i = 0; i < puffsInLayer; i++) {
          const x =
            -layerSpan / 2 + i * stepX + (seededRandom() - 0.5) * stepX * 0.4;
          const taper =
            1 - Math.pow(Math.abs(x) / (layerSpan / 2 + 1), 1.6) * 0.45;
          const rad = (15 + seededRandom() * 9) * s * taper;
          puffs.push({
            offsetX: x,
            offsetY: layerY + (seededRandom() - 0.5) * 4 * s,
            rad,
            shade: (0.5 + seededRandom() * 0.3) * layerOpacity,
            softness: 0.5 + seededRandom() * 0.25,
            squash: 0.5 + seededRandom() * 0.2,
            rotation: (seededRandom() - 0.5) * 0.2,
            depth: seededRandom(),
          });
        }
      }
    }
    puffs.sort((a, b) => a.depth - b.depth);
    return puffs;
  }
  static _seededRandom(seed) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }
}

export function shouldSkipFrame(card, timestamp) {
  const targetFps = Math.max(15, card._perfFps || 30);
  const targetInterval = 1000 / targetFps;
  const deltaTime = timestamp - card._lastFrameTime;
  if (deltaTime < targetInterval * 0.85) return true;
  card._lastFrameTime = timestamp;
  card._frameScale = Math.max(0.25, Math.min(3.0, deltaTime / targetInterval));
  return false;
}

export function advanceWindAndPulse(card) {
  const p = card._params;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  card._gustPhase += 0.012 * animSpeed;
  card._microGustPhase += 0.03 * animSpeed;
  card._windGust =
    Math.sin(card._gustPhase) * 0.35 +
    Math.sin(card._gustPhase * 2.1) * 0.15 +
    Math.sin(card._microGustPhase) * 0.08;
  card._sunPulsePhase += 0.008 * animSpeed;
  return ((p.wind || 0.1) + card._windGust) * (1 + card._windSpeed);
}

export function drawClouds(card, ctx, cloudList, w, h, effectiveWind) {
  if (cloudList.length === 0) return;
  const fadeOpacity = card._layerFadeProgress.clouds;
  if (fadeOpacity <= 0) return;
  if (!card._renderState) return;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  const yLift = h * 0.06;
  ctx.globalAlpha = fadeOpacity;
  for (let i = 0; i < cloudList.length; i++) {
    const cloud = cloudList[i];
    const depthFactor = 1 + cloud.layer * 0.2;
    cloud.x += cloud.speed * effectiveWind * depthFactor * animSpeed;
    if (cloud.x > w + 280) cloud.x = -280;
    if (cloud.x < -280) cloud.x = w + 280;
    cloud.breathPhase += cloud.breathSpeed * animSpeed;
    if (!cloud._bakedCanvas) continue;
    const breathScale = 1 + Math.sin(cloud.breathPhase) * 0.022;
    const drawScale = cloud.scale * breathScale;
    const yDrift = Math.sin(cloud.breathPhase * 2.4) * 3.5;
    const destX = cloud.x + cloud._bakeOffX * drawScale;
    const destY = cloud.y - yLift + yDrift + cloud._bakeOffY * drawScale;
    const destW = cloud._bakeLogicalW * drawScale;
    const destH = cloud._bakeLogicalH * drawScale;
    if (destX + destW < 0 || destX > w || destY + destH < 0 || destY > h)
      continue;
    ctx.drawImage(
      cloud._bakedCanvas,
      cloud._atlasX,
      cloud._atlasY,
      cloud._atlasW,
      cloud._atlasH,
      destX,
      destY,
      destW,
      destH,
    );
  }
  ctx.globalAlpha = 1;
}

export function drawWindVapor(card, ctx, w, h, effectiveWind) {
  const fadeOpacity = card._layerFadeProgress.effects;
  if (fadeOpacity <= 0) return;
  if (!card._vaporTex) return;
  const p = card._params;
  const windKmh = card._windKmh || 0;
  const dpr = card._cachedDimensions.dpr;
  const windNorm = Math.min(1.0, Math.max(0, windKmh / 50));
  const windIntensity = windNorm * windNorm;
  const isWindy = p.windVapor === true;
  const pool = card._windVapor.length;
  let activeCount, vaporOp, baseHStretch, speedMul;
  if (isWindy) {
    activeCount = pool;
    vaporOp = 1.0;
    baseHStretch = 1.2 + 0.8 * windIntensity;
    speedMul = 0.12 + 0.35 * windIntensity;
  } else if (windKmh >= 15) {
    activeCount = Math.round(pool * 0.75);
    vaporOp = 0.9;
    baseHStretch = 1.0 + 0.4 * windIntensity;
    speedMul = 0.06 + 0.18 * windIntensity;
  } else {
    activeCount = Math.round(pool * 0.58);
    vaporOp = 0.92;
    baseHStretch = 1.0;
    speedMul = 0.03;
  }
  if (card._isDarkDayImmersive) {
    activeCount = Math.max(activeCount, Math.round(pool * 0.58));
    vaporOp = Math.max(vaporOp, 1.05);
  }
  const len = Math.min(pool, activeCount);
  if (len <= 0) return;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  const gustVal = card._windGust * windIntensity;
  const isDark = card._isThemeDark;
  const rotFade = isWindy
    ? 0
    : windKmh >= 15
      ? Math.max(0, 1 - windIntensity * 2.0)
      : 1.0;
  const windThin = 1.0 - windIntensity * 0.25;
  const shear = windIntensity * 0.12;
  ctx.globalCompositeOperation = isDark ? "screen" : "source-over";
  for (let i = 0; i < len; i++) {
    const v = card._windVapor[i];
    v.phase += v.phaseSpeed * Math.max(speedMul, 0.04) * animSpeed;
    const gustBoost = Math.max(0, gustVal) * v.gustWeight * 1.2;
    const baseVelocity = v.speed * speedMul + effectiveWind * speedMul;
    v.x +=
      (baseVelocity + gustBoost) * (1 + card._windSpeed * 0.15) * animSpeed;
    const undulation = Math.sin(v.phase) * v.drift;
    if (v.x > w + v.w) v.x = -v.w;
    if (v.x < -v.w * 1.5) v.x = w + v.w;
    const tierOp = isDark ? 0.28 + v.tier * 0.24 : 0.45 + v.tier * 0.28;
    const depthFade = 0.4 + (v.depthNorm || 0.5) * 0.6;
    const gustOpBump = Math.max(0, gustVal) * 0.15;
    const hStretch = baseHStretch + Math.max(0, gustVal) * 0.25;
    const drawW = v.w * hStretch;
    const drawH = Math.min(10, v.w * v.squash * windThin);
    ctx.globalAlpha = Math.min(
      1.0,
      (tierOp + gustOpBump) *
        depthFade *
        fadeOpacity *
        vaporOp *
        (isDark ? 0.85 : 1),
    );
    const rot = v.baseRotation * rotFade + Math.sin(v.phase * 0.7) * 0.02;
    const curve = v.curvature || 0;
    const sh = shear * (v.tier * 0.5 + 0.5) + curve;
    ctx.setTransform(
      dpr,
      sh * dpr,
      0,
      dpr,
      v.x * dpr,
      (v.y + undulation) * dpr,
    );
    ctx.rotate(rot);
    if (v.taperDir < 0) ctx.scale(-1, 1);
    ctx.drawImage(card._vaporTex, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

export function drawAurora(card, ctx, w) {
  if (!card._aurora) return;
  const fadeOpacity = card._layerFadeProgress.effects;
  card._aurora.phase += 0.006 * card._animationSpeed * (card._frameScale || 1);
  ctx.save();
  ctx.globalCompositeOperation = card._isThemeDark ? "lighter" : "source-over";
  ctx.globalAlpha = fadeOpacity;
  const waves = card._aurora.waves;
  const waveLen = waves.length;
  for (let wi = 0; wi < waveLen; wi++) {
    const wave = waves[wi];
    if (!wave._g) {
      const g = ctx.createLinearGradient(0, wave.y - 20, 0, wave.y + 50);
      g.addColorStop(0, "rgba(0, 0, 0, 0)");
      g.addColorStop(0.3, wave.color);
      g.addColorStop(0.6, wave.color.replace(/[\d.]+\)$/, "0.1)"));
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      wave._g = g;
    }
    ctx.fillStyle = wave._g;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const y =
        wave.y +
        Math.sin(
          x * wave.wavelength +
            card._aurora.phase * wave.speed * 100 +
            wave.offset,
        ) *
          wave.amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, wave.y + 60);
    ctx.lineTo(0, wave.y + 60);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function drawFog(card, ctx, w) {
  const fadeOpacity = card._layerFadeProgress.effects;
  const len = card._fogBanks.length;
  const dpr = card._cachedDimensions.dpr;
  if (fadeOpacity <= 0) return;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  for (let i = 0; i < len; i++) {
    const f = card._fogBanks[i];
    f.x += f.speed * animSpeed;
    f.phase += 0.008 * animSpeed;
    if (f.x > w + f.w / 2) f.x = -f.w / 2;
    if (f.x < -f.w / 2) f.x = w + f.w / 2;
    const undulation = Math.sin(f.phase) * 5;
    if (!f._g) {
      const color = card._isLightBackground
        ? "190,200,215"
        : card._isTimeNight
          ? "85,90,105"
          : "72,81,95";
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, f.w / 2);
      g.addColorStop(0, `rgba(${color},1)`);
      g.addColorStop(0.5, `rgba(${color},0.6)`);
      g.addColorStop(1, `rgba(${color},0)`);
      f._g = g;
      f._baseOp =
        f.opacity * (1 + f.layer * 0.2) * (card._isLightBackground ? 0.6 : 1.0);
    }
    const vSquash = 0.1 + f.layer * 0.18;
    ctx.scale(1, vSquash);
    const drawY = (f.y + undulation) / vSquash;
    ctx.globalAlpha = f._baseOp * fadeOpacity;
    ctx.translate(f.x, drawY);
    ctx.fillStyle = f._g;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.w / 2, f.h, 0, 0, TWO_PI);
    ctx.fill();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ctx.globalAlpha = 1;
}

export function drawRain(card, ctx, w, h, effectiveWind) {
  const fadeOpacity = card._layerFadeProgress.precipitation;
  if (fadeOpacity <= 0) return;
  const isDay = card._isLightBackground;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  const len = card._rain.length;
  const dpr = card._cachedDimensions.dpr;
  if (!card._rainTex) return;
  for (let i = 0; i < len; i++) {
    const pt = card._rain[i];
    pt.turbulence += 0.025 * animSpeed;
    const turbX = Math.sin(pt.turbulence) * 0.4;
    const speedFactor = (1 + card._windSpeed * 0.25) * (pt.z * 0.8 + 0.2);
    const moveX = (effectiveWind * 1.8 + turbX) * (pt.z * 0.65 + 0.35);
    const moveY = pt.speedY * speedFactor;
    pt.x += moveX * animSpeed;
    pt.y += moveY * animSpeed;
    if (pt.y > h + 10) {
      pt.y = -40 - Math.random() * 20;
      pt.x = Math.random() * w;
    }
    if (pt.x > w + 20) pt.x = -20;
    else if (pt.x < -20) pt.x = w + 20;
    const baseOp = isDay ? 0.75 : 0.6;
    const finalOp = pt.z * baseOp * fadeOpacity * pt.op;
    if (finalOp < 0.02) continue;
    const dropLen = pt.len * (1.0 + card._windSpeed * 0.3);
    const width = Math.max(0.6, pt.z * 1.2);
    ctx.translate(pt.x, pt.y);
    ctx.rotate(Math.atan2(moveY, moveX));
    ctx.globalAlpha = finalOp;
    ctx.drawImage(card._rainTex, -dropLen, -width / 2, dropLen, width);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ctx.globalAlpha = 1;
}

export function drawSnow(card, ctx, w, h, effectiveWind) {
  const fadeOpacity = card._layerFadeProgress.precipitation;
  if (fadeOpacity <= 0) return;
  const len = card._snow.length;
  const isLight = card._isLightBackground;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  if (!card._snowTexFg) return;
  for (let i = 0; i < len; i++) {
    const pt = card._snow[i];
    pt.wobblePhase += pt.wobbleSpeed * animSpeed;
    const wobble = Math.sin(pt.wobblePhase) * 1.5;
    pt.turbulence += 0.01 * animSpeed;
    const turbX = Math.sin(pt.turbulence) * 0.5;
    pt.y += pt.speedY * animSpeed;
    pt.x +=
      (wobble + turbX + effectiveWind * 0.8) * (pt.z * 0.65 + 0.35) * animSpeed;
    if (pt.y > h + 5) {
      pt.y = -5;
      pt.x = Math.random() * w;
    }
    if (pt.x > w + 10) pt.x = -10;
    else if (pt.x < -10) pt.x = w + 10;
    const shimmer = 0.92 + Math.sin(pt.wobblePhase * 2.5) * 0.08;
    const glimmer = 0.8 + Math.sin(pt.wobblePhase * 3) * 0.2;
    const finalOpacity = pt.op * fadeOpacity * glimmer;
    const drawSize = pt.size * shimmer;
    if (pt.z > 0.7) {
      const gMul = isLight ? 1.4 : 1.0;
      const gRad = isLight ? 0.9 : 1.5;
      const r = drawSize * gRad;
      ctx.globalAlpha = Math.min(1, finalOpacity * gMul);
      ctx.drawImage(card._snowTexFg, pt.x - r, pt.y - r, r * 2, r * 2);
    } else {
      const smallR = drawSize * 0.75;
      const alphaOp = isLight ? 1.3 : 0.8;
      ctx.globalAlpha = Math.min(1, finalOpacity * alphaOp);
      ctx.drawImage(
        card._snowTexBg,
        pt.x - smallR,
        pt.y - smallR,
        smallR * 2,
        smallR * 2,
      );
    }
  }
  ctx.globalAlpha = 1;
}

export function drawHail(card, ctx, w, h, effectiveWind) {
  const fadeOpacity = card._layerFadeProgress.precipitation;
  if (fadeOpacity <= 0) return;
  const len = card._hail.length;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  const dpr = card._cachedDimensions.dpr;
  if (!card._hailTex) return;
  for (let i = 0; i < len; i++) {
    const pt = card._hail[i];
    pt.turbulence += 0.035 * animSpeed;
    const turbX = Math.sin(pt.turbulence) * 1.2;
    pt.y += pt.speedY * (1 + card._windSpeed * 0.35) * animSpeed;
    pt.x += (effectiveWind * 2.5 + turbX) * (pt.z * 0.65 + 0.35) * animSpeed;
    pt.rotation += pt.rotationSpeed * animSpeed;
    if (pt.y > h + 10) {
      pt.y = -15 - Math.random() * 20;
      pt.x = Math.random() * w;
    }
    const baseOp = pt.z > 1.1 ? pt.op * 1.1 : pt.op * 0.75;
    ctx.globalAlpha = baseOp * fadeOpacity;
    ctx.translate(pt.x, pt.y);
    ctx.rotate(pt.rotation);
    ctx.drawImage(card._hailTex, -pt.size, -pt.size, pt.size * 2, pt.size * 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ctx.globalAlpha = 1;
}

export function renderAnimationFrame(
  card,
  bg,
  mid,
  fg,
  w,
  h,
  dpr,
  effectiveWind,
) {
  const rs = card._renderState;
  const fx = card._perfEffects;
  const fauna = card._perfFauna;

  if (fx >= 1 && rs.glow && rs.glow.drawPhase === "bg")
    card._drawCelestialGlow(bg, w, h);
  if (fx >= 1) card._drawAurora(mid, w);
  card._drawStars(bg, w, h, dpr);
  card._drawMoon(bg, w, h);
  if (fx >= 1 && card._isNight && card._isThemeDark && card._stars.length > 0)
    card._drawShootingStars(bg, w, h);
  if (fx >= 1 && card._isThemeDark) card._drawComets(bg, w, h);

  const glowActive = rs.glow;
  if (fx >= 1 && glowActive && glowActive.drawPhase === "mid-pre")
    card._drawCelestialGlow(mid, w, h);
  if (fx >= 1 && card._celestialClouds.length > 0)
    card._drawCelestialClouds(mid, w, h, effectiveWind);
  if (fx >= 1 && card._windVapor.length > 0)
    drawWindVapor(card, mid, w, h, effectiveWind);
  if (fx >= 1 && card._fogBanks.length > 0) card._drawFog(mid, w);
  drawClouds(card, mid, card._clouds, w, h, effectiveWind);
  if (fx >= 1 && glowActive && glowActive.drawPhase === "mid-post")
    card._drawCelestialGlow(mid, w, h);
  if (fauna >= 1) card._drawBirds(mid, w, h);
  drawClouds(card, mid, card._fgClouds, w, h, effectiveWind);
  if (fauna >= 2) card._drawPlanes(mid, w, h);

  card._drawLightning(fg, w, h);
  card._drawRain(fg, w, h, effectiveWind);
  card._drawHail(fg, w, h, effectiveWind);
  card._drawSnow(fg, w, h, effectiveWind);
}

export function drawCelestialClouds(card, ctx, w, h, effectiveWind) {
  const fadeOpacity = card._layerFadeProgress.clouds;
  if (fadeOpacity <= 0) return;
  const len = card._celestialClouds.length;
  const animSpeed = card._animationSpeed * (card._frameScale || 1);
  ctx.globalAlpha = fadeOpacity;
  for (let i = 0; i < len; i++) {
    const cloud = card._celestialClouds[i];
    if (!cloud._bakedCanvas) continue;
    const sunUnit = cloud._sunUnit !== undefined ? cloud._sunUnit : 1.0;
    cloud.driftPhase += 0.008 * animSpeed;
    cloud.breathPhase += cloud.breathSpeed * animSpeed;
    const driftX = Math.sin(cloud.driftPhase) * 12 * sunUnit;
    const driftY = Math.cos(cloud.driftPhase * 0.7) * 4 * sunUnit;
    cloud.x = cloud.baseX + driftX + effectiveWind * 0.3;
    cloud.y = cloud.baseY + driftY;
    const driftClamp = 60 * sunUnit;
    if (cloud.x > cloud.baseX + driftClamp) cloud.x = cloud.baseX + driftClamp;
    if (cloud.x < cloud.baseX - driftClamp) cloud.x = cloud.baseX - driftClamp;
    const breathScale = 1 + Math.sin(cloud.breathPhase) * 0.02;
    const vSquash = cloud._vSquash !== undefined ? cloud._vSquash : 0.55;
    const scaleX = cloud.scale * breathScale;
    const scaleY = cloud.scale * vSquash * breathScale;
    const drawX = cloud.x + cloud._bakeOffX * scaleX;
    const drawY = cloud.y + cloud._bakeOffY * scaleY;
    const drawW = cloud._bakeW * scaleX;
    const drawH = cloud._bakeH * scaleY;
    if (drawX + drawW < 0 || drawX > w || drawY + drawH < 0 || drawY > h)
      continue;
    ctx.drawImage(cloud._bakedCanvas, drawX, drawY, drawW, drawH);
  }
  ctx.globalAlpha = 1;
}

export function drawStars(card, ctx, w, h, dpr) {
  const starFade = card._layerFadeProgress.stars;
  const starMode = card._renderState.starMode;
  if (starFade <= 0.01 || starMode === "hidden") return;
  const len = card._stars.length;
  const isGolden = starMode === "golden";
  const immH = card._isImmersive ? h * 0.95 : 0;
  const dotR = isGolden ? 0.55 : 0.5;
  const batches = new Map();
  if (card._milkyWay) {
    ctx.globalAlpha = starFade;
    ctx.drawImage(card._milkyWay, 0, 0);
    ctx.globalAlpha = 1;
  }
  for (let i = 0; i < len; i++) {
    const s = card._stars[i];
    s.phase += s.rate * card._animationSpeed * (card._frameScale || 1);
    const twinkle =
      Math.sin(s.phase) +
      Math.sin(s.phase * 3) * 0.5 +
      Math.sin(s.phase * 0.3) * 0.25;
    const size = s.baseSize * (1 + twinkle * 0.3);
    const horizFade = immH > 0 ? 1 - Math.pow(s.y / immH, 3) : 1.0;
    const op = Math.min(
      1,
      Math.max(0, s.brightness * (1 + twinkle * 0.22) * starFade * horizFade),
    );
    if (op <= 0.05) continue;
    if (s.tier === "hero") {
      ctx.globalCompositeOperation = isGolden ? "source-over" : "lighter";
      ctx.globalAlpha = isGolden ? op * s._bodyAlphaRatio : op;
      ctx.fillStyle = s._fill;
      fillCircle(ctx, s.x, s.y, size * s._bodyR);
      if (s._haloTex) {
        ctx.globalAlpha = op;
        const scale = size / s._haloRefSize;
        const drawSize = s._haloTexSize * scale;
        ctx.drawImage(
          s._haloTex,
          s.x - drawSize * 0.5,
          s.y - drawSize * 0.5,
          drawSize,
          drawSize,
        );
      }
      const spike = size * s._spikeLen;
      ctx.globalAlpha = op * s._spikeRatio;
      ctx.strokeStyle = s._stroke;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(s.x - spike, s.y);
      ctx.lineTo(s.x + spike, s.y);
      ctx.moveTo(s.x, s.y - spike);
      ctx.lineTo(s.x, s.y + spike);
      ctx.stroke();
      if (!isGolden && s._crownLen) {
        const crown = size * s._crownLen;
        ctx.globalAlpha = op * s._crownRatio;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.phase * 0.18);
        ctx.strokeStyle = s._stroke;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let r = 0; r < 4; r++) {
          const a = (r / 4) * TWO_PI + Math.PI / 4;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * crown, Math.sin(a) * crown);
        }
        ctx.stroke();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.globalCompositeOperation = "source-over";
    } else {
      const qOp = ((op * 20 + 0.5) | 0) / 20;
      const key = s._fill + "|" + qOp;
      let batch = batches.get(key);
      if (!batch) {
        batch = { fill: s._fill, op: qOp, items: [] };
        batches.set(key, batch);
      }
      batch.items.push(s.x, s.y, size * dotR);
    }
  }
  for (const batch of batches.values()) {
    if (isGolden) ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = batch.op;
    ctx.fillStyle = batch.fill;
    ctx.beginPath();
    const items = batch.items;
    for (let j = 0; j < items.length; j += 3) {
      ctx.moveTo(items[j] + items[j + 2], items[j + 1]);
      ctx.arc(items[j], items[j + 1], items[j + 2], 0, TWO_PI);
    }
    ctx.fill();
    if (isGolden) ctx.globalCompositeOperation = "source-over";
  }
  ctx.globalAlpha = 1;
}

export function drawShootingStars(
  card,
  ctx,
  w,
  h,
  limits,
  trailCapShootingStar,
) {
  const fadeOpacity = card._layerFadeProgress.stars;
  const dpr = card._cachedDimensions.dpr;
  const isUltra = card._perfEffects >= 2;
  const trailCap = isUltra ? 36 : trailCapShootingStar;
  const frameScale = card._frameScale || 1;
  if (
    Math.random() < 0.002145 * frameScale &&
    card._shootingStars.length < limits.MAX_SHOOTING_STARS
  ) {
    let spawnX;
    if (Math.random() < 0.7) spawnX = Math.random() * (w * 0.6);
    else spawnX = w * 0.6 + Math.random() * (w * 0.4);
    const dirX = Math.random() < 0.3 ? -1 : 1;
    const bolide = Math.random() < 0.18;
    const speed = bolide
      ? 3.5 + Math.random() * 2.0
      : 5.0 + Math.random() * 5.0;
    const isInk = !card._isThemeDark;
    const colorRoll = Math.random();
    let headRgb, tailRgb;
    if (isInk) {
      headRgb = "rgb(50,55,65)";
      tailRgb = "rgb(60,65,80)";
    } else if (colorRoll < 0.55) {
      headRgb = "rgb(255,255,255)";
      tailRgb = "rgb(255,255,240)";
    } else if (colorRoll < 0.75) {
      headRgb = "rgb(255,245,210)";
      tailRgb = "rgb(255,230,180)";
    } else if (colorRoll < 0.92) {
      headRgb = "rgb(210,255,225)";
      tailRgb = "rgb(180,240,200)";
    } else {
      headRgb = "rgb(255,210,160)";
      tailRgb = "rgb(255,185,130)";
    }
    card._shootingStars.push({
      x: spawnX,
      y: Math.random() * (h * 0.5),
      vx: speed * dirX,
      vy: 2.0 + Math.random() * 2.0,
      life: 1.0,
      decay: bolide ? 0.032 : 0.045,
      size: bolide ? 2.5 + Math.random() * 1.5 : 1.5 + Math.random() * 1.5,
      _bolide: bolide,
      _headRgb: headRgb,
      _tailRgb: tailRgb,
      tailBuf: new Float32Array(trailCap * 2),
      tailHead: 0,
      tailLen: 0,
      _trailCap: trailCap,
    });
  }
  ctx.lineCap = "round";
  for (let i = card._shootingStars.length - 1; i >= 0; i--) {
    const s = card._shootingStars[i];
    const animSpeed = card._animationSpeed * frameScale;
    s.x += s.vx * animSpeed;
    s.vy += 0.045 * animSpeed;
    s.y += s.vy * animSpeed;
    s.life -= s.decay * animSpeed;
    const sCap = s._trailCap || trailCapShootingStar;
    s.tailBuf[s.tailHead * 2] = s.x;
    s.tailBuf[s.tailHead * 2 + 1] = s.y;
    s.tailHead = (s.tailHead + 1) % sCap;
    if (s.tailLen < sCap) s.tailLen++;
    if (s.life <= 0) {
      card._shootingStars.splice(i, 1);
      continue;
    }
    const opacity = s.life * fadeOpacity;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = s._headRgb;
    const flare = s._bolide && s.life < 0.15 ? 1 + (0.15 - s.life) * 8 : 1;
    const headSize = s.size * (0.3 + s.life * 0.7) * flare;
    fillCircle(ctx, s.x, s.y, headSize);
    ctx.lineWidth = headSize * 0.8;
    ctx.strokeStyle = s._tailRgb;
    const tailSegs = s.tailLen - 1;
    const tailBands = isUltra ? 8 : 4;
    for (let band = 0; band < tailBands; band++) {
      const jStart = ((band * tailSegs) / tailBands) | 0;
      const jEnd = (((band + 1) * tailSegs) / tailBands) | 0;
      if (jStart >= jEnd) continue;
      const midJ = (jStart + jEnd) * 0.5;
      ctx.globalAlpha = opacity * (1 - midJ / s.tailLen);
      ctx.beginPath();
      for (let j = jStart; j <= jEnd; j++) {
        const idx = (((s.tailHead - 1 - j) % sCap) + sCap) % sCap;
        const px = s.tailBuf[idx * 2];
        const py = s.tailBuf[idx * 2 + 1];
        if (j === jStart) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalAlpha = 1;
}

export function drawComets(card, ctx, w, h, trailCapComet) {
  const badWeather = card._renderState.isBadWeatherForComets;
  const dpr = card._cachedDimensions.dpr;
  const frameScale = card._frameScale || 1;
  if (
    card._isNight &&
    !badWeather &&
    card._comets.length === 0 &&
    Math.random() < (card._perfEffects >= 2 ? 0.0005 : 0.0002728) * frameScale
  ) {
    const startX = Math.random() < 0.5 ? -60 : w + 60;
    const dir = startX < 0 ? 1 : -1;
    const speed = 2.2 + Math.random() * 1.3;
    const isInk = !card._isThemeDark;
    const colorRoll = Math.random();
    let coreRgb, glowRgb, tailRgb;
    if (isInk) {
      coreRgb = "50,60,75";
      glowRgb = "70,85,105";
      tailRgb = "rgb(65,80,100)";
    } else if (colorRoll < 0.5) {
      coreRgb = "220,240,255";
      glowRgb = "100,200,255";
      tailRgb = "rgb(160,210,255)";
    } else if (colorRoll < 0.78) {
      coreRgb = "200,255,220";
      glowRgb = "120,220,160";
      tailRgb = "rgb(150,230,180)";
    } else {
      coreRgb = "255,240,200";
      glowRgb = "230,190,100";
      tailRgb = "rgb(240,210,150)";
    }
    card._comets.push({
      x: startX,
      y: Math.random() * (h * 0.4),
      vx: speed * dir,
      vy: speed * 0.15,
      size: 1.5 + Math.random(),
      life: 1.2,
      _coreRgb: coreRgb,
      _glowRgb: glowRgb,
      _tailRgb: tailRgb,
      tailBuf: new Float32Array(trailCapComet * 2),
      tailHead: 0,
      tailLen: 0,
    });
  }
  const fadeOpacity = card._layerFadeProgress.stars;
  if (fadeOpacity <= 0) return;
  for (let i = card._comets.length - 1; i >= 0; i--) {
    const c = card._comets[i];
    const animSpeed = card._animationSpeed * frameScale;
    c.x += c.vx * animSpeed;
    c.y += c.vy * animSpeed;
    c.life -= 0.005 * animSpeed;
    if (c.life <= 0) {
      card._comets.splice(i, 1);
      continue;
    }
    c.tailBuf[c.tailHead * 2] = c.x;
    c.tailBuf[c.tailHead * 2 + 1] = c.y;
    c.tailHead = (c.tailHead + 1) % trailCapComet;
    if (c.tailLen < trailCapComet) c.tailLen++;
    if (c.tailLen > 2) {
      const newestIdx =
        (((c.tailHead - 1) % trailCapComet) + trailCapComet) % trailCapComet;
      const oldestIdx =
        (((c.tailHead - c.tailLen) % trailCapComet) + trailCapComet) %
        trailCapComet;
      const hx = c.tailBuf[newestIdx * 2];
      const hy = c.tailBuf[newestIdx * 2 + 1];
      const tx = c.tailBuf[oldestIdx * 2];
      const ty = c.tailBuf[oldestIdx * 2 + 1];
      const currentDist = Math.sqrt((hx - tx) ** 2 + (hy - ty) ** 2);
      if (currentDist > 170) c.tailLen--;
    }
    const opacity = Math.min(1, c.life) * fadeOpacity;
    if (!c._g) {
      const r = c.size * 4;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${c._coreRgb},1)`);
      g.addColorStop(0.4, `rgba(${c._glowRgb},0.4)`);
      g.addColorStop(1, `rgba(${c._glowRgb},0)`);
      c._g = g;
    }
    ctx.globalAlpha = opacity;
    ctx.translate(c.x, c.y);
    ctx.fillStyle = c._g;
    fillCircle(ctx, 0, 0, c.size * 4);
    ctx.translate(-c.x, -c.y);
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";
    ctx.strokeStyle = c._tailRgb;
    const tailSegs = c.tailLen - 1;
    for (let band = 0; band < 8; band++) {
      const jStart = ((band * tailSegs) / 8) | 0;
      const jEnd = (((band + 1) * tailSegs) / 8) | 0;
      if (jStart >= jEnd) continue;
      const midP = ((jStart + jEnd) * 0.5) / c.tailLen;
      ctx.lineWidth = c.size * (1 - midP * 0.8);
      ctx.globalAlpha = opacity * (1 - midP) * 0.6;
      ctx.beginPath();
      for (let j = jStart; j <= jEnd; j++) {
        const idx =
          (((c.tailHead - 1 - j) % trailCapComet) + trailCapComet) %
          trailCapComet;
        const px = c.tailBuf[idx * 2];
        const py = c.tailBuf[idx * 2 + 1];
        if (j === jStart) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function drawMoon(card, ctx, w, h, moonStyleColors, moonCraters) {
  if (!card._isTimeNight) return;
  if (!card._stateInitialized || !card._renderGate.isRevealed) return;
  const fadeOpacity = card._layerFadeProgress.stars;
  if (fadeOpacity <= 0.05) return;
  const celestial = card._getCelestialPosition(w, h);
  const moonX = celestial.x;
  const moonY = celestial.y;
  const sunBaseR = card._celestialSize ? card._celestialSize / 2 : 31;
  const moonRadius = sunBaseR * 0.85;
  const moonScale = moonRadius / 18;
  const useLightColors = !card._isThemeDark;
  const rawMoonStyle = (card._config.celestial_moon_style || "").toLowerCase();
  const isColoredStyle =
    rawMoonStyle === "yellow" ||
    rawMoonStyle === "blue" ||
    rawMoonStyle === "purple" ||
    rawMoonStyle === "grey";
  const mStyleKey = isColoredStyle
    ? rawMoonStyle
    : useLightColors
      ? "blue"
      : "dark";
  ctx.save();
  if (card._moonRotationRad) {
    ctx.translate(moonX, moonY);
    ctx.rotate(card._moonRotationRad);
    ctx.translate(-moonX, -moonY);
  }
  const cloudCover = (card._params && card._params.cloud) || 0;
  const glowWeatherScale =
    cloudCover > 30 ? 0.4 : cloudCover > 20 ? 0.6 : cloudCover > 10 ? 0.8 : 1;
  const glowIntensity = 0.23 + card._moonPhaseConfig.illumination * 0.18;
  const atmScale =
    !useLightColors && (card._params && card._params.atmosphere) === "fair"
      ? 0.79
      : 1.0;
  let effectiveGlow = glowIntensity * fadeOpacity * glowWeatherScale * atmScale;
  if (useLightColors) effectiveGlow *= 0.85;
  const cacheKey = mStyleKey + (useLightColors ? "L" : "D");
  if (
    !card._moonCache ||
    card._moonCache.key !== cacheKey ||
    card._moonCache.mr !== moonRadius
  ) {
    card._moonCache = card._buildMoonCache(
      ctx,
      moonRadius,
      moonScale,
      w,
      h,
      useLightColors,
      mStyleKey,
    );
    card._moonCache.key = cacheKey;
    card._moonCache.mr = moonRadius;
  }
  const mc = card._moonCache;
  if (useLightColors) {
    ctx.globalCompositeOperation = "source-over";
    const lightGlowR = mc.glowR;
    ctx.save();
    ctx.translate(moonX, moonY);
    ctx.globalAlpha = effectiveGlow * mc.glowPeak;
    ctx.fillStyle = mc.glow;
    fillCircle(ctx, 0, 0, lightGlowR);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius + 1.5, 0, TWO_PI);
    const rsKey = moonStyleColors.ringStroke[mStyleKey] ? mStyleKey : "yellow";
    const ringCfg = moonStyleColors.ringStroke[rsKey];
    ctx.globalAlpha = ringCfg.op * fadeOpacity;
    ctx.strokeStyle = ringCfg._rgb || (ringCfg._rgb = `rgb(${ringCfg.rgb})`);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    const maxR = Math.min(
      Math.min(h, w) * 0.28 * moonScale,
      moonX,
      w - moonX,
      moonY,
      h - moonY,
    );
    if (!mc.darkGlow || mc.darkGlowR !== maxR) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
      g.addColorStop(0, "rgba(180, 200, 255, 1)");
      g.addColorStop(0.5, "rgba(165, 195, 245, 0.4)");
      g.addColorStop(1, "rgba(150, 180, 220, 0)");
      mc.darkGlow = g;
      mc.darkGlowR = maxR;
    }
    ctx.globalCompositeOperation = "screen";
    ctx.save();
    ctx.translate(moonX, moonY);
    ctx.globalAlpha = effectiveGlow;
    ctx.fillStyle = mc.darkGlow;
    fillCircle(ctx, 0, 0, maxR);
    ctx.restore();
  }
  ctx.globalCompositeOperation = "source-over";
  if (!useLightColors) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    fillCircle(ctx, moonX, moonY, moonRadius - 0.5);
    ctx.restore();
  } else {
    ctx.save();
    ctx.globalAlpha = fadeOpacity;
    ctx.fillStyle = moonStyleColors.lightDisc[mStyleKey] || "rgb(228,234,248)";
    fillCircle(ctx, moonX, moonY, moonRadius - 0.5);
    ctx.restore();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, TWO_PI);
  ctx.clip();
  const illumination = card._moonPhaseConfig.illumination;
  const direction = card._moonPhaseConfig.direction;
  if (illumination <= 0) {
    const nmFills = moonStyleColors.newMoon[mStyleKey];
    for (let fi = 0; fi < nmFills.length; fi++) {
      const fill = nmFills[fi];
      ctx.globalAlpha = fill.op * fadeOpacity;
      ctx.fillStyle = fill._rgb || (fill._rgb = `rgb(${fill.rgb})`);
      fillCircle(ctx, moonX, moonY, moonRadius);
    }
    ctx.globalAlpha = 1;
  } else if (illumination >= 1) {
    ctx.save();
    ctx.translate(moonX, moonY);
    ctx.globalAlpha = fadeOpacity * mc.fullDiscPeak;
    ctx.fillStyle = mc.fullDisc;
    fillCircle(ctx, 0, 0, moonRadius);
    ctx.restore();
  } else {
    const ds = moonStyleColors.darkSide[mStyleKey];
    ctx.globalAlpha = ds.op * fadeOpacity;
    ctx.fillStyle = ds._rgb || (ds._rgb = `rgb(${ds.rgb})`);
    fillCircle(ctx, moonX, moonY, moonRadius);
    ctx.globalAlpha = 1;
    if (!useLightColors) {
      const earthshineOp = (1 - illumination) * 0.08 * fadeOpacity;
      ctx.globalAlpha = earthshineOp;
      ctx.fillStyle = "rgb(100, 115, 145)";
      fillCircle(ctx, moonX, moonY, moonRadius);
      ctx.globalAlpha = 1;
    }
    const terminatorWidth = Math.abs(1 - illumination * 2) * moonRadius;
    const isGibbous = illumination > 0.5;
    ctx.beginPath();
    if (direction === "right") {
      ctx.arc(moonX, moonY, moonRadius, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(
        moonX,
        moonY,
        terminatorWidth,
        moonRadius,
        0,
        Math.PI / 2,
        -Math.PI / 2,
        !isGibbous,
      );
    } else {
      ctx.arc(moonX, moonY, moonRadius, Math.PI / 2, -Math.PI / 2, false);
      ctx.ellipse(
        moonX,
        moonY,
        terminatorWidth,
        moonRadius,
        0,
        -Math.PI / 2,
        Math.PI / 2,
        !isGibbous,
      );
    }
    ctx.closePath();
    ctx.save();
    ctx.translate(moonX, moonY);
    ctx.globalAlpha = fadeOpacity * mc.partDiscPeak;
    ctx.fillStyle = mc.partDisc;
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(moonX, moonY);
  ctx.globalAlpha = fadeOpacity;
  ctx.fillStyle = mc.limbDark;
  fillCircle(ctx, 0, 0, moonRadius);
  ctx.restore();
  ctx.restore();
  if (illumination > 0.05) {
    const op = fadeOpacity * Math.min(1, illumination * 4.0);
    const ms = moonScale;
    const lc = useLightColors;
    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, TWO_PI);
    ctx.clip();
    ctx.shadowOffsetX = 0.8 * ms;
    ctx.shadowOffsetY = 0.8 * ms;
    ctx.shadowBlur = 2.0 * ms;
    ctx.shadowColor = lc ? "rgba(100,110,140,0.25)" : "rgba(0,0,0,0.45)";
    ctx.globalAlpha = op * (lc ? 0.12 : 0.13);
    ctx.fillStyle = lc ? "rgb(180,190,210)" : "rgb(30,35,50)";
    for (let m = 0; m < moonCraters.maria.length; m++) {
      const c = moonCraters.maria[m];
      ctx.beginPath();
      ctx.ellipse(
        moonX + c.dx * ms,
        moonY + c.dy * ms,
        c.rx * ms,
        c.ry * ms,
        c.rot,
        0,
        TWO_PI,
      );
      ctx.fill();
    }
    ctx.globalAlpha = op * (lc ? 0.16 : 0.22);
    ctx.fillStyle = lc ? "rgb(170,180,200)" : "rgb(25,30,45)";
    for (let m = 0; m < moonCraters.mariaInner.length; m++) {
      const c = moonCraters.mariaInner[m];
      ctx.beginPath();
      ctx.ellipse(
        moonX + c.dx * ms,
        moonY + c.dy * ms,
        c.rx * ms,
        c.ry * ms,
        c.rot,
        0,
        TWO_PI,
      );
      ctx.fill();
    }
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = op * (lc ? 0.1 : 0.13);
    ctx.fillStyle = lc ? "rgb(175,185,205)" : "rgb(25,30,45)";
    for (let m = 0; m < moonCraters.detail.length; m++) {
      const c = moonCraters.detail[m];
      fillCircle(ctx, moonX + c.dx * ms, moonY + c.dy * ms, c.r * ms);
    }
    ctx.globalAlpha = op * (lc ? 0.1 : 0.12);
    ctx.fillStyle = lc ? "rgb(255,255,255)" : "rgb(200,210,230)";
    for (let m = 0; m < moonCraters.rimHighlights.length; m++) {
      const c = moonCraters.rimHighlights[m];
      fillCircle(ctx, moonX + c.dx * ms, moonY + c.dy * ms, c.r * ms);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  ctx.restore();
}

export function drawLightning(card, ctx, w, h, limits) {
  if (!(card._params && card._params.thunder)) return;
  const frameScale = card._frameScale || 1;
  const fadeOpacity = card._layerFadeProgress.effects;
  const isStandalone = card._config.card_style === "standalone";
  if (
    Math.random() < Math.min(1, 0.0072 * frameScale) &&
    card._bolts.length < limits.MAX_BOLTS
  ) {
    card._flashOpacity = 0.92;
    card._flashHold = card._isLightBackground ? 7 : 6;
    card._bolts.push(card._createBolt(w, h));
    if (Math.random() < 0.25 && card._bolts.length < limits.MAX_BOLTS)
      card._bolts.push(card._createBolt(w, h));
  }
  if (!card._isLightBackground && isStandalone) {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.18 * fadeOpacity;
    ctx.fillStyle = "rgb(0, 0, 10)";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
  if (card._flashOpacity > 0) {
    if (card._flashHold > 0) card._flashHold -= frameScale;
    else {
      card._flashOpacity *= Math.pow(
        card._isLightBackground ? 0.72 : 0.62,
        frameScale,
      );
      if (
        card._flashOpacity > 0.08 &&
        card._flashOpacity < 0.45 &&
        Math.random() < 0.12
      ) {
        card._flashOpacity = 0.5 + Math.random() * 0.25;
        card._flashHold = 2;
      }
    }
    if (isStandalone) {
      ctx.save();
      ctx.globalCompositeOperation = card._isThemeDark
        ? "screen"
        : "source-over";
      ctx.globalAlpha =
        card._flashOpacity *
        fadeOpacity *
        (card._isLightBackground ? 0.8 : 0.5);
      ctx.fillStyle = card._isLightBackground
        ? "rgb(255, 255, 255)"
        : "rgb(220, 235, 255)";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
    if (card._flashOpacity < 0.005) card._flashOpacity = 0;
  }
  if (card._bolts.length > 0) {
    ctx.save();
    ctx.globalCompositeOperation = card._isThemeDark
      ? "lighter"
      : "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = card._bolts.length - 1; i >= 0; i--) {
      const bolt = card._bolts[i];
      const segs = bolt.segments;
      const segLen = segs.length;
      ctx.beginPath();
      for (let j = 0; j < segLen; j++) {
        const seg = segs[j];
        if (!seg.branch) {
          if (seg.y === 0) ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(seg.nx, seg.ny);
        }
      }
      if (bolt.glow > 0) {
        ctx.globalAlpha = bolt.glow * fadeOpacity * 0.15;
        ctx.strokeStyle = bolt._glowStroke;
        ctx.lineWidth = 24;
        ctx.stroke();
        ctx.globalAlpha = bolt.glow * fadeOpacity * 0.3;
        ctx.lineWidth = 14;
        ctx.stroke();
      }
      ctx.globalAlpha = bolt.alpha * 0.35 * fadeOpacity;
      ctx.strokeStyle = bolt._outerStroke;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.globalAlpha = bolt.alpha * fadeOpacity;
      ctx.strokeStyle = bolt._coreStroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.globalAlpha = bolt.alpha * 0.6 * fadeOpacity;
      ctx.strokeStyle = bolt._branchStroke;
      ctx.lineWidth = 1.5;
      for (let j = 0; j < segLen; j++) {
        const seg = segs[j];
        if (seg.branch) {
          ctx.beginPath();
          ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(seg.nx, seg.ny);
          ctx.stroke();
        }
      }
      bolt.alpha -= 0.05 * frameScale;
      if (bolt.glow > 0) bolt.glow -= 0.075 * frameScale;
      if (bolt.alpha <= 0) card._bolts.splice(i, 1);
    }
    ctx.restore();
  }
}
