<template>
    <div>
        <LabelComponent :field="field"
                        :value="value"
                        :show-help="showHelp" />
        <b-form-tags v-model="internalValue"
                     no-outer-focus
                     class="mb-2 border-0 p-0"
                     @input="handleInput">
            <template #default="{ tags, inputAttrs, inputHandlers, addTag, removeTag }">
                <b-input-group class="w-25 float-start">
                    <input v-bind="inputAttrs"
                           :type="inputType.type"
                           onKeyPress="return this.value.length < 12"
                           class="w-50 form-control form-control-sm"
                           :step="inputType.step"
                           v-on="inputHandlers"
                           @keyup="handleKeyUp">
                    <b-input-group-append>
                        <b-button variant="secondary"
                                  size="sm"
                                  @click="addTag()">
                            <font-awesome-icon icon="fa fa-plus" />
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
                <div v-if="tags && tags.length"
                     class="ps-2 mt-2 w-75 float-start">
                    <div v-for="(tag, i) in tags"
                         :key="i"
                         class="badge text-secondary badge-light2 border me-1">
                        {{tag}} <a href="#"
                                   class="text-danger"
                                   @click.prevent="removeTag(tag)">&times;</a>
                    </div>
                </div>
                <small v-else
                       class="ps-2 ">
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
    components: { LabelComponent },
    mixins: [Widget],
    data() {
        return {
            internalValue: []
        };
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
};
</script>
