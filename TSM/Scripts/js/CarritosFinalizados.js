var Permisos;
let xIdcat = 0;
let xIdclie = 0;
let xidPlantaMod = 0;
let xidCorteMod = 0;
let xestado = "";

var fn_Ini_CarritosFin = (xjson) => {

    let UrlPl = TSM_Web_APi + "Carritos/GetCarritosPreparados";
    Kendo_CmbFiltrarGrid($("#cmbEstado"), TSM_Web_APi + "Estados/carritos", "Nombre", "Estado", "Selección de Estado");

    xIdcat = 0;
    xIdclie = xjson.pcCliente;
    xidPlantaMod = xjson.pcPlanta;

    $("#cmbFmModal").mlcFmCatalogoModal();
    $("#cmbCorteModal").mlcCorteCatalogoModal();

    $("#cmbFmModal").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xIdcat = this.dataItem(e.item.index()).IdCatalogoDiseno;
            xidCorteMod = 0;
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"),"")
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").dataSource.read();
            $("#grid").data("kendoGrid").dataSource.read();
           
        } else {
            xIdcat = 0;
            xidCorteMod = 0;
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "")
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").dataSource.read();
            $("#grid").data("kendoGrid").dataSource.read();
           
        }
    });

    $("#cmbFmModal").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbFmModal").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xIdcat = 0;
            xidCorteMod = 0;
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "")
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").dataSource.read();
            $("#grid").data("kendoGrid").dataSource.read();
          
        }
        else {
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "")
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorteModal").data("kendoMultiColumnComboBox").dataSource.read();
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbCorteModal").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xidCorteMod = this.dataItem(e.item.index()).IdHojaBandeo;
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "");
            $("#grid").data("kendoGrid").dataSource.read();

        } else {
            xidCorteMod = 0;
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "");
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbCorteModal").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbCorteModal").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdHojaBandeo === Number(this.value()));
        if (data === undefined) {
            xidCorteMod = 0;
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "");
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbEstado").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xestado = "";
            KdoCmbSetValue($("#cmbEstado"), "");
            $("#grid").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbEstado").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xestado = this.dataItem(e.item.index()).Estado;
            $("#grid").data("kendoGrid").dataSource.read();
        }
        else {
            xestado = "";
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
                url: TSM_Web_APi + "Carritos/GetCarritosPreparados",
                contentType: "application/json; charset=utf-8",
                type: "POST"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "Carritos/" + datos.IdCarrito; },
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                } else {
                    return kendo.stringify({
                        IdCliente: xIdclie,
                        IdPlanta: xidPlantaMod,
                        IdCatalogo: xIdcat,
                        IdHojaBandeo: xidCorteMod,
                        Estado: xestado
                    });
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


}

var fn_Reg_CarritosFin = (xjson) => {
    xIdcat = 0;
    xIdclie = xjson.pcCliente;
    xidPlantaMod = xjson.pcPlanta;
    xidCorteMod = 0;
    xestado = ""
    KdoCmbSetValue($("#cmbEstado"), "");
    $("#cmbCorteModal").data("kendoMultiColumnComboBox").value("");
    $("#cmbFmModal").data("kendoMultiColumnComboBox").value("");
    $("#cmbCorteModal").data("kendoMultiColumnComboBox").dataSource.read();
    $("#cmbFmModal").data("kendoMultiColumnComboBox").dataSource.read();
    $("#grid").data("kendoGrid").dataSource.read();
}

var fn_CloseCmb = () => {
    $("#grid").data("kendoGrid").dataSource.read();
};

$.fn.extend({
    mlcFmCatalogoModal: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "HojasBandeosDisenos/GetDisenoByClientePlanta/" + `${xIdclie}/${xidPlantaMod}`; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    },
    mlcCorteCatalogoModal: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Corte",
                dataValueField: "IdHojaBandeo",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de Corte",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "HojasBandeos/GetHojasBandeoDisenosByFm/" + `${KdoMultiColumnCmbGetValue($("#cmbFmModal")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbFmModal"))}/${xidPlantaMod}`;
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "Corte", title: "Corte", width: 300 },
                    { field: "NoDocumento", title: "No Documento", width: 300 },
                    { field: "NoReferencia", title: "No FM", width: 300 }
                ]
            });
        });
    }
});