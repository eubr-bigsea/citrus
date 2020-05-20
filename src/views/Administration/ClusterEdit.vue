<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.cluster', 1)}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div v-if="cluster.id" class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
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
                                            <input v-model="cluster.executors" class="form-control">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="font-weight-bold">{{$tc('cluster.executorCores')}}:</label>
                                            <input v-model="cluster.executor_cores" class="form-control">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="font-weight-bold">{{$tc('cluster.executorMemory')}}:</label>
                                            <input v-model="cluster.executor_memory" class="form-control">
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
                                            <label>{{$tc('common.parameters', 2)}}:</label>
                                            <textarea v-model="cluster.general_parameters" class="form-control"
                                                rows="5"></textarea>
                                        </div>
                                        <div class="col-md-12">
                                            <label>{{$tc('cluster.authToken')}}:</label>
                                            <input v-model="cluster.auth_token" type="password" class="form-control"/>
                                                
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <span class="fa fa-save"></span>
                                                {{$tc('actions.save')}}
                                            </button>
                                            <router-link :to="{name: 'clusters'}" class="btn btn-secondary mr-1">
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
    import SwitchComponent from '../../components/widgets/Switch.vue';

    let standUrl = process.env.VUE_APP_STAND_URL;

    export default {
        components: {
            'v-select': VueSelect,
            SwitchComponent
        },
        data() {
            return {
                isDirty: false,
                cluster: {},
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
            cluster: {
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
            load() {
                let self = this;
                return new Promise((resolve, reject) => {
                    axios
                        .get(`${standUrl}/clusters/${this.$route.params.id}`)
                        .then(resp => {
                            self.cluster = resp.data;
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
            save(event) {
                let self = this;
                const url = `${standUrl}/clusters/${this.cluster.id}`;

                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');

                return axios
                    .patch(url, this.cluster)
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
