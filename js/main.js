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
};


var loadAllData = function(callback){

    queue()
        .defer(queryCentroids)
        .defer(queryConnections)
        .defer(queryLabelKey)
        .defer(queryMetricValue)
        .defer(queryAtlas)
        .awaitAll(function () {
            callback(null,null)
        })
};




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
        .defer(opendb)
        .awaitAll(function(){
            init();
        })
}

