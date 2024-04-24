
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const speedRange = document.getElementById('speedRange');

let speed = parseInt(speedRange.value);
let isDrawing = false;

// Configuración del lienzo
canvas.width = window.innerWidth* 1;
canvas.height = window.innerHeight* 0.9;
ctx.lineWidth = 100; // Grosor de la línea

/*function randomColor() {
    // Generar un color aleatorio
    return '#' + Math.random().toString(16).substr(-6);
}*/

function randomColor() {
    // Generar un valor aleatorio entre 0 y 255 para cada componente de color
    const grayValue = Math.floor(Math.random() * 256);
    // Crear un color en escala de grises y negro usando el mismo valor para los tres componentes
    return `rgb(234, ${grayValue}, 135)`;
}


async function draw() {
    isDrawing = true;
    // Punto de partida en el centro del lienzo
    let x = canvas.width / 2;
    let y = canvas.height / 2;


    for (let i = 0; i < 20000; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        // Obtenemos una dirección aleatoria
        const angle = Math.random() * Math.PI * 2;
        // Calculamos las coordenadas del punto final

        const distance = 40; // Distancia del paso
        
        const xend = x + Math.cos(angle) * distance;
        const yend = y + Math.sin(angle) * distance;
        // Asegurarse de que la línea no salga del canvas
        x = Math.max(0, Math.min(canvas.width, xend));
        y = Math.max(0, Math.min(canvas.height, yend));
        // Establecer el color de la línea como un color arcoiris
        ctx.strokeStyle = randomColor();
        //ctx.strokeStyle = "black";
        // Dibujar un pequeño segmento de línea
        ctx.lineTo(x, y);
        ctx.stroke();
        // Esperar un tiempo para controlar la velocidad
        await new Promise(resolve => setTimeout(resolve, 100 - speed));
    }
    isDrawing = false;
}


speedRange.addEventListener('input', function () {
    speed = parseInt(this.value);
    if (!isDrawing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }
});


document.getElementById('pressButton').onclick = function() {
    speed = parseInt(this.value);
    if (!isDrawing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }
};




