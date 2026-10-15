<template>
    <section :key="counter">
        <h6 class="mb-3 d-flex justify-content-between align-items-end">
            <span>{{name}}</span>
            <span class="model-count badge rounded-pill fw-normal"
                  :class="combinations > 100 ? 'text-bg-danger' : 'bg-body-secondary text-body-secondary'"
                  title="Número de modelos que serão treinados com as combinações de parâmetros informadas">
                {{combinations}} {{combinations === 1 ? 'combinação' : 'combinações'}}
            </span>
        </h6>
        <div class="fields">
            <template v-for="opForm in operation.forms" :key="opForm.id">
                <div v-for="field in opForm.fields" :key="field.name" class="mb-3 property clearfix" :data-name="field.name">
                    <!--
                    {{ field.name }} {{ field.enable_conditions }} {{ getWidget(field) }}
                    (({{ field.suggested_widget }}))
                    -->
                    <keep-alive>
                        <div v-if="['checkboxes-component', 'checkbox-component', 'dropdown-component'].includes(getWidget(field))">
                            <checkboxes-component :field="field" :value="getFieldValue(field.name, true)"
                                                  :language="locale" :type="field.suggested_widget" :small="true"
                                                  :read-only="!field.editable" context="context" @update="handleUpdateField"
                                                  @xinput="handleUpdateField" @update-form-field="handleUpdateField" />
                        </div>
                        <component :is="getWidget(field)"
                                   v-else-if="getWidget(field) !== 'attribute-selector-component' " visual-style="explorer" :field="field"
                                   :value="getFieldValue(field.name, false)" :language="locale"
                                   :type="field.suggested_widget" :small="true" :read-only="!field.editable" context="context"
                                   :show-quantity="gridStrategy === 'grid'" @update="handleUpdateField" @input="handleUpdateField"
                                   @update-form-field="handleUpdateField" />
                        <div v-else class="text-muted small"
                             :title="`Widget nao suportado: ${field.suggested_widget} (campo ${field.name})`">
                            Este parâmetro não pode ser editado por aqui.
                        </div>
                    </keep-alive>
                </div>
            </template>
            <button type="button" class="btn btn-sm btn-outline-secondary mt-2" @click.prevent="handleCleanAll">
                Limpar parâmetros
            </button>
        </div>
    </section>
</template>
<script setup>
import { ref, computed, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import useNotifier from '@/composables/useNotifier.js';
import CheckboxesComponent from '@/components/widgets/Checkboxes.vue';
import { countCombinations } from './combinations.js';

const { locale } = useI18n();
const { confirm } = useNotifier(getCurrentInstance().proxy);
const counter = ref(0);

const props = defineProps({
    operation: { type: Object, required: true },
    name: { type: String, required: true },
    gridStrategy: { type: String, required: true }
});

const form = defineModel('form', { type: Object });

const combinations = computed(() => countCombinations(props.operation, form.value));
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

};
const handleCleanAll = () => {
    confirm(
        'Limpar parâmetros',
        `Todos os parâmetros informados para ${props.name} serão apagados. Continuar?`,
        () => {
            form.value = {};
            counter.value++;
        }
    );
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
/* A count, not a heading: it should not inherit the h6 size. */
.model-count {
    font-size: .75rem;
}

/* The heading stays put; the parameters scroll under it. */
section {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.fields {
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
