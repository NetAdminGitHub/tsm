let vIdEtapaOrigen;
var fn_InicializarAgenda = function (vIdOt,vIdEtapa) {
    vIdEtapaOrigen = vIdEtapa;
    var dsetOTEstados = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "OrdenesTrabajosAgendas/GetByIdOrdenTrabajo/" + vIdOt.toString();
                },
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "OrdenesTrabajosAgendas",
                dataType: "json",
                type: "POST",
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
            if (e.type === "create") { $("#gridAgenda").data("kendoGrid").dataSource.read(); }

        },
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
                                if (input.is("[name='IdEtapaProcesoDestino']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdEtapaProcesoDestino").data("kendoComboBox").selectedIndex >= 0;
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
                    IdEtapaProcesoDestino: { type: "string" },
                    EtapaNombreDestino: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }

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
            KdoHideCampoPopup(e.container, "EtapaNombreDestino");
            KdoHideCampoPopup(e.container, "UsuarioNombre");
            Grid_Focus(e, "IdEtapaProcesoDestino");
 
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdOrdenTrabajo", title: "Orden de Trabajo", hidden: true, menu: false },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", width: 200 },
            { field: "IdEtapaProcesoDestino", title: "Etapa", values: ["IdEtapaProceso", "Nombre", TSM_Web_APi + "EtapasProcesos/GetEtapasProcesosActivas/2", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "EtapaNombreDestino", title: "Departamento", width: 200 },
            { field: "Comentario", title: "Comentario",  editor: Grid_ColTextArea, values: ["6"] },
            { field: "IdEtapaProcesoOrigen", title: "Etapa Proceso Origen", hidden: true},
            { field: "EtapaNombreOrigen", title: "Etapa Nombre Origen", hidden: true },
            { field: "IdUsuario", title: "Usuario", width: 100 },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", width: 200, hidden: true },
            { field: "UsuarioNombre", title: "Usuario Nombre", hidden: true},
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", width: 160, hidden: true }
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridAgenda").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 450);
    SetGrid_CRUD_ToolbarTop($("#gridAgenda").data("kendoGrid"), Permisos.SNAgregar && xEstadoOT !== 'CANCELADA' && xEstadoOT !== 'TERMINADO');
    SetGrid_CRUD_Command($("#gridAgenda").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridAgenda").data("kendoGrid"), dsetOTEstados, 20);

    var selrow1 = [];
    $("#gridAgenda").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridAgenda"), selrow1);
    });

    $("#gridAgenda").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridAgenda"), selrow1);
    });
};

var fn_CargarAgenda = function (vIdOt, vIdEtapa) {
    vIdEtapaOrigen = vIdEtapa;
    $("#gridAgenda").data("kendoGrid").dataSource.read();

};