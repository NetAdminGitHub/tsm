
var fun_List = [];
var fun_ListDatos = [];
var fun_ListMetodoSaveForm = []; //contiene lista de metodos de guardado para la entidad TintasFormulas.
var Permisos;
var item;
var idTipoOrdenTrabajo;
var EtpAsignado = false;
var EtpSeguidor = false;
let vpImgDis;
var xIdQuimica;
var NombreQui;
var xVistaFormulario;
var gridAlto = 300;
var xvNodocReq;
var maq; // guarda el seteo de la maquina por orden de trabajo , etapa e item
var TiEst; // guarda los tipos de estaciones
var TipoTintas;
var ConfigEtapas;
var xCmdIdUnidadPeso_Mues;
var xNumPeso_Mues;
var xAreaDis;
var xIdUnidadAreaDis;
var xNumResolucionDPI_Dis;
var xNumLineajeLPI_Dis;
var xNumPixeles_Dis;
let xCmbTecnica_Mues;
let xCmbBaseMezcla_Mues;
let xCmbBasePigmentos_Mues;
var SetFor;
var EstaMarco;
var EstacionBra;
var Te;
var idBra;
var EstaTintasFormula;
var EstacionBraAcce;
var idBraAcce;
var xidEstacion;
var vidForm = 0;
var xTxtLetra;
var xEstado;
var xEstadoOT;
var AccesMaquinaArt;
var CumpleOEKOTEX;
let xvIdOrdenTrabajo=0;
let xvIdSolicitudCambio=0;
let xvItemSolicitud = 0;
let xIdSeteoMq = 0;
let QuimicaFormula = 0;
var InicioModalRT = 0;
var InicioModalAD = 0;
var InicioModalMU = 0;
var InicioModalFor = 0;
var CantidadBrazos = 22;
var XSeteo = 0;
var xNoPermiteActualizar = false;
var LEstaciones = "";
fPermisos = function (datos) {
    Permisos = datos;
};

var fn_CambioEtp = function (e) {
    let Realizado = false;
    if (ValidarCamEtp.validate()) {
        // obtener indice de la etapa siguiente
        let xindice = KdoCmbGetValue($("#cmbEtpSigAnt"));
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "OrdenesTrabajos/CambiarEtapa",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                idOrdenTrabajo: $("#txtIdOrdenTrabajo").val(),
                idEtapaNuevo: KdoCmbGetValue($("#cmbEtpSigAnt")),
                idUsuarioAsignado: KdoCmbGetValue($("#cmbUsuarioEtp")),
                motivo: $("#TxtMotivoEtp").val(),
                IdUsuario: getUser()
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Realizado = true;
                RequestEndMsg(datos, "Post");
                $("#vCamEtapa").data("kendoDialog").close();
                Number(idEtapaProceso) === Number(xindice) ? location.reload() : $("#smartwizard").smartWizard("goToPage", $("[etapa=" + xindice.toString() + "]").attr("indice"));

            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(".k-dialog"), false);
            }
        });
    } else {
        Realizado = false;
    }
    return Realizado;
};
var tabStrip;
$(document).ready(function () {

    //tab modal para vista Desplazamiento e Intercambio
    tabStrip = $("#TabDesplazar").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip");


    $('#rbDesplazarRight').prop('checked', true);
    PanelBarConfig($("#BarPanelInfo"));
    kendo.ui.progress($(document.body), true);
    //cargando los accesorios maquinas
    fn_getAccesoriosMaquinasArticulos();
    //cargando todas las etapas
    fn_ConfigEtapas();

    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetEtapasByOrdenTrabajo/" + idOrdenTrabajo,
        method: 'GET',
        success: function (resultado) {
            CrearEtapasProcesosModulo($("#smartwizard"), resultado, opcionesFormaSmartWizard.Flechas);
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    Kendo_CmbFiltrarGrid($("#cmbUsuario"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/0/0", "Nombre", "IdUsuario", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbEtpSigAnt"), TSM_Web_APi + "EtapasProcesos/GetEtapasAnterioresSiguientesByIdEtapaProceso/0", "Nombre", "IdEtapaProcesoAS", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbUsuarioEtp"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/0/0", "Nombre", "IdUsuario", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbTpAjuste"), TSM_Web_APi + "Alertas", "Nombre", "IdAlerta", "Seleccione...");
    KdoCmbSetValue($("#cmbTpAjuste"), 1);
    KdoComboBoxEnable($("#cmbTpAjuste"), false);

    $("#cmbEtpSigAnt").data("kendoComboBox").bind("change", function (e) {
        $("#cmbUsuarioEtp").data("kendoComboBox").value("");
        $("#cmbUsuarioEtp").data("kendoComboBox").setDataSource(get_cmbUsuarioEtp(idTipoOrdenTrabajo.toString(), this.value() === "" ? 0 : this.value()));

    });


    $("#Menu_Volver").kendoMenu({
        openOnClick: true
    });

    KdoButton($("#btnCambiarAsignado"), "user");
    KdoButton($("#btnAsignarUsuario"), "save");
    KdoButton($("#btnCambiarEtapa"), "gear");
    KdoButton($("#btnAutorizarRetenciones"), "warning");
    KdoButton($("#btnIrGOT"), "hyperlink-open-sm");
    KdoButton($("#btnSolicitarRegistroCambio"), "track-changes");
    KdoButton($("#btnRegistroCambio"), "track-changes-accept");
    KdoButton($("#btnAgenda"), "track-changes", "Comentarios por departamento");


    KdoButtonEnable($("#btnSolicitarRegistroCambio"), false);
    KdoButtonEnable($("#btnRegistroCambio"), false);

    KdoButton($("#btnDesplazarEstacion"), "check", "Comentarios por departamento");
    KdoButton($("#btnCambiarEstacion"), "check", "Desplazar / Intercambiar");
    KdoButton($("#btnDuplicarEstacion"), "gear", "Duplicar");
    KdoButton($("#btnRegAjuste"), "save", "Solicitar Ajuste");

    $("#swchSolTelaSusti").kendoSwitch();
    $("#swchSolDesOEKO").kendoSwitch();
    $("#swchPDocAduanal").kendoSwitch();
    $("#swchCobDiseno").kendoSwitch();

    $("#NumBrazoIni").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        max: 22
    });

    $("#NumCntCantDesplazar").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });


    //$("#NumBrazoA").kendoNumericTextBox({
    //    format: "#",
    //    restrictDecimals: true,
    //    decimals: 0,
    //    value: 0,
    //    max:22
    //});

    //$("#NumBrazoB").kendoNumericTextBox({
    //    format: "#",
    //    restrictDecimals: true,
    //    decimals: 0,
    //    value: 0,
    //    max: 22
    //});

    $("#NumOrigenA").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        max: 22
    });

    $("#NumDestinoB").kendoNumericTextBox({
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        max: 22
    });

    //Iniciar Grid de intercambio
    fn_gridEstacionIntercambio($("#gridInter"));


    //#region Grid soliciud
    var dsetRegCambios = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "OrdenesTrabajosSolicitudesCambios/GetByIdOrdenTrabajo/" + idOrdenTrabajo;
                },
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
                id: "IdOrdenTrabajo",
                fields: {
                    IdOrdenTrabajo: { type: "number" },
                    IdSolicitudCambio: { type: "number" },
                    NombreSolicitudCambio: { type: "string" },
                    ItemSolicitud: { type: "number" },
                    Comentario: { type: "string" },
                    Estado: { type: "string" },
                    NombreEstado: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Fecha: { type: "date" }

                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gridRegistroCambios").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
            var grid = $("#gridRegistroCambios").data("kendoGrid");
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.Estado === 'GENERADA') {
                    $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#83de83");
                } else {
                    $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                }
            });
        },
        columns: [
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NombreEstado", title: "Estado" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", minResizableWidth: 175 },
            { field: "IdOrdenTrabajo", title: "Código Orden Trabajo", hidden: true, minResizableWidth: 300 },
            { field: "IdSolicitudCambio", title: "Código solicitud cambio", hidden: true, minResizableWidth: 200 },
            { field: "NombreSolicitudCambio", title: "Cambio", minResizableWidth: 300 },
            { field: "ItemSolicitud", title: "Item", hidden: true },
            { field: "Comentario", title: "Comentario", minResizableWidth: 700 },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridRegistroCambios").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, true, redimensionable.Si, 220);
    Set_Grid_DataSource($("#gridRegistroCambios").data("kendoGrid"), dsetRegCambios, 20);
    var srow1 = [];
    $("#gridRegistroCambios").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRegistroCambios"), srow1);
    });

    $("#gridRegistroCambios").data("kendoGrid").bind("change", function (e) {
        var sel = $("#gridRegistroCambios").data("kendoGrid").dataItem($("#gridRegistroCambios").data("kendoGrid").select());
        xest = sel === null ? 0 : sel.Estado;
        xest === "AUTORIZADA" || EtpAsignado === false ? Grid_HabilitaToolbar($("#gridRegistroCambiosDetalle"), false, false, false) : EtpSeguidor === true ? Grid_HabilitaToolbar($("#gridRegistroCambiosDetalle"), false, false, false) : Grid_HabilitaToolbar($("#gridRegistroCambiosDetalle"), false, true, false);
        fn_ConsultarDetalle();
        Grid_SelectRow($("#gridRegistroCambios"), srow1);
    });

    //#endregion 

    //#region Grid detalle de solicitud
    var dsetRegCambiosDetalle = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "GetOrdenesTrabajosDetallesSolicitudesCambiosAut/GetAut/" + idOrdenTrabajo + "/" + xvIdSolicitudCambio + "/" + xvItemSolicitud;
                },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) {
                    return TSM_Web_APi + "OrdenesTrabajosDetallesSolicitudesCambiosAut/Registro/" + datos.IDOrdenTrabajo + "/" + datos.IdSolicitudCambio + "/" + datos.ItemSolicitud + "/" + datos.IdEtapaProceso + "/" + datos.Item;
                },
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
            if (e.type === "update") {
                $("#gridRegistroCambios").data("kendoGrid").dataSource.read();
            }
        },
        schema: {
            model: {
                id: "IdEtapaProceso",
                fields: {
                    IDOrdenTrabajo: { type: "number" },
                    IdSolicitudCambio: { type: "number" },
                    NombreSolicitudCambio: { type: "string" },
                    ItemSolicitud: { type: "number" },
                    IdEtapaProceso: { type: "number" },
                    NombreEtapaProceso: { type: "string" },
                    Item: { type: "number" },
                    Estado: { type: "string" },
                    NombreEstado: { type: "string" },
                    Comentario: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Comentario']") && (input.val().length > 500 || input.val().length < 0)) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }


                                return true;
                            }
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Autorizado: { type: "bool" }

                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gridRegistroCambiosDetalle").kendoGrid({
        //dataBound: function () {
        //    for (var i = 0; i < this.columns.length; i++) {
        //        this.autoFitColumn(i);
        //        this.columnResizeHandleWidth;
        //    }
        //},
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IDOrdenTrabajo");
            KdoHideCampoPopup(e.container, "IdSolicitudCambio");
            KdoHideCampoPopup(e.container, "NombreSolicitudCambio");
            KdoHideCampoPopup(e.container, "ItemSolicitud");
            KdoHideCampoPopup(e.container, "IdEtapaProceso");
            KdoHideCampoPopup(e.container, "NombreEtapaProceso");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NombreEstado");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            if (Number(e.model.IdEtapaProceso) !== Number($("#txtIdEtapaProceso").val())) {
                TextBoxEnable($('[name="Comentario"]'), false);
                KdoCheckBoxEnable($('[name="Autorizado"]'), false);
            }
            Grid_Focus(e, "Comentario");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IDOrdenTrabajo", title: "Código Orden Trabajo", hidden: true },
            { field: "IdSolicitudCambio", title: "Código solicitud cambio", hidden: true },
            { field: "NombreSolicitudCambio", title: "Solicitud de cambio", hidden: true },
            { field: "ItemSolicitud", title: "Item", hidden: true },
            { field: "IdEtapaProceso", title: "Código Etapa", hidden: true },
            { field: "NombreEtapaProceso", title: "Etapa", minResizableWidth: 250 },
            { field: "Item", title: "Item", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NombreEstado", title: "Nombre Estado", hidden: true },
            { field: "Comentario", title: "Comentario", minResizableWidth: 700 },
            { field: "Autorizado", title: "Autorizado ?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Autorizado"); } },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridRegistroCambiosDetalle").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_ToolbarTop($("#gridRegistroCambiosDetalle").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridRegistroCambiosDetalle").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridRegistroCambiosDetalle").data("kendoGrid"), dsetRegCambiosDetalle);

    var srow2 = [];
    $("#gridRegistroCambiosDetalle").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRegistroCambiosDetalle"), srow2);
    });

    $("#gridRegistroCambiosDetalle").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRegistroCambiosDetalle"), srow2);

    });
    //#endregion

    //#region Grid Ingreso de ajuste en estación

    var dsetAjusteEst = new kendo.data.DataSource({

        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasAlertas/GetIdSeteo/" + XSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasAlertas/" + datos.IdSeteo + "/" + datos.Item; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasAlertas/" + datos.IdSeteo + "/" + datos.Item; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SeteoMaquinasAlertas",
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
        },
        schema: {
            model: {
                id: "IdEstacion",
                fields: {
                    IdSeteo: { type: "number"},
                    Item: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdAlerta: { type: "string" },
                    Nombre: { type: "string" },
                    Fecha: { type: "date" },
                    Descripcion: {
                        type: "string"
                        //validation: {
                        //    required: true,
                        //    maxlength: function (input) {
                        //        //if (input.is("[name='IdAlerta']")) {
                        //        //    input.attr("data-maxlength-msg", "Requerido");
                        //        //    return $("#IdAlerta").data("kendoComboBox").selectedIndex >= 0;
                        //        //}
                        //        if (input.is("[name='Descripcion']")) {
                        //            input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                        //            return input.val().length > 0 && input.val().length <= 300;
                        //        }
                        //        return true;
                        //    }
                        //}
                    },
                    Estado: { type: "string", defaultValue: function () { return 'ACTIVA'; } },
                    Nombre1: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    },
                    IdRow: { type: "number"}

                }
            }
        }
        //,
        //group: {
        //    field: "Nombre"
        //}
    });
    //CONFIGURACION DEL gCHFor,CAMPOS

    $("#gridAlerAjus").kendoGrid({

        edit: function (e) {
            //KdoHideCampoPopup(e.container, "IdSeteo");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdSeteo");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Fecha");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "DescripcionEstacion");
            KdoHideCampoPopup(e.container, "NombreColorEstacion");
            KdoHideCampoPopup(e.container, "ColorHex");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdAlerta");
                KdoHideCampoPopup(e.container, "IdEstacion");
                KdoHideCampoPopup(e.container, "Estado");

                $("[name='IdAlerta']").data("kendoComboBox").value(KdoCmbGetValue($("#cmbTpAjuste")));
                $("[name='IdAlerta']").data("kendoComboBox").trigger("change");
                $("[name='Estado']").data("kendoComboBox").value('ACTIVA');
                $("[name='Estado']").data("kendoComboBox").trigger("change");
                //$("[name='Estado']").trigger();
       
            } else {
                KdoHideCampoPopup(e.container, "Estado");
            }
            Grid_Focus(e, "IdEstacion");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdEstacion", title: "Estación", editor: Grid_ColNumeric, values: ["required", "1", CantidadBrazos, "#", 0] },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120 },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" },
            { field: "IdSeteo", title: "Código IdSeteo", hidden: true },
            { field: "Item", title: "Item", hidden: true},
            { field: "IdAlerta", title: "Ajuste", editor: Grid_Combox, values: ["IdAlerta", "Nombre", TSM_Web_APi + "Alertas", "", "Seleccione...."], hidden: true},
            { field: "Nombre", title: "Nombre", hidden: true },
            { field: "Descripcion", title: "Comentario ajuste", editor: Grid_ColTextArea, values: ["6"] },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", TSM_Web_APi + "Estados", "SeteoMaquinasAlertas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true},
            { field: "Nombre1", title: "Estado", hidden: true },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
            //{
            //    command: {
            //        name: "cambiarEstado",
            //        iconClass: "TS-icon-ARROW",
            //        text: "",
            //        click: function (e) {
            //            e.preventDefault();
            //            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            //            //var lstId = {
            //            //    IdFormula: dataItem.IdFormula
            //            //};
            //            Fn_VistaCambioEstadoMostrar("SeteoMaquinasAlertas", dataItem.Estado, TSM_Web_APi + "TintasFormulaciones/TintasFormulaciones_CambiarEstado", "", dataItem.IdFormula, undefined, function () { return fn_UpdEstadoGrilla(); });
            //        }
            //    },
            //    width: "70px",
            //    attributes: {
            //        style: "text-align: center"
            //    }
            //}
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridAlerAjus").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 500,false);
    SetGrid_CRUD_Command($("#gridAlerAjus").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridAlerAjus").data("kendoGrid"), dsetAjusteEst);

    //var srow5 = [];
    //$("#gridAlerAjus").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
    //    Grid_SetSelectRow($("#gridAlerAjus"), srow5);
    //});

    $("#gridAlerAjus").data("kendoGrid").bind("change", function (e) {
        //Grid_SelectRow($("#gridAlerAjus"), srow5);
        LEstaciones = this.selectedKeyNames().join(", ");

    });


    //var dsSelect = new kendo.data.DataSource({
    //    //CONFIGURACION DEL CRUD
    //    transport: {
    //        read: {
    //            url: function () { return TSM_Web_APi + "SeteoMaquinasAlertas/GetSeleccionByIdSeteo/" + XSeteo; },
    //            dataType: "json",
    //            contentType: "application/json; charset=utf-8"
    //        },
    //        parameterMap: function (data, type) {
    //            if (type !== "read") {
    //                return kendo.stringify(data);
    //            }
    //        }
    //    },
    //    schema: {
    //        model: {
    //            id: "IdEstacion",
    //            fields: {
    //                IdSeteo: {
    //                    type: "number"
    //                },
    //                IdEstacion: {
    //                    type: "number"
    //                },
    //                DescripcionEstacion: {
    //                    type: "string"

    //                },
    //                ColorHex: {
    //                    type: "string"

    //                },
    //                NombreColorEstacion: {
    //                    type: "string"
    //                }

    //            }
    //        }
    //    },


    //});

    ////CONFIGURACION DEL GRID,CAMPOS
    //$("#gridAlerSelectAjus").kendoGrid({
    //    //DEFICNICIÓN DE LOS CAMPOS

    //    columns: [
    //        { selectable: true, width: "50px" },
    //        { field: "IdEstacion", title: "Estación", minResizableWidth: 50 },
    //        { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
    //        { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
    //        {
    //            field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
    //            template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
    //        },
    //        { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120 }

    //    ]
    //});

    //// FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    //SetGrid($("#gridAlerSelectAjus").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 500,false);
    //Set_Grid_DataSource($("#gridAlerSelectAjus").data("kendoGrid"), dsSelect);

    ////var srwf = [];
    ////$("#gridAlerSelectAjus").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
    ////    Grid_SetSelectRow($("#gridAlerSelectAjus"), srwf);
    ////});

    //$("#gridAlerSelectAjus").data("kendoGrid").bind("change", function (e) {
    //    LEstaciones = this.selectedKeyNames().join(", ");
    //});

    //#endregion

    //Fn_VistaCambioEstado($("#vCambioEstadoAlert"));

});
var fn_ConsultarDetalle = function () {
    var SelItem = $("#gridRegistroCambios").data("kendoGrid").dataItem($("#gridRegistroCambios").data("kendoGrid").select());
    xvIdSolicitudCambio = SelItem === null ? 0 : SelItem.IdSolicitudCambio;
    xvItemSolicitud = SelItem === null ? 0 : SelItem.ItemSolicitud;
    $("#gridRegistroCambiosDetalle").data("kendoGrid").dataSource.read();
};

window.onpopstate = function (e) {
    $("#smartwizard").smartWizard("goToPage", e.state);
};


/**
 * Funcion para cargar informacion de cabecera de la etapa.
 * @param {boolean} RecargarScriptVista Indica si se volveran a cargar los script de inicio de la vista parcial.
 */
var CargarInfoEtapa = function (RecargarScriptVista = true) {
    // carar imagen modal
    vpImgDis = $("#OTSlide");
    vpImgDis.children().remove();
    vpImgDis.append(Fn_Carouselcontent());
    $("#idcloseMod").click(function () {
        $("#myModal").modal('toggle');
        $("#myModal").modal('hide');
    });
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/" + idOrdenTrabajo + "/" + idEtapaProceso,
        method: 'GET',
        success: function (datos) {
            if (datos !== null) {
                fn_CompletarInfEtapa(datos, RecargarScriptVista);

            } else {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetEtapaNoActivaDetalle/" + idOrdenTrabajo + "/" + idEtapaProceso,
                    method: 'GET',
                    success: function (datos) {
                        fn_CompletarInfEtapa(datos, RecargarScriptVista);
                    },
                    complete: function () {
                        kendo.ui.progress($(document.body), false);
                    }
                });
            }
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var fn_CompletarInfEtapa = function (datos, RecargarScriptVista) {
    EtpAsignado = datos.Asignado;
    EtpSeguidor = datos.Seguidor;
    xNoPermiteActualizar = datos.NoPermiteActualizar;
    //if (datos.Asignado === false && datos.Seguidor === false) {
    //    $("#btnCambiarAsignado").click(); // genera el evento click para abrir modal.

    //}
    //calcular retenciones si existen
    fn_CalcularRetencion(datos.IdOrdenTrabajo, 2, 1,false);

    var fecha = new Date(datos.FechaOrdenTrabajo);
    $("#IdServicio").val(datos.IdServicio); //Aun no es kendo
    $("#txtIdSolicitud").val(datos.IdSolicitud);
    $("#txtIdOrdenTrabajo").val(datos.IdOrdenTrabajo);
    $("#txtIdSolicitudDisenoPrenda").val(datos.IdSolicitudDisenoPrenda);
    $("#txtIdEtapaProceso").val(datos.IdEtapaProceso);
    $("#IdCliente").val(datos.IdCliente);
    $("#txtEstado").val(datos.Estado);
    $("#txtId").val(datos.Id);
    $("#txtNomServicio").val(datos.NomServicio);
    $("#txtNombre").val(datos.Nombre);
    $("#txtEstiloDiseno").val(datos.EstiloDiseno);
    $("#txtNombreDiseno").val(datos.NombreDiseno);
    $("#lblNomIdEtapaProceso").text(datos.NomIdEtapaProceso);
    $("#txtEstado").val(datos.Estado);
    $("#txtNoDocumentoOT").val(datos.NoDocumento);
    $("#txtFechaOrdenTrabajo").val(fecha.getDate().toString().padStart(2, '0') + '/' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' + fecha.getFullYear());
    $("#txtNomEstado").val(datos.NomEstado);
    $("#txtNombrePrenda").val(datos.NombrePrenda);
    $("#txtItem").val(datos.Item);
    $("#txtIdRequerimiento").val(datos.IdRequerimiento);
    $("#TxtColor").val(datos.Color);
    $("#TxtNombreCPT").val(datos.NombreCPT);
    $("#TxtNombreCCT").val(datos.NombreCCT);
    $("#TxtNombreCFT").val(datos.NombreCFT);
    $("#TxtNomQuimica").val(datos.NombreQui);
    $("#TxtInstruccionesEspeciales").val(datos.InstruccionesEspeciales);
    $("#txtNombreEC").val(datos.NombreEjecutivoCuentas);
    $("#txtNombreTalla").val(datos.NombreTalla);
    $("#txtNoCatalogoDiseno").val(datos.NoCatalogoDiseno);
    $("#txtNombreUbicacion").val(datos.NombreUbicacion);
    $("#txtComentarioCambio").val(datos.ComentarioCambio);
    $("#swchSolTelaSusti").data("kendoSwitch").check(datos.SolicitaTelaSustituta);
    $("#swchSolTelaSusti").data("kendoSwitch").enable(false);
    $("#swchSolDesOEKO").data("kendoSwitch").check(datos.StandarOEKOTEX);
    $("#swchSolDesOEKO").data("kendoSwitch").enable(false);
    $("#swchPDocAduanal").data("kendoSwitch").check(datos.PoseeDocumentacionAduanal);
    $("#swchPDocAduanal").data("kendoSwitch").enable(false);
    $("#swchCobDiseno").data("kendoSwitch").check(datos.CobrarDiseno);
    $("#swchCobDiseno").data("kendoSwitch").enable(false);
    $("#TxtNoRegPrenda").val(datos.NoDocumentoRegPrenda);
    xVistaFormulario = datos.VistaFormulario;
    idTipoOrdenTrabajo = datos.IdTipoOrdenTrabajo;
    xIdQuimica = datos.IdQuimica;
    NombreQui = datos.NombreQui;
    KdoButtonEnable($("#btnCambiarAsignado"), $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || datos.EstadoOT === 'TERMINADO'? false : true);
    KdoButtonEnable($("#btnCambiarEtapa"), $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true);
    KdoButtonEnable($("#btnSolicitarRegistroCambio"), EtpSeguidor === true || datos.EstadoOT === 'TERMINADO'? false : true);
    KdoButtonEnable($("#btnRegistroCambio"),true);
    
    xvNodocReq = datos.NodocReq;
    xEstadoOT = datos.EstadoOT;
    CumpleOEKOTEX = datos.StandarOEKOTEX;
    $("#cmbUsuario").data("kendoComboBox").setDataSource(get_cmbUsuario(datos.IdTipoOrdenTrabajo, datos.IdEtapaProceso));
    //obtner las estapas siguientes
    $("#cmbEtpSigAnt").data("kendoComboBox").setDataSource(get_cmbEtpSigAnt(datos.IdEtapaProceso, datos.IdTipoOrdenTrabajo));
    fn_getImagen(TSM_Web_APi + "ArteAdjuntos/GetByArte/" + datos.IdArte, datos.NodocReq);
    
    maq = fn_GetMaquinas();
    if (RecargarScriptVista === true) {
        $.each(fun_List, function (index, elemento) {
            elemento.call(document, jQuery);
        });

        fun_List = [];
    }

    $.each(fun_ListDatos, function (index, elemento) {
        if (elemento.IdEtapa === idEtapaProceso) {
            elemento.FnEtapa.call(document, jQuery);
  
        }
    });

    if (datos.IdEtapaProceso !== 5) {
        XSeteo = maq[0].IdSeteo;
    }
   
};

var fn_getImagen = function (xUrl,xNodocumentoReq) {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    kendo.ui.progress($("#splitter"), true);
    $.ajax({
        url: xUrl,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + xNodocumentoReq.toString(), respuesta);
            kendo.ui.progress($("#splitter"), false);
        },
        error: function () {
            kendo.ui.progress($("#splitter"), false);
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var get_cmbUsuario = function (tipoOrd, etp) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + tipoOrd.toString() + "/" + etp.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var get_cmbEtpSigAnt = function ( etp, tipo) {
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "EtapasProcesos/GetByIdEtapaProcesoTipoOrden/" + etp.toString() + "/" + tipo.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var get_cmbEtp = function (etp) {
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "EtapasProcesos/GetEtapasProcesosSeleccion/" + etp.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var get_cmbUsuarioEtp = function (tipo, etpAS) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/" + tipo.toString() + "/" + etpAS.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

$("#vAsignarUsuario").kendoDialog({
    height: "auto",
    width: "30%",
    title: "Asignación de Usuarios",
    visible: false,
    maxHeight: 600,
    minWidth: "30%",
    closable: true,
    modal: true,
    actions: [
        { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
    ],
    close: function (e) {
        if (e.userTriggered && EtpAsignado === false && EtpSeguidor === false) {
            window.history.go(-2);
            //window.location.href = "/GestionOT";
            return false;
        }
        else {

            CargarInfoEtapa(false);
        }
    }
});

$("#vCamEtapa").kendoDialog({
    height: "auto",
    width: "auto",
    maxHeight: 600,
       minWidth: "20%",
    title: "Cambio de Etapa",
    visible: false,
    closable: true,
    modal: true,
    actions: [
        { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: function () { return fn_CambioEtp(); } },
        { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
    ],
    close: function (e) {
        if (e.userTriggered)
            CargarInfoEtapa(false);
    }
});

$("#vRegistroCambio").kendoDialog({
    height: "auto",
    width: "60%",
    title: "Historial de Cambios",
    visible: false,
    maxHeight: 800,
    minWidth: "60%",
    closable: true,
    modal: true,
    actions: [
        { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
    ],
    close: function (e) {
        $("#gridRegistroCambios").data("kendoGrid").dataSource.read();
    }
});

$("#vDesplazarCambiar").kendoWindow({
    height: "auto",
    width: "40%",
    minHeight:500,
    title: "Desplazmiento /Intercanbio de estaciones ",
    visible: false,
    closable: true,
    modal: true,
    pinned: true,
    resizable: false,
    maximize: function (e) {
        e.preventDefault();
    },
    activate: function () { $("#NumBrazoIni").data("kendoNumericTextBox").focus(); }
});

$("#vDuplicarMarco").kendoWindow({
    height: "auto",
    width: "30%",
    maxHeight: 600,
    title: "Duplicar Estación",
    visible: false,
    closable: true,
    modal: true,
    pinned: true,
    resizable: false,
    maximize: function (e) {
        e.preventDefault();
    },
    activate: function () { $("#NumOrigenA").data("kendoNumericTextBox").focus();}
});

$("#vAlertaAjustes").kendoWindow({
    height: "auto",
    width: "80%",
    minHeight: 500,
    title: "Ingresar Ajustes Tintas / Marcos",
    visible: false,
    closable: true,
    modal: true,
    pinned: true,
    resizable: false,
    maximize: function (e) {
        e.preventDefault();
    }
});

$("#btnCambiarEtapa").click(function (e) {
    kendo.ui.progress($(document.body), true);
    KdoCmbSetValue($("#cmbUsuarioEtp"), "");
    $("#cmbUsuarioEtp").data("kendoComboBox").dataSource.read();
    KdoComboBoxEnable($("#cmbEtpSigAnt"), true);
    KdoCmbSetValue($("#cmbEtpSigAnt"), "");
    $("#cmbEtpSigAnt").data("kendoComboBox").dataSource.read();
    $("#TxtMotivoEtp").val("");
    $("#vCamEtapa").data("kendoDialog").open();
    $("#FrmCambioEtapa").data("kendoValidator").hideMessages();
    KdoCmbFocus($("#cmbEtpSigAnt"));
    kendo.ui.progress($(document.body), false);
});
$("#btnSolicitarRegistroCambio").click(function (e) {
    fn_SolicitarIngresoCambio("SoliIngresoCambio", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), idTipoOrdenTrabajo.toString());
});

$("#btnAgenda").click(function (e) {
    fn_OrdenesTrabajosAgendas("Agenda_OT", idOrdenTrabajo, idEtapaProceso);
});


$("#btnDesplazarEstacion").click(function () {
    if (ValidarDesplazar.validate()) {
        fn_EjecutarDesplazamiento($("#rbDesplazarRight").is(':checked') === true ? "right" : "left", $("#chkRespetaVacio").is(':checked'), kdoNumericGetValue($("#NumBrazoIni")), kdoNumericGetValue($("#NumCntCantDesplazar")));
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
});

//$("#btnCambiarEstacion").click(function () {
//    if (ValidarCambiarEst.validate()) {
//        fn_Desplazar(kdoNumericGetValue($("#NumBrazoA")).toString() + "|" + kdoNumericGetValue($("#NumBrazoB")).toString() + "," + kdoNumericGetValue($("#NumBrazoB")).toString() + "|" + kdoNumericGetValue($("#NumBrazoA")).toString());
//    } else {
//        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
//    }
//});

$("#btnDuplicarEstacion").click(function () {
    if (ValidarDuplicarEst.validate()) {
        fn_Duplicar(kdoNumericGetValue($("#NumOrigenA")), kdoNumericGetValue($("#NumDestinoB")));
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
});

$("#btnRegAjuste").click(function () {
    if (ValidarSoliAjuste.validate()) {
        if (LEstaciones === "" || LEstaciones === null) {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione una o más estaciones a ajustar", "error");
        } else {
            fn_AlertasBatch();

        }
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
});

var fn_OpenModalDesplazamiento = function () {
    $("#vDesplazarCambiar").data("kendoWindow").center().open();
    tabStrip.select(fn_getItem(0));
    kdoNumericSetValue($("#NumCntCantDesplazar"), 0);
    kdoNumericSetValue($("#NumBrazoIni"), 0);
    //kdoNumericSetValue($("#NumBrazoA"), 0);
    //kdoNumericSetValue($("#NumBrazoB"), 0);
    $('#rbDesplazarRight').prop('checked', true);
    $("#NumBrazoIni").data("kendoNumericTextBox").focus();
    $("#gridInter").data("kendoGrid").dataSource.read();

};

var fn_OpenModalEstacionAjuste = function () {
    $("#vAlertaAjustes").data("kendoWindow").center().open();
    $('#gridAlerAjus').data("kendoGrid").dataSource.read();
    //$("#gridAlerSelectAjus").data("kendoGrid").dataSource.read();
    //KdoCmbSetValue($("#cmbTpAjuste"), "");
};


var fn_OpenModalDuplicar = function () {
    $("#vDuplicarMarco").data("kendoWindow").center().open();
    kdoNumericSetValue($("#NumOrigenA"), 0);
    kdoNumericSetValue($("#NumDestinoB"), 0);
    $("#NumOrigenA").data("kendoNumericTextBox").focus();
};

var fn_EjecutarDesplazamiento = function (xDireccion, xRespetaVacio, xBrazoInicial, xCantDesplazar) {
    kendo.ui.progress($("#vDesplazarCambiar"), true);
     var ListaEstaciones = [];
    $.each(maq, function (item, elemento) {
        ListaEstaciones.push({ IdEstacion: elemento.IdEstacion });
    });

    var Model = [{
        Direccion: xDireccion,
        RespetaVacio: xRespetaVacio,
        Numbrazos: CantidadBrazos,
        BrazoInicial: xBrazoInicial,
        CantDesplazar: xCantDesplazar ,
        Brazos: ListaEstaciones
    }];


    $.ajax({
        url: '/Maquinas/Desplazar',
        type: "POST",
        data: JSON.stringify(Model),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            kendo.ui.progress($("#vDesplazarCambiar"), false);
            if (res.Error === undefined) {
                fn_Desplazar(res.Resumen.toString());
            } else {
              
                $("#kendoNotificaciones").data("kendoNotification").show(res.Detalle.toString(), "error");
            }
        },
        error: function (res) {

        }
    });
};
var fn_Desplazar = function (StrEstaciones) {
    kendo.ui.progress($("#vDesplazarCambiar"), true);
    $.ajax({
        url: TSM_Web_APi + "/SeteoMaquinasEstaciones/OperacionMaquina/" + maq[0].IdSeteo,
        type: "Put",
        data: JSON.stringify(StrEstaciones),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#vDesplazarCambiar"), false);
            $("#vDesplazarCambiar").data("kendoWindow").close();
            fn_RTCargarMaquina();
            fn_RTActivaDropTarget();
            RequestEndMsg(data, "Put");
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($("#vDesplazarCambiar"), false);
        }
    });

};
var fn_Duplicar= function (EstacionO,EstacionD) {
    kendo.ui.progress($("#vDuplicarMarco"), true);
    $.ajax({
        url: TSM_Web_APi + "/SeteoMaquinasEstaciones/CopiarEstacionMarco",
        type: "Post",
        data: JSON.stringify({
            idSeteo: maq[0].IdSeteo,
            idEstacionOrigen: EstacionO,
            idEstacionDestino: EstacionD,
            idUsuario: getUser()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#vDuplicarMarco"), false);
            $("#vDuplicarMarco").data("kendoWindow").close();
            fn_RTCargarMaquina();
            fn_RTActivaDropTarget();
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($("#vDuplicarMarco"), false);
        }
    });

}
var CargarAsignacionUsuarios = function () {
    if ($("#gridUsuarioAsignados").data("kendoGrid") === undefined) {
        $("#gridUsuarioAsignados").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: function (datos) { return TSM_Web_APi + "OrdenesTrabajosDetallesUsuarios/" + idOrdenTrabajo + "/" + idEtapaProceso + "/" + $("#txtItem").val(); },
                        contentType: "application/json; charset=utf-8"
                    },
                    destroy: {
                        url: function (datos) { return TSM_Web_APi + "OrdenesTrabajosDetallesUsuarios/" + idOrdenTrabajo + "/" + idEtapaProceso + "/" + $("#txtItem").val() + "/" + datos.IdUsuario; },
                        type: "DELETE"
                    },
                    parameterMap: function (data, type) {
                        if (type !== "read") {
                            return kendo.stringify(data);
                        }
                    }
                },
                requestEnd: Grid_requestEnd,
                error: Grid_error,
                schema: {
                    model: {
                        id: "IdUsuario",
                        fields: {
                            IdOrdenTrabajo: { type: "number" },
                            IdEtapaProceso: {
                                type: "number", defaultValue: function () {
                                    return $("#txtIdEtapaProceso").val();
                                }
                            },
                            IdUsuario: { type: "string" },
                            Nombre: { type: "string" },
                            Asignado: { type: "bool" },
                            Seguidor: { type: "bool" }
                        }
                    }
                }
            },
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdOrdenTrabajo", title: "Orden de Trabajo", hidden: true },
                { field: "IdEtapaProceso", title: "IdEtapaProceso", hidden: true },
                { field: "IdUsuario", title: "Usuario", hidden: true },
                { field: "Nombre", title: "Nombre" },
                { field: "Asignado", title: "Asignado", template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Asignado"); } },
                { field: "Seguidor", title: "Seguidor", template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Seguidor"); } }
            ]
        });

        SetGrid($("#gridUsuarioAsignados").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
        SetGrid_CRUD_ToolbarTop($("#gridUsuarioAsignados").data("kendoGrid"), false);
        SetGrid_CRUD_Command($("#gridUsuarioAsignados").data("kendoGrid"), false, Permisos.SNBorrar);
        Grid_HabilitaToolbar($("#gridUsuarioAsignados"), false, false, Permisos.SNBorrar);
    }
    else {
        $("#gridUsuarioAsignados").data("kendoGrid").dataSource.read();
        $("#cmbUsuario").data("kendoComboBox").dataSource.read();
    }
};

$("#btnCambiarAsignado").click(function (e) {
    e.preventDefault();
    CargarAsignacionUsuarios();
    $("#cmbUsuario").data("kendoComboBox").value("");
    $("#vAsignarUsuario").data("kendoDialog").open();
});


$("#btnAutorizarRetenciones").bind("click", function () {
    //validar si existen mas retenciones
    fn_CalcularRetencion(idOrdenTrabajo, 2, 1, false, function () { fn_AutorizarRetenciones("AutRet", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val()); });
    //AutRet: es el nombre del div en la vista elementoTrabajo
   
});

$("#btnRegistroCambio").click(function (e) {

    $("#gridRegistroCambios").data("kendoGrid").dataSource.read().then(function () {
        $("#vRegistroCambio").data("kendoDialog").open();
        $("#gridRegistroCambios").data("kendoGrid").refresh();
        $("#gridRegistroCambiosDetalle").data("kendoGrid").dataSource.read();
        $("#gridRegistroCambiosDetalle").data("kendoGrid").refresh();
    });
});

var ValidarUsuario = $("#FrmAsignarUsuario").kendoValidator(
    {
        rules: {

            MsgcmbEstados: function (input) {
                if (input.is("[name='cmbUsuario']")) {
                    return $("#cmbUsuario").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            MsgcmbEstados: "Requerido"
        }
    }).data("kendoValidator");

var ValidarCamEtp = $("#FrmCambioEtapa").kendoValidator(
    {
        rules: {

            Msg1: function (input) {
                if (input.is("[name='cmbEtpSigAnt']")) {
                    return $("#cmbEtpSigAnt").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            Msg2: function (input) {
                if (input.is("[name='cmbUsuarioEtp']")) {
                    return $("#cmbUsuarioEtp").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            Msg1: "Requerido",
            Msg2: "Requerido"
        }
    }).data("kendoValidator");

var ValidarDesplazar = $("#FrmDesplazar").kendoValidator(
    {
        rules: {

            Msg1: function (input) {
                if (input.is("[name='NumBrazoIni']")) {
                    return kdoNumericGetValue($("#NumBrazoIni")) > 0 && kdoNumericGetValue($("#NumBrazoIni")) <= CantidadBrazos;
                }
                return true;
            },
            Msg2: function (input) {
                if (input.is("[name='NumCntCantDesplazar']")) {
                    return kdoNumericGetValue($("#NumCntCantDesplazar")) > 0 && kdoNumericGetValue($("#NumCntCantDesplazar")) <= CantidadBrazos;
                }
                return true;
            }
        },
        messages: {
            Msg1: "Requerido",
            Msg2: "Requerido"
        }
    }).data("kendoValidator");


var ValidarDuplicarEst = $("#FrmDuplicarEst").kendoValidator(
    {
        rules: {

            Msg1: function (input) {
                if (input.is("[name='NumOrigenA']")) {
                    return kdoNumericGetValue($("#NumOrigenA")) > 0 && kdoNumericGetValue($("#NumOrigenA")) <= CantidadBrazos;
                }
                return true;
            },
            Msg2: function (input) {
                if (input.is("[name='NumDestinoB']")) {
                    return kdoNumericGetValue($("#NumDestinoB")) > 0 && kdoNumericGetValue($("#NumDestinoB")) <= CantidadBrazos;
                }
                return true;
            }
        },
        messages: {
            Msg1: "Requerido",
            Msg2: "Requerido"
        }
    }).data("kendoValidator");

var ValidarSoliAjuste = $("#FrmSoliAjuste").kendoValidator(
    {
        rules: {
            Msg1: function (input) {
                if (input.is("[name='cmbTpAjuste']")) {
                    return $("#cmbTpAjuste").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            Msg1: "Requerido"
        }
    }).data("kendoValidator");


$("#btnAsignarUsuario").click(function (e) {
    e.preventDefault();
    if (ValidarUsuario.validate()) {
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "/OrdenesTrabajosDetallesUsuarios/",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                IdOrdenTrabajo: $("#txtIdOrdenTrabajo").val(),
                IdEtapaProceso: $("#txtIdEtapaProceso").val(),
                Item: $("#txtItem").val(),
                IdUsuario: $("#cmbUsuario").data("kendoComboBox").value(),
                Asignado: $("#rAsignado")[0].checked,
                Seguidor: $("#rSeguidor")[0].checked,
                FechaHasta: null
            }),
            success: function (datos) {
                RequestEndMsg(datos, "Post");
                $("#gridUsuarioAsignados").data("kendoGrid").dataSource.read();
                $("#vAsignarUsuario").data("kendoDialog").close();
                CargarInfoEtapa(false);
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(".k-dialog"), false);
            }
        });
    }
});
/** metodo publico en la vista elementos de trabajo para obteniene la confinguración de la maquina, hace un join a las siguientes tablas: SeteoMaquinas ,
 * SeteoMaquinasEstaciones,SeteoMaquinasEstacionesMarcos,SeteoMarcosFormulaciones,SeteoMaquinasEstacionesAccesorios,SeteoMaquinaColores,BasesMuestras,SeteoMaquinaTecnicas,Tecnicas y AccesoriosMaquinas 
 * @returns {data}
 **/
var fn_GetMaquinas = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + $("#txtIdOrdenTrabajo").val() + "/" + $("#txtIdEtapaProceso").val() + "/" + $("#txtItem").val(),
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

var fn_gridColorEstacion = function (gd, xvIdSeteo) {

    var dsColor = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaColores/GetSeteoMaquinaColoresByIdSeteo/" + maq[0].IdSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaColores/" + datos.IdSeteo + "/"+ datos.IdRequerimientoColor; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaColores/" + datos.IdSeteo + "/" + datos.IdRequerimientoColor; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SeteoMaquinaColores",
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdRequerimientoColor",
                fields: {
                    IdSeteo: {
                        type: "number", defaultValue: function () {
                            return maq[0].IdSeteo;
                        }

                    },
                    IdRequerimientoColor: {
                        type: "number"
                    },
                    Color: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='Color']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
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
                    Nombre: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    },
                    Item: {
                        type: "number", defaultValue: function () {
                            return null;
                        }
                    },
                    IdUsuarioMod: {
                        type: "string"
                    }
                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoColor");
            KdoHideCampoPopup(e.container, "IdSeteo");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Item");

            $('[name="IdTipoPantonera"]').on("change", function (e) {
                if ($(this).data("kendoMultiColumnComboBox").dataItem() !== undefined) {
                    var data = $(this).data("kendoMultiColumnComboBox").dataItem();

                    $('[name="ColorHex"]').data("kendoColorPicker").value(data.ColorHex);
                    $('[name="Color"]').val(data.Codigo);
                    $('[name="Item"]').val(data.Item);
                    $('[name="ColorHex"]').data("kendoColorPicker").trigger("change");
                    $('[name="Color"]').trigger("change");
                    $('[name="Item"]').trigger("change");
                }
            });

            if (!e.model.isNew() && e.model.Item !== null) {
                $('[name="IdTipoPantonera"]').data("kendoMultiColumnComboBox").text(e.model.Color);
                $('[name="IdTipoPantonera"]').data("kendoMultiColumnComboBox").trigger("change");
                $('[name="IdTipoPantonera"]').data("kendoMultiColumnComboBox").search(e.model.Color);
                $('[name="IdTipoPantonera"]').data("kendoMultiColumnComboBox").refresh();
            }

            Grid_Focus(e, "IdTipoPantonera");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoColor", title: "Código. Desarrollo Color", hidden: true },
            { field: "IdSeteo", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            
            {
                field: "IdTipoPantonera", title: "Código Pantone",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlPantones();
                },
                hidden: true
            },
            { field: "Item", title: "Item", hidden: true },
            { field: "Color", title: "Color Diseño" },
            {
                field: "ColorHex", title: "Muestra",
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>',
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).kendoColorPicker();
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gridAlto);
    SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsColor);

    var srow1 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow1);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow1);
    });


    let grid1 = gd.data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Color: ' + dataItem.Color + '</tr></tbody></table></div>');
            return item;

        },
        group: "gridGroup"
    });

};

var fn_gridTecnicaEstacion = function (gd, xvIdSeteo) {

    var dsTecnica = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + maq[0].IdSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaTecnicas/" + datos.IdSeteo + "/" + datos.IdRequerimientoTecnica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaTecnicas/" + datos.IdSeteo + "/" + datos.IdRequerimientoTecnica; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "SeteoMaquinaTecnicas",
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdRequerimientoTecnica",
                fields: {
                    IdSeteo: {
                        type: "number", defaultValue: function () {
                            return maq[0].IdSeteo;
                        }

                    },
                    IdRequerimientoTecnica: {
                        type: "number"

                    },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
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

    let Urltec = TSM_Web_APi + "Tecnicas";
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
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
            { field: "IdTecnica", title: "Técnicas", editor: Grid_Combox, values: ["IdTecnica", "Nombre", Urltec, "GetbyServicio/" + $("#IdServicio").val(), "Seleccione un Técnica....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre técnica" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gridAlto);
    SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsTecnica);

    var srow2 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow2);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow2);
    });

    let grid1 = gd.data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Técnica: ' + dataItem.Nombre + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

};

var fn_gridBasesEstacion = function (gd) {

    var dsBase = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "BasesMuestras",
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
                id: "IdBase",
                fields: {
                    IdBase: { type: "number" },
                    Nombre: {
                        type: "string"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBase", title: "Código base", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Bases" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gridAlto);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsBase);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });


    let grid1 = gd.data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Base: ' + dataItem.Nombre + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

};

var fn_gridAccesoriosEstacion = function (gd) {

    var dsAcce = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "AccesoriosMaquinas",
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
                id: "IdAccesorio",
                fields: {
                    IdAccesorio: { type: "number" },
                    Nombre: {
                        type: "string"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdAccesorio", title: "Código Accesorios", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Accesorios" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gridAlto);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsAcce);

    var srow4 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow4);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow4);
    });


    let grid1 = gd.data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Accesorio: ' + dataItem.Nombre + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

};

var fn_gridEstacionIntercambio= function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetTodasByIdSeteo/" + XSeteo; },
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
                id: "IdEstacion",
                fields: {
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    }
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
       
        columns: [
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50 },
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120 }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 500);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });

    gd.data("kendoGrid").table.kendoDraggable({
        filter: "tbody > tr",
        group: "gridGroup",
        hint: function (e) {
            return $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
        }
    });

    gd.data("kendoGrid").table.kendoDropTarget({
        group: "gridGroup",
        drop: function (e) {
            e.draggable.hint.hide();
            var target = dsMp.getByUid($(e.draggable.currentTarget).data("uid")),
                dest = $(document.elementFromPoint(e.clientX, e.clientY));

            if (dest.is("th")) {
                return;
            }
            dest = dsMp.getByUid(dest.parent().data("uid"));
            //not on same item
            if (target.get("IdEstacion") !== dest.get("IdEstacion")) {
                //reorder the items
                var tmp = target.get("IdEstacion");
                target.set("IdEstacion", dest.get("IdEstacion"));
                dest.set("IdEstacion", tmp);
                dsMp.sort({ field: "IdEstacion", dir: "asc" });
                $(".k-dirty-cell", gd).removeClass("k-dirty-cell");
                $(".k-dirty", gd).remove();
                kendo.ui.progress($("#vDesplazarCambiar"), true);
                $.ajax({
                    url: TSM_Web_APi + "/SeteoMaquinasEstaciones/OperacionMaquina/" + maq[0].IdSeteo,
                    type: "Put",
                    data: JSON.stringify(target.get("IdEstacion").toString() + "|" + dest.get("IdEstacion").toString() + "," + dest.get("IdEstacion").toString() + "|" + target.get("IdEstacion").toString()),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        kendo.ui.progress($("#vDesplazarCambiar"), false);
                        fn_RTCargarMaquina();
                        fn_RTActivaDropTarget();
                        RequestEndMsg(data, "Put");
                    },
                    error: function (data) {
                        ErrorMsg(data);
                        kendo.ui.progress($("#vDesplazarCambiar"), false);
                    }
                });
            }

        }
    });


};
/**
 * Eliminacion de configuracion por brazo o el seteo de toda la maquina cuando el idestacion sea igual undefined
 * @param {any} xIdSeteo codigo de seteo de la maquina
 * @param {any} xIdestacion numero de estacion del brazo o estacion 
 */
var fn_EliminarEstacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let Urldel = xIdestacion !== undefined ? TSM_Web_APi + "SeteoMaquinasEstaciones/" + xIdSeteo + "/" + xIdestacion : TSM_Web_APi + "SeteoMaquinasEstaciones/Deltodas/" + xIdSeteo;
    $.ajax({
        url: Urldel,
        type: "Delete",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Delete");
            var a = stage.find("#TxtInfo" + xIdestacion);
            if (xIdestacion !== undefined) {
                a.text("");
                maq = fn_GetMaquinas();
                var b = stage.find("#brazo" + xIdestacion);
                b.IdSeteo = 0;
                b.IdTipoFormulacion = "";
                layer.draw();

            } else {
                fn_RTCargarMaquina();
                fn_RTActivaDropTarget();
            }
        },
        error: function (data) {
            ErrorMsg(data);
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};
/**
 * obtiene solo los datos de la entidad SeteoMaquinasEstaciones
 * @param {any} xIdSeteo codigo seteo de la maquina
 * @param {any} xIdestacion numero de estacion o brazo
 * @returns {data} datos del entidad maquina estaciones
 */
var fn_Estaciones = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstaciones/" + xIdSeteo + "/" + xIdestacion,
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
/**
 * Metodo publico en la vista elementos de trabajo obtenie la configuracion para la vista modal de accesorios, hace un join entre Seteo Maquinas Estaciones y accesorios maquinas
 * @param {any} xIdSeteo codigo seteo maquina
 * @param {any} xIdestacion numero estacion o brazo
 * @returns {data} datos
 */
var fn_GetEstacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstaciones/GetSeteoMaquinasEstacionVista/" + xIdSeteo + "/" + xIdestacion,
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
/**
 * Obtiene solo los datos de la entidad SeteoMaquinasEstacionesMarcos., utilizada en vista modal Estacion colores, Estacion muestra y Estacion Diseño
 * @param {any} xIdSeteo codigo seteo
 * @param {any} xIdestacion numero de estacion o brazo
 * @returns {data} datos
 */
var fn_EstacionesMarcos = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + xIdSeteo + "/" + xIdestacion,
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
/**
 * Metodo publico en elementos de trabajo js obtenie la formulacion para ser mostrada en cada estacion de la maquina, en las vista modales: Estacion colores, Estacion muestra, Estacion Diseño y estacion formula
 * @param {any} xIdSeteo codigo id seteo    
 * @param {any} xIdestacion codigo estacion o numero de estación
 * @returns {datos} datos
 */
var fn_GetMarcoFormulacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
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

/**
 * Para obtener solo datos de la entidad SeteoMaquinasEstacionesAccesorios para llenar los campos en la vista de Accesorios Dis etapa de diseño
 * @param {any} xIdSeteo codigo del seteo
 * @param {any} xIdestacion codigo o numero de estación
 * @returns {data} datos
 */
var fn_GetSeteoMaqEstAcce = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesAccesorios/" + xIdSeteo + "/" + xIdestacion,
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

/**
 * get se utiliza en cada vista para cada etapa del desarrollo
 * @returns {data} datos
 * */
var fn_GetTipoEstaciones = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "TipoEstaciones",
        type: 'GET',
        async: false,
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    return result;
};

var fn_EstacionesTintasFormulaDet = function (xIdSeteo, xIdestacion,xestado) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion + "/" + xestado,
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
/**
 * TiposTintasSistemasPigmentos llenar combobox sistema de pigmentos en las vistas estacion colores, estacion diseño y estacion muestra
 * @param {any} vid id o codigo del tipo de tintas
 * @returns {data} datos
 */
var Fn_GetSistemaPigmentos = function (vid) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "TiposTintasSistemasPigmentos/GetByTipoTinta/" + (vid !== null ? vid.toString() : 0),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};
/**
 * TiposTintasBasesPigmentos llenar combobox Base de pigmentos (base para mezcla) en las vistas estacion colores, estacion diseño y estacion muestra
 * @param {any} vide codigo o id tipo tintas
 * @returns {data} datos
 */
var Fn_GetSistemaBases = function (vide) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "TiposTintasBasesPigmentos/GetByTipoTinta/" + (vide !== null ? vide.toString() : 0),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};
/**
 * Para obtener los tipos de tintas por quimica, para llenar el combobox Tipos de tintas en las vistas estacion colores, estacion diseño y estacion muestra.
 * @param {any} idQuimica codigo o id quimica.
 * @returns {data} datos
 */
var Fn_GetTiposTintas = function (idQuimica) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,                    
                    url: TSM_Web_APi + "TiposTintas/GetbyIdQuimica/" + (idQuimica !== null ? idQuimica.toString() : 0),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

$("#btnIrGOT").click(function () {
    window.location.href = "/GestionOT";
});

let  fn_IrKanbanEtapa=function () {
    window.location.href = "/EtapasOrdenesTrabajos";
};
let fn_IrCatalogo=function () {
    window.location.href = "/CatalogoDisenos";
};

let fn_IrKbFinalizados = function () {
    window.location.href = "/OrdenesTrabajosTerminadas";
};


var fn_MostraTablaFormula = function (ds, div) {

    let xformula = $("#" + div + "");
    xformula.children().remove();
    xformula.append('<table class="table mt-3" >' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">Articulo</th>' +
        '<th scope="col">Nombre</th>' +
        '<th scope="col">Masa Final</th>' +
        '<th scope="col">% Final</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot id="' + div + '_Foot">' +
        '</tfoot>' +
        '<tbody id="' + div + '_Det">' +
        '</tbody>' +
        '</table>'
    );

    let xformulaDet = $("#" + div + "_Det");
    xformulaDet.children().remove();
    $.each(ds, function (index, elemento) {
        if (elemento.IdArticulo !== null) {
            xformulaDet.append('<tr>' +
                '<td>' + elemento.IdArticulo + '</td>' +
                '<td>' + elemento.Nombre + '</td>' +
                '<td>' + kendo.format("{0:n2}", elemento.MasaFinal) + '</td>' +
                '<td>' + kendo.format("{0:n2}", elemento.PorcFinal) + '</td>' +
                '</tr>');
        }
    });

    xformulaDet.append('<tr>' +
        '< th rowspan = "1" colspan = "1" ></th > ' +
        '<th rowspan="1" colspan="1"></th>' +
        '<th rowspan="1" colspan="1"></th>' +
        '<th rowspan="1" colspan="1">Total:</th>' +
        '<th rowspan="1" colspan="1">' + (ds !== null ? kendo.format("{0:n2}", ds[0].TotalPorc === null ? 0 : ds[0].TotalPorc): 0.00) +' %</th>' +
        '</tr>');


};
/** obtener los tipos de tintas
 * @returns {data} datos
 **/
var fn_TipoTintas = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "TiposTintas",
        type: 'GET',
        async: false,
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    return result;
};
/**
 * Recibe como parametro [FromBody] string con el objetivo de filtrar las unidades de medida ejemplo parametro separados por "," (1,2,4)
 * @param {string} filtro para filtrar enviar un string de valores separados por ","
 * @returns {data} datos
 */
var fn_UnidadMedida = function (filtro) {
    let urlUM_Est = TSM_Web_APi + "UnidadesMedidas";
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "POST",
                    async: false,
                    url: urlUM_Est + "/GetUnidadesMedidasByFiltro",
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
/** 
 *  Devuelve las etapas para el modulo del modulo 2 servicio al cliente
 */
var fn_ConfigEtapas = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "EtapasProcesos/GetByModulo/2",
        type: 'GET',
        success: function (datos) {
            ConfigEtapas = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var fn_RTActivaDropTarget = function () {
    //hablitar el Drop Target de las maquinas
    let vContenedor = $("#container");
    $(vContenedor).kendoDropTarget({
        drop: function (e) { dropElemento(e); },
        group: "gridGroup"
    });
};

$("#FormulaHist").on("ObtenerFormula", function (event, CodigoColor) {
    fn_GuardaCodigoColor(CodigoColor);
});

$("#FormulaHist").on("SetValorBusqueda", function (event) {
    switch (idEtapaProceso) {
        case "6":
            TxtFilNombreColor = $("#TxtOpcSelec").val(); //este campo contiene el valor del nombre color para la etapa de revisión técnica, cuando el marco sea de tipo de formulacion color,base y tecnica
            FilCumpleOEKOTEX = CumpleOEKOTEX;
            break;
        case "8":
            TxtFilNombreColor = $("#TxtOpcSelec_Dis").val();//este campo contiene el valor del nombre color para la etapa de Analisis y Diseño, cuando el marco sea de tipo de formulacion color,base y tecnica
            FilCumpleOEKOTEX = CumpleOEKOTEX;
            break;
        case "9":
            TxtFilNombreColor= $("#TxtOpcSelecFormulas").val();//este campo contiene el valor del nombre color para la etapa de Tintas, cuando el marco sea de tipo de formulacion color,base y tecnica
            FilCumpleOEKOTEX= CumpleOEKOTEX;
            break;
    }
});

var fn_GuardaCodigoColor = function (xCodColor) {
    switch (idEtapaProceso) {
        case "6":
            fn_GuardarEstacionFormula(idBra, xCodColor);
            break;
        case "8":
            fn_GuardarEstacionFormulaDis(idBra, xCodColor);
            break;
        case "9":
            fn_GuardarFormulaEst(xidEstacion, xCodColor);
            break;
    }
  
};
//metodo que se activa cuando se cierra ventana modal
var onCloseCambioEstado = function (e) {
    fn_GetDatosSeteoMaquinasEstacionesMarcos(maq[0].IdSeteo, xidEstacion);
    $("#gridFormulas").data("kendoGrid").dataSource.read();
};
/** 
 *  metodo que obtiene todos los AccesoriosMaquinasArticulos
 */
var fn_getAccesoriosMaquinasArticulos = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "AccesoriosMaquinasArticulos",
        type: 'GET',
        success: function (datos) {
            AccesMaquinaArt = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

var Fn_GetRequerimientoFoil = function (vIA) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasFoil/GetRequerimientoFoil/" + $("#txtIdRequerimiento").val().toString() + "/" + vIA.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};


var fn_TecnicasArticuloSugerido = function(input, idSeteo, idRequerimientoTecnica){
    $.ajax({
        url: TSM_Web_APi + "GetSeteoMaquinaTecnicasArticulosConcatenados/" + idSeteo + "/" + (idRequerimientoTecnica === null || idRequerimientoTecnica === undefined ? 0 : idRequerimientoTecnica),
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                input.val(datos.Articulos);
            } else {
                input.val("");
            }
        }
    });
};
// otiene el item del tab
var fn_getItem = function (indice) {
    return tabStrip.tabGroup.children("li").eq(indice);
};

//crear alertas en bacth

var fn_AlertasBatch = function () {
    kendo.ui.progress($("#vAlertaAjustes"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasAlertas/CrearSolicitudAjusteMarco",//
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdOrdenTrabajo: $("#txtIdOrdenTrabajo").val(),
            //IdEtapaNuevo: 9,
            //IdUsuarioAsignado: KdoCmbGetValue($("#cmbUsuarioEtpImp")),
            IdSolicitudCambio: 15,
            NombreTipoCambio:"AJUSTE DE MARCO / TINTAS",
            ItemSolicitud: 0,
            IdEtapa: $("#txtIdEtapaProceso").val(),
            Estado: "GENERADA",
            Motivo:"AJUSTE SOLICITADO PARA TINTAS Y REVELADO",
            IdUsuario: getUser(),
            IdSeteo: XSeteo,
            IdEstaciones: LEstaciones,
            IdAlerta: KdoCmbGetValue($("#cmbTpAjuste"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Post");
            $("#gridAlerAjus").data("kendoGrid").dataSource.read();
            $("#vAlertaAjustes").data("kendoWindow").close();
            window.location.href = "/EtapasOrdenesTrabajos";
            kendo.ui.progress($("#vAlertaAjustes"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#vAlertaAjustes"), false);
            ErrorMsg(data);
        }
    });

};

