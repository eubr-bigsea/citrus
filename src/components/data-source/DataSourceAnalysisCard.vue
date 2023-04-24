<template>
    <div class="analysis_card">
        <div class="analysis_card_header">
            <h6>{{info.atributte}}</h6>
            <b-dropdown id="dropdown-right" right class="m-2" variant="outline-dark">
                <b-dropdown-item href="#" @click="deleteCard">
                    Excluir
                </b-dropdown-item>
                <b-dropdown-item href="#">
                    Editar
                </b-dropdown-item>
                <b-dropdown-item href="#">
                    Atualizar
                </b-dropdown-item>
            </b-dropdown>
        </div>
        <h6>{{info.analysis}}</h6>
        <ul class="measurements">
            <li>Max:</li>
            <li>Min:</li>
            <li>Avg:</li>
            <li>Std:</li>
            <li>Median:</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: null
        }
    },
    emits: ['action'],
    methods: {
        deleteCard() {
            this.$emit('action', this.info);
        }
    }
};

</script>

<style scoped>
.analysis_card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 350px;
  border-right: 1px solid #d9dadb;
  padding: 20px;
}

.analysis_card>h6 {
  text-align: center;
}

.analysis_card_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.measurements {
  height: fit-content;
  width: 100%;
  text-decoration: none;
  list-style: none;
  text-align: start;
  padding: 0 0 0 0;
}
</style>
