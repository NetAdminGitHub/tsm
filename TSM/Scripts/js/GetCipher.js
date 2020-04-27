

$(document).ready(function () {
    $("#btnGenerar").on("click", function () {
        kendo.ui.progress($("#body"), true);
        $.ajax({
            url: 'GetCipher/Master',
            data: { cadena: $("#form-cadena").val() },
            type: "post"
        }).done(function (data) {
            window.sessionStorage.setItem("cadena", $("#form-cadena").val());
            document.getElementById("respuesta").innerHTML=data
            kendo.ui.progress($("#body"), false);
            if (data == null && data == "")
                 {
                $("<span />").kendoNotification().data("kendoNotification").show("No se pudo procesar la cadena.", "error");
                 }
        });
    });


    $("#form-cadena").on("keypress", function (e) {
        /* ENTER PRESSED*/
        if (e.keyCode === 13) {
            $("#btnGenerar").click();

            return false;
        }
    });


});