var Permisos;
var xidClie = 0;
var xNoReferenciaCT = "";
var xNombreArchivoCT = "";
$(document).ready(function () {
    fn_getArtesAdjuntos();
    //$('[href = "#panel31"]').click( function() {
    //    fn_getArtesAdjuntos();
    //});
});

var fn_getArtesAdjuntos = function () {
    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi+ "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    kendo.ui.progress($(document.body), true);
                    return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoByCliente/" + xidClie.toString();
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
            dataSource.read();
        }
        else {
            vIdclien = 0;
            dataSource.read();
        }
    });
    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidClie = 0;
            dataSource.read();
        }
    });
};

var fn_DibujarCatalogo = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

    $.each(data, function (index, elemento) {
    
        Pn.append('<div class="d-flex align-items-stretch col-lg-2">' +
            '<a href="#" class= "card rounded-0 w-100 bg-white mb-4" onClick="fn_CargarModal(this)" id="CCD-' + elemento.IdCatalogoDiseno + '" data-NombreDis="' + elemento.NombreDiseno + '">' +
            '<p></p>' +
            '<div class="card-block text-center ">' +
            '<h4 class="card-title font-weight-bold">' + elemento.NombreDiseno + '</h4>' +
            '<p class="card-subtitle">' + elemento.EstiloDiseno + '</p>' +
            '<p class="card-text">' + elemento.NumeroDiseno + '</p>' +
            '</div>' +
            '<p></p>'+
            '<img class="card-img-top img-responsive w-75 " src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" alt="Card image cap">' +
            '</a>' +
            '</div');

        $("#CCD-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno);
    });
};


var fn_CargarModal = function (e) {
  
    fn_ConsultarCatalogoDisenoInf("ModalCDinf", $("#" + e["id"] + "").data("IdCatalogoDiseno"));
};



fPermisos = function (datos) {
    Permisos = datos;
};