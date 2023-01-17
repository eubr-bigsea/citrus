<template>
    <main role="main">
        <div class="row">
            <div class="col-12 mx-auto">
                <div v-show="step === 1" class="card p-3">
                    <div class="title">
                        <h4>{{$t('dataSource.whatTypeOfDataSourceToAdd')}}</h4>
                    </div>
                    <div class="row">
                        <div v-for="option in options" :key="option.value" class="col">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        {{option.title}}
                                    </h5>
                                </div>
                                <div class="card-body data-source-option">
                                    {{$t('dataSource.characteristics')}}:
                                    <ul>
                                        <li v-for="(feature, i) in option.features" :key="i">
                                            {{feature}}{{(i ==
                                                option.features.length - 1 )? (feature.slice(-1) !== '.' ? '.':''): ';'}}
                                        </li>
                                    </ul>
                                </div>
                                <div class="card-footer text-center">
                                    <p>
                                        <select v-model="storage[option.prop]" class="form-control">
                                            <option v-for="s in storages[option.items]" :key="s.id" :value="s.id">
                                                {{s.name}}
                                            </option>
                                        </select>
                                    </p>
                                    <button class="btn btn-success" :disabled="storage[option.prop] === null"
                                            @click="handleChoose(option.value)">
                                        {{$t('actions.choose')}}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="step === 2" class="card animated">
                    <div class="card-body">
                        <h4 class="card-title">
                            {{$t('dataSource.distributedFileSystem')}}
                        </h4>
                        <div class="col-md-12">
                            <div ref="dropElem" class="jumbotron">
                                <div class="resumable-drop"
                                     :class="{hide: storageType === 'JDBC' || storageType === '' || storageType === 'HBASE' }">
                                    {{$t('dataSource.dropFilesHere')}}
                                    <a ref="browseElem" class="resumable-browse">
                                        <u>{{$t('dataSource.selectFromComputer')}}</u>
                                    </a>.
                                    <br>
                                    <small>{{$t('dataSource.uploadExplanation')}}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="step === 3 && storageType === 'SQL' " class="card animated">
                    <div class="card-body">
                        <h4 class="card-title">
                            {{$t('dataSource.databaseStorage')}}
                        </h4>
                        <label>{{$tc('common.name', 1)}}:</label>
                        <input v-model="dataSource.name" v-focus type="text" class="form-control">

                        <label>{{$t('dataSource.selectCommand')}}:</label>
                        <textarea v-model="dataSource.command" class="form-control" rows="4" />

                        <div class="border-top mt-5 pt-4">
                            <!-- <button class="btn mr-1 btn-primary" @click="step=1">{{$t('actions.test')}}</button> -->
                            <button class="btn btn-success" @click="handleSave">
                                {{$t('actions.save')}}
                            </button>
                            <button class="btn ml-1 btn-outline-secondary" @click="step=1">
                                {{$t('actions.back')}}
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="step === 3 && storageType === 'HIVE'" class="card animated">
                    <div class="card-body">
                        <h4 class="card-title">
                            {{$t('dataSource.hive')}}
                        </h4>
                        <div class="row">
                            <div class="col-md-8">
                                <label>{{$tc('common.name', 1)}}:</label>
                                <input v-model="dataSource.name" type="text" class="form-control">

                                <label>{{$t('dataSource.selectCommand')}}:</label>
                                <textarea v-model="dataSource.command" class="form-control" rows="4" />
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('dataSource.tablesReference')}}</label>
                                <select v-model="selectedTable" class="form-control tables" size="10"
                                        @dblclick.stop="copyTableName">
                                    <option v-for="tb in tables" :key="tb">
                                        {{tb}}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="border-top mt-5 pt-4">
                            <button class="btn btn-success" @click="handleSave">
                                {{$t('actions.save')}}
                            </button>
                            <button class="btn ml-1 btn-outline-secondary" @click="step=1">
                                {{$t('actions.back')}}
                            </button>
                        </div>
                    </div>
                </div>
                <!--
                <div v-if="step === 3 && storageType === 'HDFS' " class="resumable-progress col-md-12">
                    <table v-if="showProgress">
                        <tr>
                            <td width="100%">
                                <div class="progress-container">
                                    <div ref="progress" class="progress-bar"></div>
                                </div>
                            </td>
                            <td class="progress-text" nowrap="nowrap"></td>
                            <td class="progress-pause" nowrap="nowrap">
                                <a v-if="showResume" href="#" class="progress-resume-link" @click.prevent="resume">
                                    <font-awesome-icon icon="fa fa-2x fa-play" />
                                </a>
                                <a v-if="showPause" href="#" class="progress-pause-link" @click.prevent="pause">
                                    <font-awesome-icon icon="fa fa-2x fa-pause" />
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
                -->
                <div v-if="resumableList.length">
                    <h3>{{$t('dataSource.uploadingLog')}}</h3>
                    <table v-if="resumableList.length > 0" class="table table-bordered table-stripped">
                        <thead>
                            <tr>
                                <th>{{$t('dataSource.file')}}</th>
                                <th>{{$t('dataSource.message')}}</th>
                                <th>{{$t('dataSource.progress')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="fileInfo in resumableList" :key="fileInfo.file.fileName"
                                :class="fileStatus(fileInfo)">
                                <td :ref="fileInfo.file.uniqueIdentifier">
                                    {{fileInfo.file.fileName}}
                                </td>
                                <td>{{fileInfo.message.message}}</td>
                                <td>
                                    <span class="resumable-file-progress">{{Math.floor(100*fileInfo.file.progress())}}%</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-if="step === 2 " class="col">
                <button class="btn btn-outline-secondary mt-2 ml- float-right" @click="step=1">
                    {{$t('actions.back')}}
                </button>
            </div>
        </div>
    </main>
</template>
<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n-bridge';
import { onMounted } from 'vue';

import Notifier from '../notifier.js';
import axios from 'axios';
import Vue from 'vue';
let limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
import Resumable from 'resumablejs';
export default {
    setup() {
        const router = Vue.prototype.$legacyRouter; //FIXME
        const { t } = useI18n();
        const notifier = new Notifier(Vue.prototype.$snotify, t, router);

        const step = ref(1);
        const dataSource = ref({ format: '', storage_id: null, command: null, url: 'placeholder' });
        const storage = ref({
            fsStorage: null,
            sqlStorage: null,
            hiveStorage: null,
        });
        const storageType = ref(null);

        const fileStatus = (fileInfo) => {
            return fileInfo.message.status !== undefined &&
                    fileInfo.message.status.toLowerCase() === 'error'
                ? 'danger'
                : 'success';
        }

        const handleChoose = (method) => {
            if (method === 'sql') {
                step.value = 3;
                dataSource.value.format = 'JDBC';
                dataSource.value.storage_id = storage.value.sqlStorage;
                dataSource.value.url = 'placeholder';
                storageType.value = 'SQL';
            } else if (method === 'hive') {
                step.value = 3;
                dataSource.value.format = 'HIVE';
                dataSource.value.storage_id = storage.value.hiveStorage;
                storageType.value = 'HIVE';
                //this.retrieveTables()
            } else {
                step.value = 2;
                dataSource.value.format = 'UNKNOWN';
                dataSource.value.storage_id = storage.value.fsStorage;
                storageType.value = 'FS'
                /* Setup resumable */
                Vue.nextTick(() => {
                    setupResumable();
                });
            }
        }
        /*
            const copyTableName = () => {
                this.dataSource.command = (this.dataSource.command ? this.dataSource.command + ' ' : '') + this.selectedTable;
            }
            const retrieveTables = () => {
                const self = this;
                const url = `${limoneroUrl}/storages/metadata/${self.dataSource.storage_id}`;

                axios.get(url)
                    .then((resp) => {
                        self.tables = resp.data.data;
                    }
                    ).catch((e) => {
                        self.error(e);
                    });

            }*/
        const resumableList = ref([]);
        const getFileRef = (file) => {
            return resumableList.value.find(
                f => f.file.uniqueIdentifier === file.uniqueIdentifier
            );
        };
        const showPause = ref(false);
        const showProgress = ref(false);
        const showResume = ref(false);
        let resumable = null;
        const dropElem = ref(null);
        const browseElem = ref(null);
        const progressElem = ref(null);
        const isDirty = ref(false);

        const setupResumable = () => {
            resumable = new Resumable({
                target: `${limoneroUrl}/datasources/upload`,
                chunkSize: 10 * 1024 * 1024,
                simultaneousUploads: 1,
                testChunks: true,
                throttleProgressCallbacks: 1,
                method: 'octet',
                query: { storage_id: storage.value.fsStorage },
                permanentErrors: [400, 401, 404, 415, 500, 501],
                chunkRetryInterval: 5000,
                headers: axios.defaults.headers.common // < same auth headers
            });
            if (resumable.support) {
                resumable.assignDrop(dropElem.value);
                resumable.assignBrowse(browseElem.value);
            }

            resumable.on('fileAdded', file => {
                showProgress.value = true;
                showPause.value = true;
                showResume.value = false;
                resumableList.value.splice(0, 0, {
                    file,
                    done: false,
                    progress: '0',
                    message: ''
                });
                // Actually start the upload
                resumable.upload();
            });
            resumable.on('pause', () => {
                showResume.value = true;
                showPause.value = false;
            });
            resumable.on('complete', file => { // eslint-disable-line no-unused-vars
                showPause.value = false;
                showResume.value = false;
                showProgress.value = false;
            });
            resumable.on('fileSuccess', (file, message) => {
                const m = JSON.parse(message);
                // Reflect that the file upload has completed
                /*
                    const fileRef = getFileRef(file);
                    const link = router.resolve({
                        name: 'editDataSource',
                        params: { id: m.data.id }
                    });
                    self.$refs[fileRef.file.uniqueIdentifier][0].innerHTML = `<a href="${link.href
                        }">${self.$t('actions.edit')} ${fileRef.file.fileName}`;
                    fileRef.done = true;
                    */
                notifier.success(
                    t('messages.savedWithSuccess', {
                        what: t('titles.dataSource', 1)
                    })
                );
                setTimeout(() =>
                    router.push(
                        {
                            name: 'editDataSource',
                            params: { id: m.data.id }
                        }
                    ),
                1000
                );
            });
            const handleError = (file, message) => {
                const fileRef = getFileRef(file);
                fileRef.message = JSON.parse(message);
                showPause.value = false;
                showProgress.value = false;
            }
            resumable.on('error', handleError);
            resumable.on('fileError', handleError);

            resumable.on('fileProgress', file => {
                // Handle progress for both the file and the overall upload
                const fileRef = getFileRef(file);
                fileRef.progress = Math.floor(file.progress() * 100) + '%';
                showProgress.value = true;
                if (progressElem.value) {
                    progressElem.value.style.width =
                            Math.floor(resumable.progress() * 100) + '%';
                }
            });
        }
        const handleSave = async (event) => {
            const url = `${limoneroUrl}/datasources`
            event.target.setAttribute('disabled', 'disabled')
            event.target.classList.add('btn-spinner')
            try {
                const resp = await axios.post(url, dataSource.value);
                isDirty.value = false;
                notifier.success(
                    t('messages.savedWithSuccess',
                        { what: t('titles.dataSource', 1) }))
                router.push({
                    name: 'editDataSource', params: { 'id': resp.data.data.id }
                })
            } catch (e) {
                notifier.error(e);
            } finally {
                event.target.removeAttribute('disabled')
                event.target.classList.remove('btn-spinner')
            }
        }

        const storages = ref({
            fsStorages: [],
            sqlStorages: [],
            hiveStorages: [],
        });
            /* Lifecycle*/
        onMounted(async () => {
            try {
                const resp = await axios.get(`${limoneroUrl}/storages?enabled=true&fields=id,name,type`);
                resp.data.data.forEach(st => {
                    if (st.type === 'HDFS') {
                        storages.value.fsStorages.push(st);
                    } else if (st.type === 'JDBC') {
                        storages.value.sqlStorages.push(st);
                    } else if (st.type === 'HIVE' || st.type === 'HIVE_WAREHOUSE') {
                        storages.value.hiveStorages.push(st);
                    }
                });

                storage.value.fsStorage = storages.value.fsStorages.length ? storages.value.fsStorages[0].id : '';
                storage.value.sqlStorage = storages.value.sqlStorages.length ? storages.value.sqlStorages[0].id : '';
                storage.value.hiveStorage = storages.value.hiveStorages.length ? storages.value.hiveStorages[0].id : '';

            } catch (e) {
                notifier.error(e);
            }
        });
        return {
            /* Methods */
            handleChoose, handleSave, fileStatus,
            /* Elements */
            dropElem, browseElem,
            /* Control */
            storage, storages, storageType,
            showProgress, showPause, showResume,
            step, resumableList, dataSource,
            options: [
                {
                    title: t('dataSource.distributedFileSystem'),
                    features: [
                        t('dataSource.scalability'),
                        t('dataSource.youCanUploadYourFiles'),
                        t('dataSource.differentFormatsSupported'),
                        t('dataSource.suggestedOption')
                    ],
                    prop: 'fsStorage',
                    items: 'fsStorages',
                    value: 'fs'
                },
                {
                    title: t('dataSource.databaseStorage'),
                    features: [
                        t('dataSource.youCanUseSQL'),
                        t('dataSource.databaseConnectionPreviouslyConfigured')
                    ],
                    items: 'sqlStorages',
                    prop: 'sqlStorage',
                    value: 'sql'
                },
                {
                    title: t('dataSource.hive'),
                    features: [
                        t('dataSource.youCanUseSQL'),
                        t('dataSource.performance')
                    ],
                    prop: 'hiveStorage',
                    items: 'hiveStorages',
                    value: 'hive'
                },
            ],
        };
    }
};
</script>
<style scoped>
    .data-source-option {
        height: 30vh;
        overflow: auto;
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

    .tables {
        font-size: .7em;
    }

    .card-body {
        min-height: 300px;
    }
</style>