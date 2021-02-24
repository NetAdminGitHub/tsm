var xResolucion = 0;
var xLineaje = 0;

var fn_VistaEstacionDisenoDocuReady = function () {
    KdoButton($("#btnccc_Dis"), "search", "Buscar en formula historicas..");
    KdoButtonEnable($("#btnccc_Dis"), false);
    KdoButton($("#btnDelFT_Dis"), "delete", "Borrar formula..");
    KdoButtonEnable($("#btnDelFT_Dis"), false);

    KdoButton($("#btnAddMCE_Dis"), "check", "Agregar");

    $("#EscurridorDureza_Dis").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

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

    Kendo_CmbFiltrarGrid($("#CmbIdTipoEstacion_Dis"), TSM_Web_APi + "TipoEstaciones/GetTipoEstacionesSinAccesorios", "Nombre", "IdTipoEstacion", "Seleccione ...");    

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

    $("#CmbIdTipoEstacion_Dis").data("kendoComboBox").bind("select", function (e) {
        fn_DeshabilitarCamposMarco_Dis(e.dataItem.UtilizaMarco);
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
        KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), vhb );
        KdoComboBoxEnable($("#CmbBasePigmento_Dis"), vhb );
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

    $("#CmbTecnica_Dis").data("kendoComboBox").bind("change", function (e) {
        if (this.value() === "") {
            $("#ArticuloSugerido_Dis").val("");
        }
    });

    $("#CmbTecnica_Dis").data("kendoComboBox").bind("select", function (e) {
        fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Dis"), maq[0].IdSeteo, e.dataItem.IdRequerimientoTecnica);
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
        KdoComboBoxEnable($("#CmbTipoTinta_Dis"), vhb);
        let idQ = e.dataItem.IdQuimica;
        KdoCmbSetValue($("#CmbTipoTinta_Dis"), "");
        $("#CmbTipoTinta_Dis").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(idQ));
    });

    fn_GridEstacionesDiseno_Dis($("#gridEstacionMq_Dis"));
};

var fn_VistaEstacionDiseno = function () {
    InicioModalAD = 1;
    TextBoxEnable($("#TxtOpcSelec_Dis"), false);
    TextBoxEnable($("#TxtNombreQui_Dis"), false);
    TextBoxEnable($("#NumMasaEntre_Dis"), false);
    TextBoxReadOnly($("#ArticuloSugerido_Dis"), false);
    KdoNumerictextboxEnable($("#NumArea_Dis"), false);
    KdoComboBoxEnable($("#CmdIdUnidadArea_Dis"), false);
    $("#TxtOpcSelec_Dis").val($("#TxtOpcSelec_Dis").data("name")); //campo nombre del color, base o tecnica.
    //idBra = $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""); //idBra: almacena el idestacion
    //Te = $("#TxtOpcSelec_Dis").data("Formulacion"); //Te: guarda el tipo de formulación a configurar (Color,Tenica,Base)
  /*  setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra)*///obtener informacion de la entidad SeteoMarcos Formulaciones por seteo y estación
   /* estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra)*/

    $("#ArticuloSugerido_Dis").val("");
    if ($("#TxtOpcSelec_Dis").data().Formulacion === "TECNICA")
        fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Dis"), maq[0].IdSeteo, $("#TxtOpcSelec_Dis").data().IdRequerimientoTecnica);

    EstacionBra = fn_Estaciones(maq[0].IdSeteo, $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""));
    xIdSeteoMq = EstacionBra === null ? 0 : maq[0].IdSeteo;
    var grid = $("#gridEstacionMq_Dis").data("kendoGrid");
    grid.dataSource.data([]);
    kendo.ui.progress($("#MEstacionDisenos"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo + "/" + $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""),
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#SeccionDis_1").removeAttr("hidden");
                $("#SeccionDis_2").removeClass('col-lg-12');
                $("#SeccionDis_2").addClass('col-lg-9');
                $("#MEstacionDisenos").data("kendoWindow").center();
                grid.dataSource.read().then(function () {
                    var items = grid.items();
                    items.each(function (idx, row) {
                        var dataItem = grid.dataItem(row);
                        if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
                            grid.select(row);
                        }
                    });
                });

            } else {
                $("#SeccionDis_1").attr("hidden", true);
                $("#SeccionDis_2").removeClass('col-lg-9');
                $("#SeccionDis_2").addClass('col-lg-12');
                $("#MEstacionDisenos").data("kendoWindow").center();
                fn_Consultar_Dis(grid);
            }
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

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
var fn_Consultar_Dis = function (g) {

    var SelItem = g.dataItem(g.select());
    //xidEstacion = SelItem === null ? 0 : SelItem.IdEstacion;
    idBra = SelItem === null ? $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion === null ? $("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion;
    Te = SelItem === null ? $("#TxtOpcSelec_Dis").data("Formulacion") : SelItem.IdTipoFormulacion === null ? $("#TxtOpcSelec_Dis").data("Formulacion") : SelItem.IdTipoFormulacion;
    KdoCmbSetValue($("#CmbIdTipoEstacion_Dis"), "MARCO");
    fn_DeshabilitarCamposMarco_Dis(true);
    setFor = null;
    estaMarco = null;
    EstaTintasFormula = null;

    if ((InicioModalAD === 1 && Number(idBra) === Number($("#TxtOpcSelec_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) || InicioModalAD === 0) {
        fn_GetMarcoFormulacion_Dis(maq[0].IdSeteo, idBra);
        fn_EstacionesMarcos_Dis(maq[0].IdSeteo, idBra);
        fn_EstacionesTintasFormulaDet_Dis(maq[0].IdSeteo, idBra);
        $("#MEstacionDisenos").data("kendoWindow").title("CONFIGURACIÓN ESTACIÓN #" + idBra);

        InicioModalAD = 0;
    }
};
var fn_GetMarcoFormulacion_Dis = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionDisenos"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_fn_SeccionMarcosFormulacion_Dis(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionDisenos"), false);
        }
    });
};

var fn_fn_SeccionMarcosFormulacion_Dis = function (datos) {
    setFor = datos;
    if (setFor !== null) {
        $("#NumResolucionDPI_Dis").data("kendoNumericTextBox").focus();
        switch (setFor.IdTipoFormulacion) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                KdoCmbSetValue($("#CmbTecnica_Dis"), setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoTecnica);
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Dis"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_Dis"), vhb);
                $("#CmbTecnica_Dis").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), vhb );
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), vhb );

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Dis").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec_Dis").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                KdoCmbSetValue($("#CmbTecnica_Dis"), "");
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Dis"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
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
                $("#ArticuloSugerido_Dis").val("");
                KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Dis"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);

                break;
        }

        $("#TxtFormulaSug_Dis").val(setFor.SugerenciaFormula);

        KdoCmbSetValue($("#CmbIdTipoEstacion_Dis"), setFor.IdTipoEstacion === undefined ? "" : setFor.IdTipoEstacion);
        $("#CmbIdTipoEstacion_Dis").data("kendoComboBox").trigger("change");
        fn_DeshabilitarCamposMarco_Dis($("#CmbIdTipoEstacion_Dis").data("kendoComboBox").dataItem() ? 1 : $("#CmbIdTipoEstacion_Dis").data("kendoComboBox").dataItem().UtilizaMarco);

        KdoCmbSetValue($("#CmbQuimica_Dis"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);

        $("#CmbTipoTinta_Dis").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        $("#CmbSistemaPigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        $("#CmbBasePigmento_Dis").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));

        KdoCmbSetValue($("#CmbTipoTinta_Dis"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistemaPigmento_Dis"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        KdoCmbSetValue($("#CmbBasePigmento_Dis"), setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento);

        KdoComboBoxEnable($("#CmbTipoTinta_Dis"), vhb !== false ? KdoCmbGetValue($("#CmbTipoTinta_Dis")) !== "" : false);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), vhb !== false ? KdoCmbGetValue($("#CmbSistemaPigmento_Dis")) !== "" : false);
        KdoComboBoxEnable($("#CmbBasePigmento_Dis"), vhb !== false ? KdoCmbGetValue($("#CmbBasePigmento_Dis")) !== "": false);

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
                KdoComboBoxEnable($("#CmbTecnica_Dis"), vhb);
                $("#CmbTecnica_Dis").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_Dis"), vhb );
                KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), vhb);
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

};


var fn_EstacionesMarcos_Dis = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionDisenos"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionEstacionMarcos_Dis(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionDisenos"), false);
        }
    });
};

var fn_SeccionEstacionMarcos_Dis = function (datos) {
    estaMarco = datos;

    if (estaMarco !== null) {
        $("#NumCapilar_Dis").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#EscurridorDureza_Dis").data("kendoNumericTextBox").value(estaMarco.Dureza);
        $("#NumPasadas_Dis").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumArea_Dis").data("kendoNumericTextBox").value(estaMarco.Area);
        KdoCmbSetValue($("#CmdIdUnidadArea_Dis"), estaMarco.IdUnidadArea);
        KdoCmbSetValue($("#CmbSedas_Dis"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmbTipoEmulsion_Dis"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra").val(estaMarco.Letra);
        kdoNumericSetValue($("#NumResolucionDPI_Dis"), estaMarco.ResolucionDPI === null ? xResolucion : estaMarco.ResolucionDPI);
        kdoNumericSetValue($("#NumLineajeLPI_Dis"), estaMarco.LineajeLPI === null ? xLineaje : estaMarco.LineajeLPI);
        kdoNumericSetValue($("#NumPixeles_Dis"), estaMarco.Pixeles);
        xNumPeso_Mues = estaMarco.Peso;
        xCmdIdUnidadPeso_Mues = estaMarco.IdUnidadPeso;
        xEstado = estaMarco.Estado;

    } else {
        xNumPeso_Mues = null;
        xCmdIdUnidadPeso_Mues = null;
        xEstado = null;
    }
};

var fn_EstacionesTintasFormulaDet_Dis = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionDisenos"), true);
    $.ajax({
        url: TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            var filtro = [];
            var data = JSON.parse(JSON.stringify(datos), function (key, value) {
                if (value !== null) {
                    if (value.Estado === "CREADA") filtro.push(value);

                }
                return value;
            });
            if (filtro.length === 0) {
                JSON.parse(JSON.stringify(datos), function (key, value) {
                    if (value !== null) {
                        if (value.Estado === "VIGENTE") filtro.push(value);

                    }
                    return value;
                });
            }
            fn_SeccionTitasFormulas_Dis(filtro);

        },
        complete: function () {
            kendo.ui.progress($("#MEstacionDisenos"), false);
        }
    });
};

var fn_SeccionTitasFormulas_Dis = function (datos) {

    EstaTintasFormula = datos;

    if (EstaTintasFormula.length > 0) {
        $("#TxtIdform_Dis").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre_Dis").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula, "TablaFormulaDis");
        if (EstaTintasFormula[0].IdFormula !== null && EstaTintasFormula[0].IdFormula > 0) {
            KdoButtonEnable($("#btnccc_Dis"), false);
            KdoButtonEnable($("#btnDelFT_Dis"), true);
        }
    } else {
        $("#TxtIdform_Dis").val(0);
        KdoButtonEnable($("#btnccc_Dis"), true);
        KdoButtonEnable($("#btnDelFT_Dis"), false);
        fn_MostraTablaFormula(null, "TablaFormulaDis");
        $("#NumMasaEntre_Dis").val(0);
    }

};

var fn_GuardarEstacionDiseno = function () {

    fn_GuardarEstacionDisArea(idBra);
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
            Dureza: $("#EscurridorDureza_Dis").val(),
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
            if (xType === "Put") {
                let ge = $("#gridEstacionMq_Dis").data("kendoGrid");
                var uid = ge.dataSource.get(data[0].IdEstacion).uid;
                Fn_UpdGridEstacion_Dis(ge.dataItem("tr[data-uid='" + uid + "']"), data[0]);
            }
            xResolucion = kdoNumericGetValue($("#NumResolucionDPI_Dis"));
            xLineaje = kdoNumericGetValue($("#NumLineajeLPI_Dis"));
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
            if ($("#gridEstacionMq_Dis").data("kendoGrid").dataSource.total() === 0) {
                fn_MostraTablaFormula(null, "TablaFormulaDis");
                $("#MEstacionDisenos").data("kendoWindow").close();
            }
            $("#maquinaDiseno").data("maquinaSerigrafia").cargarDataMaquina(maq); 
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
            IdTipoEstacion: KdoCmbGetValue($("#CmbIdTipoEstacion_Dis")),
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
            fn_EstacionesTintasFormulaDet_Dis(maq[0].IdSeteo, xIdBrazo);
            //fn_MostraTablaFormula(EstaTintasFormula,"TablaFormulaDis");
            //$("#NumMasaEntre_Dis").val(EstaTintasFormula[0].MasaEntregada);
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

let fn_DeshabilitarCamposMarco_Dis = function (utilizaMarco) {
    let habilitarMarco = utilizaMarco;

    KdoComboBoxEnable($("#CmbSedas_Dis"), vhb !== false ? habilitarMarco : false);
    KdoComboBoxEnable($("#CmbTipoEmulsion_Dis"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#NumCapilar_Dis"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#NumPasadas_Dis"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#EscurridorDureza_Dis"), vhb !== false ? habilitarMarco : false);

    if (!habilitarMarco) {
        KdoCmbSetValue($("#CmbSedas_Dis"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_Dis"), "");
        kdoNumericSetValue($("#NumCapilar_Dis"), 0);
        kdoNumericSetValue($("#NumPasadas_Dis"), 0);
        kdoNumericSetValue($("#EscurridorDureza_Dis"), 0);
    }

    if (vhb === false) {
        KdoComboBoxEnable($("#CmbIdTipoEstacion_Dis"), false);
        TextBoxEnable($("#TxtLetra"), false);
        KdoButtonEnable($("#btnAddMCE_Dis"), false);
        KdoComboBoxEnable($("#CmbQuimica_Dis"), false);
        KdoComboBoxEnable($("#CmbTipoTinta_Dis"), false);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), false);
        KdoComboBoxEnable($("#CmbBasePigmento_Dis"), false);
        KdoNumerictextboxEnable($("#NumResolucionDPI_Dis"), false);
        KdoNumerictextboxEnable($("#NumPixeles_Dis"), false);
        KdoNumerictextboxEnable($("#NumLineajeLPI_Dis"), false);
        TextBoxEnable($("#TxtFormulaSug_Dis"), false);
        KdoComboBoxEnable($("#CmbTecnica_Dis"), false);
    } else {
        KdoComboBoxEnable($("#CmbIdTipoEstacion_Dis"), true);
        TextBoxEnable($("#TxtLetra"), true);
        KdoButtonEnable($("#btnAddMCE_Dis"), true);
        KdoComboBoxEnable($("#CmbQuimica_Dis"), true);
        KdoComboBoxEnable($("#CmbTipoTinta_Dis"), true);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Dis"), true);
        KdoComboBoxEnable($("#CmbBasePigmento_Dis"), true);
        KdoNumerictextboxEnable($("#NumResolucionDPI_Dis"), true);
        KdoNumerictextboxEnable($("#NumPixeles_Dis"), true);
        KdoNumerictextboxEnable($("#NumLineajeLPI_Dis"), true);
        TextBoxEnable($("#TxtFormulaSug_Dis"), true);
        KdoComboBoxEnable($("#CmbTecnica_Dis"), true);
    }
};

fn_PWList.push(fn_VistaEstacionDiseno);
fn_PWConfList.push(fn_VistaEstacionDisenoDocuReady);


var fn_GridEstacionesDiseno_Dis = function (gd) {

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
                    Letra: {
                        type: "string"

                    },
                    NombreColorEstacion: {
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
        },
        columns: [
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50 },
            { field: "IdSeteo", title: "Cod. Seteo", minResizableWidth: 50, hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            { field: "Letra", title: "Letra", minResizableWidth: 100 },
            { field: "CodigoPantone", title: "Pantone", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "IgualarColor", title: "Igualar a:", minResizableWidth: 120 }
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
        fn_Consultar_Dis(gd.data("kendoGrid"));

    });
};

let Fn_UpdGridEstacion_Dis = function (g, data) {
    g.set("Letra", data.Letra);
    LimpiaMarcaCelda_Dis();
};

let  LimpiaMarcaCelda_Dis= function() {
    $(".k-dirty-cell", $("#gridEstacionMq_Dis")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridEstacionMq_Dis")).remove();
};