import './styles/index.css';
import 'normalize.css';

import { hexToRgb, saveCanvas } from './utils/functions';
import {
    drawingSheet, tools, buttonClear, buttonRedo, buttonUndo, buttonSave, optionsList,
    inputColor, inputOpasity, inputWeight, textColor, textOpasity, textWeight,
    eraser, brash, buttonsTools, canvas, context, cursor
} from './utils/constants';

let supportsTouch;

let painting = false;
let lines = [];
let line = [];
let mousePositionX = 0;
let mousePositionY = 0;
let tool = 'brash';
let weightLine = 10;
let opasityLine = 100;
let colorLine = '#55AFE2';
let colorRGBA = `rgba(85,175,226, ${opasityLine})`;
let step = 0;
let bgCanvas = '#ffffff';

textColor.textContent = colorLine;
textOpasity.textContent = opasityLine + ' %';
textWeight.textContent = weightLine + ' px';
canvas.style.background = bgCanvas;
inputColor.setAttribute("value", colorLine);
inputOpasity.setAttribute("value", opasityLine);
inputWeight.setAttribute("value", weightLine);

const widthCanvas = () => drawingSheet.offsetWidth;
const heightCanvas = () => {
    if (window.innerWidth > 767) {
        console.log(1)
        return window.innerHeight - drawingSheet.offsetTop * 2;
    } else {      
        return window.innerHeight - tools.offsetHeight - 60;       
    }
}

function getBg() {
    // для сохранения bg рисунка
    context.save();
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = bgCanvas;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function changeSizeCanvas() {
    canvas.setAttribute('width', widthCanvas());
    canvas.setAttribute('height', heightCanvas());
    console.log(heightCanvas())
    supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints; // touch устройство?
    renderLine();
}

function startPosition() {
    painting = true;
}

function finishedPosition() {
    painting = false;
    lines.push(line);
    line = [];
    step = lines.length;
    toggleActiveClassButtonSave();
    toggleActiveClassButtonUndo();
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
        return;
    }

    if (supportsTouch) {
        // для мобилки
        mousePositionX = e.changedTouches[0].pageX - e.changedTouches[0].target.offsetParent.offsetLeft;
        mousePositionY = e.changedTouches[0].pageY - e.changedTouches[0].target.offsetParent.offsetTop;
    } else {
        // для компа
        mousePositionX = e.offsetX;
        mousePositionY = e.offsetY;
    }

    lines = lines.slice(0, step);
    let colorTools = (tool === 'brash') ? colorRGBA : bgCanvas;
    drawLine(mousePositionX, mousePositionY, weightLine, colorTools);
    line.push({ x: mousePositionX, y: mousePositionY, weight: weightLine, color: colorTools });

    // если при нажатой мыши курсов вышел за пределы canvas, то рисование сбрасываем
    if (mousePositionX + 10 > drawingSheet.offsetWidth || mousePositionX <= 10 || mousePositionY + 10 > drawingSheet.offsetHeight || mousePositionY < 10) {
        painting = false;
    }
}

function changeBrash(e) {
    cursor.setAttribute('style', `
    top: ${e.offsetY - weightLine / 2}px; 
    left: ${e.offsetX - weightLine / 2}px; 
    height: ${weightLine}px;
    width: ${weightLine}px;
    `)
}

function clearCanvas() {
    context.clearRect(0, 0, widthCanvas(), heightCanvas());
}

function startOver() {
    clearCanvas();
    lines = [];
    line = [];
    toggleActiveClassButtonRedo();
    toggleActiveClassButtonUndo();
    toggleActiveClassButtonSave();
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
    toggleActiveClassButtonUndo();
    toggleActiveClassButtonRedo();
}

function goForwardStep() {
    if (step === lines.length) {
        return;
    }
    step = step + 1;
    renderLine();
    toggleActiveClassButtonRedo();
    toggleActiveClassButtonUndo();
}
function changeTool(e, toolActive) {
    tool = toolActive;
    toggleActiveClassButtons(e);
    toggleActiveClassButtonUndo();
    toggleOptions();
}

function saveImage() {
    if (lines.length !== 0) {
        saveCanvas(canvas);
    }
}

function addActiveClassButton(element, className) {
    element.classList.add(className);
}

function removeActiveClassButton(element, className) {
    element.classList.remove(className);
}

function toggleActiveClassButtons(e) {
    buttonsTools.forEach((i) => {
        if (i.classList.contains('button_active')) {
            removeActiveClassButton(i, 'button_active');
        }
        addActiveClassButton(e.currentTarget, 'button_active');
    })
}
function toggleActiveClassButtonSave() {
    if (lines.length === 0) {
        removeActiveClassButton(buttonSave, 'button-save_active');
    } else {
        addActiveClassButton(buttonSave, 'button-save_active');
    }
}

function toggleActiveClassButtonUndo() {
    if (lines.length > 0 || lines.length === step) {
        addActiveClassButton(buttonUndo, 'button-action_active');
    }
    if (lines.length === 0 || step === 0) {
        removeActiveClassButton(buttonUndo, 'button-action_active');
    }
}

function toggleActiveClassButtonRedo() {
    if (lines.length > 0 && step < lines.length) {
        addActiveClassButton(buttonRedo, 'button-action_active');
    }
    if (lines.length === step) {
        removeActiveClassButton(buttonRedo, 'button-action_active');
    }
}

function toggleOptions() {
    if (tool === 'eraser') {
        optionsList.forEach(item => {
            if (!item.classList.contains('input-box_type_weight')) {
                addActiveClassButton(item, 'input-box_hide');
            }
        })
    } else {
        optionsList.forEach(item => {
            if (!item.classList.contains('input-box_type_weight')) {
                removeActiveClassButton(item, 'input-box_hide');
            }
        })
    }
}

changeSizeCanvas();
getBg();

window.addEventListener('resize', () => changeSizeCanvas());

inputColor.addEventListener('input', (e) => changeColor(e));
inputOpasity.addEventListener('input', (e) => changeOpasity(e));
inputWeight.addEventListener('input', (e) => changeWeight(e));

buttonClear.addEventListener('click', startOver);
buttonRedo.addEventListener('click', goForwardStep);
buttonUndo.addEventListener('click', goBackStep);
buttonSave.addEventListener('click', saveImage);

eraser.addEventListener('click', (e) => changeTool(e, 'eraser'));
brash.addEventListener('click', (e) => changeTool(e, 'brash'));

if (supportsTouch) {
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', (e) => draw(e));
} else {
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', (e) => draw(e));
    canvas.addEventListener('mousemove', e => changeBrash(e));
}
