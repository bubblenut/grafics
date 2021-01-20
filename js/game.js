var scene, camera, renderer, controls;
var centralBox, meshFloor;
var ambientLight, light, torch;
var mtlLoaderCross, objLoaderCross, mtlLoaderGrave, objLoaderGrave;



var wireframeOn = false;


var width = window.innerWidth;
var height = window.innerHeight;
// var width = 1280;
// var height = 720;
var keyboard = {};
var player = { height:1.8, speed:0.1, life:10, turnSpeed:0.02, torch:0.2 };

let vector = new THREE.Vector3(0, player.height, 0);

function init(){
    // Сцена, камера
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000);
    camera.position.set(0,player.height,-5);
    camera.lookAt(vector);


    //Делаем небо
    let skySize = 100;
    let materialArrSky = [];
    let texture_ft = new THREE.TextureLoader().load("img/battery_ft.jpg");
    let texture_bk = new THREE.TextureLoader().load("img/battery_bk.jpg");
    let texture_up = new THREE.TextureLoader().load("img/battery_up.jpg");
    let texture_dn = new THREE.TextureLoader().load("img/battery_dn.jpg");
    let texture_rt = new THREE.TextureLoader().load("img/battery_rt.jpg");
    let texture_lf = new THREE.TextureLoader().load("img/battery_lf.jpg");

    materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_ft}));
    materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_bk}));
    materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_up}));
    materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_dn}));
    materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_rt}));
    materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_lf}));

    for (let i = 0;i < 6; i++)
        materialArrSky[i].side = THREE.BackSide;

    let skyboxGeo = new THREE.BoxGeometry(skySize, skySize, skySize);
    let skybox = new THREE.Mesh(skyboxGeo, materialArrSky);
    skybox.position.y += skySize / 2;
    skybox.receiveShadow = true;
    scene.add(skybox);

    // Ставим объекты
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
    meshFloor.position.y += 0.01;
    scene.add(meshFloor);

    //Крест
    mtlLoaderCross = new THREE.MTLLoader();
    mtlLoaderCross.load("models/cross.mtl", function(materials){

        materials.preload();
        objLoaderCross = new THREE.OBJLoader();
        objLoaderCross.setMaterials(materials);

        objLoaderCross.load("models/cross.obj", function(mesh){

            mesh.traverse(function(node){
                if( node instanceof THREE.Mesh ){
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(mesh);
            mesh.position.set(-5, 0, 4);
            mesh.rotation.y = -Math.PI/4;
            mesh.scale.set(5,5,5);
            mesh.receiveShadow = true;
        });

    });

    mtlLoaderGrave = new THREE.MTLLoader();
    mtlLoaderGrave.load("models/tomb.mtl", function(materials){

        materials.preload();
        objLoaderGrave = new THREE.OBJLoader();
        objLoaderGrave.setMaterials(materials);

        objLoaderCross.load("models/tomb.obj", function(mesh){

            mesh.traverse(function(node){
                if( node instanceof THREE.Mesh ){
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(mesh);
            mesh.position.set(4, 0, 4);
            mesh.rotation.y = -Math.PI/3;
            mesh.scale.set(1.2,1.2,1.2);
            mesh.receiveShadow = true;
        });

    });




    // Освещение
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xff0000, 0.8, 18);
    light.position.set(3, 6, -3);
    light.castShadow = true;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 25;
    scene.add(light);

    torch = new THREE.PointLight(0xffffff, player.torch, 2);
    torch.position.set(0, player.height * 0.7, -5);
    torch.castShadow = true;
    torch.shadowCameraNear = 0.5;
    torch.shadowCameraFar = 5;
    scene.add(torch);

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
    torch.position.x += 0.5;

    //ААА капец, перемещене персонажа считается настолько неочевидно что я пил 5 дней после того
    //как увидел эти формулы
    if(keyboard[87]){ //W
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
        torch.position.x -= Math.sin(camera.rotation.y) * player.speed;
        torch.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[83]){ //A
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
        torch.position.x += Math.sin(camera.rotation.y) * player.speed;
        torch.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[65]){ //S
        camera.position.x -= Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
        torch.position.x -= Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        torch.position.z -= -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }
    if(keyboard[68]){ //D
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
        torch.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        torch.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    if(keyboard[37]){ // <-
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){ // ->
        camera.rotation.y += player.turnSpeed;
    }
    // if(keyboard[38]){ // -v
    //     // camera.rotation.x += Math.sin(camera.rotation.y - Math.PI/2) * player.turnSpeed;
    //     // camera.rotation.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.turnSpeed;
    //     camera.rotation.x -= Math.sin(camera.rotation.y) + player.turnSpeed;
    //     camera.rotation.x -= -Math.cos(camera.rotation.y) + player.turnSpeed;
    // }
    // if(keyboard[40]){ // -^
    //     // camera.rotation.x -= Math.sin(camera.rotation.y - Math.PI/2) * player.turnSpeed;
    //     // camera.rotation.z -= -Math.cos(camera.rotation.y - Math.PI/2) * player.turnSpeed;
    //     camera.rotation.x += Math.sin(camera.rotation.y) + player.turnSpeed;
    //     camera.rotation.x += -Math.cos(camera.rotation.y) + player.turnSpeed;
    // }
    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    renderer.render(scene, camera);
}

// function onDocumentMouseMove( event ) {
//
//     mouseX = ( event.clientX - windowHalfX ) * 10;
//     mouseY = ( event.clientY - windowHalfY ) * 10;
//
// }

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;

}
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;