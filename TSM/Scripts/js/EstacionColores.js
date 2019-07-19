var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;
var fn_VistaEstacionColor = function () {
    InicioColor = true;

    TextBoxEnable($("#TxtOpcSelec"), false);
    KdoButton($("#btnAddMCE"), "check", "Agregar");
    $("#NumPasadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });


    $("#NumCapilar").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });


    $("#TxtOpcSelec").val($("#TxtOpcSelec").data("name"));

    let UrlTT = TSM_Web_APi + "TiposTintas";
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_color"), UrlTT, "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");

    let UrlST = TSM_Web_APi + "SistemasTintas";
    Kendo_CmbFiltrarGrid($("#CmbSistema_color"), UrlST, "Nombre", "IdSistemasTinta", "Seleccione un sitema tintas ....", "", "CmbTipoTinta_color");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_color"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");


    idBra = $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit","");

    Te = $("#TxtOpcSelec").data("TipoEstacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);

    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                break;
            case "TECNICAS":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdTecnica", setFor.IdTecnica === undefined ? "" : setFor.IdTecnica );
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                break;
            case "BASES":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                break;
        }
        $("#TxtFormulaSug").val(setFor.SugerenciaFormula);
        //KdoCmbSetValue($("#CmbTipoTinta_color"), estaMarco[0].idt);
        KdoCmbSetValue($("#CmbSistema_color"), setFor.IdSistemasTinta);
    }

    if (estaMarco !== null) {
        $("#NumCapilar").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        KdoCmbSetValue($("#CmbSedas_color"), estaMarco.IdSeda);
    }



    let frmColor = $("#FrmGenEColor").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistema_color']")) {
                    return $("#CmbSistema_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTT: function (input) {
                if (input.is("[id='CmbTipoTinta_color']")) {
                    return $("#CmbTipoTinta_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTSed: function (input) {
                if (input.is("[id='CmbTipoTinta_color']")) {
                    return $("#CmbTipoTinta_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }

        },
        messages: {
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido"
        }
    }).data("kendoValidator");


    $("#btnAddMCE").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmColor.validate()) {
            fn_GuardarEstacionColor();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });


};


//// funciones
let fn_GuardarEstacionColor = function () {

    fn_GuardarEstacion(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    let xIdTipoFormulacion;
    switch (Te) {
        case "COLOR":
            b.IdTipoFormulacion = "COLOR";
            break;
        case "TECNICAS":
            b.IdTipoFormulacion  = "TECNICA";
            break;
        case "BASES":
            b.IdTipoFormulacion  = "BASE";
            break;
        default:
            b.IdTipoFormulacion = null;
    }
    layer.draw();
};

let fn_GuardarEstaMarco = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionColor"), true);
    let xIdTipoFormulacion;
    switch (Te) {
        case "COLOR":
            xIdTipoFormulacion = "COLOR";
            break;
        case "TECNICAS":
            xIdTipoFormulacion = "TECNICA";
            break;
        case "BASES":
            xIdTipoFormulacion = "BASE";
            break;
        default:
            IdTipoFormulacion = null;
    }

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
            Capilar: $("#NumCapilar").val(),
            IdEstacion: xIdBrazo,
            IdTipoFormulacion: xIdTipoFormulacion,
            IdSeda: KdoCmbGetValue($("#CmbSedas_color")),
            NoPasadas: $("#NumPasadas").val(),
            Dureza: null,
            Angulo: null,
            Velocidad: null,
            Presion: null,
            Tension: null,
            OffContact: null,
            Letra: null,
            IdUsuarioMod:getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: null,
            IdSeteo: maq[0].IdSeteo

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GuardarMarcoFormu(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec").data("IdRequerimientoColor") : null, Te === "TECNICAS" ? $("#TxtOpcSelec").data("IdTecnica") : null, Te === "BASES" ? $("#TxtOpcSelec").data("IdBase") : null);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

let fn_GuardarMarcoFormu = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase ) {
    kendo.ui.progress($("#MEstacionColor"), true);
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

    if (setFor===null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo +"/" + xIdBrazo;
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
            SugerenciaFormula: $("#TxtFormulaSug").val(),
            IdSistemasTinta: KdoCmbGetValue($("#CmbSistema_color")),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#MEstacionColor").modal('hide');
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

let fn_GuardarEstacion = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionColor"), true);
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
            IdAccesorio:null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GuardarEstaMarco(xIdBrazo);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

let fn_GetMarcoFormulacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
            kendo.ui.progress($("#MEstacionColor"), false);
        }
    });

    return result;
};

let fn_EstacionesMarcos = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + xIdSeteo + "/" + xIdestacion,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
            kendo.ui.progress($("#MEstacionColor"), false);
        }
    });

    return result;
};

let fn_Estaciones = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstaciones/" + xIdSeteo + "/" + xIdestacion,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
            kendo.ui.progress($("#MEstacionColor"), false);
        }
    });

    return result;
};

fn_PWList.push(fn_VistaEstacionColor);