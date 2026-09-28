function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
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
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

const colorInput = document.getElementById("color-input");
const hexValue = document.getElementById("hex-value");
const rgbValue = document.getElementById("rgb-value");
const hslValue = document.getElementById("hsl-value");
const palette = document.getElementById("palette");

function render() {
  const hex = colorInput.value;
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  hexValue.value = hex;
  rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  palette.innerHTML = "";
  const lightnessSteps = [85, 70, 55, hsl.l, 40, 25, 10];
  for (const l of lightnessSteps) {
    const swatchRgb = hslToRgb(hsl.h, hsl.s, l);
    const swatchHex = rgbToHex(swatchRgb.r, swatchRgb.g, swatchRgb.b);

    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.style.background = swatchHex;
    button.setAttribute("aria-label", `Copy ${swatchHex}`);
    button.title = swatchHex;

    const label = document.createElement("span");
    label.className = "swatch__label";
    label.textContent = swatchHex;
    button.append(label);

    button.addEventListener("click", () => copyText(swatchHex, label));

    li.append(button);
    palette.append(li);
  }
}

function copyText(text, triggerEl) {
  navigator.clipboard?.writeText(text).catch(() => {});
  if (!triggerEl) return;
  const original = triggerEl.textContent;
  triggerEl.textContent = "Copied!";
  setTimeout(() => {
    triggerEl.textContent = original;
  }, 1000);
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copyTarget);
    copyText(target.value, button);
  });
});

colorInput.addEventListener("input", render);
render();
