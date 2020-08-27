var Permisos;
let xIdSolicitud = 0;
let UrlEtp = TSM_Web_APi + "EtapasProcesos/GetByModulo/2";
$(document).ready(function () {
    //#region "Grid solicitud "
    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi +"SolicitudesCambios/GetSolicitudesCambiosConsulta",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SolicitudesCambios/" + datos.IdSolicitudCambio; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) {return TSM_Web_APi + "SolicitudesCambios/" + datos.IdSolicitudCambio; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SolicitudesCambios",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdSolicitudCambio",
                fields: {
                    IdSolicitudCambio: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Estado: { type: "string" },
                    NombreEstado: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridSolicitud").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdSolicitudCambio");
            KdoHideCampoPopup(e.container, "NombreEstado");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitudCambio", title: "Código solicitud", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Estado", title: "Estado", hidden: true, editor: Grid_Combox, values: ["Estado", "Nombre", TSM_Web_APi +"/Estados", "SolicitudesCambios", "Seleccione....", "required", "", "requerido"]},
            { field: "NombreEstado", title: "Nombre Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridSolicitud").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridSolicitud").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridSolicitud").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridSolicitud").data("kendoGrid"), dataSource);

    //#endregion "Grid solicitud "

    //#region "Grid solcitud y etapas "
    var dSSolEtapa = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "SolicitudesCambiosEtapasProcesos/GetConsulta/" + xIdSolicitud;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SolicitudesCambiosEtapasProcesos/" + datos.IdSolicitudCambio + "/" + datos.IdEtapaProceso; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SolicitudesCambiosEtapasProcesos",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdEtapaProceso",
                fields: {
                    IdSolicitudCambio: {
                        type: "number",
                        defaultValue: function () { return Fn_getIdSolicitudCambio($("#gridSolicitud").data("kendoGrid")); }
                    },
                    IdEtapaProceso: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='IdEtapaProceso']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdEtapaProceso").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NombreEtapa: {
                        type: "string"
                    },
                    
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS

    $("#gridSolicitudEtapas").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdSolicitudCambio");
            KdoHideCampoPopup(e.container, "NombreEtapa");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "IdEtapaProceso");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitudCambio", title: "Código de solicitud", hidden: true },
            { field: "IdEtapaProceso", title: "Etapa proceso", hidden: true, editor: Grid_Combox, values: ["IdEtapaProceso", "Nombre", UrlEtp, "", "Seleccione...."] },
            { field: "NombreEtapa", title: "Nombre etapa" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridSolicitudEtapas").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridSolicitudEtapas").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridSolicitudEtapas").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridSolicitudEtapas").data("kendoGrid"), dSSolEtapa);
    //#endregion "Grid factores "


    var selectedRows = [];
    $("#gridSolicitud").data("kendoGrid").bind("dataBound", function () { //foco en la fila
        Grid_SetSelectRow($("#gridSolicitud"), selectedRows);
    });

    $("#gridSolicitud").data("kendoGrid").bind("change", function () {
        Grid_SelectRow($("#gridSolicitud"), selectedRows);
        fn_ConsultarEtapas();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridSolicitud"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridSolicitud"), $(window).height() - "371");

    var seRows = [];
    $("#gridSolicitudEtapas").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSolicitudEtapas"), seRows);
    });

    $("#gridSolicitudEtapas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSolicitudEtapas"), seRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridSolicitudEtapas"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridSolicitudEtapas"), $(window).height() - "371");
});

let Fn_getIdSolicitudCambio = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSolicitudCambio;

};
let fn_ConsultarEtapas = function () {
    xIdSolicitud = Fn_getIdSolicitudCambio($("#gridSolicitud").data("kendoGrid"));
    $("#gridSolicitudEtapas").data("kendoGrid").dataSource.read();
    $("#gridSolicitud").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridSolicitudEtapas"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridSolicitudEtapas"), false, false, false);
};
fPermisos = function (datos) {
    Permisos = datos;
};