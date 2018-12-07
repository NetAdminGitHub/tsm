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
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    RegistrarBItacora: { type: "bool" },
                    EnviarCorreo: { type: "bool" }

                }
            }
        }

    });


    //CONFIGURACION DEL GRID,CAMPOS

    $("#grid").kendoGrid({
        edit: function (e) {
            // SI ESTOY ACTUALIZANDO BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdParametro]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdParametro]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "RegistrarBItacora");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdParametro", title: "Cod. Parametro", editor: Grid_ColIntNumSinDecimal },
            { field: "RegistrarBItacora", title: "Registrar Bitacora?", editor: Grid_ColCheckbox },
            { field: "EnviarCorreo", title: "Enviar Correo?", editor: Grid_ColCheckbox }
        ]


    });


    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_Toolbar(e = $("#grid").data("kendoGrid"), true, false, false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), true, true);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SelectRow($("#grid"))
    })



});

