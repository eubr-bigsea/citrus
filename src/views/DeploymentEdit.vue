<template>
    <div>
        <div class="row border-bottom border-primary p-2">
            <div class="col-md-12 col-xl-12 mx-auto">
                <h2 class="title text-primary">{{$tc('titles.deployment', 1)}}</h2>
            </div>
        </div>
        <div class="row" v-if="loaded">
            <div class="col-md-4 col-xg-12 mx-auto">
                <p>
                    <label>Created</label>
                    {{deployment.created}}
                </p>
                {{deployment}}
            </div>
            <div class="col-md-8 col-xg-12 mx-auto">
                <div style="position: relative; overflow: hidden; height: 65vh;">
                    <diagram :workflow="job.workflow" ref="diagram" id="main-diagram" :operations="operations"
                        :version="job.id" initial-zoom="1" :showToolbar="false" :editable="false" shink="true"
                        v-if="loaded" :loaded="loaded" :showTaskDecoration="true" :initialZoom=".7" />
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
                loaded: false,
                operations: null
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
                    self.operations = resp.data.data;
                    axios.get(`${standUrl}/jobs/${this.deployment.job_id}`, data).then(
                        (resp) => {
                            self.job = resp.data;
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