"use strict"
var Permisos;

$(document).ready(function () {

    TextBoxEnable($("#txtCorte"), false);
    TextBoxEnable($("#txtCodigoFM"), false);
    TextBoxEnable($("#txtDiseño"), false);
    TextBoxEnable($("#txtEstilo"), false);
    TextBoxEnable($("#txtColorTela"), false);
    TextBoxEnable($("#txtParte"), false);
    TextBoxEnable($("#txtProducto"), false);
    TextBoxEnable($("#txtCantidad"), false);
    TextBoxEnable($("#txtBultos"), false);
    TextBoxEnable($("#txtPlanta"), false);

    KdoButton($("#btnGenerarExcel"), "download", "Descargar Data");

    KdoButtonEnable($("#btnGenerarExcel"), false);

    let dataSourceMicro = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "IngresoMercancias/GetIngresosMercanciasGeneral/" + `${0}/${0}` },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "IngresoMercancias/" + datos.IdIngreso; },
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdIngreso",
                fields: {
                    IdIngreso: { type: "number" },
                    Fecha: { type: "date" },
                    FechaIngreso: { type: "date" },
                    IdCliente: { type: "number" },
                    NombreCliente: { type: "string" },
                    Estado: { type: "string" },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    ReferenciaPL: { type: "string" },
                    CantidadCortes: { type: "number" },
                    Planta: { type: "string" },
                    TipoProceso: { type: "string" },
                    CantidadTotal: { type: "number" },
                    NoDocumento: { type: "string" }
                }
            }
        }
    });

    $("#gridBultos").kendoGrid({
        excel: {
            allPages: true,
            fileName: "Consulta de Corte Micro.xlsx"
        },
        columns: [
            { field: "IdIngreso", title: "Id. Ingreso", hidden: true },
            { field: "NoDocumento", title: "# Ingreso" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "FechaIngreso", title: "Fecha Ingreso", format: "{0: dd/MM/yyyy}" },
            { field: "IdCliente", title: "Id Cliente", hidden: true },
            { field: "NombreBodegaCli", title: "Bodega", hidden: true },
            { field: "ReferenciaPL", title: "No. Referencia PL" },
            { field: "CantidadCortes", title: "Cantidad de Cortes" },
            { field: "CantidadTotal", title: "Total Cuantía" },
            { field: "Planta", title: "Planta" },
            { field: "TipoProceso", title: "Tipo de Proceso" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Nombre", title: "Estado" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridBultos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 680);
    SetGrid_CRUD_ToolbarTop($("#gridBultos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridBultos").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridBultos").data("kendoGrid"), dataSourceMicro);

    $("#gridBultos").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });

    let selectedRows = [];
    $("#gridBultos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridBultos"), selectedRows);
    });

    $("#gridBultos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridBultos"), selectedRows);
    });

    $("#gridBultos").data("kendoGrid").dataSource.read();

    $("#btnGenerarExcel").data("kendoButton").bind("click", function (e) {
        const grid = $("#gridBultos").data("kendoGrid");
        grid.saveAsExcel();
    });

    $("#chart").kendoChart({
        chartArea: {
            height: 45
        },
        legend: {
            visible: false
        },
        seriesDefaults: {
            type: "bar",
            stack: {
                type: "100%"
            }
        },
        series: [{
            name: "Gold Medals",
            data: [40],
            color: "#f3ac32"
        }, {
            name: "Silver Medals",
            data: [19],
            color: "#b8b8b8"
        }, {
            name: "Bronze Medals",
            data: [41],
            color: "#bb6e36"
        }],
        valueAxis: {
            line: {
                visible: false
            },
            minorGridLines: {
                visible: true
            }
        },
        categoryAxis: {
            categories: [],
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            template: "#= series.name #: #= value #"
        }
    });


});

fPermisos = (datos) => {
    Permisos = datos;
};