<template>
    <div class="row">
        <div class="col-md-6 mx-auto overflow-hidden">
            <b-card key="step1" class="animated" :title="$t('dataSource.whatTypeOfDataSourceToAdd')" v-show="step === 1">
                <div class="row">
                    <div class="col-md-6">
                        <b-card bg-variant="light" :title="$t('dataSource.distributedFileSystem')" class="card-option">
                            {{$t('dataSource.features')}}:
                            <ul>
                                <li>{{$t('dataSource.scalability')}};</li>
                                <li>{{$t('dataSource.youCanUploadYourFiles')}};</li>
                                <li>{{$t('dataSource.differentFormatsSupported')}}</li>
                            </ul>
                            {{$t('dataSource.suggestedOption')}}

                            <p class="mt-3">
                                <label>{{$t('dataSource.storage')}}:</label>
                                <select v-model="fsStorage" class="form-control">
                                    <option v-for="s in fsStorages" :key="s.id" :value="s.id">{{s.name}}</option>
                                </select>
                            </p>
                            <button class="btn btn-success" @click="choose('fs')" :disabled="fsStorage === null">
                                {{$t('actions.choose')}}
                            </button>
                        </b-card>

                    </div>
                    <div class="col-md-6">
                        <b-card :title="$t('dataSource.databaseStorage')" class="card-option">
                            {{$t('dataSource.features')}}:
                            <ul>
                                <li>{{$t('dataSource.youCanUseSQL')}};</li>
                                <li>{{$t('dataSource.databaseConnectionPreviouslyConfigured')}};</li>
                            </ul>
                            {{$t('dataSource.alternativeUseDatabase')}}
                            <p class="mt-3">
                                <label>{{$t('dataSource.storage')}}:</label>
                                <select v-model="sqlStorage" class="form-control">
                                    <option v-for="s in sqlStorages" :key="s.id" :value="s.id">{{s.name}}</option>
                                </select>
                            </p>
                            <button class="btn btn-success" @click="choose('sql')" :disabled="sqlStorage === null">
                                {{$t('actions.choose')}}
                            </button>
                        </b-card>
                    </div>
                </div>
            </b-card>
            <b-card key="step2" class="animated" :title="$t('dataSource.distributedFileSystem')" v-if="step === 2">
                <div class="col-md-12">
                    <div ref="drop" class="jumbotron">
                        <div class="resumable-drop" :class="{hide: storageType === 'JDBC' || storageType === '' || storageType === 'HBASE' }">
                            {{$t('dataSource.dropFilesHere')}}
                            <a class="resumable-browse" ref="browse">
                                <u>{{$t('dataSource.selectFromComputer')}}</u>
                            </a>.
                            <br/>
                            <small>{{$t('dataSource.uploadExplanation')}}</small>
                        </div>
                    </div>
                </div>
                <div class="border-top mt-5 pt-4">
                    <button class="btn ml-1" @click="step=1">{{$t('actions.back')}}</button>
                </div>
            </b-card>
            <b-card key="step3" class="animated" :title="$t('dataSource.databaseStorage')" v-if="step === 3">
                <label>{{$tc('common.name', 1)}}:</label>
                <input type="text" class="form-control" v-model="dataSource.name">

                <label>{{$t('dataSource.selectCommand')}}:</label>
                <textarea class="form-control" rows="4" v-model="dataSource.command"></textarea>

                <div class="border-top mt-5 pt-4">
                    <!-- <button class="btn mr-1 btn-primary" @click="step=1">{{$t('actions.test')}}</button> -->
                    <button class="btn btn-success" @click="save">{{$t('actions.save')}}</button>
                    <button class="btn ml-1" @click="step=1">{{$t('actions.back')}}</button>
                </div>
            </b-card>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        mounted() {
            let self = this;
            axios.get(`${limoneroUrl}/storages`).then(
                (resp) => {
                    resp.data.forEach(storage => {
                        if (storage.type === 'HDFS') {
                            self.fsStorages.push(storage);
                        } else if (storage.type === 'JDBC') {
                            self.sqlStorages.push(storage);
                        }
                    });
                }
            ).catch(function (e) {
                self.error(e);
            });
        },
        data() {
            return {
                step: 1,
                format: '',
                fsStorage: null,
                sqlStorage: null,
                fsStorages: [],
                sqlStorages: [],
                dataSource: {
                    name: null,
                    command: null,
                    format: null,
                    url: '',
                    storage_id: null
                }
            }
        },
        methods: {
            success(msg) {
                this.$snotify.success(
                    msg,
                    this.$t('titles.success'),
                );
            },
            error(e) {
                if (e.name === 'NetworkError') {
                    this.$snotify.error(
                        this.$t('errors.disconnected'), this.$t('titles.error'),
                    );
                } else if (e.response && e.response.data) {
                    this.$snotify.error(
                        e.response.data.message, this.$t('titles.error'),
                    );
                } else {
                    this.$snotify.error(
                        e.message, this.$t('titles.error'),
                    );
                }
            },
            choose(method) {
                if (method === 'sql') {
                    this.step = 3
                    this.dataSource.format = 'JDBC'
                    this.dataSource.storage_id = this.sqlStorage
                } else {
                    this.step = 2
                    this.dataSource.format = 'UNKNOWN'
                    this.dataSource.storage_id = this.fsStorage
                }
            },
            save(event) {
                let self = this;
                let url = `${limoneroUrl}/datasources`
                event.target.setAttribute('disabled', 'disabled')
                event.target.classList.remove('btn-spinner')

                axios.post(url, self.dataSource)
                    .then((resp) => {
                        event.target.removeAttribute('disabled')
                        event.target.classList.add('btn-spinner')
                        self.isDirty = false
                        self.success(
                            this.$t('messages.savedWithSuccess',
                                { what: this.$tc('titles.dataSource', 1) }))
                    }
                    ).catch((e) => { self.error(e) })
            }
        }
    }
</script>
<style scoped>
    .card-option {
        min-height: 400px;
    }

    .overflow-hidden {
        overflow: hidden
    }

    .fade-enter-active,
    .fade-leave-active {
        height: 400px;
        opacity: 0.5;
    }

    .fade-enter,
    .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

        {
        height: 0px;
        opacity: 0;
    }


    .animated {
        transition: all 1s;
        /*display: flex;*/
        width: 100%;
    }
</style>