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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdParametro; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdParametro; },
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
                id: "IdParametro",
                fields: {
                    IdParametro: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdParametro']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 20");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Usuario']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Password']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Dominio']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='URLDestino']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 500");
                                    return false;
                                }
                                if (input.is("[name='URI_WS']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 500");
                                    return false;
                                }
                                if (input.is("[name='ArchivoExtension']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }

                        }
                    },
                    Descripcion: {
                        type: "string",
                        validation: { required: true }
                    },
                    Usuario: {
                        type: "string",
                        validation: { required: false }
                    },
                    Password: {
                        type: "string",
                        validation: { required: false }
                    },
                    Dominio: {
                        type: "string",
                        validation: { required: false }
                    },
                    URLDestino: {
                        type: "string",
                        validation: { required: true }
                    },
                    URI_WS: {
                        type: "string",
                        validation: { required: false }
                    },
                    ArchivoExtension: {
                        type: "string",
                        validation: { required: false }
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
                e.container.find("label[for=IdParametro]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdParametro]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Descripcion");

            }
            Grid_Focus(e, "IdParametro");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdParametro", title: "Cod. Parametro" },
            { field: "Descripcion", title: "Descripción" },
            { field: "Usuario", title: "Usuario" },
            { field: "Password", title: "Password" },
            { field: "Dominio", title: "Dominio" },
            { field: "URLDestino", title: "URL Destino" },
            { field: "URI_WS", title: "URI WS" },
            { field: "ArchivoExtension", title: "Extensiones Archivos" }



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
