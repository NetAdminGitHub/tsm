﻿
let xidHb = 0;
let xesRollo_Bulto = 0;
let vFrmIngBulto;
let xfn_Refresh;
let xUniB;
var fn_Ini_IngresoBulto = (strjson) => {
    xidHb = strjson.sidHb;
    xesRollo_Bulto = strjson.Uni === 20 ? true : false
    xfn_Refresh = strjson.fnRefresh;
    xUniB = strjson.Uni;
    // crear realizar
    KdoButton($("#btn_Ib_Guardar"), "check-outline", "Guardar Registro");
    //cnatidad de pieza
    $("#num_Ib_Cantidad").kendoNumericTextBox({
        min: 0,
        max: xesRollo_Bulto === true ? 9999999.99 : 999999999,
        format: xesRollo_Bulto === true ?"{0:n2}":"#",
        restrictDecimals: xesRollo_Bulto===true? false:true,
        decimals: xesRollo_Bulto===true? 2:0,
        value: 0
    });
    //limpiar campos
    $("#txt_Ib_Bulto").val("");
    $("#txt_Ib_Talla").val("");
    $("#num_Ib_Cantidad").data("kendoNumericTextBox").value(0.00);
    Kendo_CmbFiltrarGrid($("#cmb_Ib_Unidades"), UrlUnidadesMedidas, "Abreviatura", "IdUnidad", "Seleccione...");
    KdoComboBoxEnable($("#cmb_Ib_Unidades"),false);
    vFrmIngBulto = $("#FrmIngresoBulto").kendoValidator(
        {
            rules: {
                MsgRequerido: function (input) {
                    if (input.is("[name='txt_Ib_Bulto']")) {
                        return input.val()!== "";
                    }
                    if (input.is("[name='txt_Ib_Talla']")) {
                        return input.val()  !== "";
                    }
                    return true;
                },
                MsgMayora0: function (input) {
                    if (input.is("[name='num_Ib_Cantidad']")) {
                        return input.val() > 0;
                    }
                    return true;
                },
                MsgBulto: function (input) {
                    if (input.is("[name='txt_Ib_Bulto']")) {
                        return input.val().length <= 50;
                    }
                    return true;
                },
                MsgTalla: function (input) {
                    if (input.is("[name='txt_Ib_Talla']")) {
                        return input.val().length <= 20;
                    }
                    return true;
                },

                MsgIdUniArea: function (input) {
                    if (input.is("[name='cmb_Ib_Unidades']")) {
                        return $("#cmb_Ib_Unidades").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                MsgRequerido: "Campo Requerido",
                MsgMayora0:"Cantidad debe ser mayor a 0",
                MsgBulto: "Longitud del campo es 50",
                MsgTalla: "Longitud del campo es 20",
                MsgIdUniArea: "Requerido"
            }
        }).data("kendoValidator");

    $("#btn_Ib_Guardar").click(function () {
        if (vFrmIngBulto.validate()) {
            fn_HojaBandeoMercancia(xidHb);
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
        }
      
    });

    $("#txt_Ib_Bulto").focus();
    $('.input-number').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    fn_Get_UltimoBultoDigitadoxCorte(xidHb);
    KdoCmbSetValue($("#cmb_Ib_Unidades"), xUniB);
};

var fn_Reg_IngresoBulto = (strjson) => {
    xidHb = strjson.sidHb;
    xesRollo_Bulto = strjson.Uni ===20? true:false;
    xfn_Refresh = strjson.fnRefresh;
    xUniB = strjson.Uni;
    KdoComboBoxEnable($("#cmb_Ib_Unidades"), false);
     //limpiar campos
    $("#txt_Ib_Bulto").val("");
    $("#txt_Ib_Talla").val("");
    $("#num_Ib_Cantidad").data("kendoNumericTextBox").value(0.00);
    $("#txt_Ib_Bulto").focus();

    fn_Get_UltimoBultoDigitadoxCorte(xidHb);
    KdoCmbSetValue($("#cmb_Ib_Unidades"), xUniB);
};

let fn_HojaBandeoMercancia = (xid) => {
    kendo.ui.progress($(".k-window"), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosMercancias",
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdHojaBandeo: xid,
            Talla: $("#txt_Ib_Talla").val(),
            Cantidad: kdoNumericGetValue($("#num_Ib_Cantidad")),
            Docenas: xesRollo_Bulto === true ? null : kdoNumericGetValue($("#num_Ib_Cantidad")) / 12,
            IdMercancia: 0,
            NoDocumento: $("#txt_Ib_Bulto").val(),
            Estado: "INGRESADO",
            IdUnidad: $("#cmb_Ib_Unidades").val()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#txt_Ib_Bulto").val("");
            $("#txt_Ib_Talla").val("");
            $("#num_Ib_Cantidad").data("kendoNumericTextBox").value(0.00);
            $("#txt_Ib_Bulto").focus();
            $("#cmb_Ib_Unidades").data("kendoComboBox").value("");
            fn_Get_UltimoBultoDigitadoxCorte(xidHb);
            window[xfn_Refresh]();

            RequestEndMsg(data, "Post");
            kendo.ui.progress($(".k-window"), false);
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(".k-window"), false);
        }
    });
}


let fn_Get_UltimoBultoDigitadoxCorte = (xIdHB) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosMercancias/GetUltimoBultoxCorte/" + `${xIdHB}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                $("#lbl_Ib_UltimoBulto").text(dato.UltimoBulto);
            } else {
                $("#lbl_Ib_UltimoBulto").text(0);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var fn_FocusVista = () => {
    $("#txt_Ib_Bulto").focus();
}