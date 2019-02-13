var fPermisos;

$(document).ready(function () {
    if (location.pathname === "/" || location.pathname.startsWith("/Home"))
        kendo.ui.progress($("#body"), true);

    if (Cookies.get("user") != undefined)
        window.sessionStorage.setItem("user", Cookies.get("user"));

    vtoken();

    // oerde de ejecucion de documentos
    var ReadyList = [];
    ReadyList.push(ReadyMenuJs);
    ReadyList.push(ReadyMenuPerfil);

    $.each(ReadyList, function (index, elemento) {
        elemento.call(document, jQuery);      
    });

    //seguridad obtner los permisos 
    if (location.pathname !== "/" && location.pathname.startsWith("/Home") === false) {
        var ParamPath = location.pathname.toString();//location.pathname.toUpperCase().endsWith("/INDEX")? location.pathname : location.pathname.toString() +'/' + 'Index'
        var permisos = fn_getOpcionesMenuPermisos(getUser(), ParamPath);
        if (permisos.length === 0) {
            window.location.href = "/";

        } else {
            fPermisos(permisos[0]);
            MostrarMapaSitio(permisos[0].IdMenu);
        }
    }
    document.addEventListener("click", function () {
        vtoken();
    });

    $("#btnLogout").bind("click", function (e) {
        e.stopImmediatePropagation();
        Cookies.remove("t");
        Cookies.remove("user");
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("l");
        window.location.href = "/Login";
    });

    if (sessionStorage.getItem("l") != "1")
        $("#btnLogout").css("display", "none");


    //Todos los textos ingresados por el usuario, a mayusculas (excepto passwords)
    $(document).on("input", function (e) {
        if ((e.target.tagName.toUpperCase() === "INPUT" || e.target.tagName.toUpperCase() === "TEXTAREA") && e.target.type.toUpperCase() !== "PASSWORD" && (e.target.attributes["mayus"] === undefined || e.target.attributes["mayus"].value !== "no"))
            if (!(e.target.type === 'file' || e.target.type === 'email' ))
                fn_ForzarInputUppercase(e);
    });

    var fn_ForzarInputUppercase = function (e) {
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.toUpperCase();
        e.target.setSelectionRange(start, end);
    };
   

    $("#kendoNotificaciones").kendoNotification({ position: { top: $("#headerPage").outerHeight() }, stacking: "down" }).data("kendoNotification");
});

(function (send) {

    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    // here "this" points to the XMLHttpRequest Object.
    var newSend = function (vData) {
        this.setRequestHeader("t", Cookies.get("t"));
        this.realSend(vData);
    };
    XMLHttpRequest.prototype.send = newSend;

})(XMLHttpRequest.prototype.send);

var renovar = function () {
    item = {};
    item["Usuario"] = window.sessionStorage.getItem("user");
    item["t"] = Cookies.get("t");
    item["TipoSolicitud"] = "RENOVARTOKEN";

    $.ajax({
        url: '/Token/GetToken',
        data: { trama: JSON.stringify(item) }
    }).done(function (data) {
        if (data === null || data === "") window.location.href = "/Token/Redirect";
        Cookies.set("t", data);
        kendo.ui.progress($("#body"), false);
    });
};

var nuevo = function (u) {
    window.sessionStorage.setItem("user", u);
    Cookies.set("user", u);

    item = {};
    item["Usuario"] = u;
    item["TipoSolicitud"] = "GENERARTOKEN";

    trama = JSON.stringify(item);

    $.ajax({
        url: '/Token/GetToken',
        data: { trama: trama }
    }).done(function (data) {
        Cookies.set("t", data);
        kendo.ui.progress($("#body"), false);
    });
};

var getUser = function () {
    return window.sessionStorage.getItem("user");
};

var vtoken = function () {
    if (givenOrDefault(Cookies.get("t"), "") != "")
        renovar();

    if (givenOrDefault(Cookies.get("user"), "") === "") {
        $.ajax({
            url: '/Token/GetUser',
            data: {}
        }).done(function (data) {
            if (data === null || data === "")
                window.location.href = "/Token/Redirect";
            else
                nuevo(data);
        });
    }
};

var fn_getOpcionesMenuPermisos=function (xIdUsuario, xUrl) {
    var datos;
    $.ajax({
        url: UrlMRSeguridad + "/GetMenusRolesSeguridad",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({ IdUsuario: xIdUsuario, Url: xUrl }),
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (respuesta) {
            datos = respuesta;
        },
        error: function (respuesta) {
            datos ='[]';
        }
    });

    return datos;
}