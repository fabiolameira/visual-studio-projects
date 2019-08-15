// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    // MultiLanguage Vars
    var locale;

    // MapTab Vars
    var map = null;
    var marker = null;
    var mapOptions = {
        center: new google.maps.LatLng(39.477801, -8.096995),
        zoom: 6,
        zoomControl: false,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var btnGetLocation = document.getElementById('btnLocation');
    var infowindow = new google.maps.InfoWindow;

    // SearchTab Vars
    var OpenWeatherAppKey = "28a083c583e214f5501a3667f8826fb5";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        // MultiLanguage Section
        setLocale();

        // MapTab Section
        document.getElementById("btnLocation").addEventListener("touchend", getLocation, false);
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // SearchTab Section
        $('#get-weather-btn').click(getWeatherWithLocation);

    };

    // ######################### MultiLanguage Functions Section ######################### 
    function setLocale() {

        navigator.globalization.getPreferredLanguage(
            function (language) {
                locale = language.value.split('-')[0];
                verifyLocaleStrings();
                setLanguage();
            },
            function (error) {
                console.log('Error getting language: ' + error.message);
                locale = 'en';
                setLanguage();
            }
        );
    }

    function verifyLocaleStrings() {
        try {
            var string = strings[locale].mapTab;
        }
        catch (error) {
            console.log("Error: " + error.message);
            console.log("Language string not found. Reseting to Default ");
            locale = 'en';
        }
    }

    function setLanguage() {
        // MapTab Section
        $('#mapTabStringMap').html(strings[locale].mapTab);
        $('#searchTabStringMap').html(strings[locale].searchTab);
        $('#btnLocation').html(strings[locale].getLocationBtn);

        //SearchTab Section
        $('#mapTabStringSearch').html(strings[locale].mapTab);
        $('#searchTabStringSearch').html(strings[locale].searchTab);
        $('#insertLocationString').html(strings[locale].insertLocationString);
        $('#location-input').attr('placeholder', strings[locale].location);
        $('#get-weather-btn').html(strings[locale].findWeatherBtn);
        $('#windString').html(strings[locale].wind);
        $('#maxTemperatureString').html(strings[locale].maxTemperature);
        $('#minTemperatureString').html(strings[locale].minTemperature);
        $('#tempUnityString').html(strings[locale].unityString);
        $('#maxUnityString').html(strings[locale].unityString);
        $('#minUnityString').html(strings[locale].unityString);
        $('#knotsString').html(strings[locale].knots);
        $('#humidityString').html(strings[locale].humidity);
        $('#visibilityString').html(strings[locale].visibility);
        $('#sunriseString').html(strings[locale].sunrise);
        $('#sunsetString').html(strings[locale].sunset);

    }

    // ######################### MapTab Functions Section ######################### 
    function getLocation() {

        navigator.geolocation.getCurrentPosition(

            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                setMarker(latitude, longitude);
                getWeatherWithCoordinates(latitude, longitude);

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
        }

        map.setZoom(16);
        map.setCenter(latlng);


    }

    function getWeatherWithCoordinates(latitude, longitude) {
        var queryString =
            'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude
            + '&appid=' + OpenWeatherAppKey + '&units=' + strings[locale].unity + '&lang=' + locale;

        $.getJSON(queryString, function (queryResults) {
            showWeatherDataMap(queryResults);
        }).fail(function (jqXHR) {
            $('#error-msg-map').show();
            $('#error-msg-map').text("Error retrieving data. " + jqXHR.statusText);
        });
        return false;
    }

    function showWeatherDataMap(queryResults) {

        var geocoder = new google.maps.Geocoder;
        var content;

        if (infowindow === null) {
            infowindow = new google.maps.InfoWindow;
        }

        geocoder.geocode({ 'location': marker.getPosition() }, function (results, status) {

            if (status === 'OK') {
                if (results[1]) {

                    content = results[1].formatted_address + "<br/>";
                    content += "<br/>";

                    if (queryResults.weather.length) {

                        content += strings[locale].location + ": " + queryResults.name + "<br/>";
                        content += strings[locale].temperature + ": " + queryResults.main.temp + strings[locale].unityString + "<br/>";
                        content += strings[locale].maxTemperature + ": " + queryResults.main.temp_max + strings[locale].unityString + "<br/>";
                        content += strings[locale].minTemperature + ": " + queryResults.main.temp_min + strings[locale].unityString + "<br/>";
                        content += strings[locale].wind + ": " + queryResults.wind.speed + " " + strings[locale].knots + "<br/>";
                        content += strings[locale].humidity + ": " + queryResults.main.humidity + "% <br/>";
                        content += strings[locale].visibility + ": " + queryResults.weather[0].description + "<br/>";

                        var sunriseDate = new Date(queryResults.sys.sunrise * 1000);
                        content += strings[locale].sunrise + ": " + sunriseDate.toLocaleTimeString() + "<br/>";

                        var sunsetDate = new Date(queryResults.sys.sunset * 1000);
                        content += strings[locale].sunset + ": " + sunsetDate.toLocaleTimeString() + "<br/>";

                        content += '<img id="icon" src="http://openweathermap.org/img/w/' + queryResults.weather[0].icon + '.png"/>';

                    } else {
                        content += "Error getting Weather Info.";
                    }

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

    // ######################### SeachTab Functions Section ######################### 
    function getWeatherWithLocation() {
        var location = $('#location-input').val();
        var queryString =
            'http://api.openweathermap.org/data/2.5/weather?q=' + location
            + ',pt&appid=' + OpenWeatherAppKey + '&units=' + strings[locale].unity + '&lang=' + locale;


        $.getJSON(queryString, function (results) {
            showWeatherDataSearch(results);
        }).fail(function (jqXHR) {
            $('#error-msg-search').show();
            $('#error-msg-search').text("Error retrieving data. " + jqXHR.statusText);
        });
        return false;
    }

    function showWeatherDataSearch(results) {

        if (results.weather.length) {
            $('#error-msg-search').hide();
            $('#weather-data-search').show();
            $('#title-search').text(results.name);
            $('#temperature-search').text(results.main.temp);
            $('#maxTemperature-search').text(results.main.temp_max);
            $('#minTemperature-search').text(results.main.temp_min);
            $('#icon-search').attr('src', 'http://openweathermap.org/img/w/' + results.weather[0].icon + '.png');
            $('#wind-search').text(results.wind.speed);
            $('#humidity-search').text(results.main.humidity);
            $('#visibility-search').text(results.weather[0].description);

            var sunriseDate = new Date(results.sys.sunrise * 1000);
            $('#sunrise-search').text(sunriseDate.toLocaleTimeString());

            var sunsetDate = new Date(results.sys.sunset * 1000);
            $('#sunset-search').text(sunsetDate.toLocaleTimeString());

        } else {
            $('#weather-data-search').hide();
            $('#error-msg-search').show();
            $('#error-msg-search').text("Error retrieving data. ");
        }
    }

})();