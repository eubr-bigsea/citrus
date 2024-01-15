<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$t('titles.platform', 1)}}</h1>
                    </div>

                    <b-card no-body>
                        <b-tabs card>
                            <b-tab :title="$t('common.basicInformation')">
                                <div class="row">
                                    <div v-if="platform.id" class="col-md-12 col-xg-12 mx-auto">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label class="font-weight-bold">{{$t('common.name')}}:</label>
                                                <br>
                                                {{platform.name}}
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$t('common.slug')}}:</label>
                                                <br>{{platform.slug}}
                                            </div>
                                            <div class="col-md-3">
                                                <b-form-checkbox v-model="platform.enabled">
                                                    {{$t('common.enabled')}}
                                                </b-form-checkbox>
                                            </div>
                                            <div class="col-md-12 mt-4">
                                                <label class="font-weight-bold">{{$t('common.description')}}:</label>
                                                <br>{{platform.description}}
                                            </div>
                                            <template v-if="platform.plugin">
                                                <div class="col-md-12 mt-4">
                                                    <h5>{{$t('common.plugin')}}</h5>
                                                    {{$t('message.platformIsPluginExplanation')}}
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="font-weight-bold">{{$t('common.url')}}:</label>
                                                    <br>{{platform.description}}
                                                </div>
                                            </template>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12 mt-4 border-top pt-2">
                                                <button class="btn btn-primary me-1 btn-spinner" @click.stop="save">
                                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                                    <font-awesome-icon icon="fa fa-save" />
                                                    {{$t('actions.save')}}
                                                </button>
                                                <router-link :to="{name: 'platforms'}" class="btn btn-secondary me-1">
                                                    {{$t('actions.cancel')}}
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab :title="$t('platform.subset', 2)">
                                <div class="row mt-4 mb-4">
                                    <div class="col-md-6">
                                        <label>Adicionar novo subconjunto de operações à plataforma:
                                        </label>
                                    </div>
                                    <div class="col-md-4">
                                        <input v-model="subsetName" type="text" class="form-control" maxlength="50">
                                    </div>
                                    <div class="col-md-2">
                                        <button class="btn btn-secondary" :disabled="subsetName.trim() === ''"
                                                @click="addSubset">
                                            {{$t('common.ok')}}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <table class="table table-bordered table-striped">
                                        <tr v-for="subset in platform.subsets" :key="subset.id" class="row">
                                            <td style="width: 80%">
                                                <input v-model="subset.name" type="text" maxlength="50"
                                                       class="form-control">
                                            </td>
                                            <td>
                                                <button class="btn btn-primary btn-sm me-1" :title="$t('actions.save')"
                                                        @click="saveSubset(subset)">
                                                    {{$t('actions.save')}}
                                                </button>
                                                <button class="btn btn-danger btn-sm" :title="$t('actions.delete')"
                                                        @click="removeSubset(subset)">
                                                    {{$t('actions.delete')}}
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </b-tab>
                            <b-tab :title="$t('titles.operation', 2)" @click.prevent="loadOperations">
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="alert mt-1 mb-2 alert-warning">
                                            <li>
                                                Desabilitar uma operação ou desassociá-la de um subconjunto pode fazer
                                                com que
                                                fluxos de trabalho deixem de funcionar. Faça alterações com cautela.
                                            </li>
                                            <li>
                                                Todas as operações são feitas imediatamente ao marcar ou desmarcar uma
                                                opção,
                                                sem confirmação prévia.
                                            </li>
                                            <li>
                                                Algumas operações podem estar listadas, mas não significa que elas estão
                                                implementadas e por isto podem
                                                não funcionar durante a execução do fluxo de trabalho.
                                            </li>
                                        </div>
                                    </div>
                                    <div class="md-10">
                                        <div v-if="loadingOperations" class="loading">
                                            <div class="spinner-grow" />
                                            <p>{{$t('common.loading')}}</p>
                                        </div>
                                        <div class="oplist">
                                            <table class="table table-sm table-smallest table-bordered table-stripped">
                                                <thead class="thead-light">
                                                    <tr>
                                                        <th class="text-center" style="width: 80px">
                                                            {{$t('common.enabled',
                                                                 1)}}
                                                        </th>
                                                        <th class="text-center" style="width: 80px">
                                                            {{$t('common.id', 1)}}
                                                        </th>
                                                        <th class="text-center">
                                                            {{$t('common.name', 1)}}
                                                        </th>
                                                        <th v-for="subset in platform.subsets" :key="subset.id"
                                                            class="subset text-center">
                                                            {{subset.name}}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tr v-for="op in operations" :key="op.id" class="child">
                                                    <td style="width: 50px" class="text-center">
                                                        <b-form-checkbox v-model="op.enabled"
                                                                         @change="toggleOperation(op)" />
                                                    </td>
                                                    <td style="width: 50px" class="text-center">
                                                        {{op.id}}
                                                    </td>
                                                    <td style="width: 120px" :title="op.description" class="pt-2">
                                                        {{op.name}}
                                                        <br><em>{{getCategory(op)}}</em>
                                                    </td>
                                                    <td v-for="subset in platform.subsets" :key="subset.id"
                                                        class="subset text-center">
                                                        <b-form-checkbox v-model="op.subsetIds" :value="subset.id"
                                                                         @change="toggleSubsetOperation(subset, op)" />
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                            <!--
                            <b-tab :title="$t('platform.subset', 2)">
                                <select class="form-control" @change="loadSubsetOperations" v-model="subsetId">
                                    <option></option>
                                    <option v-for="subset in platform.subsets" :key="subset.id" :value="subset.id">
                                        {{subset.name}}</option>
                                </select>
                                <div v-if="loadingSubsetOperations" class="loading">
                                    <div class="spinner-grow"></div>
                                    <p>{{$t('common.loading')}}</p>
                                </div>
                                <div v-if="subsetOperations.length > 0" class="op-parent">
                                    <div v-for="op in subsetOperations" :key="op.id" class="child"
                                        :title="op.description">
                                        <b-form-checkbox v-model="op.enabled">
                                            {{op.name}} </b-form-checkbox>
                                    </div>
                                </div>
                            </b-tab>
                            -->
                        </b-tabs>
                    </b-card>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
;
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
    },
    mixins: [Notifier, View],
    data(){
        return {
            isDirty: false,
            loadingOperations: false,
            operations: [],
            loadingSubsetOperations: false,
            subsetOperations: [],
            subsetId: null,
            platform: {},
            types: ['KUBERNETES', 'SPARK_LOCAL', 'MESOS', 'YARN'].sort(),
            currentSubset: {},
            subsetName: "",
        };
    },
    computed: {},
    watch: {
        '$route.params.id': function (){
            this.load().then(() => {
                this.$nextTick(() => {
                    this.isDirty = false;
                });
            });
        },
        platform: {
            handler(){
                this.isDirty = true;
            },
            deep: true
        }
    },
    mounted(){
        let self = this;
        this.load().then(() => {
            this.$nextTick(() => {
                self.isDirty = false;
            });
        });
    },
    /* Methods */
    methods: {
        removeSubset(subset){
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    axios.delete(`${tahitiUrl}/subsets/${subset.id}`)
                        .then(() => {
                            this.load();
                            this.success(
                                this.$t('messages.successDeletion', {
                                    what: this.$t('platform.subset', 1)
                                })
                            );
                        })
                        .catch(function (e){
                            self.error(e);
                        });
                });
        },
        saveSubset(subset){
            const self = this;
            const payload = {name: subset.name};
            axios.patch(`${tahitiUrl}/subsets/${subset.id}`, payload)
                .then(() => {
                    this.load();
                    this.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$t('platform.subset', 1)
                        })
                    );
                })
                .catch(function (e){
                    self.error(e);
                });
        },
        addSubset(){
            const self = this;
            if (this.subsetName.trim()){
                const payload = {
                    name: this.subsetName.trim(),
                    platform: {id: this.platform.id}
                };
                axios.post(`${tahitiUrl}/subsets`, payload)
                    .then(() => {
                        this.load();
                        self.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$t('platform.subset', 1)
                            })
                        );
                    })
                    .catch(function (e){
                        self.error(e);
                    });
            }
        },
        toggleOperation(operation){
            const self = this;
            const currentValue = operation.enabled;
            axios.delete(`${tahitiUrl}/operations/${operation.id}`)
                .then(() => {
                    // operation.enabled = ! operation.enabled;
                })
                .catch(function (e){
                    operation.enabled = currentValue;
                    self.error(e);
                });
        },
        toggleSubsetOperation(subset, operation){
            const self = this;
            const currentValue = operation.subsetIds.includes(subset.id);
            let axiosMethod = axios.post;
            if (currentValue){
                axiosMethod = axios.delete;
            }
            axiosMethod(`${tahitiUrl}/subsets/${subset.id}/${operation.id}`)
                .then(() => { })
                .catch(function (e){
                    operation.enabled = currentValue;
                    self.error(e);
                });
        },
        getCategory(op){
            const categ = op.categories.find(c => c.type === 'group');
            return categ ? categ.name : '-';
        },
        load(){
            let self = this;
            return new Promise((resolve, reject) => {
                axios
                    .get(`${tahitiUrl}/platforms/${this.$route.params.id}`)
                    .then(resp => {
                        self.platform = resp.data.data[0];
                        resolve();
                    })
                    .catch(function (e){
                        self.error(e);
                        reject();
                    });
            });
        },
        success(msg){
            this.$snotify.success(msg, this.$t('titles.success'));
        },
        error(e){
            if (e.name === 'NetworkError'){
                this.$snotify.error(
                    this.$t('errors.disconnected'),
                    this.$t('titles.error')
                );
            } else if (e.response && e.response.data){
                this.$snotify.error(e.response.data.message, this.$t('titles.error'));
            } else {
                this.$snotify.error(e.message, this.$t('titles.error'));
            }
        },
        loadOperations(){
            this._loadOperations(null, 'operations', 'loadingOperations');
        },
        _loadOperations(subsetId, target, loading){
            const self = this;
            const url = `${tahitiUrl}/operations`;
            const params = {
                lang: this.$root.$i18n.locale,
                platform: this.platform.id,
                partial: 1,
                disabled: true,
                ts: new Date().getTime(), // disable cache
            };
            self[loading] = true;
            return axios
                .get(url, {params})
                .then(resp => {
                    self[target] = resp.data.data;
                    resp.data.data.forEach(op => {
                        if (op.subsets){
                            op.subsetIds = op.subsets.map(s => s.id);
                        } else {
                            op.subset = [];
                        }
                    });
                }).catch(self.error)
                .finally(() => { self[loading] = false; });
        },
        save(event){
            const self = this;
            const url = `${tahitiUrl}/platforms/${this.platform.id}`;
            self.toggleLoading(event.target);
            return axios
                .patch(url, this.platform)
                .then(resp => {
                    self.platform = resp.data;
                    this.$nextTick(() => {
                        self.isDirty = false;
                    });
                    self.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$t('titles.platform', 1)
                        })
                    );
                    this.$router.push({name: 'platforms'});
                })
                .catch(e => {
                    self.error(e);
                })
                .finally(() => {
                    self.toggleLoading(event.target);
                });
        }
    }
};
</script>
<style>
    .v-select .dropdown-toggle::after {
        content: none;
    }

    .table-smallest {
        font-size: 0.7em;
    }

    .loading {
        margin: 0 auto;
        text-align: center;
        width: 200px;
    }

    .rotate {
        transform: rotate(90deg);
    }

    .oplist {
        height: 60vh;
        overflow: auto;
    }
</style>