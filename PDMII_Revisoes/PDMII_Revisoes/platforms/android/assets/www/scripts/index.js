// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {

        printHTML();

    }

    //Exemplos de como construir listas com base nos elementos de um array
    function printHTML() {
        var result = document.getElementById("result");
        var html = "";

        html = "<ul>";
        html += "<li>João</li>";
        html += "<li>Manuel</li>";
        html += "<li>Pedro</li>";
        html += "<li>Ana</li>";
        html += "<li>Marta</li>";
        html += "</ul>";

        result.innerHTML = html;
    }

} )();