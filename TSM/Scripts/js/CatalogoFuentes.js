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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCatalogoFuente; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"


            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCatalogoFuente; },
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

        // VALIDAR ERROR
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCatalogoFuente",
                fields: {
                    IdCatalogoFuente: { type: "number" },
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
                    Fuente: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Fuente']") && input.val().length > 200) {
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

    $("#grid").kendoGrid({

        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdCatalogoFuente]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCatalogoFuente]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=icono]").parent("div .k-edit-label").hide();
            e.container.find("label[for=icono]").parent().next("div .k-edit-field").hide();
            $('[name="Fuente"').attr('mayus', 'no');
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCatalogoFuente", title: "Código Catalogo Fuente", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Fuente", title: "Fuente" },
            { template: "<div class='customer-photo'" +
                        "'><span class='#: data.Fuente#' ></span></div>",
                field: "icono",
                title: "icono"
            }

        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { 
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













