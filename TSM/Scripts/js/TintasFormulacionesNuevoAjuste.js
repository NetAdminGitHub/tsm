var xaIdEstacion = 0;
var xaIdSeteo = 0;
let vfrmNajus = 0;
let xDiv_Modal = "";
var success_Data = "";//Contiene la data despues del ajsute

var fn_InicializarNuevoAjuste = function (idSeteo, idEstacion, xDivModal) {
    xaIdSeteo = idSeteo;
    xaIdEstacion = idEstacion;
    xDiv_Modal = xDivModal;
    //definicion del boto de ajuste
    KdoButton($("#btnAcepAjuste"), "check", "Aceptar");

    //definir el campo motivo de Ajuste
    let urtMo = TSM_Web_APi + "MotivosAjustesTintas";
    Kendo_CmbFiltrarGrid($("#CmbMotivoAjus"), urtMo, "Nombre", "IdMotivo", "Seleccione un motivo de ajuste ....");

    //definicion del campo cantidad inicial de formula Inicial o Recibida
    $("#NumCntIni_Recibida").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    // validacion al formulario
    vfrmNajus = $("#FrmNuevoAjuste").kendoValidator({
        rules: {
            vMtAjus: function (input) {
                if (input.is("[id='CmbMotivoAjus']")) {
                    return $("#CmbMotivoAjus").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            vMtAjus: "Requerido"
        }
    }).data("kendoValidator");

    $("#rbAjusteLimpio").click(function () {
        kdoNumericSetValue($("#NumCntIni_Recibida"), 0.00);
        $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
        $('[for= "NumCntIni_Recibida"]').text("Cantidad Inicial:");
        vfrmNajus.hideMessages();
    });

    $("#rbAjuste").click(function () {
        KdoNumerictextboxEnable($("#NumCntIni_Recibida"), true);
        $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
        $('[for= "NumCntIni_Recibida"]').text("Cantidad Recibida:");
        vfrmNajus.hideMessages();
    });


    $("#btnAcepAjuste").bind("click", function (e) {
        e.preventDefault();
        if (vfrmNajus.validate()) {
            fn_Ajuste();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar la cantidad devuelta", "error");
        }

    });
    // limpiar campos para realizar un ajuste
    fn_LimpiarNuevoAjuste();

};


var fn_CargarNuevoAjuste = function (idSeteo, idEstacion,xDivModal) {
    xaIdSeteo = idSeteo;
    xaIdEstacion = idEstacion;
    xDiv_Modal = xDivModal;
    fn_LimpiarNuevoAjuste();
};

var fn_Ajuste = function () {
    kendo.ui.progress($(".k-window-content"), true);
    $.ajax({
        url: TSM_Web_APi + "TintasFormulaciones/Ajustar/" + xaIdSeteo + "/" + xaIdEstacion + "/" + kdoNumericGetValue($("#NumCntIni_Recibida")) + "/" + (KdoRbGetValue($("#rbAjusteLimpio")) === true ? "1" : "0") + "/" + KdoCmbGetValue($("#CmbMotivoAjus")),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({ id: null }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(".k-window-content"), false);
            $("#" + xDiv_Modal + "").data("kendoDialog").close();
            RequestEndMsg(data, "Post");
            success_Data = data;
        },
        error: function (data) {
            kendo.ui.progress($(".k-window-content"), false);
            ErrorMsg(data);
        }
    });
};

var fn_LimpiarNuevoAjuste = function () {
    kdoNumericSetValue($("#NumCntIni_Recibida"), 0.00);
    KdoCmbSetValue($("#CmbMotivoAjus"), "");
    kdoRbSetValue($("#rbAjuste"), true);
    $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
    vfrmNajus.hideMessages();
};

