
// v1.0 - موتور تولید تکسچر Procedural Seamless
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const presetSelect = document.getElementById('preset');
const downloadBtn = document.getElementById('downloadBtn');

const presets = {
  'cosmic-rock': { baseHue: 240, rangeHue: 60, f1: 0.02, f2: 0.05, f3: 0.12, contrast: 1.4, brightness: 0.8 },
  'magic-wood':  { baseHue: 25,  rangeHue: 30, f1: 0.04, f2: 0.08, f3: 0.03, contrast: 1.2, brightness: 0.9 },
  'neon-metal':  { baseHue: 180, rangeHue: 120,f1: 0.06, f2: 0.15, f3: 0.2,  contrast: 1.8, brightness: 0.7 }
};

// نویز ریاضی با تضمین ۱۰۰٪ بدون درز
function noise(x, y, seed, freq) {
  const s = seed * 0.13;
  return Math.sin(x * freq + s) * Math.cos(y * freq + s * 1.3) +
         Math.sin((x * 2.1 + y * 0.9) * freq * 0.7 + s * 2.1) * 0.5 +
         Math.cos((y * 1.8 - x * 0.6) * freq * 1.4 + s * 0.7) * 0.3;
}

// تبدیل HSL به RGB
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// تابع اصلی تولید پیکسل‌ها
function generateTexture(targetCtx, size, seed, presetKey) {
  const p = presets[presetKey];
  const imgData = targetCtx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * Math.PI * 2;
      const ny = (y / size) * Math.PI * 2;

      let v = noise(nx, ny, seed, p.f1) * 0.5 +
              noise(nx * 2, ny * 2, seed + 10, p.f2) * 0.3 +
              noise(nx * 4, ny * 4, seed + 20, p.f3) * 0.2;

      v = (v * p.contrast + p.brightness) / 1.5;
      v = Math.max(0, Math.min(1, v));

      const hue = (p.baseHue + v * p.rangeHue) % 360;
      const [r, g, b] = hslToRgb(hue / 360, 0.65, 0.35 + v * 0.45);

      const i = (y * size + x) * 4;
      data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = 255;
    }
  }
  targetCtx.putImageData(imgData, 0, 0);
}

// پیش‌نمایش سریع (512x512)
function renderPreview() {
  canvas.width = canvas.height = 512;
  generateTexture(ctx, 512, Date.now() % 10000, presetSelect.value);
}

// دانلود با کیفیت بالا (1024x1024)
function downloadTexture() {
  downloadBtn.textContent = '⏳ در حال ساخت...';
  setTimeout(() => {
    const size = 1024;
    const tmp = document.createElement('canvas');
    tmp.width = tmp.height = size;
    const tCtx = tmp.getContext('2d');
    generateTexture(tCtx, size, Date.now() % 10000, presetSelect.value);

    const link = document.createElement('a');
    link.download = `fibra_${presetSelect.value}_${size}px.png`;
    link.href = tmp.toDataURL('image/png');
    link.click();
    tmp.remove();
    downloadBtn.textContent = 'دانلود PNG';
  }, 100);
}

// رویدادها
presetSelect.addEventListener('change', renderPreview);
downloadBtn.addEventListener('click', downloadTexture);
window.addEventListener('load', renderPreview);
