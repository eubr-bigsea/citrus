<template>
    <div ref="condition">
        <table class="table table-sm" v-if="conditionList && conditionList.length">
            <thead>
                <th class="text-center" style="width:45%">{{this.$tc('common.input')}} 1</th>
                <th style="width: 20px;"></th>
                <th class="text-center" style="width:45%">{{this.$tc('common.input')}} 2</th>
                <th class="text-center" style="width:5%"></th>
            </thead>
            <tbody>
                <tr v-for="(row, index) in conditionList" class="inputs">
                    <td>
                        <select class="form-control" @change="(v) => attrUpdated(row, 'left', v)" v-model="row.left"
                            required>
                            <option></option>
                            <option v-for="s in suggestions1">{{s}}</option>
                        </select>
                    </td>
                    <td class="text-center pt-2">
                        <font-awesome-layers class="fa-lg">
                            <font-awesome-icon icon="circle" :style="{ color: 'green' }" />
                            <font-awesome-icon icon="equals" transform="shrink-6" :style="{ color: 'white' }" />
                        </font-awesome-layers>
                    </td>
                    <td>
                        <select class="form-control" @change="(v) => attrUpdated(row, 'right', v)" v-model="row.right"
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
            <em>{{$t('widgets.join.noCondition')}}</em>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            suggestions1: { type: Array, function(){ return [];} },
            suggestions2: { type: Array, function(){ return [];} },
            conditions: { type: Array, function(){ return [];} },
        },
        data() {
            return {
                conditionList: []
            }
        },
        mounted() {
            if (this.conditions && this.conditions.length){
                this.conditionList = [... this.conditions];
            }
        },
        methods: {
            add(e) {
                if (this.conditionList === null) {
                    this.conditionList = [];
                }
                this.conditionList.push({ left: '', right: '' });
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
            getConditions(){
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