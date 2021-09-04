<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Escolha como parametrizar a classificação</h1>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-3">
                    <b-card>
                        <label class="font-weight-bold">Escolha a fonte de dados:</label>
                        <vue-select @search="loadOptions" :filterable="false" :options="options"
                            v-model="selectedDataSource" @input="retrieveAttributes">
                            <template v-slot:no-options="{ search, searching }">
                                <small>Digite parte do nome pesquisar ...</small>
                            </template>
                            <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{ option.name }}
                                </div>
                            </template>
                            <template slot="selected-option" slot-scope="option">
                                <div class="selected d-center">
                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                </div>
                            </template>
                        </vue-select>

                        <label class="font-weight-bold mt-2">Escolha o atributo alvo (rótulo):</label>
                        <vue-select :options="attributes" v-model="selectedAttribute" :searchable="true" />
                        <hr />
                        <router-link :to="{name: 'choose-technique'}"
                            class="btn btn-sm btn-outline-secondary pl-4 pr-4 mr-2 mb-1">
                            {{$t('actions.back')}}
                        </router-link>
                        <button v-if="valid" class="btn btn-primary btn-sm">{{$t('actions.create', {type:
                            'modelo'})}}</button>
                    </b-card>
                </div>
                <div class="col-md-9">
                    <div class="card-deck1 text-center">
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <span class="fa-stack fa-3x">
                                        <span class="fas fa-circle text-info fa-stack-2x"></span>
                                        <span class="fas fa-robot fa-stack-1x fa-inverse"></span>
                                    </span>
                                    <h6>Automática</h6>
                                    <small>
                                        O modelo será criado automaticamente, sendo escolhido aquele que melhor atender
                                        às metricas de avaliação (experimental).
                                    </small>
                                </div>
                                <div class="col-md-8 text-left">
                                    <b-form-radio name="method" class="font-weight-bold" v-model="type" value="fast">
                                        Protótipo rápido
                                    </b-form-radio>
                                    <div class="description">
                                        Obtenha alguns modelos genéricos rapidamente. Útil para testes.
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="type"
                                        value="performance">Desempenho</b-form-radio>
                                    <div class="description">
                                        Crie modelos com as melhores pontuações, mas tenha paciência,
                                        pois pode demorar mais.
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="type"
                                        value="interpretable">
                                        Crie modelos interpretáveis
                                    </b-form-radio>
                                    <div class="description">
                                        Utilize modelos criados a partir de árvores de decisão e modelos
                                        lineares.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <span class="fa-stack fa-3x">
                                        <span class="fas fa-circle text- fa-stack-2x"></span>
                                        <span class="fas fa-glasses fa-stack-1x fa-inverse"></span>
                                    </span>
                                    <h6>Especialista</h6>
                                    <small>
                                        Você controla como o modelo será criado, podendo {{$t('common.ok')}} os
                                        algoritmos,
                                        parâmetros, métricas e qual será
                                        o modelo a ser salvo.
                                    </small>
                                </div>
                                <div class="col-md-8 text-left">
                                    <b-form-radio name="method" class="font-weight-bold" v-model="type" value="custom">
                                        Escolha os
                                        algoritmos</b-form-radio>
                                    <div class="description">
                                        Escolha algoritmos, hiperparâmetros, amostra e validação cruzada.
                                    </div>
                                    <b-form-radio name="method" class="font-weight-bold" v-model="type"
                                        value="use-workflow">Use um fluxo de
                                        trabalho
                                    </b-form-radio>
                                    <div class="description">
                                        Use um fluxo de trabalho existente, mas parametrize sua execução.
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="type"
                                        value="use-previous">
                                        Use uma execução
                                        anterior
                                    </b-form-radio>
                                    <div class="description">
                                        EM ANÁLISE
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="type"
                                        value="code">
                                        Crie seu próprio avaliador
                                    </b-form-radio>
                                    <div class="description">
                                        EM ANÁLISE
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<!--
<template>

    <div>
                <div v-if="step === 1">
                    <h4 class="title1">Escolha a técnica</h4>
                    <div class="row">
                        <div class="col-md-4 text-center">
                            <b-card title="Predição">
                                <span class="fa fa-chart-line fa-8x"></span>
                                <b-card-text class="task-card-text">
                                    <br/>
                                    <small></small>

                                </b-card-text>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-center">
                            <b-card title="Agrupamento">
                                <span class="fa fa-code-branch fa-8x fa-rotate-90"></span>
                                <br/>
                                <b-card-text class="task-card-text">
                                    <small>
                                    </small>
                                </b-card-text>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-center">
                            <b-card title="Padrões frequentes">
                                <span class="fa fa-cart-plus fa-8x"></span>
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
                        <div class="col-md-4 text-center offset-md-4 mt-3 mb-5">
                            <label>Variável-alvo do modelo:</label>
                            <select name="" id="" class="form-control">
                                <option>fraude</option>
                            </select>
                        </div>
                        <div class="col-md-4"></div>
                        <div class="offset-md-2 col-md-4 text-center">
                            <b-card title="Automática">
                                <b-card-text class="task-card-text">
                                    <small>
                                        O modelo será criado automaticamente, sendo escolhido aquele que melhor atender
                                        às metricas de avaliação. Usa tecnologia conhecida como AutoML
                                        (experimental).
                                    </small>

                                </b-card-text>
                                <span class="fa fa-robot fa-8x"></span>
                            </b-card>
                        </div>
                        <div class="col-md-4 text-center">
                            <b-card title="Especialista">
                                <b-card-text class="task-card-text">
                                    <small>
                                        Você controla como o modelo será criado, podendo {{$t('common.ok')}} os algoritmos,
                                        parâmetros, métricas e qual será
                                        o modelo a ser salvo.
                                    </small>
                                </b-card-text>
                                <span class="fa fa-rocket fa-8x"></span>
                            </b-card>
                        </div>
                    </div>

                </div>
                <div v-if="step === 3"></div>
            </b-card-text>
            <div class="float-right">
                <b-button v-if="step !== 1" href="#" variant="secondary" size="sm" class="mr-1" @click="previous">
                    Anterior</b-button>
                <b-button href="#" variant="primary" size="sm" @click="next">Próximo</b-button>
            </div>
    </div>
</template>
-->
<script>
    import axios from 'axios';
    import vSelect from 'vue-select';
    import Notifier from '../../mixins/Notifier';
    import { debounce } from "../../util.js";

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    export default {
        components: { 'vue-select': vSelect },
        mixins: [Notifier],
        data() {
            return {
                options: [], selectedDataSource: null,
                selectedAttribute: null,
                attributes: [], type: 'fast'
            };
        },
        computed: {
            valid() {
                return this.selectedDataSource !== null &&
                    this.selectedAttribute !== null &&
                    this.type !== null;
            }
        },
        methods: {
            pad: (num, places, ch) => String(num).padStart(places, ch),
            navigate(name) {
                this.$router.push({ name });
            },
            loadOptions: debounce(function (search, loading) {
                if (search) {
                    this.asyncLoadOptions(search, loading);
                }
            }, 800),
            async retrieveAttributes() {
                if (this.selectedDataSource) {
                    this.$Progress.start();
                    const params = {
                        fields: 'id,name,attributes'
                    };
                    try {
                        const options = await axios.get(
                            `${limoneroUrl}/datasources/${this.selectedDataSource.id}`);
                        this.attributes = options.data.attributes.map(attr => attr.name).sort();
                    } catch (e) {
                        this.error(e);
                    } finally {
                        this.$Progress.finish();
                    }
                } else {
                    this.selectedAttribute = null;
                    this.attributes = [];
                }
            },
            async asyncLoadOptions(search, loading) {
                this.$Progress.start();
                const params = {
                    sort: 'name', size: 20, name: search,
                    enabled: true, simple: true, fields: 'id,name'
                };
                try {
                    const options = await axios.get(
                        `${limoneroUrl}/datasources`, { params });
                    this.options = options.data.data;
                } catch (e) {
                    this.error(e);
                } finally {
                    this.$Progress.finish();
                    loading(false);
                }
            }
        }
    }
</script>
<style scoped>
    .custom-card {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 5px;
    }

    .description {
        font-size: .85em;
        color: #555;
    }

    .description:not(:last-child) {
        margin-bottom: 20px;
    }

    .span-id {
        display: inline-block;
        width: 30px;
        text-align: right;
    }
</style>