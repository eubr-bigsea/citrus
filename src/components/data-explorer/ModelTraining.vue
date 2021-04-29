<template>
    <div>
        <b-card style="max-width: 1200px; margin: 0 auto;">
            <b-card-text>
                <div v-if="step === 1">
                    <h4 class="title1">Escolha a tarefa</h4>
                    <div class="row">
                        <div class="col-md-4 text-center">
                            <b-card title="Predição">
                                <b-card-text class="task-card-text">
                                    <em>Usar dados passados para predizer novas ocorrências.
                                        Detecção de fraudes, retenção de clientes, chance de venda, etc. </em>

                                </b-card-text>
                                <span class="fa fa-chart-line fa-8x"></span>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-center">
                            <b-card title="Agrupamento">
                                <b-card-text class="task-card-text">
                                    <em>Buscar padrões escondidos nos dados e revelar grupos de itens que compartilham
                                        alguma semelhança no corportamento,
                                        ou encontrar anomalia nos dados.
                                    </em>
                                </b-card-text>
                                <span class="fa fa-code-branch fa-8x fa-rotate-90"></span>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-center">
                            <b-card title="Padrões frequentes">
                                <b-card-text class="task-card-text">
                                    <em>Buscar padrões em conjuntos de dados, transações ou operações que
                                        estatisticamente não eram esperados.</em>
                                </b-card-text>
                                <span class="fa fa-cart-plus fa-8x"></span>
                            </b-card>
                        </div>

                    </div>
                </div>
                <div v-if="step === 2">
                    <h4 class="title1">Escolha a o tipo de predição a ser feito</h4>
                    <div class="row">
                        <div class="col-md-4 text-center offset-md-4 mt-2 mb-5">
                            <label>Variável-alvo do modelo:</label>
                            <select name="" id="" class="form-control">
                                <option>fraude</option>
                            </select>
                        </div>
                        <div class="col-md-4"></div>
                        <div class="offset-md-2 col-md-4 text-center">
                            <b-card title="Automática">
                                <b-card-text class="task-card-text">
                                    <em>
                                        O modelo será criado automaticamente, sendo escolhido aquele que melhor atender 
                                        às metricas de avaliação. Usa tecnologia conhecida como AutoML
                                        (experimental).
                                    </em>

                                </b-card-text>
                                <span class="fa fa-robot fa-8x"></span>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-center">
                            <b-card title="Especialista">
                                <b-card-text class="task-card-text">
                                    <em>
                                        Você controla como o modelo será criado, podendo escolher os algoritmos, parâmetros, métricas e qual será 
                                        o modelo a ser salvo.
                                    </em>
                                </b-card-text>
                                <span class="fa fa-rocket fa-8x"></span>
                            </b-card>
                        </div>
                    </div>

                </div>
                <div v-if="step === 3"></div>
            </b-card-text>
            <div class="float-right">
                <b-button v-if="step !== 1" href="#" variant="secondary" size="sm" class="mr-1"
                    @click="previous">
                    Anterior</b-button>
                <b-button href="#" variant="primary" size="sm" @click="next">Próximo</b-button>
            </div>
        </b-card>


    </div>
</template>
<script>
    export default {
        data() {
            return {
                step: 1
            }
        },
        methods: {
            next() {
                this.step++;
            },
            previous() {
                this.step--;
            }
        }
    }
</script>
<style>
    .task-card-text {
        min-height: 100px;
    }

    .title1 {
        color: slategray;
        font-size: 1.5em;
        text-align: center;
        font-weight: normal;
        font-stretch: semi-condensed;
    }
</style>