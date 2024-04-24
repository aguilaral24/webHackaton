function drawText (ctx,text,x,y,size,color,angle) {
    // Save the canvas transform:
    let the_canvas = ctx.save();

    ctx.globalAlpha = 1;
    ctx.font = "bold " + size + "px Arial";
    ctx.fillStyle = color;
    //ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.translate(x,y);
    ctx.scale(1,-1);
    ctx.rotate(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.fillText(text , 0 , 0);
    ctx.fill();
    ctx.closePath();
    // Restore the canvas transform:
    ctx.restore(the_canvas);
   
   };