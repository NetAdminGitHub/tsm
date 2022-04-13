
var Permisos;
var xIdIngreso = 0;
let xidclie = 0;
let xidcata = 0;
let StrId = "";

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    //crear combobox catalogo 
    $("#cmbFm").mlcFmCatalogo();
    // Agregar Corte
    KdoButton($("#btnEntProd"), "gear", "Agregar Corte");
    KdoButton($("#btnPrep"), "gear", "Preparar");
    KdoButton($("#btnCreaCarrito"), "arrow-60-right", "Crear carrito");
    // crear detakle de preparado
    KdoButton($("#btnDetallePrep"), "gear", "Detalle de Preparado");
    KdoButtonEnable($("#btnDetallePrep"), false);
    KdoButtonEnable($("#btnEntProd"), false);
    KdoButtonEnable($("#btnPrep"), false);
    KdoButtonEnable($("#btnCreaCarrito"), false);

    //#region crear bultos si preparar
    
    //CONFIGURACION DEL GRID,CAMPOS

    $("#treelist").kendoTreeList({
        dataSource: new kendo.data.TreeListDataSource({
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "HojasBandeosMercancias/GetBultosSinPreparar/" + `${xidcata}` }
                }
            },
            schema: {
                model: {
                    id: "Id",
                    parentId: "IdPadre",
                    fields: {
                        Id: { field: "Id", type: "number" },
                        IdPadre: { field: "IdPadre", nullable: true },
                        Corte: { field: "Corte", type: "string" },
                        Talla: { field: "Talla", type: "string" },
                        NoDocumento: { field: "NoDocumento", type: "string" },
                        Cantidad: { field: "Cantidad", type: "number" },
                        FM: { field: "FM", type: "string" },
                        Diseno: { field: "Diseno", type: "string" },
                        Estilo: { field: "Estilo", type: "string" }
                    },
                    expanded: false
                }
            }
        }),
        height: 600,
        columns: [
            { selectable: true, width: "65px", includeChildren: true  },
            { field: "Id", title: "Id", hidden: true },
            { field: "IdPadre", title: "Id Padre", hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "Talla", title: "Talla" },
            { field: "NoDocumento", title: "Correlativo" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "FM", title: "FM" },
            { field: "Diseno", title: "Diseño" },
            { field: "Estilo", title: "Estilo" },
            {
                command: [
                    { 
                        name: "b_impresion",
                        text: " ",
                        click: fn_VinetaImp,
                        imageClass: "k-i-print"
                    }
                ]
            }
        ]
    });

    $("#treelist").data("kendoTreeList").dataSource.read();

    //#endregion 

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


    //crear entrega a prod
    $("#btnEntProd").click(function () {
        let strjson = {
            config: [{
                Div: "vEntreTela",
                Vista: "~/Views/PreparacionCarrito/_CarritoEntregaTela.cshtml",
                Js: "CarritoEntrega.js",
                Titulo: "Entrega de Tela",
                Height: "90%",
                Width: "50%",
                MinWidth: "30%"
            }],
            Param: { pcIdCatalogo: KdoMultiColumnCmbGetValue($("#cmbFm")), pcCliente: KdoCmbGetValue($("#cmbCliente")), divmod: "vEntreTela" },
            fn: { fnclose: "fn_Close_CarritoEnt", fnLoad: "fn_Ini_CarritoEnt", fnReg: "fn_Reg_CarritoEnt" }
        };

        fn_GenLoadModal(strjson);
    });

   
    $("#btnDetallePrep").click(function () {
        let strjson = {
            config: [{
                Div: "vdPreparado",
                Vista: "~/Views/PreparacionCarrito/_CarritosFinalizados.cshtml",
                Js: "CarritosFinalizados.js",
                Titulo: "Detalle de preparado",
                Height: "70%",
                Width: "80%",
                MinWidth: "30%"
            }],
            Param: { pcIdCatalogo: KdoMultiColumnCmbGetValue($("#cmbFm")), pcCliente: KdoCmbGetValue($("#cmbCliente")) },
            fn: { fnclose: "fn_Close_CarritosFin", fnLoad: "fn_Ini_CarritosFin", fnReg: "fn_Reg_CarritosFin" }
        };

        fn_GenLoadModal(strjson);
    });

    $("#btnCreaCarrito").click(function () {
        var treeList = $("#treelist").data("kendoTreeList");
        var row = treeList.select();
        let BultosPreCar = [];
        if (row.length > 0) {
            $.each(row, function (index, elemento) {
                let data = treeList.dataItem(elemento);
                if (data.IdPadre !== null) {
                    BultosPreCar.push({
                        id: data.id
                    });
                }
            });
        }
    });

    //Preparar Carrito
    $("#btnPrep").click(function () {
        let xidCarrito = 1;
        let xEstadoF = "FINALIZADO";
        let xMotivo = "";
        kendo.ui.progress($(document.body), true);
        $.ajax({
            url = TSM_Web_APi + "Carritos/UpdCarritosCambiosEstados/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                xidCarrito,
                xEstadoF,
                xMotivo
            }),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                alert('Carrito Finalizado');
            },
            error: function (data) {
                ErrorMsg(data);
                result = false;
            },
            complete: function () {
                kendo.ui.progress($(document.body), false);
            }
        })
    });

    //compeltar campos de cabecera



    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidcata = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        }
    });

    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidcata = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        }
        else {
            xidcata = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);

        }
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xidcata = this.dataItem(e.item.index()).IdCatalogoDiseno;
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), true);
            KdoButtonEnable($("#btnEntProd"), true);
            KdoButtonEnable($("#btnPrep"), true);
            KdoButtonEnable($("#btnCreaCarrito"), true);

        } else {
            xidcata = 0;
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        }
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbFm").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xidcata = 0
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        } 

    });

});

var fn_Close_CarritosFin = (xjson) => {
    $("#gridDetCortePre").data("kendoGrid").dataSource.read()
    $("#treelist").data("kendoTreeList").dataSource.read();
}
var fn_Close_CarritoEnt = (xjson) => {
    $("#gridDetCortePre").data("kendoGrid").dataSource.read()
    $("#treelist").data("kendoTreeList").dataSource.read();

}
let fn_Refrescar_Ingreso = () => {
    if (Bandeo !== null && xIdIngreso === 0) {
        kdoNumericSetValue($("#num_Ingreso"), Bandeo[0].IdIngreso);
        xIdIngreso = Bandeo[0].IdIngreso;

        window.history.pushState('', '', "/IngresoMercancias/" + `${xIdClienteIng}/${xIdIngreso}`);
    }

    $("#gridDetCorte").data("kendoGrid").dataSource.read();
};

let fn_VinetaImp = () => {
    let result = false;
    let vineta = [];
    let JsonVineta = [];
    let Lineas = [];
    let Cortes = [];
    var treeList = $("#treelist").data("kendoTreeList");
    var row = treeList.select();
    kendo.ui.progress($(document.body), true);
    if (row.length > 0) {
        $.each(row, function (index, elemento) {
            let data = treeList.dataItem(elemento);
            if (data.IdPadre !== null) {
                Lineas.push({
                    id: data.Id,
                    idPadre:data.IdPadre
                });
               
            }
        });

        Cortes = [...new Map(Lineas.map(item =>
            [item['idPadre'], item])).values()].map(p => p.idPadre);

        $.each(Cortes, function (index, elemento) {

            let Bultos = [];
            $.each((Lineas.filter(v => v.idPadre === elemento).map(p => p.id)), function (index, elemento) {
                Bultos.push({
                    IdMercancia: Number(elemento)
                });
            });

            vineta.push({
                IdHojaBandeo: elemento,
                IdCatalogoDiseno: KdoMultiColumnCmbGetValue($("#cmbFm")),
                Mercancias: Bultos
            });
        });
        kendo.ui.progress($(document.body), false);
        JsonVineta = JSON.stringify({ Vineta: vineta });
        result = fn_GeneraVinetasRep(JsonVineta);

    } else {
        result = false;
        $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar al menos un elemento de la lista.", "error");
        kendo.ui.progress($(document.body), false);
    }
    return result;
}

let fn_GeneraVinetasRep = (strVineta) => {
    let result = false;
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: window.location.origin + "/Reportes/Vinetas/",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            rptName: "crptVinetasMercancias",
            controlador: "VinetasMercancias",
            accion: "Generar",
            Vineta: strVineta,
            id: 1
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            $("#treelist").data("kendoTreeList").dataSource.read();
            let MiRpt = window.open(datos, "_blank");

            if (!MiRpt)
                $("#kendoNotificaciones").data("kendoNotification").show("Bloqueo de ventanas emergentes activado.<br /><br />Debe otorgar permisos para ver el reporte.", "error");

            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            ErrorMsg(data);
            result = false;
            kendo.ui.progress($(document.body), false);

        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    return result;

}

fPermisos = function (datos) {
    Permisos = datos;
   
}

// contro fm multicolum

$.fn.extend({
    mlcFmCatalogo: function () {
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
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetFiltrobyCliente/" + `${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente")) }`; },
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
    }
});