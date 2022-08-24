"use strict"
var Permisos;

$(document).ready(function () {

    TextBoxEnable($("#txtCorte"), false);
    TextBoxEnable($("#txtCodigoFM"), false);
    TextBoxEnable($("#txtDiseño"), false);
    TextBoxEnable($("#txtEstilo"), false);
    TextBoxEnable($("#txtColorTela"), false);
    TextBoxEnable($("#txtParte"), false);
    TextBoxEnable($("#txtProducto"), false);
    TextBoxEnable($("#txtCantidad"), false);
    TextBoxEnable($("#txtBultos"), false);
    TextBoxEnable($("#txtTallas"), false);

    KdoButton($("#btnGenerarExcel"), "download", "Descargar Data");

    detalleHojaBandeo(IdHojaBandeo);

    let dataSourceMicro = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () { return TSM_Web_APi + `HojasBandeos/ConsultaMicroEtapasByHojaBandeo/${IdHojaBandeo}` },
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
        aggregate: [
            { field: "CantidadSustraida", aggregate: "sum" },
            { field: "CantidadRecupera", aggregate: "sum" },
            { field: "CantidadSegunda", aggregate: "sum" },
            { field: "CantidadAveria", aggregate: "sum" },
            { field: "Primeras", aggregate: "sum" },

        ],
        schema: {
            model: {
                id: "IdMercancia",
                fields: {
                    Corte: { type: "string" },
                    IdMercancia: { type: "number" },
                    NoDocumento: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    TotalCuantiaHojaBandeo: { type: "number" },
                    CantidadSustraida: { type: "number" },
                    CantidadRecupera: { type: "number" },
                    CantidadSegunda: { type: "number" },
                    CantidadAveria: { type: "number" },
                    Primeras: { type: "number" }
                }
            }
        }
    });

    $("#gridBultos").kendoGrid({
        excel: {
            allPages: true,
            fileName: "Consulta de Corte Micro.xlsx"
        },
        columns: [
            { field: "Corte", title: "Corte", hidden: true },
            { field: "IdMercancia", title: "ID Mercancia", hidden: true },
            { field: "NoDocumento", title: "Bulto/Rollo" },
            { field: "Talla", title: "Talla" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "CantidadSustraida", title: "Sustraidas", footerTemplate: "#: data.CantidadSustraida ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "CantidadRecupera", title: "Recuperadas", footerTemplate: "#: data.CantidadRecupera ? kendo.format('{0:n2}', sum) : 0 #"  },
            { field: "CantidadSegunda", title: "Segundas", footerTemplate: "#: data.CantidadSegunda ? kendo.format('{0:n2}', sum) : 0 #"  },
            { field: "CantidadAveria", title: "Averia", footerTemplate: "#: data.CantidadAveria ? kendo.format('{0:n2}', sum) : 0 #"  },
            { field: "Primeras", title: "Facturadas", footerTemplate: "#: data.Primeras ? kendo.format('{0:n2}', sum) : 0 #"  },
            { field: "Etapa", title: "Etapa" },
            { field: "Estado", title: "Estado" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridBultos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 680);
    SetGrid_CRUD_ToolbarTop($("#gridBultos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridBultos").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridBultos").data("kendoGrid"), dataSourceMicro);

    let selectedRows = [];
    $("#gridBultos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridBultos"), selectedRows);
    });

    $("#gridBultos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridBultos"), selectedRows);
    });

    $("#gridBultos").data("kendoGrid").dataSource.read();

    $("#btnGenerarExcel").data("kendoButton").bind("click", function (e) {
        const grid = $("#gridBultos").data("kendoGrid");
        grid.saveAsExcel();
    });

    const pb = $("#progressBar").kendoProgressBar({
        min: 0,
        max: 100,
        type: "percent",
        value: 0,
        animation: {
            duration: 400
        },
        change: function (e) {
            this.progressWrapper.css({ "background-color": "#32c728", "border-color": "#32c728" });
        }
    }).data("kendoProgressBar");
    pb.value(20);
});

let detalleHojaBandeo = (IdHojaBandeo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + `HojasBandeos/GetbyIdHoja/${IdHojaBandeo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {

            if (dato !== null) {
                $("#txtCorte").val(dato.Corte);
                $("#txtCantidad").val(dato.Cantidad);
                $("#txtBultos").val(dato.TotalBultos);
                $("#txtTallas").val(dato.Tallas);
                infoDiseno(dato.IdCatalogoDiseno);
            } else {
                $("#txtCorte").val("");
                $("#txtCantidad").val("");
                $("#txtBultos").val("");
                $("#txtTallas").val("");
            }

            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}

let infoDiseno = (idCatalogo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFmxIdCatalogo/" + `${idCatalogo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            let img = $("#divImagenDiseno");
            img.children().remove();

            if (dato !== null) {
                $("#txtCodigoFM").val(dato.NoReferencia);
                $("#txtDiseño").val(dato.Nombre);
                $("#txtEstilo").val(dato.EstiloDiseno);
                $("#txtColorTela").val(dato.ColorTela);
                $("#txtParte").val(dato.NombreParte);
                $("#txtProducto").val(dato.NombrePrenda);

                img.append('<img class="k-card-image rounded mx-auto d-block" src="/Adjuntos/' + dato.NoReferencia + '/' + dato.NombreArchivo + '" onerror="imgError(this)"  />');
            } else {
                $("#txtCodigoFM").val("");
                $("#txtDiseño").val("");
                $("#txtEstilo").val("");
                $("#txtParte").val("");
                $("#txtProducto").val("");
                img.append('<img class="k-card-image rounded mx-auto d-block" src="' + srcDefault + '"/>')
            }

            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}

fPermisos = (datos) => {
    Permisos = datos;
};