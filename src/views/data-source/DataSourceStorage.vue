<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="title">
                        <h1>{{ $tc('titles.dataSource', 1) }}</h1>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <data-source-options selected="dataSourceStorage" />
                        </div>
                        <div class="col-md-10">
                            <!-- {{ dataSource.format === 'CSV' }} -->
                            <div class="row border rounded mr-1 mb-1 py-3">
                                <div class="col-md-2">
                                    Formato
                                </div>
                                <div class="col-md-10">
                                    <b>{{ dataSource.format }}</b><br>
                                    
                                    <!-- roda essa parte se for CSV -->
                                    <b>Importante:</b> Atualmente, a fonte de dados está armazenada usando o formato <b>CSV</b>.<br><br>
                                    Esse formato não é otimizado para leitura, processamento e espaço em disco. Recomenda-se que seja usado um formato mais otimizado, especialmente quando a fonte de dados contiver milhares de registros ou centenas de atributos. O Lemonade suporta a conversão para o formato <b><u>Parquet</u></b>.<br><br>
                                    Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.<br><br>

                                    <input type="button" class="btn btn-primary" value="Converter para Parquet" v-on:click="convertToParquet">
                                    
                                    <br><br>    <!-- essa parte eu tiro depois -->
                                    <!-- ou roda essa parte se for Parquet -->
                                    Atualmente, a fonte de dados está armazenada usando o formato <b>Parquet</b>.<br><br>
                                    Esse formato já é o formato recomendado para uso no Lemonade, por ser otimizado para leitura, processamento e espaço em disco. <br><br>
                                    Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.

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
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    components: {
        DataSourceOptions
    },
    data() {
        return {
            dataSource: null,
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`);
            this.dataSource = resp.data;
        },
        convertToParquet() {
            dataSource.format = 'Parquet';
        },
    },
}
</script>