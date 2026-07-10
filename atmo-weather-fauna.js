function fillCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

const MAX_BALLOONS = 2;
const MAX_AIRSHIPS = 1;
const BALLOON_COLORS = Object.freeze([
  [220, 78, 68],
  [244, 152, 48],
  [96, 174, 255],
  [88, 176, 116],
  [195, 110, 220],
]);

function isFaunaWeatherAllowed(card) {
  const p = card._params || {};
  const t = String(p.type || "").toLowerCase();
  const atm = String(p.atmosphere || "").toLowerCase();
  if (p.thunder) return false;
  if (t === "rain" || t === "hail" || t === "snow" || t === "mix" || t === "fog")
    return false;
  if (atm === "storm" || atm === "rain" || atm === "snow" || atm === "mist") return false;
  return true;
}

function createBalloon(card, w, h) {
  const leftToRight = Math.random() > 0.5;
  const depth = 0.75 + Math.random() * 0.55;
  const color = BALLOON_COLORS[(Math.random() * BALLOON_COLORS.length) | 0];
  return {
    x: leftToRight ? -70 : w + 70,
    y: h * (0.28 + Math.random() * 0.42),
    vx: (0.14 + Math.random() * 0.22) * (leftToRight ? 1 : -1),
    vy: (Math.random() - 0.5) * 0.03,
    scale: depth,
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: 0.02 + Math.random() * 0.02,
    bobPhase: Math.random() * Math.PI * 2,
    bobSpeed: 0.035 + Math.random() * 0.02,
    bodyColor: color,
    alpha: card._isThemeDark ? 0.76 : 0.82,
  };
}

function createAirship(card, w, h) {
  const leftToRight = Math.random() > 0.5;
  const depth = 0.78 + Math.random() * 0.36;
  return {
    x: leftToRight ? -180 : w + 180,
    y: h * (0.16 + Math.random() * 0.28),
    vx: (0.2 + Math.random() * 0.2) * (leftToRight ? 1 : -1),
    vy: (Math.random() - 0.5) * 0.02,
    scale: depth,
    bobPhase: Math.random() * Math.PI * 2,
    bobSpeed: 0.015 + Math.random() * 0.01,
    alpha: card._isThemeDark ? 0.58 : 0.65,
  };
}

export function drawBirds(card, ctx, w, h) {
  const birdAnimSpeed =
    card._animationSpeed * card._birdAnimationSpeed * (card._frameScale || 1);
  for (let i = card._birds.length - 1; i >= 0; i--) {
    const b = card._birds[i];
    b.x += b.vx * birdAnimSpeed;
    b.flapPhase += b.flapSpeed * birdAnimSpeed;
    b.y += (b.vy - Math.sin(b.flapPhase) * b.size * 0.04) * birdAnimSpeed;
    const isOffRight = b.vx > 0 && b.x > w + 100;
    const isOffLeft = b.vx < 0 && b.x < -100;
    if (isOffRight || isOffLeft) card._birds.splice(i, 1);
  }
  const isSevereWeather = card._renderState.isSevereWeather;
  if (
    !isSevereWeather &&
    card._birds.length === 0 &&
    Math.random() < (1.0 / 30) * card._faunaBirdDensity * (card._frameScale || 1)
  ) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    const startX = dir === 1 ? -60 : w + 60;
    const depthScale = 0.9 + Math.random() * 0.5;
    const baseSpeed = 0.9 + Math.random() * 0.5;
    const finalSpeed = baseSpeed * depthScale * dir;
    const isSingle = Math.random() < 0.3;
    const flockSize = isSingle
      ? 1
      : Math.max(1, Math.round(card._faunaBirdFlockSize + (Math.random() - 0.5) * 4));
    const startY = h * 0.2 + Math.random() * (h * 0.47);
    card._birds.push({
      x: startX,
      y: startY,
      vx: finalSpeed,
      vy: (Math.random() - 0.5) * 0.1,
      flapPhase: 0,
      flapSpeed: 0.15 + Math.random() * 0.05,
      size: 2.4 * depthScale,
    });
    if (!isSingle) {
      const formation = Math.floor(Math.random() * 3);
      const ySlope = Math.random() > 0.5 ? 1 : -1;
      for (let i = 1; i < flockSize; i++) {
        let offX = 0;
        let offY = 0;
        if (formation === 0) {
          const row = Math.floor((i + 1) / 2);
          const side = i % 2 === 0 ? 1 : -1;
          offX = -15 * row;
          offY = 8 * row * side;
        } else if (formation === 1) {
          offX = -18 * i;
          offY = 10 * i * ySlope;
        } else {
          offX = -15 * i + (Math.random() - 0.5) * 20;
          offY = (Math.random() - 0.5) * 40;
        }
        const scaledOffX = offX * depthScale;
        const scaledOffY = offY * depthScale;
        card._birds.push({
          x: startX + scaledOffX * dir,
          y: startY + scaledOffY,
          vx: finalSpeed,
          vy: (Math.random() - 0.5) * 0.05,
          flapPhase: i + Math.random(),
          flapSpeed: 0.15 + Math.random() * 0.05,
          size: (1.8 + Math.random() * 0.6) * depthScale,
        });
      }
    }
  }
  if (card._birds.length === 0) return;
  const birdColor = card._isLightBackground
    ? "rgba(40, 45, 50, 0.8)"
    : "rgba(195, 203, 212, 0.55)";
  ctx.save();
  ctx.strokeStyle = birdColor;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const widthBuckets = new Map();
  const len = card._birds.length;
  for (let i = 0; i < len; i++) {
    const b = card._birds[i];
    const envelope = Math.sin(b.flapPhase * 0.35);
    const wingOffset = Math.sin(b.flapPhase) * b.size * Math.max(0, envelope);
    const dir = b.vx > 0 ? 1 : -1;
    const lw = Math.max(0.8, b.size * 0.5);
    const qw = Math.round(lw * 4) / 4;
    let bucket = widthBuckets.get(qw);
    if (!bucket) {
      bucket = [];
      widthBuckets.set(qw, bucket);
    }
    const halfSpan = b.size / 2.4;
    bucket.push(
      b.x - b.size * dir,
      b.y + wingOffset - halfSpan,
      b.x,
      b.y,
      b.x - b.size * dir,
      b.y + wingOffset + halfSpan,
    );
  }
  for (const [lw, pts] of widthBuckets) {
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let j = 0; j < pts.length; j += 6) {
      ctx.moveTo(pts[j], pts[j + 1]);
      ctx.lineTo(pts[j + 2], pts[j + 3]);
      ctx.lineTo(pts[j + 4], pts[j + 5]);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPlanes(card, ctx, w, h, contrailOffsets, planePath, trailCapPlane) {
  const dpr = card._cachedDimensions.dpr;
  const frameScale = card._frameScale || 1;
  const animSpeed = card._animationSpeed * frameScale;
  if (
    card._planes.length === 0 &&
    Math.random() < 0.0025 * card._faunaPlaneDensity * frameScale
  ) {
    card._planes.push(card._createPlane(w, h));
  }
  for (let i = card._planes.length - 1; i >= 0; i--) {
    const plane = card._planes[i];
    const dir = plane.vx > 0 ? 1 : -1;
    if (plane._sinA === undefined) {
      plane._sinA = Math.sin(plane.climbAngle);
      plane._cosA = Math.cos(plane.climbAngle);
    }
    const sinA = plane._sinA;
    const cosA = plane._cosA;
    plane.x += plane.vx * animSpeed;
    plane.y += plane.vy * animSpeed;
    if (plane.gapTimer > 0) plane.gapTimer -= frameScale;
    else if (Math.random() < 0.005) plane.gapTimer = 8 + Math.random() * 14;
    const wi = plane.histHead;
    const dxR = plane.x - plane._lastRecX;
    const dyR = plane.y - plane._lastRecY;
    if (dxR * dxR + dyR * dyR >= 1.0) {
      plane.histBuf[wi * 3] = plane.x;
      plane.histBuf[wi * 3 + 1] = plane.y + (Math.random() - 0.5) * 1.5;
      plane.histBuf[wi * 3 + 2] = plane.gapTimer > 0 ? 1 : 0;
      plane.histHead = (wi + 1) % trailCapPlane;
      if (plane.histLen < trailCapPlane) plane.histLen++;
      plane._lastRecX = plane.x;
      plane._lastRecY = plane.y;
    }
    const windShift = (card._windSpeed || 0) * 0.15;
    for (let j = 1; j < plane.histLen; j++) {
      const ridx = (((plane.histHead - 1 - j) % trailCapPlane) + trailCapPlane) % trailCapPlane;
      plane.histBuf[ridx * 3] += windShift;
      plane.histBuf[ridx * 3 + 1] += 0.02;
    }
    if (plane.histLen > 2) {
      const baseOp = card._isThemeDark ? 0.12 : 0.23;
      const trailColor = card._isThemeDark ? "rgb(210,220,240)" : "rgb(255,255,255)";
      const histLen = plane.histLen;
      ctx.strokeStyle = trailColor;
      ctx.lineCap = "butt";
      ctx.lineJoin = "round";
      const trailBaseW = 2.5 * plane.scale;
      const trailSegs = histLen - 1;
      for (let oi = 0; oi < 2; oi++) {
        const offset = contrailOffsets[oi];
        const oX = sinA * offset * plane.scale * dir;
        const oY = cosA * offset * plane.scale;
        for (let band = 0; band < 5; band++) {
          const kStart = ((band * trailSegs) / 5) | 0;
          const kEnd = (((band + 1) * trailSegs) / 5) | 0;
          if (kStart >= kEnd) continue;
          const midP = ((kStart + kEnd) * 0.5) / histLen;
          let bandAlpha;
          if (midP < 0.05) bandAlpha = (midP / 0.05) * baseOp;
          else if (midP < 0.6) bandAlpha = baseOp * (1 - (midP - 0.05) * 0.727);
          else bandAlpha = baseOp * 0.6 * (1 - (midP - 0.6) / 0.4);
          if (bandAlpha < 0.005) continue;
          ctx.globalAlpha = bandAlpha;
          ctx.lineWidth = trailBaseW * (1 + midP * 1.2);
          ctx.beginPath();
          let drawing = false;
          let segPts = 0;
          for (let k = kStart; k <= kEnd; k++) {
            const ridx = (((plane.histHead - 1 - k) % trailCapPlane) + trailCapPlane) % trailCapPlane;
            const gap = plane.histBuf[ridx * 3 + 2];
            if (gap > 0.5) {
              if (drawing && segPts < 2) ctx.beginPath();
              drawing = false;
              segPts = 0;
            } else {
              const px = plane.histBuf[ridx * 3] + oX;
              const py = plane.histBuf[ridx * 3 + 1] + oY;
              if (!drawing) {
                ctx.moveTo(px, py);
                drawing = true;
                segPts = 0;
              } else {
                ctx.lineTo(px, py);
                segPts++;
              }
            }
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.translate(plane.x, plane.y);
    ctx.scale(plane.scale, plane.scale);
    if (plane.climbAngle > 0) ctx.rotate(-plane.climbAngle * dir);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = card._isThemeDark ? "rgb(125, 135, 145)" : "rgb(105, 110, 120)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let seg = 0; seg < planePath.length; seg++) {
      const s = planePath[seg];
      ctx.moveTo(s[0] * dir, s[1]);
      ctx.lineTo(s[2] * dir, s[3]);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    plane.blinkPhase += 0.12 * animSpeed;
    if (Math.sin(plane.blinkPhase) > 0.75) {
      ctx.globalAlpha = 1.0;
      ctx.fillStyle =
        plane.vx > 0
          ? card._isThemeDark
            ? "rgb(90, 255, 130)"
            : "rgb(50, 255, 80)"
          : card._isThemeDark
            ? "rgb(255, 100, 100)"
            : "rgb(255, 50, 50)";
      fillCircle(ctx, 0, 1, card._isThemeDark ? 1.5 : 1.8);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (plane.x < -450 || plane.x > w + 450) card._planes.splice(i, 1);
  }
  ctx.globalAlpha = 1;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
}

export function drawBalloons(card, ctx, w, h) {
  if (card._perfFauna < 1) return;
  if (!isFaunaWeatherAllowed(card)) return;
  const frameScale = card._frameScale || 1;
  const animSpeed = card._animationSpeed * frameScale;
  const density = card._faunaBalloonDensity || 1.0;
  const dayBias = card._isTimeNight ? 0.2 : 1.0;
  const spawnRate = 0.0016 * density * dayBias * frameScale;
  if (card._balloons.length < MAX_BALLOONS && Math.random() < spawnRate) {
    card._balloons.push(createBalloon(card, w, h));
  }

  for (let i = card._balloons.length - 1; i >= 0; i--) {
    const b = card._balloons[i];
    b.swayPhase += b.swaySpeed * animSpeed;
    b.bobPhase += b.bobSpeed * animSpeed;
    b.x += (b.vx + (card._windSpeed || 0) * 0.12) * animSpeed;
    b.y += (b.vy + Math.sin(b.bobPhase) * 0.03) * animSpeed;
    if (b.x < -140 || b.x > w + 140 || b.y < -120 || b.y > h + 120) {
      card._balloons.splice(i, 1);
      continue;
    }

    const bodyW = 16 * b.scale;
    const bodyH = 21 * b.scale;
    const basketW = 5.4 * b.scale;
    const basketH = 3.6 * b.scale;
    const sway = Math.sin(b.swayPhase) * 0.07;
    const rgb = b.bodyColor;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(sway);
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyW, bodyH, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = b.alpha * 0.25;
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.beginPath();
    ctx.ellipse(-bodyW * 0.3, -bodyH * 0.35, bodyW * 0.35, bodyH * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = b.alpha * 0.85;
    ctx.strokeStyle = card._isThemeDark ? "rgb(195,205,220)" : "rgb(95,100,110)";
    ctx.lineWidth = Math.max(0.8, 1.1 * b.scale);
    ctx.beginPath();
    ctx.moveTo(-bodyW * 0.35, bodyH * 0.85);
    ctx.lineTo(-basketW * 0.5, bodyH + basketH);
    ctx.moveTo(bodyW * 0.35, bodyH * 0.85);
    ctx.lineTo(basketW * 0.5, bodyH + basketH);
    ctx.stroke();

    ctx.globalAlpha = b.alpha * 0.9;
    ctx.fillStyle = card._isThemeDark ? "rgb(95,100,115)" : "rgb(135,110,85)";
    ctx.fillRect(-basketW * 0.5, bodyH + basketH, basketW, basketH);
    ctx.restore();
  }
}

export function drawAirships(card, ctx, w, h) {
  if (card._perfFauna < 2) return;
  if (!isFaunaWeatherAllowed(card)) return;
  const frameScale = card._frameScale || 1;
  const animSpeed = card._animationSpeed * frameScale;
  const density = card._faunaAirshipDensity || 1.0;
  const nightBias = card._isTimeNight ? 0.75 : 1.0;
  const spawnRate = 0.00032 * density * nightBias * frameScale;
  if (card._airships.length < MAX_AIRSHIPS && Math.random() < spawnRate) {
    card._airships.push(createAirship(card, w, h));
  }

  for (let i = card._airships.length - 1; i >= 0; i--) {
    const a = card._airships[i];
    a.bobPhase += a.bobSpeed * animSpeed;
    a.x += (a.vx + (card._windSpeed || 0) * 0.08) * animSpeed;
    a.y += (a.vy + Math.sin(a.bobPhase) * 0.02) * animSpeed;
    if (a.x < -260 || a.x > w + 260 || a.y < -160 || a.y > h + 160) {
      card._airships.splice(i, 1);
      continue;
    }

    const dir = a.vx >= 0 ? 1 : -1;
    const hullW = 56 * a.scale;
    const hullH = 16 * a.scale;
    const gondolaW = 10 * a.scale;
    const gondolaH = 4 * a.scale;
    const baseHull = card._isThemeDark ? "rgb(165,175,195)" : "rgb(188,192,198)";
    const hullShadow = card._isThemeDark ? "rgb(110,120,140)" : "rgb(132,136,144)";

    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.globalAlpha = a.alpha;

    ctx.fillStyle = baseHull;
    ctx.beginPath();
    ctx.ellipse(0, 0, hullW, hullH, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = a.alpha * 0.24;
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.beginPath();
    ctx.ellipse(-hullW * 0.28, -hullH * 0.35, hullW * 0.26, hullH * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = a.alpha * 0.9;
    ctx.fillStyle = hullShadow;
    ctx.fillRect(-hullW * 0.78 * dir, -hullH * 0.25, 9 * a.scale, 3 * a.scale);
    ctx.fillRect(-hullW * 0.78 * dir, hullH * 0.05, 9 * a.scale, 3 * a.scale);

    ctx.fillStyle = card._isThemeDark ? "rgb(95,105,120)" : "rgb(118,122,130)";
    ctx.fillRect(-gondolaW * 0.5, hullH * 0.75, gondolaW, gondolaH);

    if (Math.random() < 0.08 * frameScale) {
      ctx.globalAlpha = a.alpha;
      ctx.fillStyle = card._isThemeDark ? "rgb(240,215,120)" : "rgb(220,160,90)";
      fillCircle(ctx, hullW * 0.82 * dir, 0, 1.2 * a.scale);
    }

    ctx.restore();
  }
}
