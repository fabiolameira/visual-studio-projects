// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        document.getElementById('button').addEventListener('touchend', getDeviceProperties, false);

    };

    function getDeviceProperties() {
        var label = document.getElementById('deviceProperties');

        label.innerHTML = '<b> Device Cordova:</b> ' + device.cordova + '<br />' +
            '<b> Device Model:</b> ' + device.model + '<br />' +
            '<b> Device Platform:</b> ' + device.platform + '<br />' +
            '<b> Device UUID:</b> ' + device.uuid + '<br />' +
            '<b> Device Version:</b> ' + device.version + '<br />' +
            '<b> Device Manufacturer:</b> ' + device.manufacturer + '<br />' +
            '<b> Device is Virtual?</b> ' + device.isVirtual + '<br />' +
            '<b> Device Serial:</b> ' + device.serial + '<br />'
    };

})();