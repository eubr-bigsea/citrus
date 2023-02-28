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
                        <div class="col-md-9" id="panel_storage">
                            <div class="row">
                                <div class="col-md-1" id="formato_msg">
                                    <p>Formato:</p>
                                </div>
                                <div class="col-md-11" id="csv_msg" v-if="dataSource.format == CSV">
                                    <p><strong>CSV</strong></p>
                                    <p><strong>Importante: </strong>Atualmente,
                                    a fonte de dados está armazenada usando 
                                    o formato <strong>CSV</strong></p>
                                    <p><br>Esse formato não é otimizado para a leitura, processamento e espaço em disco. Recomenda-se que seja usado um formato mais otimizado, especialmente quando a fonte de dados contiver milhares de registros ou centenas de atributos. O Lemonade suporta a conversão para o formato <Strong><u>Parquet</u></Strong>.</p>
                                    <p><br>Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.</p>
                                    <button id="btn_conversor" @click="converter">Converter para Parquet</button>
                                </div>
                                <div class="col-md-11" id="parquet_msg" v-else>
                                    <p><strong>Parquet</strong></p>
                                    <p>Atualmente, a fonte de dados está armazenada usando o formato <strong>Parquet</strong>.</p>
                                    <p><br>Este formato já é o formato recomendado para uso no Lemonade, por ser otimizado para leitura, processamento e espaço em disco.</p>
                                    <p>Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.</p>
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
        
        converter(){
            this.dataSource.format = 'PARQUET';
        }
    },
}
</script>

<style scoped>
    #panel_storage{
        border: 1px solid rgb(218, 218, 218);
        border-radius: 5px;
    }

    #formato_msg{
        padding-top: 25px;
        padding-left: 30px;
    }

    #csv_msg{
        padding-top: 25px;
        padding-left: 20px;
    }

    #parquet_msg {
        padding-top: 25px;
        padding-left: 20px;
    }

    #btn_conversor{
        margin-bottom: 20px;
    }

</style>