var Permisos;
$(document).ready(function () {
    var vIdSer = 0;
    var vIdMod = 0;
    var vIdTre = 0;
    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlS, "Nombre", "IdServicio", "Seleccione un servicio ...");
    Kendo_CmbFiltrarGrid($("#CmbModulo"), UrlM, "Nombre", "IdModulo", "Seleccione un Modulo ...");
    Kendo_CmbFiltrarGrid($("#CmbTipo"), UrlTr, "Nombre", "IdTipoRetencion", "Seleccione una retencion ...");

    //#region Retenciones
    //CONFIGURACION DEL CRUD
    var dataSource = new kendo.data.DataSource({
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

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            $("#gridAut").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridAut"), false, false, false);
        }
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_ConsultarGridAut();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    //#endregion Retenciones

    //#region Retenciones Roles Autorizaciones
    //CONFIGURACION DEL CRUD
    var dsRetencionesAut = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlRRA + "/GetRetencionesRolesAutVista/" + getIdRetencion($("#grid").data("kendoGrid")); },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlRRA + "/" + datos.IdRetencion + "/" + datos.IdRol; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlRRA + "/" + datos.IdRetencion + "/" + datos.IdRol; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlRRA,
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
                id: "IdRol",
                fields: {
                    IdRetencion: {
                        type: "Number",
                        defaultValue: function (e) { return getIdRetencion($("#grid").data("kendoGrid")); }
                    },
                    IdRol: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdRol']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdRol").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: { type: "string" },                    
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridAut").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdRetencion");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "IdRol");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRetencion", title: "Cod. Retención", hidden: true },
            { field: "IdRol", title: "Rol", values: ["IdRol", "Nombre", UrlRo, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Rol" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridAut").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridAut").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridAut").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridAut").data("kendoGrid"), dsRetencionesAut);

    var selectedRowsAut = [];
    $("#gridAut").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridAut"), selectedRowsAut);
    });

    $("#gridAut").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridAut"), selectedRowsAut);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridAut"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridAut"), $(window).height() - "371");
    //#endregion Retenciones
    
    Kendo_CmbFocus($("#CmbModulo"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);
    Grid_HabilitaToolbar($("#gridAut"), false, false, false);

    let fn_ConsultarGridAut = function () {
        $("#gridAut").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridAut"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridAut"), false, false, false);
    };

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

    let fn_Consultar = function () {
        if (vIdSer > 0 && vIdMod > 0 && vIdTre > 0) {
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    };
});

let SeveridadDropDownEditor = function (container, options) {
    var ddlDataSource = [
        {
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
        .kendoComboBox({
            dataTextField: "displayValue",
            dataValueField: "value",
            autoWidth: true,
            filter: "contains",
            autoBind: false,
            clearButton: true,
            placeholder: "Seleccione....",
            height: 550,
            dataSource: ddlDataSource
        });
};

let getIdRetencion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRetencion;
};

fPermisos = function (datos) {
    Permisos = datos;
};