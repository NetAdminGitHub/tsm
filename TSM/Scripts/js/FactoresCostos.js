var Permisos;

$(document).ready(function () {
    //CONFIGURACION DEL CRUD
    var VarIdServicio = 0;
    // combo box
    Kendo_CmbFiltrarGrid($("#CmbServicio"), VistaUlr, "Nombre", "IdServicio", "Seleccione un Servicio ....");

    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/GetbyIdServicio/" + VarIdServicio; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdFactorCosto; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdFactorCosto; },
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
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdFactorCosto",
                fields: {
                    IdFactorCosto: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    IdServicio: {
                        type: "numeric",
                        defaultValue: function (e) { return $("#CmbServicio").val(); }
                    },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdFactorCosto']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 20");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Costo: {
                        type: "number",
                        validation: {
                            required: true
                        }, defaultValue: 0.0000
                    },
                    IdUnidadCosto: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre2: {
                        type: "string"                        
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            //PERMITE OCULTAR CAMPOS EN EL EDITOR POPUP.
            e.container.find("label[for=Nombre2]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre2]").parent().next("div .k-edit-field").hide();

            if (!e.model.isNew()) {
                $('[name="IdFactorCosto"]').addClass("k-state-disabled");
                Grid_Focus(e, "Nombre");
            }
            else {
                $('[name="IdFactorCosto"]').removeClass("k-state-disabled");
                Grid_Focus(e, "IdFactorCosto");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFactorCosto", title: "Factor Costo" },
            { field: "Nombre", title: "Nombre" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.0001", "9999999.9999", "n4", 4],format:'{0:c4}'},
            { field: "IdUnidadCosto", title: "Unidad Costo", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...."], hidden: true },
            { field: "Nombre2", title: "Unidad Costo" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Kendo_CmbFocus($("#CmbServicio"));
    //Deshailitar toolbar.
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarIdServicio = dataItem.IdServicio;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {            
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        selectedRows = [];
        if (value === "") {
            VarIdServicio = 0;
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

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
});  

fPermisos = function (datos) {
    Permisos = datos;
}