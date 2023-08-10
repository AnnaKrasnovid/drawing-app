import './index.css';
import 'normalize.css';

import { hexToRgb, saveCanvas } from './utils/functions';
import {
    drawingSheet, buttonClear, buttonRedo, buttonUndo, buttonSave, inputColor,
    inputOpasity, inputWeight, textColor, textOpasity, textWeight, eraser, brash,
    buttonsTools, canvas, context
} from './utils/constants';

let painting = false;
let lines = [];
let line = [];
let mousePositionX = 0;
let mousePositionY = 0;
let tool = 'brash';
let weightLine = 10;
let opasityLine = 100;
let colorLine = '#000000';
let colorRGBA = `rgba(0,0,0, ${opasityLine})`;
let step = 0;
let bgCanvas = '#ffffff';

textColor.textContent = colorLine;
textOpasity.textContent = opasityLine + '%';
textWeight.textContent = weightLine + 'px';
canvas.style.background = bgCanvas;

const heightCanvas = () => drawingSheet.offsetHeight;
const widthCanvas = () => drawingSheet.offsetWidth;

function getBg() {
    // canvas.style.background = bgCanvas;
    context.save();
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = bgCanvas;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function changeSizeCanvas() {
    canvas.setAttribute('width', widthCanvas());
    canvas.setAttribute('height', heightCanvas());
}

function startPosition() {
    painting = true;
}

function finishedPosition() {
    painting = false;
    lines.push(line);
    line = [];
    step = lines.length;

    // if(step)
}

function drawLine(x, y, weight, color) {
    context.lineWidth = weight;
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    context.beginPath();
}

function draw(e) {
    if (!painting) {
        return
    }

    lines = lines.slice(0, step)
    mousePositionX = e.offsetX;
    mousePositionY = e.offsetY;
    let colorTools = (tool === 'brash') ? colorRGBA : bgCanvas;
    drawLine(mousePositionX, mousePositionY, weightLine, colorTools);
    line.push({ x: mousePositionX, y: mousePositionY, weight: weightLine, color: colorTools });
    // если при нажатой мыши курсов вышел за пределы canvas, то рисование сбрасываем

    if (mousePositionX + 10 > drawingSheet.offsetWidth || mousePositionX <= 0 || mousePositionY + 10 > drawingSheet.offsetHeight || mousePositionY < 10) {
        painting = false;
    }
}

function clearCanvas() {
    context.clearRect(0, 0, widthCanvas(), heightCanvas());
}

function startOver() {
    context.clearRect(0, 0, widthCanvas(), heightCanvas());
    lines = [];
    line = [];
}

function changeHexToRgba(color) {
    const colorConvert = hexToRgb(color);
    colorRGBA = `rgba(${colorConvert?.r}, ${colorConvert?.g}, ${colorConvert?.b}, ${opasityLine / 100})`;
}

function changeColor(e) {
    colorLine = e.target.value;
    changeHexToRgba(colorLine);
    textColor.textContent = colorLine;
}

function changeWeight(e) {
    weightLine = e.target.value;
    textWeight.textContent = weightLine + 'px';
}

function changeOpasity(e) {
    opasityLine = e.target.value;
    changeHexToRgba(colorLine);
    textOpasity.textContent = opasityLine + '%';
}

function renderLine() {
    clearCanvas();

    lines.slice(0, step).forEach((item) => {
        item.forEach(i => {
            drawLine(i.x, i.y, i.weight, i.color);
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

function toggleActiveClassButtons(e) {
    buttonsTools.forEach((i) => {
        if (i.classList.contains('button_active')) {
            removeActiveClassButton(i, 'button_active');
        }
        addActiveClassButton(e.currentTarget, 'button_active')
    })
}


function addActiveClassButton(element, className) {
    element.classList.add(className);
}

function removeActiveClassButton(element) {
    element.classList.remove(className);
}

function changeTool(e, toolActive) {
    tool = toolActive;
    toggleActiveClassButtons(e);
}

changeSizeCanvas();
getBg();

window.addEventListener('resize', () => changeSizeCanvas());
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', (e) => draw(e));
buttonClear.addEventListener('click', startOver);
inputColor.addEventListener('input', (e) => changeColor(e));
inputOpasity.addEventListener('input', (e) => changeOpasity(e));
inputWeight.addEventListener('input', (e) => changeWeight(e));
buttonRedo.addEventListener('click', goForwardStep);
buttonUndo.addEventListener('click', goBackStep);
buttonSave.addEventListener('click', () => saveCanvas(canvas));
eraser.addEventListener('click', (e) => changeTool(e, 'eraser'));
brash.addEventListener('click', (e) => changeTool(e, 'brash'));


// export const inputColor = document.querySelector('.input-color');
// export const inputOpasity = document.querySelector('.input-range_type_opasity');
// export const inputWeight = document.querySelector('.input-range_type_weight');

// const slider = document.querySelector(".input-range_type_opasity")
// const min = inputOpasity.min
// const max = inputOpasity.max
// const value = inputOpasity.value
// const minWeight = inputOpasity.min
// const maxWeight = inputOpasity.max
// const valueWeight = inputOpasity.value

// function getOptionsInput() {
    
// }

// inputOpasity.style.background = `linear-gradient(to right, #B0D3BF 0%, #B0D3BF ${(value - min) / (max - min) * 100}%, #DEE2E6 ${(value - min) / (max - min) * 100}%, #DEE2E6 100%)`
// inputWeight.style.background = `linear-gradient(to right, #B0D3BF 0%, #B0D3BF ${(valueWeight - minWeight) / (maxWeight - minWeight) * 100}%, #DEE2E6 ${(valueWeight - minWeight) / (maxWeight - minWeight) * 100}%, #DEE2E6 100%)`



// function addGradientInput(e) {
//     const value = e.target.value
//     inputOpasity.style.background = `linear-gradient(to right, #B0D3BF 0%, #B0D3BF ${(value - min) / (max - min) * 100}%, #DEE2E6 ${(value - min) / (max - min) * 100}%, #DEE2E6 100%)`
// }
// function addGradientInput2(e) {
//     const value = e.target.value
//     inputWeight.style.background = `linear-gradient(to right, #B0D3BF 0%, #B0D3BF ${(value - min) / (max - min) * 100}%, #DEE2E6 ${(value - min) / (max - min) * 100}%, #DEE2E6 100%)`
// }

// inputOpasity.addEventListener('input', (e) => addGradientInput(e))
// inputWeight.addEventListener('input', (e) => addGradientInput2(e))