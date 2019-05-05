<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1>{{$tc('titles.deployment', 1)}}</h1>
        </div>
        <hr />
        <div v-if="loaded">
            <b-tabs nav-class="custom-tab">
                <b-tab title="Configuration">
                    <div class="row">
                        <div class="col-md-4">
                            <p>Where to deploy?</p>
                            <p>
                                <select v-model="selectedTarget" class="form-control">
                                    <option v-for="t in selectableTargets" :key="t.id" :value="t.id">
                                        {{t.name}} ({{t.description}})</option>
                                </select>
                            </p>

                            <!--
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
                        -->
                            <p>
                                Metrics:
                            </p>
                            <p>
                                <v-select label="name" :filterable="false" :options="metrics" multiple>
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
                        <div class="col-md-2 border-left">
                            <p>
                                How many instances?
                            </p>
                            <p>
                                <input type="number" class="form-control" value="1" style="width: 80px" />
                            </p>
                            <p>
                                VCPUs per instance:
                            </p>
                            <p>
                                <input type="number" class="form-control" value="1" style="width: 80px" />
                            </p>
                            <p>
                                Memory for instance (MB)
                                <p>
                                    <input type="number" class="form-control" value="1" style="width: 80px" />
                                </p>
                        </div>
                        <div class="col-md-6 border-left">
                            <div class="alert alert-info"><span class="fa fa-lightbulb text-warning fa-2x"></span>
                                (Experimental) Lemonade supports the resource estimation avaliation. It uses
                                machine learning models to estimate the number of processing instances, VCPUs and memory
                                in order to support a specified deadline (maximum execution time).
                            </div>
                            <p class="border-top">
                                Would you like to experiment it?
                            </p>
                            <p>
                                Maximum deadline (minutes):
                            </p>
                            <p>
                                <input type="number" class="form-control" value="10" style="width: 80px; display:inline" />
                                <button class="btn btn-secondary ml-2 btn-sm"
                                    @click="save">{{$t('actions.apply')}}</button>
                            </p>
                        </div>
                    </div>
                    <hr />
                    <button class="btn btn-sm btn-outline-primary  mt-2 float-right mr-1"
                        @click="save">{{$t('actions.save')}}</button>
                    <button class="btn btn-sm btn-outline-success  mt-2 float-right mr-1"
                        @click="save">{{$t('actions.deploy')}}</button>
                </b-tab>
                <b-tab title="Workflow diagram">
                    <div style="position: relative; overflow: hidden; height: 65vh;">
                        <diagram :workflow="job.workflow" ref="diagram" id="main-diagram" :operations="operations"
                            :version="job.id" initial-zoom="1" :showToolbar="false" :editable="false" shink="true"
                            v-if="loaded" :loaded="loaded" :showTaskDecoration="true" :initialZoom=".8"
                            environment="DEPLOYMENT" />
                    </div>
                </b-tab>
            </b-tabs>
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

                selectableTargets: [],
                selectedTarget: null,

                flavors: [
                    { id: 1, name: 'Small', description: '1 Gb RAM, 1 VCPU' },
                    { id: 2, name: 'Medium', description: '4 Gb RAM, 2 VCPU' },
                    { id: 3, name: 'Large', description: '8 Gb RAM, 4 VCPU' },
                ],
                metrics: [
                    { id: 1, name: 'High QoS F1 Score', description: 'F1 Score >= .8' },
                    { id: 2, name: 'False positive rate (FPR) for women', description: '0.8 <= FPR <= 0.9' },
                    { id: 3, name: 'Classifiers stability (aggrement)', description: 'Aggrement > 70% in last 100 executions' },
                    {
                        id: 4, name: 'Classifiers stability (cross-validation)',
                        description: 'Aggrement > 70%'
                    },
                    {
                        id: 5, name: 'Reidentification risk (time window)',
                        description: 'Average risk in last week > 15%'
                    },
                ],
            }
        },
        async mounted() {
            const data = {
                fields: 'id,created,workflow'
            }
            const self = this;
            self.$Progress.start();
            await axios.get(`${seedUrl}/deployments/${this.$route.params.id}`).then(
                (resp) => {
                    self.deployment = resp.data.data;
                    self.selectedTarget = self.deployment.target.id;
                }
            ).catch(function (e) {
                self.error(e);
            });
            await axios.get(`${seedUrl}/targets`, { params: { sort: 'name' } }).then(resp => {
                this.selectableTargets = resp.data.data
            }).catch(function (e) {
                this.error(e)
            });
            await axios.get(`${tahitiUrl}/operations`).then(resp => {
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
            }).catch(function (e) {
                self.error(e);
            });
            await axios.get(`${standUrl}/jobs/${self.deployment.job.id}`).then(
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
        },
        /* Methods */
        methods: {
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