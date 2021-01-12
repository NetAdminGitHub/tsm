let xidEtapaCambioAnte = 0;
let xIdEtapa = 0;
let VCamEtp;

var fn_InicialarCargaVistaReactivacion = function (sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo) {


    kendo.ui.progress($(document.activeElement), true);
    KdoComboBoxbyData($("#cmbUsuarioEtpImp"), "[]", "Nombre", "IdUsuario", "Seleccione...", "", "");
    Kendo_CmbFiltrarGrid($("#cmbMotivoSolCambio"), TSM_Web_APi + "MotivosSolicitudesCambios/GetMotivosSolicitudesCambiosLista", "Nombre", "IdMotivoSolicitudCambio", "Seleccione Motivo...");
    $("#cmbCatalogoCambios").ControlSelecionSolicitudesCambios();
    $("#TxtMotivoCambioReact").autogrow({ vertical: true, horizontal: false, flickering: false });
    xIdEtapa = sicIdEtapa;

    $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").bind("change", function (e) {

        let datos = fn_GetEtpAnterior(this.value() === "" ? 0 : this.value());
        if (datos !== null) {
            xidEtapaCambioAnte = datos.IdEtapaProceso;
            KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
            $("#cmbUsuarioEtpImp").data("kendoComboBox").setDataSource(get_cmbUsuarioEtpSolicitudCambio(SicidTipoOrdenTrabajo.toString(), xidEtapaCambioAnte));



            GetUltimoAsignado(sicIdot, xidEtapaCambioAnte);
        } else {
            xidEtapaCambioAnte = 0;
            $("#cmbUsuarioEtpImp").data("kendoComboBox").value("");

        }

        var multicolumncombobox = $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdSolicitudCambio === Number(this.value()));
        if (data === undefined) {
            $("#TxtAreasImpacto").text("");
        }

    });
    $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            this.dataItem(e.item.index()).EtapasImpacto;
            $("#TxtAreasImpacto").text(this.dataItem(e.item.index()).EtapasImpacto);

        } else {
            $("#TxtAreasImpacto").text("");

        }
    });

    VCamEtp = $("#FrmSolicitarReactivacion").kendoValidator(
        {
            rules: {

                Msg1: function (input) {
                    if (input.is("[name='cmbCatalogoCambios']")) {
                        return $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msg2: function (input) {
                    if (input.is("[name='cmbUsuarioEtpImp']")) {
                        return $("#cmbUsuarioEtpImp").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                Msg3: function (input) {
                    if (input.is("[name='TxtMotivoCambioReact']")) {
                        return input.val().length > 0 && input.val().length <= 200;
                    }
                    return true;
                },
                Msg4: function (input) {
                    if (input.is("[name='cmbMotivoSolCambio']")) {
                        return $("#cmbMotivoSolCambio").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                Msg1: "Requerido",
                Msg2: "Requerido",
                Msg3: "Requerido",
                Msg4: "Requerido"

            }
        }).data("kendoValidator");

    KdoMultiColumnCmbSetValue($("#cmbCatalogoCambios"), "");
    $("#TxtMotivoCambioReact").val("");
    $("#TxtAreasImpacto").text("");
    kdoRbSetValue($("#rbReactivarUltEtapa"), true);
    KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
    KdoCmbSetValue($("#cmbMotivoSolCambio"), "");
    KdoComboBoxEnable($("#cmbMotivoSolCambio"), false);
    KdoMultiColumnCmbEnable($("#cmbCatalogoCambios"), false);
    

    $("#rbReactivarUltEtapa").click(function () {
        KdoMultiColumnCmbSetValue($("#cmbCatalogoCambios"), "");
        $("#TxtMotivoCambioReact").val("");
        $("#TxtAreasImpacto").text("");
        KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
        KdoCmbSetValue($("#cmbMotivoSolCambio"), "");
        KdoComboBoxEnable($("#cmbMotivoSolCambio"), false);
        KdoMultiColumnCmbEnable($("#cmbCatalogoCambios"), false);
        VCamEtp.hideMessages();
        $("#TxtMotivoCambioReact").focus();
    });

    $("#rbReactivarConSolicitud").click(function () {
        KdoMultiColumnCmbSetValue($("#cmbCatalogoCambios"), "");
        $("#TxtMotivoCambioReact").val("");
        $("#TxtAreasImpacto").text("");
        KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
        KdoCmbSetValue($("#cmbMotivoSolCambio"), "");
        KdoComboBoxEnable($("#cmbMotivoSolCambio"), true);
        KdoMultiColumnCmbEnable($("#cmbCatalogoCambios"), true);
        VCamEtp.hideMessages();
        var msc = $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox");
        msc.focus();
    });


    if (KdoRbGetValue($("#rbReactivarUltEtapa")) === true) {
        KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
        $("#cmbUsuarioEtpImp").data("kendoComboBox").setDataSource(get_cmbUsuarioEtpSolicitudCambio(SicidTipoOrdenTrabajo, sicIdEtapa));
        GetUltimoAsignado(sicIdot, sicIdEtapa);
    }


    kendo.ui.progress($(document.activeElement), false);
    $("#TxtMotivoCambioReact").focus();

};

var fn_RegistroReactivacion = function (sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo) {
    kendo.ui.progress($(document.activeElement), true);
    KdoMultiColumnCmbSetValue($("#cmbCatalogoCambios"), "");
    $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").dataSource.read();
    $("#TxtMotivoCambioReact").val("");
    $("#TxtAreasImpacto").text("");
    kdoRbSetValue($("#rbReactivarUltEtapa"), true);
    KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
    KdoCmbSetValue($("#cmbMotivoSolCambio"), "");
    KdoComboBoxEnable($("#cmbMotivoSolCambio"), false);
    KdoMultiColumnCmbEnable($("#cmbCatalogoCambios"), false);
    kendo.ui.progress($(document.activeElement), false);

    if (KdoRbGetValue($("#rbReactivarUltEtapa")) === true ) {
        KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
        $("#cmbUsuarioEtpImp").data("kendoComboBox").setDataSource(get_cmbUsuarioEtpSolicitudCambio(SicidTipoOrdenTrabajo, sicIdEtapa));
        GetUltimoAsignado(sicIdot, sicIdEtapa);
        $("#TxtMotivoCambioReact").focus();
    }

};

var fn_RegistrarSolicitudReactivacionOT = function (xidOt, xIdEtapa, xItem) {
    let Realizado = false;
    if (VCamEtp.validate()) {
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "OrdenesTrabajosSolicitudesCambios/ReactivarOT",
            type: "Post",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                IdOrdenTrabajo: xidOt,
                IdEtapaNuevo: xidEtapaCambioAnte,
                IdUsuarioAsignado: KdoCmbGetValue($("#cmbUsuarioEtpImp")) === null ? "" : KdoCmbGetValue($("#cmbUsuarioEtpImp")),
                IdSolicitudCambio: KdoMultiColumnCmbGetValue($("#cmbCatalogoCambios")) === null ? 0 : KdoMultiColumnCmbGetValue($("#cmbCatalogoCambios")),
                NombreTipoCambio: $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").text(),
                ItemSolicitud: 0,
                IdEtapa: xIdEtapa,
                Estado: "GENERADA",
                Motivo: $("#TxtMotivoCambioReact").val(),
                IdUsuario: getUser(),
                snMensaje: false,
                IdMotivoSolicitudCambio: KdoCmbGetValue($("#cmbMotivoSolCambio")) === null ? 0 : KdoCmbGetValue($("#cmbMotivoSolCambio")),
                Opcion: KdoRbGetValue($("#rbReactivarUltEtapa")) === true ? 1:2

            }),
            success: function (data) {
                kendo.ui.progress($(".k-dialog"), false);
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($(".k-dialog"), false);
                ErrorMsg(data);

            }
        });
        Realizado = true;

    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        Realizado = false;
    }
    return Realizado;

};

var fn_GetEtpAnterior = function (xidSolicitudCambio) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SolicitudesCambios/GetEtapaAnterior/" + xidSolicitudCambio + "/" + xIdEtapa,
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

var get_cmbUsuarioEtpSolicitudCambio = function (tipo, etpAS) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + tipo.toString() + "/" + etpAS.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var fn_CambioEtpRegCambio = function (xidOt, xIdEtapaNuevo) {
    // obtener indice de la etapa siguiente
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/CambiarEtapa",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            idOrdenTrabajo: xidOt,
            idEtapaNuevo: xIdEtapaNuevo,
            idUsuarioAsignado: KdoCmbGetValue($("#cmbUsuarioEtpImp")),
            motivo: $("#TxtMotivoCambioReact").val(),
            IdUsuario: getUser(),
            snMensaje: false
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            kendo.ui.progress($(".k-dialog"), false);
            window.location.href = "/EtapasOrdenesTrabajos";
        },
        error: function (data) {
            ErrorMsg(data);
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });

};

var GetUltimoAsignado = function (idot, idetp) {
    kendo.ui.progress($(".k-dialog"), true);
    KdoCheckBoxEnable($("#cmbUsuarioEtpImp"), false);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosDetallesUsuarios/GetUltimoAsignado/" + idot + "/" + idetp,
        async: false,
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                KdoCmbSetValue($("#cmbUsuarioEtpImp"), datos.IdUsuario);
            } else {
                KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
            }
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
            KdoCheckBoxEnable($("#cmbUsuarioEtpImp"), true);
        }
    });
};

var get_MotivosSolicitudesCambios = function (IdSolicitudCambio) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "MotivosSolicitudesCambios/GetByidSolicitudCambio/" + IdSolicitudCambio.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};