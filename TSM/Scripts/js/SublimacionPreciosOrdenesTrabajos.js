﻿
let UrlClie = TSM_Web_APi + "Clientes";
var Permisos;
let VIdCliente = 0;
let data;
$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), "");
    KdoButton($("#btnCambioEstado"), "gear", "Cambiar estado");
    KdoButton($("#btnRefrescar"), "reload", "Actualizar");
    KdoButton($("#btnAceptarCambiar"), "check", "Cambiar Estado");
    KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(false));
    KdoButtonEnable($("#btnRefrescar"), false);

    KdoMultiSelectDatos($("#CmbMultiComboNoDocmuento"), "[]", "NoDocumento", "IdRequerimiento", "Seleccione ...", 100, true);
    Kendo_CmbFiltrarGrid($("#cmbEstados"), TSM_Web_APi +"EstadosSiguientes/GetEstadosSiguientes/RequerimientoDesarrollos/DESARROLLO/true", "Nombre", "EstadoSiguiente", "Seleccione un Cliente ....");

   

    $("#ModalCambioEstado").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Cambio de estado",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    $("#btnCambioEstado").click(function () {
        let lista = "";
        let Datos;
        $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value("");
        $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").setDataSource(fn_ComboNoDocumento());
        KdoCmbSetValue($("#cmbEstados"), "CONFIRMADO");
        Datos = fn_GetNoDocumentosByCliente();
        $.each(Datos, function (index, elemento) {
            if (elemento.Completado===true) {
                lista = lista + elemento.IdRequerimiento + ",";
            }
          
        });
        $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value(lista.split(","));

        $("#ModalCambioEstado").data("kendoDialog").open().toFront();
    });

    $("#btnRefrescar").click(function () {
        Fn_ConsultarSibli(KdoCmbGetValue($("#CmbIdCliente")));
    });

    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION

    fn_partesSublimado();
    Grid_HabilitaToolbar($("#gridPartes"), false, false, false);
    //#endregion FIN GRID PRINCIPAL

    //#region seleccion de servicio y cliente

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_ConsultarSibli(this.dataItem(e.item.index()).IdCliente.toString());
            KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(true));
            KdoButtonEnable($("#btnRefrescar"), true);
        } else {
            Fn_ConsultarSibli(0);
            KdoButtonEnable($("#btnCambioEstado"), false);
            KdoButtonEnable($("#btnRefrescar"), false);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarSibli(0);
            KdoButtonEnable($("#btnCambioEstado"), false);
            KdoButtonEnable($("#btnRefrescar"), false);
        }
    });

    let ValidRD = $("#FrmModalCambioEstado").kendoValidator(
        {
            rules: {
                vcmbEstados: function (input) {
                    if (input.is("[name='cmbEstados']")) {
                        return $("#cmbEstados").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbMulti: function (input) {
                    if (input.is("[name='CmbMultiComboNoDocmuento']")) {
                        return $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value().length > 0;
                    }
                    return true;
                }
            },
            messages: {
                vcmbEstados: "Requerido",
                CmbMulti: "Requerido"    
            }
        }
    ).data("kendoValidator");


    $("#btnAceptarCambiar").click(function () {
        if (ValidRD.validate()) {

            kendo.ui.progress($(".k-dialog"), true);
            $.ajax({
                url: TSM_Web_APi + "RequerimientoDesarrollos/RequerimientoDesarrollos_CambiarEstadoSublimacion",
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    Id: 0,
                    EstadoSiguiente: KdoCmbGetValue($("#cmbEstados")),
                    Motivo: "SUBLIMACION CAMBIO ESTADO POR :" + KdoCmbGetText($("#cmbEstados")),
                    StringIdRequerimiento: $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value().toString()
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    $("#gridPartes").data("kendoGrid").dataSource.read();
                    $("#ModalCambioEstado").data("kendoDialog").close();
                    RequestEndMsg(data, "Post");
                },
                error: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    ErrorMsg(data);
                }
            });
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    //#endregion
});


let Fn_ConsultarSibli = function (IdCliente) {
    VIdCliente = Number(IdCliente);
    //leer grid

    $("#gridPartes").data("kendoGrid").dataSource.read().then(function () {
        $("#gridPartes").data("kendoGrid").dataSource.total() === 0 ? Grid_HabilitaToolbar($("#gridPartes"), false, false, false) : Grid_HabilitaToolbar($("#gridPartes"), Permisos.SNAgregar, Permisos.SNEditar, false);
        $("#gridPartes").data("kendoGrid").dataSource.total() === 0 ? KdoButtonEnable($("#btnCambioEstado"), false) : KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(true));
       
    });
};
var fPermisos = function (datos) {
    Permisos = datos;
};
let fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};
let fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};
let fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};
let fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};
let fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};
let fn_partesSublimado = function () {
    //#region partes de sublimado

    let UrlPParte = TSM_Web_APi + "PrendasPartes";
    let UrlUbic = TSM_Web_APi + "Ubicaciones";
    let UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
    let dset = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlPParte + "/GetByidCliente/" + VIdCliente; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPParte + "/" + datos.IdRequerimiento + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPParte + "/" + datos.IdRequerimiento + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "DELETE"
            },
            create: {
                url: UrlPParte,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdRequerimiento: { type: "string" },
                    NombreProgra: {type:"string"},
                    IdCategoriaPrenda: {
                        type: "number"
                    },
                    NoDocumento: {type: "string"},
                    NombrePrenda: { type: "string" },
                    NombreDiseño: { type: "string" },
                    EstiloDiseno: { type: "string"},
                    IdUbicacion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUbicacion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Cantidad']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Cantidad']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Precio']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return Permisos.SNConfidencial === true ? $("[name='Precio']").data("kendoNumericTextBox").value() > 0 : true;
                                }
                                if (input.is("[name='IdRequerimiento']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("[name='IdRequerimiento']").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;

                            }
                        }
                    },
                    NombreParte: { type: "string" },
                    Cantidad: { type: "number" },
                    IdUnidad: { type: "string", defaultValue: 9 },
                    NombreUnidad: { type: "string" },
                    Precio: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },
            { field: "Precio", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPartes").kendoGrid({
        edit: function (e) {
            $('[name="IdUnidad"]').data("kendoComboBox").setDataSource(fn_DSIdUnidadFiltro("9,17"));
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "NombreParte");
            KdoHideCampoPopup(e.container, "NombreUnidad");
            KdoHideCampoPopup(e.container, "NombreProgra");
            KdoHideCampoPopup(e.container, "NombreDiseño");
            KdoHideCampoPopup(e.container, "NombrePrenda");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
           
            $('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox").bind("change", function () {
                var multicolumncombobox = $('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox");
                let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdRequerimiento === Number($('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox").value()));
                if (data !== undefined) {
                    $('[name="IdCategoriaPrenda"]').data("kendoNumericTextBox").value(data.Prenda);
                    $('[name="IdCategoriaPrenda"]').data("kendoNumericTextBox").trigger("change");
                }
              
            });

            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdUbicacion");
                TextBoxEnable($("[name='NoDocumento']"), false);
                var multicolumncombobox = $('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox");
                multicolumncombobox.select(function (dataItem) { return dataItem.IdRequerimiento === e.model.IdRequerimiento; });
                multicolumncombobox.search(e.model.NoDocumento);
                multicolumncombobox.refresh();
                multicolumncombobox.text(e.model.NoDocumento);
                multicolumncombobox.close();
                multicolumncombobox.enable(false);
                Grid_Focus(e, "Cantidad");

            } else {
                Grid_Focus(e, "IdRequerimiento");
            }
          
           
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "IdRequerimiento", title: "No Orden Trabajo",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")));
                }, hidden: true
            },
            {
                field: "NombreProgra", title: "Programa",lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "NombreDiseño", title: "Nombre del Diseño" },
            {
                field: "NoDocumento", title: "No OT", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "IdCategoriaPrenda", title: "Codigo IdCategoriaPrenda", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0],   hidden: true },
            {
                field: "NombrePrenda", title: "Prenda", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "IdUbicacion", title: "Parte", editor: Grid_Combox, values: ["IdUbicacion", "Nombre", UrlUbic, "", "Seleccione...."], hidden: true },
            {
                field: "NombreParte", title: "Parte", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }

            },
            {
                field: "EstiloDiseno", title: "Estilo del Diseno",
                lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "Cantidad", title: "Cantidad", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0], footerTemplate: "Total: #: data.Cantidad ? sum : 0 #" },
            { field: "IdUnidad", title: "Unidad", editor: Grid_ComboxData, values: ["IdUnidad", "Abreviatura", "[]", "Seleccione....", "", "", ""], hidden: true },
            { field: "NombreUnidad", title: "Unidad" },
            { field: "Precio", title: "Precio", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c2", 2], format: "{0:c2}", footerTemplate: "Total: #: data.Precio ? kendo.format('{0:c2}', sum) : 0 #", menu: false },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPartes").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, false, redimensionable.Si,600,true,"row");
    SetGrid_CRUD_ToolbarTop($("#gridPartes").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPartes").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridPartes").data("kendoGrid"), dset);
  
    var selectedRows = [];
    $("#gridPartes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPartes"), selectedRows);
    });

    $("#gridPartes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPartes"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPartes"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridPartes"), $(window).height() - "371");

    //#endregion

    let fn_DSIdUnidadFiltro = function (filtro) {

        return new kendo.data.DataSource({
            dataType: 'json',
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        dataType: 'json',
                        type: "POST",
                        async: false,
                        url: UrlUniMed + "/GetUnidadesMedidasByFiltro",
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

};

let fn_ComboNoDocumento = function () {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "NoDocumento", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    async: false,
                    url: TSM_Web_APi + "PrendasPartes/GetNoDocumentosByCliente/" + KdoCmbGetValue($("#CmbIdCliente")),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

var fn_GetNoDocumentosByCliente = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "PrendasPartes/GetNoDocumentosByCliente/" + KdoCmbGetValue($("#CmbIdCliente")),
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    return result;
};
