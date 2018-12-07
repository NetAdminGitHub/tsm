
var Permisos;
var FactorCosto = 0.0000;
var vEspapel = true;
var vEstampado = true;
var IdA = 0;
var NoDocReq = "";
var VistaP1 = "";
var VistaP2 = "";
var VistaP3 ="";
var VParSeri = "";
var VParSubli = "";
var VParPlan = "";
var hmlAdj = "";
var UrlUniMed = "";
var UrlRD ="";
var UrlAD = "";
var UrlS = "";
var UrlSD = "";
var UrlApiArteAdj = "";
var UrlADAdj = "";
var UrlArtes = "";

AnalisisDis_Consulta = function (){

    //#region Inicializacion de controles Kendo
    UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
    UrlRD = TSM_Web_APi + "RequerimientoDesarrollos";
    UrlAD = TSM_Web_APi + "AnalisisDisenos";
    UrlS = TSM_Web_APi + "Separaciones";
    UrlSD = TSM_Web_APi + "SeparacionesDetalles";
    UrlApiArteAdj = TSM_Web_APi + "ArteAdjuntos";
    UrlADAdj = TSM_Web_APi + "ArteAdjuntos";
    UrlArtes = TSM_Web_APi + "Artes";

    $("#ResolucionSqrSer_colta").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#ResolucionDPISer_colta").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#PixelesTotalSer_colta").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#AreaTotalSer_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AltoDisenoSer_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AnchoDisenoSer_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AltoDisenoSub_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AnchoDisenoSub_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AnchoDisenoPla_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#AltoDisenoPla_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#CntcolorSer_colta").kendoNumericTextBox({
        min: 0,
        max: 12,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtVelocidadMaquinaSer_colta").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtFactorDistribucion_colta").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#FechaSer_colta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#FechaSer_colta").data("kendoDatePicker").enable(false);
    $("#FechaSub_colta").kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: ["dd/MM/yyyy"] });
    $("#FechaSub_colta").data("kendoDatePicker").enable(false);
    $("#ResolucionSqrSer_colta").data("kendoNumericTextBox").enable(false);
    $("#AreaTotalSer_colta").data("kendoNumericTextBox").enable(false);
    $("#FechaPla_colta").kendoDatePicker({ format: "dd/MM/yyyy", parseFormats: ["dd/MM/yyyy"] });
    $("#FechaPla_colta").data("kendoDatePicker").enable(false);


    Kendo_CmbFiltrarGrid($("#IdUniAreaSer_colta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbIdUnidadDimensionPla_colta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdUniDimensionSer_colta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdUnidadDimensionSub_colta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#IdUnidadConsumoTintaSer_colta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbIdUnidadVelocidadSer_colta"), UrlUniMed, "Abreviatura", "IdUnidad", "Seleccione...");

    //serigrafia
    $("#ResolucionDPISer_colta").data("kendoNumericTextBox").enable(false);
    $("#IdUniAreaSer_colta").data("kendoComboBox").enable(false);
    $("#PixelesTotalSer_colta").data("kendoNumericTextBox").enable(false);
    $("#AnchoDisenoSer_colta").data("kendoNumericTextBox").enable(false);
    $("#AltoDisenoSer_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtVelocidadMaquinaSer_colta").data("kendoNumericTextBox").enable(false);
    $("#CntcolorSer_colta").data("kendoNumericTextBox").enable(false);
    $("#IdUniDimensionSer_colta").data("kendoComboBox").enable(false);
    $("#CmbIdUnidadVelocidadSer_colta").data("kendoComboBox").enable(false);

// sublimacion
    $("#AnchoDisenoSub_colta").data("kendoNumericTextBox").enable(false);
    $("#AltoDisenoSub_colta").data("kendoNumericTextBox").enable(false);
    $("#IdUnidadDimensionSub_colta").data("kendoComboBox").enable(false);
    $("#TxtFactorDistribucion_colta").data("kendoNumericTextBox").enable(false);

    //palntilla

    $("#AnchoDisenoPla_colta").data("kendoNumericTextBox").enable(false);
    $("#AltoDisenoPla_colta").data("kendoNumericTextBox").enable(false);
    $("#cmbIdUnidadDimensionPla_colta").data("kendoComboBox").enable(false);
  
    //#endregion FIN Inicializacion de control Kendo

    //#region Tecnicas serigrafia
    var dsSeparacion = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlS + "/GetByAnalisis/" + IdA; },
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
                    IdTecnica: { type: "string" },
                    IdAnalisisDiseno: { type: "number" },
                    NomIdTecnica: { type: "string" }, // nombre tecnica
                    Pixeles: { type: "number" },
                    Area: { type: "number" },
                    IdUnidadArea: { type: "string" },
                    NomIdUnidadArea: { type: "string" }, // nombre del area
                    Alto: { type: "number" },
                    Ancho: { type: "number" },
                    IdUnidadDimension: { type: "string" },
                    NombreUniDimension: { type: "string" }, // nombre unidad dimension
                    AltoConsumo: { type: "number" },
                    AnchoConsumo: { type: "number" },
                    IdUnidadDimensionesConsumo: { type: "string" },
                    NombreUniDimensionConsumo: { type: "string" },
                    IdCatalogoInsumo: { type: "string" },
                    NombreCataloInsumo: { type: "string" },
                    IdCostoTecnica: { type: "string" },
                    NombreCostoTecnicas: { type: "string" }
                }
            }


        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#GSeparacion").kendoGrid({

        columns: [
            { field: "IdSeparacion", title: "Separación", hidden: true },
            { field: "IdTecnica", title: "Técnica", hidden: true },
            { field: "NomIdTecnica", title: "Nombre Técnica" },
            { field: "IdCostoTecnica", title: "Costo técnica", hidden: true },
            { field: "NombreCostoTecnicas", title: "Nombre costo tecnica" },
            { field: "IdAnalisisDiseno", title: "IdAnalisisDiseno", hidden: true },
            { field: "Pixeles", title: "Pixeles" },
            { field: "Area", title: "Area" },
            { field: "IdUnidadArea", title: "Unidad Area", hidden: true },
            { field: "NomIdUnidadArea", title: "Unidad Area" },
            { field: "IdCatalogoInsumo", title: "Catalogo Insumo", hidden: true },
            { field: "NombreCataloInsumo", title: "Insumo" },
            { field: "Ancho", title: "Ancho" },
            { field: "Alto", title: "Alto" },
            { field: "IdUnidadDimension", title: "Unidad Dimensión", hidden: true },
            { field: "NombreUniDimension", title: "Unidad Dimensión" },
            { field: "AnchoConsumo", title: "Ancho Consumo" },
            { field: "AltoConsumo", title: "Alto Consumo" },
            { field: "IdUnidadDimensionesConsumo", title: "Unidad Consumo", hidden: true },
            { field: "NombreUniDimensionConsumo", title: "Unidad Consumo" }
        ]
    });

    SetGrid($("#GSeparacion").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 400);
    SetGrid_CRUD_ToolbarTop($("#GSeparacion").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GSeparacion").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#GSeparacion").data("kendoGrid"), dsSeparacion);

    var selectedRowsGSeparacion = [];
    $("#GSeparacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GSeparacion"), selectedRowsGSeparacion);
    });

    $("#GSeparacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GSeparacion"), selectedRowsGSeparacion);
    });

    //#endregion

    //#region Proceso Sublimacion
    var dsSeparacionSubli = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlS + "/GetByAnalisis/" + IdA; },
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
                    IdTecnica: { type: "string" },
                    IdAnalisisDiseno: { type: "number" },
                    VelocidadMaquina: { type: "number" },
                    IdUnidadVelocidad: { type: "string" },
                    NombrUnidadVelocidad: { type: "string" }, // nombre unidad velocidad  
                    Consumo: { type: "number" },
                    IdUnidadConsumo: { type: "string" },
                    NombreUnidadConsumo: { type: "string" },
                    IdCatalogoInsumo: { type: "string" },
                    NombreCataloInsumo: { type: "string" } // nombre catalogo insumo


                }
            }


        }

    });

    //CONFIGURACION DEL GRID,CAMPOS

    $("#GSublimacion").kendoGrid({

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeparacion", title: "Separación", hidden: true },
            { field: "IdAnalisisDiseno", title: "IdAnalisisDiseno", hidden: true },
            { field: "IdTecnica", title: "Técnica", hidden: true },
            { field: "NomIdTecnica", title: "Proceso" },
            { field: "IdCatalogoInsumo", title: "Insumo", hidden: true },
            { field: "NombreCataloInsumo", title: "Insumo" },
            { field: "VelocidadMaquina", title: "Velocidad" },
            { field: "IdUnidadVelocidad", title: "Unidad Velocidad", hidden: true },
            { field: "NombrUnidadVelocidad", title: "Unidad Velocidad" },
            { field: "Consumo", title: "Consumo Tinta" },
            { field: "IdUnidadConsumo", title: "Unidad Consumo", hidden: true },
            { field: "NombreUnidadConsumo", title: "Unidad Consumo" }
        ]

    });

    SetGrid($("#GSublimacion").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 400);
    SetGrid_CRUD_ToolbarTop($("#GSublimacion").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GSublimacion").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#GSublimacion").data("kendoGrid"), dsSeparacionSubli);

    var selectedRowsGSubli = [];
    $("#GSublimacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GSublimacion"), selectedRowsGSubli);

    });

    $("#GSublimacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GSublimacion"), selectedRowsGSubli);
    });


    //#endregion FIN Proceso Sublimacion

    //#region Lienzos
    var dataSourcePla = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlS + "/GetByAnalisis/" + IdA; },
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
                    IdTecnica: { type: "string" },
                    IdAnalisisDiseno: { type: "number" },
                    NomIdTecnica: { type: "string" }, // nombre tecnica
                    Alto: { type: "number", defaultValue: 0 },
                    Ancho: { type: "number", defaultValue: 0 },
                    IdUnidadDimension: { type: "string", defaultValue: 5 },
                    NombreUniDimension: { type: "string" }, // nombre unidad dimension
                    AltoConsumo: { type: "number", defaultValue: 0 },
                    AnchoConsumo: { type: "number", defaultValue: 0 },
                    IdUnidadDimensionesConsumo: { type: "string", defaultValue: 5 },
                    NombreUniDimensionConsumo: { type: "string" },
                    Consumo: { type: "number", defaultValue: 0 },
                    IdUnidadConsumo: { type: "string", defaultValue: 9 },
                    NombreUnidadConsumo: { type: "string" },
                    IdCatalogoInsumo: { type: "string" },
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
        detailInit: detailInit,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first())
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "IdSeparacion", title: "Separación", hidden: true },
            { field: "IdAnalisisDiseno", title: "IdAnalisisDiseno", hidden: true },
            { field: "IdTecnica", title: "Técnica", hidden: true },
            { field: "NomIdTecnica", title: "Lienzo" },
            { field: "IdCatalogoInsumo", title: "Cod. Papel", hidden: true },
            { field: "NombreCataloInsumo", title: "Papel" },
            { field: "Consumo", title: "Total Consumo", hidden: true },
            { field: "IdUnidadConsumo", title: "Unidad Consumo", hidden: true },
            { field: "NombreUnidadConsumo", title: "Unidad Consumo", hidden: true },
            { field: "AnchoLienzo", title: "Ancho Lienzo" },
            { field: "AltoLienzo", title: "Alto Lienzo" },
            { field: "IdUnidadLienzo", title: "Unidad Lienzo", hidden: true },
            { field: "NombreIdUnidadLienzo", title: "Unidad Lienzo" },
            { field: "Ancho", title: "Ancho Diseño" },
            { field: "Alto", title: "Alto Diseño" },
            { field: "IdUnidadDimension", title: "Unidad Diseño", hidden: true },
            { field: "NombreUniDimension", title: "Unidad Dimensión" },
            { field: "AnchoConsumo", title: "Ancho Consumo" },
            { field: "AltoConsumo", title: "Alto Consumo" },
            { field: "IdUnidadDimensionesConsumo", title: "Unidad Consumo", hidden: true },
            { field: "NombreUniDimensionConsumo", title: "Unidad Consumo" },
            { field: "FactorDistribucion", title: "Factor Distribución" }
        ]
    });

    //FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPlantillas").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si, 500);
    SetGrid_CRUD_Command($("#gridPlantillas").data("kendoGrid"), false, false);
    SetGrid_CRUD_ToolbarTop($("#gridPlantillas").data("kendoGrid"), false);
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
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            aggregate: [{ field: "Consumo", aggregate: "sum" }],
            requestEnd: Grid_requestEnd,

            error: Grid_error,
            schema: {
                model: {
                    id: "IdSeparacionDetalle",
                    fields: {
                        IdSeparacionDetalle: { type: "number" },
                        IdSeparacion: { type: "number" },
                        IdCatalogoInsumo: { type: "string" },
                        Nombre: { type: "string" },
                        Consumo: { type: "number" },
                        IdUnidadConsumo: { type: "string" },
                        Nombre1: { type: "string" }
                    }
                }
            },
            filter: { field: "IdSeparacion", operator: "eq", value: e.data.IdSeparacion }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            columns: [
                { field: "IdSeparacionDetalle", title: "IdSeparacionDetalle", hidden: true },
                { field: "IdSeparacion", title: "IdSeparacion", hidden: true },
                { field: "IdCatalogoInsumo", title: "Insumo", hidden: true },
                { field: "Nombre", title: "Insumo" },
                { field: "Consumo", title: "Cantidad", editor: Grid_ColNumeric, values: ["required", "0", "9999999999", "#", 0] },
                { field: "IdUnidadConsumo", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
                { field: "Nombre1", title: "Unidad" }
            ]

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
        SetGrid(g, ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si, 350);
        SetGrid_CRUD_ToolbarTop(g, false);
        Set_Grid_DataSource(g, ds);
        SetGrid_CRUD_Command(g, false, false);
    }

    //#endregion FIN LIENZOS

    //#region imagenes Adjuntas



    hmlAdj = '<form id="FrmAdj" method="POST" enctype="multipart/form-data" autocomplete="off">' +
        '<div class="row">' +
        '<div class="form-group col-lg-12">' +
        '<div class="input-group">' +
        '<div style="width: 100%;">' +
        '<button type="button" id="myBtnAdjunto" data-toggle="modal" data-target="#myModalAdjunto" style="width: 100%;" onclick="' + "$('#GridAdjuntos').data('kendoGrid').dataSource.read([]); $('#GridAdjuntos').data('kendoGrid').dataSource.read(); return;" + '">Adjuntos</button>' +
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
        '</form>';


    //#endregion fin imagenes

 

}; // FIN DOCUMENT READY

//#region METODOS GENERALES

function Consultar(IdServicio, IdAnalisisDiseno) {

    VistaP1 = $("#SerigrafiaSlide");
    VistaP2 = $("#SubliSlide");
    VistaP3 = $("#PlantillaSlide");
    VParSeri = $('#vistaParSeri');
    VParSubli = $('#vistaParSubli');
    VParPlan = $('#vistaParPlantilla');

    VistaP1.children().remove();
    VistaP2.children().remove();
    VistaP3.children().remove();
    VParSeri.children().remove();
    VParSubli.children().remove();
    VParPlan.children().remove();

    IdSer = IdServicio;

    switch (IdSer) {
        case 1:
            $("#divSerigrafia").removeAttr("hidden", "hidden");
            $("#divSubli").attr("hidden", "hidden");
            $("#divPlan").attr("hidden", "hidden");
            VistaP1.append(Fn_Carouselcontent());
            VParSeri.append(hmlAdj);

            IdA = IdAnalisisDiseno;
            var url = UrlAD + "/GetAnalisisDisenobyIdAnalisisDiseno/" + IdA;
            getAD(url);

            $("#GSeparacion").data("kendoGrid").dataSource.read();
            $('#ResolucionDPI').siblings('input:visible').focus();
            break;

        case 2:
            $("#divSubli").removeAttr("hidden", "hidden");
            $("#divSerigrafia").attr("hidden", "hidden");
            $("#divPlan").attr("hidden", "hidden");
            VistaP2.append(Fn_Carouselcontent());
            VParSubli.append(hmlAdj);

            IdA = IdAnalisisDiseno;
            var urlsub = UrlAD + "/GetAnalisisDisenobyIdAnalisisDiseno/" + IdA;
            getADSubli(urlsub);

            $("#GSublimacion").data("kendoGrid").dataSource.read();

            break;

        case 3:
            $("#divSubli").attr("hidden", "hidden");
            $("#divSerigrafia").attr("hidden", "hidden");
            $("#divPlan").removeAttr("hidden", "hidden");
            VistaP3.append(Fn_Carouselcontent());
            VParPlan.append(hmlAdj);

            IdA = IdAnalisisDiseno;
            var urlPla = UrlAD + "/GetAnalisisDisenobyIdAnalisisDiseno/" + IdA;
            getADPla(urlPla);

            $("#gridPlantillas").data("kendoGrid").dataSource.read();

            break;
    }


}
function getADPla(UrlAD) {
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: UrlAD,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
               
                $("#AnchoDisenoPla_colta").data("kendoNumericTextBox").value(respuesta.AnchoDiseno);
                $("#AltoDisenoPla_colta").data("kendoNumericTextBox").value(respuesta.AltoDiseno);
                $("#cmbIdUnidadDimensionPla_colta").data("kendoComboBox").value(respuesta.IdUnidadDiseno);
                $("#FechaPla_colta").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                $("#EstadoPla_colta").val(respuesta.Estado);
                $("#UbicacionPla_colta").val(respuesta.Nombre4);
                $("#TxtDirectorioPlan_colta").val(respuesta.DirectorioArchivos);
                NoDocReq = respuesta.NoDocumento;
                MostarAdjuntos(respuesta.IdRequerimiento);
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

function getADSubli(xUrlAD) {
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: xUrlAD,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
              
                $("#AnchoDisenoSub_colta").data("kendoNumericTextBox").value(respuesta.AnchoDiseno);
                $("#AltoDisenoSub_colta").data("kendoNumericTextBox").value(respuesta.AltoDiseno);
                $("#IdUnidadDimensionSub_colta").data("kendoComboBox").value(respuesta.IdUnidadDiseno);
                $("#FechaSub_colta").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                $("#EstadoSub_colta").val(respuesta.Estado);
                $("#UbicacionSub_colta").val(respuesta.Nombre4);
                $("#TxtFactorDistribucion_colta").data("kendoNumericTextBox").value(respuesta.FactorDistribucion);
                $("#TxtDirectorioSubli_colta").val(respuesta.DirectorioArchivos);
                NoDocReq = respuesta.NoDocumento;
                MostarAdjuntos(respuesta.IdRequerimiento);

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

function getAD(UrlAD) {
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: UrlAD,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            $("#ResolucionDPISer_colta").data("kendoNumericTextBox").value(respuesta.ResolucionDPI);
            $("#ResolucionSqrSer_colta").data("kendoNumericTextBox").value(respuesta.ResolucionSqr);
            $("#PixelesTotalSer_colta").data("kendoNumericTextBox").value(respuesta.Pixeles);
            $("#AreaTotalSer_colta").data("kendoNumericTextBox").value(respuesta.Area);
            $("#IdUniAreaSer_colta").data("kendoComboBox").value(respuesta.IdUnidadArea);
            $("#AnchoDisenoSer_colta").data("kendoNumericTextBox").value(respuesta.AnchoDiseno);
            $("#AltoDisenoSer_colta").data("kendoNumericTextBox").value(respuesta.AltoDiseno);
            $("#FechaSer_colta").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
            $("#EstadoSer_colta").val(respuesta.Estado);
            $("#IdUniDimensionSer_colta").data("kendoComboBox").value(respuesta.IdUnidadDiseno);
            $("#CmbIdUnidadVelocidadSer_colta").data("kendoComboBox").value(respuesta.IdUnidadVelocidad);
            $("#TxtComentariosSer_colta").val(respuesta.Comentarios);
            $("#CntcolorSer_colta").data("kendoNumericTextBox").value(respuesta.CantidadColores);
            $("#TxtVelocidadMaquinaSer_colta").data("kendoNumericTextBox").value(respuesta.VelocidadMaquina);
            $("#TxtDirectorioSeri_colta").val(respuesta.DirectorioArchivos);
            $('#chkDisenoFullColorSer_colta').prop('checked', respuesta.DisenoFullColor);
            NoDocReq = respuesta.NoDocumento;
            getTamanos();
            
            kendo.ui.progress($("#splitter"), false);
            MostarAdjuntos(respuesta.IdRequerimiento);

        },
        error: function () {
            kendo.ui.progress($("#splitter"), false);
        }
    });
}

function getTamanos() {
    Url = UrlRD + "/GetTamanos/" + IdA;
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: Url,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            $("#CntTallasSer_colta").val(respuesta);
        },
        error: function (data) {
            kendo.ui.progress($("#splitter"), false);
            ErrorMsg(data);
        }
    });
}

function getAdjRD(UrlAA) {
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: UrlAA,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + NoDocReq.toString() + "", respuesta);
            kendo.ui.progress($("#splitter"), false);
        },
        error: function () {
            kendo.ui.progress($("#splitter"), false);
            ErrorMsg(data);
        }
    });
}

function MostarAdjuntos(IdReq) {
    
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: UrlArtes + "/GetArteByRequerimiento/" + IdReq,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                setAdjun(respuesta.IdArte);
                var UrlAdjRD = UrlApiArteAdj + "/GetByArte/" + respuesta.IdArte;
                getAdjRD(UrlAdjRD);
            }
        },
        error: function (data) {
            kendo.ui.progress($("#splitter"), false);
            ErrorMsg(data);
        }
    });

}

function setAdjun(Idart) {

    $("#myBtnAdjunto").kendoButton({ icon: "attachment" });
    //DataSource para Grid de Artes Adjuntos
    var DsAdj = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlADAdj + "/GetByArte/" + Idart.toString(); },
                dataType: "json",
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
                id: "Id",
                fields: {
                    Id: {
                        type: "string"

                    },
                    IdArte: {
                        type: "number"
                    },
                    Item: {
                        type: "number"
                    },
                    NombreArchivo: {
                        type: "string"
                    },
                    Fecha: {
                        type: "date"
                    },
                    Descripcion: {
                        type: "string"
                        
                    }
                }
            }
        }
    });


    $("#GridAdjuntos").kendoGrid({
        autoBind: false,
        columns: [
            { field: "Id", title: "ID", hidden: true },
            { field: "IdAnalisisDiseno", title: "Color Arte", hidden: true },
            { field: "Item", title: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "NombreArchivo", title: "Nombre del Archivo", template: function (data) { return "<a href='/Adjuntos/" + NoDocReq.toString() + "/" + data["NombreArchivo"] + "' target='_blank' style='text-decoration: underline;'>" + data["NombreArchivo"] + "</a>"; } },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "Descripcion", title: "Descripción" }
        ]
    });

    SetGrid($("#GridAdjuntos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 350);
    SetGrid_CRUD_ToolbarTop($("#GridAdjuntos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GridAdjuntos").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#GridAdjuntos").data("kendoGrid"), DsAdj);


}

function HabilitaFormObje(e, ToF) {
    ToF === true ? e.children().removeClass("k-state-disabled") : e.children().addClass("k-state-disabled");
}

function HabilitaObje(e, ToF) {
    ToF === true ? e.removeClass("k-state-disabled") : e.addClass("k-state-disabled");
}

fPermisos = function (datos) {
    Permisos = datos;
};

function Fn_ConsultaAnalisisDisenos(IdServicio, IdAnalisisDiseno) {

    Consultar(IdServicio, IdAnalisisDiseno);
}

//#endregion Metodos generales