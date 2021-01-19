console.log("page loaded");

// подключение графики

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d'); //еще есть 'webgl'

function currentTime() {
    return new Date().getTime(); //getTime = кол-во мс с 1 января 1970
}

let animationStart = currentTime(); //время начала всей анимации
let lastFrameTime = currentTime(); //время рисования последнего кадра

// меняющаяся часть шаблона. Здесь задаем начальные данные о нашем мире
let vx = 500;
let vy = 200;
let x = 21; // координаты, положение прямоугольничка
let y = 21;
const R = 20;
let arrBalls = [
    {x: 100, y: 70,  R: 12, vx: 150, vy: 400, color: "green"},
    {x: 50, y: 300,  R: 20, vx: 200, vy: 500, color: "red"},
    {x: 300, y: 250, R: 40, vx: 250, vy: 190, color: "blue"},
    {x: 250, y: 350, R: 25, vx: 150, vy: 180, color: "grey"},
    {x: 180, y: 150, R: 25, vx: 100, vy: 45, color: "violet"},
    ];

//рисование кадра. Нужно заменить на своё.
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for(let i = 0; i < arrBalls.length; i++){
        ctx.beginPath();
        ctx.arc(arrBalls[i].x, arrBalls[i].y, arrBalls[i].R, 0, Math.PI*2);
        ctx.fillStyle = arrBalls[i].color;
        ctx.fill();
        ctx.closePath();
    }


}

//функция изменяет состояние мира. Нужно заменить на свою
//аргументы: время, прошедшее с начала анимации в мс
//время, прошедшее с прошлого кадра в мс
function step(timeFromAnimationStart, timeFromLastFrame) {
    for (let i = 0; i < arrBalls.length; i++) {
        if (arrBalls[i].x + arrBalls[i].R >= canvas.width) arrBalls[i].vx = -arrBalls[i].vx;
        if (arrBalls[i].x - arrBalls[i].R <= 0) arrBalls[i].vx = -arrBalls[i].vx;
        if (arrBalls[i].y + arrBalls[i].R >= canvas.height) arrBalls[i].vy = -arrBalls[i].vy;
        if (arrBalls[i].y - arrBalls[i].R <= 0) arrBalls[i].vy = -arrBalls[i].vy;
        // расстояние = скорость * время

        for (let fi = 0; fi < arrBalls.length - 1; ++fi)
        {
            for (let si = fi + 1; si < arrBalls.length; ++si)
            {
                if ((Math.sqrt((arrBalls[fi].x - arrBalls[si].x)**2 + (arrBalls[fi].y - arrBalls[si].y)**2)) <= (arrBalls[fi].R + arrBalls[si].R)){
                    arrBalls[fi].vx = -arrBalls[fi].vx;
                    arrBalls[si].vx = -arrBalls[si].vx;
                    arrBalls[fi].vy = -arrBalls[fi].vy;
                    arrBalls[si].vy = -arrBalls[si].vy;
                }
            }
        }
        arrBalls[i].x = arrBalls[i].x + arrBalls[i].vx * (timeFromLastFrame / 1000); // делим на 1000, переводим мс в сек
        arrBalls[i].y = arrBalls[i].y + arrBalls[i].vy * (timeFromLastFrame / 1000);
    }
}

//функция, которая вызывается постоянно для очередного кадра.
//Теперь tick универсален. Он всегда будет такой.
function tick() {
    let now = currentTime();
    let timeFromAnimationStart = now - animationStart;
    let timeFromLastFrame = now - lastFrameTime;
    lastFrameTime = now;

    step(timeFromAnimationStart, timeFromLastFrame);
    draw();
    requestAnimationFrame(tick);
}

tick(); //вызвать функцию первый раз, далее она будет вызывать себя сама.

// обычно эта конструкция работает с частотой 60 кадров в секунду.
// Если хочется управлять количеством кадров в секунду, нужен код
// внутри tick который иногда пропускает рисование. Т.е. получится меньше,
// чем 60 рисований в секунду.