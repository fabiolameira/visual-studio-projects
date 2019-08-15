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
    var buttonListView;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        initVariables();

        getLastInfo();

        form.addEventListener("submit", onSubmitForm, false);

        buttonListView.addEventListener("touchend", listPersons, false);

    };

    function initVariables() {

        form = document.getElementById("form");
        name = document.getElementById("name");
        birthDate = document.getElementById("birthDate");
        location = document.getElementById("location");
        email = document.getElementById("email");
        mobile = document.getElementById("mobile");

        buttonListView = document.getElementById("btnListView");

    }

    function getLastInfo() {

        if (storage.getItem("personsList") !== null) {
            personsListJSON = storage.getItem("personsList");
            personsList = JSON.parse(personsListJSON);
        }

    }

    function onSubmitForm(e) {

        e.preventDefault();

        try {

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

            // Grava a informação
            saveInfo();

            navigator.notification.alert("Contacto inserido com sucesso :D");

        } catch (err) {
            navigator.notification.alert("Erro: " + err, null);
        }

    }

    // Função para gravar os valores na storage
    function saveInfo() {

        // Tranforma-se o array em JSON
        personsListJSON = JSON.stringify(personsList);
        console.log(personsListJSON);

        storage.setItem("personsList", personsListJSON);

    }

    // Função para exibir a lista
    function listPersons() {

        var listViewPersons = document.getElementById("persons-list");
        var html = "";

        if (personsList.length === 0) {

            listViewPersons.innerHTML = "<h3>Sem dados...</h3>";
            return;

        }

        html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Procurar Pessoas...' data-inset='true'>";

        for (var i = 0; i < personsList.length; i++) {

            html += "<li id='" + i + "'><a href='#page_details' data-transition='slide'>" + personsList[i].name + "</a></li>";

        }

        html += "</ul>";

        //--------------------------------------------------------------------------------------//
        listViewPersons.innerHTML = html;
        $('#persons-list').trigger('create');

        // Função que associa o evento touchend a cada LI e que chama a função listDetails(i) com referencia para a pessoa através do array
        $('#ul-list').delegate('li', 'touchend', function () {
            listDetails($(this).attr('id'));
        });

    }

    function listDetails(i) {

        var personDetails = document.getElementById("person-details");
        var html = "";

        html = "<ul id='ul-list' data-role='listview' data-inset='true'>";

        html += "<li data-role='list-divider' class='capitalize's><b>Nome:</b> " + personsList[i].name + "</li>";
        html += "<li><b>Data de Nascimento:</b> " + personsList[i].birthDate + "</li>";
        html += "<li><b>Localidade:</b> " + personsList[i].location + "</li>";
        html += "<li><b>Email:</b> " + personsList[i].email + "</li>";
        html += "<li><b>Telemóvel:</b> " + personsList[i].mobile + "</li>";

        html += "</ul>";


        personDetails.innerHTML = html;
        $('#person-details').trigger('create');


    }

})();