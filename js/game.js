var scene, camera, renderer, mesh;

var width = window.innerWidth;
var height = window.innerHeight;
var keyboard = {};

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000);

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({color:0xff4444, wireframe:true})
    );
    scene.add(mesh);

    camera.position.set(0,0,-3);
    camera.lookAt(new THREE.Vector3(0,0,0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    animate();
}

function animate(){
    requestAnimationFrame(animate);
    // mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    if(keyboard[65]){
        camera.rotation.y -= Math.PI * 0.01;
    }
    if(keyboard[68]){
        camera.rotation.y += Math.PI * 0.01;
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