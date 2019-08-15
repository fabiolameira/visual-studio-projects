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

        //var persons = ["João", "Manuel", "Pedro", "Ana", "Marta"];
        var persons = [];
        persons[0] = "João";
        persons[1] = "Manuel";
        persons[2] = "Pedro";
        persons[3] = "Ana";
        persons[4] = "Marta";

        var result = document.getElementById("result");
        var html = "";

        html = "<ul>";
        html += "<li>" + persons[0] + "</li>";
        html += "<li>" + persons[1] + "</li>";
        html += "<li>" + persons[2] + "</li>";
        html += "<li>" + persons[3] + "</li>";
        html += "<li>" + persons[4] + "</li>";
        html += "</ul>";

        result.innerHTML = html;
    }

} )();