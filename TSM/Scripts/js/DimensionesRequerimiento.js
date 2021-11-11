
var fn_InicializarDimensiones = (divDimen, dmIdreq) => {
    //#region CRUD Programación GRID Dimensiones
    let DsDimen = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "Dimensiones/GetbyRequerimiento/" + dmIdreq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "Dimensiones/" + datos.IdRequerimiento.toString() + "/" + datos.IdDimension.toString(); },
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "Dimensiones/" + datos.IdRequerimiento.toString() + "/" + datos.IdDimension.toString(); },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "Dimensiones",
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
                id: "IdDimension",
                fields: {
                    Id: {
                        type: "string"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    IdDimension: {
                        type: "number"
                    },
                    IdCategoriaTalla: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    IdUnidad: {
                        type: "string", defaultValue: 5
                    },
                    Abreviatura: {
                        type: "string"
                    },
                    Alto: {
                        type: "number"
                    },
                    Ancho: {
                        type: "number"
                    },
                    Tallas: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Tallas']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200.");
                                    return input.val().length <= 200;
                                }
                                if (input.is("[name='Alto']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $('[name="C3"]').is(':checked') === true ? $("[name='Alto']").data("kendoNumericTextBox").value() >= 0 : $("[name='Alto']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Ancho']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $('[name="C3"]').is(':checked') === true ? $("[name='Ancho']").data("kendoNumericTextBox").value() >= 0 : $("[name='Ancho']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='IdCategoriaTalla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaTalla").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='DimensionesRelativas']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $('[name="C3"]').is(':checked') === true ? input.val().length > 0 && input.val().length <= 2000 : input.val().length <= 2000;
                                }

                                return true;
                            }
                        }
                    },
                    C3: {
                        type: "bool"
                    },
                    DimensionesRelativas: { type: "string" },
                    DesarrollarTalla: {
                        type: "bool", defaultValue: function (e) { return false; }
                    }
                }
            }
        }
    });

    $("#GRDimensionReq").kendoGrid({
        autoBind: false,
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Id");
            KdoHideCampoPopup(e.container, "IdDimension");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Abreviatura");
            KdoComboBoxEnable($('[name="IdCategoriaTalla"]'), false);
            TextBoxEnable($('[name="Tallas"]'), false);
            TextBoxEnable($('[name="DimensionesRelativas"]'), false);
            KdoCheckBoxEnable($('[name="C3"]'),false)
            KdoCheckBoxEnable($('[name="DesarrollarTalla"]'), false)
            $('[name="Ancho"]').data("kendoNumericTextBox").focus();
            
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdDimension", title: "Codigó Dimensión", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdCategoriaTalla", title: "Tallas a Desarrollar", editor: Grid_Combox, values: ["IdCategoriaTalla", "Nombre", TSM_Web_APi + "CategoriaTallas", "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Nombre", title: "Tallas a Desarrollar" },
            { field: "Tallas", title: "Rango de Tallas" }, //aggregates: ["count"], footerTemplate: "Cantidad de Tallas: #: data.Tallas ? data.Tallas.count: 0 #" 
            { field: "C3", title: "Dimensión Relativa", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "C3"); } },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "IdUnidad", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", TSM_Web_APi+ "UnidadesMedidas", "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Abreviatura", title: "Unidad de Medida" },
            { field: "DimensionesRelativas", title: "Medidas Relativas" },
            { field: "DesarrollarTalla", title: "¿Talla a desarrollar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "DesarrollarTalla"); } },
        ]

    });

    SetGrid($("#GRDimensionReq").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRDimensionReq").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GRDimensionReq").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#GRDimensionReq").data("kendoGrid"), DsDimen);

    var selectedRowsDimen = [];
    $("#GRDimensionReq").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRDimensionReq"), selectedRowsDimen);
    });

    //#endregion Fin CRUD Programación GRID Dimensiones
    $("#GRDimensionReq").data("kendoGrid").dataSource.read();
}

var fn_ActualizarDimensionesRequerimiento = (divDimen, dmIdreq) => {
    $("#GRDimensionReq").data("kendoGrid").dataSource.read();

}