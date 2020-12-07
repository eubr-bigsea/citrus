<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.track', 2)}}</h1>
                        <div class="float-right">
                            <button class="btn btn-outline-secondary mr-1" :disabled="display === 'large'"
                                @click="show('large')">
                                <span class="fa fa-th"></span>
                            </button>
                            <button class="btn btn-outline-secondary" :disabled="display === 'small'"
                                @click="show('small')">
                                <span class="fa fa-list"></span>
                            </button>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><span class="fa fa-search"></span></span>
                                </div>
                                <input type="text" class="form-control" :placeholder="$t('track.whichTrack')"
                                    maxlength="60" @input="query" v-model="search">
                            </div>
                        </div>
                        <div class="col-md-12" v-if="display==='large'">
                            <div class=" track">
                                <div v-for="item in items" class="track-item" :title="item.description">
                                    <div class="img text-center">
                                        <router-link :to="{name: 'trackParameter', params: {id: item.id}}">
                                            <img v-if="item.image" class="circle-image" :src="item.image"
                                                :alt="item.name" />
                                            <div v-else class="big-letter">{{item.name.substring(0, 1).toUpperCase()}}
                                            </div>
                                        </router-link>
                                    </div>
                                    <div class="text text-center">
                                        <router-link :to="{name: 'trackParameter', params: {id: item.id}}">
                                            {{item.name}}
                                        </router-link>
                                    </div>
                                    <div class="text2 text-center">
                                        <router-link :to="{name: 'trackParameter', params: {id: item.id}}">
                                            Execuções anteriores
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <pagination :records="records" v-model="page" :per-page="10" @paginate="paginate"
                                    :options="options" class="pagination">
                                </pagination>
                            </div>
                        </div>
                        <div class="col-md-12" v-else>
                            <v-server-table :columns="columns" :options="options" ref="trackPanelList"
                                name="trackPanelList" @pagination="paginate">
                                <template slot="id" slot-scope="props">
                                    <router-link :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                        {{props.row.id}}
                                    </router-link>
                                </template>
                                <template slot="image" slot-scope="props">
                                    <img v-if="props.row.image" :src="props.row.image" alt="props.row.name"
                                        class="circle-image" />
                                    <div v-else class="big-letter">
                                        {{props.row.name.substring(0, 1).toUpperCase()}}
                                    </div>
                                </template>
                                <template slot="name" slot-scope="props">
                                    <router-link :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                        {{props.row.name}}
                                    </router-link>
                                    <small v-if="props.row.description"
                                        class="break-word"><br />{{props.row.description}}</small>
                                </template>
                                <template slot="updated"
                                    slot-scope="props">{{props.row.updated | formatJsonDate}}</template>
                                <template slot="actions" slot-scope="props">
                                    <button class="btn btn-sm btn-danger" @click="remove(props.row.id)">
                                        <font-awesome-icon icon="trash"></font-awesome-icon>
                                    </button>
                                </template>
                            </v-server-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    import VCarousel from '../components/Carousel';
    import Pagination from 'vue-pagination-2';
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    export default {
        mixins: [Notifier],
        components: {
            'v-carousel': VCarousel,
            'pagination': Pagination,
        },
        data() {
            return {
                records: 0,
                display: 'large',
                search: '',
                items: [],
                page: 1,
                columns: [
                    'image',
                    'name',
                    'updated',
                ],

            };
        },
        computed: {
            options() {
                const self = this;
                return {
                    initialPage: this.page,
                    skin: 'table-sm table table-hover',
                    dateColumns: ['updated'],
                    headings: {
                        image: this.$tc('common.image'),
                        name: this.$tc('common.name'),
                        updated: this.$tc('common.updated'),
                    },

                    preserveState: false,
                    saveState: false,
                    filterable: false,
                    filterByColumn: false,
                    hidePerPageSelect: true,
                    requestFunction: function (data) {
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.name = this.$parent.search;
                        self.page = data.page;
                        data.fields = 'id,name,updated,user,description,publishing_status,image';

                        let url = `${tahitiUrl}/workflows?enabled=1&track=1&published=1`;
                        this.$Progress.start();
                        return axios
                            .get(url, {
                                params: data
                            })
                            .then(resp => {
                                self.$Progress.finish();
                                return {
                                    data: resp.data.data,
                                    count: resp.data.pagination.total
                                };
                            })
                            .catch(
                                function (e) {
                                    self.$Progress.finish();
                                    self.error(e);
                                }.bind(self)
                            );
                    },
                    texts: {
                        filter: this.$tc('common.filter'),
                        count: this.$t('common.pagerShowing'),
                        limit: this.$t('common.limit'),
                        noResults: this.$t('common.noData'),
                        loading: this.$t('common.loading'),
                        filterPlaceholder: this.$t('common.filterPlaceholder')
                    }
                }
            }
        },
        mounted() {
            this.init();
        },
        /* Methods */
        methods: {
            getPage() {
                return this.page;
            },
            paginate(page) {
                this.page = page;
                if (this.display === 'large') {
                    this.init();
                }
            },
            show(how) {
                this.display = how;
                if (how === 'large') {
                    this.init();
                }
            },
            query: _.debounce(function () {
                if (this.display === 'large') {
                    this.init();
                } else {
                    this.$refs.trackPanelList.refresh();
                }
            }, 800),
            init() {
                const self = this;
                let data = {};
                data.asc = 'true';
                data.size = 10;
                data.page = self.page;
                data.name = self.search;
                // data.name = ;
                data.fields = 'id,name,updated,user,version,description,publishing_status,image';

                let url = `${tahitiUrl}/workflows?enabled=1&track=1&published=1`;
                this.$Progress.start();
                axios
                    .get(url, {
                        params: data
                    })
                    .then(resp => {
                        this.$Progress.finish();
                        self.items = resp.data.data;
                        self.records = resp.data.pagination.total;
                        return {
                            data: resp.data.data,
                            count: resp.data.pagination ? resp.data.pagination.total :
                                resp.data.data.length,
                        };
                    })
                    .catch(
                        function (e) {
                            this.$Progress.finish();
                            this.error(e);
                        }.bind(this)
                    );

            },
            clearFilters() {
                this.$refs.workflowList.setFilter('');
                this.$refs.workflowList.customQueries = {};
            },
        },
    };
</script>
<style lang="scss">
    .track {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100%;

        .track-item {
            flex: 0 0 19.6%;
            /*grow | shrink | basis */
            height: 280px;
            margin: 5px 2px;
            border: 1px #ddd solid;
            border-radius: 4px;
            padding: 10px;


            .img {
                height: 160px;
            }

            .text {
                border-bottom: 1px solid #ddd;
                border-top: 1px solid #ddd;
                font-weight: bold;
                padding-top: 5px;
                height: 80px;

                a {
                    color: #222;
                }
            }


            .text2 {
                height: 30px;

                a {
                    color: #555;
                }

            }
        }

        .big-letter,
        .circle-image {
            height: 150px !important;
            width: 150px !important;
        }

        .big-letter {
            font-size: 80pt !important;
        }
    }

    .big-letter {
        background: #222;
        border-radius: 150px;
        color: #eee;
        font-size: 30pt;
        font-weight: bold;
        height: 48px;
        margin: 0 auto;
        text-align: center;
        width: 48px;
    }

    .circle-image {
        width: 48px;
        border: 1px solid #555;

        height: 48px;
        background-size: cover;
        background-position: center;
        border-radius: 50%;

    }

    .paginationx {
        width: 400px;
        margin: 0 auto;
    }

    tr td:nth-child(1) {
        width: 60px;
    }
</style>