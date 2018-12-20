<template>
  <div>
    <p v-if="loading">Loading</p>

    <div v-if="error" class="alert alert-danger" role="alert">{{ errorMessage }}</div>

    <highcharts v-if="!loading && chartOptions" :options="chartOptions"></highcharts>
    <div v-if="!loading && html" v-html="html"></div>
  </div>
</template>

<script>

import axios from 'axios'
import Vue from 'vue'

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import exporting from 'highcharts/modules/exporting';
import exportdata from 'highcharts/modules/export-data';
exporting(Highcharts);
exportdata(Highcharts);

Vue.use(HighchartsVue)

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

const getVisualizationType = function(typeId) {
  switch (typeId) {
    case 1:
      return "html";
    case 35:
      return "table-visualization";
    case 68:
      return "line-chart";
    case 69:
      return "bar-chart";
    case 70:
      return "pie-chart";
    case 71:
      return "area-chart";
    case 87:
      return "scatter-plot";
    case 88:
      return "map-chart";
    case 89:
      return "donut-chart";

    default:
      throw new TypeError("Invalid visualization ID");
  }
};

const Bar = function(data) {
  const getBarData = function(data) {
    const series = {};

    data.data.forEach(item => {
      item.values.forEach(value => {
        const name = value.x;

        if (series.hasOwnProperty(name) == false) series[name] = [];

        series[name].push(value.y);
      });
    });

    return Object.keys(series).map(key => ({
      name: key,
      data: series[key]
    }));
  };

  const options = {
    chart: {
      type: "column"
    },
    title: {
      text: data.title
    },
    xAxis: {
      categories: data.data.map(item => item.name)
    },
    series: getBarData(data)
  };

  return options;
};

const Line = function(data) {
  const options = {
    chart: {
      type: "line"
    },
    title: {
      text: data.title
    },
    xAxis: {
      title: {
        text: data.x.title
      }
    },
    yAxis: {
      title: {
        text: data.y.title
      }
    },
    series: data.data.map(serie => ({
      name: serie.name,
      data: serie.values
        .map(value => [value.x, value.y])
        .sort((a, b) => a[0] - b[0])
    }))
  };

  return options;
};

const Area = function(data) {
  const options = {
    chart: {
      type: "area"
    },
    plotOptions: {
      area: {
        stacking: "normal",
        marker: false
      }
    },
    title: {
      text: data.title
    },
    xAxis: {
      title: {
        text: data.x.title
      }
    },
    yAxis: {
      title: {
        text: data.y.title
      }
    },
    series: data.data.map(serie => ({
      name: serie.name,
      data: serie.values
        .map(value => [value.x, value.y])
        .sort((a, b) => a[0] - b[0])
    }))
  };

  return options;
};

const Scatter = function(data) {
  const options = {
    chart: {
      type: "scatter"
    },
    title: {
      text: data.title
    },
    xAxis: {
      title: {
        text: data.x.title
      }
    },
    yAxis: {
      title: {
        text: data.y.title
      }
    },
    series: data.data.map(serie => ({
      name: serie.name,
      data: serie.values
        .map(value => [value.x, value.y])
        .sort((a, b) => a[0] - b[0])
    }))
  };

  return options;
};

const Pie = function(data) {
  const options = {
    chart: {
      type: "pie"
    },
    title: {
      text: data.title
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)"
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: "Amount", // TODO: Não possui retorno da API
        data: data.data.map(serie => ({
          name: serie.name,
          y: serie.value
        }))
      }
    ]
  };

  return options;
};

const Donut = function(data) {
  const options = {
    chart: {
      type: "pie"
    },
    title: {
      text: data.title
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)"
    },
    plotOptions: {
      pie: {
        innerSize: "50%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: "Amount", // TODO: Não possui retorno da API
        data: data.data.map(serie => ({
          name: serie.name,
          y: serie.value
        }))
      }
    ]
  };

  return options;
};

const Table = function (data) {
   const header = data.data.attributes.map(attribute => `<th>${attribute}</th>`)
   const body = data.data.rows.map(row => {
     const columns = row.map(column => `<td>${column}</td>`)
     return `<tr>${columns.join('')}</tr>`
   })
 
    return `<table class='table'>
       <thead>
         ${header.join('')}
       </thead>
       <tbody>
         ${body.join('')}
       </tbody>
     </table>`
 }
 
  const Html = function (data) {
   return data.html;
 }
 
  const isHighcharts = function (data) {
   const visualizationType = getVisualizationType(data.type.id);
   const highchartsVisualizations = ['line-chart', 'pie-chart', 'bar-chart', 'donut-chart', 'area-chart', 'scatter-plot'];
 
    return highchartsVisualizations.includes(visualizationType);
 }
 
  const getHtmlVisualization = function (data) {
   const visualizationType = getVisualizationType(data.type.id);
 
    switch (visualizationType) {
     case 'html': return Html(data);
     case 'table-visualization': return Table(data);
 
      default: throw new TypeError(`Type ${visualizationType} is not supported yet.`);
   }
 }

const getVisualizationOptions = function(data) {
  const visualizationType = getVisualizationType(data.type.id);

  switch (visualizationType) {
    case "line-chart":
      return Line(data);
    case "pie-chart":
      return Pie(data);
    case "bar-chart":
      return Bar(data);
    case "donut-chart":
      return Donut(data);
    case "area-chart":
      return Area(data);
    case "scatter-plot":
      return Scatter(data);

    default:
      throw new TypeError(`Type ${visualizationType} is not supported yet.`);
  }
};

export default {
  name: "caipirinha-visualization",
  props: ["url"],
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: false,
      chartOptions: null,
      html: null
    };
  },

  created() {
    this.loading = true;
    this.error = false;
    this.chartOptions = null;

    axios
      .get(this.url)
      .then(response => {
        if (isHighcharts(response.data)) {
          this.chartOptions = getVisualizationOptions(response.data);
        } else {
          this.html = getHtmlVisualization(response.data);
        }

        this.loading = false;
      })
      .catch(response => {
        this.errorMessage = response.message;
        this.error = true;
        this.loading = false;
      });
  }
}
</script>