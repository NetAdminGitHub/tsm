var Permisos;
let UrlPl = TSM_Web_APi + "LocalizacionesMercanciasDM";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdLocalizacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdLocalizacion; },
                type: "DELETE"
            },
            create: {
                url: UrlPl,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdLocalizacion",
                fields: {
                    IdLocalizacion: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Codigo']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Codigo']") && input.val().length > 5) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 5");
                                    return false;
                                }                                
                                if (input.is("[name='IdAduana']")) {
                                    input.attr("data-maxlength-msg", "Selección Requerida");
                                    return $("#IdAduana").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Codigo: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdAduana: { type: "string" },
                    NombreAduana: { type: "string" },
                    CodigoAduana: { type: "string" }
                }
            }
        },
        sort: { field: "Nombre", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdLocalizacion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "NombreAduana");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "CodigoAduana");

            $('[name="IdAduana"]').on('change', function (e) {
                var ml = $('[name="IdAduana"]').data("kendoMultiColumnComboBox");
                let data = ml.listView.dataSource.data().find(q => q.IdAduana === Number(this.value));                
            });

            Grid_Focus(e, "Nombre");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdLocalizacion", title: "Id. Localización", hidden: true },
            { field: "Nombre", title: "Nombre", sortable: { initialDirection: "asc" } },
            { field: "Codigo", title: "Código" },
            {
                field: "IdAduana", title: "Aduana", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSeleccionAduanas();
                }
            },
            { field: "CodigoAduana", title: "Codigo Aduana"},
            { field: "NombreAduana", title: "Aduana", sortable: { initialDirection: "asc" } },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
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
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
});

fPermisos = function (datos) {
    Permisos = datos;
};

//#region consultas


$.fn.extend({
    ControlSeleccionAduanas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdAduana",
                filter: "contains",
                filterFields: ["IdAduana","CodigoAduana", "Nombre"],
                autoBind: false,
                height: 400,
                placeholder: "Selección de Aduana",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "Aduanas";
                            },
                            contentType: "application/json; charset=utf-8"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read" && data.models) {
                                return kendo.stringify(data.models[0]);
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "IdAduana",
                            fields: {                                
                                CodigoAduana: { type: "string" },
                                Nombre: { type: "string" }
                            }
                        }
                    }
                },
                columns: [
                    { field: "CodigoAduana", title: "Código Aduana", width: 100 },
                    { field: "Nombre", title: "Aduana", width: 300 }
                ]
            });
        });
    }
});

//#endregion 