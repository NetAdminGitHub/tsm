let UrlClie = TSM_Web_APi + "Clientes";
let UrlServ = TSM_Web_APi + "Servicios";
var Permisos;
$(document).ready(function () {

    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlServ, "Nombre", "IdServicio", "Selecione un Servicio...");

    //convertir a Kendo boutton
    KdoButton($("#btnConsultar"), "search", "Consultar");

    //convertir a Kendo date picker
    let dtfecha = new Date();
    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());

    //checkbox
    $('#chkRangFechas').prop('checked', 1);

    // convertir a kendo Multicolum combobox
    $("#TxtNoOrdeTrabajo").ControlSelecionOTSolicitudesProducion();
    $("#CmbPrograma").ControlSelecionPrograma();


    $("#btnConsultar").click(function () {
        let g = $("#grid").data("kendoGrid");
        g.dataSource.read();
        g.pager.page(1);
    });

    //#region configuracion del grid

    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: TSM_Web_APi + "SolicitudProducciones/GetConsultaFichasProducciones",
                    data: JSON.stringify({
                        FechaDesde: $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                        FechaHasta: $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                        IdServicio: KdoCmbGetValue($("#CmbIdServicio")),
                        IdCliente: KdoCmbGetValue($("#CmbIdCliente")),
                        NoOt: KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo")),
                        IdPrograma: KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                      
                       
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    },
                    error: function () {
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
                    NoDocumentoReq: { type: "string" }
                
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
                window.open("/ConsultarFichaOT/FichaOT/" + grid.dataItem(this).IdOrdenTrabajo.toString());
                kendo.ui.progress($("#grid"), false);
               
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento", title: "No. O.T", minResizableWidth: 120 },
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true },
            { field: "NombreDiseño", title: "Nombre diseño", minResizableWidth: 150 },
            { field: "EstiloDiseno", title: "Estilo diseño", minResizableWidth: 150 },
            { field: "NoDocumentoReq", title: "No Doc Requerimiento", minResizableWidth: 150 },
            { field: "NoDocumentoSim", titel: "No Doc Simulación", minResizableWidth: 150 },
            { field: "NoDocumentoCoti", titel: "No Doc Cotización", minResizableWidth: 150 },
            { field: "IdCategoriaPrenda", title: "Cod. prenda", hidden: true },
            { field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            { field: "IdUbicacion", title: "Cod. ubicación", hidden: true },
            { field: "NombreUbicacion", title: "Ubicación", hidden: true, minResizableWidth: 120 },
            { field: "IdPrograma", title: "Cod. programa", hidden: true },
            { field: "NoDocPrograma", title: "No Doc Programa", minResizableWidth: 120 },
            { field: "NombrePrograma", title: "Programa", minResizableWidth: 120 },
            { field: "IdTemporada", title: "Cod. temporada", hidden: true },
            { field: "NombreTemp", title: "Temporada", minResizableWidth: 120 },
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo Orden trabajo", hidden: true },
            { field: "TipoOrdenTrabajo", title: "Tipo de orden", hidden: true,minResizableWidth: 120 },
            { field: "FechaOrdenTrabajo", title: "Fecha O. T.", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "EstadoFormulas", title: "Estado Fórmulas", hidden: true, minResizableWidth: 120 },
            { field: "FechaInicio", title: "Fecha inicio", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaFinal", title: "Fecha final", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "IdSolicitudDisenoPrenda", title: "cod. Solicitud diseño prenda", hidden: true },
            { field: "IdPrioridadOrdenTrabajo", title: "Prioridad orden trabajo", hidden: true },
            { field: "Prioridad", title: "Prioridad", hidden: true,minResizableWidth: 120 },
            { field: "Estado", title: "Estado orden", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NombreCliente", title: "Nombre Cliente", minResizableWidth: 120 },
            { field: "IdServicio", title: "Cod. servicio", hidden: true },
            { field: "Servicio", title: "Servicio", minResizableWidth: 120 },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", hidden: true ,minResizableWidth: 150 },
            { field: "UbicacionVertical", title: "Ubicación vertical", hidden: true , minResizableWidth: 150 },
            { field: "ColorTela", title: "Color tela", hidden: true },
            { field: "IdEjecutivoCuenta", title: "Cod. ejecutivo", hidden: true },
            { field: "NombreEjecutivo", title: "Ejecutivo de cuenta", minResizableWidth: 150 },
            { field: "IdSimulacion", title: "Cod. Simulación", hidden: true,minResizableWidth: 150 },
            { field: "IdCotizacion", title: "Cod. Cotizacion", hidden: true, minResizableWidth: 150 },
            { field: "IdRequerimiento", title: "Cod. Requerimiento", hidden: true, minResizableWidth: 150 },
            { field: "NoDocumentoReq", title: "No Doc Requerimiento", hidden: true, minResizableWidth: 150 }
            
        

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    //#endregion 


    $("#chkRangFechas").click(function () {
        if (this.checked) {
            KdoDatePikerEnable($("#dFechaDesde"), true);
            KdoDatePikerEnable($("#dFechaHasta"), true);

        } else {

            KdoDatePikerEnable($("#dFechaDesde"), false);
            KdoDatePikerEnable($("#dFechaHasta"), false);
        }
    });

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

fPermisos = function (datos) {
    Permisos = datos;
};

