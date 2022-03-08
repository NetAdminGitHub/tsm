let xsIdRegNotaRemi
var fn_Ini_IngresoNotaRemision = (sIdRegNotaRemi) => {
    xsIdRegNotaRemi = sIdRegNotaRemi;
    //fecha de ingreso
    $("#dFechaIngreso").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaIngreso").data("kendoDatePicker").value(Fhoy());
    KdoButton($("#btnCalcularDatos"), "gear", "Calcular Datos");

    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "IngresoMercancias/GetIngresoMercanciaByCliente/" + `${xsIdRegNotaRemi}` },
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
                id: "Id",
                fields: {
                    Descripcion: { type: "string" },
                    Cantidad: { type: "number" },
                    Total: { type: "number" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDetalleNotaRemision").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "Descripcion", title: "Descripción de Mercancia" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Total", title: "Total"}
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDetalleNotaRemision").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDetalleNotaRemision").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDetalleNotaRemision").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDetalleNotaRemision").data("kendoGrid"), dS);

    $("#gridDetalleNotaRemision").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    var selectedRows = [];
    $("#gridDetalleNotaRemision").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetalleNotaRemision"), selectedRows);
    });

    $("#gridDetalleNotaRemision").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetalleNotaRemision"), selectedRows);
    });
    $("#gridDetalleNotaRemision").data("kendoGrid").dataSource.read();

    //#endregion 
    $("#txt_NotaRemision").focus();


};

var fn_Reg_IngresoNotaRemision = (sIdRegNotaRemi) => {
    xsIdRegNotaRemi = sIdRegNotaRemi;
    $("#gridDetalleNotaRemision").data("kendoGrid").dataSource.read();
    $("#txt_NotaRemision").focus();
};
