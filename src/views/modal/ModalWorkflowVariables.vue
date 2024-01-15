<template>
    <b-modal ref="modal" size="xl" hide-header>
        <b-tabs class="filter-field">
            <b-tab :title="$t('workflow.variables', 2)">
                <div class="row user-filter">
                    <div class="col-md-4 mt-4">
                        <div class="values pb-1 border">
                            <div v-for="(row, index) in itemsCopy" :key="row.name" class="clear-fix item-list"
                                 :class="{selected: selected && selected.index === row.index }"
                                 @click.prevent="select(row, index)">
                                <small>{{row.name}} <em v-if="! row.name">&lt;variável sem nome&gt;</em>
                                    <span v-if="row.label">({{row.label}})</span></small>
                                <a class="float-right ms-1 bn btn-sm py-0 btn-light text-danger" href="#"
                                   :title="$t('actions.delete')" @click.prevent.stop="remove($event, index)">
                                    <font-awesome-icon icon="fa fa-minus-circle text-danger" />
                                </a>
                            </div>
                        </div>
                        <button class="btn btn-success btn-sm mt-2" @click.prevent="add">
                            <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                        </button>
                    </div>
                    <div class="col-md-8">
                        <div v-if="selected" class="form-filter ">
                            <div class="row">
                                <div class="col-md-4">
                                    <label>{{$t('variables.name')}}:</label>
                                    <input v-model="selected.name" v-focus maxlength="40" autocomplete="off"
                                           class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label>{{$t('variables.label')}}:</label>
                                    <input v-model="selected.label" maxlength="40" autocomplete="off"
                                           class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label>{{$t('variables.type')}}:</label>
                                    <select v-model="selected.type" class="form-control">
                                        <option />
                                        <option v-for="dt in dataTypes" :key="dt" :value="dt">
                                            {{$t('dataTypes.' + dt)}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label>{{$t('variables.defaultValue')}}:</label>
                                    <input v-model="selected.default_value" maxlength="40" autocomplete="off"
                                           class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label>{{$t('variables.multiplicity')}}:</label>
                                    <select v-model="selected.multiplicity" class="form-control" tabindex="0">
                                        <option value="0">
                                            Opcional
                                        </option>
                                        <option value="2">
                                            0 ou mais
                                        </option>
                                        <option value="1">
                                            Exatamente 1
                                        </option>
                                        <option value="3">
                                            1 ou mais
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label>{{$t('variables.index')}}:</label>
                                    <input v-model="selected.parameters.display_index" maxlength="4" autocomplete="off"
                                           class="form-control w-50" type="number" min="0" max="100">
                                </div>
                                <div class="col-md-12">
                                    <label>{{$t('variables.description')}}:</label>
                                    <textarea v-model="selected.description" autocomplete="off"
                                              class="form-control form-control-sm" rows="3" />
                                </div>
                                <!--
                                <div class="col-md-12">
                                    <label>{{$t('variables.help')}}:</label>
                                    <textarea v-model="selected.help" maxlength="300" autocomplete="off"
                                        class="form-control" rows="1"></textarea>
                                </div>
                                -->
                                <div class="col-md-12">
                                    <label>Lista de valores personalizados (use JSON):</label>
                                    <textarea v-model="selected.parameters.values" maxlength="300" autocomplete="off"
                                              class="form-control form-control-sm" rows="3" />
                                    <em>Exemplo:</em>
                                    <br>
                                    <code>[
                                        {"key": 1, "value": "Primeira escolha"},
                                        {"key": 2, "value": "Segunda escolha"}
                                        ]</code>
                                    <br>
                                    O valor de <code>key</code> será atribuído à variável e <code>value</code> é
                                    exibido.
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <h5 class="text-secondary text-center mt-5">
                                <span class="text-warning fa fa-2x fa-exclamation-triangle" />
                                <br>
                                <span v-html="$t('variables.addOrEdit')" />
                            </h5>
                        </div>
                    </div>
                </div>
            </b-tab>
            <b-tab :title="$t('titles.systemVariables', 2)">
                <div class="col-md-12 mt-1">
                    <table class="table table-sm table-bordered" style="font-size:.8em">
                        <tr v-for="v in variables" :key="v">
                            <td style="width:20%">
                                <code v-html="'${' + v + '}'" />
                            </td>
                            <td>
                                {{$t('variables.names.' + v)}}
                            </td>
                        </tr>
                    </table>
                </div>
                <p class="lead mark small bg-light p-3 m-2">
                    Variáveis de sistema são definidas pelo Lemonade e podem ser usadas no fluxo como qualquer outra
                    variável.
                    Os valores também são atribuídos às variáveis pelo Lemonade de forma dinâmica,
                    durante a execução do
                    fluxo de trabalho, não podendo o usuário
                    alterá-los diretamente.
                </p>
            </b-tab>
        </b-tabs>
        <p class="lead mark small bg-light p-3 m-2">
            Variáveis podem ser usadas como parâmetros na construção do fluxo de trabalho. Para usar uma variável,
            use a representação <code>${nome-variável}</code> por exemplo nas propriedades das tarefas.
        </p>
        <template #modal-footer>
            <div class="w-100 text-right">
                <b-button variant="primary" size="sm" class="me-1 ps-5 pe-5" @click="okClicked">
                    {{$t('common.ok')}}
                </b-button>
            </div>
        </template>
    </b-modal>
</template>
<script>
export default {
    props: {
        items: { type: Array, default: () => [], required: true }
    },
    emits: ['ok'],
    data() {
        return {
            variables: [
                'date', 'date_at_min', 'date_at_max', 'now', 'user_id',
                'user_login', 'user_name', 'workflow_id', 'workflow_name'
            ],
            dataTypes: [
                'DATE',
                'DECIMAL',
                'INTEGER',
                'CHARACTER',
                'BINARY',
            ],
            selected: null,
            itemsCopy: this.items
        };
    },
    methods: {
        add() {
            if (this.itemsCopy === null) {
                this.itemsCopy = [];
            }
            const value = {
                name: '', description: '', help: '',
                type: '', label: '', default_value: '',
                parameters: { values: [], display_index: null }, index: 0,
            };
            this.selected = value;
            value.index = this.itemsCopy.length;
            this.itemsCopy.push(value);
        },
        remove(e, index) {
            this.itemsCopy.splice(index, 1);
        },
        select(row, index) {
            row.index = index;
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
            this.selected = null;
            this.$refs.modal.show();
        },
        okClicked() {
            this.$emit('ok', this.itemsCopy);
            this.$refs.modal.hide();
        },
    }
};
</script>
<style>
    div.values {
        height: 300px;
        min-height: 300px;
        overflow: auto;
    }

    .form-filter,
    .form-filter select,
    .form-filter input {
        font-size: .9em
    }

    .user-filter .item-list {
        border-bottom: 1px solid #ccc;
        margin-top: 1px;
        padding: 2px 5px;
        cursor: pointer;
    }

    .user-filter .selected {
        background: #007bff;
        border: none;
        color: white;
    }

    .filter-field .nav-tabs {
        padding-left: 15px;
        margin-bottom: 0;
        border: none;
    }

    .filter-field .tab-content {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
    }
</style>
<style lang="scss" scoped>
    div.variables {
        height: 200px;
        min-height: 200px;
        ;
        overflow: auto;
    }
</style>