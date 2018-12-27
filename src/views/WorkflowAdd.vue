<template>
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="row border-bottom border-primary p-2">
                <div class="col-md-12">
                    <h2 class="title text-primary">{{$t('actions.add', {type: $tc('titles.workflow').toLowerCase()})}}</h2>
                </div>
            </div>
            <div class="col-md-12">
                <label>{{$tc('common.name')}}:</label>
                <input class="form-control mb-1" v-model="name" placeholder="Inform a name"/>
                <b-tabs @input="changeTab">
                    <b-tab title="From template" active>
                        <div class="col-md-12 mt-2">
                            <table class="table table-striped xtable-bordered">
                                <tr v-for="template in templates" :key="template.id">
                                    <td class="w-40">
                                        <b-form-radio value="first" name="template">
                                            {{template.name}}
                                        </b-form-radio>
                                    </td>
                                    <td class="w-60">
                                        <em>{{template.description}}.</em>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </b-tab>
                    <b-tab title="For processing platform">
                        <div class="col-md-12 mt-2">
                            {{selectedPlatform}}
                            <b-form-radio-group id="radios2" v-model="selectedPlatform" name="platform">
                                <table class="table table-striped xtable-bordered">
                                    <tr v-for="platform in platforms" :key="platform.id">
                                        <td class="w-25">
                                            <b-form-radio :value="platform.id" name="platform" v-model="selectedPlatform">
                                                {{platform.name}}
                                            </b-form-radio>
                                        </td>
                                        <td class="w-75">
                                            <em>{{platform.description}}.</em>
                                        </td>
                                    </tr>
                                </table>
                            </b-form-radio-group>
                        </div>
                    </b-tab>
                    <b-tab title="From users' templates">
                        <table class="table table-striped xtable-bordered">
                            <tr v-for="template in templates" :key="template.id">
                                <td class="w-40">
                                    <b-form-radio value="first" name="template">
                                        {{template.name}}
                                    </b-form-radio>
                                </td>
                                <td class="w-60">
                                    <em>{{template.description}}.</em>
                                </td>
                            </tr>
                        </table>
                    </b-tab>
                </b-tabs>
            </div>
            <div class="col-md-12 mt-3 border-top pt-1">
                <button class="btn float-right" :class="{'btn-primary': canCreate }" @click="choose($event)" :disabled="!canCreate">
                    {{$t('actions.create', {type: $tc('titles.workflow', 1).toLowerCase()})}}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import Notifier from '../mixins/Notifier'

    let tahitiUrl = process.env.VUE_APP_TAHITI_URL

    export default {
        mixins: [Notifier],
        name: 'WorkflowAdd',
        data() {
            return {
                name: '',
                selectedTab: 1,
                selectedPlatform: null,
                selectedSystemTemplate: null,
                selectedTemplate: null,
                platforms: [],
                templates: [
                    { id: 0, name: 'Empty', description: 'Empty workflow' },
                    { id: 1, name: 'Classification', description: 'Train a classification model' },
                    { id: 2, name: 'Regression', description: 'Train a regression model' },
                    { id: 3, name: 'Clustering', description: 'Train a clustering model' },
                    { id: 4, name: 'Frequent item set mining', description: 'Mining frequent item sets' },
                    { id: 5, name: 'Deep Learning', description: 'Train a classification model using deep learning' },
                ],
            }
        },
        mounted() {
            let url = `${tahitiUrl}/platforms?enabled=true`;
            axios.get(url).then(resp => {
                this.platforms = resp.data;
            }).catch(function (e) {
                this.$toastr.e(e);
            }.bind(this));
        },
        computed: {
            canCreate() {
                return this.name !== null && this.name.trim() != '' &&
                    (this.selectedTab === 0 && false
                    || this.selectedTab === 1 && this.selectedPlatform !== null
                    || this.selectedTab === 2 && false);
            }
        },
        methods: {
            changeTab(index) {
                this.selectedTab = index;
            },
            choose(event) {
                if (this.canCreate) {
                    const data = {
                        name: this.name,
                        platform_id: this.selectedPlatform,
                    };
                    let url = `${tahitiUrl}/workflows`;
                    axios.post(url, data).then(resp => {
                        this.platforms = resp.data;
                    }).catch(function (e) {
                        this.error(e);
                    }.bind(this));
                }
            }
        }
    }
</script>