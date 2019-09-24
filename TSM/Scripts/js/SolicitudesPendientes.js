let xpnIdUsuario = getUser();
var Permisos;
$(document).ready(function () {
    fn_MostrarPendientes();
});

let fn_MostrarPendientes = function () {
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "Solicitudes/GetSolicitudesRegistradas/" + vIdServSol.toString() + "/" + xpnIdUsuario + "/" + idEstado,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "Solicitudes/" + datos.IdSolicitud; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd;
            if (e.type === "destroy") {
                window.location.href = "/SolicitudesClientes";
            }
    
        },
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
                    IdContactoCliente: { type: "string" },
                    Nombre2: { type: "string" },
                    IdModulo: { type: "number" },
                    Nombre3: { type: "string" },
                    IdEjecutivoCuenta: { type: "string" },
                    Nombre4: { type: "string" },
                    Estado: { type: "string" },
                    Nombre5: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdUsuario: {type:"String"}
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    var selectedRows = [];
    $("#grid").kendoGrid({
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                if (grid.dataItem(this).Estado.toUpperCase() === "REGISTRADO") {
                    let EsContacto = grid.dataItem(this).IdEjecutivoCuenta.toString().toUpperCase() === grid.dataItem(this).IdUsuario.toString().toUpperCase() ? 0 : 1;
                    window.location.href = "/SolicitudesClientes/IngresoSolicitudesClientes/" + grid.dataItem(this).IdServicio.toString() + "/" + EsContacto + "/" + grid.dataItem(this).IdSolicitud.toString();
                }
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitud", title: "Código de Solicitud", hidden: true },
            { field: "NoDocumento", title: "No Solicitud"},
            { field: "NombreCliente", title: "Nombre de Cliente" },
            { field: "FechaSolicitud", title: "Fecha Solicitud", format: "{0: dd/MM/yyyy}" },
            { field: "IdTipoOrdenTrabajo", title: "Código Tipo Orden", hidden: true },
            { field: "Nombre", title: "Orden de Trabajo",  hidden: true },
            { field: "IdServicio", title: "Servicio", hidden: true },
            { field: "Nombre1", title: "Servicio"},
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta" },
            { field: "IdContactoCliente", title: "Código Contacto", hidden: true },
            { field: "Nombre2", title: "Contacto",  hidden: true },
            { field: "IdModulo", title: "Código Modulo", hidden: true },
            { field: "Nombre3", title: "Modulo", hidden: true },
            { field: "IdEjecutivoCuenta", title: "Código Ejecutivo Cuenta", hidden: true },
            { field: "Nombre4", title: "Ejecutivo Cuenta"},
            { field: "Estado", title: "Código Estado", hidden: true },
            { field: "Nombre5", title: "Estado"},
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuario", title: "IdUsuario", hidden: true,menu:false }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, true);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);


    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
};


fPermisos = function (datos) {
    Permisos = datos;
};
