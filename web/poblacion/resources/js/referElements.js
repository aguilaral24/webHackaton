
function create_bbox(X, Y) {
    X = datos.map(dato =>dato.X)
    Y = datos.map(dato =>dato.Y)

    let Xmin = Math.min(...X) -2;
    let Xmax = Math.max(...X);
    let Ymin = Math.min(...Y) -5;
    let Ymax = Math.max(...Y);
    return {'xmin': Xmin, 'xmax': Xmax, 'ymin': Ymin, 'ymax': Ymax};
}

function drawBBox(bbox, color, lineWidth){
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.rect(x2screen(bbox.xmin,bbox), y2screen(bbox.ymin,bbox),
             x2screen(bbox.xmax,bbox)-x2screen(bbox.xmin,bbox),
             y2screen(bbox.ymax,bbox)-y2screen(bbox.ymin,bbox));
    ctx.stroke();
}


// Función para generar colores aleatorios
function generarColoresAleatorios(numColores,transparencia) {

    let colores = [];
    for (let i = 0; i < numColores; i++) {
      let r = Math.floor(Math.random() * 256); // Componente rojo (0-255)
      let g = Math.floor(Math.random() * 256); // Componente verde (0-255)
      let b = Math.floor(Math.random() * 256); // Componente azul (0-255)
      let a = transparencia; // Valor de transparencia (0-1)
      let color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

      colores.push(color);
    }
    return colores;
  }
  

// Función para generar una paleta de colores dinámicamente
function generarPaletaDeColores(valores,transparencia) {
    let paleta = {};
    let colores = generarColoresAleatorios(valores.length,transparencia); // Función que genera colores aleatorios
    for (let i = 0; i < valores.length; i++) {
      paleta[valores[i]] = colores[i];
    }
    return paleta;
}


//Funcion para generar cuadro de referencia
function dibujarReferenciaColores(ctx,bbox,clases,circs,textColor) {
    ctx.save()

    let xpos = x2screen(bbox.xmax,bbox) - 170;
    let ypos = y2screen(bbox.ymax,bbox) - 0;
    ctx.moveTo(xpos, ypos);
    
    // Iteramos sobre la paleta de colores y dibujar círculos y leyendas
    for (let clase of new Set(clases)) {
        // Dibujar círculo relleno con el color correspondiente
        ctx.beginPath();
        ctx.arc(xpos, ypos, 10, 0, 2 * Math.PI);

        //Colocación manual de colores de relleno
            switch(clase){
                case "niño":
                    ctx.fillStyle = "#89DBD6" 
                    break;
                case "niña":
                    ctx.fillStyle = "#DB89BE" 
                    break;                
            }

        ctx.fill();
    
        // Mostramos la leyenda asociada al color
        drawText (ctx,clase,xpos + 30,ypos,10,textColor,0)
        
        ypos += 30; // Incrementamos la posición para la siguiente leyenda
        ctx.closePath();
        
    }

    xpos = x2screen(bbox.xmax,bbox) - 20;
    ypos = y2screen(bbox.ymax,bbox) - 30;


    /*for (let circ of new Set(circs)) { 
        // Dibujamos circunferencia con el color correspondiente
        ctx.beginPath();
        ctx.arc(xpos, ypos, 10, 0, 2 * Math.PI);
        ctx.lineWidth = 1.5;

        switch(circ){
            case "niño":
                ctx.strokeStyle = "white"
                break;
            case "niña":
                ctx.strokeStyle = "white" 
                break;                 
        }

        ctx.stroke();
    
        // Mostramos la leyenda asociada al color
        drawText(ctx,circ,xpos + 30,ypos,10,textColor,0)
        
        ypos += 30; // Incrementar la posición para la siguiente leyenda
        ctx.closePath();
    }*/

    ctx.restore()
  }


// Función para dibujar las Bubbles
function drawBubbles(ctx,ctxRef,ctxRefB,bbox,datos,color,textColor,yearSelected,checks) {

    //Filtramos datos por año unicamente en caso de que año no sea 0
    if(yearSelected!=0){
        datos= datos.filter(d => d.Anio == yearSelected);
    }

    //Obtenemos columnas por separado
    X = datos.map(dato =>dato.X);
    Y = datos.map(dato =>dato.Y);

    if (checks) {
        if (checks.afrodescendiente){
            datos= datos.filter(d => d.TotalAfro != 0);
            Z = datos.map(dato =>dato.TotalAfro);
        }else if(checks.indigena){
            datos= datos.filter(d => d.TotalIndi != 0);
            Z = datos.map(dato =>dato.TotalIndi);
        }
        else{
            Z = datos.map(dato =>dato.Total);
        }
    }

    clase = datos.map(dato =>dato.C);
    circ = datos.map(dato =>dato.A);

    clearCanvas(ctxRef)

    // Dibujamos las burbujas
    drawBubblesFromData(ctx,ctxRefB, bbox, X, Y, Z, clase, circ);

    clearCanvas(ctxRef)
    dibujarReferenciaColores(ctxRef,bbox,clase,circ,"white");

}

function drawBubbleReferences(ctxRefB,scale,minRange,maxRange){
    let radiosRef = [1,5,10,50,100,750];   
    let yPos = 40
    let yStep = 73;
    let yStepProp = 1;

    //Colocamos rango en textos
    document.getElementById("minRange").innerText = minRange;
    document.getElementById("maxRange").innerText = maxRange;

    clearCanvas(ctxRefB)

    for(let radio of radiosRef){
        if(radio<=maxRange){
            ctxRefB.beginPath();
            ctxRefB.arc(40, yPos, scale(radio+1,1), 0, 2 * Math.PI);
            ctxRefB.fillStyle = "rgba(255, 3, 58, 1)";
            ctxRefB.fill();
            yPos += yStep; 
        }
        
        ctxRefB.closePath();
    }

    
}


function drawBubblesFromData(ctx,ctxRefB, bbox, X, Y, Z, clase, circ) {

    let bubbleAnimations = [];

    // Calculamos la escala y el radio
    let maxZ = Math.max(...Z);
    
    let scale = d3.scaleLinear()
        .domain([0, maxZ])
        .range([1, 50]);

    // Definimos colores
    let fillColors = {
        "niña": "#DB89BE",
        "niño": "#89DBD6"
    };

    let strokeColors = {
        "niño": "cyan",
        "niña": "pink",
    };

    //Colocamos Bubbles de referencia
    drawBubbleReferences(ctxRefB,scale,Math.min(...Z),Math.max(...Z));


    // Iteramos sobre los puntos de coordenadas X e Y
    for (let i = 0; i < X.length; i++) {
        let xScreen = x2screen(X[i], bbox);
        let yScreen = y2screen(Y[i], bbox);
        let radio = scale(Z[i] + 1);

        ctx.beginPath();
        ctx.arc(xScreen, yScreen, radio, 0, 2 * Math.PI);
        ctx.fillStyle = fillColors[clase[i]];
        ctx.fill();
        ctx.strokeStyle = strokeColors[circ[i]];
        ctx.lineWidth = radio * 0.13;
        ctx.stroke();

        let animationTime = Math.random() * 3000 + 300; // Tiempo aleatorio

        // Guardamos el estado de la animación para cada burbuja
        bubbleAnimations[i] = {
            xEnd: xScreen,
            yEnd: yScreen,
            radius: radio,
            fillStyle: fillColors[clase[i]],
            strokeStyle: strokeColors[circ[i]],
            borderWidth: radio * 0.13,
            animationTime: animationTime,
            startTime: performance.now(),
            progress: 0
        };
    }

    // Iniciamos la animación
    animateBubbles(ctx, bubbleAnimations);

}

function animateBubbles(ctx, bubbleAnimations) {
    function animate() {
        clearCanvas(ctx);

        // Dibujamos las burbujas 
        bubbleAnimations.forEach(bubble => {
            let elapsedTime = performance.now() - bubble.startTime;
            let progress = Math.min(elapsedTime / bubble.animationTime, 1);
            let x = bubble.xEnd;
            let y = bubble.yEnd - 10 * (1 - Math.pow(progress, 2)); // Efecto de desplazamiento hacia arriba suave

            ctx.beginPath();
            ctx.arc(x, y, bubble.radius, 0, 2 * Math.PI);
            ctx.fillStyle = bubble.fillStyle;
            ctx.fill();
            ctx.strokeStyle = bubble.strokeStyle;
            ctx.lineWidth = bubble.borderWidth;
            ctx.stroke();
            bubble.progress = progress;
        });

        // Solicita el siguiente fotograma de animación
        if (bubbleAnimations.some(animation => animation.progress < 1)) {
            requestAnimationFrame(animate);
        }
    }

    // Inicia la animación
    animate();
    
}


//Función que dibuja los ejes X y Y con sus respecticas divisiones y labels
function drawAxes(ctx, box, xlabel, ylabel, size, color, lineColor, lineWidth, datos, numDivisions) {

    xData = datos.map(dato =>dato.X)
    yData = datos.map(dato =>dato.Y)

    ctx.save();
    ctx.fillStyle = color;
    drawText(ctx, xlabel, x2screen(box.xmin + (box.xmax - box.xmin) / 2,box), y2screen(box.ymin,box) - 40, size, color, 0);
    drawText(ctx, ylabel, x2screen(box.xmin,box) - 50, y2screen(box.ymin + (box.ymax - box.ymin) / 2,box), size, color, -90);

    // Marcas en los ejes
    ctx.strokeStyle = lineColor; // Color de las marcas
    ctx.lineWidth = lineWidth; // Grosor de las líneas

    // Eje X
    ctx.beginPath();
    ctx.moveTo(x2screen(box.xmin,box), y2screen(box.ymin,box));
    ctx.lineTo(x2screen(box.xmax,box), y2screen(box.ymin,box));
    ctx.stroke();
    ctx.closePath();

    // Marcas en el eje x
    ctx.beginPath();
    const xRange = Math.max(...xData) - Math.min(...xData); // Rango de valores en xData
    const xStep = xRange / numDivisions; // Paso entre divisiones en el eje x
    for (let i = 0; i <= numDivisions; i++) {
        const xValue = Math.min(...xData) + xStep * i; // Valor en el eje x para esta marca
        const xPos = x2screen(xValue,box); // Posición vertical de la marca 

        // Agregar etiquetas de valor en el eje x
        drawText(ctx, xValue.toFixed(2), xPos -10 ,y2screen(box.ymin,box) - 20, 10, "gray", 0);

        ctx.moveTo(xPos, y2screen(box.ymin,box) - 5); // Mover al inicio de la marca
        ctx.lineTo(xPos, y2screen(box.ymin,box)); // Dibujar la marca
        ctx.stroke(); 
        ctx.closePath();
    }
    ctx.stroke(); 
    ctx.closePath();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(x2screen(box.xmin,box), y2screen(box.ymin,box));
    ctx.lineTo(x2screen(box.xmin,box), y2screen(box.ymax,box));
    ctx.stroke();
    ctx.closePath();

    // Marcas en el eje Y
    ctx.beginPath();
    const yRange = Math.max(...yData) - Math.min(...yData); // Rango de valores en yData
    const yStep = yRange / numDivisions; // Paso entre divisiones en el eje Y
    for (let i = 0; i <= numDivisions; i++) {
        const yValue = Math.min(...yData) + yStep * i; // Valor en el eje Y para esta marca
        const yPos = y2screen(yValue,box); // Posición vertical de la marca 

        // Agregar etiquetas de valor en el eje Y
        drawText(ctx, yValue.toFixed(2), x2screen(box.xmin,box) - 30, yPos + 10, 10, "gray", 0);

        ctx.moveTo(x2screen(box.xmin,box) - 5, yPos); // Mover al inicio de la marca
        ctx.lineTo(x2screen(box.xmin,box), yPos); // Dibujar la marca
        ctx.stroke(); 
        ctx.closePath();
    }
    ctx.stroke(); 
    ctx.closePath();

    ctx.restore();
}
