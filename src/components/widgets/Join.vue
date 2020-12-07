<template>
    <div class="join-editor">
        <span>
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <textarea disabled :value="displayValue" class="form-control" rows="8"></textarea>
            <b-link v-if="!readOnly" variant="sm" @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <b-modal size="xl" :title="field.label" :hide-header="true" :cancel-title="$t('actions.cancel')" no-fade
            ref="modal">
            <form @submit.stop.prevent="submit" onsubmit="return false" ref="form" action="">
                <div class="row">
                    <div class="col-md-6 border-right">
                        <h6>{{$t('widgets.join.type')}}:</h6>
                        
                        <select class="form-control mb-2" v-model="joinType">
                            <option value="inner">Inner</option>
                            <option value="left_outer">Left outer</option>
                            <option value="right_outer">Right outer</option>
                            <!-- <option value="full_outer">Full outer</option> -->
                        </select>
                        <h6>{{$t('widgets.join.conditions')}}</h6>
                        <div class="side">
                            <JoinCondition :suggestions1="suggestions1" :suggestions2="suggestions2"
                                :conditions="valueObject.conditions" ref="condition" />
                        </div>
                        <div class="mt-2 border-top pt-2">
                            <button class="btn btn-success btn-sm" @click.prevent="add">
                                <span class="fa fa-plus"></span> {{$t('actions.addItem')}}</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Seleção de atributos</h6>
                        <div ref="selection">
                            <div class="row side">
                                <JoinSelect class="col-md-6" :selected="valueObject.firstSelect"
                                    :suggestions="suggestions1" :label="$tc('common.input') + ' 1'" ref="firstSelect"
                                    :selectionType="valueObject.firstSelectionType || 1"
                                    :prefix="valueObject.firstPrefix || 'ds1_'" />
                                <JoinSelect class="col-md-6" :selected="valueObject.secondSelect"
                                    :suggestions="suggestions2" :label="$tc('common.input') +' 2'" ref="secondSelect"
                                    :selectionType="valueObject.secondSelectionType || 1"
                                    :prefix="valueObject.secondPrefix || 'ds2_'" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div slot="modal-footer" class="w-100 text-right">
                <b-button @click.prevent.stop="okClicked" variant="primary" class="mr-1">{{$t('common.ok')}}</b-button>
                <b-btn @click="cancelClicked" variant="secondary">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    import Notifier from '../../mixins/Notifier';
    import JoinSelect from './JoinSelect';
    import JoinCondition from './JoinCondition';

    export default {
        mixins: [Widget, Notifier],
        components: {
            LabelComponent, JoinSelect, JoinCondition
        },
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
        mounted() {
            this.inferCondition();
            if (this.modalOpened) {
                this.openModal();
            }
            if (this.extendedSuggestionEvent) {
                const suggestions = this.extendedSuggestionEvent();
                if (suggestions.inputs[0])
                    this.suggestions1 = suggestions.inputs[0].attributes;
                if (suggestions.inputs[1])
                    this.suggestions2 = suggestions.inputs[1].attributes;
            }
            if (this.valueObject === '') {
                this.valueObject = {
                    conditions: [], firstSelect: [], secondSelect: []
                };
            }
            this.updateDisplayValue(this.valueObject);
            this.joinType = this.valueObject.joinType || 'inner';
        },
        methods: {
            add() {
                this.$refs.condition.add();
                this.$nextTick(() => {
                    //this.$refs.condition.scrollTop = this.$refs.condition.lastElementChild.offsetHeight;
                });
            },
            inferCondition() {
                return;
                let conditions = this.valueObject['conditions'];
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
                }
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
                let result = `SELECT \n\t${select} \nFROM [${firstName}] \n${this.joinType.toUpperCase()} JOIN [${secondName}] ON \n\t${condition}`;
                this.displayValue = result;
            },
            okClicked(ev) {
                if (!this.$refs.form.reportValidity()) {
                    this.error(null, this.$t('errors.missingRequiredValue'));
                } else {
                    this.submit();
                }
            },
            submit(ev) {
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
                this.updateDisplayValue(this.valueObject);
                this.$root.$emit(this.message, this.field,
                    this.valueObject);
                this.$refs.modal.hide();
            },
            cancelClicked(ev) {
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
</style>