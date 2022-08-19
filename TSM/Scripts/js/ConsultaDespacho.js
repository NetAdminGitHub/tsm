"use strict"
var Permisos;

$(document).ready(function () {

    KdoButton($("#btnSolicitarDespacho"), "plus-outline", "Solicitar Despacho");

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "Marcas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");


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

    $("#gridDespachos").kendoGrid({
        dataBound: function (e) {
            let grid = this;
            grid.tbody.find(".progress").each(function (e) {
                let row = $(this).closest("tr");
                let model = grid.dataItem(row);

                $(this).kendoProgressBar({
                    max: 100,
                    value: model.Progeso
                });
            });
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
            { field: "Progeso", title: "Progreso" , template: "<div class='progress'></div>"},
            {
                field: "btnStatus",
                title: "&nbsp;",
                command: {
                    name: "btnStatus",
                    iconClass: "k-icon k-i-play",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                        let dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                        let strjson = {
                            config: [{
                                Div: "vMod_statusOrdenDespacho",
                                Vista: "~/Views/Shared/_statusOrdenDespacho.cshtml",
                                Js: "statusOrdenDespacho.js",
                                Titulo: `Estatus de Orden de Despacho.`,
                                Height: "70%",
                                Width: "60%",
                                MinWidth: "30%"
                            }],
                            Param: {
                                pCorte: $("#txtCorteProceso").val(),
                                pvModal: "vCambiarEstado",
                                pIdMercancia: dataItem.IdMercancia,
                                pIdMercanciaEtapa: dataItem.IdMercanciaEtapa,
                                pidEtapaActual: xIdEtapaProceso,
                                pCantidad: dataItem.Cantidad,
                                pCantidadAveria: dataItem.CantidadAveria
                            },
                            fn: { fnclose: "fn_RefreshGrid", fnLoad: "fn_Ini_StatusOrdenDespacho", fnReg: "fn_Reg_StatusOrdenDespacho", fnActi: "" }
                        };

                        fn_GenLoadModalWindow(strjson);

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
    SetGrid($("#gridDespachos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 700);
    SetGrid_CRUD_ToolbarTop($("#gridDespachos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDespachos").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDespachos").data("kendoGrid"), dataSourceMacro);

    let selectedRows = [];
    $("#gridDespachos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDespachos"), selectedRows);
    });

    $("#gridDespachos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDespachos"), selectedRows);
    });

    $("#gridDespachos").data("kendoGrid").dataSource.read();
    $("#gridDespachos").data("kendoGrid").dataSource.read();


});

var fn_RefreshGrid = () => {
    $("#griVincularListaEmpaque").data("kendoGrid").dataSource.read();
};

fPermisos = function (datos) {
    Permisos = datos;
}