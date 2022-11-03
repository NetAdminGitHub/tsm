var Permisos;
let xidCliente = 0;
$(document).ready(function () {

    $("#cmbRequerimiento").ControlSeleccionRDs();
    fn_comboBoxCambioRD($("#cmbPrograma"), TSM_Web_APi + "Programas/GetByCliente/0", "Nombre", "IdPrograma", "Seleccione ...", "", "", "", "fn_CreaPrograma");
    Kendo_CmbFiltrarGrid($("#cmbcliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
 
    KdoComboBoxEnable($("#cmbcliente"), false);
    KdoComboBoxEnable($("#cmbPrograma"), false);

    $("#cmbRequerimiento").data("kendoMultiColumnComboBox").focus();
    KdoButton($("#btnConfirmar"), "gear", "Confirmar cambio");
    KdoButtonEnable($("#btnConfirmar"), false);

    $("#cmbRequerimiento").data("kendoMultiColumnComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoComboBoxEnable($("#cmbPrograma"), false);
            $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            KdoButtonEnable($("#btnConfirmar"), false);

        } else {
            fn_GetRDinformacion(value);
            KdoComboBoxEnable($("#cmbcliente"), true);
            KdoComboBoxEnable($("#cmbPrograma"), true);
            $("#cmbcliente").data("kendoComboBox").focus();
            KdoButtonEnable($("#btnConfirmar"), true);
        }
    });
    $("#cmbcliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoComboBox").text("");
        } else {
            $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(value));
        }
    });


  

    $("#btnConfirmar").click(function () {
        if (KdoCmbGetValue($("#cmbcliente")) === null ) {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un cliente ", "error");
            return;
        }
        if (KdoCmbGetValue($("#cmbPrograma")) === null) {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un programa", "error");
            return;
        }
        fn_cambiarClienteOrdenTrabajoRD();
    

    });

});


let fn_GetRDinformacion = (id) => {
    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/GetRequerimientoDesarrollosCambiosbyReq/" + `${id}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                xidCliente = datos.IdCliente;
                $("#txtNombreCliente").val(datos.NombreCliente);
                $("#txtNombrePrograma").val(datos.NoPrograma + " " + datos.NombrePrograma);
            } else {
                $("#txtNombreCliente").val("");
                $("#txtNombrePrograma").val("");
                xidCliente = 0;
            }
        }
    });
};

$.fn.extend({
    SelecionProgbyCliente: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                filterFields: ["IdPrograma", "NoDocumento", "Nombre"],
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: function () { return "[]"; },
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 }
                ]
            });
        });
    }
});

let fn_GetProgramabyCliente = (vidclie) => {
    var model;
    $.ajax({
        url: TSM_Web_APi + "Programas/GetByCliente/" + (vidclie !== null ? vidclie.toString() : 0),
        dataType: "json",
        async: false,
        success: function (result) {
            model = generateModel(result, "IdPrograma");
        }
    });
    return new kendo.data.DataSource({
        batch: true,
        transport: {
            read: {
                url: TSM_Web_APi + "Programas/GetByCliente/" + (vidclie !== null ? vidclie.toString() : 0),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "Programas",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data.models[0]);
                }
            }
        },
        schema: {
            total: "count",
            model: model
        }
    });
};

let fn_cambiarClienteOrdenTrabajoRD = () => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/CambiarClienteRequimiento",
        method: "POST",
        dataType: "json",                                                                                                                                               
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            idRequerimiento: KdoMultiColumnCmbGetValue($("#cmbRequerimiento")),
            idClienteNuevo: KdoCmbGetValue($("#cmbcliente")),
            idPrograma: KdoCmbGetValue($("#cmbPrograma"))
        }),
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");

            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoComboBoxEnable($("#cmbPrograma"), false);


            $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");

            KdoButtonEnable($("#btnConfirmar"), false);
            KdoMultiColumnCmbSetValue($("#cmbRequerimiento"), "");
            $("#cmbRequerimiento").data("kendoMultiColumnComboBox").focus();
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(document.body), false);

        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

fPermisos = function (datos) {
    Permisos = datos;
};


var fn_CreaPrograma = function (widgetId, value) {
    var widget = $("#" + widgetId).getKendoComboBox();;
    var dsProN = widget.dataSource;

    //ConfirmacionMsg("¿Esta seguro de crear el nuevo registro?", function () {
    dsProN.add({
        IdPrograma: 0,
        Nombre: value,
        Fecha: Fhoy(),
        IdCliente: Number(KdoCmbGetValue($("#cmbcliente"))),
        IdTemporada: 1, // como no se pide se coloca por defecto codigo 1 "NO DEFINIDA"
        NoDocumento: "",
        Nombre1: ""
    });

    dsProN.one("sync", function () {
        widget.select(dsProN.view().length - 1);
        $("#kendoNotificaciones").data("kendoNotification").show("Programa creado satisfactoriamente!!", "success");
    });

    dsProN.sync();
    //});
};

//#region pruebas
var fn_comboBoxCambioRD = function (e, webApi, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, fn_crear) {
    $.ajax({
        url: webApi,
        dataType: "json",
        async: false,
        success: function (result) {
            var model = generateModel(result, valueField);
            var dataSource = new kendo.data.DataSource({
                batch: true,
                transport: {
                    read: {
                        url: webApi,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    },
                    create: {
                        url: TSM_Web_APi + "Programas",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8"
                    },
                    parameterMap: function (data, type) {
                        if (type !== "read") {
                            return kendo.stringify(data.models[0]);
                        }
                    }
                },
                schema: {
                    total: "count",
                    model: model
                }
            });
            e.kendoComboBox({
                dataTextField: textField,
                dataValueField: valueField,
                autoWidth: true,
                filter: "contains",
                autoBind: false,
                clearButton: givenOrDefault(clearButton, true),
                placeholder: givenOrDefault(opcPlaceHolder, "Seleccione un valor ...."),
                height: givenOrDefault(opcHeight === "" || opcHeight === 0 ? undefined : opcHeight, 550),
                cascadeFrom: givenOrDefault(parentCascade, ""),
                dataSource: dataSource,
                noDataTemplate: kendo.template("<div>Dato no encontrado.¿Quieres agregar nuevo registro - '#: instance.text() #' ? </div ><br /><button class=\"k-button\" onclick=\"" + fn_crear + "('#: instance.element[0].id #', '#: instance.text() #')\"><span class=\"k-icon k-i-save\"></span>&nbsp;Crear Registro</button>")//$("#noDataTemplate").html()
            });

        }
    });
};

//#endregion 