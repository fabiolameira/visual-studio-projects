// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        document.getElementById('alert').addEventListener('touchend', alertTest, false);
        document.getElementById('confirm').addEventListener('touchend', confirmTest, false);
        document.getElementById('prompt').addEventListener('touchend', promptTest, false);
        document.getElementById('beep').addEventListener('touchend', beepTest, false);

    };

    function alertTest() {

        navigator.notification.alert(
            'You are the winner!',  // message
            null,                   // callback
            'Game Over',            // title
            'Done'                  // buttonName
        )
    }

    function confirmTest() {

        navigator.notification.confirm(
            'You are the winner!', // message
            onConfirm,            // callback to invoke with index of button pressed
            'Game Over',           // title
            ['Restart', 'Exit']     // buttonLabels
        )
    }

    function onConfirm(buttonIndex) {
        alert('You selected button ' + buttonIndex);
    }

    function promptTest() {

        navigator.notification.prompt(
            'Please enter your name',  // message
            onPrompt,                  // callback to invoke
            'Registration',            // title
            ['Ok', 'Exit'],             // buttonLabels
            'Jane Doe'                 // defaultText
        );
    }

    function onPrompt(results) {
        alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
    }

    function beepTest() {
        navigator.notification.beep(2);
    }

})();