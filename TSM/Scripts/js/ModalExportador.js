"use strict"

let idNota;
let idDeclaracion;
var Permisos;
let Gdet;

var fn_Ini_Expo = () => {
    KdoButton($("#btnGuardarExpo"), "save", "Guardar");
    $("#btnGuardarExpo").on("click", function () {
        if ($("#pCampo").val() != "" && $("#sCampo").val() != "" && $("#tCampo").val() != "" && $("#cCampo").val() != "") {
            tpc = $("#pCampo").val();
            tsc = $("#sCampo").val();
            ttc = $("#tCampo").val();
            tcc = $("#cCampo").val();
            let tatxt = "1er. Campo > " + tpc + "\n2do. Campo > " + tsc + "\n3er. Campo  > " + ttc + "\n4to. Campo  > " + tcc;
            $("#TaExportador").val(tatxt);
            $("#vModalExportador").data("kendoWindow").close();
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Todos los campos son requeridos.", "error");
        }
    });
};

var fn_Reg_Expo = () => {
    KdoButton($("#btnGuardarExpo"), "save", "Guardar");
};

fPermisos = function (datos) {
    Permisos = datos;
}