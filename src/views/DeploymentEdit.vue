<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{ add ? $t('actions.add', {type: $tc('titles.deployment', 1).toLowerCase()}) :
                            $t('actions.edit') + ' ' + $tc('titles.deployment', 1).toLowerCase()}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-12 col-xg-12 mx-auto">
                            <div v-if="ready" class="card">
                                <div class="card-body">
                                    <form>
                                        <div class="row">
                                            <div class="col-4">
                                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                <input v-model="deployment.name" v-focus type="text"
                                                    class="form-control" maxlength="100" required>
                                            </div>
                                            <div class="col-1">
                                                <label class="font-weight-bold">{{$tc('deployment.replica',2)}}:</label>
                                                <input v-model="deployment.replicas" type="number" class="form-control"
                                                    max="4" min="1" step="1" />
                                            </div>
                                            <div class="col-3">
                                                <label class="font-weight-bold">{{$tc('deployment.model')}}:</label>
                                                <v-select v-model="deployment.model_id" :options="models" :taggable="false"
                                                    label="name" :reduce="(opt) => opt.id" 
                                                    :close-on-select="true" :filterable="false"
                                                    @search="fetchModels">
                                                    <template #no-options="{ search, searching, loading }">
                                                        <small>{{$t('common.noResultsInformSearch')}}</small>
                                                    </template>
                                                </v-select>
                                            </div>
                                            <div class="col-4">
                                                <label class="font-weight-bold">{{$tc('deployment.target')}}:</label>
                                                <v-select v-model="deployment.target" 
                                                    :options="targets" label="name">
                                                    <template #option="{ description, id, name, target_type }">
                                                        {{ name }}<br />
                                                        <small><em>{{ description }} ({{ target_type }})</em></small>
                                                    </template>
                                                </v-select>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-4">
                                                <label class="font-weight-bold">{{$tc('deployment.image')}}:</label>
                                                <v-select v-model="deployment.image" 
                                                    :options="images" label="description">
                                                    <template #option="{ description, id, name, tag }">
                                                        {{ description }}<br />
                                                        <small><em>{{ name }}:{{ tag }}</em></small>
                                                    </template>
                                                </v-select>
                                            </div>
                                            <div class="col-1">
                                                <label>{{$tc('deployment.port',1)}}:</label>
                                                <input v-model="deployment.port" type="number" class="form-control" max="99999" min="1025"/>
                                            </div>
                                            <div class="col-7">
                                                <label>{{$tc('common.description')}}:</label>
                                                <input v-model="deployment.description" type="text" class="form-control"
                                                    maxlength="100">
                                            </div>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-3">
                                                <label>{{$t('deployment.limitCpu')}}:</label>
                                                <input v-model="deployment.limit_cpu" type="number" class="form-control"
                                                    max="32000" min="0" step="500" />
                                            </div>
                                            <div class="col-3">
                                                <label>{{$t('deployment.requestCpu')}}:</label>
                                                <input v-model="deployment.request_cpu" type="number"
                                                    class="form-control" max="32000" min="500" step="500" />
                                            </div>

                                            <div class="col-3">
                                                <label>{{$t('deployment.limitMemory')}}:</label>
                                                <input v-model="deployment.limit_memory" type="number"
                                                    class="form-control" max="64000" min="0" step="512" />
                                            </div>
                                            <div class="col-3">
                                                <label>{{$t('deployment.requestMemory')}}:</label>
                                                <input v-model="deployment.request_memory" type="number"
                                                    class="form-control" max="64000" min="0"
                                                    step="512" />
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-12">
                                                <label>{{$t('deployment.extraParameters')}}:</label>
                                                <textarea v-model="deployment.extra_parameters" rows="3"
                                                    class="form-control"></textarea>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="row">
                                        <div class="col-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save($event, false)">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <font-awesome-icon icon="fa fa-save" />
                                                {{$tc('actions.save')}}
                                            </button>
                                            <button class="btn btn-outline-primary mr-1 btn-spinner" @click.stop="save($event, true)">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <font-awesome-icon icon="fa fa-server" />
                                                {{$tc('deployment.saveAndRedeploy')}}
                                            </button>
                                            <router-link :to="{name: 'deployments'}"
                                                class="btn btn-outline-secondary mr-1">
                                                {{$tc('actions.cancel')}}</router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <b-card>
                                    <b-skeleton animation="fade" width="85%" height="40px"></b-skeleton>
                                    <b-skeleton animation="fade" width="55%" height="40px"></b-skeleton>
                                    <b-skeleton animation="fade" width="70%" height="40px"></b-skeleton>
                                  </b-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import VueSelect from 'vue-select';
    import Notifier from '../mixins/Notifier';
    import { debounce } from '../util.js';

    let seedUrl = process.env.VUE_APP_SEED_URL;
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL;

    export default {
        components: {
            'v-select': VueSelect,
        },
        mixins: [Notifier],
        props: {
            add: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                deployment: {},
                ready: false,
                isDirty: false,
                types: ['KUBERNETES', 'SPARK_LOCAL', 'MESOS', 'YARN'].sort(),
                images: [],
                models: [],
                targets: []
            };
        },
        computed: {},
        watch: {
            '$route.params.id': function () {
                this.load().then(() => {
                    Vue.nextTick(() => {
                        this.isDirty = false;
                    });
                });
            },
            deployment: {
                handler() {
                    this.isDirty = true;
                },
                deep: true
            }
        },
        beforeMount() {
            this.load();
        },
        /* Methods */
        methods: {
            fetchModels: debounce(async function (search, loading) {
                loading(true);
                const resp = await axios.get(`${limoneroUrl}/models?type=MLEAP&query=${search}`);
                this.models = resp.data.data;
                loading(false);
            }, 500),
            async load() {
                try {
                    let resp = await axios.get(`${seedUrl}/images`);
                    this.images = resp.data.data;

                    resp = await axios.get(`${seedUrl}/targets`);
                    this.targets = resp.data.data;
                    if (this.$route.params.id) {
                        const errorHandler = function (e) { this.error(e); }.bind(this);
                        this.deployment = await axios
                            .get(`${seedUrl}/deployments/${this.$route.params.id}`)
                            .then(resp => resp.data.data[0])
                            .catch(errorHandler);
                        this.deployment.image_id = this.deployment.image.id;
                        this.deployment.target_id = this.deployment.target.id;
                        this.deployment.limit_memory = this.deployment.limit_memory.replace('M', '');
                        this.deployment.request_memory = this.deployment.request_memory.replace('M', '');

                        resp = await axios.get(`${limoneroUrl}/models/${this.deployment.model_id}`);
                        this.models = [resp.data];

                    } else {
                        this.deployment = {
                            id: null, image_id: null, request_cpu: '1000', request_memory: '512',
                            limit_memory: '0', limit_cpu: '0', extra_paramters: null, model_id: null, target_id: null,
                            replicas: 1
                        };
                    }
                    this.ready = true;
                } catch (e) {
                    this.error(e);
                }
            },
            success(msg) {
                this.$snotify.success(msg, this.$t('titles.success'));
            },
            /*
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
            },*/
            async save(event, deploy) {
                try {
                    const self = this;
                    const data = JSON.parse(JSON.stringify(this.deployment));
                    data.request_memory = data.request_memory + 'M';
                    data.limit_memory = data.limit_memory + 'M';
                    data.model_name = this.models.find((m) => m.id === data.model_id).name;
                    data.deploy = deploy;
                    data.target_id = data.target.id;
                    data.image_id = data.image.id;

                    let url = `${seedUrl}/deployments/${this.deployment.id}`;
                    let axiosCall = axios.patch;

                    if (!this.deployment.id) {
                        url = `${seedUrl}/deployments`;
                        axiosCall = axios.post
                    }
                    event.target.setAttribute('disabled', 'disabled');
                    event.target.classList.remove('btn-spinner');

                    const resp = await axiosCall(url, data);

                    self.deployment = resp.data;
                    Vue.nextTick(() => {
                        self.isDirty = false;
                    });
                    self.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$tc('titles.deployment', 1)
                        })
                    );
                    this.$router.push({ name: 'deployments' });

                } catch (e) {
                    this.error(e);
                } finally {
                    event.target.removeAttribute('disabled');
                    event.target.classList.add('btn-spinner');
                }
            }
        }
    };
</script>
<style>
    .v-select .dropdown-toggle::after {
        content: none;
    }

    .table-smallest {
        font-size: 0.8em;
    }

    .table-smallest td {
        white-space: nowrap;
    }
</style>
