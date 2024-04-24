

let canvasC = InitConfigCanvas("myCanvas",window.innerWidth,window.innerHeight);
let canvas = canvasC.canvas;
let ctx = canvasC.ctx;

let canvasR = InitConfigCanvas("canvasRef",window.innerWidth,window.innerHeight);
canvasRef = canvasR.canvas;
let ctxRef = canvasR.ctx;

let canvasD = InitConfigCanvas("canvasRep",window.innerWidth,window.innerHeight);
canvasRep = canvasD.canvas;
let ctxRep = canvasD.ctx;

let canvasRB = InitConfigCanvas("canvasRefBubbles",300,450);
canvasRefB = canvasRB.canvas;
let ctxRefB = canvasRB.ctx;


let padding;
padding = {bottom: -50, left: 300, right: 150, top: 160};
let bbox;



//*********************************************************************************************************************

// Ruta al archivo CSV
var rutaArchivo = './data/poblacion.csv';
let raw_data;

function cargarCSV() {
    return new Promise((resolve, reject) => {
        // Usamos D3.js para cargar el archivo CSV y
        d3.csv(rutaArchivo).then(function(csv_data) {
            raw_data = csv_data;
            resolve();
        }).catch(function(error) {
            console.error('Error al cargar el archivo CSV:', error);
        });
    });
}


///*********************************************************************************************************************

async function init() {
    try {
        await cargarCSV(); 
        datos=raw_data;
          
        
        //********************************************************************************************************************/
        // Obtenemos columnas necesarias transformadas
        /*********************************************************************************************************************/

        try{
            //datos = transformData(datos,"main");
            datos = getDataArray(datos,"map")
        }catch(e){
            console.error("No fue posible obtener y transformar los datos",e)
        }


        /******************************************************************************************************************* */
        // Ordenamos datos
        /******************************************************************************************************************* */

        try{
            datos = orderDataByColumn(datos, "Total", true);   //Descendente
        }catch(e){
            console.erro("No fue posible aplicar el ordenamiento a los datos",e)
        }


        // *********************************************************************************************************************
        // 1. Calculamos bounding boxes para el dataset
        // *********************************************************************************************************************

        try{
            bbox = create_bbox(datos)
        }
        catch(e){
            console.error("No fue posible calcular el tamaño del bounding box",e);
        }

        

        //*********************************************************************************************************************
        /* Translate Origin point*/
        //*********************************************************************************************************************
        try{
            // Put the origin at the lower left corner of the visible area:
            ctx.translate(padding.left, padding.bottom);
        }
        catch(e){
            console.error("No fue posible definir el origen de datos",e)
        }

        try{
            drawRepublic(bbox,ctxRep);
        }
        catch(e){
            console.error("No fue posible definir el mapa de la republica",e)
        }
        
        //*********************************************************************************************************************
        // Draw bubbles
        //*********************************************************************************************************************
        
        try{
            drawBubbles(ctx,ctxRef,ctxRefB,bbox,datos,"pink","white",2015,radioState);
        }catch(e){
            console.error("No fue posible dibujar las burbujas",e)
        }
        
        

    } catch (error) {
        console.error('Error al procesar datos:', error);
    }
}

init();


/*****LIsteners para interacción*********/
const yearSlider = document.getElementById('yearSlider');
const radios = document.querySelectorAll('.Impactcheck');

let selectedYear = yearSlider.value; // Obtener el año 
let radioState = getRadioState();


// Función para dibujar las burbujas con los parámetros seleccionados
function drawBubblesWithParams() {

    drawBubbles(ctx, ctxRef,ctxRefB, bbox, datos, "pink", "white", selectedYear, radioState);
}

// Listener deslizante
yearSlider.addEventListener('change', function() {
    selectedYear = yearSlider.value;
    drawBubblesWithParams();
});


// Listener de los botones de radio
radios.forEach(radio => {
    radio.addEventListener('change', function() {
        radioState = getRadioState(); // Actualiza el estado de los botones de radio
        drawBubblesWithParams();
    });
});

function getRadioState() {
    return {
        afrodescendiente: document.getElementById('afrodescendiente').checked,
        general: document.getElementById('general').checked,
        indigena: document.getElementById('indigena').checked
    };
}


