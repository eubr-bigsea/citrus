<template>
    <div class="options-container  source-code-pro-font" ref="visualizationDesigner">
        <div class="options-visualization mt-1">
            <div>
                <h6>Construtor de visualizações</h6>
                <form class="clearfix visualization-form">
                    <div data-test="basic-options-section">
                        <label>{{ $tc('common.name') }}:</label>
                        <input v-model="workflowObj.name" type="text" class="form-control form-control-sm"
                            :placeholder="$tc('common.name')" maxlength="100">

                        <label for="">Fonte de dados:</label> &nbsp;
                        <vue-select v-if="workflowObj && workflowObj.readData"
                            v-model="workflowObj.readData.forms.data_source.value" :filterable="false"
                            :options="dataSourceList" :reduce="(opt) => opt.id" label="name" @search="loadDataSourceList"
                            @input="getAttributeList">
                            <template #no-options="{}">
                                <small>Digite parte do nome pesquisar ...</small>
                            </template>
                            <template #option="option">
                                <div class="d-center">
                                    <span class="span-id">{{ option.id }}</span> - {{ option.name }}
                                </div>
                            </template>
                            <template #selected-option="option">
                                <div class="selected d-center">
                                    {{ option.id }} - {{ option.name }}
                                </div>
                            </template>
                        </vue-select>

                        <label>{{ $tc('titles.cluster') }}: </label>
                        <v-select v-model="workflowObj.preferred_cluster_id" :options="clusters" label="name"
                            :reduce="(opt) => opt.id" :taggable="false" :close-on-select="true" :filterable="false">
                            <template #option="{ description, name }">
                                {{ name }}<br>
                                <small><em>{{ description }}</em></small>
                            </template>
                        </v-select>
                        <div class="mt-2 ">
                            <b-dropdown id="dropdown-left" text="Left align" variant="secondary" class="m-2 float-right"
                                size="sm" no-caret>
                                <template #button-content>
                                    <font-awesome-icon icon="ellipsis-h"></font-awesome-icon>
                                </template>
                                <b-dropdown-item href="#"><font-awesome-icon icon="chart-line" /> Adicionar ao
                                    dashboard...</b-dropdown-item>
                                <b-dropdown-item href="#"><font-awesome-icon icon="file-export" /> Exportar
                                    ...</b-dropdown-item>
                            </b-dropdown>
                            <b-button variant="primary" size="sm" class="float-right mt-2" @click="saveWorkflow"
                                data-test="save">
                                <font-awesome-icon icon="fa fa-save" /> {{ $t('actions.save') }}
                            </b-button>
                            <b-button size="sm" variant="outline-secondary" class="float-right mt-2 mr-1"
                                @click.prevent="loadData" data-test="refresh">
                                <font-awesome-icon icon="fa fa-redo" /> {{ $t('actions.refresh') }}
                            </b-button>
                            <!--
                        <router-link class="btn btn-sm btn-outline-secondary ml-1" :to="{ name: 'index-explorer' }"
                            :title="i18n.$t('actions.back')">
                            {{ i18n.$t('actions.back') }}
                        </router-link>
                        -->
                        </div>
                    </div>
                    <div v-if="visualizationObj" class="pt-2 border-top scroll-area">
                        <chart-builder-options v-model="options" :attributes="attributes" @update-chart="updateChart"
                            :chartType="visualizationObj.type.value" data-test="options-section" />
                    </div>
                </form>
            </div>
        </div>
        <div v-if="visualizationObj" class="options-main">
            <chart-builder-axis v-model="axis" :attributes="attributes" :workflow="workflowObj"
                :chartType="visualizationObj.type.value" />
            <div class="chart">
                <div class="chart-builder-visualization" style="height: 75vh">
                    <div v-if="display && plotlyData" ref="chart">
                        <plotly :options="chartOptions" :data="plotlyData.data" :layout="plotlyData.layout"
                            :frames="plotlyData.frames" :key="plotVersion" ref="plotly" :watchShallow="true"
                            data-test="visualization" />
                        <!--
                        <small v-if="!['xscattermapbox'].includes(visualizationObj.type.value)">{{ plotlyData.layout }}</small>
                            -->
                    </div>
                    <div v-else class="chart-not-available">
                        Selecione o tipo de gráfico e configure suas propriedades
                    </div>
                    <!--
                    <button class="btn btn-sm btn-secondary" @click.prevent="display = !display">Teste</button>
                    -->
                    <!--small>{{ visualizationObj }}</small -->
                </div>
            </div>
            <!--
                            <b-tabs>
                        <b-tab active>
                            <template #title>
                                <img ref="tabImage"
                                    style="width: 68px; height: 32px; filter: brightness(120%);filter: contrast(120%);">
                            </template>

                        </b-tab>
                        <b-tab title="OK">
                            <template #title>
                                Teste
                            </template>
                        </b-tab>
                    </b-tabs>
                    -->
            <div v-show="loadingData" class="preview-loading">
                <font-awesome-icon icon="lemon" spin class="text-success" />
                {{ i18n.$t('common.wait') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, computed, onBeforeMount, onMounted, onUnmounted } from "vue";
import { getCurrentInstance } from 'vue';
import ChartBuilderOptions from '../../../components/chart-builder/ChartBuilderOptions.vue';
import ChartBuilderAxis from '../../../components/chart-builder/ChartBuilderAxis.vue';

import { debounce } from "../../../util.js";
import Vue from 'vue';
import ExpressionEditor from '../../../components/widgets/ExpressionEditor.vue';

import Plotly from '../../../components/visualization/Plotly.vue';
import useNotifier from '../../../composables/useNotifier.js';
import useDataSource from '../../../composables/useDataSource.js';

import { Operation, VisualizationBuilderWorkflow, Visualization } from '../entities.js';
import axios from 'axios';
import VueSelect from 'vue-select';

import io from 'socket.io-client';
import { toPng } from 'html-to-image';

const vm = getCurrentInstance();
const router = vm.proxy.$router;
const route = vm.proxy.$route;
const progress = vm.proxy.$Progress;
const store = vm.proxy.$store;
const i18n = vm.proxy.$i18n.vm;
const { success, error } = useNotifier(vm.proxy);

const plotVersion = ref(0);
const display = ref(true)

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

const META_PLATFORM_ID = 1000;

const attributes = ref([]);
const clusters = ref([]);
const clusterId = ref(null);
const dataSource = ref(null);
const filterField = ref({ label: 'Filtrar', values: '{"alias": false}', required: false });
const internalWorkflowId = ref(null);
const isDirty = ref(false);
const job = ref(null);
const jobStatus = ref(null);
const loaded = ref(false);
const loadingData = ref(false);
const operationsMap = ref(new Map());
const plotlyData = shallowRef(null);
const socketIo = ref(null); // used by socketio (web sockets)
const targetPlatform = ref(4);
const workflowObj = ref({ forms: { $meta: { value: { target: '', taskType: '' } } } });
const visualizationObj = ref(null);
const chartOptions = ref({ responsive: true, height: 600 });

// Elements refs
const cluster = ref(null)
const visualizationDesigner = ref(ref)


const dataSourceId = computed({
    get() { return workflowObj.value.readData.forms.data_source.value; },
    set(newValue) { workflowObj.value.readData.forms.data_source.value = newValue; }
});
const axis = computed({
    get() {
        const { x_axis, y_axis, y, x, type, color_attribute, text_attribute, size_attribute,
            latitude, longitude } = visualizationObj.value;
        return {
            x_axis, y_axis, y, x, type,
            color_attribute, text_attribute, size_attribute,
            latitude, longitude
        };
    },
    set(value) {
        Object.assign(visualizationObj.value, value);
    }
});

const plotly = ref()
let changeCause = '';
const options = computed({
    get() {
        const { display_legend, smoothing, palette, color_scale, label, type, title, hole,
            text_position, text_info,
            top_margin, bottom_margin, left_margin, right_margin, auto_margin,
            template, blackWhite, subgraph, subgraph_orientation,
            animation, height, width, opacity, scatter_color, scatter_size,
            color_attribute, color_aggregation, size_attribute, number_format,
            fill_opacity, paper_color, style, tooltip_info, zoom, center_latitude, center_longitude,
            marker_size,
            limit, filter
        } = visualizationObj.value;
        return {
            display_legend, smoothing, palette, color_scale, label, type, title, hole,
            text_position, text_info, top_margin, bottom_margin, left_margin, right_margin,
            auto_margin, template, blackWhite, subgraph, subgraph_orientation, animation,
            height, width, opacity, scatter_color, scatter_size, color_attribute, color_aggregation,
            size_attribute, fill_opacity, number_format, paper_color,
            style, tooltip_info, zoom, center_latitude, center_longitude, marker_size,
            limit, filter
        };
    },
    set(value) {
        if (changeCause) {
            //handleChangeLayout(changeCause, value);
        }
        Object.assign(visualizationObj.value, value);
    }
});
const handleChangeLayout = (changeCause, value) => {
    console.debug('ok')
    if (changeCause === 'title' && plotlyData.value?.layout?.title) {
        plotlyData.value.layout.title.text = value[changeCause].value;
        //plotly.value.react();
    }
};
const updateChart = debounce((value, propertyPath) => {
    if (!plotlyData || !plotlyData?.value?.layout) {
        return;
    }
    /*
    if (property === 'title') {
        plotlyData.value.layout.title.text = options.value.title.value;
    } else if (property === 'hole') {
        plotlyData.value.data[0].hole = options.value.hole.value * 0.01;
    }*/
    let current = plotlyData.value.layout;
    propertyPath.slice(0, -1).forEach(p => current = current[p]);
    current[propertyPath.slice(-1)] = value;
    plotly.value.layout = plotlyData.value.layout;
    plotly.value.react()
}, 800);

const { getAttributeList, asyncLoadDataSourceList } = useDataSource();
const loadDataSourceList = debounce(async function (search, loading) {
    if (search) {
        dataSourceList.value = await asyncLoadDataSourceList(search, loading);
    }
}, 800);

onBeforeMount(async () => {
    disconnectWebSocket();
    internalWorkflowId.value = (route) ? route.params.id : 0;
    await load();
});

const teste = () => {
    plotlyData.value.layout.title.text = "OK Funcionou";
    plotly.value.layout = plotlyData.value.layout;
    plotly.value.react();
};

const updateThumb = () => {
    const $elem = this.$refs.chart;
    const $tabImage = this.$refs.tabImage;
    toPng($elem, { canvasWidth: 68 * 20, canvasHeight: 32 * 20 })
        .then(function (dataUrl) {
            $tabImage.src = dataUrl;
        });
};
const getIcon = (attr) => {
    switch (attr.type) {
        case 'DECIMAL':
        case 'INTEGER':
            return 'hashtag';
        case 'CHARACTER':
            return 'font';
        case 'DATE':
            return 'calendar';

    }
};
const load = async () => {
    loadingData.value = true;
    progress.start();
    try {
        await loadOperations();
        let resp = await axios.get(`${tahitiUrl}/workflows/${internalWorkflowId.value}`);
        workflowObj.value = new VisualizationBuilderWorkflow(resp.data, operationsMap.value);
        if (resp.data?.forms?.$meta?.plot) {
            console.debug(resp.data?.forms?.$meta?.plot);
            plotlyData.value = resp.data.forms.$meta.plot;
        }
        if (workflowObj.value.type !== 'VIS_BUILDER') {
            error(null, i18n.$t('modelBuilder.invalidType'));
            router.push({ name: 'index-explorer' });
            return;
        }
        await loadDataSource(dataSourceId.value);

        //const attributes = dataSource.value.attributes;
        // FIXME: 'group' task is not necessary anymore
        /*
        workflowObj.value?.group?.forms?.function?.value?.forEach(attr => {
            attr['name'] = attr.attribute;
            const v = attributes.find(a => a.name === attr.name);
            attr['type'] = v ? v.type : '';
        }); */

        loadClusters();
        visualizationObj.value = new Visualization(
            workflowObj.value.visualization.forms);
        loaded.value = true;

    } catch (e) {
        error(e);
        router.push({ name: 'index-explorer' });
    } finally {
        Vue.nextTick(() => {
            progress.finish();
            loadingData.value = false;
            isDirty.value = false;
        });
    }
};
const loadOperations = async () => {
    const params = {
        category: 'visualization-builder', platform: META_PLATFORM_ID,
        fields: 'id,forms,categories,name,slug'
    };

    const resp = await axios.get(`${tahitiUrl}/operations`, { params });
    resp.data.data.forEach(op => operationsMap.value.set(op.slug, new Operation(op)));
};
const dataSourceList = ref([]);

const loadDataSource = async (id) => {
    const resp = await axios.get(`${limoneroUrl}/datasources/${id}`);
    dataSource.value = resp.data;
    attributes.value = dataSource.value.attributes.sort((a, b) => a.name.localeCompare(b.name));
    attributes.value.forEach(a => {
        a.attribute = a.name;
        a.numeric = ['DECIMAL', 'INTEGER', 'DOUBLE', 'FLOAT', 'LONG']
            .includes(a.type);
        a.integerType = ['INTEGER', 'LONG'].includes(a.type);
    });
    dataSourceList.value = [dataSource.value];
};
const loadClusters = async () => {
    try {
        const resp = await axios.get(`${standUrl}/clusters?enabled=true&platform=${targetPlatform.value}`);
        clusters.value = resp.data.data;
    } catch (ex) {
        error(ex);
    }
};
const saveWorkflow = async () => {
    workflowObj.value.visualization.forms = visualizationObj.value;
    let cloned = structuredClone(workflowObj.value);

    if (!cloned.visualization.forms.filter || cloned.visualization.forms.filter.value === null
        || cloned.visualization.forms.filter.value.length === 0) {
        cloned.tasks = cloned.tasks.filter(t => t !== cloned.filter);
    } else {
        // Copy filter from visualization to correct operation
        cloned.filter.forms.formula = structuredClone(cloned.visualization.forms.filter);
    }
    if (!cloned.sort.forms.order_by || !Array.isArray(cloned.sort.forms.order_by.value)) {
        cloned.tasks = cloned.tasks.filter(t => t !== cloned.sort);
    }
    //cloned.forms = { $meta: { plot: plotlyData.value } };
    let url = `${tahitiUrl}/workflows/${cloned.id}`;

    cloned.platform_id = META_PLATFORM_ID;

    cloned.tasks.forEach((task) => {
        task.operation = { id: task.operation.id };
        delete task.version;
        delete task.step;
        delete task.status;
    });
    delete cloned.readData;
    delete cloned.sort;
    delete cloned.visualization;
    delete cloned.sample;
    delete cloned.filter;

    try {
        await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
        isDirty.value = false;
        success(i18n.$t('messages.savedWithSuccess', { what: i18n.$t('titles.workflow') }));
    } catch (e) {
        error(e);
    }
};
const handleUpdateFilter = (field, value) => {
    workflowObj.value.filter.forms.formula.value = value;
};
const loadData = async () => {
    if (!workflowObj.value.preferred_cluster_id) {
        error(`${i18n.$t('errors.missingRequiredValue')}: ${i18n.$t('workflow.preferredCluster')}`);
        return;
    }
    loadingData.value = true;
    Object.assign(workflowObj.value.visualization.forms, visualizationObj.value);
    if (workflowObj.value.sort.forms.order_by.value === 'asc' ||
        workflowObj.value.sort.forms.order_by.value === null) {
        workflowObj.value.sort.enabled = false;
    }
    const cloned = JSON.parse(JSON.stringify(workflowObj.value));
    cloned.platform_id = cloned.platform.id; //FIXME: review
    const filterTask = cloned.tasks.find(t => t.operation.slug === 'filter');
    const visualizationTask = cloned.tasks.find(t => t.operation.slug === 'visualization');
    if (!cloned.visualization.forms.filter || cloned.visualization.forms.filter.value === null
        || cloned.visualization.forms.filter.value.length === 0) {
        cloned.tasks = cloned.tasks.filter(t => t !== cloned.filter);
    } else {
        // Copy filter from visualization to correct operation
        filterTask.forms.formula = structuredClone(visualizationTask.forms.filter);
    }

    cloned.tasks.forEach((task) => {
        // Remove unnecessary attributes from operation
        task.operation = { id: task.operation.id };
        delete task.version;
    });

    const body = {
        workflow: cloned,
        cluster: { id: cloned.preferred_cluster_id },
        name: `## vis explorer ${workflowObj.value.id} ##`,
        user: store.getters.user, //: { id: user.id, login: user.login, name: user.name },
        persist: false, // do not save the job in db.
        app_configs: {
            verbosity: 0,
            target_platform: 'scikit-learn',
            variant: 'polars'
        },
    };

    try {
        const response = await axios.post(`${standUrl}/jobs`, body,
            { headers: { 'Locale': i18n.locale, } });
        job.value = response.data.data;
        connectWebSocket();
    } catch (ex) {
        if (ex.data) {
            error(ex.data.message);
        } else if (ex.status === 0) {
            this.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
        } else {
            error(`Unhandled error: ${ex}`);
        }
    } finally {
        progress.finish();
    }
};
/* WebSocket Handling */
const disconnectWebSocket = () => {
    if (socketIo.value) {
        socketIo.value.emit('leave', { room: job.value.id });
        socketIo.value.close();
    }
};

const connectWebSocket = () => {
    if (socketIo.value === null) {
        const opts = { upgrade: true };
        if (standSocketIoPath !== '') {
            opts['path'] = standSocketIoPath;
        }
        const socket = io(
            `${standSocketServer}${standNamespace}`, opts);

        socketIo.value = socket;
        socket.on('connect', () => { socket.emit('join', { cached: false, room: job.value.id }); });
        socket.on('update task', (msg, callback) => {// eslint-disable-line no-unused-vars
            if (msg.type === 'PLOTLY') {
                const messageJson = msg.message;
                plotlyData.value = messageJson;
                plotVersion.value++;
            }
        });
        socket.on('update job', msg => {
            jobStatus.value = '';
            if (msg.status === 'ERROR') {
                error(msg);
                loadingData.value = false;
            }
            if (msg.status === 'COMPLETED') {
                jobStatus.value = msg.message;
                loadingData.value = false;
            }
        });
    } else {
        //self.socket.emit('join', { room: self.job.id });
    }
};

</script>

<style scoped lang="scss">
.chart {
    margin-top: 10px;
    position: relative;
    height: 65vh;
    width: 100%;
    padding: 5px 0;
}

#chart-builder {
    width: 100%;
    height: calc(100vh - 110px);
    display: flex;

    .visualization-builder {
        width: 550px;
    }

    /*
        .datasource {
            overflow: auto;
            width: 250px;
            padding-right: 1rem;
            border-right: 1px solid rgba(black, .08);
        }

        .options {
            width: 300px;
            padding: 0 2rem;

            .type-selector {
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(black, .08);
            }
        }*/

    .visualization {
        width: 100%;
        display: flex;
        flex-direction: column;

        div {
            width: 100%;
        }

        .chart {
            height: 100%;
        }
    }
}

.options-visualization {
    flex: 0 0 250px;
    background-color: #fff;
    padding: 0px;
}

.options-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    gap: 10px;
    height: 92vh;
}

.options-main {
    flex: 3;
}

.visualization-form {
    font-size: .8em;
}

.chart-builder-visualization {
    //height: 600px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

.chart-not-available {
    background-color: #fff;
    border: 1px solid rgba(#000, .08);
    padding: 1rem;
    margin: 0;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: rgba(#000, .2);
}

.scroll-area {
    width: 100%;
    height: 65vh;
    overflow: auto;
}
</style>
