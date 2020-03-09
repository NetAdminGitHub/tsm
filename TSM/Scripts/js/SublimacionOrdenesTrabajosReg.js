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
let xvIdCategoriaPren=0;
$(document).ready(function () {

    //#region Inicialización de variables y controles Kendo
    KdoButton($("#btnIrOrdeTrabajoSublimacion"), "hyperlink-open-sm", "Ir a Ordenes de Trabajo");
    KdoButton($("#Guardar"), "save", "Guardar");
    KdoButton($("#Eliminar"), "delete", "Borrar");
    KdoButton($("#btnConfirmarRegistro"), "gear","confirmar Registro");
    KdoButtonEnable($("#Eliminar"), fn_SNBorrar(false));
    KdoButtonEnable($("#btnConfirmarRegistro"), fn_SNProcesar(false));
    KdoButton($("#myBtnAdjunto"), "attachment", "Adjuntar Diseños");
    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnCerrarAdj"), "close-circle", "Cerrar");
    // deshabilitar botones en formulario
    $("#myBtnAdjunto").data("kendoButton").enable(false);
    $("#myBtnAdjunto").data("kendoButton").element.hide();
    $("#Fecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    //$("#Guardar").data("kendoButton").enable(false);
    PanelBarConfig($("#BarPanel"));
    KdoDatePikerEnable($("#Fecha"), false);

    // codigo de programas para el splitter
    //*******************************************************************

    $("#CntPiezas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtCantidadSTrikeOff").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#TxtStrikeOffAdicional").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#Combo").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#TxtNoVeces").kendoNumericTextBox({
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
                        return input.val().length <= 200;
                    }
                    return true;
                },
                NumeroDisenoRuler: function (input) {
                    if (input.is("[name='NumeroDiseno']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                EstiloDisenoRuler: function (input) {
                    if (input.is("[name='EstiloDiseno']")) {
                        return input.val().length <= 200;
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
                EstiloDisenoRuler: "Longitud máxima del campo es 200"
            }
        }
    ).data("kendoValidator");



    Kendo_CmbFiltrarGrid($("#IdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un Servicio ....");
    $("#IdServicio").data("kendoComboBox").wrapper.hide();
    KdoCmbSetValue($("#IdServicio"), 2);

    Kendo_CmbFiltrarGrid($("#IdCliente"), UrlApiClient, "Nombre", "IdCliente", "Seleccione un Cliente ....");
    KdoComboBoxEnable($("#IdCliente"), false);
    KdoCmbSetValue($("#IdCliente"), SublimacionIdCliente);

    Kendo_CmbFiltrarGrid($("#IdPrograma"), UrlApiPro, "Nombre", "IdPrograma", "Seleccione ...", "", "IdCliente");
    Kendo_MultiSelect($("#IdCategoriaPrenda"), UrlApiCPre, "Nombre", "IdCategoriaPrenda", "Seleccione ...");
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
        dataSource: DSUnidadMedida("9,17")
    });
    //#endregion fin CmbIdUnidadMedidaCantidad

    TextBoxEnable($("#Estado"), false);
    //HabilitaFormObje(false);

    //#endregion FIN Inicialización de variables y controles Kendo

    //#region Programacion GRID REQUERIMIENTO DE DESARROLLO

    let DsRD = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlRD + "/" + $("#txtId").val(); },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdRequerimiento",
                fields: {
                    IdRequerimiento: { type: "number" },
                    IdCliente: { type: "number" },
                    NoCuenta: { type: "string" },
                    IdPrograma: { type: "number" },
                    Nombre4: { type: "string" },
                    NoDocumento: { type: "string" },
                    IdServicio: { type: "number" },
                    Nombre: { type: "string" },
                    IdUbicacion: { type: "number" },
                    Nombre1: { type: "string" },
                    NoDocumento1: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    CantidadPiezas: { type: "number" },
                    TallaPrincipal: { type: "string" },
                    Estado: { type: "string" },
                    Fecha: { type: "date" },
                    InstruccionesEspeciales: { type: "string" },
                    Nombre2: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    Nombre3: { type: "string" },
                    Nombre5: { type: "string" },
                    IdCategoriaConfeccion: { type: "number" },
                    Nombre6: { type: "string" },
                    IdConstruccionTela: { type: "number" },
                    Nombre7: { type: "string" },
                    IdComposicionTela: { type: "number" },
                    Nombre8: { type: "string" },
                    Color: { type: "string" }
                }
            }
        }
    });

    //#endregion FIN Programacion GRID REQUERIMIENTO DE DESARROLLO


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

    $("#btnConfirmarRegistro").click(function (event) {
        event.preventDefault();
        fn_CambiarEstadoSublimacion();
    });

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
            saveUrl: "/RequerimientoDesarrollos/SubirArchivo",
            autoUpload: true
        },
        localization: {
            select: '<div class="k-icon k-i-attachment-45"></div>&nbsp;Adjuntos'
        },
        upload: function (e) {
            e.sender.options.async.saveUrl = "/RequerimientoDesarrollos/SubirArchivo/" + $("#NoDocumento").val();
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
            url: "/RequerimientoDesarrollos/SubirArchivo/" + $("#NoDocumento").val(),//
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

            kendo.ui.progress($("#vistaParcial"), true);
            url = UrlApiP + "/" + e.dataItem.IdCategoriaPrenda + "/" + $("#IdRequerimiento").val().toString();
            $.ajax({
                url: url,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    //CargarInfoEtapa(false);
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($("#vistaParcial"), false);
                },
                error: function (data) {
                    kendo.ui.progress($("#vistaParcial"), false);
                    ErrorMsg(data);
                }
            });

        }

    });

    $("#IdCategoriaPrenda").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($("#vistaParcial"), true);
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
                    kendo.ui.progress($("#vistaParcial"), false);
                },
                error: function (data) {
                    getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + $("#IdRequerimiento").val());
                    kendo.ui.progress($("#vistaParcial"), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin Prendas multi select
    $("#IdRequerimiento").val($("#txtId").val());
    $("#UbicacionVer").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#UbicacionHor").autogrow({ vertical: true, horizontal: false, flickering: false });
    fn_partesSublimado();
    fn_getRD();

    if (SublimacionIdReque === 0) {
        $("#IdRequerimiento").val(SublimacionIdReque);
        HabilitaFormObje(true);
        Grid_HabilitaToolbar($("#gridPartes"), false, false, false);
        KdoCmbFocus($("#IdPrograma"));
    }

});


let fn_partesSublimado = function () {
    //#region partes de sublimado

    let UrlPParte = TSM_Web_APi + "PrendasPartes";
    let UrlUbic = TSM_Web_APi + "Ubicaciones";
    let UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
    let dset = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlPParte + "/GetPrendasParteByidRequerimientoidCategoriaPrenda/" + SublimacionIdReque + "/" + xvIdCategoriaPren.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPParte + "/" + datos.IdRequerimiento + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPParte + "/" + datos.IdRequerimiento + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "DELETE"
            },
            create: {
                url: UrlPParte,
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
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdRequerimiento: { type: "number", defaultValue: function (e) { return SublimacionIdReque; } },
                    IdCategoriaPrenda: {
                        type: "number", defaultValue: function (e) {
                            return $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === "" || $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === undefined ? 0 : $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0];
                        }
                    },
                    IdUbicacion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUbicacion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;

                            }
                        }
                    },
                    Nombre1: { type: "string" },
                    Cantidad: { type: "number" },
                    IdUnidad: { type: "string" },
                    Nombre2: { type: "string" },
                    Precio: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },
            { field: "Precio", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPartes").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdUbicacion");
            }
            Grid_Focus(e, "IdUbicacion");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimiento", title: "Codigo Requerimiento", hidden: true },
            { field: "IdCategoriaPrenda", title: "Codigo IdCategoriaPrenda", hidden: true },
            { field: "IdUbicacion", title: "Codigo Parte", editor: Grid_Combox, values: ["IdUbicacion", "Nombre", UrlUbic, "", "Seleccione...."], hidden: true },
            { field: "Nombre1", title: "Parte" },
            { field: "Cantidad", title: "Cantidad", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0], footerTemplate: "Total: #: data.Cantidad ? sum : 0 #"},
            { field: "IdUnidad", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione....", "required", "", "Requerido"], hidden: true},
            { field: "Nombre2", title: "Unidad" },
            { field: "Precio", title: "Precio", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c2", 2], format: "{0:c2}", footerTemplate: "Total: #: data.Precio ? kendo.format('{0:c2}', sum) : 0 #" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPartes").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si, 200);
    SetGrid_CRUD_ToolbarTop($("#gridPartes").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPartes").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPartes").data("kendoGrid"), dset);

    var selectedRows = [];
    $("#gridPartes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPartes"), selectedRows);
    });

    $("#gridPartes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPartes"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPartes"), $(window).height() - "700");
    });

    Fn_Grid_Resize($("#gridPartes"), $(window).height() - "700");

    //#endregion

};

//#region Metodos Generales

let fn_getRD = function () {
    kendo.ui.progress($("#vistaParcial"), true);
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
                //$("#UbicacionHor").val(elemento.UbicacionHorizontal);
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
                $("#TxtColorTela").val(elemento.Color);
                //consultar grid
                VarIDReq = elemento.IdRequerimiento;
                //habiliar en objetos en las vistas
                $("#Guardar").data("kendoButton").enable(fn_SNAgregar(elemento.Estado === "EDICION" ? true : false));
                $("#btnConfirmarRegistro").data("kendoButton").enable(fn_SNProcesar(elemento.Estado === "EDICION" ? true : false));
                KdoButtonEnable($("#Eliminar"), fn_SNBorrar(elemento.Estado === "EDICION" ? true : false));
                HabilitaFormObje(elemento.Estado === "EDICION" ? true : false);
                // foco en la fecha
                KdoCmbFocus($("#IdPrograma"));

            });


            kendo.ui.progress($("#vistaParcial"), false);
            getArte(UrlApiArte + "/GetArteByIdReq/" + VarIDReq.toString(), UrlApiArteAdj);
            getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + VarIDReq.toString());


        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);

        }
    });
};

let getArte = function (UrlArt, UrlApiArteAdj) {
    kendo.ui.progress($("#vistaParcial"), true);
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
                kendo.ui.progress($("#vistaParcial"), false);
                UrlApiArteAdj = UrlApiArteAdj + "/GetByArte/" + respuesta.IdArte;
                getAdjun(UrlApiArteAdj);
                KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true);
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();

            } else {
                LimpiarArte();
                Fn_LeerImagenes($("#Mycarousel"), "", null);
                kendo.ui.progress($("#vistaParcial"), false);
                $("#myBtnAdjunto").data("kendoButton").enable(false);
                $("#IdArte").val("0");
            }


            $("#IdRequerimiento").val() !== "0" && $("#Estado").val() === "EDICION" && $("#IdArte").val() !== "0" ? KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true) : $("#myBtnAdjunto").data("kendoButton").enable(false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
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
    kendo.ui.progress($("#vistaParcial"), true);
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
            kendo.ui.progress($("#vistaParcial"), false);
            RequestEndMsg(data, XType);

        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
            ErrorMsg(data);
        }
    });
};

let EliminarArtAdj = function (UrlAA, Fn) {
    kendo.ui.progress($("#vistaParcial"), true);
    var eliminado = false;

    $.ajax({
        url: UrlAA,//
        type: "Post",
        data: { fileName: Fn },
        async: false,
        success: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
            eliminado = data.Resultado;
        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
            eliminado = false;
        }
    });

    return eliminado;
};

let getAdjun = function (UrlAA) {
    //LLena Splitter de imagenes
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: UrlAA,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + $("#NoDocumento").val() + "", respuesta);
            kendo.ui.progress($("#vistaParcial"), false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
};
let fn_CatalogoDisenos = function () {
    //LLena Splitter de imagenes
    kendo.ui.progress($("#vistaParcial"), true);
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
            kendo.ui.progress($("#vistaParcial"), false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
};

let getPrendasMultiSelec = function (Url) {
    kendo.ui.progress($("#vistaParcial"), true);
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
            kendo.ui.progress($("#vistaParcial"), false);
            xvIdCategoriaPren = $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === "" || $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0] === undefined ? 0 : $("#IdCategoriaPrenda").data("kendoMultiSelect").value()[0];
            $("#gridPartes").data("kendoGrid").dataSource.read();
            xvIdCategoriaPren === 0 || $("#Estado").val() !== "EDICION" ? Grid_HabilitaToolbar($("#gridPartes"), false, false, false) : Grid_HabilitaToolbar($("#gridPartes"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
         
        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
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
            UbicacionHorizontal: null,
            UbicacionVertical: null,
            CantidadPiezas: $("#CntPiezas").val(),
            CantidadStrikeOff: $("#TxtCantidadSTrikeOff").val(),
            StrikeOffAdicional: $("#TxtStrikeOffAdicional").val(),
            TallaPrincipal: $("#TallaPrincipal").val(),
            Estado: XEstado,
            Fecha: XFecha,
            InstruccionesEspeciales: null,
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
            DirectorioArchivos:"",
            IdTipoLuz: null,
            IdMotivoDesarrollo:null,
            IdTipoAcabado: null,
            IdTipoMuestra: null,
            IdQuimica:null,
            SolicitaTelaSustituta: false


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
            KdoButtonEnable($("#btnConfirmarRegistro"), fn_SNProcesar(data[0].Estado === "EDICION" ? true : false));
            window.history.pushState('', '', "/SublimacionOrdenesTrabajos/SublimacionRegistro/" + SublimacionIdCliente.toString() + "/" + data[0].IdRequerimiento.toString());
            Grid_HabilitaToolbar($("#gridPartes"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
           
           
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


let LimpiarReq = function () {

    $("#IdRequerimiento").val("0");
    //$("#IdUbicacion").data("kendoComboBox").value("");
    $("#IdPrograma").data("kendoComboBox").value("");
    $("#NoDocumento").val("");
    $("#IdSolicitudDisenoPrenda").val("");
    $("#IdModulo").val("");
    $("#IdEjecutivoCuenta").val("");
    $("#TxtEjecutivoCuenta").val("");
    $("#UbicacionHor").val("");
    $("#UbicacionVer").val("");
    $("#CntPiezas").data("kendoNumericTextBox").value("0");
    $("#TxtCantidadSTrikeOff").data("kendoNumericTextBox").value("0");
    $("#TxtStrikeOffAdicional").data("kendoNumericTextBox").value("0");
    
    $("#Combo").data("kendoNumericTextBox").value("0");
    $("#TallaPrincipal").val("");
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    $("#InstruccionesEspeciales").val("");
    $("#Estado").val("");
    $('#chkDisenoFullColor').prop('checked', 0);
    $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value("");
    $("#IdCategoriaConfeccion").data("kendoComboBox").value("");
    $("#IdConstruccionTela").data("kendoComboBox").value("");
    $("#IdComposicionTela").data("kendoComboBox").value("");
    $("#TxtColorTela").val("");
    $("#CmbTipoLuz").data("kendoComboBox").value("");
    $("#CmbMotivoDesarrollo").data("kendoComboBox").value("");
    $("#CmbTMuestra").data("kendoComboBox").value("");
    $("#CmbTipoAcabado").data("kendoComboBox").value("");
    KdoCmbSetValue($("#CmbQuimica"), "");

    //limpiar mensajes de validacion
    ValidRD.hideMessages();

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

let Fn_UpdFilaGridRD = function (g, data) {
    g.set("NoDocumento", data.NoDocumento);
    g.set("IdPrograma", data.IdPrograma);
    g.set("NoDocumento1", data.NoDocumento1);
    //g.set("IdUbicacion", data.IdUbicacion);
    g.set("Nombre1", data.Nombre1);
    g.set("UbicacionHorizontal", data.UbicacionHorizontal);
    g.set("UbicacionVertical", data.UbicacionVertical);
    g.set("CantidadPiezas", data.CantidadPiezas);
    g.set("Fecha", kendo.toString(kendo.parseDate(data.Fecha), 'dd/MM/yyyy'));
    g.set("Nombre4", data.Nombre4);
    g.set("Nombre3", data.Nombre3);
    g.set("IdCategoriaConfeccion", data.IdCategoriaConfeccion);
    g.set("Nombre6", data.Nombre6);
    g.set("IdConstruccionTela", data.IdConstruccionTela);
    g.set("Nombre7", data.Nombre7);
    g.set("IdComposicionTela", data.IdComposicionTela);
    g.set("Nombre8", data.Nombre8);
    g.set("Color", data.Color);
    g.set("Nombre2", data.Nombre2);
    g.set("EstiloDiseno", data.EstiloDiseno);
    g.set("NumeroDiseno", data.NumeroDiseno);


    LimpiaMarcaCelda();
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
    //KdoDatePikerEnable($("#Fecha"), ToF);
    KdoNumerictextboxEnable($("#CntPiezas"), ToF);
    KdoNumerictextboxEnable($("#TxtCantidadSTrikeOff"), ToF);
    KdoNumerictextboxEnable($("#TxtStrikeOffAdicional"), ToF);
    KdoComboBoxEnable($("#CmbIdUnidadMedidaCantidad"), ToF);
    KdoComboBoxEnable($("#IdPrograma"), ToF);
    KdoComboBoxEnable($("#IdComposicionTela"), ToF);
    KdoComboBoxEnable($("#IdCategoriaConfeccion"), ToF);
    KdoComboBoxEnable($("#IdConstruccionTela"), ToF);
    //$("#IdServicio").val() !== "2" ? KdoComboBoxEnable($("#IdUbicacion"), ToF) : KdoComboBoxEnable($("#IdUbicacion"), false);
    KdoMultiselectEnable($("#IdCategoriaPrenda"), ToF);
    //KdoMultiselectEnable($("#IdSistemaTinta"), ToF);

    TextBoxEnable($("#TxtColorTela"), ToF);
    TextBoxEnable($("#Nombre"), ToF);
    TextBoxEnable($("#NumeroDiseno"), ToF);
    TextBoxEnable($("#EstiloDiseno"), ToF);

};

let fn_CambiarEstadoSublimacion = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/RequerimientoDesarrollos_CambiarEstadoSublimacion",
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            Id: SublimacionIdReque  ,
            EstadoSiguiente: "CONFIRMADO",
            Motivo: "REQUERIMIENTO CONFIRMADO"
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            window.location.href = "/SublimacionOrdenesTrabajos";
            RequestEndMsg(data, XType);
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

fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
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
    ConfirmacionMsg("¿Esta seguro de crear el nuevo registro?", function () {
        dataSource.add({
            IdComposicionTela: 0,
            Nombre: value
        });
        dataSource.one("sync", function () {
            widget.select(dataSource.view().length - 1);
        });

        dataSource.sync();
    });
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





//#endregion Fin metods Generales