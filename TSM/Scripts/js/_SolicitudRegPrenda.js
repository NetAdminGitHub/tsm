
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
    var PrendaUbicacion = fn_PrendaUbicacion(vIdSolicitud);
    $.each(ds, function (item, elemento) {
        var form = 'Form_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString();
        var CmbConfeccion = 'Cmb_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString();
        var spanId = 'U_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString();
        var btn = 'btn_' + elemento.IdSolicitud.toString() + elemento.IdCategoriaPrenda.toString();
        var vIcon = elemento.Icono === "" || elemento.Icono === null ? "k-icon k-i-image" : elemento.Icono;
        ViewPren.append(
            '<div class="col-lg-2">' +
            '<div class="card" style="height: 100%;">' +
            '<div class="card-body" >' +
            '<div class="form-group col-lg-12">' +
            '<form id="' + form + '" method="POST" enctype="multipart/form-data" autocomplete="off">' +
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
            '</div>' +
            '<span id="' + spanId + '"></span>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '<div class="card-footer"><div class="form-row"><div class="input-group"><div style="width: 100%;"><button class="btn-lg btn-block" type="button" id="' + btn + '" name="' + btn + '"> Agregar</button></div></div></div></div>' +
            '</div>' +
            '</div>');

        Kendo_CmbFiltrarGrid($("#" + CmbConfeccion + ""), UrlCp, "Nombre", "IdCategoriaConfeccion", "Seleccione...");
        KdoButton($("#" + btn + ""), "save", "Agregar");

        $("#" + btn + "").data('Formulario', form);
        $("#" + CmbConfeccion + "").data("kendoComboBox").value(elemento.IdCategoriaPrenda === null ? 0 : elemento.IdCategoriaConfeccion);
        $("#" + CmbConfeccion + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + CmbConfeccion + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);

        fn_DibujarUbicaciones(PrendaUbicacion, elemento.IdCategoriaPrenda, spanId);

        $("#" + form + "").kendoValidator(
            {
                rules: {
                    MsgSer: function (input) {
                        if (input.is("[name='" + CmbConfeccion + "']")) {
                            return $("#" + CmbConfeccion + "").data("kendoComboBox").selectedIndex >= 0;
                        }
                        return true;
                    }

                },
                messages: {
                    MsgSer: "Requerido"

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

var fn_DibujarUbicaciones = function (ds, IdCategoriaPrenda, spanId) {
    var UbicacionPren = $("#" + spanId + "");
    UbicacionPren.children().remove();

    var filtro = [];
    var data = JSON.parse(JSON.stringify(ds), function (key, value) {
        if (value !== null) {
            if (value.IdCategoriaPrenda === IdCategoriaPrenda) filtro.push(value);

        }
        return value;
    });

    $.each(filtro, function (index, elemento) {
        var TxtCant = 'TxtCantDis_' + (elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud) + elemento.IdCategoriaPrenda.toString() + elemento.IdUbicacion.toString();
        UbicacionPren.append(
            '<div class="form-group row">' +
            '<label for="' + TxtCant + '" class="col-lg-6 col-form-label">' + elemento.Nombre + '</label>' +
            '<div class="col-lg-6">' +
            '<input id="' + TxtCant + '" name="' + TxtCant + '" type="text" class="form-control" />' +
            '</div>' +
            '</div>');

        $("#" + TxtCant + "").kendoNumericTextBox({
            min: 0,
            max: 999999999,
            format: "#",
            restrictDecimals: true,
            decimals: 0,
            value: 0
        });
        // asignar valores 
        $("#" + TxtCant + "").data('IdUbicacion', elemento.IdUbicacion);
        $("#" + TxtCant + "").data('IdSolicitud', elemento.IdSolicitud === null ? vIdSolicitud : elemento.IdSolicitud);
        $("#" + TxtCant + "").data('IdCategoriaPrenda', elemento.IdCategoriaPrenda);
        $("#" + TxtCant + "").data("kendoNumericTextBox").value(elemento.Cantidad === null ? 0 : elemento.Cantidad);

    });
};

var fn_GuardarPrendaDiseño = function (formulario) {
    var Obj = $("#" + formulario + "")[0].elements;
    var Lista = [];
    event.preventDefault();
    if ($("#" + formulario + "").data("kendoValidator").validate()) {
        $.each(Obj, function (item, elemento) {
            if (elemento.id !== "") {
                if (fn_CreaRegistro(elemento.id) !== "") {
                    Lista.push(fn_CreaRegistro(elemento.id));
                }
            }
        });
        $.ajax({
            type: "Post",
            dataType: 'json',
            async: false,
            data: JSON.stringify(Lista),
            url: UrlSpu + "/RegistrarCambio",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                fn_ActualizaElementos(result[0]);
                RequestEndMsg(result, "Post");
            }
        });
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }



};

var fn_CreaRegistro = function (id) {
    var fila = "";
    var vElem = $("#" + id + "");
    if (vElem.data("role") !== "button" && vElem.data("role") !== "combobox") {
        if (vElem.data("role") === "numerictextbox") {
            $("#" + id + "").data("kendoNumericTextBox").value();
            fila = {
                IdElement: id,
                IdElementRol: vElem.data("role"),
                TipoReg: "D",
                IdSolicitud: $("#" + id + "").data("IdSolicitud"),
                IdCategoriaPrenda: $("#" + id + "").data("IdCategoriaPrenda"),
                IdUbicacion: $("#" + id + "").data("IdUbicacion"),
                Cantidad: $("#" + id + "").data("kendoNumericTextBox").value(),
                IdCategoriaConfeccion: null
            };
        }
    } else {
        if (vElem.data("role") === "combobox") {
            fila = {
                IdElement: id,
                IdElementRol: vElem.data("role"),
                TipoReg: "C",
                IdSolicitud: $("#" + id + "").data("IdSolicitud"),
                IdCategoriaPrenda: $("#" + id + "").data("IdCategoriaPrenda"),
                IdUbicacion: 0,
                Cantidad: 0,
                IdCategoriaConfeccion: KdoCmbGetValue($("#" + id + ""))
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