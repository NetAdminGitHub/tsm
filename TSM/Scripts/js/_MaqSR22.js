
var stage;
var layer;
var fn_PWList = [];
var fn_PWConfList = [];
let InicioColor = false;
let InicioAcce = false;
var TxtIdsec = "";
var TxtSecName = "";
var Titulo = "";
var ModalEstacion = "";
var ModalEstacionJS = "";
let TipoEstacion = "";
let Formulacion = "";
let HizoDropDown = false;
let vhb;
var fn_RTCargarMaquina = function () {
    //borrar la maquina
    $.each(ConfigEtapas, function (index,elemento) {
        //if (elemento.IdEtapaProceso !== idEtapaProceso) {
            $("#EtapaSeteo_" + elemento.IdEtapaProceso + "").children().remove();
        //}  
    }); 

    $.ajax({
        url: "/Estaciones/_MaqSR22",
        async: false,
        type: 'GET',
        contentType: "text/html; charset=utf-8",
        datatype: "html",
        success: function (resultado) {
            $("#EtapaSeteo_" + idEtapaProceso + "").html(resultado);
        }
    });

    var width = window.innerWidth;
    var height = window.innerHeight;
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    maq = fn_GetMaquinas();
    TipoTintas = fn_TipoTintas();

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
            //pointerWidth: 10,
            //pointerHeight: 10,
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
    //var tooltip = new Konva.Text({
    //    text: '',
    //    fontFamily: 'Calibri',
    //    fontSize: 12,
    //    padding: 5,
    //    visible: false,
    //    fill: 'black',
    //    opacity: 0.75,
    //    textFill: 'white'
    //});

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
            height: 100,
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
        textInfo.position({ x: 100 + (i + 1) * 100, y: 25 });

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

        if (vhb) {
            layer.add(cirbtn1);
            layer.add(textbt1);
            layer.add(cirbtn2);
            layer.add(textbt2);
        }       

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

        cirbtn1.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        cirbtn1.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });


        cirbtn2.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        cirbtn2.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });

        textbt1.on('click', function () {
            let xidb = this.id().replace("txtEdit", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
                let data = maq.find(q => q.IdEstacion === Number(xidb));

                fn_verEditar(data.IdTipoFormulacion, xidb);
            }
        });

        textbt2.on('click', function () {
            let xidb = this.id().replace("txtBorrar", "");
            
            if (maq.find(q => q.IdEstacion === Number(xidb) && q.IdEtapaProceso !== 9 ) && vhb === true)
                ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        });

        cirbtn1.on('click', function () {
            let xidb = this.id().replace("btnEdit", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
                let data = maq.find(q => q.IdEstacion === Number(xidb));

                fn_verEditar(data.IdTipoFormulacion, xidb);
            }
        });

        cirbtn2.on('click', function () {
            let xidb = this.id().replace("btnBorrar", "");

            if (maq.find(q => q.IdEstacion === Number(xidb) && q.IdEtapaProceso !== 9) && vhb === true)
                ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        });

        textInfo.on('mousemove', function (e) {
            var node = e.target;
            let xidb = node.id().replace("TxtInfo", "");

            if (node) {

                if (maq.find(q => q.IdEstacion === Number(xidb))) {
                    let data = maq.find(q => q.IdEstacion === Number(xidb));
                    // update tooltip
                    var mousePos = node.getStage().getPointerPosition();
                    tooltip.position({
                        x: mousePos.x+200,
                        y: mousePos.y +200
                    });
                    tooltip
                        .getText()
                        .text(data.ToolTips);
                    tooltip.show();
                    tooltipLayer.batchDraw();
                }

            }
        });
        textInfo.on('mouseout', function () {
            tooltip.hide();
            tooltipLayer.draw();
        });
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
            height: 100,
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
            //fontSize: 16,
            //fontFamily: 'Calibri',
            //fill: 'green',

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

        if (vhb) {
            layer.add(cirbtn1);
            layer.add(textbt1);
            layer.add(cirbtn2);
            layer.add(textbt2);
        }

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

        cirbtn1.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        cirbtn1.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });

        cirbtn2.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        cirbtn2.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });

        textbt1.on('click', function () {
            let xidb = this.id().replace("txtEdit", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
                let data = maq.find(q => q.IdEstacion === Number(xidb));

                fn_verEditar(data.IdTipoFormulacion, xidb);
            }
        });
        textbt2.on('click', function () {
            let xidb = this.id().replace("txtBorrar", "");

            if (maq.find(q => q.IdEstacion === Number(xidb) && q.IdEtapaProceso !== 9) && vhb === true)
                ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        });

        cirbtn1.on('click', function () {
            let xidb = this.id().replace("txtEdit", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
                let data = maq.find(q => q.IdEstacion === Number(xidb));

                fn_verEditar(data.IdTipoFormulacion, xidb);
            }
        });
        cirbtn2.on('click', function () {
            let xidb = this.id().replace("txtBorrar", "");

            if (maq.find(q => q.IdEstacion === Number(xidb) && q.IdEtapaProceso !== 9) && vhb === true)
                ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        });

        textInfo.on('mousemove', function (e) {
            var node = e.target;
            let xidb = node.id().replace("TxtInfo", "");

            if (node) {

                if (maq.find(q => q.IdEstacion === Number(xidb))) {
                    let data = maq.find(q => q.IdEstacion === Number(xidb));
                    // update tooltip
                    var mousePos = node.getStage().getPointerPosition();
                    tooltip.position({
                        x: mousePos.x+200,
                        y: mousePos.y +200
                    });
                    tooltip
                        .getText()
                        .text(data.ToolTips);
                    tooltip.show();
                    tooltipLayer.batchDraw();
                }

            }
        });
        textInfo.on('mouseout', function () {
            tooltip.hide();
            tooltipLayer.draw();
        });
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


///Metodo para asignar valores a variable
var ParametrosModalConf = function (tipoFormulacion, numEstacion) {
    if (xVistaFormulario.toUpperCase() === "_REVISIONTECNICA") {
        switch (tipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN COLORES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionColor";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionColores.js";
                Formulacion = "COLOR";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionColor";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionColores.js";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN BASES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionColor";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionColores.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAccesorios";
                ModalEstacionJS = "EstacionAccesorios.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_DISENOMUESTRAS") {

        switch (tipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionDisenos";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionDisenos.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionDisenos";
                ModalEstacionJS = "EstacionDisenos.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionDisenos";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionDisenos.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAccesoriosDis";
                ModalEstacionJS = "EstacionAccesoriosDis.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }


    }
    if (xVistaFormulario.toUpperCase() === "_TINTASFORMULACIONES") {

        switch (tipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "TINTAS Y REVELADO COLOR ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionFormulas";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionFormulas.js";
                break;
            case "TECNICA":
                Titulo = "TINTAS Y REVELADO TÉCNICAS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionFormulas";
                ModalEstacionJS = "EstacionFormulas.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "TINTAS Y REVELADO BASES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionFormulas";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionFormulas.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "";
                ModalEstacion = undefined; // color undefined para no levatar vista modal
                ModalEstacionJS = "";
                TipoEstacion = "";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_DESARROLLOMUESTRAS") {
        switch (tipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionMuestra";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionMuestra.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionMuestra";
                ModalEstacionJS = "EstacionMuestra.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionMuestra";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionMuestra.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAccesoriosMuest";
                ModalEstacionJS = "EstacionAccesoriosMuest.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_VALIDACIONMUESTRAS") {
        switch (tipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionVerifMuestra";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionVerifMuestra.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionVerifMuestra";
                ModalEstacionJS = "EstacionVerifMuestra.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionVerifMuestra";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionVerifMuestra.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAccesoriosVerifMuest";
                ModalEstacionJS = "EstacionAccesoriosVerifMuest.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_AJUSTEMUESTRAS") {
        switch (tipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAjuste";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionAjuste.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAjuste";
                ModalEstacionJS = "EstacionAjuste.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAjuste";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionAjuste.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + numEstacion.toString();
                ModalEstacion = "MEstacionAjusteAccesorio";
                ModalEstacionJS = "EstacionAjusteAccesorio.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
};


// método agrega estación para máquina vue
var AgregaEstacion = function (e) {

    e.preventDefault();
    // verifica estado si esta activo
    vhb = (Number(idEtapaProceso) === 10 ? !estadoPermiteEdicion : $("#txtEstado").val() !== "ACTIVO") || EtpSeguidor === true || EtpAsignado === false ? false : true; 

    kendo.ui.progress($("#body"), true);
    HizoDropDown = true;
    let gDrag = e.detail[0];
    let draggedData = gDrag.data;

    let xNumbra;

    if (!gDrag.brazo.number.toString().includes("TxtInfo") && !gDrag.brazo.number.toString().includes("txtEdit"))
        xNumbra = gDrag.brazo.number + "txtEdit";

    let xNumEstacion = xNumbra.replace("TxtInfo", "").replace("txtEdit", "").toString();


    ParametrosModalConf(gDrag.tipo, gDrag.brazo.number);
    // obtener la Url de la vista parcial.
    let Url = $("#" + ModalEstacion + "").data("url");

    Formulacion = gDrag.tipo;

    if (TiEst.find(q => q.IdTipoEstacion === TipoEstacion.toString()).UtilizaMarco === true) {
        switch (Formulacion) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN COLORES ESTACIÓN #" + xNumEstacion.toString();
                TxtIdsec = draggedData.IdRequerimientoColor;
                TxtSecName = draggedData.Color;
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA ESTACIÓN #" + xNumEstacion.toString();
                TxtIdsec = draggedData.IdRequerimientoTecnica;
                TxtSecName = draggedData.Nombre;
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN BASES ESTACIÓN #" + xNumEstacion.toString();
                TxtIdsec = draggedData.IdBase;
                TxtSecName = draggedData.Nombre;
                break;
            default:
                Titulo = "ESTACION";
                break;
        }
    }
    if (TiEst.find(q => q.IdTipoEstacion === TipoEstacion.toString()).UtilizaMarco === false) {
        Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
        TxtIdsec = draggedData.IdAccesorio;
        TxtSecName = draggedData.Nombre;
    }


    if ($("#" + ModalEstacion + "").children().length === 0) {
        $.ajax({
            url: Url,
            async: false,
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                fn_CargarVistaModal(resultado, Titulo, xNumbra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion, Formulacion);
            }
        });
    } else {

        fn_CargarVistaModal(undefined, Titulo, xNumbra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion, Formulacion);
    }
    kendo.ui.progress($("#body"), false);
};

var dropElemento = function (e) {
    e.preventDefault();
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    stage.setPointersPositions(e);
    kendo.ui.progress($("#body"), true);
    if (stage.getIntersection(stage.getPointerPosition()) && stage.getIntersection(stage.getPointerPosition()).attrs && vhb===true) {
   
        var a = stage.find("#" + stage.getIntersection(stage.getPointerPosition()).attrs.id);
        if (stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().includes("brazo") || stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().includes("TxtInfo")) {     
            HizoDropDown = true;
            // obtener el nombre de vista modal estacion
            ModalEstacion = $("#" + e.draggable.element[0].id + "").data("Estacion");
            // Obtener el JS
            ModalEstacionJS = $("#" + e.draggable.element[0].id + "").data("EstacionJS");

            // Tipo de estacion 
             TipoEstacion = $("#" + e.draggable.element[0].id + "").data("TipoEstacion");

            // Tipo de Formulacion
            Formulacion = $("#" + e.draggable.element[0].id + "").data("Formulacion");

            // obtener la Url de la vista parcial.
            let Url = $("#" + ModalEstacion + "").data("url");

            let gDrag = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid"));
      
            let xEstacionBra = stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().replace("TextInfo", "").replace("brazo", "");
            let xNumEstacion = xEstacionBra.replace("TxtInfo", "").replace("txtEdit", "").toString();

            if (TiEst.find(q => q.IdTipoEstacion === TipoEstacion.toString()).UtilizaMarco === true) {
                switch (Formulacion) {
                    case "COLOR":
                        Titulo = "CONFIGURACIÓN ESTACIÓN COLORES ESTACIÓN #" + xNumEstacion.toString();
                        TxtIdsec = gDrag.IdRequerimientoColor;
                        TxtSecName = gDrag.Color;
                        break;
                    case "TECNICA":
                        Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA ESTACIÓN #" + xNumEstacion.toString();
                        TxtIdsec = gDrag.IdRequerimientoTecnica;
                        TxtSecName = gDrag.Nombre;
                        break;
                    case "BASE":
                        Titulo = "CONFIGURACIÓN ESTACIÓN BASES ESTACIÓN #" + xNumEstacion.toString();
                        TxtIdsec = gDrag.IdBase;
                        TxtSecName = gDrag.Nombre;
                        break;
                    default:
                        Titulo = "ESTACION";
                        break;
                }
            }
            if (TiEst.find(q => q.IdTipoEstacion === TipoEstacion.toString()).UtilizaMarco === false) {
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
                TxtIdsec = gDrag.IdAccesorio;
                TxtSecName = gDrag.Nombre;
            }
           

            if ($("#" + ModalEstacion + "").children().length === 0) {
                $.ajax({
                    url: Url,
                    async: false,
                    type: 'GET',
                    contentType: "text/html; charset=utf-8",
                    datatype: "html",
                    success: function (resultado) {
                        fn_CargarVistaModal(resultado, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion, Formulacion);
                    }
                });
            } else {

                fn_CargarVistaModal(undefined, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion, Formulacion);
            }
          
        }
    }
    kendo.ui.progress($("#body"), false);
};

/**
 * funcion carga vista modal
 * @param {string} ViewP Html vista parcial
 * @param {string} ViewTitulo titulo a mostrar envista parcial
 * @param {string} xViewEstacionBra Etsacion o Brazo
 * @param {HTMLDivElement} ViewModal Nombre vista modal
 * @param {string} ViewModalJs Nombre Js Vista modal
  *@param {string} ViewTipoEstacion tipo de estacion
  *@param {string} ViewFormulacion tipo de formulacion
 */
let fn_CargarVistaModal = function (ViewP, ViewTitulo, xViewEstacionBra, ViewModal, ViewModalJs, ViewTipoEstacion, ViewFormulacion) {
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    ViewModalJs = ViewModalJs.replace(".js", ".js?" + _version);
    if (listJs.filter(listJs => listJs.toString().endsWith(ViewModalJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + ViewModalJs;
        script.onload = function () {
            fn_ShowModalPW(ViewModal, ViewP, Titulo, xViewEstacionBra, ViewModal, true, ViewTipoEstacion, ViewFormulacion);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalPW(ViewModal, ViewP, ViewTitulo, xViewEstacionBra, ViewModal, false, ViewTipoEstacion, ViewFormulacion);
    }


};

var fn_verEditar = function (IdTipoFormulacion, xEstacionBra) {
    HizoDropDown = false;
    if (!xEstacionBra.toString().includes("TxtInfo") && !xEstacionBra.toString().includes("txtEdit"))
        xEstacionBra = xEstacionBra + "txtEdit";

    let xNumEstacion = xEstacionBra.replace("TxtInfo", "").replace("txtEdit", "").toString();
    if (xVistaFormulario.toUpperCase() === "_REVISIONTECNICA") {
        switch (IdTipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN COLORES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionColor";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionColores.js";
                Formulacion = "COLOR";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionColor";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionColores.js";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN BASES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionColor";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionColores.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAccesorios";
                ModalEstacionJS = "EstacionAccesorios.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_DISENOMUESTRAS") {

        switch (IdTipoFormulacion) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionDisenos";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionDisenos.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionDisenos";
                ModalEstacionJS = "EstacionDisenos.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionDisenos";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionDisenos.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAccesoriosDis";
                ModalEstacionJS = "EstacionAccesoriosDis.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
       

    }
    if (xVistaFormulario.toUpperCase() === "_TINTASFORMULACIONES") {
   
        switch (IdTipoFormulacion) {
            case "COLOR":
                Titulo = "TINTAS Y REVELADO COLOR ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionFormulas";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionFormulas.js";
                break;
            case "TECNICA":
                Titulo = "TINTAS Y REVELADO TÉCNICAS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionFormulas";
                ModalEstacionJS = "EstacionFormulas.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "TINTAS Y REVELADO BASES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionFormulas";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionFormulas.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "";
                ModalEstacion = undefined; // color undefined para no levatar vista modal
                ModalEstacionJS = "";
                TipoEstacion = "";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_DESARROLLOMUESTRAS") {
        switch (IdTipoFormulacion) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionMuestra";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionMuestra.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionMuestra";
                ModalEstacionJS = "EstacionMuestra.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionMuestra";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionMuestra.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAccesoriosMuest";
                ModalEstacionJS = "EstacionAccesoriosMuest.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_VALIDACIONMUESTRAS") {
        switch (IdTipoFormulacion) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS COLOR ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionVerifMuestra";
                TipoEstacion = "MARCO";
                Formulacion = "COLOR";
                ModalEstacionJS = "EstacionVerifMuestra.js";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS TÉCNICAS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionVerifMuestra";
                ModalEstacionJS = "EstacionVerifMuestra.js";
                TipoEstacion = "MARCO";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN AREAS BASES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionVerifMuestra";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionVerifMuestra.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAccesoriosVerifMuest";
                ModalEstacionJS = "EstacionAccesoriosVerifMuest.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (xVistaFormulario.toUpperCase() === "_AJUSTEMUESTRAS") {
        switch (IdTipoFormulacion.toUpperCase()) {
            case "COLOR":
                Titulo = "CONFIGURACIÓN ESTACIÓN COLORES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAjuste";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionAjuste.js";
                Formulacion = "COLOR";
                break;
            case "TECNICA":
                Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAjuste";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionAjuste.js";
                Formulacion = "TECNICA";
                break;
            case "BASE":
                Titulo = "CONFIGURACIÓN ESTACIÓN BASES ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAjuste";
                TipoEstacion = "MARCO";
                ModalEstacionJS = "EstacionAjuste.js";
                Formulacion = "BASE";
                break;
            default:
                Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS ESTACIÓN #" + xNumEstacion.toString();
                ModalEstacion = "MEstacionAjusteAccesorio";
                ModalEstacionJS = "EstacionAjusteAccesorio.js";
                TipoEstacion = "ACCESORIO";
                Formulacion = "";
                break;
        }
    }
    if (ModalEstacion !== undefined) {

        let Url = $("#" + ModalEstacion + "").data("url");

        if ($("#" + ModalEstacion + "").children().length === 0) {
            $.ajax({
                url: Url,
                async: false,
                type: 'GET',
                contentType: "text/html; charset=utf-8",
                datatype: "html",
                success: function (resultado) {
                    fn_CargarVistaModal(resultado, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion, Formulacion);
                }
            });
        } else {

            fn_CargarVistaModal(undefined, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion, Formulacion);
        }
    }
    
 
};

let fn_ShowModalPW = function (m, data, titulo, xvbrazo, ViewModal, CargarConfig, ViewTipoEstacion, ViewFormulacion) {
    var onShow = function () {
        if (TiEst.find(q => q.IdTipoEstacion === TipoEstacion.toString()).UtilizaMarco === true) {

            if (xVistaFormulario.toUpperCase() === "_REVISIONTECNICA") {
                switch (Formulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown===true) $("#TxtOpcSelec").data("IdRequerimientoColor", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelec").data("IdRequerimientoTecnica", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                        break;
                    case "BASE":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelec").data("IdBase", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                        break;
                    default:
                }
            }

            if (xVistaFormulario.toUpperCase() === "_DISENOMUESTRAS") {
                switch (Formulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelec_Dis").data("IdRequerimientoColor", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Dis"]').text('Nombre de Color');
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelec_Dis").data("IdRequerimientoTecnica", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Dis"]').text('Nombre de Técnica');
                        break;
                    case "BASE":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelec_Dis").data("IdBase", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Dis"]').text('Nombre de Base');
                        break;
                    default:
                }
            }

            if (xVistaFormulario.toUpperCase() === "_TINTASFORMULACIONES") {
                switch (Formulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelecFormulas").data("IdRequerimientoColor", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Color');
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelecFormulas").data("IdRequerimientoTecnica", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Técnica');
                        break;
                    case "BASE":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelecFormulas").data("IdBase", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Base');
                        break;
                    default:
                }
            }

            if (xVistaFormulario.toUpperCase() === "_DESARROLLOMUESTRAS") {
                switch (Formulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)  $("#TxtOpcSelec_Mues").data("IdRequerimientoColor", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Mues"]').text('Nombre de Color');
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)   $("#TxtOpcSelec_Mues").data("IdRequerimientoTecnica", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Mues"]').text('Nombre de Técnica');
                        break;
                    case "BASE":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true)   $("#TxtOpcSelec_Mues").data("IdBase", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Mues"]').text('Nombre de Base');
                        break;
                    default:
                }
            }

            if (xVistaFormulario.toUpperCase() === "_VALIDACIONMUESTRAS") {
                switch (Formulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelec_VerifMues").data("IdRequerimientoColor", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_VerifMues"]').text('Nombre de Color');
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelec_VerifMues").data("IdRequerimientoTecnica", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_VerifMues"]').text('Nombre de Técnica');
                        break;
                    case "BASE":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelec_VerifMues").data("IdBase", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Mues"]').text('Nombre de Base');
                        break;
                    default:
                }
            }
            if (xVistaFormulario.toUpperCase() === "_AJUSTEMUESTRAS") {
                switch (Formulacion) {
                    case "COLOR":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelec_Ajuste").data("IdRequerimientoColor", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Ajuste"]').text('Nombre de Color');
                        break;
                    case "TECNICA":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelec_Ajuste").data("IdRequerimientoTecnica", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Ajuste"]').text('Nombre de Técnica');
                        break;
                    case "BASE":
                        //guardo en Memoria la llave del tipo de selección
                        if (HizoDropDown === true) $("#TxtOpcSelec_Ajuste").data("IdBase", TxtIdsec);
                        $("#" + ModalEstacion + "").find('[id="OpcSelec_Ajuste"]').text('Nombre de Base');
                        break;
                    default:
                }
            }
        }

        if (TiEst.find(q => q.IdTipoEstacion === TipoEstacion.toString()).UtilizaMarco === false) {

            if (xVistaFormulario.toUpperCase() === "_REVISIONTECNICA") {
                //guardo en Memoria la llave del tipo de selección
                if (HizoDropDown === true)  $("#TxtOpcSelecAcce").data("IdAccesorio", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelecAcce"]').text('Nombre del Accesorio');
            }

            if (xVistaFormulario.toUpperCase() === "_DISENOMUESTRAS") {
                //guardo en Memoria la llave del tipo de selección
                if (HizoDropDown === true)  $("#TxtOpcSelecAcce_Dis").data("IdAccesorio", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelecAcce_Dis"]').text('Nombre del Accesorio');
            }


            if (xVistaFormulario.toUpperCase() === "_DESARROLLOMUESTRAS") {
                //guardo en Memoria la llave del tipo de selección
                if (HizoDropDown === true) $("#TxtOpcSelecAcce_Mues").data("IdAccesorio", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelecAcce_Mues"]').text('Nombre del Accesorio');
            }
            if (xVistaFormulario.toUpperCase() === "_VALIDACIONMUESTRAS") {
                //guardo en Memoria la llave del tipo de selección
                if (HizoDropDown === true) $("#TxtOpcSelecAcce_Ajuste").data("IdAccesorio", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelecAcce_Ajuste"]').text('Nombre del Accesorio');
            }
        }
        HizoDropDown = false;
        if (m !== undefined) {
            m.data("kendoWindow").center();
        }        
    };
    m.kendoWindow({
        actions: ["Close"],
        height: "auto",
        width: "auto",
        title: titulo,
        closable: true,
        modal: true,
        visible: false,
        //activate: onShow,
        pinned: true,
        maximize: function (e) {
            e.preventDefault();
        }
    });

    m.data("kendoWindow").content(data);
    m.data("kendoWindow").center().open();
    m.data("kendoWindow").center();
    m.data("kendoWindow").title(titulo);

    onShow();
    if (xVistaFormulario.toUpperCase() === "_REVISIONTECNICA") {

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === false) {
            $("#TxtOpcSelecAcce").data("name", TxtSecName);
            $("#TxtOpcSelecAcce").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelecAcce").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelecAcce").data("IdBrazo", xvbrazo);

        }
        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === true) {
            $("#TxtOpcSelec").data("name", TxtSecName);
            $("#TxtOpcSelec").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelec").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelec").data("IdBrazo", xvbrazo);
        }
    }
    if (xVistaFormulario.toUpperCase() === "_DISENOMUESTRAS") {

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === false) {
            $("#TxtOpcSelecAcce_Dis").data("name", TxtSecName);
            $("#TxtOpcSelecAcce_Dis").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelecAcce_Dis").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelecAcce_Dis").data("IdBrazo", xvbrazo);

        }
        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === true) {
            $("#TxtOpcSelec_Dis").data("name", TxtSecName);
            $("#TxtOpcSelec_Dis").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelec_Dis").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelec_Dis").data("IdBrazo", xvbrazo);


        }
    }
    if (xVistaFormulario.toUpperCase() === "_TINTASFORMULACIONES") {

       
        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === true) {
            $("#TxtOpcSelecFormulas").data("name", TxtSecName);
            $("#TxtOpcSelecFormulas").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelecFormulas").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelecFormulas").data("IdBrazo", xvbrazo);
        }
    }
    if (xVistaFormulario.toUpperCase() === "_DESARROLLOMUESTRAS") {

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === false) {
            $("#TxtOpcSelecAcce_Mues").data("name", TxtSecName);
            $("#TxtOpcSelecAcce_Mues").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelecAcce_Mues").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelecAcce_Mues").data("IdBrazo", xvbrazo);

        }

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === true) {
            $("#TxtOpcSelec_Mues").data("name", TxtSecName);
            $("#TxtOpcSelec_Mues").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelec_Mues").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelec_Mues").data("IdBrazo", xvbrazo);
        }
    }
    if (xVistaFormulario.toUpperCase() === "_VALIDACIONMUESTRAS") {

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === false) {
            $("#TxtOpcSelecAcce_VerifMues").data("name", TxtSecName);
            $("#TxtOpcSelecAcce_VerifMues").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelecAcce_VerifMues").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelecAcce_VerifMues").data("IdBrazo", xvbrazo);

        }

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === true) {
            $("#TxtOpcSelec_VerifMues").data("name", TxtSecName);
            $("#TxtOpcSelec_VerifMues").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelec_VerifMues").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelec_VerifMues").data("IdBrazo", xvbrazo);
        }
    }
    if (xVistaFormulario.toUpperCase() === "_AJUSTEMUESTRAS") {

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === false) {
            $("#TxtOpcSelecAcce_Ajuste").data("name", TxtSecName);
            $("#TxtOpcSelecAcce_Ajuste").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelecAcce_Ajuste").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelecAcce_Ajuste").data("IdBrazo", xvbrazo);

        }

        if (TiEst.find(q => q.IdTipoEstacion === ViewTipoEstacion.toString()).UtilizaMarco === true) {
            $("#TxtOpcSelec_Ajuste").data("name", TxtSecName);
            $("#TxtOpcSelec_Ajuste").data("TipoEstacion", ViewTipoEstacion);
            $("#TxtOpcSelec_Ajuste").data("Formulacion", ViewFormulacion);
            $("#TxtOpcSelec_Ajuste").data("IdBrazo", xvbrazo);
        }
    }

    if (CargarConfig === true) {
        $.each(fn_PWConfList, function (index, elemento) {
            elemento.call(document, jQuery);
        });
        fn_PWConfList = [];
    }

    $.each(fn_PWList, function (index, elemento) {
        elemento.call(document, jQuery);
    });
};