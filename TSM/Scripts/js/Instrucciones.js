var Permisos;
let UrlPl = TSM_Web_APi + "CatInstrucciones";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdInstruccion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdInstruccion; },
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
                id: "IdInstruccions",
                fields: {
                    IdInstruccions: { type: "number" },
                    Descripcion: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Descripcion']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 300) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 300");
                                    return false;
                                }
                                /*if (input.is("[name='CodigoInstruccion']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='CodigoInstruccion']") && input.val().length > 5) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 5");
                                    return false;
                                }*/
                                return true;
                            }
                        }
                    },
                    IdDepartamento: { type: "string" },
                }
            }
        },
        sort: { field: "IdDepartamento", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdInstruccion");
            Grid_Focus(e, "Descripcion");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdInstruccion", title: "ID", hidden: true },
            { field: "Descripcion", title: "Descripcion" },
            { field: "IdDepartamento", title: "Departamento", editor: departamentosDropDownEditor  }
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

let departamentosDropDownEditor = function (container, options) {
    var ddlDataSource = [
        {
            value: "CALI",
            displayValue: "CALI"
        },
        {
            value: "PROD",
            displayValue: "PROD"
        }
    ];

    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            dataTextField: "displayValue",
            dataValueField: "value",
            autoWidth: true,
            filter: "contains",
            autoBind: true,
            clearButton: true,
            height: 550,
            dataSource: ddlDataSource
        });
};

fPermisos = function (datos) {
    Permisos = datos;
};