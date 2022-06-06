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
        var resul = Data.filter(function (item) { return item[Keyfilter] !== undefined; });
        return resul[0][Keyfilter];
    } else {
        return "";
    }
};

/**
 * Devuelve fecha y hora actual.
 * @returns {Date} retorna fecha
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
            mensaje = e.Mensaje + (e.Output === null || e.Output === undefined ? "" : " " + e.Output);
            tipo = e.TipoCodigo === "Satisfactorio" ? "success" : "error";
        }
        else {
            mensaje = e[1].Mensaje + (e[1].Output === null || e[1].Output === undefined ? "" : " " + e[1].Output);
            tipo = e[1].TipoCodigo === "Satisfactorio" ? "success" : "error";
        }

        if (tipo === "error") {
            let MensajeTemplate = kendo.template("<div class='float-left'><span class='k-icon k-i-error' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='YesButton' style='width: 100px;' onclick='windowMensaje.close(); return;'>Aceptar</button>");
            windowMensaje = $("<div />").kendoWindow({
                title: "Información",
                visible: false,
                width: "30%", //500px
                height: "30%", //200Px
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
        mensaje = (e.responseJSON.Mensaje === null || e.responseJSON.Mensaje === undefined ? e.responseJSON.ExceptionMessage === undefined ? e.responseJSON.Message : e.responseJSON.ExceptionMessage : e.responseJSON.Mensaje)
            + (e.responseJSON.Output === null || e.responseJSON.Output === undefined ? "" : " " + e.responseJSON.Output);
        icono = e.responseJSON.TipoCodigo === "Satisfactorio" ? "k-i-information" : "k-i-error";
        MensajeTemplate = kendo.template("<div class='float-left'><span class='k-icon " + icono + "' style='font-size: 55px; margin: 10px'></span></div><p style='height: 100px;'>" + mensaje + "</p><div class='float-right'><button class='k-button k-primary' id='OkButton' style='width: 100px;' onclick='windowMensaje.close(); return;'>Aceptar</button>");
        windowMensaje = $("<div />").kendoWindow({
            title: "Error",
            visible: false,
            width: "30%",
            height: "30%",
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
            width: "30%", //400px
            height: "30%",//200px
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
        width: "30%",
        height: "30%",
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
 * @param {HTMLDivElement} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
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
 * @param {HTMLDivElement} e tiqueta <DIV> a utilizar para mostrar el kendoDialog.
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
 * @param {HTMLDivElement} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
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
 * @param {HTMLDivElement} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
 * @param {Number} IdRequerimiento codigo del requerimiento de desarrollo.
 */
var Fn_VistaConsultaRequerimientoGet = function (e, IdRequerimiento) {
    var dialog = e;
    dialog.data("kendoDialog").open();
    Fn_ConsultaRequerimientoDes(IdRequerimiento);
};
/**
 * Muestra ventana modal consulta analisis de diseño
 * @param {HTMLDivElement} e  etiqueta <DIV> a utilizar para mostrar el kendoDialog.
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
 * @param {HTMLDivElement} e etiqueta <DIV> a utilizar para mostrar el kendoDialog.
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
 * @param {HTMLDivElement} e  etiqueta <DIV> a utilizar para mostrar el kendoDialog.
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
 * @param {JSON} DataSource origen de datos
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
                        + '<img class="img-fluid mx-auto d-block" id="Img_N' + index + '"  src="' + src + '/' + elemento.NombreArchivo + '?v=' + fn_GetUnixTimestamp(elemento.Fecha) +'" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '</div > '
                    );
                }
                else {
                    lista.append(
                        '<div class="carousel-item col-md-6 col-lg-6 ">'
                        + '<img class="img-fluid mx-auto d-block" id="Img_N' + index + '" src="' + src + '/' + elemento.NombreArchivo + '?v=' + fn_GetUnixTimestamp(elemento.Fecha) +'" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '</div > '
                    );
                }
            });
        }

    }
};



/**
 * funcion lee imagenes adjuntas y las inserta en una etiqueta DIV que funciona como carrusel
 * @param {string} Objecarousel por ejemplo $("#MyCarrousel)
 * @param {string} src ubicacion u origen de las imagenes adjuntadas /Adjuntos' 
 * @param {JSON} DataSource origen de datos
 */

var Fn_LeerImagenesMejorado = function (Objecarousel, src, DataSource) {

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
                + '<img class="img-fluid mx-auto d-block" id=' + `"${Objecarousel.id}Def"` + ' src="' + srcDefault + '" onclick="fn_click_Imagen(this)">'
                + '</div > '
            );
        } else {
            $.each(DataSource, function (index, elemento) {
                if (index === 0) {
                    lista.append(
                        '<div class="carousel-item col-md-6 col-lg-6 active">'
                        + '<img class="img-fluid mx-auto d-block" id=' + `"${Objecarousel[index].id}${index}"` + '  src="' + src + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '</div > '
                    );
                }
                else {
                    lista.append(
                        '<div class="carousel-item col-md-6 col-lg-6 ">'
                        + '<img class="img-fluid mx-auto d-block" id=' + `"${Objecarousel[index].id}${index}"` + ' src="' + src + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '</div > '
                    );
                }
            });
        }

    }
};

//' + `"${Objecarousel.id}"` + '

/**
 * funcion lee imagenes adjuntas y las inserta en una etiqueta DIV que funciona como carrusel
 * @param {string} Objecarousel por ejemplo $("#MyCarrousel)
 * @param {string} src ubicacion u origen de las imagenes adjuntadas /Adjuntos' 
 * @param {JSON} DataSource origen de datos
 */

var Fn_DibujarCarrousel = function (Objecarousel, src, DataSource) {

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
                        + '<img class="img-fluid mx-auto d-block" id="Img_N' + index + '"  src="' + src + '/' + elemento.NombreArchivo + '?v=' + fn_GetUnixTimestamp(elemento.Fecha) +'" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '<div class= "caption">'
                        + '<p style="font-size: 16px;"><strong>' + elemento.CaptionImg + '</strong></p>'
                         + '</div>'
                        + '</div > '
                    );
                }
                else {
                    lista.append(
                        '<div class="carousel-item col-md-6 col-lg-6 ">'
                        + '<img class="img-fluid mx-auto d-block" id="Img_N' + index + '" src="' + src + '/' + elemento.NombreArchivo + '?v=' + fn_GetUnixTimestamp(elemento.Fecha)+'" onerror="imgError(this)" onclick="fn_click_Imagen(this)">'
                        + '<div class= "caption">'
                        + '<p style="font-size: 16px;"><strong>' + elemento.CaptionImg + '</strong></p>'
                        + '</div>'
                        + '</div > '
                    );
                }
            });
        }

    }
};

/**
 * metodo cuando ocurre un error al cargar la imagen la remplaza por una imagen definida.
 * @param {HTMLImageElement} image objeto o etiqueta imagen
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


var Fn_Carouselcontentwp = function (IdCarousel  ) {

    var VarCarousel = '<div class="form-row">' +
        '<div class="container-fluid">' +
        '<div id="carouselExampleControls2" class="carousel slide" data-ride="carousel" data-interval="9000">' +
        '<div class="carousel-inner row w-100 " role="listbox" id=' + `"${IdCarousel}"` +' ></div>' +
        '<a class="carousel-control-prev" href="#carouselExampleControls2" role="button" data-slide="prev">' +
        '<span class="carousel-control-prev-icon" style="color: #A05EB5;" aria-hidden="true"></span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="carousel-control-next text-faded" href="#carouselExampleControls2" role="button" data-slide="next">' +
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

var fn_click_ImagenById = function (idElemento) {
    fn_Ver_Img_Modal(idElemento);
};

/**
 * 
 * @param {HTMLDivElement} e objeto o etiqueta  <div> para el cambio de estado
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
 * configura vista para el cambio de estado
 * @param {HTMLDivElement} e objeto o etiqueta  <div> para el cambio de estado
 * @param {function} fn_close opcional funcion a invocar despues de cerrar la ventana cambio estado
 */
var Fn_VistaCambioEstado = function (e,fn_close) {
    if (fn_close === undefined || fn_close === "") {
        onCloseCE = function () { return onCloseCambioEstado(); };
    } else {
        onCloseCE = function () { return fn_close(); };
    }

    VistaPopup = e;
    $.ajax({
        url: "/Estados/CambioEstado",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            VistaPopup.kendoDialog({
                height: "auto",// $(window).height() - "510" + "px",
                width: "20%",
                title: "Cambio de estado",
                closable: true,
                modal: true,
                content: result,
                maxHeight: 800,
                visible: false,
                actions: [
                    { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: Fn_Cambio },
                    { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }

                ],
                close: onCloseCE
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
 * @param {function} fnGuardado este parametro es opcional, si desea guardar un registro o ejecutar una funcion al momento hacer click en el boton cambiar asignar funcion a este parametro
 * @param {function} fn_AfterChange opcional funcion a invocar despues de hacer un cambio satisfactorio
 */
var Fn_VistaCambioEstadoMostrar = function (Tabla, EstadoActual, UrlCambioEstado, SP, Id, fnGuardado, fn_AfterChange) {

    VistaPopup.data("kendoDialog").open();
    var Param = {
        Tabla: Tabla,//obligatorios
        EstadoActual: EstadoActual,//obligatorios
        SP: SP,//obligatorios
        EstadoSiguiente: "",//obligatorios
        Motivo: "",//obligatorios
        Id: Id,
        fnGuardado: fnGuardado,
        fn_AfterChange: fn_AfterChange
    };
    fn_CambioEstadoInicializacion(VistaPopup, UrlCambioEstado, Param);
};

/**
 *  MUESTRA VENTANA MODAL PARA EL CAMBIO DE ESTADOS
 * @param {string} Tabla tabla a cambiar estado
 * @param {string} EstadoActual estado actual del registro
 * @param {string} UrlCambioEstado url cambio  de estado
 * @param {string} SP nombre del proceso almacenado
 * @param {JSON} param id del registo (PK)
 * @param {function} fnGuardado este parametro es opcional, si desea guardar un registro o ejecutar una funcion al momento hacer click en el boton cambiar asignar funcion a este parametro
 *  @param {function} fn_AfterChange opcional funcion a invocar despues de hacer un cambio satisfactorio
 */
var Fn_VistaCambioEstadoVisualizar = function (Tabla, EstadoActual, UrlCambioEstado, SP, param, fnGuardado, fn_AfterChange) {

    VistaPopup.data("kendoDialog").open();
    let data = {
        Tabla: Tabla,//obligatorios
        EstadoActual: EstadoActual,//obligatorios
        SP: SP,//obligatorios
        EstadoSiguiente: "",//obligatorios
        Motivo: "",//obligatorios
        //Id: Id,
        fnGuardado: fnGuardado,
        fn_AfterChange: fn_AfterChange
    };

    data = $.extend(data, param);
    fn_CambioEstadoInicializacion(VistaPopup, UrlCambioEstado, data);
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
/**
 * Habilita o Inhabilita kendo multi select combo
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Combo box
 * @param {boolean} enable true o false
 */
var KdoMultiSelectEnable = function (InputElem, enable) {
    var MultiSelect = InputElem.data("kendoMultiSelect");
    MultiSelect.enable(enable);
};
var opcionesFormaSmartWizard = {
    Defecto: "default",
    Flechas: "arrows",
    Circulos: "circles",
    Puntos: "dots"
};


/**
 * devuelve el valor del kendo multi colum combo
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 * @returns {string} string
 */
var KdoMultiColumnCmbGetValue = function (InputElem) {
    var MultiColumnCombobox = InputElem.data("kendoMultiColumnComboBox");
    return MultiColumnCombobox.value() === "" ? null : MultiColumnCombobox.selectedIndex >= 0 ? MultiColumnCombobox.value() : null;

};

/**
 * coloca valor al kendo multi colum combo
 * @param {HTMLInputElement} InputElem recibe el elemento combo box
 * @param {any} value valor para setear el combobox
 */
var KdoMultiColumnCmbSetValue = function (InputElem, value) {
    var combobox = InputElem.data("kendoMultiColumnComboBox");
    combobox.value(value);

};


/**
 * Habilita o Inhabilita kendo multi colum combo
 * @param {HTMLInputElement} InputElem elemento div que contiene la funcion Combo box
 * @param {boolean} enable true o false
 */
var KdoMultiColumnCmbEnable = function (InputElem, enable) {
    var combobox = InputElem.data("kendoMultiColumnComboBox");
    combobox.enable(enable);
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
    var strIcono = "";
    $.each(etapas, function (index, elemento) {
        strIcono = (elemento.Icono === null ? '' : elemento.Icono).startsWith('k-i') === true ? "'k-icon " + elemento.Icono + " ficonEtp'" : "'" + elemento.Icono + " ficonEtp'";
        EtapaOpc.append(
            "<li class=\"nav-item\">" +
            "<a href=\"#" + SetEtapa + elemento.IdEtapaProceso + "\" class=\"nav-link\" etapa=\"" + elemento.IdEtapaProceso + "\" vista=\"" + elemento.VistaFormulario + "\" indice=\"" + (elemento.Item - 1) + "\">" +
            "<span class=\ " + strIcono + " \"></span><br>" +
            "<small>" + elemento.Nombre + "</small>" +
            "</a>" +
            "</li>");

        $("#EtapasVistas").append(
            "<div id=\"" + SetEtapa + elemento.IdEtapaProceso + "\"></div>"
        );
    });

    // Smart Wizard
    DivIdElement.smartWizard({
        keyNavigation: false,
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
        if (idEtapaProceso !== undefined)
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
                    script.src = "/Scripts/js/" + vista + ".js?" + _version;

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

    let index = $.grep(etapas, function (n, i) { return n.IdEtapaProceso === parseInt(window.location.href.split("/")[window.location.href.split("/").length - 1]); });

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
/**
 * 
 * @param {HtmlElementId} divCcf Id del div que contendra la vista de busqueda de tintas
 */
var fn_FormulaHistorica = function (divCcf) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divCcf + "").children().length === 0) {
        $.ajax({
            url: "/AXFormulaciones/ConsultaHistoricaFormulas",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalFormulacion(resultado, divCcf);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalFormulacion("", divCcf);
    }
};

/**
 * 
 * @param {content} data el contenido html de la busqueda
 * @param {HtmlElementId} divCcf Id del div que contendra la vista de busqueda de tintas
 */
var fn_CargarVistaModalFormulacion = function (data, divCcf) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "ConsultaHistoricaFormulas.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalFH(true, data, divCcf);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalFH(false, data, divCcf);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html de la busqueda
 * @param {HtmlElementId} divCcf  Id del div que contendra la vista de busqueda de tintas
 */
var fn_ShowModalFH = function (cargarJs, data, divCcf) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_DRLoadConsultaHis(divCcf);
        } else {
            fn_ConsultaHis(divCcf);
        }
    };
    let onClose = function () {
        //$("#" + divCcf + "").children().remove();
    };
    $("#" + divCcf + "").kendoDialog({
        height: "85%",// $(window).height() - "300" + "px",
        width: "80%",
        title: "Formulas Historicas",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        maxHeight: 800,
        show: onShow,
        close: onClose

    });

    $("#" + divCcf + "").data("kendoDialog").open().toFront();
};
//#endregion 

//#region Cosulta Catalogo
/**
 * 
 * @param {HtmlElementId} divCD Id del div que contendra la vista de busqueda de tintas
 * @param {numeric} idcli id del cliente
 */
var fn_ConsultarCatalogoDiseno = function (divCD,idcli) {

    if ($("#" + divCD + "").children().length === 0) {
        $.ajax({
            url: "/CatalogoDisenos/ConsultarCatalogoDisenos/" + idcli.toString(),
            async: false,
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                fn_CargarVistaModalCatalogoDiseno(resultado, divCD, idcli);
            }
        });
    } else {

        fn_CargarVistaModalCatalogoDiseno("", divCD, idcli);
    }
};

/**
 * 
 * @param {content} data el contenido html de la busqueda
 * @param {HtmlElementId} divCD Id del div que contendra la vista de busqueda de tintas
 * @param {numeric} idcli id del cliente
 */
var fn_CargarVistaModalCatalogoDiseno = function (data, divCD, idcli) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    if (listJs.filter(listJs => listJs.toString().endsWith("ConsultarCatalogoDisenos.js")).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/ConsultarCatalogoDisenos.js";
        script.onload = function () {
            fn_ShowModalCD(true, data, divCD, idcli);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalCD(false, data, divCD, idcli);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html de la busqueda
 * @param {HtmlElementId} divCD  Id del div que contendra la vista de busqueda de tintas
 * @param {numeric} idcli id del cliente
 */
var fn_ShowModalCD = function (cargarJs, data, divCD, idcli) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_LoadCatalogoDisenos(idcli, divCD);
        }
        else {
            fn_GetCatalogoDisenos(idcli, divCD);
        }
        
    };
    let onClose = function () {
        //$("#" + divCcf + "").children().remove();
    };

    $("#" + divCD + "").kendoDialog({
        height: "70%",// $(window).height() - "300" + "px",
        width: "70%",
        title: "Catalogo de Diseños",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        maxHeight: 800,
        show: onShow,
        close: onClose

    });

    $("#" + divCD + "").data("kendoDialog").open().toFront();
};
//#endregion

//#region Cosulta Catalogo Datlle
/**
 * 
 * @param {HtmlElementId} divCDInf Id del div que contendra la vista de busqueda de tintas
 * @param {number} idCatalogoDiseno id del catalogo
 * @param {number} idArte id del arte
 * @param {function} fnClose ejecutar funcion al cerrar modal
 */
var fn_ConsultarCatalogoDisenoInf = function (divCDInf, idCatalogoDiseno, idArte,fnClose) {
    kendo.ui.progress($(document.body), true);
    if ($("#" + divCDInf + "").children().length === 0) {
        $.ajax({
            url: "/CatalogoDisenos/CatalogoDisenoInf/" + idCatalogoDiseno.toString() + "/" + idArte.toString(),
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.body), false);
                fn_CargarVistaCatalogoDisenoInf(resultado, divCDInf, idCatalogoDiseno, idArte, fnClose);

            }
        });
    } else {
        kendo.ui.progress($(document.body), false);
        fn_CargarVistaCatalogoDisenoInf("", divCDInf, idCatalogoDiseno, idArte, fnClose);
    }
};

/**
 * 
 * @param {content} data el contenido html de la busqueda
 * @param {HtmlElementId} divCDInf Id del div que contendra la vista de busqueda de tintas
 * @param {number} idCatalogoDiseno id del catalogo
 * @param {number} idArte id del arte
 * @param {function} fnClose ejecutar funcion al cerrar modal
 */
var fn_CargarVistaCatalogoDisenoInf = function (data, divCDInf, idCatalogoDiseno, idArte, fnClose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });

    let fileJs = "CatalogoDisenoInf.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalCDInf(true, data, divCDInf, idCatalogoDiseno, idArte, fnClose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalCDInf(false, data, divCDInf, idCatalogoDiseno, idArte, fnClose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html de la busqueda
 * @param {HtmlElementId} divCDInf  Id del div que contendra la vista de busqueda de tintas
 * @param {number} idCatalogoDiseno id del catalogo
 * @param {number} idArte id del arte
 * @param {function} fnClose ejecutar funcion al cerrar modal
 */
var fn_ShowModalCDInf = function (cargarJs, data, divCDInf, idCatalogoDiseno,idArte,fnClose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InfDetalle(divCDInf, idCatalogoDiseno, idArte);
        } else {
            fn_CargarInfDetalle(divCDInf, idCatalogoDiseno, idArte);
        }      
    };
    let onClose = function () {
        if (fnClose === undefined || fnClose === "") {
            return true;
        } else {
            return fnClose();
        }
    };

    $("#" + divCDInf + "").kendoDialog({
        height: "100%",
        width: "95%",
        title: "Detalle",
        closable: true,
        modal: true,
        content: data,
        visible: false,
         show: onShow,
        close: onClose

    });

    $("#" + divCDInf + "").data("kendoDialog").open().toFront();
};
//#endregion

//#region Autorizacion de retenciones
/**
 * 
 * @param {HtmlElementId} divAutRet Id del div que contendra la vista de Autorizacion de retenciones
 * @param {number} retIdot id orden de trabajo
 * @param {number} retIdEtapa etapa del proceso
 * @param {number} retItem item de la etapa
 */
var fn_AutorizarRetenciones = function (divAutRet, retIdot, retIdEtapa, retItem) {
    kendo.ui.progress($(document.body), true);
    if ($("#" + divAutRet + "").children().length === 0) {
        $.ajax({
            url: "/Retenciones/AutorizarRetenciones",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                fn_CargarVistaModalAutorizacion(resultado, divAutRet, retIdot, retIdEtapa, retItem);
                kendo.ui.progress($(document.body), false);
            }
        });
    } else {
        fn_CargarVistaModalAutorizacion("", divAutRet, retIdot, retIdEtapa, retItem);
        kendo.ui.progress($(document.body), false);
    }
};

/**
 * 
 * @param {content} data el contenido html de la Autorizacion de retenciones
 * @param {HtmlElementId} divAutRet Id del div que contendra la vista de Autorizacion de retenciones
 * @param {number} retIdot id orden de trabajo
 * @param {number} retIdEtapa etapa del proceso
 * @param {number} retItem item de la etapa
 */
var fn_CargarVistaModalAutorizacion = function (data, divAutRet, retIdot, retIdEtapa, retItem) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "AutorizarRetenciones.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalAutRet(true, data, divAutRet, retIdot, retIdEtapa, retItem);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalAutRet(false, data, divAutRet, retIdot, retIdEtapa, retItem);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html de la Autorizacion de retenciones
 * @param {HtmlElementId} divAutRet  Id del div que contendra la vista de Autorizacion de retenciones
 * @param {number} retIdot id orden de trabajo
 * @param {number} retIdEtapa etapa del proceso
 * @param {number} retItem item de la etapa
 */
var fn_ShowModalAutRet = function (cargarJs, data, divAutRet, retIdot, retIdEtapa, retItem) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializaAutorizacion(retIdot, retIdEtapa, retItem);
        } else {
            fn_CargarVistaAutorizacion(retIdot, retIdEtapa, retItem);
        }
    };
    let onClose = function () {
        //$("#" + divAutRet + "").children().remove();
    };
    $("#" + divAutRet + "").kendoDialog({
        height: "50%",
        width: "50%",
        title: "Autorizar retenciones",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        maxHeight: 800,
        show: onShow,
        close: onClose

    });

    $("#" + divAutRet + "").data("kendoDialog").open().toFront();
};
//#endregion

//#region Funcion calcular retencion

/**
 * Metodo palcular las retenciones
 * @param {number} vIdOrdenTrabajo orden de trabajo
 * @param {number} vIdModulo el modulo para el cual se le va calcular
 * @param {number} vIdTipoRetencion el tipo de retencion
 * @param {boolean} vSNMostrar Mostrar Retencion catidad de rentenciones generadas
 * @param {function} fn funcion a ejcutar despues de calcular las retenciones
 */
var fn_CalcularRetencion = function (vIdOrdenTrabajo, vIdModulo, vIdTipoRetencion, vSNMostrar, fn) {
    kendo.ui.progress($(document.activeElement), true);
    let fn_CR = function () {
        if (fn === undefined || fn === "") {
            return true;
        } else {
            return fn();
        }
    };
    $.ajax({
        url: TSM_Web_APi + "Retenciones/CalularRetenciones",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            IdOrdenTrabajo: vIdOrdenTrabajo,
            IdModulo: vIdModulo,
            IdTipoRetencion: vIdTipoRetencion,
            SNMostrar: vSNMostrar
        }),
        contentType: "application/json; charset=utf-8",
        complete: function () {
            fn_CR();
            kendo.ui.progress($(document.activeElement), false);
        }
    });
};
//#endregion


//#region Solicitar Registro de cambios
/**
 * 
 * @param {HtmlElementId} divSolIngCambio Id del div que contendra la vista de ingreso de cambio
 * @param {number} sicIdot id orden de trabajo
 * @param {number} sicIdEtapa etapa del proceso
 * @param {number} sicItem item de la etapa
 * @param {number} SicidTipoOrdenTrabajo tipo orden trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_SolicitarIngresoCambio = function (divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo,fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divSolIngCambio + "").children().length === 0) {
        $.ajax({
            url: "/OrdenesTrabajo/SolicitarIngresoCambios",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalSolictudIngresoCambio(resultado, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose);
               
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalSolictudIngresoCambio("", divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo,fnclose);
     
    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngCambio Id del div que contendra la vista de Ingreso de cambios
 * @param {number} sicIdot id orden de trabajo
 * @param {number} sicIdEtapa etapa del proceso
 * @param {number} sicItem item de la etapa
 * @param {number} SicidTipoOrdenTrabajo tipo orden trabajo 
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalSolictudIngresoCambio = function (data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo,fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "SolicitarIngresoCambios.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalSolictudIngresoCambio(true, data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalSolictudIngresoCambio(false, data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo,fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngCambio  Id del div que contendra la vista de Ingreso de cambio
 * @param {number} sicIdot id orden de trabajo
 * @param {number} sicIdEtapa etapa del proceso
 * @param {number} sicItem item de la etapa
 * @param {number} SicidTipoOrdenTrabajo tipo orden trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ShowModalSolictudIngresoCambio = function (cargarJs, data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicialarCargaVistaCambio(sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo);
        } else {
            fn_RegistroCambios();
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined ) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divSolIngCambio + "").kendoDialog({
        height: "70%",
        width: "30%",
        title: "Solicitar cambio",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "30%",
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: function () {return fn_RegistrarSolicitudCambio(sicIdot, sicIdEtapa, sicItem);} },
            { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }
        ],
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divSolIngCambio + "").data("kendoDialog").open().toFront();
   
};
//#endregion

//#region Solicitar Registro de Agenda
/**
 * 
 * @param {HtmlElementId} divAgen Id del div que contendra la vista de ingreso de cambio
 * @param {number} Idot id orden de trabajo
 * @param {number} IdEtapa etapa del proceso
 * @param {number} Item item del proceso
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_OrdenesTrabajosAgendas = function (divAgen,Idot,IdEtapa, Item,fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divAgen + "").children().length === 0) {
        $.ajax({
            url: "/OrdenesTrabajo/RegistroOrdenesTrabajosAgendas",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalOrdenesTrabajosAgenda(resultado, divAgen, Idot, IdEtapa, Item,fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalOrdenesTrabajosAgenda("", divAgen, Idot, IdEtapa, Item, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divAgen Id del div que contendra la vista de Ingreso de cambios
 * @param {number} Idot id orden de trabajo
 * @param {number} IdEtapa etapa del proceso
 * @param {number} Item item del proceso
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalOrdenesTrabajosAgenda = function (data, divAgen, Idot, IdEtapa,Item,fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "RegistroOrdenesTrabajosAgendas.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalOrdenesTrabajosAgenda(true, data, divAgen, Idot, IdEtapa, Item,fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalOrdenesTrabajosAgenda(false, data, divAgen, Idot, IdEtapa, Item, fnclose);
    } 
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divAgen  Id del div que contendra la vista de Ingreso de cambio
 * @param {number} Idot id orden de trabajo
 * @param {number} IdEtapa etapa del proceso
 * @param {number} Item item del proceso
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ShowModalOrdenesTrabajosAgenda = function (cargarJs, data, divAgen, Idot, IdEtapa, Item, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarAgenda(Idot, IdEtapa, Item);
        } else {
            fn_CargarAgenda(Idot, IdEtapa, Item);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined || fn === "") {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divAgen + "").kendoDialog({
        height: "60%",
        width: "70%",
        title: "Agendar Cambios",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "20%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divAgen + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Historico de versiones de Seteos
/**
 * 
 * @param {HtmlElementId} divVerSeteos Id del div que contendra la vista de ingreso de cambio
 * @param {number} Idot id orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_OrdenesTrabajosVersionesSeteos = function (divVerSeteos, Idot, fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divVerSeteos + "").children().length === 0) {
        $.ajax({
            url: "/OrdenesTrabajo/HistoricoSeteos",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalOrdenesTrabajosVersionesSeteos(resultado, divVerSeteos, Idot, fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalOrdenesTrabajosVersionesSeteos("", divVerSeteos, Idot, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divVerSeteos Id del div que contendra la vista de Ingreso de cambios
 * @param {number} Idot id orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalOrdenesTrabajosVersionesSeteos = function (data, divVerSeteos, Idot, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "_HistoricoSeteos.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalOrdenesTrabajosVersionesSeteos(true, data, divVerSeteos, Idot, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalOrdenesTrabajosVersionesSeteos(false, data, divVerSeteos, Idot, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divVerSeteos  Id del div que contendra la vista de Ingreso de cambio
 * @param {number} Idot id orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ShowModalOrdenesTrabajosVersionesSeteos = function (cargarJs, data, divVerSeteos, Idot, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarVersionesSeteos(Idot);
        } else {
            fn_CargarVersionesSeteos(Idot);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined || fn === "") {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divVerSeteos + "").kendoDialog({
        height: "90%",
        width: "70%",
        title: "Historial de versiones seteos",
        closable: true,
        modal: {
            preventScroll: true
        },
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "20%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divVerSeteos + "").data("kendoDialog").open().toFront();
};
//#endregion

var fn_DSIdUnidadByGrupo = function (IdGrupoUnidadMedida) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "Get",
                    async: false,
                    url: TSM_Web_APi + "/RelacionGruposUnidadesMedidas/GetByidGrupoUnidadMedida/" + IdGrupoUnidadMedida,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

var Grid_TemplateCheckBoxColumn = function (data, columna) {
    return "<input id=\"" + data.id + "\" type=\"checkbox\" class=\"k-checkbox\" disabled=\"disabled\"" + (data[columna] ? "checked=\"checked\"" : "") + " />" +
        "<label class=\"k-checkbox-label\" for=\"" + data.id + "\"></label>";
};

//#region Solicitar Reactivacion de cambios
/**
 * 
 * @param {HtmlElementId} divSolIngCambio Id del div que contendra la vista de ingreso de cambio
 * @param {number} sicIdot id orden de trabajo
 * @param {number} sicIdEtapa etapa del proceso
 * @param {number} sicItem item de la etapa
 * @param {number} SicidTipoOrdenTrabajo tipo orden trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_SolicituReactivacionOrdenTrabajo = function (divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divSolIngCambio + "").children().length === 0) {
        $.ajax({
            url: "/OrdenesTrabajo/SolicitudReactivacionOrdenTrabajo",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalSolicitudReactivacionOT(resultado, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalSolicitudReactivacionOT("", divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngCambio Id del div que contendra la vista de Ingreso de cambios
 * @param {number} sicIdot id orden de trabajo
 * @param {number} sicIdEtapa etapa del proceso
 * @param {number} sicItem item de la etapa
 * @param {number} SicidTipoOrdenTrabajo tipo orden trabajo 
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalSolicitudReactivacionOT = function (data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "SolicitudReactivacionOrdenTrabajo.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalSolicitudReactivacionOT(true, data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalSolicitudReactivacionOT(false, data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngCambio  Id del div que contendra la vista de Ingreso de cambio
 * @param {number} sicIdot id orden de trabajo
 * @param {number} sicIdEtapa etapa del proceso
 * @param {number} sicItem item de la etapa
 * @param {number} SicidTipoOrdenTrabajo tipo orden trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ShowModalSolicitudReactivacionOT = function (cargarJs, data, divSolIngCambio, sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicialarCargaVistaReactivacion(sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo);
        } else {
            fn_RegistroReactivacion(sicIdot, sicIdEtapa, sicItem, SicidTipoOrdenTrabajo);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divSolIngCambio + "").kendoDialog({
        height: "auto",
        width: "auto",
        title: "Reactivar orden de trabajo",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "20%",
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: function () { return fn_RegistrarSolicitudReactivacionOT(sicIdot, sicIdEtapa, sicItem); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }
        ],
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divSolIngCambio + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Solicitar Ajustes Tintas/Diseño/revelado
/**
 * 
 * @param {HtmlElementId} divSolIngAjuste Id del div que contendra la vista de ingreso de Ajustes
 * @param {number} siaIdot id orden de trabajo
 * @param {number} siaIdEtapa etapa del proceso
 * @param {number} siaItem item de la etapa
 * @param {number} siaIdSeteo item de la etapa
 * @param {function} SiaIdTipoOT Orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_SolicitarIngresoAjuste = function (divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT,fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divSolIngAjuste + "").children().length === 0) {
        $.ajax({
            url: "/OrdenesTrabajo/SolicitarIngresoAjustes",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalSolictudIngresoAjuste(resultado, divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT,fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalSolictudIngresoAjuste("", divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngAjuste Id del div que contendra la vista de Ingreso de Ajustes
 * @param {number} siaIdot id orden de trabajo
 * @param {number} siaIdEtapa etapa del proceso
 * @param {number} siaItem item de la etapa
 * @param {number} siaIdSeteo  seteo maquina
 * @param {function} SiaIdTipoOT Orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalSolictudIngresoAjuste = function (data, divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT,fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "SolicitarIngresoAjustes.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalSolictudIngresoAjuste(true, data, divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalSolictudIngresoAjuste(false, data, divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT,fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngAjuste  Id del div que contendra la vista de Ingreso de cambio
 * @param {number} siaIdot id orden de trabajo
 * @param {number} siaIdEtapa etapa del proceso
 * @param {number} siaItem item de la etapa
 * @param {function} siaIdSeteo seteo maquina
 * @param {function} SiaIdTipoOT Orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_ShowModalSolictudIngresoAjuste = function (cargarJs, data, divSolIngAjuste, siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarCargaVistaAjuste(siaIdot, siaIdEtapa, siaItem, siaIdSeteo, SiaIdTipoOT);
        } else {
            fn_RegistroAjuste(siaIdot, siaIdEtapa, siaItem, siaIdSeteo);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divSolIngAjuste + "").kendoDialog({
        height: "80%",
        width: "70%",
        title: "Solicitar Ajustes",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "30%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divSolIngAjuste + "").data("kendoDialog").open().toFront();

};
//#endregion


//#region Crreacion de Nuevo Ajuste 
/**
 * 
 * @param {HtmlElementId} divSolIngAjuste Id del div que contendra la vista de Crear Nuevo Ajuste
 * @param {number} IdSeteo codigo del seteo
 * @param {number} IdEstacion codigo de estacion
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CrearNuevoAjusteFormulas = function (divSolIngAjuste, IdSeteo,IdEstacion, fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divSolIngAjuste + "").children().length === 0) {
        $.ajax({
            url: "/Estaciones/TintasFormulacionesNuevoAjuste",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalNuevoAjusteFormulas(resultado, divSolIngAjuste, IdSeteo, IdEstacion, fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalNuevoAjusteFormulas("", divSolIngAjuste, IdSeteo, IdEstacion, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngAjuste Id del div que contendra la vista de Ingreso de Ajustes
 * @param {number} IdSeteo  seteo maquina
 * @param {number} IdEstacion codigo estacion
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalNuevoAjusteFormulas = function (data, divSolIngAjuste, IdSeteo, IdEstacion, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "TintasFormulacionesNuevoAjuste.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalNuevoAjusteFormulas(true, data, divSolIngAjuste, IdSeteo, IdEstacion,  fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalNuevoAjusteFormulas(false, data, divSolIngAjuste, IdSeteo, IdEstacion,  fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divSolIngAjuste  Id del div que contendra la vista de Ingreso de cambio
 * @param {number} IdSeteo seteo maquina
 * @param {number} IdEstacion codigo estacion
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_ShowModalNuevoAjusteFormulas = function (cargarJs, data, divSolIngAjuste, IdSeteo, IdEstacion,  fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarNuevoAjuste(IdSeteo, IdEstacion, divSolIngAjuste);
        } else {
            fn_CargarNuevoAjuste(IdSeteo, IdEstacion, divSolIngAjuste);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divSolIngAjuste + "").kendoDialog({
        height: "auto",
        width: "20%",
        title: "Crear ajuste",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        show: onShow,
        close: fn_CloseSIC,
        maxHeight: 900
    });

    $("#" + divSolIngAjuste + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Generar ficha de producción
/**
 * Generar ficha de produccion
 * @param {HtmlElementId} divGenFP Id del div que contendra la vista de generar fp
 * @param {number} gFpIdot id orden de trabajo
 * @param {number} gFpIdSimulacion id simulacion
 * @param {number} gFpIdCotizacion id cotizacion
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_GenerarFichaProduccion = function (divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divGenFP + "").children().length === 0) {
        $.ajax({
            url: "/CatalogoDisenos/GenerarFichaProduccion",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalGenerarFichaProd(resultado, divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalGenerarFichaProd("", divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT);

    }
};

/**
 * cargar ficha de produccion
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divGenFP Id del div que contendra la vista de generar fp
 * @param {number} gFpIdot id orden de trabajo
 * @param {number} gFpIdSimulacion id simulacion
 * @param {number} gFpIdCotizacion id cotizacion
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalGenerarFichaProd = function (data, divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "GenerarFichaProduccion.js?" + _version;
    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalGenFichaProd(true, data, divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalGenFichaProd(false, data, divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divGenFP Id del div que contendra la vista de generar fp
 * @param {number} gFpIdot id orden de trabajo
 * @param {number} gFpIdSimulacion id simulacion
 * @param {number} gFpIdCotizacion id cotizacion
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ShowModalGenFichaProd = function (cargarJs, data, divGenFP, gFpIdot, gFpIdSimulacion, gFpIdCotizacion, fnclose, listDimensionesOT, listaTallasNoOT) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarCargarFichaProd(gFpIdot, listaTallasNoOT);
        } else {
            fn_CrearFichaProd(gFpIdot, listaTallasNoOT);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divGenFP + "").kendoDialog({
        height: "auto",
        width: "auto",
        title: "Generar ficha de produccion",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "20%",
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspGenerar', primary: true, action: function () { return fn_FichaProGenerar(gFpIdot, gFpIdSimulacion, gFpIdCotizacion, listDimensionesOT); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }
        ],
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divGenFP + "").data("kendoDialog").open().toFront();

};
//#endregion


//#region Actualizar cantidades estaciones permitidas
/**
 * 
 * @param {HtmlElementId} divCntEstaPermi Id del div que contendra la actaulizacion de estaciones permiidas
 * @param {number} cepIdot id orden de trabajo
 * @param {number} cepIdEtapa etapa del proceso
 * @param {number} cepItem item de la etapa
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ActualizarEstacionesPermitidas = function (divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divCntEstaPermi + "").children().length === 0) {
        $.ajax({
            url: "/OrdenesTrabajo/AutorizarEstacionesPermitidas",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalActualizarEstacionesPermitidas(resultado, divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalActualizarEstacionesPermitidas("", divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divCntEstaPermi Id del div que contendra la actaulizacion de estaciones permiidas
 * @param {number} cepIdot id orden de trabajo 
 * @param {number} cepIdEtapa etapa del proceso
 * @param {number} cepItem item de la etapa
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalActualizarEstacionesPermitidas = function (data, divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "AutorizarEstacionesPermitidas.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalActualizarEstacionesPermitidas(true, data, divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalActualizarEstacionesPermitidas(false, data, divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divCntEstaPermi  Id del div que contendra la actaulizacion de estaciones permiidas
 * @param {number} cepIdot id orden de trabajo
 * @param {number} cepIdEtapa etapa del proceso
 * @param {number} cepItem item de la etapa
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_ShowModalActualizarEstacionesPermitidas = function (cargarJs, data, divCntEstaPermi, cepIdot, cepIdEtapa, cepItem, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarCntActualizarEstacionesPermitidas(divCntEstaPermi,cepIdot, cepIdEtapa, cepItem);
        } else {
            fn_ActualizarCntEstacionesPermitidas(divCntEstaPermi,cepIdot, cepIdEtapa, cepItem);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divCntEstaPermi + "").kendoDialog({
        height: "45%",
        width: "30%",
        title: "Actualizar Estaciones Permitidas",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divCntEstaPermi + "").data("kendoDialog").open().toFront();

};
//#endregion

//#region Actualizar Dimensiones
/**
 * 
 * @param {HtmlElementId} divDimen Id del div que contendra la actualizacion de dimensiones
 * @param {number} dmIdreq id orden requerimiento
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_ActualizarDimensiones = function (divDimen, dmIdreq, fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + divDimen + "").children().length === 0) {
        $.ajax({
            url: "/RequerimientoDesarrollos/DimensionesRequerimiento",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalDimensiones(resultado, divDimen, dmIdreq,fnclose);

            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalDimensiones("", divDimen, dmIdreq, fnclose);

    }
};

/**
 * 
 * @param {content} data el contenido html del registro de cambio
 * @param {HtmlElementId} divDimen Id del div que contendra la actualizacion de dimensiones
 * @param {number} dmIdreq id orden de trabajo
 * @param {function} fnclose funcion a ejecutar al cerrar modal
 */
var fn_CargarVistaModalDimensiones = function (data, divDimen, dmIdreq, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = "DimensionesRequerimiento.js?" + _version;

    if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + fileJs;
        script.onload = function () {
            fn_ShowModalDimensiones(true, data, divDimen, dmIdreq, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalDimensiones(false, data, divDimen, dmIdreq, fnclose);
    }
};
/**
 * 
 * @param {boolean} cargarJs true inidica que primera vez que va cargar y dibujar la vista, false ya cargo y solo hay que consultar.
 * @param {content} data  el contenido html del registro de cambio
 * @param {HtmlElementId} divDimen  Id del div que contendra la actualizacion de dimensiones
 * @param {number} dmIdreq id orden de requerimiento
 * @param {function} fnclose funcion a ejecutar al cerrar modal

 */
var fn_ShowModalDimensiones = function (cargarJs, data, divDimen, dmIdreq, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarDimensiones(divDimen, dmIdreq);
        } else {
            fn_ActualizarDimensionesRequerimiento(divDimen, dmIdreq);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined) {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divDimen + "").kendoDialog({
        height: "45%",
        width: "50%",
        title: "Actualizar Dimensiones",
        closable: true,
        modal: true,
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "10%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divDimen + "").data("kendoDialog").open().toFront();

};
//#endregion

var fn_GetUnixTimestamp = function (fecha) {
    return new Date(kendo.toString(kendo.parseDate(fecha), 's')).getTime() / 1000;
};

let fn_ListModal = [];
let Jsload = false;
/**
 * funcion para cargar vistas modales
 * @param {JSON} obj configuración
 */

let fn_GenLoadModal = (obj) => {

    kendo.ui.progress($(document.activeElement), true);

    let script = "";
    let xview;
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = `${obj.config[0].Js}?${_version}`;
    let onShow = function () {
        Jsload === true ? window[obj.fn.fnLoad](obj.Param) : window[obj.fn.fnReg](obj.Param);
        kendo.ui.progress($(document.activeElement), false);
    };

    let fn_CloseSIC = function () {
        obj.fn.fnclose === "" ? undefined : window[obj.fn.fnclose](obj.Param);
        kendo.ui.progress($(document.activeElement), false);
    };


    if ($("#" + obj.config[0].Div + "").children().length === 0) {
        $.get("/ModalGenLoad/Load/", { vistaParcial: `${obj.config[0].Vista}` }, function (data) {
            xview = data;
            //configurar modal
            $("#" + obj.config[0].Div + "").kendoDialog({
                height: obj.config[0].Height,
                width: obj.config[0].Width,
                title: obj.config[0].Titulo,
                closable: true,
                modal: true,
                content: data,
                visible: false,
                minWidth: obj.config[0].MinWidth,
                show: onShow,
                close: fn_CloseSIC
            });
            if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
                script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "/Scripts/js/" + fileJs;
                script.onload = function () {
                    Jsload = true;
                    kendo.ui.progress($(document.activeElement), false);
                    $("#" + obj.config[0].Div + "").data("kendoDialog").open().toFront()
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            }

        });
    } else {
        kendo.ui.progress($(document.activeElement), true);
        Jsload = false;
        $("#" + obj.config[0].Div + "").kendoDialog({
            height: obj.config[0].Height,
            width: obj.config[0].Width,
            title: obj.config[0].Titulo,
            closable: true,
            modal: true,
            content: xview,
            visible: false,
            minWidth: obj.config[0].MinWidth,
            show: onShow,
            close: fn_CloseSIC
        });
        kendo.ui.progress($(document.activeElement), false);
        $("#" + obj.config[0].Div + "").data("kendoDialog").open().toFront()

    }
}

/**
 * funcion para cargar vistas modales
 * @param {JSON} obj configuración
 */

let fn_GenLoadModalWindow = (obj) => {

    kendo.ui.progress($(document.body), true);

    let script = "";
    let xview;
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    let fileJs = `${obj.config[0].Js}?${_version}`;
    let onShow = function () {
        Jsload === true ? window[obj.fn.fnLoad](obj.Param) : window[obj.fn.fnReg](obj.Param);
        kendo.ui.progress($(document.body), false);
    };

    let onActivate = function () {
        obj.fn.fnActi === "" ? undefined : window[obj.fn.fnActi](obj.Param);
        kendo.ui.progress($(document.body), false);
    };

    let fn_CloseSIC = function () {
        obj.fn.fnclose === "" ? undefined : window[obj.fn.fnclose](obj.Param);
        kendo.ui.progress($(document.body), false);
    };


    if ($("#" + obj.config[0].Div + "").children().length === 0) {
        $.get("/ModalGenLoad/Load/", { vistaParcial: `${obj.config[0].Vista}` }, function (data) {
            xview = data;
            //configurar modal
            $("#" + obj.config[0].Div + "").kendoWindow({
                height: obj.config[0].Height,
                width: obj.config[0].Width,
                title: obj.config[0].Titulo,
                modal: true,
                /*   content: data,*/
                visible: false,
                minWidth: obj.config[0].MinWidth,
                activate: onActivate,
                close: fn_CloseSIC
            });
            if (listJs.filter(listJs => listJs.toString().endsWith(fileJs)).length === 0) {
                script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "/Scripts/js/" + fileJs;
                script.onload = function () {
                    Jsload = true;
                    kendo.ui.progress($(document.body), false);
                    $("#" + obj.config[0].Div + "").data("kendoWindow").content(xview);
                    $("#" + obj.config[0].Div + "").data("kendoWindow").center().open();
                    onShow();
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            }

        });
    } else {
        kendo.ui.progress($(document.body), true);
        Jsload = false;
        $("#" + obj.config[0].Div + "").kendoWindow({
            height: obj.config[0].Height,
            width: obj.config[0].Width,
            title: obj.config[0].Titulo,
            modal: true,
            /*     content: xview,*/
            visible: false,
            minWidth: obj.config[0].MinWidth,
            activate: onActivate,
            close: fn_CloseSIC
        });
        kendo.ui.progress($(document.body), false);
        $("#" + obj.config[0].Div + "").data("kendoWindow").content(xview);
        $("#" + obj.config[0].Div + "").data("kendoWindow").center().open();
        onShow();

    }
}