let UrlClie = TSM_Web_APi + "Clientes";
let UrlServ = TSM_Web_APi + "Servicios";
let xFechaDesde=null;
let xFechaHasta=null;
let xIdServicio=0;
let xCliente=0;
let xNoOt=0;
let xIdPrograma = 0;
let xIdCatalogoDiseno = 0;
var Permisos;
$(document).ready(function () {

    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("GestionFichasProduccion_CmbIdCliente") === null ? "" : sessionStorage.getItem("GestionFichasProduccion_CmbIdCliente")); 

    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    KdoCmbSetValue($("#CmbIdServicio"), sessionStorage.getItem("GestionFichasProduccion_CmbIdServicio") === null ? "" : sessionStorage.getItem("GestionFichasProduccion_CmbIdServicio")); 

    $("#CmbFmCata").ControlSelecionFMCatalogo();
    KdoMultiColumnCmbSetValue($("#CmbFmCata"), sessionStorage.getItem("GestionFichasProduccion_CmbFmCata") === null ? "" : sessionStorage.getItem("GestionFichasProduccion_CmbFmCata")); 
    //convertir a Kendo boutton
    KdoButton($("#btnConsultar"), "search", "Consultar");

    //convertir a Kendo date picker
    let dtfecha = new Date();
    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    //$("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("GestionFichasProduccion_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("GestionFichasProduccion_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("GestionFichasProduccion_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("GestionFichasProduccion_dFechaHasta"));

    //checkbox
    //$('#chkRangFechas').prop('checked', 1);

    $('#chkRangFechas').prop('checked', sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") === null ? 1 : sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") === "true" ? 1 : 0);
    //$('#chkMe').prop('checked', sessionStorage.getItem("GestionFichasProduccion_chkMe") === null ? 0 : sessionStorage.getItem("GestionFichasProduccion_chkMe") === "true" ? 1 : 0);

    // convertir a kendo Multicolum combobox
    $("#TxtNoOrdeTrabajo").ControlSelecionOTSolicitudesProducion();
    KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), sessionStorage.getItem("GestionFichasProduccion_TxtNoOrdeTrabajo") === null ? "" : sessionStorage.getItem("GestionFichasProduccion_TxtNoOrdeTrabajo")); 

    $("#CmbPrograma").ControlSelecionPrograma();
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("GestionFichasProduccion_CmbPrograma") === null ? "" : sessionStorage.getItem("GestionFichasProduccion_CmbPrograma")); 

    //$("#btnConsultar").click(function () {
    //    let g = $("#grid").data("kendoGrid");
    //    g.dataSource.read();
    //    g.pager.page(1);
    //});

    //#region configuracion del grid

    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: TSM_Web_APi + "SolicitudProducciones/GetConsultaFichasProducciones",
                    data: JSON.stringify({
                        FechaDesde: xFechaDesde, //$("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                        FechaHasta:xFechaHasta,// $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                        IdServicio: xIdServicio,//KdoCmbGetValue($("#CmbIdServicio")),
                        IdCliente: xCliente, // KdoCmbGetValue($("#CmbIdCliente")),
                        NoOt: xNoOt, //KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo")),
                        IdPrograma: xIdPrograma, //KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                        IdCatalogoDiseno: xIdCatalogoDiseno
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                        kendo.ui.progress($(document.body), false);
                    },
                    error: function () {
                        options.error(result);
                        kendo.ui.progress($(document.body), false);
                    }
                });
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdSolicitud",
                fields: {
                    IdOrdenTrabajo: { type: "number" },
                    IdTipoOrdenTrabajo: { type: "number" },
                    TipoOrdenTrabajo: { type: "string" },
                    FechaOrdenTrabajo: { type: "date" },
                    FechaInicio: { type: "date" },
                    FechaFinal: { type: "date" },
                    IdSolicitudDisenoPrenda: { type: "number" },
                    IdPrioridadOrdenTrabajo: { type: "number" },
                    Prioridad: { type: "string" },
                    Estado: { type: "string" },
                    NoDocumento: { type: "string" },
                    Comentarios: { type: "string" },
                    IdCliente: { type: "number" },
                    NombreCliente: { type: "string" },
                    IdServicio: { type: "number" },
                    Servicio: { type: "string" },
                    IdUbicacion: { type: "number" },
                    NombreUbicacion: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    NombreDiseño: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    IdCategoriaPrenda: { type: "number" },
                    NombrePrenda: { type: "string" },
                    ColorTela: { type: "ColorTela" },
                    IdPrograma: { type: "number" },
                    NoDocPrograma: { type: "string" },
                    NombrePrograma: { type: "string" },
                    IdTemporada: { type: "number" },
                    NombreTemp: { type: "string" },
                    IdEjecutivoCuenta: { type: "number" },
                    NombreEjecutivo: { type: "string" },
                    EstadoFormulas: { type: "string" },
                    IdSimulacion: { type: "number" },
                    NoDocumentoSim: { type: "string" },
                    IdCotizacion: { type: "number" },
                    NoDocumentoCoti: { type: "string" },
                    IdRequerimiento: { type: "number" },
                    NoDocumentoReq: { type: "string" },
                    IdCatalogoDiseno: { type: "number" },
                    NoDocumentoCatalogo: { type: "string" },
                    IdCategoriaTallaDesarrollada: { type: "number" },
                    TallaDesarrollada: { type: "string" }
                
                }
            }
        }
    });
    var selectedRows = [];
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({

        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                kendo.ui.progress($("#grid"), true);
                //window.location.href = "/ConsultarFichaOT/FichaOT/" + grid.dataItem(this).IdOrdenTrabajo.toString();
                window.open("/FichaProduccion/Ficha/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#grid"), false);
               
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumentoCatalogo", title: "N° FM", minResizableWidth: 100 },
            { field: "NoDocumento", title: "No. OT", minResizableWidth: 100 },
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true },
            { field: "NombreDiseño", title: "Nombre del diseño", minResizableWidth: 150 },
            { field: "EstiloDiseno", title: "Estilo del diseño", minResizableWidth: 150 },
            { field: "IdCategoriaPrenda", title: "Cod. prenda", hidden: true },
            { field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            { field: "IdCategoriaTallaDesarrollada", title: "Cod. categoría talla", hidden: true },
            { field: "TallaDesarrollada", title: "Talla Desarrollada", minResizableWidth: 150 },
            { field: "IdEjecutivoCuenta", title: "Cod. ejecutivo", hidden: true },
            { field: "NombreEjecutivo", title: "Ejecutivo de cuenta", minResizableWidth: 150 },
            { field: "IdPrograma", title: "Cod. programa", hidden: true },
            { field: "NoDocPrograma", title: "No Programa", minResizableWidth: 100 },
            { field: "NombrePrograma", title: "Programa", minResizableWidth: 150 },
            { field: "NoDocumentoReq", title: "No Doc Requerimiento", hidden: true, minResizableWidth: 100 },
            { field: "EstadoFP", title: "Estado", minResizableWidth: 100 },
            { field: "NombreCliente", title: "Nombre Cliente", minResizableWidth: 120 },
            { field: "NoDocumentoSim", title: "Simulación", minResizableWidth: 100 },
            { field: "NoDocumentoCoti", title: "Cotización", minResizableWidth: 100 },
            { field: "IdUbicacion", title: "Cod. ubicación", hidden: true },
            { field: "NombreUbicacion", title: "Ubicación", hidden: true, minResizableWidth: 120 },
            { field: "IdTemporada", title: "Cod. temporada", hidden: true },
            { field: "NombreTemp", title: "Temporada", minResizableWidth: 120, hidden: true },
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo Orden trabajo", hidden: true },
            { field: "TipoOrdenTrabajo", title: "Tipo de orden", hidden: true,minResizableWidth: 120 },
            { field: "FechaOrdenTrabajo", title: "Solicitud", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "EstadoFormulas", title: "Estado Fórmulas", hidden: true, minResizableWidth: 120 },
            { field: "FechaInicio", title: "Inicio", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaFinal", title: "Final", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "IdSolicitudDisenoPrenda", title: "cod. Solicitud diseño prenda", hidden: true },
            { field: "IdPrioridadOrdenTrabajo", title: "Prioridad orden trabajo", hidden: true },
            { field: "Prioridad", title: "Prioridad", hidden: true,minResizableWidth: 120 },
            { field: "Estado", title: "Estado orden", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "IdServicio", title: "Cod. servicio", hidden: true },
            { field: "Servicio", title: "Servicio", minResizableWidth: 120 },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", hidden: true ,minResizableWidth: 150 },
            { field: "UbicacionVertical", title: "Ubicación vertical", hidden: true , minResizableWidth: 150 },
            { field: "ColorTela", title: "Color tela", hidden: true },
            { field: "IdSimulacion", title: "Cod. Simulación", hidden: true,minResizableWidth: 150 },
            { field: "IdCotizacion", title: "Cod. Cotizacion", hidden: true, minResizableWidth: 150 },
            { field: "IdRequerimiento", title: "Cod. Requerimiento", hidden: true, minResizableWidth: 150 },
            { field: "NoDocumentoReq", title: "No Doc Requerimiento", hidden: true, minResizableWidth: 150 },
            { field: "IdCatalogoDiseno", title: "Cod. Requerimiento", hidden: true, minResizableWidth: 150 }

            
        

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    //#endregion 

    $("#TxtNoOrdeTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#TxtNoOrdeTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = null;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_TxtNoOrdeTrabajo", "");
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = data.IdOrdenTrabajo;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_TxtNoOrdeTrabajo", data.IdOrdenTrabajo);
        }

    });

 
    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            xIdPrograma = null;
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbPrograma", "");
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = data.IdPrograma;
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbPrograma", data.IdPrograma);

        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
        xCliente = KdoCmbGetValue($("#CmbIdCliente"));
        xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
        xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
        xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
        fn_ConsultarFicha();
        sessionStorage.setItem("GestionFichasProduccion_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {
       
        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
        xCliente = KdoCmbGetValue($("#CmbIdCliente"));
        xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
        xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
        xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
        fn_ConsultarFicha();
        sessionStorage.setItem("GestionFichasProduccion_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });

    $("#chkRangFechas").click(function () {

        KdoDatePikerEnable($("#dFechaDesde"), this.checked);
        KdoDatePikerEnable($("#dFechaHasta"), this.checked);
        xFechaDesde = this.checked=== false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
        xCliente = KdoCmbGetValue($("#CmbIdCliente"));
        xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
        xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
        xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
        fn_ConsultarFicha();
        sessionStorage.setItem("GestionFichasProduccion_chkRangFechas", this.checked);
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function () {
        var colum = $("#CmbIdCliente").data("kendoComboBox");
        let data = colum.listView.dataSource.data().find(q => q.IdCliente === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = null;
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbIdCliente", "");
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = this.value();
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbIdCliente", this.value());


        }
    });


   
    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        var colum = $("#CmbIdServicio").data("kendoComboBox");
        let data = colum.listView.dataSource.data().find(q => q.IdServicio === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = null;
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            sessionStorage.setItem("GestionFichasProduccion_CmbIdServicio", "");
            fn_ConsultarFicha();
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = this.value();
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbIdServicio", this.value());


        }
    });

    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = null;
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbFmCata", "");
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbIdServicio"));
            xCliente = KdoCmbGetValue($("#CmbIdCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = data.IdCatalogoDiseno;
            fn_ConsultarFicha();
            sessionStorage.setItem("GestionFichasProduccion_CmbFmCata", data.IdCatalogoDiseno);

        }
    });


    if (sessionStorage.getItem("GestionFichasProduccion_CmbIdServicio") !== null || sessionStorage.getItem("GestionFichasProduccion_CmbIdServicio") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_CmbIdCliente") !== null || sessionStorage.getItem("GestionFichasProduccion_CmbIdCliente") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_CmbPrograma") !== null || sessionStorage.getItem("GestionFichasProduccion_CmbPrograma") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_TxtNoOrdeTrabajo") !== null || sessionStorage.getItem("GestionFichasProduccion_TxtNoOrdeTrabajo") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_CmbFmCata") !== null || sessionStorage.getItem("GestionFichasProduccion_CmbFmCata") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_dFechaDesde") !== null || sessionStorage.getItem("GestionFichasProduccion_dFechaDesde") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_dFechaHasta") !== null || sessionStorage.getItem("GestionFichasProduccion_dFechaHasta") !== "" ||
        sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") !== null || sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") !== ""
    ) {
        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") === "true" || sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") === null ? 1 : 0);
        KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") === "true" || sessionStorage.getItem("GestionFichasProduccion_chkRangFechas") === null ? 1 : 0);
        xIdServicio = sessionStorage.getItem("GestionFichasProduccion_CmbIdServicio") === "" ? null : sessionStorage.getItem("GestionFichasProduccion_CmbIdServicio");
        xCliente = sessionStorage.getItem("GestionFichasProduccion_CmbIdCliente") === "" ? null : sessionStorage.getItem("GestionFichasProduccion_CmbIdCliente");
        xNoOt = sessionStorage.getItem("GestionFichasProduccion_TxtNoOrdeTrabajo") === "" ? null : sessionStorage.getItem("GestionFichasProduccion_TxtNoOrdeTrabajo");
        xIdPrograma = sessionStorage.getItem("GestionFichasProduccion_CmbPrograma") === "" ? null : sessionStorage.getItem("GestionFichasProduccion_CmbPrograma");
        xIdCatalogoDiseno = sessionStorage.getItem("GestionFichasProduccion_CmbFmCata") === "" ? null : sessionStorage.getItem("GestionFichasProduccion_CmbFmCata");
        fn_ConsultarFicha();
    }

    


});

//funcionamiento busqueda de OT
$.fn.extend({
    ControlSelecionOTSolicitudesProducion: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                placeholder: "Selección de ordenes de trabajo",
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () { return TSM_Web_APi + "SolicitudProducciones/GetSolicitudProduccionOrdenesTrabajos/" + (KdoCmbGetValue($("#CmbIdServicio")) === null ? 0 : KdoCmbGetValue($("#CmbIdServicio"))) + "/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "No Orden Trabajo", width: 125 },
                    { field: "NoDocReq", title: "No Requerimiento", width: 125 },
                    { field: "Nombre", title: "Nombre Diseño", width: 300 },
                    { field: "NumeroDiseno", title: "Numero Diseño", width: 200 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 },
                    { field: "NoPrograma", title: "No Programa", width: 125 },
                    { field: "NombrePrograma", title: "Nombre Programa", width: 200 }

                ]
            });
        });
    }
});


let fn_ConsultarFicha = function () {
    let g = $("#grid").data("kendoGrid");
    g.dataSource.read();
    g.pager.page(1);
};
fPermisos = function (datos) {
    Permisos = datos;
};

