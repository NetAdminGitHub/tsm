
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

    Kendo_CmbFiltrarGrid($("#CmbQuimica_Dis"), TSM_Web_APi + "Quimicas", "Nombre", "IdQuimica", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_Dis"), "[]", "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");
    $("#CmbTipoTinta_Dis").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(0));

    KdoComboBoxbyData($("#CmbSistemaPigmento_Dis"), "[]", "Nombre", "IdSistemaPigmento", "Seleccione un sitema pigmentos ....", "", "");
    $("#CmbSistemaPigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_Dis"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_Dis"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    KdoComboBoxbyData($("#CmdIdUnidadArea_Dis"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmdIdUnidadArea_Dis").data("kendoComboBox").setDataSource(fn_UnidadMedida(6));
    KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);

    let UrlRqTec = TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + maq[0].IdSeteo;
    Kendo_CmbFiltrarGrid($("#CmbTecnica_Dis"), UrlRqTec, "Nombre", "IdRequerimientoTecnica", "Seleccione una Tecnica ....");
    KdoComboBoxEnable($("#CmbTecnica_Dis"), false);

    KdoComboBoxbyData($("#CmbBasePigmento_Dis"), "[]", "Nombre", "IdBasePigmento", "Seleccione una Base de mezcla ....");
    $("#CmbBasePigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));

    var frmDiseno = $("#FrmGenEDiseno").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistemaPigmento_Dis']")) {
                    return $("#CmbSistemaPigmento_Dis").data("kendoComboBox").text() === "" ? true : $("#CmbSistemaPigmento_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vQui: function (input) {
                if (input.is("[id='CmbQuimica_Dis']")) {
                    return $("#CmbQuimica_Dis").data("kendoComboBox").selectedIndex >= 0;
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
                if (input.is("[id='CmbSedas_Dis']")) {
                    return $("#CmbSedas_Dis").data("kendoComboBox").selectedIndex >= 0;
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
                    return input.val().length <= 20;
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
                if (input.is("[id='CmbBasePigmento_Dis']")) {
                    return $("#CmbBasePigmento_Dis").data("kendoComboBox").text() === "" ? true : $("#CmbBasePigmento_Dis").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vPig: function (input) {
                if (input.is("[id='CmbSistemaPigmento_Dis']")) {
                    return $("#CmbSistemaPigmento_Dis").data("kendoComboBox").text() === "" ? true : $("#CmbSistemaPigmento_Dis").data("kendoComboBox").selectedIndex >= 0;
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
            vQui: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul: "Requerido",
            vidUa: "Requerido",
            vletra: "Longitud máxima del campo es 20",
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
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
        fn_FormulaHistorica("FormulaHist");
    });
    $("#btnDelFT_Dis").data("kendoButton").bind("click", function () {
        fn_DelFormulaHisDis();
    });

    $("#CmbTipoTinta_Dis").data("kendoComboBox").bind("change", function (e) {
        let TipoTin = this.value();

        //Si se vacía el control
        if (TipoTin === "") {
            KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), "");
            KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
            $("#CmbSistemaPigmento_Dis").data("kendoComboBox").setDataSource([]);
            $("#CmbBasePigmento_Dis").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);
            KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
        }
    });

    $("#CmbTipoTinta_Dis").data("kendoComboBox").bind("select", function (e) {
        KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), true);
        KdoComboBoxEnable($("#CmbBasePigmento_Dis"), true);
        let TipoTin = e.dataItem.IdTipoTinta;
        KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), "");
        $("#CmbSistemaPigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(TipoTin));

        KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
        $("#CmbBasePigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(TipoTin));

        // obtener el numero de pasadas por sistema de tintas
        if (TipoTin !== null) {
            let data = TipoTintas.find(q => q.IdTipoTinta === TipoTin);
            kdoNumericSetValue($("#NumPasadas_Dis"), data.NoPasadas);
        } else {
            kdoNumericSetValue($("#NumPasadas_Dis"), 1);
        }
    });

    $("#CmbQuimica_Dis").data("kendoComboBox").bind("change", function (e) {
        let idQ = this.value();

        //Si se vacía el control
        if (idQ === "") {
            KdoCmbSetValue($("#CmbTipoTinta_Dis"), "");
            $("#CmbTipoTinta_Dis").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbTipoTinta_Dis"), false);

            KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), "");
            KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
            $("#CmbSistemaPigmento_Dis").data("kendoComboBox").setDataSource([]);
            $("#CmbBasePigmento_Dis").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);
            KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
        }
    });

    $("#CmbQuimica_Dis").data("kendoComboBox").bind("select", function (e) {
        KdoComboBoxEnable($("#CmbTipoTinta_Dis"), true);
        let idQ = e.dataItem.IdQuimica;
        KdoCmbSetValue($("#CmbTipoTinta_Dis"), "");
        $("#CmbTipoTinta_Dis").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(idQ));
    });
};

var fn_VistaEstacionDiseno = function () {
    TextBoxEnable($("#TxtOpcSelec_Dis"), false);
    TextBoxEnable($("#TxtNombreQui_Dis"), false);
    TextBoxEnable($("#NumMasaEntre_Dis"), false);
    KdoNumerictextboxEnable($("#NumArea_Dis"), false);
    KdoComboBoxEnable($("#CmdIdUnidadArea_Dis"), false);
    $("#TxtOpcSelec_Dis").val($("#TxtOpcSelec_Dis").data("name")); //campo nombre del color, base o tecnica.
    idBra = $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""); //idBra: almacena el idestacion
    Te = $("#TxtOpcSelec_Dis").data("Formulacion"); //Te: guarda el tipo de formulación a configurar (Color,Tenica,Base)
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);//obtener informacion de la entidad SeteoMarcos Formulaciones por seteo y estación
    estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);
    EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, idBra);
    
    if (setFor !== null) {
        $("#NumResolucionDPI_Dis").data("kendoNumericTextBox").focus();
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                KdoCmbSetValue($("#CmbTecnica_Dis"), setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_Dis"), true);
                $("#CmbTecnica_Dis").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), true);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), true);

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);

                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);

                break;
        }

        $("#TxtFormulaSug_Dis").val(setFor.SugerenciaFormula);

        KdoCmbSetValue($("#CmbQuimica_Dis"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);

        $("#CmbTipoTinta_Dis").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        $("#CmbSistemaPigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        $("#CmbBasePigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));

        KdoCmbSetValue($("#CmbTipoTinta_Dis"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        KdoCmbSetValue($("#CmbBasePigmento_Dis"), setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento);
        
        KdoComboBoxEnable($("#CmbTipoTinta_Dis"), KdoCmbGetValue($("#CmbTipoTinta_Dis")) !== "");
        KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), KdoCmbGetValue($("#CmbSistemaPigmento_Dis")) !== "");
        KdoComboBoxEnable($("#CmbBasePigmento_Dis"), KdoCmbGetValue($("#CmbBasePigmento_Dis")) !== "");

        //$("#FrmGenEColor").data("kendoValidator").validate();
        Kendo_CmbFocus($("#CmbQuimica_Dis"));
    }
    else {
        KdoCmbFocus($("#CmbTipoTinta_Dis"));
        $("#TxtFormulaSug_Dis").val("");
        KdoButtonEnable($("#btnccc_Dis"), false);
        KdoButtonEnable($("#btnDelFT_Dis"), false);

        switch (Te) {
            case "COLOR":
                KdoComboBoxEnable($("#CmbTecnica_Dis"), true);
                $("#CmbTecnica_Dis").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), true);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), true);
                break;
            case "TECNICA":
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
                KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);
                break;
            case "BASE":
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
                KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);
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
        xNumPeso_Mues = estaMarco.Peso;
        xCmdIdUnidadPeso_Mues = estaMarco.IdUnidadPeso;
        xEstado = estaMarco.Estado;

    } else {
        xNumPeso_Mues = null;
        xCmdIdUnidadPeso_Mues = null;
        xEstado = null;
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

    //#region Calculo del area 
    $("#NumPixeles_Dis").data("kendoNumericTextBox").bind("change", function (e) {
        //calcular el are del diseño
        if (kdoNumericGetValue($("#NumResolucionDPI_Dis")) > 0) {
            kdoNumericSetValue($("#NumArea_Dis"), this.value() / (kdoNumericGetValue($("#NumResolucionDPI_Dis")) * kdoNumericGetValue($("#NumResolucionDPI_Dis"))));
            KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);
        } else {
            kdoNumericSetValue($("#NumArea_Dis"), 0);
            KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);
        }
    });
    $("#NumResolucionDPI_Dis").data("kendoNumericTextBox").bind("change", function (e) {
        //calcular el are del diseño
        if (this.value() > 0) {
            kdoNumericSetValue($("#NumArea_Dis"), kdoNumericGetValue($("#NumPixeles_Dis")) / (this.value() * this.value()));
            KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);
        } else {
            kdoNumericSetValue($("#NumArea_Dis"), 0);
            KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), 6);
        }
    });
    //#endregion

};
//// funciones
var fn_GuardarEstacionDiseno = function () {

    fn_GuardarEstacionDisArea(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec_Dis").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

var fn_GuardarEstaMarcoDis = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionDisenos"), true);
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
            Peso: xNumPeso_Mues,
            IdUnidadPeso: xCmdIdUnidadPeso_Mues,
            ResolucionDPI: kdoNumericGetValue($("#NumResolucionDPI_Dis")),
            LineajeLPI: kdoNumericGetValue($("#NumLineajeLPI_Dis")),
            Pixeles: kdoNumericGetValue($("#NumPixeles_Dis")),
            Estado: xEstado

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec_Dis").data("IdRequerimientoTecnica") : Te === "COLOR" ? KdoCmbGetValue($("#CmbTecnica_Dis")) : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec_Dis").data("IdBase") : null;
            fn_GuardarMarcoFormuDis(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_Dis").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormuDis = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) {
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
            IdSistemasTinta: null,
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemaPigmento: KdoCmbGetValue($("#CmbSistemaPigmento_Dis")),
            IdBasePigmento: KdoCmbGetValue($("#CmbBasePigmento_Dis")),
            IdTipoTinta: KdoCmbGetValue($("#CmbTipoTinta_Dis")),
            IdQuimica: KdoCmbGetValue($("#CmbQuimica_Dis"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            $("#MEstacionDisenos").data("kendoWindow").close();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionDisenos"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GuardarEstacionDisArea = function (xIdBrazo) {
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

var fn_GuardarEstacionFormulaDis = function (xIdBrazo, xCodigoColor) {
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
            EstacionBra = fn_Estaciones(maq[0].IdSeteo, xIdBrazo);
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

var fn_DelFormulaHisDis = function () {
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