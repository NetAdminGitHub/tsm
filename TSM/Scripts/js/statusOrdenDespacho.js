
'use strict'
let pJsonCP = "";

var fn_Ini_StatusOrdenDespacho = (xjson) => {
    pJsonCP = xjson;

    KdoButton($("#btnGenerarUnidad"), "save", "Generar Unidad de Embalaje");

    let dataSourceStatus = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `DespachosMercancias/statusOrdenDespacho/${pJsonCP.pIdDespachoMercancia}`
                },
                contentType: "application/json; charset=utf-8"
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
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    IdDespachoMercancia: { type: "number" },
                    Corte: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    Estatus: { type: "string" }
                }
            }
        }
    });

    $("#gridEstatusDespacho").kendoGrid({
        columns: [
            { field: "IdHojaBandeo", title: "Id Hoja Bandeo", hidden: true },
            { field: "IdDespachoMercancia", title: "Id Despacho", hidden: true  },
            { field: "Corte", title: "Corte" },
            { field: "Talla", title: "Tallas" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Estatus", title: "Estatus" }
        ]
    });

    SetGrid($("#gridEstatusDespacho").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 400);
    SetGrid_CRUD_ToolbarTop($("#gridEstatusDespacho").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEstatusDespacho").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEstatusDespacho").data("kendoGrid"), dataSourceStatus);

    let selectedRows = [];
    $("#gridEstatusDespacho").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridEstatusDespacho"), selectedRows);
    });

    $("#gridEstatusDespacho").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridEstatusDespacho"), selectedRows);
    });

    $("#gridEstatusDespacho").data("kendoGrid").dataSource.read();

}

var fn_Reg_StatusOrdenDespacho = (xjson) => {
    pJsonCP = xjson;

    $("#gridEstatusDespacho").data("kendoGrid").dataSource.read();
}
