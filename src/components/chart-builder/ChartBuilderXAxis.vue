<template>
    <dropdown-button v-if="hasAxis" ref="axis" size="sm" class="mt-2 me-1 float-start"
        variant="outline-secondary small-dd-title" :keep-open="true">
        <template #button-content>
            <font-awesome-icon class="me-2" prefix="fa" icon="x" />
        </template>
        <template #content>
            <b-dropdown-form v-if="hasAxis" form-class="down-drop-form">
                <div class="row axis-form">
                    <div class="col-12">
                        <b-form-group label="Título:">
                            <input v-model="xLabel" type="text" class="form-control form-control-sm">
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Limite inferior:">
                            <input v-model="xLowerBound" type="number" class="form-control form-control-sm">
                        </b-form-group>
                        <b-form-group label="Limite superior:">
                            <input v-model="xUpperBound" type="number" class="form-control form-control-sm">
                        </b-form-group>
                        <b-form-checkbox v-model="xLogScale">
                            Usar escala
                            logarítmica
                        </b-form-checkbox>
                        <b-form-checkbox v-model="xDisplay">
                            Exibir eixo
                        </b-form-checkbox>
                        <b-form-checkbox v-model="xDisplayLabel">
                            Exibir
                            título
                            do eixo
                        </b-form-checkbox>
                    </div>
                    <div class="col-6">
                     <!--
                            <b-form-group label="Multiplicar por:">
                                <b-form-input type="number" v-model.number="xMultiplier"
                                    class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                            </b-form-group>
                            <b-form-group v-if="xAttribute" label="Casas decimais:">
                                <input type="number" class="form-control form-control-sm w-50"
                                    v-model.number="xDecimal_places" max="6" min="0"
                                    debounce="500" />
                            </b-form-group>
                        -->
                        <b-form-group label="Prefixo:">
                            <input v-model="xPrefix" type="text" class="form-control form-control-sm" maxlength="20"
                                debounce="500">
                        </b-form-group>
                        <b-form-group label="Sufixo:">
                            <input v-model="xSuffix" type="text" class="form-control form-control-sm" maxlength="20"
                                debounce="500">
                        </b-form-group>
                    </div>
                </div>
            </b-dropdown-form>
            <b-dropdown-form v-else>
                <div>O tipo de gráfico não possui configurações para o eixo.</div>
            </b-dropdown-form>
        </template>
    </dropdown-button>
</template>
<script setup>

const props = defineProps({
    hasAxis: { type: Boolean, required: true },
});
const xLabel = defineModel('xLabel');
const xLowerBound = defineModel('xLowerBound');
const xUpperBound = defineModel('xUpperBound');
const xLogScale = defineModel('xLogScale');
const xDisplay = defineModel('xDisplay');
const xDisplayLabel = defineModel('xDisplayLabel');
const xPrefix = defineModel('xPrefix');
const xSuffix = defineModel('xSuffix');


</script>
<style></style>