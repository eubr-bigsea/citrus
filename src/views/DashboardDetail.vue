<template>
    <div>
        <div class="row border-bottom border-primary p-2">
            <div class="col-md-10">
                <h2 class="title text-primary">Dashboards</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <h2>{{title}}</h2>
                <caipirinha-visualization v-for="url in urls" :url="url" :key="url"></caipirinha-visualization>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    
    import Notifier from '../mixins/Notifier'
    import axios from 'axios'
    import io from 'socket.io-client'

    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue'


    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

    export default {
        mixins: [Notifier],
        components: {
            'caipirinha-visualization': CapirinhaVisualization
        },
        data(){
            return {
                urls: [],
                title: ''
            }
        },
        mounted(){
            const dashboardId = this.$route.params.id;
            const url = `${caipirinhaUrl}/dashboards/${dashboardId}`

            axios
                .get(url)
                .then(response => {
                    this.title = response.data.title;
                    this.urls = response.data.visualizations.map(visualization => {
                        return `${caipirinhaUrl}/visualizations/${visualization.job_id}/${visualization.task_id}`
                    })})
                .catch( () => {
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