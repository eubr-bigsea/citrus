<template>
    <div ref="condition">
        <table class="table table-sm" v-if="conditions && conditions.length">
            <thead>
                <th class="text-center" style="width:45%">Input 1</th>
                <th style="width: 20px;"></th>
                <th class="text-center" style="width:45%">Input 2</th>
                <th class="text-center" style="width:5%"></th>
            </thead>
            <tbody>
                <tr v-for="(row, index) in conditions" class="inputs">
                    <td>
                        <select class="form-control" @change="(v) => attrUpdated(row, 'left', v)" v-model="row.left" required>
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
                        <select class="form-control" @change="(v) => attrUpdated(row, 'right', v)" v-model="row.right" required>
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
            <em>Nenhuma condição informada. Pressione o botão abaixo para adicionar uma nova.</em>
        </div>
    </div>
</template>
<script>
    export default {
        components: {
        },
        props: {
            suggestions1: { type: Array, default: () => [] },
            suggestions2: { type: Array, default: () => [] },
            conditions: { type: Array, default: () => [] },
        },
        data() {
            return {
            }
        },
        mounted() {

        },
        methods: {
            add(e) {
                if (this.conditions === null) {
                    this.conditions = [];
                }
                this.conditions.push({ left: '', right: '' });
                // this.$nextTick(() => {
                //     this.$refs.condition.parent.scrollTop = this.$refs.condition.lastElementChild.offsetHeight;
                // });
            },
            attrUpdated(row, attr, evt) {
                row[attr] = evt.target.value;
            },
            remove(e, index) {
                this.conditions.splice(index, 1);
                e.stopPropagation();
                e.preventDefault();
                return false;
            },
            moveUp(e, index) {
                let tmp = this.conditions.splice(index, 1)[0];
                this.conditions.splice(index - 1, 0, tmp)
                e.stopPropagation();
                return false;
            },
            moveDown(e, index) {
                let tmp = this.conditions.splice(index, 1)[0]
                this.conditions.splice(index + 1, 0, tmp)
                e.stopPropagation();
                return false;
            },
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