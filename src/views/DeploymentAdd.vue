<template>
    <div class="row">
        <div class="col-md-8 mx-auto overflow-hidden">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12">
                        <b-card bg-variant="" :title="$t('deployment.whatToDeploy')" class="card-option">
                            <div class="border-bottom mb-2 pb-4">
                                <label>1 - {{$tc('titles.workflow')}}</label>
                                <v-select label="name" :filterable="false" :options="workflows" @search="onSearch"
                                    ref="deployables" @input="selectWorkflow">
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
                            <div v-if="step >= 2">
                                <label>2 - {{$tc('titles.job')}}</label>
                                <div class="p-2">
                                    {{$t('deployment.requireExecution')}}
                                </div>

                                <b-form-group v-if="jobs && jobs.length">
                                    <b-form-radio-group v-model="job" :options="jobs" stacked name="jobs"
                                        @input="jobSelected">
                                    </b-form-radio-group>
                                </b-form-group>
                                <div v-else>
                                    <div class="alert alert-warning">
                                        Nenhum job executado com sucesso para o fluxo escolhido
                                        {{jobs}}
                                    </div>
                                </div>
                            </div>
                        </b-card>
                        <router-link :to="{name: 'deployments'}">
                            <button class="btn mt-2 float-right" @click="save">{{$t('actions.cancel')}}</button>
                        </router-link>
                        <button class="btn btn-primary mt-2 float-right" v-if="step===3"
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
            let self = this;

        },
        data() {
            return {
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
            onSearch(search, loading) {
                loading(true);
                this._search(loading, search, this);
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
                }
                axios.post(`${seedUrl}/deployments`, data).then(resp => {
                    self.deployment = resp.data;
                    self.success(self.$t('messages.savedWithSuccess',
                        { what: self.$tc('titles.deployment') }));
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
            _search: _.debounce((loading, search, vm) => {
                const data = {
                    simple: true
                }
                axios.get(`${tahitiUrl}/workflows`, { params: data }).then(resp => {
                    vm.selectableDeployables = resp.data
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