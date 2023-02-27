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
                                <button v-on:click="save">Converter para Parquet</button>
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
            isDirty: false,
            samples: [],
            localStorages: [],
            dataSource: null,
            dataTypes: [
                'BINARY', 'CHARACTER', 'DOUBLE', 'DECIMAL', 'DATE', 'DATETIME',
                'FLOAT', 'INTEGER', 'LONG', 'TEXT', 'TIME', 'TIMESTAMP',
                'VECTOR'].sort(),
            formats: [
                'CSV', 'CUSTOM', 'GEO_JSON', 'HAR_IMAGE_FOLDER', 'HDF5',
                'DATA_FOLDER', 'IMAGE_FOLDER', 'HIVE', 'JDBC', 'JSON',
                'NPY', 'PARQUET', 'PICKLE', 'SAV', 'SHAPEFILE',
                'TAR_IMAGE_FOLDER', 'TEXT', 'VIDEO_FOLDER', 'UNKNOWN',
                'XML_FILE'].sort()
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

        },
        success(msg) {
            this.$snotify.success(msg, this.$t('titles.success'));
        },
        error(e) {
            if (e.name === 'NetworkError') {
                this.$snotify.error(
                    this.$t('errors.disconnected'),
                    this.$t('titles.error')
                );
            } else if (e.response && e.response.data) {
                this.$snotify.error(e.response.data.message, this.$t('titles.error'));
            } else {
                this.$snotify.error(e.message, this.$t('titles.error'));
            }
        },
        save(event) {
            const self = this;
            self.dataSource.format === 'PARQUET';
            let inconsistentFormat =
                    (self.dataSource.format === 'PARQUET' &&
                        self.dataSource.storage.type !== 'PARQUET');
            self.dataSource.attributes.forEach(attr => {
                if (attr.attribute_privacy &&
                        (!attr.attribute_privacy.anonymization_technique
                            || !attr.attribute_privacy.privacy_type)) {
                    attr.attribute_privacy = null;
                }
            });
            if (inconsistentFormat) {
                self.error({ message: self.$t('dataSource.inconsistentFormat') });
                return;
            }
            let url = `${limoneroUrl}/datasources/${this.dataSource.id}`;
            event.target.setAttribute('disabled', 'disabled');
            event.target.classList.remove('btn-spinner');
            return axios
                .patch(url, this.dataSource)
                .then(resp => {
                    event.target.removeAttribute('disabled');
                    event.target.classList.add('btn-spinner');
                    self.dataSource = resp.data.data;
                    Vue.nextTick(() => {
                        self.isDirty = false;
                    });
                    self.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$tc('titles.dataSource', 1)
                        })
                    );
                })
                .catch(e => {
                    self.error(e);
                    event.target.removeAttribute('disabled');
                    event.target.classList.add('btn-spinner');
                });
        },
    },
}
</script>
