"use strict";

const fn_VEVerifMuestraDocuReady = () => {

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

    KdoComboBoxbyData($("#CmbQuimica_VerifMues"), "[]", "Nombre", "IdQuimicaFormula", "Seleccione ....");
    $("#CmbQuimica_VerifMues").data("kendoComboBox").setDataSource(Fn_GetQuimicaFormula(0));

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

    let frmVerifDiseno = $("#FrmGenEVerifDiseno").kendoValidator({
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
            },
            vncapilar: function (input) {
                if (input.is("[id='NumCapilar_VerifMues']") && Te === "TECNICA" ) {
                    return $("#NumCapilar_VerifMues").data("kendoNumericTextBox").value() !== 0;
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
            vsuge: "Longitud máxima del campo es 200",
            vncapilar: "Requerido"
        }
    }).data("kendoValidator");

    $("#CmbIdTipoEstacion_VerifMues").data("kendoComboBox").bind("select", function (e) {
        fn_DeshabilitarCamposMarco_VM(e.dataItem.UtilizaMarco);
    });

    $("#btnAddMCE_VerifMues").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmVerifDiseno.validate()) {
            kendo.ui.progress($("#MEstacionVerifMuestra").data("kendoWindow").element, true);
            GuardarEstacionDesaVerifMues(idBra);
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    fn_GridEstacionesDiseno_VerifMues($("#gridEstacion_VerifMues"));
};

const fn_DeshabilitarCamposMarco_VM = (utilizaMarco) => {

    let habilitarMarco = utilizaMarco;
    let AplicaSeda = Te === "TECNICA" ? !(tecnicasFlags.find(q => q.IdRequerimientoTecnica === $("#TxtOpcSelec_VerifMues").data().IdRequerimientoTecnica && q.AplicaSeda === true) === undefined) && habilitarMarco === true : habilitarMarco;
    let AplicaCapilar = Te === "TECNICA" ? !(tecnicasFlags.find(q => q.IdRequerimientoTecnica === $("#TxtOpcSelec_VerifMues").data().IdRequerimientoTecnica && q.AplicaCapilar === true) === undefined) && habilitarMarco === true : habilitarMarco;

    KdoComboBoxEnable($("#CmbSedas_VerifMues"), vhb !== false ? AplicaSeda : false);
    KdoComboBoxEnable($("#CmbTipoEmulsion_VerifMues"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#NumCapilar_VerifMues"), vhb !== false ? AplicaCapilar : false);
    KdoNumerictextboxEnable($("#NumPasadas_VerifMues"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#EscurridorDureza_VerifMues"), vhb !== false ? habilitarMarco : false);

    if (!habilitarMarco) {
        KdoCmbSetValue($("#CmbSedas_VerifMues"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_VerifMues"), "");
        kdoNumericSetValue($("#NumCapilar_VerifMues"), 0);
        kdoNumericSetValue($("#NumPasadas_VerifMues"), 0);
        kdoNumericSetValue($("#EscurridorDureza_VerifMues"), 0);
    }

    if (vhb === false) {
        KdoComboBoxEnable($("#CmdIdUnidadPeso_VerifMues"), false);
        KdoNumerictextboxEnable($("#NumPeso_VerifMues"), false);
        TextBoxEnable($("#TxtLetra_VerifMues"), false);
        KdoButtonEnable($("#btnAddMCE_VerifMues"), false);
    } else {
        KdoComboBoxEnable($("#CmdIdUnidadPeso_VerifMues"), true);
        KdoNumerictextboxEnable($("#NumPeso_VerifMues"), true);
        TextBoxEnable($("#TxtLetra_VerifMues"), true);
        KdoButtonEnable($("#btnAddMCE_VerifMues"), true);
    }
};

const GuardarEstacionDesaVerifMues = (xIdBrazo) => {

    let xType;
    let xUrl;
    let IdTipoEstacion = KdoCmbGetValue($("#CmbIdTipoEstacion_VerifMues"));

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
            IdTipoEstacion: IdTipoEstacion,
            IdAccesorio: null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            GuardarEstaMarcoVerifMues(xIdBrazo);

            //obtener la cantidad maxima de estaciones
            fn_ObtCntMaxEstaciones($("#AlertaEstacionValidMues"));
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionVerifMuestra").data("kendoWindow").element, false);
            ErrorMsg(data);
        }
    });
};

const GuardarEstaMarcoVerifMues = (xIdBrazo) => {

    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    let xIdTipoFormulacion = Te;
    let xType;
    let xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');
    let xUrl;

    if (estaMarco === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/";
        xEstado = "SOLICITADO";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    const Capilar = $("#NumCapilar_VerifMues").val();
    const IdSeda = KdoCmbGetValue($("#CmbSedas_VerifMues"));
    const NoPasadas = $("#NumPasadas_VerifMues").val();
    const Dureza = $("#EscurridorDureza_VerifMues").val();
    const Letra = $("#TxtLetra_VerifMues").val();
    const IdTipoEmulsion = KdoCmbGetValue($("#CmbTipoEmulsion_VerifMues"));
    const Peso = kdoNumericGetValue($("#NumPeso_VerifMues"));
    const IdUnidadPeso = KdoCmbGetValue($("#CmdIdUnidadPeso_VerifMues"));

    const data = JSON.stringify({
        Capilar: Capilar,
        IdEstacion: xIdBrazo,
        IdTipoFormulacion: xIdTipoFormulacion,
        IdSeda: IdSeda,
        NoPasadas: NoPasadas,
        Dureza: Dureza,
        Angulo: null,
        Velocidad: null,
        Presion: null,
        Tension: null,
        OffContact: null,
        Letra: Letra,
        IdUsuarioMod: getUser(),
        FechaMod: xFecha,
        IdEscurridor: null,
        SerieMarco: null,
        IdTipoEmulsion: IdTipoEmulsion,
        IdSeteo: maq[0].IdSeteo,
        Area: xAreaDis,
        IdUnidadArea: xIdUnidadAreaDis,
        Peso: Peso,
        IdUnidadPeso: IdUnidadPeso,
        ResolucionDPI: xNumResolucionDPI_Dis,
        LineajeLPI: xNumLineajeLPI_Dis,
        Pixeles: xNumPixeles_Dis,
        Estado: xEstado
    });

    $.ajax({
        url: xUrl,
        type: xType,
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: function (res) {

            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec_VerifMues").data("IdRequerimientoTecnica") : Te === "COLOR" ? xCmbTecnica_VerifMues : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec_VerifMues").data("IdBase") : null;

            fn_GuardarMarcoFormuVerifMues(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec_VerifMues").data("IdRequerimientoColor") : null, vIdtec, vIdBase);

            if (xType === "Put") {
                let ge = $("#gridEstacion_VerifMues").data("kendoGrid");
                let uid = ge.dataSource.get(res[0].IdEstacion).uid;
                Fn_UpdGridEstacion_VerifMues(ge.dataItem("tr[data-uid='" + uid + "']"), res[0]);
            }
        },
        error: function (res) {
            kendo.ui.progress($("#MEstacionVerifMuestra").data("kendoWindow").element, false);
            ErrorMsg(res);
        }
    });
};

const fn_GuardarMarcoFormuVerifMues = (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase) => {

    let xType;
    let xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');
    let xUrl;

    if (setFor === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    const SugerenciaFormula = $("#TxtFormulaSug_VerifMues").val();
    const IdUsuarioMod = getUser();
    const IdSistemaPigmento = KdoCmbGetValue($("#CmbSistemaPigmentos_VerifMues"));
    const IdTipoTinta = KdoCmbGetValue($("#CmbTipoTinta_VerifMues"));
    const IdQuimica = KdoCmbGetValue($("#CmbQuimica_VerifMues"));

    const data = JSON.stringify({
        IdSeteo: maq[0].IdSeteo,
        IdEstacion: xIdBrazo,
        IdBase: xidBase,
        IdRequerimientoTecnica: xidRequerimientoTecnica,
        IdRequerimientoColor: xidRequerimientoColor,
        SugerenciaFormula: SugerenciaFormula,
        IdSistemasTinta: null,
        IdUsuarioMod: IdUsuarioMod,
        FechaMod: xFecha,
        IdSistemaPigmento: IdSistemaPigmento,
        IdBasePigmento: xCmbBasePigmentos_VerifMues,
        IdTipoTinta: IdTipoTinta,
        IdQuimica: IdQuimica
    });

    $.ajax({
        url: xUrl,
        type: xType,
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            maq = fn_GetMaquinas();
            $("#maquinaValidacionMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
            RequestEndMsg(res, xType);
            kendo.ui.progress($("#MEstacionVerifMuestra").data("kendoWindow").element, false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionVerifMuestra").data("kendoWindow").element, false);
            ErrorMsg(data);
        }
    });
};

const Fn_UpdGridEstacion_VerifMues = (g, data) => {
    g.set("Peso", data.Peso);
    LimpiaMarcaCelda_VerifMues();
};

const LimpiaMarcaCelda_VerifMues = () => {
    $(".k-dirty-cell", $("#gridEstacion_VerifMues")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridEstacion_VerifMues")).remove();
};

const fn_GridEstacionesDiseno_VerifMues = (gd) => {

    let dsMp = new kendo.data.DataSource({
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

            let grid = gd.data("kendoGrid");
            let data = grid.dataSource.data();

            data.forEach(row => {
                if (row.Comentario !== '') {
                    $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#e8e855");
                } else {
                    $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                }
            })
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

    let srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
        fn_Consultar_VerifMues(gd.data("kendoGrid"));
    });
};

const fn_VEVerifMuestra = () => {
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
    EstacionBra = fn_Estaciones(maq[0].IdSeteo, $("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""));
    xIdSeteoMq = EstacionBra === null ? 0 : maq[0].IdSeteo;

    let grid = $("#gridEstacion_VerifMues").data("kendoGrid");
    grid.dataSource.data([]);
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
    grid.dataSource.read().then(() => {
        let items = grid.items();
        items.each((id, row) => {
            let dataItem = grid.dataItem(row);
            if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelec_VerifMues").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
                grid.select(row);
            }
        });
    });
};

const fn_Consultar_VerifMues = (g) => {

    let SelItem = g.dataItem(g.select());
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

const fn_GetMarcoFormulacion_VerifMues = (xIdSeteo, xIdestacion) => {
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

const fn_SeccionMarcosFormulacion_VerifMues = (datos) => {
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

        $("#CmbQuimica_VerifMues").data("kendoComboBox").setDataSource(Fn_GetQuimicaFormula(xIdQuimicaCliente));
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
        $("#CmbQuimica_VerifMues").data("kendoComboBox").setDataSource(Fn_GetQuimicaFormula(xIdQuimicaCliente));
        $("#CmbSistemaPigmentos_VerifMues").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(0));
        KdoCmbSetValue($("#CmbSistemaPigmentos_VerifMues"), "");
        xCmbBasePigmentos_VerifMues = null;
    }
};

const fn_EstacionesMarcos_VerifMues = (xIdSeteo, xIdestacion) => {
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

const fn_SeccionEstacionMarcos_VerifMues = (datos) => {
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

const fn_EstacionesTintasFormulaDet_VerifMues = (xIdSeteo, xIdestacion) => {
    kendo.ui.progress($("#MEstacionVerifMuestra"), true);
    $.ajax({
        url: TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            let filtro = [];
            let data = JSON.parse(JSON.stringify(datos), function (key, value) {
                if (value !== null) {
                    if (value.Estado === "VIGENTE")
                        filtro.push(value);
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

const fn_SeccionTitasFormulas_VerifMues = (datos) => {
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

fn_PWList.push(fn_VEVerifMuestra);
fn_PWConfList.push(fn_VEVerifMuestraDocuReady);
