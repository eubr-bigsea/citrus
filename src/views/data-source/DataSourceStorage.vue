<!-- eslint-disable vue/html-indent -->
<template>
    <main role="main">
        <div class="row header">
            <div class="title col-md">
                <h1>{{ $tc('titles.dataSource', 1) }} {{ dataSource?.name }}</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col-md-2">
                        <data-source-options selected="dataSourceStorage" />
                    </div>
                    <div class="col-md-10">
                        <div class="border p-4">
                            <h4>{{ $t('titles.storage') }}</h4>
                            <div v-if="dataSource && dataSource.format === 'CSV'">
                                <div>
                                    <div class="alert alert-warning">
                                        Atualmente, a fonte de dados está
                                        armazenada usando o formato <b>CSV</b>.
                                    </div>
                                    <br>
                                    <p>
                                        Esse formato não é otimizado para leitura, processamento e
                                        espaço em disco. Recomenda-se que seja usado um formato mais
                                        otimizado, especialmente quando a fonte de dados contiver
                                        milhares de registros ou centenas de atributos. O Lemonade
                                        suporta a conversão para o formato <a href="https://parquet.apache.org/"
                                            target="_blank">Parquet</a>.
                                    </p>
                                    <button @click="convert()" class="btn btn-sm btn-success">Converter para
                                        Parquet</button>
                                </div>
                            </div>
                            <div v-if="dataSource && dataSource.format === 'PARQUET'">
                                <div>
                                    <div class="alert alert-info">
                                        Atualmente, a fonte de dados está
                                        armazenada usando o formato <b><a href="https://parquet.apache.org/"
                                                target="_blank">Parquet</a></b>.
                                    </div>
                                    <p>
                                        Esse formato já é o formato recomendado para o uso do Lemonade, por ser otimizado
                                        para leitura,
                                        processamento e espaço em disco.
                                    </p>
                                </div>
                            </div>
                            Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.
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
        DataSourceOptions,
    },
    data() {
        return {
            dataSource: null,
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
        },
    },
};
</script>
