var Permisos;
$(document).ready(function () {
    var vIdTipoOrdenTrabajo = 0;
    var vIdEtapaProceso = 0;
    //#region Programacion Tipos de Ordenes de Trabajo
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: Urltot +"/GetTiposOrdenesTrabajosVista",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return Urltot + "/" + datos.IdTipoOrdenTrabajo; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return Urltot + "/" + datos.IdTipoOrdenTrabajo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: Urltot,
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdTipoOrdenTrabajo",
                fields: {
                    IdTipoOrdenTrabajo: {type: "Number"},
                    Nombre: { type: "string"},
                    IdServicio: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdServicio']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdServicio").data("kendoComboBox").text()==="" ? true: $("#IdServicio").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return  $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre1: { type: "string" },
                    Icono: { type: "string" },
                    Color: { type: "string" },
                    Estado: { type: "string"},
                    Nombre2: {type: "string" },
                    IdUsuarioMod: { type: "string"},
                    FechaMod: {type: "date"}
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoOrdenTrabajo");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            $("[name='Icono'").attr('mayus', 'no');
            $("[name='Color'").attr('mayus', 'no');
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo orden trabajo",  hidden: true },
            { field: "Nombre", title: "Nombre tipo de orden" },
            { field: "IdServicio", title: "Servicio", values: ["IdServicio", "Nombre", UrlSer, "", "Seleccione....", "", "", ""], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Servicio" },
            { field: "Icono", title: "Icono" },
            { field: "Color", title: "Color" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "TiposOrdenesTrabajos", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            vIdTipoOrdenTrabajo = 0;
            $("#gridConfEp").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridConfEp"), false, false, false);
        }
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_ConsultarGridConfEP();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");

    //#endregion 

    //#region Programacion Grid Cofiguracion Etapas Ordenes de trabajo

    //CONFIGURACION DEL CRUD
    daSCofEpo = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCeo + "/GetConfiguracionEtapasOrdenByIdTipoOrdenTrabajo/" + vIdTipoOrdenTrabajo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCeo + "/" + datos.IdTipoOrdenTrabajo + "/" + datos.IdEtapaProceso; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlCeo + "/" + datos.IdTipoOrdenTrabajo + "/" + datos.IdEtapaProceso; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlCeo,
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdEtapaProceso",
                fields: {
                    IdTipoOrdenTrabajo: {
                        type: "Number",
                        defaultValue: function (e) { return fn_GetIdTipoOrden($("#grid").data("kendoGrid")); }
                    },
                    Nombre: {
                        type: "string"

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
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre1: {
                        type: "string"
                    },
                    Estado: {
                        type: "string"
                    },
                    Nombre2: {
                        type: "string"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL gridConfEp,CAMPOS
    $("#gridConfEp").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoOrdenTrabajo");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo orden trabajo", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre", title: "Nombre tipo orden", editor: Grid_ColLocked, hidden: true },
            { field: "IdEtapaProceso", title: "Etapa Proceso", values: ["IdEtapaProceso", "Nombre", UrlEp, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Etapa de proceso" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "ConfiguracionEtapasOrdenes", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gridConfEp
    SetGrid($("#gridConfEp").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridConfEp").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridConfEp").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridConfEp").data("kendoGrid"), daSCofEpo);

    Grid_HabilitaToolbar($("#gridConfEp"), false, false, false);


    var selRows = [];
    $("#gridConfEp").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridConfEp"), selRows);
        if ($("#gridConfEp").data("kendoGrid").dataSource.total() === 0) {
            vIdEtapaProceso = 0;
            $("#gridUsuarios").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridUsuarios"), false, false, false);
        }        
    });

    $("#gridConfEp").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridConfEp"), selRows);
        fn_ConsultarGridUsuarios();
    });

    $(window).on("resize", function () {        
        Fn_Grid_Resize($("#gridConfEp"), ($(window).height() - 420) / 2);
    });

    Fn_Grid_Resize($("#gridConfEp"), ($(window).height() - 420) / 2);
    //#endregion

    //#region Programacion Grid Cofiguracion Etapas Ordenes de trabajo y Usuarios
    //CONFIGURACION DEL CRUD
    daSUsuarios = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "/ConfiguracionEtapasOrdenesUsuarios/" + vIdTipoOrdenTrabajo + "/" + vIdEtapaProceso; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "/ConfiguracionEtapasOrdenesUsuarios/" + datos.IdTipoOrdenTrabajo + "/" + datos.IdEtapaProceso + "/" + datos.IdUsuario; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "/ConfiguracionEtapasOrdenesUsuarios/" + datos.IdTipoOrdenTrabajo + "/" + datos.IdEtapaProceso + "/" + datos.IdUsuario; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "/ConfiguracionEtapasOrdenesUsuarios/",
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdUsuario",
                fields: {
                    IdTipoOrdenTrabajo: {
                        type: "Number",
                        defaultValue: function (e) { return fn_GetIdTipoOrden($("#grid").data("kendoGrid")); }
                    },                    
                    IdEtapaProceso: {
                        type: "Number",
                        defaultValue: function (e) { return fn_GetIdEtapaProceso($("#gridConfEp").data("kendoGrid")); }
                    },
                    IdUsuario: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdIdUsuario']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUsuario").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL gridConfEp,CAMPOS
    $("#gridUsuarios").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoOrdenTrabajo");
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "IdUsuario");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo orden trabajo", editor: Grid_ColLocked, hidden: true },
            { field: "IdEtapaProceso", title: "Cod. etapa de proceso", editor: Grid_ColLocked, hidden: true },
            { field: "IdUsuario", title: "Usuario", values: ["IdUsuario", "Nombre", TSM_Web_APi + "Usuarios", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Usuario" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gridConfEp
    SetGrid($("#gridUsuarios").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridUsuarios").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridUsuarios").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridUsuarios").data("kendoGrid"), daSUsuarios);

    Grid_HabilitaToolbar($("#gridUsuarios"), false, false, false);
    
    var seleRows = [];
    $("#gridUsuarios").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridUsuarios"), seleRows);
    });

    $("#gridUsuarios").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridUsuarios"), seleRows);
    });

    $(window).on("resize", function() {
        Fn_Grid_Resize($("#gridUsuarios"), ($(window).height() - 420) / 2);
    });

    Fn_Grid_Resize($("#gridUsuarios"), ($(window).height() - 420) / 2);
    //#endregion

    let fn_ConsultarGridConfEP = function () {
        vIdTipoOrdenTrabajo = fn_GetIdTipoOrden($("#grid").data("kendoGrid"));
        $("#gridConfEp").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridConfEp"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridConfEp"), false, false, false);
    };
    let fn_GetIdTipoOrden = function (g) {
        let SelItem = g.dataItem(g.select());
        return SelItem === null ? 0 : SelItem.IdTipoOrdenTrabajo;
    };

    let fn_ConsultarGridUsuarios = function () {
        vIdEtapaProceso = fn_GetIdEtapaProceso($("#gridConfEp").data("kendoGrid"));
        $("#gridUsuarios").data("kendoGrid").dataSource.read();
        $("#gridConfEp").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridUsuarios"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridUsuarios"), false, false, false);
    };

    let fn_GetIdEtapaProceso = function (g) {
        let SelItem = g.dataItem(g.select());
        return SelItem === null ? 0 : SelItem.IdEtapaProceso;
    };
});

fPermisos = function (datos) {
    Permisos = datos;
};