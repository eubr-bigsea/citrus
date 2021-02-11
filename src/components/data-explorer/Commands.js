import jsep from 'jsep';

const translations = {
    pt: {
        changeColumnType: '<b>Alterar tipo</b> Tipo da coluna <em>%s</em> alterado de <em>%s</em> para <em>%s</em>.',
        deleteColumn: '<b>Excluir coluna</b> Coluna <em>%s</em> excluída.',
        duplicateColumn: '<b>Duplicar coluna</b> Coluna <em>%s</em> duplicada para <em>%s</em>.',
        moveColumn: 'Coluna %s movida para a posição %s.',
        renameColumn: '<b>Renomear coluna</b> Coluna <em>%s</em> renomeada para <em>%s</em>.',
        selectAttributes: '<b>Selecionar atributos</b> Lista de atributos selecionados e/ou ordenados.',

        filterRows: '<b>Filtrar registros</b> Filtrar registros com a condição <code>%s</code>.'
    },
    en: {

    }
};
class Step {
    constructor(operationSlug, parameters, description, background) {
        this.id = this.uuidv4()
        this.operationSlug = operationSlug;
        this.parameters = parameters;
        this.description = description;
        this.enabled = true;
        this.selected = false;
        this.status = 'WAITING';
        this.background = background;
    }
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
export default class DataExplorerCommand {
    constructor(serviceBus, steps, attributes, language) {
        this.serviceBus = serviceBus;
        this.steps = steps;
        this.attributes = attributes;
        this.language = language;

        this.serviceBus.$on('onFilter', this.filterRows.bind(this));
    }
    setAttributes(attributes) {
        this.attributes = [...attributes];
    }
    formatI18n(key, args) {
        const value = translations[this.language][key];
        return [...args].reduce((p, c) => p.replace(/%s/, c), value);
    }
    getAttributeNames() {
        return this.attributes.map((attribute) => attribute.label);
    }
    addStep(operationSlug, parameters, description, id, background) {
        const step = new Step(operationSlug, parameters, description, background);
        if (id) {
            step.id = id;
        }
        this.steps.push(step);
        return step;
    }
    // Row operations
    filterRows(attributeName, operator, attributeValue) {
        const expression = `${attributeName} ${operator} ${attributeValue}`;

        const tree = jsep(expression || '');
        jsep.addBinaryOp(">=", 1);
        jsep.removeBinaryOp('^');

        const description = this.formatI18n('filterRows', [expression]);
        const step = this.addStep('filter-selection', { expression },
            description
        );
        this.serviceBus.$emit('newStep',
            {
                'id': step.id,
                'operation': { 'slug': 'filter-selection' },
                'forms': {
                    'expression': {
                        'value': [
                            { expression, tree }
                        ]
                    },
                }
            }, description
        );
    }
    // Column operations
    renameColumn(attributeName, newName) {
        // Maps to projection operation
        // OK
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            const names = this.getAttributeNames();
            const aliases = [...names];
            aliases[pos] = newName;

            this.attributes[pos].label = newName;
            this.attributes[pos].id = newName;
            this.attributes[pos].key = newName;

            const description = this.formatI18n('renameColumn', [attributeName, newName]);

            const step = this.addStep('projection',
                {
                    attributes: names,
                    aliases: aliases
                },
                description
            );
            this.serviceBus.$emit('newStep',
                {
                    'id': step.id,
                    'operation': { 'slug': 'projection' },
                    'forms': {
                        'attributes': { 'value': names },
                        'aliases': { 'value': aliases }
                    }
                }, description
            );
        }
    }
    deleteColumn(attributeName) {
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            this.attributes.splice(pos, 1);
            const names = this.getAttributeNames();
            const description = this.formatI18n('deleteColumn', [attributeName]);

            const step = this.addStep('projection',
                { attributes: names, }, description);
            this.serviceBus.$emit('newStep',
                {
                    'id': step.id,
                    'operation': { 'slug': 'projection' },
                    'forms': {
                        'attributes': { 'value': names },
                    }
                }, description
            );
        }
    }
    selectAttributes(selectedAttributes) {
        this.attributes = selectedAttributes;

        const names = this.getAttributeNames();
        const description = this.formatI18n('selectAttributes', []);

        const step = this.addStep('projection',
            { attributes: names, }, description);

        this.serviceBus.$emit('newStep',
            {
                'id': step.id,
                'operation': { 'slug': 'projection' },
                'forms': {
                    'attributes': { 'value': names },
                }
            }, description
        );

    }
    duplicateColumn(attributeName, newName) {
        const names = this.getAttributeNames();
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        const cloned = { ... this.attributes[pos] };
        this.attributes.splice(pos + 1, 0, cloned);

        const aliases = [...names];

        cloned.id = newName;
        cloned.label = newName;
        cloned.key = newName;
        names.splice(pos + 1, 0, attributeName)
        aliases.splice(pos + 1, 0, newName);

        const description = this.formatI18n('duplicateColumn', [attributeName, newName]);
        const step = this.addStep('projection',
            { attributes: names, aliases: aliases }, description
        );
        this.serviceBus.$emit('newStep',
            {
                'id': step.id,
                'operation': { 'slug': 'projection' },
                'forms': {
                    'attributes': { 'value': names },
                    'aliases': { 'value': aliases },
                }
            }, description
        );
    }
    changeDataType() {

    }
    keepColumns() {

    }
    moveColumn(attributeName, position) {
        // Maps to projection operation
        //OK
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            this.attributes.splice(position, 0, this.attributes.splice(pos, 1)[0]);
            this.addStep('projection', {
                attributes: this.getAttributeNames(),
            }, this.formatI18n('moveColumn', [attributeName, position])
            );
        }
    }

    changeColumnType(attributeName, newType) {
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            const oldType = this.attributes[pos].type;
            this.attributes[pos].type = newType;
            this.addStep('cast',
                {
                    attributes: [attributeName],
                    type: newType
                },
                this.formatI18n('changeColumnType', [attributeName, oldType, newType])
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

    createStepsFromTasks(tasks) {
        tasks.forEach(task => {
            let step = null;

            switch (task.operation.slug) {
                case 'projection':
                    const attrs = task.forms.attributes.value;
                    this.addStep(task.operation.slug,
                        {
                            attributes: attrs,
                            aliases: attrs,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background,
                    );
                    break;
                case 'filter-selection':
                    this.addStep(task.operation.slug,
                        {
                            expression: task.forms.filter.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background,
                    );
                    break;
                default:
                    alert('Invalid operation ' + task.operation.slug);
                    return;
            }
            if (step)
                this.steps.push(step);
        });
    }
}