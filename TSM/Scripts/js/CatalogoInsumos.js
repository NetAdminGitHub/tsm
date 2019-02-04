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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCatalogoInsumo; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCatalogoInsumo; },
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
                id: "IdCatalogoInsumo",
                fields: {
                    IdCatalogoInsumo: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Color']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Color: {
                        type: "string"
                    },
                    Alto: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    Ancho: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    IdUnidadDimension: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre1: {
                        type: "string"                        
                    },
                    Costo: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    FechaMod: {
                        type: "date",
                        defaultValue: function (e) { return Fhoy();}
                    },
                    CodArticulo: {
                        type: "string"                     
                    },
                    IdTamanoInsumo: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre2: {
                        type: "string"
                    },
                    IdGradoInsumo: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre3: {
                        type: "string",
                    },
                    IdFormaTipoInsumo: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre4: {
                        type: "string"
                    },
                    GrossPorBolsa: {
                        type: "numeric",defaultValue:0
                    },
                    PiedrasPorBolsa: {
                        type: "numeric", defaultValue: 0
                    },
                    IdTecnica: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre5: {
                        type: "string"
                    },
                    IdServicio: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre6: {
                        type: "string"
                    },
                    EsPapel: { type: "bool" },
                    EsRhinestone: { type: "bool" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdCatalogoInsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCatalogoInsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre2]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre2]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre3]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre3]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre4]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre4]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre5]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre5]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre6]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre6]").parent().next("div .k-edit-field").hide();

            $('[name="FechaMod"]').data("kendoDatePicker").enable(false);

            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCatalogoInsumo", title: "Id de Insumo", editor: Grid_ColInt64NumSinDecimal ,hidden:true},
            { field: "Nombre", title: "Nombre de Insumo" },
            { field: "Alto", title: "Largo / Alto", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "IdUnidadDimension", title: "Unidad Dimensión", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...."], hidden: true },
            { field: "Nombre1", title: "Unidad" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.0000", "999999999999.9999", "n4", 4], },
            { field: "FechaMod", title: "Fecha de Modificación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "CodArticulo", title: "Código Artículo" },
            { field: "IdTamanoInsumo", title: "Tamaño ", editor: Grid_Combox, values: ["IdTamanoInsumo", "Nombre", UrlTI, "", "Seleccione...."], hidden: true },
            { field: "Nombre2", title: "Tamaño" },
            { field: "IdGradoInsumo", title: "Id Grade ", editor: Grid_Combox, values: ["IdGradoInsumo", "Nombre", UrlGI, "", "Seleccione...."], hidden: true },
            { field: "Nombre3", title: "Grade" },
            { field: "IdFormaTipoInsumo", title: "Id Forma Tipo", editor: Grid_Combox, values: ["IdFormaTipoInsumo", "Nombre", UrlFTI, "", "Seleccione...."], hidden: true },
            { field: "Nombre4", title: "Forma Tipo" },
            { field: "GrossPorBolsa", title: "Gross x Bolsa", editor: Grid_ColIntNumSinDecimal },
            { field: "PiedrasPorBolsa", title: "Piedras x Bolsa", editor: Grid_ColIntNumSinDecimal },
            { field: "IdServicio", title: " Id Servicio", editor: Grid_Combox, values: ["IdServicio", "Nombre", UrlSrv, "", "Seleccione...."], hidden: true },
            { field: "Nombre6", title: "Servicio" },
            { field: "IdTecnica", title: "Id Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione....", "", "IdServicio"], hidden: true },
            { field: "Nombre5", title: "Técnica" },
            { field: "EsPapel", title: "Papel", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); } },
            { field: "EsRhinestone", title: "Rhinestone", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsRhinestone"); } }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $(window).on("resize", function () {
        var gridWidget = $("#grid").data("kendoGrid");
        gridWidget.wrapper.height($(window).height()-"371");
        gridWidget.resize();

    });
});

fPermisos = function (datos) {
    Permisos = datos;
}
