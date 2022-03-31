var Permisos;
let UrlPl = TSM_Web_APi + "CatalogoMaquinas";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdCatalogoMaquina; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdCatalogoMaquina; },
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
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdCatalogoMaquina",
                fields: {
                    IdCatalogoMaquina: { type: "number" },
                    IdMaquina: {
                        type: "number", defaultValue: function () { return "0"; }
                    },
                    IdEstructuraMaquina: { type: "string"},
                    NoMaquina: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='NoMaquina']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='NoMaquina']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Estado']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='IdPlanta']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='CantidadEstaciones']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='CantidadEstaciones']") && input.val() >= 100) {;
                                    input.attr("data-maxlength-msg", "La cantidad de estaciones no puede ser mayor a 100");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Estado: { type: "string" },
                    CantidadEstaciones: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "NoMaquina", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCatalogoMaquina");
            KdoHideCampoPopup(e.container, "IdMaquina");            
            KdoHideCampoPopup(e.container, "NombreEstado");
            KdoHideCampoPopup(e.container, "NombrePlanta")
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "NoMaquina");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCatalogoMaquina", title: "Código", hidden: true },
            { field: "NoMaquina", title: "Máquina", sortable: { initialDirection: "asc" } },
            { field: "Estado", title: "Estado", hidden: true, editor: Grid_Combox, values: ["Estado", "Nombre", TSM_Web_APi + "/Estados", "CatalogoMaquinas", "Seleccione....", "required", "", "requerido"] },
            { field: "NombreEstado", title: "Estado" },
            { field: "IdPlanta", title: "Planta", hidden: true, editor: Grid_Combox, values: ["IdPlanta", "Nombre", TSM_Web_APi + "/Plantas", "", "Seleccione....", "required", "", "requerido"] },
            { field: "NombrePlanta", title: "Planta", sortable: { initialDirection: "asc" } },
            { field: "CantidadEstaciones", title: "Cantidad Estaciones", editor: Grid_ColNumeric, values: ["required", "0", "999", "#", 0]},
            { field: "IdEstructuraMaquina", title: "Estructura Máquina", editor: Grid_Combox, values: ["IdEstructuraMaquina", "IdEstructuraMaquina", TSM_Web_APi + "/EstructuraMaquinas", "", "Seleccione....", "required", "", "requerido"] },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
});

fPermisos = function (datos) {
    Permisos = datos;
};