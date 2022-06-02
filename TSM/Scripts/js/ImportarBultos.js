"use strict"
let xIdHojaBandeo;
let vFrmIngBul;
var fn_Ini_IngresoBulto = (strjson) => {
    xIdHojaBandeo = strjson.sIdHojaBandeo;
    
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

    $("#cmb_Ibs_Unidades").focus();
};

let fn_Reg_IngresoBulto = (strjson) => {
    xIdHojaBandeo = strjson.sIdHojaBandeo;
    xesRollo_Bulto = strjson.esRollo;
    xfn_Refresh = strjson.fnRefresh;
    $("#cmb_Ibs_Unidades").focus();
};

let fn_FocusVista = () => {
    $("#cmb_Ibs_Unidades").focus();
}