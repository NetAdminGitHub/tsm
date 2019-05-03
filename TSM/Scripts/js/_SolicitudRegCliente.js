var Permisos;
$(document).ready(function () {
    var UrlcmbCli = "";
    //#region Programación 
    vIdUsuario = getUser();
    fn_idEjecutivoCuenta();

    $("#TxtFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#TxtFecha").data("kendoDatePicker").value(Fhoy());
    KdoDatePikerEnable($("#TxtFecha"), false);

    KdoButton($("#btnGuardar"), "save", "Crear Solicitud");
    KdoButton($("#btnCancelar"), "cancel", "Cancelar solicitud");
    KdoButton($("#bntIrSolicitud"), "hyperlink-open-sm", "Regresar a lista de solicitudes");
    TextBoxEnable($("#TxtNoNod"), false);
    Kendo_CmbFiltrarGrid($("#CmbSer"), UrlSer, "Nombre", "IdServicio", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbTipoOT"), UrlTot, "Nombre", "IdTipoOrdenTrabajo", "Seleccione...", 0, "CmbSer");

    UrlcmbCli = vEjecutivo !== "" ? UrlECC + "/GetEjecutivoCuentasClienteActivos/" + vIdUsuario : UrlCC + "/GetContactosClienteActivos/" + vIdUsuario;
    Kendo_CmbFiltrarGrid($("#CmbCli"), UrlcmbCli, "Nombre", "IdCliente", "Seleccione...");

    if (vEjecutivo !== "") {
        Kendo_CmbFiltrarGrid($("#CmbContacto"), UrlCC, "Nombre", "IdContactoCliente", "Seleccione...", 0, "CmbCli");
        Kendo_CmbFiltrarGrid($("#CmbEjec"), UrlECC + "/GetEjecutivoCuentasClienteActivosVista", "Nombre", "IdEjecutivoCuenta", "Seleccione...", 0, "CmbCli");
        $("#CmbEjec").data("kendoComboBox").bind("dataBound", function () {
            $("#CmbEjec").data("kendoComboBox").value(vIdUsuario);
            KdoComboBoxEnable($("#CmbEjec"), false);
        });
        $("#CmbContacto").data("kendoComboBox").bind("dataBound", function () {
            if ($("#CmbContacto").data("kendoComboBox").dataSource.total() === 1) {
                $("#CmbContacto").data("kendoComboBox").select(0);
                KdoComboBoxEnable($("#CmbContacto"), false);
            }
        });
    } else {
        Kendo_CmbFiltrarGrid($("#CmbContacto"), UrlCC, "Nombre", "IdContactoCliente", "Seleccione...", 0, "CmbCli");
        Kendo_CmbFiltrarGrid($("#CmbEjec"), UrlECC + "/GetEjecutivoCuentasClienteActivosVista", "Nombre", "IdEjecutivoCuenta", "Seleccione...", 0, "CmbCli");

        $("#CmbContacto").data("kendoComboBox").bind("dataBound", function () {
            $("#CmbContacto").data("kendoComboBox").value(vIdUsuario);
            KdoComboBoxEnable($("#CmbContacto"), false);
        });
        $("#CmbEjec").data("kendoComboBox").bind("dataBound", function () {
            if ($("#CmbEjec").data("kendoComboBox").dataSource.total() === 1) {
                $("#CmbEjec").data("kendoComboBox").select(0);
                KdoComboBoxEnable($("#CmbEjec"), false);
            }
        });
    }

    KdoCmbFocus($("#CmbSer"));
    if (vIdSolicitud !== 0) { fn_GetSolicitud(); }
    //#endregion 

    //#region CRUD SOLICITUD

    $("#btnGuardar").data("kendoButton").bind("click", function () {
        event.preventDefault();
        if ($("#RSolicitud").data("kendoValidator").validate()) {
            fn_GuardarSolictud();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });
    $("#btnCancelar").data("kendoButton").bind("click", function (e) {
        ConfirmacionMsg("Está seguro de que desea cancelar esta solicitud", function () { return fn_EliminarSolictud(); });

    });
    $("#bntIrSolicitud").data("kendoButton").bind("click", function () {
        window.location.href = "/Solicitudes";
    });
    // kendo validador
    $("#RSolicitud").kendoValidator(
        {
            rules: {
                MsgSer: function (input) {
                    if (input.is("[name='CmbSer']")) {
                        return $("#CmbSer").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgOT: function (input) {
                    if (input.is("[name='CmbTipoOT']")) {
                        return $("#CmbTipoOT").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCli: function (input) {
                    if (input.is("[name='CmbCli']")) {
                        return $("#CmbCli").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbEjec: function (input) {
                    if (input.is("[name='CmbCli']")) {
                        return $("#CmbCli").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbContacto: function (input) {
                    if (input.is("[name='CmbCli']")) {
                        return $("#CmbCli").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }

            },
            messages: {
                MsgSer: "Requerido",
                MsgOT: "Requerido",
                MsgCli: "Requerido",
                CmbEjec: "Requerido",
                CmbContacto: "CmbContacto"
            }
        });

    //#endregion 

});

var fn_idEjecutivoCuenta = function () {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlEC + "/GetEjecutivoCuentaByIdEjecutivoCuentaVista/" + vIdUsuario,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                vEjecutivo = respuesta.IdEjecutivoCuenta;
            }
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
        }
    });
};

var fn_GuardarSolictud = function () {
    kendo.ui.progress($("#body"), true);
    var xType = "";
    var xEstado = "REGISTRADO";
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');
    var xUrl = "";
    if (vIdSolicitud === 0) {
        xType = "Post";
        xUrl = UrlSol;
    } else {
        xType = "Put";
        xUrl = UrlSol + "/" + vIdSolicitud;
    }

    $.ajax({
        url: xUrl,//
        type: xType,
        //dataType: "json",
        data: JSON.stringify({
            IdSolicitud: vIdSolicitud,
            NoDocumento: $("#TxtNoNod").val(),
            IdCliente: KdoCmbGetValue($("#CmbCli")),
            NombreCliente: KdoCmbGetText($("#CmbCli")),
            FechaSolicitud: xFecha,
            Estado: xEstado,
            IdTipoOrdenTrabajo: KdoCmbGetValue($("#CmbTipoOT")),
            IdServicio: KdoCmbGetValue($("#CmbSer")),
            IdContactoCliente: KdoCmbGetValue($("#CmbContacto")),
            IdModulo: 2,
            IdEjecutivoCuenta: KdoCmbGetValue($("#CmbEjec")),
            IdUsuario: getUser()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            vIdSolicitud = data[0].IdSolicitud;
            $("#TxtNoNod").val(data[0].NoDocumento);
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(data);
        }
    });

};

var fn_EliminarSolictud = function () {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlSol + "/" + vIdSolicitud,//
        type: "Delete",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            vIdSolicitud = 0;
            fn_Limpiar();
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(data, "Delete");

        },
        error: function (data) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GetSolicitud = function () {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlSol + "/" + vIdSolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                vIdSolicitud = respuesta.IdSolicitud;
                $("#TxtNoNod").val(respuesta.NoDocumento);
                KdoCmbSetValue($("#CmbSer"), respuesta.IdServicio);
                KdoCmbSetValue($("#CmbCli"), respuesta.IdCliente);
                KdoCmbSetValue($("#CmbTipoOT"), respuesta.IdTipoOrdenTrabajo);
                KdoCmbSetValue($("#CmbEjec"), respuesta.IdEjecutivoCuenta);
                KdoCmbSetValue($("#CmbContacto"), respuesta.IdContactoCliente);
                KdoCmbFocus($("#CmbSer"));
                $("#TxtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaSolicitud), 'dd/MM/yyyy'));
            } else {
                vIdSolicitud = 0;
            }
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
        }
    });
};

var fn_Limpiar = function () {
    KdoCmbSetValue($("#CmbCli"), "");
    KdoCmbSetValue($("#CmbSer"), "");
    KdoCmbSetValue($("#CmbEjec"), "");
    KdoCmbSetValue($("#CmbContacto"), "");
    KdoCmbSetValue($("#CmbTipoOT"), "");
    KdoCmbFocus($("#CmbSer"));
    $("#TxtNoNod").val("");
    $("#TxtFecha").data("kendoDatePicker").value(Fhoy());
};
fPermisos = function (datos) {
    Permisos = datos;
};