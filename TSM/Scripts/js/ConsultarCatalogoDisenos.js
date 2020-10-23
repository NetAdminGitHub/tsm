//$(document).ready(function () {
//    fn_getCatalogoDisenos();
//});
let xfiltroCliente;
let xNombreDivCD;
let dataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: function () {
                return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoByCliente/" + xfiltroCliente;
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }
    },
    pageSize: 20
});

var fn_getCatalogoDisenos = function (xIdClienCat,divCD) {
    xfiltroCliente = xIdClienCat;
    xNombreDivCD = divCD;
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
let fn_obtnerIdCatalogoDiseno = function (e) {
    let datoCD = {
        IdCatalogoDiseno: $("#" + e["id"] + "").data("IdCatalogoDiseno"),
        NoReferencia: $("#" + e["id"] + "").data("NoReferencia")
    };
    $("#" + xNombreDivCD + "").trigger("GetRowCatalogo", [datoCD]);
    $("#" + xNombreDivCD + "").data("kendoDialog").close();

};
var fn_DibujarCatalogo = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

    $.each(data, function (index, elemento) {

        Pn.append('<div class="d-flex align-items-stretch col-md-12 col-lg-4">' +
            '<a class= "card rounded-0 w-100 bg-white mb-4" onClick="fn_obtnerIdCatalogoDiseno(this)" id="CCD-' + elemento.IdCatalogoDiseno + '" data-NombreDis="' + elemento.NombreDiseno + '">' +
            '<img class="card-img-top img-responsive w-50 " src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" alt="Card image cap">' +
            '</p>' +
            '<div class="card-block text-center ">' +
            '<h5 class="card-title">No:' + index.toString() + " " + elemento.NombreDiseno + '</h5>' +
            '<p class="card-text">' + elemento.EstiloDiseno + '</p>' +
            '</div>' +
            '</a>' +
            '</div');

        $("#CCD-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno);
        $("#CCD-" + elemento.IdCatalogoDiseno + "").data("NoReferencia", elemento.NoReferencia);
    });
};



