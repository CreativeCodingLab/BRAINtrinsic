

var previousMap;
var hierarchy = [];
var rootNode;
var dist;
var updateNeeded = true;

function PriorityQueue () {
    this._nodes = [];

    this.enqueue = function (priority, key) {
        this._nodes.push({key: key, priority: priority });
        this.sort();
    }
    this.dequeue = function () {
        return this._nodes.shift().key;
    }
    this.sort = function () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }
    this.isEmpty = function () {
        return !this._nodes.length;
    }
}

/**
 * Pathfinding starts here
 */
function Graph(){
    var INFINITY = 1/0;
    this.vertices = {};

    this.addVertex = function(name, edges){
        this.vertices[name] = edges;
    }

    this.shortestPath = function (start) {
        var nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            smallest, vertex, neighbor, alt;

        for(vertex in this.vertices) {
            if(vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = INFINITY;
                nodes.enqueue(INFINITY, vertex);
            }

            previous[vertex] = null;
        }

        while(!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            for(neighbor in this.vertices[smallest]) {
                alt = distances[smallest] + this.vertices[smallest][neighbor];

                if(alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }


        previousMap = previous;
        dist = distances;
        rootNode = start;
        setHierarchy(rootNode);
        return distances;
    }
}



setHierarchy = function(root){
    hierarchy = [];
    var el = [];
    hierarchy[0] = [];
    hierarchy[0].push(parseInt(root));
    var k;


    for(k=0; k < hierarchy.length; k++){
        el = [];
        for(var i=0; i < hierarchy[k].length; i++) {

            for (var j in previousMap) {
                if (previousMap[j] == hierarchy[k][i]) {
                    el[el.length] = parseInt(j);
                }
            }
        }
        if (el.length > 0) {
            hierarchy[hierarchy.length] = el;
        }
    }
};


getShortestPathDistances = function(nodeIndex){

    if(updateNeeded){
        computeShortestPathDistances(nodeIndex);
        rootNode = nodeIndex;
        updateNeeded = false;
       return dist;
    }else{
        return dist;
    }

    //return dist;
};


getHierarchy = function(nodeIndex){
    if(rootNode && rootNode == nodeIndex){
        return hierarchy;
    }

    computeShortestPathDistances(nodeIndex);
    rootNode = nodeIndex;

    return hierarchy;
}



getMaximumNumberOfHops = function(){
    if(hierarchy)
        return hierarchy.length;

    return 0;
}

getShortestPathBetweenNodes = function(a, b){
    var i = b, j;
    var prev, line;
    shortestPathEdges = [];

    for(j = 0; j < visibleNodes.length; j++){
        visibleNodes[j] = true;
    }
    visibleNodes[i] = true;
    while(previousMap[i]!= null){
        prev = previousMap[i];
        visibleNodes[prev] = true;
        var start = new THREE.Vector3(spheres[i].position.x, spheres[i].position.y, spheres[i].position.z);
        var end = new THREE.Vector3(spheres[prev].position.x, spheres[prev].position.y, spheres[prev].position.z);

        line = createLine(start,end,getConnectionMatrix()[i][prev] );
        shortestPathEdges[shortestPathEdges.length] = line;
        i = parseInt(prev);
    }



    updateScene();
}
