var srcNoEncontrada = "/Images/NoDisponible.png";
var srcDefault = "/Images/NoImagen.png";
var VistaPopup = "";
function Get_KendoDataSource(Url_api) {

    return new kendo.data.DataSource({
        dataType: "json",
        //serverFiltering: true,
        transport: {
            read: {
                url: Url_api

            }
        }
    });
}

var fn_FiltrarJsonResult = function (Data, Keyfilter) {
    if (Data.length !== 0) {
        var resul = Data.filter(function (item) { return item[Keyfilter] != null; });
        return resul[0][Keyfilter];
    } else {
        return "";
    }
};

/**
 * Devuelve fecha y hora actual.
 * @returns {date} retorna fecha
 */
function Fhoy() {
    return kendo.toString(kendo.parseDate(new Date()), 's');
}
/**
 * Devuelve la fecha del fin del mes
 * @returns {Date} retorna fecha
 */
function FechaFinMes() {
    var dt = new Date();
    return kendo.toString(kendo.parseDate(new Date(dt.getFullYear(), dt.getMonth() + 1, 0)), 's');
}
/**
 * Devuelve la fecha del Inicio del mes
 * @returns {Date} retorna fecha
 */
function FechaIniMes() {
    var dt = new Date();
    return kendo.toString(kendo.parseDate(new Date(dt.getFullYear(), dt.getMonth(), 1)), 's');
}


function RequestEndMsg(e, type) {
    if (type === "Post" || type === "Put" || type === "Delete") {
        let mensaje, tipo;

        if (type === "Delete") {
            mensaje = e.Mensaje + ((e.Output === null || e.Output === undefined) ? "" : " " + e.Output);
            tipo = e.TipoCodigo === "Satisfactorio" ? "success" : "error";
        }
        else {
            mensaje = e[1].Mensaje + ((e[1].Output === null || e[1].Output === undefined) ? "" : " " + e[1].Output);
            tipo = e[1].TipoCodigo === "Satisfactorio" ? "success" : "error";
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

function ErrorMsg(e) {
    var icono = "";
    var MensajeTemplate = "";
    var mensaje = "";
    if (e.responseJSON) {
        mensaje = ((e.responseJSON.Mensaje === null || e.responseJSON.Mensaje === undefined) ? (e.responseJSON.ExceptionMessage === undefined ? e.responseJSON.Message : e.responseJSON.ExceptionMessage) : e.responseJSON.Mensaje)
            + (e.responseJSON.Output === null || e.responseJSON.Output === undefined ? "" : " " + e.responseJSON.Output);
        icono = e.responseJSON.TipoCodigo === "Satisfactorio" ? "k-i-information" : "k-i-error";
        MensajeTemplate = kendo.template("<div class='float-left'><span class='k-icon " + icono + "' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='OkButton' style='width: 100px;' onclick='windowMensaje.close(); return;'>Aceptar</button>");
        windowMensaje = $("<div />").kendoWindow({
            title: "Error",
            visible: false,
            width: "400px",
            height: "200px",
            modal: true
        }).data("kendoWindow");

        windowMensaje.content(MensajeTemplate);
        windowMensaje.center().open();
    }
    else {
        mensaje = e.toString();
        icono = "k-i-error";
        MensajeTemplate = kendo.template("<div class='float-left'><span class='k-icon " + icono + "' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='OkButton' style='width: 100px;' onclick='windowMensaje.close(); return;'>Aceptar</button>");
        windowMensaje = $("<div />").kendoWindow({
            title: "Error",
            visible: false,
            width: "400px",
            height: "200px",
            modal: true
        }).data("kendoWindow");

        windowMensaje.content(MensajeTemplate);
        windowMensaje.center().open();
    }
}

var windowConfirmar;
var ResultadoYes;
function ConfirmacionMsg(Mensaje, funcion, functionNo) {

    if (functionNo === undefined || functionNo === "") {
        functionNo = function () { return true; };
    }
    ResultadoYes = function () { return funcion(); };
    ResultadoNO = function () { return functionNo(); };

    var Template = kendo.template("<div class='float-left'><span class='k-icon k-i-question' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + Mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='yesButton' onclick='ResultadoYes(); windowConfirmar.close(); return;' style='width: 75px;'>Si</button> <button class='k-button' id='noButton'onclick='ResultadoNO();windowConfirmar.close(); return;' style='width: 75px;'>No</button><div>");
    windowConfirmar = $("<div />").kendoWindow({
        title: "Confirmación",
        visible: false,
        width: "400px",
        height: "200px",
        modal: true
    }).data("kendoWindow");

    windowConfirmar.content(Template);
    windowConfirmar.center().open();

}

function OcultarTab(e, index) {
    $(e.data("kendoTabStrip").items()[index]).attr("style", "display:none");
}
function MostrarTab(e, index) {
    $(e.data("kendoTabStrip").items()[index]).attr("style", "display:inline");
}
/**
 * funcion de redondeo
 * @param {number} Valor valor a redondear.
 * @param {number} Decimales precision, cantidad decimales aredondear
 * @returns {number} retiorna el valor
 */
function fn_RoundToUp(Valor, Decimales) {
    var ValorSignificativo;
    ValorSignificativo = Valor * Math.pow(10.0, Decimales);

    if (ValorSignificativo % 1 > 0) {
        ValorSignificativo = ValorSignificativo + 1;
    }

    Valor = ValorSignificativo / Math.pow(10.0, Decimales);

    return Valor;


}


var fn_MostrarReporte = function (pdfData, HtmlElementId) {
    //var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    //pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

    // Using DocumentInitParameters object to load binary data.
    var loadingTask = PDFJS.getDocument({ data: pdfData });
    loadingTask.promise.then(function (pdf) {

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById(HtmlElementId);
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            //renderTask.then(function () {
            //    console.log('Page rendered');
            //});
        });
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
};
/**
 * CONSuLTA REQUERIMIENTO DE DESAROLLO.
 * @param {object} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 */
var Fn_VistaConsultaRequerimiento = function (e) {
    // cargar consulta
    var dialog = e;
    $.ajax({
        url: "/RequerimientoDesarrollos/Consulta",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            dialog.kendoDialog({
                height: $(window).height() - "100" + "px",
                width: "65%",
                title: "Requerimiento de Desarrollo",
                closable: true,
                modal: true,
                content: result,
                visible: false
            });

            RList.push(RequerimientoDes);
            $.each(RList, function (index, elemento) {
                elemento.call(document, jQuery);
            });
        }
    });

};
/**
 * VISTA CONSULTA ANALISIS DE DISEÑO
 * @param {object} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 */
var Fn_VistaConsultaAnalisis = function (e) {
    // cargar consulta
    var dialog = e;
    $.ajax({
        url: "/AnalisisDisenos/Consulta",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            dialog.kendoDialog({
                height: $(window).height() - "100" + "px",
                width: "65%",
                title: "Análisis de Diseños",
                closable: true,
                modal: true,
                content: result,
                visible: false
            });

            RList.push(AnalisisDis_Consulta);
            $.each(RList, function (index, elemento) {
                elemento.call(document, jQuery);
            });
        }
    });

};

/**
 * VISTA CONSULTA ESTADOS
 * @param {object} e tiqueta <DIV> a utilizar para mostrar el kendoDialog.
 */
var Fn_VistaConsultaRequerimientoEstados = function (e) {
    // cargar consulta
    var dialog = e;
    $.ajax({
        url: "/RequerimientoDesarrollosEstados/Consulta",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            dialog.kendoDialog({
                height: $(window).height() - "70" + "px",
                width: "65%",
                title: "Consulta de estados del Requerimiento",
                closable: true,
                modal: true,
                content: result,
                visible: false
            });
            RList.push(fn_RequerimientoEstados);
            $.each(RList, function (index, elemento) {
                elemento.call(document, jQuery);
            });
        }
    });

};

/**
 * VISTA CONSULTA SIMULACIONES
 * @param {object} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 */
var Fn_VistaConsultaSimulacion = function (e) {
    // cargar consulta
    var dialog = e;
    $.ajax({
        url: "/Simulaciones/Consulta",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            dialog.kendoDialog({
                height: $(window).height() - "100" + "px",
                width: "65%",
                title: "Simualción del Requerimiento",
                closable: true,
                modal: true,
                content: result,
                visible: false
            });

            RList.push(Simulacion_consulta);
            $.each(RList, function (index, elemento) {
                elemento.call(document, jQuery);
            });
        }
    });

};

/**
 * Muestra ventana modal consulta requerimiento
 * @param {object} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 * @param {Number} IdRequerimiento codigo del requerimiento de desarrollo.
 */
var Fn_VistaConsultaRequerimientoGet = function (e, IdRequerimiento) {
    var dialog = e;
    dialog.data("kendoDialog").open();
    Fn_ConsultaRequerimientoDes(IdRequerimiento);
};
/**
 * Muestra ventana modal consulta analisis de diseño
 * @param {object} e  etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 * @param {number} IdServicio codigo del servicio
 * @param {number} IdAnalisisDiseno codigo del analisis de diseño
 */
var Fn_VistaConsultaAnalisisDisenosGet = function (e, IdServicio, IdAnalisisDiseno) {
    var dialog = e;
    dialog.data("kendoDialog").open();
    Fn_ConsultaAnalisisDisenos(IdServicio, IdAnalisisDiseno);
};

/**
 * Muestra Ventana modal consulta requerimiento estado
 * @param {object} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 * @param {string} Tabla tabla a consultar
 * @param {number} IdRequerimiento pk de la tabla Requerimiento parametro opcional.
 */
var Fn_VistaConsultaRequerimientoEstadosGet = function (e, Tabla, IdRequerimiento) {
    var dialog = e;
    dialog.data("kendoDialog").open();
    fn_CargarRequerimientoEstados(Tabla, IdRequerimiento);
};

/**
 * Muestra ventana modal consulta Simulación
 * @param {object} e  etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 * @param {number} IdSimulacion codigo de simulación
 */
var Fn_VistaConsultaSimulacionGet = function (e, IdSimulacion) {
    var dialog = e;
    dialog.data("kendoDialog").open();
    fn_ConsultaSimulaciones(IdSimulacion);
};

/**
 * funcion lee imagenes adjuntas y las inserta en una etiqueta DIV que funciona como carrusel
 * @param {string} Objecarousel por ejemplo $("#MyCarrousel)
 * @param {string} src ubicacion u origen de las imagenes adjuntadas /Adjuntos' 
 * @param {object} DataSource origen de datos
 * @param {string} srcDefault ubicacion de la imagen por defecto /Images/NoImage.png
 * @param {string} srcNoEncontrada ubicacion de imagen cuando existe un error de lectura /Images/NoEncontrada.png
 */

var Fn_LeerImagenes = function (Objecarousel, src, DataSource) {

    var lista = Objecarousel;
    //remueve las imagenes del carrousel
    Objecarousel.children().remove();
    if (DataSource === null || DataSource === undefined) {
        lista.append(
            '<div class="carousel-item col-md-6 col-lg-6 active">'
            + '<img class="img-fluid mx-auto d-block" src="' + srcDefault + '" >'
            + '</div > '
        );

    } else {
        if (DataSource.length === 0) {
            lista.append(
                '<div class="carousel-item col-md-6 col-lg-6 active">'
                + '<img class="img-fluid mx-auto d-block" id="Img_N0" src="' + srcDefault + '" onclick="fn_click_Imagen(this)">'
                + '</div > '
            );
        } else {
            $.each(DataSource, function (index, elemento) {
                if (index === 0) {
                    lista.append(
                        '<div class="carousel-item col-md-6 col-lg-6 active">'
                        + '<img class="img-fluid mx-auto d-block" id="Img_N' + index + '"  src="' + src + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '</div > '
                    );
                }
                else {
                    lista.append(
                        '<div class="carousel-item col-md-6 col-lg-6 ">'
                        + '<img class="img-fluid mx-auto d-block" id="Img_N' + index + '" src="' + src + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '</div > '
                    );
                }
            });
        }

    }
};

/**
 * metodo cuando ocurre un error al cargar la imagen la remplaza por una imagen definida.
 * @param {object} image objeto o etiqueta imagen
 * @param {string} src  scr origen de la imagen.
 */
var imgError = function (image) {
    image.onerror = "";
    image.src = srcNoEncontrada;
};

/**
 * VISTA CARROUSEL, hTML CARROUSEL.
 * @returns {string} retorna una cadena de carateres
 */
var Fn_Carouselcontent = function () {

    var VarCarousel = '<div class="form-row">' +
        '<div class="container-fluid">' +
        '<div id="carouselExampleControls" class="carousel slide" data-ride="carousel" data-interval="9000">' +
        '<div class="carousel-inner row w-100 " role="listbox" id="Mycarousel" ></div>' +
        '<a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">' +
        '<span class="carousel-control-prev-icon" style="color: #A05EB5;" aria-hidden="true"></span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="carousel-control-next text-faded" href="#carouselExampleControls" role="button" data-slide="next">' +
        '<span class="carousel-control-next-icon" style="color: #A05EB5;" aria-hidden="true"></span>' +
        '<span class="sr-only">Next</span>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>';

    return VarCarousel;
};

var fn_Ver_Img_Modal = function (idcolImg) {
    let modal = document.getElementById("ModalImgeZoom");
    let img = document.getElementById(idcolImg);
    let modalImg = document.getElementById("img01");
    let captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
    let span = document.getElementsByClassName("close-img")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };
    fn_CustomTemplateClose();
};
var fn_click_Imagen = function (elemento) {
    fn_Ver_Img_Modal(elemento.id);
};
/**
 * 
 * @param {any} e objeto o etiqueta  <div> para el cambio de estado
 */
var Fn_VistaAsignarUsuario = function (e) {
    VistaPopup = e;

    $.ajax({
        url: "/OrdenesTrabajo/AsignacionUsuario",
        method: 'GET',
        success: function (result) {
            var RList = [];
            VistaPopup.kendoDialog({
                height: $(window).height() - "510" + "px",
                width: "20%",
                title: "Cambio de etapa",
                closable: true,
                modal: true,
                content: result,
                visible: false,
                actions: [
                    { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: Fn_CambiarEtapa },
                    { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }
                ],
                close: onCloseCambioEstado
            });

            RList.push(fn_DocRIniciaVistaCambio);
            $.each(RList, function (index, elemento) {
                elemento.call(document, jQuery);
            });
        }
    });

};


/**
 * 
 * @param {any} e objeto o etiqueta  <div> para el cambio de estado
 */
var Fn_VistaCambioEstado = function (e) {

    VistaPopup = e;
    $.ajax({
        url: "/Estados/CambioEstado",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            VistaPopup.kendoDialog({
                height: $(window).height() - "510" + "px",
                width: "20%",
                title: "Cambio de estado",
                closable: true,
                modal: true,
                content: result,
                visible: false,
                actions: [
                    { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: Fn_Cambio },
                    { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }

                ],
                close: onCloseCambioEstado
            });

            RList.push(fn_DocRIniciaVistaCambio);
            $.each(RList, function (index, elemento) {
                elemento.call(document, jQuery);
            });
        }
    });

};

/**
 *  MUESTRA VENTANA MODAL PARA EL CAMBIO DE ESTADOS
 * @param {string} Tabla tabla a cambiar estado
 * @param {string} EstadoActual estado actual del registro
 * @param {string} UrlCambioEstado url cambio  de estado
 * @param {string} SP nombre del proceso almacenado
 * @param {string} Id id del registo (PK)
 * @param {Function} fnGuardado este parametro es opcional, si desea guardar un registro o ejecutar una funcion al momento hacer click en el boton cambiar asignar funcion a este parametro
 */
var Fn_VistaCambioEstadoMostrar = function (Tabla, EstadoActual, UrlCambioEstado, SP, Id, fnGuardado) {

    VistaPopup.data("kendoDialog").open();
    var Param = {
        Tabla: Tabla,//obligatorios
        EstadoActual: EstadoActual,//obligatorios
        SP: SP,//obligatorios
        EstadoSiguiente: "",//obligatorios
        Motivo: "",//obligatorios
        Id: Id,
        fnGuardado: fnGuardado
    };
    fn_CambioEstadoInicializacion(VistaPopup, UrlCambioEstado, Param);
};
/**
 * permite habilitar o inhabilitar el elemento panel.
 * @param {HTMLDivElement} DivElem elemento div que contiene la funcion de panel
 * @param {Element} elemento elemento panel a inhabilitar o habilitar
 * @param {boolean} enable  True o false cual sea el caso.
 */
var Fn_EnablePanelBar = function (DivElem, elemento, enable) {
    var panelBar = DivElem.data("kendoPanelBar");
    panelBar.enable(elemento, enable);

};
/**
 * contrae un elemento del panel
 * @param {HTMLDivElement} DivElem elemento div que contiene la funcion de panel
 * @param {Element} elemento elemento panel a contraer
 */
var Fn_ContraerPanelBar = function (DivElem, elemento) {
    var panelBar = DivElem.data("kendoPanelBar");
    panelBar.collapse(elemento, true);

};
/**
 * expande un elemento del panel
 * @param {HTMLDivElement} DivElem elemento div que contiene la funcion de panel
 * @param {Element} elemento elemento panel a expandir
 */
var Fn_ExpandirPanelBar = function (DivElem, elemento) {
    var panelBar = DivElem.data("kendoPanelBar");
    panelBar.expand(elemento, true);

};
/**
 * configuracion inicial kendoPanelBar
 * @param {HTMLDivElement} DivElem elemento div que contendra la funcion de panel
 * @param {boolean} ExpanMultiple modo de expancion  true: Mostrar varios elementos a la vez false:Mostrar un elemento a la vez cuando
 */
var PanelBarConfig = function (DivElem, ExpanMultiple) {

    DivElem.kendoPanelBar({
        expandMode: givenOrDefault(ExpanMultiple, true) === true ? "multiple" : "single",
        animation: {
            expand: {
                effects: "fadeIn"
            },
            collapse: {
                effects: "fadeOut"
            }

        }

    });
};
/**
 * Habilita o Inhabilita campo Kendo Date Piker
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion de fecha
 * @param {boolean} enable true o false
 */
var KdoDatePikerEnable = function (InputElem, enable) {
    var datepicker = InputElem.data("kendoDatePicker");
    datepicker.enable(enable);
};

/**
 * Habilita o Inhabilita campo Kendo NumericTextBox
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion de campo numeric
 * @param {boolean} enable true o false
 */
var KdoNumerictextboxEnable = function (InputElem, enable) {
    var numerictextbox = InputElem.data("kendoNumericTextBox");
    numerictextbox.enable(enable);
};

/**
 * Habilita o Inhabilita campo Kendo CheckBox
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion CheckBox
 * @param {boolean} enable true o false
 */
var KdoCheckBoxEnable = function (InputElem, enable) {
    InputElem.prop("disabled", !enable);
};

/**
 * Habilita o Inhabilita campo Text Box
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Text Box
 * @param {boolean} enable true o false
 */

var TextBoxEnable = function (InputElem, enable) {
    InputElem.prop("disabled", !enable);
};

/**
 * activa modo lectura campo Text Box
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Text Box
 * @param {boolean} enable true o false
 */

var TextBoxReadOnly = function (InputElem, enable) {
    InputElem.prop("readonly", !enable);
};

/**
 * meutsra u Oculta campo Text Box
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Text Box
 * @param {boolean} enable true o false
 */

var TextBoxHidden = function (InputElem, enable) {
    InputElem.prop("hidden", enable);
};

/**
 * activa modo lectura campo Button
 * @param {HTMLButtonElement} BotonElem elemento div que contiene la funcion del Button
 * @param {boolean} enable true o false
 */

var KdoButtonEnable = function (BotonElem, enable) {
    var Button = BotonElem.data("kendoButton");
    Button.enable(enable);
};

var KdoButton = function (BotonDiv, icono, tooltip) {

    BotonDiv.kendoButton({ icon: icono });
    if (givenOrDefault(tooltip, "undefined") !== "undefined") {
        BotonDiv.kendoTooltip({
            content: function (e) {
                return tooltip;
            }

        });
    }

};
/**
 * ocultar campo en ventana modal de edicion popup
 * @param {container} container recibe  e.container
 * @param {string} campo nombre del campo a ocultar
 */
var KdoHideCampoPopup = function (container, campo) {
    container.find("label[for=" + campo + "]").parent("div .k-edit-label").hide();
    container.find("label[for=" + campo + "]").parent().next("div .k-edit-field").hide();
};

/**
 * Muestra campo en ventana modal de edicion popup
 * @param {container} container recibe  e.container
 * @param {string} campo nombre del campo a mostrar
 */
var KdoShowCampoPopup = function (container, campo) {
    container.find("label[for=" + campo + "]").parent("div .k-edit-label").show();
    container.find("label[for=" + campo + "]").parent().next("div .k-edit-field").show();
};

/**
 * devuelve el valor del kendo combo box
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 * @returns {string} string
 */
var KdoCmbGetValue = function (InputElem) {
    var combobox = InputElem.data("kendoComboBox");
    return combobox.value() === "" ? null : combobox.selectedIndex >= 0 ? combobox.value() : null;

};


/**
 * devuelve el Texto del kendo combo box
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 * @returns {string} string
 */
var KdoCmbGetText = function (InputElem) {
    var combobox = InputElem.data("kendoComboBox");
    return combobox.text() === "" ? null : combobox.selectedIndex >= 0 ? combobox.text() : null;

};

/**
 * coloca valor al kendo combobox
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 * @param {any} value valor para setear el combobox
 */
var KdoCmbSetValue = function (InputElem, value) {
    var combobox = InputElem.data("kendoComboBox");
    combobox.value(value);

};
/**
 * coloca el foco en el campo combobox
 * @param {HTMLInputElement} InputElem recibe el elemento combobox
 */
var KdoCmbFocus = function (InputElem) {
    InputElem.data("kendoComboBox").input.focus().select();
};

/**
 *  oculta campo kendo numerico
 * @param {HTMLInputElement} InputElem recibe el elemento numeric
 */
var KdoNumericHide = function (InputElem) {
    InputElem.data("kendoNumericTextBox").wrapper.hide();
};

/**
 *  muestra campo kendo numerico
 * @param {HTMLInputElement} InputElem recibe el elemento numeric
 */
var KdoNumericShow = function (InputElem) {
    InputElem.data("kendoNumericTextBox").wrapper.show();
};
/**
 * coloca un valor en el campo numerico
 * @param {any} InputElem recibe el elemento numerico
 * @param {any} value el valor a colocar en el campo
 */
var kdoNumericSetValue = function (InputElem, value) {
    InputElem.data("kendoNumericTextBox").value(value);
};
/**
 * obtiene el valor de un campo numerico
 * @param {any} InputElem recibe el elemento numerico
 * @returns {numeric} retorna el valor numerico
 */
var kdoNumericGetValue = function (InputElem) {
    return InputElem.data("kendoNumericTextBox").value();
};

/**
 * oculta el campo combobox en la vista
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 */
var KdoCmbHide = function (InputElem) {
    InputElem.data("kendoComboBox").wrapper.hide();
};
/**
 * muestra el elemento combo box en la vista
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 */
var KdoCmbShow = function (InputElem) {
    InputElem.data("kendoComboBox").wrapper.show();
};

/**
 * oculta el campo multiselect en la vista
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 */
var KdoMultiSelectHide = function (InputElem) {
    InputElem.data("kendoMultiSelect").wrapper.hide();
};
/**
 * muestra el campo multiselect en la vista
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 */
var KdoMultiSelectShow = function (InputElem) {
    InputElem.data("kendoMultiSelect").wrapper.show();
};
var opcionesFormaSmartWizard = {
    Defecto: "default",
    Flechas: "arrows",
    Circulos: "circles",
    Puntos: "dots"
};

/**
 * Proceso encargado de crear el control smartWizard.
 * @param {HTMLDivElement} DivIdElement Elemento DIV dentro del cual se dibujará el control wizard.
 * @param {JSON} etapas Listado de etapas y sus propiedades para dibujar el control.
 * @param {opcionesFormaSmartWizard} forma Forma en la que se dibujarán las etapas en el control.
 */
var CrearEtapasProcesosModulo = function (DivIdElement, etapas, forma) {
    let EtapaOpc = $("#EtapaOpc");
    EtapaOpc.children().remove();

    var SetEtapa = "vistaParcial";

    $.each(etapas, function (index, elemento) {
        EtapaOpc.append(
            "<li class=\"nav-item\">" +
            "<a href=\"#" + SetEtapa + elemento.IdEtapaProceso + "\" class=\"nav-link\" etapa=\"" + elemento.IdEtapaProceso + "\" vista=\"" + elemento.VistaFormulario + "\" indice=\"" + (elemento.Item - 1) + "\">" +
            "<span class=\"k-icon " + elemento.Icono + " ficonEtp\"></span><br>" +
            "<small>" + elemento.Nombre + "</small>" +
            "</a>" +
            "</li>");

        $("#EtapasVistas").append(
            "<div id=\"" + SetEtapa + elemento.IdEtapaProceso + "\"></div>"
        );
    });

    // Smart Wizard
    DivIdElement.smartWizard({
        selected: etapas[0].EtapaActiva,
        showStepURLhash: false,
        theme: givenOrDefault(forma, "arrows"),
        transitionEffect: 'fade',
        toolbarSettings: {
            toolbarPosition: 'top',
            showNextButton: false,
            showPreviousButton: false
        },
        lang: {
            next: '',
            previous: ''
        },
        anchorSettings: {
            markDoneStep: true,
            markAllPreviousStepsAsDone: true
        }
    });

    DivIdElement.on("showStep", function (e, anchorObject, stepNumber, stepDirection) {
        let etapa = anchorObject.attr("etapa");
        let vista = anchorObject.attr("vista");
        if (idEtapaProceso != undefined)
            idEtapaProceso = etapa;
        window.history.pushState(stepNumber, window.title, window.location.origin + "/OrdenesTrabajo/ElementoTrabajo/" + idOrdenTrabajo + "/" + etapa);

        if ($("#vistaParcial" + etapa).children().length === 0) {
            kendo.ui.progress($(document.body), true);
            $.ajax({
                url: "/OrdenesTrabajo/VistaParcial/" + vista,
                method: 'POST',
                success: function (result) {
                    $("#vistaParcial" + etapa).append(result);

                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "/Scripts/js/" + vista + ".js";

                    script.onload = function () {
                        CargarInfoEtapa();
                    };

                    document.getElementsByTagName('head')[0].appendChild(script);
                },
                complete: function () {
                    kendo.ui.progress($(document.body), false);
                }
            });
        }
        else {
            CargarInfoEtapa(false);
        }
    });

    let index = $.grep(etapas, function (n, i) { return n.IdEtapaProceso == window.location.href.split("/")[window.location.href.split("/").length - 1]; });

    $("#smartwizard").smartWizard("goToPage", index[0].Item - 1);

    // modificar pluging de acuerdo standar TSM 
    KdoButton($("#swbtnnext"), "arrow-double-60-right", "Etapa siguiente");
    KdoButton($("#swbtnprev"), "arrow-double-60-left", "Etapa Previa");
    $("#swbtnnext").removeClass("btn btn-secondary");
    $("#swbtnprev").removeClass("btn btn-secondary");
};

/**
 * obtiene el valor del campo checkbox
 * @param {HTMLInputElement} InputElem  recibe el elemento checkbox
 * @returns {boolean} retorna el valor del ckeckbox
 */
var KdoChkGetValue = function (InputElem) {
    return InputElem.is(':checked');
};

/**
 * coloca un valor en el campo checkbox
 * @param {HTMLInputElement} InputElem recibe el elemento checkbox
 * @param {boolean} value valor que recibira el checkbox
 */
var kdoChkSetValue = function (InputElem, value) {
    InputElem.prop('checked', value);
};

/**
 * obtiene el valor del campo  radio button
 * @param {HTMLInputElement} InputElem  recibe el elemento  radio button
 * @returns {boolean} retorna el valor del  radio button
 */
var KdoRbGetValue = function (InputElem) {
    return InputElem.is(':checked');
};

/**
 * coloca un valor en el campo radio button
 * @param {HTMLInputElement} InputElem recibe el elemento  radio button
 * @param {boolean} value valor que recibira el radio button
 */
var kdoRbSetValue = function (InputElem, value) {
    InputElem.prop('checked', value);
};
//#region Cosulta Historica
var fn_FormulaHistorica = function (divCcf) {

    if ($("#" + divCcf + "").children().length === 0) {
        $.ajax({
            url: "/AXFormulaciones/ConsultaHistoricaFormulas",
            async: false,
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                fn_CargarVistaModalFormulacion(resultado, divCcf);
            }
        });
    } else {

        fn_CargarVistaModalFormulacion("", divCcf);
    }
};

var fn_CargarVistaModalFormulacion = function (data, divCcf) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    if (listJs.filter(listJs => listJs.toString().endsWith("ConsultaHistoricaFormulas.js")).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/ConsultaHistoricaFormulas.js";
        script.onload = function () {
            fn_ShowModalFH(true, data, divCcf);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalFH(false, data, divCcf);
    }
};

var fn_ShowModalFH = function (cargarJs, data, divCcf) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_DRLoadConsultaHis(divCcf);
        } else {
            fn_ConsultaHis();
        }
    };
    let onClose = function () {
        //$("#" + divCcf + "").children().remove();
    };
    $("#" + divCcf + "").kendoDialog({
        height: "auto",// $(window).height() - "300" + "px",
        width: "70%",
        title: "Formulas Historicas",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        maxHeight: 800,
        show: onShow,
        close: onClose

    });

    $("#" + divCcf + "").data("kendoDialog").open();
};
//#endregion 