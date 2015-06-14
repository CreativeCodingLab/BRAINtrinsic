/**
 * Created by giorgioconte on 26/02/15.
 */

var circleRadius = 3.0;
var selectedCircleRadius = 5.0;
var rootCircleRadius = 6.0;
var circleResolution = 10;
var dimensionFactor = 1;

var innerRadius = 1.2;
var outerRadius = 3;

var selectedInnerRadius = 1.8;
var selectedOuterRadius = 5.0;

var rootInnerRadius = 2.5;
var rootOuterRadius = 7.0;

createNormalGeometry = function(hemisphere){
    if(hemisphere == "left"){
        //return new THREE.SphereGeometry(1.0,10,10);
        return new THREE.CircleGeometry( dimensionFactor * circleRadius, circleResolution);
    } else if(hemisphere == "right"){

        return new THREE.RingGeometry( dimensionFactor * innerRadius, dimensionFactor * outerRadius, circleResolution);

    }

};


createSelectedGeometry = function (hemisphere) {
    if(hemisphere == "left"){
        return new THREE.CircleGeometry( dimensionFactor * selectedCircleRadius, circleResolution);
    } else if(hemisphere == "right"){
        return new THREE.RingGeometry( dimensionFactor * selectedInnerRadius, dimensionFactor * selectedOuterRadius , circleResolution);
        //return new THREE.BoxGeometry( 3, 3, 0 );
    }
};




createRootGeometry = function(hemisphere){

    if(hemisphere == "left"){
        return new THREE.CircleGeometry(dimensionFactor * rootCircleRadius, circleResolution);
    } else if(hemisphere == "right"){
        //return new THREE.BoxGeometry( 4, 4, 0 );
        return new THREE.RingGeometry( dimensionFactor* rootInnerRadius, dimensionFactor * rootOuterRadius ,10);
    }
};


createRootGeometryByObject = function (obj) {

    return createRootGeometry(obj.userData.hemisphere);
}


createNormalGeometryByObject = function(obj){
    if(obj)
        return createNormalGeometry(obj.userData.hemisphere);
};


createSelectedGeometryByObject = function (obj) {
    return createSelectedGeometry(obj.userData.hemisphere);
};


setDimensionFactor = function(value){
    dimensionFactor = value;
};


getNormalMaterial = function (group, nodeIndex){
    var material;

    switch (regionState[group]){
        case 'active':
            material = new THREE.MeshPhongMaterial({
                color: scaleColorGroup(group, nodeIndex),
                shininess: 15,
                transparent: false,
                opacity: 0.7
            });
            break;
        case 'transparent':
            material = new THREE.MeshPhongMaterial({
                color: scaleColorGroup(group, nodeIndex),
                shininess: 15,
                transparent: true,
                opacity: 0.3
            });
            break;
    }

    return material;
}