<template>
    <b-modal ref="modal" size="xl" :title="$tc('workflow.variables', 2)" :ok-only="true">
        <div class="row">
            <div class="col-md-4">
                <div class="variables border p-2">
                    <div v-for="(row, index) in items" class="border-bottom">
                        <a href="#" @click.prevent.stop="remove($event, index)" :title="$t('actions.delete')">
                            <span class="fa fa-minus-circle"></span>
                        </a>&nbsp;
                        <a href="#" @click.prevent="select(row)"><span class="fa fa-edit"></span></a>
                        <small>{{row.name}}
                            <span v-if="row.label">({{row.label}})</span></small>
                    </div>
                </div>
                <div class="mt-2 border-top pt-2">
                    <button class="btn btn-success btn-sm" @click.prevent="add">
                        <span class="fa fa-plus"></span> {{$t('actions.addItem')}}</button>
                </div>
            </div>
            <div class="col-md-8">
                <div v-if="selected" class="form-filter ">
                    <div class="row">
                        <div class="col-md-4">
                            <label>{{$t('variables.name')}}</label>
                            <input v-model="selected.name" maxlength="40" autocomplete="off" class="form-control" />
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.label')}}</label>
                            <input v-model="selected.label" maxlength="40" autocomplete="off" class="form-control" />
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.description')}}</label>
                            <input v-model="selected.description" maxlength="60" autocomplete="off"
                                class="form-control" />
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.type')}}</label>
                            <select class="form-control" v-model="selected.type">
                                <option></option>
                                <option v-for="dt in dataTypes" :key="dt" :value="dt">
                                    {{$t('dataTypes.' + dt)}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.defaultValue')}}</label>
                            <input v-model="selected.default_value" maxlength="40" autocomplete="off"
                                class="form-control" />
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.multiplicity')}}</label>
                            <select class="form-control" v-model="selected.multiplicity" tabindex="0">
                                <option value="0">Opcional</option>
                                <option value="2">0 ou mais</option>
                                <option value="1">Exatamente 1</option>
                                <option value="3">Mais de 1</option>
                            </select>
                        </div>
                        <div class="col-md-8">
                            <label>{{$tc('variables.values', 2)}}</label>
                            <textarea v-model="selected.parameters" maxlength="300" autocomplete="off"
                                class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h5 class="text-secondary text-center mt-5">
                        <span class="fa fa-exclamation-triangle"></span>
                        <br />
                        <span v-html="$t('variables.addOrEdit')"></span>
                    </h5>
                </div>
            </div>
            <div class="col-md-12">
                {{$tc('titles.systemVariables', 2)}}<br />
                <table class="table table-sm table-bordered" style="font-size:.8em">
                    <tr v-for="v in variables">
                        <td style="width:20%">
                            <code v-html="'${' + v +  '}'"></code>
                        </td>
                        <td>
                            {{$tc('variables.names.' + v)}}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </b-modal>
</template>
<script>
    export default {
        data() {
            return {
                variables: [
                    'date', 'date_at_min', 'date_at_ax', 'now', 'user_id',
                    'user_login', 'user_name', 'workflow_id', 'workflow_name'
                ],
                dataTypes: [
                    'DATE',
                    'DECIMAL',
                    'FILE',
                    'TIME',
                    'INTEGER',
                    'CHARACTER',
                    'TEXT',
                ],
                selected: null,

            };
        },
        props: {
            items: { type: Array, default: () => [], required: true }
        },
        methods: {
            add(e) {
                if (this.items === null) {
                    this.items = [];
                }
                const value = {
                    name: '', description: '', help: '',
                    type: '', label: '', default_value: '', parameters: ''
                };
                this.selected = value;
                this.items.push(value);
            },
            remove(e, index) {
                this.items.splice(index, 1);
            },
            select(row) {
                this.selected = row;
            },
            isNameValid(evt) {
                //only allow a-z, A-Z and digits 0-9
                const value = evt.target.value;
                if (!evt.key.match(/[\w\d,]/) || (value.length == 0 && evt.key.match(/\d/))) {
                    evt.preventDefault();
                }
            },
            show() {
                this.$refs.modal.show();
            },
        }
    }
</script>
<style lang="scss" scoped>
    div.variables {
        height: 200px;
        min-height: 200px;
        ;
        overflow: auto;
    }
</style>