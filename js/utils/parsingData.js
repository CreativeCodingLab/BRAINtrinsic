/**
 * Created by giorgioconte on 31/01/15.
 */

    var folder;

var setFolder = function(folderName, callback){
    folder = folderName;
    callback(null,null);
    return;
}

var loadCentroidsMDS = function (callback) {

    Papa.parse("./data/"+ folder + "/MDSxyz.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        complete: function (results) {
            //setCentroids(results, "MDS");
            setCentroids(results,"anatomy",1)
            callback(null, null);
        }
    });

};

var loadCentroidsAnatomy = function (callback){
    Papa.parse("./data/"+ folder + "/anatomyxyz.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        error:"continue",
        complete: function (results) {
            setCentroids(results, "anatomy", 0);
            callback(null, null);
        }
    });
}


var loadIcColors = function(callback){
    Papa.parse("./data//WB2s1IC.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        error:"continue",
        complete: function (results) {
            setICColor(results);
            callback(null, null);
        }
    });
}

var loadCentroidsIsomap = function (callback) {

    Papa.parse("./data/"+ folder +"/isomapxyz.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        complete: function (results) {
            setCentroids(results, "isomap", 0);
            callback(null, null);
        }
    });

};

var loadCentroidstSNE = function (callback) {

    Papa.parse("data/"+folder + "/tSNExyz.csv", {
        download: true,
        delimiter: ",",
        dynamicTyping: true,
        complete: function (results) {
            setCentroids(results, "tsne", 0);
            callback(null, null);
        }
    });

};

var loadLookUpTable = function (callback) {
    Papa.parse("data/atlas_1.csv", {
        download: true,
        delimiter: ";",
        dynamicTyping: true,
        header: true,
        complete: function (results) {
            /*setLookUpTable(results);*/
            setAtlas(results);
            console.log("ATLAS");
            callback(null, null);
        }
    });

};

var loadLabelKeys = function (callback) {
    Papa.parse("data/"+folder+"/labelKey.csv", {
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            setLabelKeys(results);
            callback(null, null);
        }
    });
};

var loadConnections = function(callback){
    Papa.parse("data/"+folder+"/NW.csv",{
        download: true,
        dynamicTyping: true,
        delimiter: ',',
        header: false,
        complete: function(results){
            setConnectionMatrix(results, 0);
            //computeDistanceMatrix();
            callback(null,null);
        }
    })
};

var loadConnectionsIsomap = function(callback){
    Papa.parse("data/"+folder+"/nw_1.csv",{
        download: true,
        dynamicTyping: true,
        delimiter: ',',
        header: false,
        complete: function(results){
            setConnectionMatrix(results, 1);
            //computeDistanceMatrix();
            callback(null,null);
        }
    })
};


var loadColorMap = function(callback){
    Papa.parse("data/colorMap.csv", {
        download: true,
        delimiter: ',',
        dynamicTyping: true,
        header: false,
        complete: function(results){
            setGroup(results);
            callback(null,null);
        }
    })
};


var loadMetricValues = function(callback){
    console.log("loading metrci file");
    Papa.parse("data/Anatomic/metric.csv",{
        download: true,
        delimiter: ',',
        dynamicTyping: true,
        header: false,
        complete: function(results){
            setMetricValues(results);
            callback(null,null);
        }
    })
};




