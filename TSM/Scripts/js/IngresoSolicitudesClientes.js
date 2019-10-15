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
let UrlTem = TSM_Web_APi +"Temporadas"
$(document).ready(function () {
    //#region Inicializar combobox en la vista 
    KdoComboBoxbyData($("#CmbCliCont"), "[]", "Nombre", "IdCliente", "Seleccione...");
    KdoComboBoxbyData($("#CmbEjecSol"), "[]", "Nombre", "IdEjecutivoCuenta", "Seleccione...");
    KdoComboBoxbyData($("#CmbContactoSol"), "[]", "Nombre", "IdContactoCliente", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbTempo"), UrlTem, "Nombre", "IdTemporada", "Seleccione ...", "", "");
    $("#Fecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    KdoDatePikerEnable($("#Fecha"), false);
    //#endregion 
    //#region Inicializar botones de mando
    KdoButton($("#btnAClieCont"), "save", "Inciar Solicitud");
    KdoButton($("#btnDelClieCont"), "delete", "Borrar");
    KdoButton($("#btnFinClieCont"), "check", "Finalizar solicitud");
    KdoButton($("#btnProClieCont"), "calendar", "Nuevo Programa");
    KdoButton($("#btnACliePro"), "save", "Guardar Programa");
    //#endregion

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

    $("#FrmModalCliePro").kendoValidator(
        {
            rules: {
                MsgcTemp: function (input) {
                    if (input.is("[name='CmbTempo']")) {
                        return $("#CmbTempo").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msgejecsol: function (input) {
                    if (input.is("[name='TxtPro']") && input.val().length > 200) {
                        input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                        return false;
                    }
                    return true;
                }


            },
            messages: {
                MsgcTemp: "Requerido",
                Msgejecsol: "Requerido"
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
    $("#btnProClieCont").data("kendoButton").bind("click", function () {
        KdoCmbSetValue($("#CmbTempo"), "");
        $("#TxtPro").val("");
        $("#ModalCliePro").modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
        $("#ModalCliePro").find('.modal-title').text("Crear nuevo programa");
     
    });

    $("#btnACliePro").data("kendoButton").bind("click", function (e) {
        event.preventDefault();
        if ($("#FrmModalCliePro").data("kendoValidator").validate()) {
            fn_crearProgra();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $('#ModalCliePro').on('shown.bs.modal', function (e) {
        KdoCmbFocus($("#CmbTempo"));
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
let fn_crearServClie = function () {
    let snCreoCli = false;
    kendo.ui.progress($(document.body), true);
    let xType = vIdSoli === 0 ? "Post" : "Put";
    let xFecha =  kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
    xpNodocumento = vIdSoli === 0 ? "" : $("#NoDocumento").val();
    xpnEstado = "REGISTRADO";
    $.ajax({
        url: TSM_Web_APi + (vIdSoli === 0 ? "Solicitudes" : "Solicitudes/" + vIdSoli),
        type: xType,
        async: false,
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
            kendo.ui.progress($(document.body), false);
            //RequestEndMsg(data, xType);
            snCreoCli = true;
            
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
            snCreoCli = false;
        }
    });

    return snCreoCli;
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
                                    return $("#IdPrograma").data("kendoComboBox").selectedIndex >= 0;
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
                                return true;
                            }
                        }
                    },
                    IdTipoMuestra: { type: "string" },
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
                    }
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
            Grid_Focus(e, "NombreDiseno");

            $("#IdUnidadYdPzs").data("kendoComboBox").setDataSource(vIdServSol === 1 ? fn_DSudm("9") : fn_DSudm("9,17"));
            if (vIdSoli === 0) {
                fn_GuadarCliente();
                $('[name="IdSolicitud"]').data("kendoNumericTextBox").value(vIdSoli);
                $('[name="IdSolicitud"]').data("kendoNumericTextBox").trigger("change");
            }
     
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitudDisenoPrenda", title: "Codigo Solicitud Diseño", hidden: true },
            { field: "IdSolicitud", title: "Codigo Solitud", hidden: true },
            { field: "NombreDiseno", title: "Nombre del Diseño" },
            {
                field: "IdPrograma", title: "Programa", editor: fn_ComboPrograma, values: ["IdPrograma", "Nombre", "", "", "Seleccione....", "required", "", "Requerido","fn_CreaItemProm"], hidden: true },
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
            { field: "Estado", title: "Cod. Estado", hidden: true},
            { field: "NombreEstado", title: "Estado"}
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
    $.ajax({
        url: TSM_Web_APi + "SolicitudesDisenoPrendas/FinalizarSolicitudesClientes/" + vIdSoli.toString(),
        type: "Post",
        dataType: "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function () {
            $("#ModalMsgSol").modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });
            $("#ModalMsgSol").find('.modal-title').text("Solicitud finalizada");
            $("#ModalMsgSol").find('.modal-body h2').text('Su solicitud ha sido recibida. Numero de solicitud : ' + $("#NoDocumento").val());
        },
        error: function (data) {
            ErrorMsg(data);
        }
    });
};
let fn_crearProgra = function () {
    kendo.ui.progress($(document.body), true);
    let xType = "Post";
    $.ajax({
        url: TSM_Web_APi + "Programas",
        type: xType,
        data: JSON.stringify({
            IdPrograma: 0,
            Nombre: $("#TxtPro").val(),
            IdCliente: KdoCmbGetValue($("#CmbCliCont")),
            Fecha: Fhoy(),
            NoDocumento: "",
            IdTemporada: KdoCmbGetValue($("#CmbTempo"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#ModalCliePro").modal('hide');
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });

};
let fn_GuadarCliente = function () {
    let snGuardo = false;
    if ($("#FrmClieCont").data("kendoValidator").validate()) {
        xpnIdcliente = KdoCmbGetValue($("#CmbCliCont"));
        xpnNombreClie = KdoCmbGetText($("#CmbCliCont"));
        if (esContacto === 1) {
            xpnIdEjecutivo = KdoCmbGetValue($("#CmbEjecSol"));
        } else {
            xpnIdContactoCliente = KdoCmbGetValue($("#CmbContactoSol"));
        }
        snGuardo = fn_crearServClie();
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        snGuardo = false;
    }
    return snGuardo;
};

let fn_CreaItemProm = function (widgetId, value) {
    var widget = $("#" + widgetId).getKendoComboBox();
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
        });

        dsProN.sync();
    //});
};
let fn_ComboPrograma = function (container, options) {
    var required = givenOrDefault(options.values[5], "");
    var Message = givenOrDefault(options.values[7], "");
    var validationMessage = Message === "" ? "" : " validationMessage =" + Message;
    $.ajax({
        url: TSM_Web_APi + "Programas/GetByCliente/" + (KdoCmbGetValue($("#CmbCliCont")) === null ? 0 : KdoCmbGetValue($("#CmbCliCont"))),
        dataType: "json",
        type:'GET',
        async: false,
        success: function (result) {
           
            var model = generateModel(result, options.values[0]);
            var dataSource = new kendo.data.DataSource({
                batch: true,
                transport: {
                    read: {
                        url: TSM_Web_APi + "Programas/GetByCliente/" + (KdoCmbGetValue($("#CmbCliCont")) === null ? 0 : KdoCmbGetValue($("#CmbCliCont"))),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    },
                    create: {
                        url: TSM_Web_APi + "/Programas",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8"
                    },
                    parameterMap: function (data, type) {
                        if (type !== "read") {
                            return kendo.stringify(data.models[0]);
                        }
                    }
                },
                schema: {
                    total: "count",
                    model: model
                }
            });
            $('<input ' + required + validationMessage + ' id="' + options.field + '" name="' + options.field + '"/>')
                .appendTo(container)
                .kendoComboBox({
                    valuePrimitive: true,
                    autoBind: true,
                    dataTextField: options.values[1],
                    dataValueField: options.values[0],
                    autoWidth: true,
                    cascadeFrom: givenOrDefault(options.values[6], ""),
                    placeholder: givenOrDefault(options.values[4], "Seleccione un valor ...."),
                    filter: "contains",
                    dataSource: dataSource,
                    noDataTemplate: kendo.template("<div>Dato no encontrado.¿Quieres agregar nuevo registro - '#: instance.text() #' ? </div ><br /><button class=\"k-button\" onclick=\"" + options.values[8].toString() + "('#: instance.element[0].id #', '#: instance.text() #')\"><span class=\"k-icon k-i-save\"></span>&nbsp;Crear Registro</button>")//$("#noDataTemplate").html()
                });
        }
    });
};



fPermisos = function (datos) {
    Permisos = datos;
};