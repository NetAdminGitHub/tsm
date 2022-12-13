var fn_Ini_Info_Emb_Dis = function (pJson) {
    var idEmb = pJson.IdEmbalajeMercancia;

    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return `${TSM_Web_APi}DespachosListaEmpaques/GetContenidoCortesEmbalaje/${idEmb}`; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdDespachoEmbalajeMercancia",
                fields: {
                    IdDespachoEmbalajeMercancia: { type: "number" },
                    IdEmbalajeMercancia: { type: "number" },
                    IdHojaBandeo: { type: "number" },
                    Corte: { type: "string" },
                    CantTallas: { type: "number" },
                    Tallas: { type: "string" },
                    CantBultos: { type: "number" },
                    Cantidad: { type: "number" },
                    HB: { type: "string" },
                    FM: { type: "string" },
                    Diseño: { type: "string" },
                    Estilo: { type: "string" },
                    Parte: { type: "string" },
                    Proceso: { type: "string" }
                }
            }
        }
    });

    $("#gridDED").kendoGrid({
        columns: [
            { field: "IdDespachoEmbalajeMercancia", title: "IdDespachoEmbalajeMercancia", hidden: true },
            { field: "IdEmbalajeMercancia", title: "IdEmbalajeMercancia", hidden: true },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "HB", title: "Hoja Bandeo", },
            { field: "Corte", title: "Corte/Lotes" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "FM", title: "FM" },
            { field: "Diseño", title: "Diseño" },
            { field: "Estilo", title: "Estilo" },
            { field: "Tallas", title: "Tallas" },
            { field: "Parte", title: "Parte" },
            { field: "Proceso", title: "Proceso" },
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#gridDED").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 700, false);
    SetGrid_CRUD_ToolbarTop($("#gridDED").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDED").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDED").data("kendoGrid"), dataSource);
    $("#gridDED").data("kendoGrid").dataSource.read();

}

var fn_Reg_Info_Emb_Dis = function (pJson) {

}