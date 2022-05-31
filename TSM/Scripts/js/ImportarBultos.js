"use strict"
let xIdHojaBandeo;
let xesRollo_Bulto = 0;
let vFrmIngBul;
var fn_Ini_IngresoBulto = (strjson) => {
    xIdHojaBandeo = strjson.sIdHojaBandeo;
    xesRollo_Bulto = strjson.esRollo;

    // crear realizar
    KdoButton($("#btnCargarArchivo"), "excel", "Importar");

    $("#Adjunto").kendoUpload({
        async: {
            saveUrl: "/IngresoMercancias/SubirArchivo",
            autoUpload: true
        },
        localization: {
            select: '<div class="k-icon k-i-excel"></div>&nbsp;Importar'
        },
        upload: function (e) {
            e.sender.options.async.saveUrl = "/IngresoMercancias/SubirArchivo/" + xIdHojaBandeo;
        },
        showFileList: false,
        success: function (e) {
            if (e.response.Resultado === true) {
                if (e.operation === "upload") {
                    GuardarArtAdj(e);
                }
            } else {
                $("#kendoNotificaciones").data("kendoNotification").show(e.response.Msj, "error");
            }
        }
    });

    let GuardarArtAdj = function(e) {
        kendo.ui.progress($("#body"), true);
        var XType = "Post";

        $.ajax({
            url: TSM_Web_APi + "/HojasBandeosMercancias/ImportarMercancias",
            type: XType,
            dataType: "json",
            data: JSON.stringify({
                IdHojaBandeo: xidHojaBandeo,
                IdUnidad: 0,
                RutaCompleta: e.files[0].name,
                NombreArchivo: e.response.Ruta
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                kendo.ui.progress($("#body"), false);
                RequestEndMsg(data, XType);
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }

    Kendo_CmbFiltrarGrid($("#cmb_Ibs_Unidades"), UrlUnidadesMedidas, "Abreviatura", "IdUnidad", "Seleccione...");

    vFrmIngBul = $("#FrmImportarBultos").kendoValidator({
        rules: {
            MsgIdUniArea: function (input) {
                if (input.is("[name='cmb_Ibs_Unidades']")) {
                    return $("#cmb_Ibs_Unidades").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            MsgIdUniArea: "Requerido"
        }
    }).data("kendoValidator");

    //$("#btn_Ibs_RealizarReg").click(function () {
    //    if (vFrmIngBul.validate()) {
    //        fn_Gen_Bulto();
    //    } else {
    //        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
    //    }

    //});

    $("#cmb_Ibs_Unidades").focus();
    //$('.input-number').on('input', function () {
    //    this.value = this.value.replace(/[^0-9]/g, '');
    //});

    //fn_Get_UltimoBultoDigitadoxCort_(xIdHojaBandeo);
};

var fn_Reg_IngresoBulto = (strjson) => {
    xIdHojaBandeo = strjson.sIdHojaBandeo;
    xesRollo_Bulto = strjson.esRollo;
    xfn_Refresh = strjson.fnRefresh;
    $("#cmb_Ibs_Unidades").focus();
    
    //fn_Get_UltimoBultoDigitadoxCort_(xIdHojaBandeo);
};

//let fn_Gen_Bulto = () => {
//    kendo.ui.progress($(".k-dialog"), true);
//    $.ajax({
//        url: TSM_Web_APi + "HojasBandeosMercancias/CrearBultos",
//        method: "POST",
//        dataType: "json",
//        data: JSON.stringify({
//            IdHojaBandeo: xIdHojaBandeo,
//            DocInicial: $("#txt_Ibs_Bulto_Ini").val(),
//            DocFinal: $("#txt_Ibs_Bulto_Fin").val(),
//            Talla: $("#txt_Ibs_Talla").val(),
//            Cantidad: kdoNumericGetValue($("#num_Ibs_Cantidad")),
//            IdUnidad: $("#cmb_Ibs_Unidades").val()
//        }),
//        contentType: "application/json; charset=utf-8",
//        success: function (datos) {
//            $("#txt_Ibs_Bulto_Ini").focus();
//            $("#txt_Ibs_Bulto_Ini").val("");
//            $("#txt_Ibs_Bulto_Fin").val("");
//            $("#txt_Ibs_Talla").val("");
//            fn_Get_UltimoBultoDigitadoxCort_(xIdHojaBandeo);
//            window[xfn_Refresh]();
//            kdoNumericSetValue($("#num_Ibs_Cantidad"), 0);
//            $("#cmb_Ibs_Unidades").data("kendoComboBox").value("");
//            RequestEndMsg(datos, "Post");
//        },
//        error: function (data) {
//            ErrorMsg(data);
//        },
//        complete: function () {
//            kendo.ui.progress($(".k-dialog"), false);
//        }
//    });
//}

//let fn_Get_UltimoBultoDigitadoxCort_ = (xIdHojaBandeo) => {
//    kendo.ui.progress($(document.body), true);
//    $.ajax({
//        url: TSM_Web_APi + "HojasBandeosMercancias/GetUltimoBultoxCorte/" + `${xIdHojaBandeo}`,
//        dataType: 'json',
//        type: 'GET',
//        success: function (dato) {
//            if (dato !== null) {
//                $("#lbl_Ib_UltimoBulto").text(dato.UltimoBulto);
//            } else {
//                $("#lbl_Ib_UltimoBulto").text(0);
//            }
//            kendo.ui.progress($(document.body), false);
//        },
//        error: function () {
//            kendo.ui.progress($(document.body), false);
//        }
//    });
//};

var fn_FocusVista = () => {
    $("#cmb_Ibs_Unidades").focus();
}