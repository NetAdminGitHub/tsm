"use strict"
let vCbForm;
let xidHojaBandeo = 0;
let xIdIng = 0;
let xesNuevo;
let xidCliente;
let Bandeo;

let UrlUnidadesMedidas = TSM_Web_APi + "UnidadesMedidas";

var fn_Ini_ControlBulto = (xjson) => {
   
    // crear combobox cliente
    xidHojaBandeo = xjson.sIdHB;
    xIdIng = xjson.sIdIngreso;
    xesNuevo = xjson.esNuevo;
    xidCliente = xjson.sIdCliente;
    Kendo_CmbFiltrarGrid($("#xcmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione..");
    Kendo_CmbFiltrarGrid($("#xcmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione..");
    Kendo_CmbFiltrarGrid($("#xcmbMarca"), TSM_Web_APi + "ClientesMarcas/GetByCliente/" + `${xidCliente}`, "Nombre2", "IdMarca", "Seleccione..");
    Kendo_CmbFiltrarGrid($("#xcmbProceso"), TSM_Web_APi + "TiposProcesos", "Nombre", "IdTipoProceso", "Seleccione..");
    KdoComboBoxbyData($("#xcmbIdUni"), "[]", "Nombre", "IdUnidad", "Seleccione ....");
    KdoComboBoxEnable($("#xcmbCliente"), false);
    KdoCmbSetValue($("#xcmbCliente"), xidCliente);
    TextBoxReadOnly($("#txtEstilo"), false);
    TextBoxReadOnly($("#txtPrenda"), false);
    TextBoxReadOnly($("#txtConfeccion"), false);
    TextBoxReadOnly($("#txtPartePrenda"), false);
    TextBoxReadOnly($("#txtServicio"), false);
    TextBoxReadOnly($("#txtNumero"), false);
    TextBoxReadOnly($("#txtNombreDiseño"), false);
    TextBoxReadOnly($("#txtColor"), false);
    $("#txtNombreDiseño").val("");
    $("#txtEstilo").val("");
    $("#txtNumero").val("");
    $("#txtPO").val("");
    $("#txtColor").val("");
    KdoCmbSetValue($("#xcmbPlanta"), "");
    KdoCmbSetValue($("#xcmbMarca"), "");
    KdoCmbSetValue($("#xcmbProceso"), "");
    $("#txtTO").prop("disabled", true);

    $("#xcmbIdUni").data("kendoComboBox").setDataSource(fn_dsFiltroUM("9,20"));

    // crear boton "Crear Bulto"
    KdoButton($("#btnCrearBulto"), "plus-outline", "Crear Bulto");
    // crear boton Crear serie Bulto
    KdoButton($("#btnCrearSerieBulto"), "plus-outline", "Crear Serie de Bulto");
    //botón importar Bulto
    $("#Adjunto").kendoUpload({
        async: {
            saveUrl: "/IngresoMercancias/SubirArchivo",
            autoUpload: true
        },
        localization: {
            select: '<div class="k-icon k-i-excel"></div>&nbsp;Importar'
        },
        upload: function (e) {
            e.sender.options.async.saveUrl = "/IngresoMercancias/SubirArchivo/" + xidHojaBandeo;
        },
        showFileList: false,
        success: function (e) {
            if (e.response.Resultado === true) {
                if (e.operation === "upload") {
                    ImportarExcel(e);
                }
            } else {
                $("#kendoNotificaciones").data("kendoNotification").show(e.response.Msj, "error");
            }
        }
    });

    KdoButtonEnable($("#btnCrearSerieBulto"), xesNuevo ? false : true);
    KdoButtonEnable($("#btnCrearBulto"), xesNuevo ? false : true);
    $("#Adjunto").data("kendoUpload").enable(xidHojaBandeo === 0 ? false : true);

    // crear Ingresar cantidad
    KdoButton($("#btnIngresarCatidad"), "", "Ingresar Cantidad");
    // crear boton Cancelar
    KdoButton($("#btnCancelar"), "close-outline", "Cancelar");
    // crear realizar
    KdoButton($("#btnGuardarRegistro"), "check-outline", "Realizar Registro");
    // seleccion de fms
    KdoMultiSelectDatos($("#Mtlfm"), "[]", "NoReferencia", "IdCatalogoDiseno", "Seleccione ...", 100, true);
    $('#chkEnlazarTsm').prop('checked', 1);

    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "HojasBandeosMercancias/GetByHojaBandeo/" + `${xidHojaBandeo}` },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "/HojasBandeosMercancias/" + datos.IdMercancia; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "/HojasBandeosMercancias/" + datos.IdMercancia; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function () {
            Grid_requestEnd;
            $("#gridResumenIngreso").data("kendoGrid").dataSource.read();
            if ($("#gridBultoDetalle").data("kendoGrid").dataSource.total() === 0) {
                KdoComboBoxEnable($("#xcmbIdUni"),true)
            }

        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" }
        ],
        error: Grid_error,
        schema: {
            model: {
                id: "IdMercancia",
                fields: {
                    IdMercancia: { type: "number" },
                    IdHojaBandeo: { type: "number" },
                    NoDocumento: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" },
                    Docenas: { type: "number" },
                    Estado: { type: "string" },
                    NomEstado: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridBultoDetalle").kendoGrid({
        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdMercancia");
            KdoHideCampoPopup(e.container, "IdHojaBandeo");
            KdoHideCampoPopup(e.container, "Docenas");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NomEstado");
            Grid_Focus(e, "NoDocumento");
        },
        columns: [
            { field: "IdHojaBandeo", title: "Id HojaBandeo", hidden: true },
            { field: "IdMercancia", title: "Id Mercancia",hidden:true },
            { field: "NoDocumento", title: "Bulto/Rollo",footerTemplate: "Totales" },
            { field: "Talla", title: "Talla" },
            { field: "Cantidad", title: "Cantidad", footerTemplate: "#: data.Cantidad ? kendo.format('{0:n2}', sum) : 0 #"},
            { field: "Docenas", title: "Docenas", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NomEstado", title: "Estado", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridBultoDetalle").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 700);
    SetGrid_CRUD_ToolbarTop($("#gridBultoDetalle").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridBultoDetalle").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridBultoDetalle").data("kendoGrid"), dS);

    var selectedRows = [];
    $("#gridBultoDetalle").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridBultoDetalle"), selectedRows);
    });

    $("#gridBultoDetalle").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridBultoDetalle"), selectedRows);
    });

    $("#gridBultoDetalle").data("kendoGrid").dataSource.read().then(function () { $("#gridBultoDetalle").data("kendoGrid").dataSource.total() === 0 ? KdoComboBoxEnable($("#xcmbIdUni"), true) : KdoComboBoxEnable($("#xcmbIdUni"), false) });
    //#endregion 

    //#region crear grid resumen
    let dSResum = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "HojasBandeosMercancias/GetResumenByHojaBandeo/" + `${xidHojaBandeo}` },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },
            { field: "Docenas", aggregate: "sum" }
        ],
        error: Grid_error,
        schema: {
            model: {
                id: "Talla",
                fields: {
                    Talla: { type: "string" },
                    Conteo: { type: "number" },
                    Cantidad: { type: "number" },
                    Docenas: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridResumenIngreso").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Talla", title: "Talla", footerTemplate: "Totales"},
            { field: "Conteo", title: "Conteo" },
            { field: "Cantidad", title: "Cantidad", footerTemplate: "#: data.Cantidad ? kendo.format('{0:n2}', sum) : 0 #"},
            { field: "Docenas", title: "Docenas", footerTemplate: "#: data.Docenas ? kendo.format('{0:n2}', sum) : 0 #"}
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridResumenIngreso").data("kendoGrid"), ModoEdicion.EnPopup,false, false, true, false, redimensionable.Si,200);
    SetGrid_CRUD_ToolbarTop($("#gridResumenIngreso").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridResumenIngreso").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridResumenIngreso").data("kendoGrid"), dSResum);

    var selectedRows3 = [];
    $("#gridResumenIngreso").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridResumenIngreso"), selectedRows3);
    });

    $("#gridResumenIngreso").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridResumenIngreso"), selectedRows3);
    });

    $("#gridResumenIngreso").data("kendoGrid").dataSource.read();

    //#endregion 


    //validador
    vCbForm = $("#FrmGhojaBandeo").kendoValidator(
        {
            rules: {
                MsgRequerido: function (input) {
                    if (input.is("[name='xcmbCliente']")) {
                        return $("#xcmbCliente").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='Mtlfm']") && $("#chkEnlazarTsm").is(':checked')===true ) {
                        return $("#Mtlfm").data("kendoMultiSelect").value().length > 0;
                    }
                    if (input.is("[name='xcmbPlanta']") ) {
                        return $("#xcmbPlanta").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='xcmbProceso']")) {
                        return $("#xcmbProceso").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='xcmbMarca']")) {
                        return $("#xcmbMarca").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='xcmbIdUni']")) {
                        return $("#xcmbIdUni").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[name='txtCorte_Rollo']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='txtPO']")) {
                        return input.val() !== "";
                    }
                    
                    
                    return true;
                },
                MsgLong1: function (input) {
                    if (input.is("[name='txtCorte_Rollo']")  ) {
                        return input.val().length <=20;
                    }
                    return true;
                },
                MsgLong3: function (input) {
                    if (input.is("[name='txtPO']")) {
                        return input.val().length <= 30;
                    }
                    return true;
                }

            },
            messages: {
                MsgRequerido: "Requerido",
                MsgLong1: "Longitud del campo es 20",
                MsgLong2: "Longitud del campo es 200",
                MsgLong3: "Longitud del campo es 30"
            }
        }).data("kendoValidator");
    //vista Ingreso Bulto(boton crear bulto)
    $("#btnCrearBulto").click(function () {
        let strjson = {
            config: [{
                Div: "vIngresoBulto",
                Vista: "~/Views/IngresoMercancias/_IngresoBulto.cshtml",
                Js: "IngresoBulto.js",
                Titulo: "Ingreso de Bulto / Rollo",
                Height: "55%",
                Width: "20%",
                MinWidth: "10%"
            }],
            Param: { sidHb: xidHojaBandeo, fnRefresh: "fn_RefrescarGrid", Uni: Kendo_CmbGetvalue($("#xcmbIdUni")) },
            fn: { fnclose: "fn_RefrescarGrid", fnLoad: "fn_Ini_IngresoBulto", fnReg: "fn_Reg_IngresoBulto", fnActi:"fn_FocusVista"}
        };

        fn_GenLoadModalWindow(strjson);
    });

    //vista Ingreso Bulto serie (boton crear serie bulto)
    $("#btnCrearSerieBulto").click(function () {
           
        let strjson = {
            config: [{
                Div: "vIngresoBultoSerie",
                Vista: "~/Views/IngresoMercancias/_IngresoBultoSerie.cshtml",
                Js: "IngresoBultoSerie.js",
                Titulo: "Ingreso de Bulto / Rollo",
                Height: "65%",
                Width: "20%",
                MinWidth: "10%"
            }],
            Param: { sIdHojaBandeo: xidHojaBandeo,  fnRefresh: "fn_RefrescarGrid", Uni: Kendo_CmbGetvalue($("#xcmbIdUni")) },
            fn: { fnclose: "fn_RefrescarGrid", fnLoad: "fn_Ini_IngresoBultoSerie", fnReg: "fn_Reg_IngresoBultoSerie", fnActi:"fn_FocusVistaSerie" }
        };

        fn_GenLoadModalWindow(strjson);
    });

    let ImportarExcel = function (e) {
        kendo.ui.progress($("#body"), true);
        var XType = "Post";

        $.ajax({
            url: TSM_Web_APi + "/HojasBandeosMercancias/ImportarMercancias",
            type: XType,
            dataType: "json",
            data: JSON.stringify({
                IdHojaBandeo: xidHojaBandeo,
                RutaCompleta: e.response.Ruta,
                NombreArchivo: e.files[0].name
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                fn_RefrescarGrid();
                kendo.ui.progress($("#body"), false);
                RequestEndMsg(data, XType);
            },
            error: function (data) {
                kendo.ui.progress($("#body"), false);
                ErrorMsg(data);
            }
        });
    }

   
    $("#btnGuardarRegistro").click(function () {
        fn_Gen_Hb();
    });

    $("#Mtlfm").data("kendoMultiSelect").bind("deselect", function (e) {
        if (xidHojaBandeo > 0) {
            kendo.ui.progress($(".k-window"), true);
            $.ajax({
                url: TSM_Web_APi + "HojasBandeosDisenos/" + `${xidHojaBandeo}/${e.dataItem.IdCatalogoDiseno}`,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($(".k-window"), false);
                    fn_Get_ListFms(xidHojaBandeo);
                },
                error: function (data) {
                    kendo.ui.progress($(".k-window"), false);
                    ErrorMsg(data);
                }
            });

        }

    });
    $("#Mtlfm").data("kendoMultiSelect").bind("select", function (e) {
        if (xidHojaBandeo > 0) {
            kendo.ui.progress($(".k-window"), true);
            $.ajax({
                url: TSM_Web_APi +"HojasBandeosDisenos",//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdBandeosDisenos:0,
                    IdHojaBandeo: xidHojaBandeo,
                    IdCatalogoDiseno: e.dataItem.IdCatalogoDiseno
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(".k-window"), false);
                    fn_Get_ListFms(xidHojaBandeo);
                },
                error: function (data) {
                    fn_Get_HojasBandeoDisenos(xidHojaBandeo);
                    kendo.ui.progress($(".k-window"), true);
                    ErrorMsg(data);
                }
            });
        }

    });


    if (xidHojaBandeo > 0) {
        fn_Get_HojasBandeo(xidHojaBandeo);
    } else {
        $("#txtCorte_Rollo").val("");
        $("#txtColor").val("");
        $('#chkEnlazarTsm').prop('checked', true);
        KdoCmbSetValue($("#xcmbPlanta"), "");
        $("#Mtlfm").data("kendoMultiSelect").setDataSource(get_CatalogxCliente(xidCliente));
        $("#Mtlfm").data("kendoMultiSelect").value([""]);
    }

    $("#chkEnlazarTsm").click(function () {
        if (this.checked) {
            KdoMultiSelectEnable($("#Mtlfm"), true);

        } else {
            fn_DelHbDisenos();
            KdoMultiSelectEnable($("#Mtlfm"), false);

        }
    });

    $("#xcmbPlanta").change(function () {
        if ($("#xcmbPlanta").data("kendoComboBox").text() =="PLANTA 2")
        {
            $("#txtTO").prop("disabled", false);
        }
        else
        {
            $("#txtTO").val("");
            $("#txtTO").prop("disabled", true);
        }
    });

    $("#Mtlfm").data("kendoMultiSelect").dataSource.read();
    KdoCmbFocus($("#xcmbMarca"));
    fn_Get_ListFms(xidHojaBandeo);
}

var fn_Reg_ControlBulto = (xjson) => {

    xidHojaBandeo = xjson.sIdHB;
    xIdIng = xjson.sIdIngreso;
    xesNuevo = xjson.esNuevo;
    xidCliente = xjson.sIdCliente;
    KdoComboBoxEnable($("#xcmbCliente"), false);
    TextBoxReadOnly($("#txtEstilo"), false);
    KdoCmbSetValue($("#xcmbCliente"), xidCliente);
    TextBoxReadOnly($("#txtEstilo"), false);
    TextBoxReadOnly($("#txtPrenda"), false);
    TextBoxReadOnly($("#txtConfeccion"), false);
    TextBoxReadOnly($("#txtPartePrenda"), false);
    TextBoxReadOnly($("#txtServicio"), false);
    TextBoxReadOnly($("#txtNumero"), false);
    TextBoxReadOnly($("#txtNombreDiseño"), false);
    TextBoxReadOnly($("#txtColor"), false);
    $("#txtNombreDiseño").val("");
    $("#txtEstilo").val("");
    $("#txtNumero").val("");
    $("#txtPO").val("");
    $("#txtTO").val("");
    $("#txtColor").val("");
    $("#txtTO").prop("disabled", true);

    KdoCmbSetValue($("#xcmbPlanta"), "");
    KdoCmbSetValue($("#xcmbMarca"), "");
    KdoCmbSetValue($("#xcmbProceso"), "");

    if (xidHojaBandeo > 0) {
        //llenar campos de  si existe hoja
        fn_Get_HojasBandeo(xidHojaBandeo);
        KdoButtonEnable($("#btnCrearSerieBulto"), xesNuevo ? false : true);
        KdoButtonEnable($("#btnCrearBulto"), xesNuevo ? false : true);
        $("#Adjunto").data("kendoUpload").enable(xidHojaBandeo === 0 ? false : true);
    } else {
        // cuando no es edicion(registro nuevo)
        $("#txtCorte_Rollo").val("");
        $("#txtColor").val("");
        $("#Mtlfm").data("kendoMultiSelect").value([""]);
        $("#Mtlfm").data("kendoMultiSelect").setDataSource(get_CatalogxCliente(xidCliente));
        $('#chkEnlazarTsm').prop('checked', true);
        KdoCmbSetValue($("#xcmbPlanta"), "");
        KdoButtonEnable($("#btnCrearSerieBulto"), false );
        KdoButtonEnable($("#btnCrearBulto"), false);
        $("#Adjunto").data("kendoUpload").enable(false);
        $("#Mtlfm").data("kendoMultiSelect").dataSource.read();
    }
    //llenar grid detalle
    $("#gridBultoDetalle").data("kendoGrid").dataSource.read().then(function () { $("#gridBultoDetalle").data("kendoGrid").dataSource.total() === 0 ? KdoComboBoxEnable($("#xcmbIdUni"), true) : KdoComboBoxEnable($("#xcmbIdUni"), false) });
    $("#gridResumenIngreso").data("kendoGrid").dataSource.read();
   
    KdoCmbFocus($("#xcmbMarca"));
    fn_Get_ListFms(xidHojaBandeo);
  
}

let get_CatalogxCliente = (xidClie) => {
    return new kendo.data.DataSource({
        sort: { field: "NoReferencia", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "HojasBandeosDisenos/GetFmsAprob/" + `${xidClie}`,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let fn_Gen_Hb = () => {
    if (vCbForm.validate()) {
        kendo.ui.progress($(".k-window"), true);
        $.ajax({
            url: TSM_Web_APi + "HojasBandeos/CrearHojasBandeo",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                IdHojaBandeo: xidHojaBandeo,
                IdIngreso: xIdIng,
                IdCliente: KdoCmbGetValue($("#xcmbCliente")).toString(),
                Corte: $("#txtCorte_Rollo").val(),
                Color: $("#txtColor").val(),
                IdPlanta: KdoCmbGetValue($("#xcmbPlanta")),
                IdCatalogoDisenosList: $("#Mtlfm").data("kendoMultiSelect").value().toString(),
                IdTipoProceso: KdoCmbGetValue($("#xcmbProceso")),
                IdMarca: KdoCmbGetValue($("#xcmbMarca")),
                TrafficOn: $("#txtTO").val(),
                PO: $("#txtPO").val(),
                IdUnidad: KdoCmbGetValue($("#xcmbIdUni"))

            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Bandeo = datos;
                RequestEndMsg(datos, "Post");
                xidHojaBandeo = datos[0].IdHojaBandeo;
                xIdIng = datos[0].IdIngreso;
                KdoButtonEnable($("#btnCrearSerieBulto"), true);
                KdoButtonEnable($("#btnCrearBulto"), true);
                $("#Adjunto").data("kendoUpload").enable(true);
                fn_Get_HojasBandeo(datos[0].IdHojaBandeo);
                fn_Get_ListFms(datos[0].IdHojaBandeo);
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(".k-window"), false);
            }
        });

    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
    }
}

let fn_Get_HojasBandeo = (xId)=> {
    kendo.ui.progress($(".k-window"), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeos/GetbyIdHoja/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#txtCorte_Rollo").val(datos.Corte);
                $("#txtColor").val(datos.Color);
                KdoCmbSetValue($("#xcmbCliente"), datos.IdCliente);
                KdoCmbSetValue($("#xcmbPlanta"), datos.IdPlanta);
                kendo.ui.progress($(".k-window"), false);
                $("#Mtlfm").data("kendoMultiSelect").setDataSource(get_CatalogxCliente(datos.IdCliente));
                KdoCmbSetValue($("#xcmbProceso"), datos.IdTipoProceso);
                KdoCmbSetValue($("#xcmbMarca"), datos.IdMarca);
                if ($("#xcmbPlanta").data("kendoComboBox").text() == "PLANTA 2") {
                    $("#txtTO").prop("disabled", false);
                }
                $("#txtTO").val(datos.TrafficOn);
                $("#txtPO").val(datos.PO);
                KdoCmbSetValue($("#xcmbIdUni"), datos.IdUnidad);
                fn_Get_HojasBandeoDisenos(xId);
            }
        },
        error: function () {
            kendo.ui.progress($(".k-window"), false);
        }
    });

};
let fn_Get_HojasBandeoDisenos = (xId) => {
    kendo.ui.progress($(".k-window"), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetByIdHoja/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            var lista = "";
            $.each(datos, function (index, elemento) {
                lista = lista + elemento.IdCatalogoDiseno + ",";
            });
            $("#Mtlfm").data("kendoMultiSelect").value(lista.split(","));
            $('#chkEnlazarTsm').prop('checked', datos.length > 0 ? true : false);
            kendo.ui.progress($(".k-window"), false);
        },
        error: function () {
            kendo.ui.progress($(".k-window"), false);
        }
    });

};

var fn_RefrescarGrid = () => {
    $("#gridBultoDetalle").data("kendoGrid").dataSource.read().then(function () { $("#gridBultoDetalle").data("kendoGrid").dataSource.total() === 0 ? KdoComboBoxEnable($("#xcmbIdUni"), true) : KdoComboBoxEnable($("#xcmbIdUni"), false)});
    $("#gridHoja").data("kendoGrid").dataSource.read();
    $("#gridResumenIngreso").data("kendoGrid").dataSource.read();
    KdoButtonEnable($("#btnCrearSerieBulto"), xidHojaBandeo===0 ? false : true);
    KdoButtonEnable($("#btnCrearBulto"), xidHojaBandeo === 0 ? false : true);
    $("#Adjunto").data("kendoUpload").enable(xidHojaBandeo === 0 ? false : true);
};

let fn_dsFiltroUM = function (filtro) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url: TSM_Web_APi + "UnidadesMedidas/GetUnidadesMedidasByFiltro",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(filtro),
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};
var fn_focusControl = () => {
    $("#txtCorte_Rollo").focus();
};

var fn_MostraTablaFm = function (ds, div) {
    let xfm = $("#" + div + "");
    xfm.children().remove();
    xfm.append('<table class="table mt-3" >' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">FM Diseños</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="' + div + '_Det">' +
        '</tbody>' +
        '</table>'
    );

    let xfmDet = $("#" + div + "_Det");
    xfmDet.children().remove();
    $.each(ds, function (index, elemento) {
        if (elemento.NodocCatalogo !== null) {
            xfmDet.append('<tr>' +
                '<td><a class ="btn" data-idbandeosdisenos="' + elemento.IdBandeosDisenos +'" onclick="fn_Get_Fms(this)">' + elemento.NodocCatalogo + '</a></td>' +
                '</tr>');
        }
    });
};

let fn_Get_ListFms = (xId) => {
    kendo.ui.progress($(".k-window"), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFMs/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            fn_MostraTablaFm(datos, "listFM");
            if (datos.length > 0) {
                fn_Fms(datos[0].IdBandeosDisenos);
            } else {
                fn_Fms(0);
            }
            $('#chkEnlazarTsm').prop('checked', datos.length > 0 ? true : false);
            KdoMultiSelectEnable($("#Mtlfm"), datos.length > 0 ? true : false);
         
        },
        error: function () {
            kendo.ui.progress($(".k-window"), false);
        }
    });

};

let fn_Get_Fms = (e) => {
    kendo.ui.progress($(".k-window"), true);
    var obj = $(e);
    let xvIdhbd = obj.data("idbandeosdisenos").toString();
    fn_Fms(xvIdhbd);
   
}

let fn_Fms = (id) => {
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFMsByIdBandeosDis/" + `${xidCliente}/${id}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos.length > 0) {
                $("#txtNombreDiseño").val(datos[0].Nombre);
                $("#txtEstilo").val(datos[0].EstiloDiseno);
                $("#txtNumero").val(datos[0].NumeroDiseno);
                $("#txtPrenda").val(datos[0].NombrePrenda);
                $("#txtPartePrenda").val(datos[0].NombrePrenda);
                $("#txtConfeccion").val(datos[0].NombreConfeccion);
                $("#txtServicio").val(datos[0].NombreServicio);
                $("#txtColor").val(datos[0].ColorTela);
            } else {
                $("#txtNombreDiseño").val("");
                $("#txtEstilo").val("");
                $("#txtNumero").val("");
                $("#txtPrenda").val("");
                $("#txtPartePrenda").val("");
                $("#txtConfeccion").val("");
                $("#txtServicio").val("");
                $("#txtColor").val("");
            }
            kendo.ui.progress($(".k-window"), false);
        },
        error: function () {
            kendo.ui.progress($(".k-window"), false);
        }
    });
}

let fn_DelHbDisenos = function () {

    kendo.ui.progress($(".k-window"), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFMs/" + `${xidHojaBandeo}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos.length > 0) {
                kendo.ui.progress($(".k-window"), true);
                $.ajax({
                    url: TSM_Web_APi + "HojasBandeosDisenos/DelbyIdHoja/" + `${xidHojaBandeo}`,//
                    type: "Delete",
                    dataType: "json",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        RequestEndMsg(data, "Delete");
                        kendo.ui.progress($(".k-window"), false);
                        fn_Get_ListFms(xidHojaBandeo);
                        fn_Get_HojasBandeoDisenos(xidHojaBandeo);
                    },
                    error: function (data) {
                        kendo.ui.progress($(".k-window"), false);
                        $('#chkEnlazarTsm').prop('checked', true);
                        ErrorMsg(data);
                    }
                });
            }
            kendo.ui.progress($(".k-window"), false);
        },
        error: function () {
            kendo.ui.progress($(".k-window"), false);
        }
    });
   
};