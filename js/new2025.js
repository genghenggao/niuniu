var canvas, stage;
var sprites = [];
var offset = new createjs.Point();
var gravity = 0.0052;
var bam = null;
var music = null;

var settings = {
  min_amount: 15,
  max_amount: 250,
  min_mag: 15,
  max_mag: 25,
  min_life: 15,
  max_life: 100
};

function loadAssets() {
  manifest = [
    { src: "./media/new20251.mp3", id: "bam" },
    { src: "./media/new2025.mp3", id: "newyears" },
  ];

  loader = new createjs.LoadQueue(true);
  loader.installPlugin(createjs.Sound);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest);
}

function init() {
  img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/Mesh.png";

  img1 = new Image();
  img1.crossOrigin = "Anonymous";
  img1.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/Path.png";

  img2 = new Image();
  img2.crossOrigin = "Anonymous";
  img2.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/Bitmap1b.png";

  img3 = new Image();
  img3.crossOrigin = "Anonymous";
  img3.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/Bitmap2b.png";

  img4 = new Image();
  img4.crossOrigin = "Anonymous";
  img4.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/Bitmap6a.png";

  img4.onload = loadComplete;
}

function loadComplete() {

  canvas = document.getElementById("canvas");
  stage = new createjs.StageGL(canvas, { antialias: true });
  createjs.Touch.enable(stage);
  stage.setClearColor("#000000");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = Math.min(canvas.width, canvas.height) / 720;

  bg = new createjs.Shape();
  pathImage = new createjs.Bitmap(img1);
  title = new createjs.Bitmap(img2);
  subtitle = new createjs.Bitmap(img3);
  pathImage.compositeOperation = "screen";


  var diffX = Math.round(canvas.width / 286);
  var diffY = Math.round(canvas.height / 286);
  var _scaleX = diffX * Math.max(scale, 1) + 1;
  var _scaleY = diffY * Math.max(scale, 1) + 1;
  bg.graphics.clear().bf(img, "no-repeat", new createjs.Matrix2D(_scaleX, 0, 0, _scaleY, 0, 0)).dr(0, 0, canvas.width, canvas.height);
  bg.cache(0, 0, canvas.width, canvas.height);

  path = new createjs.Shape();
  path.graphics.beginRadialGradientFill(["#FFFFFF", "#F16C2F", "#E8682E", "#B85324", "#8C3F1B", "#662E13", "#47200D", "#2D1407", "#190B04", "#0B0502", "#020100", "#000000"], [0, 0.2, 0.212, 0.267, 0.325, 0.392, 0.459, 0.529, 0.612, 0.702, 0.812, 1], -20.7, -326.3, 0, -20.7, -326.3, 483.5).beginStroke().moveTo(-153.7, 138.6).lineTo(-153.7, -157.1).lineTo(153.7, -157.1).lineTo(153.7, 124.7).curveTo(112.6, 140.6, 69.3, 148.8).curveTo(24.9, 157.1, -20.7, 157.2).curveTo(-89, 157.2, -153.7, 138.6).closePath();
  path.cache(-350 / 2, -315.4 / 2, 348.4 * 2, 315.4 * 2);
  path.regX = -348 / 2;
  path.regY = -315 / 2;
  path.x = -150;
  path.y = 0;
  path.compositeOperation = "screen";


  logo = new createjs.Bitmap(img4);

  pathImage.scaleX = path.scaleX = 5 * Math.max(scale, 1);
  pathImage.scaleY = path.scaleY = 2 * Math.max(scale, 1);

  title.x = canvas.width - (title.image.width * scale) >> 1;
  title.y = canvas.height - (title.image.height / 1.2 * scale);
  title.compositeOperation = "screen";
  title.scaleX = title.scaleY = Math.min(scale, 1);

  logo.x = title.x + ((title.image.width * scale) - logo.image.width * scale >> 1);
  logo.y = title.y - ((logo.image.height / 1.6) * scale);
  logo.scaleX = logo.scaleY = scale;

  subtitle.x = canvas.width - (subtitle.image.width * scale) >> 1;
  subtitle.y = title.y + ((title.image.height / 2) * scale) + 10 * scale;
  subtitle.scaleX = subtitle.scaleY = scale;

  createParticle();

  glow = getSprite2();
  glow.scaleX = 5 * scale;
  glow.scaleY = .2 * scale;

  glow.cache(-100, -100 / 2, 100 * 2, 100 * 2);
  glow.alpha = 1;
  glow.x = title.x + ((title.image.width * scale) / 2) - (100 / 2) / 2;
  glow.y = title.y + ((title.image.height * scale) / 2.1);
  glow.compositeOperation = "screen";

  cont = new createjs.Container();
  particleContainer = new createjs.Container();
  var l = 40;
  for (var i = 0; i < l; i++) {
    var bmp = new createjs.Bitmap(particle.cacheCanvas);
    bmp.baseX = title.x + Math.random() * (title.image.width * scale);
    bmp.baseY = title.y + Math.random() * ((title.image.height / 2) * scale);
    bmp.vx = 0;
    bmp.vy = 0;
    bmp.regX = 43;
    bmp.regY = 43;
    createjs.Tween.get(bmp, { loop: -1, bounce: true }).to({ scaleX: 0, scaleY: 0 }, Math.random() * 500).wait(Math.random() * 500 | 0).to({ scaleX: 1, scaleY: 1 }, Math.random() * 500);
    bmp.set({ x: bmp.baseX, y: bmp.baseY });
    bmp.compositeOperation = "screen";
    cont.addChild(bmp);
  }

  stage.addChild(particleContainer, bg, glow, pathImage, title, cont, subtitle, logo);
  stage.updateViewport(canvas.width, canvas.height);


  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  loadAssets();

  stage.addEventListener("stagemousedown", handleMouseDown);

  handleResize();
  window.addEventListener('resize', handleResize);

  createjs.Tween.get(this, { loop: -1 }).wait(500 + Math.random() * 1000).call(makeExplosion);
}

function handleComplete(event) {
  bam = createjs.Sound.createInstance("bam");
  music = createjs.Sound.createInstance("newyears");

  music.loop = -1;
  music.volume = 0;

  music.play();
  setMusicVolume(music, 1, 400);
}

function setMusicVolume(music, volume, time) {
  createjs.Tween.get(music, { override: true }).to({ volume: volume }, time).call(function () {
  });
}

function handleMouseDown(event) {
  if (bam != null) {
    bam.play();
  }
  makeFirework(settings.min_amount + Math.random() * settings.max_amount | 0, stage.mouseX - settings.min_amount, stage.mouseY - settings.min_amount);
}

function makeExplosion() {
  var rangeX = getRange(100 * scale, canvas.width - (100 * scale));
  var rangeY = getRange(100 * scale, canvas.height >> 1);
  if (bam != null) {
    bam.play();
  }
  makeFirework(settings.min_amount + Math.random() * settings.max_amount | 0, rangeX, rangeY);
}

function getRange(min, max) {
  var scale = max - min;
  return Math.random() * scale + min;
}
var lastEvent;
function tick(event) {
  lastEvent = event;
  for (var i = sprites.length - 1; i >= 0; i--) {
    var s = sprites[i];
    s.ySpeed += gravity * (createjs.Ticker.getTime() - s.index) * s.mass;
    s.x += s.xSpeed;
    s.y += s.ySpeed;
    s.xSpeed *= 0.90;
    s.ySpeed *= 0.90;
    s.lifespan--;
    s.alpha += 0.2;
    if (s.lifespan < 0) {
      sprites.splice(i, 1);
      particleContainer.removeChild(s);
    }
  }


  stage.update(event);
}

function makeFirework(amount, x, y) {
  offset.x = x;
  offset.y = y;

  for (var i = 0; i <= amount; i++) {
    var s = new createjs.Bitmap(particle.cacheCanvas);
    var angle = Math.random() * 360;
    s.compositeOperation = "screen";
    var mag = settings.min_mag + (Math.random() * settings.max_mag) * 0.5;
    s.xSpeed = (mag * scale) * Math.cos(angle);
    s.ySpeed = (mag * scale) * Math.sin(angle);
    s.index = createjs.Ticker.getTime();
    s.mass = (.2 + Math.random() * 0.5) * 0.5;
    s.x = offset.x + ((s.xSpeed * Math.random() * 2) * 0.3);
    s.y = offset.y + ((s.ySpeed * Math.random() * 2) * 0.3);
    s.lifespan = settings.min_life + Math.random() * settings.max_life | 0;
    s.scaleX = s.scaleY = 1 * (s.mass + 0.1 + Math.random() * 0.5);
    s.alpha = 0;
    sprites.push(s);
    particleContainer.addChild(s);
  }
}

function handleResize(event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = Math.min(canvas.width, canvas.height) / 720;
  var diffX = Math.round(canvas.width / 286);
  var diffY = Math.round(canvas.height / 286);
  var _scaleX = diffX * Math.max(scale, 1) + 1;
  var _scaleY = diffY * Math.max(scale, 1) + 1;
  bg.graphics.clear().bf(img, "no-repeat", new createjs.Matrix2D(_scaleX, 0, 0, _scaleY, 0, 0)).dr(0, 0, canvas.width, canvas.height);
  bg.cache(0, 0, canvas.width, canvas.height);

  path.graphics.clear().beginRadialGradientFill(["#FFFFFF", "#F16C2F", "#E8682E", "#B85324", "#8C3F1B", "#662E13", "#47200D", "#2D1407", "#190B04", "#0B0502", "#020100", "#000000"], [0, 0.2, 0.212, 0.267, 0.325, 0.392, 0.459, 0.529, 0.612, 0.702, 0.812, 1], -20.7, -326.3, 0, -20.7, -326.3, 483.5).beginStroke().moveTo(-153.7, 138.6).lineTo(-153.7, -157.1).lineTo(153.7, -157.1).lineTo(153.7, 124.7).curveTo(112.6, 140.6, 69.3, 148.8).curveTo(24.9, 157.1, -20.7, 157.2).curveTo(-89, 157.2, -153.7, 138.6).closePath();
  path.cache(-350 / 2, -315.4 / 2, 348.4 * 2, 315.4 * 2);
  path.regX = -348 / 2;
  path.regY = -315 / 2;
  path.x = -150;
  path.y = 0;

  pathImage.scaleX = path.scaleX = 7 * Math.max(scale, 1);
  pathImage.scaleY = path.scaleY = 2 * Math.max(scale, 1);

  title.x = canvas.width - (title.image.width * scale) >> 1;
  title.y = canvas.height - (title.image.height / 1.2 * scale);
  title.scaleX = title.scaleY = Math.min(scale, 1);

  logo.x = title.x + ((title.image.width * scale) - (logo.image.width * scale) >> 1);
  logo.y = title.y - ((logo.image.height / 1.6) * scale);
  logo.scaleX = logo.scaleY = scale;

  subtitle.x = canvas.width - (subtitle.image.width * scale) >> 1;
  subtitle.y = title.y + ((title.image.height / 2) * scale) + 10 * scale;
  subtitle.scaleX = subtitle.scaleY = scale;

  glow.scaleX = 5 * scale;
  glow.scaleY = .2 * scale;

  glow.cache(-100, -100 / 2, 100 * 2, 100 * 2);
  glow.x = title.x + ((title.image.width * scale) / 2) - (100 / 2) / 2;
  glow.y = title.y + ((title.image.height * scale) / 2.1);

  var l = cont.numChildren;
  for (var i = 0; i < l; i++) {
    var bmp = cont.getChildAt(i);
    bmp.x = title.x + Math.random() * (title.image.width * scale);
    bmp.y = title.y + Math.random() * ((title.image.height / 2) * scale);
  }

  stage.updateViewport(canvas.width, canvas.height);
  stage.update(lastEvent);
}

function createParticle() {
  particle = getSprite();
  particle.width = 86;
  particle.height = 86;
  particle.cache(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
}

function getSprite() {
  var s = new createjs.Shape();
  s.graphics.rf(["#FFFFFF", "#FD863E", "#EC7D3A", "#BB632E", "#8E4B22", "#683719", "#482611", "#2D180A", "#190D06", "#0B0602", "#030101", "#000000"], [0.012, 0.149, 0.169, 0.231, 0.294, 0.365, 0.435, 0.514, 0.6, 0.694, 0.812, 1], -0.2, -0.2, 0, -0.2, -0.2, 16.5).s().dc(0, 0, 86)

  return s;
}
function getSprite2() {
  var s = new createjs.Shape();
  s.graphics.rf(["#FFFFFF", "#FD863E", "#EC7D3A", "#BB632E", "#8E4B22", "#683719", "#482611", "#2D180A", "#190D06", "#0B0602", "#030101", "#000000"], [0.012, 0.149, 0.169, 0.231, 0.294, 0.365, 0.435, 0.514, 0.6, 0.694, 0.812, 1], -0.2, -0.2, 0, -0.2, -0.2, 100).s().dc(0, 0, 100)

  return s;
}

init();