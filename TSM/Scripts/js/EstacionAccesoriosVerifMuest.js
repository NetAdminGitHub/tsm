let xSeteo_MEA;
var fn_VistaEstacionAccesoriosVerifMuesDocuReady = function () {
    KdoButton($("#btnAddMEA_VerifMues"), "check", "Agregar"); 

    KdoComboBoxbyData($("#CmbConsUnidad_VerifMues"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad dimensiones ....");
    $("#CmbConsUnidad_VerifMues").data("kendoComboBox").setDataSource(fn_UnidadMedida("5"));


    KdoComboBoxbyData($("#CmbSetFoil_VerifMues"), "[]", "NombreArt", "IdArticulo", "Seleccione un foil ....", "", "");
    $("#CmbSetFoil_VerifMues").data("kendoComboBox").setDataSource(0);

    $("#row-1-vm").prop("hidden", true);
    $("#row-2-vm").prop("hidden", true);

    $("#NumConsuAncho_VerifMues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumConsuAlto_VerifMues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    var frmAcce_Verimues = $("#FrmGenEACC_VerifMues").kendoValidator({
        rules: {
            vuni: function (input) {
                if (input.is("[id='CmbConsUnidad_VerifMues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString()) !== undefined ? $("#CmbConsUnidad_VerifMues").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            vfoil: function (input) {
                if (input.is("[id='CmbSetFoil_VerifMues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString()) !== undefined ? $("#CmbSetFoil_VerifMues").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            anchoc: function (input) {

                if (input.is("[name='NumConsuAncho_VerifMues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString()) !== undefined ? $("#NumConsuAncho_VerifMues").data("kendoNumericTextBox").value() > 0 : true;
                }
                return true;
            },
            altoc: function (input) {

                if (input.is("[name='NumConsuAlto_VerifMues']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString()) !== undefined ? $("#NumConsuAlto_VerifMues").data("kendoNumericTextBox").value() > 0 : true;
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

    if (AccesMaquinaArt.find(q => q.IdAccesorio === ($("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio") === undefined ? "" : $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString() === undefined))) {
        $("#row-1-vm").prop("hidden", false);
        $("#row-2-vm").prop("hidden", false);
        KdoCmbSetValue($("#CmbConsUnidad_VerifMues"), 5);
    } else {
        $("#row-1-vm").prop("hidden", true);
        $("#row-2-vm").prop("hidden", true);
        kdoNumericSetValue($("#NumConsuAncho_VerifMues"), 0);
        kdoNumericSetValue($("#NumConsuAlto_VerifMues"), 0);
        KdoCmbSetValue($("#CmbSetFoil_VerifMues"), "");
        KdoCmbSetValue($("#CmbConsUnidad_VerifMues"), "");
    }

    $("#btnAddMEA_VerifMues").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmAcce_Verimues.validate()) {
            fn_GuardarEstacionAccesorioVerifMues();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });
};

var fn_VistaEstacionAccesoriosVerifMues = function () {
    //InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce_VerifMues"), false);
    $("#TxtOpcSelecAcce_VerifMues").val($("#TxtOpcSelecAcce_VerifMues").data("name"));
    idBraAcce = $("#TxtOpcSelecAcce_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);
    xSeteo_MEA = fn_GetSeteoMaqEstAcce(maq[0].IdSeteo, idBraAcce);

    if (EstacionBraAcce !== null) {
        $("#TxtOpcSelecAcce_VerifMues").val(EstacionBraAcce.Nombre1 === undefined ? "" : EstacionBraAcce.Nombre1);
        $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio", EstacionBraAcce.IdAccesorio === undefined ? "" : EstacionBraAcce.IdAccesorio);
    } else {
        $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio", TxtIdsec);
    }

    if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString())) {
        $("#row-1-vm").prop("hidden", false);
        $("#row-2-vm").prop("hidden", false);
        $("#CmbSetFoil_VerifMues").data("kendoComboBox").setDataSource(Fn_GetRequerimientoFoil($("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString()));
        if (xSeteo_MEA !== null) {
            KdoCmbSetValue($("#CmbSetFoil_VerifMues"), xSeteo_MEA.IdArticulo === undefined ? "" : xSeteo_MEA.IdArticulo);
            KdoCmbSetValue($("#CmbConsUnidad_VerifMues"), xSeteo_MEA.IdUnidadDimensionesConsumo === undefined ? "" : xSeteo_MEA.IdUnidadDimensionesConsumo);
            kdoNumericSetValue($("#NumConsuAncho_VerifMues"), xSeteo_MEA.AnchoConsumo);
            kdoNumericSetValue($("#NumConsuAlto_VerifMues"), xSeteo_MEA.AltoConsumo);
        } else {
            KdoCmbSetValue($("#CmbConsUnidad_VerifMues"), 5);
        }
        KdoCmbFocus($("#CmbSetFoil_VerifMues"));
    } else {
        $("#row-1-vm").prop("hidden", true);
        $("#row-2-vm").prop("hidden", true);
        kdoNumericSetValue($("#NumConsuAncho_VerifMues"), 0);
        kdoNumericSetValue($("#NumConsuAlto_VerifMues"), 0);
        KdoCmbSetValue($("#CmbSetFoil_VerifMues"), "");
        KdoCmbSetValue($("#CmbConsUnidad_VerifMues"), "");
    }

    KdoButtonEnable($("#btnAddMEA_VerifMues"), vhb);
};

var fn_GuardarEstacionAccesorioVerifMues = function () {
    fn_GuardarEstacionAcceVerifMues(idBraAcce);
};

var fn_GuardarEstacionAcceVerifMues = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosVerifMuest"), true);
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
            IdAccesorio: $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio")
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_VerifMues").data("IdAccesorio").toString())) {
                fn_GuardarSeteoAccesMues(xIdBrazo);
            } else {
                kendo.ui.progress($("#MEstacionAccesoriosVerifMuest"), false);
                $("#MEstacionAccesoriosVerifMuest").data("kendoWindow").close();
                RequestEndMsg(data, xType);
                maq = fn_GetMaquinas();
                $("#maquinaValidacionMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
            }
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosVerifMuest"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GuardarSeteoAccesMues = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosVerifMuest"), true);
    var xType;

    if (xSeteo_MEA === null) {
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
            IdArticulo: KdoCmbGetValue($("#CmbSetFoil_VerifMues")),
            AltoConsumo: kdoNumericGetValue($("#NumConsuAlto_VerifMues")),
            AnchoConsumo: kdoNumericGetValue($("#NumConsuAncho_VerifMues")),
            IdUnidadDimensionesConsumo: KdoCmbGetValue($("#CmbConsUnidad_VerifMues"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosVerifMuest"), false);
            maq = fn_GetMaquinas();
            $("#MEstacionAccesoriosVerifMuest").data("kendoWindow").close();
            $("#row-1-vm").attr("hidden", "hidden");
            $("#row-2-vm").prop("hidden", "hidden");
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosVerifMuest"), false);
            ErrorMsg(data);
        }
    });
};

fn_PWList.push(fn_VistaEstacionAccesoriosVerifMues);
fn_PWConfList.push(fn_VistaEstacionAccesoriosVerifMuesDocuReady);