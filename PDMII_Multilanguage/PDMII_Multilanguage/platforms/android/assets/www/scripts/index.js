// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var locale;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        setLocate();

    }

    function setLocate() {

        navigator.globalization.getPreferredLanguage(
            function (language) {
                console.log(language.value);
                locale = language.value.split('-')[0];
                verifyLocaleStrings();
                setLanguage();
            },
            function (error) {
                console.log('Error getting language: ' + error.message);
                locale = 'pt';
                setLanguage();
            }
        );
    }

    function verifyLocaleStrings() {
        try {
            var string = strings[locale].hello;
        }
        catch (error) {
            console.log("Error: " + error.message);
            console.log("Language string not found. Reseting to Default ");
            locale = 'pt';
        }
    }

    function setLanguage() {
        $('#btnHello').html(strings[locale].hello); 0
        $('#btnGoodbye').html(strings[locale].goodbye);

        $('#dateTitle').html("<span class='cap_bold'>" + strings[locale].date + ":</span>");
        setDate(new Date(), 'date');
    }

    function setDate(arg_date, arg_element) {

        navigator.globalization.dateToString(

            arg_date,

            function (date) {
                $('#' + arg_element + '').html(date.value);
            },

            function (error) {
                console.log('Error getting date: ' + error.message);
            },

            { formatLength: 'short', selector: 'date and time' }
        );

    }

})();