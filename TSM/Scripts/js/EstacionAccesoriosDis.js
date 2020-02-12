let xSeteoMEA;
var fn_VistaEstacionAccesoriosDisDocuReady = function () {
    KdoButton($("#btnAddMEA_Dis"), "check", "Agregar");

    KdoComboBoxbyData($("#CmbConsUnidad"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad dimensiones ....");
    $("#CmbConsUnidad").data("kendoComboBox").setDataSource(fn_UnidadMedida("5"));


    KdoComboBoxbyData($("#CmbSetFoil"), "[]", "NombreArt", "IdArticulo", "Seleccione un foil ....", "", "");
    $("#CmbSetFoil").data("kendoComboBox").setDataSource(0);

     $("#row-1").prop("hidden", true);
    $("#row-2").prop("hidden", true);

    $("#NumConsuAncho").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumConsuAlto").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    var frmAcce = $("#FrmGenEACC").kendoValidator({
        rules: {
            vuni: function (input) {
                if (input.is("[id='CmbConsUnidad']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString()) !== undefined ? $("#CmbConsUnidad").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            vfoil: function (input) {
                if (input.is("[id='CmbSetFoil']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString()) !== undefined ? $("#CmbSetFoil").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            anchoc: function (input) {

                if (input.is("[name='NumConsuAncho']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString()) !== undefined ? $("#NumConsuAncho").data("kendoNumericTextBox").value() > 0 : true;
                }
                return true;
            },
            altoc: function (input) {

                if (input.is("[name='NumConsuAlto']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString()) !== undefined ? $("#NumConsuAlto").data("kendoNumericTextBox").value() > 0: true;
                }
                return true;
            }

        },
        messages: {
            vuni: "Requerido",
            vfoil: "Requerido",
            altoc: "Requerido",
            anchoc: "Requerido"
        }
    }).data("kendoValidator");

    if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString())) {
        $("#row-1").prop("hidden", false);
        $("#row-2").prop("hidden", false);
        KdoCmbSetValue($("#CmbConsUnidad"),5);
    } else {
        $("#row-1").prop("hidden", true);
        $("#row-2").prop("hidden", true);
        kdoNumericSetValue($("#NumConsuAncho"), 0);
        kdoNumericSetValue($("#NumConsuAlto"), 0);
        KdoCmbSetValue($("#CmbSetFoil"), "");
        KdoCmbSetValue($("#CmbConsUnidad"), "");
    }

    $("#btnAddMEA_Dis").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmAcce.validate()) {
            fn_GuardarEstacionAccesorioDis();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });
};

var fn_VistaEstacionAccesoriosDis = function () {
    //InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce_Dis"), false);
    $("#TxtOpcSelecAcce_Dis").val($("#TxtOpcSelecAcce_Dis").data("name"));
    idBraAcce = $("#TxtOpcSelecAcce_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);
    xSeteoMEA = fn_GetSeteoMaqEstAcce(maq[0].IdSeteo, idBraAcce);

    if (EstacionBraAcce !== null) {
        $("#TxtOpcSelecAcce_Dis").val(EstacionBraAcce.Nombre1 === undefined ? "" : EstacionBraAcce.Nombre1);
        $("#TxtOpcSelecAcce_Dis").data("IdAccesorio", EstacionBraAcce.IdAccesorio === undefined ? "" : EstacionBraAcce.IdAccesorio);
    }

    if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString())) {
        $("#row-1").prop("hidden", false);
        $("#row-2").prop("hidden", false);
        $("#CmbSetFoil").data("kendoComboBox").setDataSource(Fn_GetRequerimientoFoil($("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString()));
        if (xSeteoMEA !== null) {
            KdoCmbSetValue($("#CmbSetFoil"), xSeteoMEA.IdArticulo === undefined ? "" : xSeteoMEA.IdArticulo);
            KdoCmbSetValue($("#CmbConsUnidad"), xSeteoMEA.IdUnidadDimensionesConsumo === undefined ? "" : xSeteoMEA.IdUnidadDimensionesConsumo);
            kdoNumericSetValue($("#NumConsuAncho"), xSeteoMEA.AnchoConsumo);
            kdoNumericSetValue($("#NumConsuAlto"), xSeteoMEA.AltoConsumo);
        } else {
            KdoCmbSetValue($("#CmbConsUnidad"), 5);
        }
        KdoCmbFocus($("#CmbSetFoil"));
    } else {
        $("#row-1").prop("hidden", true);
        $("#row-2").prop("hidden", true);
        kdoNumericSetValue($("#NumConsuAncho"), 0);
        kdoNumericSetValue($("#NumConsuAlto"), 0);
        KdoCmbSetValue($("#CmbSetFoil"), "");
        KdoCmbSetValue($("#CmbConsUnidad"), "");
    }

};

var fn_GuardarEstacionAccesorioDis = function () {

    fn_GuardarEstacionAcceDis(idBraAcce);
    var a = stage.find("#TxtInfo" + idBraAcce);
    a.text($("#TxtOpcSelecAcce_Dis").val());
    layer.draw();
};

var fn_GuardarEstacionAcceDis = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosDis"), true);
    var xType;

    if (EstacionBraAcce === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstaciones/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdEstacion: xIdBrazo,
            IdSeteo: maq[0].IdSeteo,
            IdTipoEstacion: "ACCESORIO",
            IdAccesorio: $("#TxtOpcSelecAcce_Dis").data("IdAccesorio")
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Dis").data("IdAccesorio").toString())) {
                fn_GuardarSeteoAccesDis(xIdBrazo);
            } else {
                kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
                maq = fn_GetMaquinas();
                $("#MEstacionAccesoriosDis").data("kendoWindow").close();
                RequestEndMsg(data, xType);
            }
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GuardarSeteoAccesDis = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosDis"), true);
    var xType;

    if (xSeteoMEA === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesAccesorios/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesAccesorios/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdEstacion: xIdBrazo,
            Power: 0,
            Temperatura: 0,
            Tiempo: 0,
            IdSeteo: maq[0].IdSeteo,
            IdArticulo: KdoCmbGetValue($("#CmbSetFoil")),
            AltoConsumo: kdoNumericGetValue($("#NumConsuAlto")),
            AnchoConsumo: kdoNumericGetValue($("#NumConsuAncho")),
            IdUnidadDimensionesConsumo: KdoCmbGetValue($("#CmbConsUnidad"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            maq = fn_GetMaquinas();
            $("#MEstacionAccesoriosDis").data("kendoWindow").close();
            $("#row-1").attr("hidden", "hidden");
            $("#row-2").prop("hidden", "hidden");
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            ErrorMsg(data);
        }
    });
};

fn_PWList.push(fn_VistaEstacionAccesoriosDis);
fn_PWConfList.push(fn_VistaEstacionAccesoriosDisDocuReady);