var Permisos;
var vIdIdDisenoMuestra;

var fn_DMCargarConfiguracion = function () {
 
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
    TiEst = fn_GetTipoEstaciones();
   
    //***************************

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

    KdoNumerictextboxEnable($("#NumAnchoDiseno"), false);
    KdoNumerictextboxEnable($("#NumAltoDiseno"), false);
    KdoComboBoxEnable($("#CmbIdUnidad"), false);
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
                    return $("#NumLPelicula").data("kendoNumericTextBox").element[0].disabled === false && $("#NumLPelicula").data("kendoNumericTextBox").value() > 0;
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

    $("#CmbIdImpresor").data("kendoComboBox").bind("change", function (e) {
        let _usapositivos = false
        if (this.dataItem()) {
            _usapositivos = this.dataItem().Positivos;
        }

        KdoNumerictextboxEnable($("#NumLPelicula"), _usapositivos);
    });

    $("#maquinaDiseno").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                    maq = fn_GetMaquinas();
                    $("#maquinaDiseno").data("maquinaSerigrafia").cargarDataMaquina(maq);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    var dataCopy = e.detail[0];
                    fn_DuplicarBrazoMaquina($("#maquinaDiseno").data("maquinaSerigrafia").maquina, dataCopy);
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    //$("#maquinaDiseno").data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio);
                    fn_TrasladarEstacion(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio, $("#maquinaDiseno"));
                },
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaDiseno").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaDiseno"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                    fn_EliminarEstacion(maq[0].IdSeteo,e,$("#maquinaDiseno"));
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaDiseno").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaDiseno"), 1);


                }
            }
        },
        tipoMaquina:
        {
            mostrar: true,
            eventos: {
                onChange: elementoSeleccionado_Diseno
            }
        },
        colores: { mostrar: true },
        tecnicas: { mostrar: true },
        bases: { mostrar: true },
        accesorios: { mostrar: true }
    });

    fn_GetFormasMaquina($("#maquinaDiseno").data("maquinaSerigrafia"));
    $("#maquinaDiseno").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
    fn_GetColores($("#maquinaDiseno").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaDiseno").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Bases($("#maquinaDiseno").data("maquinaSerigrafia"));
    fn_Accesorios($("#maquinaDiseno").data("maquinaSerigrafia"));

};

var elementoSeleccionado_Diseno = function (e) {

    if (Number(maq[0].IdFormaMaquina) !== Number(e.detail[0].IdFormaMaquina)) {
        if ($("#maquinaDiseno").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina) === "OK") {
            fn_UpdFormaRevTec(e.detail[0].CantidadEstaciones, e.detail[0].IdFormaMaquina, e.detail[0].NomFiguraMaquina, $("#maquinaDiseno"), 0);
        }
    } 
};


var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    fn_GetDisenoMuestra();
    KdoComboBoxEnable($("#CmbIdOrientacionPositivo"), vhb);
    KdoComboBoxEnable($("#CmbIdTipoSeparacion"), vhb);
    KdoComboBoxEnable($("#CmbIdImpresor"), vhb);
    KdoComboBoxEnable($("#CmbIdUnidadLP"), vhb);
    KdoNumerictextboxEnable($("#NumLPelicula"), vhb);
    KdoNumerictextboxEnable($("#NumTiempoTra"), vhb);
    TextBoxEnable($("#TxtObservaciones"), vhb);
    KdoButtonEnable($("#btnGuardarDiseñoMues"), vhb);
    $("#maquinaDiseno").data("maquinaSerigrafia").activarSoloLectura(!vhb);
};

//Agregar a Lista de ejecucion funcion configurar grid
fun_List.push(fn_DMCargarConfiguracion);

//Agregar a lista de ejecucion funcion mostrar grid y carga de etapa8
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_DMCargarEtapa;
fun_ListDatos.push(EtapaPush2);


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