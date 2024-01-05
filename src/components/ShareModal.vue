<template>
    <b-modal id="share-modal"
             v-model="showModal"
             :title="$t(`${resource}.shareModal.title`)"
             size="lg"
             centered>
        <div v-if="loading"
             class="text-center">
            <b-spinner label="Spinning" />
        </div>
        <div v-else>
            {{datasource.name}}
            <div id="users-table">
                <v-client-table :data="users"
                                :columns="columns"
                                :options="options">
                    <template #actions="props">
                        <select v-model="props.row.permission"
                                class="form-control"
                                @change="permissionChange(props.row, $event)">
                            <option value="NONE">
                                NONE
                            </option>
                            <option value="READ">
                                READ
                            </option>
                            <option value="WRITE">
                                WRITE
                            </option>
                            <option value="MANAGE">
                                MANAGE
                            </option>
                        </select>
                    </template>
                </v-client-table>
            </div>
        </div>
    </b-modal>
</template>
<script>
import axios from 'axios';
import Vue from 'vue';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

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
        resource: {
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
            datasource: {},
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
                    filter: this.$t('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                },
                headings: {
                    name: this.$t('common.name'),
                    email: this.$t('common.email'),
                    actions: this.$t('common.action', 2)
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
        allUsers: function (users) {// eslint-disable-line no-unused-vars
            const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
            let datasource = this.datasource;
            if (!isEmpty(datasource)) {
                this.loading = false;
            }
        },
        users: function (users) { // eslint-disable-line no-unused-vars
            console.log(' aaa');
        }
    },
    mounted() { },
    methods: {
        mountUrl() {
            let baseUrl = '';
            let resource = this.resource;

            switch (resource) {
            case 'dataSource':
                baseUrl = limoneroUrl + '/datasources';
                break;
            default:
                console.log('resource invalid');
            }
            return `${baseUrl}/${this.resourceId}`;
        },
        load() {
            let self = this;
            let url = self.mountUrl();

            return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                axios
                    .get(url)
                    .then(resp => {
                        let datasource = resp.data;
                        self.datasource = datasource;
                        let users = [];

                        self.allUsers.forEach(user => {
                            user.permission = 'NONE';
                            datasource.permissions.forEach(elem => {
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
            let resource = this.resource;

            return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                axios({ url, method, data })
                    .then(() => {
                        self.loading = false;
                        let msg = this.$t(`${resource}.shareModal.success`);
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
