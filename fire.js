const canvasWidth = 40
const canvasHeight = 40
const firePixelsData = []
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
const debug = false
const numberOfPixels = canvasWidth * canvasHeight

var windDirection = 0 // 0: to the left; 1: no wind; 2: to the right
var caos = false

function createFireStructure() {
    for (let index = 0; index < numberOfPixels; index++) {
        firePixelsData[index] = 0
    }
}

function createFireSource() {
    const floor = numberOfPixels - canvasWidth;

    for (let column = 0; column < canvasWidth; column++) {
        firePixelsData[floor + column] = 36
    }
}

function calculateFirePropagation() {
    var index = 0

    for (let column = 0; column < canvasWidth; column++) {
        for (let row = 0; row < canvasHeight; row++) {
            index = column + (canvasWidth * row)

            updateFireIntensity(index);
        }
    }

    render();
}

function updateFireIntensity(index) {
    const bellow = index + canvasWidth;

    if (bellow >= numberOfPixels ) return

    const decay = Math.floor(Math.random() * 3) 

    var newIntensity = firePixelsData[bellow] - decay

    var newIndex;
    
    switch(windDirection) {
        case 0:
            newIndex = index-decay
            break
        
        case 2:
            newIndex = index+decay
            break

        default:
            newIndex = index
            break
    }

    if (caos) {
        
        if (index < (numberOfPixels - 3 * canvasWidth)) {
            newIntensity = (newIntensity + 2) > 33 ? 15 : (newIntensity + 2)
        }
        document.querySelector('#caos').innerHTML = '<button onclick="caosMode()">Normal Fire</button>'
    } else {
        document.querySelector('#caos').innerHTML = '<button onclick="caosMode()">Caos Mode</button>'
    }

    firePixelsData[newIndex] = newIntensity >= 0 ? newIntensity : 0
}

function changeWindDirection(wind) {
    windDirection = wind
} 

function caosMode() {
    caos = !caos
} 

function render() {
    var pixelIndex = 0
    var pixelIntensity = 0

    var html = `<table cellpadding=0 cellspacing=0>`

    for (let row = 0; row < canvasHeight; row++) {
        html += `<tr>`

        for (let column = 0; column < canvasWidth; column++) {
            pixelIndex = column + (canvasWidth * row);
            pixelIntensity = firePixelsData[pixelIndex];

            if (debug) {
                html += `<td>`
                html += `<div class="indexDisplay">${pixelIndex}</div>`
                html += pixelIntensity
                html += `</td>`
            } else {
                const color = fireColorsPalette[pixelIntensity]
                const colorRGB = `${color.r}, ${color.g}, ${color.b}`
                
                html += `<td class="pixel" style="background-color: rgb(${colorRGB})"`
                html += `</td>`
            }
        }

        html += `</tr>`
    }

    html += `</table>`

    document.querySelector(`#fire-div`).innerHTML = html
}

function start() {
    createFireStructure();
    createFireSource();
    
    setInterval(calculateFirePropagation, 50);
}

start();
