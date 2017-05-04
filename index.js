const vision = require('@google-cloud/vision')({
  // make sure to review https://cloud.google.com/vision/docs/quickstart
  projectId: 'your-google-cloud-project-id-here',
  keyFilename: 'your-google-cloud-json-key-file-name-here'
});

const fs = require ('fs');
var recursive = require('recursive-readdir');

let numFiles = 1;

//search for all file in the input directory
recursive('./input', ['input/.DS_Store', '.gitkeep'], function (err, files) {
  console.log('starting processing...');
  files.forEach(function(file){
    // The path to the local image file, e.g. "/path/to/image.png"
    const fileName = './'+file;
    transform(fileName);
  })
});

// Read a local image and save content as a text document
function transform(fileName){
  vision.readDocument(fileName)
  .then((results) => {
    const fullTextAnnotation = results[1].responses[0].fullTextAnnotation;
    const name = fileName+'.text';
    // write the text file in the ooutput directory
    fs.writeFile('./output/'+name , fullTextAnnotation.text, (err) => {
      if (err) throw err;
      console.log(numFiles + ' files have been saved!');
      numFiles++;
    });
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
}


