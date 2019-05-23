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
    ReadyList.push(fn_getNotificaciones);

    $.each(ReadyList, function (index, elemento) {
        elemento.call(document, jQuery);
    });

    //seguridad obtner los permisos 
    if (location.pathname !== "/" && location.pathname.startsWith("/Home") === false && location.pathname.startsWith("/Reportes") === false) {
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
            if (!(e.target.type === 'file' || e.target.type === 'email' || e.target.type === 'checkbox' ))
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

/**
 * Función para dibujado de notificaciones de usuarios
 * */
var fn_getNotificaciones = function() {
    $.ajax({
        url: UrlNotificaciones + "/GetByIdUsuario/" + getUser(),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                fn_CrearNotificaciones(respuesta);
            }
        },
        error: function (e) {
            ErrorMsg(e)
        }
    });
}


/**
 * Crea las notificaciones del sistema
 * @param {JSON} opciones
 */
var fn_CrearNotificaciones = function(opciones) {
    $("#divNotificaciones").children().remove();
    var MPContenedor = $("#divNotificaciones");

    if (opciones.length == 0) {
        $('#lblCantidadNotificaciones').css("display", "none");
        $('#lblCantidadNotificaciones').text("0");
        $("#divCantidadNotificaciones").text("Tienes 0 notificaciones nuevas");
    }
    else {
        $('#lblCantidadNotificaciones').css("display", opciones[0].Nuevos == 0 ? "none" : "block");
        $('#lblCantidadNotificaciones').text(opciones[0].Nuevos);
        $("#divCantidadNotificaciones").text("Tienes " + opciones[0].Nuevos + " notificaciones nuevas");
    }    

    $.each(opciones, function (index, elemento) {
        MPContenedor.append(
            `<div class="position-relative list-group-item ` + (elemento.Leido == false ? "unread" : "read") + `" ` + (elemento.Leido == false ? "style=\"background-color: #DFE3EE;\"" : "") + `>
                <div class="list-group-item-figure">
                    <div class="TSM-notif-icon ` + (elemento.Prioridad == "B" ? "TSM-notif-Baja" : elemento.Prioridad == "M" ? "TSM-notif-Media" : "TSM-notif-Alta") + `"> <i class="k-icon k-i-notification"></i> </div>
                </div>
                <div class="list-group-item-body pl-3 pl-md-4">
                    <div class="row">
                        <div class="col-12 position-static">
                            <h4 class="list-group-item-title">
                                <span>` + elemento.Asunto +`</span>
							</h4>
                            <p class="list-group-item-text text-truncate">` + elemento.Cuerpo +`</p>
                        </div>
                        <div class="col-12 text-lg-right position-static">
                            <p class="list-group-item-text">Hace ` + elemento.Tiempo + `</p>
                        </div>
                    </div>
                </div>
            </div>`
        );
    });
}