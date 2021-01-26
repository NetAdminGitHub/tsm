﻿var Permisos;
let xIdArte = 0;
let xIdSeteo = 0;
let UrlApiCAtInstrucciones = TSM_Web_APi + "CatInstrucciones";
let UrlClientesTolerancia = TSM_Web_APi + "ClientesToleranciaMedida";
let UrlSolicitudProd = TSM_Web_APi + "SolicitudProduccionesInstrucciones"; // ficha de producción
let UrlSolicitudProdTolerancia = TSM_Web_APi + "SolicitudProduccionesToleranciaMedida"; // ficha de producción
let UrlSolicitudProdHeader = TSM_Web_APi + "SolicitudProducciones";
var xFecha = kendo.toString(kendo.parseDate(new Date()), 's');
let UrlApiAAdj = TSM_Web_APi + "ArteAdjuntos";
let UrlApiArteAdj = TSM_Web_APi + "ArteAdjuntos";
let idcliente = "";
var reqid;
var idSimulacion;
var idCotizacion;
var EstadoFichaProd;
let xNoDocumento;
let imgCatSrc;
let imgPlaceSrc;
$(document).ready(function () {
    xIdOt = xIdOt === undefined ? 0 : xIdOt;
    KdoButton($("#btnIrGOT"), "hyperlink-open-sm");
    // carga carrousel de imagenes 
    var DivCarousel = $("#Div_Carousel");
    DivCarousel.append(Fn_Carouselcontent());
    Fn_LeerImagenes($("#Mycarousel"), "", null);

    // carga carrousel de imagenes  plavement
    var DivCarouselP = $("#Div_Placement");
    DivCarouselP.append(Fn_Carouselcontentwp("Mycarouselwp"));
    Fn_LeerImagenes($("#Mycarouselwp"), "", null);

    //Configuracion de panel
    PanelBarConfig($("#bpanel"));
    
    KdoButton($("#btnImprimir"), "print", "Imprimir Ficha de Producción");
    KdoButton($("#btnCerrarAdj"), "close-circle", "Cerrar");    
    KdoButton($("#myBtnAdjunto"), "attachment", "Adjuntar Placement");
    Kendo_MultiSelect($("#instruccionesProd"), UrlApiCAtInstrucciones+"/PROD", "Descripcion", "IdInstruccion", "Seleccione ...");
    Kendo_MultiSelect($("#instruccionesCalidad"), UrlApiCAtInstrucciones+"/CALI", "Descripcion", "IdInstruccion", "Seleccione ...");
    kendo
    fn_GetOTRequerimiento();

    $('#plStrikeOff').attr('readonly', true);
    $('#plTermofijado').attr('readonly', true);

    $("#btnIrGOT").click(function () {
        window.location.href = "/ConsultarFichaOT";
    });



    //#region CRUD Prendas multi select

    $("#instruccionesProd").data("kendoMultiSelect").bind("deselect", function (e) {
        if (xIdOt > 0) {
            let idins = e.dataItem.IdInstruccion;
            kendo.ui.progress($(document.body), true);
            let parametros = `${xIdOt},${idSimulacion},${idCotizacion},${idins}`;


            url = UrlSolicitudProd + "/" + encodeURIComponent(parametros);
            $.ajax({
                url: url,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {
                    let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;


                    getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesProd"));
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });

        }

    });

    $("#instruccionesProd").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if (xIdOt > 0) {
            kendo.ui.progress($(document.body), true);
            //var item = e.item;
            $.ajax({
                url: UrlSolicitudProd,//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdOrdenTrabajo: xIdOt,
                    IdSimulacion: idSimulacion,
                    IdCotizacion: idCotizacion,
                    IdInstruccion: e.dataItem.IdInstruccion,
                    IdUsuarioMod: getUser(),
                    FechaMod: xFecha
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {

                    let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;


                    getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesProd"));
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });
        }

    });
     // para instruccionesCalidad

    $("#instruccionesCalidad").data("kendoMultiSelect").bind("deselect", function (e) {
        if (xIdOt > 0) {
            let idins = e.dataItem.IdInstruccion;
            kendo.ui.progress($(document.body), true);
            let parametros = `${xIdOt},${idSimulacion},${idCotizacion},${idins}`;


            url = UrlSolicitudProd + "/" + encodeURIComponent(parametros);
            $.ajax({
                url: url,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {
                    let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;


                    getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesCalidad"));
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });

        }

    });

    $("#instruccionesCalidad").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if (xIdOt > 0) {
            kendo.ui.progress($(document.body), true);
            //var item = e.item;
            $.ajax({
                url: UrlSolicitudProd,//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdOrdenTrabajo: xIdOt,
                    IdSimulacion: idSimulacion,
                    IdCotizacion: idCotizacion,
                    IdInstruccion: e.dataItem.IdInstruccion,
                    IdUsuarioMod: getUser(),
                    FechaMod: xFecha
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {

                    let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;


                    getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesCalidad"));
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    
    $('#TxtInstrucciones').on("change", function (e) {

        ActualizaComentariosFicha();
    }); 

    $('#TxtComentarios').on("change", function (e) {

        ActualizaComentariosFicha();
    });

    $('#plPlacement').on("change", function (e) {
    
        ActualizaComentariosFicha();
    });

    $('#plTrama').on("change", function (e) {
       
        ActualizaComentariosFicha();
    });

    $('#plMuestraAprobada').on("change", function (e) {
       
        ActualizaComentariosFicha();
    });

    $('#plMigracion').on("change", function (e) {
     
        ActualizaComentariosFicha();
    });

    $('#plLavado').on("change", function (e) {

        ActualizaComentariosFicha();
    });



    //Control para subir los adjutos
    $("#Adjunto").kendoUpload({
        async: {
            saveUrl: "/RequerimientoDesarrollos/SubirArchivo",
            autoUpload: true
        },
        localization: {
            select: '<div class="k-icon k-i-attachment-45"></div>&nbsp;Adjuntos'
        },
        upload: function (e) {
            e.sender.options.async.saveUrl = "/RequerimientoDesarrollos/SubirArchivo/" + xNoDocumento;
        },
        showFileList: false,
        success: function (e) {
            if (e.operation === "upload") {
                GuardarArtAdj(UrlApiAAdj, e.files[0].name);
            }
        }

    }); 

    let fn_LeerImagen = function (event, blobs) {
        kendo.ui.progress($("#vistaParcial"), true);

        var nombreArchivo = 'Recorte_' + kendo.toString(kendo.parseDate(new Date()), 'yyyyMMdd_HHmmss') + '.' + blobs[0].name.split('.')[1];
        var form = new FormData();
        form.append("Adjunto", blobs[0], nombreArchivo);

        $.ajax({
            url: "/RequerimientoDesarrollos/SubirArchivo/" + xNoDocumento,//
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            cache: false,
            //dataType: "json",
            success: function (data) {
                GuardarArtAdj(UrlApiAAdj, nombreArchivo);
                kendo.ui.progress($("#vistaParcial"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#vistaParcial"), false);
                ErrorMsg(data);
            }
        });
    };

    $("#myModalAdjunto").on("show.bs.modal", function (e) {
        $(document).on('custom/paste/images', fn_LeerImagen);
    });

    $("#myModalAdjunto").on("hide.bs.modal", function (e) {
        $(document).off('custom/paste/images', fn_LeerImagen);
    });
    //DataSource para Grid de Artes Adjuntos
    var DsAdj = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlApiAAdj + "/GetArteAdjuntosVista/" + xIdArte.toString(); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlApiAAdj + "/" + datos.Id; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) {
                    if (EliminarArtAdjFicha("/RequerimientoDesarrollos/BorrarArchivo/" + xNoDocumento, datos.NombreArchivo)) {
                        return UrlApiAAdj + "/" + datos.Id;
                    }
                },
                dataType: "json",
                type: "DELETE"
            },

            parameterMap: function (data, type) {
                if (type !== "read") {

                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "destroy" || e.type === "update") { getAdjun(UrlApiArteAdj + "/GetVistaImagenes/" + xIdArte.toString()); }

        },
        error: Grid_error,
        schema: {
            model: {
                id: "Id",
                fields: {
                    Id: {
                        type: "string"

                    },
                    IdArte: {
                        type: "number", defaultValue: function () { return xIdArte; }
                    },
                    Item: {
                        type: "number"
                    },
                    NombreArchivo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='NombreArchivo']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }

                                return true;
                            }
                        }
                    },
                    Fecha: {
                        type: "date"
                    },
                    Descripcion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='Descripcion']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdTipoAdjunto']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoAdjunto").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Catalogo: { type: "bool" },
                    Placement: { type: "bool" },
                    IdTipoAdjunto: { type: "string" },
                    NombreAdjunto: { type: "string" }


                }
            }
        }
    });



    //Grid de ArtesAdjuntos
    $("#GridAdjuntos").kendoGrid({
        autoBind: false,
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdColorTecnica");
            KdoHideCampoPopup(e.container, "Fecha");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "IdArte");
            KdoHideCampoPopup(e.container, "NombreArchivo");
            KdoHideCampoPopup(e.container, "Id");
            KdoHideCampoPopup(e.container, "NombreAdjunto");
            KdoHideCampoPopup(e.container, "Catalogo");
            KdoHideCampoPopup(e.container, "Placement");
            Grid_Focus(e, "Descripción");
        },
        columns: [
            { field: "Id", title: "ID", hidden: true },
            { field: "IdArte", title: "IdArte", hidden: true },
            { field: "Item", title: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "NombreArchivo", title: "Nombre del Archivo", template: function (data) { return "<a href='/Adjuntos/" + xNoDocumento + "/" + data["NombreArchivo"] + "' target='_blank' style='text-decoration: underline;'>" + data["NombreArchivo"] + "</a>"; } },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "Descripcion", title: "Descripción", hidden: true },
            { field: "Catalogo", title: "Catalogo ?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Catalogo"); }, hidden: true },
            { field: "Placement", title: "Placement ?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Placement"); }, hidden: true },
            { field: "IdTipoAdjunto", title: "Tipo de Adjunto", editor: Grid_Combox, values: ["IdTipoAdjunto", "Nombre", TSM_Web_APi + "TiposAdjuntos", "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreAdjunto", title: "Nombre Adjunto" }
        ]
    });

    SetGrid($("#GridAdjuntos").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true);
    SetGrid_CRUD_ToolbarTop($("#GridAdjuntos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GridAdjuntos").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GridAdjuntos").data("kendoGrid"), DsAdj);

    $("#Mycarouselwp img").hover(function () {
        kendo.fx(this).zoom("in").startValue(1).endValue(4).play();
    }, function () {
        kendo.fx(this).zoom("out").endValue(1).startValue(2).play();
    });

   
    if (Permisos.SNEditar === false || Permisos.SNBorrar === false) {
        $('#plStrikeOff').attr('enable', false);
        $('#plMigracion').attr('enable', false);
        $('#plLavado').attr('enable', false);
        $('#plMuestraAprobada').attr('enable', false);//
        $('#plTrama').attr('enable', false);
        $("#instruccionesProd").data("kendoMultiSelect").enable(false);
        $("#InstruccionesCalidad").data("kendoMultiSelect").enable(false);
        $("#TxtInstrucciones").attr("enable", false);
        $("#ToleranciaMed").data("kendoMultiSelect").enable(false);
    }




});



$("#btnImprimir").click(function (e) {

    let paramficha = `${xIdOt},${idSimulacion},${idCotizacion},"base64_1","base64_1"`;

    e.preventDefault();
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: window.location.origin + "/ReportesCreate",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(
            {
                rptName: "crptFichaProduccion",
                controlador: "FichaProduccion",
                accion: "GetFicha",
                id: paramficha
            }
        ),
        contentType: "application/json; charset=utf-8",
        success: function (respuesta) {
            let MiRpt = window.open(respuesta, "_blank");

            if (!MiRpt)
                $("#kendoNotificaciones").data("kendoNotification").show("Bloqueo de ventanas emergentes activado.<br /><br />Debe otorgar permisos para ver el reporte.", "error");

            kendo.ui.progress($(document.body), false);
        },
        error: function (e) {
            $("#kendoNotificaciones").data("kendoNotification").show(e, "error");
            kendo.ui.progress($(document.body), false);
        }
    });
    return true;
});

let fn_GetOTRequerimiento = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "FichaProduccion/GetInfoRequerimientoDesarrolloFicha/" + xIdOt,
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#plNomServicio").text(datos.NomServicio);
                $("#plFechaOrdenTrabajo").text(kendo.toString(kendo.parseDate(datos.FechaOrdenTrabajo), 'dd/MM/yyyy'));
                $("#plNodocReq").text(datos.NodocReq);
                $("#plIdCliente").text(datos.IdCliente);
                idcliente = datos.IdCliente;
                $("#plNombre").text(datos.Nombre);
                $("#plNombreDiseno").text(datos.NombreDiseno);
                $("#plEstiloDiseno").text(datos.EstiloDiseno);
                $("#plNombrePrenda").text(datos.NombrePrenda);
                $("#plNoDocumento").text(datos.NoDocumento);
                $("#plCatalogo").text(datos.NoReferencia);
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
                $("#plNombrePrograma").text(datos.NombrePrograma);
                $("#plIdDiseno").text(datos.NumeroDiseno);
                $("#plCantPiezas").text(datos.CantidadPiezas);
                $("#plParte").text(datos.NombreUbicacion);
                $("#plCombos").text(datos.CantidadCombos);
                $("#plCambioTalla").text(datos.CantidadTallas);
                $("#plMontajes").text(datos.Montajes);
                $("#plProdHora").text(datos.ProductividadHora);
                $("#plTipoLuz").text(datos.TipoLuz);
                $("#TxtInstrucciones").val(datos.InstruccionesGen);
                $("#TxtComentarios").val(datos.InstruccionesTermo);

                $("#plStrikeOff").prop("checked", Boolean(Number(datos.TieneStrikeOff)));
                $("#plTermofijado").prop("checked", Boolean(Number(datos.UsarTermofijado)));
                $("#plMigracion").prop("checked", Boolean(Number(datos.Migracion)));
                $("#plLavado").prop("checked", Boolean(Number(datos.Lavado)));
                $("#plMuestraAprobada").prop("checked", Boolean(Number(datos.Muestra)));
                $("#plTrama").prop("checked", Boolean(Number(datos.Trama)));

                reqid = Number(datos.IdRequerimiento);
                idSimulacion = Number(datos.IdSimulacion);
                EstadoFichaProd = datos.EstadoFichaProd;
                idCotizacion = Number(datos.IdCotizacion);
                xNoDocumento = datos.NodocReq;
                if (Number(datos.UsarTermofijado) === 1) { $("#TxtComentarios").attr("readonly", false); }
                else { $("#TxtComentarios").attr("readonly", true); }
                
                xIdArte = datos.IdArte === null ? 0 : datos.IdArte;
                xIdSeteo = datos.IdSeteoActual === null ? 0 : datos.IdSeteoActual;
                Kendo_MultiSelect($("#ToleranciaMed"), UrlClientesTolerancia + "/" + idcliente, "Tolerancia", "IdTolerancia", "Seleccione ...");
                // Multiselect de Tolerancia

                $("#ToleranciaMed").data("kendoMultiSelect").bind("deselect", function (e) {
                    if (xIdOt > 0) {
                        let idTol = e.dataItem.IdTolerancia;
                        kendo.ui.progress($(document.body), true);
                        let parametros = `${xIdOt},${idSimulacion},${idCotizacion},${idTol}`;


                        url = UrlSolicitudProdTolerancia + "/" + encodeURIComponent(parametros);
                        $.ajax({
                            url: url,//
                            type: "Delete",
                            dataType: "json",
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                //CargarInfoEtapa(false);
                                RequestEndMsg(data, "Delete");
                                kendo.ui.progress($(document.body), false);
                            },
                            error: function (data) {
                                let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;
                                getTolerancia(UrlSolicitudProdTolerancia + `/${parametros}`, $("#ToleranciaMed"));
                                kendo.ui.progress($(document.body), false);
                                ErrorMsg(data);
                            }
                        });

                    }

                });

                $("#ToleranciaMed").data("kendoMultiSelect").bind("select", function (e) {
                    //si el requerimiento de Desarrollo existe 
                    //se permite agregar un nuevo registro de prendas
                    if (xIdOt > 0) {
                        kendo.ui.progress($(document.body), true);
                        //var item = e.item;
                        $.ajax({
                            url: UrlSolicitudProdTolerancia,//
                            type: "Post",
                            dataType: "json",
                            data: JSON.stringify({
                                IdOrdenTrabajo: xIdOt,
                                IdSimulacion: idSimulacion,
                                IdCotizacion: idCotizacion,
                                IdTolerancia: e.dataItem.IdTolerancia,
                                IdUsuarioMod: getUser(),
                                FechaMod: xFecha
                            }),
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                //CargarInfoEtapa(false);
                                RequestEndMsg(data, "Post");
                                kendo.ui.progress($(document.body), false);
                            },
                            error: function (data) {

                                let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;


                                getTolerancia(UrlSolicitudProdTolerancia + `/${parametros}`, $("#ToleranciaMed"));
                                kendo.ui.progress($(document.body), false);
                                ErrorMsg(data);
                            }
                        });
                    }

                });
                fn_getAdjunto();
            }
        },
        error: function () { kendo.ui.progress($(document.body), false); },
        complete: function () {
            fn_ObtieneConfFoil();
            fn_DibujarSeccionMaqui();
            fn_ObtieneConfiguracionBrazos();
            fn_ObtenerDimensiones(reqid);
            let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;
            getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesProd"));
            getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesCalidad"));
            getTolerancia(UrlSolicitudProdTolerancia + `/${parametros}`, $("#ToleranciaMed"));
            kendo.ui.progress($(document.body), false);
        }

    });
};





let fn_getAdjunto = function () {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetVistaImagenes/" + xIdArte.toString(),
        dataType: 'json',
        type: 'GET',
        success: function (datos) {

            let filtro = [];
            let filtro2 = [];
            var data = JSON.parse(JSON.stringify(datos), function (key, value) {
                if (value !== null) {
                    if (value.Placement === true) filtro.push(value);
                    if (value.Catalogo === true) filtro2.push(value);
                }
                return value;
            });

            Fn_LeerImagenesMejorado($("#Mycarousel"), "/Adjuntos/" + xNoDocumento + "", filtro2);
           
            Fn_LeerImagenesMejorado($("#Mycarouselwp"), "/Adjuntos/" + xNoDocumento + "", filtro);
             imgCatSrc = $('#Mycarouselwp0').attr('src');
             imgPlaceSrc = $('#Mycarousel0').attr('src');
            var imgCatologo = document.querySelector('#Mycarouselwp0');
            imgCatologo.addEventListener('load', function (event) {
                var base64image = getDataUrl(event.currentTarget);

            });
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};




var getDataUrl = function (img) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // If the image is not png, the format
    // must be specified here
    return canvas.toDataURL()
}



let fn_ObtieneConfiguracionBrazos = function () {
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
                    IdSeda: { type: "string" },
                    SedaNombre: {type:"string"}
                   
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gConfBrazos").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "IdSeda", title: "IdSeda", hidden: true  },
            { field: "SedaNombre", title: "Seda" },
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
            { field: "DesPeso", title: "Unidad Peso" }
            
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gConfBrazos").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gConfBrazos").data("kendoGrid"), dsetMar);
};

let fn_ObtieneConfFoil = function () {

    var dataSource = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesAccesorios/GetBySeteo/" + xIdSeteo; },
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
                id: "IdSeteo",
                fields: {
                    IdSeteo: { type: "number" },
                    IdEstacion: { type: "number" },
                    Power: { type: "number" },
                    Temperatura: { type: "number" },
                    Tiempo: { type: "number" },
                    IdArticulo: { type: "string" },
                    AnchoConsumo: { type: "number" },
                    AltoConsumo: { type: "number" },
                    NombreArticulo: { type: "string" },
                    AreaCuadrada: { type: "number" },
                    UnidadMedida: {type:"string"}
                    
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gFoil").kendoGrid({
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeteo", title: "Seteo", hidden: true },
            { field: "IdArticulo", title: "Producto" },
            { field: "NombreArticulo", title: "Nombre de Producto", width: 200 },
            { field: "IdEstacion", title: "Estación", width: 160 },
            { field: "Power", title: "Power", hidden:true },
            { field: "Temperatura", title: "Temperatura", width:160 },
            { field: "Tiempo", title: "TIempo",width:160 },
            { field: "AltoConsumo", title: "Alto", width: 100 },
            { field: "AnchoConsumo", title: "Ancho", width: 100 },
            { field: "AreaCuadrada", title: "Área", width: 100 },
            { field: "UnidadMedida", title: "Unidad de Medida", width: 100 }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gFoil").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gFoil").data("kendoGrid"), dataSource);

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




// $('#gDimensiones').data('kendoGrid').dataSource.read()

let fn_ObtenerDimensiones = function (req) {
    var dsDim = new kendo.data.DataSource({

        transport: {
            read:  {
               
                url: function (datos) { return TSM_Web_APi + "Dimensiones/GetDimensionByReqId/" + req; },
                contentType: "application/json; charset=utf-8"
            
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "Dimensiones/" + datos.IdRequerimiento.toString() + "/" + datos.IdDimension.toString(); },
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8"    ,           
                 success: function (datos) {
                    datos.success(result);
                }
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "Llave",
                fields: {
                    
                    IdRequerimiento: { type: "number" },
                    IdDimension: { type: "number" },
                    IdCategoriaTalla: { type: "number" },
                    IdUnidad: { type: "number" },
                    Nombre: { type: "string" },
                    Alto: { type: "number" },
                    Ancho: { type: "number" },
                    AltoEstamp: {type: "number"},
                    AnchoEstamp: { type: "number" },
                    Tallas: { type: "string" },
                    DimensionesRelativas: { type: "string" }
                   
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    var selectedRows = [];
    $("#gDimensiones").kendoGrid({
        
         edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Llave");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "IdDimension");
            KdoHideCampoPopup(e.container, "IdCategoriaTalla");
            KdoHideCampoPopup(e.container, "IdUnidad");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Alto");
            KdoHideCampoPopup(e.container, "Ancho");
            KdoHideCampoPopup(e.container, "Tallas");
            KdoHideCampoPopup(e.container, "DimensionesRelativas");
            Grid_Focus(e, "IdCategoriaTalla");
           
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Llave", title: "Llave", hidden: true },
            { field: "IdRequerimiento", title: "Requerimiento", width: 160, hidden: true },
            { field: "IdDimension", title: "Dimensión", width: 160, hidden: true },
            { field: "IdCategoriaTalla", title: "Categoría talla" ,width:50, hidden:true},
            { field: "IdUnidad", title: "idUnidad", hidden: true,width:200},
            { field: "Nombre", title: "Tipo de Medida",width:200 },
            { field: "Alto", title: "Alto",width:100 },
            { field: "Ancho", title: "Ancho", width: 200 },
            { field: "AltoEstamp", title: "Alto Estampado", width: 100 },
            { field: "AnchoEstamp", title: "Ancho Estampado", width: 100 },
            { field: "Tallas", title: "Tallas" ,width:100 },
            { field: "DimensionesRelativas", title: "Dimensiones Relativas", hidden: true}
           
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gDimensiones").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 150);
    Set_Grid_DataSource($("#gDimensiones").data("kendoGrid"), dsDim, 20);
    SetGrid_CRUD_Command($("#gDimensiones").data("kendoGrid"), Permisos.SNEditar);
    
    $("#gDimensiones").getKendoGrid().one("dataBound", function (e) {
        var grid = this;

        grid.element.on('dblclick', 'tbody tr', function (e) {
            grid.editRow($(e.target).closest('tr'));
        });
        Grid_SelectRow($("#gDimensiones"), selectedRows);
        
       
    })

    $("#gDimensiones").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

  
};



let getInstrucciones = function (Url, objeto) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: Url,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdInstruccion + ",";
            });
            objeto.data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};



let getTolerancia = function (Url, objeto) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: Url,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdTolerancia + ",";
            });
            objeto.data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};


let ActualizaComentariosFicha = function () {
    kendo.ui.progress($(document.body), true);
    if (xIdOt > 0) {
        kendo.ui.progress($(document.body), true);
        //var item = e.item;
        $.ajax({
            url: UrlSolicitudProdHeader +"/"+ `${xIdOt}/${idSimulacion}/${idCotizacion}`,//
            type: "Put",
            dataType: "json",
            data: JSON.stringify({
                IdOrdenTrabajo: xIdOt,
                IdSimulacion: idSimulacion,
                IdCotizacion: idCotizacion,
                Estado: EstadoFichaProd,
                InstruccionesGen: $("#TxtInstrucciones").val(),
                InstruccionesTermo: $("#TxtComentarios").val(),
                Migracion: $('#plMigracion')[0].checked,
                Lavado: $('#plLavado')[0].checked,
                Muestra: $('#plMuestraAprobada')[0].checked,
                Trama: $('#plTrama')[0].checked,
                Placement: $('#plPlacement')[0].checked,
                IdUsuarioMod: getUser(),
                FechaMod: xFecha
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //CargarInfoEtapa(false);
                RequestEndMsg(data, "Post");
                kendo.ui.progress($(document.body), false);
            },
            error: function (data) {

                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
            }
        });
    }
};


let GuardarArtAdj = function (UrlAA, nombreFichero) {
    kendo.ui.progress($("#vistaParcial"), true);
    var XFecha = Fhoy();
    var XDescripcion = "ARCHIVO ADJUNTO";
    var XType = "Post";

    $.ajax({
        url: UrlAA,
        type: XType,
        dataType: "json",
        data: JSON.stringify({
            IdArte: xIdArte,
            Item: 0,
            NombreArchivo: nombreFichero,
            Fecha: XFecha,
            Descripcion: XDescripcion,
            Catalogo: 0,
            Placement: 0
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#GridAdjuntos").data("kendoGrid").dataSource.read();
            getAdjun(UrlApiArteAdj + "/GetVistaImagenes/" + xIdArte.toString());
            kendo.ui.progress($("#vistaParcial"), false);
            RequestEndMsg(data, XType);

        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
            ErrorMsg(data);
        }
    });
};
/*  */


let getAdjun = function (UrlAA) {
    //LLena Splitter de imagenes
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: UrlAA,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            Fn_DibujarCarrousel($("#Mycarousel"), "/Adjuntos/" + $("#NoDocumento").val() + "", respuesta);

            kendo.ui.progress($("#vistaParcial"), false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
};

let EliminarArtAdjFicha = function (UrlAA, Fn) {
    kendo.ui.progress($("#myModalAdjunto"), true);
    var eliminado = false;

    $.ajax({
        url: UrlAA,//
        type: "Post",
        data: { fileName: Fn },
        async: false,
        success: function (data) {
            kendo.ui.progress($("#myModalAdjunto"), false);
            eliminado = data.Resultado;
            eliminado = true;
        },
        error: function (data) {
            kendo.ui.progress($("#myModalAdjunto"), false);
            eliminado = false;
        }
    });

    return eliminado;
};
fPermisos = function (datos) {
    Permisos = datos;
};

