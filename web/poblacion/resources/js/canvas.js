
function InitConfigCanvas(id,width,height){
    // Get the canvas element
    var canvas = document.getElementById(id);

    // Set the canvas size to full screen
    canvas.width = width;
    canvas.height = height;

    // Get the drawing context
    var ctx = canvas.getContext("2d");

    // Flip the y-axis and move the origin to lower left corner
    ctx.scale(1, -1);
    ctx.translate(0, -canvas.height + 0);
    

    //Fill the canvas 
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Color transparente
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return {canvas,ctx};
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Color transparente
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Compute the transformation from data space to screen space:

function x2screen(x,bbox){
    width = canvas.width - padding.left - padding.right;
    return (x - bbox.xmin) * width / (bbox.xmax - bbox.xmin);
}

function y2screen(y,bbox){
    height = canvas.height - padding.bottom - padding.top;
    return (y - bbox.ymin) * height / (bbox.ymax - bbox.ymin);
}