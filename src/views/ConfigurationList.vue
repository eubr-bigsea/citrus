<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$t('titles.configuration', 2)}}</h1>
                </div>
            </div>
            <v-server-table ref="configurationList" :columns="table.columns" :options="table.options"
                            name="configurationList">
                <template #id="props">
                    {{props.row.id}}
                </template>
                <template #name="props">
                    {{props.row.name}}
                </template>
                <template #type="props">
                    {{props.row.description}}
                </template>
                <template #category="props">
                    {{props.row.category}}
                </template>
                <template #enabled="props">
                    {{props.row.enabled ? $t('common.yes') : $t('common.no')}}
                </template>
                <template #actions="props">
                    <button class="btn btn-sm btn-light" @click="edit(props.row)">
                        <font-awesome-icon icon="edit" />
                    </button>
                </template>
            </v-server-table>
        </div>

        <b-modal id="modalConfig" ref="modalConfig" :title="currentRow ? currentRow.name : ''" size="lg">
            <div v-if="currentRow" class="row">
                <div class="col-md-12">
                    <label>{{currentRow.description}}:</label>
                </div>
                <div class="col-md-12">
                    <template v-if="currentRow.editor === 'TEXTAREA'">
                        <textarea v-model="editableValue" class="form-control text-monospace" rows="20" />
                    </template>
                    <template v-if="currentRow.editor === 'TEXT' || currentRow.editor === 'URL'">
                        <input v-model="editableValue" type="text" class="form-control text-monospace">
                    </template>
                    <template v-if="currentRow.editor === 'EMAIL'">
                        <input v-model="editableValue" type="email" class="form-control text-monospace">
                    </template>
                    <template v-if="currentRow.editor === 'PASSWORD'">
                        <input v-model="editableValue" type="password" class="form-control text-monospace">
                    </template>
                    <template v-if="currentRow.editor === 'INTEGER'">
                        <input v-model="editableValue" type="number" class="form-control text-monospace">
                    </template>
                </div>
            </div>
            <template #modal-footer>
                <div class="w-100 text-right">
                    <button class="btn btn-sm btn-outline-success" @click.prevent.stop="save">
                        <font-awesome-icon icon="fa fa-save" /> {{$t('actions.save')}}
                    </button>
                    <button class="ms-1 btn btn-sm btn-outline-dark" @click="cancel">
                        {{$t('actions.cancel')}}
                    </button>
                </div>
            </template>
        </b-modal>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

const thornUrl = import.meta.env.VITE_THORN_URL;

export default {
    mixins: [Notifier],
    data() {
        return {
            table: {
                columns: ['id', 'name', 'description', 'enabled', 'actions'],
                options: {
                    debounce: 800,
                    skin: 'table-sm table table-hover',
                    columnClasses: { actions: 'th-10' },
                    headings: {
                        id: 'ID',
                        name: this.$t('common.name'),
                        category: this.$t('common.category'),
                        type: this.$t('common.description'),
                        enabled: this.$t('common.enabled'),
                        actions: this.$t('common.action', 2)
                    },
                    sortable: ['name', 'id'],
                    filterable: ['description', 'name'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ms-10',
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

                        data.fields = 'id,name,category,description,enabled,value,editor';

                        let url = `${thornUrl}/configurations`;
                        return axios
                            .get(url, { params: data })
                            .then(resp => {
                                return {
                                    data: resp.data.data,
                                    count: resp.data.pagination.total
                                };
                            })
                            .catch(
                                function (e) {
                                    this.error(e);
                                }.bind(this)
                            );
                    },
                    texts: {
                        filter: this.$t('common.filter'),
                        count: this.$t('common.pagerShowing'),
                        limit: this.$t('common.limit'),
                        noResults: this.$t('common.noData'),
                        loading: this.$t('common.loading'),
                        filterPlaceholder: this.$t('common.filterPlaceholder')
                    }
                }
            },
            editableValue: '',
            currentRow: null,
        };
    },

    mounted() { },
    /* Methods */
    methods: {
        save(event) {
            const self = this;
            const url = `${thornUrl}/configurations`;
            event.target.setAttribute('disabled', 'disabled');
            event.target.classList.remove('btn-spinner');
            axios
                .patch(url, [{ id: self.currentRow.id, value: self.editableValue }])
                .then(() => {
                    self.currentRow.value = self.editableValue;
                    self.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$t('titles.configuration', 1)
                        })
                    );
                })
                .catch(e => self.error(e))
                .finally(() => {
                    self.cancel();
                    event.target.removeAttribute('disabled');
                    event.target.classList.add('btn-spinner');
                }
                );
            return false;

        },
        cancel() {
            this.$refs.modalConfig.hide();
        },
        edit(configuration) {
            const self = this;
            self.currentRow = configuration;
            self.editableValue = configuration.value;
            self.$refs.modalConfig.show();
        }
    },
};
</script>