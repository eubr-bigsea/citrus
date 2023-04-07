export default {
    types: [
        {
            name: "line", label: "Linhas",
            objectives: ['fluxo', 'relacionamento', 'comparação', 'tendência'],
            dataTypes: ['contínuos']
        },
        { name: "bar", label: "Barras", dataTypes: ['categóricos'], objectives: ['tendência', 'comparação', 'distribuição'] },
        { name: "stacked-bar", label: "Barras Empilhadas", dataTypes: ['categóricos'], objectives: ['tendência', 'comparação', 'distribuição', 'composição'] },
        { name: "horizontal-bar", label: "Barras Horizontais", dataTypes: ['categóricos'], objectives: ['tendência', 'comparação', 'distribuição'] },
        { name: "stacked-horizontal-bar", label: "Barras Horizontais Empilhadas", dataTypes: ['categóricos'], objectives: ['tendência', 'comparação', 'distribuição', 'composição'] },
        {
            name: "stacked-area", label: "Área empilhado",
            dataTypes: ['categóricos'], objectives: ['composição']
        },
        { name: "stacked-area-100", label: "Área empilhado 100%", dataTypes: ['contínuos'], objectives: ['comparação', 'composição'] },
        { name: "pie", label: "Pizza", dataTypes: ['categóricos'], objectives: ['comparação', 'composição'] },
        { name: "donut", label: "Rosca (Donut)", dataTypes: ['categóricos'], objectives: ['composição', 'comparação',] },
        { name: "indicator", label: "Indicador",  dataTypes: ['contínuos'], objectives: ['tendência', ]},
        { name: "boxplot", label: "Box plot",  dataTypes: ['contínuos'], objectives: ['comparação', 'distribuição']},
        { name: "bubble", label: "Bolhas", dataTypes: ['contínuos'], objectives: ['comparação', 'distribuição'] },
        {
            name: "scatter", label: "Dispersão",
            dataTypes: ['contínuos'], objectives: ['comparação']
        },

        {
            name: "scattermapbox", label: 'Mapa de pontos',
            dataTypes: ['contínuos'], objectives: ['comparação']
        },

        {
            name: "treemap", label: "Mapa em Árvore (Treemap)",
            dataTypes: ['categóricos'], objectives: ['hierarquia']
        },
        { name: "sunburst", label: "Sunburst", dataTypes: ['categóricos'], objectives: ['composição', 'comparação'] },
        { name: "heatmap", label: "Mapa de Calor (Heatmap)", },
        /*{name: "dots",label: "Pontos",
                image: "https://images.plot.ly/plotly-documentation/thumbnail/dot-plot.jpg"
            },*/
    ]
}