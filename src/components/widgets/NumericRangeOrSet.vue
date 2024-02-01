<template>
    <div>
        <LabelComponent :field="field" :value="value" :show-help="showHelp" />
        <div class="row">
            <div class="col-10">
                <div v-if="internalValue.type === 'range'" class="border py-2 border-radius">
                    <div class="container">
                        <div class="d-inline-flex align-items-center">
                            <label for="inline-form-input-name">Min:</label>
                            <input v-model.number="internalValue.min" type="number"
                                class="form-control form-control-sm ms-2 me-2 small-text"
                                onKeyPress="return this.value.length < 12">
                        </div>
                        <div class="d-inline-flex align-items-center">
                            <label for="inline-form-input-username">Máx:</label>
                            <input v-model.number="internalValue.max" type="number"
                                class="form-control form-control-sm ms-2 me-2 small-text"
                                onKeyPress="return this.value.length < 12">

                            <template v-if="showQuantity">
                                <label for="inline-form-input-username">Qtde. valores:</label>
                                <input v-model.number="internalValue.quantity" type="number" min="1"
                                    class="form-control form-control-sm ms-2 me-2 small-text"
                                    onKeyPress="return this.value.length < 12">
                            </template>
                        </div>
                        <div class="d-inline-flex align-items-center">
                            <label for="inline-form-input-username">Dist.:</label>
                            <select v-model="internalValue.distribution"
                                class="form-select form-select-sm small-text ms-2 me-2 ">
                                <option value="uniform">
                                    Uniforme
                                </option>
                                <option value="log_uniform">
                                    Log uniforme
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <b-form-tags v-else v-model="internalValue.list" no-outer-focus class="mb-2 p-0" style="overflow: auto;"
                    @input="handleInput">
                    <template #default="{ tags, inputHandlers, addTag, removeTag }">
                        <b-input-group class="w-25 float-start">
                            <input :type="inputType.type" onKeyPress="return this.value.length < 12"
                                class="border-0 w-50 form-control form-control-sm " :step="inputType.step"
                                placeholder="Valor" xkeydown.enter="handleAdd(addTag, $event, inputHandlers.keydown)"
                                v-on="inputHandlers" xkeyup.stop="handleKeyUp">
                            <b-input-group-append>
                                <b-button variant="secondary" size="sm" @click="handleAdd(addTag, $event)">
                                    <font-awesome-icon icon="fa fa-caret-right" />
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <div v-if="tags && tags.length" class="pt-1 ps-2 w-75 float-start">
                            <div v-for="(tag, i) in tags" :key="i" class="badge text-secondary badge-light2 border me-1">
                                {{ tag }} <a href="#" class="text-danger" @click.prevent="removeTag(tag)">&times;</a>
                            </div>
                        </div>
                    </template>
                </b-form-tags>
            </div>
            <div class="col-2 text-end">
                <b-form-radio-group v-model="internalValue.type" xoptions="opts" button-variant="outline-secondary"
                    size="sm" buttons @input="handleInput">
                    <b-form-radio :value="'list'" :name="`param-type${randomId}`">Lista</b-form-radio>
                    <b-form-radio :value="'range'" :name="`param-type${randomId}`">Faixa</b-form-radio>
                </b-form-radio-group>
                <!--
            -->
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
            opts: [
                { text: 'Lista', value: 'list' },
                { text: 'Faixa', value: 'range' }
            ],
            start: 0,
            end: 100,
            count: 10,
            distribution: 'uniform',
            type: 'list',
            internalValue: { distribution: null, list: [], max: null, min: null, quantity: null, type: 'list' }
        };
    },
    computed: {
        randomId(){
            return Math.random().toString(16).slice(2);
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
        }
    },
    watch: {
        value(v) {
            if (v === null) {
                this.internalValue = {
                    distribution: 'uniform', list: [], max: null, min: null, quantity: null, type: 'list',
                };
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
    },
    methods: {
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
                    this.internalValue.list = this.internalValue.list.map(v => parseFloat(v));
            }

            //console.debug(this.message, this.field.name, this.internalValue)
            this.triggerUpdateEvent(this.message, this.field, this.internalValue);
        }
    }
};
</script>
<style scoped>
input.small-text {
    max-width: 80px;
}

select.input.small-text {
    max-width: 120px;
}

.border-radius {
    border-radius: 5px;
}
</style>
