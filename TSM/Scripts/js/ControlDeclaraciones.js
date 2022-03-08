"use strict"
var Permisos;
let xidclie = 0;
$(document).ready(function () {

    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    // crear boton ingreso de declaracion
    KdoButton($("#btnIngresarDeclaracion"), "plus-outline", "Ingresar Mercancía");
    // crear boton importar excel
    KdoButton($("#btnImportarExcel"), "plus-outline", "Ingresar Producto");
    KdoButtonEnable($("#btnIngresarDeclaracion"), false);
    KdoButtonEnable($("#btnImportarExcel"), false);

    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "IngresoMercancias/GetIngresoMercanciaByCliente/" + `${xidclie}` },
                contentType: "application/json; charset=utf-8"
            },

            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdIngreso",
                fields: {
                    IdIngreso: { type: "number" },
                    Fecha: { type: "date" },
                    FechaIngreso: { type: "date" },
                    IdCliente: { type: "number" },
                    NombreCliente: { type: "string" },
                    Estado: { type: "string" },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDeclaraciones").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdIngreso", title: "Ingreso" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "FechaIngreso", title: "Fecha Ingreso", format: "{0: dd/MM/yyyy}" },
            { field: "IdCliente", title: "Id Cliente", hidden: true },
            { field: "NombreBodegaCli", title: "Bodega" },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Nombre", title: "Estado" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            {
                field: "btnIng", title: "&nbsp;",
                command: {
                    name: "btnIng",
                    iconClass: "k-icon k-i-edit",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        window.location.href = "/IngresoDeclaracion/" + `${dataItem.IdCliente}/${dataItem.IdIngreso}`;
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDeclaraciones").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDeclaraciones").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDeclaraciones").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDeclaraciones").data("kendoGrid"), dS);

    $("#gridDeclaraciones").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    var selectedRows = [];
    $("#gridDeclaraciones").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDeclaraciones"), selectedRows);
    });

    $("#gridDeclaraciones").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDeclaraciones"), selectedRows);
    });

    $("#gridDeclaraciones").data("kendoGrid").dataSource.read();

    //#endregion 

    //#region filtros
    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidclie = 0
            $("#gridDeclaraciones").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnIngresarDeclaracion"), false);
            KdoButtonEnable($("#btnImportarExcel"), false);
        } else {
            if ($.isNumeric(this.value())) {
                xidclie = this.value();
                $("#gridDeclaraciones").data("kendoGrid").dataSource.read();
                KdoButtonEnable($("#btnIngresarDeclaracion"), true);
                KdoButtonEnable($("#btnImportarExcel"), true);
            }
        }
    });
    //#endregion 

    //crear hojas de bandeo

    $("#btnIngresarDeclaracion").click(function () {
        window.location.href = "/IngresoDeclaracion/" + `${KdoCmbGetValue($("#cmbCliente"))}/${0}`;
    });
   
   

    KdoCmbFocus($("#cmbCliente"));
});

fPermisos = (datos) => {
    Permisos = datos;
};