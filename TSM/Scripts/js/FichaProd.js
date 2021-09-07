"use strict";
var Permisos;
let xIdArte = 0;
let xIdSeteo = 0;
let UrlApiCAtInstrucciones = TSM_Web_APi + "CatInstrucciones";
let UrlClientesTolerancia = TSM_Web_APi + "ClientesToleranciaMedida";
let UrlSolicitudProd = TSM_Web_APi + "SolicitudProduccionesInstrucciones"; // ficha de producción
let UrlSolicitudProdTolerancia = TSM_Web_APi + "SolicitudProduccionesToleranciaMedida"; // ficha de producción
let UrlSolicitudProdHeader = TSM_Web_APi + "SolicitudProducciones";
let UrlSolicitudDimen = TSM_Web_APi + "SolicitudProduccionesDimensiones";
var xFecha = kendo.toString(kendo.parseDate(new Date()), 's');
let UrlApiAAdj = TSM_Web_APi + "ArteAdjuntos";
let UrlApiArteAdj = TSM_Web_APi + "ArteAdjuntos";
let UrlApiCT = TSM_Web_APi + "CategoriaTallas";
let UrlApiUM = TSM_Web_APi + "UnidadesMedidas";
let idcliente = "";
var reqid;
var idSimulacion;
var idCotizacion;
var EstadoFichaProd;
let xNoDocumento;
var imgCatSrc;
var imgPlaceSrc;
var imgvalue;

$(document).ready(function () {
    KdoButton($("#btnCambiarEstadoFP"), "gear");
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
    Kendo_MultiSelect($("#instruccionesCalidad"), UrlApiCAtInstrucciones + "/CALI", "Descripcion", "IdInstruccion", "Seleccione ...");
    Kendo_MultiSelect($("#ToleranciaMed"), UrlClientesTolerancia + "/" + idcliente, "Tolerancia", "IdTolerancia", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#plNombreCPT"), TSM_Web_APi + "ComposicionTelas", "Nombre", "IdComposicionTela", "Seleccione ...");

    Kendo_CmbFiltrarGrid($("#plNombrePrenda"), TSM_Web_APi + "CategoriaPrendas", "Nombre", "IdCategoriaPrenda", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#plParte"), TSM_Web_APi + "Ubicaciones", "Nombre", "IdUbicacion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#plNombreCFT"), TSM_Web_APi + "CategoriaConfecciones", "Nombre", "IdCategoriaConfeccion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#plNombreCCT"), TSM_Web_APi + "ConstruccionTelas", "Nombre", "IdConstruccionTela", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#plNombreEjecutivoCuentas"), TSM_Web_APi + "EjecutivoCuentas", "Nombre", "IdEjecutivoCuenta", "Seleccione ...");

    fn_GetOTRequerimiento();

    $('#plStrikeOff').attr('readonly', true);
    $('#plTermofijado').attr('readonly', true);


    $("#btnIrGOT").click(function () {
        window.location.href = "/ConsultarFichaOT";
    });

    // 1. configurar vista.
    Fn_VistaCambioEstado($("#vCambioEstadoFicha"), function () {
        location.reload();
    });
    // 2. boton cambio de estado.
    $("#btnCambiarEstadoFP").click(function () {

        var lstId = {
            IdOrdenTrabajo: xIdOt,
            IdSimulacion: idSimulacion,
            IdCotizacion: idCotizacion
        };
        Fn_VistaCambioEstadoMostrar("SolicitudProducciones", EstadoFichaProd, TSM_Web_APi + "SolicitudProducciones/SolicitudProducciones_CambiarEstado", "Sp_CambioEstado", lstId, undefined);
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

    $('#plEstiloDiseno').on("change", function (e) {

        ActualizaComentariosFicha();
    });

    $('#plIdDiseno').on("change", function (e) {

        ActualizaComentariosFicha();
    });

    $('#plColor').on("change", function (e) {

        ActualizaComentariosFicha();
    });


    $("#plNombreCPT").data("kendoComboBox").bind("change", function (e) {
        ActualizaComentariosFicha();
    });

    $("#plNombrePrenda").data("kendoComboBox").bind("change", function (e) {
        ActualizaComentariosFicha();
    });

    $("#plParte").data("kendoComboBox").bind("change", function (e) {
        ActualizaComentariosFicha();
    });

    $("#plNombreCFT").data("kendoComboBox").bind("change", function (e) {
        ActualizaComentariosFicha();
    });

    $("#plNombreCCT").data("kendoComboBox").bind("change", function (e) {
        ActualizaComentariosFicha();
    });

    $("#plNombreEjecutivoCuentas").data("kendoComboBox").bind("change", function (e) {
        ActualizaComentariosFicha();
    });

    //Control para subir los adjutos
    $("#Adjunto").kendoUpload({
        async: {
            saveUrl: "/RequerimientoDesarrollos/SubirArchivoAdjunto",
            autoUpload: true
        },
        select: onSelect,
        localization: {
            select: '<div class="k-icon k-i-attachment-45"></div>&nbsp;Adjuntos'
        },
        upload: function (e) {
            if (e.files[0].name.replace(e.files[0].extension, "") !== "") {
                e.sender.options.async.saveUrl = "/RequerimientoDesarrollos/SubirArchivoAdjunto/" + xNoDocumento + "/" + e.files[0].name.replace(e.files[0].extension, "");
            } else {
                $("#kendoNotificaciones").data("kendoNotification").show("Nombre del archivo no es valido", "error");
                return false;
            }
           
        },
        showFileList: false,
        success: function (e) {
            if (e.operation === "upload") {
                GuardarArtAdj(UrlApiAAdj, e.files[0].name);
            }
        }

    }); 
    function onSelect(e) {
        $.each(e.files, function (index, value) {
            value.name = value.name.replace(/[^A-Za-z0-9.]/g, "");
        });
    }
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

   
});


let fn_GetImgBase64 = function () {
    
    $.ajax({
        url: window.location.origin + "/Imagen/ImgStr",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(
            {
                imgCat: imgCatSrc,
                imgPlace: imgPlaceSrc

            }
        ),
        contentType: "application/json; charset=utf-8",
        success: function (respuesta) {
            imgvalue = respuesta;
        },
        error: function (e) {
            $("#kendoNotificaciones").data("kendoNotification").show(e, "error");
            kendo.ui.progress($(document.body), false);
        }
    });
  
};


$("#btnImprimir").click(function (e) {
    
    let paramficha = `${xIdOt},${idSimulacion},${idCotizacion}`;
   
    e.preventDefault();
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: window.location.origin + "/Reportes/ReportesCreate/",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(
            {
                rptName: "crptFichaProduccion",
                controlador: "FichaProduccion",
                accion: "GetFicha",
                id: paramficha,
                imgCat: imgvalue["imgCat"],
                imgPla: imgvalue["imgPlace"]

            }
        ),
        contentType: 'application/json; charset=utf-8',
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
        url: TSM_Web_APi + "FichaProduccion/GetInfoRequerimientoDesarrolloFicha/" + xIdOt + "/" + xIdSimu + "/" + xIdCoti,
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#plNomServicio").val(datos.NomServicio);
                $("#plFechaOrdenTrabajo").val(kendo.toString(kendo.parseDate(datos.FechaOrdenTrabajo), 'dd/MM/yyyy'));
                $("#plNodocReq").val(datos.NodocReq);
                $("#plIdCliente").val(datos.IdCliente);
                idcliente = datos.IdCliente;
                $("#plNombre").val(datos.Nombre);
                $("#plNombreDiseno").val(datos.NombreDiseno);
                $("#plEstiloDiseno").val(datos.EstiloDiseno);
                $("#plNombrePrenda").val(datos.NombrePrenda);
                $("#plNoDocumento").val(datos.NoDocumento);
                $("#plCatalogo").val(datos.NoReferencia);
                $("#plNombreCFT").val(datos.NombreCFT);
                $("#plNombreEjecutivoCuentas").val(datos.NombreEjecutivoCuentas);
                $("#plNombreTalla").val(datos.NombreTalla);
                $("#plNombreQui").val(datos.NombreQui);
                KdoCmbSetValue($("#plNombreCPT"), datos.IdComposicionTela);
                $("#plNombreCCT").val(datos.NombreCCT);
                $("#plNombreUbicacion").val(datos.NombreUbicacion);
                $("#plSolicitaTelaSustituta").val(datos.SolicitaTelaSustituta === true ? "Si" : "No");
                $("#plNombreEtapaActual").val(datos.NombreEtapaActual);
                $("#plColor").val(datos.Color);
                $("#plNombrePrograma").val(datos.NombrePrograma);
                $("#plIdDiseno").val(datos.NumeroDiseno);
                $("#plCantPiezas").val(datos.CantidadPiezas);
                $("#plParte").val(datos.NombreUbicacion);
                $("#plCombos").val(datos.CantidadCombos);
                $("#plCambioTalla").val(datos.CantidadTallas);
                $("#plMontajes").val(datos.Montajes);
                $("#plProdHora").val(datos.ProductividadHora);
                $("#plTipoLuz").val(datos.TipoLuz);
                $("#TxtInstrucciones").val(datos.InstruccionesGen);
                $("#TxtComentarios").val(datos.InstruccionesTermo);
                $("#plEstadoFichaProd").val(datos.EstadoFichaProd);
                $("#plNoDocCotizacion").val(datos.NoDocCotizacion);
                $("#plStrikeOff").prop("checked", Boolean(Number(datos.TieneStrikeOff)));
                $("#plTermofijado").prop("checked", Boolean(Number(datos.UsarTermofijado)));
                $("#plMigracion").prop("checked", Boolean(Number(datos.Migracion)));
                $("#plLavado").prop("checked", Boolean(Number(datos.Lavado)));
                $("#plPlacement").prop("checked", Boolean(Number(datos.Placement)));
                $("#plMuestraAprobada").prop("checked", Boolean(Number(datos.Muestra)));
                $("#plTrama").prop("checked", Boolean(Number(datos.Trama)));

                KdoCmbSetValue($("#plNombrePrenda"), datos.IdCategoriaPrenda);
                KdoCmbSetValue($("#plParte"), datos.IdUbicacion);
                KdoCmbSetValue($("#plNombreCFT"), datos.IdCategoriaConfeccion);
                KdoCmbSetValue($("#plNombreCCT"), datos.IdConstruccionTela);
                KdoCmbSetValue($("#plNombreEjecutivoCuentas"), datos.IdEjecutivoCuenta);

                reqid = Number(datos.IdRequerimiento);
                idSimulacion = Number(datos.IdSimulacion);
                EstadoFichaProd = datos.EstadoFichaProd;
                idCotizacion = Number(datos.IdCotizacion);
                xNoDocumento = datos.NodocReq;
                if (Number(datos.UsarTermofijado) === 1) { $("#TxtComentarios").attr("readonly", false); }
                else { $("#TxtComentarios").attr("readonly", true); }
                
                xIdArte = datos.IdArte === null ? 0 : datos.IdArte;
                xIdSeteo = datos.IdSeteoActual === null ? 0 : datos.IdSeteoActual;
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
            fn_ObtenerFichaTamanos();
            fn_ObtenerDimensiones(reqid);
            fn_TallasProducir();
            fn_ObtieneDetalleFormulaciones(xIdOt);
            let parametros = `${xIdOt},${idSimulacion},${idCotizacion}`;
            getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesProd"));
            getInstrucciones(UrlSolicitudProd + `/${parametros}`, $("#instruccionesCalidad"));
            getTolerancia(UrlSolicitudProdTolerancia + `/${parametros}`, $("#ToleranciaMed"));
            kendo.ui.progress($(document.body), false);


            if (Permisos.SNEditar === false || Permisos.SNBorrar === false || EstadoFichaProd !== 'APROBADO') {
                $('#plStrikeOff').attr('enable', false);
                //$('#plMigracion').attr('enable', false);
                KdoCheckBoxEnable($("#plMigracion"), false);
                //$('#plLavado').attr('enable', false);
                KdoCheckBoxEnable($("#plLavado"), false);
                //$('#plMuestraAprobada').attr('enable', false);//
                KdoCheckBoxEnable($("#plMuestraAprobada"), false);
                //$('#plTrama').attr('enable', false);
                KdoCheckBoxEnable($("#plTrama"), false);
                KdoCheckBoxEnable($("#plPlacement"), false);
                $("#instruccionesProd").data("kendoMultiSelect").enable(false);
                $("#instruccionesCalidad").data("kendoMultiSelect").enable(false);
                //$("#TxtInstrucciones").attr("enable", false);

                TextBoxEnable($("#TxtInstrucciones"), false);
                $("#ToleranciaMed").data("kendoMultiSelect").enable(false);
             
                TextBoxEnable($("#plEstiloDiseno"), false);
                TextBoxEnable($("#plColor"), false);

                Grid_HabilitaToolbar($("#gDimensiones"), false, false, false);
                Grid_HabilitaToolbar($("#gSolicitudProdDimension"), false, false, false);
                Grid_HabilitaToolbar($("#gTallasProducir"), false, false, false);
                KdoComboBoxEnable($("#plNombreCPT"), false);

                KdoComboBoxEnable($("#plNombrePrenda"),false);
                KdoComboBoxEnable($("#plParte"), false);
                KdoComboBoxEnable($("#plNombreCFT"),false);
                KdoComboBoxEnable($("#plNombreCCT"), false);
                KdoComboBoxEnable($("#plNombreEjecutivoCuentas"), false);
                TextBoxEnable($("#plIdDiseno"), false);
             
            }
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
             
            var imgCatologo = document.querySelector('#Mycarouselwp0');
            imgCatologo.addEventListener('load', function (event) {
                var base64image = getDataUrl(event.currentTarget);
                imgPlaceSrc = $('#Mycarouselwp0').attr('src');
                imgCatSrc = $('#Mycarousel0').attr('src');
                imgvalue = fn_GetImgBase64();

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
    return canvas.toDataURL();
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
                    SedaNombre: { type: "string" },
                    NomTipoTinta: { type: "string" },
                    IdQuimica: { type: "number" },
                    QuimicaNombre: { type: "string" }
                   
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
            { field: "NomTipoTinta", title: "Tipo tinta" },
            { field: "IdQuimica", title: "IdQuimica", hidden: true },
            { field: "QuimicaNombre", title: "Química" },
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

//Funcion para construir para obtener detalle de formulas
let fn_ObtieneDetalleFormulaciones = function () {
    var dsetMar = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "FichaProduccion/GetFichaProduccionFormulaciones/" + xIdOt; },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        group: {
            field: "Estacion"
        },
        schema: {
            model: {
                id: "OT",
                fields: {
                    OT: { type: "string" },
                    Nombre: { type: "string" },
                    Estacion: { type: "number" },
                    Quimica: { type: "string" },
                    Letra: { type: "string" },
                    CodArticulo: { type: "string" },
                    Articulo: { type: "string" },
                    Porcentaje: { type: "number" },
                    Estado: { type: "string" },
                    MasaEntregada: { type: "number" }
                }
            }
        }
    });
    //CONFIGURACION DEL gDetalleFormulaciones,CAMPOS
    $("#gDetalleFormulaciones").kendoGrid({
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "OT", title: "OT", hidden: true },
            { field: "Estacion", title: "Estación", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Quimica", title: "Química" },
            { field: "Letra", title: "Letra" },
            { field: "CodArticulo", title: "Cod. Artículo" },
            { field: "Articulo", title: "Artículo" },
            { field: "Porcentaje", title: "Porcentaje", values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}"},
            { field: "Estado", title: "Estado", hidden: true},
            { field: "MasaEntregada", title: "Masa Entregada", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gDetalleFormulaciones").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gDetalleFormulaciones").data("kendoGrid"), dsetMar);
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
                    Nombre: {type:"string"},
                    IdUnidad: { type: "number" },
                    Nombre1: { type: "string" },
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
            KdoHideCampoPopup(e.container, "Nombre1");
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
            { field: "IdCategoriaTalla", title: "Categoría talla", width: 50, hidden: true },
            { field: "Nombre", title: "Tamaño", width: 200 },
            { field: "IdUnidad", title: "idUnidad", hidden: true,width:200},
            { field: "Nombre1", title: "Tipo de Medida",width:200 },
            { field: "Alto", title: "Alto", width: 100, hidden: true, menu: false},
            { field: "Ancho", title: "Ancho", width: 200, hidden: true, menu: false },
            { field: "AltoEstamp", title: "Alto Estampado", width: 100 },
            { field: "AnchoEstamp", title: "Ancho Estampado", width: 100 },
            { field: "Tallas", title: "Tallas", width: 100, hidden: true,menu:false },
            { field: "DimensionesRelativas", title: "Dimensiones Relativas", hidden: true}
           
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gDimensiones").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false,redimensionable.Si, 0);
    Set_Grid_DataSource($("#gDimensiones").data("kendoGrid"), dsDim, 20);
    SetGrid_CRUD_Command($("#gDimensiones").data("kendoGrid"), Permisos.SNEditar);
    
    $("#gDimensiones").getKendoGrid().one("dataBound", function (e) {
        var grid = this;

        grid.element.on('dblclick', 'tbody tr', function (e) {
            grid.editRow($(e.target).closest('tr'));
        });
        Grid_SelectRow($("#gDimensiones"), selectedRows);


    });

    $("#gDimensiones").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

};

let fn_ObtenerFichaTamanos = function (req) {
    var dsDimTamaño = new kendo.data.DataSource({

        transport: {
            read: {

                url: function (datos) { return UrlSolicitudDimen + "/GetVista/" + `${xIdOt}/${idSimulacion}/${idCotizacion}`; },
                contentType: "application/json; charset=utf-8"

            },
            update: {
                url: function (datos) { return UrlSolicitudDimen + "/" + datos.IdOrdenTrabajo.toString() + "/" + datos.IdSimulacion.toString() + "/" + datos.IdCotizacion.toString() + "/" + datos.IdCategoriaTalla.toString(); },
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (datos) {
                    datos.success(result);
                }
            },
            destroy: {
                url: function (datos) { return UrlSolicitudDimen + "/" + datos.IdOrdenTrabajo.toString() + "/" + datos.IdSimulacion.toString() + "/" + datos.IdCotizacion.toString() + "/" + datos.IdCategoriaTalla.toString(); },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlSolicitudDimen,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "update") {
                $("#gTallasProducir").data("kendoGrid").dataSource.read();
            }
        },
        // VALIDAR ERROR
        error: Grid_error,
        schema: {
            model: {
                id: "IdCategoriaTalla",
                fields: {
                    IdOrdenTrabajo: {
                        type: "number",
                        defaultValue: function () {
                            return xIdOt;
                        }
                    },
                    IdSimulacion: {
                        type: "number",
                        defaultValue: function () {
                            return idSimulacion;
                        }
                    },
                    IdCotizacion: {
                        type: "number",
                        defaultValue: function () {
                            return idCotizacion;
                        }
                    },
                    IdCategoriaTalla: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    IdUnidad: {
                        type: "string", defaultValue: 5
                    },
                    Abreviatura: {
                        type: "string"
                    },
                    Alto: {
                        type: "number",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Tallas']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200.");
                                    return input.val().length <= 200;
                                }
                                if (input.is("[name='Alto']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Alto']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Ancho']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return  $("[name='Ancho']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='IdCategoriaTalla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaTalla").data("kendoComboBox").selectedIndex >= 0;
                                }
                                //if (input.is("[name='CantidadPiezas']")) {
                                //    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                //    return $("[name='CantidadPiezas']").data("kendoNumericTextBox").value() > 0;
                                //}
                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                               
                                return true;
                            }
                        }
                    },
                    Ancho: {
                        type: "number"
                    },
                    Tallas: {
                        type: "string"
                    },
                    DesarrollarTalla: {
                        type: "bool"
                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function (e) { return null; }
                  
                    },
                    IdDimension: {
                        type: "number", defaultValue: function (e) { return null; }
                    }
                }
            }
        },
        aggregate: [
            { field: "CantidadPiezas", aggregate: "sum" }
        ],
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    var selectedTamno = [];
    $("#gSolicitudProdDimension").kendoGrid({

        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdOrdenTrabajo");
            KdoHideCampoPopup(e.container, "IdSimulacion");
            KdoHideCampoPopup(e.container, "IdCotizacion");
            KdoHideCampoPopup(e.container, "Abreviatura");
            KdoHideCampoPopup(e.container, "Nombre");
            //KdoHideCampoPopup(e.container, "IdUnidad");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdCategoriaTalla");
            }

        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [

            { field: "IdOrdenTrabajo", title: "cod. Orden trabajo", hidden: true },
            { field: "IdSimulacion", title: "Cod. Simulación", hidden: true },
            { field: "IdCotizacion", title: "cod. Cotización", hidden: true },
            { field: "IdCategoriaTalla", title: "Cod. Talla", editor: Grid_Combox, values:["IdCategoriaTalla", "Nombre", UrlApiCT, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Nombre", title: "Tamaño" },
            { field: "Tallas", title: "Rango de Tallas" },
            { field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "IdUnidad", title: "Unidad",  editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlApiUM, "", "Seleccione...", "required", "", "Requerido"]},
            { field: "Abreviatura", title: "Unidad de Medida" },
            { field: "CantidadPiezas", title: "Cantidad Piezas", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "#", 0], format: "{0:n0}", footerTemplate: "Total: #: data.CantidadPiezas ? kendo.format('{0:n0}',sum ): 0 #"}
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gSolicitudProdDimension").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gSolicitudProdDimension").data("kendoGrid"), dsDimTamaño, 20);
    SetGrid_CRUD_ToolbarTop($("#gSolicitudProdDimension").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gSolicitudProdDimension").data("kendoGrid"), Permisos.SNEditar, false);

   

    $("#gSolicitudProdDimension").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gSolicitudProdDimension"), selectedTamno);
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
            if (respuesta !== null) {
                $.each(respuesta, function (index, elemento) {
                    lista = lista + elemento.IdTolerancia + ",";
                });
                objeto.data("kendoMultiSelect").value(lista.split(","));
            }
           
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
            url: UrlSolicitudProdHeader + "/" + `${xIdOt}/${idSimulacion}/${idCotizacion}`,//
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
                FechaMod: xFecha,
                ColorTela: $("#plColor").val(),
                EstiloDiseno: $("#plEstiloDiseno").val(),
                IdComposicionTela: KdoCmbGetValue($("#plNombreCPT")),
                IdCategoriaPrenda: KdoCmbGetValue($("#plNombrePrenda")),
                IdUbicacion: KdoCmbGetValue($("#plParte")),
                IdCategoriaConfeccion: KdoCmbGetValue($("#plNombreCFT")),
                IdConstruccionTela: KdoCmbGetValue($("#plNombreCCT")),
                IdEjecutivoCuenta: KdoCmbGetValue($("#plNombreEjecutivoCuentas")),
                NumeroDiseno: $("#plIdDiseno").val()
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


let fn_DibujarSeccionMaqui = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/" + xIdSeteo,
        type: 'GET',
        success: function (datos) {
            //if (datos !== null) {
            maq = fn_GetMQ(datos.IdEtapaProceso, datos.Item);
            $("#maquinaConsultaOT").maquinaSerigrafia({
                maquina: {
                    data: maq,
                    formaMaquina: maq[0].NomFiguraMaquina,
                    cantidadBrazos: maq[0].CantidadEstaciones
                }
            });
            //}
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
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};

fPermisos = function (datos) {
    Permisos = datos;
};

//* TALLAS A PRODUCIR

let fn_TallasProducir = function (req) {
    var dsDimTamaño = new kendo.data.DataSource({

        transport: {
            read: {

                url: function (datos) { return TSM_Web_APi + "SolicitudProduccionesOrdenesTrabajos/GetTallasOT/" + `${xIdOt}/${idSimulacion}/${idCotizacion}`; },
                contentType: "application/json; charset=utf-8"

            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SolicitudProduccionesOrdenesTrabajos/" + datos.IdOrdenTrabajo.toString() + "/" + datos.IdSimulacion.toString() + "/" + datos.IdCotizacion.toString() + "/" + datos.IdOrdenTrabajoProduccion.toString(); },
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (datos) {
                    datos.success(result);
                }
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SolicitudProduccionesOrdenesTrabajos/" + datos.IdOrdenTrabajo.toString() + "/" + datos.IdSimulacion.toString() + "/" + datos.IdCotizacion.toString() + "/" + datos.IdOrdenTrabajoProduccion.toString(); },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SolicitudProduccionesOrdenesTrabajos",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "update") {
                $("#gSolicitudProdDimension").data("kendoGrid").dataSource.read();
            }
           
        },
        // VALIDAR ERROR
        error: Grid_error,
        schema: {
            model: {
                id: "IdOrdenTrabajoProduccion",
                fields: {
                    IdOrdenTrabajo: {
                        type: "number",
                        defaultValue: function () {
                            return xIdOt;
                        }
                    },
                    IdSimulacion: {
                        type: "number",
                        defaultValue: function () {
                            return idSimulacion;
                        }
                    },
                    IdCotizacion: {
                        type: "number",
                        defaultValue: function () {
                            return idCotizacion;
                        }
                    },
                    IdOrdenTrabajoProduccion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdOrdenTrabajoProduccion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdOrdenTrabajoProduccion").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdCategoriaTalla: {
                        type: "number"
                    },
                    IdDimension: {
                        type: "number"
                    },
                    Tamano: {
                        type: "string"
                    },
                    NoDocumentoPro: {
                        type: "string"
                    }
                }
            }
        },
        aggregate: [
            { field: "CantidadPiezas", aggregate: "sum" }
        ]
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    var selectOTTamano = [];
    $("#gTallasProducir").kendoGrid({

        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdOrdenTrabajo");
            KdoHideCampoPopup(e.container, "IdSimulacion");
            KdoHideCampoPopup(e.container, "IdCotizacion");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "IdCategoriaTalla");
            KdoHideCampoPopup(e.container, "IdDimension");
            KdoHideCampoPopup(e.container, "Tamano");
          
            KdoHideCampoPopup(e.container, "NoDocumentoPro");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdOrdenTrabajoProduccion");
            } else {
                 KdoHideCampoPopup(e.container, "Tallas");
            }
     
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [

            { field: "IdOrdenTrabajo", title: "cod. Orden trabajo", hidden: true },
            { field: "IdSimulacion", title: "Cod. Simulación", hidden: true },
            { field: "IdCotizacion", title: "cod. Cotización", hidden: true },
            {
                field: "IdOrdenTrabajoProduccion", title: "Orden de Trabajo", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSelecionSolicitudProdOT(xIdOt);
                }
            },
            { field: "IdRequerimiento", title: "cod. Id Requerimiento", hidden: true },
            { field: "IdCategoriaTalla", title: "cod. Categoria Talla", hidden: true },
            { field: "IdDimension", title: "cod. Dimension", hidden: true },
            { field: "NoDocumentoPro", title: "No Orden Trabajo" },
            { field: "Tamano", title: "Tamaño" },
            { field: "Tallas", title: "Rango de Tallas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gTallasProducir").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gTallasProducir").data("kendoGrid"), dsDimTamaño, 20);
    SetGrid_CRUD_ToolbarTop($("#gTallasProducir").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gTallasProducir").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);



    $("#gTallasProducir").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gTallasProducir"), selectOTTamano);
    });

};
