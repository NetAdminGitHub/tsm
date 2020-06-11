
var fn_VistaEstacionFormulasDocuReady = function () {
    KdoButton($("#btnAddMForE"), "check", "Guardar");
    KdoButton($("#btnAddMFAjus"), "check", "Guardar");
    KdoButton($("#btnAddMFAjuste"), "gear", "Ajuste");
    KdoButton($("#btnAddMFEditar"), "edit", "Editar");
    KdoButton($("#btnAddMFAHistori"), "search", "Formulas Historica");
    KdoButton($("#btnAcepAjuste"), "check", "Aceptar");
    kdoRbSetValue($("#rbAjuste"), true);
    KdoButton($("#btnCambioEstado"), "gear", "Cambio de estado");

    //informacion de revelado
    $("#NumPasadas_MaRev").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumCapilar_MaRev").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });
    $("#NumArea_MaRev").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumResolucionDPI_MaRev").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumLineajeLPI_MaRev").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumPixeles_MaRev").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    KdoNumerictextboxEnable($("#NumPasadas_MaRev"), false);
    KdoNumerictextboxEnable($("#NumCapilar_MaRev"), false);
    KdoNumerictextboxEnable($("#NumArea_MaRev"), false);
    KdoNumerictextboxEnable($("#NumResolucionDPI_MaRev"), false);
    KdoNumerictextboxEnable($("#NumLineajeLPI_MaRev"), false);
    KdoNumerictextboxEnable($("#NumPixeles_MaRev"), false);

    TextBoxEnable($("#CmbTipoTinta_MaRev"), false);
    TextBoxEnable($("#CmbSistemaPigmento_MaRev"), false);
    TextBoxEnable($("#CmbBasePigmento_MaRev"), false);

    TextBoxEnable($("#CmbSedas_MaRev"), false);
    TextBoxEnable($("#TxtLetra_MaRev"), false);
    TextBoxEnable($("#CmdIdUnidadArea_MaRev"), false);

    TextBoxEnable($("#CmbTipoEmulsion_MaRev"), false);
    TextBoxEnable($("#TxtNombreEstado"), false);

    $("#NumCntIni_Recibida").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#TxtNombreQuiForm").val(NombreQui);

    xidEstacion = 0;
    fn_gridFormulas($("#gridFormulas"));
    fn_gridMateriaPrima($("#gridFormulasMP"));
    fn_gridAjustePrima($("#gridFormulasAjusMP"));

    $("#MbtnAjuste").kendoDialog({
        height: "auto",
        width: "20%",
        title: "Crear ajuste",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    $("#MbtnEditForm").kendoDialog({
        height: "auto",
        width: "60%",
        title: "Ajuste de fórmulas",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900,
        close: fn_EditClose,
        show: fn_ShowAjus
    });

    $("#btnAddMFEditar").bind("click", function () {
    
        $("#MbtnEditForm").data("kendoDialog").open().toFront();
    });

    $("#btnAddMFAjuste").bind("click", function () {
        kdoNumericSetValue($("#NumCntIni_Recibida"), 0.00);
        KdoCmbSetValue($("#CmbMotivoAjus"), "");
        kdoRbSetValue($("#rbAjuste"), true);
        $("#MbtnAjuste").data("kendoDialog").open().toFront();
        $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
        frmNajus.hideMessages();
    });

    let urtMo = TSM_Web_APi + "MotivosAjustesTintas";
    Kendo_CmbFiltrarGrid($("#CmbMotivoAjus"), urtMo, "Nombre", "IdMotivo", "Seleccione un motivo de ajuste ....");

    var frmNajus = $("#FrmNuevoAjuste").kendoValidator({
        rules: {
            vcnt: function (input) {
                if (input.is("[id='NumCntIni_Recibida']") ) {
                    return kdoNumericGetValue($("#NumCntIni_Recibida")) > 0 && kdoNumericGetValue($("#NumCntIni_Recibida")) <=500;
                }
                return true;
            },
            vMtAjus: function (input) {
                if (input.is("[id='CmbMotivoAjus']")) {
                    return $("#CmbMotivoAjus").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            vcnt: "Cantidad no mayor a 500",
            vMtAjus: "Requerido"
        }
    }).data("kendoValidator");

    $("#btnAcepAjuste").bind("click", function (e) {
        e.preventDefault();
        if (frmNajus.validate()) {
            fn_Ajuste();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar la cantidad devuelta", "error");
        }

    });

    $("#rbAjusteLimpio").click(function () {
        kdoNumericSetValue($("#NumCntIni_Recibida"), 0.00);
        $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
        $('[for= "NumCntIni_Recibida"]').text("Cantidad Inicial:");
        frmNajus.hideMessages();
    });

    $("#rbAjuste").click(function () {
        KdoNumerictextboxEnable($("#NumCntIni_Recibida"), true);
        $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
        $('[for= "NumCntIni_Recibida"]').text("Cantidad Recibida:");
        frmNajus.hideMessages();
    });

    $("#btnAddMFAHistori").data("kendoButton").bind("click", function () {
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
        fn_FormulaHistorica("FormulaHist");
    });

    $("#tsFormulas").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip").select(0);


    // carga vista para el cambio de estado
    // 1. configurar vista.
    Fn_VistaCambioEstado($("#vCambioEstado"));
     // 2. boton cambio de estado.
    $("#btnCambioEstado").click(function () {
       
        var lstId = {
            IdSeteo: maq[0].IdSeteo,
            IdEstacion: xidEstacion
        };
        Fn_VistaCambioEstadoMostrar("SeteoMaquinasEstacionesMarcos", xEstado, TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/SeteoMaquinasEstacionesMarcos_CambiarEstado", "Sp_CambioEstado", lstId);
    });

};

var fn_VistaEstacionFormulas = function () {
    $("#tsFormulas").data("kendoTabStrip").select(0);
    $("#gridFormulas").data("kendoGrid").dataSource.data([]);
    $("#gridFormulasMP").data("kendoGrid").dataSource.data([]);
    TextBoxEnable($("#TxtOpcSelecFormulas"), false);
    TextBoxEnable($("#TxtNombreQuiForm"), false);
    TextBoxEnable($("#TxtFormulaSugTint"), false);
    $("#TxtOpcSelecFormulas").val($("#TxtOpcSelecFormulas").data("name"));
    xidEstacion = $("#TxtOpcSelecFormulas").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    Te = $("#TxtOpcSelecFormulas").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, xidEstacion);
    setMaqMar = fn_GetSeteoMaquinasEstacionesMarcos(maq[0].IdSeteo, xidEstacion);
    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Color');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Técnica');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Base');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                break;
        }
        $("#TxtFormulaSugTint").val(setFor.SugerenciaFormula);
        $("#CmbTipoTinta_MaRev").val(setFor.NomIdTipoTinta === undefined ? "" : setFor.NomIdTipoTinta);
        $("#CmbSistemaPigmento_MaRev").val(setFor.NombreSistPigmento === undefined ? "" : setFor.NombreSistPigmento);
        $("#CmbBasePigmento_MaRev").val(setFor.NombreBasePig === undefined ? "" : setFor.NombreBasePig);
    }
    else {
        $("#TxtFormulaSugTint").val("");
        $("#CmbTipoTinta_MaRev").val("");
        $("#CmbSistemaPigmento_MaRev").val("");
        $("#CmbBasePigmento_MaRev").val("");
    }
    if (setMaqMar !== null) {
        $("#NumCapilar_MaRev").data("kendoNumericTextBox").value(setMaqMar.Capilar);
        $("#NumPasadas_MaRev").data("kendoNumericTextBox").value(setMaqMar.NoPasadas);
        $("#NumArea_MaRev").data("kendoNumericTextBox").value(setMaqMar.Area);
        $("#CmdIdUnidadArea_MaRev").val(setMaqMar.Abreviatura);
        $("#CmbSedas_MaRev").val(setMaqMar.NombreSeda);
        $("#CmbTipoEmulsion_MaRev").val(setMaqMar.NombreEmulsion);
        $("#TxtLetra_MaRev").val(setMaqMar.Letra);
        kdoNumericSetValue($("#NumResolucionDPI_MaRev"), setMaqMar.ResolucionDPI);
        kdoNumericSetValue($("#NumLineajeLPI_MaRev"), setMaqMar.LineajeLPI);
        kdoNumericSetValue($("#NumPixeles_MaRev"), setMaqMar.Pixeles);
        xEstado = setMaqMar.Estado;
        $("#TxtNombreEstado").val(setMaqMar.NombreEst);
    } else {
        $("#NumCapilar_MaRev").data("kendoNumericTextBox").value(0);
        $("#NumPasadas_MaRev").data("kendoNumericTextBox").value(0);
        $("#NumArea_MaRev").data("kendoNumericTextBox").value(0);
        $("#NumResolucionDPI_MaRev").val(0);
        $("#NumLineajeLPI_MaRev").val(0);
        $("#NumPixeles_MaRev").val(0);
        $("#CmdIdUnidadArea_MaRev").val("");
        $("#CmbSedas_MaRev").val("");
        $("#CmbTipoEmulsion_MaRev").val("");
        $("#TxtLetra_MaRev").val("");
        xEstado = null;
        $("#TxtNombreEstado").val("");
    }

    $("#gridFormulas").data("kendoGrid").dataSource.read();

};
var fn_EditClose = function () {
    $("#gridFormulas").data("kendoGrid").dataSource.read().then(function () {
        $("#gridFormulasMP").data("kendoGrid").dataSource.read();
    });

};

var fn_ShowAjus = function () {
    $("#gridFormulasAjusMP").data("kendoGrid").dataSource.read().then(function () {
        //fn_getEstado($("#gridFormulas").data("kendoGrid")) === 'CREADA' ? fn_getIdMotivo($("#gridFormulas").data("kendoGrid")) !== null ? Grid_HabilitaToolbar($("#gridFormulasAjusMP"), true, true, true) : Grid_HabilitaToolbar($("#gridFormulasAjusMP"), false, false, false) : Grid_HabilitaToolbar($("#gridFormulasAjusMP"), false, false, false);
        fn_getEstado($("#gridFormulas").data("kendoGrid")) === 'CREADA' ?  Grid_HabilitaToolbar($("#gridFormulasAjusMP"), true, true, true)  : Grid_HabilitaToolbar($("#gridFormulasAjusMP"), false, false, false);
    });
};


var fn_gridFormulas = function (gd) {

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
        edit: function(e) {
            KdoHideCampoPopup(e.container, "Fecha");
            KdoHideCampoPopup(e.container, "MasaEntregada");
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
            if (e.model.Estado !== "CREADA") {
                KdoNumerictextboxEnable($('[name="CIELAB_L"]'), false);
                KdoNumerictextboxEnable($('[name="CIELAB_A"]'), false);
                KdoNumerictextboxEnable($('[name="CIELAB_B"]'), false);
                KdoNumerictextboxEnable($('[name="CIELAB_DELTAE"]'), false);
            } else {
                Grid_Focus(e, "CIELAB_L");
            }
      
        },
        columns: [
            { field: "IdFormula", title: "Código. Formula", hidden: true  },
            { field: "IdSeteo", title: "Código. IdSeteo", hidden: true  },
            { field: "IdEstacion", title: "N° Estacion", hidden: true },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "MasaEntregada", title: "Masa Entregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}"},
            { field: "MasaDevuelta", title: "Masa Devuelta", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}"},
            { field: "C2", title: "Masa Total", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}" },
            { field: "IdMotivo", title: "Motivo", hidden:true },
            { field: "CIELAB_L", title: "CIELAB L", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "CIELAB_A", title: "CIELAB A", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "CIELAB_B", title: "CIELAB B", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "CIELAB_DELTAE", title: "CIELAB &Delta;E", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "Nombre", title: "Nombre Motivo" },
            { field: "Estado", title: "Estado", hidden: true  },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            {
                command: {
                    name: "cambiarEstado",
                    iconClass: "TS-icon-ARROW",
                    text: "",                    
                    click: function (e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                        var lstId = {
                            IdFormula: dataItem.IdFormula
                        };
                        Fn_VistaCambioEstadoVisualizar("TintasFormulaciones", dataItem.Estado, TSM_Web_APi + "TintasFormulaciones/TintasFormulaciones_CambiarEstado", "", lstId);
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
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 250);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsFormulas);
    var srow2 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow2);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow2);
        fn_consultarFormulaDet(gd);
    });
};

var fn_gridMateriaPrima = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + vidForm; },
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
                id: "IdFormula",
                fields: {
                    IdFormula: {
                        type: "number"
                    },
                    Item: {
                        type: "number"
                    },
                    IdArticulo: {
                        type: "string"

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
                    MasaFinal: {
                        type: "number"

                    },
                    PorcentajeFinal: {
                        type: "number"

                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        },
        aggregate: [
            { field: "PorcentajeInicial", aggregate: "sum" },
            { field: "MasaInicial", aggregate: "sum" },
            { field: "MasaFinal", aggregate: "sum" },
            { field: "PorcentajeFinal", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "Código. Formula", hidden: true },
            { field: "Item", title: "Item", hidden: true },
            { field: "IdArticulo", title: "Articulo"},
            { field: "Nombre", title: "Nombre"},
            { field: "MasaInicial", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Inicial: #: data.MasaInicial ? kendo.format('{0:n2}', sum) : 0 #", hidden: true},
            { field: "PorcentajeInicial", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeInicial ? kendo.format('{0:n2}', sum)*100: 0 # %", hidden: true },
            { field: "MasaFinal", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}', sum) : 0 #"},
            { field: "PorcentajeFinal", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si,250);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });
};
var  fn_consultarFormulaDet = function (gridcab) {
    vidForm = fn_getIdFormula(gridcab.data("kendoGrid"));
    $("#gridFormulasMP").data("kendoGrid").dataSource.read();
};

var fn_getIdFormula = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdFormula;

};

var fn_getIdMotivo = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdMotivo;

};

var fn_getEstado = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;

};

var fn_Ajuste = function () {
    kendo.ui.progress($(document.body), true);
        $.ajax({
            url: TSM_Web_APi + "TintasFormulaciones/Ajustar/" + maq[0].IdSeteo + "/" + xidEstacion + "/" + kdoNumericGetValue($("#NumCntIni_Recibida")) + "/" + (KdoRbGetValue($("#rbAjusteLimpio"))===true ? "1" : "0") + "/" + KdoCmbGetValue($("#CmbMotivoAjus")),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ id: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridFormulas").data("kendoGrid").dataSource.read();
                kendo.ui.progress($(document.body), false);
                $("#MbtnAjuste").data("kendoDialog").close();
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
            }
        });
};

var fn_gridAjustePrima = function (gd) {

    var dsAjusMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (data) { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + fn_getIdFormula($("#gridFormulas").data("kendoGrid")); },
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
                            return fn_getIdFormula($("#gridFormulas").data("kendoGrid"));
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
                    Masatotal: { type: "number"}

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
            if ((e.type === "create" || e.type === "update" || e.type === "destroy") && e.response) e.sender.read();
            Grid_requestEnd(e);
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
            $('[name="PorcentajeInicial"]').data("kendoNumericTextBox").enable(false);
            $('[name="MasaInicial"]').data("kendoNumericTextBox").enable(false);
            $('[name="MasaFinal"]').data("kendoNumericTextBox").enable(false);
            $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").enable(false);
            $('[name="Masatotal"]').data("kendoNumericTextBox").enable(false);

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
                multicolumncombobox.select(function (dataItem) { return dataItem.IdArticulo === e.model.IdArticulo;});
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
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrima(xIdQuimica);
                }
            },
            { field: "Nombre", title: "Nombre" },
            { field: "MasaInicial", title: "Masa Inicial", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Inicial: #: data.MasaInicial ? kendo.format('{0:n2}',sum ): 0 #"},
            { field: "PorcentajeInicial", title: "Porcentaje Inicial", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeInicial ? kendo.format('{0:n2}',sum)*100: 0 # %" },
            { field: "MasaAgregada", title: "Masa Agregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Agregada: #: data.MasaAgregada ? kendo.format('{0:n2}',sum) : 0 #"},
            { field: "PorcentajeAgregado", title: "% Agregado", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeAgregado ? kendo.format('{0:n2}',sum)*100: 0 # %" },
            { field: "MasaFinal", title: "Masa Final", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}',sum ): 0 #"},
            { field: "PorcentajeFinal", title: "% Final", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
            { field: "Masatotal", title: "Masatotal", menu: false, hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 500);
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
var fn_GuardarFormulaEst = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($(".k-dialog"), true);
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
            $("#gridFormulas").data("kendoGrid").dataSource.read();
            kendo.ui.progress($(document.body), false);
            $("#MbtnAjuste").data("kendoDialog").close();
            RequestEndMsg(data, "Post");
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
        },
        error: function (data) {
            kendo.ui.progress($(".k-dialog"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GetSeteoMaquinasEstacionesMarcos = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetVistabyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    return result;
};

fn_PWList.push(fn_VistaEstacionFormulas);
fn_PWConfList.push(fn_VistaEstacionFormulasDocuReady);