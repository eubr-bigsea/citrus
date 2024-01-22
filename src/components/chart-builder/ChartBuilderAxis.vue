<template>
    <div>
        <b-card class="mt-1">
            <template v-if="mapFamily">
                <div class="row">
                    <div class="col-6">
                        <small class="form-text text-muted">Latitude:</small>
                        <v-select v-model="editableVisualization.latitude.value" :options="attributes" label="name"
                            :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>

                        <small class="form-text text-muted">Longitude:</small>
                        <v-select v-model="editableVisualization.longitude.value" :options="attributes" label="name"
                            :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                            <template #option="{ type, name }">
                                <span v-if="name !== '*'"
                                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                {{ name }}
                            </template>

                            <template #selected-option="{ type, name }">
                                <div>
                                    <span v-if="name !== '*'"
                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                    {{ name }}
                                </div>
                            </template>
                        </v-select>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-6">
                                <small class="form-text text-muted">Cor (opcional):</small>
                                <v-select v-model="editableVisualization.color_attribute.value" :options="attributes"
                                    label="name" :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                                    <template #option="{ type, name }">
                                        <span v-if="name !== '*'"
                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                        {{ name }}
                                    </template>

                                    <template #selected-option="{ type, name }">
                                        <div>
                                            <span v-if="name !== '*'"
                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                            {{ name }}
                                        </div>
                                    </template>
                                </v-select>
                                <small class="form-text text-muted">Tamanho (raio, opcional):</small>
                                <v-select v-model="editableVisualization.size_attribute.value" :options="attributes"
                                    label="name" :reduce="(opt) => opt.name" :searchable="true" class="select2-small">
                                    <template #option="{ type, name }">
                                        <span v-if="name !== '*'"
                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                        {{ name }}
                                    </template>

                                    <template #selected-option="{ type, name }">
                                        <div>
                                            <span v-if="name !== '*'"
                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
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
                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                        {{ name }}
                                    </template>

                                    <template #selected-option="{ type, name }">
                                        <div>
                                            <span v-if="name !== '*'"
                                                :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                            {{ name }}
                                        </div>
                                    </template>
                                </v-select>
                            </div>
                        </div>
                        <!--
                        <dropdown-button size="sm" ref="axis" class="me-1" variant="outline-secondary small-dd-title"
                            title="Cor">
                            <template #button-content>
                                <font-awesome-icon class="me-2 text-success" prefix="fa" icon="droplet" /> Cor
                            </template>
                            <b-dropdown-form form-class="right-drop-form">
                                <div class="row half-series-form">
                                    <div class="col-12">
                                        <b-form-group :label="$t('common.attribute', 1) + ':'"
                                            label-for="dropdown-form-email">

                                            <v-select v-model="editableVisualization.color_attribute.value"
                                                :options="[{ name: '*', type: 'CHARACTER' }, ...attributes]" label="name"
                                                :reduce="(opt) => opt.name" :searchable="false">
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
                                        </b-form-group>
                                    </div>
                                </div>
                            </b-dropdown-form>
                        </dropdown-button>
                        <dropdown-button size="sm" ref="axis" class="me-1" variant="outline-secondary small-dd-title"
                            title="Tamanho">
                            <template #button-content>
                                <font-awesome-icon class="me-2 text-primary" prefix="fa" icon="ruler-combined" /> Tamanho
                            </template>
                            <b-dropdown-form form-class="right-drop-form">
                                <div class="row half-series-form">
                                    <div class="col-12">
                                        <b-form-group :label="$t('common.attribute', 1) + ':'"
                                            label-for="dropdown-form-email">

                                            <v-select v-model="editableVisualization.size_attribute.value"
                                                :options="[{ name: '*', type: 'CHARACTER' }, ...attributes]" label="name"
                                                :reduce="(opt) => opt.name" :searchable="false">
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
                                        </b-form-group>
                                    </div>
                                </div>
                            </b-dropdown-form>
                        </dropdown-button>
                        <dropdown-button size="sm" ref="axis" class="me-1" variant="outline-secondary small-dd-title"
                            title="Texto">
                            <template #button-content>
                                <font-awesome-icon class="me-2 text-warning" prefix="fa" icon="a" /> Texto
                            </template>
                            <b-dropdown-form form-class="right-drop-form">
                                <div class="row half-series-form">
                                    <div class="col-12">
                                        <b-form-group :label="$t('common.attribute', 1) + ':'"
                                            label-for="dropdown-form-email">

                                            <v-select v-model="editableVisualization.text_attribute.value"
                                                :options="[{ name: '*', type: 'CHARACTER' }, ...attributes]" label="name"
                                                :reduce="(opt) => opt.name" :searchable="false">
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
                                        </b-form-group>
                                    </div>
                                </div>
                            </b-dropdown-form>
                        </dropdown-button>
                    -->
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="clearfix">

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
                                            <b-form-group label="Casas decimais:">
                                                <input type="number" class="form-control form-control-sm w-50"
                                                    v-model.number="editableVisualization.y_axis.value.decimal_places" max="6" min="0"
                                                    debounce="500" />
                                            </b-form-group>
                                            -->
                                        <b-form-group label="Prefixo:">
                                            <input v-model="editableVisualization.y_axis.value.prefix" type="text"
                                                class="form-control form-control-sm" maxlength="20" debounce="500">
                                        </b-form-group>
                                        <b-form-group label="Sufixo:">
                                            <input v-model="editableVisualization.y_axis.value.suffix" type="text"
                                                class="form-control form-control-sm" maxlength="20" debounce="500">
                                        </b-form-group>
                                    </div>
                                </div>
                            </b-dropdown-form>
                            <b-dropdown-form v-else>
                                <div>O tipo de gráfico não possui configurações para o eixo.</div>
                            </b-dropdown-form>
                        </template>
                    </dropdown-button>
                    <div v-else class="axis-label">
                        Exibir
                    </div>
                    <div v-if="editableVisualization">
                        <draggable ghost-class="ghost" handle=".drag-handle" :list="ySeries" :move="handleYAxisDrag"
                            direction="horizontal" class="draggable-area" @start="drag = true" @end="drag = false"
                            :item-key="(item) => ySeries.indexOf(item)">
                            <template #item="{ element, index }">
                                <div :key="index" class="drag-handle" :data-test="`y-series-${index}`">
                                    <dropdown-button ref="yDimensionDD" size="sm" class="mt-2 me-1 pull-right"
                                        :variant="'outline-secondary small-dd-title ' + (element.enabled ? '' : 'disabled')"
                                        :keep-open="true">
                                        <template #button-content>
                                            {{ element.attribute === '*' ? 'COUNT' : element.aggregation.toUpperCase() }}
                                            {{ element.aggregation !== '' ? `(${element.attribute})` : element.attribute }}
                                        </template>
                                        <template #content>
                                            <b-dropdown-form form-class="right-drop-form">
                                                <div class="row series-form">
                                                    <div class="col-6">
                                                        <b-form-group :label="$t('common.attribute', 1) + ':'"
                                                            label-for="dropdown-form-email">
                                                            <v-select v-model="element.attribute"
                                                                :options="[{ name: '*', type: 'CHARACTER' }, ...attributes]"
                                                                label="name" :reduce="(opt) => opt.name"
                                                                :searchable="false">
                                                                <template #option="{ type, name }">
                                                                    <span v-if="name !== '*'"
                                                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                                    {{ name }}
                                                                </template>

                                                                <template #selected-option="{ type, name }">
                                                                    <div>
                                                                        <span v-if="name !== '*'"
                                                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                                        {{ name }}
                                                                    </div>
                                                                </template>
                                                            </v-select>
                                                            <!--
                                                        <select class="form-control form-control-sm mt-2" v-model="element.attribute">
                                                            <option value="*"># Total de registros</option>
                                                            <option v-for="attr in attributes" :value="attr.name">
                                                                {{ attr.name }}
                                                                ({{ attr.type }})
                                                            </option>
                                                        </select>
                                                    -->
                                                        </b-form-group>
                                                        <b-form-group>
                                                            <b-form-checkbox v-model="element.enabled">
                                                                Habilitado
                                                            </b-form-checkbox>
                                                        </b-form-group>
                                                        <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                                            <b-form-input v-model="element.label" type="text"
                                                                class="form-control form-control-sm" maxlength="100"
                                                                debounce="500" />
                                                        </b-form-group>

                                                        <b-form-group label="Função de agregação:">
                                                            <select v-model="element.aggregation"
                                                                class="form-select form-select-sm">
                                                                <option v-if="element.attribute !== '*'" label="" value="">
                                                                    Usar valor sem
                                                                    agregar
                                                                </option>
                                                                <option value="COUNT">
                                                                    Contar (COUNT)
                                                                </option>
                                                                <option value="COUNTD">
                                                                    Contar distintos (COUNT DISTINCT)
                                                                </option>
                                                                <option v-if="element.attribute !== '*'" value="AVG">
                                                                    Média (AVG)
                                                                </option>
                                                                <option v-if="element.attribute !== '*'" value="SUM">
                                                                    Soma (SUM)
                                                                </option>
                                                                <option v-if="element.attribute !== '*'" value="MIN">
                                                                    Mínimo (MIN)
                                                                </option>
                                                                <option v-if="element.attribute !== '*'" value="MAX">
                                                                    Máximo (MAX)
                                                                </option>
                                                            </select>
                                                        </b-form-group>
                                                        <b-form-group v-if="false" label="Computação:">
                                                            <select v-model="element.compute"
                                                                class="form-select form-select-sm">
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
                                                        <b-form-group label="Multiplicar:">
                                                            <b-form-input v-model.number="element.multiplier" type="number"
                                                                class="form-control form-control-sm" max="1000000000000"
                                                                min="1" debounce="500" />
                                                        </b-form-group>
                                                        <b-form-group label="Casas decimais:">
                                                            <b-form-input v-model.number="element.decimal_places"
                                                                type="number" class="form-control form-control-sm w-25"
                                                                max="6" min="0" debounce="500" />
                                                        </b-form-group>
                                                    </div>
                                                    <div class="col-6">
                                                        <b-form-group v-if="!pieFamily" label="Prefixo:">
                                                            <b-form-input v-model="element.prefix" type="text"
                                                                class="form-control form-control-sm" maxlength="20"
                                                                debounce="500" />
                                                        </b-form-group>
                                                        <b-form-group v-if="!pieFamily" label="Sufixo:">
                                                            <b-form-input v-model="element.suffix" type="text"
                                                                class="form-control form-control-sm" maxlength="20"
                                                                debounce="500" />
                                                        </b-form-group>
                                                        <b-form-group v-if="!['donut', 'pie'].includes(chartType)">
                                                            <template #label>
                                                                <b-form-checkbox v-model="element.custom_color">
                                                                    Usar cor personalizada
                                                                </b-form-checkbox>
                                                            </template>
                                                            <b-form-input v-if="element.custom_color"
                                                                v-model="element.color" type="color"
                                                                class="form-control form-control-sm" />
                                                        </b-form-group>
                                                        <b-form-group v-if="!pieFamily" label="Tipo de linha:">
                                                            <select v-model="element.stroke"
                                                                class="form-select form-select-sm w-50">
                                                                <option
                                                                    v-for="opt in ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot']"
                                                                    :key="opt" :value="opt">
                                                                    {{ opt }}
                                                                </option>
                                                            </select>
                                                        </b-form-group>
                                                        <b-form-group label="Espessura da linha:">
                                                            <select v-model.number="element.strokeSize"
                                                                class="form-control form-control-sm w-50">
                                                                <option v-for="inx in 11" :key="inx - 1" :value="inx - 1">
                                                                    {{ inx - 1 }}
                                                                </option>
                                                            </select>
                                                        </b-form-group>
                                                        <b-form-group label="Cor da Linha:" label-for="line-width">
                                                            <b-form-input v-model="element.line_color" type="color"
                                                                class="form-control form-control-sm w-50" />
                                                        </b-form-group>
                                                        <b-form-group
                                                            v-if="chartType.endsWith('bar') || chartType.endsWith('area')"
                                                            label="Padrão de preenchimento:">
                                                            <v-select v-model="element.shape" :options="shapes"
                                                                label="label" :reduce="(opt) => opt.name"
                                                                :searchable="false" style="font-size:10pt">
                                                                <template #option="{ label, icon }">
                                                                    <img :src="getShapeIcon(icon)"
                                                                        style="width:20px; height: 20px">
                                                                    {{ label }}
                                                                    <!--<div class="bg-chart" :class="`bg-${name}`"></div>-->
                                                                </template>

                                                                <template #selected-option="{ label, icon }">
                                                                    <div>
                                                                        <img :src="getShapeIcon(icon)"
                                                                            style="width:20px; height: 20px">
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
                                                        <b-button size="sm" variant="danger" class="float-end"
                                                            @click="handleDeleteY(i)">
                                                            {{ $t('actions.delete') }}
                                                        </b-button>
                                                    </div>
                                                </div>
                                            </b-dropdown-form>
                                        </template>
                                    </dropdown-button>
                                    <font-awesome-icon v-if="canAddYDimension" icon="fa fa-grip-vertical" />
                                </div>
                            </template>
                        </draggable>
                        <b-button v-if="canAddYDimension" size="sm" variant="success small-dd-title"
                            class="mt-2 float-start" data-test="add-y" @click="handleAddY">
                            <font-awesome-icon prefix="fa" icon="plus" />
                        </b-button>
                    </div>
                </div>
                <div class="clearfix">
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
                                            <b-form-group v-if="editableVisualization.x_axis.value.attribute" label="Casas decimais:">
                                                <input type="number" class="form-control form-control-sm w-50"
                                                    v-model.number="editableVisualization.x_axis.value.decimal_places" max="6" min="0"
                                                    debounce="500" />
                                            </b-form-group>
                                        -->
                                        <b-form-group label="Prefixo:">
                                            <input v-model="editableVisualization.x_axis.value.prefix" type="text"
                                                class="form-control form-control-sm" maxlength="20" debounce="500">
                                        </b-form-group>
                                        <b-form-group label="Sufixo:">
                                            <input v-model="editableVisualization.x_axis.value.suffix" type="text"
                                                class="form-control form-control-sm" maxlength="20" debounce="500">
                                        </b-form-group>
                                    </div>
                                </div>
                            </b-dropdown-form>
                            <b-dropdown-form v-else>
                                <div>O tipo de gráfico não possui configurações para o eixo.</div>
                            </b-dropdown-form>
                        </template>
                    </dropdown-button>
                    <div v-else class="axis-label">
                        Por
                    </div>
                    <div v-if="editableVisualization">
                        <draggable ghost-class="ghost" handle=".drag-handle" :list="xSeries" :move="handleYAxisDrag"
                            direction="horizontal" class="draggable-area" @start="drag = true" @end="drag = false"
                            :item-key="(item) => xSeries.indexOf(item)">
                            <template #item="{ element, index }">
                                <div :key="index" class="drag-handle">
                                    <dropdown-button :id="`x-series-${index}`" ref="xDimensionDD" size="sm small-dd-title"
                                        class="mt-2 me-1 pull-right"
                                        :variant="element.attribute ? 'outline-secondary' : 'outline-danger'" :keep-open="true">
                                        <template #button-content>
                                            {{ getDisplayXDimensionLabel(element, 'Selecione...', 'grupos', 'tamanho',
                                                'Categórico')
                                            }}
                                        </template>
                                        <template #content>
                                            <b-dropdown-form form-class="right-drop-form">
                                                <div class="row series-form">
                                                    <div class="col-6">
                                                        <b-form-group :label="$t('common.attribute', 1) + ':'">
                                                            <v-select v-model="element.attribute" :options="attributes"
                                                                label="name" :reduce="(opt) => opt.name" :searchable="false"
                                                                :selected="handleSelectAttribute(element)"
                                                                @selected="handleSelectAttribute(element)">
                                                                <template #option="{ type, name }">
                                                                    <span
                                                                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                                    {{ name }}
                                                                </template>

                                                                <template #selected-option="{ type, name }">
                                                                    <div>
                                                                        <span
                                                                            :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }" />
                                                                        {{ name }}
                                                                    </div>
                                                                </template>
                                                            </v-select>
                                                            <!--
                                                        <select class="form-control form-control-sm" v-model="element.attribute"
                                                            @change="handleSelectAttribute(x)">
                                                            <option v-for="attr in attributes" :value="attr.name">
                                                                {{ attr.name }}
                                                                ({{ attr.type }})
                                                            </option>
                                                        </select>
                                                    -->
                                                        </b-form-group>
                                                        <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                                            <b-form-input v-model="element.displayLabel" type="text"
                                                                class="form-control form-control-sm" maxlength="100"
                                                                debounce="500" />
                                                        </b-form-group>
                                                        <div v-if="true && isNumeric(element.attribute)">
                                                            <b-form-group label="Agrupamento (bins):">
                                                                <select v-model="element.binning"
                                                                    class="form-select form-select-sm">
                                                                    <option value="EQUAL_INTERVAL">
                                                                        Número fixo de
                                                                        grupos com intervalos iguais
                                                                    </option>
                                                                    <option value="FIXED_SIZE">
                                                                        Grupos com comprimento de intervalo fixo
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
                                                            <b-form-group v-if="element.binning === 'EQUAL_INTERVAL'"
                                                                label="Número de grupos (bins):">
                                                                <b-form-input v-model.number="element.bins" type="number"
                                                                    class="form-control form-control-sm w-25" max="1000"
                                                                    min="1" debounce="500" />
                                                            </b-form-group>
                                                            <b-form-group v-if="element.binning === 'FIXED_SIZE'"
                                                                label="Tamanho dos grupos:">
                                                                <b-form-input v-model.number="element.bin_size"
                                                                    type="number" class="form-control form-control-sm w-25"
                                                                    max="1000" min="1" debounce="500" />
                                                            </b-form-group>
                                                            <b-form-group v-if="element.binning === 'QUANTILES'"
                                                                label="Quantis (inteiros separados por vírgula):">
                                                                <b-form-input v-model="element.quantiles" type="text"
                                                                    class="form-control form-control-sm w-100" max="1000"
                                                                    min="1" debounce="500" />
                                                            </b-form-group>

                                                            <b-form-group v-if="false" label="Computação:">
                                                                <select v-model="element.compute"
                                                                    class="form-select form-select-sm">
                                                                    <option label="NORMAL" value="NORMAL">
                                                                        NORMAL
                                                                    </option>
                                                                    <option label="PERCENTAGE SCALE"
                                                                        value="PERCENTAGE SCALE">
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
                                                                <b-form-input v-model.number="element.multiplier"
                                                                    type="number" class="form-control form-control-sm w-25"
                                                                    max="1000000000000" min="1" debounce="500" />
                                                            </b-form-group>
                                                            <b-form-group label="Casas decimais:">
                                                                <b-form-input v-model.number="element.decimal_places"
                                                                    type="number" class="form-control form-control-sm w-25"
                                                                    max="6" min="0" debounce="500" />
                                                            </b-form-group>
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
                                                            <select v-model="element.sorting"
                                                                class="form-select form-select-sm">
                                                                <option label="Ordenação natural" value="NATURAL"
                                                                    selected="selected">
                                                                    Ordenação natural
                                                                </option>
                                                                <option label="Valor do eixo Y (ascendente)" value="Y_ASC">
                                                                    Valor do eixo
                                                                    Y
                                                                    (ascendente)
                                                                </option>
                                                                <option label="Valor do eixo Y (descendente)"
                                                                    value="Y_DESC">
                                                                    Valor do
                                                                    eixo Y
                                                                    (descendente)
                                                                </option>
                                                            </select>
                                                        </b-form-group>

                                                        <b-form-group label="Limitar qtde. de valores:">
                                                            <input v-model.number="element.max_displayed" type="number"
                                                                class="form-control form-control-sm">
                                                        </b-form-group>
                                                        <b-form-group v-if="element.max_displayed !== 0">
                                                            <b-form-checkbox v-model="element.group_others">
                                                                Agrupar os outros valores
                                                            </b-form-checkbox>
                                                        </b-form-group>
                                                        <b-form-group
                                                            v-if="element.max_displayed !== 0 && element.group_others"
                                                            label="Nome para 'outros valores'">
                                                            <input v-model="element.label_others" type="text"
                                                                class="form-control form-control-sm">
                                                        </b-form-group>
                                                        <template v-if="!pieFamily">
                                                            <b-form-group label="Prefixo:">
                                                                <b-form-input v-model="element.prefix" type="text"
                                                                    class="form-control form-control-sm" maxlength="20"
                                                                    debounce="500" />
                                                            </b-form-group>
                                                            <b-form-group v-if="!pieFamily" label="Sufixo:">
                                                                <b-form-input v-model="element.suffix" type="text"
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
                                                        <b-button size="sm" variant="danger" class="float-end"
                                                            @click="handleDeleteX(i)">
                                                            {{ $t('actions.delete') }}
                                                        </b-button>
                                                    </div>
                                                </div>
                                            </b-dropdown-form>
                                        </template>
                                    </dropdown-button>
                                    <font-awesome-icon v-if="canAddXDimension" icon="fa fa-grip-vertical" />
                                </div>
                            </template>
                        </draggable>
                        <b-button v-if="canAddXDimension" size="sm" variant="success small-dd-title"
                            class="mt-2 float-start clearfix" data-test="add-x" @click="handleAddX">
                            <font-awesome-icon prefix="fa" icon="plus" />
                        </b-button>
                    </div>
                </div>
            </template>
        </b-card>
    </div>
</template>
<script setup>
import { ref, computed, watch, defineProps, defineEmits, onBeforeMount } from "vue";
import { XDimension, YDimension } from '@/views/data-explorer/entities.js';
import Draggable from 'vuedraggable';
import { deepToRaw } from '@/util.js';
import DropdownButton from '@/components/DropdownButton.vue';

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
            latitude_attribute: { value: null }, longitude_attribute: { value: null }
        })
    },
    chartType: { type: String, required: false, default: null }
});
const getShapeIcon = (type) => {
    return new URL(`@/assets/charts/shapes/${type}.svg`, import.meta.url).href;
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


editableVisualization.value = structuredClone(deepToRaw(props.value));


/* Computed */

const mapFamily = computed(() =>
    ['scattermapbox'].includes(props.chartType)
);
const pieFamily = computed(() =>
    ['donut', 'pie'].includes(props.chartType)
);
const hasAxis = computed(() =>
(editableVisualization.value !== null && editableVisualization.value !== undefined
    && !['pie', 'donut', 'indicator'].includes(props.chartType))
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
            if (value && !value[t]) {
                value[t] = { value: null };
            }
        });

        editableVisualization.value = structuredClone(deepToRaw(value));
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
    float: left;
    width: 60px;
    margin-top: 8px;
}
</style>
