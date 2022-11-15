function MltSelectGivenOrDefault(given, def) {
    if (typeof given !== "undefined") {
        return given;
    } else {
        return def;
    }
}


function Kendo_MultiSelect(e, WebApi, TextField, ValueField, OpcPlaceholder, Opcheight, sizeOption = "large") {
    e.kendoMultiSelect({
        dataTextField: TextField,
        dataValueField: ValueField,
        dataSource: Get_KendoDataSource(WebApi),
        placeholder: OpcPlaceholder,
        autoWidth: true,
        filter: "contains",
        height: givenOrDefault(Opcheight, 550),
        tagMode: "multiple",
        autoBind: false,
        clearButton: false,
        size: sizeOption
     
    });


}
function KdoMultiSelectDatos(e, datos, TextField, ValueField, OpcPlaceholder, Opcheight, clearButton, sizeOption = "large") {
    e.kendoMultiSelect({
        dataTextField: TextField,
        dataValueField: ValueField,
        dataSource: datos,
        placeholder: OpcPlaceholder,
        autoWidth: true,
        filter: "contains",
        height: givenOrDefault(Opcheight, 550),
        tagMode: "multiple",
        autoBind: false,
        clearButton: givenOrDefault(clearButton, false),
        size: sizeOption
    });
}
/**
 * Habilita o Inhabilita campo Kendo Multi select
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Multi select.
 * @param {boolean} enable true o false
 */
var KdoMultiselectEnable = function (InputElem, enable) {
    var multiselect = InputElem.data("kendoMultiSelect");
    multiselect.enable(enable);
};
