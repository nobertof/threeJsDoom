function setInfo(value, infoId) {
  document.getElementById(infoId).innerHTML = `${value}`;
}
function getElement(infoId) {
  return document.getElementById(infoId);
}
function makeShoot({ position }) {
  const geometry = new THREE.SphereGeometry(15, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
}
function iniciar() {
  let balas = 100;
  let vida = 100;
  let abates = 0;
  const body = getElement("body_tela_game");
  setInfo(balas, 'balas');
  setInfo(vida, 'vida');
  setInfo(abates, 'abates');
  const character = document.getElementById('character');
  console.log(character)
  const scene = new THREE.Scene();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  scene.background = new THREE.TextureLoader().load('../../images/hell_sky.png')
  const walk = new THREE.AudioListener();

  camera.add(walk);

  // criando som de caminhada do boneco
  const soundWalk = new THREE.Audio(walk);

  // carregando arquivo de som
  const audioLoaderWalk = new THREE.AudioLoader();
  audioLoaderWalk.load('../../sounds/bonecoAndando.wav', function (buffer) {
    soundWalk.setBuffer(buffer);
    soundWalk.setLoop(true);
    soundWalk.setVolume(0.5);

  });
  const shoot = new THREE.AudioListener();

  camera.add(shoot);

  // criando som de caminhada do boneco
  const soundShoot = new THREE.Audio(shoot);

  // carregando arquivo de som
  const audioLoaderShoot = new THREE.AudioLoader();
  audioLoaderShoot.load('../../sounds/tiroComShortGun.ogg', function (buffer) {
    soundShoot.setBuffer(buffer);
    soundShoot.setLoop(false);
    soundShoot.setVolume(0.5);

  });
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  const chao = new THREE.TextureLoader().load('../../images/chaodoom.jpg');
  const meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshBasicMaterial({ map: chao })
  );
  const enemy = new THREE.TextureLoader().load('../../images/enemy.png');
  const meshEnemy = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3, 3, 3),
    new THREE.MeshBasicMaterial({ map: enemy, transparent: true, side: THREE.DoubleSide })
  );
  meshEnemy.position.y = 1.5
  scene.add(meshFloor);
  meshFloor.rotation.x -= Math.PI / 2;
  scene.add(meshEnemy);

  let deltaTeta = 0.0
  let angulo = 0.0
  let velocidade = 0.0
  let tiroAtual = false
  let tiroAnterior = false
  window.onkeydown = (e) => {
    console.log(e.code)
    if (e.code === "KeyW") {
      soundWalk.play();
      velocidade = 0.1
    }
    if (e.code === "KeyS") {
      soundWalk.play();
      velocidade = -0.1
    }
    if (e.code === "KeyA") {

      deltaTeta = 0.05
    }
    if (e.code === "KeyD") {
      deltaTeta = -0.05
    }
    if (e.code === "KeyE") {
      if (balas > 0) {
        // balas--;
        tiroAtual = true
      } else {
        tiroAtual = false
        alert("as balas acabaram!");
      }
    }

  }
  window.onkeyup = (e) => {
    if (e.code === "KeyW") {
      soundWalk.pause();
      velocidade = 0
    }
    if (e.code === "KeyS") {
      soundWalk.pause();
      velocidade = 0
    }
    if (e.code === "KeyA") {

      deltaTeta = 0
    }
    if (e.code === "KeyD") {
      deltaTeta = 0
    }
    if (e.code === "KeyE") {
      tiroAtual = false
    }
  }

  camera.position.z = 13;
  camera.position.y = 2;
  camera.position.x = 0;

  const animate = function () {
    angulo += deltaTeta
    if (tiroAtual && tiroAnterior != tiroAtual) {
      balas--;
      setInfo(balas, 'balas');

      soundShoot.play()
      character.src = '../../images/shortgun-shoot.png';
      character.style = "top:55vh!important";
      window.setTimeout(() => {
        character.src = '../../images/shortgun.png';
        character.style = "top:65vh!important";
        soundShoot.isPlaying = false;
        soundShoot.offset = 0;
        soundShoot.pause();
      }, 800);
      
    }

    tiroAnterior = tiroAtual;

    camera.position.z += -velocidade * Math.cos(angulo)
    camera.position.x += -velocidade * Math.sin(angulo)
    camera.lookAt(camera.position.x - Math.sin(angulo), 2, camera.position.z - Math.cos(angulo))
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

  };
  animate();
  body.appendChild(renderer.domElement);
}
document.addEventListener("DOMContentLoaded", function (event) {
  iniciar();
});
