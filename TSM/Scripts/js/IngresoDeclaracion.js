﻿
var Permisos;
let xIdDeMerca = 0;
$(document).ready(function () {
    xIdDeMerca = xIdDeclaracionMercancia;
    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbPaisExpor"), TSM_Web_APi + "Paises", "Nombre", "IdPais", "Seleccione un pais");
    Kendo_CmbFiltrarGrid($("#cmbAduana"), TSM_Web_APi + "Aduanas", "Nombre", "IdAduana", "Seleccione una aduana");

    //botones
    KdoButton($("#btnGuardarDM"), "save", "Guardar");
    KdoButton($("#btnNotaRemision"), "search", "Nota de Remision");
    KdoButton($("#btnPLgregarItem"), "edit", "Agregar");

    // multicolum
    $("#MltBodegaCliente").ControlSeleccionBodegaClie(xIdClienteIng);
    $("#MltIngreso").ControlSeleccionIngresoMerca(xIdClienteIng);
    // crear campo numeric
    $("#num_Ingreso").kendoNumericTextBox({
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
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalValor"), false);
    $("#numTotalCuantia").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    KdoNumerictextboxEnable($("#numTotalCuantia"), false);

    KdoComboBoxEnable($("#cmbCliente"), false);
    KdoCmbSetValue($("#cmbCliente"), xIdClienteIng);

    TextBoxReadOnly($("#TxtDireccion"), false);

    //crear campo fecha
    $("#dFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFecha").data("kendoDatePicker").value(Fhoy());
    KdoDatePikerEnable($("#dFecha"), false);

    //#region crear item detalle
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "DeclaracionMercanciasItems/GetItemDetalle/" + `${xIdDeMerca}` },
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
                    PrecioUnitario: { type: "number" },
                    IdEmbalaje: { type: "string", defaultValue: function () { return 1; } },
                    NombreEmbalaje: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDetalleItem").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
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
            KdoHideCampoPopup(e.container, "Valor");
            KdoHideCampoPopup(e.container, "NombreEmbalaje");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "DescripcionInciso");
            KdoHideCampoPopup(e.container, "IdEmbalaje");
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

            { field: "IncisoArancelario", title: "IncisoArancelario" },
            { field: "DescripcionInciso", title: "DescripcionInciso", hidden: true },
            { field: "IdPais", title: "Pais", hidden: true },
            { field: "NombrePais", title: "NombrePais", hidden: true },
            { field: "Descripcion", title: "Descripcion" },
            { field: "PesoBruto", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}"},
            { field: "IdUnidadPesoBruto", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Nombre", TSM_Web_APi + "UnidadesMedidas", "", "Seleccione...."], hidden: true },
            { field: "Abreviatura", title: "Unidad" },
            { field: "CantidadBultos", title: "Total de Bultos", editor: Grid_ColNumeric, values: ["required", "1", "9999999999999999", "#", 0] },
            { field: "PrecioUnitario", title: "Precio Unitario", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "Valor", title: "Valor", format: "{0:N2}" },
            { field: "IdEmbalaje", title: "IdEmbalaje", hidden: true /*editor: Grid_Combox, values: ["IdEmbalaje", "Nombre", TSM_Web_APi + "EmbalajeDeclaracionMercancias", "", "Seleccione...."] */},
            { field: "NombreEmbalaje", title: "NombreEmbalaje" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDetalleItem").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true);
    SetGrid_CRUD_ToolbarTop($("#gridDetalleItem").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridDetalleItem").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDetalleItem").data("kendoGrid"), dS);

    var selectedRows = [];
    $("#gridDetalleItem").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetalleItem"), selectedRows);
    });

    $("#gridDetalleItem").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetalleItem"), selectedRows);
    });

    $("#gridDetalleItem").data("kendoGrid").dataSource.read();

    //#endregion 

    //#region crear grid Lista
    let dsVinListEmp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "DeclaracionMercancias/GetbyidDeclaracionMercancias/" + `${xIdDeMerca}` },
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
                id: "IdDeclaracionItemsMercancia",
                fields: {
                    IdDeclaracionItemsMercancia: { type: "number" },
                    IdDeclaracionMercancias: { type: "number" },
                    IdListaEmpaque: { type: "number" },
                    IdHojaBandeo: { type: "number" },
                    IdMercancia: { type: "number" },
                    Estilo: { type: "string" },
                    Fecha: { type: "date" },
                    Cuantia: { type: "number" },
                    Item: { type: "number" },
                    Valor: { type: "number"},
                    Valor2: { type: "string", format: "{0:N2}"}
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#griVincularListaEmpaque").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdListaEmpaque", title: "pl", hidden: true },
            { field: "Estilo", title: "Estilo", hidden: true },
            { field: "Fecha", title: "Fecha", hidden: true, format: "{0: dd/MM/yyyy}" },
            { field: "Cuantia", title: "Cuantía" },
            { field: "Item", title: "Item" },
            { field: "valor", title: "Valor", format: "{0:N2}" },
            { field: "valor2", title: "valor2", format: "{0:N2}" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#griVincularListaEmpaque").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#griVincularListaEmpaque").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#griVincularListaEmpaque").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#griVincularListaEmpaque").data("kendoGrid"), dsVinListEmp);

    var selectedRows2 = [];
    $("#griVincularListaEmpaque").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#griVincularListaEmpaque"), selectedRows2);
    });

    $("#griVincularListaEmpaque").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#griVincularListaEmpaque"), selectedRows2);
    });

    $("#griVincularListaEmpaque").data("kendoGrid").dataSource.read();

    //#endregion 


    $("#btnNotaRemision").click(function () {
        fn_vistaListadoNotaRemision("vModalVerNotasRemi", xIdDeMerca);
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
                    if (input.is("[id='cmbPaisExpor']")) {
                        return $("#cmbPaisExpor").data("kendoComboBox").selectedIndex >= 0;
                    }
                    if (input.is("[id='cmbAduana']")) {
                        return $("#cmbAduana").data("kendoComboBox").selectedIndex >= 0;
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
let fn_Get_IngresoDeclaracion = (xId) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DeclaracionMercancias/GetDatosCabecera/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                KdoMultiColumnCmbSetValue($("#MltBodegaCliente"), dato.IdBodegaCliente);
                KdoMultiColumnCmbSetValue($("#MltIngreso"), dato.NoIngreso);
                KdoCmbSetValue($("#cmbAduana"), dato.IdAduana);
                KdoCmbSetValue($("#cmbPaisExpor"), dato.IdPais);
                $("#TxtNoReferencia").val(dato.NoReferencia);
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.Fecha), 'dd/MM/yyyy'));
                $("#TxtDireccion").val(dato.Direccion);
                kdoNumericSetValue($("#numTotalBultos"), dato.TotalBulto);
                kdoNumericSetValue($("#numTotalValor"), dato.TotalValor);
                kdoNumericSetValue($("#numTotalCuantia"), dato.TotalCuantia);
            } else {
                KdoMultiColumnCmbSetValue($("#MltBodegaCliente"), "");
                KdoMultiColumnCmbSetValue($("#MltIngreso"), "");
                KdoCmbSetValue($("#cmbAduana"), "");
                KdoCmbSetValue($("#cmbPaisExpor"),"");
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
            IdAduana: KdoCmbGetValue($("#cmbAduana")),
            IdPais: KdoCmbGetValue($("#cmbPaisExpor")),
            Estado: "ACTIVO",
            Fecha: kendo.toString(kendo.parseDate($("#dFecha").val()), 's')

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
                //minLength: 3,
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