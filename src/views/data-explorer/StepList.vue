<!-- eslint-disable vue/no-deprecated-dollar-listeners-api -->
<template>
    <div>
        <b-dropdown class="more-actions me-1 mt-1 border rounded" size="sm" variant="btn" split>
            <template #button-content>
                <input type="checkbox" @change="handleSelectAll($event)">
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
        <div v-if="workflow.tasks" ref="stepsArea" class="step-scroll-area scroll-area" style="overflow-y: scroll;">
            <draggable class="list-group" ghost-class="ghost" handle=".step-drag-handle" :list="workflow.tasks"
                       :move="handleStepDrag" item-key="id" @start="drag = true" @end="endSortSteps">
                <template #item="{ element, index }">
                    <div :key="element.id" xv-if="element.operation.slug !== 'read-data'"
                         class="list-group-item steps clearfix p-0" :title="element.name !== 'unnamed' ? element.name : ''"
                         :style="{ 'border-left': '4px solid ' + element?.forms?.color?.value }">
                        <Step :ref="setStepRefs" :step="element" :language="language" :attributes="attributes"
                              :index="index"
                              :protected="index <= 1?true:null" :schema="index > 0 && workflow.schema ? workflow.schema[index - 1] : null"
                              :suggestion-event="suggestionEvent" :extended-suggestion-event="extendedSuggestionEvent"
                              @edit="editStep(element)" @cancel="cancelEdit(element)" @update="update(element)"
                              @preview="preview(element)" v-on="$listeners" />
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>
<script>
import Draggable from 'vuedraggable';
import Step from './Step.vue';

Draggable.compatConfig = { MODE: 3 };

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
        extendedSuggestionEvent: { required: true, type: Function, default: () => null },
    },
    emits: ['changed', 'delete-many', 'update', 'end-sort-steps', 'duplicate-step'],
    data() {
        return {
            lastPreviewableStep: null,
            stepRefs: new Set([])
        };
    },
    methods: {
        setStepRefs(el){
            if (el) {
                this.stepRefs.add(el);
            }
        },
        endSortSteps({ originalEvent }) { // eslint-disable-line no-unused-vars
            let elem = null;
            this.workflow.tasks.forEach((task, i) => {
                task.display_order = i;
                if (task.previewable) {
                    elem = task;
                    return false;
                }
            });
            this.isDirty = true;
            this.$emit('end-sort-steps', { originalEvent });
            // this.previewUntilHere(elem);
            // this.loadData();
        },
        handleStepDrag(e) {
            // Disable some steps to be dragged
            return (e?.relatedContext?.element?.display_order > 1);
        },
        /* Step group actions */
        handleSelectAll(checked) {
            this.stepRefs.forEach(s => s.select(checked));
        },
        handleToggleSelected(value) {
            let changed = false;
            this.stepRefs.forEach(s => {
                if (s.editableStep.selected) {
                    s.setEnabled(value);
                    changed = true;
                }
            });
            changed && this.$emit('changed');
        },
        handleRemoveSelected() {
            this.$emit('delete-many', this.stepRefs
                .filter(s => s.editableStep.selected)
                .map(s => s.editableStep));
        },

        /* Trigged by the step action */
        duplicate(step) {
            this.$emit('duplicate-step', step);
        },
        scrollToStep() {
            const el = this.$refs.stepsArea;
            el.scrollTo({ top: el.scrollHeight + 200, behavior: 'smooth' });
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
        editStep(step) {
            this.stepRefs.forEach(s => s.setEditable(s.step.id === step.id));
        },
        cancelEdit(step) {
            this.stepRefs.forEach(s => s.setEditable(true));
        },
        update(step) {
            this.stepRefs.forEach(s => s.setEditable(true));
            // this.$emit('update', step);
        },
        preview(step) {
            const toggle = this.lastPreviewableStep === step;
            this.workflow.tasks.forEach(t => {
                t.previewable = toggle || t.display_order <= step.display_order;
            });
            this.lastPreviewableStep = toggle ? null : step;
        },
        setEdition(value) {
            this.stepRefs.forEach(s => s.setEditable(value));
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