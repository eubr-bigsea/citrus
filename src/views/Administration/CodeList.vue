<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>Listagem Arquivos</h1>
                        <router-link :to="{name: 'codeEdit'}"
                                     class="btn btn-sm btn-outline-primary">
                            Adicionar Código
                        </router-link>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table ref=""
                                                    :columns="columns"
                                                    :options="options"
                                                    name="codeList">
                                        
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

<script>
import axios from 'axios';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;


export default {
    data() {
        return {
            columns: [
                "status",
                "id",
                "name",
                "created",
                "actions"
            ],
            options: {
                skin: 'table-sm table table-hover',
                columnsClasses: {
                    name: 'th-20',
                    description: 'th-20',
                    actions: 'th-5 text-center',
                    status: 'th-5 text-center'
                },
                sortable: ["name", "id", "created"]
            }

        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`
            );
            this.dataSource = resp.data;
            this.atributtes = resp.data.attributes.sort(compare);
        },
       
    },

};
</script>

<style scoped>

</style>
