<template>
    <section :key="counter">
        <h6 class="mb-3 border-bottom">
            {{name}}
        </h6>
        <template v-for="opForm in operation.forms" :key="opForm.id">
            <div v-for="field in opForm.fields" :key="field.name" class="mb-2 property clearfix" :data-name="field.name">
                <!--
                {{ field.name }} {{ field.enable_conditions }} {{ getWidget(field) }}
                (({{ field.suggested_widget }}))
                -->
                <keep-alive>
                    <div v-if="['checkboxes-component', 'checkbox-component', 'dropdown-component'].includes(getWidget(field))">
                        <checkboxes-component :field="field" :value="getFieldValue(field.name, true)"
                                              :language="$root.$i18n.locale" :type="field.suggested_widget" :small="true"
                                              :read-only="!field.editable" context="context" @update="handleUpdateField"
                                              @xinput="handleUpdateField" @update-form-field="handleUpdateField" />
                    </div>
                    <component :is="getWidget(field)"
                               v-else-if="getWidget(field) !== 'attribute-selector-component' " visual-style="explorer" :field="field"
                               :value="getFieldValue(field.name, false)" :language="$root.$i18n.locale"
                               :type="field.suggested_widget" :small="true" :read-only="!field.editable" context="context"
                               :show-quantity="gridStrategy === 'grid'" @update="handleUpdateField" @input="handleUpdateField"
                               @update-form-field="handleUpdateField" />
                    <div v-else>
                        Tipo de campo de formulário não suportado: {{ field.suggested_widget }} para campo {{ field.name }}
                    </div>
                </keep-alive>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click.prevent="handleCleanAll">
                Limpar parâmetros
            </button>
        </template>
    </section>
</template>
<script setup>
import { ref } from 'vue';
import CheckboxesComponent from '@/components/widgets/Checkboxes.vue';

//const conditional = /\bthis\..+?\b/g;

const counter = ref(0);

const props = defineProps({
    operation: { type: Object, required: true },
    name: { type: String, required: true, default: () => { } },
    gridStrategy: { type: String, required: true }
});

const form = defineModel('form');
/*
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
*/
/*
const getExecutionForm = () => {
    if (this.selectedAlgorithm && this.selectedAlgorithm.forms) {
        const result = this.selectedAlgorithm.forms.filter(f => f.category === 'execution');
        return result;
    } else {
        console.debug(this.selectedAlgorithm, this.selectedAlgorithm.forms);
        return [];
    }
};
*/
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
        return form.value[name]?.value?.list;
    } else if (form.value[name]?.value){
        return form.value[name]?.value;
    } else {
        return null;
    }

}
const handleCleanAll = () => {
    form.value = {};
    counter.value++;
};

const handleUpdateField = (field, value, label) => {
    if (field.name) {
        if (['checkbox', 'dropdown'].includes(field.suggested_widget)) {
            const newValue = { list: value, type: 'list' };//{type: 'list', list: value.filter(a => a !== '')};
            form.value[field.name] = { value: newValue, label, internalValue: newValue };
        } else {
            form.value[field.name] = { value: value, label, internalValue: value };
        }
    }
};

</script>
<style scoped>
.algorithm {
    height: 75vh;
    overflow: auto;
}
</style>
