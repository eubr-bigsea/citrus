<template>
    <dropdown-button v-if="hasAxis" ref="axis" size="sm" class="mt-2 me-1 float-start"
        variant="outline-secondary small-dd-title" :keep-open="true">
        <template #button-content>
            <font-awesome-icon class="me-2" prefix="fa" icon="y" />
        </template>
        <template #content>
            <b-dropdown-form v-if="hasAxis" form-class="down-drop-form">
                <div class="row axis-form">
                    <div class="col-12">
                        <b-form-group label="Título:">
                            <input v-model="yLabel" type="text" class="form-control form-control-sm">
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Limite inferior:">
                            <input v-model="yLowerBound" type="number" class="form-control form-control-sm">
                        </b-form-group>
                        <b-form-group label="Limite superior:">
                            <input v-model="yUpperBound" type="number" class="form-control form-control-sm">
                        </b-form-group>
                        <b-form-checkbox v-model="yLogScale">
                            Usar escala
                            logarítmica
                        </b-form-checkbox>
                        <b-form-checkbox v-model="yDisplay">
                            Exibir eixo
                        </b-form-checkbox>
                        <b-form-checkbox v-model="yDisplayLabel">
                            Exibir
                            título
                            do eixo
                        </b-form-checkbox>
                    </div>
                    <div class="col-6">
                        <!--
                        <b-form-group label="Multiplicar por:">
                            <b-form-input type="number" v-model.number="yMultiplier"
                                class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                        </b-form-group>
                        <b-form-group label="Casas decimais:">
                            <input type="number" class="form-control form-control-sm w-50"
                                v-model.number="yDecimal_places" max="6" min="0"
                                debounce="500" />
                        </b-form-group>
                        -->
                        <b-form-group label="Prefixo:">
                            <input v-model="yPrefix" type="text" class="form-control form-control-sm" maxlength="20"
                                debounce="500">
                        </b-form-group>
                        <b-form-group label="Sufixo:">
                            <input v-model="ySuffix" type="text" class="form-control form-control-sm" maxlength="20"
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
const yLabel = defineModel('yLabel');
const yLowerBound = defineModel('yLowerBound');
const yUpperBound = defineModel('yUpperBound');
const yLogScale = defineModel('yLogScale');
const yDisplay = defineModel('yDisplay');
const yDisplayLabel = defineModel('yDisplayLabel');
const yPrefix = defineModel('yPrefix');
const ySuffix = defineModel('ySuffix');


</script>
<style>
</style>