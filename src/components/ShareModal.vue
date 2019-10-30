<template>
    <b-modal id="share-modal" v-model="showModal" :title="$t(`${resourceType}.shareModal.title`)" size="lg" centered>
        <div v-if="loading" class="text-center">
            <b-spinner label="Spinning"></b-spinner>
        </div>
        <div v-else>
            {{ resource.name }}
            <div id="users-table">
                <v-client-table :data="users" :columns="columns" :options="options">
                    <template slot="actions" slot-scope="props">
                        <select v-model="props.row.permission" class="form-control"
                            @change="permissionChange(props.row, $event)">
                            <option value="NONE">NONE</option>
                            <option value="READ">READ</option>
                            <option value="WRITE">WRITE</option>
                            <option v-if="isDataSource" value="MANAGE">MANAGE</option>
                            <option v-if="isWorkflow" value="EXECUTE">MANAGE</option>
                        </select>
                    </template>
                </v-client-table>
            </div>
        </div>
    </b-modal>
</template>
<script>
    import axios from 'axios';
    import lodash from 'lodash';
    import Vue from 'vue';

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;


    export default {
        components: {},
        props: {
            resourceId: {
                required: true,
                type: Number,
                default: () => {
                    return 0;
                }
            },
            allUsers: {
                required: true,
                type: Array,
                default: () => {
                    return [];
                }
            },
            resourceType: {
                required: true,
                type: String,
                default: () => {
                    return '';
                }
            }
        },
        data() {
            return {
                isDirty: false,
                loading: false,
                showModal: false,
                resource: {},
                users: [],
                columns: ['full_name', 'email', 'actions'],
                options: {
                    skin: 'table-sm table table-hover',
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-10'
                    },
                    texts: {
                        filter: this.$tc('common.filter'),
                        count: this.$t('common.pagerShowing'),
                        limit: this.$t('common.limit'),
                        noResults: this.$t('common.noData'),
                        loading: this.$t('common.loading'),
                        filterPlaceholder: this.$t('common.filterPlaceholder')
                    },
                    headings: {
                        name: this.$tc('common.name'),
                        email: this.$tc('common.email'),
                        actions: this.$tc('common.action', 2)
                    },
                    sortable: ['full_name', 'email'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    preserveState: true,
                    saveState: true
                    // see the options API
                }
            };
        },
        computed: {
            title() {
                return this.$t('roles');
            },
            isDataSource() {
                return this.resourceType == 'dataSource'
            },
            isWorkflow() {
                return this.resourceType == 'workflow'
            }
        },
        watch: {
            resourceId: function (id) {
                if (id != 0) {
                    this.load().then(() => {
                        Vue.nextTick(() => {
                            self.isDirty = false;
                        });
                    });
                }
            },
            allUsers: function (users) {
                let resource = this.resource;
                if (!lodash.isEmpty(resource)) {
                    this.loading = false;
                }
            },
        },
        mounted() { },
        methods: {
            mountUrl() {
                let baseUrl = '';
                let resourceType = this.resourceType;

                switch (resourceType) {
                    case 'dataSource':
                        baseUrl = limoneroUrl + '/datasources';
                        break;
                    case 'workflow':
                        baseUrl = limoneroUrl + '/workflows';
                        break;
                    default:
                        console.log('resource invalid');
                }
                return `${baseUrl}/${this.resourceId}`;
            },
            load() {
                let self = this;
                let url = self.mountUrl();

                return new Promise((resolve, reject) => {
                    axios
                        .get(url)
                        .then(resp => {
                            let resource = resp.data;
                            self.resource = resource;
                            let users = [];

                            self.allUsers.forEach(user => {
                                user.permission = 'NONE';
                                resource.permissions.forEach(elem => {
                                    if (elem.user_id == user.id) {
                                        user.permission = elem.permission;
                                    }
                                });

                                users.push(user);
                            });
                            self.users = users;
                            self.loading = false;
                            resolve();
                        })
                        .catch(function (e) {
                            self.loading = false;
                            self.error(e);
                        });
                });
            },
            permissionChange(user, event) {
                let self = this;

                let data = {
                    permission: event.target.value,
                    user_name: user.full_name,
                    user_login: user.email
                };

                let url = self.mountUrl() + '/permission/' + user.id;
                let method = data.permission == 'NONE' ? 'DELETE' : 'POST';
                let resourceType = this.resourceType;

                return new Promise((resolve, reject) => {
                    axios({ url, method, data })
                        .then(resp => {
                            self.loading = false;
                            let msg = this.$t(`${resourceType}.shareModal.success`);
                            this.$snotify.success(msg, this.$t('titles.success'));
                        })
                        .catch(function (e) {
                            self.loading = false;
                            self.error(e);
                        });
                });
            },
            error(e) {
                //this.$bvModal.hide('share-modal');
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
            }
        }
    };
</script>