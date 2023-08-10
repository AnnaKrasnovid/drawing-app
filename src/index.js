import './index.css';
import 'normalize.css';

import { hexToRgb } from './utils/functions';

const drawingSheet = document.querySelector('.image');
const buttonClear = document.querySelector('.button-clear');
const buttonRedo = document.querySelector('.button_type_redo');
const buttonUndo = document.querySelector('.button_type_undo');
const buttonSave = document.querySelector('.button_type_save');
const inputColor = document.querySelector('.input-color');
const inputOpasity = document.querySelector('.input-range_type_opasity');
const inputWeight = document.querySelector('.input-range_type_weight');
const textColor = document.querySelector('.input-box__option_type_color');
const textOpasity = document.querySelector('.input-box__option_type_opasity');
const textWeight = document.querySelector('.input-box__option_type_weight');
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

textColor.textContent = colorLine
textOpasity.textContent = opasityLine + '%'
textWeight.textContent = weightLine + 'px'

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
    step = lines.length
}

function drawLine(x, y, weight, color) {
    context.lineWidth = weight
    context.lineCap = 'round'
    context.strokeStyle = color
    context.lineTo(x, y)
    context.stroke()
    context.beginPath();
    context.moveTo(x, y)
    context.beginPath();
}

function draw(e) {

    if (!painting) {
        return
    }
    lines = lines.slice(0, step)
    mousePositionX = e.offsetX;
    mousePositionY = e.offsetY;
    drawLine(mousePositionX, mousePositionY, weightLine, colorRGBA)

    line.push({ x: mousePositionX, y: mousePositionY, weight: weightLine, color: colorRGBA })
    // если при нажатой мыши курсов вышел за пределы canvas, то рисование сбрасываем
    // console.log('mousePositionX:', mousePositionX,'mousePositionY:',mousePositionY, 'offsetWidth:',drawingSheet.offsetWidth, 'offsetHeight:', drawingSheet.offsetHeight)
    if (mousePositionX + 10 > drawingSheet.offsetWidth || mousePositionX <= 0 || mousePositionY + 10 > drawingSheet.offsetHeight || mousePositionY < 10) {
        painting = false
    }
}

function clearCanvas() {
    context.clearRect(0, 0, widthCanvas(), heightCanvas());
}

function startOver() {
    context.clearRect(0, 0, widthCanvas(), heightCanvas());
    lines = [];
    line = []
}

function changeHexToRgba(color) {
    const colorConvert = hexToRgb(color)
    colorRGBA = `rgba(${colorConvert?.r}, ${colorConvert?.g}, ${colorConvert?.b}, ${opasityLine / 100})`
}

textColor.textContent = colorLine
textOpasity.textContent = opasityLine + '%'
textWeight.textContent = weightLine + 'px'

function changeColor(e) {
    colorLine = e.target.value
    changeHexToRgba(colorLine)
    textColor.textContent = colorLine
}

function changeWeight(e) {
    weightLine = e.target.value
    textWeight.textContent = weightLine + 'px'
}

function changeOpasity(e) {
    opasityLine = e.target.value
    changeHexToRgba(colorLine)
    textOpasity.textContent = opasityLine + '%'
}

function renderLine() {
    clearCanvas()

    lines.slice(0, step).forEach((item) => {
        item.forEach(i => {
            drawLine(i.x, i.y, i.weight, i.color)
        })
    })
}

function goBackStep() {
    if (step === 0) {
        return;
    }
    step = step - 1;
    renderLine();
}

function goForwardStep() {
    if (step === lines.length) {
        return;
    }
    step = step + 1;
    renderLine();
}
function saveImage() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Image.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}

changeSizeCanvas()
window.addEventListener('resize', () => changeSizeCanvas())
canvas.addEventListener('mousedown', startPosition)
canvas.addEventListener('mouseup', finishedPosition)
canvas.addEventListener('mousemove', (e) => handleChangeCanvas(e))
buttonClear.addEventListener('click', startOver)
inputColor.addEventListener('change', (e) => changeColor(e))
inputOpasity.addEventListener('change', (e) => changeOpasity(e))
inputWeight.addEventListener('change', (e) => changeWeight(e))
buttonRedo.addEventListener('click', goForwardStep)
buttonUndo.addEventListener('click', goBackStep)
buttonSave.addEventListener('click', saveImage)


