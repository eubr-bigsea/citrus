<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{t('titles.project', 2)}}</h1>
            <router-link :to="{name: 'addStorage'}" class="btn btn-sm btn-outline-primary">
                {{t('actions.addItem')}}
            </router-link>
        </div>
        <div class="card">
            <div class="card-body">
                <v-server-table ref="storageList" :columns="columns" :options="options" name="storageList">
                    <template #id="props">
                        <router-link :to="{name: 'projectDetail', params: {id: props.row.id}}">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #name="props">
                        <router-link :to="{name: 'projectDetail', params: {id: props.row.id}}">
                            {{props.row.name}}
                        </router-link>
                    </template>
                    <template #type="props">
                        {{props.row.type}}
                    </template>
                    <template #enabled="props">
                        {{t(props.row.enabled ? 'common.yes': 'common.no')}}
                    </template>
                    <template #actions="props">
                        <button class="btn btn-sm btn-light" :title="t('actions.delete')" @click="remove(props.row.id)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </template>
                </v-server-table>
            </div>
        </div>
    </main>
</template>
<script>
import { useI18n } from 'vue-i18n-bridge';

import Vue from 'vue';
import axios from 'axios';
import DataTableBuilder from '../../data-table-builder.js';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    setup() {
        const { t } = useI18n();
        const reqFn = async (data) => {
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = data.limit;
            data.name = data.query;
            data.fields = 'id,name,type,enabled';

            try {
                const resp = await axios.get(
                    `${limoneroUrl}/storages?enabled=true`,
                    { params: data });
                return {
                    data: resp.data.data,
                    count: resp.data.pagination.total
                };
            } catch (e) {
                Vue.prototype.$snotify.error(e);
            }
        }
        const dtBuilder = new DataTableBuilder(t)
            .headings({
                id: 'ID',
                name: t('common.name'),
                type: t('common.type'),
                enabled: t('common.enabled'),
                actions: t('common.action', 2)
            })
            .sortable('name', 'id', 'type')
            .filterable('name', 'id')
            .columns('id', 'name', 'type', 'enabled', 'actions')
            .requestFunction(reqFn);
        return {
            ...dtBuilder.build(),
            t
        }
    }
};
</script>