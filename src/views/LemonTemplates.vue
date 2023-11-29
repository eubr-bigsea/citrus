<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="templatePage-title">
                Templates para Pipeline
            </h1>
            <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="abrirAddTemplateModal">
                <font-awesome-icon icon="fa fa-plus" /> Adicionar
            </button>
        </div>

        <b-modal ref="addTemplateModal" title="Criação de template" size="lg" scrollable
                 @ok="criarTemplate">
            <div class="templatePage-card-modal">
                <div>
                    <label class="templatePage-label" for="identificador">Identificador</label>
                    <input id="identificador" v-model="novoTemplate.identificador" class="templatePage-input" type="text"
                           placeholder="Identificador do template">
                </div>

                <div>
                    <label class="templatePage-label" for="descricao">Descrição</label>
                    <textarea id="descricao" v-model="novoTemplate.descricao" class="templatePage-textarea" type="text"
                              placeholder="Descrição do template" />
                </div>
                <div>
                    <label class="templatePage-label" for="descricao">
                        Etapas
                        <button id="popover-trigger" class="templatePage-tab-button">
                            <font-awesome-icon icon="info-circle" />
                        </button>
                        <b-popover target="popover-trigger" triggers="hover">
                            Segure e arraste as etapas abaixo para reordená-las.
                        </b-popover>
                    </label>
                    <div class="templatePage-input-container">
                        <draggable :options="dragOptions">
                            <div v-for="(input, index) in stepsInputs" :key="index" class="templatePage-input-box">
                                <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                                <input v-model="input.identificador" placeholder="Identificador da etapa" class="templatePage-input" maxlength="50"
                                       :class="stepInput">
                                <textarea v-model="input.descricao" placeholder="Descrição da etapa" class="templatePage-textarea" maxlength="200"
                                          :class="stepTextarea" />
                                <button class="btn btn-sm btn-danger" @click="removeInput(index)">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </div>
                        </draggable>
                        <button class="btn btn-sm btn-primary mt-2" @click="addInput">
                            <font-awesome-icon icon="plus" />
                        </button>
                    </div>
                </div>
            </div>
        </b-modal>

        <div class="templatePage-body">
            <div class="templatePage-card-right">
                <div class="templatePage-card-body">
                    <v-client-table v-model="data" class="templatePage-table" :columns="columns" :options="options">
                        <template #id="props">
                            {{props.row.id}}
                        </template>
                        <template #identificador="props">
                            {{props.row.identificador}}
                        </template>
                        <template #etapas="props">
                            <div :id="`trigger-${props.row.id}`" class="ml-2 btn btn-sm btn-secondary">
                                <font-awesome-icon icon="info-circle" />
                            </div>
                            <b-popover :target="`trigger-${props.row.id}`" triggers="hover">
                                <template #title>
                                    Etapas
                                </template>
                                <div v-for="(etapa, index) in props.row.etapas" :key="etapa.identificador" class="templatePage-popover">
                                    <span class="font-weight-bold">#{{index + 1}} -</span> {{etapa.identificador}}
                                </div>
                            </b-popover>
                        </template>
                        <template #acoes="props">
                            <div>
                                <button class="btn btn-sm btn-secondary" title="Editar template" @click="abrirEditModal(props.row)">
                                    <font-awesome-icon icon="pen" />
                                </button>
                                <button class="ml-2 btn btn-sm btn-danger" title="Excluir template" @click="abrirDeleteModal">
                                    <font-awesome-icon icon="trash" />
                                </button>
                                <b-modal ref="editModal" title="Editar template" size="lg">
                                    <div class="templatePage-card-modal">
                                        <div>
                                            <label class="templatePage-label" for="identificador">Identificador</label>
                                            <input id="identificador" v-model="novoTemplate.identificador" class="templatePage-input" type="text" 
                                                   maxlength="50" placeholder="Identificador do template">
                                        </div>

                                        <div>
                                            <label class="templatePage-label" for="descricao">Descrição</label>
                                            <textarea id="descricao" v-model="novoTemplate.descricao" class="templatePage-textarea" type="text" 
                                                      maxlength="200" placeholder="Descrição do template" />
                                        </div>
                                        <div>
                                            <label class="templatePage-label" for="descricao">
                                                Etapas
                                                <button id="popover-trigger" class="templatePage-tab-button">
                                                    <font-awesome-icon icon="info-circle" />
                                                </button>
                                                <b-popover target="popover-trigger" triggers="hover">
                                                    Segure e arraste as etapas abaixo para reordená-las.
                                                </b-popover>
                                            </label>
                                            <div class="templatePage-input-container">
                                                <draggable :options="dragOptions">
                                                    <div v-for="(input, index) in stepsInputs" :key="index" class="templatePage-input-box">
                                                        <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                                                        <input v-model="input.identificador" placeholder="Identificador da etapa" class="templatePage-input" maxlength="50"
                                                               :class="stepInput">
                                                        <textarea v-model="input.descricao" placeholder="Descrição da etapa" class="templatePage-textarea" maxlength="200"
                                                                  :class="stepTextarea" />
                                                        <button class="btn btn-sm btn-danger" @click="removeInput(index)">
                                                            <font-awesome-icon icon="trash" />
                                                        </button>
                                                    </div>
                                                </draggable>
                                                <button class="btn btn-sm btn-primary mt-2" @click="addInput">
                                                    <font-awesome-icon icon="plus" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </b-modal>
                                <b-modal ref="deleteModal" title="Confirmar exclusão">
                                    <p>Deseja excluir este template?</p>
                                </b-modal>
                            </div>
                        </template>
                    </v-client-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { BModal } from 'bootstrap-vue';
import draggable from 'vuedraggable';

export default {
    components: {
        draggable,
        BModal
    },
    data() {
        return {
            stepInput: 'stepInput',
            stepTextarea: 'stepTextarea',
            stepsInputs: [
                { identificador: '', descricao: '' }
            ],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            columns: [
                'id',
                'identificador',
                'descricao',
                'etapas',
                'acoes'
            ],
            data: getData(),
            options: {
                // debounce: 800,
                skin: 'table-sm table table-hover',
                columnsClasses: { 
                    id: 'text-start',
                    identificador: 'text-start',
                    descricao: 'text-start',
                    etapas: 'text-start',
                    acoes: 'text-start',
                },
                headings: {
                    id: 'ID',
                    identificador: 'Identificador',
                    descricao: 'Descrição',
                    etapas: 'Etapas',
                    acoes: 'Ações',
                },
                sortable: ['id', 'identificador', 'descricao'],
                filterable: true,
                limitable: true,
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
            },
            novoTemplate: { identificador: '', descricao: ''}
        };
    },
    methods: {
        abrirAddTemplateModal() {
            this.novoTemplate = { identificador: '', descricao: ''};
            this.stepsInputs = [ { identificador: '', descricao: '' } ];
            this.$refs.addTemplateModal.show();
        },
        addInput() {
            this.stepsInputs.push({ value: '' });
        },
        removeInput: function(index) {
            this.stepsInputs.splice(index, 1);
        },
        abrirEditModal(row) {
            this.novoTemplate = {...row};
            this.stepsInputs = [...row.etapas];
            this.$refs.editModal.show();
        },
        abrirDeleteModal() {
            this.$refs.deleteModal.show();
        },
        criarTemplate() {
            const novoTemplate = {
                id: this.data.length + 1,
                identificador: this.novoTemplate.identificador,
                descricao: this.novoTemplate.descricao,
                etapas: this.stepsInputs,
                acoes: ''
            };

            this.data.push(novoTemplate);
            console.log(novoTemplate);

            this.novoTemplate.identificador = '';
            this.novoTemplate.descricao = '';

            this.$refs.addTemplateModal.hide();
        }
    }
};

function getData() {
    return [
        { 
            id: 1,
            identificador: "Template Teste",
            descricao: "Descrição Template Teste",
            etapas: [ {identificador: 'Remover linhas vazias', descricao: ' Desc Passo 1'}, {identificador: 'Normalizar', descricao: ' Desc Passo 2'} ],
            acoes: ""
        },
        { 
            id: 2,
            identificador: "Template 1",
            descricao: "Descrição Template 1",
            etapas: [ {identificador: 'Passo teste', descricao: ' Desc Passo teste'}, {identificador: 'Passo 2', descricao: ' Desc Passo 2'} ],
            acoes: ""
        },
        { 
            id: 3,
            identificador: "Template Lemon",
            descricao: "Descrição Template Lemon",
            etapas: [ {identificador: 'Passo 1', descricao: ' Desc Passo 1'}, {identificador: 'Passo dois', descricao: ' Desc Passo dois'} ],
            acoes: ""
        },
        { 
            id: 4,
            identificador: "Template para pipeline",
            descricao: "Descrição Template para Pipeline",
            etapas: [ {identificador: 'Passo 1', descricao: ' Desc Passo 1'}, {identificador: 'Passo 2', descricao: ' Desc Passo 2'} ],
            acoes: ""
        },
        { 
            id: 5,
            identificador: "Template Lemonade",
            descricao: "Descrição Template Lemonade",
            etapas: [ {identificador: 'Passo 1', descricao: ' Desc Passo 1'}, {identificador: 'Passo 2', descricao: ' Desc Passo 2'}, {identificador: 'Passo três', descricao: ' Desc Passo três'} ],
            acoes: ""
        },
    ];
}
</script>

<style lang="scss">

.templatePage-title {
    color: #333;
    margin: 10px 0px;
}

.templatePage-body {
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #dee2e6;
    padding: 16px;
    gap: 10px;
}

.templatePage-card-modal {
    width: 100%;
    background-color: #fff;
    padding: 10px;
}

.templatePage-table {
    background-color: #FFF;
    width: 100%;
}

.templatePage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
    align-items: center;
}

.templatePage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;

    &.stepInput {
        margin-bottom: 0px;
        font-size: 14px;
    }
}

.templatePage-textarea {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;
    max-height: 100px;

    &.stepTextarea {
        margin-bottom: 0px;
        height: 45px;
    }
}

.templatePage-input-container {
    overflow-y: auto;
    max-height: 250px;
}

.templatePage-input-box {
    display: flex;
    gap: 10px;
    margin-bottom: -2px;
    border-bottom: 2px solid #eff0f6;
    padding: 10px 0px;
    padding-right: 10px;
    border-radius: 3px;
    align-items: center;
    font-weight: 500;

    &:hover {
        cursor: grab;
    }
}

.templatePage-popover {
    padding: 0px;
    font-weight: 400;
}

.templatePage-tab-button {
    background-color: transparent;
    border: 0px;
    color: black;
    font-size: 15px;
}

.templatePage-dragIcon {
    color: #212529;
    width: 12px;
}

</style>