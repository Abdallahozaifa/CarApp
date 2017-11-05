// Your code goes here
/* global gm, document*/
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
    //vinElem.innerHTML = gm.info.getVIN();
});
/* 40.794631, -77.867982 */
$(function(){
    var settingsIcon = $(".settings-icon");
    console.log(settingsIcon);
    settingsIcon.css("cursor", "pointer");
    settingsIcon.click(function(){
       console.log("Clicked settings icon!"); 
       document.getElementById('id01').style.display='block'
    });
});
var calcLat, calcLng, count=0;
/* Sends the coords to server */
var sendCoords = function(coords){    
    $.post( "https://ezpark-dalofeco.c9users.io/coords", coords).done(function(data) {
        console.log( "Data Loaded: " + JSON.stringify(data));
        var classTime = $("#time");
        var courseName = $("#course");
        var building = $("#building");
        courseName.text(data.name);
        building.text(data.building);
        classTime.text(data.time);
        var imgWrap = $(".imagewrap");
        var btn = $(".button1");
        var dest = {lat: data.lat, lng: data.lng};
        var staticMapAPI = "https://maps.googleapis.com/maps/api/staticmap?center=" + data.lat + "," + data.lng + "&zoom=16&size=400x175&scale=2&maptype=roadmap&markers=color:blue%7C" + data.lat + "," + data.lng + "&key=AIzaSyCcgWNRhYcnApQ82UCBgtKJfmUF9HLxr_g";
        $("body").css('background-image', 'url(' + staticMapAPI + ')');
        var img = $("#static-map");
        img.attr("src", staticMapAPI);
        var price = data.price;
        btn.click(function(e){
          gm.nav.setDestination(function(success){
                console.log("Successfully launched navigation!");
                console.log("lat: %s, lng: %s", data.lat, data.lng);
                var interval = gm.info.watchVehicleData(function(data){
                    console.log("new lat: %s, new long: %s", data.gps_lat/3600000, data.gps_long/3600000);
                    if(!isNaN(data.gps_lat)){
                        calcLat = Math.abs(dest.lat - data.gps_lat/3600000);
                    }
                    if(!isNaN(data.gps_long)){
                        calcLng = Math.abs(dest.lng - data.gps_long/3600000);
                    }
                    console.log("calc lat: %s, calc long: %s", calcLat, calcLng);
                    if(calcLat < 0.0004 && calcLng < 0.0004){
                        swal({
                          title: 'Would you like to accept the fee?',
                          text: "It will cost $" + price + ".00",
                          type: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#282b30',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, pay the fee!'
                        }).then(function () {
                          swal({
                          title: 'Payment Authorized!',
                          type: 'success',
                          confirmButtonColor: '#282b30',
                          confirmButtonText: 'OK'
                        }).then(function(){
                            $.get("https://ezpark-dalofeco.c9users.io/arrived", function(data, status){
                                console.log("Finished with Tripp!!");
                                gm.system.closeApp(); 
                            });
                          });
                        });
                        gm.info.clearVehicleData(interval);
                    }
                }, ['gps_lat', 'gps_long']);
          }, function(fail){
                console.log("Failed to launch navigation!");
          }, {latitude: data.lat, longitude: data.lng}, true);
        });
    }).fail(function() {
     console.log("error");
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
    var buildingTag = $(".building");

        $.fn.textWidth = function(){
             var calc = '<span style="display:none">' + $(this).text() + '</span>';
             $('body').append(calc);
             var width = $('body').find('span:last').width();
             $('body').find('span:last').remove();
            return width;
        };
       
        $.fn.marquee = function(args) {
            var that = $(this);
            var textWidth = that.textWidth(),
                offset = that.width(),
                width = offset,
                css = {
                    'text-indent' : that.css('text-indent'),
                    'overflow' : that.css('overflow'),
                    'white-space' : that.css('white-space')
                },
                marqueeCss = {
                    'text-indent' : width,
                    'overflow' : 'hidden',
                    'white-space' : 'nowrap'
                },
                args = $.extend(true, { count: -1, speed: 1e1, leftToRight: false }, args),
                i = 0,
                stop = textWidth*-1,
                dfd = $.Deferred();
           
            function go() {
                //console.log("go");
                //console.log("width: %s, stop: %s", width, stop);
                //console.log("speed: %s", args.speed);
                if(that.css('overflow')!="hidden") { 
                    //that.css('text-indent', width + 'px'); 
                    return false;
                }
                if(!that.length) return dfd.reject();
                if(width/2 < stop) {
                    //console.log("slowing down");
                    i++;
                    if(i == args.count) {
                        that.css(css);
                        return dfd.resolve();
                    }
                    if(args.leftToRight) {
                        width = textWidth*-1;
                    } else {
                        width = offset;
                    }
                }
                that.css('text-indent', width + 'px');
                if(args.leftToRight) {
                    width++;
                } else {
                    width--;
                }
                setTimeout(go, args.speed);
            };
            
            if(args.leftToRight) {
                width = textWidth*-1;
                width++;
                stop = offset;
            } else {
                width--;            
            }
            that.css(marqueeCss);
            go();
            return dfd.promise();
    };

    buildingTag.marquee(); 
}, true);


console.log($("body").width());
console.log($("body").height());






