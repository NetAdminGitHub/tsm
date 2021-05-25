var DsCatDisInf = "";
var xIdServ = 0; //numero de servicio.
var xidRq = 0; //numero del requerimiento
var ValidarFormularioOT = "";
var srcDef = "/Images/NoImagen.png";
var xid = 0;
var xidArt = 0;
var fn_verCotizacion = function (IdCotizacion, Estado) {
    window.open("/CotizacionesMuestras/CotizacionesMuestrasDatos/" + IdCotizacion.toString() + "/" + Estado.toString());
};
var fn_verSimulacion = function (IdSimulacion, IdServicio, IdOrdenTrabajo) {
    window.open("/SimulacionesMuestras/SimulacionesMuestrasInfo/" + IdSimulacion.toString() + "/" + IdServicio.toString() + "/" + IdOrdenTrabajo.toString());
};
var fn_verKanbanEtapa = function (IdOrdenTrabajo) {
    window.location.href = "/EtapasOrdenesTrabajos/" + IdOrdenTrabajo.toString();
};

var fn_InfDetalle = function (divCDInf, xidCatalogo, xidArte) {
    TextBoxEnable($("#TxtPren"), false);
    TextBoxEnable($("#TxtUbicacion"), false);
    TextBoxEnable($("#TxtColorTela"), false);
    TextBoxEnable($("#TxtTallaDesarrollada"), false);
    $("#TxtPren").val("");
    $("#TxtUbicacion").val("");
    $("#TxtColorTela").val("");
    $("#TxtTallaDesarrollada").val("");
    Kendo_CmbFiltrarGrid($("#CmbMotivoDesarrollo"), TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/" + xIdServ, "Nombre", "IdMotivoDesarrollo", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbTiposMuestras"), TSM_Web_APi + "CatalogoDisenos/GetTipoMuestras", "Nombre", "IdTipoMuestra", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbTallas"), TSM_Web_APi + "CategoriaTallas/GetCategoriaTallaFiltro/1", "Nombre", "IdCategoriaTalla", "Seleccione...");
    KdoComboBoxEnable($("#CmbTallas"), false);
    KdoCmbSetValue($("#CmbTallas"), "");
    $('#swchkCambiaTalla').prop('checked', 0);
    $("#TxtMotivoCambio").autogrow({ vertical: true, horizontal: false, flickering: false });
    KdoButton($("#btnReactivarOT"), "track-changes");
    $("#btnReactivarOT").click(function (e) {
        fn_SolicituReactivacionOrdenTrabajo("SoliIngresoCambio", fn_getIdOT($("#gConOT").data("kendoGrid")), fn_getIdEtp($("#gConOT").data("kendoGrid")), fn_getItem($("#gConOT").data("kendoGrid")), fn_getIdToT($("#gConOT").data("kendoGrid")), function () { return $("#gConOT").data("kendoGrid").dataSource.read(); });
    });
    $("#swchkCambiaTalla").click(function () {
        if (this.checked) {
            KdoComboBoxEnable($("#CmbTallas"), true);
            KdoCmbSetValue($("#CmbTallas"), "");
            KdoCmbFocus($("#CmbTallas"));

        } else {
            KdoComboBoxEnable($("#CmbTallas"), false);
            KdoCmbSetValue($("#CmbTallas"), "");
            KdoCmbFocus($("#CmbMotivoDesarrollo"));
        }
    });

    fn_gridOT();
    //fn_Dimensiones_OT();
    $("#tab_inf").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });

    $("#ModalGeneraOT").kendoDialog({
        height: "80%",
        width: "40%",
        title: "Generar Orden de Trabajo",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCrear OT', primary: true, action: function () { return fn_GenerarOT(); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
        ],
        close: function (e) {
            KdoCmbSetValue($("#CmbMotivoDesarrollo"), "");
        }
    });

    ValidarFrmGeneraOT = $("#FrmGeneraOT").kendoValidator(
        {
            rules: {
                MsgDesarrollo: function (input) {
                    if (input.is("[name='CmbMotivoDesarrollo']")) {
                        return $("#CmbMotivoDesarrollo").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgTP: function (input) {
                    if (input.is("[name='CmbTiposMuestras']")) {
                        return $("#CmbTiposMuestras").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgTall: function (input) {
                    if (input.is("[name='CmbTallas']")) {
                        return $("#chkDisenoFullColor").is(':checked') ? true : $("#CmbTallas").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msg3: function (input) {
                    if (input.is("[name='TxtMotivoCambio']")) {
                        return input.val().length > 0 && input.val().length <= 2000;
                    }
                    return true;
                }
            },
            messages: {
                MsgDesarrollo: "Requerido",
                MsgTP: "Requerido",
                Msg3: "Requerido",
                MsgTall: "Requerido"
            }
        }).data("kendoValidator");

    $("#gConOT").data("kendoGrid").bind("change", function () {
        fn_GetAdjuntos();
        Fn_getCotizacion($("#gConOT").data("kendoGrid"));
        $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read().then(function (e) {
            fn_getMUPREAPRO($("#gConOT").data("kendoGrid")) === true ? $("#gridCotizacionDetalle").data("kendoGrid").showColumn("aprobar") : $("#gridCotizacionDetalle").data("kendoGrid").hideColumn("aprobar");
        });

    });

    fn_CargarInfDetalle(divCDInf, xidCatalogo, xidArte);
};

var fn_CargarInfDetalle = function (divCDInf, xidCatalogo, xidArte) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoByIdCatalogoIdArte/" + xidCatalogo + "/" + xidArte,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            xid = dato[0].IdCatalogoDiseno === null ? 0 : dato[0].IdCatalogoDiseno;
            xidArt = dato[0].IdArte === null ? 0 : dato[0].IdArte;
            $("#gConOT").data("kendoGrid").dataSource.read();
            fn_DibujaScrollView($("#scrollView"), "", null);
            if (dato.length > 0) {
                $("#InfCliente").val(dato[0].NombreCli);
                $("#InfFecha").val(kendo.toString(kendo.parseDate(dato[0].Fecha), 'dd/MM/yyyy'));
                $("#" + divCDInf + "").data("kendoDialog").title("Diseño: " + dato[0].NoReferencia + " " + dato[0].NombreDiseno  );
                $("#gConOT").data("kendoGrid").dataSource.read().then(function () { fn_GetAdjuntos(); });
            } else {
                $("#InfCliente").val("");
                $("#InfFecha").val("");
                $("#" + divCDInf + "").data("kendoDialog").title("");
            }

            kendo.ui.progress($("#ModalCDinf"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });


};

let fn_gridOT = function () {
    var dsOT = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoByIdCatalogoIdArte/" + xid + "/" + xidArt,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    },
                    error: function () {
                        options.error(result);
                    }
                });
            },
            update: function (datos) {
                kendo.ui.progress($("#gConOT"), true);
                $.ajax({
                    type: "post",
                    dataType: 'json',
                    data: kendo.stringify(datos.data),
                    url: TSM_Web_APi + "SolicitudProduccionesAprobacionesEstados/InsAprobacion",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($("#gConOT"), false);
                        datos.success(result);
                    },
                    error: function () {
                        kendo.ui.progress($("#gConOT"), false);
                    }
                });
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdOrdenTrabajo",
                fields: {
                    IdCatalogoDiseno: { type: "number" },
                    NombreDiseno: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    NoReferencia: { type: "string" },
                    NombreArchivo: { type: "string" },
                    Fecha: { type: "date" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdCliente: { type: "string" },
                    NombreCli: { type: "string" },
                    IdRequerimiento: { type: "number" },
                    IdOrdenTrabajo: { type: "number" },
                    IdEtapaProceso: { type: "IdEtapaProceso" },
                    Item: { type: "Item" },
                    NoOT: { type: "string" },
                    NoReq: { type: "string" },
                    FechaInicio: { type: "date" },
                    FechaFinal: { type: "date" },
                    NombreDisOT: { type: "string" },
                    EstiloDisenoOT: { type: "string" },
                    NumeroDisenoOT: { type: "string" },
                    FechaSolicitud: { type: "date" },
                    IdArte: { type: "number" },
                    IdServicio: { type: "IdServicio" },
                    Tallas: { type: "Tallas" },
                    SNFichaProd: { type: "bool" },
                    SNOTMuestraFin: { type: "bool" },
                    SNMuCotizada: { type: "bool" },
                    //MUAPROPROD: { type: "bool" },
                    MUCOTIZADA: { type: "bool" },
                    MUFIAPRO: { type: "bool" },
                    MUPREAPRO: { type: "bool" },
                    EstadoOT: { type: "bool" },
                    NombreEstOT: { type: "bool" },
                    IdOrdenTrabajoOrigen: { type: "number" },
                    NoDocumentoOrigen: { type: "sring" },
                    RoundMuestra: { type: "number" },
                    TallaDesarrollada: { type: "sring"}

                }
            }
        }
    });
    //CONFIGURACION DEL gConOT,CAMPOS
    $("#gConOT").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        edit: function (e) {
            KdoHideCampoPopup(e.container, "NombreDisOT");
            KdoHideCampoPopup(e.container, "IdCatalogoDiseno");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "IdOrdenTrabajo");
            KdoHideCampoPopup(e.container, "NoOT");
            KdoHideCampoPopup(e.container, "NoReq");
            KdoHideCampoPopup(e.container, "FechaSolicitud");
            KdoHideCampoPopup(e.container, "FechaInicio");
            KdoHideCampoPopup(e.container, "FechaFinal");
            KdoHideCampoPopup(e.container, "EstadoOT");
            KdoHideCampoPopup(e.container, "NombreEstOT");
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "IdTipoOrdenTrabajo");
            KdoCheckBoxEnable($('[name="MUFIAPRO"]'), false);
            KdoCheckBoxEnable($('[name="MUCOTIZADA"]'), false);
            if ($("#gridCotizacionDetalle").data("kendoGrid").dataSource.total() === 0) {
                KdoCheckBoxEnable($('[name="MUPREAPRO"]'), false);
                KdoCheckBoxEnable($('[name="REQMP"]'), false);
            } else {
                KdoCheckBoxEnable($('[name="MUPREAPRO"]'), e.model.SNFichaProd === true ? false : true);
            }
            //KdoCheckBoxEnable($('[name="MUFIAPRO"]'), e.model.SNOTMuestraFin === true ? true : false);
            //KdoCheckBoxEnable($('[name="MUCOTIZADA"]'), e.model.SNMuCotizada === true ? true : false);
        },
        columns: [
            { field: "NombreDisOT", title: "Nombre del Diseño OT", hidden: true },
            { field: "IdCatalogoDiseno", title: "Cod IdCatalogo", hidden: true },
            { field: "IdRequerimiento", title: "Cod IdRequerimiento", hidden: true },
            { field: "IdOrdenTrabajo", title: "Cod IdOrdenTrabajo", hidden: true },
            { field: "IdEtapaProceso", title: "Cod Etapa", hidden: true },
            { field: "Item", title: "Item", hidden: true },
            { field: "IdTipoOrdenTrabajo", title: "IdTipoOrdenTrabajo", hidden: true },
            //{ field: "NoOT", title: "Orden de Trabajo", width: "120px" },
            {
                field: "NoOT", title: "Orden de Trabajo", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='fn_verKanbanEtapa(" + data["IdOrdenTrabajo"] + ")'>" + data["NoOT"] + "</button>";
                }, width: "120px"
            },
            { field: "IdOrdenTrabajoOrigen", title: "Cod. OT Origen", hidden: true },
            { field: "RoundMuestra", title: "Round Muestra", width: "100px" },
            { field: "TallaDesarrollada", title: "Talla Desarrollada", width: "150px" },
            { field: "FechaInicio", title: "Inicio de OT", format: "{0: dd/MM/yyyy}" },
            { field: "NoReq", title: "Requerimiento", width: "120px", hidden:true },
            { field: "EstadoOT", title: "Estado OT", width: "120px", hidden: true },
            { field: "NombreEstOT", title: "Estado", width: "100px" },
            { field: "FechaSolicitud", title: "Fecha Solicitud", format: "{0: dd/MM/yyyy}", width: "120px", hidden: true },
            { field: "FechaFinal", title: "Fecha Final de OT", format: "{0: dd/MM/yyyy}", width: "120px", hidden: true },
            { field: "MUFIAPRO", title: "Muestra Fisica Aprobada", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "MUFIAPRO"); } },
            { field: "MUCOTIZADA", title: "Muestra Cotizada", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "MUCOTIZADA"); } },
            { field: "MUPREAPRO", title: "Muestra con Precio Aprob", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "MUPREAPRO"); } },
            { field: "REQMP", title: "Requisicion de Materia Prima", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "REQMP"); } },
            //{ field: "MUAPROPROD", title: "Muestra Aprob Producción", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "MUAPROPROD"); } },
            { field: "NoDocumentoOrigen", title: "No OT Origen", width: "120px" },
            {
                command: {
                    name: "Generar OT",
                    iconClass: "k-icon k-i-file",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        KdoCmbSetValue($("#CmbTiposMuestras"), "");
                        $("#TxtMotivoCambio").val("");
                        xidRq=dataItem.IdRequerimiento;
                        xIdServ = dataItem.IdServicio;
                        $("#CmbMotivoDesarrollo").data("kendoComboBox").setDataSource(fn_GetMotivoDesarrollo());
                        fn_GetRequerimientoInfo();
                        KdoComboBoxEnable($("#CmbTallas"), false);
                        $('#swchkCambiaTalla').prop('checked', 0);
                        KdoCmbSetValue($("#CmbTallas"), "");
                        let dialog = $("#ModalGeneraOT").data("kendoDialog");
                        dialog.open();
                        dialog.title("Generar Orden de Trabajo desde: " + dataItem.NoOT);
                        KdoCmbFocus($("#CmbMotivoDesarrollo"));
                        
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gConOT
    SetGrid($("#gConOT").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 400);
    SetGrid_CRUD_Command($("#gConOT").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gConOT").data("kendoGrid"), dsOT, 20);

    var selectedRowsServ = [];
    $("#gConOT").data("kendoGrid").bind("dataBound", function () { //foco en la fila
        Grid_SetSelectRow($("#gConOT"), selectedRowsServ);
        Grid_HabilitaToolbar($("#gConOT"), false, xid === 0 ? false : true, false);

    });

    $("#gConOT").data("kendoGrid").bind("change", function () {
        Grid_SelectRow($("#gConOT"), selectedRowsServ);
        fn_getEstadoOT($("#gConOT").data("kendoGrid")) !== "TERMINADO" ? KdoButtonEnable($("#btnReactivarOT"), false) : KdoButtonEnable($("#btnReactivarOT"), true);

    });

    //#region PRGRANMACION DETALLE DE COTIZACION
    var DsCT = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CotizacionesMuestrasSimulaciones/GetbyIdOrdenTrbajo/" + (fn_getIdOT($("#gConOT").data("kendoGrid")) === null ? 0 : fn_getIdOT($("#gConOT").data("kendoGrid"))); },
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
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacionSimulacion",
                fields: {
                    IdServicio: { type: "number" },
                    IdCotizacionSimulacion: { type: "number" },
                    EstadoCotizacion: { type: "string" },
                    IdCotizacion: { type: "number" },
                    NoDocCotizacion: { type: "string" },
                    IdOrdenTrabajo: { type: "number" },
                    IdSimulacionRentabilidad: { type: "number" },
                    PorcUtilidadConsiderada: { type: "number" },
                    UtilidadDolares: { type: "number" },
                    PrecioCliente: { type: "number" },
                    PrecioTS: { type: "number" },
                    PrecioVenta: { type: "number" },
                    FacturacionCliente: { type: "number" },
                    FacturacionTS: { type: "number" },
                    FacturacionVenta: { type: "number" },
                    IdSimulacion: { type: "numeric" },
                    NoDocumento: { type: "string" },
                    SNExisteFichaProd: { type: "bool" },
                    EstadoCotizacionNombre: { type: "string" },
                    FechaAprobacion: {type: "date"}
                }
            }
        }
    });

    $("#gridCotizacionDetalle").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                kendo.ui.progress($("#gConOT"), true);
                window.open("/FichaProduccion/Ficha/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#gConOT"), false);
            });
        },
        columns: [
            { field: "IdCotizacionProgramaSimulacion", title: "Código Cotización programa sim", hidden: true },
            { field: "IdServicio", title: "Código Servicio", hidden: true },
            { field: "IdCotizacion", title: "Código Cotización", hidden: true },
            {
                field: "NoDocCotizacion", title: "No Cotización", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='fn_verCotizacion(" + data["IdCotizacion"] + ",\"" + data["EstadoCotizacion"] + "\")' >" + data["NoDocCotizacion"] + "</button>";
                }
            },
            { field: "IdSimulacion", title: "Código Simulación", hidden: true },
            { field: "IdOrdenTrabajo", title: "Código Orden de trabajo", hidden: true },
            {
                field: "NoDocumento", title: "No Simulación", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='fn_verSimulacion(" + data["IdSimulacion"] + "," + data["IdServicio"] + "," + data["IdServicio"] + ")' >" + data["NoDocumento"] + "</button>";
                }
            },
            { field: "EstadoCotizacionNombre", title: "Estado" },
            { field: "FechaAprobacion", title: "Fecha Apro cot.", format: "{0: dd/MM/yyyy}" },
            { field: "SNExisteFichaProd", title: "Ficha Producción",  template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "SNExisteFichaProd"); } },
            { field: "IdSimulacionRentabilidad", title: "cod. Simulación Rentabilidad", hidden: true },
            { field: "PorcUtilidadConsiderada", title: "PorcUtilidad Considerada", editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4], format: "{0:P2}", hidden: true },
            { field: "UtilidadDolares", title: "Utilidad Dolares", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioCliente", title: "Precio Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioTS", title: "Precio Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioVenta", title: "Precio Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionCliente", title: "Facturacion Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionTS", title: "Facturacion Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionVenta", title: "Facturacion Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            {
                field: "aprobar", title: "&nbsp;",
                command: {
                    name: "Aprobar",
                    iconClass: "k-icon k-i-success",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        fn_GenerarSolicitudProducciones(dataItem);
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    SetGrid($("#gridCotizacionDetalle").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCotizacionDetalle").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridCotizacionDetalle").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridCotizacionDetalle").data("kendoGrid"), DsCT);




    var selectedRowsCotiDet = [];
    $("#gridCotizacionDetalle").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);
    });

    $("#gridCotizacionDetalle").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);
    });

    //#endregion FIN PROGRAMACIÓN DEL GRID SIMULACIÓN
};
var Grid_ColTemplateCheckBox = function (data, columna) {
    return "<input id=\"" + data.id + "\" type=\"checkbox\" class=\"k-checkbox\" disabled=\"disabled\"" + (data[columna] ? "checked=\"checked\"" : "") + " />" +
        "<label class=\"k-checkbox-label\" for=\"" + data.id + "\"></label>";
};
let fn_GetAdjuntos = function () {
    //LLena Splitter de imagenes
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + fn_getIdArte($("#gConOT").data("kendoGrid")),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            fn_DibujaScrollView($("#scrollView"), "/Adjuntos/" + fn_getNoReq($("#gConOT").data("kendoGrid")) + "", respuesta);
            kendo.ui.progress($("#ModalCDinf"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};

let fn_DibujaScrollView = function (Objecarousel, src, DataSource) {

    var lista = Objecarousel;
    //remueve las imagenes del carrousel
    Objecarousel.children().remove();
    if (DataSource === null || DataSource === undefined) {
        lista.append(
            '<div class="photo" style="background-image:url(\'' + srcDef + '\')" data-role="page"></div>'
        );

    } else {
        if (DataSource.length === 0) {
            lista.append(
                '<div class="photo" style="background-image:url(\'' + srcDef + '\')" data-role="page"></div>'
            );
        } else {
            $.each(DataSource, function (index, elemento) {
                lista.append('<div class="photo" style="background-image:url(\'' + src + '/' + elemento.NombreArchivo + '\')" data-role="page" onerror="imgError(this)"></div>');
            });
        }

    }

    lista.kendoScrollView({
        enablePager: true,
        contentHeight: "100%"
    });
};


let fn_getIdArte = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;
};

let fn_getNoReq = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoReq;
};

let fn_GetMotivoDesarrollo = function () {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/" + xIdServ.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let fn_GenerarOT = function () {
    let Realizado = false;
    let xNDocReqAnterior = fn_getNodocumentoReq($("#gConOT").data("kendoGrid")).toString();
    let IdArte = fn_getIdArte($("#gConOT").data("kendoGrid"));
    if (ValidarFrmGeneraOT.validate()) {
        // obtener indice de la etapa siguiente
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "CatalogoDisenos/GenerarOrdenTrabajoCatalogo",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                IdRequerimiento: xidRq,
                IdMotivoDesarrollo: KdoCmbGetValue($("#CmbMotivoDesarrollo")).toString(),
                IdTipoMuestra: KdoCmbGetValue($("#CmbTiposMuestras")).toString(),
                Comentario: $("#TxtMotivoCambio").val(),
                snCambiaTalla: $("#swchkCambiaTalla").is(':checked') ? 1 : 0,
                IdCategoriaTalla: KdoCmbGetValue($("#CmbTallas"))
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Realizado = true;
                RequestEndMsg(datos, "Post");
                $("#ModalGeneraOT").data("kendoDialog").close();
                fn_GetOTDetalleReq(datos[0], IdArte, xNDocReqAnterior);
                $("#gConOT").data("kendoGrid").dataSource.read();
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(".k-dialog"), false);
            }
        });
    } else {
        Realizado = false;
    }
    return Realizado;
};

let fn_getIdRequerimiento = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;

};

let fn_getNodocumentoReq = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoReq;
};

let fn_AdjArchivoRD = function (NodocumentoReqNuevo, idarte, NodocumentoReq) {

    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + idarte,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            $.each(respuesta, function (item, elemento) {
                var dsres = [{
                    NoDocumento: NodocumentoReqNuevo,
                    NoReferencia: NodocumentoReq,
                    NombreArchivo: elemento.NombreArchivo
                }];
                fn_SubirADj(dsres);
            });

            kendo.ui.progress($("#ModalCDinf"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};
let fn_SubirADj = function (ds) {
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/RequerimientoDesarrollos/SubirArchivoReq",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

        }
    });
};

let fn_GetOTDetalleReq = function (idot, IdArte, xNDocReqAnterior) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetOrdenesTrabajosDetallesRequerimiento/" + idot,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                fn_AdjArchivoRD(respuesta.NodocReq, IdArte, xNDocReqAnterior);
            }
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};

let Fn_getCotizacion = function (g) {
    var elemento = g.dataItem(g.select());
    $("#InfTallas").val(elemento.Tallas);
    $("#InfNombreDisOT").val(elemento.NombreDisOT);
    $("#InfEstiloDisenoOT").val(elemento.EstiloDisenoOT);
    $("#InfNumDisenoOT").val(elemento.NumeroDisenoOT);
    $("#InfCodigoFM").val(elemento.NoReferencia);
    $("#InfFechaInicio").val(kendo.toString(kendo.parseDate(elemento.FechaInicio), 'dd/MM/yyyy'));
    $("#InfFechaFinal").val(kendo.toString(kendo.parseDate(elemento.FechaFinal), 'dd/MM/yyyy'));
};

let fn_getIdOT = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdOrdenTrabajo;
};
let fn_getItem = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Item;
};
let fn_getIdEtp = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdEtapaProceso;
};
let fn_getIdToT = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdTipoOrdenTrabajo;
};
let fn_getIdSimulacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacion;
};
let fn_getIdCotizacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdCotizacion;
};
let fn_getEstadoOT = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.EstadoOT;
};
let fn_getMUPREAPRO = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.MUPREAPRO;
};
let fn_GenerarSolicitudProducciones = function (data) {
    kendo.ui.progress($("#ModalGeneraOT"), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudProducciones/Procesar/" + data.IdCotizacion.toString() + "/" + data.IdOrdenTrabajo.toString() + "/" + data.IdSimulacion.toString(),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({ IdSimulacionRentabilidad: null }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
            $("#gConOT").data("kendoGrid").dataSource.read();
            kendo.ui.progress($("#ModalGeneraOT"), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($("#ModalGeneraOT"), false);
            ErrorMsg(data);
        }
    });
};

let fn_GetRequerimientoInfo = function () {
    kendo.ui.progress($("#ModalGeneraOT"), true);
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos/GetRequerimientoInf/" + xidRq,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato!==null ) {
                $("#TxtPren").val(dato.NombrePrenda);
                $("#TxtUbicacion").val(dato.NombreParte);
                $("#TxtColorTela").val(dato.Color);
                $("#TxtTallaDesarrollada").val(dato.TallaDesarrollada);
            } else {
                $("#TxtPren").val("");
                $("#TxtUbicacion").val("");
                $("#TxtColorTela").val("");
                $("#TxtTallaDesarrollada").val("");
            }
            kendo.ui.progress($("#ModalGeneraOT"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalGeneraOT"), false);
        }
    });

};
