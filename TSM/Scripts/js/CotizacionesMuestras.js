var Permisos;
let UrlClie = TSM_Web_APi + "Clientes";
let UrlPro = TSM_Web_APi + "Programas";
let VIdCliente = 0;
$(document).ready(function () {

    // configurar clientes y servicios
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), "");

    //#region PRGRANMACION DEL GRID citizacion
    var DsRD = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CotizacionesMuestras/GetIdCliente/" + VIdCliente; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CotizacionesMuestras/" + datos.IdCotizacion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "CotizacionesMuestras",
                dataType: "json",
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
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacion",
                fields: {
                    IdCotizacion: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdPrograma: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NombrePro: { type: "string" },
                    IdCliente: {
                        type: "string"
                    },
                    NoCuenta: { type: "string" },
                    NombreCli: { type: "string" },
                    FechaCotizacion: { type: "date" },
                    FechaAprobacion: { type: "date" },
                    FechaCreacion: {
                        type: "date"
                    },
                    IdUsuario: { type: "string", defaultValue: getUser() },
                    Comentarios: { type: "string" },
                    Estado: { type: "string", defaultValue: "EDICION" },
                    Contacto: { type: "string" },
                    CotizaPromedio: { type: "bool" },
                    PrecioPreliminar: { type: "bool", defaultValue: 1 },
                    FinalCotizacion: { type: "bool" },
                    PrecioDesarrolloMuestra: { type: "string" },
                    CondicionPagoDesarrollo: { type: "string" },
                    PrecioVendedorCTL: { type: "string" },
                    CondicionPagoCTL: { type: "string" },
                    Transporte: { type: "string" },
                    CondicionPagoProduccion: { type: "string" },
                    NumeroSeteos: { type: "string" },
                    CotizacionVigencia: { type: "string" },
                    PorcentajeSegundos: { type: "string" },
                    NombreEst: { type: "string" },
                    PrecioSetupAdicional: { type: "string" },
                    PrecioAdicionalColorTela: { type: "string" },
                    TerminosPago: { type: "string" },
                    ExcesoSetup: { type: "string" },
                    PrecioSetup: { type: "string" },
                    RepeticionesDesarrollo: { type: "string" },
                    RepeticionesCTL: { type: "string" }
                }
            }
        }
    });

    var selectedRows = [];

    $("#gridCotizacion").kendoGrid({
        autoBind: false,
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                window.location.href = "/CotizacionesMuestras/CotizacionesMuestrasDatos/" + grid.dataItem(this).IdCotizacion.toString() + "/" + grid.dataItem(this).Estado.toString();
            });
            Grid_SetSelectRow($("#gridCotizacion"), selectedRows);
        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCotizacion");
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "FechaCotizacion");
            KdoHideCampoPopup(e.container, "NombreCli");
            KdoHideCampoPopup(e.container, "NombrePro");
            KdoHideCampoPopup(e.container, "FechaAprobacion");
            KdoHideCampoPopup(e.container, "IdUsuario");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NombreEst");
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "Contacto");
            KdoHideCampoPopup(e.container, "Comentarios");
            KdoHideCampoPopup(e.container, "CotizaPromedio");
            KdoHideCampoPopup(e.container, "PrecioPreliminar");
            KdoHideCampoPopup(e.container, "FinalCotizacion");
            KdoHideCampoPopup(e.container, "PrecioDesarrolloMuestra");
            KdoHideCampoPopup(e.container, "CondicionPagoDesarrollo");
            KdoHideCampoPopup(e.container, "PrecioVendedorCTL");
            KdoHideCampoPopup(e.container, "CondicionPagoCTL");
            KdoHideCampoPopup(e.container, "Transporte");
            KdoHideCampoPopup(e.container, "CondicionPagoProduccion");
            KdoHideCampoPopup(e.container, "NumeroSeteos");
            KdoHideCampoPopup(e.container, "CotizacionVigencia");
            KdoHideCampoPopup(e.container, "PorcentajeSegundos");
            KdoHideCampoPopup(e.container, "PrecioSetupAdicional");
            KdoHideCampoPopup(e.container, "PrecioAdicionalColorTela");
            KdoHideCampoPopup(e.container, "TerminosPago");
            KdoHideCampoPopup(e.container, "ExcesoSetup");
            KdoHideCampoPopup(e.container, "PrecioSetup");
            KdoHideCampoPopup(e.container, "RepeticionesDesarrollo");
            KdoHideCampoPopup(e.container, "RepeticionesCTL");
            if (!e.model.isNew()) {
                KdoComboBoxEnable($('[name="IdPrograma"]'), false);
            }
            $('[name="FechaCreacion"]').data("kendoDatePicker").enable(false);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCotizacion", title: "Cod. Cotización", hidden: true },
            { field: "NoDocumento", title: "No Cotización" },
            { field: "FechaCotizacion", title: "Fecha Cotización", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "FechaCreacion", title: "Fecha Creación", format: "{0: dd/MM/yyyy}" },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NoCuenta", title: "NoCuenta" },
            { field: "NombreCli", title: "Nombre del Cliente" },
            { field: "IdPrograma", title: "Programa", editor: Grid_Combox, values: ["IdPrograma", "Nombre", UrlPro, "", "Seleccione....", "required", "CmbIdCliente", "requerido"], hidden: true },
            { field: "NombrePro", title: "Nombre del Programa " },
            { field: "FechaAprobacion", title: "Fecha Aprobación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "IdUsuario", title: "Usuario", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NombreEst", title: "Estado cotización" },
            { field: "Contacto", title: "Contacto", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true },
            { field: "CotizaPromedio", title: "Cotiza Promedio", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "CotizaPromedio"); }, hidden: true },
            { field: "PrecioPreliminar", title: "Precio Preliminar", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "PrecioPreliminar"); }, hidden: true },
            { field: "FinalCotizacion", title: "Final Cotizacion", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "FinalCotizacion"); }, hidden: true },
            { field: "PrecioDesarrolloMuestra", title: "Precio Desarrollo Muestra $", hidden: true },
            { field: "CondicionPagoDesarrollo", title: "Condicion Pago Desarrollo", hidden: true },
            { field: "PrecioVendedorCTL", title: "Precio Vendedor CTLs", hidden: true },
            { field: "CondicionPagoCTL", title: "Condicion Pago CTL", hidden: true },
            { field: "Transporte", title: "Transporte", hidden: true },
            { field: "CondicionPagoProduccion", title: "Condicion Pago Produccion", hidden: true },
            { field: "NumeroSeteos", title: "Numero Seteos", hidden: true },
            { field: "CotizacionVigencia", title: "Cotizacion Vigencia", hidden: true },
            { field: "PorcentajeSegundos", title: "Porcentaje Segundos", hidden: true },
            { field: "PrecioSetupAdicional", title: "Numero Seteos", hidden: true },
            { field: "PrecioAdicionalColorTela", title: "Numero Seteos", hidden: true },
            { field: "TerminosPago", title: "Numero Seteos", hidden: true },
            { field: "ExcesoSetup", title: "Numero Seteos", hidden: true },
            { field: "PrecioSetup", title: "Numero Seteos", hidden: true },
            { field: "RepeticionesDesarrollo", title: "Numero Seteos", hidden: true },
            { field: "RepeticionesCTL", title: "Numero Seteos", hidden: true }
        ]
    });

    SetGrid($("#gridCotizacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 500);
    SetGrid_CRUD_ToolbarTop($("#gridCotizacion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCotizacion").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCotizacion").data("kendoGrid"), DsRD);

    Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);

    //#endregion FIN PROGRAMACIÓN DEL GRID cotizacion
    //#region seleccion de servicio y cliente


    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_ConsultarCotiza(this.dataItem(e.item.index()).IdCliente.toString());
            Grid_HabilitaToolbar($("#gridCotizacion"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        } else {
            Fn_ConsultarCotiza(0);
            Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarCotiza(0);
            Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
        }
    });


    $("#gridCotizacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCotizacion"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridCotizacion"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridCotizacion"), ($(window).height() - "371"));
    //#endregion
});

let Fn_ConsultarCotiza = function (IdCliente) {
    VIdCliente = Number(IdCliente);
    //leer grid
    $("#gridCotizacion").data("kendoGrid").dataSource.data([]);
    $("#gridCotizacion").data("kendoGrid").dataSource.read();
};
var fPermisos = function (datos) {
    Permisos = datos;
};