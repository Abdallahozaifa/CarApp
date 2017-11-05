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
        console.log( "Data Loaded: " + JSON.stringify(data));
        var classTime = $("#time");
        var courseName = $("#course");
        var building = $("#building");
        courseName.text(data.name);
        building.text(data.building);
        classTime.text(data.time);
        var imgWrap = $(".imagewrap");
        var btn = $(".button1");
        btn.click(function(e){
            swal({
              title: 'Would you like to accept the fee?',
              text: "It will cost $5.00",
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
                console.log("Clicked it!");
                imgWrap.remove();
                $("body").css('background-image', 'none');
                gm.nav.setDestination(function(success){
                    console.log("Successfully launched navigation!");
                    console.log("lat: %s, lng: %s", data.lat, data.lng);
                    $("#time").remove();
                    $("#course").remove();
                    $("#building").remove();
                    //gm.system.closeApp();
                }, function(fail){
                    console.log("Failed to launch navigation!");
                }, {latitude: data.lat, longitude: data.lng}, true);  
              });
            });
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
    var staticMapAPI = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lng + "&zoom=16&size=400x175&scale=2&maptype=roadmap&markers=color:blue%7C" + lat + "," + lng + "&key=AIzaSyCcgWNRhYcnApQ82UCBgtKJfmUF9HLxr_g";
    var img = $("#static-map");
    img.attr("src", staticMapAPI);
    $("body").css('background-image', 'url(' + staticMapAPI + ')');
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






