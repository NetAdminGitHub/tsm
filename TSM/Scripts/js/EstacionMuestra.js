
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
    $("#NumArea_Mues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumPeso_Mues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    Kendo_CmbFiltrarGrid($("#CmbQuimica_Mues"), TSM_Web_APi + "Quimicas", "Nombre", "IdQuimica", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_Mues"), "[]", "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");
    $("#CmbTipoTinta_Mues").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(0));

    let UrlST = TSM_Web_APi + "TiposTintasSistemasPigmentos/GetByTipoTinta/0";
    Kendo_CmbFiltrarGrid($("#CmbSistemaPigmentos_Mues"), UrlST, "Nombre", "IdSistemaPigmento", "Seleccione un sitema tintas ....", "", "");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_Mues"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_Mues"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    KdoComboBoxbyData($("#CmdIdUnidadArea_Mues"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmdIdUnidadArea_Mues").data("kendoComboBox").setDataSource(fn_UnidadMedida(6));
    KdoCmbSetValue($("#CmdIdUnidadArea_Mues"), 6);

    KdoComboBoxbyData($("#CmdIdUnidadPeso_Mues"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad de peso ....");
    $("#CmdIdUnidadPeso_Mues").data("kendoComboBox").setDataSource(fn_UnidadMedida("1,21"));

    var frmDiseno = $("#FrmGenEDiseno").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistemaPigmentos_Mues']")) {
                    return $("#CmbSistemaPigmentos_Mues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vQui: function (input) {
                if (input.is("[id='CmbQuimica_Mues']")) {
                    return $("#CmbQuimica_Mues").data("kendoComboBox").selectedIndex >= 0;
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
                if (input.is("[id='CmbSedas_Mues']")) {
                    return $("#CmbSedas_Mues").data("kendoComboBox").selectedIndex >= 0;
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
                    return input.val().length <= 20;
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
            vpeso: "Requerido",
            vQui: "Requerido",
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul: "Requerido",
            vidUa: "Requerido",
            vletra: "Longitud máxima del campo es 20",
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
};

var fn_VistaEstacionMuestra = function () {
    TextBoxEnable($("#NumMasaEntre_Mues"), false);
    TextBoxEnable($("#TxtOpcSelec_Mues"), false);
    KdoNumerictextboxEnable($("#NumArea_Mues"), false);
    KdoComboBoxEnable($("#CmdIdUnidadArea_Mues"), false);
    KdoComboBoxEnable($("#CmbQuimica_Mues"), false);
    $("#TxtFormulaSug_Mues").prop("readonly", true);
    KdoComboBoxEnable($("#CmbSistemaPigmentos_Mues"), false);
    KdoComboBoxEnable($("#CmbTipoTinta_Mues"), false);
    $("#TxtOpcSelec_Mues").val($("#TxtOpcSelec_Mues").data("name"));
    idBra = $("#TxtOpcSelec_Mues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    Te = $("#TxtOpcSelec_Mues").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);
    EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, idBra,"VIGENTE");

    if (setFor !== null) {
        $("#NumPeso_Mues").data("kendoNumericTextBox").focus();
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
        KdoCmbSetValue($("#CmbQuimica_Mues"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);

        $("#CmbTipoTinta_Mues").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        KdoCmbSetValue($("#CmbTipoTinta_Mues"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        $("#CmbSistemaPigmentos_Mues").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));        
        KdoCmbSetValue($("#CmbSistemaPigmentos_Mues"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        xCmbBasePigmentos_Mues = setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento;
        
        Kendo_CmbFocus($("#CmbQuimica_Mues"));
    } else {
        $("#TxtFormulaSug_Mues").val("");
        KdoCmbSetValue($("#CmbTipoTinta_Mues"), "");
        $("#CmbSistemaPigmentos_Mues").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(0));
        KdoCmbSetValue($("#CmbSistemaPigmentos_Mues"), "");
        xCmbBasePigmentos_Mues = null;
    }


    if (estaMarco !== null) {
        $("#NumCapilar_Mues").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas_Mues").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumPeso_Mues").data("kendoNumericTextBox").value(estaMarco.Peso);
        KdoCmbSetValue($("#CmbSedas_Mues"), estaMarco.IdSeda);        
        KdoCmbSetValue($("#CmdIdUnidadPeso_Mues"), estaMarco.IdUnidadPeso === null ? 21 : estaMarco.IdUnidadPeso);
        KdoCmbSetValue($("#CmbTipoEmulsion_Mues"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra_Mues").val(estaMarco.Letra);
        xAreaDis = estaMarco.Area;
        $("#NumArea_Mues").data("kendoNumericTextBox").value(estaMarco.Area);
        KdoCmbSetValue($("#CmdIdUnidadArea_Mues"), estaMarco.IdUnidadArea);
        xIdUnidadAreaDis = estaMarco.IdUnidadArea;
        xNumResolucionDPI_Dis = estaMarco.ResolucionDPI;
        xNumLineajeLPI_Dis = estaMarco.LineajeLPI;
        xNumPixeles_Dis = estaMarco.Pixeles;
        xEstado = estaMarco.Estado;
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
        xEstado = null;
    }


    if (EstaTintasFormula.length > 0) {
        $("#TxtIdform_Mues").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre_Mues").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula, "TablaFormulaMues");
    } else {
        $("#TxtIdform_Mues").val(0);
        fn_MostraTablaFormula(null, "TablaFormulaMues");
        $("#NumMasaEntre_Mues").val(0);
    }

};
//// funciones
var fn_GuardarEstacionMues = function () {

    GuardarEstacionDesaMues(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec_Mues").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

var fn_GuardarEstaMarcoMues = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionMuestra"), true);
    let xIdTipoFormulacion;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    xIdTipoFormulacion = Te;
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

    if (estaMarco === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/";
        xEstado = "SOLICITADO";
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
            Pixeles: xNumPixeles_Dis,
            Estado: xEstado

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec_Mues").data("IdRequerimientoTecnica") : Te === "COLOR" ? xCmbTecnica_Mues : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec_Mues").data("IdBase") : null;
            fn_GuardarMarcoFormuMues(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_Mues").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionMuestra"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormuMues = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) {
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
            IdSistemasTinta: null, 
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemaPigmento: KdoCmbGetValue($("#CmbSistemaPigmentos_Mues")),
            IdBasePigmento: xCmbBasePigmentos_Mues,
            IdTipoTinta: KdoCmbGetValue($("#CmbTipoTinta_Mues")),
            IdQuimica: KdoCmbGetValue($("#CmbQuimica_Mues"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            $("#MEstacionMuestra").data("kendoWindow").close();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionMuestra"), false);
            ErrorMsg(data);
        }
    });

};

var GuardarEstacionDesaMues = function (xIdBrazo) {
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

fn_PWList.push(fn_VistaEstacionMuestra);
fn_PWConfList.push(fn_VistaEstacionMuestraDocuReady);