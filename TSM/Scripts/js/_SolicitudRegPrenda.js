
let UTemp = TSM_Web_APi + "/Temporadas";
let UPro = TSM_Web_APi + "/Programas/GetByCliente/" + vIdClienteSol;
let DsUbicaciones = "";
let SolUbicaciones = "";

$(document).ready(function () {

    KdoButton($("#btnAddPrenda"), "check", "Agregar");
    DsUbicaciones=fn_GetMulSUbicaciones();

    let UrlRPS = TSM_Web_APi + "/RelacionCategoriaPrendasServicios/GetRelacionCategoriaPrendasServicioByidServ/" + vIdServSol;
    Kendo_CmbFiltrarGrid($("#CmbPrenda"), UrlRPS, "Nombre", "IdCategoriaPrenda", "Seleccione...");

   
    Kendo_CmbFiltrarGrid($("#CmbTemporada"), UTemp, "Nombre", "IdTemporada", "Seleccione...");

    KdoCmbComboBoxPrograma($("#CmbPrograma"), "Nombre", "IdPrograma", "Seleccione ...", "", "CmbTemporada", "", "fn_NuevoItemProm");

    $("#FrmModalPrenda").kendoValidator({
        rules: {
            MsgPren: function (input) {
                if (input.is("#CmbPrenda")) {
                    return $("#CmbPrenda").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            MsgTemp: function (input) {
                if (input.is("#CmbTemporada")) {
                    return $("#CmbTemporada").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            MsgPro: function (input) {
                if (input.is("#CmbPrograma")) {
                    return $("#CmbPrograma").data("kendoComboBox").text() === "" ? true : $("#CmbPrograma").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            MsgNomDiseno: function (input) {
                if (input.is("#TxtNombreDiseno")) {
                    return input.val().length >0 && input.val().length <= 200;
                }
                return true;
            },
            MsgEstiloDiseno: function (input) {
                if (input.is("#TxtEstiloDiseno")) {
                    return input.val().length > 0 && input.val().length <= 200;
                }
                return true;
            }

        },
        messages: {
            MsgPren: "Requerido",
            MsgTemp: "Requerido",
            MsgPro: "Requerido",
            MsgNomDiseno: "Requerido",
            MsgEstiloDiseno:"Requerido"

        }
    });
    $("#btnAddPrenda").data("kendoButton").bind("click", function () {
        event.preventDefault();
        if ($("#FrmModalPrenda").data("kendoValidator").validate()) {
            fn_GuardarSolPren();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });
    fn_GetSolictudPrenda();
});

let fn_GuardarSolPren = function () {

    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            IdSolicitud:vIdSolicitud,
            IdCategoriaPrenda: KdoCmbGetValue($("#CmbPrenda")),
            IdCategoriaConfeccion:null,
            Item:0,
            NumeroDiseno: $("#TxtNumeroDiseno").val(),
            EstiloDiseno: $("#TxtEstiloDiseno").val(),
            NombreDiseno: $("#TxtNombreDiseno").val(),
            IdTemporada: KdoCmbGetValue($("#CmbTemporada")),
            IdPrograma: KdoCmbGetValue($("#CmbPrograma"))
        }),
        url: TSM_Web_APi + "SolicitudesPrendas",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#ModalPrenda").modal('hide');
            fn_GetSolictudPrenda();
            RequestEndMsg(result, "Post");
            kendo.ui.progress($("#body"), false);
        }
    });

};

let fn_PrendaNueva = function () {

    $("#ModalPrenda").modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    $("#ModalPrenda").find('.modal-title').text("SELECCIONE EL TIPO DE PRENDA O PROGRAMA A DECORAR");


};


var fn_GetSolictudPrenda = function () {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlSp + "/GetSolicitudesPrendasbyIdSolicitud/" + vIdSolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                
                fn_DibujarSeccionPrenda(respuesta);
            }
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
        }
    });
};

var fn_DibujarSeccionPrenda = function (ds) {
    var ViewPren = $("#ViewPrenda");
    ViewPren.children().remove();
    var PrendaUbicacion = vIdServSol !== 2 ? fn_PrendaUbicacion(vIdSolicitud) : null;
    let PrendaTallas = fn_PrendaTallas(vIdSolicitud);
    SolUbicaciones = vIdServSol === 2 ? fn_getUbicacionesEstamp() : null;

    let DsProg = fn_GetDatos(UPro);
    let DsTemp = fn_GetDatos(UTemp);
    let DsConf = fn_GetDatos(UrlCp);

    $.each(ds, function (item, elemento) {
        let btnLink = 'btnLink_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let form = 'Form_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let CmbConfeccion = 'Cmb_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let spanId = 'U_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let spanId2 = 'Ta_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let btn = 'btn_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let CmbTemporada = 'CmbTemp_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let CmbPrograma = 'CmbPro_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let TxtNombreDiseno = 'TxtNomDise_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let TxtEstiloDiseno = 'TxtEstDise_'+ elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let TxtNumeroDiseno = 'TxtNumDise_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let panelbar = "panelbar_" + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString() + elemento.Item.toString();
        let vIcon = elemento.Icono === "" || elemento.Icono === null ? "k-icon k-i-image" : elemento.Icono;
        ViewPren.append(
            '<div class="col-lg-2">' +
            '<div class="card" style="height: 100%;">' +
            '<div class="card-body" >' +
            '<div class="form-group col-lg-12">' +
            '<form id="' + form + '" method="POST" enctype="multipart/form-data" autocomplete="off">' +
            '<div class= "form-row" >' +
            '<a class="btn-link stretched-link" id="' + btnLink + '"  onclick="fn_DeletePren(this)" >' +
            '<span class="k-icon k-i-delete"></span>' +
            '</a>' +
            '</div > ' +
            '<div class= "form-row" >' +
            '<div class="form-group col-lg-12 text-center">' +
            '<i class="' + vIcon + '" style="font-size:100px;"></i>' +
            '<p>' +
            '<h3>' + elemento.Nombre + '</h3>' +
            '</p>' +
            '</div>' +
            '</div >' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-12">' +
            '<label for="' + CmbConfeccion + '">Confeciones de la tela</label>' +
            '<input name="' + CmbConfeccion + '" id="' + CmbConfeccion + '" required validationMessage="Requerido" class="form-control">' +
            '</div>' +
            '<div class="form-group col-lg-12">' +
            '<ul id="' + panelbar + '">' +
            '<li>' + //class="k-state-active"
            '<span class="TS-icon-INFORMACION-2" style="font-size: 1.7em;">&nbsp</span>' +
            ' Información General' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-12">' +
            '<div class="form-row" >' +
            '<div class="form-group col-lg-12">' +
            '<label for="' + CmbTemporada + '">Temporada</label>' +
            '<input name="' + CmbTemporada + '" id="' + CmbTemporada + '" required validationMessage="Requerido" class="form-control">' +
            '</div>' +
            '</div>' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-12">' +
            '<label for="' + CmbPrograma + '">Programas</label>' +
            '<input name="' + CmbPrograma + '" id="' + CmbPrograma + '" type="text" class="form-control">' +
            '</div>' +
            '</div>' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-12">' +
            '<label for="' + TxtNombreDiseno + '">Nombre Diseño</label>' +
            '<input name="' + TxtNombreDiseno + '" id="' + TxtNombreDiseno + '" type="text" class="k-textbox form-control">' +
            '</div>' +
            '</div>' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-12">' +
            '<label for="' + TxtEstiloDiseno + '">Estilo Diseño</label>' +
            '<input name="' + TxtEstiloDiseno + '" id="' + TxtEstiloDiseno + '" type="text" class="k-textbox form-control">' +
            '</div>' +
            '</div>' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-12">' +
            '<label for="' + TxtNumeroDiseno + '">Numero Diseño</label>' +
            '<input name="' + TxtNumeroDiseno + '" id="' + TxtNumeroDiseno + '" type="text" class="k-textbox form-control">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>' +
            '<li>' +
            '<span class="TS-icon-INFORMACION-2" style="font-size: 1.7em;">&nbsp</span>' +
            'Rango de Tallas' +
            '<div class="form-group col-lg-12">' +
            '<div class="form-row">' +
            '<p>' +
            '</div>' +
            '<div class="form-row">' +
            '<span id="' + spanId2 + '"></span>' +
            '</div>' +
            '</div>' +
            '</li > ' +
            '<li class="k-state-active">' +
            '<span class="TS-icon-INFORMACION-2" style="font-size: 1.7em;">&nbsp</span>' +
            'Seleccione de Partes' +
            '<div class="form-group col-lg-12">' +
            '<div class="form-row">' +
            '<p>' +
            '</div>' +
            '<div class="form-row">' +
            '<span id="' + spanId + '"></span>' +
            '</div>' +
            '</div>' +
            '</li> ' +
            '</ul>' +
            '</div>' +
            '</div>' +
            //'<span id="' + spanId + '"></span>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '<div class="card-footer"><div class="form-row"><div class="input-group"><div style="width: 100%;"><button class="btn-lg btn-block" type="button" id="' + btn + '" name="' + btn + '"> Actualizar</button></div></div></div></div>' +
            '</div>' +
            '</div>');


        KdoComboBoxbyData($("#" + CmbConfeccion + ""), DsConf, "Nombre", "IdCategoriaConfeccion", "Seleccione...");
        KdoComboBoxbyData($("#" + CmbTemporada + ""), DsTemp, "Nombre", "IdTemporada", "Seleccione...");
        KdoComboBoxbyData($("#" + CmbPrograma + ""), DsProg, "Nombre", "IdPrograma", "Seleccione...", "", "" + CmbTemporada + "");

        //Kendo_CmbFiltrarGrid($("#" + CmbConfeccion + ""), UrlCp, "Nombre", "IdCategoriaConfeccion", "Seleccione...");
        //Kendo_CmbFiltrarGrid($("#" + CmbTemporada + ""), UTemp, "Nombre", "IdTemporada", "Seleccione...");
        //Kendo_CmbFiltrarGrid($("#" + CmbPrograma + ""), UPro, "Nombre", "IdPrograma", "Seleccione...", "", "" + CmbTemporada + "");

        KdoButton($("#" + btn + ""), "save", "Agregar");
        $("#" + btn + "").data('Formulario', form);

        $("#" + btnLink + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + btnLink + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + btnLink + "").data('Item', elemento.Item);

        $("#" + CmbConfeccion + "").data("kendoComboBox").value(elemento.IdCategoriaPrenda === null ? 0 : elemento.IdCategoriaConfeccion);
        $("#" + CmbConfeccion + "").data("Tipo", "cmb");
        $("#" + CmbConfeccion + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + CmbConfeccion + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + CmbConfeccion + "").data('Item', elemento.Item);
        $("#" + CmbConfeccion + "").data('columna','Confeccion' );


        $("#" + CmbTemporada + "").data("kendoComboBox").value(elemento.IdTemporada === null ? 0 : elemento.IdTemporada);
        $("#" + CmbTemporada + "").data("Tipo", "cmb");
        $("#" + CmbTemporada + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + CmbTemporada + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + CmbTemporada + "").data('Item', elemento.Item);
        $("#" + CmbTemporada + "").data('columna', 'Temporada');

        $("#" + CmbPrograma + "").data("kendoComboBox").value(elemento.IdPrograma === null ? 0 : elemento.IdPrograma);
        $("#" + CmbPrograma + "").data("Tipo", "cmb");
        $("#" + CmbPrograma + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + CmbPrograma + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + CmbPrograma + "").data('Item', elemento.Item);
        $("#" + CmbPrograma + "").data('columna', 'Programa');

        $("#" + TxtNombreDiseno + "").val(elemento.NombreDiseno === null ? 0 : elemento.NombreDiseno);
        $("#" + TxtNombreDiseno + "").data("Tipo", "txt");
        $("#" + TxtNombreDiseno + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + TxtNombreDiseno + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + TxtNombreDiseno + "").data('Item', elemento.Item);
        $("#" + TxtNombreDiseno + "").data('columna', 'NomDis');

        $("#" + TxtEstiloDiseno + "").val(elemento.EstiloDiseno === null ? 0 : elemento.EstiloDiseno);
        $("#" + TxtEstiloDiseno + "").data("Tipo", "txt");
        $("#" + TxtEstiloDiseno + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + TxtEstiloDiseno + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + TxtEstiloDiseno + "").data('Item', elemento.Item);
        $("#" + TxtEstiloDiseno + "").data('columna', 'EstDis');

        $("#" + TxtNumeroDiseno + "").val(elemento.NumeroDiseno === null ? 0 : elemento.NumeroDiseno);
        $("#" + TxtNumeroDiseno + "").data("Tipo", "txt");
        $("#" + TxtNumeroDiseno + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + TxtNumeroDiseno + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + TxtNumeroDiseno + "").data('Item', elemento.Item);
        $("#" + TxtNumeroDiseno + "").data('columna', 'NumDis');
      
        if (vIdServSol !== 2) {
            fn_DibujarUbicaciones(PrendaUbicacion, elemento.IdCategoriaPrenda, elemento.Item, spanId);
        }
        else
        {
            fn_UbicacionSubli(elemento.IdCategoriaPrenda, elemento.Item, spanId,form);
        }
       
        fn_DibujarTallas(PrendaTallas, elemento.IdCategoriaPrenda, elemento.Item, spanId2);

        $("#" + panelbar + "").kendoPanelBar({
            expandMode: "multiple"
        });

        $("#" + form + "").kendoValidator(
            {
                rules: {
                    MsgSer: function (input) {
                        if (input.is("[name='" + CmbConfeccion + "']")) {
                            return $("#" + CmbConfeccion + "").data("kendoComboBox").selectedIndex >= 0;
                        }
                        return true;
                    },
                    MsgTemp: function (input) {
                        if (input.is("[name='" + CmbTemporada + "']")) {
                            return $("#" + CmbTemporada + "").data("kendoComboBox").selectedIndex >= 0;
                        }
                        return true;
                    },
                    MsgPro: function (input) {
                        if (input.is("[name='" + CmbPrograma + "']")) {
                            return $("#" + CmbPrograma + "").data("kendoComboBox").text() === "" ? true : $("#" + CmbPrograma + "").data("kendoComboBox").selectedIndex >= 0;
                        }
                        return true;
                    },
                    MsgNomDiseno: function (input) {
                        if (input.is("#" + TxtNombreDiseno + "")) {
                            return input.val().length > 0 && input.val().length <= 200;
                        }
                        return true;
                    },
                    MsgEstiloDiseno: function (input) {
                        if (input.is("#" + TxtEstiloDiseno + "")) {
                            return input.val().length > 0 && input.val().length <= 200;
                        }
                        return true;
                    }

                },
                messages: {
                    MsgSer: "Requerido",
                    MsgTemp: "Requerido",
                    MsgPro: "Requerido",
                    MsgNomDiseno: "Requerido",
                    MsgEstiloDiseno: "Requerido"

                }
            });

        //crear validacion
        $("#" + btn + "").data("kendoButton").bind("click", function (e) {
            fn_GuardarPrendaDiseño(this.element.data("Formulario"));

        });


    });
    //KdoButton($("#btnGenerarSolictud"), "gear", "Generar solicitudes");
    //$("#btnGenerarSolictud").data("kendoButton").bind("click", function (e) {
    //    //ConfirmacionMsg("¿Está seguro de continuar con la generación de solicitudes?", function () { return fn_InsertarSolicitudesDisenosPrendas(); });
    //    fn_InsertarSolicitudesDisenosPrendas();

    //});


};

var fn_PrendaUbicacion = function (idSolicitud) {
    var vPrendaUbi = "";
    $.ajax({
        url: UrlSpu + "/GetSolicitudesPrendasUbicacionByIdSolicitud/" + idSolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            vPrendaUbi = respuesta;
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            vPrendaUbi = null;
            kendo.ui.progress($("#body"), false);
        }
    });

    return vPrendaUbi;
};

var fn_PrendaTallas = function (idSolicitud) {
    let vPrendaTalla = "";
    $.ajax({
        url: TSM_Web_APi + "SolicitudesPrendasTallas/GetSolicitudesPrendasTallaByIdSolicitud/" + idSolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            vPrendaTalla = respuesta;
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            vPrendaTalla = null;
            kendo.ui.progress($("#body"), false);
        }
    });

    return vPrendaTalla;
};

var fn_GetPrendaUbicacion = function (idSolicitud) {
    var vPrendaUbi = "";
    $.ajax({
        url: UrlSpu + "/GetbyIdSolicitud/" + idSolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            vPrendaUbi = respuesta;
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            vPrendaUbi = null;
            kendo.ui.progress($("#body"), false);
        }
    });

    return vPrendaUbi;
};

var fn_DibujarUbicaciones = function (ds, IdCategoriaPrenda, item,spanId) {
    var UbicacionPren = $("#" + spanId + "");
    UbicacionPren.children().remove();

    var filtro = [];
    var data = JSON.parse(JSON.stringify(ds), function (key, value) {
        if (value !== null) {
            if (value.IdCategoriaPrenda === IdCategoriaPrenda && value.Item===item) filtro.push(value);

        }
        return value;
    });

    $.each(filtro, function (index, elemento) {
        if (elemento.IdUbicacion === null)
            return;

        var TxtCant = 'TxtCantDis_' +  (elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud) + elemento.IdCategoriaPrenda.toString() + elemento.IdUbicacion.toString() + elemento.Item.toString();
        UbicacionPren.append(
            '<div class="form-row">' +
            '<div class="form-group col-lg-12 ">' +
            '<input type="checkbox" id="' + TxtCant + '" name="' + TxtCant + '" class="k-checkbox k-checkbox-md k-rounded-md">' +
            '<label class="k-checkbox-label" for="' + TxtCant + '">'+ elemento.Nombre + '</label>' +
            '</div>' +
            '</div>' 
        );

        $("#" + TxtCant + "").data("Tipo", "chk");
        $("#" + TxtCant + "").data('IdUbicacion', elemento.IdUbicacion);
        $("#" + TxtCant + "").data('Item', elemento.Item);
        $("#" + TxtCant + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + TxtCant + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + TxtCant + "").prop('checked', elemento.Seleccionado);
       

    });
};

var fn_UbicacionSubli = function (IdCategoriaPrenda, Item, spanId,form) {
    let UbicacionPren = $("#" + spanId + "");
    UbicacionPren.children().remove();
    var CmbMltUbi = 'CmbMltUbi_' + vIdSolicitud.toString() + IdCategoriaPrenda.toString() + Item.toString();
    UbicacionPren.append(
        '<div class="form-row">' +
        '<div class="form-group col-lg-12 ">' +
        '<label for="' + CmbMltUbi + '">Partes:</label>' +
        '<input name="' + CmbMltUbi + '" id="' + CmbMltUbi + '"  class="form-control">' +
        '</div>' +
        '</div>'
    );

    KdoMultiSelectDatos($("#" + CmbMltUbi + ""), DsUbicaciones, "Nombre", "IdUbicacion", "Seleccione ...");
    $("#" + CmbMltUbi + "").data("Tipo", "Mlt");
    //$("#" + CmbMltUbi + "").data('IdUbicacion', elemento.IdUbicacion);
    $("#" + CmbMltUbi + "").data('Item', Item);
    $("#" + CmbMltUbi + "").data('IdSolicitud', vIdSolicitud);
    $("#" + CmbMltUbi + "").data('IdCategoriaPrenda', IdCategoriaPrenda);
    $("#" + CmbMltUbi + "").data('formulario', form);

    fn_getUbiSeleccionadas($("#" + CmbMltUbi + ""), SolUbicaciones, $("#" + CmbMltUbi + "").data("IdCategoriaPrenda").toString(), $("#" + CmbMltUbi + "").data("Item").toString());

    $("#" + CmbMltUbi + "").data("kendoMultiSelect").bind("deselect", function (e) {
       
        kendo.ui.progress($("#body"), true);
        $.ajax({
            url: TSM_Web_APi + "SolicitudesPrendasUbicaciones/DelSolicitudesPrendasUbicacionSubli/" + vIdSolicitud.toString() + "/" + this.element.data("IdCategoriaPrenda").toString() + "/" + e.dataItem.IdUbicacion + "/" + this.element.data("Item").toString(),//
            type: "Delete",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                RequestEndMsg(data, "Delete");
                kendo.ui.progress($("#body"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#body"), false);
                ErrorMsg(data);
            }
        });
    });

    $("#" + CmbMltUbi + "").data("kendoMultiSelect").bind("select", function (e) {

        if ($("#" + this.element.data("formulario") + "").data("kendoValidator").validate()) {
            kendo.ui.progress($("#body"), true);
            $.ajax({
                url: TSM_Web_APi + "SolicitudesPrendasUbicaciones",//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdSolicitud: vIdSolicitud.toString(),
                    IdCategoriaPrenda: this.element.data("IdCategoriaPrenda").toString(),
                    IdUbicacion: e.dataItem.IdUbicacion,
                    Cantidad: 1,
                    Item: this.element.data("Item").toString()
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($("#body"), false);
                },
                error: function (data) {
                   
                    fn_getUbiSeleccionadas(this.element, SolUbicaciones, this.element.data("IdCategoriaPrenda"), this.element.data("Item"));
                    kendo.ui.progress($("#body"), false);
                    ErrorMsg(data);
                }
            });
        }
        else
        {
            e.preventDefault();
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
       
    });

};

var fn_getUbiSeleccionadas = function (e, SolUbicaciones, IdCategoriaPrenda, item) {

    let filtro = [];
    let data = JSON.parse(JSON.stringify(SolUbicaciones), function (key, value) {
        if (value !== null) {
            if (value.IdCategoriaPrenda === Number(IdCategoriaPrenda) && value.Item === Number(item)) filtro.push(value);

        }
        return value;
    });
    var lista = "";
    $.each(filtro, function (index, elemento) {
        lista = lista + elemento.IdUbicacion + ",";
    });
    e.data("kendoMultiSelect").value(lista.split(","));

};
   
var fn_getUbicacionesEstamp = function () {
    let vUbi = "";
    $.ajax({
        url: TSM_Web_APi + "SolicitudesPrendasUbicaciones/GetbyUbicaciones/" + vIdSolicitud.toString() ,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            vUbi = respuesta;
            kendo.ui.progress($("#body"), false);
        },
        error: function () {
            vUbi = null;
            kendo.ui.progress($("#body"), false);
        }
    });

    return vUbi;
};

var fn_DibujarTallas = function (ds, IdCategoriaPrenda, item, spanId) {
    var UbicacionPren = $("#" + spanId + "");
    UbicacionPren.children().remove();

    var filtro = [];
    var data = JSON.parse(JSON.stringify(ds), function (key, value) {
        if (value !== null) {
            if (value.IdCategoriaPrenda === IdCategoriaPrenda && value.Item === item) filtro.push(value);

        }
        return value;
    });

    $.each(filtro, function (index, elemento) {
        if (elemento.IdCategoriaTalla === null)
            return;
        var lblchkRT = 'lblchkRT_' + (elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud) + elemento.IdCategoriaPrenda.toString() + elemento.IdCategoriaTalla.toString() + elemento.Item.toString();
        var chkRT = 'chkRT_' + (elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud) + elemento.IdCategoriaPrenda.toString() + elemento.IdCategoriaTalla.toString() + elemento.Item.toString();
        var TxtRT = 'TxtRT_' + (elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud) + elemento.IdCategoriaPrenda.toString() + elemento.IdCategoriaTalla.toString() + elemento.Item.toString();
        var TipoTalla = (elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud) + elemento.IdCategoriaPrenda.toString() + (elemento.IdCategoriaTalla.toString()==="4" ? "UNICO": "NOUNICO") + elemento.Item.toString();

        UbicacionPren.append(
            '<div class="form-row">' +
            '<div class="form-group col-lg-12 ">' +
            '<input type="checkbox" id="' + chkRT + '" name="' + chkRT + '" class="k-checkbox k-checkbox-md k-rounded-md" tipotalla="chk' + TipoTalla+ '">' +
            '<label class="k-checkbox-label" for="' + chkRT + '">' + elemento.Nombre + '</label>' +
            '</div>' +
            '</div>' +
            '<div class="form-group form-row">' +
            '<label for="' + TxtRT + '" class="col-lg-4 col-form-label" id="' + lblchkRT + '">Rango</label>' +
            '<div class="col-lg-8">' +
            '<input id="' + TxtRT + '" name="' + TxtRT + '" type="text" class="k-textbox form-control" tipotalla="input' + TipoTalla + '">' +
            '</div>' +
            '</div>');

     
        $("#" + TxtRT + "").data("Tipo", "txt");
        $("#" + TxtRT + "").data('IdCategoriaTalla', elemento.IdCategoriaTalla);
        $("#" + TxtRT + "").data('Item', elemento.Item);
        $("#" + TxtRT + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + TxtRT + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + TxtRT + "").val(elemento.RangoTallas);

        $("#" + chkRT + "").data("Tipo", "chk");
        $("#" + chkRT + "").data('IdCategoriaTalla', elemento.IdCategoriaTalla);
        $("#" + chkRT + "").data('Item', elemento.Item);
        $("#" + chkRT + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + chkRT + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + chkRT + "").prop('checked', elemento.Seleccionado);

        $("#" + TxtRT + "").prop("hidden", !elemento.Seleccionado);
        $("#" + lblchkRT + "").prop("hidden", !elemento.Seleccionado);

   

        $("#" + chkRT + "").click(function () {
            var xidT;
            if (this.checked) {
                $("#" + TxtRT + "").prop("hidden", false);
                $("#" + lblchkRT + "").prop("hidden", false);

                if ($("#" + TxtRT + "").data("IdCategoriaTalla") === 4) {
                    xidT = $("#" + TxtRT + "").data("IdSolicitud").toString() + $("#" + TxtRT + "").data("IdCategoriaPrenda").toString() + "NOUNICO" + $("#" + TxtRT + "").data("Item").toString();
                    $('[tipotalla = "chk' + xidT + '"]').prop("disabled", true);
                    $('[tipotalla = "input' + xidT + '"]').prop("disabled", true);
                    $('[tipotalla = "chk' + xidT + '"]').prop("checked", false);
                    $('[tipotalla = "input' + xidT + '"]').val("");
                    
                }
            }
            else
            {
             
                if ($("#" + TxtRT + "").data("IdCategoriaTalla") === 4)
                {
                    xidT = $("#" + TxtRT + "").data("IdSolicitud").toString() + $("#" + TxtRT + "").data("IdCategoriaPrenda").toString() + "NOUNICO" + $("#" + TxtRT + "").data("Item").toString();
                    $('[tipotalla = "chk' + xidT + '"]').prop("disabled", false);
                    $('[tipotalla = "input' + xidT + '"]').prop("disabled", false);
                    $('[tipotalla = "chk' + xidT + '"]').prop("checked", false);
                    $('[tipotalla = "input' + xidT + '"]').val("");
                } 
                $("#" + TxtRT + "").prop("hidden", true);
                $("#" + lblchkRT + "").prop("hidden", true);
            }
        });


    });
};


var fn_GuardarPrendaDiseño = function (formulario) {
    var Obj = $("#" + formulario + "")[0].elements;
    var Lista = [];
    var Lista2 = [];
    event.preventDefault();
    if ($("#" + formulario + "").data("kendoValidator").validate()) {
        kendo.ui.progress($("#body"), true);
        $.each(Obj, function (item, elemento) {
            if (elemento.id !== "") {
                if (fn_CreaRegistro(elemento.id) !== "") {
                    Lista.push(fn_CreaRegistro(elemento.id));
                    
                }
            }
        });

        var fila = "";
        fila = {
            IdElement: Lista.find(x => x.IdCategoriaPrenda !== null).IdElement,
            IdElementRol: Lista.find(x => x.IdCategoriaPrenda !== null).IdElementRol,
            TipoReg: Lista.find(x => x.IdCategoriaPrenda !== null).TipoReg,
            IdSolicitud: Lista.find(x => x.IdCategoriaPrenda !== null).IdSolicitud,
            IdCategoriaPrenda: Lista.find(x => x.IdCategoriaPrenda !== null).IdCategoriaPrenda,
            IdUbicacion: 0,
            Cantidad: 0,
            IdCategoriaConfeccion: Lista.find(x => x.IdCategoriaConfeccion !== null).IdCategoriaConfeccion,
            IdTemporada: Lista.find(x => x.IdTemporada !== null).IdTemporada,
            IdPrograma: Lista.find(x => x.IdPrograma !== null).IdPrograma,
            NombreDiseno: Lista.find(x => x.NombreDiseno !== null).NombreDiseno,
            EstiloDiseno: Lista.find(x => x.EstiloDiseno !== null).EstiloDiseno,
            NumeroDiseno: Lista.find(x => x.NumeroDiseno !== null).NumeroDiseno,
            Item: Lista.find(x => x.Item !== null).Item,
            Seleccionado: false,
            IdCategoriaTalla: null,
            RangoTallas: null
        };

        Lista2.push(fila);

       
        $.each(Lista.filter(x => x.TipoReg === "T").filter(x => x.IdElementRol === "checkbox"), function (item, elemento) {
            var row = Lista.filter(x => x.TipoReg === "T").filter(x => x.IdElementRol === "text").filter(x => x.IdCategoriaTalla === elemento.IdCategoriaTalla);
            fila = {
                IdElement: elemento.IdElement,
                IdElementRol: elemento.IdElementRol,
                TipoReg: elemento.TipoReg,
                IdSolicitud: elemento.IdSolicitud,
                IdCategoriaPrenda: elemento.IdCategoriaPrenda,
                IdUbicacion: 0,
                Cantidad: 0,
                IdCategoriaConfeccion: null,
                IdTemporada: null,
                IdPrograma: null,
                NombreDiseno: null,
                EstiloDiseno: null,
                NumeroDiseno: null,
                Item: elemento.Item,
                Seleccionado: elemento.Seleccionado,
                IdCategoriaTalla: elemento.IdCategoriaTalla,
                RangoTallas: row[0].RangoTallas === undefined ? null : row[0].RangoTallas
            };
            Lista2.push(fila);
        });
        

      

        $.each(Lista.filter(x => x.TipoReg === "D"), function (item, elemento) {
            Lista2.push(elemento);
        });

        $.ajax({
            type: "Post",
            dataType: 'json',
            async: false,
            data: JSON.stringify(Lista2),
            url: UrlSpu + "/RegistrarCambio",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                fn_ActualizaElementos(result[0]);
                RequestEndMsg(result, "Post");
                kendo.ui.progress($("#body"), false);
            }
        });

        kendo.ui.progress($("#body"), false);
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
};

var fn_CreaRegistro = function (id) {
    var fila = "";
    var vElem = $("#" + id + "");
    if (vElem[0].type === "text" || vElem[0].type === "checkbox") {

        if (vElem.data("role") === "combobox" || (vElem.data("role") === undefined && vElem[0].type === "text")) {

            if (vElem.data("IdCategoriaTalla") === undefined) {
                fila = {
                    IdElement: id,
                    IdElementRol: vElem.data("role") === undefined ? vElem[0].type : vElem.data("role"),
                    TipoReg: "C",
                    IdSolicitud: $("#" + id + "").data("IdSolicitud"),
                    IdCategoriaPrenda: $("#" + id + "").data("IdCategoriaPrenda"),
                    IdUbicacion: 0,
                    Cantidad: 0,
                    IdCategoriaConfeccion: $("#" + id + "").data('columna') === "Confeccion" ? KdoCmbGetValue($("#" + id + "")) : null,
                    IdTemporada: $("#" + id + "").data('columna') === "Temporada" ? KdoCmbGetValue($("#" + id + "")) : null,
                    IdPrograma: $("#" + id + "").data('columna') === "Programa" ? KdoCmbGetValue($("#" + id + "")) : null,
                    NombreDiseno: $("#" + id + "").data('columna') === "NomDis" ? $("#" + id + "").val() : null,
                    EstiloDiseno: $("#" + id + "").data('columna') === "EstDis" ? $("#" + id + "").val() : null,
                    NumeroDiseno: $("#" + id + "").data('columna') === 'NumDis' ? $("#" + id + "").val() : null,
                    Item: $("#" + id + "").data("Item"),
                    Seleccionado: false,
                    IdCategoriaTalla: null,
                    RangoTallas: null
                };
            } else {
                fila = {
                    IdElement: id,
                    IdElementRol: vElem.data("role") === undefined ? vElem[0].type : vElem.data("role"),
                    TipoReg: "T",
                    IdSolicitud: $("#" + id + "").data("IdSolicitud"),
                    IdCategoriaPrenda: $("#" + id + "").data("IdCategoriaPrenda"),
                    IdUbicacion: 0,
                    Cantidad: 0,
                    IdCategoriaConfeccion: $("#" + id + "").data('columna') === "Confeccion" ? KdoCmbGetValue($("#" + id + "")) : null,
                    IdTemporada: $("#" + id + "").data('columna') === "Temporada" ? KdoCmbGetValue($("#" + id + "")) : null,
                    IdPrograma: $("#" + id + "").data('columna') === "Programa" ? KdoCmbGetValue($("#" + id + "")) : null,
                    NombreDiseno: $("#" + id + "").data('columna') === "NomDis" ? $("#" + id + "").val() : null,
                    EstiloDiseno: $("#" + id + "").data('columna') === "EstDis" ? $("#" + id + "").val() : null,
                    NumeroDiseno: $("#" + id + "").data('columna') === 'NumDis' ? $("#" + id + "").val() : null,
                    Item: $("#" + id + "").data("Item"),
                    Seleccionado: false,
                    IdCategoriaTalla: $("#" + id + "").data("IdCategoriaTalla"),
                    RangoTallas:  $("#" + id + "").val()
                };
            }
           
        }
        

    }
    if (vElem[0].type === "checkbox") {
        if (vElem.data("IdCategoriaTalla") === undefined) {
            fila = {
                IdElement: id,
                IdElementRol: vElem.data("role") === undefined ? vElem[0].type : vElem.data("role"),
                TipoReg: "D",
                IdSolicitud: $("#" + id + "").data("IdSolicitud"),
                IdCategoriaPrenda: $("#" + id + "").data("IdCategoriaPrenda"),
                IdUbicacion: $("#" + id + "").data("IdUbicacion"),
                Cantidad: 1,
                IdCategoriaConfeccion: null,
                IdTemporada: null,
                IdPrograma: null,
                NombreDiseno: null,
                EstiloDiseno: null,
                NumeroDiseno: null,
                Item: $("#" + id + "").data("Item"),
                Seleccionado: $("#" + id + "").is(':checked'),
                IdCategoriaTalla: null,
                RangoTallas: null


            };
        } else {
            fila = {
                IdElement: id,
                IdElementRol: vElem.data("role") === undefined ? vElem[0].type : vElem.data("role"),
                TipoReg: "T", // tallas
                IdSolicitud: $("#" + id + "").data("IdSolicitud"),
                IdCategoriaPrenda: $("#" + id + "").data("IdCategoriaPrenda"),
                IdUbicacion: null,
                Cantidad: 0,
                IdCategoriaConfeccion: null,
                IdTemporada: null,
                IdPrograma: null,
                NombreDiseno: null,
                EstiloDiseno: null,
                NumeroDiseno: null,
                Item: $("#" + id + "").data("Item"),
                Seleccionado: $("#" + id + "").is(':checked'),
                IdCategoriaTalla: $("#" + id + "").data("IdCategoriaTalla"),
                RangoTallas: null


            };

        }
       
    }
    
    return fila;
};

var fn_InsertarSolicitudesDisenosPrendas = function () {
    var vinsertado = false;
    $.ajax({
        url: UrlSdp + "/InsertarSolicitudesDisenosPrendas/" + vIdSolicitud.toString(),
        type: "Post",
        dataType: "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            vinsertado = true;
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            vinsertado = false;
            ErrorMsg(data);
        }
    });

    return vinsertado;
};

var fn_ActualizaElementos = function (ds) {
    $.each(ds, function (item, elemento) {
        $("#" + elemento.IdElement + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
    });
};


var fn_GetPrendaUbicacionesSinSolicitudDiseno = function (idSolicitud) {
    var valor = "";
    $.ajax({
        url: UrlSpu + "/GetPrendaUbicacionesSinSolicitudDiseno/" + idSolicitud,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            valor = respuesta;
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            valor = respuesta;
            kendo.ui.progress($("#body"), false);
        }
    });

    return valor;
};
let fn_NuevoItemProm = function (widgetId, value) {
    var widget = $("#" + widgetId).getKendoComboBox();
    var dsProN = widget.dataSource;

    ConfirmacionMsg("¿Esta seguro de crear el nuevo registro?", function () {
        dsProN.add({
            IdPrograma: 0,
            Nombre: value,
            Fecha: Fhoy(),
            IdCliente: vIdClienteSol,
            IdTemporada: KdoCmbGetValue($("#CmbTemporada")),
            NoDocumento: "",
            Nombre1: ""
        });

        dsProN.one("sync", function () {
            widget.select(dsProN.view().length - 1);
            widget.trigger("change");
        });

        dsProN.sync();
    });
};

var KdoCmbComboBoxPrograma = function (e,  textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, fn_crear) {
    $.ajax({
        url: TSM_Web_APi + "/Programas/GetByCliente/" + vIdClienteSol,
        dataType: "json",
        async: false,
        success: function (result) {
            var model = generateModel(result, valueField);
            var dataSource = new kendo.data.DataSource({
                batch: true,
                transport: {
                    read: {
                        url: TSM_Web_APi + "/Programas/GetByCliente/" + vIdClienteSol,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    },
                    create: {
                        url: TSM_Web_APi + "/Programas",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8"
                    },
                    parameterMap: function (data, type) {
                        if (type !== "read") {
                            return kendo.stringify(data.models[0]);
                        }
                    }
                },
                schema: {
                    total: "count",
                    model: model
                }
            });
            e.kendoComboBox({
                dataTextField: textField,
                dataValueField: valueField,
                autoWidth: true,
                filter: "contains",
                autoBind: false,
                clearButton: givenOrDefault(clearButton, true),
                placeholder: givenOrDefault(opcPlaceHolder, "Seleccione un valor ...."),
                height: givenOrDefault(opcHeight === "" || opcHeight === 0 ? undefined : opcHeight, 550),
                cascadeFrom: givenOrDefault(parentCascade, ""),
                dataSource: dataSource,
                noDataTemplate: kendo.template("<div>Dato no encontrado.¿Quieres agregar nuevo registro - '#: instance.text() #' ? </div ><br /><button class=\"k-button\" onclick=\"" + fn_crear + "('#: instance.element[0].id #', '#: instance.text() #')\"><span class=\"k-icon k-i-save\"></span>&nbsp;Crear Registro</button>")//$("#noDataTemplate").html()
            });

        }
    });
};

let fn_GetMulSUbicaciones = function () {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "ubicaciones",
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};

let fn_GetDatos = function (WebApi) {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: WebApi,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
    });

    return result;
};
let fn_DeletePren = function (e) {
    let obj = $(e);
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudesPrendas/" + obj.data("IdSolicitud").toString() + "/" + obj.data("IdCategoriaPrenda").toString() + "/" + obj.data("Item").toString(),
        type: "delete",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_GetSolictudPrenda();
            kendo.ui.progress($("#body"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(data);
        }
    });

};