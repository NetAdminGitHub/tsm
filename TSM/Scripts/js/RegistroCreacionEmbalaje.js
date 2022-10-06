
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
var xidDem = 0;
var xNoDoc = 0;

var rowsPadre = [];
var rowsHijo = [];
var dataPadre = [];
var dataHijo = [];
var acumRowPadre = [];
var acumRowHijo = [];
var acumDSOD = [];
var oldElement = [];
let Gdet;
$(document).ready(function () {

    KdoButton($("#btnRetornar"), "hyperlink-open-sm", "Regresar");
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${xidclie}`, "Nombre2", "IdMarca", "Seleccione..");
    Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/GetAllPLByIdCliente/" + `${xidclie}`, "PL", "IdListaEmpaque", "Seleccione..");
    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");


    //crear combobox catalogo 
    $("#cmbFm").mlcFmCatalogo();
    $("#cmbCorte").mlcCorteCatalogo();
    // Agregar Corte
    KdoButton($("#btnGuardar"), "save");
    KdoButton($("#btnCrearUniEmbalaje"), "plus-outline");
    KdoButton($("#btnFinalizarEmb"), "zoom-in");
    // crear detakle de preparado
    KdoButtonEnable($("#btnGuardar"), false);
    $("#txtIdDespachoMerc").val(0);



    if (readIdDespachoEmbalajeMercancia > 0) {
        fn_Get_DatosCab(readIdDespachoEmbalajeMercancia)
    } else {
        KdoButtonEnable($("#btnCrearUniEmbalaje"), false);
        KdoButtonEnable($("#btnFinalizarEmb"), false);
    }

    //#region crear bultos si preparar

    //CONFIGURACION DEL GRID,CAMPOS

    let dsCorte = new kendo.data.DataSource({
        transport: {
             read: {
                url: TSM_Web_APi + "EmbalajesMercancias/GetCortesPorEmbalar",
                contentType: "application/json; charset=utf-8",
                type: "POST"
            },
            parameterMap: function (data, type) {
                return kendo.stringify({
                    IdCliente: xidclie,
                    IdPlanta: xidPlanta,
                    IdMarca: xidMarca,
                    IdCatalogo: xidcata,
                    IdHojaBandeo: xidCorte,
                    IdListaEmpaque: xidListaEmpaque,
                    IdServicio: xidServicio,
                    IdDespachoMercancia: $("#txtIdDespachoMerc").val(),
                    Sugerido: readSugeridos === 0 ? false : true
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

    $("#gCortes").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        detailInit: DIDM,
        dataBound: function (e) {
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

            let grid = $("#gCortes").data("kendoGrid");
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
            { field: "TotalTallas", title: "Total Tallas" },
            { field: "TotaBultos", title: "Bultos" },
            { field: "ParteDecorada", title: "Parte Decorada" },
            { field: "CantidadIngreso", title: "Cantidad Ingreso" },
            { field: "CantidadDisponible", title: "Cantidad Disponible" },
            { field: "CantidadDespacho", title: "Cantidad Despacho" },
            {
                field: "btnGenerarEmbalaje",
                title: "&nbsp;",
                command: [
                    {
                        name: "b_search",
                        iconClass: "k-icon k-i-search m-0",
                        text: " ",
                        title: "&nbsp;",
                        click: function (e) {
                            let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            let strjson = {
                                config: [{
                                    Div: "vInfDiseno",
                                    Vista: "~/Views/Shared/_GenInfoFM.cshtml",
                                    Js: "GenInfoFM.js",
                                    Titulo: "Información General",
                                    Width: "60%",
                                    MinWidth: "40%"
                                }],
                                Param: {
                                    pIdHojaBandeo: dataItem.IdHojaBandeo
                                },
                                fn: { fnclose: "", fnLoad: "fn_Ini_GenInfo", fnReg: "fn_Reg_GenInfo", fnActi: "" }
                            };

                            fn_GenLoadModalWindow(strjson);
                        },
                    }
                ],
                width: "70px"
            }
        ]
    });

    //#endregion

    SetGrid($("#gCortes").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 659, false);
    Set_Grid_DataSource($("#gCortes").data("kendoGrid"), dsCorte);

    var selectedRows = [];

    $("#gCortes").data("kendoGrid").tbody.on("change", ".k-checkbox", function (e) {
        let checkbox = $(this);
        let nextRow = checkbox.closest("tr").next();
        let prevRow = "";
        let prevCheck = "";
        let currentRow = checkbox.closest("tr")[0];
        let allRows = checkbox.closest("tr")[0].parentElement.rows;
        let tallaActual = currentRow.cells[3].innerText;
        let contRowsChecked = 0;
        var acumRowChecked = 0;

        let gridElement = checkbox.closest(".lump-child-grid.k-grid.k-widget");

        if (gridElement.length > 0) {
            prevRow = checkbox.closest(".k-detail-row")[0].previousSibling;
            prevCheck = prevRow.children[1].children[0];
        }

        if (nextRow.hasClass("k-detail-row")) {
            nextRow.find(":checkbox").prop("checked", checkbox.is(":checked"));
        }

        //función para marcar y desmarcar todas las tallas
        $.each($(allRows), function (indice, elemento) {
            if (gridElement.length > 0) {
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

        if (prevRow != "" && prevCheck != "") {
            if (acumRowChecked == allRows.length) {
                prevCheck.checked = true;
            }
            else if (acumRowChecked == 0) {
                prevCheck.checked = false;
                prevRow.classList.remove("k-state-selected");
            }
            else {
                prevCheck.checked = false;
            }
        }

    });

    $("#gCortes").data("kendoGrid").thead.on("change", ".k-checkbox", function (e) {
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

    $("#gCortes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gCortes"), selectedRows);
    });


    $("#gCortes").data("kendoGrid").dataSource.read();


    if (readPlanta > 0 && readPlanta != "" && readPlanta != undefined) {
        xidPlanta = readPlanta;
        $("#cmbPlanta").data("kendoComboBox").value(readPlanta);
        KdoComboBoxEnable($("#cmbPlanta"), false);
    }
    else {
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
        KdoButtonEnable($("#btnGuardar"), true);
        $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
        });
    }

    if ( readSugeridos != undefined) {
        $('#chkSugerido').prop('checked', readSugeridos);
    } else {
        $('#chkSugerido').prop('checked', 0);
    }

    $("#chkSugerido").click(function () {
        if (this.checked) {
            readSugeridos = 1;
            $("#gCortes").data("kendoGrid").dataSource.read();

        } else {
            readSugeridos = 0;
            $("#gCortes").data("kendoGrid").dataSource.read();

        }
    });



    //#region crear grid Lista
    let dsDM = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "EmbalajesMercancias/GetCortesEnEmbalajes/" + xidDem; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "EmbalajesMercancias/DeleteEmbalajesMercanciasxId/" + `${datos.IdDespachoEmbalajeMercancia}/${datos.IdEmbalajeMercancia}`; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
         requestEnd: function (e) {
             Grid_requestEnd(e);
             if (e.type === "destroy") {
                 if ($("#gEnEmbalaje").data("kendoGrid").dataSource.total() === 0) {
                     $("#gCortes").data("kendoGrid").dataSource.read();
                 }
             }
             
         },
         error: Grid_error,
        schema: {
            model: {
                id: "IdEmbalajeMercancia",
                fields: {
                    IdEmbalajeMercancia: { type: "number" },
                    IdEmbalaje: { type: "number" },
                    NombreUnidadEmb: { type: "string" },
                    NoDocumento: { type: "string" },
                    CantTallas: { type: "number" },
                    CantBultos: { type: "number" },
                    Cantidad: { type: "number" },
                    IdDespachoEmbalajeMercancia: { type: "number" },
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gEnEmbalaje").kendoGrid({
        detailInit: DIDM,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEmbalajeMercancia", title: "IdEmbalajeMercancia", hidden: true },
            { field: "IdEmbalaje", title: "IdEmbalaje", hidden: true },
            { field: "NombreUnidadEmb", title: "Unidad Embalaje", attributes: { "class": "selFM" } },
            { field: "NoDocumento", title: "NoDocumento" },
            { field: "CantTallas", title: "Cantidad Tallas" },
            { field: "CantBultos", title: "Cantidad Bultos" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "IdDespachoEmbalajeMercancia", title: "Id Despacho Emb Mercancia", hidden: true }
            
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gEnEmbalaje").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659, false);
    SetGrid_CRUD_ToolbarTop($("#gEnEmbalaje").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gEnEmbalaje").data("kendoGrid"), false, true);
    Set_Grid_DataSource($("#gEnEmbalaje").data("kendoGrid"), dsDM);

    $("#btnGuardar").click(function () {

        if (Kendo_CmbGetvalue($("#cmbPlanta")) === 0 || Kendo_CmbGetvalue($("#cmbPlanta")) === undefined) {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar una planta para continuar.", "error");
        } else {
            fn_GenCabEmbalaje();
        }


    });

    $("#btnCrearUniEmbalaje").click(function () {
        kendo.ui.progress($(document.body), true);
        rowsHijo = [];
        mercancias = [];
        $.each($(".k-state-selected.k-master-row"), function (index, elemento) {
            rowsHijo.push(elemento);

        });

        $.each($(rowsHijo), function (index, elemento) {
            if (Number(elemento.cells[4].innerText) ) {
                mercancias.push(parseInt(elemento.cells[4].innerText));
            }
           
        });


        if ( mercancias.length >0) {
            $.ajax({
                url: TSM_Web_APi + "EmbalajesMercancias/GetDetalleMercanciaEmbalar",
                dataType: 'json',
                type: 'post',
                data: JSON.stringify({
                    IdMercancias: mercancias
                }),
                contentType: "application/json; charset=utf-8",
                success: function (datos) {
                    let strjson = {
                        config: [{
                            Div: "vCrearUnidad",
                            Vista: "~/Views/CrearEmbalaje/_CreacionEmbalaje.cshtml",
                            Js: "CreacionEmbalaje.js",
                            Titulo: "Crear Unidad de Embalaje",
                            Width: "50%",
                            MinWidth: "30%"
                        }],
                        Param: {
                            pvModal: "vCrearUnidad",
                            pArrayCortes: datos, //Columnas: Corte, Tallas, Cantidad
                            pCantidadPiezas: datos[0].TotalPiezas,
                            pCantidadBultos: datos[0].TotalBultos,
                            pCantidadCortes: datos[0].TotalCortes,
                            pIdDespachoEmbalajeMercancia: $("#txtNoDoc").val(),
                            pIdDespachoMercancia: $("#txtIdDespachoMerc").val(),
                            pIdPlanta: Kendo_CmbGetvalue($("#cmbPlanta")),
                            pIdCliente: Kendo_CmbGetvalue($("#cmbCliente")),
                            pIdMercancias: mercancias
                        },
                        fn: { fnclose: "fn_RefreshGrid", fnLoad: "fn_Ini_CreacionEmbalaje", fnReg: "fn_Reg_CreacionEmbalaje", fnActi: "" }
                    };

                    fn_GenLoadModalWindow(strjson);
                    kendo.ui.progress($(document.body), false);
                },
                error: function () {
                    kendo.ui.progress($(document.body), false);
                }
            });
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar almenos una fila de la mercancia.", "error");
            kendo.ui.progress($(document.body), false);
        }
  


    });

    $("#btnFinalizarEmb").click(function () {

        if (readIdDespachoEmbalajeMercancia > 0 && $("#gEnEmbalaje").data("kendoGrid").dataSource.total() !== 0) {
            kendo.ui.progress($(document.body), true);
            $.ajax({
                url: TSM_Web_APi + "EmbalajesMercancias/Estado/CambiarEstadoEmbalajeRegistrados",
                method: "POST",
                dataType: "json",
                data: JSON.stringify({
                    IdDespachoEmbalajeMercancia: readIdDespachoEmbalajeMercancia,
                    EstadoSiguiente: "FINALIZADO",
                    Motivo: "EMBALAJE FINALIZADO"
                }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    RequestEndMsg(data, "Post");
                    $("#gEnEmbalaje").data("kendoGrid").dataSource.read();
                    window.location = window.location.origin + `/ControlUnidadesEmbalaje`;

                },
                error: function (data) {
                    ErrorMsg(data);
                },
                complete: function () {
                    kendo.ui.progress($(document.body), false);
                }
            })
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("No hay embalajes generados para finalizar", "error");
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnGuardar"), true);
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
                KdoButtonEnable($("#btnGuardar"), false);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnGuardar"), true);
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
                KdoButtonEnable($("#btnGuardar"), false);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
                KdoButtonEnable($("#btnGuardar"), false);
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    fn_readonly();
                    closeOpenDetailGrid();
                });

            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
           /*     KdoButtonEnable($("#btnMoveData"), false);*/
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
            $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
            $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
            $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
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
            $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                closeOpenDetailGrid();
            });
        }
        else {
            $("#gCortes").data("kendoGrid").dataSource.data([]);
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
                $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
                    closeOpenDetailGrid();
                });
            }
            else {
                $("#gCortes").data("kendoGrid").dataSource.data([]);
            }
        }

    });

    $("#btnRetornar").click(function () {
        window.location = window.location.origin + `/ControlUnidadesEmbalaje`;
    });

    if (readIdDespachoEmbalajeMercancia > 0 && readIdDespachoEmbalajeMercancia != "" && readIdDespachoEmbalajeMercancia != undefined) {
        xidDem = readIdDespachoEmbalajeMercancia;
        $("#gEnEmbalaje").data("kendoGrid").dataSource.read
        KdoButtonEnable($("#btnGuardar"), false);
    }

    $("#gEnEmbalaje").data("kendoGrid").bind("dataBound", function (e) {
      
        if ($("#gEnEmbalaje").data("kendoGrid").dataSource.total() === 0) {
            KdoButtonEnable($("#btnFinalizarEmb"), false);
        } else {
            KdoButtonEnable($("#btnFinalizarEmb"), true);
        }

    });
   
});

var fn_readonly = () => {
    var gCortes = $("#gCortes").data("kendoGrid");
    var data = gCortes.dataItem("tbody>tr:eq(0)");
}

var DIDM = (e) => {

    let classList = e.masterRow[0].cells[3].classList;
   
    if (classList.contains("selFM") == true) {
        /////////////////////////////////GRID DERECHO///////////////////////////////////
   
        let vidEmbmerc = e.masterRow[0].cells[1].innerText === null ? 0 : e.masterRow[0].cells[1].innerText;
        let rowId2 = e.masterRow[0].cells[1].innerText;

        let VdSDM = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + `EmbalajesMercancias/GetCortesEnEmbalajesDet/${vidEmbmerc}`; },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                destroy: {
                    url: function (datos) { return TSM_Web_APi + "EmbalajesMercancias/DeleteEmbalajesMercanciasxIdHojaBandeo/" + `${datos.IdEmbalajeMercancia}/${datos.IdHojaBandeo}`; },
                    dataType: "json",
                    type: "DELETE"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            requestEnd: function (e) {
                Grid_requestEnd(e);
                if (Gdet !== undefined) {
                    if (Gdet.dataSource.total() === 0 && e.type === "destroy") {
                        $("#gEnEmbalaje").data("kendoGrid").dataSource.read();
                        $("#gCortes").data("kendoGrid").dataSource.read();
                    }
                }
            },
            error: Grid_error,
            schema: {
                model: {
                    id: "IdEmbalajeMercancia",
                    fields: {
                        IdDespachoEmbalajeMercancia: { type: "number" },
                        IdEmbalajeMercancia: { type: "number" },
                        IdHojaBandeo: { type: "number" },
                        Corte: { type: "string" },
                        CantTallas: { type: "number" },
                        CantBultos: { type: "number" },
                        Cantidad: { type: "number" }
                    }
                }
            },
            filter: { field: "IdEmbalajeMercancia", operator: "eq", value: e.masterRow[0].cells[1].innerText }
        };

        let gt = $(`<div id= "gridDM${rowId2}"></div>`).appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdDespachoEmbalajeMercancia", title: "Id DespachoEmbalaje Mercancia", hidden: true },
                { field: "IdEmbalajeMercancia", title: "IdEmbalaje Mercancia", hidden: true },
                { field: "IdHojaBandeo", title: "IdHoja Bandeo", hidden: true, attributes: { "class": "idHB-detail" } },
                { field: "Corte", title: "Corte" },
                { field: "CantTallas", title: "Cantidad Tallas" },
                { field: "CantBultos", title: "Cantidad Bultos" },
                { field: "Cantidad", title: "Cantidad" }
                
            ]
        });

        ConfGDetalleDM(gt.data("kendoGrid"), VdSDM, "gFor_detalleDM" + vidEmbmerc);

        let selectedRowsTec = [];
        gt.data("kendoGrid").bind("dataBound", function (e) { 
            Gdet = gt.data("kendoGrid");

        });
        gt.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(gt, selectedRowsTec);
        });
        ////////////////////////////////////////////////////////////////////////////////
    }
    else {
        /////////////////////////////////GRID IZQUIERDO///////////////////////////////////
        let vidhb = e.data.IdHojaBandeo === null ? 0 : e.data.IdHojaBandeo;
        let rowId = e.data.RowId;
        let VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + `EmbalajesMercancias/GetCortesPorEmbalarDet/${vidhb}/${$("#txtIdDespachoMerc").val()}/${readSugeridos === 0 ? false : true}`; },
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
    SetGrid_CRUD_Command(gt, false, true, Id_gCHForDetalleX);
    Set_Grid_DataSource(gt, ds2);
}

var ConfGDetalle = (g, ds, Id_gCHForDetalle) => {
    SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0, false);
    SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
    Set_Grid_DataSource(g, ds);
}




var closeOpenDetailGrid = () => {
    var gridV = $("#gCortes").data("kendoGrid");

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
            Width: "80%",
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

let fn_Get_DatosCab = (xIdDesEm) => {
    kendo.ui.progress($(document), true);
    $.ajax({
        url: TSM_Web_APi + "DespachosEmbalajesMercancias/GetDatosCab/" + `${xIdDesEm}`,
        dataType: 'json',
        type: 'GET',
        async:false,
        success: function (dato) {
            if (dato !== null) {
                KdoCmbSetValue($("#cmbPlanta"), dato.IdPlanta);
                $("#txtNoDoc").val(dato.IdDespachoEmbalajeMercancia);
                $("#txtIdDespachoMerc").val(dato.IdDespachoMercancia);
                KdoComboBoxEnable($("#cmbPlanta"), false);
                KdoButtonEnable($("#btnGuardar"), false);
                xidPlanta = KdoCmbGetValue($("#cmbPlanta"))
            } else {
                KdoCmbSetValue($("#cmbPlanta"),"");
                $("#txtNoDoc").val("");
                $("#txtIdDespachoMerc").val(0);
                KdoComboBoxEnable($("#cmbPlanta"), true);
                KdoButtonEnable($("#btnGuardar"), true);
                xidPlanta = null;
            }
            kendo.ui.progress($(document), false);
        },
        error: function () {
            kendo.ui.progress($(document), false);
        }
    });

};


const fn_GenCabEmbalaje = () => {
    let resul = false;
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "EmbalajesMercancias/GenerarEmbalajeMercancia",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            IdDespachoEmbalajeMercancia: 0,
            IdUsuario: getUser(),
            IdCliente: Kendo_CmbGetvalue($("#cmbCliente")),
            IdPlanta: Kendo_CmbGetvalue($("#cmbPlanta")),
            IdDespachoMercancia: 0
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            $("#txtNoDoc").val(datos[0]);
            fn_Get_DatosCab(datos[0]);
            RequestEndMsg(datos, "Post");
            kendo.ui.progress($(document.body), false);
            KdoButtonEnable($("#btnCrearUniEmbalaje"), true);
            xidDem = datos[0];
            readIdDespachoEmbalajeMercancia = xidDem = datos[0];
            resul = true;
            window.history.pushState('', '', `/CrearEmbalaje/${KdoCmbGetValue($("#cmbCliente"))}/${datos[0]}/${KdoCmbGetValue($("#cmbPlanta"))}/${readSugeridos}`);
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(document.body), false);
            resul = false;
        }
    });
    return resul;

}

var fn_RefreshGrid = () => {
    $("#gCortes").data("kendoGrid").dataSource.read();
    $("#gEnEmbalaje").data("kendoGrid").dataSource.read();
}