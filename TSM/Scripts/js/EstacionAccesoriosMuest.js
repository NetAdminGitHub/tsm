let xSeteoMEA;
var fn_VistaEstacionAccesoriosMuesDocuReady = function () {
    KdoButton($("#btnAddMEA_Mues"), "check", "Agregar"); frmAcce_mues

    KdoComboBoxbyData($("#CmbConsUnidad_Mues"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad dimensiones ....");
    $("#CmbConsUnidad_Mues").data("kendoComboBox").setDataSource(fn_UnidadMedida("5"));


    KdoComboBoxbyData($("#CmbSetFoil_Mues"), "[]", "NombreArt", "IdArticulo", "Seleccione un foil ....", "", "");
    $("#CmbSetFoil_Mues").data("kendoComboBox").setDataSource(0);

    $("#row-1").prop("hidden", true);
    $("#row-2").prop("hidden", true);

    $("#NumConsuAncho_Mues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumConsuAlto_Mues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    var frmAcce_mues = $("#FrmGenEACC_Mues").kendoValidator({
        rules: {
            vuni: function (input) {
                if (input.is("[id='CmbConsUnidad_Mues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString()) !== undefined ? $("#CmbConsUnidad_Mues").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            vfoil: function (input) {
                if (input.is("[id='CmbSetFoil_Mues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString()) !== undefined ? $("#CmbSetFoil_Mues").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            anchoc: function (input) {

                if (input.is("[name='NumConsuAncho_Mues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString()) !== undefined ? $("#NumConsuAncho_Mues").data("kendoNumericTextBox").value() > 0 : true;
                }
                return true;
            },
            altoc: function (input) {

                if (input.is("[name='NumConsuAlto_Mues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString()) !== undefined ? $("#NumConsuAlto_Mues").data("kendoNumericTextBox").value() > 0 : true;
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

    if (AccesMaquinaArt.find(q => q.IdAccesorio === ($("#TxtOpcSelecAcce_Mues").data("IdAccesorio") === undefined ? "" : $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString() === undefined))) {
        $("#row-1").prop("hidden", false);
        $("#row-2").prop("hidden", false);
        KdoCmbSetValue($("#CmbConsUnidad_Mues"), 5);
    } else {
        $("#row-1").prop("hidden", true);
        $("#row-2").prop("hidden", true);
        kdoNumericSetValue($("#NumConsuAncho_Mues"), 0);
        kdoNumericSetValue($("#NumConsuAlto_Mues"), 0);
        KdoCmbSetValue($("#CmbSetFoil_Mues"), "");
        KdoCmbSetValue($("#CmbConsUnidad_Mues"), "");
    }

    $("#btnAddMEA_Mues").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmAcce_mues.validate()) {
            fn_GuardarEstacionAccesorioMues();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });
};

var fn_VistaEstacionAccesoriosMues = function () {
    //InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce_Mues"), false);
    $("#TxtOpcSelecAcce_Mues").val($("#TxtOpcSelecAcce_Mues").data("name"));
    idBraAcce = $("#TxtOpcSelecAcce_Mues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);
    xSeteoMEA = fn_GetSeteoMaqEstAcce(maq[0].IdSeteo, idBraAcce);

    if (EstacionBraAcce !== null) {
        $("#TxtOpcSelecAcce_Mues").val(EstacionBraAcce.Nombre1 === undefined ? "" : EstacionBraAcce.Nombre1);
        $("#TxtOpcSelecAcce_Mues").data("IdAccesorio", EstacionBraAcce.IdAccesorio === undefined ? "" : EstacionBraAcce.IdAccesorio);
    } else {
        $("#TxtOpcSelecAcce_Mues").data("IdAccesorio", TxtIdsec);
    }

    if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString())) {
        $("#row-1").prop("hidden", false);
        $("#row-2").prop("hidden", false);
        $("#CmbSetFoil_Mues").data("kendoComboBox").setDataSource(Fn_GetRequerimientoFoil($("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString()));
        if (xSeteoMEA !== null) {
            KdoCmbSetValue($("#CmbSetFoil_Mues"), xSeteoMEA.IdArticulo === undefined ? "" : xSeteoMEA.IdArticulo);
            KdoCmbSetValue($("#CmbConsUnidad_Mues"), xSeteoMEA.IdUnidadDimensionesConsumo === undefined ? "" : xSeteoMEA.IdUnidadDimensionesConsumo);
            kdoNumericSetValue($("#NumConsuAncho_Mues"), xSeteoMEA.AnchoConsumo);
            kdoNumericSetValue($("#NumConsuAlto_Mues"), xSeteoMEA.AltoConsumo);
        } else {
            KdoCmbSetValue($("#CmbConsUnidad_Mues"), 5);
        }
        KdoCmbFocus($("#CmbSetFoil_Mues"));
    } else {
        $("#row-1").prop("hidden", true);
        $("#row-2").prop("hidden", true);
        kdoNumericSetValue($("#NumConsuAncho_Mues"), 0);
        kdoNumericSetValue($("#NumConsuAlto_Mues"), 0);
        KdoCmbSetValue($("#CmbSetFoil_Mues"), "");
        KdoCmbSetValue($("#CmbConsUnidad_Mues"), "");
    }

};

var fn_GuardarEstacionAccesorioMues = function () {

    fn_GuardarEstacionAcceMues(idBraAcce);
    var a = stage.find("#TxtInfo" + idBraAcce);
    a.text($("#TxtOpcSelecAcce_Mues").val());
    layer.draw();
};

var fn_GuardarEstacionAcceMues = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosMuest"), true);
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
            IdAccesorio: $("#TxtOpcSelecAcce_Mues").data("IdAccesorio")
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Mues").data("IdAccesorio").toString())) {
                fn_GuardarSeteoAccesMues(xIdBrazo);
            } else {
                kendo.ui.progress($("#MEstacionAccesoriosMuest"), false);
                maq = fn_GetMaquinas();
                $("#MEstacionAccesoriosMuest").data("kendoWindow").close();
                RequestEndMsg(data, xType);
            }
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosMuest"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GuardarSeteoAccesMues = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosMuest"), true);
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
            IdArticulo: KdoCmbGetValue($("#CmbSetFoil_Mues")),
            AltoConsumo: kdoNumericGetValue($("#NumConsuAlto_Mues")),
            AnchoConsumo: kdoNumericGetValue($("#NumConsuAncho_Mues")),
            IdUnidadDimensionesConsumo: KdoCmbGetValue($("#CmbConsUnidad_Mues"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosMuest"), false);
            maq = fn_GetMaquinas();
            $("#MEstacionAccesoriosMuest").data("kendoWindow").close();
            $("#row-1").attr("hidden", "hidden");
            $("#row-2").prop("hidden", "hidden");
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosMuest"), false);
            ErrorMsg(data);
        }
    });
};

fn_PWList.push(fn_VistaEstacionAccesoriosMues);
fn_PWConfList.push(fn_VistaEstacionAccesoriosMuesDocuReady);