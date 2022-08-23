﻿
var Permisos;
var xIdIngreso = 0;
let xidclie = 0;
let xidcata = 0;
let xidCorte = 0;
let StrId = "";
let pkIdCarrito = 0;
let pkIdHb = 0;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");

    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");

    Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${0}`, "Nombre2", "IdMarca", "Seleccione..");

    Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${0}`, "PL", "IdListaEmpaque", "Seleccione..");

    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    KdoCmbSetValue($("#CmbServicio"), sessionStorage.getItem("cFOT_CmbServicio") === null ? "" : sessionStorage.getItem("cFOT_CmbServicio"));

    //crear combobox catalogo 
    $("#cmbFm").mlcFmCatalogo();
    $("#cmbCorte").mlcCorteCatalogo();
    // Agregar Corte
    KdoButton($("#btnSolicitarProducto"), "plus-outline");
    // crear detakle de preparado
    KdoButtonEnable($("#btnSolicitarProducto"), false);
    // Agregar Corte
    KdoButton($("#btnCrearOrdenDespacho"), "save");
    // crear detakle de preparado
    KdoButtonEnable($("#btnCrearOrdenDespacho"), false);

    //#region crear bultos si preparar

    //CONFIGURACION DEL GRID,CAMPOS

    $("#treelist").kendoGrid({
        dataSource: new kendo.data.TreeListDataSource({
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + `HojasBandeosMercancias/GetBultosSinPreparar/${xidcata}/${xidCorte}`; }
                }
            },
            schema: {
                model: {
                    id: "Id",
                    parentId: "IdPadre",
                    fields: {
                        Id: { field: "Id", type: "number" },
                        IdPadre: { field: "IdPadre", nullable: true },
                        IdHojaBandeo: { field: "IdHojaBandeo" },
                        IdMercancia: { field: "IdMercancia", nullable: true },
                        Corte: { field: "Corte", type: "string" },
                        Talla: { field: "Talla", type: "string" },
                        NoDocumento: { field: "NoDocumento", type: "string" },
                        FM: { field: "FM", type: "string" },
                        Diseno: { field: "Diseno", type: "string" },
                        Estilo: { field: "Estilo", type: "string" },
                        Cantidad: { field: "Cantidad", type: "number" }
                    }
                }
            }
        }),
        height: 660,
        messages: {
            noRows: "No hay datos dsiponibles"
        },
        columns: [
            { selectable: true, width: "35px", includeChildren: true, name: "select" },
            { field: "Id", title: "Id", hidden: true },
            { field: "IdPadre", title: "Id Padre", hidden: true },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "IdMercancia", title: "Id Mercancia", hidden: true },
            { field: "Corte", title: "Corte", hidden: true },
            { field: "NoDocumento", title: "Correlativo" },
            { field: "Talla", title: "Talla" },
            { field: "FM", title: "FM", hidden: true },
            { field: "Diseno", title: "Diseño", hidden: true },
            { field: "Estilo", title: "Estilo", hidden: true },
            { field: "Cantidad", title: "Cantidad" },
            {
                title: "",
                template: '<button class="k-button k-button-icon" name="b_search" id="b_search"><span class="k-icon k-i-search"></span></button>',
                width: 70
            }
        ]
    });

    $("#treelist").data("kendoGrid").dataSource.read();

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
        requestEnd: function (e) {
            if (e.response.length === 0) {
                if (KdoCmbGetValue($("#cmbCliente")) === null || KdoMultiColumnCmbGetValue($("#cmbFm")) === null) {
                } else {
                }
                pkIdCarrito = 0;
                pkIdHb = 0;
            } else {
                pkIdCarrito = e.response[0].IdCarrito;
                pkIdHb = e.response[0].IdHojaBandeo;
            }
            Grid_requestEnd;
        },
        error: function (e) {

            Grid_error;
        },
        schema: {
            model: {
                id: "IdCarrito",
                fields: {
                    IdCarrito: { type: "number" },
                    IdMercancia: { type: "number" },
                    IdCatalogoDiseno: { type: "number" },
                    NoDocumento: { type: "string" },
                    Corte: { field: "Corte", type: "string" },
                    FM: { field: "FM", type: "string" },
                    Diseno: { field: "Diseno", type: "string" },
                    Estilo: { field: "Estilo", type: "string" },
                    Color: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    Estado: { type: "string" },
                    IdHojaBandeo: { type: "number" }
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
            { field: "NoDocumento", title: "Bulto/Rollo:" },
            { field: "Corte", title: "Corte" },
            { field: "Talla", title: "Talla" },
            { field: "FM", title: "FM" },
            { field: "Diseno", title: "Diseño", hidden: true },
            { field: "Estilo", title: "Estilo", hidden: true },
            { field: "Color", title: "Color", hidden: true },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Estado", title: "Estado", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDetCortePre").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659);
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
    $("#btnSolicitarProducto").click(function () {
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
            fn: { fnclose: "fn_Close_CarritoEnt", fnLoad: "fn_Ini_CarritoEnt", fnReg: "fn_Reg_CarritoEnt", fnActi: "fn_focusCarritoEnt" }
        };

        fn_GenLoadModalWindow(strjson);
    });


    //compeltar campos de cabecera

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidcata = 0;
            xidCorte = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoGrid").dataSource.read();
            //$("#gridDetCortePre").data("kendoGrid").dataSource.read();
            Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${0}`, "Nombre2", "IdMarca", "Seleccione..");
            $("#cmbMarca").data("kendoComboBox").value("");
            Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${0}`, "PL", "IdListaEmpaque", "Seleccione..");
            $("#cmbPL").data("kendoComboBox").value("");
            KdoButtonEnable($("#btnSolicitarProducto"), false);
            /*$("#txtDiseño").val("");
            $("#txtEstilo").val("");*/
        }
    });

    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidclie = this.dataItem(e.item.index()).IdCliente;
            xidcata = 0;
            xidCorte = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbMarca").data("kendoComboBox").value("");
            Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${xidclie}`, "Nombre2", "IdMarca", "Seleccione..");
            Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${xidclie}`, "PL", "IdListaEmpaque", "Seleccione..");
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
            $("#treelist").data("kendoGrid").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
        }
        else {
            xidcata = 0;
            xidCorte = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${0}`, "Nombre2", "IdMarca", "Seleccione..");
            $("#cmbMarca").data("kendoComboBox").value("");
            Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${0}`, "PL", "IdListaEmpaque", "Seleccione..");
            $("#cmbPL").data("kendoComboBox").value("");
            $("#treelist").data("kendoGrid").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
        }
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xidcata = this.dataItem(e.item.index()).IdCatalogoDiseno;
            xidCorte = 0;
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                fn_readonly();
            });
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), true);
        } else {
            xidcata = 0;
            xidCorte = 0;
            $("#treelist").data("kendoGrid").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
        }
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbFm").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xidcata = 0;
            xidCorte = 0;
            $("#treelist").data("kendoGrid").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
        }
        else {
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
        }
    });

    $("#cmbCorte").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xidCorte = this.dataItem(e.item.index()).IdHojaBandeo;
            $("#treelist").data("kendoGrid").dataSource.read();

        } else {
            xidCorte = 0;
            $("#treelist").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbCorte").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbCorte").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdHojaBandeo === Number(this.value()));
        if (data === undefined) {
            xidCorte = 0;
            $("#treelist").data("kendoGrid").dataSource.read();
        }
    });
});

var fn_readonly = () => {
    var treeList = $("#treelist").data("kendoGrid");
    var data = treeList.dataItem("tbody>tr:eq(0)");
}

var fn_Close_CarritosFin = (xjson) => {
    $("#gridDetCortePre").data("kendoGrid").dataSource.read()
    $("#treelist").data("kendoGrid").dataSource.read();
}
var fn_Close_CarritoEnt = (xjson) => {
    $("#gridDetCortePre").data("kendoGrid").dataSource.read()
    $("#treelist").data("kendoGrid").dataSource.read();

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
    var treeList = $("#treelist").data("kendoGrid");
    var row = treeList.select();
    kendo.ui.progress($(document.body), true);
    if (row.length > 0) {
        $.each(row, function (index, elemento) {
            let data = treeList.dataItem(elemento);
            if (data.IdPadre !== null) {
                Lineas.push({
                    id: data.IdMercancia,
                    idPadre: data.IdHojaBandeo
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
            $("#treelist").data("kendoGrid").dataSource.read();
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
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetFiltrobyCliente/" + `${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente"))}`; },
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
    mlcCorteCatalogo: function () {
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
                                return TSM_Web_APi + "HojasBandeos/GetHojasBandeobyFM/" + `${KdoMultiColumnCmbGetValue($("#cmbFm")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbFm"))}`;
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