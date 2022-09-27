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
var xidDM = 0;
var xNoDoc = 0;

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
        detailInit: DIDM,
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

    SetGrid($("#treelist").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659, false);
    Set_Grid_DataSource($("#treelist").data("kendoGrid"), dTree);

    var selectedRows = [];

    $("#treelist").data("kendoGrid").tbody.on("change", ".k-checkbox", function (e) {
        let checkbox = $(this);
        let nextRow = checkbox.closest("tr").next();
        let prevRow = "";
        let prevCheck = "";
        let currentRow = checkbox.closest("tr")[0];
        let allRows = checkbox.closest("tr")[0].parentElement.rows;
        let tallaActual = currentRow.cells[3].innerText;
        let contRowsChecked = 0;
        var acumRowChecked = 0;

        if (currentRow.cells.length == 7) {
            prevRow = checkbox.closest(".k-detail-row")[0].previousSibling;
            prevCheck = prevRow.children[1].children[0];
        }

        if (nextRow.hasClass("k-detail-row")) {
            nextRow.find(":checkbox").prop("checked", checkbox.is(":checked"));
        }

        //función para marcar y desmarcar todas las tallas
        $.each($(allRows), function (indice, elemento) {
            if (elemento.cells.length == 7)
            {
                if (elemento.cells[3].innerText == tallaActual) {
                    let tempCheck = elemento.cells[0].children[0];
                    if (checkbox.is(":checked")) {
                        tempCheck.checked = true;
                        elemento.classList.add("k-state-selected");
                        contRowsChecked++;
                    }
                    else {
                        tempCheck.checked = false;
                        elemento.classList.remove("k-state-selected");
                    }
                }
                if (elemento.classList.contains("k-state-selected") == true) {
                    acumRowChecked++;
                }
            }
        });

        if (prevRow != "" && prevCheck != "")
        {
            if (acumRowChecked == allRows.length) {
                prevCheck.checked = true;
            }
            else if (acumRowChecked == 0)
            {
                prevCheck.checked = false;
                prevRow.classList.remove("k-state-selected");
            }
            else {
                prevCheck.checked = false;
            }
        }

    });

    /*$("#treelist").data("kendoGrid").tbody.on("click", ".k-master-row", function (e) {
        let checkbox = "";
        if (this.cells[6].classList == "selCata") {
            checkbox = this.children[1].children[0];
        }
        else
        {
            checkbox = this.children[0].children[0];
        }
        if (checkbox.checked == true) {
            checkbox.checked = false;
        }
        else
        {
            checkbox.checked = true;
        }
        let nextRow = checkbox.closest("tr").nextElementSibling;
        let currentRow = this;
        let allRows = this.parentElement.rows;
        let tallaActual = this.cells[3].innerText;

        if (nextRow.classList == "k-detail-row") {
            let checks = nextRow.querySelectorAll("input[type=checkbox]");
            $.each($(checks), function (indice, elemento) {
                if ((elemento.checked = checkbox.checked) == true) {
                    elemento.closest("tr").classList.add("k-state-selected");
                }
                else
                {
                    elemento.closest("tr").classList.remove("k-state-selected");
                }

            });
        }

        //función para marcar y desmarcar todas las tallas
        $.each($(allRows), function (indice, elemento) {
            if (elemento.cells.length == 7) {
                if (elemento.cells[3].innerText == tallaActual) {
                    let tempCheck = elemento.cells[0].children[0];
                    if (checkbox.hasClass("k-state-selected")) {
                        tempCheck.checked = false;
                        elemento.classList.remove("k-state-selected");
                    }
                    else {
                        tempCheck.checked = true;
                        elemento.classList.add("k-state-selected");
                    }
                }
            }
        });

    });*/

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


    $("#treelist").data("kendoGrid").dataSource.read();

    if (readFecha != "" && readFecha != undefined) {
        $("#dtFechaProyectada").data("kendoDatePicker").value(readFecha);
    }

    if (readPlanta > 0 && readPlanta != "" && readPlanta != undefined) {
        xidPlanta = readPlanta;
        $("#cmbPlanta").data("kendoComboBox").value(readPlanta);
    }
    else
    {
        xidPlanta = null;
    }

    if (readIdCliente > 0 && readIdCliente != "" && readIdCliente != undefined) {
        xidServicio = null;
        xidclie = null;
        xidMarca = null;
        xidcata = null;
        xidCorte = null;
        xidListaEmpaque = null;
        xidclie = parseInt(readIdCliente);
        $("#cmbCliente").data("kendoComboBox").value(xidclie);
        $('#cmbCliente').data("kendoComboBox").readonly(true);
        Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${xidclie}`, "Nombre2", "IdMarca", "Seleccione..");
        Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${xidclie}`, "PL", "IdListaEmpaque", "Seleccione..");
        KdoButtonEnable($("#btnCrearOrdenDespacho"), true);
        $("#treelist").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
        });
    }

    if (readNoDoc != "" && readNoDoc != undefined) {
        xNoDoc = readNoDoc;
        $("#txtNoDoc").val(xNoDoc);
    }

    if (readIdDespachoMercancia > 0 && readIdDespachoMercancia != "" && readIdDespachoMercancia != undefined) {
        KdoButtonEnable($("#btnMoveData"), true);
    }


    //#region crear grid Lista
    let dsDM = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: TSM_Web_APi + "DespachosMercanciasDetalles/GetCortesSugeridos/" + xidDM ,
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
                id: "IdDespachoMercancia",
                fields: {
                    IdDespachoMercancia: { type: "number" },
                    IdHojaBandeo: { type: "number" },
                    NoReferencia: { type: "string" },
                    Disenos: { type: "string" },
                    CantidadTallas: { type: "number" },
                    CantidadMercancia: { type: "number" },
                    Cantidad: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridOrdenDespacho").kendoGrid({
        detailInit: DIDM,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdDespachoMercancia", title: "IdDespachoMercancia", hidden: true },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "NoReferencia", title: "FM", attributes: { "class": "selFM" } },
            { field: "Disenos", title: "Diseños" },
            /*{ field: "Corte", title: "Corte" },
            { field: "IdCatalogoDiseno", title: "IdCatalogoDiseno", hidden: true, attributes: { "class": "selCata" } },*/
            { field: "CantidadTallas", title: "Cantidad Tallas" },
            { field: "CantidadMercancia", title: "Cantidad Mercancia" },
            { field: "Cantidad", title: "Cantidad" },
            {
                field: "", title: "", template: "<button class='k-button k-button-icontext k-grid-b_deleteOD' id='eod#=data.IdDespachoMercancia#' onclick='fn_delOD(\"#=data.IdDespachoMercancia#\",\"Todas las tallas\",\"#=data.IdHojaBandeo#\");'><span class='k-icon k-i-trash m-0'></span> </button>", width: 70
            }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridOrdenDespacho").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659, false);
    SetGrid_CRUD_ToolbarTop($("#gridOrdenDespacho").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridOrdenDespacho").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridOrdenDespacho").data("kendoGrid"), dsDM);

    if (readIdDespachoMercancia > 0 && readIdDespachoMercancia != "" && readIdDespachoMercancia != undefined) {
        xidDM = readIdDespachoMercancia;
        $("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
    }

   

    //crear orden despacho
    $("#btnMoveData").click(function () {

        rowsPadre = [];
        rowsHijo = [];
        let mercancias = [];

        $.each($(".k-state-selected.k-master-row"), function (index, elemento) {

            if (elemento.cells[6].className == "selCata") {
                rowsPadre.push(elemento);
            }
            else {
                rowsHijo.push(elemento);
                //elemento.classList.remove("k-state-selected");
            }
        });

        $.each($(rowsHijo), function (index, elemento) {
            mercancias.push(parseInt(elemento.cells[4].innerText));
        });

        if (rowsHijo.length>0)
        {
            let d = new Date();
            let now = "";
            if (d.getMonth() + 1 < 10) {
                if (d.getDate() < 10) {
                    now = d.getFullYear() + "/" + "0" + (d.getMonth() + 1) + "/" + "0" + d.getDate();
                }
                else
                {
                    now = d.getFullYear() + "/" + "0" + (d.getMonth() + 1) + "/" + d.getDate();
                }
            }
            else
            {
                if (d.getDate() < 10) {
                    now = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + "0" + d.getDate();
                }
                else {
                    now = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
                }
            }
            let fecha = kendo.toString($("#dtFechaProyectada").data("kendoDatePicker").value(), "yyyy/MM/dd");

            if (fecha >= now)
            {
                if (xidPlanta != 0 && xidPlanta != null && xidPlanta != "")
                {
                    /*let registro = {
                        "FechaSolicitud": now.replace(/\//g, ''),
                        "IdCliente": xidclie,
                        "Estado": "OPERACION",
                        "FechaEntrega": fecha.replace(/\//g, ''),
                        "IdUsuarioSolicita": getUser(),
                        "IdUsuarioMod": getUser(),
                        "IdMercancia": mercancias,
                        "IdMotivo": 1,
                        "IdPlanta": xidPlanta
                    }
                    console.log(registro);*/

                    if (readIdDespachoMercancia == "" || readIdDespachoMercancia == 0 || readIdDespachoMercancia == undefined) {
                        readIdDespachoMercancia == null;
                    }

                    $.ajax({
                        url: TSM_Web_APi + "DespachosMercancias/CrearOrdenDespachoSugerida",
                        method: "POST",
                        dataType: "json",
                        data: JSON.stringify({
                            IdDespachoMercancia: readIdDespachoMercancia,
                            FechaSolicitud: now.replace(/\//g, ''),
                            IdCliente: xidclie,
                            Estado: "OPERACION",
                            FechaEntrega: fecha.replace(/\//g, ''),
                            IdUsuarioSolicita: getUser(),
                            IdUsuarioMod: getUser(),
                            IdMercancia: mercancias,
                            IdMotivo: 1,
                            IdPlanta: xidPlanta
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function (datos) {
                            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                                closeOpenDetailGrid();
                            });
                            readIdDespachoMercancia = datos[0][0]["IdDespachoMercancia"];
                            xidDM = datos[0][0]["IdDespachoMercancia"];
                            readNoDoc = datos[0][0]["NoDocumento"];
                            xNoDoc = datos[0][0]["NoDocumento"];
                            $("#txtNoDoc").val(xNoDoc);
                            $("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
                            RequestEndMsg(datos, "Post");
                        },
                        error: function (data) {
                            ErrorMsg(data);
                        },
                        complete: function () {
                            kendo.ui.progress($(document.body), false);
                        }
                    });
                }
                else
                {
                    $("#kendoNotificaciones").data("kendoNotification").show("El campo planta es necesario, por favor escoja una.", "error");
                }
            }
            else
            {
                $("#kendoNotificaciones").data("kendoNotification").show("Escoja una fecha válida.", "error");
            }
        }
        else
        {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione al menos una talla.", "error");
        }

    });

    $("#btnCrearOrdenDespacho").click(function () {

        let d = new Date();
        let now = "";
        if (d.getMonth() + 1 < 10) {
            if (d.getDate() < 10) {
                now = d.getFullYear() + "/" + "0" + (d.getMonth() + 1) + "/" + "0" + d.getDate();
            }
            else {
                now = d.getFullYear() + "/" + "0" + (d.getMonth() + 1) + "/" + d.getDate();
            }
        }
        else {
            if (d.getDate() < 10) {
                now = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + "0" + d.getDate();
            }
            else {
                now = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
            }
        }
        let fecha = kendo.toString($("#dtFechaProyectada").data("kendoDatePicker").value(), "yyyy/MM/dd");

        if (xidPlanta != 0 && xidPlanta != null && xidPlanta != "") {
            if (fecha >= now) {
                if (readIdDespachoMercancia == "" || readIdDespachoMercancia == 0 || readIdDespachoMercancia == undefined) {
                    readIdDespachoMercancia == null;
                }

                $.ajax({
                    url: TSM_Web_APi + "DespachosMercancias/CrearOrdenDespachoSugerida",
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify({
                        IdDespachoMercancia: readIdDespachoMercancia,
                        FechaSolicitud: now.replace(/\//g, ''),
                        IdCliente: xidclie,
                        Estado: "OPERACION",
                        FechaEntrega: fecha.replace(/\//g, ''),
                        IdUsuarioSolicita: getUser(),
                        IdUsuarioMod: getUser(),
                        IdMercancia: null,
                        IdMotivo: 1,
                        IdPlanta: xidPlanta
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (datos) {
                        $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                            closeOpenDetailGrid();
                        });
                        readIdDespachoMercancia = datos[0][0]["IdDespachoMercancia"];
                        xidDM = datos[0][0]["IdDespachoMercancia"];
                        readNoDoc = datos[0][0]["NoDocumento"];
                        xNoDoc = datos[0][0]["NoDocumento"];
                        $("#txtNoDoc").val(xNoDoc);
                        $("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
                        $('#cmbCliente').data("kendoComboBox").readonly(true);
                        KdoButtonEnable($("#btnMoveData"), true);
                        RequestEndMsg(datos, "Post");
                    },
                    error: function (data) {
                        KdoButtonEnable($("#btnMoveData"), false);
                        ErrorMsg(data);
                    },
                    complete: function () {
                        kendo.ui.progress($(document.body), false);
                    }
                });
            }
            else {
                $("#kendoNotificaciones").data("kendoNotification").show("Escoja una fecha válida.", "error");
            }
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("El campo planta es necesario, por favor escoja una.", "error");
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnCrearOrdenDespacho"), true);
                //KdoButtonEnable($("#btnMoveData"), true);
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
                KdoButtonEnable($("#btnCrearOrdenDespacho"), false);
                //KdoButtonEnable($("#btnMoveData"), false);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnCrearOrdenDespacho"), true);
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
                KdoButtonEnable($("#btnCrearOrdenDespacho"), false);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnCrearOrdenDespacho"), false);
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    fn_readonly();
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnMoveData"), true);
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnMoveData"), false);
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }

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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
        if (xidclie != "" && xidclie != 0 && xidclie != null) {
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#treelist").data("kendoGrid").dataSource.data([]);
        }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
        if (xidclie != "" && xidclie != 0 && xidclie != null) {
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#treelist").data("kendoGrid").dataSource.data([]);
        }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
        if (xidclie != "" && xidclie != 0 && xidclie != null) {
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#treelist").data("kendoGrid").dataSource.data([]);
        }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
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
        if (xidclie != "" && xidclie != 0 && xidclie != null) {
            $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#treelist").data("kendoGrid").dataSource.data([]);
        }
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
            if (xidclie != "" && xidclie != 0 && xidclie != null) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else
            {
                $("#treelist").data("kendoGrid").dataSource.data([]);
            }
        }
        
    });

});

var fn_readonly = () => {
    var treeList = $("#treelist").data("kendoGrid");
    var data = treeList.dataItem("tbody>tr:eq(0)");
}

var getInfoGeneral = () => {
    $(".k-grid-b_search").on("click", function () {
        var cata = $(this).closest("tr").find(".selCata").text();
        if (cata != "" && cata != null) {
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

            fn_GenLoadModalWindow(strjson);
        }
        else
        {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione código de FM para ver la información del diseño.", "error");
        }
    });
};

var DIDM = (e) => {

    let classList = e.masterRow[0].cells[3].classList;

    if (classList.contains("selFM") == true) {
        /////////////////////////////////GRID DERECHO///////////////////////////////////
        let viddm = e.masterRow[0].cells[1].innerText === null ? 0 : e.masterRow[0].cells[1].innerText;
        let vidhob2 = e.masterRow[0].cells[2].innerText === null ? 0 : e.masterRow[0].cells[2].innerText;
        let rowId2 = e.masterRow[0].cells[1].innerText;

        let VdSDM = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "DespachosMercanciasDetalles/GetCortesSugeridosDet/" + viddm + "/" + vidhob2; },
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
                    id: "IdDespachoMercancia",
                    fields: {
                        IdDespachoMercancia: { type: "number" },
                        IdHojaBandeo: { type: "number" },
                        NoReferencia: { type: "string" },
                        Disenos: { type: "string" },
                        Talla: { type: "string" },
                        CantidadMercancia: { type: "number" },
                        Cantidad: { type: "number" }
                    }
                }
            },
            filter: { field: "NoReferencia", operator: "eq", value: e.masterRow[0].cells[3].innerText }
        };

        let gt = $(`<div id= "gridDM${rowId2}"></div>`).appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdDespachoMercancia", title: "IdDespachoMercancia", hidden: true},
                { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true, attributes: { "class": "idHB-detail" } },
                { field: "NoReferencia", title: "FM" },
                { field: "Disenos", title: "Disenos" },
                { field: "Talla", title: "Talla" },
                { field: "CantidadMercancia", title: "Cantidad Mercancia" },
                { field: "Cantidad", title: "Cantidad" },
                {
                    field: "", title: "", template: "<button class='k-button k-button-icontext k-grid-del_detalle' onclick='fn_delOD(\"#=data.IdDespachoMercancia#\",\"#=data.Talla#\",\"#=data.IdHojaBandeo#\");'><span class='k-icon k-i-trash m-0'></span> </button>", width: 90
                }
            ]
        });

        ConfGDetalleDM(gt.data("kendoGrid"), VdSDM, "gFor_detalleDM" + viddm);

        let selectedRowsTec = [];


        gt.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(gt, selectedRowsTec);
        });
        ////////////////////////////////////////////////////////////////////////////////
    }
    else
    {
        /////////////////////////////////GRID IZQUIERDO///////////////////////////////////
        let vidhb = e.data.IdHojaBandeo === null ? 0 : e.data.IdHojaBandeo;
        let rowId = e.data.RowId;
        let VdS = {
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
                        //CantidadIngreso: { type: "number" },
                        CantidadDisponible: { type: "number" },
                        CantidadDespacho: { type: "number" }
                    }
                }
            },
            filter: { field: "IdHojaBandeo", operator: "eq", value: e.data.IdHojaBandeo }
        };

        let g = $(`<div id= "gridOrdenesDespacho${rowId}" class='lump-child-grid'></div>`).appendTo(e.detailCell).kendoGrid({
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
                //{ field: "CantidadIngreso", title: "Cantidad Ingreso" },
                { field: "CantidadDisponible", title: "Cantidad Disponible" },
                { field: "CantidadDespacho", title: "Cantidad Despacho" }
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidhb);

        let selectedRowsTec = [];


        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
        ////////////////////////////////////////////////////////////////////////////////
    }

}

var ConfGDetalleDM = (gt, ds2, Id_gCHForDetalleX) => {
    SetGrid(gt, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0,);
    SetGrid_CRUD_Command(gt, false, false, Id_gCHForDetalleX);
    Set_Grid_DataSource(gt, ds2);
}

var ConfGDetalle = (g, ds, Id_gCHForDetalle) => {
    SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0, false);
    SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
    Set_Grid_DataSource(g, ds);
}

var fn_delOD = (IdDespachoMercancia, Talla, IdHojaBandeo) => {

    if (Talla == "Todas las tallas") {
        $.ajax({
            url: TSM_Web_APi + "DespachosMercanciasDetalles/DelDespachoMercanciaxTalla",
            method: "DELETE",
            dataType: "json",
            data: JSON.stringify({
                IdDespachoMercancia: IdDespachoMercancia,
                Talla: null,
                IdHojaBandeo: IdHojaBandeo,
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                $("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
                RequestEndMsg(datos, "Post");
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(document.body), false);
            }
        });
    }
    else
    {
        $.ajax({
            url: TSM_Web_APi + "DespachosMercanciasDetalles/DelDespachoMercanciaxTalla",
            method: "DELETE",
            dataType: "json",
            data: JSON.stringify({
                IdDespachoMercancia: IdDespachoMercancia,
                Talla: Talla,
                IdHojaBandeo: IdHojaBandeo,
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                $("#treelist").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                $("#gridOrdenDespacho").data("kendoGrid").dataSource.read();
                RequestEndMsg(datos, "Post");
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(document.body), false);
            }
        });
    }

}


var closeOpenDetailGrid = () => {
    var gridV = $("#treelist").data("kendoGrid");

    if (gridV.dataSource.total() > 0) {
        $(".k-master-row").each(function (index) {
            gridV.expandRow(this);
        });

        $(".k-master-row").each(function (index) {
            gridV.collapseRow(this);
        });

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