// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    var form;
    var booksList = [];
    var booksListJSON;

    var bookCover;
    var title;
    var author;
    var genre;
    var editDate;
    var description;
    var isbnCode;
    var rate;

    var tittleListEditDeleteBooks;
    var tittleForm;

    var storage = window.localStorage;

    var buttonAddBook;
    var buttonListBook;
    var buttonEditBook;
    var buttonDeleteBook;
    var buttonPickBookCover;

    var bookIndex;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        initVariables();

        getLastInfo();

        buttonPickBookCover.addEventListener("touchend", sourceConfirm, false);

        form.addEventListener("submit", onSubmitForm, false);

        buttonAddBook.addEventListener("touchend", insertBook, false);
        buttonListBook.addEventListener("touchend", function () { listEditDeleteBooks('list'); }, false);
        buttonEditBook.addEventListener("touchend", function () { listEditDeleteBooks('edit'); }, false);
        buttonDeleteBook.addEventListener("touchend", function () { listEditDeleteBooks('delete'); }, false);

    };

    function initVariables() {

        form = document.getElementById("form");
        bookCover = document.getElementById("bookCover")
        title = document.getElementById("title");
        author = document.getElementById("author");
        genre = document.getElementById("genre");
        editDate = document.getElementById("editDate");
        description = document.getElementById("description");
        isbnCode = document.getElementById("isbnCode");
        rate = document.getElementById("rate");

        tittleListEditDeleteBooks = document.getElementById("list_edit_delete_title");
        tittleForm = document.getElementById("form_title");

        buttonAddBook = document.getElementById("btnAddBook");
        buttonListBook = document.getElementById("btnListBook");
        buttonEditBook = document.getElementById("btnEditBook");
        buttonDeleteBook = document.getElementById("btnDeleteBook");
        buttonPickBookCover = document.getElementById("btnPickBookCover");

        bookIndex = null;

    }

    function getLastInfo() {

        if (storage.getItem("booksList") !== null) {
            booksListJSON = storage.getItem("booksList");
            booksList = JSON.parse(booksListJSON);
        }

    }

    function onSubmitForm(e) {

        e.preventDefault();

        try {
            if (bookIndex == null) {

                // Cria-se o objecto pessoa e preenchem-se os respetivos atriburos
                var book = new Object();
                book.bookCover = bookCover.value;
                book.title = title.value;
                book.author = author.value;
                book.genre = genre.value;
                book.editDate = editDate.value;
                book.description = description.value;
                book.isbnCode = isbnCode.value;
                book.rate = $('#rate').val();

                // Adiciona a pessoa recém criada ao array de pessoas
                booksList.push(book);

                // Limpa form
                form.reset();

                // Grava a informação
                saveInfo();

                navigator.notification.alert("Dados inseridos com sucesso :D");

            }

            else if (bookIndex != null) {

                booksList[bookIndex].bookCover = bookCover.value;
                booksList[bookIndex].title = title.value;
                booksList[bookIndex].author = author.value;
                booksList[bookIndex].genre = genre.value;
                booksList[bookIndex].editDate = editDate.value;
                booksList[bookIndex].description = description.value;
                booksList[bookIndex].isbnCode = isbnCode.value;
                booksList[bookIndex].rate = $('#rate').val();

                saveInfo();

                listEditDeleteBooks("edit");

                navigator.notification.alert("Dados alterados com sucesso :D");

            }

        } catch (err) {
            navigator.notification.alert("Erro: " + err, null);
        }

    }

    // Função para gravar os valores na storage
    function saveInfo() {

        // Tranforma-se o array em JSON
        booksListJSON = JSON.stringify(booksList);
        console.log(booksListJSON);

        storage.setItem("booksList", booksListJSON);

    }

    // Função para alterar o título do form
    function insertBook() {
        tittleForm.innerHTML = "Inserir Livro";
        bookIndex = null;

        $("#page_form").on("pageshow", function (event) {
            $('#rate').val(0);
            $('#rate').slider('refresh');
        })

        form.reset();
    }

    // Função para exibir, editar ou apagar livros
    function listEditDeleteBooks(command) {

        var listEditDeleteBooks = document.getElementById("books-list-edit-delete");
        var html = "";

        console.log(command);

        if (booksList.length === 0) {
            if (command === "list") { tittleListEditDeleteBooks.innerHTML = "Listar Livros"; }
            else if (command === "edit") { tittleListEditDeleteBooks.innerHTML = "Editar Livros"; }
            else { tittleListEditDeleteBooks.innerHTML = "Eliminar Livros"; };

            listEditDeleteBooks.innerHTML = "<h3>Sem dados...</h3>";
            return;

        }

        if (command === "list") {

            tittleListEditDeleteBooks.innerHTML = "Listar Livros";

            html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Procurar Livros...' data-inset='true'>";

            for (var i = 0; i < booksList.length; i++) {

                html += "<li id='" + i + "'><a href='#page_details' data-transition='slide'><img src='" + booksList[i].bookCover + "'><h2>" + booksList[i].title + "</h2><p>" + booksList[i].author + "</p></a></li>";

            }

            html += "</ul>";


            listEditDeleteBooks.innerHTML = html;


            // Função que associa o evento touchend a cada LI e que chama a função listDetails(i) com referencia para a pessoa através do array
            $('#ul-list').delegate('li', 'touchend', function () {
                listDetails($(this).attr('id'));
            });

        }

        else if (command === "edit") {

            tittleListEditDeleteBooks.innerHTML = "Editar Livros";

            html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Procurar Livros...' data-inset='true'>";

            for (var i = 0; i < booksList.length; i++) {

                html += "<li id='" + i + "'data-icon='edit'><a href='#page_form' data-transition='slide'><img src='" + booksList[i].bookCover + "'><h2>" + booksList[i].title + "</h2><p>" + booksList[i].author + "</p></a></li>";
                
            }

            html += "</ul>";


            listEditDeleteBooks.innerHTML = html;

            // Função que associa o evento touchend a cada LI e que chama a função listDetails(i) com referencia para a pessoa através do array
            $('#ul-list').delegate('li', 'touchend', function () {
                editBook($(this).attr('id'));
            });

        }

        else if (command === "delete") {

            tittleListEditDeleteBooks.innerHTML = "Apagar Livros";

            html = "<ul id='ul-list' data-role='listview' data-filter='true' data-filter-placeholder='Procurar Livros...' data-inset='true'>";

            for (var i = 0; i < booksList.length; i++) {

                html += "<li id='" + i + "'data-icon='delete'><a href='#' data-transition='slide'><img src='" + booksList[i].bookCover + "'><h2>" + booksList[i].title + "</h2><p>" + booksList[i].author + "</p></a></li>";

            }

            html += "</ul>";

            listEditDeleteBooks.innerHTML = html;

            $('#ul-list').delegate('li', 'touchend', function () {
                deleteBooks($(this).attr('id'));
            });

        }

        $('#books-list-edit-delete').trigger('create');

    }

    // Função para exibir detalhes dos livros
    function listDetails(i) {

        var bookDetails = document.getElementById("book-details");
        var html = "";

        html = "<ul id='ul-list' data-role='listview' data-inset='true'>";

        html += "<li id='photo'><img class='photo' src='" + booksList[i].bookCover + "'></li>";
        html += "<li data-role='list-divider' class='capitalize'><b>Título:</b> " + booksList[i].title + "</li>";
        html += "<li><b>Autor:</b> " + booksList[i].author + "</li>";
        html += "<li><b>Género:</b> " + booksList[i].genre + "</li>";
        html += "<li><b>Data de Edição:</b> " + booksList[i].editDate + "</li>";
        html += "<li id='description'><b>Descrição:</b> " + booksList[i].description + "</li>";
        html += "<li><b>Código ISBN:</b> " + booksList[i].isbnCode + "</li>";
        html += "<li><b>Nota:</b> " + booksList[i].rate + "/5</li>";

        html += "</ul>";

        bookDetails.innerHTML = html;
        $('#book-details').trigger('create');
        $('#photo').removeClass("ui-li-has-thumb");

    }

    function deleteBooks(i) {

        navigator.notification.confirm(
            'Confirma que quer apagar este livro?', // message
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
            booksList.splice(i, 1);
            saveInfo();
            listEditDeleteBooks('delete');

            console.log(booksList.length);
        }
    }

    function sourceConfirm() {

        navigator.notification.confirm(
            'Como deseja escolher a foto?', // message
            openFilePicker,// callback to invoke with index of button pressed
            'Escolher Foto', // title
            ['Câmara', 'Galeria'] // buttonLabels
        )

    }

    function openFilePicker(buttonindex) {

        var srcType = (buttonindex === 1) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = setOptions(srcType);


        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            bookCover.value = imageUri;

        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");

        }, options);

    }

    function setOptions(srcType) {

        var options = {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true  //Corrects Android orientation quirks
        };
        return options;
    }

    function editBook(i) {

        tittleForm.innerHTML = "Editar Livro";
        bookIndex = i;

        bookCover.value = booksList[i].bookCover;
        title.value = booksList[i].title;
        author.value = booksList[i].author;
        genre.value = booksList[i].genre;
        editDate.value = booksList[i].editDate;
        description.value = booksList[i].description;
        isbnCode.value = booksList[i].isbnCode;
        rate.value = booksList[i].rate;

        $("#page_form").on("pageshow", function (event) {
            $('#rate').val(booksList[i].rate);
            $('#rate').slider('refresh');
        })

    }

})();