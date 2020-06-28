class PdfMakeFluentInterface {
    definition = {
        header : '',
        footer : '',
        background : '',
        content : [],
        styles : {},
        defaultStyle : {},
        images : {},
        watermark : {},
        pageSize : 'A4',
        pageOrientation : '',
        pageMargins : [],
        info : {
            title : '',
            author : '',
            subject : ''
        },
        compress : true,
        userPassword : ''
    }
    
    //Context Controllers
    //Controls the general context
    contextStack = new PdfMakeFluentInterface.Stack(); 
    //Conrols which node should be used when adding new elements
    addStackContext = new PdfMakeFluentInterface.Stack();
    addParagraphContext = new PdfMakeFluentInterface.Stack();
    addColumnSetContext = new PdfMakeFluentInterface.Stack();
    addColumnContext = new PdfMakeFluentInterface.Stack();
    addColumnSource = new PdfMakeFluentInterface.Stack();
    addTableContext = new PdfMakeFluentInterface.Stack();
    addRowContext = new PdfMakeFluentInterface.Stack();
    addListContext = new PdfMakeFluentInterface.Stack();
    addListItemContext = new PdfMakeFluentInterface.Stack();
    addNodeTextContext = new PdfMakeFluentInterface.Stack();
    addNodeLeafContext = new PdfMakeFluentInterface.Stack();
    
    constructor() {
        this.definition.content = [];
        this.contextStack.push('root');
        this.addStackContext.push(this.definition.content);
        this.addParagraphContext.push(this.definition.content);
        this.addColumnSetContext.push(this.definition.content);
        this.addTableContext.push(this.definition.content);
        this.addListContext.push(this.definition.content);
        this.addNodeTextContext.push(this.definition.context);
        this.addNodeLeafContext.push(this.definition.content);        
    }
    /*
    newNode(type,parent,value) {
        return { type : type, parent : parent, value : value, children : [] };
    }
    getCurrentNodeType() {
        return this.nodeTree[this.nodeTree.length-1].type;
    }
    */
    contextError(operation) {
        throw new Error('Context error when executing operation ""');
    }
    //Container Elements
    addStack(text, options) {
        //Stack Object
        //{ stack: [] }
        if (this.addStackContext.isEmpty())
            this.contextError('addStack');
        
        var newStack = { stack: [text] };
        if (options)
            addTextOptions(newStack, options);
        
        this.addStackContext.peek().push(newStack);
        this.addStackContext.push(newStack.stack);
        this.addParagraphContext.push(newStack.stack);
        this.addColumnSetContext.push(newStack.stack);
        this.addTableContext.push(newStack.stack);
        this.addListContext.push(newStack.stack);
        this.addNodeTextContext.push(newStack.stack);
        this.addNodeLeafContext.push(newStack.stack);
            
        return this;
    }
    addParagraph(text, options) {
        //Paragraph is the array within a Stack
        //{ stack: [] }
        if (this.addParagraphContext.isEmpty())
            this.contextError('addParagraph');
        
        var newTextElement = [this.newTextElement(text, options)];
        this.addParagraphContext.peek().push(newTextElement);
        this.addStackContext.push(newTextElement);
        this.addParagraphContext.push(newTextElement);
        this.addColumnSetContext.push(newTextElement);
        this.addTableContext.push(newTextElement);
        this.addListContext.push(newTextElement);
        this.addNodeTextContext.push(newTextElement);
        this.addNodeLeafContext.push(newTextElement);
        return this;
    }
    addColumnSet(text, options) {
        //Columns Object
        //{ columns: [] }
        if (this.addColumnSetContext.isEmpty())
            this.contextError('addColumnSet');
        
        var newColumnSet = { columns : [], columnGap: 20 };
        //newColumnSet.columns.push(this.newTextElement(text, options));
        this.addColumnSetContext.peek().push(newColumnSet);
        this.addColumnContext.push(newColumnSet.columns);
        this.addColumnSource.push('columnset');
        
        return this;
    }
    addColumn(text, options) {
        //Column is an element within the ColumnSet Array
        //{ columns: [] }
        //Column can also be an element within a Table Body Array
        if (this.addColumnContext.isEmpty())
            this.contextError('addColumn');
        
        var newTextElement;
        if (this.addColumnSource.peek()=='row') {
            //This is a column inside a Table
            newTextElement = { stack: [ {text : [this.newTextElement(text, options)] } ] };
            if (options) {
                if (options.colSpan)
                    newTextElement.colSpan = options.colSpan;
                if (options.rowSpan)
                    newTextElement.rowSpan = options.rowSpan;
            }
            this.addColumnContext.peek().push(newTextElement);
            this.addStackContext.push(newTextElement.stack);
            this.addParagraphContext.push(newTextElement.stack);
            this.addColumnSetContext.push(newTextElement.stack);
            this.addTableContext.push(newTextElement.stack);
            this.addListContext.push(newTextElement.stack);
            this.addNodeTextContext.push(newTextElement.stack[0].text);
            this.addNodeLeafContext.push(newTextElement.stack);
        } else {
            //This is a column inside a ColumnSet
            newTextElement = [this.newTextElement(text, options)];
            this.addColumnContext.peek().push(newTextElement);
            this.addStackContext.push(newTextElement);
            this.addParagraphContext.push(newTextElement);
            this.addColumnSetContext.push(newTextElement);
            this.addTableContext.push(newTextElement);
            this.addListContext.push(newTextElement);
            this.addNodeTextContext.push(newTextElement);
            this.addNodeLeafContext.push(newTextElement);
        }
        return this;
    }
    addTable(options) {
        //Table Object
        //{ table: { body: [[],[]] } }
        if (this.addTableContext.isEmpty())
            this.contextError('addTable');
        
        var newTableElement = { table : { body : [] }, headerRows : 0 };
        this.addTableContext.peek().push(newTableElement);
        this.addRowContext.push(newTableElement);
        
        return this;
    }
    addHeaderRow(text, options) {
        //Row is an element within the Body Array
        //{ table: { body: [[],[]] } }
        if (this.addRowContext.isEmpty())
            this.contextError('addHeaderRow');
        
        var newTableRow = [];
        this.addRowContext.peek().headerRows++;
        this.addRowContext.peek().table.body.push(newTableRow);
        this.addColumnContext.push(newTableRow);
        this.addColumnSource.push('row');
        
        return this;
    }
    addRow(text, options) {
        //Row is an element within the Body Array
        //{ table: { body: [[],[]] } }
        if (this.addRowContext.isEmpty())
            this.contextError('addRow');
        
        var newTableRow = [];
        this.addRowContext.peek().table.body.push(newTableRow);
        this.addColumnContext.push(newTableRow);
        this.addColumnSource.push('row');
        return this;
    }
    /*addCol(text, options) { -- This should be handled by the addColumn function
        //Col is an element within each element of the Body Array
        //{ table: { body: [[],[]] } }
        this.objectList.push(['col', text, options]);
        this.currentContext = 'col';
        return this;
    }*/
    addList(text, options) {
        //List Object - Bulleted
        //{ ul: [] }
        if (this.addListContext.isEmpty())
            this.contextError('addList');
        
        var newList = { ul : [] };
        this.addListContext.peek().push(newList);
        this.addListItemContext.push(newList.ul);
        return this;
    }
    addNumberedList(text, options) {
        //List Object - Numbered
        //{ ol: [] }
        if (this.addListContext.isEmpty())
            this.contextError('addNumberedList');
        
        var newList = { ol : [] };
        this.addListContext.peek().push(newList);
        this.addListItemContext.push(newList.ol);
        return this;
    }
    addListItem(text, options) {
        //List Item is an element of the List Array
        //{ ul: [] } || { ol: [] }
        if (this.addListItemContext.isEmpty())
            this.contextError('addListItem');
        
        var newTextElement = [this.newTextElement(text, options)];
        this.addListItemContext.peek().push(newTextElement);
        this.addStackContext.push(newTextElement);
        this.addParagraphContext.push(newTextElement);
        this.addColumnSetContext.push(newTextElement);
        this.addTableContext.push(newTextElement);
        this.addListContext.push(newTextElement);
        this.addNodeTextContext.push(newTextElement);
        this.addNodeLeafContext.push(newTextElement);
        return this;
    }
    
    //Individual Elements
    addTOC(text, option) {
        /* Future implementation */
        if (this.addNodeLeafContext.isEmpty())
            this.contextError('addTOC');
        return this;
    }
    addQR(qrString, options) {
        //QR Element
        //{ qr: '' }
        if (this.addNodeLeafContext.isEmpty())
            this.contextError('addQR');

        var newQR = { qr : qrString };
        if (options) {
            if (options.foreground) 
                newQR.foreground = options.foreground;
            if (options.background) 
                newQR.background = options.background;
            if (options.fit) 
                newQR.fit = options.fit;
            if (options.version) 
                newQR.version = options.version;
            if (options.eccLevel) 
                newQR.eccLevel = options.eccLevel;
            if (options.mode) 
                newQR.mode = options.mode;
            if (options.mask) 
                newQR.mask = options.mask;
        }
        this.addNodeLeafContext.peek().push(newQR);
        return this;
    }
    newTextElement(text, options) {
        var newElement = '';
        
        if ((typeof(text)==='string'||typeof(text)==='number'||typeof(text)==='boolean') && !options)
            newElement = text;
        else { 
            newElement = { text: text };
            if (options)
                this.addTextOptions(newElement, options);
        }
        return newElement;
    }
    addText(text, options) {
        //Text Element
        //{ text: [] }
        if (this.addNodeTextContext.isEmpty())
            this.contextError('addText');
        
        var newTextElement = this.newTextElement(text, options);
        this.addNodeTextContext.peek().push(newTextElement);
        return this;
    }
    addImage(imageData, options) {
        //Image Element
        //{ image : '' }
        if (this.addNodeLeafContext.isEmpty())
            this.contextError('addImage');
        var newImage = { image : imageData };
        this.addNodeLeafContext.peek().push(newImage);
        return this;
    }
    addSVG(svgString, options) {
        //SVG Element
        //{ svg : '' }
        if (this.addNodeLeafContext.isEmpty())
            this.contextError('addSVG');
        var newSVG = { svg : svgString };
        this.addNodeLeafContext.peek().push(newSVG);
        return this;
    }
    
    //Operational step
    goBack() {
        //Check what to do
        return this;
    }
    
    getDefinition() {
        //return this.definition;
        //this.buildContentArray();
        return this.definition;
    }
    getNextElementContext(index) {
        if (index<this.objectList.length)
            return this.objectList[index][0];
        else
            return "";
    }
    
    addTextOptions(element, options) {
        if (!options)
            return element;
        
        element = this.convertToComplexText(element);
        
        if (options.font)
            element.font = options.font;
        if (options.fontSize)
            element.fontSize = options.fontSize;
        if (options.fontFeatures)
            element.fontFeatures = options.fontFeatures;
        if (options.lineHeight)
            element.lineHeight = options.lineHeight;
        if (options.bold)
            element.bold = options.bold;
        if (options.italics)
            element.italics = options.italics;
        if (options.alignment)
            element.alignment = options.alignment;
        if (options.color)
            element.color = options.color;
        if (options.background)
            element.background = options.background;
        if (options.markerColor)
            element.markerColor = options.markerColor;
        if (options.decoration)
            element.decoration = options.decoration;
        if (options.decorationStyle)
            element.decorationStyle = options.decorationStyle;
        if (options.decorationColor)
            element.decorationColor = options.decorationColor;
        if (options.style)
            element.style = options.style;

        return element;
    }
    convertToComplexText(element) {
        if (typeof(element)=="string")
            return { text: element };
        else
            return element;
    }
    
}
PdfMakeFluentInterface.Stack = class {
    constructor() {
        this.stack = [];
    }
    push(item) {
        this.stack.push(item);
    }
    pop() {
        if (this.stack.length>0)
            return this.stack.pop();
        else
            return null;
    }
    peek() {
        if (this.stack.length>0)
            return this.stack[this.stack.length-1];
        else
            return null;
    }
    isEmpty() {
        return (this.stack.length==0);
    }
    length() {
        return this.stack.length;
    }
}
