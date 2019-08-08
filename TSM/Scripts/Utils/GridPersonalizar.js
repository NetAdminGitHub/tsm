//funcion opcion default.
function givenOrDefault(given, def ) {
    if (typeof given !== "undefined") {
        return given;
    } else {
        return def;
    }
}

//opciones modo edicion

const ModoEdicion = {
    EnLinea: "inline",
    EnPopup: "popup",
    Batch:"batch",
    NoEditable: false
};
// opciones redimencional.
const redimensionable = {
    Si: true,
    No: false
};

var windowMensaje;
// configuracion de propiedades standares del grid.
/**
 * Activa o Desactiva propiedades del grid.
 * @param {kendo.ui.Grid} e Grid contenedor de la funcion
 * @param {const} ModoEdicion opciones ModoEdicion.EnLinea, ModoEdicion.EnPopup o ModoEdicion.NoEditable
 * @param {boolean} Paginable Muesta u Oculta barra de paginación.
 * @param {boolean} Filtrable Activa filtro para cada una de las columnas del grid.
 * @param {boolean} Ordenable Activa en el grid la ordenación Asc o Desc.
 * @param {boolean} ColMenu Activa el menu emergente para las columnas del grid, que contiene las opciones: 1. Columnas: para mostrar o ocultar , 2. Orden Ascendente y  3. Orden Descendente
 * @param {boolean} redimensionable colocar true para que los usuarios puedan cambiar el tamaño de la columna
 * @param {number} Opcheight valor opcional puede colocar alto del grid.
 * @param {string} selectable Si se establece en trueel usuario sería capaz de seleccionar filas de la cuadrícula. Por defecto la selección está deshabilitada.
                        También se puede establecer en los siguientes valores de cadena:
                            "fila": el usuario puede seleccionar una sola fila.
                             "celda": el usuario puede seleccionar una sola celda.
                                "multiple, row": el usuario puede seleccionar varias filas.
                                "múltiple, celda": el usuario puede seleccionar varias celdas.
 * @param {string} FiltroModo modo de filtros puede ser :"row", "menu", "menu,row" las tres son validas siempre y cuando este activo el filtro.


 */
function SetGrid(e, ModoEdicion, Paginable, Filtrable, Ordenable, ColMenu, redimensionable, Opcheight, selectable,FiltroModo) {
  
    ModoEdicion: givenOrDefault(ModoEdicion, "popup");
    OpcGrid={
        sortable: givenOrDefault(Ordenable, true),
        filterable: givenOrDefault(Filtrable, true) === true ? (givenOrDefault(FiltroModo, "") === "" ? true : { mode : FiltroModo }) : false,
        columnMenu: givenOrDefault(ColMenu, true),
        editable: ModoEdicion !== "popup" ? ModoEdicion ==="batch" ? true : ModoEdicion : {
            mode: ModoEdicion,
            update: true,
            createAt: "bottom",
            window: {
                title:"Editar"
            }
        },
        scrollable: true,
        navigatable: true,
        resizable: givenOrDefault(redimensionable, true),
        selectable: givenOrDefault(selectable, true),
        pageable: !givenOrDefault(Paginable, true) ? false : {
            input: true,
            refresh: true,
            pageSizes: [20, 50, 100, "all"]
        },
        height: Opcheight === 0 ? "100 %" : givenOrDefault(Opcheight, 600)
        
    };

    e.setOptions($.extend({}, e.getOptions(), OpcGrid));
}

// habilitar CRUD en la barra de toolbars grid.
/**
 *  Activa CRUD en la toolbar de grid (Obsoleto no debe usarse.)
 * @param {kendo.ui.Grid} e  Grid contenedor de la funcion
 * @param {boolean} Create Muestra boton Agregar.
 * @param {boolean} Save Muestra boton Editar.
 * @param {boolean} Cancelar Muestra boton cancelar.
 */
function SetGrid_CRUD_ToolbarBatch(e, Create, Save, Cancelar) {
    var opciones = [];
    if (Create) opciones.push("create");
    if (Save) opciones.push("save");
    if (Cancelar) opciones.push("cancel");
    
    if (Create === false && Save === false && Cancelar === false) {
        Opctoolbar = { toolbar: false };
    }
    else {
        Opctoolbar = { toolbar: opciones };
    }
   
    e.setOptions($.extend({}, e.getOptions(), Opctoolbar));

}
/**
 * Activa CRUD en la toolbar de grid
 * @param {kendo.ui.Grid} e  Grid contenedor de la funcion
 * @param {boolean} agregar Muestra boton Agregar.
 */
function SetGrid_CRUD_ToolbarTop(e, agregar) {
    var opciones = [];
    if (agregar) opciones.push({ name: "create", text: "", iconClass: "k-icon k-i-plus" });


    if (agregar === false) {
        Opctoolbar = { toolbar: false };
    }
    else {
        Opctoolbar = { toolbar: opciones };
    }

    e.setOptions($.extend({}, e.getOptions(), Opctoolbar));

}

// habilitar CRUD en la columna grid.
/**
 * Activa CRUD en la columna grid, 
 * @param {kendo.ui.Grid} e  Grid contenedor de la funcion
 * @param {boolean} editar Muestra boton Editar.
 * @param {boolean} borrar Muestra boton Eliminar.
 * @param {string} Id_GridDetalle colocar id cuando sea un grid detalle para el funcionamiento del boton elminar.
 */
function SetGrid_CRUD_Command(e, editar, borrar, Id_GridDetalle) {

    if (givenOrDefault(Id_GridDetalle, "") !== "" && e.element.parent().attr("class") === "k-detail-cell") {
        e.element.attr('id', Id_GridDetalle + Date.now().toString());
    }

    $("#" + Id_GridDetalle + "").children().remove();

    var EliminarTemplate = kendo.template("<span id='" + Id_GridDetalle + "'><div class='float-left'><span class='k-icon k-i-question' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>¿Está seguro que desea eliminar el registro?</p><div class='float-right'><button class='k-button k-primary' id='yesButton_" + e.element.attr('id') + "' style='width: 75px;'>Si</button> <button class='k-button' id='noButton_" + e.element.attr('id') +"' style='width: 75px;'>No</button></div></span>");
    var windowEliminar = $("<div />").kendoWindow({
        title: "Confirmación" ,
        visible: false,
        width: "400px",
        height: "200px",
        modal: true
    }).data("kendoWindow");

    var EliminarClick = function (ep) {
        ep.preventDefault();
        var tr = $(ep.target).closest("tr");
        var data = this.dataItem(tr);
        windowEliminar.content(EliminarTemplate(data));
        windowEliminar.center().open();

        $("#yesButton_" + e.element.attr('id') + "").click(function () {
            e.dataSource.remove(data);
            e.dataSource.sync();
            windowEliminar.close();
        });
        $("#noButton_" + e.element.attr('id') + "").click(function () {
            windowEliminar.close();
        });
    };

    var opciones = [];
    var columns = e.columns;
    var w = 0;

    if (editar) opciones.push({ name: "edit", text: "", iconClass: "k-icon k-i-edit" });

    if (givenOrDefault(Id_GridDetalle, "") !== "" && e.element.parent().attr("class") === "k-detail-cell") {
        // cuando es un grid detalle
        if (borrar) opciones.push({ name: "EliminarDet", click: EliminarClick, iconClass: "k-icon k-i-delete", text: "" });
    }
    else {
        // grdi maestro.
        if (borrar) opciones.push({ name: "Eliminar", click: EliminarClick, iconClass: "k-icon k-i-delete", text: "" });
    }
   
    // habilitar o deshabilitar el modo edicion cuando el usuario presiona <enter> en la fila
    e.options.editable.update = editar;

    //if (editar) w = w + 120;
    //if (borrar) w = w + 120;

    if (editar === true || borrar === true) {
        var Opccommand = "";
        if (editar) {
            Opccommand = {
                columns: columns.concat([{
                    field: "cmdEdit", title: "&nbsp;", menu: false, filterable: { cell: { enabled: false } },
                    command: opciones[0], width: 70 + "px", attributes: {

                        style: "text-align: center"
                    }
                }])
            };
        }
        e.setOptions($.extend({}, e.getOptions(), Opccommand));

        if (borrar) {
            Opccommand = {
                columns:  Opccommand === "" ? columns.concat([{
                    field: "cmdDel", title: "&nbsp;", menu: false, filterable: { cell: { enabled: false }},
                    command: opciones[0], width: 70 + "px", attributes: {

                        style: "text-align: center"
                    }
                }]) : Opccommand.columns.concat([{
                        field: "cmdDel", title: "&nbsp;", menu: false, filterable: { cell: { enabled: false } },
                        command: opciones[1], width: 70 + "px", attributes: {

                            style: "text-align: center"
                        }
                }])
            };
        }
        e.setOptions($.extend({}, e.getOptions(), Opccommand));

    }

}
/**
 * Asignar la fuente de datos, a través de la opción dataSource
 * @param {kendo.ui.Grid} e  Grid contenedor de la funcion
 * @param {dataSource} ds configuracíon datasource
 * @param {number} TamañoPagina Paremtro Opcional, Numero de registros de datos que se mostrarán en la cuadrícula 
 */
function Set_Grid_DataSource(e, ds, TamañoPagina) {

    DSource = {
        dataSource: ds,
        noRecords: {
            template: "No hay datos disponibles. La pagina actual es: #=this.dataSource.page()#"
        }
    };
    e.setOptions($.extend({}, e.getOptions(), DSource));
    e.dataSource.pageSize(givenOrDefault(TamañoPagina, 50));

    // aplicar tooltips a botones de edicion y eliminacion del grid

    $("#" + e.element.attr('id') + "").kendoTooltip({
        filter: ".k-grid-edit",
        content: function (e) {
            return "Editar";
        }
    });

    $("#" + e.element.attr('id')+"").kendoTooltip({
        filter: ".k-grid-Eliminar",  
        content: function (e) {
            return "Eliminar";
        }
    });

    $("#" + e.element.attr('id') + "").kendoTooltip({
        filter: ".k-grid-add",
        content: function (e) {
            return "Agregar";
        }
    });
}

// colocar ckecbox en columna del grid

var Grid_ColCheckbox = function (container, options) {
    var guid = kendo.guid();
    var columName = options.field;
    $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="' + columName + '" data-type="boolean" data-bind="checked:' + columName + '">').appendTo(container);
    $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
};

var Grid_ColRadiobutton = function (container, options) {
    var guid = kendo.guid();
    var columName = options.field;
    $('<input class="k-radio" id="' + guid + '" type="radio" name="' + columName + '" data-type="boolean" data-bind="checked:' + columName + '">').appendTo(container);
    $('<label class="k-radio-label" for="' + guid + '">&#8203;</label>').appendTo(container);
};

// Columna como CheckBox
var Grid_ColTemplateCheckBox = function (data, columna) {
    return "<input id=\"" + data.id + "\" type=\"checkbox\" class=\"k-checkbox\" disabled=\"disabled\"" + (data[columna] ? "checked=\"checked\"" : "") + " />" +
        "<label class=\"k-checkbox-label\" for=\"" + data.id + "\"></label>";
};


// FORMATO NUMERICO CON DECIMALES.
var Grid_ColNumeric = function (container, options) {
    $('<input ' + options.values[0] +' data-bind="value:' + options.field + '" name="' + options.field + '" />')
        .appendTo(container)
        .kendoNumericTextBox({
            min: options.values[1],
            max: options.values[2],
            format: options.values[3],
            restrictDecimals: options.values[4] === 0,
            decimals: options.values[4],
            valuePrimitive: true,
            step: options.values[5] === undefined || options.values[5] === "" ? 1 : options.values[5]
        });
};

// FORMATO NUMERICO SIN DECIMALES.
var Grid_ColInt64NumSinDecimal = function (container, options) {
    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />')
        .appendTo(container)
        .kendoNumericTextBox({
            format: "#",
            decimals: 0,
            restrictDecimals: true,
            min: 0,
            max: 999999999999999999
        });
      
};

// FORMATO NUMERICO SIN DECIMALES.
var Grid_ColIntNumSinDecimal = function (container, options) {
    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />')
        .appendTo(container)
        .kendoNumericTextBox({
            format: "#",
            decimals: 0,
            restrictDecimals: true,
            min: 0,
            max: 999999999
        });

};


// Funcion para desabilitar o bloquear campo
var Grid_ColLocked = function (container, options) {
    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />')
        .appendTo(container)
        .attr("disabled", "disabled")
        .addClass("k-input k-textbox");
  
};

// funcion para lista desplegables
function Grid_CmbEditor(container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            valuePrimitive: true,
            autoBind: true,
            dataTextField: options.values[0],
            dataValueField: options.field,
            autoWidth: true,
            placeholder: givenOrDefault(options.values[3],"Seleccione un valor ...."),
            filter: "contains",
            dataSource: {
                sort: { field: options.values[0], dir: "asc" },
                transport: {
                    read: options.values[2] === "" ? options.values[1] : options.values[1] + "/" + options.values[2]

                  
                }
            }
        });
}

/**
 * Crea un ComboBox para ser utlizado en un editor de un Kendo.UI.Grid utilizando Ajax y enviando parametros en formato JSON
 * @param {kendo.ui.Grid} container Grid contenedor de la funcion.
 * @param {string[]} options Listado de opciones: 0 - dataValue, 1 - dataText, 2 - urlRead, 3 - params ejemplo Declarar variable var obj = { idTecnica: 3, EsPapel: false, EsRhinestone: true } , 4 - placeHolder, 5 - required, 6 - cascadeFrom, 7 - validationMessage
 */
function Grid_ComboxAjax(container, options) {
    var required = givenOrDefault(options.values[5], "");
    var Message = givenOrDefault(options.values[7], "");
    var validationMessage = Message === "" ? "" : " validationMessage =" + Message;

    $('<input ' + required + validationMessage + ' id="' + options.field + '" name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            valuePrimitive: true,
            autoBind: true,
            dataTextField: options.values[1],
            dataValueField: options.values[0],
            autoWidth: true,
            cascadeFrom: givenOrDefault(options.values[6], ""),
            placeholder: givenOrDefault(options.values[4], "Seleccione un valor ...."),
            filter: "contains",
            dataSource: {
                sort: { field: options.values[1], dir: "asc" },
                transport: {
                    read: function (datos) {
                        $.ajax({
                            type: "POST",
                            dataType: 'json',
                            data: JSON.stringify(options.values[3]),
                            url: options.values[2],
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                datos.success(result);
                            }
                        });
                    }
                }
            }
        });
}
/**
 * Crea un ComboBox para ser utlizado en un editor de un Kendo.UI.Grid.
 * @param {kendo.ui.Grid} container Grid contenedor de la funcion.
 * @param {string[]} options Listado de opciones: 0 - dataValue, 1 - dataText, 2 - urlRead, 3 - paramsUrlRead, 4 - placeHolder, 5 - required, 6 - cascadeFrom, 7 - validationMessage
 */
function Grid_Combox(container, options) {
    var required = givenOrDefault(options.values[5], "");
    var Message = givenOrDefault(options.values[7], "");
    var validationMessage = Message === "" ? "" : " validationMessage =" + Message;
    $('<input ' + required + validationMessage + ' id="' + options.field + '" name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            valuePrimitive: true,
            autoBind: true,
            dataTextField: options.values[1],
            dataValueField: options.values[0],
            autoWidth: true,
            cascadeFrom: givenOrDefault(options.values[6], ""),
            placeholder: givenOrDefault(options.values[4], "Seleccione un valor ...."),
            filter: "contains",
            dataSource: {
                sort: { field: options.values[1], dir: "asc" },
                transport: {
                    read: options.values[3] === "" ? options.values[2] : options.values[2] + "/" + options.values[3]
                }
            }
        });
}

/**
 * Crea un ComboBox para ser utlizado en un editor de un Kendo.UI.Grid.
 * @param {kendo.ui.Grid} container Grid contenedor de la funcion.
 * @param {string[]} options Listado de opciones: 0 - dataValue, 1 - dataText, 2 - urlRead,  3 - placeHolder, 4- required, 5 - cascadeFrom, 6 - validationMessage
 */
function Grid_ComboxData(container, options) {
    var required = givenOrDefault(options.values[4], "");
    var Message = givenOrDefault(options.values[6], "");
    var validationMessage = Message === "" ? "" : " validationMessage =" + Message;
    $('<input ' + required + validationMessage + ' id="' + options.field + '" name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            valuePrimitive: true,
            autoBind: true,
            dataTextField: options.values[1],
            dataValueField: options.values[0],
            autoWidth: true,
            cascadeFrom: givenOrDefault(options.values[5], ""),
            placeholder: givenOrDefault(options.values[3], "Seleccione un valor ...."),
            filter: "contains",
            dataSource: options.values[2]
            
        });
}

function Grid_requestEnd(e) {
    if ((e.type === "create" || e.type === "update" || e.type === "destroy") && e.response) {
        let mensaje, tipo;

        if (e.type === "destroy") {
            mensaje = e.response.Mensaje;
            tipo = e.response.TipoCodigo === "Satisfactorio" ? "success" : "error";
        }
        else {
            mensaje = e.response[1].Mensaje;
            tipo = e.response[1].TipoCodigo === "Satisfactorio" ? "success" : "error";
        }

        if (tipo === "error") {
            let MensajeTemplate = kendo.template("<div class='float-left'><span class='k-icon k-i-error' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='YesButton' style='width: 100px;' onclick='windowMensaje.close(); return;'>Aceptar</button>");
            windowMensaje = $("<div />").kendoWindow({
                title: "Información",
                visible: false,
                width: "500px",
                height: "200px",
                modal: true
            }).data("kendoWindow");

            windowMensaje.content(MensajeTemplate);
            windowMensaje.center().open();
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show(mensaje, tipo);
        }
    }
}

function Grid_error(e) {
    if (e.status === "error" && e.xhr.responseJSON) {
        let mensaje = ((e.xhr.responseJSON.Mensaje === null || e.xhr.responseJSON.Mensaje === undefined) ? e.xhr.responseJSON.ExceptionMessage : e.xhr.responseJSON.Mensaje) + ((e.xhr.responseJSON.Output === null || e.xhr.responseJSON.Output === undefined) ? "" : " " + e.xhr.responseJSON.Output);
        let icono = e.xhr.responseJSON.TipoCodigo === "Satisfactorio" ? "k-i-information" : "k-i-error";
        let MensajeTemplate = kendo.template("<div class='float-left'><span class='k-icon " + icono + "' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='OkButton' style='width: 100px;' onclick='windowMensaje.close(); return;'>Aceptar</button>");
         windowMensaje = $("<div />").kendoWindow({
            title: "Error",
            visible: false,
            width: "500px",
            height: "200px",
            modal: true
        }).data("kendoWindow");

        e.sender.cancelChanges();

        windowMensaje.content(MensajeTemplate);
        windowMensaje.center().open();
    }
}

// Colocar el foco en ventana modal del kendo grid.
function Grid_Focus(e, NombreCampo) {
    var arg = e;
    arg.container.data('kendoWindow').bind('activate', function () {

        ArgCampo = arg.container.find("input[name='" + NombreCampo + "']");

        if (ArgCampo.siblings('input:visible').length > 0) {
            ArgCampo.siblings('input:visible').focus().select();
        }
        else {
            if (ArgCampo.data("kendoComboBox")) {
                ArgCampo.data("kendoComboBox").input.focus().select();
            }
           else {
                ArgCampo.focus().select();

            }

        }
    });

    
} 

// Habilitar o Deshabilitar botones de la toolbar
/**
 * Muestra u Oculta los botones CRUD de un grid, dependiendo de la logica o regla de negocio de la vista.
 * @param {kendo.ui.Grid} e Grid contenedor de la funcion
 * @param {boolean} agregar Muestra u Oculta boton Agregar
 * @param {boolean} editar Muestra u Oculta boton Editar.
 * @param {boolean} borrar Muestra u Oculta boton borrar
 */
function Grid_HabilitaToolbar(e, agregar, editar, borrar) {



    if (agregar) {
       
        $(".k-grid-add", e).removeClass("k-state-disabled")
            .attr("href");

    }
    else {

        $(".k-grid-add", e)
            .addClass("k-state-disabled")
           .removeAttr("href");
    }
    if (editar) {

        $(".k-grid-edit", e).removeClass("k-state-disabled")
            .attr("href");
        $(".k-grid-save-changes", e).removeClass("k-state-disabled")
            .attr("href");

        e.data("kendoGrid").showColumn("cmdEdit");
        // habilitar el modo edicion cuando el usuario presiona <enter> en la fila
        e.data("kendoGrid").options.editable.update = true;
    }
    else {

        $(".k-grid-edit", e).addClass("k-state-disabled")
            .removeAttr("href");
        $(".k-grid-save-changes", e).addClass("k-state-disabled")
            .removeAttr("href");

        e.data("kendoGrid").hideColumn("cmdEdit");
        // Deshabilitar el modo edicion cuando el usuario presiona <enter> en la fila
        e.data("kendoGrid").options.editable.update = false;
    }

    if (borrar) {

        $(".k-grid-delete", e).removeClass("k-state-disabled")
            .attr("href");
        $(".k-grid-Eliminar", e).removeClass("k-state-disabled")
            .attr("href");

        e.data("kendoGrid").showColumn("cmdDel");
        
    }
    else {

        $(".k-grid-delete", e)
            .addClass("k-state-disabled")
            .removeAttr("href");

        $(".k-grid-Eliminar", e)
            .addClass("k-state-disabled")
            .removeAttr("href");

        e.data("kendoGrid").hideColumn("cmdDel");
    }

  
}
// selecciona fila

function Grid_SelectRow(e, selectedRows) {
    e = e.data("kendoGrid");
    var items = e.items();
    items.each(function (idx, row) {
        var idValue = e.dataItem(row).get(e.dataSource.options.schema.model.id);
        if (row.className.indexOf("k-state-selected") >= 0) {
            selectedRows[idValue] = true;
        } else if (selectedRows[idValue]) {
            delete selectedRows[idValue];
        }
    });
}

function Grid_SetSelectRow(e, selectedRows) {
    var grid = e.data("kendoGrid");
    var items = grid.items();
    var itemsToSelect = [];
    items.each(function (idx, row) {
        var dataItem = grid.dataItem(row);
        if (selectedRows[dataItem[grid.dataSource.options.schema.model.id]]) {
            itemsToSelect.push(row);
        }
    });

    if (itemsToSelect.length === 0) {
        grid.select("tr:eq(0)");
        $("tr:eq(1) td:eq(0)", e).closest('table').focus();
    }            
    else
        grid.select(itemsToSelect);
}

function Grid_RetornarRow(e, uid) {
    var el = e;
    grid = el.data("kendoGrid");
    row = el.find("tbody>tr[data-uid='" + uid + "']");
    return row;

}

/**
 * reajusta el tamaño del grid Alto 
 * @param {kendo.ui.Grid} e Definicion del grid 
 * @param {number} height alto del grid
 */
function Fn_Grid_Resize(e, height) {
    var gridWidget = e.data("kendoGrid");
    gridWidget.wrapper.height(height);
    gridWidget.resize();
}