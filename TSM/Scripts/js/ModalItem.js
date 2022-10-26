"use strict"

var Permisos;
let banLoad = 0;
var Item = null;

var fn_Ini_Item = (strjson) => {
    Item = strjson.Item;
    if (banLoad == 0)
    {
        KdoButton($("#btnGuardarItem"), "save", "Guardar");
        KdoButton($("#btnCancelarItem"), "cancel", "Cancelar");
        Kendo_CmbFiltrarGrid($("#cmbEmb"), TSM_Web_APi + "EmbalajeDeclaracionMercancias", "Nombre", "IdEmbalaje", "Seleccione un cliente");
        $("#cmbPais").ControlSeleccionPaises();
        $("#cmbInciAr").ControlSelecionIncisos();
        $("#cmbRegimen").ControlSeleccionRegimen();
        $("#cmbUnidad").ControlSeleccionUnidadesAduanas();
        KdoNumerictextboxEnable($("#numTotalBultos"), false);

        $("#txtPesoN").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        $("#txtPesoB").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        $("#txtValFac").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "c",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        /*$("#txtValFlete").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        $("#txtValSeg").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        $("#txtValOtros").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });*/
        $("#txtValAduana").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "c",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        /*$("#txtDAI").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        $("#txtIVA").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });*/
        $("#txtCantBultos").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        $("#txtCuantia").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "{0:N2}",
            restrictDecimals: true,
            decimals: 2,
            value: 0
        });
        //KdoMultiColumnCmbSetValue($("#cmbPais"), 60);

        banLoad = 1;
    }

    $("#btnCancelarItem").on("click", function () {
        $("#vModalItem").data("kendoWindow").close();
    });

    $("#cmbInciAr").on("change", function () {
        let ml = $("#cmbInciAr").data("kendoMultiColumnComboBox");
        let data = ml.listView.dataSource.data().find(q => q.IdIncisoArancelario === Number(this.value));
        if (data === undefined) {
            $('#txtDesPar').val(null);
        } else {
            $('#txtDesPar').val(data.Descripcion);
        }

    });

    $("#cmbRegimen").on("change", function () {
        let ml = $("#cmbRegimen").data("kendoMultiColumnComboBox");
        let data = ml.listView.dataSource.data().find(q => q.IdTipoTrasladoRegimen === Number(this.value));
        if (data === undefined) {
            $('#txtCodReg').val(null);
        } else {
            $('#txtCodReg').val(data.Nombre);
        }

    });

    $("#cmbUnidad").on("change", function () {
        let ml = $("#cmbUnidad").data("kendoMultiColumnComboBox");
        let data = ml.listView.dataSource.data().find(q => q.IdUnidad === Number(this.value));
        if (data === undefined) {
            $('#txtUnidad').val(null);
        } else {
            $('#txtUnidad').val(data.Abreviatura);
        }

    });

    if (strjson.Item != null)
    {
        $.ajax({
            url: TSM_Web_APi + "/DeclaracionMercanciasItems/GetItemDetalle/" + strjson.IdDM + "/" + strjson.Item,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#txtNoItem").val(result.Item);
                KdoMultiColumnCmbSetValue($("#cmbInciAr"), result.IdIncisoArancelario);
                $("#txtDesPar").val(result.DescripcionInciso);
                $("#txtDesMerc").val(result.Descripcion);
                //KdoMultiColumnCmbSetValue($("#cmbPais"), result.IdPais);
                $("#cmbPais").data("kendoMultiColumnComboBox").value(result.IdPais);
                $("#cmbPais").data("kendoMultiColumnComboBox").text(result.NombrePais);
                $("#cmbPais").data("kendoMultiColumnComboBox").trigger("change");
                KdoMultiColumnCmbSetValue($("#cmbRegimen"), result.IdTipoTrasladoRegimen);
                $("#txtCodReg").val(result.NombreReg);
                kdoNumericSetValue($("#txtPesoN"), result.PesoNeto);
                kdoNumericSetValue($("#txtPesoB"), result.PesoBruto);
                kdoNumericSetValue($("#txtCantBultos"), result.CantidadBultos);
                KdoCmbSetValue($("#cmbEmb"), result.IdEmbalaje);
                kdoNumericSetValue($("#txtCuantia"), result.Cuantia);
                KdoMultiColumnCmbSetValue($("#cmbUnidad"), result.IdUnidadPesoBruto);
                $("#txtUnidad").val(result.Abreviatura);
                kdoNumericSetValue($("#txtValFac"), result.Valor);
                kdoNumericSetValue($("#txtValAduana"), result.ValorAduana);
            },
            error: function (jqXHR, exception) {
                alert(exception);
            }
        });
    }

    $("#btnGuardarItem").on("click", function () {

        let valIncisoAran = KdoMultiColumnCmbGetValue($("#cmbInciAr"));
        let valDescMerc = $("#txtDesMerc").val();
        let valcmbPais = KdoMultiColumnCmbGetValue($("#cmbPais"));
        let valcmbRegimen = KdoMultiColumnCmbGetValue($("#cmbRegimen"));
        let valPesoN = kdoNumericGetValue($("#txtPesoN"));
        let valPesoB = kdoNumericGetValue($("#txtPesoB"));
        let valCantBultos = kdoNumericGetValue($("#txtCantBultos"));
        let valEmb = KdoCmbGetValue($("#cmbEmb"));
        let valCuantia = kdoNumericGetValue($("#txtCuantia"));
        let valUnidad = KdoMultiColumnCmbGetValue($("#cmbUnidad"));
        let valFac = kdoNumericGetValue($("#txtValFac"));
        let valAduana = kdoNumericGetValue($("#txtValAduana"));

        if (valIncisoAran != null && valDescMerc != "" && valcmbPais != null && valcmbRegimen != null && valPesoN != null && valPesoB != null
            && valCantBultos != null && valEmb != null && valCuantia != null && valUnidad != null && valFac != null && valAduana != null) {

            let DeclaracionMercanciasItems = {
                IdDeclaracionMercancia: strjson.IdDM,
                Item: Item,
                IdIncisoArancelario: valIncisoAran,
                IdPais: valcmbPais,
                Descripcion: valDescMerc,
                PesoBruto: valPesoB,
                IdUnidadPesoBruto: valUnidad,
                CantidadBultos: valCantBultos,
                Cuantia: valCuantia,
                IdEmbalaje: valEmb,
                IdUsuarioMod: getUser(),
                FechaMod: kendo.toString(kendo.parseDate(new Date()), 's'),
                Valor: valFac,
                IdTipoTrasladoRegimen: valcmbRegimen,
                PesoNeto: valPesoN,
                ValorAduana: valAduana
            };

            if (Item == null) {
                $.ajax({
                    url: TSM_Web_APi + "DeclaracionMercanciasItems",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(DeclaracionMercanciasItems),
                    success: function (result) {
                        $("#vModalItem").data("kendoWindow").close();
                        let grid = $("#gridDetalleItem").data("kendoGrid");
                        grid.dataSource.add(result[0]);

                        $.ajax({
                            url: TSM_Web_APi + "DeclaracionMercancias/GetDatosCabecera/" + `${strjson.IdDM}`,
                            dataType: 'json',
                            type: 'GET',
                            success: function (dato) {
                                if (dato !== null) {
                                    kdoNumericSetValue($("#numTotalBultos"), dato.TotalBulto);
                                    kdoNumericSetValue($("#numTotalValor"), dato.TotalValor);
                                    kdoNumericSetValue($("#numTotalAduana"), dato.TotalValorAduana);
                                    kdoNumericSetValue($("#numTotalKgs"), dato.TotalPesoBruto);
                                    kdoNumericSetValue($("#numTotalCuantia"), dato.TotalCuantia);
                                    KdoMultiColumnCmbSetValue($("#MltIngreso"), dato.IdIngreso);
                                }
                                kendo.ui.progress($(document.body), false);
                            },
                            error: function () {
                                kendo.ui.progress($(document.body), false);
                            }
                        });

                    },
                    error: function (jqXHR, exception) {
                        alert(exception);
                    }
                });
            }
            else
            {

                $.ajax({
                    url: TSM_Web_APi + "/DeclaracionMercanciasItems/" + strjson.IdDM + "/" + Item,
                    dataType: "json",
                    type: "PUT",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(DeclaracionMercanciasItems),
                    success: function (result) {
                        $("#vModalItem").data("kendoWindow").close();
                        let grid = $("#gridDetalleItem").data("kendoGrid");
                        grid.dataSource.read();

                        $.ajax({
                            url: TSM_Web_APi + "DeclaracionMercancias/GetDatosCabecera/" + `${strjson.IdDM }`,
                            dataType: 'json',
                            type: 'GET',
                            success: function (dato) {
                                if (dato !== null) {
                                    kdoNumericSetValue($("#numTotalBultos"), dato.TotalBulto);
                                    kdoNumericSetValue($("#numTotalValor"), dato.TotalValor);
                                    kdoNumericSetValue($("#numTotalAduana"), dato.TotalValorAduana);
                                    kdoNumericSetValue($("#numTotalKgs"), dato.TotalPesoBruto);
                                    kdoNumericSetValue($("#numTotalCuantia"), dato.TotalCuantia);
                                    KdoMultiColumnCmbSetValue($("#MltIngreso"), dato.IdIngreso);
                                }
                                kendo.ui.progress($(document.body), false);
                            },
                            error: function () {
                                kendo.ui.progress($(document.body), false);
                            }
                        });

                    },
                    error: function (jqXHR, exception) {
                        alert(exception);
                    }
                });
            }

        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Todos los campos son requeridos.", "error");
        }

    });


};

var fn_Reg_Item = (strjson) => {
    Item = strjson.Item;
    if (strjson.Item == null) {
        KdoMultiColumnCmbSetValue($("#cmbInciAr"), "");
        $("#txtDesMerc").val("");
        $("#txtCodReg").val("");
        $("#txtDesPar").val("");
        $("#txtUnidad").val("");
        KdoMultiColumnCmbSetValue($("#cmbPais"), "");
        KdoMultiColumnCmbSetValue($("#cmbRegimen"), "");
        kdoNumericSetValue($("#txtPesoN"), 0);
        kdoNumericSetValue($("#txtPesoB"), 0);
        kdoNumericSetValue($("#txtCantBultos"), 0);
        KdoCmbSetValue($("#cmbEmb"), "");
        kdoNumericSetValue($("#txtCuantia"), 0);
        KdoMultiColumnCmbSetValue($("#cmbUnidad"), "");
        kdoNumericSetValue($("#txtValFac"), 0);
        kdoNumericSetValue($("#txtValAduana"), 0);

        $("#cmbRegimen").on("change", function () {
            let ml = $("#cmbRegimen").data("kendoMultiColumnComboBox");
            let data = ml.listView.dataSource.data().find(q => q.IdTipoTrasladoRegimen === Number(this.value));
            if (data === undefined) {
                $('#txtCodReg').val(null);
            } else {
                $('#txtCodReg').val(data.Nombre);
            }

        });

        $("#cmbUnidad").on("change", function () {
            let ml = $("#cmbUnidad").data("kendoMultiColumnComboBox");
            let data = ml.listView.dataSource.data().find(q => q.IdUnidad === Number(this.value));
            if (data === undefined) {
                $('#txtUnidad').val(null);
            } else {
                $('#txtUnidad').val(data.Abreviatura);
            }

        });

    }
    else
    {
        if (strjson.IdDM != null) {
            $.ajax({
                url: TSM_Web_APi + "/DeclaracionMercanciasItems/GetItemDetalle/" + strjson.IdDM + "/" + strjson.Item,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    $("#txtNoItem").val(result.Item);
                    KdoMultiColumnCmbSetValue($("#cmbInciAr"), result.IdIncisoArancelario);
                    $("#txtDesPar").val(result.DescripcionInciso);
                    $("#txtDesMerc").val(result.Descripcion);
                    //KdoMultiColumnCmbSetValue($("#cmbPais"), result.IdPais);
                    $("#cmbPais").data("kendoMultiColumnComboBox").value(result.IdPais);
                    $("#cmbPais").data("kendoMultiColumnComboBox").text(result.NombrePais);
                    $("#cmbPais").data("kendoMultiColumnComboBox").trigger("change");
                    KdoMultiColumnCmbSetValue($("#cmbRegimen"), result.IdTipoTrasladoRegimen);
                    $("#txtCodReg").val(result.NombreReg);
                    kdoNumericSetValue($("#txtPesoN"), result.PesoNeto);
                    kdoNumericSetValue($("#txtPesoB"), result.PesoBruto);
                    kdoNumericSetValue($("#txtCantBultos"), result.CantidadBultos);
                    KdoCmbSetValue($("#cmbEmb"), result.IdEmbalaje);
                    kdoNumericSetValue($("#txtCuantia"), result.Cuantia);
                    KdoMultiColumnCmbSetValue($("#cmbUnidad"), result.IdUnidadPesoBruto);
                    $("#txtUnidad").val(result.Abreviatura);
                    kdoNumericSetValue($("#txtValFac"), result.Valor);
                    kdoNumericSetValue($("#txtValAduana"), result.ValorAduana);
                },
                error: function (jqXHR, exception) {
                    alert(exception);
                }
            });
        }
    }

};

fPermisos = function (datos) {
    Permisos = datos;
}