var Permisos;
let UrlSimRen = TSM_Web_APi + "SimulacionesRentabilidades";
let UrlApiServ =TSM_Web_APi + "Servicios";
let UrlApiClient = TSM_Web_APi + "Clientes";
let UrlApiSimu = TSM_Web_APi + "Simulaciones";
let UrlAD = TSM_Web_APi + "AnalisisDisenos";
let UrlFac = TSM_Web_APi + "RentabilidadConfiguraciones";
let UrlSimConsumo = TSM_Web_APi + "SimulacionesConsumos";
let UrlArt = TSM_Web_APi + "Articulos";
let UrlCosTec = TSM_Web_APi + "CostoTecnicas";
let UrlUM = TSM_Web_APi + "UnidadesMedidas";
let UrlCatalo = TSM_Web_APi + "CatalogoInsumos";
let UrlEP = TSM_Web_APi +"EtapasProcesos";
let UrlCI = TSM_Web_APi +"CatalogoInsumos";
let UrlRequeDesarrollo = TSM_Web_APi + "RequerimientoDesarrollos"; 
var vxIdSeteo=0;
var vxIdEstacion=0;
$(document).ready(function () {

    $("#MbtnSimuRecalcular").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Recalcular Simulación por No. OT",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900,
        close: fn_closeGSRecal
    });

    KdoButton($("#btnRecalcular"), "gears", "Recalcular simulación");
    KdoButton($("#btnIrSimu"), "hyperlink-open-sm","Ir a Simulaciones");
    KdoButton($("#btnCambioEstado"), "check", "Cambio de estado");
    Kendo_MultiSelect($("#CmbTallasRecalcular"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Seleccione ...");
    KdoButton($("#btnAceptarSimuRecal"), "check", "Recalcular Simulación");
    //programar control de tabulacion
    $("#TabSimulacion").kendoTabStrip({
        tabPosition: "left",
        animation: { open: { effects: "fadeIn" } }
    });

    fn_CargarVistaParcial("_SimulacionMuestrasDatos.js", "SimulacionMuestrasDatos");

    $("#CmbTallasRecalcular").data("kendoMultiSelect").value("");
    $("#CmbTallasRecalcular").data("kendoMultiSelect").trigger("change");

    $("#NumCantidadTallasRecal").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtNuevaCantidadPiezasRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#txtPorcVariacionRecalcular").kendoNumericTextBox({
        format: "p",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });

    $("#TxtNoMontajeRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#txtPersonalExtraRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });

    $("#txtCombosRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    $("#txtVeloMaquinaRecalcular").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    KdoNumerictextboxEnable($("#NumCantidadTallasRecal"), false);
    let ValidNuevoSimRecal = $("#FrmRecalcularSim").kendoValidator({
        rules: {
            TallaRec: function (input) {
                if (input.is("[name='CmbTallasRecalcular']")) {
                    return $("#CmbTallasRecalcular").data("kendoMultiSelect").value().length > 0;
                }
                return true;
            },
            Mayor0: function (input) {
                if (input.is("[name='TxtNuevaCantidadPiezasRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            NoMontajeMayor0: function (input) {
                if (input.is("[name='TxtNoMontajeRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            PersonalMayorIgual0: function (input) {
                if (input.is("[name='txtPersonalExtraRecalcular']")) {
                    return input.val() >= 0;
                }
                return true;
            },
            CombosMayorIgual0: function (input) {
                if (input.is("[name='txtCombosRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            VeloMayorIgual0: function (input) {
                if (input.is("[name='txtVeloMaquinaRecalcular']")) {
                    return input.val() > 0;
                }
                return true;
            },
            PorcMayorIgual0: function (input) {
                if (input.is("[name='txtPorcVariacionRecalcular']")) {
                    return input.val() >= 0;
                }
                return true;
            }
        },
        messages: {
            Mayor0: "requerido",
            NoMontajeMayor0: "requerido.",
            PersonalMayorIgual0: "requerido",
            CombosMayorIgual0: "requerido",
            VeloMayorIgual0: "requerido",
            PorcMayorIgual0: "requerido",
            TallaRec: "requerido"
        }
    }).data("kendoValidator");


    //cargar los datos de la simulación
    
    //#region CRUD para el grid Rentabilidad
    let DsRent = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasRentabilidades/GetSimulacionesMuestrasRentabilidades/" + vIdSimulacion; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasRentabilidades/" + datos.IdSimulacionRentabilidad; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasRentabilidades/" + datos.IdSimulacionRentabilidad; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SimulacionesMuestrasRentabilidades",
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
            if (e.type === "update") {
                let Rentabilidad = 0;
                let Utilidad = 0;
                let PrecioCliente = 0;
                let PrecioTS = 0;
                let PrecioVenta = 0;

                if (e.response[0].Aprobado) {
                    PrecioVenta = e.response[0].PrecioVenta;
                    Rentabilidad = e.response[0].Rentabilidad;
                    PrecioTS = e.response[0].PrecioTS;
                    PrecioCliente = e.response[0].PrecioCliente;
                    Utilidad = e.response[0].Utilidad;
                    this.read();
                } else {
                    PrecioVenta = 0;
                    Rentabilidad = 0;
                    PrecioTS = 0;
                    PrecioCliente = 0;
                    Utilidad = 0;
                }
                $("#TxtPrecioCliente").data("kendoNumericTextBox").value(PrecioCliente);
                $("#TxtPrecioTS").data("kendoNumericTextBox").value(PrecioTS);
                $("#TxtPrecioVenta").data("kendoNumericTextBox").value(PrecioVenta);
                $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(Rentabilidad);
                $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(Utilidad);
            }
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSimulacionRentabilidad",
                fields: {
                    IdSimulacionRentabilidad: { type: "number" },
                    IdSimulacion: {
                        type: "number", defaultValue: function (e) { return vIdSimulacion; }
                    },
                    IdRentabilidad: { type: "string", defaultValue: null },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='PrecioVenta']")) {
                                    input.attr("data-maxlength-msg", "No puede ser menor al costo");
                                    return $("[name='PrecioVenta']").data("kendoNumericTextBox").value() > 0;
                                }

                                return true;
                            }
                        }
                    },
                    Rentabilidad: { type: "number" },
                    Utilidad: { type: "number" },
                    PrecioVenta: { type: "number" },
                    Aprobado: { type: "bool" },
                    CU: {
                        type: "number", defaultValue: function (e) { return VIdSer !== 2 ? $("#TxtCostoUnitario").val() : 0; } // $("#TxtCostoUnitario").data("kendoNumericTextBox")

                    }

                }
            }
        }
    });

    $("#gridRentabilidad").kendoGrid({

        edit: function (e) {
            e.container.find("label[for=IdSimulacionRentabilidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSimulacionRentabilidad]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdSimulacion]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdSimulacion]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdRentabilidad]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdRentabilidad]").parent().next("div .k-edit-field").hide();

            $('[name="Utilidad"]').data("kendoNumericTextBox").enable(false);
            $('[name="CU"]').data("kendoNumericTextBox").enable(false);

            if (e.model.isNew()) {
                e.container.find("label[for=Aprobado]").parent("div .k-edit-label").hide();
                e.container.find("label[for=Aprobado]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Descripcion");

            } else {

                $('[name="CU"]').data("kendoNumericTextBox").value(VIdSer === 2 ? kdoNumericGetValue($("#TxtCostoTotalMasTrans")) : $("#TxtCostoUnitario").data("kendoNumericTextBox").value());

                if (e.model.Aprobado) {
                    $('[name="Rentabilidad"]').data("kendoNumericTextBox").enable(false);
                    $('[name="Descripcion"]').addClass("k-input k-textbox").attr("disabled", "disabled");
                    $('[name="PrecioVenta"]').data("kendoNumericTextBox").enable(false);
                }
                else {
                    if ((e.model.Descripcion.toUpperCase() === "CLIENTE") || (e.model.Descripcion.toUpperCase() === "TECHNO SCREEN")) {
                        $('[name="Descripcion"]').addClass("k-input k-textbox").attr("disabled", "disabled");
                    }

                    Grid_Focus(e, "Descripcion");
                }
            }

            $('[name="Rentabilidad"]').on("change", function (e) {
                let CU = parseFloat(VIdSer === 2 ? kdoNumericGetValue($("#TxtCostoTotalMasTrans")) : $("#TxtCostoUnitario").data("kendoNumericTextBox").value());
                let Utilidad = CU / (1 - parseFloat(this.value)) - CU;
                let PrecioVenta = fn_RoundToUp((Utilidad + CU), 4);
                $('[name="Utilidad"]').data("kendoNumericTextBox").value(Utilidad);
                $('[name="PrecioVenta"]').data("kendoNumericTextBox").value(PrecioVenta);

                $('[name="Utilidad"]').data("kendoNumericTextBox").trigger("change");
                $('[name="PrecioVenta"]').data("kendoNumericTextBox").trigger("change");
            });

            $('[name="PrecioVenta"]').on("change", function (e) {
                let CU = parseFloat(VIdSer === 2 ? kdoNumericGetValue($("#TxtCostoTotalMasTrans")) : $("#TxtCostoUnitario").data("kendoNumericTextBox").value());
                let Rentabilidad = (parseFloat(this.value) - CU) / parseFloat(this.value);
                $('[name="Rentabilidad"]').data("kendoNumericTextBox").value(Rentabilidad);
                $('[name="Rentabilidad"]').data("kendoNumericTextBox").trigger("change");

                let Utilidad = CU / (1 - Rentabilidad) - CU;

                $('[name="Utilidad"]').data("kendoNumericTextBox").value(Utilidad);
                $('[name="Utilidad"]').data("kendoNumericTextBox").trigger("change");

            });

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Aprobado", title: "Aprobado", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Aprobado"); } },
            { field: "IdSimulacionRentabilidad", title: "IdSimulacionRentabilidad", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "IdRentabilidad", title: "IdRentabilidad", editor: Grid_Combox, values: ["IdRentabilidad", "Nombre", UrlFac, "", "Seleccione...."], hidden: true },
            { field: "CU", title: "Costo Unitario", editor: Grid_ColNumeric, values: ["", "0.0000", "99999999999999.99", "c4", 4], hidden: true },
            { field: "Descripcion", title: "Descripción" },
            { field: "Rentabilidad", title: "Rentabilidad", editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4], format: "{0:P2}" },
            { field: "Utilidad", title: "Utilidad $", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c4", 4], format: "{0:c4}" },
            { field: "PrecioVenta", title: "Precio Venta $", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c4", 4], format: "{0:c4}" },            
            {
                command: {
                    name: "aprobar",
                    iconClass: "k-icon k-i-success",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        dataItem.set("Aprobado", true);
                        this.saveChanges();
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]

    });

    SetGrid($("#gridRentabilidad").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridRentabilidad").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridRentabilidad").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridRentabilidad").data("kendoGrid"), DsRent);

    var selectedRowsRentabilidad = [];
    $("#gridRentabilidad").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRentabilidad"), selectedRowsRentabilidad);
    });

    $("#gridRentabilidad").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRentabilidad"), selectedRowsRentabilidad);
    });
    //#endregion Fin RUD para el grid Rentabilidad

    //#region CRUD para el grid simulacion Consumo

    let DsSimConsu = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SimulacionesMuestrasConsumos/GetBySimulaciones/" + vIdSimulacion + "/" + ($("#chkSecuenciaCompleta").is(':checked') ? "1" : "0"); },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasConsumos/" + datos.IdSimulacion + "/" + datos.IdSeteo + "/" + datos.IdEstacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasConsumos/" + datos.IdSimulacion + "/" + datos.IdSeteo + "/" + datos.IdEstacion; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SimulacionesMuestrasConsumos",
                type: "POST",
                contentType: "application/json; charset=utf-8"

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    if (type === "PUT" && data.EsBase === true)
                        data.idTecnica = null;

                    return kendo.stringify(data);
                }
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSeteo",
                fields: {
                    IdSeteo: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdSimulacion: {
                        type: "number", defaultValue: function (e) { return vIdSimulacion; }
                    },
                    Descripcion: {type:"string"},
                    Peso: { type: "number" },
                    Costo: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" },
            { field: "Costo", aggregate: "sum" }
        ]
    });

    $("#gridSimuConsumo").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdSeteo");
            KdoHideCampoPopup(e.container, "IdEstacion");
            KdoHideCampoPopup(e.container, "IdSimulacion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeteo", title: "IdSeteo", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "IdEstacion", title: "Estación Maquina", footerTemplate: "Totales"},
            { field: "Descripcion", title:"Descripción"},
            { field: "Peso", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n4", 4], format: "{0:n4}", footerTemplate: "#: data.Peso ? kendo.format('{0:n4}', sum) : 0 #" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999.99999999", "c", 8], format: "{0:c8}", footerTemplate: "#: data.Costo ? kendo.format('{0:c8}', sum) : 0 #" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }
        ]

    });

    SetGrid($("#gridSimuConsumo").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridSimuConsumo").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimuConsumo").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimuConsumo").data("kendoGrid"), DsSimConsu);
    var selectedRowsConsumos = [];
    $("#gridSimuConsumo").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimuConsumo"), selectedRowsConsumos);
    });

    $("#gridSimuConsumo").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimuConsumo"), selectedRowsConsumos);
        fn_ConsultarConsumoArt($("#gridSimuConsumo"));
    });

    $("#chkSecuenciaCompleta").click(function () {
        $("#gridSimuConsumo").data("kendoGrid").dataSource.read();
    });
    //#endregion Fin RUD para el grid Rentabilidad
    let DsSimConsuArt = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SimulacionesMuestrasConsumosArticulos/GetBySimulacionesSeteoEstacion/" + vIdSimulacion + "/" + vxIdSeteo + "/" + vxIdEstacion; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasConsumosArticulos/" + datos.IdSimulacion + "/" + datos.IdSeteo + "/" + datos.IdEstacion + "/" + datos.IdArticulo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SimulacionesMuestrasConsumosArticulos/" + datos.IdSimulacion + "/" + datos.IdSeteo + "/" + datos.IdEstacion + "/" + datos.IdArticulo; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SimulacionesMuestrasConsumosArticulos",
                type: "POST",
                contentType: "application/json; charset=utf-8"

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    if (type === "PUT" && data.EsBase === true)
                        data.idTecnica = null;

                    return kendo.stringify(data);
                }
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSeteo",
                fields: {
                    IdSeteo: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdSimulacion: {
                        type: "number", defaultValue: function (e) { return vIdSimulacion; }
                    },
                    Descripcion: { type: "string" },
                    CostoArticulo: { type: "number" },
                    IdUnidadMedida: { type: "string" },
                    Abreviatura: {type : "string"},
                    Peso: { type: "number" },
                    Costo: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" },
            { field: "Costo", aggregate: "sum" }
        ]
    });

    $("#gridSimuConsumoArt").kendoGrid({
        edit: function (e) {

            KdoHideCampoPopup(e.container, "IdSeteo");
            KdoHideCampoPopup(e.container, "IdEstacion");
            KdoHideCampoPopup(e.container, "IdSimulacion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");

        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeteo", title: "IdSeteo", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "IdEstacion", title: "Estación Maquina",hidden:true },
            { field: "Descripcion", title: "Descripción" ,hidden:true},
            { field: "IdArticulo", title: "Artículo", footerTemplate: "Totales" },
            { field: "NombreArt", title: "Nombre Artículo" },
            { field: "CostoArticulo", title: "Costo Art.", format: "{0:c6}"},
            { field: "Abreviatura", title: "Unidad Costo Art." },
            { field: "IdUnidadMedida", title: "IdUnidadMedida", hidden: true },
            { field: "Peso", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n4", 4], format: "{0:n4}", footerTemplate: "#: data.Peso ? kendo.format('{0:n4}', sum) : 0 #"},
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999.99999999", "c", 8], format: "{0:c8}", footerTemplate: "#: data.Costo ? kendo.format('{0:c8}', sum) : 0 #"},
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }
        ]

    });

    SetGrid($("#gridSimuConsumoArt").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridSimuConsumoArt").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimuConsumoArt").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimuConsumoArt").data("kendoGrid"), DsSimConsuArt);

    var selectedRowsConsArt = [];
    $("#gridSimuConsumoArt").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimuConsumoArt"), selectedRowsConsArt);
    });

    $("#gridSimuConsumoArt").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimuConsumoArt"), selectedRowsConsArt);
    });
    //#reg
    $("#btnRecalcular").click(function (event) {
        fn_getSimulacionesTallas(vIdSimulacion.toString());
        kdoNumericSetValue($("#txtCombosRecalcular"), kdoNumericGetValue($("#txtCantidadCombos")));
        kdoNumericSetValue($("#TxtNuevaCantidadPiezasRecalcular"), kdoNumericGetValue($("#TxtCantidadPiezas")));
        kdoNumericSetValue($("#TxtNoMontajeRecalcular"), kdoNumericGetValue($("#TxtMontajes")));
        kdoNumericSetValue($("#txtPersonalExtraRecalcular"), kdoNumericGetValue($("#txtNoPersonalExtra")));
        kdoNumericSetValue($("#txtVeloMaquinaRecalcular"), kdoNumericGetValue($("#txtVelocidadMaquina")));
        kdoNumericSetValue($("#txtPorcVariacionRecalcular"), kdoNumericGetValue($("#txtPorcVariacion")) === null ? 0 : kdoNumericGetValue($("#txtPorcVariacion")));
        kdoChkSetValue($("#chkUsarTermofijadoRecalcular"), KdoChkGetValue($("#chkUsarTermo")));
        $("#MbtnSimuRecalcular").data("kendoDialog").open();
    });

    $("#btnIrSimu").click(function () {
        window.location.href = "/SimulacionesMuestras";
    });

    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"));

    $("#btnCambioEstado").click(function () {
        Fn_VistaCambioEstadoMostrar("SimulacionesMuestras", $("#TxtEstado").val(), TSM_Web_APi + "SimulacionesMuestras/SimulacionesMuestras_CambiarEstado", "Sp_CambioEstado", vIdSimulacion);
    });

    $("#CmbTallasRecalcular").data("kendoMultiSelect").bind("deselect", function (e) {

        var MultiSelect = $("#CmbTallasRecalcular").data('kendoMultiSelect');
        var count = MultiSelect.value().length;
        kdoNumericSetValue($("#NumCantidadTallasRecal"), count - 1);
    });

    $("#CmbTallasRecalcular").data("kendoMultiSelect").bind("select", function (e) {
        var MultiSelect = $("#CmbTallasRecalcular").data('kendoMultiSelect');
        var count = MultiSelect.value().length;
        kdoNumericSetValue($("#NumCantidadTallasRecal"), count + 1);

    });

    $("#btnAceptarSimuRecal").click(function () {
        if (ValidNuevoSimRecal.validate()) { fn_RecalSimulacionVistaInf(); }
    });
  
});


let onCloseCambioEstado = function () {

    // obtener estado anterior despues de cerrar ventana cambio estado.
    let EstadoAnt = $("#TxtEstado").val();

    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestras/GetbyIdSimulacion/" + vIdSimulacion,
        dataType: 'json',
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta.Estado !== EstadoAnt) {
                $("#TxtEstado").val(respuesta.Estado);
            }
        }
    });
    $("#TxtEstado").val() !== "EDICION" ? KdoButtonEnable($("#btnRecalcular"), false) : KdoButtonEnable($("#btnRecalcular"), Permisos.SNProcesar);
    KdoButtonEnable($("#btnCambioEstado"), Permisos.SNCambiarEstados);
    $("#TxtEstado").val() !== "EDICION" ? Grid_HabilitaToolbar($("#gridRentabilidad"), false, false, false) : Grid_HabilitaToolbar($("#gridRentabilidad"), false, Permisos.SNEditar, false);
};

var fn_CargarVistaParcial = function (ViewParcialJs, ViewPartial) {
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    ViewParcialJs = ViewParcialJs.replace(".js", ".js?" + _version);
    if (listJs.filter(listJs => listJs.toString().endsWith(ViewParcialJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + ViewParcialJs;
        script.onload = function () {
            fn_LoadVista(ViewPartial);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        fn_LoadVista(ViewPartial);
    }
};

var fn_LoadVista = function (ViewPartial) {
    $.ajax({
        url: "/SimulacionesMuestras/"+ViewPartial,
        async: false,
        type: 'GET',
        contentType: "text/html; charset=utf-8",
        success: function (resultado) {
            $("#pvSimulacion").html(resultado);
            fn_CamposSimulacion();
            fn_DHCamposSim();
            fn_GetSimubyIdSimu();
        }
    });
};

let fn_CamposSimulacion = function () {
    $("#TxtFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#TxtFecha").data("kendoDatePicker").value(Fhoy());
    $("#TxtCantidadPiezas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtCostoMOD").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoFabril").kendoNumericTextBox({
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
    $("#TxtCostoOperacion").kendoNumericTextBox({
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

    $("#TxtCantidadTecnicas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtMontajes").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#txtNoPersonalExtra").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtCantidadColores").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtCantidadCombos").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtCantidadTallas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });
    $("#txtVelocidadMaquina").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });

    $("#txtPorcVariacion").kendoNumericTextBox({
        format: "p",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });

    $("#txtTiempoProyecto").kendoNumericTextBox({
        format: "n4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });

    //validar por servicio  el seteo de campos
    fn_SetCampos();
};

let fn_SetCampos = function () {
    $("#TxtCostoMP").kendoNumericTextBox({
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

    $("#TxtCostoMPUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoMODUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoPrimoUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoFabrilUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoProduccionUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoOperacionUnitario").kendoNumericTextBox({
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#txtCostoTermofijado").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#txtCostoTermofijadoUnitario").kendoNumericTextBox({
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

};

let fn_DHCamposSim = function () {
    $("#TxtFecha").data("kendoDatePicker").enable(false);
    KdoCheckBoxEnable($("#chkUsarTermo"), false);
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").enable(false);
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioCliente").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioTS").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioVenta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMOD").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFabril").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccion").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOperacion").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoTotal").data("kendoNumericTextBox").enable(false);
    $("#TxtCantidadPiezas").data("kendoNumericTextBox").enable(false);

    //campos para sublimación
    $("#TxtCostoMP").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimo").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMPUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMODUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFabrilUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccionUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOperacionUnitario").data("kendoNumericTextBox").enable(false);
    $("#txtCostoTermofijado").data("kendoNumericTextBox").enable(false);
    $("#txtCostoTermofijadoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCantidadTecnicas").data("kendoNumericTextBox").enable(false);
    $("#TxtMontajes").data("kendoNumericTextBox").enable(false);
    $("#txtTiempoProyecto").data("kendoNumericTextBox").enable(false);
    $("#txtNoPersonalExtra").data("kendoNumericTextBox").enable(false);
    $("#txtCantidadColores").data("kendoNumericTextBox").enable(false);
    $("#txtCantidadCombos").data("kendoNumericTextBox").enable(false);
    $("#txtCantidadTallas").data("kendoNumericTextBox").enable(false);
    $("#txtVelocidadMaquina").data("kendoNumericTextBox").enable(false);
    $("#txtPorcVariacion").data("kendoNumericTextBox").enable(false);
};

let fn_SetCamposValores = function (elemento) {
    if (elemento !== null) {
        $("#TxtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha), 'dd/MM/yyyy'));
        $("#TxtCantidadPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
        $("#TxtCostoMOD").data("kendoNumericTextBox").value(elemento.CostoMOD);
        $("#TxtCostoFabril").data("kendoNumericTextBox").value(elemento.CostoFabril);
        $("#TxtCostoProduccion").data("kendoNumericTextBox").value(elemento.CostoProduccion);
        $("#TxtCostoOperacion").data("kendoNumericTextBox").value(elemento.CostoOperacion);
        $("#TxtCostoTotal").data("kendoNumericTextBox").value(elemento.CostoTotal);
        $("#chkUsarTermo").prop("checked", elemento.UsarTermofijado);
        $("#TxtNoDocumento").val(elemento.NoDocumento);
        $("#TxtEstado").val(elemento.Estado);
        $("#TxtCliente").val(elemento.NombreCliente);
        $("#TxtCostoMP").data("kendoNumericTextBox").value(elemento.CostoMP);
        $("#TxtCostoPrimo").data("kendoNumericTextBox").value(elemento.CostoPrimo);
        $("#txtCostoTermofijado").data("kendoNumericTextBox").value(elemento.CostoTermofijado);
        $("#TxtCostoMPUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoMP / elemento.CantidadPiezas * 10000) / 10000);
        $("#TxtCostoMODUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoMOD / elemento.CantidadPiezas * 10000) / 10000);
        $("#TxtCostoPrimoUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoPrimo / elemento.CantidadPiezas * 10000) / 10000);
        $("#TxtCostoFabrilUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoFabril / elemento.CantidadPiezas * 10000) / 10000);
        $("#TxtCostoProduccionUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoProduccion / elemento.CantidadPiezas * 10000) / 10000);
        $("#TxtCostoOperacionUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoOperacion / elemento.CantidadPiezas * 10000) / 10000);
        $("#txtCostoTermofijadoUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoTermofijado / elemento.CantidadPiezas * 10000) / 10000);
        $("#TxtCostoUnitario").data("kendoNumericTextBox").value(elemento.CostoUnitario);
        $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(elemento.PorcUtilidadConsiderada);
        $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(elemento.UtilidadDolares);
        $("#TxtPrecioCliente").data("kendoNumericTextBox").value(elemento.PrecioCliente);
        $("#TxtPrecioTS").data("kendoNumericTextBox").value(elemento.PrecioTS);
        $("#TxtPrecioVenta").data("kendoNumericTextBox").value(elemento.PrecioVenta);
        $("#TxtCantidadTecnicas").data("kendoNumericTextBox").value(elemento.CantidadTecnicas);
        $("#TxtMontajes").data("kendoNumericTextBox").value(elemento.Montajes);
        $("#txtNoPersonalExtra").data("kendoNumericTextBox").value(elemento.PersonalExtra);
        $("#txtCantidadColores").data("kendoNumericTextBox").value(elemento.CantidadColores);
        $("#txtCantidadCombos").data("kendoNumericTextBox").value(elemento.CantidadCombos);
        $("#txtCantidadTallas").data("kendoNumericTextBox").value(elemento.CantidadTallas);
        $("#txtVelocidadMaquina").data("kendoNumericTextBox").value(elemento.VelocidadMaquina);
        $("#txtPorcVariacion").data("kendoNumericTextBox").value(elemento.PorcVariacion);
        $("#txtTiempoProyecto").data("kendoNumericTextBox").value(elemento.TiempoProyecto);
        $("#txtFM").val(elemento.NoFM);
        $("#TxtOrdenTrabajo").val(elemento.NoOT);

        var dataChart = [];

        if (VIdSer !== 2) {
            dataChart.push(
                {
                    category: "Costo de Materia Prima",
                    value: elemento.CostoMP,
                    color: "#011F4B"
                },
                {
                    category: "Costo de Mano de Obra Directa",
                    value: elemento.CostoMOD,
                    color: "#03396C"
                },
                {
                    category: "Costo Fabril",
                    value: elemento.CostoFabril,
                    color: "#005B96"
                },
                {
                    category: "Costo Operación",
                    value: elemento.CostoOperacion,
                    color: "#6497B1"
                },
                {
                    category: "Costo Termofijado",
                    value: elemento.CostoTermofijado,
                    color: "#178AB8"
                });
        }

        CrearGrafico($("#chart"), "Distribución de costos " + elemento.Nombre2, dataChart, "category", TipoGrafico.pie, true);
        ConfigSeriesxDefectoGrafico($("#chart"), true, PosicionLabel.outsideEnd, "#= category #: \n $#= kendo.toString(value,'n2')# - #= kendo.toString(percentage * 100.0, 'n2')#%");
        ConfigLeyendaGrafico($("#chart"), PosicionLeyenda.right, true, AlinearLeyenda.center);
        ConfigTituloGrafico($("#chart"), PosicionTitulo.bottom, true, AlinearLeyenda.center);
        ConfigTooltipGrafico($("#chart"), true, "${0}");
        ConfigExportarGrafico($("#chart"), "chartexp2", true, true, true);
    }

    $("#TxtEstado").val() !== "EDICION" ? KdoButtonEnable($("#btnRecalcular"), false) : KdoButtonEnable($("#btnRecalcular"), Permisos.SNProcesar);
    KdoButtonEnable($("#btnCambioEstado"), Permisos.SNCambiarEstados);
    $("#TxtEstado").val() !== "EDICION" ? Grid_HabilitaToolbar($("#gridRentabilidad"), false, false, false) : Grid_HabilitaToolbar($("#gridRentabilidad"), false, Permisos.SNEditar, false);
};

var fn_GetSimubyIdSimu = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestras/GetbyIdSimulacion/" + vIdSimulacion,
        type: 'GET',
        success: function (datos) {
            fn_SetCamposValores(datos);
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_RecalSimulacionVistaInf = function () {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestras/Recalcular/" + vIdOT.toString() + "/" + vIdSimulacion.toString() + "/" + kdoNumericGetValue($("#TxtNuevaCantidadPiezasRecalcular")) + "/" + kdoNumericGetValue($("#TxtNoMontajeRecalcular")) + "/" + kdoNumericGetValue($("#txtPersonalExtraRecalcular")) + "/" + kdoNumericGetValue($("#txtCombosRecalcular")) + "/" + kdoNumericGetValue($("#txtVeloMaquinaRecalcular")) + "/" + ($("#chkUsarTermofijadoRecalcular").is(':checked') ? "1" : "0"),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            PorcVariacion: kdoNumericGetValue($("#txtPorcVariacionRecalcular")),
            Tallas: $("#CmbTallasRecalcular").data("kendoMultiSelect").value().toString()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GetSimubyIdSimu();
            $("#gridSimuConsumo").data("kendoGrid").dataSource.read();
            $("#gridSimuConsumoArt").data("kendoGrid").dataSource.read();
            $("#gridRentabilidad").data("kendoGrid").dataSource.read();
            $("#MbtnSimuRecalcular").data("kendoDialog").close();
            kendo.ui.progress($(".k-dialog"), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($(".k-dialog"), false);
            ErrorMsg(data);
        }
    });
};


fPermisos = function (datos) {
    Permisos = datos;
};

var fn_getIdSeteo = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSeteo;
};
var fn_getIdEstacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdEstacion;
};

var fn_ConsultarConsumoArt = function (gridcab) {
    vxIdSeteo = fn_getIdSeteo(gridcab.data("kendoGrid"));
    vxIdEstacion = fn_getIdEstacion(gridcab.data("kendoGrid"));
    $("#gridSimuConsumoArt").data("kendoGrid").dataSource.read();
};

let fn_closeGSRecal = function () {
    $("#CmbTallasRecalcular").data("kendoMultiSelect").value("");
    $("#CmbTallasRecalcular").data("kendoMultiSelect").trigger("change");
    kdoNumericSetValue($("#NumCantidadTallasRecal"), 0);
};

let fn_getSimulacionesTallas = function (vidSim) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SimulacionesMuestrasTallas/GetbyIdSimulacion/" + vidSim,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdCategoriaTalla + ",";
            });

            $("#CmbTallasRecalcular").data("kendoMultiSelect").value(lista.split(","));
            kdoNumericSetValue($("#NumCantidadTallasRecal"), respuesta.length);
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};
