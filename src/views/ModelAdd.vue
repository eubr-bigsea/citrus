<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="mx-auto overflow-hidden" :class="step === 1 ? 'col-lg-4':'col-lg-8'">
                        <div v-show="step === 1" class="card animated">
                            <div class="card-body">
                                <form @submit="choose">
                                    <h4 class="card-title">{{$t('model.whatTypeOfModelToAdd')}}</h4>
                                    <div>
                                        <label class="font-weight-bold">{{$tc('common.type')}}:</label>
                                        <select v-model="model.type" class="form-control" required>
                                            <option></option>
                                            <option v-for="fmt in types" :key="fmt" :value="fmt">
                                                {{$tc('model.type_' + fmt)}}
                                            </option>
                                        </select>

                                    </div>
                                    <div>
                                        <label>{{$tc('model.storage')}}:</label>
                                        <select v-model="fsStorage" class="form-control" required>
                                            <option></option>
                                            <option v-for="s in fsStorages" :key="s.id" :value="s.id">{{s.name}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="mt-3 border-top pt-2">
                                        <button type="submit" class="btn btn-success"
                                            :disabled="fsStorage === null || model.type === null || model.type === ''">
                                            {{$t('actions.choose')}}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div v-if="step === 2" class="card animated">
                            <div class="card-body">
                                <h4 class="card-title">{{$tc('titles.model')}}</h4>

                                <div class="col-md-12">
                                    <div ref="drop" class="jumbotron">
                                        <div class="resumable-drop"
                                            :class="{hide: storageType === 'JDBC' || storageType === '' || storageType === 'HBASE' }">
                                            {{$t('model.dropFilesHere')}}
                                            <a ref="browse" class="resumable-browse">
                                                <u>{{$t('model.selectFromComputer')}}</u>
                                            </a>.
                                            <br>
                                            <small>{{$t('model.uploadExplanation')}}</small>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="storageType === 'HDFS' " class="resumable-progress col-md-12">
                                    <table v-if="showProgress">
                                        <tr>
                                            <td width="100%">
                                                <div class="progress-container">
                                                    <div ref="progress" class="progress-bar"></div>
                                                </div>
                                            </td>
                                            <td class="progress-text" nowrap="nowrap"></td>
                                            <td class="progress-pause" nowrap="nowrap">
                                                <a v-if="showResume" href="#" class="progress-resume-link"
                                                    @click.prevent="resume">
                                                    <span class="fa fa-2x fa-play"></span>
                                                </a>
                                                <a v-if="showPause" href="#" class="progress-pause-link"
                                                    @click.prevent="pause">
                                                    <span class="fa fa-2x fa-pause"></span>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div v-if="resumableList.length">
                                    <h3>{{$t('model.uploadingLog')}}</h3>
                                    <table v-if="resumableList.length > 0" class="table table-bordered table-stripped">
                                        <thead>
                                            <tr>
                                                <th>{{$t('model.file')}}</th>
                                                <th>{{$t('model.message')}}</th>
                                                <th>{{$t('model.progress')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="fileInfo in resumableList" :key="fileInfo.file.fileName" :class="fileStatus(fileInfo)">
                                                <td :ref="fileInfo.file.uniqueIdentifier">{{fileInfo.file.fileName}}
                                                </td>
                                                <td>{{fileInfo.message.message}}</td>
                                                <td>
                                                    <span
                                                        class="resumable-file-progress">{{Math.floor(100*fileInfo.file.progress()) }}%</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="border-top mt-5 pt-4">
                                    <button class="btn btn-outline-secondary ml-1"
                                        @click="step=1">{{$t('actions.back')}}</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 3" class="card animated">
                            <div class="card-bod">
                                <h4 class="card-title">{{$t('model.databaseStorage')}}</h4>
                                <label>{{$tc('common.name', 1)}}:</label>
                                <input v-model="model.name" type="text" class="form-control">

                                <label>{{$t('model.selectCommand')}}:</label>
                                <textarea v-model="model.command" class="form-control" rows="4"></textarea>

                                <div class="border-top mt-5 pt-4">
                                    <!-- <button class="btn mr-1 btn-primary" @click="step=1">{{$t('actions.test')}}</button> -->
                                    <button class="btn btn-success" @click="save">{{$t('actions.save')}}</button>
                                    <button class="btn ml-1" @click="step=1">{{$t('actions.back')}}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
    import axios from 'axios';
    import Vue from 'vue';
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    import Resumable from 'resumablejs';
    export default {
        data() {
            return {
                storageType: '',
                step: 1,
                format: '',
                fsStorage: null,
                fsStorages: [],
                model: {
                    name: null,
                    command: null,
                    format: null,
                    url: '',
                    storage_id: null
                },
                types: [
                    'KERAS',
                    'PERFORMANCE_SPARK',
                    'PERFORMANCE_KERAS',
                    'SPARK_ML_CLASSIFICATION',
                    'SPARK_ML_REGRESSION',
                    'SPARK_MLLIB_CLASSIFICATION',
                    'UNSPECIFIED'
                ],

                supported: true,
                showProgress: false,
                showPause: false,
                showResume: false,
                resumableList: []
            };
        },
        mounted() {
            let self = this;
            axios
                .get(`${limoneroUrl}/storages`)
                .then(resp => {
                    resp.data.forEach(storage => {
                        if (storage.type === 'HDFS') {
                            self.fsStorages.push(storage);
                        }
                    });
                    this.fsStorage = this.fsStorages.length ? this.fsStorages[0].id : '';
                })
                .catch(function (e) {
                    self.error(e);
                });
        },
        methods: {
            fileStatus(fileInfo) {
                return fileInfo.message.status !== undefined &&
                    fileInfo.message.status.toLowerCase() === 'error'
                    ? 'danger'
                    : 'success';
            },
            success(msg) {
                this.$snotify.success(msg, this.$t('titles.success'));
            },
            error(e) {
                if (e.name === 'NetworkError') {
                    this.$snotify.error(
                        this.$t('errors.disconnected'),
                        this.$t('titles.error')
                    );
                } else if (e.response && e.response.data) {
                    this.$snotify.error(e.response.data.message, this.$t('titles.error'));
                } else {
                    this.$snotify.error(e.message, this.$t('titles.error'));
                }
            },
            choose() {
                this.step = 2;
                this.model.storage_id = this.fsStorage;
                /* Setup resumable */
                Vue.nextTick(() => {
                    this.setupResumable();
                });
                return false;
            },
            setupResumable() {
                let self = this;

                let resumable = new Resumable({
                    target: `${limoneroUrl}/datasources/upload`,
                    chunkSize: 10 * 1024 * 1024,
                    simultaneousUploads: 1,
                    testChunks: true,
                    throttleProgressCallbacks: 1,
                    method: 'octet',
                    query: { storage_id: self.fsStorage },
                    permanentErrors: [400, 401, 404, 415, 500, 501],
                    chunkRetryInterval: 5000,
                    headers: axios.defaults.headers.common // < same auth headers
                });
                self.resumable = resumable;
                self.supported = resumable.support;
                if (self.supported) {
                    resumable.assignDrop(self.$refs.drop);
                    resumable.assignBrowse(self.$refs.browse);
                }

                let getFileRef = file => {
                    return self.resumableList.find(
                        f => f.file.uniqueIdentifier === file.uniqueIdentifier
                    );
                };
                // Handle file add event
                resumable.on('fileAdded', file => {
                    // Show progress pabr
                    self.showProgress = true;
                    // Show pause, hide resume
                    self.showPause = true;
                    self.showResume = false;
                    // Add the file to the list
                    self.resumableList.splice(0, 0, {
                        file,
                        done: false,
                        progress: '0',
                        message: ''
                    });
                    // Actually start the upload
                    resumable.upload();
                });
                resumable.on('pause', () => {
                    // Show resume, hide pause
                    self.showResume = true;
                    self.showPause = false;
                });
                resumable.on('complete', file => {// eslint-disable-line no-unused-vars
                    // Hide pause/resume when the upload has completed
                    self.showPause = false;
                    self.showResume = false;
                    self.showProgress = false;
                });
                resumable.on('fileSuccess', (file, message) => {
                    let m = JSON.parse(message);
                    // Reflect that the file upload has completed
                    let fileRef = getFileRef(file);
                    const link = self.$router.resolve({
                        name: 'editDataSource',
                        params: { id: m.data.id }
                    });
                    self.$refs[fileRef.file.uniqueIdentifier][0].innerHTML = `<a href="${
                        link.href
                        }">${self.$t('actions.edit')} ${fileRef.file.fileName}`;
                    fileRef.done = true;

                    this.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$tc('titles.model', 1)
                        })
                    );
                    setTimeout(() =>
                        this.$router.push(
                            {
                                name: 'editDataSource',
                                params: { id: m.data.id }
                            },
                            1000
                        )
                    );
                });
                resumable.on('error', (message, file) => {
                    let fileRef = getFileRef(file);
                    fileRef.message = JSON.parse(message);
                    self.showPause = false;
                    self.showProgress = false;
                });
                resumable.on('fileError', (file, message) => {
                    let fileRef = getFileRef(file);
                    fileRef.message = JSON.parse(message);
                    self.showPause = false;
                    self.showProgress = false;
                });
                resumable.on('fileProgress', file => {
                    // Handle progress for both the file and the overall upload
                    let fileRef = getFileRef(file);
                    fileRef.progress = Math.floor(file.progress() * 100) + '%';
                    self.showProgress = true;
                    if (self.$refs.progress) {
                        self.$refs.progress.style.width =
                            Math.floor(resumable.progress() * 100) + '%';
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .card-option {
        min-height: 400px;
    }

    .overflow-hidden {
        overflow: hidden;
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

    .resumable-browse {
        cursor: pointer;
    }

    .resumable-progress {
        height: 20px;
    }

    .resumable-error {
        font-size: 14px;
        font-style: italic;
    }

    .resumable-drop {
        background-color: #fff;
        border: 2px dashed #aaa;
        border-radius: 10px;
        color: #666;
        font-size: 20px;
        font-weight: bold;
        padding: 50px;
        text-align: center;
        z-index: 9999;
    }

    .resumable-list {
        overflow: auto;
        margin-right: -20px;
    }

    .resumable-dragover {
        padding: 30px;
        color: #555;
        background-color: #ddd;
        border: 1px solid #999;
    }

    /* Uploader: Progress bar */

    .resumable-progress {
        margin: 30px 0 30px 0;
        width: 100%;
    }

    .progress-container {
        height: 7px;
        background: #9cbd94;
        position: relative;
    }

    .progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: #45913a;
        width: 0;
    }

    .progress-text {
        font-size: 11px;
        line-height: 9px;
        padding-left: 10px;
    }

    .progress-pause {
        padding: 0 0 0 7px;
    }
</style>
