<template>
    <div v-if="readOnly">
        {{selected}}
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div v-if="!field.multiplicity || field.multiplicity === 1 || field.multiplicity === 0">
            <select 
                class="form-control input-sm " v-bind:data-field="field.name" v-model="selected"
                @change="updated" :required="field.required">
                <!--<option v-if="!field.default"></option>-->
                <option v-for="opt in pairOptionValueList" :value="opt.key" :key="opt.key">
                    {{opt[language] || opt.value}}
                </option>
            </select>
            <a v-if="help" :href="help" target="_blank">{{$tc('titles.reference')}} <span class="fa fa-external-link-alt"></span></a>
        </div>
        <b-form-tags v-else-if="field.multiplicity === 2 || field.multiplicity === 3" v-model="selected"
            @input="updatedTag" add-on-change no-outer-focus :name="field.name">
            <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                <b-form-select v-bind="inputAttrs" v-on="inputHandlers" :disabled="pairOptionValueList.length === 0"
                    :options="pairOptionValueList" value-field="key" text-field="value" size="sm">
                    <template #first>
                        <!-- This is required to prevent bugs with Safari -->
                        <option disabled value="">{{$t('actions.chooseOneOrMoreOption')}}</option>
                    </template>
                </b-form-select>
                <ul v-if="tags.length > 0" class="list-inline d-inline-block mt-3">
                    <li v-for="tag in tags" :key="tag" class="list-inline-item xsmall">
                        <b-form-tag @remove="removeTag(tag)" :title="tag" :disabled="disabled" variant="secondary">{{
                            tag }} </b-form-tag>
                    </li>
                </ul>
            </template>
        </b-form-tags>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        mounted() {
            this.$root.$emit(this.message,
                this.field, this.value || this.field['default']);
        },
        computed: {
            help(){
                return this.helpLink && this.value ? this.helpLink.replace('${key}', this.value) : null
            },
            pairOptionValueList() {
                this.tags; //In order to recompute if tags is changed
                let v;
                try {
                    if (typeof this.field.values === 'string' || this.field.values instanceof String) {
                        v = JSON.parse(this.field.values);
                    } else {
                        v = this.field.values;
                    }
                    // test if it is an object, instead of a list
                    if (v && !Array.isArray(v)) {
                        this.helpLink = v.help;
                        v = v.values;
                    }
                    v.forEach(opt => {
                        opt.value = opt[this.language] || opt.value;
                    });
                    return v.filter(opt => this.tags.indexOf(opt.key) === -1);
                } catch (ex) {
                    console.error(ex);
                    return [];
                }
            },
            selected: {
                get() {
                    if (this.field.multiplicity > 1 && (typeof this.value === 'string' || this.value instanceof String)) {
                        this.tags = JSON.parse(this.value);
                        return this.tags;
                    } else {
                        return this.internalSelected || this.value || this.field.default;
                    }
                },
                set(value) {
                    this.internalSelected = value;
                }
            }
        },
        methods: {
            updatedTag(values) {
                this.triggerUpdateEvent(this.message, this.field, values, 'Unsupported if DropDown is multiple');    
                this.tags = values;

            },
            updated(e) {
                this.selected = e.target ? e.target.value : e;
                this.triggerUpdateEvent(this.message, this.field, this.internalSelected,
                    e.target.options[e.target.selectedIndex].text);
            }
        },
        ready: function () {
            if (this.field['default'] && (this.value === null || this.value === '')) {
                this.value = this.field['default'];
            }
        },
        data() {
            return { tags: [],
                internalSelected: null,
                helpLink: null
           }
        }

    }

</script>
