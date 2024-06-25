<template>
    <main role="main">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <div>
                            <div class="d-flex justify-content-between align-items-center">
                                <h1>
                                    {{add ? $t('actions.add', {type: $tc('titles.graphExplorer', 1).toLowerCase()}) :
                                        $t('actions.edit') + ' ' + $tc('titles.graphExplorer', 1).toLowerCase()}}
                                </h1>
                            </div>
                            <hr>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                <input v-model="vertice.name"
                                       type="text"
                                       class="form-control"
                                       required
                                       maxlength="100">
                            </div>
                            <div class="col-md-2">
                                <label class="font-weight-bold">{{$tc('common.type')}}:</label>
                                <select v-model="vertice.type"
                                        class="form-control"
                                        required>
                                    <option v-for="typ in types"
                                            :key="typ"
                                            :value="typ">
                                        {{typ}}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-2 mt-3 mb-3 mt-3">
                                <b-form-checkbox v-model="vertice.enabled">
                                    {{$t('common.enabled')}}
                                </b-form-checkbox>
                            </div>
                            <div class="col-md-12">
                                <label class="font-weight-bold">{{$t('vertice.address1')}}:</label>
                                <textarea v-model="vertice.url"
                                          class="form-control"
                                          required />
                            </div>
                            <div class="col-md-12">
                                <label class="font-weight-bold">{{$t('vertice.address2')}}:</label>
                                <textarea v-model="vertice.client_url"
                                          class="form-control" />
                            </div>
                            <div class="col-md-12">
                                <label>{{$tc('vertice.extraParameters')}}:</label>
                                <textarea v-model="vertice.extra_params"
                                          class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-12 mb-4 border-top pt-2 mt-2">
                            <button class="btn btn-primary mr-1 btn-spinner"
                                    @click.stop="save">
                                <font-awesome-icon icon="spinner"
                                                   pulse
                                                   class="icon" />
                                <font-awesome-icon icon="fa fa-save" />
                                {{$tc('actions.save')}}
                            </button>
                            <router-link :to="{name: 'MainGraph'}"
                                         class="btn btn-secondary mr-1">
                                {{$tc('actions.cancel')}}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    name: 'GraphEdit',
    mixins: [Notifier],
    props: {
        add: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            vertice: {},
            types: ['TESTE1', 'TESTE2']
        };
    },
    computed: {},
    mounted(){
        this.load();
    },
    methods: {
        load(){
            const self = this;
            if (!self.add){
                const url = `${tahitiUrl}/vertice-types/${this.$route.params.id}`;
                axios
                    .get(url)
                    .then(resp => {
                        this.vertice = resp.data.data[0]
                    })
                    .catch(
                        function (e){
                            this.error(e);
                        }.bind(this)
                    );
            } else {
                self.vertice = {id: null, enabled: false};
            }
        },
        save(event){
            const self = this;
            const data = this.vertice;
            let url = `${tahitiUrl}/vertice-types/${this.vertice.id}`;
            let axiosCall = axios.patch;

            if (self.add){
                url = `${tahitiUrl}/vertice-types`;
                axiosCall = axios.post
            }
            event.target.setAttribute('disabled', 'disabled');
            event.target.classList.remove('btn-spinner');

            axiosCall(url, data)
                .then(()=> {
                    this.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$tc('titles.graphExplorer', 1)
                        })
                    );
                    this.$router.push({
                        name: 'MainGraph'
                    });
                })
                .catch(
                    function (e){
                        this.error(e);
                    }.bind(this)
                ).finally(() => {
                    event.target.removeAttribute('disabled');
                    event.target.classList.add('btn-spinner');
                });

        }
    }
};
</script>