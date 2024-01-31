<template>
    <div>
        <h5 class="border-bottom pb-3">
            Dados
        </h5>
        
        <b-form-group label="Fonte de dados:">
            <vue-select v-model="dataSource" :filterable="false" :options="dataSourceList" label="name"
                        class="w-50"
                        :reduce="(opt) => opt.id" @search="searchDataSource" @input="retrieveAttributes">
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
            <div class="form-text">
                Fonte de dados para treino e teste do modelo. <span class="text-danger">Alterar a fonte de dados de um
                    experimento existente pode fazer com que ele pare de funcionar!</span>
            </div>
        </b-form-group>

        <!--
        <template v-if="supervisioned">
            <label class=" mt-2">Escolha o atributo alvo (rótulo):</label>
            <vue-select :options="attributes" v-model="editableLabel" :searchable="true" class="w-25" label="name"
                :reduce="(o) => o.id"/>

                TODO: adicionar um gráfico com a distribuição dos dados segundo o alvo
            </template>
        -->

        <h5 class="mt-4 pb-3 border-bottom">
            Amostragem
        </h5>
        
        <b-form-group label="Forma de amostragem:">
            <select id="" v-model="type" class="form-select w-50 form-select-sm">
                <option value="">
                    Sem amostragem, usar todos os registros
                </option>
                <option v-for="opt in sample.operation.fieldsMap.get('type').values" :key="opt.key" :value="opt.key">
                    {{opt.pt}}
                </option>
            </select>
            <div class="form-text">
                Como gerar a amostra dos dados.
            </div>
        </b-form-group>

        <b-form-group label="Total de registros:" class="mt-3">
            <input v-model="value" type="number" class="form-control form-control-sm w-25" min="1">
            <div class="form-text">
                Total de registros a serem amostrados.
            </div>
        </b-form-group>

        <b-form-group label="Percentual de registros:" class="mt-3">
            <input v-model="fraction" type="number" class="form-control form-control-sm w-25" min="0.1"
                   max="100" step="0.1"
                   maxlength="5">
            <div class="form-text">
                Percentual registros a serem amostrados.
            </div>
        </b-form-group>

        <b-form-group label="Semente para números aleatórios (seed):" class="mt-3">
            <input v-model="seed" type="number" class="form-control form-control-sm w-25" min="0"
                   step="1" maxlength="12">
            <div class="form-text">
                Semente usada para poder repetir o experimento.
            </div>
        </b-form-group>
    </div>
</template>
<script setup>
import vueSelect from 'vue-select';

const dataSource = defineModel('dataSource');
const type = defineModel('type');
const value = defineModel('value');
const fraction = defineModel('fraction');
const seed = defineModel('seed');

const props = defineProps({
    attributes: { type: Array, default: () => [] },
    dataSourceList: { type: Array, default: () => [] },
    //label: { type: String, default: () => null },
    supervisioned: { type: Boolean },
    sample: { type: Object, default: () => null }
});

const emit = defineEmits(['search-data-source', 'retrieve-attributes']);

const pad = (num, places, ch) => String(num).padStart(places, ch);
const searchDataSource = (search, loading) => {
    emit('search-data-source', search, loading);
};
const retrieveAttributes = (ds) => {
    emit('retrieve-attributes', ds);
};


</script>
