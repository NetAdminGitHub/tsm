

var Permisos;
// inicializar variables de consulta
let xpnIdSevicio = 0;
let xpnIdUsuario = getUser();
let xpnEstado = undefined;
let xTitleModal = "";
let xpnIdcliente = 0;
let xpnNombreClie = "";
let xpnIdEjecutivo = "";
let xpnIdContactoCliente = "";
let xpnIdMarca = "";
let xpNodocumento=""
let vIdSoli = 0;
let xpnEsEjec = false;

$(document).ready(function () {
    //if (window.sessionStorage.getItem("sdc") === null)
    //    window.sessionStorage.setItem("sdc",null);

    //obtner ejecutiva de cuenta
    KdoComboBoxbyData($("#CmbCliSol"), "[]", "Nombre", "IdCliente", "Seleccione...");
    KdoComboBoxbyData($("#CmbCliCont"), "[]", "Nombre", "IdCliente", "Seleccione...");

    KdoComboBoxbyData($("#CmbContactoSol"), "[]", "Nombre", "IdContactoCliente", "Seleccione...");
    KdoComboBoxbyData($("#CmbEjecSol"), "[]", "Nombre", "IdEjecutivoCuenta", "Seleccione...");

    KdoComboBoxbyData($("#CmbMarcaSol"), "[]", "Nombre", "IdMarca", "Seleccione...");
    KdoComboBoxbyData($("#CmbMarcaCont"), "[]", "Nombre", "IdMarca", "Seleccione...");

    KdoButton($("#btnAClieEje"), "check", "Iniciar Solicitud");

    KdoButton($("#btnAClieCont"), "check", "Inciar Solicitud");

    // validaciones
    $("#FrmModalClieCont").kendoValidator(
        {
            rules: {
                Msgclicont: function (input) {
                    if (input.is("[name='CmbCliCont']")) {
                        return $("#CmbCliCont").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msgejecsol: function (input) {
                    if (input.is("[name='CmbEjecSol']")) {
                        return $("#CmbEjecSol").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbMarCont: function (input) {
                    if (input.is("[name='CmbMarcaCont']")) {
                        return $("#CmbMarcaCont").data("kendoComboBox").text() === "" ? true : $("#CmbMarcaCont").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
              

            },
            messages: {
                Msgclicont: "Requerido",
                Msgejecsol: "Requerido",
                CmbMarCont: "Requerido"
            }
        });

    $("#FrmModalClieEje").kendoValidator(
        {
            rules: {
                Msgclicont: function (input) {
                    if (input.is("[name='CmbCliSol']")) {
                        return $("#CmbCliSol").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msgejecsol: function (input) {
                    if (input.is("[name='CmbContactoSol']")) {
                        return $("#CmbContactoSol").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbMarCont: function (input) {
                    if (input.is("[name='CmbMarcaSol']")) {
                        return $("#CmbMarcaSol").data("kendoComboBox").text() === "" ? true : $("#CmbMarcaSol").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }


            },
            messages: {
                Msgclicont: "Requerido",
                Msgejecsol: "Requerido",
                CmbMarCont: "Requerido"
            }
        });

    // confirmar seleccion de valores
    $("#btnAClieEje").data("kendoButton").bind("click", function () {
        event.preventDefault();
        if ($("#FrmModalClieEje").data("kendoValidator").validate()) {
            xpnIdcliente = KdoCmbGetValue($("#CmbCliSol"));
            xpnNombreClie = KdoCmbGetText($("#CmbCliSol"));
            xpnIdContactoCliente = KdoCmbGetValue($("#CmbContactoSol"));
            xpnIdMarca = KdoCmbGetValue($("#CmbMarcaSol"));
            $("#ModalClieEje").modal('hide');
            fn_crearServ();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#btnAClieCont").data("kendoButton").bind("click", function () {
        event.preventDefault();
        if ($("#FrmModalClieCont").data("kendoValidator").validate()) {
            xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
            xpnNombreClie = KdoCmbGetText($("#CmbCliCont"));
            xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
            xpnIdMarca = KdoCmbGetValue($("#CmbMarcaCont"));
            $("#ModalClieCont").modal('hide');
            fn_crearServ();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
      
    });

    $("#btnCloseCC").click(function () {
        xpnIdcliente = "";
        xpnIdEjecutivo = "";
        xpnIdMarca = "";
        xpnNombreClie = "";
        $("#ModalClieCont").modal('hide');
        //window.location.href = "/HOME";
    });

    $("#btnCloseCJ").click(function () {
        xpnIdcliente = "";
        xpnIdContactoCliente = "";
        xpnIdMarca = "";
        xpnNombreClie = "";
        $("#ModalClieEje").modal('hide');
        //window.location.href = "/HOME";
    });
    $("#idverClie").click(function () {
        alert("prurba");
    });

    //fn_idEjecutivoCuenta();

    //dibujar los paneles por servicio
    fn_MostraPanelServicios();
    //mostrar pendientes
    fn_MostrarPendientes();
   
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
                    '<a class="btn-link stretched-link" data-idser="' + item.IdServicio.toString() + '" onclick="fn_IniciarServ(this)" ><span class="k-icon k-i-plus-circle" style="vertical-align: baseline;"></span>&nbsp;' + item.Nombre + '</a></h2>' +
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
};

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
                this.columnResizeHandleWidth;
            }
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                if (grid.dataItem(this).Estado.toUpperCase()==="REGISTRADO") {
                    window.location.href = "/Solicitudes/IngresoSolicitudes/" + grid.dataItem(this).IdSolicitud.toString() + "/" + grid.dataItem(this).IdServicio.toString() + "/" + grid.dataItem(this).IdCliente.toString();
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
    xpnIdSevicio = $(e).data('IdServicio');
    xpnEstado = $(e).data('Estado');
    $("#grid").data("kendoGrid").dataSource.read();
    xTitleModal = "Solicitudes con estatus: " + e.text;
    $("#CSolicitudes").modal('show');
    setTimeout(function () {
        Fn_Grid_Resize($("#grid"), $("#CSolicitudes").height() - "371");
    }, 300);
   
};

let fn_MostraModalIni = function (m, Title) {
    m.modal({
        show: true,
        keyboard: false,
        backdrop:'static'
    });
    m.find('.modal-title').text(Title);
};

let fn_idEjecutivoCuenta = function () {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: TSM_Web_APi + "Solicitudes/GetSolicitudesVerifEjecutivoContacto/" + xpnIdUsuario,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
          
                    if (respuesta.EsEjecutivoCuenta === true) {
                        xpnIdEjecutivo = xpnIdUsuario;
                        let dsclien = fn_GetEjecutivoCuentasClientes();
                        if (dsclien !== null && dsclien.length === 1) {
                            xpnIdcliente = dsclien[0].IdCliente;
                            xpnNombreClie = dsclien[0].Nombre;
                            $("#CmbCliSol").data("kendoComboBox").setDataSource(dsclien);
                            KdoCmbSetValue($("#CmbCliSol"), xpnIdcliente);
                            KdoComboBoxEnable($("#CmbCliSol"), false);

                            let dsContac = fn_GetContactosClientesRelacion(xpnIdcliente);
                            if (dsContac !== null && dsContac.length === 1) {
                                xpnIdContactoCliente = dsContac[0].IdContactoCliente;
                                $("#CmbContactoSol").data("kendoComboBox").setDataSource(dsContac);
                                KdoCmbSetValue($("#CmbContactoSol"), xpnIdContactoCliente);
                                KdoComboBoxEnable($("#CmbContactoSol"), false);

                                let dsMarca = fn_GetEjecutivoCuentasContactosMarcas(xpnIdEjecutivo, xpnIdContactoCliente);
                                if (dsMarca !== null && dsMarca.length === 1) {
                                    xpnIdMarca = dsMarca[0].IdMarca;
                                    $("#CmbMarcaSol").data("kendoComboBox").setDataSource(dsMarca);
                                    KdoCmbSetValue($("#CmbMarcaSol"), xpnIdMarca);
                                    KdoComboBoxEnable($("#CmbMarcaSol"), false);
                                    fn_MostraModalIni($("#ModalClieEje"), "Complete antes de continuar");

                                } else if (dsMarca !== null && dsMarca.length > 1) {
                                    $("#CmbMarcaSol").data("kendoComboBox").setDataSource(dsMarca);
                                    fn_MostraModalIni($("#ModalClieEje"), "Complete antes de continuar");

                                } else {
                                    xpnIdMarca = "";
                                    KdoComboBoxEnable($("#CmbMarcaSol"), false);
                                    fn_MostraModalIni($("#ModalClieEje"), "Complete antes de continuar");
                                }

                            } else if (dsContac !== null && dsContac.length > 1) {
                                $("#CmbContactoSol").data("kendoComboBox").setDataSource(dsContac);
                                fn_MostraModalIni($("#ModalClieEje"), "Complete antes de continuar");
                                $("#CmbContactoSol").on("change", function () {
                                    xpnIdContactoCliente = KdoCmbGetValue($("#CmbContactoSol"));
                                    KdoCmbSetValue($("#CmbMarcaSol"), "");
                                    $("#CmbMarcaSol").data("kendoComboBox").setDataSource(fn_GetEjecutivoCuentasContactosMarcas(xpnIdEjecutivo, xpnIdContactoCliente));
                                });
                            }
                        }
                        else if (dsclien !== null && dsclien.length > 1) {
                            $("#CmbCliSol").data("kendoComboBox").setDataSource(dsclien);
                            fn_MostraModalIni($("#ModalClieEje"), "Complete antes de continuar");

                            $("#CmbCliSol").on("change", function () {
                                xpnIdcliente = KdoCmbGetValue($("#CmbCliSol"));
                                KdoCmbSetValue($("#CmbContactoSol"), "");
                                $("#CmbContactoSol").data("kendoComboBox").setDataSource(fn_GetContactosClientesRelacion(xpnIdcliente));
                            });

                            $("#CmbContactoSol").on("change", function () {
                                xpnIdContactoCliente = KdoCmbGetValue($("#CmbContactoSol"));
                                KdoCmbSetValue($("#CmbMarcaSol"), "");
                                $("#CmbMarcaSol").data("kendoComboBox").setDataSource(fn_GetEjecutivoCuentasContactosMarcas(xpnIdEjecutivo, xpnIdContactoCliente));
                            });
                        }
                        else {
                            window.location.href = "/HOME";
                        }

                    } else if (respuesta.EsContacto === true) {
                        xpnIdContactoCliente = xpnIdUsuario;
                        let dsclien = fn_GetRelacionContactosClienteActivos();
                        if (dsclien !== null && dsclien.length === 1) {
                            xpnIdcliente = dsclien[0].IdCliente;
                            xpnNombreClie = dsclien[0].Nombre;
                            $("#CmbCliCont").data("kendoComboBox").setDataSource(dsclien);
                            KdoCmbSetValue($("#CmbCliCont"), xpnIdcliente);
                            KdoComboBoxEnable($("#CmbCliCont"), false);
                            let dsEjec = fn_GetEjecutivoCuentasRelacion(xpnIdcliente);
                            if (dsEjec !== null && dsEjec.length === 1) {
                                xpnIdEjecutivo = dsEjec[0].IdEjecutivoCuenta;
                                $("#CmbEjecSol").data("kendoComboBox").setDataSource(dsEjec);
                                KdoCmbSetValue($("#CmbEjecSol"), xpnIdEjecutivo);
                                KdoComboBoxEnable($("#CmbEjecSol"), false);

                                let dsMarca = fn_GetEjecutivoCuentasContactosMarcas(xpnIdEjecutivo, xpnIdContactoCliente);
                                if (dsMarca !== null && dsMarca.length === 1) {
                                    xpnIdMarca = dsMarca[0].IdMarca;
                                    $("#CmbMarcaCont").data("kendoComboBox").setDataSource(dsMarca);
                                    KdoCmbSetValue($("#CmbMarcaCont"), xpnIdMarca);
                                    KdoComboBoxEnable($("#CmbMarcaCont"), false);
                                    fn_MostraModalIni($("#ModalClieCont"), "Complete antes de continuar");

                                } else if (dsMarca !== null && dsMarca.length > 1) {
                                    $("#CmbMarcaCont").data("kendoComboBox").setDataSource(dsMarca);
                                    fn_MostraModalIni($("#ModalClieCont"), "Complete antes de continuar");
                                }
                                else {
                                    xpnIdMarca = "";
                                    KdoComboBoxEnable($("#CmbMarcaCont"), false);
                                    fn_MostraModalIni($("#ModalClieCont"), "Complete antes de continuar");
                                }

                            } else if (dsEjec !== null && dsEjec.length > 1) {
                                $("#CmbEjecSol").data("kendoComboBox").setDataSource(dsEjec);
                                fn_MostraModalIni($("#ModalClieCont"), "Complete antes de continuar");
                                $("#CmbEjecSol").on("change", function () {
                                    xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
                                    KdoCmbSetValue($("#CmbMarcaCont"), "");
                                    $("#CmbMarcaCont").data("kendoComboBox").setDataSource(fn_GetEjecutivoCuentasContactosMarcas(xpnIdEjecutivo, xpnIdContactoCliente));
                                });
                            }
                            else {
                                window.location.href = "/HOME";
                            }

                        }
                        else if (dsclien !== null && dsclien.length > 1) {
                            $("#CmbCliCont").data("kendoComboBox").setDataSource(dsclien);
                            fn_MostraModalIni($("#ModalClieCont"), "Complete antes de continuar");

                            $("#CmbCliCont").on("change", function () {
                                xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
                                KdoCmbSetValue($("#CmbEjecSol"), "");
                                $("#CmbEjecSol").data("kendoComboBox").setDataSource(fn_GetEjecutivoCuentasRelacion(xpnIdcliente));

                            });

                            $("#CmbEjecSol").on("change", function () {
                                xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
                                KdoCmbSetValue($("#CmbMarcaCont"), "");
                                $("#CmbMarcaCont").data("kendoComboBox").setDataSource(fn_GetEjecutivoCuentasContactosMarcas(xpnIdEjecutivo, xpnIdContactoCliente));
                            });
                        }
                        else {
                            window.location.href = "/HOME";
                        }
                    } 
              

                $('#CSolicitudes').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text(xTitleModal);
                });
             
            } else {
                window.location.href = "/HOME";
            }
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
        }
    });
};

let fn_GetEjecutivoCuentasClientes = function () {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "EjecutivoCuentas/GetEjecutivoCuentasClientes/" + xpnIdUsuario,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};

let fn_GetContactosClientesRelacion = function (idcliente) {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "RelacionContactosClientes/GetRelacionContactosClienteEjecutivo/" + idcliente + "/" + xpnIdUsuario,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};

let fn_GetEjecutivoCuentasContactosMarcas = function (idEjecutivoCuenta, idContactoCliente) {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "EjecutivoCuentasContactosMarcas/" + idEjecutivoCuenta + "/" + idContactoCliente,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};

let fn_GetEjecutivoCuentasRelacion = function (idcliente) {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "EjecutivoCuentas/GetEjecutivoCuentasRelacion/" + idcliente + "/" + xpnIdUsuario,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};

let fn_GetRelacionContactosClienteActivos = function () {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "RelacionContactosClientes/GetRelacionContactosClienteActivos/" + xpnIdUsuario,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};

let fn_IniciarServ = function (e) {
    let obj = $(e);
    xpnIdSevicio = obj.data("idser").toString();
    fn_idEjecutivoCuenta()
};

let fn_crearServ = function () {
    kendo.ui.progress($("#body"), true);
    vIdSoli = 0;
    let xType = vIdSoli === 0 ? "Post" : "Put";
    let xFecha = Fhoy();
    xpnEstado = "REGISTRADO";
    $.ajax({
        url: TSM_Web_APi + (vIdSoli === 0 ? "Solicitudes" : "Solicitudes/" + vIdSoli),
        type: xType,
        data: JSON.stringify({
            IdSolicitud: vIdSoli,
            NoDocumento: xpNodocumento,
            IdCliente: xpnIdcliente,
            NombreCliente: xpnNombreClie,
            FechaSolicitud: xFecha,
            Estado: xpnEstado,
            IdTipoOrdenTrabajo: 1,
            IdServicio: xpnIdSevicio,
            IdContactoCliente: xpnIdContactoCliente,
            IdModulo: 2,
            IdEjecutivoCuenta: xpnIdEjecutivo,
            IdUsuario: getUser(),
            IdMarca: xpnIdMarca
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            vIdSoli = data[0].IdSolicitud;
            xpNodocumento = data[0].NoDocumento;
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(data, xType);
            window.location.href = "/Solicitudes/IngresoSolicitudes/" + vIdSoli.toString() + "/" + xpnIdSevicio.toString() + "/" + xpnIdcliente
        },
        error: function (data) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(data);
        }
    });

};

fPermisos = function (datos) {
    Permisos = datos;
};