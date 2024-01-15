<template>
    <main role="main">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <div>
                            <div class="d-flex justify-content-between align-items-center">
                                <h1>
                                    {{add ? $t('actions.add', {type: $t('titles.storage', 1).toLowerCase()}) :
                                        $t('actions.edit') + ' ' + $t('titles.storage', 1).toLowerCase()}}
                                </h1>
                            </div>
                            <hr>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <label class="font-weight-bold">{{$t('common.name')}}:</label>
                                <input v-model="storage.name"
                                       type="text"
                                       class="form-control"
                                       required
                                       maxlength="100">
                            </div>
                            <div class="col-md-2">
                                <label class="font-weight-bold">{{$t('common.type')}}:</label>
                                <select v-model="storage.type"
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
                                <b-form-checkbox v-model="storage.enabled">
                                    {{$t('common.enabled')}}
                                </b-form-checkbox>
                            </div>
                            <div class="col-md-12">
                                <label class="font-weight-bold">{{$t('storage.address1')}}:</label>
                                <textarea v-model="storage.url"
                                          class="form-control"
                                          required />
                            </div>
                            <div class="col-md-12">
                                <label class="font-weight-bold">{{$t('storage.address2')}}:</label>
                                <textarea v-model="storage.client_url"
                                          class="form-control" />
                            </div>
                            <div class="col-md-12">
                                <label>{{$t('storage.extraParameters')}}:</label>
                                <textarea v-model="storage.extra_params"
                                          class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-12 mb-4 border-top pt-2 mt-2">
                            <button class="btn btn-primary me-1 btn-spinner"
                                    @click.stop="save">
                                <font-awesome-icon icon="spinner"
                                                   pulse
                                                   class="icon" />
                                <font-awesome-icon icon="fa fa-save" />
                                {{$t('actions.save')}}
                            </button>
                            <router-link :to="{name: 'storages'}"
                                         class="btn btn-secondary me-1">
                                {{$t('actions.cancel')}}
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

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    name: 'StorageEdit',
    mixins: [Notifier],
    props: {
        add: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            storage: {},
            types: ['HDFS', 'HIVE', 'HIVE_WAREHOUSE', 'JDBC', 'KAFKA',
                'LOCAL']
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
                const url = `${limoneroUrl}/storages/${this.$route.params.id}`;
                axios
                    .get(url)
                    .then(resp => {
                        this.storage = resp.data.data[0];
                    })
                    .catch(
                        function (e){
                            this.error(e);
                        }.bind(this)
                    );
            } else {
                self.storage = {id: null, enabled: false};
            }
        },
        save(event){
            const self = this;
            const data = this.storage;
            let url = `${limoneroUrl}/storages/${this.storage.id}`;
            let axiosCall = axios.patch;

            if (self.add){
                url = `${limoneroUrl}/storages`;
                axiosCall = axios.post;
            }
            event.target.setAttribute('disabled', 'disabled');
            event.target.classList.remove('btn-spinner');

            axiosCall(url, data)
                .then(()=> {
                    this.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$t('titles.storage', 1)
                        })
                    );
                    this.$router.push({
                        name: 'storages'
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
