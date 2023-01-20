<template>
    <div ref="stepsArea" class="step-scroll-area scroll-area" style="overflow-y: scroll;">
        <draggable class="list-group" ghost-class="ghost" handle=".step-drag-handle" :list="workflow.tasks"
            :move="handleStepDrag" @start="drag = true" @end="endSortSteps">
            <div v-for="(task, inx) in workflow.tasks" :key="task.id" xv-if="task.operation.slug !== 'read-data'"
                class="list-group-item steps clearfix p-0" :title="task.name !== 'unnamed' ? task.name : ''"
                :style="{ 'border-left': '4px solid ' + task?.forms?.color?.value }">
                <Step ref="steps" :step="task" :language="language" :attributes="attributes" :index="inx"
                    :protected="inx <= 1" :schema="inx > 0 && workflow.schema ? workflow.schema[inx - 1] : null"
                    :suggestion-event="() => getSuggestions(task.id)" 
                    v-on="$listeners" />
            </div>
            
        </draggable>
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
    data() {
        return {
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
            console.debug(this.workflow)
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
        handleSelectAll(ev) {
            this.workflow.tasks.forEach((task) => {
                task.selected = (task.display_order > 1) && ev.target.checked;
            });
        },
        handleToggleSelected(value) {
            this.workflow.tasks.forEach((task) => {
                task.enabled = (task.selected && value) || (task.display_order <= 1);
                this.isDirty = true;
            });
        },
        handleRemoveSelected() {
            this.confirm(
                this.$t('actions.delete'), this.$t('dataExplorer.doYouWantToDeleteStep'),
                () => {
                    this.workflow.tasks.forEach((task) => {
                        if (task.display_order > 1 && task.selected) {
                            this.workflow.deleteTask(task);
                            this.isDirty = true;
                        }
                    });
                }
            );
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
        previewUntilHere(step) {
            this.workflow.tasks.forEach((task) => {
                const previewable = (task.display_order <= step.display_order);
                task.previewable = previewable;
                if (task.forms?.$meta?.value) {
                    task.forms.$meta.value.previewable = previewable;
                } else {
                    task.forms.$meta = { value: { previewable } };
                }
            });
            this.isDirty = true;
            this.loadData();
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


    }
};
</script>
<style scoped>
.step-scroll-area {
    max-width: 300px;
    max-height: 80vh;
    padding-bottom: 10px;
    background: #fbfbfb;
}
</style>