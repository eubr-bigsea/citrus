<template>
    <div class="container">
    <div class="row">
        <div class="col">
            <div>
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.track', 2)}}</h1>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-12">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><span class="fa fa-search"></span></span>
                             </div>
                             <input type="text" class="form-control" :placeholder="$t('track.whichTrack')">
                         </div>
                </div>
                    <div class="col-md-12">
                        <b-tabs content-class="mt-3" nav-class="custom-tab">
                            <b-tab title="Recentes" active>
                                <v-carousel :items="items" class="text-center">
                                    <template v-slot:label="props">
										<router-link :to="{name: 'trackParameter', params: {id: props.item.id}}">
										{{props.item.name}}
										</router-link>
									</template>
                                    <template v-slot:image="props">
                                        <div class="text-justify m-2">
										<router-link :to="{name: 'trackParameter', params: {id: props.item.id}}">
                                            <img style="width:180px;height:auto" :src="props.item.image"/>
										</router-link>
                                        </div>
                                    </template>
                                </v-carousel>
                            </b-tab>
                            <b-tab title="Favoritos"><p>I'm the second tab</p></b-tab>
                            <b-tab title="Novos"><p>I'm a disabled tab!</p></b-tab>
                        </b-tabs>
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
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    export default {
        mixins: [Notifier],
        components: {
            'v-carousel': VCarousel
        },
        data() {
            return {
                items: [],
                columns: [
                    'id',
                    'name',
                    'publishing_status',
                    'updated',
                    'version',
                ],
                options: {
                    debounce: 800,
                    skin: 'table-sm table table-hover',
                    dateColumns: ['updated'],
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name'),
                        publishing_status: this.$tc('track.status'),
                        updated: this.$tc('common.updated'),
                        version: this.$tc('common.version'),
                    },
                    sortable: ['name', 'id', 'updated'],
                    filterable: ['name', 'id'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    preserveState: true,
                    saveState: true,
                    filterByColumn: false,
                    requestFunction: function (data) {
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.name = data.query;

                        data.fields = 'id,name,platform,updated,user,version,description,publishing_status';

                        let url = `${tahitiUrl}/workflows?enabled=1&track=1&published=1`;
                        this.$Progress.start();
                        return axios
                            .get(url, {
                                params: data
                            })
                            .then(resp => {
                                this.$Progress.finish();
                                return {
                                    data: resp.data.data,
                                    count: resp.data.pagination.total
                                };
                            })
                            .catch(
                                function (e) {
                                    this.$Progress.finish();
                                    this.error(e);
                                }.bind(this)
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
            };
        },
        mounted() {
            this.init();
        },
        /* Methods */
        methods: {
            init(){
                const self = this;
                let data = {};
                data.asc = 'true';
                data.size = 100;
                // data.name = ;
                data.fields = 'id,name,platform,updated,user,version,description,publishing_status,image';

                let url = `${tahitiUrl}/workflows?enabled=1&track=1&published=1`;
                this.$Progress.start();
                axios
                    .get(url, {
                        params: data
                    })
                    .then(resp => {
                        this.$Progress.finish();
                        self.items = resp.data.data;
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
