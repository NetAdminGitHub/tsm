"use strict"
//#region Modal Ingreos control de bultos(registro hoja)
/**
 * 
 * @param {HtmlElementId} divControlBulto Id del div que contendra la vista de ingreso contro de bultos
 * @param {number} sIdHB id hoja bandeo
 * @param {number} sIdIngreso id ingreso
 * @param {boolean} esNuevo se va crear registro o modifica
* @param {boolean} sIdCliente cliente
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaControlBultos = (divControlBulto, sIdHB,sIdIngreso, esNuevo,sIdCliente,fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divControlBulto + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoMercancia/ControlBulto",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_ControlBulto(resultado, divControlBulto, sIdHB, sIdIngreso, esNuevo, sIdCliente, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_ControlBulto("", divControlBulto, sIdHB, sIdIngreso, esNuevo, sIdCliente,fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html ingreso contro de bultos
 * @param {HtmlElementId} divControlBulto Id del div que contendra la vista de Ingreso de Ajustes
 * @param {number} sIdHB id hoja bandeo
 * @param {number} sIdIngreso id ingreso
 * @param {boolean} esNuevo se va crear registro o modifica
* @param {boolean} sIdCliente cliente
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_ControlBulto = (data, divControlBulto, sIdHB, sIdIngreso, esNuevo,sIdCliente,fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "ControlBulto.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_ControlBulto(true, data, divControlBulto, sIdHB, sIdIngreso, esNuevo, sIdCliente, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_ControlBulto(false, data, divControlBulto, sIdHB, sIdIngreso, esNuevo, sIdCliente, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html de ingreso contro de bultos
 * @param {HtmlElementId} divControlBulto  Id del div que contendra de ingreso control de bultos
 * @param {number} sIdHB id hoja bandeo
 * @param {number} sIdIngreso id ingreso
 * @param {boolean} esNuevo se va crear registro o modifica
 * @param {boolean} sIdCliente cliente
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_ControlBulto = (cargarJs, data, divControlBulto, sIdHB, sIdIngreso, esNuevo, sIdCliente, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_ControlBulto(sIdHB, sIdIngreso, esNuevo, sIdCliente);
        } else {
            fn_Reg_ControlBulto(sIdHB, sIdIngreso, esNuevo, sIdCliente);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divControlBulto + "").kendoDialog({
        height: "90%",
        width: "70%",
        title: "Ingreso de Control de Bultos",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "30%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divControlBulto + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Modal Ingreso de bultos (boton crear bulto)
/**
 * 
 * @param {HtmlElementId} divIngresoBulto Id del div que contendra Ingreso de bultos
 * @param {number} sidHb id hoja badeo
 * @param {number} esRollo es rollo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaCrearBulto = (divIngresoBulto, sidHb, esRollo, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divIngresoBulto + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoMercancia/IngresoBulto",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_IngresoBulto(resultado, divIngresoBulto, sidHb, esRollo, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_IngresoBulto("", divIngresoBulto, sidHb, esRollo, fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Ingreso de bultos
 * @param {HtmlElementId} divIngresoBulto Id del div que contendra la vista de Ingreso de bultos
 * @param {number} sidHb id hoja badeo
 * @param {number} esRollo es rollo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_IngresoBulto = (data, divIngresoBulto, sidHb, esRollo, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "IngresoBulto.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_IngresoBulto(true, data, divIngresoBulto, sidHb, esRollo, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_IngresoBulto(false, data, divIngresoBulto, sidHb, esRollo, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del Ingreso de bultos
 * @param {HtmlElementId} divIngresoBulto  Id del div que contendra la vista de Ingreso de bultos
 * @param {number} sidHb id hoja badeo
 * @param {number} esRollo es rollo
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_IngresoBulto = (cargarJs, data, divIngresoBulto, sidHb, esRollo, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_IngresoBulto(sidHb, esRollo);
        } else {
            fn_Reg_IngresoBulto(sidHb, esRollo);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divIngresoBulto + "").kendoDialog({
        height: "50%",
        width: "20%",
        title: "Ingreso de Bulto / Rollo",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divIngresoBulto + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Modal Ingreso de bultos Lotes (boton crear serie bulto)
/**
 * 
 * @param {HtmlElementId} divIngresoBultoSerie Id del div que contendra Ingreso de bultos Lotes 
 * @param {number} sidHb id
 * @param {number} esRollo esrollo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaCrearBultoSerie = (divIngresoBultoSerie, sidHb, esRollo,fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divIngresoBultoSerie + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoMercancia/IngresoBultoSerie",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_IngresoBultoSerie(resultado, divIngresoBultoSerie, sidHb, esRollo,fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_IngresoBultoSerie("", divIngresoBultoSerie, sidHb, esRollo,fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Ingreso de bultos Lotes
 * @param {HtmlElementId} divIngresoBultoSerie Id del div que contendra la vista de Ingreso de bultos Lotes
 * @param {number} sidHb id
 * @param {number} esRollo esrollo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_IngresoBultoSerie = (data, divIngresoBultoSerie, sidHb, esRollo, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "IngresoBultoSerie.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_IngresoBultoSerie(true, data, divIngresoBultoSerie, sidHb, esRollo, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_IngresoBultoSerie(false, data, divIngresoBultoSerie, sidHb, esRollo, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del Ingreso de bultos Lotes
 * @param {HtmlElementId} divIngresoBultoSerie  Id del div que contendra la vista de Ingreso de bultos Lotes
 * @param {number} sidHb id
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_IngresoBultoSerie = (cargarJs, data, divIngresoBultoSerie, sidHb, esRollo,fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_IngresoBultoSerie(sidHb, esRollo);
        } else {
            fn_Reg_IngresoBultoSerie(sidHb, esRollo);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divIngresoBultoSerie + "").kendoDialog({
        height: "65%",
        width: "20%",
        title: "Ingreso de Bulto / Rollo",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divIngresoBultoSerie + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Modal Creacion de lista de empaque (boton crear lista empaque)
/**
 * 
 * @param {HtmlElementId} divListaEmpaque Id del div que contendra Creacion de lista de empaque 
 * @param {number} sIdHb id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaCreacionListaEmpaque = (divListaEmpaque, sIdHb, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divListaEmpaque + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoMercancia/CrearListaEmpaque",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_CrearListaEmpaque(resultado, divListaEmpaque, sIdHb, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_CrearListaEmpaque("", divListaEmpaque, sIdHb, fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Creacion de Lista de empaque
 * @param {HtmlElementId} divListaEmpaque Id del div que contendra la vista de Creacion de Lista de empaque
 * @param {number} sIdHb id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_CrearListaEmpaque = (data, divListaEmpaque, sIdHb, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "CrearListaEmpaque.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_CrearListaEmpaque(true, data, divListaEmpaque, sIdHb, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_CrearListaEmpaque(false, data, divListaEmpaque, sIdHb, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del Creacion de Lista de empaque
 * @param {HtmlElementId} divListaEmpaque  Id del div que contendra la vista de Creacion de Lista de empaque
 * @param {number} sIdHb id
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_CrearListaEmpaque = (cargarJs, data, divListaEmpaque, sIdHb, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_CrearListaEmpaque(sIdHb);
        } else {
            fn_Reg_CrearListaEmpaque(sIdHb);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divListaEmpaque + "").kendoDialog({
        height: "60%",
        width: "50%",
        title: "Creacion de Lista de Empaque",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC,
        actions: [
            { text: 'Crear Registro', primary: true, action: function (e) { return fn_CrearReg(); } }
        ],
    });

    $("#" + divListaEmpaque + "").data("kendoDialog").open().toFront();

};
//#endregion


