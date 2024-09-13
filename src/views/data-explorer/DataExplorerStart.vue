<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Analisar, tratar e transformar dados</h1>
            </div>
            <hr>
            <div class="card-deck">
                <b-card>
                    <form @submit.prevent="create">
                        <h6>Passo 1</h6>
                        <hr>

                        <label class="" for="name">Nome do experimento:
                            <span v-if="errors.name" class="text-danger validation-error">
                                {{errors.name}}
                            </span>
                        </label>
                        <input id="name" v-model="name" v-focus type="text"
                               class="form-control w-50 form-control-sm mb-2" maxlength="100">


                        <label class="">
                            Escolha a fonte de dados:
                            <span v-if="errors.selectedDataSource" class="text-danger validation-error">
                                {{errors.selectedDataSource}}
                            </span>
                        </label>
                        <vue-select v-model="selectedDataSource" :filterable="false" :options="dataSourceList"
                                    label="name" class="w-50" @search="loadDataSourceList" @input="retrieveAttributes">
                            <template #no-options="{}">
                                <small>Digite parte do nome pesquisar ...</small>
                            </template>
                            <template #option="option">
                                <div class="d-center">
                                    <span class="span-id">{{pad(option.id, 4, '&nbsp;')}}</span> - {{option.name}}
                                </div>
                            </template>
                            <template #default>
                                <span>{{pad(option.id, 4, '&nbsp;')}}</span> - {{option.name}}
                            </template>
                            <template #selected-option="option">
                                <div class="selected d-center">
                                    {{pad(option.id, 4, '&nbsp;')}} - {{option.name}}
                                </div>
                            </template>
                        </vue-select>
                        <hr>
                        <button type="submit" class="btn btn-sm btn-primary pr-4 pl-4">
                            {{$t('actions.create2')}}
                        </button>
                        <b-link :to="{ name: 'index-explorer' }" class="btn btn-secondary btn-sm ml-1">
                            {{$t('actions.cancel')}}
                        </b-link>
                    </form>
                </b-card>
            </div>
        </div>
    </main>
</template>
<script>
import DataSourceMixin from './DataSourceMixin.js';
import axios from 'axios';
import vSelect from 'vue-select';
import Notifier from '../../mixins/Notifier.js';
import { Workflow } from './entities.js';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: { 'vue-select': vSelect },
    mixins: [Notifier, DataSourceMixin],
    data() {
        return {
            name: null,
            selectedDataSource: null,
            errors: { name: null, selectedDataSource: null }
        };
    },
    methods: {
        async create(ev) {
            if (this.name && this.selectedDataSource) {
                try {
                    let nextRouteName = 'data-explorer-panel';
                    let workflow;
                    if (this.$route.query.sql) {
                        workflow = Workflow.buildSqlBuilder(
                            this.name,
                            { value: this.selectedDataSource.id, labelValue: this.selectedDataSource.name },
                            this);
                        nextRouteName = 'sql-workflow';
                    } else {
                        workflow = Workflow.buildDataExplorer(
                            this.name,
                            { value: this.selectedDataSource.id, labelValue: this.selectedDataSource.name },
                            this);
                    }
                    const resp = await axios.post(`${tahitiUrl}/workflows`, workflow);
                    const workflowResp = resp.data;
                    if (this.$route.query.sql) {
                        this.success(this.$t('messages.savedWithSuccess', { what: this.$t('titles.workflow') }));
                    }
                    this.$router.push({ name: nextRouteName, params: { id: workflowResp.id } });

                } catch (e) {
                    this.error(e);
                }
            } else {
                if (!this.name) {
                    this.errors.name =
                        `${this.$t('errors.missingRequiredValue')}`;
                } else {
                    this.errors.name = '';
                }
                if (!this.selectedDataSource) {
                    this.errors.selectedDataSource =
                        `${this.$t('errors.missingRequiredValue')}`;
                } else {
                    this.errors.selectedDataSource = '';
                }
            }
            return false;
        }
    }
};
</script>
<style lang="">

</style>
