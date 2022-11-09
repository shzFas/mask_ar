let outputWidth;
let outputHeight;
let faceTracker;
let videoInput;
let imgMask;
let imgFace;
let select = -1;

function preload() {
 imgMask = loadImage("https://img2.akspic.ru/previews/9/0/9/8/6/168909/168909-ballonchik-graffiti-ulichnoe_iskusstvo-svet-purpur-500x.jpg");
 imgFace = loadImage("https://img2.akspic.ru/previews/9/0/9/8/6/168909/168909-ballonchik-graffiti-ulichnoe_iskusstvo-svet-purpur-500x.jpg");
}

function setup() {

    /* Создание разрешения 4:3 */
    const maxWidth = Math.min(windowWidth, windowHeight);
    pixelDensity(1);
    outputHeight = maxWidth * 0.75;
    outputWidth = maxWidth;

    /* Рендер канваса */
    createCanvas(outputWidth, outputHeight);

    videoInput = createCapture(VIDEO);
    videoInput.size(outputWidth, outputHeight);
    videoInput.hide();

    const selected = createSelect();
    const selectList = ['Mask', 'Face'];
    selected.option('Select filter', -1);

    for(let i = 0; i < selectList.length; i++){
        selected.option(selectList[i], i)
    }
    selected.changed(applyFilter);

    faceTracker = new clm.tracker();
    faceTracker.init();
    faceTracker.start(videoInput.elt)

}

function applyFilter() {
    select = this.selected();
}

function draw() {
    image(videoInput, 0, 0, outputWidth, outputHeight)

    switch(select) {
        case '-1': break;
        case '0': drawMask(); break;
        case '1': drawFace(); break;
    }
}

function drawMask() {
    const positions = faceTracker.getCurrentPosition();
    if(positions !== false) {
        push();
        const wx = Math.abs(positions[13][0] -positions[1][0]) * 1.2;
        const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2;
        translate(-wx/2, -wy/2)
        image(imgMask, positions[62][0], positions[62][1], wx, wy);
        pop();
    }
}

function drawFace() {
    const positions = faceTracker.getCurrentPosition();
    if(positions !== false) {
        push();
        const wx = Math.abs(positions[13][0] -positions[1][0]) * 1.2;
        const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2;
        translate(-wx/2, -wy/2)
        image(imgFace, positions[62][0], positions[62][1], wx, wy);
        pop();
    }
}

function windowResized() {
    const maxWidth = Math.min(windowWidth, windowHeight);

    pixelDensity(1);
    outputHeight = maxWidth * 0.75;
    outputWidth = maxWidth;
    resizeCanvas(outputWidth, outputHeight);
}