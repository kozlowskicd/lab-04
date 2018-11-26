'use strict';

const fs = require('fs');


/**
 * Bitmap -- receives a file name, used in the transformer to note the new buffer
 * @param filePath
 * @constructor
 */
function Bitmap(filePath) {
  this.file = filePath;
  let buffer = Buffer.from(filePath);
}

/**
 * Parser -- accepts a buffer and will parse through it, according to the specification, creating object properties for each segment of the fileb
 * @param buffer
 */
Bitmap.prototype.parse = function(buffer) {
  
  this.type = buffer.toString('utf-8', 0, 2);
  this.headerLength = buffer.readInt32LE(14);
  this.width = buffer.toString('hex', 18, 20);
  this.height = buffer.readInt16LE(22);
  this.bits = buffer.toString('hex', 28, 29);
  this.numberOfColors = buffer.readInt16LE(46);
  this.colors = buffer.toString('hex', 36, 432);
  this.imgOffset = buffer.readInt32LE(10);
  this.buffer = Buffer.from(buffer);
  // this.impColors = buffer.readInt32LE(50);
  // this.rawPixels = buffer.slice(this.pixelArrayOffset);
  // this.headers = buffer.slice(0, this.pixelArrayOffset);
};

/**
 * Transform a bitmap using some set of rules. The operation points to some function, which will operate on a bitmap instance
 * @param operation
 */
Bitmap.prototype.transform = function(operation) {
  // This is really assumptive and unsafe
  transforms[operation](this);
};

/**
 * Sample Transformer (greyscale)
 * Would be called by Bitmap.transform('greyscale')
 * Pro Tip: Use "pass by reference" to alter the bitmap's buffer in place so you don't have to pass it around ...
 * @param bmp
 */
const transformGreyscale = (img) => {
  let newImg = img;
  bitmap.newFile = bitmap.file.replace('assets', 'out');
  console.log('transformGreyscale function on:', img.file);
  //TODO: Figure out a way to validate that the bmp instance is actually valid before trying to transform it
  if(newImg.type !== 'BM') {return ('Not a bmp file');}
  //TODO: alter bmp to make the image greyscale ...;
  console.log(newImg);
  for(let i = 1146; i < 11460; i+=10){
   newImg[i] = 255;
  }

  fs.writeFile(bitmap.newFile, newImg.buffer, (err, out) => {
    if (err) {
      throw err;
    }

    console.log(`Bitmap Transformed: ${newImg.file}`);
  });
};

/**+
 * A dictionary of transformations
 * Each property represents a transformation that someone could enter on the command line and then a function that would be called on the bitmap to do this job
 */
const transforms = {
  greyscale: transformGreyscale,
};

// ------------------ GET TO WORK ------------------- //

function transformWithCallbacks() {

  fs.readFile(file, (err, buffer) => {

    if (err) {
      throw err;
    }

    bitmap.parse(buffer);

    bitmap.transform(operation);

    // Note that this has to be nested!
    //   Also, it uses the bitmap's instance properties for the name and thew new buffer
    
  });
}

// TODO: Explain how this works (in your README)
const [file, operation] = process.argv.slice(2);

let bitmap = new Bitmap(file);
// console.log(bitmap);
transformWithCallbacks();