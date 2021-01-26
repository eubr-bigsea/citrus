const translations = {
    pt: {
        changeColumnType: '<b>Alterar tipo</b> Tipo da coluna <em>%s</em> alterado de <em>%s</em> para <em>%s</em>',
        deleteColumn: '<b>Excluir coluna</b> Coluna <em>%s</em> excluída',
        duplicateColumn: '<b>Duplicar coluna</b> Coluna <em>%s</em> duplicada para <em>%s</em>',
        moveColumn: 'Coluna %s movida para a posição %s',
        renameColumn: '<b>Renomear coluna</b> Coluna <em>%s</em> renomeada para <em>%s</em>',
    },
    en: {

    }
};
class Step {
    constructor(operationSlug, parameters, description) {
        this.id = this.uuidv4()
        this.operationSlug = operationSlug;
        this.parameters = parameters;
        this.description = description;
        this.deleted = false;
    }
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
export default class DataExplorerCommand {
    constructor(steps, fields, language) {
        this.steps = steps;
        this.fields = fields;
        this.language = language;
    }
    formatI18n(key, args) {
        const value = translations[this.language][key];
        return [...args].reduce((p, c) => p.replace(/%s/, c), value);
    }
    getAttributeNames() {
        return this.fields.map((field) => field.label);
    }
    addStep(operationSlug, parameters, description) {
        this.steps.push(new Step(operationSlug, parameters, description));
    }
    // Column operations
    changeDataType() {

    }
    deleteColumn(attribute) {
        const pos = this.fields.findIndex((field) => field.label === attribute);
        if (pos > -1) {
            this.fields.splice(pos, 1);
            const names = this.getAttributeNames();
            this.addStep('select',
                { attributes: names, },
                this.formatI18n('deleteColumn', [attribute])
            );
        }
    }
    keepColumns() {

    }
    duplicateColumn(attribute, newName) {
        const names = this.getAttributeNames();
        const pos = this.fields.findIndex((field) => field.label === attribute);
        const cloned = { ... this.fields[pos] };
        this.fields.splice(pos + 1, 0, cloned);

        const aliases = [...names];

        cloned.id = newName;
        cloned.label = newName;
        cloned.key = newName;
        names.splice(pos + 1, 0, attribute)
        aliases.splice(pos + 1, 0, newName);

        this.addStep('select',
            {
                attributes: names,
                aliases: aliases
            }, this.formatI18n('duplicateColumn', [attribute, newName])
        );
    }
    moveColumn(attribute, position) {
        // Maps to select operation
        //OK
        const pos = this.fields.findIndex((field) => field.label === attribute);
        if (pos > -1) {
            this.fields.splice(position, 0, this.fields.splice(pos, 1)[0]);
            this.addStep('select', {
                attributes: this.getAttributeNames(),
            }, this.formatI18n('moveColumn', [attribute, position])
            );
        }
    }
    renameColumn(attribute, newName) {
        // Maps to select operation
        // OK
        const pos = this.fields.findIndex((field) => field.label === attribute);
        if (pos > -1) {
            const names = this.getAttributeNames();
            const aliases = [...names];
            aliases[pos] = newName;

            this.fields[pos].label = newName;
            this.fields[pos].id = newName;
            this.fields[pos].key = newName;

            this.addStep('select',
                {
                    attributes: names,
                    aliases: aliases
                },
                this.formatI18n('renameColumn', [attribute, newName])
            );
        }
    }
    changeColumnType(attribute, newType){
        const pos = this.fields.findIndex((field) => field.label === attribute);
        if (pos > -1) {
            const oldType = this.fields[pos].type;
            this.fields[pos].type = newType;
            this.addStep('cast',
                {
                    attributes: [attribute],
                    type: newType
                },
                this.formatI18n('changeColumnType', [attribute, oldType, newType])
            );
        }
    }
    newColumnFromFormula() {

    }
    moveColumns() {

    }

    splitInvalidCellsIntoAnotherColumn() {

    }
    // Row operations
    removeRowsWithEmptyCell() {

    }
    removeRowsWithInvalidCell() {

    }
    // Boolean operations
    negate() {

    }
    // Type-independent operations
    findAndReplace() {

    }

    // Missing values operation
    fillWithConstantValue() {

    }
    fillMissingValues() {
        // With value, with formula, with previous value, with average, with moda, with median
    }

    // Text operations
    concatenate() {

    }
    concatenateColumns() {

    }
    convertToLowerCase() {
        console.debug('toLowerCase')
    }
    convertToLowerCase() {
        console.debug('toUpperCase')
    }
    applyHash() {

    }
    extractNGrams() {

    }
    extractWithRegex() {

    }
    trim() {

    }
    capitalize() {

    }
    normalize() {

    }
    splitAndFold() {

    }
    substring() {

    }
    encode() {

    }
    decode() {

    }
    escapeXML() {

    }
    unescapeXML() {

    }
    //Array operations
    concatenateArrays() {

    }
    convertToArray() {

    }
    extractFromArray() {

    }
    foldArray() {

    }
    sortArray() {

    }
    // Numeric operations
    discretize() {

    }
    extractNumbersFromText() {

    }
    round() {

    }
    //Date operations
    extractDatePart() {

    }
    dateDifference() {

    }
    formatDate() {

    }
    parseToDate() {

    }
    addPeriodToDate() {

    }
    unixTimestampToDate() {

    }
    // Filter operations
    filterByRange() {

    }
    filterWithFormula() {

    }
    filterInvalidRows() {

    }
    filterOnValue() {

    }
    // JSON related operations
    nestColumns() {

    }
    unnestColumns() {

    }
    // Flag rows: how to proceed

}