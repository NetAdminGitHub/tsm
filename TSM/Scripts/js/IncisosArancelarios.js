var Permisos;
let UrlPl = TSM_Web_APi + "IncisosArancelarios";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdIncisoArancelario; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdIncisoArancelario; },
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
                id: "IdIncisoArancelario",
                fields: {
                    IdIncisoArancelario: { type: "number" },
                    IncisoArancelario: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IncisoArancelario']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='IncisoArancelario']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 20");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                    return false;
                                }                       
                           
                                return true;
                            }
                        }
                    },
                    Descripcion: { type: "string" },                    
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "IncisoArancelario", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdIncisoArancelario");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "IncisoArancelario");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdIncisoArancelario", title: "Código", hidden: true },
            { field: "IncisoArancelario", title: "Inciso Arancelario", sortable: { initialDirection: "asc" } },
            { field: "Descripcion", title: "Descripción", editor: Grid_ColTextArea, values: ["4"]},            
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