'use strict'
var etapas = [];
var nomEtapas = [];
var colores = ["#5ba7db", "#e93353", "#f2aa3e", "#3579f6", "#9abf51", "#a7a7a7"];
let pb;
var fn_Ini_ConsultaEtapa = (xjson) => {
    TextBoxEnable($("#txtCorte"), false);
    $("#txtCorte").val(xjson.Corte);
    pb = $("#progressBar").kendoProgressBar({
        min: 0,
        max: 100,
        type: "value",
        type: "percent",
        animation: {
            duration: 400
        }
    }).data("kendoProgressBar");
    fn_GetEtapaActivas(xjson);
}

var fn_con_ConsultaEtapa = (xjson) => {
    $("#txtCorte").val(xjson.Corte);
    fn_GetEtapasCorte(xjson);
}

var fn_GetEtapaActivas = (xjson) => {
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
                let htmltextElemnt = `<div class="col px-2 d-flex justify-content-center showdetailcc">` +
                    '<a class="text-decoration-none d-flex flex-column">' +
                    '<div class="custom-icon">' +
                    `<div class="${vIcon}" style = "font-size:2.5vw; color: ${item.Color};" ></div >` +
                    '</div>' +
                    `<div class="fs-6 text-uppercase mb-0 mt-2 text-center" style="max-width: 129px;">${NombreEtapa}</div>` +
                    `<div id="etp-${etp}" class="mt-auto text-center"></div>` +
                    '</a >' +
                    `</div>`;
                $("#stepConsulta").append(htmltextElemnt);
                cont++;
            });

            fn_GetEtapasCorte(xjson)
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}

var fn_GetEtapasCorte = (xjson) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeos/GetConsultaEtapaCorte/" + `${xjson.IdHojaBandeo}/${xjson.IdCatalogoDiseno}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            $.each(dato, function (i, item) {
                $("#etp-" + `${item.IdEtapaProceso}`).children().remove();
                let Porc = item.Porcentaje.toFixed(2) + '%';
                let Tallas = item.tallas === null ? '' : item.tallas;
                let BulRollo = item.CantidadMercancia;
                let Cantidad = item.Cantidad;

/*                percent.push(Porc);*/

                let htmltextElemntdet = '<div class="fs-6 text-uppercase mb-0 mt-2 text-center">' + `${Porc}` + '</div>' +
                    '<div class="fs-6 text-uppercase mb-0 m-2 text-start">Tallas : ' + `${Tallas}` + '</div>' +
                    '<div class="fs-6 text-uppercase mb-0 m-2 text-start">Bultos/Rollos : ' + `${BulRollo}` + '</div>' +
                    '<div class="fs-6 text-uppercase mb-0 m-2 text-start">Cantidad : ' + `${Cantidad}` + '</div>';

                $("#etp-" + `${item.IdEtapaProceso}`).append(htmltextElemntdet);

            });
            pb.value(dato.length > 0 ? dato[0].TotalPorcentaje : 0);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}