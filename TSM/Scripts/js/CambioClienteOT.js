var Permisos;
let xidCliente = 0;
$(document).ready(function () {

    $("#cmbOrdenTrabajo").ControlSeleccionOts();
    $("#cmbPrograma").SelecionProgbyCliente();
    Kendo_CmbFiltrarGrid($("#cmbcliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    kdoRbSetValue($("#rbCambioCliente"), true);
    KdoComboBoxEnable($("#cmbcliente"), false);
    KdoMultiColumnCmbEnable($("#cmbPrograma"), false);
    $("#rbCambioCliente").attr('readonly', true);
    $("#rbCambioPrograma").attr('readonly', true);
    $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").focus();
    KdoButton($("#btnConfirmar"), "gear", "Confirmar cambio");
    KdoButtonEnable($("#btnConfirmar"), false);

    $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), false);
            $("#rbCambioCliente").attr('readonly', true);
            $("#rbCambioPrograma").attr('readonly', true);
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoButtonEnable($("#btnConfirmar"), false);

        } else {
            fn_GetOTinformacion(value);
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoComboBoxEnable($("#cmbcliente"), true);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), true);
            $("#rbCambioCliente").attr('readonly', false);
            $("#rbCambioPrograma").attr('readonly', false);
            $("#cmbcliente").data("kendoComboBox").focus();
            KdoButtonEnable($("#btnConfirmar"), true);
        }
    });
    $("#cmbcliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            if (KdoRbGetValue($("#rbCambioCliente")) === true) {
                $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
                KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
                $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
              
            }
        } else {
            if (KdoRbGetValue($("#rbCambioCliente")) === true) {
                $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(value));
            }
        }
    });

    $("#rbCambioPrograma").click(function () {
        if (KdoRbGetValue($("#rbCambioPrograma")) === true) {
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            KdoComboBoxEnable($("#cmbcliente"), false);
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(xidCliente));
            $("#cmbPrograma").data("kendoMultiColumnComboBox").focus();
        }

    });


    $("#rbCambioCliente").click(function () {
        if (KdoRbGetValue($("#rbCambioCliente")) === true) {
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            KdoComboBoxEnable($("#cmbcliente"), true);
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            $("#cmbcliente").data("kendoComboBox").focus();
        }
    });

    $("#btnConfirmar").click(function () {
        if (KdoRbGetValue($("#rbCambioCliente")) === true && (KdoCmbGetValue($("#cmbcliente")) === null || KdoMultiColumnCmbGetValue($("#cmbPrograma")) === null)) {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un cliente o programa", "error");
            return;
        }

        if (KdoRbGetValue($("#rbCambioPrograma")) === true && KdoMultiColumnCmbGetValue($("#cmbPrograma")) === null) {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un programa", "error");
            return;
        }

        if (KdoRbGetValue($("#rbCambioCliente")) === true) {
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

$.fn.extend({
    SelecionProgbyCliente: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
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
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "Programas/GetByCliente/" + (vidclie !== null ? vidclie.toString() : 0),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
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
            idPrograma: KdoMultiColumnCmbGetValue($("#cmbPrograma"))
        }),
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), false);
            $("#rbCambioCliente").attr('readonly', true);
            $("#rbCambioPrograma").attr('readonly', true);
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoButtonEnable($("#btnConfirmar"), false);
            KdoMultiColumnCmbSetValue($("#cmbOrdenTrabajo"), "");
            $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").focus();
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
            idPrograma: KdoMultiColumnCmbGetValue($("#cmbPrograma"))
        }),
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), false);
            $("#rbCambioCliente").attr('readonly', true);
            $("#rbCambioPrograma").attr('readonly', true);
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            kdoRbSetValue($("#rbCambioCliente"), true);
            KdoButtonEnable($("#btnConfirmar"), false);
            KdoMultiColumnCmbSetValue($("#cmbOrdenTrabajo"), "");
            $("#cmbOrdenTrabajo").data("kendoMultiColumnComboBox").focus();
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
