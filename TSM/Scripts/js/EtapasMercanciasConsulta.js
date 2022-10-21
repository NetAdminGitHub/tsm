'use strict'
var etapas = [];
var nomEtapas = [];
var colores = ["#5ba7db", "#e93353", "#f2aa3e", "#3579f6", "#9abf51", "#a7a7a7"];
var EtpSelected = [];
$(document).ready(function () {
    fn_Get_EtapaActivas();
});

var fn_Get_EtapaActivas = () => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosMercanciasEtapas/GetEtapasMercanciasActivas",
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            $("#stepConsulta").children().remove();
            var cont = 0;
            $.each(dato, function (i, item) {
                let vIcon = item.Icono === "" || item.Icono === null ? "k-icon k-i-image" : item.Icono;
                let NombreEtapa = item.Nombre;
                let etp = item.IdEtapaProceso;

                etapas.push(item.IdEtapaProceso);
                nomEtapas.push(item.Nombre);
                let htmltextElemnt = `<div class="col px-2 d-flex justify-content-center showdetailgrid">` +
                    '<a class="text-decoration-none d-flex flex-column">' +
                    `<div id="e-${etp}" class="custom-icon etp">` +
                    `<div class="${vIcon}" style = "font-size:2.5vw; color: ${colores[cont]};" ></div >` +
                    '</div>' +
                    `<div class="fs-6 text-uppercase mb-0 mt-2 text-center" style="max-width: 129px;">${NombreEtapa}</div>` +
                    `<div id="etp-${etp}" class="mt-auto text-center"></div>` +
                    '</a >' +
                    `</div>`;
                $("#stepConsulta").append(htmltextElemnt);
                $("#e-" + `${etp}`).data("Etapa", etp);

                cont++;
            });

            fn_Get_EtapasCorte(IdHojaBandeo);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}


var fn_Get_EtapasCorte = (idHojaBandeo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeos/GetConsultaEtapaCorte/" + `${idHojaBandeo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            $.each(dato, function (i, item) {
                $("#etp-" + `${item.IdEtapaProceso}`).children().remove();
                let Porc = item.Porcentaje.toFixed(2) + '%';
                let htmltextElemntdet = '<div class="fs-6 text-uppercase mb-0 mt-2 text-center">' + `${Porc}` + '</div>';
                $("#etp-" + `${item.IdEtapaProceso}`).append(htmltextElemntdet);
            });
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}


$(document).on("click", ".etp", function () {
    $(this).toggleClass("Activa_Etapa");
    let row = $(".Activa_Etapa");
    EtpSelected = [];
    $.each(row, function (i, item) {
        EtpSelected.push( $(`#${item.id}`).data("Etapa"))
    });
    fn_RefrescarObj ()
});

