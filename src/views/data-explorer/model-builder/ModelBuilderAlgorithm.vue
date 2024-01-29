<template>
    <section>
        <h6 class="mb-3 border-bottom">{{ name }}</h6>
        <template v-for="form in operation.forms" :key="form.id">
            <div v-for="field in form.fields" :key="field.name" class="mb-2 property clearfix" :data-name="field.name">
                <!--{{field.name}} {{field.enable_conditions}} {{getWidget(field)}}
                                ||{{ getWidget(field) }}||
                                {{getFieldValue(field.name, false)}} (({{ field.suggested_widget }}))
                            -->
                <keep-alive>
                    <div
                        v-if="['checkboxes-component', 'checkbox-component', 'dropdown-component'].includes(getWidget(field))">
                        <checkboxes-component :field="field" :value="getFieldValue(field.name, true)"
                            :language="$root.$i18n.locale" :type="field.suggested_widget" :small="true"
                            :read-only="!field.editable" context="context" @update="handleUpdateField" />
                    </div>
                    <component :is="getWidget(field)"
                        v-else-if="getWidget(field) !== 'attribute-selector-component' && field.enabled"
                        visual-style="explorer" :field="field" :value="getFieldValue(field.name, false)"
                        :language="$root.$i18n.locale" :type="field.suggested_widget" :small="true"
                        :read-only="!field.editable" context="context" :show-quantity="gridStrategy === 'grid'"
                        @update="handleUpdateField" />
                    <div v-else />
                </keep-alive>
            </div>
            <button class="btn btn-sm btn-outline-secondary" @click.prevent="handleCleanAll">
                Limpar parâmetros
            </button>
        </template>
    </section>
</template>
<script setup>

import CheckboxesComponent from '@/components/widgets/Checkboxes.vue';
import InputTagComponent from '@/components/widgets/InputTag.vue';
import NumericRangeOrSetComponent from '@/components/widgets/NumericRangeOrSet.vue';

import { ref, computed, onMounted } from 'vue';

const parameters = defineModel('parameters');

const conditional = /\bthis\..+?\b/g;

const props = defineProps({
    name: {type: String, required: true},
    enabled: { type: Boolean, required: true },
    operation: { type: Object, required: true },

    operationMap: { type: Map, required: true },
    workflow: { type: Object, required: true },
    gridStrategy: { type: String, required: true },
});

const algorithms = ref([]);
const conditionalFields = new Map();
const selectedAlgorithm = ref({});

onMounted(() => {
    const algLookup = new Map((this.workflow.tasks || []).map((alg) => [alg.operation.slug, alg]));
    const operationsLookup = new Map(this.operations.map(op => [op.slug, op]));

    /* Initialization
        if (!this.algorithms.forms) {
            this.algorithms.forms = { algorithms: { value: [] } };
        } else if (!this.algorithms.forms.algorithms) {
            this.algorithms.forms.algorithms = { value: [] };
        } */
    this.algorithms = this.operations.map((op) => {
        let task;
        if (algLookup.has(op.slug)) {
            task = algLookup.get(op.slug);
            task.operation = operationsLookup.get(op.slug);
            task.algorithm = true;
        } else {
            task = this.workflow.addTask(op);
            task.enabled = false;
            task.algorithm = true;
        }
        return task;
    });

}
);
const evalInContext = (js, context) => {
    return new Function("return `" + js + "`;").call(context);
};

const handleSelectAlgorithm = (alg) => {
    alg.operation.forms.forEach(form => {
        form.fields.forEach(field => {
            field.internalValue = alg.forms[field.name].value;
            field.enabled = true;
        });
    });
    const self = this;
    alg.operation.forms.forEach((f) => {
        f.fields.forEach((field) => {
            alg.forms[field.name].enabled = true;
            if (field.enable_conditions) {
                if (field.enable_conditions === 'false') {
                    alg.forms[field.name].enabled = false;
                } else {
                    field.enable_conditions.match(conditional).forEach(v => {
                        const key = v.replace('this.', '');
                        if (!self.conditionalFields.has(key)) {
                            self.conditionalFields.set(key, new Set());
                        }
                        self.conditionalFields.get(key).add(field);

                    });
                }
            }

        });
    });
    this.selectedAlgorithm = alg;
};

const getExecutionForm = () => {
    if (this.selectedAlgorithm && this.selectedAlgorithm.forms) {
        const result = this.selectedAlgorithm.forms.filter(f => f.category === 'execution');
        return result;
    } else {
        console.debug(this.selectedAlgorithm, this.selectedAlgorithm.forms);
        return [];
    }
};

const getWidget = (field) => {
    if (field.suggested_widget.endsWith(':read-only')) {
        const s = field.suggested_widget;
        return s.substring(0, s.length - 10) + '-component';
    } else if (field.suggested_widget === 'dropdown') {
        return 'checkboxes-component';
    } else if (field.suggested_widget === 'integer' || field.suggested_widget === 'decimal') {
        return 'numeric-range-or-set-component';
    } else {
        return field.suggested_widget + '-component';
    }
};
const getFieldValue = (name, checkboxes) => {

    if (checkboxes) {
        return this.selectedAlgorithm
            && this.selectedAlgorithm?.forms
            && this.selectedAlgorithm?.forms[name]
            && this.selectedAlgorithm?.forms[name]?.value
            ? this.selectedAlgorithm?.forms[name]?.value?.list : null;
    } else {
        return this.selectedAlgorithm
            && this.selectedAlgorithm.forms
            && this.selectedAlgorithm.forms[name]
            ? this.selectedAlgorithm.forms[name].value : null;
    }

}
const handleUpdateField = (field, value, label) => {
    if (['checkbox', 'dropdown'].includes(field.suggested_widget)) {
        const newValue = { list: value, type: 'list' };//{type: 'list', list: value.filter(a => a !== '')};
        this.selectedAlgorithm.forms[field.name] = { value: newValue, label, internalValue: newValue };
    } else {
        this.selectedAlgorithm.forms[field.name] = { value: value, label, internalValue: value };
    }

    /*if (this.conditionalFields.has(field.name)) {
            this.conditionalFields.get(field.name).forEach(field => {
                const result = this.evalInContext()
                field.enabled =
            });
        }*/
};
const handleCleanAll = () => {
    Object.entries(this.selectedAlgorithm.forms).forEach(([name, value], inx) => { // eslint-disable-line no-unused-vars
        value.value = null;
        value.internalValue = { type: 'list', list: [] };
    });
};
</script>
<style scoped>
.algorithm {
    height: 75vh;
    overflow: auto;
}
</style>
