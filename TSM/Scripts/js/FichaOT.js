var Permisos;
let xIdArte = 0;
let xIdSeteo = 0;

$(document).ready(function () {
    xIdOt = xIdOt === undefined ? 0 : xIdOt;
    KdoButton($("#btnIrGOT"), "hyperlink-open-sm");
    // carga carrousel de imagenes 
    var DivCarousel = $("#C_ImgDiseño");
    //Configuracion de panel
    PanelBarConfig($("#bpanel"));
    DivCarousel.append(Fn_Carouselcontent());
    fn_GetOTRequerimiento();
    $("#btnIrGOT").click(function () {
        window.location.href = "/ConsultarFichaOT";
    });
});

let fn_GetOTRequerimiento = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosDetalles/GetOrdenesTrabajosDetallesRequerimiento/" + xIdOt,
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#plNomServicio").text(datos.NomServicio);
                $("#plFechaOrdenTrabajo").text(kendo.toString(kendo.parseDate(datos.FechaOrdenTrabajo), 'dd/MM/yyyy'));
                $("#plNodocReq").text(datos.NodocReq);
                $("#plIdCliente").text(datos.IdCliente);
                $("#plNombre").text(datos.Nombre);
                $("#plNombreDiseno").text(datos.NombreDiseno);
                $("#plEstiloDiseno").text(datos.EstiloDiseno);
                $("#plNombrePrenda").text(datos.NombrePrenda);
                $("#plNoDocumento").text(datos.NoDocumento);
                $("#plNombreCFT").text(datos.NombreCFT);
                $("#plNombreEjecutivoCuentas").text(datos.NombreEjecutivoCuentas);
                $("#plNombreTalla").text(datos.NombreTalla);
                $("#plNombreQui").text(datos.NombreQui);
                $("#plNombreCPT").text(datos.NombreCPT);
                $("#plNombreCCT").text(datos.NombreCCT);
                $("#plNombreUbicacion").text(datos.NombreUbicacion);
                $("#plSolicitaTelaSustituta").text(datos.SolicitaTelaSustituta === true ? "Si" : "No");
                $("#plNombreEtapaActual").text(datos.NombreEtapaActual);
                $("#plColor").text(datos.Color);
                xIdArte = datos.IdArte === null ? 0 : datos.IdArte;
                xIdSeteo = datos.IdSeteoActual === null ? 0 : datos.IdSeteoActual;

                fn_getAdjun();
            }
        },
        error: function () { kendo.ui.progress($(document.body), false); },
        complete: function () {
            fn_MostraFormulaCab();
            fn_DibujarSeccionMaqui();
            fn_MostrarEstMarcos();
            fn_OTMostrarEstados();
            kendo.ui.progress($(document.body), false);
        }

    });
};

let fn_getAdjun = function (UrlAA) {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + xIdArte.toString(),
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + $("#plNodocReq").text() + "", datos);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_MostrarEstMarcos = function () {
    var dsetMar = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetTintasFormulacionesEstaciones/" + xIdSeteo; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdFormula",
                fields: {
                    IdFormula: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdTipoFormulacion: { type: "string" },
                    lblEstacion: { type: "string" },
                    Capilar: { type: "number" },
                    NoPasadas: { type: "number" },
                    Letra: { type: "string" },
                    IdTipoEmulsion: { type: "number" },
                    NomEmulsion: { type: "string" },
                    Area: { type: "number" },
                    IdUnidadArea: { type: "number" },
                    DesArea: { type: "string" },
                    Peso: { type: "number" },
                    IdUnidadPeso: { type: "number" },
                    DesPeso: { type: "string" },
                    ResolucionDPI: { type: "numeber" },
                    LineajeLPI: { type: "number" },
                    Pixeles: { type: "number" },
                    IdSeda: { type: "number" },
                    SedaNombre: { type: "string" },
                    DurezaEscurridor: { type: "number" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gMarcos").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "IdSeda", title: "IdSeda", hidden: true },
            { field: "SedaNombre", title: "Seda" },
            { field: "DurezaEscurridor", title: "Dureza Escurridor" },
            { field: "Letra", title: "Letra" },
            { field: "Capilar", title: "Capilar", format: "{0:n2}" },
            { field: "NoPasadas", title: "NoPasadas" },
            { field: "IdTipoEmulsion", title: "Tipo Emulsion", hidden: true },
            { field: "NomEmulsion", title: "Emulsion" },
            { field: "Area", title: "Area", format: "{0:n2}" },
            { field: "IdUnidadArea", title: "Id Area", hidden: true },
            { field: "DesArea", title: "Unidad Area" },
            { field: "Peso", title: "Peso", format: "{0:n2}" },
            { field: "IdUnidadPeso", title: "Id Uni Peso", hidden: true },
            { field: "DesPeso", title: "Unidad Peso" },
            { field: "ResolucionDPI", title: "Resolucion DPI" },
            { field: "Pixeles", title: "Pixeles" },
            { field: "LineajeLPI", title: "Lineaje" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gMarcos").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gMarcos").data("kendoGrid"), dsetMar);
};

let fn_MostraFormulaCab = function () {

    var dataSource = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetTintasFormulacionesEstaciones/" + xIdSeteo; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdFormula",
                fields: {
                    IdFormula: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdTipoFormulacion: { type: "string" },
                    lblEstacion: { type: "string" },
                    TecnicaAplicar: { type: "string" },
                    NomSistemaPigmento: { type: "string" },
                    NomBasePigmento: { type: "string" },
                    NomTipoTinta: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gFor").kendoGrid({
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "TecnicaAplicar", title: "Técnica Aplicar" },
            { field: "NomSistemaPigmento", title: "Sistema Pigmento" },
            { field: "NomBasePigmento", title: "Base Pigmento" },
            { field: "NomTipoTinta", title: "Tipo Tintas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gFor").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gFor").data("kendoGrid"), dataSource);

    // gCHFor detalle
    function detailInit(e) {
        var vidFor = e.data.IdFormula === null ? 0 : e.data.IdFormula;
        var VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + vidFor; },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            schema: {
                model: {
                    id: "IdFormula",
                    fields: {
                        IdFormula: { type: "number" },
                        Item: { type: "number" },
                        IdArticulo: { type: "string" },
                        Nombre: { type: "string" },
                        MasaFinal: { type: "number" },
                        PorcentajeFinal: { type: "number" }
                    }
                }
            },
            aggregate: [
                { field: "MasaFinal", aggregate: "sum" },
                { field: "PorcentajeFinal", aggregate: "sum" }
            ],
            filter: { field: "IdFormula", operator: "eq", value: e.data.IdFormula }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "CodigoColor", title: "Codigo Color", hidden: true },
                { field: "Item", title: "Item" },
                { field: "IdArticulo", title: "Articulo" },
                { field: "Nombre", title: "Nombre" },
                { field: "MasaFinal", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}', sum) : 0 #" },
                { field: "PorcentajeFinal", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidFor);

        var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsTec);
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 250);
        Set_Grid_DataSource(g, ds);
    }
};

let fn_DibujarSeccionMaqui = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/" + xIdSeteo,
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                fn_GetMQ(datos.IdEtapaProceso, datos.Item);
            }
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};

var fn_GetMQ = function (xetp, xitem) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + xIdOt + "/" + xetp + "/" + xitem,
        type: 'GET',
        success: function (datos) {
            fn_DibujarMq(datos);
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};

let fn_DibujarMq = function (maq) {
    var width = window.innerWidth;
    var height = window.innerHeight;

    stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    layer = new Konva.Layer();
    var con = stage.container();

    var tooltipLayer = new Konva.Layer();
    var tooltip = new Konva.Label({
        opacity: 0.75,
        visible: false,
        listening: false
    });

    tooltip.add(
        new Konva.Tag({
            fill: 'black',
            pointerDirection: 'down',
            lineJoin: 'round',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: 10,
            shadowOpacity: 0.2
        })
    );

    tooltip.add(
        new Konva.Text({
            text: '',
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: 'white'
        })
    );


    tooltipLayer.add(tooltip);
    //Brazos Superiores
    for (let i = 0; i < 11; i++) {
        let estacionInfo;
        let estacionTexto;
        estacionInfo = maq.find(q => q.IdEstacion === i + 1);

        if (estacionInfo)
            estacionTexto = estacionInfo.IdTipoFormulacion === "COLOR" ? estacionInfo.Color : estacionInfo.IdTipoFormulacion === "BASE" ? estacionInfo.NomIdBase : estacionInfo.IdTipoFormulacion === "TECNICA" ? estacionInfo.NomIdTecnica : estacionInfo.NomIdAccesorio;
        else
            estacionTexto = "";

        let textInfo = new Konva.Text({
            x: 150,
            y: 55,
            width: 70,
            height: 70,
            id: "TxtInfo" + (i + 1),
            text: estacionTexto
        });

        textInfo.align('center');
        textInfo.verticalAlign('middle');

        let cirbtn1 = new Konva.Circle({
            x: 115,
            y: 10,
            radius: 10,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            id: "btnEdit" + (i + 1)
        });

        let textbt1 = new Konva.Text({
            x: 111,
            y: 35,
            text: 'E',
            id: "txtEdit" + (i + 1)

        });

        textbt1.align('center');
        textbt1.verticalAlign('middle');

        let cirbtn2 = new Konva.Circle({
            x: 155,
            y: 10,
            radius: 10,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            id: "btnborrar" + (i + 1)
        });


        let textbt2 = new Konva.Text({
            x: 151,
            y: 10,
            text: 'X',
            id: "txtBorrar" + (i + 1)

        });

        textbt2.align('center');
        textbt2.verticalAlign('middle');

        //Brazos
        let text = new Konva.Text({
            width: 70,
            height: 20,
            text: "#" + (i + 1)
        });

        text.align('center');
        text.verticalAlign('middle');

        let rect = new Konva.Rect({
            x: 150,
            y: 10,
            width: 70,
            height: 100,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            id: "brazo" + (i + 1),
            IdSeteo: 0,
            IdTipoFormulacion: ""

        });


        text.position({ x: 100 + (i + 1) * 100, y: 5 });
        rect.position({ x: 100 + (i + 1) * 100, y: 25 });
        textInfo.position({ x: 100 + (i + 1) * 100, y: 55 });

        cirbtn1.position({ x: 115 + (i + 1) * 100, y: 40 });
        textbt1.position({ x: 111 + (i + 1) * 100, y: 35 });
        cirbtn2.position({ x: 155 + (i + 1) * 100, y: 40 });
        textbt2.position({ x: 151 + (i + 1) * 100, y: 35 });

        //Linea de Brazos
        let lineBrazo = new Konva.Line({
            stroke: 'black'
        });

        lineBrazo.points([135 + (i + 1) * 100, 25, 135 + (i + 1) * 100, 170]);
        lineBrazo.strokeWidth(15);



        layer.add(text);
        layer.add(lineBrazo);
        layer.add(rect);
        layer.add(textInfo);
        layer.add(cirbtn1);
        layer.add(textbt1);
        layer.add(cirbtn2);
        layer.add(textbt2);



        textbt1.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        textbt1.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });


        textbt2.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        textbt2.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });

        //textbt1.on('click', function () {
        //    let xidb = this.id().replace("txtEdit", "");

        //    if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
        //        let data = maq.find(q => q.IdEstacion === Number(xidb));

        //        fn_verEditar(data.IdTipoFormulacion, xidb);
        //    }
        //});
        //textbt2.on('click', function () {
        //    let xidb = this.id().replace("txtBorrar", "");

        //    if (maq.find(q => q.IdEstacion === Number(xidb) && (q.IdEtapaProceso !== 9 && q.IdEtapaProceso !== 10)) && vhb === true)
        //        ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        //});

        //textInfo.on('mousemove', function (e) {
        //    var node = e.target;
        //    let xidb = node.id().replace("TxtInfo", "");

        //    if (node) {

        //        if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
        //            let data = maq.find(q => q.IdEstacion === Number(xidb));
        //            // update tooltip
        //            var mousePos = node.getStage().getPointerPosition();
        //            tooltip.position({
        //                x: mousePos.x + 200,
        //                y: mousePos.y + 200
        //            });
        //            tooltip
        //                .getText()
        //                .text(data.ToolTips);
        //            tooltip.show();
        //            tooltipLayer.batchDraw();
        //        }

        //    }
        //});
        //textInfo.on('mouseout', function () {
        //    tooltip.hide();
        //    tooltipLayer.draw();
        //});
    }

    for (let i = 12; i < 23; i++) {
        let estacionInfo;
        let estacionTexto;
        estacionInfo = maq.find(q => q.IdEstacion === (34 - i));

        if (estacionInfo)
            estacionTexto = estacionInfo.IdTipoFormulacion === "COLOR" ? estacionInfo.Color : estacionInfo.IdTipoFormulacion === "BASE" ? estacionInfo.NomIdBase : estacionInfo.IdTipoFormulacion === "TECNICA" ? estacionInfo.NomIdTecnica : estacionInfo.NomIdAccesorio;
        else
            estacionTexto = "";

        let textInfo = new Konva.Text({
            x: 150,
            y: 55,
            width: 70,
            height: 70,
            id: "TxtInfo" + (34 - i),
            text: estacionTexto
        });

        textInfo.align('center');
        textInfo.verticalAlign('middle');

        let cirbtn1 = new Konva.Circle({
            x: 115,
            y: 10,
            radius: 10,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            id: "btnEdit" + (34 - i)
        });

        let textbt1 = new Konva.Text({
            x: 111,
            y: 35,
            text: 'E',
            id: "txtEdit" + (34 - i)

        });

        textbt1.align('center');
        textbt1.verticalAlign('middle');

        let cirbtn2 = new Konva.Circle({
            x: 155,
            y: 10,
            radius: 10,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            id: "btnBorrar" + (34 - i)
        });


        let textbt2 = new Konva.Text({
            x: 151,
            y: 10,
            text: 'X',
            id: "txtBorrar" + (34 - i)
        });

        textbt2.align('center');
        textbt2.verticalAlign('middle');

        let text = new Konva.Text({
            width: 70,
            height: 20,
            text: "#" + (34 - i)
        });

        text.align('center');
        text.verticalAlign('middle');

        let rect = new Konva.Rect({
            x: 150,
            y: 10,
            width: 70,
            height: 100,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            draggable: true,
            id: "brazo" + (34 - i),
            IdSeteo: 0,
            IdTipoFormulacion: ""


        });

        text.position({ x: 100 + (i - 11) * 100, y: 355 });
        rect.position({ x: 100 + (i - 11) * 100, y: 255 });
        textInfo.position({ x: 100 + (i - 11) * 100, y: 255 });

        cirbtn1.position({ x: 115 + (i - 11) * 100, y: 340 });
        textbt1.position({ x: 111 + (i - 11) * 100, y: 335 });
        cirbtn2.position({ x: 155 + (i - 11) * 100, y: 340 });
        textbt2.position({ x: 151 + (i - 11) * 100, y: 335 });


        //Linea de Brazos
        let lineBrazo = new Konva.Line({
            stroke: 'black'
        });

        lineBrazo.points([135 + (i - 11) * 100, 210, 135 + (i - 11) * 100, 355]);
        lineBrazo.strokeWidth(15);

        layer.add(text);
        layer.add(lineBrazo);
        layer.add(rect);
        layer.add(textInfo);
        layer.add(cirbtn1);
        layer.add(textbt1);
        layer.add(cirbtn2);
        layer.add(textbt2);


        textbt1.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        textbt1.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });

        textbt2.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        textbt2.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });

        //textbt1.on('click', function () {
        //    let xidb = this.id().replace("txtEdit", "");

        //    if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
        //        let data = maq.find(q => q.IdEstacion === Number(xidb));

        //        fn_verEditar(data.IdTipoFormulacion, xidb);
        //    }
        //});
        //textbt2.on('click', function () {
        //    let xidb = this.id().replace("txtBorrar", "");

        //    if (maq.find(q => q.IdEstacion === Number(xidb) && (q.IdEtapaProceso !== 9 && q.IdEtapaProceso !== 10)) && vhb === true)
        //        ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        //});

        //textInfo.on('mousemove', function (e) {
        //    var node = e.target;
        //    let xidb = node.id().replace("TxtInfo", "");

        //    if (node) {

        //        if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
        //            let data = maq.find(q => q.IdEstacion === Number(xidb));
        //            // update tooltip
        //            var mousePos = node.getStage().getPointerPosition();
        //            tooltip.position({
        //                x: mousePos.x + 200,
        //                y: mousePos.y + 200
        //            });
        //            tooltip
        //                .getText()
        //                .text(data.ToolTips);
        //            tooltip.show();
        //            tooltipLayer.batchDraw();
        //        }

        //    }
        //});
        //textInfo.on('mouseout', function () {
        //    tooltip.hide();
        //    tooltipLayer.draw();
        //});
    }


    //Tabla izquierda
    let lineBrazo = new Konva.Line({
        stroke: 'black'
    });
    lineBrazo.strokeWidth(15);

    lineBrazo.points([105, 190, 150, 190]);
    layer.add(lineBrazo);

    let rect = new Konva.Rect({
        x: 5,
        y: 155,
        width: 100,
        height: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        id: "tabla1"
    });

    layer.add(rect);


    //Tabla inclinada superior izquierda
    rect = new Konva.Rect({
        x: 130,
        y: 30,
        width: 100,
        height: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        id: "tabla2"
    });

    lineBrazo = new Konva.Line({
        stroke: 'black'
    });
    lineBrazo.strokeWidth(15);

    lineBrazo.points([151, 134, 175, 175]);
    layer.add(lineBrazo);

    rect.rotate(60);
    layer.add(rect);

    //Tabla inclinada inferior izquierda
    rect = new Konva.Rect({
        x: 70,
        y: 315,
        width: 100,
        height: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        id: "tabla3"
    });

    lineBrazo = new Konva.Line({
        stroke: 'black'
    });
    lineBrazo.strokeWidth(15);

    lineBrazo.points([151, 246, 180, 205]);
    layer.add(lineBrazo);

    rect.rotate(-60);
    layer.add(rect);

    //Cuerpo central de maquina
    var rectCentral = new Konva.Rect({
        x: 150,
        y: 170,
        width: 1170,
        height: 40,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 1
    });

    layer.add(rectCentral);

    //Tabla derecha
    lineBrazo = new Konva.Line({
        stroke: 'black'
    });
    lineBrazo.strokeWidth(15);

    lineBrazo.points([1320, 190, 1365, 190]);
    layer.add(lineBrazo);

    rect = new Konva.Rect({
        x: 1365,
        y: 155,
        width: 100,
        height: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        id: "tabla4"
    });

    layer.add(rect);


    stage.add(layer);
    stage.add(tooltipLayer);

    con.addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);




};

let fn_OTMostrarEstados = function () {
    var dsetOTEstados = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "OrdenesTrabajosDetallesEstados/GetByIdOrdenTrabajo/" + xIdOt; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IDOrdenTrabajo",
                fields: {
                    IDOrdenTrabajo: { type: "number" },
                    FechaEstado: { type: "date" },
                    Item: { type: "number" },
                    IdEtapaProceso: { type: "number" },
                    Nombre: { type: "string" },
                    IdUsuario: { type: "string" },
                    Nombre1: { type: "string" },
                    Estado: { type: "string" },
                    Nombre2: { type: "string" },
                    Motivo: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gEstados").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IDOrdenTrabajo", title: "Código OT", hidden: true },
            { field: "FechaEstado", title: "Fecha Cambio de Etapa", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" ,width:160},
            { field: "Item", title: "Item" ,width:50},
            { field: "IdEtapaProceso", title: "Código Etapa", hidden: true,width:200},
            { field: "Nombre", title: "Etapa del Proceso",width:200 },
            { field: "IdUsuario", title: "Código Usuario", hidden: true,width:100 },
            { field: "Nombre1", title: "Usuario",width:200 },
            { field: "Estado", title: "Estado" ,width:100 },
            { field: "Nombre2", title: "Estado", hidden: true},
            { field: "Motivo", title: "Motivo" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gEstados").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 350);
    Set_Grid_DataSource($("#gEstados").data("kendoGrid"), dsetOTEstados,20);
};

fPermisos = function (datos) {
    Permisos = datos;
};


