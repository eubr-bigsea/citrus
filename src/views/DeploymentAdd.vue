<template>
    <div class="row">
        <div class="col-md-8 mx-auto overflow-hidden">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12">
                        <b-card bg-variant="" :title="$t('deployment.whatToDeploy')" class="card-option">
                            <b-form-group>
                                <b-form-radio-group v-model="selectedDeployableType" :options="deployableTypes" stacked
                                    name="radiosStacked">
                                </b-form-radio-group>
                            </b-form-group>
                            <v-select label="name" :filterable="false" :options="selectableDeployables"
                                @search="onSearch" ref="deployables">
                                <template slot="no-options">
                                    {{$t('actions.chooseOption')}}
                                </template>
                                <template slot="option" slot-scope="option">
                                    <div class="d-center">
                                        {{ option.name }} (#{{option.id }})
                                        <div class="platform-icon-small float-right" :class="'bg-' + option.platform.slug"></div>
                                        {{ option.full_name }}
                                    </div>
                                </template>
                                <template slot="selected-option" scope="option">
                                    <div class="selected d-center">
                                        {{ option.full_name }}
                                    </div>
                                </template>
                            </v-select>
                        </b-card>
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
                deployableTypes: [
                    { text: this.$t('deployment.savedModel'), value: 'model' },
                    { text: this.$t('deployment.workflow'), value: 'workflow' }
                ],
                selectedDeployableType: "model",
                selectableDeployables: [],
                selectedDeployable: null
            }
        },
        methods: {
            onSearch(search, loading) {
                loading(true);
                this._search(loading, search, this);
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
                    this.dispatch('error', e);
                }
                )
            }, 350)
        }
    }
</script>
<style scoped>

</style>