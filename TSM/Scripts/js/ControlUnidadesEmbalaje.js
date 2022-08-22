"use strict"
var Permisos;

$(document).ready(function () {

    KdoButton($("#btnSolicitarDespacho"), "plus-outline", "Crear Lista de Empaque");

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbMarca"), TSM_Web_APi + "Marcas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");
    Kendo_CmbFiltrarGrid($("#cmbServicio"), TSM_Web_APi + "Servicios", "Nombre", "IdServicio", "Seleccione Planta");

    TextBoxEnable($("#txtCodigoFM"), false);
    TextBoxEnable($("#txtDiseño"), false);
    TextBoxEnable($("#txtEstilo"), false);
    TextBoxEnable($("#txtNumero"), false);
    TextBoxEnable($("#txtColorTela"), false);
    TextBoxEnable($("#txtParte"), false);
    TextBoxEnable($("#txtProducto"), false);

    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () { return `${TSM_Web_APi}HojasBandeosMercanciasEtapas/GetBultosValidacionDespacho/${xidCatalogo}/${xIdEtapaProceso}/${xidHojaBandeo}`; },
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
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    Unidades: { type: "number" },
                    CantidadSegunda: { type: "number" },
                    CantidadAveria: { type: "number" },
                    CantidadFacturar: { type: "number" }
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
        },
        change: function (e) {

            let rows = e.sender.select();
            let tallas = [];
            let HojaBandeos = [];

            let grid = $("#gridEmbalajes").data("kendoGrid");
            rows.each(function (e) {
                let dataItem = grid.dataItem(this);
                HojaBandeos.push(dataItem.IdHojaBandeo);
                tallas.push(dataItem.Talla);
            });
            StrIdHojaBandeo = HojaBandeos;
            StrIdTalla = tallas;

            let detailGrid = grid.element.find(".k-detail-row");
            let detailRows = detailGrid.find(".idBulto-detail");
            console.log(detailRows);
            let idBulto = [];
            detailRows.each(function (currentValue, index, array) {
                idBulto.push(index.innerText);
            });
            StrIdBulto = idBulto;

            let estadoDetailRows = detailGrid.find(".Estado-detail");
            console.log(estadoDetailRows);
            let estado = [];
            estadoDetailRows.each(function (currentValue, index, array) {
                estado.push(index.innerText);
            });
            StrEstados = estado;
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "35px" },
            { field: "IdHojaBandeo", title: "id Hoja Bandeo", hidden: true },
            { field: "Talla", title: "Talla" },
            { field: "Cantidad", title: "Cant. Bultos" },
            { field: "Unidades", title: "Piezas" },
            { field: "CantidadSegunda", title: "Segundas" },
            { field: "CantidadAveria", title: "Averia" },
            { field: "CantidadFacturar", title: "Primeras" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridEmbalajes").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 650, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridEmbalajes").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEmbalajes").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEmbalajes").data("kendoGrid"), dataSource);

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
                pvModal: "vCambiarEstado",
                pIdMercancia: dataItem.IdMercancia,
                pIdMercanciaEtapa: dataItem.IdMercanciaEtapa,
                pidEtapaActual: xIdEtapaProceso,
                pCantidad: dataItem.Cantidad,
                pCantidadAveria: dataItem.CantidadAveria
            },
            fn: { fnclose: "fn_RefreshGrid", fnLoad: "fn_Ini_StatusOrdenDespacho", fnReg: "fn_Reg_StatusOrdenDespacho", fnActi: "" }
        };

        fn_GenLoadModalWindow(strjson);

    });

});

const detailInit = (e) => {

    let vidHojaBandeo = e.data.IdHojaBandeo === null ? 0 : e.data.IdHojaBandeo;
    let Talla = e.data.IdHojaBandeo === null ? "" : e.data.Talla;

    let dsBultos = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `HojasBandeosMercanciasEtapas/GetDetalleBultoPorEtapa/${vidHojaBandeo}/${Talla}/${xIdEtapaProceso}`;
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
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    IdMercancia: { type: "number" },
                    IdMercanciaEtapa: { type: "number" },
                    Cantidad: { type: "number" },
                    CantidadSustraida: { type: "number" },
                    CantidadAveria: { type: "number" },
                    CantidadSegunda: { type: "number" },
                    CantidadFacturar: { type: "number" },
                    NoDocumento: { type: "string" },
                    Estado: { type: "string" }
                }
            }
        },
        filter: { field: "IdHojaBandeo", operator: "eq", value: e.data.IdHojaBandeo }
    });

    let detailGrid = $("<div class='lump-child-grid'/>").appendTo(e.detailCell).kendoGrid({

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMercancia", title: "IdMercancia", attributes: { "class": "idMercancia-detail" }, hidden: true },
            { field: "NoDocumento", title: "Bulto/#Rollo", attributes: { "class": "idBulto-detail" } },
            { field: "IdMercanciaEtapa", title: "idMercanciaEtapa", attributes: { "class": "idMercanciaEtapa-detail" }, hidden: true },
            { field: "IdHojaBandeo", title: "Id Hoja Bandeo", hidden: true },
            { field: "Cantidad", title: "Cantidad" },
            { field: "CantidadSustraida", title: "Sustraidas" },
            { field: "CantidadSegunda", title: "Segundas" },
            { field: "CantidadAveria", title: "Averia" },
            { field: "CantidadFacturar", title: "Primeras" },
            { field: "Estado", title: "Estado", attributes: { "class": "Estado-detail" }, hidden: true }
        ]
    });

    ConfGDetalle(detailGrid.data("kendoGrid"), dsBultos, "gFor_detalle" + vidHojaBandeo);

    let selectedRowsTec = [];
    detailGrid.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(detailGrid, selectedRowsTec);
    });
}

const ConfGDetalle = (g, ds, Id_gCHForDetalle) => {
    SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0, "multiple");
    SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
    Set_Grid_DataSource(g, ds);
}
