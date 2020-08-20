
let UrlClie = TSM_Web_APi + "Clientes";
var Permisos;
let VIdCliente = 0;
let data;
$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente") === null ? "" : sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente"));    

    KdoButton($("#btnNuevoRegistro"), "edit", "Nuevo Registro");
    KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));

    $("#btnNuevoRegistro").click(function () {
        window.location.href = "/SublimacionOrdenesTrabajos/SublimacionRegistro/" + KdoCmbGetValue($("#CmbIdCliente")).toString() + "/" + 0;
    });


    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION

    var DsRD = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollos/GetRequerimientoDesarrollos_SublimacionOrdenesTrabajosConsulta/" + VIdCliente; },
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
                    IdUbicacion: { type: "number" },
                    NoDocumento1: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    UbicacionVertical: { type: "string" },
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
                    RegistroCompletado: {type:"bool"}
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
            { field: "NoDocumento", title: "No requerimiento" },
            { field: "Fecha", title: "Fecha requerimiento", format: "{0: dd/MM/yyyy}" },
            { field: "Nombre1", title: "Nombre del diseño" },
            { field: "EstiloDiseno", title: "Estilo diseño" },
            { field: "NumeroDiseno", title: "Número diseño" },
            { field: "IdPrograma", title: "Código de programa", hidden: true },
            { field: "Nombre2", title: "Nombre del programa", hidden: true },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "Nombre", title: "Servicio", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicacion horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Detalle de tallas", hidden: true },
            { field: "Estado", title: "Código Estado", hidden: true },
            {
                field: "Nombre3", title: "Estado", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["Nombre3"] + "</button>";
                }
            },
            { field: "InstruccionesEspeciales", title: "Instrucciones Especiales", hidden: true },
            { field: "IdCategoriaConfeccion", title: "Código categoria confeccion", hidden: true, menu: false },
            { field: "Nombre4", title: "Confección", hidden: true },
            { field: "IdConstruccionTela", title: "Código construcción tela", hidden: true, menu: false },
            { field: "IdComposicionTela", title: "Código composición tela", hidden: true, menu: false },
            { field: "Nombre5", title: "composición tela", hidden: true },
            { field: "Color", title: "Color", hidden: true },
            { field: "RegistroCompletado", title: "Registro Completado", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "RegistroCompletado"); }, hidden: true,  }

        ]
    });

    SetGrid($("#gridConsulta").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 600);
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
            Fn_ConsultarSimu(this.dataItem(e.item.index()).IdCliente.toString());
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
        } else {
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", "");
            Fn_ConsultarSimu(0);
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            sessionStorage.setItem("SublimacionOrdenesTrabajos_CmbIdCliente", "");
            Fn_ConsultarSimu(0);
            KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(false));
        }
    });

    //Coloca el filtro de cliente guardado en la sesion
    if (sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente") !== null) {
        Fn_ConsultarSimu(sessionStorage.getItem("SublimacionOrdenesTrabajos_CmbIdCliente"));
        KdoButtonEnable($("#btnNuevoRegistro"), fn_SNAgregar(true));
    }
    //#endregion
});


let Fn_ConsultarSimu = function (IdCliente) {
    kendo.ui.progress($("#splitter"), true);
    VIdCliente = Number(IdCliente);
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
