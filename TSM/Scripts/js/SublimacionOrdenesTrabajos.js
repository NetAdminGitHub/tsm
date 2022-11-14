
let UrlClie = TSM_Web_APi + "Clientes";
var Permisos;
let VIdCliente = 0;
let idOrden = 0;
let idPro = 0;
let data;
let obj_Pro;
let obj_OT;
$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("sot_CmbIdCliente") === null ? "" : sessionStorage.getItem("sot_CmbIdCliente"));    

    $("#CmbPrograma").ControlSelecionProg();
    if (sessionStorage.sot_CmbPrograma !== undefined && sessionStorage.sot_CmbPrograma !== "") {
        fn_multiColumnSetJson($("#CmbPrograma"), sessionStorage.sot_CmbPrograma, JSON.parse(sessionStorage.sot_CmbPrograma).IdPrograma);
        obj_Pro = JSON.parse(sessionStorage.sot_CmbPrograma);
    }

    KdoButton($("#btnEliminaFiltros"), "filter-clear", "Borrar todos los filtros");

    $("#CmbOrdenTrabajo").CSRequerimeintoSubli();
    //*** buscar ot y asignar filtro**/
    if (sessionStorage.sot_CmbOrdenTrabajo !== undefined && sessionStorage.sot_CmbOrdenTrabajo !== "") {
        fn_multiColumnSetJson($("#CmbOrdenTrabajo"), sessionStorage.sot_CmbOrdenTrabajo, JSON.parse(sessionStorage.sot_CmbOrdenTrabajo).IdRequerimiento);
        obj_OT = JSON.parse(sessionStorage.sot_CmbOrdenTrabajo);
    }

    KdoButton($("#btnNuevoRegistro"), "edit", "Nuevo Registro");
    KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));

    $("#btnNuevoRegistro").click(function () {
        if (KdoCmbGetValue($("#CmbIdCliente")) !== null) {
            window.location.href = "/SublimacionOrdenesTrabajos/SublimacionRegistro/" + KdoCmbGetValue($("#CmbIdCliente")).toString() + "/" + 0;
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un cliente", "error");
        }
        
    });


    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION

    var DsRD = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollos/GetRequerimientoDesarrollos_SublimacionOrdenesTrabajosConsulta/" + VIdCliente + "/" + idOrden + "/" + idPro; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdRequerimiento",
                fields: {
                    IdRequerimiento: { type: "number" },
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    IdPrograma: { type: "number" },
                    Nombre2: { type: "string" },
                    NoDocumento: { type: "string" },
                    IdServicio: { type: "number" },
                    Nombre: { type: "string" },
                    //IdUbicacion: { type: "number" },
                    NoDocumento1: { type: "string" },
                    //UbicacionHorizontal: { type: "string" },
                    //UbicacionVertical: { type: "string" },
                    CantidadPiezas: { type: "number" },
                    TallaPrincipal: { type: "string" },
                    Estado: { type: "string" },
                    Nombre3: { type: "string" },
                    Fecha: { type: "date" },
                    InstruccionesEspeciales: { type: "string" },
                    Nombre1: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    IdCategoriaConfeccion: { type: "number" },
                    Nombre4: { type: "string" },
                    IdConstruccionTela: { type: "number" },
                    Nombre5: { type: "string" },
                    IdComposicionTela: { type: "number" },
                    Nombre8: { type: "string" },
                    Color: { type: "string" },
                    RegistroCompletado: { type: "bool" }
                }
            }
        }
    });

    $("#gridConsulta").kendoGrid({
        autoBind: false,
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                window.location.href = "/SublimacionOrdenesTrabajos/SublimacionRegistro/" + grid.dataItem(this).IdCliente.toString() + "/" + grid.dataItem(this).IdRequerimiento.toString();
            });
            Grid_SetSelectRow($("#gridConsulta"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true },
            {
                field: "NoDocumento", title: "No requerimiento", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Fecha", title: "Fecha requerimiento", format: "{0: dd/MM/yyyy}", filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Nombre1", title: "Nombre del diseño", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "EstiloDiseno", title: "Estilo diseño", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NumeroDiseno", title: "Número diseño", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "IdPrograma", title: "Código de programa", hidden: true },
     
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "Nombre", title: "Servicio", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Detalle de tallas", hidden: true },
            { field: "Estado", title: "Código Estado", hidden: true },
            {
                field: "NoDocumento1", title: "Código programa", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Nombre2", title: "Nombre del programa", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Nombre3", title: "Estado", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["Nombre3"] + "</button>";
                },
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "InstruccionesEspeciales", title: "Instrucciones Especiales", hidden: true },
            { field: "IdCategoriaConfeccion", title: "Código categoria confeccion", hidden: true, menu: false },
            { field: "Nombre4", title: "Confección", hidden: true },
            { field: "IdConstruccionTela", title: "Código construcción tela", hidden: true, menu: false },
            { field: "IdComposicionTela", title: "Código composición tela", hidden: true, menu: false },
            { field: "Nombre5", title: "composición tela", hidden: true },
            { field: "Color", title: "Color", hidden: true }

        ]
    });

    //SetGrid($("#gridConsulta").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 600);
    SetGrid($("#gridConsulta").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 600, true, "row");
    SetGrid_CRUD_ToolbarTop($("#gridConsulta").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridConsulta").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridConsulta").data("kendoGrid"), DsRD);

    var selectedRows = [];
    $("#gridConsulta").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridConsulta"), selectedRows);
    });


    //#endregion FIN GRID PRINCIPAL

    //#region seleccion de servicio y cliente


    $("#CmbIdCliente").data("kendoComboBox").bind("change", function () {
        var colum = $("#CmbIdCliente").data("kendoComboBox");
        let data = colum.listView.dataSource.data().find(q => q.IdCliente === Number(this.value()));
        if (data === undefined) {
            //limpiar filtros
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
            sessionStorage.setItem('sot_CmbPrograma', "");
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('sot_CmbOrdenTrabajo', "");

            fn_ConsultarOTSublimacion(0, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));
            sessionStorage.setItem("sot_CmbIdCliente", "");

        } else {
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
            sessionStorage.setItem('sot_CmbPrograma', "");
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('sot_CmbOrdenTrabajo', "");
            fn_ConsultarOTSublimacion(this.value(), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
            sessionStorage.setItem("sot_CmbIdCliente", this.value());
        }
    });


    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            //limpiar filtros
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('sot_CmbOrdenTrabajo', "");

            fn_ConsultarOTSublimacion(
                KdoCmbGetValue($("#CmbIdCliente")),
                KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                0
            );
            sessionStorage.setItem("sot_CmbPrograma", "");
            KdoButtonEnable($("#btnNuevoRegistro"), KdoCmbGetValue($("#CmbIdCliente")) === null ? false : fn_SNAgregar(true));
      
        } else {
            KdoCmbSetValue($("#CmbIdCliente"), data.IdCliente);
            sessionStorage.setItem("sot_CmbIdCliente", data.IdCliente);
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('sot_CmbOrdenTrabajo', "");

            fn_ConsultarOTSublimacion(
                KdoCmbGetValue($("#CmbIdCliente")),
                KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                data.IdPrograma
            );

            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
            sessionStorage.setItem("sot_CmbPrograma", JSON.stringify(data.toJSON()));
        }

    });



    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdRequerimiento === Number(this.value()));
        if (data === undefined) {
            //limpiar filtros

            fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), 0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            KdoButtonEnable($("#btnNuevoRegistro"), KdoCmbGetValue($("#CmbIdCliente"))===null? false: fn_SNAgregar(true));
            sessionStorage.setItem("sot_CmbOrdenTrabajo", "");

        } else {
     
            if (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null) { fn_SetValueMulticolumIdProgramaCfd($("#CmbPrograma"), data.IdPrograma); }
            KdoCmbSetValue($("#CmbIdCliente"), data.IdCliente);
            sessionStorage.setItem("sot_CmbIdCliente", data.IdCliente);

            fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), data.IdRequerimiento, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
            sessionStorage.setItem("sot_CmbOrdenTrabajo", JSON.stringify(data.toJSON()));
        }

    });
    //Coloca el filtro de cliente guardado en la sesion
    if (sessionStorage.getItem("sot_CmbIdCliente") !== null || sessionStorage.getItem("sot_CmbIdCliente") !== "" ||
        sessionStorage.getItem("sot_CmbOrdenTrabajo") !== null || sessionStorage.getItem("sot_CmbOrdenTrabajo") !== "" ||
        sessionStorage.getItem("sot_CmbPrograma") !== null || sessionStorage.getItem("sot_CmbPrograma") !== ""
        ) {
        fn_ConsultarOTSublimacion(
            sessionStorage.getItem("sot_CmbIdCliente"),
            obj_OT === "" || obj_OT === undefined ? 0 : obj_OT.IdRequerimiento,
            obj_Pro === "" || obj_Pro === undefined ? 0 : obj_Pro.IdPrograma,
        );
        KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
    }
    //#endregion

    $("#btnEliminaFiltros").click(function (event) {
        //limpiar filtros
        KdoCmbSetValue($("#CmbIdCliente"), "");
        sessionStorage.setItem("sot_CmbIdCliente", "");
        KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
        sessionStorage.setItem('sot_CmbPrograma', "");
        KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
        sessionStorage.setItem('sot_CmbOrdenTrabajo', "");

        fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")));
        KdoButtonEnable($("#btnNuevoRegistro"), false);

    });
});

$.fn.extend({
    ControlSelecionProg: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Programas/GetProgramasFiltroCliente/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 },
                    { field: "NombreTemporada", title: "Temporada", width: 300 }
                ]
            });
        });
    }
});

$.fn.extend({
    CSRequerimeintoSubli: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdRequerimiento",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                valuePrimitive: true,
                placeholder: "Selección de Ordenes de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "RequerimientoDesarrollos/GetSubliConsulta/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 }

                ]
            });
        });
    },
});


// obtiene el programa y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdProgramaCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('sot_CmbPrograma', JSON.stringify(data[0]));
        }
    });
}
// obtiene la orden de trabajo y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdOTCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('sot_CmbOrdenTrabajo', JSON.stringify(data[0]));
        }
    });
}

let fn_ConsultarOTSublimacion = function (IdCliente, xIdOrden, xIdPro) {
    kendo.ui.progress($("#splitter"), true);
    VIdCliente = Number(IdCliente);
    idOrden = Number(xIdOrden);
    idPro = Number(xIdPro);
    //leer grid
    $("#gridConsulta").data("kendoGrid").dataSource.data([]);
    $("#gridConsulta").data("kendoGrid").dataSource.read().then();
};
var fPermisos = function (datos) {
    Permisos = datos;
};
let fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};
let fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};
let fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};
let fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};
let fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};
