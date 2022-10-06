var Permisos;
let UrlPl = TSM_Web_APi + "Incoterms";
let UrlDi = TSM_Web_APi + "IncotermsDetalles";

$(document).ready(function () {
    //#region Creacion de Codigos Incoterms
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdIncoterm; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdIncoterm; },
                type: "DELETE"
            },
            create: {
                url: UrlPl,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "destroy") {
                $("#gridIncotermsDetalles").data("kendoGrid").dataSource.read();
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdIncoterm",
                fields: {
                    IdIncoterm: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Codigo']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Codigo']") && input.val().length > 5) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 5");
                                    return false;
                                }                       
                                return true;
                            }
                        }
                    },
                    Codigo: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },                 
                }
            }
        },
        sort: { field: "Nombre", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridIncoterms").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdIncoterm");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");

            Grid_Focus(e, "Nombre");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdIncoterm", title: "Id. Incoterm", hidden: true },
            { field: "Nombre", title: "Nombre", sortable: { initialDirection: "asc" } },
            { field: "Codigo", title: "Código" },           
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridIncoterms").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#gridIncoterms").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridIncoterms").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridIncoterms").data("kendoGrid"), dataSource);

    //#Endregion Creacion de Codigos Incoterms

    //#region Creacion Detalle Incoterms ...
    let dsIncotermDetalle = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlDi + "/GetIncotermsDetallesByIdIncoterm/" + Fn_getIdIncoterm($("#gridIncoterms").data("kendoGrid")); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlDi + "/" + datos.IdIncotermDetalle; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlDi + "/" + datos.IdIncotermDetalle },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlDi,
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
                id: "IdIncotermDetalle",
                fields: {
                    IdIncoterm: { type: "number", defaultValue: function () { return Fn_getIdIncoterm($("#gridIncoterms").data("kendoGrid")); } },
                    IdIncotermDetalle: {
                        type: "number"
                    },
                    Nombre: {
                            type: "string",
                            validation: {
                                required: true,
                                maxlength: function (input){
                                    if (input.is("[name='Nombre']") && input.val().length === 0) {
                                        input.attr("data-maxlength-msg", "Requerido");
                                        return false;
                                    }
                                    if (input.is("[name='Nombre']") && input.val().length > 200) {
                                        input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                        return false;
                                    }
                                    return true;
                                }       
                            }
                    },
                    IdUsuarioMod: { type: "string"},
                    FechaMod: { type: "date" },
                    Formula: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridIncotermsDetalles").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdIncotermDetalle");
            KdoHideCampoPopup(e.container, "IdIncoterm");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Formula")

            Grid_Focus(e, "IdIncoterm");

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdIncoterm", title: "Id. Incoterm ", editor: Grid_ColLocked, hidden: true },
            { field: "IdIncotermDetalle", title: "Id. Incoterm Detalle ", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Formula", title: "Formula", hidden: true },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridIncotermsDetalles").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridIncotermsDetalles").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridIncotermsDetalles").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridIncotermsDetalles").data("kendoGrid"), dsIncotermDetalle);
    Grid_HabilitaToolbar($("#gridIncotermsDetalles"), false, false, false);

    var selectedRowsDet = [];

    $("#gridIncotermsDetalles").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridIncotermsDetalles"), selectedRowsDet);
    });

    $("#gridIncotermsDetalles").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridIncotermsDetalles"), selectedRowsDet);
    });
    //#endregion  fin creacion usuario Roles

    //#region navegacion Grid usuario

    var selectedRowsEncab = [];

    $("#gridIncoterms").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridIncoterms"), selectedRowsEncab);
        if ($("#gridIncoterms").data("kendoGrid").dataSource.total() == 0) {
            Grid_HabilitaToolbar($("#gridIncotermsDetalles"), false, false, false);
        } else {
            Grid_HabilitaToolbar($("#gridIncotermsDetalles"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    });

    $("#gridIncoterms").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridIncoterms"), selectedRowsEncab);
        $("#gridIncotermsDetalles").data("kendoGrid").dataSource.data([]);
        $("#gridIncotermsDetalles").data("kendoGrid").dataSource.read();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridIncoterms"), ($(window).height() - "371"));
        Fn_Grid_Resize($("#gridIncotermsDetalles"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridIncoterms"), ($(window).height() - "371"));
    Fn_Grid_Resize($("#gridIncotermsDetalles"), ($(window).height() - "371"));

    //#endregion fin Navegacion grid Usuario
});

function Fn_getIdIncoterm(g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdIncoterm;
}

fPermisos = function (datos) {
    Permisos = datos;
};