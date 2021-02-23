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
let vIdReqTecnica = 0;

fPermisos = function (datos) {
    Permisos = datos;
};
var fn_VSCargarJSEtapa = function () {
    KdoButton($("#btnCCDis"), "search", "Catalogo de Diseños");

    $("#btnCCDis").data("kendoButton").bind("click", function () {
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
        fn_ConsultarCatalogoDiseno("ConsultaCataloDis", $("#IdCliente").val());
    });
    //$("#ConsultaCataloDis").on("GetRowCatalogo", function (event, Datos) {
    //    $("#IdCatalogoDiseno").val(Datos.IdCatalogoDiseno);
    //    $("#NoReferencia").val(Datos.NoReferencia);
    //});
    //#region Inicialización de variables y controles Kendo
 
    KdoButton($("#Guardar"), "save", "Guardar");
    KdoButton($("#myBtnAdjunto"), "attachment", "Adjuntar Diseños");
    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnCerrarAdj"), "close-circle", "Cerrar");
    // deshabilitar botones en formulario
    $("#myBtnAdjunto").data("kendoButton").enable(false);
    $("#Fecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#Fecha").data("kendoDatePicker").value(Fhoy());
    $("#Guardar").data("kendoButton").enable(false);
    PanelBarConfig($("#BarPanel"));
    KdoDatePikerEnable($("#Fecha"), false);
    fn_CmbCriterioCalidad();
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

    $("#CantidadColores").kendoNumericTextBox({
        min: 0,
        //max: 12,
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
                        return $("#IdServicio").val() !== "2" ? $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0 : true;
                    }
                    return true;
                },
                UbicacionVerRuler: function (input) {
                    if (input.is("[name='UbicacionVer']")) {
                        return input.val().length <= 2000;
                    }
                    return true;
                },
                UbicacionHorRuler: function (input) {
                    if (input.is("[name='UbicacionHor']")) {
                        return input.val().length <= 2000;
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
                        return input.val().length>0 && input.val().length <= 2000;
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
                //MsgCmbAcabado: function (input) {
                //    if (input.is("[name='CmbTipoAcabado']")) {
                //        return $("#CmbTipoAcabado").data("kendoComboBox").selectedIndex >= 0;
                //    }
                //    return true;
                //},
                vQui: function (input) {
                    if (input.is("[name='CmbQuimica']")) {
                        return $("#CmbQuimica").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }

            },
            messages: {
                //Mayor0: "Debe ser mayor a 0",
                MsgLongitud: "Debe ser mayor a 0",
                InstruccionesEspecialesRuler: "Longitud máxima del campo es 2000",
                required: "Requerido",
                MsgCmbPro: "Requerido",
                MsgCmbIdPrograma: "Requerido",
                MsgCmbUbicacion: "Requerido",
                UbicacionVerRuler: "Longitud máxima del campo es 200",
                UbicacionHorRuler: "Longitud máxima del campo es 200",
                MsgCmbIdUnidadMedidaCantidad: "Requerido",
                CantidadColoresMsg: "requerido",
                ColorRuler: "Longitud máxima del campo es 200",
                MsgIdCategoriaConfeccion: "Requerido",
                MsgIdComposicionTela: "Requerido",
                MsgIdConstruccionTela: "Requerido",
                MsgCombo: "Requerido",
                NombreRuler: "Longitud máxima del campo es 200",
                NumeroDisenoRuler: "Longitud máxima del campo es 200",
                EstiloDisenoRuler: "Longitud máxima del campo es 200",
                TxtDirectorioArchivosRuler: "Requerido Longitud máxima del campo es 2000",
                MsgCmbTipoLuz: "Requerido",
                MsgCmbMotivo: "Requerido",
                //MsgCmbAcabado: "Requerido",
                MsgCmbTMuestra: "Requerido",
                vQui:"Requerido"
            }
        }
    ).data("kendoValidator");

  

    Kendo_CmbFiltrarGrid($("#IdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un Servicio ....");
    $("#IdServicio").data("kendoComboBox").wrapper.hide();
    Kendo_CmbFiltrarGrid($("#IdCliente"), UrlApiClient, "Nombre", "IdCliente", "Seleccione un Cliente ....");
    $("#IdCliente").data("kendoComboBox").dataSource.read();
    $("#IdCliente").data("kendoComboBox").wrapper.hide();
    Kendo_CmbFiltrarGrid($("#IdPrograma"), UrlApiPro, "Nombre", "IdPrograma", "Seleccione ...", "", "IdCliente");
    Kendo_MultiSelect($("#IdCategoriaPrenda"), UrlApiCPre, "Nombre", "IdCategoriaPrenda", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdUbicacion"), UrlApiUEstam, "Nombre", "IdUbicacion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdCategoriaConfeccion"), UrlApiCConfec, "Nombre", "IdCategoriaConfeccion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdConstruccionTela"), UrlApiConsTela, "Nombre", "IdConstruccionTela", "Seleccione ...");
    KdoCmbComboBox($("#IdComposicionTela"), UrlApiCompTela, "Nombre", "IdComposicionTela", "Seleccione ...", "", "", "", "CmbNuevoItem");
    Kendo_CmbFiltrarGrid($("#CmbTipoLuz"), UrlTL, "Nombre", "IdTipoLuz", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbMotivoDesarrollo"), UrlMD, "Nombre", "IdMotivoDesarrollo", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTipoAcabado"), UrlTA, "Nombre", "IdTipoAcabado", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbTMuestra"), UrlTMues, "Nombre", "IdTipoMuestra", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#CmbQuimica"), UrlQuimi, "Nombre", "IdQuimica", "Seleccione ...");

    //solicita tela sustituta
    $("#swchSolTelaSustituta").kendoSwitch();
    $("#swchSolDesarrolloOEKO").kendoSwitch();
    $("#swchPoseeDocumentacionAduanal").kendoSwitch();
    $("#swchCobrarDiseno").kendoSwitch();


    $("#swchSolTelaSustituta").data("kendoSwitch").check(false);
    $("#swchSolDesarrolloOEKO").data("kendoSwitch").check(false);
    $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").check(false);
    $("#swchCobrarDiseno").data("kendoSwitch").check(false);

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

    KdoNumerictextboxEnable($("#CantidadTallas"), false);
    HabilitaFormObje(false);

    //#endregion FIN Inicialización de variables y controles Kendo

    //#region CRUD Programación GRID Dimensiones
    let DsDimension = new kendo.data.DataSource({
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
            Grid_requestEnd(e);
        },
        // VALIDAR ERROR
        error: Grid_error,
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
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $('[name="C3"]').is(':checked') === true ? input.val().length > 0 && input.val().length <= 2000 : input.val().length <= 2000;
                                }

                                return true;
                            }
                        }
                    },
                    C3: {
                        type: "bool"
                    },
                    DimensionesRelativas: { type: "string" },
                    DesarrollarTalla: {
                        type: "bool", defaultValue: function (e) { return false; }
                    }
                }
            }
        }
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
            { field: "IdCategoriaTalla", title: "Tallas a Desarrollar", editor: Grid_Combox, values: ["IdCategoriaTalla", "Nombre", UrlApiCT, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Nombre", title: "Tallas a Desarrollar" },
            { field: "Tallas", title: "Rango de Tallas" }, //aggregates: ["count"], footerTemplate: "Cantidad de Tallas: #: data.Tallas ? data.Tallas.count: 0 #" 
            { field: "C3", title: "Dimensión Relativa", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "C3"); } },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "IdUnidad", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlApiUM, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "Abreviatura", title: "Unidad de Medida" },
            { field: "DimensionesRelativas", title: "Medidas Relativas" },
            { field: "DesarrollarTalla", title: "¿Talla a desarrollar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "DesarrollarTalla"); } },
        ]

    });

    SetGrid($("#GRDimension").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRDimension").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRDimension").data("kendoGrid"), Permisos.SNEditar,Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRDimension").data("kendoGrid"), DsDimension);
   
    var selectedRowsDimen = [];
    $("#GRDimension").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRDimension"), selectedRowsDimen);
        ObtenerTallas();
    });

    //#endregion Fin CRUD Programación GRID Dimensiones

 

    //#region CRUD Programación GRID Tecnicas y colores

    let DsReqColor = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlColor + "/GetRequerimientoDesarrollosColoresByIdRequerimiento/" + VarIDReq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlColor + "/" + datos.IdRequerimientoColor; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlColor + "/" + datos.IdRequerimientoColor; },
                type: "DELETE"
            },
            create: {
                url: UrlColor,
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
                id: "IdRequerimientoColor",
                fields: {
                    IdRequerimientoColor: {
                        type: "number"
                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    Color: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='Color']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdTipoIgualacionColor']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoIgualacionColor").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }

                    },
                    ColorHex: {
                        type: "string",
                        defaultValue: function () {
                            return "#FFF";
                        }
                    },
                    IdTipoPantonera: {
                        type: "string"
                    },
                    Item: {
                        type: "number"
                    },
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    CodigoPantone: {
                        type: "string"
                    },
                    ID: {
                        type: "string"
                    },
                    IdTipoIgualacionColor: {
                        type: "string"
                    },
                    NombreIgualacion: {
                        type: "string"
                    }
                }
                
            }
        }
    });    

    $("#GRReqDesColor").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoColor");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "CodigoPantone");
            KdoHideCampoPopup(e.container, "IdTipoPantonera");
            KdoHideCampoPopup(e.container, "NombreIgualacion");

            //$('[name="ColorHex"]').data("kendoColorPicker").enable(false);

            $('[name="ID"]').on("change", function (e) {
                if ($(this).data("kendoMultiColumnComboBox").dataItem() !== undefined) {
                    if ($(this).data("kendoMultiColumnComboBox").selectedIndex >= 0) {
                        var data = $(this).data("kendoMultiColumnComboBox").dataItem();

                        $('[name="ColorHex"]').data("kendoColorPicker").value(data.ColorHex);
                        $('[name="ColorHex"]').data("kendoColorPicker").trigger("change");
                        $('[name="Color"]').val(data.Codigo);
                        $('[name="Color"]').trigger("change");
                        //$('[name="Item"]').val(data.Item);
                        $('[name="Item"]').data("kendoNumericTextBox").value(data.Item);
                        $('[name="Item"]').data("kendoNumericTextBox").trigger("change");
                        $('[name="IdTipoPantonera"]').val(data.IdTipoPantonera);
                        $('[name="IdTipoPantonera"]').trigger("change");
                    } 
                    
                } else {

                    //$('[name="Item"]').val(data.Item);
                    $('[name="Item"]').data("kendoNumericTextBox").value(null);
                    $('[name="Item"]').data("kendoNumericTextBox").trigger("change");
                    $('[name="IdTipoPantonera"]').val(null);
                    $('[name="IdTipoPantonera"]').trigger("change");
                }
            });

            if (!e.model.isNew() && e.model.Item !== null) {
                $('[name="ID"]').data("kendoMultiColumnComboBox").text(e.model.CodigoPantone);
                $('[name="ID"]').data("kendoMultiColumnComboBox").trigger("change");
                $('[name="ID"]').data("kendoMultiColumnComboBox").search(e.model.ID);
                $('[name="ID"]').data("kendoMultiColumnComboBox").refresh();
                $('[name="ID"]').data("kendoMultiColumnComboBox").close();
         
            }
            if (e.model.isNew()) {
                Grid_Focus(e, "ID");
            } else {
                Grid_Focus(e, "Color");
            }
      
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoColor", title: "Código. Desarrollo Color", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            {
                field: "ID", title: "Código Pantone",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlPantones();
                },
                hidden: true
            },
            { field: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "Color", title: "Color Diseño" },
            { field: "CodigoPantone", title: "Codigó Pantone" },
            {
                field: "ColorHex", title: "Muestra", width: "120px",
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>',
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).kendoColorPicker();
                }
            },
            { field: "IdTipoIgualacionColor", title: "Igualar Color a:", values: ["IdTipoIgualacionColor", "Nombre", TSM_Web_APi + "/TiposIgualacionesColores", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "NombreIgualacion", title: "Igualar a:" },

            { field: "IdTipoPantonera", title: "Tipo Pantone", hidden: true, menu: false }
        ]
    });

    SetGrid($("#GRReqDesColor").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesColor").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRReqDesColor").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRReqDesColor").data("kendoGrid"), DsReqColor);

    var sRColo = [];
    $("#GRReqDesColor").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRReqDesColor"), sRColo);
    });


    let DsReqTec = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/GetRequerimientoDesarrollosColoresTecnicaByIdRequerimiento/" + VarIDReq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi +"RequerimientoDesarrollosMuestrasTecnicas",
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
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return  $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
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

    $("#GRReqDesTec").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoTecnica");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdTecnica");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoTecnica", title: "Código. Muestra Técnica", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdTecnica", title: "Técnicas", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlApiVTec, "GetbyServicio/" + $("#IdServicio").val(), "Seleccione un Técnica....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre técnica" }

        ]

    });

    SetGrid($("#GRReqDesTec").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesTec").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRReqDesTec").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRReqDesTec").data("kendoGrid"), DsReqTec);

    var sRTec = [];
    $("#GRReqDesTec").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRReqDesTec"), sRTec);
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
    $("#chkDisenoFullColor").click(function () {
        if (this.checked) {
            $("#CantidadColores").data("kendoNumericTextBox").value(12);
            $("#CantidadColores").data("kendoNumericTextBox").enable(false);

        } else {
            $("#CantidadColores").data("kendoNumericTextBox").enable(true);
        }
    });

    //#endregion FIN CRUD manejo de requerimiento de Desarrollo

    //#region grid ingreso Foil  
    let UrlArtF = TSM_Web_APi + "Articulos/GetFoil";
    let DsReqFoil = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasFoil/GetFoilByIdRequerimiento/" + VarIDReq; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasFoil/" + datos.IdRequerimientoFoil; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasFoil/" + datos.IdRequerimientoFoil; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasFoil",
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
                id: "IdRequerimientoFoil",
                fields: {
                    IdRequerimientoFoil: {
                        type: "number"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    IdArticulo: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
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

    $("#GRReqDesFoil").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoFoil");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdArticulo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoFoil", title: "Código Foil", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdArticulo", title: "Foil", editor: Grid_Combox, values: ["IdArticulo", "Nombre", UrlArtF, "", "Seleccione un Foil....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre Foil" }

        ]

    });

    SetGrid($("#GRReqDesFoil").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesFoil").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRReqDesFoil").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRReqDesFoil").data("kendoGrid"), DsReqFoil);

    var sRFoil = [];
    $("#GRReqDesFoil").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRReqDesFoil"), sRFoil);
    });

    //#endregion 

    //#region Articulos sugeridos  
    let UrlArtSug = TSM_Web_APi + "tecnicasArticulos/GetByidTecnica/0";
    let DsArtSugeridos = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicasArticulos/GetByidRequerimientoTecnica/" + vIdReqTecnica; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicasArticulos/" + datos.IdRequerimientoTecnica + "/" + datos.IdArticulo; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicasArticulos",
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
                id: "IdArticulo",
                fields: {
                    IdRequerimientoTecnica: {
                        type: "number", defaultValue: function () {
                            return Fn_getIdRequerimientoTecnica($("#GRReqDesTec").data("kendoGrid"));
                        }
                    },
                    IdArticulo: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
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

    $("#GRReqDesArtSug").kendoGrid({
        edit: function (e) {
            // Ocultar
            $('[name="IdArticulo"]').data("kendoComboBox").setDataSource(Fn_GetTecnicasArtSugeridos(Fn_getIdTecnica($("#GRReqDesTec").data("kendoGrid"))));
            KdoHideCampoPopup(e.container, "IdRequerimientoTecnica");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdArticulo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoTecnica", title: "Código Tecnica", hidden: true },
            { field: "IdArticulo", title: "Articulo Sugerido", editor: Grid_Combox, values: ["IdArticulo", "Nombre", UrlArtSug, "", "Seleccione un Articulo....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre" }

        ]

    });

    SetGrid($("#GRReqDesArtSug").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesArtSug").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GRReqDesArtSug").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GRReqDesArtSug").data("kendoGrid"), DsArtSugeridos);

    var sRsug = [];
    $("#GRReqDesArtSug").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRReqDesArtSug"), sRsug);
    });

    $("#GRReqDesTec").data("kendoGrid").bind("change", function (e) { //foco en la fila
        fn_ConsultarArtSug();
    });


    //#endregion 
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
                url: function (datos) { return UrlApiAAdj + "/GetArteAdjuntosVista/" + $("#IdArte").val().toString(); },
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
                        //borar la imagen del catalohgo cuando el tipo de adjunto sea # 1
                        //if (datos.IdTipoAdjunto === "1") {
                        //    EliminarArtAdj("/RequerimientoDesarrollos/BorrarArchivo/" + $("#NoReferencia").val(), datos.NombreArchivo);
                        //}
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
            if (e.type === "destroy" || e.type === "update") {
                getAdjun(UrlApiArteAdj + "/GetVistaImagenes/" + $("#IdArte").val());
                if (e.type === "update") {
                    if (e.response[0].IdTipoAdjunto=== 1) {
                        var dsres = [{
                            NoDocumento: $("#NoDocumento").val(),
                            NoReferencia: $("#NoReferencia").val(),
                            NombreArchivo: e.response[0].NombreArchivo
                        }];
                        fn_SubirArchivoCatalogo(dsres);
                    }
                }
            }

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

            if (e.model.Catalogo === true) {
                KdoHideCampoPopup(e.container, "IdTipoAdjunto");
            }
        },
        columns: [
            { field: "Id", title: "ID", hidden: true },
            { field: "IdArte", title: "IdArte", hidden: true },
            { field: "Item", title: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "NombreArchivo", title: "Nombre del Archivo", template: function (data) { return "<a href='/Adjuntos/" + $("#NoDocumento").val() + "/" + data["NombreArchivo"] + "' target='_blank' style='text-decoration: underline;'>" + data["NombreArchivo"] + "</a>"; } },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy}" },
            { field: "Descripcion", title: "Descripción", hidden: true },
            { field: "Catalogo", title: "Catalogo ?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Catalogo"); }, hidden: true },
            { field: "Placement", title: "Placement ?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Placement"); }, hidden: true},
            { field: "IdTipoAdjunto", title: "Tipo de Adjunto", editor: Grid_Combox, values: ["IdTipoAdjunto", "Nombre", TSM_Web_APi + "TiposAdjuntos", "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreAdjunto", title: "Nombre Adjunto" }
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

    $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_GetCriteriosCalidad(this.dataItem(e.item.index()).IdCalidadCriterio);
        }
        else {
            fn_GetCriteriosCalidad(0);
        }
    });
    $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            fn_GetCriteriosCalidad(0);
        }
    });

    $("#IdComposicionTela").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").value("");
            $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").setDataSource(fn_GetComposicionCalidad(this.dataItem(e.item.index()).IdComposicionTela));
            fn_GetCriteriosCalidad(0);
        }
        else {
            $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").value("");
            $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").setDataSource(fn_GetComposicionCalidad(0));
            fn_GetCriteriosCalidad(0);
        }
    });

    $("#IdComposicionTela").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").value("");
            $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").setDataSource(fn_GetComposicionCalidad(0));
            fn_GetCriteriosCalidad(0);
        }
    });

    //#endregion Fin Prendas multi select
    $("#IdRequerimiento").val($("#txtId").val());
    $("#UbicacionVer").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#UbicacionHor").autogrow({ vertical: true, horizontal: false, flickering: false });

 
  
}; // FIN DOCUMENT READY

var fn_VSCargar = function () {
    let RdVUrl = TSM_Web_APi + "RequerimientoDesarrollos/" + $("#txtId").val();
    getRD(RdVUrl);
    if ($("#txtEstado").val() !== "ACTIVO" || EtpSeguidor===true || EtpAsignado===false) {
    
        KdoDatePikerEnable($("#Fecha"), false);
        TextBoxEnable($("#TxtEjecutivoCuenta"), false);
        KdoNumerictextboxEnable($("#TxtCantidadSTrikeOff"), false);
        KdoNumerictextboxEnable($("#TxtStrikeOffAdicional"), false);
        KdoComboBoxEnable($("#CmbMotivoDesarrollo"), false);
        KdoComboBoxEnable($("#IdUbicacion"), false);
        $("#UbicacionVer").attr("disabled", true);
        $("#UbicacionHor").attr("disabled", true);
        KdoComboBoxEnable($("#CmbIdUnidadMedidaCantidad"), false);
        $("#InstruccionesEspeciales").attr("disabled", true);
        $("#NumeroDiseno").attr("disabled", true);
        $("#EstiloDiseno").attr("disabled", true);
        $("#TxtDirectorioArchivos").attr("disabled", true);
        KdoComboBoxEnable($("#IdCategoriaConfeccion"), false);
        KdoComboBoxEnable($("#IdConstruccionTela"), false);
        KdoComboBoxEnable($("#IdComposicionTela"), false);
        $("#TxtColorTela").attr("disabled", true);
        $("#Nombre").attr("disabled", true);
        KdoComboBoxEnable($("#CmbTipoAcabado"), false);
        KdoComboBoxEnable($("#CmbTipoLuz"), false);
        $("#IdCategoriaPrenda").attr("readonly", true);
        KdoCheckBoxEnable($("#chkDisenoFullColor"), false);
        KdoComboBoxEnable($("#CmbMotivoDesarrollo"), false);
        KdoComboBoxEnable($("#CmbTMuestra"), false);
        KdoComboBoxEnable($("#CmbQuimica"), false);
        var mulselect = $("#IdCategoriaPrenda").data("kendoMultiSelect");
        mulselect.readonly(true);

        KdoNumerictextboxEnable($("#CntPiezas"), false);
        KdoNumerictextboxEnable($("#Combo"), false);
        KdoNumerictextboxEnable($("#CantidadColores"), false);
        KdoNumerictextboxEnable($("#CantidadTallas"), false);
        KdoButtonEnable($("#Guardar"), false);
        KdoButtonEnable($("#myBtnAdjunto"), false);
        Grid_HabilitaToolbar($("#GRDimension"), false, false, false);
        Grid_HabilitaToolbar($("#GRReqDesColor"), false, false, false);
        Grid_HabilitaToolbar($("#GRReqDesTec"), false, false, false);
        Grid_HabilitaToolbar($("#GRReqDesFoil"), false, false, false);
        Grid_HabilitaToolbar($("#GRReqDesArtSug"), false, false, false);

        KdoComboBoxEnable($("#IdPrograma"), false);
        $("#swchSolTelaSustituta").data("kendoSwitch").enable(false);
        $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").enable(false);
        $("#swchSolDesarrolloOEKO").data("kendoSwitch").enable(false);
        $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").enable(false);
        $("#swchCobrarDiseno").data("kendoSwitch").enable(false);
    }
};

var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = fn_VSCargar;

fun_List.push(fn_VSCargarJSEtapa);
fun_ListDatos.push(EtapaPush);

//#region Metodos Generales

let getRD = function (UrlRD) {
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
                $("#TxtEjecutivoCuenta").val(elemento.Nombre8);
                $("#IdEjecutivoCuenta").val(elemento.IdEjecutivoCuenta);
                $("#UbicacionHor").val(elemento.UbicacionHorizontal);
                $("#UbicacionVer").val(elemento.UbicacionVertical);
                $("#CntPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
                $("#TxtCantidadSTrikeOff").data("kendoNumericTextBox").value(elemento.CantidadStrikeOff);
                $("#TxtStrikeOffAdicional").data("kendoNumericTextBox").value(elemento.StrikeOffAdicional);
                $("#CantidadColores").data("kendoNumericTextBox").value(elemento.CantidadColores);
                $("#CantidadTallas").data("kendoNumericTextBox").value(elemento.CantidadTallas);
                $("#Combo").data("kendoNumericTextBox").value(elemento.Combo);
                $("#Fecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha), 'dd/MM/yyyy'));
                $("#InstruccionesEspeciales").val(elemento.InstruccionesEspeciales);
                $("#Estado").val(elemento.Estado);
                $('#chkDisenoFullColor').prop('checked', elemento.DisenoFullColor);
                $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(elemento.IdUnidadMedidaCantidad);
                $("#TallaPrincipal").val(elemento.TallaPrincipal);
                $("#IdCategoriaConfeccion").data("kendoComboBox").value(elemento.IdCategoriaConfeccion);
                $("#IdConstruccionTela").data("kendoComboBox").value(elemento.IdConstruccionTela);
                $("#IdComposicionTela").data("kendoComboBox").value(elemento.IdComposicionTela);
                $("#TxtColorTela").val(elemento.Color);
                $("#CmbTipoLuz").data("kendoComboBox").value(elemento.IdTipoLuz);
                $("#CmbMotivoDesarrollo").data("kendoComboBox").value(elemento.IdMotivoDesarrollo);
                $("#CmbTipoAcabado").data("kendoComboBox").value(elemento.IdTipoAcabado);
                $("#CmbTMuestra").data("kendoComboBox").value(elemento.IdTipoMuestra);
                KdoCmbSetValue($("#CmbQuimica"), elemento.IdQuimica);
                //consultar grid
                VarIDReq = elemento.IdRequerimiento;
                $("#GRDimension").data("kendoGrid").dataSource.read();
                $("#GRReqDesColor").data("kendoGrid").dataSource.read();
                $("#GRReqDesTec").data("kendoGrid").dataSource.read();
                $("#GRReqDesFoil").data("kendoGrid").dataSource.read();
                //habilitar grillas  
                Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
                Grid_HabilitaToolbar($("#GRReqDesColor"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
                Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
                Grid_HabilitaToolbar($("#GRReqDesFoil"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
                Grid_HabilitaToolbar($("#GRReqDesArtSug"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);


                //habiliar en objetos en las vistas
                xNoPermiteActualizar === false ? $("#Guardar").data("kendoButton").enable(fn_SNAgregar(true)) : $("#Guardar").data("kendoButton").enable(fn_SNAgregar(false)); //xNoPermiteActualizar es igual a true bloquear
                xNoPermiteActualizar === false ? HabilitaFormObje(true) : HabilitaFormObje(false); //xNoPermiteActualizar es igual a true bloquear
                if (xNoPermiteActualizar === true) {
                    KdoComboBoxEnable($("#CmbMotivoDesarrollo"), true);
                    $("#Guardar").data("kendoButton").enable(fn_SNAgregar(true));
                    KdoNumerictextboxEnable($("#CntPiezas"), true);
                    KdoNumerictextboxEnable($("#TxtCantidadSTrikeOff"), true);
                    KdoNumerictextboxEnable($("#TxtStrikeOffAdicional"), true);
                    KdoComboBoxEnable($("#IdComposicionTela"), true);
                    KdoComboBoxEnable($("#IdCategoriaConfeccion"), true);
                    KdoComboBoxEnable($("#IdConstruccionTela"), true);
                    KdoComboBoxEnable($("#CmbTipoLuz"),true);
                    KdoComboBoxEnable($("#CmbTMuestra"), true);
                    KdoComboBoxEnable($("#CmbQuimica"), true);
                    $("#swchSolTelaSustituta").data("kendoSwitch").enable(true);
                    $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").enable(true);
                    $("#swchSolDesarrolloOEKO").data("kendoSwitch").enable(true);
                    $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").enable(true);
                    $("#swchCobrarDiseno").data("kendoSwitch").enable(true);
                    KdoComboBoxEnable($("#CmbIdUnidadMedidaCantidad"), true);
                    $("#TxtDirectorioArchivos").removeAttr("disabled");
                    $("#TxtDirectorioArchivos").removeAttr("readonly");
                } 
                Fn_EnablePanelBar($("#BarPanel"), $("#BPGRReqDesTec"), false);
                $("#swchSolTelaSustituta").data("kendoSwitch").check(elemento.SolicitaTelaSustituta);
                $("#swchSolDesarrolloOEKO").data("kendoSwitch").check(elemento.StandarOEKOTEX);
                $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").check(elemento.PoseeDocumentacionAduanal);
                $("#swchCobrarDiseno").data("kendoSwitch").check(elemento.CobrarDiseno);
                $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").setDataSource(fn_GetComposicionCalidad(elemento.IdComposicionTela === null ? 0 : elemento.IdComposicionTela));
                $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").value(elemento.IdCalidadCriterio);
                fn_GetCriteriosCalidad(elemento.IdCalidadCriterio);

                if (elemento.IdServicio === 1) {
                    elemento.DisenoFullColor === true ? KdoNumerictextboxEnable($("#CantidadColores"), false) : KdoNumerictextboxEnable($("#CantidadColores"), elemento.Estado === "EDICION" ? true : false);
                } else {
                    KdoNumerictextboxEnable($("#CantidadColores"), false);
                    KdoCheckBoxEnable($("#chkDisenoFullColor"), false);
                }
                // foco en la fecha
                $("#Fecha").data("kendoDatePicker").element.focus();

            });

            if (respuesta.length === 0) {

                HabilitaFormObje(false);
                Fn_DibujarCarrousel($("#Mycarousel"), "", null);
            }
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
                UrlApiArteAdj = UrlApiArteAdj + "/GetVistaImagenes/" + respuesta.IdArte;
                getAdjun(UrlApiArteAdj);
                KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true);
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();

            } else {
                LimpiarArte();
                Fn_DibujarCarrousel($("#Mycarousel"), "", null);
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
            Descripcion: XDescripcion,
            Catalogo: 0,
            Placement:0
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#GridAdjuntos").data("kendoGrid").dataSource.read();
            getAdjun(UrlApiArteAdj + "/GetVistaImagenes/" + $("#IdArte").val());
            kendo.ui.progress($("#vistaParcial"), false);
            RequestEndMsg(data, XType);

            if (data[0].IdTipoAdjunto === 1) {
                var dsres = [{
                    NoDocumento: $("#NoDocumento").val(),
                    NoReferencia: $("#NoReferencia").val(),
                    NombreArchivo: data[0].NombreArchivo
                }];
                fn_SubirArchivoCatalogo(dsres);
            }
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
            Fn_DibujarCarrousel($("#Mycarousel"), "/Adjuntos/" + $("#NoDocumento").val() + "", respuesta);
           
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
        },
        error: function (data) {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });
};

//********************************
let GetStrinTallas = function (datos) {
    var Varstr = "";
    $.each(datos, function (index, elemento) {
        Varstr = Varstr + " ; " + elemento.Tallas;
    });
    $("#TallaPrincipal").val(Varstr);
};

let ObtenerTallas = function () {
    if ($("#GRDimension").data("kendoGrid").dataSource.total() > 0) {
        GetStrinTallas($("#GRDimension").data("kendoGrid").dataSource.data());
        $("#CantidadTallas").data("kendoNumericTextBox").value($("#GRDimension").data("kendoGrid").dataSource.data().length);
    } else {
        $("#TallaPrincipal").val("");
        $("#CantidadTallas").data("kendoNumericTextBox").value(0);
    }
};

let GuardarRequerimiento = function (UrlRD) {
    kendo.ui.progress($("#BPform"), true);

    $.ajax({
        url: UrlRD + "/UpdRequerimientoDesarrolloSolicitud/" + $("#IdRequerimiento").val(),
        type: "Put",
        dataType: "json",
        data: JSON.stringify({
            IdRequerimiento: $("#IdRequerimiento").val(),
            IdCliente: $("#IdCliente").val(),
            IdPrograma: $("#IdPrograma").val(),
            IdServicio: $("#IdServicio").val(),
            IdUbicacion: KdoCmbGetValue($("#IdUbicacion")),
            NoDocumento: $("#NoDocumento").val(),
            IdSolicitudDisenoPrenda: $("#IdSolicitudDisenoPrenda").val(),
            IdModulo: $("#IdModulo").val(),
            IdEjecutivoCuenta: $("#IdEjecutivoCuenta").val(),
            UbicacionHorizontal: $("#UbicacionHor").val(),
            UbicacionVertical: $("#UbicacionVer").val(),
            CantidadPiezas: $("#CntPiezas").val(),
            CantidadStrikeOff: $("#TxtCantidadSTrikeOff").val(),
            StrikeOffAdicional: $("#TxtStrikeOffAdicional").val(),
            TallaPrincipal: $("#TallaPrincipal").val(),
            Estado: "EDICION",
            Fecha: kendo.toString(kendo.parseDate($("#Fecha").val()), 's'),
            InstruccionesEspeciales: $("#InstruccionesEspeciales").val(),
            CantidadColores: $("#CantidadColores").val(),
            CantidadTallas: $("#CantidadTallas").val(),
            Montaje: 0,
            Combo: $("#Combo").val(),
            RevisionTecnica: false,
            VelocidadMaquina: null,
            IdUnidadVelocidad: null,
            DisenoFullColor: $("#chkDisenoFullColor").is(':checked'),
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
            IdTipoLuz: $("#CmbTipoLuz").val() === "" || $("#CmbTipoLuz").val() === null  ? null: $("#CmbTipoLuz").val(),
            IdMotivoDesarrollo: $("#CmbMotivoDesarrollo").val(),
            IdTipoAcabado: KdoCmbGetValue($("#CmbTipoAcabado")),
            IdTipoMuestra: $("#CmbTMuestra").val() === "" || $("#CmbTMuestra").val() === null ? null : $("#CmbTMuestra").val(),
            IdQuimica: KdoCmbGetValue($("#CmbQuimica")),
            SolicitaTelaSustituta: $("#swchSolTelaSustituta").data("kendoSwitch").check(),
            IdCatalogoDiseno: $("#IdCatalogoDiseno").val(),
            IdCalidadCriterio: $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").value(),
            StandarOEKOTEX: $("#swchSolDesarrolloOEKO").data("kendoSwitch").check(),
            PoseeDocumentacionAduanal: $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").check(),
            CobrarDiseno: $("#swchCobrarDiseno").data("kendoSwitch").check()
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
            $("#IdCatalogoDiseno").val(data[0].IdCatalogoDiseno);

            Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#GRReqDesColor"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#GRReqDesFoil"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#GRReqDesArtSug"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //habilitar botones   
            $("#myBtnAdjunto").data("kendoButton").enable(true);
            RequestEndMsg(data, "Put");
            kendo.ui.progress($("#BPform"), false);

            getAdjun(UrlApiArteAdj + "/GetVistaImagenes/" + data[0].IdArte.toString());
            $("#GridAdjuntos").data("kendoGrid").dataSource.read();
            //cargar datosdel catalogo
            //fn_CatalogoDisenos();
            CargarInfoEtapa(false);
            $("#Fecha").data("kendoDatePicker").element.focus();

        },
        error: function (data) {

            kendo.ui.progress($("#BPform"), false);
            ErrorMsg(data);
            $("#Nombre").focus().select();
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
            if( data.Resultado === true){
                kendo.ui.progress($("#BPform"), true);
                $.ajax({
                    url: TSM_Web_APi + "ArteAdjuntos/",//
                    type: "Post",
                    dataType: "json",
                    data: JSON.stringify({
                       
                        IdArte: $("#IdArte").val(),
                        Item:0,
                        NombreArchivo: ds[0].NombreArchivo,
                        Fecha: Fhoy(),
                        Descripcion: "ADJUNTAR ARCHIVO DISEÑO",
                        Catalogo:true

                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        kendo.ui.progress($("#BPform"), false);
                        getAdjun(UrlApiArteAdj + "/GetVistaImagenes/" + data[0].IdArte.toString());
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

let fn_SubirArchivoCatalogo = function (ds) {
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/RequerimientoDesarrollos/SubirAdjuntoCatalogo",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
           
        }
    });
};


let LimpiarReq = function () {

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
    $("#TxtStrikeOffAdicional").data("kendoNumericTextBox").value("0");
    $("#CantidadColores").data("kendoNumericTextBox").value("0");
    $("#CantidadTallas").data("kendoNumericTextBox").value("0");
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
    $("#swchSolTelaSustituta").data("kendoSwitch").check(false);
    $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").value("");
    $("#swchSolDesarrolloOEKO").data("kendoSwitch").check(false);
    $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").check(false);
    $("#swchCobrarDiseno").data("kendoSwitch").check(false);
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
    g.set("IdUbicacion", data.IdUbicacion);
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
    //KdoNumerictextboxEnable($("#CantidadTallas"), ToF);
    KdoNumerictextboxEnable($("#Combo"), ToF);
    KdoNumerictextboxEnable($("#CantidadColores"), ToF);
    KdoComboBoxEnable($("#CmbIdUnidadMedidaCantidad"), ToF);
    KdoComboBoxEnable($("#IdPrograma"), ToF);
    KdoComboBoxEnable($("#IdComposicionTela"), ToF);
    KdoComboBoxEnable($("#IdCategoriaConfeccion"), ToF);
    KdoComboBoxEnable($("#IdConstruccionTela"), ToF);
    $("#IdServicio").val() !== "2" ? KdoComboBoxEnable($("#IdUbicacion"), ToF) : KdoComboBoxEnable($("#IdUbicacion"), false);
    KdoMultiselectEnable($("#IdCategoriaPrenda"), ToF);
    //KdoMultiselectEnable($("#IdSistemaTinta"), ToF);
    KdoCheckBoxEnable($("#chkDisenoFullColor"), ToF);
    TextBoxEnable($("#InstruccionesEspeciales"), ToF);
    TextBoxEnable($("#TxtColorTela"), ToF);
    TextBoxEnable($("#Nombre"), ToF);
    TextBoxEnable($("#NumeroDiseno"), ToF);
    TextBoxEnable($("#EstiloDiseno"), ToF);
    TextBoxReadOnly($("#TxtDirectorioArchivos"), ToF);
    KdoButtonEnable($("#Guardar"), ToF);
    KdoComboBoxEnable($("#CmbTipoLuz"), ToF);
    KdoComboBoxEnable($("#CmbTipoAcabado"), ToF);
    KdoComboBoxEnable($("#CmbTMuestra"), ToF);
    KdoComboBoxEnable($("#CmbQuimica"), ToF);
    KdoComboBoxEnable($("#CmbMotivoDesarrollo"), ToF);
    $("#swchSolTelaSustituta").data("kendoSwitch").enable(ToF);
    $("#CmbIdCalidadCriterio").data("kendoMultiColumnComboBox").enable(ToF);
    $("#swchSolDesarrolloOEKO").data("kendoSwitch").enable(ToF);
    $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").enable(ToF);
    $("#swchCobrarDiseno").data("kendoSwitch").enable(ToF);
    if (ToF === true) {
        $("#UbicacionVer").removeAttr("disabled");
        $("#UbicacionHor").removeAttr("disabled");
        $("#TxtDirectorioArchivos").removeAttr("disabled");
    } else {
        $("#UbicacionVer").attr("disabled", true);
        $("#UbicacionHor").attr("disabled", true);
        $("#TxtDirectorioArchivos").attr("disabled", true);
    }


};

let HabilitaObje = function (e, ToF) {
    ToF === true ? e.removeClass("k-state-disabled") : e.addClass("k-state-disabled");
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

let fn_CmbCriterioCalidad = function () {

    $("#CmbIdCalidadCriterio").kendoMultiColumnComboBox({
        dataTextField: "Nombre",
        dataValueField: "IdCalidadCriterio",
        height: 400,
        columns: [
            { field: "Nombre", title: "Nombre", width: 200 },
            { field: "Descripcion", title: "Descripcion", width: 500 }
        ],
        footerTemplate: 'Total #: instance.dataSource.total() # items found',
        filter: "contains",
        filterFields: ["IdCalidadCriterio", "Nombre", "Descripcion"],
        dataSource: {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "ComposicionTelasCalidadCriterios/GetByIdComposicionTela/0"; },
                    contentType: "application/json; charset=utf-8"
                }
                
            }
        }
    });

};

let fn_GetComposicionCalidad = function (xIdCompo) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "ComposicionTelasCalidadCriterios/GetByIdComposicionTela/" + xIdCompo.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};




let fn_GetCriteriosCalidad = function (xIdCriterio) {
    kendo.ui.progress($("#BPform"), true);
    $.ajax({
        url: TSM_Web_APi + "CalidadCriteriosPruebas/GetbyIdCalidadCriterio/" + (xIdCriterio === null ? 0 : xIdCriterio),
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato.length > 0) {
                fn_DibujarCriteriosCalidad(dato);
            } else {
                fn_DibujarCriteriosCalidad(null);
            }
            kendo.ui.progress($("#BPform"), false);
        },
        error: function () {
            kendo.ui.progress($("#BPform"), false);
        }
    });

};

let fn_DibujarCriteriosCalidad = function (DataSource) {
    var lista = $("#ListaCriterios");
    //remueve las imagenes del carrousel
    lista.children().remove();
    $.each(DataSource, function (index, elemento) {
        let vClass;
        if (elemento.Icono === "" || elemento.Icono === null) {
            vClass = 'class= "k-icon k-i-check k-icon-32"';
        } else {
            vClass = (elemento.Icono === null ? '' : elemento.Icono).startsWith('k-i') === true ? 'class= "k-icon ' + elemento.Icono + '"' : 'class= "' + elemento.Icono + '"';
        }

        lista.append('<div class="form-group form-inline">' +
            '<div class="custom-control" style="align-self: flex-end;">' +
            '<label class="font-weight-bold" for="1">' + elemento.Codigo + '</label>' +
            '<div ' + vClass + ' style="font-size: 32px;" id="1" data-toggle="tooltip" title="' + elemento.Nombre + '"></div>' +
            '</div>' +
            '</div> '
        );
    });

};

let Fn_getIdRequerimientoTecnica= function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimientoTecnica;
};

let Fn_getIdTecnica= function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdTecnica;
};

let fn_ConsultarArtSug = function () {
    vIdReqTecnica = Fn_getIdRequerimientoTecnica($("#GRReqDesTec").data("kendoGrid"));
    $("#GRReqDesArtSug").data("kendoGrid").dataSource.read();
    $("#GRReqDesTec").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#GRReqDesArtSug"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRReqDesArtSug"), false, false, false);
};

var Fn_GetTecnicasArtSugeridos = function (vIdTec) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "TecnicasArticulos/GetByidTecnica/" + vIdTec,
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