/**
 * Funcion para crear un control kendoComboBox a partir de una etiquita input.
 * @param {JQuery} e Input a convertir en kendoComboBox.
 * @param {string} webApi Url de lectura de WebApi Rest
 * @param {string} textField Nombre de campo a mostrar como display
 * @param {string} valueField Nombre de campo a utilizar como value
 * @param {string} opcPlaceHolder Opcion de marca de agua a mostrar en el campo
 * @param {number} opcHeight Alto por defecto del control
 * @param {string} parentCascade Nombre del campo del cual dependerá el ComboBox en cascada
 * @param {string} clearButton activar boton clear
 */
var Kendo_CmbFiltrarGrid = function (e, webApi, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, sizeValue = "large") {
    e.kendoComboBox({
        size: sizeValue,
        dataTextField: textField,
        dataValueField: valueField,
        autoWidth: true,
        filter: "contains",
        autoBind: false,
        clearButton: givenOrDefault(clearButton, true),
        placeholder: givenOrDefault(opcPlaceHolder, "Seleccione un valor ...."),
        height: givenOrDefault(opcHeight === "" || opcHeight === 0 ? undefined : opcHeight, 550),
        cascadeFrom: givenOrDefault(parentCascade, ""),
        dataSource: {
            sort: { field: textField, dir: "asc" },
            transport: {
                read: {
                    url: webApi
                }
            }
        }
    });
};

function Kendo_CmbFocus(e) {
    e.data("kendoComboBox").input.focus().select();
}

function Kendo_CmbGetvalue(e) {
    var combobox = e.data("kendoComboBox");
    return combobox.value() === "" ? 0 : combobox.selectedIndex >= 0 ? combobox.value() : 0;

}

/**
 * Habilita o Inhabilita campo Kendo Combo Box
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Combo box
 * @param {boolean} enable true o false
 */
var KdoComboBoxEnable = function (InputElem, enable) {
    var combobox = InputElem.data("kendoComboBox");
    combobox.enable(enable);
};


/**
 * Funcion para crear un control kendoComboBox a partir de una etiquita input.
 * @param {JQuery} e Input a convertir en kendoComboBox.
 * @param {string} webApi Url de lectura de WebApi Rest
 * @param {string} textField Nombre de campo a mostrar como display
 * @param {string} valueField Nombre de campo a utilizar como value
 * @param {string} opcPlaceHolder Opcion de marca de agua a mostrar en el campo
 * @param {number} opcHeight Alto por defecto del control
 * @param {string} parentCascade Nombre del campo del cual dependerá el ComboBox en cascada
 * @param {string} clearButton activar boton clear,
 * @param {string} fn_crear crea registro
 */
var KdoCmbComboBox = function (e, webApi, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, fn_crear, sizeValue = "large") {
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
                        url: webApi,
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
                size: sizeValue,
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


function generateModel(response, valueField) {

    var sampleDataItem = response[0];

    var model = {};
    var fields = {};
    var isDateField = {};
    for (var property in sampleDataItem) {
        if (property === valueField) {
            model["id"] = property;
        }
        var propType = typeof sampleDataItem[property];

        if (propType === "number") {
            fields[property] = {
                type: "number"
            };
            //if (model.id === property) {
            //    fields[property].editable = false;
            //    fields[property].validation.required = false;
            //}
        }
        else if (propType === "boolean") {
            fields[property] = {
                type: "boolean"
            };
        }
        else
            if (propType === "string") {
                var parsedDate = kendo.parseDate(sampleDataItem[property]);
                if (parsedDate) {
                    fields[property] = {
                        type: "date"
                    };
                    isDateField[property] = true;
                }
                else {
                    fields[property] = {
                        type: "string"
                    };
                }
            }
            else {
                fields[property] = {
                    type: propType,
                    validation: {
                        required: true
                    }
                };
            }
    }

    model.fields = fields;

    return model;
}


var KdoComboBoxbyData = function (e, datos, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, sizeValue = "large") {
    e.kendoComboBox({
        size: sizeValue,
        dataTextField: textField,
        dataValueField: valueField,
        autoWidth: true,
        filter: "contains",
        autoBind: false,
        clearButton: givenOrDefault(clearButton, true),
        placeholder: givenOrDefault(opcPlaceHolder, "Seleccione un valor ...."),
        height: givenOrDefault(opcHeight === "" || opcHeight === 0 ? undefined : opcHeight, 550),
        cascadeFrom: givenOrDefault(parentCascade, ""),
        dataSource: function () { return datos; } 
    });
};
