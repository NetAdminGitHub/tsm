let xpnIdContactoCliente;
let xpnIdEjecutivo;
let xpnIdcliente;
let xpnNombreClie;
let xpNodocumento;
let vIdSoli = idSolicitud;
var Permisos;
let xpnIdUsuario = getUser();
let UrlPro = TSM_Web_APi + "Programas/GetByCliente/0";
let UrlTm = TSM_Web_APi + "TipoMuestras";
let UrlCata = TSM_Web_APi + "CategoriaTallas";
let UrlUm = TSM_Web_APi + "UnidadesMedidas";
let UrlTem = TSM_Web_APi + "Temporadas";
let InciarInsert = true;
$(document).ready(function () {
    //#region Inicializar combobox en la vista 
    KdoComboBoxbyData($("#CmbCliCont"), "[]", "Nombre", "IdCliente", "Seleccione...");
    KdoComboBoxbyData($("#CmbEjecSol"), "[]", "Nombre", "IdEjecutivoCuenta", "Seleccione...");
    KdoComboBoxbyData($("#CmbContactoSol"), "[]", "Nombre", "IdContactoCliente", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#TxtPrenda"), TSM_Web_APi + "CategoriaPrendas", "Nombre", "IdCategoriaPrenda", "Seleccione ...", "", "");
    $("#Fecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    KdoDatePikerEnable($("#Fecha"), false);
    //#endregion 
    //#region Inicializar botones de mando
    KdoButton($("#btnAClieCont"), "save", "Inciar Solicitud");
    KdoButton($("#btnDelClieCont"), "delete", "Borrar");
    KdoButton($("#btnFinClieCont"), "check", "Finalizar solicitud");
    KdoButton($("#btnProClieCont"), "calendar", "Nuevo Programa");
    KdoButton($("#btnCrearPren"), "save", "Guardar Prenda");
    //#endregion

    $("#ModalCliePrenda").kendoDialog({
        height: "auto",
        width: "auto",
        maxHeight: 600,
        minWidth: "20%",
        title: "Crear registro de prenda",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCrear prenda', primary: true, action: function () { return fn_btnCrearPren(); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
        ],
        close: function (e) {
            KdoCmbSetValue($("#TxtPrenda"), "");
            $("#TxtDescrip").val("");
            $("#TxtPrenda").data("kendoComboBox").dataSource.read();

        }
    });
    //#region Inicializar validador para el formulario
    $("#FrmClieCont").kendoValidator(
        {
            rules: {
                Msgclicont: function (input) {
                    if (input.is("[name='CmbCliCont']")) {
                        return $("#CmbCliCont").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbMarCont: function (input) {
                    if (input.is("[name='CmbContactoSol']") && esContacto === 0) {
                        return $("#CmbContactoSol").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msgejecsol: function (input) {
                    if (input.is("[name='CmbEjecSol']") && esContacto === 1) {
                        return $("#CmbEjecSol").data("kendoComboBox").selectedIndex >= 0;
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

    $("#FrmModalCliePrenda").kendoValidator(
        {
            rules: {
                MsgcPren: function (input) {
                    if (input.is("[name='TxtPrenda']")) {
                        return $("#TxtPrenda").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgDescrip: function (input) {
                    if (input.is("[name='TxtDescrip']")) {
                        return input.val().length > 0 && input.val().length <= 200;
                    }
                    return true;
                }
            },
            messages: {
                MsgcPren: "Requerido",
                MsgDescrip:"Requerido"
            }
        });

    //#endregion


    // obtener los clientes relacionados al contacto
    if (esContacto === 1) {
        $('[for="CmbContactoSol"]').prop("hidden", "hidden");
        $("#CmbContactoSol").data("kendoComboBox").wrapper.hide();
        xpnIdContactoCliente = getUser();
        let dsclien = fn_GetRelacionCCActivos();
        if (dsclien !== null && dsclien.length === 1) {
            xpnIdcliente = dsclien[0].IdCliente;
            xpnNombreClie = dsclien[0].Nombre;
            $("#CmbCliCont").data("kendoComboBox").setDataSource(dsclien);
            KdoCmbSetValue($("#CmbCliCont"), xpnIdcliente);
            KdoComboBoxEnable($("#CmbCliCont"), false);

            let dsEjec = fn_GetECRelacion(xpnIdcliente);

            if (dsEjec !== null && dsEjec.length === 1) {
                xpnIdEjecutivo = dsEjec[0].IdEjecutivoCuenta;
                $("#CmbEjecSol").data("kendoComboBox").setDataSource(dsEjec);
                KdoCmbSetValue($("#CmbEjecSol"), xpnIdEjecutivo);
                KdoComboBoxEnable($("#CmbEjecSol"), false);


            } else
                if (dsEjec !== null && dsEjec.length > 1) {
                    $("#CmbEjecSol").data("kendoComboBox").setDataSource(dsEjec);
                    $("#CmbEjecSol").on("change", function () {
                        xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
                    });
                }
                else {
                    window.location.href = "/HOME";
                }

        }
        else
            if (dsclien !== null && dsclien.length > 1) {
                $("#CmbCliCont").data("kendoComboBox").setDataSource(dsclien);
                $("#CmbCliCont").on("change", function () {
                    xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
                    KdoCmbSetValue($("#CmbEjecSol"), "");
                    let dsEC = fn_GetECRelacion(xpnIdcliente);
                    $("#CmbEjecSol").data("kendoComboBox").setDataSource(dsEC);
                    $("#CmbEjecSol").data("kendoComboBox").dataSource.read();
                    if (dsEC !== null && dsEC.length === 1) {
                        KdoCmbSetValue($("#CmbEjecSol"), dsEC[0].IdEjecutivoCuenta.toString());
    
                    }
                });

                $("#CmbEjecSol").on("change", function () {
                    xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
                });
            }
            else {
                window.location.href = "/HOME";
            }
    }

    if (esContacto === 0) {
        $('[for="CmbEjecSol"]').prop("hidden", "hidden");
        $("#CmbEjecSol").data("kendoComboBox").wrapper.hide();
        xpnIdEjecutivo = getUser();
        let dsclien = fn_GetECClientes();
        if (dsclien !== null && dsclien.length === 1) {
            xpnIdcliente = dsclien[0].IdCliente;
            xpnNombreClie = dsclien[0].Nombre;
            $("#CmbCliCont").data("kendoComboBox").setDataSource(dsclien);
            KdoCmbSetValue($("#CmbCliCont"), xpnIdcliente);
            KdoComboBoxEnable($("#CmbCliCont"), false);

            let dsContac = fn_GetCCRelacion(xpnIdcliente);
            if (dsContac !== null && dsContac.length === 1) {
                xpnIdContactoCliente = dsContac[0].IdContactoCliente;
                $("#CmbContactoSol").data("kendoComboBox").setDataSource(dsContac);
                KdoCmbSetValue($("#CmbContactoSol"), xpnIdContactoCliente);
                KdoComboBoxEnable($("#CmbContactoSol"), false);

            } else
                if (dsContac !== null && dsContac.length > 1) {
                    $("#CmbContactoSol").data("kendoComboBox").setDataSource(dsContac);
                }
        }
        else
            if (dsclien !== null && dsclien.length > 1) {
                $("#CmbCliCont").data("kendoComboBox").setDataSource(dsclien);
                $("#CmbCliCont").on("change", function () {
                    xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
                    KdoCmbSetValue($("#CmbContactoSol"), "");
                    let dsCC = fn_GetCCRelacion(xpnIdcliente);
                    $("#CmbContactoSol").data("kendoComboBox").setDataSource(dsCC);
                    $("#CmbContactoSol").data("kendoComboBox").dataSource.read();
                    if (dsCC !== null && dsCC.length === 1) {
                        KdoCmbSetValue($("#CmbContactoSol"), dsCC[0].IdContactoCliente.toString());
                    }
                    
                });
            }
            else {
                window.location.href = "/HOME";
            }
    }

    if (vIdSoli !== 0) {
        fn_GetSolCli(vIdSoli);
    } else {
        KdoButtonEnable($("#btnDelClieCont"), false);
        KdoButtonEnable($("#btnFinClieCont"), false);
        KdoButtonEnable($("#btnProClieCont"), false);
    }

    // guardarbsolicitud
    $("#btnAClieCont").data("kendoButton").bind("click", function (e) {
        event.preventDefault();
        if ($("#FrmClieCont").data("kendoValidator").validate()) {
            xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
            xpnNombreClie = KdoCmbGetText($("#CmbCliCont"));
            if (esContacto === 1) {
                xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
            } else {
                xpnIdContactoCliente = KdoCmbGetValue($("#CmbContactoSol"));
            }
            fn_crearServClie();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    //boarra solicitud
    $("#btnDelClieCont").data("kendoButton").bind("click", function (e) {
        ConfirmacionMsg("Está seguro de que desea cancelar esta solicitud", function () { return fn_BorrarSol(); });
    });
    //finaliza solicitud
    $("#btnFinClieCont").data("kendoButton").bind("click", function (e) {
        ConfirmacionMsg("Está seguro que desea finalizar el registro de solicitudes?", function () { return fn_finsolicitudCliente(); });
    });
    $("#btnCloseMsg").click(function () {
        window.location.href = "/SolicitudesClientes";
    });
    // cargar modal cliente
  


    $('#ModalCliePro').on('shown.bs.modal', function (e) {
        KdoCmbFocus($("#TxtPrenda"));
    });

    fn_gridSolDet();
    fn_HabilitabtnInsert();

    $("#CmbCliCont").data("kendoComboBox").bind("change", function () {
        fn_HabilitabtnInsert();
    });

    $("#CmbContactoSol").data("kendoComboBox").bind("change", function () {
        fn_HabilitabtnInsert();
    });

    $("#CmbEjecSol").data("kendoComboBox").bind("change", function () {
        fn_HabilitabtnInsert();
    });
});

let fn_HabilitabtnInsert = function () {
    if (esContacto === 1) {
        let h = KdoCmbGetValue($("#CmbCliCont")) !== null && KdoCmbGetValue($("#CmbEjecSol")) !== null ? true : false;
        Grid_HabilitaToolbar($("#gridDet"), h, h, h);
    }
    if (esContacto === 0) {
        let h = KdoCmbGetValue($("#CmbCliCont")) !== null && KdoCmbGetValue($("#CmbContactoSol")) !== null ? true : false;
        Grid_HabilitaToolbar($("#gridDet"), h, h, h);
    }
    InciarInsert = true;
};
let fn_GetRelacionCCActivos = function () {
    // obtener la relacion entre contactos y clientes
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "RelacionContactosClientes/GetRelacionContactosClienteActivos/" + xpnIdContactoCliente,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};
let fn_GetECRelacion = function (idcliente) {
    // obtener la relacion de los clientes con las ejecutivas
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "EjecutivoCuentas/GetEjecutivoCuentasRelacion/" + idcliente + "/" + xpnIdContactoCliente,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};
let fn_GetCCRelacion = function (idcliente) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "RelacionContactosClientes/GetRelacionContactosClienteEjecutivo/" + idcliente + "/" + xpnIdEjecutivo,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};
let fn_GetECClientes = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "EjecutivoCuentas/GetEjecutivoCuentasClientes/" + xpnIdEjecutivo,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};
let fn_crearServClie = function (e) {
    kendo.ui.progress($(".k-window-content"), true);
    let xType = vIdSoli === 0 ? "Post" : "Put";
    let xFecha =  kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
    xpNodocumento = vIdSoli === 0 ? "" : $("#NoDocumento").val();
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
            IdServicio: vIdServSol,
            IdContactoCliente: xpnIdContactoCliente,
            IdModulo: 2,
            IdEjecutivoCuenta: xpnIdEjecutivo,
            IdUsuario: esContacto === 1 ? xpnIdContactoCliente : xpnIdEjecutivo,
            IdMarca: null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            vIdSoli = data[0].IdSolicitud;
            xpNodocumento = data[0].NoDocumento;
            $("#NoDocumento").val(data[0].NoDocumento);
            $("#Fecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(data[0].FechaSolicitud), 's'));
            Grid_HabilitaToolbar($("#gridDet"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            KdoButtonEnable($("#btnDelClieCont"), true);
            KdoButtonEnable($("#btnProClieCont"), true);
            kendo.ui.progress($(".k-window-content"), false);

            TextBoxEnable($('[name="NombreDiseno"]'), true);
            TextBoxEnable($('[name="NombrePro"]'), true);
            TextBoxEnable($('[name="NombreUbicacion"]'), true);
            KdoComboBoxEnable($('[name="IdCategoriaTalla"]'), true);
            KdoComboBoxEnable($('[name="IdUbicacion"]'), true);
            TextBoxEnable($('[name="ColorTela"]'), true);
            KdoNumerictextboxEnable($('[name="CantidadSTrikeOff"]'), true);
            KdoNumerictextboxEnable($('[name="CantidadYardaPieza"]'), true);
            KdoComboBoxEnable($('[name="IdUnidadYdPzs"]'), true);
            $('[name="IdSolicitud"]').data("kendoNumericTextBox").value(vIdSoli);
            $('[name="IdSolicitud"]').data("kendoNumericTextBox").trigger("change");
            $('[name="NombreDiseno"]').focus();
            window.history.pushState('', '',  "/SolicitudesClientes/IngresoSolicitudesClientes/" + vIdServSol.toString() + "/" + esContacto.toString() + "/" + vIdSoli.toString());
            InciarInsert = false;
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
            InciarInsert = true;
            kendo.ui.progress($(".k-window-content"), false);
        }
    });
};
let fn_GetSolCli = function (idsolicitud) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "Solicitudes/" + idsolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                vIdSoli = respuesta.IdSolicitud;
                $("#NoDocumento").val(respuesta.NoDocumento);
                KdoCmbSetValue($("#CmbCliCont"), respuesta.IdCliente);
                esContacto === 1 ? $("#CmbEjecSol").data("kendoComboBox").setDataSource(fn_GetECRelacion(respuesta.IdCliente)) : $("#CmbContactoSol").data("kendoComboBox").setDataSource(fn_GetCCRelacion(respuesta.IdCliente));
                esContacto === 1 ? KdoCmbSetValue($("#CmbEjecSol"), respuesta.IdEjecutivoCuenta): KdoCmbSetValue($("#CmbContactoSol"), respuesta.IdContactoCliente);
                $("#Fecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaSolicitud), 's'));
                KdoButtonEnable($("#btnDelClieCont"), true);
                KdoButtonEnable($("#btnFinClieCont"), true);
            } else {
                vIdSolicitud = 0;
                KdoButtonEnable($("#btnDelClieCont"), false);
                KdoButtonEnable($("#btnFinClieCont"), false);
                KdoButtonEnable($("#btnProClieCont"), false);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($(document.body), false);
        }
    });
};
let fn_gridSolDet = function () {
    var dataSourceMue = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SolicitudesDisenoPrendas/GetbyIdSolicitud/" + vIdSoli.toString(); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SolicitudesDisenoPrendas/" + datos.IdSolicitudDisenoPrenda; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SolicitudesDisenoPrendas/" + datos.IdSolicitudDisenoPrenda; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SolicitudesDisenoPrendas",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdSolicitudDisenoPrenda",
                fields: {
                    IdSolicitudDisenoPrenda: { type: "number" },
                    IdSolicitud: {
                        type: "number", defaultValue: function () {
                            return vIdSoli;
                        }
                    },
                    IdPrograma: { type: "string" },
                    NombrePro: { type: "string" },
                    NombreDiseno: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdTipoMuestra']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoMuestra").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadYdPzs']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadYdPzs").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdPrograma']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdPrograma").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='NombreDiseno']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='ColorTela']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdCategoriaTalla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaTalla").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUbicacion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdRegistroSolicitudPrenda']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdRegistroSolicitudPrenda").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdTipoMuestra: {
                        type: "string",
                        defaultValue: function () {
                            return 22;
                        }
                    },
                    NombreTipoM: { type: "string" },
                    CantidadSTrikeOff: { type: "number" },
                    CantidadYardaPieza: { type: "number" },
                    IdUnidadYdPzs: {
                        type: "string", defaultValue: function () {
                            return "9";
                        }
                    },
                    NombreUN: { type: "string" },
                    IdCategoriaTalla: { type: "string" },
                    NombreTamano: { type: "string" },
                    Estado: {
                        type: "string", defaultValue: function () {
                            return "REGISTRADO";
                        }
                    },
                    NombreEstado: { type: "string" },
                    ColorTela: {
                        type: "string", validation: {
                            required: true
                        }
                    },
                    IdUbicacion: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    NombreUbicacion: { type: "string" },
                    RegistroPrenda: { type: "string" },
                    NoRegistroPrenda: { type: "string" },
                    IdCategoriaPrenda: { type: "number" },
                    NombrePrenda: {type:"string"}

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDet").kendoGrid({
        edit: function (e) {
          
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoHideCampoPopup(e.container, "IdSolicitudDisenoPrenda");
            KdoHideCampoPopup(e.container, "NombrePro");
            KdoHideCampoPopup(e.container, "NombreTipoM");
            KdoHideCampoPopup(e.container, "NombreTamano");
            KdoHideCampoPopup(e.container, "NombreEstado");
            KdoHideCampoPopup(e.container, "NombreUN");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NombreUbicacion");
            KdoHideCampoPopup(e.container, "NombrePrenda");
            KdoHideCampoPopup(e.container, "NoRegistroPrenda");

            if (!e.model.isNew()) {
                $('[name="IdRegistroSolicitudPrenda"]').data("kendoMultiColumnComboBox").setDataSource(Fn_PrendasReg(e.model.IdPrograma));
                KdoMultiColumnCmbSetValue($('[name="IdRegistroSolicitudPrenda"]'), e.model.IdRegistroSolicitudPrenda);
            } else {
                //KdoMultiColumnCmbSetValue($('[name="IdRegistroSolicitudPrenda"]'), "");
                $('[name="IdRegistroSolicitudPrenda"]').data("kendoMultiColumnComboBox").setDataSource(Fn_PrendasReg(0));
            }
            Grid_Focus(e, "NombreDiseno");
            $("#IdUnidadYdPzs").data("kendoComboBox").setDataSource(vIdServSol === 1 ? fn_DSudm("9") : fn_DSudm("9,17"));
            if (InciarInsert === true) {
                fn_GuadarCliente(e);
            }
            else {
          
                Grid_Focus(e, "NombreDiseno");
            }

            if (!e.model.isNew()) {
                KdoMultiColumnCmbEnable($('[name="IdRegistroSolicitudPrenda"]'), true);
                //KdoShowCampoPopup(e.container, "RegistroPrenda");
            } else {
                //KdoHideCampoPopup(e.container, "RegistroPrenda");
                KdoMultiColumnCmbEnable($('[name="IdRegistroSolicitudPrenda"]'), false);
            }


            $("#IdPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
                if (e.item) {
                    KdoMultiColumnCmbEnable($('[name="IdRegistroSolicitudPrenda"]'), true);
                    //KdoShowCampoPopup(e.container, "RegistroPrenda");
                    KdoMultiColumnCmbSetValue($('[name="IdRegistroSolicitudPrenda"]'), "");
                    $('[name="IdRegistroSolicitudPrenda"]').data("kendoMultiColumnComboBox").setDataSource(Fn_PrendasReg(this.dataItem(e.item.index()).IdPrograma));
                } else {
                    //KdoHideCampoPopup(e.container, "RegistroPrenda");
                    KdoMultiColumnCmbEnable($('[name="IdRegistroSolicitudPrenda"]'), false);
                    KdoMultiColumnCmbSetValue($('[name="IdRegistroSolicitudPrenda"]'), "");
                    $('[name="IdRegistroSolicitudPrenda"]').data("kendoMultiColumnComboBox").setDataSource(Fn_PrendasReg(0));
                }
            });

            $("#IdPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
                var multicolumncombobox = $("#IdPrograma").data("kendoMultiColumnComboBox");
                let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
                if (data === undefined) {
                    //KdoHideCampoPopup(e.container, "RegistroPrenda");
                    KdoMultiColumnCmbEnable($('[name="IdRegistroSolicitudPrenda"]'), false);
                    KdoMultiColumnCmbSetValue($('[name="IdRegistroSolicitudPrenda"]'), "");
                    $('[name="IdRegistroSolicitudPrenda"]').data("kendoMultiColumnComboBox").setDataSource(Fn_PrendasReg(0));
                }

            });

            KdoComboBoxEnable($('[name="IdTipoMuestra"]'), false);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoRegistroPrenda", title:"No Registro Prenda"},
            { field: "IdSolicitudDisenoPrenda", title: "Codigo Solicitud Diseño", hidden: true },
            { field: "IdSolicitud", title: "Codigo Solitud", hidden: true },
            { field: "NombreDiseno", title: "Nombre del Diseño" },
            //{ field: "IdPrograma", title: "Programa", editor: fn_ComboPrograma, values: ["IdPrograma", "Nombre", "", "", "Seleccione....", "required", "", "Requerido","fn_CreaItemProm"], hidden: true },
            {
                field: "IdPrograma", title: "Programa", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSelecionProgramaCli();
                }
            },
            { field: "NombrePro", title: "Nombre del Programa" },
            { field: "IdTipoMuestra", title: "Tipo de muestra", editor: Grid_Combox, values: ["IdTipoMuestra", "Nombre", UrlTm, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreTipoM", title: "Tipo de muestras" },
            { field: "IdCategoriaTalla", title: "Tamaño a desarrollar", editor: Grid_Combox, values: ["IdCategoriaTalla", "Nombre", UrlCata, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreTamano", title: "Tamaño a desarrollar" },
            { field: "ColorTela", title: "Color tela" },
            { field: "CantidadSTrikeOff", title: "STrike Off", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0] },
            { field: "CantidadYardaPieza", title: "No Piezas / Yardas", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0] },
            { field: "IdUnidadYdPzs", title: "Unidad de medida", editor: Grid_Combox, values: ["IdUnidad", "Nombre", UrlUm, "", "Seleccione....", "", "", ""], hidden: true },
            { field: "NombreUN", title: "Unidad de medida" },
            {
             field: "RegistroPrenda", title: "Crear registro de Prenda", hidden: true, menu: false, editor: fn_BotonAgregar
            },
            {
                field: "IdRegistroSolicitudPrenda", title: "Registro de Prenda", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSelecionPrenda();
                }
            },
         
            { field: "NombrePrenda", title: "Nombre Prenda" },
            { field: "IdUbicacion", title: "Ubicacion", editor: Grid_Combox, values: ["IdUbicacion", "Nombre", TSM_Web_APi + "Ubicaciones", "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreUbicacion", title: "Nombre Ubicacion" },
            { field: "Estado", title: "Cod. Estado", hidden: true},
            { field: "NombreEstado", title: "Estado", hidden: true }

         
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDet").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDet").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridDet").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDet").data("kendoGrid"), dataSourceMue);
    var selectedRows = [];
    $("#gridDet").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDet"), selectedRows);
        if ($("#gridDet").data("kendoGrid").dataSource.total() === 0) {
            KdoComboBoxEnable($("#CmbCliCont"), true);
            esContacto === 1 ? KdoComboBoxEnable($("#CmbEjecSol"), true) : KdoComboBoxEnable($("#CmbContactoSol"), true);
            Kendo_CmbFocus($("#CmbCliCont"));
            KdoButtonEnable($("#btnFinClieCont"), false);
        } else {
            KdoComboBoxEnable($("#CmbCliCont"), false);
            KdoComboBoxEnable($("#CmbContactoSol"), false);
            KdoComboBoxEnable($("#CmbEjecSol"), false);
            KdoButtonEnable($("#btnFinClieCont"), true);
        }
    });
    $("#gridDet").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDet"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridDet"), $(window).height() - "371");
    });
    Fn_Grid_Resize($("#gridDet"), $(window).height() - "371");

    let grid1 = $("#gridDet").data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });
    $(grid1.element).kendoDropTarget({
        drop: function (e) {
            e.draggable.hint.hide();
            let target = grid1.dataSource.getByUid($(e.draggable.currentTarget).data("uid")),
                dest = $(e.target);
            if (dest.is("th") || dest.is("thead") || dest.is("span") || dest.parent().is("th")) {
                return;
            }
            //en caso que contenga imagen
            else if (dest.is("img")) {
                dest = grid1.dataSource.getByUid(dest.parent().parent().data("uid"));
            }
            else {
                dest = grid1.dataSource.getByUid(dest.parent().data("uid"));
            }
            if (dest === undefined) {
                fn_InsFilaGrid(grid1, target);
                grid1.saveChanges();
            }

        },
        group: "gridGroup"
    });
};
let fn_DSudm = function (filtro) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url: TSM_Web_APi + "UnidadesMedidas/GetUnidadesMedidasByFiltro",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(filtro),
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};
let fn_Programas = function () {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    async: false,
                    url: TSM_Web_APi + "Programas/GetByCliente/" + KdoCmbGetValue($("#CmbCliCont")),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};
let fn_BorrarSol = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "Solicitudes/" + vIdSoli,
        type: "DELETE",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            window.location.href = "/SolicitudesClientes";
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });

};
let fn_finsolicitudCliente = function () {
    //kendo.ui.progress($(".k-widget.k-window"), true);
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudesDisenoPrendas/FinalizarSolicitudesClientes/" + vIdSoli.toString(),
        type: "Post",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function () {
            $("#ModalMsgSol").modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });
            $("#ModalMsgSol").find('.modal-title').text("Solicitud finalizada");
            $("#ModalMsgSol").find('.modal-body h2').text('Su solicitud ha sido recibida. Numero de solicitud : ' + $("#NoDocumento").val());
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(document.body), false);
        }
    });
};
let fn_CrearPrenda = function () {
    let creado = false;

    kendo.ui.progress($(document.body), true);
    let xType = "Post";
    $.ajax({
        url: TSM_Web_APi + "RegistrosSolicitudesPrendas",
        type: xType,
        data: JSON.stringify({
            IdRegistroSolicitudPrenda: 0,
            IdCliente: KdoCmbGetValue($("#CmbCliCont")),
            IdPrograma: KdoMultiColumnCmbGetValue($('[name="IdPrograma"]')),
            IdCategoriaPrenda: KdoCmbGetValue($("#TxtPrenda")),
            NoDocumento: "",
            Fecha: Fhoy(),
            Descripcion: $("#TxtDescrip").val()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#ModalCliePrenda").data("kendoDialog").close();
            $('[name="IdRegistroSolicitudPrenda"]').data("kendoMultiColumnComboBox").dataSource.read();
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, xType);
            creado = true;
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
            creado = false;
        }
    });

    return creado;
};
let fn_GuadarCliente = function (e) {
    if ($("#FrmClieCont").data("kendoValidator").validate()) {
        xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
        xpnNombreClie = KdoCmbGetText($("#CmbCliCont"));
        if (esContacto === 1) {
            xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
        } else {
            xpnIdContactoCliente = KdoCmbGetValue($("#CmbContactoSol"));
        }
        TextBoxEnable($('[name="NombreDiseno"]'), false);
        TextBoxEnable($('[name="NombrePro"]'), false);
        TextBoxEnable($('[name="NombreUbicacion"]'), false);
        KdoComboBoxEnable($('[name="IdCategoriaTalla"]'), false);
        KdoComboBoxEnable($('[name="IdUbicacion"]'), false);
        TextBoxEnable($('[name="ColorTela"]'), false);
        KdoNumerictextboxEnable($('[name="CantidadSTrikeOff"]'), false);
        KdoNumerictextboxEnable($('[name="CantidadYardaPieza"]'), false);
        KdoComboBoxEnable($('[name="IdUnidadYdPzs"]'), false);

        
        fn_crearServClie();
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
};
let fn_CreaItemProm = function (widgetId, value) {
    var widget = $("#" + widgetId).getKendoMultiColumnComboBox();
    var dsProN = widget.dataSource;

    //ConfirmacionMsg("¿Esta seguro de crear el nuevo registro?", function () {
        dsProN.add({
            IdPrograma: 0,
            Nombre: value,
            Fecha: Fhoy(),
            IdCliente: KdoCmbGetValue($("#CmbCliCont")),
            IdTemporada: 1, // como no se pide se coloca por defecto codigo 1 "NO DEFINIDA"
            NoDocumento: "",
            Nombre1: ""
        });

        dsProN.one("sync", function () {
            widget.select(dsProN.view().length - 1);
            widget.trigger("change");
            $("#kendoNotificaciones").data("kendoNotification").show("Programa creado satisfactoriamente!!", "success");
            Kendo_CmbFocus($('[name="IdTipoMuestra"]'));
        });

        dsProN.sync();
    //});
};

$.fn.extend({
    ControlSelecionProgramaCli: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                filterFields: ["IdPrograma", "NoDocumento", "Nombre"],
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    batch: true,
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "Programas/GetByCliente/" + (KdoCmbGetValue($("#CmbCliCont")) === null ? 0 : KdoCmbGetValue($("#CmbCliCont")));
                            },
                            contentType: "application/json; charset=utf-8"
                        },
                        create: {
                            url: TSM_Web_APi + "/Programas",
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read" && data.models) {
                                return kendo.stringify(data.models[0]);
                            }
                        }
                    },
                    schema: {
                        total: "count",
                        model: {
                            id: "IdPrograma",
                            fields: {
                                IdPrograma: { type: "number" },
                                NoDocumento: { type: "string" },
                                Nombre: { type: "string" }
                            }
                        }
                    }
                },
                noDataTemplate: kendo.template("<div>Dato no encontrado.¿Quieres agregar nuevo registro - '#: instance.text() #' ? </div ><br /><button class=\"k-button\" onclick=\"fn_CreaItemProm('#: instance.element[0].id #', '#: instance.text() #')\"><span class=\"k-icon k-i-save\"></span>&nbsp;Crear Registro</button>"),//$("#noDataTemplate").html()
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 }
                ]
            });
        });
    }
});

$.fn.extend({
    ControlSelecionPrenda: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdRegistroSolicitudPrenda",
                filter: "contains",
                filterFields: ["NoDocumento", "NoDocPrograma", "NombrePrograma", "NombrePrenda","Descripcion"],
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección....",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: Fn_PrendasCliente(),
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "NoDocPrograma", title: "NoDocPrograma", width: 150 },
                    { field: "NombrePrograma", title: "NombrePrograma", width: 300 },
                    { field: "NombrePrenda", title: "NombrePrenda", width: 300 },
                    { field: "Descripcion", title: "Descripción", width: 300 }
                ]
            });
        });
    }
});

var Fn_PrendasReg = function (vPr) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "NombrePrograma", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "RegistrosSolicitudesPrendas/GetByClientePrograma/" + (KdoCmbGetValue($("#CmbCliCont")) === null ? 0 : KdoCmbGetValue($("#CmbCliCont"))) + "/" + vPr,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        },
        schema: {
            total: "count",
            model: {
                id: "IdPrograma",
                fields: {
                    IdPrograma: { type: "number" },
                    NoDocumento: { type: "string" },
                    NombrePrograma: { type: "string" },
                    NoDocPrograma: { type: "string" },
                    Descripcion: { type: "string" }
                }
            }
        }
    });
};

var Fn_PrendasCliente = function () {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "NombrePrograma", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "RegistrosSolicitudesPrendas/GetByCliente/" + (KdoCmbGetValue($("#CmbCliCont")) === null ? 0 : KdoCmbGetValue($("#CmbCliCont"))),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        },
        schema: {
            total: "count",
            model: {
                id: "IdPrograma",
                fields: {
                    IdPrograma: { type: "number" },
                    NoDocumento: { type: "string" },
                    NombrePrograma: { type: "string" },
                    NoDocPrograma: { type: "string" },
                    Descripcion: { type: "string" }
                }
            }
        }
    });
};
let fn_InsFilaGrid = function (g, data) {
    g.dataSource.insert(0, {
        IdSolicitudDisenoPrenda: 0,
        IdSolicitud: data.IdSolicitud,
        NombreDiseno: data.NombreDiseno,
        IdPrograma: data.IdPrograma,
        NombrePro: data.NombrePro,
        IdTipoMuestra: data.IdTipoMuestra,
        NombreTipoM: data.NombreTipoM,
        IdCategoriaTalla: data.IdCategoriaTalla,
        NombreTamano: data.NombreTamano,
        ColorTela: data.ColorTela,
        CantidadSTrikeOff: data.CantidadSTrikeOff,
        CantidadYardaPieza: data.CantidadYardaPieza,
        IdUnidadYdPzs: data.IdUnidadYdPzs,
        NombreUN: data.NombreUN,
        Estado: data.Estado,
        NombreEstado: data.NombreEstado,
        IdRegistroSolicitudPrenda: data.IdRegistroSolicitudPrenda,
        NoRegistroPrenda: data.NoRegistroPrenda,
        NombrePrenda: data.NombrePrenda

    });
};

var fn_BotonAgregar = function (container, options) {
    container.append("<a class='k-button' id='btnInsPren' onclick='fn_Agregar()' ><span class='k-icon k-i-plus'></span></a>");
};

var fn_Agregar = function () {
    if (KdoMultiColumnCmbGetValue($('[name="IdPrograma"]')) !== null || $('[name="NombreDiseno"]').val()!=="") {
        KdoCmbSetValue($("#TxtPrenda"), "");
        $("#TxtDescrip").val($('[name="NombreDiseno"]').val());
        $("#ModalCliePrenda").data("kendoDialog").open();
        KdoCmbFocus($("#TxtPrenda"));
    } else {

        $("#kendoNotificaciones").data("kendoNotification").show("Digite el nombre del diseño y el programa", "error");
    }
   
};

var fn_btnCrearPren = function () {
    let creado = false;
    if ($("#FrmModalCliePrenda").data("kendoValidator").validate()) {

        if (KdoMultiColumnCmbGetValue($('[name="IdPrograma"]'))!==null) {
            creado = fn_CrearPrenda();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Antes de registrar seleccione un programa", "error");
        }
      
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }

    return creado;
};
fPermisos = function (datos) {
    Permisos = datos;
};