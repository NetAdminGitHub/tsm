var fun_List = [];
var fun_ListDatos = [];
var Permisos;
var item;
var idTipoOrdenTrabajo;

fPermisos = function (datos) {
    Permisos = datos;
};

$(document).ready(function () {
    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetEtapasByOrdenTrabajo/" + idOrdenTrabajo,
        method: 'GET',
        success: function (resultado) {
            CrearEtapasProcesosModulo($("#smartwizard"), resultado, opcionesFormaSmartWizard.Flechas);
        }
    });
});

window.onpopstate = function (e) {
    $("#smartwizard").smartWizard("goToPage", e.state);
};

KdoButton($("#btnCambiarAsignado"), "gear");
KdoButton($("#btnAsignarUsuario"), "save");
KdoButton($("#btnCambiarEtapa"), "gear");

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

                Kendo_CmbFiltrarGrid($("#cmbUsuario"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + datos.IdTipoOrdenTrabajo + "/" + datos.IdEtapaProceso, "Nombre", "IdUsuario", "Seleccione...");

                if (RecargarScriptVista == true) {
                    $.each(fun_List, function (index, elemento) {
                        elemento.call(document, jQuery);
                    });

                    fun_List = [];
                }

                $.each(fun_ListDatos, function (index, elemento) {
                    elemento.call(document, jQuery);
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


var CargarAsignacionUsuarios = function () {
    if ($("#gridUsuarioAsignados").data("kendoGrid") == undefined) {
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
    $("#cmbUsuario").data("kendoComboBox").value(""),
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
            },            
        },
        messages: {
            MsgcmbEstados: "Requerido"
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