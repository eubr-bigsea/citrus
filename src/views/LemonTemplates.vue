<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="configPage-title">
                Templates para Pipeline
            </h1>
            <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="abrirAddTemplateModal">
                <font-awesome-icon icon="fa fa-plus" /> Adicionar
            </button>
        </div>

        <b-modal ref="addTemplateModal" title="Criação de template" size="md" @ok="criarTemplate">
            <div class="configPage-card-modal">
                <div>
                    <label class="configPage-label" for="identificador">Identificador</label>
                    <input id="identificador" v-model="novoTemplate.identificador" class="configPage-input" type="text"
                           placeholder="Identificador do template">
                </div>

                <div>
                    <label class="configPage-label" for="descricao">Descrição</label>
                    <textarea id="descricao" v-model="novoTemplate.descricao" class="configPage-textarea" type="text"
                              placeholder="Descrição do template" />
                </div>
                <div>
                    <label class="configPage-label" for="descricao">Etapas</label>
                    <div>
                        <div v-for="(input, index) in stepsInputs" :key="index" class="configPage-input-box">
                            <input v-model="input.identificador" placeholder="Identificador da etapa" class="configPage-input" :class="stepInput">
                            <input v-model="input.descricao" placeholder="Descrição da etapa" class="configPage-input" :class="stepInput">
                            <button class="btn btn-sm btn-danger" @click="removeInput(index)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                        <button class="btn btn-sm btn-primary" @click="addInput">
                            <font-awesome-icon icon="plus" />
                        </button>
                    </div>
                </div>
            </div>
        </b-modal>

        <div class="configPage-body">
            <div class="configPage-card-right">
                <div class="configPage-card-body">
                    <v-client-table v-model="data" class="configPage-table" :columns="columns" :options="options">
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
                                <div v-for="(etapa, index) in props.row.etapas" :key="etapa.identificador" class="configPage-popover">
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
                                <b-modal ref="editModal" title="Editar template">
                                    <div class="configPage-card-modal">
                                        <div>
                                            <label class="configPage-label" for="identificador">Identificador</label>
                                            <input id="identificador" v-model="novoTemplate.identificador" class="configPage-input" type="text" 
                                                   placeholder="Identificador do template">
                                        </div>

                                        <div>
                                            <label class="configPage-label" for="descricao">Descrição</label>
                                            <textarea id="descricao" v-model="novoTemplate.descricao" class="configPage-textarea" type="text"
                                                      placeholder="Descrição do template" />
                                        </div>
                                        <div>
                                            <label class="configPage-label" for="descricao">Etapas</label>
                                            <div>
                                                <div v-for="(input, index) in stepsInputs" :key="index" class="configPage-input-box">
                                                    <input v-model="input.identificador" placeholder="Identificador da etapa" class="configPage-input" :class="stepInput">
                                                    <input v-model="input.descricao" placeholder="Descrição da etapa" class="configPage-input" :class="stepInput">
                                                    <button class="btn btn-sm btn-danger" @click="removeInput(index)">
                                                        <font-awesome-icon icon="trash" />
                                                    </button>
                                                </div>
                                                <button class="btn btn-sm btn-primary" @click="addInput">
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

export default {
    components: {
        BModal
    },
    data() {
        return {
            stepInput: 'stepInput',
            stepsInputs: [
                { identificador: '', descricao: '' }
            ],
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
                    id: 'text-center',
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
                sortable: ['id', 'identificador', 'descricao', 'etapas', 'acoes'],
                filterable: true,
                limitable: true,
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
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

.configPage-title {
    color: #333;
    margin: 10px 0px;
}

.configPage-body {
    /* display: flex; */
    /* flex-direction: row; */
    background-color: #fff;
    /* width: 100%; */
    border-radius: 3px;
    border: 1px solid #dee2e6;
    padding: 16px;
    gap: 10px;
}

.configPage-card-modal {
    width: 100%;
    background-color: #fff;
    padding: 10px;
}

.configPage-table {
    background-color: #FFF;
    width: 100%;
}

.configPage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
}

.configPage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;

    &.stepInput {
        margin-bottom: 0px;
        width: 45%;
        font-size: 14px;
        padding: 7px 10px;
    }
}

.configPage-textarea {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;
}

.configPage-input-box {
    display: flex;
    margin: 10px 0px;
    justify-content: space-between;
}

.configPage-popover {
    padding: 0px;
    font-weight: 400;
}

</style>