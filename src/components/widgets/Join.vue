<template>
    <div class="join-editor">
        <span>
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <textarea disabled :value="displayValue" class="form-control" rows="4"></textarea>
            <b-link v-if="!readOnly" variant="sm" @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <b-modal size="xl" :title="field.label" :hide-header="true" :cancel-title="$t('actions.cancel')" no-fade
            ref="modal">
            <form @submit.stop.prevent="submit" onsubmit="return false" ref="form" action="">
                <div class="row">
                    <div class="col-md-6 border-right">
                        <h5>{{$t('widgets.join.type')}}:</h5>
                        <select class="form-control mb-2" v-model="joinType">
                            <option value="inner">Inner</option>
                            <option value="left outer">Left outer</option>
                            <option value="right outer">Right outer</option>
                            <option value="full outer">Full outer</option>
                        </select>
                        <h5>{{$t('widgets.join.conditions')}}</h5>
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
                        <h5>Seleção de atributos</h5>
                        <div ref="selection">
                            <div class="row side">
                                <JoinSelect class="col-md-6" :selected="valueObject.leftSelect"
                                    :suggestions="suggestions1" :label="$tc('common.input') + ' 1'" ref="leftSelect" />
                                <JoinSelect class="col-md-6" :selected="valueObject.rightSelect"
                                    :suggestions="suggestions2" :label="$tc('common.input') +' 2'" ref="rightSelect" />
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
            suggestions1: { type: Array, required: true },
            suggestions2: { type: Array, required: true },
            modalOpened: { type: Boolean, default: false },
        },
        data() {
            return {
                displayValue: '',
                joinType: 'inner',
                suggestions: [],
                leftSelectList: [],
                rightSelectList: [],
                valueObject: this.value !== null && this.value.trim() !== '' ?
                    JSON.parse(this.value) : {
                        conditions: [], leftSelect: [], rightSelect: []
                    }

            }
        },
        mounted() {
            this.inferCondition();
            if (this.modalOpened) {
                this.openModal();
            }
            this.leftSelectList = [... this.suggestions1];
            this.rightSelectList = [... this.suggestions2];
            this.updateDisplayValue(this.valueObject);
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
                        return { left: x, right: x }
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
                const leftName = this.$tc('common.input') + ' 1';
                const rightName = this.$tc('common.input') + ' 2';
                const leftSelect = v.leftSelect.filter(item => item.select)
                    .map(item => `[${leftName}].${item.attribute} AS ${item.alias}`).join(', ');
                const rightSelect = v.rightSelect.filter(item => item.select)
                    .map(item => `[${rightName}].${item.attribute} AS ${item.alias}`).join(', ');

                let condition = v.conditions.map(item => `[left].${item.left} = [right].${item.right}`).join(' AND ');

                let select = [leftSelect, rightSelect].join(', ');
                if (select === ', '){
                    select = '?'
                }
                if (condition === ''){
                    condition = '?';
                }
                let result = `SELECT ${select} \nFROM [${leftName}] \n${this.joinType.toUpperCase()} JOIN [${rightName}] ON ${condition}`;
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

                this.valueObject.leftSelect = this.$refs.leftSelect.getSelectList();
                this.valueObject.rightSelect = this.$refs.rightSelect.getSelectList();

                this.valueObject.conditions = this.$refs.condition.getConditions();
                this.updateDisplayValue(this.valueObject);
                // this.$root.$emit(this.message, this.field,
                //     this.valueObject);
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
    }
</style>