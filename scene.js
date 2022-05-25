
function iniciar() {
  const character = document.getElementById('character');
  console.log(character)
  const scene = new THREE.Scene();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  
  
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  let uv00 = [0.0,0.0]
  let uv10 = [1.0,0.0]
  let uv01 = [0.0,1.0]
  let uv11 = [1.0,1.0]
  const points = [
    [2,0,0],
    [-2,0,0],
    [2,4,0],
    [-2,4,0],
    [2,0,4],
    [-2,0,4],
    [2,4,4],
    [-2,4,4],
  ]
  const vertices = [
    //face de trás
    {pos: points[0],uv:uv11},
    {pos: points[1],uv:uv01},
    {pos: points[2],uv:uv10},

    {pos: points[1],uv:uv01},
    {pos: points[2],uv:uv10},
    {pos: points[3],uv:uv00},
    //face da direita
    {pos: points[0],uv:uv11},
    {pos: points[4],uv:uv01},
    {pos: points[6],uv:uv10},

    {pos: points[0],uv:uv01},
    {pos: points[2],uv:uv10},
    {pos: points[6],uv:uv00},
    //face de esquerda
    {pos: points[1],uv:uv11},
    {pos: points[5],uv:uv01},
    {pos: points[3],uv:uv10},

    {pos: points[5],uv:uv01},
    {pos: points[3],uv:uv10},
    {pos: points[7],uv:uv00},
    //face de baixo
    {pos: points[4],uv:uv11},
    {pos: points[5],uv:uv01},
    {pos: points[0],uv:uv10},

    {pos: points[5],uv:uv01},
    {pos: points[0],uv:uv10},
    {pos: points[1],uv:uv00},
    // //face de cima
    {pos: points[6],uv:uv11},
    {pos: points[7],uv:uv01},
    {pos: points[2],uv:uv10},

    {pos: points[7],uv:uv01},
    {pos: points[2],uv:uv10},
    {pos: points[3],uv:uv00},
    // //face da frente
    {pos: points[4],uv:uv11},
    {pos: points[5],uv:uv01},
    {pos: points[6],uv:uv10},

    {pos: points[5],uv:uv01},
    {pos: points[6],uv:uv10},
    {pos: points[7],uv:uv00},
    
  ];
  const positions = [];
  const uvs = [];
  for (const vertex of vertices) {
    positions.push(...vertex.pos);
    uvs.push(...vertex.uv);
  }
  const positionNumComponents = 3;
  const uvNumComponents = 2;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array(positions), positionNumComponents ));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents) );
  const texture = new THREE.TextureLoader().load( 'images/textura3.png' );
  
  const material = new THREE.MeshBasicMaterial({
    map:texture,
    side:THREE.DoubleSide
  });
  let deltaTeta = 0.0
  let angulo = 0.0
  let velocidade = 0.0
  window.onkeydown = (e)=>{
    console.log(e.code)
    if(e.code==="KeyW"){
      velocidade = 0.1
    }
    if(e.code==="KeyS"){
      velocidade = -0.1
    }
    if(e.code==="KeyA"){
      deltaTeta = 0.05
    }
    if(e.code==="KeyD"){
      deltaTeta = -0.05
    }
    if(e.code==="KeyD"){
      deltaTeta = -0.05
    }
    if(e.code==="KeyE"){
      character.src = './images/shortgun-shoot.png';
      character.style = "top:620px!important";
    }
    
  }
  window.onkeyup = (e)=>{
    if(e.code==="KeyW"){
      velocidade = 0
    }
    if(e.code==="KeyS"){
      velocidade = 0
    }
    if(e.code==="KeyA"){
      deltaTeta = 0
    }
    if(e.code==="KeyD"){
      deltaTeta = 0
    }
    if(e.code==="KeyE"){
      character.src = './images/shortgun.png';
      character.style = "top:710px!important";
    }
  }
  const cloud = new THREE.Mesh(geometry, material);
  const cloud2 = new THREE.Mesh(geometry, material);
  
  scene.add(cloud);
  scene.add(cloud2);
  camera.position.z = 13;
  camera.position.y = 2;
  camera.position.x = 0;
  cloud2.position.x = 3;
  
  const animate = function () {
    angulo+=deltaTeta
    //cloud.position.z += -velocidade*Math.cos(angulo)
    //cloud.position.x += -velocidade*Math.sin(angulo)
    camera.position.z += -velocidade*Math.cos(angulo)
    camera.position.x += -velocidade*Math.sin(angulo)
    camera.lookAt(camera.position.x -Math.sin(angulo),2,camera.position.z-Math.cos(angulo))
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

  };
  animate();
  document.body.appendChild(renderer.domElement);
}
document.addEventListener("DOMContentLoaded", function(event) {
  iniciar();
});
