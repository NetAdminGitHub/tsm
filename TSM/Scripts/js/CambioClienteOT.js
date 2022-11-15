var Permisos;
let xidCliente = 0;

$(document).ready(function () {


    $("#cmbOrdenTrabajo").ControlSeleccionOts();
    fn_comboBoxCambio($("#cmbPrograma"), TSM_Web_APi + "Programas/GetByCliente/0", "Nombre", "IdPrograma", "Seleccione ...", "", "", "", "fn_CreaPrograma");
    Kendo_CmbFiltrarGrid($("#cmbcliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoComboBoxEnable($("#cmbcliente"), false);
    KdoComboBoxEnable($("#cmbPrograma"), false);
    $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").focus();
    KdoButton($("#btnConfirmar"), "gear", "Confirmar cambio");
    KdoButtonEnable($("#btnConfirmar"), false);
    $('#chkCambiarCliente').prop('checked', 1);
    KdoCheckBoxEnable($("#chkCambiarCliente"), false);

    $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function (e) {
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
            $('#chkCambiarCliente').prop('checked', 1);
            KdoCheckBoxEnable($("#chkCambiarCliente"), false);

        } else {
            fn_GetOTinformacion(value);
            $('#chkCambiarCliente').prop('checked', 1);
            KdoComboBoxEnable($("#cmbcliente"), true);
           KdoComboBoxEnable($("#cmbPrograma"), true);
            $("#cmbcliente").data("kendoComboBox").focus();
            KdoButtonEnable($("#btnConfirmar"), true);
            KdoCheckBoxEnable($("#chkCambiarCliente"), true);
        }
    });
    $("#cmbcliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            if ($("#chkCambiarCliente").is(':checked') === true) {
                $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(0));
                 KdoCmbSetValue($("#cmbPrograma"), "");
                $("#cmbPrograma").data("kendoComboBox").text("");
              
            }
        } else {
            if ($("#chkCambiarCliente").is(':checked') === true) {
                $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(value));
                KdoCmbSetValue($("#cmbPrograma"), "");
                $("#cmbPrograma").data("kendoComboBox").text("");
            }
        }
    });


    $("#chkCambiarCliente").click(function () {
        if (this.checked) {
             KdoCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            KdoComboBoxEnable($("#cmbcliente"), true);
            $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(0));
            $("#cmbcliente").data("kendoComboBox").focus();

        } else {
             KdoCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), xidCliente);
            KdoComboBoxEnable($("#cmbcliente"), false);
            $("#cmbPrograma").data("kendoComboBox").setDataSource(fn_GetProgramabyCliente(xidCliente));
            $("#cmbPrograma").data("kendoComboBox").focus();
        }
    });

  
    $("#btnConfirmar").click(function () {
       
        if ($("#chkCambiarCliente").is(':checked') === true) {
            fn_cambiarClienteOrdenTrabajo();
        } else {
            fn_cambiarProgramaOrdenTrabajo();
        }

    });

});


let fn_GetOTinformacion = (id) => {
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosCambioCliente/" + `${id}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                xidCliente = datos.IdCliente;
                $("#txtNombreCliente").val(datos.Nombre);
                $("#txtNombrePrograma").val(datos.NoPrograma + " " + datos.NombrePrograma);
            } else {
                $("#txtNombreCliente").val("");
                $("#txtNombrePrograma").val("");
                xidCliente = 0;
            }
        }
    });
};

let fn_GetProgramabyCliente = (vidclie) => {
    //preparar crear datasource para obtner la tecnica filtrado por base
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

let fn_cambiarClienteOrdenTrabajo = () => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/CambiarClienteOrdenTrabajo",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            idOrdentrabajo: KdoMultiColumnCmbGetValue($("#cmbOrdenTrabajo")),
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
            KdoMultiColumnCmbSetValue($("#cmbOrdenTrabajo"), "");
            $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").focus();
            $('#chkCambiarCliente').prop('checked', 1);
            KdoCheckBoxEnable($("#chkCambiarCliente"), false);

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
let fn_cambiarProgramaOrdenTrabajo = () => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/CambiarProgramaOrdenTrabajo",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            idOrdentrabajo: KdoMultiColumnCmbGetValue($("#cmbOrdenTrabajo")),
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
            KdoMultiColumnCmbSetValue($("#cmbOrdenTrabajo"), "");
            $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").focus();
            $('#chkCambiarCliente').prop('checked', 1);
            KdoCheckBoxEnable($("#chkCambiarCliente"), false);

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
var fn_comboBoxCambio = function (e, webApi, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, fn_crear) {
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
                noDataTemplate: kendo.template("<div>Dato no encontrado.¿Quieres agregar nuevo registro - '#: instance.text() #' ? </div ><br /><button class=\"k-button k-button-md k-rounded-md k-button-solid k-button-solid-base\" onclick=\"" + fn_crear + "('#: instance.element[0].id #', '#: instance.text() #')\"><span class=\"k-icon k-i-save\"></span>&nbsp;Crear Registro</button>")//$("#noDataTemplate").html()
            });

        }
    });
};

//#endregion 