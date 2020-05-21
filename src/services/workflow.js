export default {
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    exportWorkflow(workflow) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(workflow)));
        element.setAttribute('download', workflow.name + '.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
}