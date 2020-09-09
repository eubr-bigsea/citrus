<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.platform', 1)}}</h1>
                    </div>
                    
                    <b-card no-body>
                        <b-tabs card>
                            <b-tab :title="$t('common.basicInformation')">
                                <div class="row">
                                    <div v-if="platform.id" class="col-md-12 col-xg-12 mx-auto">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                <br />
                                                {{platform.name}}
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$tc('common.slug')}}:</label>
                                                <br />{{platform.slug}}
                                            </div>
                                            <div class="col-md-3">
                                                <b-form-checkbox v-model="platform.enabled">
                                                    {{ $t('common.enabled') }}
                                                </b-form-checkbox>
                                            </div>
                                            <div class="col-md-12 mt-4">
                                                <label class="font-weight-bold">{{$tc('common.description')}}:</label>
                                                <br />{{platform.description}}
                                            </div>
                                            <template v-if="platform.plugin">
                                                <div class="col-md-12 mt-4">
                                                    <h5>{{$t('common.plugin')}}</h5>
                                                    {{$t('message.platformIsPluginExplanation')}}
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="font-weight-bold">{{$tc('common.url')}}:</label>
                                                    <br />{{platform.description}}
                                                </div>
                                            </template>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12 mt-4 border-top pt-2">
                                                <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                                    <span class="fa fa-save"></span>
                                                    {{$tc('actions.save')}}
                                                </button>
                                                <router-link :to="{name: 'platforms'}" class="btn btn-secondary mr-1">
                                                    {{$tc('actions.cancel')}}</router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab :title="$tc('titles.operation', 2)" @click.prevent="loadOperations">
                                <div class="alert mt-1 mb-2 alert-warning">
                                    Desabilitar uma operação ou desassociá-la de um subconjunto pode fazer com que 
                                    fluxos de trabalho deixem de funcionar. Faça alterações com cautela.
                                </div>
                                <div v-if="loadingOperations" class="loading">
                                    <div class="spinner-grow">
                                    </div>
                                    <p>{{$t('common.loading')}}</p>
                                </div>
                                <table class="table table-sm table-smallest">
                                    <thead class="thead-light">
                                        <tr>
                                            <th class="text-center">{{$tc('common.enabled', 1)}}</th>
                                            <th class="text-center">{{$tc('common.id', 1)}}</th>
                                            <th class="text-center">{{$tc('common.name', 1)}}</th>
                                            <th v-for="subset in platform.subsets" :key="subset.id" class="subset text-center">
                                                {{subset.name}}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tr v-for="op in operations" :key="op.id" class="child">
                                        <td style="width: 50px" class="text-center">
                                            <b-form-checkbox v-model="op.enabled"></b-form-checkbox>
                                        </td>
                                        <td style="width: 50px" class="text-center">
                                            {{op.id}}
                                        </td>
                                        <td style="width: 120px" :title="op.description" class="pt-2">
                                            {{op.name}} 
                                            <br/><em>{{getCategory(op)}}</em>
                                        </td>
                                        <td v-for="subset in platform.subsets" :key="subset.id" class="subset text-center">
                                            <b-form-checkbox v-model="op.subsetIds" :value="subset.id"></b-form-checkbox>
                                        </td>
                                    </tr>
                                </table>
                            </b-tab>
                            <!--
                            <b-tab :title="$tc('platform.subset', 2)">
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
    import Vue from 'vue';
    import axios from 'axios';
    import VueSelect from 'vue-select';
    import SwitchComponent from '../../components/widgets/Switch.vue';
    import Notifier from '../../mixins/Notifier';
    import View from '../../mixins/View';

    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    export default {
        mixins: [Notifier, View],
        components: {
            'v-select': VueSelect,
            SwitchComponent
        },
        data() {
            return {
                isDirty: false,
                loadingOperations: false,
                operations: [],
                loadingSubsetOperations: false,
                subsetOperations: [],
                subsetId: null,
                platform: {},
                types: ['KUBERNETES', 'SPARK_LOCAL', 'MESOS', 'YARN'].sort()
            };
        },
        computed: {},
        watch: {
            '$route.params.id': function (id) {
                this.load().then(() => {
                    Vue.nextTick(() => {
                        this.isDirty = false;
                    });
                });
            },
            platform: {
                handler(newVal, oldVal) {
                    this.isDirty = true;
                },
                deep: true
            }
        },
        mounted() {
            let self = this;
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false;
                });
            });
        },
        /* Methods */
        methods: {
            getCategory(op){
                const categ = op.categories.find(c => c.type === 'group');
                return categ ? categ.name : '-'
            },
            load() {
                let self = this;
                return new Promise((resolve, reject) => {
                    axios
                        .get(`${tahitiUrl}/platforms/${this.$route.params.id}`)
                        .then(resp => {
                            self.platform = resp.data;
                            resolve();
                        })
                        .catch(function (e) {
                            self.error(e);
                            reject();
                        });
                });
            },
            success(msg) {
                this.$snotify.success(msg, this.$t('titles.success'));
            },
            error(e) {
                if (e.name === 'NetworkError') {
                    this.$snotify.error(
                        this.$t('errors.disconnected'),
                        this.$t('titles.error')
                    );
                } else if (e.response && e.response.data) {
                    this.$snotify.error(e.response.data.message, this.$t('titles.error'));
                } else {
                    this.$snotify.error(e.message, this.$t('titles.error'));
                }
            },
            loadOperations() {
                this._loadOperations(null, 'operations', 'loadingOperations');
            },
            _loadOperations(subsetId, target, loading) {
                const self = this;
                const url = `${tahitiUrl}/operations`;
                const params = {
                    lang: this.$root.$i18n.locale,
                    platform: this.platform.id,
                    partial: 1,
                    ts: new Date().getTime(), // disable cache
                }
                self[loading] = true;
                return axios
                    .get(url, { params })
                    .then(resp => { 
                        self[target] = resp.data; 
                        resp.data.forEach(op => op.subsetIds = op.subsets.map(s => s.id));
                    }).catch(self.error)
                    .finally(() => { self[loading] = false; });
            },
            save(event) {
                const self = this;
                const url = `${tahitiUrl}/platforms/${this.platform.id}`;
                self.toggleLoading(event.target);
                return axios
                    .patch(url, this.platform)
                    .then(resp => {
                        self.platform = resp.data;
                        Vue.nextTick(() => {
                            self.isDirty = false;
                        });
                        self.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('titles.platform', 1)
                            })
                        );
                        this.$router.push({ name: 'platforms' });
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
</style>
