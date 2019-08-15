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

    var tittleListOrDeletePersons;

    var storage = window.localStorage;
    var buttonListView;
    var buttonDeletePerson;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        initVariables();

        getLastInfo();

        form.addEventListener("submit", onSubmitForm, false);

        buttonListView.addEventListener("touchend", function () { listOrDeletePersons('list'); }, false);
        buttonDeletePerson.addEventListener("touchend", function () { listOrDeletePersons('delete'); }, false);

    };

    function initVariables() {

        form = document.getElementById("form");
        name = document.getElementById("name");
        birthDate = document.getElementById("birthDate");
        location = document.getElementById("location");
        email = document.getElementById("email");
        mobile = document.getElementById("mobile");

        tittleListOrDeletePersons = document.getElementById("list_delete_title");

        buttonListView = document.getElementById("btnListView");
        buttonDeletePerson = document.getElementById("btnDeletePerson");

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

            navigator.notification.alert("Dados inseridos com sucesso :D");

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

    // Função para exibir ou apagar a lista de pessoas
    function listOrDeletePersons(command) {

        var listViewOrDeletePersons = document.getElementById("persons-list-delete");
        var html = "";

        console.log(command);

        if (personsList.length === 0) {
            tittleListOrDeletePersons.innerHTML = (command === "list") ? "Listar Pessoas" : "Apagar Pessoas";
            listViewOrDeletePersons.innerHTML = "<h3>Sem dados...</h3>";
            return;

        }

        if (command === "list") {

            tittleListOrDeletePersons.innerHTML = "Listar Pessoas";

            html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Procurar Pessoas...' data-inset='true'>";

            for (var i = 0; i < personsList.length; i++) {

                html += "<li id='" + i + "'><a href='#page_details' data-transition='slide'>" + personsList[i].name + "</a></li>";

            }

            html += "</ul>";


            listViewOrDeletePersons.innerHTML = html;

            // Função que associa o evento touchend a cada LI e que chama a função listDetails(i) com referencia para a pessoa através do array
            $('#ul-list').delegate('li', 'touchend', function () {
                listDetails($(this).attr('id'));
            });

        }

        else if (command === "delete") {

            tittleListOrDeletePersons.innerHTML = "Apagar Pessoas";

            html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Procurar Pessoas...' data-inset='true'>";

            for (var i = 0; i < personsList.length; i++) {

                html += "<li id='" + i + "' data-icon='delete' ><a href='#'>" + personsList[i].name + "</a></li>";

            }

            html += "</ul>";

            listViewOrDeletePersons.innerHTML = html;

            $('#ul-list').delegate('li', 'touchend', function () {
                deletePerson($(this).attr('id'));
            });

        }

        $('#persons-list-delete').trigger('create');

    }

    // Função para exibir detalhes das pessoas
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

    function deletePerson(i) {

        navigator.notification.confirm(
            'Confirma que quer apagar esta pessoa?', // message
            function (buttonIndex) {
                onConfirmDelete(buttonIndex, i);
            }, // callback to invoke with index of button pressed
            'Confirmação', // title
            ['Não', 'Sim'] // buttonLabels
        )

    }

    function onConfirmDelete(buttonIndex, i) {
        console.log(buttonIndex);
        if (buttonIndex === 2) {
            personsList.splice(i, 1);
            saveInfo();
            listOrDeletePersons('delete');

            console.log(personsList.length);
        }
    }

})();