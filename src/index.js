import './index.css';

const drawingSheet = document.querySelector('.image');
const buttonClear = document.querySelector('.button-clear');
const inputColor = document.querySelector('.input-color');
const inputOpasity = document.querySelector('.input-range_type_opasity');
const inputWeight = document.querySelector('.input-range_type_weight');
const buttonRedo = document.querySelector('.button_type_redo');
const buttonUndo = document.querySelector('.button_type_undo');
const canvas = document.querySelector('.canvas');
let context = canvas.getContext('2d');

console.log(context)

let painting = false;
let lines = [];
let line = []
let mousePositionX = 0;
let mousePositionY = 0;
let tool = 'brash';
let weightLine = 10
let opasityLine = 100
let colorLine = '#000000';
let colorRGBA = `rgba(0,0,0, ${opasityLine})`
let step = 0;

const heightCanvas = () => drawingSheet.offsetHeight;
const widthCanvas = () => drawingSheet.offsetWidth;

function changeSizeCanvas() {
    canvas.setAttribute('width', widthCanvas());
    canvas.setAttribute('height', heightCanvas());
    // console.log(drawingSheet.offsetHeight, drawingSheet.offsetWidth);
}

function handleChangeCanvas(e) {
    // if (toolActive === 'brush') {
    draw(e)
    // }
    // else if (toolActive === 'test') {
    //     console.log('work')
    // }
}

function startPosition() {
    painting = true;
}

function finishedPosition() {
    painting = false
    lines.push(line)
    line = []
}

function drawLine(e) {
    mousePositionX = e.offsetX;
    mousePositionY = e.offsetY;

    context.lineWidth = weightLine
    context.lineCap = 'round'
    context.strokeStyle = colorRGBA
    context.lineTo(mousePositionX, mousePositionY)
    context.stroke()
    context.beginPath();
    context.moveTo(mousePositionX, mousePositionY)
    context.beginPath();
}

function draw(e) {

    if (!painting) {
        return
    }

    drawLine(e)

    line.push({ x: mousePositionX, y: mousePositionY, weight: weightLine, color: colorRGBA })
    // если при нажатой мыши курсов вышел за пределы canvas, то рисование сбрасываем
    // console.log('mousePositionX:', mousePositionX,'mousePositionY:',mousePositionY, 'offsetWidth:',drawingSheet.offsetWidth, 'offsetHeight:', drawingSheet.offsetHeight)
    if (mousePositionX + 10 > drawingSheet.offsetWidth || mousePositionX <= 0 || mousePositionY + 10 > drawingSheet.offsetHeight || mousePositionY < 10) {
        painting = false
    }
    // console.log(line)
}

function clearCanvas() {
    context.clearRect(0, 0, widthCanvas(), heightCanvas());
}

export function hexToRgb(hex) {

    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function (r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function changeHexToRgba(color) {
    const colorConvert = hexToRgb(color)
    return `rgba(${colorConvert?.r}, ${colorConvert?.g}, ${colorConvert?.b}, ${opasityLine / 100})`
}

function changeColor(e) {
    colorLine = e.target.value
    colorRGBA = changeHexToRgba(colorLine)   
}

function changeWeight(e) {
    weightLine = e.target.value
}

function changeOpasity(e) {
    opasityLine = e.target.value
    colorRGBA = changeHexToRgba(colorLine)
}

function goBackStep() {

}

function goForwardStep() {
    
}

changeSizeCanvas()
window.addEventListener('resize', () => changeSizeCanvas())
canvas.addEventListener('mousedown', startPosition)
canvas.addEventListener('mouseup', finishedPosition)
canvas.addEventListener('mousemove', (e) => handleChangeCanvas(e))
buttonClear.addEventListener('click', clearCanvas)
inputColor.addEventListener('change', (e) => changeColor(e))
inputOpasity.addEventListener('change', (e) => changeOpasity(e))
inputWeight.addEventListener('change', (e) => changeWeight(e))
buttonRedo.addEventListener('click', goBackStep)
buttonUndo.addEventListener('click', goForwardStep)



