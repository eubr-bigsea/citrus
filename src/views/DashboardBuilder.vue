<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <h4>Dashboard builder</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-sm btn-secondary ml-1">
                    Adicionar SQL
                </button>
                <button class="btn btn-sm btn-secondary ml-1">
                    Adicionar filtro
                </button>
                <button class="btn btn-sm btn-secondary ml-1">
                    Adicionar texto
                </button>
                <button class="btn btn-sm btn-secondary ml-1">
                    Adicionar visualização
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <grid-layout ref="grid" v-model:layout="layout" :col-num="12" :row-height="30"
                             :is-draggable="!publicRoute" :is-resizable="!publicRoute" :is-mirrored="false" :is-responsive="true"
                             :vertical-compact="true" :margin="[10, 10]" :use-css-transforms="true" :prevent-collision="false"
                             class="dashboard-grid" @layout-updated="layoutUpdatedEvent">
                    <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y"
                               :w="item.w" :h="item.h"
                               :i="item.i">
                        <caipirinha-visualization :url="item.url" :public-route="publicRoute" data-source-type="sql" />
                    </grid-item>
                </grid-layout>
            </div>
        </div>
    </div>
</template>
<script>

import Notifier from '../mixins/Notifier.js';

import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue';
export default {
    components: {
        'caipirinha-visualization': CapirinhaVisualization,
    },
    mixins: [Notifier],
    data() {
        return {
            errorState: false,
            configuration: {},
            dashboard: { title: '', is_public: false, hash: '' },
            layout: [
                { x: 1, y: 1, w: 2, h: 3, i: 1 },
                { x: 2, y: 1, w: 2, h: 3, i: 3 },
                { x: 1, y: 2, w: 2, h: 3, i: 2 },
            ]
        };
    },
    methods: {
        uuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
    }
}
</script>
<style scoped>
    .dashboard-grid {
        border: 1px solid;
    }
</style>