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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTela; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
                

            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTela; },
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
                id: "IdTela",
                fields: {
                    IdTela: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Color']") && input.val().length > 60) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 60");
                                    return false;
                                }
                                if (input.is("[name='Composicion']") && input.val().length > 100) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 100");
                                    return false;
                                }
                                if (input.is("[name='Construccion']") && input.val().length > 100) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 100");
                                    return false;
                                }
                                return true;
                            }


                        }
                    },
                    Color: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Composicion: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Construccion: {
                        type: "string", validation: {
                            required: true
                           
                        }
                    }

                }
            }
        }



    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function(e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdTela]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdTela]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTela", title: "Codigo de Tela", editor: Grid_ColInt64NumSinDecimal,hidden:true },
            { field: "Nombre", title: "Nombre Tela" },
            { field: "Color", title: "Color" },
            { field: "Composicion", title: "Composición" },
            { field: "Construccion", title: "Construcción" }
        ]

    });



    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID


    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_Toolbar(e = $("#grid").data("kendoGrid"), true, false, false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), true, true);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SelectRow($("#grid"));
    });

});