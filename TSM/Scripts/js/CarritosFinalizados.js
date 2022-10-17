var Permisos;
let xIdcat = 0;
let xIdclie = 0;
let xopc = 0;


var fn_Ini_CarritosFin = (xjson) => {

    let UrlPl = TSM_Web_APi + "Carritos/GetCarritosPreparados";

    xIdcat = xjson.pcIdCatalogo === null ? 0 : xjson.pcIdCatalogo;
    xIdclie = xjson.pcCliente;

    $('#chkVerTodo').prop('checked', xjson.pcIdCatalogo === null ? 1 : 0);
    KdoComboBoxbyData($("#cmbOpcion"), "[]", "Nombre", "IdOpcion", "Seleccione ....");

    $("#cmbOpcion").data("kendoComboBox").dataSource.pushCreate([
        { IdOpcion: 1, Nombre: "Carritos finalizados en este corte" },
        { IdOpcion: 2, Nombre: "Carritos finalizados de todos los cortes" },
        { IdOpcion: 3, Nombre: "Carritos entregados en este corte" },
        { IdOpcion: 4, Nombre: "Carritos entregados en todos los cortes" }
    ]);

    KdoCmbSetValue($("#cmbOpcion"), "");
    $("#cmbOpcion").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xopc = 0;
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbOpcion").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xopc = this.dataItem(e.item.index()).IdOpcion;
            $("#grid").data("kendoGrid").dataSource.read();
        }
        else {
            xopc = 0;
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });

    //1. defincion de la modal
    Fn_VistaCambioEstado($("#vCambioEstado"), function () { return fn_CloseCmb(); });

    //Codigo del Grid
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) {
                    return TSM_Web_APi + "Carritos/GetCarritosPreparados/" + `${xIdcat}/${xopc}/${xIdclie}` },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "Carritos/" + datos.IdCarrito; },
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdCarrito",
                fields: {
                    IdCarrito: { type: "number" },
                    IdCatalogoDiseno: { type: "number" },
                    FM: { type: "string" },
                    Corte: { type: "string" },
                    Diseno: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    Color: { type: "string" },
                    Tallas: { type: "Tallas" },
                    CantidadBultos: { type: "number" },
                    IdCatalogoMaquina: { type: "number" },
                    Maquina: { type: "string" },
                    Preparador: { type: "string" },
                    FechaPreparacion: { type: "date" },
                    Estado: { type: "string" },
                    NomEstado: { type: "string" }
                }
            }
        },
        sort: { field: "IdCarrito", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
     
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCarrito", title: "No. Carrito", sortable: { initialDirection: "asc" }},
            { field: "IdCatalogoDiseno", title: "Cod. CatalogoDiseno", hidden: true },
            { field: "FM", title: "FM" },
            { field: "Corte", title: "Corte" },
            { field: "Diseno", title: "Diseño" },
            { field: "EstiloDiseno", title: "Estilo Diseno" },
            { field: "Color", title: "Color" },
            { field: "Tallas", title: "Tallas" },
            { field: "CantidadBultos", title: "Cantidad Bultos" },
            { field: "IdCatalogoMaquina", title: "cod. CatalogoMaquina", hidden:true },
            { field: "Maquina", title: "Máquina" },
            { field: "Preparador", title: "Preparador" },
            { field: "FechaPreparacion", title: "Fecha de Preparación", format: "{0: dd/MM/yyyy}" },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NomEstado", title: "Estado" },
            {
                field: "btnEntrega", title: "&nbsp;",
                command: {
                    name: "btnEntrega",
                    iconClass: "k-icon k-i-gear m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) { // datos recibe las columnas del grid
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        Fn_VistaCambioEstadoMostrar("Carritos", dataItem.Estado, TSM_Web_APi + "Carritos/UpdCarritosCambiosEstados", "", dataItem.IdCarrito, undefined, function () { return fn_CloseCmb(); },false);
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
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");


    $("#chkVerTodo").click(function () {
        $("#grid").data("kendoGrid").dataSource.read();
    });


}

var fn_Reg_CarritosFin = (xjson) => {
    xIdcat = xjson.pcIdCatalogo === null ? 0 : xjson.pcIdCatalogo;
    xIdclie = xjson.pcCliente;
    xopc = 0;
    KdoCmbSetValue($("#cmbOpcion"), "");
    $("#grid").data("kendoGrid").dataSource.read();
}

var fn_CloseCmb = () => {
    $("#grid").data("kendoGrid").dataSource.read();
};
