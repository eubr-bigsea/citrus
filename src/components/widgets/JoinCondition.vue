<template>
    <div ref="condition">
        <table class="table table-sm" v-if="conditionList && conditionList.length">
            <thead>
                <th class="text-center" style="width:40%">{{this.$tc('common.input')}} 1</th>
                <th style="width: 10%;"></th>
                <th class="text-center" style="width:40%">{{this.$tc('common.input')}} 2</th>
                <th class="text-center" style="width:5%"></th>
            </thead>
            <tbody>
                <tr v-for="(row, index) in conditionList" class="inputs">
                    <td>
                        <select class="form-control" @change="(v) => attrUpdated(row, 'first', v)" v-model="row.first"
                            required>
                            <option></option>
                            <option v-for="s in suggestions1">{{s}}</option>
                        </select>
                    </td>
                    <td class="text-center">
                        <select class="form-control" @change="(v) => attrUpdated(row, 'op', v)" v-model="row.op">
                            <option value="eq" selected>=</option>
                            <option value="ne">≠</option>
                            <option value="gt">&gt;</option>
                            <option value="lt">&lt;</option>
                            <option value="ge">≥</option>
                            <option value="le">≤</option>
                            
                        </select>
                    </td>
                    <td>
                        <select class="form-control" @change="(v) => attrUpdated(row, 'second', v)" v-model="row.second"
                            required>
                            <option></option>
                            <option v-for="s in suggestions2">{{s}}</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger" @click="remove($event, index)">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else>
            <small>{{$t('widgets.join.noCondition')}}</small>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            suggestions1: { type: Array, function() { return []; } },
            suggestions2: { type: Array, function() { return []; } },
            conditions: { type: Array, function() { return []; } },
        },
        data() {
            return {
                conditionList: []
            }
        },
        mounted() {
            if (this.conditions && this.conditions.length) {
                this.conditionList = [... this.conditions];
            }
        },
        methods: {
            add(e) {
                if (this.conditionList === null) {
                    this.conditionList = [];
                }
                this.conditionList.push({ first: '', second: '' });
                // this.$nextTick(() => {
                //     this.$refs.condition.parent.scrollTop = this.$refs.condition.lastElementChild.offsetHeight;
                // });
            },
            attrUpdated(row, attr, evt) {
                row[attr] = evt.target.value;
            },
            remove(e, index) {
                this.conditionList.splice(index, 1);
                e.stopPropagation();
                e.preventDefault();
                return false;
            },
            moveUp(e, index) {
                let tmp = this.conditionList.splice(index, 1)[0];
                this.conditionList.splice(index - 1, 0, tmp)
                e.stopPropagation();
                return false;
            },
            moveDown(e, index) {
                let tmp = this.conditionList.splice(index, 1)[0]
                this.conditionList.splice(index + 1, 0, tmp)
                e.stopPropagation();
                return false;
            },
            getConditions() {
                return [... this.conditionList];
            }
        },
    }
</script>
<style scoped>
    .inputs select,
    input {
        font-size: .8em;
        padding: 0 2px;
    }
</style>