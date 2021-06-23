let _idPruebaLaboratorio;
let tabStrip;
var NuevoRegistro = false;// inicializa la variable modo nuevo registro
let EstadoActual = 'ING'; // lo inicializa como ingresado si el form está en blanco
let CodCliente = 0;
var fn_InicializarInfoLaboratorio = function (vIdPruebaLaboratorio) {
    _idPruebaLaboratorio = vIdPruebaLaboratorio;

    tabStrip = $("#TabDesplazar").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip");

    KdoButton($("#GuardarSolicitud"), "save", "Guardar solicitud");
    $("#FechaCreacion").kendoDatePicker({ format: "dd/MM/yyyy" });
  //  $("#FechaCreacion").data("kendoDatePicker").value(Fhoy());
   
    //Kendo_CmbFiltrarGrid($("#CmbEstado"), TSM_Web_APi + "Estados/", "Nombre", "Estado", "Seleccione...");

    $("#NoSolicitud").kendoTextBox();
    $("#IdTurno").kendoTextBox();
    $("#IdCorte").kendoTextBox();
    $("#IdBulto").kendoTextBox();
    Kendo_CmbFiltrarGrid($("#CmbTipoOrdenTrabajo"), TSM_Web_APi + "TiposOrdenesTrabajos/", "Nombre", "IdTipoOrdenTrabajo", "Seleccione...");

    Kendo_CmbFiltrarGrid($("#CmbClientePrueba"), TSM_Web_APi + "Clientes/", "Nombre", "IdCliente", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbCalidadPrueba"), TSM_Web_APi + "CalidadPruebas/" , "Nombre", "IdCalidadPrueba", "Seleccione...");
   // Kendo_CmbFiltrarGrid($("#CmbNombreDiseno"), TSM_Web_APi + "CatalogoDisenos/GetCatalogoByCliente/" + CodCliente, "Nombre", "IdCatalogoDiseno", "Seleccione...");
    KdoComboBoxbyData($("#CmbNombreDiseno"), "[]", "Nombre", "IdCatalogoDiseno", "Seleccione un diseño...", "", "");
    /*

   
    $("#CmbNombreDiseno").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(0));

      -- fn_ObtieneDisenos
     */


    Kendo_CmbFiltrarGrid($("#CmbOrigenPrueba"), TSM_Web_APi + "OrigenesPruebasLaboratorio/", "OrigenPrueba", "IdOrigenPrueba", "Seleccione...");
    $("#NumCantLavadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#NumCantQuemadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#IdPlanta").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#IdMaquina").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });




    var dsPiezasLaboratorio = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "PiezasPruebasLaboratorio/GetPrueba/" + _idPruebaLaboratorio;
                },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "PiezasPruebasLaboratorio/" + datos.IdPiezaPrueba; },
                type: "PUT",
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
            if (e.type === "create" || e.type === "update" || e.type === "destroy") {
                kendo.ui.progress($("#contenedor"), true);
                $("#gridEspecimen").data("kendoGrid").dataSource.read();

                kendo.ui.progress($("#contenedor"), false);
            }

        },
        schema: {
            model: {
                id: "IdPiezaPrueba",
                fields: {
                    IdPiezaPrueba: { type: "number" },
                    IdPruebaLaboratorio: { type: "number" },
                    IdPiezaDesarrollada: { type: "number" },
                    NoPieza: { type: "string" },
                    IdCategoriaTalla: { type: "number" },
                    NombreTalla: { type: "string" },
                    TallaCliente: { type: "string" },
                    IdComposicionTela: { type: "number" },
                    ComposicionTela: { type: "string" },
                    IdConstruccionTela: { type: "number" },
                    ConstruccionTela: { type: "string" },
                    IdCategoriaConfeccion: { type: "number" },
                    CategoriaConfeccion: { type: "string" },
                    TelaSustituta: { type: "boolean" },
                    IdHorno: { type: "number" },
                    HornoTemperaturaCurado: { type: "number" },
                    HornoBandaSegundos: { type: "number" },
                    EscalaHornoTemperaturaCurado: { type: "string" },
                    Comentarios: { type: "string" },
                    ColorTelaHex: { type: "string" },
                    ItemPantonera: { type: "number" },
                    IdTipoPantonera: { type: "number" },
                    ID: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION grid Espécimen
    $("#gridEspecimen").kendoGrid({

        beforeEdit: function (e) {
            let g = $("#gridEspecimen").data("kendoGrid");
            if (g.dataSource.total() > 0 && e.model.isNew() ) {
                e.preventDefault();

                $("#kendoNotificaciones").data("kendoNotification").show("Ya existe un espécimen", "error");
                $("#gridEspecimen").data('kendoGrid').dataSource.cancelChanges();
            }   

        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPiezaPrueba");
            KdoHideCampoPopup(e.container, "IdPruebaLaboratorio");
            KdoHideCampoPopup(e.container, "IdPiezaDesarrollada");
            KdoHideCampoPopup(e.container, "NombreTalla");
            KdoHideCampoPopup(e.container, "ComposicionTela");
            KdoHideCampoPopup(e.container, "ConstruccionTela");
            KdoHideCampoPopup(e.container, "CategoriaConfeccion");
            KdoHideCampoPopup(e.container, "IdTipoPantonera");
            KdoHideCampoPopup(e.container, "ItemPantonera");


            $('[name="ColorTelaHex"]').data("kendoColorPicker").enable(false);



            $(e.container).parent().css({
                width: '40%',
                height: '80%'
            });
            Grid_Focus(e, "Comentario");

            $('[name="ID"]').on("change", function (e) {
                if ($(this).data("kendoMultiColumnComboBox").dataItem() !== undefined) {
                    if ($(this).data("kendoMultiColumnComboBox").selectedIndex >= 0) {
                        var data = $(this).data("kendoMultiColumnComboBox").dataItem();

                        $('[name="ColorTelaHex"]').data("kendoColorPicker").value(data.ColorHex);
                        $('[name="ColorTelaHex"]').data("kendoColorPicker").trigger("change");
                      
                        $('[name="ItemPantonera"]').data("kendoNumericTextBox").value(data.Item);
                        $('[name="ItemPantonera"]').data("kendoNumericTextBox").trigger("change");
                        $('[name="IdTipoPantonera"]').data("kendoNumericTextBox").value(data.IdTipoPantonera);
                        $('[name="IdTipoPantonera"]').data("kendoNumericTextBox").trigger("change");
                    }

                } else {

                    $('[name="ItemPantonera"]').data("kendoNumericTextBox").value(null);
                    $('[name="ItemPantonera"]').data("kendoNumericTextBox").trigger("change");
                    $('[name="IdTipoPantonera"]').data("kendoNumericTextBox").value(null);
                    $('[name="IdTipoPantonera"]').data("kendoNumericTextBox").trigger("change");
                }
            });

            if (!e.model.isNew() && e.model.Item !== null) {
                $('[name="ID"]').data("kendoMultiColumnComboBox").text(e.model.ID);
                $('[name="ID"]').data("kendoMultiColumnComboBox").trigger("change");
                $('[name="ID"]').data("kendoMultiColumnComboBox").search(e.model.ID);
                $('[name="ID"]').data("kendoMultiColumnComboBox").refresh();
                $('[name="ID"]').data("kendoMultiColumnComboBox").close();

            }
            if (e.model.isNew()) {
                Grid_Focus(e, "ID");
            } 
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPiezaPrueba", title: "PiezaLaboratorio", hidden: true },
            { field: "IdPruebaLaboratorio", title: "IdPruebaLaboratorio", hidden: true },
            { field: "IdPiezaDesarrollada", title: "IdPiezaDesarrollada", hidden: true },
            { field: "NoPieza", title: "Pieza desarrollada", hidden: false, width:100 },
            { field: "IdCategoriaTalla", title: "IdCategoriaTalla", hidden: true },
            { field: "NombreTalla", title: "Categoría talla", hidden: false, width: 200 },
            { field: "TallaCliente", title: "Talla cliente", hidden: false, width: 100 },
            { field: "IdComposicionTela", title: "IdComposicionTela", hidden: true, editor: Grid_Combox, values: ["IdComposicionTela", "Nombre", TSM_Web_APi + "ComposicionTelas", "", "Seleccione...."] },
            { field: "ComposicionTela", title: "Composición tela", hidden: false, width: 200 },
            { field: "IdConstruccionTela", title: "IdConstruccionTela", hidden: true, width: 100, editor: Grid_Combox, values: ["IdConstruccionTela", "Nombre", TSM_Web_APi +  "ConstruccionTelas", "", "Seleccione...."]},
            { field: "ConstruccionTela", title: "Construcción tela", hidden: false, width: 200 },
            { field: "IdCategoriaConfeccion", title: "IdCategoriaConfeccion", hidden: true, editor: Grid_Combox, values: ["IdCategoriaConfeccion", "Nombre", TSM_Web_APi + "CategoriaConfecciones", "", "Seleccione...."] },
            { field: "CategoriaConfeccion", title: "Confección tela", hidden: false, width: 200 },
            {
                field: "ID", title: "Color de tela",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlPantonesLaboratorio();
                },
                hidden: true
            },
            {
                field: "ColorTelaHex", title: "Muestra color de tela", width: "120px",
                template: '<span style="background-color: #:ColorTelaHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>',
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).kendoColorPicker();
                }
            },
            
            { field: "IdHorno", title: "Horno", hidden: false },
            { field: "HornoTemperaturaCurado", title: "Temperatura horno" },
            { field: "EscalaHornoTemperaturaCurado", title: "Escala horno" },
            { field: "HornoBandaSegundos", title:  "Velocidad banda (seg)" },
          
            { field: "TelaSustituta", title: "Tela sustituta", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "TelaSustituta"); } },
            { field: "Comentarios", title: "Comentarios", width: 100, hidden: false, width: 250 },
            { field: "ItemPantonera", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "IdTipoPantonera", title: "Tipo Pantone", hidden: true, menu: false }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridEspecimen").data("kendoGrid"), ModoEdicion.EnPopup,true, false, true, false, redimensionable.No,400);
    SetGrid_CRUD_ToolbarTop($("#gridEspecimen").data("kendoGrid"), true,false,false);
    SetGrid_CRUD_Command($("#gridEspecimen").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridEspecimen").data("kendoGrid"), dsPiezasLaboratorio, 20);

    var verSeteoSelrows = [];
    $("#gridEspecimen").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridEspecimen"), verSeteoSelrows);
    });

    $("#gridEspecimen").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridEspecimen"), verSeteoSelrows);
    });


    //maneja doble clic para editar 
    $("#gridEspecimen").getKendoGrid().one("dataBound", function (e) {
        var grid = this;

        grid.element.on('dblclick', 'tbody tr', function (e) {
            grid.editRow($(e.target).closest('tr'));
        });

        Grid_SetSelectRow($("#gridEspecimen"), verSeteoSelrows);
    })


    /*  Grid Resultados de pruebas   */
    
    var dsResultadoLaboratorio = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "ResultadosPiezasPruebasLaboratorio/Pieza/" + fn_getPiezaLab($("#gridEspecimen").data("kendoGrid"));
                },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "ResultadosPiezasPruebasLaboratorio/" + datos.IdResultado; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "ResultadosPiezasPruebasLaboratorio/" + datos.IdResultado; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "ResultadosPiezasPruebasLaboratorio",
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
            if (e.type === "create" || e.type === "update" || e.type === "destroy") {
                kendo.ui.progress($("#contenedor"), true);
                $("#gridResultado").data("kendoGrid").dataSource.read();

                kendo.ui.progress($("#contenedor"), false);
            }

        },
        schema: {
            model: {
                id: "IdResultado",
                fields: {
                    IdResultado: { type: "number" },
                    IdPiezaPrueba: { type: "number", defaultValue: function () { return fn_getPiezaLab($("#gridEspecimen").data("kendoGrid")); } },
                    ItemResultado: { type: "number" },
                    IdReferenciaPrueba: { type: "number" },
                    NombreReferencia: { type: "string" },
                    CalificacionGrises: { type: "number" },
                    IdMotivoEvaluacion: { type: "number" },
                    MotivoEvaluacion: { type: "string" },
                    ColorHexEvaluado: { type: "string" },
                    ItemPantonera: { type: "number" },
                    IdTipoPantonera: { type: "number" },
                    ID: { type: "string" },
                    Comentarios: { type: "string" },
                    IdTipoTinta: { type: "number" },
                    NombreTipoTinta: { type:"string"}
                                       
                }
            }
        }
    });



    $("#gridResultado").kendoGrid({

        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPiezaPrueba");
            KdoHideCampoPopup(e.container, "IdResultado");
            KdoHideCampoPopup(e.container, "ItemResultado");
            KdoHideCampoPopup(e.container, "NombreReferencia");
            KdoHideCampoPopup(e.container, "MotivoEvaluacion");
             KdoHideCampoPopup(e.container, "IdTipoPantonera");
            KdoHideCampoPopup(e.container, "ItemPantonera");
            KdoHideCampoPopup(e.container, "NombreTipoTinta");

            $('[name="ColorHexEvaluado"]').data("kendoColorPicker").enable(false);

            $(e.container).parent().css({
                width: '40%',
                height: '80%'
            });
            Grid_Focus(e, "Comentario");

            $('[name="ID"]').on("change", function (e) {
                if ($(this).data("kendoMultiColumnComboBox").dataItem() !== undefined) {
                    if ($(this).data("kendoMultiColumnComboBox").selectedIndex >= 0) {
                        var data = $(this).data("kendoMultiColumnComboBox").dataItem();

                        $('[name="ColorHexEvaluado"]').data("kendoColorPicker").value(data.ColorHex);
                        $('[name="ColorHexEvaluado"]').data("kendoColorPicker").trigger("change");

                        $('[name="ItemPantonera1"]').data("kendoNumericTextBox").value(data.Item);
                        $('[name="ItemPantonera1"]').data("kendoNumericTextBox").trigger("change");
                        $('[name="IdTipoPantonera1"]').data("kendoNumericTextBox").value(data.IdTipoPantonera);
                        $('[name="IdTipoPantonera1"]').data("kendoNumericTextBox").trigger("change");
                    }

                } else {

                    $('[name="ItemPantonera1"]').data("kendoNumericTextBox").value(null);
                    $('[name="ItemPantonera1"]').data("kendoNumericTextBox").trigger("change");
                    $('[name="IdTipoPantonera1"]').data("kendoNumericTextBox").value(null);
                    $('[name="IdTipoPantonera1"]').data("kendoNumericTextBox").trigger("change");
                }
            });

            if (!e.model.isNew() && e.model.Item !== null) {
                $('[name="ID"]').data("kendoMultiColumnComboBox").text(e.model.ID);
                $('[name="ID"]').data("kendoMultiColumnComboBox").trigger("change");
                $('[name="ID"]').data("kendoMultiColumnComboBox").search(e.model.ID);
                $('[name="ID"]').data("kendoMultiColumnComboBox").refresh();
                $('[name="ID"]').data("kendoMultiColumnComboBox").close();

            }
            if (e.model.isNew()) {
                Grid_Focus(e, "ID");
            }
        },  
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdResultado", title: "IdResultado", hidden: true },
            { field: "IdPiezaPrueba", title: "PiezaLaboratorio", hidden: true },
            { field: "ItemResultado", title: "ItemResultado", hidden: true },
            { field: "IdReferenciaPrueba", title: "IdReferenciaPrueba", hidden: true, editor: Grid_Combox, values: ["IdReferenciaPrueba", "Referencia", TSM_Web_APi + "ReferenciasPruebasLaboratorio", "", "Seleccione...."]  },
            { field: "NombreReferencia", title: "Evaluado contra", hidden: false, width: 100 },
            { field: "CalificacionGrises", title: "Calificación", hidden: false, editor: Grid_ColNumeric, values: ["required", "1", "5", "#", 0] },
            { field: "IdMotivoEvaluacion", title: "IdMotivoEvaluacion", hidden: true, width: 200, editor: Grid_Combox, values: ["IdMotivoEvaluacion", "MotivoEvaluacion", TSM_Web_APi + "MotivosEvaluacionPruebasLaboratorio", "", "Seleccione...."]  },
            { field: "MotivoEvaluacion", title: "Motivo", hidden: false, width: 100 },
            {
                field: "ID", title: "Evaluando",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlPantonesLaboratorio();
                },
                hidden: true
            },
            {
                field: "ColorHexEvaluado", title: "Color evaluado", width: "120px",
                template: '<span style="background-color: #:ColorHexEvaluado#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>',
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).kendoColorPicker();
                }
            },                   
             { field: "Comentarios", title: "Comentarios", width: 100, hidden: false, width: 250 },
            { field: "ItemPantonera1", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "IdTipoPantonera1", title: "Tipo Pantone", hidden: true, menu: false },
            { field: "IdTipoTinta", title: "IdTipoTinta", hidden: true, width: 200, editor: Grid_Combox, values: ["IdTipoTinta", "Nombre", TSM_Web_APi + "TiposTintas", "", "Seleccione...."] },
            { field: "NombreTipoTinta", title: "Tipo de tinta", hidden: false, menu: false,width:200 }
        ]
    });


    // Funciones degrid
    SetGrid($("#gridResultado").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.No, 400);
    SetGrid_CRUD_ToolbarTop($("#gridResultado").data("kendoGrid"), true, false, false);
    SetGrid_CRUD_Command($("#gridResultado").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridResultado").data("kendoGrid"), dsResultadoLaboratorio, 20);

    var selectedRows = [];
    $("#gridEspecimen").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridEspecimen"), selectedRows);
        if ($("#gridEspecimen").data("kendoGrid").dataSource.total() === 0) {
            Grid_HabilitaToolbar($("#gridResultado"), false, false, false);
        } else {
            Grid_HabilitaToolbar($("#gridResultado"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    });

    $("#gridEspecimen").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridEspecimen"), selectedRows);
    });

    var selectedRowsDet = [];
    $("#gridResultado").getKendoGrid().one("dataBound", function (e) {
        var grid = this;

        grid.element.on('dblclick', 'tbody tr', function (e) {
            grid.editRow($(e.target).closest('tr'));
        });

        Grid_SetSelectRow($("#gridResultado"), selectedRowsDet);
    })


    $("#gridResultado").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridResultado"), selectedRowsDet);
    });

    $("#gridResultado").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridResultado"), selectedRowsDet);
    });

    $("#gridEspecimen").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridEspecimen"), selectedRowsDet);
        $("#gridResultado").data("kendoGrid").dataSource.data([]);
        $("#gridResultado").data("kendoGrid").dataSource.read();

    });


    let ValidaFormSolicitud = $("#FrmPruebaGeneral").kendoValidator(
        {
            rules: {

                msgCliente: function (input) {
                    if (input.is("[name='CmbCliente']")) {
                        return $("#CmbCliente").data("kendoComboBox").value() > 0;
                    }
                    return true;
                }

            },
            messages: {

                msgCliente: "Debe seleccionar el cliente"

            }
        }
    ).data("kendoValidator");


    $("#GuardarSolicitud").click(function (event) {
        event.preventDefault();
        if (ValidaFormSolicitud.validate()) {
            GuardarHeaderSolicitud();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#CmbClientePrueba").data("kendoComboBox").bind("change", function (e) {
       // let value = KdoCmbGetValue($("#CmbCliente"));
        CodCliente = KdoCmbGetValue($("#CmbClientePrueba"));
        $("#CmbNombreDiseno").data("kendoComboBox").setDataSource(fn_ObtieneDisenos(CodCliente));


    });


    getSolicitud();

};





function fn_getPiezaLab(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdPiezaPrueba;
}

let getSolicitud = function () {
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: TSM_Web_APi + "PruebasLaboratorio/" + _idPruebaLaboratorio,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (respuesta) {
            if (respuesta !== null) {
                EstadoActual = respuesta.Estado;
                $("#NoSolicitud").data("kendoTextBox").value(respuesta.NoSolicitud);
               // $("#CmbEstado").data("kendoComboBox").value(respuesta.Estado);
                $("#FechaCreacion").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaCreacion), 'dd/MM/yyyy'));
                $("#CmbClientePrueba").data("kendoComboBox").value(respuesta.IdCliente);
                $("#CmbNombreDiseno").data("kendoComboBox").setDataSource(fn_ObtieneDisenos(respuesta.IdCliente));

                $("#CmbNombreDiseno").data("kendoComboBox").dataSource.read();
                $("#CmbCalidadPrueba").data("kendoComboBox").value(respuesta.IdCalidadPrueba);
                $("#CmbNombreDiseno").data("kendoComboBox").value(respuesta.IdCatalogoDiseno);
                $("#CmbTipoOrdenTrabajo").data("kendoComboBox").value(respuesta.IdTipoOrdenTrabajo);
                $("#CmbOrigenPrueba").data("kendoComboBox").value(respuesta.IdOrigenPrueba);
                $("#NumCantLavadas").data("kendoNumericTextBox").value(respuesta.CantidadLavadas);
                $("#NumCantQuemadas").data("kendoNumericTextBox").value(respuesta.CantidadQuemadas);
                $('#SNLectura').prop('checked', respuesta.Lectura );
                $("#IdPlanta").data("kendoNumericTextBox").value(respuesta.IdPlanta);
                $("#IdTurno").data("kendoTextBox").value(respuesta.IdTurno);
                $("#IdMaquina").data("kendoNumericTextBox").value(respuesta.IdMaquina);
                $("#IdCorte").data("kendoTextBox").value(respuesta.IdCorte);
                $("#IdBulto").data("kendoTextBox").value(respuesta.IdBulto);


                kendo.ui.progress($("#vistaParcial"), false);
              //  UrlApiArteAdj = UrlApiArteAdj + "/GetVistaImagenes/" + respuesta.IdArte;
               // getAdjun(UrlApiArteAdj);
                //KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true);
                //$("#GridAdjuntos").data("kendoGrid").dataSource.read();

            } else {
                //LimpiarArte();
               // Fn_DibujarCarrousel($("#Mycarousel"), "", null);
                kendo.ui.progress($("#vistaParcial"), false);
             //   $("#myBtnAdjunto").data("kendoButton").enable(false);
               // $("#IdArte").val("0");
            }


         //   $("#IdRequerimiento").val() !== "0" && $("#Estado").val() === "EDICION" && $("#IdArte").val() !== "0" ? KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true) : $("#myBtnAdjunto").data("kendoButton").enable(false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });





};




let GuardarHeaderSolicitud = function () {
    kendo.ui.progress($("#FrmPruebaGeneral"), true);

    $.ajax({
        url: TSM_Web_APi + "PruebasLaboratorio/" + _idPruebaLaboratorio,
        type: "Put",
        dataType: "json",
        data: JSON.stringify({
            IdPruebaLaboratorio: _idPruebaLaboratorio,
            IdCalidadPrueba: $("#CmbCalidadPrueba").data("kendoComboBox").value(),
            Estado: EstadoActual,
            FechaCreacion: kendo.toString(kendo.parseDate($("#FechaCreacion").val()), 's'),
            CantidadLavadas: $("#NumCantLavadas").data("kendoNumericTextBox").value(),
            CantidadQuemadas: $("#NumCantQuemadas").data("kendoNumericTextBox").value(),
            IdCliente: $("#CmbClientePrueba").data("kendoComboBox").value(),
            IdOrigenPrueba: $("#CmbOrigenPrueba").data("kendoComboBox").value(),
            IdCatalogoDiseno: $("#CmbNombreDiseno").data("kendoComboBox").value(),
            IdTipoOrdenTrabajo: KdoCmbGetValue($("#CmbTipoOrdenTrabajo")),
            IdPlanta: $("#IdPlanta").data("kendoNumericTextBox").value(),
            IdTurno: $("#IdTurno").data("kendoTextBox").value(),
            IdMaquina: $("#IdMaquina").data("kendoNumericTextBox").value(),
            IdCorte: $("#IdCorte").data("kendoTextBox").value(),
            IdBulto: $("#IdBulto").data("kendoTextBox").value(),
            Lectura: $("#SNLectura").is(':checked'),
            NoSolicitud: $("#NoSolicitud").data("kendoTextBox").value(),
            IdUsuario: getUser()


            /*
             $("#IdPlanta").data("kendoNumericTextBox").value(respuesta.IdPlanta);
                $("#IdTurno").data("kendoTextBox").value(respuesta.IdTurno);
                $("#IdMaquina").data("kendoNumericTextBox").value(respuesta.IdMaquina);
                $("#IdCorte").data("kendoTextBox").value(respuesta.IdCorte);
                $("#IdBulto").data("kendoTextBox").value(respuesta.IdBulto);
             
             
             */
            
            //Entidad prendas
           // IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
          
            //PoseeDocumentacionAduanal: $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").check(),
            
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            getSolicitud();
            console.log("success");

            //Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesColor"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesFoil"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesArtSug"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);



            //habilitar botones
            //$("#myBtnAdjunto").data("kendoButton").enable(true);
            RequestEndMsg(data, "Put");
            kendo.ui.progress($("#FrmPruebaGeneral"), false);

           
        },
        error: function (data) {

            kendo.ui.progress($("#BPform"), false);
            ErrorMsg(data);
           // $("#Nombre").focus().select();
        }
    });

};



var fn_ObtieneDisenos = function (CodCliente) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "CatalogoDisenos/GetCatalogoByCliente/" + (CodCliente !== null ? CodCliente.toString() : 0),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};


var fn_CargarInfoLaboratorio = function (vIdPruebaLaboratorio) {
    _idPiezaDesarrollada = vIdPruebaLaboratorio;
   // $("#gridEspecimen").data("kendoGrid").dataSource.read();
};