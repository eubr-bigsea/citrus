<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Biblioteca de Códigos</h1>
            <router-link :to="{ name: 'sourceCodeAdd' }" class="btn btn-lemonade-primary btn-success">
                <font-awesome-icon icon="plus" /> {{ $t('actions.add') }}
            </router-link>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <v-server-table ref="listing" :columns="options.columns" :options="options.options"
                            name="codeList">
                            <template #id="props">
                                <router-link :to="{ name: 'sourceCodeEdit', params: { id: props.row.id } }">
                                    {{ props.row.id }}
                                </router-link>
                            </template>
                            <template #name="props">
                                <router-link :to="{ name: 'sourceCodeEdit', params: { id: props.row.id } }">
                                    {{ props.row.name }}
                                </router-link>
                            </template>
                            <template #enabled="props">
                                {{props.row.enabled ? $t('common.yes') : $t('common.no') }}
                            </template>
                            <template #actions="props">
                                <button class="btn btn-sm btn-danger" @click="remove(props.row.id)">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </template>
                        </v-server-table>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import DataTableBuilder from '@/data-table-builder.js';
import Notifier from '@/notifier.js';
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const { t } = useI18n();

const notifier = new Notifier(inject('snotify'), t);

const columns = [
    "id",
    "name",
    "enabled",
    "actions"
];
const reqFn = async (data) => {
    data.sort = data.orderBy;
    data.asc = data.ascending === 1 ? 'true' : 'false';
    data.size = data.limit;
    try {
        const resp = await axios.get(`${tahitiUrl}/source-codes`, { params: data });
        return {
            data: resp.data.data,
            count: resp.data.pagination.total
        };
    } catch (e) {
        notifier.error(e);
        return {};
    }
};
const dtBuilder = new DataTableBuilder(t)
    .columns(...columns)
    .headings({
        actions: t('common.action', 2),
        id: 'ID',
        name: t('common.name', 1),
        created: t('common.created'),
        enabled: t('common.enabled'),
    })
    .sortable('name', 'id', 'created')
    .filterable('name')
    .requestFunction(reqFn);

const options = dtBuilder.build();

const listing = ref();
const remove = async (id) => {
    try {
        notifier.confirm(t('actions.delete'), t('messages.doYouWantToDelete'), async () => {
            await axios.delete(`${tahitiUrl}/source-codes/${id}`, {});

            listing.value.refresh();
            notifier.success(t('messages.successDeletion', {
                what: 'Biblioteca de código'
            }));

        });
    } catch (e) {
        notifier.error(e);
    }
};
</script>