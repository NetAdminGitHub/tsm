var stage;
var layer;
var fn_PWList = [];
let InicioColor = false;
let InicioAcce = false;

var fn_RTCargarMaquina = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    layer = new Konva.Layer();
    var con = stage.container();

    var cambioColor = "";

    //Brazos Superiores
    for (var i = 0; i < 11; i++) {
        let textInfo = new Konva.Text({
            x: 150,
            y: 55,
            width: 70,
            height: 70,
            id: "TxtInfo" + (i + 12),
            text:""
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
            strokeWidth: 1
        });


        let textbt2 = new Konva.Text({
            x: 151,
            y: 10,
            text: 'X'
            //fontSize: 16,
            //fontFamily: 'Calibri',
            //fill: 'green',
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
            id: "brazo" + (i + 12)
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
            alert(this.id());
        });
        textbt2.on('click', function () {
            alert(this.id());
        });
   
    }

    for (let i = 12; i < 23; i++) {
        let textInfo = new Konva.Text({
            x: 150,
            y: 55,
            width: 70,
            height: 70,
            id: "TxtInfo" + (23 - i),
            text: ""
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
            strokeWidth: 1
        });


        let textbt2 = new Konva.Text({
            x: 151,
            y: 10,
            text: 'X'
            //fontSize: 16,
            //fontFamily: 'Calibri',
            //fill: 'green',
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
            id: "brazo" + (23 - i)
        
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
            alert(this.id());
        });
        textbt2.on('click', function () {
            alert(this.id());
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

var dropElemento = function (e, grid) {
    e.preventDefault();

    stage.setPointersPositions(e);
    kendo.ui.progress($("#body"), true);
    if (stage.getIntersection(stage.getPointerPosition()) && stage.getIntersection(stage.getPointerPosition()).attrs) {
   
        var a = stage.find("#" + stage.getIntersection(stage.getPointerPosition()).attrs.id);
        if (stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().includes("brazo") || stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().includes("TxtInfo")) {          
            var TxtIdsec="";
            var TxtSecName = "";
            var Titulo = "";
            // obtener el nombre de vista modal estacion
            let ModalEstacion = $("#" + e.draggable.element[0].id + "").data("Estacion");
            // Obtener el JS
            let ModalEstacionJS = $("#" + e.draggable.element[0].id + "").data("EstacionJS");

            // Tipo de estacion 
            let TipoEstacion = $("#" + e.draggable.element[0].id + "").data("TipoEstacion");

            // obtener la Url de la vista parcial.
            let Url = $("#" + ModalEstacion + "").data("url");
      

            switch (TipoEstacion) {
                case "COLOR":
                    Titulo = "CONFIGURACIÓN ESTACIÓN COLORES";
                    TxtIdsec = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).IdRequerimientoColor;
                    TxtSecName = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).Color;
                    break;
                case "TECNICAS":
                    Titulo = "CONFIGURACIÓN ESTACIÓN TECNICA";
                    TxtIdsec = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).IdTecnica;
                    TxtSecName = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).Nombre;
                    break;
                case "BASES":
                    Titulo = "CONFIGURACIÓN ESTACIÓN BASES";
                    TxtIdsec = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).IdBase;
                    TxtSecName = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).Nombre;
                    break;
                case "ACCESORIO":
                    Titulo = "CONFIGURACIÓN ESTACIÓN ACCESORIOS";
                    TxtIdsec = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).IdAccesorio;
                    TxtSecName = $("#" + e.draggable.element[0].id + "").data("kendoGrid").dataSource.getByUid($(e.draggable.currentTarget).data("uid")).Nombre;
                    break;
                default:
                    Titulo = "ESTACION";
                    break;
            }


            if(Url !== undefined){
                $.get(Url, function (data) {

                    var script;

                    if (TipoEstacion === 'ACCESORIO')
                    {
                        if (InicioAcce === true) {
                            fn_ShowModalPW($("#" + ModalEstacion + ""), data, Titulo);
                            $.each(fn_PWList, function (index, elemento) {
                                elemento.call(document, jQuery);
                            });
                        } else {
                            script = document.createElement("script");
                            script.type = "text/javascript";
                            script.src = "/Scripts/js/" + ModalEstacionJS;
                            script.onload = function () {
                                fn_ShowModalPW($("#" + ModalEstacion + ""), data, Titulo);
                                $.each(fn_PWList, function (index, elemento) {
                                    elemento.call(document, jQuery);
                                });
                            };
                            document.getElementsByTagName('head')[0].appendChild(script);
                        }
                        
                    } else {

                        if (InicioColor === true) {
                            fn_ShowModalPW($("#" + ModalEstacion + ""), data, Titulo);
                            $.each(fn_PWList, function (index, elemento) {
                                elemento.call(document, jQuery);
                            });

                        } else {
                            script = document.createElement("script");
                            script.type = "text/javascript";
                            script.src = "/Scripts/js/" + ModalEstacionJS;

                            script.onload = function () {
                                fn_ShowModalPW($("#" + ModalEstacion + ""), data, Titulo);
                                $.each(fn_PWList, function (index, elemento) {
                                    elemento.call(document, jQuery);
                                });

                            };
                            document.getElementsByTagName('head')[0].appendChild(script);
                        }
                    }
                 
                    $("#" + ModalEstacion + "").on('show.bs.modal', function (e) {

                        
                        if (TipoEstacion === 'ACCESORIO') {
                            $("#TxtOpcSelecAcce").val(TxtSecName);
                            $("#TxtOpcSelecAcce").data("TipoEstacion", TipoEstacion);
                            $("#TxtOpcSelecAcce").data("IdBrazo", stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().replace("TextInfo", "").replace("brazo", ""));
                        } else {
                            $("#TxtOpcSelec").val(TxtSecName);
                            $("#TxtOpcSelec").data("TipoEstacion", TipoEstacion);
                            $("#TxtOpcSelec").data("IdBrazo", stage.getIntersection(stage.getPointerPosition()).attrs.id.toString().replace("TextInfo", "").replace("brazo", ""));
        
                          
                        }

             
                        switch (TipoEstacion) {
                            case "COLOR":
                                //guardo en Memoria la llave del tipo de selección
                                $("#TxtOpcSelec").data("IdRequerimientoColor", TxtIdsec);
                                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                                break;
                            case "TECNICAS":
                                //guardo en Memoria la llave del tipo de selección
                                $("#TxtOpcSelec").data("IdTecnica", TxtIdsec);
                                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                                break;
                            case "BASES":
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
                        //fn_PWList = [];
                    });
                });
            }
           
        }
    }
    kendo.ui.progress($("#body"), false);
};

let fn_ShowModalPW = function (m, data, titulo) {
    m.html(data);
    m.modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    m.find('.modal-title').text(titulo);
};