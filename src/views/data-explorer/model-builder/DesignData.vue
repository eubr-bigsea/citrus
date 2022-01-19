<template>
    <div>
        <h5>Dados</h5>
        {{label_}}, {{dataSource_}}
        <hr />
        <label for="">Fonte de dados:</label> &nbsp;
        <vue-select @search="searchDataSource" :filterable="false" :options="dataSourceList" label="name"
            v-model="dataSource_" @input="retrieveAttributes" class="w-50">

            <template v-slot:no-options="{ search, searching }">
                <small>Digite parte do nome pesquisar ...</small>
            </template>
            <template slot="option" slot-scope="option">
                <div class="d-center">
                    <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{
                    option.name }}
                </div>
            </template>
            <template slot="selected-option" slot-scope="option">
                <div class="selected d-center">
                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                </div>
            </template>
        </vue-select>

        <small class="form-text text-muted">
            Fonte de dados para treino e teste do modelo. Alterar a fonte de dados de um
            experimento
            existente pode fazer com que ele pare de funcionar!
        </small>

        <template v-if="supervisioned">
            <label class=" mt-2">Escolha o atributo alvo (rótulo):</label>
            <vue-select :options="attributes" v-model="label_" :searchable="true" class="w-25" />
            TODO: adicionar um gráfico com a distribuição dos dados segundo o alvo
        </template>

        <h6 class="mt-4">Amostragem</h6>

        <label for="">Forma de amostragem:</label> &nbsp;
        <select name="" id="" class="form-control w-50 form-control-sm">
            <option value="">Sem amostragem</option>
            <option value="">Primeiros registros</option>
            <option value="">X% aproximadamente</option>
            <option value="">Classe rebalanceadas (quantidade)</option>
            <option value="">Classe rebalanceadas (percentual)</option>
        </select>
        <small class="form-text text-muted">
            Como gerar a amostra dos dados.
        </small>

        <label for="">Total de registros:</label> &nbsp;
        <input type="number" class="form-control form-control-sm w-25">
        <small class="form-text text-muted">
            Total de registros a serem amostrados.
        </small>
    </div>
</template>
<script>
    import vSelect from 'vue-select';
    import DataSourceMixin from '../DataSourceMixin.js';
    export default {
        components: { 'vue-select': vSelect, },
        props: {
            attributes: { type: Array },
            dataSource: { type: Object },
            dataSourceList: { type: Array },
            label: { type: String },
            supervisioned: { type: Boolean },
        },
        data() {
            return {
                labelAttribute: null,
                label_: null,
                dataSource_: null,
            }
        },
        mounted() {
            this.label_ = this.label;
            this.dataSource_ = this.dataSource;
        },
        methods: {
            pad: (num, places, ch) => String(num).padStart(places, ch),
            searchDataSource(search, loading) {
                this.$emit('search-data-source', search, loading)
            },
            retrieveAttributes() {
                this.$emit('retrieve-attributes');
            }
        }
    }
</script>