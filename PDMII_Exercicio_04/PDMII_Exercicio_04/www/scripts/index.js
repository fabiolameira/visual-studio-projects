// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var name;
    var birthDate;
    var location;
    var email;
    var mobile;

    var storage = window.localStorage;
    var result;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        initVariables();

        getLastInfo();

        document.getElementById("submitForm").addEventListener("submit", onSubmitForm, false);

    };

    function initVariables() {

        name = document.getElementById("name");
        birthDate = document.getElementById("birthDate");
        location = document.getElementById("location");
        email = document.getElementById("email");
        mobile = document.getElementById("mobile");
        result = document.getElementById("result");

    }

    function getLastInfo() {

        if (storage.getItem("name") !== null)
            result.innerHTML = "Nome: " + storage.getItem("name") + "<br>";

        if (storage.getItem("birthDate") !== null)
            result.innerHTML += "Data de Nascimento: " + storage.getItem("birthDate") + "<br>";

        if (storage.getItem("location") !== null)
            result.innerHTML += "Localidade: " + storage.getItem("location") + "<br>";

        if (storage.getItem("email") !== null)
            result.innerHTML += "Email: " + storage.getItem("email") + "<br>";

        if (storage.getItem("mobile") !== null)
            result.innerHTML += "Contacto: " + storage.getItem("mobile") + "<br>";
    }

    function onSubmitForm(e) {

        e.preventDefault();

        result.innerHTML = "Nome: " + name.value + "<br>" + 
            "Data de Nascimento: " + birthDate.value + "<br>" +
            "Localidade: " + location.value + "<br>" +
            "Email: " + email.value + "<br>" +
            "Contacto: " + mobile.value;

        saveInfo();

    }

    function saveInfo() {

        storage.setItem("name", name.value);
        storage.setItem("birthDate", birthDate.value);
        storage.setItem("location", location.value);
        storage.setItem("email", email.value);
        storage.setItem("mobile", mobile.value);

    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();