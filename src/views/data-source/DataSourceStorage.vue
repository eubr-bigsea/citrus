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
                            <!--FIXME-->
                            <!--{{ dataSource.format === 'CSV' }}-->
                            <div v-if="dataSource.format === 'CSV'">
                                <p>
                                	<b>CSV</b><br><br>
    					<b>Importante</b>: Atualmente, a fonte de dados está armazenada usando o formato <b>CSV</b>.
    					<br><br>
    					
					Esse formato não é otimizado para leitura, processamento e espaço em disco.
					Recomenda-se que seja usado um formato mais otimizado, especialmente
					quando a fonte de dados contiver milhares de registros ou centenas de atributos.
  					O Lemonade suporta a conversão para o formato <b>Parquet</b>.<br><br>

					Você poderá posteriormente exportar a fonte de dados novamente no formato <b>CSV</b>.

  				</p>
                                <button v-on:click="convertData">Converter para Parquet</button>
                            </div>

                            <div v-if="dataSource.format === 'PARQUET'">
                            	<p>
                            		<b>Parquet</b><br><br>
    					Atualmente, a fonte de dados está armazenada usando o formato <b>Parquet</b>.<br><br>

					Esse formato já é o formato recomendado para uso no Lemonade, para ser otimizado para leitura, 					processamento e espaço em disco. Você poderá posteriormente exportar a fonte de dados novamente no 						formato CSV.

  				</p>

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
        convertData: function (event) {
            if(event){
                this.dataSource = 'PARQUET'
               //return ['PARQUET'].includes(this.dataSource.format)

            }

        }
    },
}
</script>
