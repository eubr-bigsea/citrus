<template lang="">
    <div>
        <div v-if="sessions" class="row">
            <div class="col-md-4 col-lg-3">
                <b-list-group>
                    <b-list-group-item v-for="session in sessions" :key="session.id" href="#"
                        class="flex-column align-items-start p-0 pl-1">
                        <div class="d-flex w-100 justify-content-between bg-light p-1">
                            <b class="mb-1">{{session.name}}</b>
                            <small>
                                {{$t('status.' + session.status)}}
                                <span :class="getClassesForDecor(session.status)"></span>
                                <button class="btn btn-sm"><span class="fa fa-ellipsis-v"></span></button>
                            </small>
                        </div>

                        <p class="mb-1 pr-1 pl-3">
                            <small>
                                <b-form-checkbox-group :options="session.runs" stacked text-field="name" />
                            </small>
                            <!--
                        <small>{{session.date | timeFromNow($locale)}}</small>
                        -->
                        </p>
                    </b-list-group-item>

                </b-list-group>
            </div>
            <div class="col-md-8 col-lg-9">
                <b-tabs align="right">
                    <b-tab title="Sessões">
                        <div class="bg-white border p-2 mt-1">
                            <h6>Sessão 1</h6>
                            <p>
                                Métrica <span class="fa fa-trophy text-secondary"></span>
                                4 modelos para treino
                                20 features
                                Link para parte de transparency e fairness?
                            </p>
                            <img src="https://topepo.github.io/caret/basic/train_plot1-1.svg" alt="">
                            Gráfico métrica por tempo
                            <b-list-group>
                                <b-list-group-item v-for="run in sessions[0].runs" :key="run.id" class="p-0 pl-2">
                                    <div class="d-flex w-100 justify-content-between bg-light p-1">
                                        <b class="mb-1">{{run.name}}</b>
                                        <small>
                                            <button class="btn btn-sm btn-danger"><span
                                                    class="fa fa-times-circle "></span> </button>
                                        </small>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <ul>
                                                <li>Grid size: 2</li>
                                                <li>Trees: 4</li>
                                                <li>Depth: 3</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            Atributos mais importantes
                                            <img src="https://i2.wp.com/cdn-images-1.medium.com/max/1024/1*XLiG4oyZyrCU5Cyf9LxL6Q.png?w=584&ssl=1"
                                                alt="" style="width: 100%; height: auto" />
                                        </div>
                                        <div class="col-md-4">
                                            <ul>
                                                <li>Número de registros para o treino: 2</li>
                                                <li>Número de registros para o teste: 4</li>
                                                <li>Duração: 3</li>
                                            </ul>
                                        </div>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </div>

                    </b-tab>
                    <b-tab title="Modelos">

                    </b-tab>
                    <b-tab title="Tabela">

                    </b-tab>
                </b-tabs>
            </div>
        </div>
        <div v-else class="row text-center">
            <div class="col-md-12 pt-5">
                <h4>Nenhum modelo treinado ainda</h4>
                Revise os parâmetros ou dispare o treino do modelo agora.
                <ul class="list-unstyled">
                    <li>Alvo: Nome</li>
                    <li>2 algoritmos</li>
                    <li>12 features selecionadas</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                sessions: [
                    {
                        name: 'Sessão 1', date: '2021-09-05', id: 1, status: 'RUNNING',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 2', date: '2021-08-02', id: 2, status: 'COMPLETED',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 3', date: '2020-09-05', id: 3, status: 'ERROR',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 4', date: '2020-09-05', id: 4, status: 'CANCELED',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 5', date: '2020-09-05', id: 5, status: 'PENDING',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                ],

            }
        },
        methods: {
            getClassesForDecor(value) {
                let result = [];
                switch (value) {
                    case 'ERROR':
                        result.push("fa fa-times-circle text-danger");
                        break;
                    case 'PENDING':
                        result.push("fa fa-pause-circle text-warning");
                        break;
                    case 'CANCELED':
                        result.push("fa fa-stop-circle text-secondary");
                        break;
                    case 'RUNNING':
                        result.push("fa fa-sync fa-spin text-primary");
                        break;
                    case 'COMPLETED':
                        result.push("fa fa-check-circle text-success");
                        break;
                    default:
                }
                result.push(value.toLowerCase());
                return result.join(' ');
            },

        },
    }
</script>
<style lang="">

</style>