

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

    let UrlST = TSM_Web_APi + "TiposTintasSistemasPigmentos/GetByTipoTinta/0";
    Kendo_CmbFiltrarGrid($("#CmbSistemaPigmento_Color"), UrlST, "Nombre", "IdSistemaPigmento", "Seleccione un sitema pigmentos ....", "", "");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_color"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_color"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    let UrlRqTec = TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + maq[0].IdSeteo;
    Kendo_CmbFiltrarGrid($("#CmbTecnica_color"), UrlRqTec, "Nombre", "IdRequerimientoTecnica", "Seleccione una Tecnica ....");
    KdoComboBoxEnable($("#CmbTecnica_color"), false);

    //let UrlBMezcla = TSM_Web_APi + "TiposTintasBasesPigmentos/GetByTipoTinta/0";
    //Kendo_CmbFiltrarGrid($("#CmbBasePigmento_color"), UrlBMezcla, "Nombre", "IdBasePigmento", "Seleccione un Base Mezcla ....", "", "");
    KdoComboBoxbyData($("#CmbBasePigmento_color"), "[]", "Nombre", "IdBasePigmento", "Seleccione una Base de mezcla ....");
    $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));

    var frmColor = $("#FrmGenEColor").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistemaPigmento_Color']")) {
                  return $("#CmbSistemaPigmento_Color").data("kendoComboBox").text() === "" ? true : $("#CmbSistemaPigmento_Color").data("kendoComboBox").selectedIndex >= 0;
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
                if (input.is("[id='CmbBasePigmento_color']")) {
                    return $("#CmbBasePigmento_color").data("kendoComboBox").text() === "" ? true : $("#CmbBasePigmento_color").data("kendoComboBox").selectedIndex >= 0;
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
            vbmez: "Requerido"
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
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
        fn_FormulaHistorica("FormulaHist");
    });
    $("#btnDelFT").data("kendoButton").bind("click", function () {
        fn_DelFormulaHis();
    });

    $("#CmbTipoTinta_color").data("kendoComboBox").bind("change", function () {
        let TipoTin = KdoCmbGetValue($("#CmbTipoTinta_color"));
        KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
        $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(TipoTin));

        KdoCmbSetValue($("#CmbBasePigmento_color"), "");
        $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(TipoTin));

        // obtener el numero de pasadas por sistema de tintas
        if (KdoCmbGetValue($("#CmbTipoTinta_color")) !== null) {
            let data = TipoTintas.find(q => q.IdTipoTinta === Number(KdoCmbGetValue($("#CmbTipoTinta_color"))));
            kdoNumericSetValue($("#NumPasadas"), data.NoPasadas);
        } else {
            kdoNumericSetValue($("#NumPasadas"), 1);
        }
    });
};


var fn_VistaEstacionColor = function () {

    Kendo_CmbFocus($("#CmbTipoTinta_color"));
    TextBoxEnable($("#TxtOpcSelec"), false);
    TextBoxEnable($("#TxtNombreQui"), false);
    TextBoxEnable($("#NumMasaEntre"), false);
    $("#CmbTipoTinta_color").data("kendoComboBox").select(null);
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
                KdoComboBoxEnable($("#CmbBasePigmento_color"), true);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), true);

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica); 
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
        }
      
        $("#TxtFormulaSug").val(setFor.SugerenciaFormula);
        KdoCmbSetValue($("#CmbTipoTinta_color"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        KdoCmbSetValue($("#CmbSistemaPigmento_Color"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);

        $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        KdoCmbSetValue($("#CmbBasePigmento_color"), setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento);
   
    } else {
        $("#TxtFormulaSug").val("");
        KdoCmbSetValue($("#CmbTipoTinta_color"), "");
        $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(0));
        $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));
        KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
        KdoCmbSetValue($("#CmbBasePigmento_color"), "");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), false);

        switch (Te) {
            case "COLOR":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), true);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), true);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), true);

                break;
            case "TECNICA":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
            case "BASE":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
        }
    }


    if (estaMarco !== null) {
        $("#NumCapilar").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#NumPasadas").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        KdoCmbSetValue($("#CmbSedas_color"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), estaMarco.IdTipoEmulsion);
        xTxtLetra = estaMarco.Letra;
        xNumPeso_Mues = estaMarco.Peso;
        xCmdIdUnidadPeso_Mues = estaMarco.IdUnidadPeso;
        xAreaDis = estaMarco.Area;
        xIdUnidadAreaDis = estaMarco.IdUnidadArea;
        xNumResolucionDPI_Dis = estaMarco.ResolucionDPI;
        xNumLineajeLPI_Dis = estaMarco.LineajeLPI;
        xNumPixeles_Dis = estaMarco.Pixeles;
        xEstado = estaMarco.Estado;

    } else {
        $("#NumCapilar").data("kendoNumericTextBox").value(0);
        $("#NumPasadas").data("kendoNumericTextBox").value(0);
        KdoCmbSetValue($("#CmbSedas_color"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), "");
        xNumPeso_Mues =null;
        xCmdIdUnidadPeso_Mues = null;
        xAreaDis = null;
        xIdUnidadAreaDis =null;
        xNumResolucionDPI_Dis = null;
        xNumLineajeLPI_Dis =null;
        xNumPixeles_Dis = null;
        xTxtLetra = null;
        xEstado = null;
    }

    if (EstaTintasFormula.length >0) {
        $("#TxtIdform").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula,"TablaFormula");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), true);
        
    } else {
        $("#TxtIdform").val(0);
        KdoButtonEnable($("#btnccc"), true );
        KdoButtonEnable($("#btnDelFT"), false);
        fn_MostraTablaFormula(null,"TablaFormula");
        $("#NumMasaEntre").val(0);
    }

};

//// funciones
var fn_GuardarEstacionColor = function () {

    fn_GuardarEstacion(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
     //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

var fn_GuardarEstaMarco = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionColor"), true);
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
            Letra: xTxtLetra,
            IdUsuarioMod:getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_color")),
            IdSeteo: maq[0].IdSeteo,
            Area: xAreaDis,
            IdUnidadArea: xIdUnidadAreaDis,
            Peso: xNumPeso_Mues,
            IdUnidadPeso: xCmdIdUnidadPeso_Mues,
            ResolucionDPI: xNumResolucionDPI_Dis,
            LineajeLPI: xNumLineajeLPI_Dis,
            Pixeles: xNumPixeles_Dis,
            Estado: xEstado

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec").data("IdRequerimientoTecnica") : Te === "COLOR" ? KdoCmbGetValue($("#CmbTecnica_color")) : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec").data("IdBase") : null;

            fn_GuardarMarcoFormu(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormu = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase ) {
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
            IdSistemasTinta:null,
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemaPigmento: KdoCmbGetValue($("#CmbSistemaPigmento_Color")),
            IdBasePigmento: KdoCmbGetValue($("#CmbBasePigmento_color")),
            IdTipoTinta: KdoCmbGetValue($("#CmbTipoTinta_color"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            $("#MEstacionColor").data("kendoDialog").close();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarEstacion = function (xIdBrazo) {
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

var fn_GuardarEstacionFormula = function (xIdBrazo, xCodigoColor) {
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
            EstacionBra = fn_Estaciones(maq[0].IdSeteo, xIdBrazo);
            EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, xIdBrazo);
            fn_MostraTablaFormula(EstaTintasFormula,"TablaFormula");
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

var fn_DelFormulaHis = function () {
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
            fn_MostraTablaFormula(null,"TablaFormula");
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