var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;
let xAreaDis;
let xIdUnidadAreaDis;
let xCmbTecnica_Mues;
let xCmbBaseMezcla_Mues;
let xCmbPigmento_Mues;
let xNumResolucionDPI_Dis;
let xNumLineajeLPI_Dis;
let xNumPixeles_Dis;

var fn_VistaEstacionMuestraDocuReady = function () {
    KdoButton($("#btnAddMCE_Mues"), "check", "Agregar");
    $("#NumPasadas_Mues").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumCapilar_Mues").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });
    $("#NumPeso_Mues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtNombreQui_Mues").val(NombreQui);
    let UrlTT = TSM_Web_APi + "TiposTintas/GetbyIdQuimica/" + xIdQuimica.toString();
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_Mues"), UrlTT, "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");

    let UrlST = TSM_Web_APi + "SistemasTintas/GetbyTipoTintas/0";
    Kendo_CmbFiltrarGrid($("#CmbSistema_color_Mues"), UrlST, "Nombre", "IdSistemasTinta", "Seleccione un sitema tintas ....", "", "");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_Mues"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_Mues"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    KdoComboBoxbyData($("#CmdIdUnidadPeso_Mues"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad de peso ....");
    $("#CmdIdUnidadPeso_Mues").data("kendoComboBox").setDataSource(fn_UnidadMedida("1,21"));
    //KdoCmbSetValue($("#CmdIdUnidadPeso_Mues"), 21);

    let frmDiseno = $("#FrmGenEDiseno").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistema_color_Mues']")) {
                    return $("#CmbSistema_color_Mues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTT: function (input) {
                if (input.is("[id='CmbTipoTinta_Mues']")) {
                    return $("#CmbTipoTinta_Mues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTSed: function (input) {
                if (input.is("[id='CmbTipoTinta_Mues']")) {
                    return $("#CmbTipoTinta_Mues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTemul: function (input) {
                if (input.is("[id='CmbTipoEmulsion_Mues']")) {
                    return $("#CmbTipoEmulsion_Mues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vidUa: function (input) {
                if (input.is("[id='CmdIdUnidadPeso_Mues']")) {
                    return $("#CmdIdUnidadPeso_Mues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vpeso: function (input) {

                if (input.is("[name='NumPeso_Mues']")) {
                    return $("#NumPeso_Mues").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vletra: function (input) {
                if (input.is("[name='TxtLetra_Mues']")) {
                    return input.val().length <= 5;
                }
                return true;
            },
            vsuge: function (input) {
                if (input.is("[name='TxtFormulaSug_Mues']")) {
                    return input.val().length <= 200;
                }
                return true;
            }
        },
        messages: {
            vvpeso: "Requerido",
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul: "Requerido",
            vidUa: "Requerido",
            vletra: "Longitud máxima del campo es 5",
            vsuge: "Longitud máxima del campo es 200"
        }
    }).data("kendoValidator");

    $("#btnAddMCE_Mues").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmDiseno.validate()) {
            fn_GuardarEstacionMues();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#CmbTipoTinta_Mues").data("kendoComboBox").bind("change", function () {
        let TipoTin = KdoCmbGetValue($("#CmbTipoTinta_Mues"));
        KdoCmbSetValue($("#CmbSistema_color_Mues"), "");
        $("#CmbSistema_color_Mues").data("kendoComboBox").setDataSource(Fn_GetSistemaTintas(TipoTin));
    });

    $("#CmbSistema_color_Mues").data("kendoComboBox").bind("change", function () {
        // obtener el numero de pasadas por sistema de tintas
        if (KdoCmbGetValue($("#CmbSistema_color_Mues")) !== null) {
            let data = SisTintas.find(q => q.IdSistemasTinta === Number(KdoCmbGetValue($("#CmbSistema_color_Mues"))));
            kdoNumericSetValue($("#NumPasadas_Mues"), data.NoPasadas);
        } else {
            kdoNumericSetValue($("#NumPasadas_Mues"), 1);
        }
    });
};

var fn_VistaEstacionMuestra = function () {
    //InicioColor = true;
    TextBoxEnable($("#TxtOpcSelec_Mues"), false);
    TextBoxEnable($("#TxtNombreQui_Mues"), false);
    $("#TxtOpcSelec_Mues").val($("#TxtOpcSelec_Mues").data("name"));
    idBra = $("#TxtOpcSelec_Mues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    Te = $("#TxtOpcSelec_Mues").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);

    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Mues").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec_Mues").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                xCmbTecnica_Mues = setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica;
                xCmbBaseMezcla_Mues = setFor.IdBase === undefined ? "" : setFor.IdBase;
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Mues").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec_Mues").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                xCmbTecnica_Mues = null;
                xCmbBaseMezcla_Mues =null;
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Mues").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec_Mues").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                xCmbTecnica_Mues = null;
                xCmbBaseMezcla_Mues = null;
                break;
        }

        $("#TxtFormulaSug_Mues").val(setFor.SugerenciaFormula);
        KdoCmbSetValue($("#CmbTipoTinta_Mues"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        $("#CmbSistema_color_Mues").data("kendoComboBox").setDataSource(Fn_GetSistemaTintas(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        KdoCmbSetValue($("#CmbSistema_color_Mues"), setFor.IdSistemasTinta === undefined ? "" : setFor.IdSistemasTinta);
        xCmbPigmento_Mues= setFor.IdSistemasTintaPigmento === undefined ? "" : setFor.IdSistemasTintaPigmento;
    } else {
        $("#TxtFormulaSug_Mues").val("");
        KdoCmbSetValue($("#CmbTipoTinta_Mues"), "");
        $("#CmbSistema_color_Mues").data("kendoComboBox").setDataSource(Fn_GetSistemaTintas(0));
        KdoCmbSetValue($("#CmbSistema_color_Mues"), "");
        xCmbPigmento_Mues = null;
    }


    if (estaMarco !== null) {
        $("#NumCapilar_Mues").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas_Mues").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumPeso_Mues").data("kendoNumericTextBox").value(estaMarco.Peso);
        KdoCmbSetValue($("#CmbSedas_Mues"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmdIdUnidadPeso_Mues"), estaMarco.IdUnidadPeso);
        KdoCmbSetValue($("#CmbTipoEmulsion_Mues"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra_Mues").val(estaMarco.Letra);
        xAreaDis = estaMarco.Area;
        xIdUnidadAreaDis = estaMarco.IdUnidadArea;
        xNumResolucionDPI_Dis = estaMarco.ResolucionDPI;
        xNumLineajeLPI_Dis = estaMarco.LineajeLPI;
        xNumPixeles_Dis = estaMarco.Pixeles;
    } else {
        $("#NumCapilar_Mues").data("kendoNumericTextBox").value(0);
        $("#NumPasadas_Mues").data("kendoNumericTextBox").value(0);
        $("#NumPeso_Mues").data("kendoNumericTextBox").value(0);
        KdoCmbSetValue($("#CmdIdUnidadPeso_Mues"), 21);
        KdoCmbSetValue($("#CmbSedas_Mues"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_Mues"), "");
        $("#TxtLetra_Mues").val("");
        xAreaDis = 0;
        xIdUnidadAreaDis = 0;
        xNumResolucionDPI_Dis = 0;
        xNumLineajeLPI_Dis = 0;
        xNumPixeles_Dis = 0;
    }





};
//// funciones
let fn_GuardarEstacionMues = function () {

    GuardarEstacionDesaMues(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec_Mues").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

let fn_GuardarEstaMarcoMues = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionMuestra"), true);
    let xIdTipoFormulacion;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    xIdTipoFormulacion = Te;
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

    if (estaMarco === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            Capilar: $("#NumCapilar_Mues").val(),
            IdEstacion: xIdBrazo,
            IdTipoFormulacion: xIdTipoFormulacion,
            IdSeda: KdoCmbGetValue($("#CmbSedas_Mues")),
            NoPasadas: $("#NumPasadas_Mues").val(),
            Dureza: null,
            Angulo: null,
            Velocidad: null,
            Presion: null,
            Tension: null,
            OffContact: null,
            Letra: $("#TxtLetra_Mues").val(),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_Mues")),
            IdSeteo: maq[0].IdSeteo,
            Area: xAreaDis,
            IdUnidadArea: xIdUnidadAreaDis,
            Peso: kdoNumericGetValue($("#NumPeso_Mues")),
            IdUnidadPeso: KdoCmbGetValue($("#CmdIdUnidadPeso_Mues")),
            ResolucionDPI: xNumResolucionDPI_Dis,
            LineajeLPI:xNumLineajeLPI_Dis,
            Pixeles:xNumPixeles_Dis 

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec").data("IdRequerimientoTecnica") : Te === "COLOR" ? xCmbTecnica_Mues : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec").data("IdBase") : Te === "COLOR" ? xCmbBaseMezcla_Mues : null;
            fn_GuardarMarcoFormuMues(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_Mues").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionMuestra"), false);
            ErrorMsg(data);
        }
    });

};

let fn_GuardarMarcoFormuMues = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) {
    kendo.ui.progress($("#MEstacionMuestra"), true);
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

    if (setFor === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdSeteo: maq[0].IdSeteo,
            IdEstacion: xIdBrazo,
            IdBase: xidBase,
            IdRequerimientoTecnica: xidRequerimientoTecnica,
            IdRequerimientoColor: xidRequerimientoColor,
            SugerenciaFormula: $("#TxtFormulaSug_Mues").val(),
            IdSistemasTinta: KdoCmbGetValue($("#CmbSistema_color_Mues")),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemasTintaPigmento: xCmbPigmento_Mues
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            $("#MEstacionMuestra").data("kendoDialog").close();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionMuestra"), false);
            ErrorMsg(data);
        }
    });

};

let GuardarEstacionDesaMues = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionMuestra"), true);
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

    if (EstacionBra === null) {
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
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdTipoEstacion: "MARCO",
            IdAccesorio: null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GuardarEstaMarcoMues(xIdBrazo);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionMuestra"), false);
            ErrorMsg(data);
        }
    });

};

let fn_UnidadMedida = function (filtro) {
    let urlUM_Est = TSM_Web_APi + "UnidadesMedidas";
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url: urlUM_Est + "/GetUnidadesMedidasByFiltro",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(filtro),
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

fn_PWList.push(fn_VistaEstacionMuestra);
fn_PWConfList.push(fn_VistaEstacionMuestraDocuReady);