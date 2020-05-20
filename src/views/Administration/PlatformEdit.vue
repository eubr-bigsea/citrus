<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.platform', 1)}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div v-if="platform.id" class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                            <br/>
                                            {{platform.name}}
                                        </div>
                                        <div class="col-md-3">
                                            <label class="font-weight-bold">{{$tc('common.slug')}}:</label>
                                            <br/>{{platform.slug}}
                                        </div>
                                        <div class="col-md-3">
                                            <b-form-checkbox v-model="platform.enabled">{{ $t('common.enabled') }}
                                            </b-form-checkbox>
                                            <b-form-checkbox v-model="platform.plugin">{{ $t('common.plugin') }}
                                            </b-form-checkbox>
                                        </div>
                                        <div class="col-md-12 mt-4">
                                            <label class="font-weight-bold">{{$tc('common.description')}}:</label>
                                            <br/>{{platform.description}}
                                        </div>
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

    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    export default {
        components: {
            'v-select': VueSelect,
            SwitchComponent
        },
        data() {
            return {
                isDirty: false,
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
            save(event) {
                let self = this;
                const url = `${tahitiUrl}/platforms/${this.platform.id}`;

                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');

                return axios
                    .patch(url, this.platform)
                    .then(resp => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
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