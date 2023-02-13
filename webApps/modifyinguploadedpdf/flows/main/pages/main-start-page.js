define([], () => {
  'use strict';

 var PageModule = function PageModule() {};


    PageModule.prototype.addPDFDocument = function(arg1) {
      return new Promise(
        resolve=>{
          const blobURL = URL.createObjectURL(arg1);
          const reader  = new FileReader();
          reader.addEventListener("load", function () {
            // convert image file to base64 string         
            resolve({ data: reader.result, url: blobURL });
          }, false);
          if (arg1) {
            reader.readAsDataURL(arg1);
          }
        }
      );      
    };

  PageModule.prototype.createUpdatePDF = async function (arg1 , inputText ) {
    // declare constants from the pdf-lib API.
    const { degrees, PDFDocument, rgb, StandardFonts , grayscale} = PDFLib;
    console.log("createUpdatePDF: input file " + arg1);
    console.log("createUpdatePDF: input argument " + inputText);
    const existingPdfBytes = arg1;
    // create a PDFDocument entity and load the input pdf byte array 
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    // get an array of all the pages contained in this document. The pages are stored in the array in the same order that they are rendered in the document with the first page page in the 0 position. 
    const pages = pdfDoc.getPages();
    // get the first page rendered at the index = 0 of the document
    const firstPage = pages[0];
    // get the first page width and height
    const { width, height } = firstPage.getSize();
    console.log("createUpdatePDF: The width : " + width + "and height : " + height +" of the first page");
    // Embed a Helvetica font into the pdf document
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // write the text that you had entered and draw a rectangle 
    firstPage.drawText(inputText, {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
    });
    // createUpdatePDF: save and serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };


  PageModule.prototype.displayPDFDocument = function (arg1) {
    const bytes  = new Uint8Array( arg1 );
    // create a new blobfrom the byte array with type of application: pdf 
    const blob   = new Blob( [ bytes ], { type: "application/pdf" } );
    // create the url of the generated blob entity
    const newdocURL = URL.createObjectURL(blob);
    // return the updated pdf's url
    return newdocURL;
  };

  PageModule.prototype.downloadPDFFile = function (arg1) {
    download(arg1, "pdf-lib_modification_example.pdf", "application/pdf");
  };


  PageModule.prototype.createPDF = async function (arg1) {
    const { degrees, PDFDocument, rgb, StandardFonts , grayscale} = PDFLib;
    console.log("createPDF: input file " + arg1);
    // create a PDFDocument entity and load the input pdf byte array 
    const pdfDoc2 = await PDFDocument.create();
    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc2.embedFont(StandardFonts.TimesRoman);
    // Add a blank page to the document
    const page2 = pdfDoc2.addPage();
    // Get the width and height of the page
    const { width2, height2 } = page2.getSize();
    // Draw a string of text toward the top of the page
    const fontSize2 = 30;
    page2.drawText(arg1, {
      x: 50,
      y: 450,
      size: fontSize2,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });
    // createUpdatePDF: save and serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes2 = await pdfDoc2.save();
    return pdfBytes2;
  };
  
  return PageModule;
});
