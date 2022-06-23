"use strict"
var Permisos;
let xTabla;
let xFechaInicio;
let xFechaFin;
$(document).ready(function () {

    // crear combobox tabla
    Kendo_CmbFiltrarGrid($("#cmbTabla"), TSM_Web_APi + "/Auditoria_log/GetTablasAuditadas", "Tabla", "Tabla", "Seleccione la Tabla");
    //Fecha Inicio y Fecha Fin
    $("#ddFechaIni").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#ddFechaFin").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#ddFechaIni").data("kendoDatePicker").value(Fhoy());
    $("#ddFechaFin").data("kendoDatePicker").value(Fhoy());

    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: TSM_Web_APi + "/GetLogAuditoriaByTablaByRangoFechas",
                    data: JSON.stringify({
                        IdCliente: xCliente,
                        FechaDesde: xFechaDesde,
                        FechaHasta: xFechaHasta
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($(document.body), false);
                        datos.success(result);
                    },
                    error: function (result) {
                        kendo.ui.progress($(document.body), false);
                        options.error(result);
                    }
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
    $("#gridIngreso").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdIngreso", title: "Ingreso" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "FechaIngreso", title: "Fecha Ingreso", format: "{0: dd/MM/yyyy}" },
            { field: "IdCliente", title: "Id Cliente", hidden: true },
            { field: "NombreBodegaCli", title: "Bodega", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Nombre", title: "Estado" },
            { field: "ReferenciaPL", title: "No. Referencia PL" },
            { field: "CantidadCortes", title: "Cantidad de Cortes" },
            { field: "CantidadTotal", title: "Total Cuantía" },
            { field: "Planta", title: "Planta" },
            { field: "TipoProceso", title: "Tipo de Proceso" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridIngreso").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridIngreso").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridIngreso").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridIngreso").data("kendoGrid"), dS);

    $("#grid").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Log de Auditoria de Tablas";
        }
    });
    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridIngreso"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridIngreso"), selectedRows);
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
            xTabla = KdoCmbComboBox($("#cmbTabla"));
            xFechaInicio = kendo.toString(kendo.parseDate($("#ddFechaIni").val()), 's');
            xFechaFin = kendo.toString(kendo.parseDate($("#ddFechaFin").val()), 's');
        }
    });

    $("#ddFechaIni").data("kendoDatePicker").bind("change", function () {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.read();
            xTabla = "";
        }
        else {
            xTabla = KdoCmbComboBox($("#cmbTabla"));
            xFechaInicio = kendo.toString(kendo.parseDate($("#ddFechaIni").val()), 's');
            xFechaFin = kendo.toString(kendo.parseDate($("#ddFechaFin").val()), 's');
        }
    });

    $("#ddFechaFin").data("kendoDatePicker").bind("change", function () {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.read();
            xTabla = "";
        }
        else {
            xTabla = KdoCmbComboBox($("#cmbTabla"));
            xFechaInicio = kendo.toString(kendo.parseDate($("#ddFechaIni").val()), 's');
            xFechaFin = kendo.toString(kendo.parseDate($("#ddFechaFin").val()), 's');
        }
    });
    //#endregion
});

fPermisos = (datos) => {
    Permisos = datos;
};