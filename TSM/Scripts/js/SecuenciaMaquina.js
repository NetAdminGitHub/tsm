let xseteo = 0;
let xEtap = 0;
let xItem = 0;
let xido = 0;
let maq;
var fn_Ini_Secuencia = (strjson) => {
    xseteo = strjson.IdSeteo;
    xEtap = strjson.IdEtapa;
    xItem = strjson.Item;
    xido = strjson.IdOt
    fn_DibujarSeccionMaqui(xseteo, xEtap, xItem, xido);
}

var fn_Reg_Secuencia = (strjson) => {
    xseteo = strjson.IdSeteo;
    xEtap = strjson.IdEtapa;
    xItem = strjson.Item;
    xido = strjson.IdOt;
    fn_DibujarSeccionMaqui(xseteo, xEtap, xItem, xido);

}

let fn_DibujarSeccionMaqui = function (xset, xetp, xitem, xido) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/" + xset,
        type: 'GET',
        success: function (datos) {
            //if (datos !== null) {
            maq = fn_Get_MQ(xetp, xitem,xido);
            $("#vmqSecuencia").maquinaSerigrafia({
                maquina: {
                    data: maq,
                    formaMaquina: maq[0].NomFiguraMaquina,
                    cantidadBrazos: maq[0].CantidadEstaciones
                }
            });
            //}
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};

var fn_Get_MQ = function (xetp, xitem,xido) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + xido + "/" + xetp + "/" + xitem,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};