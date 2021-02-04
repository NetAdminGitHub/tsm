
var fn_VEVerifMuestraDocuReady = function () {
    KdoButton($("#btnAddMCE_VerifMues"), "check", "Agregar");

    $("#EscurridorDureza_VerifMues").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumPasadas_VerifMues").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#NumCapilar_VerifMues").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50
    });
    $("#NumArea_VerifMues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumPeso_VerifMues").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    Kendo_CmbFiltrarGrid($("#CmbIdTipoEstacion_VerifMues"), TSM_Web_APi + "TipoEstaciones/GetTipoEstacionesSinAccesorios", "Nombre", "IdTipoEstacion", "Seleccione ...");
    KdoComboBoxEnable($("#CmbIdTipoEstacion_VerifMues"), false);

    Kendo_CmbFiltrarGrid($("#CmbQuimica_VerifMues"), TSM_Web_APi + "Quimicas", "Nombre", "IdQuimica", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_VerifMues"), "[]", "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");
    $("#CmbTipoTinta_VerifMues").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(0));

    let UrlST = TSM_Web_APi + "TiposTintasSistemasPigmentos/GetByTipoTinta/0";
    Kendo_CmbFiltrarGrid($("#CmbSistemaPigmentos_VerifMues"), UrlST, "Nombre", "IdSistemaPigmento", "Seleccione un sitema tintas ....", "", "");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_VerifMues"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_VerifMues"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    KdoComboBoxbyData($("#CmdIdUnidadArea_VerifMues"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmdIdUnidadArea_VerifMues").data("kendoComboBox").setDataSource(fn_UnidadMedida(6));
    KdoCmbSetValue($("#CmdIdUnidadArea_VerifMues"), 6);

    KdoComboBoxbyData($("#CmdIdUnidadPeso_VerifMues"), "[]", "Abreviatura", "IdUnidad", "Seleccione una unidad de peso ....");
    $("#CmdIdUnidadPeso_VerifMues").data("kendoComboBox").setDataSource(fn_UnidadMedida("1,21"));

    var frmVerifDiseno = $("#FrmGenEVerifDiseno").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistemaPigmentos_VerifMues']")) {
                    return $("#CmbSistemaPigmentos_VerifMues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vQui: function (input) {
                if (input.is("[id='CmbQuimica_VerifMues']")) {
                    return $("#CmbQuimica_VerifMues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTT: function (input) {
                if (input.is("[id='CmbTipoTinta_VerifMues']")) {
                    return $("#CmbTipoTinta_VerifMues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTSed: function (input) {
                if (input.is("[id='CmbSedas_VerifMues']")) {
                    return $("#CmbSedas_VerifMues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTemul: function (input) {
                if (input.is("[id='CmbTipoEmulsion_VerifMues']")) {
                    return $("#CmbTipoEmulsion_VerifMues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vidUa: function (input) {
                if (input.is("[id='CmdIdUnidadPeso_VerifMues']")) {
                    return $("#CmdIdUnidadPeso_VerifMues").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vpeso: function (input) {

                if (input.is("[name='NumPeso_VerifMues']")) {
                    return $("#NumPeso_VerifMues").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vletra: function (input) {
                if (input.is("[name='TxtLetra_VerifMues']")) {
                    return input.val().length <= 20;
                }
                return true;
            },
            vsuge: function (input) {
                if (input.is("[name='TxtFormulaSug_VerifMues']")) {
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

    $("#CmbIdTipoEstacion_VerifMues").data("kendoComboBox").bind("select", function (e) {
        fn_DeshabilitarCamposMarco_VM(e.dataItem.UtilizaMarco);
    });

    $("#btnAddMCE_VerifMues").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmVerifDiseno.validate()) {
            fn_GuardarEstacionVerifMues();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    fn_GridEstacionesDiseno_VerifMues($("#gridEstacion_VerifMues"));
};

var fn_VEVerifMuestra = function () {

    InicioModalMU = 1;
    TextBoxEnable($("#NumMasaEntre_VerifMues"), false);
    TextBoxEnable($("#TxtOpcSelec_VerifMues"), false);
    KdoNumerictextboxEnable($("#NumArea_VerifMues"), false);
    KdoComboBoxEnable($("#CmdIdUnidadArea_VerifMues"), false);
    KdoComboBoxEnable($("#CmbQuimica_VerifMues"), false);
    $("#TxtFormulaSug_VerifMues").prop("readonly", true);
    TextBoxReadOnly($("#ArticuloSugerido_VerifMues"), false);
    KdoComboBoxEnable($("#CmbSistemaPigmentos_VerifMues"), false);
    KdoComboBoxEnable($("#CmbTipoTinta_VerifMues"), false);
    $("#TxtOpcSelec_VerifMues").val($("#TxtOpcSelec_VerifMues").data("name"));
    //idBra = $("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    //Te = $("#TxtOpcSelec_VerifMues").data("Formulacion");
    //setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    //estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, $("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""));
    xIdSeteoMq = EstacionBra === null ? 0 : maq[0].IdSeteo;

    var grid = $("#gridEstacion_VerifMues").data("kendoGrid");
    grid.dataSource.data([]);
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
    grid.dataSource.read().then(function () {
        var items = grid.items();
        items.each(function (idx, row) {
            var dataItem = grid.dataItem(row);
            if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
                grid.select(row);
            }
        });
    });
    //$.ajax({
    //    url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo + "/" + $("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""),
    //    type: 'GET',
    //    success: function (datos) {
    //        if (datos !== null) {
    //            $("#SeccionMue_1").removeAttr("hidden");
    //            $("#SeccionMue_2").removeClass('col-lg-12');
    //            $("#SeccionMue_2").addClass('col-lg-9');
    //            $("#MEstacionVerifMuestra").data("kendoWindow").center();
    //            grid.dataSource.read().then(function () {
    //                var items = grid.items();
    //                items.each(function (idx, row) {
    //                    var dataItem = grid.dataItem(row);
    //                    if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
    //                        grid.select(row);
    //                    }
    //                });
    //            });

    //        } else {
    //            $("#SeccionMue_1").attr("hidden", true);
    //            $("#SeccionDis_2").removeClass('col-lg-9');
    //            $("#SeccionDis_2").addClass('col-lg-12');
    //            $("#MEstacionVerifMuestra").data("kendoWindow").center();
    //            fn_Consultar_VerifMues(grid);
    //        }
    //    },
    //    complete: function () {
    //        kendo.ui.progress($(document.body), false);
    //    }
    //});
    //EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, idBra,"VIGENTE");

};
//// funciones

var fn_Consultar_VerifMues = function (g) {

    var SelItem = g.dataItem(g.select());
    //xidEstacion = SelItem === null ? 0 : SelItem.IdEstacion;
    idBra = SelItem === null ? $("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion === null ? $("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion;
    Te = SelItem === null ? $("#TxtOpcSelec_VerifMues").data("Formulacion") : SelItem.IdTipoFormulacion === null ? $("#TxtOpcSelec_VerifMues").data("Formulacion") : SelItem.IdTipoFormulacion;
    KdoCmbSetValue($("#CmbIdTipoEstacion_VerifMues"), "MARCO");
    fn_DeshabilitarCamposMarco_VM(true);
    setFor = null;
    estaMarco = null;
    EstaTintasFormula = null;

    if ((InicioModalMU === 1 && Number(idBra) === Number($("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) || InicioModalMU === 0) {
        fn_GetMarcoFormulacion_VerifMues(maq[0].IdSeteo, idBra);
        fn_EstacionesMarcos_VerifMues(maq[0].IdSeteo, idBra);
        fn_EstacionesTintasFormulaDet_VerifMues(maq[0].IdSeteo, idBra);
        $("#MEstacionVerifMuestra").data("kendoWindow").title("CONFIGURACIÓN ESTACIÓN #" + idBra);
        InicioModalMU = 0;
    }
};

var fn_GetMarcoFormulacion_VerifMues = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionMarcosFormulacion_VerifMues(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionVerifMuestra"), false);
        }
    });
};

var fn_SeccionMarcosFormulacion_VerifMues = function (datos) {
    setFor = datos;
    if (setFor !== null) {
        $("#NumPeso_VerifMues").data("kendoNumericTextBox").focus();
        switch (setFor.IdTipoFormulacion) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_VerifMues").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec_VerifMues").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                xCmbTecnica_VerifMues = setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica;
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido_VerifMues"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                xCmbBaseMezcla_VerifMues = setFor.IdBase === undefined ? "" : setFor.IdBase;
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_VerifMues").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec_VerifMues").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                xCmbTecnica_VerifMues = setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica;
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido_VerifMues"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                xCmbBaseMezcla_VerifMues = null;
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_VerifMues").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec_VerifMues").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                xCmbTecnica_VerifMues = null;
                $("#ArticuloSugerido_VerifMues").val("");
                xCmbBaseMezcla_VerifMues = null;
                break;
        }

        $("#TxtFormulaSug_VerifMues").val(setFor.SugerenciaFormula);

        KdoCmbSetValue($("#CmbIdTipoEstacion_VerifMues"), setFor.IdTipoEstacion === undefined ? "" : setFor.IdTipoEstacion);
        $("#CmbIdTipoEstacion_VerifMues").data("kendoComboBox").trigger("change");
        fn_DeshabilitarCamposMarco_VM($("#CmbIdTipoEstacion_VerifMues").data("kendoComboBox").dataItem().UtilizaMarco);

        KdoCmbSetValue($("#CmbQuimica_VerifMues"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);

        $("#CmbTipoTinta_VerifMues").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        KdoCmbSetValue($("#CmbTipoTinta_VerifMues"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        $("#CmbSistemaPigmentos_VerifMues").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        KdoCmbSetValue($("#CmbSistemaPigmentos_VerifMues"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        xCmbBasePigmentos_VerifMues = setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento;

        Kendo_CmbFocus($("#CmbQuimica_VerifMues"));
    } else {
        $("#TxtFormulaSug_VerifMues").val("");
        KdoCmbSetValue($("#CmbTipoTinta_VerifMues"), "");
        $("#CmbSistemaPigmentos_VerifMues").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(0));
        KdoCmbSetValue($("#CmbSistemaPigmentos_VerifMues"), "");
        xCmbBasePigmentos_VerifMues = null;
    }

};


var fn_EstacionesMarcos_VerifMues = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionEstacionMarcos_VerifMues(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionVerifMuestra"), false);
        }
    });
};

var fn_SeccionEstacionMarcos_VerifMues = function (datos) {
    estaMarco = datos;
    if (estaMarco !== null) {
        $("#NumCapilar_VerifMues").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#EscurridorDureza_VerifMues").data("kendoNumericTextBox").value(estaMarco.Dureza);
        $("#NumPasadas_VerifMues").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumPeso_VerifMues").data("kendoNumericTextBox").value(estaMarco.Peso);
        KdoCmbSetValue($("#CmbSedas_VerifMues"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmdIdUnidadPeso_VerifMues"), estaMarco.IdUnidadPeso === null ? 21 : estaMarco.IdUnidadPeso);
        KdoCmbSetValue($("#CmbTipoEmulsion_VerifMues"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra_VerifMues").val(estaMarco.Letra);
        xAreaDis = estaMarco.Area;
        $("#NumArea_VerifMues").data("kendoNumericTextBox").value(estaMarco.Area);
        KdoCmbSetValue($("#CmdIdUnidadArea_VerifMues"), estaMarco.IdUnidadArea);
        xIdUnidadAreaDis = estaMarco.IdUnidadArea;
        xNumResolucionDPI_Dis = estaMarco.ResolucionDPI;
        xNumLineajeLPI_Dis = estaMarco.LineajeLPI;
        xNumPixeles_Dis = estaMarco.Pixeles;
        xEstado = estaMarco.Estado;
    } else {
        $("#NumCapilar_VerifMues").data("kendoNumericTextBox").value(0);
        $("#EscurridorDureza_VerifMues").data("kendoNumericTextBox").value(0);
        $("#NumPasadas_VerifMues").data("kendoNumericTextBox").value(0);
        $("#NumPeso_VerifMues").data("kendoNumericTextBox").value(0);
        KdoCmbSetValue($("#CmdIdUnidadPeso_VerifMues"), 21);
        KdoCmbSetValue($("#CmbSedas_VerifMues"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_VerifMues"), "");
        $("#TxtLetra_VerifMues").val("");
        xAreaDis = 0;
        xIdUnidadAreaDis = 0;
        xNumResolucionDPI_Dis = 0;
        xNumLineajeLPI_Dis = 0;
        xNumPixeles_Dis = 0;
        xEstado = null;
    }


};

var fn_EstacionesTintasFormulaDet_VerifMues = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
    $.ajax({
        url: TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            var filtro = [];
            var data = JSON.parse(JSON.stringify(datos), function (key, value) {
                if (value !== null) {
                    if (value.Estado === "VIGENTE") filtro.push(value);

                }
                return value;
            });
            fn_SeccionTitasFormulas_VerifMues(filtro);

        },
        complete: function () {
            kendo.ui.progress($("#MEstacionVerifMuestra"), false);
        }
    });
};

var fn_SeccionTitasFormulas_VerifMues = function (datos) {
    EstaTintasFormula = datos;

    if (EstaTintasFormula.length > 0) {
        $("#TxtIdform_VerifMues").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre_VerifMues").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula, "TablaFormulaVerifMues");
    } else {
        $("#TxtIdform_VerifMues").val(0);
        fn_MostraTablaFormula(null, "TablaFormulaVerifMues");
        $("#NumMasaEntre_VerifMues").val(0);
    }
};

var fn_GuardarEstacionVerifMues = function () {

    GuardarEstacionDesaVerifMues(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec_VerifMues").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

var GuardarEstaMarcoVerifMues = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
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
            Capilar: $("#NumCapilar_VerifMues").val(),
            IdEstacion: xIdBrazo,
            IdTipoFormulacion: xIdTipoFormulacion,
            IdSeda: KdoCmbGetValue($("#CmbSedas_VerifMues")),
            NoPasadas: $("#NumPasadas_VerifMues").val(),
            Dureza: $("#EscurridorDureza_VerifMues").val(),
            Angulo: null,
            Velocidad: null,
            Presion: null,
            Tension: null,
            OffContact: null,
            Letra: $("#TxtLetra_VerifMues").val(),
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_VerifMues")),
            IdSeteo: maq[0].IdSeteo,
            Area: xAreaDis,
            IdUnidadArea: xIdUnidadAreaDis,
            Peso: kdoNumericGetValue($("#NumPeso_VerifMues")),
            IdUnidadPeso: KdoCmbGetValue($("#CmdIdUnidadPeso_VerifMues")),
            ResolucionDPI: xNumResolucionDPI_Dis,
            LineajeLPI: xNumLineajeLPI_Dis,
            Pixeles: xNumPixeles_Dis,
            Estado: xEstado

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec_VerifMues").data("IdRequerimientoTecnica") : Te === "COLOR" ? xCmbTecnica_VerifMues : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec_VerifMues").data("IdBase") : null;
            fn_GuardarMarcoFormuVerifMues(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_VerifMues").data("IdRequerimientoColor") : null, vIdtec, vIdBase);

            if (xType === "Put") {
                let ge = $("#gridEstacion_VerifMues").data("kendoGrid");
                var uid = ge.dataSource.get(data[0].IdEstacion).uid;
                Fn_UpdGridEstacion_VerifMues(ge.dataItem("tr[data-uid='" + uid + "']"), data[0]);
            }
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionVerifMuestra"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormuVerifMues = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) {
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
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
            SugerenciaFormula: $("#TxtFormulaSug_VerifMues").val(),
            IdSistemasTinta: null,
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemaPigmento: KdoCmbGetValue($("#CmbSistemaPigmentos_VerifMues")),
            IdBasePigmento: xCmbBasePigmentos_VerifMues,
            IdTipoTinta: KdoCmbGetValue($("#CmbTipoTinta_VerifMues")),
            IdQuimica: KdoCmbGetValue($("#CmbQuimica_VerifMues"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            //$("#MEstacionVerifMuestra").data("kendoWindow").close();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionVerifMuestra"), false);
            ErrorMsg(data);
        }
    });

};

var GuardarEstacionDesaVerifMues = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
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
            IdTipoEstacion: KdoCmbGetValue($("#CmbIdTipoEstacion_VerifMues")),
            IdAccesorio: null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            GuardarEstaMarcoVerifMues(xIdBrazo);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionVerifMuestra"), false);
            ErrorMsg(data);
        }
    });

};

fn_PWList.push(fn_VEVerifMuestra);
fn_PWConfList.push(fn_VEVerifMuestraDocuReady);

var fn_GridEstacionesDiseno_VerifMues = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteo/" + xIdSeteoMq; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdEstacion",
                fields: {
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    },
                    Peso: { type: "number" },
                    Comentario: {
                        type: "string"
                    },
                    CodigoPantone: {
                        type: "string"
                    },
                    IgualarColor: {
                        type: "string"
                    }
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }

            var grid = gd.data("kendoGrid");
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.Comentario !== '') {
                    $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#e8e855");
                } else {
                    $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                }
            });
        },
        columns: [
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50, footerTemplate: "Totales" },
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            { field: "Peso", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n2", 2], format: "{0:n2}", footerTemplate: "#: data.Peso ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "CodigoPantone", title: "Pantone", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "IgualarColor", title: "Igualar a:", minResizableWidth: 120 },
            { field: "Comentario", title: "Comentario de Ajuste", minResizableWidth: 120 }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 550);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
        fn_Consultar_VerifMues(gd.data("kendoGrid"));

    });
};

let Fn_UpdGridEstacion_VerifMues = function (g, data) {
    g.set("Peso", data.Peso);
    LimpiaMarcaCelda_VerifMues();
};
let LimpiaMarcaCelda_VerifMues = function () {
    $(".k-dirty-cell", $("#gridEstacion_VerifMues")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridEstacion_VerifMues")).remove();
};

let fn_DeshabilitarCamposMarco_VM = function (utilizaMarco) {
    let habilitarMarco = utilizaMarco;

    KdoComboBoxEnable($("#CmbSedas_VerifMues"), habilitarMarco);
    KdoComboBoxEnable($("#CmbTipoEmulsion_VerifMues"), habilitarMarco);
    KdoNumerictextboxEnable($("#NumCapilar_VerifMues"), habilitarMarco);
    KdoNumerictextboxEnable($("#NumPasadas_VerifMues"), habilitarMarco);
    KdoNumerictextboxEnable($("#EscurridorDureza_VerifMues"), habilitarMarco);

    if (!habilitarMarco) {
        KdoCmbSetValue($("#CmbSedas_VerifMues"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_VerifMues"), "");
        kdoNumericSetValue($("#NumCapilar_VerifMues"), 0);
        kdoNumericSetValue($("#NumPasadas_VerifMues"), 0);
        kdoNumericSetValue($("#EscurridorDureza_VerifMues"), 0);
    }
};