<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>
                    <font-awesome-icon icon="fa fa-vial" /> {{$t('dataExplorer.tagline', 1)}}
                </h1>
            </div>
            <hr>
            <div class="card-deck ">
                <b-card class="clickable m-1" role="button">
                    <div class="row">
                        <div class="rounded-option bg-primary">
                            <font-awesome-icon icon="fa fa-table" size="3x" inverse />
                        </div>
                        <div class="col mt-2" @click="navigate('data-explorer')">
                            <h5>Analisar, tratar e transformar dados</h5>
                            <small>
                                Utilize uma interface amigável e responsiva para tratar os dados. Você poderá
                                experimentar
                                como transformar os dados, obtendo um retorno imediato (usa amostra dos dados).
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable m-1" role="button" @click="navigate('choose-task')">
                    <div class="row">
                        <div class="rounded-option bg-success">
                            <font-awesome-icon icon="fa fa-robot" size="3x" inverse />
                        </div>
                        <div class="col">
                            <h5>Criar modelo de aprendizado de máquina</h5>
                            <small>
                                Crie modelos de aprendizado de máquina, definindo qual tarefa e algoritmos aplicar,
                                quais <em>features</em> usar e quais métricas lhe
                                darão o melhor modelo.
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable m-1" role="button" @click="navigate('new-visualization')">
                    <div class="row">
                        <div class="rounded-option bg-danger">
                            <font-awesome-icon icon="fa fa-chart-bar" size="3x" inverse />
                        </div>
                        <div class="col mt-2">
                            <h5>Criar visualizações de dados</h5>
                            <small>
                                Monte gráficos, tabelas e outras visualizações de dados.
                                Associe-os a <em>dashboards</em> e compartilhe-os com outros usuários.
                            </small>
                        </div>
                    </div>
                </b-card>
                <!--
                <b-card class="clickable m-1">
                    <div class="row">
                        <div class="col-md-4 col-sm-12 col-lg-3">
                            <span class="fa-stack fa-2x">
                                <font-awesome-icon icon="fa fa-circle text-warning fa-stack-2x" />
                                <font-awesome-icon icon="fa fa-trophy fa-stack-1x fa-inverse" />
                            </span>
                        </div>
                        <div class="col-md-9 mt-2">
                            <h5>Aplicar ou avaliar um modelo usando um conjunto novo de dados</h5>
                            <small>
                                Utilize uma interface bla bla bla para tratar os dados. Você poderá experimentar
                                como
                                transformar bla bla
                            </small>
                        </div>
                    </div>
                </b-card>
                -->
            </div>
        </div>
        <div class="row mt-3">
            <h5>Ou você quer editar algo existente?</h5>
            <div class="col-md-12 custom-table">
                <b-card>
                    <v-server-table ref="workflowList" :columns="columns" :options="options"
                                    name="workflowListDataExperiments">
                        <template #id="props">
                            <router-link v-if="props.row.type === 'DATA_EXPLORER'"
                                         :to="{ name: 'data-explorer-panel', params: { id: props.row.id } }">
                                {{props.row.id}}
                            </router-link>
                            <router-link v-if="props.row.type === 'MODEL_BUILDER'"
                                         :to="{ name: 'model-design', params: { id: props.row.id } }">
                                {{props.row.id}}
                            </router-link>
                            <router-link v-if="props.row.type === 'VIS_BUILDER'"
                                         :to="{ name: 'visualization-design', params: { id: props.row.id } }">
                                {{props.row.id}}
                            </router-link>
                        </template>
                        <template #type="props">
                            <font-awesome-icon :icon="getIcon(props.row)" />
                            {{$t(`dataExplorer.experiments.${props.row.type}`)}}
                        </template>
                        <template #user="props">
                            {{props.row.user.name}}
                        </template>
                        <template #name="props">
                            <router-link v-if="props.row.type === 'DATA_EXPLORER'"
                                         :to="{ name: 'data-explorer-panel', params: { id: props.row.id } }">
                                {{props.row.name}}
                            </router-link>
                            <router-link v-if="props.row.type === 'MODEL_BUILDER'"
                                         :to="{ name: 'model-design', params: { id: props.row.id } }">
                                {{props.row.name}}
                            </router-link>
                            <router-link v-if="props.row.type === 'VIS_BUILDER'"
                                         :to="{ name: 'visualization-design', params: { id: props.row.id } }">
                                {{props.row.name}}
                            </router-link>
                        </template>
                        <template #updated="props">
                            {{$filters.formatJsonDate(props.row.updated)}}
                        </template>
                        <template #afterFilter>
                            <label>Tipo:</label>
                            <select v-model="typeFilter" class="form-select w-50 form-select-sm" @change="handleSelectType">
                                <option selected disabled>
                                    {{$t('actions.choose')}}...
                                </option>
                                <option value="DATA_EXPLORER">
                                    {{$t('dataExplorer.experiments.DATA_EXPLORER')}}
                                </option>
                                <option value="MODEL_BUILDER">
                                    {{$t('dataExplorer.experiments.MODEL_BUILDER')}}
                                </option>
                                <option value="VIS_BUILDER">
                                    {{$t('dataExplorer.experiments.VIS_BUILDER')}}
                                </option>
                            </select>
                        </template>
                        <template #actions="props">
                            <button class="ms-2 btn btn-sm btn-danger" :title="$t('actions.delete')"
                                    @click="remove(props.row.id, props.row.name)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </template>
                    </v-server-table>
                </b-card>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import Notifier from '@/mixins/Notifier.js';
import DataTableBuilder from '@/data-table-builder.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const META_PLATFORM_SLUG = 'meta';
export default {
    name: 'IndexComponent',
    mixins: [Notifier],
    data() {
        const self = this;
        const dtBuilder = new DataTableBuilder(this.$t)
            .columns(['id',
                'name',
                'user',
                'type',
                'updated',
                'version',
                'actionsx'])
            .headings({
                id: 'ID',
                name: this.$t('common.name'),
                user: this.$t('common.user.name'),
                type: this.$t('common.type'),
                updated: this.$t('common.updated'),
                version: this.$t('common.version'),
                actions: this.$t('common.action', 2)
            })
            .sortable('name', 'id', 'updated')
            .filterable('name')
            .saveState(true)
            .perPageValues([])
            .requestFunction(async function (data) {
                self.typeFilter = data.customQueries?.typeFilter;
                data.sort = data.orderBy;
                data.asc = data.ascending === 1 ? 'true' : 'false';
                data.size = 5;
                data.name = data.query;
                data.platform = META_PLATFORM_SLUG;
                data.types = self.typeFilter;

                data.fields = 'id,name,platform,updated,user,version,description,type';
                data.enabled = 1;

                let url = `${tahitiUrl}/workflows`;
                try {
                    const resp = await axios.get(url, { params: data });
                    self.totalRecords = resp.data.pagination.total;
                    return {
                        data: resp.data.data,
                        count: resp.data.pagination.total,
                        customQueries: { typeFilter: self.typeFilter }
                    };
                } catch (e) {
                    self.error(e);
                    return {
                        data: [], count: 0
                    };
                }
            }
            );

        return {
            ...dtBuilder.build(),
            totalRecords: 0,
            searchFilter: null,
            typeFilter: null,
            columns: [
                'id',
                'name',
                'user',
                'type',
                'updated',
                'version',
                'actions'
            ],
        };
    },
    methods: {
        remove(workflowId, name) {
            const self = this;
            this.confirm(
                this.$t('actions.delete') + " '" + name + "'",
                this.$t('messages.doYouWantToDelete'),
                async function () {
                    const url = `${tahitiUrl}/workflows/${workflowId}`;
                    try {
                        await axios.delete(url, {});
                        self.success(self.$t('messages.successDeletion',
                            { what: self.$t('titles.workflow', 1) }));
                        self.$refs.workflowList.getData();
                    } catch (e) {
                        self.error(e);
                    }
                }
            );

        },
        navigate(name) {
            this.$router.push({ name });
        },
        clearFilters() {
            this.$refs.workflowList.setFilter('');
            this.$refs.workflowList.customQueries = {};
        },
        getIcon(row) {
            return {
                'DATA_EXPLORER': 'fa-table',
                'MODEL_BUILDER': 'fa-robot',
                'VIS_BUILDER': 'fa-chart-bar',
            }[row.type];
        },
        handleSelectType(ev) {
            const table = this.$refs.workflowList;
            table.setCustomQuery({ typeFilter: ev.target.value });
            table.getData();

        }
    }
};
</script>
<style scoped>
.custom-table>>>.VueTables .row:first-child {
    margin: initial !important;
    background-color: white;
    padding-top: 0;
}

.rounded-option {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    width: 80px;
    height: 80px;
    border-radius: 40px;
}
</style>