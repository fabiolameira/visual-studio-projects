// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var map = null;
    var marker = null;
    var mapOptions = {
        center: new google.maps.LatLng(39.477801, -8.096995),
        zoom: 6,
        zoomControl: false,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };



    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        document.getElementById("btnLocation").addEventListener("touchend", getLocation, false);
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

    };

    function getLocation() {

        navigator.geolocation.getCurrentPosition(

            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                setMarker(latitude, longitude);
                setInfoWindow();
            },

            function (error) {
                navigator.notification.alert(
                    'code: ' + erro.code + '\n' + 'Message:' + error.message + '\n',        // message
                    null,                                                                   // callback
                    'Error',                                                                //title
                    'OK'                                                                    //buttonName
                );
            },

            { maximumAge: 500, timeout: 15000, enableHighAccuracy: true }

        );

    }

    function setMarker(latitude, longitude) {

        var latlng = new google.maps.LatLng(latitude, longitude);

        if (marker === null) {
            marker = new google.maps.Marker({
                position: latlng
            });

            marker.setMap(map);

        } else {
            marker.setPosition(latlng);
            map.setZoom(16);
            map.setCenter(latlng);
        }
        

    }

    function setInfoWindow() {

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        var content;

        geocoder.geocode({ 'location': marker.getPosition() }, function (results, status) {

            if (status === 'OK') {
                if (results[1]) {
                    content = "Latitude: " + marker.getPosition().lat() + "<br/>";
                    content += "Longitude: " + marker.getPosition().lng() + "<br/>";
                    content += results[1].formatted_address;

                    infowindow.setContent(content);
                    infowindow.open(map, marker);

                } else {
                    navigator.notification.alert('No Results Found');
                }
            } else {
                navigator.notification.alert('Geocoder Failed Due To: ' + status);
            }
        });

    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();