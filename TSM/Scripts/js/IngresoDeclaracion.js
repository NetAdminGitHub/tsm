
var Permisos;
let xIdDeMerca = 0;
var tpc = "";
var tsc = "";
var ttc = "";
var tcc = "";

var campo1Consig = "";
var campo2Consig = "";
var campo3Consig = "";
var campo4Consig = "";

var campo1Expo = "";
var campo2Expo = "";
var campo3Expo = "";
var campo4Expo = "";

var campo1Desp = "";
var campo2Desp = "";
var campo3Desp = "";
var campo4Desp = "";

var estadoDM = "";

$(document).ready(function () {
    //1. defincion de la modal
    Fn_VistaCambioEstado($("#vCambioEstado"), function () { return fn_CloseCmb(); });

    xIdDeMerca = xIdDeclaracionMercancia;
    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbModalidad"), TSM_Web_APi + "Modalidades", "Nombre", "IdModalidad", "Seleccione una modalidad");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione una planta");

    //botones
    KdoButton($("#btnGuardarDM"), "save", "Guardar");
    KdoButton($("#btnNotaRemision"), "search", "Nota de Remision");
    KdoButton($("#btnCambiarEstado"), "gear", "Cambiar estado");
    KdoButton($("#btnRetornar"), "arrow-left", "Regresar");
    $("#cmbModalidad").data("kendoComboBox").value("3");

    // multicolum
    $("#MltBodegaCliente").ControlSeleccionBodegaClie(xIdClienteIng);
    $("#MltIngreso").ControlSeleccionIngresoMerca(xIdClienteIng);
    $("#MltPaisExpor").ControlSeleccionPaises();
    $("#MltAduana").ControlSeleccionAduanas();
    $("#cmbCL").ControlSeleccionCodigoLocalizacion();
    $("#cmbINCOTERMS").ControlSeleccionINCOTERMS();
    KdoButtonEnable($("#btnNotaRemision"), false);

    $("#btnCambiarEstado").on("click", function () {
        var lstId = {
            IdDeclaracionMercancia: xIdDeMerca
        };
        Fn_VistaCambioEstadoMostrar("DeclaracionMercancias", estadoDM, TSM_Web_APi + "DeclaracionMercancias/CambiarEstado", "", lstId, undefined, function () { return fn_CloseCmb(); } , false);
    });

    $.ajax({
        url: TSM_Web_APi + "InfoEmpresa/1/",
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                let tactxt = "NIT: " + blankForNull(dato[0]['NIT']) + "\nNombre: " + blankForNull(dato[0]['Nombre']) + "\nDirección: " + blankForNull(dato[0]['Direccion']) + "\nTeléfono: " + blankForNull(dato[0]['Telefono']);
                $("#TaConsignatario").val(tactxt);
                campo1Consig = dato[0]['NIT'];
                campo2Consig = dato[0]['Nombre'];
                campo3Consig = dato[0]['Direccion'];
                campo4Consig = dato[0]['Telefono'];
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {

            let IdPlanta = this.dataItem(e.item.index()).IdPlanta;
            cargarDirPlantaTS(IdPlanta);

        } else {
            let tactxt = "NIT: " + blankForNull(campo1Consig) + "\nNombre: " + blankForNull(campo2Consig) + "\nDirección: " + blankForNull(campo3Consig) + "\nTeléfono: " + blankForNull(campo4Consig);
            $("#TaConsignatario").val(tactxt);
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            let tactxt = "NIT: " + blankForNull(campo1Consig) + "\nNombre: " + blankForNull(campo2Consig) + "\nDirección: " + blankForNull(campo3Consig) + "\nTeléfono: " + blankForNull(campo4Consig);
            $("#TaConsignatario").val(tactxt);
        }
    });

    $("#MltBodegaCliente").data("kendoMultiColumnComboBox").bind("change", function () {

        cargarDatosTACliente();

    });

    // crear campo numeric
    $("#num_Ingreso").kendoNumericTextBox({
        size: "large",
        min: 0,
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });


    $("#numTotalBultos").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalBultos"), false);
    $("#numTotalValor").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "c",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalValor"), false);
    $("#numTotalCuantia").kendoNumericTextBox({
        size: "large",
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
        size: "large",
        min: 0,
        max: 999999999,
        format: "{0:N2}",
        restrictDecimals: true,
        decimals: 2,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalKgs"), false);

    $("#numTotalAduana").kendoNumericTextBox({
        size: "large",
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
    TextBoxReadOnly($("#txtEstadoDM"), false);

    //crear campo fecha
    $("#dFecha").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#dFecha").data("kendoDatePicker").value(Fhoy());
    KdoDatePikerEnable($("#dFecha"), false);

    //crear campo fecha aceptación
    $("#dFechaAceptacion").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
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
                    IdUnidadPesoBruto: { type: "string", defaultValue: function () { return 1; } },
                    Abreviatura: { type: "string" },
                    CantidadBultos: { type: "number" },
                    Cuantia: { type: "number" },
                    IdEmbalaje: { type: "string", defaultValue: function () { return 1; } },
                    NombreEmbalaje: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    plAsociado: { type: "boolean" },
                    IdTipoTrasladoRegimen: { type: "number" },
                    PesoNeto: { type: "number" },
                    ValorFactura: { type: "number" },
                    ValorFlete: { type: "number" },
                    ValorSeguro: { type: "number" },
                    ValorOtrosGastos: { type: "number" },
                    ValorAduana: { type: "number" }
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
        toolbar: "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-button-icontext' id='btnAddItem' onclick='agregarItem(null)'><span class='k-icon k-i-plus'></span></button>",
        columns: [
            { field: "IdDeclaracionMercancia", title: "id Declaracion", hidden: true },
            { field: "Item", title: "Item" },
            {
                field: "IdIncisoArancelario", title: "Inciso Arancelario", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSelecionIncisos();
                }
            },

            { field: "IncisoArancelario", title: "Inciso Arancelario" },
            { field: "DescripcionInciso", title: "Descripción de Mercancía", hidden: true, editor: Grid_ColReadOnly },
            { field: "Descripcion", title: "Descripción" },
            { field: "IdPais", title: "ID País", hidden: true },
            { field: "NombrePais", title: "País" },
            { field: "IdTipoTrasladoRegimen", title: "Código Regímenes", hidden: true },
            { field: "PesoNeto", title: "Peso Neto (KG)", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "PesoBruto", title: "Peso Bruto (KG)", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "CantidadBultos", title: "Total de Bultos", editor: Grid_ColNumeric, values: ["required", "1", "9999999999999999", "#", 0] },
            { field: "IdEmbalaje", title: "Embalaje", editor: Grid_Combox, values: ["IdEmbalaje", "Nombre", TSM_Web_APi + "EmbalajeDeclaracionMercancias", "", "Seleccione...."], hidden: true },
            { field: "NombreEmbalaje", title: "Embalaje" },
            { field: "Cuantia", title: "Cuantía", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "IdUnidadPesoBruto", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Nombre", TSM_Web_APi + "UnidadesMedidas", "", "Seleccione...."], hidden: true },
            { field: "Abreviatura", title: "Unidad" },
            { field: "Valor", title: "Valor Factura", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}" },
            { field: "ValorAduana", title: "Valor Aduana", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}" },
            //////////////////
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
                                Height: "82%",
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
            },
            {
                field: "btnedit", title: "&nbsp;",
                command: {
                    name: "btnedit",
                    iconClass: "k-icon k-i-edit m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        agregarItem(dataItem.Item);
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
    //SetGrid_CRUD_ToolbarTop($("#gridDetalleItem").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridDetalleItem").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDetalleItem").data("kendoGrid"), dS);

    $("#modalExportador").on("click", function () {
        if (KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != "" && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != 0 && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != undefined && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != null)
        {
            let strjson = {
                config: [{
                    Div: "vModalExportador",
                    Vista: "~/Views/IngresoDeclaracion/_ModalExportador.cshtml",
                    Js: "ModalExportador.js",
                    Titulo: "Datos Exportador",
                    Height: "65%",
                    Width: "25%",
                    MinWidth: "20%"
                }],
                Param: { sIdRegNotaRemi: xIdDeMerca, campo1Expo: campo1Expo, campo2Expo: campo2Expo, campo3Expo: campo3Expo, campo4Expo: campo4Expo, tipoTA: "Expo" },
                fn: { fnclose: "", fnLoad: "fn_Ini_Expo", fnReg: "fn_Reg_Expo", fnActi: "" }
            };

            fn_GenLoadModalWindow(strjson);
        }
    });

    $("#modalDespachante").on("click", function () {
        if (KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != "" && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != 0 && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != undefined && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != null) {
            let strjson = {
                config: [{
                    Div: "vModalExportador",
                    Vista: "~/Views/IngresoDeclaracion/_ModalExportador.cshtml",
                    Js: "ModalExportador.js",
                    Titulo: "Datos Despachante",
                    Height: "65%",
                    Width: "25%",
                    MinWidth: "20%"
                }],
                Param: { sIdRegNotaRemi: xIdDeMerca, campo1Desp: campo1Desp, campo2Desp: campo2Desp, campo3Desp: campo3Desp, campo4Desp: campo4Desp, tipoTA: "Desp" },
                fn: { fnclose: "", fnLoad: "fn_Ini_Expo", fnReg: "fn_Reg_Expo", fnActi: "" }
            };

            fn_GenLoadModalWindow(strjson);
        }
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
            if ($("#txtEstadoDM").val() != "FINALIZADO")
            {
                KdoButtonEnable($("#btnNotaRemision"), true);
            }
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
                    Docenas: { type: "number" },
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
            { field: "Cuantia", title: "Cuantía", format: "{0:N2}" },
            { field: "Docenas", title: "Docenas", format: "{0:N2}" }
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
                    if (input.is("[id='cmbCL']")) {
                        return $("#cmbCL").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[id='cmbCL']")) {
                        return $("#cmbCL").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='TxtNoRegistro']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='dFechaAceptacion']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[id='cmbPlanta']")) {
                        return $("#cmbPlanta").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='TxtRTMT']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[id='cmbModalidad']")) {
                        return $("#cmbModalidad").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[id='cmbINCOTERMS']")) {
                        return $("#cmbINCOTERMS").data("kendoMultiColumnComboBox").selectedIndex >= 0;
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

    //$("#MltBodegaCliente").data("kendoMultiColumnComboBox").focus();
    
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
                kdoNumericSetValue($("#numTotalAduana"), dato.TotalValorAduana);
                kdoNumericSetValue($("#numTotalKgs"), dato.TotalPesoBruto);
                kdoNumericSetValue($("#numTotalCuantia"), dato.TotalCuantia);
                KdoMultiColumnCmbSetValue($("#MltIngreso"), dato.IdIngreso);
                /////////////////////////////NUEVOS CAMPOS/////////////////////////////////
                $("#TxtRTMT").val(dato.RegistroTransporte);
                $("#TxtNoRegistro").val(dato.NoRegistro);
                $("#dFechaAceptacion").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaAceptacion), 'dd/MM/yyyy'));
                KdoCmbSetValue($("#cmbPlanta"), dato.IdPlanta);
                KdoMultiColumnCmbSetValue($("#cmbCL"), dato.IdLocalizacion);
                KdoCmbSetValue($("#cmbModalidad"), dato.IdModalidad);
                KdoMultiColumnCmbSetValue($("#cmbINCOTERMS"), dato.IdIncoterm);
                cargarDirPlantaTS(dato.IdPlanta);
                cargarDatosTACliente();
                campo1Expo = dato.ExportadorNit;
                campo2Expo = dato.ExportadorNombre;
                campo3Expo = dato.ExportadorDireccion;
                campo4Expo = dato.ExportadorTelefono;
                campo1Desp = dato.DespachanteNit;
                campo2Desp = dato.DespachanteNombre;
                campo3Desp = dato.DespachanteDireccion;
                campo4Desp = dato.DespachanteTelefono;
                $("#txtEstadoDM").val(dato.Estado);
                let taInfoExpo = "NIT: " + blankForNull(dato.ExportadorNit) + "\nNombre: " + blankForNull(dato.ExportadorNombre) + "\nDirección: " + blankForNull(dato.ExportadorDireccion) + "\nTeléfono: " + blankForNull(dato.ExportadorTelefono);
                $("#TaExportador").val(taInfoExpo.replace(null, ""));
                let taInfoDesp = "NIT: " + blankForNull(dato.DespachanteNit) + "\nNombre: " + blankForNull(dato.DespachanteNombre) + "\nDirección: " + blankForNull(dato.DespachanteDireccion) + "\nTeléfono: " + blankForNull(dato.DespachanteTelefono);
                $("#TaDespachante").val(taInfoDesp.replace(null, ""));
                estadoDM = dato.Estado;
                if ($("#txtEstadoDM").val() == "FINALIZADO") {
                    KdoButtonEnable($("#btnCambiarEstado"), false);
                    KdoButtonEnable($("#btnGuardarDM"), false);
                    KdoButtonEnable($("#btnNotaRemision"), false);
                    $(".k-grid-btnvin").addClass("k-state-disabled");
                    $(".k-grid-btnedit").addClass("k-state-disabled");
                    $(".k-grid-Eliminar").addClass("k-state-disabled");
                    $("#btnAddItem").addClass("k-state-disabled");
                    $("#MltBodegaCliente").data("kendoMultiColumnComboBox").readonly(true);
                    TextBoxReadOnly($("#TxtNoRegistro"));
                    TextBoxReadOnly($("#TxtNoReferencia"));
                    $("#dFechaAceptacion").data("kendoDatePicker").readonly(true);
                    $("#MltAduana").data("kendoMultiColumnComboBox").readonly(true);
                    $("#cmbCL").data("kendoMultiColumnComboBox").readonly(true);
                    $("#cmbPlanta").data("kendoComboBox").readonly(true);
                    TextBoxReadOnly($("#TxtRTMT"));
                    $("#MltPaisExpor").data("kendoMultiColumnComboBox").readonly(true);
                    $("#cmbModalidad").data("kendoComboBox").readonly(true);
                    $("#cmbINCOTERMS").data("kendoMultiColumnComboBox").readonly(true);
                    $(".k-dropdowngrid").addClass("k-state-disabled");
                    $(".k-combobox-clearable").addClass("k-state-disabled");
                    $(".k-picker-wrap").addClass("k-state-disabled");
                    $("#modalExportador").addClass("k-state-disabled");
                }
                else {
                    $("#MltBodegaCliente").data("kendoMultiColumnComboBox").focus();
                    KdoButtonEnable($("#btnCambiarEstado"), true);
                    $("#btnAddItem").removeClass("k-state-disabled");
                }
            } else {
                KdoMultiColumnCmbSetValue($("#MltBodegaCliente"), "");
                KdoMultiColumnCmbSetValue($("#MltIngreso"), "");
                KdoMultiColumnCmbSetValue($("#MltAduana"), "");
                KdoMultiColumnCmbSetValue($("#MltPaisExpor"), "");
                KdoMultiColumnCmbSetValue($("#cmbCL"), "");
                KdoMultiColumnCmbSetValue($("#cmbINCOTERMS"), "");
                $("#TxtNoReferencia").val("");
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(Fhoy()), 'dd/MM/yyyy'));
                $("#TxtDireccion").val("");
                kdoNumericSetValue($("#numTotalBultos"), 0);
                kdoNumericSetValue($("#numTotalValor"), 0);
                kdoNumericSetValue($("#numTotalAduana"), 0);
                kdoNumericSetValue($("#numTotalCuantia"), 0);
                $("#MltBodegaCliente").data("kendoMultiColumnComboBox").focus();
                KdoButtonEnable($("#btnCambiarEstado"), false);
                $("#btnAddItem").addClass("k-state-disabled");
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
                kdoNumericSetValue($("#numTotalAduana"), dato.TotalValorAduana);
                kdoNumericSetValue($("#numTotalKgs"), dato.TotalPesoBruto);
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
            Estado: "OPERACION",
            Fecha: kendo.toString(kendo.parseDate($("#dFecha").val()), 's'),
            IdIngreso: KdoMultiColumnCmbGetValue($("#MltIngreso")),
            NoRegistro: $("#TxtNoRegistro").val(),
            FechaAceptacion: kendo.toString(kendo.parseDate($("#dFechaAceptacion").val()), 's'),
            IdLocalizacion: KdoMultiColumnCmbGetValue($("#cmbCL")),
            ExportadorNit: campo1Expo,
            ExportadorDireccion: campo3Expo,
            ExportadorNombre: campo2Expo,
            ExportadorTelefono: campo4Expo,
            DespachanteNit: campo1Desp,
            DespachanteNombre: campo2Desp,
            DespachanteDireccion: campo3Desp,
            DespachanteTelefono: campo4Desp,
            IdInfoEmpresa: 1,
            RegistroTransporte: $("#TxtRTMT").val(),
            IdModalidad: KdoCmbGetValue($("#cmbModalidad")),
            IdIncoterm: KdoMultiColumnCmbGetValue($("#cmbINCOTERMS")),
            IdPlanta: KdoCmbGetValue($("#cmbPlanta"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            xIdDeMerca = data[0].IdDeclaracionMercancia;
            window.history.pushState('', '', "/IngresoDeclaracion/" + `${xIdClienteIng}/${xIdDeMerca}`);
            RequestEndMsg(data, "Post");
            kendo.ui.progress($(document.body), false);
            estadoDM = data[0].Estado;
            $("#txtEstadoDM").val(estadoDM);
            if ($("#txtEstadoDM").val() != "FINALIZADO") {
                $("#MltBodegaCliente").data("kendoMultiColumnComboBox").focus();
                KdoButtonEnable($("#btnCambiarEstado"), true);
                $("#btnAddItem").removeClass("k-state-disabled");
            }
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
                size: "large",
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
    },
    ControlSeleccionRegimen: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "Codigo",
                dataValueField: "IdTipoTrasladoRegimen",
                filter: "contains",
                filterFields: ["IdTipoTrasladoRegimen", "Codigo", "Nombre"],
                autoBind: false,
                height: 400,
                placeholder: "Selección de Código de Régimen",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "RelacionTiposTrasladosRegimenes";
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
                            id: "IdTipoTrasladoRegimen",
                            fields: {
                                IdTipoTrasladoRegimen: { type: "number" },
                                Codigo: { type: "string" },
                                Nombre: { type: "string" }
                            }
                        }
                    }
                },
                columns: [
                    { field: "Codigo", title: "Código de Régimen", width: 200 },
                    { field: "Nombre", title: "Nombre del código de Régimen", width: 400 }
                ]
            });
        });
    },
    ControlSeleccionUnidadesAduanas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "CodigoAduana",
                dataValueField: "IdUnidad",
                filter: "contains",
                filterFields: ["IdUnidad", "CodigoAduana", "Nombre"],
                autoBind: false,
                height: 400,
                placeholder: "Selección de Código de Unidades de Medidas de Aduana",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "UnidadesMedidas/GetUnidadesMedidasAduanas";
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
                            id: "IdUnidad",
                            fields: {
                                IdUnidad: { type: "number" },
                                CodigoAduana: { type: "string" },
                                Nombre: { type: "string" }
                            }
                        }
                    }
                },
                columns: [
                    { field: "CodigoAduana", title: "Código de Unidad de Medida de Aduana", width: 200 },
                    { field: "Nombre", title: "Nombre de Unidad de Medida de Aduana", width: 400 }
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

let agregarItem = (Item) => {
    let strjson = {
        config: [{
            Div: "vModalItem",
            Vista: "~/Views/IngresoDeclaracion/_ModalItem.cshtml",
            Js: "ModalItem.js",
            Titulo: "Item",
            Height: "70%", //Height de 90% cuando se habiliten los campos de INCOTERM
            Width: "50%",
            MinWidth: "30%"
        }],
        Param: { IdDM: xIdDeMerca, Item: Item },
        fn: { fnclose: "", fnLoad: "fn_Ini_Item", fnReg: "fn_Reg_Item", fnActi: "" }
    };

    fn_GenLoadModalWindow(strjson);
};

let cargarDirPlantaTS = (IdPlanta) => {

    $.ajax({
        url: TSM_Web_APi + "Plantas/GetPlantaById/" + IdPlanta + "/",
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                let planta = dato;
                let tactxt = "NIT: " + blankForNull(campo1Consig) + "\nNombre: " + blankForNull(campo2Consig) + "\nDirección: " + blankForNull(dato['Direccion']) + "\nTeléfono: " + blankForNull(campo4Consig);
                $("#TaConsignatario").val(tactxt);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};

let cargarDatosTACliente = () => {

    if (KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != "" && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != undefined && KdoMultiColumnCmbGetValue($("#MltBodegaCliente")) != 0) {
        $.ajax({
            url: TSM_Web_APi + "BodegasCLientes/GetDatosDMPorIdBodegaCliente/" + KdoMultiColumnCmbGetValue($("#MltBodegaCliente")),
            dataType: 'json',
            type: 'GET',
            success: function (dato) {
                if (dato !== null) {
                    let tactxtcli = "NIT: " + blankForNull(dato['NIT']) + "\nNombre: " + blankForNull(dato['Nombre']) + "\nDirección: " + blankForNull(dato['Direccion']) + "\nTeléfono: " + blankForNull(dato['Telefono']);
                    if (xIdDeMerca == "" || xIdDeMerca == undefined || xIdDeMerca == 0 || xIdDeMerca == null)
                    {
                        $("#TaExportador").val(tactxtcli);
                        campo1Expo = dato['NIT'];
                        campo2Expo = dato['Nombre'];
                        campo3Expo = dato['Direccion'];
                        campo4Expo = dato['Telefono'];
                        $("#TaDespachante").val(tactxtcli);
                        campo1Desp = dato['NIT'];
                        campo2Desp = dato['Nombre'];
                        campo3Desp = dato['Direccion'];
                        campo4Desp = dato['Telefono'];
                    }

                }
                kendo.ui.progress($(document.body), false);
            },
            error: function () {
                kendo.ui.progress($(document.body), false);
            }
        });
    }
    else {
        $("#TaDespachante").val("");
        $("#TaExportador").val("");
        campo1Expo = null;
        campo2Expo = null;
        campo3Expo = null;
        campo4Expo = null;
        campo1Desp = null;
        campo2Desp = null;
        campo3Desp = null;
        campo4Desp = null;
    }

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

var fn_CloseCmb = () => {
    $("#gridDetalleItem").data("kendoGrid").dataSource.read().then(function () {
        if ($("#txtEstadoDM").val() == "FINALIZADO") {
            KdoButtonEnable($("#btnCambiarEstado"), false);
            KdoButtonEnable($("#btnGuardarDM"), false);
            KdoButtonEnable($("#btnNotaRemision"), false);
            $(".k-grid-btnvin").addClass("k-state-disabled");
            $(".k-grid-btnedit").addClass("k-state-disabled");
            $(".k-grid-Eliminar").addClass("k-state-disabled");
            $("#btnAddItem").addClass("k-state-disabled");
            $("#MltBodegaCliente").data("kendoMultiColumnComboBox").readonly(true);
            TextBoxReadOnly($("#TxtNoRegistro"));
            TextBoxReadOnly($("#TxtNoReferencia"));
            $("#dFechaAceptacion").data("kendoDatePicker").readonly(true);
            $("#MltAduana").data("kendoMultiColumnComboBox").readonly(true);
            $("#cmbCL").data("kendoMultiColumnComboBox").readonly(true);
            $("#cmbPlanta").data("kendoComboBox").readonly(true);
            TextBoxReadOnly($("#TxtRTMT"));
            $("#MltPaisExpor").data("kendoMultiColumnComboBox").readonly(true);
            $("#cmbModalidad").data("kendoComboBox").readonly(true);
            $("#cmbINCOTERMS").data("kendoMultiColumnComboBox").readonly(true);
            $(".k-dropdowngrid").addClass("k-state-disabled");
            $(".k-combobox-clearable").addClass("k-state-disabled");
            $(".k-picker-wrap").addClass("k-state-disabled");
            $("#modalExportador").addClass("k-state-disabled");
        }
    });
    
};

var blankForNull = (s) => {
    return s === null ? "" : s;
};

