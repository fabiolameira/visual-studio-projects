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

        var persons = [];
        persons[0] = { "name": "João", "age": 30 };
        persons[1] = { "name": "Manuel", "age": 25 };
        persons[2] = { "name": "Pedro", "age": 15 };
        persons[3] = { "name": "Ana", "age": 18 };
        persons[4] = { "name": "Marta", "age": 28 };

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