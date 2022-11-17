'use strict'

let pJson = "";
let idUnidad = 0;
let listaEmbalajes = [];

var fn_Ini_CreacionEmbalaje = (xjson) => {

    /*
     * Param: {
            pvModal: "vMod_RegistroListaEmpaque",
            pArrayCortes: [{IdHojaBandeo:1 ,Corte:1,tallas:2l,Cantidad:10}], //Columnas: Corte, Tallas, Cantidad
            pCantidadPiezas: 100,
            pCantidadBultos: 10,
            pCantidadCortes: 2,
            pIdDespachoEmbalajeMercancia: 1,
            pIdDespachoMercancia: 1,
            pIdEmbalaje: 1,
            pIdPlanta: 1,
            pIdCliente: 5637161565,
            pIdMercancias: [12,34,45]
        },
    */

    pJson = xjson;

    $('#chkNuevoEmbalaje').prop('checked', true);
    $("#txtCantidadPiezas").val(pJson.pCantidadPiezas);
    $("#txtCantidadBultos").val(pJson.pCantidadBultos);
    $("#txtCortes").val(pJson.pCantidadCortes);
    $("#TxtDetalle").kendoTextArea({
        rows: 2,
        maxLength: 2000
    });

    KdoComboBoxbyData($("#cmbEmbAsignacion"), [], "NoDocumento", "IdEmbalajeMercancia", "seleccione una opción", "", "");
    Kendo_CmbFiltrarGrid($("#cmbUnidadEmbalaje"), TSM_Web_APi + "EmbalajeDeclaracionMercancias", "Nombre", "IdEmbalaje", "Seleccione una opción");

    $("#cmbEmbAsignacion").data("kendoComboBox").setDataSource(fn_EmbalajeEnPreparacion(pJson));

    $("#divUnidadEmbalaje").show();
    $("#divAsignacionEmbalaje").hide();

    $("#txtPesoKg").kendoNumericTextBox({
        size: "large",
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
            idUnidad = 1; //kg
        }
    });

    $("#textPesoLb").kendoNumericTextBox({
        size: "large",
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
            idUnidad = 2; //lb
        }
    });

    KdoNumerictextboxEnable($("#textPesoLb"), false);
    KdoButton($("#btnGuardarRegistro"), "save", "Guardar Registro");

    TextBoxEnable($("#txtCantidadPiezas"), false);
    TextBoxEnable($("#txtCantidadBultos"), false);
    TextBoxEnable($("#txtCortes"), false);

    let dataSource = new kendo.data.DataSource({
        data: pJson.pArrayCortes,
        cache: false
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
    SetGrid($("#gridMercancia").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 400, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridMercancia").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridMercancia").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridMercancia").data("kendoGrid"), dataSource);

    $("#chkNuevoEmbalaje").click(function () {
        if (this.checked) {
            $("#divUnidadEmbalaje").show("slow");
            $("#divAsignacionEmbalaje").hide("slow");
            $("#txtPesoKg").data("kendoNumericTextBox").value(0);
            $("#textPesoLb").data("kendoNumericTextBox").value(0);
            $("#TxtDetalle").val("");
            idUnidad = 1;
            KdoCmbSetValue($("#cmbEmbAsignacion"), "");
        } else {
            $("#divUnidadEmbalaje").hide("slow");
            $("#divAsignacionEmbalaje").show("slow");
        }
    });

    $("#btnGuardarRegistro").data("kendoButton").bind("click", function (e) {
        let Peso = 0;

        if ($("#chkNuevoEmbalaje").is(':checked') === true) {

            if (!($("#cmbUnidadEmbalaje").data("kendoComboBox").selectedIndex >= 0)){
                $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar una Unidad de Embalaje.", "error");
                return
            }
         
        }

        if ($("#chkNuevoEmbalaje").is(':checked') === false) {
            if (!($("#cmbEmbAsignacion").data("kendoComboBox").selectedIndex >= 0)) {
                $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un Embalaje.", "error");
                return
            }
        }

        Peso = idUnidad === 1 ? Number($("#txtPesoKg").val()).toFixed(2) :
                idUnidad === 2 ? Number($("#textPesoLb").val()).toFixed(2) : 0;

        if ( Number($("#txtPesoKg").val()) === 0) {
            $("#kendoNotificaciones").data("kendoNotification").show("Valor del peso debe ser mayor a 0", "error");
            return
        }

        if (!($("#TxtDetalle").val().length > 0 && $("#TxtDetalle").val().length <= 2000)) {

            $("#kendoNotificaciones").data("kendoNotification").show("Detalle del Embalaje es Requerido, valor maximo 2000 caracteres", "error");
            return
        }

        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "EmbalajesMercancias/GenerarEmbalajeDetalleMercancia",
            dataType: 'json',
            data: JSON.stringify({
                IdDespachoEmbalajeMercancia: pJson.pIdDespachoEmbalajeMercancia,
                IdEmbalajeMercancia: $("#chkNuevoEmbalaje").is(':checked') === false ? Kendo_CmbGetvalue($("#cmbEmbAsignacion")) : 0,
                IdEmbalaje: $("#chkNuevoEmbalaje").is(':checked') === true ? Kendo_CmbGetvalue($("#cmbUnidadEmbalaje")) : 0,
                IdUsuario: getUser(),
                IdPlanta: pJson.pIdPlanta,
                IdCliente: pJson.pIdCliente,
                IdMercancias: pJson.pIdMercancias,
                Peso: Peso,
                IdUnidad: idUnidad,
                Observacion: $("#TxtDetalle").val()
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            success: function (resultado) {
                RequestEndMsg(resultado, "Post");
                $("#gridMercancia").data("kendoGrid").dataSource.read();
                $("#" + pJson.pvModal).data("kendoWindow").close();
                kendo.ui.progress($(".k-dialog"), false);
            },
            error: function (data) {
                ErrorMsg(data);
                kendo.ui.progress($(".k-dialog"), false);
            }
        });
    });


    $("#cmbEmbAsignacion").data("kendoComboBox").bind("change", function () {
        let xidEb = this.value() === "" ? 0 : this.value();
        fn_Get_DatosEmbalaje(xidEb);
    });
}

var fn_Reg_CreacionEmbalaje = (xjson) => {
    pJson = xjson;

    $('#chkNuevoEmbalaje').prop('checked', true);
    $("#divUnidadEmbalaje").show();
    $("#divAsignacionEmbalaje").hide();

    $("#cmbEmbAsignacion").data("kendoComboBox").value("");
    $("#cmbUnidadEmbalaje").data("kendoComboBox").value("");

    $("#txtPesoKg").data("kendoNumericTextBox").value(0);
    $("#textPesoLb").data("kendoNumericTextBox").value(0);

    $("#txtCantidadPiezas").val(pJson.pCantidadPiezas);
    $("#txtCantidadBultos").val(pJson.pCantidadBultos);
    $("#txtCortes").val(pJson.pCantidadCortes);
    $("#TxtDetalle").val("");
    $("#gridMercancia").data("kendoGrid").destroy();

    let dataSource = new kendo.data.DataSource({
        data: pJson.pArrayCortes,
        cache: false
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
    SetGrid($("#gridMercancia").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 400, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridMercancia").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridMercancia").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridMercancia").data("kendoGrid"), dataSource);

    KdoNumerictextboxEnable($("#textPesoLb"), false);
    $("#cmbEmbAsignacion").data("kendoComboBox").dataSource.read();
}

let fn_EmbalajeEnPreparacion = function (pJson) {
    /* funcion que devuelve los embalajes creados o que estan en preparación*/
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "NoDocumento", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    async: false,
                    url: TSM_Web_APi + `EmbalajesMercancias/GetEmbalajesEnPreparacion/${pJson.pIdDespachoMercancia}`,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};



let fn_Get_DatosEmbalaje = (xidEmbalaje) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "EmbalajesMercancias/" + `${xidEmbalaje === null ? 0 : xidEmbalaje}`,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (dato) {
            if (dato !== null) {
                $("#txtPesoKg").data("kendoNumericTextBox").value(dato.Peso);
                $("#textPesoLb").data("kendoNumericTextBox").value(dato.Peso * 2.20462);
                $("#TxtDetalle").val(dato.Observacion);
                idUnidad = dato.IdUnidad

            } else {
                $("#txtPesoKg").data("kendoNumericTextBox").value(0);
                $("#textPesoLb").data("kendoNumericTextBox").value(0);
                $("#TxtDetalle").val("");
                idUnidad = 1
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};