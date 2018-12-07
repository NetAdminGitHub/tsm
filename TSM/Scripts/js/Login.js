$(document).ready(function () {
    kendo.ui.progress($("#body"), true);

    $("#btnLogin").on("click", function () {
        kendo.ui.progress($("#body"), true);
        $.ajax({
            url: 'Login/Login',
            data: { user: $("#form-username").val(), password: $("#form-password").val() }
        }).done(function (data) {
            window.sessionStorage.setItem("t", data);
            window.sessionStorage.setItem("user", $("#form-username").val());
            kendo.ui.progress($("#body"), false);
            if (data !== null && data !== "") window.location.href = "/";
        });
    });

    $.ajax({
        url: 'Token/GetUser',
        data: {}
    }).done(function (data) {
        kendo.ui.progress($("#body"), false);
        if (data !== null && data !== "")
            window.location.href = "/";
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