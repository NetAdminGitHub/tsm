var Permisos;
let xFechaDesde = null;
let xFechaHasta = null;
let xIdServicio = 0;
let xCliente = 0;
let xNoOt = 0;
let xIdPrograma = 0;
let xIdCatalogoDiseno = 0;
let obj_OT;
let obj_Pro;
let obj_idcat;
$(document).ready(function () {

    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#CmbCliente"), UrlCli, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("cFOT_CmbCliente") === null ? "" : sessionStorage.getItem("cFOT_CmbCliente"));

    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");
    KdoCmbSetValue($("#CmbServicio"), sessionStorage.getItem("cFOT_CmbServicio") === null ? "" : sessionStorage.getItem("cFOT_CmbServicio"));

    $("#CmbFmCata").CSFMCatalogo();
    if (sessionStorage.cFOT_IdCata !== undefined && sessionStorage.cFOT_IdCata !== "") {
        fn_multiColumnSetJson($("#CmbFmCata"), sessionStorage.cFOT_IdCata, JSON.parse(sessionStorage.cFOT_IdCata).IdCatalogoDiseno);
        obj_idcat = JSON.parse(sessionStorage.cFOT_IdCata);
    }
    //convertir a Kendo boutton
    KdoButton($("#btnConsultar"), "search", "Consultar");

    //convertir a Kendo date picker
    let dtfecha = new Date();
    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    //$("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("cFOT_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("cFOT_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("cFOT_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("cFOT_dFechaHasta"));

    //checkbox
    //$('#chkRangFechas').prop('checked', 1);

    $('#chkRangFechas').prop('checked', sessionStorage.getItem("cFOT_chkRangFechas") === null ? 1 : sessionStorage.getItem("cFOT_chkRangFechas") === "true" ? 1 : 0);

    // convertir a kendo Multicolum combobox
    $("#TxtNoOrdeTrabajo").GetOrdenesTrabajos();

    //*** buscar ot y asignar filtro**/
    if (sessionStorage.cFOT_Ot !== undefined && sessionStorage.cFOT_Ot !== "") {
        fn_multiColumnSetJson($("#TxtNoOrdeTrabajo"), sessionStorage.cFOT_Ot, JSON.parse(sessionStorage.cFOT_Ot).IdOrdenTrabajo);
        obj_OT = JSON.parse(sessionStorage.cFOT_Ot);
    }


    $("#CmbPrograma").ControlSelecionProg();
    if (sessionStorage.cFOT_Pro !== undefined && sessionStorage.cFOT_Pro !== "") {
        fn_multiColumnSetJson($("#CmbPrograma"), sessionStorage.cFOT_Pro, JSON.parse(sessionStorage.cFOT_Pro).IdPrograma);
        obj_Pro = JSON.parse(sessionStorage.cFOT_Pro);
    }

    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: UrlOT + "/GetConsultarFichasDesarrollos",
                    data: JSON.stringify({
                        FechaDesde: xFechaDesde,// $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                        FechaHasta: xFechaHasta, //$("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                        IdCliente: xCliente,
                        NoOt: xNoOt,
                        IdejecutivoCuenta: null,
                        IdPrograma: xIdPrograma,
                        IdTemporada: null,
                        IdCategoriaPrenda: null,//KdoCmbGetValue($("#CmbCategoriaPrenda")),
                        IdUbicacion: null,
                        IdServicio: xIdServicio,
                        IdCatalogoDiseno: xIdCatalogoDiseno
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($(document.body), false);
                        datos.success(result);
                    },
                    error: function (result) {
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
                    NombreMotivoDes: { type: "string" },
                    IdCategoriaTallaDesarrollada: { type: "number" },
                    TallaDesarrollada: { type: "string" },
                    MesFechaOT: { type: "string" },
                    NoDocRSP: { type: "string" },
                    CantidadPiezas: { type: "number" },
                    CantidadSTrikeOff: { type: "number" },
                    StrikeOffAdicional: { type: "number" },
                    Tecnicas: { type: "string" },
                    IdComposicionTela: { type: "number" },
                    NombreComposicion: { type: "string" }

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

                //fn_VerEtapas("/cFOT/FichaOT/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#grid"), true);
                window.open("/ConsultaFichasDesarrollos/FichaOT/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#grid"), false);
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        toolbar: ["excel"],
        excel: {
            fileName: "FichasdeDesarrollos.xlsx",
            filterable: true,
            allPages: true
        },
        columns: [
            { field: "FechaInicio", title: "Inicio", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "MesFechaOT", title: "Mes", minResizableWidth: 50 },
            { field: "NombreCliente", title: "Nombre Cliente", minResizableWidth: 120 },
            { field: "NoDocPrograma", title: "No Programa", minResizableWidth: 100 },
            { field: "NoDocRSP", title: "Registro de Prenda", minResizableWidth: 100 },
            { field: "NoDocumentoCatalogo", title: "N° FM", minResizableWidth: 100 },
            { field: "NoDocumento", title: "No. O.T", minResizableWidth: 120 },
            { field: "NombrePrograma", title: "Programa", minResizableWidth: 120 },
            { field: "NombreDiseño", title: "Nombre diseño", minResizableWidth: 150 },
            { field: "TallaDesarrollada", title: "Talla Desarrollada", minResizableWidth: 150 },
            { field: "ColorTela", title: "Color tela", minResizableWidth: 150 },
            { field: "CantidadPiezas", title: "Cantidad Piezas", minResizableWidth: 50 },
            { field: "CantidadSTrikeOff", title: "STrikeOff", minResizableWidth: 50 },
            { field: "StrikeOffAdicional", title: "StrikeOff Adicional", minResizableWidth: 50 },
            { field: "NombreMotivoDes", title: "Motivo desarrollo", minResizableWidth: 120 },
            { field: "TipoOrdenTrabajo", title: "Tipo de orden", minResizableWidth: 120 },
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true },
            { field: "NombreTemp", title: "Temporada", minResizableWidth: 120 },
            { field: "EstadoEtapa", title: "Estado etapa", hidden: true },
            { field: "EstiloDiseno", title: "Estilo diseño", minResizableWidth: 150 },
            { field: "IdCategoriaPrenda", title: "Cod. prenda", hidden: true },
            { field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            { field: "IdComposicionTela", title: "cod. Composicion Tela", minResizableWidth: 120, hidden: true },
            { field: "NombreComposicion", title: "Composición Tela", minResizableWidth: 120 },
            { field: "IdCategoriaTallaDesarrollada", title: "Cod. categoría talla", hidden: true },
            { field: "IdEjecutivoCuenta", title: "Cod. ejecutivo", hidden: true },
            { field: "NombreEjecutivo", title: "Ejecutivo de cuenta", minResizableWidth: 150 },
            { field: "IdUbicacion", title: "Cod. ubicación", hidden: true },
            { field: "NombreUbicacion", title: "Ubicación", minResizableWidth: 120 },
            { field: "IdPrograma", title: "Cod. programa", hidden: true },
            { field: "Estado", title: "Estado Orden Trabajo", hidden: true },
            { field: "DesEstadoOT", title: "Estado" },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "IdTemporada", title: "Cod. temporada", hidden: true },
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo Orden trabajo", hidden: true },
            { field: "FechaOrdenTrabajo", title: "Solicitud", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaFinal", title: "Final", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "IdSolicitudDisenoPrenda", title: "cod. Solicitud diseño prenda", hidden: true },
            { field: "IdPrioridadOrdenTrabajo", title: "Prioridad orden trabajo", hidden: true },
            { field: "Prioridad", title: "Prioridad", minResizableWidth: 120 },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "NoDocumentoReq", title: "No Requerimiento", minResizableWidth: 120, hidden: true },
            { field: "IdRequerimiento", title: "Cod. Requerimiento", minResizableWidth: 120, hidden: true },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", minResizableWidth: 150 },
            { field: "UbicacionVertical", title: "Ubicación vertical", minResizableWidth: 150 },
            { field: "IdCatalogoDiseno", title: "Cod. Requerimiento", hidden: true, minResizableWidth: 150 },
            { field: "IdMotivoDesarrollo", title: "Cod. Motivo desarrollo", hidden: true },
            { field: "IdServicio", title: "Cod. servicio", hidden: true },
            { field: "Servicio", title: "Servicio", minResizableWidth: 120 },
            { field: "Tecnica", title: "Técnica", minResizableWidth: 150 }//Ancho minimo de la columna recomendada por William Sobado

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
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
            sessionStorage.setItem('cFOT_Ot', "");
        } else {
            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            if (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null) { fn_SetValueMulticolumIdProgramaCfd($("#CmbPrograma"), data.IdPrograma); }
            if (KdoMultiColumnCmbGetValue($("#CmbFmCata")) === null) { fn_SetValueMulticolumIdFMCfd($("#CmbFmCata"), data.IdCatalogoDiseno); }
            sessionStorage.setItem("cFOT_CmbCliente", data.IdCliente);

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = data.IdCliente;
            xNoOt = data.IdOrdenTrabajo;
            xIdPrograma = data.IdPrograma;
            xIdCatalogoDiseno = data.IdCatalogoDiseno;
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem('cFOT_Ot', JSON.stringify(data.toJSON()));
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
        sessionStorage.setItem("cFOT_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
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
        sessionStorage.setItem("cFOT_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
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
        sessionStorage.setItem("cFOT_chkRangFechas", this.checked);
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {

        var colum = $("#CmbCliente").data("kendoComboBox");
        let data = colum.listView.dataSource.data().find(q => q.IdCliente === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = null;
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_CmbCliente", "");
        } else {

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = this.value();
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_CmbCliente", this.value());

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
            sessionStorage.setItem("cFOT_Pro", "");

        } else {
            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            sessionStorage.setItem("cFOT_CmbCliente", data.IdCliente);
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = data.IdPrograma;
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_Pro", JSON.stringify(data.toJSON()));
        }

    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        var colum = $("#CmbServicio").data("kendoComboBox");
        let data = colum.listView.dataSource.data().find(q => q.IdServicio === Number(this.value()));
        if (data === undefined) {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = null;
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_CmbServicio", "");
        } else {
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = this.value();
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = KdoMultiColumnCmbGetValue($("#CmbFmCata"));
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_CmbServicio", this.value());
        }
    });

    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), "");
            sessionStorage.setItem('cFOT_Ot', "");
            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente = KdoCmbGetValue($("#CmbCliente"));
            xNoOt = KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdCatalogoDiseno = null;
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_IdCata", "");
        } else {
            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), "");
            sessionStorage.setItem('cFOT_Ot', "");
            if (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null) { fn_SetValueMulticolumIdProgramaCfd($("#CmbPrograma"), data.IdPrograma); }
            sessionStorage.setItem("cFOT_CmbCliente", data.IdCliente);

            xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
            xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');
            xIdServicio = KdoCmbGetValue($("#CmbServicio"));
            xCliente =data.IdCliente;
            xNoOt = null;
            xIdPrograma = data.IdPrograma;
            xIdCatalogoDiseno = data.IdCatalogoDiseno;
            fn_ConsultarFichaDesarrollo();
            sessionStorage.setItem("cFOT_IdCata", JSON.stringify(data.toJSON()));
        }
    });


    if (sessionStorage.getItem("cFOT_CmbServicio") !== null || sessionStorage.getItem("cFOT_CmbServicio") !== "" ||
        sessionStorage.getItem("cFOT_CmbCliente") !== null || sessionStorage.getItem("cFOT_CmbCliente") !== "" ||
        obj_Pro !== undefined ||
        obj_OT !== undefined ||
        obj_idcat !== undefined ||
        sessionStorage.getItem("cFOT_dFechaDesde") !== null || sessionStorage.getItem("cFOT_dFechaDesde") !== "" ||
        sessionStorage.getItem("cFOT_dFechaHasta") !== null || sessionStorage.getItem("cFOT_dFechaHasta") !== "" ||
        sessionStorage.getItem("cFOT_chkRangFechas") !== null || sessionStorage.getItem("cFOT_chkRangFechas") !== ""
    ) {
        xFechaDesde = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's');
        xFechaHasta = $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's');

        KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("cFOT_chkRangFechas") === "true" || sessionStorage.getItem("cFOT_chkRangFechas") === null ? 1 : 0);
        KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("cFOT_chkRangFechas") === "true" || sessionStorage.getItem("cFOT_chkRangFechas") === null ? 1 : 0);

        xIdServicio = sessionStorage.getItem("cFOT_CmbServicio") === "" ? null : sessionStorage.getItem("cFOT_CmbServicio");
        xCliente = sessionStorage.getItem("cFOT_CmbCliente") === "" ? null : sessionStorage.getItem("cFOT_CmbCliente");
        xNoOt = obj_OT === "" || obj_OT === undefined ? null : obj_OT.IdOrdenTrabajo;
        xIdPrograma = obj_Pro === "" || obj_Pro === undefined ? null : obj_Pro.IdPrograma;
        xIdCatalogoDiseno = obj_idcat === "" || obj_idcat === undefined ? null : obj_idcat.IdCatalogoDiseno
        fn_ConsultarFichaDesarrollo();
    }


});

$.fn.extend({
    ControlSelecionProg: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Programas/GetProgramasFiltroCliente/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 },
                    { field: "NombreTemporada", title: "Temporada", width: 300 }
                ]
            });
        });
    }
});

$.fn.extend({
    CSFMCatalogo: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetbyidClienteIdPrograma/" + (KdoCmbGetValue($("#CmbCliente")) == null ? 0 : KdoCmbGetValue($("#CmbCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    }
});

$.fn.extend({
    GetOrdenesTrabajos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección de Ordenes de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () { return TSM_Web_APi + "OrdenesTrabajos/GetOTConsulta/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbFmCata")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbFmCata"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "NoDocReq", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 }

                ]
            });
        });
    }
});

// obtiene el programa y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdProgramaCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('cFOT_Pro', JSON.stringify(data[0]));
        }
    });
}

// obtiene la orden de trabajo y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdOTCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('cFOT_Ot', JSON.stringify(data[0]));
        }
    });
}

let fn_SetValueMulticolumIdFMCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos/Getbyid/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data), id);
            sessionStorage.setItem('cFOT_IdCata', JSON.stringify(data));
        }
    });
}

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