let vIdEtapaOrigen;
let vItemOrigen;
let Url_upd = TSM_Web_APi + "OrdenesTrabajosAgendas/Actualizar";
let Url_Del = TSM_Web_APi + "OrdenesTrabajosAgendas/Eliminar";
let permiteEdit = false;
var fn_InicializarAgenda = function (vIdOt,vIdEtapa,vItem) {
    vIdEtapaOrigen = vIdEtapa;
    vItemOrigen = vItem;
    permiteEdit = !estadoPermiteEdicion || EtpSeguidor === true || EtpAsignado === false ? false : true;
    var dsetOTEstados = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                //kendo.ui.progress($("#gridAgenda"), true);
                $.ajax({
                    type: "get",
                    dataType: 'json',
                    //data: kendo.stringify(datos.data.models),
                    url: TSM_Web_APi + "OrdenesTrabajosAgendas/GetByIdOrdenTrabajo/" + vIdOt.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //kendo.ui.progress($("#gridAgenda"), false);
                        datos.success(result);
                    },
                    error: function (result) {
                        // notify the data source that the request failed
                        datos.error(result);
                    }
                });
            },
            update: function (datos) {
                kendo.ui.progress($("#gridAgenda"), true);
                $.ajax({
                    type: "post",
                    dataType: 'json',
                    data: kendo.stringify({
                        IdOrdenTrabajo: datos.data.models[0].IdOrdenTrabajo,
                        Fecha: kendo.toString(kendo.parseDate(datos.data.models[0].Fecha), 'dd/MM/yyyy HH:mm:ss.fff'),
                        Comentario: datos.data.models[0].Comentario,
                        IdUsuario: getUser(),
                        IdEtapaProcesoOrigen: vIdEtapaOrigen,
                        ItemEtapaOrigen: vItemOrigen,
                        IdDepartamento: datos.data.models[0].IdDepartamento
                    }),
                    url: Url_upd,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($("#gridAgenda"), false);
                        datos.success(result);

                    },
                    error: function (result) {
                        // notify the data source that the request failed
                        kendo.ui.progress($("#gridAgenda"), false);
                        ErrorMsg(result);
                        datos.error(result);
                    }
                });
            },
            destroy: function (datos) {
                    kendo.ui.progress($("#gridAgenda"), true);
                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        data: kendo.stringify({
                            IdOrdenTrabajo: datos.data.models[0].IdOrdenTrabajo,
                            Fecha: kendo.toString(kendo.parseDate(datos.data.models[0].Fecha), 'dd/MM/yyyy HH:mm:ss.fff'),
                            Comentario: datos.data.models[0].Comentario,
                            IdUsuario: getUser(),
                            IdEtapaProcesoOrigen: vIdEtapaOrigen,
                            ItemEtapaOrigen: vItemOrigen,
                            IdDepartamento: datos.data.models[0].IdDepartamento
                        }),
                        url: TSM_Web_APi + "OrdenesTrabajosAgendas/Eliminar",
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            kendo.ui.progress($("#gridAgenda"), false);
                            datos.success(result);
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            $("#gridAgenda").data("kendoGrid").dataSource.read()
                            kendo.ui.progress($("#gridAgenda"), false);
                            ErrorMsg(result);
                            datos.error(result);
                        }
                    });
                
            },
            create: function (datos) {
                kendo.ui.progress($("#gridAgenda"), true);
                $.ajax({
                    type: "post",
                    dataType: 'json',
                    data: kendo.stringify({
                        IdOrdenTrabajo: datos.data.models[0].IdOrdenTrabajo,
                        Fecha: kendo.toString(kendo.parseDate(datos.data.models[0].Fecha), 'dd/MM/yyyy HH:mm:ss.fff'),
                        Comentario: datos.data.models[0].Comentario,
                        IdUsuario: datos.data.models[0].IdUsuario,
                        IdEtapaProcesoOrigen: datos.data.models[0].IdEtapaProcesoOrigen,
                        ItemEtapaOrigen: datos.data.models[0].ItemEtapaOrigen,
                        IdDepartamento: datos.data.models[0].IdDepartamento
                    }),
                    url: TSM_Web_APi + "OrdenesTrabajosAgendas/Insertar",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($("#gridAgenda"), false);
                        datos.success(result);
                    },
                    error: function (result) {
                        // notify the data source that the request failed
                        kendo.ui.progress($("#gridAgenda"), false);
                        ErrorMsg(result);
                        datos.error(result);
                    }
                });

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "create" || e.type == "update" ) { $("#gridAgenda").data("kendoGrid").dataSource.read(); }

        },
        batch: true,
        schema: {
            model: {
                id: "Fecha",
                fields: {
                    IdOrdenTrabajo: {
                        type: "number", defaultValue: function () { return vIdOt; }
                    },
                    Fecha: { type: "date" },
                    Comentario: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdDepartamento']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdDepartamento").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Comentario']") ) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return input.val().length <= 2000 && input.val().length > 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdUsuario: { type: "string", defaultValue: function () { return getUser(); } },
                    UsuarioNombre: { type: "string" },
                    IdEtapaProcesoOrigen: { type: "number", defaultValue: function () { return vIdEtapaOrigen; } },
                    EtapaNombreOrigen: { type: "string" },
                    EtapaNombreDestino: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    ItemEtapaOrigen: { type: "number", defaultValue: function () { return vItemOrigen; } },
                    IdDepartamento: { type: "string" },
                    NomDepto: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gridAgenda").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdOrdenTrabajo");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Fecha");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuario");
            KdoHideCampoPopup(e.container, "IdEtapaProcesoOrigen");
            KdoHideCampoPopup(e.container, "EtapaNombreOrigen");
            KdoHideCampoPopup(e.container, "NomDepto");
            KdoHideCampoPopup(e.container, "UsuarioNombre");
            KdoHideCampoPopup(e.container, "ItemEtapaOrigen");
            Grid_Focus(e, "IdDepartamento");
 
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdOrdenTrabajo", title: "Orden de Trabajo", hidden: true, menu: false },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.fff}", width: 200 },
            { field: "IdDepartamento", title: "Departamento", values: ["IdDepartamento", "Nombre", TSM_Web_APi + "Departamentos", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "NomDepto", title: "Departamento", width: 200 },
            { field: "Comentario", title: "Comentario",  editor: Grid_ColTextArea, values: ["6"] },
            { field: "IdEtapaProcesoOrigen", title: "Etapa Proceso Origen", hidden: true },
            { field: "ItemEtapaOrigen", title: "Item Etapa", width: 200, hidden: true },
            { field: "EtapaNombreOrigen", title: "Etapa Nombre Origen", hidden: true },
            { field: "IdUsuario", title: "Usuario", width: 100, hidden: true },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", width: 200, hidden: true },
            { field: "UsuarioNombre", title: "Nombre de Usuario"},
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.fff}", width: 160, hidden: true }
        ],
        dataBound: function (e) {
            $("#txtTotalComentarios").text(e.sender.dataSource.total());
        }
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridAgenda").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridAgenda").data("kendoGrid"), Permisos.SNAgregar && xEstadoOT !== 'CANCELADA' && xEstadoOT !== 'TERMINADO');
    SetGrid_CRUD_Command($("#gridAgenda").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridAgenda").data("kendoGrid"), dsetOTEstados, 10);

    var selrow1 = [];
    $("#gridAgenda").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridAgenda"), selrow1);
    });

    $("#gridAgenda").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridAgenda"), selrow1);
    });

    Grid_HabilitaToolbar($("#gridAgenda"), permiteEdit, permiteEdit, permiteEdit);
};

var fn_CargarAgenda = function (vIdOt, vIdEtapa,vItem) {
    vIdEtapaOrigen = vIdEtapa;
    vItemOrigen = vItem;
    $("#gridAgenda").data("kendoGrid").dataSource.read();

    permiteEdit = !estadoPermiteEdicion || EtpSeguidor === true || EtpAsignado === false ? false : true;
    Grid_HabilitaToolbar($("#gridAgenda"), permiteEdit, permiteEdit, permiteEdit);
  

};