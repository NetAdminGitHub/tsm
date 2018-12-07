var Permisos;

$(document).ready(function() {
    var VarIdCliente = 0;
    Kendo_CmbFiltrarGrid($("#CmbCliente"), VistaClienteUrl, "Nombre", "IdCliente", "Seleccione un Cliente ....");

    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function(datos) { return crudServiceBaseUrl + "/GetByCliente/" + VarIdCliente; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function(datos) { return crudServiceBaseUrl + "/" + datos.IdPrograma; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"            
            },
            destroy: {
                url: function(datos) { return crudServiceBaseUrl + "/" + datos.IdPrograma; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
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
                id: "IdPrograma",
                fields: {
                    IdPrograma: {
                        type: "Number",
                        validation: {
                            required: true
                        }
                    },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function(input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }

                                if (input.is("[name='Temporada']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
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
                    IdTemporada: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    IdCliente: {
                        type: "Number", defaultValue: function(e) { return $("#CmbCliente").val(); }
                    },
                    NoDocumento: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre1: {
                        type: "string"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            e.container.find("label[for=IdCliente]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCliente]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdPrograma]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdPrograma]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            if (e.model.isNew()) {
                e.container.find("label[for=NoDocumento]").parent("div .k-edit-label").hide();
                e.container.find("label[for=NoDocumento]").parent().next("div .k-edit-field").hide();
            }
            $('[name="Fecha"]').kendoDatePicker({ format: "dd/MM/yyyy" });
         
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento", title: "No. Programa", editor: Grid_ColLocked },
            { field: "IdPrograma", title: "Codigó. Programa", editor: Grid_ColLocked,hidden:true },
            { field: "Nombre", title: "Nombre del programa" },
            { field: "Fecha", title: "Fecha", format: "{0:dd/MM/yyyy}" },
            {field: "IdTemporada", title: "Temporada", values: ["IdTemporada", "Nombre", VistaTempradaUlr, "", "Seleccione una Temporada....","required","","requerido"], editor: Grid_Combox, hidden: true },
            { field: "IdCliente", title: "Codigó. Cliente", hidden: true },
            { field: "Nombre1", title: "Nombre de Temporada" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    Kendo_CmbFocus($("#CmbCliente"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);
   
    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
      
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarIdCliente = dataItem.IdCliente;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);            
        }
        else
        {
            IdClie = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
});

fPermisos = function (datos) {
    Permisos = datos;
}