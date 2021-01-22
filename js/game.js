let scene, camera, renderer, controls, clock;
let centralBox, meshFloor, torchLookAtBox;
let ambientLight, light, torch;
let mtlLoaderCross, objLoaderCross, mtlLoaderGrave, objLoaderGrave;

const wireframeOn = false;

const width = window.innerWidth;
const height = window.innerHeight;
const keyboard = {};
let player = { height:1.8, speed:0.1, life:10, turnSpeed:0.02, torch:0.2 };

let vector = new THREE.Vector3(0, player.height, 0);

let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, width/height, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({color: "blue", wireframe: true})
    )
};

let loadingManager = null;
let RECOURCE_LOADED = false;

 //Индексация моделей
let models = {

    pine: {
        obj: "models/pine.obj",
        mtl: "models/pine.mtl",
        mesh: null
    },

    pineCrooked: {
        obj: "models/pineCrooked.obj",
        mtl: "models/pineCrooked.mtl",
        mesh: null
    },

    rocks: {
        obj: "models/rocks.obj",
        mtl: "models/rocks.mtl",
        mesh: null
    },
    grass: {
        obj: "models/grass.obj",
        mtl: "models/grass.mtl",
        mesh: null
    },
    pistol: {
        obj: "models/shotgun.obj",
        mtl: "models/shotgun.mtl",
        mesh: null
    }
};

//Индексация мешей
let meshes = {};


// ПОехали
function init(){
    // Сцена, камера
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x010a3d );
    scene.fog = new THREE.Fog( 0x010a3d, 0, 75 );

    camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000);
    camera.position.set(-15,player.height,-15);
    camera.lookAt(vector);

    clock = new THREE.Clock();

    // controls = new PointerLockControls( camera, document.body );
    //
    // const blocker = document.getElementById( 'blocker' );
    // const instructions = document.getElementById( 'instructions' );
    //
    // instructions.addEventListener( 'click', function () {
    //
    //     controls.lock();
    //
    // }, false );
    //
    // controls.addEventListener( 'lock', function () {
    //
    //     instructions.style.display = 'none';
    //     blocker.style.display = 'none';
    //
    // } );
    //
    // controls.addEventListener( 'unlock', function () {
    //
    //     blocker.style.display = 'block';
    //     instructions.style.display = '';
    //
    // } );
    // scene.add( controls.getObject() );



    loadingScreen.box.position.set(0, 0, 4.5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function(item, loaded, total){
        console.log(item, loaded, total)
    };

    loadingManager.onLoad = function(){
        console.log("All resources loaded");
        RECOURCE_LOADED = true;
        onResourcesLoaded();
    };


    //Делаем небо
    // let skySize = 100;
    // let materialArrSky = [];
    // let texture_ft = new THREE.TextureLoader().load("img/battery_ft.jpg");
    // let texture_bk = new THREE.TextureLoader().load("img/battery_bk.jpg");
    // let texture_up = new THREE.TextureLoader().load("img/battery_up.jpg");
    // let texture_dn = new THREE.TextureLoader().load("img/battery_dn.jpg");
    // let texture_rt = new THREE.TextureLoader().load("img/battery_rt.jpg");
    // let texture_lf = new THREE.TextureLoader().load("img/battery_lf.jpg");
    //
    // materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_ft}));
    // materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_bk}));
    // materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_up}));
    // materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_dn}));
    // materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_rt}));
    // materialArrSky.push(new THREE.MeshBasicMaterial({map: texture_lf}));
    //
    // for (let i = 0;i < 6; i++)
    //     materialArrSky[i].side = THREE.BackSide;
    //
    // let skyboxGeo = new THREE.BoxGeometry(skySize, skySize, skySize);
    // let skybox = new THREE.Mesh(skyboxGeo, materialArrSky);
    // skybox.position.y += skySize / 2;
    // skybox.receiveShadow = true;
    // scene.add(skybox);

    // Ставим объекты
    centralBox = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color:0xff4444, wireframe:wireframeOn})
    );
    centralBox.position.y += 1;
    centralBox.material.transparent = true;
    scene.add(centralBox);

    torchLookAtBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.1,0.1,0.1),
        new THREE.MeshPhongMaterial({color:0xff4444, opacity:0, wireframe:wireframeOn})
    );
    torchLookAtBox.position.set(0, player.height, 0);
    torchLookAtBox.material.transparent = true;
    scene.add(torchLookAtBox);

    //Пол
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshPhongMaterial({color: "green", wireframe: wireframeOn})
    );

    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;
    meshFloor.position.y += 0.01;
    scene.add(meshFloor);

    //Крест
    mtlLoaderCross = new THREE.MTLLoader(loadingManager);
    mtlLoaderCross.load("models/crossWood.mtl", function(materials){

        materials.preload();
        objLoaderCross = new THREE.OBJLoader(loadingManager);
        objLoaderCross.setMaterials(materials);

        objLoaderCross.load("models/crossWood.obj", function(mesh){

            mesh.traverse(function(node){
                if( node instanceof THREE.Mesh ){
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(mesh);
            mesh.position.set(-5, 0, 4);
            mesh.rotation.y = -Math.PI/4;
            mesh.scale.set(4,4,4);
            mesh.receiveShadow = true;
        });

    });

    mtlLoaderGrave = new THREE.MTLLoader(loadingManager);
    mtlLoaderGrave.load("models/rocksTall.mtl", function(materials){

        materials.preload();
        objLoaderGrave = new THREE.OBJLoader(loadingManager);
        objLoaderGrave.setMaterials(materials);

        objLoaderCross.load("models/rocksTall.obj", function(mesh){

            mesh.traverse(function(node){
                if( node instanceof THREE.Mesh ){
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            mesh.position.set(2.5, 0, -2);
            mesh.rotation.y = -Math.PI/4;
            mesh.scale.set(2.5,2.5,2.5);
            mesh.receiveShadow = true;
            scene.add(mesh);
        });

    });

    for( let _key in models ){
        (function(key){

            let mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function(materials){
                materials.preload();

                let objLoader = new THREE.OBJLoader(loadingManager);

                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function(mesh){

                    mesh.traverse(function(node){
                        if( node instanceof THREE.Mesh ){
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;

                });
            });

        })(_key);
    }



    // Освещение
    ambientLight = new THREE.AmbientLight(0xbdd0e4, 0.33);
    scene.add(ambientLight);
//c5cdd8
    light = new THREE.PointLight(0xff0000, 1.5, 18);
    light.position.set(3, 6, -3);
    light.castShadow = true;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 25;
    scene.add(light);

    //Даем игроку фонарик
    torch = new THREE.SpotLight( 0xffffff, 0.8, 10 );
    torch.position.set( camera.position.x, camera.position.y, camera.position.z );
    torch.castShadow = true;
    torch.shadow.mapSize.width = 5;
    torch.shadow.mapSize.height = 1.2;
    torch.shadow.camera.near = 1;
    torch.shadow.camera.far = 5;
    torch.shadow.camera.fov = 20;
    torch.target = torchLookAtBox;
    scene.add( torch );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);

    animate();
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

    // СТавим модели
function onResourcesLoaded() {
    //Лес
    meshes["pine0"] = models.pine.mesh.clone();
    meshes["pine1"] = models.pine.mesh.clone();
    meshes["pine2"] = models.pine.mesh.clone();
    meshes["pine3"] = models.pine.mesh.clone();
    meshes["pine4"] = models.pine.mesh.clone();
    meshes["pine5"] = models.pine.mesh.clone();
    meshes["pine6"] = models.pine.mesh.clone();
    meshes["pine7"] = models.pine.mesh.clone();
    meshes["pine8"] = models.pine.mesh.clone();
    meshes["pine9"] = models.pine.mesh.clone();
    meshes["pine10"] = models.pine.mesh.clone();
    meshes["pine11"] = models.pine.mesh.clone();
    meshes["pine12"] = models.pine.mesh.clone();
    meshes["pine13"] = models.pine.mesh.clone();
    meshes["pine14"] = models.pine.mesh.clone();
    meshes["pine15"] = models.pine.mesh.clone();
    meshes["pine16"] = models.pine.mesh.clone();
    meshes["pine17"] = models.pine.mesh.clone();
    meshes["pine18"] = models.pine.mesh.clone();

    meshes["pineCrooked0"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked1"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked2"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked3"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked4"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked5"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked6"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked7"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked8"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked9"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked10"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked11"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked12"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked13"] = models.pineCrooked.mesh.clone();
    meshes["pineCrooked14"] = models.pineCrooked.mesh.clone();

    meshes["rocks0"] = models.rocks.mesh.clone();
    meshes["rocks1"] = models.rocks.mesh.clone();
    meshes["rocks2"] = models.rocks.mesh.clone();
    meshes["rocks3"] = models.rocks.mesh.clone();
    meshes["rocks4"] = models.rocks.mesh.clone();
    meshes["rocks5"] = models.rocks.mesh.clone();
    meshes["rocks6"] = models.rocks.mesh.clone();
    meshes["rocks7"] = models.rocks.mesh.clone();
    meshes["rocks8"] = models.rocks.mesh.clone();
    meshes["rocks9"] = models.rocks.mesh.clone();
    meshes["rocks10"] = models.rocks.mesh.clone();
    meshes["rocks11"] = models.rocks.mesh.clone();
    meshes["rocks12"] = models.rocks.mesh.clone();
    meshes["rocks13"] = models.rocks.mesh.clone();
    meshes["rocks14"] = models.rocks.mesh.clone();
    meshes["rocks15"] = models.rocks.mesh.clone();
    meshes["rocks16"] = models.rocks.mesh.clone();
    meshes["rocks17"] = models.rocks.mesh.clone();
    meshes["rocks18"] = models.rocks.mesh.clone();
    meshes["rocks19"] = models.rocks.mesh.clone();
    meshes["rocks20"] = models.rocks.mesh.clone();
    meshes["rocks21"] = models.rocks.mesh.clone();
    meshes["rocks22"] = models.rocks.mesh.clone();
    meshes["rocks23"] = models.rocks.mesh.clone();
    meshes["rocks24"] = models.rocks.mesh.clone();
    meshes["rocks25"] = models.rocks.mesh.clone();

    meshes["grass0"] = models.grass.mesh.clone();
    meshes["grass1"] = models.grass.mesh.clone();
    meshes["grass2"] = models.grass.mesh.clone();
    meshes["grass3"] = models.grass.mesh.clone();
    meshes["grass4"] = models.grass.mesh.clone();
    meshes["grass5"] = models.grass.mesh.clone();
    meshes["grass6"] = models.grass.mesh.clone();
    meshes["grass7"] = models.grass.mesh.clone();
    meshes["grass8"] = models.grass.mesh.clone();
    meshes["grass9"] = models.grass.mesh.clone();
    meshes["grass10"] = models.grass.mesh.clone();
    meshes["grass11"] = models.grass.mesh.clone();
    meshes["grass12"] = models.grass.mesh.clone();
    meshes["grass13"] = models.grass.mesh.clone();
    meshes["grass14"] = models.grass.mesh.clone();
    meshes["grass15"] = models.grass.mesh.clone();
    meshes["grass16"] = models.grass.mesh.clone();
    meshes["grass17"] = models.grass.mesh.clone();
    meshes["grass18"] = models.grass.mesh.clone();
    meshes["grass19"] = models.grass.mesh.clone();
    meshes["grass20"] = models.grass.mesh.clone();
    meshes["grass21"] = models.grass.mesh.clone();
    meshes["grass22"] = models.grass.mesh.clone();
    meshes["grass23"] = models.grass.mesh.clone();
    meshes["grass24"] = models.grass.mesh.clone();
    meshes["grass25"] = models.grass.mesh.clone();
    meshes["grass26"] = models.grass.mesh.clone();
    meshes["grass27"] = models.grass.mesh.clone();
    meshes["grass28"] = models.grass.mesh.clone();
    meshes["grass29"] = models.grass.mesh.clone();
    meshes["grass30"] = models.grass.mesh.clone();
    meshes["grass31"] = models.grass.mesh.clone();
    meshes["grass32"] = models.grass.mesh.clone();
    meshes["grass33"] = models.grass.mesh.clone();
    meshes["grass34"] = models.grass.mesh.clone();
    meshes["grass35"] = models.grass.mesh.clone();
    meshes["grass36"] = models.grass.mesh.clone();
    meshes["grass37"] = models.grass.mesh.clone();
    meshes["grass38"] = models.grass.mesh.clone();
    meshes["grass39"] = models.grass.mesh.clone();
    meshes["grass40"] = models.grass.mesh.clone();
    meshes["grass41"] = models.grass.mesh.clone();
    meshes["grass42"] = models.grass.mesh.clone();
    meshes["grass43"] = models.grass.mesh.clone();
    meshes["grass44"] = models.grass.mesh.clone();
    meshes["grass45"] = models.grass.mesh.clone();
    meshes["grass46"] = models.grass.mesh.clone();
    meshes["grass47"] = models.grass.mesh.clone();
    meshes["grass48"] = models.grass.mesh.clone();
    meshes["grass49"] = models.grass.mesh.clone();
    meshes["grass50"] = models.grass.mesh.clone();
    meshes["grass51"] = models.grass.mesh.clone();
    meshes["grass52"] = models.grass.mesh.clone();
    meshes["grass53"] = models.grass.mesh.clone();
    meshes["grass54"] = models.grass.mesh.clone();
    meshes["grass55"] = models.grass.mesh.clone();
    meshes["grass56"] = models.grass.mesh.clone();
    meshes["grass57"] = models.grass.mesh.clone();
    meshes["grass58"] = models.grass.mesh.clone();
    meshes["grass59"] = models.grass.mesh.clone();
    meshes["grass60"] = models.grass.mesh.clone();
    meshes["grass61"] = models.grass.mesh.clone();
    meshes["grass62"] = models.grass.mesh.clone();
    meshes["grass63"] = models.grass.mesh.clone();
    meshes["grass64"] = models.grass.mesh.clone();
    meshes["grass65"] = models.grass.mesh.clone();
    meshes["grass66"] = models.grass.mesh.clone();
    meshes["grass67"] = models.grass.mesh.clone();
    meshes["grass68"] = models.grass.mesh.clone();
    meshes["grass69"] = models.grass.mesh.clone();
    meshes["grass70"] = models.grass.mesh.clone();
    meshes["grass71"] = models.grass.mesh.clone();
    meshes["grass72"] = models.grass.mesh.clone();
    meshes["grass73"] = models.grass.mesh.clone();
    meshes["grass74"] = models.grass.mesh.clone();
    meshes["grass75"] = models.grass.mesh.clone();
    meshes["grass76"] = models.grass.mesh.clone();
    meshes["grass77"] = models.grass.mesh.clone();


    meshes["playerweapon"] = models.pistol.mesh.clone();
    meshes["playerweapon"].position.set(0,2,0);
    meshes["playerweapon"].scale.set(10,10,10);
    scene.add(meshes["playerweapon"]);

    //Ставим траву
    for(let i = 0; i<78; i++){
        meshes["grass" + i].position.set(getRandomFloat(-25, 25), 0, getRandomFloat(-25, 25));
        meshes["grass" + i].scale.set(getRandomFloat(2, 5), getRandomFloat(2, 5), getRandomFloat(2, 5));
        meshes["grass" + i].rotation.y += Math.PI/randomInteger(2, 10);
        scene.add(meshes["grass" + i]);
    }

    // Ставим лес pine
    let size;
    let randomPositionPine = 40;
    for(let i = 0; i<19; i++){
        meshes["pine" + i].position.set(randomInteger(-randomPositionPine, randomPositionPine), 0, randomInteger(-randomPositionPine, randomPositionPine));
        size = getRandomFloat(2, 5);
        meshes["pine" + i].scale.set(size, size, size);
        meshes["pine1"].scale.set(20, 20, 20);
        scene.add(meshes["pine" + i]);
    }
    //pine crooked и камни
    for(let i = 0; i<15; i++){
        meshes["pineCrooked" + i].position.set(randomInteger(-randomPositionPine, randomPositionPine), 0, randomInteger(-randomPositionPine, randomPositionPine));
        size = getRandomFloat(2, 5);
        meshes["pineCrooked" + i].scale.set(size, size, size);

        meshes["pineCrooked1"].scale.set(20, 20, 20);
        scene.add(meshes["pineCrooked" + i]);
    }
    for(let i = 0; i<26; i++){
        meshes["rocks" + i].position.set(randomInteger(-randomPositionPine, randomPositionPine), 0, randomInteger(-randomPositionPine, randomPositionPine));
        size = getRandomFloat(2, 5);
        meshes["rocks" + i].scale.set(getRandomFloat(0.5, 2), getRandomFloat(1, 1.5), getRandomFloat(1, 1.5) );
        meshes["rocks" + i].rotation.y += Math.PI/randomInteger(2, 10);
        scene.add(meshes["rocks" + i]);
    }




}


function animate(){
    if(!RECOURCE_LOADED){
        requestAnimationFrame(animate);
        loadingScreen.box.rotation.y += 0.01;
        loadingScreen.box.rotation.x -= 0.02;
        loadingScreen.box.scale.x += 0.03;
        loadingScreen.box.scale.y += 0.03;
        loadingScreen.box.scale.z += 0.03;
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }


    requestAnimationFrame(animate);

    centralBox.rotation.y += 0.02;


    let time = Date.now() *  0.0005;
    let delta = clock.getDelta;

    let pWorld = vector.applyMatrix4( camera.matrixWorld );
    let dir = pWorld.sub( camera.position ).normalize();
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

    if(keyboard[37]){ // <-
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){ // ->
        camera.rotation.y += player.turnSpeed;
    }

    meshes["playerweapon"].position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
        camera.position.y - 0.38 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
    );
    meshes["playerweapon"].rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );
    torch.position.set(
        camera.position.x - Math.sin(camera.rotation.y) * 0.75,
        camera.position.y - 0.38 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
    );

    torchLookAtBox.position.set(
        camera.position.x - Math.sin(camera.rotation.y) * 5,
        camera.position.y - 0.2,
        camera.position.z + Math.cos(camera.rotation.y) * 5
    );
    // torchLookAtBox.rotation.set(
    //     camera.rotation.x,
    //     camera.rotation.y - Math.PI,
    //     camera.rotation.z
    // );



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