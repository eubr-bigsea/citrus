<template>
    <div class="row mb-5 pb-5">
        <div class="col-md-12 col-xl-12 mx-auto">
            <h2>{{$tc('titles.dataSource', 1)}}</h2>
        </div>
        <div class="col-md-12 col-xg-12 mx-auto" v-if="dataSource.id">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Basic information" active>
                        <div class="row">
                            <div class="col-md-6">
                                <label>{{$tc('common.name')}}: </label>
                                <input type="text" class="form-control" v-model="dataSource.name" />
                            </div>
                            <div class="col-md-2">
                                <label>{{$tc('common.format')}}: </label>
                                <select class="form-control" v-model="dataSource.format">
                                    <option v-for="fmt in formats" v-bind:value="fmt" :key="fmt">{{fmt}}</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('common.tags')}}</label>
                                <v-select multiple :close-on-select="false" style="width: 100%" v-model="customTags" :taggable="true" class="custom"><slot name="no-options">{{$t('messages.noMatching')}}.</slot></v-select>
                            </div>
                            <div class="col-md-6">
                                <label>{{$tc('common.description')}}:</label>
                                <textarea class="form-control" v-model="dataSource.description"></textarea>
                            </div>
                            <div class="col-md-6">
                                <label>{{$tc('dataSource.treatAsNull')}}: </label>
                                <v-select multiple style="width: 100%" v-model="dataSource.treat_as_missing" :taggable="true" class="custom"><slot name="no-options">{{$t('messages.noMatching')}}.</slot></v-select>
                            </div>
                            <div class="col-md-6 mt-3 mb-3 mt-3">
                                <b-form-checkbox v-model="dataSource.enabled">
                                    {{ $t('common.enabled') }}
                                </b-form-checkbox>
                                <b-form-checkbox v-model="dataSource.is_public">{{ $t('dataSource.public') }}</b-form-checkbox>
                                <b-form-checkbox v-model="dataSource.privacy_aware">
                                    {{ $t('dataSource.privacyAware') }}
                                </b-form-checkbox>
                            </div>
                            <div class="col-md-6 mt-3 mb-3 mt-3" v-if="dataSource.format === 'CSV'">
                                <b-form-checkbox v-model="dataSource.is_first_line_header">
                                    {{ $t('dataSource.isFirstLineHeader') }}
                                </b-form-checkbox>
                                <b-form-checkbox v-model="dataSource.is_multiline">
                                    {{ $t('dataSource.isMultiline') }}
                                </b-form-checkbox>
                            </div>

                            <div class="col-md-12 mb-3 mt-3 border-bottom pb-3" v-if="dataSource.format === 'JDBC'">
                                <label>{{$tc('common.command')}}:</label>
                                <textarea class="form-control" v-model="dataSource.command"></textarea>
                            </div>
                            <div class="col-md-12 mt-3 mb-3 mt-3 border-bottom pb-3" v-if="dataSource.format === 'CSV'">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label>{{ $t('dataSource.attributeDelimiter') }}: </label>
                                        <v-select style="width: 100%" v-model="dataSource.attribute_delimiter" :options="delimiters" :taggable="true"><slot name="no-options">{{$t('messages.noMatching')}}.</slot></v-select>
                                    </div>
                                    <div class="col-md-3">
                                        <label>{{ $t('dataSource.recordDelimiter') }}: </label>
                                        <v-select style="width: 100%" v-model="dataSource.record_delimiter" :options="delimiters" :taggable="true"><slot name="no-options">{{$t('messages.noMatching')}}.</slot></v-select>
                                    </div>
                                    <div class="col-md-3">
                                        <label>{{ $t('dataSource.textDelimiter') }}: </label>
                                        <v-select style="width: 100%" v-model="dataSource.text_delimiter" :options="textDelimiters" :taggable="true"><slot name="no-options">{{$t('messages.noMatching')}}.</slot></v-select>
                                    </div>
                                    <div class="col-md-3">
                                        <label>{{ $t('dataSource.encoding') }}: </label>
                                        <v-select style="width: 100%" v-model="dataSource.encoding" :options="encodings" :taggable="true"><slot name="no-options">{{$t('messages.noMatching')}}.</slot></v-select>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-12 margin-top-10">
                                <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                    <span class="fa fa-save"></span> {{$tc('actions.save')}}</button>
                                <router-link :to="{name: 'dataSources'}" class="btn btn-secondary mr-1">{{$tc('actions.cancel')}}</router-link>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Attributes">
                        <h5 class="card-title">
                            {{$tc('common.attribute', 2)}}
                        </h5>
                        <div v-if="inferableDataSource" class="border-bottom pb-3">
                            {{$t('dataSource.inferSupported', {what: dataSource.format})}}
                            <div v-if="!canInfer">
                                But, in basic information tab, you:
                                <ul>
                                    <li>Need to define the attribute separator;</li>
                                    <li>Mark "Use first line as header" if it is the case for your data source;</li>
                                    <li>Review the other delimiters, encoding and if rows are multiline.</li>
                                </ul>
                                Without this configuration, Lemonade may not work appropriately.
                            </div>
                            <button class="float-right btn-sm btn btn-success mb-2 btn-spinner" @click.stop="infer" v-if="canInfer">
                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                {{$tc('dataSource.inferSchema')}}</button>
                        </div>
                        <table class="table table-bordered table-sm table-stripped" v-if="dataSource.attributes && dataSource.attributes.length > 0">
                            <thead>
                                <tr>
                                    <th class="primary text-center" style="width:3%">#</th>
                                    <th class="primary text-center" style="width:25%">{{$tc('common.name')}}</th>
                                    <th class="primary text-center" style="width:12%">{{$tc('common.type')}}</th>
                                    <th class="primary text-center" style="width:5%">{{$tc('common.nullable')}}</th>
                                    <th class="primary text-center" style="width:5%">{{$tc('common.size')}}</th>
                                    <th class="primary text-center" style="width:5%">{{$tc('common.precision')}}</th>
                                    <th class="primary text-center" style="width:5%">{{$tc('common.scale')}}</th>
                                    <th class="primary text-center" style="width:20%">{{$tc('dataSource.missingRepresentation')}}</th>
                                    <th class="primary text-center" style="width:10%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(attr, index) in dataSource.attributes" :key="attr.id">
                                    <td class="text-center">{{index + 1}}</td>
                                    <td>
                                        <input v-model="attr.name" class="form-control" />
                                    </td>
                                    <td>
                                        <select class="form-control" v-model="attr.type">
                                            <option v-for="dt in dataTypes" v-bind:value="dt" :key="dt">{{dt}}</option>
                                        </select>
                                    </td>
                                    <td class="text-center">
                                        <SwitchComponent v-model="attr.nullable" :checked="attr.nullable"></SwitchComponent>
                                    </td>
                                    <td class="col-xs-1">
                                        <input type="number" class="form-control" maxlenght="2" v-model="attr.size" min="0" />
                                    </td>
                                    <td class="col-xs-1">
                                        <input type="number" class="form-control" maxlenght="2" v-model="attr.precision" min="0" />
                                    </td>
                                    <td class="col-xs-1">
                                        <input type="number" class="form-control" maxlenght="2" v-model="attr.scale" min="0" />
                                    </td>
                                    <td>
                                        <input class="form-control" v-model="attr.missing_representation" maxlength="200" />
                                    </td>
                                    <td>
                                        <button class="btn btn-xs" v-show="index !== 0">
                                            <span class="fa fa-chevron-up"></span>
                                        </button>
                                        <button class="btn btn-xs" v-show="index !== dataSource.attributes.length -1">
                                            <span class="fa fa-chevron-down"></span>
                                        </button>
                                        <button class="btn btn-xs">
                                            <span class="fa fa-remove"></span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="border-bottom mb-5 pt-3 pb-3">
                            <div class="alert alert-info">{{ $t("dataSource.noAttributes") }}</div>
                        </div>
                        <div class="col-md-12 margin-top-10">
                                <button class="btn btn-primary mr-1" @click.stop="save">
                                    <span class="fa fa-save"></span> {{$tc('actions.save')}}</button>
                                <router-link :to="{name: 'dataSources'}" class="btn btn-secondary mr-1">{{$tc('actions.cancel')}}</router-link>
                            </div>
                    </b-tab>
                    <b-tab title="Permissions">
                        <div class="card-title">
                            {{ $tc("common.permission", 2) }}
                        </div>
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
            </b-card>

        </div>
        <div class="col-md-12 mx-auto border-top mt-3 pt-3" v-else>
            {{$t('common.noData')}}
        </div>
    </div>
</template>

<script>
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
            inferableDataSource(){
                return ["CSV", "JDBC", "PARQUET"].includes(this.dataSource.format)
            },
            customTags: {
                get() {
                    return this.dataSource.tags ? this.dataSource.tags.split(',') : []
                },
                set(value){
                    this.dataSource.tags = value.join(',')
                }
            },
            canInfer() {
                return this.dataSource.attributeDelimiter !== ''
            }
        },
        data() {
            return {
                dataSource: {},
                dataTypes: ['BINARY', 'CHARACTER', 'DOUBLE', 'DECIMAL', 'DATE',
                    'DATETIME', 'FLOAT', 'INTEGER', 'LONG',
                    'TEXT', 'TIME', 'TIMESTAMP', 'VECTOR'].sort(),
                formats: ['XML_FILE', 'NETCDF4', 'HDF5', 'SHAPEFILE', 'TEXT',
                    'UNKNOWN', 'CUSTOM', 'JSON', 'CSV', 'PARQUET', 'PICKLE', 'JDBC'].sort(),
                delimiters: [
                    ',', ';', '.', '{tab}', '{new_line}',
                ],
                textDelimiters: ['"', "'"],
                encodings: ['ISO-8859-1', 'UTF-8', 'UTF-16'],
            }
        },
        mounted() {
            this.load()            
        },
        /* Methods */
        methods: {
            load(){
                axios.get(`${limoneroUrl}/datasources/${this.$route.params.id}`).then(
                (resp) => {
                    this.dataSource = resp.data;
                }
                ).catch(function (e) {
                    this.error(e);
                }.bind(this));
            },
            success(msg){
                this.$snotify.success(
                    msg,
                    this.$t('titles.success'),
                );
            },
            error(e){
                if (e.request && e.request.readyState === 4){
                    this.$snotify.error(
                        this.$t('errors.disconnected'), this.$t('titles.error'),
                    );
                } else {
                    this.$snotify.error(
                        e.message, this.$t('titles.error'),
                    );
                }
            },
            save(event) {
                let url = `${limoneroUrl}/datasources/${this.dataSource.id}`
                let self = this
                event.target.setAttribute('disabled', 'disabled')
                event.target.classList.remove('btn-spinner')
                axios.patch(url, this.dataSource)
                    .then((resp) => {
                        event.target.removeAttribute('disabled')
                        event.target.classList.add('btn-spinner')
                        self.success(
                            this.$t('messages.savedWithSuccess', {what: this.$tc('titles.dataSource', 1)}))
                    }
                    ).catch((e) => { self.error(e)})
            },
            infer(event){
                let url = `${limoneroUrl}/datasources/infer-schema/${this.dataSource.id}`
                let self = this
                event.target.setAttribute('disabled', 'disabled')
                event.target.classList.remove('btn-spinner')
                axios.post(url, {})
                    .then((resp) => {
                            self.success(
                                this.$t('dataSource.inferSuccess'))
                            this.load()
                            event.target.removeAttribute('disabled')
                            event.target.classList.add('btn-spinner')
                        }
                    ).catch((e) => { self.error(e)})
            }
        },
    }
</script>
<style>
    .v-select .dropdown-toggle::after {
        content: none
    }
</style>