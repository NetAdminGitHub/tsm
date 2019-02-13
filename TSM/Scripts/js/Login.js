$(document).ready(function () {
    $("#btnLogin").on("click", function () {
        kendo.ui.progress($("#body"), true);
        $.ajax({
            url: 'Login/Login',
            data: { user: $("#form-username").val(), password: $("#form-password").val() }
        }).done(function (data) {
            Cookies.set("t", data);
            window.sessionStorage.setItem("user", $("#form-username").val());
            Cookies.set("user", $("#form-username").val());
            window.sessionStorage.setItem("l", 1);
            kendo.ui.progress($("#body"), false);
            if (data !== null && data !== "")
                window.location.href = "/";
            else
                $("<span />").kendoNotification().data("kendoNotification").show("Usuario y/o contraseña incorrectos.", "error");
        });
    });


    $("#form-username").on("keypress", function (e) {
        /* ENTER PRESSED*/
        if (e.keyCode === 13) {
            $("#form-password").focus();
            $("#form-password").select();

            return false;
        }
    });

    $("#form-password").on("keypress", function (e) {
        /* ENTER PRESSED*/
        if (e.keyCode === 13) {
            $("#btnLogin").click();

            return false;
        }
    });
});