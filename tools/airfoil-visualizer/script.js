function nacaThickness(t, x) {
  return (
    5 *
    t *
    (0.2969 * Math.sqrt(x) -
      0.126 * x -
      0.3516 * x ** 2 +
      0.2843 * x ** 3 -
      0.1015 * x ** 4)
  );
}

function nacaCamber(m, p, x) {
  if (m === 0 || p === 0) {
    return { yc: 0, dyc: 0 };
  }
  if (x < p) {
    return {
      yc: (m / p ** 2) * (2 * p * x - x ** 2),
      dyc: ((2 * m) / p ** 2) * (p - x),
    };
  }
  return {
    yc: (m / (1 - p) ** 2) * (1 - 2 * p + 2 * p * x - x ** 2),
    dyc: ((2 * m) / (1 - p) ** 2) * (p - x),
  };
}

function computeAirfoilPoints(code, steps = 100) {
  const m = parseInt(code[0], 10) / 100;
  const p = parseInt(code[1], 10) / 10;
  const t = parseInt(code.slice(2), 10) / 100;

  const upper = [];
  const lower = [];

  for (let i = 0; i <= steps; i++) {
    // cosine spacing bunches points near the leading/trailing edges
    const beta = (i / steps) * Math.PI;
    const x = (1 - Math.cos(beta)) / 2;

    const yt = nacaThickness(t, x);
    const { yc, dyc } = nacaCamber(m, p, x);
    const theta = Math.atan(dyc);

    upper.push({ x: x - yt * Math.sin(theta), y: yc + yt * Math.cos(theta) });
    lower.push({ x: x + yt * Math.sin(theta), y: yc - yt * Math.cos(theta) });
  }

  return { upper, lower };
}

function isValidNacaCode(code) {
  return /^\d{4}$/.test(code);
}

function drawAirfoil(canvas, code) {
  const ctx = canvas.getContext("2d");
  const { upper, lower } = computeAirfoilPoints(code);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const marginX = 40;
  const marginY = 40;
  const plotWidth = canvas.width - marginX * 2;
  const plotHeight = canvas.height - marginY * 2;

  // Airfoil coordinates run x:[0,1], y roughly [-0.15, 0.15]; scale to fit,
  // preserving aspect ratio so the shape isn't distorted.
  const scale = Math.min(plotWidth, plotHeight / 0.4);
  const originX = marginX;
  const originY = canvas.height / 2;

  const toCanvas = (pt) => ({
    x: originX + pt.x * scale,
    y: originY - pt.y * scale,
  });

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  upper.forEach((pt, i) => {
    const c = toCanvas(pt);
    if (i === 0) ctx.moveTo(c.x, c.y);
    else ctx.lineTo(c.x, c.y);
  });
  for (let i = lower.length - 1; i >= 0; i--) {
    const c = toCanvas(lower[i]);
    ctx.lineTo(c.x, c.y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.globalAlpha = 0.12;
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.globalAlpha = 1;
}

const form = document.getElementById("naca-form");
const input = document.getElementById("naca-code");
const error = document.getElementById("naca-error");
const canvas = document.getElementById("airfoil-canvas");

function plotFromInput() {
  const code = input.value.trim();
  if (!isValidNacaCode(code)) {
    error.hidden = false;
    return;
  }
  error.hidden = true;
  drawAirfoil(canvas, code);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  plotFromInput();
});

// Re-plot on theme change so the stroke/fill pick up the new accent color.
document.addEventListener("toollab-theme-change", () => {
  if (isValidNacaCode(input.value.trim())) {
    plotFromInput();
  }
});

plotFromInput();
