<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="templatePage-title">
                Templates para Pipeline
            </h1>
            <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="openAddModal">
                <font-awesome-icon icon="fa fa-plus" /> Adicionar
            </button>
        </div>

        <b-modal ref="addModal" title="Criação de template" size="lg" 
                 scrollable @ok="createTemplate">
            <div class="templatePage-card-modal">
                <div class="position-relative">
                    <label class="templatePage-label" for="identificador">Identificador</label>
                    <input id="identificador"
                           v-model="createTemplateName" 
                           class="templatePage-input" 
                           type="text"
                           maxlength="50"
                           placeholder="Identificador do template"
                           @input="handleInput('create')">
                    <div v-if="invalidInputLength" class="templatePage-invalid-length">
                        - Identificador do template deve ter pelo menos 3 caracteres.
                    </div>
                </div>

                <div>
                    <label class="templatePage-label" for="descricao">Descrição</label>
                    <textarea id="descricao" 
                              v-model="createTemplateDescription" 
                              class="templatePage-textarea" 
                              type="text"
                              maxlength="200" 
                              required
                              placeholder="Descrição do template" />
                </div>
                <div class="position-relative">
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
                            <div v-for="(input, index) in stepsInputs" :key="`step-${index}-${addModalKey}`" class="templatePage-input-box" @dragend="handleDragEnd">
                                <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                                {{setOrder(input, index)}}
                                #{{index + 1}}
                                <input v-model="input.name" 
                                       placeholder="Identificador da etapa" 
                                       class="templatePage-input" 
                                       maxlength="50"
                                       :class="stepInput">
                                <textarea v-model="input.description" 
                                          placeholder="Descrição da etapa" 
                                          class="templatePage-textarea" 
                                          maxlength="200"
                                          :class="stepTextarea" />
                                <button class="btn btn-sm btn-danger" @click="removeCreateTemplateInput(index)">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </div>
                        </draggable>
                        <button class="btn btn-sm btn-primary mt-2" @click="addCreateTemplateInput">
                            <font-awesome-icon icon="plus" />
                        </button>
                    </div>
                </div>
            </div>
        </b-modal>

        <div class="templatePage-body">
            <div class="templatePage-card-right">
                <div class="templatePage-card-body">
                    <v-server-table ref="templateList" :data="tableData" class="templatePage-table" :columns="columns"
                                    :options="options" name="templateList">
                        <template #id="props">
                            {{props.row.id}}
                        </template>
                        <template #name="props">
                            {{props.row.name}}
                        </template>
                        <template #steps="props">
                            <div :id="`trigger-${props.row.id}`" class="ml-2 btn btn-sm btn-secondary">
                                <font-awesome-icon icon="info-circle" />
                            </div>
                            <b-popover :target="`trigger-${props.row.id}`" triggers="hover">
                                <template #title>
                                    Etapas
                                </template>
                                <div v-for="(step, index) in props.row.steps" :key="step.name" class="templatePage-popover">
                                    <span class="font-weight-bold">#{{index + 1}} -</span> {{step.name}}
                                </div>
                            </b-popover>
                        </template>
                        <template #actions="props">
                            <div>
                                <button class="btn btn-sm btn-secondary" title="Editar template" @click="openEditModal(props.row)">
                                    <font-awesome-icon icon="pen" />
                                </button>
                                <button v-b-modal.deleteModal class="ml-2 btn btn-sm btn-danger" title="Excluir template" @click="deleteTemplate(props.row.id, props.row.name)">
                                    <font-awesome-icon icon="trash" />
                                </button>
                                <b-modal :ref="`editModal-${props.row.name}`" title="Editar template" size="lg" @ok="editTemplate" 
                                         @hidden="cancelEdit">
                                    <div class="templatePage-card-modal">
                                        <div class="position-relative">
                                            <label class="templatePage-label" for="identificador">Identificador</label>
                                            <input id="identificador" 
                                                   v-model="editedTemplate.name" 
                                                   class="templatePage-input" 
                                                   type="text" 
                                                   maxlength="50" 
                                                   placeholder="Identificador do template"
                                                   @input="handleInput('edit')">
                                            <div v-if="invalidInputLength" class="templatePage-invalid-length">
                                                Identificador do template deve ter pelo menos 3 caracteres.
                                            </div>
                                        </div>

                                        <div>
                                            <label class="templatePage-label" for="descricao">Descrição</label>
                                            <textarea id="descricao" 
                                                      v-model="editedTemplate.description" 
                                                      class="templatePage-textarea" 
                                                      type="text" 
                                                      maxlength="200" 
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
                                                    <div v-for="(input, index) in editedTemplate.steps" :key="index" class="templatePage-input-box">
                                                        <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                                                        {{setOrder(input, index)}}
                                                        #{{index + 1}}
                                                        <input v-model="input.name" 
                                                               placeholder="Identificador da etapa" 
                                                               class="templatePage-input" 
                                                               maxlength="50"
                                                               :class="stepInput">
                                                        <textarea v-model="input.description" 
                                                                  placeholder="Descrição da etapa" 
                                                                  class="templatePage-textarea" 
                                                                  maxlength="200"
                                                                  :class="stepTextarea" />
                                                        <button class="btn btn-sm btn-danger" @click="removeEditTemplateInput(index)">
                                                            <font-awesome-icon icon="trash" />
                                                        </button>
                                                    </div>
                                                </draggable>
                                                <button class="btn btn-sm btn-primary mt-2" @click="addEditTemplateInput">
                                                    <font-awesome-icon icon="plus" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </b-modal>
                            </div>
                        </template>
                    </v-server-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { BModal } from 'bootstrap-vue';
import draggable from 'vuedraggable';
import Notifier from '../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        draggable,
        BModal
    },
    mixins: [Notifier],
    data() {
        return {
            stepInput: 'stepInput',
            stepTextarea: 'stepTextarea',
            addModalKey: 0,
            stepsInputs: [
                { name: '', description: '', order: null, enabled: true }
            ],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            columns: [
                'id',
                'name',
                'description',
                'steps',
                'actions'
            ],
            editedTemplate: { name: '', description: '', enabled: true, steps: [] },
            templateStepsLength: null,
            createTemplateName: '',
            createTemplateDescription: '',
            invalidInputLength: true,
            tableData: [],
            options: {
                skin: 'table-sm table table-hover',
                columnsClasses: { 
                    id: 'text-start',
                    name: 'text-start',
                    description: 'text-start',
                    steps: 'text-start',
                    actions: 'text-start',
                },
                headings: {
                    id: 'ID',
                    name: 'Identificador',
                    description: 'Descrição',
                    steps: 'Etapas',
                    actions: 'Ações',
                },
                sortable: ['id', 'name', 'description'],
                filterable: ['id', 'name', 'description'],
                limitable: true,
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                requestFunction: this.load
            },
        };
    },
    methods: {
        load(data) {
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = data.limit;
            data.name = data.query;
            data.fields = 'id,name,description,steps';
            data.disabled = 1;
            
            this.$Progress.start();
            return axios
                .get(`${tahitiUrl}/pipeline-templates`, {
                    params: data
                })
                .then(resp => {
                    this.$Progress.finish();
                    return { data: resp.data.data, count: resp.data.pagination.total };
                })
                .catch(
                    function (e) {
                        this.$Progress.finish();
                        this.error(e);
                    }.bind(this)
                );
        },
        openAddModal() {
            this.invalidInputLength = true;
            this.createTemplateName = '';
            this.createTemplateDescription = '';
            this.stepsInputs = [ { id: 0, name: '', description: '', order: null, enabled: true } ];
            this.$refs.addModal.show();
        },
        addCreateTemplateInput() {
            this.stepsInputs.push({ id: 0, enabled: true });
        },
        addEditTemplateInput() {
            this.editedTemplate.steps.push({ enabled: true });
        },
        removeCreateTemplateInput: function(index) {
            this.stepsInputs.splice(index, 1);
        },
        removeEditTemplateInput: function(index) {
            this.editedTemplate.steps.splice(index, 1);
        },
        openEditModal(row) {
            const refEditModal = `editModal-${row.name}`;

            this.invalidInputLength = false;
            this.editedTemplate = {...row};
            this.stepsInputs = [...row.steps];
            this.templateStepsLength = this.editedTemplate.steps.length;
            this.$refs[refEditModal].show();
        },
        setOrder(input, index) {
            input.order = index + 1;
        },
        handleInput(type) {
            if (type === 'create') this.invalidInputLength = this.createTemplateName.length < 3;
            else this.invalidInputLength = this.editedTemplate.name.length < 3;
        },
        handleDragEnd() {
            this.$nextTick(() => {
                this.editedTemplate.steps = [...this.editedTemplate.steps];
            });
        },
        cancelEdit() {
            if (this.templateStepsLength !== this.editedTemplate.steps.length) this.$refs.templateList.refresh();
        },
        createTemplate(e) {
            if (this.invalidInputLength) {
                e.preventDefault();
                return;
            }
            const data = {
                name: this.createTemplateName,
                description: this.createTemplateDescription,
                enabled: true,
                steps: this.stepsInputs
            };

            axios
                .post(`${tahitiUrl}/pipeline-templates`, data)
                .then(() => {
                    this.success('Template criado com sucesso');
                    this.$refs.templateList.refresh();
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );

            this.$refs.addModal.hide();
        },
        editTemplate() {
            axios
                .patch(`${tahitiUrl}/pipeline-templates/${this.editedTemplate.id}`, this.editedTemplate)
                .then(() => {
                    this.success('Template editado com sucesso');
                    this.$refs.templateList.refresh();
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
        deleteTemplate(templateId, templateName) {
            this.confirm(
                this.$t('actions.delete') + " '" + templateName + "'",
                this.$t('messages.doYouWantToDelete'),
                () => {
                    axios
                        .delete(`${tahitiUrl}/pipeline-templates/${templateId}`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successDeletion', {
                                    what: 'Template'
                                })
                            );
                            this.$refs.templateList.refresh();
                        })
                        .catch(
                            function (e) {
                                this.error(e);
                            }.bind(this)
                        );
                }
            );
        }

    }
};

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

.templatePage-invalid-length {
    color: red;
    font-size: 12px;
    position: absolute;
    top: 10px;
    display: flex;
    justify-content: end;
    width: 100%;
}

</style>