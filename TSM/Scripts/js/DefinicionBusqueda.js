$(document).ready(function () {
    // combo box
    var VarIDSistema= 0;
    Kendo_CmbFiltrarGrid($("#CmdSistema"), VistaSistemaUlr, "Nombre", "IdSistema", "Seleccione el Sistema ....");
    var dataSource = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function(datos) { return crudServiceBaseUrl + "/GetBySistema/" + VarIDSistema; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function(datos) { return crudServiceBaseUrl + "/" + datos.IdDefinicion; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function(data) { console.log(data); }

            },
            destroy: {
                url: function(datos) { return crudServiceBaseUrl + "/" + datos.IdDefinicion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function(data) { console.log(data); }
            },


            parameterMap: function(data, type) {
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
                id: "IdDefinicion",
                fields: {
                    IdDefinicion: { type: "string" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function(input) {
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
                    IdSistema: {
                        type: "number", defaultValue: function(e) { return $("#CmdSistema").val(); }
                    },
                    ColumnaSeleccion: {
                        type: "string",
                        validation: {
                            required: true


                        }
                    },
                    TablaOrigen: {
                        type: "string",
                        validation: {
                            required: true


                        }
                    },
                    Usuario: {
                        type: "string",
                        validation: {
                            required: true


                        }
                    },
                    IdInterfaz: {
                        type: "number",
                        validation: {
                            required: true


                        },
                        defaultValue: null
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
                e.container.find("label[for=IdDefinicion]").parent("div .k-form-field").hide();
                e.container.find("label[for=IdDefinicion]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Nombre");
            }
            e.container.find("label[for=IdSistema]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdSistema]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "IdDefinicion");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdDefinicion", title: "Código Definición" },
            { field: "Nombre", title: "Descripción" },
            { field: "Fecha", title: "Fecha", format: "{0:dd/MM/yyyy}" },
            { field: "IdSistema", title: "Sistema", hidden: true },
            { field: "ColumnaSeleccion", title: "Columna de Selección" },
            { field: "TablaOrigen", title: "Tabla Origen" },
            { field: "Usuario", title: "Usuario" },
            { field: "IdInterfaz", title: "IdInterfaz", values: ["Nombre", VistaInterfazUrl, "", "Seleccione una Interfaz...."],editor: Grid_CmbEditor }

        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), true, true);
    SetGrid_CRUD_Toolbar($("#grid").data("kendoGrid"), true, false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    
    Kendo_CmbFocus($("#CmdSistema"));

    $("#CmdSistema").data("kendoComboBox").bind("dataBound", function (e) {
        Grid_HabilitaToolbar($("#grid"), false, false, false)
    });

    $("#CmdSistema").data("kendoComboBox").bind("select", function(e) {

        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarIDSistema = dataItem.IdSistema;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), true, true, true)


        }
        else {
            IdClie = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false)
        }

    });
    $("#CmdSistema").data("kendoComboBox").bind("change", function(e) {
        var value = this.value();
        if (value=="") {
            $("#grid").data("kendoGrid").dataSource.data([]);
        }
    });
    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SelectRow($("#grid"))
    })

    
});
