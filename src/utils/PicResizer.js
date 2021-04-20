async function resizeMe(img) {
    var max_width = 500;
    var max_height = 500;

    var canvas = document.createElement('canvas');
    const bitmap = await createImageBitmap(img)
    var width = bitmap.width;
    var height = bitmap.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > max_width) {
        height = Math.round(height *= max_width / width);
        width = max_width;
      }
    } else {
      if (height > max_height) {
        width = Math.round(width *= max_height / height);
        height = max_height;
      }
    }
    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    var blobBin = atob(canvas.toDataURL("image/jpeg", 0.7).split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});


    return file; // get the data from canvas as 70% JPG (can be also PNG, etc.)
  
  }
  export default resizeMe;