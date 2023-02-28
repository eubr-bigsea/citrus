<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="row">
                        <div class="title col-md-2">
                            <h1>{{ $tc('titles.dataSource', 1) }}</h1>
                        </div>

                        <div class="col-md-4">
                            <div class="row d-flex align-items-center text-secondary bg-light border rounded mx-1 p-2">
                                {{ dataSource.name }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-2">
                            <data-source-options selected="dataSourceStorage" />
                        </div>
                        <div class="col-md-10">
                            <!-- {{ dataSource.format === 'CSV' }} -->
                            <div class="row border rounded mx-1 py-3">
                                <div class="col-md-2">
                                    Formato
                                </div>
                                <div class="col-md-10">
                                    <div v-if="dataSource.format === 'CSV'">
                                        Atualmente, a fonte de dados está armazenada usando o formato <b>CSV</b>.<br><br>
                                        <b>Importante:</b> Esse formato não é otimizado para leitura, processamento e espaço em disco. Recomenda-se que seja usado um formato mais otimizado, especialmente quando a fonte de dados contiver milhares de registros ou centenas de atributos. O Lemonade suporta a conversão para o formato <b><u>Parquet</u></b>.<br><br>
                                        Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.<br><br>

                                        <input type="button" class="btn btn-primary" value="Converter para Parquet" @click="dataLoad(dataSource.name)">
                                    </div>

                                    <div v-else-if="dataSource.format === 'PARQUET'">
                                        Atualmente, a fonte de dados está armazenada usando o formato <b>Parquet</b>.<br><br>
                                        Esse formato já é o formato recomendado para uso no Lemonade, por ser otimizado para leitura, processamento e espaço em disco. <br><br>
                                        Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.
                                    </div>

                                    <div v-else>
                                        Atualmente, a fonte de dados está armazenada usando o formato <b>{{ dataSource.format }}</b>.
                                    </div>

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
        dataLoad(sourceName) {
            var sourceToConvert = new Object();
            sourceToConvert.name = sourceName;
            sourceToConvert.format = 'PARQUET';
            // console.log(sourceToConvert);
            return sourceToConvert;
        },
    },
}
</script>