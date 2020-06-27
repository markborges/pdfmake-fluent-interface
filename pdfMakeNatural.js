class PdfMakeNatural {
    context = 'none';
    contextObj = null;
    
    definition = { content: [] };
    
    constructor() {
        this.contextObj = this.definition.content;
    }
    
    checkContext(newOperation) {
        var validContext = false;
        //Check if new Operation can execute based on (current) context.
        switch (newOperation) {
            case 'text': 
            case 'paragraph': 
            case 'table':
                validContext = (this.context=='none' ||
                                this.context=='paragraph' ||
                                this.context=='col');
                break;
            case 'row':
                validContext = (this.context=='table' ||
                                this.context=='col');
                break;
            case 'col':
                validContext = (this.context=='row'||
                                this.context=='col'||
                                this.context=='paragraph');
                break;
        }
        
        if (!validContext)
            throw new Error('New Operation "' + newOperation + "' not supported after '" + this.context + "'.");
    }
    addParagraph(text, options) {
        this.checkContext('paragraph');
        
        var newText = { text: '' };
        if (typeof(text)==="object")
            newText = text;

        this.contextObj.push(newText);
        this.contextObj = newText;

        this.context = 'paragraph';
        
        if (options) {
            if (options.colSpan)
                newText.colSpan = options.colSpan;
            if (options.rowSpan)
                newText.rowSpan = options.rowSpan;
        }
        
        if (text && text!='' && typeof(text)!=="object")
            this.addText(text, options);
        
        return this;
    }
    addText(text, options) {
        this.checkContext('text');
        
        var textElement = text;
        if (options) {
            textElement = this.convertToComplexText(textElement);
            textElement = this.addTextOptions(textElement, options);
        }
        
        if (this.context!='paragraph') {
            this.addParagraph(textElement, options);
        } else {
            if (this.contextObj.text == '')
                this.contextObj.text = textElement;
            else if (Array.isArray(this.contextObj.text))
                this.contextObj.text.push(textElement);
            else if (typeof(this.contextObj.text) === "object")
                this.contextObj.text = { text: [ this.contextObj.text] };
        }
        
        return this;
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
    addTable() {
        this.checkContext('table');

        var newTable = { table: { headerRows: 0, body: [] } };
        this.currentTable = newTable;
        
        this.contextObj.push(newTable);
        this.contextObj = newTable;
        this.context = 'table';
        return this;
        
    }
    addHeaderRow() {
        this.checkContext('row');
        
        var newRow = [];
        this.currentRow = newRow;
        
        this.currentTable.table.headerRows++;
        this.currentTable.table.body.push(newRow);
        this.contextObj = newRow;
        this.context = 'row';
        return this;
    }
    addRow() {
        this.checkContext('row');
        
        var newRow = [];
        this.currentRow = newRow;
        
        this.currentTable.table.body.push(newRow);
        this.contextObj = newRow;
        this.context = 'row';
        return this;
    }
    addCol(text, options) {
        this.checkContext('col');
        this.contextObj = this.currentRow;
        this.context = 'col';
        
        this.addText(text, options);
        
        this.context = 'col';

        return this;
    }
    getDefinition() {
        return this.definition;
    }
}
