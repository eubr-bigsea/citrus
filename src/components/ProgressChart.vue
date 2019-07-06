<template>
    <div class="text-center xprogress">
        <div class="sparkline" v-for="(v, k) in progressLogs">
			{{k}}
            <highcharts :options="options(k, v)"></highcharts>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        logs: {}
    },
    computed: {
        progressLogs(){
            const logs = this.logs.filter(l => l.type === 'PROGRESS')
                .map(l => JSON.parse(l.message))
                .sort((a, b) => a.x - b.x);
            const series = {}
            if (logs && logs.length) {
                const keys = Object.keys(logs[0])
                logs.forEach((l) => {
                    keys.forEach((k) => { 
                         if (!series[k])
                              series[k] = []
                         series[k].push(l[k])
                    });
                })
            }
			if (series['x'])
				delete series['x']
            return series;
        },
},
methods: {
        options(k, v){
            return {
    chart: {
backgroundColor: null,
                borderWidth: 0,
                className: 'sparkline-container',
                type: 'area',
                margin: [2, 0, 2, 0],
                width: 200,
                height: 60,
                style: {
                    overflow: 'visible'
                },

                // small optimalization, saves 1-2 ms each sparkline
                skipClone: true
    },
    title: {
        text: ''
    },
    xAxis: {
        allowDecimals: false,
        labels: {
            formatter: function () {
                return this.value; // clean, unformatted number for year
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    credits: {
                enabled: false
            },
    tooltip: {
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },
    plotOptions: {
        area: {
            pointStart: 1940,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
           legend: {
                enabled: false
            },
            tooltip: {
                hideDelay: 0,
                outside: true,
                shared: true
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    animation: false,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 1,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0.25
                },
                column: {
                    negativeColor: '#910000',
                    borderColor: 'silver'
                }
            },
    series: [{
        name: k,
        data: v    } ]}
    }
}
}
</script>
<style >
.sparkline {
  width: 50%;
float: left;  
  padding: 10px 0 40px 0;
}
 .sparkline-container {
  margin: 0 auto;
}
</style>
