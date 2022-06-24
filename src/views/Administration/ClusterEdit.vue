<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{ add ? $t('actions.add', {type: $tc('titles.cluster', 1).toLowerCase()}) :
                            $t('actions.edit') + ' ' + $tc('titles.cluster', 1).toLowerCase()}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
                                    <form>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                <input v-model="cluster.name" type="text" class="form-control">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$tc('common.type')}}:</label>
                                                <select v-model="cluster.type" class="form-control">
                                                    <option v-for="typ in types" :key="typ" :value="typ">{{typ}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$t('cluster.address')}}:</label>
                                                <input v-model="cluster.address" class="form-control">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$tc('cluster.executors')}}:</label>
                                                <input v-model="cluster.executors" type="number"
                                                    class="form-control w-25">
                                            </div>
                                            <div class="col-md-3">
                                                <label
                                                    class="font-weight-bold">{{$tc('cluster.executorCores')}}:</label>
                                                <input v-model="cluster.executor_cores" type="number"
                                                    class="form-control w-25">
                                            </div>
                                            <div class="col-md-3">
                                                <label
                                                    class="font-weight-bold">{{$tc('cluster.executorMemory')}}:</label>
                                                <input v-model="cluster.executor_memory" class="form-control w-25">
                                            </div>
                                            <div class="col-md-3 mt-3 mb-3 mt-3">
                                                <b-form-checkbox v-model="cluster.enabled">{{ $t('common.enabled') }}
                                                </b-form-checkbox>
                                            </div>
                                            <div class="col-md-6">
                                                <label>{{$tc('common.description')}}:</label>
                                                <textarea v-model="cluster.description" class="form-control"
                                                    rows="5"></textarea>
                                            </div>
                                            <div class="col-md-6">
                                                <label>{{$tc('titles.platform', 2)}}:</label>
                                                <v-select v-model="cluster.platforms" :options="platforms"
                                                    :multiple="true" item-value="id" label="name"
                                                    :placeholder="$t('actions.chooseOneOrMoreOption')"
                                                    :close-on-select="false"
                                                    :selectable="option => cluster.platforms && !cluster.platforms.includes(option)">
                                                </v-select>
                                                <label>{{$tc('cluster.authToken')}}:</label>
                                                <input v-model="cluster.auth_token" type="password" autocomplete=""
                                                    class="form-control" />
                                            </div>
                                            <div class="col-md-12">
                                                <label>{{$tc('common.parameters', 2)}}:</label>
                                                <textarea v-model="cluster.general_parameters" class="form-control"
                                                    rows="8"></textarea>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="row">
                                        <div class="col-md-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <span class="fa fa-save"></span>
                                                {{$tc('actions.save')}}
                                            </button>
                                            <router-link :to="{name: 'clusters'}"
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

    let standUrl = process.env.VUE_APP_STAND_URL;
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    export default {
        components: {
            'v-select': VueSelect,
        },
        props: {
            add: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                cluster: {},
                isDirty: false,
                platforms: [],
                types: ['KUBERNETES', 'SPARK_LOCAL', 'MESOS', 'YARN'].sort()
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
            cluster: {
                handler() {
                    this.isDirty = true;
                },
                deep: true
            }
        },
        mounted() {
            this.load();
        },
        /* Methods */
        methods: {
            async load() {
                const self = this;
                if (!self.add) {
                    const errorHandler = function (e) { this.error(e); }.bind(this);
                    this.platforms = await axios
                        .get(`${tahitiUrl}/platforms?simple=true`) //FIXME: it returns old style without "data" field in json
                        .then(resp => resp.data.data)
                        .catch(errorHandler);
                    this.cluster = await axios
                        .get(`${standUrl}/clusters/${this.$route.params.id}`)
                        .then(resp => resp.data.data[0])
                        .catch(errorHandler);
                    // Associate to Platform record containing its name
                    this.cluster.platforms = this.cluster.platforms.map(
                        (p) => this.platforms.find(pl => pl.id === p.id));
                } else {
                    self.cluster = { id: null, enabled: false };
                }
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
            save(event) {
                const self = this;
                let url = `${standUrl}/clusters/${this.cluster.id}`;
                let axiosCall = axios.patch;

                if (self.add) {
                    url = `${standUrl}/clusters`;
                    axiosCall = axios.post
                }
                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');

                return axiosCall(url, this.cluster)
                    .then(resp => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
                        self.cluster = resp.data;
                        Vue.nextTick(() => {
                            self.isDirty = false;
                        });
                        self.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('titles.cluster', 1)
                            })
                        );
                        this.$router.push({ name: 'clusters' });
                    })
                    .catch(e => {
                        self.error(e);
                    }).finally(() => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
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
        font-size: 0.8em;
    }

    .table-smallest td {
        white-space: nowrap;
    }
</style>
