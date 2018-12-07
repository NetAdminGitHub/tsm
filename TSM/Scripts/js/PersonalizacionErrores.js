$(document).ready(function () {
    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdError; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdError; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }
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
                id: "IdError",
                fields: {
                    IdError: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    Mensaje: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Mensaje']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 500");
                                    return false;
                                }
                                if (input.is("[name='Icono']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 20");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Icono: {
                        type: "string",
                        validation: {required: true }
                    }


                }
            }
        }

    });


    //CONFIGURACION DEL GRID,CAMPOS

    $("#grid").kendoGrid({
        edit: function (e) {
            // SI ESTOY ACTUALIZANDO BLOQUEA CAMPO LLAVE ( ID)
            if (!e.model.isNew()) {
                var numeric = e.container.find("input[name=IdError]").data("kendoNumericTextBox");
                numeric.enable(false);
                Grid_Focus(e, "Mensaje");
            }
            Grid_Focus(e, "IdError");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdError", title: "Código Error", editor: Grid_ColIntNumSinDecimal },
            { field: "Mensaje", title: "Definición Mensaje" },
            { field: "Icono", title: "Icono" }
        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_Toolbar(e = $("#grid").data("kendoGrid"), true, false, false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), true, true);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SelectRow($("#grid"))
    })


});
