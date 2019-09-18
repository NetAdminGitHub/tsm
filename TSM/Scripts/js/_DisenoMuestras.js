var Permisos;
let vIdIdDisenoMuestra;

var fn_DMCargarConfiguracion = function () {
    KdoButton($("#btnBTDis"), "delete", "Limpiar");
    KdoButtonEnable($("#btnBTDis"), false);
    $("#NumResolucionDPI").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    $("#NumLineajeLPI").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumAltoDiseno").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#NumAnchoDiseno").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    // colocar grid para arrastre
    fn_gridColorEstacion($("#dgColorDis"));
    $("#dgColorDis").data("Estacion", "MEstacionDisenos"); // guardar nombre vista modal
    $("#dgColorDis").data("EstacionJS", "EstacionDisenos.js"); // guardar nombre archivo JS
    $("#dgColorDis").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgColorDis").data("Formulacion", "COLOR"); // guardar nombre archivo JS

    fn_gridTecnicaEstacion($("#dgTecnicaDis"));
    $("#dgTecnicaDis").data("Estacion", "MEstacionDisenos"); // guardar nombre vista modal
    $("#dgTecnicaDis").data("EstacionJS", "EstacionDisenos.js"); // guardar nombre archivo JS
    $("#dgTecnicaDis").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgTecnicaDis").data("Formulacion", "TECNICA"); //guarda el idformulacion

    fn_gridBasesEstacion($("#dgBasesDis"));
    $("#dgBasesDis").data("Estacion", "MEstacionDisenos"); // guardar nombre vista modal
    $("#dgBasesDis").data("EstacionJS", "EstacionDisenos.js"); // guardar nombre archivo JS
    $("#dgBasesDis").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgBasesDis").data("Formulacion", "BASE"); // guarda el idformulacion

    fn_gridAccesoriosEstacion($("#dgAccesoriosDis"));
    $("#dgAccesoriosDis").data("Estacion", "MEstacionAccesoriosDis"); // guardar nombre vista modal
    $("#dgAccesoriosDis").data("EstacionJS", "EstacionAccesoriosDis.js"); // guardar nombre archivo JS
    $("#dgAccesoriosDis").data("TipoEstacion", "ACCESORIO"); // guardar nombre archivo JS
    $("#dgAccesoriosDis").data("Formulacion", ""); // guarda el idformulacion
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaDis"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaDis"), false);

    KdoCmbSetValue($("#CmbMaquinaDis"), maq[0].IdMaquina);

    let vContenedor = $("#container");
    $(vContenedor).kendoDropTarget({
        drop: function (e) { dropElemento(e); },
        group: "gridGroup"
    });
    //*****************************
    let UrlUMDM = TSM_Web_APi + "UnidadesMedidas";
    Kendo_CmbFiltrarGrid($("#CmbIdUnidad"), UrlUMDM, "Abreviatura", "IdUnidad", "Seleccione...");
    let UrlDM_OP = TSM_Web_APi + "OrientacionPositivos";
    Kendo_CmbFiltrarGrid($("#CmbIdOrientacionPositivo"), UrlDM_OP, "Nombre", "IdOrientacionPositivo", "Seleccione...");
    let UrlDM_TS = TSM_Web_APi + "TiposSeparaciones";
    Kendo_CmbFiltrarGrid($("#CmbIdTipoSeparacion"), UrlDM_TS, "Nombre", "IdTipoSeparacion", "Seleccione...");
    KdoButton($("#btnGuardarDiseñoMues"), "save", "Guardar");
    $("#DtFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    KdoDatePikerEnable($("#DtFecha"), false);

    // varible para validar formularios
    let valFrmDm = $("#FrmDM").kendoValidator({
        rules: {
            cmop: function (input) {
                if (input.is("[name='CmbIdOrientacionPositivo']")) {
                    return $("#CmbIdOrientacionPositivo").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            cmTs: function (input) {
                if (input.is("[name='CmbIdTipoSeparacion']")) {
                    return $("#CmbIdTipoSeparacion").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            cmUm: function (input) {
                if (input.is("[name='CmbIdUnidad']")) {
                    return $("#CmbIdUnidad").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            rdpi: function (input) {

                if (input.is("[name='NumResolucionDPI']")) {
                    return $("#NumResolucionDPI").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            ldpi: function (input) {

                if (input.is("[name='NumLineajeLPI']")) {
                    return $("#NumLineajeLPI").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            anchod: function (input) {

                if (input.is("[name='NumAnchoDiseno']")) {
                    return $("#NumAnchoDiseno").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            altod: function (input) {

                if (input.is("[name='NumAltoDiseno']")) {
                    return $("#NumAltoDiseno").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            }
        },
        messages:{
            cmop: "Requerido",
            cmTs: "Requerido",
            rdpi: "Requerido",
            ldpi: "Requerido",
            anchod: "Requerido",
            altod: "Requerido",
            cmUm:"Requerido"
        }

    }).data("kendoValidator");

    $("#btnGuardarDiseñoMues").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (valFrmDm.validate()) {
            fn_GuardarDM();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#btnBTDis").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });

    });

    fn_RTCargarMaquina();
};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    fn_GetDisenoMuestra();
    KdoButtonEnable($("#btnBTDis"), vhb);
};

fun_List.push(fn_DMCargarConfiguracion);
fun_ListDatos.push(fn_DMCargarEtapa);

let fn_GetDisenoMuestra = function () {
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: TSM_Web_APi + "DisenoMuestras/" + $("#txtId").val(),
        dataType: "json",
        type: 'GET',
        async: false,
        success: function (respuesta) {
            if (respuesta !== null) {
                vIdIdDisenoMuestra = respuesta.IdDisenoMuestra;
                kendo.ui.progress($("#vistaParcial"), true);
                kdoNumericSetValue($("#NumResolucionDPI"), respuesta.ResolucionDPI);
                kdoNumericSetValue($("#NumLineajeLPI"), respuesta.LineajeLPI);
                kdoNumericSetValue($("#NumAltoDiseno"), respuesta.Alto);
                kdoNumericSetValue($("#NumAnchoDiseno"), respuesta.Ancho);
                KdoCmbSetValue($("#CmbIdUnidad"), respuesta.IdUnidad);
                KdoCmbSetValue($("#CmbIdOrientacionPositivo"), respuesta.IdOrientacionPositivo);
                KdoCmbSetValue($("#CmbIdTipoSeparacion"), respuesta.IdTipoSeparacion);
                $("#DtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                $("#TxtObservaciones").val(respuesta.Observaciones);
                $("#TxtDirectorio").val(respuesta.RutaArchivos);
            }
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
};
let fn_GuardarDM = function () {
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: TSM_Web_APi + "DisenoMuestras/" + vIdIdDisenoMuestra,
        dataType: "json",
        type: "Put",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            IdDisenoMuestra: vIdIdDisenoMuestra,
            IdRequerimiento: $("#txtIdRequerimiento").val(),
            Fecha: kendo.toString(kendo.parseDate($("#DtFecha").val()), 's'),
            Alto: kdoNumericGetValue($("#NumAltoDiseno")),
            Ancho: kdoNumericGetValue($("#NumAnchoDiseno")),
            IdUnidad: KdoCmbGetValue($("#CmbIdUnidad")),
            ResolucionDPI: kdoNumericGetValue($("#NumResolucionDPI")),
            LineajeLPI: kdoNumericGetValue($("#NumLineajeLPI")),
            RutaArchivos: $("#TxtDirectorio").val(),
            IdOrientacionPositivo: KdoCmbGetValue($("#CmbIdOrientacionPositivo")),
            IdTipoSeparacion: KdoCmbGetValue($("#CmbIdTipoSeparacion")),
            Observaciones: $("#TxtObservaciones").val()
        }),
        success: function (data) {
            RequestEndMsg(data, "Put");
            kendo.ui.progress($("#vistaParcial"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
            ErrorMsg(data);
            KdoCmbFocus($("CmbIdOrientacionPositivo"));
        }

    });
};
fPermisos = function (datos) {
    Permisos = datos;
};