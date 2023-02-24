<template>
    <div>
        <b-card class="mt-1">
            <div v-if="editableVisualization && editableVisualization.y_axis.value">
                <b-dropdown size="sm" ref="axis" class="mt-2 mr-1" variant="outline-secondary small-dd-title">
                    <template #button-content>
                        <font-awesome-icon class="mr-2" prefix="fa" icon="y" />
                    </template>
                    <b-dropdown-form form-class="down-drop-form">
                        <div class="row axis-form">
                            <div class="col-12">
                                <b-form-group label="Título:">
                                    <input type="text" class="form-control form-control-sm"
                                        v-model="editableVisualization.y_axis.value.label" />
                                </b-form-group>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Limite inferior:">
                                    <input type="number" class="form-control form-control-sm"
                                        v-model="editableVisualization.y_axis.value.lowerBound" />
                                </b-form-group>
                                <b-form-group label="Limite superior:">
                                    <input type="number" class="form-control form-control-sm"
                                        v-model="editableVisualization.y_axis.value.upperBound" />
                                </b-form-group>
                                <b-form-checkbox v-model="editableVisualization.y_axis.value.logScale"> Usar escala
                                    logarítmica</b-form-checkbox>
                                <b-form-checkbox v-model="editableVisualization.y_axis.value.display"> Exibir eixo
                                </b-form-checkbox>
                                <b-form-checkbox v-model="editableVisualization.y_axis.value.displayLabel"> Exibir título
                                    do eixo </b-form-checkbox>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Multiplicar por:">
                                    <b-form-input type="number" v-model="editableVisualization.y_axis.value.multiplier"
                                        class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                                </b-form-group>
                                <b-form-group label="Casas decimais:">
                                    <input type="number" class="form-control form-control-sm w-50"
                                        v-model="editableVisualization.y_axis.value.decimalPlaces" max="6" min="0"
                                        debounce="500" />
                                </b-form-group>
                                <b-form-group label="Prefixo:">
                                    <input type="text" class="form-control form-control-sm"
                                        v-model="editableVisualization.y_axis.value.prefix" maxlength="20" debounce="500" />
                                </b-form-group>
                                <b-form-group label="Sufixo:">
                                    <input type="text" class="form-control form-control-sm"
                                        v-model="editableVisualization.y_axis.value.suffix" maxlength="20" debounce="500" />
                                </b-form-group>
                            </div>
                        </div>
                    </b-dropdown-form>
                </b-dropdown>
                <b-dropdown v-if="editableVisualization.y" v-for="(y, i) in editableVisualization.y.value" :key="i"
                    size="sm" ref="yDimensionDD" class="mt-2 mr-1 pull-right" variant="outline-secondary small-dd-title">
                    <template #button-content>
                        {{ y.attribute === '*' ? 'COUNT' : y.aggregation.toUpperCase() }}({{ y.attribute }})
                    </template>
                    <b-dropdown-form form-class="right-drop-form">
                        <div class="row series-form">
                            <div class="col-6">
                                <b-form-group :label="$tc('common.attribute', 1) + ':'" label-for="dropdown-form-email">
                                    <select class="form-control form-control-sm mt-2" v-model="y.attribute">
                                        <option value="*"># Total de registros</option>
                                        <option v-for="attr in attributes" :value="attr.name">
                                            {{ attr.name }}
                                            ({{ attr.type }})
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Rótulo para legenda:">
                                    <b-form-input type="text" v-model="y.label" class="form-control form-control-sm"
                                        maxlength="100" debounce="500" />
                                </b-form-group>

                                <b-form-group v-if="y.attribute !== '*'" label="Função de agregação:">
                                    <select class="form-control form-control-sm" v-model="y.aggregation">
                                        <option label="COUNT" value="COUNT">COUNT</option>
                                        <option label="COUNTD" value="COUNTD">COUNT DISTINCT</option>
                                        <option label="AVG" value="AVG">AVG</option>
                                        <option label="SUM" value="SUM">SUM</option>
                                        <option label="MIN" value="MIN">MIN</option>
                                        <option label="MAX" value="MAX">MAX</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Computação:">
                                    <select class="form-control form-control-sm" v-model="y.compute">
                                        <option label="NORMAL" value="NORMAL">NORMAL</option>
                                        <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">PERCENTAGE SCALE
                                        </option>
                                        <option label="CUMULATIVE" value="CUMULATIVE">CUMULATIVE</option>
                                        <option label="CUMULATIVE_PERCENTAGE" value="CUMULATIVE_PERCENTAGE">CUMULATIVE
                                            PERCENTAGE</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Multiplicar:">
                                    <b-form-input type="number" v-model="y.multiplier" class="form-control form-control-sm"
                                        max="1000000000000" min="1" debounce="500" />
                                </b-form-group>
                                <b-form-group label="Casas decimais:">
                                    <b-form-input type="number" v-model="y.decimalPlaces"
                                        class="form-control form-control-sm w-25" max="6" min="0" debounce="500" />
                                </b-form-group>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Prefixo:">
                                    <b-form-input type="text" v-model="y.prefix" class="form-control form-control-sm"
                                        maxlength="20" debounce="500" />
                                </b-form-group>
                                <b-form-group label="Sufixo:">
                                    <b-form-input type="text" v-model="y.suffix" class="form-control form-control-sm"
                                        maxlength="20" debounce="500" />
                                </b-form-group>
                                <b-form-group label="Cor:">
                                    <b-form-input type="color" v-model="y.color" class="form-control form-control-sm"/>
                                </b-form-group>
                                <b-form-group label="Tipo de linha:">
                                    <select class="form-control form-control-sm w-50" v-model="y.stroke">
                                        <option
                                            v-for="opt in ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot']"
                                            :key="opt" :value="opt">{{ opt }}</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Espessura da linha:">
                                    <select class="form-control form-control-sm w-50" v-model.number="y.strokeSize">
                                        <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                                    </select>
                                </b-form-group>
                                <!-- FIXME 
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
                                        <input type="number" class="form-control form-control-sm mb-2" placeholder="min" />
                                        <input type="number" class="form-control form-control-sm" placeholder="max" />

                                    </b-form-group>
                                    -->
                            </div>
                            <div class="col-12">
                                <b-button size="sm" variant="danger" class="float-right" @click="handleDeleteY(i)">{{
                                    $tc('actions.delete') }}</b-button>
                            </div>
                        </div>
                    </b-dropdown-form>
                </b-dropdown>
                <b-button size="sm" variant="success small-dd-title" class="mt-2" @click="handleAddY">
                    <font-awesome-icon prefix="fa" icon="plus" />
                </b-button>
            </div>
            <div v-if="editableVisualization && editableVisualization.x_axis.value">
                <b-dropdown size="sm" ref="axis" class="mt-2 mr-1" variant="outline-secondary small-dd-title">
                    <template #button-content>
                        <font-awesome-icon class="mr-2" prefix="fa" icon="x" />
                    </template>
                    <b-dropdown-form form-class="down-drop-form">
                        <div class="row axis-form">
                            <div class="col-12">
                                <b-form-group label="Título:">
                                    <input type="text" class="form-control form-control-sm"
                                        v-model="editableVisualization.x_axis.value.label" />
                                </b-form-group>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Limite inferior:">
                                    <input type="number" class="form-control form-control-sm"
                                        v-model="editableVisualization.x_axis.value.lowerBound" />
                                </b-form-group>
                                <b-form-group label="Limite superior:">
                                    <input type="number" class="form-control form-control-sm"
                                        v-model="editableVisualization.x_axis.value.upperBound" />
                                </b-form-group>
                                <b-form-checkbox v-model="editableVisualization.x_axis.value.logScale"> Usar escala
                                    logarítmica</b-form-checkbox>
                                <b-form-checkbox v-model="editableVisualization.x_axis.value.display"> Exibir eixo
                                </b-form-checkbox>
                                <b-form-checkbox v-model="editableVisualization.x_axis.value.displayLabel"> Exibir título
                                    do eixo </b-form-checkbox>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Multiplicar por:">
                                    <b-form-input type="number" v-model="editableVisualization.x_axis.value.multiplier"
                                        class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                                </b-form-group>
                                <b-form-group label="Casas decimais:">
                                    <input type="number" class="form-control form-control-sm w-50"
                                        v-model="editableVisualization.x_axis.value.decimalPlaces" max="6" min="0"
                                        debounce="500" />
                                </b-form-group>
                                <template>
                                    <b-form-group label="Prefixo:">
                                        <input type="text" class="form-control form-control-sm"
                                            v-model="editableVisualization.x_axis.value.prefix" maxlength="20"
                                            debounce="500" />
                                    </b-form-group>
                                    <b-form-group label="Sufixo:">
                                        <input type="text" class="form-control form-control-sm"
                                            v-model="editableVisualization.x_axis.value.suffix" maxlength="20"
                                            debounce="500" />
                                    </b-form-group>
                                </template>
                            </div>
                        </div>
                    </b-dropdown-form>
                </b-dropdown>
                <b-dropdown v-if="editableVisualization.x" v-for="(x, i) in editableVisualization.x.value" :key="i"
                    size="sm small-dd-title" ref="xDimensionDD" class="mt-2 mr-1 pull-right"
                    :variant="x.attribute ? 'outline-secondary' : 'outline-danger'">
                    <template #button-content>
                        {{ getDisplayXDimensionLabel(x, 'Selecione...', 'grupos', 'tamanho', 'Categórico') }}
                    </template>
                    <b-dropdown-form form-class="right-drop-form">
                        <div class="row series-form">
                            <div class="col-6">
                                <b-form-group :label="$tc('common.attribute', 1) + ':'">
                                    <select class="form-control form-control-sm" v-model="x.attribute" @change="handleSelectAttribute(x)">
                                        <option v-for="attr in attributes" :value="attr.name">
                                            {{ attr.name }}
                                            ({{ attr.type }})
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Rótulo para legenda:">
                                    <b-form-input type="text" v-model="x.displayLabel" class="form-control form-control-sm"
                                        maxlength="100" debounce="500" />
                                </b-form-group>
                                <div v-if="isNumeric(x.attribute)">
                                    <b-form-group label="Agrupamento (bins):">
                                        <select class="form-control form-control-sm" v-model="x.binning">
                                            <option label="EQUAL_INTERVAL" value="EQUAL_INTERVAL">Número fixo de grupos com
                                                intervalos iguais</option>
                                            <option label="FIXED_SIZE" value="FIXED_SIZE">FIXED_SIZE</option>
                                            <option label="NONE" value="NONE">NONE</option>
                                            <option label="CATEGORICAL" value="CATEGORICAL">CATEGORICAL</option>
                                        </select>
                                    </b-form-group>
                                    <b-form-group label="Número de grupos (bins):">
                                        <b-form-input type="number" v-model.number="x.bins"
                                            class="form-control form-control-sm" max="1000" min="1"
                                            debounce="500" />
                                    </b-form-group>

                                    <b-form-group label="Computação:">
                                        <select class="form-control form-control-sm" v-model="x.compute">
                                            <option label="NORMAL" value="NORMAL">NORMAL</option>
                                            <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">PERCENTAGE SCALE
                                            </option>
                                            <option label="CUMULATIVE" value="CUMULATIVE">CUMULATIVE</option>
                                            <option label="CUMULATIVE_PERCENTAGE" value="CUMULATIVE_PERCENTAGE">CUMULATIVE
                                                PERCENTAGE</option>
                                        </select>
                                    </b-form-group>
                                    <b-form-group label="Multiplicar:">
                                        <b-form-input type="number" v-model="x.multiplier"
                                            class="form-control form-control-sm" max="1000000000000" min="1"
                                            debounce="500" />
                                    </b-form-group>
                                    <b-form-group label="Casas decimais:">
                                        <b-form-input type="number" v-model="x.decimalPlaces"
                                            class="form-control form-control-sm w-25" max="6" min="0" debounce="500" />
                                    </b-form-group>
                                </div>
                            </div>
                            <div class="col-6">
                                <b-form-group label="Tratar valores vazios:">
                                    <select class="form-control-sm">
                                        <option label="Replace with zeros" value="ZEROS" selected="selected">
                                            Replace with zeros</option>
                                        <option label="Link neighbors" value="AVERAGE">Link neighbors</option>
                                        <option label="Interrupt line" value="DASHED">Interrupt line</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Ordenação:">
                                    <select class="form-control form-control-sm" v-model="x.sorting">
                                        <option label="Ordenação natural" value="NATURAL" selected="selected">
                                            Ordenação natural</option>
                                        <option label="Valor do eixo Y (ascendente)" value="Y_ASC">Valor do eixo Y
                                            (ascendente)</option>
                                        <option label="Valor do eixo Y (descendente)" value="Y_DESC">Valor do eixo Y
                                            (descendente)</option>
                                    </select>
                                </b-form-group>

                                <b-form-group label="Limitar qtde. de valores:">
                                    <input type="number" class="form-control form-control-sm" v-model="x.maxDiplayed" />
                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox v-model="x.groupOthers">
                                        Agrupar os outros valores
                                    </b-form-checkbox>
                                </b-form-group>
                                <template v-if="x && isNumeric(x.attribute)">
                                    <b-form-group label="Prefixo:">
                                        <b-form-input type="text" v-model="x.prefix" class="form-control form-control-sm"
                                            maxlength="20" debounce="500" />
                                    </b-form-group>
                                    <b-form-group label="Sufixo:">
                                        <b-form-input type="text" v-model="x.suffix" class="form-control form-control-sm"
                                            maxlength="20" debounce="500" />
                                    </b-form-group>
                                </template>
                                <!-- FIXME 
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
                                                    <input type="number" class="form-control form-control-sm mb-2" placeholder="min" />
                                                    <input type="number" class="form-control form-control-sm" placeholder="max" />

                                                </b-form-group>
                                                -->
                            </div>
                            <div class="col-12">
                                <b-button size="sm" variant="danger" class="float-right" @click="handleDeleteX(i)">{{
                                    $tc('actions.delete') }}</b-button>
                            </div>

                        </div>
                    </b-dropdown-form>
                </b-dropdown>
                <b-button size="sm" variant="success small-dd-title" class="mt-2" @click="handleAddX">
                    <font-awesome-icon prefix="fa" icon="plus" />
                </b-button>
            </div>
        </b-card>
</div>
</template>
<script>
import { XDimension, YDimension } from '../../views/data-explorer/entities.js';
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
            attributesMap: {}
        }
    },
    beforeMount() {
        this.attributes.forEach(a => this.attributesMap[a.name] = a);
    },
    methods: {
        isNumeric(attributeName) {
            return this.attributes && this.attributesMap[attributeName] &&
                this.attributesMap[attributeName].numeric
        },
        handleSelectAttribute(x){
            if (!this.isNumeric(x.attribute)) {
                x.binning = null;
            } else {
                x.binning = 'EQUAL_INTERVAL';
            }
        },
        handleAddY() {
            this.editableVisualization.y.value.push(new YDimension({}));
        },
        handleAddX() {
            this.editableVisualization.x.value.push(new XDimension({}));
        },
        handleDeleteY(index) {
            this.$refs.yDimensionDD[index].hide(true)
            this.editableVisualization.y.value.splice(index, 1);
        },
        handleDeleteX(index) {
            this.$refs.xDimensionDD[index].hide(true)
            this.editableVisualization.x.value.splice(index, 1);
        },
        getDisplayXDimensionLabel(obj, defaultValue, bins, size, categorical) {
            if (!obj.attribute) {
                return defaultValue;
            }
            if (!this.isNumeric(obj.attribute)) {
                return obj.attribute;
            }
            switch (obj.binning) {
                case 'EQUAL_INTERVAL':
                    return `${obj.attribute} (${obj.bins} ${bins})`;
                case 'FIXED_SIZE':
                    return `${obj.attribute} (${bins} ${size} ${obj.binSize} )`;
                case 'NONE':
                    return obj.attribute;
                case 'CATEGORICAL':
                    return `${obj.attribute} (${categorical})`;
                default:
                    return obj.attribute;
            }
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
                const checks = ['x_axis', 'y_axis', 'x', 'y']
                checks.forEach(check => {
                    if (!val[check]) {
                        val[check] = { value: {} }
                    }
                });
                this.editableVisualization = structuredClone(val);
                
                this.toEmit = false;
            }
        },
    }
}
</script>
<style>
.small-dd-title {
    font-size: 8pt;
    /* padding-top: 6px;
    padding-bottom: 7px; */
}
</style>
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
