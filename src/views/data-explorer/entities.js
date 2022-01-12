
class Workflow {
    constructor({ id = null, platform = null, name = null, type = null, preferred_cluster_id = null, tasks = [], flows = [], version = null, user = null } = {}) {

        let _platform = platform instanceof Platform ? platform : new Platform(platform);
        let _tasks = tasks.map(task => (task instanceof Task) ? task : new Task(task));
        let _flows = flows.map(flow => (flow instanceof Flow) ? flow : new Flow(flow));

        Object.assign(this, {
            id, name, type, version,
            platform: _platform,
            preferred_cluster_id,
            tasks: _tasks,
            flows: _flows,
            enabled: true,
            user,
        });
        this.history = 0;
    }
    addTask(op, selected, fields) {
        //const requiresAttributes = !!op.forms.fields.find((f) => f.name === 'attributes');
        const attrs = (selected) ? [selected.column] : [];
        let forms = null;
        if (op.slug === 'sort') {
            forms = { order_by: { value: attrs.map(attr => { return { attribute: attr, f: 'asc' } }) } };
        } else {
            forms = { attributes: { value: attrs } }
        }
        if (fields) {
            Object.assign(forms, fields);
        }
        this.tasks.push(op.createTask({
            name: op.name,
            forms
        }));
        this.tasks.forEach((task, inx) => task.display_order = inx);
    }
    deleteTask(task) {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
    }
    static createSampleTask(display_order, op) {
        const forms = {
            'type': { value: 'head' },
            'value': { value: 50 },
            'seed': { value: 0 },
        }
        const realOp = op || new Operation({ id: 2110 });
        return realOp.createTask({ name: realOp.name, forms, display_order })
    }
    static build(name, ds) {
        const dataReader = new Task({
            name: 'Ler dados', //FIXME
            operation: new Operation({ id: 2100 }), //FIXME
            display_order: 0,
        });
        dataReader.setProperty('data_source', ds);
        dataReader.setProperty('display-sample', '0');

        const sample = Workflow.createSampleTask(1);
        dataReader.setProperty('display-sample', '1');

        const workflow = new Workflow({
            name: name,
            type: 'DATA_EXPLORER',
            platform: new Platform({ id: 1000 }), //FIXME Meta platform id
            tasks: [dataReader, sample]
        });
        return workflow;
    }
}
class Platform {
    constructor({ id = null, slug = null, name = null } = {}) {
        Object.assign(this, { id, name, slug });
    }
}
class Operation {
    constructor({ id = null, name = 'unnamed', slug = null, forms = [], ports = [], label_format = null } = {}) {
        const newForms = forms.map(f => new Form(f));
        Object.assign(this, { id, name, slug, label_format, forms: newForms, ports });

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
            )
        })
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
        this.top = top;

        //Initialize form fields
        operation.forms.filter(f => f.category === 'execution')
            .forEach(f => f.fields.forEach(field => this.forms[field.name] = { value: field.default_value }));

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
            if (this.forms.comment?.value) {
                result += `<br/><em>${this.forms.comment.value}</em>`;
            }
            return result;
        } catch (ignore) {
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
    operation = null;
    forms = {}
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
            this.target_port = target_port
            this.source_port_name = source_port_name;
            this.target_port_name = target_port_name;
            this.source_id = source_id;
            this.target_id = target_id;
        }
    }
}
module.exports = {
    Workflow,
    Platform,
    Operation,
    OperationList,
    Task,
    Form,
    FormField,
}