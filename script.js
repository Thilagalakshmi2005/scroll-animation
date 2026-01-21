const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ================= CONFIG =================
const frameCount = 240;
const images = [];
let currentFrame = 1;
let targetFrame = 1;

// ================= IMAGE PATH =================
const imagePath = (index) =>
  `image/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

// ================= RESIZE CANVAS =================
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ================= PRELOAD IMAGES =================
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = imagePath(i);
  images.push(img);
}

// ================= DRAW IMAGE (COVER) =================
function drawImageCover(img) {
  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = img.width / img.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imageRatio > canvasRatio) {
    drawHeight = canvas.height;
    drawWidth = img.width * (canvas.height / img.height);
    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = canvas.width;
    drawHeight = img.height * (canvas.width / img.width);
    offsetX = 0;
    offsetY = (canvas.height - drawHeight) / 2;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// ================= SCROLL → FRAME =================
function updateTargetFrame() {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollProgress = scrollTop / scrollHeight;
  targetFrame = Math.min(
    frameCount,
    Math.max(1, Math.floor(scrollProgress * frameCount))
  );
}

window.addEventListener("scroll", updateTargetFrame);

// ================= SMOOTH INTERPOLATION =================
function animate() {
  currentFrame += (targetFrame - currentFrame) * 0.08;
  render();
  requestAnimationFrame(animate);
}

// ================= RENDER =================
function render() {
  const img = images[Math.round(currentFrame) - 1];
  if (img && img.complete) {
    drawImageCover(img);
  }
}

// ================= START =================
images[0].onload = () => {
  render();
  animate();
};
