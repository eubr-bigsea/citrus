<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <strong>Performance models (optional)</strong>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-8">
                        <label class="col-form-label-sm2">Perf. Model:</label>
                        <select class="form-control form-control-sm" v-model.number="payload.model_id">
                            <option></option>
                            <option v-for="pm in performanceModels" :value="pm.id">{{pm.name}}</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="col-form-label-sm2">Data type:</label>
                        <select class="form-control form-control-sm" v-model="payload.data_type">
                            <option></option>
                            <option value="images">Image</option>
                            <option value="videos">Video</option>
                            <option value="tabular">Tabular</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="col-form-label-sm2">Estimated size:</label>
                        <input type="number" class="form-control form-control-sm" min="1"
                            v-model.number="payload.data_size" placeholder="Qty or rows" />
                    </div>
                    <div class="col-md-4" v-show="platform.slug === 'keras'">
                        <label class="col-form-label-sm2">Batch size:</label>
                        <input type="number" class="form-control form-control-sm" min="1"
                            v-model.number="payload.batch_size" />
                    </div>
                    <div class="col-md-6" v-show="platform.slug === 'keras'">
                        <label class="col-form-label-sm2">Iterations:</label>
                        <input type="number" class="form-control form-control-sm" min="1"
                            v-model.number="payload.iterations" />
                    </div>
                    <div class="col-md-6">
                        <label class="col-form-label-sm2">Deadline (minutes):</label>
                        <input type="number" class="form-control form-control-sm" min="1"
                            v-model.number="payload.deadline" />
                    </div>
                    <div class="col-md-4">
                        <label class="col-form-label-sm2">
                            <span v-if="platform.slug === 'keras'">GPGPUs</span>
                            <span v-else>Cores:</span>
                        </label>
                        <input type="number" class="form-control form-control-sm" min="1" v-model.number="cores"
                            readonly />
                    </div>
                    <div class="col-md-8">
                        <label class="col-form-label-sm2">Setup:</label>
                        <input type="text" class="form-control form-control-sm" min="1" v-model="setup" readonly />
                    </div>
                    <div class="col-md-12">
                        <b-button variant="secondary" size="sm" class="mt-2" @click.prevent="estimateSetup"
                            :disable="estimatingStep === 1">
                            <b-spinner small v-if="estimatingStep === 1"></b-spinner>
                            <span v-if="estimatingStep !== 1">Estimate</span>
                            <span v-else> Estimating, please wait</span>
                        </b-button>
                    </div>
                </div>
            </div>
            <div class="col-md-6 border-left">
                <PerformanceModelChart :deadline="payload.deadline" :categories="availableCategories"
                    :ready="performanceModelReady" :cores="availableCores" :data="data" :msg="msg" />
            </div>
        </div>
    </div>
</template>
<script>
    import PerformanceModelChart from '../components/PerformanceModelChart.vue';
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;
    export default {
        mixins: [Notifier],
        components: {
            PerformanceModelChart,

        },
        props: {
            platform: {
                required: true
            },
            clusterId: null,
            cluster: {},
            cores: null,
            setup: null,
        },
        data() {
            return {
                availableCores: ['1', '2', '4', '8'],
                availableCategories: [],
                performanceModelReady: false,
                performanceModels: [],
                estimatingStep: 0,
                payload: {
                    cluster_id: null,
                    model_id: null,
                    data_type: 'images',
                    data_size: 20,
                    deadline: 60,
                    batch_size: 5,
                    cores: null,
                    iterations: 10
                },
                data: [],
                msg: null,
                schedule_id: null,
                timeoutHandler: null,
                modelType: null,
            }
        },
        destroyed() {
            if (this.timeoutHandler) {
                window.clearTimeout(this.timeoutHandler);
            }
        },
        mounted() {
            const modelType = this.platform.slug === 'spark'
                ? 'PERFORMANCE_SPARK'
                : 'PERFORMANCE_KERAS';
            if (this.platform.slug === 'keras'){
                this.payload.data_size = 1000000;
                this.payload.batch_size = 64;
                this.payload.iterations = 2000;
                this.payload.deadline = 10;
            }
            axios.get(`${limoneroUrl}/models?type=${modelType}`).then(
                (response) => {
                    this.performanceModels = response.data.data;
                }
            );
        },
        watch: {
            cores(val){
                this.payload.cores = val;
            },
            setup(val){
                this.payload.setup = val;
            }
        },
        methods: {
            validate() {

                const props = (this.platform.slug === 'spark')
                    ? ['cluster_id', 'model_id', 'data_type', 'data_size', 'deadline']
                    : ['cluster_id', 'model_id', 'data_type', 'data_size', 'deadline', 'batch_size', 'iterations'];

                return props.every(
                    prop => this.payload[prop] !== null && this.payload[prop] !== '');
            },
            checkSchedule() {
                axios.get(`${standUrl}/performance/result/${this.schedule_id}`)
                    .then((response) => {
                        if (response.data.status === 'ERROR') {
                            if (this.timeoutHandler) {
                                window.clearTimeout(this.timeoutHandler);
                            }
                            this.error(null, `Performance model estimation reported an error. Try again: ${response.data.result.message}`)
                            this.estimatingStep = 0;
                        } else if (response.data.status === 'PROCESSING') {
                            this.timeoutHandler = window.setTimeout(this.checkSchedule, 500);
                        } else {
                            this.performanceModelReady = true;
                            if (this.platform.slug === 'spark'){
                                if (response.data.result && response.data.result.every(v => v == -1)) {
                                    this.data = [];
                                    this.msg = `Unable to find a setup for data size = ${this.payload.data_size}`;
                                } else {
                                    this.data = [response.data.result];
                                }
                                this.availableCores = response.data.cores;
                                this.availableCategories = [this.cluster.name]
                            } else {
                                if (!response.data.result) {
                                    this.data = [];
                                    this.msg = `Unable to find a setup for data size = ${this.payload.data_size}`;
                                } else {
                                    this.availableCategories = response.data.result.models;
                                    this.data = response.data.result.result || [];
                                }
                                this.availableCores = response.data.cores;
                                this.availableCategories = response.data.result.models;
                            }
                            this.estimatingStep = 2;
                        }
                    });
            },
            estimateSetup() {
                this.payload.platform = this.platform.slug;
                this.payload.cluster_id = this.clusterId;

                if (!this.validate()) {
                    this.error(null, this.$tc('errors.missingRequiredValue'));
                } else {
                    window.clearTimeout(this.timeoutHandler);
                    axios.post(`${standUrl}/performance/${this.payload.model_id}`, this.payload)
                        .then((response) => {
                            this.estimatingStep = 1;
                            this.schedule_id = response.data;
                            this.timeoutHandler = window.setTimeout(this.checkSchedule, 500);
                        });
                }
            },
        }
    }
</script>
<style scoped>
    .col-form-label-sm2 {
        font-size: .875em;
        margin: 0;
    }
</style>