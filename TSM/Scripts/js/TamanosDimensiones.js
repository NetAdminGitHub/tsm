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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTamano; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }

            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTamano; },
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
                id: "IdTamano",
                fields: {
                    IdTamano: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
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

    $("#grid").kendoGrid({
        
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdTamano]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdTamano]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTamano", title: "Código Tamaño", editor: Grid_ColInt64NumSinDecimal },
            { field: "Nombre", title: "Nombre" }
        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_Toolbar(e = $("#grid").data("kendoGrid"), true, false, false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), true, true);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SelectRow($("#grid"))
    })


});