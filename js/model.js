/**
 * Created by giorgioconte on 31/01/15.
 */
/*
private variables
 */

var spheres;
var groups = [];
var labelKeys;
var centroids = [];
var activeGroup = 0;
var activeCentroids = "isomap";
var connectionMatrix = [];
var regionsActivated = [];
var labelVisibility = [];

var icColorTable = [];

var activeMatrix = 'isomap';

var lookUpTable = [];

var regionState = {};

var distanceThreshold;
var threshold;
var distanceArray;
var numberOfEdges = 5;

var metricValues = [];

var numberOfHops;




/*
Setters
 */


setICColor = function(icData){
    icColorTable = icData.data;
}

setDistanceArray = function(array){
    distanceArray = array;
}


getMaximumDistance = function(){
    return d3.max(distanceArray);
}

/**
 * Label Keys setter
 */

setLabelKeys = function(labels){
    labelKeys = labels.data;
};

/**
 *  Centroid Setter
 */


setCentroids = function (d, technique) {
    var data = d.data;
    var len = data.length;
    var centroidGroup;

    for(var i=0; i < len; i++){
        var element = {};
        element.x = data[i][0];
        element.y = data[i][1];
        element.z = data[i][2];
        centroids[i] = centroids[i] || {};
        centroids[i][technique] = element;

    }
};

setDistanceThreshold = function (dt) {
    if(document.getElementById("distanceThresholdOutput")){
        var percentage = dt/getMaximumDistance()*100;
        var value = Math.floor(percentage*100)/100;
        document.getElementById("distanceThresholdOutput").value = value+ " %";
    }
    distanceThreshold = dt;
};


getDistanceThreshold = function () {
    return distanceThreshold;
};

setThreshold = function (t) {
    document.getElementById("thresholdOutput").value = t;
    threshold = t;
};

getThreshold = function () {
    return threshold;
}

setLookUpTable = function (d) {
    var i, el;

    for(i = 0; i < d.data.length ; i++){
        el = {"group": d.data[i].group,
            "place" : d.data[i].place,
            "rich_club":d.data[i].rich_club,
            "region_name":d.data[i].region_name,
            "hemisphere": d.data[i].hemisphere
        };

    lookUpTable[d.data[i].label] = el;
    var labelInfo = [];
    labelInfo['name'] = d.data[i].region_name;
        labelInfo['visibility'] = true;
        labelInfo['hemisphere'] = d.data[i].hemisphere;
    labelVisibility[d.data[i].label] = labelInfo;
    }

};


setConnectionMatrix = function(d, name){
    connectionMatrix[name] = d.data;
    console.log("connectionMatrix set");
};





/**
 * Setter for group
 */

setGroup = function (d) {
    groups[groups.length] = d.data;
}

/*
 * GETTERS
 */
/**
 * Label keys getter.
 * @returns an array of label keys
 */

getLabelKeys = function(){
    var l = labelKeys.length;
    var result = [];
    //Cloning the array

    for(var i =0; i < l; i++){
        result[result.length] = labelKeys[i];
    }

    return result;
};


/**
 *  Centroid getters
 *  @return an array of objects with three fields named "x","y","z"
 */

getCentroids = function(){
    var l = centroids.length;
    var results = [];
    for(var i=0; i < l; i++){
        var element = {};
        element.x = centroids[i].x;
        element.y = centroids[i].y;
        element.z = centroids[i].z;
        results[results.length] = element;
    }

    return results;
};


/**
 * Get the entire dataset to render the scene
 */

/*
getOldDataset = function () {
    var row;
    var arrayLength = labelKeys.length;
    //var index;
    var result = [];

    for (var i = 0; i < arrayLength; i++) {
        row = {};

        //getting Centroids
        row.x = centroids[i].x;
        row.y = centroids[i].y;
        row.z = centroids[i].z;


        var label = labelKeys[i];
        var lengthLookUpTable= lookUpTable.length;

        //Looking for the right element in the lookup table

        for (var j = 0, found = false; j < lengthLookUpTable && !found; j++) {

            if (lookUpTable[j].label == label) {
                found = true;
                row.name = lookUpTable[j].region_name;
            }
        }

        row.group = groups[activeGroup][i];

        result[result.length] = row;
    }
    return result;
};
*/


getDataset = function() {
    var row;
    var arrayLength = labelKeys.length;
    //var index;
    var result = [];

    for (var i = 0; i < arrayLength; i++) {
        row = {};

        //getting Centroids
        row.x = centroids[i][activeCentroids].x;
        row.y = centroids[i][activeCentroids].y;
        row.z = centroids[i][activeCentroids].z;


        var label = labelKeys[i];

        row.name = lookUpTable[label].region_name;

        row.group = groups[activeGroup][i];

        row.hemisphere = lookUpTable[label].hemisphere;

        row.label = labelKeys[i];
        result[result.length] = row;
    }
    return result;
};


getActiveGroup = function () {
    /*
    var l = activeGroup.length;
    var result = [];

    for(var i=0; i < l; i++){
        result[result.length] = activeGroup[i];
    }
    return result;*/


    var l = groups[activeGroup].length;
    var results = [];
    for(var i = 0; i < l; i++){
        var element = groups[activeGroup][i];
        if(results.indexOf(element) == -1){
            results[results.length] = element;
        }
    }
    return results;
};

/**
 * This method gets the data about the connection matrix.
 * @returns a matrix of connections.
 */

getConnectionMatrix = function () {
    /* For performance reasons it is not possible to clone the entire object. Since the matrix is symmetric, and idea could be
    to clone just one half of the entire matrix. Now.. are we dealing always with symmetric matrices?
     */

    /*
    var clone = [];
    var clonedRow = [];
    var l = connectionMatrix.length;
    for(var i = 0; i < l; i++ ){
        var l_inner = connectionMatrix;
        for (var j = 0; j < l_inner; j++ ){
            clonedRow[clonedRow.length] = connectionMatrix[i][j];
        }
        clone[clone.length] = clonedRow;
    }

    return clone;*/
    return connectionMatrix[activeMatrix];
    //return connectionMatrix;
};


getConnectionMatrixRow = function(index){

    var row = [];
    for(var i=0; i < connectionMatrix[activeMatrix].length; i++){
        row[row.length] = connectionMatrix[activeMatrix][index][i];
    }
    return row;
};


getRegionByNode = function (nodeIndex) {
    return groups[activeGroup][nodeIndex];
};



isRegionActive = function(region){
    return regionsActivated[region];
};

toggleRegion = function (regionName){
    switch (regionState[regionName]){
        case 'active':
            regionState[regionName] = 'transparent';
            regionsActivated[regionName] = true;
            break;
        case 'transparent':
            regionState[regionName] = 'inactive';
            regionsActivated[regionName] = false;
            break;
        case 'inactive':
            regionState[regionName] = 'active';
            regionsActivated[regionName] = true;
            break;
    }


    /*
    if(regionsActivated[regionName]){
        regionsActivated[regionName] = false;
    } else {
        regionsActivated[regionName] = true;
    }*/
    updateScene();
};

setRegionsActivated = function (){
    /*regionsActivated = [];

    var l = groups[activeGroup].length;;
    for(var i =0; i < l; i++){
        var element = groups[activeGroup][i];
        regionsActivated[element] = true;
    }*/

    regionsActivated = {};
    regionState = {};


        var l = groups[activeGroup].length;
        for(var i = 0; i < l; i++){
            var element = groups[activeGroup][i];
            regionsActivated[element] = true;
            regionState[element] = 'active';
        }

};


getConnectionMatrixDimension = function(){
    return connectionMatrix['isomap'].length;
}


getTopConnectionsByNode = function(indexNode, n){
    var row = getConnectionMatrixRow(indexNode);
    var sortedRow = row.sort(function(a, b){return b-a}); //sort in a descending flavor

    var res = {};
    for(var i=0; i < n; i++){
        res[getConnectionMatrixRow(indexNode).indexOf(sortedRow[i])] = sortedRow[i];
    }

    return res;
}


getMaximumWeight = function () {

    var max = d3.max(connectionMatrix['normal'], function(d){
        return d3.max(d, function(d){
            return d;
        })
    });
    console.log(max);
    return max;
};


getNumberOfEdges = function () {
  return numberOfEdges;
};

setNumberOfEdges = function(n){
    if(document.getElementById("topNThresholdSliderOutput")){
        document.getElementById("topNThresholdSliderOutput").value = n;
    }

    numberOfEdges = n;
};



createOldGroups = function () {
    var anatomicalGroup = [];
    var richClubGroup = [];
    var placeGroup = [];

    for(var i=0; i < labelKeys.length; i++){
        var labelKey = labelKeys[i];

        for(var j = 0, found = false; j < lookUpTable.length && !found; j++){
            if(lookUpTable[j].label == labelKey){
                found = true;
                anatomicalGroup[anatomicalGroup.length] = lookUpTable[j].group;
                placeGroup[placeGroup.length] = lookUpTable[j].place;
                richClubGroup[richClubGroup.length] = lookUpTable[j].rich_club;
            }
        }

    }
    groups[groups.length] = anatomicalGroup;
    groups[groups.length] = placeGroup;
    groups[groups.length] = richClubGroup;
};


createGroups = function () {
    console.log("create groups");
    var anatomicalGroup = [];
    var richClubGroup = [];
    var placeGroup = [];
    var icGroup = [];

    for(var i=0; i < labelKeys.length; i++){
        var labelKey = labelKeys[i];
        anatomicalGroup[anatomicalGroup.length] = lookUpTable[labelKey].group;
        placeGroup[placeGroup.length] = lookUpTable[labelKey].place;
        richClubGroup[richClubGroup.length] = lookUpTable[labelKey].rich_club;
        /*if(icColorTable[i]){
            icGroup[icGroup.length] = icColorTable[i][0];
        }*/
        icGroup[icGroup.length] = i;


    }
    groups[groups.length] = anatomicalGroup;
    groups[groups.length] = placeGroup;
    groups[groups.length] = richClubGroup;
    groups[groups.length] = icGroup;
};


getRegionNameByIndex = function(index){
    var labelKey = labelKeys[index];

    return lookUpTable[labelKey].region_name;
};


setNumberOfHops = function (hops) {
    numberOfHops = hops;
    if(document.getElementById("numberOfHopsOutput")){
        document.getElementById("numberOfHopsOutput").value = hops;
    }
}

getNumberOfHops = function () {
    return numberOfHops;
}

getLabelVisibility = function(label){
    return labelVisibility[label]['visibility'];
}

setLabelVisibility = function (label, visibility) {
    if(labelVisibility[label] != undefined)
        labelVisibility[label]['visibility'] = visibility;
    else{
        console.log("It isn't possible to set visibility of the label");
    }
}


setMetricValues = function (data){
    metricValues = data.data;

    metricQuantileScale  = d3.scale.quantile()
        .domain(metricValues)
        .range(['#000080','#0000c7','#0001ff','#0041ff','#0081ff','#00c1ff','#16ffe1','#49ffad',
            '#7dff7a','#b1ff46','#e4ff13','#ffd000','#ff9400','#ff5900','#ff1e00','#c40000']);

    console.log("loaded metric file");
}

// Jet colormap
//'#000080','#0000c7','#0001ff','#0041ff','#0081ff','#00c1ff','#16ffe1','#49ffad','#7dff7a',
// '#b1ff46','#e4ff13','#ffd000','#ff9400','#ff5900','#ff1e00','#c40000'

// Mine colormap
//'#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'