// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {

        document.getElementById("form").addEventListener('submit', getPlaceInfo, false);

    };

    function getPlaceInfo(e) {

        e.preventDefault();
        var place = $("#placeInput").val();
        var queryString = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" + place + "&maxRows=10&lang=pt&username=mbelem&style=full";

        $.getJSON(queryString, function (results) {

            console.log(results);
            showResults(results);

        }).fail(function (jqXHR) {

            console.log("Error retrieving data: " + jqXHR.statusText);
            
        });

    }

    function showResults(results) {

        var html = "";

        if (results.geonames.length == 0) {
            $("#result").html("<h4> Sem Resultados... </4>");
            return
        }

        for (var i = 0; i < results.geonames.length; i++) {
            html += "<div class='box'>";
            html += "<img src='" + results.geonames[i].thumbnailImg + "'/><br>";
            html += "<b>Título:</b>" + results.geonames[i].tittle + "<br>";
            html += "<b>Sumário:</b>" + results.geonames[i].summary + "<br>";
            html += "<b>Elevação:</b>" + results.geonames[i].elevation + "m<br>";
            html += "<b>Tipo:</b>" + results.geonames[i].feature + "<br>";
            html += "<b>Código:</b>" + results.geonames[i].countryCode + "<br>";
            html += "<b>Ranks:</b>" + results.geonames[i].rank + "<br>";
            html += "<b>Língua:</b>" + results.geonames[i].lang + "<br>";
            html += "<b>Latitude:</b>" + results.geonames[i].lat + "<br>";
            html += "<b>Longitude:</b>" + results.geonames[i].lng + "<br>";
            html += "<a href='http://" + results.geonames[i].wikipediaUrl + "'>Link</a><br>";
            html += "</div>"
        }

        $("#result").html(html);

    }

} )();