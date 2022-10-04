﻿
var Permisos;
let xIdDeMerca = 0;
var tpc = "";
var tsc = "";
var ttc = "";
var tcc = "";

$(document).ready(function () {
    xIdDeMerca = xIdDeclaracionMercancia;
    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbModalidad"), TSM_Web_APi + "Modalidades", "Nombre", "IdModalidad", "Seleccione una modalidad");

    //botones
    KdoButton($("#btnGuardarDM"), "save", "Guardar");
    KdoButton($("#btnNotaRemision"), "search", "Nota de Remision");
    KdoButton($("#btnRetornar"), "hyperlink-open-sm", "Regresar");
    $("#cmbModalidad").data("kendoComboBox").value("3");

    // multicolum
    $("#MltBodegaCliente").ControlSeleccionBodegaClie(xIdClienteIng);
    $("#MltIngreso").ControlSeleccionIngresoMerca(xIdClienteIng);
    $("#MltPaisExpor").ControlSeleccionPaises();
    $("#MltAduana").ControlSeleccionAduanas();
    KdoButtonEnable($("#btnNotaRemision"), false);
    // crear campo numeric
    $("#num_Ingreso").kendoNumericTextBox({
        min: 0,
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });


    $("#numTotalBultos").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalBultos"), false);
    $("#numTotalValor").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "c",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalValor"), false);
    $("#numTotalCuantia").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "{0:N2}",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalCuantia"), false);
    //////////////////////Totales INCOTERMS///////////////////////////
    $("#numTotalKgs").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "{0:N2}",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalKgs"), false);
    $("#numTotalFlete").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "c",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalFlete"), false);
    $("#numTotalSeguro").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "c",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalSeguro"), false);
    $("#numTotalOtros").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "c",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalOtros"), false);
    $("#numTotalAduana").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "c",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalAduana"), false);


    KdoComboBoxEnable($("#cmbCliente"), false);
    KdoCmbSetValue($("#cmbCliente"), xIdClienteIng);

    TextBoxReadOnly($("#TxtDireccion"), false);

    TextBoxReadOnly($("#TaDespachante"), false);
    TextBoxReadOnly($("#TaConsignatario"), false);
    TextBoxReadOnly($("#TaExportador"), false);

    TextBoxReadOnly($("#TxtNoRegistro"), false);

    //crear campo fecha
    $("#dFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFecha").data("kendoDatePicker").value(Fhoy());
    KdoDatePikerEnable($("#dFecha"), false);

    //crear campo fecha aceptación
    $("#dFechaAceptacion").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaAceptacion").data("kendoDatePicker").value(Fhoy());

    //#region crear item detalle
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "DeclaracionMercanciasItems/GetItemDetalle/" + `${xIdDeMerca}` },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "/DeclaracionMercanciasItems/" + datos.IdDeclaracionMercancia + "/" + datos.Item; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "DeclaracionMercanciasItems/" + datos.IdDeclaracionMercancia + "/" + datos.Item; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "DeclaracionMercanciasItems",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            fn_Get_IngresoDeclaracion(xIdDeMerca);
            if ($("#gridDetalleItem").data("kendoGrid").dataSource.total() === 0) {
                KdoButtonEnable($("#btnNotaRemision"), false);
            }
            else {
                KdoButtonEnable($("#btnNotaRemision"), true);
            }
        },
        error: Grid_error,
        schema: {
            model: {
                id: "Item",
                fields: {
                    IdDeclaracionMercancia: { type: "number", defaultValue: function () { return xIdDeMerca; } },
                    Item: { type: "number" },
                    IdIncisoArancelario: { type: "string" },
                    IncisoArancelario: { type: "string" },
                    DescripcionInciso: { type: "string" },
                    IdPais: { type: "string", defaultValue: function () { return 60; } },
                    NombrePais: { type: "string" },
                    Descripcion: { type: "string" },
                    PesoBruto: { type: "number" },
                    IdUnidadPesoBruto: { type: "string", defaultValue: function () { return 1; }  },
                    Abreviatura: { type: "string" },
                    CantidadBultos: { type: "number" },
                    Cuantia: { type: "number" },
                    IdEmbalaje: { type: "string", defaultValue: function () { return 1; } },
                    NombreEmbalaje: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    plAsociado: {type:"boolean"}
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDetalleItem").kendoGrid({
        //DEFINICIÓN DE LOS CAMPOS
        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdDeclaracionMercancia");
            KdoHideCampoPopup(e.container, "IncisoArancelario");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "IncisoArancelario");
            KdoHideCampoPopup(e.container, "IncisoArancelario");
            KdoHideCampoPopup(e.container, "IdPais");
            KdoHideCampoPopup(e.container, "NombrePais");
            KdoHideCampoPopup(e.container, "Abreviatura");
            KdoHideCampoPopup(e.container, "NombrePais");
            KdoHideCampoPopup(e.container, "NombreEmbalaje");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "plAsociado");

            $('[name="IdIncisoArancelario"]').on('change', function (e) {
                var ml = $('[name="IdIncisoArancelario"]').data("kendoMultiColumnComboBox");
                let data = ml.listView.dataSource.data().find(q => q.IdIncisoArancelario === Number(this.value));
                if (data === undefined) {
                    $('[name="DescripcionInciso"]').val("");
                } else {
                    $('[name="DescripcionInciso"]').val(data.Descripcion);
                }

            });

            if (!e.model.isNew()) {
                if (e.model.plAsociado == true) {
                    KdoNumerictextboxEnable($('[name="CantidadBultos"]'), false);
                    KdoNumerictextboxEnable($('[name="Cuantia"]'), false);

                }
            }

            Grid_Focus(e, "IdIncisoArancelario");
        },
        columns: [
            { field: "IdDeclaracionMercancia", title: "id Declaracion", hidden: true },
            { field: "Item", title: "Item"},
            {
                field: "IdIncisoArancelario", title: "Inciso Arancelario", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSelecionIncisos();
                }
            },

            { field: "IncisoArancelario", title: "Inciso Arancelario" },
            { field: "DescripcionInciso", title: "Descripción de Mercancía", hidden: true, editor: Grid_ColReadOnly },
            { field: "IdPais", title: "Pais", hidden: true },
            { field: "NombrePais", title: "NombrePais", hidden: true },
            { field: "Descripcion", title: "Descripción" },
            { field: "PesoBruto", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}"},
            { field: "IdUnidadPesoBruto", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Nombre", TSM_Web_APi + "UnidadesMedidas", "", "Seleccione...."], hidden: true },
            { field: "Abreviatura", title: "Unidad" },
            { field: "CantidadBultos", title: "Total de Bultos", editor: Grid_ColNumeric, values: ["required", "1", "9999999999999999", "#", 0] },
            { field: "Cuantia", title: "Cuantía", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "Valor", title: "Valor", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}" },
            { field: "IdEmbalaje", title: "Embalaje", hidden: true ,editor: Grid_Combox, values: ["IdEmbalaje", "Nombre", TSM_Web_APi + "EmbalajeDeclaracionMercancias", "", "Seleccione...."]},
            { field: "NombreEmbalaje", title: "Embalaje" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "plAsociado", title: "plAsociado", hidden: true },
            {
                field: "btnvin", title: "&nbsp;",
                command: {
                    name: "btnvin",
                    iconClass: "k-icon k-i-link-horizontal m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        let strjson = {
                            config: [{
                                Div: "vRelacionPLs",
                                Vista: "~/Views/IngresoDeclaracion/_vRelacionPLs.cshtml",
                                Js: "RelacionPLs.js",
                                Titulo: "Asociar Lista de Empaque a Item #" + `${dataItem.Item}`,
                                Height: "80%",
                                Width: "50%",
                                MinWidth: "10%"
                            }],
                            Param: {
                                idDeclaracionMercancia: xIdDeMerca,
                                item: dataItem.Item,
                                sDiv: "vRelacionPLs",
                                grid: $("#gridDetalleItem"),
                                gd: this.dataItem("tr[data-uid='" + `${this.dataSource.get(dataItem.Item).uid}` + "']")
                            },
                            fn: { fnclose: "fn_RefresVlist", fnLoad: "fn_Ini_RelacionPLs", fnReg: "fn_Reg_RelacionPLs", fnActi: "" }
                        };

                        fn_GenLoadModalWindow(strjson);
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
    SetGrid($("#gridDetalleItem").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 350);
    SetGrid_CRUD_ToolbarTop($("#gridDetalleItem").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridDetalleItem").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDetalleItem").data("kendoGrid"), dS);

    $("#modalExportador").on("click", function () {
        let strjson = {
            config: [{
                Div: "vModalExportador",
                Vista: "~/Views/IngresoDeclaracion/_ModalExportador.cshtml",
                Js: "ModalExportador.js",
                Titulo: "Datos Exportador",
                Height: "53%",
                Width: "25%",
                MinWidth: "20%"
            }],
            Param: { sIdRegNotaRemi: xIdDeMerca },
            fn: { fnclose: "", fnLoad: "fn_Ini_Expo", fnReg: "fn_Reg_Expo", fnActi: "" }
        };

        fn_GenLoadModalWindow(strjson);
    });

    $("#gridDetalleItem").kendoTooltip({
        filter: ".k-grid-btnvin",
        content: function (e) {
            return "Vincular packing list";
        }
    });
    var selectedRows = [];
    $("#gridDetalleItem").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetalleItem"), selectedRows);
    });

    $("#gridDetalleItem").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetalleItem"), selectedRows);
        if ($("#gridDetalleItem").data("kendoGrid").dataSource.total() === 0) {
            KdoButtonEnable($("#btnNotaRemision"), false);
        }
        else {
            KdoButtonEnable($("#btnNotaRemision"), true);
        }
    });

    $("#gridDetalleItem").data("kendoGrid").dataSource.read();

    //#endregion 

    //#region crear grid Lista
    let dsVinListEmp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "DeclaracionItemsMercancias/GetbyidDeclaracionMercancias/" + `${xIdDeMerca}` },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "/DeclaracionItemsMercancias/" + datos.IdDeclaracionItemsMercancia; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if ($("#griVincularListaEmpaque").data("kendoGrid").dataSource.total() === 0) {
                KdoMultiColumnCmbEnable($("#MltIngreso"), true);
            }
            else {
                KdoMultiColumnCmbEnable($("#MltIngreso"), false);
            }
            if (e.type === "destroy") {
                $("#gridDetalleItem").data("kendoGrid").dataSource.read();
            }
           
        },
        error: Grid_error,
        schema: {
            model: {
                id: "IdDeclaracionItemsMercancia",
                fields: {
                    IdDeclaracionItemsMercancia: { type: "number" },
                    IdDeclaracionMercancias: { type: "number" },
                    IdListaEmpaque: { type: "number" },
                    NoDocumento: { type: "string" },
                    Fecha: { type: "date" },
                    Cuantia: { type: "number" },
                    Item: { type: "number" },
                    CantidadBultos: { type: "number" },
                    CantidadCorte: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#griVincularListaEmpaque").kendoGrid({
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "Item", title: "Item" },
            { field: "IdListaEmpaque", title: "IdListaEmpque", hidden: true },
            { field: "NoDocumento", title: "# PL" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "CantidadCorte", title: "Cantidad de Cortes" },
            { field: "CantidadBultos", title: "Total de Bultos" },
            { field: "Cuantia", title: "Cuantía", format: "{0:N2}" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#griVincularListaEmpaque").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 350);
    SetGrid_CRUD_ToolbarTop($("#griVincularListaEmpaque").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#griVincularListaEmpaque").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#griVincularListaEmpaque").data("kendoGrid"), dsVinListEmp);
    
    var selectedRows2 = [];
    $("#griVincularListaEmpaque").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#griVincularListaEmpaque"), selectedRows2);
    });

    $("#griVincularListaEmpaque").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#griVincularListaEmpaque"), selectedRows2);

        if ($("#griVincularListaEmpaque").data("kendoGrid").dataSource.total() === 0) {
            KdoMultiColumnCmbEnable($("#MltIngreso"), true);
        }
        else {
            KdoMultiColumnCmbEnable($("#MltIngreso"), false);
        }
    });

    $("#griVincularListaEmpaque").data("kendoGrid").dataSource.read();

    //#endregion 


    $("#btnNotaRemision").click(function () {
        let strjson = {
            config: [{
                Div: "vModalVerNotasRemi",
                Vista: "~/Views/IngresoDeclaracion/_ModalVerNotasRemision.cshtml",
                Js: "ModalVerNotaRemision.js",
                Titulo: "Notas de Remision",
                Height: "90%",
                Width: "65%",
                MinWidth: "30%"
            }],
            Param: { sIdRegNotaRemi: xIdDeMerca },
            fn: { fnclose: "", fnLoad: "fn_Ini_ModalVerNotaRemision", fnReg: "fn_Reg_ModalVerNotaRemision", fnActi: "" }
        };

        fn_GenLoadModalWindow(strjson);
  
    });

    //compeltar campos de cabecera  

    fn_Get_IngresoDeclaracion(xIdDeMerca);

    //#region 
    vFrmIngDeclaracion = $("#FrmIngresoDeclaracion").kendoValidator(
        {
            rules: {
                MsgRequerido: function (input) {
                    if (input.is("[name='TxtNoReferencia']")) {
                        return input.val() !== "";
                    }
                   
                    if (input.is("[id='MltBodegaCliente']")) {
                        return $("#MltBodegaCliente").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[id='MltIngreso']")) {
                        return $("#MltIngreso").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[id='MltPaisExpor']")) {
                        return $("#MltPaisExpor").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[id='MltAduana']")) {
                        return $("#MltAduana").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                MsgRequerido: "Campo Requerido"
            }
        }).data("kendoValidator");

    $("#btnGuardarDM").click(function () {
        if (vFrmIngDeclaracion.validate()) {
            fn_GuardarDM();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
        }

    });

    $("#btnRetornar").click(function () {
        window.location.href="/ControlDeclaraciones/index"
    });

    $("#MltBodegaCliente").data("kendoMultiColumnComboBox").focus();
    
});

let fn_Refrescar_Ingreso = () => {
    if (Bandeo !== null && xIdDeMerca === 0) {
        kdoNumericSetValue($("#num_Ingreso"), Bandeo[0].IdIngreso);
        xIdDeMerca = Bandeo[0].IdIngreso;
        $("#txtEstado").val(Bandeo[0].Estado);
        window.history.pushState('', '', "/IngresoMercancias/" + `${xIdClienteIng}/${xIdDeMerca}`);
    }

    $("#gridHoja").data("kendoGrid").dataSource.read();
};
var fn_RefresVlist = () => {

    $("#griVincularListaEmpaque").data("kendoGrid").dataSource.read();
};
let fn_Get_IngresoDeclaracion = (xId) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DeclaracionMercancias/GetDatosCabecera/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                KdoMultiColumnCmbSetValue($("#MltBodegaCliente"), dato.IdBodegaCliente);
                KdoMultiColumnCmbSetValue($("#MltAduana"), dato.IdAduana);
                KdoMultiColumnCmbSetValue($("#MltPaisExpor"), dato.IdPais);
                $("#TxtNoReferencia").val(dato.NoReferencia);
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.Fecha), 'dd/MM/yyyy'));
                $("#TxtDireccion").val(dato.Direccion);
                kdoNumericSetValue($("#numTotalBultos"), dato.TotalBulto);
                kdoNumericSetValue($("#numTotalValor"), dato.TotalValor);
                kdoNumericSetValue($("#numTotalCuantia"), dato.TotalCuantia);
                KdoMultiColumnCmbSetValue($("#MltIngreso"), dato.IdIngreso);
            } else {
                KdoMultiColumnCmbSetValue($("#MltBodegaCliente"), "");
                KdoMultiColumnCmbSetValue($("#MltIngreso"), "");
                KdoMultiColumnCmbSetValue($("#MltAduana"), "");
                KdoMultiColumnCmbSetValue($("#MltPaisExpor"),"");
                $("#TxtNoReferencia").val("");
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(Fhoy()), 'dd/MM/yyyy'));
                $("#TxtDireccion").val("");
                kdoNumericSetValue($("#numTotalBultos"), 0);
                kdoNumericSetValue($("#numTotalValor"),0);
                kdoNumericSetValue($("#numTotalCuantia"), 0);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};
let fn_Get_RefresCab = (xId) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DeclaracionMercancias/GetDatosCabecera/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                KdoMultiColumnCmbSetValue($("#MltBodegaCliente"), dato.IdBodegaCliente);
                KdoMultiColumnCmbSetValue($("#MltAduana"), dato.IdAduana);
                KdoMultiColumnCmbSetValue($("#MltPaisExpor"), dato.IdPais);
                $("#TxtNoReferencia").val(dato.NoReferencia);
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.Fecha), 'dd/MM/yyyy'));
                $("#TxtDireccion").val(dato.Direccion);
                kdoNumericSetValue($("#numTotalBultos"), dato.TotalBulto);
                kdoNumericSetValue($("#numTotalValor"), dato.TotalValor);
                kdoNumericSetValue($("#numTotalCuantia"), dato.TotalCuantia);
                fn_SetValueMulticolumIngreso($("#MltIngreso"), dato.IdIngreso);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};

fPermisos = function (datos) {
    Permisos = datos;
}

let fn_GuardarDM = () => {
    let xtype;
    let xstrUrl;
    kendo.ui.progress($(document.body), true);
    if (xIdDeMerca === 0) {
        xtype = 'POST';
        xstrUrl = TSM_Web_APi + "DeclaracionMercancias";
    } else {
        xtype = 'PUT'
        xstrUrl = TSM_Web_APi + "DeclaracionMercancias/" + xIdDeMerca.toString();
    }

    $.ajax({
        url: xstrUrl,
        type: xtype,
        dataType: "json",
        data: JSON.stringify({
            IdDeclaracionMercancia: xIdDeMerca,
            IdCliente: KdoCmbGetValue($("#cmbCliente")),
            IdBodegaCliente: KdoMultiColumnCmbGetValue($("#MltBodegaCliente")),
            NoIngreso: KdoMultiColumnCmbGetValue($("#MltIngreso")),
            NoReferencia: $("#TxtNoReferencia").val(),
            IdAduana: KdoMultiColumnCmbGetValue($("#MltAduana")),
            IdPais: KdoMultiColumnCmbGetValue($("#MltPaisExpor")),
            Estado: "ACTIVO",
            Fecha: kendo.toString(kendo.parseDate($("#dFecha").val()), 's'),
            IdIngreso: KdoMultiColumnCmbGetValue($("#MltIngreso"))

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            xIdDeMerca = data[0].IdDeclaracionMercancia;
            window.history.pushState('', '', "/IngresoDeclaracion/" + `${xIdClienteIng}/${xIdDeMerca}`);
            RequestEndMsg(data, "Post");
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            ErrorMsg(data);
            fn_Get_RefresCab(xIdDeMerca);
            kendo.ui.progress($(document.body), false);
        }
    });
}


//#region consultas


$.fn.extend({
    ControlSelecionIncisos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "IncisoArancelario",
                dataValueField: "IdIncisoArancelario",
                filter: "contains",
                filterFields: ["IdIncisoArancelario", "IncisoArancelario", "Descripcion"],
                autoBind: false,
                height: 400,
                placeholder: "Selección de Inciso Arancelario",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "IncisosArancelarios";
                            },
                            contentType: "application/json; charset=utf-8"
                        },
                        parameterMap: function (data, type) {
                            if (type !== "read" && data.models) {
                                return kendo.stringify(data.models[0]);
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "IdIncisoArancelario",
                            fields: {
                                IdIncisoArancelario: { type: "number" },
                                IncisoArancelario: { type: "string" },
                                Descripcion: { type: "string"}
                            }
                        }
                    }
                },
                columns: [
                    { field: "IncisoArancelario", title: "Inciso Arancelario", width: 100},
                    { field: "Descripcion", title: "Descripcion", width: 300 }
                ]
            });
        });
    }
});

//#endregion 

let get_Item = (g) => {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Item;

};

let fn_SetValueMulticolumIngreso = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "IngresoMercancias/GetIngresosMercanciasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data), id);
        }
    });
}
