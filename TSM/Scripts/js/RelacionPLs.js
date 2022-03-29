let xidDeclaracionMercancia;
var fn_Ini_RelacionPLs = (idDeclaracionMercancia, item) => {
    xidDeclaracionMercancia = sIdRegNotaRemi;

    KdoButton($("#btnGuardarPLs"), "gear", "Relacionar Listas de EmpaqueCalcular Datos");

    ////#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "IngresoMercancias/GetIngresoMercanciaByCliente/" + `${xidDeclaracionMercancia}` },
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
                id: "Item",
                fields: {
                    Descripcion: { type: "string" },
                    Cantidad: { type: "number" },
                    Total: { type: "number" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridListasEmpaques").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Item", title: "Item", hidden: true },
            { field: "Descripcion", title: "Descripción de Mercancia" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Total", title: "Total" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridListasEmpaques").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridListasEmpaques").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridListasEmpaques").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridListasEmpaques").data("kendoGrid"), dS);

    $("#gridListasEmpaques").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    var selectedRows = [];
    $("#gridListasEmpaques").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridListasEmpaques"), selectedRows);
    });

    $("#gridListasEmpaques").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridListasEmpaques"), selectedRows);
    });
    $("#gridListasEmpaques").data("kendoGrid").dataSource.read();

    ////#endregion 
    //$("#txt_NotaRemision").focus();


};

var fn_Reg_RelacionPLs = (idDeclaracionMercancia, item) => {
    //xsIdRegNotaRemi = sIdRegNotaRemi;
    //$("#gridListasEmpaques").data("kendoGrid").dataSource.read();
    //$("#txt_NotaRemision").focus();
};
