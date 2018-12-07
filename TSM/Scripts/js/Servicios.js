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
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdServicio; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdServicio; },
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
                id: "IdServicio",
                fields: {
                    IdServicio: { type: "number" },
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
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({      
        edit: function (e) {
            // SI ESTOY ACTUALIZANDO BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdServicio]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdServicio]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdServicio", title: "Codigo de Servicio", editor: Grid_ColInt64NumSinDecimal,hidden:true },
            { field: "Nombre", title: "Nombre del Servicio" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop(e = $("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRowsServ = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRowsServ);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRowsServ);
    });

    // Grid detalle
    function detailInit(e) {
        var Idser = e.data.IdServicio;
        var VdS = {
            transport: {
                read: {
                    url: crudDetaBaseUrl,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function(datos) { return crudDetaBaseUrl + "/" + datos.IdTecnica; },
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json; charset=utf-8"
                },
                destroy: {
                    url: function(datos) { return crudDetaBaseUrl + "/" + datos.IdTecnica; },
                    dataType: "json",
                    type: "DELETE"
                },
                create: {
                    url: crudDetaBaseUrl,
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
            schema: {
                model: {
                    id: "IdTecnica",
                    fields: {
                        IdTecnica: { type: "number" },
                        Nombre: {
                            type: "string",
                            validation: {
                                required: true,
                                maxlength: function(input) {
                                    if (input.is("[name='Nombre']") && input.val().length > 200) {
                                        input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        },
                        IdServicio: {
                            type: "string",
                            defaultValue: Idser,
                            validation: { required: true }
                        },
                        EsPapel: { type: "bool" },
                        EsImpresion: { type: "bool" },
                        EsSublimacion: { type: "bool" },
                        EsPlantilla: { type: "bool" },
                        EsEstampado: { type: "bool" },
                        Nombre1: {
                            type: "string"
                        }
                    }
                }
            },
            filter: { field: "IdServicio", operator: "eq", value: e.data.IdServicio }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            edit: function (e) {
                //  BLOQUEA CAMPO LLAVE ( ID)
                e.container.find("label[for=IdTecnica]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdTecnica]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=IdServicio]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdServicio]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Nombre");
            },           
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdTecnica", title: "Codigo de Técnica", editor: Grid_ColInt64NumSinDecimal, hidden: true },
                { field: "Nombre", title: "Nombre Técnica" },
                { field: "IdServicio", title: "Servicio", hidden: true },
                { field: "Nombre1", title: "Nombre Servicio", hidden: true },
                { field: "EsPapel", title: "Es Papel?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); } },
                { field: "EsImpresion", title: "Es Impresion?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsImpresion"); } },
                { field: "EsSublimacion", title: "Es Sublimacion?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsSublimacion"); } },
                { field: "EsPlantilla", title: "Es Plantilla?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPlantilla"); } },
                { field: "EsEstampado", title: "Es Estampado?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsEstampado"); } }
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS);

        var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsTec);
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds) {
        SetGrid(g, ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si, 400);
        SetGrid_CRUD_ToolbarTop(g, Permisos.SNAgregar);
        SetGrid_CRUD_Command(g, Permisos.SNEditar, Permisos.SNBorrar);
        Set_Grid_DataSource(g, ds);
    }
});

fPermisos = function (datos) {
    Permisos = datos;
}