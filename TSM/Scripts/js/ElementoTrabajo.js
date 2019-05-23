
var fun_List = [];
var fun_ListDatos = [];
var Permisos;
var item;
var idTipoOrdenTrabajo;
var EtpAsignado = false;
var EtpSeguidor = false;

fPermisos = function (datos) {
    Permisos = datos;
};
var fn_CambioEtp = function (e) {

    if (ValidarCamEtp.validate()) {
        kendo.ui.progress($("#body"), true);
        $.ajax({
            url: TSM_Web_APi + "OrdenesTrabajos/CambiarEtapa" ,
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                idOrdenTrabajo:$("#txtIdOrdenTrabajo").val(),
                idEtapaNuevo: KdoCmbGetValue($("#cmbEtpSigAnt")),
                idUsuarioAsignado: KdoCmbGetValue($("#cmbUsuarioEtp")),
                motivo: $("#TxtMotivoEtp").val()
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                RequestEndMsg(datos, "Post");
                $("#vCamEtapa").data("kendoDialog").close();
                $("#smartwizard").smartWizard("goToPage", $("[etapa=" + $("#cmbEtpSigAnt").data("kendoComboBox").value() + "]").attr("indice"));
                kendo.ui.progress($("#body"), false);
            },
            error: function (data) {
                ErrorMsg(data);
            }
        });
    }

};

$(document).ready(function () {
    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetEtapasByOrdenTrabajo/" + idOrdenTrabajo,
        method: 'GET',
        success: function (resultado) {
            CrearEtapasProcesosModulo($("#smartwizard"), resultado, opcionesFormaSmartWizard.Flechas);
        }
    });
    Kendo_CmbFiltrarGrid($("#cmbUsuario"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/0/0", "Nombre", "IdUsuario", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbEtpSigAnt"), TSM_Web_APi + "EtapasProcesos/GetEtapasAnterioresSiguientesByIdEtapaProceso/0", "Nombre", "IdEtapaProcesoAS", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbUsuarioEtp"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/0/0", "Nombre", "IdUsuario", "Seleccione...");

    //Kendo_CmbFiltrarGrid($("#cmbUsuario"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + datos.IdTipoOrdenTrabajo + "/" + datos.IdEtapaProceso, "Nombre", "IdUsuario", "Seleccione...");
    //Kendo_CmbFiltrarGrid($("#cmbEtpSigAnt"), TSM_Web_APi + "EtapasProcesos/GetEtapasAnterioresSiguientesByIdEtapaProceso/" + datos.IdEtapaProceso, "Nombre", "IdEtapaProcesoAS", "Seleccione...");
    //Kendo_CmbFiltrarGrid($("#cmbUsuarioEtp"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + datos.IdTipoOrdenTrabajo + "/" + "0", "Nombre", "IdUsuario", "Seleccione...");

    $("#cmbEtpSigAnt").data("kendoComboBox").bind("change", function (e) {
        $("#cmbUsuarioEtp").data("kendoComboBox").value("");
        $("#cmbUsuarioEtp").data("kendoComboBox").setDataSource(get_cmbUsuarioEtp(idTipoOrdenTrabajo.toString(), this.value() === "" ? 0 : this.value()));

    });

});

window.onpopstate = function (e) {
    $("#smartwizard").smartWizard("goToPage", e.state);
};

KdoButton($("#btnCambiarAsignado"), "gear");
KdoButton($("#btnAsignarUsuario"), "save");
KdoButton($("#btnCambiarEtapa"), "gear");
KdoButton($("#btnIrGOT"), "hyperlink-open-sm");

/**
 * Funcion para cargar informacion de cabecera de la etapa.
 * @param {boolean} RecargarScriptVista Indica si se volveran a cargar los script de inicio de la vista parcial.
 */
var CargarInfoEtapa = function (RecargarScriptVista = true) {
    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/" + idOrdenTrabajo + "/" + idEtapaProceso,
        method: 'GET',
        success: function (datos) {
            if (datos !== null) {
                fn_CompletarInfEtapa(datos, RecargarScriptVista);

            } else {
                $.ajax({
                    url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetEtapaNoActivaDetalle/" + idOrdenTrabajo + "/" + idEtapaProceso,
                    method: 'GET',
                    success: function (datos) {
                        fn_CompletarInfEtapa(datos, RecargarScriptVista);
                    }
                });
            }
        }
    });
};
var fn_CompletarInfEtapa = function (datos, RecargarScriptVista) {
    EtpAsignado = datos.Asignado;
    EtpSeguidor = datos.Seguidor;
    if (datos.Asignado === false && datos.Seguidor === false) {
        window.location.href = "/GestionOT";
        return;
    }
    var fecha = new Date(datos.FechaOrdenTrabajo);
    $("#IdServicio").val(datos.IdServicio); //Aun no es kendo
    $("#txtIdSolicitud").val(datos.IdSolicitud);
    $("#txtIdOrdenTrabajo").val(datos.IdOrdenTrabajo);
    $("#txtIdSolicitudDisenoPrenda").val(datos.IdSolicitudDisenoPrenda);
    $("#txtIdEtapaProceso").val(datos.IdEtapaProceso);
    $("#IdCliente").val(datos.IdCliente);
    $("#txtEstado").val(datos.Estado);
    $("#txtId").val(datos.Id);
    $("#txtNomServicio").val(datos.NomServicio);
    $("#txtNombre").val(datos.Nombre);
    $("#txtEstiloDiseno").val(datos.EstiloDiseno);
    $("#txtNombreDiseno").val(datos.NombreDiseno);
    $("#lblNomIdEtapaProceso").text(datos.NomIdEtapaProceso);
    $("#txtEstado").val(datos.Estado);
    $("#txtNoDocumentoOT").val(datos.NoDocumento);
    $("#txtFechaOrdenTrabajo").val(fecha.getDate().toString().padStart(2, '0') + '/' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' + fecha.getFullYear());
    $("#txtNomEstado").val(datos.NomEstado);
    $("#txtNombrePrenda").val(datos.NombrePrenda);
    $("#txtItem").val(datos.Item);
    idTipoOrdenTrabajo = datos.IdTipoOrdenTrabajo;

    KdoButtonEnable($("#btnCambiarAsignado"), $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true);
    KdoButtonEnable($("#btnCambiarEtapa"), $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true);

    $("#cmbUsuario").data("kendoComboBox").setDataSource(get_cmbUsuario(datos.IdTipoOrdenTrabajo, datos.IdEtapaProceso));
    $("#cmbEtpSigAnt").data("kendoComboBox").setDataSource(get_cmbEtpSigAnt(datos.IdEtapaProceso));

    if (RecargarScriptVista === true) {
        $.each(fun_List, function (index, elemento) {
            elemento.call(document, jQuery);
        });

        fun_List = [];
    }

    $.each(fun_ListDatos, function (index, elemento) {
        elemento.call(document, jQuery);
    });
};

var get_cmbUsuario = function (tipoOrd, etp) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + tipoOrd.toString() + "/" + etp.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var get_cmbEtpSigAnt = function ( etp) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "EtapasProcesos/GetEtapasAnterioresSiguientesByIdEtapaProceso/" + etp.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var get_cmbUsuarioEtp = function (tipo, etpAS) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + tipo.toString() + "/" + etpAS.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

$("#vAsignarUsuario").kendoDialog({
    height: $(window).height() - "510" + "px",
    width: "30%",
    title: "Asignación de Usuarios",
    visible: false,
    closable: true,
    modal: true,
    actions: [
        { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
    ],
    close: function (e) {
        if (e.userTriggered)
            CargarInfoEtapa(false);
    }
});


$("#vCamEtapa").kendoDialog({
    height: $(window).height() - "450" + "px",
    width: "20%",
    title: "Cambio de Etapa",
    visible: false,
    closable: true,
    modal: true,
    actions: [
        { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: fn_CambioEtp },
        { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
    ],
    close: function (e) {
        if (e.userTriggered)
            CargarInfoEtapa(false);
    }
});


$("#btnCambiarEtapa").click(function (e) {
    $("#cmbUsuarioEtp").data("kendoComboBox").value("");
    $("#cmbUsuarioEtp").data("kendoComboBox").dataSource.read();
    $("#cmbEtpSigAnt").data("kendoComboBox").value("");
    $("#cmbEtpSigAnt").data("kendoComboBox").dataSource.read();
    $("#TxtMotivoEtp").val("");
    $("#vCamEtapa").data("kendoDialog").open();
});


var CargarAsignacionUsuarios = function () {
    if ($("#gridUsuarioAsignados").data("kendoGrid") === undefined) {
        $("#gridUsuarioAsignados").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: function (datos) { return TSM_Web_APi + "OrdenesTrabajosDetallesUsuarios/" + idOrdenTrabajo + "/" + idEtapaProceso + "/" + $("#txtItem").val(); },
                        contentType: "application/json; charset=utf-8"
                    },
                    destroy: {
                        url: function (datos) { return TSM_Web_APi + "OrdenesTrabajosDetallesUsuarios/" + idOrdenTrabajo + "/" + idEtapaProceso + "/" + $("#txtItem").val() + "/" + datos.IdUsuario; },
                        type: "DELETE"
                    },
                    parameterMap: function (data, type) {
                        if (type !== "read") {
                            return kendo.stringify(data);
                        }
                    }
                },
                requestEnd: Grid_requestEnd,
                error: Grid_error,
                schema: {
                    model: {
                        id: "IdUsuario",
                        fields: {
                            IdOrdenTrabajo: { type: "number" },
                            IdEtapaProceso: {
                                type: "number", defaultValue: function () {
                                    return $("#txtIdEtapaProceso").val();
                                }
                            },
                            IdUsuario: { type: "string" },
                            Nombre: { type: "string" },
                            Asignado: { type: "bool" },
                            Seguidor: { type: "bool" }
                        }
                    }
                }
            },
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdOrdenTrabajo", title: "Orden de Trabajo", hidden: true },
                { field: "IdEtapaProceso", title: "IdEtapaProceso", hidden: true },
                { field: "IdUsuario", title: "Usuario", hidden: true },
                { field: "Nombre", title: "Nombre" },
                { field: "Asignado", title: "Asignado", template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Asignado"); } },
                { field: "Seguidor", title: "Seguidor", template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Seguidor"); } }
            ]
        });

        SetGrid($("#gridUsuarioAsignados").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
        SetGrid_CRUD_ToolbarTop($("#gridUsuarioAsignados").data("kendoGrid"), false);
        SetGrid_CRUD_Command($("#gridUsuarioAsignados").data("kendoGrid"), false, Permisos.SNBorrar);
        Grid_HabilitaToolbar($("#gridUsuarioAsignados"), false, false, Permisos.SNBorrar);
    }
    else {
        $("#gridUsuarioAsignados").data("kendoGrid").dataSource.read();
        $("#cmbUsuario").data("kendoComboBox").dataSource.read();
    }
};

$("#btnCambiarAsignado").click(function (e) {
    e.preventDefault();
    CargarAsignacionUsuarios();
    $("#cmbUsuario").data("kendoComboBox").value("");
    $("#vAsignarUsuario").data("kendoDialog").open();
});

var ValidarUsuario = $("#FrmAsignarUsuario").kendoValidator(
    {
        rules: {

            MsgcmbEstados: function (input) {
                if (input.is("[name='cmbUsuario']")) {
                    return $("#cmbUsuario").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }         
        },
        messages: {
            MsgcmbEstados: "Requerido"
        }
    }).data("kendoValidator");

var ValidarCamEtp = $("#FrmCambioEtapa").kendoValidator(
    {
        rules: {

            Msg1: function (input) {
                if (input.is("[name='cmbEtpSigAnt']")) {
                    return $("#cmbEtpSigAnt").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            Msg2: function (input) {
                if (input.is("[name='cmbUsuarioEtp']")) {
                    return $("#cmbUsuarioEtp").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            Msg1: "Requerido",
            Msg2: "Requerido"
        }
    }).data("kendoValidator");


$("#btnAsignarUsuario").click(function (e) {
    e.preventDefault();
    if (ValidarUsuario.validate()) {
        kendo.ui.progress($("#body"));
        $.ajax({
            url: TSM_Web_APi + "/OrdenesTrabajosDetallesUsuarios/",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                IdOrdenTrabajo: $("#txtIdOrdenTrabajo").val(),
                IdEtapaProceso: $("#txtIdEtapaProceso").val(),
                Item: $("#txtItem").val(),
                IdUsuario: $("#cmbUsuario").data("kendoComboBox").value(),
                Asignado: $("#rAsignado")[0].checked,
                Seguidor: $("#rSeguidor")[0].checked,
                FechaHasta: null
            }),
            success: function (datos) {
                RequestEndMsg(datos, "Post");
                $("#gridUsuarioAsignados").data("kendoGrid").dataSource.read();
                kendo.ui.progress($("#body"), false);
                $("#vAsignarUsuario").data("kendoDialog").close();
            },
            error: function (data) {
                ErrorMsg(data);
            }
        });
    }
});

$("#btnIrGOT").click(function () {
    window.location.href = "/GestionOT";
});


