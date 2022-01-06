var Permisos;
let xidCliente = 0;
$(document).ready(function () {

    $("#cmbRequerimiento").ControlSeleccionRDs();
    $("#cmbPrograma").SelecionProgbyCliente();
    Kendo_CmbFiltrarGrid($("#cmbcliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
 
    KdoComboBoxEnable($("#cmbcliente"), false);
    KdoMultiColumnCmbEnable($("#cmbPrograma"), false);

    $("#cmbRequerimiento").data("kendoMultiColumnComboBox").focus();
    KdoButton($("#btnConfirmar"), "gear", "Confirmar cambio");
    KdoButtonEnable($("#btnConfirmar"), false);

    $("#cmbRequerimiento").data("kendoMultiColumnComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), false);
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
            KdoCmbSetValue($("#cmbcliente"), "");
            KdoButtonEnable($("#btnConfirmar"), false);

        } else {
            fn_GetRDinformacion(value);
            KdoComboBoxEnable($("#cmbcliente"), true);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), true);
            $("#cmbcliente").data("kendoComboBox").focus();
            KdoButtonEnable($("#btnConfirmar"), true);
        }
    });
    $("#cmbcliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
        } else {
            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(value));
        }
    });


  

    $("#btnConfirmar").click(function () {
        if (KdoCmbGetValue($("#cmbcliente")) === null ) {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un cliente ", "error");
            return;
        }
        if (KdoMultiColumnCmbGetValue($("#cmbPrograma")) === null) {
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
            idPrograma: KdoMultiColumnCmbGetValue($("#cmbPrograma"))
        }),
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            $("#txtNombreCliente").val("");
            $("#txtNombrePrograma").val("");

            KdoComboBoxEnable($("#cmbcliente"), false);
            KdoMultiColumnCmbEnable($("#cmbPrograma"), false);


            $("#cmbPrograma").data("kendoMultiColumnComboBox").setDataSource(fn_GetProgramabyCliente(0));
            KdoMultiColumnCmbSetValue($("#cmbPrograma"), "");
            $("#cmbPrograma").data("kendoMultiColumnComboBox").text("");
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
