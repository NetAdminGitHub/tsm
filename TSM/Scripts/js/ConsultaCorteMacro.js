"use strict"
var Permisos;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "Marcas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbEtapa"), TSM_Web_APi + "EtapasProcesosMacro", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbServicio"), TSM_Web_APi + "Servicios", "Nombre", "IdPlanta", "Seleccione Planta");

    KdoButton($("#btnGenerarExcel"), "download", "Descargar Data");

    KdoButtonEnable($("#btnGenerarExcel"), false);


    let dataSourceMacro = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "IngresoMercancias/GetIngresosMercanciasGeneral/" + `${xidclie}/${xidPlanta}` },
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

    $("#gridCortes").kendoGrid({
        excel: {
            allPages: true,
            fileName: "Consulta de Corte Macro.xlsx"
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
            { field: "Nombre", title: "Estado" },
            {
                field: "btnIng", title: "&nbsp;",
                command: {
                    name: "btnIng",
                    iconClass: "k-icon k-i-edit",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        window.location.href = "/IngresoMercancias/" + `${dataItem.IdCliente}/${dataItem.IdIngreso}`;
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridCortes").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridCortes").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridCortes").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCortes").data("kendoGrid"), dataSourceMacro);

    $("#gridCortes").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });

    let selectedRows = [];
    $("#gridCortes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCortes"), selectedRows);
    });

    $("#gridCortes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCortes"), selectedRows);
    });

    $("#gridCortes").data("kendoGrid").dataSource.read();

    $("#btnGenerarExcel").data("kendoButton").bind("click", function (e) {
        const grid = $("#gridCortes").data("kendoGrid");
        grid.saveAsExcel();
    });


});

fPermisos = (datos) => {
    Permisos = datos;
};