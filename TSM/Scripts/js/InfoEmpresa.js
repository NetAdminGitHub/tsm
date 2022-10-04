var Permisos;
let UrlPl = TSM_Web_APi + "InfoEmpresa";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdInfoEmpresa; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdInfoEmpresa; },
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
                id: "IdInfoEmpresa",
                fields: {
                    IdInfoEmpresa: { type: "number" },
                    NIT: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='NIT']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='NIT']") && input.val().length > 15) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 15");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Direccion']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Direccion']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 2000");
                                    return false;
                                }
                                if (input.is("[name='Telefono']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Telefono']") && input.val().length > 8) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 8");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: { type: "string" },
                    Direccion: { type: "string" },
                    Telefono: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "Nombre", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdInfoEmpresa");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "NIT");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdInfoEmpresa", title: "ID", hidden: true },
            { field: "NIT", title: "NIT" },
            { field: "Nombre", title: "Nombre" },
            { field: "Direccion", title: "Direccion" },
            { field: "Telefono", title: "Telefono" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", hidden: true }
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