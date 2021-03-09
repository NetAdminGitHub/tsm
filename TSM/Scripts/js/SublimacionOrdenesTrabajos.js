
let UrlClie = TSM_Web_APi + "Clientes";
var Permisos;
let VIdCliente = 0;
let idOrden = 0;
let idPro = 0;
let data;
$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente") === null ? "" : sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente"));    

    $("#CmbPrograma").ControlSelecionPrograma();
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbPrograma") === null ? "" : sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbPrograma"));

    $("#CmbOrdenTrabajo").ControlSeleccionRequerimeintoSubli();
    KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo") === null ? "" : sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo")); 

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

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", this.dataItem(e.item.index()).IdCliente.toString());
            fn_ConsultarOTSublimacion(this.dataItem(e.item.index()).IdCliente.toString(), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
        } else {
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", "");
            fn_ConsultarOTSublimacion(0,0,0);
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", "");
            fn_ConsultarOTSublimacion(0,KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ConsultarOTSublimacion(this.dataItem(e.item.index()).IdCliente, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), this.dataItem(e.item.index()).IdPrograma);
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", this.dataItem(e.item.index()).IdCliente.toString());
            KdoCmbSetValue($("#CmbIdCliente"), this.dataItem(e.item.index()).IdCliente);
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
        } else {
            fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), 0);
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbPrograma", "");
            KdoButtonEnable($("#btnNuevoRegistro"), KdoCmbGetValue($("#CmbIdCliente")) === null ? false : fn_SNAgregar(true));
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")), 0);
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbPrograma", "");
            KdoButtonEnable($("#btnNuevoRegistro"), KdoCmbGetValue($("#CmbIdCliente")) === null ? false : fn_SNAgregar(true));
        }

    });


    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ConsultarOTSublimacion(this.dataItem(e.item.index()).IdCliente, this.dataItem(e.item.index()).IdRequerimiento, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")) );
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo", this.dataItem(e.item.index()).IdRequerimiento);
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", this.dataItem(e.item.index()).IdCliente);

            KdoCmbSetValue($("#CmbIdCliente"), this.dataItem(e.item.index()).IdCliente);
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));

        } else {
            fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), 0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo", "");
            KdoButtonEnable($("#btnNuevoRegistro"), KdoCmbGetValue($("#CmbIdCliente"))===null? false: fn_SNAgregar(true));
        }
    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdRequerimiento === Number(this.value()));
        if (data === undefined) {
            fn_ConsultarOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")), 0, KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo", "");
            KdoButtonEnable($("#btnNuevoRegistro"), KdoCmbGetValue($("#CmbIdCliente")) === null ? false : fn_SNAgregar(true));
        }

    });


    //Coloca el filtro de cliente guardado en la sesion
    if (sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente") !== null || sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente") !== "" ||
        sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo") !== null || sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo") !== "" ||
        sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbPrograma") !== null || sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbPrograma") !== ""
        ) {
        fn_ConsultarOTSublimacion(sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente"), sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbOrdenTrabajo"), sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbPrograma"));
        KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
    }
    //#endregion
});


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
