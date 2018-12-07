var Permisos;

$(document).ready(function () {
    var VarIdModulo = 0;
    Kendo_CmbFiltrarGrid($("#cmbModulo"), UrlModulos, "Nombre", "IdModulo", "Seleccione un módulo...");

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/GetByModulo/" + VarIdModulo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdEtapaProceso; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdEtapaProceso; },
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
                id: "IdEtapaProceso",
                fields: {
                    IdEtapaProceso: { type: "number" },
                    IdModulo: {
                        type: "number",
                        defaultValue: function (e) {
                            return $("#cmbModulo").val();
                        }
                    },
                    Nombre1: { type: "string" },
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
                    Icono: { type: "string" },
                    Orden: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdEtapaProceso]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdEtapaProceso]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdModulo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdModulo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdModulo", title: "Código de Etapa", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdModulo", title: "Código de Modelo", hidden: true },
            { field: "Nombre1", title: "Modulo", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Icono", title: "Icono" },
            { field: "Orden", title: "Orden", editor: Grid_ColIntNumSinDecimal },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    Kendo_CmbFocus($("#cmbModulo"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#cmbModulo").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarIdModulo = dataItem.IdModulo;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {
            VarIdModulo = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#cmbModulo").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            VarIdModulo = 0;
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
};