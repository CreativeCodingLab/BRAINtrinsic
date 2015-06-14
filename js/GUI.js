/**
 * Created by giorgioconte on 31/01/15.
 */


initGUI = function() {
    var uploadMenu = d3.select("#upload");

    uploadMenu.append("button")
        .text("Upload Centroids")
        .attr("id", "centroidUploadBtn")
        .append("input")
        .attr("type", "file")
        .attr("id", "centroids")
        .on("change", function () {
            var f = document.getElementById("centroids");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            delimiter: ",",
                            dynamicTyping: true,
                            complete: function (results) {
                                console.log("complete uploading centroids");
                                setCentroids(results);
                                //updateScene();
                            }
                        }
                    )};
                reader.readAsDataURL(f.files[0]);
            }
        });


    uploadMenu.append("button")
        .text("Upload labelKey")
        .attr("id", "labelKeyUploadBtn")
        .append("input")
        .attr("type", "file")
        .attr("id","labelKey")
        .on("change", function () {
            var f = document.getElementById("labelKey");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log("On load event");
                    console.log(e);
                    var v = e.target.result;
                    Papa.parse(v, {
                            download: true,
                            dynamicTyping: true,
                            header: false,
                            complete: function (results) {
                                console.log("complete Uploading Label Keys ");
                                setLabelKeys(results);
                            }
                        }
                    );
                };
                reader.readAsDataURL(f.files[0]);
            }
        });
    /*
     uploadMenu.append("button")
     .text("Upload LookUpTable")
     .attr("id", "groupUploadButton")
     .append("input")
     .attr("type","file")
     .attr("id","lookUpTable")
     .on("change", function(){
     console.log("on Change Event look up table");

     var f = document.getElementById("lookUpTable");

     if(f.files && f.files[0]){
     var reader = new FileReader();
     reader.onload = function(e){
     console.log("On load event LookUpTable");
     v = e.target.result;

     console.log("Parsing LookUpTable");
     Papa.parse(v, {
     download: true,
     delimiter: ",",
     dynamicTyping: true,
     header: false,
     complete: function(results){
     setLookUpTable(results);
     console.log("look Up Table Uploaded");
     }
     })

     };
     reader.readAsDataURL(f.files[0]);
     }
     });*/

    /*uploadMenu.append("button")
     .text("Upload Regions Group")
     .attr("id", "groupUploadButton")
     .append("input")
     .attr("type", "file")
     .attr("id", "group")
     .on("change", function () {
     var f = document.getElementById("group");

     if(f.files && f.files[0]){
     var reader = new FileReader();
     reader.onload = function (e) {
     var v = e.target.result;
     Papa.parse(v, {
     download: true,
     delimiter: ',',
     dynamicTyping: true,
     header: false,
     complete: function(results){
     setGroup(results);
     }
     })
     }
     reader.readAsDataURL(f.files[0]);
     };

     });*/

    uploadMenu.append("button")
        .text("Upload Connections")
        .attr("id","uploadConnectionsButton")
        .append("input")
        .attr("type","file")
        .attr("id","connections")
        .on("change", function() {
            f = document.getElementById("connections");
            if (f.files && f.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var v = e.target.result;
                    Papa.parse(v, {
                        download: true,
                        delimiter:',',
                        dynamicTyping: true,
                        header: false,
                        complete: function (results) {
                            console.log("Connection Matrix uploaded");
                            setConnectionMatrix(results);
                        }
                    })
                };
                reader.readAsDataURL(f.files[0]);
            }
        });

    uploadMenu.append("button")
        .text("Start Visualization")
        .attr("id", "startVisualization")
        .on("click", function() {
            if(lookUpTable && labelKeys && centroids && connectionMatrix){
                initCanvas();
            } else
            {
                console.log("data are missing");
            }

        });




};

/*
 * This method removes the start button so that is not possible to create more than one scene and
 * renderer.
 */
removeStartButton = function(){
    var elem = document.getElementById('startVisualization');
    elem.parentNode.removeChild(elem);
};

addDimensionFactorSlider = function() {
    var panel = d3.select("#nodeInfoPanel");



    panel.append("input")
        .attr("type", "range")
        .attr("value", "1")
        .attr("id", "dimensionSlider")
        .attr("min","0")
        .attr("max", "3")
        .attr("step","0.01")
        .on("change", function () {
            setDimensionFactor(this.value);
            updateScene();
        });

    panel.append("label")
        .attr("for", "dimensionSlider")
        .attr("id", "dimensionSliderLabel")
        .text("Glyph Size");

    panel.append("br");


};


addSkyboxButton = function(){

    var menu = d3.select("#nodeInfoPanel");

    menu.append("button")
        .text("Skybox")
        .attr("id", "skyboxVisibilityBtn")
        .append("input")
        .attr("type","checkbox")
        .attr("id","skyboxVisibilityInput")
        .attr("checked", "true")
        .on("change", function () {
            setSkyboxVisibility(this.checked);
            updateScene();
        });

    menu.append("br");
};

setNodeInfoPanel = function (regionName, index){
    /*
     var panel = document.getElementById('nodeInfoPanel');

     while (panel.firstChild) {
     panel.removeChild(panel.firstChild);
     }*/

    var panel = d3.select('#nodeInfoPanel');


    panel.selectAll("p").remove();


    var connectionRow = getConnectionMatrixRow(index);

    var nodalStrength = computeNodalStrength(connectionRow);

    nodalStrength = Math.floor(nodalStrength*100)/100;

    var para = document.createElement("p");
    var node = document.createTextNode(index + " " + regionName + " " + nodalStrength);
    /*panel.appendChild(para)
     .appendChild(node);*/

    panel.node().appendChild(para).appendChild(node);


};


addThresholdSlider = function (){

    var menu = d3.select("#edgeInfoPanel");
    menu.append("label")
        .attr("for", "thresholdSlider")
        .attr("id", "thresholdSliderLabel")
        .text("Threshold");

    menu.append("input")
        .attr("type", "range")
        .attr("value", getMaximumWeight()/2)
        .attr("id", "thresholdSlider")
        .attr("min","0")
        .attr("max", getMaximumWeight())
        .attr("step",getMaximumWeight()/1000)
        .on("change", function () {

            var slider = document.getElementById("thresholdSlider");
            setThreshold(Math.floor(slider.value*100)/100);
            updateScene();
        });



    menu.append("output")
        .attr("for","thresholdSlider")
        .attr("id", "thresholdOutput");

    setThreshold(Math.floor(getMaximumWeight()*100/2)/100);

    document.getElementById("thresholdOutput").value = getThreshold();


};


setInfoLabel = function(regionName, index){

    var nodalStrength = computeNodalStrength(getConnectionMatrixRow(index));

    var body = document.body;

    var canvas = document.getElementsByTagName("canvas");

    var label = document.createElement("div");


    label.setAttribute("width", "100px");
    label.setAttribute("height", "100px");
    label.setAttribute("background-color", "white");
    label.setAttribute("position", "fixed");
    label.setAttribute("left", "100px");
    label.setAttribute("z-index", "9");
    label.setAttribute("bottom", "200px");

    var para = document.createElement("p");
    var node = document.createTextNode("CIAO");


    body.appendChild(label).appendChild(para).appendChild(node);


    /*
     canvas.append('div')
     .attr("width", "100px")
     .attr("height", "50px")
     .attr("z-index", "2")
     .attr("class", "menu")
     .attr("position", "absolute")
     .attr("left", "100px")
     .attr("bottom", "400px");*/



};




/*
 * This method is used to create the legend panel.
 */
var createLegend = function (active) {
    var legendMenu = document.getElementById("legend");

    while(legendMenu.hasChildNodes()){
        legendMenu.removeChild(legendMenu.childNodes[0]);
    }


    //var scaleColorGroup = d3.scale.category20();
    legendMenu = d3.select("#legend");


    if(active != 3){
        console.log("active group value: " + active);
        var activeGroup = getActiveGroup();
        if(typeof(activeGroup[0]) == "number"){
            activeGroup.sort(function(a, b){return a-b});
        }else{
            activeGroup.sort();
        }

        var l = activeGroup.length;
        document.getElementById("legend").style.height = 25*l+"px";

        for(var i=0; i < l; i++){
            var opacity;

            switch (regionState[activeGroup[i]]){
                case 'active':
                    opacity = 1;
                    break;
                case 'transparent':
                    opacity = 0.5;
                    break;
                case 'inactive':
                    opacity = 0.1;
                    break;
            }

            var elementGroup = legendMenu.append("g")
                .attr("transform","translate(10,"+i*25+")")
                .attr("id",activeGroup[i])
                .style("cursor","pointer")
                .on("click", function(){
                    toggleRegion(this.id);
                });
            elementGroup.append("circle")
                .attr("cx",5)
                .attr("cy",10)
                .attr("fill",scaleColorGroup(activeGroup[i]))
                .attr('opacity', opacity)
                .attr("r",8);

            if(typeof(activeGroup[i]) != 'number' && activeGroup[i].indexOf("right") > -1){
                elementGroup.append("circle")
                    .attr("cx",5)
                    .attr("cy",10)
                    .attr("fill","rgb(0,0,0)")
                    .attr("r",4)
                    .attr('opacity',opacity);
            }

            //choose color of the text
            var textColor;
            if(regionsActivated[activeGroup[i]]){
                textColor = "rgb(191,191,191)";
            } else{
                textColor = "rgb(0,0,0)";
                opacity = 1;
            }


            elementGroup.append("text")
                .text(activeGroup[i])
                .attr("font-family","'Open Sans',sans-serif")
                .attr("font-size","15px")
                .attr("x",20)
                .attr("y",10)
                .attr("text-anchor","left")
                .attr("dy",5)
                .attr('opacity', opacity)
                .attr("fill",textColor);
        }
    }else{
        var quantiles = metricQuantileScale.quantiles();
        var min = d3.min(metricValues, function (d){return d[0]});
        var max = d3.max(metricValues, function (d){return d[0]});

        console.log("custom group color");
        l = quantiles.length+1;
        document.getElementById("legend").style.height =30*l+"px";

        for(i = 0; i < quantiles.length + 1 ; i++){
            var elementGroup = legendMenu.append("g")
                .attr("transform","translate(10,"+i*25+")")
                .attr("id",i);

            var color;
            var leftRange;
            var rightRange;
            if( i == 0){
                color = metricQuantileScale(min + 1);

                leftRange = round(min,2);
                rightRange = round(quantiles[i],2);
            } else if(i == quantiles.length ){
                color = metricQuantileScale(max - 1);

                leftRange = round(quantiles[i - 1],2);
                rightRange = round(max,2);
            } else{

                leftRange = round(quantiles[i - 1 ],2);
                rightRange = round(quantiles[i],2);

                color = metricQuantileScale((leftRange + rightRange)/2);
            }

            elementGroup.append("rect")
                .attr("x",5)
                .attr("y",10)
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", color);


            elementGroup.append("text")
                .text(leftRange + " - " + rightRange )
                .attr("font-family","'Open Sans',sans-serif")
                .attr("font-size","20px")
                .attr("x",45)
                .attr("y",20)
                .attr("text-anchor","left")
                .attr("dy",10)
                .attr("fill","rgb(191,191,191)");

        }
    }
};


var updateEdgeLegend = function(){

};



var addDistanceSlider = function (distances) {
    var menu = d3.select("#edgeInfoPanel");

    menu.append("br");

    menu.append("label")
        .attr("for", "distanceThresholdSlider")
        .attr("id", "distanceThresholdSliderLabel")
        .text("Max Distance");

    var meanDistance = d3.mean(distances);

    var maxDistance = d3.max(distances);


    menu.append("input")
        .attr("type", "range")
        .attr("value", meanDistance)
        .attr("id", "distanceThresholdSlider")
        .attr("min","0")
        .attr("max", maxDistance)
        .attr("step", maxDistance/1000)
        .on("change", function () {
            var slider = document.getElementById("distanceThresholdSlider");

            //console.log("on Change distance threshold value:" + slider.value);
            setDistanceThreshold(slider.value);
            drawShortestPath(root);
        });


    menu.append("output")
        .attr("for","distanceThresholdSlider")
        .attr("id", "distanceThresholdOutput");

    setDistanceThreshold(meanDistance);
};


removeThresholdSlider = function(){

    var elem = document.getElementById('thresholdSlider');

    if(elem) {
        elem.parentNode.removeChild(elem);
    }


    elem = document.getElementById('thresholdOutput');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

    elem = document.getElementById('thresholdSliderLabel');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
};

addModalityButton = function () {

    var menu = d3.select("#upload");

    menu.append("button")
        .text("Change Modality")
        .attr("id", "changeModalityBtn")
        .append("input")
        .attr("type","checkbox")
        .attr("id","changeModalityInput")
        .attr("checked", "true")
        .on("change", function () {
            changeModality(this.checked);
            updateScene();
        });

}


changeModality = function(modality){
    thresholdModality = modality;

    if(modality){
        //if it is thresholdModality
        removeTopNSlider();
        addThresholdSlider();

    } else{
        //top N modality
        removeThresholdSlider();
        addTopNSlider();
    }

};

addTopNSlider = function(){
    var menu = d3.select("#edgeInfoPanel")


    menu.append("label")
        .attr("for", "topNThresholdSlider")
        .attr("id", "topNThresholdSliderLabel")
        .text("Number of Edges");

    menu.append("input")
        .attr("type", "range")
        .attr("value", getNumberOfEdges())
        .attr("id", "topNThresholdSlider")
        .attr("min","0")
        .attr("max", "20")
        .attr("step", "1")
        .on("change", function () {
            setNumberOfEdges(this.value);
            updateScene();
        });

    menu.append("output")
        .attr("for","topNThresholdSlider")
        .attr("id", "topNThresholdSliderOutput")
        .text(getNumberOfEdges());

};


removeTopNSlider= function () {

    var elem = document.getElementById('topNThresholdSlider');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

    elem = document.getElementById('topNThresholdSliderOutput');

    if(elem) {
        elem.parentNode.removeChild(elem);
    }


    elem = document.getElementById('topNThresholdSliderLabel');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
};


removeElementsFromEdgePanel = function(){
    removeThresholdSlider();
    removeTopNSlider();
};


removeUploadButtons= function (){
    var menu = document.getElementById("upload");
    while(menu.hasChildNodes()){
        menu.removeChild(menu.children[0]);
    }
};


addGroupList = function () {
    var menu = d3.select("#upload");

    menu.append("label")
        .attr("for","colorGroup")
        .text("Color coding:");

    menu.append("br"),

        menu.append("input")
            .attr("type", "radio")
            .attr("name","colorGroup")
            .attr("id","anatomy")
            .attr("value","0")
            .attr("checked","true")
            .on("change", function () {
                changeColorGroup(this.value);
            });
    menu.append("label")
        .attr("for","anatomy")
        .text("Anatomy");

    menu.append("br")

    menu.append("input")
        .attr("type", "radio")
        .attr("name","colorGroup")
        .attr("id","place")
        .attr("value","1")
        .on("change", function () {
            changeColorGroup(this.value);
        });


    menu.append("label")
        .attr("for","place")
        .text("Embeddedness");

    menu.append("br")

    menu.append("input")
        .attr("type", "radio")
        .attr("name","colorGroup")
        .attr("value","2")
        .attr("id","richClub")
        .on("change", function () {
            changeColorGroup(this.value);
        });

    menu.append("label")
        .attr("for","richClub")
        .text("Rich Club");

    menu.append("br");

    /*
    menu.append("input")
        .attr("type", "radio")
        .attr("name","colorGroup")
        .attr("value","3")
        .attr("id","ic")
        .on("change", function () {
            changeColorGroup(this.value);
        });


   menu.append("label")
        .attr("for","ic")
        .text("IC");*/

    if(metric == true){
        menu.append("input")
            .attr("type", "radio")
            .attr("name","colorGroup")
            .attr("value","3")
            .attr("id","metric")
            .on("change", function () {
                changeColorGroup(this.value);
            });
        menu.append("label")
            .attr("for","metric")
            .text("Custom Group");
        menu.append("br");
    }

};


shortestPathSliderHops = function(){
    var menu = document.getElementById("edgeInfoPanel");
    /*while(menu.hasChildNodes()){
     menu.removeChild(menu.children[0]);
     }*/

    removeDistanceSlider();


    menu =  d3.select('#edgeInfoPanel');
    if(document.getElementById('numberOfHopsSlider') == null) {
        menu.append("label")
            .attr("for", "numberOfHopsSlider")
            .attr("id", "numberOfHopsSliderLabel")
            .text("Number of Hops");

        menu.append("input")
            .attr("type", "range")
            .attr("value", getNumberOfHops())
            .attr("id", "numberOfHopsSlider")
            .attr("min", "0")
            .attr("max", getMaximumNumberOfHops())
            .attr("step", 1)
            .on("change", function () {
                setNumberOfHops(parseInt(this.value));
                drawShortestPathHops(root, parseInt(this.value));
            });

        menu.append("output")
            .attr("for", "numberOfHopsSlider")
            .attr("id", "numberOfHopsOutput");


        d3.select("#sptFilterButtonSPT").remove();

        d3.select("#upload")
            .append("button")
            .attr("id", "sptFilterButtonDistance")
            .text("Distance Filter")
            .on('click', function () {
                drawShortestPath(root);
            });

    }
};



shortestPathDistanceUI = function(){

    var btn = d3.select('#changeModalityBtn');
    if(btn){
        btn.remove();
    }

    btn = document.getElementById("sptFilterButtonDistance");
    if(btn)
        btn.remove();

    removeNumberOfHopsSlider();


    var menu = d3.select("#upload");

    if(document.getElementById('sptFilterButtonSPT') == undefined) {
        menu.append('button')
            .attr("id", "sptFilterButtonSPT")
            .text("Number of Hops Filter")
            .on('click', function () {
                setNumberOfHops(2);
                drawShortestPathHops(rootNode, getNumberOfHops());
                setNumberOfHops(2);
            })
    }

};


removeDistanceSlider = function () {
    var elem = document.getElementById('distanceThresholdSlider');

    if(elem) {
        elem.parentNode.removeChild(elem);
    }


    elem = document.getElementById('distanceThresholdOutput');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

    elem = document.getElementById('distanceThresholdSliderLabel');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

};


removeNumberOfHopsSlider = function(){
    var elem = document.getElementById('numberOfHopsSlider');

    if(elem) {
        elem.parentNode.removeChild(elem);
    }


    elem = document.getElementById('numberOfHopsOutput');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

    elem = document.getElementById('numberOfHopsSliderLabel');
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
};


addGeometryRadioButton = function () {
    var menu = d3.select("#upload");

    menu.append("br");

    menu.append("label")
        .attr("for","geometry")
        .text("Topological Space:");
    menu.append("br");

    menu.append("input")
        .attr("type", "radio")
        .attr("name","geometry")
        .attr("id","isomap")
        .attr("value","isomap")
        .attr("checked","true")
        .on("change", function () {
            changeActiveGeometry(this.value);
        });
    menu.append("label")
        .attr("for","isomap")
        .text("Isomap");

    menu.append("br")

    menu.append("input")
        .attr("type", "radio")
        .attr("name","geometry")
        .attr("id","mds")
        .attr("value","MDS")
        .on("change", function () {
            changeActiveGeometry(this.value);
        });


    menu.append("label")
        .attr("for","mds")
        .text("MDS");

    menu.append("br")

    menu.append("input")
        .attr("type", "radio")
        .attr("name","geometry")
        .attr("value","tsne")
        .attr("id","tsne")
        .on("change", function () {

            changeActiveGeometry(this.value);
        });

    menu.append("label")
        .attr("for","tsne")
        .text("tSNE");

    menu.append("br");

    menu.append("input")
        .attr("type", "radio")
        .attr("name","geometry")
        .attr("value","anatomy")
        .attr("id","anatomy")
        .on("change", function () {

            changeActiveGeometry(this.value);
        });

    menu.append("label")
        .attr("for","anatomy")
        .text("anatomy");

    menu.append("br");

}


addFslRadioButton = function () {
    var rightMenu = d3.select("#rightFslLabels");
    var leftMenu = d3.select("#leftFslLabels");

    rightMenu.append("text")
        .text("Right Hemisphere:");

    rightMenu.append("br");

    leftMenu.append("text")
        .text("Left Hemisphere:");

    leftMenu.append('br');


    labelVisibility.forEach(function(labelInfo,index){
        var menu;
        if(labelInfo['hemisphere'] == 'right') {
            menu = rightMenu;
        }else {
            menu = leftMenu;
        }
        menu.append("input")
            .attr("type", "checkbox")
            .attr("name", "fslLabel")
            .attr("id", index)
            .attr("value", index)
            .attr("checked", "true")
            .on("change", function () {
                setLabelVisibility(index, this.checked);
                updateScene();
            });

        menu.append("label")
            .attr("for", "geometry")
            .text(" " + labelInfo['name']);

        menu.append("br");

    });

};


addSearchPanel = function(){
    var menu = d3.select("#search");

    menu.append("text")
        .text("Search Panel");

    menu.append("br");

    menu.append("input")
        .attr("type", "text")
        .attr("id", "nodeSearch")
        .attr("name","nodeid");

    menu.append("button")
        .text("Search")
        .on("click",function(){
            var text = document.getElementById("nodeSearch");
            searchElement(text.value);
        });


};

searchElement = function (index) {
    index = parseInt(index);
    console.log(index);
    if(typeof(index) != 'number' || isNaN(index)){
        alert("The value inserted is not a number");
    }

    if(index < 0 || index > spheres.length){
        alert("Node not found");
    }


    spheres[index].geometry = drawSelectedNode(index, spheres[index]);
}

toggleFslMenu = function (e) {
    $("#rightFslLabels").toggle();
    $('#leftFslLabels').toggle();
    $('#legend').toggle();
    $('#nodeInfoPanel').toggle();
    $('#upload').toggle();
    $('#edgeInfoPanel').toggle();
    $('#search').toggle();

}