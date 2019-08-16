﻿var stage;
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
let vhb;
var fn_RTCargarMaquina = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    maq = fn_GetMaquinas();

    stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    layer = new Konva.Layer();
    var con = stage.container();

    var cambioColor = "";

    //Brazos Superiores
    for (let i = 0; i < 11; i++) {
        let estacionInfo;
        let estacionTexto;
        estacionInfo = maq.find(q => q.IdEstacion === i + 12);

        if (estacionInfo)
            estacionTexto = estacionInfo.IdTipoFormulacion === "COLOR" ? estacionInfo.Color : estacionInfo.IdTipoFormulacion === "BASE" ? estacionInfo.NomIdBase : estacionInfo.IdTipoFormulacion === "TECNICA" ? estacionInfo.NomIdTecnica : estacionInfo.NomIdAccesorio;
        else
            estacionTexto = "";

        let textInfo = new Konva.Text({
            x: 150,
            y: 55,
            width: 70,
            height: 70,
            id: "TxtInfo" + (i + 12),
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
            id: "btnEdit" + (i + 12)
        });

        let textbt1 = new Konva.Text({
            x: 111,
            y: 35,
            text: 'E',
            id: "txtEdit" + (i + 12)
        
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
            id: "btnborrar" + (i + 12)
        });


        let textbt2 = new Konva.Text({
            x: 151,
            y: 10,
            text: 'X',
            id: "txtBorrar" + (i + 12)
       
        });

        textbt2.align('center');
        textbt2.verticalAlign('middle');

        //Brazos
        let text = new Konva.Text({
            width: 70,
            height: 20,
            text: "#" + (i + 12)
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
            id: "brazo" + (i + 12),
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

        textbt1.on('click', function () {
            let xidb = this.id().replace("txtEdit", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
                let data = maq.find(q => q.IdEstacion === Num(xidb));

                fn_verEidtar(data.IdTipoFormulacion, xidb);
            }
        });
        textbt2.on('click', function () {
            let xidb = this.id().replace("txtBorrar", "");
            
            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true)
                ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
        });
    }

    for (let i = 12; i < 23; i++) {
        let estacionInfo;
        let estacionTexto;
        estacionInfo = maq.find(q => q.IdEstacion === 23 - i);

        if (estacionInfo)
            estacionTexto = estacionInfo.IdTipoFormulacion === "COLOR" ? estacionInfo.Color : estacionInfo.IdTipoFormulacion === "BASE" ? estacionInfo.NomIdBase : estacionInfo.IdTipoFormulacion === "TECNICA" ? estacionInfo.NomIdTecnica : estacionInfo.NomIdAccesorio;
        else
            estacionTexto = "";

        let textInfo = new Konva.Text({
            x: 150,
            y: 55,
            width: 70,
            height: 70,
            id: "TxtInfo" + (23 - i),
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
            id: "btnEdit" + (23 - i)
        });

        let textbt1 = new Konva.Text({
            x: 111,
            y: 35,
            text: 'E',
            id: "txtEdit" + (23 - i)
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
            id: "btnBorrar" + (23 - i)

        });


        let textbt2 = new Konva.Text({
            x: 151,
            y: 10,
            text: 'X',
            id: "txtBorrar" + (23 - i)
        });

        textbt2.align('center');
        textbt2.verticalAlign('middle');

        let text = new Konva.Text({
            width: 70,
            height: 20,
            text: "#" + (23 - i)
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
            id: "brazo" + (23 - i),
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

        textbt1.on('click', function () {
            let xidb = this.id().replace("txtEdit", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true) {
                let data = maq.find(q => q.IdEstacion === Number(xidb));

                fn_verEidtar(data.IdTipoFormulacion, xidb);
            }
        });
        textbt2.on('click', function () {
            let xidb = this.id().replace("txtBorrar", "");

            if (maq.find(q => q.IdEstacion === Number(xidb)) && vhb === true)
                ConfirmacionMsg("¿Esta seguro de eliminar la configuración en la estación?", function () { return fn_EliminarEstacion(maq[0].IdSeteo, xidb); });
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

    con.addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);    
};

var dropElemento = function (e) {
    e.preventDefault();
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    stage.setPointersPositions(e);
    kendo.ui.progress($("#body"), true);
    if (stage.getIntersection(stage.getPointerPosition()) && stage.getIntersection(stage.getPointerPosition()).attrs && vhb===true) {
   
        var a = stage.find("#" + stage.getIntersection(stage.getPointerPosition()).attrs.id);
        if (stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().includes("brazo") || stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().includes("TxtInfo")) {          
            // obtener el nombre de vista modal estacion
            ModalEstacion = $("#" + e.draggable.element[0].id + "").data("Estacion");
            // Obtener el JS
            ModalEstacionJS = $("#" + e.draggable.element[0].id + "").data("EstacionJS");

            // Tipo de estacion 
             TipoEstacion = $("#" + e.draggable.element[0].id + "").data("TipoEstacion");

            // obtener la Url de la vista parcial.
            let Url = $("#" + ModalEstacion + "").data("url");

            let gDrag = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid"));
      
            let xEstacionBra = stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().replace("TextInfo", "").replace("brazo", "");

            switch (TipoEstacion) {
                case "COLOR":
                    Titulo = "CONFIGURACIÓN ESTACIÓN COLORES";
                    TxtIdsec = gDrag.IdRequerimientoColor;
                    TxtSecName = gDrag.Color;
                    break;
                case "TECNICA":
                    Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA";
                    TxtIdsec = gDrag.IdRequerimientoTecnica;
                    TxtSecName = gDrag.Nombre;
                    break;
                case "BASE":
                    Titulo = "CONFIGURACIÓN ESTACIÓN BASES";
                    TxtIdsec = gDrag.IdBase;
                    TxtSecName = gDrag.Nombre;
                    break;
                case "ACCESORIO":
                    Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS";
                    TxtIdsec = gDrag.IdAccesorio;
                    TxtSecName = gDrag.Nombre;
                    break;
                default:
                    Titulo = "ESTACION";
                    break;
            }

            if ($("#" + ModalEstacion + "").children().length === 0) {
                $.ajax({
                    url: Url,
                    async: false,
                    type: 'GET',
                    contentType: "text/html; charset=utf-8",
                    datatype: "html",
                    success: function (resultado) {
                        fn_CargarVistaModal(resultado, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion);
                    }
                });
            } else {

                fn_CargarVistaModal(undefined, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion);
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
 */
let fn_CargarVistaModal = function (ViewP, ViewTitulo, xViewEstacionBra, ViewModal, ViewModalJs, ViewTipoEstacion) {
    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    if (listJs.filter(listJs => listJs.toString().endsWith(ViewModalJs)).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/" + ViewModalJs;
        script.onload = function () {
            fn_ShowModalPW(ViewModal, ViewP, Titulo, xViewEstacionBra, ViewModal, true, ViewTipoEstacion);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {

        fn_ShowModalPW(ViewModal, ViewP, ViewTitulo, xViewEstacionBra, ViewModal, false, ViewTipoEstacion);
    }


};

var fn_verEidtar = function (IdTipoFormulacion, xEstacionBra) {

    switch (IdTipoFormulacion) {
        case "COLOR":
            Titulo = "CONFIGURACIÓN ESTACIÓN COLORES";
            ModalEstacion= "MEstacionColor";
            TipoEstacion= "COLOR";
            ModalEstacionJS = "EstacionColores.js";
            break;
        case "TECNICA":
            Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA";
            ModalEstacion= "MEstacionColor";
            TipoEstacion= "TECNICA";
            ModalEstacionJS= "EstacionColores.js";
            break;
        case "BASE":
            Titulo = "CONFIGURACIÓN ESTACIÓN BASES";
            ModalEstacion= "MEstacionColor";
            TipoEstacion= "BASE";
            ModalEstacionJS= "EstacionColores.js";
            break;
        default:
            Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS";
            ModalEstacion= "MEstacionAccesorios";
            ModalEstacionJS= "EstacionAccesorios.js";
            TipoEstacion = "ACCESORIO";
          
            break;
    }

    let Url = $("#" + ModalEstacion + "").data("url");

    if ($("#" + ModalEstacion + "").children().length === 0) {
        $.ajax({
            url: Url,
            async: false,
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                fn_CargarVistaModal(resultado, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion);
            }
        });
    } else {

        fn_CargarVistaModal(undefined, Titulo, xEstacionBra, $("#" + ModalEstacion + ""), ModalEstacionJS, TipoEstacion);
    }
 
};

let fn_ShowModalPW = function (m, data, titulo, xvbrazo, ViewModal, CargarConfig, ViewTipoEstacion) {
    ViewModal.on('show.bs.modal', function (e) {
        switch (TipoEstacion) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoColor", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoTecnica", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdBase", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                break;
            case "ACCESORIO":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecAcce").data("IdAccesorio", TxtIdsec);
                $("#" + ModalEstacion + "").find('[id="OpcSelecAcce"]').text('Nombre del Accesorio');
                break;
            default:
        }
    });

    if (data !== undefined) { m.html(data); }
    m.modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    m.find('.modal-title').text(titulo);

    if (ViewTipoEstacion === 'ACCESORIO') {
        $("#TxtOpcSelecAcce").data("name", TxtSecName);
        $("#TxtOpcSelecAcce").data("TipoEstacion", ViewTipoEstacion);
        $("#TxtOpcSelecAcce").data("IdBrazo", xvbrazo);

    } else {
        $("#TxtOpcSelec").data("name", TxtSecName);
        $("#TxtOpcSelec").data("TipoEstacion", ViewTipoEstacion);
        $("#TxtOpcSelec").data("IdBrazo", xvbrazo);


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