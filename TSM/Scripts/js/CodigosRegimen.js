var Permisos;
let UrlReg = TSM_Web_APi + "Regimenes";
let UrlTT = TSM_Web_APi + "TiposTraslados";
let UrlRTTR = TSM_Web_APi + "RelacionTiposTrasladosRegimenes";

$(document).ready(function () {

/////////////////////////////////////////////////////////REGÍMENES//////////////////////////////////////////////////////
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlReg,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlReg + "/" + datos.IdRegimen; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlReg + "/" + datos.IdRegimen; },
                type: "DELETE"
            },
            create: {
                url: UrlReg,
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
                id: "IdRegimen",
                fields: {
                    IdRegimen: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Codigo']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Codigo']") && input.val().length > 3) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 3");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                /*if (input.is("[name='IdDepartamento']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdDepartamento").data("kendoComboBox").selectedIndex >= 0;
                                }*/
                                return true;
                            }
                        }
                    },
                    Codigo: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "Codigo", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridReg").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdRegimen");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRegimen", title: "ID", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Codigo", title: "Código" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridReg").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#gridReg").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridReg").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridReg").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridReg").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridReg"), selectedRows);
    });

    $("#gridReg").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridReg"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridReg"), $(window).height() - "660");
    });

    Fn_Grid_Resize($("#gridReg"), $(window).height() - "660");

/////////////////////////////////////////////////////////FIN REGÍMENES//////////////////////////////////////////////////////

/////////////////////////////////////////////////////////TIPOS TRASLADOS//////////////////////////////////////////////////////
    let dataSource2 = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlTT,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlTT + "/" + datos.IdTipoTraslado; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlTT + "/" + datos.IdTipoTraslado; },
                type: "DELETE"
            },
            create: {
                url: UrlTT,
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
                id: "IdTipoTraslado",
                fields: {
                    IdTipoTraslado: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Codigo']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Codigo']") && input.val().length > 4) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 4");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Tipo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Tipo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Codigo: { type: "string" },
                    Tipo: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "Codigo", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridTipoTraslado").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoTraslado");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoTraslado", title: "ID", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Codigo", title: "Código" },
            { field: "Tipo", title: "Tipo", editor: tipoDropDownEditor, template: "#if (Tipo == 'D') {# Definitivo #} else if(Tipo == 'E') {# Entrada #} else if (Tipo == 'S') {# Salida #}#" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridTipoTraslado").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#gridTipoTraslado").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridTipoTraslado").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridTipoTraslado").data("kendoGrid"), dataSource2);

    var selectedRows2 = [];
    $("#gridTipoTraslado").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridTipoTraslado"), selectedRows2);
    });

    $("#gridTipoTraslado").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridTipoTraslado"), selectedRows2);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridTipoTraslado"), $(window).height() - "630");
    });

    Fn_Grid_Resize($("#gridTipoTraslado"), $(window).height() - "630");

/////////////////////////////////////////////////////////FIN TIPOS TRASLADOS//////////////////////////////////////////////////////

/////////////////////////////////////////////////////////RELACIÓN TRASLADO RÉGIMEN//////////////////////////////////////////////////////
    let dataSource3 = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlRTTR,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlRTTR + "/" + datos.IdTipoTrasladoRegimen; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlRTTR + "/" + datos.IdTipoTrasladoRegimen; },
                type: "DELETE"
            },
            create: {
                url: UrlRTTR,
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
                id: "IdTipoTrasladoRegimen",
                fields: {
                    IdTipoTrasladoRegimen: { type: "number" },
                    IdTipoTraslado: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdTipoTraslado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoTraslado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdRegimen']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdRegimen").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Codigo: { type: "string" },
                    Nombre: { type: "string" },
                    IdRegimen: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "IdTipoTrasladoRegimen", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridRTTR").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoTrasladoRegimen");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Codigo");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdTipoTraslado");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoTrasladoRegimen", title: "ID", hidden: true },
            { field: "IdTipoTraslado", title: "Tipo Traslado", values: ["IdTipoTraslado", "Nombre", UrlTT, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "IdRegimen", title: "Regimen", values: ["IdRegimen", "Nombre", UrlReg, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Codigo", title: "Código" },
            { field: "Nombre", title: "Nombre" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridRTTR").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No, 690);
    SetGrid_CRUD_ToolbarTop($("#gridRTTR").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridRTTR").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridRTTR").data("kendoGrid"), dataSource3);

    var selectedRows3 = [];
    $("#gridRTTR").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRTTR"), selectedRows3);
    });

    $("#gridRTTR").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRTTR"), selectedRows3);
    });

/////////////////////////////////////////////////////////FIN RELACIÓN TRASLADO RÉGIMEN//////////////////////////////////////////////////////

    $("#vertical").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: false, resizable: false },
            { collapsible: false, resizable: false },
            { collapsible: false, resizable: false }
        ]
    });

    $("#horizontal").kendoSplitter({
        panes: [
            { collapsible: false, resizable: false },
            { collapsible: true, resizable: false }
        ]
    });

    $("#left-pane").removeClass("k-scrollable");
    $("#right-pane").removeClass("k-scrollable");
    $(".k-splitbar").css("width", "25px");
    $(".k-icon.k-collapse-next.k-i-arrow-60-right").trigger("click");

    $(".k-icon.k-expand-next").kendoTooltip({
        autoHide: true,
        position: "top",
        content: "Catálogos de Tipo de Traslados y Regimen."
    });

    setTimeout(function () {
       $(".k-icon.k-expand-next").trigger("mouseenter");
    }, 0750);

    $("a.k-icon.k-i-close").on("click", function () {
        $(".k-widget.k-tooltip.k-tooltip-closable.k-popup.k-group.k-reset.k-state-border-up").addClass("d-none");
    });

});



let tipoDropDownEditor = function (container, options) {
    var ddlDataSource = [
        {
            value: "D",
            displayValue: "Definitivo"
        },
        {
            value: "E",
            displayValue: "Entrada"
        },
        {
            value: "S",
            displayValue: "Salida"
        }

    ];

    $('<input required name="' + options.field + '" id="' + options.field + '"/>')
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