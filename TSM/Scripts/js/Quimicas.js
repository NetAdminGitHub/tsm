var Permisos;
let UrlQ = TSM_Web_APi + "Quimicas";
$(document).ready(function () {

    //#region  Quimica 
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlQ,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlQ + "/" + datos.IdQuimica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlQ + "/" + datos.IdQuimica; },
                type: "DELETE"
            },
            create: {
                url: UrlQ,
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
                id: "IdQuimica",
                fields: {
                    IdQuimica: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdQuimica");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdQuimica", title: "Codigo Química", hidden: true },
            { field: "Nombre", title: "Nombre Química " },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    //#endregion 

    //#region quimica formula

    //#region Creacion Quimicas Formulaciones ...
    var dsQF = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "QuimicasFormulaciones/GetQuimicasFormulacionByidQuimica/" + Fn_getIdQ($("#grid").data("kendoGrid")); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "QuimicasFormulaciones/" + datos.IdQuimicaFormula + "/" + datos.IdQuimica; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "QuimicasFormulaciones/" + datos.IdQuimicaFormula + "/" + datos.IdQuimica; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "QuimicasFormulaciones/",
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
                id: "IdQuimicaFormula",
                fields: {
                    IdQuimicaFormula: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdQuimicaFormula']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdQuimicaFormula").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdQuimica: {
                        type: "String",
                               defaultValue: function () { return Fn_getIdQ($("#grid").data("kendoGrid")); }
                    },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }

                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridQF").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "IdQuimica");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdQuimicaFormula");
            }
            else {
                Grid_Focus(e, "IdQuimicaFormula");
            }

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdQuimicaFormula", title: "Quimica en Formulación", hidden: true, editor: Grid_Combox, values: ["IdQuimica", "Nombre", TSM_Web_APi + "Quimicas", "", "Seleccione...", "required", "", "Requerido"] },
            { field: "IdQuimica", title: "Quimica", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "FechaMod", title: "Fecha Mod.", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario ", hidden: true }
        ]

    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridQF").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridQF").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridQF").data("kendoGrid"), false, Permisos.SNBorrar);;
    Set_Grid_DataSource($("#gridQF").data("kendoGrid"), dsQF);
    Grid_HabilitaToolbar($("#gridQF"), false, false, false);
    var selectedRows = [];
    $("#gridQF").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridQF"), selectedRows);

    });

    $("#gridQF").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridQF"), selectedRows);

    });
    //#endregion  fin creacion usuario Roles


    //#endregion 

    var selectedRows1 = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows1);
        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            Grid_HabilitaToolbar($("#gridQF"), false, false, false);
        } else {
            Grid_HabilitaToolbar($("#gridQF"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows1);
        $("#gridQF").data("kendoGrid").dataSource.data([]);
        $("#gridQF").data("kendoGrid").dataSource.read();
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridQF"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridQF"), $(window).height() - "371");
});
let Fn_getIdQ = (g) => {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdQuimica;
};

fPermisos = function (datos) {
    Permisos = datos;
};