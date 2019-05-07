var Permisos;

$(document).ready(function () {
    var vIdEtapa = 0;
    var vIdPlantillaLista = 0;
    Kendo_CmbFiltrarGrid($("#CmbEtapa"), UrlEP, "Nombre", "IdEtapaProceso", "Seleccione un Etapa ...");
    // #region Programacion Grid columna
    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlPlv + "/GetPlantillasListasVerificacionesByIdEtapa/" + vIdEtapa; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPlv + "/" + datos.IdPlantillaListaVerificacion; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlPlv + "/" + datos.IdPlantillaListaVerificacion; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlPlv,
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
                id: "IdPlantillaListaVerificacion",
                fields: {
                    IdEtapaProceso: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbEtapa").val(); }
                    },
                    IdPlantillaListaVerificacion: {
                        type: "string",
                        validation: { required: true }
                    },
                    Nombre: {
                        type: "string",
                        validation: { required: true }

                    },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200.");
                                    return input.val().length <= 200;
                                }
                                if (input.is("[name='Descripcion']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000.");
                                    return input.val().length <= 2000;
                                }
                                if (input.is("[name='IdPlantillaListaVerificacion']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 20.");
                                    return input.val().length <= 20;
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
                    Nombre1: { type: "string" },
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
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPlv").kendoGrid({
        edit: function (e) {
            if (!e.model.isNew())
                KdoHideCampoPopup(e.container, "IdPlantillaListaVerificacion");
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            Grid_Focus(e, "IdPlantillaListaVerificacion");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPlantillaListaVerificacion", title: "Cod. Lista" },
            { field: "IdEtapaProceso", title: "Cod. Etapa", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Descripcion", title: "Descripcion" },
            { field: "Nombre1", title: "Estado" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "PlantillasListasVerificaciones", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPlv").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridPlv").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPlv").data("kendoGrid"), Permisos.SNAgregar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPlv").data("kendoGrid"), dataSource);

    Kendo_CmbFocus($("#CmbEtapa"));
    Grid_HabilitaToolbar($("#gridPlv"), false, false, false);

    $("#CmbEtapa").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdEtapa = this.dataItem(e.item.index()).IdEtapaProceso;
            fn_Consultar();
        }
        else {
            vIdEtapa = 0;
            Grid_HabilitaToolbar($("#gridPlv"), false, false, false);
            Grid_HabilitaToolbar($("#gridPlvd"), false, false, false);
        }
    });

    $("#CmbEtapa").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#gridPlv").data("kendoGrid").dataSource.data([]);
            $("#gridPlvd").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridPlv"), false, false, false);
            Grid_HabilitaToolbar($("#gridPlvd"), false, false, false);
        }
    });

    // #endregion 

    //#region Programacion Grid Columna Valor
    dSGridPlvd = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlPlvd + "/GetPlantillasListasVerificacionesDetallesByIdPlantilla/" + vIdPlantillaLista; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPlvd + "/" + datos.IdPlantillaListaVerificacion + "/" + datos.Item; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlPlvd + "/" + datos.IdPlantillaListaVerificacion + "/" + datos.Item; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlPlvd,
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
                id: "Item",
                fields: {
                    IdPlantillaListaVerificacion: {
                        type: "string",
                        defaultValue: function (e) { return fn_GetIdPlantillaLista($("#gridPlv").data("kendoGrid")); }
                    },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Descripcion']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000.");
                                    return input.val().length <= 2000;
                                }
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }

                    },
                    Item: { type: "Number"},
                    Estado: {
                        type: "string"
                    },
                    Nombre: { type: "string" },
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
    $("#gridPlvd").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPlantillaListaVerificacion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Item");
            if (e.model.isNew()) {
                Grid_Focus(e, "Nombre");
            } else {
                KdoHideCampoPopup(e.container, "Valor");
                Grid_Focus(e, "Nombre");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPlantillaListaVerificacion", title: "Cod. Lista", editor: Grid_ColLocked, hidden: true },
            { field: "Item", title: "Item", hidden: true, editor: Grid_ColIntNumSinDecimal, hidden: true},
            { field: "Descripcion", title: "Descripción" },
            { field: "Nombre", title: "Estado" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "PlantillasListasVerificacionesDetalles", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPlvd").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridPlvd").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPlvd").data("kendoGrid"), Permisos.SNAgregar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPlvd").data("kendoGrid"), dSGridPlvd);

    Grid_HabilitaToolbar($("#gridPlvd"), false, false, false);

    //#endregion

    //#region Foco y Risize
    var selectedRows = [];
    $("#gridPlv").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPlv"), selectedRows);
        if ($("#gridPlv").data("kendoGrid").dataSource.total() === 0) {
            vIdPlantillaLista = 0;
            $("#gridPlvd").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridPlvd"), false, false, false);
        }
    });

    $("#gridPlv").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPlv"), selectedRows);
        fn_consultarDetalle();
    });

    var selectRows = [];
    $("#gridPlvd").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPlvd"), selectRows);
    });

    $("#gridPlvd").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPlvd"), selectRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPlv"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridPlv"), $(window).height() - "371");

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPlvd"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridPlvd"), $(window).height() - "371");
    //#endregion 
    //#region metodos 
    var fn_Consultar = function () {
        if (vIdEtapa > 0) {
            $("#gridPlv").data("kendoGrid").dataSource.read().then(function () {
                fn_consultarDetalle();
            });
            Grid_HabilitaToolbar($("#gridPlv"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    };
    var fn_consultarDetalle = function () {
        vIdPlantillaLista = fn_GetIdPlantillaLista($("#gridPlv").data("kendoGrid"));
        $("#gridPlvd").data("kendoGrid").dataSource.read();
        $("#gridPlv").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridPlvd"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridPlvd"), false, false, false);
    };
    var fn_GetIdPlantillaLista = function (g) {
        var SelItem = g.dataItem(g.select());
        return SelItem === null ? 0 : SelItem.IdPlantillaListaVerificacion;

    };
    //#endregion 
});

fPermisos = function (datos) {
    Permisos = datos;
};