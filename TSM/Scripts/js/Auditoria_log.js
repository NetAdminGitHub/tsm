"use strict"
var Permisos;
let xTabla;
let xFechaInicio;
let xFechaFin;
$(document).ready(function () {
    let xTabla = null;
    let xFechaInicio = null;
    let xFechaFin = null;
    // crear combobox tabla
    Kendo_CmbFiltrarGrid($("#cmbTabla"), TSM_Web_APi + "/Auditoria_log/GetTablasAuditadas", "Tabla", "Tabla", "Seleccione la Tabla");
    //Fecha Inicio y Fecha Fin
    let end = new Date();
    let start = new Date(end.getFullYear(), end.getMonth()-1, end.getDate());
    let min = new Date();
    
    $("#daterangepicker").kendoDateRangePicker({
        range: { start: start, end: end },
        max: end,
        "messages": {
            "startLabel": "Fecha Inicio:",
            "endLabel": "Fecha Fin:"            
        }
    });

    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        transport: {
            read: {
                url: TSM_Web_APi + "Auditoria_log/GetLogAuditoriaByTablaByRangoFechas",
                contentType: "application/json; charset=utf-8",
                type: "POST"
            },
            parameterMap: function (data, type) {
                return kendo.stringify({
                    Tabla: xTabla,
                    FechaInicio: xFechaInicio,
                    FechaFin: xFechaFin
                });
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "Transaccion",
                fields: {
                    Transaccion: { type: "string" },
                    Tabla: { type: "string" },
                    PrimaryKey: { type: "string" },
                    Campo: { type: "string" },
                    ValorOriginal: { type: "string" },
                    ValorNuevo: { type: "string" },
                    FechaTransaccion: { type: "date" },
                    IdUsuario: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "FechaTransaccion", title: "Fecha de Transacción", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" },
            { field: "Transaccion", title: "Tipo de Transacción" },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "PrimaryKey", title: "Id. Registro" },
            { field: "Campo", title: "Campo" },
            { field: "ValorOriginal", title: "Valor Original" },
            { field: "ValorNuevo", title: "Valor Nuevo" },
            { field: "IdUsuario", title: "Usuario Modifica" }                      
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dS);

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

    //#endregion 

    //#region filtros
    $("#cmbTabla").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "")
        {
            $("#grid").data("kendoGrid").dataSource.read();
            xTabla = "";
        }
        else
        {
            xTabla = KdoCmbGetValue($("#cmbTabla"));
            xFechaInicio = kendo.toString(kendo.parseDate(start), 's');
            xFechaFin = kendo.toString(kendo.parseDate(end), 's');
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });



    $("#daterangepicker").data("kendoDateRangePicker").bind("change", function () {
        let range = this.range();
        if (range === "") {
            $("#grid").data("kendoGrid").dataSource.read();
            xTabla = "";
        }
        else {
            xTabla = KdoCmbGetValue($("#cmbTabla"));
            xFechaInicio = kendo.toString(kendo.parseDate(range.start), 's');
            xFechaFin = kendo.toString(kendo.parseDate(range.end), 's');
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });
    //#endregion
});

fPermisos = (datos) => {
    Permisos = datos;
};