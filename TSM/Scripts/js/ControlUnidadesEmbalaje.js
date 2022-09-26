"use strict"
var Permisos;

let idCliente = 0;
let idMarca = 0;
let idPlanta = 0;
let idServicio = 0;
let IdDespachoMercancia = 0;

let StrIdEmbalajeMercancia = [];
let arrayEmbalajeMercancia = [];

$(document).ready(function () {

    KdoButton($("#btnCrearListaEmpaque"), "plus-outline", "Crear Lista de Empaque");
    KdoButton($("#btnCrearEmbalaje"), "plus-outline", "Crear Nuevo Embalaje");

    KdoButtonEnable($("#btnCrearListaEmpaque"), false);
    KdoButtonEnable($("#btnCrearEmbalaje"), false);

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    KdoComboBoxbyData($("#cmbMarca"), "[]", "Nombre2", "IdMarca", "(Opcional)");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "(Opcional)");
    KdoComboBoxFM($("#cmbFM"), "[]", "NodocCatalogo", "IdCatalogoDiseno", "Seleccione un Diseño", "", "", false);
    $("#cmbDespacho").mlcDespachos();

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
                        IdDespachoMercancia: IdDespachoMercancia
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
            infoDiseno(0);
            setFMCbxData(0);
        },
        change: function (e) {
            let grid = $("#gridEmbalajes").data("kendoGrid");
            let rows = e.sender.select();

            let idEmbalajeMercancia = [];
            let listaEmbalajeMercancia = [];
            rows.each(function (e) {
                let dataItem = grid.dataItem(this);
                idEmbalajeMercancia.push(dataItem.IdEmbalajeMercancia);
                listaEmbalajeMercancia.push(dataItem);
            });
            StrIdEmbalajeMercancia = idEmbalajeMercancia;
            arrayEmbalajeMercancia = listaEmbalajeMercancia;
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

        if (idCliente > 0)
            KdoButtonEnable($("#btnCrearEmbalaje"), true);
        else
            KdoButtonEnable($("#btnCrearEmbalaje"), false);

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

        $("#cmbDespacho").data("kendoMultiColumnComboBox").value("");
        $("#cmbDespacho").data("kendoMultiColumnComboBox").dataSource.read();

        KdoButtonEnable($("#btnCrearListaEmpaque"), false);
    });

    $("#cmbMarca").data("kendoComboBox").bind("change", function () {
        idMarca = this.value() === "" ? 0 : this.value();

        $("#cmbDespacho").data("kendoMultiColumnComboBox").value("");
        $("#cmbDespacho").data("kendoMultiColumnComboBox").dataSource.read();

        $("#gridEmbalajes").data("kendoGrid").dataSource.read();
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        idPlanta = this.value() === "" ? 0 : this.value();

        $("#cmbDespacho").data("kendoMultiColumnComboBox").value("");
        $("#cmbDespacho").data("kendoMultiColumnComboBox").dataSource.read();

        $("#gridEmbalajes").data("kendoGrid").dataSource.read();
    });

    $("#cmbDespacho").data("kendoMultiColumnComboBox").bind("change", function () {
        IdDespachoMercancia = this.value() === "" ? 0 : this.value();
        $("#gridEmbalajes").data("kendoGrid").dataSource.read();

        if (IdDespachoMercancia != 0)
            KdoButtonEnable($("#btnCrearListaEmpaque"), true);
        else
            KdoButtonEnable($("#btnCrearListaEmpaque"), false);
    });

    $("#cmbFM").data("kendoComboBox").bind("change", function () {
        let idCatalogo = this.value() === "" ? 0 : this.value();
        infoDiseno(idCatalogo);
    });

    $("#btnCrearListaEmpaque").data("kendoButton").bind("click", function (e) {

        if (StrIdEmbalajeMercancia.length > 0 && arrayEmbalajeMercancia.length) {
            let strjson = {
                config: [{
                    Div: "vMod_RegistroListaEmpaque",
                    Vista: "~/Views/ControlUnidadesEmbalaje/_RegistroListaEmpaque.cshtml",
                    Js: "RegistroListaEmpaque.js",
                    Titulo: `Revisión para Registro de Lista de Empaque.`,
                    Height: "60%",
                    Width: "60%",
                    MinWidth: "30%"
                }],
                Param: {
                    pCorte: $("#txtCorteProceso").val(),
                    pvModal: "vMod_RegistroListaEmpaque",
                    pListaIdEmbalaje: StrIdEmbalajeMercancia,
                    pArrayEmbalaje: arrayEmbalajeMercancia
                },
                fn: { fnclose: "", fnLoad: "fn_Ini_RegistrarEmpaque", fnReg: "fn_Reg_RegistrarEmpaque", fnActi: "" }
            };

            fn_GenLoadModalWindow(strjson);
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar al menos un embalaje para poder continuar.", "error");
        }
    });

    $("#btnCrearEmbalaje").data("kendoButton").bind("click", function (e) {
        window.location.href = `/CrearEmbalaje/${KdoCmbGetValue($("#cmbCliente"))}`;
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
                $("#txtDiseño").val(dato.Nombre);
                $("#txtEstilo").val(dato.EstiloDiseno);
                $("#txtColorTela").val(dato.ColorTela);
                $("#txtParte").val(dato.NombreParte);
                $("#txtProducto").val(dato.NombrePrenda);
                $("#txtServicio").val(dato.NombreServicio);
                $("#txtNumero").val(dato.NumeroDiseno);

                img.append('<img class="k-card-image rounded mx-auto d-block" src="/Adjuntos/' + dato.NoReferencia + '/' + dato.NombreArchivo + '" onerror="imgError(this)"  />');
            } else {
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

//var fn_RefreshGrid = () => {
//    $("#gridEmbalajes").data("kendoGrid").dataSource.read();
//};

fPermisos = (datos) => {
    Permisos = datos;
};


$.fn.extend({
    mlcDespachos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdDespachoMercancia",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de un Despacho",
                valuePrimitive: true,
                footerTemplate: '#: instance.dataSource.total() # registros en total.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + `DespachosMercancias/GetFiltroDespachoByCliente/${idCliente}/${idPlanta}/${idMarca}`;
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdDespachoMercancia", title: "ID", width: 50 },
                    { field: "NoDocumento", title: "No. Despacho", width: 100 },
                    { field: "Servicio", title: "Servicio", width: 100 },
                    { field: "UsuarioSolicitante", title: "Solicitada por:", width: 200 },
                    { field: "Planta", title: "Planta", width: 80 },
                    { field: "FechaSolicitud", title: "Fecha Solicitud", template: '#:kendo.toString(kendo.parseDate(data.FechaSolicitud), "dd/MM/yyyy HH:mm:ss")#', width: 150 },
                    { field: "FechaEntrega", title: "Fecha Entrega", template: '#:kendo.toString(kendo.parseDate(data.FechaEntrega), "dd/MM/yyyy")#', width: 110 },
                    { field: "CantidadCortes", title: "Cant. Corte", width: 100 },
                    { field: "cantidadBultos", title: "Cantidad Bultos", width: 115 },
                    { field: "cantidadPiezas", title: "Cantidad", width: 100 }
                ]
            });
        });
    }
});