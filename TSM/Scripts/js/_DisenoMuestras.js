var Permisos;
var vIdIdDisenoMuestra;

var fn_DMCargarConfiguracion = function () {
    KdoButton($("#btnBTDis"), "delete", "Limpiar");
    KdoButton($("#btnDesplaCambio_Dis"), "arrows-kpi", "Desplazar/Intercambiar");
    KdoButtonEnable($("#btnBTDis"), false);
    KdoButtonEnable($("#btnDesplaCambio_Dis"), false);
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
    $("#NumLPelicula").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumTiempoTra").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    maq = fn_GetMaquinas();
    // colocar grid para arrastre
    fn_gridColorEstacion($("#dgColorDis"),maq[0].IdSeteo);
    $("#dgColorDis").data("Estacion", "MEstacionDisenos"); // guardar nombre vista modal
    $("#dgColorDis").data("EstacionJS", "EstacionDisenos.js"); // guardar nombre archivo JS
    $("#dgColorDis").data("TipoEstacion", "MARCO"); // guardar nombre archivo JS
    $("#dgColorDis").data("Formulacion", "COLOR"); // guardar nombre archivo JS

    fn_gridTecnicaEstacion($("#dgTecnicaDis"),maq[0].IdSeteo);
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

    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaDis"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaDis"), false);

    KdoCmbSetValue($("#CmbMaquinaDis"), maq[0].IdMaquina);


    //*****************************

    KdoComboBoxbyData($("#CmbIdUnidad"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmbIdUnidad").data("kendoComboBox").setDataSource(fn_UnidadMedida("14,5,19,22"));
    KdoCmbSetValue($("#CmbIdUnidad"), 5);

    KdoComboBoxbyData($("#CmbIdUnidadLP"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmbIdUnidadLP").data("kendoComboBox").setDataSource(fn_UnidadMedida("5"));
    KdoCmbSetValue($("#CmbIdUnidadLP"), 5);

    let UrlDM_OP = TSM_Web_APi + "OrientacionPositivos";
    Kendo_CmbFiltrarGrid($("#CmbIdOrientacionPositivo"), UrlDM_OP, "Nombre", "IdOrientacionPositivo", "Seleccione...");
    let UrlDM_TS = TSM_Web_APi + "TiposSeparaciones";
    Kendo_CmbFiltrarGrid($("#CmbIdTipoSeparacion"), UrlDM_TS, "Nombre", "IdTipoSeparacion", "Seleccione...");
    let URLImp = TSM_Web_APi + "Impresores";
    Kendo_CmbFiltrarGrid($("#CmbIdImpresor"), URLImp, "Nombre", "IdImpresor", "Seleccione...");

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
            cmUmLP: function (input) {
                if (input.is("[name='CmbIdUnidadLP']")) {
                    return $("#CmbIdUnidadLP").data("kendoComboBox").selectedIndex >= 0;
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
            },
            LP: function (input) {

                if (input.is("[name='NumLPelicula']")) {
                    return $("#NumLPelicula").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            Tt: function (input) {

                if (input.is("[name='NumTiempoTra']")) {
                    return $("#NumTiempoTra").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            }
        },
        messages:{
            cmop: "Requerido",
            cmTs: "Requerido",
            rdpi: "Requerido",
            anchod: "Requerido",
            cmUmLP:"Requerido",
            altod: "Requerido",
            cmUm: "Requerido",
            LP: "Requerido",
            Tt:"requerido"
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
    $("#btnDesplaCambio_Dis").click(function (e) {
        fn_OpenModalDesplazamiento();

    });
};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    fn_GetDisenoMuestra();
    KdoButtonEnable($("#btnBTDis"), vhb);
    KdoButtonEnable($("#btnDesplaCambio_Dis"), vhb);
    KdoComboBoxEnable($("#CmbIdOrientacionPositivo"), vhb);
    KdoComboBoxEnable($("#CmbIdTipoSeparacion"), vhb);
    KdoComboBoxEnable($("#CmbIdImpresor"), vhb);
    KdoComboBoxEnable($("#CmbIdUnidad"), vhb);
    KdoComboBoxEnable($("#CmbIdUnidadLP"), vhb);
    KdoNumerictextboxEnable($("#NumAnchoDiseno"), vhb);
    KdoNumerictextboxEnable($("#NumAltoDiseno"), vhb);
    KdoNumerictextboxEnable($("#NumAnchoDiseno"), vhb);
    KdoNumerictextboxEnable($("#NumLPelicula"), vhb);
    KdoNumerictextboxEnable($("#NumTiempoTra"), vhb);
    TextBoxEnable($("#TxtObservaciones"), vhb);
    Grid_HabilitaToolbar($("#dgColorDis"), vhb, vhb, vhb);
    Grid_HabilitaToolbar($("#dgTecnicaDis"), vhb, vhb, vhb);
    Grid_HabilitaToolbar($("#dgBasesDis"), vhb, vhb, vhb);
    Grid_HabilitaToolbar($("#dgAccesoriosDis"), vhb, vhb, vhb);
    KdoButtonEnable($("#btnGuardarDiseñoMues"), vhb);
};

//Agregar a Lista de ejecucion funcion configurar grid
fun_List.push(fn_DMCargarConfiguracion);
// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = fn_RTCargarMaquina;
fun_ListDatos.push(EtapaPush);
//Agregar a lista de ejecucion funcion mostrar grid y carga de etapa
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_DMCargarEtapa;
fun_ListDatos.push(EtapaPush2);
// activa DropTarget
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_RTActivaDropTarget;
fun_ListDatos.push(EtapaPush3);

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
                kdoNumericSetValue($("#NumAltoDiseno"), respuesta.Alto);
                kdoNumericSetValue($("#NumAnchoDiseno"), respuesta.Ancho);
                KdoCmbSetValue($("#CmbIdUnidad"), respuesta.IdUnidad);
                KdoCmbSetValue($("#CmbIdOrientacionPositivo"), respuesta.IdOrientacionPositivo);
                KdoCmbSetValue($("#CmbIdTipoSeparacion"), respuesta.IdTipoSeparacion);
                $("#DtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                $("#TxtObservaciones").val(respuesta.Observaciones);
                $("#TxtDirectorio").val(respuesta.RutaArchivos);
                KdoCmbSetValue($("#CmbIdImpresor"), respuesta.IdImpresor);
                kdoNumericSetValue($("#NumLPelicula"),respuesta.LongitudPelicula);
                KdoCmbSetValue($("#CmbIdUnidadLP"), respuesta.IdUnidadLongitudPelicula);
                kdoNumericSetValue($("#NumTiempoTra"), respuesta.TiempoTrabajo);
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
            RutaArchivos: $("#TxtDirectorio").val(),
            IdOrientacionPositivo: KdoCmbGetValue($("#CmbIdOrientacionPositivo")),
            IdTipoSeparacion: KdoCmbGetValue($("#CmbIdTipoSeparacion")),
            Observaciones: $("#TxtObservaciones").val(),
            IdImpresor: KdoCmbGetValue($("#CmbIdImpresor")),
            LongitudPelicula: kdoNumericGetValue($("#NumLPelicula")),
            IdUnidadLongitudPelicula: KdoCmbGetValue($("#CmbIdUnidadLP")),
            TiempoTrabajo: kdoNumericGetValue($("#NumTiempoTra"))
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