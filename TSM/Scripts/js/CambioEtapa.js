﻿var banLoad = 0;
let IdEtapaActual;
let EsAnterior;
let IdDespachoMercancia;
let NombreEA;

var fn_Ini_ConsultaEtapa = function (strjson) {

    IdEtapaActual = strjson.IdEtapaActual;
    IdDespachoMercancia = strjson.IdDespachoMercancia;
    NombreEA = strjson.NombreEtapaActual;

    if (banLoad == 0) {
        KdoButton($("#btnCambiarEtapaOD"), "check", "Cambiar");
        KdoButton($("#btnCancelarEtapaOD"), "cancel", "Cancelar");
        $("#btnCancelarEtapaOD").on("click", function () {
            $("#vCambioEtapa").data("kendoWindow").close();
        });

        Kendo_CmbFiltrarGrid($("#cmbEtapas"), TSM_Web_APi + "DespachosMercanciasEtapas/GetSiguientesEtapasOrdenDespacho/" + IdEtapaActual, "Nombre", "IdEtapaProceso", "Seleccione una etapa");
        banLoad = 1;
    }
    else
    {
        let dse = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () {
                        return TSM_Web_APi +
                            `DespachosMercanciasEtapas/GetSiguientesEtapasOrdenDespacho/${IdEtapaActual === null ? 0 : IdEtapaActual}`
                    },
                    contentType: "application/json; charset=utf-8"
                }
            }
        });
        $("#cmbEtapas").data("kendoComboBox").setDataSource(dse);
    }

    $("#cmbEtapas").data("kendoComboBox").bind("select", function (e) {
        let dataItem = this.dataItem(e.item.index());
        EsAnterior = dataItem.EtapaAnterior;
        if (EsAnterior == 0) {
            $('#TxtMotivoEtapa').val("");
            $('#TxtMotivoEtapa').prop('readonly', true);
        }
        else {
            $('#TxtMotivoEtapa').prop('readonly', false);
        }
    });

    $("#btnCambiarEtapaOD").on("click", function () {
        if (EsAnterior == 0) {
            if ($("#cmbEtapas").data("kendoComboBox").selectedIndex >= 0) {

                $.ajax({
                    url: TSM_Web_APi + "DespachosMercancias/CambioEtapaOrdenDespacho",
                    data: JSON.stringify({
                        IdDespachoMercancia: IdDespachoMercancia,
                        IdEtapaActual: IdEtapaActual,
                        IdEtapaSiguiente: KdoCmbGetValue($("#cmbEtapas")),
                        Id: null,
                        Motivo: "Cambio de etapa de " + NombreEA + " a " + KdoCmbGetText($("#cmbEtapas"))
                    }),
                    type: "POST",
                    dataType: "json",
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $("#vCambioEtapa").data("kendoWindow").close();
                        $("#kendoNotificaciones").data("kendoNotification").show("Cambio de etapa exitoso", "success");
                    },
                    error: function (data) {
                        VistaCambioEsta.data("kendoDialog").close();
                        kendo.ui.progress($("#TxtMotivo"), false);
                        ErrorMsg(data);
                        Realizocambio = false;
                        kendo.ui.progress($(".k-dialog"), false);
                    }

                });

            }
            else {
                $("#kendoNotificaciones").data("kendoNotification").show("Elija una etapa válida", "error");
            }
        }
        else {
            if ($("#cmbEtapas").data("kendoComboBox").selectedIndex >= 0) {
                if ($('#TxtMotivoEtapa').val() != "" && $('#TxtMotivoEtapa').val() != null) {
                    $.ajax({
                        url: TSM_Web_APi + "DespachosMercancias/CambioEtapaOrdenDespacho",
                        data: JSON.stringify({
                            IdDespachoMercancia: IdDespachoMercancia,
                            IdEtapaActual: IdEtapaActual,
                            IdEtapaSiguiente: KdoCmbGetValue($("#cmbEtapas")),
                            Id: null,
                            Motivo: $('#TxtMotivoEtapa').val()
                        }),
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            $("#vCambioEtapa").data("kendoWindow").close();
                            $("#kendoNotificaciones").data("kendoNotification").show("Cambio de etapa exitoso", "success");
                        },
                        error: function (data) {
                            VistaCambioEsta.data("kendoDialog").close();
                            kendo.ui.progress($("#TxtMotivo"), false);
                            ErrorMsg(data);
                            Realizocambio = false;
                            kendo.ui.progress($(".k-dialog"), false);
                        }

                    });
                }
                else {
                    $("#kendoNotificaciones").data("kendoNotification").show("Escriba un motivo", "error");
                }
            }
            else {
                $("#kendoNotificaciones").data("kendoNotification").show("Elija una etapa válida", "error");
            }
        }
    });
    
}

var fn_con_ConsultaEtapa = function (strjson) {

    KdoCmbSetValue($("#cmbEtapas"), "");
    $("#TxtMotivoEtapa").val("");

    IdEtapaActual = strjson.IdEtapaActual;
    IdDespachoMercancia = strjson.IdDespachoMercancia;
    NombreEA = strjson.NombreEtapaActual;

    let dse = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi +
                        `DespachosMercanciasEtapas/GetSiguientesEtapasOrdenDespacho/${IdEtapaActual === null ? 0 : IdEtapaActual}`
                },
                contentType: "application/json; charset=utf-8"
            }
        }
    });

    $("#cmbEtapas").data("kendoComboBox").setDataSource(dse);

    $("#cmbEtapas").data("kendoComboBox").bind("select", function (e) {
        let dataItem = this.dataItem(e.item.index());
        EsAnterior = dataItem.EtapaAnterior;
        if (EsAnterior == 0) {
            $('#TxtMotivoEtapa').val("");
            $('#TxtMotivoEtapa').prop('readonly', true);
        }
        else
        {
            $('#TxtMotivoEtapa').prop('readonly', false);
        }
    });

    $("#btnCambiarEtapaOD").on("click", function () {
        if (EsAnterior == 0) {
            if ($("#cmbEtapas").data("kendoComboBox").selectedIndex >= 0) {

                $.ajax({
                    url: TSM_Web_APi + "DespachosMercancias/CambioEtapaOrdenDespacho",
                    data: JSON.stringify({
                        IdDespachoMercancia: IdDespachoMercancia,
                        IdEtapaActual: IdEtapaActual,
                        IdEtapaSiguiente: KdoCmbGetValue($("#cmbEtapas")),
                        Id: null,
                        Motivo: "Cambio de etapa de " + NombreEA + " a " + KdoCmbGetText($("#cmbEtapas"))
                    }),
                    type: "POST",
                    dataType: "json",
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $("#vCambioEtapa").data("kendoWindow").close();
                        $("#kendoNotificaciones").data("kendoNotification").show("Cambio de etapa exitoso", "success");
                    },
                    error: function (data) {
                        VistaCambioEsta.data("kendoDialog").close();
                        kendo.ui.progress($("#TxtMotivo"), false);
                        ErrorMsg(data);
                        Realizocambio = false;
                        kendo.ui.progress($(".k-dialog"), false);
                    }

                });

            }
            else
            {
                $("#kendoNotificaciones").data("kendoNotification").show("Elija una etapa válida", "error");
            }
        }
        else
        {
            if ($("#cmbEtapas").data("kendoComboBox").selectedIndex >= 0) {
                if ($('#TxtMotivoEtapa').val() != "" && $('#TxtMotivoEtapa').val() != null) {
                    $.ajax({
                        url: TSM_Web_APi + "DespachosMercancias/CambioEtapaOrdenDespacho",
                        data: JSON.stringify({
                            IdDespachoMercancia: IdDespachoMercancia,
                            IdEtapaActual: IdEtapaActual,
                            IdEtapaSiguiente: KdoCmbGetValue($("#cmbEtapas")),
                            Id: null,
                            Motivo: $('#TxtMotivoEtapa').val()
                        }),
                        type: "POST",
                        dataType: "json",
                        async: false,
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            $("#vCambioEtapa").data("kendoWindow").close();
                            $("#kendoNotificaciones").data("kendoNotification").show("Cambio de etapa exitoso", "success");
                        },
                        error: function (data) {
                            VistaCambioEsta.data("kendoDialog").close();
                            kendo.ui.progress($("#TxtMotivo"), false);
                            ErrorMsg(data);
                            Realizocambio = false;
                            kendo.ui.progress($(".k-dialog"), false);
                        }

                    });
                }
                else
                {
                    $("#kendoNotificaciones").data("kendoNotification").show("Escriba un motivo", "error");
                }
            }
            else {
                $("#kendoNotificaciones").data("kendoNotification").show("Elija una etapa válida", "error");
            }
        }
    });
}