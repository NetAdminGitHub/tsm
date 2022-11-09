let UrlApiServ = TSM_Web_APi + "Servicios";
let UrlApiClient = TSM_Web_APi + "Clientes";
let UrlApiSisT = TSM_Web_APi + "sistematintas";
let UrlApiPro = TSM_Web_APi + "Programas";
let UrlApiBoards = TSM_Web_APi + "Boards";
let UrlApiCPre = TSM_Web_APi + "CategoriaPrendas";
let UrlApiCConfec = TSM_Web_APi + "CategoriaConfecciones";
let UrlApiUEstam = TSM_Web_APi + "Ubicaciones";
let UrlApiConsTela = TSM_Web_APi + "ConstruccionTelas";
let UrlApiCompTela = TSM_Web_APi + "ComposicionTelas";
let UrlApiP = TSM_Web_APi + "Prendas";
let UrlApiArte = TSM_Web_APi + "Artes";
let UrlApiArteAdj = TSM_Web_APi + "ArteAdjuntos";
let UrlApiAAdj = TSM_Web_APi + "ArteAdjuntos";
let UrlRD = TSM_Web_APi + "RequerimientoDesarrollos";
let UrlApiTD = TSM_Web_APi + "Dimensiones";
let UrlApiCT = TSM_Web_APi + "CategoriaTallas";
let UrlApiUM = TSM_Web_APi + "UnidadesMedidas";
let UrlReqDesTec = TSM_Web_APi + "RequerimientoDesarrollosTecnicas";
let UrlApiVTec = TSM_Web_APi + "Tecnicas";
let UrlAD = TSM_Web_APi + "AnalisisDisenos";
let UrlRtin = TSM_Web_APi + "RequerimientoTintas";
let UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
let UrlEP = TSM_Web_APi + "EtapasProcesos";
let UrlApiCoTec = TSM_Web_APi + "CostoTecnicas";
let UrlTL = TSM_Web_APi + "TiposLuces";
let UrlMD = TSM_Web_APi + "MotivosDesarrollos";
let UrlTA = TSM_Web_APi + "TiposAcabados";
let UrlColor = TSM_Web_APi + "RequerimientoDesarrollosColores";
let UrlTMues = TSM_Web_APi + "TipoMuestras";
let UrlQuimi = TSM_Web_APi + "Quimicas";

var Permisos;
let xvUrl = "", xvId = "";
let vIdS = 0;
let vIdCli = 0;
let VarIDReq = 0;

$(document).ready(function () {
    // carga carrousel de imagenes 

    var DivCarousel = $("#Div_Carousel");
    DivCarousel.append(Fn_Carouselcontent());
    $("#idcloseMod").click(function () {
        $("#myModal").modal('toggle');
        $("#myModal").modal('hide');
    });
    //#region Inicialización de variables y controles Kendo
    KdoButton($("#btnIrOrdeTrabajoSublimacion"), "hyperlink-open-sm", "Ir a Ordenes de Trabajo");
    KdoButton($("#Guardar"), "save", "Guardar");
    KdoButton($("#Eliminar"), "delete", "Borrar");
    KdoButton($("#btnCambiarEstado"), "gear","Cambiar estado");
    KdoButtonEnable($("#Eliminar"), fn_SNBorrar(false));
    KdoButtonEnable($("#btnCambiarEstado"), fn_SNProcesar(false));
    KdoButton($("#myBtnAdjunto"), "attachment", "Adjuntar Diseños");
    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnCerrarAdj"), "close-circle", "Cerrar");
    // deshabilitar botones en formulario
    $("#myBtnAdjunto").data("kendoButton").enable(false);
    $("#Fecha").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    PanelBarConfig($("#BarPanel"));
    KdoDatePikerEnable($("#Fecha"), false);
    $('#chkRegistroCompletado').prop('checked', 0);
 
    // codigo de programas para el splitter
    //*******************************************************************

    $("#CntPiezas").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtCantidadSTrikeOff").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtStrikeOffAdicional").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#Combo").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#TxtNoVeces").kendoNumericTextBox({
        size: "large",
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 1,
        max: 99,
        min: 1
    });


    // se utiliza pra validar formularios
    let ValidRD = $("#ReqDes").kendoValidator(
        {
            rules: {
                MsgCmbIdPrograma: function (input) {
                    if (input.is("[name='IdPrograma']")) {
                        return $("#IdPrograma").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbIdUnidadMedidaCantidad: function (input) {
                    if (input.is("[name='CmbIdUnidadMedidaCantidad']")) {
                        return $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },

                ColorRuler: function (input) {
                    if (input.is("[name='Color']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                MsgIdCategoriaConfeccion: function (input) {
                    if (input.is("[name='IdCategoriaConfeccion']")) {
                        return $("#IdCategoriaConfeccion").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgIdConstruccionTela: function (input) {
                    if (input.is("[name='IdConstruccionTela']")) {
                        return $("#IdConstruccionTela").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgIdComposicionTela: function (input) {
                    if (input.is("[name='IdComposicionTela']")) {
                        return $("#IdComposicionTela").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },

                NombreRuler: function (input) {
                    if (input.is("[name='Nombre']")) {
                        return input.val().length > 0 && input.val().length <= 200;
                    }
                    return true;
                },
                NumeroDisenoRuler: function (input) {
                    if (input.is("[name='NumeroDiseno']")) {
                        return input.val().length > 0 && input.val().length <= 200;
                    }
                    return true;
                },
                EstiloDisenoRuler: function (input) {
                    if (input.is("[name='EstiloDiseno']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                InstruccionesEspeciales: function (input) {
                    if (input.is("[name='InstruccionesEspeciales']")) {
                        return input.val().length <= 2000;
                    }
                    return true;
                },
                TxtDirectorioArchivosRuler: function (input) {
                    if (input.is("[name='TxtDirectorioArchivos']")) {
                        return input.val().length > 0 && input.val().length <= 2000;
                    }
                    return true;
                },
                partespren: function (input) {
                    if (input.is("[name='IdPartesDet']")) {
                        return $("#IdPartesDet").data("kendoMultiSelect").value().length >0;
                    }
                    return true;
                },
                vprenda: function (input) {
                    if (input.is("[name='IdCategoriaPrenda']")) {
                        return $("#IdCategoriaPrenda").data("kendoMultiSelect").value().length >0;
                    }
                    return true;
                }


            },
            messages: {
                //Mayor0: "Debe ser mayor a 0",
                MsgLongitud: "Debe ser mayor a 0",
                required: "Requerido",
                MsgCmbPro: "Requerido",
                MsgCmbIdPrograma: "Requerido",
                MsgCmbIdUnidadMedidaCantidad: "Requerido",
                ColorRuler: "Longitud máxima del campo es 200",
                MsgIdCategoriaConfeccion: "Requerido",
                MsgIdComposicionTela: "Requerido",
                MsgIdConstruccionTela: "Requerido",
                NombreRuler: "Longitud máxima del campo es 200",
                NumeroDisenoRuler: "Longitud máxima del campo es 200",
                EstiloDisenoRuler: "Longitud máxima del campo es 200",
                InstruccionesEspeciales: "Longitud máxima del campo es 2000",
                TxtDirectorioArchivosRuler: "Longitud máxima del campo es 2000",
                partespren: "Requerido",
                vprenda: "Requerido"
            }
        }
    ).data("kendoValidator");



    Kendo_CmbFiltrarGrid($("#IdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un Servicio ....");
    $("#IdServicio").data("kendoComboBox").wrapper.hide();
    KdoCmbSetValue($("#IdServicio"), 2);

    Kendo_CmbFiltrarGrid($("#IdCliente"), UrlApiClient, "Nombre", "IdCliente", "Seleccione un Cliente ....");
    KdoComboBoxEnable($("#IdCliente"), false);
    KdoCmbSetValue($("#IdCliente"), SublimacionIdCliente);

    fn_KdoCmbProgramas($("#IdPrograma"), TSM_Web_APi + "Programas/GetByCliente/" + SublimacionIdCliente, "Nombre", "IdPrograma", "Seleccione ...", "", "", "", "fn_CreaPrograma");
    Kendo_MultiSelect($("#IdCategoriaPrenda"), UrlApiCPre, "Nombre", "IdCategoriaPrenda", "Seleccione ...");
    Kendo_MultiSelect($("#IdPartesDet"), TSM_Web_APi + "Ubicaciones", "Nombre", "IdUbicacion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdCategoriaConfeccion"), UrlApiCConfec, "Nombre", "IdCategoriaConfeccion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdConstruccionTela"), UrlApiConsTela, "Nombre", "IdConstruccionTela", "Seleccione ...");
    KdoCmbComboBox($("#IdComposicionTela"), UrlApiCompTela, "Nombre", "IdComposicionTela", "Seleccione ...", "", "", "", "CmbNuevoItem");

    //solicita tela sustituta

    //#region CmbIdUnidadMedidaCantidad
    $("#CmbIdUnidadMedidaCantidad").kendoComboBox({
        dataTextField: "Abreviatura",
        dataValueField: "IdUnidad",
        autoWidth: true,
        filter: "contains",
        autoBind: false,
        clearButton: true,
        placeholder: "Seleccione...",
        height: 550,
        dataSource: fn_DSIdUnidadByGrupo(1) //para factura de sublimacion
    });
    KdoCmbSetValue($("#CmbIdUnidadMedidaCantidad"), 9);
    //#endregion fin CmbIdUnidadMedidaCantidad

    TextBoxEnable($("#Estado"), false);
    //HabilitaFormObje(false);

    //#endregion FIN Inicialización de variables y controles Kendo

    //#region CRUD manejo de requerimiento de Desarrollo

    $("#Guardar").click(function (event) {
        event.preventDefault();
        if (ValidRD.validate()) {
            fn_GuardarRequerimientoSublimacion(UrlRD);
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });
    $("#Eliminar").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("Está seguro que desea eliminar el registro", function () { return fn_EliminarReqSublimacion(); });
    });

    //#region Cambiar esatado
    $("#TxtMotivo").autogrow({ vertical: true, horizontal: false, flickering: false });
    KdoComboBoxbyData($("#cmbEstados"), "[]", "Nombre", "EstadoSiguiente", "Seleccione un estado");
    KdoButton($("#btnAceptarCambiar"), "check", "Cambiar Estado");
    $("#ModalCambioEstado").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Cambio de estado",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    $("#btnCambiarEstado").click(function () {
        KdoCmbSetValue($("#cmbEstados"), "");
        $("#TxtMotivo").val("");
        $("#cmbEstados").data("kendoComboBox").setDataSource(fn_EstadosSiguientesSublimado($("#Estado").val()));
        $("#ModalCambioEstado").data("kendoDialog").open().toFront();
    });

    let ValidCambiar = $("#FrmModalCambioEstado").kendoValidator(
        {
            rules: {
                vcmbEstados: function (input) {
                    if (input.is("[name='cmbEstados']")) {
                        return $("#cmbEstados").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                mtv: function (input) {
                    if (input.is("[name='TxtMotivo']") && $("#Estado").val()!=="EDICION") {
                        return input.val().length>0 && input.val().length <= 2000;
                    }
                    return true;
                }
              
            },
            messages: {
                vcmbEstados: "Requerido",
                mtv: "Requerido"
            }
        }
    ).data("kendoValidator");

    $("#btnAceptarCambiar").click(function () {
        if (ValidCambiar.validate()) {

            kendo.ui.progress($(".k-dialog"), true);
            $.ajax({
                url: TSM_Web_APi + "RequerimientoDesarrollos/RequerimientoDesarrollos_CambiarEstadoSublimacion",
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdRequerimiento: SublimacionIdReque,
                    EstadoSiguiente: KdoCmbGetValue($("#cmbEstados")),
                    Motivo: $("#TxtMotivo").val(),
                    StringIdRequerimiento: ""
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    fn_RequerimientoCambios();
                    fn_getRD();
                    $("#ModalCambioEstado").data("kendoDialog").close();
                    RequestEndMsg(data, "Post");
                },
                error: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    ErrorMsg(data);
                }
            });
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });
    //#endregion


    $("#btnIrOrdeTrabajoSublimacion").click(function () {
        window.location.href = "/SublimacionOrdenesTrabajos";
    });

    //#endregion FIN CRUD manejo de requerimiento de Desarrollo


    //#region CRUD Manejo de Arte


    //#endregion FIN CRUD Manejo de Arte

    //#region CRUD Manejo de Arte Adjuntos

    //Control para subir los adjutos
    $("#Adjunto").kendoUpload({
        async: {                                                                    
            saveUrl: "/RequerimientoDesarrollos/SubirArchivoSublimacion",
            autoUpload: true
        },
        localization: {
            select: '<div class="k-icon k-i-attachment-45"></div>&nbsp;Adjuntos'
        },
        upload: function (e) {
            e.sender.options.async.saveUrl = "/RequerimientoDesarrollos/SubirArchivoSublimacion/" + $("#NoDocumento").val();
        },
        showFileList: false,
        success: function (e) {
            if (e.response.Resultado === true) {
                if (e.operation === "upload") {
                    GuardarArtAdj(UrlApiAAdj, e.files[0].name);
                }
            } else {
                $("#kendoNotificaciones").data("kendoNotification").show(e.response.Msj, "error");
            }
        }

    });


    let fn_LeerImagen = function (event, blobs) {
        kendo.ui.progress($(document.body), true);

        var nombreArchivo = 'Recorte_' + kendo.toString(kendo.parseDate(new Date()), 'yyyyMMdd_HHmmss') + '.' + blobs[0].name.split('.')[1];
        var form = new FormData();
        form.append("Adjunto", blobs[0], nombreArchivo);

        $.ajax({
            url: "/RequerimientoDesarrollos/SubirArchivo/" + $("#NoDocumento").val(),//
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            cache: false,
            //dataType: "json",
            success: function (data) {
                GuardarArtAdj(UrlApiAAdj, nombreArchivo);
                kendo.ui.progress($(document.body), false);
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
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
                url: function (datos) { return UrlApiAAdj + "/GetByArte/" + $("#IdArte").val().toString(); },
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
                    if (EliminarArtAdj("/RequerimientoDesarrollos/BorrarArchivo/" + $("#NoDocumento").val(), datos.NombreArchivo)) {
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
            if (e.type === "destroy") { getAdjun(UrlApiArteAdj + "/GetByArte/" + $("#IdArte").val()); }

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
                        type: "number", defaultValue: function () { return $("#IdArte").val(); }
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
                                return true;
                            }
                        }
                    },
                    Catalogo: { type: "bool" }
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
            Grid_Focus(e, "Descripción");
        },
        columns: [
            { field: "Id", title: "ID", hidden: true },
            { field: "IdArte", title: "IdArte", hidden: true },
            { field: "Item", title: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "NombreArchivo", title: "Nombre del Archivo", template: function (data) { return "<a href='/Adjuntos/" + $("#NoDocumento").val() + "/" + data["NombreArchivo"] + "' target='_blank' style='text-decoration: underline;'>" + data["NombreArchivo"] + "</a>"; } },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "Descripcion", title: "Descripción" },
            { field: "Catalogo", title: "Catalogo ?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Catalogo"); } }
        ]
    });

    SetGrid($("#GridAdjuntos").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true);
    SetGrid_CRUD_ToolbarTop($("#GridAdjuntos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GridAdjuntos").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GridAdjuntos").data("kendoGrid"), DsAdj);

    //#endregion Fin Manejo de Adjunto

    //#region CRUD Prendas multi select

    $("#IdCategoriaPrenda").data("kendoMultiSelect").bind("deselect", function (e) {
        if ($("#IdRequerimiento").val() > 0) {

            kendo.ui.progress($(document.body), true);
            url = UrlApiP + "/" + e.dataItem.IdCategoriaPrenda + "/" + $("#IdRequerimiento").val().toString();
            $.ajax({
                url: url,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    fn_getPrendaParteMultiSelec();
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });

        }

    });

    $("#IdCategoriaPrenda").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($(document.body), true);
            //var item = e.item;
            $.ajax({
                url: UrlApiP,//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdRequerimiento: $("#IdRequerimiento").val(),
                    IdCategoriaPrenda: e.dataItem.IdCategoriaPrenda
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {
                    fn_getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + $("#IdRequerimiento").val());
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin Prendas multi select

    //#region CRUD Partes multi select

    $("#IdPartesDet").data("kendoMultiSelect").bind("deselect", function (e) {
        if ($("#IdRequerimiento").val() > 0) {

            kendo.ui.progress($(document.body), true);
            url = TSM_Web_APi + "PrendasPartes/" + $("#IdRequerimiento").val().toString() + "/" + ($("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === "" || $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === undefined ? 0 : $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0]) +"/" + e.dataItem.IdUbicacion ;
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
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });

        }

    });

    $("#IdPartesDet").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($(document.body), true);
            //var item = e.item;
            $.ajax({
                url: TSM_Web_APi +"PrendasPartes",//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdRequerimiento: $("#IdRequerimiento").val(),
                    IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0],
                    IdUbicacion:  e.dataItem.IdUbicacion,
                    Cantidad: 0,
                    Precio: 0,
                    IdUnidad: KdoCmbGetValue($("#CmbIdUnidadMedidaCantidad")) === null ? 9 : KdoCmbGetValue($("#CmbIdUnidadMedidaCantidad"))
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(document.body), false);
                },
                error: function (data) {
                    fn_getPrendaParteMultiSelec();
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin Prendas multi select
    $("#IdRequerimiento").val($("#txtId").val());
    $("#UbicacionVer").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#UbicacionHor").autogrow({ vertical: true, horizontal: false, flickering: false });
    fn_RequerimientoCambios();
    fn_getRD();

    if (SublimacionIdReque === 0) {
        $("#IdRequerimiento").val(SublimacionIdReque);
        HabilitaFormObje(true);
        Grid_HabilitaToolbar($("#gCambios"), false, false, false);
        KdoCmbFocus($("#IdPrograma"));
       
    }
   
});




//#region Metodos Generales

let fn_getRD = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/GetRequerimientoDesarrollos_SublimacionOrdenesTrabajos/" + SublimacionIdReque.toString(),
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (respuesta) {

            $.each(respuesta, function (index, elemento) {
                //asignacion de valores a campos en vistas
                $("#IdRequerimiento").val(elemento.IdRequerimiento);
                //$("#IdUbicacion").data("kendoComboBox").value(elemento.IdUbicacion);
                $("#IdPrograma").data("kendoComboBox").value(elemento.IdPrograma);
                $("#NoDocumento").val(elemento.NoDocumento);
                $("#IdModulo").val(elemento.IdModulo);
                $("#IdSolicitudDisenoPrenda").val(elemento.IdSolicitudDisenoPrenda);
                $("#TxtEjecutivoCuenta").val(elemento.Nombre8);
                $("#IdEjecutivoCuenta").val(elemento.IdEjecutivoCuenta);
                $("#InstruccionesEspeciales").val(elemento.InstruccionesEspeciales);
                $("#CntPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
                $("#TxtCantidadSTrikeOff").data("kendoNumericTextBox").value(elemento.CantidadStrikeOff);
                $("#TxtStrikeOffAdicional").data("kendoNumericTextBox").value(elemento.StrikeOffAdicional);
                $("#Fecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha), 'dd/MM/yyyy'));
                $("#Estado").val(elemento.Estado);
                $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(elemento.IdUnidadMedidaCantidad);
                $("#TallaPrincipal").val(elemento.TallaPrincipal);
                $("#IdCategoriaConfeccion").data("kendoComboBox").value(elemento.IdCategoriaConfeccion);
                $("#IdConstruccionTela").data("kendoComboBox").value(elemento.IdConstruccionTela);
                $("#IdComposicionTela").data("kendoComboBox").value(elemento.IdComposicionTela);
                $("#UbicacionHor").val(elemento.UbicacionHorizontal);
                $("#UbicacionVer").val(elemento.UbicacionVertical);
                $("#TxtColorTela").val(elemento.Color);
                $('#chkRegistroCompletado').prop('checked', elemento.RegistroCompletado);
                //consultar grid
                VarIDReq = elemento.IdRequerimiento;
                //habiliar en objetos en las vistas
                $("#Guardar").data("kendoButton").enable(fn_SNAgregar(elemento.Estado === "EDICION" ? true : false));
                $("#btnCambiarEstado").data("kendoButton").enable(fn_SNProcesar(elemento.Estado !== "APROBADO" ? true : false));
                KdoButtonEnable($("#Eliminar"), fn_SNBorrar(elemento.Estado === "EDICION" ? true : false));
                HabilitaFormObje(elemento.Estado === "EDICION" ? true : false);
                KdoCheckBoxEnable($("#chkRegistroCompletado"), elemento.Estado === "EDICION" ? elemento.RegistroCompletado === true ? false : true : false);
                $("#gCambios").data("kendoGrid").dataSource.read();
                elemento.Estado === "EDICION" ? Grid_HabilitaToolbar($("#gCambios"), Permisos.SNAgregar, false, false) : Grid_HabilitaToolbar($("#gCambios"), false, false, false);
                // foco en la fecha
                KdoCmbFocus($("#IdPrograma"));
               
            });


            kendo.ui.progress($(document.body), false);
            getArte(UrlApiArte + "/GetArteByIdReq/" + VarIDReq.toString(), UrlApiArteAdj);
            fn_getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + VarIDReq.toString());


        },
        error: function () {
            kendo.ui.progress($(document.body), false);

        }
    });
};

let getArte = function (UrlArt, UrlApiArteAdj) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: UrlArt,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                $("#IdArte").val(respuesta.IdArte);
                $("#Nombre").val(respuesta.Nombre);
                $("#EstiloDiseno").val(respuesta.EstiloDiseno);
                $("#NumeroDiseno").val(respuesta.NumeroDiseno);
                $("#TxtDirectorioArchivos").val(respuesta.DirectorioArchivos);
                $("#IdCatalogoDiseno").val(respuesta.IdCatalogoDiseno);
                $("#NoReferencia").val(respuesta.NoReferencia);
                kendo.ui.progress($(document.body), false);
                UrlApiArteAdj = UrlApiArteAdj + "/GetByArte/" + respuesta.IdArte;
                getAdjun(UrlApiArteAdj);
                $("#Adjunto").data("kendoUpload").enable($("#Estado").val() !== "EDICION" ? false : true);
                $("#Estado").val() !== "EDICION" ? Grid_HabilitaToolbar($("#GridAdjuntos"), false, false, false) : Grid_HabilitaToolbar($("#GridAdjuntos"), false, true, true);

                KdoButtonEnable($("#myBtnAdjunto"),true);
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();

            } else {
                LimpiarArte();
                Fn_LeerImagenes($("#Mycarousel"), "", null);
                kendo.ui.progress($(document.body), false);
                $("#Adjunto").data("kendoUpload").enable(false);
                $("#myBtnAdjunto").data("kendoButton").enable(false);
                Grid_HabilitaToolbar($("#GridAdjuntos"), false, false, false);
                $("#IdArte").val("0");
            }


            //$("#IdRequerimiento").val() !== "0" && $("#Estado").val() === "EDICION" && $("#IdArte").val() !== "0" ? KdoButtonEnable($("#myBtnAdjunto"), $("#Estado").val() !== "EDICION" ? false : true) : $("#myBtnAdjunto").data("kendoButton").enable(false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let LimpiarArte = function () {
    $("#IdArte").val("0");
    $("#Nombre").val("");
    $("#EstiloDiseno").val("");
    $("#NumeroDiseno").val("");
    $("#TxtDirectorioArchivos").val("");
};

let GuardarArtAdj = function (UrlAA, nombreFichero) {
    kendo.ui.progress($(document.body), true);
    var XFecha = Fhoy();
    var XDescripcion = "ARCHIVO ADJUNTO";
    var XType = "Post";

    $.ajax({
        url: UrlAA,
        type: XType,
        dataType: "json",
        data: JSON.stringify({
            IdArte: $("#IdArte").val(),
            Item: 0,
            NombreArchivo: nombreFichero,
            Fecha: XFecha,
            Descripcion: XDescripcion
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#GridAdjuntos").data("kendoGrid").dataSource.read();
            getAdjun(UrlApiArteAdj + "/GetByArte/" + $("#IdArte").val());
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, XType);

        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });
};

let EliminarArtAdj = function (UrlAA, Fn) {
    kendo.ui.progress($(document.body), true);
    var eliminado = false;

    $.ajax({
        url: UrlAA,//
        type: "Post",
        data: { fileName: Fn },
        async: false,
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            eliminado = data.Resultado;
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            eliminado = false;
        }
    });

    return eliminado;
};

let getAdjun = function (UrlAA) {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: UrlAA,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + $("#NoDocumento").val() + "", respuesta);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};
let fn_CatalogoDisenos = function () {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos/" + $("#IdCatalogoDiseno").val(),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                $("#NoReferencia").val(respuesta.NoReferencia);
                var dsres = [{
                    NoDocumento: $("#NoDocumento").val(),
                    NoReferencia: $("#NoReferencia").val(),
                    NombreArchivo: respuesta.NombreArchivo
                }];
                fn_SubirArchivoRD(dsres);
            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_getPrendasMultiSelec = function (Url) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: Url,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdCategoriaPrenda + ",";
            });
            $("#IdCategoriaPrenda").data("kendoMultiSelect").value(lista.split(","));
            fn_getPrendaParteMultiSelec();
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_getPrendaParteMultiSelec = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "PrendasPartes/GetPrendasParteByidRequerimientoidCategoriaPrenda/" + $("#IdRequerimiento").val() + "/" + ($("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === "" || $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === undefined ? 0 : $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0]) ,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdUbicacion + ",";
            });
            $("#IdPartesDet").data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};

//********************************

let fn_GuardarRequerimientoSublimacion = function (UrlRD) {
    kendo.ui.progress($("#BPform"), true);

    var XEstado = "EDICION";
    var XFecha = kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
    var XType = "";

    if (Number($("#IdRequerimiento").val()) === 0) {
        XType = "Post";
        UrlRD = UrlRD + "/CrearRequerimientoDesarrollo";
    } else {
        XEstado = $("#Estado").val();
        XType = "Put";
        UrlRD = UrlRD + "/ActualizarRequerimientoDesarrollo/" + $("#IdRequerimiento").val();
    }

    $.ajax({
        url: UrlRD,//
        type: XType,
        dataType: "json",
        data: JSON.stringify({
            IdRequerimiento: $("#IdRequerimiento").val(),
            IdCliente: $("#IdCliente").val(),
            IdPrograma: $("#IdPrograma").val(),
            IdServicio: $("#IdServicio").val(),
            IdUbicacion:null,
            NoDocumento: $("#NoDocumento").val(),
            IdSolicitudDisenoPrenda: null,
            IdModulo: 4,
            IdEjecutivoCuenta: null,
            UbicacionHorizontal: $("#UbicacionHor").val(),
            UbicacionVertical: $("#UbicacionVer").val(),
            CantidadPiezas: $("#CntPiezas").val(),
            CantidadStrikeOff: $("#TxtCantidadSTrikeOff").val(),
            StrikeOffAdicional: $("#TxtStrikeOffAdicional").val(),
            TallaPrincipal: $("#TallaPrincipal").val(),
            Estado: XEstado,
            Fecha: XFecha,
            InstruccionesEspeciales: $("#InstruccionesEspeciales").val(),
            CantidadColores: 0,
            CantidadTallas: 0,
            Montaje: 0,
            Combo: 0,
            RevisionTecnica: false,
            VelocidadMaquina: null,
            IdUnidadVelocidad: null,
            DisenoFullColor:false,
            IdUnidadMedidaCantidad: $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(),
            IdBase: null,
            IdCategoriaConfeccion: $("#IdCategoriaConfeccion").data("kendoComboBox").value(),
            IdConstruccionTela: $("#IdConstruccionTela").data("kendoComboBox").value(),
            IdComposicionTela: $("#IdComposicionTela").data("kendoComboBox").value(),
            Color: $("#TxtColorTela").val(),
            //Entidad prendas
            IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
            // Entidad sistema de tintas.....
            IdSistemaTinta: null,
            //entidad Artes
            IdArte: $("#IdArte").val(),
            Nombre: $("#Nombre").val(),
            EstiloDiseno: $("#EstiloDiseno").val(),
            NumeroDiseno: $("#NumeroDiseno").val(),
            DirectorioArchivos: $("#TxtDirectorioArchivos").val(),
            IdTipoLuz: null,
            IdMotivoDesarrollo:null,
            IdTipoAcabado: null,
            IdTipoMuestra: null,
            IdQuimica:null,
            SolicitaTelaSustituta: false,
            RegistroCompletado: $("#chkRegistroCompletado").is(':checked'),
            IdUbicacionParte: $("#IdPartesDet").data("kendoMultiSelect").value().toString()
            


        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#IdRequerimiento").val(data[0].IdRequerimiento);
            $("#IdArte").val(data[0].IdArte);
            $("#NoDocumento").val(data[0].NoDocumento1); /// cuando devuel el dato NoDocumento1
            $("#IdSolicitudDisenoPrenda").val(data[0].IdSolicitudDisenoPrenda);
            $("#IdModulo").val(data[0].IdModulo);
            $("#IdEjecutivoCuenta").val(data[0].IdEjecutivoCuenta);
            $("#Estado").val(data[0].Estado);
            //habilitar botones   
        
            RequestEndMsg(data, XType);
            kendo.ui.progress($("#BPform"), false);
            //getAdjun(UrlApiArteAdj + "/GetByArte/" + data[0].IdArte.toString());
            //$("#GridAdjuntos").data("kendoGrid").dataSource.read();
            SublimacionIdReque = data[0].IdRequerimiento;
            KdoCmbFocus($("#IdPrograma"));
            KdoButtonEnable($("#Eliminar"), fn_SNBorrar(data[0].Estado === "EDICION" ? true : false));
            KdoCheckBoxEnable($("#chkRegistroCompletado"), data[0].Estado === "EDICION" ? $("#chkRegistroCompletado").is(':checked') === true ? false : true : false);
            KdoButtonEnable($("#btnCambiarEstado"), fn_SNProcesar(data[0].Estado !== "APROBADO" ? true : false));
            window.history.pushState('', '', "/SublimacionOrdenesTrabajos/SublimacionRegistro/" + SublimacionIdCliente.toString() + "/" + data[0].IdRequerimiento.toString());
            $("#gCambios").data("kendoGrid").dataSource.read();
            data[0].Estado === "EDICION" ? Grid_HabilitaToolbar($("#gCambios"), Permisos.SNAgregar, false, false) : Grid_HabilitaToolbar($("#gCambios"), false, false, false);
            KdoButtonEnable($("#myBtnAdjunto"), true);
            $("#Adjunto").data("kendoUpload").enable(data[0].Estado  !== "EDICION" ? false : true);
            data[0].Estado  !== "EDICION" ? Grid_HabilitaToolbar($("#GridAdjuntos"), false, false, false) : Grid_HabilitaToolbar($("#GridAdjuntos"), false, true, true);
        },
        error: function (data) {

            kendo.ui.progress($("#BPform"), false);
            ErrorMsg(data);
            KdoCmbFocus($("#IdPrograma"));
        }
    });

};

let fn_SubirArchivoRD = function (ds) {
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/RequerimientoDesarrollos/SubirArchivoReq",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.Resultado === true) {
                kendo.ui.progress($("#BPform"), true);
                $.ajax({
                    url: TSM_Web_APi + "ArteAdjuntos/",//
                    type: "Post",
                    dataType: "json",
                    data: JSON.stringify({

                        IdArte: $("#IdArte").val(),
                        Item: 0,
                        NombreArchivo: ds[0].NombreArchivo,
                        Fecha: Fhoy(),
                        Descripcion: "ADJUNTAR ARCHIVO DISEÑO",
                        Catalogo: true

                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        kendo.ui.progress($("#BPform"), false);
                        getAdjun(UrlApiArteAdj + "/GetByArte/" + data[0].IdArte.toString());
                        $("#GridAdjuntos").data("kendoGrid").dataSource.read();
                    },
                    error: function (data) {
                        kendo.ui.progress($("#BPform"), false);
                        ErrorMsg(data);
                    }
                });
            };

        }
    });
};

let OcultarCamposReq = function (ToF) {

    if (ToF) {
        // mostrar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
        //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
        //el servisio de Serigrafia
        $('#Row4RD').prop('hidden', false);
        //$('#Row5RD').prop('hidden', false);

    } else {
        // ocultar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
        //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
        //el servisio de Serigrafia
        $('#Row4RD').prop('hidden', true);
        //$('#Row5RD').prop('hidden', true);
    }

};



let Fn_VerEstados = function (IdRequerimiento) {
    Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null", IdRequerimiento);
};

let getIdReq = function (g) {
    return $("Id").val();
};

let getIdArte = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;
};

let HabilitaFormObje = function (ToF) {
    KdoNumerictextboxEnable($("#CntPiezas"), ToF);
    KdoNumerictextboxEnable($("#TxtCantidadSTrikeOff"), ToF);
    KdoNumerictextboxEnable($("#TxtStrikeOffAdicional"), ToF);
    KdoComboBoxEnable($("#CmbIdUnidadMedidaCantidad"), ToF);
    KdoComboBoxEnable($("#IdPrograma"), ToF);
    KdoComboBoxEnable($("#IdComposicionTela"), ToF);
    KdoComboBoxEnable($("#IdCategoriaConfeccion"), ToF);
    KdoComboBoxEnable($("#IdConstruccionTela"), ToF);
    KdoMultiselectEnable($("#IdCategoriaPrenda"), ToF);
    KdoMultiselectEnable($("#IdPartesDet"), ToF);
    TextBoxEnable($("#InstruccionesEspeciales"), ToF);
    KdoCheckBoxEnable($("#chkRegistroCompletado"), ToF);
    TextBoxEnable($("#TxtColorTela"), ToF);
    TextBoxEnable($("#Nombre"), ToF);
    TextBoxEnable($("#NumeroDiseno"), ToF);
    TextBoxEnable($("#EstiloDiseno"), ToF);
    TextBoxEnable($("#TallaPrincipal"), ToF);
    TextBoxEnable($("#TxtDirectorioArchivos"), ToF);
    $("#UbicacionVer").attr("disabled", !ToF);
    $("#UbicacionHor").attr("disabled", !ToF);

};

let fn_CambiarEstadoSublimacion = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/RequerimientoDesarrollos_CambiarEstadoSublimacion",
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            Id: SublimacionIdReque  ,
            EstadoSiguiente: "DESARROLLO",
            Motivo: "EN DESARROLLO DE PRECIOS",
            StringIdRequerimiento:""
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            window.location.href = "/SublimacionOrdenesTrabajos";
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });
};

let HabilitaObje = function (e, ToF) {
    ToF === true ? e.removeClass("k-state-disabled") : e.addClass("k-state-disabled");
};

fPermisos = function (datos) {
    Permisos = datos;
};

fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};

fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};

fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};

fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};

fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};

fn_SNConfidencial = function (valor) {
    return Permisos.SNConfidencial ? valor : false;
};

let LimpiaMarcaCelda = function () {
    $(".k-dirty-cell", $("#grid")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#grid")).remove();
};

let DSUnidadMedida = function (filtro) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url: UrlUniMed + "/GetUnidadesMedidasByFiltro",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(filtro),
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

let CmbNuevoItem = function (widgetId, value) {
    var widget = $("#" + widgetId).getKendoComboBox();
    var dataSource = widget.dataSource;
    //ConfirmacionMsg("¿Esta seguro de crear el nuevo registro?", function () {
        dataSource.add({
            IdComposicionTela: 0,
            Nombre: value
        });
        dataSource.one("sync", function () {
            widget.select(dataSource.view().length - 1);
            $("#kendoNotificaciones").data("kendoNotification").show("Composicion de tela creado satisfactoriamente!!", "success");
        });

        dataSource.sync();
    //});
};
let fn_CreaPrograma = function (widgetId, value) {
    var widget = $("#" + widgetId).getKendoComboBox();
    var dsProN = widget.dataSource;

    //ConfirmacionMsg("¿Esta seguro de crear el nuevo registro?", function () {
    dsProN.add({
        IdPrograma: 0,
        Nombre: value,
        Fecha: Fhoy(),
        IdCliente: KdoCmbGetValue($("#IdCliente")),
        IdTemporada: 1, // como no se pide se coloca por defecto codigo 1 "NO DEFINIDA"
        NoDocumento: "",
        Nombre1: ""
    });

    dsProN.one("sync", function () {
        widget.select(dsProN.view().length - 1);
        $("#kendoNotificaciones").data("kendoNotification").show("Programa creado satisfactoriamente!!", "success");
    });

    dsProN.sync();
    //});
};
let fn_EliminarReqSublimacion = function () {
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/" + $("#IdRequerimiento").val(),//
        type: "Delete",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#splitter"), false);
            RequestEndMsg(data, "Delete");
            window.location.href = "/SublimacionOrdenesTrabajos";
        },
        error: function (e) {
            kendo.ui.progress($("#splitter"), false);
            ErrorMsg(e);
            $("#Nombre").focus().select();
        }
    });
};


let fn_DSIdUnidadFiltro = function (filtro) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url: UrlUniMed + "/GetUnidadesMedidasByFiltro",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(filtro),
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

var fn_KdoCmbProgramas = function (e, webApi, textField, valueField, opcPlaceHolder, opcHeight, parentCascade, clearButton, fn_crear) {
    $.ajax({
        url: webApi,
        dataType: "json",
        async: false,
        success: function (result) {
            var model = generateModel(result, valueField);
            var dataSource = new kendo.data.DataSource({
                batch: true,
                transport: {
                    read: {
                        url: webApi,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    },
                    create: {
                        url: TSM_Web_APi +"Programas",
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

let fn_RequerimientoCambios = function () {
    var dsetOTEstados = new kendo.data.DataSource({
       
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "RequerimientoDesarrollosCambios/GetbyIdRequerimiento/" + SublimacionIdReque.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "RequerimientoDesarrollosCambios",
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
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "create") { $("#gCambios").data("kendoGrid").dataSource.read(); }

        },
        schema: {
            model: {
                id: "Fecha",
                fields: {
                    IdRequerimiento: {
                        type: "number", defaultValue: function () { return SublimacionIdReque; }
                    },
                    Fecha: { type: "date" },
                    Comentario: { type: "string" },
                    IdUsuario: { type: "string", defaultValue: function () { return getUser(); }},
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                    
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gCambios").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Fecha");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuario");
            Grid_Focus(e, "Comentario");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimiento", title: "Código Requerimiento", hidden: true , menu:false},
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", width: 100 },
            { field: "Comentario", title: "Comentario", width: 400 },
            { field: "IdUsuario", title: "Usuario", width: 100},
            { field: "IdUsuarioMod", title: "IdUsuarioMod", width: 200, hidden: true },
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", width: 160, hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gCambios").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 250);
    SetGrid_CRUD_ToolbarTop($("#gCambios").data("kendoGrid"), Permisos.SNAgregar);
    Set_Grid_DataSource($("#gCambios").data("kendoGrid"), dsetOTEstados, 20);
};

var fn_EstadosSiguientesSublimado = function (estado) {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    async: false,
                    url: TSM_Web_APi + "RequerimientoDesarrollos/GetEstadosSiguientesSublimacion/RequerimientoDesarrollos/" + estado.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};
//#endregion Fin metods Generales