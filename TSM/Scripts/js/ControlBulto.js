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
    Kendo_CmbFiltrarGrid($("#xcmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#xcmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione un cliente");
    KdoComboBoxEnable($("#xcmbCliente"), false);
    KdoCmbSetValue($("#xcmbCliente"), xidCliente);
    TextBoxReadOnly($("#txtEstilo"), false);

    // crear boton "Crear Bulto"
    KdoButton($("#btnCrearBulto"), "plus-outline", "Crear Bulto");
    // crear boton Crear serie Bulto
    KdoButton($("#btnCrearSerieBulto"), "plus-outline", "Crear Serie de Bulto");

    KdoButtonEnable($("#btnCrearSerieBulto"), xesNuevo ? false : true);
    KdoButtonEnable($("#btnCrearBulto"), xesNuevo ? false : true);

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
                    NomEstado: { type: "string" },
                    NombreUnidad: { type: "string" }
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
            KdoHideCampoPopup(e.container, "NombreUnidad");
            Grid_Focus(e, "NoDocumento");
        },
        columns: [
            { field: "IdHojaBandeo", title: "Id HojaBandeo", hidden: true },
            { field: "IdMercancia", title: "Id Mercancia",hidden:true },
            { field: "NoDocumento", title: "Bulto/Corte",footerTemplate: "Totales" },
            { field: "Talla", title: "Talla" },
            { field: "Cantidad", title: "Cantidad", footerTemplate: "#: data.Cantidad ? kendo.format('{0:n0}', sum) : 0 #"},
            { field: "Docenas", title: "Docenas", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NomEstado", title: "Estado", hidden: true },
            { field: "IdUnidad", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUnidadesMedidas, "", "Seleccione...", "required", "", "Requerido"], hidden: true, menu: false, filterable: false },
            { field: "NombreUnidad", title: "Unidad", menu: false, filterable: false }
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

    $("#gridBultoDetalle").data("kendoGrid").dataSource.read();
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
            { field: "Cantidad", title: "Cantidad", footerTemplate: "#: data.Cantidad ? kendo.format('{0:n0}', sum) : 0 #"},
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
                    if (input.is("[name='txtCorte_Rollo']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='txtColor']")) {
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
                MsgLong2: function (input) {
                    if (input.is("[name='txtColor']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                }
            },
            messages: {
                MsgRequerido: "Requerido",
                MsgLong1: "Longitud del campo es 20",
                MsgLong2: "Longitud del campo es 200"
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
                Height: "60%",
                Width: "20%",
                MinWidth: "10%"
            }],
            Param: { sidHb: xidHojaBandeo, esRollo: $("#chkRollo").is(':checked') ? true : false, fnRefresh: "fn_RefrescarGrid" },
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
                Height: "70%",
                Width: "20%",
                MinWidth: "10%"
            }],
            Param: { sIdHojaBandeo: xidHojaBandeo, esRollo: $("#chkRollo").is(':checked') ? true : false, fnRefresh: "fn_RefrescarGrid" },
            fn: { fnclose: "fn_RefrescarGrid", fnLoad: "fn_Ini_IngresoBultoSerie", fnReg: "fn_Reg_IngresoBultoSerie", fnActi:"fn_FocusVistaSerie" }
        };

        fn_GenLoadModalWindow(strjson);
    });

   
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
                },
                error: function (data) {
                    kendo.ui.progress($(".k-window"), false);
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
        $("#txtEstilo").val("");
        $('#chkRollo').prop('checked', false);
        $('#chkEnlazarTsm').prop('checked', true);
        KdoCmbSetValue($("#xcmbPlanta"), "");
        $("#Mtlfm").data("kendoMultiSelect").setDataSource(get_CatalogxCliente(xidCliente));
        $("#Mtlfm").data("kendoMultiSelect").value([""]);
    }
    $("#txtCorte_Rollo").focus().select();
    $("#Mtlfm").data("kendoMultiSelect").dataSource.read();
}

var fn_Reg_ControlBulto = (xjson) => {

    xidHojaBandeo = xjson.sIdHB;
    xIdIng = xjson.sIdIngreso;
    xesNuevo = xjson.esNuevo;
    xidCliente = xjson.sIdCliente;
    KdoComboBoxEnable($("#xcmbCliente"), false);
    TextBoxReadOnly($("#txtEstilo"), false);
    KdoCmbSetValue($("#xcmbCliente"), xidCliente);
    if (xidHojaBandeo > 0) {
        //llenar campos de  si existe hoja
        fn_Get_HojasBandeo(xidHojaBandeo);
        KdoButtonEnable($("#btnCrearSerieBulto"), xesNuevo ? false : true);
        KdoButtonEnable($("#btnCrearBulto"), xesNuevo ? false : true);
    } else {
        // cuando no es edicion(registro nuevo)
        $("#txtCorte_Rollo").val("");
        $("#txtColor").val("");
        $("#txtEstilo").val("");
        $("#Mtlfm").data("kendoMultiSelect").value([""]);
        $("#Mtlfm").data("kendoMultiSelect").setDataSource(get_CatalogxCliente(xidCliente))
        $('#chkRollo').prop('checked', false);
        $('#chkEnlazarTsm').prop('checked', true);
        KdoCmbSetValue($("#xcmbPlanta"), "");
        KdoButtonEnable($("#btnCrearSerieBulto"), false );
        KdoButtonEnable($("#btnCrearBulto"), false);
        $("#Mtlfm").data("kendoMultiSelect").dataSource.read();
    }
    //llenar grid detalle
    $("#gridBultoDetalle").data("kendoGrid").dataSource.read();
    $("#gridResumenIngreso").data("kendoGrid").dataSource.read();
    $("#txtCorte_Rollo").focus().select();
}

let get_CatalogxCliente = (xidClie) => {
    return new kendo.data.DataSource({
        sort: { field: "NoReferencia", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "CatalogoDisenos/GetCatalogoByCliente/" + `${xidClie}`,
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
                Rollo: $("#chkRollo").is(':checked') ? 1 : 0,
                Corte: $("#txtCorte_Rollo").val(),
                Color: $("#txtColor").val(),
                IdPlanta: KdoCmbGetValue($("#xcmbPlanta")),
                IdCatalogoDisenosList: $("#Mtlfm").data("kendoMultiSelect").value().toString()
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Bandeo = datos;
                RequestEndMsg(datos, "Post");
                xidHojaBandeo = datos[0].IdHojaBandeo;
                xIdIng = datos[0].IdIngreso;
                KdoButtonEnable($("#btnCrearSerieBulto"), true);
                KdoButtonEnable($("#btnCrearBulto"), true);
                fn_Get_HojasBandeo(datos[0].IdHojaBandeo);
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
                $("#txtEstilo").val(datos.Estilo);
                $("#txtColor").val(datos.Color);
                KdoCmbSetValue($("#xcmbCliente"), datos.IdCliente);
                KdoCmbSetValue($("#xcmbPlanta"), datos.IdPlanta);
                $('#chkRollo').prop('checked', datos.Rollo);
                kendo.ui.progress($(".k-window"), false);
                $("#Mtlfm").data("kendoMultiSelect").setDataSource(get_CatalogxCliente(datos.IdCliente));
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
    $("#gridBultoDetalle").data("kendoGrid").dataSource.read();
    $("#gridHoja").data("kendoGrid").dataSource.read();
    $("#gridResumenIngreso").data("kendoGrid").dataSource.read();
    KdoButtonEnable($("#btnCrearSerieBulto"), xidHojaBandeo===0 ? false : true);
    KdoButtonEnable($("#btnCrearBulto"), xidHojaBandeo === 0 ? false : true);
};


var fn_focusControl = () => {
    $("#txtCorte_Rollo").focus();
};