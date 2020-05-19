
let VIdSer = 0;
let VIdCliente = 0;
let VIDSim = 0;
let vIdModulo = 1;
let S_IdA = 0;
let DsInsuImpre;
let DsInsumTrans;
let DsInsuTin;
var Permisos;
let xIdCataInsuTrans;
let xIdCataInsuImpre;
let xIdCataConsu;

$(document).ready(function () {
    //#region Inicializacion de variables
    Fn_VistaConsultaRequerimiento($('#vConsulta'));
    KdoButton($("#btnRecalcular"), "gears", "Recalcular simulación");
    KdoButton($("#btnSimulacion"), "gear", "Nueva simulación");
    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnAceptar"), "check", "Aceptar");
    KdoButton($("#btnCambioEstado"), "check", "Cambio de estado");
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlApiServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlApiClient, "Nombre", "IdCliente", "Selecione un Cliente...");

    KdoComboBoxbyData($("#CmbInsuImp"), "[]", "Nombre", "IdCatalogoInsumo", "Seleccione Insumo..");
    KdoComboBoxbyData($("#CmbInsuTrans"), "[]", "Nombre", "IdCatalogoInsumo", "Seleccione Insumo..");
    KdoComboBoxbyData($("#CmbInsuTinta"), "[]", "Nombre", "IdCatalogoInsumo", "Seleccione Insumo..");

    DsInsuImpre = fn_Insum(2);
    DsInsumTrans = fn_Insum(1);
    DsInsuTin = fn_Insum(90);
    KdoComboBoxbyData($("#CmbInsuImp"), DsInsuImpre, "Nombre", "IdCatalogoInsumo", "Seleccione Insumo..");
    KdoComboBoxbyData($("#CmbInsuTrans"), DsInsumTrans, "Nombre", "IdCatalogoInsumo", "Seleccione Insumo..");
    KdoComboBoxbyData($("#CmbInsuTinta"), DsInsuTin, "Nombre", "IdCatalogoInsumo", "Seleccione Insumo..");

    //Programacion del splitter
    $("#splitter").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: true, size: "50%", max: "95%", min: "20%" },
            { collapsible: true, size: "50%" }
        ]

    });

    $(window).resize(function () {
        resizeSplitter($(window).height());
    });

    resizeSplitter = function (height) {

        var splElement = $("#splitter"),
            splObject = splElement.data("kendoSplitter");
        splElement.css({ height: height - height * 0.36 });
        setTimeout(function () {
            splObject.resize(true);
        }, 300);

    };
    $(".sidebar").hover(function () {
        resizeSplitter($(window).height());
    });

    resizeSplitter($(window).height());


    $("#TabSimulacion").kendoTabStrip({
        tabPosition: "left",
        animation: { open: { effects: "fadeIn" } }
    });


    let ValidNuevoSim = $("#FrmNuevoSim").kendoValidator({
        rules: {
            Mayor0: function (input) {
                if (input.is("[name='TxtNuevaCantidadPiezas']") && VIdSer !== 2) {
                    return input.val() > 0;
                }
                return true;
            },
            NoMontajeMayor0: function (input) {
                if (input.is("[name='TxtNoMontaje']") && VIdSer !== 2) {
                    return input.val() > 0;
                }
                return true;
            },
            PersonalMayorIgual0: function (input) {
                if (input.is("[name='txtPersonalExtra']") && VIdSer !== 2) {
                    return input.val() >= 0;
                }
                return true;
            },
            CombosMayorIgual0: function (input) {
                if (input.is("[name='txtCombos']") && VIdSer !== 2) {
                    return input.val() > 0;
                }
                return true;
            },
            VeloMayorIgual0: function (input) {
                if (input.is("[name='txtVeloMaquina']") && VIdSer !== 2) {
                    return input.val() > 0;
                }
                return true;
            },
            MsgCmbInsuImp: function (input) {
                if (input.is("[name='CmbInsuImp']") && VIdSer === 2 && kdoNumericGetValue($("#NumYardaImpHora")) !== null) {
                    return $("#CmbInsuImp").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            MsgCmbInsuTrans: function (input) {
                if (input.is("[name='CmbInsuTrans']") && VIdSer === 2 && kdoNumericGetValue($("#NumYardaTransHora")) !== null) {
                    return $("#CmbInsuTrans").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            MsgCmbInsuTinta: function (input) {
                if (input.is("[name='CmbInsuTinta']") && VIdSer === 2 && kdoNumericGetValue($("#NumConsumoTintas")) !== null) {
                    return $("#CmbInsuTinta").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            Mayor0: "La cantidad de piezas no puede ser 0.",
            NoMontajeMayor0: "El Montaje es requerido.",
            PersonalMayorIgual0: "La cantidad de personal extra no puede ser negativo.",
            CombosMayorIgual0: "La cantidad de combos no puede ser cero.",
            VeloMayorIgual0: "La velocidad de la maquina no puede ser cero",
            MsgCmbInsuImp: "requerido",
            MsgCmbInsuTrans: "requerido",
            MsgCmbInsuTinta:"requerido",
            required: "requerido"
        }
    }).data("kendoValidator");

    $("#TxtNuevaCantidadPiezas").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtNoMontaje").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#txtPersonalExtra").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 0,
        value: 0
    });

    $("#txtCombos").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    $("#txtVeloMaquina").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        min: 1,
        value: 1
    });

    let Url = $("#pvSimulacion").data("url");
    $.ajax({
        url: Url,
        async: false,
        type: 'GET',
        contentType:"text/html; charset=utf-8",
        success: function (resultado) {
            $("#pvSimulacion").html(resultado);
            fn_SetCamposSimulacion();
            DesHabilitarCamposSim();
        }
    });

    $("#btnSimulacion").data("kendoButton").enable(false);
    $("#btnRecalcular").data("kendoButton").enable(false);
    $("#btnCambioEstado").data("kendoButton").enable(false);

    //#endregion  fin Inicializacion de variABLES

    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION
    let DsRD = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlApiSimu + "/GetSimulacionesAnalisis/" + VIdSer + "/" + VIdCliente + "/" + vIdModulo; },
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSimulacion",
                fields: {
                    IdSimulacion: { type: "number" },
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
                    CantidadTecnicas: { type: "number" },
                    NoDocumento2: { type: "string" },
                    Fecha2: { type: "date" },
                    CostoUnitario: { type: "number" },
                    ProductividadHora: { type: "number" },
                    PrecioVenta: { type: "number" },
                    Nombre3: { type: "string" },
                    Nombre4: { type: "string" },
                    DisenoFullColor: { type: "boolean" },
                    TiempoProyecto: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Nombre5: { type: "string" },
                    NoDocumento3: { type: "string" },
                    Tecnicas: { type: "string" },
                    UsarTermofijado: { type: "boolean" },
                    IdTipoOperacionSublimado: { type: "number" },
                    OperacionTela: { type: "string" },
                    AnchoDiseno: { type: "number" },
                    IdUnidadDiseno: { type: "number" },
                    UnidadMedAncho: { type: "string" },
                    NombreVeloTransf: { type: "string" },
                    VelocidadTransf: { type: "number" },
                    UnidVeloTran: { type: "string" },
                    IdCataInsuTrans: { type: "number" },
                    NombreInsuTrans: { type: "string" },
                    PerfilImpresion: { type: "string" },
                    VelocidadImpre: { type: "number" },
                    UniVeloImpre: { type: "string" },
                    IdCataInsuImpre: { type: "number" },
                    NombreInsuImpre: { type: "string" },
                    Consumo: { type: "number" },
                    IdUnidadConsumo: { type: "number" },
                    UniConsumo: { type: "string" },
                    IdCataConsu: { type: "number" },
                    NombreCataConsumo: { type: "string" },
                    CostoMPTrans: { type: "number" },
                    CostoMODTrans: { type: "number" },
                    CostoPrimoTrans: { type: "number" },
                    CostoFabrilTrans: { type: "number" },
                    CostoProduccionTrans: { type: "number" },
                    CostoOperacionTrans: { type: "number" },
                    CostoTotalTrans: { type: "number" },
                    CostoPapelProtec: { type: "number" },
                    CostoPapelImp: { type: "number" },
                    CostoTinta: { type: "number" },
                    CostoLimpieza: { type: "number" }
                }
            }
        }
    });

    $("#gridSimulacion").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento2", title: "No.Simulación" },
            { field: "Fecha2", title: "Fecha simulación", format: "{0: dd/MM/yyyy}"},
            { field: "IdSimulacion", title: "Cod. simulación", hidden: true },
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true },
            {
                field: "NoDocumento1", title: "No Requerimiento", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerRequerimientoConsulta(" + data["IdRequerimiento"] + ")' >" + data["NoDocumento1"] + "</button>";
                }
            },
            {field: "IdAnalisisDiseno", title: "Cod. análisis diseño", hidden:true },
            {
                field: "NoDocumento3", title: "No Analisis Diseño", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerAnalisis(" + data["IdAnalisisDiseno"] + ")' >" + data["NoDocumento3"] + "</button>";
                }

            },
            { field: "Fecha1", title: "Fecha del análisis", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "Fecha", title: "Fecha del requeimiento", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "Nombre2", title: "Nombre del diseño" },
            { field: "EstiloDiseno", title: "Estilo diseno" },
            { field: "NumeroDiseno", title: "Número diseno" },
            { field: "IdPrograma", title: "Código Programa", hidden: true },
            { field: "NoDocumento", title: "No Programa" },
            { field: "Nombre3", title: "Nombre del programa" },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta cliente" },
            { field: "Nombre4", title: "Nombre del cliente" },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "Nombre", title: "Servicio", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "Nombre1", title: "Ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Talla principal", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Tecnicas", title: "Técnicas" },
            {field: "Nombre5", title: "Estado simulación", template: function (data) {
                return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["Nombre5"] + "</button>";
               }
            },
            { field: "Estado1", title: "Estado del Analisis", hidden: true },
            { field: "InstruccionesEspeciales", title: "Instrucciones especiales", hidden: true },
            { field: "CostoMP", title: "Costo de Materia Prima Total", format: "{0:c2}",hidden: true  },
            { field: "CostoMOD", title: "Costo de Mano de Obra Directa", format: "{0:c2}",hidden: true  },
            { field: "CostoPrimo", title: "Costo Primo", format: "{0:c2}",hidden: true },
            { field: "CostoFabril", title: "Costo Fabril Total", format: "{0:c2}",hidden: true },
            { field: "CostoProduccion", title: "Costo Producción", format: "{0:c2}", hidden: true  },
            { field: "CostoOperacion", title: "Costo Operación", format: "{0:c2}",hidden: true  },
            { field: "CostoTotal", title: "Costo Total", format: "{0:c2}", hidden: true },
            { field: "PorcUtilidadConsiderada", title: "% Utilidad Considerada", format: "{0:p2}", hidden: true },
            { field: "UtilidadDolares", title: "Utilidad Dolares", format: "{0:c4}", hidden: true },
            { field: "PrecioCliente", title: "Precio Cliente", format: "{0:c4}", hidden: true },
            { field: "PrecioTS", title: "Precio Techno Screen", format: "{0:c4}",hidden: true },
            { field: "CantidadTecnicas", title: "Cantidad Técnicas", hidden: true },
            { field: "CostoUnitario", title: "Costo Unitario", format: "{0:c4}",hidden: true },
            { field: "ProductividadHora", title: "Productividad Hora", hidden: true },
            { field: "PrecioVenta", title: "Precio Venta", format: "{0:c4}", hidden: true },
            { field: "DisenoFullColor", title: "Diseno FullColor", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "DisenoFullColor"); }, hidden: true },
            { field: "TiempoProyecto", title: "Tiempo Proyecto", format: "{0:n}", hidden: true },
            { field: "IdBase", title: "IdBase", hidden: true }
        ]
    });

    SetGrid($("#gridSimulacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridSimulacion").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimulacion").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimulacion").data("kendoGrid"), DsRD);

   

    $("#CmbIdServicio").data("kendoComboBox").bind("select", function (e) {
        kendo.ui.progress($("#CmbIdServicio"), true);
        if (e.item) {
            if (this.dataItem(e.item.index()).IdServicio === 1)
                $("#gridSimuConsumo").data("kendoGrid").showColumn("Nombre1");
            else {
                $("#gridSimuConsumo").data("kendoGrid").hideColumn("Nombre1");
                $("#gridSimuConsumo").data("kendoGrid").hideColumn("Nombre2");
            }

            Fn_Consultar(this.dataItem(e.item.index()).IdServicio.toString(), Kendo_CmbGetvalue($("#CmbIdCliente")));
        } else {
            Fn_Consultar(0, Kendo_CmbGetvalue($("#CmbIdCliente")));
        }

    });

    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        kendo.ui.progress($("#CmbIdServicio"), true);
        let value = this.value();
        if (value === "") {
            Fn_Consultar(0, Kendo_CmbGetvalue($("#CmbIdCliente")));
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdServicio")), this.dataItem(e.item.index()).IdCliente.toString());
        } else {
            Fn_Consultar(0, 0);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_Consultar(Kendo_CmbGetvalue($("#CmbIdServicio")), 0);
        }
    });

    var selectedRows = [];
    $("#gridSimulacion").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimulacion"), selectedRows);
    });

    $("#gridSimulacion").data("kendoGrid").bind("change", function (e) {
        getSimulacionGrid($("#gridSimulacion").data("kendoGrid"));
        VIDSim = getIdSimulacion($("#gridSimulacion").data("kendoGrid"));
        S_IdA = getIdAD($("#gridSimulacion").data("kendoGrid"));
        $("#gridRentabilidad").data("kendoGrid").dataSource.data([]);
        $("#gridRentabilidad").data("kendoGrid").dataSource.read();
        $("#gridSimuConsumo").data("kendoGrid").dataSource.data([]);
        $("#gridSimuConsumo").data("kendoGrid").dataSource.read();
        if (VIdSer === 2) {
            $("#dbgPartesSub").data("kendoGrid").dataSource.data([]);
            $("#dbgPartesSub").data("kendoGrid").dataSource.read();
        }
        Grid_HabilitaToolbar($("#gridSimuConsumo"), Permisos.SNAgregar ? true : false, Permisos.SNEditar ? true : false, Permisos.SNBorrar ? true : false);
        Grid_HabilitaToolbar($("#gridRentabilidad"), Permisos.SNAgregar ? true : false, Permisos.SNEditar ? true : false, Permisos.SNBorrar ? true : false);
        $("#btnSimulacion").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnRecalcular").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnCambioEstado").data("kendoButton").enable(fn_SNProcesar(true));
        Grid_SelectRow($("#gridSimulacion"), selectedRows);        
    });
    //#endregion FIN GRID PRINCIPAL

    //#region CRUD para el grid Rentabilidad
    let DsRent = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSimRen + "/GetSimulacionesRentabilidadBySimulaciones/" + VIDSim; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSimRen + "/" + datos.IdSimulacionRentabilidad; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlSimRen + "/" + datos.IdSimulacionRentabilidad; },
                type: "DELETE"
            },
            create: {
                url: UrlSimRen,
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
                } else {
                    PrecioVenta =0;
                    Rentabilidad =0;
                    PrecioTS = 0;
                    PrecioCliente =0;
                    Utilidad =0;
                }
                let uid = $("#gridSimulacion").data("kendoGrid").dataSource.get(e.response[0].IdSimulacion).uid;
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PrecioVenta", PrecioVenta);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PorcUtilidadConsiderada",Rentabilidad);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("UtilidadDolares", Utilidad);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PrecioCliente", PrecioCliente);
                $("#gridSimulacion").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']").set("PrecioTS",PrecioTS);

                $("#TxtPrecioCliente").data("kendoNumericTextBox").value(PrecioCliente);
                $("#TxtPrecioTS").data("kendoNumericTextBox").value(PrecioTS);
                $("#TxtPrecioVenta").data("kendoNumericTextBox").value(PrecioVenta);
                $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(Rentabilidad);
                $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(Utilidad);
                $(".k-dirty-cell", $("#gridSimulacion")).removeClass("k-dirty-cell");
                $(".k-dirty", $("#gridSimulacion")).remove();
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
                        type: "number", defaultValue: function (e) { return getIdSimulacion($("#gridSimulacion").data("kendoGrid")); }
                    },
                    IdRentabilidad: { type: "string", defaultValue:null },
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
                                    return $("[name='PrecioVenta']").data("kendoNumericTextBox").value() >0;
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
                        type: "number", defaultValue: function (e) { return VIdSer !== 2 ? $("#TxtCostoUnitario").data("kendoNumericTextBox").value() : 0;}

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

                $('[name="CU"]').data("kendoNumericTextBox").value(VIdSer === 2 ? kdoNumericGetValue($("#TxtCostoTotalMasTrans")):  $("#TxtCostoUnitario").data("kendoNumericTextBox").value());

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
                let PrecioVenta = fn_RoundToUp((Utilidad + CU),4);
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
            { field: "IdSimulacionRentabilidad", title: "IdSimulacionRentabilidad",hidden:true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden:true},
            { field: "IdRentabilidad", title: "IdRentabilidad", editor: Grid_Combox, values: ["IdRentabilidad", "Nombre", UrlFac, "", "Seleccione...."], hidden: true },
            { field: "CU", title: "Costo Unitario", editor: Grid_ColNumeric, values: ["", "0.0000", "99999999999999.99", "c4", 4], hidden: true},
            { field: "Descripcion", title: "Descripción" },
            { field: "Rentabilidad", title: "Rentabilidad", editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4] ,format:"{0:P2}"},
            { field: "Utilidad", title: "Utilidad $", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c4", 4], format: "{0:c4}"},
            { field: "PrecioVenta", title: "Precio Venta $", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c4", 4],format: "{0:c4}"},
            { field: "Aprobado", title: "Aprobar", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Aprobado"); } }
        ]

    });

    SetGrid($("#gridRentabilidad").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridRentabilidad").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridRentabilidad").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridRentabilidad").data("kendoGrid"), DsRent);

    Grid_HabilitaToolbar($("#gridRentabilidad"), false, false, false);

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
                url: function (datos) { return UrlSimConsumo + "/GetSimulacionesConsumoBySimulaciones/" + VIDSim; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSimConsumo + "/" + datos.IdSimulacionConsumo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlSimConsumo + "/" + datos.IdSimulacionConsumo; },
                type: "DELETE"
            },
            create: {
                url: UrlSimConsumo,
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
                id: "IdSimulacionConsumo",
                fields: {
                    IdSimulacionConsumo: { type: "number" },
                    IdSimulacion: {
                        type: "number", defaultValue: function (e) { return getIdSimulacion($("#gridSimulacion").data("kendoGrid")); }
                    },
                    Costo: { type: "number" },
                    FechaMod: { type: "date" },
                    IdTecnica: { type: "string" },
                    Nombre: { type: "string" },
                    IdCostoTecnica: { type: "string" },
                    Nombre1: { type: "string" },
                    IdUnidad: { type: "string" },
                    Nombre2: { type: "string" },
                    IdCatalogoInsumo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdCatalogoInsumo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCatalogoInsumo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre3: { type: "string" },
                    Consumo: { type: "number" }
                }
            }
        }
    });

    $("#gridSimuConsumo").kendoGrid({
        edit: function (e) {
 
            KdoHideCampoPopup(e.container, "IdSimulacionConsumo");
            KdoHideCampoPopup(e.container, "IdSimulacion");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "Nombre3");
            KdoHideCampoPopup(e.container, "FechaMod");
           
            if (e.model.EsBase === true) {
                $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(GetNewDSTec());
                KdoHideCampoPopup(e.container, "IdTecnica");
                KdoHideCampoPopup(e.container, "IdCostoTecnica");
            }
            else {
             
                KdoHideCampoPopup(e.container, "Nombre");

                if (Kendo_CmbGetvalue($("#CmbIdServicio")) !== "1") {
                    $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(GetNewDSTec());
                    KdoHideCampoPopup(e.container, "IdCostoTecnica");
                } else {
                    $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(getDsComboTenica());
                    $('[name="IdCostoTecnica"]').data("kendoComboBox").setDataSource(getDsCostoTec(e.model.IdTecnica));
                }
            }
            $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(fn_getInsumos());   

            KdoHideCampoPopup(e.container, "Consumo");
            KdoHideCampoPopup(e.container, "Costo");
            KdoHideCampoPopup(e.container, "IdUnidad");
            
            KdoDatePikerEnable($('[name="FechaMod"]'), false);
            Grid_Focus(e, "Rentabilidad");

            $('[name="IdTecnica"]').on('change', function (e, dtmodel) {
              
                $('[name="IdCatalogoInsumo"]').data("kendoComboBox").value("");
                MostrarCamposxTecnica();
               
                // asignar DataSource al combobox tecnica
                $('[name="IdCostoTecnica"]').data("kendoComboBox").setDataSource(getDsCostoTec(Kendo_CmbGetvalue($('[name="IdTecnica"]'))));
                $('[name="IdCostoTecnica"]').data("kendoComboBox").value("");
            });

            if (!e.model.isNew()) {
                MostrarCamposxTecnica();
            }

                 
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSimulacionConsumo", title: "IdSimulacionConsumo", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "FechaMod", title: "Fecha Modificación", format: "{0:dd/MM/yyyy}", hidden: true },
            { field: "IdTecnica", title: "Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione...."], hidden: true },
            { field: "Nombre", title: "Nombre Técnica", editor: Grid_ColLocked },
            { field: "IdCostoTecnica", title: "Costo Técnica", editor: Grid_Combox, values: ["IdCostoTecnica", "Nombre", UrlCosTec, "", "Seleccione....", "", "IdTecnica", ""], hidden: true },
            { field: "Nombre1", title: "Nombre Costo Técnica", hidden: true },
            { field: "IdCatalogoInsumo", title: "Catalogo Insumo", editor: Grid_Combox, values: ["IdCatalogoInsumo", "Nombre", UrlCatalo, "", "Seleccione....","required","","Requerido"], hidden: true },
            { field: "Nombre3", title: "Catalogo Insumo" },
            { field: "Consumo", title: "Consumo", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n4", 4], format: "{0:n4}" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "c", 4], format: "{0:c4}" },
            { field: "IdUnidad", title: "IdUnidad", editor: Grid_Combox, values: ["IdUnidad", "Nombre", UrlUM, "", "Seleccione...."], hidden: true },
            { field: "Nombre2", title: "Unidad de Medida" }
        ]

    });

    SetGrid($("#gridSimuConsumo").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridSimuConsumo").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimuConsumo").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridSimuConsumo").data("kendoGrid"), DsSimConsu);

    Grid_HabilitaToolbar($("#gridSimuConsumo"), false, false, false);

    var selectedRowsConsumos = [];
    $("#gridSimuConsumo").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimuConsumo"), selectedRowsConsumos);
    });

    $("#gridSimuConsumo").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimuConsumo"), selectedRowsConsumos);
    });
 
    //#endregion Fin RUD para el grid Rentabilidad
   
    //#region Precotizar una nueva
    $("#btnAceptar").click(function (event) {
        event.preventDefault();
        if (ValidNuevoSim.validate()) { ConfirmacionMsg("¿Está seguro de generar una nueva simulación de pre-costeo para el requerimiento : " + fn_NoRequerimiento($("#gridSimulacion").data("kendoGrid")).toString(), function () { return fn_NuevaSimulacion();}); } 
    });

    $("#btnRecalcular").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("¿Está seguro de volver a generar la simulación de pre-costeo para la simulación: " + fn_getNoSimulacion($("#gridSimulacion").data("kendoGrid")).toString() + "?", function () { return fn_RecalcularSimulacion();});
    });

    $("#btnSimulacion").click(function () {
        ValidNuevoSim.hideMessages();
        switch (VIdSer) {
            case 1:
                $('[for="TxtNoMontaje"]').prop('hidden', false);
                KdoNumericShow($("#TxtNoMontaje"));
                $('[for="txtCombos"]').prop('hidden', false);
                KdoNumericShow($("#txtCombos"));
                $('[for="txtVeloMaquina"]').prop('hidden', false);
                KdoNumericShow($("#txtVeloMaquina"));
                $('[for="TxtNuevaCantidadPiezas"]').prop('hidden', false);
                KdoNumericShow($("#TxtNuevaCantidadPiezas"));
                $('[for="txtPersonalExtra"]').prop('hidden', false);
                KdoNumericShow($("#txtPersonalExtra"));
                $('[for="chkUsarTermofijado"]').prop('hidden', false);
                $('#chkUsarTermofijado').prop('hidden', false);
                $('#chkUsarTermofijado').prop('disabled', false);

                $('[for="CmbInsuImp"]').prop('hidden', true);
                KdoCmbHide($("#CmbInsuImp"));
                $('[for="CmbInsuTrans"]').prop('hidden', true);
                KdoCmbHide($("#CmbInsuTrans"));
                $('[for="CmbInsuTinta"]').prop('hidden', true);
                KdoCmbHide($("#CmbInsuTinta"));
                $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").focus();


                $("#row1").prop('hidden', true);
                $("#row2").prop('hidden', true);
                $("#row3").prop('hidden', true);

                $("#row4").prop('hidden', false);
                $("#row5").prop('hidden', false);
                $("#row6").prop('hidden', false);
                $("#row7").prop('hidden', false);
                $("#row8").prop('hidden', false);
                $("#row9").prop('hidden', false);

                KdoCmbSetValue($("#CmbInsuImp"), 0);
                KdoCmbSetValue($("#CmbInsuTrans"), 0);
                KdoCmbSetValue($("#CmbInsuTinta"), 0);

                break;
            case 2:
                //$("#CmbInsuImp").data("kendoComboBox").setDataSource(DsInsuImpre);
                //$("#CmbInsuTrans").data("kendoComboBox").setDataSource(DsInsumTrans);
                //$("#CmbInsuTinta").data("kendoComboBox").setDataSource(DsInsuTin);

                $('[for="TxtNoMontaje"]').prop('hidden', true);
                KdoNumericHide($("#TxtNoMontaje"));
                $('[for="txtCombos"]').prop('hidden', true);
                KdoNumericHide($("#txtCombos"));
                $('[for="txtVeloMaquina"]').prop('hidden', true);
                KdoNumericHide($("#txtVeloMaquina"));
                $('[for="TxtNuevaCantidadPiezas"]').prop('hidden', true);
                KdoNumericHide($("#TxtNuevaCantidadPiezas"));
                $('[for="txtPersonalExtra"]').prop('hidden', true);
                KdoNumericHide($("#txtPersonalExtra"));
                $('[for="chkUsarTermofijado"]').prop('hidden', true);
                $('#chkUsarTermofijado').prop('hidden', true);
                $('#chkUsarTermofijado').prop('disabled', true);

                KdoCmbShow($("#CmbInsuImp"));
                kdoNumericGetValue($("#NumYardaImpHora")) === null ? KdoComboBoxEnable($("#CmbInsuImp"), false) : KdoComboBoxEnable($("#CmbInsuImp"), true);

                KdoCmbShow($("#CmbInsuTrans"));
                kdoNumericGetValue($("#NumYardaTransHora")) === null ? KdoComboBoxEnable($("#CmbInsuTrans"), false) : KdoComboBoxEnable($("#CmbInsuTrans"), true);

                KdoCmbShow($("#CmbInsuTinta"));
                kdoNumericGetValue($("#NumConsumoTintas")) === null ? KdoComboBoxEnable($("#CmbInsuTinta"), false) : KdoComboBoxEnable($("#CmbInsuTinta"), true);

                $("#row1").prop('hidden', false);
                $("#row2").prop('hidden', false);
                $("#row3").prop('hidden', false);

                $("#row4").prop('hidden', true);
                $("#row5").prop('hidden', true);
                $("#row6").prop('hidden', true);
                $("#row7").prop('hidden', true);
                $("#row8").prop('hidden', true);
                $("#row9").prop('hidden', true);
                $('[for="CmbInsuImp"]').prop('hidden', false);
                KdoCmbSetValue($("#CmbInsuImp"), xIdCataInsuImpre);
                $('[for="CmbInsuTrans"]').prop('hidden', false);
                KdoCmbSetValue($("#CmbInsuTrans"), xIdCataInsuTrans);
                $('[for="CmbInsuTinta"]').prop('hidden', false);
                KdoCmbSetValue($("#CmbInsuTinta"), xIdCataConsu);

                break;
            default:
                $('[for="TxtNoMontaje"]').prop('hidden', true);
                KdoNumericHide($("#TxtNoMontaje"));
                $('[for="txtCombos"]').prop('hidden', true);
                KdoNumericHide($("#txtCombos"));
                $('[for="txtVeloMaquina"]').prop('hidden', true);
                KdoNumericHide($("#txtVeloMaquina"));
                $('[for="TxtNuevaCantidadPiezas"]').prop('hidden', false);
                KdoNumericShow($("#TxtNuevaCantidadPiezas"));
                $('[for="txtPersonalExtra"]').prop('hidden', true);
                KdoNumericHide($("#txtPersonalExtra"));
                $('[for="chkUsarTermofijado"]').prop('hidden', true);
                $('#chkUsarTermofijado').prop('hidden', true);
                $('#chkUsarTermofijado').prop('disabled', false);

                $('[for="CmbInsuImp"]').prop('hidden', true);
                KdoCmbHide($("#CmbInsuImp"));
                $('[for="CmbInsuTrans"]').prop('hidden', true);
                KdoCmbHide($("#CmbInsuTrans"));
                $('[for="CmbInsuTinta"]').prop('hidden', true);
                KdoCmbHide($("#CmbInsuTinta"));

                $("#row1").prop('hidden', true);
                $("#row2").prop('hidden', true);
                $("#row3").prop('hidden', true);

                $("#row4").prop('hidden', false);
                $("#row5").prop('hidden', true);
                $("#row6").prop('hidden', true);
                $("#row7").prop('hidden', true);
                $("#row8").prop('hidden', true);
                $("#row9").prop('hidden', true);
                $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").focus();

                KdoCmbSetValue($("#CmbInsuImp"), 0);
                KdoCmbSetValue($("#CmbInsuTrans"), 0);
                KdoCmbSetValue($("#CmbInsuTinta"), 0);
        }
        $("#NuevaSimulacion").modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });

        
    });

    $('#NuevaSimulacion').on('hidden.bs.modal', function (e) {
        $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").value(0);
        $("#TxtNoMontaje").data("kendoNumericTextBox").value(0);
        $("#txtPersonalExtra").data("kendoNumericTextBox").value(0);
        $("#txtCombos").data("kendoNumericTextBox").value(0);
        $("#txtVeloMaquina").data("kendoNumericTextBox").value(0);
        $("#chkUsarTermofijado").prop("checked", false);
    });

    $('#NuevaSimulacion').on('shown.bs.modal', function (e) {
        getRDS();
    });

    //#region vista consulta estados

    Fn_VistaConsultaRequerimientoEstados($("#vConsultaEstados"));

    //#endregion fin vista consulta estados

    //#region vista consulta Analisis

    Fn_VistaConsultaAnalisis($("#vConsultaAnalisis"));

    //#endregion fin vista consulta analisis

    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"));

    $("#btnCambioEstado").click(function () {
        Fn_VistaCambioEstadoMostrar("Simulaciones", fn_getEstadoActual($("#gridSimulacion").data("kendoGrid")), UrlApiSimu + "/Simulaciones_CambiarEstado", "Sp_CambioEstado", getIdSimulacion($("#gridSimulacion").data("kendoGrid")));
    });

   

    //#endregion 
});

let getDsComboTenica = function () {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: UrlTec + "/GetbyBase/" + fn_getIdBase($("#gridSimulacion").data("kendoGrid")),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let GetNewDSTec = function () {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: UrlTec + "/GetbyServicio/" + Kendo_CmbGetvalue($("#CmbIdServicio")),
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });

};

let getDsCostoTec = function (idtecnica) {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    url: UrlCosTec + "/" + fn_getIdBase($("#gridSimulacion").data("kendoGrid")) + "/" + idtecnica.toString(),
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

let MostrarCamposxTecnica = function () {
    kendo.ui.progress($("#splitter"), true);

    $.ajax({
        url: UrlTec + "/" + Kendo_CmbGetvalue($('[name="IdTecnica"]')),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {

                if ((Kendo_CmbGetvalue($("#CmbIdServicio")) === "1") || (Kendo_CmbGetvalue($("#CmbIdServicio")) === "2")) {
                    if (respuesta.EsPapel === true || respuesta.EsImpresion === true || respuesta.EsSublimacion === true) {

                        KdoComboBoxEnable($('[name="IdCatalogoInsumo"]'), true);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(fn_getInsumos());
                    }

                    if (respuesta.EsEstampado === true) {
                        KdoComboBoxEnable($('[name="IdCatalogoInsumo"]'), false);
                        $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();
                    }
                }


                if (Kendo_CmbGetvalue($("#CmbIdServicio")) === "3") {

                    KdoComboBoxEnable($('[name="IdCatalogoInsumo"]'), true);
                    $('[name="IdCatalogoInsumo"]').data("kendoComboBox").input.focus();

                    $('[name="IdCatalogoInsumo"]').data("kendoComboBox").setDataSource(fn_getInsumos());
                }


            } else {
                KdoComboBoxEnable($('[name="IdCatalogoInsumo"]'), false);
            }

            kendo.ui.progress($("#splitter"), false);
        },
        error: function () {
            kendo.ui.progress($("#splitter"), false);
        }
    });
};

let fn_getInsumos = function () {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
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
};

let fn_NuevaSimulacion = function () {
    kendo.ui.progress($("#splitter"), true);
    if (VIdSer !== 2) {
        $.ajax({
            url: UrlApiSimu + "/Procesar/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString() + "/" + $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").value() + "/" + $("#TxtNoMontaje").data("kendoNumericTextBox").value() + "/" + $("#txtPersonalExtra").data("kendoNumericTextBox").value() + "/" + $("#txtCombos").data("kendoNumericTextBox").value() + "/" + $("#txtVeloMaquina").data("kendoNumericTextBox").value() + "/" + ($("#chkUsarTermofijado").is(':checked') ? "1" : "0"),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridSimulacion").data("kendoGrid").dataSource.read();
                $("#NuevaSimulacion").modal('hide');
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }
    if (VIdSer === 2) {
        $.ajax({
            url: UrlApiSimu + "/ProcesarSublimado/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString() + "/" + KdoCmbGetValue($("#CmbInsuImp")) + "/" + KdoCmbGetValue($("#CmbInsuTinta")) + "/" + KdoCmbGetValue($("#CmbInsuTrans")),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridSimulacion").data("kendoGrid").dataSource.read();
                $("#NuevaSimulacion").modal('hide');
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });


    }
   
};

let fn_RecalcularSimulacion = function () {
    kendo.ui.progress($("#splitter"), true);

    let UrlRecal = UrlApiSimu + "/" + (VIdSer !== 2 ? "Recalcular" : "RecalcularSublimado" ) + "/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString() + "/" + getIdSimulacion($("#gridSimulacion").data("kendoGrid")).toString(); 

    $.ajax({
        url: UrlRecal,
        type: "Post",
        dataType: "json",
        data: {},
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#gridSimulacion").data("kendoGrid").dataSource.read();
            kendo.ui.progress($("#splitter"), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($("#splitter"), false);
            ErrorMsg(data);
        }
    });
};

//#region get requeriento desarrollo
let getRDS = function () {
    kendo.ui.progress($("#NuevaSimulacion"), true);
    $.ajax({
        url: UrlRequeDesarrollo + "/" + fn_getIdRequerimiento($("#gridSimulacion").data("kendoGrid")).toString(),
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (respuesta) {
            $.each(respuesta, function (index, elemento) {
                $("#TxtNoMontaje").data("kendoNumericTextBox").value(elemento.Montaje);
                $("#TxtNuevaCantidadPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
                $("#txtCombos").data("kendoNumericTextBox").value(elemento.Combo);
                $("#txtVeloMaquina").data("kendoNumericTextBox").value(elemento.VelocidadMaquina);
                $('#chkUsarTermofijado').prop('checked', false);
            });

            kendo.ui.progress($("#NuevaSimulacion"), false);
        },
        error: function () {
            kendo.ui.progress($("#NuevaSimulacion"), false);
        }
    });
};
//#endregion
//#region Metodos Generales
let Fn_Consultar = function (IdServicio, IdCliente) {
    kendo.ui.progress($("#splitter"), true);
    VIdSer = Number(IdServicio);
    VIdCliente = Number(IdCliente);
    vistaP = $("#pvSimulacion");
    let Url = VIdSer === 2 ? "/Simulaciones/SimulacionDatosSubli" : "/Simulaciones/SimulacionDatos";
    let UrlPartes = VIdSer === 2 ? "/Simulaciones/CostosPorPartes" : "";

    if (UrlPartes !== "") {
        $.ajax({
            url: UrlPartes,
            async: false,
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                $("#pvCostosPorPartes").html(resultado);
            }
        });
    }
    else {
        $("#pvCostosPorPartes").empty();
    }

    $.ajax({
        url: Url,
        async: false,
        type: 'GET',
        contentType: "text/html; charset=utf-8",
        datatype: "html", 
        success: function (resultado) {
            $("#pvSimulacion").html(resultado);
            fn_SetCamposSimulacion();
            DesHabilitarCamposSim();
        }
    });

    VIdCliente === 0 ? $("#gridSimulacion").data("kendoGrid").showColumn("Nombre4") : $("#gridSimulacion").data("kendoGrid").hideColumn("Nombre4");
    // limpiar etapas del proceso
    CargarEtapasProceso(0);
    //leer grid
    $("#gridSimulacion").data("kendoGrid").dataSource.data([]);
    $("#gridSimulacion").data("kendoGrid").dataSource.read();

    if ($("#gridSimulacion").data("kendoGrid").dataSource.total() === 0) {
        $("#gridRentabilidad").data("kendoGrid").dataSource.data([]);
        $("#gridSimuConsumo").data("kendoGrid").dataSource.data([]);
        Grid_HabilitaToolbar($("#gridSimuConsumo"), false, false, false);
        Grid_HabilitaToolbar($("#gridRentabilidad"), false, false, false);
        fn_LimpiarCamposSim();
        $("#btnSimulacion").data("kendoButton").enable(false);
        $("#btnRecalcular").data("kendoButton").enable(false);
        $("#btnCambioEstado").data("kendoButton").enable(false);
    } else {
        $("#btnSimulacion").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnRecalcular").data("kendoButton").enable(fn_SNProcesar(true));
        $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
    }
    kendo.ui.progress($("#splitter"), false);
};

let fn_SetCamposSimulacion = function () {
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

    $("#txtTiempoProyecto").kendoNumericTextBox({
        format: "n4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });

    if (VIdSer !==2 ) {
        fn_SeteoCampos();
    }
    if (VIdSer === 2) {
        fn_SeteoCamposSublimacion();
    }
   
};

let fn_SeteoCampos = function () {
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

let fn_SeteoCamposSublimacion = function () {
    $("#NumAnchoimp").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumAltoimp").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumConsumoYarda").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumPeronalTransferencia").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#NumPeronalImpresion").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#NumYardaImpHora").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumConsumoTintas").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumYardaTransHora").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumCostoPapelImp").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumCostoTinta").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoPrimoSubli").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumCostoPapelProtec").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumCostoAdicionales").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumCostoPrimoTransSubli").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoTotalMasTrans").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoMODTrans").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoFabrilTrans").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoProduccionTrans").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoOperacionTrans").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoTotalTrans").kendoNumericTextBox({
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtComentariosTecnicos").autogrow({ vertical: true, horizontal: false, flickering: false });
    fn_GridPartes();

};


function onCloseCambioEstado(e) {
    $("#gridSimulacion").data("kendoGrid").dataSource.read();
}

/**
 * muestra vista modal esados.
 * @param {number} IdRequerimiento PK del requerimiento de desarrollo
 */
function Fn_VerEstados(IdRequerimiento) {
    Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null", IdRequerimiento);
}

function Fn_VerRequerimientoConsulta(idrequerimiento) {

    Fn_VistaConsultaRequerimientoGet($('#vConsulta'), idrequerimiento);
}
/**
 * Muestra vista modal consulta analisis
 * @param {number} IdAnalisisDiseno codigo  de analisis de diseño
 */
function Fn_VerAnalisis(IdAnalisisDiseno) {
    Fn_VistaConsultaAnalisisDisenosGet($("#vConsultaAnalisis"), parseInt($("#CmbIdServicio").data("kendoComboBox").value()), IdAnalisisDiseno);
}

function getSimulacionGrid(g) {
    var elemento = g.dataItem(g.select());
    $("#TxtFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha2), 'dd/MM/yyyy'));
    $("#TxtCantidadPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
    $("#TxtCostoMOD").data("kendoNumericTextBox").value(elemento.CostoMOD);
    $("#TxtCostoFabril").data("kendoNumericTextBox").value(elemento.CostoFabril);
    $("#TxtCostoProduccion").data("kendoNumericTextBox").value(elemento.CostoProduccion);
    $("#TxtCostoOperacion").data("kendoNumericTextBox").value(elemento.CostoOperacion);
    $("#TxtCostoTotal").data("kendoNumericTextBox").value(elemento.CostoTotal);
    $("#chkUsarTermo").prop("checked", elemento.UsarTermofijado);
    $("#TxtNoDocumento").val(elemento.NoDocumento2);
    $("#TxtEstado").val(elemento.Estado);
    if (VIdSer !== 2) {
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
        $("#txtTiempoProyecto").data("kendoNumericTextBox").value(elemento.TiempoProyecto);
        xIdCataInsuTrans = "";
        xIdCataInsuImpre = "";
        xIdCataConsu = "";
    }

    if (VIdSer === 2) {
        $("#TxtOperTela").val(elemento.OperacionTela);
        kdoNumericSetValue($("#NumAnchoimp"), elemento.AnchoDiseno);
        kdoNumericSetValue($("#NumAltoimp"), elemento.AltoDiseno);
        kdoNumericSetValue($("#NumConsumoYarda"), elemento.ConsumoYarda);
        $("#TxtUniAnchoimp").val(elemento.UnidadMedAncho);
        $("#TxtPerfilImpresion").val(elemento.PerfilImpresion);
        $("#TxtVelocidadTransferencia").val(elemento.NombreVeloTransf);
        $("#TxtPapelSelecionado").val(elemento.NombreInsuImpre);
        kdoNumericSetValue($("#NumYardaImpHora"), elemento.VelocidadImpre);
        kdoNumericSetValue($("#NumYardaTransHora"), elemento.VelocidadTransf);
        kdoNumericSetValue($("#NumConsumoTintas"), elemento.Consumo);
        $("#TxtConsumoTinta").val(elemento.UniConsumo);
        xIdCataInsuTrans = elemento.IdCataInsuTrans;
        xIdCataInsuImpre = elemento.IdCataInsuImpre;
        xIdCataConsu = elemento.IdCataConsu;
        kdoNumericSetValue($("#TxtCostoMODTrans"), elemento.CostoMODTrans);
        //CostoMPTrans
        kdoNumericSetValue($("#TxtCostoFabrilTrans"), elemento.CostoFabrilTrans);
        //CostoPrimoTrans
        kdoNumericSetValue($("#TxtCostoProduccionTrans"), elemento.CostoProduccionTrans);
        kdoNumericSetValue($("#TxtCostoOperacionTrans"), elemento.CostoOperacionTrans);
        kdoNumericSetValue($("#TxtCostoTotalTrans"), elemento.CostoTotalTrans);
        kdoNumericSetValue($("#TxtCostoPrimoSubli"), elemento.CostoPrimo);
        kdoNumericSetValue($("#NumCostoPrimoTransSubli"), elemento.CostoPrimoTrans);
        kdoNumericSetValue($("#TxtCostoTotalMasTrans"), elemento.CostoTotalTrans + elemento.CostoTotal);
        $("#TxtComentariosTecnicos").val(elemento.InstruccionesEspeciales);
        kdoNumericSetValue($("#NumCostoPapelImp"), elemento.CostoPapelImp);
        kdoNumericSetValue($("#NumCostoTinta"), elemento.CostoTinta);
        kdoNumericSetValue($("#NumCostoPapelProtec"), elemento.CostoPapelProtec);
        kdoNumericSetValue($("#NumPeronalTransferencia"), elemento.NoOperariosTrans);
        kdoNumericSetValue($("#NumPeronalImpresion"), elemento.NoOperariosImpre);
        kdoNumericSetValue($("#NumCostoAdicionales"), elemento.CostoLimpieza);

        $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value(elemento.PorcUtilidadConsiderada);
        $("#TxtUtilidadDolares").data("kendoNumericTextBox").value(elemento.UtilidadDolares);
        $("#TxtPrecioCliente").data("kendoNumericTextBox").value(elemento.PrecioCliente);
        $("#TxtPrecioTS").data("kendoNumericTextBox").value(elemento.PrecioTS);
        $("#TxtPrecioVenta").data("kendoNumericTextBox").value(elemento.PrecioVenta);
        $("#dbgPartesSub").data("kendoGrid").dataSource.read();
    }
    CargarEtapasProceso(elemento.IdRequerimiento);
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

    if (VIdSer === 2) {
        dataChart.push(
            {
                category: "Costo Materia Prima (Imp + Trans)",
                value: elemento.CostoMP + elemento.CostoMPTrans,
                color: "#33FFE9"
            },
            {
                category: "Costo Fabril (Imp + Trans)",
                value: Math.round((elemento.CostoFabril + elemento.CostoFabrilTrans) * 100) / 100,
                color: "#CA33FF"
            },
            {
                category: "Costo de Mano de Obra (Imp + Trans)",
                value: Math.round((elemento.CostoMOD + elemento.CostoMODTrans) * 100) /100,
                color: "#03396C"
            },
            {
                category: "Costo Operación (Imp + Trans)",
                value: elemento.CostoOperacion + elemento.CostoOperacionTrans,
                color: "#33C1FF"
            });
    }   

    CrearGrafico($("#chart"), "Distribución de costos " + elemento.Nombre2, dataChart, "category", TipoGrafico.pie, true);
    ConfigSeriesxDefectoGrafico($("#chart"), true, PosicionLabel.outsideEnd, "#= category #: \n $#= kendo.toString(value,'n2')# - #= kendo.toString(percentage * 100.0, 'n2')#%");
    ConfigLeyendaGrafico($("#chart"), PosicionLeyenda.right, true, AlinearLeyenda.center);
    ConfigTituloGrafico($("#chart"), PosicionTitulo.bottom, true, AlinearLeyenda.center);
    ConfigTooltipGrafico($("#chart"), true, "${0}");
    ConfigExportarGrafico($("#chart"), "chartexp2", true, true, true);
    
}

function DesHabilitarCamposSim() {
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

    if (VIdSer !== 2) {
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
    }
  
    if (VIdSer === 2) {
        KdoNumerictextboxEnable($("#NumAnchoimp"), false);
        KdoNumerictextboxEnable($("#NumAltoimp"), false);
        KdoNumerictextboxEnable($("#NumConsumoYarda"), false);
        KdoNumerictextboxEnable($("#NumPeronalTransferencia"), false);
        KdoNumerictextboxEnable($("#NumPeronalImpresion"), false);
        TextBoxEnable($("#TxtVelocidadTransferencia"), false);
        KdoNumerictextboxEnable($("#NumYardaImpHora"), false);
        KdoNumerictextboxEnable($("#NumConsumoTintas"), false);
        KdoNumerictextboxEnable($("#NumYardaTransHora"), false);
        KdoNumerictextboxEnable($("#NumCostoPapelImp"), false);
        KdoNumerictextboxEnable($("#NumCostoTinta"), false);
        KdoNumerictextboxEnable($("#TxtCostoPrimoSubli"), false);
        KdoNumerictextboxEnable($("#NumCostoPapelProtec"), false);
        KdoNumerictextboxEnable($("#NumCostoAdicionales"), false);
        KdoNumerictextboxEnable($("#NumCostoPrimoTransSubli"), false);
        KdoNumerictextboxEnable($("#TxtCostoTotalMasTrans"), false);
        KdoNumerictextboxEnable($("#TxtCostoMODTrans"), false);
        KdoNumerictextboxEnable($("#TxtCostoFabrilTrans"), false);
        KdoNumerictextboxEnable($("#TxtCostoProduccionTrans"), false);
        KdoNumerictextboxEnable($("#TxtCostoOperacionTrans"), false);
        KdoNumerictextboxEnable($("#TxtCostoTotalTrans"), false);
        $("#TxtComentariosTecnicos").attr("disabled", true);
        TextBoxEnable($("#TxtOperTela"), false);
        TextBoxEnable($("#TxtUniAnchoimp"), false);
        TextBoxEnable($("#TxtPerfilImpresion"), false);
        TextBoxEnable($("#TxtVelociTrans"), false);
        TextBoxEnable($("#TxtPapelSelecionado"), false);
        TextBoxEnable($("#TxtConsumoTinta"), false);
    }
}

let fn_LimpiarCamposSim = function () {
    $("#chkUsarTermo").prop("checked", false);
    $("#TxtFecha").data("kendoDatePicker").value(Fhoy());
    $("#TxtCantidadPiezas").data("kendoNumericTextBox").value("0");
    $("#TxtPorcUtilidadConsiderada").data("kendoNumericTextBox").value("0");
    $("#TxtUtilidadDolares").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioCliente").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioTS").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioVenta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoMOD").data("kendoNumericTextBox").value("0");
    $("#TxtCostoFabril").data("kendoNumericTextBox").value("0");
    $("#TxtCostoProduccion").data("kendoNumericTextBox").value("0");
    $("#TxtCostoOperacion").data("kendoNumericTextBox").value("0");
    $("#TxtCostoTotal").data("kendoNumericTextBox").value("0");

    if (VIdSer !== 2) {
        $("#TxtCostoMP").data("kendoNumericTextBox").value("0");
        $("#TxtCostoPrimo").data("kendoNumericTextBox").value("0");
        $("#txtCostoTermofijado").data("kendoNumericTextBox").value("0");
        $("#txtCostoTermofijadoUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCostoUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCantidadTecnicas").data("kendoNumericTextBox").value("0");
        $("#TxtMontajes").data("kendoNumericTextBox").value("0");
        $("#txtNoPersonalExtra").data("kendoNumericTextBox").value("0");
        $("#txtCantidadColores").data("kendoNumericTextBox").value("0");
        $("#txtCantidadCombos").data("kendoNumericTextBox").value("0");
        $("#txtCantidadTallas").data("kendoNumericTextBox").value("0");
        $("#txtVelocidadMaquina").data("kendoNumericTextBox").value("0");
        $("#TxtNoDocumento").val("");
        $("#TxtEstado").val("");
        $("#txtTiempoProyecto").data("kendoNumericTextBox").value("0");
        $("#TxtCostoMPUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCostoMODUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCostoPrimoUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCostoFabrilUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCostoProduccionUnitario").data("kendoNumericTextBox").value("0");
        $("#TxtCostoOperacionUnitario").data("kendoNumericTextBox").value("0");
    } 

    if (VIdSer === 2) {
        kdoNumericSetValue($("#NumAnchoimp"), 0);
        kdoNumericSetValue($("#NumAltoimp"), 0);
        kdoNumericSetValue($("#NumConsumoYarda"), 0);
        kdoNumericSetValue($("#NumPeronalTransferencia"), 0);
        kdoNumericSetValue($("#NumPeronalImpresion"), 0);
        kdoNumericSetValue($("#NumYardaImpHora"), 0);
        kdoNumericSetValue($("#NumConsumoTintas"), 0);
        kdoNumericSetValue($("#NumYardaTransHora"), 0);
        kdoNumericSetValue($("#NumCostoPapelImp"), 0);
        kdoNumericSetValue($("#NumCostoTinta"), 0);
        kdoNumericSetValue($("#TxtCostoPrimoSubli"), 0);
        kdoNumericSetValue($("#NumCostoPapelProtec"), 0);
        kdoNumericSetValue($("#NumCostoAdicionales"), 0);
        kdoNumericSetValue($("#NumCostoPrimoTransSubli"), 0);
        kdoNumericSetValue($("#TxtCostoTotalMasTrans"), 0);
        kdoNumericSetValue($("#TxtCostoMODTrans"), 0);
        kdoNumericSetValue($("#TxtCostoFabrilTrans"), 0);
        kdoNumericSetValue($("#TxtCostoProduccionTrans"), 0);
        kdoNumericSetValue($("#TxtCostoOperacionTrans"), 0);
        kdoNumericSetValue($("#TxtCostoTotalTrans"), 0);
        $("#TxtComentariosTecnicos").val("");
        $("#TxtOperTela").val(""); 
        $("#TxtUniAnchoimp").val("");
        $("#TxtPerfilImpresion").val(""); 
        $("#TxtVelocidadTransferencia").val("");
        $("#TxtVelociTrans").val("");
        $("#TxtPapelSelecionado").val("");
        $("#TxtConsumoTinta").val("");
    }
};

let  fn_GridPartes = function () {
    let dset = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "Simulaciones/GetPartesbyIdSimulacion/" + VIDSim; },
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdAnalisisDiseno: { type: "number" },
                    IdUbicacion: { type: "string" },
                    Nombre: { type: "string" },
                    PorcAreaLienzo: { type: "number"},
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    C2: { type: "number" }, //CostoParte
                    PorcUtilidadConsiderada: {type:"number"},
                    C3: { type: "number" } //PrecioParte
                }
            }
        },
        aggregate: [
            { field: "C2", aggregate: "sum" },
            { field: "C3", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#dbgPartesSub").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdAnalisisDiseno");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdAnalisisDiseno", title: "Codigo Analisis", hidden: true },
            { field: "IdUbicacion", title: "Codigo Parte", hidden: true },
            { field: "Nombre", title: "Parte" },
            { field: "PorcAreaLienzo", title: "% de Area de Lienzo", editor: Grid_ColNumeric, values: ["required", "0", "100", "P2", 4], format: "{0:P2}" },
            {
                field: "C2", title: "Costo por parte", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", footerTemplate: "Total: #: data.C2 ? kendo.format('{0:c2}', sum) : 0 #"
            },
            { field: "PorcUtilidadConsiderada", title: "Rentabilidad", editor: Grid_ColNumeric, values: ["required", "0", "100", "P2", 4], format: "{0:P2}" },
            {
                field: "C3", title: "Precio por parte", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", footerTemplate: "Total: #: data.C3 ? kendo.format('{0:c2}', sum) : 0 #"
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dbgPartesSub").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 200);
    Set_Grid_DataSource($("#dbgPartesSub").data("kendoGrid"), dset);

    var selRo = [];
    $("#dbgPartesSub").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#dbgPartesSub"), selRo);
    });

    $("#dbgPartesSub").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#dbgPartesSub"), selRo);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#dbgPartesSub"), $(window).height() - "700");
    });

    Fn_Grid_Resize($("#dbgPartesSub"), $(window).height() - "700");

};

let fn_Insum = function (idTecnica) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    data: JSON.stringify({ idTecnica: idTecnica, EsPapel: true, EsRhinestone: false }),
                    url: UrlCI + "/Filtrado",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};
function getIdSimulacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacion;
}

function fn_getNoSimulacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento2;
}

function fn_getIdBase(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdBase;
}

function fn_getIdRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;
}
function fn_NoRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento1;
}
let getIdAD = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdAnalisisDiseno;
};
fPermisos = function (datos) {
    Permisos = datos;
};
fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};
fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};
fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};
fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};
fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};

function fn_getEstadoActual(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;
}
//#endregion Fin Metodos Generales