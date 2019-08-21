var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;

var fn_VistaEstacionColorDocuReady = function () {
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
    $("#TxtNombreQui").val(NombreQui);
    let UrlTT = TSM_Web_APi + "TiposTintas/GetbyIdQuimica/"+xIdQuimica.toString();
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_color"), UrlTT, "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");

    let UrlST = TSM_Web_APi + "SistemasTintas";
    Kendo_CmbFiltrarGrid($("#CmbSistema_color"), UrlST, "Nombre", "IdSistemasTinta", "Seleccione un sitema tintas ....", "", "CmbTipoTinta_color");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_color"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_color"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

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
            },
            vTemul: function (input) {
                if (input.is("[id='CmbTipoEmulsion_color']")) {
                    return $("#CmbTipoEmulsion_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }


        },
        messages: {
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul:"Requerido"
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

var fn_VistaEstacionColor = function () {
    //InicioColor = true;
    TextBoxEnable($("#TxtOpcSelec"), false);
    TextBoxEnable($("#TxtNombreQui"), false);
    $("#TxtOpcSelec").val($("#TxtOpcSelec").data("name"));
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
                $("#TxtOpcSelec").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor ); 
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica); 
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                break;
        }
      
        $("#TxtFormulaSug").val(setFor.SugerenciaFormula);
        KdoCmbSetValue($("#CmbTipoTinta_color"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistema_color"),setFor.IdSistemasTinta === undefined ? "" : setFor.IdSistemasTinta);
    } else {
        $("#TxtFormulaSug").val("");
        KdoCmbSetValue($("#CmbTipoTinta_color"), "");
        KdoCmbSetValue($("#CmbSistema_color"), "");
    }


    if (estaMarco !== null) {
        $("#NumCapilar").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        KdoCmbSetValue($("#CmbSedas_color"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), estaMarco.IdTipoEmulsion);
    } else {
        $("#NumCapilar").data("kendoNumericTextBox").value(0);
        $("#NumPasadas").data("kendoNumericTextBox").value(0);
        KdoCmbSetValue($("#CmbSedas_color"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), "");
    }





};
//// funciones
let fn_GuardarEstacionColor = function () {

    fn_GuardarEstacion(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
     //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

let fn_GuardarEstaMarco = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionColor"), true);
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
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_color")),
            IdSeteo: maq[0].IdSeteo

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GuardarMarcoFormu(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec").data("IdRequerimientoColor") : null, Te === "TECNICA" ? $("#TxtOpcSelec").data("IdRequerimientoTecnica") : null, Te === "BASE" ? $("#TxtOpcSelec").data("IdBase") : null);
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
            maq = fn_GetMaquinas();
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
fn_PWConfList.push(fn_VistaEstacionColorDocuReady);