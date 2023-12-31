let scene, renderer, camera;

const CHAR_MAP_SIZE_W = 200;
const CHAR_MAP_SIZE_H = 40;

const getRandomNum = (max = 0, min = 0) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

const render = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

const onResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

class CharactersTexture {
  constructor(characters = 'hello') {
    this.characters = characters;
    this.charLen = characters.length;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.matrix = Math.ceil(Math.sqrt(this.charLen));
    this.cellSize = 256;
    this.texture;
    this.generateTexture();
  }
  generateTexture() {
    // 一つのテクスチャに全ての文字を書く
    this.canvas.width = this.matrix * this.cellSize;
    this.canvas.height = this.canvas.width;
    this.ctx.font = '220px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.translate(this.cellSize / 2, this.cellSize / 2);
    let cnt = 0;
    for (let y = 0; y < this.matrix; y++) {
      for (let x = 0; x < this.matrix; x++) {
        if (cnt > this.charLen - 1) break;
        this.ctx.fillText(this.characters[cnt],
        this.cellSize * (x % this.matrix),
        this.cellSize * Math.floor(cnt / this.matrix));
        cnt++;
      }
    }
    const url = this.canvas.toDataURL('image/png', 1.0);
    const image = new Image();
    image.src = url;
    this.texture = new THREE.Texture(image);
    this.texture.needsUpdate = true;
    this.texture.minFilter = THREE.LinearFilter;
    // ↓for check canvas
    // const bodyEL = document.getElementById('body');
    // bodyEL.appendChild(this.canvas);
    return this.texture;
  }}


class CharactersParticles {
  constructor(charactersTexture, charactersPositionMap) {
    this.wrap = new THREE.Object3D();
    this.charactersTexture = charactersTexture;
    this.charactersPositionMap = charactersPositionMap;
    this.texture = charactersTexture.texture;
    this.num = charactersPositionMap.existPos.length;
    this.generateParticle();
  }
  generateParticle() {
    let mapX = 0;
    let mapY = 0;
    let tempIndex = 0;
    let division = 1 / this.charactersTexture.matrix;
    for (let i = 0; i < this.num; i++) {
      const geometory = new THREE.PlaneGeometry(20, 20, 1, 1);
      // uv mapping
      tempIndex = i % this.charactersTexture.charLen;
      mapX = tempIndex % this.charactersTexture.matrix;
      mapY = this.charactersTexture.matrix - 1 - Math.floor(tempIndex / this.charactersTexture.matrix);
      // Specify the UV map for the vertices of each polygon.
      // Specifies which part of the texture image is to be assigned to the vertex of the polygon.
      for (let j = 0; j < geometory.faceVertexUvs[0].length; j++) {
        const uv = geometory.faceVertexUvs[0][j];
        for (let k = 0; k < uv.length; k++) {
          const point = uv[k];
          point.x = division * (point.x + mapX);
          point.y = division * (point.y + mapY);
        }
      }
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(`hsl(${getRandomNum(360)}, 100%, 60%)`),
        map: this.texture,
        transparent: true,
        side: THREE.DoubleSide });

      const mesh = new THREE.Mesh(geometory, material);
      this.wrap.add(mesh);
    }
  }
  animation() {
    let cnt = 0;
    for (let i = 0; i < this.charactersPositionMap.canvas.height; i++) {
      for (let j = 0; j < this.charactersPositionMap.canvas.width; j++) {

        if (this.charactersPositionMap.existPosMap[i][j]) {
          // position
          const toPos = {
            x: (j - this.charactersPositionMap.canvas.width / 2) * 20,
            y: (this.charactersPositionMap.canvas.height / 2 - i) * 20,
            z: 0 };

          const radius = getRandomNum(10000, 3000);
          const theta = THREE.Math.degToRad(getRandomNum(180));
          const phi = THREE.Math.degToRad(getRandomNum(180));
          const fromPos = {
            x: Math.sin(theta) * Math.cos(phi) * radius,
            y: Math.sin(theta) * Math.sin(phi) * radius,
            z: radius };

          // rotation
          const toRotate = {
            x: 0,
            y: 0,
            z: 0 };

          const fromRotate = {
            x: 0,
            y: getRandomNum(360 * 3, 360),
            z: 0 };

          // particle setting
          const cahrParticle = this.wrap.children[cnt];
          // potision set
          TweenMax.set(cahrParticle.position, {
            x: fromPos.x,
            y: fromPos.y,
            z: fromPos.z });

          const randomPosDuration = getRandomNum(16, 2);
          TweenMax.to(cahrParticle.position, randomPosDuration, {
            x: toPos.x,
            y: toPos.y,
            z: toPos.z,
            ease: Power4.easeInOut });

          // rotation set
          TweenMax.set(cahrParticle.rotation, {
            x: fromRotate.x,
            y: fromRotate.y,
            z: fromRotate.z });

          TweenMax.to(cahrParticle.rotation, randomPosDuration * 1.1, {
            x: toRotate.x,
            y: toRotate.y,
            z: toRotate.z,
            ease: Power2.easeOut });

          cnt++;
        }
      }
    }
  }}


class CharactersPositionMap {
  constructor(characters, w, h) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.characters = characters;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#ff0000';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(characters, w / 2, h / 2);
    this.existPos = [];
    this.existPosMap = [];
    this.getExistPos();
    // ↓for check canvas
    // const bodyEL = document.getElementById('body');
    // bodyEL.appendChild(this.canvas);
  }
  getExistPos() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    let index = 0;
    for (let i = 0; i < this.canvas.height; i++) {
      this.existPosMap[i] = [];
      for (let j = 0; j < this.canvas.width; j++) {
        index = j * 4 + i * this.canvas.width * 4;
        const redColor = imageData[index];
        this.existPosMap[i][j] = redColor > 0;
        if (redColor > 0) {
          this.existPos.push(index);
        }
      }
    }
  }}


class DustParticles {
  constructor(num = 10) {
    this.num = num;
    this.wrap = new THREE.Object3D();
    for (let i = 0; i < this.num; i++) {
      const size = getRandomNum(100, 10);
      const geometory = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshLambertMaterial({
        opacity: 0.5,
        transparent: true,
        color: 0xffffff });

      const mesh = new THREE.Mesh(geometory, material);
      const radius = getRandomNum(7000, 2000);
      const theta = THREE.Math.degToRad(getRandomNum(180));
      const phi = THREE.Math.degToRad(getRandomNum(360));
      mesh.position.x = Math.sin(theta) * Math.cos(phi) * radius;
      mesh.position.y = Math.sin(theta) * Math.sin(phi) * radius;
      mesh.position.z = Math.cos(theta) * radius;
      mesh.rotation.x = getRandomNum(360);
      mesh.rotation.y = getRandomNum(360);
      mesh.rotation.z = getRandomNum(360);
      this.wrap.add(mesh);
    }
  }}


const dustParticles = new DustParticles(300);
const charactersTexture = new CharactersTexture('♥爱你♥');
const charactersPositionMap = new CharactersPositionMap('I LOVE U', CHAR_MAP_SIZE_W, CHAR_MAP_SIZE_H);
const charactersParticles = new CharactersParticles(charactersTexture, charactersPositionMap);

/* scene
--------------------------------------*/
scene = new THREE.Scene();

/* camera
--------------------------------------*/
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
// camera.position.x = -2020;
// camera.position.y = -30;
// camera.position.z = 170;
camera.position.x = 310;
camera.position.y = -90;
camera.position.z = 270;
camera.lookAt(scene.position);
scene.add(camera);

/* renderer
--------------------------------------*/
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new THREE.Color(0xfdfff3));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

/* AmbientLight
--------------------------------------*/
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

/* DirectionalLight
--------------------------------------*/
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 1000, 1000);
directionalLight.castShadow = true;
scene.add(directionalLight);

/* OrbitControls
--------------------------------------*/
const orbitControls = new THREE.OrbitControls(camera);
orbitControls.autoRotate = false;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.37;

/* dust particle
--------------------------------------*/
scene.add(dustParticles.wrap);

/* charactersParticles
--------------------------------------*/
scene.add(charactersParticles.wrap);
charactersParticles.animation();

/* resize
--------------------------------------*/
window.addEventListener('resize', onResize);

/* rendering start
--------------------------------------*/
document.getElementById('WebGL-output').appendChild(renderer.domElement);
render();