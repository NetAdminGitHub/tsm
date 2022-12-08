"use strict"

var Permisos;

let c1;
let c2;
let c3;
let c4;

let tipoTA;

var fn_Ini_Expo = (strjson) => {
    tipoTA = strjson.tipoTA;

    if (tipoTA == "Expo") {

        c1 = strjson.campo1Expo;
        c2 = strjson.campo2Expo;
        c3 = strjson.campo3Expo;
        c4 = strjson.campo4Expo;

        if (c1 != "" && c1 != 0 && c1 != undefined) {
            $("#pCampo").val(c1);
        }
        if (c2 != "" && c2 != 0 && c2 != undefined) {
            $("#sCampo").val(c2);
        }
        if (c3 != "" && c3 != 0 && c3 != undefined) {
            $("#tCampo").val(c3);
        }
        if (c4 != "" && c4 != 0 && c4 != undefined) {
            $("#cCampo").val(c4);
        }

        KdoButton($("#btnGuardarExpo"), "save", "Guardar");
        $("#btnGuardarExpo").on("click", function () {

            if (tipoTA == "Expo")
            {
                if ($("#pCampo").val() != "" && $("#sCampo").val() != "" && $("#tCampo").val() != "" && $("#cCampo").val() != "") {
                    tpc = $("#pCampo").val();
                    tsc = $("#sCampo").val();
                    ttc = $("#tCampo").val();
                    tcc = $("#cCampo").val();
                    let tatxt = "NIT: " + blankForNull(tpc) + "\nNombre: " + blankForNull(tsc) + "\nDirección: " + blankForNull(ttc) + "\nTeléfono: " + blankForNull(tcc);
                    $("#TaExportador").val(tatxt);
                    campo1Expo = $("#pCampo").val();
                    campo2Expo = $("#sCampo").val();
                    campo3Expo = $("#tCampo").val();
                    campo4Expo = $("#cCampo").val();
                    $("#vModalExportador").data("kendoWindow").close();
                }
                else {
                    $("#kendoNotificaciones").data("kendoNotification").show("Todos los campos son requeridos.", "error");
                }
            }
            
        });

    }
    else if (tipoTA == "Desp")
    {
        c1 = strjson.campo1Desp;
        c2 = strjson.campo2Desp;
        c3 = strjson.campo3Desp;
        c4 = strjson.campo4Desp;

        if (c1 != "" && c1 != 0 && c1 != undefined) {
            $("#pCampo").val(c1);
        }
        if (c2 != "" && c2 != 0 && c2 != undefined) {
            $("#sCampo").val(c2);
        }
        if (c3 != "" && c3 != 0 && c3 != undefined) {
            $("#tCampo").val(c3);
        }
        if (c4 != "" && c4 != 0 && c4 != undefined) {
            $("#cCampo").val(c4);
        }

        KdoButton($("#btnGuardarExpo"), "save", "Guardar");
        $("#btnGuardarExpo").on("click", function () {

            if (tipoTA == "Desp")
            {
                if ($("#pCampo").val() != "" && $("#sCampo").val() != "" && $("#tCampo").val() != "" && $("#cCampo").val() != "") {
                    tpc = $("#pCampo").val();
                    tsc = $("#sCampo").val();
                    ttc = $("#tCampo").val();
                    tcc = $("#cCampo").val();
                    let tatxt = "NIT: " + blankForNull(tpc) + "\nNombre: " + blankForNull(tsc) + "\nDirección: " + blankForNull(ttc) + "\nTeléfono: " + blankForNull(tcc);
                    $("#TaDespachante").val(tatxt);
                    campo1Desp = $("#pCampo").val();
                    campo2Desp = $("#sCampo").val();
                    campo3Desp = $("#tCampo").val();
                    campo4Desp = $("#cCampo").val();
                    $("#vModalExportador").data("kendoWindow").close();
                }
                else {
                    $("#kendoNotificaciones").data("kendoNotification").show("Todos los campos son requeridos.", "error");
                }
            }
            
        });

    }

};

var fn_Reg_Expo = (strjson) => {

    tipoTA = strjson.tipoTA;

    if (tipoTA == "Expo") {

        c1 = strjson.campo1Expo;
        c2 = strjson.campo2Expo;
        c3 = strjson.campo3Expo;
        c4 = strjson.campo4Expo;

        if (c1 != "" && c1 != 0 && c1 != undefined) {
            $("#pCampo").val(c1);
        }
        else {
            $("#pCampo").val("");
        }
        if (c2 != "" && c2 != 0 && c2 != undefined) {
            $("#sCampo").val(c2);
        }
        else {
            $("#sCampo").val("");
        }
        if (c3 != "" && c3 != 0 && c3 != undefined) {
            $("#tCampo").val(c3);
        }
        else {
            $("#tCampo").val("");
        }
        if (c4 != "" && c4 != 0 && c4 != undefined) {
            $("#cCampo").val(c4);
        }
        else {
            $("#cCampo").val("");
        }

        KdoButton($("#btnGuardarExpo"), "save", "Guardar");

        $("#btnGuardarExpo").on("click", function () {

            if (tipoTA == "Expo")
            {
                if ($("#pCampo").val() != "" && $("#sCampo").val() != "" && $("#tCampo").val() != "" && $("#cCampo").val() != "") {
                    tpc = $("#pCampo").val();
                    tsc = $("#sCampo").val();
                    ttc = $("#tCampo").val();
                    tcc = $("#cCampo").val();
                    let tatxt = "NIT: " + blankForNull(tpc) + "\nNombre: " + blankForNull(tsc) + "\nDirección: " + blankForNull(ttc) + "\nTeléfono: " + blankForNull(tcc);
                    $("#TaExportador").val(tatxt);
                    campo1Expo = $("#pCampo").val();
                    campo2Expo = $("#sCampo").val();
                    campo3Expo = $("#tCampo").val();
                    campo4Expo = $("#cCampo").val();
                    $("#vModalExportador").data("kendoWindow").close();
                }
                else {
                    $("#kendoNotificaciones").data("kendoNotification").show("Todos los campos son requeridos.", "error");
                }
            }
            
        });

    }
    else if (tipoTA == "Desp")
    {

        c1 = strjson.campo1Desp;
        c2 = strjson.campo2Desp;
        c3 = strjson.campo3Desp;
        c4 = strjson.campo4Desp;

        if (c1 != "" && c1 != 0 && c1 != undefined) {
            $("#pCampo").val(c1);
        }
        else {
            $("#pCampo").val("");
        }
        if (c2 != "" && c2 != 0 && c2 != undefined) {
            $("#sCampo").val(c2);
        }
        else {
            $("#sCampo").val("");
        }
        if (c3 != "" && c3 != 0 && c3 != undefined) {
            $("#tCampo").val(c3);
        }
        else {
            $("#tCampo").val("");
        }
        if (c4 != "" && c4 != 0 && c4 != undefined) {
            $("#cCampo").val(c4);
        }
        else {
            $("#cCampo").val("");
        }

        KdoButton($("#btnGuardarExpo"), "save", "Guardar");

        $("#btnGuardarExpo").on("click", function () {

            if (tipoTA == "Desp")
            {
                if ($("#pCampo").val() != "" && $("#sCampo").val() != "" && $("#tCampo").val() != "" && $("#cCampo").val() != "") {
                    tpc = $("#pCampo").val();
                    tsc = $("#sCampo").val();
                    ttc = $("#tCampo").val();
                    tcc = $("#cCampo").val();
                    let tatxt = "NIT: " + blankForNull(tpc) + "\nNombre: " + blankForNull(tsc) + "\nDirección: " + blankForNull(ttc) + "\nTeléfono: " + blankForNull(tcc);
                    $("#TaDespachante").val(tatxt);
                    campo1Desp = $("#pCampo").val();
                    campo2Desp = $("#sCampo").val();
                    campo3Desp = $("#tCampo").val();
                    campo4Desp = $("#cCampo").val();
                    $("#vModalExportador").data("kendoWindow").close();
                }
                else {
                    $("#kendoNotificaciones").data("kendoNotification").show("Todos los campos son requeridos.", "error");
                }
            }
            
        });

    }

};

fPermisos = function (datos) {
    Permisos = datos;
}