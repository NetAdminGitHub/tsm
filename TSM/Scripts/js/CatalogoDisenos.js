var Permisos;
$(document).ready(function () {
    fn_getArtesAdjuntos();
    //$('[href = "#panel31"]').click( function() {
    //    fn_getArtesAdjuntos();
    //});
});

var fn_getArtesAdjuntos = function () {
 
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: TSM_Web_APi + "ArteAdjuntos/GetAdjuntosListado",
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
    });


    dataSource.bind("change", function () {
        var view = dataSource.view();
        fn_DibujarCatalogo(view);
    });

};

var fn_DibujarCatalogo = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

    $.each(data, function (index, elemento) {
    
        Pn.append('<div class="d-flex align-items-stretch col-md-12 col-lg-3">' +
            '<a class= "card rounded-0 w-100 bg-white mb-4" onClick="fn_CargarModal(this)" id="CCD-' + elemento.IdRequerimiento + '" data-NombreDis="' + elemento.NombreDiseno + '">' +
            '<img class="card-img-top img-responsive w-50 " src="/Adjuntos/' + elemento.NoDocumento + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" alt="Card image cap">' +
            '<div class="card-block text-center ">' +
            '<h4 class="card-title"> No: ' + index.toString() + " " + elemento.NombreDiseno + '</h4>' +
            '<p class="card-text">' + elemento.EstiloDiseno + '</p>' +
            '</div>' +
            '</a>' +
            '</div');

        $("#CCD-" + elemento.IdRequerimiento +"").data("IdRequerimiento",elemento.IdRequerimiento);
    });
};

var fn_onShowDatos = function () {

};
var fn_CargarModal = function (e) {
    if ($("#ModalCDinf").children().length === 0) {
        $.ajax({
            url: "/CatalogoDisenos/CatalogoDisenoInf",
            async: false,
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                $("#ModalCDinf").kendoDialog({
                    height: "70%",
                    width: "70%",
                    title: $("#" + e["id"] + "").data("nombredis"),
                    closable: true,
                    modal: true,
                    content: resultado,
                    visible: false,
                    maxHeight: 800,
                    show: fn_onShowDatos
                });

                $("#ModalCDinf").data("kendoDialog").open();
            }
        });
    } else {
        $("#ModalCDinf").data("kendoDialog").title($("#" + e["id"] + "").data("nombredis"));
        $("#ModalCDinf").data("kendoDialog").open();
        
    }

    $("#scrollView").kendoScrollView({
        enablePager: true,
        contentHeight: "100%"
    });
};



fPermisos = function (datos) {
    Permisos = datos;
};