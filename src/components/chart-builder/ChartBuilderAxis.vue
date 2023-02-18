<template>
    <div>
        <b-card sub-title="Eixo Y" class="mt-1" style="z-index:10">
            <!-- <b-form-group label="Atributo(s):">
                <v-select ref="vueSelect" v-model="workflow.group.forms.function.value" :options="attributes"
                    label="name" :reduce="reduceYAxis" :multiple="multipleY">
                    <template #option="{ name, type }">
                        <font-awesome-icon class="mr-2" prefix="fa" :icon="getIcon({ type })" />{{ name }}
                    </template>

                    <template #selected-option="{ name, type, f }">
                        <div role="button" @click.stop="handleSelect(name)" @mousedown.stop="handleSelect(name)"
                            @mouseup.stop="handleSelect(name)">
                            <column-aggregate v-if="name" :name="name" :type="type" :f="f"
                                @select="handleUpdateFunction" />
                        </div>
                    </template>
                </v-select>
            </b-form-group> -->
            <div v-if="workflow.group && editableVisualization">
                <div>

                    {{ workflow.group.forms.function.value[0].f.toUpperCase() }}({{
                        workflow.group.forms.function.value[0].attribute
                    }})
                </div>
                <b-dropdown v-if="workflow.group.forms.attributes.value" size="sm" ref="axis" class="mt-2 mr-1"
                    variant="outline-secondary">
                    <template #button-content>
                        <font-awesome-icon class="mr-2" prefix="fa" icon="y" />
                    </template>
                    <b-dropdown-form form-class="down-drop-form">
                        <div class="row axis-form">
                            <div class="col-12">
                                <b-form-group label="Título:">
                                    <input type="text" class="form-control form-input-sm"
                                        v-model="editableVisualization.yAxis.label" />
                                </b-form-group>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Limite inferior:">
                                    <input type="number" class="form-control form-input-sm"
                                        v-model="editableVisualization.yAxis.lowerBound" />
                                </b-form-group>
                                <b-form-group label="Limite superior:">
                                    <input type="number" class="form-control form-input-sm"
                                        v-model="editableVisualization.yAxis.upperBound" />
                                </b-form-group>
                                <b-form-checkbox v-model="editableVisualization.yAxis.logScale"> Usar escala
                                    logarítmica</b-form-checkbox>
                                <b-form-checkbox v-model="editableVisualization.yAxis.display"> Exibir eixo
                                </b-form-checkbox>
                                <b-form-checkbox v-model="editableVisualization.yAxis.displayLabel"> Exibir título do
                                    eixo </b-form-checkbox>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Multiplicar por:">
                                    <input type="number" class="form-control form-input-sm w-50"
                                        v-model="editableVisualization.yAxis.multiplier" />
                                </b-form-group>
                                <b-form-group label="Casas decimais:">
                                    <input type="number" class="form-control form-input-sm w-50"
                                        v-model="editableVisualization.yAxis.decimalPlaces" />
                                </b-form-group>
                                <b-form-group label="Prefixo:">
                                    <input type="text" class="form-control form-input-sm"
                                        v-model="editableVisualization.yAxis.prefix" />
                                </b-form-group>
                                <b-form-group label="Sufixo:">
                                    <input type="text" class="form-control form-input-sm"
                                        v-model="editableVisualization.yAxis.suffix" />
                                </b-form-group>
                            </div>
                        </div>
                    </b-dropdown-form>
                </b-dropdown>
                <b-dropdown v-if="workflow.group.forms.attributes.value" size="sm" ref="axis" class="mt-2 pull-right"
                    variant="outline-secondary">
                    <template #button-content>
                        Configurar ...
                    </template>
                    <b-dropdown-form form-class="right-drop-form">
                        <div class="row series-form">
                            <div class="col-6">
                                <b-form-group :label="$tc('common.attribute', 2) + ':'" label-for="dropdown-form-email">
                                    <v-select v-model="workflow.group.forms.attributes.value" :options="attributes"
                                        label="name" :reduce="(opt) => opt.name" :multiple="true" />
                                </b-form-group>

                                <b-form-group label="Função de agregação:">
                                    <select class="form-control form-control-sm">
                                        <option label="COUNT" value="COUNT">COUNT</option>
                                        <option label="AVG" value="AVG">AVG</option>
                                        <option label="COUNT" value="COUNT">COUNT</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Computação:">
                                    <select class="form-control form-control-sm">
                                        <option label="NORMAL" value="NORMAL">NORMAL</option>
                                        <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">PERCENTAGE SCALE
                                        </option>
                                        <option label="COUNT" value="COUNT">COUNT</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Escalar:">
                                    <select class="form-control form-control-sm">
                                        <option label="THOUSANDS" value="THOUSANDS">THOUSANDS</option>
                                        <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">PERCENTAGE SCALE
                                        </option>
                                        <option label="COUNT" value="COUNT">COUNT</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Casas decimais:">
                                    <input type="number" class="form-control form-input-sm" />
                                </b-form-group>
                                <b-form-group label="Prefixo:">
                                    <input type="text" class="form-control form-input-sm" />
                                </b-form-group>
                                <b-form-group label="Sufixo:">
                                    <input type="text" class="form-control form-input-sm" />
                                </b-form-group>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Rótulo para exibição:">
                                    <input type="text" class="form-control form-input-sm" />
                                </b-form-group>
                                <b-form-group label="Exibir eixo:">
                                    <select class="form-control form-control-sm">
                                        <option label="LEFT" value="LEFT">Esquerda</option>
                                        <option label="DIREITA" value="DIREITA">Direita</option>
                                        <option label="HIDE" value="HIDE">Ocultar</option>
                                    </select>
                                </b-form-group>
                                <b-form-checkbox> Usar escala logarítmica </b-form-checkbox>
                                <b-form-group label="Faixa de valores:">
                                    <b-form-radio> Automática </b-form-radio>
                                    <b-form-radio> Manual </b-form-radio>
                                    <input type="number" class="form-control form-input-sm mb-2" placeholder="min" />
                                    <input type="number" class="form-control form-input-sm" placeholder="max" />

                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox> Exibir título do eixo </b-form-checkbox>
                                </b-form-group>
                                <b-form-group label="Escalar:">
                                    <select class="form-control form-control-sm">
                                        <option label="THOUSANDS" value="THOUSANDS">THOUSANDS</option>
                                        <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">PERCENTAGE SCALE
                                        </option>
                                        <option label="COUNT" value="COUNT">COUNT</option>
                                    </select>
                                </b-form-group>
                            </div>
                        </div>
                    </b-dropdown-form>
                </b-dropdown>
            </div>
        </b-card>
        <b-card sub-title="Eixo X" class="mt-1">
            <!-- <v-select v-model="workflow.group.forms.attributes.value" :options="attributes" label="name"
                        :reduce="(opt) => opt.name" :multiple="true">
                        <template #option="{ name, type }">
                            <font-awesome-icon class="mr-2" prefix="fa" :icon="getIcon({ type })" />{{ name }}
                        </template>

                        <template #selected-option="{ name, type }">
                            <div role="button">
                                <font-awesome-icon class="mr-2" prefix="fa" :icon="getIcon({ type })" />{{ name }}
                            </div>
                        </template>
                    </v-select> -->

            <div v-if="workflow.group">
                <div class="badge mr-2" v-for="attr in workflow.group.forms.attributes.value">
                    {{ attr }}
                </div>
                <b-dropdown dropright v-if="workflow.group.forms.attributes.value" size="sm" ref="axis"
                    class="mt-2 pull-right" variant="outline-secondary" style="width: 100%;">
                    <template #button-content>
                        Configurar ...
                    </template>
                    <b-dropdown-form form-class="right-drop-form">
                        <div class="row">
                            <div class="col-6">
                                <b-form-group :label="$tc('common.attribute', 2) + ':'" label-for="dropdown-form-email">
                                    <v-select v-model="workflow.group.forms.attributes.value" :options="attributes"
                                        label="name" :reduce="(opt) => opt.name" :multiple="true" />
                                </b-form-group>

                                <b-form-group label="Tratar valores vazios:">
                                    <select class="form-control-sm">
                                        <option label="Replace with zeros" value="ZEROS" selected="selected">
                                            Replace with zeros</option>
                                        <option label="Link neighbors" value="AVERAGE">Link neighbors</option>
                                        <option label="Interrupt line" value="DASHED">Interrupt line</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Ordenação:">
                                    <select class="form-control-sm">
                                        <option label="Ordenação natural" value="NATURAL" selected="selected">
                                            Ordenação natural</option>
                                        <option label="Valor do eixo Y (ascendente)" value="Y_ASC">Valor do eixo Y
                                            (ascendente)</option>
                                        <option label="Valor do eixo Y (descendente)" value="Y_DESC">Valor do eixo Y
                                            (descendente)</option>
                                    </select>
                                </b-form-group>

                                <b-form-group label="Limitar qtde. de valores:">
                                    <input type="number" class="form-input-sm" />
                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox>
                                        Agrupar os outros valores
                                    </b-form-checkbox>
                                </b-form-group>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Rótulo para exibição:">
                                    <input type="text" class="form-input-sm" />
                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox> Exibir eixo </b-form-checkbox>
                                    <b-form-checkbox> Exibir título do eixo </b-form-checkbox>
                                </b-form-group>
                            </div>
                        </div>
                    </b-dropdown-form>
                </b-dropdown>
            </div>
        </b-card>
    </div>
</template>
<script>
export default {
    props: {
        workflow: { type: Object, required: true },
        attributes: { type: Array, required: true },
        value: { type: Object, required: true }
    },
    data() {
        return {
            editableVisualization: structuredClone(this.value),
            toEmit: true,
        }
    },
    watch: {
        editableVisualization: {
            deep: true,
            handler(value) {
                if (this.toEmit) {
                    this.$emit('input', value);
                }
                this.toEmit = true;
                //console.debug('handler2')
            }
        },
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                this.editableVisualization = structuredClone(val);
                this.toEmit = false;
            }
        },
    }
}
</script>
<style scoped>
.axis-form {
    zoom: .8;
    width: 480px;
}

.series-form {
    width: 500px;
    zoom: .8;
}
</style>
