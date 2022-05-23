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
        height: "60%",
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
        height: "70%",
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
        height: "90%",
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


//#region Modal LIstado de Notas de Remision+


/**
 * 
 * @param {HtmlElementId} divNotaRemisionLista Id del div que contendra listado nota remision
 * @param {number} sIdDeclaracion id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaListadoNotaRemision = (divNotaRemisionLista, sIdDeclaracion, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divNotaRemisionLista + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoDeclaraciones/ModalVerNotasRemision",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_ModalVerNotaRemision(resultado, divNotaRemisionLista, sIdDeclaracion, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_ModalVerNotaRemision("", divNotaRemisionLista, sIdDeclaracion, fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Ingreso nota remision
 * @param {HtmlElementId} divNotaRemisionLista Id del div que contendra la vista de Ingreso nota remision
 * @param {number} sIdDeclaracion id de declaración
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_ModalVerNotaRemision = (data, divNotaRemisionLista, sIdDeclaracion, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "ModalVerNotaRemision.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_ModalVerNotaRemision(true, data, divNotaRemisionLista, sIdDeclaracion, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_ModalVerNotaRemision(false, data, divNotaRemisionLista, sIdDeclaracion, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del Ingreso nota remision
 * @param {HtmlElementId} divNotaRemisionLista  Id del div que contendra la vista de Ingreso nota remision
 * @param {number} sIdDeclaracion id
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_ModalVerNotaRemision = (cargarJs, data, divNotaRemisionLista, sIdDeclaracion, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_ModalVerNotaRemision(sIdDeclaracion);
        } else {
            fn_Reg_ModalVerNotaRemision(sIdDeclaracion);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divNotaRemisionLista + "").kendoDialog({
        height: "80%",
        width: "65%",
        title: "Notas de Remision",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "30%",
        show: onShow,
        close: fn_CloseSIC
    
    });

    $("#" + divNotaRemisionLista + "").data("kendoDialog").open().toFront();

};
//#endregion




//#region Modal Ingreso de Notas de Remision+


/**
 * 
 * @param {HtmlElementId} divIngresNotaRemi Id del div que contendra Ingreso nota remision
 * @param {number} sIdRegNotaRemi id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaIngresoNotaRemision = (divIngresNotaRemi, sIdRegNotaRemi, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divIngresNotaRemi + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoDeclaraciones/IngresoNotaRemision",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_IngresoNotaRemision(resultado, divIngresNotaRemi, sIdRegNotaRemi, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_IngresoNotaRemision("", divIngresNotaRemi, sIdRegNotaRemi, fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Ingreso nota remision
 * @param {HtmlElementId} divIngresNotaRemi Id del div que contendra la vista de Ingreso nota remision
 * @param {number} sIdRegNotaRemi id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_IngresoNotaRemision = (data, divIngresNotaRemi, sIdRegNotaRemi, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "IngresoNotaRemision.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_IngresoNotaRemision(true, data, divIngresNotaRemi, sIdRegNotaRemi, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_IngresoNotaRemision(false, data, divIngresNotaRemi, sIdRegNotaRemi, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del Ingreso nota remision
 * @param {HtmlElementId} divIngresNotaRemi  Id del div que contendra la vista de Ingreso nota remision
 * @param {number} sIdRegNotaRemi id
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_IngresoNotaRemision = (cargarJs, data, divIngresNotaRemi, sIdRegNotaRemi, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_IngresoNotaRemision(sIdRegNotaRemi);
        } else {
            fn_Reg_IngresoNotaRemision(sIdRegNotaRemi);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divIngresNotaRemi + "").kendoDialog({
        height: "80%",
        width: "50%",
        title: "Ingreso de nota de remisión del cliente",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC,
        actions: [
            { text: 'Registrar Nota', primary: true, action: function (e) { return fn_CreaNotaRemCliente(); } }
        ]
    });

    $("#" + divIngresNotaRemi + "").data("kendoDialog").open().toFront();

};
//#endregion


//#region Modal Ingresar Bulto Add Item
/**
 * 
 * @param {HtmlElementId} divIngresoBultoAdd Id del div que contendra Ingreso bulto
 * @param {number} IngresoBultoAdd id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaIngresoBultoAddItem = (divIngresoBultoAdd, IngresoBultoAdd, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divIngresoBultoAdd + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoDeclaraciones/IngresoBultoAddItem",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_IngresoBultoAddItem(resultado, divIngresoBultoAdd, IngresoBultoAdd, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_IngresoBultoAddItem("", divIngresoBultoAdd, IngresoBultoAdd, fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Ingreso de bulto
 * @param {HtmlElementId} divIngresoBultoAdd Id del div que contendra la vista de Ingreso bulto
 * @param {number} IngresoBultoAdd id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_IngresoBultoAddItem = (data, divIngresoBultoAdd, IngresoBultoAdd, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "IngresoBultoAddItem.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_IngresoBultoAddItem(true, data, divIngresoBultoAdd, IngresoBultoAdd, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_IngresoBultoAddItem(false, data, divIngresoBultoAdd, IngresoBultoAdd, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del Ingreso bulto
 * @param {HtmlElementId} divIngresoBultoAdd  Id del div que contendra la vista de Ingreso bulto
 * @param {number} IngresoBultoAdd id
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_IngresoBultoAddItem = (cargarJs, data, divIngresoBultoAdd, IngresoBultoAdd, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_IngresoBultoAddItem(IngresoBultoAdd);
        } else {
            fn_Reg_IngresoBultoAddItem(IngresoBultoAdd);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divIngresoBultoAdd + "").kendoDialog({
        height: "80%",
        width: "30%",
        title: "Ingreso Nota Remision",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divIngresoBultoAdd + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Modal Lista Empaque Agregar PL
/**
 * 
 * @param {HtmlElementId} divListaEmpaqueAddPL Id del div que contendra Lista Empaque Agregar PL
 * @param {number} ListaEmpaqueAddPL id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaListaEmpaqueAddPL = (divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divListaEmpaqueAddPL + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoDeclaraciones/ListaEmpaqueAddPL",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_ListaEmpaqueAddPL(resultado, divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_ListaEmpaqueAddPL("", divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose);
    }
};

/**
 * 
 * @param {content} data el contenido html de Lista Empaque Agregar PL
 * @param {HtmlElementId} divListaEmpaqueAddPL Id del div que contendra la vista de Lista Empaque Agregar PL
 * @param {number} ListaEmpaqueAddPL id
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_ListaEmpaqueAddPL = (data, divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "ListaEmpaqueAddPL.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_ListaEmpaqueAddPL(true, data, divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_show_ListaEmpaqueAddPL(false, data, divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html de la Lista Empaque Agregar PL
 * @param {HtmlElementId} divListaEmpaqueAddPL  Id del div que contendra la vista de la Lista Empaque Agregar PL
 * @param {number} ListaEmpaqueAddPL id
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_show_ListaEmpaqueAddPL = (cargarJs, data, divListaEmpaqueAddPL, ListaEmpaqueAddPL, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_ListaEmpaqueAddPL(ListaEmpaqueAddPL);
        } else {
            fn_Reg_ListaEmpaqueAddPL(ListaEmpaqueAddPL);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divListaEmpaqueAddPL + "").kendoDialog({
        height: "80%",
        width: "30%",
        title: "Ingreso Nota Remision",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divListaEmpaqueAddPL + "").data("kendoDialog").open().toFront();

};


//#region Modal Ingreso de Notas de Remision
/**
 * 
 * @param {HtmlElementId} divIngresNotaRemi Id del div que contendra Ingreso nota remision
 * @param {number} idDeclaracionMercancia IdDM
 * @param {number} item Item DM
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_vistaRelacionPLs = (divIngresNotaRemi, idDeclaracionMercancia, item, fnclose) => {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divIngresNotaRemi + "").children().length === 0) {
        $.ajax({
            url: "/ModalesIngresoDeclaraciones/vRelacionPLs",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_cargar_RelacionPLs(resultado, divIngresNotaRemi, idDeclaracionMercancia, item, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_cargar_RelacionPLs("", divIngresNotaRemi, idDeclaracionMercancia, item, fnclose);
    }
};
/**
 * 
 * @param {content} data el contenido html de Ingreso nota remision
 * @param {HtmlElementId} divIngresNotaRemi Id del div que contendra la vista de Ingreso nota remision
 * @param {number} idDeclaracionMercancia IdDM
 * @param {number} item Item DM
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_cargar_RelacionPLs = (data, divIngresNotaRemi, idDeclaracionMercancia, item, fnclose) => {
    let script = "";
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "RelacionPLs.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_show_RelacionPLs(true, data, divIngresNotaRemi, idDeclaracionMercancia, item, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        fn_show_RelacionPLs(false, data, divIngresNotaRemi, idDeclaracionMercancia, item, fnclose);
    }
};

var fn_show_RelacionPLs = (cargarJs, data, divRelacionPLs, idDeclaracionMercancia, item, fnclose) => {
    let onShow = function () {
        if (cargarJs === true) {
            fn_Ini_RelacionPLs(idDeclaracionMercancia, item);
        } else {
            fn_Reg_RelacionPLs(idDeclaracionMercancia, item);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divRelacionPLs + "").kendoDialog({
        height: "80%",
        width: "50%",
        title: "Creación de Lista de Empaque",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC,
        actions: [
            { text: 'Agregar PL', primary: true, action: function (e) { return fn_Crear_Reg(); } }
        ],
    });

    $("#" + divRelacionPLs + "").data("kendoDialog").open().toFront();

};
//#endregion