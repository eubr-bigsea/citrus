<template>
    <div>
        <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
        <div class="row">
            <div class="col-10">
                <div v-if="internalValue.type === 'range'" class="border p-1 pl-2 border-radius">
                    <b-form inline>
                        <label for="inline-form-input-name">Min:</label>
                        <input v-model.number="internalValue.min" type="number"
                            class="form-control form-control-sm ml-2 mr-2 small-text"
                            onKeyPress="return this.value.length < 12" />

                        <label for="inline-form-input-username">Max:</label>
                        <input v-model.number="internalValue.max" type="number"
                            class="form-control form-control-sm ml-2 mr-2 small-text"
                            onKeyPress="return this.value.length < 12" />

                        <template v-if="showQuantity">
                            <label for="inline-form-input-username">Qtde. valores:</label>
                            <input v-model.number="internalValue.quantity" type="number" min="1"
                                class="form-control form-control-sm ml-2 mr-2 small-text"
                                onKeyPress="return this.value.length < 12" />
                        </template>

                        <label for="inline-form-input-username">Dist.:</label>
                        <select v-model="internalValue.distribution"
                            class="form-control form-control-sm small-text ml-2 mr-2 ">
                            <option value="uniform">Uniforme</option>
                            <option value="log_uniform">Log uniforme</option>
                        </select>
                    </b-form>
                </div>
                <b-form-tags v-else v-model="internalValue.list" no-outer-focus class="mb-2 p-0" style="overflow: auto;"
                    @input="handleInput">
                    <template v-slot="{ tags, inputAttrs, inputHandlers, addTag, removeTag }">
                        <b-input-group class="w-25 float-left">
                            <input v-bind="inputAttrs" :type="inputType.type" onKeyPress="return this.value.length < 12"
                                class="border-0 w-50 form-control form-control-sm "
                                :step="inputType.step" placeholder="Digite um valor"
                                v-on="inputHandlers" @keyup="handleKeyUp">
                            <b-input-group-append>
                                <b-button variant="secondary" size="sm" @click="addTag()"><span
                                        class="fa fa-plus"></span>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <div v-if="tags && tags.length" class="pl-2 mt-2 w-75 float-left">
                            <div v-for="(tag, i) in tags" :key="i" class="badge text-secondary badge-light2 border mr-1">
                                {{tag}} <a href="#" class="text-danger" @click.prevent="removeTag(tag)">&times;</a>
                            </div>
                        </div>
                    </template>
                </b-form-tags>
            </div>
            <div class="col-2 text-right">
                <b-form-radio-group v-model="internalValue.type" :options="opts" button-variant="outline-secondary"
                    size="sm" name="radio-btn-outline" buttons @input="handleInput" />
            </div>
        </div>
    </div>
</template>

<script>
    import Widget from '../../mixins/Widget.js';
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
                internalValue: {}
            }
        },
        computed: {
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
        mounted() {
            if (Array.isArray(this.value)) {
                this.internalValue = { list: [this.value], type: 'list' };
            } else {
                this.internalValue = this.value || {};
            }
            /*
            if (this.internalValue.type === undefined){
                this.internalValue.type = 'list';
            }*/
        },
        methods: {
            handleKeyUp(ev) {
                if (this.field.suggested_widget === 'integer')
                    ev.target.value = ev.target.value.replace(/[^0-9]/g, '');
            },
            handleInput() {
                /*
                switch (this.inputType) {
                    case 'integer':
                        //this.internalValue = this.internalValue.map(v => parseInt(v));
                }
                */
                this.triggerUpdateEvent(this.message, this.field, this.internalValue);
            }
        },
    }
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
