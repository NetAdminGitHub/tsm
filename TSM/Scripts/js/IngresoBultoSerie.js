"use strict"

let xIdHojaBandeo;
let xesRollo_BultoSerie = 0;
let vFrmIngBulSerie;
let xfn_RefreshSerie;
let xUni;

var fn_Ini_IngresoBultoSerie = (strjson) => {

    xIdHojaBandeo = strjson.sIdHojaBandeo;
    xesRollo_BultoSerie = strjson.Uni == 20 ? true : false;
    xfn_RefreshSerie = strjson.fnRefresh;
    xUni = strjson.Uni;
    // crear realizar
    KdoButton($("#btn_Ibs_RealizarReg"), "check-outline", "Realizar Registro");

    //cnatidad de pieza
    $("#num_Ibs_Cantidad").kendoNumericTextBox({
        min: 0,
        max: xesRollo_BultoSerie === true ? 9999999.99 : 999999999,
        format: xesRollo_BultoSerie === true ? "{0:n2}" : "#",
        restrictDecimals: xesRollo_BultoSerie === true ? false : true,
        decimals: xesRollo_BultoSerie === true ? 2 : 0,
        value: 0
    });

    vFrmIngBulSerie = $("#FrmIngresoBultoSerie").kendoValidator({
            rules: {
                MsgRequerido: function (input) {
                    if (input.is("[name='txt_Ibs_Bulto_Ini']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='txt_Ibs_Bulto_Fin']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='txt_Ibs_Talla']")) {
                        return input.val() !== "";
                    }
                    return true;
                },
                MsgMayora0: function (input) {
                    if (input.is("[name='num_Ibs_Cantidad']")) {
                        return input.val() > 0;
                    }
                    return true;
                },
                MsgBulto: function (input) {
                    if (input.is("[name='txt_Ibs_Bulto_Ini']")) {
                        return input.val().length <= 50;
                    }
                    if (input.is("[name='txt_Ibs_Bulto_Fin']")) {
                        return input.val().length <= 50;
                    }
                    return true;
                },
                MsgTalla: function (input) {
                    if (input.is("[name='txt_Ibs_Talla']")) {
                        return input.val().length <= 20;
                    }
                    return true;
                }
            },
            messages: {
                MsgRequerido: "Campo Requerido",
                MsgMayora0: "Cantidad debe ser mayor a 0",
                MsgBulto: "Longitud del campo es 50",
                MsgTalla: "Longitud del campo es 20"
            }
        }).data("kendoValidator");

    $("#btn_Ibs_RealizarReg").click(function () {
        if (vFrmIngBulSerie.validate()) {
            fn_Gen_BultoSerie();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
        }
        
    });

    $("#txt_Ibs_Bulto_Ini").focus();
    $('.input-number').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    fn_Get_UltimoBultoDigitadoxCort_Serie(xIdHojaBandeo);
};

var fn_Reg_IngresoBultoSerie = (strjson) => {

    xIdHojaBandeo = strjson.sIdHojaBandeo;
    xesRollo_BultoSerie = strjson.Uni == 20 ? true : false;
    xfn_RefreshSerie = strjson.fnRefresh;
    xUni = strjson.Uni;

    $("#num_Ibs_Cantidad").data("kendoNumericTextBox").setOptions({
        min: 0,
        max: xesRollo_BultoSerie === true ? 9999999.99 : 999999999,
        format: xesRollo_BultoSerie === true ? "{0:n2}" : "#",
        restrictDecimals: xesRollo_BultoSerie === true ? false : true,
        decimals: xesRollo_BultoSerie === true ? 2 : 0,
        value: 0
    });

    $("#txt_Ibs_Bulto_Ini").focus();
    $("#txt_Ibs_Bulto_Ini").val("");
    $("#txt_Ibs_Bulto_Fin").val("");
    $("#txt_Ibs_Talla").val("");
  
    fn_Get_UltimoBultoDigitadoxCort_Serie(xIdHojaBandeo);
};

let fn_Gen_BultoSerie = () => {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosMercancias/CrearBultosSerie",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            IdHojaBandeo: xIdHojaBandeo,
            DocInicial: $("#txt_Ibs_Bulto_Ini").val(),
            DocFinal: $("#txt_Ibs_Bulto_Fin").val(),
            Talla: $("#txt_Ibs_Talla").val(),
            Cantidad: kdoNumericGetValue($("#num_Ibs_Cantidad"))
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            $("#txt_Ibs_Bulto_Ini").focus();
            $("#txt_Ibs_Bulto_Ini").val("");
            $("#txt_Ibs_Bulto_Fin").val("");
            $("#txt_Ibs_Talla").val("");
            fn_Get_UltimoBultoDigitadoxCort_Serie(xIdHojaBandeo);
            window[xfn_RefreshSerie]();
            kdoNumericSetValue($("#num_Ibs_Cantidad"), 0);
            RequestEndMsg(datos, "Post");
        },
        error: function (data) {
            ErrorMsg(data);
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });    
}

let fn_Get_UltimoBultoDigitadoxCort_Serie = (xIdHojaBandeo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosMercancias/GetUltimoBultoxCorte/" + `${xIdHojaBandeo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                $("#lbl_Ib_UltimoBultoSerie").text(dato.UltimoBulto);
            } else {
                $("#lbl_Ib_UltimoBultoSerie").text(0);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var fn_FocusVistaSerie = () => {
    $("#txt_Ibs_Bulto_Ini").focus();
}