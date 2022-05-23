﻿
let xidHb = 0;
let xesRollo_Bulto = 0;
let vFrmIngBulto;


let fn_Ini_IngresoBulto = (sidHb, esRollo) => {
    xidHb = sidHb;
    xesRollo_Bulto = esRollo;
    // crear realizar
    KdoButton($("#btn_Ib_Guardar"), "check-outline", "Guardar Registro");
    //cnatidad de pieza
    $("#num_Ib_Cantidad").kendoNumericTextBox({
        min: 0,
        max: esRollo === true ? 9999999.99 : 999999999,
        format: esRollo === true ?"{0:n2}":"#",
        restrictDecimals: esRollo===true? false:true,
        decimals: esRollo===true? 2:0,
        value: 0
    });
    //limpiar campos
    $("#txt_Ib_Bulto").val("");
    $("#txt_Ib_Talla").val("");
    $("#num_Ib_Cantidad").data("kendoNumericTextBox").value(0.00);
    Kendo_CmbFiltrarGrid($("#cmb_Ib_Unidades"), UrlUnidadesMedidas, "Abreviatura", "IdUnidad", "Seleccione...");

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
};

let fn_Reg_IngresoBulto = (sidHb, esRollo) => {
    xidHb = sidHb;
    xesRollo_Bulto = esRollo;
     //limpiar campos
    $("#txt_Ib_Bulto").val("");
    $("#txt_Ib_Talla").val("");
    $("#num_Ib_Cantidad").data("kendoNumericTextBox").value(0.00);
    $("#txt_Ib_Bulto").focus();
};

let fn_HojaBandeoMercancia = (xid) => {
    kendo.ui.progress($(".k-dialog"), true);
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
            RequestEndMsg(data, "Post");
            kendo.ui.progress($(".k-dialog"), false);
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(".k-dialog"), false);
        }
    });
}