var Permisos;
var xidClie = 0;
var xNoReferenciaCT = "";
var xNombreArchivoCT = "";
var xIdPrograma = 0;
var xIdOT = 0;
$(document).ready(function () {
    fn_getArtesAdjuntos();
});

var fn_getArtesAdjuntos = function () {
    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    $("#CmbPrograma").ControlSelecionPrograma();
    $("#CmbOrdenTrabajo").CatalogoOrdenesTrabajos();
    KdoCmbSetValue($("#CmbCliente"), "");
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
    KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");

    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    kendo.ui.progress($(document.body), true);
                    return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoConsulta/" + xidClie.toString() + "/" + xIdPrograma.toString() + "/" + xIdOT.toString();
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }
        },
        pageSize: 20
    });

    dataSource.read();

    $("#pager").kendoPager({
        dataSource: dataSource,
        input: true,
        pageSizes: [20, 50, 100, "all"]
    });


    dataSource.fetch(function () {
       
        dataSource.page(1);
        var view = dataSource.view();
        fn_DibujarCatalogo(view);
        kendo.ui.progress($(document.body), false);
    });


    dataSource.bind("change", function () {
        var view = dataSource.view();
        fn_DibujarCatalogo(view);
        kendo.ui.progress($(document.body), false);
    });

    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidClie = this.dataItem(e.item.index()).IdCliente;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
        }
        else {
            xidClie = 0;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidClie = 0;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            KdoCmbSetValue($("#CmbCliente"), this.dataItem(e.item.index()).IdCliente);
            xIdPrograma = this.dataItem(e.item.index()).IdPrograma;
            xidClie = this.dataItem(e.item.index()).IdCliente;
            dataSource.read();
        } else {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = 0;
            dataSource.read();
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = 0;
            dataSource.read();
        }

    });


    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            KdoCmbSetValue($("#CmbCliente"), this.dataItem(e.item.index()).IdCliente);
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), this.dataItem(e.item.index()).IdPrograma);
            xIdPrograma = this.dataItem(e.item.index()).IdPrograma;
            xidClie = this.dataItem(e.item.index()).IdCliente;
            xIdOT = this.dataItem(e.item.index()).IdOrdenTrabajo;
            dataSource.read();
        } else {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdOT = 0;
            dataSource.read();
        }
    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdOT = 0;
            dataSource.read();
        }

    });
};

var fn_DibujarCatalogo = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

    //$.each(data, function (index, elemento) {
    
    //    Pn.append('<div class="d-flex align-items-stretch col-lg-2">' +
    //        '<a href="#" class= "card rounded-0 w-100 bg-white mb-4" onClick="fn_CargarModal(this)" id="CCD-' + index.toString() +"-" + elemento.IdCatalogoDiseno + '" data-NombreDis="' + elemento.NombreDiseno + '">' +
    //        '<p></p>' +
    //        '<div class="card-block text-center ">' +
    //        '<h4 class="card-title font-weight-bold">' + elemento.NombreDiseno + '</h4>' +
    //        '<p class="card-subtitle">' + elemento.EstiloDiseno + '</p>' +
    //        '<p class="card-text">' + elemento.NumeroDiseno + '</p>' +
    //        '</div>' +
    //        '<p></p>'+
    //        '<img class="card-img-top img-responsive w-75 " src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" alt="Card image cap">' +
    //        '</a>' +
    //        '</div');

    //    $("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno === null ? 0 : elemento.IdCatalogoDiseno);
    //    $("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdArte", elemento.IdArte === null ? 0 : elemento.IdArte);
    //});


    $.each(data, function (index, elemento) {

        Pn.append('<div class="k-card">' +
            '<div class= "k-card-header" >' +
            '<h5 class="k-card-title">' + elemento.NombreDiseno + '</h5>' +
            '<h6 class="k-card-subtitle">Estilo: ' + elemento.EstiloDiseno + '</h6>' +
            '</div >' +
            '<img class="k-card-image"  src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" />' +
            '<div class="k-card-body">' +
            '<p>Numero:' + elemento.NumeroDiseno + '</p>' +
            '<p>Archivo:' + elemento.NombreArchivo + '</p>' +
            '<p>#:' + elemento.NoReferencia + '</p>' +
            '</div>' +
            '<div class="k-card-footer">' +
            '<a class="k-button k-flat k-button-icon" onClick="fn_CargarModal(' + elemento.IdCatalogoDiseno + ',' + elemento.IdArte + ')"><span class="k-icon k-i-search" ></span></a>' +
            '</div>' +
            '</div >');

        //$("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno === null ? 0 : elemento.IdCatalogoDiseno);
        //$("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdArte", elemento.IdArte === null ? 0 : elemento.IdArte);
    });
};


var fn_CargarModal = function (xIdCatalogoDiseno, xIdArte) {
  
    fn_ConsultarCatalogoDisenoInf("ModalCDinf", xIdCatalogoDiseno === null ? 0 : xIdCatalogoDiseno, xIdArte === null ? 0 : xIdArte,function () { fn_CloseInf();});
};

var fn_CloseInf = function () {
    $("#tab_inf").data("kendoTabStrip").select(0);
    $("#gConOT").data("kendoGrid").dataSource.read("[]");
};

$.fn.extend({
    CatalogoOrdenesTrabajos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección de Ordenes de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () { return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoOrdenesTrabajos/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "NoDocReq", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 }

                ]
            });
        });
    }
});

fPermisos = function (datos) {
    Permisos = datos;
};