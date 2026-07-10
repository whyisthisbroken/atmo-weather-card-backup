function fillCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
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
    Math.random() <
      (1.0 / 30) * card._faunaBirdDensity * (card._frameScale || 1)
  ) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    const startX = dir === 1 ? -60 : w + 60;
    const depthScale = 0.9 + Math.random() * 0.5;
    const baseSpeed = 0.9 + Math.random() * 0.5;
    const finalSpeed = baseSpeed * depthScale * dir;
    const isSingle = Math.random() < 0.3;
    const flockSize = isSingle
      ? 1
      : Math.max(
          1,
          Math.round(card._faunaBirdFlockSize + (Math.random() - 0.5) * 4),
        );
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

export function drawPlanes(
  card,
  ctx,
  w,
  h,
  contrailOffsets,
  planePath,
  trailCapPlane,
) {
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
      const ridx =
        (((plane.histHead - 1 - j) % trailCapPlane) + trailCapPlane) %
        trailCapPlane;
      plane.histBuf[ridx * 3] += windShift;
      plane.histBuf[ridx * 3 + 1] += 0.02;
    }
    if (plane.histLen > 2) {
      const baseOp = card._isThemeDark ? 0.12 : 0.23;
      const trailColor = card._isThemeDark
        ? "rgb(210,220,240)"
        : "rgb(255,255,255)";
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
            const ridx =
              (((plane.histHead - 1 - k) % trailCapPlane) + trailCapPlane) %
              trailCapPlane;
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
    ctx.strokeStyle = card._isThemeDark
      ? "rgb(125, 135, 145)"
      : "rgb(105, 110, 120)";
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
