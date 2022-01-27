
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
var gridAlto = 470;
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
let xCmbBasePigmentos_VerifMues
/*var SetFor;*/
/*var EstaMarco;*/
var EstacionBra;
var Te;
var idBra;
/*var EstaTintasFormula;*/
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
var InicioModal_Ajuste = 0;
var CantidadBrazos = 0;
var XSeteo = 0;
var xNoPermiteActualizar = false;
var LEstaciones = "";
var maquinaVueEl = "";
var tabStrip;
var tabStripColor;
var fn_close_Modal_ColorTec; //funcion para ejecutar despues del cierre
var dEpartamentoUsuario; //almacena los departamentos a los que pertene el usuario
var dtoDiseno=false;
var dtoTintas = false;
var dtoReviTec = false;
var dtoRevelado = false;
var DienoAfectaSecuencia = false;
var estadoPermiteEdicion = false;
var alertDiseno = false;
var alertTintas = false;
var alertRevelado = false;
var PermiteAddEstacion = true;
let tecnicasFlags = "";
let xIdQuimicaCliente = 0;
let Arrastre_Nuevo = 0;
let setFor = null;
let estaMarco = null;
let EstaTintasFormula = null;
let xCmbTecnica_VerifMues;
let xCmbBaseMezcla_VerifMues;

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
                if (datos[1].Output === "¡Cambio de etapa exitoso!")
                    RequestEndMsg(datos, "Post");
                else
                    fn_AlertActualizaVista({ Mensaje: datos[1].Output });
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

$(document).ready(function () {

    //tab modal para vista Desplazamiento e Intercambio
    tabStrip = $("#TabDesplazar").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip");

    tabStripColor = $("#tabColoresTecnicas").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip");

    $("#UbicacionHorInf").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#UbicacionVerInf").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#UbicacionHorInf").attr("disabled", true);
    $("#UbicacionVerInf").attr("disabled", true);
    $('#rbDesplazarRight').prop('checked', true);
    $("#TxtDirectorioArchivosInfo").attr("readonly",true);

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
    Kendo_CmbFiltrarGrid($("#cmbUsuario"), TSM_Web_APi + "ConfiguracionEtapasOrdenesDepartamentos/0/0", "Nombre", "IdUsuario", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbEtpSigAnt"), TSM_Web_APi + "EtapasProcesos/GetEtapasProcesosFlujo/0/0", "Nombre", "IdEtapaProcesoAS", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#cmbUsuarioEtp"), TSM_Web_APi + "ConfiguracionEtapasOrdenesDepartamentos/0/0", "Nombre", "IdUsuario", "Seleccione...");
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
    //definicion de botones de flujo o accion
    KdoButton($("#btnCambiarAsignado"), "user");
    KdoButton($("#btnAsignarUsuario"), "save");
    KdoButton($("#btnCambiarEtapa"), "gear");
    KdoButton($("#btnCambiorEstadoOT"), "gear");
    KdoButton($("#btnAutorizarRetenciones"), "warning");
    KdoButton($("#btnIrGOT"), "hyperlink-open-sm");
    KdoButton($("#btnSolicitarRegistroCambio"), "track-changes");
    KdoButton($("#btnRegistroCambio"), "track-changes-accept");
    KdoButton($("#btnAgenda"), "track-changes", "Comentarios por departamento");
    KdoButton($("#btnHistorial"), "track-changes-accept-all", "Versiones de Seteos");
    KdoButton($("#btnImpReportStrikeOff"), "file-data", "Imprimir reporte Strike-Off");

    KdoButtonEnable($("#btnSolicitarRegistroCambio"), false);
    KdoButtonEnable($("#btnRegistroCambio"), false);

    KdoButton($("#btnDesplazarEstacion"), "check", "Desplazar Estacion");
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


    $("#TxtCntEstacionesPermitidas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

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
                    Fecha: { type: "date" },
                    IdMotivoSolicitudCambio: { type: "number" },
                    NombreMotivo: { type: "string" }

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
            { field: "NombreSolicitudCambio", title: "Tipo de cambio", minResizableWidth: 300 },
            { field: "NombreMotivo", title: "Motivo del cambio", minResizableWidth: 200 },
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
            if (e.type === "destroy") {
                $("#gridAlerAjus").data("kendoGrid").dataSource.read();
            }
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
                    Descripcion: {type: "string"},
                    Estado: { type: "string", defaultValue: function () { return 'ACTIVA'; } },
                    Nombre1: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    DescripcionEstacion: {type: "string"},
                    ColorHex: {type: "string"},
                    NombreColorEstacion: {type: "string"},
                    IdRow: { type: "number" },
                    AplicaTintas: { type: "bool" },
                    AplicaMarco: { type: "bool" }

                }
            }
        }
     
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
    
       
            } else {
                KdoHideCampoPopup(e.container, "Estado");
            }
            Grid_Focus(e, "IdEstacion");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            //{ selectable: true, width: "50px" },
            { field: "IdEstacion", title: "Estación" },
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
            { field: "AplicaTintas", title: "Aplica Tintas?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_TemplateCheckBoxColumn(dataItem, "AplicaTintas"); } },
            { field: "AplicaMarco", title: "Aplica Marco?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_TemplateCheckBoxColumn(dataItem, "AplicaMarco"); } },
            { field: "Descripcion", title: "Comentario ajuste", editor: Grid_ColTextArea, values: ["6"] },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", TSM_Web_APi + "Estados", "SeteoMaquinasAlertas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true},
            { field: "Nombre1", title: "Estado", hidden: true },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
      
     
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridAlerAjus").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 500,false);
    SetGrid_CRUD_Command($("#gridAlerAjus").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridAlerAjus").data("kendoGrid"), dsetAjusteEst);



    $("#gridAlerAjus").data("kendoGrid").bind("change", function (e) {
        //Grid_SelectRow($("#gridAlerAjus"), srow5);
        LEstaciones = this.selectedKeyNames().join(", ");

    });
    $("#gridAlerAjus").data("kendoGrid").bind("dataBound", function (e) {
        //Grid_SelectRow($("#gridAlerAjus"), srow5);
        //alert("prueba");
        //fn_GetSeteoMaquinasAlertasValidacion(XSeteo);

    });
    //actualizar columnas aplica tintas y marcos

    $("#chkTintasTodasEsta").click(function () {
        if (this.checked) {
            fn_ActualizarAlerta(1, "T");
        } else {
            fn_ActualizarAlerta(0, "T");
        }
    });

    $("#chkMarcoTodasEsta").click(function () {
        if (this.checked) {
            fn_ActualizarAlerta(1, "M");
        } else {
            fn_ActualizarAlerta(0, "M");
        }
    });

    TipoTintas = fn_TipoTintas();    
    // carga vista para el cambio de estado
    // 1. configurar vista.
    Fn_VistaCambioEstado($("#vCambioEstadoOT"), function () {
        CargarInfoEtapa(false);
    });
    // 2. boton cambio de estado.
    $("#btnCambiorEstadoOT").click(function () {

        var lstId = {
            IdOrdenTrabajo: idOrdenTrabajo
        };
        Fn_VistaCambioEstadoMostrar("OrdenesTrabajos", xEstadoOT, TSM_Web_APi + "OrdenesTrabajos/OrdenesTrabajos_CambiarEstado", "Sp_CambioEstado", lstId, undefined);
    });
    

    fn_gridColorEstacion($("#gridAddColor"));
    fn_gridTecnicaEstacion($("#gridAddTecnica"));
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

    //calcular retenciones si existen
    fn_CalcularRetencion(datos.IdOrdenTrabajo, 2, 1, false);
    //obtenere los departametos a los que pertenece un usuario
    fn_GetDeptoRoles();

    var fecha = new Date(datos.FechaOrdenTrabajo);
    $("#IdServicio").val(datos.IdServicio); //Aun no es kendo
    $("#txtIdSolicitud").val(datos.IdSolicitud);
    $("#txtIdOrdenTrabajo").val(datos.IdOrdenTrabajo);
    $("#txtIdSolicitudDisenoPrenda").val(datos.IdSolicitudDisenoPrenda);
    $("#txtIdEtapaProceso").val(datos.IdEtapaProceso);
    $("#IdCliente").val(datos.IdCliente);
    $("#txtEstado").val(datos.Estado);

    if (datos.Estado === "ACTIVO" || datos.Estado === "ENSETEO" || datos.Estado === "ENAJUSTE" || datos.Estado === "ENAPROBACION")
        estadoPermiteEdicion = true;

    $("#txtId").val(datos.Id);
    $("#txtNomServicio").val(datos.NomServicio);
    $("#txtNombre").val(datos.Nombre);
    $("#txtEstiloDiseno").val(datos.EstiloDiseno);
    $("#txtNombreDiseno").val(datos.NombreDiseno);
    $("#lblNomIdEtapaProceso").text(datos.NomIdEtapaProceso);
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
    $("#txtMotivoDesarrollo").val(datos.NombreMotivoDesarrollo);
    $("#swchSolTelaSusti").data("kendoSwitch").check(datos.SolicitaTelaSustituta);
    $("#swchSolTelaSusti").data("kendoSwitch").enable(false);
    $("#swchSolDesOEKO").data("kendoSwitch").check(datos.StandarOEKOTEX);
    $("#swchSolDesOEKO").data("kendoSwitch").enable(false);
    $("#swchPDocAduanal").data("kendoSwitch").check(datos.PoseeDocumentacionAduanal);
    $("#swchPDocAduanal").data("kendoSwitch").enable(false);
    $("#swchCobDiseno").data("kendoSwitch").check(datos.CobrarDiseno);
    $("#swchCobDiseno").data("kendoSwitch").enable(false);
    $("#TxtNoRegPrenda").val(datos.NoDocumentoRegPrenda);
    $("#UbicacionHorInf").val(datos.UbicacionHorizontal);
    $("#UbicacionVerInf").val(datos.UbicacionVertical);
    $("#TxtDirectorioArchivosInfo").val(datos.DirectorioArchivos);
    $("#TxtOtOrigen").val(datos.NoOrdenTrabajoOrigen);
    xVistaFormulario = datos.VistaFormulario;
    idTipoOrdenTrabajo = datos.IdTipoOrdenTrabajo;
    xIdQuimica = datos.IdQuimica;
    NombreQui = datos.NombreQui;

    if ($("#txtEstadoEtapa").length > 0)
        $("#txtEstadoEtapa").val(datos.NomEstadoDetalle);

    //habilitar botones de acciones o de flujo de la OT
    KdoButtonEnable($("#btnCambiarAsignado"), !estadoPermiteEdicion || EtpSeguidor === true || datos.EstadoOT === 'TERMINADO'? false : true);
    KdoButtonEnable($("#btnCambiarEtapa"), !estadoPermiteEdicion || EtpSeguidor === true || EtpAsignado === false ? false : true);
    KdoButtonEnable($("#btnCambiorEstadoOT"), !estadoPermiteEdicion || EtpSeguidor === true || EtpAsignado === false ? false : true);
    KdoButtonEnable($("#btnSolicitarRegistroCambio"), EtpSeguidor === true || datos.EstadoOT === 'TERMINADO' || datos.EstadoOT === 'CANCELADA' ? false : true);
    KdoButtonEnable($("#btnAutorizarRetenciones"), EtpSeguidor === true || datos.EstadoOT === 'TERMINADO' ? false : true);
    KdoButtonEnable($("#btnAgenda"), true);

    KdoButtonEnable($("#btnRegistroCambio"),true);
    
    xvNodocReq = datos.NodocReq;
    xEstadoOT = datos.EstadoOT;
    CumpleOEKOTEX = datos.StandarOEKOTEX;
    $("#cmbUsuario").data("kendoComboBox").setDataSource(get_cmbUsuario(datos.IdTipoOrdenTrabajo, datos.IdEtapaProceso));
    //obtner las estapas siguientes
    $("#cmbEtpSigAnt").data("kendoComboBox").setDataSource(get_cmbEtpSigAnt(datos.IdEtapaProceso, datos.IdTipoOrdenTrabajo));
    fn_getImagen(TSM_Web_APi + "ArteAdjuntos/GetVistaImagenes/" + datos.IdArte, datos.NodocReq);
    
    maq = fn_GetMaquinas();
    if (maq.length !== 0) {
        //obtener el tipo de alerta activa o no
        fn_GetAlertaEstatus(maq[0].IdSeteo);
        xIdQuimicaCliente = maq[0].IdQuimica;
    }
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
            Fn_DibujarCarrousel($("#Mycarousel"), "/Adjuntos/" + xNodocumentoReq.toString(), respuesta);
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
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesDepartamentos/" + tipoOrd.toString() + "/" + etp.toString(),
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
                    url: TSM_Web_APi + "EtapasProcesos/GetEtapasProcesosFlujo/" + etp.toString() + "/" + tipo.toString(),
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
                    url: TSM_Web_APi + "ConfiguracionEtapasOrdenesDepartamentos/" + tipo.toString() + "/" + etpAS.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

// VISTA MODAL QUE TIENE LA FUNCIONALIDAD DE ASIGNAR
// UNA ORDEN DE TRABAJO A LOS USUARIOS LIGADOS A UN DEPARTAMENTO

$("#vAsignarUsuario").kendoDialog({
    height: "50%",
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
            //window.history.go(-2);
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
    height: "80%",
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
    height: "30%",
    width: "40%",
    minHeight:"40%",
    title: "Desplazamiento de Estación",
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

$("#vColoresTecnicas").kendoWindow({
    height: "60%",
    width: "60%",
    minHeight: "70%",
    title: "Agregar color y técnica",
    visible: false,
    closable: true,
    modal: true,
    pinned: true,
    resizable: false,
    maximize: function (e) {
        e.preventDefault();
    },
    close: function () {
        fn_close_Modal_ColorTec();
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

//boton registro de solicitu de cambios
$("#btnSolicitarRegistroCambio").click(function (e) {
    fn_SolicitarIngresoCambio("SoliIngresoCambio", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), idTipoOrdenTrabajo.toString());
});

//llamar a la vista registro de comentarios en la agenda
$("#btnAgenda").click(function (e) {
    fn_OrdenesTrabajosAgendas("Agenda_OT", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val());
});
// llmar a la vista historial de seteos.
$("#btnHistorial").click(function (e) {
    fn_OrdenesTrabajosVersionesSeteos("historialSeteos", idOrdenTrabajo);
});

$("#btnDesplazarEstacion").click(function () {
    if (ValidarDesplazar.validate()) {
        fn_EjecutarDesplazamiento($("#rbDesplazarRight").is(':checked') === true ? "right" : "left", $("#chkRespetaVacio").is(':checked'), kdoNumericGetValue($("#NumBrazoIni")), kdoNumericGetValue($("#NumCntCantDesplazar")), maquinaVueEl);
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
});

$("#btnImpReportStrikeOff").click(function (e) {
    let paramficha = `${idOrdenTrabajo}`;

    e.preventDefault();
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: window.location.origin + "/Reportes/ReporteFichaStrikeOff/",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(
            {
                rptName: "crptFichaStrikeOff",
                controlador: "OrdenesTrabajos",
                accion: "GetFichaStrikeOff",
                id: paramficha

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


$("#btnDuplicarEstacion").click(function () {
    if (ValidarDuplicarEst.validate()) {
        fn_Duplicar(kdoNumericGetValue($("#NumOrigenA")), kdoNumericGetValue($("#NumDestinoB")));
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
});

$("#btnRegAjuste").click(function () {
    fn_AlertasBatch();
});



var fn_OpenModalDesplazamiento = function (EstacionIni, xMaquina,xCantidadEstaciones) {
    maquinaVueEl = xMaquina;
    CantidadBrazos = xCantidadEstaciones;
    $("#vDesplazarCambiar").data("kendoWindow").center().open();
    tabStrip.select(fn_getItem(0));
    kdoNumericSetValue($("#NumCntCantDesplazar"), 0);
    kdoNumericSetValue($("#NumBrazoIni"), EstacionIni);
    KdoNumerictextboxEnable($("#NumBrazoIni"), false);
    $('#rbDesplazarRight').prop('checked', true);
    $("#NumCntCantDesplazar").data("kendoNumericTextBox").focus();
    //$("#gridInter").data("kendoGrid").dataSource.read();

};

var fn_OpenModaAddColoresTecnicas = function (fn_close) {
    XSeteo = maq[0].IdSeteo;
    fn_close_Modal_ColorTec = fn_close;
    $("#vColoresTecnicas").data("kendoWindow").center().open();
    tabStripColor.select(fn_tabgetItem(0));
    $("#gridAddColor").data("kendoGrid").dataSource.read();
    $("#gridAddTecnica").data("kendoGrid").dataSource.read();

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

var fn_EjecutarDesplazamiento = function (xDireccion, xRespetaVacio, xBrazoInicial, xCantDesplazar, maquinaEl) {
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
                maquinaEl.data("maquinaSerigrafia").maquinaVue.desplazarBrazo(xBrazoInicial, xCantDesplazar, xDireccion ==="right" ? "R":"L");
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
            RequestEndMsg(data, "Put");
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($("#vDesplazarCambiar"), false);
        }
    });

};
var fn_Duplicar = function (EstacionO, EstacionD) {
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
};

///<summary> Método Copiar/Pegar para máquina de Vue </summary>
///<param name="varObjeto"> variable que contiene ref al objeto máquina </param>
///<param name="dataCopia"> contiene arreglo con datos de estación a copiar  </param>
var fn_DuplicarBrazoMaquina = function (varObjeto, dataCopia, fn_succes) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "/SeteoMaquinasEstaciones/CopiarEstacionMarco",
        type: "Post",
        data: JSON.stringify({
            idSeteo: maq[0].IdSeteo,
            idEstacionOrigen: dataCopia.data[0].IdEstacion,
            idEstacionDestino: dataCopia.numeroBrazo,
            idUsuario: getUser()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            varObjeto.vueComponent.agregarConfiguracion(dataCopia.numeroBrazo, dataCopia.tipo, dataCopia.data[0]); // actualiza máquina en vista.
            RequestEndMsg(data, "Post");

            if (fn_succes === undefined) {
                return true;
            } else {
                return fn_succes();
            }
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(document.body), false);
        }
    });
};
//

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
                FechaHasta: null,
                Estado: "ACTIVO"
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
 /*   kendo.ui.progress($(document.body), true);*/
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + $("#txtIdOrdenTrabajo").val() + "/" + $("#txtIdEtapaProceso").val() + "/" + $("#txtItem").val(),
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        }
        //complete: function () {
        //    kendo.ui.progress($(document.body), false);
        //}
    });

    return result;
};

var fn_gridColorEstacion = function (gd) {

    var dsColor = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaColores/GetSeteoMaquinaColoresByIdSeteo/" + XSeteo; },
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
                            return XSeteo;
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
                                if (input.is("[name='IdTipoRequerimientoColor']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoRequerimientoColor").data("kendoComboBox").selectedIndex >= 0;
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
                    },
                    IdTipoRequerimientoColor: {
                        type: "string"
                    },
                    NombreTipoReqColor: { type: "string" }
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
            KdoHideCampoPopup(e.container, "CodigoPantone");
            KdoHideCampoPopup(e.container, "IdTipoPantonera");
            KdoHideCampoPopup(e.container, "NombreIgualacion");
            KdoHideCampoPopup(e.container, "NombreTipoReqColor");

            $('[name="ID"]').on("change", function (e) {
                if ($(this).data("kendoMultiColumnComboBox").dataItem() !== undefined) {
                    if ($(this).data("kendoMultiColumnComboBox").selectedIndex >= 0) {
                        var data = $(this).data("kendoMultiColumnComboBox").dataItem();

                        $('[name="ColorHex"]').data("kendoColorPicker").value(data.ColorHex);
                        $('[name="ColorHex"]').data("kendoColorPicker").trigger("change");
                        $('[name="Color"]').val(data.Codigo);
                        $('[name="Color"]').trigger("change");
                        $('[name="Item"]').data("kendoNumericTextBox").value(data.Item);
                        $('[name="Item"]').data("kendoNumericTextBox").trigger("change");
                        $('[name="IdTipoPantonera"]').val(data.IdTipoPantonera);
                        $('[name="IdTipoPantonera"]').trigger("change");
                    }
                }
            });

            if (!e.model.isNew() && e.model.Item !== null) {
                $('[name="ID"]').data("kendoMultiColumnComboBox").text(e.model.CodigoPantone);
                $('[name="ID"]').data("kendoMultiColumnComboBox").trigger("change");
                $('[name="ID"]').data("kendoMultiColumnComboBox").search(e.model.ID);
                $('[name="ID"]').data("kendoMultiColumnComboBox").refresh();
                $('[name="ID"]').data("kendoMultiColumnComboBox").close();
            }

            Grid_Focus(e, "ID");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoColor", title: "Código. Desarrollo Color", hidden: true },
            { field: "IdSeteo", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            
            {
                field: "ID", title: "Código Pantone",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlPantones();
                },
                hidden: true
            },
            { field: "Item", title: "Item", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "Color", title: "Color Diseño" },
            { field: "CodigoPantone", title: "Codigó Pantone" },
            {
                field: "ColorHex", title: "Muestra",
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>',
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).kendoColorPicker();
                }
            },
            { field: "IdTipoIgualacionColor", title: "Igualar Color a:", values: ["IdTipoIgualacionColor", "Nombre", TSM_Web_APi + "/TiposIgualacionesColores", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "NombreIgualacion", title: "Igualar a:" },
          
            { field: "IdTipoPantonera", title: "Tipo Pantone", hidden: true, menu: false },
            { field: "IdTipoRequerimientoColor", title: "Tipo requerimiento", values: ["IdTipoRequerimientoColor", "Nombre", TSM_Web_APi + "/TiposRequerimientoColores/GetTecnicos", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true},
            { field: "NombreTipoReqColor", title: "Requerimiento" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gridAlto);
    SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command(gd.data("kendoGrid"),false, Permisos.SNBorrar);
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

var fn_gridTecnicaEstacion = function (gd) {

    var dsTecnica = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + XSeteo; },
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
                            return XSeteo;
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
                                if (input.is("[name='IdTipoRequerimientoTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoRequerimientoTecnica").data("kendoComboBox").selectedIndex >= 0;
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
                    },
                    IdTipoRequerimientoTecnica: {
                        type: "string",
                        defaultValue: function () {
                            return "2";
                        }
                    },
                    Nombre1: { type: "string" }
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
            KdoHideCampoPopup(e.container, "Nombre1");
            Grid_Focus(e, "IdTecnica");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoTecnica", title: "Código. Muestra Técnica", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdTecnica", title: "Técnicas", editor: Grid_Combox, values: ["IdTecnica", "Nombre", Urltec, "GetbyServicio/" + 1, "Seleccione un Técnica....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre técnica" },
            { field: "IdTipoRequerimientoTecnica", title: "Tipo requerimiento", values: ["IdTipoRequerimientoTecnica", "Nombre", TSM_Web_APi + "/TiposRequerimientoTecnicas/GetTecnicos", "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Requerimiento" }

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

/**Obtiene los tipos de maquinas para la maquina de Vue */
var fn_GetFormasMaquina = function (maquina) {
    let datos = [];

    $.ajax({
        url: TSM_Web_APi + "FormasMaquinas",
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (Respuesta) {
            maquina.cargarDataTipoMaquina(Respuesta);
        }
    });

    return datos;
};

/**
 * Obtiene los colores de la orden de trabajo para la maquina de Vue
 * @param {number} idSeteo
 */
var fn_GetColores = function (maquina, idSeteo) {
    let datos = [];
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinaColores/GetSeteoMaquinaColoresByIdSeteo/" + idSeteo,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (Respuesta) {
            maquina.cargarDataColores(Respuesta);
        }
    });

    return datos;
};

/**
 * Obtiene las tareas de la orden de trabajo para la maquina de Vue
 * @param {Number} idSeteo
 */
var fn_Tecnicas = function (maquina, idSeteo) {
    let datos = [];
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + idSeteo,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (Respuesta) {
            maquina.cargarDataTecnicas(Respuesta);
        }
    });

    return datos;
};

/**Obtiene las bases de la orden de trabajo para la maquina de Vue */
var fn_Bases = function (maquina) {
    let datos = [];

    $.ajax({
        url: TSM_Web_APi + "BasesMuestras",
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (Respuesta) {
            maquina.cargarDataBases(Respuesta);
        }
    });

    return datos;
};

/**Obtiene los acesorios de la orden de trabajo para la maquina de Vue */
var fn_Accesorios = function (maquina) {
    let datos = [];

    $.ajax({
        url: TSM_Web_APi + "AccesoriosMaquinas",
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (Respuesta) {
            maquina.cargarDataAccesorios(Respuesta);
        }
    });

    return datos;
};

var fn_VerDetalleBrazoMaquina = function (e) {
    var dataEstacion = e.detail[0];
    if (dataEstacion.accessories[0] !== undefined) {
        fn_verEditar(dataEstacion.accessories[0].tipo, dataEstacion.number);
    }
   
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
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetListaEstacionesIntercambiar/" + XSeteo + "/" + CantidadBrazos; },
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
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 650);
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
 * @param {Number} xIdSeteo codigo de seteo de la maquina
 * @param {JSON} data data retornada por el evento de eliminación
 * @param {Number} xMaquina numero de estacion del brazo o estacion
 */
var fn_EliminarEstacion = function (xIdSeteo, data, xMaquina, fn_succes) {
    kendo.ui.progress($(document.body), true);
    let xIdestacion = data.detail[0].number;
    let Urldel = xIdestacion !== undefined ? TSM_Web_APi + "SeteoMaquinasEstaciones/" + xIdSeteo + "/" + xIdestacion : TSM_Web_APi + "SeteoMaquinasEstaciones/Deltodas/" + xIdSeteo;
    $.ajax({
        url: Urldel,
        type: "Delete",
        contentType: 'application/json; charset=utf-8',
        success: function (resultado) {
            RequestEndMsg(resultado, "Delete");
            maq = fn_GetMaquinas();
            xMaquina.data("maquinaSerigrafia").eliminarEstacion(data.detail[0]);
            if (fn_succes === undefined) {
                return true;
            } else {
                return fn_succes();
            }
           
        },
        error: function (resultado) {
            ErrorMsg(resultado);
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
//#region Formulas historicas Metodos Obtener formula, seteo del valor de busqueda

//debe configuarse por etapas
$("#FormulaHist").on("ObtenerFormula", function (event, CodigoColor, _MasaEntregada) {
    fn_GuardaCodigoColor(CodigoColor, _MasaEntregada);
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
        case "12":
            TxtFilNombreColor = $("#TxtOpcSelec_Ajuste").val();//este campo contiene el valor del nombre color para la etapa de Tintas, cuando el marco sea de tipo de formulacion color,base y tecnica
            FilCumpleOEKOTEX = CumpleOEKOTEX;
            break;
    }
});

var fn_GuardaCodigoColor = function (xCodColor, _MasaEntregada) {
    //Los metodos se definen en cada etapa correspondiente.
    switch (idEtapaProceso) {
        case "6":
            fn_GuardarEstacionFormula(idBra, xCodColor);
            break;
        case "8":
            fn_GuardarEstacionFormulaDis(idBra, xCodColor);
            break;
        case "9":
            fn_GuardarFormulaEst(xidEstacion, xCodColor, _MasaEntregada);
            break;
        case "12":
            fn_GuardarFormulaEst_Ajuste(xidEstacion, xCodColor, _MasaEntregada);
            break;
    }
  
};

//#endregion

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
var fn_tabgetItem = function (indice) {
    return tabStripColor.tabGroup.children("li").eq(indice);
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
            IdSolicitudCambio: 4,
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

var fn_ActualizarAlerta = function (xAplica , xTipo) {
    kendo.ui.progress($("#vAlertaAjustes"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasAlertas/ActualizarSeteoMaquinasAlertas",//
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdSeteo: XSeteo,
            IdAlerta: KdoCmbGetValue($("#cmbTpAjuste")),
            Aplica: xAplica,
            Tipo: xTipo
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Post");
            $("#gridAlerAjus").data("kendoGrid").dataSource.read();
            kendo.ui.progress($("#vAlertaAjustes"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#vAlertaAjustes"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GetSeteoMaquinasAlertasValidacion = function (IdSeteo) {
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasAlertas/GetSeteoMaquinasAlertasValidacion/" + IdSeteo,
        type: 'GET',
        success: function (datos) {
            if (datos === null) {
                $('#chkTintasTodasEsta').prop('checked', false);
                $('#chkMarcoTodasEsta').prop('checked', false);
            } else {
                $('#chkTintasTodasEsta').prop('checked', datos.Tintas);
                $('#chkMarcoTodasEsta').prop('checked', datos.Marco);
            }
          
        }
    });
};


var fn_UpdFormaRevTec = function (cantidadEstaciones, idFormaMaquina, nomFiguraMaquina, maquina, reducirEtacion, fn_succes) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/UpdSeteoMaquinas_Forma/" + maq[0].IdSeteo,
        type: "Put",
        data: JSON.stringify({
            IdEstructuraMaquina: idFormaMaquina
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, "Put");
            maquina.data("maquinaSerigrafia").maquinaVue.initialize(cantidadEstaciones, nomFiguraMaquina);
            if (reducirEtacion === 0) {
                maq = fn_GetMaquinas();
            } else {
                fn_ReduccionEstacionesMaq(maq[0].IdSeteo, cantidadEstaciones);
            }

            if (fn_succes === undefined) {
                return true;
            } else {
                return fn_succes();
            }
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
            maq = fn_GetMaquinas();
            maquina.data("maquinaSerigrafia").cargarDataMaquina(maq);
        }
    });

};

var fn_ReduccionEstacionesMaq = function (xIdSeteo,xCantidadEstaciones) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstaciones/ReduccionEstacionesMaq",
        type: "Post",
        data: JSON.stringify({
            idSeteo: xIdSeteo,
            noEstaciones_Cambio:xCantidadEstaciones
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, "Put");
            maq = fn_GetMaquinas();
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });

};

var fn_TrasladarEstacion = function (brazoDestino, tipo, data, brazoInicio, maquina,fn) {

    let fn_Completado = function () {
        if (fn === undefined || fn === "") {
            return true;
        } else {
            return fn();
        }
    };
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "/SeteoMaquinasEstaciones/OperacionMaquina/" + maq[0].IdSeteo,
        type: "Put",
        data: JSON.stringify(brazoInicio.number.toString() + "|" + brazoDestino.number.toString() + "," + brazoDestino.number.toString() + "|" + brazoInicio.number.toString()),
        contentType: 'application/json; charset=utf-8',
        success: function (resultado) {
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(resultado, "Put");
            maquina.data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(brazoDestino, tipo, data, brazoInicio);
            fn_Completado();
           
        },
        error: function (resultado) {
            ErrorMsg(resultado);
            kendo.ui.progress($(document.body), false);
        }
    });

};

//obtener los departamentos a los que pertenece un usuario
//******

var fn_GetDeptoRoles = function () {
    $.ajax({
        url: TSM_Web_APi + "/DepartamentosRoles/GetByIdUsuario/" + getUser(),
        async: false,
        type: 'GET',
        success: function (datos) {
            JSON.parse(JSON.stringify(datos), function (key, value) {
                if (value !== null) {
                    //if (value.Placement === true) filtro.push(value);
                    //if (value.Catalogo === true) filtro2.push(value);
                    switch (value.IdDepartamento) {
                        case 2:
                            dtoReviTec = true;
                            break;
                        case 3:
                            dtoDiseno = true;
                            break;
                        case 4:
                            dtoTintas = true;
                            break;
                        case 5:
                            dtoRevelado = true;
                            break;
                        default:
                    }
                }
                return value;
            });
        }
    });
};


var fn_GetAfectaSecuencia = function (IdSeteo) {
    $.ajax({
        url: TSM_Web_APi + "/SeteoMaquinasAlertas/GetAfectaSecuencia/" + IdSeteo,
        async: false,
        type: 'GET',
        success: function (datos) {
            if (datos.length > 0) {
                DienoAfectaSecuencia = true;
            } else {
                DienoAfectaSecuencia = false;
            }
        }
    });
};


var fn_GetAlertaEstatus = function (IdSeteo) {
    $.ajax({
        url: TSM_Web_APi + "/SeteoMaquinasAlertas/GetAlertasEstatus/" + IdSeteo,
        async: false,
        type: 'GET',
        success: function (datos) {
            $.each(datos, function (index, elemento) {
                switch (elemento.IdAlerta) {
                    case 3:
                        alertDiseno = elemento.EstaActiva;
                        break;
                    case 1:
                        alertTintas = elemento.EstaActiva;
                        break;
                    case 2:
                        alertRevelado = elemento.EstaActiva;
                        break;
                    default:
                }

            });
        }
    });
};

$("#body").on("cerrar_Modal_Color", function (event, param1, param2) {
    alert(param1 + "\n" + param2);
});

let fn_ObtCntMaxEstaciones = (al) => {
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/GetMaxEstacionesPermitida/" + `${idOrdenTrabajo}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            let AlertEst = al;
            if (al === undefined) {
                kdoNumericSetValue($("#TxtCntEstacionesPermitidas"), datos.EstacionesPermitidas);

            } else {
                AlertEst.children().remove();

                if (datos === null) {
                    AlertEst.children().remove();
                    PermiteAddEstacion = true;
                } else {
                    kdoNumericSetValue($("#TxtCntEstacionesPermitidas"), datos.EstacionesPermitidas);

                    if (datos.CantidadNoPemitida === true) {
                        if (datos.MostrarAdvertencia === true) {
                            AlertEst.append('<div class="alert alert-warning alert-dismissible" id="AlertPermitidas">' +
                                '<strong>Advertencia!</strong> SETEO DE MAQUINA SUPERA AL MAXIMO DE ESTACIONES PERMITIDO' +
                                '</div>');
                        }
                        PermiteAddEstacion = false;

                    } else {
                        AlertEst.alert();
                        PermiteAddEstacion = true;
                    }

                };
            }
        }
    });
};

let fn_SeteoTecnicasCondiciones = (idSeteo) => {
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinaTecnicas/GetFlags/" + `${idSeteo}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            tecnicasFlags = datos;
        }
    });
}

/**
 * Quimicas formulaciones llenar combobox 
 * @param {any} vide codigo o id quimica
 * @returns {data} datos
 */
var Fn_GetQuimicaFormula = function (vide) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "QuimicasFormulaciones/GetQuimicasFormulacionByidQuimica/" + (vide !== null ? vide.toString() : 0),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};