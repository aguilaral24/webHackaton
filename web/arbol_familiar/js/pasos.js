
const slider = document.getElementById('year-slider');

slider.addEventListener('input', function() {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, transparent 0%, cyan ${value}%,  transparent ${value}%, transparent 100%)`;
});

var canvas = document.getElementById('arbol');
var ctx = canvas.getContext('2d');
var canvasF = document.getElementById('flores');
var ctxF = canvasF.getContext('flores');


var animationIDs = [];

// Establecer el tamaño del lienzo igual al tamaño de la ventana
canvas.width = 0;
canvas.height = 0;
canvasF.width = 0;
canvasF.height = 0;


var yearSlider = document.getElementById('year-slider');


var maxDepth = 0; // Profundidad máxima del árbol
var branchAngle = 0; // Ángulo de las ramas

var initialAngle = 0; // Angulo inicial de bifurcación
var initialBranchWidth = 0; // Ancho de la rama inicial
var initialBranchLength = 0; // Longitud de la primera rama

var maxNumFlowers = 0; //Limite flores
var flowerNumber = 0;  //contador flores
var numNinios= 0;
var numNinias= 0;
var countNinias = 0;
var countNinios = 0;

var animationSpeed = 0; // Velocidad de la animación en milisegundos

// Lista para almacenar los segmentos
var segments = [];
var branches = [];
// Lista para almacenar las flores
var flowers = [];


// Precalcular los valores de coseno y seno
var cosValues = [];
var sinValues = [];

function initParams(){

    canvas = document.getElementById('arbol');
    ctx = canvas.getContext('2d');
    canvasF = document.getElementById('flores');
    ctxF = canvasF.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasF.width = window.innerWidth;
    canvasF.height = window.innerHeight;

    maxDepth = 7; 
    branchAngle = Math.PI / 4; 

    initialAngle = -Math.PI / 2; 
    initialBranchWidth = 30; 
    initialBranchLength = 200; 

    maxNumFlowers = 0;
    flowerNumber = 0;  
    numNinios= 0;
    numNinias= 0;
    countNinias = 0;
    countNinios = 0;

    animationSpeed = 2500; 

    segments = [];
    flowers = [];
    branches = [];

    cosValues = [];
    sinValues = [];

    for (var i = 0; i < 5; i++) {
        var angle = (Math.PI * 2 * i) / 5;
        cosValues.push(Math.cos(angle));
        sinValues.push(Math.sin(angle));
    }

}

function drawFlower(X,Y){

    var flowerSize = Math.random() * (60 - 10) + 10;
    flowerNumber += 1;
    var flowerColor  = 1;

    if (flowerNumber % 2 === 0) {
        if(countNinias< numNinias){
            flowerColor = 0;
            countNinias +=1;
        }
        else{
            flowerColor = 1;
        }
    }
    else{
        if(countNinios < numNinios){
            flowerColor = 1;
            countNinios +=1;
        }
        else{
            flowerColor = 0;
        }
    }
    
    drawSierpinskiPentagon2(X, Y, flowerSize, 3, flowerColor);

}

function createTree(angle){

    var branches = [];
    let startX = canvas.width / 2;
    let startY = canvas.height;
    let depth = 1;
    let width = 30;
    let length = 200;

    function createBranch(startX, startY, length, width, angle, depth){
               
        if(depth>maxDepth){
            return;
        }

        //Calculamos punto final de la rama
        var endX = startX + length * Math.cos(angle);
        var endY = startY + length * Math.sin(angle);
    
        branches.push({ startX, startY, endX, endY, depth, width, angle });

        //Angulos de bifurcación
        var leftAngle = angle - Math.random() * branchAngle;
        var rightAngle = angle + Math.random() * branchAngle;
    
        //bifurcaciones recursivas
        createBranch(endX, endY, length * 0.86, width * 0.7, leftAngle, depth + 1);
        createBranch(endX, endY, length * 0.86, width * 0.7, rightAngle, depth + 1);
    }


    createBranch(startX, startY, length, width, angle, depth);

    return branches;
}

function drawTree(branches) {
    var curDepth = 1;

    function drawNextDepth() {
        if (curDepth <= maxDepth) {
            var startTime = performance.now();

            function drawStep(timestamp) {
                var progress = Math.min((timestamp - startTime) / animationSpeed, 1);
                ctx.strokeStyle = "#1F1916";

                // Dibujar los segmentos gradualmente
                branches.forEach(branch => {
                    if (branch.depth === curDepth) {
                        var currentEndX = branch.startX + progress * (branch.endX - branch.startX);
                        var currentEndY = branch.startY + progress * (branch.endY - branch.startY);

                        ctx.beginPath();
                        ctx.lineWidth = branch.width;
                        ctx.moveTo(branch.startX, branch.startY);
                        ctx.lineTo(currentEndX, currentEndY);
                        ctx.stroke();
                    }
                });

                if (progress < 1) {
                    var id = requestAnimationFrame(drawStep);
                    animationIDs.push(id);
                } else {
                    branches.forEach(branch => {
                        if (branch.depth === curDepth) {console.log(flowerNumber)
                            if(curDepth >=2 && flowerNumber < maxNumFlowers)
                            {
                                ctx.globalCompositeOperation = "destination-under";

                                drawFlower(branch.endX,branch.endY);
                            }
                        }
                    });

                    curDepth++; // Pasamos a la siguiente profundidad

                    drawNextDepth(); 
                }
            }

            // Animación de profundidad actual
            var id = requestAnimationFrame(timestamp => drawStep(timestamp));
            animationIDs.push(id);

        }
    }

    // Iniciar la animación comenzando por la primera profundidad
    drawNextDepth();
}


// Función para dibujar un pentágono de Sierpinski con efecto de zoom gradual
function drawSierpinskiPentagon2(x, y, size, depth,color) {
    if (depth === 0) {
        return;
    }

    // Calcula los puntos del pentágono
    var points = [];
    for (var i = 0; i < 5; i++) {
        points.push({
            x: x + size * cosValues[i],
            y: y + size * sinValues[i]
        });
    }

    // Calcula el centro del pentágono
    var centerX = x;
    var centerY = y; 

    // Crea el gradiente de color azul desde el centro hacia los bordes
    var gradient = ctxF.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);

    if(color===1){
        gradient.addColorStop(0, 'white'); // Azul claro
        gradient.addColorStop(0.9, '#164C8F'); // Blanco (transición)
        gradient.addColorStop(0.9, '#164C8F'); // Blanco (transición)
        gradient.addColorStop(1, 'white'); //0FB0F5
    }
    else{
        gradient.addColorStop(0, 'white'); // Azul claro
        gradient.addColorStop(0.9, '#DE78A1'); // Blanco (transición)
        gradient.addColorStop(0.7, '#DE78A1'); //DE29BD 
        gradient.addColorStop(1, 'white'); // rosa oscuro
    }


    // Dibuja los pentágonos internos gradualmente
    if (depth < 2) {
        var progress = 0;

        function drawZoomStep() {
            progress +=  0.026;
            var currentSize = size * progress;

            var newPoints = [];
            for (var i = 0; i < 5; i++) {
                newPoints.push({
                    x: x + currentSize * cosValues[i],
                    y: y + currentSize * sinValues[i]
                });
            }

            ctxF.beginPath();
            ctxF.fillStyle = gradient; // Establece el color de relleno
            ctxF.moveTo(points[0].x, points[0].y);
            for (var i = 0; i < 5; i++) {
                ctxF.lineTo(newPoints[i].x, newPoints[i].y);
            }
            ctxF.closePath();
            ctxF.fill();

            if (progress < 1) {
                var id = requestAnimationFrame(drawZoomStep);
                animationIDs.push(id);
            }
        }

         var id = requestAnimationFrame(drawZoomStep);
         animationIDs.push(id);

    }

    // Restablecemos la composición global a su valor anterior
    //ctx.globalCompositeOperation = previousCompositeOperation;

    // Calcula los puntos de los pentágonos internos
    var innerPoints = [];
    for (var i = 0; i < 5; i++) {
        innerPoints.push({
            x: x + (size / 2) * cosValues[i],
            y: y + (size / 2) * sinValues[i]
        });
    }

    // Dibuja los pentágonos internos
    for (var i = 0; i < 5; i++) {
        drawSierpinskiPentagon2(innerPoints[i].x, innerPoints[i].y, size / 3, depth - 1, color);
    }

    //ctx.strokeStyle = "#1F1916";
}


function actualizarMarcador() {
    const marcadorNinios = document.getElementById('marca_ninios');
    marcadorNinios.textContent = numNinios;
    const marcadorNinias = document.getElementById('marca_ninias');
    marcadorNinias.textContent = numNinias;
}

function stopAllAnimations() {
    animationIDs.forEach(id => {
        cancelAnimationFrame(id);
    });
    // Limpiar el arreglo de IDs
    animationIDs = [];
}


function main(){

    stopAllAnimations();
    
    initParams();

    arbol1 = createTree(-Math.PI / 2 + Math.random() * Math.PI / 4);
    arbol2 = createTree(-Math.PI / 2 - Math.random() * Math.PI / 4);

    var checkbox = document.getElementById("acum_check");

    // Obtener el año seleccionado del slider
    var selectedYear = yearSlider.value; 

    if (checkbox.checked) {
        adopciones = all_adopciones.filter(adopcion => adopcion.year <= parseInt(selectedYear)); 
    } else {
        adopciones = all_adopciones.filter(adopcion => adopcion.year === parseInt(selectedYear)); 
    }

    // Obtener el año seleccionado del slider
    var selectedYear = yearSlider.value;

    maxNumFlowers = adopciones.length;
    numNinias = adopciones.filter(adopcion => adopcion.gender === 0).length; //Niñas = 0 ; Niños = 1
    numNinios = adopciones.filter(adopcion => adopcion.gender === 1).length; //Niñas = 0 ; Niños = 1

    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
    ctxF.clearRect(0, 0, canvasF.width, canvasF.height); // Limpiar el lienzo


    drawTree(arbol1);
    drawTree(arbol2);

    actualizarMarcador();
}


yearSlider.addEventListener('input', function () {
  
    main();
});


function checkboxChanged() {
    main();
}


