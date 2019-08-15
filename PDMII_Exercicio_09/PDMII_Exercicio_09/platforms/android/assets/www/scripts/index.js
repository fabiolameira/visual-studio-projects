// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var form;
    var inputName;
    var inputBirthDate;
    var inputTown;
    var inputEmail;
    var inputPhone;
    var listViewPersons;
    var personsList = [];
    var personsListJSON;
    var buttonListView;
    var buttonListViewDelete;
    var titleListDelete;
    var inputPhoto;
    var buttonPickPhoto;
    var buttonExit;
    var database = null;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        initVariables();
        //openDatabase();

        document.addEventListener("backbutton", onBackKeyDown, false);
        buttonExit.addEventListener("touchend", exitApp, false);
        buttonPickPhoto.addEventListener("touchend", pickImage, false);

        form.addEventListener("submit", submitForm, false);

        buttonListView.addEventListener("touchend", function () {
            listOrDeletePersons("list");
        }, false);
        buttonListViewDelete.addEventListener("touchend", function () {
            listOrDeletePersons("delete");
        }, false);

    }


    function initVariables() {
        form = document.getElementById("form");
        inputPhoto = document.getElementById("photo-input");
        inputName = document.getElementById("name-input");
        inputBirthDate = document.getElementById("birth-date-input");
        inputTown = document.getElementById("town-input");
        inputEmail = document.getElementById("email-input");
        inputPhone = document.getElementById("phone-input");
        buttonListView = document.getElementById("btnListView");
        buttonListViewDelete = document.getElementById("btnListViewDelete");
        titleListDelete = document.getElementById("list_delete_title");
        buttonPickPhoto = document.getElementById("btnPickPhoto");
        buttonExit = document.getElementById("btnExit");

    }

    function openDatabase() {

        try {

            database = window.sqlitePlugin.openDatabase({ name: 'persons.db', location: 'default' },

                function () {
                    console.log("Base de Dados aberta com sucesso");
                    //getLastInfo();
                },

                function (error) {
                    console.log("Erro ao abrir Base de Dados: " + error.message);
                }

            );

        }
        catch (err) {

            navigator.notification.alert("Error: " + err, null);

        }

    }


    function getLastInfo() {

        if (storage.getItem("personList") !== null) {

            personsListJSON = storage.getItem("personList");
            personsList = JSON.parse(personsListJSON);
        }
    }


    // Função a executar quando se clica no Submeter
    //----------------------------------------------------------------------------------------------------
    function submitForm(e) {

        e.preventDefault();

        try {
            //Cria-se um objecto pessoa e preenchem-se os respectivos atributos
            var person = new Object();
            person.id = null;
            person.imageURI = inputPhoto.value;
            person.name = inputName.value;
            person.birthDate = inputBirthDate.value;
            person.town = inputTown.value;
            person.email = inputEmail.value;
            person.phone = inputPhone.value;

            //Adiciona-se ao array de pessoas
            personsList.push(person);

            // Inserir pessoa na Base de Dados
            insertPersonInDatabase(person);

            //Limpa o form
            form.reset();

        }
        catch (err) {
            navigator.notification.alert("Erro:" + err, null);
        }
    }

    //Função para gravar na base de dados
    //----------------------------------------------------------------------------------
    function insertPersonInDatabase(person) {

        if (database === null) {
            console.log("Base de Dados ainda está fechada");
            return;
        }

        try {
            database.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS PersonTable (id INTEGER PRIMARY KEY AUTOINCREMENT, imageURI, name, birthDate, town, email, phone,)');
                tx.executeSql('INSERT INTO PersonTable (imageURI, name, birthDate,town, email, phone) VALUES (?, ?, ?, ?, ?, ?)', [person.imageURI, person.name, person.birthDate, person.town, person.email, person.phone], function (tx, resultSet) {
                    person.id = resultSet.insertId;
                    console.log('resultSet.insertId: ' + resultSet.insertId);
                    console.log('resultSet.rowsAffected: ' + resultSet.rowsAffected);
                }, function (tx, error) {
                    console.log('INSERT error: ' + error.message);
                });
            }, function (error) {
                console.log('transaction error: ' + error.message);
            }, function () {
                console.log('transaction ok');
                navigator.notification.alert("Contato inserido com sucesso", null, "Informação", "OK");
            });
        }
        catch (err) {

            navigator.notification.alert("Erro: " + err, null);

        }

    }


    //Função para Listar /Apagar as Pessoas
    //----------------------------------------------------------------------------------
    function listOrDeletePersons(command) {

        var listViewPersons = document.getElementById("persons-list");
        var html = "";

        if (personsList.length === 0) {
            listViewPersons.innerHTML = "<h3>Sem dados...</h3>";
            return;
        }

        html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Pesquisar...' data-inset='true'>";
        for (var i = 0; i < personsList.length; i++) {

            //Define qual é o tipo de botão que é construido com base no comando
            if (command === 'list')
                html += "<li id='" + personsList[i].id + "'><a href='#page_details' data-prefetch='true' data-transition='slide'>" + personsList[i].name + "</a></li>";
            else if (command === 'delete')
                html += "<li id='" + personsList[i].id + "' data-icon='delete'><a href='#' data-transition='slide'>" + personsList[i].name + "</a></li>";
        }

        html += "</ul>";
        listViewPersons.innerHTML = html;

        $("#persons-list").trigger("create");


        //Define qual a função que é executada no pressionar do botão com base no comando e muda o título da página
        //-----------------------------------------------------------------------------------------------------------------------------------------
        if (command === "list") {

            titleListDelete.innerHTML = "Listar Pessoas";

            $("#ul-list").delegate("li", "touchend", function () {
                listDetails($(this).attr("id"));
            });
        }
        else if (command === "delete") {
            titleListDelete.innerHTML = "Apagar Pessoas";

            $("#ul-list").delegate("li", "touchend", function () {
                deletePerson($(this).attr("id"));
            });
        }
        //-----------------------------------------------------------------------------------------------------------------------------------------
    }


    //Função para exibir os detalhes da pessoa selecionada
    //----------------------------------------------------------------------------------
    function listDetails(id) {

        var personDetails = document.getElementById("person-details");
        var html = "";

        var i = findIndex(id);

        html = "<ul data-role='listview' data-inset='true'>" +
            "<li data-role='list-divider' class='capitalize'>" + personsList[i].name + "</li> " +
            "<li id='li_photo'><img class='photo' src='" + personsList[i].imageURI + "' alt='photo'></li> " +
            "<li><b>Data de Nascimento: </b>" + personsList[i].birthDate + "</li>" +
            "<li><b>Localidade:</b> " + personsList[i].town + "</li>" +
            "<li><b>Email:</b> " + personsList[i].email + "</li>" +
            "<li><b>Telefone</b>: " + personsList[i].phone + "</li>" +
            "</ul>";

        personDetails.innerHTML = html;

        console.log(personsList[i].imageURI);

        $("#person-details").trigger("create");
        $("#li_photo").removeClass("ui-li-has-thumb");

    }


    //Função para apagar a pessoa selecionada
    //----------------------------------------------------------------------------------
    function deletePerson(id) {

        //Confirma a acção antes de apagar
        navigator.notification.confirm(
            "Tem a certeza que deseja apagar esta pessoa?", // Mensagem
            function (buttonIndex) {                        // Função de callback  
                onConfirmDelete(buttonIndex, id);
            },
            "Confirmação",                                  // Título 
            ["Sim", "Não"]                                  // Botões   
        );
    }

    function onConfirmDelete(buttonIndex, id) {

        if (buttonIndex === 1) {

            var i = findIndex(id);

            personsList.splice(i, 1);
            listOrDeletePersons("delete");
            deletePersonFromDatabase(id);
        }
        else
            return;
    }

    function deletePersonFromDatabase(id) {

        try {
            database.transaction(function (tx) {

                tx.executeSql('DELETE FROM PersonTable WHERE id = ?', [id], function (tx, resultSet) {
                    console.log('resultSet.removedId: ' + resultSet.insertId);
                    console.log('resultSet.rowsAffected: ' + resultSet.rowsAffected);
                }, function (tx, error) {
                    console.log('DELETE error: ' + error.message);
                });
            }, function (error) {
                console.log('transaction error: ' + error.message);
            }, function () {
                console.log('transaction ok');
            });

        } catch (err) {
            navigator.notification.alert("Error: " + err + null);
        }


    }

    //Função selecionar a imagem
    //----------------------------------------------------------------------------------
    function pickImage() {

        navigator.notification.confirm(
            "Qual o método a usar?",          // Mensagem
            sourceConfirm,                   // Callback
            "Confirmação",                    // Título 
            ["Câmara", "Album"]               // Botões   
        );



        function sourceConfirm(buttonIndex) {

            var source = (buttonIndex === 1) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var options = setOptions(source);

            navigator.camera.getPicture(function cameraSuccess(imageUri) {

                inputPhoto.value = imageUri;

            }, function cameraError(error) {
                console.debug("Erro: " + error);

            }, options);
        }
    }


    function setOptions(source) {

        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true,
            targetHeight: 500,
            targetWidth: 500
        };
        return options;
    }

    function findIndex(id) {

        for (var i = 0; i < personList.length; i++) {

            if (personList[i].id == id) {
                return i;
            }

        }

        return null;
    }

    function onBackKeyDown() {

        var activePage = $.mobile.activePage.attr("id");

        if (activePage === 'main-page') {
            exitApp();
        }
        else {
            window.history.back();
        }

    }

    function exitApp() {
        database.close(
            function () {
                console.log("Base de Dados fechada com sucesso");
            },
            function (error) {
                console.log("Erro no fecho da Base de Dados: " + error.message);
            }
        );
        navigator.app.exitApp();
    }

})();