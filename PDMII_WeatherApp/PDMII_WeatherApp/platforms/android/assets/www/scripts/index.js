// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var OpenWeatherAppKey = "28a083c583e214f5501a3667f8826fb5";

    //var buttonGetWeather = document.getElementById("get-weather-btn");

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {

        //buttonGetWeather.addEventListener("touchend", getWeatherWithZipCode, false);
        $('#get-weather-btn').click(getWeatherWithZipCode);

    }

    function getWeatherWithZipCode() {
        var zipcode = $('#zip-code-input').val();
        var queryString =
            'http://api.openweathermap.org/data/2.5/weather?zip='
            + zipcode + ',pt&appid=' + OpenWeatherAppKey + '&units=metric';
        $.getJSON(queryString, function (results) {
            showWeatherData(results);
        }).fail(function (jqXHR) {
            $('#error-msg').show();
            $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
        });
        return false;
    }

    function showWeatherData(results) {

        if (results.weather.length) {
            $('#error-msg').hide();
            $('#weather-data').show();

            $('#title').text(results.name);
            $('#temperature').text(results.main.temp);
            $('#wind').text(results.wind.speed);
            $('#humidity').text(results.main.humidity);
            $('#visibility').text(results.weather[0].main);

            var sunriseDate = new Date(results.sys.sunrise * 1000);
            $('#sunrise').text(sunriseDate.toLocaleTimeString());

            var sunsetDate = new Date(results.sys.sunset * 1000);
            $('#sunset').text(sunsetDate.toLocaleTimeString());

        } else {
            $('#weather-data').hide();
            $('#error-msg').show();
            $('#error-msg').text("Error retrieving data. ");
        }
    }


} )();