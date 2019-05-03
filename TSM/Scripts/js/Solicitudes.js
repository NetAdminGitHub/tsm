var Permisos;
$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlSol +"/GetSolicitudesVista",
                contentType: "application/json; charset=utf-8"
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
                    IdSolicitud: { type: "number" },
                    NoDocumento: { type: "string" },
                    NombreCliente: { type: "string" },
                    FechaSolicitud: { type: "date" },
                    IdTipoOrdenTrabajo: { type: "number" },
                    Nombre: { type: "string" },
                    IdServicio: { type: "number" },
                    Nombre1: { type: "string" },
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    IdContactoCliente: { type: "number" },
                    Nombre2: { type: "string" },
                    IdModulo: { type: "number" },
                    Nombre3: { type: "string" },
                    IdEjecutivoCuenta: { type: "number" },
                    Nombre4: { type: "string" },
                    Estado: { type: "string" },
                    Nombre5: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitud", title: "Código de Solicitud", hidden: true },
            { field: "NoDocumento", title: "No Solicitud" },
            { field: "NombreCliente", title: "Nombre de Cliente" },
            { field: "FechaSolicitud", title: "Fecha Solicitud", format: "{0: dd/MM/yyyy}"},
            { field: "IdTipoOrdenTrabajo", title: "Código Tipo Orden", hidden: true },
            { field: "Nombre", title: "Orden de Trabajo" },
            { field: "IdServicio", title: "Servicio", hidden: true },
            { field: "Nombre1", title: "Servicio" },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta" },
            { field: "IdContactoCliente", title: "Código Contacto", hidden: true },
            { field: "Nombre2", title: "Contacto" },
            {field: "IdModulo", title: "Código Modulo", hidden: true },
            { field: "Nombre3", title: "Modulo", hidden: true  },
            { field: "IdEjecutivoCuenta", title: "Código Ejecutivo Cuenta", hidden: true },
            { field: "Nombre4", title: "Ejecutivo Cuenta" },
            { field: "Estado", title: "Código Estado", hidden: true },
            { field: "Nombre5", title: "Estado"},
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false,false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    KdoButton($("#NSol"), "file-add", "Nuevo Solictud");
    KdoButton($("#VerSol"), "hyperlink-open", "Ver Solicitud");

    
    $("#VerSol").data("kendoButton").bind("click", function () {
        window.location.href = "/Solicitudes/IngresoSolicitudes/" + fn_getIdSolicitud($("#grid").data("kendoGrid"));
    });

    $("#NSol").data("kendoButton").bind("click", function () {
        window.location.href = "/Solicitudes/IngresoSolicitudes/0";
    });

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            $("#VerSol").data("kendoButton").enable(false);
        } else {
            $("#VerSol").data("kendoButton").enable(true);
        }
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
});

var fn_getIdSolicitud = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSolicitud;

};
fPermisos = function (datos) {
    Permisos = datos;
};