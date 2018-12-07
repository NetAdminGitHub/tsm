var IdServicio = 0;
var Permisos;

$(document).ready(function () {
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un servicio ....");

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/ByServicio/" + IdServicio; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCostoTecnica; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCostoTecnica; },
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
                id: "IdCostoTecnica",
                fields: {
                    IdCostoTecnica: { type: "number" },
                    IdServicio: { type: "number", defaultValue: function(e) { return $("#CmbIdServicio").val(); } },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadCosto']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadCosto").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdBase']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return  $("#IdBase").data("kendoComboBox").selectedIndex >= 0;
                                }
                             
                                return true;
                            }
                        }
                    },
                    Costo: { type: "number" },
                    IdUnidadCosto: { type: "string" },
                    Nombre1: { type: "string" },
                    FechaMod: { type: "date" },
                    IdTecnica: {
                        type: "string", validation: { required: true}
                    },
                    Nombre2: { type: "string" },
                    Predeterminado: { type: "bool" },
                    IdBase: { type: "string"},
                    Nombre3: { type: "string" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdCostoTecnica]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCostoTecnica]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdServicio]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdServicio]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre2]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre2]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre3]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre3]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Predeterminado]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Predeterminado]").parent().next("div .k-edit-field").hide();

            if ($("#CmbIdServicio").data("kendoComboBox").value() === "2" || $("#CmbIdServicio").data("kendoComboBox").value() === "3") {
                e.container.find("label[for=IdBase]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdBase]").parent().next("div .k-edit-field").hide();
            }
       

            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCostoTecnica", title: "Código costo tecnica", hidden: true },
            { field: "IdServicio", title: "IdServicio", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0", "99999999999999.9999", "{0:n4}", 4] },
            { field: "IdUnidadCosto", title: "Unidad costo", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre1", title: "Unidad del costo" },
            { field: "IdTecnica", title: "Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre2", title: "Nombre técnica" },
            { field: "IdBase", title: "Base", editor: Grid_Combox, values: ["IdBase", "Nombre", UrlBase, "", "Seleccione....","required", "", "Requerido"], hidden: true },
            { field: "Nombre3", title: "Nombre base" },
            { field: "Predeterminado", title: "Predeterminado?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Predeterminado"); }, hidden: true}

        ]
    });
    
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbIdServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            IdServicio = dataItem.IdServicio;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            $("#grid").data("kendoGrid").showColumn("Nombre3");
            if (IdServicio === 2 || IdServicio === 3) {
                $("#grid").data("kendoGrid").hideColumn("Nombre3");
            }

        }
        else {
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        selectedRows = [];
        if (value === "") {
            IdServicio = 0;
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