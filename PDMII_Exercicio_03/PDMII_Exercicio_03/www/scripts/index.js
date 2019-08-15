// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var watchID = null;
    var i = 0;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        document.addEventListener('pause', onPause, false);
        document.getElementById('btnMotion').addEventListener('touchend', getMotion, false);
        document.getElementById('btnGps').addEventListener('touchend', getGps, false);

    };

    function getMotion() {

        setCss('gps-section', 'display', 'none');
        setCss('motion-section', 'display', 'block');

        var options = { frequency: 500 };
        watchID = navigator.accelerometer.watchAcceleration(onMotionSuccess, onMotionError, options);
    }

    function getGps() {

        clearWatch();
        setCss('gps-section', 'display', 'block');
        setCss('motion-section', 'display', 'none');
        navigator.geolocation.getCurrentPosition(onGpsSucess, onGpsError, { maximumAge: 0, timeout: 5000, enableHighAccuracy: true });

    }

    function onMotionSuccess(acceleration) {
        var labelMotion = document.getElementById('labelMotion');

        labelMotion.innerHTML = 'Acceleration X: ' + acceleration.x + i + '<br />' +
            'Acceleration Y: ' + acceleration.y + '<br />' +
            'Acceleration Z: ' + acceleration.z + '<br />' +
            'Timestamp: ' + acceleration.timestamp + '<br />';
        i++;
    }

    function onMotionError() {
        alert('onError!');
    }

    function onGpsSucess(position) {
        var labelGps = document.getElementById('labelGps');

        labelGps.innerHTML = 'Longitude: ' + position.coords.longitude + '<br />' +
            'Altitude: ' + position.coords.altitude + '<br />' +
            'Accuracy: ' + position.coords.accuracy + '<br />' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
            'Heading: ' + position.coords.heading + '<br />' +
            'Speed: ' + position.coords.speed + '<br />' +
            'Timestamp: ' + position.timestamp + '<br />';
    }

    function onGpsError() {
        alert('code: ' + error.code + '<br />' +
            'message: ' + error.message + '<br />');
    }

    function setCss(element, property, value) {
        var node = document.getElementById(element).style;
        node.setProperty(property, value);
    }

    function onPause() {
        clearWatch();
    }

    function clearWatch() {

        if (watchID != null) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }

    }

})();