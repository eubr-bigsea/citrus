/* Set of common methods used in diagram toolboxes */
export default {
    methods: {
        startDrag(event) {
            const target = event.target;
            let crt = this.$refs.opDrag;
            crt.innerHTML = target.innerHTML;

            crt.classList.add('dragging');
            crt.classList.add('operation');
            crt.style.position = 'absolute';
            crt.style.left = '-1000px';
            event.dataTransfer.setData('id', target.dataset.id);

            event.dataTransfer.setDragImage(crt, 0, 0);
        },
        stopDrag(event) {
            event.target.classList.remove('draggable');
        },
        dbClickAddTask(ev) {
            const target = ev.target;
            const dataTransfer = new DataTransfer();
            const diagram = document.getElementById('lemonade-diagram');
            let self = this;
            let elem = diagram;

            if (self.selectedTask.id) {
                elem = document.getElementById(self.selectedTask.id);
                dataTransfer.setData('tryConnections', self.selectedTask.id);
            } else if (self.workflow.tasks.length) {
                const index = self.workflow.tasks.length - 1;
                const lastTaskId = self.workflow.tasks[index].id;
                elem = document.getElementById(lastTaskId);
            }
            const diagramRect = diagram.getBoundingClientRect();
            const elemRect = elem.getBoundingClientRect();

            // Position relative to the diagram element itself - a
            // synthetic DragEvent's offsetX/offsetY (what drop() reads)
            // isn't reliably derived from clientX/clientY the way a real
            // drag's would be, so pass explicit coordinates instead.
            const left = elemRect.left - diagramRect.left + 250; //Math.floor(Math.random() * 300);
            const top = elemRect.top - diagramRect.top; //Math.floor(Math.random() * 50);

            dataTransfer.setData('id', target.dataset.id);
            dataTransfer.setData('left', left);
            dataTransfer.setData('top', top);
            diagram.dispatchEvent(
                new DragEvent('drop', {
                    dataTransfer: dataTransfer,
                    clientX: elemRect.left + 250,
                    clientY: elemRect.top
                })
            );
            return false;
        }
    },
};