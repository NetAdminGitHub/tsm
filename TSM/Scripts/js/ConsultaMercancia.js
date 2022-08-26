'use strict'

var fn_Ini_CM = (xjson) => {
    TextBoxEnable($("#txt_CodigoFM"), false);
    TextBoxEnable($("#txt_Estilo"), false);
    TextBoxEnable($("#txt_Diseño"), false);
    TextBoxEnable($("#txt_Parte"), false);
    TextBoxEnable($("#txt_Composicion"), false);
    TextBoxEnable($("#txt_NombrePrenda"), false);
    TextBoxEnable($("#txt_Numero"), false);
    fn_Diseno_InfLoad(xjson.idCatalogo);

    //#region crear grid 
    let dSdesp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "DespachosMercancias/GetCortesDespachoEstado",
                contentType: "application/json; charset=utf-8",
                type: "POST"
            },
            parameterMap: function (data, type) {
                return kendo.stringify({
                    IdHojaBandeo: xjson.idHojaBandeo,
                    Estado: xjson.estado, 
                    IdCatalogo: xjson.idCatalogo
                });
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    Corte: { type: "string" },
                    IdCatalogoDiseno: { type: "number" },
                    TotalTallas: { type: "number" },
                    TotaBultos: { type: "number" },
                    ParteDecorada: { type: "string" },
                    CantidadIngreso: { type: "number" },
                    CantidadDisponible: { type: "number" },
                    CantidadDespacho: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gcMercancia").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "IdHojaBandeo", title: "Id HojaBandejo", hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "IdCatalogoDiseno", title: "Id Catalogo Diseño", hidden: true },
            { field: "TotalTallas", title: "Total Tallas" },
            { field: "TotaBultos", title: "Total Bultos" },
            { field: "ParteDecorada", title: "Parte Decorada"},
            { field: "CantidadIngreso", title: "Cantidad Ingreso" },
            { field: "CantidadDisponible", title: "Cantidad Disponible" },
            { field: "CantidadDespacho", title: "Cantidad Despacho" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gcMercancia").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gcMercancia").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gcMercancia").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gcMercancia").data("kendoGrid"), dSdesp);

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
                { field: "Corte", title: "Corte", hidden: true},
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
            Grid_SetSelectRow(g, selectedRowsTec);
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0);
        SetGrid_CRUD_Command(g, false, false, Id_gCHForDetalle);
        Set_Grid_DataSource(g, ds);
    }




    var selectedRows2 = [];
    $("#gcMercancia").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gcMercancia"), selectedRows2);
    });

    $("#gcMercancia").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gcMercancia"), selectedRows2);
    });

    $("#gcMercancia").data("kendoGrid").dataSource.read();

    //#endregion 




}

var fn_Reg_CM = (xjson) => {
    $("#gcMercancia").data("kendoGrid").dataSource.read();
    fn_Diseno_InfLoad(xjson.idCatalogo);
}

let fn_Diseno_InfLoad = (idCatalogo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFmxIdCatalogo/" + `${idCatalogo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            let img = $("#div_ImDis");
            img.children().remove();

            if (dato !== null) {
                $("#txt_CodigoFM").val(dato.NoReferencia);
                $("#txt_Diseño").val(dato.Nombre);
                $("#txt_Estilo").val(dato.EstiloDiseno);
                $("#txt_Parte").val(dato.NombreParte);
                $("#txt_Composicion").val(dato.Composicion);
                $("#txt_NombrePrenda").val(dato.NombrePrenda);
                $("#txt_Numero").val(dato.NumeroDiseno);
                img.append('<img class="k-card-image rounded mx-auto d-block" src="/Adjuntos/' + dato.NoReferencia + '/' + dato.NombreArchivo + '" onerror="imgError(this)"  />');
            } else {
                $("#txt_CodigoFM").val("");
                $("#txt_Diseño").val("");
                $("#txt_Estilo").val("");
                $("#txt_Parte").val("");
                $("#txt_Composicion").val("");
                $("#txt_NombrePrenda").val("");
                $("#txt_Numero").val("");
                img.append('<img class="k-card-image rounded mx-auto d-block" src="' + srcDefault + '"/>')
            }

            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

}
