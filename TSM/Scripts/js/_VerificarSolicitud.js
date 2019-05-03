﻿var UrlApiServ = TSM_Web_APi + "Servicios";
var UrlApiClient = TSM_Web_APi + "Clientes";
var UrlApiSisT = TSM_Web_APi + "sistematintas";
var UrlApiPro = TSM_Web_APi + "Programas";
var UrlApiBoards = TSM_Web_APi + "Boards";
var UrlApiCPre = TSM_Web_APi + "CategoriaPrendas";
var UrlApiCConfec = TSM_Web_APi + "CategoriaConfecciones";
var UrlApiUEstam = TSM_Web_APi + "Ubicaciones";
var UrlApiConsTela = TSM_Web_APi + "ConstruccionTelas";
var UrlApiCompTela = TSM_Web_APi + "ComposicionTelas";
var UrlApiP = TSM_Web_APi + "Prendas";
var UrlApiArte = TSM_Web_APi + "Artes";
var UrlApiArteAdj = TSM_Web_APi + "ArteAdjuntos";
var UrlApiAAdj = TSM_Web_APi + "ArteAdjuntos";
var UrlRD = TSM_Web_APi + "RequerimientoDesarrollos";
var UrlApiTD = TSM_Web_APi + "Dimensiones";
var UrlApiCT = TSM_Web_APi + "CategoriaTallas";
var UrlApiUM = TSM_Web_APi + "UnidadesMedidas";
var UrlReqDesTec = TSM_Web_APi + "RequerimientoDesarrollosTecnicas";
var UrlApiVTec = TSM_Web_APi + "Tecnicas";
var UrlAD = TSM_Web_APi + "AnalisisDisenos";
var UrlRtin = TSM_Web_APi + "RequerimientoTintas";
var UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
var UrlEP = TSM_Web_APi + "EtapasProcesos";
var UrlApiCoTec = TSM_Web_APi + "CostoTecnicas";
var UrlApiBase = TSM_Web_APi + "Bases";
var UrlTL = TSM_Web_APi + "TiposLuces";
var UrlMD = TSM_Web_APi + "MotivosDesarrollos";
var UrlTA = TSM_Web_APi + "TiposAcabados";
var UrlTC = TSM_Web_APi + "RequerimientoDesarrollosColoresTecnicas";
var UrlTMues = TSM_Web_APi + "TipoMuestras"; 

var Permisos;
let xvUrl = "", xvId = "";
let EsCambioReg = false;
let vIdS = 0;
let vIdCli = 0;
let VarIDReq = 0;

var fn_VSCargarJSEtapa = function () {
    //#region Inicialización de variables y controles Kendo
 
    // carga carrousel de imagenes 
    var DivCarousel = $("#Div_Carousel");
    DivCarousel.append(Fn_Carouselcontent());
    //CargarEtapasProceso(0);
    KdoButton($("#Guardar"), "save", "Guardar");
    KdoButton($("#Eliminar"), "delete", "Eliminar");
    KdoButton($("#myBtnAdjunto"), "attachment", "Adjuntar Diseños");
    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnCerrarAdj"), "close-circle", "Cerrar");

    // deshabilitar botones en formulario
    //$("#ReqDes").children().addClass("k-state-disabled");
    $("#myBtnAdjunto").data("kendoButton").enable(false);
    
    $("#Fecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#Fecha").data("kendoDatePicker").value(Fhoy())

    $("#Guardar").data("kendoButton").enable(false);
    $("#Eliminar").data("kendoButton").enable(false);
    $("#LblUbicacionVer").prop("hidden", "hidden");
    $("#UbicacionVer").prop("hidden", "hidden");
    $("#LblUbicacionHor").prop("hidden", "hidden");
    $("#UbicacionHor").prop("hidden", "hidden");

    PanelBarConfig($("#BarPanel"));
    
    Fn_LeerImagenes($("#Mycarousel"), "", null);

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

    $("#Combo").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    $("#CantidadColores").kendoNumericTextBox({
        min: 0,
        max: 12,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    $("#CantidadTallas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    $("#Montaje").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });

    $("#TxtVelocidadMaquina").kendoNumericTextBox({
        min: 0,
        max: 99999999999999,
        format: "#",
        restrictDecimals: false,
        decimals: 2,
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
    var ValidRD = $("#ReqDes").kendoValidator(
        {
            rules: {
                Mayor0: function (input) {
                    if (input.is("[name='CntPiezas']")) {
                        return $("#CntPiezas").data("kendoNumericTextBox").value() > 0;
                    }
                    return true;
                },
                VelocidadMaquinaRuler: function (input) {
                    if (input.is("[name='TxtVelocidadMaquina']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        return $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value() > 0;
                    }
                    return true;
                },
                InstruccionesEspecialesRuler: function (input) {
                    if (input.is("[name='InstruccionesEspeciales']")) {
                        return input.val().length <= 2000;
                    }
                    return true;
                },
                MsgCmbIdPrograma: function (input) {
                    if (input.is("[name='IdPrograma']")) {
                        return $("#IdPrograma").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbUbicacion: function (input) {
                    if (input.is("[name='IdUbicacion']")) {
                        return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbIdUnidadVelocidad: function (input) {
                    if (input.is("[name='CmbIdUnidadVelocidad']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        return $("#CmbIdUnidadVelocidad").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                UbicacionVerRuler: function (input) {
                    if (input.is("[name='UbicacionVer']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                UbicacionHorRuler: function (input) {
                    if (input.is("[name='UbicacionHor']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                MsgCmbIdUnidadMedidaCantidad: function (input) {
                    if (input.is("[name='CmbIdUnidadMedidaCantidad']")) {
                        return $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },

                CantidadColoresMsg: function (input) {
                    if (input.is("[name='CantidadColores']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        return $("#CantidadColores").data("kendoNumericTextBox").value() > 0;
                    }
                    return true;
                },
                MsgCmbBase: function (input) {
                    if (input.is("[name='CmbBase']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        return $("#CmbBase").data("kendoComboBox").selectedIndex >= 0;
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
                MsgMontaje: function (input) {
                    if (input.is("[name='Montaje']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        return $("#Montaje").data("kendoNumericTextBox").value() > 0;
                    }
                    return true;
                },
                MsgCombo: function (input) {
                    if (input.is("[name='Combo']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        return $("#Combo").data("kendoNumericTextBox").value() > 0;
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
                },
                TxtDirectorioArchivosRuler: function (input) {
                    if (input.is("[name='TxtDirectorioArchivos']")) {
                        return input.val().length <= 2000;
                    }
                    return true;
                },
                MsgCmbTipoLuz: function (input) {
                    if (input.is("[name='CmbTipoLuz']")) {
                        return $("#CmbTipoLuz").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbMotivo: function (input) {
                    if (input.is("[name='CmbMotivoDesarrollo']")) {
                        return $("#CmbMotivoDesarrollo").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbTMuestra: function (input) {
                    if (input.is("[name='CmbTMuestra']")) {
                        return $("#CmbTMuestra").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbAcabado: function (input) {
                    if (input.is("[name='CmbTipoAcabado']")) {
                        return $("#CmbTipoAcabado").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }


            },
            messages: {
                VelocidadMaquinaRuler: "Debe ser mayor a 0",
                Mayor0: "Debe ser mayor a 0",
                MsgLongitud: "Debe ser mayor a 0",
                InstruccionesEspecialesRuler: "Longitud máxima del campo es 2000",
                required: "Requerido",
                MsgCmbPro: "Requerido",
                MsgCmbIdPrograma: "Requerido",
                MsgCmbUbicacion: "Requerido",
                MsgCmbIdUnidadVelocidad: "Requerido",
                UbicacionVerRuler: "Longitud máxima del campo es 200",
                UbicacionHorRuler: "Longitud máxima del campo es 200",
                MsgCmbIdUnidadMedidaCantidad: "Requerido",
                MsgCmbBase: "Requerido",
                CantidadColoresMsg: "requerido",
                ColorRuler: "Longitud máxima del campo es 200",
                MsgIdCategoriaConfeccion: "Requerido",
                MsgIdComposicionTela: "Requerido",
                MsgIdConstruccionTela: "Requerido",
                MsgMontaje: "Requerido",
                MsgCombo: "Requerido",
                NombreRuler: "Longitud máxima del campo es 200",
                NumeroDisenoRuler: "Longitud máxima del campo es 200",
                EstiloDisenoRuler: "Longitud máxima del campo es 200",
                TxtDirectorioArchivosRuler: "Longitud máxima del campo es 2000",
                MsgCmbTipoLuz: "Requerido",
                MsgCmbMotivo: "Requerido",
                MsgCmbAcabado: "Requerido",
                MsgCmbTMuestra:"Requerido"
            }
        }).data("kendoValidator");

    var ValidCopiar = $("#FrmCopiarReq").kendoValidator({
        rules: {
            Mayor0: function (input) {
                if (input.is("[name='TxtNoVeces']")) {
                    return input.val() > 0;
                }
                return true;
            }

        },
        messages: {
            Mayor0: "La cantidad de copias no puede ser 0",
            required: "requerido"
        }
    }).data("kendoValidator");
    status = $(".status");

    Kendo_CmbFiltrarGrid($("#IdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un Servicio ....");
    $("#IdServicio").data("kendoComboBox").wrapper.hide();
    Kendo_CmbFiltrarGrid($("#IdCliente"), UrlApiClient, "Nombre", "IdCliente", "Seleccione un Cliente ....");
    $("#IdCliente").data("kendoComboBox").dataSource.read()    
    $("#IdCliente").data("kendoComboBox").wrapper.hide();
    Kendo_CmbFiltrarGrid($("#IdPrograma"), UrlApiPro, "Nombre", "IdPrograma", "Seleccione ...", "", "IdCliente");
    Kendo_MultiSelect($("#IdSistemaTinta"), UrlApiSisT, "Nombre", "IdSistemaTinta", "Seleccione ...");
    Kendo_MultiSelect($("#IdCategoriaPrenda"), UrlApiCPre, "Nombre", "IdCategoriaPrenda", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdUbicacion"), UrlApiUEstam, "Nombre", "IdUbicacion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdCategoriaConfeccion"), UrlApiCConfec, "Nombre", "IdCategoriaConfeccion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdConstruccionTela"), UrlApiConsTela, "Nombre", "IdConstruccionTela", "Seleccione ...");
    //Kendo_CmbFiltrarGrid($("#IdComposicionTela"), UrlApiCompTela, "Nombre", "IdComposicionTela", "Seleccione ...");
    KdoCmbComboBox($("#IdComposicionTela"), UrlApiCompTela, "Nombre", "IdComposicionTela", "Seleccione ...", "", "", "", "CmbNuevoItem")
    Kendo_CmbFiltrarGrid($("#CmbTipoLuz"), UrlTL, "Nombre", "IdTipoLuz", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbMotivoDesarrollo"), UrlMD, "Nombre", "IdMotivoDesarrollo", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTipoAcabado"), UrlTA, "Nombre", "IdTipoAcabado", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTMuestra"), UrlTMues, "Nombre", "IdTipoMuestra", "Seleccione ...");
    //#region CmbIdUnidadVelocidad

    $("#CmbIdUnidadVelocidad").kendoComboBox({
        dataTextField: "Abreviatura",
        dataValueField: "IdUnidad",
        autoWidth: true,
        filter: "contains",
        autoBind: false,
        clearButton: true,
        placeholder: "Seleccione...",
        height: 550,
        dataSource: DSUnidadMedida("15,16")
    });

    //#endregion CmbIdUnidadVelocidad

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

    Kendo_CmbFiltrarGrid($("#CmbBase"), UrlApiBase, "Nombre", "IdBase", "Seleccione...");
    KdoNumerictextboxEnable($("#CantidadTallas"), false);
    KdoComboBoxEnable($("#CmbMotivoDesarrollo"), false);
    KdoComboBoxEnable($("#CmbTMuestra"), false);

    HabilitaFormObje(false)

    //#endregion FIN Inicialización de variables y controles Kendo

    //#region Programacion GRID REQUERIMIENTO DE DESARROLLO

    var DsRD = new kendo.data.DataSource({
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
                    IdBase: { type: "number" },
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

    //#region CRUD Programación GRID Dimensiones
    var DsDimension = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlApiTD + "/GetbyRequerimiento/" + VarIDReq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlApiTD + "/" + datos.IdRequerimiento.toString() + "/" + datos.IdDimension.toString(); },
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlApiTD + "/" + datos.IdRequerimiento.toString() + "/" + datos.IdDimension.toString(); },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlApiTD,
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
            if (e.type === "create" || e.type === "destroy") {
                ObtenerTallas();
            }
            Grid_requestEnd(e)
        },
        // VALIDAR ERROR
        error: Grid_error,

        //change: function (e) {
        //    $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRDimension"), false, false, false);
        //    Grid_SelectRow($("#GRDimension"), selectedRowsDimen);
        //},
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdDimension",
                fields: {
                    Id: {
                        type: "string"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    IdDimension: {
                        type: "number"
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
                        type: "number"
                    },
                    Ancho: {
                        type: "number"
                    },
                    Tallas: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Tallas']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 60.");
                                    return input.val().length <= 60;
                                }
                                if (input.is("[name='Alto']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $('[name="C3"]').is(':checked') === true ? $("[name='Alto']").data("kendoNumericTextBox").value() >= 0 : $("[name='Alto']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Ancho']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $('[name="C3"]').is(':checked') === true ? $("[name='Ancho']").data("kendoNumericTextBox").value() >= 0 : $("[name='Ancho']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='IdCategoriaTalla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaTalla").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='DimensionesRelativas']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000.");
                                    return $('[name="C3"]').is(':checked') === true ? input.val().length > 0 && input.val().length <= 2000 : input.val().length <= 2000;
                                }

                                return true;
                            }
                        }
                    },
                    C3: {
                        type: "bool"
                    },
                    DimensionesRelativas: { type: "string" }

                }
            }
        }
        //aggregate: [{ field: "Tallas", aggregate: "count" }]


    });

    $("#GRDimension").kendoGrid({
        autoBind: false,
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Id");
            KdoHideCampoPopup(e.container, "IdDimension");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Abreviatura");

            if (e.model.isNew()) {
                KdoHideCampoPopup(e.container, "DimensionesRelativas");
            } else {
                if (e.model.C3) {
                    KdoShowCampoPopup(e.container, "DimensionesRelativas");
                } else {
                    KdoHideCampoPopup(e.container, "DimensionesRelativas");
                }
            }
            $('[name="C3"]').click(function () {
                if (this.checked) {
                    KdoShowCampoPopup(e.container, "DimensionesRelativas");
                } else {
                    $('[name="DimensionesRelativas"]').val("");
                    $('[name="DimensionesRelativas"]').trigger("change");
                    KdoHideCampoPopup(e.container, "DimensionesRelativas");
                }
            });

            Grid_Focus(e, "IdCategoriaTalla");
        },


        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdDimension", title: "Codigó Dimensión", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdCategoriaTalla", title: "Categoría Talla", editor: Grid_Combox, values: ["IdCategoriaTalla", "Nombre", UrlApiCT, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Nombre", title: "Categoría Talla" },
            { field: "Tallas", title: "Tallas" }, //aggregates: ["count"], footerTemplate: "Cantidad de Tallas: #: data.Tallas ? data.Tallas.count: 0 #" 
            { field: "C3", title: "Dimension Relativa:", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "C3"); } },
            { field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "IdUnidad", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlApiUM, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Abreviatura", title: "Unidad de Medida" },
            { field: "DimensionesRelativas", title: "Medidas Relativas" }



        ]

    });

    SetGrid($("#GRDimension").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRDimension").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRDimension").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRDimension").data("kendoGrid"), DsDimension);
   
    var selectedRowsDimen = [];
    $("#GRDimension").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRDimension"), selectedRowsDimen);
    });

    //#endregion Fin CRUD Programación GRID Dimensiones

    //#region CRUD Programación GRID Costo y tecnicas

    var DsReqDesTec = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlReqDesTec + "/GetByRequerimiento/" + VarIDReq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlReqDesTec + "/" + datos.IdRequerimientoTecnica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlReqDesTec + "/" + datos.IdRequerimientoTecnica; },
                type: "DELETE"
            },
            create: {
                url: UrlReqDesTec,
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
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdRequerimientoTecnica",
                fields: {
                    IdRequerimientoTecnica: {
                        type: "number"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    IdTecnica: {
                        type: "string"
                    },
                    Nombre1: {
                        type: "string"
                    },
                    IdCostoTecnica: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }

                                if (input.is("[name='IdCostoTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCostoTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }

                                return true;
                            }
                        }

                    },
                    Nombre: {
                        type: "string"
                    }

                }
            }
        }



    });

    $("#GRReqDesTec").kendoGrid({
        autoBind: false,
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoTecnica");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");

            //preparar crear DataSource filtrado por base
            var CmbDSTec = new kendo.data.DataSource({
                dataType: 'json',
                sort: { field: "Nombre", dir: "asc" },
                transport: {
                    read: function (datos) {
                        $.ajax({
                            dataType: 'json',
                            url: UrlApiVTec + "/GetbyBase/" + $("#CmbBase").data("kendoComboBox").value().toString(),
                            async: false,
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                datos.success(result);
                            }
                        });
                    }
                }
            });



            $('[name="IdTecnica"]').on('change', function (e, dtmodel) {
                IdTec = Kendo_CmbGetvalue($('[name="IdTecnica"]'));
                $('[name="IdCostoTecnica"]').data("kendoComboBox").value("");
                var DsCostoTec = new kendo.data.DataSource({
                    dataType: 'json',
                    sort: { field: "Nombre", dir: "asc" },
                    transport: {
                        read: function (datos) {
                            $.ajax({
                                dataType: 'json',
                                url: UrlApiCoTec + "/" + $("#CmbBase").data("kendoComboBox").value().toString() + "/" + IdTec.toString(),
                                async: false,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    datos.success(result);

                                }
                            });
                        }
                    }
                });

                // asignar DataSource al combobox tecnica
                $('[name="IdCostoTecnica"]').data("kendoComboBox").setDataSource(DsCostoTec);

            });


            // asignar DataSource al combobox tecnica
            $('[name="IdTecnica"]').data("kendoComboBox").setDataSource(CmbDSTec);




            Grid_Focus(e, "IdTecnica");
        },
        //DEFICNICIÓN DE LOS CAMPOS

        columns: [
            { field: "IdRequerimientoTecnica", title: "Color Requerimiento Técnica", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdTecnica", title: "Técnicas", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlApiVTec, "", "Seleccione un Técnica....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre1", title: "Nombre técnica" },
            { field: "IdCostoTecnica", title: "Costo técnica", editor: Grid_Combox, values: ["IdCostoTecnica", "Nombre", UrlApiCoTec, "", "Seleccione un Costo Tec...", "required", "IdTecnica", "Requerido"], hidden: true },
            { field: "Nombre", title: "Nombre costo técnica" }

        ]

    });

    SetGrid($("#GRReqDesTec").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesTec").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRReqDesTec").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRReqDesTec").data("kendoGrid"), DsReqDesTec);


    var selectedRowsColoTec = [];
    $("#GRReqDesTec").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila

        Grid_SetSelectRow($("#GRReqDesTec"), selectedRowsColoTec);
    });
    //#endregion fin CRUD Programación GRID Colores tecnicas

    //#region CRUD Programación GRID Tecnicas y colores

    var DsReqColorTec = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlTC + "/GetRequerimientoDesarrollosColoresTecnicaByIdRequerimiento/" + VarIDReq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlTC + "/" + datos.IdRequerimientoColorTecnica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlTC + "/" + datos.IdRequerimientoColorTecnica; },
                type: "DELETE"
            },
            create: {
                url: UrlTC,
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
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdRequerimientoColorTecnica",
                fields: {
                    IdRequerimientoColorTecnica: {
                        type: "number"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    IdTecnica: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    Color: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {

                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").text() === "" ? true : $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Color']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }

                    },
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    }
                }
            }
        }



    });

    $("#GRReqDesColorTec").kendoGrid({
        autoBind: false,
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoColorTecnica");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdTecnica");
        },
        //DEFICNICIÓN DE LOS CAMPOS

        columns: [
            { field: "IdRequerimientoColorTecnica", title: "Código. Color Técnica", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdTecnica", title: "Técnicas", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlApiVTec, "GetbyServicio/" + $("#IdServicio").val(), "Seleccione un Técnica....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre técnica" },
            { field: "Color", title: "Color Diseño" }

        ]

    });

    SetGrid($("#GRReqDesColorTec").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesColorTec").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRReqDesColorTec").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRReqDesColorTec").data("kendoGrid"), DsReqColorTec);

    var sRColoTec = [];
    $("#GRReqDesColorTec").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila

        Grid_SetSelectRow($("#GRReqDesColorTec"), sRColoTec);
    });

    //#endregion fin CRUD Programación GRID Colores tecnicas

    //#region CRUD manejo de requerimiento de Desarrollo

    $("#Guardar").click(function (event) {
        event.preventDefault();
        if (ValidRD.validate()) {
            GuardarRequerimiento(UrlRD);
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#Eliminar").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("Está seguro que desea eliminar el registro", function () { return EliminarReq(UrlRD) });
    });

    $("#chkDisenoFullColor").click(function () {
        if (this.checked) {
            $("#CantidadColores").data("kendoNumericTextBox").value(12);
            $("#CantidadColores").data("kendoNumericTextBox").enable(false);

        } else {
            $("#CantidadColores").data("kendoNumericTextBox").enable(true);
        }
    });
    //#region Actualizar Base
    var ExecActBase = true
    $("#CmbBase").data("kendoComboBox").bind("change", function (e) {
        if ($("#IdRequerimiento").val() > 0) {
            event.preventDefault();
            if (ExecActBase == true) {
                if (ValidRD.validate()) {
                    if (ActualizarReq() === false) {
                        $("#CmbBase").data("kendoComboBox").value(getIdBase($("#grid").data("kendoGrid")));
                        ExecActBase = false;
                    } else {
                        ExecActBase = true;
                    };
                } else {
                    $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
                    ExecActBase = true;
                }
            } else {
                ExecActBase = true;
            }
        }


    });

    //#endregion Fin actualizar Base

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
                GuardarArtAdj(UrlApiAAdj, e);
            }
        }

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
            if (e.type == "destroy") { getAdjun(UrlApiArteAdj + "/GetByArte/" + $("#IdArte").val()); }

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
                    }
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
            { field: "Descripcion", title: "Descripción" }
        ]
    });

    SetGrid($("#GridAdjuntos").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true);
    SetGrid_CRUD_ToolbarTop($("#GridAdjuntos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GridAdjuntos").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GridAdjuntos").data("kendoGrid"), DsAdj);

    //#endregion Fin Manejo de Adjunto

    //#region CRUD Sistema de Tintas 

    $("#IdSistemaTinta").data("kendoMultiSelect").bind("deselect", function (e) {
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($("#vistaParcial"), true);
            $.ajax({
                url: UrlRtin + "/" + $("#IdRequerimiento").val() + "," + e.dataItem.IdSistemaTinta,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
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

    $("#IdSistemaTinta").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de sistema de tintas
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($("#vistaParcial"), true);
            $.ajax({
                url: UrlRtin,//
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdRequerimiento: $("#IdRequerimiento").val(),
                    IdSistemaTinta: e.dataItem.IdSistemaTinta
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($("#vistaParcial"), false);
                },
                error: function (data) {
                    getSisTintas(UrlRtin + "/GetByRequerimiento/" + $("#IdRequerimiento").val());
                    kendo.ui.progress($("#vistaParcial"), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin sistema de Tintas

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
                    CargarInfoEtapa(false);
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
                    CargarInfoEtapa(false);
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
  
}; // FIN DOCUMENT READY

var fn_VSCargar = function () {
    getRD(UrlRD + "/" + $("#txtId").val());
};

fun_List.push(fn_VSCargarJSEtapa);

fun_ListDatos.push(fn_VSCargar);

//#region Metodos Generales

let getRD = function(UrlRD) {
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: UrlRD,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (respuesta) {

            $.each(respuesta, function (index, elemento) {
                //asignacion de valores a campos en vistas
                $("#IdRequerimiento").val(elemento.IdRequerimiento);
                $("#IdUbicacion").data("kendoComboBox").value(elemento.IdUbicacion);
                $("#IdPrograma").data("kendoComboBox").value(elemento.IdPrograma);
                $("#NoDocumento").val(elemento.NoDocumento1);
                $("#IdModulo").val(elemento.IdModulo);
                $("#IdSolicitudDisenoPrenda").val(elemento.IdSolicitudDisenoPrenda);
                $("#TxtEjecutivoCuenta").val(elemento.Nombre9);
                $("#IdEjecutivoCuenta").val(elemento.IdEjecutivoCuenta);
                $("#UbicacionHor").val(elemento.UbicacionHorizontal);
                $("#UbicacionVer").val(elemento.UbicacionVertical);
                $("#CntPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
                $("#TxtCantidadSTrikeOff").data("kendoNumericTextBox").value(elemento.CantidadSTrikeOff);
                $("#CantidadColores").data("kendoNumericTextBox").value(elemento.CantidadColores);
                $("#CantidadTallas").data("kendoNumericTextBox").value(elemento.CantidadTallas);
                $("#Montaje").data("kendoNumericTextBox").value(elemento.Montaje);
                $("#Combo").data("kendoNumericTextBox").value(elemento.Combo);
                $("#Fecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha), 'dd/MM/yyyy'));
                $("#InstruccionesEspeciales").val(elemento.InstruccionesEspeciales);
                $("#Estado").val(elemento.Estado);
                $('#chkRevisionTecnica').prop('checked', elemento.RevisionTecnica);
                $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value(elemento.VelocidadMaquina);
                $("#CmbIdUnidadVelocidad").data("kendoComboBox").value(elemento.IdUnidadVelocidad);
                $('#chkDisenoFullColor').prop('checked', elemento.DisenoFullColor);
                $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(elemento.IdUnidadMedidaCantidad);
                $("#TallaPrincipal").val(elemento.TallaPrincipal);
                $("#CmbBase").data("kendoComboBox").value(elemento.IdBase);
                $("#IdCategoriaConfeccion").data("kendoComboBox").value(elemento.IdCategoriaConfeccion);
                $("#IdConstruccionTela").data("kendoComboBox").value(elemento.IdConstruccionTela);
                $("#IdComposicionTela").data("kendoComboBox").value(elemento.IdComposicionTela);
                $("#Color").val(elemento.Color);
                $("#CmbTipoLuz").data("kendoComboBox").value(elemento.IdTipoLuz);
                $("#CmbMotivoDesarrollo").data("kendoComboBox").value(elemento.IdMotivoDesarrollo);
                $("#CmbTipoAcabado").data("kendoComboBox").value(elemento.IdTipoAcabado);
                $("#CmbTMuestra").data("kendoComboBox").value(elemento.IdTipoMuestra);
                //consultar grid
                VarIDReq = elemento.IdRequerimiento;
                $("#GRDimension").data("kendoGrid").dataSource.read();
                $("#GRReqDesTec").data("kendoGrid").dataSource.read();
                $("#GRReqDesColorTec").data("kendoGrid").dataSource.read();

                //habiliar en objetos en las vistas
                $("#Guardar").data("kendoButton").enable(fn_SNAgregar(true));
                $("#Eliminar").data("kendoButton").enable(fn_SNBorrar(true));
                HabilitaFormObje(true)
                //elemento.Estado === "EDICION" ? HabilitaFormObje(true) : HabilitaFormObje(false);
                //elemento.Estado === "EDICION" || elemento.Estado === "CONFIRMADO" ? $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true)) : $("#btnCambioEstado").data("kendoButton").enable(false);

                if (Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                    elemento.DisenoFullColor === true ? KdoNumerictextboxEnable($("#CantidadColores"), false) : KdoNumerictextboxEnable($("#CantidadColores"), elemento.Estado === "EDICION" ? true : false);
                } else {
                    KdoNumerictextboxEnable($("#CantidadColores"), false);
                }
                // foco en la fecha
                $("#Fecha").data("kendoDatePicker").element.focus();

            });

            if (respuesta.length == 0) {

                HabilitaFormObje(false);
                Fn_LeerImagenes($("#Mycarousel"), "", null);
            };
            //CargarEtapasProceso(VarIDReq);
            kendo.ui.progress($("#vistaParcial"), false);
            getArte(UrlApiArte + "/GetArteByRequerimiento/" + VarIDReq.toString(), UrlApiArteAdj);
            getSisTintas(UrlRtin + "/GetByRequerimiento/" + VarIDReq.toString());
            getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + VarIDReq.toString());
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);

        }
    });
}

let getArte = function(UrlArt, UrlApiArteAdj) {
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
                kendo.ui.progress($("#vistaParcial"), false);
                UrlApiArteAdj = UrlApiArteAdj + "/GetByArte/" + respuesta.IdArte;
                getAdjun(UrlApiArteAdj);
                $("#myBtnAdjunto").data("kendoButton").enable(true);
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();

            } else {
                LimpiarArte();
                Fn_LeerImagenes($("#Mycarousel"), "", null);
                kendo.ui.progress($("#vistaParcial"), false);
                $("#myBtnAdjunto").data("kendoButton").enable(false);
                $("#IdArte").val("0");
            }


            $("#IdRequerimiento").val() !== "0" && $("#Estado").val() === "EDICION" && $("#IdArte").val() !== "0" ? $("#myBtnAdjunto").data("kendoButton").enable(true) : $("#myBtnAdjunto").data("kendoButton").enable(false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
}

let LimpiarArte = function() {
    $("#IdArte").val("0");
    $("#Nombre").val("");
    $("#EstiloDiseno").val("");
    $("#NumeroDiseno").val("");
    $("#TxtDirectorioArchivos").val("");
    $("#Mycarousel").children().remove();
    //limpiar mensajes de validacion
    //ValidArt.hideMessages();
}

let GuardarArtAdj = function(UrlAA, e) {
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
            NombreArchivo: e.files[0].name,
            Fecha: XFecha,
            Descripcion: XDescripcion
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#GridAdjuntos").data("kendoGrid").dataSource.read();
            getAdjun(UrlApiArteAdj + "/GetByArte/" + $("#IdArte").val())
            kendo.ui.progress($("#vistaParcial"), false);
            RequestEndMsg(data, XType);

        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
            ErrorMsg(data);
        }
    });
}

let EliminarArtAdj =function(UrlAA, Fn) {
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
}

let getAdjun = function(UrlAA) {
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
}

let getSisTintas =function(UrlST) {
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: UrlST,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdSistemaTinta + ",";
            });
            $("#IdSistemaTinta").data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($("#vistaParcial"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });



}

let getPrendasMultiSelec = function(Url) {
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
        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
}

//********************************
let GetStrinTallas = function(datos) {
    var Varstr = "";
    $.each(datos, function (index, elemento) {
        Varstr = Varstr + " ; " + elemento.Tallas;
    });
    $("#TallaPrincipal").val(Varstr);
}

let ObtenerTallas = function() {
    if ($("#GRDimension").data("kendoGrid").dataSource.total() > 0) {
        GetStrinTallas($("#GRDimension").data("kendoGrid").dataSource.data());
        $("#CantidadTallas").data("kendoNumericTextBox").value($("#GRDimension").data("kendoGrid").dataSource.data().length);
    } else {
        $("#TallaPrincipal").val("");
        $("#CantidadTallas").data("kendoNumericTextBox").value(0);
    }

    ActualizarReq();


}

let GuardarRequerimiento = function(UrlRD) {
    kendo.ui.progress($("#vistaParcial"), true);

    var XEstado = "EDICION";
    var XFecha = kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
    var XType = "";

    if ($("#IdRequerimiento").val() === "0") {
        XType = "Post";
        UrlRD = UrlRD + "/CrearRequerimientoDesarrollo";
    } else {
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
            IdUbicacion: $("#IdUbicacion").val(),
            NoDocumento: $("#NoDocumento").val(),
            IdSolicitudDisenoPrenda: $("#IdSolicitudDisenoPrenda").val(),
            IdModulo: $("#IdModulo").val(),
            IdEjecutivoCuenta: $("#IdEjecutivoCuenta").val(),
            UbicacionHorizontal: $("#UbicacionHor").val(),
            UbicacionVertical: $("#UbicacionVer").val(),
            CantidadPiezas: $("#CntPiezas").val(),
            CantidadSTrikeOff: $("#TxtCantidadSTrikeOff").val(),
            TallaPrincipal: $("#TallaPrincipal").val(),
            Estado: XEstado,
            Fecha: XFecha,
            InstruccionesEspeciales: $("#InstruccionesEspeciales").val(),
            CantidadColores: $("#CantidadColores").val(),
            CantidadTallas: $("#CantidadTallas").val(),
            Montaje: $("#Montaje").val(),
            Combo: $("#Combo").val(),
            RevisionTecnica: $("#chkRevisionTecnica").is(':checked'),
            VelocidadMaquina: $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value(),
            IdUnidadVelocidad: $("#CmbIdUnidadVelocidad").data("kendoComboBox").value(),
            DisenoFullColor: $("#chkDisenoFullColor").is(':checked'),
            IdUnidadMedidaCantidad: $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(),
            IdBase: $("#CmbBase").data("kendoComboBox").value(),
            IdCategoriaConfeccion: $("#IdCategoriaConfeccion").data("kendoComboBox").value(),
            IdConstruccionTela: $("#IdConstruccionTela").data("kendoComboBox").value(),
            IdComposicionTela: $("#IdComposicionTela").data("kendoComboBox").value(),
            Color: $("#Color").val(),
            //Entidad prendas
            IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
            // Entidad sistema de tintas.....
            IdSistemaTinta: $("#IdSistemaTinta").data("kendoMultiSelect").value().toString(),
            //entidad Artes
            IdArte: $("#IdArte").val(),
            IdRequerimiento: $("#IdRequerimiento").val(),
            Nombre: $("#Nombre").val(),
            EstiloDiseno: $("#EstiloDiseno").val(),
            NumeroDiseno: $("#NumeroDiseno").val(),
            DirectorioArchivos: $("#TxtDirectorioArchivos").val(),
            IdTipoLuz: $("#CmbTipoLuz").val(),
            IdMotivoDesarrollo: $("#CmbMotivoDesarrollo").val(),
            IdTipoAcabado: $("#CmbTipoAcabado").val(),
            IdTipoMuestra: $("#CmbTMuestra").val()
            
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#IdRequerimiento").val(data[0].IdRequerimiento);
            $("#IdArte").val(data[0].IdArte);
            $("#NoDocumento").val(data[0].NoDocumento1);
            $("#IdSolicitudDisenoPrenda").val(data[0].IdSolicitudDisenoPrenda);
            $("#IdModulo").val(data[0].IdModulo);
            $("#IdEjecutivoCuenta").val(data[0].IdEjecutivoCuenta),
                $("#Estado").val(data[0].Estado);

            Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#GRReqDesColorTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);

            //habilitar botones   
            $("#Eliminar").data("kendoButton").enable(fn_SNBorrar(true));
            $("#myBtnAdjunto").data("kendoButton").enable(true);
            RequestEndMsg(data, XType);
            kendo.ui.progress($("#vistaParcial"), false);

            getAdjun(UrlApiArteAdj + "/GetByArte/" + data[0].IdArte.toString());
            $("#GridAdjuntos").data("kendoGrid").dataSource.read();

            CargarInfoEtapa(false);
            $("#Fecha").data("kendoDatePicker").element.focus();

        },
        error: function (data) {
            EsCambioReg = false;
            kendo.ui.progress($("#vistaParcial"), false);
            ErrorMsg(data);
            $("#Nombre").focus().select();
        }
    });

}

let ActualizarReq = function() {
    var Actualizado = false
    var XEstado = "EDICION";
    var XFecha = kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
    $.ajax({
        url: UrlRD + "/ActualizarRequerimientoDesarrollo/" + $("#IdRequerimiento").val(),//
        type: "Put",
        dataType: "json",
        async: false,
        data: JSON.stringify({
            IdRequerimiento: $("#IdRequerimiento").val(),
            IdCliente: $("#IdCliente").val(),
            IdPrograma: $("#IdPrograma").val(),
            IdServicio: $("#IdServicio").val(),
            IdUbicacion: $("#IdUbicacion").val(),
            NoDocumento: $("#NoDocumento").val(),
            IdSolicitudDisenoPrenda: $("#IdSolicitudDisenoPrenda").val(),
            IdModulo: $("#IdModulo").val(),
            IdEjecutivoCuenta: $("#IdEjecutivoCuenta").val(),
            UbicacionHorizontal: $("#UbicacionHor").val(),
            UbicacionVertical: $("#UbicacionVer").val(),
            CantidadPiezas: $("#CntPiezas").val(),
            CantidadSTrikeOff: $("#TxtCantidadSTrikeOff").val(),
            TallaPrincipal: $("#TallaPrincipal").val(),
            Estado: XEstado,
            Fecha: XFecha,
            InstruccionesEspeciales: $("#InstruccionesEspeciales").val(),
            CantidadColores: $("#CantidadColores").val(),
            CantidadTallas: $("#CantidadTallas").val(),
            Montaje: $("#Montaje").val(),
            Combo: $("#Combo").val(),
            RevisionTecnica: $("#chkRevisionTecnica").is(':checked'),
            VelocidadMaquina: $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value(),
            IdUnidadVelocidad: $("#CmbIdUnidadVelocidad").data("kendoComboBox").value(),
            DisenoFullColor: $("#chkDisenoFullColor").is(':checked'),
            IdUnidadMedidaCantidad: $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(),
            IdBase: $("#CmbBase").data("kendoComboBox").value(),
            IdCategoriaConfeccion: $("#IdCategoriaConfeccion").data("kendoComboBox").value(),
            IdConstruccionTela: $("#IdConstruccionTela").data("kendoComboBox").value(),
            IdComposicionTela: $("#IdComposicionTela").data("kendoComboBox").value(),
            Color: $("#Color").val(),
            //Entidad prendas
            IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
            // Entidad sistema de tintas.....
            IdSistemaTinta: $("#IdSistemaTinta").data("kendoMultiSelect").value().toString(),
            //entidad Artes
            IdArte: $("#IdArte").val(),
            IdRequerimiento: $("#IdRequerimiento").val(),
            Nombre: $("#Nombre").val(),
            EstiloDiseno: $("#EstiloDiseno").val(),
            NumeroDiseno: $("#NumeroDiseno").val(),
            DirectorioArchivos: $("#TxtDirectorioArchivos").val(),
            IdTipoLuz: $("#CmbTipoLuz").val(),
            IdMotivoDesarrollo: $("#CmbMotivoDesarrollo").val(),
            IdTipoAcabado: $("#CmbTipoAcabado").val(),
            IdTipoMuestra: $("#CmbTMuestra").val()

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            EsCambioReg = true; // activo esta variable para que no ejecute el codigo que esta en el evento change
            Actualizado = true;
            RequestEndMsg(data, "Put");
            var uid = $("#grid").data("kendoGrid").dataSource.get(data[0].IdRequerimiento).uid;
            Fn_UpdFilaGridRD($("#grid").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']"), data[0]);
            EsCambioReg = false; //Inactivo esta variable para que ejecute el codigo que esta en el evento change
        },
        error: function (data) {
            Actualizado = false;
            ErrorMsg(data);
        }
    });

    return Actualizado;

}

let EliminarReq = function(UrlRD) {
    kendo.ui.progress($("#vistaParcial"), true);
    UrlRD = UrlRD + "/" + $("#IdRequerimiento").val();
    $.ajax({
        url: UrlRD,//
        type: "Delete",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            LimpiarReq();
            LimpiarArte();
            $("#IdCategoriaPrenda").data("kendoMultiSelect").value("");
            $("#IdSistemaTinta").data("kendoMultiSelect").value("");
            $("#Guardar").data("kendoButton").enable(fn_SNAgregar(true));
            $("#Eliminar").data("kendoButton").enable(false);
            kendo.ui.progress($("#vistaParcial"), false);
            RequestEndMsg(data, "Delete");
        },
        error: function (e) {
            kendo.ui.progress($("#vistaParcial"), false);
            ErrorMsg(e)
            $("#Nombre").focus().select();
        }
    });
}

let LimpiarReq = function() {

    $("#IdRequerimiento").val("0");
    $("#IdUbicacion").data("kendoComboBox").value("");
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
    $("#CantidadColores").data("kendoNumericTextBox").value("0");
    $("#CantidadTallas").data("kendoNumericTextBox").value("0");
    $("#Montaje").data("kendoNumericTextBox").value("0");
    $("#Combo").data("kendoNumericTextBox").value("0");
    $("#TallaPrincipal").val("");
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    $("#InstruccionesEspeciales").val("");
    $("#Estado").val("");
    $('#chkRevisionTecnica').prop('checked', 0);
    $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value("0");
    $("#CmbIdUnidadVelocidad").data("kendoComboBox").value("");
    $('#chkDisenoFullColor').prop('checked', 0);
    $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value("");
    $("#CmbBase").data("kendoComboBox").value("");
    $("#IdCategoriaConfeccion").data("kendoComboBox").value("");
    $("#IdConstruccionTela").data("kendoComboBox").value("");
    $("#IdComposicionTela").data("kendoComboBox").value("");
    $("#Color").val("");
    $("#CmbTipoLuz").data("kendoComboBox").value("");
    $("#CmbMotivoDesarrollo").data("kendoComboBox").value("");
    $("#CmbTMuestra").data("kendoComboBox").value("");
    $("#CmbTipoAcabado").data("kendoComboBox").value("");
    //limpiar mensajes de validacion
    ValidRD.hideMessages();

}

let OcultarCamposReq = function (ToF) {

    if (ToF) {
        // mostrar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
        //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
        //el servisio de Serigrafia
        $('#Row4RD').prop('hidden', false);
        $('#Row5RD').prop('hidden', false);

    } else {
        // ocultar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
        //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
        //el servisio de Serigrafia
        $('#Row4RD').prop('hidden', true);
        $('#Row5RD').prop('hidden', true);
    }

}

let Fn_UpdFilaGridRD = function(g, data) {
    g.set("NoDocumento", data.NoDocumento);
    g.set("IdPrograma", data.IdPrograma);
    g.set("NoDocumento1", data.NoDocumento1);
    g.set("IdUbicacion", data.IdUbicacion);
    g.set("Nombre1", data.Nombre1);
    g.set("UbicacionHorizontal", data.UbicacionHorizontal);
    g.set("UbicacionVertical", data.UbicacionVertical);
    g.set("CantidadPiezas", data.CantidadPiezas);
    g.set("Fecha", kendo.toString(kendo.parseDate(data.Fecha), 'dd/MM/yyyy'));
    g.set("IdBase", data.IdBase);
    g.set("Nombre5", data.Nombre5);
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
}

let Fn_VerEstados = function (IdRequerimiento) {
    Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null", IdRequerimiento);
}

let onCloseCambioEstado = function (e) {
    $("#grid").data("kendoGrid").dataSource.read();
}

let getIdReq = function (g) {
    return $("Id").val();
}

let getIdBase = function(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdBase;
}

let getIdArte = function(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;
}

let HabilitaFormObje = function(ToF) {
    KdoDatePikerEnable($("#Fecha"), ToF);
    KdoNumerictextboxEnable($("#CntPiezas"), ToF);
    KdoNumerictextboxEnable($("#TxtCantidadSTrikeOff"), ToF);
    //KdoNumerictextboxEnable($("#CantidadTallas"), ToF);
    KdoNumerictextboxEnable($("#Montaje"), ToF);
    KdoNumerictextboxEnable($("#Combo"), ToF);
    KdoNumerictextboxEnable($("#TxtVelocidadMaquina"), ToF);
    KdoNumerictextboxEnable($("#CantidadColores"), ToF);
    KdoComboBoxEnable($("#CmbIdUnidadMedidaCantidad"), ToF);
    KdoComboBoxEnable($("#IdPrograma"), ToF);
    KdoComboBoxEnable($("#CmbIdUnidadVelocidad"), ToF);
    KdoComboBoxEnable($("#CmbBase"), ToF);
    KdoComboBoxEnable($("#IdComposicionTela"), ToF);
    KdoComboBoxEnable($("#IdCategoriaConfeccion"), ToF);
    KdoComboBoxEnable($("#IdConstruccionTela"), ToF);
    KdoComboBoxEnable($("#IdUbicacion"), ToF);
    KdoMultiselectEnable($("#IdCategoriaPrenda"), ToF);
    KdoMultiselectEnable($("#IdSistemaTinta"), ToF);
    KdoCheckBoxEnable($("#chkRevisionTecnica"), ToF);
    KdoCheckBoxEnable($("#chkDisenoFullColor"), ToF);
    TextBoxEnable($("#InstruccionesEspeciales"), ToF);
    TextBoxEnable($("#Color"), ToF);
    TextBoxEnable($("#Nombre"), ToF);
    TextBoxEnable($("#NumeroDiseno"), ToF);
    TextBoxEnable($("#EstiloDiseno"), ToF);
    TextBoxReadOnly($("#TxtDirectorioArchivos"), ToF);
    KdoButtonEnable($("#Guardar"), ToF);
    KdoButtonEnable($("#Eliminar"), ToF);
    KdoComboBoxEnable($("#CmbTipoLuz"), ToF);
    KdoComboBoxEnable($("#CmbTipoAcabado"), ToF);

}

let HabilitaObje = function(e, ToF) {
    ToF == true ? e.removeClass("k-state-disabled") : e.addClass("k-state-disabled");
}

 fPermisos = function (datos) {
    Permisos = datos;
}

 fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
}

 fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
}

 fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
}

 fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
}

 fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
}

 fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
}

let LimpiaMarcaCelda = function() {
    $(".k-dirty-cell", $("#grid")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#grid")).remove();
}

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
}

let CmbNuevoItem = function(widgetId, value) {
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


//#endregion Fin metods Generales