'use strict'


var fn_Ini_GenInfo = (xjson) => {
    TextBoxEnable($("#txtCodigoFM"), false);
    TextBoxEnable($("#txtEstilo"), false);
    TextBoxEnable($("#txtDiseño"), false);
    TextBoxEnable($("#txtParte"), false);
    TextBoxEnable($("#txtComposicion"), false);
    TextBoxEnable($("#txtNombrePrenda"), false);
    TextBoxEnable($("#txtNumero"), false);
    fn_DisenoInfLoad(xjson.idCatalogo);
}

var fn_Reg_GenInfo = (xjson) => {
    fn_DisenoInfLoad(xjson.idCatalogo);
}

let fn_DisenoInfLoad = (idCatalogo) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "HojasBandeosDisenos/GetFmxIdCatalogo/" + `${idCatalogo}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            let img = $("#divImagenDiseno");
            img.children().remove();

            if (dato !== null) {
                $("#txtCodigoFM").val(dato.NoReferencia);
                $("#txtDiseño").val(dato.Nombre);
                $("#txtEstilo").val(dato.EstiloDiseno);
                $("#txtParte").val(dato.NombreParte);
                $("#txtComposicion").val(dato.Composicion);
                $("#txtNombrePrenda").val(dato.NombreServicio);
                $("#txtNumero").val(dato.NumeroDiseno);
                img.append('<img class="k-card-image rounded mx-auto d-block" src="/Adjuntos/' + dato.NoReferencia + '/' + dato.NombreArchivo + '" onerror="imgError(this)"  />');
            } else {
                $("#txtCodigoFM").val("");
                $("#txtDiseño").val("");
                $("#txtEstilo").val("");
                $("#txtParte").val("");
                $("#txtComposicion").val("");
                $("#txtNombrePrenda").val("");
                $("#txtNumero").val("");
                img.append('<img class="k-card-image rounded mx-auto d-block" src="' + srcDefault + '"/>')
            }

            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

}
