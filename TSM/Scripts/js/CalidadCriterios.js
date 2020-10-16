var Permisos;
let UrlCP = TSM_Web_APi + "CalidadPruebas";
let vIdCalCri = 0;
$(document).ready(function () {
    //Llenar combo box
    Kendo_CmbFiltrarGrid($("#CmbCalidadCriterios"), TSM_Web_APi +"CalidadCriterios", "Nombre", "IdCalidadCriterio", "Selecione un Calidad Criterio...");

    //dibujar panel para la separacion de información
    PanelBarConfig($("#bpecm"));

    //#region Calidad Criterio

    var dsCalidadCri = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "CalidadCriterios"; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CalidadCriterios/" + datos.IdCalidadCriterio; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "CalidadCriterios/" + datos.IdCalidadCriterio; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "CalidadCriterios",
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
                id: "IdCalidadCriterio",
                fields: {
                    IdCalidadCriterio: {
                        type: "number"
                    },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }
                                return true;
                            }
                        }
                        
                    },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true
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
    $("#gridCalidadCriterio").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCalidadCriterio");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCalidadCriterio", title: "Calidad Criterio", hidden: true },
            { field: "Nombre", title: "Nombre del criterio" },
            { field: "Descripcion", title: "Descripción"},
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridCalidadCriterio").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCalidadCriterio").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCalidadCriterio").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCalidadCriterio").data("kendoGrid"), dsCalidadCri, 20);

    var seleRows = [];
    $("#gridCalidadCriterio").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCalidadCriterio"), seleRows);
    });

    $("#gridCalidadCriterio").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCalidadCriterio"), seleRows);
    });


    //#endregion

    //#region Calidad Pruebas
    //CONFIGURACION DEL CRUD
    var dsCalidadPruebas = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "CalidadPruebas/"; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CalidadPruebas/" + datos.IdCalidadPrueba; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "CalidadPruebas/" + datos.IdCalidadPrueba; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "CalidadPruebas",
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
                id: "IdCalidadPrueba",
                fields: {
                    IdCalidadPrueba: {
                        type: "number"

                    },
                    Nombre : {
                        type: "string"
                        
                    },
                    Codigo: {
                        type: "string"

                    },
                    Icono: {
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
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridCalidadPruebas").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCalidadPrueba");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "IconoView");
            $('[name="Icono"').attr('mayus', 'no');
            Grid_Focus(e, "Nombre");
         

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCalidadPrueba", title: "Calidad Prueba", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Codigo", title: "Código" },
            { field: "Icono", title: "Icono" },
            {
                template: "<div class='customer-photo' style='text-align:-webkit-center;'" +
                    "><span class='#: data.Icono.startsWith('k-i') === true ? 'k-icon ' + data.Icono : data.Icono  #' style='font-size:xx-large;'></span></div>",
                field: "IconoView",
                title: "&nbsp;"
            },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridCalidadPruebas").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCalidadPruebas").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCalidadPruebas").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCalidadPruebas").data("kendoGrid"), dsCalidadPruebas, 20);

    var seleRow1 = [];
    $("#gridCalidadPruebas").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCalidadPruebas"), seleRow1);
    });

    $("#gridCalidadPruebas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCalidadPruebas"), seleRow1);
    });

    //#endregion

    //#region gr CalidadCriteriosPruebas
    //CONFIGURACION DEL CRUD
    var dsCCP = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "CalidadCriteriosPruebas/GetbyIdCalidadCriterio/" + vIdCalCri.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CalidadCriteriosPruebas/" + datos.IdCalidadPrueba + "/" + datos.IdCalidadCriterio; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "CalidadCriteriosPruebas/" + datos.IdCalidadPrueba + "/" + datos.IdCalidadCriterio; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "CalidadCriteriosPruebas",
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
                id: "IdCalidadPrueba",
                fields: {
                    IdCalidadCriterio: {
                        type: "number",
                        defaultValue: function (e) {
                            return KdoCmbGetValue($("#CmbCalidadCriterios"));
                        }
                    },
                    NombreCriterio: {
                        type: "string"
                    },
                    IdCalidadPrueba: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdCalidadPrueba']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCalidadPrueba").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: { type: "string" },
                    Icono: { type: "string" },
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
    $("#gridCalidadCriteriosPruebas").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCalidadCriterio");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Icono");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IconoView");
            Grid_Focus(e, "IdCalidadPrueba");

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCalidadCriterio", title: "Código Criterio", hidden: true },
            { field: "IdCalidadPrueba", title: "Calidad Pruebas", values: ["IdCalidadPrueba", "Nombre", UrlCP, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Nombre Criterio Prueba" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "Icono", title: "Icono" },
            {
                template: "<div class='customer-photo' style='text-align:-webkit-center;'" +
                    "><span class='#: (data.Icono ===null? '': data.Icono).startsWith('k-i') === true ? 'k-icon ' + data.Icono : data.Icono  #' style='font-size:xx-large;'></span></div>",
                field: "IconoView",
                title: "&nbsp;"
            }
        ]
    });

    SetGrid($("#gridCalidadCriteriosPruebas").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCalidadCriteriosPruebas").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCalidadCriteriosPruebas").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCalidadCriteriosPruebas").data("kendoGrid"), dsCCP, 20);

    Grid_HabilitaToolbar($("#gridCalidadCriteriosPruebas"), false, false, false);
    var seleRows2 = [];
    $("#gridCalidadCriteriosPruebas").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCalidadCriteriosPruebas"), seleRows2);
    });

    $("#gridCalidadCriteriosPruebas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCalidadCriteriosPruebas"), seleRows2);
    });

    //#endregion 

    //#region Relación Criterio composicion"
    var dsReCriterios = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "ComposicionTelasCalidadCriterios/GetByIdCalidadCriterio/" + vIdCalCri.toString();
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) {
                    return TSM_Web_APi + "ComposicionTelasCalidadCriterios/" + datos.IdCalidadCriterio + "/" + datos.IdComposicionTela;
                },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "ComposicionTelasCalidadCriterios/" + datos.IdCalidadCriterio + "/" + datos.IdComposicionTela; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "ComposicionTelasCalidadCriterios",
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
                id: "IdComposicionTela",
                fields: {
                    IdCalidadCriterio: {
                        type: "number",
                        defaultValue: function () { return KdoCmbGetValue($("#CmbCalidadCriterios")); }
                    },
                    NombreCalidadCriterio: {
                        type: "string"
                    },
                    IdComposicionTela: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='IdComposicionTela']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdComposicionTela").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NombreComposicion: {
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

    $("#gridCalidadComposicion").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdCalidadCriterio");
            KdoHideCampoPopup(e.container, "NombreCalidadCriterio");
            KdoHideCampoPopup(e.container, "NombreComposicion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");

            Grid_Focus(e, "IdComposicionTela");


        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCalidadCriterio", title: "Criterio", hidden: true },
            { field: "NombreCalidadCriterio", title: "Nombre criterio", hidden: true },
            { field: "IdComposicionTela", title: "Composición tela", hidden: true, editor: Grid_Combox, values: ["IdComposicionTela", "Nombre", TSM_Web_APi + "ComposicionTelas", "", "Seleccione...."] },
            { field: "NombreComposicion", title: "Nombre Composicion" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridCalidadComposicion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,0);
    SetGrid_CRUD_ToolbarTop($("#gridCalidadComposicion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCalidadComposicion").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCalidadComposicion").data("kendoGrid"), dsReCriterios);

    Grid_HabilitaToolbar($("#gridCalidadComposicion"), false, false, false);

    var seleRows3 = [];
    $("#gridCalidadComposicion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCalidadComposicion"), seleRows3);
    });

    $("#gridCalidadComposicion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCalidadComposicion"), seleRows3);
    });

    //#endregion
    Grid_HabilitaToolbar($("#gridCalidadCriteriosPruebas"), false, false, false);


    $("#CmbCalidadCriterios").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdCalCri = this.dataItem(e.item.index()).IdCalidadCriterio;
            fn_consultarCriteriosPruebas();
            Grid_HabilitaToolbar($("#gridCalidadCriteriosPruebas"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#gridCalidadComposicion"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);

        }
        else {
            vIdCalCri = 0;
            Grid_HabilitaToolbar($("#gridCalidadCriteriosPruebas"), false, false, false);
            Grid_HabilitaToolbar($("#gridCalidadComposicion"), false, false, false);
        }
    });
    $("#CmbCalidadCriterios").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            vIdCalCri = 0;
            $("#gridCalidadCriteriosPruebas").data("kendoGrid").dataSource.data([]);
            $("#gridCalidadComposicion").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridCalidadCriteriosPruebas"), false, false, false);
            Grid_HabilitaToolbar($("#gridCalidadComposicion"), false, false, false);
        }
    });

});



var fn_consultarCriteriosPruebas = function () {
    $("#gridCalidadCriteriosPruebas").data("kendoGrid").dataSource.read();
    $("#gridCalidadComposicion").data("kendoGrid").dataSource.read();
};

fPermisos = function (datos) {
    Permisos = datos;
};



