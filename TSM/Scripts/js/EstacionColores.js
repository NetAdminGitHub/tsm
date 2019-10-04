var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;
var EstaTintasFormula;

var fn_VistaEstacionColorDocuReady = function () {
    KdoButton($("#btnccc"), "search", "Buscar en formula historicas..");
    KdoButtonEnable($("#btnccc"), false);
    KdoButton($("#btnDelFT"), "delete", "Borrar formula..");
    KdoButtonEnable($("#btnDelFT"), false);

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
    let UrlTT = TSM_Web_APi + "TiposTintas/GetbyIdQuimica/" + xIdQuimica.toString();
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_color"), UrlTT, "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");

    let UrlST = TSM_Web_APi + "SistemasTintas";
    Kendo_CmbFiltrarGrid($("#CmbSistema_color"), UrlST, "Nombre", "IdSistemasTinta", "Seleccione un sitema tintas ....", "", "CmbTipoTinta_color");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_color"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_color"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    let UrlRqTec = TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/GetRequerimientoDesarrollosColoresTecnicaByIdRequerimiento/" + $("#txtIdRequerimiento").val();
    Kendo_CmbFiltrarGrid($("#CmbTecnica_color"), UrlRqTec, "Nombre", "IdRequerimientoTecnica", "Seleccione una Tecnica ....");
    KdoComboBoxEnable($("#CmbTecnica_color"), false);

    let Urlpig = TSM_Web_APi + "SistemasTintas";
    Kendo_CmbFiltrarGrid($("#CmbPigmento_color"), Urlpig, "Nombre", "IdSistemasTinta", "Seleccione un Pigmento ....", "", "");


    let UrlBMezcla = TSM_Web_APi + "BasesMuestras";
    Kendo_CmbFiltrarGrid($("#CmbBaseMezcla_color"), UrlBMezcla, "Nombre", "IdBase", "Seleccione un Base Mezcla ....", "", "");

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
            },
            vsuge: function (input) {
                if (input.is("[name='TxtFormulaSug']")) {
                    return input.val().length <= 200;
                }
                return true;
            },
            vtecapli: function (input) {
                if (input.is("[id='CmbTecnica_color']")) {
                    return $("#CmbTecnica_color").data("kendoComboBox").text() === "" ? true : $("#CmbTecnica_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vbmez: function (input) {
                if (input.is("[id='CmbBaseMezcla_color']")) {
                    return $("#CmbBaseMezcla_color").data("kendoComboBox").text() === "" ? true : $("#CmbBaseMezcla_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vPig: function (input) {
                if (input.is("[id='CmbPigmento_color']")) {
                    return $("#CmbPigmento_color").data("kendoComboBox").text() === "" ? true : $("#CmbPigmento_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
            
        },
        messages: {
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul: "Requerido",
            vsuge: "Longitud máxima del campo es 200",
            vtecapli: "Requerido",
            vbmez: "Requerido",
            vPig:"Requerido"
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

    $("#btnccc").data("kendoButton").bind("click", function () {
        fn_FormulaHistorica("FormulaHist");
    });
    $("#btnDelFT").data("kendoButton").bind("click", function () {
        fn_DelFormulaHis();
    });

    $("#FormulaHist").on("ObtenerFormula", function (event, CodigoColor) {
        fn_GuardarEstacionFormula(idBra, CodigoColor);
    });

};


var fn_VistaEstacionColor = function () {

    Kendo_CmbFocus($("#CmbTipoTinta_color"));
    TextBoxEnable($("#TxtOpcSelec"), false);
    TextBoxEnable($("#TxtNombreQui"), false);
    TextBoxEnable($("#NumMasaEntre"), false);
    $("#TxtOpcSelec").val($("#TxtOpcSelec").data("name"));
    idBra = $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit","");
    Te = $("#TxtOpcSelec").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);
    EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, idBra);

    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor); 
                KdoCmbSetValue($("#CmbTecnica_color"), setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_color"), true);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoCmbSetValue($("#CmbBaseMezcla_color"), setFor.IdBase === undefined ? "" : setFor.IdBase);
                KdoComboBoxEnable($("#CmbBaseMezcla_color"), true);
                $("#CmbBaseMezcla_color").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbPigmento_color"), true);

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica); 
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_color"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_color"), false);
                KdoComboBoxEnable($("#CmbPigmento_color"), false);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_color"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_color"), false);
                KdoComboBoxEnable($("#CmbPigmento_color"), false);
                break;
        }
      
        $("#TxtFormulaSug").val(setFor.SugerenciaFormula);
        KdoCmbSetValue($("#CmbTipoTinta_color"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistema_color"), setFor.IdSistemasTinta === undefined ? "" : setFor.IdSistemasTinta);
        KdoCmbSetValue($("#CmbPigmento_color"), setFor.IdSistemasTintaPigmento === undefined ? "" : setFor.IdSistemasTintaPigmento);
    } else {
        $("#TxtFormulaSug").val("");
        KdoCmbSetValue($("#CmbTipoTinta_color"), "");
        KdoCmbSetValue($("#CmbSistema_color"), "");
        KdoCmbSetValue($("#CmbPigmento_color"), "");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), false);

        switch (Te) {
            case "COLOR":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), true);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoCmbSetValue($("#CmbBaseMezcla_color"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_color"), true);
                $("#CmbBaseMezcla_color").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbPigmento_color"), true);

                break;
            case "TECNICA":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_color"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_color"), false);
                KdoComboBoxEnable($("#CmbPigmento_color"), false);
                break;
            case "BASE":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_color"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_color"), false);
                KdoComboBoxEnable($("#CmbPigmento_color"), false);
                break;
        }
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

    if (EstaTintasFormula.length >0) {
        $("#TxtIdform").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula);
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), true);
        
    } else {
        $("#TxtIdform").val(0);
        KdoButtonEnable($("#btnccc"), true );
        KdoButtonEnable($("#btnDelFT"), false);
        fn_MostraTablaFormula(null);
        $("#NumMasaEntre").val(0);
    }

};

let fn_MostraTablaFormula = function (ds) {
    let xformula = $("#TablaPorc");
    xformula.children().remove();
    $.each(ds, function (index, elemento) {

        xformula.append('<tr>' +
            '<td>' + elemento.IdArticulo + '</td>' +
            '<td>' + elemento.Nombre + '</td>' +
            '<td>' + elemento.MasaFinal + '</td>' +
            '<td>' + elemento.PorcentajeFinal * 100.00 + '</td>' +
            '</tr>');
    });
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
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec").data("IdRequerimientoTecnica") : Te === "COLOR" ? KdoCmbGetValue($("#CmbTecnica_color")) : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec").data("IdBase") : Te === "COLOR" ? KdoCmbGetValue($("#CmbBaseMezcla_color")) : null;

            fn_GuardarMarcoFormu(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
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
            FechaMod: xFecha,
            IdSistemasTintaPigmento: KdoCmbGetValue($("#CmbPigmento_color"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            //$("#MEstacionColor").data("kendoDialog").close();
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
            KdoButtonEnable($("#btnccc"), true);
            fn_GuardarEstaMarco(xIdBrazo);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

let fn_GuardarEstacionFormula = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let xType = "Post";
    xUrl = TSM_Web_APi + "TintasFormulaciones/InsTintasFormulacion_His";
    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdFormula: 0,
            IdSeteo: maq[0].IdSeteo,
            IdEstacion: xIdBrazo,
            CodigoColor: xCodigoColor
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#TxtIdform").val(data[0].IdFormula);
            EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, xIdBrazo);
            fn_MostraTablaFormula(EstaTintasFormula);
            $("#NumMasaEntre").val(EstaTintasFormula[0].MasaEntregada);
            KdoButtonEnable($("#btnccc"), false);
            KdoButtonEnable($("#btnDelFT"), true);
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

let fn_DelFormulaHis = function () {
    kendo.ui.progress($("#MEstacionColor"), true);
    let xType = "Delete";
    xUrl = TSM_Web_APi + "TintasFormulaciones/" + $("#TxtIdform").val();
    $.ajax({
        url: xUrl,
        type: xType,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#TxtIdform").val(0);
            $("#NumMasaEntre").val(0);
            KdoButtonEnable($("#btnccc"), true);
            KdoButtonEnable($("#btnDelFT"), false);
            fn_MostraTablaFormula(null);
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};
fn_PWList.push(fn_VistaEstacionColor);
fn_PWConfList.push(fn_VistaEstacionColorDocuReady);