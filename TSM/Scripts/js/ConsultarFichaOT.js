var Permisos;
let xFechaDesde = null;
let xFechaHasta = null;
let xIdServicio = 0;
let xCliente = 0;
let xNoOt = 0;
let xIdPrograma = 0;
let xIdCatalogoDiseno = 0;
$(document).ready(function () {

    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#CmbCliente"), UrlCli, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("ConsultarFichaOT_CmbCliente") === null ? "" : sessionStorage.getItem("ConsultarFichaOT_CmbCliente"));

    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    KdoCmbSetValue($("#CmbServicio"), sessionStorage.getItem("ConsultarFichaOT_CmbServicio") === null ? "" : sessionStorage.getItem("ConsultarFichaOT_CmbServicio"));

    $("#CmbFmCata").ControlSelecionFMCatalogo();
    KdoMultiColumnCmbSetValue($("#CmbFmCata"), sessionStorage.getItem("ConsultarFichaOT_CmbFmCata") === null ? "" : sessionStorage.getItem("ConsultarFichaOT_CmbFmCata"));
    //convertir a Kendo boutton
    KdoButton($("#btnConsultar"), "search", "Consultar");

    //convertir a Kendo date picker
    let dtfecha = new Date();
    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    //$("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("ConsultarFichaOT_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 6, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("ConsultarFichaOT_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("ConsultarFichaOT_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("ConsultarFichaOT_dFechaHasta"));

    //checkbox
    //$('#chkRangFechas').prop('checked', 1);

    $('#chkRangFechas').prop('checked', sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") === null ? 1 : sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") === "true" ? 1 : 0);
    //$('#chkMe').prop('checked', sessionStorage.getItem("ConsultarFichaOT_chkMe") === null ? 0 : sessionStorage.getItem("ConsultarFichaOT_chkMe") === "true" ? 1 : 0);

    // convertir a kendo Multicolum combobox
    $("#TxtNoOrdeTrabajo").ControlSeleccionOrdenesTrabajos();
    KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), sessionStorage.getItem("ConsultarFichaOT_TxtNoOrdeTrabajo") === null ? "" : sessionStorage.getItem("ConsultarFichaOT_TxtNoOrdeTrabajo"));

    $("#CmbPrograma").ControlSelecionPrograma();
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("ConsultarFichaOT_CmbPrograma") === null ? "" : sessionStorage.getItem("ConsultarFichaOT_CmbPrograma")); 

    //let dtfecha = new Date();
    //$("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    //$("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    //$("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    //$("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    //KdoButton($("#btnConsular"), "search", "Consultar");
    //Kendo_CmbFiltrarGrid($("#CmbCliente"), UrlCli, "Nombre", "IdCliente", "Opcional cliente ....");
    //Kendo_CmbFiltrarGrid($("#CmbPrograma"), UrlPro, "Nombre", "IdPrograma", "Opcional programa ....");
    //Kendo_CmbFiltrarGrid($("#CmbEjecutivo"), UrlEC, "Nombre", "IdEjecutivoCuenta", "Opcional ejecutivo de cuenta ....");
    //Kendo_CmbFiltrarGrid($("#CmbTemporada"), UrlTem, "Nombre", "IdTemporada", "Opcional temporada ....");
    //Kendo_CmbFiltrarGrid($("#CmbCategoriaPrenda"), UrlPren, "Nombre", "IdCategoriaPrenda", "Opcional prenda ....");
    //Kendo_CmbFiltrarGrid($("#CmbUbicacion"), UrlUbi, "Nombre", "IdUbicacion", "Opcional ubicación ....");
    //Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Opcional servicio ....");

    //$('#chkRangFechas').prop('checked', 1);
    ////KdoDatePikerEnable($("#dFechaDesde"), false);
    ////KdoDatePikerEnable($("#dFechaHasta"), false);

    //$("#btnConsular").click(function () {
    //    let g = $("#grid").data("kendoGrid");
    //    g.dataSource.read();
    //    g.pager.page(1);

    //});

    //$("#chkRangFechas").click(function () {
    //    if (this.checked) {
    //        KdoDatePikerEnable($("#dFechaDesde"), true);
    //        KdoDatePikerEnable($("#dFechaHasta"), true);

    //    } else {

    //        KdoDatePikerEnable($("#dFechaDesde"), false);
    //        KdoDatePikerEnable($("#dFechaHasta"), false);
    //    }
    //});

    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: UrlOT + "/GetConsultarFichaOT",
                    data: JSON.stringify({
                        FechaDesde: xFechaDesde,// $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                        FechaHasta: xFechaHasta, //$("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                        IdCliente: xCliente,
                        NoOt: xNoOt,
                        IdejecutivoCuenta: null,
                        IdPrograma: xIdPrograma,
                        IdTemporada:null,
                        IdCategoriaPrenda: null,//KdoCmbGetValue($("#CmbCategoriaPrenda")),
                        IdUbicacion:null,
                        IdServicio: xIdServicio,
                        IdCatalogoDiseno: xIdCatalogoDiseno
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($(document.body), false);
                        datos.success(result);
                    },
                    error: function () {
                        kendo.ui.progress($(document.body), false);
                        options.error(result);
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
                    DesEstadoOT: { type: "string" },
                    NoDocumento: { type: "string" },
                    Comentarios: { type: "string" },
                    NoDocumentoReq: { type: "string" },
                    IdRequerimiento: { type: "number" },
                    EstadoEtapa: { type: "string" },
                    Tabla: { type: "string" },
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
                    NombrePrograma: { type: "string" },
                    NoDocPrograma: { type: "string" },
                    IdTemporada: { type: "number" },
                    NombreTemp: { type: "string" },
                    IdEjecutivoCuenta: { type: "number" },
                    NombreEjecutivo: { type: "string" },
                    IdCatalogoDiseno: { type: "number" },
                    NoDocumentoCatalogo: { type: "string" },
                    IdMotivoDesarrollo: { type: "number" },
                    NombreMotivoDes: { type: "string" }
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
     
                //fn_VerEtapas("/ConsultarFichaOT/FichaOT/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#grid"), true);
                window.open("/ConsultarFichaOT/FichaOT/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#grid"), false);
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumentoCatalogo", title: "N° FM", minResizableWidth: 100 },
            { field: "NoDocumento", title: "No. O.T", minResizableWidth: 120 },
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true },
            { field: "NombreDiseño", title: "Nombre diseño", minResizableWidth: 150 },
            { field: "EstiloDiseno", title: "Estilo diseño", minResizableWidth: 150 },
            { field: "IdCategoriaPrenda", title: "Cod. prenda", hidden: true },
            { field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            { field: "IdEjecutivoCuenta", title: "Cod. ejecutivo", hidden: true },
            { field: "NombreEjecutivo", title: "Ejecutivo de cuenta", minResizableWidth: 150 },
            { field: "IdUbicacion", title: "Cod. ubicación", hidden: true },
            { field: "NombreUbicacion", title: "Ubicación", minResizableWidth: 120 },
            { field: "IdPrograma", title: "Cod. programa", hidden: true },
            { field: "NoDocPrograma", title: "No Programa", minResizableWidth: 100 },
            { field: "NombrePrograma", title: "Programa", minResizableWidth: 120 },
            { field: "Estado", title: "Estado Orden Trabajo", hidden: true },
            { field: "DesEstadoOT", title: "Estado" },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NombreCliente", title: "Nombre Cliente", minResizableWidth: 120 },
            { field: "IdTemporada", title: "Cod. temporada", hidden: true },
            { field: "NombreTemp", title: "Temporada", minResizableWidth: 120 },
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo Orden trabajo", hidden: true },
            { field: "TipoOrdenTrabajo", title: "Tipo de orden", minResizableWidth: 120 },
            { field: "FechaOrdenTrabajo", title: "Solicitud", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaInicio", title: "Inicio", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaFinal", title: "Final", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "IdSolicitudDisenoPrenda", title: "cod. Solicitud diseño prenda", hidden: true },
            { field: "IdPrioridadOrdenTrabajo", title: "Prioridad orden trabajo", hidden: true },
            { field: "Prioridad", title: "Prioridad", minResizableWidth: 120 },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "NoDocumentoReq", title: "No Requerimiento", minResizableWidth: 120, hidden: true  },
            { field: "IdRequerimiento", title: "Cod. Requerimiento", minResizableWidth: 120, hidden: true  },
            { field: "EstadoEtapa", title: "Estado etapa", hidden: true },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", minResizableWidth: 150 },
            { field: "UbicacionVertical", title: "Ubicación vertical", minResizableWidth: 150 },
            { field: "ColorTela", title: "Color tela", hidden: true },
            { field: "IdCatalogoDiseno", title: "Cod. Requerimiento", hidden: true, minResizableWidth: 150 },
            { field: "IdMotivoDesarrollo", title: "Cod. Motivo desarrollo", hidden: true },
            { field: "NombreMotivoDes", title: "Motivo desarrollo", minResizableWidth: 120 },
            { field: "IdServicio", title: "Cod. servicio", hidden: true },
            { field: "Servicio", title: "Servicio", minResizableWidth: 120 }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });


    $("#TxtNoOrdeTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = this.dataItem(e.item.index()).IdOrdenTrabajo;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_TxtNoOrdeTrabajo", this.dataItem(e.item.index()).IdOrdenTrabajo);

        } else {

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = null;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_TxtNoOrdeTrabajo", "");
        }
    });

    $("#TxtNoOrdeTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#TxtNoOrdeTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = null;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_TxtNoOrdeTrabajo", "");
        }

    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = this.dataItem(e.item.index()).IdPrograma;
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);


        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = null;
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbPrograma", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            xIdPrograma = null;
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbPrograma", "");
        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        xIdServicio = KdoCmbGetValue($("#CmbServicio"));
        xCliente = KdoCmbGetValue($("#CmbCliente"));
        xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
        xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
        xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
        fn_ConsultarFichaDesarrollo();
        sessionStorage.setItem("ConsultarFichaOT_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {

        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        xIdServicio = KdoCmbGetValue($("#CmbServicio"));
        xCliente = KdoCmbGetValue($("#CmbCliente"));
        xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
        xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
        xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
        fn_ConsultarFichaDesarrollo();
        sessionStorage.setItem("ConsultarFichaOT_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });

    $("#chkRangFechas").click(function () {

        KdoDatePikerEnable($("#dFechaDesde"), this.checked);
        KdoDatePikerEnable($("#dFechaHasta"), this.checked);
        xFechaDesde = this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
        xIdServicio = KdoCmbGetValue($("#CmbServicio"));
        xCliente = KdoCmbGetValue($("#CmbCliente"));
        xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
        xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
        xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
        fn_ConsultarFichaDesarrollo();
        sessionStorage.setItem("ConsultarFichaOT_chkRangFechas", this.checked);
    });


    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = this.dataItem(e.item.index()).IdCliente;
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = null;
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbCliente", "");
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = null;
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbCliente", "");
        }
    });


    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = this.dataItem(e.item.index()).IdServicio;
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbServicio", this.dataItem(e.item.index()).IdServicio);
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = null;
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbServicio", "");
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = null;
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
        }
    });


    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = this.dataItem(e.item.index()).IdCatalogoDiseno;
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbFmCata", this.dataItem(e.item.index()).IdCatalogoDiseno);


        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            fn_ConsultarFichaDesarrollo();
            xIdCatalogoDiseno = null;
            sessionStorage.setItem("ConsultarFichaOT_CmbFmCata", "");
        }
    });

    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = null;
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("ConsultarFichaOT_CmbFmCata", "");
        }
    });


    if (sessionStorage.getItem("ConsultarFichaOT_CmbServicio") !== null || sessionStorage.getItem("ConsultarFichaOT_CmbServicio") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_CmbCliente") !== null || sessionStorage.getItem("ConsultarFichaOT_CmbCliente") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_CmbPrograma") !== null || sessionStorage.getItem("ConsultarFichaOT_CmbPrograma") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_TxtNoOrdeTrabajo") !== null || sessionStorage.getItem("ConsultarFichaOT_TxtNoOrdeTrabajo") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_CmbFmCata") !== null || sessionStorage.getItem("ConsultarFichaOT_CmbFmCata") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_dFechaDesde") !== null || sessionStorage.getItem("ConsultarFichaOT_dFechaDesde") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_dFechaHasta") !== null || sessionStorage.getItem("ConsultarFichaOT_dFechaHasta") !== "" ||
        sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") !== null || sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") !== "" 
    ) {
        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');

        KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") === "true"  || sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") === null ? 1 : 0);
        KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") === "true" || sessionStorage.getItem("ConsultarFichaOT_chkRangFechas") ===null ? 1 : 0);

        xIdServicio = sessionStorage.getItem("ConsultarFichaOT_CmbServicio") === "" ? null : sessionStorage.getItem("ConsultarFichaOT_CmbServicio");
        xCliente = sessionStorage.getItem("ConsultarFichaOT_CmbCliente") === "" ? null : sessionStorage.getItem("ConsultarFichaOT_CmbCliente");
        xNoOt = sessionStorage.getItem("ConsultarFichaOT_TxtNoOrdeTrabajo") === "" ? null : sessionStorage.getItem("ConsultarFichaOT_TxtNoOrdeTrabajo");
        xIdPrograma = sessionStorage.getItem("ConsultarFichaOT_CmbPrograma") === "" ? null : sessionStorage.getItem("ConsultarFichaOT_CmbPrograma");
        xIdCatalogoDiseno = sessionStorage.getItem("ConsultarFichaOT_CmbFmCata") === "" ? null : sessionStorage.getItem("ConsultarFichaOT_CmbFmCata");
        fn_ConsultarFichaDesarrollo();
    }


});

let fn_ConsultarFichaDesarrollo = function () {
    let g = $("#grid").data("kendoGrid");
    g.dataSource.read();
    g.pager.page(1);
};
let fn_VerEtapas = function (url) {
    window.location.href = url;
};
fPermisos = function (datos) {
    Permisos = datos;
};