var Permisos;
// inicializar variables de consulta
let xpnIdSevicio = 0;
let xpnIdUsuario = getUser();
let xpnEstado = undefined;
let xTitleModal = "";
$(document).ready(function () {
    //dibujar los paneles por servicio
    fn_MostraPanelServicios();
    //mostrar pendientes
    fn_MostrarPendientes();

    $('#CSolicitudes').on('show.bs.modal', function (event) {
        var modal = $(this)
        modal.find('.modal-title').text(xTitleModal);
    })
});

var fn_getIdSolicitud = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSolicitud;
};

let fn_MostraPanelServicios = function () {
    let ds = fn_GetSolicitudConteo();
   
    $.ajax({
        url: TSM_Web_APi + "Servicios",
        type: 'GET',
        dataType: "json",
        success: function (data) {
            $("#PanServicios").children().remove();
            $.each(data, function (i, item) {
                let vIcon = item.Icono === "" || item.Icono === null ? "k-icon k-i-image" : item.Icono;
                let htmltextElemnt =
                    '<div class="col-lg-4">' +
                    '<div class="card card-profile card-secondary">' + //style = "height: 100%;"
                    '<div class="card-body">' +
                    //'<div class="form-group col-lg-12">' +
                    '<div class="form-row">' +
                    '<div class="form-group col-lg-12 text-center">' +
                    '<i class="' + vIcon + '" style="font-size:125px;"></i>' +
                    '</div>' +
                    '<div class="form-group col-lg-12 text-center">' +
                    '<a class="btn-link stretched-link"  href="/Solicitudes/IngresoSolicitudes/0/' + item.IdServicio.toString() + '/' + item.Nombre.toString() + '"><span class="k-icon k-i-plus-circle" style="vertical-align: baseline;"></span>&nbsp;' + item.Nombre + '</a></h2>' +
                    '</div>' +
                    '</div>' +
                    //'</div>' +
                    '</div>' +
                    '<div class="card-footer">' +
                    '<div class="form-row user-stats text-center" id="SolCntServ-' + item.IdServicio.toString() + '">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $("#PanServicios").append(htmltextElemnt);

                let dsStatus = fn_filtrarSolicitud(ds, item.IdServicio);
                if (dsStatus.length !== 0) {
                    $.each(dsStatus, function (item, elemento) {
                        if (elemento.Estado.toUpperCase() === "REGISTRADO") {
                            $("#SolCntServ-" + elemento.IdServicio.toString() + "").append(
                                '<div class="col-lg-4">' +
                                //'<div class="number">125</div> ' +
                                //'<div class="title">Pendientes</div> ' +
                                '</div> ' +
                                '<div class="col-lg-4">' +
                                //'<div class="number">25K</div> ' +
                                //'<div class="title">Procesados</div>' +
                                '</div>' +
                                '<div class="col-lg-4"> ' +
                                '<div class="number">' + elemento.CntSol + '</div>' +
                                '<div class="title"><a id ="Est-' + elemento.Estado + '-' + elemento.IdServicio +'" class="btn-link stretched-link" onclick= "fn_MostrarModaC(this)" data-toggle="modal">PENDIENTES</a></div>'
                            );

                           
                        }
                        $("#Est-" + elemento.Estado +"-" + elemento.IdServicio + "").data('IdServicio', elemento.IdServicio);
                        $("#Est-" + elemento.Estado + "-" + elemento.IdServicio + "").data('Estado', elemento.Estado);
                    });
                } else {

                    $("#SolCntServ-" + item.IdServicio.toString() + "").append('<div class="col-lg-4">' +
                        //'<div class="number">125</div> ' +
                        //'<div class="title">Pendientes</div> ' +
                        '</div> ' +
                        '<div class="col-lg-4">' +
                        //'<div class="number">25K</div> ' +
                        //'<div class="title">Procesados</div>' +
                        '</div>' +
                        '<div class="col-lg-4"> ' +
                        '<div class="number">0</div>' +
                        '<div class="title"><a id ="Est-REGISTRADO-' + item.IdServicio +'" class="btn-link stretched-link" onclick= "fn_MostrarModaC(this)" data-toggle="modal">PENDIENTES</a></div>'
                    );

                    $("#Est-REGISTRADO-" + item.IdServicio + "").data('IdServicio', item.IdServicio);
                    $("#Est-REGISTRADO-" + item.IdServicio + "").data('Estado', "REGISTRADO");
                }
               
               
            });

        }
    });
};
let fn_GetSolicitudConteo = function () {
    let ds = "";
    $.ajax({
        url: TSM_Web_APi + "Solicitudes/GetSolicitudesConteo/"+ getUser(),
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            ds = data;
        }
    });
    return ds;
};
let fn_GetSolicitudesRegistradas = function () {
    kendo.ui.progress($("[class='card-body']"), true);
    let DSSol = "[]";
    $.ajax({
        type: "GET",
        dataType: 'json',
        async: false,
        url: TSM_Web_APi + "Solicitudes/GetSolicitudesRegistradas/" + xpnIdSevicio.toString() + "/" + xpnIdUsuario + "/" + xpnEstado,
        success: function (result) {
            DSSol = result;
            kendo.ui.progress($("[class='card-body']"), false);
        }
    });
    return DSSol;
}
let fn_MostrarPendientes = function () {
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                datos.success(fn_GetSolicitudesRegistradas());
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
    var selectedRows = [];
    $("#grid").kendoGrid({
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth
            }
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                if (grid.dataItem(this).Estado.toUpperCase()==="REGISTRADO") {
                    window.location.href = "/Solicitudes/IngresoSolicitudes/" + grid.dataItem(this).IdSolicitud.toString() + "/" + grid.dataItem(this).IdServicio.toString() + "/" + grid.dataItem(this).Nombre1;
                }
            });
            Grid_SetSelectRow($("#grid"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitud", title: "Código de Solicitud", hidden: true },
            { field: "NoDocumento", title: "No Solicitud", minResizableWidth: 150},
            { field: "NombreCliente", title: "Nombre de Cliente",minResizableWidth: 150},
            { field: "FechaSolicitud", title: "Fecha Solicitud", format: "{0: dd/MM/yyyy}", minResizableWidth: 150},
            { field: "IdTipoOrdenTrabajo", title: "Código Tipo Orden", hidden: true },
            { field: "Nombre", title: "Orden de Trabajo", minResizableWidth: 150, hidden: true },
            { field: "IdServicio", title: "Servicio", hidden: true },
            { field: "Nombre1", title: "Servicio", minResizableWidth: 150 },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta", minResizableWidth: 150 },
            { field: "IdContactoCliente", title: "Código Contacto", hidden: true },
            { field: "Nombre2", title: "Contacto", minResizableWidth: 150, hidden: true },
            { field: "IdModulo", title: "Código Modulo", hidden: true },
            { field: "Nombre3", title: "Modulo", hidden: true },
            { field: "IdEjecutivoCuenta", title: "Código Ejecutivo Cuenta", hidden: true },
            { field: "Nombre4", title: "Ejecutivo Cuenta", minResizableWidth: 150},
            { field: "Estado", title: "Código Estado", hidden: true },
            { field: "Nombre5", title: "Estado", minResizableWidth: 150 },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);


    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
};

let fn_filtrarSolicitud = function (ds, idServicio) {
    var dset = JSON.parse(JSON.stringify(ds)).filter(function (entry) {
        return entry.IdServicio === idServicio;
    });
    return dset;
};

let fn_MostrarModaC = function (e) {
    xpnIdSevicio = $("#" + e.id + "").data('IdServicio');
    xpnEstado = $("#" + e.id + "").data('Estado');
    $("#grid").data("kendoGrid").dataSource.read();
    xTitleModal = "Solicitudes con estatus: " + e.text;
    $("#CSolicitudes").modal('show');
    setTimeout(function () {
        Fn_Grid_Resize($("#grid"), $("#CSolicitudes").height() - "371");
    }, 300);
   
};

fPermisos = function (datos) {
    Permisos = datos;
};