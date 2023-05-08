<template>
    <div class="modal" id="myModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-5">
                                <label for="typeModal">Tipo: </label>
                                <select name="selectModal" id="selectLabelModal">
                                    <option v-for="types in editType" :key="types.value">
                                        {{ types.value }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <label for="groupModal" id="groupLabel">Grupo: </label>
                                <select name="groupModal" id="groupLabelSelect">
                                    <option v-for="attr in sortedAttributes" :value="attr.name" :key="attr.name">{{
                                        attr.name }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            editType: [
                { value: 'Soma' },
                { value: 'Média' },
                { value: 'Mínimo' },
                { value: 'Máximo' },
                { value: 'Mediana' },
                { value: 'Dia' },
                { value: 'Mês' },
                { value: 'Ano' },
                { value: 'Semana' },
                { value: 'Hora' },
                { value: 'Minuto' }
            ]
        }
    },
    name: 'modalFeatureGeneration',
    props: {
        attributes: { type: Array, default: () => [] }
    },
    computed: {
        sortedAttributes() {
            this.attributes.sort((a, b) => {
                {
                    return a.name.localeCompare(b.name)
                }
            })
            return this.attributes
        }
    },
}

</script>

<style scoped>
select {
    margin-left: 40px;
    width: 200px;
    border-radius: 5px;
    height: 30px;
}

#groupLabel {
    margin-top: 20px;
    margin-left: -2px;
}

#selectLabelModal {
    margin-left: 50px;
}
</style>