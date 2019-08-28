<template>
    <div class="text-center">
        <highcharts :options="options"></highcharts>
    </div>
</template>
<script>
    export default {
        props: {
            deadline: Number,
            categories: Array,
            cores: Array,
            data: Array,
        },
        computed: {
            options() {
                const self = this;
                const result = {
                    chart: {
                        type: 'column',
                        height: 300,
                        title: ''
                    },
                    exporting: { enabled: false },
                    credits: { enabled: false },
                    legend: {
                        itemStyle: {
                            fontSize: '9px'
                        }
                    },
                    title: { text: '' },
                    xAxis: {
                        categories: this.cores,
                        crosshair: true
                    },
                    yAxis: {
                        title: { text: 'Execution time (minutes)' }
                    },
                    tooltip: {
                        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">Cores: {point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} min.</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true,
                        style: {fontSize: '7pt'},
                        positioner: (boxWidth, boxHeight, point) =>{
                            return {x: 200, y:0}
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.1,
                        },
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        this.select();
                                        self.$root.$emit('onclick-setup', 
                                        {'cores': this.category, 'setup': this.series.name})
                                    }
                                }
                            }
                        }
                    },
                    series: [

                    ]
                };
                this.data.forEach((serie, i) =>
                    result['series'].push({
                        name: this.categories[i],
                        data: serie
                    }));
                result['yAxis']['plotLines'] = [{
                    color: '#FF4136',
                    value: this.deadline,
                    width: 2,
                    zIndex: 10,
                }];
                return result;
                //end options
            }
        }
    }
</script>