<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom" data-test="header">
            <h1 class="templatePage-title" data-test="title">
                {{$t('pipeline.template.pipelineTemplates')}}
            </h1>
            <button class="btn btn-primary btn-lemonade-primary float-left ml-2" data-test="addTemplateBtn" @click="openAddModal">
                <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
            </button>
        </div>

        <ModalCreateTemplate ref="addTemplateModal" data-test="addTemplateModal" @onupdate-template-list="updateTemplateList" />

        <div class="templatePage-body">
            <div class="templatePage-card-right">
                <div class="templatePage-card-body">
                    <v-server-table ref="templateList" :data="tableData" class="templatePage-table" :columns="columns"
                                    :options="options" name="templateList" data-test="templatePipelineTable">
                        <template #id="props">
                            {{props.row.id}}
                        </template>
                        <template #name="props">
                            {{props.row.name}}
                        </template>
                        <template #description="props">
                            {{props.row.description === '' ? '-' : props.row.description}}
                        </template>
                        <template #steps="props">
                            <div :id="`trigger-${props.row.id}`" class="ml-1 btn btn-sm btn-secondary">
                                <font-awesome-icon icon="info-circle" />
                            </div>
                            <b-popover :target="`trigger-${props.row.id}`" triggers="hover" data-test="templatePipelineStepsInfo">
                                <template #title>
                                    {{$t('titles.step', 2)}}
                                </template>
                                <div v-if="props.row.steps.length === 0">
                                    {{$t('pipeline.noStepsTemplate')}}
                                </div>
                                <div v-for="(step, index) in props.row.steps" :key="step.name" class="templatePage-popover">
                                    <span class="font-weight-bold">#{{index + 1}} -</span> {{step.name}}
                                </div>
                            </b-popover>
                        </template>
                        <template #actions="props">
                            <div>
                                <button class="btn btn-sm btn-secondary" 
                                        :title="$t('actions.edit') + ' ' + $t('titles.template')" 
                                        @click.stop="openEditModal(props.row)">
                                    <font-awesome-icon icon="pen" />
                                </button>
                                <button v-b-modal.deleteModal 
                                        class="ml-2 btn btn-sm btn-danger" 
                                        :title="$t('actions.delete') + ' ' + $t('titles.template')" 
                                        @click="deleteTemplate(props.row.id, props.row.name)">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </div>
                        </template>
                    </v-server-table>
                    <ModalEditTemplate ref="editTemplateModal" 
                                       :edited-template="editedTemplate" 
                                       :edited-template-steps="editedTemplate.steps" 
                                       @onupdate-template-list="updateTemplateList" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
import ModalEditTemplate from './modal/ModalEditTemplate.vue';
import ModalCreateTemplate from './modal/ModalCreateTemplate.vue';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        ModalEditTemplate,
        ModalCreateTemplate
    },
    mixins: [Notifier],
    data() {
        return {
            stepInput: 'stepInput',
            stepTextarea: 'stepTextarea',
            columns: [
                'id',
                'name',
                'description',
                'steps',
                'actions'
            ],
            editedTemplate: { name: '', description: '', enabled: true, steps: [] },
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
                    name: this.$tc('common.name'),
                    description: this.$tc('common.description'),
                    steps: this.$tc('titles.step', 2),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['id', 'name'],
                filterable: ['name'],
                limitable: true,
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                preserveState: true,
                saveState: true,
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
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
            this.$refs.addTemplateModal.show();
        },
        openEditModal(row) {
            this.editedTemplate = {...row};
            this.$refs.editTemplateModal.show();
        },
        updateTemplateList() {
            this.$refs.templateList.refresh();
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
}

.templatePage-table {
    background-color: #FFF;
    width: 100%;
}

.templatePage-label {
    display: block;
    margin-bottom: 10px;
    align-items: center;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
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
    top: 5px;
    display: flex;
    justify-content: end;
    width: 100%;
}

</style>