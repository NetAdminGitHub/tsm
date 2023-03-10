let xidEtapaCambioAnte = 0;
let xIdEtapa = 0;
let VCamEtp;
var fn_InicialarCargaVistaCambio = function (sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo) {


    kendo.ui.progress($(document.activeElement), true);
    KdoComboBoxbyData($("#cmbUsuarioEtpImp"), "[]", "Nombre", "IdUsuario", "Seleccione...", "", "");
    Kendo_CmbFiltrarGrid($("#cmbMotivoSolCambio"), TSM_Web_APi + "MotivosSolicitudesCambios/GetMotivosSolicitudesCambiosLista", "Nombre", "IdMotivoSolicitudCambio", "Seleccione Motivo...");
    $("#cmbCatalogoCambios").ControlSelecionSolicitudesCambiosTipoOT(SicidTipoOrdenTrabajo);
    $("#TxtMotivoCambio").autogrow({ vertical: true, horizontal: false, flickering: false });
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

     VCamEtp = $("#FrmSolicitarCambio").kendoValidator(
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
                    if (input.is("[name='TxtMotivoCambio']")) {
                        return input.val().length >0 && input.val().length <= 200;
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

    kendo.ui.progress($(document.activeElement), false);

};

var fn_RegistroCambios = function () {
    kendo.ui.progress($(document.activeElement), true);
    KdoMultiColumnCmbSetValue($("#cmbCatalogoCambios"), "");
    $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").dataSource.read();
    $("#TxtMotivoCambio").val("");
    $("#TxtAreasImpacto").text("");
    KdoCmbSetValue($("#cmbUsuarioEtpImp"), "");
    KdoCmbSetValue($("#cmbMotivoSolCambio"), "");
    kendo.ui.progress($(document.activeElement), false);

};

var fn_RegistrarSolicitudCambio = function (xidOt, xIdEtapa, xItem) {
    let Realizado = false;
    if (VCamEtp.validate()) {
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "OrdenesTrabajosSolicitudesCambios/CrearSolicitud",
            type: "Post",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                IdOrdenTrabajo: xidOt,
                IdEtapaNuevo: xidEtapaCambioAnte,
                IdUsuarioAsignado: KdoCmbGetValue($("#cmbUsuarioEtpImp")),
                IdSolicitudCambio: KdoMultiColumnCmbGetValue($("#cmbCatalogoCambios")),
                NombreTipoCambio: $("#cmbCatalogoCambios").data("kendoMultiColumnComboBox").text(),
                ItemSolicitud: 0,
                IdEtapa: xIdEtapa,
                Estado: "GENERADA",
                Motivo: $("#TxtMotivoCambio").val(),
                IdUsuario: getUser(),
                snMensaje: false,
                IdMotivoSolicitudCambio: KdoCmbGetValue($("#cmbMotivoSolCambio"))
            }),
            success: function (data) {
                kendo.ui.progress($(".k-dialog"), false);
                RequestEndMsg(data, "Post");
                $("#vRegistroCambio").data("kendoDialog").close();
                KdoCmbGetValue($("#cmbUsuarioEtpImp")) !== getUser() ? window.location.href = "/EtapasOrdenesTrabajos" : $("#smartwizard").smartWizard("goToPage", $("[etapa=" + xidEtapaCambioAnte.toString() + "]").attr("indice"));
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
            motivo: $("#TxtMotivoCambio").val(),
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

var GetUltimoAsignado = function (idot,idetp) {
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