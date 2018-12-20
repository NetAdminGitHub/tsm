
var Permisos;
var FactorCosto = 0.0000;
var vEspapel = true;
var vEstampado = true;
var RowAct = ""; // guarda la fila activa del grid.
$(document).ready(function () {

    Fn_VistaConsultaRequerimiento($('#vConsulta'))

//#region Inicializacion de controles Kendo
    $("#splitter").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: true, size: "50%", max: "95%", min: "20%", resizable: true },
            { collapsible: false, scrollable: true, size: "100%" }
        ]

    });

    $(window).resize(function () {
        resizeSplitter($(window).height())
    });

    resizeSplitter = function (height) {

        var splElement = $("#splitter"),
            splObject = splElement.data("kendoSplitter");
        splElement.css({ height: height - "220" + "px" });
        splObject.resize();

    };

    resizeSplitter($(window).height());


    $("#FrmSublimacion").children().addClass("k-state-disabled");
    $("#FrmPlantillas").children().addClass("k-state-disabled");
    $("#FrmSerigrafia").children().addClass("k-state-disabled");

    var IdSer = 0;
    var IdA = 0;
    var IdS = 0;
    var IdTec = 0;
    var IdClie = 0;
  
    var IdUnidadFC = "";
    var EST = null;

    var ValidSerigrafia = $("#FrmSerigrafia").kendoValidator({
        rules: {
            ResolucionRuler1: function (input) {
             
                if (input.is("[name='ResolucionDPI']")) {
                    return $("#ResolucionDPI").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            PixelesRuler1: function (input) {
        
                if (input.is("[name='PixelesTotal']")) {
                    return $("#PixelesTotal").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            AnchoRuler1: function (input) {
                
                if (input.is("[name='AnchoDiseno']")) {
                    return $("#AnchoDiseno").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            AltoRuler1: function (input) {
              
                if (input.is("[name='AltoDiseno']")) {
                    return $("#AltoDiseno").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            CntcolorSerRuler1: function (input) {
             
                if (input.is("[name='CntcolorSer']")) {
                    return $("#CntcolorSer").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            VelocidadMaquinaRuler1: function (input) {
              
                if (input.is("[name='TxtVelocidadMaquina']")) {
                    return $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            ComentarioRuler: function (input) {
                //only 'Tom' will be valid value for the username input
                if (input.is("[name='TxtComentarios']")) {
                    return $("#TxtComentarios").val().length <= 2000;
                }
                return true;
            },

            MsgIdUniArea: function (input) {
                if (input.is("[name='IdUniArea']")) {
                    return $("#IdUniArea").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },

            MsgIdUniDimension: function (input) {
                if (input.is("[name='IdUniDimension']")) {
                    return $("#IdUniDimension").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            MsgCmbIdUnidadVelocidad: function (input) {
                if (input.is("[name='CmbIdUnidadVelocidad']")) {
                    return $("#CmbIdUnidadVelocidad").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {

            ResolucionRuler1: "Debe ser mayor a 0",
            PixelesRuler1: "Debe ser mayor a 0",
            AnchoRuler1: "Debe ser mayor a 0",
            AltoRuler1: "Debe ser mayor a 0",
            CntcolorSerRuler1: "Debe ser mayor a 0",
            VelocidadMaquinaRuler1: "Debe ser mayor a 0",
            ComentarioRuler: "La longitud del campo no puede ser mayor a 2,000 ",
            required: "Requerido",
            MsgIdUniArea: "Requerido",
            MsgIdUniDimension: "Requerido",
            MsgCmbIdUnidadVelocidad: "Requerido"
           
        }
    }).data("kendoValidator");
    var ValidSubli = $("#FrmSublimacion").kendoValidator({
        rules: {
            AnchoSubRuler1: function (input) {
                
                if (input.is("[name='AnchoDisenoSub']")) {
                    return $("#AnchoDisenoSub").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            AltoSubRuler1: function (input) {
              
                if (input.is("[name='AltoDisenoSub']")) {
                    return $("#AltoDisenoSub").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            FactorDistribucionRuler1: function (input) {
               
                if (input.is("[name='TxtFactorDistribucion']")) {
                    return $("#TxtFactorDistribucion").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            MsgIdUnidadDimensionSub: function (input) {
                if (input.is("[name='IdUnidadDimensionSub']")) {
                    return $("#IdUnidadDimensionSub").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }

            
        },
        messages: {

            AnchoSubRuler1: "Debe ser mayor a 0",
            AltoSubRuler1: "Debe ser mayor a 0",
            FactorDistribucionRuler1:"Debe ser mayor a 0",
            required: "Requerido",
            MsgIdUnidadDimensionSub:"Requerido"

        }
    }).data("kendoValidator");
    var ValidPla = $("#FrmPlantillas").kendoValidator({
        rules: {
            AnchoPlaRuler1: function (input) {
            
                if (input.is("[name='AnchoDisenoPla']")) {
                    return $("#AnchoDisenoPla").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            AltoPlaRuler1: function (input) {
                
                if (input.is("[name='AltoDisenoPla']")) {
                    return $("#AltoDisenoPla").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            MsgcmbIdUnidadDimensionPla: function (input) {
                if (input.is("[name='cmbIdUnidadDimensionPla']")) {
                    return $("#cmbIdUnidadDimensionPla").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }

            
        },
        messages: {

            AnchoPlaRuler1: "Debe ser mayor a 0",
            AltoPlaRuler1: "Debe ser mayor a 0",
            VelocidadMaquinaPlaRuler1: "Debe ser mayor a 0",
            required: "Requerido",
            MsgcmbIdUnidadDimensionPla: "Requerido"

        }
    }).data("kendoValidator");
    var status = $(".status");

    $("#ResolucionSqr").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#ResolucionDPI").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#PixelesTotal").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#AreaTotal").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AltoDiseno").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AnchoDiseno").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AltoDisenoSub").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AnchoDisenoSub").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AnchoDisenoPla").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AltoDisenoPla").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#CntcolorSer").kendoNumericTextBox({
        min: 0,
        max: 12,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtVelocidadMaquina").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtVelocidadMaquinaPla").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtFactorDistribucion").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#Fecha").kendoDatePicker({format: "dd/MM/yyyy"});
    $("#Fecha").data("kendoDatePicker").enable(false);
    $("#FechaSub").kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: ["dd/MM/yyyy"] });
    $("#FechaSub").data("kendoDatePicker").enable(false);
    $("#ResolucionSqr").data("kendoNumericTextBox").enable(false);
    $("#AreaTotal").data("kendoNumericTextBox").enable(false);
    $("#FechaPla").kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: ["dd/MM/yyyy"] });
    $("#FechaPla").data("kendoDatePicker").enable(false);
    $("#GSerigrafia").kendoButton({ icon: "save" });
    $("#GuardarSubli").kendoButton({ icon: "save" });
    $("#btnGPlantilla").kendoButton({ icon: "save" });
    $("#btnCambioEstado").kendoButton({ icon: "gear" });
    $("#btnVerReq").kendoButton({ icon: "search" });

    $("#GSerigrafia").data("kendoButton").enable(fn_SNEditar(true));
    $("#GuardarSubli").data("kendoButton").enable(fn_SNEditar(true));
    $("#btnGPlantilla").data("kendoButton").enable(fn_SNEditar(true));
  

    $("#btnCambioEstado").data("kendoButton").enable(false);
    $("#btnVerReq").data("kendoButton").enable(false);

    Kendo_CmbFiltrarGrid($("#IdUniArea"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbIdUnidadDimensionPla"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdUniDimension"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un Servicio ....");
    Kendo_CmbFiltrarGrid($("#IdUnidadDimensionSub"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdUnidadConsumoTinta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdCliente"), UrlApiClient, "Nombre", "IdCliente", "Seleccione un Cliente ....");
    Kendo_CmbFiltrarGrid($("#CmbIdUnidadVelocidad"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbIdUnidadVelocidadPla"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");

    $("#IdServicio").data("kendoComboBox").input.focus();

    $("#CmbIdUnidadVelocidadPla").data("kendoComboBox").wrapper.hide();
    $("#TxtVelocidadMaquinaPla").data("kendoNumericTextBox").wrapper.hide();
//#endregion FIN Inicializacion de control Kendo

//#region PROGRAMACION GRID PRINCIPAL PARA EL ANALISIS DE DISEÑO
    var DsRD = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlAD + "/GetAnalisisDisenosRequerimientos/" + IdSer + "/" + EST + "/" + IdClie; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdRequerimiento",
                fields: {
                    IdAnalisisDiseno: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    IdPrograma: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdServicio: { type: "number" },
                    Nombre: { type: "string" },
                    IdUbicacion: { type: "number" },
                    Nombre1: { type: "string" },
                    NoDocumento1: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    CantidadPiezas: { type: "number" },
                    TallaPrincipal: { type: "string" },
                    Estado: { type: "string" },
                    Fecha: { type: "date" },
                    InstruccionesEspeciales: { type: "string" },
                    Nombre2: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    Fecha1: { type: "date" },
                    Estado1: { type: "string" },
                    IdArte: { type: "number" },
                    Nombre3: { type: "string" },
                    Nombre4: { type: "string" },
                    Nombre5: { type: "string" },
                    NoDocumento2: { type: "string"},
                    IdBase: { type: "string"}


                }
            }


        }

    });

    $("#ReqDes").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdAnalisisDiseno", title: "Cod. Analis Diseño" ,hidden:true},
            { field: "NoDocumento2", title: "No Analisis Diseño" },
            { field: "Fecha1", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            {
                field: "NoDocumento1", title: "No Requerimiento", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerRequerimientoConsulta(" + data["IdRequerimiento"] + ")' >" + data["NoDocumento1"] + "</button>";
                }
            },
            { field: "Fecha", title: "Fecha del requerimiento", format: "{0: dd/MM/yyyy}", hidden: true},
            { field: "Nombre2", title: "Nombre del diseño" },
            { field: "EstiloDiseno", title: "Estilo diseño" },
            { field: "NumeroDiseno", title: "Número diseño" },
            { field: "IdPrograma", title: "Código Programa", hidden: true },
            { field: "NoDocumento", title: "No Programa" },
            { field: "Nombre3", title: "Nombre del programa" },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "NoCuenta", title: "NoCuenta" },
            { field: "Nombre4", title: "Nombre del cliente" },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "Nombre", title: "Servicio", hidden: true },
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "Nombre1", title: "Ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicacion horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Talla principal", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Estado1", title: "Cod. Estado Analisis Diseño" ,hidden:true},
            {field: "Nombre5", title: "Estado Analisis Diseño", template: function (data) {
                return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["Nombre5"] + "</button>";
                }  },
            { field: "InstruccionesEspeciales", title: "Instrucciones especiales", hidden: true }

        ]

    });

    SetGrid($("#ReqDes").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#ReqDes").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#ReqDes").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#ReqDes").data("kendoGrid"), DsRD);


    function Consultar(IdServicio,IdCliente) {

        var VistaP1 = $("#SerigrafiaSlide");
        var VistaP2 = $("#SubliSlide");
        var VistaP3 = $("#PlantillaSlide");
        var VParSeri = $('#vistaParSeri');
        var VParSubli = $('#vistaParSubli');
        var VParPlan = $('#vistaParPlantilla');

        VistaP1.children().remove();
        VistaP2.children().remove();
        VistaP3.children().remove();
        VParSeri.children().remove();
        VParSubli.children().remove();
        VParPlan.children().remove();
        // limpiar etapas del proceso
        CargarEtapasProceso(0);

        //var dataItem = this.dataItem(e.item.index());
        //IdSer = dataItem.IdServicio;
        IdSer = IdServicio;
        IdClie = IdCliente;

        $("#GSeparacion").data("kendoGrid").dataSource.data([]);
        $("#GSublimacion").data("kendoGrid").dataSource.data([]);
        $("#gridPlantillas").data("kendoGrid").dataSource.data([]);
        Grid_HabilitaToolbar($("#GSeparacion"), false, false, false);
        Grid_HabilitaToolbar($("#GSublimacion"), false, false, false);
        Grid_HabilitaToolbar($("#gridPlantillas"), false, false, false);
        $("#FrmSerigrafia").children().addClass("k-state-disabled");
        $("#FrmSublimacion").children().addClass("k-state-disabled");
        $("#FrmPlantillas").children().addClass("k-state-disabled");

        $("#btnCambioEstado").data("kendoButton").enable(false);
        $("#btnVerReq").data("kendoButton").enable(false);
        LimpiarADSubli();
        LimpiarADSer();
        LimpiarADPla();

        IdClie === 0 ? $("#ReqDes").data("kendoGrid").showColumn("Nombre4") : $("#ReqDes").data("kendoGrid").hideColumn("Nombre4");

        $("#ReqDes").data("kendoGrid").dataSource.read();
        
        switch (IdSer) {
            case "1":
                $("#divSerigrafia").removeAttr("hidden", "hidden");
                $("#divSubli").attr("hidden", "hidden");
                $("#divPlan").attr("hidden", "hidden");
                VistaP1.append(Fn_Carouselcontent());
                VParSeri.append(hmlAdj);
                break;

            case "2":
                $("#divSubli").removeAttr("hidden", "hidden");
                $("#divSerigrafia").attr("hidden", "hidden");
                $("#divPlan").attr("hidden", "hidden");
                VistaP2.append(Fn_Carouselcontent());
                VParSubli.append(hmlAdj);
                break;

            case "3":
                $("#divSubli").attr("hidden", "hidden");
                $("#divSerigrafia").attr("hidden", "hidden");
                $("#divPlan").removeAttr("hidden", "hidden");
                VistaP3.append(Fn_Carouselcontent());
                VParPlan.append(hmlAdj);
                break;
        }
    }

    $("#IdServicio").data("kendoComboBox").bind("select", function (e) {
        event.preventDefault();
        if (e.item) {
            Consultar(this.dataItem(e.item.index()).IdServicio.toString(), Kendo_CmbGetvalue($("#IdCliente")));
        } else {
            Consultar(0, Kendo_CmbGetvalue($("#IdCliente")));
        }
        
    });

    $("#IdServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            Consultar(0, Kendo_CmbGetvalue($("#IdCliente")));
        }
    });

    $("#IdCliente").data("kendoComboBox").bind("select", function (e) {
        event.preventDefault();
        if (e.item) {
            Consultar(Kendo_CmbGetvalue($("#IdServicio")), this.dataItem(e.item.index()).IdCliente.toString());
        } else {
            Consultar(0, 0);
        }

    });

    $("#IdCliente").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            Consultar(Kendo_CmbGetvalue($("#IdServicio")), 0);
        }
    });
    var selectedRows = [];
    $("#ReqDes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#ReqDes"), selectedRows);
    });

    $("#ReqDes").data("kendoGrid").bind("change", function (e) {
        switch (IdSer) {
            case "1":
                var url = UrlAD + "/GetAnalisisDisenobyIdAnalisisDiseno/" + getIdAD($("#ReqDes").data("kendoGrid"));
                getAD(url);
                IdA = getIdAD($("#ReqDes").data("kendoGrid"));
                $("#GSeparacion").data("kendoGrid").dataSource.read();
                $('#ResolucionDPI').siblings('input:visible').focus();
             
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? Grid_HabilitaToolbar($("#GSeparacion"), false, false, false) : Grid_HabilitaToolbar($("#GSeparacion"), Permisos.SNAgregar, Permisos.SNEditar , Permisos.SNBorrar);
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? $("#FrmSerigrafia").children().addClass("k-state-disabled") : $("#FrmSerigrafia").children().removeClass("k-state-disabled");
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 ? $("#btnCambioEstado").data("kendoButton").enable(false):$("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
                break;
            case "2":
                var urlsub = UrlAD + "/GetAnalisisDisenobyIdAnalisisDiseno/" + getIdAD($("#ReqDes").data("kendoGrid"));
                getADSubli(urlsub);
                IdA = getIdAD($("#ReqDes").data("kendoGrid"));
                $("#GSublimacion").data("kendoGrid").dataSource.read();
                $('#AnchoDisenoSub').siblings('input:visible').focus();
                
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? Grid_HabilitaToolbar($("#GSublimacion"), false, false, false) : Grid_HabilitaToolbar($("#GSublimacion"), Permisos.SNAgregar , Permisos.SNEditar, Permisos.SNBorrar);
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? $("#FrmSublimacion").children().addClass("k-state-disabled") : $("#FrmSublimacion").children().removeClass("k-state-disabled");
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 ? $("#btnCambioEstado").data("kendoButton").enable(false) : $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
                break;
            case "3":
                var urlPla = UrlAD + "/GetAnalisisDisenobyIdAnalisisDiseno/" + getIdAD($("#ReqDes").data("kendoGrid"));
                getADPla(urlPla);
                IdA = getIdAD($("#ReqDes").data("kendoGrid"));
                $("#gridPlantillas").data("kendoGrid").dataSource.read();
                $('#AnchoDisenoPla').siblings('input:visible').focus();
          
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? Grid_HabilitaToolbar($("#gridPlantillas"), false, false, false) : Grid_HabilitaToolbar($("#gridPlantillas"), Permisos.SNAgregar , Permisos.SNEditar , Permisos.SNBorrar);
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? $("#FrmPlantillas").children().addClass("k-state-disabled") : $("#FrmPlantillas").children().removeClass("k-state-disabled");
                $("#ReqDes").data("kendoGrid").dataSource.total() == 0 ? $("#btnCambioEstado").data("kendoButton").enable(false) : $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
                break;
        }

        //$('#carouselExampleControls').carousel({
        //    interval: 0
        //});
        setAdjun();
        $("#ReqDes").data("kendoGrid").dataSource.total() == 0 || getEstadoAD($("#ReqDes").data("kendoGrid")) !== "EDICION" ? $("#myBtnAdjunto").data("kendoButton").enable(false) : $("#myBtnAdjunto").data("kendoButton").enable(true);
        $("#ReqDes").data("kendoGrid").dataSource.total() == 0 ? $("#btnVerReq").data("kendoButton").enable(false) : $("#btnVerReq").data("kendoButton").enable(true) ;
        var UrlAdjRD = UrlApiArteAdj + "/GetByArte/" + (getIdArteRD($("#ReqDes").data("kendoGrid")) == null ? 0 : getIdArteRD($("#ReqDes").data("kendoGrid")));
        getAdjRD(UrlAdjRD);
        CargarEtapasProceso(getIdRequerimientoRD($("#ReqDes").data("kendoGrid")));
        Grid_SelectRow($("#ReqDes"), selectedRows);
    });

    function getTamanos() {
        Url = UrlRD + "/GetTamanos/" + getIdRequerimientoRD($("#ReqDes").data("kendoGrid"));
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: Url,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                $("#CntTallas").val(respuesta)
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data)
            }
        });
    }

    $("#btnVerReq").click(function (event) {
        Fn_VistaConsultaRequerimientoGet($('#vConsulta'), getIdRequerimientoRD($("#ReqDes").data("kendoGrid")))
    });
 

    //#endregion FIN GRID PRINCIPAL

//#region SERVICIO SERIGRAFIA

    //#region Informacion Serigrafia
    $("#GSerigrafia").click(function (event) {
        event.preventDefault();
        GuardarAnalisis(1); //1 servicio de serigrafia
    });


    function GuardarAnalisis(bServicio) {

        var validacion = true;

        switch (bServicio) {
            case 1:
                if (ValidSerigrafia.validate()) {
                    validacion = GuardarADSer(UrlAD);
                } else {
                    validacion = false;
                    $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
                };
                break;

            case 2:
                if (ValidSubli.validate()) {
                    validacion = GuardarADSubli(UrlAD);
                } else {
                    validacion = false;
                    $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
                };
                break;

            case 3:
                if (ValidPla.validate()) {
                    validacion = fn_GuardarADPla(UrlAD);
                } else {
                    validacion = false;
                    $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
                };
                break;
            default:
        }

        return validacion

    }


    $("#ResolucionDPI").bind("change", function (e) {
        var Resolucion = parseInt(this.value);
        $("#ResolucionSqr").data("kendoNumericTextBox").value(Resolucion * Resolucion);
    });

    $("#PixelesTotal").bind("change", function (e) {
        var ResSqr = parseFloat($("#ResolucionSqr").data("kendoNumericTextBox").value());
        var Pixel = parseFloat(this.value);
        if (ResSqr > 0) {
            $("#AreaTotal").data("kendoNumericTextBox").value(Pixel / ResSqr);
        } else {
            $("#AreaTotal").data("kendoNumericTextBox").value(0);
        }
    });

    function getAD(UrlAD) {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAD,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {

                $("#IdRequerimiento").val(respuesta.IdRequerimiento);
                $("#IdAnalisisDiseno").val(respuesta.IdAnalisisDiseno);
                $("#ResolucionDPI").data("kendoNumericTextBox").value(respuesta.ResolucionDPI);
                $("#ResolucionSqr").data("kendoNumericTextBox").value(respuesta.ResolucionSqr);
                $("#PixelesTotal").data("kendoNumericTextBox").value(respuesta.Pixeles);
                $("#AreaTotal").data("kendoNumericTextBox").value(respuesta.Area);
                $("#IdUniArea").data("kendoComboBox").value(respuesta.IdUnidadArea);
                $("#AnchoDiseno").data("kendoNumericTextBox").value(respuesta.AnchoDiseno);
                $("#AltoDiseno").data("kendoNumericTextBox").value(respuesta.AltoDiseno);
                $("#Fecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                $("#Estado").val(respuesta.Estado);
                $("#IdUniDimension").data("kendoComboBox").value(respuesta.IdUnidadDiseno);
                $("#CmbIdUnidadVelocidad").data("kendoComboBox").value(respuesta.IdUnidadVelocidad);
                $("#TxtComentarios").val(respuesta.Comentarios);
                $("#CntcolorSer").data("kendoNumericTextBox").value(respuesta.CantidadColores);
                $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value(respuesta.VelocidadMaquina);
                $("#TxtDirectorioSeri").val(respuesta.DirectorioArchivos);
                $('#chkDisenoFullColor').prop('checked', respuesta.DisenoFullColor);
                getTamanos();
                respuesta.DisenoFullColor === true ? $("#CntcolorSer").data("kendoNumericTextBox").enable(false) : $("#CntcolorSer").data("kendoNumericTextBox").enable(true);
                kendo.ui.progress($("#splitter"), false);

            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
            }
        });
    }

    function GuardarADSer(UrlAD) {
        var registrado = true;
        kendo.ui.progress($("#splitter"), true);
        UrlAD = UrlAD + "/" + getIdAD($("#ReqDes").data("kendoGrid"));
        $.ajax({
            url: UrlAD,//
            type: "Put",
            async:false,
            dataType: "json",
            data: JSON.stringify({
                IdRequerimiento: $("#IdRequerimiento").val(),
                IdAnalisisDiseno: getIdAD($("#ReqDes").data("kendoGrid")),
                ResolucionDPI: $("#ResolucionDPI").val(),
                ResolucionSqr: $("#ResolucionSqr").val(),
                Pixeles: $("#PixelesTotal").val(),
                Area: $("#AreaTotal").val(),
                IdUnidadArea: $("#IdUniArea").val(),
                AnchoDiseno: $("#AnchoDiseno").val(),
                AltoDiseno: $("#AltoDiseno").val(),
                IdUnidadDiseno: $("#IdUniDimension").val(),
                LineajeLPI: 0, //no aplica para serigrafia
                Estado: $("#Estado").val(),
                Fecha: kendo.toString(kendo.parseDate($("#Fecha").val()), 'u'),
                Comentarios: $("#TxtComentarios").val(),
                IdCatalogoInsumo: null,
                FactorDistribucion: 0,
                CantidadColores: $("#CntcolorSer").val(),
                IdUnidadVelocidad: $("#CmbIdUnidadVelocidad").val(),
                VelocidadMaquina: $("#TxtVelocidadMaquina").val(),
                DisenoFullColor: $("#chkDisenoFullColor").is(':checked'),
                NoDocumento: getNodocumentoAd($("#ReqDes").data("kendoGrid"))
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                registrado = true;
                RequestEndMsg(data, "Put");
                kendo.ui.progress($("#splitter"), false);
                $("#GSeparacion").data("kendoGrid").dataSource.read();
            },
            error: function (data) {
                registrado = false;
                ErrorMsg(data);
                kendo.ui.progress($("#splitter"), false);
            }
        });

        return registrado;
    }

    function LimpiarADSer() {
        $("#Estado").val("");
        $("#IdRequerimiento").val("0");
        $("#IdAnalisisDiseno").val("0");
        $("#ResolucionDPI").data("kendoNumericTextBox").value("0");
        $("#ResolucionSqr").data("kendoNumericTextBox").value("0");
        $("#PixelesTotal").data("kendoNumericTextBox").value("0");
        $("#CntcolorSer").data("kendoNumericTextBox").value("0");
        $("#AreaTotal").data("kendoNumericTextBox").value("0");
        $("#IdUniArea").data("kendoComboBox").value("");
        $("#AnchoDiseno").data("kendoNumericTextBox").value("0");
        $("#AltoDiseno").data("kendoNumericTextBox").value("0");
        $("#IdUniDimension").data("kendoComboBox").value("");
        $("#CmbIdUnidadVelocidad").data("kendoComboBox").value("");
        $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value("0");
        $("#Talla").val("");
        $("#TxtComentarios").val("");
        $("#colorTela").val("");
        $("#TxtDirectorioSeri").val("");
        $('#chkDisenoFullColor').prop('checked', 0);
    }
    $("#chkDisenoFullColor").click(function () {
        if (this.checked) {
            $("#CntcolorSer").data("kendoNumericTextBox").value(12);
            $("#CntcolorSer").data("kendoNumericTextBox").enable(false);

        } else {
            $("#CntcolorSer").data("kendoNumericTextBox").enable(true);
        }
    });
    //#endregion FIN informacion serigrafia

    //#region Tecnicas serigrafia
    var dsSeparacion = new kendo.data.DataSource({

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlS + "/GetByAnalisis/" + IdA; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlS + "/" + datos.IdSeparacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"

            },
            destroy: {
                url: function (datos) { return UrlS + "/" + datos.IdSeparacion; },
                type: "DELETE"
            },
            create: {
                url: UrlS,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },

            parameterMap: function (data, type) {
                if (type !== "read") {

                    if (type !== "PUT") {
                        if (data.EsBase === true) {
                            data.IdCostoTecnica = null;
                            data.IdTecnica = null;
                        }
                    }
                    return kendo.stringify(data);
                }



            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,


        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSeparacion",
                fields: {
                    IdSeparacion: { type: "number" },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                // cuando es estampado.
                                if (input.is("[name='Pixeles']") && vEstampado == true) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Pixeles']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Area']") && vEstampado == true) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Area']").data("kendoNumericTextBox").value() > 0;
                                }
                                //validar cuando es papel
                                if (input.is("[name='Alto']") && vEspapel == true) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Alto']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Ancho']") && vEspapel == true) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Ancho']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='AltoConsumo']") && vEspapel == true) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='AltoConsumo']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='AnchoConsumo']") && vEspapel == true) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='AnchoConsumo']").data("kendoNumericTextBox").value() > 0;
                                }

                                if (input.is("[name='IdTecnica']") && RowAct.EsBase == false )  {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return  $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadArea']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadArea").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdCatalogoInsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCatalogoInsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadDimension']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadDimension").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadDimensionesConsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return  $("#IdUnidadDimensionesConsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdCostoTecnica']") && RowAct.EsBase == false) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCostoTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdAnalisisDiseno: { type: "number", defaultValue: function (e) { return getIdAD($("#ReqDes").data("kendoGrid")); }, hidden: true },
                    NomIdTecnica: { type: "string", defaultValue: null}, // nombre tecnica
                    Pixeles: { type: "number", defaultValue: 0 },
                    Area: { type: "number", defaultValue: 0 },
                    IdUnidadArea: { type: "string", defaultValue: 6},
                    NomIdUnidadArea: { type: "string" }, // nombre del area
                    Alto: { type: "number", defaultValue: 0 },
                    Ancho: { type: "number", defaultValue: 0 },
                    IdUnidadDimension: { type: "string", defaultValue: 5},
                    NombreUniDimension: { type: "string" }, // nombre unidad dimension
                    AltoConsumo: { type: "number", defaultValue: 0 },
                    AnchoConsumo: { type: "number", defaultValue: 0 },
                    IdUnidadDimensionesConsumo: { type: "string", defaultValue: 5},
                    NombreUniDimensionConsumo: { type: "string" },
                    IdCatalogoInsumo: { type: "string", defaultValue: null },
                    NombreCataloInsumo: {type: "string" },
                    IdCostoTecnica: { type: "string", defaultValue: null },
                    NombreCostoTecnicas: { type: "string" },
                    EsBase: { type: "bool", defaultValue: false }
                }
            }


        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#GSeparacion").kendoGrid({
        edit: function (e) {
            RowAct = e.model;
            e.container.find("label[for=IdSeparacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSeparacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdAnalisisDiseno]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdAnalisisDiseno]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NomIdTecnica]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NomIdTecnica]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NomIdUnidadArea]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NomIdUnidadArea]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreCataloInsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreCataloInsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreUniDimension]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreUniDimension]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreUniDimensionConsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreUniDimensionConsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreCostoTecnicas]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreCostoTecnicas]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=EsBase]").parent("div .k-edit-label").hide();
            e.container.find("label[for=EsBase]").parent().next("div .k-edit-field").hide();

            $('[name="Pixeles"]').data("kendoNumericTextBox").enable(false);
            $('[name="Area"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadArea"]').data("kendoComboBox").enable(false);

            $('[name="Ancho"]').data("kendoNumericTextBox").enable(false);
            $('[name="Alto"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadDimension"]').data("kendoComboBox").enable(false);
            $('[name="AnchoConsumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="AltoConsumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").enable(false);
            $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
            if (!e.model.isNew()) {
                //modo edicion
                if (!e.model.EsBase) {
                    // cuando una area de tecnica y no base
                    // asignar datasource al combobox tecnica
                   
                    $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(getDsComboTenica());
                    IdTec = e.model.IdTecnica;
                    MostrarCamposxTecnica(e.container);
                    Grid_Focus(e, "IdTecnica");
                } else {
                    //cuando el registro de area a modificar es base , tecnica y costo tecnica se ocultan
                    // luego se muestra el nombre de la tecnica.
                    e.container.find("label[for=IdCostoTecnica]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=IdCostoTecnica]").parent().next("div .k-edit-field").hide();
                    e.container.find("label[for=IdTecnica]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=IdTecnica]").parent().next("div .k-edit-field").hide();
                    e.container.find("label[for=NomIdTecnica]").parent("div .k-edit-label").show();
                    e.container.find("label[for=NomIdTecnica]").parent().next("div .k-edit-field").show();
                    MostrarCamposxBase(true);
                    Grid_Focus(e, "NomIdTecnica");
                }

            }
            else {
                // Nuevo registro.
                // asignar datasource al combobox tecnica}

                $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(getDsComboTenica());
                Grid_Focus(e, "IdTecnica");

            };
            $('[name="IdTecnica"]').on('change', function (e) {
                IdTec = Kendo_CmbGetvalue($('[name="IdTecnica"]'));
                $('[name="IdCostoTecnica"]').data("kendoComboBox").value("");
                LimpiarMttoTec();
                MostrarCamposxTecnica(e.container);
              
                var DsCostoTec = new kendo.data.DataSource({
                    dataType: 'json',
                    sort: { field: "Nombre", dir: "asc" },
                    transport: {
                        read: function (datos) {
                            $.ajax({
                                dataType: 'json',
                                url: UrlApiCoTec + "/" + getIdBase($("#ReqDes").data("kendoGrid")) + "/" + IdTec.toString(),
                                async: false,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    datos.success(result);

                                }
                            });
                        }
                    }
                });

                // asignar DataSource al combobox tecnica
                $('[name="IdCostoTecnica"]').data("kendoComboBox").setDataSource(DsCostoTec);

            });

            $('[name="Ancho"]').on("change", function (e) {
                var value1 = parseFloat(this.value) + FactorCosto;
                $('[name="AnchoConsumo"]').data("kendoNumericTextBox").value(value1);
                $('[name="AnchoConsumo"]').data("kendoNumericTextBox").trigger("change");
            });

            $('[name="Alto"]').on("change", function (e) {
                var value2 = parseFloat(this.value) + FactorCosto;
                $('[name="AltoConsumo"]').data("kendoNumericTextBox").value(value2);
                $('[name="AltoConsumo"]').data("kendoNumericTextBox").trigger("change");
            });

            $('[name="Pixeles"]').on("change", function (e) {
                var Resolucion = parseFloat($("#ResolucionSqr").data("kendoNumericTextBox").value());
                var Pixel = parseFloat(this.value);
                if (Resolucion > 0) {
                    $('[name="Area"]').data("kendoNumericTextBox").value(Pixel / Resolucion);
                } else {
                    $('[name="Area"]').data("kendoNumericTextBox").value(0);
                }
                $('[name="Area"]').data("kendoNumericTextBox").trigger("change");
            });

      
            getFactorCosto(e.model.isNew());
          
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeparacion", title: "Separación", hidden: true },
            { field: "IdTecnica", title: "Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione un Técnica....", "required", "", "Requerido"], hidden: true },
            { field: "NomIdTecnica", title: "Nombre Técnica", editor:Grid_ColLocked},
            { field: "IdCostoTecnica", title: "Costo técnica", editor: Grid_Combox, values: ["IdCostoTecnica", "Nombre", UrlApiCoTec, "", "Seleccione un Costo Tec...", "", "IdTecnica", ""], hidden: true },
            { field: "NombreCostoTecnicas", title: "Nombre costo técnica" },
            { field: "IdAnalisisDiseno", title: "IdAnalisisDiseno", hidden: true },
            { field: "Pixeles", title: "Pixeles", editor: Grid_ColNumeric, values: ["required", "0", "999999999999999999", "#", 0]},
            { field: "Area", title: "Area", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "IdUnidadArea", title: "Unidad Area", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....","required","","Requerido"], hidden: true },
            { field: "NomIdUnidadArea", title: "Unidad Area" },
            { field: "IdCatalogoInsumo", title: "Catalogo Insumo", editor: Grid_Combox, values: ["IdCatalogoInsumo", "Nombre", UrlCI, "", "Seleccione....","required", "", "Requerido"], hidden: true },
            { field: "NombreCataloInsumo", title: "Insumo" },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric,values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "Alto", title: "Alto" ,  editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "IdUnidadDimension", title: "Unidad Dimensión", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreUniDimension", title: "Unidad Dimensión" },
            { field: "AnchoConsumo", title: "Ancho Consumo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2]  },
            { field: "AltoConsumo", title: "Alto Consumo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2]  },
            { field: "IdUnidadDimensionesConsumo", title: "Unidad Consumo", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreUniDimensionConsumo", title: "Unidad Consumo" },
            { field: "EsBase", title: "EsBase",menu:false ,hidden:true} // menu false oculta de la opciones filtro.
            
        ]

    });

    SetGrid($("#GSeparacion").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 650);
    SetGrid_CRUD_ToolbarTop($("#GSeparacion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GSeparacion").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GSeparacion").data("kendoGrid"), dsSeparacion);
    Grid_HabilitaToolbar($("#GSeparacion"), false, false, false);
    var selectedRowsGSeparacion = [];
    $("#GSeparacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GSeparacion"), selectedRowsGSeparacion);

    });

    $("#GSeparacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GSeparacion"), selectedRowsGSeparacion);
    });


    function MostrarCamposxTecnica(e) {
        kendo.ui.progress($("#GSeparacion"), true);

        $.ajax({
            url: UrlTec + "/" + IdTec,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {

                    if (respuesta.EsPapel === true) {
                        vEspapel = true;
                        vEstampado = false;
                        $('[name="Pixeles"]').data("kendoNumericTextBox").enable(false);
                        $('[name="IdUnidadArea"]').data("kendoComboBox").enable(false);

                        $('[name="Ancho"]').data("kendoNumericTextBox").enable(true);
                        $('[name="Alto"]').data("kendoNumericTextBox").enable(true);
                        $('[name="IdUnidadDimension"]').data("kendoComboBox").enable(true);
                        $('[name="AnchoConsumo"]').data("kendoNumericTextBox").enable(true);
                        $('[name="AltoConsumo"]').data("kendoNumericTextBox").enable(true);
                        $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").enable(true);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(true);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();

                        var NewDS = new kendo.data.DataSource( {
                            dataType: 'json',
                            sort: { field:"Nombre", dir: "asc" },
                            transport: {
                                read: function (datos) {
                                    $.ajax({
                                        type: "POST",
                                        dataType: 'json',
                                        async: false,
                                        data: JSON.stringify({ idTecnica: Kendo_CmbGetvalue($('[name="IdTecnica"]')), EsPapel: true, EsRhinestone: false }),
                                        url: UrlCI + "/Filtrado",
                                        contentType: "application/json; charset=utf-8",
                                        success: function (result) {
                                            datos.success(result);
                                        }
                                    });
                                }
                            }
                        });
                      
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(NewDS);

                    }


                    if (respuesta.EsEstampado === true) {
                        vEspapel = false;
                        vEstampado = true;
                       
                        $('[name="Pixeles"]').data("kendoNumericTextBox").enable(true);
                        $('[name="IdUnidadArea"]').data("kendoComboBox").enable(true);

                        $('[name="Ancho"]').data("kendoNumericTextBox").enable(false);
                        $('[name="Alto"]').data("kendoNumericTextBox").enable(false);
                        $('[name="AnchoConsumo"]').data("kendoNumericTextBox").enable(false);
                        $('[name="AltoConsumo"]').data("kendoNumericTextBox").enable(false);
                        $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").enable(false);
                        $('[name="IdUnidadDimension"]').data("kendoComboBox").enable(false);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
                        $("#IdCostoTecnica").data("kendoComboBox").input.focus();
                        
                    }
                }
                else {
                    $('[name="Pixeles"]').data("kendoNumericTextBox").enable(false);
                    $('[name="IdUnidadArea"]').data("kendoComboBox").enable(false);

                    $('[name="Ancho"]').data("kendoNumericTextBox").enable(false);
                    $('[name="Alto"]').data("kendoNumericTextBox").enable(false);
                    $('[name="IdUnidadDimension"]').data("kendoComboBox").enable(false);
                    $('[name="AnchoConsumo"]').data("kendoNumericTextBox").enable(false);
                    $('[name="AltoConsumo"]').data("kendoNumericTextBox").enable(false);
                    $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").enable(false);
                    $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);

                }
                kendo.ui.progress($("#GSeparacion"), false);
            },
            error: function () {
                kendo.ui.progress($("#GSeparacion"), false);
            }
        });

    }

    // habilitar opciones true si selecciona una base y false no seleccionan la opcion .
    function MostrarCamposxBase(opcion) {
        if (opcion) {

            $('[name="Pixeles"]').data("kendoNumericTextBox").enable(true);
            $('[name="IdUnidadArea"]').data("kendoComboBox").enable(true);

            $('[name="Ancho"]').data("kendoNumericTextBox").enable(false);
            $('[name="Alto"]').data("kendoNumericTextBox").enable(false);
            $('[name="AnchoConsumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="AltoConsumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").enable(false);
            $('[name="IdUnidadDimension"]').data("kendoComboBox").enable(false);
            $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
            $('[name="Pixeles"]').data("kendoNumericTextBox").focus();

        }
        else {
            $('[name="Pixeles"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadArea"]').data("kendoComboBox").enable(false);

            $('[name="Ancho"]').data("kendoNumericTextBox").enable(false);
            $('[name="Alto"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadDimension"]').data("kendoComboBox").enable(false);
            $('[name="AnchoConsumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="AltoConsumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").enable(false);
            $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
        }
    }
    function LimpiarMttoTec() {
        $('[name="Pixeles"]').data("kendoNumericTextBox").value("0");
        $('[name="Area"]').data("kendoNumericTextBox").value("0");
        $('[name="IdUnidadArea"]').data("kendoComboBox").value(6);
        $('[name="Ancho"]').data("kendoNumericTextBox").value("0");
        $('[name="Alto"]').data("kendoNumericTextBox").value("0");
        $('[name="IdUnidadDimension"]').data("kendoComboBox").value(5);
        $('[name="AnchoConsumo"]').data("kendoNumericTextBox").value("0");
        $('[name="AltoConsumo"]').data("kendoNumericTextBox").value("0");
        $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").value(5);
        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").value("");

    }

    // margen de costo consumo.
    function getFactorCosto(e) {
        kendo.ui.progress($("#GSeparacion"), false);
        $.ajax({
            url: UrlFC + "/MCF",
            dataType: 'json',
            async:false,
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {
                    FactorCosto = respuesta.Costo;
                    IdUnidadFC = respuesta.IdUnidadCosto;
                    if (e) {
                        $('[name="IdUnidadDimensionesConsumo"]').data("kendoComboBox").value(IdUnidadFC);
                        $('[name="IdUnidadDimension"]').data("kendoComboBox").value(IdUnidadFC);
                    };
                   
                } else {
                    FactorCosto = "0.00";
                   IdUnidadFC = "";
                }
                kendo.ui.progress($("#GSeparacion"), false);
            },
            error: function () {
                kendo.ui.progress($("#GSeparacion"), false);
       
            }
        });
    }
    
    function getDsComboTenica() {
         //preparar crear datasource para obtner la tecnica filtrado por base
        return new kendo.data.DataSource({
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        dataType: 'json',
                        async: false,
                        url: UrlTec + "/GetbyBase/" + getIdBase($("#ReqDes").data("kendoGrid")),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            datos.success(result);
                        }
                    });
                }
            }
        });
    }
    
    //#endregion

    //#endregion

//#region SERVICIO DE SUBLIMACION
    //#region Informacion Sublimacion
    $("#GuardarSubli").click(function (event) {
        event.preventDefault();
        GuardarAnalisis(2);

    });

    function getADSubli(UrlAD) {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAD,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {
                    $("#IdRequerimiento").val(respuesta.IdRequerimiento);
                    $("#IdAnalisisDiseno").val(respuesta.IdAnalisisDiseno);
                    $("#AnchoDisenoSub").data("kendoNumericTextBox").value(respuesta.AnchoDiseno);
                    $("#AltoDisenoSub").data("kendoNumericTextBox").value(respuesta.AltoDiseno);
                    $("#IdUnidadDimensionSub").data("kendoComboBox").value(respuesta.IdUnidadDiseno);
                    $("#FechaSub").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                    $("#EstadoSub").val(respuesta.Estado);
                    $("#UbicacionSub").val(getUbicacionRD($("#ReqDes").data("kendoGrid")));
                    $("#TxtFactorDistribucion").data("kendoNumericTextBox").value(respuesta.FactorDistribucion);
                    $("#TxtDirectorioSubli").val(respuesta.DirectorioArchivos);
                    
                } else {

                    LimpiarADSubli();
                }



                kendo.ui.progress($("#splitter"), false);

            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
              
            }
        });
    }

    function GuardarADSubli(UrlAD) {
        var registrado = true;
        UrlAD = UrlAD + "/" + getIdAD($("#ReqDes").data("kendoGrid"));
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAD,//
            type: "Put",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                IdRequerimiento: $("#IdRequerimiento").val(),
                IdAnalisisDiseno: getIdAD($("#ReqDes").data("kendoGrid")),
                ResolucionDPI: 0,
                ResolucionSqr: 0,
                Pixeles: 0,
                Area: 0,
                IdUnidadArea: null,
                AnchoDiseno: $("#AnchoDisenoSub").val(),
                AltoDiseno: $("#AltoDisenoSub").val(),
                IdUnidadDiseno: $("#IdUnidadDimensionSub").val(),
                LineajeLPI: 0, //no aplica para serigrafia
                Estado: $("#EstadoSub").val(),
                Fecha: kendo.toString(kendo.parseDate($("#FechaSub").val()), 'u'),
                Comentarios:"",
                AltoLienzo: 0,
                AnchoLienzo: 0,
                IdUnidadLienzo: null,
                IdCatalogoInsumo: null,
                FactorDistribucion: $("#TxtFactorDistribucion").data("kendoNumericTextBox").value(),
                NoDocumento: getNodocumentoAd($("#ReqDes").data("kendoGrid"))
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                registrado = true;
                $("#IdRequerimiento").val(data[0].IdRequerimiento);
                $("#EstadoSub").val(data[0].Estado);
                RequestEndMsg(data, "Put");
                kendo.ui.progress($("#splitter"), false);
            },
            error: function (data) {
                registrado = false;
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);

            }
        });

        return registrado;
    }

    function LimpiarADSubli() {
        $("#FechaSub").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(getFechaRD($("#ReqDes").data("kendoGrid"))), 'dd/MM/yyyy'));
        $("#EstadoSub").val("");
        $("#UbicacionSub").val("");
        $("#IdRequerimiento").val("0");
        $("#IdAnalisisDiseno").val("0");
        $("#IdSeparacionSubli").val("0");
        $("#AnchoDisenoSub").data("kendoNumericTextBox").value("0");
        $("#AltoDisenoSub").data("kendoNumericTextBox").value("0");
        $("#IdUnidadDimensionSub").data("kendoComboBox").value("");
        $("#TxtFactorDistribucion").data("kendoNumericTextBox").value("0")
        $("#TxtDirectorioSubli").val("");

    }
    //#endregion FIN Informacion Sublimacion

    //#region Proceso Sublimacion
    var dsSeparacionSubli = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlS + "/GetByAnalisis/" + IdA; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlS + "/" + datos.IdSeparacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
                

            },
            destroy: {
                url: function (datos) { return UrlS + "/" + datos.IdSeparacion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlS,
                type: "POST",
                contentType: "application/json; charset=utf-8"
       
            },

            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,


        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSeparacion",
                fields: {
                    IdSeparacion: { type: "number" },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                // cuando es estampado.
                                if (input.is("[name='VelocidadMaquina']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='VelocidadMaquina']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Consumo']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Consumo']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdCatalogoInsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCatalogoInsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadVelocidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadVelocidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadConsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadConsumo").data("kendoComboBox").selectedIndex >= 0;
                                }

                                return true;
                            }
                        }
                    },
                    IdAnalisisDiseno: { type: "number", defaultValue: function (e) { return getIdAD($("#ReqDes").data("kendoGrid")); }, hidden: true },
                    VelocidadMaquina: { type: "number", defaultValue: 0},
                    IdUnidadVelocidad: { type: "string", defaultValue: 15 },
                    NombrUnidadVelocidad: { type: "string" }, // nombre unidad velocidad  
                    Consumo: { type: "number", defaultValue: 0 },
                    IdUnidadConsumo: { type: "string", defaultValue: 8},
                    NombreUnidadConsumo: { type: "string" },
                    IdCatalogoInsumo: { type: "string"},
                    NombreCataloInsumo: { type: "string" }, // nombre catalogo insumo
                    VelocidadMaquinaMts: { type: "number", defaultValue: 0 }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#GSublimacion").kendoGrid({
        edit: function (e) {
            e.container.find("label[for=IdSeparacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSeparacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdAnalisisDiseno]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdAnalisisDiseno]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUnidadVelocidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUnidadVelocidad]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombrUnidadVelocidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombrUnidadVelocidad]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreUnidadConsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreUnidadConsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NomIdTecnica]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NomIdTecnica]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreCataloInsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreCataloInsumo]").parent().next("div .k-edit-field").hide();

            $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
            $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadVelocidad"]').data("kendoComboBox").enable(false);
            $('[name="Consumo"]').data("kendoNumericTextBox").enable(false);
            $('[name="IdUnidadConsumo"]').data("kendoComboBox").enable(false);

            $('[name="IdTecnica"]').on('change', function (e) {

                IdTec = Kendo_CmbGetvalue($('[name="IdTecnica"]'));
                LimpiarMttoTecSubli();
                MostrarCamposxTecnicaSubli(e.container);
            });

            $('[name="VelocidadMaquina"]').on("change", function (e) {
                $('[name="VelocidadMaquinaMts"]').data("kendoNumericTextBox").value(parseFloat(this.value) * 0.9144);
                $('[name="VelocidadMaquinaMts"]').data("kendoNumericTextBox").trigger("change");
            });

            $('[name="VelocidadMaquinaMts"]').on("change", function (e) {
                $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").value(parseFloat(this.value) * 1.09361);
                $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").trigger("change");
            });
            
            if (!e.model.isNew()) {
                IdTec = e.model.IdTecnica;
                MostrarCamposxTecnicaSubli(e.container);
            };
            
            Grid_Focus(e, "IdTecnica");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeparacion", title: "Separación", hidden: true },
            { field: "IdAnalisisDiseno", title: "IdAnalisisDiseno", hidden: true },
            { field: "IdTecnica", title: "Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "GetbyServicio/2", "Seleccione un Técnica....", "required", "", "Requerido"], hidden: true },
            { field: "NomIdTecnica", title: "Proceso" },
            { field: "IdCatalogoInsumo", title: "Insumo", editor: Grid_Combox, values: ["IdCatalogoInsumo", "Nombre", UrlCI, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreCataloInsumo", title: "Insumo" },
            { field: "VelocidadMaquinaMts", title: "Velocidad (Mts/Hrs)", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "VelocidadMaquina", title: "Velocidad (Yds/Hrs)", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "IdUnidadVelocidad", title: "Unidad Velocidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...." ,"required", "", "Requerido"], hidden: true },
            { field: "NombrUnidadVelocidad", title: "Unidad Velocidad", hidden: true },
            { field: "Consumo", title: "Consumo Tinta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2]},
            { field: "IdUnidadConsumo", title: "Unidad Consumo", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreUnidadConsumo", title: "Unidad Consumo" }
        ]
    });

    SetGrid($("#GSublimacion").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 650);
    SetGrid_CRUD_ToolbarTop($("#GSublimacion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GSublimacion").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GSublimacion").data("kendoGrid"), dsSeparacionSubli);

    var selectedRowsGSubli = [];
    $("#GSublimacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GSublimacion"), selectedRowsGSubli);
    });

    $("#GSublimacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GSublimacion"), selectedRowsGSubli);
    });

    Grid_HabilitaToolbar($("#GSublimacion"), false, false, false);

    function MostrarCamposxTecnicaSubli(e) {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlTec + "/" + IdTec,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {
                    if (respuesta.EsImpresion === true) {                 
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(true);
                        $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").enable(false);
                        $('[name="VelocidadMaquinaMts"]').data("kendoNumericTextBox").enable(false);
                        $('[name="IdUnidadVelocidad"]').data("kendoComboBox").enable(false);
                        $('[name="Consumo"]').data("kendoNumericTextBox").enable(true);
                        $('[name="IdUnidadConsumo"]').data("kendoComboBox").enable(true);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();                        
                    }

                    if (respuesta.EsSublimacion === true) {
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(true);
                        $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").enable(true);
                        $('[name="VelocidadMaquinaMts"]').data("kendoNumericTextBox").enable(true);
                        $('[name="IdUnidadVelocidad"]').data("kendoComboBox").enable(true);
                        $('[name="Consumo"]').data("kendoNumericTextBox").enable(false);
                        $('[name="IdUnidadConsumo"]').data("kendoComboBox").enable(false);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();
                    }
                } else {
                    $('[name="IdCatalogoInsumo"]').data("kendoComboBox").enable(false);
                    $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").enable(false);
                    $('[name="VelocidadMaquinaMts"]').data("kendoNumericTextBox").enable(false);
                    $('[name="IdUnidadVelocidad"]').data("kendoComboBox").enable(false);
                    $('[name="Consumo"]').data("kendoNumericTextBox").enable(false);
                    $('[name="IdUnidadConsumo"]').data("kendoComboBox").enable(false);
                }

                $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(getDsCmbCI());
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
            }
        });
    }

    function getDsCmbCI() {
        //preparar crear datasource para obtner la tecnica filtrado por base
        return new kendo.data.DataSource({
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        async:false,
                        data: JSON.stringify({ idTecnica: Kendo_CmbGetvalue($('[name="IdTecnica"]')), EsPapel: true, EsRhinestone: false }),
                        url: UrlCI + "/Filtrado",
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            datos.success(result);
                        }
                    });
                }
            }
        });
    }

    function LimpiarMttoTecSubli() {
        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").value("");
        $('[name="VelocidadMaquina"]').data("kendoNumericTextBox").value("0");
        $('[name="VelocidadMaquinaMts"]').data("kendoNumericTextBox").value("0");
        $('[name="IdUnidadVelocidad"]').data("kendoComboBox").value(15);
        $('[name="Consumo"]').data("kendoNumericTextBox").value("0");
        $('[name="IdUnidadConsumo"]').data("kendoComboBox").value(8);
    } 
    //#endregion FIN Proceso Sublimacion
//#endregion FIN Servicio Sublimacion

//#region SERVICIO DE PLANTILLAS
    //#region Información
    //CONFIGURACION DEL GRID,CAMPOS
    function getADPla(UrlAD) {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAD,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {
                    $("#IdRequerimiento").val(respuesta.IdRequerimiento);
                    $("#IdAnalisisDiseno").val(respuesta.IdAnalisisDiseno);
                    $("#AnchoDisenoPla").data("kendoNumericTextBox").value(respuesta.AnchoDiseno);
                    $("#AltoDisenoPla").data("kendoNumericTextBox").value(respuesta.AltoDiseno);
                    $("#cmbIdUnidadDimensionPla").data("kendoComboBox").value(respuesta.IdUnidadDiseno);
                    $("#FechaPla").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                    $("#EstadoPla").val(respuesta.Estado);
                    $("#UbicacionPla").val(getUbicacionRD($("#ReqDes").data("kendoGrid")));
                    $("#TxtVelocidadMaquinaPla").data("kendoNumericTextBox").value(respuesta.VelocidadMaquina);
                    $("#CmbIdUnidadVelocidadPla").data("kendoComboBox").value(respuesta.IdUnidadVelocidad);
                    $("#TxtDirectorioPlan").val(respuesta.DirectorioArchivos);
                } else {

                    LimpiarADPla();
                }

                kendo.ui.progress($("#splitter"), false);
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);                
            }
        });
    }

    $("#btnGPlantilla").click(function (event) {
        event.preventDefault();
        GuardarAnalisis(3);
    });

    var fn_GuardarADPla = function (UrlAD) {
        var registrado = true;
        UrlAD = UrlAD + "/" + getIdAD($("#ReqDes").data("kendoGrid"));
        $.ajax({
            url: UrlAD,//
            type: "Put",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                IdRequerimiento: getIdRequerimientoRD($("#ReqDes").data("kendoGrid")),
                IdAnalisisDiseno: getIdAD($("#ReqDes").data("kendoGrid")),
                ResolucionDPI: 0,
                ResolucionSqr: 0,
                Pixeles: 0,
                Area: 0,
                IdUnidadArea: null,
                AnchoDiseno: $("#AnchoDisenoPla").val(),
                AltoDiseno: $("#AltoDisenoPla").val(),
                IdUnidadDiseno: $("#cmbIdUnidadDimensionPla").val(),
                LineajeLPI: 0,
                Estado: $("#EstadoPla").val(),
                Fecha: kendo.toString(kendo.parseDate($("#FechaPla").val()), 'u'),
                Comentarios: "",
                FactorDistribucion: 0,
                VelocidadMaquina: $("#TxtVelocidadMaquinaPla").val(),
                IdUnidadVelocidad: $("#CmbIdUnidadVelocidadPla").val(),
                NoDocumento: getNodocumentoAd($("#ReqDes").data("kendoGrid"))

            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                registrado = true;
                RequestEndMsg(data, "Put");
            },
            error: function (data) {
                registrado = false;
                ErrorMsg(data);
            }
        });

        return registrado;
    }
    //#endregion

    //#region Lienzos

    var FiltroPapelPla = { idTecnica: 89, EsPapel: true, EsRhinestone: false };// filtro para detalle de palntillas
    var FiltroTec = { IdServicio: 3, EsPapel: false, EsImpresion: false, EsSublimacion: false, EsPlantilla: true, EsEstampado:false};// filtro para detalle de palntillas
    
    var dataSourcePla = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlS + "/GetByAnalisis/" + IdA; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlS + "/" + datos.IdSeparacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
                

            },
            destroy: {
                url: function (datos) { return UrlS + "/" + datos.IdSeparacion; },
                type: "DELETE"
            },
            create: {
                url: UrlS,
                type: "POST",
                contentType: "application/json; charset=utf-8"
    
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdSeparacion",
                fields: {
                    IdSeparacion: { type: "number" },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                // cuando es estampado.
                                if (input.is("[name='AnchoLienzo']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='AnchoLienzo']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='AltoLienzo']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='AltoLienzo']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Alto']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Alto']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Ancho']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Ancho']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='AnchoConsumo']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='AnchoConsumo']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='AltoConsumo']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='AltoConsumo']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='FactorDistribucion']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='FactorDistribucion']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdCatalogoInsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCatalogoInsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadLienzo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadLienzo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadDimension']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadDimension").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadDimensionesConsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadDimensionesConsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdAnalisisDiseno: { type: "number", defaultValue: function (e) { return getIdAD($("#ReqDes").data("kendoGrid")); } },
                    NomIdTecnica: { type: "string"}, // nombre tecnica

                    Alto: { type: "number", defaultValue: 0 },
                    Ancho: { type: "number", defaultValue: 0 },
                    IdUnidadDimension: { type: "string", defaultValue:5 },
                    NombreUniDimension: { type: "string" }, // nombre unidad dimension

                    AltoConsumo: { type: "number", defaultValue: 0 },
                    AnchoConsumo: { type: "number", defaultValue: 0 },
                    IdUnidadDimensionesConsumo: { type: "string", defaultValue: 5 },
                    NombreUniDimensionConsumo: { type: "string" },

                    Consumo: { type: "number", defaultValue: 0 },
                    IdUnidadConsumo: { type: "string", defaultValue: 9 },
                    NombreUnidadConsumo: { type: "string" },

                    IdCatalogoInsumo: { type: "string"},
                    NombreCataloInsumo: { type: "string" }, // nombre catalogo insumo

                    AltoLienzo: { type: "number", defaultValue: 0 },
                    AnchoLienzo: { type: "number", defaultValue: 0 },
                    IdUnidadLienzo: { type: "string", defaultValue: 5 },
                    NombreIdUnidadLienzo: { type: "string" },

                    FactorDistribucion: { type: "number", defaultValue: 0 }
                }
            }
        }

    });


    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPlantillas").kendoGrid({
        edit: function (e) {
            e.container.find("label[for=IdSeparacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSeparacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdAnalisisDiseno]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdAnalisisDiseno]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NomIdTecnica]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NomIdTecnica]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreUniDimension]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreUniDimension]").parent().next("div .k-edit-field").hide();            
            e.container.find("label[for=NombreUniDimensionConsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreUniDimensionConsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreUnidadConsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreUnidadConsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreCataloInsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreCataloInsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=NombreIdUnidadLienzo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=NombreIdUnidadLienzo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Consumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Consumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUnidadConsumo]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUnidadConsumo]").parent().next("div .k-edit-field").hide();

            Grid_Focus(e, "IdTecnica");
        },
        detailInit: detailInit,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first())
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "IdSeparacion", title: "Separación", hidden: true },
            { field: "IdAnalisisDiseno", title: "IdAnalisisDiseno", hidden: true },
            { field: "IdTecnica", title: "Técnica", editor: Grid_ComboxAjax, values: ["IdTecnica", "Nombre", UrlTec + "/Filtrado", FiltroTec, "Seleccione un Técnica...." ,"required", "", "Requerido"], hidden: true },
            { field: "NomIdTecnica", title: "Lienzo" },
            { field: "IdCatalogoInsumo", title: "Cod. Papel", editor: Grid_ComboxAjax, values: ["IdCatalogoInsumo", "Nombre", UrlCI + "/Filtrado", FiltroPapelPla, "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreCataloInsumo", title: "Papel" },
            { field: "Consumo", title: "Total Consumo", hidden: true },
            { field: "IdUnidadConsumo", title: "Unidad Consumo", hidden: true },
            { field: "NombreUnidadConsumo", title: "Unidad Consumo", hidden: true },
            { field: "AnchoLienzo", title: "Ancho Lienzo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:n2}", 2] },
            { field: "AltoLienzo", title: "Alto Lienzo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:n2}", 2] },
            { field: "IdUnidadLienzo", title: "Unidad Lienzo", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...." ,"required", "", "Requerido"], hidden: true },
            { field: "NombreIdUnidadLienzo", title: "Unidad Lienzo" },
            { field: "Ancho", title: "Ancho Diseño", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:n2}", 2] },
            { field: "Alto", title: "Alto Diseño", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:n2}", 2] },
            { field: "IdUnidadDimension", title: "Unidad Diseño", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...." ,"required", "", "Requerido"], hidden: true },
            { field: "NombreUniDimension", title: "Unidad Dimensión" },
            { field: "AnchoConsumo", title: "Ancho Consumo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:n2}", 2] },
            { field: "AltoConsumo", title: "Alto Consumo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:n2}", 2] },
            { field: "IdUnidadDimensionesConsumo", title: "Unidad Consumo", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...." ,"required", "", "Requerido"], hidden: true },
            { field: "NombreUniDimensionConsumo", title: "Unidad Consumo" },
            { field: "FactorDistribucion", title: "Factor Distribución", editor: Grid_ColNumeric, values: ["required", "0", "99999999999999", "#", 0] }
        ]
    });

    //FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPlantillas").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si, 650);
    SetGrid_CRUD_Command($("#gridPlantillas").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    SetGrid_CRUD_ToolbarTop($("#gridPlantillas").data("kendoGrid"), Permisos.SNAgregar);
    Set_Grid_DataSource($("#gridPlantillas").data("kendoGrid"), dataSourcePla);

    var selectedRowsGPlant = [];
    $("#gridPlantillas").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPlantillas"), selectedRowsGPlant);

    });

    $("#gridPlantillas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPlantillas"), selectedRowsGPlant);
    });
    //GridDetalle de SeparacionesDetalles
 

    function detailInit(e) {
        var IdSep = e.data.IdSeparacion;
        var FiltroPlaDet = { idTecnica: e.data.IdTecnica, EsPapel: false, EsRhinestone: true };// filtro para detalle de palntillas
        var VdS = {
            transport: {
                read: {
                    url: UrlSD + "/GetBySeparacion/" + IdSep,
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function (datos) { return UrlSD + "/" + datos.IdSeparacionDetalle; },
                    type: "PUT",
                    contentType: "application/json; charset=utf-8"
                },
                destroy: {
                    url: function (datos) { return UrlSD + "/" + datos.IdSeparacionDetalle; },
                    type: "DELETE"
                },
                create: {
                    url: UrlSD,
                    type: "POST",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            aggregate: [ { field: "Consumo", aggregate: "sum" } ],
            requestEnd: Grid_requestEnd,
            //    function (e) {
            //    if (e.type === "create" || e.type === "update" || e.type === "destroy") {
            //        var uid = $("#gridPlantillas").data("kendoGrid").dataSource.get(IdSep).uid;

            //        $("#gridPlantillas").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("Consumo", e.sender.aggregates().Consumo.sum);
            //        $("#gridPlantillas").data("kendoGrid").saveRow();
            //        //$("#gridPlantillas").data("kendoGrid").dataSource.get(IdSep).Consumo = e.sender.aggregates().Consumo.sum;
            //    }
            //    Grid_requestEnd(e);
            //},
            error: Grid_error,
            schema: {
                model: {
                    id: "IdSeparacionDetalle",
                    fields: {
                        IdSeparacionDetalle: { type: "number" },
                        IdSeparacion: { type: "number", defaultValue: IdSep, validation: { required: true } },

                        IdCatalogoInsumo: { type: "string" },
                        Nombre: { type: "string" },

                        Consumo: {
                            type: "number",
                            defaultValue: 0,
                            validation: {
                                required: true,
                                maxlength: function (input) {
                                    // cuando es estampado.
                                    if (input.is("[name='Consumo']")) {
                                        input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                        return $("[name='Consumo']").data("kendoNumericTextBox").value() > 0;
                                    }
                                    if (input.is("[name='IdCatalogoInsumo']")) {
                                        input.attr("data-maxlength-msg", "Requerido");
                                        return $("#IdCatalogoInsumo").data("kendoComboBox").selectedIndex >= 0;
                                    }
                                    if (input.is("[name='IdUnidadConsumo']")) {
                                        input.attr("data-maxlength-msg", "Requerido");
                                        return $("#IdUnidadConsumo").data("kendoComboBox").selectedIndex >= 0;
                                    }
                                    return true;
                                }
                            }
                        },
                        IdUnidadConsumo: { type: "string", defaultValue: 9 },
                        Nombre1: { type: "string" },
                    }
                }
            },
            filter: { field: "IdSeparacion", operator: "eq", value: e.data.IdSeparacion }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            edit: function (e) {
                e.container.find("label[for=IdSeparacionDetalle]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdSeparacionDetalle]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=IdSeparacion]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdSeparacion]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=Nombre]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Nombre]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();

                Grid_Focus(e, "IdCatalogoInsumo");
            },
            columns: [
                { field: "IdSeparacionDetalle", title: "IdSeparacionDetalle", hidden: true },
                { field: "IdSeparacion", title: "IdSeparacion", hidden: true },
                { field: "IdCatalogoInsumo", title: "Insumo", editor: Grid_ComboxAjax, values: ["IdCatalogoInsumo", "Nombre", UrlCI + "/Filtrado", FiltroPlaDet, "Seleccione....", "required", "", "Requerido"], hidden: true },
                { field: "Nombre", title: "Insumo" },
                { field: "Consumo", title: "Cantidad", editor: Grid_ColNumeric, values: ["required", "0", "9999999999", "#", 0] },
                { field: "IdUnidadConsumo", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
                { field: "Nombre1", title: "Unidad" }
            ],

        });

        ConfGDetalle(g.data("kendoGrid"), VdS);

        var selectedRowsGPlantDet = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsGPlantDet);

        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsGPlantDet);
        });
    }

    function ConfGDetalle(g, ds) {
        SetGrid(g, ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si, 400);
        SetGrid_CRUD_ToolbarTop(g, Permisos.SNAgregar);
        Set_Grid_DataSource(g, ds);
        SetGrid_CRUD_Command(g, Permisos.SNEditar, Permisos.SNBorrar);   
    }

    function LimpiarADPla() {
        $("#FechaPla").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(getFechaRD($("#ReqDes").data("kendoGrid"))), 'dd/MM/yyyy'));
        $("#EstadoPla").val("");
        $("#UbicacionPla").val("");
        $("#IdRequerimiento").val("0");
        $("#IdAnalisisDiseno").val("0");
        $("#AnchoDisenoPla").data("kendoNumericTextBox").value("0");
        $("#AltoDisenoPla").data("kendoNumericTextBox").value("0");
        $("#cmbIdUnidadDimensionPla").data("kendoComboBox").value("");
        $("#TxtVelocidadMaquinaPla").data("kendoNumericTextBox").value("0");
        $("#CmbIdUnidadVelocidadPla").data("kendoComboBox").value("");
        $("#TxtDirectorioPlan").val("");
    }
    //#endregion FIN LIENZOS
//#endregion FIN SERVICIO DE PLANTILLAS

//#region imagenes Adjuntas

   

    var hmlAdj = '<form id="FrmAdj" method="POST" enctype="multipart/form-data" autocomplete="off">' +
        '<div class="row">' +
        '<div class="form-group col-lg-12">' +
        '<div class="input-group">' +
        '<div style="width: 100%;">' +
        '<button type="button" id="myBtnAdjunto" data-toggle="modal" data-target="#myModalAdjunto" style="width: 100%;" onclick="' + "$('#GridAdjuntos').data('kendoGrid').dataSource.read([]); $('#GridAdjuntos').data('kendoGrid').dataSource.read(); return;" +'">Adjuntos</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="modal fade" id="myModalAdjunto" role="dialog">' +
            '<div class="modal-dialog modal-lg">' +

            ' <div class="modal-content">' +
            '<div class="modal-header">' +
            '<h4 class="modal-title">Adjuntos</h4>' +
            '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '</div>' +
            '<div class="modal-body" role="document">' +
            '<div class="k-content k-rtl">' +
            '<input id="Adjunto" name="Adjunto" type="file" />' +
            '</div>' +
            '<div class="row">' +
            '<div class=" form-group col-lg-12"><div id="GridAdjuntos"></div></div>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer modal-lg">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '</div>' +
            '</form>'

    function getAdjRD(UrlAA) {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAA,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + getNoRequerimiento($("#ReqDes").data("kendoGrid"))  + "", respuesta);
                kendo.ui.progress($("#splitter"), false);
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }

    function setAdjun() {

        $("#myBtnAdjunto").kendoButton({ icon: "attachment" });
        //DataSource para Grid de Artes Adjuntos
        var DsAdj = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function (datos) { return UrlADAdj + "/GetByArte/" + getIdArteRD($("#ReqDes").data("kendoGrid")); },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function (datos) { return UrlADAdj + "/" + datos.Id; },
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json; charset=utf-8"
                },
                destroy: {
                    url: function (datos) {
                        if (EliminarArtAdj("/AnalisisDisenos/BorrarArchivo/" + getNoRequerimiento($("#ReqDes").data("kendoGrid")), datos.NombreArchivo)) {
                            return UrlADAdj + "/" + datos.Id;
                        }
                    },
                    dataType: "json",
                    type: "DELETE"
                },

                parameterMap: function (data, type) {
                    if (type !== "read") {

                        return kendo.stringify(data);
                    }
                }
            },
            requestEnd: Grid_requestEnd,
            error: Grid_error,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: {
                            type: "string"

                        },
                        IdArte: {
                            type: "number", defaultValue: function () { return $("#IdArte").val(); }
                        },
                        Item: {
                            type: "number"
                        },
                        NombreArchivo: {
                            type: "string",
                            validation: {
                                required: true,
                                maxlength: function (input) {

                                    if (input.is("[name='NombreArchivo']") && input.val().length > 200) {
                                        input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        },
                        Fecha: {
                            type: "date"
                        },
                        Descripcion: {
                            type: "string",
                            validation: {
                                required: true,
                                maxlength: function (input) {

                                    if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                        input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        });
        

        //Control para subir los adjutos
        $("#Adjunto").kendoUpload({
            async: {
                saveUrl: "/AnalisisDisenos/SubirArchivo",
                autoUpload: true
            },
            upload: function (e) {
                e.sender.options.async.saveUrl = "/AnalisisDisenos/SubirArchivo/" + getNoRequerimiento($("#ReqDes").data("kendoGrid"));
            },
            localization: {
                select: "Seleccione Archivo"
            },
            showFileList: false,
            success: function (e) {
                if (e.operation === "upload") {
                    GuardarArtAdj(UrlADAdj, e);
                }
            }

        });

        //Grid de ArtesAdjuntos
        $("#GridAdjuntos").kendoGrid({
            autoBind: false,
            edit: function (e) {
                // Ocultar
                
                e.container.find("label[for=Fecha]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Fecha]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=Item]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Item]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=IdAnalisisDiseno]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdAnalisisDiseno]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=NombreArchivo]").parent("div .k-edit-label").hide();
                e.container.find("label[for=NombreArchivo]").parent().next("div .k-edit-field").hide();
                e.container.find("label[for=Id]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Id]").parent().next("div .k-edit-field").hide();

                Grid_Focus(e, "Descripción");
            },
            columns: [
                { field: "Id", title: "ID", hidden: true },
                { field: "IdAnalisisDiseno", title: "Color Arte", hidden: true },
                { field: "Item", title: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
                { field: "NombreArchivo", title: "Nombre del Archivo", template: function (data) { return "<a href='/Adjuntos/" + getNoRequerimiento($("#ReqDes").data("kendoGrid")) + "/" + data["NombreArchivo"] + "' target='_blank' style='text-decoration: underline;'>" + data["NombreArchivo"] + "</a>"; } },
                { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
                { field: "Descripcion", title: "Descripción" }
            ]
        });

        SetGrid($("#GridAdjuntos").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 350);
        SetGrid_CRUD_ToolbarTop($("#GridAdjuntos").data("kendoGrid"),false);
        SetGrid_CRUD_Command($("#GridAdjuntos").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
        Set_Grid_DataSource($("#GridAdjuntos").data("kendoGrid"), DsAdj);


    }

    function GuardarArtAdj(UrlAA, e) {
        kendo.ui.progress($("#splitter"), true);
        var XFecha = Fhoy();
        var XDescripcion = "ARCHIVO ADJUNTO";
        var XType = "Post";

        $.ajax({
            url: UrlAA,
            type: XType,
            dataType: "json",
            data: JSON.stringify({
                IdArte: getIdArteRD($("#ReqDes").data("kendoGrid")),
                Item: 0,
                NombreArchivo: e.files[0].name,
                Fecha: XFecha,
                Descripcion: XDescripcion
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();
                var UrlGA = UrlApiArteAdj + "/GetByArte/" + getIdArteRD($("#ReqDes").data("kendoGrid")); 
                getAdjRD(UrlGA)
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, XType);

            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }

    function EliminarArtAdj(UrlAA, Fn) {
        var eliminado = false;

        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAA,//
            type: "Post",
            async: false,
            data: { fileName: Fn },
            success: function (data) {
                kendo.ui.progress($("#splitter"), false);
                eliminado = data.Resultado;
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                eliminado = false;
            }
        });

        return eliminado;
    }



//#endregion fin imagenes

    //#region ENVIAR A PRECOTIZAR



    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"))

    $("#btnCambioEstado").click(function () {
        event.preventDefault();
        var Procesar = true;
        var fnGuardar = function () { return Fn_GuardaEnCambioEstado(parseInt(Kendo_CmbGetvalue($("#IdServicio")))); };
        Fn_VistaCambioEstadoMostrar("AnalisisDisenos", getEstadoActual(), UrlAD + "/AnalisisDisenos_CambiarEstado", "Sp_CambioEstado", getIdAD($("#ReqDes").data("kendoGrid")), fnGuardar);



    })


    function Fn_GuardaEnCambioEstado(bServicio) {
        var validacion = true;
        switch (bServicio) {
            case 1:
                if ($("#FrmSerigrafia").find(".row.k-state-disabled").length > 0) {
                    validacion = true;
                } else {
                    validacion = GuardarAnalisis(bServicio);

                };
                break;

            case 2:
                if ($("#FrmSublimacion").find(".row.k-state-disabled").length > 0) {
                    validacion = true;
                } else {
                    validacion = GuardarAnalisis(bServicio);
                };
                break;

            case 3:
                if ($("#FrmPlantillas").find(".row.k-state-disabled").length > 0) {
                    validacion = true;
                } else {
                    validacion = GuardarAnalisis(bServicio);
                };
                break;
            default:
        }

        return validacion

    }
   
    //#region vista consulta estados

    Fn_VistaConsultaRequerimientoEstados(($("#vConsultaEstados")));

    //#endregion fin vista consulta estados

    //#endregion fin PRECOTIZAR

}); // FIN DOCUMENT READY

//#region METODOS GENERALES

/**
 * muestra vista modal esados.
 * @param {number} IdRequerimiento PK del requerimiento de desarrollo
 */
function Fn_VerEstados(IdRequerimiento) {
 Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null", IdRequerimiento);
}
function onCloseCambioEstado(e) {
    $("#ReqDes").data("kendoGrid").dataSource.read();
}
function Fn_VerRequerimientoConsulta(idrequerimiento) {

    Fn_VistaConsultaRequerimientoGet($('#vConsulta'), idrequerimiento);
}

function getEstadoActual() {
    switch ($("#IdServicio").data("kendoComboBox").value()) {
        case "1":
            return $("#Estado").val();
            break;
        case "2":
            return $("#EstadoSub").val();
            break;
        case "3":
            return $("#EstadoPla").val();
            break;
    }
}
function getIdAD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdAnalisisDiseno;

}

function getNodocumentoAd(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento2;

}

function getEstadoAD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado1;

}

function getIdS(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSeparacion;

}
function getIdRequerimientoRD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;

}

function getNoRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento1;

}

function getUbicacionRD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Nombre1;

}
function getEstadoRD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado1;

}

function getFechaRD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Fecha1;

}

function HabilitaFormObje(e, ToF) {
    ToF === true ? e.children().removeClass("k-state-disabled") : e.children().addClass("k-state-disabled");
}

function HabilitaObje(e, ToF) {
    ToF === true ? e.removeClass("k-state-disabled") : e.addClass("k-state-disabled");
}
function getIdArteRD(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;

}
function getIdBase(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdBase;

}

fPermisos = function (datos) {
    Permisos = datos;
}
fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
}
fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
}
fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
}
fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
}
fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
}
fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
}
//#endregion Metodos generales