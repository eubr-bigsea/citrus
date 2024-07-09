<template>
    <div>
        <b-card class="mt-1">
            <template v-if="mapFamily">
                <div class="row">
                    <div class="col-2">
                        <small class="form-text text-muted">Latitude:</small>
                        <v-select v-model="editableVisualization.latitude.value" :options="attributes" label="name"
                            :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>

                        <small class="form-text text-muted">Longitude:</small>
                        <v-select v-model="editableVisualization.longitude.value" :options="attributes" label="name"
                            :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>
                    </div>
                    <div v-if="chartType === 'densitymapbox'" class="col-4">
                        <small class="form-text text-muted">Atributo com nome (exibido ao apontar com o mouse):</small>
                        <v-select v-model="editableVisualization.hover_name.value" :options="attributes"
                            label="name" :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>
                        <small class="form-text text-muted">Valor(es) (exibido(s) ao apontar com o mouse):</small>
                        <v-select v-model="editableVisualization.hover_data.value" :options="attributes"
                            :reduce="(opt) => opt.name" :searchable="true" class="select2-small" multiple="true">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>
                    </div>
                    <div v-if="chartType === 'densitymapbox'" class="col-4">
                        <small class="form-text text-muted">Magnitude (intensidade, opcional):</small>
                        <v-select v-model="editableVisualization.magnitude.value" :options="attributes"
                            :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>
                    </div>
                    <div v-if="chartType === 'scattermapbox'" class="col-6">
                        <div class="row">
                            <div class="col-6">
                                <small class="form-text text-muted">Cor (opcional):</small>
                                <v-select v-model="editableVisualization.color_attribute.value" :options="attributes"
                                    label="name" :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                                    <template #option="{ type, name }">
                                        <span v-if="name !== '*'"
                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                        {{ name }}
                                    </template>

                                    <template #selected-option="{ type, name }">
                                        <div>
                                            <span v-if="name !== '*'"
                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                            {{ name }}
                                        </div>
                                    </template>
                                </v-select>
                                <small class="form-text text-muted">Tamanho (raio, opcional):</small>
                                <v-select v-model="editableVisualization.size_attribute.value" :options="attributes"
                                    label="name" :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                                    <template #option="{ type, name }">
                                        <span v-if="name !== '*'"
                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                        {{ name }}
                                    </template>

                                    <template #selected-option="{ type, name }">
                                        <div>
                                            <span v-if="name !== '*'"
                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                            {{ name }}
                                        </div>
                                    </template>
                                </v-select>
                            </div>
                            <div class="col-6">
                                <small class="form-text text-muted">Text (opcional):</small>
                                <v-select v-model="editableVisualization.text_attribute.value" :options="attributes"
                                    label="name" :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                                    <template #option="{ type, name }">
                                        <span v-if="name !== '*'"
                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                        {{ name }}
                                    </template>

                                    <template #selected-option="{ type, name }">
                                        <div>
                                            <span v-if="name !== '*'"
                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                            {{ name }}
                                        </div>
                                    </template>
                                </v-select>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="clearfix">
                    <b-dropdown v-if="hasAxis" size="sm" ref="axis" class="mt-2 mr-1 float-left"
                        variant="outline-secondary small-dd-title">
                        <template #button-content>
                            <font-awesome-icon class="mr-2" prefix="fa" icon="y" />
                        </template>
                        <b-dropdown-form v-if="hasAxis" form-class="down-drop-form">
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
                                    <b-form-checkbox v-model="editableVisualization.y_axis.value.displayLabel"> Exibir
                                        título
                                        do eixo </b-form-checkbox>
                                </div>
                                <div class="col-6">
                                    <!--
                                            <b-form-group label="Multiplicar por:">
                                                <b-form-input type="number" v-model.number="editableVisualization.y_axis.value.multiplier"
                                                    class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                                            </b-form-group>
                                            <b-form-group label="Casas decimais:">
                                                <input type="number" class="form-control form-control-sm w-50"
                                                    v-model.number="editableVisualization.y_axis.value.decimal_places" max="6" min="0"
                                                    debounce="500" />
                                            </b-form-group>
                                            -->
                                    <b-form-group label="Prefixo:">
                                        <input type="text" class="form-control form-control-sm"
                                            v-model="editableVisualization.y_axis.value.prefix" maxlength="20"
                                            debounce="500" />
                                    </b-form-group>
                                    <b-form-group label="Sufixo:">
                                        <input type="text" class="form-control form-control-sm"
                                            v-model="editableVisualization.y_axis.value.suffix" maxlength="20"
                                            debounce="500" />
                                    </b-form-group>
                                </div>
                            </div>
                        </b-dropdown-form>
                        <b-dropdown-form v-else>
                            <div>O tipo de gráfico não possui configurações para o eixo.</div>
                        </b-dropdown-form>
                    </b-dropdown>
                    <div v-else class="axis-label">Exibir</div>

                    <draggable ghost-class="ghost" handle=".drag-handle" :list="editableVisualization.y.value"
                        :move="handleYAxisDrag" direction="horizontal" @start="drag = true" @end="drag = false"
                        class="draggable-area">
                        <div v-for="(y, i) in ySeries" :key="i" class="drag-handle" :data-test="`y-series-${i}`">

                            <b-dropdown size="sm" ref="yDimensionDD" class="mt-2 mr-1 pull-right"
                                :variant="'outline-secondary small-dd-title ' + (y.enabled ? '' : 'disabled')">
                                <template #button-content>
                                    {{ y.attribute === '*' ? 'COUNT' : y.aggregation.toUpperCase() }}
                                    {{ y.aggregation !== '' ? `(${y.attribute})` : y.attribute }}
                                </template>
                                <b-dropdown-form form-class="right-drop-form">
                                    <div class="row series-form">
                                        <div class="col-6">
                                            <b-form-group :label="$tc('common.attribute', 1) + ':'"
                                                label-for="dropdown-form-email">

                                                <v-select v-model="y.attribute"
                                                    :options="[{ name: '*', type: 'CHARACTER' }, ...attributes]"
                                                    label="name" :reduce="(opt) => opt.name" :searchable="false">
                                                    <template #option="{ type, name }">
                                                        <span v-if="name !== '*'"
                                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                                        {{ name }}
                                                    </template>

                                                    <template #selected-option="{ type, name }">
                                                        <div>
                                                            <span v-if="name !== '*'"
                                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                                            {{ name }}
                                                        </div>
                                                    </template>
                                                </v-select>
                                                <!--
                                                        <select class="form-control form-control-sm mt-2" v-model="y.attribute">
                                                            <option value="*"># Total de registros</option>
                                                            <option v-for="attr in attributes" :value="attr.name">
                                                                {{ attr.name }}
                                                                ({{ attr.type }})
                                                            </option>
                                                        </select>
                                                    -->
                                            </b-form-group>
                                            <b-form-group>
                                                <b-form-checkbox v-model="y.enabled"> Habilitado</b-form-checkbox>
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                                <b-form-input type="text" v-model="y.label"
                                                    class="form-control form-control-sm" maxlength="100"
                                                    debounce="500" />
                                            </b-form-group>

                                            <b-form-group label="Função de agregação:">
                                                <select class="form-control form-control-sm" v-model="y.aggregation">
                                                    <option v-if="y.attribute !== '*'" label="" value="">Usar valor sem
                                                        agregar
                                                    </option>
                                                    <option value="COUNT">Contar (COUNT)</option>
                                                    <option value="COUNTD">Contar distintos (COUNT DISTINCT)</option>
                                                    <option v-if="y.attribute !== '*'" value="AVG">Média (AVG)</option>
                                                    <option v-if="y.attribute !== '*'" value="SUM">Soma (SUM)</option>
                                                    <option v-if="y.attribute !== '*'" value="MIN">Mínimo (MIN)</option>
                                                    <option v-if="y.attribute !== '*'" value="MAX">Máximo (MAX)</option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group v-if="false" label="Computação:">
                                                <select class="form-control form-control-sm" v-model="y.compute">
                                                    <option label="NORMAL" value="NORMAL">NORMAL</option>
                                                    <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">PERCENTAGE
                                                        SCALE
                                                    </option>
                                                    <option label="CUMULATIVE" value="CUMULATIVE">CUMULATIVE</option>
                                                    <option label="CUMULATIVE_PERCENTAGE" value="CUMULATIVE_PERCENTAGE">
                                                        CUMULATIVE
                                                        PERCENTAGE</option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Multiplicar:">
                                                <b-form-input type="number" v-model.number="y.multiplier"
                                                    class="form-control form-control-sm" max="1000000000000" min="1"
                                                    debounce="500" />
                                            </b-form-group>
                                            <b-form-group label="Casas decimais:">
                                                <b-form-input type="number" v-model.number="y.decimal_places"
                                                    class="form-control form-control-sm w-25" max="6" min="0"
                                                    debounce="500" />
                                            </b-form-group>
                                        </div>
                                        <div class="col-6">
                                            <b-form-group v-if="!pieFamily" label="Prefixo:">
                                                <b-form-input type="text" v-model="y.prefix"
                                                    class="form-control form-control-sm" maxlength="20"
                                                    debounce="500" />
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Sufixo:">
                                                <b-form-input type="text" v-model="y.suffix"
                                                    class="form-control form-control-sm" maxlength="20"
                                                    debounce="500" />
                                            </b-form-group>
                                            <b-form-group v-if="!['donut', 'pie'].includes(chartType)">
                                                <template #label>
                                                    <b-form-checkbox v-model="y.custom_color"> Usar cor personalizada
                                                    </b-form-checkbox>
                                                </template>
                                                <b-form-input v-if="y.custom_color" type="color" v-model="y.color"
                                                    class="form-control form-control-sm" />
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Tipo de linha:">
                                                <select class="form-control form-control-sm w-50" v-model="y.stroke">
                                                    <option
                                                        v-for="opt in ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot']"
                                                        :key="opt" :value="opt">{{ opt }}</option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Espessura da linha:">
                                                <select class="form-control form-control-sm w-50"
                                                    v-model.number="y.strokeSize">
                                                    <option v-for="i in 11" :key="i - 1" :value="i - 1">{{ i - 1 }}
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Cor da Linha:" label-for="line-width">
                                                <b-form-input v-model="y.line_color" type="color"
                                                    class="form-control form-control-sm w-50" />
                                            </b-form-group>
                                            <b-form-group v-if="chartType.endsWith('bar') || chartType.endsWith('area')"
                                                label="Padrão de preenchimento:">
                                                <v-select v-model="y.shape" :options="shapes" label="label"
                                                    :reduce="(opt) => opt.name" :searchable="false"
                                                    style="font-size:10pt">
                                                    <template #option="{ label, name, icon }">
                                                        <img :src="getShapeIcon(icon)"
                                                            style="width:20px; height: 20px" />
                                                        {{ label }}
                                                        <!--<div class="bg-chart" :class="`bg-${name}`"></div>-->
                                                    </template>

                                                    <template #selected-option="{ label, name, icon }">
                                                        <div>
                                                            <img :src="getShapeIcon(icon)"
                                                                style="width:20px; height: 20px" />
                                                            {{ label }}
                                                            <!--<div class="bg-chart" :class="`bg-${name}`"></div> -->
                                                        </div>
                                                    </template>
                                                </v-select>
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
                                        <div class="col-12 border-top pt-2">
                                            <b-button size="sm" variant="danger" class="float-right"
                                                @click="handleDeleteY(i)">{{
                                                    $tc('actions.delete') }}</b-button>
                                        </div>
                                    </div>
                                </b-dropdown-form>
                            </b-dropdown>
                            <font-awesome-icon v-if="canAddYDimension" icon="fa fa-grip-vertical" />
                        </div>
                    </draggable>
                    <b-button v-if="canAddYDimension" size="sm" variant="success small-dd-title" class="mt-2 float-left"
                        @click="handleAddY" data-test="add-y">
                        <font-awesome-icon prefix="fa" icon="plus" />
                    </b-button>
                </div>
                <div class="clearfix">
                    <b-dropdown v-if="hasAxis" size="sm" ref="axis" class="mt-2 mr-1 float-left"
                        variant="outline-secondary small-dd-title">
                        <template #button-content>
                            <font-awesome-icon class="mr-2" prefix="fa" icon="x" />
                        </template>
                        <b-dropdown-form v-if="hasAxis" form-class="down-drop-form">
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
                                    <b-form-checkbox v-model="editableVisualization.x_axis.value.displayLabel"> Exibir
                                        título
                                        do eixo </b-form-checkbox>
                                </div>
                                <div class="col-6">
                                    <!--
                                            <b-form-group label="Multiplicar por:">
                                                <b-form-input type="number" v-model.number="editableVisualization.x_axis.value.multiplier"
                                                    class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                                            </b-form-group>
                                            <b-form-group v-if="editableVisualization.x_axis.value.attribute" label="Casas decimais:">
                                                <input type="number" class="form-control form-control-sm w-50"
                                                    v-model.number="editableVisualization.x_axis.value.decimal_places" max="6" min="0"
                                                    debounce="500" />
                                            </b-form-group>
                                        -->
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
                        <b-dropdown-form v-else>
                            <div>O tipo de gráfico não possui configurações para o eixo.</div>
                        </b-dropdown-form>

                    </b-dropdown>
                    <div v-else class="axis-label">Por</div>
                    <draggable ghost-class="ghost" handle=".drag-handle" :list="editableVisualization.x.value"
                        :move="handleYAxisDrag" direction="horizontal" @start="drag = true" @end="drag = false"
                        class="draggable-area">

                        <div v-for="(x, i) in xSeries" :key="i" class="drag-handle">
                            <b-dropdown size="sm small-dd-title" ref="xDimensionDD" class="mt-2 mr-1 pull-right"
                                :variant="x.attribute ? 'outline-secondary' : 'outline-danger'" :id="`x-series-${i}`">
                                <template #button-content>
                                    {{ getDisplayXDimensionLabel(x, 'Selecione...', 'grupos', 'tamanho', 'Categórico')
                                    }}
                                </template>
                                <b-dropdown-form form-class="right-drop-form">
                                    <div class="row series-form">
                                        <div class="col-6">
                                            <b-form-group :label="$tc('common.attribute', 1) + ':'">
                                                <v-select v-model="x.attribute" :options="attributes" label="name"
                                                    :reduce="(opt) => opt.name" :searchable="false"
                                                    :selected="handleSelectAttribute(x)"
                                                    @selected="handleSelectAttribute(x)">
                                                    <template #option="{ type, name }">
                                                        <span
                                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                                        {{ name }}
                                                    </template>

                                                    <template #selected-option="{ type, name }">
                                                        <div>
                                                            <span
                                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                                                            {{ name }}
                                                        </div>
                                                    </template>
                                                </v-select>
                                                <!--
                                                        <select class="form-control form-control-sm" v-model="x.attribute"
                                                            @change="handleSelectAttribute(x)">
                                                            <option v-for="attr in attributes" :value="attr.name">
                                                                {{ attr.name }}
                                                                ({{ attr.type }})
                                                            </option>
                                                        </select>
                                                    -->
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                                <b-form-input type="text" v-model="x.displayLabel"
                                                    class="form-control form-control-sm" maxlength="100"
                                                    debounce="500" />
                                            </b-form-group>
                                            <div v-if="true && isNumeric(x.attribute)">
                                                <b-form-group label="Agrupamento (bins):">
                                                    <select class="form-control form-control-sm" v-model="x.binning">
                                                        <option value="EQUAL_INTERVAL">Número fixo de
                                                            grupos com intervalos iguais
                                                        </option>
                                                        <option value="FIXED_SIZE">Grupos com comprimento de intervalo
                                                            fixo
                                                        </option>
                                                        <option value="NONE">Nenhuma transformação</option>
                                                        <option value="QUANTILES">Quantis (em %)</option>
                                                        <option value="CATEGORICAL">Tratar valores como categóricos
                                                        </option>
                                                    </select>
                                                </b-form-group>
                                                <b-form-group v-if="x.binning === 'EQUAL_INTERVAL'"
                                                    label="Número de grupos (bins):">
                                                    <b-form-input type="number" v-model.number="x.bins"
                                                        class="form-control form-control-sm w-25" max="1000" min="1"
                                                        debounce="500" />
                                                </b-form-group>
                                                <b-form-group v-if="x.binning === 'FIXED_SIZE'"
                                                    label="Tamanho dos grupos:">
                                                    <b-form-input type="number" v-model.number="x.bin_size"
                                                        class="form-control form-control-sm w-25" max="1000" min="1"
                                                        debounce="500" />
                                                </b-form-group>
                                                <b-form-group v-if="x.binning === 'QUANTILES'"
                                                    label="Quantis (inteiros separados por vírgula):">
                                                    <b-form-input type="text" v-model="x.quantiles"
                                                        class="form-control form-control-sm w-100" max="1000" min="1"
                                                        debounce="500" />
                                                </b-form-group>

                                                <b-form-group v-if="false" label="Computação:">
                                                    <select class="form-control form-control-sm" v-model="x.compute">
                                                        <option label="NORMAL" value="NORMAL">NORMAL</option>
                                                        <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">
                                                            PERCENTAGE
                                                            SCALE
                                                        </option>
                                                        <option label="CUMULATIVE" value="CUMULATIVE">CUMULATIVE
                                                        </option>
                                                        <option label="CUMULATIVE_PERCENTAGE"
                                                            value="CUMULATIVE_PERCENTAGE">
                                                            CUMULATIVE
                                                            PERCENTAGE</option>
                                                    </select>
                                                </b-form-group>
                                                <b-form-group v-if="!pieFamily" label="Multiplicar:">
                                                    <b-form-input type="number" v-model.number="x.multiplier"
                                                        class="form-control form-control-sm w-25" max="1000000000000"
                                                        min="1" debounce="500" />
                                                </b-form-group>
                                                <b-form-group label="Casas decimais:">
                                                    <b-form-input type="number" v-model.number="x.decimal_places"
                                                        class="form-control form-control-sm w-25" max="6" min="0"
                                                        debounce="500" />
                                                </b-form-group>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <b-form-group v-if="!pieFamily" label="Tratar valores vazios:">
                                                <select class="form-control-sm">
                                                    <option label="Replace with zeros" value="ZEROS"
                                                        selected="selected">
                                                        Replace with zeros</option>
                                                    <option label="Link neighbors" value="AVERAGE">Link neighbors
                                                    </option>
                                                    <option label="Interrupt line" value="DASHED">Interrupt line
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Ordenação:">
                                                <select class="form-control form-control-sm" v-model="x.sorting">
                                                    <option label="Ordenação natural" value="NATURAL"
                                                        selected="selected">
                                                        Ordenação natural</option>
                                                    <option label="Valor do eixo Y (ascendente)" value="Y_ASC">Valor do
                                                        eixo
                                                        Y
                                                        (ascendente)</option>
                                                    <option label="Valor do eixo Y (descendente)" value="Y_DESC">Valor
                                                        do
                                                        eixo Y
                                                        (descendente)</option>
                                                </select>
                                            </b-form-group>

                                            <b-form-group label="Limitar qtde. de valores:">
                                                <input type="number" class="form-control form-control-sm"
                                                    v-model.number="x.max_displayed" />
                                            </b-form-group>
                                            <b-form-group v-if="x.max_displayed !== 0">
                                                <b-form-checkbox v-model="x.group_others">
                                                    Agrupar os outros valores
                                                </b-form-checkbox>
                                            </b-form-group>
                                            <b-form-group v-if="x.max_displayed !== 0 && x.group_others"
                                                label="Nome para 'outros valores'">
                                                <input type="text" class="form-control form-control-sm"
                                                    v-model="x.label_others" />
                                            </b-form-group>
                                            <template v-if="!pieFamily">
                                                <b-form-group label="Prefixo:">
                                                    <b-form-input type="text" v-model="x.prefix"
                                                        class="form-control form-control-sm" maxlength="20"
                                                        debounce="500" />
                                                </b-form-group>
                                                <b-form-group v-if="!pieFamily" label="Sufixo:">
                                                    <b-form-input type="text" v-model="x.suffix"
                                                        class="form-control form-control-sm" maxlength="20"
                                                        debounce="500" />
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
                                            <b-button size="sm" variant="danger" class="float-right"
                                                @click="handleDeleteX(i)">{{
                                                    $tc('actions.delete') }}</b-button>
                                        </div>

                                    </div>
                                </b-dropdown-form>
                            </b-dropdown>
                            <font-awesome-icon v-if="canAddXDimension" icon="fa fa-grip-vertical" />
                        </div>
                    </draggable>
                    <b-button v-if="canAddXDimension" size="sm" variant="success small-dd-title"
                        class="mt-2 float-left clearfix" @click="handleAddX" data-test="add-x">
                        <font-awesome-icon prefix="fa" icon="plus" />
                    </b-button>
                </div>
            </template>

        </b-card>
    </div>
</template>
<script setup>
import { ref, computed, watch, defineProps, defineEmits, onBeforeMount } from "vue";
import { XDimension, YDimension } from '../../views/data-explorer/entities.js';
import Draggable from 'vuedraggable';

const shapes = [
    { name: '', label: 'Sólido', icon: 'solid' },
    { name: '/', label: 'Diagonal direita', icon: 'right-diag' },
    { name: '\\\\', label: 'Diagonal esquerda', icon: 'left-diag' },
    { name: 'x', label: 'Formato em X', icon: 'x-format' },
    { name: '-', label: 'Linha horizontal', icon: 'horizontal' },
    { name: '|', label: 'Linha vertical', icon: 'vertical' },
    { name: '+', label: 'Cruz', icon: 'crosses' },
    { name: '.', label: 'Ponto', icon: 'points' },
];

const emit = defineEmits(['input']);
const editableVisualization = ref(null);
const props = defineProps({
    workflow: { type: Object, required: true },
    attributes: { type: Array, required: true },
    value: {
        type: Object, required: true,
        default: () => ({
            x_axis: { value: {} }, y_axis: { value: {} },
            x: { value: {} }, y: { value: {} },
            color_attribute: { value: null }, text_attribute: { value: null }, size_attribute: { value: null },
            latitude: { value: null }, longitude: { value: null },
        })
    },
    chartType: { type: String, required: false }
});
const getShapeIcon = (type) => {
    return new URL(`../../assets/charts/shapes/${type}.svg`, import.meta.url).href;
}

/* Data */
const toEmit = ref(true);
const attributesMap = ref({});


onBeforeMount(() =>
    props.attributes.forEach(a => attributesMap.value[a.name] = a)
);


/* Elements refs */
const yDimensionDD = ref(null);
const xDimensionDD = ref(null);

/* Computed */

const mapFamily = computed(() =>
    ['scattermapbox', 'densitymapbox'].includes(props.chartType)
);
const pieFamily = computed(() =>
    ['donut', 'pie'].includes(props.chartType)
);
const hasAxis = computed(() =>
    !['pie', 'donut', 'indicator', 'treemap', 'sunburst'].includes(props.chartType)
);
const xSeries = computed(() =>
    editableVisualization.value.x.value.slice(0, limitXDimension.value)
);
const ySeries = computed(() =>
    editableVisualization.value.y.value.slice(0, limitYDimension.value)
);
const limitXDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (['pie', 'donut', 'scatter'].includes(props.chartType)) {
        result = 1;
    } else if (editableVisualization.value.x.value.length >= 2 && props.chartType !== 'treemap') {
        result = 2;
    }
    return result;
});
const limitYDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (
        (['pie', 'donut', 'scatter', 'treemap'].includes(props.chartType))
        || (editableVisualization.value.x.value.length >= 2)
    ) {
        result = 1;
    }
    return result;
});
const canAddXDimension = computed(() => {
    let result = true;
    result = (limitXDimension.value > editableVisualization.value.x.value.length);
    return result;
});
const canAddYDimension = computed(() => {
    let result = true;
    result = (limitYDimension.value > editableVisualization.value.y.value.length);
    return result;
});

/* Methods */
const handleYAxisDrag = (e) => true;
const isNumeric = function (attributeName) {
    const b = !!props.attributes && attributesMap.value[attributeName] &&
        attributesMap.value[attributeName].numeric;
    return b;
}
const isInteger = function (attributeName) {
    const b = !!props.attributes && attributesMap.value[attributeName] &&
        attributesMap.value[attributeName].integerType;
    return b;
}

const handleSelectAttribute = (x) => {
    if (!isNumeric(x.attribute)) {
        x.binning = null;
    }
};

editableVisualization.value = structuredClone(props.value);

const handleAddY = () => editableVisualization.value.y.value.push(new YDimension({}));
const handleAddX = () => editableVisualization.value.x.value.push(new XDimension({}));
const handleDeleteY = (index) => {
    yDimensionDD.value[index].hide(true)
    editableVisualization.value.y.value.splice(index, 1);
};
const handleDeleteX = (index) => {
    xDimensionDD.value[index].hide(true)
    editableVisualization.value.x.value.splice(index, 1);
};
const getDisplayXDimensionLabel = (obj, defaultValue, bins, size, categorical) => {
    if (!obj.attribute) {
        return defaultValue;
    }
    if (!isNumeric(obj.attribute)) {
        return obj.attribute;
    }
    switch (obj.binning) {
        case 'EQUAL_INTERVAL':
            return `${obj.attribute} (${obj.bins} ${bins})`;
        case 'FIXED_SIZE':
            return `${obj.attribute} (${bins} ${size} ${obj.bin_size} )`;
        case 'QUANTILES':
            return `${obj.attribute} (quantis informados)`;
        case 'NONE':
            return obj.attribute;
        case 'CATEGORICAL':
            return `${obj.attribute} (${categorical})`;
        default:
            return obj.attribute;
    }
};
/* Watch */
watch(
    () => editableVisualization,
    (value) => {
        if (toEmit.value) {
            emit('input', value.value);
        }
        toEmit.value = true;
    }, { deep: true });

watch(
    () => props.value,
    (value) => {
        const tests = ['x_axis', 'y_axis', 'x', 'y'];
        tests.forEach(t => {
            if (!value[t]) {
                value[t] = { value: null };
            }
        });

        editableVisualization.value = structuredClone(props.value);
        toEmit.value = false;
    }, { deep: true, immediate: true });

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
    width: 640px;
    zoom: .8;
}

.half-series-form {
    width: 260px;
    zoom: .8;
}

.drag-handle {
    float: left;
    margin-right: 0px;
}

.drag-handle>svg {
    margin: -5px 10px -5px -2px;
}

.ghost {
    background: #ddd;
    padding: -20px 0 0 0;
    margin: 0;
    opacity: 100%;
}

.select2-small {
    zoom: .8
}

.axis-label {
    text-align: right;
    float: left;
    width: 60px;
    margin: 12px 5px 0 0;
    font-size: 10pt;
}
</style>
