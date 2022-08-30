var Gdet;
var Permisos;
var xIdIngreso = 0;
var StrId = "";
var pkIdCarrito = 0;
var pkIdHb = 0;
var bgd = 0;

var xidcata = 0;
var xidCorte = 0;
var xidclie = 0;
var xidPlanta = 0;
var xidMarca = 0;
var xidListaEmpaque = 0;
var xidServicio = 0;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");

    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");

    Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${xidclie}`, "Nombre2", "IdMarca", "Seleccione..");

    Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${xidclie}`, "PL", "IdListaEmpaque", "Seleccione..");

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

    let dTree = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: TSM_Web_APi + "HojasBandeos/GetCortesPorDespachar/",
                    data: JSON.stringify({
                            IdCliente: xidclie,
                            IdPlanta: xidPlanta,
                            IdMarca: xidMarca,
                            IdCatalogo: xidcata,
                            IdHojaBandeo: xidCorte,
                            IdListaEmpaque: xidListaEmpaque,
                            IdServicio: xidServicio
                        }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                        kendo.ui.progress($(document.body), false);
                    },
                    error: function (result) {
                        options.error(result);
                        kendo.ui.progress($(document.body), false);
                    }
                });
            }
        },
        schema: {
            model: {
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { field: "IdHojaBandeo", type: "number" },
                    Corte: { field: "Corte", type: "string" },
                    IdCatalogoDiseno: { field: "IdCatalogoDiseno", type: "number" },
                    TotalTallas: { field: "TotalTallas", type: "string" },
                    TotaBultos: { field: "TotaBultos", type: "number" },
                    ParteDecorada: { field: "ParteDecorada", type: "string" },
                    CantidadIngreso: { field: "CantidadIngreso", type: "string" },
                    CantidadDisponible: { field: "CantidadDisponible", type: "string" },
                    CantidadDespacho: { field: "CantidadDespacho", type: "number" }
                }
            }
        }
    });

    $("#treelist").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        height: 660,
        messages: {
            noRows: "No hay datos dsiponibles"
        },
        columns: [
            { selectable: true, width: "35px" },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "Corte", title: "Corte" },
            {field: "IdCatalogoDiseno", title: "IdCatalogoDiseno", hidden: true, attributes: { "class": "selCata" } },
            { field: "TotalTallas", title: "Total Tallas"},
            { field: "TotaBultos", title: "Bultos" },
            { field: "ParteDecorada", title: "Parte Decorada" },
            { field: "CantidadIngreso", title: "Cantidad Ingreso" },
            { field: "CantidadDisponible", title: "Cantidad Disponible"},
            { field: "CantidadDespacho", title: "Cantidad Despacho" },
            {
                command: [
                    {
                        name: "b_search",
                        text: " ",
                        click: getInfoGeneral,
                        iconClass: "k-icon k-i-search m-0"
                    }
                ],
                width: "70px"
            }
        ]
    });

    //#endregion

    SetGrid($("#treelist").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659, "multiple");
    Set_Grid_DataSource($("#treelist").data("kendoGrid"), dTree);

    // gCHFor detalle
    function detailInit(e) {

        var vidhb = e.data.IdHojaBandeo === null ? 0 : e.data.IdHojaBandeo;
        var VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "HojasBandeos/GetCortesPorDespacharDet/" + vidhb; },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            requestEnd: function (e) {
                Grid_requestEnd(e);
            },
            error: Grid_error,
            schema: {
                model: {
                    id: "IdHojaBandeo",
                    fields: {
                        IdHojaBandeo: { type: "number" },
                        Corte: { type: "string" },
                        Tallas: { type: "string" },
                        IdMercancia: { type: "number" },
                        CantidadIngreso: { type: "number" },
                        CantidadDisponible: { type: "number" },
                        CantidadDespacho: { type: "number" }
                    }
                }
            },
            filter: { field: "IdHojaBandeo", operator: "eq", value: e.data.IdHojaBandeo }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdHojaBandeo", title: "Id Hoja Bandeo", hidden: true },
                { field: "Corte", title: "Corte", hidden: true },
                { field: "Tallas", title: "Tallas" },
                { field: "IdMercancia", title: "Id Mercancia", hidden: true },
                { field: "CantidadIngreso", title: "Cantidad Ingreso" },
                { field: "CantidadDisponible", title: "Cantidad Disponible" },
                { field: "CantidadDespacho", title: "Cantidad Despacho" }
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidhb);

        var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            //Grid_SetSelectRow(g, selectedRowsTec);

            Gdet = g.data("kendoGrid");

        });

        /*g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });*/
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0);
        SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
        Set_Grid_DataSource(g, ds);
    }




    /*var selectedRows2 = [];
    $("#treelist").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#treelist"), selectedRows2);
    });

    $("#treelist").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#treelist"), selectedRows2);
    });*/

    $("#treelist").data("kendoGrid").dataSource.read();


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

    /*var selectedRows2 = [];
    $("#gridDetCortePre").data("kendoGrid").bind("dataBound", function (e) { 
        Grid_SetSelectRow($("#gridDetCortePre"), selectedRows2);
    });

    $("#gridDetCortePre").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetCortePre"), selectedRows2);
    });

    $("#gridDetCortePre").data("kendoGrid").dataSource.read();*/

    //#endregion 


    //crear entrega a prod
    $("#btnSolicitarProducto").click(function () {
        let checks = [];
        let grid = $("#treelist").data("kendoGrid");

        grid.tbody.find("input:checked").closest("tr").each(function (index) {
            checks.push(index);
        });

        if (checks.length >= 1)
        {

        }
        else
        {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar al menos un elemento de la lista.", "error");
        }

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
            //$("#gridDetCortePre").data("kendoGrid").dataSource.read();
            let dsm = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${0}` },
                        contentType: "application/json; charset=utf-8"
                    }
                }
            });
            $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);
            let dspl = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${0}` },
                        contentType: "application/json; charset=utf-8"
                    }
                }
            });
            $("#cmbPL").data("kendoComboBox").setDataSource(dspl);
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
        }
    });
    
    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidclie = this.dataItem(e.item.index()).IdCliente;
            xidcata = 0;
            xidCorte = 0;
            $("#cmbMarca").data("kendoComboBox").value("");
            $("#cmbPL").data("kendoComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            let dsm = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${xidclie}` },
                        contentType: "application/json; charset=utf-8"
                    }
                }
            });
            $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);
            let dspl = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${xidclie}` },
                        contentType: "application/json; charset=utf-8"
                    }
                }
            });
            $("#cmbPL").data("kendoComboBox").setDataSource(dspl);
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
        }
        else {
            xidcata = 0;
            xidCorte = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#txtDiseño").val("");
            $("#txtEstilo").val("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            let dsm = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${0}` },
                        contentType: "application/json; charset=utf-8"
                    }
                }
            });
            $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);
            let dspl = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${0}` },
                        contentType: "application/json; charset=utf-8"
                    }
                }
            });
            $("#cmbPL").data("kendoComboBox").setDataSource(dspl);
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
        }
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xidcata = this.dataItem(e.item.index()).IdCatalogoDiseno;
            xidCorte = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                fn_readonly();
            });
            //$("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), true);
        } else {
            xidcata = 0;
            xidCorte = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
            //$("#gridDetCortePre").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnSolicitarProducto"), false);
        }
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbFm").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xidcata = 0;
            xidCorte = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
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
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();

        } else {
            xidCorte = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
        }
    });

    $("#cmbCorte").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbCorte").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdHojaBandeo === Number(this.value()));
        if (data === undefined) {
            xidCorte = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidServicio = this.dataItem(e.item.index()).IdServicio;

        } else {
            xidServicio = 0;
        }
        if (xidServicio == 0) {
            xidServicio = null;
        }
        if (xidclie == 0) {
            xidclie = null;
        }
        if (xidPlanta == 0) {
            xidPlanta = null;
        }
        if (xidMarca == 0) {
            xidMarca = null;
        }
        if (xidcata == 0) {
            xidcata = null;
        }
        if (xidCorte == 0) {
            xidCorte = null;
        }
        if (xidListaEmpaque == 0) {
            xidListaEmpaque = null;
        }
        $("#treelist").data("kendoGrid").dataSource.read();
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidServicio = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
        }
        
    });

    $("#cmbPlanta").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidPlanta = this.dataItem(e.item.index()).IdPlanta;

        } else {
            xidPlanta = 0;
        }
        if (xidServicio == 0) {
            xidServicio = null;
        }
        if (xidclie == 0) {
            xidclie = null;
        }
        if (xidPlanta == 0) {
            xidPlanta = null;
        }
        if (xidMarca == 0) {
            xidMarca = null;
        }
        if (xidcata == 0) {
            xidcata = null;
        }
        if (xidCorte == 0) {
            xidCorte = null;
        }
        if (xidListaEmpaque == 0) {
            xidListaEmpaque = null;
        }
        $("#treelist").data("kendoGrid").dataSource.read();
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidPlanta = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
        }
        
    });

    $("#cmbMarca").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidMarca = this.dataItem(e.item.index()).IdMarca;

        } else {
            xidMarca = 0;
        }
        if (xidServicio == 0) {
            xidServicio = null;
        }
        if (xidclie == 0) {
            xidclie = null;
        }
        if (xidPlanta == 0) {
            xidPlanta = null;
        }
        if (xidMarca == 0) {
            xidMarca = null;
        }
        if (xidcata == 0) {
            xidcata = null;
        }
        if (xidCorte == 0) {
            xidCorte = null;
        }
        if (xidListaEmpaque == 0) {
            xidListaEmpaque = null;
        }
        $("#treelist").data("kendoGrid").dataSource.read();
    });

    $("#cmbMarca").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidMarca = 0;
            if (xidServicio == 0) {
                xidServicio = null;
            }
            if (xidclie == 0) {
                xidclie = null;
            }
            if (xidPlanta == 0) {
                xidPlanta = null;
            }
            if (xidMarca == 0) {
                xidMarca = null;
            }
            if (xidcata == 0) {
                xidcata = null;
            }
            if (xidCorte == 0) {
                xidCorte = null;
            }
            if (xidListaEmpaque == 0) {
                xidListaEmpaque = null;
            }
            $("#treelist").data("kendoGrid").dataSource.read();
        }

        
    });

    $("#cmbPL").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidListaEmpaque = this.dataItem(e.item.index()).IdListaEmpaque;
        } else {
            xidListaEmpaque = 0;
        }
        if (xidServicio == 0) {
            xidServicio = null;
        }
        if (xidclie == 0) {
            xidclie = null;
        }
        if (xidPlanta == 0) {
            xidPlanta = null;
        }
        if (xidMarca == 0) {
            xidMarca = null;
        }
        if (xidcata == 0) {
            xidcata = null;
        }
        if (xidCorte == 0) {
            xidCorte = null;
        }
        if (xidListaEmpaque == 0) {
            xidListaEmpaque = null;
        }
        $("#treelist").data("kendoGrid").dataSource.read();
    });

    $("#cmbPL").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidListaEmpaque = 0;
        if (xidServicio == 0) {
            xidServicio = null;
        }
        if (xidclie == 0) {
            xidclie = null;
        }
        if (xidPlanta == 0) {
            xidPlanta = null;
        }
        if (xidMarca == 0) {
            xidMarca = null;
        }
        if (xidcata == 0) {
            xidcata = null;
        }
        if (xidCorte == 0) {
            xidCorte = null;
        }
        if (xidListaEmpaque == 0) {
            xidListaEmpaque = null;
        }
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

var getInfoGeneral = () => {
    $(".k-grid-b_search").on("click", function () {
        var cata = $(this).closest("tr").find(".selCata").text();
        let strjson = {
            config: [{
                Div: "vInfDiseno",
                Vista: "~/Views/Shared/_GenInfoFM.cshtml",
                Js: "GenInfoFM.js",
                Titulo: "Información General",
                Width: "40%",
                MinWidth: "30%"
            }],
            Param: { idCatalogo: cata },
            fn: { fnclose: "", fnLoad: "fn_Ini_GenInfo", fnReg: "fn_Reg_GenInfo", fnActi: "" }
        };

        fn_GenLoadModalWindow(strjson)
    });
};

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
var loadModalCorte = (IdHojaBandeo, Corte) => {
    let strjson = {
        config: [{
            Div: "vConsultaEtapa",
            Vista: "~/Views/Shared/_ConsultaEtapaCorte.cshtml",
            Js: "ConsultaEtapaCorte.js",
            Titulo: "Estatus Etapas",
            Width: "70%",
            MinWidth: "30%"
        }],
        Param: { IdModulo: 9, IdHojaBandeo: IdHojaBandeo, Corte: Corte },
        fn: { fnclose: "", fnLoad: "fn_Ini_ConsultaEtapa", fnReg: "fn_con_ConsultaEtapa", fnActi: "" }
    };

    fn_GenLoadModalWindow(strjson);
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
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    {
                        field: "Button", title: "Detalle", template: "<button class='k-button k-button-icontext k-grid-b_search' onclick='loadModalCorte(\"#=data.IdHojaBandeo#\",\"#=data.Corte#\")'><span class='k-icon k-i-eye m-0'></span> </button>", width: 90
                    }
                ]
            });
        });
    }
});