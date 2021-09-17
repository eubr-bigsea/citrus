class Workflow {
    constructor({ id = null, platform = null, name = null, type = null, cluster = null, tasks = [], flows = [], version = null } = {}) {
        const p = new Platform(platform);
        Object.assign(this, { id, name, platform: p, cluster, tasks, version, flows, type });
        this.history = 0;

    }
}
class Platform {
    constructor({ id = null, slug = null, name = null } = {}) {
        Object.assign(this, { id, name, slug });
    }
}
class Operation {
    constructor({ id = null, name = 'unnamed', slug = null, forms = [], ports = [] } = {}) {
        const newForms = forms.map(f => new Form(f));
        Object.assign(this, { id, name, slug, forms: newForms, ports });

    }
    generateTaskId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    createTask({ name = null } = {}) {
        const task = new Task({
            name, id: this.generateTaskId(),
            operation: { id: this.id, slug: this.slug, name: name || this.name }
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
    constructor({ id = null, name = 'unnamed', operation = null } = {}) {
        Object.assign(this, { id, name, operation });
        this.top = 0;
        this.left = 0;
        this.z_index = 0;
        if (this.id === null){
            this.id = this.operation.generateTaskId();
        }

        Object.defineProperty(this, '_operation', {
            value: null,
            writable: true,
            configurable: true,
            enumerable: false // this is the default value, so it could be excluded
        });
    }
    getPortBySlug(slug) {
        return this._operation.ports.find(p => p.slug === slug);
    }
    setProperty(name, value) {
        this.forms[name] = { value, label: null, labelValue: null };
    }
    move(left, top) {
        this.left = left;
        this.top = top;
    }
    inputFrom(other, myPort, otherPort) {
        const localPortObj = this.getPortBySlug(myPort);
        const otherPortObj = other.getPortBySlug(otherPort);

        if (!localPortObj || ! otherPortObj){
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