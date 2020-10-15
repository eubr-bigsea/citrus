<template>
    <div>
        <table class="table table-sm">
            <thead>
                <th class="text-center" style="width:5%"></th>
                <th class="text-center" style="width:45%">{{label}}</th>
            </thead>
            <tbody>
                <tr class="table-secondary">
                    <th style="width: 10px">
                        <input type="checkbox" class="checkbox" @change="toggleChecks" :checked="allSelected" />
                    </th>
                    <th style="width: 100%">
                        <input type="text" maxlength="20" class="form-control" placeholder="Inform the prefix"
                            :disabled="checked.length === 0" @keyup="changePrefix($event)" ref="prefix" />
                    </th>
                    <th style="max-width: 20px">

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
                        <b-form-checkbox v-model="s.select" name="check-button" switch></b-form-checkbox>
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
            suggestions: { type: Array, default: () => [] },
            label: { type: String },
            selected: { type: Array, default: () => [] }
        },
        data() {
            return {
                allSelected: true,
                checked: [],
                selectList: [],
            }
        },
        mounted() {
            if (this.selected.length > 0) {
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
        },
        methods: {
            changePrefix: debounce(function (ev) {
                const prefix = ev.target.value.trim();
                if (prefix.length) {
                    this.selectList.forEach((item, index) => {
                        item.alias = this.checked.includes(index) ? `${prefix}_${item.attribute}` : item.alias;
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