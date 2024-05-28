<template>
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
                    <input type="email" class="form-control" id="inputName" placeholder="Nome da Entidade">
                  </div>
                  <div class="form-group">
                    <input class="form-control" id="inputDescription" placeholder="Descrição da Entidade">
                  </div>
                  <div class="form-group">
                    <input type="email" class="form-control" id="inputUniqueName" placeholder="Nome Único">
                    <small id="emailHelp" class="form-text text-muted">Exemplo: lemonade.dev.dcc</small>
                  </div>
                  <select>
                    <option value="" disabled selected hidden>Categoria</option>
                    <option value="au">Pessoa</option>
                  </select>
                  <select id="currentStep">
                    <option value="" disabled selected hidden>Herança</option>
                    <option value="au">Pessoa</option>
                  </select>
                  <div class="form-group">
                    <label for="exampleFormControlFile1">Ícone:</label>
                    <input type="file" class="form-control-file" id="exampleFormControlFile1">
                  </div>
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
  </style>
  
  <script>
  export default {
    name: 'App'
  }
  </script>