<template>
    <div class="row">
        <div class="col-md-3">
            <b-dropdown text="Mais ações" class="float-right more-actions" size="sm" variant="outline-primary">
                <b-dropdown-item>Sort rows by...</b-dropdown-item>
                <b-dropdown-item>Group data by</b-dropdown-item>
                <b-dropdown-item>Join</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>Sample</b-dropdown-item>
                <b-dropdown-item>Top N</b-dropdown-item>
                <b-dropdown-item>Window</b-dropdown-item>
                <b-dropdown-item>Stacking (união)</b-dropdown-item>
            </b-dropdown>
            <!--
            <b-button-toolbar class="mb-1">
                <b-button class="btn-sm mr-1" variant="outline-secondary">
                    <span class="fa fa-sort"></span> Sort rows by...
                </b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Group data by</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Distinct</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Join</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Sample</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Top N</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Window</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Stacking (união)</b-button>
            </b-button-toolbar>
        -->
            <h5>Steps</h5>
            <div class="mt-3">
                <VuePerfectScrollbar ref="scrollBar" useBothWheelAxes="true">
                    <draggable v-model="steps" @start="drag=true" @end="drag=false" class="list-group"
                        ghost-class="ghost">
                        <transition-group>
                            <div v-for="step in steps" :key="step.id" class="list-group-item steps" 
                                :title="step.operationSlug + '' + JSON.stringify(step.parameters)">
                                <span v-html="step.description"></span>.
                            </div>
                        </transition-group>
                    </draggable>
                </VuePerfectScrollbar>
            </div>
            <b-button v-if="steps && steps.length" variant="primary" size="sm" class="mt-2"><span class="fa fa-save"></span> {{$t('actions.save')}}
            </b-button>
            <div v-else class="alert alert-warning">Nenhum passo. Adicione usando as opções.</div>
            <!--
            <ol style="font-size: .9em">
                <li v-for="step in steps" :key="step.id">
                    <span v-html="step.description"></span>.
                    <div class="badge badge-info" :title="JSON.stringify(step.parameters)">{{step.operationSlug}}</div>
                </li>
            </ol>
        -->
        </div>
        <div class="col-md-9">
            <preview :fields="fields" :items="items" :service="service" />
        </div>
    </div>
</template>
<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import draggable from 'vuedraggable';
    import Preview from './Preview';
    import Notifier from '../../mixins/Notifier.js';
    import Commands from './Commands.js';
    export default {
        mixins: [Notifier],
        components: { Preview, draggable, VuePerfectScrollbar },
        data() {
            return {
                steps: [],
                service: null,
            }
        },
        props: {
            fields: { type: Array, default: () => ['a'] },
            items: { type: Array }
        },
        mounted() {
            this.service = new Commands(this.steps, this.fields, 'pt');
        },

    }
</script>
<style>
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
    }

    .list-group-item {
        cursor: move;
        font-size: .8em;
    }

    .list-group-item:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .list-group-item:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .list-group-item.steps {
        padding: 8px 5px;
    }
    .list-group-item.steps b {
        background-color: #17a2b8;
        border: 2px solid #17a2b8;
        border-radius: 5px;
        color: #fff;
        font-size: .8em;
        font-weight: normal;
        padding: 1px 5px;
    }
    .more-actions li {
        font-size: .8em !important;
    }
</style>