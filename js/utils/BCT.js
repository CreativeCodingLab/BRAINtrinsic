/**
 * Created by giorgioconte on 05/02/15.
 */
/*
 * This methods written here compute some useful metrics about the graph we are visualizing.
 * The vast majority of them are inspired to the library BCT.
 */

var graph;
var distanceMatrix = [];

var computeNodalStrength = function (connectionRow) {
    //return d3.mean(connectionRow);
    return d3.sum(connectionRow);
};


var computeDistanceMatrix = function(){
    distanceMatrix = [];
    var adjacencyMatrix = getConnectionMatrix();
    graph = new Graph();

    for(var i = 0; i < adjacencyMatrix.length; i++){
        var vertexes = {};
        var row = [];
        for(var j = 0; j < adjacencyMatrix[i].length; j++){
            vertexes[j] = 1/adjacencyMatrix[i][j];
            row[row.length] = 1/adjacencyMatrix[i][j];
        }
        distanceMatrix[distanceMatrix.length] = row;
        graph.addVertex(i,vertexes);
    }

};

var computeShortestPathDistances = function(rootNode) {
    console.log("computing spt");
    return graph.shortestPath(String(rootNode));
};





