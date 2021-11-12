<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.track', 2)}}</h1>
                        <div class="float-right">

                            <!--
                            <router-link :to="{name: 'addTrack'}" v-if="hasAnyPermission(['APP_EDIT']) || isAdmin"
                                class="btn btn-primary btn-lemonade-primary float-left mr-1">
                                <span class="fa fa-plus" /> {{$t('actions.addItem')}}
                            </router-link>
                            -->
                            <!--
                            <button class="btn btn-outline-secondary mr-1" :disabled="display === 'large'"
                                @click="show('large')">
                                <span class="fa fa-th"></span>
                            </button>

                            <button class="btn btn-outline-secondary" :disabled="display === 'small'"
                                @click="show('small')">
                                <span class="fa fa-list"></span>
                            </button>
                        -->
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12" v-if="display==='large'">
                            <div class=" track">
                                <div v-for="item in items" class="track-item" :title="item.description">
                                    <b-dropdown variant="light" class="track-item-dropdown">
                                        <b-dropdown-item :to="{name: 'trackParameter', params: {id: item.id}}">
                                            Visualizar</b-dropdown-item>
                                        <b-dropdown-item v-if="hasAnyPermission(['APP_EDIT']) || isAdmin"
                                            :to="{name: 'editWorkflow', params: {id: item.id, platform: item.platform.id}}">
                                            Editar</b-dropdown-item>
                                        <b-dropdown-item :to="{name: 'trackParameter', params: {id: item.id}}">
                                            Execuções anteriores</b-dropdown-item>
                                    </b-dropdown>
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

                                <div slot="beforeTable" class="ml-2">
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><span class="fa fa-search"></span></span>
                                        </div>
                                        <input v-focus type="text" class="form-control" :placeholder="$t('track.whichTrack')"
                                            maxlength="60" @input="query" v-model="search">
                                    </div>
                                </div>
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
                                <template slot="updated" slot-scope="props">{{props.row.updated |
                                    formatJsonDate}}</template>
                                <!--
                                <template slot="actions" slot-scope="props">
                                    
                                    <router-link :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                        <span class="btn btn-sm btn-info mr-1">
                                            <font-awesome-icon icon="eye"></font-awesome-icon>
                                        </span>
                                    </router-link>

                                    <router-link v-if="hasAnyPermission(['APP_EDIT']) || isAdmin"
                                        :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                        <span class="btn btn-sm btn-warning mr-1"
                                            :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                            <font-awesome-icon icon="pen"></font-awesome-icon>
                                        </span>
                                    </router-link>

                                    <router-link :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                        <span class="btn btn-sm btn-primary"
                                            :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                            <font-awesome-icon icon="history"></font-awesome-icon>
                                        </span>
                                    </router-link>

                                </template>
                                -->
                            </v-server-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    import { debounce } from '../util.js';

    import VCarousel from '../components/Carousel';
    import Pagination from 'vue-pagination-2';
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const LIST_OF_FIELDS = 'id,name,updated,user,version,description,publishing_status,image,platform';
    export default {
        mixins: [Notifier],
        components: {
            'v-carousel': VCarousel,
            'pagination': Pagination,
        },
        data() {
            return {
                records: 0,
                display: 'small',
                search: '',
                items: [],
                page: 1,
                columns: [
                    //'image',
                    'name',
                    'updated',
                    //'actions'
                ],
                customQueries: {}

            };
        },
        computed: {
            ...mapGetters(['hasAnyRole', 'hasAnyPermission', 'isAdmin', 'isManager', 'isMonitor', 'user']),
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
                        actions: this.$tc('common.action', 2)
                    },
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    sortable: ['name', 'updated'],
                    preserveState: false,
                    saveState: true,
                    filterable: false,
                    filterByColumn: false,
                    hidePerPageSelect: true,
                    requestFunction: function (data) {
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.name = self.customQueries['name'];
                        self.page = data.page;
                        data.fields = LIST_OF_FIELDS;

                        let url = `${tahitiUrl}/workflows?enabled=1&track=1&published=1`;
                        self.$Progress.start();
                        return axios
                            .get(url, {
                                params: data
                            })
                            .then(resp => {
                                self.items = resp.data.data;
                                self.records = resp.data.pagination.total;
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
            this.search = this.$refs.trackPanelList.customQueries['name'];
            //this.init();
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
            query: debounce(function () {
                if (this.display === 'large') {
                    this.init();
                } else {
                    // This is not working
                    // Event.$emit('vue-tables.workflowList.filter::platform', v);
                    // Event.$emit('vue-tables.filter::platform', v);

                    // This works, but it uses internal details of component
                    const table = this.$refs.trackPanelList;
                    table.customQueries['name'] = this.search;
                    table.updateState('customQueries', table.customQueries);
                    table.getData();

                    this.$refs.trackPanelList.refresh();
                }
            }, 800),
            init() {
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
            border: 1px #aaa solid;
            border-radius: 4px;
            padding: 10px;
            position: relative;

            .track-item-dropdown {
                position: absolute;
                right: 0;
                top: 0;
            }


            .img {
                height: 160px;
            }

            .text {
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
        padding: 2px;

        height: 50px;
        width: 50px;
        background-size: cover;
        background-position: center;
        border: 2px solid #eee;
        border-radius: 15px;
    }

    .paginationx {
        width: 400px;
        margin: 0 auto;
    }

    /*
    tr td:nth-child(1) {
        width: 60px;
    }*/
</style>