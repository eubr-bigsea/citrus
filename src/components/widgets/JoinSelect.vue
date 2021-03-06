<template>
    <div>
        <div class="text-center font-weight-bold">{{label}}</div>
        <b-radio value="1" v-model.number="innerSelectionType"> Todos os atributos prefixados</b-radio>
        <input type="text" class="form-control" v-if="innerSelectionType === 1" v-model.number="selectionPrefix">
        <b-radio class="mb-2 mt-3" value="3" v-model="innerSelectionType"> Nenhum atributo</b-radio>
        <b-radio class="mb-2 mt-3" value="2" v-model.number="innerSelectionType"> Selecionar atributos</b-radio>
        
        <table class="table table-sm table-borderless" v-if="innerSelectionType === 2">
            <tbody>
                <tr class="table-secondary">
                    <th style="width: 10px">
                        <input type="checkbox" class="checkbox" @change="toggleChecks" :checked="allSelected" />
                    </th>
                    <th style="width: 100%">
                        <input type="text" maxlength="20" class="form-control" placeholder="Rename selected"
                            :disabled="checked.length === 0" @keyup="changePrefix($event)" ref="prefix" />
                    </th>
                    <th style="max-width: 20px">
                        <small>Use</small>
                    </th>
                </tr>
                <tr v-for="(s, index) in selectList" class="inputs">
                    <td>
                        <input type="checkbox" class="checkbox" :value="index" v-model="checked"
                            :title="$t('actions.edit')" />
                    </td>
                    <td>
                        <b-form-input required maxlength="100" class="form-control" v-model="s.alias"
                            @keyup="uncheck(index)" />
                        <small><em>{{s.attribute}}</em></small>
                    </td>
                    <td style="width: 20px">
                        <b-form-checkbox v-model="s.select" name="check-button" switch/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import { debounce } from '../../util.js';
    export default {
        props: {
            suggestions: { type: Array, default: function () { return [] } },
            label: { type: String },
            prefix: { type: String },
            selected: { type: Array, default: function () { return [] } },
            selectionType: { type: Number, default: 1 },
        },
        data() {
            return {
                allSelected: true,
                checked: [],
                selectList: [],
                selectionPrefix: null,
                innerSelectionType: 1,
            }
        },
        mounted() {
            if (this.selected && this.selected.length > 0) {
                let counter = 0;
                const attributesFound = new Set();
                this.selected.forEach(item => {
                    if (this.suggestions.includes(item.attribute)) {
                        attributesFound.add(item.attribute);
                        this.selectList.push(Object.assign({}, item));
                        if (item.select) {
                            this.checked.push(counter);
                        }
                        counter++;
                    }
                });
                this.suggestions.forEach(item => {
                    if (!attributesFound.has(item)) {
                        this.selectList.push({ attribute: item, alias: item, select: false });
                    }
                });
            } else {
                this.selectList = this.suggestions.map(item => {
                    return { attribute: item, alias: item, select: true };
                });
                this.checked = [...Array(this.suggestions.length).keys()];
            }
            this.selectionPrefix = this.prefix;
            this.innerSelectionType = this.selectionType;
        },
        methods: {
            changePrefix: debounce(function (ev) {
                const prefix = ev.target.value.trim();
                if (prefix.length) {
                    this.selectList.forEach((item, index) => {
                        item.alias = this.checked.includes(index) ? `${prefix}${item.attribute}` : item.alias;
                    });
                } else {
                    this.selectList.forEach((item, index) => {
                        if (this.checked.includes(index)) {
                            item.alias = item.attribute;
                        }
                    });
                }
            }, 400),
            toggleChecks() {
                if (this.allSelected) {
                    this.checked = [];
                } else {
                    this.checked = [...Array(this.suggestions.length).keys()];
                    this.$refs.prefix.focus();
                }
                this.allSelected = !this.allSelected;
            },
            uncheck(value) {
                this.checked = this.checked.filter(item => item !== value);
            },
            getSelectList() {
                return this.selectList;
            },
            getPrefix(){
                return this.selectionPrefix;
            },
            getSelectionType(){
                return this.innerSelectionType;
            }
        },
    }
</script>
<style scoped>
    .inputs select,
    input {
        font-size: .7em;
        padding: 0 2px;
    }
</style>