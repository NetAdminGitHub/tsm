'use strict'

let pJsonCP = "";
let idUnidad = 0;
let listaEmbalajes = [];

var fn_Ini_CreacionEmbalaje = (xjson) => {

    /*
     * Param: {
            pvModal: "vMod_RegistroListaEmpaque",
            pArrayCortes: [], //Columnas: Corte, Tallas, Cantidad
            pCantidadPiezas: 100,
            pCantidadBultos: 10,
            pCantidadCortes: 2
        },
    */

    pJsonCP = xjson;

    $('#chkNuevoEmbalaje').prop('checked', true);
    $("#txtCantidadPiezas").val(pJsonCP.pCantidadPiezas);
    $("#txtCantidadBultos").val(pJsonCP.pCantidadBultos);
    $("#txtCortes").val(pJsonCP.pCantidadCortes);

    $.ajax({
        type: "POST",
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            IdCliente: pJsonCP.pIdCliente,
            IdDespachoMercancia: pJsonCP.pIdDespachoMercancia
        }),
        url: TSM_Web_APi + "EmbalajesMercanciasDetalles/GetEmbalajesMercanciasControl/",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            listaEmbalajes = result;
        }
    });

    KdoComboBoxbyData($("#cmbEmbAsignacion"), listaEmbalajes, "NoDocumento", "IdDespachoEmbalajeMercancia", "seleccione una opción", "", "");
    Kendo_CmbFiltrarGrid($("#cmbUnidadEmbalaje"), TSM_Web_APi + "EmbalajeDeclaracionMercancias", "Nombre", "IdEmbalaje", "Seleccione una opción");

    $("#divUnidadEmbalaje").show();
    $("#divAsignacionEmbalaje").hide();

    $("#txtPesoKg").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0,
        change: function () {
            let kgValue = this.value();
            let lbValue = kgValue * 2.20462; //Valor de equivalente a 1kg en lb
            $("#textPesoLb").data("kendoNumericTextBox").value(lbValue);
            idUnidad = 1;
        }
    });

    $("#textPesoLb").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0,
        change: function () {
            let lbValue = this.value();
            let kgValue = lbValue * 0.453592; //Valor de equivalente a 1lb en kg
            $("#txtPesoKg").data("kendoNumericTextBox").value(kgValue);
            idUnidad = 2;
        }
    });

    KdoButton($("#btnGuardarRegistro"), "save", "Guardar Registro");

    TextBoxEnable($("#txtCantidadPiezas"), false);
    TextBoxEnable($("#txtCantidadBultos"), false);
    TextBoxEnable($("#txtCortes"), false);

    let dataSource = new kendo.data.DataSource({
        data: pJsonCP.pArrayCortes
    });

    $("#gridMercancia").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "Tallas", title: "Tallas" },
            { field: "Cantidad", title: "Cantidad" }
        ]
    });

    //// FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridMercancia").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 430, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridMercancia").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridMercancia").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridMercancia").data("kendoGrid"), dataSource);

    $("#chkNuevoEmbalaje").click(function () {
        if (this.checked) {
            $("#divUnidadEmbalaje").show("slow");
            $("#divAsignacionEmbalaje").hide("slow");
        } else {
            $("#divUnidadEmbalaje").hide("slow");
            $("#divAsignacionEmbalaje").show("slow");
        }
    });

    $("#btnGuardarRegistro").data("kendoButton").bind("click", function (e) {

    });
}

var fn_Reg_CreacionEmbalaje = (xjson) => {
    pJsonCP = xjson;

    $('#chkNuevoEmbalaje').prop('checked', true);
    $("#divUnidadEmbalaje").show();
    $("#divAsignacionEmbalaje").hide();

    $("#cmbEmbAsignacion").data("kendoComboBox").value("");
    $("#cmbUnidadEmbalaje").data("kendoComboBox").value("");

    $("#txtPesoKg").data("kendoNumericTextBox").value(0);
    $("#textPesoLb").data("kendoNumericTextBox").value(0);

    $("#txtCantidadPiezas").val(pJsonCP.pCantidadPiezas);
    $("#txtCantidadBultos").val(pJsonCP.pCantidadBultos);
    $("#txtCortes").val(pJsonCP.pCantidadCortes);

    let dataSource = new kendo.data.DataSource({
        data: pJsonCP.pArrayCortes
    });

    $("#gridMercancia").data("kendoGrid").setDataSource(dataSource);
}


