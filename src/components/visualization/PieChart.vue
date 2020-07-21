<template>
        <div>
        <Plotly :data="data" :layout="layout" :display-mode-bar="true"></Plotly>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    export default {
        mixins: [VisualizationMixin],
        data() {
            return {
                data: this.getData(),
                layout: {
                    title: { text: this.visualizationData.title },
                },
            };
        },
        methods: {
            getData() {
                const values = [];
                const labels = []
                this.visualizationData.data.map((item) => {
                    values.push(item.value);
                    labels.push(item.label);
                });
                return [{
                    values, labels, type: 'pie',
                    hole: this.visualizationData.pie_type === 'donut' ? .60 : null
                }];
            }
        },
    }
</script>
