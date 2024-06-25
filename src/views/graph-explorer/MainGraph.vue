<template>
    <div>
        <v-server-table ref="verticeTypeList" :columns="columns" :options="options" name="verticeTypeList">
            <template #id="props">
                <router-link :to="{ name: 'editGraph', params: { id: props.row.id } }">
                    {{ props.row.id }}
                </router-link>
            </template>
            <template #name="props">
                <router-link :to="{ name: 'editGraph', params: { id: props.row.id } }">
                    {{ props.row.name }}
                </router-link>
            </template>
            <template #enabled="props">
                {{ $tc(props.row.enabled ? 'common.yes' : 'common.no') }}
            </template>
            <template #actions="props">
                <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                    <font-awesome-icon icon="trash" />
                </button>
            </template>
        </v-server-table>
        <!-- Entity Creation -->
        <div id="screen1">
            <div class="row">
                <div class="col bg-dark" id="navbar">
                    <a class="text-white" id="newEntityText">Nova Entidade</a>
                </div>
            </div>
            <div class="row" id="mainScreen">
                <div class="col-md-4">
                    <div id="navigationSteps">
                        <div class="row">
                            <div class="col" id="stepsText">
                                <a>Etapa</a>
                            </div>
                        </div>
                        <div class="row" id="stepsList">
                            <div class="col-12" id="currentStep">
                                <a>1. Informações básicas</a>
                            </div>
                            <div class="col-12" id="currentStep">
                                <a>2. Propriedades principais</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div id="Creation">
                        <div class="row">
                            <div class="col" id="stepsText">
                                <a>Especifique os detalhes da sua nova entidade abaixo</a>
                            </div>
                        </div>
                        <div class="row" id="stepsList">
                            <form id="fields">
                                <div class="form-group">
                                    <input type="email" class="form-control" id="inputName"
                                        placeholder="Nome da Entidade">
                                </div>
                                <div class="form-group">
                                    <input class="form-control" id="inputDescription"
                                        placeholder="Descrição da Entidade">
                                </div>
                                <div class="form-group">
                                    <input type="email" class="form-control" id="inputUniqueName"
                                        placeholder="Nome Único">
                                    <small id="emailHelp" class="form-text text-muted">Exemplo: lemonade.dev.dcc</small>
                                </div>
                                <select class="form-control" v-model="entityCategory">
                                    <option value="" disabled>Categoria</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                    </option>
                                </select>
                                <select class="form-control" v-model="entityInheritance">
                                    <option value="" disabled>Herança</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                    </option>
                                </select>
                                <div class="form-group">
                                    <label for="exampleFormControlFile1">Ícone:</label>
                                </div>
                            </form>
                            <div class="col-12" id="buttons">
                                <button type="button" class="btn btn-outline" id="spaceButton">Voltar</button>
                                <button type="button" class="btn btn-outline" id="spaceButton"
                                    @click="goToNextStep">Próximo</button>
                                <button type="button" class="btn btn-outline" id="spaceButton"
                                    @click="saveData">Concluído</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Entity Property -->
        <div id="screen1">
        <div class="row">
          <div class="col bg-dark" id="navbar">
            <a class="text-white" id="newEntityText">Nova Entidade</a>
          </div>
        </div>
        <div class="row" id="mainScreen">
          <div class="col-md-4">
            <div id="navigationSteps">
              <div class="row">
                <div class="col" id="stepsText">
                  <a>Etapa</a>
                </div>
              </div>
              <div class="row" id="stepsList">
                <div class="col-12" id="currentStep">
                  <a>1. Informações básicas</a>
                </div>
                <div class="col-12" id="currentStep">
                  <a>2. Propriedades principais</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div id="Creation">
              <div class="row">
                <div class="col" id="stepsText">
                  <a>Especifique as propriedades principais da entidade</a>
                </div>
              </div>
              <div class="row" id="stepsList">
                <form id="fields">
                  <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Usar Propriedades Herdadas</label>
                  </div>
                  <div class="form-group">
                    <input type="email" class="form-control" id="inputName" placeholder="Nome da Propriedade">
                  </div>
                  <div class="form-group">
                    <input class="form-control" id="inputDescription" placeholder="Descrição da Propriedade">
                  </div>
                  <div class="form-group">
                    <input type="email" class="form-control" id="inputRefValue" placeholder="Valor de Referência">
                  </div>
                  <div class="form-group">
                    <input type="email" class="form-control" id="inputUniqueName" placeholder="Nome Único">
                    <small id="emailHelp" class="form-text text-muted">Exemplo: lemonade.dev.dcc</small>
                  </div>
                  <select>
                    <option value="" disabled selected hidden>Tipo de Dado</option>
                    <option value="au">String</option>
                  </select>
                </form>
                <div class="col-12" id="buttons">
                  <button type="button" class="btn btn-outline" id="spaceButton">Voltar</button>
                  <button type="button" class="btn btn-outline" id="spaceButton">Próximo</button>
                  <button type="button" class="btn btn-outline" id="spaceButton">Concluído</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Extra Properties-->
      <div id="screen1">
        <div class="row">
          <div class="col bg-dark text-white" id="navbar">
            <a id="newEntityText">Nova Entidade</a>
          </div>
        </div>
        <div class="row" id="mainScreen">
          <div class="col-md-4">
            <div id="navigationSteps">
              <div class="row">
                <div class="col" id="stepsText">
                  <a>Etapa</a>
                </div>
              </div>
              <div class="row" id="stepsList">
                <div class="col-12" id="currentStep">
                  <a>1. Informações básicas</a>
                </div>
                <div class="col-12" id="currentStep">
                  <a>2. Propriedades principais</a>
                </div>
                <div class="col-12" id="currentStep">
                  <a>3. Propriedades adicionais</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div id="Creation">
              <div class="row">
                <div class="col" id="stepsText">
                  <a>Crie novas propriedades</a>
                </div>
              </div>
              <div class="row">
                <div class="col-md-5 bg-light" id="createdProperty">
                  <div class="row">
                    <div class="col-12 bg-dark text-white" id="topicName">
                      <a>Propriedades criadas</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-5 bg-light" id="newProperty">
                  <div class="row">
                    <div class="col-12 bg-dark text-white" id="topicName">
                      <a>Adicionar nova propriedade</a>
                    </div>
                  </div>
                  <div class="row" id="stepsList">
                    <div class="col-12">
                      <form id="fields-ep">
                        <div class="form-group">
                          <input type="PropertyName" class="form-control" id="inputPropertyName"
                            placeholder="Nome da Propriedade">
                        </div>
                        <div class="form-group">
                          <input class="form-control" id="inputPropertyExName" placeholder="Nome de Exibição">
                        </div>
                        <select>
                          <option value="" disabled selected hidden>Tipo de Dado</option>
                          <option value="au">String</option>
                        </select>
                      </form>
                    </div>
                    <div class="col-12" id="addButton">
                      <button type="button" class="btn btn-outline">Adicionar</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12" id="buttons">
                <button type="button" class="btn btn-outline" id="spaceButton">Voltar</button>
                <button type="button" class="btn btn-outline" id="spaceButton">Próximo</button>
                <button type="button" class="btn btn-outline" id="spaceButton">Concluído</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
</template>


<style>
#fields {
    margin-left: 40px;
    width: 450px;
}

#spaceButton {
    margin-right: 10px;
    margin-top: -5px;
}

#buttons {
    text-align: right;
}

#currentStep {
    margin-left: 10px;
    margin-bottom: 10px;
}

#stepsText {
    width: 220px;
    height: 20px;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 5px;
}

#navigationSteps {
    background-color: white;
    height: 380px;
    width: 230px;
    margin-left: 7px;
    margin-top: 7px;
}

#Creation {
    background-color: white;
    margin-top: 7px;
    margin-left: -7px;
    height: 380px;
    width: 500px;
}


#mainScreen {
    height: 400px;
    background-color: #DEDEDE;
}

#screen1 {
    width: 750px;
}

#newEntityText {
    text-align: center;
    font-size: 14px;
}

#navbar {
    height: 27px;
    text-align: center;
}

#addButton{
    text-align: right;
    margin-top: 60px;
  }

  #fields-ep{
    margin-top: 10px;
  }

  #topicName {
    height: 25px;
    font-size: 15px;
    text-align: center;
  }

  #newProperty {
    height: 275px;
    margin-left: 20px;
  }
  
  #createdProperty {
    height: 275px;
    margin-left: 32px;
  }

  #inputs {
    width: 450px;
    margin-left: 20px;
    margin-bottom: 15px;
    height: 25px;
  }
</style>

<script>

import axios from 'axios';
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    name: 'MainGraph',
    data() {
        const self = this;
        return {
            columns: ['name', 'enabled', 'actions'],
            options: {
                debounce: 800,
                headings: {
                    actions: this.$tc('common.action', 2),
                    id: 'ID',
                    name: this.$tc('common.name'),
                    enabled: this.$tc('common.enabled'),
                },
                sortable: ['name', 'enabled'],
                filterable: ['name'],
                preservateState: true,
                saveState: true,
                filterByColumn: false,
                requestFunction: function (data) {
                    data.sort = data.orderBy;
                    data.asc = data.ascending == 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.page = data.page;
                    data.query = data.query;

                    // data.fields = 'name, enabled, id';

                    let url = `${tahitiUrl}/vertice-types`;
                    this.$Progress.start();
                    return axios
                        .get(url, {
                            params: data
                        })
                        .then(resp => {
                            this.$Progress.finish();
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(function (e) {
                            self.$Progress.finish();
                            self.error(e);
                        }.bind(this));
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            }
        }
    },
    methods: {
        clearFilters() {
            this.$refs.mainGraph.setFilter('');
        },
    }
};
</script>
