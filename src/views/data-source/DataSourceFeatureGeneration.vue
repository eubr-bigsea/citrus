<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="title">
                        <h1>{{ $tc('titles.dataSource', 1) }}</h1>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <h1 id="title">FONTE DE DADOS:</h1>
                        </div>
                        <div class="col-md-2">
                            <data-source-options selected="dataSourceFeatureGeneration" />
                        </div>
                        <div class="col-md-10">
                            <p>A <strong>geração de atributos</strong> permite que novos atributos sejam incluídos
                            à fonte de dados. Ao gerar novos atributos, uma nova fonte de dados será criada e a original,
                            mantida.</p>
                            <div>
                                <table>
                                    <tr>
                                        <th>
                                            Tipo
                                        </th>
                                        <th>
                                            Grupo
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                    <tr v-for="arr in datas" :key="arr">
                                        <modal-feature-generation :attributes="dataSource.attributes"/>
                                        <td>{{ arr.tipo }}</td>
                                        <td><strong>{{ arr.grupo }}</strong></td>
                                        <td><button type="button" data-toggle="modal" data-target="#myModal" id="modalBtn">
                                          {{ arr.action }}
                                        </button></td>
                                    </tr>
                                </table>
                            </div>
                            <form>
                                <button id="addBttn" @click.prevent="add">Adicionar</button>
                                <div>
                                <label for="subscribe">Sobrescrever existente:</label>
                                <input type="checkbox" id="subscribeChecky" name="subscribeChecky">
                                <label for="subscribeChecky">Sim</label>
                                <input type="checkbox" id="subscribeCheckn" name="subscribeCheckn">
                                <label for="subscribeCheckn">Não</label>
                               </div>
                                <button type="submit" id="subscribeBttn"> Sobrescrever </button>
                                <br><br><label for="phone" id="newDataSourcetxt">Nome da Nova Fonte de Dados:</label>
                                <input placeholder="Placeholder">
                                <br><br><button id="generationButton">Gerar</button>
                            
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
import modalFeatureGeneration from '../modal/ModalFeatureGeneration.vue'
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    components: {
        DataSourceOptions,
        modalFeatureGeneration,
    },
    data() {
        return {
            dataSource: {attributes: []},
            aggregations: {type: Array, default: () => []},
            datas: [
                {tipo: "avg", grupo: "nome", action: "edit"}
            ]
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`);
            this.dataSource = resp.data;
        },
        add() {
            this.datas.push({tipo: "avg", grupo: "nome", action: "edit"})
        }
    },
}
</script>

<style scoped>

    table, th, td{
        text-align: center;
        width: 1000px;
        margin-left: 200px;
        border: 1px solid rgb(187, 187, 187);
        border-collapse: collapse;
    }

    th, td{
        padding-top: 7px;
        padding-bottom: 7px;
    }

    p{
        margin-left: 200px;
        width: 1000px;
        margin-bottom: 20px;
    }

    form{
        margin-left: 200px;
        margin-bottom: 20px;
        margin-top: 20px;
        width: 580px;
    }

    select{
        margin-left: 40px;
        width: 200px;
        border-radius: 5px;
        height: 30px;
    }

    #newDataSourcetxt{
        margin-right: 10px;
    }

    #generationButton{
        padding: 5px 40px 5px 40px;
        border-radius: 5px;
        position:absolute;
        top: 90%;
        border: 1px solid black;
    }

    #modalBtn{
        background: transparent;
        border: none;
        color: blue;
        text-decoration: underline;
    }

    #subscribeChecky, #subscribeCheckn{
        margin-left: 10px;
        margin-right: 4px;
    }

    #subscribeBttn{
        margin-top: 12px;
        border-radius: 5px;
        padding: 5px 12px 5px 12px;
        border: 1px solid black;
    }

    #title{
        margin-left: 510px;
        margin-bottom: 20px;
    }

    #addBttn{
        margin-bottom: 12px;
        border-radius: 5px;
        padding: 5px 12px 5px 12px;
        border: 1px solid black;
    }

</style>