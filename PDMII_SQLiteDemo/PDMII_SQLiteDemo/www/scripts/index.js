// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var database = null;
    var result;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        document.getElementById("btnOpen").addEventListener("touchend", openDatabase, false);
        document.getElementById("btnInsert").addEventListener("touchend", insertOnDatabase, false);
        document.getElementById("btnRead").addEventListener("touchend", readOnDatabase, false);
        document.getElementById("btnDrop").addEventListener("touchend", dropTable, false);
        document.getElementById("btnClose").addEventListener("touchend", closeDatabase, false);

        result = document.getElementById("result");

    };

    function openDatabase() {

        database = window.sqlitePlugin.openDatabase({ name: 'mydb.db', location: 'default' },

            function () {
                alert("Base de Dados aberta com sucesso");
            },

            function (error) {
                alert("Erro ao abrir Base de Dados: " + error.message);
            }

        );

    }

    function insertOnDatabase() {

        if (database === null) {
            alert("Base de Dados ainda está fechada");
            return;
        }

        database.sqlBatch([
            'CREATE TABLE IF NOT EXISTS DemoTable (name,score)',
            ['INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]],
            ['INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]],
            ['INSERT INTO DemoTable VALUES (?,?)', ['John', 506]]

        ], function () {
            alert("Base de Inseridos com Sucesso");
        }, function (error) {
            alert("SQL Bacth ERROR: " + error.message);
        });

    }

    function readOnDatabase() {

        var html;

        if (database === null) {
            alert("Base de Dados ainda está fechada");
            return;
        }


        database.executeSql('SELECT * FROM DemoTable', [], function (resultSet) {

            if (result.rows.length === 0) {
                result.innerHTML = "Sem dados...";
                return;
            }

            html = "<p>RESULTADOS</p>";
            for (var i = 0; i < resultSet.rows.length; i++) {
                html += "<p>Name: " + resultSet.rows.item(i).name + "- Score: " + resultSet.rows.item(i).score + "</p>";
            }
            result.innerHTML = html;

        })

    }

    function dropTable() {

        if (database === null) {
            alert("Base de Dados ainda está fechada");
            return;
        }

        database.sqlBatch([
            'DROP TABLE IF EXISTS DemoTable',
            'CREATE TABLE IF NOT EXISTS DemoTable (name,score)',

        ], function () {
            result.innerHTML = "";
            alert("Tabela apagada com sucesso");
        }, function (error) {
            alert("SQL Bacth ERROR: " + error.message);
        });

    }

    function closeDatabase() {
        database.close(
            function () {
                result.innerHTML = "";
                alert("Base de Dados Fechada com Sucesso");
                database = null;
            },

            function (error) {
                alert("Erro no fecho da Base de Dados: " + error.message);
            }
        );
    }

})();