<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$t('actions.create', {type: $t('titles.workflow', 1).toLowerCase()})}}</h1>
                    </div>
                    <hr>
                    <b-card>
                        <div class="row">
                            <div class="col-md-4">
                                <label>{{$t('common.name')}}:</label>
                                <input v-model="name" v-focus class="form-control mb-1">
                            </div>
                            <div class="col-md-12">
                                <b-tabs class="mt-2" nav-class="custom-tab" @input="changeTab">
                                    <b-tab :title="$t('workflow.forPlatform')" active>
                                        <div class="col-md-12 mt-2">
                                            <b-form-radio-group id="radios2" v-model="selectedPlatform" name="platform"
                                                                @change="selectOptions(false)">
                                                <table class="table table-striped">
                                                    <div v-for="platform in platforms" :key="platform.id"
                                                         style="display: contents">
                                                        <tr class="d-flex">
                                                            <td class="col-3">
                                                                <b-form-radio v-if="platform.subsets && platform.subsets.length == 0 || !(hasAnyPermission(['APP_EDIT']) || isAdmin)"
                                                                              v-model="selectedPlatform" :value="platform.id"
                                                                              name="platform">
                                                                    {{platform.name}}
                                                                </b-form-radio>
                                                                <div v-else>
                                                                    {{platform.name}}
                                                                </div>
                                                            </td>
                                                            <td class="col-9">
                                                                <small>{{platform.description}}.</small>
                                                            </td>
                                                        </tr>
                                                        <template v-for="subset in platform.subsets">
                                                            <tr v-if="(hasAnyPermission(['APP_EDIT']) || isAdmin) && platform.subsets"
                                                                :key="subset.id" class="d-flex">
                                                                <td class="col-12">
                                                                    <b-form-radio-group id="radios2"
                                                                                        v-model="selectedSubset" name="subset"
                                                                                        class="ps-4"
                                                                                        @change="selectOptions(true, platform.id)">
                                                                        <b-form-radio v-model="selectedSubset"
                                                                                      :value="subset.id" name="subset">
                                                                            {{subset.name}}
                                                                        </b-form-radio>
                                                                    </b-form-radio-group>
                                                                </td>
                                                            </tr>
                                                        </template>
                                                    </div>
                                                </table>
                                            </b-form-radio-group>
                                        </div>
                                    </b-tab>
                                    <b-tab :title="$t('workflow.fromTemplate')">
                                        <div class="col-md-12 mt-2">
                                            <table v-if="templates && templates.length" class="table">
                                                <tr class="d-flex">
                                                    <th class="col-3">
                                                        {{$t('common.name')}}
                                                    </th>
                                                    <th class="col-6">
                                                        {{$t('common.description')}}
                                                    </th>
                                                    <th class="col-3">
                                                        {{$t('titles.platform')}}
                                                    </th>
                                                </tr>
                                                <tr v-for="template in templates" :key="template.id" class="d-flex">
                                                    <td class="col-3">
                                                        <b-form-radio v-model="selectedTemplate" :value="template.id"
                                                                      name="templateCheck" @change="selectOne">
                                                            {{template.name}}
                                                        </b-form-radio>
                                                    </td>
                                                    <td class="col-6">
                                                        <em>{{template.description}}.</em>
                                                    </td>
                                                    <td class="col-3">
                                                        {{template.platform ? template.platform.name: ''}}
                                                    </td>
                                                </tr>
                                            </table>
                                            <div v-else>
                                                <div class="alert alert-info">
                                                    {{$t('common.noData')}}
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>
                                </b-tabs>
                            </div>
                            <div class="col-md-12 mt-3 border-top pt-1">
                                <button class="btn float-right" :class="{'btn-success': true }" :disabled="!canCreate"
                                        @click="choose($event)">
                                    {{$t('actions.confirm')}}
                                </button>
                            </div>
                        </div>
                    </b-card>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
import { mapGetters } from 'vuex';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    name: 'WorkflowAdd',
    mixins: [Notifier],
    data() {
        return {
            name: '',
            selectedTab: 0,
            selectedPlatform: null,
            selectedSubset: null,
            selectedTemplate: null,
            platforms: [],
            templates: []
        };
    },
    computed: {
        ...mapGetters(['hasAnyPermission', 'isAdmin', 'user']),
        canCreate() {
            return (
                this.name !== null &&
                    this.name.trim() != '' &&
                    ((this.selectedTab === 0 && this.selectedPlatform !== null) ||
                        (this.selectedTab === 1 && this.selectedTemplate !== null) ||
                        (this.selectedTab === 2 && false))
            );
        }
    },
    mounted() {
        axios
            .get(`${tahitiUrl}/platforms?enabled=true`)
            .then(resp => {
                this.platforms = resp.data.data;
                if (this.platforms && this.platforms.length) {
                    this.selectedPlatform = this.platforms[0].id;
                }
            })
            .then(() => {
                const params = {
                    template: true,
                    fields: 'id,name,description,platform',
                    enabled: true
                };
                axios.get(`${tahitiUrl}/workflows`, { params }).then(resp => {
                    this.templates = resp.data.data;
                });
            })
            .catch(
                function (e) {
                    this.$toastr.e(e);
                }.bind(this)
            );
    },
    methods: {
        selectOptions(subsetSelected, platformId) {
            if (subsetSelected) {
                this.selectedPlatform = platformId;
            } else {
                this.selectedSubset = null;
            }
        },
        selectOne(v) {
            // v-model is not working ! This is a workaround
            this.selectedTemplate = v;
        },
        changeTab(index) {
            this.selectedTab = index;
        },
        choose() {
            if (this.canCreate) {
                const data = {
                    name: this.name,
                    platform_id: this.selectedPlatform,
                    template_id: this.selectedTemplate,
                    subset_id: this.selectedSubset,
                };
                let url = `${tahitiUrl}/workflows`;
                if (this.selectedTab === 1) {
                    url = `${tahitiUrl}/workflows/from-template`;
                }
                axios
                    .post(url, data)
                    .then(resp => {
                        this.$router.push({
                            name: 'editWorkflow',
                            params: { platform: resp.data.platform.id, id: resp.data.id }
                        });
                    })
                    .catch(
                        function (e) {
                            this.error(e);
                        }.bind(this)
                    );
            }
        }
    }
};
</script>