<!-- eslint-disable vue/no-deprecated-dollar-listeners-api -->
<template>
    <div>
        <b-dropdown class="more-actions mr-1 mt-1 border rounded"
                    size="sm" variant="btn" split>
            <template #button-content>
                <input type="checkbox"
                       @change="handleSelectAll($event)">
            </template>
            <b-dropdown-item @click="handleToggleSelected(true)">
                {{$t('dataExplorer.enableSelected')}}
            </b-dropdown-item>
            <b-dropdown-item @click="handleToggleSelected(false)">
                {{$t('dataExplorer.disableSelected')}}
            </b-dropdown-item>
            <b-dropdown-item @click="handleRemoveSelected">
                {{$t('dataExplorer.removeSelected')}}
            </b-dropdown-item>
        </b-dropdown>
        <div ref="stepsArea" class="step-scroll-area scroll-area" style="overflow-y: scroll;">
            <draggable class="list-group" ghost-class="ghost" handle=".step-drag-handle" :list="workflow.tasks"
                       :move="handleStepDrag" @start="drag = true" @end="endSortSteps">
                <div v-for="(task, inx) in workflow.tasks" :key="task.id" xv-if="task.operation.slug !== 'read-data'"
                     class="list-group-item steps clearfix p-0" :title="task.name !== 'unnamed' ? task.name : ''"
                     :style="{ 'border-left': '4px solid ' + task?.forms?.color?.value }">
                    <Step ref="steps" :step="task" :language="language"
                          :attributes="attributes"
                          :index="inx" :protected="inx <= 1"
                          :schema="inx > 0 && workflow.schema ? workflow.schema[inx - 1] : null" 
                          @edit="editStep(task)"
                          @cancel="cancelEdit(task)"
                          @update="update(task)"
                          @preview="preview(task)"
                          :suggestion-event="suggestionEvent" 
                          v-on="$listeners" />
                </div>
            </draggable>
        </div>
    </div>
</template>
<script>
import Draggable from 'vuedraggable';
import Step from './Step.vue';
export default {
    name: "StepList",
    components: {
        Step, Draggable
    },
    props: {
        workflow: { type: Object, default: () => ({}) },
        attributes: { type: Array, required: true },
        language: { type: String, required: true },
        suggestionEvent: { type: Function, default: () => null },
    },
    emits: ['changed', 'delete-many', 'update'],
    data() {
        return {
            lastPreviewableStep: null,
        };
    },
    computed: {
    },
    async mounted() {

    },
    beforeUnmount() {
    },
    methods: {
        endSortSteps({ originalEvent }) { // eslint-disable-line no-unused-vars
            let elem = null;
            console.debug(this.workflow);
            this.workflow.tasks.forEach((task, i) => {
                task.display_order = i;
                if (task.previewable) {
                    elem = task;
                    return false;
                }
            });
            this.isDirty = true;
            // this.previewUntilHere(elem);
            // this.loadData();
        },
        handleStepDrag(e) {
            // Disable some steps to be dragged
            return (e?.relatedContext?.element?.display_order > 1);
        },
        /* Step group actions */
        handleSelectAll(checked) {
            this.$refs.steps.forEach(s => s.select(checked));
        },
        handleToggleSelected(value) {
            let changed = false;
            this.$refs.steps.forEach(s =>  {
                if (s.editableStep.selected) {
                    s.setEnabled(value);
                    changed = true;
                }
            });
            changed && this.$emit('changed');
        },
        handleRemoveSelected() {
            this.$emit('delete-many', this.$refs.steps
                .filter(s => s.editableStep.selected)
                .map(s => s.editableStep));
        },

        /* Trigged by the step action */
        duplicate(step) {
            // Clone tasks instance
            const cloned = new Task(JSON.parse(JSON.stringify(step)));
            cloned.id = Operation.generateTaskId();
            this.workflow.tasks.splice(step.display_order, 0, cloned);
            // Update the display_order
            this.workflow.tasks.slice(step.display_order + 1).forEach(
                (task) => task.display_order++);
            this.isDirty = true;
        },
        scrollToStep() {
            const el = this.$refs.stepsArea;
            el.scrollTo({ top: el.scrollHeight + 200, behavior: 'smooth' });
            //const self = this; //this.$refs.steps
        },
        
        updateStep(step) {
            const task = this.workflow.tasks.find(t => t.id === step.id);
            if (task) {
                Object.assign(task.forms, step.forms);
            }
            this.updateAttributeSuggestion();
            this.loadData();
        },

        resetMenuData() {
            this.selected = { field: {} };
            this.$refs.preview.resetMenuData();
        },
        select(attr) {
            this.selected = attr;
            this.valuesClusters = [];
        },
        editStep(step){
            this.$refs.steps.forEach(s => s.setEditable(s.step.id === step.id));
        },
        cancelEdit(step){
            this.$refs.steps.forEach(s => s.setEditable(true));
        },
        update(step){
            this.$refs.steps.forEach(s => s.setEditable(true));
            this.$emit('update', step);
        },
        preview(step){
            const toggle = this.lastPreviewableStep === step;
            this.workflow.tasks.forEach(t => {
                t.previewable = toggle || t.display_order <= step.display_order; 
            });
            this.lastPreviewableStep = toggle ? null : step;
        }

    }
};
</script>
<style scoped>
.step-scroll-area {
    max-width: 300px;
    /* max-height: 80vh; */
    padding-bottom: 10px;
    background: #fbfbfb;
}
</style>