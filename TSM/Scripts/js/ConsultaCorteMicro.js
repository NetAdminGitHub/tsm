"use strict"
var Permisos;

$(document).ready(function () {

    KdoButton($("#btnRetornar"), "hyperlink-open-sm", "Regresar");

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
    infoDiseno(idCatalogoDiseno);

    let dataSourceMicro = new kendo.data.DataSource({
        transport: {
            read: {
                url: TSM_Web_APi + "HojasBandeos/ConsultaMicroEtapasByHojaBandeo",
                contentType: "application/json; charset=utf-8",
                type: "POST"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                } else {
                    return kendo.stringify({
                        IdCatalogoDiseno: idCatalogoDiseno,
                        IdHojaBandeo: IdHojaBandeo,
                        Etapas: EtpSelected
                    });
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
                    Primeras: { type: "number" },
                    Etapa: { type: "string" },
                    VistaFormulario: { type: "string" },
                    Estado: { type: "string" }
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
            {
                field: "Etapa", title: "Etapa",
                template: `<div class="d-flex">
                         #if(VistaFormulario == 'InspeccionProduccion') { #<span class='badge badge-etapa badge-InspeccionProduccion m-0 mr-1'> </span># }
                            else if(VistaFormulario == 'Reproceso') { #<span class='badge badge-etapa badge-Reproceso m-0 mr-1'> </span># }
                            else if(VistaFormulario == 'SegundoProceso') { #<span class='badge badge-etapa badge-SegundoProceso m-0 mr-1'> </span># }
                            else if(VistaFormulario == 'ValidacionReproceso') { #<span class='badge badge-etapa badge-ValidacionReproceso m-0 mr-1'> </span># }
                            else if(VistaFormulario == 'Auditoria') { #<span class='badge badge-etapa badge-Auditoria m-0 mr-1'> </span># }
                            else if(VistaFormulario == 'Despacho') { #<span class='badge badge-etapa badge-Despacho m-0 mr-1'> </span># }
                            else { #<span class='badge badge-etapa badge-default m-0 mr-1'> </span># } #
                         #=Etapa#</div>`
            },
            {
                field: "Estado", title: "Estado",
                template: `#if(Estado == 'OPERACION') { #<span class='badge badge-estado badge-estado-io' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>IO</span># }
                            else if(Estado == 'SUSPENDIDO') { #<span class='badge badge-estado badge-estado-os' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>OS</span># }
                            else if(Estado == 'FINALIZADO') { #<span class='badge badge-estado badge-estado-f' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>F</span># }
                            else if(Estado == 'ENTREGADO') { #<span class='badge badge-estado badge-estado-pe' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>PE</span># }
                            else if(Estado == 'RETENIDO') { #<span class='badge badge-estado badge-estado-r' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>R</span># }
                            else if(Estado == 'DEVOLUCION') { #<span class='badge badge-estado badge-estado-d' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>D</span># }
                            else if(Estado == 'TRANSITO') { #<span class='badge badge-estado badge-estado-t' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>T</span># }
                            else if(Estado == 'CANCELADO') { #<span class='badge badge-estado badge-estado-c' data-toggle='tooltip' data-placement='left' title='#=NombreEstado#'>C</span># }
                            else { #<span class='badge badge-default'>#=Estado#</span># } #`,
                attributes: {
                    style: "text-align: center"
                }
            }
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
        $('[data-toggle="tooltip"]').tooltip();
    });

    $("#gridBultos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridBultos"), selectedRows);
    });

    $("#gridBultos").data("kendoGrid").dataSource.read();

    $("#btnGenerarExcel").data("kendoButton").bind("click", function (e) {
        const grid = $("#gridBultos").data("kendoGrid");
        grid.saveAsExcel();
    });

    $("#btnRetornar").click(function () {
        window.location = window.location.origin + '/ConsultaCorteMacro/'
            + `${idCliente}/`
            + `${idMarca}/`
            + `${idPlanta}/`
            + `${idEtapaProcesoMacro}/`
            + `${idCatalogoDiseno}/`
            + `${idServicio}/`
            + `${FM}/`;
    });

});

let detalleHojaBandeo = (IdHojaBandeo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + `HojasBandeos/GetbyIdHoja/${IdHojaBandeo}/${idCatalogoDiseno}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {

            if (dato !== null) {
                $("#txtCorte").val(dato.Corte);
                $("#txtCantidad").val(dato.Cantidad);
                $("#txtBultos").val(dato.TotalBultos);
                $("#txtTallas").val(dato.Tallas);
                porcentajeSegundas(dato.PorcSegundas);
            } else {
                $("#txtCorte").val("");
                $("#txtCantidad").val("");
                $("#txtBultos").val("");
                $("#txtTallas").val("");
                porcentajeSegundas(0);
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

const porcentajeSegundas = (porcentaje) => {
    console.log(porcentaje);
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

    pb.value(porcentaje);
}

fPermisos = (datos) => {
    Permisos = datos;
};

let fn_RefrescarObj = () => {
    $("#gridBultos").data("kendoGrid").dataSource.read();
}