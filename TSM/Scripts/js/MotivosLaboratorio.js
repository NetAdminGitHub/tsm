var Permisos;
let Urlse = TSM_Web_APi + "MotivosLaboratorio";
$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: Urlse,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return Urlse + "/" + datos.IdMotivo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return Urlse + "/" + datos.IdMotivo; },
                type: "DELETE"
            },
            create: {
                url: Urlse,
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
                id: "IdMotivo",
                fields: {
                    IdMotivo: { type: "number" },                    
                    Motivo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Motivo']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    IdCategoriaMotivo: { type: "string" },
                    CategoriaMotivo: { type: "string"},
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdMotivo");
            //KdoHideCampoPopup(e.container, "IdCategoriaMotivo")
            KdoHideCampoPopup(e.container, "CategoriaMotivo");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Motivo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMotivo", title: "Codigo Motivo de Laboratorio", hidden: true },            
            { field: "Motivo", title: "Motivo" },
            { field: "IdCategoriaMotivo", title: "Categoría", hidden: true, editor: Grid_Combox, values: ["IdCategoriaMotivo", "CategoriaMotivo", UrlCategoriasMotivosLaboratorio, "", "Seleccione...", "required", "", "Requerido"] },
            { field: "CategoriaMotivo", title: "Categoría"},
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
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