
var Permisos;
var xIdIngreso = 0;
let xidPlanta = 0;
let xidclie = 0;
let xidcata = 0;
let xidCorte = 0;
let StrId = "";
let pkIdCarrito = 0;
let pkIdHb = 0;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selección de cliente");
    //crear combobox Planta
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Selección de Planta")
    //crear combobox catalogo 
    $("#cmbFm").mlcFmCatalogo();
    $("#cmbCorte").mlcCorteCatalogo();
    // Agregar Corte
    KdoButton($("#btnEntProd"), "gear");
    KdoButton($("#btnPrep"), "track-changes-accept");
    KdoButton($("#btnCreaCarrito"), "cart k-icon-xl");
    $("#btnCreaCarrito").removeClass("k-button-icon");
    // crear detakle de preparado
    KdoButton($("#btnDetallePrep"), "zoom-in");
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
                    url: function () { return TSM_Web_APi + `HojasBandeosMercancias/GetBultosSinPreparar/${xidcata}/${xidCorte}/${xidPlanta}`; }
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
        height: 665,
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
                command: [
                    {
                        name: "b_impresion",
                        text: " ",
                        click: fn_VinetaImp,
                        imageClass: "k-i-print m-0"
                    }
                ],
                width: "70px"
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
                url: function () { return TSM_Web_APi + "CarritosDetallesMercancias/GetCarritosEnPreparacion/" + `${xidcata}/${xidPlanta}` },
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
                    KdoButtonEnable($("#btnCreaCarrito"), false);
                } else {
                    KdoButtonEnable($("#btnCreaCarrito"), true);
                }
                pkIdCarrito = 0;
                pkIdHb = 0;
            } else {
                pkIdCarrito = e.response[0].IdCarrito;
                pkIdHb = e.response[0].IdHojaBandeo;
            }
            Grid_requestEnd;
        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" }
        ],
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
            { field: "NoDocumento", title: "Bulto/Rollo:", footerTemplate: "Total"},
            { field: "Corte", title: "Corte" },
            { field: "Talla", title: "Talla" },
            { field: "FM", title: "FM" },
            { field: "Diseno", title: "Diseño", hidden: true },
            { field: "Estilo", title: "Estilo", hidden: true },
            { field: "Color", title: "Color", hidden: true },
            { field: "Cantidad", title: "Cantidad", footerTemplate: "#: data.Cantidad ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "Estado", title: "Estado", hidden:true }
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
            fn: { fnclose: "fn_Close_CarritoEnt", fnLoad: "fn_Ini_CarritoEnt", fnReg: "fn_Reg_CarritoEnt", fnActi:"fn_focusCarritoEnt" }
        };

        fn_GenLoadModalWindow(strjson);
    });


    $("#btnDetallePrep").click(function () {
        let strjson = {
            config: [{
                Div: "vdPreparado",
                Vista: "~/Views/PreparacionCarrito/_CarritosFinalizados.cshtml",
                Js: "CarritosFinalizados.js",
                Titulo: "Detalle de preparado: " + `${ KdoCmbGetText($("#cmbPlanta"))}`,
                Height: "80%",
                Width: "90%",
                MinWidth: "30%"
            }],
            Param: { pcIdCatalogo: KdoMultiColumnCmbGetValue($("#cmbFm")), pcCliente: KdoCmbGetValue($("#cmbCliente")), pcPlanta: KdoCmbGetValue($("#cmbPlanta")) },
            fn: { fnclose: "fn_Close_CarritosFin", fnLoad: "fn_Ini_CarritosFin", fnReg: "fn_Reg_CarritosFin", fnActi:"" }
        };

        fn_GenLoadModalWindow(strjson);
    });

    $("#btnCreaCarrito").click(function () {
        var treeList = $("#treelist").data("kendoTreeList");
        var row = treeList.select();
        let BultosPreCar = [];
        let Lineas = [];
        let Lcortes = [];
        if (row.length > 0) {
            $.each(row, function (index, elemento) {
                let data = treeList.dataItem(elemento);
                if (data.IdPadre !== null) {
                    BultosPreCar.push(
                        data.IdMercancia
                    );
                    Lineas.push({ id: data.Id, idPadre: data.IdHojaBandeo });
                }
            });

            Lcortes = [...new Map(Lineas.map(item =>
                [item['idPadre'], item])).values()].map(p => p.idPadre);

            if (Lcortes.length > 1) {
                $("#kendoNotificaciones").data("kendoNotification").show("No es Permitido seleccionar bultos de varios cortes", "error");
                return;
            }

            if (Lineas.filter(v => v.idPadre !== pkIdHb).length > 0 &&  pkIdHb !== 0) {
                $("#kendoNotificaciones").data("kendoNotification").show("No es Permitido bultos que no pertenezcan al corte que está en preparación de carrito", "error");
                return;
            }

            kendo.ui.progress($(document.body), true);

            $.ajax({
                url: TSM_Web_APi + "Carritos/CrearCarrito",
                method: "POST",
                dataType: "json",
                data: JSON.stringify({
                    IdCatalogoDiseno: KdoMultiColumnCmbGetValue($("#cmbFm")),
                    IdUsuario: getUser(),
                    IdBulto: BultosPreCar
                }),
                contentType: "application/json; charset=utf-8",
                success: function (datos) {
                    $("#treelist").data("kendoTreeList").dataSource.read();
                    $("#gridDetCortePre").data("kendoGrid").dataSource.read();
                    RequestEndMsg(datos, "Post");
                },
                error: function (data) {
                    ErrorMsg(data);
                },
                complete: function () {
                    kendo.ui.progress($(document.body), false);
                }
            });
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione uno o mas bultos", "error");
        }
    });

    ////Preparar Carrito
    $("#btnPrep").click(function () {
        if (pkIdCarrito > 0) {
            kendo.ui.progress($(document.body), true);
            $.ajax({
                url: TSM_Web_APi + "Carritos/UpdCarritosCambiosEstados/",
                method: "POST",
                dataType: "json",
                data: JSON.stringify({
                    Id: pkIdCarrito,
                    EstadoSiguiente: "FINALIZADO",
                    Motivo: "CARRITO EN PREPARACION PASA A FINALIZADO"
                }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    RequestEndMsg(data, "Post");
                    $("#gridDetCortePre").data("kendoGrid").dataSource.read();
                },
                error: function (data) {
                    ErrorMsg(data);
                },
                complete: function () {
                    kendo.ui.progress($(document.body), false);
                }
            })
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("No hay carrito generado", "error");
        }
    });

    //compeltar campos de cabecera

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidcata = 0;
            xidCorte = 0;
            xidPlanta = 0;
            KdoCmbSetValue($("#cmbPlanta"), "");
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
        }
    });

    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidcata = 0;
            xidCorte = 0;
            xidPlanta = 0;
            KdoCmbSetValue($("#cmbPlanta"), "");
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        }
        else {
            xidcata = 0;
            xidCorte = 0;
            xidPlanta = 0;
            KdoCmbSetValue($("#cmbPlanta"), "");
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);

        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidcata = 0;
            xidCorte = 0;
            xidPlanta = 0;
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), false);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidcata = 0;
            xidCorte = 0;
            xidPlanta = this.dataItem(e.item.index()).IdPlanta;
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), true);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        }
        else {
            xidcata = 0;
            xidCorte = 0;
            xidPlanta = 0;
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
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
            xidCorte = 0;
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read().then(function () {
                fn_readonly();
            });
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), true);
            KdoButtonEnable($("#btnEntProd"), true);
            KdoButtonEnable($("#btnPrep"), true);
            KdoButtonEnable($("#btnCreaCarrito"), true);


        } else {
            xidcata = 0;
            xidCorte = 0;
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), KdoCmbGetValue($("#cmbCliente")) === null ? false : true);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
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
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            $("#treelist").data("kendoTreeList").dataSource.read();
            $("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnDetallePrep"), KdoCmbGetValue($("#cmbCliente")) === null ? false : true);
            KdoButtonEnable($("#btnEntProd"), false);
            KdoButtonEnable($("#btnPrep"), false);
            KdoButtonEnable($("#btnCreaCarrito"), false);
        }
        else {
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
        }
    });

    $("#cmbCorte").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xidCorte = this.dataItem(e.item.index()).IdHojaBandeo;
            $("#treelist").data("kendoTreeList").dataSource.read();

        } else {
            xidCorte = 0;
            $("#treelist").data("kendoTreeList").dataSource.read();
        }
    });

    $("#cmbCorte").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbCorte").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdHojaBandeo === Number(this.value()));
        if (data === undefined) {
            xidCorte = 0;
            $("#treelist").data("kendoTreeList").dataSource.read();
        }
    });
});

var fn_readonly = () =>
{
    var treeList = $("#treelist").data("kendoTreeList");
    var data = treeList.dataItem("tbody>tr:eq(0)");

    $("#txtDiseño").val(data.Diseno);
    $("#txtEstilo").val(data.Estilo);
}

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
                            url: function (datos) { return TSM_Web_APi + "HojasBandeosDisenos/GetDisenoByClientePlanta/" + `${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente"))}/${KdoCmbGetValue($("#cmbPlanta")) === null ? 0 : KdoCmbGetValue($("#cmbPlanta"))}`; },
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
                                return TSM_Web_APi + "HojasBandeos/GetHojasBandeobyFM/" + `${KdoMultiColumnCmbGetValue($("#cmbFm")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbFm"))}/${xidPlanta}`;
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "Corte", title: "Corte", width: 300 },
                    { field: "NoReferencia", title: "Código FM", width: 300 },
                    { field: "NombreDiseño", title: "Nombre del Diseño", width: 300 },
                    { field: "EstiloDiseno", title: "Estilo del Diseño", width: 300 }
                ]
            });
        });
    }
});