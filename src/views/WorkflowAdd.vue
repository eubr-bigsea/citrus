<template>
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="row border-bottom border-primary p-2">
                <div class="col-md-12">
                    <h2 class="title text-primary">{{$t('actions.add', {type: $tc('titles.workflow').toLowerCase()})}}</h2>
                </div>
            </div>
            <div class="col-md-12">
                <b-tabs>
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
                            <table class="table table-striped xtable-bordered">
                                <tr v-for="platform in platforms" :key="platform.id">
                                    <td class="w-40">
                                        <b-form-radio value="platform.id" name="platform">
                                        {{platform.name}}
                                        </b-form-radio>
                                    </td>
                                    <td class="w-60">
                                        <em>{{platform.description}}.</em>
                                    </td>
                                </tr> 
                            </table>
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
                <button class="btn btn-primary float-right" @click="choose($event, platform.id)">
                    {{$t('actions.create', {type: $tc('titles.workflow', 1).toLowerCase()})}}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL

    export default {
        name: 'WorkflowAdd',
        data() {
            return {
                platforms: [],
                templates: [
                    { id: 1, name: 'Empty', description: 'Empty workflow' },
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
        methods: {
            choose(event, platformId) {
                let url = `${tahitiUrl}/workflows`;
                axios.post(url, {}).then(resp => {
                    this.platforms = resp.data;
                }).catch(function (e) {
                    this.$toastr.e(e);
                }.bind(this));
            }
        }
    }
</script>