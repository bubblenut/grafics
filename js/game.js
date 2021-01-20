var scene, camera, renderer;
var centralBox, meshFloor;
var ambientLight, light;
var mtlLoader, objLoader;

var wireframeOn = false;


var width = window.innerWidth;
var height = window.innerHeight;
var keyboard = {};
var player = { height:1.8, speed:0.1, life:10, turnSpeed:0.02 };

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000);
    camera.position.set(0,player.height,-5);
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    centralBox = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color:0xff4444, wireframe:wireframeOn})
    );
    centralBox.position.y += 1;
    centralBox.receiveShadow = true;
    centralBox.castShadow = true;
    scene.add(centralBox);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: wireframeOn})
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.load("models/zombie.mtl", function(materials){

        materials.preload();
        objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load("models/zombie.obj", function(mesh){

            mesh.traverse(function(node){
                if( node instanceof THREE.Mesh ){
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            scene.add(mesh);
            mesh.position.set(-5, 0, 4);
            mesh.rotation.y = -Math.PI/4;
        });

    });


    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(3, 6, -3);
    light.castShadow = true;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 25;
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);

    animate();
}



function animate(){
    requestAnimationFrame(animate);
    // mesh.rotation.x += 0.01;
    centralBox.rotation.y += 0.02;

    //ААА капец, перемещене персонажа считается настолько неочевидно что я пил 5 дней после того
    //как увидел эти формулы
    if(keyboard[87]){ //W
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[83]){ //A
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[65]){ //S
        camera.position.x -= Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }
    if(keyboard[68]){ //D
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    if(keyboard[37]){ // left arrow key
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){ // right arrow key
        camera.rotation.y += player.turnSpeed;
    }
    renderer.render(scene, camera);
}

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;

}
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;