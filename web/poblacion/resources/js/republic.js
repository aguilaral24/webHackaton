

// Cargamos el GeoJSON con D3
function drawRepublic(bbox,ctx) {
    return new Promise((resolve, reject) => {
        d3.json('./data/states.geojson').then(data => {
            dibujarPoligonos(data,bbox,ctx);
            resolve();
        }).catch(function(error) {
            console.error('Error al cargar el archivo CSV:', error);
        });
    });
}

// Definimos la función para dibujar los polígonos
function dibujarPoligonos(geojson, bbox,ctx) {
    // Configuramos el estilo de trazo para que tenga el color deseado
    ctx.strokeStyle = 'white'; 
    ctx.lineWidth = 1; 

    // Dibujamos cada polígono
    geojson.features.forEach(feature => {
        const geometry = feature.geometry;
        if (geometry.type === 'Polygon') {
            dibujarPoligono(geometry.coordinates, bbox,ctx);
        } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach(multipolygon => {
                dibujarPoligono(multipolygon, bbox,ctx);
            });
        }
    });
}

// Función para dibujar un polígono
function dibujarPoligono(polygon, bbox,ctx) {
    ctx.beginPath();
    polygon.forEach(ring => {
        ring.forEach((point, index) => {
            const x = x2screen(point[0], bbox);
            const y = y2screen(point[1], bbox);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
    });
    ctx.closePath();
    ctx.stroke();
}