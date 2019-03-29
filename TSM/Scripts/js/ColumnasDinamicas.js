var Permisos;

$(document).ready(function () {
    var vIdSer = 0;
    var vIdMod = 0;
    var vIdColumn = 0;
    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlS, "Nombre", "IdServicio", "Seleccione un servicio ...");
    Kendo_CmbFiltrarGrid($("#CmbModulo"), UrlM, "Nombre", "IdModulo", "Seleccione un Modulo ...");
    // #region Programacion Grid columna
    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCd + "/GetColumnasDinamicaVistaByIdServicioIdModulo/" + vIdSer + "/" + vIdMod; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCd + "/" + datos.IdColumna; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlCd + "/" + datos.IdColumna; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlCd,
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
                id: "IdColumna",
                fields: {
                    IdModulo: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbModulo").val(); }
                    },
                    IdServicio: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbServicio").val(); }
                    },
                    IdColumna: {
                        type: "Number"
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
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridCd").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdModulo");
            KdoHideCampoPopup(e.container, "IdServicio");
            KdoHideCampoPopup(e.container, "IdColumna");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdServicio", title: "Cod. Servicio", editor: Grid_ColLocked, hidden: true },
            { field: "IdModulo", title: "Cod. Modulo", editor: Grid_ColLocked, hidden: true },
            { field: "IdColumna", title: "Cod. Columna", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre", title: "Nombre columna " },
            { field: "Descripcion", title: "Descripcion" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridCd").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridCd").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCd").data("kendoGrid"), Permisos.SNAgregar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCd").data("kendoGrid"), dataSource);

    Kendo_CmbFocus($("#CmbModulo"));
    Grid_HabilitaToolbar($("#gridCd"), false, false, false);

    $("#CmbModulo").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdMod = this.dataItem(e.item.index()).IdModulo;
            fn_Consultar();
        }
        else {
            vIdMod = 0;
            Grid_HabilitaToolbar($("#gridCd"), false, false, false);
            Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);
        }
    });

    $("#CmbModulo").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#gridCd").data("kendoGrid").dataSource.data([]);
            $("#gridCdvalor").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridCd"), false, false, false);
            Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdSer = this.dataItem(e.item.index()).IdServicio;
            fn_Consultar();
        }
        else {
            vIdSer = 0;
            Grid_HabilitaToolbar($("#gridCd"), false, false, false);
            Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#gridCd").data("kendoGrid").dataSource.data([]);
            $("#gridCdvalor").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridCd"), false, false, false);
            Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);
        }
    });
    // #endregion 

    //#region Programacion Grid Columna Valor
    dSGridValor = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCdv + "/GetColumnasDinamicasValoresVistaByIdColumna/" + vIdColumn; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCdv + "/" + datos.IdColumna + "/" + datos.Valor; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlCdv + "/" + datos.IdColumna + "/" + datos.Valor; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlCdv,
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
                id: "Valor",
                fields: {
                    IdColumna: {
                        type: "Number",
                        defaultValue: function (e) { return fn_GetIdColumna($("#gridCd").data("kendoGrid")); }
                    },
                    Valor: {
                        type: "string",
                        validation: { required: true }

                    },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Valor']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 20.");
                                    return input.val().length <= 20;
                                }
                                if (input.is("[name='Nombre']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200.");
                                    return input.val().length <= 200;
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
    $("#gridCdvalor").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdColumna");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            if (e.model.isNew()) {
                Grid_Focus(e, "Nombre");
            } else {
                KdoHideCampoPopup(e.container, "Valor");
                Grid_Focus(e, "Nombre");
            }   
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdColumna", title: "Cod. Columna", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre", title: "Descripción" },
            { field: "Valor", title: "Valor" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridCdvalor").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridCdvalor").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCdvalor").data("kendoGrid"), Permisos.SNAgregar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCdvalor").data("kendoGrid"), dSGridValor);

    Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);

    //#endregion

    //#region Foco y Risize
    var selectedRows = [];
    $("#gridCd").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCd"), selectedRows);
        if ($("#gridCd").data("kendoGrid").dataSource.total() === 0) {
            vIdColumn = 0;
            $("#gridCdvalor").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);
        }
    });

    $("#gridCd").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCd"), selectedRows);
        fn_consultarGridValor();
    });

    var selectRows = [];
    $("#gridCdvalor").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCdvalor"), selectRows);
    });

    $("#gridCdvalor").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCdvalor"), selectRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridCd"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridCd"), ($(window).height() - "371"));

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridCdvalor"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridCdvalor"), ($(window).height() - "371"));
    //#endregion 
    //#region metodos 
    var fn_Consultar = function () {
        if (vIdSer > 0 && vIdMod > 0) {
            $("#gridCd").data("kendoGrid").dataSource.read().then(function () {
                fn_consultarGridValor();
            });
            Grid_HabilitaToolbar($("#gridCd"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    };
    var fn_consultarGridValor = function () {
        vIdColumn = fn_GetIdColumna($("#gridCd").data("kendoGrid"));
        $("#gridCdvalor").data("kendoGrid").dataSource.read();
        $("#gridCd").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridCdvalor"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridCdvalor"), false, false, false);
    };
    var fn_GetIdColumna = function (g) {
        var SelItem = g.dataItem(g.select());
        return SelItem === null ? 0 : SelItem.IdColumna;

    };
    //#endregion 
});

fPermisos = function (datos) {
    Permisos = datos;
};