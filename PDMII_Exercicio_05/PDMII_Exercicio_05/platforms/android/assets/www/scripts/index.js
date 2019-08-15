// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var form;
    var personsList = [];
    var personsListJSON;

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

        form.addEventListener("submit", onSubmitForm, false);

    };

    function initVariables() {

        form = document.getElementById("form");
        name = document.getElementById("name");
        birthDate = document.getElementById("birthDate");
        location = document.getElementById("location");
        email = document.getElementById("email");
        mobile = document.getElementById("mobile");

        result = document.getElementById("result");

    }

    function getLastInfo() {

        if (storage.getItem("personsList") !== null) {
            personsListJSON = storage.getItem("personsList");
            personsList = JSON.parse(personsListJSON);

            printResult();
        }

    }

    function onSubmitForm(e) {

        e.preventDefault();

        // Cria-se o objecto pessoa e preenchem-se os respetivos atriburos
        var person = new Object();
        person.name = name.value;
        person.birthDate = birthDate.value;
        person.location = location.value;
        person.email = email.value;
        person.mobile = mobile.value;
        // É possível forçar o tipo de dados como inteiro
        //person.mobile = parseInt(mobile.value);

        // Adiciona a pessoa recém criada ao array de pessoas
        personsList.push(person);

        // Limpa form
        form.reset();

        //Exibe o resultado;
        printResult();

        // Grava a informação
        saveInfo();

    }

    // Função para exibir a lista
    function printResult() {

        result.innerHTML = "";

        for (var i = 0; i < personsList.length; i++) {
            result.innerHTML += i + 1 + "<br>" +
                personsList[i].name + "<br>" +
                personsList[i].birthDate + "<br>" +
                personsList[i].location + "<br>" +
                personsList[i].email + "<br>" +
                personsList[i].mobile + "<hr>"; 
        }

    }

    // Função para gravar os valores na storage
    function saveInfo() {

        // Tranforma-se o array em JSON
        personsListJSON = JSON.stringify(personsList);
        console.log(personsListJSON);

        storage.setItem("personsList", personsListJSON);

    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();