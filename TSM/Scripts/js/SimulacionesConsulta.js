var Permisos;
var VIDSim = 0;
var UrlApiSimu = "";
var UrlSimRen = "";
var UrlSimConsumo = "";

Simulacion_consulta =function () {
    UrlApiSimu = TSM_Web_APi + "Simulaciones";
    UrlSimRen = TSM_Web_APi + "SimulacionesRentabilidades";
    UrlSimConsumo = TSM_Web_APi + "SimulacionesConsumos";
    //#region Inicializacion de variables

    //Programacion del splitter
 
    $("#TabSimulacion").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });

    
    $("#TxtCostoMP_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoMOD_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoPrimo_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoFabril_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoProduccion_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoOperacion_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoMP_coltaUnitario").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoMOD_coltaUnitario").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoPrimo_coltaUnitario").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoFabril_coltaUnitario").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoProduccion_coltaUnitario").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoOperacion_coltaUnitario").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCostoTotal_colta").kendoNumericTextBox({
        size: "large",
        format: "c",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#TxtCostoUnitario_colta").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPorcUtilidadConsiderada_colta").kendoNumericTextBox({
        size: "large",
        format: "P2",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtUtilidadDolares_colta").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioCliente_colta").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioTS_colta").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtPrecioVenta_colta").kendoNumericTextBox({
        size: "large",
        format: "c4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });
    $("#TxtCantidadTecnicas_colta").kendoNumericTextBox({
        size: "large",
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtCantidadPiezas_colta").kendoNumericTextBox({
        size: "large",
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#TxtFechaSim_colta").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#txtTiempoProyecto_colta").kendoNumericTextBox({
        size: "large",
        format: "n4",
        restrictDecimals: false,
        decimals: 4,
        value: 0
    });


    //#endregion  fin Inicializacion de variABLES



    //#region CRUD para el grid Rentabilidad
    var DsRent = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSimRen + "/GetSimulacionesRentabilidadBySimulaciones/" + VIDSim; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },

 
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSimulacionRentabilidad",
                fields: {
                    IdSimulacionRentabilidad: { type: "number" },
                    IdSimulacion: {
                        type: "number" }
                    },
                    IdRentabilidad: { type: "string", defaultValue: null },
                    Descripcion: {
                        type: "string"
                    },
                    Rentabilidad: { type: "number" },
                    Utilidad: { type: "number" },
                    PrecioVenta: { type: "number" },
                    Aprobado: { type: "bool" },
                    CU: {
                        type: "number", defaultValue: function (e) { return $("#TxtCostoUnitario_colta").data("kendoNumericTextBox").value(); }

                    }

                }
            }
        
    });

    $("#gridRentabilidad_colta").kendoGrid({

        columns: [
            { field: "IdSimulacionRentabilidad", title: "IdSimulacionRentabilidad", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "IdRentabilidad", title: "IdRentabilidad", hidden: true },
            { field: "CU", title: "Costo Unitario",  hidden: true },
            { field: "Descripcion", title: "Descripción" },
            { field: "Rentabilidad", title: "Rentabilidad", format: "{0:P2}" },
            { field: "Utilidad", title: "Utilidad $", format: "{0:c4}" },
            { field: "PrecioVenta", title: "Precio Venta $",  format: "{0:c4}" },
            { field: "Aprobado", title: "Aprobar", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Aprobado"); } }
        ]

    });

    SetGrid($("#gridRentabilidad_colta").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridRentabilidad_colta").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridRentabilidad_colta").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridRentabilidad_colta").data("kendoGrid"), DsRent);

   

    var selectedRowsRentabilidad = [];
    $("#gridRentabilidad_colta").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRentabilidad_colta"), selectedRowsRentabilidad);
    });

    $("#gridRentabilidad_colta").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRentabilidad_colta"), selectedRowsRentabilidad);
    });
    //#endregion Fin RUD para el grid Rentabilidad

    //#region CRUD para el grid simulacion Consumo

    var DsSimConsu = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSimConsumo + "/GetSimulacionesConsumoBySimulaciones/" + VIDSim; },
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
                id: "IdSimulacionConsumo",
                fields: {
                    IdSimulacionConsumo: { type: "number" },
                    IdSimulacion: {
                        type: "number" }
                    },
                    Costo: { type: "number" },
                    FechaMod: { type: "date" },
                    IdTecnica: { type: "string" },
                    Nombre: { type: "string" },
                    IdCostoTecnica: { type: "string" },
                    Nombre1: { type: "string" },
                    IdUnidad: { type: "string" },
                    Nombre2: { type: "string" },
                    IdCatalogoInsumo: {
                        type: "string"
                    },
                    Nombre3: { type: "string" },
                    Consumo: { type: "number" }
                }
            }
        
    });

    $("#gridSimuConsumo_colta").kendoGrid({

        columns: [
            { field: "IdSimulacionConsumo", title: "IdSimulacionConsumo", hidden: true },
            { field: "IdSimulacion", title: "IdSimulacion", hidden: true },
            { field: "FechaMod", title: "Fecha Modificación", format: "{0:dd/MM/yyyy}", hidden: true },
            { field: "IdTecnica", title: "IdTecnica",  hidden: true },
            { field: "Nombre", title: "Nombre Técnica" },
            { field: "IdCostoTecnica", title: "IdCostoTecnica",  hidden: true },
            { field: "Nombre1", title: "Nombre Costo Técnica", hidden: true },
            { field: "IdCatalogoInsumo", title: "Catalogo Insumo", hidden: true },
            { field: "Nombre3", title: "Catalogo Insumo" },
            { field: "Consumo", title: "Consumo",  format: "{0:n4}" },
            { field: "Costo", title: "Costo",  format: "{0:c4}" },
            { field: "IdUnidad", title: "IdUnidad",  hidden: true },
            { field: "Nombre2", title: "Unidad de Medida" }
        ]

    });

    SetGrid($("#gridSimuConsumo_colta").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridSimuConsumo_colta").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridSimuConsumo_colta").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridSimuConsumo_colta").data("kendoGrid"), DsSimConsu);


    var selectedRowsConsumos = [];
    $("#gridSimuConsumo_colta").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSimuConsumo_colta"), selectedRowsConsumos);
    });

    $("#gridSimuConsumo_colta").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridSimuConsumo_colta"), selectedRowsConsumos);
    });
    //#endregion Fin RUD para el grid Rentabilidad


};
//#region Metodos Generales



function getSimulacionGrid(elemento) {
  
    $("#TxtNoDocumento_colta").val(elemento.NoDocumento2);
    $("#TxtCostoMP_colta").data("kendoNumericTextBox").value(elemento.CostoMP);
    $("#TxtCostoMOD_colta").data("kendoNumericTextBox").value(elemento.CostoMOD);
    $("#TxtCostoPrimo_colta").data("kendoNumericTextBox").value(elemento.CostoPrimo);
    $("#TxtCostoFabril_colta").data("kendoNumericTextBox").value(elemento.CostoFabril);
    $("#TxtCostoProduccion_colta").data("kendoNumericTextBox").value(elemento.CostoProduccion);
    $("#TxtCostoOperacion_colta").data("kendoNumericTextBox").value(elemento.CostoOperacion);
    $("#TxtCostoTotal_colta").data("kendoNumericTextBox").value(elemento.CostoTotal);
    $("#TxtCostoMP_coltaUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoMP / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoMOD_coltaUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoMOD / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoPrimo_coltaUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoPrimo / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoFabril_coltaUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoFabril / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoProduccion_coltaUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoProduccion / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoOperacion_coltaUnitario").data("kendoNumericTextBox").value(Math.round(elemento.CostoOperacion / elemento.CantidadPiezas * 10000) / 10000);
    $("#TxtCostoUnitario_colta").data("kendoNumericTextBox").value(elemento.CostoUnitario);
    $("#TxtPorcUtilidadConsiderada_colta").data("kendoNumericTextBox").value(elemento.PorcUtilidadConsiderada);
    $("#TxtUtilidadDolares_colta").data("kendoNumericTextBox").value(elemento.UtilidadDolares);
    $("#TxtPrecioCliente_colta").data("kendoNumericTextBox").value(elemento.PrecioCliente);
    $("#TxtPrecioTS_colta").data("kendoNumericTextBox").value(elemento.PrecioTS);
    $("#TxtPrecioVenta_colta").data("kendoNumericTextBox").value(elemento.PrecioVenta);
    $("#TxtCantidadTecnicas_colta").data("kendoNumericTextBox").value(elemento.CantidadTecnicas);
    $("#TxtCantidadPiezas_colta").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
    $("#TxtEstado_colta").val(elemento.Estado);
    $("#TxtFechaSim_colta").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha2), 'dd/MM/yyyy'));
    $("#txtTiempoProyecto_colta").data("kendoNumericTextBox").value(elemento.TiempoProyecto);

    var dataChart = [{
        data: []
    }];

    dataChart[0].type = "pie";
    dataChart[0].startAngle = 150,
        dataChart[0].data.push(
            {
                category: "Costo de Materia Prima",
                value: elemento.CostoMP,
                color: "#011F4B"
            },
            {
                category: "Costo de Mano de Obra Directa",
                value: elemento.CostoMOD,
                color: "#03396C"
            },
            {
                category: "Costo Fabril",
                value: elemento.CostoFabril,
                color: "#005B96"
            },
            {
                category: "Costo Operación",
                value: elemento.CostoOperacion,
                color: "#6497B1"
            });

    $("#chart").kendoChart({
        title: {
            position: "bottom",
            text: "Distribución de costos " + elemento.Nombre2
        },
        legend: {
            visible: true
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n $#= value#"
            }
        },
        series: dataChart,
        tooltip: {
            visible: true,
            format: "${0}"
        }
    });
}

function DesHabilitarCamposSim() {
    $("#TxtCostoMP_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMOD_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimo_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFabril_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccion_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOperacion_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMP_coltaUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoMOD_coltaUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoPrimo_coltaUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoFabril_coltaUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoProduccion_coltaUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoOperacion_coltaUnitario").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoTotal_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCostoUnitario_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtPorcUtilidadConsiderada_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtUtilidadDolares_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioCliente_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioTS_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtPrecioVenta_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCantidadTecnicas_colta").data("kendoNumericTextBox").enable(false);
    $("#txtTiempoProyecto_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtCantidadPiezas_colta").data("kendoNumericTextBox").enable(false);
    $("#TxtFechaSim_colta").data("kendoDatePicker").enable(false);
}

function LimpiarCamposSim() {
    $("#TxtCostoMP_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoMOD_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoPrimo_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoFabril_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoProduccion_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoOperacion_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoTotal_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCostoUnitario_colta").data("kendoNumericTextBox").value("0");
    $("#TxtPorcUtilidadConsiderada_colta").data("kendoNumericTextBox").value("0");
    $("#TxtUtilidadDolares_colta").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioCliente_colta").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioTS_colta").data("kendoNumericTextBox").value("0");
    $("#TxtPrecioVenta_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCantidadTecnicas_colta").data("kendoNumericTextBox").value("0");
    $("#TxtCantidadPiezas_colta").data("kendoNumericTextBox").value("0");
  
    $("#TxtNoDocumento_colta").val("");
    $("#TxtEstado_colta").val("");
    $("#txtTiempoProyecto_colta").data("kendoNumericTextBox").value("0");
}

function getIdSimulacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacion;
}

function fn_getNoSimulacion(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento2;
}

function fn_getIdRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;
}
function fn_NoRequerimiento(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoDocumento1;
}

fPermisos = function (datos) {
    Permisos = datos;
};

function fn_ConsultaSimulaciones(IdSimulacion) {
   

    DesHabilitarCamposSim();

    VIDSim = IdSimulacion;
    $.ajax({
        url: UrlApiSimu + "/GetSimulacionesAnalisisbyIdSimulacion/" + VIDSim.toString(),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null || respuesta.length > 0) {
                getSimulacionGrid(respuesta[0]);
                $("#gridRentabilidad_colta").data("kendoGrid").dataSource.data([]);
                $("#gridRentabilidad_colta").data("kendoGrid").dataSource.read();
                $("#gridSimuConsumo_colta").data("kendoGrid").dataSource.data([]);
                $("#gridSimuConsumo_colta").data("kendoGrid").dataSource.read();

            }
            else {
                LimpiarCamposSim();
                $("#gridRentabilidad_colta").data("kendoGrid").dataSource.data([]);
                $("#gridSimuConsumo_colta").data("kendoGrid").dataSource.data([]);
            }
        }
    });


}
//#endregion Fin Metodos Generales