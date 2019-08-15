// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var storage = window.localStorage;
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

    document.addEventListener( 'deviceready', onDeviceReady.bind(this), false );

    function onDeviceReady() {

        initVariables();

        buttonPickPhoto.addEventListener("touchend", pickImage, false);

        form.addEventListener("submit", submitForm, false);

        buttonListView.addEventListener("touchend", function() {
            listOrDeletePersons("list");
        }, false);
        buttonListViewDelete.addEventListener("touchend", function () {
            listOrDeletePersons("delete");
        }, false);

        getLastInfo();

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
            person.imageURI = inputPhoto.value;
            person.name = inputName.value;
            person.birthDate = inputBirthDate.value;
            person.town = inputTown.value;
            person.email = inputEmail.value;
            person.phone = inputPhone.value;         

            //Adiciona-se ao array de pessoas
            personsList.push(person);

            //Limpa o form
            form.reset();

             //Guarda a informação na storage
            saveInfo();

            navigator.notification.alert("Contato inserido com sucesso", null, "Informação", "OK");

        }
        catch (err) {
            navigator.notification.alert("Erro:" + err, null);
        }
    }

    //Função para gravar o JSON na local storage
    //----------------------------------------------------------------------------------
    function saveInfo() {

        //Transforma-se o array em JSON
        personsListJSON = JSON.stringify(personsList);
        storage.setItem("personList", personsListJSON);
        console.log("Info Saved On Storage");
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
        for (var i = 0; i < personsList.length; i++){

              //Define qual é o tipo de botão que é construido com base no comando
            if (command === 'list')
                html += "<li id='" + i + "'><a href='#page_details' data-prefetch='true' data-transition='slide'>" + personsList[i].name + "</a></li>";
            else if (command === 'delete')
                html += "<li id='" + i + "' data-icon='delete'><a href='#' data-transition='slide'>" + personsList[i].name + "</a></li>";
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
    function listDetails(i) {

        var personDetails = document.getElementById("person-details");
        var html = "";

        html = "<ul data-role='listview' data-inset='true'>" +
            "<li data-role='list-divider' class='capitalize'>" + personsList[i].name + "</li> " +
            "<li id='photo'><img class='photo' src='" + personsList[i].imageURI + "' alt='photo'></li> " +
            "<li><b>Data de Nascimento: </b>" + personsList[i].birthDate + "</li>" +
            "<li><b>Localidade:</b> " + personsList[i].town + "</li>" +
            "<li><b>Email:</b> " + personsList[i].email + "</li>" +
            "<li><b>Telefone</b>: " + personsList[i].phone + "</li>" +
            "</ul>";

        personDetails.innerHTML = html;

        console.log(personsList[i].imageURI);

        $("#person-details").trigger("create");
        $("#photo").removeClass("ui-li-has-thumb");

    }


    //Função para apagar a pessoa selecionada
    //----------------------------------------------------------------------------------
    function deletePerson(i) {

        //Confirma a acção antes de apagar
        navigator.notification.confirm(
            "Tem a certeza que deseja apagar esta pessoa?", // Mensagem
            function (buttonIndex) {                        // Função de callback  
                onConfirmDelete(buttonIndex, i);
            },
            "Confirmação",                                  // Título 
            ["Sim", "Não"]                                  // Botões   
        );
    }

    function onConfirmDelete(buttonIndex, i) {

        if (buttonIndex === 1) {
            personsList.splice(i, 1);
            listOrDeletePersons("delete");
            saveInfo();
        }
        else
            return;
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

} )();