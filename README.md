# pdfmake-fluent-interface [![GitHub][github_img]][github_url]
Fluent Interface for PDFMake

This JavaScript class is a Fluent Interface content generator for PDFMake.

This interface allows you to have a more readable code when generating PDF Files with PDFMake. This interface does not call PDFMake itself. Instead, it allows for you to write a code that is more natural for reading and understanding, and then, the outcome will be a content string that can be used with PDFMake.

A few examples:

```
var pfi = new PdfMakeFluentInterface();

//This will create a single line paragraph
pfi.addParagraph('Single Paragraph');

//This will automatically create a Paragraph
pfi.addText('Hello World!');  

//This will generate a single line with multiple styling
pfi.addParagraph().addText('This is in ').addText('bold', { bold: true}); 

//This will generate a table with a header row, 3 columns, and multiple rows that can be fecthed from a DB
pfi.addTable().addHeaderRow().addCol("Last Name").addCol("First Name").addCol("Score");
for (...)
  pfi.addRow()
    .addCol(lastNameVar)
    .addCol(firstNameVar)
    .addCol(scoreVar, { color : scoreVar < 7 : 'red' : 'green' });
```

=====================================================================================

pdfmake is a Client/server side PDF printing in pure JavaScript.
More info at http://pdfmake.org/

pdfmake is developed and kept by Bartek Pampuch (https://github.com/bpampuch)
