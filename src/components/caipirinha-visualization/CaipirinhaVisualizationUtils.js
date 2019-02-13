const setDatetimeOptions =  function(options) {
    options.chart.zoomType = 'x';
    options.xAxis.type = 'datetime';

    return options;
}

export { 
    setDatetimeOptions
};