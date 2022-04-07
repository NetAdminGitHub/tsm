

var fn_Ini_CarritoEnt = (xjson) => {
    Kendo_CmbFiltrarGrid($("#dropdMaquina"), TSM_Web_APi + "CatalogoMaquinas", "NoMaquina", "IdCatalogoMaquina", "Seleccione Máquina");
    KdoButton($("#btnRegistrar"), "save", "Registrar");
    KdoButton($("#btnCancelar"), "close", "cerrar");
    TextBoxEnable($("#txtFm"), false);
    TextBoxEnable($("#txtNoBulto"), false);

    //#region crear grid Lista
    let dSlis = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CarritosDetallesMercancias/GetCarritosEnPreparacion/" + `${xidcata}` },
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
                id: "IdCarrito",
                fields: {
                    IdCarrito: { type: "number" },
                    IdMercancia: { type: "number" },
                    IdCatalogoDiseno: { type: "number" },
                    NoDocumento: { type: "string" },
                    Color: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    Estado: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDetCortePre").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCarrito", title: "Id Carrito", hidden: true },
            { field: "IdMercancia", title: "Id Mercancia", hidden: true },
            { field: "IdCatalogoDiseno", title: "Id Mercancia", hidden: true },
            { field: "NoDocumento", title: "NoDocumento" },
            { field: "Color", title: "Color" },
            { field: "Talla", title: "Talla" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Estado", title: "Estilos" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDetCortePre").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDetCortePre").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDetCortePre").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDetCortePre").data("kendoGrid"), dSlis);

    var selectedRows2 = [];
    $("#gridDetCortePre").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetCortePre"), selectedRows2);
    });

    $("#gridDetCortePre").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetCortePre"), selectedRows2);
    });

    $("#gridDetCortePre").data("kendoGrid").dataSource.read();

    //#endregion 



}


var fn_Reg_CarritoEnt = (xjson) => {


}

var fn_Close_CarritoEnt = (xjson) => {


}

