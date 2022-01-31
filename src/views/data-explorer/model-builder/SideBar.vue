<template>
    <div>
        <b-nav vertical class="model-builder-sidebar">
            <b-nav-text class="header">Entrada</b-nav-text>
            <b-nav-item :class="{active: selected === 'target'}" @click.prevent="edit('target')">Dados</b-nav-item>
            <b-nav-item :class="{active: selected === 'data'}" @click.prevent="edit('data')">Divisão entre treino e
                teste
            </b-nav-item>
            <b-nav-item :class="{active: selected === 'metric'}" @click.prevent="edit('metric')">Tarefa e métrica</b-nav-item>

            <b-nav-text class="header">Atributos (Features)</b-nav-text>
            <b-nav-item :class="{active: selected === 'adjusts'}" @click.prevent="edit('adjusts')">Seleção, alvo e ajustes
            </b-nav-item>
            <!--
                <b-nav-item :class="{active: selected === 'generation'}" @click.prevent="edit('generation')">Geração
                </b-nav-item>
            -->
            <b-nav-item :class="{active: selected === 'reduction'}" @click.prevent="edit('reduction')">Redução
            </b-nav-item>

            <b-nav-text class="header">Ajustes do Modelo</b-nav-text>
            <b-nav-item :class="{active: selected === 'algorithms'}" @click.prevent="edit('algorithms')">Algoritmos e
                hiperparâmetros
            </b-nav-item>
            <b-nav-item :class="{active: selected === 'hyperparameters'}" @click.prevent="edit('grid')">Grade
                de parâmetros</b-nav-item>

            <b-nav-text class="header">Avançado</b-nav-text>
            <!--
            <b-nav-item :class="{active: selected === 'weighting'}" @click.prevent="edit('weighting')">Estratégia de
                ponderação</b-nav-item>
                -->
            <b-nav-item :class="{active: selected === 'runtime'}" @click.prevent="edit('runtime')">Ambiente de
                processamento
            </b-nav-item>
        </b-nav>
    </div>
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
<style scoped>
    .model-builder-sidebar>>>.nav-item {
        margin-bottom: 0px;
        padding: 0
    }

    .model-builder-sidebar>>>.nav-item a {
        color: #444;
        padding: 1px 0px 1px 10px;
        xborder: 1px solid #222;
        margin: 3px 0;
        font-size: .85em;
    }

    .model-builder-sidebar>>>.nav-item.active a {
        border-left: 5px solid green;
        padding-left: 5px !important;
    }

    .model-builder-sidebar>>>.header {
        color: #555;
        font-size: .9em;
        font-weight: bold;
        text-transform: uppercase;
    }
</style>