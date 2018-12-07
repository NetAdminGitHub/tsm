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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.ID; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }

            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.ID; },
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
                id: "ID",
                fields: {
                    ID: { type: "string" },
                    Tabla: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Tabla']") && input.val().length > 256) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 256");
                                    return false;
                                }
                                if (input.is("[name='ClaveNumerica']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 20");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Prefijo']") && input.val().length > 5) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 5");
                                    return false;
                                }
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Tabla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Tabla").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }


                        }
                    },
                    ClaveNumerica: {
                        type: "string",
                        validation: {required: true }
                    },
                    Item: { type: "number", validation: { required: true, min: 1 } },
                    Descripcion: {
                        type: "string",
                        validation: { required: true}
                    },
                    Prefijo: {
                        type: "string",
                        validation: {required: false}
                    },
                    Inicial: {
                        type: "number",
                        validation: { required: true}
                    },
                    Final: { type: "number", validation: { required: true, min: 1 } },
                    Actual: { type: "number", validation: { required: true, min: 1 } },
                    UtilizaPrefijo: { type: "bool" },
                    IdUsuario: { type: "string", validation: { required: true }, defaultValue: getUser() },
                    Estado: { type: "string", validation: { required: true } },
                    RellenarNumeracion: { type: "bool" }
                }
            }
        }
    });



    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
       
        edit: function (e) {
            //PERMITE OCULTAR CAMPOS EN EL EDITOR POPUP.
            e.container.find("label[for=ID]").parent("div .k-edit-label").hide();
            e.container.find("label[for=ID]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Item]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Item]").parent().next("div .k-edit-field").hide();
            if (!e.model.isNew()) {
                e.container.find("label[for=Tabla]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Tabla]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=ClaveNumerica]").parent("div .k-edit-label").hide();
                e.container.find("label[for=ClaveNumerica]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Descripcion");
            }
            else {
                Grid_Focus(e, "Tabla");
            }
          

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "ID", title: "ID", hidden: true },
            { field: "Tabla", title: "Tabla",  editor: Grid_Combox, values: ["Tabla", "Tabla", VistaTablasUlr, "", "Seleccione...", "required", "", "Requerido"]},
            { field: "ClaveNumerica", title: "Clave Númerica" },
            { field: "Item", title: "Item", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "Descripcion", title: "Descripcion" },
            { field: "Prefijo", title: "Prefijo" },
            { field: "Inicial", title: "Inicial", editor: Grid_ColIntNumSinDecimal},
            { field: "Final", title: "Final", editor: Grid_ColIntNumSinDecimal },
            { field: "Actual", title: "Actual", editor: Grid_ColLocked },
            { field: "UtilizaPrefijo", title: "Con Prefijo?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "UtilizaPrefijo"); } },
            { field: "IdUsuario", title: "Usuario", hidden: true },
            { field: "Estado", title: "Estado", editor: Grid_Combox, values: ["Estado", "Nombre", VistaEstadosUlr, "SecuenciasNumericas", "Seleccione...", "required", "", "Requerido"]},
            { field: "RellenarNumeracion", title: "Rellenar Numeracion", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "RellenarNumeracion"); } }
        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#grid"), selectedRows);
    });

});

fPermisos = function (datos) {
    Permisos = datos;
}
