<template>
    <div class="join-editor">
        <span>
            <LabelComponent :field="field"
                            :value="value" />
            <textarea disabled
                      :value="displayValue"
                      class="form-control"
                      rows="8" />
            <b-link v-if="!readOnly"
                    variant="sm"
                    @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <b-modal ref="modal"
                 size="xl"
                 :title="field.label"
                 :hide-header="true"
                 :cancel-title="$t('actions.cancel')"
                 no-fade>
            <form ref="form"
                  onsubmit="return false"
                  action=""
                  class="zoom80"
                  @submit.stop.prevent="submit">
                <div class="row">
                    <div class="col-md-6 col-sm-12 border-right">
                        <h6>{{$t('widgets.join.type')}}:</h6>

                        <select v-model="joinType"
                                class="form-control mb-2">
                            <option value="inner">
                                Inner
                            </option>
                            <option value="left_outer">
                                Left outer
                            </option>
                            <option value="right_outer">
                                Right outer
                            </option>
                            <option value="full_outer">
                                Full outer
                            </option>
                        </select>
                        <h6>{{$t('widgets.join.conditions')}}</h6>
                        <div class="side">
                            <JoinCondition ref="condition"
                                           :suggestions1="suggestions1"
                                           :suggestions2="suggestions2"
                                           :conditions="valueObject.conditions" />
                        </div>
                        <div class="mt-2 border-top pt-2">
                            <button class="btn btn-success btn-sm"
                                    @click.prevent="add">
                                <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <h6>Seleção de atributos</h6>
                        <div v-if="hasNameCollision">
                            <font-awesome-icon icon="fa fa-exclamation-circle"
                                               class="text-danger" />
                            {{$t('widgets.join.nameCollision')}}
                        </div>
                        <div ref="selection">
                            <div class="row">
                                <JoinSelect ref="firstSelect"
                                            class="col-md-6"
                                            :selected="valueObject.firstSelect"
                                            :suggestions="suggestions1"
                                            :label="$tc('common.input') + ' 1'"
                                            :selection-type="valueObject.firstSelectionType || 1"
                                            :prefix="valueObject.firstPrefix" />
                                <JoinSelect ref="secondSelect"
                                            class="col-md-6"
                                            :selected="valueObject.secondSelect"
                                            :suggestions="suggestions2"
                                            :label="$tc('common.input') +' 2'"
                                            :selection-type="valueObject.secondSelectionType || 1"
                                            :prefix="valueObject.secondPrefix" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div slot="modal-footer"
                 class="w-100 text-right">
                <b-button variant="primary"
                          class="mr-1"
                          size="sm"
                          @click.prevent.stop="okClicked">
                    {{$t('common.ok')}}
                </b-button>
                <b-btn variant="secondary"
                       size="sm"
                       @click="cancelClicked">
                    {{$t('actions.cancel')}}
                </b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
import Notifier from '../../mixins/Notifier.js';
import JoinSelect from './JoinSelect.vue';
import JoinCondition from './JoinCondition.vue';

export default {
    name: 'JoinComponent',
    components: {
        LabelComponent, JoinSelect, JoinCondition
    },
    mixins: [Widget, Notifier],
    props: {
        modalOpened: { type: Boolean, default: false },
    },
    data() {
        return {
            displayValue: '',
            joinType: 'inner',
            suggestions: [],
            suggestions1: [],
            suggestions2: [],
            valueObject: this.value !== null ?
                this.value : {
                    conditions: [], firstSelect: [], secondSelect: []
                }

        }
    },
    computed: {
        hasNameCollision() {
            return this._intersect(this.suggestions1, this.suggestions2).length > 0;
        }
    },
    mounted() {
        this.inferCondition();
        if (this.modalOpened) {
            this.openModal();
        }
        if (this.extendedSuggestionEvent) {
            const suggestions = this.extendedSuggestionEvent();
            try {
                const inputs = suggestions.inputs.sort((a, b) => a.order - b.order);

                if (inputs[0])
                    this.suggestions1 = inputs[0].attributes;
                if (inputs[1])
                    this.suggestions2 = inputs[1].attributes;
            } catch(e) {
                this.suggestions1 = suggestions;
                this.suggestions2 = suggestions;
            }
        }
        if (this.valueObject === '') {
            this.valueObject = {
                conditions: [], firstSelect: [], secondSelect: []
            };
        }
        this.joinType = this.valueObject.joinType || 'inner';
        this.updateDisplayValue(this.valueObject);
    },
    methods: {
        _intersect(a, b) {
            return a.filter(Set.prototype.has, new Set(b));
        },
        add() {
            this.$refs.condition.add();
            this.$nextTick(() => {
                //this.$refs.condition.scrollTop = this.$refs.condition.lastElementChild.offsetHeight;
            });
        },
        inferCondition() {
            return;
            /*let conditions = this.valueObject['conditions'];
                debugger
                if (conditions === null || conditions.length === 0) {
                    let a = this.suggestions1;
                    let b = this.suggestions2;

                    if (a.length < b.length) {
                        let tmp = a;
                        a = b;
                        b = tmp;
                    }
                    this.valueObject.conditions = a.filter((x) => b.includes(x)).map((x) => {
                        return { first: x, second: x }
                    });
                }*/
        },
        openModal() {
            this.$refs.modal.show();
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
            }
        },
        updateDisplayValue(v) {
            const firstName = this.$tc('common.input') + ' 1';
            const secondName = this.$tc('common.input') + ' 2';

            let firstSelect;
            let secondSelect;

            if (this.valueObject.firstSelectionType === 2) {
                firstSelect = v.firstSelect.filter(item => item.select)
                    .map(item => `[${firstName}].${item.attribute} AS ${item.alias}`).join(', \n\t');
            } else if (this.valueObject.firstSelectionType === 1) {
                firstSelect = `[${firstName}].*  \t /* prefix ${this.valueObject.firstPrefix} */`;
            }
            if (this.valueObject.secondSelectionType === 2) {
                secondSelect = v.secondSelect.filter(item => item.select)
                    .map(item => `[${secondName}].${item.attribute} AS ${item.alias}`).join(', ');
            } else if (this.valueObject.secondSelectionType === 1) {
                secondSelect = `[${secondName}].*  \t/* prefix ${this.valueObject.secondPrefix} */`;
            }

            let condition = v.conditions.map(item => `[${firstName}].${item.first} = [${secondName}].${item.second}`).join('\n AND ');

            let select = [firstSelect, secondSelect].filter(v => v).join(', \n\t');
            if (select === ', ') {
                select = '?'
            }
            if (condition === '') {
                condition = '?';
            }
            let result = `SELECT \n\t${select} \nFROM [${firstName}] \n${this.joinType.toUpperCase().replace('_', ' ')} JOIN [${secondName}] ON \n\t${condition}`;
            this.displayValue = result;
        },
        okClicked() {
            if (!this.$refs.form.reportValidity()) {
                this.error(null, this.$t('errors.missingRequiredValue'));
            } else {
                const missingConditions = this.valueObject.conditions.some(
                    c => c.op === '' || c.first === '' || c.second === '');
                if (missingConditions) {
                    this.error(null, this.$t('errors.missingRequiredValue'));
                } else {
                    this.submit();
                }
            }
        },
        submit() {
            //const invalid = (item) => item === null || item.trim() === '';

            this.valueObject.firstSelectionType = this.$refs.firstSelect.getSelectionType();
            this.valueObject.secondSelectionType = this.$refs.secondSelect.getSelectionType();

            if (this.valueObject.firstSelectionType === 2) {
                this.valueObject.firstSelect = this.$refs.firstSelect.getSelectList();
                this.valueObject.firstPrefix = null;
            } else {
                this.valueObject.firstSelect = null;
                this.valueObject.firstPrefix = this.$refs.firstSelect.getPrefix();
            }
            if (this.valueObject.secondSelectionType === 2) {
                this.valueObject.secondSelect = this.$refs.secondSelect.getSelectList();
                this.valueObject.secondPrefix = null;
            } else {
                this.valueObject.secondSelect = null
                this.valueObject.secondPrefix = this.$refs.secondSelect.getPrefix();
            }
            this.valueObject.conditions = this.$refs.condition.getConditions();
            this.valueObject.joinType = this.joinType;

            this.updateDisplayValue(this.valueObject);
            this.triggerUpdateEvent(this.message, this.field, this.valueObject);
            this.$refs.modal.hide();
        },
        cancelClicked() {
            this.$refs.modal.hide();
        }
    },
}
</script>
<style scoped>
    .side {
        height: 60vh;
        overflow-y: scroll;
        padding-bottom: 30px;
        border-bottom: 1px solid #aaa;
    }

    .zoom80 {
        font-size: .9em;
    }
</style>
