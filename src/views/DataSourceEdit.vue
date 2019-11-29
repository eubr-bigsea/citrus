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
                        <div class="col-md-12 col-xg-12 mx-auto" v-if="dataSource.id">
                            <b-card no-body>
                                <b-tabs card>
                                    <b-tab :title="$t('dataSource.basicInformation')" active>
                                        <div class="row" :class="!loggedUserIsOwnerOrAdmin ? 'disabled-mouse': ''">
                                            <div class="col-md-6">
                                                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                <input type="text" class="form-control" v-model="dataSource.name">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$tc('common.format')}}:</label>
                                                <select class="form-control" v-model="dataSource.format">
                                                    <option v-for="fmt in formats" v-bind:value="fmt" :key="fmt">{{fmt}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{$t('dataSource.storage')}}:</label>
                                                <input disabled
                                                    v-model="dataSource.storage.name + ' (' + dataSource.storage.type + ')'"
                                                    class="form-control">
                                            </div>
                                            <div class="col-md-6">
                                                <label>{{$tc('common.description')}}:</label>
                                                <textarea class="form-control"
                                                    v-model="dataSource.description"></textarea>
                                            </div>
                                            <div class="col-md-3">
                                                <label>{{$t('common.tags')}}:</label>
                                                <v-select multiple :close-on-select="false" style="width: 100%"
                                                    v-model="customTags" :taggable="true" class="custom">
                                                    <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                </v-select>
                                            </div>
                                            <div class="col-md-3">
                                                <div v-if="dataSource.storage.type !== 'VALLUM'">
                                                    <label>{{$tc('dataSource.treatAsNull')}}:</label>
                                                    <v-select multiple :close-on-select="false" style="width: 100%"
                                                        v-model="customTreatAsMissing" :taggable="true" class="custom">
                                                        <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                    </v-select>
                                                </div>
                                            </div>
                                            <div class="col-md-3 col-lg-2 mt-3" v-if="dataSource.format === 'CSV'">
                                                <b-form-checkbox v-model="dataSource.is_first_line_header">
                                                    {{ $t('dataSource.isFirstLineHeader') }}</b-form-checkbox>
                                            </div>
                                            <div class="col-md-2 col-lg-2 mt-3"
                                                v-if="dataSource.storage.type !== 'VALLUM'">
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
                                            <div class="col-md-2 col-lg-2 mt-3" v-if="atmosphereExtension">
                                                <b-form-checkbox v-model="dataSource.privacy_aware"
                                                    v-if="atmosphereExtension">
                                                    {{ $t('dataSource.privacyAware') }}
                                                </b-form-checkbox>
                                            </div>

                                            <div class="col-md-12 mt-3 pb-1"
                                                v-if="dataSource.format === 'JDBC' || dataSource.storage.type === 'VALLUM'">
                                                <label>{{$tc('common.command')}}:</label>
                                                <textarea class="form-control" v-model="dataSource.command"></textarea>
                                            </div>
                                            <div class="col-md-12 mt-3 pb-1"
                                                v-if="dataSource.storage.type === 'VALLUM'">
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
                                            <div class="col-md-12 mt-3 mt-3 pb-1" v-if="dataSource.format === 'CSV'">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.attributeDelimiter') }}:</label>
                                                        <v-select style="width: 100%"
                                                            v-model="dataSource.attribute_delimiter"
                                                            :options="delimiters" :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.recordDelimiter') }}:</label>
                                                        <v-select style="width: 100%"
                                                            v-model="dataSource.record_delimiter" :options="delimiters"
                                                            :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.textDelimiter') }}:</label>
                                                        <v-select style="width: 100%"
                                                            v-model="dataSource.text_delimiter"
                                                            :options="textDelimiters" :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>{{ $t('dataSource.encoding') }}:</label>
                                                        <v-select style="width: 100%" v-model="dataSource.encoding"
                                                            :options="encodings" :taggable="true">
                                                            <span
                                                                slot="no-options">{{$t('messages.noMatching')}}.</span>
                                                        </v-select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>
                                    <b-tab :title="$tc('dataSource.attribute', 2)">
                                        <h5 class="card-title">{{$tc('common.attribute', 2)}}</h5>

                                        <table class="table table-sm table-stripped"
                                            :class="!loggedUserIsOwnerOrAdmin ? 'disabled-mouse': ''"
                                            v-if="dataSource.attributes && dataSource.attributes.length > 0">
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
                                                    <th class="primary text-center" v-if="dataSource.privacy_aware"
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
                                                        <select class="form-control-sm form-control"
                                                            v-model="attr.type">
                                                            <option v-for="dt in dataTypes" v-bind:value="dt" :key="dt">
                                                                {{dt}}</option>
                                                        </select>
                                                    </td>
                                                    <td class="text-center">
                                                        <input type="text" class="form-control-sm form-control"
                                                            maxlenght="50" v-model="attr.format">
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
                                                        <input class="form-control-sm form-control"
                                                            v-model="attr.missing_representation" maxlength="200">
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
                                    <b-tab :title="$tc('common.sharing', 2)" v-if="loggedUserIsOwnerOrAdmin">
                                        <table class="table table-bordered table-stripped"
                                            v-if="dataSource.permissions && dataSource.permissions.length > 0">
                                            <thead>
                                                <tr>
                                                    <th class="primary col-md-1 text-center">{{ $t("common.userId") }}
                                                    </th>
                                                    <th class="primary text-center">{{ $t("common.userName") }}</th>
                                                    <th class="primary text-center">{{ $t("common.userLogin") }}</th>
                                                    <th class="primary text-center">{{ $tc("common.permission", 1) }}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="p in dataSource.permissions" :key="p.id">
                                                    <td class="text-center">{{p.user_id}}</td>
                                                    <td>{{p.user_name}}</td>
                                                    <td>{{p.login}}</td>
                                                    <td>{{p.permission}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div v-else>{{ $t("dataSource.noPermissions") }}</div>
                                    </b-tab>
                                </b-tabs>
                                <div class="col-md-12 mb-4 border-top pt-2">
                                    <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save"
                                        v-if="loggedUserIsOwnerOrAdmin">
                                        <font-awesome-icon icon="spinner" pulse class="icon" />
                                        <span class="fa fa-save"></span>
                                        {{$tc('actions.save')}}
                                    </button>
                                    <router-link :to="{name: 'dataSources'}" class="btn btn-secondary mr-1">
                                        {{$tc('actions.cancel')}}</router-link>
                                    <button class="btn btn-success ml-1 btn-spinner" @click.stop="infer"
                                        v-if="canInfer && loggedUserIsOwnerOrAdmin">
                                        <font-awesome-icon icon="spinner" pulse class="icon" />
                                        {{$tc('dataSource.inferSchema')}}
                                    </button>
                                    <button class="btn btn-spinner ml-1 btn-outline-info" @click.stop="preview"
                                        :disabled="isDirty" v-if="dataSource.storage.type !== 'VALLUM'">
                                        <font-awesome-icon icon="spinner" pulse class="icon" />
                                        <span class="fa fa-eye"></span>
                                        &nbsp;
                                        <span
                                            v-text="isDirty ? $t('common.saveBeforeToEnableThis', {what: $t('common.preview')}): $t('common.preview')"></span>
                                    </button>
                                </div>
                            </b-card>
                        </div>
                        <div class="col-md-12 mx-auto border-top mt-3 pt-3" v-else>{{$t('common.noData')}}</div>
                        <b-modal size="lg" ref="preview" :title="$t('common.preview')">
                            {{$t('dataSource.previewExplanation', {amount: 40})}}
                            <v-client-table :columns="getPreviewColumns()" :data="samples"
                                :options="{perPage: 5, perPageValues:[5,], skin:'table-smallest table-sm table table-striped', filterable: false}">
                            </v-client-table>
                            <div v-if="previewWarnings.length">
                                <strong>{{$tc('dataSource.someAttributesMayHaveProblem', previewWarnings.length)}}:</strong>
                                {{previewWarnings.join(", ")}}
                            </div>
                        </b-modal>
                        <b-modal size="lg" ref="privacy" :title="$t('dataSource.privacy')">
                            <div class="row">
                                <div class="col-md-4">
                                    <label>
                                        {{ $tc('privacy.privacyType') }}:
                                    </label>
                                    <select class="form-control" v-if="currentAttribute.attribute_privacy"
                                        v-model="currentAttribute.attribute_privacy.privacy_type">
                                        <option></option>
                                        <option v-for="t in privacy_types" v-bind:value="t" :key="t">{{t}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label>
                                        {{ $tc('privacy.anonymizationTechnique') }}:
                                    </label>
                                    <select class="form-control" v-if="currentAttribute.attribute_privacy"
                                        v-model="currentAttribute.attribute_privacy.anonymization_technique">
                                        <option></option>
                                        <option v-for="t in anonymization" v-bind:value="t" :key="t">{{t}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label>
                                        {{ $tc('privacy.attributePrivacyGroup') }}:
                                    </label>
                                    <select class="form-control" v-if="currentAttribute.attribute_privacy"
                                        v-model="currentAttribute.attribute_privacy.attribute_privacy_group_id">
                                        <option></option>
                                        <option v-for="t in attributeGroups" v-bind:value="t.id" :key="t.id">{{t.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <label>
                                {{ $tc('privacy.hierarchy') }}:
                            </label>
                            <textarea class="form-control" type="text" rows="5"
                                v-if="currentAttribute.attribute_privacy"
                                v-model="currentAttribute.attribute_privacy.hierarchy"></textarea>
                            <div slot="modal-footer" class="w-100">
                                <b-btn variant="primary" class="float-right mr-2" @click="okPrivacy">
                                    {{$t('actions.close')}}
                                </b-btn>
                            </div>
                        </b-modal>
                        <b-modal size="lg" ref="modalInitialization" title="Initialize Vallum">
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    Destination (local storage):
                                </div>
                                <div class="col-md-6 mb-2">
                                    Destination path (relative to storage's base path):
                                </div>
                                <div class="col-md-6">
                                    <select class="form-control" v-model="vallumSelectedStorage">
                                        <option></option>
                                        <option v-for="storage in localStorages" :key="storage.id"
                                            v-bind:value="storage.id">
                                            {{storage.name}}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <input type="text" class="form-control" v-model="vallumPath" />
                                </div>
                            </div>

                            <div slot="modal-footer" class="w-100">
                                <b-btn variant="outline-secondary" class="float-right mr-2" @click="hideInitialization">
                                    {{$t('actions.close')}}
                                </b-btn>
                                <b-btn variant="primary" class="float-right mr-2" v-if="vallumSelectedStorage !== ''"
                                    @click.prevent="initializeVallum">
                                    <b-spinner small v-if="copyingStep === 1"></b-spinner>
                                    <span v-if="copyingStep !== 1">Copy data</span>
                                    <span v-else> Copying data, please wait</span>
                                </b-btn>
                            </div>
                        </b-modal>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import VueSelect from 'vue-select';
    import SwitchComponent from '../components/widgets/Switch.vue';
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;

    export default {
        components: {
            'v-select': VueSelect,
            SwitchComponent
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
                    'BINARY',
                    'CHARACTER',
                    'DOUBLE',
                    'DECIMAL',
                    'DATE',
                    'DATETIME',
                    'FLOAT',
                    'INTEGER',
                    'LONG',
                    'TEXT',
                    'TIME',
                    'TIMESTAMP',
                    'VECTOR'
                ].sort(),
                formats: [
                    'CSV',
                    'CUSTOM',
                    'GEO_JSON',
                    'HAR_IMAGE_FOLDER',
                    'HDF5',
                    'DATA_FOLDER',
                    'IMAGE_FOLDER',
                    'JDBC',
                    'JSON',
                    'NETCDF4',
                    'NPY',
                    'PARQUET',
                    'PICKLE',
                    'SAV',
                    'SHAPEFILE',
                    'TAR_IMAGE_FOLDER',
                    'TEXT',
                    'VIDEO_FOLDER',
                    'UNKNOWN',
                    'VALLUM',
                    'XML_FILE'
                ].sort(),
                delimiters: [
                    ',',
                    ';',
                    '.',
                    '{tab}',
                    '{new_line \\n}',
                    '{new_line \\r\\n}'
                ],
                textDelimiters: ['"', "'"],
                previewWarnings: [],
                encodings: ['ISO-8859-1', 'UTF-8', 'UTF-16'],
                currentAttribute: { attribute_privacy: {} },
                timeoutHandler: null
            };
        },
        mounted() {
            let self = this;
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false;
                });
            });
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
        /* Methods */
        methods: {
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
                const self = this;
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
                            this.error(null, `Copying process reported an error. Try again: ${response.data.result.message}`)
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
            getPreviewColumns() {
                if (
                    this.dataSource &&
                    this.dataSource.attributes &&
                    this.dataSource.attributes.length
                ) {
                    return this.dataSource.attributes.map(a => a.name);
                } else if (this.samples.length) {
                    return Object.keys(this.samples[0]);
                } else {
                    return [];
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
                        self.dataSource.storage.type !== 'VALLUM') ||
                    (self.dataSource.format !== 'JDBC' &&
                        self.dataSource.storage.type !== 'VALLUM' &&
                        self.dataSource.storage.type !== 'HDFS');
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
            preview(event) {
                let url = `${limoneroUrl}/datasources/sample/${
                    this.dataSource.id
                    }?limit=40`;
                let self = this;
                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');
                axios
                    .get(url, {})
                    .then(resp => {
                        self.samples = resp.data.data;
                        self.previewWarnings = resp.data.warnings || [];
                        self.$refs.preview.show();
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
