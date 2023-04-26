class Constants {
    static get DATA_TYPES() {
        return [
            'Array', 'Boolean', 'Date', 'Decimal', 'Integer', 'Text', 'Time',];
    };
}
const META_PLATFORM_ID = 1000;
const MODEL_BUILDER_CATEGORY = 2113;
class Workflow {
    constructor({ id = null, platform = null, name = null, type = null, preferred_cluster_id = null, tasks = [], flows = [], version = null, user = null, forms = null, $meta = null } = {}) {

        let _platform = platform instanceof Platform ? platform : new Platform(platform);
        let _tasks = tasks.map(task => (task instanceof Task) ? task : new Task(task));
        let _flows = flows.map(flow => (flow instanceof Flow) ? flow : new Flow(flow));
        this._tasksLookup = new Map();
        _tasks.forEach(task => this._tasksLookup.set(task.id, task));

        _tasks.sort((a, b) => a.display_order - b.display_order);
        Object.assign(this, {
            id, name, type, version,
            platform: _platform,
            forms,
            preferred_cluster_id,
            tasks: _tasks,
            flows: _flows,
            enabled: true,
            user,
            $meta
        });
        this.history = 0;
    }
    getTaskById(id) {
        return this._tasksLookup.get(id);
    }
    addTask(op, selected, fields) {
        //const requiresAttributes = !!op.forms.fields.find((f) => f.name === 'attributes');
        const attrs = (selected) ? [selected.column] : [];
        let forms = {};

        // Operations that handle 'attributes' in a different field
        let ignoreDefault = !!op.categories.filter(c => c.id == MODEL_BUILDER_CATEGORY);
        if (attrs && attrs.length && attrs[0]) {
            if (op.slug === 'sort') {
                ignoreDefault = true;
                forms = { order_by: { value: attrs.map(attr => { return { attribute: attr, f: 'asc' }; }) } };
            } else if (op.slug === 'cast') {
                forms = { cast_attributes: { value: attrs.map(attr => { return { attribute: attr, type: 'Text' }; }) } };
            } else if (op.slug === 'select') {
                forms = { mode: { value: 'include' }, attributes: { value: attrs.map(attr => { return { attribute: attr, alias: null }; }) } };
            } else if (op.slug === 'rename') {
                forms = { attributes: { value: attrs.map(attr => { return { attribute: attr, alias: attr }; }) } };
            } else if (op.slug === 'duplicate') {
                forms = { attributes: { value: attrs.map(attr => { return { attribute: attr, alias: `${attr}_1` }; }) } };
            } else if (op.slug === 'extract-from-array') {
                forms = { attributes: { value: attrs }, indexes: { value: "0" } };
            } else {
                forms = { attributes: { value: attrs } };
            }
        }
        if (fields) {
            Object.assign(forms, fields);
        }
        const newTask = op.createTask({ name: op.name, forms });
        op.forms.find(f => f.category === 'execution').fields.forEach(opField => {
            if (opField.default && !ignoreDefault) {
                if (opField.type === 'INTEGER') {
                    newTask.forms[opField.name] = { 'value': parseInt(opField.default) };
                } else {
                    newTask.forms[opField.name] = { 'value': opField.default };
                }
            }
        });
        newTask.editing = true;
        this.tasks.push(newTask);
        this._tasksLookup.set(newTask.id, newTask);

        this.tasks.forEach((task, inx) => task.display_order = inx);

        return newTask;
    }
    deleteTask(task) {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this._tasksLookup.delete(task.id);
    }
    static createSampleTask(display_order, op, i18n) {
        const forms = {
            'type': { value: 'head' },
            'value': { value: 50 },
            'seed': { value: 0 },
        };
        const realOp = op || new Operation({ id: 2110 });
        return realOp.createTask({
            name: i18n.$tc('dataExplorer.sampelData') || realOp.name,
            forms, display_order
        });
    }
    static buildDataExplorer(name, ds, i18n) {
        const dataReader = new Task({
            name: i18n.$tc('dataExplorer.readData'),
            operation: new Operation({ id: 2100 }),
            display_order: 0,
        });
        dataReader.setProperty('data_source', ds);
        dataReader.setProperty('display_sample', '0');

        const sample = Workflow.createSampleTask(1, null, i18n);
        dataReader.setProperty('display_sample', '1');

        const workflow = new Workflow({
            name: name,
            type: 'DATA_EXPLORER',
            platform: new Platform({ id: META_PLATFORM_ID }),
            tasks: [dataReader, sample]
        });
        return workflow;
    }
    static buildModelBuilder(name, ds, labelAttribute, method, taskType, i18n) {
        const dataReader = new Task({
            name: i18n.$tc('dataExplorer.readData'),
            operation: new Operation({ id: 2100 }),
            display_order: 0,
        });
        dataReader.setProperty('data_source', ds);
        dataReader.setProperty('display_sample', '0');

        const workflow = new Workflow({
            $meta: { method, task_type: taskType },
            name: name,
            tasks: [dataReader,],
            type: 'MODEL_BUILDER',
            platform: new Platform({ id: META_PLATFORM_ID }),
            forms: { $meta: { value: { label: labelAttribute, method, taskType } } }
        });
        return workflow;
    }
    static buildVisualizationBuilder(name, ds, type, method, i18n) {
        const dataReader = new Task({
            name: i18n.$tc('dataExplorer.readData'),
            operation: new Operation({ id: 2100 }),
            display_order: 0,
        });
        dataReader.setProperty('data_source', ds);
        dataReader.setProperty('display_sample', '0');
        const visualization = new Task({
            name: 'visualization',
            operation: new Operation({ id: 2370 }),
            display_order: 5,
        });
        visualization.setProperty('type', { value: type });


        const workflow = new Workflow({
            $meta: { method },
            name: name,
            tasks: [dataReader, visualization],
            type: 'VIS_BUILDER',
            platform: new Platform({ id: META_PLATFORM_ID }),
            forms: { $meta: { value: { method } } }
        });
        return workflow;
    }
}
class ModelBuilderWorkflow extends Workflow {
    constructor({ id = null, platform = null, name = null, type = null, preferred_cluster_id = null, tasks = [], flows = [], version = null, user = null, forms = null } = {}, operations) {
        super({ id, platform, name, type, preferred_cluster_id, tasks, flows, version, user, forms });
        //
        this.readData = null;
        this.sample = null;
        this.evaluator = null;
        this.features = null;
        this.reduction = null;
        //this.algorithms = [];
        this.split = null;
        this.grid = null;

        const pairs = new Map([
            ['sample', 'sample'],
            ['evaluator', 'evaluator'],
            ['features', 'features'],
            ['read-data', 'readData'],
            ['features-reduction', 'reduction'],
            ['split', 'split'],
            ['grid', 'grid']
        ]);
        this.tasks.forEach((task) => {
            if (pairs.has(task.operation.slug)) {
                this[pairs.get(task.operation.slug)] = task;
                task.operation = operations.get(task.operation.slug);
            }
        });
        for (let [slug, prop] of pairs.entries()) {
            // recreate the tasks
            if (this[prop] === null) {
                this[prop] = this.addTask(operations.get(slug));
            }
        }
    }
    addTask(op) {
        return super.addTask(op, null, null);
    }
}
class VisualizationBuilderWorkflow extends Workflow {
    constructor({ id = null, platform = null, name = null, type = null, preferred_cluster_id = null, tasks = [], flows = [],
        version = null, user = null, forms = null } = {}, operations) {
        super({ id, platform, name, type, preferred_cluster_id, tasks, flows, version, user, forms });
        //
        this.readData = null;
        this.filter = null;
        this.sort = null;
        this.sample = null;
        this.visualization = null;

        // Default tasks to be included
        const keyPairs = [
            ['read-data', 'readData'],
            ['filter', 'filter'],
            ['sort', 'sort'],
            ['sample', 'sample'],
            ['visualization', 'visualization'],
        ];
        const pairs = new Map(keyPairs);
        this.tasks = this.tasks.filter(task => {
            return pairs.has(task.operation.slug)
        });
        this.tasks.forEach((task) => {
            if (pairs.has(task.operation.slug)) {
                this[pairs.get(task.operation.slug)] = task;
                task.operation = operations.get(task.operation.slug);
            }
        });

        keyPairs.forEach((kp, i) => {
            const [slug, prop] = kp;
            if (!this[prop]) {
                this[prop] = this.addTask(operations.get(slug));
            }
            this[prop].display_order = i;
        });
        this.tasks.sort((a, b) => a.display_order - b.display_order);

        for (let [slug, prop] of pairs.entries()) {
            // recreate the tasks
            if (this[prop] === null) {
                this[prop] = this.addTask(operations.get(slug));
            }
        }
    }
    addTask(op) {
        return super.addTask(op, null, null);
    }
}
class Platform {
    constructor({ id = null, slug = null, name = null } = {}) {
        Object.assign(this, { id, name, slug });
    }
}
class Operation {
    constructor({ id = null, name = 'unnamed', slug = null, forms = [], ports = [], label_format = null, categories = [] } = {}) {
        const newForms = forms.map(f => new Form(f));
        Object.assign(this, { id, name, slug, label_format, forms: newForms, ports, categories });
        this.fieldsMap = new Map();
        newForms.forEach(form => form.fields.forEach(field => {
            if (field.values) {
                field.values = JSON.parse(field.values);
            }
            this.fieldsMap.set(field.name, field);
        }));
    }
    static generateTaskId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    createTask({ name = null, display_order = -1, forms = [] } = {}) {
        const finalForms = {};
        this.forms.forEach((form) => {
            form.fields.forEach(field => {
                finalForms[field.name] = { 'value': null };
            }
            );
        });
        Object.assign(finalForms, forms);

        const task = new Task({
            name, forms: finalForms, id: Operation.generateTaskId(),
            display_order,
            environment: 'DESIGN', //Required!
            operation: this //{ id: this.id, slug: this.slug, name: name || this.name }
        });

        task._operation = this;
        return task;
    }
}
class OperationList {
    constructor(operations = []) {
        this.operationsById = new Map(operations.map(op =>
            [op.id, new Operation(op)]));
        this.operationsBySlug = new Map(operations.map(op =>
            [op.slug, new Operation(op)]));
    }
    getOperation(id) {
        return this.operationsById.get(id);
    }
    getOperationBySlug(slug) {
        return this.operationsBySlug.get(slug);
    }
    toJSON() {
        return Array.from(this.operationsById.entries());
    }
}
class Form {
    constructor({ order = 0, name = 'unnamed', category = null, fields = [] } = {}) {
        const newFields = fields.map(ff => new FormField(ff));
        Object.assign(this, { id: order, name, fields: newFields, category });
    }
}
class FormField {
    constructor(f) {
        Object.assign(this, f);
    }
}
class Task {
    constructor({ id = null, name = 'unnamed', enabled = true, operation = null, display_order = 0,
        environment = null, left = 0, top = 0, forms = {} } = {}) {
        Object.assign(this, { id, name, operation });
        this.top = 0;
        this.left = 0;
        this.z_index = 0;
        this.previewable = true;
        this.enabled = enabled;
        this.display_order = display_order;
        this.environment = environment;
        this.left = left;
        this.selected = false;
        this.top = top;
        this.error = null;
        this.editing = false;
        this.editable = true;
        //this.operation = null;
        this.forms = {};

        //Initialize form fields
        if (operation?.forms) {
            operation.forms.filter(f => f.category === 'execution')
                .forEach(f => f.fields.forEach(field => this.forms[field.name] = { value: field.default_value }));
        }

        this.forms = forms;
        this.forms = Object.assign(forms, this.forms);

        if (this.id === null) {
            this.id = Operation.generateTaskId();
        }


        Object.defineProperty(this, '_operation', {
            value: null,
            writable: true,
            configurable: true,
            enumerable: false // this is the default value, so it could be excluded
        });
    }
    get backgroundColor() {
        return this.forms.color?.value?.background || '#ccc';
    }
    _fillTemplate() {
        return new Function("return `" + this.operation.label_format + "`;").call(this.forms);
    }
    getLabel() {
        try {
            let result = (this.operation.label_format && this.operation.label_format.trim() !== '')
                ? this._fillTemplate() : `<b>${this.operation.name}</b>`;
            return result;
        } catch (ignore) {
            //console.debug(ignore)
            return `<b>${this.operation.name}</b>`;
        }
    }
    getPortBySlug(slug) {
        return this._operation.ports.find(p => p.slug === slug);
    }
    setProperty(name, value) {
        if (value instanceof Object) {
            this.forms[name] = value;
        } else {
            this.forms[name] = { value };
        }
    }
    move(left, top) {
        this.left = left;
        this.top = top;
    }
    inputFrom(other, myPort, otherPort) {
        const localPortObj = this.getPortBySlug(myPort);
        const otherPortObj = other.getPortBySlug(otherPort);

        if (!localPortObj || !otherPortObj) {
            console.debug(myPort, otherPort, this._operation.ports, other._operation.ports);
        }
        return new Flow({
            source_port: otherPortObj.id,
            target_port: localPortObj.id,
            source_port_name: otherPort,
            target_port_name: myPort,
            source_id: other.id,
            target_id: this.id,
        });
    }
    hasProblems() {
        const self = this;
        const result = this.enabled && this.previewable &&
            (this.operation.forms.find(f => f.category === 'execution')
                .fields.find(field => {
                    return (field.required && (!self.forms[field.name] || !self.forms[field.name].value));
                }) !== undefined);
        return result;
    }

}
class Flow {
    constructor({ source_port = null, target_port = null,
        source_port_name = null,
        target_port_name = null,
        source_id = null,
        target_id = null } = {}) {
        {
            this.environment = 'DESIGN';
            this.source_port = source_port;
            this.target_port = target_port;
            this.source_port_name = source_port_name;
            this.target_port_name = target_port_name;
            this.source_id = source_id;
            this.target_id = target_id;
        }
    }
}
class Visualization {
    constructor({ type = { value: null }, display_legend = { value: 'HIDE' },
        smoothing = { value: true }, palette = { value: null },
        color_scale = { value: null },
        x = { value: [] }, y = { value: [] },
        x_axis = null, y_axis = null, title = { value: null },
        hole = null, text_position = null, text_info = null,
        right_margin = null, left_margin = 0, top_margin = 0, bottom_margin = 0,
        auto_margin = { value: true }, template = { value: null },
        blackWhite = { value: false },
        subgraph = { value: null },
        subgraph_orientation = { value: 'v' },
        animation = { value: null },
        opacity = { value: 1 },
        height = { value: null }, width = { value: null },
        scatter_color = { value: null },
        scatter_size = { value: null },
        fill_opacity = { value: 255 },
        number_format = { value: null },
        paper_color = { value: null },

        size_attribute = { value: null },
        text_attribute = { value: null },
        color_attribute = { value: null },
        style = { value: null },

        color_aggregation = { value: null },

        tooltip_info = { value: null },
        zoom = { value: null },
        center_latitude = { value: null },
        center_longitude = { value: null },
        latitude = { value: null },
        longitude = { value: null },
        marker_size = { value: null },

        limit = { value: null },
        filter = { value: null },

    },
    ) {
        this.filter = filter;
        this.limit = limit;

        this.marker_size = marker_size;
        this.center_latitude = center_latitude;
        this.center_longitude = center_longitude;
        this.latitude = latitude;
        this.longitude = longitude;
        this.zoom = zoom;
        this.style = style;
        this.tooltip_info = tooltip_info;
        this.number_format = number_format;
        this.display_legend = display_legend; //right, left, top, bottom, hide, in_chart
        this.smoothing = smoothing;
        this.palette = palette;
        this.color_scale = color_scale;
        this.title = title;
        this.color_attribute = color_attribute;
        this.color_aggregation = color_aggregation;
        this.size_attribute = size_attribute;
        this.text_attribute = text_attribute;
        this.fill_opacity = fill_opacity;

        this.paper_color = paper_color;
        this.x = x;
        this.y = y;
        this.type = type;
        this.x_axis = (x_axis && x_axis.value) ? x_axis : { value: new Axis({}) };
        this.y_axis = (y_axis && y_axis.value) ? y_axis : { value: new Axis({}) };

        this.hole = hole;
        this.text_info = text_info;
        this.text_position = text_position;
        this.right_margin = right_margin;
        this.left_margin = left_margin;
        this.top_margin = top_margin;
        this.bottom_margin = bottom_margin;
        this.auto_margin = auto_margin;
        this.template = template;
        this.blackWhite = blackWhite;
        this.subgraph = subgraph;
        this.subgraph_orientation = subgraph_orientation;
        this.animation = animation;
        this.height = height;
        this.width = width;
        this.opacity = opacity;
        this.scatter_color = scatter_color;
        this.scatter_size = scatter_size;

    }
    /*
    toJSON() {
        return JSON.stringify(this);
    }*/
}
class XDimension {
    constructor({ binning = 'EQUAL_INTERVAL', bins = 20, binSize = 10,
        emptyBins = 'ZEROS', multiplier = null, decimal_places = 2,
        prefix = null, suffix = null, label = null, max_displayed = null,
        group_others = true, sorting = 'NATURAL' }) {
        this.binning = binning;  // equal_interval, fixed_size, none, categorical
        this.bins = bins;
        this.binSize = binSize;
        this.emptyBins = emptyBins; //zeros, link, interrupt
        this.multiplier = multiplier; // A number to multiply by
        this.decimal_places = decimal_places;
        this.prefix = prefix;
        this.suffix = suffix;
        this.label = label;
        this.max_displayed = (binning === 'CATEGORICAL') ? max_displayed || 20 : max_displayed;
        this.group_others = group_others;
        this.sorting = sorting; //natural, yAsc, yDesc
    }
}
class YDimension {
    constructor({ attribute = '*', aggregation = 'COUNT', compute = null, displayOn = 'left',
        multiplier = null, decimal_places = 2,
        prefix = null, suffix = null, label = null,
        strokeSize = 0, stroke = null, color = null, marker = null,
        enabled = true }) {

        this.attribute = attribute;
        this.aggregation = aggregation; //count, countd, max, min, avg, sum
        this.compute = compute; //percent, ration_to_avg, cum_values, cum_percent, differential
        this.displayOn = displayOn; // left, right

        this.multiplier = multiplier; // A number to multiply by
        this.decimal_places = decimal_places;
        this.prefix = prefix;
        this.suffix = suffix;
        this.label = label;
        this.strokeSize = strokeSize;
        this.stroke = stroke;
        this.color = color;
        this.marker = marker;
        this.enabled = enabled;
    }
}
class Axis {
    constructor({ lowerBound = null, upperBound = null, logScale = false, display = true,
        displayLabel = true, label = null, multiplier = null, decimal_places = 2,
        prefix = null, suffix = null }) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.logScale = logScale;
        this.display = display;
        this.displayLabel = displayLabel;
        this.label = label;
        this.multiplier = multiplier;
        this.decimal_places = decimal_places;
        this.prefix = prefix;
        this.suffix = suffix;
    }
}

export {
    Workflow,
    Platform,
    Operation,
    OperationList,
    Task,
    Form,
    FormField,
    Constants,
    ModelBuilderWorkflow,
    Visualization,
    VisualizationBuilderWorkflow,
    YDimension, XDimension, Axis
};