/**
 * Created by giorgioconte on 16/04/15.
 */

var uploadAnatomyCentroids = function () {
    var f = document.getElementById("anatomyCentroids");
    if (f.files && f.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    complete: function (results) {
                        setCentroids(results, "anatomy");
                        d3.select('#anatomyBtn').attr('class','load');
                        dhtmlx.message("Anatomical Centroids Uploaded");
                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }
};

uploadNormalConnections = function () {
    var f = document.getElementById("anatomyConnections");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    dynamicTyping: true,
                    delimiter: ',',
                    header: false,
                    complete: function (results) {
                        setConnectionMatrix(results, 'normal');
                        setConnectionMatrix(results, 'isomap');
                        d3.select('#connectionsBtn').attr('class','load');
                        dhtmlx.message("Adjacency Matrix Uploaded");
                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }

};


var uploadIsomapCentroids = function(){
    var f = document.getElementById("isomapCentroid");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    complete: function (results) {
                        setCentroids(results, "isomap");
                        d3.select('#isomapBtn').attr('class','load');
                        dhtmlx.message("Isomap Centroids Uploaded");

                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }
};


var uploadMDSCentroids = function(){
    var f = document.getElementById("mdsCentroid");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    complete: function (results) {
                        setCentroids(results, "MDS");
                        d3.select('#mdsBtn').attr('class','load');
                        dhtmlx.message("MDS Centroids Uploaded");

                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }
};


var uploadtSNECentroids = function(){
    var f = document.getElementById("tsneCentroid");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    complete: function (results) {
                        setCentroids(results, "tsne");
                        d3.select('#tsneBtn').attr('class','load');
                        dhtmlx.message("tSNE Centroids Uploaded");

                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }
};

var uploadCustomMetric = function () {
    var f = document.getElementById("customMetric");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    complete: function (results) {
                        setMetricValues(results);
                        metric = true;
                        d3.select('#customMetricBtn').attr('class','load');
                        dhtmlx.message("Custom Metric Uploaded");
                    }
                }
            )
        };

        reader.readAsDataURL(f.files[0]);
    }
}

var uploadLabelKey = function () {
    var f = document.getElementById("labelkey");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    complete: function (results) {
                        setLabelKeys(results);
                        d3.select('#labelKeyBtn').attr('class','load');
                        dhtmlx.message("Label Keys Uploaded");

                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }

};

var start = function () {
   queue()
       .defer(store)
       .awaitAll(function(){
           var vr = getTechnology();
           document.location.href = 'visualization.html?dataset=null&vr='+vr+'&load=1&metric='+metric;
       });
};


var store = function(callback){
    localStorage.setItem("labelKeys", JSON.stringify(labelKeys));
    localStorage.setItem("centroids", JSON.stringify(centroids));
    localStorage.setItem("normal",JSON.stringify(connectionMatrix['normal']));
    localStorage.setItem("metricValues",JSON.stringify(metricValues));
   // localStorage.setItem("isomap",JSON.stringify(connectionMatrix['isomap']));
    callback(null,null);
};

var getTechnology = function () {
    if( $('#desktop').is(':checked') ){
        return 0;
    }
    if( $('#oculusv1').is(':checked') ){
        return 1;
    }
    if( $('#oculusv2').is(':checked') ){
        return 2;
    }

}

