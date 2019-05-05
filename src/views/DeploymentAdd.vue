<template>
    <div class="row">
        <div class="col-md-8 mx-auto">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12">
                        <b-card bg-variant="" :title="$t('deployment.whatToDeploy')" class="card-option">
                            <div class="border-bottom mb-2 pb-4">
                                <label>1 - {{$tc('titles.workflow')}}</label>

                                <v-select label="name" :filterable="false" :options="selectableDeployables"
                                    @search="onSearchWorkflow" ref="deployables" @input="selectWorkflow">
                                    <template slot="no-options">
                                        {{$t('actions.typeAndchooseOption')}}
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{ option.name }} (#{{option.id }})
                                            <div class="platform-icon-small float-right"
                                                :class="'bg-' + option.platform.slug"></div>
                                        </div>
                                    </template>
                                    <template slot="selected-option" scope="option">
                                        <div class="selected d-center">
                                            {{ option.name }} (#{{option.id }})
                                        </div>
                                    </template>
                                </v-select>
                            </div>
                            <div v-if="step >= 2 || true">
                                <label>2 - {{$tc('titles.job')}}</label>
                                <div class="p-2" v-html="$t('deployment.requireExecution')"></div>

                                <b-form-group v-if="jobs && jobs.length">
                                    <b-form-radio-group v-model="job" :options="jobs" stacked name="jobs"
                                        @input="jobSelected">
                                    </b-form-radio-group>
                                </b-form-group>
                                <div v-else>
                                    <div class="alert alert-warning">
                                        {{$t('common.noData')}}
                                    </div>
                                </div>
                                <div class="row border-bottom mb-2 pb-4">
                                    <div class="col-md-6">
                                        <label>3 - {{$tc('titles.target', 1)}}</label>
                                        <select v-model="selectedTarget" class="form-control">
                                            <option v-for="t in selectableTargets" :key="t.id" :value="t.id">
                                                {{t.name}} ({{t.description}})</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label>4 - {{$tc('titles.image', 1)}}</label>
                                        <select v-model="selectedImage" class="form-control">
                                            <option v-for="s in selectableImages" :key="s.id" :value="s.id">
                                                {{s.name}} ({{s.name}}:{{s.tag}})</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                        <router-link :to="{name: 'deployments'}">
                            <button class="btn mt-2 float-right btn btn-sm btn-outline-secondary"
                                @click="save">{{$t('actions.cancel')}}</button>
                        </router-link>
                        <button class="btn btn-sm btn-outline-primary btn-sm mt-2 float-right mr-1" v-if="step===3"
                            @click="save">{{$t('actions.saveAndContinue')}}...</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import Vue from 'vue'
    import Notifier from '../mixins/Notifier'
    import vSelect from "vue-select"
    let seedUrl = process.env.VUE_APP_SEED_URL
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    let standUrl = process.env.VUE_APP_STAND_URL
    export default {
        mixins: [Notifier],
        components: {
            'v-select': vSelect,
        },
        mounted() {
            const data = { sort: 'name' };
            axios.get(`${seedUrl}/images`, { params: data }).then(resp => {
                this.selectableImages = resp.data.data
            }).catch(function (e) {
                this.error(e)
            });
            axios.get(`${seedUrl}/targets`, { params: data }).then(resp => {
                this.selectableTargets = resp.data.data
            }).catch(function (e) {
                this.error(e)
            })
        },
        data() {
            return {
                deployableTypes: [
                    { text: this.$t('deployment.savedModel'), value: 'model' },
                    { text: this.$t('deployment.workflow'), value: 'workflow' }
                ],
                selectedDeployableType: "model",
                selectableDeployables: [],
                selectedDeployable: null,

                selectableImages: [],
                selectedImage: null,

                selectableTargets: [],
                selectedTarget: null,

                workflows: [],
                workflow: null,
                step: 1,
                jobs: [],
                job: null,
                deployment: null,
            }
        },
        methods: {
            onChange(val) {
                alert(val)
            },
            onSearchWorkflow(search, loading) {
                loading(true);
                this._searchWorkflow(loading, search, this);
            },
            selectWorkflow(val) {
                this.workflow = val;
                this.step = (val !== '' && val !== null) ? 2 : 1;
                if (this.step >= 2) {
                    this.displayJobs(val.id);
                }
            },
            save() {
                const self = this;
                const data = {
                    job_id: this.job,
                    workflow_id: this.workflow.id,
                    workflow_name: this.workflow.name,
                    image_id: this.selectedImage,
                    target_id: this.selectedTarget,
                    
                }
                axios.post(`${seedUrl}/deployments`, data).then(resp => {
                    self.deployment = resp.data;
                    self.success(self.$t('messages.savedWithSuccess',
                        { what: self.$tc('titles.deployment') }));
                    self.$router.push({
                        name: 'editDeployment',
                        params: { id: resp.data.id }
                    })
                }).catch(function (e) {
                    self.error(e)
                })
            },
            jobSelected(checked) {
                if (checked)
                    this.step = 3;
            },
            displayJobs(workflowId) {
                const self = this;
                const data = {
                    page: 1,
                    size: 10,
                    sort: 'id',
                    asc: false,
                    fields: 'id,name,created,status',
                    workflow_id: workflowId
                }
                axios.get(`${standUrl}/jobs`, { params: data }).then(resp => {
                    self.jobs = resp.data.data
                        .filter(j => j.status === 'COMPLETED')
                        .map((j) => { return { text: `${j.name} (${j.created})`, value: j.id } });
                }).catch(function (e) {
                    self.error(e)
                })
            },
            _searchWorkflow: _.debounce((loading, search, vm) => {
                const data = {
                    name: search,
                    fields: "id,name,platform.id,platform.name"
                }
                axios.get(`${tahitiUrl}/workflows`, { params: data }).then(resp => {
                    vm.selectableDeployables = resp.data.data
                    loading(false);
                }).catch(function (e) {
                    loading(false);
                    vm.error(e)
                })
            }, 350),
            _searchImage: _.debounce((loading, search, vm) => {
                const data = {
                    name: search,
                    fields: "id,name,tag"
                }
                axios.get(`${seedUrl}/images`, { params: data }).then(resp => {
                    vm.selectableImages = resp.data.data
                    loading(false);
                }).catch(function (e) {
                    loading(false);
                    vm.error(e)
                })
            }, 350)
        }
    }
</script>
<style scoped>

</style>