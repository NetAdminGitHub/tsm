﻿'use strict'
var Permisos;
let xIdIngreso = 0;
let xidcata = 0;
let xidCorte = 0;
let xidServicio = 0;
let xIdDespachoEmb = 0;
let Gdet;
let xOpcion = 0;
let xCliente = 0;
let xPlanta = 0;
function myconfirm(content) {
    return $("<div></div>").kendoConfirm({
        title: "Finalizar Embalaje",
        content: content
    }).data("kendoConfirm").open().result;
}
$(document).ready(function () {
    KdoButton($("#btnFinalizarEmb"), "zoom-in");
    KdoButton($("#btnRetornar"), "arrow-left", "Regresar");
    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    $("#dfDespacho").kendoDatePicker({ format: "dd/MM/yyyy" });

    /* inhabilitar textbox*/
    TextBoxEnable($("#txtCliente"), false);
    TextBoxEnable($("#txtPlanta"), false);
    TextBoxEnable($("#txtOrdenDespacho"), false);
    KdoDatePikerEnable($("#dfDespacho"), false);

    /*combo filtrar por opcion 1: Solicitado para Despachar 2: Disponible en Bodega */
    KdoComboBoxbyData($("#cmbOpcion"), "[]", "Nombre", "IdOpcion", "Seleccione ....");
    $("#cmbOpcion").data("kendoComboBox").dataSource.pushCreate([
        { IdOpcion: 1, Nombre: "Solicitado para Despachar" },
        { IdOpcion: 2, Nombre: "Disponible en Bodega" },
     
    ]);

    KdoCmbSetValue($("#cmbOpcion"), 1);
    xOpcion = KdoCmbGetValue($("#cmbOpcion"));

    //crear combobox catalogo 
    $("#cmbFm").mlcFmCatalogo();
    $("#cmbCorte").mlcCorteCatalogo();

    // crear detalle de preparado
    $("#txtIdDespachoMerc").val(0);

    //obtner los datos de la cabecera del embalaje
    fn_Get_DatosCab(xIdDespachoMercancia)
    
    //#region Listar bultos sin o por embalar

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
                    IdDespachoMercancia: $("#txtIdDespachoMerc").val(),
                    IdCatalogo: xidcata,
                    IdHojaBandeo: xidCorte,
                    IdServicio: xidServicio,
                    opcion:xOpcion
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


    //#endregion

    //#region listar cortes en embalaje

    let dsDM = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "EmbalajesMercancias/GetCortesEnEmbalajes/" + xIdDespachoEmb; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "EmbalajesMercancias/DeleteEmbalajesMercanciasxId/" + `${datos.IdDespachoEmbalajeMercancia}/${datos.IdEmbalajeMercancia}`; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "EmbalajesMercancias/UpdEmbalajesMercanciaPeso/" + `${datos.IdEmbalajeMercancia}`; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    if (type === "update") {
                        return kendo.stringify({
                            IdEmbalajeMercancia: data.IdEmbalajeMercancia,
                            Peso: data.Peso
                        });
                    } else {
                        return kendo.stringify(data);
                    }

                }
            }
        },
         requestEnd: function (e) {
             Grid_requestEnd(e);
             if (e.type === "destroy") {
                     $("#gCortes").data("kendoGrid").dataSource.read();
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
                    Peso: {
                        type: "number",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Peso']")) {
                                    input.attr("data-maxlength-msg", "debe ser mayor que 0");
                                    return $("[name='Peso']").data("kendoNumericTextBox").value() > 0;
                                }

                                return true;
                            }
                        }
                    },
                    IdUnidad: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gEnEmbalaje").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdEmbalajeMercancia");
            KdoHideCampoPopup(e.container, "IdEmbalaje");
            KdoHideCampoPopup(e.container, "NombreUnidadEmb");
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "IdUnidad");
            KdoHideCampoPopup(e.container, "CantTallas");
            KdoHideCampoPopup(e.container, "CantBultos");
            KdoHideCampoPopup(e.container, "Cantidad");
            KdoHideCampoPopup(e.container, "IdDespachoEmbalajeMercancia");

            Grid_Focus(e, "Peso");
        },
        detailInit: DIDM,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEmbalajeMercancia", title: "IdEmbalajeMercancia", hidden: true },
            { field: "IdEmbalaje", title: "IdEmbalaje", hidden: true },
            { field: "NombreUnidadEmb", title: "Unidad Embalaje", attributes: { "class": "selFM" } },
            { field: "NoDocumento", title: "Documento" },
            { field: "CantTallas", title: "Cantidad Tallas" },
            { field: "CantBultos", title: "Cantidad Bultos" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Peso", title: "Peso (Kg.)", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n", 2], format: "{0:n2}" },
            { field: "IdUnidad", title: "IdUnidad", hidden: true },
            { field: "IdDespachoEmbalajeMercancia", title: "Id Despacho Emb Mercancia", hidden: true }
            
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gEnEmbalaje").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 659, false);
    SetGrid_CRUD_ToolbarTop($("#gEnEmbalaje").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gEnEmbalaje").data("kendoGrid"), true, true);
    Set_Grid_DataSource($("#gEnEmbalaje").data("kendoGrid"), dsDM);
    //#endregion
   
    //#region Filtros de vista

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbFm").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        xidcata = data === undefined ? 0 : this.value();
        $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
        });

    });

    $("#cmbCorte").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#cmbCorte").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdHojaBandeo === Number(this.value()));
        xidCorte = data === undefined ? 0 : this.value();

        $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
        });

    });


    $("#cmbOpcion").data("kendoComboBox").bind("change", function () {
        xOpcion = this.value() === "" ? 0 : this.value();

        $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
        });

    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function () {
        xidServicio = this.value() === "" ? 0 : this.value();

        $("#gCortes").data("kendoGrid").dataSource.read().then(function () {
            closeOpenDetailGrid();
        });

    });

    //#endregion 

    //#region Botones de negocio
    $("#btnFinalizarEmb").click(function () {

        if (xIdDespachoMercancia > 0 && $("#gEnEmbalaje").data("kendoGrid").dataSource.total() !== 0) {

            window.myconfirm("¿Está seguro de que desea finalizar el embalaje?").then(function () {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    url: TSM_Web_APi + "EmbalajesMercancias/Estado/CambiarEstadoEmbalajeRegistrados",
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify({
                        IdDespachoEmbalajeMercancia: xIdDespachoMercancia,
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
            }, function () {
                $("#cmbOpcion").focus();
            });



        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("No hay embalajes generados para finalizar", "error");
        }


    });
    $("#btnRetornar").click(function () {
        window.location = window.location.origin + `/ControlUnidadesEmbalaje`;
    });
    $("#gEnEmbalaje").data("kendoGrid").bind("dataBound", function (e) {
      
        if ($("#gEnEmbalaje").data("kendoGrid").dataSource.total() === 0) {
            KdoButtonEnable($("#btnFinalizarEmb"), false);
        } else {
            KdoButtonEnable($("#btnFinalizarEmb"), true);
        }

    });

    // #endregion

    //cargada la pagina leer los grid
    $("#gCortes").data("kendoGrid").dataSource.read();
    $("#gEnEmbalaje").data("kendoGrid").dataSource.read();
   
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
                        Cantidad: { type: "number" },
                        Tallas: { type: "string" }
                       
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
                { field: "Tallas", title: "Tallas" },
                { field: "CantTallas", title: "Cantidad Tallas", hidden: true },
                { field: "CantBultos", title: "Cantidad Bultos" },
                { field: "Cantidad", title: "Cantidad" }
            ]
        });

        fn_g_Der_Configdet(gt.data("kendoGrid"), VdSDM, "gFor_detalleDM" + vidEmbmerc);

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
                    url: function () { return TSM_Web_APi + `EmbalajesMercancias/GetCortesPorEmbalarDet/${vidhb}/${$("#txtIdDespachoMerc").val()}/${xOpcion}`; },
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

        fn_g_Izq_Configdet(g.data("kendoGrid"), VdS, "gFor_detalle" + vidhb);

        let selectedRowsTec = [];


        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
        ////////////////////////////////////////////////////////////////////////////////
    }

}

//configurar detalle Grid izquierdo
var fn_g_Der_Configdet = (gt, ds2, Id_gCHForDetalleX) => {
    SetGrid(gt, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0,);
    SetGrid_CRUD_Command(gt, false, true, Id_gCHForDetalleX);
    Set_Grid_DataSource(gt, ds2);
}
//configurar detalle Grid izquierdo
var fn_g_Izq_Configdet = (g, ds, Id_gCHForDetalle) => {
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

var loadModalCorte = (IdHojaBandeo, Corte,IdCatalogoDiseno) => {
    let strjson = {
        config: [{
            Div: "vConsultaEtapa",
            Vista: "~/Views/Shared/_ConsultaEtapaCorte.cshtml",
            Js: "ConsultaEtapaCorte.js",
            Titulo: "Estatus Etapas",
            Width: "80%",
            MinWidth: "30%"
        }],
        Param: { IdModulo: 9, IdHojaBandeo: IdHojaBandeo, Corte: Corte, IdCatalogoDiseno: IdCatalogoDiseno },
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
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetFiltrobyCliente/" + `${xCliente}`; },
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
                                return TSM_Web_APi + "HojasBandeos/GetHojasBandeobyFM/" + `${KdoMultiColumnCmbGetValue($("#cmbFm")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbFm"))}/${xPlanta}`;
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "Corte", title: "Corte", width: 300 },
                    { field: "NoDocumento", title: "Documento", width: 300 },
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "IdCatalogoDiseno",title:"IdCatalogo",hidden:true},
                    {
                        field: "Button", title: "Detalle", template: "<button class='k-button k-button-icontext k-grid-b_search' onclick='loadModalCorte(\"#=data.IdHojaBandeo#\",\"#=data.Corte#\,\"#=data.IdCatalogoDiseno#\")'><span class='k-icon k-i-eye m-0'></span> </button>", width: 90
                    }
                ]
            });
        });
    }
});

let fn_Get_DatosCab = (xIdDesEm) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DespachosEmbalajesMercancias/GetDatosCab/" + `${xIdDesEm}`,
        dataType: 'json',
        type: 'GET',
        async:false,
        success: function (dato) {
            if (dato !== null) {
                xCliente = dato.IdCliente;
                xPlanta = dato.IdPlanta;
                xIdDespachoEmb = dato.IdDespachoEmbalajeMercancia;
                $("#txtCliente").val(dato.NombreCliente);
                $("#txtPlanta").val(dato.NombrePlanta);
                $("#txtNoDoc").val(dato.IdDespachoEmbalajeMercancia);
                $("#txtOrdenDespacho").val(dato.NoDocumento);
                $("#txtIdDespachoMerc").val(dato.IdDespachoMercancia);
                $("#dfDespacho").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaEntrega), 'dd/MM/yyyy'));
            } else {
                xCliente = 0;
                xPlanta = 0;
                xIdDespachoEmb = 0;
                $("#txtNoDoc").val("");
                $("#txtIdDespachoMerc").val(0);
                $("#txtCliente").val("");
                $("#txtPlanta").val("");
                $("#txtOrdenDespacho").val("");
                $("#dfDespacho").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaEntrega), 'dd/MM/yyyy'));
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};



var fn_RefreshGrid = () => {
    $("#gCortes").data("kendoGrid").dataSource.read();
    $("#gEnEmbalaje").data("kendoGrid").dataSource.read();
}