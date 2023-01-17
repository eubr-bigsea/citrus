<template>
    <div v-if="readOnly">
        {{selected}}
    </div>
    <div v-else>
        <LabelComponent :field="field"
                        :value="value" />
        <div v-if="!field.multiplicity || field.multiplicity === 1 || field.multiplicity === 0">
            <select v-model="selected"
                    class="form-control input-sm "
                    :data-field="field.name"
                    :required="field.required"
                    @change="updated">
                <!--<option v-if="!field.default"></option>-->
                <option v-for="opt in pairOptionValueList"
                        :key="opt.key"
                        :value="opt.key">
                    {{opt[language] || opt.value}}
                </option>
            </select>
            <a v-if="help"
               :href="help"
               target="_blank">{{$tc('titles.reference')}} <font-awesome-icon icon="fa fa-external-link-alt" /></a>
            <small v-if="optionHelp">{{optionHelp[0]}}</small>
        </div>
        <b-form-tags v-else-if="field.multiplicity === 2 || field.multiplicity === 3"
                     v-model="selected"
                     add-on-change
                     no-outer-focus
                     :name="field.name"
                     @input="updatedTag">
            <template #default="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                <b-form-select v-bind="inputAttrs"
                               :disabled="pairOptionValueList.length === 0"
                               :options="pairOptionValueList"
                               value-field="key"
                               text-field="value"
                               size="sm"
                               v-on="inputHandlers">
                    <template #first>
                        <!-- This is required to prevent bugs with Safari -->
                        <option disabled
                                value="">
                            {{$t('actions.chooseOneOrMoreOption')}}
                        </option>
                    </template>
                </b-form-select>
                <ul v-if="tags.length > 0"
                    class="list-inline d-inline-block mt-3">
                    <li v-for="tag in tags"
                        :key="tag"
                        class="list-inline-item xsmall">
                        <b-form-tag :title="tag"
                                    :disabled="disabled"
                                    variant="secondary"
                                    @remove="removeTag(tag)">
                            {{tag}}
                        </b-form-tag>
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
    components: { LabelComponent },
    mixins: [Widget],
    data() {
        return { tags: [],
            internalSelected: null,
            helpLink: null,
            optionHelp: null
        }
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
                    //this.helpLink = v.help;
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
                    //this.tags = JSON.parse(this.value);
                    return JSON.parse(this.value);
                } else {
                    return this.internalSelected || this.value || this.field.default;
                }
            },
            set(value) {
                const self = this;
                this.internalSelected = value;
                this.optionHelp = this.pairOptionValueList.filter(opt => opt.help && opt.help[self.language] && opt.key === value)
                    .map(opt => opt.help[self.language]);
            }
        }
    },
    mounted() {
        this.$root.$emit(this.message,
            this.field, this.value || this.field['default']);
    },
    methods: {
        updatedTag(values) {
            this.triggerUpdateEvent(this.message, this.field, values, 'Unsupported if DropDown is multiple');
            this.tags = values;

        },
        updated(e) {
            this.selected = e.target ? e.target.value : e;
            const self = this;
            this.optionHelp = this.pairOptionValueList.filter(opt => opt.help && opt.help[self.language] && opt.key === this.selected)
                .map(opt => opt.help[self.language]);
            this.triggerUpdateEvent(this.message, this.field, this.internalSelected,
                e.target.options[e.target.selectedIndex].text);
        }
    },
    ready: function () {
        if (this.field['default'] && (this.value === null || this.value === '')) {
            this.value = this.field['default'];
        }
    }

}

</script>
