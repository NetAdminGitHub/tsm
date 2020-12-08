var Permisos;
var xCliente = 0;

$(document).ready(function () {
    $("#ModalAcuerdos").kendoDialog({
        height: "auto",
        width: "30%",
        maxHeight: "400 px",
        title: "Cargar Acuerdos Comerciales",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCargar Plantilla', primary: true, action: function () { return fn_CargarPlantilla(); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
        ],
        close: function (e) {
            KdoCmbSetValue($("#CmbIdAcuerdo"), "");
        }
    });

    var DivCarousel = $("#Div_Carousel");
    DivCarousel.append(Fn_Carouselcontent());
    Fn_LeerImagenes($("#Mycarousel"), "", null);

    KdoButton($("#btnGuardar"), "save", "Guardar");
    KdoButton($("#btnPlantillas"), "track-changes-accept", "Cargar Plantilla");
    KdoButton($("#btnImprimir"), "print", "Imprimir Reporte de Cotización");
    KdoButton($("#btnImpRentabilidad"), "print", "Imprimir Reporte de Rentabilidad");
    KdoButton($("#btnGeneraCotiPro"), "gear", " Generar cotización por programa");
    KdoButton($("#btnCambioEstado"), "check", "Cambio de estado");
    KdoButton($("#btnIrCoti"), "hyperlink-open-sm", "Ir a Simulaciones");
    KdoButtonEnable($("#btnGeneraCotiPro"), vEstCoti !== "EDICION" ? false: true);
    KdoButtonEnable($("#btnCambioEstado"), vEstCoti !== "EDICION" ? false : fn_SNCambiarEstados(true));
    KdoButtonEnable($("#btnGuardar"), vEstCoti !== "EDICION" ? false : fn_SNAgregar(true));    

    var Valid = $("#frmCondiciones").kendoValidator(
        {
            ContactoRules: {
                Mayor0: function (input) {
                    if (input.is("[name='Contacto']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                TransporteRules: function (input) {
                    if (input.is("[name='Transporte']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                NumeroSeteosRules: function (input) {
                    if (input.is("[name='Transporte']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },

                messages: {
                    ContactoRules: "Longitud máxima del campo es 200",
                    TransporteRules: "Longitud máxima del campo es 200",
                    NumeroSeteosRules: "Longitud máxima del campo es 200",
                    required: "Requerido"
                }
            }
        }
    ).data("kendoValidator");

    $("#TabCotizacion").kendoTabStrip({
        tabPosition: "left",
        animation: { open: { effects: "fadeIn" } }
    });
    $("#TabCotizacionDet").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });
    $("#TxtCntDocena").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtCntPiezas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        min: 0
    });
    $("#TxtCM").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoMOD").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoPrimo").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoProduccion").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoFra").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoOper").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtFacturacionVenta").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtFacturaTech").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtFacturaClie").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoTotal").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtPrecioPon").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtPrecioPonTechno").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtDiferencia").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtMargenNetoP").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtMargenNetoPTech").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtPorcUtilidadConsiderada").kendoNumericTextBox({
        format: "P2",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtUtilidadDolares").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioCliente").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioTS").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioVenta").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtFacturaTotalCliente").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtFacturaTotalTS").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtFacturaTotalVenta").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#txtCantidadDecimales").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 4,
        min: 0,
        max: 4
    });
    $("#TxtComentarios").kendoEditor({
        encoded: false,
        tools: []
    });

    fn_DeshabilitarCampos();

    //#region condiciones de pago 
    $("#frmCondiciones").submit(function (event) {
        if (Valid.validate()) {
            Fn_GuardarCondicionesCM();
        }
        return false;
    });


    //#endregion condicion de pago

    //#region PRGRANMACION DEL grid detalle
    var DsCT = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "CotizacionesMuestrasSimulaciones/GetbyIdCotizacion/" + vIdCoti; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CotizacionesMuestrasSimulaciones/" + datos.IdCotizacionSimulacion; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd;
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.total() === 0 ? $("#btnCambioEstado").data("kendoButton").enable(false) : $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
            if ($("#gridCotizacionDetalle").data("kendoGrid").dataSource.total() === 0 && e.type === "destroy") {
                Fn_LimpiarCotSimMue();
            }
        },
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacionSimulacion",
                fields: {
                    IdCotizacionSimulacion: { type: "number" },
                    IdCotizacion: { type: "number" },
                    IdSimulacionRentabilidad: { type: "number" },
                    CostoMP: { type: "number" },
                    CostoMOD: { type: "number" },
                    CostoPrimo: { type: "number" },
                    CostoFabril: { type: "number" },
                    CostoProduccion: { type: "number" },
                    CostoOperacion: { type: "number" },
                    CostoTotal: { type: "number" },
                    PorcUtilidadConsiderada: { type: "number" },
                    UtilidadDolares: { type: "number" },
                    PrecioCliente: { type: "number" },
                    PrecioTS: { type: "number" },
                    PrecioVenta: { type: "number" },
                    CantidadTecnicas: { type: "number" },
                    CantidadPiezas: { type: "number" },
                    ProductividadHora: { type: "number" },
                    NoDocumento: { type: "string" },
                    CostoUnitario: { type: "number" },
                    FacturacionCliente: { type: "number" },
                    FacturacionTS: { type: "number" },
                    FacturacionVenta: { type: "number" },
                    NoOT: { type: "string" },
                    NombreArte: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    IdArte: { type: "numeric" },
                    IdRequerimiento: { type: "numeric" },
                    IdSimulacion: { type: "numeric" }
                }
            }
        }
    });

    $("#gridCotizacionDetalle").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCotizacionProgramaSimulacion", title: "Código Cotización programa sim", hidden: true },
            { field: "IdSimulacionRentabilidad", title: "cod. Simulación Rentabilidad", hidden: true },
            { field: "CostoMP", title: "Costo MP", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoMOD", title: "Costo MOD", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoPrimo", title: "Costo Primo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoFabril", title: "Costo Fabril", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoProduccion", title: "Costo Producción", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoOperacion", title: "Costo Operación", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoTotal", title: "Costo Total", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PorcUtilidadConsiderada", title: "PorcUtilidad Considerada", editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4], format: "{0:P2}", hidden: true },
            { field: "UtilidadDolares", title: "Utilidad Dolares", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioCliente", title: "Precio Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioTS", title: "Precio Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioVenta", title: "Precio Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CantidadTecnicas", title: "Cantidad Técnicas", editor: Grid_ColNumeric, values: ["", "0", "9999999999999999", "#", 0], format: "{0:#}", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad Piezas", editor: Grid_ColNumeric, values: ["", "0", "9999999999999999", "#", 0], format: "{0:#}", hidden: true },
            { field: "ProductividadHora", title: "Productividad Hora", editor: Grid_ColNumeric, values: ["", "0", "9999999999999999", "#", 0], format: "{0:#}", hidden: true },
            { field: "NoDocumento", title: "No Simualcion"},
            { field: "CostoUnitario", title: "Costo Unitario", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionCliente", title: "Facturacion Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionTS", title: "Facturacion Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionVenta", title: "Facturacion Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "NoOT", title: "No Orden Trabajo"},
            { field: "IdAnalisisDiseno", title: "Cod. AnalisisDiseno", hidden: true },
            { field: "NombreArte", title: "Nombre Diseño" },
            { field: "EstiloDiseno", title: "Estilo de Diseño" },
            { field: "NumeroDiseno", title: "Estilo de Diseño" },
            { field: "IdArte", title: "Cóigo Arte", hidden: true },
            { field: "IdRequerimiento", title: "Código Requerimiento", hidden: true },
            { field: "NoRequerimiento", title: "No Requerimiento", hidden: true },
            { field: "IdSimulacion", title: "Código Simulación", hidden: true }
            
        ]
    });

    SetGrid($("#gridCotizacionDetalle").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCotizacionDetalle").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridCotizacionDetalle").data("kendoGrid"), false, fn_SNBorrar(true));
    Set_Grid_DataSource($("#gridCotizacionDetalle").data("kendoGrid"), DsCT);

    var selectedRowsCotiDet = [];
    $("#gridCotizacionDetalle").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);
    });

    $("#gridCotizacionDetalle").data("kendoGrid").bind("change", function (e) {
        Fn_getCotiSimu($("#gridCotizacionDetalle").data("kendoGrid"));
        Fn_GetCotiProValores();
        vEstCoti!== "EDICION" ? $("#btnGeneraCotiPro").data("kendoButton").enable(false) : $("#btnGeneraCotiPro").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
        vEstCoti !== "EDICION" ? Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, false) : Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, Permisos.SNBorrar ? true : false);
        vEstCoti !== "EDICION" ? $("#btnGuardar").data("kendoButton").enable(false) : $("#btnGuardar").data("kendoButton").enable(fn_SNAgregar(true));
        Grid_SelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);

    });

    //#endregion FIN PROGRAMACIÓN DEL GRID SIMULACIÓN

    //#region generar procesar simulacion
    $("#btnGeneraCotiPro").click(function (event) {
        event.preventDefault();
        fn_CotizarMuestra(); 
    });
    //#endregion fin generar simulacion

    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"));

    $("#btnCambioEstado").click(function () {
        event.preventDefault();
        Fn_VistaCambioEstadoMostrar("CotizacionesMuestras", vEstCoti, TSM_Web_APi + "CotizacionesMuestras/CotizacionesMuestras_CambiarEstado", "Sp_CambioEstado", vIdCoti);
    });

    Fn_getCotizacion();

    $("#btnIrCoti").click(function () {
        window.location.href = "/CotizacionesMuestras";
    });

});


let Fn_getCotizacion = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "CotizacionesMuestras/GetIdCotizacion/" + vIdCoti,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            $("#TxtNombre").val(respuesta === null ? "" : respuesta.NombrePro);
            $("#TxtContacto").val(respuesta === null ? "" : respuesta.Contacto);
            $("#TxtComentarios").data("kendoEditor").value(respuesta === null ? "" : respuesta.Comentarios);
            $('#chkCotizaPromedio').prop('checked', respuesta === null ? false : respuesta.CotizaPromedio);
            $('#chkPrecioPreliminar').prop('checked', respuesta === null ? false : respuesta.PrecioPreliminar);
            $('#chkFinalCotizacion').prop('checked', respuesta === null ? false : respuesta.FinalCotizacion);
            $("#TxtPrecioDesarrolloMuestra").val(respuesta === null ? "" : respuesta.PrecioDesarrolloMuestra);
            $("#TxtCondicionPagoDesarrollo").val(respuesta === null ? "" : respuesta.CondicionPagoDesarrollo);
            $("#TxtPrecioVendedorCTL").val(respuesta === null ? "" : respuesta.PrecioVendedorCTL);
            $("#TxtCondicionPagoCTL").val(respuesta === null ? "" : respuesta.CondicionPagoCTL);
            $("#TxtTransporte").val(respuesta === null ? "" : respuesta.Transporte);
            $("#TxtCondicionPagoProduccion").val(respuesta === null ? "" : respuesta.CondicionPagoProduccion);
            $("#TxtNumeroSeteos").val(respuesta === null ? "" : respuesta.NumeroSeteos);
            $("#TxtPorcentajeSegundos").val(respuesta === null ? "" : respuesta.PorcentajeSegundos);
            $("#txtPrecioSetupAdicional").val(respuesta === null ? "" : respuesta.PrecioSetupAdicional);
            $("#txtPrecioAdicionalColorTela").val(respuesta === null ? "" : respuesta.PrecioAdicionalColorTela);
            $("#txtTerminosPago").val(respuesta === null ? "" : respuesta.TerminosPago);
            $("#txtExcesoSetup").val(respuesta === null ? "" : respuesta.ExcesoSetup);
            $("#txtPrecioSetup").val(respuesta === null ? "" : respuesta.PrecioSetup);
            $("#txtRepeticionesDesarrollo").val(respuesta === null ? "" : respuesta.RepeticionesDesarrollo);
            $("#txtRepeticionesCTL").val(respuesta === null ? "" : respuesta.RepeticionesCTL);
            kdoNumericSetValue($("#txtCantidadDecimales"), respuesta === null ? 4 : respuesta.CantidadDecimales);
            xCliente = respuesta === null ? 0 : respuesta.IdCliente;
            Kendo_CmbFiltrarGrid($("#CmbIdAcuerdo"), TSM_Web_APi + "ClientesAcuerdosPlantillas/GetNombreByCliente/" + xCliente, "Nombre", "IdAcuerdo", "Seleccione...");
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);

        }
    });



};

let onCloseCambioEstado = function () {

    // obtener estado anterior despues de cerrar ventana cambio estado.
    let EstadoAnt = vEstCoti;

    $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
    $.ajax({
        url: TSM_Web_APi + "CotizacionesMuestras/GetIdCotizacion/" + vIdCoti,
        dataType: 'json',
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta.Estado !== EstadoAnt) {
                vEstCoti = respuesta.Estado;
                window.history.pushState('', '', "/CotizacionesMuestras/CotizacionesMuestrasDatos/" + vIdCoti.toString() + "/" + respuesta.Estado.toString());
            }
        }
    });
    vEstCoti !== "EDICION" ? KdoButtonEnable($("#btnGeneraCotiPro"), false) : KdoButtonEnable($("#btnGeneraCotiPro"), fn_SNProcesar(true));
    KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(true));
    vEstCoti !== "EDICION" ? Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, false) : Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, Permisos.SNBorrar ? true : false);
    vEstCoti !== "EDICION" ? KdoButtonEnable($("#btnGuardar"), false) : KdoButtonEnable($("#btnGuardar"), fn_SNAgregar(true));

};

let fn_DeshabilitarCampos = function () {
    KdoNumerictextboxEnable($("#TxtCntDocena"), false);
    KdoNumerictextboxEnable($("#TxtCntPiezas"), false);
    KdoNumerictextboxEnable($("#TxtCM"), false);
    KdoNumerictextboxEnable($("#TxtCostoMOD"), false);
    KdoNumerictextboxEnable($("#TxtCostoFra"), false);
    KdoNumerictextboxEnable($("#TxtCostoOper"), false);
    KdoNumerictextboxEnable($("#TxtFacturacionVenta"), false);
    KdoNumerictextboxEnable($("#TxtFacturaTech"), false);
    KdoNumerictextboxEnable($("#TxtFacturaClie"), false);
    KdoNumerictextboxEnable($("#TxtPrecioPon"), false);
    KdoNumerictextboxEnable($("#TxtPrecioPonTechno"), false);
    KdoNumerictextboxEnable($("#TxtDiferencia"), false);
    KdoNumerictextboxEnable($("#TxtMargenNetoP"), false);
    KdoNumerictextboxEnable($("#TxtMargenNetoPTech"), false);
    KdoNumerictextboxEnable($("#TxtCostoPrimo"), false);
    KdoNumerictextboxEnable($("#TxtCostoTotal"), false);
    KdoNumerictextboxEnable($("#TxtCostoProduccion"), false);
    KdoNumerictextboxEnable($("#TxtCostoUnitario"), false);
    KdoNumerictextboxEnable($("#TxtPorcUtilidadConsiderada"), false);
    KdoNumerictextboxEnable($("#TxtUtilidadDolares"), false);
    KdoNumerictextboxEnable($("#TxtPrecioCliente"), false);
    KdoNumerictextboxEnable($("#TxtPrecioTS"), false);
    KdoNumerictextboxEnable($("#TxtPrecioVenta"), false);
    KdoNumerictextboxEnable($("#TxtFacturaTotalCliente"), false);
    KdoNumerictextboxEnable($("#TxtFacturaTotalTS"), false);
    KdoNumerictextboxEnable($("#TxtFacturaTotalVenta"), false);

};

let Fn_GuardarCondicionesCM = function (UrlCotizacion) {
    try {
        kendo.ui.progress($(document.body), true);
        $.ajax({
            url: TSM_Web_APi + "CotizacionesMuestras/UpdCotizacionesMuestraCondiciones/" + vIdCoti,
            type: "put",
            dataType: "json",
            data: JSON.stringify({
                IdCotizacion: vIdCoti,
                Comentarios: $("#TxtComentarios").data("kendoEditor").value(),
                Contacto: $("#TxtContacto").val(),
                CotizaPromedio: $("#chkCotizaPromedio").is(':checked'),
                PrecioPreliminar: $("#chkPrecioPreliminar").is(':checked'),
                FinalCotizacion: $("#chkFinalCotizacion").is(':checked'),
                PrecioDesarrolloMuestra: $("#TxtPrecioDesarrolloMuestra").val(),
                CondicionPagoDesarrollo: $("#TxtCondicionPagoDesarrollo").val(),
                PrecioVendedorCTL: $("#TxtPrecioVendedorCTL").val(),
                CondicionPagoCTL: $("#TxtCondicionPagoCTL").val(),
                Transporte: $("#TxtTransporte").val(),
                CondicionPagoProduccion: $("#TxtCondicionPagoProduccion").val(),
                NumeroSeteos: $("#TxtNumeroSeteos").val(),
                CotizacionVigencia: "",
                PorcentajeSegundos: $("#TxtPorcentajeSegundos").val(),
                PrecioSetupAdicional: $("#txtPrecioSetupAdicional").val(),
                PrecioAdicionalColorTela: $("#txtPrecioAdicionalColorTela").val(),
                TerminosPago: $("#txtTerminosPago").val(),
                ExcesoSetup: $("#txtExcesoSetup").val(),
                PrecioSetup: $("#txtPrecioSetup").val(),
                RepeticionesDesarrollo: $("#txtRepeticionesDesarrollo").val(),
                RepeticionesCTL: $("#txtRepeticionesCTL").val(),
                CantidadDecimales: kdoNumericGetValue($("#txtCantidadDecimales"))
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                RequestEndMsg(data, "Put");
                kendo.ui.progress($(document.body), false);
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
                $("#Nombre").focus().select();
            }
        });
    }
    catch (e) {
        kendo.ui.progress($(document.body), false);
        ErrorMsg(e);
    }
};

let Fn_LimpiarCotSimMue = function () {
    kdoNumericSetValue($("#TxtCntDocena"), 0);
    kdoNumericSetValue($("#TxtCntPiezas"), 0);
    kdoNumericSetValue($("#TxtCM"), 0);
    kdoNumericSetValue($("#TxtCostoMOD"), 0);
    kdoNumericSetValue($("#TxtCostoFra"), 0);
    kdoNumericSetValue($("#TxtCostoOper"), 0);
    kdoNumericSetValue($("#TxtFacturacionVenta"), 0);
    kdoNumericSetValue($("#TxtFacturaTech"), 0);
    kdoNumericSetValue($("#TxtFacturaClie"), 0);
    kdoNumericSetValue($("#TxtCostoTotal"), 0);
    kdoNumericSetValue($("#TxtPrecioPon"), 0);
    kdoNumericSetValue($("#TxtPrecioPonTechno"), 0);
    kdoNumericSetValue($("#TxtDiferencia"), 0);
    kdoNumericSetValue($("#TxtMargenNetoP"), 0);
    kdoNumericSetValue($("#TxtMargenNetoPTech"), 0);
    kdoNumericSetValue($("#TxtCostoPrimo"), 0);
    kdoNumericSetValue($("#TxtCostoProduccion"), 0);
    kdoNumericSetValue($("#TxtCostoUnitario"), 0);
    kdoNumericSetValue($("#TxtPorcUtilidadConsiderada"), 0);
    kdoNumericSetValue($("#TxtUtilidadDolares"), 0);
    kdoNumericSetValue($("#TxtPrecioCliente"), 0);
    kdoNumericSetValue($("#TxtPrecioTS"), 0);
    kdoNumericSetValue($("#TxtPrecioVenta"), 0);
    kdoNumericSetValue($("#TxtFacturaTotalCliente"), 0);
    kdoNumericSetValue($("#TxtFacturaTotalTS"), 0);
    kdoNumericSetValue($("#TxtFacturaTotalVenta"), 0);
};

let fn_CotizarMuestra = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "CotizacionesMuestrasSimulaciones/Procesar/" + vIdCoti,
        type: "Post",
        dataType: "json",
        data: JSON.stringify({ IdAnalisisDiseno: null }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });
};

let Fn_getCotiSimu = function (g) {
    var elemento = g.dataItem(g.select());
    kdoNumericSetValue($("#TxtCntDocena"), elemento.CantidadPiezas / 12);
    kdoNumericSetValue($("#TxtCntPiezas"), elemento.CantidadPiezas);
    kdoNumericSetValue($("#TxtCM"), elemento.CostoMP);
    kdoNumericSetValue($("#TxtCostoMOD"), elemento.CostoMOD);
    kdoNumericSetValue($("#TxtCostoFra"), elemento.CostoFabril);
    kdoNumericSetValue($("#TxtCostoOper"), elemento.CostoOperacion);
    kdoNumericSetValue($("#TxtFacturacionVenta"), elemento.FacturacionVenta);
    kdoNumericSetValue($("#TxtFacturaTech"), elemento.FacturacionTS);
    kdoNumericSetValue($("#TxtFacturaClie"), elemento.FacturacionCliente);
    kdoNumericSetValue($("#TxtCostoTotal"), elemento.CostoTotal);
    kdoNumericSetValue($("#TxtCostoPrimo"), elemento.CostoPrimo);
    kdoNumericSetValue($("#TxtCostoProduccion"), elemento.CostoProduccion);
    kdoNumericSetValue($("#TxtCostoUnitario"), elemento.CostoUnitario);
    kdoNumericSetValue($("#TxtPorcUtilidadConsiderada"), elemento.PorcUtilidadConsiderada);
    kdoNumericSetValue($("#TxtUtilidadDolares"), elemento.UtilidadDolares);
    kdoNumericSetValue($("#TxtPrecioCliente"), elemento.PrecioCliente);
    kdoNumericSetValue($("#TxtPrecioTS"), elemento.PrecioTS);
    kdoNumericSetValue($("#TxtPrecioVenta"), elemento.PrecioVenta);
};

let Fn_GetCotiProValores = function () {
    kendo.ui.progress($(document.body), true);
    $("#Mycarousel").children().remove();
    $.ajax({
        url: TSM_Web_APi + "CotizacionesMuestras/GetCotizacionesMuestrasValores/" + vIdCoti,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta.length > 0) {
                kdoNumericSetValue($("#TxtPrecioPon"), respuesta[0].PrecioPonCliente);
                kdoNumericSetValue($("#TxtPrecioPonTechno"), respuesta[0].PrecioPonTs);
                kdoNumericSetValue($("#TxtDiferencia"), respuesta[0].PrecioPonCliente - respuesta[0].PrecioPonTs);
                kdoNumericSetValue($("#TxtMargenNetoP"), respuesta[0].MargenPrecioCli);
                kdoNumericSetValue($("#TxtMargenNetoPTech"), respuesta[0].MargenPrecioTS);
                kdoNumericSetValue($("#TxtFacturaTotalCliente"), respuesta[0].FacturaTotalCliente);
                kdoNumericSetValue($("#TxtFacturaTotalTS"), respuesta[0].FacturaTotalTS);
                kdoNumericSetValue($("#TxtFacturaTotalVenta"), respuesta[0].FacturaTotalVenta);

            } else {
                kdoNumericSetValue($("#TxtPrecioPon"), 0);
                kdoNumericSetValue($("#TxtPrecioPonTechno"), 0);
                kdoNumericSetValue($("#TxtDiferencia"), 0);
                kdoNumericSetValue($("#TxtMargenNetoP"), 0);
                kdoNumericSetValue($("#TxtMargenNetoPTech"), 0);
                kdoNumericSetValue($("#TxtFacturaTotalCliente"), "0");
                kdoNumericSetValue($("#TxtFacturaTotalTS"), "0");
                kdoNumericSetValue($("#TxtFacturaTotalTS"), 0);
                kdoNumericSetValue($("#TxtFacturaTotalVenta"), 0);
            }
            kendo.ui.progress($(document.body), false);
            fn_getAdjun();
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });
};

let fn_getAdjun = function () {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + fn_getIdArte($("#gridCotizacionDetalle").data("kendoGrid")),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + fn_getNoRequerimiento($("#gridCotizacionDetalle").data("kendoGrid")) + "", respuesta);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

$("#btnImprimir").click(function (e) {
    e.preventDefault();
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: window.location.origin + "/Reportes/crptCotizacionMuestrasPrograma/CotizacionesMuestras/ReporteCotizacionMuestrasPrograma/" + vIdCoti,
        dataType: 'json',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (respuesta) {
            let MiRpt = window.open(respuesta, "_blank");

            if (!MiRpt)
                $("#kendoNotificaciones").data("kendoNotification").show("Bloqueo de ventanas emergentes activado.<br /><br />Debe otorgar permisos para ver el reporte.", "error");

            kendo.ui.progress($(document.body), false);
        },
        error: function (e) {
            $("#kendoNotificaciones").data("kendoNotification").show(e, "error");
            kendo.ui.progress($(document.body), false);
        }
    });
});

$("#btnImpRentabilidad").click(function (e) {
    e.preventDefault();
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: window.location.origin + "/Reportes/crptCotizacionMuestrasRentabilidad/CotizacionesMuestras/ReporteCotizacionMuestrasRentabilidad/" + vIdCoti,
        dataType: 'json',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (respuesta) {
            let MiRpt = window.open(respuesta, "_blank");

            if (!MiRpt)
                $("#kendoNotificaciones").data("kendoNotification").show("Bloqueo de ventanas emergentes activado.<br /><br />Debe otorgar permisos para ver el reporte.", "error");

            kendo.ui.progress($(document.body), false);
        },
        error: function (e) {
            $("#kendoNotificaciones").data("kendoNotification").show(e, "error");
            kendo.ui.progress($(document.body), false);
        }
    });
});

$("#btnPlantillas").click(function (e) {
        e.preventDefault();
        $("#ModalAcuerdos").data("kendoDialog").title("Cargar Plantilla de Acuerdos Comerciales");
        $("#ModalAcuerdos").data("kendoDialog").open();
});

let ValidarPlantillas = $("#FrmCargarPlantilla").kendoValidator(
{
    rules: {
        MsgAcuerdo: function (input) {
            if (input.is("[name='CmbIdAcuerdo']")) {
                return $("#CmbIdAcuerdo").data("kendoComboBox").selectedIndex >= 0;
            }
            return true;
        }
    },
    messages: {
        MsgAcuerdo: "Requerido"
    }
}).data("kendoValidator");

let fn_CargarPlantilla = function () {
    let realizado = false;

    if (ValidarPlantillas.validate()) {
        // obtener indice de la etapa siguiente
        kendo.ui.progress($(document.body), true);
        $.ajax({
            url: TSM_Web_APi + "ClientesAcuerdosPlantillas/" + KdoCmbGetValue($("#CmbIdAcuerdo")).toString(),
            type: 'GET',
            success: function (respuesta) {
                $("#TxtContacto").val(respuesta === null ? "" : respuesta.Contacto);
                $("#TxtComentarios").data("kendoEditor").value(respuesta === null ? "" : respuesta.Comentarios);
                $('#chkCotizaPromedio').prop('checked', respuesta === null ? false : respuesta.CotizaPromedio);
                $('#chkPrecioPreliminar').prop('checked', respuesta === null ? false : respuesta.PrecioPreliminar);
                $('#chkFinalCotizacion').prop('checked', respuesta === null ? false : respuesta.FinalCotizacion);
                $("#TxtPrecioDesarrolloMuestra").val(respuesta === null ? "" : respuesta.PrecioDesarrolloMuestra);
                $("#TxtCondicionPagoDesarrollo").val(respuesta === null ? "" : respuesta.CondicionPagoDesarrollo);
                $("#TxtPrecioVendedorCTL").val(respuesta === null ? "" : respuesta.PrecioVendedorCTL);
                $("#TxtCondicionPagoCTL").val(respuesta === null ? "" : respuesta.CondicionPagoCTL);
                $("#TxtTransporte").val(respuesta === null ? "" : respuesta.Transporte);
                $("#TxtCondicionPagoProduccion").val(respuesta === null ? "" : respuesta.CondicionPagoProduccion);
                $("#TxtNumeroSeteos").val(respuesta === null ? "" : respuesta.NumeroSeteos);
                $("#TxtPorcentajeSegundos").val(respuesta === null ? "" : respuesta.PorcentajeSegundos);
                $("#txtPrecioSetupAdicional").val(respuesta === null ? "" : respuesta.PrecioSetupAdicional);
                $("#txtPrecioAdicionalColorTela").val(respuesta === null ? "" : respuesta.PrecioAdicionalColorTela);
                $("#txtTerminosPago").val(respuesta === null ? "" : respuesta.TerminosPago);
                $("#txtExcesoSetup").val(respuesta === null ? "" : respuesta.ExcesoSetup);
                $("#txtPrecioSetup").val(respuesta === null ? "" : respuesta.PrecioSetup);
                $("#txtRepeticionesDesarrollo").val(respuesta === null ? "" : respuesta.RepeticionesDesarrollo);
                $("#txtRepeticionesCTL").val(respuesta === null ? "" : respuesta.RepeticionesCTL);
                kdoNumericSetValue($("#txtCantidadDecimales"), respuesta === null ? "" : respuesta.CantidadDecimales);

                $("#frmCondiciones").submit();
                $("#ModalAcuerdos").data("kendoDialog").close();
                realizado = true;
            },
            error: function (data) {
                ErrorMsg(data);
                kendo.ui.progress($(document.body), false);
            },
            complete: function () {
                kendo.ui.progress($(document.body), false);
            }
        });
    } else {
        realizado = false;
    }
    return realizado;
};

let fn_getIdArte = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;
};


let fn_getIdSimulacionRentabilidad = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacionRentabilidad;
};

let fn_getNoRequerimiento = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoRequerimiento;
};

var fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};

var fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};

var fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};

var fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};

var fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};

var fPermisos = function (datos) {
    Permisos = datos;
};