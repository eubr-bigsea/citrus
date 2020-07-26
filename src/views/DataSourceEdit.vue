<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.dataSource', 1)}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div v-if="dataSource.id" class="col-md-12 col-xg-12 mx-auto">
                            <b-card no-body>
                                <b-tabs card>
                                    <b-tab :title="$t('dataSource.basicInformation')" active>
                                        <div class="row" :class="!loggedUserIsOwnerOrAdmin ? 'disabled-mouse': ''">
                                            <div class="col-md-6">
                                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                <input v-model="dataSource.name" type="text" class="form-control">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$tc('common.format')}}:</label>
                                                <select v-model="dataSource.format" class="form-control">
                                                    <option v-for="fmt in formats" :key="fmt" :value="fmt">{{fmt}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$t('dataSource.storage')}}:</label>
                                                <input v-model="dataSource.storage.name + ' (' + dataSource.storage.type + ')'"
                                                    disabled
                                                    class="form-control">
                                            </div>
                                            <div class="col-md-6">
                                                <label>{{$tc('common.description')}}:</label>
                                                <textarea v-model="dataSource.description"
                                                    class="form-control"></textarea>
                                            </div>
                                            <div class="col-md-3">
                                                <label>{{$t('common.tags')}}:</label>
                                                <v-select v-model="customTags" multiple :close-on-select="false"
                                                    style="width: 100%" :taggable="true" class="custom">
                                                    <span slot="no-options"></span>
                                                </v-select>
                                            </div>
                                            <div class="col-md-3">
                                                <div v-if="dataSource.storage.type !== 'VALLUM'">
                                                    <label>{{$tc('dataSource.treatAsNull')}}:</label>
                                                    <v-select v-model="customTreatAsMissing" multiple :close-on-select="false"
                                                        style="width: 100%" :taggable="true" class="custom">
                                                        <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                    </v-select>
                                                </div>
                                            </div>
                                            <div v-if="dataSource.format === 'CSV'" class="col-md-3 col-lg-2 mt-3">
                                                <b-form-checkbox v-model="dataSource.is_first_line_header">
                                                    {{ $t('dataSource.isFirstLineHeader') }}</b-form-checkbox>
                                            </div>
                                            <div v-if="dataSource.storage.type !== 'VALLUM' && dataSource.storage.type !== 'HIVE' "
                                                class="col-md-2 col-lg-2 mt-3">
                                                <b-form-checkbox v-model="dataSource.is_multiline">
                                                    {{ $t('dataSource.isMultiline') }}</b-form-checkbox>
                                            </div>
                                            <div class="col-md-2 col-lg-1 mt-3">
                                                <b-form-checkbox v-model="dataSource.enabled">
                                                    {{ $t('common.enabled') }}
                                                </b-form-checkbox>
                                            </div>
                                            <div class="col-md-2 col-lg-1 mt-3">
                                                <b-form-checkbox v-model="dataSource.is_public">
                                                    {{ $t('dataSource.public') }}</b-form-checkbox>
                                            </div>
                                            <div class="col-md-4 col-lg-2 mt-3">
                                                <b-form-checkbox v-model="dataSource.is_lookup">
                                                    {{ $t('dataSource.lookup') }}</b-form-checkbox>
                                            </div>
                                            <div v-if="atmosphereExtension" class="col-md-2 col-lg-2 mt-3">
                                                <b-form-checkbox v-if="atmosphereExtension"
                                                    v-model="dataSource.privacy_aware">
                                                    {{ $t('dataSource.privacyAware') }}
                                                </b-form-checkbox>
                                            </div>

                                            <div v-if="dataSource.format === 'JDBC' || dataSource.storage.type === 'VALLUM' || dataSource.storage.type === 'HIVE'"
                                                class="col-md-12 mt-3 pb-1">
                                                <label>{{$tc('common.command')}}:</label>
                                                <textarea v-model="dataSource.command" class="form-control"></textarea>
                                            </div>
                                            <div v-if="dataSource.storage.type === 'VALLUM'"
                                                class="col-md-12 mt-3 pb-1">
                                                <label>Initialization: </label>
                                                <div v-if="dataSource.initialization === 'NO_INITIALIZED'">
                                                    Vallum data source is not initialized (cached).
                                                    You have to copy data to another (Local) storage.
                                                    <p>
                                                        <button class="btn btn-sm btn-outline-secondary"
                                                            @click="showInitializationModal">Initialize data
                                                            source</button>
                                                    </p>
                                                </div>
                                            </div>
                                            <div v-if="dataSource.format === 'CSV'" class="col-md-12 mt-3 mt-3 pb-1">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.attributeDelimiter') }}:</label>
                                                        <v-select v-model="dataSource.attribute_delimiter"
                                                            style="width: 100%"
                                                            :options="delimiters" :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.recordDelimiter') }}:</label>
                                                        <v-select v-model="dataSource.record_delimiter"
                                                            style="width: 100%" :options="delimiters"
                                                            :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.textDelimiter') }}:</label>
                                                        <v-select v-model="dataSource.text_delimiter"
                                                            style="width: 100%"
                                                            :options="textDelimiters" :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.encoding') }}:</label>
                                                        <v-select v-model="dataSource.encoding" style="width: 100%"
                                                            :options="encodings" :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>
                                    <b-tab>
                                        <template slot="title">
                                            {{$tc('dataSource.attribute', 2)}}
                                        </template>
                                        <h5 class="card-title">{{$tc('common.attribute', 2)}}</h5>

                                        <table v-if="dataSource.attributes && dataSource.attributes.length > 0"
                                            class="table table-sm table-stripped"
                                            :class="!loggedUserIsOwnerOrAdmin ? 'disabled-mouse': ''">
                                            <thead>
                                                <tr>
                                                    <th class="primary text-center" style="width:3%">#</th>
                                                    <th class="primary text-center" style="width:30%">
                                                        {{$tc('common.name')}}</th>
                                                    <th class="primary text-center" style="width:12%">
                                                        {{$tc('common.type')}}</th>
                                                    <th class="primary text-center" style="width:12%">
                                                        {{$tc('common.format')}}</th>

                                                    <th class="primary text-center" style="width:25%">
                                                        {{$tc('dataSource.missingRepresentation')}}</th>
                                                    <th v-if="dataSource.privacy_aware" class="primary text-center"
                                                        style="width:5%">
                                                        {{$tc('dataSource.privacy')}}</th>
                                                    <!--
    		                                    <th class="primary text-center" style="width:5%">{{$tc('common.nullable')}}</th>
    		                                    <th class="primary text-center" style="width:5%">{{$tc('common.size')}}</th>
    		                                    <th class="primary text-center" style="width:5%">{{$tc('common.precision')}}</th>
    		                                    <th class="primary text-center" style="width:5%">{{$tc('common.scale')}}</th>
                          -->
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(attr, index) in dataSource.attributes" :key="attr.id"
                                                    class="hover-action">
                                                    <td class="text-center">{{index + 1}}</td>
                                                    <td>
                                                        <input v-model="attr.name" class="form-control-sm form-control">
                                                    </td>
                                                    <td>
                                                        <select v-model="attr.type"
                                                            class="form-control-sm form-control">
                                                            <option v-for="dt in dataTypes" :key="dt" :value="dt">
                                                                {{dt}}</option>
                                                        </select>
                                                    </td>
                                                    <td class="text-center">
                                                        <input v-model="attr.format" type="text"
                                                            class="form-control-sm form-control" maxlenght="50">
                                                    </td>
                                                    <!--
    		                                    <td class="text-center">
    		                                        <SwitchComponent v-model="attr.nullable" :checked="attr.nullable"></SwitchComponent>
    		                                    </td>
    		                                    <td class="col-xs-1">
    		                                        <input type="number" class="form-control-sm form-control" maxlenght="2" v-model="attr.size" min="0" />
    		                                    </td>
    		                                    <td class="col-xs-1">
    		                                        <input type="number" class="form-control-sm form-control" maxlenght="2" v-model="attr.precision" min="0" />
    		                                    </td>
    		                                    <td class="col-xs-1">
    		                                        <input type="number" class="form-control-sm form-control" maxlenght="2" v-model="attr.scale" min="0" />
    		                                    </td>
                          -->
                                                    <td>
                                                        <input v-model="attr.missing_representation"
                                                            class="form-control-sm form-control" maxlength="200">
                                                    </td>
                                                    <td v-if="dataSource.privacy_aware" class="text-center">
                                                        <button class="btn btn-sm btn-outline-success hover-action"
                                                            @click.prevent="showPrivacyModal(attr)">
                                                            {{$tc('actions.edit')}}...
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div v-else class="border-bottom mb-5 pt-3 pb-3">
                                            <div class="alert alert-info">{{ $t("dataSource.noAttributes") }}</div>
                                        </div>
                                    </b-tab>
                                    <b-tab v-if="loggedUserIsOwnerOrAdmin">
                                        <template slot="title">
                                            <span class="fa fa-link"></span> {{$tc('dataSource.relationship', 2)}}
                                        </template>
                                        <p class="pb-1 border-bottom text-right">
                                            <button class="btn btn-sm btn-primary" @click="addShare"><span class="fa fa-link"></span> {{$t('actions.add', {type: $tc('common.sharing', 1)})}}</button>
                                        </p>
                                    </b-tab> 
                                    <b-tab v-if="loggedUserIsOwnerOrAdmin">
                                        <template slot="title">
                                            <span class="fa fa-share-alt"></span> {{$tc('common.sharing', 2)}}
                                        </template>
                                        <p class="pb-1 border-bottom text-right">
                                            <button class="btn btn-sm btn-primary" @click="addShare"><span class="fa fa-plus"></span> {{$t('actions.add', {type: $tc('common.sharing', 1)})}}</button>
                                        </p>
                                        <template v-if="dataSource.permissions && dataSource.permissions.length > 0">
                                            <table class="table table-sm">
                                                <tbody>
                                                    <tr v-for="p in dataSource.permissions" :key="p.id">
                                                        <td style="width:80px" class="text-center">
                                                            <div class="badge badge-secondary pt-1 pb-1 pr-2 pl-2" 
                                                                :title="$t('permissions.descriptions.' +p.permission)">{{$t('permissions.' +p.permission).toUpperCase()}}</div>
                                                        </td>
                                                        <td>
                                                            <strong><router-link :to="{name: 'userInfo', params: {id: p.user_id}}">{{p.user_name}}</router-link></strong> ({{p.user_login}})
                                                        </td>
                                                        <td class="text-right">
                                                            <button v-if="loggedUserIsOwnerOrAdmin"
                                                                class="btn btn-sm btn-light">
                                                                <font-awesome-icon icon="trash" />
                                                            </button>
                                                            <button class="btn btn-sm btn-light" :title="$t('actions.edit')"><font-awesome-icon icon="edit" /></button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </template>
                                        <div v-else>{{ $t("dataSource.noPermissions") }}</div>
                                    </b-tab>
                                </b-tabs>
                                <div class="col-md-12 mb-4 border-top pt-2">
                                    <button v-if="loggedUserIsOwnerOrAdmin" class="btn btn-primary mr-1 btn-spinner"
                                        @click.stop="save">
                                        <font-awesome-icon icon="spinner" pulse class="icon" />
                                        <span class="fa fa-save"></span>
                                        {{$tc('actions.save')}}
                                    </button>
                                    <router-link :to="{name: 'dataSources'}" class="btn btn-secondary mr-1">
                                        {{$tc('actions.cancel')}}</router-link>
                                    <button v-if="canInfer && loggedUserIsOwnerOrAdmin" class="btn btn-success ml-1 btn-spinner"
                                        @click.stop="infer">
                                        <font-awesome-icon icon="spinner" pulse class="icon" />
                                        {{$tc('dataSource.inferSchema')}}
                                    </button>
                                    <button v-if="dataSource.storage.type !== 'VALLUM'" class="btn btn-spinner ml-1 btn-outline-info"
                                        :disabled="isDirty" @click.stop="preview">
                                        <font-awesome-icon icon="spinner" pulse class="icon" />
                                        <span class="fa fa-eye"></span>
                                        &nbsp;
                                        <span
                                            v-text="isDirty ? $t('common.saveBeforeToEnableThis', {what: $t('common.preview')}): $t('common.preview')"></span>
                                    </button>
                                </div>
                            </b-card>
                        </div>
                        <div v-else class="col-md-12 mx-auto border-top mt-3 pt-3">{{$t('common.noData')}}</div>
                        <b-modal ref="shareModal" size="lg" :title="$t('actions.share')">
                            <div class="row">
                                <div class="col-md-8">
                                    <label>{{$tc('titles.user', 1)}}:</label>
                                    <v-select></v-select>
                                </div>
                                <div class="col-md-4">
                                    <label>{{$tc('common.permission', 1)}}:</label>
                                    <select class="form-control">
                                        <option>{{$t('permissions.MANAGE')}}</option>
                                        <option>{{$t('permissions.READ')}}</option>
                                        <option>{{$t('permissions.WRITE')}}</option>
                                    </select>
                                </div>
                            </div>
                        </b-modal>
 
                        <b-modal ref="privacy" size="lg" :title="$t('dataSource.privacy')">
                            <div class="row">
                                <div class="col-md-4">
                                    <label>
                                        {{ $tc('privacy.privacyType') }}:
                                    </label>
                                    <select v-if="currentAttribute.attribute_privacy" v-model="currentAttribute.attribute_privacy.privacy_type"
                                        class="form-control">
                                        <option></option>
                                        <option v-for="t in privacy_types" :key="t" :value="t">{{t}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label>
                                        {{ $tc('privacy.anonymizationTechnique') }}:
                                    </label>
                                    <select v-if="currentAttribute.attribute_privacy" v-model="currentAttribute.attribute_privacy.anonymization_technique"
                                        class="form-control">
                                        <option></option>
                                        <option v-for="t in anonymization" :key="t" :value="t">{{t}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label>
                                        {{ $tc('privacy.attributePrivacyGroup') }}:
                                    </label>
                                    <select v-if="currentAttribute.attribute_privacy" v-model="currentAttribute.attribute_privacy.attribute_privacy_group_id"
                                        class="form-control">
                                        <option></option>
                                        <option v-for="t in attributeGroups" :key="t.id" :value="t.id">{{t.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <label>
                                {{ $tc('privacy.hierarchy') }}:
                            </label>
                            <textarea
                                v-if="currentAttribute.attribute_privacy"
                                v-model="currentAttribute.attribute_privacy.hierarchy"
                                class="form-control" type="text" rows="5"></textarea>
                            <div slot="modal-footer" class="w-100">
                                <b-btn variant="primary" class="float-right mr-2" @click="okPrivacy">
                                    {{$t('actions.close')}}
                                </b-btn>
                            </div>
                        </b-modal>
                        <b-modal ref="modalInitialization" size="lg" title="Initialize Vallum">
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    Destination (local storage):
                                </div>
                                <div class="col-md-6 mb-2">
                                    Destination path (relative to storage's base path):
                                </div>
                                <div class="col-md-6">
                                    <select v-model="vallumSelectedStorage" class="form-control">
                                        <option></option>
                                        <option v-for="storage in localStorages" :key="storage.id"
                                            :value="storage.id">
                                            {{storage.name}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <input v-model="vallumPath" type="text" class="form-control"/>
                                </div>
                            </div>

                            <div slot="modal-footer" class="w-100">
                                <b-btn variant="outline-secondary" class="float-right mr-2" @click="hideInitialization">
                                    {{$t('actions.close')}}
                                </b-btn>
                                <b-btn v-if="vallumSelectedStorage !== ''" variant="primary" class="float-right mr-2"
                                    @click.prevent="initializeVallum">
                                    <b-spinner v-if="copyingStep === 1" small></b-spinner>
                                    <span v-if="copyingStep !== 1">Copy data</span>
                                    <span v-else> Copying data, please wait</span>
                                </b-btn>
                            </div>
                        </b-modal>
                    </div>
                </div>
            </div>
        </div>
        <ModalPreviewDataSource ref="preview"/>
    </main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import VueSelect from 'vue-select';
    import Notifier from '../mixins/Notifier';
    import ModalPreviewDataSource from './modal/ModalPreviewDataSource';

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;

    export default {
        mixins: [Notifier],
        components: {
            'v-select': VueSelect,
            ModalPreviewDataSource,
        },
        data() {
            return {
                copyingStep: 0,
                atmosphereExtension: process.env.VUE_APP_ATMOSPHERE,
                isDirty: false,
                vallumSelectedStorage: '',
                vallumPath: '',
                samples: [],
                localStorages: [],
                dataSource: {},
                attributeGroups: {},
                anonymization: ['ENCRYPTION', 'GENERALIZATION', 'MASK',
                    'SUPPRESSION', 'NO_TECHNIQUE'],
                privacy_types: ['SENSITIVE', 'IDENTIFIER', 'NON_SENSITIVE',
                    'QUASI_IDENTIFIER'],
                dataTypes: [
                    'BINARY', 'CHARACTER', 'DOUBLE', 'DECIMAL', 'DATE', 'DATETIME',
                    'FLOAT', 'INTEGER', 'LONG', 'TEXT', 'TIME', 'TIMESTAMP',
                    'VECTOR' ].sort(),
                formats: [
                    'CSV', 'CUSTOM', 'GEO_JSON', 'HAR_IMAGE_FOLDER', 'HDF5',
                    'DATA_FOLDER', 'IMAGE_FOLDER', 'HIVE', 'JDBC', 'JSON',
                    'NPY', 'PARQUET', 'PICKLE', 'SAV', 'SHAPEFILE',
                    'TAR_IMAGE_FOLDER', 'TEXT', 'VIDEO_FOLDER', 'UNKNOWN',
                    'XML_FILE' ].sort(),
                delimiters: [
                    ',', ';', '.', '{tab}', '{new_line \\n}',
                    '{new_line \\r\\n}'
                ],
                textDelimiters: ['"', "'"],
                encodings: ['ISO-8859-1', 'UTF-8', 'UTF-16'],
                currentAttribute: { attribute_privacy: {} },
                timeoutHandler: null
            };
        },
        
        computed: {
            inferableDataSource() {
                return ['CSV', 'JDBC', 'PARQUET'].includes(this.dataSource.format);
            },
            customTags: {
                get() {
                    return this.dataSource.tags ? this.dataSource.tags.split(',') : [];
                },
                set(value) {
                    this.dataSource.tags = value.join(',');
                }
            },
            customTreatAsMissing: {
                get() {
                    return this.dataSource.treat_as_missing
                        ? this.dataSource.treat_as_missing.split(',')
                        : [];
                },
                set(value) {
                    this.dataSource.treat_as_missing = value.join(',');
                }
            },
            canInfer() {
                return this.dataSource.attributeDelimiter !== ''
                    && this.dataSource.storage.type !== 'VALLUM';
            },
            loggedUserIsOwnerOrAdmin() {
                const user = this.$store.getters.user;
                return this.dataSource.user_id === user.id
                    || user.roles.indexOf('admin') >= 0;
            }
        },
      watch: {
            '$route.params.id': function (id) {
                this.load().then(() => {
                    Vue.nextTick(() => {
                        this.isDirty = false;
                    });
                });
            },
            dataSource: {
                handler(newVal, oldVal) {
                    this.isDirty = true;
                },
                deep: true
            }
        },
         mounted() {
            let self = this;
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false;
                });
            });
        },
        /* Methods */
        methods: {
            addShare(){
                this.$refs.shareModal.show();
            },
            hideInitialization() {
                this.$refs.modalInitialization.hide();
            },
            showInitializationModal() {
                const self = this;
                axios
                    .get(`${limoneroUrl}/storages`)
                    .then(resp => {
                        self.localStorages = resp.data.filter(st => st.type === 'LOCAL');
                        self.$refs.modalInitialization.show();
                    })
                    .catch(function (e) {
                        self.error(e);
                    });
            },
            initializeVallum() {
                if (this.vallumSelectedStorage !== '') {
                    const self = this;
                    const payload = {data_source_id: this.dataSource.id,
                        storage_id: this.vallumSelectedStorage,
                        path: this.vallumPath
                    };
                    self.copyingStep = 1;
                    axios
                        .post(`${standUrl}/datasource/init`, payload)
                        .then(resp => {
                            this.schedule_id = resp.data;
                            self.success('Vallum data copy scheduled with success');
                            //self.hideInitialization();
                            self.timeoutHandler = window.setTimeout(self.checkSchedule, 500);
                        })
                        .catch(function (e) {
                            self.error(e);
                        });
                } else {
                    this.$warn('You must select a storage');
                }
            },
            checkSchedule(){
                const params = {key: this.schedule_id};
                const self = this;
                axios.get(`${standUrl}/datasource/init`, {params})
                    .then((response) => {
                        if (response.data.status === 'ERROR') {
                            if (this.timeoutHandler) {
                                window.clearTimeout(this.timeoutHandler);
                            }
                            this.error({name: ''}, `Copying process reported an error. Try again: ${response.data.result.message}`)
                            this.estimatingStep = 0;
                        } else if (response.data.status === 'PROCESSING') {
                            this.timeoutHandler = window.setTimeout(this.checkSchedule, 500);
                        } else {
                            self.copyingStep = 0;
                            self.hideInitialization();
                            self.success(response.data.result.message);
                        }
                    });
            },
            okPrivacy() {
                this.$refs.privacy.hide();
            },
            showPrivacyModal(attr) {
                const self = this;
                axios
                    .get(`${limoneroUrl}/privacy/attribute-groups`)
                    .then(resp => {
                        self.attributeGroups = resp.data;
                    })
                    .catch(function (e) {
                        self.error(e);
                    });
                this.currentAttribute = attr;
                if (attr.attribute_privacy === null) {
                    attr.attribute_privacy = {
                        attribute_name: attr.name
                    };
                }
                if (this.$refs.privacy) {
                    this.$refs.privacy.show();
                }
            },
            load() {
                let self = this;
                return new Promise((resolve, reject) => {
                    axios
                        .get(`${limoneroUrl}/datasources/${this.$route.params.id}`)
                        .then(resp => {
                            self.dataSource = resp.data;
                            resolve();
                        })
                        .catch(function (e) {
                            self.error(e);
                        });
                });
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
            save(event) {
                const self = this;
                let inconsistentFormat =
                    (self.dataSource.format === 'JDBC' &&
                        self.dataSource.storage.type !== 'JDBC') ||
                    (self.dataSource.format === 'VALLUM' &&
                        self.dataSource.storage.type !== 'VALLUM');
                self.dataSource.attributes.forEach(attr => {
                    if (attr.attribute_privacy &&
                        (!attr.attribute_privacy.anonymization_technique
                            || !attr.attribute_privacy.privacy_type)) {
                        attr.attribute_privacy = null;
                    }
                });
                if (inconsistentFormat) {
                    self.error({ message: self.$t('dataSource.inconsistentFormat') });
                    return;
                }
                let url = `${limoneroUrl}/datasources/${this.dataSource.id}`;
                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');
                return axios
                    .patch(url, this.dataSource)
                    .then(resp => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
                        self.dataSource = resp.data.data;
                        Vue.nextTick(() => {
                            self.isDirty = false;
                        });
                        self.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('titles.dataSource', 1)
                            })
                        );
                    })
                    .catch(e => {
                        self.error(e);
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
                    });
            },
            preview(){
                this.$refs.preview.show(this.dataSource.id);
            },
            _doInfer(event) {
                const self = this;
                const url = `${limoneroUrl}/datasources/infer-schema/${
                    self.dataSource.id
                    }`;
                axios
                    .post(url, {})
                    .then(resp => {
                        self.success(this.$t('dataSource.inferSuccess'));
                        this.load();
                    })
                    .catch(e => {
                        console.debug(e);
                        self.error(e);
                    })
                    .finally(() => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
                    });
            },
            infer(event) {
                const self = this;
                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');
                if (self.isDirty) {
                    self.save(event).then(() => self._doInfer(event));
                } else {
                    self._doInfer(event);
                }
            }
        }
    };
</script>
<style>
    .disabled-mouse {
        pointer-events: none;
        opacity: .9;
    }

    .v-select .dropdown-toggle::after {
        content: none;
    }

    .table-smallest {
        font-size: 0.8em;
    }

    .table-smallest td {
        white-space: nowrap;
    }

    tr.hover-action button.hover-action {
        xdisplay: none;
    }

    tr.hover-action:hover button.hover-action {
        display: inherit;
    }
</style>
