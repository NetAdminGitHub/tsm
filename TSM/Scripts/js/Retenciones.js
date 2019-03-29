var Permisos;
$(document).ready(function () {
    var vIdSer = 0;
    var vIdMod = 0;
    var vIdTre = 0;
    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlS, "Nombre", "IdServicio", "Seleccione un servicio ...");
    Kendo_CmbFiltrarGrid($("#CmbModulo"), UrlM, "Nombre", "IdModulo", "Seleccione un Modulo ...");
    Kendo_CmbFiltrarGrid($("#CmbTipo"), UrlTr, "Nombre", "IdTipoRetencion", "Seleccione una retencion ...");

    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlRe + "/GetRetencionByIdServicioIdModuloVista/" + vIdSer + "/" + vIdMod + "/" + vIdTre; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlRe + "/" + datos.IdRetencion; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlRe + "/" + datos.IdRetencion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlRe,
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
                id: "IdRetencion",
                fields: {
                    IdRetencion: { type: "Number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    IdModulo: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbModulo").val(); }
                    },
                    IdServicio: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbServicio").val(); }
                    },
                    IdTipoRetencion: { type: "number", defaultValue: function (e) { return $("#CmbTipo").val(); } },
                    Formula: {
                        type: "string"
                    },
                    Severidad: { type: "string" },
                    Estado: { type: "string"},
                    Nombre1: {
                        type: "string"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdRetencion");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "IdServicio");
            KdoHideCampoPopup(e.container, "IdModulo");
            KdoHideCampoPopup(e.container, "IdTipoRetencion");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRetencion", title: "Cod. Retención",  hidden: true },
            { field: "Nombre", title: "Nombre Retención" },
            { field: "Descripcion", title: "Descripción" },
            { field: "Formula", title: "Formula" },
            { field: "Severidad", title: "Severidad", editor: SeveridadDropDownEditor },
            { field: "IdModulo", title: "Modulo", hidden: true },
            { field: "IdServicio", title: "Servicio", hidden: true },
            { field: "IdTipoRetencion", title: "Tipo Retencion", hidden: true},
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "Retenciones", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    Kendo_CmbFocus($("#CmbModulo"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbModulo").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdMod = this.dataItem(e.item.index()).IdModulo;
            fn_Consultar();
        }
        else {
            vIdMod = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbModulo").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdSer = this.dataItem(e.item.index()).IdServicio;
            fn_Consultar();
        }
        else {
            vIdSer = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbTipo").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdTre = this.dataItem(e.item.index()).IdTipoRetencion;
            fn_Consultar();
        }
        else {
            vIdTre = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbTipo").data("kendoComboBox").bind("change", function (e) {
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

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");

    var fn_Consultar = function () {
        if (vIdSer > 0 && vIdMod > 0  && vIdTre > 0) {
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    };

    function SeveridadDropDownEditor(container, options) {
        var ddlDataSource = [{
            value: "L",
            displayValue: "Leve"
        },
        {
            value: "M",
            displayValue: "Moderada"
        },
        {
            value: "C",
            displayValue: "Critica"
        }
        ];

        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                dataTextField: "displayValue",
                dataValueField: "value",
                dataSource: ddlDataSource
            });
    }
});

fPermisos = function (datos) {
    Permisos = datos;
};