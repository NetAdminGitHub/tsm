var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;
var EstaTintasFormula;

var fn_VistaEstacionDisenoDocuReady = function () {
    KdoButton($("#btnccc_Dis"), "search", "Buscar en formula historicas..");
    KdoButtonEnable($("#btnccc_Dis"), false);
    KdoButton($("#btnDelFT_Dis"), "delete", "Borrar formula..");
    KdoButtonEnable($("#btnDelFT_Dis"), false);

    KdoButton($("#btnAddMCE_Dis"), "check", "Agregar");
    $("#NumPasadas_Dis").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumCapilar_Dis").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });
    $("#NumArea_Dis").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumResolucionDPI_Dis").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumLineajeLPI_Dis").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumPixeles_Dis").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#TxtNombreQui_Dis").val(NombreQui);
    let UrlTT = TSM_Web_APi + "TiposTintas/GetbyIdQuimica/" + xIdQuimica.toString();
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_Dis"), UrlTT, "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");

    let UrlST = TSM_Web_APi + "SistemasTintas/GetbyTipoTintas/0";
    Kendo_CmbFiltrarGrid($("#CmbSistema_Dis"), UrlST, "Nombre", "IdSistemasTinta", "Seleccione un sitema tintas ....", "", "");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_Dis"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_Dis"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    KdoComboBoxbyData($("#CmdIdUnidadArea_Dis"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmdIdUnidadArea_Dis").data("kendoComboBox").setDataSource(fn_UnidadMedida(6));
    KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);

    let UrlRqTec = TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/GetRequerimientoDesarrollosColoresTecnicaByIdRequerimiento/" + $("#txtIdRequerimiento").val();
    Kendo_CmbFiltrarGrid($("#CmbTecnica_Dis"), UrlRqTec, "Nombre", "IdRequerimientoTecnica", "Seleccione una Tecnica ....");
    KdoComboBoxEnable($("#CmbTecnica_Dis"), false);

    let Urlpig = TSM_Web_APi + "SistemasTintas";
    Kendo_CmbFiltrarGrid($("#CmbPigmento_Dis"), Urlpig, "Nombre", "IdSistemasTinta", "Seleccione un Pigmento ....", "", "");

    let UrlBMezcla = TSM_Web_APi + "BasesMuestras";
    Kendo_CmbFiltrarGrid($("#CmbBaseMezcla_Dis"), UrlBMezcla, "Nombre", "IdBase", "Seleccione un Base Mezcla ....", "", "");

    let frmDiseno = $("#FrmGenEDiseno").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistema_Dis']")) {
                    return $("#CmbSistema_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTT: function (input) {
                if (input.is("[id='CmbTipoTinta_Dis']")) {
                    return $("#CmbTipoTinta_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTSed: function (input) {
                if (input.is("[id='CmbTipoTinta_Dis']")) {
                    return $("#CmbTipoTinta_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTemul: function (input) {
                if (input.is("[id='CmbTipoEmulsion_Dis']")) {
                    return $("#CmbTipoEmulsion_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vidUa: function (input) {
                if (input.is("[id='CmdIdUnidadArea_Dis']")) {
                    return $("#CmdIdUnidadArea_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vArea: function (input) {

                if (input.is("[name='NumArea_Dis']")) {
                    return $("#NumArea_Dis").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vletra: function (input) {
                if (input.is("[name='TxtLetra']")) {
                    return input.val().length <= 5;
                }
                return true;
            },
            vsuge: function (input) {
                if (input.is("[name='TxtFormulaSug_Dis']")) {
                    return input.val().length <= 200;
                }
                return true;
            },
            vtecapli: function (input) {
                if (input.is("[id='CmbTecnica_Dis']")) {
                    return $("#CmbTecnica_Dis").data("kendoComboBox").text() === "" ? true : $("#CmbTecnica_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vbmez: function (input) {
                if (input.is("[id='CmbBaseMezcla_Dis']")) {
                    return $("#CmbBaseMezcla_Dis").data("kendoComboBox").text() === "" ? true : $("#CmbBaseMezcla_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vPig: function (input) {
                if (input.is("[id='CmbPigmento_Dis']")) {
                    return $("#CmbPigmento_Dis").data("kendoComboBox").text() === "" ? true : $("#CmbPigmento_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vres: function (input) {

                if (input.is("[name='NumResolucionDPI_Dis']")) {
                    return $("#NumResolucionDPI_Dis").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vlin: function (input) {

                if (input.is("[name='NumLineajeLPI_Dis']")) {
                    return $("#NumLineajeLPI_Dis").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vpix: function (input) {

                if (input.is("[name='NumPixeles_Dis']")) {
                    return $("#NumPixeles_Dis").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            }
        },
        messages: {
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul: "Requerido",
            vidUa: "Requerido",
            vletra: "Longitud máxima del campo es 5",
            vsuge: "Longitud máxima del campo es 200",
            vtecapli: "Requerido",
            vbmez: "Requerido",
            vPig: "Requerido",
            vArea: "requerido",
            vres: "requerido",
            vlin: "requerido",
            vpix:"requerido"

        }
    }).data("kendoValidator");

    $("#btnAddMCE_Dis").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmDiseno.validate()) {
            fn_GuardarEstacionDiseno();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    $("#btnccc_Dis").data("kendoButton").bind("click", function () {
        fn_FormulaHistorica("FormulaHistDis");
    });
    $("#btnDelFT_Dis").data("kendoButton").bind("click", function () {
        fn_DelFormulaHis();
    });

    $("#FormulaHistDis").on("ObtenerFormula", function (event, CodigoColor) {
        fn_GuardarEstacionFormulaDis(idBra, CodigoColor);
    });

    $("#CmbTipoTinta_Dis").data("kendoComboBox").bind("change", function () {
        let TipoTin = KdoCmbGetValue($("#CmbTipoTinta_Dis"));
        KdoCmbSetValue($("#CmbSistema_Dis"), "");
        $("#CmbSistema_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaTintas(TipoTin));
    });

    $("#CmbSistema_Dis").data("kendoComboBox").bind("change", function () {
        // obtener el numero de pasadas por sistema de tintas
        if (KdoCmbGetValue($("#CmbSistema_Dis")) !== null) {
            let data = SisTintas.find(q => q.IdSistemasTinta === Number(KdoCmbGetValue($("#CmbSistema_Dis"))));
            kdoNumericSetValue($("#NumPasadas_Dis"), data.NoPasadas);
        } else {
            kdoNumericSetValue($("#NumPasadas_Dis"), 1);
        }
    });

};

var fn_VistaEstacionDiseno = function () {
    Kendo_CmbFocus($("#CmbTipoTinta_Dis"));
    TextBoxEnable($("#TxtOpcSelec_Dis"), false);
    TextBoxEnable($("#TxtNombreQui_Dis"), false);
    TextBoxEnable($("#NumMasaEntre_Dis"), false);
    $("#TxtOpcSelec_Dis").val($("#TxtOpcSelec_Dis").data("name"));
    idBra = $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    Te = $("#TxtOpcSelec_Dis").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);
    EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, idBra);

    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                KdoCmbSetValue($("#CmbTecnica_Dis"), setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_Dis"), true);
                $("#CmbTecnica_Dis").data("kendoComboBox").dataSource.read();
                KdoCmbSetValue($("#CmbBaseMezcla_Dis"), setFor.IdBase === undefined ? "" : setFor.IdBase);
                KdoComboBoxEnable($("#CmbBaseMezcla_Dis"), true);
                $("#CmbBaseMezcla_Dis").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbPigmento_Dis"), true);

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_Dis"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_Dis"), false);
                KdoComboBoxEnable($("#CmbPigmento_Dis"), false);

                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_Dis"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_Dis"), false);
                KdoComboBoxEnable($("#CmbPigmento_Dis"), false);

                break;
        }

        $("#TxtFormulaSug_Dis").val(setFor.SugerenciaFormula);
        KdoCmbSetValue($("#CmbTipoTinta_Dis"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        $("#CmbSistema_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaTintas(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        KdoCmbSetValue($("#CmbSistema_Dis"), setFor.IdSistemasTinta === undefined ? "" : setFor.IdSistemasTinta);
        KdoCmbSetValue($("#CmbPigmento_Dis"), setFor.IdSistemasTintaPigmento === undefined ? "" : setFor.IdSistemasTintaPigmento);
    } else {
        $("#TxtFormulaSug_Dis").val("");
        KdoCmbSetValue($("#CmbTipoTinta_Dis"), "");
        $("#CmbSistema_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaTintas(0));
        KdoCmbSetValue($("#CmbSistema_Dis"), "");
        KdoCmbSetValue($("#CmbPigmento_Dis"), "");
        KdoButtonEnable($("#btnccc_Dis"), false);
        KdoButtonEnable($("#btnDelFT_Dis"), false);

        switch (Te) {
            case "COLOR":
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), true);
                $("#CmbTecnica_Dis").data("kendoComboBox").dataSource.read();
                KdoCmbSetValue($("#CmbBaseMezcla_Dis"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_Dis"), true);
                $("#CmbBaseMezcla_Dis").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbPigmento_Dis"), true);

                break;
            case "TECNICA":
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_Dis"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_Dis"), false);
                KdoComboBoxEnable($("#CmbPigmento_Dis"), false);

                break;
            case "BASE":
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBaseMezcla_Dis"), "");
                KdoComboBoxEnable($("#CmbBaseMezcla_Dis"), false);
                KdoComboBoxEnable($("#CmbPigmento_Dis"), false);

                break;
        }
    }


    if (estaMarco !== null) {
        $("#NumCapilar_Dis").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas_Dis").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumArea_Dis").data("kendoNumericTextBox").value(estaMarco.Area);
        KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), estaMarco.IdUnidadArea);
        KdoCmbSetValue($("#CmbSedas_Dis"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmbTipoEmulsion_Dis"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra").val(estaMarco.Letra);
        kdoNumericSetValue($("#NumResolucionDPI_Dis"), estaMarco.ResolucionDPI);
        kdoNumericSetValue($("#NumLineajeLPI_Dis"), estaMarco.LineajeLPI);
        kdoNumericSetValue($("#NumPixeles_Dis"), estaMarco.Pixeles);
    } else {
        $("#NumCapilar_Dis").data("kendoNumericTextBox").value(0);
        $("#NumPasadas_Dis").data("kendoNumericTextBox").value(0);
        $("#NumArea_Dis").data("kendoNumericTextBox").value(0);
        kdoNumericSetValue($("#NumResolucionDPI_Dis"), 0);
        kdoNumericSetValue($("#NumLineajeLPI_Dis"), 0);
        kdoNumericSetValue($("#NumPixeles_Dis"), 0);
        KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);
        KdoCmbSetValue($("#CmbSedas_Dis"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_Dis"), "");
        $("#TxtLetra").val("");
    }
    
    if (EstaTintasFormula.length > 0) {
        $("#TxtIdform_Dis").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre_Dis").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula,"TablaFormulaDis");
        KdoButtonEnable($("#btnccc_Dis"), false);
        KdoButtonEnable($("#btnDelFT_Dis"), true);
    } else {
        $("#TxtIdform_Dis").val(0);
        KdoButtonEnable($("#btnccc_Dis"), true);
        KdoButtonEnable($("#btnDelFT_Dis"), false);
        fn_MostraTablaFormula(null,"TablaFormulaDis");
        $("#NumMasaEntre_Dis").val(0);
    }
};
//// funciones
let fn_GuardarEstacionDiseno = function () {

    fn_GuardarEstacionDisArea(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec_Dis").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

let fn_GuardarEstaMarcoDis = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionDisenos"), true);
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
            Capilar: $("#NumCapilar_Dis").val(),
            IdEstacion: xIdBrazo,
            IdTipoFormulacion: xIdTipoFormulacion,
            IdSeda: KdoCmbGetValue($("#CmbSedas_Dis")),
            NoPasadas: $("#NumPasadas_Dis").val(),
            Dureza: null,
            Angulo: null,
            Velocidad: null,
            Presion: null,
            Tension: null,
            OffContact: null,
            Letra: $("#TxtLetra").val(),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_Dis")),
            IdSeteo: maq[0].IdSeteo,
            Area: kdoNumericGetValue($("#NumArea_Dis")),
            IdUnidadArea: KdoCmbGetValue($("#CmdIdUnidadArea_Dis")),
            ResolucionDPI: kdoNumericGetValue($("#NumResolucionDPI_Dis")),
            LineajeLPI: kdoNumericGetValue($("#NumLineajeLPI_Dis")),
            Pixeles: kdoNumericGetValue($("#NumPixeles_Dis"))

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec_Dis").data("IdRequerimientoTecnica") : Te === "COLOR" ? KdoCmbGetValue($("#CmbTecnica_Dis")) : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec_Dis").data("IdBase") : Te === "COLOR" ? KdoCmbGetValue($("#CmbBaseMezcla_Dis")) : null;

            fn_GuardarMarcoFormuDis(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_Dis").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
            ErrorMsg(data);
        }
    });

};

let fn_GuardarMarcoFormuDis = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) {
    kendo.ui.progress($("#MEstacionDisenos"), true);
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
            SugerenciaFormula: $("#TxtFormulaSug_Dis").val(),
            IdSistemasTinta: KdoCmbGetValue($("#CmbSistema_Dis")),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemasTintaPigmento: KdoCmbGetValue($("#CmbPigmento_Dis"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            $("#MEstacionDisenos").data("kendoDialog").close();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
            ErrorMsg(data);
        }
    });
};

let fn_GuardarEstacionDisArea = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionDisenos"), true);
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
            KdoButtonEnable($("#btnccc_Dis"), true);
            fn_GuardarEstaMarcoDis(xIdBrazo);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
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

let fn_GuardarEstacionFormulaDis = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($("#MEstacionDisenos"), true);
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
            $("#TxtIdform_Dis").val(data[0].IdFormula);
            EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, xIdBrazo);
            fn_MostraTablaFormula(EstaTintasFormula,"TablaFormulaDis");
            $("#NumMasaEntre_Dis").val(EstaTintasFormula[0].MasaEntregada);
            KdoButtonEnable($("#btnccc_Dis"), false);
            KdoButtonEnable($("#btnDelFT_Dis"), true);
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionDisenos"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
            ErrorMsg(data);
        }
    });

};

let fn_DelFormulaHis = function () {
    kendo.ui.progress($("#MEstacionDisenos"), true);
    let xType = "Delete";
    xUrl = TSM_Web_APi + "TintasFormulaciones/" + $("#TxtIdform_Dis").val();
    $.ajax({
        url: xUrl,
        type: xType,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#TxtIdform_Dis").val(0);
            $("#NumMasaEntre_Dis").val(0);
            KdoButtonEnable($("#btnccc_Dis"), true);
            KdoButtonEnable($("#btnDelFT_Dis"), false);
            fn_MostraTablaFormula(null,"TablaFormulaDis");
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionDisenos"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
            ErrorMsg(data);
        }
    });

};

fn_PWList.push(fn_VistaEstacionDiseno);
fn_PWConfList.push(fn_VistaEstacionDisenoDocuReady);