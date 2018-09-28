<template>
    <div>
        <div class="row small-padding">
            <div class="col-md-12">
                <h2>{{$tc('titles.dataSource', 2)}}</h2>
            </div>
            <div class="col-md-12">

                <b-card no-body>
                    <b-tabs card>
                        <b-tab title="Basic information" active>
                            <h5 class="card-title">
                                Basic information
                            </h5>
                            <div class="row">
                                <div class="col-md-4">
                                    <label>{{$tc('common.name')}}: </label>
                                    <input type="text" class="form-control" v-model="dataSource.name" />
                                </div>
                                <div class="col-md-2">
                                    <label>{{$tc('common.format')}}: </label>
                                    <select class="form-control" v-model="dataSource.format">
                                        <option v-for="fmt in formats" v-bind:value="fmt">{{fmt}}</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <b-form-checkbox v-model="dataSource.enabled">
                                        {{ $t('common.enabled') }}
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="dataSource.is_public">{{ $t('dataSource.public') }}</b-form-checkbox>
                                    <b-form-checkbox v-model="dataSource.privacy_aware">
                                        {{ $t('dataSource.privacyAware') }}
                                    </b-form-checkbox>
                                </div>
                                <div class="col-md-2" v-if="dataSource.format === 'CSV'">
                                    <b-form-checkbox v-model="dataSource.is_first_line_header">
                                        {{ $t('dataSource.isFirstLineHeader') }}
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="dataSource.is_multiline">
                                        {{ $t('dataSource.isMultiline') }}
                                    </b-form-checkbox>
                                </div>
                                <div class="col-md-6">
                                    <label>{{$tc('common.description')}}:</label>
                                    <textarea class="form-control" v-model="dataSource.description"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label>Treat these values as null (optional): </label>
                                    <v-select multiple style="width: 100%" v-model="missing" :taggable="true"></v-select>
                                </div>

                                <div class="col-md-12" v-if="dataSource.format === 'JDBC'">
                                    <label>{{$tc('common.command')}}:</label>
                                    <textarea class="form-control" v-model="dataSource.command"></textarea>
                                </div>
                                <div class="col-md-12" v-if="dataSource.format === 'CSV'">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <label>{{ $t('dataSource.attributeDelimiter') }}: </label>
                                            <v-select style="width: 250px" v-model="dataSource.attribute_delimiter" :options="delimiters" :taggable="true"></v-select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{ $t('dataSource.recordDelimiter') }}: </label>
                                            <v-select style="width: 250px" v-model="dataSource.record_delimiter" :options="delimiters" :taggable="true"></v-select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{ $t('dataSource.textDelimiter') }}: </label>
                                            <v-select style="width: 250px" v-model="dataSource.text_delimiter" :options="textDelimiters" :taggable="true"></v-select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{ $t('dataSource.encoding') }}: </label>
                                            <v-select style="width: 100%" v-model="dataSource.encoding" :options="encodings" :taggable="true"></v-select>
                                        </div>

                                    </div>
                                </div>
                                <div class="col-md-12 margin-top-10">
                                    <button class="btn btn-primary mr-1" @click.stop="save">
                                        <span class="fa fa-save"></span> {{$tc('actions.save')}}</button>
                                    <router-link :to="{name: 'data-source-list'}" class="btn btn-secondary mr-1">{{$tc('actions.cancel')}}</router-link>

                                </div>
                            </div>
                        </b-tab>
                        <b-tab title="Attributes">
                            <h5 class="card-title">
                                {{$tc('common.attribute', 2)}}
                            </h5>
                            <div class="pull-right">
                                <button class="btn btn-success mb-2" @click.stop="infer">
                                    <span class="fa fa-database"></span> {{$tc('dataSource.inferSchema')}}</button>
                            </div>
                            <table class="table table-bordered table-stripped" v-if="dataSource.attributes && dataSource.attributes.length > 0">
                                <thead>
                                    <tr>
                                        <th class="primary text-center">#</th>
                                        <th class="primary text-center">{{$tc('common.name')}}</th>
                                        <th class="primary text-center">{{$tc('common.type')}}</th>
                                        <th class="primary text-center">{{$tc('common.nullable')}}</th>
                                        <th class="primary text-center">{{$tc('common.size')}}</th>
                                        <th class="primary text-center">{{$tc('common.precision')}}</th>
                                        <th class="primary text-center">{{$tc('common.scale')}}</th>
                                        <th class="primary text-center">{{$tc('dataSource.missingRepresentation')}}</th>
                                        <th class="primary text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(attr, index) in dataSource.attributes" track-by="attr.id">
                                        <td>{{index + 1}}</td>
                                        <td>
                                            <input v-model="attr.name" class="form-control" />
                                        </td>
                                        <td>
                                            <select class="form-control" v-model="attr.type">
                                                <option v-for="dt in dataTypes" v-bind:value="dt">{{dt}}</option>
                                            </select>
                                        </td>
                                        <td>
                                            <switches v-model="attr.nullable" type-bold="true" theme="bootstrap" color="primary"></switches>
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
                            <div v-else>
                                {{ $t("dataSource.noAttributes") }}
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
                                    <tr v-for="p in dataSource.permissions">
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
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
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
            axios.get(`${limoneroUrl}/datasources/${this.$route.params.id}`).then(
                (resp) => {
                    this.dataSource = resp.data;
                }
            ).catch(function (e) {
                this.dispatch('error', e);
            }.bind(this));
        },
        /* Methods */
        methods: {
            xt(a) {
                return a
            },
            xtc(a) {
                return a
            }
        },
    }
</script>