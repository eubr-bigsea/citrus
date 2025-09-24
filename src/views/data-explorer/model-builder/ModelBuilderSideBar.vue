<template>
    <b-nav vertical class="model-builder-sidebar">
        <template v-for="header in menus" class="header" :key="header.name">
            <b-nav-text>
                {{ header.name }}
            </b-nav-text>
            <b-nav-item v-for="menu in header.items" :class="{ active: selected === menu.action }"
                @click.prevent="edit(menu.action)">
                {{ menu.name }}
            </b-nav-item>
        </template>
    </b-nav>
</template>
<script setup>
import { defineEmits, ref } from 'vue';

const menus = [
    {
        name: 'Entrada',
        items: [
            {
                name: 'Dados',
                action: 'target'
            },
            {
                name: 'Divisão entre treino e teste',
                action: 'data'
            },
            {
                name: 'Tarefa e métrica',
                action: 'metric'
            },
        ]
    },
    {
        name: 'Atributos (Features)',
        items: [
            {
                name: 'Seleção, alvo e ajustes',
                action: 'adjusts'
            },
            {
                name: 'Redução',
                action: 'reduction'
            },
        ]
    },
    {
        name: 'Ajustes do Modelo',
        items: [
            {
                name: 'Algoritmos e hiperparâmetros',
                action: 'algorithms'
            },
            {
                name: 'Grade de parâmetros',
                action: 'grid'
            },
        ]
    },
    {
        name: 'Avançado',
        items: [
            {
                name: 'Ambiente de processamento',
                action: 'runtime'
            },
            {
                name: 'Salvar resultados',
                action: 'save'
            },
        ]
    },
];

const props = defineProps({
    selected: { type: String, default: () => 'target' },
    supervised: { type: Boolean }
});
const emit = defineEmits(['edit']);
const edit = (item) => {
    emit('edit', item);
};

</script>
<style scoped>
.model-builder-sidebar :deep(.nav-item) {
    margin-bottom: 0px;
    padding: 0
}

.model-builder-sidebar :deep(.nav-item a) {
    color: #444;
    padding: 1px 0px 1px 10px;
    margin: 3px 0;
    font-size: .85em;
}

.model-builder-sidebar :deep(.nav-item.active a) {
    border-left: 5px solid green;
    padding-left: 5px !important;
}

.model-builder-sidebar :deep(.header) {
    color: #555;
    font-size: .9em;
    font-weight: bold;
    text-transform: uppercase;
}
</style>
