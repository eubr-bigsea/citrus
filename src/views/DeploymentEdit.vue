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
                            <div class="card">
                                <div class="card-body">
                                    <form>
                                        <div class="row">
                                            <div class="col-4">
                                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                <input v-model="deployment.name" type="text" class="form-control"
                                                    maxlength="100" v-focus required>
                                            </div>
                                            <div class="col-4">
                                                <label class="font-weight-bold">{{$tc('deployment.model')}}:</label>
                                                <v-select :options="models" :taggable="false" label="name"
                                                    @search="fetchModels" :reduce="(opt) => opt.id" 
                                                    v-model="deployment.model_id" :close-on-select="true"
                                                    :filterable="false">
                                                    <template #no-options="{ search, searching, loading }">
                                                        <small>{{$t('common.noResultsInformSearch')}}</small>
                                                    </template>
                                                </v-select>
                                            </div>
                                            <div class="col-4">
                                                <label class="font-weight-bold">{{$tc('deployment.target')}}:</label>
                                                <v-select :options="targets" :reduce="(opt) => opt.id"
                                                    v-model="deployment.target_id" label="name">
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
                                                {{deployment.image_id}}
                                                <v-select :options="images" :reduce="(opt) => opt.id"
                                                    v-model="deployment.image_id" label="name">
                                                    <template #option="{ description, id, name, tag }">
                                                        {{ description }}<br />
                                                        <small><em>{{ name }}:{{ tag }}</em></small>
                                                    </template>
                                                </v-select>
                                            </div>
                                            <div class="col-2">
                                                <label class="font-weight-bold">{{$tc('deployment.replica',2)}}:</label>
                                                <input type="number" class="form-control" v-model="deployment.replicas"
                                                    max="4" min="1" step="1" />
                                            </div>
                                            <div class="col-6">
                                                <label>{{$tc('common.description')}}:</label>
                                                <input v-model="deployment.description" type="text" class="form-control"
                                                    maxlength="100">
                                            </div>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-3">
                                                <label>{{$t('deployment.limitCpu')}}:</label>
                                                <input type="number" class="form-control" v-model="deployment.limit_cpu"
                                                    max="32000" min="0" step="500" />
                                            </div>
                                            <div class="col-3">
                                                <label>{{$t('deployment.requestCpu')}}:</label>
                                                <input type="number" class="form-control"
                                                    v-model="deployment.request_cpu" max="32000" min="500" step="500" />
                                            </div>

                                            <div class="col-3">
                                                <label>{{$t('deployment.limitMemory')}}:</label>
                                                <input type="number" class="form-control"
                                                    v-model="deployment.limit_memory" max="64000" min="0" step="512" />
                                            </div>
                                            <div class="col-3">
                                                <label>{{$t('deployment.requestMemory')}}:</label>
                                                <input type="number" class="form-control"
                                                    v-model="deployment.request_memory" max="64000" min="0"
                                                    step="512" />
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-12">
                                                <label>{{$t('deployment.extraParameters')}}:</label>
                                                <textarea rows="3" v-model="deployment.extra_parameters"
                                                    class="form-control"></textarea>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="row">
                                        <div class="col-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save($event, false)">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <span class="fa fa-save"></span>
                                                {{$tc('actions.save')}}
                                            </button>
                                            <button class="btn btn-outline-primary mr-1 btn-spinner" @click.stop="save($event, true)">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <span class="fa fa-server"></span>
                                                {{$tc('deployment.saveAndRedeploy')}}
                                            </button>
                                            <router-link :to="{name: 'deployments'}"
                                                class="btn btn-outline-secondary mr-1">
                                                {{$tc('actions.cancel')}}</router-link>
                                        </div>
                                    </div>
                                </div>
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
    import SwitchComponent from '../components/widgets/Switch.vue';
    import Notifier from '../mixins/Notifier';
    import { debounce } from '../util.js';

    let seedUrl = process.env.VUE_APP_SEED_URL;
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    export default {
        mixins: [Notifier],
        components: {
            'v-select': VueSelect,
            SwitchComponent
        },
        data() {
            return {
                deployment: {},
                isDirty: false,
                types: ['KUBERNETES', 'SPARK_LOCAL', 'MESOS', 'YARN'].sort(),
                images: [],
                models: [],
                targets: []
            };
        },
        props: {
            add: {
                type: Boolean,
                default: false
            }
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
            deployment: {
                handler(newVal, oldVal) {
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
                            id: null, image_id: null, request_cpu: 1000, request_memory: 512,
                            limit_memory: 0, limit_cpu: 0, extra_paramters: null, model_id: null, target_id: null,
                            replicas: 1
                        };
                    }
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