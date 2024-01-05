<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$t('titles.model', 1)}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div v-if="model.id" class="col-md-12 col-xg-12 mx-auto">
                            <b-card>
                                <div class="row">
                                    <div class="col-md-3">
                                        <label class="font-weight-bold">{{$t('common.name')}}:</label>
                                        <input v-model="model.name" type="text" class="form-control">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="font-weight-bold">{{$t('common.class')}}:</label>
                                        <input v-model="model.class_name" disabled class="form-control">
                                    </div>
                                    <div class="col-md-2">
                                        <label class="font-weight-bold">{{$t('common.created')}}:</label>
                                        <input v-model="model.created" disabled class="form-control">
                                    </div>
                                    <div class="col-md-2">
                                        <label class="font-weight-bold">{{$t('common.type')}}:</label>
                                        <select v-model="model.type" class="form-control">
                                            <option v-for="fmt in types" :key="fmt" :value="fmt">
                                                {{$t('model.type_' + fmt)}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <label class="font-weight-bold">{{$t('model.storage')}}:</label>
                                        <input :value="model.storage.name + ' (' + model.storage.type + ')'" disabled
                                               class="form-control">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="font-weight-bold">{{$t('common.path')}}:</label>
                                        <input v-model="model.path" disabled class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-12 mt-5 mb-4 border-top pt-2">
                                    <router-link :to="{name: 'models'}" class="btn btn-secondary mr-1">
                                        {{$t('actions.cancel')}}
                                    </router-link>
                                </div>
                            </b-card>
                        </div>
                        <div v-else class="col-md-12 mx-auto border-top mt-3 pt-3">
                            {{$t('common.noData')}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
let limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    components: {
    },
    data() {
        return {
            model: {},
            types: [
                'KERAS',
                'PERFORMANCE_SPARK',
                'PERFORMANCE_KERAS',
                'SPARK_ML_CLASSIFICATION',
                'SPARK_ML_REGRESSION',
                'SPARK_MLLIB_CLASSIFICATION',
                'UNSPECIFIED'
            ]
        };
    },
    computed: {
    },
    xwatch: {
        '$route.params.id': function () {
            this.load().then(() => {
                Vue.nextTick(() => {
                    this.isDirty = false;
                });
            });
        },
    },
    mounted() {
        this.load();
    },
    /* Methods */
    methods: {
        getPreviewColumns() {
            if (
                this.model &&
                    this.model.attributes &&
                    this.model.attributes.length
            ) {
                return this.model.attributes.map(a => a.name);
            } else if (this.samples.length) {
                return Object.keys(this.samples[0]);
            } else {
                return [];
            }
        },
        async load() {
            try {
                const resp = await axios.get(`${limoneroUrl}/models/${this.$route.params.id}`);
                this.model = resp.data;
            } catch (e) {
                this.error(e);
            }

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
    }
};
</script>
<style>
    .v-select .dropdown-toggle::after {
        content: none;
    }

    .table-smallest {
        font-size: 0.8em;
    }

    .table-smallest td {
        white-space: nowrap;
    }
</style>