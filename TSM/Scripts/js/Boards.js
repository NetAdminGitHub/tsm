var Permisos;
$(document).ready(function () {
    var VarIdCliente = 0;
    Kendo_CmbFiltrarGrid($("#CmbPrograma"), VistaProgramaUlr, "Nombre", "IdPrograma", "Seleccione un Programa ....");
    var dataSource = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function(datos) { return crudServiceBaseUrl + "/GetByPrograma/" + VarIdCliente; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdBoard; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
               

            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdBoard; },
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
                id: "IdBoard",
                fields: {
                    IdBoard: { type: "number" },
                    IdPrograma: {
                        type: "number",
                        validation: { required: true },
                        defaultValue: function(e) { return $("#CmbPrograma").val(); }
                    },
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
                    },
                    Fecha: {
                        type: "date",
                        validation: {
                            required: true,
                            min: 1
                        }
                    },
                    NoDocumento: {
                        type: "string",
                        validation: {
                            required: true,
                            min: 1
                        }
                    }

                }
            }
        }



    });

    //CONFIGURACION DEL GRID,CAMPOS

    $("#grid").kendoGrid({
        edit: function (e) {
            e.container.find("label[for=IdPrograma]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdPrograma]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdBoard]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdBoard]").parent().next("div .k-edit-field").hide();
            if (e.model.isNew()) {
                e.container.find("label[for=NoDocumento]").parent("div .k-form-field").hide();
                e.container.find("label[for=NoDocumento]").parent().next("div .k-edit-field").hide();
            }

            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBoard", title: "Código Board", editor: Grid_ColInt64NumSinDecimal },
            { field: "IdPrograma", title: "Programa", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Nombre del Board" },
            { field: "Fecha", title: "Fecha", format: "{0:dd/MM/yyyy}" },
            { field: "NoDocumento", title: "No Boards", editor:Grid_ColLocked}

        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    // combo box

    Kendo_CmbFocus($("#CmbPrograma"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);
    //$("#CmbPrograma").data("kendoComboBox").bind("dataBound", function (e) {
    //    Grid_HabilitaToolbar($("#grid"), false, false, false);
    //});

    $("#CmbPrograma").data("kendoComboBox").bind("select", function(e) {

        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarIdCliente = dataItem.IdPrograma;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar ? true : false, Permisos.SNEditar ? true : false, Permisos.SNBorrar ? true : false);
        }
        else {
            IdClie = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }

    });
    $("#CmbPrograma").data("kendoComboBox").bind("change", function(e) {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
        }
    });
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SelectRow($("#grid"));
    });

});


fPermisos = function (datos) {
    Permisos = datos;
}
