import jsep from 'jsep';
import VueI18n from 'vue-i18n';
import Vue from 'vue';
// FIXME: Must be loaded
const OPERATIONS = new Map();
OPERATIONS.set('projection', { id: 6, input_id: 3, output_id: 4 });
OPERATIONS.set('data-reader', { id: 18, output_id: 35 });
OPERATIONS.set('filter-selection', { id: 5, input_id: 1, output_id: 2 });
OPERATIONS.set('sort', { id: 32, input_id: 61, output_id: 62 });
OPERATIONS.set('transformation', { id: 7, input_id: 29, output_id: 30 });
OPERATIONS.set('cast', { id: 140, input_id: 327, output_id: 326 });
OPERATIONS.set('sample', { id: 28, input_id: 55, output_id: 56 });
OPERATIONS.set('clean-missing', { id: 21, input_id: 44, output_id: 43 });

const messages = {
    pt: {
        attribute: 'Atributo|Atributos|Atributo(s)',
        alias: 'Novo nome',
        changeAttributeType: '<b>Alterar tipo</b> Tipo do atributo <em>%s</em> alterado de <em>%s</em> para <em>%s</em>.',
        deleteAttribute: '<b>Excluir atributo(s)</b> <code>%s</code>.',
        dateFormat: '<b>Formatar data</b> em <code>%s</code>.',
        dateExtract: '<b>Extrair partes</b> da data em <code>%s</code>.',
        dateTruncate: '<b>Truncar data</b> em <code>%s</code>.',
        duplicateAttribute: '<b>Duplicar atributo</b> <code>%s</code> para <code>%s</code>.',
        filterRows: '<b>Filtrar registros</b> com a condição <code>%s</code>.',
        lower: '<b>Converter para minúsculas</b> <code>%s</code>.',
        round: '<b>Arredondar</b> <code>%s</code>.',
        renameAttribute: '<b>Renomear atributo</b> <code>%s</code> para <code>%s</code>.',
        findAndReplaceAttribute: '<b>Localizar</b> <code>%s</code> e <b>substituir</b> por <code>%s</code> em <code>%s</code>.',
        selectAttributes: '<b>Selecionar atributos</b> Lista de atributos selecionados e/ou ordenados.',
        sortAttributes: '<b>Ordenar registros</b> por <code>%s</code>',
        limit: '<b>Limitar</b> aos primeiros %s registro(s)',

        move: '<b>Mover</b> <code>%s</code> para a posição %s',
        negate: '<b>Inverted o valor</b> de %s.',
        parseToDate: '<b>Converter</b> <code>%s</code> para data usando formato(s).',
        substring: '<b>Truncar</b> <code>%s</code>',
        strip_accents: '<b>Remover acentos</b> em <code>%s</code>',
        transformAttributes: '<b>Aplicar transformação</b> <code>%s</code>',
        split: '<b>Dividir</b> <code>%s</code> em palavras.',
        sort_array: '<b>Ordenar lista</b> <code>%s</code>.',
        title: '<b>Converter iniciais para maiúsculas em</b> <code>%s</code>',
        trim: '<b>Remove espaços vazios no início e no fim de</b> <code>%s</code>',
        upper: '<b>Converter para maiúsculas</b> <code>%s</code>',

        'handleMissing.removeRowUsingAttribute': '<b>Remover linhas</a> onde o atributo <code>%s</code> é nulo',
    },
    en: {

    }
};
const i18n = new VueI18n({
    locale: 'pt',
    fallbackLocale: 'en',
    messages
});
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getTreeFromExpression(expression) {
    jsep.addBinaryOp(">=", 1);
    jsep.removeBinaryOp('^');
    return jsep(expression || '');
}

function _formatI18n(language, key, args) {
    const value = messages[language][key];
    if (value) {
        return [...args].reduce((p, c) => p.replace(/%s/, Array.isArray(c)
            ? c.join(', ') : c), value);
    } else {
        return `Key ${key} not found in language`;
    }
}
function stringFormat(template) {
    return data => {
        return Object.keys(data)
            .reduce((acc, key) => acc.replaceAll(`\$\{${key}\}`, data[key]), template)
    }
}

let aliasAttribute = 'Novo nome';
let keepAttribute = 'Manter atributo original';
let nameAttribute = i18n.t('attribute')

const attributeField = { name: 'attributes', label: i18n.t('attribute'), type: 'single-attribute', value: null, isList: true, required: true };
const excludeField = { name: 'exclude', label: i18n.tc('attribute', 3), type: 'multiple-attribute', value: null, isList: false, required: true };
const aliasField = { name: 'alias', label: aliasAttribute, type: 'text', maxLength: 50 };
const expression = { name: 'expression', label: 'Expressão', type: 'text', maxLength: 50, isList: true };
const toRename = { name: 'rename', label: i18n.t('alias'), type: 'text', maxLength: 50, value: null, isList: true, required: true };

const transformSingleParam = {
    fields: [
        { name: 'attribute', label: 'Atributo', type: 'single-attribute', maxLength: 50, isList: false, value: null},
        { name: 'expression', childName: 'alias', label: 'aliasAttribute', type: 'text', maxLength: 50, isList: true, value: null,  },
    ],
    callbacks: {
        in: (field, value, $meta) => {
            if (field.name === 'attribute') {
                field.value = [$meta.attribute];
            } else {
                field.value = field.isList ? [value[field.childName]] : value[field.childName];
            }
        },
        out: (step, $meta) => {
            const finalFields = [
                { name: 'expression', value: [{}] },
            ];
            step.forms.fields.forEach((f) => {
                if (f.name === 'attribute') {
                    //???? finalFields[1].value['attribute'] = f.value[0]; 
                    //updates attribute name in $meta
                    $meta.attribute = f.value[0];
                    const expression = stringFormat($meta.template)($meta)
                    finalFields[0]['value'][0]['expression'] = expression;
                    finalFields[0]['value'][0]['tree'] = getTreeFromExpression(expression);
                    //New Meta
                    finalFields.push({ name: '$meta', value: JSON.parse(JSON.stringify($meta)) })
                } else {
                    finalFields[0]['value'][0][f.childName] = f.isList ? f.value[0] : f.value;
                }
            });
            step.forms.updateFields = finalFields;
        }
    }
}

const actions = {
    'changeAttributeType': {
        fields: [
            {
                name: 'attributes', childName: 'attribute', label: i18n.tc('attribute', 0), type: 'single-attribute',
                value: null, isList: true, required: true
            },
            {
                name: 'attributes', childName: 'type', label: i18n.tc('FIXME', 0), type: 'dropdown',
                value: null, isList: false, required: true,
                options: ['Array', 'Boolean', 'Date', 'Decimal', 'Integer', 'JSON', 'Text', 'Time']
            }
        ],
        callbacks: {
            in: (field, value, meta) => {
                field.value = field.isList ? [value[field.childName]] : value[field.childName];
            },
            out: (step, $meta) => {
                const finalFields = [{ name: 'attributes', value: [{}] }];
                step.forms.fields.forEach((f) => {
                    finalFields[0]['value'][0][f.childName] = f.isList ? f.value[0] : f.value;
                });
                step.forms.updateFields = finalFields;
            }
        }
    },
    'renameAttribute': {
        fields: [attributeField, toRename,],
        callback: (opts) => console.debug(opts)
    },
    'deleteAttribute': {
        fields: [excludeField],
    },
    'edit.delete': {
        fields: [
            { attribute: { label: nameAttribute, type: 'attribute', multiple: true } },
        ]
    },
    'edit.find.replace': {
        fields: [
            { attribute: { label: nameAttribute, type: 'attributeAliasKeep', multiple: true } },
        ]
    },
    'edit.move': {
        fields: [
            { attribute: { label: nameAttribute, type: 'attribute' } },
            { reference: { type: 'attribute' } },
            { after: { type: 'boolean' } },
        ]
    },
    'lower': transformSingleParam,
    'split': transformSingleParam,
    'strip_accents': transformSingleParam,
    'title': transformSingleParam,
    'trim': transformSingleParam,
    'upper': transformSingleParam,
}

class Step {
    constructor(id, type, forms, description, background) {
        this.id = id;
        this.type = type;
        this.forms = forms;
        this.description = description;
        this.background = background;

        this.enabled = true;
        this.selected = false;
        this.status = 'WAITING';
        this.task = {};

    }
    setFunctionName(name) {
        this.functionName = name;
    }
    setTask(task) {
        this.task = task;
    }
}
class WorkflowManager {
    constructor(workflow) {
        this.workflow = workflow;
    }
    addTask(task) {
        if (task.id == undefined) {
            task.id = uuidv4();
        }
        const lastTask = this.workflow.tasks[this.workflow.tasks.length - 1];
        const operation = OPERATIONS.get(task.operation.slug);
        const maxDisplayOrder = Math.max.apply(Math, this.workflow.tasks.map(t => t.display_order));
        task.operation.id = operation.id;
        task.display_order = maxDisplayOrder + 1;
        task.enabled = true;
        task.environment = 'DESIGN'
        task.name = `${task.operation.slug} ${maxDisplayOrder + 1}`;
        task.z_index = task.display_order || 10;
        task.forms.display_sample = { value: '1' };
        task.top = lastTask.top;
        task.left = lastTask.left + 240;

        this.workflow.tasks.push(task);
        const lastTaskOperation = OPERATIONS.get(lastTask.operation.slug);

        lastTask.forms.display_sample.value = '0';
        this.workflow.flows.push({
            source_port: lastTaskOperation.output_id,
            target_port: operation.input_id,
            source_port_name: "output data",
            target_port_name: "input data",
            environment: "DESIGN",
            source_id: lastTask.id,
            target_id: task.id
        })
    }
    deleteTask(taskId) {
        const pos = this.workflow.tasks.findIndex(task => task.id === taskId);
        if (pos > -1) {
            if (pos == this.workflow.tasks.length - 1) {
                const sourceFlowPos = this.workflow.flows.findIndex(flow => flow.target_id === taskId);
                const sourceTask = this.workflow.tasks.find(
                    task => task.id === this.workflow.flows[sourceFlowPos].source_id)
                this.setupSampleProperties(sourceTask);

                this.workflow.flows.splice(sourceFlowPos, 1);
            } else {
                const targetFlowPos = this.workflow.flows.findIndex(flow => flow.source_id === taskId);
                const sourceFlowPos = this.workflow.flows.findIndex(flow => flow.target_id === taskId);

                this.workflow.flows.push({
                    source_port: this.workflow.flows[sourceFlowPos].source_port,
                    target_port: targetFlowPos > -1 ? this.workflow.flows[targetFlowPos].target_port : null,
                    source_port_name: "output data",
                    target_port_name: "input data",
                    environment: "DESIGN",
                    source_id: this.workflow.flows[sourceFlowPos].source_id,
                    target_id: this.workflow.flows[targetFlowPos].target_id
                })
                this.setupSampleProperties(this.workflow.tasks[pos - 1]);
                this.workflow.flows = this.workflow.flows.filter(
                    flow => flow.target_id !== taskId && flow.source_id !== taskId);
            }
            this.workflow.tasks.splice(pos, 1);
        }
    }
    setWorkflow(workflow) {
        this.workflow = workflow;
    }

    setupSampleProperties(task) {
        task.forms.display_sample.value = '1';
        task.forms.infer_sample = { value: true };
        task.forms.describe_sample = { value: true };
        task.forms.sample_size = { value: 300 };
    }
    prepareSampleProperties() {
        this.workflow.tasks.forEach((task, idx, tasks) => {
            if (idx !== tasks.length - 1) {
                this.cleanSampleProperties(task);
            } else {
                this.setupSampleProperties(task);
            }
        });
    }

    cleanSampleProperties(task) {
        task.forms.display_sample.value = '0';
        delete task.forms.infer_sample;
        delete task.forms.describe_sample;
        delete task.forms.sample_size;
    }
}
class StepManager {
    constructor(steps) {
        this.steps = steps;
    }
    addFromTask(task) {
        const step = new Step(
            task.id,
            task?.forms?.$meta?.value?.action,
            actions[task.forms.$meta?.value.action], // inject action's params
            task.forms.comment.value,
            task?.forms?.color?.value?.background || '#fff');
        this.steps.push(step);
        step.setTask(task);
        return step;
    }
    changeStepStatus(stepId, status) {
        const step = this.steps.find(step => step.id === stepId);
        if (step) {
            step.status = status;
        }
    }
    deleteStep(step) {
        const stepIndex = this.steps.findIndex(s => s.id === step.id);
        if (stepIndex > -1) {
            this.steps.splice(stepIndex, 1);
        }
    }
}
export default class Store {
    constructor(serviceBus, language) {
        this.serviceBus = serviceBus;
        this.language = language;

        this.attributes = [];
        this.workflow = {};
        this.dataSource = {};
        this.steps = [];
        this.stepManager = new StepManager(this.steps);
        this.workflowManager = new WorkflowManager(this.workflow);
        //this.serviceBus.$on('onFilter', this.filterRows.bind(this));
        //this.serviceBus.$on('updateStep', this.updateStep);
    }
    //addStep(operationSlug, parameters, description, id, background, taskData) {

    //#region Step maintainance
    addStep(task, createTask) {
        if (createTask) {
            task.id = uuidv4();
            this.workflowManager.addTask(task)
        }
        return this.stepManager.addFromTask(task);
    }
    deleteStep(step) {
        this.stepManager.deleteStep(step);
        this.workflowManager.deleteTask(step.id);
    }
    changeStepStatus(stepId, status) {
        this.stepManager.changeStepStatus(stepId, status);
    }

    updateStep(step) {
        // this is not available here
        if (step) {
            const params = step.forms.fields.map(f => {
                if (!!f.isList) {
                    return f.value[0];
                } else {
                    return f.value;
                }
            });
            step.description = _formatI18n(this.language, step.type, params);
            const task = this.workflow.tasks.find((t) => t.id === step.id);
            if (task) {
                const fields = step.forms.updateFields ? step.forms.updateFields : step.forms.fields;
                fields.forEach(f => {
                    task.forms[f.name] = JSON.parse(JSON.stringify({ value: f.value }));
                })
                task.forms.comment = { value: step.description };
                //Needed in order to update step
                step.task = task;
            }
        }
    }
    //#endregion

    //#region  Step selecion actions. TODO: Implement
    toggleSteps(ev, fromButtom) {
        if (fromButtom) {
            const check = ev.target.querySelector('input');
            if (check) {
                check.checked = !check.checked;
                this.steps.forEach(step => step.selected = check.checked);
            }
        } else {
            this.steps.forEach(step => step.selected = ev.target.checked);
        }
    }
    enableSelected(enabled) {
        this.steps.forEach(step => step.selected && (step.enabled = enabled));
    }
    removeSelected() {
        this.steps = this.steps.filter(step => !step.selected);
    }
    customOpen(event, data) {
        //this.$refs.stepCtxMenu.open(event, data);
    }
    // Step maintenance
    toggleStep(step) {
        step.enabled = !step.enabled;
        const task = this.workflow.tasks.find(task => task.id === step.id);
        task.enabled = step.enabled;

        this.workflow.tasks.forEach(task => task.forms.display_sample.value = '0');
        const sortedTasks = this.workflow.tasks.sort(task => -task.display_order)
        const lastEnabled = sortedTasks.find(task => task.enabled);
        if (lastEnabled) {
            this.setupSampleProperties(lastEnabled);
        }
    }
    //#endregion

    prepareSampleProperties() {
        this.workflowManager.prepareSampleProperties();
    }
    //#region Setters
    setWorkflow(workflow, reload) {
        if (reload) {
            this.createStepsFromTasks(workflow.tasks.slice(1));
        }
        const readerTask = workflow.tasks[0];
        this.dataSource = { ...readerTask.forms['data_source'] };

        this.workflow = workflow;
        this.workflowManager.setWorkflow(workflow);
        this.workflowManager.setupSampleProperties(
            workflow.tasks[workflow.tasks.length - 1]);
    }
    setAttributes(attributes) {
        this.attributes = [...attributes];
    }
    //#endregion
    /**/

    getAttributeNames() {
        return this.attributes.map((attribute) => attribute.label);
    }

    // Row operations
    filterRows(attributeName, operator, attributeValue) {
        const expression = `${attributeName} ${operator} ${attributeValue}`;

        const tree = getTreeFromExpression(expression);
        const description = _formatI18n(this.language, 'filterRows', [expression]);
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
    OLDaddTask(task) {
        const lastTask = this.workflow.tasks[this.workflow.tasks.length - 1];

        const operation = OPERATIONS.get(task.operation.slug);
        const maxDisplayOrder = Math.max.apply(Math, this.workflow.tasks.map(t => t.display_order));
        task.operation.id = operation.id;
        task.display_order = maxDisplayOrder + 1;
        task.enabled = true;
        task.environment = 'DESIGN'
        task.name = `${task.operation.slug} ${maxDisplayOrder + 1}`;
        task.z_index = task.display_order || 10;
        task.forms.display_sample = { value: '1' };
        task.top = lastTask.top;
        task.left = lastTask.left + 240;

        this.workflow.tasks.push(task);
        const lastTaskOperation = OPERATIONS.get(lastTask.operation.slug);

        lastTask.forms.display_sample.value = '0';
        this.workflow.flows.push({
            "source_port": lastTaskOperation.output_id,
            "target_port": operation.input_id,
            "source_port_name": "output data",
            "target_port_name": "input data",
            "environment": "DESIGN",
            "source_id": lastTask.id,
            "target_id": task.id
        })

    }
    //#region Edit Menu
    renameAttribute(attributeName, newName) {
        // Maps to projection operation
        // OK
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            const names = this.getAttributeNames();
            const aliases = [...names];
            aliases[pos] = newName;

            const description = _formatI18n(this.language, 'renameAttribute', [attributeName, newName]);
            this.addStep(
                {
                    operation: { slug: 'projection' },
                    forms: {
                        attributes: { value: [attributeName] },
                        rename: { value: [newName] },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action: 'renameAttribute',
                                attribute: attributeName,
                            }
                        }
                    }
                }, true);

        }
    }
    findAndReplaceAttribute(attributeName, valueFind, valueReplace, alias, removeOriginal, position) {
        // Maps to projection operation
        // OK
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            const names = this.getAttributeNames();
            const aliases = [...names];
            aliases[pos] = alias;

            const expression = `when(${attributeName} == ${valueFind}, ${valueReplace}, ${attributeName})`;

            const description = _formatI18n(this.language, 'findAndReplaceAttribute', [valueFind, valueReplace, attributeName]);
            this.addStep(
                {
                    operation: { slug: 'transformation' },
                    forms: {
                        position: { value: [position === null ? -1 : position + 1] },
                        expression: {
                            value: [{
                                alias, expression,
                                tree: getTreeFromExpression(expression),
                            }],
                        },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action: 'findReplaceAttribute',
                                attribute: attributeName,
                                alias, valueFind, valueReplace, removeOriginal,
                                position
                            }
                        }
                    }
                }, true);

        }
    }
    deleteAttribute(attributeName) {
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            this.attributes.splice(pos, 1);
            const description = _formatI18n(this.language, 'deleteAttribute', [attributeName]);

            this.addStep(
                {
                    operation: { slug: 'projection' },
                    forms: {
                        //attributes: { value: this.getAttributeNames() },
                        exclude: { value: [attributeName] },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action: 'deleteAttribute',
                                attribute: attributeName,
                            }
                        }
                    }
                }, true);
        }
    }
    moveAttribute(attributeName, params) {
        const position = params[0];
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);

        if (pos > -1) {
            const description = _formatI18n(this.language, 'move', [attributeName, position]);
            this.attributes.splice(position, 0, this.attributes.splice(pos, 1)[0])
            this.attributes.forEach((attr, i) => attr.position = i);

            this.addStep(
                {
                    operation: { slug: 'projection' },
                    forms: {
                        attributes: { value: this.getAttributeNames() },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action: 'move',
                                attribute: attributeName,
                                position,
                            }
                        }
                    }
                }, true);
        }
    }
    //#endregion
    //#region Cleanup 
    cleanMissing(attributeName, params) {
        const action = params[0];
        const mode = params[1];

        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            const description = _formatI18n(this.language, 'handleMissing.' + action,
                [attributeName])

            this.addStep(
                {
                    operation: { slug: 'clean-missing' },
                    forms: {
                        attributes: {
                            value: [attributeName]
                        },
                        cleaning_mode: { value: mode },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action,
                                attribute: attributeName,
                                mode
                            }
                        }
                    }
                }, true);
        }
    }
    //#endregion
    selectAttributes(selectedAttributes) {
        this.attributes = selectedAttributes;

        const names = this.getAttributeNames();
        const description = _formatI18n(this.language, 'selectAttributes', []);

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
    duplicateAttribute(attributeName, newName) {
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

        const description = _formatI18n(this.language, 'duplicateAttribute', [attributeName, newName]);
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
    keepAttributes() {

    }
    castAttributeToDate(attributeName, format) {

    }
    changeAttributeType(attributeName, action, newType, errors, formats) {
        const pos = this.attributes.findIndex((attribute) => attribute.label === attributeName);
        if (pos > -1) {
            const oldType = this.attributes[pos].type;
            this.attributes[pos].type = newType;
            const description = _formatI18n(this.language, action, [attributeName, oldType, newType])

            this.addStep(
                {
                    operation: { slug: 'cast' },
                    forms: {
                        attributes: {
                            value:
                                [{
                                    attribute: attributeName,
                                    type: newType,
                                    formats,
                                }]
                        },
                        errors: { value: errors },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action,
                                attribute: attributeName,
                                newType,
                                errors
                            }
                        }
                    }
                }, true);
        }
    }
    newAttributeFromFormula() {

    }
    moveAttributes() {

    }

    splitInvalidCellsIntoAnotherAttribute() {

    }
    // Row operations
    removeRowsWithEmptyCell() {

    }
    removeRowsWithInvalidCell() {

    }
    limit(max) {
        const description = _formatI18n(this.language, 'limit', [max]);
        this.addStep(
            {
                operation: { slug: 'sample' },
                forms: {
                    type: { value: 'value' },
                    value: { value: max },
                    comment: { value: description },
                    $meta: {
                        value: {
                            action: 'limit',
                            max, from: 1,
                        }
                    }
                }
            }, true);
    }
    sort(attributeName, direction) {
        const description = _formatI18n(this.language, 'sortAttributes',
            [`${attributeName} (${direction})`]);
        const attributes = { value: [{ attribute: attributeName, f: direction }] };

        this.addStep(
            {
                operation: { slug: 'sort' },
                forms: {
                    attributes,
                    comment: { value: description },
                    $meta: {
                        value: {
                            action: 'sort',
                            direction,
                            attribute: attributeName,
                        }
                    }
                }
            }, true);
    }

    transformWithFunction(attribute, position, params) {
        /*
        const action = params.action;
        const f = params.f;
        const template = params.template;
        const label = params.label;*/
        const { action, template, ...rest } = params[0];
        const alias = `${attribute}_${action}`;
        const description = _formatI18n(this.language, action, [attribute]);

        /*
        const extraParams = params.splice(1).map(
            //p => (typeof p === 'number') ? p.toString() : `'${p}'`)
            p => p.toString())
            .join(", ");
        */
        if (! (template && action)){
            console.debug('Missing parameters')
            return;
        }
        //const expression = `${f}(${extraParams})`;
        const expression = stringFormat(template)({ attribute, ...params[0] });

        this.addStep(
            {
                operation: { slug: 'transformation' },
                forms: {
                    expression: {
                        value: [{
                            alias, expression,
                            tree: getTreeFromExpression(expression),
                        }],
                    },
                    //where new attribute will be inserted
                    position: { value: [position === null ? -1 : position + 1] },
                    comment: { value: description },
                    $meta: {
                        value: {
                            action,
                            template,
                            ... rest,
                            attribute,
                        }
                    }
                }
            }, true);

        /*const subAction = params[0];
        const functionName = params[1];
        const functionParams = params.slice(2);

        const alias = `${attributeName}_${functionName}`;

        const i18nArgs = (step) => [step.parameters.attributeName];
        const getForms = (newAlias, parameters) => {
            const allParams = parameters.map(
                //p => (typeof p === 'number') ? p.toString() : `'${p}'`)
                p => p.toString())
                .join(", ");
            const expression = `${functionName}(${allParams})`;

            this.addStep(
                {
                    operation: { slug: 'transform' },
                    forms: {
                        expression: {
                            value: [{
                                alias: newAlias, expression,
                                tree: getTreeFromExpression(expression),
                            }],
                        },
                        //where new attribute will be inserted
                        position: { value: [position === null ? -1 : position + 1] },
                        comment: { value: description },
                        $meta: {
                            value: {
                                action: 'FIXME',
                                function: functionName,
                            }
                        }
                    }
                });
        }*/
    }
    /*
    transform(attributeName, position, expressionList) {
        debugger
        const description = _formatI18n(this.language, 'transformAttributes',
            [`${expressionList[0].alias} = ${expressionList[0].expression}`]);

        const step = this.addStep('transform',
            { expression: expressionList }, description
        );
        this.serviceBus.$emit('newStep',
            {
                id: step.id,
                operation: { 'slug': 'transformation' },
                forms: {
                    expression: {
                        value: expressionList
                    },
                    position: { value: [position === null ? -1 : position + 1] }
                }
            }, description
        );
    }*/
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
    concatenateAttributes() {

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
    nestAttributes() {

    }
    unnestAttributes() {

    }
    // Flag rows: how to proceed

    createStepsFromTasks(tasks) {
        tasks.forEach(task => {
            let step = null;

            switch (task.operation.slug) {
                case 'projection':
                    const attrs = task.forms.attributes.value;
                    this.addStep(task, false,
                        {
                            attributes: attrs,
                            aliases: attrs,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task,
                    );
                    break;
                case 'filter-selection':
                    this.addStep(task, false,
                        {
                            expression: task.forms.filter.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task
                    );
                    break;
                case 'cast':
                    this.addStep(task, false,
                        {
                            attributes: task.forms.attributes.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task);
                    break;
                case 'sort':
                    this.addStep(task, false,
                        {
                            attributes: task.forms.attributes.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task);
                    break;
                case 'transformation':
                    this.addStep(task, false,
                        {
                            expression: task.forms.expression.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task);
                    break;
                case 'clean-missing':
                    this.addStep(task, false,
                        {
                            attributes: task.forms.attributes.value,
                            cleaning_mode: task.forms.cleaning_mode.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task);
                    break;
                case 'sample':
                    this.addStep(task, false,
                        {
                            type: task.forms.type.value,
                            value: task.forms.value.value,
                        }, task.forms.comment.value, task.id,
                        task.forms.color.value.background, task);
                    break;
                default:
                    alert('Command::createStepsFromTasks Invalid operation ' + task.operation.slug);
                    return;
            }
            if (step) {
                step.setTask(task);
                this.steps.push(step);
            }
        });
    }
}