<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{ $t('titles.track', 2) }}</h1>
        </div>
        <div class="card">
            <div class="card-body">
                <div v-if="display === 'large'">
                    <div class=" traxck">
                        <div v-for="item in items" :key="item.id" class="track-item" :title="item.description">
                            <b-dropdown variant="light" class="track-item-dropdown">
                                <b-dropdown-item :to="{ name: 'trackParameter', params: { id: item.id } }">
                                    Visualizar
                                </b-dropdown-item>
                                <b-dropdown-item v-if="hasAnyPermission(['APP_EDIT']) || isAdmin"
                                    :to="{ name: 'editWorkflow', params: { id: item.id, platform: item.platform.id } }">
                                    {{ $t('actions.edit') }}
                                </b-dropdown-item>
                                <b-dropdown-item :to="{ name: 'trackParameter', params: { id: item.id } }">
                                    Execuções anteriores
                                </b-dropdown-item>
                            </b-dropdown>
                            <div class="img text-center">
                                <router-link :to="{ name: 'trackParameter', params: { id: item.id } }">
                                    <img v-if="item.image" class="circle-image" :src="item.image" :alt="item.name">
                                    <div v-else class="big-letter">
                                        {{ item.name.substring(0, 1).toUpperCase() }}
                                    </div>
                                </router-link>
                            </div>
                            <div class="text text-center">
                                <router-link :to="{ name: 'trackParameter', params: { id: item.id } }">
                                    {{ item.name }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <pager-component v-model="page" :records="records" :per-page="10" :options="options"
                            class="pagination" @paginate="paginate" />
                    </div>
                </div>
                <div v-else>
                    <v-server-table ref="trackPanelList" :columns="columns" :options="options" name="trackPanelList"
                        @pagination="paginate">
                        <template #beforeTable>
                            <div class="ms-2">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><font-awesome-icon icon="fa fa-search" /></span>
                                    </div>
                                    <input v-model="search" v-focus type="text" class="form-control"
                                        :placeholder="$t('track.whichTrack')" maxlength="60" @input="query">
                                </div>
                            </div>
                        </template>
                        <template #id="props">
                            <router-link :to="{ name: 'trackParameter', params: { id: props.row.id } }">
                                {{ props.row.id }}
                            </router-link>
                        </template>
                        <template #image="props">
                            <img v-if="props.row.image" :src="props.row.image" alt="props.row.name" class="circle-image">
                            <div v-else class="big-letter">
                                {{ props.row.name.substring(0, 1).toUpperCase() }}
                            </div>
                        </template>
                        <template #name="props">
                            <router-link :to="{ name: 'trackParameter', params: { id: props.row.id } }">
                                {{ props.row.name }}
                            </router-link>
                            <small v-if="props.row.description" class="break-word"><br>{{
                                props.row.description }}</small>
                        </template>
                        <template #updated="props">
                            {{ $filters.formatJsonDate(props.row.updated) }}
                        </template>
                        <!--
                                <template slot="actions" slot-scope="props">

                                    <router-link :to="{name: 'trackParameter', params: {id: props.row.id}}">
                                        <span class="btn btn-sm btn-info me-1" :title="$t('actions.view')">
                                            <font-awesome-icon icon="eye"></font-awesome-icon>
                                        </span>
                                    </router-link>

                                    <router-link v-if="hasAnyPermission(['APP_EDIT']) || isAdmin"
                                        :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                        <span class="btn btn-sm btn-warning me-1" :title="$t('actions.edit')"
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
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
import { debounce } from '../util.js';

import PagerComponent from '@/components/PagerComponent.vue';
let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const LIST_OF_FIELDS = 'id,name,updated,user,version,description,publishing_status,image,platform';
export default {
    components: {
        PagerComponent
    },
    mixins: [Notifier],
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
                skin: 'table table-hover',
                dateColumns: ['updated'],
                headings: {
                    image: this.$t('common.image'),
                    name: this.$t('common.name'),
                    updated: this.$t('common.updated'),
                    actions: this.$t('common.action', 2)
                },
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ms-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                sortable: ['name', 'updated'],
                preserveState: false,
                saveState: true,
                filterable: true,
                filterByColumn: false,
                hidePerPageSelect: true,
                requestFunction: async function (data) {
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.name = data.query; // self.customQueries['name'];
                    self.page = data.page;
                    data.fields = LIST_OF_FIELDS;

                    try {
                        let url = `${tahitiUrl}/workflows?enabled=1&track=1&published=1`;
                        const resp = await axios.get(url, { params: data });
                        self.items = resp.data.data;
                        self.records = resp.data.pagination.total;
                        return {
                            data: resp.data.data,
                            count: resp.data.pagination.total,
                            customQueries: null
                        };
                    } catch (e) {
                        self.error(e);
                    }
                },
                texts: {
                    filter: this.$t('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            };
        }
    },
    mounted() {
        //this.search = this.$refs.trackPanelList.customQueries['name'];
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