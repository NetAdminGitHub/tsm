var Permisos;
// inicializar variables de consulta
let xpnIdSevicio = 0;
let xpnIdUsuario = getUser();
let xpnEstado = undefined;
let xTitleModal = "";
let xpnIdcliente = 0;
let xpnNombreClie = "";
let xpnIdEjecutivo = "";
let xpnIdContactoCliente = "";
let xpnIdMarca = "";
let xpNodocumento = "";
let vIdSoli = 0;
let xpnEsEjec = false;

$(document).ready(function () {

    //obtner ejecutiva de cuenta
    KdoComboBoxbyData($("#CmbCliSol"), "[]", "Nombre", "IdCliente", "Seleccione...");
    KdoComboBoxbyData($("#CmbContactoSol"), "[]", "Nombre", "IdContactoCliente", "Seleccione...");
    KdoComboBoxbyData($("#CmbMarcaSol"), "[]", "Nombre", "IdMarca", "Seleccione...");
    //KdoButton($("#btnAClieEje"), "check", "Iniciar Solicitud");
    // validaciones
    //dibujar los paneles por servicio
    fn_MostraPanelServicios();
    ////mostrar pendientes
    //fn_MostrarPendientes();

});

let fn_MostraPanelServicios = function () {
    let ds = fn_GetSolicitudConteo();

    $.ajax({
        url: TSM_Web_APi + "Servicios",
        type: 'GET',
        dataType: "json",
        success: function (data) {
            $("#PanServicios").children().remove();
            $.each(data, function (i, item) {
                let vIcon = item.Icono === "" || item.Icono === null ? "k-icon k-i-image" : item.Icono;
                let htmltextElemnt =
                    '<div class="col-lg-4">' +
                    '<div class="card card-profile card-secondary">' + //style = "height: 100%;"
                    '<div class="card-body">' +
                    //'<div class="form-group col-lg-12">' +
                    '<div class="form-row">' +
                    '<div class="form-group col-lg-12 text-center">' +
                    '<i class="' + vIcon + '" style="font-size:125px;"></i>' +
                    '</div>' +
                    '<div class="form-group col-lg-12 text-center">' +
                    '<a class="btn-link stretched-link" data-idser="' + item.IdServicio.toString() + '" onclick="fn_IniciarServ(this)" ><span class="k-icon k-i-plus-circle" style="vertical-align: baseline;"></span>&nbsp;' + item.Nombre + '</a></h2>' +
                    '</div>' +
                    '</div>' +
                    //'</div>' +
                    '</div>' +
                    '<div class="card-footer">' +
                    '<div class="form-row user-stats text-center" id="SolCntServ-' + item.IdServicio.toString() + '">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $("#PanServicios").append(htmltextElemnt);

                let dsStatus = fn_filtrarSolicitud(ds, item.IdServicio);
                if (dsStatus.length !== 0) {
                    $.each(dsStatus, function (item, elemento) {
                        if (elemento.Estado.toUpperCase() === "REGISTRADO") {
                            $("#SolCntServ-" + elemento.IdServicio.toString() + "").append(
                                '<div class="col-lg-4">' +
                                //'<div class="number">125</div> ' +
                                //'<div class="title">Pendientes</div> ' +
                                '</div> ' +
                                '<div class="col-lg-4">' +
                                //'<div class="number">25K</div> ' +
                                //'<div class="title">Procesados</div>' +
                                '</div>' +
                                '<div class="col-lg-4"> ' +
                                '<div class="number">' + elemento.CntSol + '</div>' +
                                '<div class="title"><a id ="Est-' + elemento.Estado + '-' + elemento.IdServicio + '" class="btn-link stretched-link" onclick= "fn_MostrarModaC(this)" data-toggle="modal">PENDIENTES</a></div>'
                            );


                        }
                        $("#Est-" + elemento.Estado + "-" + elemento.IdServicio + "").data('IdServicio', elemento.IdServicio);
                        $("#Est-" + elemento.Estado + "-" + elemento.IdServicio + "").data('Estado', elemento.Estado);

                    });
                } else {

                    $("#SolCntServ-" + item.IdServicio.toString() + "").append('<div class="col-lg-4">' +
                        //'<div class="number">125</div> ' +
                        //'<div class="title">Pendientes</div> ' +
                        '</div> ' +
                        '<div class="col-lg-4">' +
                        //'<div class="number">25K</div> ' +
                        //'<div class="title">Procesados</div>' +
                        '</div>' +
                        '<div class="col-lg-4"> ' +
                        '<div class="number">0</div>' +
                        '<div class="title"><a id ="Est-REGISTRADO-' + item.IdServicio + '" class="btn-link stretched-link" onclick= "fn_MostrarModaC(this)" data-toggle="modal">PENDIENTES</a></div>'
                    );

                    $("#Est-REGISTRADO-" + item.IdServicio + "").data('IdServicio', item.IdServicio);
                    $("#Est-REGISTRADO-" + item.IdServicio + "").data('Estado', "REGISTRADO");

                }


            });

        }
    });
};

let fn_GetSolicitudConteo = function () {
    let ds = "";
    $.ajax({
        url: TSM_Web_APi + "Solicitudes/GetSolicitudesConteo/" + getUser(),
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            ds = data;
        }
    });
    return ds;
};

let fn_filtrarSolicitud = function (ds, idServicio) {
    var dset = JSON.parse(JSON.stringify(ds)).filter(function (entry) {
        return entry.IdServicio === idServicio;
    });
    return dset;
};

let fn_MostrarModaC = function (e) {
    xpnIdSevicio = $(e).data('IdServicio');
    xpnEstado = $(e).data('Estado');
    window.location.href = "/SolicitudesClientes/SolicitudesPendientes/" + xpnIdSevicio.toString() + "/" + xpnEstado.toString();
};

let fn_MostraModalIni = function (m, Title) {
    m.modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    m.find('.modal-title').text(Title);
};

let fn_idEjecutivoCuenta = function () {
    // funcion  permite saber si el usuario del TSM es una ejecutiva de cuenta.
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "Solicitudes/GetSolicitudesVerifEjecutivoContacto/" + xpnIdUsuario,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {

                if (respuesta.EsEjecutivoCuenta === true) {
                    // si el usuario es ejecutiva se redirecciona a la vistas que le corresponde llenar.
                    window.location.href = "/SolicitudesClientes/IngresoSolicitudesClientes/" + xpnIdSevicio.toString() + "/0/0";

                } else if (respuesta.EsContacto === true) {
                    // si el usuario es contacto se redirecciona a la vistas que le corresponde llenar.
                    window.location.href = "/SolicitudesClientes/IngresoSolicitudesClientes/" + xpnIdSevicio.toString() + "/1/0";
                }
                // si el usario no es contacto y ni ejecutiva lo manda al home
                if (respuesta.EsEjecutivoCuenta === false && respuesta.EsContacto === false) {
                    window.location.href = "/HOME";
                }

                $('#CSolicitudes').on('show.bs.modal', function () {
                    var modal = $(this);
                    modal.find('.modal-title').text(xTitleModal);
                });

            } else {
                window.location.href = "/HOME";
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_IniciarServ = function (e) {
    //fn_IniciarServicio se ejecuta en el 
    //boton Agregar de cada servicio que se muestras en pantalla
    let obj = $(e);
    xpnIdSevicio = obj.data("idser").toString();
    fn_idEjecutivoCuenta();
};

let fn_crearServ = function () {
    kendo.ui.progress($("#body"), true);
    vIdSoli = 0;
    let xType = vIdSoli === 0 ? "Post" : "Put";
    let xFecha = Fhoy();
    xpnEstado = "REGISTRADO";
    $.ajax({
        url: TSM_Web_APi + (vIdSoli === 0 ? "Solicitudes" : "Solicitudes/" + vIdSoli),
        type: xType,
        data: JSON.stringify({
            IdSolicitud: vIdSoli,
            NoDocumento: xpNodocumento,
            IdCliente: xpnIdcliente,
            NombreCliente: xpnNombreClie,
            FechaSolicitud: xFecha,
            Estado: xpnEstado,
            IdTipoOrdenTrabajo: 1,
            IdServicio: xpnIdSevicio,
            IdContactoCliente: xpnIdContactoCliente,
            IdModulo: 2,
            IdEjecutivoCuenta: xpnIdEjecutivo,
            IdUsuario: getUser(),
            IdMarca: xpnIdMarca
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            vIdSoli = data[0].IdSolicitud;
            xpNodocumento = data[0].NoDocumento;
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(data, xType);
            window.location.href = "/Solicitudes/IngresoSolicitudes/" + vIdSoli.toString() + "/" + xpnIdSevicio.toString() + "/" + xpnIdcliente;
        },
        error: function (data) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(data);
        }
    });

};

fPermisos = function (datos) {
    Permisos = datos;
};