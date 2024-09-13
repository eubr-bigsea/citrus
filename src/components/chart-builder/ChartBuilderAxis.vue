<template>
    <div>
        <b-card class="mt-1">
            <template v-if="mapFamily">
                <div class="row">
                    <template v-if="chartType === 'choropleth'">
                        <div class="col-12">
                            <div class="alert alert-warning">
                                <font-awesome-icon icon="fa fa-info-circle" />
                                Este tipo de gráfico pode consumir recursos computacionais tanto do servidor, quanto do
                                navegador. Certifique-se de que o volume de dados seja da ordem de poucos megabytes.
                                Também garanta que o valor do atributo especificado em
                                <code>Atributo com identificador</code>
                                seja igual ao valor do campo <code>Propriedade ID no GeoJSON</code>. O nome deste último
                                campo está no arquivo GeoJSON e o você provavelmente terá que inspecionar o arquivo para
                                saber seu nome.
                            </div>
                        </div>
                        <div class="col-12">
                            <small class="form-text text-muted">Aquivo GeoJSON (escolha ou informe o link/URL):</small>
                            <b-input-group class="w-100">
                                <b-form-input v-model="editableVisualization.geo_json_url.value" type="text"
                                              class="form-control form-control-sm" maxlength="1000" />
                                <b-input-group-append>
                                    <b-button variant="" size="sm"
                                              @click="openGeoJSONSuggestions">
                                        Selecionar...
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                            <chart-builder-geo-json-select ref="geoJsonSelector"
                                                           v-model="editableVisualization.geo_json_url.value" />
                        </div>
                    </template>
                    <div v-if="chartType === 'choropleth'" class="col-3">
                        <small class="form-text text-muted">Atributo com o identificador:</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.locations.value"
                                                          :options="attributes" />
                        <small class="form-text text-muted">Propriedade ID no GeoJSON:</small>
                        <b-form-input v-model="editableVisualization.feature_id_key.value" type="text"
                                      class="form-control form-control-sm" maxlength="50" />
                    </div>
                    <div v-if="chartType === 'choropleth'" class="col-3">
                        <small class="form-text text-muted">Cor (opcional):</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.color_attribute.value"
                                                          :options="attributes" />
                    </div>
                    <div v-if="chartType !== 'choropleth'" class="col-2">
                        <small class="form-text text-muted">
                            Latitude<span v-if="chartType == 'choropleth'">(opcional)</span>:</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.latitude.value"
                                                          :options="attributes" />

                        <small class="form-text text-muted">
                            Longitude<span v-if="chartType == 'choropleth'">(opcional)</span>:</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.longitude.value"
                                                          :options="attributes" />
                    </div>
                    <div v-if="chartType === 'densitymapbox' || chartType === 'choropleth'" class="col-6">
                        <small class="form-text text-muted">Atributo com nome (exibido ao apontar com o mouse,
                            opcional):</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.hover_name.value"
                                                          :options="attributes" />

                        <small class="form-text text-muted">Valor(es) (exibido(s) ao apontar com o mouse,
                            opcional):</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.hover_data.value"
                                                          :options="attributes" :multiple="true" />
                    </div>
                    <div v-if="chartType === 'densitymapbox'" class="col-4">
                        <small class="form-text text-muted">Magnitude (intensidade, opcional):</small>
                        <chart-builder-attribute-selector v-model="editableVisualization.magnitude.value"
                                                          :options="attributes" />
                    </div>
                    <div v-if="chartType === 'scattermapbox'" class="col-6">
                        <div class="row">
                            <div class="col-4">
                                <small class="form-text text-muted">Cor (opcional):</small>
                                <chart-builder-attribute-selector v-model="editableVisualization.color_attribute.value"
                                                                  :options="attributes" />

                                <small class="form-text text-muted">Tamanho (raio, opcional):</small>
                                <chart-builder-attribute-selector v-model="editableVisualization.size_attribute.value"
                                                                  :options="attributes" />
                            </div>
                            <div class="col-8">
                                <small class="form-text text-muted">Atributo com nome (exibido ao apontar com o mouse,
                                    opcional):</small>
                                <chart-builder-attribute-selector v-model="editableVisualization.hover_name.value"
                                                                  :options="attributes" />

                                <small class="form-text text-muted">Valor(es) (exibido(s) ao apontar com o
                                    mouse, opcional):</small>
                                <chart-builder-attribute-selector v-model="editableVisualization.hover_data.value"
                                                                  :options="attributes" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="clearfix">
                    <b-dropdown v-if="hasAxis" ref="axis" size="sm" class="mt-2 me-1 float-left"
                                variant="outline-secondary small-dd-title">
                        <template #button-content>
                            <font-awesome-icon class="mr-2" prefix="fa" icon="y" />
                        </template>
                        <b-dropdown-form v-if="hasAxis" form-class="down-drop-form">
                            <div class="row axis-form">
                                <div class="col-12">
                                    <b-form-group label="Título:">
                                        <input v-model="editableVisualization.y_axis.value.label" type="text"
                                               class="form-control form-control-sm">
                                    </b-form-group>
                                </div>
                                <div class="col-6">
                                    <b-form-group label="Limite inferior:">
                                        <input v-model="editableVisualization.y_axis.value.lowerBound" type="number"
                                               class="form-control form-control-sm">
                                    </b-form-group>
                                    <b-form-group label="Limite superior:">
                                        <input v-model="editableVisualization.y_axis.value.upperBound" type="number"
                                               class="form-control form-control-sm">
                                    </b-form-group>
                                    <b-form-checkbox v-model="editableVisualization.y_axis.value.logScale">
                                        Usar escala
                                        logarítmica
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="editableVisualization.y_axis.value.display">
                                        Exibir eixo
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="editableVisualization.y_axis.value.displayLabel">
                                        Exibir
                                        título
                                        do eixo
                                    </b-form-checkbox>
                                </div>
                                <div class="col-6">
                                    <!--
                                            <b-form-group label="Multiplicar por:">
                                                <b-form-input type="number" v-model.number="editableVisualization.y_axis.value.multiplier"
                                                    class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                                            </b-form-group>
                                            -->
                                    <b-form-group label="Casas decimais:">
                                        <input v-model.number="editableVisualization.y_axis.value.decimal_places" type="number"
                                               class="form-control form-control-sm w-50" max="6"
                                               min="0" debounce="500">
                                    </b-form-group>
                                    <b-form-group label="Prefixo:">
                                        <input v-model="editableVisualization.y_axis.value.prefix" type="text"
                                               class="form-control form-control-sm" maxlength="20"
                                               debounce="500">
                                    </b-form-group>
                                    <b-form-group label="Sufixo:">
                                        <input v-model="editableVisualization.y_axis.value.suffix" type="text"
                                               class="form-control form-control-sm" maxlength="20"
                                               debounce="500">
                                    </b-form-group>
                                    <b-form-group v-if="chartType.endsWith('bar') || chartType.endsWith('area')"
                                                  label="Normalizar:">
                                        <select v-model="editableVisualization.y_axis.value.normalization"
                                                class="form-control form-control-sm">
                                            <option value="">
                                                Sem normalização
                                            </option>
                                            <option value="fraction">
                                                Fração (valor é dividido pela soma dos valores)
                                            </option>
                                            <option value="percent">
                                                Percentual (igual à Fração, mas multiplicado por
                                                100)
                                            </option>
                                        </select>
                                    </b-form-group>
                                </div>
                            </div>
                        </b-dropdown-form>
                        <b-dropdown-form v-else>
                            <div>O tipo de gráfico não possui configurações para o eixo.</div>
                        </b-dropdown-form>
                    </b-dropdown>
                    <div v-else class="axis-label">
                        Exibir
                    </div>

                    <draggable ghost-class="ghost" handle=".drag-handle" :list="editableVisualization.y.value"
                               :move="handleYAxisDrag" direction="horizontal" class="draggable-area" @start="drag = true"
                               @end="drag = false">
                        <div v-for="(ySerie, counter) in ySeries" :key="counter" class="drag-handle" :data-test="`y-series-${counter}`">
                            <b-dropdown ref="yDimensionDD" size="sm" class="mt-2 me-1 pull-right"
                                        :variant="'outline-secondary small-dd-title ' + (ySerie.enabled ? '' : 'disabled')">
                                <template #button-content>
                                    {{ySerie.attribute === '*' ? 'COUNT' : ySerie.aggregation.toUpperCase()}}
                                    {{ySerie.aggregation !== '' ? `(${ySerie.attribute})` : ySerie.attribute}}
                                </template>
                                <b-dropdown-form form-class="right-drop-form">
                                    <div class="row series-form">
                                        <div class="col-6">
                                            <b-form-group :label="$t('common.attribute', 1) + ':'"
                                                          label-for="dropdown-form-email">
                                                <v-select v-model="ySerie.attribute"
                                                          :options="[{ name: '*', type: 'CHARACTER' }, ...attributes]"
                                                          label="name" :reduce="(opt) => opt.name" :searchable="false">
                                                    <template #option="{ type, name }">
                                                        <span v-if="name !== '*'"
                                                              :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                        {{name}}
                                                    </template>

                                                    <template #selected-option="{ type, name }">
                                                        <div>
                                                            <span v-if="name !== '*'"
                                                                  :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                            {{name}}
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
                                                <b-form-checkbox v-model="ySerie.enabled">
                                                    Habilitado
                                                </b-form-checkbox>
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                                <b-form-input v-model="ySerie.label" type="text"
                                                              class="form-control form-control-sm" maxlength="100"
                                                              debounce="500" />
                                            </b-form-group>

                                            <b-form-group label="Função de agregação:">
                                                <select v-model="ySerie.aggregation" class="form-control form-control-sm">
                                                    <option v-if="ySerie.attribute !== '*'" label="" value="">
                                                        Usar valor sem
                                                        agregar
                                                    </option>
                                                    <option value="COUNT">
                                                        Contar (COUNT)
                                                    </option>
                                                    <option value="COUNTD">
                                                        Contar distintos (COUNT DISTINCT)
                                                    </option>
                                                    <option v-if="ySerie.attribute !== '*'" value="AVG">
                                                        Média (AVG)
                                                    </option>
                                                    <option v-if="ySerie.attribute !== '*'" value="SUM">
                                                        Soma (SUM)
                                                    </option>
                                                    <option v-if="ySerie.attribute !== '*'" value="MIN">
                                                        Mínimo (MIN)
                                                    </option>
                                                    <option v-if="ySerie.attribute !== '*'" value="MAX">
                                                        Máximo (MAX)
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group v-if="false" label="Computação:">
                                                <select v-model="ySerie.compute" class="form-control form-control-sm">
                                                    <option label="NORMAL" value="NORMAL">
                                                        NORMAL
                                                    </option>
                                                    <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">
                                                        PERCENTAGE
                                                        SCALE
                                                    </option>
                                                    <option label="CUMULATIVE" value="CUMULATIVE">
                                                        CUMULATIVE
                                                    </option>
                                                    <option label="CUMULATIVE_PERCENTAGE" value="CUMULATIVE_PERCENTAGE">
                                                        CUMULATIVE
                                                        PERCENTAGE
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Multiplicar:">
                                                <b-form-input v-model.number="ySerie.multiplier" type="number"
                                                              class="form-control form-control-sm" max="1000000000000" min="1"
                                                              debounce="500" />
                                            </b-form-group>
                                            <!--
                                            <b-form-group label="Casas decimais:">
                                                <b-form-input type="number" v-model.number="y.decimal_places"
                                                    class="form-control form-control-sm w-25" max="6" min="0"
                                                    debounce="500" />
                                            </b-form-group>
                                        -->
                                        </div>
                                        <div class="col-6">
                                            <b-form-group v-if="!pieFamily" label="Prefixo:">
                                                <b-form-input v-model="ySerie.prefix" type="text"
                                                              class="form-control form-control-sm" maxlength="20"
                                                              debounce="500" />
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Sufixo:">
                                                <b-form-input v-model="ySerie.suffix" type="text"
                                                              class="form-control form-control-sm" maxlength="20"
                                                              debounce="500" />
                                            </b-form-group>
                                            <b-form-group v-if="!['donut', 'pie'].includes(chartType)">
                                                <template #label>
                                                    <b-form-checkbox v-model="ySerie.custom_color">
                                                        Usar cor personalizada
                                                    </b-form-checkbox>
                                                </template>
                                                <b-form-input v-if="ySerie.custom_color" v-model="ySerie.color" type="color"
                                                              class="form-control form-control-sm" />
                                            </b-form-group>
                                            <b-form-group v-if="!pieFamily" label="Tipo de linha:">
                                                <select v-model="ySerie.stroke" class="form-control form-control-sm w-50">
                                                    <option v-for="opt in ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot']"
                                                            :key="opt" :value="opt">
                                                        {{opt}}
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Espessura da linha:">
                                                <select v-model.number="ySerie.strokeSize"
                                                        class="form-control form-control-sm w-50">
                                                    <option v-for="i in 11" :key="i - 1" :value="i - 1">
                                                        {{i - 1}}
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Cor da Linha:" label-for="line-width">
                                                <b-form-input v-model="ySerie.line_color" type="color"
                                                              class="form-control form-control-sm w-50" />
                                            </b-form-group>
                                            <b-form-group v-if="chartType.endsWith('bar') || chartType.endsWith('area')"
                                                          label="Padrão de preenchimento:">
                                                <v-select v-model="ySerie.shape" :options="shapes" label="label"
                                                          :reduce="(opt) => opt.name" :searchable="false"
                                                          style="font-size:10pt">
                                                    <template #option="{ label, icon }">
                                                        <img :src="getShapeIcon(icon)"
                                                             style="width:20px; height: 20px">
                                                        {{label}}
                                                        <!--<div class="bg-chart" :class="`bg-${name}`"></div>-->
                                                    </template>

                                                    <template #selected-option="{ label, icon }">
                                                        <div>
                                                            <img :src="getShapeIcon(icon)"
                                                                 style="width:20px; height: 20px">
                                                            {{label}}
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
                                                      @click="handleDeleteY(counter)">
                                                {{$t('actions.delete')}}
                                            </b-button>
                                        </div>
                                    </div>
                                </b-dropdown-form>
                            </b-dropdown>
                            <font-awesome-icon v-if="canAddYDimension" icon="fa fa-grip-vertical" />
                        </div>
                    </draggable>
                    <b-button v-if="canAddYDimension" size="sm" variant="success small-dd-title" class="mt-2 float-left"
                              data-test="add-y" @click="handleAddY">
                        <font-awesome-icon prefix="fa" icon="plus" />
                    </b-button>
                </div>
                <div class="clearfix">
                    <b-dropdown v-if="hasAxis" ref="axis" size="sm" class="mt-2 me-1 float-left"
                                variant="outline-secondary small-dd-title">
                        <template #button-content>
                            <font-awesome-icon class="mr-2" prefix="fa" icon="x" />
                        </template>
                        <b-dropdown-form v-if="hasAxis" form-class="down-drop-form">
                            <div class="row axis-form">
                                <div class="col-12">
                                    <b-form-group label="Título:">
                                        <input v-model="editableVisualization.x_axis.value.label" type="text"
                                               class="form-control form-control-sm">
                                    </b-form-group>
                                </div>
                                <div class="col-6">
                                    <b-form-group label="Limite inferior:">
                                        <input v-model="editableVisualization.x_axis.value.lowerBound" type="number"
                                               class="form-control form-control-sm">
                                    </b-form-group>
                                    <b-form-group label="Limite superior:">
                                        <input v-model="editableVisualization.x_axis.value.upperBound" type="number"
                                               class="form-control form-control-sm">
                                    </b-form-group>
                                    <b-form-checkbox v-model="editableVisualization.x_axis.value.logScale">
                                        Usar escala
                                        logarítmica
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="editableVisualization.x_axis.value.display">
                                        Exibir eixo
                                    </b-form-checkbox>
                                    <b-form-checkbox v-model="editableVisualization.x_axis.value.displayLabel">
                                        Exibir
                                        título
                                        do eixo
                                    </b-form-checkbox>
                                </div>
                                <div class="col-6">
                                    <!--
                                            <b-form-group label="Multiplicar por:">
                                                <b-form-input type="number" v-model.number="editableVisualization.x_axis.value.multiplier"
                                                    class="form-control form-control-sm" max="1000000000000" min="1" debounce="500" />
                                            </b-form-group>
                                            -->
                                    <b-form-group label="Casas decimais:">
                                        <input v-model.number="editableVisualization.x_axis.value.decimal_places" type="number"
                                               class="form-control form-control-sm w-50" max="6"
                                               min="0" debounce="500">
                                    </b-form-group>
                                    <b-form-group label="Prefixo:">
                                        <input v-model="editableVisualization.x_axis.value.prefix" type="text"
                                               class="form-control form-control-sm" maxlength="20"
                                               debounce="500">
                                    </b-form-group>
                                    <b-form-group label="Sufixo:">
                                        <input v-model="editableVisualization.x_axis.value.suffix" type="text"
                                               class="form-control form-control-sm" maxlength="20"
                                               debounce="500">
                                    </b-form-group>
                                </div>
                            </div>
                        </b-dropdown-form>
                        <b-dropdown-form v-else>
                            <div>O tipo de gráfico não possui configurações para o eixo.</div>
                        </b-dropdown-form>
                    </b-dropdown>
                    <div v-else class="axis-label">
                        Por
                    </div>
                    <draggable ghost-class="ghost" handle=".drag-handle" :list="editableVisualization.x.value"
                               :move="handleYAxisDrag" direction="horizontal" class="draggable-area" @start="drag = true"
                               @end="drag = false">
                        <div v-for="(xSerie, i) in xSeries" :key="i" class="drag-handle">
                            <b-dropdown :id="`x-series-${i}`" ref="xDimensionDD" size="sm small-dd-title"
                                        class="mt-2 me-1 pull-right" :variant="xSerie.attribute ? 'outline-secondary' : 'outline-danger'">
                                <template #button-content>
                                    {{getDisplayXDimensionLabel(xSerie, 'Selecione...', 'grupos', 'tamanho', 'Categórico')}}
                                </template>
                                <b-dropdown-form form-class="right-drop-form">
                                    <div class="row series-form">
                                        <div class="col-6">
                                            <b-form-group :label="$t('common.attribute', 1) + ':'">
                                                <v-select v-model="xSerie.attribute" :options="attributes" label="name"
                                                          :reduce="(opt) => opt.name" :searchable="false"
                                                          :selected="handleSelectAttribute(xSerie)"
                                                          @selected="handleSelectAttribute(xSerie)">
                                                    <template #option="{ type, name }">
                                                        <span :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                        {{name}}
                                                    </template>

                                                    <template #selected-option="{ type, name }">
                                                        <div>
                                                            <span :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                            {{name}}
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
                                                <b-form-input v-model="xSerie.displayLabel" type="text"
                                                              class="form-control form-control-sm" maxlength="100"
                                                              debounce="500" />
                                            </b-form-group>
                                            <div v-if="isNumeric(xSerie.attribute)">
                                                <b-form-checkbox v-model.number="xSerie.as_categorical" class="mb-2">
                                                    Tratar número como categoria
                                                </b-form-checkbox>

                                                <b-form-group label="Agrupamento (bins):">
                                                    <select v-model="xSerie.binning" class="form-control form-control-sm">
                                                        <option value="EQUAL_INTERVAL">
                                                            Número fixo de
                                                            grupos com intervalos iguais
                                                        </option>
                                                        <option value="FIXED_SIZE">
                                                            Grupos com comprimento de intervalo
                                                            fixo
                                                        </option>
                                                        <option value="NONE">
                                                            Nenhuma transformação
                                                        </option>
                                                        <option value="QUANTILES">
                                                            Quantis (em %)
                                                        </option>
                                                        <option value="CATEGORICAL">
                                                            Tratar valores como categóricos
                                                        </option>
                                                    </select>
                                                </b-form-group>
                                                <b-form-group v-if="xSerie.binning === 'EQUAL_INTERVAL'"
                                                              label="Número de grupos (bins):">
                                                    <b-form-input v-model.number="xSerie.bins" type="number"
                                                                  class="form-control form-control-sm w-25" max="1000" min="1"
                                                                  debounce="500" />
                                                </b-form-group>
                                                <b-form-group v-if="xSerie.binning === 'FIXED_SIZE'"
                                                              label="Tamanho dos grupos:">
                                                    <b-form-input v-model.number="xSerie.bin_size" type="number"
                                                                  class="form-control form-control-sm w-25" max="1000" min="1"
                                                                  debounce="500" />
                                                </b-form-group>
                                                <b-form-group v-if="xSerie.binning === 'QUANTILES'"
                                                              label="Quantis (inteiros separados por vírgula):">
                                                    <b-form-input v-model="xSerie.quantiles" type="text"
                                                                  class="form-control form-control-sm w-100" max="1000" min="1"
                                                                  debounce="500" />
                                                </b-form-group>

                                                <b-form-group v-if="false" label="Computação:">
                                                    <select v-model="xSerie.compute" class="form-control form-control-sm">
                                                        <option label="NORMAL" value="NORMAL">
                                                            NORMAL
                                                        </option>
                                                        <option label="PERCENTAGE SCALE" value="PERCENTAGE SCALE">
                                                            PERCENTAGE
                                                            SCALE
                                                        </option>
                                                        <option label="CUMULATIVE" value="CUMULATIVE">
                                                            CUMULATIVE
                                                        </option>
                                                        <option label="CUMULATIVE_PERCENTAGE"
                                                                value="CUMULATIVE_PERCENTAGE">
                                                            CUMULATIVE
                                                            PERCENTAGE
                                                        </option>
                                                    </select>
                                                </b-form-group>
                                                <b-form-group v-if="!pieFamily" label="Multiplicar:">
                                                    <b-form-input v-model.number="xSerie.multiplier" type="number"
                                                                  class="form-control form-control-sm w-25" max="1000000000000"
                                                                  min="1" debounce="500" />
                                                </b-form-group>
                                                <!--
                                                <b-form-group label="Casas decimais:">
                                                    <b-form-input type="number" v-model.number="x.decimal_places"
                                                        class="form-control form-control-sm w-25" max="6" min="0"
                                                        debounce="500" />
                                                </b-form-group>
                                                -->
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <b-form-group v-if="!pieFamily" label="Tratar valores vazios:">
                                                <select class="form-control-sm">
                                                    <option label="Replace with zeros" value="ZEROS"
                                                            selected="selected">
                                                        Replace with zeros
                                                    </option>
                                                    <option label="Link neighbors" value="AVERAGE">
                                                        Link neighbors
                                                    </option>
                                                    <option label="Interrupt line" value="DASHED">
                                                        Interrupt line
                                                    </option>
                                                </select>
                                            </b-form-group>
                                            <b-form-group label="Ordenação:">
                                                <select v-model="xSerie.sorting" class="form-control form-control-sm">
                                                    <option label="Ordenação natural" value="NATURAL"
                                                            selected="selected">
                                                        Ordenação natural
                                                    </option>
                                                    <option label="Valor do eixo Y (ascendente)" value="Y_ASC">
                                                        Valor do
                                                        eixo
                                                        Y
                                                        (ascendente)
                                                    </option>
                                                    <option label="Valor do eixo Y (descendente)" value="Y_DESC">
                                                        Valor
                                                        do
                                                        eixo Y
                                                        (descendente)
                                                    </option>
                                                </select>
                                            </b-form-group>

                                            <b-form-group label="Limitar qtde. de valores:">
                                                <input v-model.number="xSerie.max_displayed" type="number"
                                                       class="form-control form-control-sm">
                                            </b-form-group>
                                            <b-form-group v-if="xSerie.max_displayed !== 0">
                                                <b-form-checkbox v-model="xSerie.group_others">
                                                    Agrupar os outros valores
                                                </b-form-checkbox>
                                            </b-form-group>
                                            <b-form-group v-if="xSerie.max_displayed !== 0 && xSerie.group_others"
                                                          label="Nome para 'outros valores'">
                                                <input v-model="xSerie.label_others" type="text"
                                                       class="form-control form-control-sm">
                                            </b-form-group>
                                            <template v-if="!pieFamily">
                                                <b-form-group label="Prefixo:">
                                                    <b-form-input v-model="xSerie.prefix" type="text"
                                                                  class="form-control form-control-sm" maxlength="20"
                                                                  debounce="500" />
                                                </b-form-group>
                                                <b-form-group v-if="!pieFamily" label="Sufixo:">
                                                    <b-form-input v-model="xSerie.suffix" type="text"
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
                                                      @click="handleDeleteX(i)">
                                                {{$t('actions.delete')}}
                                            </b-button>
                                        </div>
                                    </div>
                                </b-dropdown-form>
                            </b-dropdown>
                            <font-awesome-icon v-if="canAddXDimension" icon="fa fa-grip-vertical" />
                        </div>
                    </draggable>
                    <b-button v-if="canAddXDimension" size="sm" variant="success small-dd-title"
                              class="mt-2 float-left clearfix" data-test="add-x" @click="handleAddX">
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
import ChartBuilderAttributeSelector from './ChartBuilderAttributeSelector.vue';
import ChartBuilderGeoJsonSelect from './ChartBuilderGeoJsonSelect.vue';

const yLabel = defineModel('yLabel');
const yLowerBound = defineModel('yLowerBound');
const yUpperBound = defineModel('yUpperBound');
const yLogScale = defineModel('yLogScale');
const yDisplay = defineModel('yDisplay');
const yDisplayLabel = defineModel('yDisplayLabel');
const yPrefix = defineModel('yPrefix');
const ySuffix = defineModel('ySuffix');

const xLabel = defineModel('xLabel');
const xLowerBound = defineModel('xLowerBound');
const xUpperBound = defineModel('xUpperBound');
const xLogScale = defineModel('xLogScale');
const xDisplay = defineModel('xDisplay');
const xDisplayLabel = defineModel('xDisplayLabel');
const xPrefix = defineModel('xPrefix');
const xSuffix = defineModel('xSuffix');

const x = defineModel('x');
const y = defineModel('y');
// Map
const latitude = defineModel('latitude');
const longitude = defineModel('longitude');

const colorAttribute = defineModel('colorAttribute');
const sizeAttribute = defineModel('sizeAttribute');
const textAttribute = defineModel('textAttribute');

const emit = defineEmits(['input']);
const editableVisualization = ref(null);

const props = defineProps({
    workflow: { type: Object, required: true },
    attributes: { type: Array, required: true },
    value: {
        type: Object, required: true,
        default: () => { }
    },
    chartType: { type: String, required: false, default: 'line' }
});
const getShapeIcon = (type) => {
    return new URL(`../../assets/charts/shapes/${type}.svg`, import.meta.url).href;
};

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
    ['scattermapbox', 'densitymapbox', 'choropleth'].includes(props.chartType)
);
const pieFamily = computed(() =>
    ['donut', 'pie'].includes(props.chartType)
);
const hasAxis = computed(() =>
    !['pie', 'donut', 'indicator', 'treemap', 'sunburst'].includes(props.chartType)
);
const xSeries = computed(() =>
    //FIXME x.value.slice(0, limitXDimension.value)
    x.value.slice(0, limitXDimension.value)
);
const ySeries = computed({
    get: () =>
        y.value.slice(0, limitYDimension.value), //.map((item) => ({ ...item, id: item.id || generateId() }))
    set: (newValue) => {
        y.value = newValue;
    }
});
const limitXDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (['pie', 'donut', 'scatter'].includes(props.type)) {
        result = 1;
    } else if (x.value.length >= 2 && props.type !== 'treemap') {
        result = 2;
    }
    return result;
});
const limitYDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (
        (['pie', 'donut', 'scatter', 'treemap'].includes(props.type))
        || (x.value.length >= 2)
    ) {
        result = 1;
    }
    return result;
});
const canAddXDimension = computed(() => {
    let result = true;
    result = (limitXDimension.value > x.value.length);
    return result;
});
const canAddYDimension = computed(() => {
    let result = true;
    result = (limitYDimension.value > y.value.length);
    return result;
});

/* Methods */
const handleYAxisDrag = (e) => true;
const isNumeric = function (attributeName) {
    const b = !!props.attributes && attributesMap.value[attributeName] &&
        attributesMap.value[attributeName].numeric;
    return b;
};
const isInteger = function (attributeName) {
    const b = !!props.attributes && attributesMap.value[attributeName] &&
        attributesMap.value[attributeName].integerType;
    return b;
};

const handleSelectAttribute = (x) => {
    if (!isNumeric(x.attribute)) {
        x.binning = null;
    }
};
const defaultValues = Object.fromEntries(
    ['x_axis', 'y_axis', 'x', 'y',
        'color_attribute', 'text_attribute', 'size_attribute',
        'latitude', 'longitude',
        'locations', 'geo_json_url', 'feature_id_key'
    ].map((attr) => [attr, { value: null }]));

editableVisualization.value = structuredClone({ ...defaultValues, ...props.value });

const handleAddY = () => editableVisualization.value.y.value.push(new YDimension({}));
const handleAddX = () => editableVisualization.value.x.value.push(new XDimension({}));
const handleDeleteY = (index) => {
    yDimensionDD.value[index].hide(true);
    editableVisualization.value.y.value.splice(index, 1);
};
const handleDeleteX = (index) => {
    xDimensionDD.value[index].hide(true);
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
const geoJsonSelector = ref();
const openGeoJSONSuggestions = () => {
    geoJsonSelector.value.show();
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

        editableVisualization.value = structuredClone({
            ...defaultValues,
            ...props.value
        });
        toEmit.value = false;
    }, { deep: true, immediate: true });

</script>
<style>
.small-dd-title {
    font-size: 8pt;
    /* padding-top: 6px;
    padding-bottom: 7px; */
}

.axis-form {

    zoom: .8;
    width: 480px;
}

.series-form {
    width: 640px;
    zoom: .8;
}
</style>
<style scoped>
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

.alert-warning {
    font-size: .9em
}
</style>
