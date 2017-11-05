// Your code goes here
/* global gm, document*/
var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
    //vinElem.innerHTML = gm.info.getVIN();
});
/* 40.794631, -77.867982 */

/* Sends the coords to server */
var sendCoords = function(coords){    
    $.post( "https://ezpark-dalofeco.c9users.io/coords", coords).done(function(data) {
        console.log( "Data Loaded: " + data);
    });
};

gm.info.getCurrentPosition(function(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    console.log("Lat: %s", lat);
    console.log("Long: %s", lng);
    var coords = {lat: lat, lng: lng};
    sendCoords(coords);
    /* 800 x 390 */
    var staticMapAPI = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lng + "&zoom=16&size=400x195&scale=2&maptype=roadmap&markers=color:blue%7C" + lat + "," + lng + "&key=AIzaSyCcgWNRhYcnApQ82UCBgtKJfmUF9HLxr_g";
    var img = $("#static-map");
    img.attr("src", staticMapAPI);
    $("body").css('background-image', 'url(' + staticMapAPI + ')');
    var imgWrap = $(".imagewrap");
    var btn = $(".button1");
    console.log(btn);
    btn.click(function(e){
        console.log("Clicked it!");
        imgWrap.remove();
        $("body").css('background-image', 'none');
        gm.nav.setDestination(function(success){
            console.log("Successfully launched navigation!");
        }, function(fail){
            console.log("Failed to launch navigation!");
        }, {latitude: 40.792663, longitude: -77.871172}, true);
        
    });
}, true);

console.log($("body").width());
console.log($("body").height());






