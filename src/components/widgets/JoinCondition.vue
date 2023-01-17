<template>
    <div ref="condition">
        <table v-if="conditionList && conditionList.length"
               class="table table-sm">
            <thead>
                <th class="text-center"
                    style="width:40%">
                    {{$tc('common.input')}} 1
                </th>
                <th style="width: 10%;" />
                <th class="text-center"
                    style="width:40%">
                    {{$tc('common.input')}} 2
                </th>
                <th class="text-center"
                    style="width:5%" />
            </thead>
            <tbody>
                <tr v-for="(row, index) in conditionList"
                    :key="index"
                    class="inputs">
                    <td>
                        <v-select ref="select1"
                                  v-model="row.first"
                                  :options="suggestions1"
                                  :taggable="true"
                                  required
                                  :close-on-select="true"
                                  push-tags
                                  select-on-tag
                                  :clear-search-on-blur="({clearSearchOnSelect, multiple}) => handleBlurSelect(clearSearchOnSelect, multiple, 'select1', index)">
                            <div slot="no-options" />
                        </v-select>
                    </td>
                    <td class="text-center">
                        <select v-model="row.op"
                                class="form-control"
                                @change="(v) => attrUpdated(row, 'op', v)">
                            <option value="eq"
                                    selected>
                                =
                            </option>
                            <option value="ne">
                                ≠
                            </option>
                            <option value="gt">
                                &gt;
                            </option>
                            <option value="lt">
                                &lt;
                            </option>
                            <option value="ge">
                                ≥
                            </option>
                            <option value="le">
                                ≤
                            </option>
                        </select>
                    </td>
                    <td>
                        <v-select ref="select2"
                                  v-model="row.second"
                                  :options="suggestions2"
                                  :taggable="true"
                                  :close-on-select="true"
                                  push-tags
                                  select-on-tag
                                  :clear-search-on-blur="({clearSearchOnSelect, multiple}) => handleBlurSelect(clearSearchOnSelect, multiple, 'select2', index)">
                            <div slot="no-options" />
                        </v-select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger"
                                @click="remove($event, index)">
                            <font-awesome-icon icon="trash" />
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
        suggestions1: { type: Array, default: () =>  [] },
        suggestions2: { type: Array, default: () =>  [] },
        conditions: { type: Array, default: () => []},
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
        add() {
            if (this.conditionList === null) {
                this.conditionList = [];
            }
            this.conditionList.push({ first: '', second: '', op: 'eq'});
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
        },
        handleBlurSelect(clearSearchOnSelect, multiple, selectRefName, index) {
            const elem = this.$refs[selectRefName][index];
            if (elem.searching) {
                // select currently highlighted value (like pressing Enter)
                elem.typeAheadSelect()
            }

            // return default value
            return clearSearchOnSelect && !multiple
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
