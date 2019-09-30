var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;

var fn_VistaEstacionDisenoDocuReady = function () {
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

    let UrlST = TSM_Web_APi + "SistemasTintas";
    Kendo_CmbFiltrarGrid($("#CmbSistema_color_Mues"), UrlST, "Nombre", "IdSistemasTinta", "Seleccione un sitema tintas ....", "", "CmbTipoTinta_Mues");

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
            vArea: function (input) {

                if (input.is("[name='NumPeso_Mues']")) {
                    return $("#NumPeso_Mues").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vletra: function (input) {
                if (input.is("[name='TxtLetras']")) {
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
            fn_GuardarEstacionDiseno();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });
};

var fn_VistaEstacionDiseno = function () {
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
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Mues").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec_Mues").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Mues").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec_Mues").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                break;
        }

        $("#TxtFormulaSug_Mues").val(setFor.SugerenciaFormula);
        KdoCmbSetValue($("#CmbTipoTinta_Mues"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistema_color_Mues"), setFor.IdSistemasTinta === undefined ? "" : setFor.IdSistemasTinta);
    } else {
        $("#TxtFormulaSug_Mues").val("");
        KdoCmbSetValue($("#CmbTipoTinta_Mues"), "");
        KdoCmbSetValue($("#CmbSistema_color_Mues"), "");
    }


    if (estaMarco !== null) {
        $("#NumCapilar_Mues").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas_Mues").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumPeso_Mues").data("kendoNumericTextBox").value(estaMarco.Peso);
        $("#NumPeso_Mues").data("kendoNumericTextBox").value(estaMarco);
        KdoCmbSetValue($("#CmbSedas_Mues"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmdIdUnidadPeso_Mues"), estaMarco.IdUnidadPeso);
        KdoCmbSetValue($("#CmbTipoEmulsion_Mues"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra").val(estaMarco.Letra);
    } else {
        $("#NumCapilar_Mues").data("kendoNumericTextBox").value(0);
        $("#NumPasadas_Mues").data("kendoNumericTextBox").value(0);
        $("#NumPeso_Mues").data("kendoNumericTextBox").value(0);
        KdoCmbSetValue($("#CmdIdUnidadPeso_Mues"), 21);
        KdoCmbSetValue($("#CmbSedas_Mues"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_Mues"), "");
        $("#TxtLetra").val("");
    }





};
//// funciones
let fn_GuardarEstacionDiseno = function () {

    fn_GuardarEstacionDisArea(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec_Mues").val());
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
            Letra: $("#TxtLetra").val(),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_Mues")),
            IdSeteo: maq[0].IdSeteo,
            Area: maq[0].Area,
            Peso: kdoNumericGetValue($("#NumPeso_Mues")),
            IdUnidadArea: KdoCmbGetValue($("#CmdIdUnidadPeso_Mues"))

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GuardarMarcoFormuDis(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_Mues").data("IdRequerimientoColor") : null, Te === "TECNICA" ? $("#TxtOpcSelec_Mues").data("IdRequerimientoTecnica") : null, Te === "BASE" ? $("#TxtOpcSelec_Mues").data("IdBase") : null);
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
            SugerenciaFormula: $("#TxtFormulaSug_Mues").val(),
            IdSistemasTinta: KdoCmbGetValue($("#CmbSistema_color_Mues")),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            //$("#MEstacionDisenos").modal('hide');
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

fn_PWList.push(fn_VistaEstacionDiseno);
fn_PWConfList.push(fn_VistaEstacionDisenoDocuReady);