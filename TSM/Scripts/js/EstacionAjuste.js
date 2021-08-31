var xResolucion = 0;
var xLineaje = 0;

var fn_VistaEstacion_AjusteDocuReady = function () {
    //boton nuevo ajuste de tintas
    KdoButton($("#btnAddMFAjusteTintas"), "gear", "Ajuste");
    //boto obtner una formula Historica
    KdoButton($("#btnAddMFAHistori_Ajuste"), "search", "Formulas Historica");
    //boton retenciones
    KdoButton($("#btnAutRet_Ajuste"), "warning", "Retenciones");



    KdoButton($("#btnAddMCE_Ajuste"), "check", "Agregar");

    $("#EscurridorDureza_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumPasadas_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumCapilar_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });
    $("#NumArea_Ajuste").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumResolucionDPI_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumLineajeLPI_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumPixeles_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    Kendo_CmbFiltrarGrid($("#CmbIdTipoEstacion_Ajuste"), TSM_Web_APi + "TipoEstaciones/GetTipoEstacionesSinAccesorios", "Nombre", "IdTipoEstacion", "Seleccione ...");

    Kendo_CmbFiltrarGrid($("#CmbQuimica_Ajuste"), TSM_Web_APi + "Quimicas", "Nombre", "IdQuimica", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_Ajuste"), "[]", "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");
    $("#CmbTipoTinta_Ajuste").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(0));

    KdoComboBoxbyData($("#CmbSistemaPigmento_Ajuste"), "[]", "Nombre", "IdSistemaPigmento", "Seleccione un sitema pigmentos ....", "", "");
    $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_Ajuste"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_Ajuste"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    KdoComboBoxbyData($("#CmdIdUnidadArea_Ajuste"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmdIdUnidadArea_Ajuste").data("kendoComboBox").setDataSource(fn_UnidadMedida(6));
    KdoCmbSetValue($("#CmdIdUnidadArea_Ajuste"), 6);

    let UrlRqTec = TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + maq[0].IdSeteo;
    Kendo_CmbFiltrarGrid($("#CmbTecnica_Ajuste"), UrlRqTec, "Nombre", "IdRequerimientoTecnica", "Seleccione una Tecnica ....");
    KdoComboBoxEnable($("#CmbTecnica_Ajuste"), false);

    KdoComboBoxbyData($("#CmbBasePigmento_Ajuste"), "[]", "Nombre", "IdBasePigmento", "Seleccione una Base de mezcla ....");
    $("#CmbBasePigmento_Ajuste").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));

    var frmAjuste_Estacion = $("#FrmGenAjusteEst").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistemaPigmento_Ajuste']")) {
                    return $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").text() === "" ? true : $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vQui: function (input) {
                if (input.is("[id='CmbQuimica_Ajuste']")) {
                    return $("#CmbQuimica_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTT: function (input) {
                if (input.is("[id='CmbTipoTinta_Ajuste']")) {
                    return $("#CmbTipoTinta_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTSed: function (input) {
                if (input.is("[id='CmbSedas_Ajuste']")) {
                    return $("#CmbSedas_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTemul: function (input) {
                if (input.is("[id='CmbTipoEmulsion_Ajuste']")) {
                    return $("#CmbTipoEmulsion_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vidUa: function (input) {
                if (input.is("[id='CmdIdUnidadArea_Ajuste']")) {
                    return $("#CmdIdUnidadArea_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vArea: function (input) {

                if (input.is("[name='NumArea_Ajuste']")) {
                    return $("#NumArea_Ajuste").data("kendoNumericTextBox").value() > 0;
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
                if (input.is("[name='TxtFormulaSug_Ajuste']")) {
                    return input.val().length <= 200;
                }
                return true;
            },
            vtecapli: function (input) {
                if (input.is("[id='CmbTecnica_Ajuste']")) {
                    return $("#CmbTecnica_Ajuste").data("kendoComboBox").text() === "" ? true : $("#CmbTecnica_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vbmez: function (input) {
                if (input.is("[id='CmbBasePigmento_Ajuste']")) {
                    return $("#CmbBasePigmento_Ajuste").data("kendoComboBox").text() === "" ? true : $("#CmbBasePigmento_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vPig: function (input) {
                if (input.is("[id='CmbSistemaPigmento_Ajuste']")) {
                    return $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").text() === "" ? true : $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vres: function (input) {

                if (input.is("[name='NumResolucionDPI_Ajuste']")) {
                    return $("#NumResolucionDPI_Ajuste").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vlin: function (input) {

                if (input.is("[name='NumLineajeLPI_Ajuste']")) {
                    return $("#NumLineajeLPI_Ajuste").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            vpix: function (input) {

                if (input.is("[name='NumPixeles_Ajuste']")) {
                    return $("#NumPixeles_Ajuste").data("kendoNumericTextBox").value() > 0;
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
            vpix: "requerido"

        }
    }).data("kendoValidator");

    $("#btnAddMCE_Ajuste").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmAjuste_Estacion.validate()) {
            fn_GuardarEstacion_Ajuste();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    $("#CmbIdTipoEstacion_Ajuste").data("kendoComboBox").bind("select", function (e) {
        fn_DeshabilitarCamposMarco_Ajuste(e.dataItem.UtilizaMarco);
    });

    $("#CmbTipoTinta_Ajuste").data("kendoComboBox").bind("change", function (e) {
        let TipoTin = this.value();

        //Si se vacía el control
        if (TipoTin === "") {
            KdoCmbSetValue($("#CmbSistemaPigmento_Ajuste"), "");
            KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
            $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").setDataSource([]);
            $("#CmbBasePigmento_Ajuste").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);
            KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
        }
    });

    $("#CmbTipoTinta_Ajuste").data("kendoComboBox").bind("select", function (e) {
        KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), vhb);
        KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), vhb);
        let TipoTin = e.dataItem.IdTipoTinta;
        KdoCmbSetValue($("#CmbSistemaPigmento_Ajuste"), "");
        $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(TipoTin));

        KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
        $("#CmbBasePigmento_Ajuste").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(TipoTin));

        // obtener el numero de pasadas por sistema de tintas
        if (TipoTin !== null) {
            let data = TipoTintas.find(q => q.IdTipoTinta === TipoTin);
            kdoNumericSetValue($("#NumPasadas_Ajuste"), data.NoPasadas);
        } else {
            kdoNumericSetValue($("#NumPasadas_Ajuste"), 1);
        }
    });

    $("#CmbTecnica_Ajuste").data("kendoComboBox").bind("change", function (e) {
        if (this.value() === "") {
            $("#ArticuloSugerido_Ajuste").val("");
        }
    });

    $("#CmbTecnica_Ajuste").data("kendoComboBox").bind("select", function (e) {
        fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Ajuste"), maq[0].IdSeteo, e.dataItem.IdRequerimientoTecnica);
    });

    $("#CmbQuimica_Ajuste").data("kendoComboBox").bind("change", function (e) {
        let idQ = this.value();

        //Si se vacía el control
        if (idQ === "") {
            KdoCmbSetValue($("#CmbTipoTinta_Ajuste"), "");
            $("#CmbTipoTinta_Ajuste").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbTipoTinta_Ajuste"), false);

            KdoCmbSetValue($("#CmbSistemaPigmento_Ajuste"), "");
            KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
            $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").setDataSource([]);
            $("#CmbBasePigmento_Ajuste").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);
            KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
        }
    });

    $("#CmbQuimica_Ajuste").data("kendoComboBox").bind("select", function (e) {
        KdoComboBoxEnable($("#CmbTipoTinta_Ajuste"), vhb);
        let idQ = e.dataItem.IdQuimica;
        KdoCmbSetValue($("#CmbTipoTinta_Ajuste"), "");
        $("#CmbTipoTinta_Ajuste").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(idQ));
    });

    fn_GridEstacionesDiseno_Ajuste($("#gridEstacionMq_Ajuste"));

    xidEstacion = 0;
    fn_gridFormulasAjuste($("#gridFormulasAjuste"));
    fn_gridAjustePrimaAjuste($("#gridFormulasMPAjuste"));
    fn_GridDetAjuste();
    $("#tsFormulasAjuste").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip").select(0);

    //llamar modal crear nueva formula
    $("#btnAddMFAjusteTintas").bind("click", function () {
        fn_CrearNuevoAjusteFormulas("vCrearNuevoAjuste", maq[0].IdSeteo, xidEstacion, function () { return fn_SetfocoFilaAjustada(); });
    });

    //llamar modal formula historica
    $("#btnAddMFAHistori_Ajuste").data("kendoButton").bind("click", function () {
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
        //ir a ElementoTrabajos.js y configurar la etapa para obtener la formula Metodos : "ObtenerFormula" y "SetValorBusqueda"
        fn_FormulaHistorica("FormulaHist");
    });
    //llamar modal de retenciones
    $("#btnAutRet_Ajuste").bind("click", function () {
        //validar si existen mas retenciones
        fn_CalcularRetencion(maq[0].IDOrdenTrabajo, 2, 1, false, function () { fn_AutorizarRetenciones("RetAut_Ajuste", maq[0].IDOrdenTrabajo, maq[0].IdEtapaProceso, maq[0].Item); });
        //AutRet: es el nombre del div en la vista elementoTrabajo

    });

    //#region Calculo del area 
    $("#NumPixeles_Ajuste").data("kendoNumericTextBox").bind("change", function (e) {
        //calcular el are del diseño
        if (kdoNumericGetValue($("#NumResolucionDPI_Ajuste")) > 0) {
            kdoNumericSetValue($("#NumArea_Ajuste"), this.value() / (kdoNumericGetValue($("#NumResolucionDPI_Ajuste")) * kdoNumericGetValue($("#NumResolucionDPI_Ajuste"))));
            KdoCmbSetValue($("#CmdIdUnidadArea_Ajuste"), 6);
        } else {
            kdoNumericSetValue($("#NumArea_Ajuste"), 0);
            KdoCmbSetValue($("#CmdIdUnidadArea_Ajuste"), 6);
        }
    });
    $("#NumResolucionDPI_Ajuste").data("kendoNumericTextBox").bind("change", function (e) {
        //calcular el are del diseño
        if (this.value() > 0) {
            kdoNumericSetValue($("#NumArea_Ajuste"), kdoNumericGetValue($("#NumPixeles_Ajuste")) / (this.value() * this.value()));
            KdoCmbSetValue($("#CmdIdUnidadArea_Ajuste"), 6);
        } else {
            kdoNumericSetValue($("#NumArea_Ajuste"), 0);
            KdoCmbSetValue($("#CmdIdUnidadArea_Ajuste"), 6);
        }
    });
    //#endregion
};

var fn_VistaEstacion_Ajuste = function () {
    InicioModal_Ajuste = 1;
    //inhabilitar campo nombre del color
    TextBoxEnable($("#TxtOpcSelec_Ajuste"), false);
    TextBoxEnable($("#TxtOpcSelecFormulas_Ajuste"), false);

    TextBoxEnable($("#TxtNombreQuiForm_Ajuste"), false);
    TextBoxReadOnly($("#TxtFormulaSugTint_Ajuste"), false);
    TextBoxEnable($("#NumMasaEntre_Ajuste"), false);
    TextBoxReadOnly($("#ArticuloSugerido_Ajuste"), false);
    TextBoxReadOnly($("#txtArticuloSugeridoTint_Ajuste"), false);
    KdoNumerictextboxEnable($("#NumArea_Ajuste"), false);
    KdoComboBoxEnable($("#CmdIdUnidadArea_Ajuste"), false);

    $("#TxtOpcSelec_Ajuste").val($("#TxtOpcSelec_Ajuste").data("name"));
    $("#TxtOpcSelecFormulas_Ajuste").val($("#TxtOpcSelecFormulas").data("name"));//campo nombre del color, base o tecnica.


    $("#ArticuloSugerido_Ajuste").val("");
    if ($("#TxtOpcSelec_Ajuste").data().Formulacion === "TECNICA")
        fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Ajuste"), maq[0].IdSeteo, $("#TxtOpcSelec_Ajuste").data().IdRequerimientoTecnica);

    EstacionBra = fn_Estaciones(maq[0].IdSeteo, $("#TxtOpcSelec_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""));
    xIdSeteoMq = EstacionBra === null ? 0 : maq[0].IdSeteo;
    var grid = $("#gridEstacionMq_Ajuste").data("kendoGrid");
    grid.dataSource.data([]);
    kendo.ui.progress($("#MEstacionAjuste"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo + "/" + $("#TxtOpcSelec_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""),
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#SeccionAjuste_1").removeAttr("hidden");
                $("#SeccionAjuste_2").removeClass('col-lg-12');
                $("#SeccionAjuste_2").addClass('col-lg-9');
                $("#MEstacionAjuste").data("kendoWindow").center();
                grid.dataSource.read().then(function () {
                    var items = grid.items();
                    items.each(function (idx, row) {
                        var dataItem = grid.dataItem(row);
                        if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelec_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
                            grid.select(row);
                        }
                    });
                });

            } else {
                $("#SeccionAjuste_1").attr("hidden", true);
                $("#SeccionAjuste_2").removeClass('col-lg-9');
                $("#SeccionAjuste_2").addClass('col-lg-12');
                $("#MEstacionAjuste").data("kendoWindow").center();
                fn_Consultar_Ajuste(grid);
            }
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });


    //KdoButtonEnable($("#btnAddMFAjusteTintas"), vhb);
    //KdoButtonEnable($("#btnAddMFAHistori_Ajuste"), vhb);

    KdoButtonEnable($("#btnAddMFAjusteTintas"), Acceso_Tintas);
    KdoButtonEnable($("#btnAddMFAHistori_Ajuste"), Acceso_Tintas);
    KdoButtonEnable($("#btnAutRet_Ajuste"), Acceso_Tintas);
    Acceso_Tintas !== false ? $("#gridFormulasAjuste").data("kendoGrid").showColumn("cambiarEstado") : $("#gridFormulasAjuste").data("kendoGrid").hideColumn("cambiarEstado");
    Acceso_Tintas !== false ? Grid_HabilitaToolbar($("#gridFormulasAjuste"), false, Permisos.SNEditar, false) : Grid_HabilitaToolbar($("#gridFormulasAjuste"), false, false, false);
    Acceso_Tintas !== false ? Grid_HabilitaToolbar($("#gridFormulasMPAjuste"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridFormulasMPAjuste"), false, false, false);
};
//// funciones
var fn_Consultar_Ajuste = function (g) {

    var SelItem = g.dataItem(g.select());
    xidEstacion = SelItem === null ? 0 : SelItem.IdEstacion;
    idBra = SelItem === null ? $("#TxtOpcSelec_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion === null ? $("#TxtOpcSelec_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion;
    Te = SelItem === null ? $("#TxtOpcSelec_Ajuste").data("Formulacion") : SelItem.IdTipoFormulacion === null ? $("#TxtOpcSelec_Ajuste").data("Formulacion") : SelItem.IdTipoFormulacion;
    //Te = SelItem.IdTipoFormulacion;
    KdoCmbSetValue($("#CmbIdTipoEstacion_Ajuste"), "MARCO");
    fn_DeshabilitarCamposMarco_Ajuste(true);
    setFor = null;
    estaMarco = null;
    EstaTintasFormula = null;

    if ((InicioModal_Ajuste === 1 && Number(idBra) === Number($("#TxtOpcSelec_Ajuste").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) || InicioModal_Ajuste === 0) {
        fn_GetMarcoFormulacion_Ajuste(maq[0].IdSeteo, idBra);
        fn_EstacionesMarcos_Ajuste(maq[0].IdSeteo, idBra);
        fn_EstacionesTintasFormulaDet_Ajuste(maq[0].IdSeteo, idBra);
        $("#MEstacionAjuste").data("kendoWindow").title("CONFIGURACIÓN ESTACIÓN #" + idBra);

        $("#gridFormulasAjuste").data("kendoGrid").dataSource.read().then(function () {
            let items = $("#gridFormulasAjuste").data("kendoGrid").items();
            items.each(function (idx, row) {
                var dataItem = $("#gridFormulasAjuste").data("kendoGrid").dataItem(row);
                if (dataItem["Estado"] === "VIGENTE") {
                    $("#gridFormulasAjuste").data("kendoGrid").select(row);
                }
            });
        });

        $("#gridDet_Ajuste").data("kendoGrid").dataSource.read();
        InicioModal_Ajuste = 0;
    }

};
var fn_GetMarcoFormulacion_Ajuste = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionAjuste"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionMarcosFormulacion_Ajuste(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionAjuste"), false);
        }
    });
};

var fn_SeccionMarcosFormulacion_Ajuste = function (datos) {
    setFor = datos;
    if (setFor !== null) {
        $("#NumResolucionDPI_Ajuste").data("kendoNumericTextBox").focus();
        switch (setFor.IdTipoFormulacion) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Ajuste").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#TxtOpcSelecFormulas_Ajuste").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);

                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');

                $("#TxtOpcSelec_Ajuste").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                $("#TxtOpcSelecFormulas_Ajuste").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);

                KdoCmbSetValue($("#CmbTecnica_Ajuste"), setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoTecnica);
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Ajuste"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_Ajuste"), vhb);
                $("#CmbTecnica_Ajuste").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), vhb);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), vhb);
                fn_TecnicasArticuloSugerido($("#txtArticuloSugeridoTint_Ajuste"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Ajuste").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#TxtOpcSelecFormulas_Ajuste").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);

                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');

                $("#TxtOpcSelec_Ajuste").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                $("#TxtOpcSelecFormulas_Ajuste").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);

                KdoCmbSetValue($("#CmbTecnica_Ajuste"), "");
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido_Ajuste"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_Ajuste"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);
                fn_TecnicasArticuloSugerido($("#txtArticuloSugeridoTint_Ajuste"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec_Ajuste").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#TxtOpcSelecFormulas_Ajuste").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);

                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec_Ajuste").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                $("#TxtOpcSelecFormulas_Ajuste").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);

                KdoCmbSetValue($("#CmbTecnica_Ajuste"), "");
                $("#ArticuloSugerido_Ajuste").val("");
                KdoComboBoxEnable($("#CmbTecnica_Ajuste"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);

                break;
        }

        $("#TxtFormulaSug_Ajuste").val(setFor.SugerenciaFormula);
        $("#TxtFormulaSugTint_Ajuste").val(setFor.SugerenciaFormula);
        $("#TxtNombreQuiForm").val(setFor.NomIdQuimica);
        $("#TxtNombreQuiForm_Ajuste").val(setFor.NomIdQuimica);

        KdoCmbSetValue($("#CmbIdTipoEstacion_Ajuste"), setFor.IdTipoEstacion === undefined ? "" : setFor.IdTipoEstacion);
        $("#CmbIdTipoEstacion_Ajuste").data("kendoComboBox").trigger("change");
        fn_DeshabilitarCamposMarco_Ajuste($("#CmbIdTipoEstacion_Ajuste").data("kendoComboBox").dataItem() ? 1 : $("#CmbIdTipoEstacion_Ajuste").data("kendoComboBox").dataItem().UtilizaMarco);

        KdoCmbSetValue($("#CmbQuimica_Ajuste"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);

        $("#CmbTipoTinta_Ajuste").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        $("#CmbSistemaPigmento_Ajuste").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        $("#CmbBasePigmento_Ajuste").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));

        KdoCmbSetValue($("#CmbTipoTinta_Ajuste"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistemaPigmento_Ajuste"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento);

        KdoComboBoxEnable($("#CmbTipoTinta_Ajuste"), vhb !== false ? KdoCmbGetValue($("#CmbTipoTinta_Ajuste")) !== "" : false);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), vhb !== false ? KdoCmbGetValue($("#CmbSistemaPigmento_Ajuste")) !== "" : false);
        KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), vhb !== false ? KdoCmbGetValue($("#CmbBasePigmento_Ajuste")) !== "" : false);

        QuimicaFormula = setFor.IdQuimica;

        //$("#FrmGenEColor").data("kendoValidator").validate();
        Kendo_CmbFocus($("#CmbQuimica_Ajuste"));
    }
    else {
        KdoCmbFocus($("#CmbTipoTinta_Ajuste"));
        $("#TxtFormulaSug_Ajuste").val("");
        $("#txtArticuloSugeridoTint_Ajuste").val("");
        $("#txtArticuloSugerido_Tint").val("");
        switch (Te) {
            case "COLOR":
                KdoComboBoxEnable($("#CmbTecnica_Ajuste"), vhb);
                $("#CmbTecnica_Ajuste").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), vhb);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), vhb);
                break;
            case "TECNICA":
                KdoCmbSetValue($("#CmbTecnica_Ajuste"), "");
                KdoComboBoxEnable($("#CmbTecnica_Ajuste"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
                KdoCmbSetValue($("#CmbSistemaPigmento_Ajuste"), "");
                KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);
                break;
            case "BASE":
                KdoCmbSetValue($("#CmbTecnica_Ajuste"), "");
                KdoComboBoxEnable($("#CmbTecnica_Ajuste"), false);
                KdoCmbSetValue($("#CmbBasePigmento_Ajuste"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
                KdoCmbSetValue($("#CmbSistemaPigmento_Ajuste"), "");
                KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);
                break;
        }
    
    }

};


var fn_EstacionesMarcos_Ajuste = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionAjuste"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionEstacionMarcos_Ajuste(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionAjuste"), false);
        }
    });
};

var fn_SeccionEstacionMarcos_Ajuste = function (datos) {
    estaMarco = datos;

    if (estaMarco !== null) {
        $("#NumCapilar_Ajuste").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#EscurridorDureza_Ajuste").data("kendoNumericTextBox").value(estaMarco.Dureza);
        $("#NumPasadas_Ajuste").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        $("#NumArea_Ajuste").data("kendoNumericTextBox").value(estaMarco.Area);
        KdoCmbSetValue($("#CmdIdUnidadArea_Ajuste"), estaMarco.IdUnidadArea);
        KdoCmbSetValue($("#CmbSedas_Ajuste"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmbTipoEmulsion_Ajuste"), estaMarco.IdTipoEmulsion);
        $("#TxtLetra").val(estaMarco.Letra);
        kdoNumericSetValue($("#NumResolucionDPI_Ajuste"), estaMarco.ResolucionDPI === null ? xResolucion : estaMarco.ResolucionDPI);
        kdoNumericSetValue($("#NumLineajeLPI_Ajuste"), estaMarco.LineajeLPI === null ? xLineaje : estaMarco.LineajeLPI);
        kdoNumericSetValue($("#NumPixeles_Ajuste"), estaMarco.Pixeles);
        xNumPeso_Mues = estaMarco.Peso;
        xCmdIdUnidadPeso_Mues = estaMarco.IdUnidadPeso;
        xEstado = estaMarco.Estado;

    } else {
        xNumPeso_Mues = null;
        xCmdIdUnidadPeso_Mues = null;
        xEstado = null;
    }
};

var fn_EstacionesTintasFormulaDet_Ajuste = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionAjuste"), true);
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
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionAjuste"), false);
        }
    });
};

var fn_GuardarEstacion_Ajuste = function () {

    fn_GuardarEstacion_AjusteArea(idBra);
};

var fn_GuardarMarcoFormu_Ajuste = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionAjuste"), true);
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
            Capilar: $("#NumCapilar_Ajuste").val(),
            IdEstacion: xIdBrazo,
            IdTipoFormulacion: xIdTipoFormulacion,
            IdSeda: KdoCmbGetValue($("#CmbSedas_Ajuste")),
            NoPasadas: $("#NumPasadas_Ajuste").val(),
            Dureza: $("#EscurridorDureza_Ajuste").val(),
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
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_Ajuste")),
            IdSeteo: maq[0].IdSeteo,
            Area: kdoNumericGetValue($("#NumArea_Ajuste")),
            IdUnidadArea: KdoCmbGetValue($("#CmdIdUnidadArea_Ajuste")),
            Peso: xNumPeso_Mues,
            IdUnidadPeso: xCmdIdUnidadPeso_Mues,
            ResolucionDPI: kdoNumericGetValue($("#NumResolucionDPI_Ajuste")),
            LineajeLPI: kdoNumericGetValue($("#NumLineajeLPI_Ajuste")),
            Pixeles: kdoNumericGetValue($("#NumPixeles_Ajuste")),
            Estado: xEstado

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec_Ajuste").data("IdRequerimientoTecnica") : Te === "COLOR" ? KdoCmbGetValue($("#CmbTecnica_Ajuste")) : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec_Ajuste").data("IdBase") : null;
            fn_GuardarMarcoFormuEstacion_Ajuste(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_Ajuste").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
            if (xType === "Put") {
                let ge = $("#gridEstacionMq_Ajuste").data("kendoGrid");
                var uid = ge.dataSource.get(data[0].IdEstacion).uid;
                Fn_UpdGridEstacion_Ajuste(ge.dataItem("tr[data-uid='" + uid + "']"), data[0]);
            }
            xResolucion = kdoNumericGetValue($("#NumResolucionDPI_Ajuste"));
            xLineaje = kdoNumericGetValue($("#NumLineajeLPI_Ajuste"));
         
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAjuste"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormuEstacion_Ajuste = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) {
    kendo.ui.progress($("#MEstacionAjuste"), true);
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
            SugerenciaFormula: $("#TxtFormulaSug_Ajuste").val(),
            IdSistemasTinta: null,
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemaPigmento: KdoCmbGetValue($("#CmbSistemaPigmento_Ajuste")),
            IdBasePigmento: KdoCmbGetValue($("#CmbBasePigmento_Ajuste")),
            IdTipoTinta: KdoCmbGetValue($("#CmbTipoTinta_Ajuste")),
            IdQuimica: KdoCmbGetValue($("#CmbQuimica_Ajuste"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            maq = fn_GetMaquinas();
            if ($("#gridEstacionMq_Ajuste").data("kendoGrid").dataSource.total() === 0) {
                $("#MEstacionAjuste").data("kendoWindow").close();
            }
            $("#maquinaAjusteMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAjuste"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GuardarEstacion_AjusteArea = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAjuste"), true);
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
            IdTipoEstacion: KdoCmbGetValue($("#CmbIdTipoEstacion_Ajuste")),
            IdAccesorio: null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GuardarMarcoFormu_Ajuste(xIdBrazo);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAjuste"), false);
            ErrorMsg(data);
        }
    });

};

//#region OBTENER FORMULAS HISTORICAS
//Metodo que ejecuta para registar una formula historica seleccionada  desde el 
//corresponde a Diseño.
var fn_GuardarEstacionFormula_Ajuste = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($("#MEstacionAjuste"), true);
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
            $("#TxtIdform_Ajuste").val(data[0].IdFormula);
            EstacionBra = fn_Estaciones(maq[0].IdSeteo, xIdBrazo);
            fn_EstacionesTintasFormulaDet_Ajuste(maq[0].IdSeteo, xIdBrazo);
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionAjuste"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAjuste"), false);
            ErrorMsg(data);
        }
    });

};
//Metodo que ejecuta para registar una formula historica seleccionada  desde el 
//corresponde a Tintas
var fn_GuardarFormulaEst_Ajuste = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($(".k-window-content"), true);
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
            kendo.ui.progress($(".k-window-content"), false);
            RequestEndMsg(data, "Post");
            let g = $("#gridFormulasAjuste").data("kendoGrid");
            g.dataSource.read().then(function () {
                var items = g.items();
                items.each(function (idx, row) {
                    var dataItem = g.dataItem(row);
                    if (dataItem[g.dataSource.options.schema.model.id] === Number(data[0].IdFormula)) {
                        g.select(row);
                    }
                });

            });
        },
        complete: function () {
            kendo.ui.progress($(".k-window-content"), false);
        },
        error: function (data) {
            kendo.ui.progress($(".k-window-content"), false);
            ErrorMsg(data);
        }
    });

};
//#endregion 


let fn_DeshabilitarCamposMarco_Ajuste = function (utilizaMarco) {
    let habilitarMarco = utilizaMarco;

    KdoComboBoxEnable($("#CmbSedas_Ajuste"), Acceso_Diseno !== false ? habilitarMarco : false);
    KdoComboBoxEnable($("#CmbTipoEmulsion_Ajuste"), Acceso_Diseno !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#NumCapilar_Ajuste"), Acceso_Diseno !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#NumPasadas_Ajuste"), Acceso_Diseno !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#EscurridorDureza_Ajuste"), Acceso_Diseno !== false ? habilitarMarco : false);

    if (!habilitarMarco) {
        KdoCmbSetValue($("#CmbSedas_Ajuste"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_Ajuste"), "");
        kdoNumericSetValue($("#NumCapilar_Ajuste"), 0);
        kdoNumericSetValue($("#NumPasadas_Ajuste"), 0);
        kdoNumericSetValue($("#EscurridorDureza_Ajuste"), 0);
    }

    if (Acceso_Diseno === false) {
        KdoComboBoxEnable($("#CmbIdTipoEstacion_Ajuste"), false);
        TextBoxEnable($("#TxtLetra"), false);
        KdoButtonEnable($("#btnAddMCE_Ajuste"), false);
        KdoComboBoxEnable($("#CmbQuimica_Ajuste"), false);
        KdoComboBoxEnable($("#CmbTipoTinta_Ajuste"), false);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), false);
        KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), false);
        KdoNumerictextboxEnable($("#NumResolucionDPI_Ajuste"), false);
        KdoNumerictextboxEnable($("#NumPixeles_Ajuste"), false);
        KdoNumerictextboxEnable($("#NumLineajeLPI_Ajuste"), false);
        TextBoxEnable($("#TxtFormulaSug_Ajuste"), false);
        KdoComboBoxEnable($("#CmbTecnica_Ajuste"), false);
    } else {
        KdoComboBoxEnable($("#CmbIdTipoEstacion_Ajuste"), true);
        TextBoxEnable($("#TxtLetra"), true);
        KdoButtonEnable($("#btnAddMCE_Ajuste"), true);
        KdoComboBoxEnable($("#CmbQuimica_Ajuste"), true);
        KdoComboBoxEnable($("#CmbTipoTinta_Ajuste"), true);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Ajuste"), true);
        KdoComboBoxEnable($("#CmbBasePigmento_Ajuste"), true);
        KdoNumerictextboxEnable($("#NumResolucionDPI_Ajuste"), true);
        KdoNumerictextboxEnable($("#NumPixeles_Ajuste"), true);
        KdoNumerictextboxEnable($("#NumLineajeLPI_Ajuste"), true);
        TextBoxEnable($("#TxtFormulaSug_Ajuste"), true);
        KdoComboBoxEnable($("#CmbTecnica_Ajuste"), true);
    }
};

fn_PWList.push(fn_VistaEstacion_Ajuste);
fn_PWConfList.push(fn_VistaEstacion_AjusteDocuReady);


var fn_GridEstacionesDiseno_Ajuste = function (gd) {

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
                    },
                    Comentario: {
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
            var grid = gd.data("kendoGrid");
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.Comentario !== '') {
                    if (row.Comentario === undefined) {
                        $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                    } else {
                        $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#e8e855");
                    }
                } else {
                    $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                }
            });
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
            { field: "IgualarColor", title: "Igualar a:", minResizableWidth: 120 },
            { field: "Comentario", title: "Comentario de Ajuste", minResizableWidth: 120 }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 450);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
        fn_Consultar_Ajuste(gd.data("kendoGrid"));
        //fn_ConsultarFormulaAjuste(gd.data("kendoGrid"));

    });
};

let Fn_UpdGridEstacion_Ajuste = function (g, data) {
    g.set("Letra", data.Letra);
    LimpiaMarcaCelda_Ajuste();
};

let LimpiaMarcaCelda_Ajuste = function () {
    $(".k-dirty-cell", $("#gridEstacionMq_Ajuste")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridEstacionMq_Ajuste")).remove();
};

//#region
    var fn_gridFormulasAjuste = function (gd) {

        var dsFormulas = new kendo.data.DataSource({
            //CONFIGURACION DEL CRUD
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "TintasFormulaciones/GetbySeteoEstacion/" + maq[0].IdSeteo + "/" + xidEstacion; },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function (datos) { return TSM_Web_APi + "TintasFormulaciones/" + datos.IdFormula; },
                    type: "PUT",
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
                    id: "IdFormula",
                    fields: {
                        IdFormula: {
                            type: "number"
                        },
                        IdSeteo: {
                            type: "number"
                        },
                        IdEstacion: {
                            type: "number"
                        },
                        Fecha: {
                            type: "date"
                        },
                        MasaEntregada: {
                            type: "number"
                        },
                        MasaDevuelta: {
                            type: "number"
                        },
                        C2: {
                            type: "number" // total = Masadevuelta + MasaEntregada
                        },
                        IdMotivo: {
                            type: "number"
                        },
                        Nombre: {
                            type: "string"
                        },
                        Estado: {
                            type: "string"
                        },
                        Nombre1: {
                            type: "string"
                        },
                        IdUsuarioMod: {
                            type: "string"
                        },
                        FechaMod: {
                            type: "date"
                        },
                        CIELAB_L: {
                            type: "number",
                            defaultValue: function () {
                                return 0;
                            }
                        },
                        CIELAB_A: {
                            type: "number",
                            defaultValue: function () {
                                return 0;
                            }
                        },
                        CIELAB_B: {
                            type: "number",
                            defaultValue: function () {
                                return 0;
                            }
                        },
                        CIELAB_DELTAE: {
                            type: "number",
                            defaultValue: function () {
                                return 0;
                            }
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
            edit: function (e) {
                KdoHideCampoPopup(e.container, "Fecha");
                KdoHideCampoPopup(e.container, "MasaDevuelta");
                KdoHideCampoPopup(e.container, "C2");
                KdoHideCampoPopup(e.container, "IdMotivo");
                KdoHideCampoPopup(e.container, "Nombre1");
                KdoHideCampoPopup(e.container, "IdUsuarioMod");
                KdoHideCampoPopup(e.container, "IdSeteo");
                KdoHideCampoPopup(e.container, "IdFormula");
                KdoHideCampoPopup(e.container, "IdEstacion");
                KdoHideCampoPopup(e.container, "Nombre");
                KdoHideCampoPopup(e.container, "Estado");
                KdoHideCampoPopup(e.container, "FechaMod");

                if (e.model.MasaEntregada > 0 && e.model.C2 > 0)
                    KdoHideCampoPopup(e.container, "MasaEntregada");

                if (e.model.Estado !== "CREADA") {
                    KdoNumerictextboxEnable($('[name="CIELAB_L"]'), false);
                    KdoNumerictextboxEnable($('[name="CIELAB_A"]'), false);
                    KdoNumerictextboxEnable($('[name="CIELAB_B"]'), false);
                    KdoNumerictextboxEnable($('[name="CIELAB_DELTAE"]'), false);
                } else {
                    if (e.model.MasaEntregada > 0 && e.model.C2 > 0)
                        Grid_Focus(e, "CIELAB_L");
                    else
                        Grid_Focus(e, "MasaEntregada");
                }
            },

            columns: [
                { field: "IdFormula", title: "Código. Formula", hidden: true },
                { field: "IdSeteo", title: "Código. IdSeteo", hidden: true },
                { field: "IdEstacion", title: "N° Estacion", hidden: true },
                { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
                { field: "MasaEntregada", title: "Masa Entregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}" },
                { field: "MasaDevuelta", title: "Masa Devuelta", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}" },
                { field: "C2", title: "Masa Total", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}" },
                { field: "IdMotivo", title: "Motivo", hidden: true },
                { field: "CIELAB_L", title: "CIELAB L", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
                { field: "CIELAB_A", title: "CIELAB A", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
                { field: "CIELAB_B", title: "CIELAB B", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
                { field: "CIELAB_DELTAE", title: "CIELAB &Delta;E", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
                { field: "Nombre", title: "Nombre Motivo" },
                { field: "Estado", title: "Estado", hidden: true },
                { field: "Nombre1", title: "Estado" },
                { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
                { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
                {
                    field: "cambiarEstado", title: "&nbsp;",
                    command: {
                        name: "cambiarEstado",
                        iconClass: "TS-icon-ARROW",
                        text: "",
                        click: function (e) {
                            e.preventDefault();
                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                            //var lstId = {
                            //    IdFormula: dataItem.IdFormula
                            //};
                            Fn_VistaCambioEstadoMostrar("TintasFormulaciones", dataItem.Estado, TSM_Web_APi + "TintasFormulaciones/TintasFormulaciones_CambiarEstado", "", dataItem.IdFormula, undefined, function () {
                                return fn_UpdEstadoGrilla_Ajuste();   });
                        }
                    },
                    width: "70px",
                    attributes: {
                        style: "text-align: center"
                    }
                }
            ]
        });

        // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
        SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 200);
        SetGrid_CRUD_Command(gd.data("kendoGrid"), Permisos.SNEditar, false);
        Set_Grid_DataSource(gd.data("kendoGrid"), dsFormulas);
        var srow2 = [];
        gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(gd, srow2);
        });

        gd.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(gd, srow2);
            fn_consultarFormulaAjusteDet();
        });
    };
    var fn_gridAjustePrimaAjuste = function (gd) {
        var dsAjusMp = new kendo.data.DataSource({
            //CONFIGURACION DEL CRUD
            transport: {
                read: {
                    url: function (data) { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + fn_getIdFormula_Ajuste($("#gridFormulasAjuste").data("kendoGrid")); },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function (datos) { return TSM_Web_APi + "TintasFormulacionesDetalles/" + datos.IdFormula + "/" + datos.Item; },
                    type: "PUT",
                    contentType: "application/json; charset=utf-8"
                },
                destroy: {
                    url: function (datos) { return TSM_Web_APi + "TintasFormulacionesDetalles/" + datos.IdFormula + "/" + datos.Item; },
                    type: "DELETE"
                },
                create: {
                    url: TSM_Web_APi + "TintasFormulacionesDetalles",
                    type: "POST",
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
                    id: "Item",
                    fields: {
                        IdFormula: {
                            type: "number",
                            defaultValue: function () {
                                return fn_getIdFormula_Ajuste($("#gridFormulasAjuste").data("kendoGrid"));
                            }
                        },
                        Item: {
                            type: "number"
                        },
                        IdArticulo: {
                            type: "string",
                            validation: {
                                required: true,
                                maxlength: function (input) {
                                    if (input.is("[name='IdArticulo']")) {
                                        input.attr("data-maxlength-msg", "Requerido");
                                        return $("[name='IdArticulo']").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                    }
                                    return true;
                                }
                            }
                        },
                        Nombre: {
                            type: "string"
                        },
                        MasaInicial: {
                            type: "number"
                        },
                        PorcentajeInicial: {
                            type: "number"
                        },
                        MasaAgregada: {
                            type: "number"
                        },
                        PorcentajeAgregado: {
                            type: "number"
                        },
                        MasaFinal: {
                            type: "number"
                        },
                        PorcentajeFinal: {
                            type: "number"
                        },
                        Masatotal: { type: "number" }

                    }
                }
            },
            aggregate: [
                { field: "MasaInicial", aggregate: "sum" },
                { field: "PorcentajeInicial", aggregate: "sum" },
                { field: "PorcentajeAgregado", aggregate: "sum" },
                { field: "MasaAgregada", aggregate: "sum" },
                { field: "PorcentajeFinal", aggregate: "sum" },
                { field: "MasaFinal", aggregate: "sum" }
            ],
            requestEnd: function (e) {
                if ((e.type === "create" || e.type === "update" || e.type === "destroy") && e.response) {
                    e.sender.read();
                    fn_CalcularRetencion(maq[0].IDOrdenTrabajo, 2, 1, false);
                    $("#gridFormulasAjuste").data("kendoGrid").dataSource.read();
                }

                Grid_requestEnd(e);
            },
            error: function (e) {
                ErrorMsg(e.xhr);
            }
        });

        let UrlARt = TSM_Web_APi + "Articulos";
        //CONFIGURACION DEL GRID,CAMPOS
        gd.kendoGrid({
            edit: function (e) {
                // Ocultar
                // e.model.fields.IdArticulo.validation.required = false;
                KdoHideCampoPopup(e.container, "Nombre");
                KdoHideCampoPopup(e.container, "IdFormula");
                KdoHideCampoPopup(e.container, "Masatotal");
                var MasaTot = e.model.Masatotal;
                $('[name="PorcentajeInicial"]').data("kendoNumericTextBox").enable(fn_getMasaEntregada_Ajuste($("#gridFormulasAjuste").data("kendoGrid")) === fn_getMasaTotal_Ajuste($("#gridFormulasAjuste").data("kendoGrid")));
                $('[name="MasaInicial"]').data("kendoNumericTextBox").enable(fn_getMasaEntregada_Ajuste($("#gridFormulasAjuste").data("kendoGrid")) === fn_getMasaTotal_Ajuste($("#gridFormulasAjuste").data("kendoGrid")));
                $('[name="PorcentajeAgregado"]').data("kendoNumericTextBox").enable(fn_getMasaEntregada_Ajuste($("#gridFormulasAjuste").data("kendoGrid")) !== fn_getMasaTotal_Ajuste($("#gridFormulasAjuste").data("kendoGrid")));
                $('[name="MasaAgregada"]').data("kendoNumericTextBox").enable(fn_getMasaEntregada_Ajuste($("#gridFormulasAjuste").data("kendoGrid")) !== fn_getMasaTotal_Ajuste($("#gridFormulasAjuste").data("kendoGrid")));
                $('[name="MasaFinal"]').data("kendoNumericTextBox").enable(false);
                $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").enable(false);
                $('[name="Masatotal"]').data("kendoNumericTextBox").enable(false);

                $('[name="MasaInicial"]').on("change", function (e) {
                    let xMasaInicial = this.value;
                    $('[name="MasaFinal"]').data("kendoNumericTextBox").value(parseFloat(xMasaInicial));
                    $('[name="MasaFinal"]').data("kendoNumericTextBox").trigger("change");
                });

                $('[name="PorcentajeInicial"]').on("change", function (e) {
                    let xPorcentajeInicial = this.value;
                    $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").value(parseFloat(xPorcentajeInicial));
                    $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").trigger("change");
                });

                $('[name="MasaAgregada"]').on("change", function (e) {
                    let xMasaInicial = $('[name="MasaInicial"]').data("kendoNumericTextBox").value();
                    let xMasaAgregada = this.value;

                    $('[name="MasaFinal"]').data("kendoNumericTextBox").value(parseFloat(xMasaInicial) + parseFloat(xMasaAgregada));
                    $('[name="MasaFinal"]').data("kendoNumericTextBox").trigger("change");
                });
                $('[name="PorcentajeAgregado"]').on("change", function (e) {
                    let xPorcenMasaFinal = $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").value();
                    let xPorcentajeAgregado = this.value;
                    $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").value(parseFloat(xPorcentajeAgregado) + parseFloat(xPorcenMasaFinal));
                    $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").trigger("change");
                    $('[name="MasaFinal"]').data("kendoNumericTextBox").value(parseFloat(MasaTot) * (parseFloat(xPorcentajeAgregado) + parseFloat(xPorcenMasaFinal)));
                    $('[name="MasaFinal"]').data("kendoNumericTextBox").trigger("change");
                    let xMasaAgre = $('[name="MasaFinal"]').data("kendoNumericTextBox").value() - $('[name="MasaInicial"]').data("kendoNumericTextBox").value();

                    $('[name="MasaAgregada"]').data("kendoNumericTextBox").value(xMasaAgre);
                    $('[name="MasaAgregada"]').data("kendoNumericTextBox").trigger("change");
                });

                if (!e.model.isNew()) {
                    Grid_Focus(e, "MasaAgregada");
                    var multicolumncombobox = $('[name="IdArticulo"]').data("kendoMultiColumnComboBox");
                    multicolumncombobox.select(function (dataItem) { return dataItem.IdArticulo === e.model.IdArticulo; });
                    multicolumncombobox.search(e.model.Nombre);
                    multicolumncombobox.refresh();
                    multicolumncombobox.text(e.model.Nombre);
                    multicolumncombobox.close();

                } else {
                    Grid_Focus(e, "IdArticulo");
                }
                // e.model.fields.IdArticulo.validation.required = true;


            },
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdFormula", title: "Código. Formula", hidden: true },
                {
                    field: "IdArticulo", title: "Código Articulo",
                    editor: function (container, options) {
                        if (CumpleOEKOTEX === false) {
                            $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrima(QuimicaFormula);
                        }
                        else {
                            $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrimaOEKOTEX(QuimicaFormula);
                        }

                    }
                },
                { field: "Nombre", title: "Nombre" },
                { field: "MasaInicial", title: "Masa Inicial", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Inicial: #: data.MasaInicial ? kendo.format('{0:n2}',sum ): 0 #" },
                { field: "PorcentajeInicial", title: "Porcentaje Inicial", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeInicial ? kendo.format('{0:n2}',sum)*100: 0 # %" },
                { field: "MasaAgregada", title: "Masa Agregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Agregada: #: data.MasaAgregada ? kendo.format('{0:n2}',sum) : 0 #" },
                { field: "PorcentajeAgregado", title: "% Agregado", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeAgregado ? kendo.format('{0:n2}',sum)*100: 0 # %" },
                { field: "MasaFinal", title: "Masa Final", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}',sum ): 0 #" },
                { field: "PorcentajeFinal", title: "% Final", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
                { field: "Masatotal", title: "Masatotal", menu: false, hidden: true }
            ]
        });

        // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
        SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 430);
        SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), Permisos.SNAgregar);
        SetGrid_CRUD_Command(gd.data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
        Set_Grid_DataSource(gd.data("kendoGrid"), dsAjusMp);

        var srow3 = [];
        gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(gd, srow3);
        });

        gd.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(gd, srow3);


        });

};

var fn_consultarFormulaAjusteDet = function () {

    $("#gridFormulasMPAjuste").data("kendoGrid").dataSource.read().then(function () {
        fn_getEstado($("#gridFormulasAjuste").data("kendoGrid")) === 'CREADA' ? Grid_HabilitaToolbar($("#gridFormulasMPAjuste"), true, true, true) : Grid_HabilitaToolbar($("#gridFormulasMPAjuste"), false, false, false);

    });
    // valida retenciones
    //calcular retenciones si existen
    fn_CalcularRetencion(maq[0].IDOrdenTrabajo, 2, 1, false);
    kendo.ui.progress($(document.activeElement), false);
};





//#endregion

//#region Metdos funcionamiento Grid

    var fn_getIdFormula_Ajuste = function (g) {
        var SelItem = g.dataItem(g.select());
        return SelItem === null ? 0 : SelItem.IdFormula;

    };

    var fn_SetfocoFilaAjustada = function () {
        let g = $("#gridFormulasAjuste").data("kendoGrid");
        g.dataSource.read().then(function () {
            //success_Data esta variable se llena despues de el nuevo Ajuste
            if (success_Data[0] !== null) {
                var items = g.items();
                items.each(function (idx, row) {
                    var dataItem = g.dataItem(row);
                    if (dataItem[g.dataSource.options.schema.model.id] === Number(success_Data[0].IdFormula)) {
                        g.select(row);
                    }
                });
            }

        });
    };

    let fn_getMasaEntregada_Ajuste = function (g) {
        var SelItem = g.dataItem(g.select());
        return SelItem === null ? 0 : SelItem.MasaEntregada;
    };

let fn_getMasaTotal_Ajuste = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.C2;
};
//#endregion

//#region Grid alertas


var fn_GridDetAjuste = function () {

    var dsetRegEst = new kendo.data.DataSource({

        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasAlertas/GetAlertaRegistroAjustes/" + maq[0].IdSeteo + "/" + xidEstacion; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        group: {
            field: "MotivoAjuste"
        },
        schema: {
            model: {
                id: "ItemSolicitudAjuste",
                fields: {
                    IdRegistroSolicitudAjuste: { type: "number" },
                    IdMotivoSolicitudAjuste: { type: "number" },
                    ItemSolicitudAjuste: { type: "number" },
                    IdSeteo: { type: "number" },
                    IdEstacion: { type: "number" },
                    MotivoAjuste: { type: "string" },
                    Comentarios: { type: "string" },
                    Estado: { type: "string" },
                    NombreEstado: { type: "string" },
                    NombreDeptResponsable: { type: "string" }
                }
            }
        }

    });
    //CONFIGURACION DEL gCHFor,CAMPOS

    $("#gridDet_Ajuste").kendoGrid({
        columns: [
            { field: "IdRegistroSolicitudAjuste", title: "Cod.Registro", hidden: true },
            { field: "IdMotivoSolicitudAjuste", title: "Cod.Motivo", hidden: true },
            { field: "ItemSolicitudAjuste", title: "Cod.ItemSolicitud", hidden: true },
            { field: "IdSeteo", title: "Cod.IdSeteo", hidden: true },
            { field: "MotivoAjuste", title: "Motivo ", hidden: true },
            { field: "IdEstacion", title: "Estacion", hidden: true },
            { field: "NombreDeptResponsable", title: "Departamento" },
            { field: "Comentarios", title: "Comentarios" },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NombreEstado", title: "Estado" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridDet_Ajuste").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 250);
    SetGrid_CRUD_ToolbarTop($("#gridDet_Ajuste").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDet_Ajuste").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDet_Ajuste").data("kendoGrid"), dsetRegEst);

    var srowAjuste1 = [];
    $("#gridDet_Ajuste").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDet_Ajuste"), srowAjuste1);
    });

    $("#gridDet_Ajuste").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDet_Ajuste"), srowAjuste1);
    });


};

let fn_UpdEstadoGrilla_Ajuste = function () {
    // como esta funcion es Async =false es valido colocar este codigo
    let ge = $("#gridEstacionMq_Ajuste").data("kendoGrid");
    var uid = ge.dataSource.get(xidEstacion).uid;
    Fn_UpdGridEstacion_Formula_Ajuste(ge.dataItem("tr[data-uid='" + uid + "']"), KdoCmbGetText($("#cmbEstados")));
    $("tr[data-uid= '" + uid + "']").removeAttr("style");
    $("#gridDet_Ajuste").data("kendoGrid").dataSource.read(); 
    return true;
};

let Fn_UpdGridEstacion_Formula_Ajuste = function (g, estado) {
    g.set("EstadoFormula", estado);
    LimpiaMarcaCelda_Formula_Ajuste();
    //if (estado === "FORMULA VIGENTE") {
    //    g.set("EstadoAlerta", "FINALIZADA");
    //}
    //LimpiaMarcaCelda_Formula();
};
let LimpiaMarcaCelda_Formula_Ajuste = function () {
    $(".k-dirty-cell", $("#gridEstacionMq_Ajuste")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridEstacionMq_Ajuste")).remove();
};



//#endregion 