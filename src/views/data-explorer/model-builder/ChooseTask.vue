<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Escolha o tipo de tarefa para o modelo</h1>
            </div>
            <hr>
            <div class="card-deck">
                <b-card class="clickable" role="button" @click="navigate('model-builder', { task: 'classification' })">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <font-awesome-layers class="fa-stack fa-3x text-danger">
                                <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                <font-awesome-icon icon="fa-project-diagram" inverse />
                            </font-awesome-layers>
                        </div>
                        <div class="col-md-9 text-center">
                            <h6>{{$t('dataExplorer.task.classification')}}</h6>
                            <small>
                                Usar dados passados para predizer novas ocorrências.
                                Detecção de fraudes, retenção de clientes, chance de venda, etc.
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable" role="button" @click="navigate('model-builder', { task: 'regression' })">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <font-awesome-layers class="fa-stack fa-3x text-info">
                                <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                <font-awesome-icon icon="fa-prescription-bottle" inverse />
                            </font-awesome-layers>
                        </div>
                        <div class="col-md-9 text-center">
                            <h6>{{$t('dataExplorer.task.regression')}}</h6>
                            <small>
                                Buscar padrões escondidos nos dados e revelar grupos de itens que compartilham
                                alguma semelhança no corportamento,
                                ou encontrar anomalia nos dados.
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable" role="button" @click="navigate('model-builder', { task: 'clustering' })">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <font-awesome-layers class="fa-stack fa-3x text-success">
                                <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                <font-awesome-icon icon="layer-group" inverse />
                            </font-awesome-layers>
                        </div>
                        <div class="col-md-9 text-center">
                            <h6>{{$t('dataExplorer.task.clustering')}}</h6>
                            <small>
                                Buscar padrões escondidos nos dados e revelar grupos de itens que compartilham
                                alguma semelhança no corportamento,
                                ou encontrar anomalia nos dados.
                            </small>
                        </div>
                    </div>
                </b-card>
            </div>
            <div v-if="false" class="card-deck mt-4">
                <b-card class="clickable" @click="navigate('model-builderl-training')">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <font-awesome-layers class="fa-stack fa-3x text-secondary">
                                <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                <font-awesome-icon icon="bug" inverse />
                            </font-awesome-layers>
                        </div>
                        <div class="col-md-9 text-center">
                            <h6>Detecção de anomalias</h6>

                            <small>
                                Buscar padrões em conjuntos de dados, transações ou operações que
                                estatisticamente não eram esperados.
                            </small>
                        </div>
                    </div>
                </b-card>


                <b-card class="clickable" @click="navigate('model-builderl-training')">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <span class="fa-stack fa-2x">
                                <font-awesome-icon icon="fas fa-circle text-secondary xtext-info fa-stack-2x" />
                                <font-awesome-icon icon="fas fa-cart-plus fa-stack-1x fa-inverse" />
                            </span>
                        </div>
                        <div class="col-md-9 text-center">
                            <h6>Mineração de padrões frequentes</h6>
                            <small>
                                Buscar padrões em conjuntos de dados, transações ou operações que
                                estatisticamente não eram esperados.
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable" @click="navigate('model-builderl-training')">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <span class="fa-stack fa-2x">
                                <font-awesome-icon icon="fas fa-circle text-secondary xtext-secondary fa-stack-2x" />
                                <font-awesome-icon icon="fas fa-crop-alt fa-stack-1x fa-inverse" />
                            </span>
                        </div>
                        <div class="col-md-9 text-center">
                            <h6>Redução de dimensionalidade / Sumarização</h6>

                            <small>
                                Usar dados passados para predizer novas ocorrências.
                                Detecção de fraudes, retenção de clientes, chance de venda, etc.
                            </small>
                        </div>
                    </div>
                </b-card>
            </div>
        </div>
        <router-link :to="{ name: 'index-explorer' }" class="btn btn-sm btn-secondary mt-4 ps-4 pe-4">
            {{$t('actions.back')}}
        </router-link>
    </main>
</template>
<!--
<template>

    <div>
                <div v-if="step === 1">
                    <h4 class="title1">Escolha a técnica</h4>
                    <div class="row">
                        <div class="col-md-4 text-secondary xtext-center">
                            <b-card title="Predição">
                                <font-awesome-icon icon="fa fa-chart-line fa-8x" />
                                <b-card-text class="task-card-text">
                                    <br/>
                                    <small></small>

                                </b-card-text>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-secondary xtext-center">
                            <b-card title="Agrupamento">
                                <font-awesome-icon icon="fa fa-code-branch fa-8x fa-rotate-90" />
                                <br/>
                                <b-card-text class="task-card-text">
                                    <small>
                                    </small>
                                </b-card-text>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-secondary xtext-center">
                            <b-card title="Padrões frequentes">
                                <font-awesome-icon icon="fa fa-cart-plus fa-8x" />
                                <br/>
                                <b-card-text class="task-card-text">
                                    <small></small>
                                </b-card-text>
                            </b-card>
                        </div>

                    </div>
                </div>
                <div v-if="step === 2">
                    <h4 class="title1">Escolha a o tipo de predição a ser feito</h4>
                    <div class="row">
                        <div class="col-md-4 text-secondary xtext-center offset-md-4 mt-3 mb-5">
                            <label>Variável-alvo do modelo:</label>
                            <select name="" id="" class="form-select">
                                <option>fraude</option>
                            </select>
                        </div>
                        <div class="col-md-4"></div>
                        <div class="offset-md-2 col-md-4 text-secondary xtext-center">
                            <b-card title="Automática">
                                <b-card-text class="task-card-text">
                                    <small>
                                        O modelo será criado automaticamente, sendo escolhido aquele que melhor atender
                                        às metricas de avaliação. Usa tecnologia conhecida como AutoML
                                        (experimental).
                                    </small>

                                </b-card-text>
                                <font-awesome-icon icon="fa fa-robot fa-8x" />
                            </b-card>
                        </div>
                        <div class="col-md-4 text-secondary xtext-center">
                            <b-card title="Especialista">
                                <b-card-text class="task-card-text">
                                    <small>
                                        Você controla como o modelo será criado, podendo {{$t('common.ok')}} os algoritmos,
                                        parâmetros, métricas e qual será
                                        o modelo a ser salvo.
                                    </small>
                                </b-card-text>
                                <font-awesome-icon icon="fa fa-rocket fa-8x" />
                            </b-card>
                        </div>
                    </div>

                </div>
                <div v-if="step === 3"></div>
            </b-card-text>
            <div class="float-end">
                <b-button v-if="step !== 1" href="#" variant="secondary" size="sm" class="me-1" @click="previous">
                    Anterior</b-button>
                <b-button href="#" variant="primary" size="sm" @click="next">Próximo</b-button>
            </div>
    </div>
</template>
-->
<script>
export default {
    methods: {
        navigate(name, params) {
            this.$router.push({ name, params });
        }
    }
};
</script>