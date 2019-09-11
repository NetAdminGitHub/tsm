var Permisos;
$(document).ready(function () {
    let dtfecha = new Date();
    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    KdoButton($("#btnConsular"), "search", "Consultar");
    Kendo_CmbFiltrarGrid($("#CmbCliente"), UrlCli, "Nombre", "IdCliente", "Opcional cliente ....");
    Kendo_CmbFiltrarGrid($("#CmbPrograma"), UrlPro, "Nombre", "IdPrograma", "Opcional programa ....");
    Kendo_CmbFiltrarGrid($("#CmbEjecutivo"), UrlEC, "Nombre", "IdEjecutivoCuenta", "Opcional ejecutivo de cuenta ....");
    Kendo_CmbFiltrarGrid($("#CmbTemporada"), UrlTem, "Nombre", "IdTemporada", "Opcional temporada ....");
    Kendo_CmbFiltrarGrid($("#CmbCategoriaPrenda"), UrlPren, "Nombre", "IdCategoriaPrenda", "Opcional prenda ....");
    Kendo_CmbFiltrarGrid($("#CmbUbicacion"), UrlUbi, "Nombre", "IdUbicacion", "Opcional ubicación ....");
    Kendo_CmbFiltrarGrid($("#CmbServicio"), UrlServ, "Nombre", "IdServicio", "Opcional servicio ....");

    $('#chkRangFechas').prop('checked', 0);
    KdoDatePikerEnable($("#dFechaDesde"), false);
    KdoDatePikerEnable($("#dFechaHasta"), false);

    $("#btnConsular").click(function (e) {
        $("#grid").data("kendoGrid").dataSource.read();
    });

    $("#chkRangFechas").click(function () {
        if (this.checked) {
            KdoDatePikerEnable($("#dFechaDesde"), true);
            KdoDatePikerEnable($("#dFechaHasta"), true);

        } else {

            KdoDatePikerEnable($("#dFechaDesde"), false);
            KdoDatePikerEnable($("#dFechaHasta"), false);
        }
    });

    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                datos.success(fn_GestionOT());
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
                    IDDocumento: { type: "number" },
                    IdEtapaProceso: { type: "number" },
                    Etapa: { type: "string" },
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
                    IdTemporada: { type: "number" },
                    NombreTemp: { type: "string" },
                    IdEjecutivoCuenta: { type: "number" },
                    NombreEjecutivo: { type: "string" }
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
                this.columnResizeHandleWidth
            }
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                fn_VerEtapas("/OrdenesTrabajo/ElementoTrabajo/" + grid.dataItem(this).IdOrdenTrabajo.toString() + "/" + grid.dataItem(this).IdEtapaProceso.toString());
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento", title: "No. O.T", minResizableWidth: 120 },
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true },
            { field: "NombreDiseño", title: "Nombre diseño", minResizableWidth: 150 },
            { field: "EstiloDiseno", title: "Estilo diseño", minResizableWidth: 150 },
            { field: "IdCategoriaPrenda", title: "Cod. prenda", hidden: true },
            { field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            { field: "IdUbicacion", title: "Cod. ubicación", hidden: true },
            { field: "NombreUbicacion", title: "Ubicación", minResizableWidth: 120 },
            { field: "IdPrograma", title: "Cod. programa", hidden: true },
            { field: "NombrePrograma", title: "Programa", minResizableWidth: 120 },
            { field: "IdTemporada", title: "Cod. temporada", hidden: true },
            { field: "NombreTemp", title: "Temporada", minResizableWidth: 120 },
            { field: "IdTipoOrdenTrabajo", title: "Cod. tipo Orden trabajo", hidden: true },
            { field: "TipoOrdenTrabajo", title: "Tipo de orden", minResizableWidth: 120 },
            { field: "FechaOrdenTrabajo", title: "Fecha O. T.", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaInicio", title: "Fecha inicio", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaFinal", title: "Fecha final", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "IdSolicitudDisenoPrenda", title: "cod. Solicitud diseño prenda", hidden: true },
            { field: "IdPrioridadOrdenTrabajo", title: "Prioridad orden trabajo", hidden: true },
            { field: "Prioridad", title: "Prioridad", minResizableWidth: 120 },
            { field: "Estado", title: "Estado orden", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "IDDocumento", title: "No Documento", minResizableWidth: 120 },
            { field: "IdEtapaProceso", title: "Etapa proceso", hidden: true },
            { field: "Etapa", title: "Etapa", minResizableWidth: 120 },
            { field: "EstadoEtapa", title: "Estado etapa", hidden: true },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NombreCliente", title: "Nombre Cliente", minResizableWidth: 120 },
            { field: "IdServicio", title: "Cod. servicio", hidden: true },
            { field: "Servicio", title: "Servicio", minResizableWidth: 120 },
            { field: "UbicacionHorizontal", title: "Ubicación horizontal", minResizableWidth: 150 },
            { field: "UbicacionVertical", title: "Ubicación vertical", minResizableWidth: 150 },
            { field: "ColorTela", title: "Color tela", hidden: true },
            { field: "IdEjecutivoCuenta", title: "Cod. ejecutivo", hidden: true },
            { field: "NombreEjecutivo", title: "Ejecutivo de cuenta", minResizableWidth: 150 }
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

});


let fn_GestionOT = function () {
    kendo.ui.progress($(document.body), true);
    let DSOt = "[]";
    $.ajax({
        type: "POST",
        dataType: 'json',
        async: false,
        url: UrlOT + "/GetGestionOTAsignadas",
        data: JSON.stringify({
            FechaDesde: $("#chkRangFechas").is(':checked')===false?null: kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            FechaHasta: $("#chkRangFechas").is(':checked') === false ? null :kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            IdCliente: KdoCmbGetValue( $("#CmbCliente")),
            NoOt: $("#TxtNoOrdeTrabajo").val() === "" ? null: $("#TxtNoOrdeTrabajo").val(),
            IdejecutivoCuenta: KdoCmbGetValue($("#CmbEjecutivo")),
            IdPrograma: KdoCmbGetValue($("#CmbPrograma")),
            IdTemporada: KdoCmbGetValue($("#CmbTemporada")),
            IdCategoriaPrenda: KdoCmbGetValue($("#CmbCategoriaPrenda")),
            IdUbicacion: KdoCmbGetValue($("#CmbUbicacion")),
            IdServicio: KdoCmbGetValue($("#CmbServicio"))
        }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            DSOt = result;
        },
        error: function() {
            DSOt = "[]";
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return DSOt;
};

let fn_VerEtapas = function (url) {
    window.location.href = url; 
}
fPermisos = function (datos) {
    Permisos = datos;
};