<template lang="">
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Analisar, tratar e transformar dados</h1>
            </div>
            <hr>
            <div class="card-deck">
                <b-card>
                    <h6>Passo 1</h6>
                    <hr>
                    <label class="" for="name">Nome do experimento:</label>
                    <input id="name" v-model="name" v-focus type="text"
                           class="form-control w-50 form-control-sm mb-2"
                           maxlength="100">

                    <label class="">Escolha a fonte de dados:</label>
                    <vue-select v-model="selectedDataSource" :filterable="false" :options="dataSourceList" label="name"
                                class="w-50" @search="loadDataSourceList" @input="retrieveAttributes">
                        <template #no-options="{ }">
                            <small>Digite parte do nome pesquisar ...</small>
                        </template>
                        <template #option="option">
                            <div class="d-center">
                                <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{ option.name }}
                            </div>
                        </template>
                        <template #default="options">
                                {{pad(option.id, 4, '&nbsp;')}}</span> - {{option.name}}
                        </template>
                        <template #selected-option="option">
                            <div class="selected d-center">
                                {{pad(option.id, 4, '&nbsp;')}} - {{option.name}}
                            </div>
                        </template>
                    </vue-select>
                    <hr>
                    <button class="btn btn-sm btn-primary pr-4 pl-4"
                            @click.prevent="create">
                        {{$t('actions.create2')}}
                    </button>
                    <b-link :to="{ name: 'index-explorer'}" class="btn btn-secondary btn-sm ml-1">
                        {{$t('actions.cancel')}}
                    </b-link>
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
        };
    },
    methods: {
        async create() {
            try {
                const workflow = Workflow.buildDataExplorer(
                    this.name,
                    { value: this.selectedDataSource.id, labelValue: this.selectedDataSource.name },
                    this)
                const resp = await axios.post(`${tahitiUrl}/workflows`, workflow);
                const workflowResp = resp.data;
                this.$router.push({ name: 'data-explorer-panel', params: { id: workflowResp.id } });
            } catch (e) {
                this.error(e);
            }

        }
    },
}
</script>
<style lang="">

</style>
