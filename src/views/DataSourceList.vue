<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{$t('titles.dataSource', 2)}}</h1>
            <router-link v-if="hasAnyPermission(['DATA_SOURCE_EDIT']) || isAdmin" id="add-data-source"
                         :to="{ name: 'addDataSource' }" class="btn btn-success">
                <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
            </router-link>
        </div>
        <div class="card">
            <div class="card-body">
                <v-server-table ref="dataSourceList" :columns="columns" :options="options" name="dataSourceList">
                    <template #id="props">
                        <router-link :to="{ name: 'editDataSource', params: { id: props.row.id } }">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #name="props">
                        <router-link :to="{ name: 'editDataSource', params: { id: props.row.id } }">
                            {{props.row.name}}
                        </router-link>
                    </template>
                    <template #actions="props">
                        <div class="btn-group" role="group">
                            <button v-if="visualizable(props.row)" :title="$t('common.preview')"
                                    class="btn btn-spinner btn-primary btn-sm" @click.stop="handlePreview(props.row.id)">
                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                <font-awesome-icon icon="fa-eye" />
                            </button>
                            <a :href="getDownloadLink(props.row)" class="btn btn-sm btn-info"
                               :title="$t('actions.download')" target="_blank">
                                <font-awesome-icon icon="download" />
                            </a>
                            <a v-if="props.row.format === 'PARQUET'" :href="getDownloadLink(props.row, true)"
                               class="btn btn-sm btn-secondary" :title="$t('actions.download') + ' CSV'" target="_blank">
                                <font-awesome-icon icon="download" /> CSV
                            </a>
                            <button v-if="loggedUserIsOwnerOrAdmin(props.row)" class="btn btn-sm btn-danger"
                                    @click="remove(props.row.id)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </template>
                    <template #created="props">
                        {{$filters.formatJsonDate(props.row.created)}}
                    </template>
                    <template #tags="props">
                        <div v-if="props.row.tags">
                            <div v-for="tag in (props.row.tags || '').split(',')" :key="tag" class="badge badge-info mr-1">
                                {{tag}}
                            </div>
                        </div>
                    </template>
                </v-server-table>
                <modal-preview-data-source ref="previewWindow" />
            </div>
        </div>
    </main>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapGetters } from 'vuex';

import Vue from 'vue';
import axios from 'axios';
import Notifier from '../notifier.js';
import ModalPreviewDataSource from './modal/ModalPreviewDataSource.vue';
import DataTableBuilder from '../data-table-builder.js';
import VServerTable from '@/components/VServerTable.vue';
let limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    components: {
        ModalPreviewDataSource,
    },
    setup() {
        const preventableModal = ref(false);
        const { t } = useI18n();
        const store = Vue.prototype.$legacyStore;
        const user = store.getters.user;
        const isAdmin = user.roles.indexOf('admin') >= 0;
        const notifier = new Notifier(Vue.prototype.$snotify, t);

        //#region Listing
        const reqFn = async (data) => {
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = data.limit;
            try {
                const resp = await axios
                    .get(`${limoneroUrl}/datasources?enabled=true&simple=true`, {
                        params: data
                    });

                return {
                    data: resp.data.data,
                    count: resp.data.pagination.total
                };
            } catch (e) {
                Vue.prototype.$snotify.error(e);
            }
        };

        const columns = [
            'id',
            'name',
            'description',
            'format',
            'created',
            'user_name',
            'tags',
            'actions'
        ];
        const dtBuilder = new DataTableBuilder(t)
            .columns(...columns)
            .headings({
                actions: t('common.action', 2),
                id: 'ID',
                name: t('common.name', 1),
                description: t('common.description', 1),
                format: t('dataSource.format', 1),
                created: t('common.created'),
                tags: t('common.tags'),
                user_name: t('common.user.name')
            })
            .sortable('name', 'id', 'created')
            .filterable('name')
            .requestFunction(reqFn);
        //#endregion
        //#region Preview

        const previewWindow = ref(null);
        const handlePreview = (dataSource) => {
            /**/
            previewWindow.value.show(dataSource);
        };
        //#endregion
        const loggedUserIsOwnerOrAdmin = (dataSource) => {
            return dataSource.user_id === user.id || isAdmin;
        };
        const getPermissions = (permissions) => {
            return (
                (permissions || []).map(p => { return p.permission; }).join(', ') || 'ALL');
        };

        const dataSourceList = ref(null);
        const remove = (dataSourceId) => {
            notifier.confirm(
                t('actions.delete'),
                t('messages.doYouWantToDelete'),
                async () => {
                    const url = `${limoneroUrl}/datasources/${dataSourceId}`;
                    try {
                        await axios.delete(url);
                        notifier.success(
                            t('messages.successDeletion', {
                                what: t('titles.dataSource', 1)
                            })
                        );
                        dataSourceList.value.refresh();
                    } catch (e) {
                        notifier.error(e);
                    }
                }
            );
        };
        const getDownloadLink = (row, toCSV) => {
            return `${limoneroUrl}/datasources/public/${row.id}/download?token=${row.download_token}` +
                (toCSV ? '&to_csv=true' : '');
        };
        const visualizable = (ds) => {
            return ['JDBC', 'CSV', 'HIVE', 'PARQUET'].includes(ds.format);
        };

        return {
            ...dtBuilder.build(),
            previewWindow,
            dataSourceList,
            handlePreview,
            loggedUserIsOwnerOrAdmin,
            getPermissions,
            getDownloadLink,
            remove,
            visualizable,
            preventableModal
        };
    },
    computed: {
        ...mapGetters(['hasAnyPermission', 'isAdmin'])
    },
};
</script>