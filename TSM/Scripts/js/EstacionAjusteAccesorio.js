let xSeteoMEA;
var fn_VistaEstacionAccesoriosAjusteDocuReady = function () {
    KdoButton($("#btnAddMEA_Ajuste"), "check", "Agregar");

    KdoComboBoxbyData($("#CmbConsUnidad_Ajuste"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad dimensiones ....");
    $("#CmbConsUnidad_Ajuste").data("kendoComboBox").setDataSource(fn_UnidadMedida("5"));


    KdoComboBoxbyData($("#CmbSetFoil_Ajuste"), "[]", "NombreArt", "IdArticulo", "Seleccione un foil ....", "", "");
    $("#CmbSetFoil_Ajuste").data("kendoComboBox").setDataSource(0);

    $("#rowAjuste-1").prop("hidden", true);
    $("#rowAjuste-2").prop("hidden", true);

    $("#NumAncho_Ajuste").kendoNumericTextBox({
        size: "large",
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#NumAlto_Ajuste").kendoNumericTextBox({
        size: "large",
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    let txtAnchoConsu = $("#NumConsuAncho_Ajuste").kendoNumericTextBox({
        size: "large",
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0,
    });
    let txtAltoConsu = $("#NumConsuAlto_Ajuste").kendoNumericTextBox({
        size: "large",
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    KdoNumerictextboxEnable(txtAnchoConsu, false);
    KdoNumerictextboxEnable(txtAltoConsu, false);

    $("#NumAncho_Ajuste").bind("change", function (e) {
        var val = parseFloat(this.value);
        $("#NumConsuAncho_Ajuste").data("kendoNumericTextBox").value(val + 0.5);
    });

    $("#NumAlto_Ajuste").bind("change", function (e) {
        var val = parseFloat(this.value);
        $("#NumConsuAlto_Ajuste").data("kendoNumericTextBox").value(val + 0.5);
    });

    var frmAcce = $("#FrmGENAjusteAcce").kendoValidator({
        rules: {
            vuni: function (input) {
                if (input.is("[id='CmbConsUnidad_Ajuste']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString()) !== undefined ? $("#CmbConsUnidad_Ajuste").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            vfoil: function (input) {
                if (input.is("[id='CmbSetFoil_Ajuste']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString()) !== undefined ? $("#CmbSetFoil_Ajuste").data("kendoComboBox").selectedIndex >= 0 : true;
                }
                return true;
            },
            anchoc: function (input) {

                if (input.is("[name='NumAncho_Ajuste']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString()) !== undefined ? $("#NumAncho_Ajuste").data("kendoNumericTextBox").value() > 0 : true;
                }
                return true;
            },
            altoc: function (input) {

                if (input.is("[name='NumAlto_Ajuste']")) {
                    return AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString()) !== undefined ? $("#NumAlto_Ajuste").data("kendoNumericTextBox").value() > 0 : true;
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

    if (AccesMaquinaArt.find(q => q.IdAccesorio === ($("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio") === undefined ? "" : $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString() === undefined))) {
        $("#rowAjuste-1").prop("hidden", false);
        $("#rowAjuste-2").prop("hidden", false);
        KdoCmbSetValue($("#CmbConsUnidad_Ajuste"), 5);
    } else {
        $("#rowAjuste-1").prop("hidden", true);
        $("#rowAjuste-2").prop("hidden", true);
        kdoNumericSetValue($("#NumAncho_Ajuste"), 0);
        kdoNumericSetValue($("#NumAlto_Ajuste"), 0);
        KdoCmbSetValue($("#CmbSetFoil_Ajuste"), "");
        KdoCmbSetValue($("#CmbConsUnidad_Ajuste"), "");
    }

    $("#btnAddMEA_Ajuste").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmAcce.validate()) {
            fn_GuardarEstacionAccesorioAjuste();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });
};

var fn_VistaEstacionAccesoriosAjuste = function () {
    //InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce_Ajuste"), false);
    $("#TxtOpcSelecAcce_Ajuste").val($("#TxtOpcSelecAcce_Ajuste").data("name"));
    idBraAcce = $("#TxtOpcSelecAcce_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);
    xSeteoMEA = fn_GetSeteoMaqEstAcce(maq[0].IdSeteo, idBraAcce);

    if (EstacionBraAcce !== null) {
        $("#TxtOpcSelecAcce_Ajuste").val(EstacionBraAcce.Nombre1 === undefined ? "" : EstacionBraAcce.Nombre1);
        $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio", EstacionBraAcce.IdAccesorio === undefined ? "" : EstacionBraAcce.IdAccesorio);
    } else {
        $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio", TxtIdsec);
    }

    if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString())) {
        $("#rowAjuste-1").prop("hidden", false);
        $("#rowAjuste-2").prop("hidden", false);
        $("#CmbSetFoil_Ajuste").data("kendoComboBox").setDataSource(Fn_GetRequerimientoFoil($("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString()));
        if (xSeteoMEA !== null) {
            KdoCmbSetValue($("#CmbSetFoil_Ajuste"), xSeteoMEA.IdArticulo === undefined ? "" : xSeteoMEA.IdArticulo);
            KdoCmbSetValue($("#CmbConsUnidad_Ajuste"), xSeteoMEA.IdUnidadDimensionesConsumo === undefined ? "" : xSeteoMEA.IdUnidadDimensionesConsumo);
            kdoNumericSetValue($("#NumAncho_Ajuste"), xSeteoMEA.Ancho);
            kdoNumericSetValue($("#NumAlto_Ajuste"), xSeteoMEA.Alto);
            kdoNumericSetValue($("#NumConsuAncho_Ajuste"), xSeteoMEA.AnchoConsumo);
            kdoNumericSetValue($("#NumConsuAlto_Ajuste"), xSeteoMEA.AltoConsumo);
        } else {
            KdoCmbSetValue($("#CmbConsUnidad_Ajuste"), 5);
        }
        KdoCmbFocus($("#CmbSetFoil_Ajuste"));
    } else {
        $("#rowAjuste-1").prop("hidden", true);
        $("#rowAjuste-2").prop("hidden", true);
        kdoNumericSetValue($("#NumAncho_Ajuste"), 0);
        kdoNumericSetValue($("#NumAlto_Ajuste"), 0);
        kdoNumericSetValue($("#NumConsuAncho_Ajuste"), 0);
        kdoNumericSetValue($("#NumConsuAlto_Ajuste"), 0);
        KdoCmbSetValue($("#CmbSetFoil_Ajuste"), "");
        KdoCmbSetValue($("#CmbConsUnidad_Ajuste"), "");
    }
    KdoButtonEnable($("#btnAddMEA_Ajuste"), dtoDiseno);
};

var fn_GuardarEstacionAccesorioAjuste = function () {
    fn_GuardarEstacionAcceAjuste(idBraAcce);
};

var fn_GuardarEstacionAcceAjuste = function (xIdBrazo) {
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
            IdAccesorio: $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio")
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (AccesMaquinaArt.find(q => q.IdAccesorio === $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio").toString())) {
                fn_GuardarSeteoAccesAjuste(xIdBrazo);
            } else {
                kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
                $("#MEstacionAccesoriosDis").data("kendoWindow").close();
                RequestEndMsg(data, xType);
                maq = fn_GetMaquinas();
                $("#maquinaDiseno").data("maquinaSerigrafia").cargarDataMaquina(maq);
            }
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GuardarSeteoAccesAjuste = function (xIdBrazo) {
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
            IdArticulo: KdoCmbGetValue($("#CmbSetFoil_Ajuste")),
            Alto: kdoNumericGetValue($("#NumAlto_Ajuste")),
            Ancho: kdoNumericGetValue($("#NumAncho_Ajuste")),
            AltoConsumo: kdoNumericGetValue($("#NumConsuAlto_Ajuste")),
            AnchoConsumo: kdoNumericGetValue($("#NumConsuAncho_Ajuste")),
            IdUnidadDimensionesConsumo: KdoCmbGetValue($("#CmbConsUnidad_Ajuste"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            maq = fn_GetMaquinas();
            $("#MEstacionAccesoriosDis").data("kendoWindow").close();
            $("#rowAjuste-1").attr("hidden", "hidden");
            $("#rowAjuste-2").prop("hidden", "hidden");
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            ErrorMsg(data);
        }
    });
};

fn_PWList.push(fn_VistaEstacionAccesoriosAjuste);
fn_PWConfList.push(fn_VistaEstacionAccesoriosAjusteDocuReady);