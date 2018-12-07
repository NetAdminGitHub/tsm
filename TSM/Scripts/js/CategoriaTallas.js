var Permisos;
$(document).ready(function () {
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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCategoriaTalla; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCategoriaTalla; },
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
                id: "IdCategoriaTalla",
                fields: {
                    IdCategoriaTalla: { type: "number" },
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
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#GkCateTallas").kendoGrid({
        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdCategoriaTalla]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCategoriaTalla]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCategoriaTalla", title: "Código de Categoría", editor: Grid_ColInt64NumSinDecimal ,hidden:true},
            { field: "Nombre", title: "Nombre de Categoría de Talla" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#GkCateTallas").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#GkCateTallas").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GkCateTallas").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GkCateTallas").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#GkCateTallas").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GkCateTallas"), selectedRows);
    });

    $("#GkCateTallas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GkCateTallas"), selectedRows);
    });
});

fPermisos = function (datos) {
    Permisos = datos;
}