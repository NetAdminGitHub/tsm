
$(document).ready(function () {
     var VarSistema = 0;
    Kendo_CmbFiltrarGrid($("#CmdSistema"), VistaSistemaUlr, "Nombre", "IdSistema", "Seleccione el Sistema ....");
    var dataSource = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function(datos) { return crudServiceBaseUrl + "/GetBySistema/" + VarSistema; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdInterfaz; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }


            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdInterfaz; },
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
                id: "IdInterfaz",
                fields: {
                    IdInterfaz: { type: "number" },
                    URI: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='URI']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 500");
                                    return false;
                                }
                                if (input.is("[name='URI_WSDL']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 500");
                                    return false;
                                }
                                if (input.is("[name='Adaptador']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 20");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    URI_WSDL: {
                        type: "string",
                        validation: { required: true }
                    },
                    Adaptador: {
                        type: "string",
                        validation: { required: false }
                    },
                    Nombre: {
                        type: "string",
                        validation: { required: true }
                    },
                    IdSistema: {
                        type: "number",
                        validation: { required: true },
                        defaultValue: function (e) { return $("#CmdSistema").val();}
                    }

                }
            }
        }



    });

    //CONFIGURACION DEL GRID,CAMPOS

    $("#grid").kendoGrid({
        edit: function (e) {
            // SI ESTOY ACTUALIZANDO BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdInterfaz]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdInterfaz]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdSistema]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdSistema]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdInterfaz", title: "Código Interfaz", editor: Grid_ColIntNumSinDecimal},
            { field: "Nombre", title: "Nombre" },
            { field: "URI", title: "URI" },
            { field: "URI_WSDL", title: "URI_WSDL" },
            { field: "Adaptador", title: "Adaptador" },
            { field: "IdSistema", title: "IdSistema", hidden: true }
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
            VarSistema = dataItem.IdSistema;
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
        if (value == "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
        }
    });

    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SelectRow($("#grid"))
    })

});

