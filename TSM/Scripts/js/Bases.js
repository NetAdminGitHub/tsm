var Permisos;
$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: crudServiceBaseUrl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdBase; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdBase; },
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
                id: "IdBase",
                fields: {
                    IdBase: { type: "number" },
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
                    Costo: {
                        type: "number"

                    },
                    IdUnidadCosto: {
                        type: "string",
                        defaultValue: 6,
                        validation: {
                            maxlength: function (input) {
                                // cuando es estampado
                                if (input.is("[name='IdUnidadCosto']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadCosto").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre1: {
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
    $("#grid").kendoGrid({
        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdBase]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdBase]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBase", title: "Código base", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Nombre de la base" },
            { field: "Costo", title: "Costo base", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n4", 4] },
            { field: "IdUnidadCosto", title: "Unidad del costo", hidden: true, editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUM, "", "Seleccione....", "required", "", "Requerido"] },
            { field: "Nombre1", title: "Unidad" },
            { field: "IdUsuarioMod", title: "Usuario", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", hidden: true, format: "{0:dd/MM/yyyy HH:mm:ss}" }

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
        Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
});

fPermisos = function (datos) {
    Permisos = datos;
}