var Permisos;

$(document).ready(function () {
    var EsCambioReg = false;
    var VidCP = 0;

    var DivCarousel = $("#Div_Carousel");
    DivCarousel.append(Fn_Carouselcontent());
    Fn_LeerImagenes($("#Mycarousel"), "", null);

    KdoButton($("#btnGuardar"), "save", "Guardar");
    KdoButton($("#btnImprimir"), "print", "Imprimir Reporte de Cotización");
    KdoButton($("#btnImpRentabilidad"), "print", "Imprimir Reporte de Rentabilidad");
    KdoButton($("#btnGeneraCotiPro"), "gear"," Generar cotización por programa");
    KdoButton($("#btnCambioEstado"),"check","Cambio de estado");

    $("#btnGeneraCotiPro").data("kendoButton").enable(false)
    $("#btnCambioEstado").data("kendoButton").enable(false)
    $("#btnGuardar").data("kendoButton").enable(false)

    $("#splitter").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: true, size: "50%", max: "95%", min: "20%", },
            { collapsible: true, size: "50%" }
        ]

    });
    
    $(window).resize(function () {
        resizeSplitter($(window).height())
    });

    resizeSplitter = function (height) {

        var splElement = $("#splitter"),
            splObject = splElement.data("kendoSplitter");
        splElement.css({ height: height - height * 0.27 });
        setTimeout(function () {
            splObject.resize(true);
        }, 300);

    };

    $(".sidebar").hover(function () {
        resizeSplitter($(window).height());
    });

    resizeSplitter($(window).height());

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

    $("#TxtComentarios").kendoEditor({
        encoded: false,
        tools: []
    });


    fn_deshabilitar();
    //#region PRGRANMACION DEL GRID citizacion
    var DsRD = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlCTP,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlCTP + "/" + datos.IdCotizacionPrograma; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCTP + "/" + datos.IdCotizacionPrograma; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlCTP,
                dataType: "json",
                type: "POST",
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
            if (e.type === "destroy") {
                if ($("#gridCotizacion").data("kendoGrid").dataSource.total() == 0) {
                    // limpiar etapas del proceso
                    CargarEtapasProceso(0);
                    Fn_LimpiarCotizacionSimulaciones();
                    Fn_getLimpiar();
                    Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, false);
                    $("#btnCambioEstado").data("kendoButton").enable(false);
                    $("#gridCotizacionDetalle").data("kendoGrid").dataSource.data([]);
                    $("#btnGeneraCotiPro").data("kendoButton").enable(false); 
                    $("#btnGuardar").data("kendoButton").enable(false); 

                }
            }
        
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacionPrograma",
                fields: {
                    IdCotizacionPrograma: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdPrograma: {
                        type: "string",
                        validation: {
                            required: true,
                        }
                    },
                    Nombre: { type: "string" },
                    IdCliente: {
                        type: "string",
                        validation: {
                            required: true,
                        }
                    },
                    NoCuenta: { type: "string" },
                    Nombre1: { type: "string" },
                    FechaCotizacion: { type: "date" },
                    FechaAprobacion: { type: "date" },
                    FechaCreacion: {
                        type: "date",
                        validation: {
                            required: true,
                        }
                    },
                    IdUsuario: { type: "string", defaultValue: getUser() },
                    Comentarios: { type: "string" },
                    Estado: { type: "string", defaultValue: "EDICION" },
                    Contacto: { type: "string" },
                    CotizaPromedio: { type: "bool" },
                    PrecioPreliminar: { type: "bool", defaultValue: 1 },
                    FinalCotizacion: { type: "bool" },
                    PrecioDesarrolloMuestra: { type: "string" },
                    CondicionPagoDesarrollo: { type: "string" },
                    PrecioVendedorCTL: { type: "string" },
                    CondicionPagoCTL: { type: "string" },
                    Transporte: { type: "string" },
                    CondicionPagoProduccion: { type: "string" },
                    NumeroSeteos: { type: "string" },
                    CotizacionVigencia: { type: "string" },
                    PorcentajeSegundos: { type: "string" },
                    Nombre2: { type: "string" },
                    PrecioSetupAdicional: { type: "string" },
                    PrecioAdicionalColorTela: { type: "string" },
                    TerminosPago: { type: "string" },
                    ExcesoSetup: { type: "string" },
                    PrecioSetup: { type: "string" },
                    RepeticionesDesarrollo: { type: "string" },
                    RepeticionesCTL: { type: "string" }
                }
            }
        }
    });
     
    $("#gridCotizacion").kendoGrid({
        autoBind: false,
        edit: function (e) {
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NoCuenta]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NoCuenta]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaCotizacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FechaCotizacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaAprobacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FechaAprobacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NoDocumento]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NoDocumento]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuario]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUsuario]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Estado]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Estado]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdCotizacionPrograma]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdCotizacionPrograma]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Contacto]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Contacto]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Comentarios]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Comentarios]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=CotizaPromedio]").parent("div .k-edit-label").hide();
            e.container.find("label[for=CotizaPromedio]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FinalCotizacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FinalCotizacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PrecioPreliminar]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PrecioPreliminar]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PrecioDesarrolloMuestra]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PrecioDesarrolloMuestra]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=CondicionPagoDesarrollo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=CondicionPagoDesarrollo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PrecioVendedorCTL]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PrecioVendedorCTL]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Transporte]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Transporte]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=CondicionPagoProduccion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=CondicionPagoProduccion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NumeroSeteos]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NumeroSeteos]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=CotizacionVigencia]").parent("div .k-edit-label").hide();
            e.container.find("label[for=CotizacionVigencia]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PorcentajeSegundos]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PorcentajeSegundos]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=CondicionPagoCTL]").parent("div .k-edit-label").hide();
            e.container.find("label[for=CondicionPagoCTL]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre2]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre2]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PrecioSetupAdicional]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PrecioSetupAdicional]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PrecioAdicionalColorTela]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PrecioAdicionalColorTela]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=TerminosPago]").parent("div .k-edit-label").hide();
            e.container.find("label[for=TerminosPago]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=ExcesoSetup]").parent("div .k-edit-label").hide();
            e.container.find("label[for=ExcesoSetup]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=PrecioSetup]").parent("div .k-edit-label").hide();
            e.container.find("label[for=PrecioSetup]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=RepeticionesDesarrollo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=RepeticionesDesarrollo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=RepeticionesCTL]").parent("div .k-edit-label").hide();
            e.container.find("label[for=RepeticionesCTL]").parent().next("div .k-edit-field").hide();

            $('[name="FechaCreacion"]').data("kendoDatePicker").enable(false);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCotizacionPrograma", title: "Cod. Cotización",hidden:true},
            {  field: "NoDocumento", title: "No Cotización"},
            { field: "FechaCotizacion", title: "Fecha Cotización", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "FechaCreacion", title: "Fecha Creación", format: "{0: dd/MM/yyyy}"},
            { field: "IdCliente", title: "Cliente", editor: Grid_Combox, values: ["IdCliente", "Nombre", UrlCli, "", "Seleccione....", "required", "", "requerido"], hidden: true },
            { field: "NoCuenta", title: "NoCuenta" },
            { field: "Nombre1", title: "Nombre del Cliente"},
            { field: "IdPrograma", title: "Programa", editor: Grid_Combox, values: ["IdPrograma", "Nombre", UrlPro, "", "Seleccione....", "required", "IdCliente", "requerido"], hidden: true },
            { field: "Nombre", title: "Nombre del Programa " },
            { field: "FechaAprobacion", title: "Fecha Aprobación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "IdUsuario", title: "Usuario",  hidden: true },
            { field: "Estado", title: "Estado" ,hidden:true},
            { field: "Nombre2", title: "Estado cotización"},
            { field: "Contacto", title: "Contacto", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "CotizaPromedio", title: "Cotiza Promedio", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "CotizaPromedio"); }, hidden: true },
            { field: "PrecioPreliminar", title: "Precio Preliminar", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "PrecioPreliminar"); }, hidden: true},
            { field: "FinalCotizacion", title: "Final Cotizacion", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "FinalCotizacion"); }, hidden: true },
            { field: "PrecioDesarrolloMuestra", title: "Precio Desarrollo Muestra $", hidden: true},
            { field: "CondicionPagoDesarrollo", title: "Condicion Pago Desarrollo", hidden: true},
            { field: "PrecioVendedorCTL", title: "Precio Vendedor CTLs", hidden: true},
            { field: "CondicionPagoCTL", title: "Condicion Pago CTL", hidden: true},
            { field: "Transporte", title: "Transporte", hidden: true},
            { field: "CondicionPagoProduccion", title: "Condicion Pago Produccion", hidden: true},
            { field: "NumeroSeteos", title: "Numero Seteos",hidden: true},
            { field: "CotizacionVigencia", title: "Cotizacion Vigencia", hidden: true},
            { field: "PorcentajeSegundos", title: "Porcentaje Segundos", hidden: true },
            { field: "PrecioSetupAdicional", title: "Numero Seteos", hidden: true },
            { field: "PrecioAdicionalColorTela", title: "Numero Seteos", hidden: true },
            { field: "TerminosPago", title: "Numero Seteos", hidden: true },
            { field: "ExcesoSetup", title: "Numero Seteos", hidden: true },
            { field: "PrecioSetup", title: "Numero Seteos", hidden: true },
            { field: "RepeticionesDesarrollo", title: "Numero Seteos", hidden: true },
            { field: "RepeticionesCTL", title: "Numero Seteos", hidden: true }
        ]
    });
    
    SetGrid($("#gridCotizacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCotizacion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCotizacion").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCotizacion").data("kendoGrid"), DsRD);

    var selectedRows = [];
    $("#gridCotizacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCotizacion"), selectedRows);
    });

    $("#gridCotizacion").data("kendoGrid").bind("change", function (e) {
        if (EsCambioReg === false) {
            kendo.ui.progress($("#splitter"), true);
            Fn_getCotizacion($("#gridCotizacion").data("kendoGrid"));
            VidCP = fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid"));
            // limpiar etapas del proceso
            CargarEtapasProceso(0);
            Fn_LimpiarCotizacionSimulaciones();
            Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, false);
            $("#btnGeneraCotiPro").data("kendoButton").enable(fn_SNProcesar(true));
            $("#btnCambioEstado").data("kendoButton").enable(false);
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.data([]);
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
            $("#gridCotizacion").data("kendoGrid").dataSource.total() == 0 ? $("#btnGeneraCotiPro").data("kendoButton").enable(false) : $("#btnGeneraCotiPro").data("kendoButton").enable(fn_SNProcesar(true));
        }
        Grid_SelectRow($("#gridCotizacion"), selectedRows);
        kendo.ui.progress($("#splitter"), false);
    });
    //#endregion FIN PROGRAMACIÓN DEL GRID cotizacion 

    //#region condiciones de pago 
    $("#frmCondiciones").submit (function (event) {        
        var UrlCotizacion = UrlCTP + "/" + fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid")).toString();

        if (Valid.validate()) {
            Fn_GuardarCondiciones(UrlCotizacion);
        }

        return false;
    });

    function Fn_GuardarCondiciones(UrlCotizacion) {
        try {
            kendo.ui.progress($("#splitter"), true);
            var XFecha = kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
            var XType = "Put";
            $.ajax({
                url: UrlCotizacion,//
                type: XType,
                dataType: "json",
                data: JSON.stringify({
                    IdCotizacionPrograma: fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid")),
                    NoDocumento: fn_getNoDocumento($("#gridCotizacion").data("kendoGrid")),
                    IdPrograma: fn_getIdPrograma($("#gridCotizacion").data("kendoGrid")),
                    FechaCotizacion: fn_getFechaCotizacion($("#gridCotizacion").data("kendoGrid")),
                    FechaAprobacion: fn_getFechaAprobacion($("#gridCotizacion").data("kendoGrid")),
                    FechaCreacion: fn_getFechaCreacion($("#gridCotizacion").data("kendoGrid")),
                    IdUsuario: fn_getIdUsuario($("#gridCotizacion").data("kendoGrid")),
                    Comentarios: $("#TxtComentarios").data("kendoEditor").value(),
                    Estado: fn_getEstado($("#gridCotizacion").data("kendoGrid")),
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
                    CotizacionVigencia: $("#TxtCotizacionVigencia").val(),
                    PorcentajeSegundos: $("#TxtPorcentajeSegundos").val(),
                    PrecioSetupAdicional: $("#txtPrecioSetupAdicional").val(),
                    PrecioAdicionalColorTela: $("#txtPrecioAdicionalColorTela").val(),
                    TerminosPago: $("#txtTerminosPago").val(),
                    ExcesoSetup: $("#txtExcesoSetup").val(),
                    PrecioSetup: $("#txtPrecioSetup").val(),
                    RepeticionesDesarrollo: $("#txtRepeticionesDesarrollo").val(),
                    RepeticionesCTL: $("#txtRepeticionesCTL").val()
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    EsCambioReg = true;
                    var uid = $("#gridCotizacion").data("kendoGrid").dataSource.get(data[0].IdCotizacionPrograma).uid;
                    Fn_UpdFilaGrid($("#gridCotizacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']"), data[0]);
                    EsCambioReg = false;
                    RequestEndMsg(data, XType);
                    kendo.ui.progress($("#splitter"), false);
                },
                error: function (data) {
                    EsCambioReg = false;
                    kendo.ui.progress($("#splitter"), false);
                    ErrorMsg(data);
                    $("#Nombre").focus().select();
                }
            });
        }
        catch (e) {
            kendo.ui.progress($("#splitter"), false);
            ErrorMsg(e);
        }
    }

    function Fn_UpdFilaGrid(g, data) {
        try {
            g.set("Comentarios", data.Comentarios);
            g.set("CondicionPagoCTL", data.CondicionPagoCTL);
            g.set("CondicionPagoDesarrollo", data.CondicionPagoDesarrollo);
            g.set("CondicionPagoProduccion", data.CondicionPagoProduccion);
            g.set("Contacto", data.Contacto);
            g.set("CotizaPromedio", data.CotizaPromedio);
            g.set("CotizacionVigencia", data.CotizacionVigencia);
            g.set("NumeroSeteos", data.NumeroSeteos);
            g.set("PorcentajeSegundos", data.PorcentajeSegundos);
            g.set("PrecioDesarrolloMuestra", data.PrecioDesarrolloMuestra);
            g.set("PrecioPreliminar", data.PrecioPreliminar);
            g.set("Transporte", data.Transporte);
            g.set("FinalCotizacion", data.FinalCotizacion);
            $(".k-dirty-cell", $("#gridCotizacion")).removeClass("k-dirty-cell");
            $(".k-dirty", $("#gridCotizacion")).remove();
        }
        catch (e) {
            ErrorMsg(e);
        }
    }
    //#endregion condicion de pago

    //#region PRGRANMACION DEL grid detalle
    var DsCT = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlCTPS + "/GetbyIdCotizacionPrograma/" + VidCP; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCTPS + "/" + datos.IdCotizacionProgramaSimulacion; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function(e){
            Grid_requestEnd;
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.total() == 0 ? $("#btnCambioEstado").data("kendoButton").enable(false) : $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
            if ($("#gridCotizacionDetalle").data("kendoGrid").dataSource.total() == 0 && e.type === "destroy") {
                Fn_LimpiarCotizacionSimulaciones();
                // limpiar etapas del proceso
                CargarEtapasProceso(0);
            }
        },
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacionProgramaSimulacion",
                fields: {
                    IdCotizacionProgramaSimulacion:  { type: "number" },
                    IdCotizacionPrograma:  { type: "number" },
                    IdSimulacionRentabilidad:  { type: "number" },
                    CostoMP:  { type: "number" },
                    CostoMOD: { type: "number" },
                    CostoPrimo:  { type: "number" },
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
                    NoRequerimiento: { type: "string" },
                    IdAnalisisDiseno: { type: "number" },
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
            { field: "IdCotizacionProgramaSimulacion", title: "Código Cotización programa sim" ,hidden: true},
            { field: "IdSimulacionRentabilidad", title: "cod. Simulación Rentabilidad", hidden: true },
            { field: "CostoMP", title: "Costo MP", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoMOD", title: "Costo MOD", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoPrimo", title: "Costo Primo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoFabril", title: "Costo Fabril", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoProduccion", title: "Costo Producción", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoOperacion", title: "Costo Operación", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CostoTotal", title: "Costo Total", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PorcUtilidadConsiderada", title: "PorcUtilidad Considerada",editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4], format: "{0:P2}", hidden: true },
            { field: "UtilidadDolares", title: "Utilidad Dolares", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioCliente", title: "Precio Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioTS", title: "Precio Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioVenta", title: "Precio Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "CantidadTecnicas", title: "Cantidad Técnicas", editor: Grid_ColNumeric, values: ["", "0", "9999999999999999", "#", 0], format: "{0:#}", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad Piezas", editor: Grid_ColNumeric, values: ["", "0", "9999999999999999", "#", 0], format: "{0:#}", hidden: true },
            { field: "ProductividadHora", title: "Productividad Hora", editor: Grid_ColNumeric, values: ["", "0", "9999999999999999", "#", 0], format: "{0:#}", hidden: true },
            {  field: "NoDocumento", title: "No Simualcion",template: function (data) {
                return "<button class='btn btn-link nav-link' onclick='Fn_VerSimulacion(" + data["IdSimulacion"] + ")' >" + data["NoDocumento"] + "</button>";
                } 
            },
            { field: "CostoUnitario", title: "Costo Unitario", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionCliente", title: "Facturacion Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionTS", title: "Facturacion Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionVenta", title: "Facturacion Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            {
                field: "NoRequerimiento", title: "No Requerimiento", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["NoRequerimiento"] + "</button>";
                }
            },
            { field: "IdAnalisisDiseno", title: "Cod. AnalisisDiseno", hidden: true },
            { field: "NombreArte", title: "Nombre Diseño" },
            { field: "EstiloDiseno", title: "Estilo de Diseño" },
            { field: "NumeroDiseno", title: "Estilo de Diseño" },
            { field: "IdArte", title: "Cóigo Arte", hidden: true },
            { field: "IdRequerimiento", title: "Código Requerimiento", hidden: true },
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
        Fn_getCotizacionSimulaciones($("#gridCotizacionDetalle").data("kendoGrid"));
        Fn_GetCotizacionesProgramasValores();
        fn_getEstado($("#gridCotizacion").data("kendoGrid")) !== "EDICION" ? $("#btnGeneraCotiPro").data("kendoButton").enable(false) : $("#btnGeneraCotiPro").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
        fn_getEstado($("#gridCotizacion").data("kendoGrid")) !== "EDICION" ? Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, false) : Grid_HabilitaToolbar($("#gridCotizacionDetalle"), false, false, Permisos.SNBorrar ? true : false);
        fn_getEstado($("#gridCotizacion").data("kendoGrid")) !== "EDICION" ? $("#btnGuardar").data("kendoButton").enable(false) : $("#btnGuardar").data("kendoButton").enable(fn_SNAgregar(true));
        Grid_SelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);
        
    });

    //#endregion FIN PROGRAMACIÓN DEL GRID SIMULACIÓN

    //#region generar procesar simulacion
    $("#btnGeneraCotiPro").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("¿Esta seguro de cargar las simulaciones aprobadas para la cotización N°: " + fn_getNoDocumento($("#gridCotizacion").data("kendoGrid")) + "?", function () { return ProcesoPrecotizar() });

    });

    function ProcesoPrecotizar() {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlCTPS + "/Procesar/" + fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid")),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }
    //#endregion fin generar simulacion

    //#region  Resumen
    function Fn_GetCotizacionesProgramasValores() {

        Url = UrlCTP + "/GetCotizacionesProgramasValores/" + fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid"));
        kendo.ui.progress($("#splitter"), true);
        $("#Mycarousel").children().remove();
        $.ajax({
            url: Url,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta.length > 0) {
                    $("#TxtPrecioPon").data("kendoNumericTextBox").value(respuesta[0].PrecioPonCliente);
                    $("#TxtPrecioPonTechno").data("kendoNumericTextBox").value(respuesta[0].PrecioPonTs);
                    $("#TxtDiferencia").data("kendoNumericTextBox").value(respuesta[0].PrecioPonCliente - respuesta[0].PrecioPonTs);
                    $("#TxtMargenNetoP").data("kendoNumericTextBox").value(respuesta[0].MargenPrecioCli);
                    $("#TxtMargenNetoPTech").data("kendoNumericTextBox").value(respuesta[0].MargenPrecioTS);
                    $("#TxtFacturaTotalCliente").data("kendoNumericTextBox").value(respuesta[0].FacturaTotalCliente);
                    $("#TxtFacturaTotalTS").data("kendoNumericTextBox").value(respuesta[0].FacturaTotalTS);
                    $("#TxtFacturaTotalVenta").data("kendoNumericTextBox").value(respuesta[0].FacturaTotalVenta);

                } else {
                    $("#TxtPrecioPon").data("kendoNumericTextBox").value(0);
                    $("#TxtPrecioPonTechno").data("kendoNumericTextBox").value(0);
                    $("#TxtDiferencia").data("kendoNumericTextBox").value(0);
                    $("#TxtMargenNetoP").data("kendoNumericTextBox").value(0);
                    $("#TxtMargenNetoPTech").data("kendoNumericTextBox").value(0);
                    $("#TxtFacturaTotalCliente").data("kendoNumericTextBox").value("0");
                    $("#TxtFacturaTotalTS").data("kendoNumericTextBox").value("0");
                    $("#TxtFacturaTotalVenta").data("kendoNumericTextBox").value("0");
                }
                kendo.ui.progress($("#splitter"), false);
                getAdjun();
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data)
            }
        });
    }


    //#endregion Resumen

    //#region arte adjuntos
    function getAdjun() {
        //LLena Splitter de imagenes
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAAdj + "/GetByArte/" + fn_getIdArte($("#gridCotizacionDetalle").data("kendoGrid")),
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + fn_getNoRequerimiento($("#gridCotizacionDetalle").data("kendoGrid")) + "", respuesta);
                kendo.ui.progress($("#splitter"), false);

            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
            }
        });
    }
    //#endregion 

    //#Region procesar nuev aimulacion
    function Confirmar() {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlCTP + "/UpdCotizacionesConfirmar/" + fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid")),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridCotizacion").data("kendoGrid").dataSource.read();
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }

    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"))

    $("#btnCambioEstado").click(function () {
         event.preventDefault();
        Fn_VistaCambioEstadoMostrar("CotizacionesProgramas", fn_getEstado($("#gridCotizacion").data("kendoGrid")), UrlCTP + "/CotizacionesProgramas_CambiarEstado", "Sp_CambioEstado", fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid")));
    })


    //#region vista consulta estados

    Fn_VistaConsultaRequerimientoEstados($("#vConsultaEstados"));

    //#endregion fin vista consulta estados

    //#region vista consulta simulacion

    Fn_VistaConsultaSimulacion($("#vConsultaSimulaciones"));

    //#endregion fin vista consulta simulacion

    //#endregion

});

//#region  Metodos Generales 

function onCloseCambioEstado(e) {
    $("#gridCotizacion").data("kendoGrid").dataSource.read();
}

/**
 * muestra vista modal esados.
 * @param {number} IdRequerimiento PK del requerimiento de desarrollo
 */
function Fn_VerEstados(IdRequerimiento) {
    Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null", IdRequerimiento);
}
/**
 * Muestra vista modal consulta simulaciones
 * @param {any} IdSimulacion
 */
function Fn_VerSimulacion(IdSimulacion) {
    Fn_VistaConsultaSimulacionGet($("#vConsultaSimulaciones"), IdSimulacion);
}


function Fn_getCotizacion(g) {
    var elemento = g.dataItem(g.select());
    $("#TxtNombre").val(elemento.Nombre);
    $("#TxtContacto").val(elemento.Contacto);
    $("#TxtComentarios").data("kendoEditor").value(elemento.Comentarios);
    $('#chkCotizaPromedio').prop('checked', elemento.CotizaPromedio);
    $('#chkPrecioPreliminar').prop('checked', elemento.PrecioPreliminar);
    $('#chkFinalCotizacion').prop('checked', elemento.FinalCotizacion);
    $("#TxtPrecioDesarrolloMuestra").val(elemento.PrecioDesarrolloMuestra);
    $("#TxtCondicionPagoDesarrollo").val(elemento.CondicionPagoDesarrollo);
    $("#TxtPrecioVendedorCTL").val(elemento.PrecioVendedorCTL);
    $("#TxtCondicionPagoCTL").val(elemento.CondicionPagoCTL);
    $("#TxtTransporte").val(elemento.Transporte);
    $("#TxtCondicionPagoProduccion").val(elemento.CondicionPagoProduccion);
    $("#TxtNumeroSeteos").val(elemento.NumeroSeteos);
    $("#TxtCotizacionVigencia").val(elemento.CotizacionVigencia);
    $("#TxtPorcentajeSegundos").val(elemento.PorcentajeSegundos);
    $("#txtPrecioSetupAdicional").val(elemento.PrecioSetupAdicional);
    $("#txtPrecioAdicionalColorTela").val(elemento.PrecioAdicionalColorTela);
    $("#txtTerminosPago").val(elemento.TerminosPago);
    $("#txtExcesoSetup").val(elemento.ExcesoSetup);
    $("#txtPrecioSetup").val(elemento.PrecioSetup);
    $("#txtRepeticionesDesarrollo").val(elemento.RepeticionesDesarrollo);
    $("#txtRepeticionesCTL").val(elemento.RepeticionesCTL);
}

function Fn_getLimpiar(g) {    
    $("#TxtNombre").val("");
    $("#TxtContacto").val("");
    $("#TxtComentarios").data("kendoEditor").value("");
    $('#chkCotizaPromedio').prop('checked', 0);
    $('#chkPrecioPreliminar').prop('checked', 1);
    $('#chkFinalCotizacion').prop('checked',0);
    $("#TxtPrecioDesarrolloMuestra").val("0");
    $("#TxtCondicionPagoDesarrollo").val("0");
    $("#TxtPrecioVendedorCTL").val("0");
    $("#TxtCondicionPagoCTL").val("0");
    $("#TxtTransporte").val("");
    $("#TxtCondicionPagoProduccion").val("0");
    $("#TxtNumeroSeteos").val("");
    $("#TxtCotizacionVigencia").val("0");
    $("#TxtPorcentajeSegundos").val("0");
    $("#txtPrecioSetupAdicional").val("");
    $("#txtPrecioAdicionalColorTela").val("");
    $("#txtTerminosPago").val("");
    $("#txtExcesoSetup").val("");
    $("#txtPrecioSetup").val("");
    $("#txtRepeticionesDesarrollo").val("");
    $("#txtRepeticionesCTL").val("");
}

function fn_deshabilitar() {
    $("#TxtCntDocena").data("kendoNumericTextBox").enable(false);
    $("#TxtCntPiezas").data("kendoNumericTextBox").enable(false);
    $("#TxtCM").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMOD").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFra").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOper").data("kendoNumericTextBox").enable(false);
    $("#TxtFacturacionVenta").data("kendoNumericTextBox").enable(false);
    $("#TxtFacturaTech").data("kendoNumericTextBox").enable(false);
    $("#TxtFacturaClie").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoTotal").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioPon").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioPonTechno").data("kendoNumericTextBox").enable(false);
    $("#TxtDiferencia").data("kendoNumericTextBox").enable(false);
    $("#TxtMargenNetoP").data("kendoNumericTextBox").enable(false);
    $("#TxtMargenNetoPTech").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimo").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccion").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").enable(false);
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioCliente").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioTS").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioVenta").data("kendoNumericTextBox").enable(false);
    $("#TxtFacturaTotalCliente").data("kendoNumericTextBox").enable(false);
    $("#TxtFacturaTotalTS").data("kendoNumericTextBox").enable(false);
    $("#TxtFacturaTotalVenta").data("kendoNumericTextBox").enable(false);
}

function Fn_getCotizacionSimulaciones(g) {
    var elemento = g.dataItem(g.select());
    $("#TxtCntDocena").data("kendoNumericTextBox").value(elemento.CantidadPiezas /12 );
    $("#TxtCntPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
    $("#TxtCM").data("kendoNumericTextBox").value(elemento.CostoMP);
    $("#TxtCostoMOD").data("kendoNumericTextBox").value(elemento.CostoMOD);
    $("#TxtCostoFra").data("kendoNumericTextBox").value(elemento.CostoFabril);
    $("#TxtCostoOper").data("kendoNumericTextBox").value(elemento.CostoOperacion);
    $("#TxtFacturacionVenta").data("kendoNumericTextBox").value(elemento.FacturacionVenta);
    $("#TxtFacturaTech").data("kendoNumericTextBox").value(elemento.FacturacionTS);
    $("#TxtFacturaClie").data("kendoNumericTextBox").value(elemento.FacturacionCliente);
    $("#TxtCostoTotal").data("kendoNumericTextBox").value(elemento.CostoTotal);
    $("#TxtCostoPrimo").data("kendoNumericTextBox").value(elemento.CostoPrimo);
    $("#TxtCostoProduccion").data("kendoNumericTextBox").value(elemento.CostoProduccion);
    $("#TxtCostoUnitario").data("kendoNumericTextBox").value(elemento.CostoUnitario);

    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(elemento.PorcUtilidadConsiderada);
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(elemento.UtilidadDolares);
    $("#TxtPrecioCliente").data("kendoNumericTextBox").value(elemento.PrecioCliente);
    $("#TxtPrecioTS").data("kendoNumericTextBox").value(elemento.PrecioTS);
    $("#TxtPrecioVenta").data("kendoNumericTextBox").value(elemento.PrecioVenta);
    CargarEtapasProceso(elemento.IdRequerimiento);
}

function Fn_LimpiarCotizacionSimulaciones(g) {    
    $("#TxtCntDocena").data("kendoNumericTextBox").value("0");
    $("#TxtCntPiezas").data("kendoNumericTextBox").value("0");
    $("#TxtCM").data("kendoNumericTextBox").value("0");
    $("#TxtCostoMOD").data("kendoNumericTextBox").value("0");
    $("#TxtCostoFra").data("kendoNumericTextBox").value("0");
    $("#TxtCostoOper").data("kendoNumericTextBox").value("0");
    $("#TxtFacturacionVenta").data("kendoNumericTextBox").value("0");
    $("#TxtFacturaTech").data("kendoNumericTextBox").value("0");
    $("#TxtFacturaClie").data("kendoNumericTextBox").value("0");
    $("#TxtCostoTotal").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioPon").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioPonTechno").data("kendoNumericTextBox").value("0");
    $("#TxtDiferencia").data("kendoNumericTextBox").value("0");
    $("#TxtMargenNetoP").data("kendoNumericTextBox").value("0");
    $("#TxtMargenNetoPTech").data("kendoNumericTextBox").value("0");
    $("#TxtCostoPrimo").data("kendoNumericTextBox").value("0");
    $("#TxtCostoProduccion").data("kendoNumericTextBox").value("0");
    $("#TxtCostoUnitario").data("kendoNumericTextBox").value("0");
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value("0");
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioCliente").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioTS").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioVenta").data("kendoNumericTextBox").value("0");
    $("#TxtFacturaTotalCliente").data("kendoNumericTextBox").value("0");
    $("#TxtFacturaTotalTS").data("kendoNumericTextBox").value("0");
    $("#TxtFacturaTotalVenta").data("kendoNumericTextBox").value("0");
}

function fn_getIdCotizacionPrograma(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdCotizacionPrograma;
}

function fn_getNoDocumento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento;
}

function fn_getIdPrograma(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdPrograma;
}

function fn_getFechaCotizacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.FechaCotizacion;
}

function fn_getFechaAprobacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.FechaAprobacion;
}
function fn_getFechaCreacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.FechaCreacion;
}
function fn_getIdUsuario(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdUsuario;
}
function fn_getEstado(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;
}
function fn_getNoRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoRequerimiento;
}
function fn_getIdArte(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;
}

var fPermisos = function (datos) {
    Permisos = datos;
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

var fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};

var fn_UrlReporteCotizacion = function () {
    let action_src = "/Reportes/" + "CotizacionesProgramas/Cotizacion/" + fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid"));
    let form = $("#frmImprimirCot");
    form.get(0).setAttribute("action", action_src);
};

var fn_UrlReporteRentabilidad = function () {
    let action_src = "/Reportes/" + "CotizacionesProgramas/Rentabilidad/" + fn_getIdCotizacionPrograma($("#gridCotizacion").data("kendoGrid"));
    let form = $("#frmImprimirRen");
    form.get(0).setAttribute("action", action_src);
};
//#endregion Metodos generales