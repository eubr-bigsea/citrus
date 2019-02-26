<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h6 class="header-pretitle" >{{$tc('titles.dashboard', 1)}}</h6>
                <input-header v-model="title" ></input-header>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-dark" @click.stop="save">
                    <span class="far fa-save"></span>
                </button>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        
                        <grid-layout
                            :layout.sync="layout"
                            :col-num="12"
                            :row-height="30"
                            :is-draggable="true"
                            :is-resizable="true"
                            :is-mirrored="false"
                            :is-responsive="true"
                            :vertical-compact="false"
                            :margin="[10, 10]"
                            :use-css-transforms="true"
                            @layout-updated="layoutUpdatedEvent"
                        >

                            <grid-item v-for="item in layout"
                                :x="item.x"
                                :y="item.y"
                                :w="item.w"
                                :h="item.h"
                                :i="item.i"
                            >
                                <caipirinha-visualization :url="item.url"></caipirinha-visualization>
                            </grid-item>
                        </grid-layout>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .vue-grid-item.vue-grid-placeholder {
        background-color: rgb(255,127,42);
    }
    .vue-grid-item > div{
        overflow: auto;
    }
</style>

<script>
    import Vue from 'vue'
    
    import Notifier from '../mixins/Notifier'
    import axios from 'axios'
    import io from 'socket.io-client'

    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue'
    import InputHeader from '../components/InputHeader.vue'
    import VueGridLayout from 'vue-grid-layout';

    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

    export default {
        mixins: [Notifier],
        components: {
            'caipirinha-visualization': CapirinhaVisualization,
            InputHeader,
        },
        data(){
            return {
                title: '',
                configuration: {},
                layout: []
            }
        },
        methods: {
            layoutUpdatedEvent: function(newLayout){
                newLayout.forEach(item => {
                    this.configuration[item.i] = {
                        ...this.configuration[item.i],
                        x: item.x,
                        y: item.y,
                        width: item.w,
                        height: item.h
                    }
                });

                //this.layout = this.getLayout();
                window.dispatchEvent(new Event('resize'));
            },
            save: function(event){
                axios
                .patch(`${caipirinhaUrl}/dashboards/${this.$route.params.id}`, {
                    title: this.title,
                    configuration: this.configuration
                })
                .then(response => {
                    this.success(this.$t('messages.savedWithSuccess',{what: this.$tc('titles.dashboard') }));
                })
                .catch((e) => {
                    this.error(e);
                })
            },
            getLayout: function() {
                return Object.keys(this.configuration).map(key => {
                    const {x, y, width, height, vizId, jobId, taskId} = this.configuration[key];

                    return {
                        x: x,
                        y: y,
                        w: width,
                        h: height,
                        i: vizId,
                        url: `${caipirinhaUrl}/visualizations/${jobId}/${taskId}`
                    }
                })
            },
            configurationIsInvalid(configuration) {
                if (configuration == null || configuration.constructor === Array)
                    return true;
                return false;
            },
            createInitialConfiguration(response) {
                return response.data.visualizations.reduce((configuration, viz, i) => {
                    return {
                        ...configuration,
                        [viz.id]: {
                            vizId: viz.id + "",
                            jobId: viz.job_id,
                            taskId: viz.task_id,
                            x: 3,
                            y: 10 * i,
                            width: 6,
                            height: 10
                        }
                    }
                }, {})
            },
            getConfiguration(response) {
                if (this.configurationIsInvalid(response.data.configuration))
                    return this.createInitialConfiguration(response)
                else
                    return response.data.configuration;
            }
        },
        mounted(){
            axios
                .get(`${caipirinhaUrl}/dashboards/${this.$route.params.id}`)
                .then(response => {
                    this.title = response.data.title;
                    this.configuration = this.getConfiguration(response);
                    this.layout = this.getLayout()
                })
                .catch((e) => {
                    this.error(e);
                })
        }
    }
</script>
<style>
    .badge-custom {
        min-width: 80px
    }

    .html-div {
        border: 1px solid #ccc;
        padding: 5px;
        margin: 10px;
        width: 90%;
        overflow: auto;
        font-size: .8em;
    }

    .html-div .table td,
    .html-div .table th {
        padding: .3rem;
    }

    .alternate {
        background: #eee;
    }

    .alternate>div>div {
        background: #fff
    }

    .alternate>div {
        padding: 5px;
        padding-bottom: 0;
        padding-left: 0
    }

    .circle {
        float: left;
        border-radius: 10px;
        height: 20px;
        width: 20px;
        margin: 2px 2px 0 2px;
    }

    .badge-warn {
        background-color: #FFDC00;
    }

    .job-log {
        order: 1;
    }

    .job-log.disabled {
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;
        opacity: 0.4;
        order: 2;
    }

    .flex {
        display: flex;
        flex-direction: column
    }
</style>