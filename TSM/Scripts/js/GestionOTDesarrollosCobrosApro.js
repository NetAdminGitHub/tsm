let UrlClie = TSM_Web_APi + "Clientes";
let UrlServ = TSM_Web_APi + "Servicios";
var Permisos;
$(document).ready(function () {

    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");


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
    $("#TxtNoOrdeTrabajo").OrdenesTrabajosFinalizadas();
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
                    url: TSM_Web_APi + "OrdenesTrabajos/GetOTDesarrollosCobrosApro",
                    data: JSON.stringify({
                        FechaDesde: $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                        FechaHasta: $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
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
                    NoOrdenTrabajo: { type: "string" },
                    FechaInicio: { type: "date" },
                    FechaFinal: { type: "date" },
                    IdCliente: { type: "number" },
                    NombreDiseño: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    IdCategoriaPrenda: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    NoRequerimiento: { type: "string" },
                    CobroAprobado: {type: "bool"}


                }
            }
        }
    });
    var selectedRows = [];
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({

        dataBound: function () {
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
            { field: "NoOrdenTrabajo", title: "No. O.T", minResizableWidth: 120 },
            { field: "IdOrdenTrabajo", title: "Cod. Orden Trabajo", hidden: true },
            { field: "NombreDiseño", title: "Nombre diseño", minResizableWidth: 150 },
            { field: "EstiloDiseno", title: "Estilo diseño", minResizableWidth: 150 },
            { field: "NoRequerimiento", title: "No Doc Requerimiento", minResizableWidth: 150 },
            { field: "IdPrograma", title: "Cod. programa", hidden: true },
            { field: "NoDocPrograma", title: "No Doc Programa", minResizableWidth: 120 },
            { field: "NombrePrograma", title: "Programa", minResizableWidth: 120 },
            { field: "FechaInicio", title: "Fecha inicio", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "FechaFinal", title: "Fecha final", format: "{0: dd/MM/yyyy}", minResizableWidth: 120 },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "IdRequerimiento", title: "Cod. Requerimiento", hidden: true, minResizableWidth: 150 },
            { field: "CobroAprobado", title: "Cobro Aprobado", template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "CobroAprobado"); }, minResizableWidth: 150},
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
    OrdenesTrabajosFinalizadas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder:"Seleccione Orden de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosRequerimientos/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "NoDocReq", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 },
                    { field: "Tecnicas", title: "Tecnicas", width: 200 },
                    { field: "Tallas", title: "Tallas", width: 200 }

                ]
            });
        });
    }
});

fPermisos = function (datos) {
    Permisos = datos;
};

