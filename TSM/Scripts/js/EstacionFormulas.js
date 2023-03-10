var fn_VistaEstacionFormulasDocuReady = function () {
    KdoButton($("#btnAddMForE"), "check", "Guardar");
    KdoButton($("#btnAddMFAjus"), "check", "Guardar");
    KdoButton($("#btnAddMFAjuste"), "gear", "Ajuste");
    //KdoButton($("#btnAddMFEditar"), "edit", "Editar");
    KdoButton($("#btnAddMFAHistori"), "search", "Formulas Historica");
    //KdoButton($("#btnAcepAjuste"), "check", "Aceptar");
    //kdoRbSetValue($("#rbAjuste"), true);
    KdoButton($("#btnCambioEstado"), "gear", "Cambio de estado");
    KdoButton($("#btnAutRet"), "warning","Retenciones");
    //informacion de revelado

    $("#EscurridorDureza_MaRev").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

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

    KdoNumerictextboxEnable($("#EscurridorDureza_MaRev"), false);
    KdoNumerictextboxEnable($("#NumPasadas_MaRev"), false);
    KdoNumerictextboxEnable($("#NumCapilar_MaRev"), false);
    KdoNumerictextboxEnable($("#NumArea_MaRev"), false);
    KdoNumerictextboxEnable($("#NumResolucionDPI_MaRev"), false);
    KdoNumerictextboxEnable($("#NumLineajeLPI_MaRev"), false);
    KdoNumerictextboxEnable($("#NumPixeles_MaRev"), false);
    KdoButtonEnable($("#btnAutRet"), EtpSeguidor === true  ? false : true);

    TextBoxEnable($("#CmbTipoTinta_MaRev"), false);
    TextBoxEnable($("#CmbSistemaPigmento_MaRev"), false);
    TextBoxEnable($("#CmbBasePigmento_MaRev"), false);

    TextBoxEnable($("#CmbSedas_MaRev"), false);
    TextBoxEnable($("#TxtLetra_MaRev"), false);
    TextBoxEnable($("#CmdIdUnidadArea_MaRev"), false);

    TextBoxEnable($("#CmbTipoEmulsion_MaRev"), false);
    TextBoxEnable($("#TxtNombreEstado"), false);

    //$("#NumCntIni_Recibida").kendoNumericTextBox({
    //    min: 0.00,
    //    max: 99999999999999.99,
    //    format: "{0:n2}",
    //    restrictDecimals: false,
    //    decimals: 2,
    //    value: 0
    //});

    xidEstacion = 0;
    fn_GridEstaciones($("#gridEstacion"));
    fn_gridFormulas($("#gridFormulas"));
    fn_gridAjustePrima($("#gridFormulasMP"));

    //$("#MbtnAjuste").kendoDialog({
    //    height: "auto",
    //    width: "20%",
    //    title: "Crear ajuste",
    //    closable: true,
    //    modal: true,
    //    visible: false,
    //    maxHeight: 900
    //});

    $("#btnAddMFAjuste").bind("click", function () {
        //kdoNumericSetValue($("#NumCntIni_Recibida"), 0.00);
        //KdoCmbSetValue($("#CmbMotivoAjus"), "");
        //kdoRbSetValue($("#rbAjuste"), true);
        //$("#MbtnAjuste").data("kendoDialog").open().toFront();
        //$("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
        //frmNajus.hideMessages();
        fn_CrearNuevoAjusteFormulas("vCrearNuevoAjuste", maq[0].IdSeteo, xidEstacion, function () { return fn_focoFilaAjustada(); });
    });

    $("#btnAutRet").bind("click", function () {
        //validar si existen mas retenciones
        fn_CalcularRetencion(maq[0].IDOrdenTrabajo, 2, 1, false, function () { fn_AutorizarRetenciones("RetAut", maq[0].IDOrdenTrabajo, maq[0].IdEtapaProceso, maq[0].Item); });
        //AutRet: es el nombre del div en la vista elementoTrabajo

    });

    //let urtMo = TSM_Web_APi + "MotivosAjustesTintas";
    //Kendo_CmbFiltrarGrid($("#CmbMotivoAjus"), urtMo, "Nombre", "IdMotivo", "Seleccione un motivo de ajuste ....");

    //var frmNajus = $("#FrmNuevoAjuste").kendoValidator({
    //    rules: {
    //        vMtAjus: function (input) {
    //            if (input.is("[id='CmbMotivoAjus']")) {
    //                return $("#CmbMotivoAjus").data("kendoComboBox").selectedIndex >= 0;
    //            }
    //            return true;
    //        }
    //    },
    //    messages: {
    //        //vcnt: "Cantidad no mayor a 500",
    //        vMtAjus: "Requerido"
    //    }
    //}).data("kendoValidator");

    //$("#btnAcepAjuste").bind("click", function (e) {
    //    e.preventDefault();
    //    if (frmNajus.validate()) {
    //        fn_Ajuste();

    //    } else {
    //        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar la cantidad devuelta", "error");
    //    }

    //});

    //$("#rbAjusteLimpio").click(function () {
    //    kdoNumericSetValue($("#NumCntIni_Recibida"), 0.00);
    //    $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
    //    $('[for= "NumCntIni_Recibida"]').text("Cantidad Inicial:");
    //    frmNajus.hideMessages();
    //});

    //$("#rbAjuste").click(function () {
    //    KdoNumerictextboxEnable($("#NumCntIni_Recibida"), true);
    //    $("#NumCntIni_Recibida").data("kendoNumericTextBox").focus();
    //    $('[for= "NumCntIni_Recibida"]').text("Cantidad Recibida:");
    //    frmNajus.hideMessages();
    //});

    $("#btnAddMFAHistori").data("kendoButton").bind("click", function () {
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
         //ir a ElementoTrabajos.js y configurar la etapa para obtener la formula Metodos : "ObtenerFormula" y "SetValorBusqueda"
        fn_FormulaHistorica("FormulaHist");
    });

    $("#tsFormulas").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip").select(0);


    // carga vista para el cambio de estado
    // 1. configurar vista.
    //Fn_VistaCambioEstado($("#vCambioEstado"));
     // 2. boton cambio de estado.
    $("#btnCambioEstado").click(function () {
       
        var lstId = {
            IdSeteo: maq[0].IdSeteo,
            IdEstacion: xidEstacion
        };
        Fn_VistaCambioEstadoMostrar("SeteoMaquinasEstacionesMarcos", xEstado, TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/SeteoMaquinasEstacionesMarcos_CambiarEstado", "Sp_CambioEstado", lstId, undefined, function () { return fn_UpdAjusteMarcoGrilla(); });
    });

   
};

var fn_VistaEstacionFormulas = function () {
    InicioModalFor = 1;
    xIdSeteoMq = maq[0].IdSeteo;
    $("#tsFormulas").data("kendoTabStrip").select(0);
    TextBoxEnable($("#TxtOpcSelecFormulas"), false);
    TextBoxEnable($("#TxtNombreQuiForm"), false);
    TextBoxEnable($("#TxtNombreTipoTinta"), false);
    TextBoxReadOnly($("#TxtFormulaSugTint"), false);
    TextBoxReadOnly($("#txtArticuloSugerido_Tint"), false);
    $("#TxtOpcSelecFormulas").val($("#TxtOpcSelecFormulas").data("name"));
    $("#gridFormulas").data("kendoGrid").dataSource.data([]);
    $("#gridFormulasMP").data("kendoGrid").dataSource.data([]);
    var grid = $("#gridEstacion").data("kendoGrid");
    grid.dataSource.data([]);
    grid.dataSource.read().then(function () {
        var items = grid.items();
        items.each(function (idx, row) {
            var dataItem = grid.dataItem(row);
            if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelecFormulas").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
                grid.select(row);
            }
        });
    });

    KdoButtonEnable($("#btnAddMFAjuste"), vhb);
    KdoButtonEnable($("#btnAddMFAHistori"), vhb);
    KdoButtonEnable($("#btnCambioEstado"), vhb);
    KdoButtonEnable($("#btnAutRet"), vhb);
    vhb !== false ? $("#gridFormulas").data("kendoGrid").showColumn("cambiarEstado") : $("#gridFormulas").data("kendoGrid").hideColumn("cambiarEstado");
    vhb !== false ? Grid_HabilitaToolbar($("#gridFormulas"), false, Permisos.SNEditar, false) : Grid_HabilitaToolbar($("#gridFormulas"), false, false, false);

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
            { field: "IdFormula", title: "Código. Formula", hidden: true  },
            { field: "IdSeteo", title: "Código. IdSeteo", hidden: true  },
            { field: "IdEstacion", title: "N° Estacion", hidden: true },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "MasaEntregada", title: "Masa Entregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}"},
            { field: "MasaDevuelta", title: "Masa Devuelta", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}"},
            { field: "C2", title: "Masa Total", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}" },
            { field: "IdMotivo", title: "Motivo", hidden:true },
            { field: "CIELAB_L", title: "CIELAB L", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "CIELAB_A", title: "CIELAB A", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "CIELAB_B", title: "CIELAB B", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "CIELAB_DELTAE", title: "CIELAB &Delta;E", editor: Grid_ColNumeric, values: ["", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "Nombre", title: "Nombre Motivo" },
            { field: "Estado", title: "Estado", hidden: true  },
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
                        Fn_VistaCambioEstadoMostrar("TintasFormulaciones", dataItem.Estado, TSM_Web_APi + "TintasFormulaciones/TintasFormulaciones_CambiarEstado", "", dataItem.IdFormula, undefined, function () { return fn_UpdEstadoGrilla(); });
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
        fn_consultarFormulaDet();
    });
};

var fn_GridEstaciones = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteoTintas/" +xIdSeteoMq;  },
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
                    CodigoPantone: {
                        type: "string"
                    },
                    EstadoFormula: {
                        type: "string"
                    },
                    Comentario: {
                        type: "string"
                    },
                    AplicaTintas: {
                        type: "bool"
                    },
                    AplicaMarco: {
                        type: "bool"
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
            var grid = gd.data("kendoGrid");
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.Comentario !== '' ) {
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
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            { field: "CodigoPantone", title: "Pantone", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color", minResizableWidth: 100,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>' },
        
            { field: "IgualarColor", title: "Igualar a:", minResizableWidth: 120 },
            { field: "EstadoFormula", title: "Estado Formula", minResizableWidth: 120 },
            { field: "Comentario", title: "Comentario de Ajuste", minResizableWidth: 120 },
            { field: "EstadoAlerta", title: "EstadoAlerta", minResizableWidth: 120, hidden: true },
            { field: "AplicaTintas", title: "AplicaTintas", minResizableWidth: 50, hidden: true ,menu:false},
            { field: "AplicaMarco", title: "AplicaMarco", minResizableWidth: 50, hidden: true, menu: false}
            
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si,800);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
        fn_ConsultarFormula(gd.data("kendoGrid"));
        
    });
};
var  fn_consultarFormulaDet = function () {
  
    $("#gridFormulasMP").data("kendoGrid").dataSource.read().then(function () {
        fn_getEstado($("#gridFormulas").data("kendoGrid")) === 'CREADA' ? Grid_HabilitaToolbar($("#gridFormulasMP"), true, true, true) : Grid_HabilitaToolbar($("#gridFormulasMP"), false, false, false);

    });
// valida retenciones
    //calcular retenciones si existen
    fn_CalcularRetencion(maq[0].IDOrdenTrabajo, 2, 1, false);
    kendo.ui.progress($(document.activeElement), false);

};

var fn_ConsultarFormula = function (g) {
    var SelItem = g.dataItem(g.select());
    xidEstacion = SelItem === null ? 0 : SelItem.IdEstacion;
    Te = SelItem.IdTipoFormulacion;

    if ((InicioModalFor === 1 && Number(xidEstacion) === Number($("#TxtOpcSelecFormulas").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) || InicioModalFor === 0) {
        $("#gridFormulas").data("kendoGrid").dataSource.read().then(function () {
            let items = $("#gridFormulas").data("kendoGrid").items();
            items.each(function (idx, row) {
                var dataItem = $("#gridFormulas").data("kendoGrid").dataItem(row);
                if (dataItem["Estado"] === "VIGENTE") {
                    $("#gridFormulas").data("kendoGrid").select(row);
                }
            });
        });
        fn_GetDatosMarcoFormulacion(maq[0].IdSeteo, xidEstacion);
        fn_GetDatosSeteoMaquinasEstacionesMarcos(maq[0].IdSeteo, xidEstacion);
        $("#MEstacionFormulas").data("kendoWindow").title("TINTAS Y REVELADO ESTACIÓN #" + xidEstacion);
        InicioModalFor = 0;
    }
   
};

var fn_GetDatosSeteoMaquinasEstacionesMarcos = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#tsFormulas-2"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetVistabyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion,
        type: 'GET',
        success: function (setMaqMar) {
            if (setMaqMar !== null) {
                $("#NumCapilar_MaRev").data("kendoNumericTextBox").value(setMaqMar.Capilar);
                $("#EscurridorDureza_MaRev").data("kendoNumericTextBox").value(setMaqMar.Dureza);
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
            }
            else {
                $("#NumCapilar_MaRev").data("kendoNumericTextBox").value(0);
                $("#EscurridorDureza_MaRev").data("kendoNumericTextBox").value(0);
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
        },
        complete: function () {
            kendo.ui.progress($("#tsFormulas-2"), false);
        }
    });
};
var fn_GetDatosMarcoFormulacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#tsFormulas-2"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        type: 'GET',
        success: function (setFor) {
            if (setFor !== null) {
                switch (setFor.IdTipoFormulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        $("#TxtOpcSelecFormulas").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                        $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Color');
                        $("#TxtOpcSelecFormulas").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                        fn_TecnicasArticuloSugerido($("#txtArticuloSugerido_Tint"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        $("#TxtOpcSelecFormulas").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                        $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Técnica');
                        $("#TxtOpcSelecFormulas").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                        fn_TecnicasArticuloSugerido($("#txtArticuloSugerido_Tint"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
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
                QuimicaFormula = setFor.IdQuimica;

                $.ajax({
                    url: TSM_Web_APi + "TipoEstaciones/" + setFor.IdTipoEstacion,
                    type: 'GET',
                    success: function (data) {
                        KdoButtonEnable($("#btnCambioEstado"), data.UtilizaMarco);                        
                    }
                });

                $("#TxtNombreQuiForm").val(setFor.NomIdQuimica);
                $("#TxtNombreTipoTinta").val(setFor.NomIdTipoTinta);

            }
            else {
                $("#TxtFormulaSugTint").val("");
                $("#txtArticuloSugerido_Tint").val("");
                $("#CmbTipoTinta_MaRev").val("");
                $("#CmbSistemaPigmento_MaRev").val("");
                $("#CmbBasePigmento_MaRev").val("");
            }
        },
        complete: function () {
            kendo.ui.progress($("#tsFormulas-2"), false);
        }
    });
};
var fn_getIdFormula = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdFormula;

};
var fn_getIdMotivo = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdMotivo;

};
var fn_getIdEstacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdEstacion;

};
var fn_getEstado = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;

};
//var fn_Ajuste = function () {
//    kendo.ui.progress($(".k-window-content"), true);
//        $.ajax({
//            url: TSM_Web_APi + "TintasFormulaciones/Ajustar/" + maq[0].IdSeteo + "/" + xidEstacion + "/" + kdoNumericGetValue($("#NumCntIni_Recibida")) + "/" + (KdoRbGetValue($("#rbAjusteLimpio"))===true ? "1" : "0") + "/" + KdoCmbGetValue($("#CmbMotivoAjus")),
//            type: "Post",
//            dataType: "json",
//            data: JSON.stringify({ id: null }),
//            contentType: 'application/json; charset=utf-8',
//            success: function (data) {
//                kendo.ui.progress($(".k-window-content"), false);
//                RequestEndMsg(data, "Post");
//                let g = $("#gridFormulas").data("kendoGrid");
//                g.dataSource.read().then(function () {
//                    if (data[0] !== null) {
//                        var items = g.items();
//                        items.each(function (idx, row) {
//                            var dataItem = g.dataItem(row);
//                            if (dataItem[g.dataSource.options.schema.model.id] === Number(data[0].IdFormula)) {
//                                g.select(row);
//                            }
//                        });
//                    }
                   
//                });
//            },
//            error: function (data) {
//                kendo.ui.progress($(".k-window-content"), false);
//                ErrorMsg(data);
//            }
//        });
//};
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
            if ((e.type === "create" || e.type === "update" || e.type === "destroy") && e.response) {
                e.sender.read();
                fn_CalcularRetencion(maq[0].IDOrdenTrabajo, 2, 1, false);
                $("#gridFormulas").data("kendoGrid").dataSource.read();
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
            $('[name="PorcentajeInicial"]').data("kendoNumericTextBox").enable(fn_getMasaEntregada($("#gridFormulas").data("kendoGrid")) === fn_getMasaTotal($("#gridFormulas").data("kendoGrid")));
            $('[name="MasaInicial"]').data("kendoTextBox").enable(fn_getMasaEntregada($("#gridFormulas").data("kendoGrid")) === fn_getMasaTotal($("#gridFormulas").data("kendoGrid")));
            $('[name="PorcentajeAgregado"]').data("kendoNumericTextBox").enable(fn_getMasaEntregada($("#gridFormulas").data("kendoGrid")) !== fn_getMasaTotal($("#gridFormulas").data("kendoGrid")));
            $('[name="MasaAgregada"]').data("kendoTextBox").enable(fn_getMasaEntregada($("#gridFormulas").data("kendoGrid")) !== fn_getMasaTotal($("#gridFormulas").data("kendoGrid")));
            $('[name="MasaFinal"]').data("kendoNumericTextBox").enable(false);
            $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").enable(false);
            $('[name="Masatotal"]').data("kendoNumericTextBox").enable(false);

            $('[name="MasaInicial"]').on("change", function (e) {
                $('[name="MasaInicial"]').trigger("changeCalcular", this);

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
                $('[name="MasaAgregada"]').trigger("changeCalcular", this);
                let xMasaInicial = $('[name="MasaInicial"]').data("kendoTextBox").value();
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
                let xMasaAgre = $('[name="MasaFinal"]').data("kendoNumericTextBox").value() - $('[name="MasaInicial"]').data("kendoTextBox").value();

                $('[name="MasaAgregada"]').data("kendoTextBox").value(xMasaAgre);
                $('[name="MasaAgregada"]').data("kendoTextBox").trigger("change");
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
                    if (CumpleOEKOTEX === false) {
                        $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrima(QuimicaFormula);
                    }
                    else {
                        $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrimaOEKOTEX(QuimicaFormula);
                    }
                   
                }
            },
            { field: "Nombre", title: "Nombre" },
            { field: "MasaInicial", title: "Masa Inicial", editor: Grid_ColNumericCalc, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Inicial: #: data.MasaInicial ? kendo.format('{0:n2}',sum ): 0 #"},
            { field: "PorcentajeInicial", title: "Porcentaje Inicial", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeInicial ? kendo.format('{0:n2}',sum)*100: 0 # %" },
            { field: "MasaAgregada", title: "Masa Agregada", editor: Grid_ColNumericCalc, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Agregada: #: data.MasaAgregada ? kendo.format('{0:n2}',sum) : 0 #"},
            { field: "PorcentajeAgregado", title: "% Agregado", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeAgregado ? kendo.format('{0:n2}',sum)*100: 0 # %" },
            { field: "MasaFinal", title: "Masa Final", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}',sum ): 0 #"},
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
var fn_GuardarFormulaEst = function (xIdBrazo, xCodigoColor, _MasaEntregada) {
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
            CodigoColor: xCodigoColor,
            MasaEntregada: _MasaEntregada
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(".k-window-content"), false);
            RequestEndMsg(data, "Post");
            let g = $("#gridFormulas").data("kendoGrid");
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

let Fn_UpdGridEstacion_Formula = function (g, estado) {
    g.set("EstadoFormula", estado);
    LimpiaMarcaCelda_Formula();
    //if (estado === "FORMULA VIGENTE") {
    //    g.set("EstadoAlerta", "FINALIZADA");
    //}
    //LimpiaMarcaCelda_Formula();
};

let LimpiaMarcaCelda_Formula = function () {
    $(".k-dirty-cell", $("#gridEstacion")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridEstacion")).remove();
};

let fn_UpdEstadoGrilla = function () {
    // como esta funcion es Async =false es valido colocar este codigo
    let ge = $("#gridEstacion").data("kendoGrid");
    var uid = ge.dataSource.get(xidEstacion).uid;
    Fn_UpdGridEstacion_Formula(ge.dataItem("tr[data-uid='" + uid + "']"), KdoCmbGetText($("#cmbEstados")));
    $("tr[data-uid= '" + uid + "']").removeAttr("style");

    return true;
};

let fn_UpdAjusteMarcoGrilla = function () {
    // como esta funcion es Async =false es valido colocar este codigo
    let ge = $("#gridEstacion").data("kendoGrid");
    var uid = ge.dataSource.get(xidEstacion).uid;
    Fn_UpdGridEstacion_AjusteMarco(ge.dataItem("tr[data-uid='" + uid + "']"), KdoCmbGetText($("#cmbEstados")), uid);


    return true;
};


let Fn_UpdGridEstacion_AjusteMarco = function (g, estado, uid) {
    if (estado === "TERMINADO") {
        g.set("EstadoAlerta", "FINALIZADA");
        LimpiaMarcaCelda_Formula();
        $("tr[data-uid= '" + uid + "']").removeAttr("style"); 
    }

};

fn_PWList.push(fn_VistaEstacionFormulas);
fn_PWConfList.push(fn_VistaEstacionFormulasDocuReady);

let fn_getMasaEntregada = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.MasaEntregada;
};

let fn_getMasaTotal = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.C2;
};

var fn_focoFilaAjustada = function () {
    let g = $("#gridFormulas").data("kendoGrid");
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