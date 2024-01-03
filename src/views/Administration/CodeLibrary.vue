<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$t('titles.list', {elem: 'Arquivos'})}}</h1>
                        <router-link :to="{ name: 'codeAdd' }" class="btn btn-sm btn-success">
                            {{$t('actions.addSourceCode')}}
                        </router-link>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-client-table :data="tableData" :columns="columns" :options="options" name="codeLibrary">
                                        <template #actions="{}">
                                            <button class="btn btn-sm btn-danger">
                                                <font-awesome-icon icon="trash" />
                                            </button>
                                            <router-link :to="{ name: 'codeEdit' }" class="btn btn-sm btn-primary ml-2">
                                                <font-awesome-icon icon="pen-to-square" size="lg" />
                                            </router-link>
                                        </template>
                                    </v-client-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;


export default {
    data() {
        return {
            columns: [
                "id",
                "status",
                "name",
                "created",
                "actions"
            ],
            tableData: [
                { id: 1, name: "John", age: "20" },
                { id: 2, name: "Jane", age: "24" },
                { id: 3, name: "Susan", age: "16" },
                { id: 4, name: "Chris", age: "55" },
                { id: 5, name: "Dan", age: "40" }
            ],
            options: {
                headings: {
                    id: "ID",
                    status: "Status",
                    name: "Name",
                    created: "Created",
                    actions: "Actions"
                },
                sortable: ["name", "id"],
                filterable: ["name", "id"]
            }

        };
    },



};
</script>

<style scoped>

</style>
