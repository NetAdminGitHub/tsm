
var Permisos;
var xvUrl = "", xvId = "";
$(document).ready(function () {

    //#region Inicialización de variables y controles Kendo

    var EsCambioReg = false;
    var vIdS = 0;
    var vIdCli = 0;
    var VarIDReq = 0;
    let vIdModulo = 1;

    // carga carrousel de imagenes 


    var DivCarousel = $("#Div_Carousel");
    DivCarousel.append(Fn_Carouselcontent());
    $("#idcloseMod").click(function () {
        $("#myModal").modal('toggle');
        $("#myModal").modal('hide');
    });
    CargarEtapasProceso(0);
    KdoButton($("#Nuevo"), "edit", "Nuevo registro");
    KdoButton($("#Copiar"), "copy", "Copiar registro");
    KdoButton($("#btnCambioEstado"), "gear", "Cambio de estado");
    //$("#Consultar").kendoButton({ icon: "search" });
    KdoButton($("#Guardar"), "save", "Guardar"); 
    KdoButton($("#Eliminar"), "delete", "Eliminar");  
    KdoButton($("#myBtnAdjunto"), "attachment", "Adjuntar Diseños");  
    KdoButton($("#btnCerrar"), "cancel", "Cancelar"); 
    KdoButton($("#btnAceptar"), "check", "Aceptar"); 
    KdoButton($("#btnCerrarAdj"), "close-circle", "Cerrar"); 

    // deshabilitar botones en formulario
    //$("#ReqDes").children().addClass("k-state-disabled");
    $("#myBtnAdjunto").data("kendoButton").enable(false);
    $("#Copiar").data("kendoButton").enable(false);
    $("#btnCambioEstado").data("kendoButton").enable(false);
    $("#Nuevo").data("kendoButton").enable(false);

    $("#Fecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#Fecha").data("kendoDatePicker").value(Fhoy());

    $("#Guardar").data("kendoButton").enable(false);
    $("#Eliminar").data("kendoButton").enable(false);
    $("#LblUbicacionVer").prop("hidden", "hidden");
    $("#UbicacionVer").prop("hidden", "hidden");
    $("#LblUbicacionHor").prop("hidden", "hidden");
    $("#UbicacionHor").prop("hidden", "hidden");

    Fn_LeerImagenes($("#Mycarousel"), "", null);

    // codigo de programas para el splitter
    //*******************************************************************
    $("#splitter").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: true, size: "50%", max: "95%", min: "20%"},
            { collapsible: true, size: "50%" }
        ]

    });

    PanelBarConfig($("#BarPanel"));
   
    $(window).resize(function () {
        resizeSplitter($(window).height());
    });

    resizeSplitter = function (height) {

        var splElement = $("#splitter"),
            splObject = splElement.data("kendoSplitter");
        splElement.css({ height: height - height*0.34}); 
        setTimeout(function () {
            splObject.resize(true);
        }, 300);
    };

    $(".sidebar").hover(function () {
        resizeSplitter($(window).height());
    });

   
    resizeSplitter($(window).height());


    get_Panel = function (index) {
        var splitterElement = $("#splitter");
        index = Number(index);

        var panes = splitterElement.children(".k-pane");

        if (!isNaN(index) && index < panes.length) {
            return panes[index];
        }
    };


    $("#CntPiezas").kendoNumericTextBox({
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
                    if (input.is("[name='CntPiezas']") && KdoCmbGetValue($("#IdServicio")) === "1") {
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
                    if (input.is("[name='IdUbicacion']") && KdoCmbGetValue($("#IdServicio")) === "1") {
                        return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgCmbIdUnidadVelocidad: function (input) {
                    if (input.is("[name='CmbIdUnidadVelocidad']") && Kendo_CmbGetvalue($("#IdServicio")) === "1" ) {
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
                    if (input.is("[name='CmbIdUnidadMedidaCantidad']") && KdoCmbGetValue($("#IdServicio")) === "1") {
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
                    if (input.is("[name='Color']") && KdoCmbGetValue($("#IdServicio")) === "1") {
                        return input.val().length > 0 &&  input.val().length <= 200;
                    }
                    return true;
                },
                MsgIdCategoriaConfeccion: function (input) {
                    if (input.is("[name='IdCategoriaConfeccion']") && KdoCmbGetValue($("#IdServicio")) === "1") {
                        return $("#IdCategoriaConfeccion").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgIdConstruccionTela: function (input) {
                    if (input.is("[name='IdConstruccionTela']") && KdoCmbGetValue($("#IdServicio")) === "1") {
                        return $("#IdConstruccionTela").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgIdComposicionTela: function (input) {
                    if (input.is("[name='IdComposicionTela']") && KdoCmbGetValue($("#IdServicio")) === "1") {
                        return $("#IdComposicionTela").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgMontaje: function (input) {
                    if (input.is("[name='Montaje']") && Kendo_CmbGetvalue($("#IdServicio")) === "1" ) {
                        return $("#Montaje").data("kendoNumericTextBox").value() > 0;
                    }
                    return true;
                },
                MsgCombo: function (input) {
                    if (input.is("[name='Combo']") && Kendo_CmbGetvalue($("#IdServicio")) === "1" ) {
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
                }

            },
            messages: {
                VelocidadMaquinaRuler: "Debe ser mayor a 0",
                Mayor0: "Debe ser mayor a 0",
                MsgLongitud: "Debe ser mayor a 0",
                InstruccionesEspecialesRuler: "Longitud máxima del campo es 2000",
                required: "Requerido",
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
                TxtDirectorioArchivosRuler: "Longitud máxima del campo es 2000"
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
    Kendo_CmbFiltrarGrid($("#IdCliente"), UrlApiClient, "Nombre", "IdCliente", "Seleccione un Cliente ....");
    Kendo_CmbFiltrarGrid($("#IdPrograma"), UrlApiPro, "Nombre", "IdPrograma", "Seleccione ...", "", "IdCliente");
    Kendo_MultiSelect($("#IdSistemaTinta"), UrlApiSisT, "Nombre", "IdSistemaTinta", "Seleccione ...");
    Kendo_MultiSelect($("#IdCategoriaPrenda"), UrlApiCPre, "Nombre", "IdCategoriaPrenda", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdUbicacion"), UrlApiUEstam, "Nombre", "IdUbicacion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdCategoriaConfeccion"), UrlApiCConfec, "Nombre", "IdCategoriaConfeccion", "Seleccione ...");
    Kendo_CmbFiltrarGrid($("#IdConstruccionTela"), UrlApiConsTela, "Nombre", "IdConstruccionTela", "Seleccione ...");
    //Kendo_CmbFiltrarGrid($("#IdComposicionTela"), UrlApiCompTela, "Nombre", "IdComposicionTela", "Seleccione ...");
    KdoCmbComboBox($("#IdComposicionTela"), UrlApiCompTela, "Nombre", "IdComposicionTela", "Seleccione ...", "", "", "", "CmbNuevoItem");

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
        clearButton:  true,
        placeholder:  "Seleccione...",
        height:550,
        dataSource: DSUnidadMedida("9,17")
    });
    //#endregion fin CmbIdUnidadMedidaCantidad

    Kendo_CmbFiltrarGrid($("#CmbBase"), UrlApiBase, "Nombre", "IdBase", "Seleccione...");

    $("#CantidadTallas").data("kendoNumericTextBox").enable(false);
    $("#IdServicio").data("kendoComboBox").input.focus();

    HabilitaFormObje(false);
    //#endregion FIN Inicialización de variables y controles Kendo

    //#region Programacion GRID REQUERIMIENTO DE DESARROLLO

    var DsRD = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlRD + "/GetByServicioCliente/" + vIdS + "/" + vIdCli + "/" + vIdModulo; },
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

    $("#grid").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimiento", title: "Código requerimiento", hidden: true },
            { field: "NoDocumento1", title: "No requerimiento" },
            { field: "Fecha", title: "Fecha requerimiento", format: "{0: dd/MM/yyyy}" },
            { field: "Nombre2", title: "Nombre del diseño" },
            { field: "EstiloDiseno", title: "Estilo diseño" },
            { field: "NumeroDiseno", title: "Número diseño" },
            { field: "IdPrograma", title: "Código de programa", hidden: true },
            { field: "Nombre3", title: "Nombre del programa", hidden: true },
            { field: "NoDocumento", title: "No programa" },
            { field: "IdCliente", title: "Código cliente", hidden: true },
            { field: "NoCuenta", title: "No Cuenta del cliente" },
            { field: "IdServicio", title: "Código servicio", hidden: true },
            { field: "Nombre", title: "Servicio", hidden: true },
            { field: "IdUbicacion", title: "Código ubicación", hidden: true },
            { field: "Nombre1", title: "Ubicación", hidden: true },
            { field: "UbicacionHorizontal", title: "Ubicacion horizontal", hidden: true },
            { field: "UbicacionVertical", title: "Ubicacion vertical", hidden: true },
            { field: "CantidadPiezas", title: "Cantidad de piezas", hidden: true, editor: Grid_ColIntNumSinDecimal },
            { field: "TallaPrincipal", title: "Detalle de tallas", hidden: true },
            { field: "Estado", title: "Código Estado", hidden: true },
            {
                field: "Nombre4", title: "Estado", template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='Fn_VerEstados(" + data["IdRequerimiento"] + ")' >" + data["Nombre4"] + "</button>";
                }
            },
            { field: "InstruccionesEspeciales", title: "Instrucciones Especiales", hidden: true },
            { field: "IdBase", title: "Base", hidden: true },
            { field: "Nombre5", title: "Nombre de la base", hidden: true },
            { field: "IdCategoriaConfeccion", title: "Código categoria confeccion", hidden: true, menu: false },
            { field: "Nombre6", title: "Confección", hidden: true },
            { field: "IdConstruccionTela", title: "Código construcción tela", hidden: true, menu: false },
            { field: "Nombre7", title: "Construcción tela", hidden: true },
            { field: "IdComposicionTela", title: "Código composición tela", hidden: true, menu: false },
            { field: "Nombre8", title: "composición tela", hidden: true },
            { field: "Color", title: "Color", hidden: true }

        ]
    });

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, false, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), DsRD);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
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
            Grid_requestEnd(e);
        },
        // VALIDAR ERROR
        error: Grid_error,

        change: function (e) {
            $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRDimension"), false, false, false);
            Grid_SelectRow($("#GRDimension"), selectedRowsDimen);
        },
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
                                    return $('[name="C3"]').is(':checked') === true ? input.val().length > 0 && input.val().length <= 2000 :  input.val().length <= 2000;
                                }

                                return true;
                            }
                        }
                    },
                    C3: {
                       type: "bool" 
                    },
                    DimensionesRelativas: { type: "string"}

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
    Grid_HabilitaToolbar($("#GRDimension"), false, false, false);

    var selectedRowsDimen = [];
    $("#GRDimension").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GRDimension"), selectedRowsDimen);
    });

    function GetStrinTallas(datos) {
        var Varstr = "";
        $.each(datos, function (index, elemento) {
            Varstr = Varstr + " ; " + elemento.Tallas;
        });
        $("#TallaPrincipal").val(Varstr);
    }

    function ObtenerTallas() {
        if ($("#GRDimension").data("kendoGrid").dataSource.total() > 0) {
            GetStrinTallas($("#GRDimension").data("kendoGrid").dataSource.data());
            $("#CantidadTallas").data("kendoNumericTextBox").value($("#GRDimension").data("kendoGrid").dataSource.data().length);
        } else {
            $("#TallaPrincipal").val("");
            $("#CantidadTallas").data("kendoNumericTextBox").value(0);
        }

        ActualizarReq();


    }


    //#endregion Fin CRUD Programación GRID Dimensiones

    //#region CRUD Programación GRID Colores tecnicas

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

        change: function (e) {
            $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRReqDesTec"), false, false, false);
            //GetColorTecnicas();
            Grid_SelectRow($("#GRReqDesTec"), selectedRowsColoTec);

        },
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
    Grid_HabilitaToolbar($("#GRReqDesTec"), false, false, false);

    var selectedRowsColoTec = [];
    $("#GRReqDesTec").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila

        Grid_SetSelectRow($("#GRReqDesTec"), selectedRowsColoTec);
    });
    //#endregion fin CRUD Programación GRID Colores tecnicas

    //#region CRUD manejo de requerimiento de Desarrollo

    $("#grid").data("kendoGrid").bind("change", function (e) {
        if (EsCambioReg === false) {
            //limpiar mensage de validación
            ValidRD.hideMessages();
            //ValidArt.hideMessages();
            //ValidConsultar.hideMessages();
            ValidCopiar.hideMessages();

            VarIDReq = getIdReq($("#grid").data("kendoGrid"));
            getRD(UrlRD + "/" + VarIDReq);
            $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRReqDesTec"), false, false, false);
            $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRDimension"), false, false, false);
        }
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $("#IdServicio").data("kendoComboBox").bind("select", function (e) {
        event.preventDefault();
        if (e.item) {
            Consultar(this.dataItem(e.item.index()).IdServicio, Kendo_CmbGetvalue($("#IdCliente")));
        } else {
            Consultar(0, Kendo_CmbGetvalue($("#IdCliente")));
        }
    });

    $("#IdServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            Consultar(0, Kendo_CmbGetvalue($("#IdCliente")));
        }
    });

    $("#IdCliente").data("kendoComboBox").bind("select", function (e) {
        event.preventDefault();
        if (e.item) {
            Consultar(Kendo_CmbGetvalue($("#IdServicio")), this.dataItem(e.item.index()).IdCliente);
        } else {
            Consultar(Kendo_CmbGetvalue($("#IdServicio")), 0);
        }
    });

    $("#IdCliente").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            Consultar(Kendo_CmbGetvalue($("#IdServicio")), 0);
        }
    });

    $("#Nuevo").click(function (event) {
        //var pane = get_Panel(0);
        //$("#splitter").data("kendoSplitter").toggle(pane, $(pane).width() <= 0);
        //$("#grid").data("kendoGrid").dataSource.sort({});
        kendo.ui.progress($("#splitter"), true);
        event.preventDefault();
        //limpiar mensajes de validacion
        //ValidConsultar.hideMessages();
        ValidCopiar.hideMessages();
        // limpiar campos
        LimpiarReq();
        LimpiarArte();
        // limpiar etapas del proceso
        CargarEtapasProceso(0);

        VarIDReq = $("#IdRequerimiento").val();
        $("#GRDimension").data("kendoGrid").dataSource.read("[]");
        $("#GRReqDesTec").data("kendoGrid").dataSource.read("[]");

        //habilitar objetos en la vista
        Grid_HabilitaToolbar($("#GRDimension"), false, false, false);
        Grid_HabilitaToolbar($("#GRReqDesTec"), false, false, false);
        HabilitaFormObje(true);
        $("#Copiar").data("kendoButton").enable(false);
        $("#btnCambioEstado").data("kendoButton").enable(false);
        $("#Eliminar").data("kendoButton").enable(false);
        $("#Guardar").data("kendoButton").enable(fn_SNAgregar(true));
        $("#myBtnAdjunto").data("kendoButton").enable(false);
        Kendo_CmbGetvalue($("#IdServicio")) === "1" ? $("#CantidadColores").data("kendoNumericTextBox").enable(true) : $("#CantidadColores").data("kendoNumericTextBox").enable(false);

        //asignar valores a campos.
        $("#IdSistemaTinta").data("kendoMultiSelect").value("");
        $("#IdCategoriaPrenda").data("kendoMultiSelect").value("");
        $("#Fecha").data("kendoDatePicker").value(Fhoy());
        $('#chkRevisionTecnica').prop('checked', 0);
        $('#chkDisenoFullColor').prop('checked', 0);
        $("#CmbIdUnidadVelocidad").data("kendoComboBox").value(Kendo_CmbGetvalue($("#IdServicio")) === "1" ? 16 : "");
        $("#CmbIdUnidadMedidaCantidad").data("kendoComboBox").value(Kendo_CmbGetvalue($("#IdServicio")) === "2" ? 17 : 9);
        Fn_LeerImagenes($("#Mycarousel"), "", null);
        kendo.ui.progress($("#splitter"), false);

        $("#Montaje").data("kendoNumericTextBox").value(Kendo_CmbGetvalue($("#IdServicio")) === "1" ? 1 : 0);
        $("#Combo").data("kendoNumericTextBox").value(Kendo_CmbGetvalue($("#IdServicio")) === "1" ? 1 : 0);

        // foco
        $("#Fecha").data("kendoDatePicker").element.focus();

    });

    $("#Guardar").click(function (event) {
        event.preventDefault();
        if (ValidRD.validate()) {
            GuardarRequerimiento(UrlRD);
        } else{
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#Eliminar").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("Está seguro que desea eliminar el registro", function () { return EliminarReq(UrlRD); });
    });

    function getRD(UrlRD) {
        kendo.ui.progress($("#splitter"), true);
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
                    $("#UbicacionHor").val(elemento.UbicacionHorizontal);
                    $("#UbicacionVer").val(elemento.UbicacionVertical);
                    $("#CntPiezas").data("kendoNumericTextBox").value(elemento.CantidadPiezas);
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

                    //consultar grid
                    VarIDReq = elemento.IdRequerimiento;
                    $("#GRDimension").data("kendoGrid").dataSource.read();
                    $("#GRReqDesTec").data("kendoGrid").dataSource.read();

                    //habiliar en objetos en las vistas
                    $("#Nuevo").data("kendoButton").enable(fn_SNAgregar(true));
                    $("#Copiar").data("kendoButton").enable(fn_SNProcesar(true));
                    $("#Guardar").data("kendoButton").enable(fn_SNAgregar(true));
                    $("#Eliminar").data("kendoButton").enable(fn_SNBorrar(true));
                    elemento.Estado === "EDICION" ? HabilitaFormObje(true) : HabilitaFormObje(false);
                    elemento.Estado === "EDICION" || elemento.Estado === "CONFIRMADO" ? $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true)) : $("#btnCambioEstado").data("kendoButton").enable(false);

                    if (Kendo_CmbGetvalue($("#IdServicio")) === "1") {
                        elemento.DisenoFullColor === true ? KdoNumerictextboxEnable($("#CantidadColores"), false) : KdoNumerictextboxEnable($("#CantidadColores"), elemento.Estado === "EDICION" ? true : false);
                    } else {
                        KdoNumerictextboxEnable($("#CantidadColores"),false);
                    }
                    // foco en la fecha
                    $("#Fecha").data("kendoDatePicker").element.focus();

                });

                if (respuesta.length === 0) {
                
                    HabilitaFormObje(false);
                    $("#Copiar").data("kendoButton").enable(false);
                    $("#btnCambioEstado").data("kendoButton").enable(false);
                    $("#Nuevo").data("kendoButton").enable(fn_SNAgregar(true));
                    Fn_LeerImagenes($("#Mycarousel"), "", null);
                }
                CargarEtapasProceso(VarIDReq);
                kendo.ui.progress($("#splitter"), false);
                getArte(UrlApiArte + "/GetArteByRequerimiento/" + VarIDReq.toString(), UrlApiArteAdj);
                getSisTintas(UrlRtin + "/GetByRequerimiento/" + VarIDReq.toString());
                getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + VarIDReq.toString());
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);

            }
        });
    }

    function GuardarRequerimiento(UrlRD) {
        kendo.ui.progress($("#splitter"), true);

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
                IdPrograma: KdoCmbGetValue($("#IdPrograma")),
                IdServicio: KdoCmbGetValue($("#IdServicio")),
                IdUbicacion: KdoCmbGetValue($("#IdUbicacion")),
                NoDocumento: $("#NoDocumento").val(),
                UbicacionHorizontal: $("#UbicacionHor").val(),
                UbicacionVertical: $("#UbicacionVer").val(),
                CantidadPiezas: $("#CntPiezas").val(),
                TallaPrincipal: $("#TallaPrincipal").val(),
                Estado: XEstado,
                Fecha: XFecha,
                InstruccionesEspeciales: $("#InstruccionesEspeciales").val(),
                CantidadColores: $("#CantidadColores").val(),
                CantidadTallas: $("#CantidadTallas").val(),
                Montaje: $("#Montaje").val(),
                Combo: $("#Combo").val(),
                RevisionTecnica: $("#chkRevisionTecnica").is(':checked'),
                VelocidadMaquina:  $("#TxtVelocidadMaquina").data("kendoNumericTextBox").value(),
                IdUnidadVelocidad: KdoCmbGetValue($("#CmbIdUnidadVelocidad")),
                DisenoFullColor: $("#chkDisenoFullColor").is(':checked'),
                IdUnidadMedidaCantidad: KdoCmbGetValue($("#CmbIdUnidadMedidaCantidad")),
                IdBase: KdoCmbGetValue($("#CmbBase")),
                IdCategoriaConfeccion: KdoCmbGetValue($("#IdCategoriaConfeccion")),
                IdConstruccionTela: KdoCmbGetValue($("#IdConstruccionTela")),
                IdComposicionTela: KdoCmbGetValue($("#IdComposicionTela")),
                Color: $("#Color").val(),
                //Entidad prendas
                IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
                // Entidad sistema de tintas.....
                IdSistemaTinta: $("#IdSistemaTinta").data("kendoMultiSelect").value().toString(),
                //entidad Artes
                IdArte: $("#IdArte").val(),
                Nombre: $("#Nombre").val(),
                EstiloDiseno: $("#EstiloDiseno").val(),
                NumeroDiseno: $("#NumeroDiseno").val(),
                DirectorioArchivos: $("#TxtDirectorioArchivos").val(),
                IdModulo: vIdModulo,
                IdSolicitudDisenoPrenda: null,
                IdEjecutivoCuenta: null,
                IdTipoLuz: null,
                IdMotivoDesarrollo: null,
                IdTipoAcabado: null,
                IdTipoMuestra: null,
                CantidadStrikeOff: 0,
                StrikeOffAdicional: 0,
                IdQuimica: null,
                SolicitaTelaSustituta:false,
                RegistroCompletado: false,
                IdUbicacionParte:null
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //inserto registro en la grilla y obligo aque el evento change no haga su funcion de leer

                EsCambioReg = true;
                if (XType === "Post") {
                    selectedRows = [];
                    $("#grid").data("kendoGrid").dataSource.insert(0, {
                        IdRequerimiento: data[0].IdRequerimiento,
                        IdCliente: data[0].IdCliente,
                        NoCuenta: data[0].NoCuenta,
                        IdPrograma: data[0].IdPrograma,
                        NoDocumento: data[0].NoDocumento,
                        IdServicio: data[0].IdServicio,
                        Nombre: data[0].Nombre,
                        IdUbicacion: data[0].IdUbicacion,
                        Nombre1: data[0].Nombre1,
                        NoDocumento1: data[0].NoDocumento1,
                        UbicacionHorizontal: data[0].UbicacionHorizontal,
                        UbicacionVertical: data[0].UbicacionVertical,
                        CantidadPiezas: data[0].CantidadPiezas,
                        TallaPrincipal: data[0].TallaPrincipal,
                        Estado: data[0].Estado,
                        Fecha: kendo.toString(kendo.parseDate(data[0].Fecha), 'dd/MM/yyyy'),
                        InstruccionesEspeciales: data[0].InstruccionesEspeciales,
                        Nombre4: data[0].Nombre4,
                        Nombre3: data[0].Nombre3,
                        Nombre2: data[0].Nombre2,
                        EstiloDiseno: data[0].EstiloDiseno,
                        NumeroDiseno: data[0].NumeroDiseno,
                        IdBase: data[0].IdBase,
                        Nombre5: data[0].Nombre5,
                        IdCategoriaConfeccion: data[0].IdCategoriaConfeccion,
                        Nombre6: data[0].Nombre6,
                        IdConstruccionTela: data[0].IdConstruccionTela,
                        Nombre7: data[0].Nombre7,
                        IdComposicionTela: data[0].IdComposicionTela,
                        Nombre8: data[0].Nombre8,
                        Color: data[0].Color
                       
                    });
                    CargarEtapasProceso(data[0].IdRequerimiento);
                    LimpiaMarcaCelda();

                } else {
                    var uid = $("#grid").data("kendoGrid").dataSource.get(data[0].IdRequerimiento).uid;
                    Fn_UpdFilaGridRD($("#grid").data("kendoGrid").dataItem("tr[data-uid='" + uid + "']"), data[0]);
                }
                EsCambioReg = false;


                $("#IdRequerimiento").val(data[0].IdRequerimiento);
                $("#IdArte").val(data[0].IdArte);
                $("#NoDocumento").val(data[0].NoDocumento1);
                $("#Estado").val(data[0].Estado);

                Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
                Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);

                //habilitar botones   
                $("#Eliminar").data("kendoButton").enable(fn_SNBorrar(true));
                $("#Copiar").data("kendoButton").enable(fn_SNProcesar(true));
                $("#btnCambioEstado").data("kendoButton").enable(fn_SNCambiarEstados(true));
                $("#myBtnAdjunto").data("kendoButton").enable(true);
                RequestEndMsg(data, XType);
                kendo.ui.progress($("#splitter"), false);

                getAdjun(UrlApiArteAdj + "/GetByArte/" + data[0].IdArte.toString());
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();
               
                $("#Fecha").data("kendoDatePicker").element.focus();

            },
            error: function (data) {
                EsCambioReg = false;
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
                $("#Nombre").focus().select();
            }
        });

    }

    function ActualizarReq() {
        var Actualizado = false;
        var XEstado = "EDICION";
        var XFecha = kendo.toString(kendo.parseDate($("#Fecha").val()), 's');
        $.ajax({
            url: UrlRD + "/ActualizarRequerimientoDesarrollo/" + $("#IdRequerimiento").val(),//
            type: "Put",
            dataType: "json",
            async: false,
            data: JSON.stringify({
                IdRequerimiento: $("#IdRequerimiento").val(),
                IdCliente: KdoCmbGetValue($("#IdCliente")),
                IdPrograma: KdoCmbGetValue($("#IdPrograma")),
                IdServicio: KdoCmbGetValue($("#IdServicio")),
                IdUbicacion: KdoCmbGetValue($("#IdUbicacion")),
                NoDocumento: $("#NoDocumento").val(),
                UbicacionHorizontal: $("#UbicacionHor").val(),
                UbicacionVertical: $("#UbicacionVer").val(),
                CantidadPiezas: $("#CntPiezas").val(),
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
                IdUnidadVelocidad: KdoCmbGetValue($("#CmbIdUnidadVelocidad")),
                DisenoFullColor: $("#chkDisenoFullColor").is(':checked'),
                IdUnidadMedidaCantidad: KdoCmbGetValue($("#CmbIdUnidadMedidaCantidad")),
                IdBase: KdoCmbGetValue($("#CmbBase")),
                IdCategoriaConfeccion: KdoCmbGetValue($("#IdCategoriaConfeccion")),
                IdConstruccionTela: KdoCmbGetValue($("#IdConstruccionTela")),
                IdComposicionTela: KdoCmbGetValue($("#IdComposicionTela")),
                Color: $("#Color").val(),
                //Entidad prendas
                IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
                // Entidad sistema de tintas.....
                IdSistemaTinta: $("#IdSistemaTinta").data("kendoMultiSelect").value().toString(),
                //entidad Artes
                IdArte: $("#IdArte").val(),
                Nombre: $("#Nombre").val(),
                EstiloDiseno: $("#EstiloDiseno").val(),
                NumeroDiseno: $("#NumeroDiseno").val(),
                DirectorioArchivos: $("#TxtDirectorioArchivos").val(),
                IdModulo: vIdModulo,
                IdSolicitudDisenoPrenda : null,
                IdEjecutivoCuenta :null,
                IdTipoLuz : null,
                IdMotivoDesarrollo :null,
                IdTipoAcabado :null,
                IdTipoMuestra :null,
                CantidadStrikeOff: 0,
                StrikeOffAdicional: 0,
                IdQuimica: null,
                SolicitaTelaSustituta: false,
                RegistroCompletado: false,
                IdUbicacionParte: null
               

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

    function EliminarReq(UrlRD) {
        kendo.ui.progress($("#splitter"), true);
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
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, "Delete");
                $("#grid").data("kendoGrid").dataSource.read().then(function (e) {
                    if ($("#grid").data("kendoGrid").dataSource.total()===0) {
                        $("#GRDimension").data("kendoGrid").dataSource.read("[]");
                        $("#GRReqDesTec").data("kendoGrid").dataSource.read("[]");
                        HabilitaFormObje(false);
                        CargarEtapasProceso(0);
                    } else {
                        $("#Fecha").data("kendoDatePicker").element.focus();
                    }
                });
            },
            error: function (e) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(e);
                $("#Nombre").focus().select();
            }
        });
    }

    function LimpiarReq() {

        $("#IdRequerimiento").val("0");
        $("#IdUbicacion").data("kendoComboBox").value("");
        $("#IdPrograma").data("kendoComboBox").value("");
        $("#NoDocumento").val("");
        $("#UbicacionHor").val("");
        $("#UbicacionVer").val("");
        $("#CntPiezas").data("kendoNumericTextBox").value("0");
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
         //limpiar mensajes de validacion
        ValidRD.hideMessages();

    }

    function Consultar(IdServicio, IdCliente) {

        vIdS =  Number(IdServicio);
        vIdCli = Number(IdCliente);


        $("#Copiar").data("kendoButton").enable(false);
        $("#btnCambioEstado").data("kendoButton").enable(false);
        $("#myBtnAdjunto").data("kendoButton").enable(false);
        //Limpiar Objetos antes de consultar
        $("#grid").data("kendoGrid").dataSource.data([]);
        $("#GRDimension").data("kendoGrid").dataSource.data([]);
        $("#GRReqDesTec").data("kendoGrid").dataSource.data([]);
        LimpiarReq();
        LimpiarArte();
        // limpiar etapas
        CargarEtapasProceso(0);
        $("#IdCategoriaPrenda").data("kendoMultiSelect").value("");
        $("#IdSistemaTinta").data("kendoMultiSelect").value("");
        vIdS === 2 ? $('[name="CmbIdUnidadVelocidad"]').data("kendoComboBox").setDataSource(DSUnidadMedida("15")) : $('[name="CmbIdUnidadVelocidad"]').data("kendoComboBox").setDataSource(DSUnidadMedida("16"));
        // llenar grid principal de consulta
        $("#grid").data("kendoGrid").dataSource.read();

        $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRReqDesTec"), false, false, false);
        $("#Estado").val() === "EDICION" ? Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#GRDimension"), false, false, false);


        // contraer barra  Dimensiones y Tecnicas
        Fn_ContraerPanelBar($("#BarPanel"), $("#BPGRDimension"));
        Fn_ContraerPanelBar($("#BarPanel"), $("#BPGRReqDesTec"));

        // habilitar panel de acuerdo al servicio.
        vIdS === 1 ? Fn_EnablePanelBar($("#BarPanel"), $("#BPGRDimension"), true) : Fn_EnablePanelBar($("#BarPanel"), $("#BPGRDimension"), false);
        vIdS === 1 ? Fn_EnablePanelBar($("#BarPanel"), $("#BPGRReqDesTec"), true) : Fn_EnablePanelBar($("#BarPanel"), $("#BPGRReqDesTec"), false);
        vIdS === 1 ? OcultarCamposReq(true) : OcultarCamposReq(false);



        //construye y muestra la seccion carrousel de imagenes.
        Fn_LeerImagenes($("#Mycarousel"), "", null);

        vIdS !== 0 && vIdCli !== 0 ? $("#Nuevo").data("kendoButton").enable(fn_SNAgregar(true)) : $("#Nuevo").data("kendoButton").enable(false);

        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            //deshabilitar objetos
            HabilitaFormObje(false);
        }



    }

    function OcultarCamposReq(ToF) {

        if (ToF) {
            // mostrar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
            //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
            //el servisio de Serigrafia
            $('#Row4RD').prop('hidden', false);
            $('#Row5RD').prop('hidden', false);
            KdoNumericShow($("#CntPiezas"));
            $('[for="CntPiezas"]').prop('hidden', false);
            $("[for='CmbIdUnidadMedidaCantidad']").prop('hidden', false);
            KdoCmbShow($("#CmbIdUnidadMedidaCantidad"));
            $("[for='IdComposicionTela']").prop('hidden', false);
            KdoCmbShow($("#IdComposicionTela"));
            $("[for='IdCategoriaConfeccion']").prop('hidden', false);
            KdoCmbShow($("#IdCategoriaConfeccion"));
            $("[for='IdConstruccionTela']").prop('hidden', false);
            KdoCmbShow($("#IdConstruccionTela"));
            $("[for='Color']").prop('hidden', false);
            TextBoxHidden($("#Color"), false);
            $("[for='IdUbicacion']").prop('hidden', false);
            KdoCmbShow($("#IdUbicacion"));
            $("[for='IdSistemaTinta']").prop('hidden', false);
            KdoMultiSelectShow($("#IdSistemaTinta"));
            $("#colND").removeClass().addClass("form-group col-md-6 col-lg-3");
            $("#colFecha").removeClass().addClass("form-group col-md-6 col-lg-3");
            $("#colPro").removeClass().addClass("form-group col-md-6 col-lg-3");
            $("#colTp").removeClass().addClass("form-group col-md-6 col-lg-3");

        } else {
            // ocultar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
            //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
            //el servisio de Serigrafia
            $('#Row4RD').prop('hidden', true);
            $('#Row5RD').prop('hidden', true);
            KdoNumericHide($("#CntPiezas"));
            $("[for='CntPiezas']").prop('hidden', true);
            $("[for='CmbIdUnidadMedidaCantidad']").prop('hidden', true);
            KdoCmbHide($("#CmbIdUnidadMedidaCantidad"));
            $("[for='IdComposicionTela']").prop('hidden', true);
            KdoCmbHide($("#IdComposicionTela"));
            $("[for='IdCategoriaConfeccion']").prop('hidden', true);
            KdoCmbHide($("#IdCategoriaConfeccion"));
            $("[for='IdConstruccionTela']").prop('hidden', true);
            KdoCmbHide($("#IdConstruccionTela"));
            $("[for='Color']").prop('hidden', true);
            TextBoxHidden($("#Color"), true);
            $("[for='IdUbicacion']").prop('hidden', true);
            KdoCmbHide($("#IdUbicacion"));
            $("[for='IdSistemaTinta']").prop('hidden', true);
            KdoMultiSelectHide($("#IdSistemaTinta"));
            $("#colND").removeClass().addClass("form-group col-md-6 col-lg-4");
            $("#colFecha").removeClass().addClass("form-group col-md-6 col-lg-4");
            $("#colPro").removeClass().addClass("form-group col-md-6 col-lg-4");
            $("#colTp").removeClass().addClass("form-group col-md-6 col-lg-12");
        }
        
    }

    function Fn_UpdFilaGridRD(g, data) {
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

    $("#chkDisenoFullColor").click(function () {
        if (this.checked) {
            $("#CantidadColores").data("kendoNumericTextBox").value(12);
            $("#CantidadColores").data("kendoNumericTextBox").enable(false);

        } else {
            $("#CantidadColores").data("kendoNumericTextBox").enable(true);
        }
    });
    //#region Actualizar Base
    var ExecActBase = true;
    $("#CmbBase").data("kendoComboBox").bind("change", function (e) {
        if ($("#IdRequerimiento").val() > 0) {
            event.preventDefault();
            if (ExecActBase === true) {
                if (ValidRD.validate()) {
                    if (ActualizarReq() === false) {
                        $("#CmbBase").data("kendoComboBox").value(getIdBase($("#grid").data("kendoGrid")));
                        ExecActBase = false;
                    } else {
                        ExecActBase = true;
                    }
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
    

    function getArte(UrlArt, UrlApiArteAdj) {
        kendo.ui.progress($("#splitter"), true);
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
                    kendo.ui.progress($("#splitter"), false);
                    UrlApiArteAdj = UrlApiArteAdj + "/GetByArte/" + respuesta.IdArte;
                    getAdjun(UrlApiArteAdj);
                    $("#myBtnAdjunto").data("kendoButton").enable(true);
                    $("#GridAdjuntos").data("kendoGrid").dataSource.read();

                } else {
                    LimpiarArte();
                    Fn_LeerImagenes($("#Mycarousel"), "", null);
                    kendo.ui.progress($("#splitter"), false);
                    $("#myBtnAdjunto").data("kendoButton").enable(false);
                    $("#IdArte").val("0");
                }

               
                $("#IdRequerimiento").val() !== "0" && $("#Estado").val() === "EDICION" && $("#IdArte").val() !== "0" ? $("#myBtnAdjunto").data("kendoButton").enable(true) : $("#myBtnAdjunto").data("kendoButton").enable(false);
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
            }
        });
    }

  
    function LimpiarArte() {
        $("#IdArte").val("0");
        $("#Nombre").val("");
        $("#EstiloDiseno").val("");
        $("#NumeroDiseno").val("");
        $("#TxtDirectorioArchivos").val("");
        $("#Mycarousel").children().remove();
        //limpiar mensajes de validacion
        //ValidArt.hideMessages();
    }


    //#endregion FIN CRUD Manejo de Arte

    //#region CRUD Manejo de Arte Adjuntos

    //Control para subir los adjutos
    $("#Adjunto").kendoUpload({
        async: {
            saveUrl: "/RequerimientoDesarrollos/SubirArchivo",
            autoUpload: true
        },
        select: onSelect,
        localization: {
            select: '<div class="k-icon k-i-attachment-45"></div>&nbsp;Adjuntos'
        },
        upload: function (e) {
            e.sender.options.async.saveUrl = "/RequerimientoDesarrollos/SubirArchivo/" + $("#NoDocumento").val();
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

    function onSelect(e) {
        $.each(e.files, function (index, value) {
            value.name = value.name.replace(/[^A-Za-z0-9.]/g, "");
        });
    }

    $("#myModalAdjunto").on("show.bs.modal", function (e) {
        $(document).on('custom/paste/images', fn_LeerImagen);
    });

    $("#myModalAdjunto").on("hide.bs.modal", function (e) {
        $(document).off('custom/paste/images', fn_LeerImagen);
    });

    let fn_LeerImagen = function (event, blobs) {
        console.log("paste");

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

    //FIN Control para subir los adjutos

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
            if (e.type === "destroy") { getAdjun(UrlApiArteAdj + "/GetByArte/" + $("#IdArte").val());}
           
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


    function GuardarArtAdj(UrlAA, NombreArchivo) {
        kendo.ui.progress($("#splitter"), true);
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
                NombreArchivo: NombreArchivo,
                Fecha: XFecha,
                Descripcion: XDescripcion
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#GridAdjuntos").data("kendoGrid").dataSource.read();
                getAdjun(UrlApiArteAdj + "/GetByArte/" + $("#IdArte").val());
                kendo.ui.progress($("#splitter"), false);
                RequestEndMsg(data, XType);

            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }
        });
    }

    function EliminarArtAdj(UrlAA, Fn) {
        kendo.ui.progress($("#splitter"), true);
        var eliminado = false;

        $.ajax({
            url: UrlAA,//
            type: "Post",
            data: { fileName: Fn },
            async: false,
            success: function (data) {
                kendo.ui.progress($("#splitter"), false);
                eliminado = data.Resultado;
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                eliminado = false;
            }
        });

        return eliminado;
    }

    function getAdjun(UrlAA) {
        //LLena Splitter de imagenes
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlAA,
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + $("#NoDocumento").val() + "", respuesta);
                kendo.ui.progress($("#splitter"), false);
            },
            error: function () {
                kendo.ui.progress($("#splitter"), false);
            }
        });
    }

    //#endregion Fin Manejo de Adjunto

    //#region Copiar un Registro


    $("#btnAceptar").click(function (event) {
        event.preventDefault();
        if (ValidCopiar.validate()) { ConfirmacionMsg("¿Está seguro de que desea copiar el Requerimiento de Desarrollo N°: " + $("#NoDocumento").val().toString() + " y crear nuevo (s) registro?", function () { return fn_CopiarRequerimiento(UrlRD); }); }

    });

    function fn_CopiarRequerimiento(UrlRDCopy) {
        kendo.ui.progress($("#splitter"), true);
        var XFecha = Fhoy();
        $.ajax({
            url: UrlRDCopy + "/CopiarRequerimientoDesarrollo/" + $("#TxtNoVeces").data("kendoNumericTextBox").value() + "/" + $("#IdRequerimiento").val().toString(),
            type: "Post",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#CopiarRegistro").modal('hide');
                RequestEndMsg(data, "Post");
                $("#grid").data("kendoGrid").dataSource.read();
                kendo.ui.progress($("#splitter"), false);
             
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
                ErrorMsg(data);
            }


        });

    }

    $('#CopiarRegistro').on('hidden.bs.modal', function (e) {
        $("#TxtNoVeces").data("kendoNumericTextBox").focus();
        $("#TxtNoVeces").data("kendoNumericTextBox").value(1);

    });

    //#endregion fin copiar registro

    //#region CRUD Sistema de Tintas 

    function getSisTintas(UrlST) {
        kendo.ui.progress($("#splitter"), true);
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
                kendo.ui.progress($("#splitter"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
            }
        });



    }

    $("#IdSistemaTinta").data("kendoMultiSelect").bind("deselect", function (e) {
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($("#splitter"), true);
            $.ajax({
                url: UrlRtin + "/" + $("#IdRequerimiento").val() + "," + e.dataItem.IdSistemaTinta,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($("#splitter"), false);
                },
                error: function (data) {
                    kendo.ui.progress($("#splitter"), false);
                    ErrorMsg(data);
                }
            });
        }
        
    });

    $("#IdSistemaTinta").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de sistema de tintas
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($("#splitter"), true);
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
                    kendo.ui.progress($("#splitter"), false);
                },
                error: function (data) {
                    getSisTintas(UrlRtin + "/GetByRequerimiento/" + $("#IdRequerimiento").val());
                    kendo.ui.progress($("#splitter"), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin sistema de Tintas

    //#region cambio estado

    // carga vista para el cambio de estado
    // 1. configurar vista.
    Fn_VistaCambioEstado($("#vCambioEstado"));
     // 2. boton cambio de estado.
    $("#btnCambioEstado").click(function () {
        Fn_VistaCambioEstadoMostrar("RequerimientoDesarrollos", $("#Estado").val(), UrlRD + "/RequerimientoDesarrollos_CambiarEstado", "Sp_CambioEstado", getIdReq($("#grid").data("kendoGrid")));
    });

    //#endregion cambio estado

    //#region vista consulta estados

    Fn_VistaConsultaRequerimientoEstados($("#vConsultaEstados"));

    //#endregion fin vista consulta estados

    //#region CRUD Prendas multi select

    function getPrendasMultiSelec(Url) {
        kendo.ui.progress($("#splitter"), true);
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
                kendo.ui.progress($("#splitter"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
            }
        });



    }

    $("#IdCategoriaPrenda").data("kendoMultiSelect").bind("deselect", function (e) {
        if ($("#IdRequerimiento").val() > 0) {

            kendo.ui.progress($("#splitter"), true);
            url = UrlApiP + "/" + e.dataItem.IdCategoriaPrenda + "/" + $("#IdRequerimiento").val().toString();
            $.ajax({
                url: url,//
                type: "Delete",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Delete");
                    kendo.ui.progress($("#splitter"), false);
                },
                error: function (data) {
                    kendo.ui.progress($("#splitter"), false);
                    ErrorMsg(data);
                }
            });

        }
        
    });

    $("#IdCategoriaPrenda").data("kendoMultiSelect").bind("select", function (e) {
        //si el requerimiento de Desarrollo existe 
        //se permite agregar un nuevo registro de prendas
        if ($("#IdRequerimiento").val() > 0) {
            kendo.ui.progress($("#splitter"), true);
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
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($("#splitter"), false);
                },
                error: function (data) {
                    getPrendasMultiSelec(UrlApiP + "/GetByRequerimiento/" + $("#IdRequerimiento").val());
                    kendo.ui.progress($("#splitter"), false);
                    ErrorMsg(data);
                }
            });
        }

    });

    //#endregion Fin Prendas multi select


}); // FIN DOCUMENT READY

//#region Metodos Generales

function Fn_VerEstados(IdRequerimiento) {
    
    Fn_VistaConsultaRequerimientoEstadosGet($("#vConsultaEstados"), "null",IdRequerimiento);
}

function onCloseCambioEstado(e) {
    $("#grid").data("kendoGrid").dataSource.read();
}


function getIdReq(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;

}
function getIdBase(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdBase;

}

function getIdArte(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;

}

function HabilitaFormObje(ToF) {
    KdoDatePikerEnable($("#Fecha"), ToF);
    KdoNumerictextboxEnable($("#CntPiezas"), ToF);
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
    KdoButtonEnable($("#Guardar"),ToF);
    KdoButtonEnable($("#Eliminar"), ToF); 
}

function HabilitaObje(e, ToF){
    ToF === true ? e.removeClass("k-state-disabled") : e.addClass("k-state-disabled");
}

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

function LimpiaMarcaCelda () {
    $(".k-dirty-cell", $("#grid")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#grid")).remove();
}

var DSUnidadMedida = function (filtro) {

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

function CmbNuevoItem(widgetId, value) {
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
}


//#endregion Fin metods Generales




