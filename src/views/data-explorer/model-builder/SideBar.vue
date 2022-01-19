<template>
    <b-nav vertical>
        <b-nav-text class="header">Entrada</b-nav-text>
        <b-nav-item :class="{active: selected === 'target'}" @click.prevent="edit('target')">Dados</b-nav-item>
        <b-nav-item :class="{active: selected === 'data'}" @click.prevent="edit('data')">Divisão entre treino e teste
        </b-nav-item>
        <b-nav-item :class="{active: selected === 'metric'}" @click.prevent="edit('metric')">Métrica</b-nav-item>

        <b-nav-text class="header">Atributos (Features)</b-nav-text>
        <b-nav-item :class="{active: selected === 'adjusts'}" @click.prevent="edit('adjusts')">Seleção e ajustes
        </b-nav-item>
        <b-nav-item :class="{active: selected === 'generation'}" @click.prevent="edit('generation')">Geração
        </b-nav-item>
        <b-nav-item :class="{active: selected === 'reduction'}" @click.prevent="edit('reduction')">Redução</b-nav-item>

        <b-nav-text class="header">Ajustes do Modelo</b-nav-text>
        <b-nav-item :class="{active: selected === 'algorithms'}" @click.prevent="edit('algorithms')">Algoritmos e
            hiperparâmetros
        </b-nav-item>
        <b-nav-item :class="{active: selected === 'hyperparameters'}" @click.prevent="edit('hyperparameters')">Grade de
            parâmetros</b-nav-item>

        <b-nav-text class="header">Avançado</b-nav-text>
        <b-nav-item :class="{active: selected === 'weighting'}" @click.prevent="edit('weighting')">Estratégia de
            ponderação</b-nav-item>
        <b-nav-item :class="{active: selected === 'runtime'}" @click.prevent="edit('runtime')">Ambiente de processamento
        </b-nav-item>
    </b-nav>
</template>
<script>
    export default {
        name: 'model-builder-side-bar',
        props: {
            selected: { type: String, default: () => 'target' },
        },
        methods: {
            edit(item) {
                this.$emit('edit', item);
            }
        }
    }
</script>