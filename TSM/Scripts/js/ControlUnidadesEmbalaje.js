"use strict"
var Permisos;

let idCliente = 0;
let idMarca = 0;
let idPlanta = 0;
let idServicio = 0;

let StrIdEmbalajeMercancia = [];
let arrayCortes = [];

$(document).ready(function () {

    KdoButton($("#btnCrearListaEmpaque"), "plus-outline", "Crear Lista de Empaque");

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    KdoComboBoxbyData($("#cmbMarca"), "[]", "Nombre2", "IdMarca", "Seleccione una Marca");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbServicio"), TSM_Web_APi + "Servicios", "Nombre", "IdServicio", "Seleccione un Servicio");
    KdoComboBoxFM($("#cmbFM"), "[]", "NodocCatalogo", "IdCatalogoDiseno", "Seleccione un Diseño", "", "", false);

    TextBoxEnable($("#txtCodigoFM"), false);
    TextBoxEnable($("#txtDiseño"), false);
    TextBoxEnable($("#txtEstilo"), false);
    TextBoxEnable($("#txtNumero"), false);
    TextBoxEnable($("#txtColorTela"), false);
    TextBoxEnable($("#txtParte"), false);
    TextBoxEnable($("#txtProducto"), false);
    TextBoxEnable($("#txtServicio"), false);

    let dataSource = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        IdCliente: idCliente,
                        IdPlanta: idPlanta,
                        IdMarca: idMarca,
                        IdServicio: idServicio
                    }),
                    url: TSM_Web_APi + "EmbalajesMercanciasDetalles/GetEmbalajesMercanciasControl/",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
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
                id: "IdEmbalajeMercancia",
                fields: {
                    IdEmbalajeMercancia: { type: "number" },
                    NoDocumento: { type: "string" },
                    FechaCreacion: { type: "date" },
                    IdEmbalaje: { type: "number" },
                    CantidadCortes: { type: "number" },
                    CantidadMercancia: { type: "number" },
                    Cantidad: { type: "number" }
                }
            }
        }
    });

    $("#gridEmbalajes").kendoGrid({
        detailInit: detailInit,
        dataBound: function () {
            let grid = $("#gridEmbalajes").data("kendoGrid");
            $("tr.k-master-row").each(function (index) {
                grid.expandRow(this);
            });
            infoDiseno(0);
            setFMCbxData(0);
        },
        change: function (e) {
            let grid = $("#gridEmbalajes").data("kendoGrid");
            let rows = e.sender.select();

            let EmbalajeMercancia = [];
            rows.each(function (e) {
                let dataItem = grid.dataItem(this);
                EmbalajeMercancia.push(dataItem.IdEmbalajeMercancia);
            });
            StrIdEmbalajeMercancia = EmbalajeMercancia;

            let objDataRows = [];
            rows.each(function (e) {
                let detailRows = $(this).next().children().find(".lump-child-grid").find("tr.k-master-row");
                let grid = $(this).next().children().find(".lump-child-grid").data("kendoGrid");
                detailRows.each(function (e) {
                    let item = grid.dataItem(this);
                    objDataRows.push(item);
                })
            })
            arrayCortes = objDataRows;

            let arreglo = [];
            arrayCortes.forEach((e) => {
                let item = {};
                if (arreglo.find(x => x.Corte == e.Corte) == null) {
                    item = {
                        Corte: e.Corte,
                        Talla: e.Talla,
                        Cantidad: e.Cantidad,
                        Docenas: e.Docenas,
                        bultos: 1
                    };
                    arreglo.push(item);
                }
                else {
                    let index = arreglo.findIndex(x => x.Corte == e.Corte);
                    arreglo[index].Talla = arreglo[index].Talla.concat(", ", e.Talla);
                    arreglo[index].Cantidad = arreglo[index].Cantidad + e.Cantidad;
                    arreglo[index].Docenas = arreglo[index].Docenas + e.Docenas;
                    arreglo[index].bultos++;
                }
            })
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "35px" },
            { field: "IdEmbalajeMercancia", title: "id", hidden: true },
            { field: "IdEmbalaje", title: "id Embalaje", hidden: true },
            { field: "NoDocumento", title: "Correlativo" },
            { field: "FechaCreacion", title: "Fecha Registro", format: "{0: dd/MM/yyyy HH:mm:ss}" },
            { field: "UnidadEmbalaje", title: "Unidad Embalaje" },
            { field: "CantidadCortes", title: "Corte" },
            { field: "CantidadMercancia", title: "Mercancía" },
            { field: "Cantidad", title: "Cantidad" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridEmbalajes").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 650, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridEmbalajes").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEmbalajes").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEmbalajes").data("kendoGrid"), dataSource);

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        idCliente = this.value() === "" ? 0 : this.value();

        let dsm = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + `ClientesMarcas/GetByCliente/${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente"))}` },
                    contentType: "application/json; charset=utf-8"
                }
            }
        });

        idMarca = 0;
        idPlanta = 0;
        idServicio = 0;

        $("#cmbMarca").data("kendoComboBox").value("");
        $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);

        $("#gridEmbalajes").data("kendoGrid").dataSource.read();
    });

    $("#cmbMarca").data("kendoComboBox").bind("change", function () {
        idMarca = this.value() === "" ? 0 : this.value();
        $("#gridEmbalajes").data("kendoGrid").dataSource.read();
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        idPlanta = this.value() === "" ? 0 : this.value();
        $("#gridEmbalajes").data("kendoGrid").dataSource.read();
    });

    $("#cmbServicio").data("kendoComboBox").bind("change", function () {
        idServicio = this.value() === "" ? 0 : this.value();
        $("#gridEmbalajes").data("kendoGrid").dataSource.read();
    });

    $("#cmbFM").data("kendoComboBox").bind("change", function () {
        let idCatalogo = this.value() === "" ? 0 : this.value();
        infoDiseno(idCatalogo);
    });

    $("#btnCrearListaEmpaque").data("kendoButton").bind("click", function (e) {

        let strjson = {
            config: [{
                Div: "vMod_RegistroListaEmpaque",
                Vista: "~/_RegistroListaEmpaque.cshtml",
                Js: "RegistroListaEmpaque.js",
                Titulo: `Revisión para Registro de Lista de Empaque.`,
                Height: "80%",
                Width: "80%",
                MinWidth: "30%"
            }],
            Param: {
                pCorte: $("#txtCorteProceso").val(),
                pvModal: "vMod_RegistroListaEmpaque",
                plistaCortes: []
            },
            fn: { fnclose: "fn_RefreshGrid", fnLoad: "fn_Ini_StatusOrdenDespacho", fnReg: "fn_Reg_StatusOrdenDespacho", fnActi: "" }
        };

        fn_GenLoadModalWindow(strjson);

    });

});

const detailInit = (e) => {

    let vIdEmbalajeMercancia = e.data.IdEmbalajeMercancia === null ? 0 : e.data.IdEmbalajeMercancia;

    let dsCortes = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `EmbalajesMercanciasDetalles/GetEmbalajesMercanciasControlDetalle/${vIdEmbalajeMercancia}`;
                },
                dataType: "json",
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
                id: "IdEmbalajeMercancia",
                fields: {
                    IdEmbalajeMercancia: { type: "number" },
                    IdEmbalaje: { type: "number" },
                    IdMercancia: { type: "number" },
                    IdHojaBandeo: { type: "number" },
                    NoDocumento: { type: "string" },
                    FechaCreacion: { type: "date" },
                    Corte: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    Docenas: { type: "number" },
                    Primera: { type: "number" },
                    CantidadSegunda: { type: "number" },
                    CantidadAveria: { type: "number" }
                }
            }
        },
        filter: { field: "IdEmbalajeMercancia", operator: "eq", value: e.data.IdEmbalajeMercancia }
    });

    let detailGrid = $("<div class='lump-child-grid'/>").appendTo(e.detailCell).kendoGrid({
        change: function (e) {
            let row = e.sender.select();
            let data = this.dataItem(row);
            setFMCbxData(data.IdHojaBandeo);            
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMercancia", title: "Id Mercancia", attributes: { "class": "idMercancia-detail" }, hidden: true },
            { field: "IdHojaBandeo", title: "Id Hoja Bandeo", attributes: { "class": "idHojaBandeo-detail" }, hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "Talla", title: "Talla" },
            { field: "NoDocumento", title: "Bulto/#Rollo", attributes: { "class": "idBulto-detail" } },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Primera", title: "Primeras" },
            { field: "CantidadSegunda", title: "Segundas" },
            { field: "CantidadAveria", title: "Averia" }
        ]
    });

    ConfGDetalle(detailGrid.data("kendoGrid"), dsCortes, "gFor_detalle" + vIdEmbalajeMercancia);

    let selectedRowsTec = [];
    detailGrid.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(detailGrid, selectedRowsTec);
    });
}

const ConfGDetalle = (g, ds, Id_gCHForDetalle) => {
    SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0, "row");
    SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
    Set_Grid_DataSource(g, ds);
}

const setFMCbxData = (IdHojaBandeo) => {
    let dsFM = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `HojasBandeosDisenos/GetFMs/${IdHojaBandeo}`
                },
                contentType: "application/json; charset=utf-8"
            }
        }
    });
    $("#cmbFM").data("kendoComboBox").setDataSource(dsFM);
    setTimeout(function () {
        let cbFM = $("#cmbFM").data("kendoComboBox");
        cbFM.value("");

        if (cbFM.dataSource.data().length > 0) {
            cbFM.select(cbFM.ul.children().eq(0));
            infoDiseno(KdoCmbGetValue($("#cmbFM")));
        }
    }, 250);
}

const infoDiseno = (idCatalogo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFmxIdCatalogo/" + `${idCatalogo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            let img = $("#divImagenDiseno");
            img.children().remove();

            if (dato !== null) {
                //$("#txtCodigoFM").val(dato.NoReferencia);
                $("#txtDiseño").val(dato.Nombre);
                $("#txtEstilo").val(dato.EstiloDiseno);
                $("#txtColorTela").val(dato.ColorTela);
                $("#txtParte").val(dato.NombreParte);
                $("#txtProducto").val(dato.NombrePrenda);
                $("#txtServicio").val(dato.NombreServicio);
                $("#txtNumero").val(dato.NumeroDiseno);

                img.append('<img class="k-card-image rounded mx-auto d-block" src="/Adjuntos/' + dato.NoReferencia + '/' + dato.NombreArchivo + '" onerror="imgError(this)"  />');
            } else {
                //$("#txtCodigoFM").val("");
                $("#txtDiseño").val("");
                $("#txtEstilo").val("");
                $("#txtColorTela").val("");
                $("#txtParte").val("");
                $("#txtProducto").val("");
                $("#txtServicio").val("");
                $("#txtNumero").val("");

                img.append('<img class="k-card-image rounded mx-auto d-block" src="' + srcDefault + '"/>')
            }

            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}

const KdoComboBoxFM = function (e, datos, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton) {
    e.kendoComboBox({
        dataTextField: textField,
        dataValueField: valueField,
        autoWidth: true,
        filter: "contains",
        clearButton: givenOrDefault(clearButton, true),
        placeholder: givenOrDefault(opcPlaceHolder, "Seleccione un valor ...."),
        height: givenOrDefault(opcHeight === "" || opcHeight === 0 ? undefined : opcHeight, 550),
        cascadeFrom: givenOrDefault(parentCascade, ""),
        dataSource: function () { return datos; }
    });
};

fPermisos = (datos) => {
    Permisos = datos;
};