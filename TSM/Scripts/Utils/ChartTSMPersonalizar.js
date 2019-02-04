
const TipoGrafico = {
    area: 'area',
    bar: 'bar',
    bubble: 'bubble',
    bullet: 'bullet',
    candlestick: 'candlestick',
    column: 'column',
    donut: 'donut',
    funnel: 'funnel',
    line: 'line',
    ohlc: 'ohlc',
    pie: 'pie',
    polarArea: 'polarArea',
    polarLine: 'polarLine',
    polarScatter: 'polarScatter',
    radarArea: 'radarArea',
    radarColumn: 'radarColumn',
    radarLine: 'radarLine',
    rangeArea: 'rangeArea',
    rangeBar: 'rangeBar',
    rangeColumn: 'rangeColumn',
    scatter: 'scatter',
    scatterLine: 'scatterLine',
    waterfall: 'waterfall',
    verticalArea: 'verticalArea',
    verticalBullet: 'verticalBullet',
    verticalLine: 'verticalLine',
    verticalRangeArea: 'verticalRangeArea'

};
const PosicionLeyenda = {
    top:"top",
    bottom:"bottom",
    left:"left",
    right:"right",
    custom:"custom"
};

const AlinearLeyenda = {
    start:"start",
    center:"center",
    end:"end"
};

const PosicionTitulo = {
    top: "top",
    bottom: "bottom"
};

const AlinearTitulo = {
    start: "start",
    center: "center",
    end: "end"
};
//#region creacion de charts.
const PosicionLabel = {
    above: "above", // the label is positioned at the top of the marker.Applicable for series that render points, incl.bubble.
    below: "below", //the label is positioned at the bottom of the marker.Applicable for series that render points, incl.bubble.
    center: "center", //the label is positioned at the point center.Applicable for bar, column, donut, pie, funnel, radarColumn and waterfall series.
    insideBase: "insideBase", //- the label is positioned inside, near the base of the bar.Applicable for bar, column and waterfall series.
    insideEnd: "insideEnd",// - the label is positioned inside, near the end of the point.Applicable for bar, column, donut, pie, radarColumn and waterfall series.
    left: "left",// - the label is positioned to the left of the marker.Applicable for series that render points, incl.bubble.
    outsideEnd: "outsideEnd",// - the label is positioned outside, near the end of the point.Applicable for bar, column, donut, pie, radarColumn and waterfall series.Not applicable for stacked series.
    right: "right",//the label is positioned to the right of the marker.Applicable for series that render points, incl.bubble.
    top: "top",// the label is positioned at the top of the segment.Applicable for funnel series.
    bottom: "bottom",//- the label is positioned at the bottom of the segment.Applicable for funnel series.
    auto: "auto" //- the from and to labels area positioned at the top / bottom(rangeArea series) or left / right(verticalRangeArea series) so that they are outside the filled area.Applicable for rangeArea and verticalRangeArea series.

};

/**
 * Dibuja la grafica utilizando datos remotos 
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {string} Titulo Establecer el Titulo del grafico
 * @param {string} Url Url donde se obtienen los datos remotos.
 * @param {Array} field Configurar los campos de serie ejemplo : var CampoSerie = ["nuclear", "hydro", "wind"];
 * @param {Array} name Configurar los campos de nombre de serie ejemplo :  var NombreSerie = ["nuclear", "hydro", "wind"];
 * @param {string} categoryField establecer el nombre de categoría de la serie por defecto será "category"  ejemplo.   var CategoriaSerie = "year";
 * @param {const} TipoGrafico establecer el tipo de grafico.
 * @param {boolean} verLeyenda se establece en true para mostrar leyenda.
 */
var CrearGraficoDSremoto = function (e, Titulo, Url, field, name, categoryField, TipoGrafico, verLeyenda) {

    categoryField = categoryField === "" ? "category" : givenOrDefault(categoryField, "category");

    if (!TipoGrafico) {
        throw new Error('Tipo de Grafico no esta definido');
    }

    var series = [];
    $.each(field, function (index, elemento) {
        series.push({ field: elemento, name: name[index], categoryField: categoryField });

    });

    e.kendoChart({
        title: {
            text: Titulo
        },
        legend: {
            visible: verLeyenda
        },
        //zoomable: true,
        dataSource: {
            transport: {
                read: Url,
                datatype: "json"

            }
        },
        seriesDefaults: { type: TipoGrafico },
        series: series,
        chartArea: {
            background: ""
        }

    });
};

/**
 * Dibuja la grafica basado en serie de datos  ejemplo
 *  {category: "category 1", value: 50,color: "#011F4B"},{ category: "category 2",value: 25, color: "#03396C"}
 * @param {DivElemento} e  <Div> donde se dibujara la grafica.
 * @param {string} Titulo  Establecer el Titulo del grafico
 * @param {any} DataSeries serie de datos ejemplo {category: "category 1", value: 50,color: "#011F4B"},{ category: "category 2",value: 25, color: "#03396C"}
 * @param {string} categoryField establecer el nombre de categoría de la serie por defecto será "category" 
 * @param {const} TipoGrafico establecer el tipo de grafico.
 * @param {boolean} verLeyenda se establece en true para mostrar leyenda.
 
 */
var CrearGrafico = function (e, Titulo, DataSeries, categoryField,TipoGrafico, verLeyenda) {

    categoryField = categoryField === "" ? "category" : givenOrDefault(categoryField, "category");

    if (!TipoGrafico) {
        throw new Error('Tipo de Grafico no esta definido');
    }
    e.kendoChart({
        title: {
            text: Titulo
        },
        legend: {
            visible: verLeyenda
        },
        //zoomable: true,
        series: [{
            type: TipoGrafico,
            startAngle : 150,
            data: DataSeries,
            categoryField: categoryField
        }],
        chartArea: {
            background: ""
        }

    });

};

/**
 *  configura el eje de valores dentro del grafico.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {number} rotacion Opcional : aplica opciones de rotacion para los valores en el grafico ejemplo 90, 180, etc.
 * @param {string} format opcional : aplica opciones de formato al eje de valores ejemplo ${0:N2"}
 */
var ConfigEjeValores = function (e,rotacion,format) {
  
    var Prop = {
        valueAxis: {
            labels: {
                rotation: rotacion === "" ? "auto" : givenOrDefault(rotacion, "auto"),
                format: format === "" ? "auto" : givenOrDefault(format, "auto")
            }
            //majorUnit: 10000
        }
    };
    var charts = e.data("kendoChart");
    charts.setOptions(Prop);
};
/**
 * configura el eje de categorias dentro del grafico.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {number} rotacion Opcional : aplica opciones de rotacion para las categorias en el grafico ejemplo 90, 180, etc.
 * @param {string} format opcional : aplica opciones de formato al eje de categorias ejemplo ${0:N2"}
 */
var ConfigEjeCategoria = function (e, rotacion, format) {

    var Prop = {
        categoryAxis: {
            labels: {
                rotation: rotacion === "" ? "auto" : givenOrDefault(rotacion, "auto"),
                format: format === "" ? "auto" : givenOrDefault(format, "auto")
            }
        }
    };
    var charts = e.data("kendoChart");
    charts.setOptions(Prop);

};
/**
 * configura el tooltips.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {boolean} visible  se establece en true para mostrar tooltips en el grafico.
 * @param {string} format opcional : aplica opciones de formato al tooltips ejemplo ${0}
 */
var ConfigTooltipGrafico = function (e, visible, format) {
    var Prop = {
        tooltip: {
            visible: visible,
            format: format === "" ? "auto" : givenOrDefault(format, "auto")
        }
    };
    var charts = e.data("kendoChart");
    charts.setOptions(Prop);
};
/**
 * Configura la leyenda del grafico.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {const} PosicionLeyenda establece la posición de la leyenda en el grafico.
 * @param {boolean} visible se establece en true para mostrar leyenda en el grafico.
 * @param {const} AlinearLeyenda establece la aliniacion de la leyenda en el grafico ejemplo "center"
 */
var ConfigLeyendaGrafico = function (e, PosicionLeyenda, visible, AlinearLeyenda) {

    if (!PosicionLeyenda) {
        throw new Error('Posicion de leyenda no esta definido');
    }
    if (!AlinearLeyenda) {
        throw new Error('Alineacion de leyenda no esta definido');
    }
    var Prop = {
        legend: {
            position: PosicionLeyenda,
            visible: visible,
            align: AlinearLeyenda
        }
    };

    var charts = e.data("kendoChart");
    charts.setOptions(Prop);
};
/**
 * configura el titulo del grafico.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {const} PosicionTitulo establece la posición del titulo en el grafico.
 * @param {boolean} visible  se establece en true para mostrar el titulo en el grafico.
 * @param {const} AlinearTitulo establece la aliniacion del titulo en el grafico ejemplo "center"
 */
var ConfigTituloGrafico = function (e, PosicionTitulo, visible, AlinearTitulo) {

    if (!PosicionTitulo) {
        throw new Error('Posicion Titulo no esta definido');
    }
    if (!AlinearTitulo) {
        throw new Error('Alineacion Titulo no esta definido');
    }
    var Prop = {
        title: {
            position: PosicionTitulo,
            visible: visible,
            align: AlinearTitulo
        }
    };

    var charts = e.data("kendoChart");
    charts.setOptions(Prop);
};

/**
 * configurar las opciones por defecto para todas las series.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {boolean} visible se establece en true si va mostrar el grafico las etiquetas de la serie
 * @param {const} PosicionLabel determina la posición de la etiqueta ejem. PosicionLabel.outsideEnd
 * @param {string} template plantilla para representar la etiqueta de serie en el grafico
 */
var ConfigSeriesxDefectoGrafico = function (e, visible, PosicionLabel, template) {

    if (!PosicionLabel) {
        throw new Error('Posicion de etiquetas no esta definido');
    }

    var Prop = {
        seriesDefaults: {
            labels: {
                visible: givenOrDefault(visible, true),
                position: givenOrDefault(PosicionLabel, "outsideEnd"),
                background: "transparent",
                template: givenOrDefault(template, "")
            }
        }
    };

    var charts = e.data("kendoChart");
    charts.setOptions(Prop);

};

/**
 * configura botones de exportacionm para el grafico
 * @param {DivElemento} e  <Div> donde se dibujara la grafica.
 * @param {string} IdDivExp Id de la etiqueta span que contendra los botones de exportación.
 * @param {boolean} fPdf si se coloca true habilita boton de exportacion a Pdf
 * @param {boolean} fImg si se coloca true habilita boton de exportacion a img
 * @param {boolean} fsvg si se coloca true habilita boton de exportacion a svg
 */
var ConfigExportarGrafico = function (e, IdDivExp, fPdf, fImg, fsvg) {
    $("#" + IdDivExp + "").children().remove();
    $("#" + IdDivExp + "").append(
        '<button type="button" id="' + IdDivExp + '_pdf" name="' + IdDivExp + '_pdf" ></button>' +
        '<button type="button" id="' + IdDivExp + '_img" name="' + IdDivExp + '_img" ></button>' +
        '<button type="button" id="' + IdDivExp + '_svg" name="' + IdDivExp + '_svg" ></button>'  );

    KdoButton($("#" + IdDivExp + "_pdf"), "pdf", "Exportar a pdf");
    KdoButton($("#" + IdDivExp + "_img"), "image-export", "Exportar a imagen");
    KdoButton($("#" + IdDivExp + "_svg"), "file", "Exportar a Grafico vectorial");

    $("#" + IdDivExp + "_pdf").click(function () {
        var chart = e.getKendoChart();
        chart.exportPDF({ paperSize: "auto", margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" } }).done(function (data) {
            kendo.saveAs({
                dataURI: data,
                fileName: "chart.pdf"
            });
        });
    });

    $("#" + IdDivExp + "_img").click(function () {
        var chart = e.getKendoChart();
        chart.exportImage().done(function (data) {
            kendo.saveAs({
                dataURI: data,
                fileName: "chart.png"
            });
        });
    });

    $("#" + IdDivExp + "_svg").click(function () {
        var chart = e.getKendoChart();
        chart.exportSVG().done(function (data) {
            kendo.saveAs({
                dataURI: data,
                fileName: "chart.svg"
            });
        });
    });



};

//#endregion creacion de charts.


//#region creacion de Sparkline

/**
 * Dibuja la grafica miniaturas utilizando datos remotos 
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {string} Titulo Establecer el Titulo del grafico
 * @param {string} Url Url donde se obtienen los datos remotos.
 * @param {Array} field Configurar los campos de serie ejemplo : var CampoSerie = ["nuclear", "hydro", "wind"];
 * @param {Array} name Configurar los campos de nombre de serie ejemplo :  var NombreSerie = ["nuclear", "hydro", "wind"];
 * @param {string} categoryField establecer el nombre de categoría de la serie por defecto será "category"  ejemplo.   var CategoriaSerie = "year";
 * @param {const} TipoGrafico establecer el tipo de grafico.
 * @param {boolean} verLeyenda se establece en true para mostrar leyenda.
 */
var CrearGraficoDSremotoSpark = function (e, Titulo, Url, field, name, categoryField, TipoGrafico, verLeyenda) {

    categoryField = categoryField === "" ? "category" : givenOrDefault(categoryField, "category");

    if (!TipoGrafico) {
        throw new Error('Tipo de Grafico no esta definido');
    }

    var series = [];
    $.each(field, function (index, elemento) {
        series.push({ field: elemento, name: name[index], categoryField: categoryField });

    });

    e.kendoSparkline({
        title: {
            text: Titulo
        },
        legend: {
            visible: verLeyenda
        },
        //zoomable: true,
        dataSource: {
            transport: {
                read: Url,
                datatype: "json"

            }
        },
        seriesDefaults: { type: TipoGrafico },
        series: series,
        chartArea: {
            background: ""
        }

    });
};


/**
 * Dibuja la grafica niniatura basado en serie de datos  ejemplo
 *  {category: "category 1", value: 50,color: "#011F4B"},{ category: "category 2",value: 25, color: "#03396C"}
 * @param {DivElemento} e  <Div> donde se dibujara la grafica.
 * @param {string} Titulo  Establecer el Titulo del grafico
 * @param {any} DataSeries serie de datos ejemplo {category: "category 1", value: 50,color: "#011F4B"},{ category: "category 2",value: 25, color: "#03396C"}
 * @param {string} categoryField establecer el nombre de categoría de la serie por defecto será "category" 
 * @param {const} TipoGrafico establecer el tipo de grafico.
 * @param {boolean} verLeyenda se establece en true para mostrar leyenda.
 
 */
var CrearGraficoSpark = function (e, Titulo, DataSeries, categoryField, TipoGrafico, verLeyenda) {

    categoryField = categoryField === "" ? "category" : givenOrDefault(categoryField, "category");

    if (!TipoGrafico) {
        throw new Error('Tipo de Grafico no esta definido');
    }
    e.kendoSparkline({
        title: {
            text: Titulo
        },
        legend: {
            visible: verLeyenda
        },
        zoomable: true,
        series: [{
            type: TipoGrafico,
            startAngle: 150,
            data: DataSeries,
            categoryField: categoryField
        }],
        chartArea: {
            background: ""
        }

    });

};

/**
 * configura el tooltips.
 * @param {DivElemento} e <Div> donde se dibujara la grafica.
 * @param {boolean} visible  se establece en true para mostrar tooltips en el grafico.
 * @param {string} format opcional : aplica opciones de formato al tooltips ejemplo ${0}
 * @param {string} template opcional : para asignar template
 */
var ConfigTooltipGraficoSpark = function (e, visible, format,template) {
    var Prop = {
        tooltip: {
            visible: visible,
            format: format === "" ? "auto" : givenOrDefault(format, "auto"),
            template: givenOrDefault(template, "") 
        }
    };
    var charts = e.data("kendoSparkline");
    charts.setOptions(Prop);
};


//#endregion creacion de Sparkline