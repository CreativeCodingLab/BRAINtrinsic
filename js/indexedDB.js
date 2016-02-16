/**
 * Created by giorgioconte on 05/07/15.
 */

var idbSupported = false;
var db;



var opendb = function (callback) {

    var openRequest = indexedDB.open("db",1);

    openRequest.onsuccess = function(e) {
        console.log("Success!");
        db = e.target.result;
        queue()
            .defer(loadAllData)
            .awaitAll(function () {
                callback(null,null);
        });

    }

    openRequest.onerror = function(e) {
        console.log("Error");
        console.dir(e);
        alert("unable to open database");
    }

}

var queryCentroids = function (callback) {
    var transaction = db.transaction(["locations"],"readonly");
    var objectStore = transaction.objectStore("locations");
    var query = objectStore.get("centroids");

    query.onsuccess = function(e) {
        console.log("centroids done");
        centroids = e.target.result;
        callback(null,null)
    }

    query.onerror = function(e){
        console.log("error");
        alert("centroids can't be found!");
    }
}


var queryConnections = function(callback){
    var transaction = db.transaction(["locations"],"readonly");
    var objectStore = transaction.objectStore("locations");
    var query = objectStore.get("connectionMatrix");

    query.onsuccess = function(e) {
        console.log("matrix done");
        connectionMatrix['normal'] = e.target.result;
        connectionMatrix['isomap'] = e.target.result;
        callback(null,null)
    }

    query.onerror = function(e){
        console.log("error");
        alert("matrix can't be found!");
    }
}

var queryLabelKey = function(callback){
    var transaction = db.transaction(["locations"],"readonly");
    var objectStore = transaction.objectStore("locations");
    var query = objectStore.get("labelKeys");

    query.onsuccess = function(e) {
        console.log("labelkey done");
        labelKeys = e.target.result;
        callback(null,null)
    }

    query.onerror = function(e){
        console.log("error");
        alert("label keys can't be found!");
    }
};

/* addedd for atlas */

var queryAtlas = function(callback){
    var transaction = db.transaction(["locations"],"readonly");
    var objectStore = transaction.objectStore("locations");
    var query = objectStore.get("atlas");

    query.onsuccess = function(e) {
        console.log("atlas done");
        //atlas = e.target.result;
        lookUpTable = e.target.result;
        callback(null,null)
    }

    query.onerror = function(e){
        console.log("error");
        alert("Atlas can't be found!");
    }
};

var queryMetricValue = function (callback) {
    var transaction = db.transaction(["locations"],"readonly");
    var objectStore = transaction.objectStore("locations");
    var query = objectStore.get("labelKeys");

    query.onsuccess = function(e) {
        console.log("metric value done");
        metricValues = e.target.result;
        callback(null,null)
    }

    query.onerror = function(e){
        console.log("metric value not found");
        metricValues = null;
        callback(null,null);
    }
};



var getData = function(key){
    var transaction = db.transaction(["locations"],"readonly");
    var objectStore = transaction.objectStore("locations");

    //x is some value
    var query = objectStore.get(key);

    query.onsuccess = function(e) {
        console.log("success");

    }

    query.onerror = function(e){
        console.log("error");
    }
}


var addData = function(data,key,callback){

    console.log("About to add " + key);

    var transaction = db.transaction(["locations"],"readwrite");
    var store = transaction.objectStore("locations");

    //Perform the add
    var request = store.add(data,key);

    request.onerror = function(e) {
        console.log("Error",e.target.error.name);
        console.log("Error when uploading " + key);
    }

    request.onsuccess = function(e) {
        console.log("Success! "+ key + " uploaded");
        callback(null,null)
    }
};


var addItemstoDb = function(callback){

    queue()
        .defer(addData,centroids,"centroids")
        .defer(addData,labelKeys,"labelKeys")
        .defer(addData,connectionMatrix['normal'],"connectionMatrix")
        .defer(addData,metricValues,"metricValues")
        .defer(addData,atlas,"atlas")
        .awaitAll(function(){
            console.log("1 - everything has been uploaded");
            callback(null,null)
        });

}

//debug function: it prints on the console log all the dbs instantiated on the browser

var getDbNames = function(){
    var getDbNamesRequest = indexedDB.webkitGetDatabaseNames();

    getDbNamesRequest.onsuccess = function (e){
        console.log(e.target.result);
    }

};