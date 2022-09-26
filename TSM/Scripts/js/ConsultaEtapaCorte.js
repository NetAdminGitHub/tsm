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
        url: TSM_Web_APi + "EtapasProcesos/GetEtapasProcesosActivas/" + `${xjson.IdModulo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            $("#stepConsulta").children().remove();
            var cont = 0;
            $.each(dato, function (i, item) {
                if (item.VistaFormulario != "IngresoMercancia" && item.VistaFormulario != "PreparacionCarrito") {
                    let vIcon = item.Icono === "" || item.Icono === null ? "k-icon k-i-image" : item.Icono;
                    let NombreEtapa = item.Nombre;
                    let etp = item.IdEtapaProceso;

                    etapas.push(item.IdEtapaProceso);
                    nomEtapas.push(item.Nombre);
                    let htmltextElemnt = '<li class="list-group-item " style="text-align: -webkit-center;font-weight:bold;" >' +
                        '<a class="text-decoration-none">' +
                        '<div class=" custom-icon">' +
                        '<div class="' + `${vIcon}` + '" style = "font-size:6vw; color: ' + colores[cont] + ';" ></div >' +
                        '</div>' +
                        '<div class="fs-6 text-uppercase mb-0 mt-2 text-center">' + `${NombreEtapa}` + '</div>' +
                        '<div id="etp-' + `${etp}` + '" class="mt-3"></div>' +
                        '</a >' +
                        '</li >';
                    $("#stepConsulta").append(htmltextElemnt);
                    cont++;
                }

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
        url: TSM_Web_APi + "HojasBandeos/GetConsultaEtapaCorte/" + `${xjson.IdHojaBandeo}`,
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

                //UrlxMenu = [];

                //$.each(etapas, function (key, value) {
                //    UrlxMenu.push(xIdHojaBandeo + "¿" + value + "¿" + xidCatalogo + "¿" + nomEtapas[key] + "¿" + key);
                //});

                //$(".showdetailcc").each(function (key, value) {
                //    $(this).attr("min", UrlxMenu[key]);
                //});

            });
            pb.value(dato.length > 0 ? dato[0].TotalPorcentaje : 0);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}