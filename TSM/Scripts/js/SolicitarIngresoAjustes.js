var xaIdOrdenTrabajo = 0;
var xaIdEtapa = 0;
var xaItem = 0;
var xaIdRegistroSolicitudAjuste = 0;
var xaIdSolicitudCambio = 0;
var xaIdSeteo = 0;
var fn_InicializarCargaVistaAjuste = function (siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT) {
    xaIdEtapa = siaIdEtapa;
    xaIdOrdenTrabajo = siaIdot;
    xaItem = siaItem;
    xaIdSeteo = siaIdSeteo;
    KdoComboBoxbyData($("#cmbMotivoAjuste"), "[]", "Nombre", "IdMotivoSolicitudAjuste", "Seleccione...", "", "");
    KdoComboBoxbyData($("#cmbReproceso"), "[]", "Nombre", "IdReproceso", "Seleccione...", "", "");
    KdoMultiSelectDatos($("#MultEstacion"), "[]", "Nombre", "IdEstacion", "Seleccione ...", 100, true);
    $("#cmbCambioSolicitud").ControlSelecionSolicitudesCambiosAjustesTipoOT(SiaIdTipoOT);
    fn_GridAjuste();
    $("#cmbCambioSolicitud").data("kendoMultiColumnComboBox").bind("change", function (e) {
        var multicolumncombobox = $("#cmbCambioSolicitud").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdSolicitudCambio === Number(this.value()));
        if (data !== undefined) {
            fn_insRegistroSolicitudAjuste(this.value());
            $("#cmbReproceso").data("kendoComboBox").setDataSource(get_ReprocesoEtapa(this.value()));
        } else { 
            $("#cmbReproceso").data("kendoComboBox").setDataSource(get_ReprocesoEtapa(0));
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar una solictud de cambio", "error");
        }
    });
    KdoButton($("#btnAjustesSolicitud"), "save", "Solicitar Ajuste");
    KdoButton($("#btnBorraAjustesSolicitud"), "delete", "Borrar");
    KdoButtonEnable($("#btnBorraAjustesSolicitud"), false);

    $("#cmbReproceso").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value !== "") {
            KdoCmbSetValue($("#cmbMotivoAjuste"), "");
            $("#cmbMotivoAjuste").data("kendoComboBox").setDataSource(get_SolicitudAjusteRepro(this.value()));
            $("#MultEstacion").data("kendoMultiSelect").value([""]);
        } else {
            KdoCmbSetValue($("#cmbMotivoAjuste"), "");
            $("#cmbMotivoAjuste").data("kendoComboBox").setDataSource(get_SolicitudAjusteRepro(0));
            $("#MultEstacion").data("kendoMultiSelect").value([""]);
        }
    });


    $("#cmbMotivoAjuste").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value !== "") {
        
            fn_getEstacionesMultiSelect();
        } else {
            $("#MultEstacion").data("kendoMultiSelect").value([""]);
        }
    });

    //#region CRUD Partes multi select

    $("#MultEstacion").data("kendoMultiSelect").bind("deselect", function (e) {
        if (xaIdRegistroSolicitudAjuste> 0) {

            kendo.ui.progress($(document.body), true);
            url = TSM_Web_APi + "RegistroSolicitudAjustesMotivos/DeleteEstacion/" + xaIdRegistroSolicitudAjuste.toString() + "/" + KdoCmbGetValue($("#cmbMotivoAjuste")) + "/" + xaIdSeteo.toString() + "/" + e.dataItem.IdEstacion;
            $.ajax({
                url: url,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($(document.body), false);
                    $("#grid_Ajustes").data("kendoGrid").dataSource.read();
                },
                error: function (data) {
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });

        }

    });

    $("#MultEstacion").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if (xaIdRegistroSolicitudAjuste > 0) {
            kendo.ui.progress($(document.body), true);
            //var item = e.item;
            $.ajax({
                url: TSM_Web_APi + "RegistroSolicitudAjustesMotivos",//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({

                    IdRegistroSolicitudAjuste: xaIdRegistroSolicitudAjuste,
                    IdMotivoSolicitudAjuste: KdoCmbGetValue($("#cmbMotivoAjuste")),
                    ItemSolicitudAjuste: 0,
                    IdSeteo: xaIdSeteo,
                    IdEstacion: e.dataItem.IdEstacion,
                    IdEtapaProceso: xaIdEtapa,
                    IdAreaSolicitante: 1
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
            
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(document.body), false);
                    $("#grid_Ajustes").data("kendoGrid").dataSource.read();
                },
                error: function (data) {
                    fn_getEstacionesMultiSelect();
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin Prendas multi select
    fn_getRegistroSolicitudAjustes(siaIdot, siaIdEtapa, siaItem);
    $("#MultEstacion").data("kendoMultiSelect").setDataSource(get_EstacionesMaquinas(xaIdSeteo));

    $("#btnAjustesSolicitud").click(function () {
        fn_GenerarSolicitud();
    });

    $("#btnBorraAjustesSolicitud").click(function () {
        fn_BorrarSolicitud();
    });


};

var fn_RegistroAjuste = function (siaIdot, siaIdEtapa, siaItem, siaIdSeteo) {
    xaIdEtapa = siaIdEtapa;
    xaIdOrdenTrabajo = siaIdot;
    xaItem = siaItem;
    xaIdSeteo = siaIdSeteo;

    fn_getRegistroSolicitudAjustes(siaIdot, siaIdEtapa, siaItem);
    $("#MultEstacion").data("kendoMultiSelect").setDataSource(get_EstacionesMaquinas(xaIdSeteo));

};

var fn_insRegistroSolicitudAjuste = function (xidSolicitudCambio) {
    kendo.ui.progress($(document.body), true);
    if (xaIdOrdenTrabajo > 0) {
        kendo.ui.progress($(document.body), true);
        $.ajax({
            url: TSM_Web_APi + "RegistroSolicitudAjustes",
            type: "Post",
            dataType: "json",
            data: JSON.stringify({
                IdRegistroSolicitudAjuste: 0,
                IdSolicitudCambio: xidSolicitudCambio,
                ItemSolicitud: 0,
                IdEtapaProceso: xaIdEtapa,
                Item: xaItem,
                IDOrdenTrabajo: xaIdOrdenTrabajo,
                Fecha: Fhoy()
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                RequestEndMsg(data, "Post");
                xaIdRegistroSolicitudAjuste = data[0].IdRegistroSolicitudAjuste;
                KdoMultiColumnCmbEnable($("#cmbCambioSolicitud"), false);
                kendo.ui.progress($(document.body), false);
                KdoButtonEnable($("#btnBorraAjustesSolicitud"), true);
                $("#grid_Ajustes").data("kendoGrid").dataSource.read();
                KdoButtonEnable($("#btnBorraAjustesSolicitud"), true);
                $("#cmbReproceso").data("kendoComboBox").enable(true);
                $("#cmbMotivoAjuste").data("kendoComboBox").enable(true);
                KdoMultiselectEnable($("#MultEstacion"), true);
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
            }
        });
    }
};

var fn_getRegistroSolicitudAjustes = function (siaIdot, siaIdEtapa, siaItem) {
    $.ajax({
        url: TSM_Web_APi + "RegistroSolicitudAjustes/GetByEtapa/" + `${siaIdot}/${siaIdEtapa}/${siaItem}`,
        type: 'GET',
        success: function (resultado) {
            if (resultado.length >0) {
                xaIdRegistroSolicitudAjuste = resultado[0].IdRegistroSolicitudAjuste;
                xaIdSolicitudCambio = resultado[0].IdSolicitudCambio;
                KdoMultiColumnCmbSetValue($("#cmbCambioSolicitud"), resultado[0].IdSolicitudCambio);
                KdoMultiColumnCmbEnable($("#cmbCambioSolicitud"), false);
                KdoCmbSetValue($("#cmbReproceso"), "");
                $("#cmbReproceso").data("kendoComboBox").setDataSource(get_ReprocesoEtapa(resultado[0].IdSolicitudCambio));
                KdoCmbSetValue($("#cmbMotivoAjuste"), "");
                KdoButtonEnable($("#btnBorraAjustesSolicitud"), true);
                $("#cmbReproceso").data("kendoComboBox").enable(true);
                $("#cmbMotivoAjuste").data("kendoComboBox").enable(true);
                KdoMultiselectEnable($("#MultEstacion"), true);
            } else {
                xaIdRegistroSolicitudAjuste = 0;
                xaIdSolicitudCambio = 0;
                KdoMultiColumnCmbSetValue($("#cmbCambioSolicitud"), "");
                KdoMultiColumnCmbEnable($("#cmbCambioSolicitud"), true);
                KdoCmbSetValue($("#cmbReproceso"), "");
                KdoCmbSetValue($("#cmbMotivoAjuste"), "");
                KdoButtonEnable($("#btnBorraAjustesSolicitud"), false);
                $("#cmbReproceso").data("kendoComboBox").enable(false);
                $("#cmbMotivoAjuste").data("kendoComboBox").enable(false);
                KdoMultiselectEnable($("#MultEstacion"), false);
                
            }
            $("#grid_Ajustes").data("kendoGrid").dataSource.read();

        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            xaIdRegistroSolicitudAjuste = 0;
        }
    });
};

var get_ReprocesoEtapa = function (id) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "Reprocesos/GetByEtapaProceso/" + id,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};


var get_SolicitudAjusteRepro = function (id) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "MotivosSolicitudesAjustes/GetByReproceso/" + id,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var get_EstacionesMaquinas = function (id) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "RegistroSolicitudAjustesMotivos/GetbyEstaciones/" + id,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let fn_getEstacionesMultiSelect = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "RegistroSolicitudAjustesMotivos/GetbyMotivo/" + xaIdRegistroSolicitudAjuste + "/" + KdoCmbGetValue($("#cmbMotivoAjuste")),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdEstacion + ",";
            });
            $("#MultEstacion").data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var fn_GenerarSolicitud= function () {
    kendo.ui.progress($(document.activeElement), true);
    $.ajax({
        url: TSM_Web_APi + "/RegistroSolicitudAjustes/GenerarRegistroCambioSolicitudAjustes",//
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdRegistroSolicitudAjuste: xaIdRegistroSolicitudAjuste,
            IdOrdenTrabajo: xaIdOrdenTrabajo,
            IdSolicitudCambio: xaIdSolicitudCambio,
            NombreTipoCambio: $("#cmbCambioSolicitud").data("kendoMultiColumnComboBox").text(),
            ItemSolicitud: 0,
            IdEtapa: xaIdEtapa,
            Motivo: "AJUSTE POR SOLICITUD DE CAMBIO",
            IdUsuario: getUser()
          
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Post");
            kendo.ui.progress($(document.activeElement), false);
            window.location.href = "/EtapasOrdenesTrabajos";
            //kendo.ui.progress($("#vAlertaAjustes"), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.activeElement), false);
            ErrorMsg(data);
        }
    });

};


var fn_BorrarSolicitud = function () {
    //kendo.ui.progress($("#vSoliIngresoAjuste"), true);
    $.ajax({
        url: TSM_Web_APi + "/RegistroSolicitudAjustes/" + xaIdRegistroSolicitudAjuste.toString() ,//
        type: "Delete",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Delete");
            $("#cmbMotivoAjuste").data("kendoComboBox").setDataSource(get_SolicitudAjusteRepro(0));
            $("#MultEstacion").data("kendoMultiSelect").value([""]);
            $("#cmbReproceso").data("kendoComboBox").setDataSource(get_ReprocesoEtapa(0));
            KdoMultiColumnCmbSetValue($("#cmbCambioSolicitud"), "");
            KdoMultiColumnCmbEnable($("#cmbCambioSolicitud"), true);
            KdoCmbSetValue($("#cmbReproceso"), "");
            KdoCmbSetValue($("#cmbMotivoAjuste"), "");
            KdoButtonEnable($("#btnBorraAjustesSolicitud"), false);
            $("#grid_Ajustes").data("kendoGrid").dataSource.read();
        },
        error: function (data) {
            //kendo.ui.progress($("#vSoliIngresoAjuste"), false);
            ErrorMsg(data);
        }
    });

};

fn_GridAjuste = function () {

    var dsetAjusteEst = new kendo.data.DataSource({

        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RegistroSolicitudAjustesMotivos/GetConsulta/" + xaIdRegistroSolicitudAjuste; },
                dataType: "json",
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
        group: {
            field: "MotivoAjuste"
        },
        schema: {
            model: {
                id: "IdMotivoSolicitudAjuste",
                fields: {
                    IdMotivoSolicitudAjuste: { type: "number" },
                    MotivoAjuste: { type: "string" },
                    IdEstacion: { type: "number" },
                    Nombre: { type: "string" }
                }
            }
        }

    });
    //CONFIGURACION DEL gCHFor,CAMPOS

    $("#grid_Ajustes").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            //{ selectable: true, width: "50px" },
            { field: "IdMotivoSolicitudAjuste", title: "Cod.Motivo", hidden: true },
            { field: "MotivoAjuste", title: "Motivo ", hidden: true  },
            { field: "IdEstacion", title: "Cod.Estacion", hidden: true },
            { field: "Nombre", title: "Estación" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#grid_Ajustes").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 350);
    SetGrid_CRUD_ToolbarTop($("#grid_Ajustes").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid_Ajustes").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid_Ajustes").data("kendoGrid"), dsetAjusteEst);

    var srowAjuste= [];
    $("#grid_Ajustes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid_Ajustes"), srowAjuste);
    });

    $("#grid_Ajustes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid_Ajustes"), srowAjuste);


    });


};

