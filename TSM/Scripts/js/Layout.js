var fPermisos;

$(document).ready(function () {
    if (location.pathname === "/" || location.pathname.startsWith("/Home"))
        kendo.ui.progress($("#body"), true);

    vtoken();
    // oerde de ejecucion de documentos
    var ReadyList = [];
    ReadyList.push(ReadyMenuJs);

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
        }
    }
    document.addEventListener("click", function () {
        vtoken();
    });

    //Todos los textos ingresados por el usuario, a mayusculas (excepto passwords)
    $(document).on("input", function (e) {
        if ((e.target.tagName.toUpperCase() === "INPUT" || e.target.tagName.toUpperCase() === "TEXTAREA" ) && e.target.type.toUpperCase() != "PASSWORD" && (e.target.attributes["mayus"] == undefined || e.target.attributes["mayus"].value != "no"))
            e.target.value = e.target.value.toUpperCase();
    });
 

    $("#kendoNotificaciones").kendoNotification({ position: { top: $("#headerPage").outerHeight() }, stacking: "down" }).data("kendoNotification");
});

(function (send) {

    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    // here "this" points to the XMLHttpRequest Object.
    var newSend = function (vData) {
        this.setRequestHeader("t", sessionStorage.getItem("t"));
        this.realSend(vData);
    };
    XMLHttpRequest.prototype.send = newSend;

})(XMLHttpRequest.prototype.send);

var renovar = function () {
    item = {};
    item["Usuario"] = window.sessionStorage.getItem("user");
    item["t"] = window.sessionStorage.getItem("t");
    item["TipoSolicitud"] = "RENOVARTOKEN";

    $.ajax({
        url: '/Token/GetToken',
        data: { trama: JSON.stringify(item) }
    }).done(function (data) {
        if (data === null || data === "") window.location.href = "/Token/Redirect";
        window.sessionStorage.setItem("t", data);
        kendo.ui.progress($("#body"), false);
    });
};

var nuevo = function (u) {
    window.sessionStorage.setItem("user", u);

    item = {};
    item["Usuario"] = u;
    item["TipoSolicitud"] = "GENERARTOKEN";

    trama = JSON.stringify(item);

    $.ajax({
        url: '/Token/GetToken',
        data: { trama: trama }
    }).done(function (data) {
        window.sessionStorage.setItem("t", data);
        kendo.ui.progress($("#body"), false);
    });
};

var getUser = function () {
    return window.sessionStorage.getItem("user");
};

var vtoken = function () {
    if (window.sessionStorage.getItem("t") === null || window.sessionStorage.getItem("t") === "") {
        $.ajax({
            url: '/Token/GetUser',
            data: {},
            async:false
        }).done(function (data) {
            if (data === null || data === "")
                window.location.href = "/Token/Redirect";
            else
                nuevo(data);
        });
    }
    else {
        renovar();
    }
};
//var FiltroPapelPla = { idTecnica: 89, EsPapel: true, EsRhinestone: false }
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