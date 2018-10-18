<template>
    <div class="row">
        <div class="col-md-12">
            <h2>{{$t('actions.add', {type: $tc('titles.workflow').toLowerCase()})}}</h2>
        </div>
        <!--
      <div class="col-md-6 mx-auto">
        <form class="form-inline">
            <label>{{$tc('common.name')}}: </label>
            <input type="text" v-model="name" class="form-control" />
            <label>{{$t('common.platform')}}: </label>
            <select v-model="platformId" class="form-control">
              <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
                {{platform.name}}
              </option> 
            </select>
        </form>
      </div>
      -->
        <div class="col-md-12">
            <h3>By processing platform:</h3>
        </div>
        <div class="col-md-3 mb-2" v-for="platform in platforms" :key="platform.id">
            <div class="card">
                <div class="card-header text-white bg-secondary">
                    {{platform.name}}
                </div>
                <div class="card-body">
                    <p>{{platform.description}}</p>
                    <button class="btn btn-success btn-sm float-right" @click="choose($event, platform.id)">
                        {{$t('actions.choose')}}
                    </button>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <h3>By template:</h3>
        </div>
        <div class="col-md-2 mb-2" v-for="template in templates" :key="template.id">
            <div class="card">
                <div class="card-header text-white bg-secondary">
                    {{template.name}}
                </div>
                <div class="card-body">
                    <p>{{template.description}}</p>
                    <button class="btn btn-success btn-sm float-right" @click="choose($event, platform.id)">
                        {{$t('actions.choose')}}
                    </button>
                </div>
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
                    {id: 1, name: 'Classification', description: 'Train a classification model'},
                    {id: 2, name: 'Regression', description: 'Train a regression model'},
                    {id: 3, name: 'Clustering', description: 'Train a clustering model'},
                    {id: 4, name: 'Frequent item set mining', description: 'Mining frequent item sets'},
                    {id: 5, name: 'Deep Learning', description: 'Train a classification model using deep learning'},
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