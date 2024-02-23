<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{ $t('titles.list', { elem: 'Arquivos' }) }}</h1>
                        <router-link :to="{ name: 'codeAdd' }" class="btn btn-sm btn-success">
                            {{ $t('actions.addSourceCode') }}
                        </router-link>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    {{ options }}
                                    <v-server-table :columns="options.columns" :options="options.options" name="codeList">
                                        <template #id="props">
                                            <router-link :to="{ name: 'editDataSource', params: { id: props.row.id } }">
                                                {{ props.row.id }}
                                            </router-link>
                                        </template>
                                        <template #name="props">
                                            <router-link :to="{ name: 'editDataSource', params: { id: props.row.id } }">
                                                {{ props.row.name }}
                                            </router-link>
                                        </template>
                                        <template #actions="props">
                                            <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                                                <font-awesome-icon icon="trash" />
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
    </main>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n-bridge';
import DataTableBuilder from '../../data-table-builder.js';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const { t } = useI18n();

const columns = [
    "id",
    "name",
    "status",
    "created",
    "actions"
];
const reqFn = async (data) => {
    data.sort = data.orderBy;
    data.asc = data.ascending === 1 ? 'true' : 'false';
    data.size = data.limit;
    try {
        /*
        const resp = await axios
            .get(`${tahitiUrl}/code?enabled=true&simple=true`, {
                params: data
            });
            */
        return {
            data: [
                { id: 1, name: "John", age: "20" },
                { id: 2, name: "Jane", age: "24" },
                { id: 3, name: "Susan", age: "16" },
                { id: 4, name: "Chris", age: "55" },
                { id: 5, name: "Dan", age: "40" }
            ],
            count: 5//resp.data.pagination.total
        };
    } catch (e) {
        Vue.prototype.$snotify.error(e);
    }
}
const dtBuilder = new DataTableBuilder(t)
    .columns(...columns)
    .headings({
        actions: t('common.action', 2),
        id: 'ID',
        name: t('common.name', 1),
        created: t('common.created'),
        status: t('common.status'),
    })
    .sortable('name', 'id', 'created')
    .filterable('name')
    .requestFunction(reqFn);

const options = ref(dtBuilder.build());
</script>

<style scoped></style>
