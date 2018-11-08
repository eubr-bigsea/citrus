<template>
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="row border-bottom border-primary">
                <div class="col-md-12">
                    <h2>{{$t('actions.add', {type: $tc('titles.workflow').toLowerCase()})}}</h2>
                </div>
            </div>
            <div class="col-md-12">
                <b-tabs>
                    <b-tab title="By template" active>
                        <div class="col-md-12 mt-2">
                            <div class="d-flex flex-row justify-content-center">
                                <div v-for="template, inx in templates" :key="inx" class="flex-grow-1 w-0">
                                    <div class="card">
                                        <div class="card-header text-white bg-secondary">
                                            {{template.name}}
                                        </div>
                                        <div class="card-body">
                                            <p>{{template.description}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="By processing platform">
                        <div class="col-md-12 mt-2">
                            <div class="d-flex flex-row justify-content-center">
                                <div v-for="platform in platforms" :key="platform.id" class="flex-grow-1 w-0">
                                    <div class="card h-100">
                                        <div class="card-header text-white bg-secondary">
                                            {{platform.name}}
                                        </div>
                                        <div class="card-body">
                                            <p>{{platform.description}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
            <div class="col-md-12 mt-3 border-top pt-1">
                <button class="btn btn-success btn-sm" @click="choose($event, platform.id)">
                    {{$t('actions.choose')}}
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