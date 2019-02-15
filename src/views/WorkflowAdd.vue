<template>
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <div class="row border-bottom border-primary p-2">
                    <div class="col-md-12">
                        <h2 class="title text-primary">
                            {{$t('actions.add', {type: $tc('titles.workflow').toLowerCase()})}}</h2>
                    </div>
                </div>
                <div class="col-md-12">
                    <label>{{$tc('common.name')}}:</label>
                    <input class="form-control mb-1" v-model="name" />
                    <b-tabs @input="changeTab" class="mt-2">
                        <b-tab :title="$t('workflow.fromTemplate')">
                            <div class="col-md-12 mt-2">
                                <table class="table">
                                    <tr v-for="template in templates" :key="template.id">
                                        <td class="w-25">
                                            <b-form-radio :value="template.id" name="templateCheck"
                                                v-model="selectedTemplate" @change="selectOne">
                                                {{template.name}}
                                            </b-form-radio>
                                        </td>
                                        <td class="w-60">
                                            <em>{{template.description}}.</em>
                                        </td>
                                        <td class="w-15">
                                            {{template.platform ? template.platform.name: ''}}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </b-tab>
                        <b-tab :title="$t('workflow.forPlatform')" active>
                            <div class="col-md-12 mt-2">
                                <b-form-radio-group id="radios2" v-model="selectedPlatform" name="platform">
                                    <table class="table table-striped xtable-bordered">
                                        <tr v-for="platform in platforms" :key="platform.id">
                                            <td class="w-25">
                                                <b-form-radio :value="platform.id" name="platform"
                                                    v-model="selectedPlatform">
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
                    </b-tabs>
                </div>
                <div class="col-md-12 mt-3 border-top pt-1">
                    <button class="btn float-right" :class="{'btn-primary': canCreate }" @click="choose($event)"
                        :disabled="!canCreate">
                        {{$t('actions.create', {type: $tc('titles.workflow', 1).toLowerCase()})}}
                    </button>
                </div>
            </b-card>
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
                selectedTemplate: null,
                platforms: [],
                templates: [],
            }
        },
        mounted() {
            axios.get(`${tahitiUrl}/platforms?enabled=true`).then(resp => {
                this.platforms = resp.data;
            }).then(() => {
                const params = {
                    template: true,
                    fields: 'id,name,description,platform',
                    enabled: true
                }
                axios.get(`${tahitiUrl}/workflows`, { params }).then(resp => {
                    this.templates = resp.data.data;
                })
            })
                .catch(function (e) {
                    this.$toastr.e(e);
                }.bind(this));
        },
        computed: {
            canCreate() {
                return this.name !== null && this.name.trim() != '' &&
                    (this.selectedTab === 0 && this.selectedTemplate !== null
                        || this.selectedTab === 1 && this.selectedPlatform !== null
                        || this.selectedTab === 2 && false);
            }
        },
        methods: {
            selectOne(v) {
                // v-model is not working ! This is a workaround
                this.selectedTemplate = v
            },
            changeTab(index) {
                this.selectedTab = index;
            },
            choose(event) {
                if (this.canCreate) {
                    const data = {
                        name: this.name,
                        platform_id: this.selectedPlatform,
                        template_id: this.selectedTemplate
                    };
                    let url = `${tahitiUrl}/workflows`;
                    if (this.selectedTab === 0){
                        url = `${tahitiUrl}/workflows/from-template`;
                    } 
                    axios.post(url, data).then(resp => {
                        this.$router.push({
                            name: 'editWorkflow',
                            params: { platform: resp.data.platform.id, id: resp.data.id }
                        })
                    }).catch(function (e) {
                        this.error(e);
                    }.bind(this));
                }
            }
        }
    }
</script>