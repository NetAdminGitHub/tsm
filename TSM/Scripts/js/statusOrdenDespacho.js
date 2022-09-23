
'use strict'
let pJsonCP = "";
let strIdHojasBandeo = [];

var fn_Ini_StatusOrdenDespacho = (xjson) => {
    pJsonCP = xjson;

    let dataSourceStatus = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `DespachosMercanciasDetalles/GetEstatusCortesDespachosMercancias/${pJsonCP.pIdDespachoMercancia}`
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
                    DespachosMercancias: { type: "string" },
                    Tallas: { type: "string" },
                    CantidadTotal: { type: "number" },
                    CantidadProducido: { type: "number" },
                    Estatus: { type: "string" }
                }
            }
        }
    });

    $("#gridEstatusDespacho").kendoGrid({
        dataBound: function (e) {
            let hojasBandeo = [];
            let rows = e.sender.tbody.children();

            for (let i = 0; i < rows.length; i++) {
                let row = $(rows[i]);
                let dataItem = e.sender.dataItem(row);
                let estatus = dataItem.get("Estatus");

                if (estatus == "Aprobado") {
                    row.addClass("bg-Aprobado");
                } else if (estatus == "No Disponible") {
                    row.addClass("bg-NoDisponible");
                }

                hojasBandeo.push(dataItem.IdHojaBandeo);
            }

            strIdHojasBandeo = hojasBandeo;
        },
        columns: [
            { field: "IdHojaBandeo", title: "Id Hoja Bandeo", hidden: true },
            { field: "IdDespachoMercancia", title: "Id Despacho", hidden: true  },
            { field: "Corte", title: "Corte" },
            { field: "Tallas", title: "Tallas" },
            { field: "CantidadTotal", title: "Cantidad" },
            { field: "CantidadProducido", title: "Producido" },
            { field: "Estatus", title: "Estatus" }
        ]
    });

    SetGrid($("#gridEstatusDespacho").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 400);
    SetGrid_CRUD_ToolbarTop($("#gridEstatusDespacho").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEstatusDespacho").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEstatusDespacho").data("kendoGrid"), dataSourceStatus);

    $("#gridEstatusDespacho").data("kendoGrid").dataSource.read();
}

var fn_Reg_StatusOrdenDespacho = (xjson) => {
    pJsonCP = xjson;

    $("#gridEstatusDespacho").data("kendoGrid").dataSource.read();
}
