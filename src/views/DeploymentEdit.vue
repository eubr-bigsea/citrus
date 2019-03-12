<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1>{{$tc('titles.deployment', 1)}}</h1>
        </div>
        <hr />
        <div class="row" v-if="loaded">
            <div class="col-md-4 col-xg-12 mx-auto">
                <p>Where to deploy?</p>
                <p>
                    <v-select label="name" :filterable="false" :options="targets">
                        <template slot="no-options">
                            {{$t('actions.typeAndchooseOption')}}
                        </template>
                        <template slot="option" slot-scope="option">
                            <div class="d-center">
                                {{ option.name }} (#{{option.id }})
                                <br />
                                <em><small>{{option.description}}</small></em>
                            </div>
                        </template>
                        <template slot="selected-option" scope="option">
                            <div class="selected d-center">
                                {{ option.name }} (#{{option.id }})
                            </div>
                        </template>
                    </v-select>
                </p>
                <p>
                    How many instances?
                </p>
                <p>
                    <input type="number" class="form-control" value="1" />
                </p>
                <p>
                    Instance flavor:
                </p>
                <p>
                    <v-select label="name" :filterable="false" :options="flavors">
                        <template slot="no-options">
                            {{$t('actions.typeAndchooseOption')}}
                        </template>
                        <template slot="option" slot-scope="option">
                            <div class="d-center">
                                {{ option.name }} (#{{option.id }})
                                <br />
                                <em><small>{{option.description}}</small></em>
                            </div>
                        </template>
                        <template slot="selected-option" scope="option">
                            <div class="selected d-center">
                                {{ option.name }} (#{{option.id }})
                                <br />
                                <em><small>{{option.description}}</small></em>
                            </div>
                        </template>
                    </v-select>
                </p>
                <p>
                    Authentication token:
                </p>
                <p>
                    <input type="text" class="form-control" value="44d6937d-96fd-478c-9caf-1152a5e01bab" />
                </p>
                <!--
                <p>
                    <label>Created</label>
                    {{deployment.created}}
                </p>
                {{deployment}}-->
            </div>
            <div class="col-md-8 col-xg-12 mx-auto">
                <div style="position: relative; overflow: hidden; height: 65vh;">
                    <diagram :workflow="job.workflow" ref="diagram" id="main-diagram" :operations="operations" :version="job.id"
                        initial-zoom="1" :showToolbar="false" :editable="false" shink="true" v-if="loaded" :loaded="loaded"
                        :showTaskDecoration="true" :initialZoom=".8" environment="DEPLOYMENT" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import DiagramComponent from '../components/Diagram.vue'
    import VueSelect from 'vue-select'
    import Notifier from '../mixins/Notifier'
    import SwitchComponent from '../components/widgets/Switch.vue'
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const seedUrl = process.env.VUE_APP_SEED_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    export default {
        mixins: [Notifier],
        components: {
            'v-select': VueSelect,
            SwitchComponent,
            'diagram': DiagramComponent,
        },
        data() {
            return {
                deployment: null,
                targets: [],
                loaded: false,
                operations: null,
                operationsLookup: new Map(),
                flavors: [
                    { id: 1, name: 'Small', description: '1 Gb RAM, 1 VCPU' },
                    { id: 2, name: 'Medium', description: '4 Gb RAM, 2 VCPU' },
                    { id: 3, name: 'Large', description: '8 Gb RAM, 4 VCPU' },
                ],
            }
        },
        mounted() {
            const data = {
                fields: 'id,created,workflow'
            }
            const self = this;
            self.$Progress.start();
            self.load().then(() => {
                axios.get(`${tahitiUrl}/operations`).then(resp => {
                    self.operations = resp.data;
                    self.operations.forEach((op) => {
                        self.operationsLookup[op.id] = op
                    })
                    axios.get(`${seedUrl}/targets`).then(
                        (resp) => {
                            self.targets = resp.data;
                        }
                    ).catch(function (e) {
                        self.error(e);
                    });

                    axios.get(`${standUrl}/jobs/${this.deployment.job_id}`).then(
                        (resp) => {
                            self.job = resp.data;
                            self.job.workflow.tasks.forEach((task) => {
                                task.operation = self.operationsLookup[task.operation.id];
                                task.status = task.status || "";
                            });
                            self.loaded = true;
                            self.$Progress.finish();
                        }
                    ).catch(function (e) {
                        self.error(e);
                    });
                }).catch(function (e) {
                    self.error(e);
                });;
            });
        },
        /* Methods */
        methods: {
            load() {
                let self = this
                return new Promise((resolve, reject) => {
                    axios.get(`${seedUrl}/deployments/${this.$route.params.id}`).then(
                        (resp) => {
                            self.deployment = resp.data;
                            resolve()
                        }
                    ).catch(function (e) {
                        self.error(e);
                    });
                });
            },
            save(event) {
                let self = this
                return axios.patch(url, this.deployment)
                    .then((resp) => {
                        self.deployment = resp.data.data
                        self.success(
                            this.$t('messages.savedWithSuccess', { what: this.$tc('titles.deployment', 1) }))
                    }
                    ).catch((e) => { self.error(e) })
            },
        },
    }
</script>
<style>
</style>