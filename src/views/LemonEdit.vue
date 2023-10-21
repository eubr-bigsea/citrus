<template>
    <div class="editPage-page">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom">
            <h1 class="editPage-title">
                Metafluxo
            </h1>
            <div>
                <button class="btn btn-outline-secondary float-left ml-2" @click="agendamentos">
                    <font-awesome-icon icon="fa fa-clock" /> Agendamentos
                </button>
                <button class="btn btn-outline-secondary float-left ml-2" @click="execucoes">
                    <font-awesome-icon icon="fa fa-history" /> Execuções
                </button>
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="salvar">
                    <font-awesome-icon icon="fa fa-check" /> Salvar
                </button>
            </div>
        </div>

        <div class="editPage-body">
            <div class="editPage-tabs">
                <b-tabs nav-class="custom-tab mb-0">
                    <b-tab active class="editPage-tab" :title="$tc('titles.metafluxo')">
                        <div class="edit-lemon-div-tab">
                            Metafluxo
                        </div>
                    </b-tab>
                    <b-tab class="editPage-tab" :title="$tc('titles.landingZone')">
                        Landing Zone
                    </b-tab>
                    <b-tab class="editPage-tab" :title="$tc('titles.raw')">
                        Raw
                    </b-tab>
                    <b-tab class="editPage-tab" :title="$tc('titles.stage')">
                        Stage
                    </b-tab>
                    <b-tab class="editPage-tab" :title="$tc('titles.dataset')">
                        Dataset
                    </b-tab>
                </b-tabs>
            </div>
            <div class="editPage-container">
                <div class="editPage-agendador">
                    <div class="editPage-agendador-title">
                        Agendador de tarefas
                    </div>
                    <div class="editPage-agendador-body">
                        <div class="editPage-agendador-box">
                            <div class="editPage-agendador-group">
                                <label class="editPage-label" for="identificador">Metafluxo: </label>
                                <input id="identificador" class="editPage-input" type="text"
                                       placeholder="Text input label">
                            </div>

                            <div class="editPage-agendador-group">
                                <label class="editPage-label" for="descricao">Descrição: </label>
                                <textarea id="descricao" class="editPage-textarea" type="text"
                                          placeholder="Text area label" />
                            </div>
                        </div>
                        <div class="editPage-agendador-box">
                            <p class="font-weight-bold">
                                Quando deseja que sua tarefa seja inicializada?
                            </p>
                            <b-form-radio-group>
                                <b-form-radio value="uma-vez">
                                    Uma vez
                                </b-form-radio>
                                <b-form-radio value="diariamente">
                                    Diariamente
                                </b-form-radio>
                                <b-form-radio value="semanalmente">
                                    Semanalmente
                                </b-form-radio>
                                <b-form-radio value="mensalmente">
                                    Mensalmente
                                </b-form-radio>
                            </b-form-radio-group>
                        </div>
                        <div class="editPage-agendador-box" :class="radios">
                            <p class="font-weight-bold">
                                Iniciar:
                            </p>
                            <input id="iniciar-data" class="editPage-input" type="date">
                            <input id="iniciar-hora" class="editPage-input" type="time">
                        </div>
                        <div class="editPage-agendador-box" :class="dias">
                            <p class="font-weight-bold">
                                Intervalo de repetição (dias):
                            </p>
                            <input id="repetir-dias" class="editPage-input" :class="dias" type="number"
                                   min="0">
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            radios: 'radios',
            dias: 'dias'
        };
    },
    methods: {
        agendamentos() {
            alert("Agendamentos.");
        },

        execucoes() {
            alert("Execuções.");
        },

        salvar() {
            alert("Salvo.");
        }
    }
};
</script>

<style lang="scss">

.editPage-title {
    color: #333;
    margin: 10px 0px;
}

.editPage-page {
    height: 80vh;
}

.editPage-body {
    display: flex;
    flex-direction: row;
    gap: 40px;
    height: 100%;
}

.editPage-tabs {
    display: flex;
    flex-direction: column;
    width: 40%;
}

.editPage-tab {
    display: flex;
    padding: 10px 0px;

}

.editPage-container {
    display: flex;
    flex-direction: row;
    width: 50%;
    padding: 20px;
}

.editPage-agendador {
    display: flex;
    flex-direction: column;
    height: fit-content;
}

.editPage-agendador-title {
    display: flex;
    justify-content: center;
    background-color: #86B94B;
    padding: 10px;
    font-weight: 700;
}

.editPage-agendador-body {
    display: flex;
    flex-direction: column;
    padding: 30px 30px;
    align-items: start;
    gap: 40px;
    border: 1px solid #cccccc;
}

.editPage-agendador-box {
    display: flex;
    flex-direction: column;
    width: 100%;

    &.radios {
        flex-direction: row;
        gap: 20px;
        align-items: center;
    }

    &.dias {
        flex-direction: row;
        align-items: center;
        gap: 20px;
    }
}

.editPage-agendador-group {
    display: flex;
    flex-direction: row;
    gap: 30px;
    width: 100%;
}

.editPage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
}

.editPage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;

    &.dias {
        width: 90px;
    }
}

.editPage-textarea {
    width: 100%;
    max-height: 150px;
    height: fit-content;
    padding: 12px 20px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;
}

</style>