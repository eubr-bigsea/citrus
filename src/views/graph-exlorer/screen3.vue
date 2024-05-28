<template>
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
                      <form id="fields">
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
  
  </template>
  
  <style>
  
  #addButton{
    text-align: right;
    margin-top: 60px;
  }
  
  #fields{
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
  
  #spaceButton {
    margin-right: 10px;
    width: 90px;
  }
  
  #buttons {
    text-align: right;
    margin-top: 15px;
  }
  
  #inputs {
    width: 450px;
    margin-left: 20px;
    margin-bottom: 15px;
    height: 25px;
  }
  
  #currentStep {
    margin-left: 10px;
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
  </style>
  
  <script>
  export default {
    name: 'App'
  }
  </script>