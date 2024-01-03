<template>
    <div>
        <h5>Dados</h5>
        <hr>
        <label for="">Fonte de dados:</label> &nbsp;
        <vue-select v-model="dataSource_" :filterable="false" :options="dataSourceList" label="name"
                    class="w-50"
                    @search="searchDataSource" @input="retrieveAttributes">
            <template #no-options="{ }">
                <small>Digite parte do nome pesquisar ...</small>
            </template>
            <template #option="option">
                <div class="d-center">
                    <span class="span-id">{{pad(option.id, 4, '&nbsp;')}}</span> - {{option.name}}
                </div>
            </template>
            <template #selected-option="option">
                <div class="selected d-center">
                    {{pad(option.id, 4, '&nbsp;')}} - {{option.name}}
                </div>
            </template>
        </vue-select>

        <small class="form-text text-muted mb-3">
            Fonte de dados para treino e teste do modelo. <span class="text-danger">Alterar a fonte de dados de um
                experimento
                existente pode fazer com que ele pare de funcionar!</span>
        </small>

        <!--
        <template v-if="supervisioned">
            <label class=" mt-2">Escolha o atributo alvo (rótulo):</label>
            <vue-select :options="attributes" v-model="editableLabel" :searchable="true" class="w-25" label="name"
                :reduce="(o) => o.id"/>

                TODO: adicionar um gráfico com a distribuição dos dados segundo o alvo
            </template>
        -->

        <h5 class="mt-4">
            Amostragem
        </h5>
        <hr>
        <label for="">Forma de amostragem:</label> &nbsp;
        <select id="" v-model="copy.forms.type.value" class="form-control w-50 form-control-sm">
            <option value="">
                Sem amostragem, usar todos os registros
            </option>
            <option v-for="opt in sample.operation.fieldsMap.get('type').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <small class="form-text text-muted mb-3">
            Como gerar a amostra dos dados.
        </small>

        <template v-if="copy.forms.type.value !== 'percent' && copy.forms.type.value !== ''">
            <label for="">Total de registros:</label> &nbsp;
            <input v-model="copy.forms.value.value" type="number" class="form-control form-control-sm w-25" min="1"
                   max="12">
            <small class="form-text text-muted">
                Total de registros a serem amostrados.
            </small>
        </template>
        <template v-if="copy.forms.type.value === 'percent'">
            <label for="">Percentual de registros:</label> &nbsp;
            <input v-model="copy.forms.fraction.value" type="number" class="form-control form-control-sm w-25"
                   min="0.1" max="100" step="0.1" maxlength="5">
            <small class="form-text text-muted">
                Percentual registros a serem amostrados.
            </small>
        </template>
        <template v-if="copy.forms.type.value !== 'head' && copy.forms.type.value !== ''">
            <label for="">Semente para números aleatórios (seed):</label> &nbsp;
            <input v-model="copy.forms.seed.value" type="number" class="form-control form-control-sm w-25" min="0"
                   step="1" maxlength="12">
            <small class="form-text text-muted">
                Semente usada para poder repetir o experimento.
            </small>
        </template>
    </div>
</template>
<script>
import vSelect from 'vue-select';
export default {
    components: { 'vue-select': vSelect, },
    props: {
        attributes: { type: Array, default: () => [] },
        dataSource: { type: Object, default: () => { } },
        dataSourceList: { type: Array, default: () => [] },
        label: { type: String, default: () => null },
        supervisioned: { type: Boolean },
        sample: { type: Object, default: () => null }
    },
    emits: ['search-data-source', 'retrieve-attributes', 'update-value'],
    data() {
        return {
            labelAttribute: null,
            editableLabel: null,
            dataSource_: null,
            copy: { ... this.sample }
        };
    },
    watch: {
        copy: {
            deep: true,
            handler(newValues) {
                this.$emit('update-value', newValues);
            }
        }
    },
    mounted() {
        this.editableLabel = this.label;
        this.dataSource_ = this.dataSource;
    },
    methods: {
        pad: (num, places, ch) => String(num).padStart(places, ch),
        searchDataSource(search, loading) {
            this.$emit('search-data-source', search, loading);
        },
        retrieveAttributes(ds) {
            this.$emit('retrieve-attributes', ds);
        }
    }
};
</script>
