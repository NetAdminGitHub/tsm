$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");
    $("#cmbOD").ControlSeleccionOD(0, 0);

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource([]);
        }
    });

    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        let cliente = this.dataItem(e.item.index()).IdCliente;
        let planta = KdoCmbGetValue($("#cmbPlanta"));

        if (e.item) {
            if (planta == "" || planta == 0 || planta == undefined || planta == null) {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, 0));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            }
            else
            {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, planta));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");  
            }
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            let cliente = KdoCmbGetValue($("#cmbCliente"));
            KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            if (cliente != "" && cliente != 0 && cliente != undefined && cliente != null)
            {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, 0));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            }
        }
    });

    $("#cmbPlanta").data("kendoComboBox").bind("select", function (e) {
        let cliente = KdoCmbGetValue($("#cmbCliente"));
        let planta = this.dataItem(e.item.index()).IdPlanta;

        if (e.item) {
            if (cliente != "" && cliente != 0 && cliente != undefined && cliente != null) {
                $("#cmbOD").data("kendoMultiColumnComboBox").setDataSource(getODS(cliente, planta));
                KdoMultiColumnCmbSetValue($("#cmbOD"), "");
            }
        }
    });

});

let getODS = (cliente, planta) => {
    return new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "DespachosMercancias/GetOrdenesDespachar/" + cliente + "/" + planta + "/" + 0,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

fPermisos = function (datos) {
    Permisos = datos;

}