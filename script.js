// v2.0 - AI Texture Generator
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// تب‌ها
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
let currentTab = 'text';

// آپلودر
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const uploadedPreview = document.getElementById('uploadedPreview');
let uploadedImage = null;

// پریست‌های واقعی
const texturePresets = {
  brick: { type: 'brick', pattern: 'grid', roughness: 0.8 },
  wood: { type: 'wood', grain: 'vertical', knots: true },
  stone: { type: 'stone', roughness: 0.9, variation: 'high' },
  metal: { type: 'metal', finish: 'brushed', rust: false },
  concrete: { type: 'concrete', roughness: 0.7, cracks: true },
  fabric: { type: 'fabric', weave: 'plain', bump: 0.3 }
};

// تحلیل متن و استخراج پارامترها
function parseTextDescription(text) {
  const lower = text.toLowerCase();
  const params = {
    baseType: 'stone',
    color: '#8b7355',
    roughness: 0.7,
    complexity: 0.5,
    scale: 1
  };

  // تشخیص نوع متریال
  if (lower.includes('brick') || lower.includes('آجر')) params.baseType = 'brick';
  else if (lower.includes('wood') || lower.includes('چوب')) params.baseType = 'wood';
  else if (lower.includes('metal') || lower.includes('فلز')) params.baseType = 'metal';
  else if (lower.includes('stone') || lower.includes('سنگ')) params.baseType = 'stone';
  else if (lower.includes('concrete') || lower.includes('بتن')) params.baseType = 'concrete';
  else if (lower.includes('fabric') || lower.includes('پارچه')) params.baseType = 'fabric';

  // تشخیص رنگ
  if (lower.includes('red')) params.color = '#a0522d';
  else if (lower.includes('blue')) params.color = '#4682b4';
  else if (lower.includes('green')) params.color = '#556b2f';
  else if (lower.includes('gray') || lower.includes('grey')) params.color = '#808080';
  else if (lower.includes('brown')) params.color = '#8b4513';
  // تشخیص ویژگی‌ها
  if (lower.includes('old') || lower.includes('weathered')) params.roughness = 0.9;
  if (lower.includes('smooth') || lower.includes('polished')) params.roughness = 0.3;
  if (lower.includes('rusty')) params.rust = true;

  return params;
}

// تولید نویز پیشرفته
function advancedNoise(x, y, seed, octaves = 4) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * Math.sin(x * frequency + seed) * Math.cos(y * frequency + seed * 1.3);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

// تولید تکسچر آجر
function generateBrickTexture(size, params) {
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  const brickWidth = size / 8;
  const brickHeight = size / 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const brickX = Math.floor(x / brickWidth);
      const brickY = Math.floor(y / brickHeight);
      const offsetX = (brickY % 2) * (brickWidth / 2);
      const localX = (x + offsetX) % size;
      const localBrickX = Math.floor(localX / brickWidth);

      const inMortar = (x % brickWidth < 4) || (y % brickHeight < 4);
      
      let r, g, b;
      if (inMortar) {
        r = 100; g = 100; b = 100;
      } else {
        const noise = advancedNoise(x * 0.02, y * 0.02, 42) * 30;
        r = Math.min(255, Math.max(0, 139 + noise));
        g = Math.min(255, Math.max(0, 115 + noise));        b = Math.min(255, Math.max(0, 85 + noise));
      }

      const i = (y * size + x) * 4;
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
      data[i+3] = 255;
    }
  }
  return imgData;
}

// تولید تکسچر چوب
function generateWoodTexture(size, params) {
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const grain = Math.sin(x * 0.05 + y * 0.01) * 20 + Math.sin(x * 0.02) * 10;
      const noise = advancedNoise(x * 0.03, y * 0.03, 123) * 15;
      
      const baseColor = 139;
      const variation = grain + noise;
      
      const r = Math.min(255, Math.max(0, baseColor + variation + 20));
      const g = Math.min(255, Math.max(0, baseColor + variation - 20));
      const b = Math.min(255, Math.max(0, baseColor + variation - 40));

      const i = (y * size + x) * 4;
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
      data[i+3] = 255;
    }
  }
  return imgData;
}

// تولید تکسچر سنگ
function generateStoneTexture(size, params) {
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const noise1 = advancedNoise(x * 0.02, y * 0.02, 456);
      const noise2 = advancedNoise(x * 0.05, y * 0.05, 789);
      const combined = (noise1 + noise2 * 0.5) * 40;
      const baseColor = 128;
      const r = Math.min(255, Math.max(0, baseColor + combined));
      const g = Math.min(255, Math.max(0, baseColor + combined - 5));
      const b = Math.min(255, Math.max(0, baseColor + combined - 10));

      const i = (y * size + x) * 4;
      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
      data[i+3] = 255;
    }
  }
  return imgData;
}

// پردازش عکس آپلود شده
function processUploadedImage(img, processType) {
  const size = Math.min(img.width, img.height, 1024);
  canvas.width = canvas.height = size;
  
  ctx.drawImage(img, 0, 0, size, size);
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  if (processType === 'seamless') {
    // الگوریتم ساده برای بدون درز کردن
    const edgeBlend = 50;
    for (let y = 0; y < edgeBlend; y++) {
      for (let x = 0; x < size; x++) {
        const blend = y / edgeBlend;
        const i = (y * size + x) * 4;
        const bottomI = ((size - 1 - y) * size + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          data[i + c] = data[i + c] * (1 - blend) + data[bottomI + c] * blend;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// تابع اصلی تولید
function generateTexture() {
  const size = parseInt(document.getElementById('textureSize').value) || 512;
  canvas.width = canvas.height = size;

  if (currentTab === 'text') {    const text = document.getElementById('textInput').value;
    if (!text) {
      alert('لطفاً یک توضیح وارد کنید');
      return;
    }
    const params = parseTextDescription(text);
    
    let imgData;
    if (params.baseType === 'brick') imgData = generateBrickTexture(size, params);
    else if (params.baseType === 'wood') imgData = generateWoodTexture(size, params);
    else imgData = generateStoneTexture(size, params);
    
    ctx.putImageData(imgData, 0, 0);
  }
  else if (currentTab === 'image') {
    if (!uploadedImage) {
      alert('لطفاً یک عکس آپلود کنید');
      return;
    }
    const processType = document.getElementById('processType').value;
    processUploadedImage(uploadedImage, processType);
  }
  else if (currentTab === 'presets') {
    // هندل شده توسط دکمه‌های پریست
  }
}

// مدیریت تب‌ها
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    currentTab = tab.dataset.tab;
  });
});

// مدیریت آپلود عکس
uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleImageFile(file);
  }
});
imageInput.addEventListener('change', (e) => {
  if (e.target.files[0]) {
    handleImageFile(e.target.files[0]);
  }
});

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage = new Image();
    uploadedImage.onload = () => {
      uploadedPreview.src = e.target.result;
      uploadedPreview.style.display = 'block';
      document.querySelector('.upload-placeholder').style.display = 'none';
    };
    uploadedImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// دکمه‌ها
document.getElementById('generateBtn').addEventListener('click', generateTexture);
document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `fibra_texture_${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

// پریست‌ها
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = btn.dataset.preset;
    const size = 512;
    canvas.width = canvas.height = size;
    
    let imgData;
    if (preset === 'brick') imgData = generateBrickTexture(size, {});
    else if (preset === 'wood') imgData = generateWoodTexture(size, {});
    else if (preset === 'stone') imgData = generateStoneTexture(size, {});
    else imgData = generateStoneTexture(size, {});
    
    ctx.putImageData(imgData, 0, 0);
  });});

// اسلایدرها
document.querySelectorAll('input[type="range"]').forEach(slider => {
  slider.addEventListener('input', (e) => {
    const span = e.target.parentElement.querySelector('span');
    if (span) {
      if (e.target.id.includes('Slider')) {
        span.textContent = `${e.target.value}%`;
      }
    }
  });
});

// مقداردهی اولیه
window.addEventListener('load', () => {
  canvas.width = canvas.height = 512;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#3b82f6';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Fibra v2.0 - آماده', 256, 260);
});
