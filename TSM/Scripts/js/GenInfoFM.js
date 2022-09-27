'use strict'


var fn_Ini_GenInfo = (xjson) => {

    KdoComboBoxFM($("#cmbFM"), "[]", "NodocCatalogo", "IdCatalogoDiseno", "Seleccione un Diseño", "", "", false);

    TextBoxEnable($("#txtEstilo"), false);
    TextBoxEnable($("#txtDiseño"), false);
    TextBoxEnable($("#txtParte"), false);
    TextBoxEnable($("#txtComposicion"), false);
    TextBoxEnable($("#txtNombrePrenda"), false);
    TextBoxEnable($("#txtNumero"), false);
    TextBoxEnable($("#txtProducto"), false);
    TextBoxEnable($("#txtColorTela"), false);
    TextBoxEnable($("#txtServicio"), false);
    
    setFMCbxData(xjson.pIdHojaBandeo);

    $("#cmbFM").data("kendoComboBox").bind("change", function () {
        let idCatalogo = this.value() === "" ? 0 : this.value();
        infoDiseno(idCatalogo);
    });
}

var fn_Reg_GenInfo = (xjson) => {
    setFMCbxData(xjson.pIdHojaBandeo);
}

const setFMCbxData = (IdHojaBandeo) => {
    let dsFM = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `HojasBandeosDisenos/GetFMs/${IdHojaBandeo}`
                },
                contentType: "application/json; charset=utf-8"
            }
        }
    });
    $("#cmbFM").data("kendoComboBox").setDataSource(dsFM);
    setTimeout(function () {
        let cbFM = $("#cmbFM").data("kendoComboBox");
        cbFM.value("");

        if (cbFM.dataSource.data().length > 0) {
            cbFM.select(cbFM.ul.children().eq(0));
            infoDiseno(KdoCmbGetValue($("#cmbFM")));
        }
    }, 250);
}

const infoDiseno = (idCatalogo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFmxIdCatalogo/" + `${idCatalogo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            let img = $("#divImagenDiseno");
            img.children().remove();

            if (dato !== null) {
                $("#txtDiseño").val(dato.Nombre);
                $("#txtEstilo").val(dato.EstiloDiseno);
                $("#txtColorTela").val(dato.ColorTela);
                $("#txtParte").val(dato.NombreParte);
                $("#txtProducto").val(dato.NombrePrenda);
                $("#txtServicio").val(dato.NombreServicio);
                $("#txtNumero").val(dato.NumeroDiseno);
                $("#txtComposicion").val(dato.Composicion);

                img.append('<img class="k-card-image rounded mx-auto d-block" src="/Adjuntos/' + dato.NoReferencia + '/' + dato.NombreArchivo + '" onerror="imgError(this)"  />');
            } else {
                $("#txtDiseño").val("");
                $("#txtEstilo").val("");
                $("#txtColorTela").val("");
                $("#txtParte").val("");
                $("#txtProducto").val("");
                $("#txtServicio").val("");
                $("#txtNumero").val("");
                $("#txtComposicion").val("");

                img.append('<img class="k-card-image rounded mx-auto d-block" src="' + srcDefault + '"/>')
            }

            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
}

const KdoComboBoxFM = function (e, datos, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton) {
    e.kendoComboBox({
        dataTextField: textField,
        dataValueField: valueField,
        autoWidth: true,
        filter: "contains",
        clearButton: givenOrDefault(clearButton, true),
        placeholder: givenOrDefault(opcPlaceHolder, "Seleccione un valor ...."),
        height: givenOrDefault(opcHeight === "" || opcHeight === 0 ? undefined : opcHeight, 550),
        cascadeFrom: givenOrDefault(parentCascade, ""),
        dataSource: function () { return datos; }
    });
};