<template>
    <div>
        <div class="row border-bottom border-primary p-2">
            <div class="col-md-12 col-xl-12 mx-auto">
                <h2 class="title text-primary">{{$tc('titles.dataSource', 1)}}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 col-xg-12 mx-auto" v-if="dataSource.id">
                <b-card no-body>
                    <b-tabs card>
                        <b-tab :title="$t('dataSource.basicInformation')" active>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="font-weight-bold">{{$tc('common.name')}}: </label>
                                    <input type="text" class="form-control" v-model="dataSource.name" />
                                </div>
                                <div class="col-md-3">
                                    <label class="font-weight-bold">{{$tc('common.format')}}: </label>
                                    <select class="form-control" v-model="dataSource.format">
                                        <option v-for="fmt in formats" v-bind:value="fmt" :key="fmt">{{fmt}}</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="font-weight-bold">{{$t('dataSource.storage')}}:</label>
                                    <input disabled v-model="dataSource.storage.name + ' (' + dataSource.storage.type + ')'"
                                        class="form-control" />
                                    <!-- <select v-model="dataSource.storage.id" class="form-control" disabled>
                                    <option v-for="storage in storages" :key="storage.id" :value="storage.id">
                                        {{storage.name}} ({{storage.type}})
                                    </option>
                                </select> -->
                                </div>
                                <div class="col-md-6">
                                    <label>{{$tc('common.description')}}:</label>
                                    <textarea class="form-control" v-model="dataSource.description"></textarea>
                                </div>
                                <div class="col-md-3">
                                    <label>{{$t('common.tags')}}:</label>
                                    <v-select multiple :close-on-select="false" style="width: 100%" v-model="customTags"
                                        :taggable="true" class="custom">
                                        <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                    </v-select>
                                </div>
                                <div class="col-md-3">
                                    <label>{{$tc('dataSource.treatAsNull')}}: </label>
                                    <v-select multiple :close-on-select="false" style="width: 100%" v-model="customTreatAsMissing"
                                        :taggable="true" class="custom">
                                        <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                    </v-select>
                                </div>
                                <!--
                                <div class="col-md-6 mt-3 mb-3 mt-3">
                                    <b-form-checkbox v-model="dataSource.enabled">
                                        {{ $t('common.enabled') }}
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="dataSource.is_public">{{ $t('dataSource.public') }}</b-form-checkbox>
                                    <b-form-checkbox v-model="dataSource.privacy_aware">
                                        {{ $t('dataSource.privacyAware') }}
                                    </b-form-checkbox>
                                </div>
                            -->
                                <div class="col-md-6 mt-3 mb-3 mt-3" v-if="dataSource.format === 'CSV'">
                                    <b-form-checkbox v-model="dataSource.is_first_line_header">
                                        {{ $t('dataSource.isFirstLineHeader') }}
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="dataSource.is_multiline">
                                        {{ $t('dataSource.isMultiline') }}
                                    </b-form-checkbox>
                                </div>

                                <div class="col-md-12 mt-3 pb-1" v-if="dataSource.format === 'JDBC'">
                                    <label>{{$tc('common.command')}}:</label>
                                    <textarea class="form-control" v-model="dataSource.command"></textarea>
                                </div>
                                <div class="col-md-12 mt-3 mt-3 pb-1" v-if="dataSource.format === 'CSV'">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <label>{{ $t('dataSource.attributeDelimiter') }}: </label>
                                            <v-select style="width: 100%" v-model="dataSource.attribute_delimiter"
                                                :options="delimiters" :taggable="true">
                                                <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                            </v-select>
                                        </div>
                                        <div class="col-md-3">
                                            <label>{{ $t('dataSource.recordDelimiter') }}: </label>
                                            <v-select style="width: 100%" v-model="dataSource.record_delimiter"
                                                :options="delimiters" :taggable="true">
                                                <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                            </v-select>
                                        </div>
                                        <div class="col-md-3">
                                            <label>{{ $t('dataSource.textDelimiter') }}: </label>
                                            <v-select style="width: 100%" v-model="dataSource.text_delimiter" :options="textDelimiters"
                                                :taggable="true">
                                                <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                            </v-select>
                                        </div>
                                        <div class="col-md-3">
                                            <label>{{ $t('dataSource.encoding') }}: </label>
                                            <v-select style="width: 100%" v-model="dataSource.encoding" :options="encodings"
                                                :taggable="true">
                                                <span slot="no-options">{{$t('messages.noMatching')}}.</span>
                                            </v-select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab :title="$tc('dataSource.attribute', 2)">
                            <h5 class="card-title">
                                {{$tc('common.attribute', 2)}}
                            </h5>

                            <table class="table table-sm table-stripped" v-if="dataSource.attributes && dataSource.attributes.length > 0">
                                <thead>
                                    <tr>
                                        <th class="primary text-center" style="width:3%">#</th>
                                        <th class="primary text-center" style="width:30%">{{$tc('common.name')}}</th>
                                        <th class="primary text-center" style="width:12%">{{$tc('common.type')}}</th>
                                        <!--
                                        <th class="primary text-center" style="width:5%">{{$tc('common.nullable')}}</th>
                                        <th class="primary text-center" style="width:5%">{{$tc('common.size')}}</th>
                                        <th class="primary text-center" style="width:5%">{{$tc('common.precision')}}</th>
                                        <th class="primary text-center" style="width:5%">{{$tc('common.scale')}}</th>
                                        -->
                                        <th class="primary text-center" style="width:25%">{{$tc('dataSource.missingRepresentation')}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(attr, index) in dataSource.attributes" :key="attr.id">
                                        <td class="text-center">{{index + 1}}</td>
                                        <td>
                                            <input v-model="attr.name" class="form-control-sm form-control" />
                                        </td>
                                        <td>
                                            <select class="form-control-sm form-control" v-model="attr.type">
                                                <option v-for="dt in dataTypes" v-bind:value="dt" :key="dt">{{dt}}</option>
                                            </select>
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
                                            <input class="form-control-sm form-control" v-model="attr.missing_representation"
                                                maxlength="200" />
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                            <div v-else class="border-bottom mb-5 pt-3 pb-3">
                                <div class="alert alert-info">{{ $t("dataSource.noAttributes") }}</div>
                            </div>
                        </b-tab>
                        <b-tab :title="$tc('common.sharing', 2)">
                            <table class="table table-bordered table-stripped" v-if="dataSource.permissions && dataSource.permissions.length > 0">
                                <thead>
                                    <tr>
                                        <th class="primary col-md-1 text-center">{{ $t("common.userId") }}</th>
                                        <th class="primary text-center">{{ $t("common.userName") }}</th>
                                        <th class="primary text-center">{{ $t("common.userLogin") }}</th>
                                        <th class="primary text-center">{{ $tc("common.permission", 1) }}</th>
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
                            <div v-else>
                                {{ $t("dataSource.noPermissions") }}
                            </div>

                        </b-tab>
                    </b-tabs>
                    <div class="col-md-12 mb-4 border-top pt-2">
                        <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                            <font-awesome-icon icon="spinner" pulse class="icon" />
                            <span class="fa fa-save"></span> {{$tc('actions.save')}}</button>
                        <router-link :to="{name: 'dataSources'}" class="btn btn-secondary mr-1">{{$tc('actions.cancel')}}</router-link>
                        <button class="btn btn-success ml-1  btn-spinner" @click.stop="infer" v-if="canInfer">
                            <font-awesome-icon icon="spinner" pulse class="icon" /> {{$tc('dataSource.inferSchema')}}
                        </button>
                        <button class="btn btn-spinner" @click.stop="preview" :disabled="isDirty">
                            <font-awesome-icon icon="spinner" pulse class="icon" />
                            <span class="fa fa-eye"></span>
                            &nbsp;
                            <span v-text="isDirty ? $t('common.saveBeforeToEnableThis', {what: $t('common.preview')}): $t('common.preview')"></span>
                        </button>
                    </div>
                </b-card>

            </div>
            <div class="col-md-12 mx-auto border-top mt-3 pt-3" v-else>
                {{$t('common.noData')}}
            </div>
            <b-modal size="lg" ref="preview" :title="$t('common.preview')">
                {{$t('dataSource.previewExplanation', {amount: 40})}}
                <v-client-table :columns="getPreviewColumns()" :data="samples" :options="{perPage: 5, perPageValues:[5,], skin:'table-smallest table-sm table table-striped', filterable: false}"></v-client-table>
                <div v-if="previewWarnings.length">
                    <strong>{{$tc('dataSource.someAttributesMayHaveProblem', previewWarnings.length)}}:</strong>
                    {{previewWarnings.join(", ")}}
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueSelect from 'vue-select'
    import SwitchComponent from '../components/widgets/Switch.vue'
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        components: {
            'v-select': VueSelect,
            SwitchComponent,
        },
        computed: {

            inferableDataSource() {
                return ["CSV", "JDBC", "PARQUET"].includes(this.dataSource.format)
            },
            customTags: {
                get() {
                    return this.dataSource.tags ? this.dataSource.tags.split(',') : []
                },
                set(value) {
                    this.dataSource.tags = value.join(',')
                }
            },
            customTreatAsMissing: {
                get() {
                    return this.dataSource.treat_as_missing
                        ? this.dataSource.treat_as_missing.split(',') : []
                },
                set(value) {
                    this.dataSource.treat_as_missing = value.join(',')
                }
            },
            canInfer() {
                return this.dataSource.attributeDelimiter !== ''
            }
        },
        data() {
            return {
                isDirty: false,
                samples: [],
                storages: [],
                dataSource: {},
                dataTypes: ['BINARY', 'CHARACTER', 'DOUBLE', 'DECIMAL', 'DATE',
                    'DATETIME', 'FLOAT', 'INTEGER', 'LONG',
                    'TEXT', 'TIME', 'TIMESTAMP', 'VECTOR'].sort(),
                formats: ['XML_FILE', 'NETCDF4', 'HDF5', 'SHAPEFILE', 'TEXT',
                    'UNKNOWN', 'CUSTOM', 'GEO_JSON', 'JSON', 'CSV', 'PARQUET', 'PICKLE', 'JDBC'].sort(),
                delimiters: [
                    ',', ';', '.', '{tab}', '{new_line}',
                ],
                textDelimiters: ['"', "'"],
                previewWarnings: [],
                encodings: ['ISO-8859-1', 'UTF-8', 'UTF-16'],
            }
        },
        mounted() {
            let self = this
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false
                })
            })
        },
        watch: {
            '$route.params.id': function (id) {
                this.load().then(() => {
                    Vue.nextTick(() => {
                        this.isDirty = false
                    })
                })
            },
            'dataSource': {
                handler(newVal, oldVal) {
                    this.isDirty = true
                },
                deep: true
            }
        },
        /* Methods */
        methods: {
            getPreviewColumns() {
                if (this.dataSource && this.dataSource.attributes &&
                    this.dataSource.attributes.length) {
                    return this.dataSource.attributes.map((a) => a.name)
                } else if (this.samples.length) {
                    return Object.keys(this.samples[0])
                } else {
                    return []
                }
            },
            load() {
                let self = this
                return new Promise((resolve, reject) => {
                    axios.get(`${limoneroUrl}/datasources/${this.$route.params.id}`).then(
                        (resp) => {
                            self.dataSource = resp.data;
                            resolve()
                        }
                    ).catch(function (e) {
                        self.error(e);
                    });
                });
            },
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
            save(event) {
                let self = this
                let inconsistentFormat = (self.dataSource.format === 'JDBC'
                    && self.dataSource.storage.type !== 'JDBC')
                    || (self.dataSource.format !== 'JDBC' && self.dataSource.storage.type !== 'HDFS')

                if (inconsistentFormat) {
                    self.error({ message: self.$t('dataSource.inconsistentFormat') })
                    return
                }
                let url = `${limoneroUrl}/datasources/${this.dataSource.id}`
                event.target.setAttribute('disabled', 'disabled')
                event.target.classList.remove('btn-spinner')
                return axios.patch(url, this.dataSource)
                    .then((resp) => {
                        event.target.removeAttribute('disabled')
                        event.target.classList.add('btn-spinner')
                        self.dataSource = resp.data.data
                        Vue.nextTick(() => {
                            self.isDirty = false
                        })
                        self.success(
                            this.$t('messages.savedWithSuccess', { what: this.$tc('titles.dataSource', 1) }))
                    }
                    ).catch((e) => { self.error(e) })
            },
            preview(event) {
                let url = `${limoneroUrl}/datasources/sample/${this.dataSource.id}?limit=40`
                let self = this
                event.target.setAttribute('disabled', 'disabled')
                event.target.classList.remove('btn-spinner')
                axios.get(url, {})
                    .then((resp) => {
                        self.samples = resp.data.data
                        self.previewWarnings = resp.data.warnings
                        self.$refs.preview.show()
                    }
                    ).catch((e) => {
                        console.debug(e); self.error(e)
                    }
                    ).finally(() => {
                        event.target.removeAttribute('disabled')
                        event.target.classList.add('btn-spinner')
                    })
            },
            _doInfer(event){
                const self = this
                const url = `${limoneroUrl}/datasources/infer-schema/${self.dataSource.id}`
                axios.post(url, {})
                    .then((resp) => {
                        self.success(
                            this.$t('dataSource.inferSuccess'))
                        this.load()
                    }
                    ).catch((e) => {
                        console.debug(e); self.error(e)
                    }
                    ).finally(() => {
                        event.target.removeAttribute('disabled')
                        event.target.classList.add('btn-spinner')
                })
            },
            infer(event) {
                const self = this
                event.target.setAttribute('disabled', 'disabled')
                event.target.classList.remove('btn-spinner')
                if (self.isDirty) {
                    self.save(event).then(() => self._doInfer(event));
                } else {
                    self._doInfer(event);
                }
            },

        },
    }
</script>
<style>
    .v-select .dropdown-toggle::after {
        content: none
    }

    .table-smallest {
        font-size: .8em;
    }

    .table-smallest td {
        white-space: nowrap;
    }
</style>