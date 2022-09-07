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

var rowsPadre = [];
var rowsHijo = [];
var dataPadre = [];
var dataHijo = [];
var acumRowPadre = [];
var acumRowHijo = [];
var acumDSOD = [];
var oldElement = [];

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
    KdoButton($("#btnCrearOrdenDespacho"), "save");
    // crear detakle de preparado
    KdoButtonEnable($("#btnCrearOrdenDespacho"), false);
    $("#dtFechaProyectada").kendoDatePicker({ format: "dd/MM/yyyy" });
    KdoButton($("#btnMoveData"), "redo k-icon-xl");
    $("#btnMoveData").removeClass("k-button-icon");
    KdoButtonEnable($("#btnMoveData"), false);
    $("#dtFechaProyectada").data("kendoDatePicker").enable(false);

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
                    NoReferencia: { field: "NoReferencia", type: "string" },
                    Diseno: { field: "Diseno", type: "string" },
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
        dataBound: function (e) {
            //this.collapseRow(this.tbody.find("tr.k-master-row").first());
            var grid = e.sender;

            grid.tbody.find("tr.k-master-row").click(function (e) {
                var target = $(e.target);
                if ((target.hasClass("k-i-expand")) || (target.hasClass("k-i-collapse"))) {
                    return;
                }

                var row = target.closest("tr.k-master-row");
                var icon = row.find(".k-i-expand");

                if (icon.length) {
                    grid.expandRow(row);
                } else {
                    grid.collapseRow(row);
                }
            });
        },
        change: function (e) {
            $("tr", ".lump-child-grid").removeClass("k-state-selected");
            let child = this.select().next().find(".lump-child-grid");
            $("tr:not(.d-none)", child).addClass("k-state-selected");

            let childRow = this.element.closest("table").next();
            if (this.select().length > 0) {
                childRow.removeClass("k-state-selected");
            }

            let grid = $("#treelist").data("kendoGrid");
            let detailRow = grid.element.find(".k-detail-row");

            let items = [];
            let rows = detailRow.find(".idHB-detail");
            setTimeout(function () {

                rows.each(function (currentValue, index, array) {
                    let row = index.closest("tr");
                    let chk = row.querySelector("input");
                    if (chk.checked) {
                        items.push(index.innerText);
                    }
                });
                StrIdBulto = items;

                items = [];
                rows = detailRow.find(".corte-detail");
                rows.each(function (currentValue, index, array) {
                    let row = index.closest("tr");
                    let chk = row.querySelector("input");
                    if (chk.checked)
                        items.push(index.innerText);
                });
                StrCorte = items;

            }, 250);

            
        },
        height: 660,
        messages: {
            noRows: "No hay datos dsiponibles"
        },
        columns: [
            { selectable: true, width: "35px" },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "NoReferencia", title: "NoReferencia", hidden: true },
            { field: "Diseno", title: "Diseno", hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "IdCatalogoDiseno", title: "IdCatalogoDiseno", hidden: true, attributes: { "class": "selCata" } },
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

    var selectedRows = [];

    $("#treelist").data("kendoGrid").tbody.on("change", ".k-checkbox", function (e) {
        let checkbox = $(this);
        let nextRow = checkbox.closest("tr").next();
        let currentRow = checkbox.closest("tr")[0];
        let allRows = checkbox.closest("tr")[0].parentElement.rows;
        let tallaActual = currentRow.cells[3].innerText;

        if (nextRow.hasClass("k-detail-row")) {
            nextRow.find(":checkbox").prop("checked", checkbox.is(":checked"));
        }

        //función para marcar y desmarcar todas las tallas
        $.each($(allRows), function (indice, elemento) {
            if (elemento.cells[3].innerText == tallaActual)
            {
                let tempCheck = elemento.cells[0].children[0];
                if (checkbox.is(":checked")) {
                    tempCheck.checked = true;
                    elemento.classList.add("k-state-selected");
                }
                else {
                    tempCheck.checked = false;
                    elemento.classList.remove("k-state-selected");
                }
            }
        });

    });

    $("#treelist").data("kendoGrid").thead.on("change", ".k-checkbox", function (e) {
        let checkbox = $(this);
        let content = checkbox.closest(".k-grid-header").next();

        if (content.hasClass("k-grid-content")) {
            let detailRow = content.find("tr.k-detail-row");

            if (detailRow.length > 0) {
                detailRow.find(":checkbox").prop("checked", checkbox.is(":checked"));
            }

            let items = [];
            let rows = detailRow.find(".idHB-detail");
            rows.each(function (currentValue, index, array) {
                let row = index.closest("tr");
                let chk = row.querySelector("input");
                if (chk.checked) {
                    items.push(index.innerText);
                }
            });
            StrIdBulto = items;

            items = [];
            rows = detailRow.find(".corte-detail");
            rows.each(function (currentValue, index, array) {
                let row = index.closest("tr");
                let chk = row.querySelector("input");
                if (chk.checked)
                    items.push(index.innerText);
            });
            StrCorte = items;
        }
    });

    $("#treelist").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#treelist"), selectedRows);
    });


    // gCHFor detalle
    function detailInit(e) {

        var vidhb = e.data.IdHojaBandeo === null ? 0 : e.data.IdHojaBandeo;
        var vidc = e.data.IdHojaBandeo === null ? 0 : e.data.IdCatalogoDiseno;
        var rowId = e.data.RowId;
        var VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "HojasBandeos/GetCortesPorDespacharDet/" + vidhb ; },
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

        var g = $(`<div id= "gridOrdenesDespacho${rowId}" class='lump-child-grid'></div>`).appendTo(e.detailCell).kendoGrid({
            change: function (e) {

                var masterRow = this.element.closest("tr").prev();
                if (this.select().length) {
                    masterRow.addClass("k-state-selected");

                } else {
                    masterRow.removeClass("k-state-selected");
                }
            },
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { selectable: true, width: "35px", headerTemplate: ' ' },
                { field: "IdHojaBandeo", title: "Id Hoja Bandeo", hidden: true, attributes: { "class": "idHB-detail" } },
                { field: "Corte", title: "Corte", hidden: true, attributes: { "class": "corte-detail" } },
                { field: "Tallas", title: "Tallas", attributes: { "class": "tallas-detail" } },
                { field: "IdMercancia", title: "Id Mercancia", hidden: true },
                { field: "CantidadIngreso", title: "Cantidad Ingreso" },
                { field: "CantidadDisponible", title: "Cantidad Disponible" },
                { field: "CantidadDespacho", title: "Cantidad Despacho" }
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidhb);

        /*var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            //Grid_SetSelectRow(g, selectedRowsTec);

            Gdet = g.data("kendoGrid");

        });*/

        var selectedRowsTec = [];


        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });

        /*g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });*/
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0, "multiple");
        SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
        Set_Grid_DataSource(g, ds);
    }

    $("#treelist").data("kendoGrid").dataSource.read();


    //#region crear grid Lista
    let dSlis = new kendo.data.DataSource({
        schema: {
            model: {
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    NoReferenica: { type: "string" },
                    Diseno: { type: "string" },
                    Corte: { type: "string" },
                    Tallas: { type: "string" },
                    IdMercancia: { type: "number" },
                    CantidadBultos: { type: "number" },
                    CantidadIngreso: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridOrdenDespacho").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "NoReferencia", title: "FM" },
            { field: "Diseno", title: "Diseño" },
            { field: "Corte", title: "Corte" },
            { field: "IdCatalogoDiseno", title: "IdCatalogoDiseno", hidden: true, attributes: { "class": "selCata" } },
            { field: "TotalTallas", title: "Total Tallas" },
            { field: "TotaBultos", title: "Cantidad Bultos" },
            { field: "CantidadBultos", title: "Cuantía" },
            {
                field: "Button", title: "Eliminar", template: "<button class='k-button k-button-icontext k-grid-b_deleteOD' onclick='fn_delOD(\"#=data.IdHojaBandeo#\");'><span class='k-icon k-i-trash m-0'></span> </button>", width: 70
            },
            {
                command: [
                    {
                        name: "b_detailOD",
                        text: " ",
                        click: getInfoGeneral,
                        iconClass: "k-icon k-i-eye m-0"
                    }
                ],
                width: "70px"
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridOrdenDespacho").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659);
    SetGrid_CRUD_ToolbarTop($("#gridOrdenDespacho").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridOrdenDespacho").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridOrdenDespacho").data("kendoGrid"), dSlis);

    //crear entrega a prod
    $("#btnMoveData").click(function () {
        var treeList = $("#treelist").data("kendoGrid");
        var row = treeList.select();
        let countHijoHidden = [];

        rowsPadre = [];
        rowsHijo = [];
        dataPadre = [];
        dataHijo = [];

        if (row.length > 0) {
            $.each(row, function (index, elemento) {
                let data = treeList.dataItem(elemento);
            });

            $.each($(".k-state-selected.k-master-row"), function (index, elemento) {
                //LineasPreOD.push(elemento);
                //console.log(elemento.cells);
                //console.log(elemento.cells[3].innerText);
                //console.log(elemento.cells[4].className);
                if (elemento.cells[6].className == "selCata") {
                    rowsPadre.push(elemento);


                    if (acumRowPadre.length > 0) {
                        $.each($(acumRowPadre), function (indice, element) {
                            if (elemento !== acumRowPadre[indice]) {
                                if (elemento.cells[2].innerText != acumRowPadre[indice].cells[2].innerText) {
                                    if (oldElement.includes(elemento.cells[2].innerText)==false)
                                    {
                                        acumRowPadre.push(elemento);
                                        oldElement.push(elemento.cells[2].innerText);
                                    }
                                }
                            }
                        });
                    }
                    else {
                        acumRowPadre.push(elemento);
                        oldElement.push(elemento.cells[2].innerText)
                    }
                    
                }
                else {
                    rowsHijo.push(elemento);
                    acumRowHijo.push(elemento);
                    elemento.classList.remove("k-state-selected");
                }
            });

           /*console.log(rowsPadre);
            console.log(rowsHijo);*/

            $.each($(acumRowPadre), function (index, elemento) {
                let tempPadre = [];
                $.each(elemento.cells, function (indice, element) {
                    if (element.innerText != "") {
                        tempPadre.push(element.innerText);
                    }
                });
                dataPadre.push(tempPadre);
            });

            $.each($(acumRowHijo), function (index, elemento) {
                let tempHijo = [];
                $.each(elemento.cells, function (indice, element) {
                    if (element.innerText != "") {
                        tempHijo.push(element.innerText);
                    }
                });
                dataHijo.push(tempHijo);
            });

            /*console.clear();
            console.log(acumRowPadre);
            console.log(acumRowHijo);*/

            let dsTemp = [];

            $.each(dataPadre, function (index, elemento) {

                var contTallas = 0;
                let tallas = [];
                var contBultos = 0;
                var cuant = 0;
                
                $.each(dataHijo, function (indice, element) {
                    if (elemento[0] == element[0] && elemento[3] == element[1])
                    {
                        contBultos++;
                        cuant = cuant + parseInt(element[4]);
                        tallas.push(dataHijo[indice][2]);
                    }
                });

                tallas.sort();

                tallas.forEach(function (value, key) {
                    if (key < 1) {
                        contTallas++;
                    }
                    else {
                        oldTalla = tallas[key - 1];
                        newTalla = tallas[key];
                        if (oldTalla != newTalla) {
                            contTallas++;
                        }
                    }
                });


                dsTemp.push({
                    IdHojaBandeo: elemento[0],
                    NoReferencia: elemento[1],
                    Diseno: elemento[2],
                    Corte: elemento[3],
                    IdCatalogoDiseno: elemento[4],
                    TotalTallas: contTallas,
                    TotaBultos: contBultos,
                    CantidadBultos: cuant
                });

        });


            let localDataSource = new kendo.data.DataSource({ data: dsTemp });

            $("#gridOrdenDespacho").data("kendoGrid").setDataSource(localDataSource);

            $.each($(acumRowPadre), function (index, elemento) {
                let maxbultos = elemento.cells[8].innerText;
                let contHidden = 0;
                let contHistoricHidden = 0;

                $.each($(acumRowHijo), function (ind, elem) {
                    if (elemento.cells[2].innerText == elem.cells[1].innerText && elemento.cells[5].innerText == elem.cells[2].innerText) {
                        if (elem.classList.contains("d-none")) {
                            contHistoricHidden++;
                        }
                    }  
                });

                $.each($(acumRowHijo), function (indice, element) {
                    if (elemento.cells[2].innerText == element.cells[1].innerText && elemento.cells[5].innerText == element.cells[2].innerText) {
                        element.classList.add("d-none");
                        contHidden++;
                        if (maxbultos == contHidden) {
                            let tbody = element.closest("div.k-grid-content.k-auto-scrollable");
                            let trest = tbody.closest('.k-detail-row');
                            if (trest != null)
                            {
                                trest.classList.add("d-none");
                            }
                        }

                    }
                });

                if (maxbultos == contHidden) {
                    if (contHistoricHidden == 0) {
                        elemento.classList.add("d-none");
                    }
                    else
                    {
                        $.each($(rowsPadre), function (ind, elmnt) {
                            if (elemento.cells[0].innerText == rowsPadre[ind].cells[0].innerText
                                && elemento.cells[1].innerText == rowsPadre[ind].cells[1].innerText
                                && elemento.cells[2].innerText == rowsPadre[ind].cells[2].innerText
                                && elemento.cells[3].innerText == rowsPadre[ind].cells[3].innerText
                                && elemento.cells[4].innerText == rowsPadre[ind].cells[4].innerText
                                && elemento.cells[5].innerText == rowsPadre[ind].cells[5].innerText
                                && elemento.cells[6].innerText == rowsPadre[ind].cells[6].innerText
                                && elemento.cells[7].innerText == rowsPadre[ind].cells[7].innerText
                                && elemento.cells[8].innerText == rowsPadre[ind].cells[8].innerText
                                && elemento.cells[9].innerText == rowsPadre[ind].cells[9].innerText
                                && elemento.cells[10].innerText == rowsPadre[ind].cells[10].innerText) {
                                elmnt.classList.add("d-none");
                            }
                        });
                    }
                    
                }

            });

            KdoButtonEnable($("#btnCrearOrdenDespacho"), true);
            $("#dtFechaProyectada").data("kendoDatePicker").enable(true);


        }
    });


    //compeltar campos de cabecera

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidcata = 0;
            xidCorte = 0;
            xidclie = 0;
            $("#cmbFm").data("kendoMultiColumnComboBox").value("");
            $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
            $("#cmbCorte").data("kendoMultiColumnComboBox").value("");
            $("#cmbCorte").data("kendoMultiColumnComboBox").dataSource.read();
            //$("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
            KdoButtonEnable($("#btnMoveData"), false);
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
            KdoButtonEnable($("#btnMoveData"), false);
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
                closeOpenDetailGrid();
                fn_valTreeList();
            });
            //$("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnMoveData"), true);
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
            //$("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnMoveData"), false);
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
            KdoButtonEnable($("#btnMoveData"), false);
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });

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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
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
        $("#treelist").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
            fn_valTreeList();
        });
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
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
        $("#treelist").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
            fn_valTreeList();
        });
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
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
        $("#treelist").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
            fn_valTreeList();
        });
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
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
        $("#treelist").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
            fn_valTreeList();
        });
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
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
                fn_valTreeList();
            });
        }
        
    });

});

var fn_valTreeList = () =>
{
    $.each($(acumRowPadre), function (index, elemento) {

        let grid = $("#treelist").data("kendoGrid");
        let gridRows = $("#treelist").data("kendoGrid").tbody.find("tr");
        let tempComp = [];
        let tempCompR = [];
        let tempRP = [];
        let tempRPR = [];
        let gr = [];

        gridRows.each(function (indice, elemento) {
            if (elemento.classList.contains("k-master-row")==true)
            {
                tempComp = [];
                $.each(elemento.cells, function (indice, element) {
                    if (element.innerText != "") {
                        tempComp.push(element.innerText);
                    }
                });
                tempCompR.push(tempComp);
                gr.push(elemento);
            }
        });

        $.each($(acumRowPadre), function (index, elemento) {
            if (elemento.classList.contains("k-master-row") == true)
            {
                tempRP = [];
                $.each(elemento.cells, function (indice, element) {
                    if (element.innerText != "" && element.innerText != " ") {
                        tempRP.push(element.innerText);
                    }
                });
                tempRPR.push(tempRP);
            }
        });

        $.each(tempRPR, function (indice, elem) {
            $.each(tempCompR, function (index, elementoo) {
                if (JSON.stringify(elementoo) == JSON.stringify(elem))
                {
                    grid.expandRow(gr[index]);

                    //////////////////////////OCULTAR FILAS//////////////////////////////////////
                    let maxbultos = gr[index].cells[8].innerText;
                    let contHidden = 0;

                    $.each($(acumRowHijo), function (indice, element) {
                        if (gr[index].cells[2].innerText == element.cells[1].innerText && gr[index].cells[5].innerText == element.cells[2].innerText) {
                            let subGrid = gr[index].nextSibling;
                            let dataSG = subGrid.children[1].children[0].children[1];
                            let tinfo = dataSG.children[1].tBodies[0].rows;
                            let tbd = dataSG.children[1].tBodies[0];
                            setTimeout(function () {
                                $.each($(tinfo), function (ind, el) {

                                    if (element.cells[0].innerText == el.cells[0].innerText 
                                        && element.cells[1].innerText == el.cells[1].innerText
                                        && element.cells[2].innerText == el.cells[2].innerText
                                        && element.cells[3].innerText == el.cells[3].innerText
                                        && element.cells[4].innerText == el.cells[4].innerText
                                        && element.cells[5].innerText == el.cells[5].innerText
                                        && element.cells[6].innerText == el.cells[6].innerText) {
                                        el.classList.add("d-none");
                                    }

                                });
                            }, 0200);
                            
                            
                            contHidden++;
                            if (maxbultos == contHidden) {
                                let tbody = tbd;
                                let trest = tbody.closest('.k-detail-row');
                                trest.classList.add("d-none");
                            }

                        }
                    });

                    if (maxbultos == contHidden) {
                        gr[index].classList.add("d-none");
                    }
                    ////////////////////////////////////////////////////////////////////////////////

                    grid.collapseRow(gr[index]);

                }
            });
        });

    });
}

var fn_delOD = (idHojaBandeo) => {

    console.log(idHojaBandeo);
    console.log("\n");

    console.log(oldElement);
    console.log(acumRowPadre);
    console.log(acumRowHijo);

    oldElement = oldElement.filter(function (item) {
        return item !== idHojaBandeo;
    });

    $.each($(acumRowPadre), function (indice, element) {
        let ban = false;

        if (idHojaBandeo == element.cells[2].innerText) {
            ban = true;
        }

        if (ban == true) {
            $.each($(acumRowHijo), function (index, elemento) {
                if (element.cells[2].innerText == elemento.cells[1].innerText && element.cells[5].innerText == elemento.cells[2].innerText) {
                    acumRowHijo = acumRowHijo.filter(function (item) {
                        return item !== elemento;
                    });
                }
            });

            acumRowPadre.splice(indice, 1);
        }

    });

    /////////////////////////////////////////////RELOAD DATA//////////////////////////////////////////////////

    dataPadre = [];
    dataHijo = [];

    $.each($(acumRowPadre), function (index, elemento) {
        let tempPadre = [];
        $.each(elemento.cells, function (indice, element) {
            if (element.innerText != "") {
                tempPadre.push(element.innerText);
            }
        });
        dataPadre.push(tempPadre);
    });

    $.each($(acumRowHijo), function (index, elemento) {
        let tempHijo = [];
        $.each(elemento.cells, function (indice, element) {
            if (element.innerText != "") {
                tempHijo.push(element.innerText);
            }
        });
        dataHijo.push(tempHijo);
    });

    let dsTemp = [];

    $.each(dataPadre, function (index, elemento) {

        var contTallas = 0;
        let tallas = [];
        var contBultos = 0;
        var cuant = 0;

        $.each(dataHijo, function (indice, element) {
            if (elemento[0] == element[0] && elemento[3] == element[1]) {
                contBultos++;
                cuant = cuant + parseInt(element[4]);
                tallas.push(dataHijo[indice][2]);
            }
        });

        tallas.sort();

        tallas.forEach(function (value, key) {
            if (key < 1) {
                contTallas++;
            }
            else {
                oldTalla = tallas[key - 1];
                newTalla = tallas[key];
                if (oldTalla != newTalla) {
                    contTallas++;
                }
            }
        });


        dsTemp.push({
            IdHojaBandeo: elemento[0],
            NoReferencia: elemento[1],
            Diseno: elemento[2],
            Corte: elemento[3],
            IdCatalogoDiseno: elemento[4],
            TotalTallas: contTallas,
            TotaBultos: contBultos,
            CantidadBultos: cuant
        });

    });



    let localDataSource = new kendo.data.DataSource({ data: dsTemp });

    $("#gridOrdenDespacho").data("kendoGrid").setDataSource(localDataSource);

    $("#treelist").data("kendoGrid").dataSource.read().then(function () {
        closeOpenDetailGrid();
        fn_valTreeList();
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log("\n");
    console.log(oldElement);
    console.log(acumRowPadre);
    console.log(acumRowHijo);

}

var fn_readonly = () => {
    var treeList = $("#treelist").data("kendoGrid");
    var data = treeList.dataItem("tbody>tr:eq(0)");
}

var fn_Close_CarritosFin = (xjson) => {
    $("#gridOrdenDespacho").data("kendoGrid").dataSource.read()
    $("#treelist").data("kendoGrid").dataSource.read();
}
var fn_Close_CarritoEnt = (xjson) => {
    $("#gridOrdenDespacho").data("kendoGrid").dataSource.read()
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

var closeOpenDetailGrid = () => {
    var gridV = $("#treelist").data("kendoGrid");

    if (gridV.dataSource.total() > 0) {
        $(".k-master-row").each(function (index) {
            gridV.expandRow(this);
        });

        $(".k-master-row").each(function (index) {
            gridV.collapseRow(this);
        });

        KdoButtonEnable($("#btnMoveData"), true);

    }
    else
    {
        KdoButtonEnable($("#btnMoveData"), false);
    }
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