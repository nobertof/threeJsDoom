const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 45;
camera.position.y = 2;
camera.position.x = 0;
let enemyId = 0;
const mapWalls = []
let objetivo = 10
let enemys = []
let qtdInimigos = 1;
function setInfo(value, infoId) {
  document.getElementById(infoId).innerHTML = `${value}`;
}
function getElement(infoId) {
  return document.getElementById(infoId);
}
function Bala({ bala, colisionBox, id }) {
  let speed = 50;
  let clock = new THREE.Clock();
  let delta = 0;
  return {
    id,
    speed,
    clock,
    delta,
    naTela: true,
    objeto3d: bala,
    colisionBox
  }

}
function makeShoot({ player, direction }) {
  const character = document.getElementById('character');
  player.infos.balas--;
  player.audios.soundShoot.play();
  character.src = '../../images/shortgun-shoot.png';
  character.style = "top:57vh!important";
  window.setTimeout(() => {
    character.src = '../../images/shortgun.png';
    character.style = "top:65vh!important";
    player.audios.soundShoot.isPlaying = false;
    player.audios.soundShoot.offset = 0;
    player.audios.soundShoot.pause();
  }, 400);
  const bulletTexture = new THREE.TextureLoader().load('../../images/explosionBullet.png');
  let bala = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ visible: true,map:bulletTexture, transparent:true}));

  bala.position.copy(player.reticula.position);

  bala.quaternion.copy(direction);

  bala.scale.x = bala.scale.y = .5;

  let colisionBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  colisionBox.setFromObject(bala);
  player.infos.balasRenderizadas.push(Bala({ bala, colisionBox, id: player.infos.balasRenderizadas.length }));

  scene.add(bala);
}
function loadAudiosPlayer() {
  const walk = new THREE.AudioListener();

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
  // criando som de tiro do player
  const soundShoot = new THREE.Audio(shoot);

  // carregando arquivo de som
  const audioLoaderShoot = new THREE.AudioLoader();
  audioLoaderShoot.load('../../sounds/tiroComShortGun.ogg', function (buffer) {
    soundShoot.setBuffer(buffer);
    soundShoot.setLoop(false);
    soundShoot.setVolume(0.5);

  });
  return {
    soundWalk,
    soundShoot
  }
}
function player() {
  let deltaTeta = 0.0
  let angulo = 0.0
  let velocidade = 0.0
  let tiroAtual = false
  let tiroAnterior = false
  let balas = 100;
  const balasRenderizadas = [];
  let vida = 100;
  let abates = 0;
  setInfo(balas, 'balas');
  setInfo(vida, 'vida');
  setInfo(abates, 'abates');
  const audios = loadAudiosPlayer();
  let reticula = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: false, side: THREE.DoubleSide }));
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(geometry, material);

  box.position.set(...camera.position);
  scene.add(box);
  let colisionBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  colisionBox.setFromObject(box);
  reticula.position.x = camera.position.x
  reticula.position.y = camera.position.y
  reticula.position.z = camera.position.z
  scene.add(reticula)
  return {
    movements: {
      deltaTeta,
      angulo,
      velocidade,
      tiroAtual,
      tiroAnterior
    },
    infos: {
      balas,
      vida,
      abates,
      balasRenderizadas
    },
    colisionObject: {
      box,
      colisionBox,
    },
    audios,
    reticula
  }
}
function keyMovements(player) {
  window.onkeydown = (e) => {
    if (e.code === "KeyW") {
      player.audios.soundWalk.play();
      player.movements.velocidade = 0.3
    }
    if (e.code === "KeyS") {
      player.audios.soundWalk.play();
      player.movements.velocidade = -0.3
    }
    if (e.code === "KeyA") {

      player.movements.deltaTeta = 0.05
    }
    if (e.code === "KeyD") {
      player.movements.deltaTeta = -0.05
    }
    if (e.code === "KeyE") {
      if (player.infos.balas > 0) {
        player.movements.tiroAtual = true
      } else {
        player.movements.tiroAtual = false
        window.location.href='http://127.0.0.1:5500/screens/telaGameOver/index.html'
      }
    }

  }
  window.onkeyup = (e) => {
    if (e.code === "KeyW") {
      player.audios.soundWalk.pause();
      player.movements.velocidade = 0
    }
    if (e.code === "KeyS") {
      player.audios.soundWalk.pause();
      player.movements.velocidade = 0
    }
    if (e.code === "KeyA") {

      player.movements.deltaTeta = 0
    }
    if (e.code === "KeyD") {
      player.movements.deltaTeta = 0
    }
    if (e.code === "KeyE") {
      player.movements.tiroAtual = false
    }
  }
}
function checkCollision(object1, object2) {
  return object1.intersectsBox(object2)
}
function addFloor() {
  const chao = new THREE.TextureLoader().load('../../images/chaodoom.jpg');
  const meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshBasicMaterial({ map: chao })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  scene.add(meshFloor);
}

function enemy({position}){
  const textures = ['../../images/enemy.png','../../images/enemy2.png','../../images/enemy3.png','../../images/enemy4.png']
  const enemy = new THREE.TextureLoader().load(textures[Math.floor(Math.random()*4)]);

  const meshEnemy = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3, 3, 3),
    new THREE.MeshBasicMaterial({ map: enemy, transparent: true, side: THREE.DoubleSide })
  );
  const typeEnemy = Math.floor(Math.random()*3);
  meshEnemy.position.set(...position)
  //criando a caixa de colisão
  let colisionBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  colisionBox.setFromObject(meshEnemy);
  scene.add(meshEnemy);
  enemyId++;
  return {
    id:enemyId,
    object:meshEnemy,
    colisionBox,
    typeEnemy
  }
}
function addWallsLimits() {
  const wallTexture = new THREE.TextureLoader().load('../../images/parede.png');
  const wallsInfos = [
    {
      length:[100, 5, 5, 30],
      position: [0, 2, -50],
      rotation: [0, 0, 0]
    },
    {
      length:[100, 5, 5, 30],
      position: [0, 2, 50],
      rotation: [0, Math.PI, 0]
    },
    {
      length:[100, 5, 5, 30],
      position: [-50, 2, 0],
      rotation: [0, Math.PI / 2, 0]
    },
    {
      length:[100, 5, 5, 30],
      position: [50, 2, 0],
      rotation: [0, -Math.PI / 2, 0]
    },
    
  ]
  wallsInfos.map(info => {
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(...info.length),
      info.DoubleSide?new THREE.MeshBasicMaterial({ map: wallTexture, side:THREE.DoubleSide }):new THREE.MeshBasicMaterial({ map: wallTexture })
    );
    wall.position.set(...info.position);
    wall.rotation.set(...info.rotation);
    let colisionBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    colisionBox.setFromObject(wall);
    scene.add(wall);
    mapWalls.push({ object3D: wall, colisionBox })
  })

}
function iniciar() {
  setInfo(`<span>Elimine ${objetivo} monstros!<span>`, 'objetivo');
  const playerObject = player();
  const body = getElement("body_tela_game");
  scene.background = new THREE.TextureLoader().load('../../images/hell_sky.png')

  camera.add(playerObject.audios.soundWalk);
  camera.add(playerObject.audios.soundShoot);

  keyMovements(playerObject);
  addFloor();
  addWallsLimits();
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  



  const animate = function () {
    playerObject.movements.angulo += playerObject.movements.deltaTeta;
    
    window.setInterval(()=>{
      if(enemys.length==0){
        for(let i =0; i<qtdInimigos;i++){
          enemys.push(new enemy({position:[Math.random()*50, 1.5, Math.random()*50]}))
        }
        qtdInimigos++;
      }

    },2000);
    enemys.map(e=>{
      if(camera.position.x>e.object.position.x){
        e.object.position.x +=Math.random()*0.2
      }
      if(camera.position.x<e.object.position.x){
        e.object.position.x -=Math.random()*0.2
      }
      if(camera.position.y>e.object.position.y){
        e.object.position.y +=Math.random()*0.2
      }
      if(camera.position.y<e.object.position.y){
        e.object.position.y -=Math.random()*0.2
      }
      if(camera.position.z>e.object.position.z){
        e.object.position.z +=Math.random()*0.2
      }
      if(camera.position.z<e.object.position.z){
        e.object.position.z -=Math.random()*0.2
      }
      if (checkCollision(playerObject.colisionObject.colisionBox, e.colisionBox)) {
        
        if(playerObject.infos.vida==0){
          window.location.href='http://127.0.0.1:5500/screens/telaGameOver/index.html'
        }else{
          playerObject.infos.vida--;
        }
        setInfo(playerObject.infos.vida, 'vida');

      }
      e.colisionBox.copy(e.object.geometry.boundingBox).applyMatrix4(e.object.matrixWorld);
      e.object.lookAt(camera.position)
    })
    if (playerObject.movements.tiroAtual && playerObject.movements.tiroAnterior != playerObject.movements.tiroAtual) {
      makeShoot({ player: playerObject, direction: camera.quaternion });

    }
    playerObject.infos.balasRenderizadas.forEach(b => {
      b.delta = b.clock.getDelta();
      b.objeto3d.translateZ(-b.speed * b.delta); // move along the local z-axis
      b.colisionBox.copy(b.objeto3d.geometry.boundingBox).applyMatrix4(b.objeto3d.matrixWorld);

      enemys.map(e=>{
        if (checkCollision(b.colisionBox, e.colisionBox)) {
          scene.remove(e.object);
          if(e.typeEnemy===0){
            playerObject.infos.balas+=Math.ceil(Math.random()*5);
          }else if(e.typeEnemy===1){
            if(playerObject.infos.vida<100){
              playerObject.infos.vida+=Math.ceil(Math.random()*5);
              if(playerObject.infos.vida>100){
                playerObject.infos.vida=100;
              }
            }
          }else if(e.typeEnemy===2){
            playerObject.infos.balas+=Math.ceil(Math.random()*5);
            if(playerObject.infos.vida<100){
              playerObject.infos.vida+=Math.ceil(Math.random()*5);
              if(playerObject.infos.vida>100){
                playerObject.infos.vida=100;
              }
            }
          }
          objetivo--;
          if(objetivo==0){
            window.location.href='http://127.0.0.1:5500/screens/telaWin/index.html'
          }
          playerObject.infos.abates++;
          enemys = enemys.filter(e2=>e2.id!=e.id);
          setInfo(`<span>Elimine ${objetivo} monstros!<span>`, 'objetivo');
          setInfo(playerObject.infos.vida, 'vida');
          setInfo(playerObject.infos.balas, 'balas');
          setInfo(playerObject.infos.abates, 'abates');
        }
      })
      window.setTimeout(() => {
        scene.remove(b.objeto3d);
        playerObject.infos.balasRenderizadas = playerObject.infos.balasRenderizadas.filter(bala => bala.id != b.id);
      }, 1000);
    });
    

    setInfo(playerObject.infos.balas, 'balas');

    playerObject.movements.tiroAnterior = playerObject.movements.tiroAtual;

    camera.position.z += -playerObject.movements.velocidade * Math.cos(playerObject.movements.angulo)
    camera.position.x += -playerObject.movements.velocidade * Math.sin(playerObject.movements.angulo)
    playerObject.reticula.position.x = camera.position.x - Math.sin(playerObject.movements.angulo);
    playerObject.reticula.position.y = camera.position.y;
    playerObject.reticula.position.z = (camera.position.z - Math.cos(playerObject.movements.angulo));
    playerObject.reticula.lookAt(camera.position);
    camera.lookAt(camera.position.x - Math.sin(playerObject.movements.angulo), 2, camera.position.z - Math.cos(playerObject.movements.angulo))
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    playerObject.colisionObject.box.position.set(...camera.position);
    playerObject.colisionObject.colisionBox.copy(playerObject.colisionObject.box.geometry.boundingBox).applyMatrix4(playerObject.colisionObject.box.matrixWorld);
  };
  animate();
  body.appendChild(renderer.domElement);
}
document.addEventListener("DOMContentLoaded", function (event) {
  iniciar();
});
