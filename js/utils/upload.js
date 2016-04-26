/**
 * Created by giorgioconte on 16/04/15.
 */

var uploadAnatomyCentroids = function () {
    var f = document.getElementById("anatomyCentroids");
    if (f.files && f.files[0]) {
        for(var i=0; i < f.files.length; i++) {
            var file = f.files[i];
            var reader = new FileReader();
            file.timestep = i;

            reader.onload = (function (file) {
                var timestep = file.timestep;

                return function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                setCentroids(results, "anatomy", timestep);
                                d3.select('#anatomyBtn').attr('class', 'load');
                                dhtmlx.message("Anatomical Centroids Uploaded");
                            }
                        }
                    )
                };
            })(file);
            reader.readAsDataURL(f.files[i]);
        }
    }
};

uploadNormalConnections = function () {
    var f = document.getElementById("anatomyConnections");
    if (f.files && f.files[0]) {

        for(var i = 0; i < f.files.length; i++) {
            var file = f.files[i];
            var reader = new FileReader();

            file.timestep = i;
            console.log("Looping "+ file.timestep);

            reader.onload = (function(file){
                var timestep = file.timestep;

                return function(e){
                    var v = e.target.result;

                    Papa.parse(v, {
                            download: true,
                            dynamicTyping: true,
                            delimiter: ',',
                            header: false,
                            complete: function (results) {
                                //console.log("Value of i: " + timestep);
                                setConnectionMatrix(results, timestep);
                                //setConnectionMatrix(results, 1);
                                d3.select('#connectionsBtn').attr('class','load');
                                dhtmlx.message("Adjacency Matrix Uploaded");
                            }
                        }
                    )
                };
            })(file);


            reader.readAsDataURL(f.files[i]);
        }

    }

};


var uploadIsomapCentroids = function(){
    var f = document.getElementById("isomapCentroid");

    if (f.files && f.files[0]) {
        for(var i=0; i < f.files.length; i++) {
            var file = f.files[i];
            var reader = new FileReader();
            file.timestep = i;

            reader.onload = (function (file) {
                var timestep = file.timestep;

                return function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                setCentroids(results, "isomap",timestep);
                                d3.select('#isomapBtn').attr('class','load');
                                dhtmlx.message("Isomap Centroids Uploaded");
                            }
                        }
                    )
                };
            })(file);
            reader.readAsDataURL(f.files[i]);
        }
    }

};


var uploadMDSCentroids = function(){
    var f = document.getElementById("mdsCentroid");

    if (f.files && f.files[0]) {
        for(var i=0; i < f.files.length; i++) {
            var file = f.files[i];
            var reader = new FileReader();
            file.timestep = i;

            reader.onload = (function (file) {
                var timestep = file.timestep;

                return function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                setCentroids(results, "MDS",timestep);
                                d3.select('#mdsBtn').attr('class','load');
                                dhtmlx.message("MDS Centroids Uploaded");
                            }
                        }
                    )
                };
            })(file);
            reader.readAsDataURL(f.files[i]);
        }
    }
};

var uploadtSNECentroids = function(){
    var f = document.getElementById("tsneCentroid");

    if (f.files && f.files[0]) {
        for(var i=0; i < f.files.length; i++) {
            var file = f.files[i];
            var reader = new FileReader();
            file.timestep = i;

            reader.onload = (function (file) {
                var timestep = file.timestep;

                return function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                setCentroids(results, "tsne",timestep);
                                d3.select('#tsneBtn').attr('class','load');
                                dhtmlx.message("tSNE Centroids Uploaded");
                            }
                        }
                    )
                };
            })(file);
            reader.readAsDataURL(f.files[i]);
        }
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



var uploadAtlas = function() {
    var f = document.getElementById("atlas");
    if (f.files && f.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var v = e.target.result;
            Papa.parse(v, {
                    download: true,
                    delimiter: ";",
                    dynamicTyping: true,
                    header: true,
                    complete: function (results) {
                        setAtlas(results);
                        d3.select('#atlasBtn').attr('class','load');
                        dhtmlx.message("Atlas Uploaded");
                    }
                }
            )
        };
        reader.readAsDataURL(f.files[0]);
    }

};

var start = function(){
    queue()
        .defer(addItemstoDb)
        .awaitAll(function(){
            console.log("2 - everything has been uploaded");
            var vr = getTechnology();
            document.location.href = 'visualization.html?dataset=null&vr='+vr+'&load=1&metric='+metric;
        });
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

