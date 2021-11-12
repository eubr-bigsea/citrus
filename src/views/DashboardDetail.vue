<template>
    <main role="main">
        <div class="row pb-5">
            <div class="col">
                <div v-if="!errorState">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="header-pretitle">{{$tc('titles.dashboard', 1)}}</h6>
                            <h2 v-if="publicRoute">{{dashboard.title}}</h2>
                            <InputHeader v-else v-model="dashboard.title"></InputHeader>
                        </div>
                        <div class="d-print-none">
                            <div v-if="isLoggedIn" class="btn-group float-right" role="group">
                                <button class="btn btn-sm btn-outline-dark" @click.stop="save">
                                    <span class="fa fa-save"></span> {{$t('actions.save')}}
                                </button>
                                <button class="btn btn-sm btn-outline-dark" @click.prevent="showProperties"
                                    :title="$t('actions.showProperties')">
                                    <span class="fa fa-cogs"></span>
                                </button>
                            </div>
                            <button v-if="!publicRoute" class="btn btn-sm btn-success mr-2" @click.prevent="addText"
                                :title="$t('actions.showProperties')">
                                <span class="fa fa-plus"></span> {{$t('dashboard.markupVisualization')}}
                            </button>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <grid-layout :layout.sync="layout" :col-num="12" :row-height="30"
                                        :is-draggable="!publicRoute" :is-resizable="!publicRoute" :is-mirrored="false"
                                        :is-responsive="true" :vertical-compact="true" :margin="[10, 10]"
                                        :use-css-transforms="true" @layout-updated="layoutUpdatedEvent"
                                        :prevent-collision="false">
                                        <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w"
                                            :h="item.h" :i="item.i" :key="item.i">
                                            <caipirinha-visualization :url="item.url" :public-route="publicRoute">
                                            </caipirinha-visualization>
                                        </grid-item>
                                    </grid-layout>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h2>{{$tc('common.noData')}}</h2>
                </div>
            </div>
        </div>
        <b-modal id="dashboardProperties" size="md" button-size="sm" ref="dashboardProperties" :title="$tc('titles.property', 2)"
            :ok-only="true">
            <b-form @submit="save">
                <b-form-group :label="$tc('common.title', 1) + ':'">
                    <b-form-input v-model="dashboard.title" required />
                </b-form-group>
                <b-form-checkbox v-model="dashboard.is_public">
                    {{$t('dashboard.public')}}
                    <br />
                    <small><em>{{$t('dashboard.publicExplanation')}}</em></small>
                </b-form-checkbox>
                <div v-if="dashboard.is_public">{{dashboard.hash}}</div>
            </b-form>
        </b-modal>
    </main>
</template>

<style>
    .vue-grid-item.vue-grid-placeholder {
        background-color: rgb(255, 127, 42);
    }

    .vue-grid-item>div {
        overflow: auto;
    }

    .vue-grid-item {
        padding: 0 5px 5px 5px;
    }
</style>

<script>
    import Vue from 'vue';

    import Notifier from '../mixins/Notifier';
    import axios from 'axios';
    import io from 'socket.io-client';

    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue';
    import InputHeader from '../components/InputHeader.vue';
    import VueGridLayout from 'vue-grid-layout';

    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

    export default {
        components: {
            'caipirinha-visualization': CapirinhaVisualization,
            InputHeader
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn;
            },
            publicRoute() {
                return this.$route.name === 'publicDashboard';
            }
        },
        mixins: [Notifier],
        data() {
            return {
                errorState: false,
                configuration: {},
                dashboard: { title: '', is_public: false, hash: '' },
                layout: []
            };
        },
        beforeDestroy() {
            this.$root.$off('ondelete-visualization');
            this.$root.$off('onsave-visualization');
        },
        mounted() {
           this.load()
           const self = this;
            this.$root.$on('ondelete-visualization', (visId) => {
                this.confirm(this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        axios
                            .delete(`${caipirinhaUrl}/visualizations/0/0/${visId}`)
                            .then(response => {
                                this.success(
                                    this.$t('messages.successDeletion', {
                                        what: this.$tc('titles.visualization')
                                    })
                                );
                                delete self.configuration[visId];
                                self.layout = self.layout.filter(l => l.i !== visId);
                            })
                            .catch(e => {
                                this.error(e);
                            });
                    })
            });
            this.$root.$on('onsave-visualization', (visualizationId, visualizationData, callback) => {
                const params = { data: visualizationData };
                axios
                    .patch(`${caipirinhaUrl}/visualizations/0/0/${visualizationId}`, params)
                    .then(response => {
                        this.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('titles.visualization')
                            })
                        );
                        if (callback){
                            callback(true, response.data.data.data);
                        }
                    })
                    .catch(e => {
                        this.error(e);
                    });
            });
        },
        methods: {
            load(){
                const path = this.publicRoute ? 'public/dashboard' : 'dashboards';
                const param = this.publicRoute ? this.$route.params.hash : this.$route.params.id;
                axios
                    .get(`${caipirinhaUrl}/${path}/${param}`)
                    .then(response => {
                        this.dashboard = response.data;
                        if (this.dashboard.hash === null) {
                            this.dashboard.hash = this.broofa();
                        }
                        this.configuration = this.getConfiguration(response);
                        this.layout = this.getLayout();
                    })
                    .catch(e => {
                        this.error(e);
                        this.errorState = true;
                    });
            }, 
            addText() {
                const newText = { dashboard: { id: this.dashboard.id } };
                axios
                    .post(`${caipirinhaUrl}/texts`, newText)
                    .then(response => {
                        this.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('dashboard.markupVisualization')
                            })
                        );
                        const maxY = Math.max.apply(null, this.layout.map(l => l.y)) + 1;
                        const newItem = {
                            x: 1,
                            y: maxY,
                            w: 12,
                            h: 4,
                            i: response.data.id,
                            url: `${caipirinhaUrl}/visualizations/0/0/${response.data.id}`
                        }
                        this.layout.push(newItem)
                        this.$refs.dashboardProperties.hide();
                        this.save(null, true);
                    })
                    .catch(e => {
                        this.error(e);
                    });
            },
            broofa() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            showProperties() {
                this.$refs.dashboardProperties.show();
            },
            layoutUpdatedEvent: function (newLayout) {
                newLayout.forEach(item => {
                    this.configuration[item.i] = {
                        ...this.configuration[item.i],
                        x: item.x,
                        y: item.y,
                        width: item.w,
                        height: item.h
                    };
                });

                //this.layout = this.getLayout();
                window.dispatchEvent(new Event('resize'));
            },
            save: function (event, hideMessage) {
                this.dashboard.configuration = this.configuration;
                axios
                    .patch(`${caipirinhaUrl}/dashboards/${this.$route.params.id}`, this.dashboard)
                    .then(response => {
                        if (! hideMessage){
                            this.success(
                                this.$t('messages.savedWithSuccess', {
                                    what: this.$tc('titles.dashboard')
                                })
                            );
                        }
                        this.$refs.dashboardProperties.hide();
                    })
                    .catch(e => {
                        this.error(e);
                    });
            },
            getLayout: function () {
                const allVisIds = new Set();
                this.dashboard.visualizations.forEach(vis => {
                    if (!this.configuration.hasOwnProperty(vis.id)) {
                        this.configuration[vis.id] = {
                            height: 8,
                            id: vis.id,
                            jobId: vis.job_id || 0,
                            taskId: vis.task_id || 0,
                            vizId: vis.id,
                            x: 0, y: 10000, width: 12
                        };
                    }
                    allVisIds.add(vis.id);
                });
                const result = Object.keys(this.configuration).map(key => {
                    const {
                        x,
                        y,
                        width,
                        height,
                        vizId,
                        jobId,
                        taskId
                    } = this.configuration[key];
                    const path = this.publicRoute ? 'public/visualization' : 'visualizations';
                    return {
                        x: x,
                        y: y,
                        w: width,
                        h: height,
                        i: parseInt(vizId),
                        url: `${caipirinhaUrl}/${path}/${jobId}/${taskId}/${vizId}`
                    };
                }).filter(v => allVisIds.has(v.i));
                return result;
            },
            configurationIsInvalid(configuration) {
                if (configuration == null || configuration.constructor === Array)
                    return true;
                return false;
            },
            createInitialConfiguration(response) {
                return response.data.visualizations.reduce((configuration, viz, i) => {
                    return {
                        ...configuration,
                        [viz.id]: {
                            vizId: viz.id + '',
                            jobId: viz.job_id,
                            taskId: viz.task_id,
                            x: 3,
                            y: 10 * i,
                            width: 6,
                            height: 10
                        }
                    };
                }, {});
            },
            getConfiguration(response) {
                if (this.configurationIsInvalid(response.data.configuration))
                    return this.createInitialConfiguration(response);
                else return response.data.configuration;
            }
        }
    };
</script>
