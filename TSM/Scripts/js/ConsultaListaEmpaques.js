let UrlPL = TSM_Web_APi + "ListaEmpaques";

let pIdCliente = 0;
let pIdDespachoMercancia = 0;
let pIdPlanta = 0;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");
    $("#cmbOD").ControlSeleccionOD(0, 0);

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource([]);
        }
        else {
            getPLS();
        }
    });

    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        let cliente = this.dataItem(e.item.index()).IdCliente;
        let planta = KdoCmbGetValue($("#cmbPlanta"));

        if (e.item) {
            if (planta == "" || planta == 0 || planta == undefined || planta == null) {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, 0));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            }
            else
            {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, planta));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");  
            }
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            let cliente = KdoCmbGetValue($("#cmbCliente"));
            KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            if (cliente != "" && cliente != 0 && cliente != undefined && cliente != null) {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, 0));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            }
        }
        else
        {
            getPLS();
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("select", function (e) {
        let cliente = KdoCmbGetValue($("#cmbCliente"));
        let planta = this.dataItem(e.item.index()).IdPlanta;

        if (e.item) {
            if (cliente != "" && cliente != 0 && cliente != undefined && cliente != null) {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, planta));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            }
        }
    });

    $("#cmbOD").data("kendoMultiColumnComboBox").bind("change", function (e) {
        var value = this.value();
        if (value !== "") {
            getPLS();
        }
    });

    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: UrlPL + "/GetListaEmpaques",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        IdCliente: pIdCliente,
                        IdDespachoMercancia: pIdDespachoMercancia,
                        IdPlanta: pIdPlanta
                    }),
                    success: function (result) {
                        datos.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdListaEmpaque",
                fields: {
                    IdListaEmpaque: { type: "number" },
                    NoDespacho: { type: "string" },
                    FechaCreacion: { type: "date" },
                    NoDocumento: { type: "string" },
                    CantidadCortes: { type: "number" },
                    CantidadTotal: { type: "number" },
                    FechaMod: { type: "date" },
                    Servicios: { type: "string" },
                    Estado: { type: "string" },
                    IdUsuario: { type: "string" },
                    Observacion: { type: "string" },
                }
            }
        },
        sort: { field: "FechaCreacion", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridListaEmpaques").kendoGrid({
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdListaEmpaque", title: "ID", hidden: true },
            { field: "NoDespacho", title: "Número Despacho" },
            { field: "FechaCreacion", title: "Fecha Creación", format: "{0: dd/MM/yyyy}" },
            { field: "CantidadCortes", title: "Cantidad Cortes" },
            { field: "CantidadTotal", title: "Cantidad Total" },
            { field: "Servicios", title: "Servicios" },
            { field: "Estado", title: "Estado" },
            { field: "Observacion", title: "Observacion" },
            { field: "IdUsuario", title: "Usuario", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy}", hidden: true },
            {//Opcion para modificar/editar despacho
                field: "btnPrint",
                title: "&nbsp;",
                command: {
                    name: "btnPrint",
                    iconClass: "k-icon k-i-print m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                       
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            },
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridListaEmpaques").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#gridListaEmpaques").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridListaEmpaques").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridListaEmpaques").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridListaEmpaques").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridListaEmpaques"), selectedRows);
    });

    $("#gridListaEmpaques").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridListaEmpaques"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridListaEmpaques"), $(window).height() - "330");
    });

    Fn_Grid_Resize($("#gridListaEmpaques"), $(window).height() - "330");

});

let getODS = (cliente, planta) => {
    return new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "DespachosMercancias/GetOrdenesDespachar/" + cliente + "/" + planta + "/" + 0,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let getPLS = () => {
    let tempC = KdoCmbGetValue($("#cmbCliente"));
    let tempP = KdoCmbGetValue($("#cmbPlanta"));
    let tempOD = KdoMultiColumnCmbGetValue($("#cmbOD"));

    if (tempC != "" && tempC != 0 && tempC != undefined && tempC != null &&
        tempP != "" && tempP != 0 && tempP != undefined && tempP != null &&
        tempOD != "" && tempOD != 0 && tempOD != undefined && tempOD != null)
    {
        pIdCliente = KdoCmbGetValue($("#cmbCliente"));
        pIdDespachoMercancia = KdoMultiColumnCmbGetValue($("#cmbOD"));
        pIdPlanta = KdoCmbGetValue($("#cmbPlanta"));
        $("#gridListaEmpaques").data("kendoGrid").dataSource.read();
    }
};

fPermisos = function (datos) {
    Permisos = datos;

}