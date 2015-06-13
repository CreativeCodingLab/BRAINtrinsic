/**
 * Created by giorgioconte on 31/01/15.
 */





init = function () {
    $(window).resize(function(e){
        e.preventDefault();
        console.log("on resize event");
        resizeScene();
    });

    console.log(folder);
    createGroups();
    initGUI();
    initCanvas();
};



function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    console.log('Query Variable ' + variable + ' not found');
    return undefined;
}

var stringToBoolean = function (s) {
    switch (s){
        case 'true': return true;
        case 'false': return false;
    }
}

var parse = function(callback){
    labelKeys = JSON.parse(localStorage.getItem("labelKeys"));
    centroids = JSON.parse(localStorage.getItem("centroids"));
    connectionMatrix['normal'] = JSON.parse(localStorage.getItem("normal"));
    connectionMatrix['isomap'] = JSON.parse(localStorage.getItem("normal"));
    metricValues = JSON.parse(localStorage.getItem("metricValues"));

    if(metric == true){
        metricQuantileScale  = d3.scale.quantile()
            .domain(metricValues)
            .range(['#000080','#0000c7','#0001ff','#0041ff','#0081ff','#00c1ff','#16ffe1','#49ffad',
                '#7dff7a','#b1ff46','#e4ff13','#ffd000','#ff9400','#ff5900','#ff1e00','#c40000']);
    }

    callback(null,null);
}


var folder = getQueryVariable("dataset");
var vr = getQueryVariable("vr");
var isLoaded = parseInt(getQueryVariable("load"));
metric = stringToBoolean(getQueryVariable("metric"));
if( metric == undefined){
    metric = false;
}


if(isLoaded == 0) {
    queue()
        .defer(loadCentroidsIsomap)
        .defer(loadCentroidsMDS)
        .defer(loadCentroidstSNE)
        .defer(loadLabelKeys)
        .defer(loadLookUpTable)
        .defer(loadConnections)
        .defer(loadConnectionsIsomap)
        .defer(loadCentroidsAnatomy)
        .defer(loadIcColors)
        //.defer(loadColorMap)
        .awaitAll(function () {
            init();
        });
} else{
    console.log("loaded from different files");

    queue()
        .defer(loadLookUpTable)
        .defer(loadIcColors)
        .defer(parse)
        .awaitAll(function(){
            init();
        })
}


/*
 queue()
 .defer(loadLookUpTable)
 .awaitAll(function(){
 init();
 });


init = function () {
    initGUI();
};*/


/*
 $( document ).ready(function() {
 init();
 });*/