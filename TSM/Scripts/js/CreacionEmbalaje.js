'use strict'

let pJsonCP = "";

var fn_Ini_CreacionEmbalaje = (xjson) => {
    pJsonCP = xjson;

    $('#chkNuevoEmbalaje').prop('checked', true);
    Kendo_CmbFiltrarGrid($("#cmbUnidadEmbalaje"), TSM_Web_APi + "EmbalajeDeclaracionMercancias", "Nombre", "IdEmbalaje", "Seleccione una unidad de Embalaje");
    Kendo_CmbFiltrarGrid($("#cmbEmbAsignacion"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");

    $("#divUnidadEmbalaje").show();
    $("#AsignacionEmbalaje").hide();

    $("#txtPesoKg").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#cmbPesoLb").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    KdoButton($("#btnGuardarRegistro"), "save", "Guardar Registro");

    TextBoxEnable($("#cmbPesoLb"), false);
    TextBoxEnable($("#txtCantidadPiezas"), false);
    TextBoxEnable($("#txtCantidadBultos"), false);
    TextBoxEnable($("#txtCortes"), false);

    //let dataSource = new kendo.data.DataSource({
    //    data: pJsonCP.pArrayEmbalaje
    //});

    //$("#gridEmbalajesRevision").kendoGrid({
    //    //DEFICNICIÓN DE LOS CAMPOS
    //    columns: [
    //        { field: "IdEmbalajeMercancia", title: "id", hidden: true },
    //        { field: "IdEmbalaje", title: "id Embalaje", hidden: true },
    //        { field: "NoDocumento", title: "Correlativo" },
    //        { field: "FechaCreacion", title: "Fecha Registro", format: "{0: dd/MM/yyyy HH:mm:ss}" },
    //        { field: "UnidadEmbalaje", title: "Unidad Embalaje" },
    //        { field: "CantidadCortes", title: "Corte" },
    //        { field: "CantidadMercancia", title: "Mercancía" },
    //        { field: "Cantidad", title: "Cantidad" }
    //    ]
    //});

    //// FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    //SetGrid($("#gridEmbalajesRevision").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 430, "multiple");
    //SetGrid_CRUD_ToolbarTop($("#gridEmbalajesRevision").data("kendoGrid"), false);
    //SetGrid_CRUD_Command($("#gridEmbalajesRevision").data("kendoGrid"), false, false);
    //Set_Grid_DataSource($("#gridEmbalajesRevision").data("kendoGrid"), dataSource);

    $("#chkNuevoEmbalaje").click(function () {
        if (this.checked) {
            $("#divUnidadEmbalaje").show("slow");
            $("#AsignacionEmbalaje").hide("slow");
        } else {
            $("#divUnidadEmbalaje").hide("slow");
            $("#AsignacionEmbalaje").show("slow");
        }
    });

    $("#btnGuardarRegistro").data("kendoButton").bind("click", function (e) {

    });
}

var fn_Reg_CreacionEmbalaje = (xjson) => {
    pJsonCP = xjson;

    //let dataSource = new kendo.data.DataSource({
    //    data: pJsonCP.pArrayEmbalaje
    //});

    //$("#gridEmbalajesRevision").data("kendoGrid").setDataSource(dataSource);
}


