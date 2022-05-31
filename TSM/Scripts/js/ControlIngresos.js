"use strict"
var Permisos;
let xidclie = 0;
let xidPlanta = 0;
$(document).ready(function () {
  
    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    //crear combobox Planta
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta")
    // crear boton ingreso producto
    KdoButton($("#btnIngresarMercancia"), "plus-outline", "Ingresar Mercancía");
    // crear boton importar excel
    KdoButton($("#btnImportarExcel"), "plus-outline", "Ingresar Producto");
    KdoButtonEnable($("#btnIngresarMercancia"), false);
    KdoButtonEnable($("#btnImportarExcel"), false);

    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "IngresoMercancias/GetIngresosMercanciasGeneral/" + `${xidclie}/${xidPlanta}`},
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "IngresoMercancias/" + datos.IdIngreso; },
                type: "DELETE"
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
                    IdCliente: {type:"number"},
                    NombreCliente: { type: "string" },
                    Estado: { type: "string" },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    ReferenciaPL: { type: "string" },
                    CantidadCortes: { type: "number" },
                    Planta: { type: "string" },
                    TipoProceso: { type: "string" },
                    CantidadTotal: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridIngreso").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdIngreso", title: "Ingreso" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}", hidden: true},
            { field: "FechaIngreso", title: "Fecha Ingreso", format: "{0: dd/MM/yyyy}"},
            { field: "IdCliente", title: "Id Cliente",hidden:true },
            { field: "NombreBodegaCli", title: "Bodega", hidden:true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "Nombre", title: "Estado" },
            { field: "ReferenciaPL", title: "No. Referencia PL" },
            { field: "CantidadCortes", title: "Cantidad de Cortes" },
            { field: "CantidadTotal", title: "Cantidad" },
            { field: "Planta", title: "Planta" },
            { field: "TipoProceso", title: "Tipo de Proceso" },
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
                        window.location.href = "/IngresoMercancias/" + `${dataItem.IdCliente}/${dataItem.IdIngreso}`;
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
    SetGrid($("#gridIngreso").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridIngreso").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridIngreso").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridIngreso").data("kendoGrid"), dS);

    $("#gridIngreso").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    var selectedRows = [];
    $("#gridIngreso").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridIngreso"), selectedRows);
    });

    $("#gridIngreso").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridIngreso"), selectedRows);
    });

    $("#gridIngreso").data("kendoGrid").dataSource.read();

    //#endregion 

    //#region filtros
    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidclie = 0
            $("#gridIngreso").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnIngresarMercancia"), false);
            KdoButtonEnable($("#btnImportarExcel"), false);
        } else {
            if ($.isNumeric(this.value())) {
                xidclie = this.value();
                $("#gridIngreso").data("kendoGrid").dataSource.read();
                KdoButtonEnable($("#btnIngresarMercancia"), true);
                KdoButtonEnable($("#btnImportarExcel"), true);
            }
        }
    });
    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidPlanta = 0
            $("#gridIngreso").data("kendoGrid").dataSource.read();
            KdoButtonEnable($("#btnIngresarMercancia"), false);
            KdoButtonEnable($("#btnImportarExcel"), false);
        } else {
            if ($.isNumeric(this.value())) {
                xidPlanta = this.value();
                $("#gridIngreso").data("kendoGrid").dataSource.read();
                KdoButtonEnable($("#btnIngresarMercancia"), true);
                KdoButtonEnable($("#btnImportarExcel"), true);
            }
        }
    });


    //#endregion 

    //crear hojas de bandeo
    $("#btnIngresarMercancia").click(function () {
        window.location.href = "/IngresoMercancias/" + `${KdoCmbGetValue($("#cmbCliente"))}/${0}`;
    });

    KdoCmbFocus($("#cmbCliente"));
});

fPermisos = (datos) => {
    Permisos = datos;
};