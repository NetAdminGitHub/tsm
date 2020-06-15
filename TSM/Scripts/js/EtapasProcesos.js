var Permisos;

$(document).ready(function () {
    var VarIdModulo = 0;
    var vIdEtapaPro = 0;
    Kendo_CmbFiltrarGrid($("#cmbModulo"), UrlModulos, "Nombre", "IdModulo", "Seleccione un módulo...");
    KdoButton($("#btnCerrar"), "cancel", "Cancel");
    //#region Programacion Grid estapas procesos
    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/GetByModulo/" + VarIdModulo; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdEtapaProceso; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdEtapaProceso; },
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
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
                    IdEtapaProceso: { type: "number" },
                    IdModulo: {
                        type: "number",
                        defaultValue: function (e) {
                            return $("#cmbModulo").val();
                        }
                    },
                    Nombre1: { type: "string" },
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
                    Icono: { type: "string" },
                    Orden: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Estado: { type: "string" },
                    Nombre2: { type: "string" },
                    VistaFormulario: { type: "string" },
                    TablaEtapa: { type: "string" }


                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "IdModulo");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IconoView");
            $('[name="Icono"').attr('mayus', 'no');
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEtapaProceso", title: "Código de Etapa", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdModulo", title: "Código de Modelo", hidden: true },
            { field: "Nombre1", title: "Modulo", hidden: true },
            //{ field: "Nombre", title: "Nombre" },
            {
                field: "Nombre", title: "Nombre", template: function (data) { return "<span class='k-icon k-i-plus-sm' title='conf. relacion etapas estados' style='float: right;' onclick='fn_OpenModalEpEst(" + data["IdEtapaProceso"] + ")'></span>&nbsp;" + data["Nombre"] + ""; }
   
            },
            { field: "Icono", title: "Icono" },
            { field: "Orden", title: "Orden", editor: Grid_ColIntNumSinDecimal },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true },
            { field: "VistaFormulario", title: "Vista/Formulario" },
            { field: "TablaEtapa", title: "Tabla Etapa" },
            { field: "Nombre2", title: "Estado" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "EtapasProcesos", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            {
                template: "<div class='customer-photo' style='text-align:-webkit-center;'" +
                    "><span class='#: (data.Icono ===null? '': data.Icono).startsWith('k-i') === true ? 'k-icon ' + data.Icono : data.Icono  #' style='font-size:xx-large;'></span></div>",
                field: "IconoView",
                title: "&nbsp;"
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Kendo_CmbFocus($("#cmbModulo"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_consultarGridSig();
        fn_consultarGridAnt();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"),$(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
//#endregion 

    //#region Programacion Etapas Procesos Siguientes
    var dSgridSig = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UlrEps + "/GetEtapasProcesosSiguientesByIdEtapaProceso/" + vIdEtapaPro; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UlrEps + "/" + datos.IdEtapaProceso + "/" + datos.IdEtapaProcesoSiguiente; },
                type: "DELETE"
            },
            create: {
                url: UlrEps,
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
                id: "IdEtapaProcesoSiguiente",
                fields: {
                    IdEtapaProcesoSiguiente: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdEtapaProcesoSiguiente']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdEtapaProcesoSiguiente").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdEtapaProceso: {
                        type: "number",
                        defaultValue: function (e) {
                            return fn_GetIdEtapaProceso($("#grid").data("kendoGrid"));
                        }
                    },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridsig").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "IdEtapaProcesoSiguiente");
            // asignar dataset al combobox
            $("[name='IdEtapaProcesoSiguiente']").data("kendoComboBox").setDataSource(fn_getDsEtapasxModulo());

        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEtapaProceso", title: "Código de Etapa", editor: Grid_ColLocked, hidden: true },
            { field: "IdEtapaProcesoSiguiente", title: "Etapa Siguiente", values: ["IdEtapaProceso", "Nombre", crudServiceBaseUrl + "/GetByModulo/" + VarIdModulo, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Etapa siguiente" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridsig").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridsig").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridsig").data("kendoGrid"),false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridsig").data("kendoGrid"), dSgridSig);
    Grid_HabilitaToolbar($("#gridsig"), false, false, false);

    var selRowsSig = [];
    $("#gridsig").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridsig"), selRowsSig);
    });

    $("#gridsig").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridsig"), selRowsSig);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridsig"), ($(window).height() - "420")/2);
    });

    Fn_Grid_Resize($("#gridsig"), ($(window).height() - "420")/2);

    //#endregion

    //#region Programacion Etapas Procesos Anteriores
    var dSgridAnte = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UlrEpa + "/GetEtapasProcesosAnterioresByIdEtapaProceso/" + vIdEtapaPro; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UlrEpa + "/" + datos.IdEtapaProceso + "/" + datos.IdEtapaProcesoAnterior; },
                type: "DELETE"
            },
            create: {
                url: UlrEpa,
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
                id: "IdEtapaProcesoAnterior",
                fields: {
                    IdEtapaProcesoAnterior: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdEtapaProcesoAnterior']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdEtapaProcesoAnterior").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdEtapaProceso: {
                        type: "number",
                        defaultValue: function (e) {
                            return fn_GetIdEtapaProceso($("#grid").data("kendoGrid"));
                        }
                    },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridAnt").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "IdEtapaProcesoSiguiente");
            // asignar dataset al combobox
            $("[name='IdEtapaProcesoAnterior']").data("kendoComboBox").setDataSource(fn_getDsEtapasxModulo());

        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEtapaProceso", title: "Código de Etapa", editor: Grid_ColLocked, hidden: true },
            { field: "IdEtapaProcesoAnterior", title: "Etapa anterior", values: ["IdEtapaProceso", "Nombre", crudServiceBaseUrl + "/GetByModulo/" + VarIdModulo, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Etapa Anterior:" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridAnt").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridAnt").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridAnt").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridAnt").data("kendoGrid"), dSgridAnte);
    Grid_HabilitaToolbar($("#gridAnt"), false, false, false);

    var selRowsAnt = [];
    $("#gridAnt").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridAnt"), selRowsAnt);
    });

    $("#gridAnt").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridAnt"), selRowsAnt);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridAnt"), ($(window).height() - "420") / 2);
    });

    Fn_Grid_Resize($("#gridAnt"), ($(window).height() - "420") / 2);
    //#endregion 

    //#region Programacion Grid Relacion procesos estados
    var dSgriRepest = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlRepest + "/GetRelacionEtapasProcesosEstadosByidEtapaProcesoVista/" + vIdEtapaPro; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlRepest + "/" + datos.IdEtapaProceso + "/" + datos.Tabla + "/" + datos.Estado; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlRepest,
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
                id: "Tabla",
                fields: {
                    Tabla: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Tabla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Tabla").data("kendoComboBox").selectedIndex >= 0;
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
                    Nombre: { type: "string" },
                    IdEtapaProceso: {
                        type: "number",
                        defaultValue: function (e) {
                            return fn_GetIdEtapaProceso($("#grid").data("kendoGrid"));
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#griRepest").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Tabla");
            // asignar dataset al combobox
            $('[name="Tabla"]').on('change', function (e) {
                $("[name='Estado']").data("kendoComboBox").setDataSource(fn_getDsET());
            });
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEtapaProceso", title: "Código de Etapa", editor: Grid_ColLocked, hidden: true },
            { field: "Tabla", title: "Tabla", values: ["Tabla", "Tabla", UrlTbl , "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox },
            { field: "Nombre", title: "Estado" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "RelacionEtapasProcesosEstados", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#griRepest").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#griRepest").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#griRepest").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#griRepest").data("kendoGrid"), dSgriRepest);
    Grid_HabilitaToolbar($("#griRepest"), false, false, false);

    var selRow = [];
    $("#griRepest").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#griRepest"), selRow);
    });

    $("#griRepest").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#griRepest"), selRow);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#griRepest"), ($(window).height() - "420") / 2);
    });
    //#endregion

    //#region Programacion Combobox
    $("#cmbModulo").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            VarIdModulo = this.dataItem(e.item.index()).IdModulo;
            Fn_consultar();
        }
        else {
            VarIdModulo = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
            Grid_HabilitaToolbar($("#gridsig"), false, false, false);
            Grid_HabilitaToolbar($("#gridAnt"), false, false, false);
        }
    });
    $("#cmbModulo").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            VarIdModulo = 0;
            $("#grid").data("kendoGrid").dataSource.data([]);
            $("#gridsig").data("kendoGrid").dataSource.data([]);
            $("#gridAnt").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
            Grid_HabilitaToolbar($("#gridsig"), false, false, false);
            Grid_HabilitaToolbar($("#gridAnt"), false, false, false);
        }
    });
    //#endregion

    //#region metodos generales
    var Fn_consultar = function () {
        $("#grid").data("kendoGrid").dataSource.read().then(function () {
            fn_consultarGridSig();
            fn_consultarGridAnt();
        });
        Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
    };
    var fn_consultarGridSig = function () {
        vIdEtapaPro = fn_GetIdEtapaProceso($("#grid").data("kendoGrid"));
        $("#gridsig").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridsig"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridsig"), false, false, false);
    };
    var fn_consultarGridAnt = function () {
        vIdEtapaPro = fn_GetIdEtapaProceso($("#grid").data("kendoGrid"));
        $("#gridAnt").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridAnt"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridAnt"), false, false, false);
    };
    var fn_getDsEtapasxModulo = function () {
        return new kendo.data.DataSource({
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        dataType: 'json',
                        async: false,
                        url: crudServiceBaseUrl + "/GetByModulo/" + VarIdModulo,
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            datos.success(result);
                        }
                    });
                }
            }
        });
    };
    var fn_getDsET = function () {
        return new kendo.data.DataSource({
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        dataType: 'json',
                        async: false,
                        url: UrlE + "/" + Kendo_CmbGetvalue($('[name="Tabla"]')),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            datos.success(result);
                        }
                    });
                }
            }
        });
    };

    //$("#grid").on("mousedown", "tr[role='row']", function (e) {
    //    if (e.which === 1) {
    //        $("tr").removeClass("k-state-selected");
    //        $(this).toggleClass("k-state-selected");
    //    }
    //});

    //#endregion 
});
var fn_OpenModalEpEst = function (idetapaProceso) {
    $("#Mdl_Repest").modal();
    $("#strEstado").children().remove();
    fn_consultarGriRepest();
};
var fn_consultarGriRepest = function () {
    //var theCell = $('#Grid tbody td:eq(1)');//sample selector for a cell
    //$('#Grid').data('tGrid').editCell(theCell);//ask the Grid to put that cell in edit mode
    vIdEtapaPro = fn_GetIdEtapaProceso($("#grid").data("kendoGrid"));
    
    $("#strEstado").append("<span>Etapa: " + fn_GetIdEtapaNombre($("#grid").data("kendoGrid"))+"</span>");
    $("#griRepest").data("kendoGrid").dataSource.read();
    $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#griRepest"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#griRepest"), false, false, false);
};

var fn_GetIdEtapaProceso = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdEtapaProceso;

};
var fn_GetIdEtapaNombre = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Nombre;

};

fPermisos = function (datos) {
    Permisos = datos;
};