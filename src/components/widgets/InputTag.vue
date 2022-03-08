<template>
    <div>
        <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
        <b-form-tags v-model="internalValue" no-outer-focus class="mb-2 border-0 p-0" @input="handleInput">
            <template v-slot="{ tags, inputAttrs, inputHandlers, addTag, removeTag }">
                <b-input-group class="w-25 float-left">
                    <input v-bind="inputAttrs" :type="inputType.type" v-on="inputHandlers" onKeyPress="return this.value.length < 12"
                        class="w-50 form-control form-control-sm" :step="inputType.step" @keyup="handleKeyUp">
                    <b-input-group-append>
                        <b-button @click="addTag()" variant="secondary" size="sm"><span class="fa fa-plus"></span>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
                <div class="pl-2 mt-2 w-75 float-left" v-if="tags && tags.length">
                    <div class="badge text-secondary badge-light2 border mr-1" v-for="tag, i in tags" :key="i">
                        {{tag}} <a href="#" class="text-danger" @click.prevent="removeTag(tag)">&times;</a>
                    </div>
                </div>
                <small class="pl-2 " v-else>
                    Informe um valor e pressione Enter ou pressione o botão + para adicioná-lo.
                </small>
            </template>
        </b-form-tags>
    </div>
</template>

<script>
    import Widget from '../../mixins/Widget.js';
    import LabelComponent from './Label.vue';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        data() {
            return {
                internalValue: []
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
                this.internalValue = this.value;
            } else {
                this.internalValue = [this.value];
            }
        },
        methods: {
            handleKeyUp(ev) {
                if (this.field.suggested_widget === 'integer')
                    ev.target.value = ev.target.value.replace(/[^0-9]/g, '');
            },
            handleInput(v) {
                this.triggerUpdateEvent(this.message, this.field, v);
            }
        },
    }
</script>