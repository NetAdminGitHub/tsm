var Permisos;
let xidUnidad = 0;
let xIdGrupo = 0;
let UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
$(document).ready(function () {
    //#region "Grid unidades "

    $("#TabUni").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: crudServiceBaseUrl,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdUnidad; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdUnidad; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
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
                id: "IdUnidad",
                fields: {
                    IdUnidad: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Abreviatura']") && input.val().length > 40) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 40");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Abreviatura: {
                        type: "string",
                        validation: { required: true }
                    }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdUnidad]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdUnidad]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdUnidad", title: "Unidad Medida", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Abreviatura", title: "Abreviatura" }
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

     //#endregion "Grid unidades "
 
    //#region "Grid factores "
    var dSfac = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "FactoresConversionUnidades/GetbyIdUnidad/" + xidUnidad;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) {
                    return TSM_Web_APi + "FactoresConversionUnidades/" + datos.IdUnidad + "/"+ datos.IdUnidadSalida;
                },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "FactoresConversionUnidades/" + datos.IdUnidad + "/" + datos.IdUnidadSalida; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "FactoresConversionUnidades",
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
                id: "IdUnidadSalida",
                fields: {
                    IdUnidad: {
                        type: "number",
                        defaultValue: function () { return Fn_getIdUnidad($("#grid").data("kendoGrid")); }
                    },
                    Abreviatura: {
                        type: "string"
                    },
                    IdUnidadSalida: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='IdUnidadSalida']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadSalida").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Abreviatura1: {
                        type: "string"
                    },
                    Factor: {
                        type: "number",
                        validation: {
                            required: true,
                            defaultValue: 0.0000
                        }
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

    $("#gridFacConver").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdUnidad");
            KdoHideCampoPopup(e.container, "Abreviatura");
            KdoHideCampoPopup(e.container, "Abreviatura1");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdUnidadSalida");
                Grid_Focus(e, "Factor");
            } else {
                Grid_Focus(e, "IdUnidadSalida");
            }
         
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdUnidad", title: "Unidad Medida",hidden: true },
            { field: "Abreviatura", title: "Unidad Medida", hidden: true },
            { field: "IdUnidadSalida", title: "Unidad Medida Salida/Conversion", hidden: true,  editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...."] },
            { field: "Abreviatura1", title: "Unidad Salida" },
            { field: "Factor", title: "Factor", editor: Grid_ColNumeric, values: ["required", "0.0001", "9999999999999999.9999999999999999", "n16", 16], format: '{0:n16}' },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }
           
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridFacConver").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridFacConver").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridFacConver").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridFacConver").data("kendoGrid"), dSfac);

    //#endregion "Grid factores "

    //#region "Grid grupo "
    var dSGrupo = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "GruposUnidadesMedidas";
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) {
                    return TSM_Web_APi + "GruposUnidadesMedidas/" + datos.IdGrupoUnidadMedida;
                },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "GruposUnidadesMedidas/" + datos.IdGrupoUnidadMedida; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "GruposUnidadesMedidas",
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
                id: "IdGrupoUnidadMedida",
                fields: {
                    IdGrupoUnidadMedida: {
                        type: "number"
                    },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200  ) {
                                    input.attr("data-maxlength-msg", "Requerido,Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
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

    $("#gGrupo").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdGrupoUnidadMedida");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdGrupoUnidadMedida", title: "Grupo"},
            { field: "Nombre", title: "Nombre Grupo" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gGrupo").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gGrupo").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gGrupo").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gGrupo").data("kendoGrid"), dSGrupo);

    //#endregion "Grid Grupo "

    //#region Relación Grupos-Unidades"
    var dsRelUni = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "RelacionGruposUnidadesMedidas/GetByidGrupoUnidadMedida/" + xIdGrupo;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) {
                    return TSM_Web_APi + "RelacionGruposUnidadesMedidas/" + datos.IdGrupoUnidadMedida + "/" + datos.IdUnidad;
                },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RelacionGruposUnidadesMedidas/" + datos.IdGrupoUnidadMedida + "/" + datos.IdUnidad; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "RelacionGruposUnidadesMedidas",
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
                id: "IdUnidad",
                fields: {
                    IdGrupoUnidadMedida: {
                        type: "number",
                        defaultValue: function () { return Fn_getIdGrupoUnidadMedida($("#gGrupo").data("kendoGrid")); }
                    },
                    NombreGrupo: {
                        type: "string"
                    },
                    IdUnidad: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NombreUnidad: {
                        type: "string"
                    },
                    Abreviatura: {
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

    $("#gGrupoUni").kendoGrid({

        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "NombreGrupo");
            KdoHideCampoPopup(e.container, "NombreUnidad");
            KdoHideCampoPopup(e.container, "Abreviatura");
            KdoHideCampoPopup(e.container, "IdGrupoUnidadMedida");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
      
            Grid_Focus(e, "IdUnidad");
 

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdGrupoUnidadMedida", title: "Grupo", hidden: true },
            { field: "NombreGrupo", title: "Nombre Grupo", hidden: true },
            { field: "IdUnidad", title: "Unidad Medida", hidden: true, editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...."] },
            { field: "NombreUnidad", title: "Unidad" },
            { field: "Abreviatura", title: "Abreviatura"},
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gGrupoUni").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gGrupoUni").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gGrupoUni").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gGrupoUni").data("kendoGrid"), dsRelUni);


    //#endregion

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function () { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function () {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_ConsultarFactores();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");

    var seRows = [];
    $("#gridFacConver").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridFacConver"), seRows);
    });

    $("#gridFacConver").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridFacConver"), seRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridFacConver"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridFacConver"), $(window).height() - "371");

    var seRows2 = [];
    $("#gGrupo").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gGrupo"), seRows2);
    });

    $("#gGrupo").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gGrupo"), seRows2);
        fn_ConsultarRelacion();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gGrupo"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gGrupo"), $(window).height() - "371");

    var selrow3 = [];
    $("#gGrupoUni").data("kendoGrid").bind("dataBound", function () { //foco en la fila
        Grid_SetSelectRow($("#gGrupoUni"), selrow3);
    });

    $("#gGrupoUni").data("kendoGrid").bind("change", function () {
        Grid_SelectRow($("#gGrupoUni"), selrow3);
       
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gGrupoUni"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gGrupoUni"), $(window).height() - "371");

});

let Fn_getIdUnidad = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdUnidad;

};

let Fn_getIdGrupoUnidadMedida = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdGrupoUnidadMedida;
};

let fn_ConsultarFactores= function () {
    xidUnidad = Fn_getIdUnidad($("#grid").data("kendoGrid"));
    $("#gridFacConver").data("kendoGrid").dataSource.read();
    $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridFacConver"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridFacConver"), false, false, false);
};

let fn_ConsultarRelacion = function () {
    xIdGrupo = Fn_getIdGrupoUnidadMedida($("#gGrupo").data("kendoGrid"));
    $("#gGrupoUni").data("kendoGrid").dataSource.read();
    $("#gGrupo").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gGrupoUni"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gGrupoUni"), false, false, false);
};


fPermisos = function (datos) {
    Permisos = datos;
}