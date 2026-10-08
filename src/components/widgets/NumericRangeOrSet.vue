<template>
    <div>
        <LabelComponent :field="field" :value="value" :show-help="showHelp" />
        <div class="row">
            <div class="col-12 mb-1">
                <b-form-radio-group v-model="mode" button-variant="outline-secondary"
                                    size="sm" buttons>
                    <b-form-radio value="default" :name="`param-mode${randomId}`">
                        Padrão
                    </b-form-radio>
                    <b-form-radio value="fixed" :name="`param-mode${randomId}`">
                        Um valor
                    </b-form-radio>
                    <b-form-radio value="list" :name="`param-mode${randomId}`">
                        Vários valores
                    </b-form-radio>
                    <b-form-radio value="range" :name="`param-mode${randomId}`">
                        Intervalo
                    </b-form-radio>
                </b-form-radio-group>
            </div>
            <div class="col-12">
                <small v-if="mode === 'default'" class="text-muted">
                    Será usado o valor padrão do algoritmo<template v-if="hasDefault"> ({{field.default}})</template>.
                </small>

                <input v-else-if="mode === 'fixed'" v-model="fixedValue" :type="inputType.type"
                       :step="inputType.step" class="form-control form-control-sm w-25"
                       placeholder="Valor" @keypress="limitLength">

                <div v-else-if="mode === 'range'" class="range-box py-2 rounded">
                    <div class="container">
                        <div class="d-inline-flex align-items-center">
                            <label :for="`min-${randomId}`">Min:</label>
                            <input :id="`min-${randomId}`" v-model.number="internalValue.min" type="number"
                                   class="form-control form-control-sm ms-2 me-2 small-text"
                                   @keypress="limitLength" @input="handleInput">
                        </div>
                        <div class="d-inline-flex align-items-center">
                            <label :for="`max-${randomId}`">Máx:</label>
                            <input :id="`max-${randomId}`" v-model.number="internalValue.max" type="number"
                                   class="form-control form-control-sm ms-2 me-2 small-text"
                                   @keypress="limitLength" @input="handleInput">

                            <template v-if="showQuantity">
                                <label :for="`quantity-${randomId}`">Qtde. valores:</label>
                                <input :id="`quantity-${randomId}`" v-model.number="internalValue.quantity"
                                       type="number" min="1"
                                       class="form-control form-control-sm ms-2 me-2 small-text"
                                       @keypress="limitLength" @input="handleInput">
                            </template>
                        </div>
                        <div class="d-inline-flex align-items-center">
                            <label :for="`distribution-${randomId}`">Distribuição:</label>
                            <select :id="`distribution-${randomId}`" v-model="internalValue.distribution"
                                    class="form-select form-select-sm small-text ms-2 me-2"
                                    title="Uniforme espaça os valores igualmente. Log uniforme concentra os valores nas ordens de grandeza menores, útil para taxas de aprendizado e regularização."
                                    @change="handleInput">
                                <option value="uniform">
                                    Uniforme
                                </option>
                                <option value="log_uniform">
                                    Log uniforme
                                </option>
                            </select>
                        </div>
                        <div v-if="rangePreview" class="mt-2">
                            <div v-if="rangePreview.error" class="text-danger small">
                                <font-awesome-icon icon="fa fa-warning" /> {{rangePreview.error}}
                            </div>
                            <template v-else>
                                <small class="text-muted">Valores que serão testados:</small>
                                <div class="mt-1">
                                    <template v-for="(v, i) in rangePreview.values" :key="i">
                                        <span v-if="rangePreview.truncated && i === rangePreview.values.length - 1"
                                              class="me-1 text-muted">…</span>
                                        <span class="badge text-secondary border me-1">{{v}}</span>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <b-form-tags v-else v-model="internalValue.list" no-outer-focus class="mb-2 p-0"
                             style="overflow: auto;"
                             @input="handleInput">
                    <template #default="{ tags, inputHandlers, addTag, removeTag }">
                        <b-input-group class="w-25 float-start">
                            <input :type="inputType.type" :step="inputType.step"
                                   class="border-0 w-50 form-control form-control-sm"
                                   placeholder="Valor" v-on="inputHandlers"
                                   @keypress="limitLength" @keydown.enter="clearAfterAdd">
                            <b-input-group-append>
                                <b-button variant="secondary" size="sm" title="Adicionar valor"
                                          @click="handleAdd(addTag, $event)">
                                    <font-awesome-icon icon="fa fa-plus" />
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <div v-if="tags && tags.length" class="pt-1 ps-2 w-75 float-start">
                            <div v-for="(tag, i) in tags" :key="i" class="badge text-secondary border me-1">
                                {{tag}} <a href="#" class="tag-remove" title="Remover valor"
                                           @click.prevent="removeTag(tag)">&times;</a>
                            </div>
                        </div>
                        <small v-else class="pt-1 ps-2 text-muted float-start">
                            Informe um valor e pressione Enter, ou use o botão ao lado.
                        </small>
                    </template>
                </b-form-tags>
            </div>
        </div>
    </div>
</template>

<script>
import Widget from '@/mixins/Widget.js';
import LabelComponent from './Label.vue';
export default {
    components: { LabelComponent },
    mixins: [Widget],
    props: {
        showQuantity: { type: Boolean }
    },
    data() {
        return {
            // What the user wants to do with the parameter. Presentation only:
            // everything is still persisted as the list/range shapes the
            // backend already understands.
            mode: 'default',
            // Deriving the mode on mount must not look like a user edit.
            initializing: true,
            internalValue: { distribution: null, list: [], max: null, min: null, quantity: null, type: 'list' }
        };
    },
    computed: {
        randomId(){
            return Math.random().toString(16).slice(2);
        },
        hasDefault() {
            return this.field.default !== null && this.field.default !== undefined && this.field.default !== '';
        },
        inputType() {
            switch (this.field.suggested_widget) {
            case 'integer':
                return { type: 'number', step: "1" };
            case 'decimal':
                return { type: 'number', step: "0.01" };
            default:
                return { type: 'text' };
            }
        },
        fixedValue: {
            get() {
                const list = this.internalValue.list || [];
                return list.length ? list[0] : null;
            },
            set(v) {
                this.internalValue.list = (v === '' || v === null || v === undefined) ? [] : [v];
                this.handleInput();
            }
        },
        // The values the grid search will actually try, so the range stops
        // being abstract. Null when there is nothing to show yet.
        rangePreview() {
            const { min, max, quantity, distribution } = this.internalValue;
            const lower = Number(min);
            const upper = Number(max);
            const total = Number(quantity);
            if (!Number.isFinite(lower) || !Number.isFinite(upper) || !(total > 0)) {
                return null;
            }
            if (lower >= upper) {
                return { error: 'O valor mínimo deve ser menor que o máximo.' };
            }
            const log = distribution === 'log_uniform';
            if (log && lower <= 0) {
                return { error: 'A distribuição log uniforme exige um valor mínimo maior que zero.' };
            }

            const from = log ? Math.log(lower) : lower;
            const to = log ? Math.log(upper) : upper;
            const step = total > 1 ? (to - from) / (total - 1) : 0;
            const valueAt = (i) => {
                const raw = log ? Math.exp(from + i * step) : from + i * step;
                // toPrecision drops floating point noise such as 0.30000000000000004
                return Number(raw.toPrecision(6));
            };

            const truncated = total > 10;
            const indexes = truncated
                ? [0, 1, 2, 3, 4, total - 1]
                : Array.from({ length: total }, (ignore, i) => i);
            return { values: indexes.map(valueAt), truncated };
        }
    },
    watch: {
        value(v) {
            if (v === null) {
                this.internalValue = {
                    distribution: 'uniform', list: [], max: null, min: null, quantity: null, type: 'list',
                };
                this.mode = 'default';
            }
        },
        mode(newMode) {
            this.internalValue.type = (newMode === 'range') ? 'range' : 'list';
            if (newMode === 'default') {
                this.internalValue.list = [];
            } else if (newMode === 'fixed') {
                const list = this.internalValue.list || [];
                this.internalValue.list = list.length ? [list[0]] : [];
            }
            if (!this.initializing) {
                this.handleInput();
            }
        }
    },
    mounted() {
        if (Array.isArray(this.value)) {
            this.internalValue = { list: this.value, type: 'list' };
        } else if (this.value && this.value.list) {
            this.internalValue = this.value || {};
        } else if (this.value) {
            this.internalValue = { list: [this.value], type: 'list' };
        } else {
            this.internalValue = { list: [], type: 'list' };
        }
        if (typeof this.internalValue.type === 'undefined'
            && !(this.internalValue.type)) {
            this.internalValue.type = 'list';
        }
        this.internalValue = {
            distribution: 'uniform', list: [], max: null, min: null, quantity: null, type: 'range',
            ... this.internalValue
        };
        this.mode = this.deriveMode();
        this.$nextTick(() => { this.initializing = false; });
    },
    methods: {
        deriveMode() {
            if (this.internalValue.type === 'range') {
                return 'range';
            }
            const list = this.internalValue.list || [];
            if (list.length === 0) {
                return 'default';
            }
            return list.length === 1 ? 'fixed' : 'list';
        },
        clearAfterAdd(ev) {
            // b-form-tags handles Enter first; the input is uncontrolled, so
            // it keeps the typed text unless we clear it ourselves.
            const input = ev.target;
            this.$nextTick(() => { input.value = ''; });
        },
        limitLength(ev) {
            if (ev.target.value.length >= 12) {
                ev.preventDefault();
            }
        },
        handleAdd(addTag, ev, ch) {
            if (ch)
                ch(ev);
            addTag();
            const input = ev.currentTarget.parentElement.querySelector('input');
            if (input) {
                input.value = '';
            }
        },
        handleKeyUp(ev) {
            if (this.field.suggested_widget === 'integer')
                ev.target.value = ev.target.value.replace(/[^0-9]/g, '');
        },
        handleInput() {
            switch (this.inputType.type) {
            case 'number':
                this.internalValue.list = (this.internalValue.list || []).map(v => parseFloat(v));
            }
            this.triggerUpdateEvent(this.message, this.field, this.internalValue);
        }
    }
};
</script>
<style scoped>
input.small-text {
    max-width: 80px;
}

select.small-text {
    max-width: 130px;
}

.range-box {
    background-color: #f8f9fa;
}

.tag-remove {
    color: #888;
    text-decoration: none;
}

.tag-remove:hover {
    color: #212529;
}
</style>
