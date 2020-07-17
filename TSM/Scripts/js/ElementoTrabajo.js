
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
                motivo: $("#TxtMotivoEtp").val()
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Realizado = true;
                RequestEndMsg(datos, "Post");
                $("#vCamEtapa").data("kendoDialog").close();
                $("#smartwizard").smartWizard("goToPage", $("[etapa=" + xindice.toString() + "]").attr("indice"));

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
    PanelBarConfig($("#BarPanelInfo"));
    kendo.ui.progress($(document.body), true);
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

    $("#cmbEtpSigAnt").data("kendoComboBox").bind("change", function (e) {
        $("#cmbUsuarioEtp").data("kendoComboBox").value("");
        $("#cmbUsuarioEtp").data("kendoComboBox").setDataSource(get_cmbUsuarioEtp(idTipoOrdenTrabajo.toString(), this.value() === "" ? 0 : this.value()));

    });

    KdoButton($("#btnCambiarAsignado"), "gear");
    KdoButton($("#btnAsignarUsuario"), "save");
    KdoButton($("#btnCambiarEtapa"), "gear");
    KdoButton($("#btnIrGOT"), "hyperlink-open-sm");

    $("#swchSolTelaSusti").kendoSwitch();

    $("#swchSolDesOEKO").kendoSwitch();
    $("#swchPDocAduanal").kendoSwitch();
    $("#swchCobDiseno").kendoSwitch();

    //cargando todas las etapas
    ConfigEtapas = fn_ConfigEtapas();

    //cargando los accesorios maquinas
    AccesMaquinaArt = fn_getAccesoriosMaquinasArticulos();

});

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
    if (datos.Asignado === false && datos.Seguidor === false) {
        window.location.href = "/GestionOT";
        return;
    }
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
    $("#txtNombreUbicacion").val(datos.NombreUbicacion);
    $("#swchSolTelaSusti").data("kendoSwitch").check(datos.SolicitaTelaSustituta);
    $("#swchSolTelaSusti").data("kendoSwitch").enable(false);
    $("#swchSolDesOEKO").data("kendoSwitch").check(datos.StandarOEKOTEX);
    $("#swchSolDesOEKO").data("kendoSwitch").enable(false);
    $("#swchPDocAduanal").data("kendoSwitch").check(datos.PoseeDocumentacionAduanal);
    $("#swchPDocAduanal").data("kendoSwitch").enable(false);
    $("#swchCobDiseno").data("kendoSwitch").check(datos.CobrarDiseno);
    $("#swchCobDiseno").data("kendoSwitch").enable(false);

    xVistaFormulario = datos.VistaFormulario;
    idTipoOrdenTrabajo = datos.IdTipoOrdenTrabajo;
    xIdQuimica = datos.IdQuimica;
    NombreQui = datos.NombreQui;
    KdoButtonEnable($("#btnCambiarAsignado"), $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true);
    KdoButtonEnable($("#btnCambiarEtapa"), $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true);
    xvNodocReq = datos.NodocReq;
    xEstadoOT = datos.EstadoOT;
    CumpleOEKOTEX = datos.StandarOEKOTEX;
    $("#cmbUsuario").data("kendoComboBox").setDataSource(get_cmbUsuario(datos.IdTipoOrdenTrabajo, datos.IdEtapaProceso));
    $("#cmbEtpSigAnt").data("kendoComboBox").setDataSource(get_cmbEtpSigAnt(datos.IdEtapaProceso));
    fn_getImagen(TSM_Web_APi + "ArteAdjuntos/GetByArte/" + datos.IdArte, datos.NodocReq);
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

var get_cmbEtpSigAnt = function ( etp) {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "EtapasProcesos/GetEtapasAnterioresSiguientesByIdEtapaProceso/" + etp.toString(),
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
    height: $(window).height() - "510" + "px",
    width: "30%",
    title: "Asignación de Usuarios",
    visible: false,
    closable: true,
    modal: true,
    actions: [
        { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
    ],
    close: function (e) {
        if (e.userTriggered)
            CargarInfoEtapa(false);
    }
});

$("#vCamEtapa").kendoDialog({
    height: "auto",
    width: "20%",
    maxHeight: "600 px",
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

$("#btnCambiarEtapa").click(function (e) {
    $("#cmbUsuarioEtp").data("kendoComboBox").value("");
    $("#cmbUsuarioEtp").data("kendoComboBox").dataSource.read();
    $("#cmbEtpSigAnt").data("kendoComboBox").value("");
    $("#cmbEtpSigAnt").data("kendoComboBox").dataSource.read();
    $("#TxtMotivoEtp").val("");
    $("#vCamEtapa").data("kendoDialog").open();
    $("#FrmCambioEtapa").data("kendoValidator").hideMessages();
    KdoCmbFocus($("#cmbEtpSigAnt"));
});

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
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaColores/GetSeteoMaquinaColoresByIdSeteo/" + xvIdSeteo; },
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
                            return xvIdSeteo;
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
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + xvIdSeteo; },
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
                            return xvIdSeteo;
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

        xformulaDet.append('<tr>' +
            '<td>' + elemento.IdArticulo + '</td>' +
            '<td>' + elemento.Nombre + '</td>' +
            '<td>' + kendo.format("{0:n2}",elemento.MasaFinal) + '</td>' +
            '<td>' + kendo.format("{0:n2}", elemento.PorcFinal) + '</td>' +
            '</tr>');
    });

    xformulaDet.append('<tr>' +
        '< th rowspan = "1" colspan = "1" ></th > ' +
        '<th rowspan="1" colspan="1"></th>' +
        '<th rowspan="1" colspan="1"></th>' +
        '<th rowspan="1" colspan="1">Total:</th>' +
        '<th rowspan="1" colspan="1">'+( ds !==null ? kendo.format("{0:n2}", ds[0].TotalPorc): 0.00) +' %</th>' +
        '</tr>');

    //xformulaDet.append('<tr>' +
    //    '<td></td>' +
    //    '<td></td>' +
    //    '<td>Total:</td>' +
    //    '<td>' +( ds !==null ? ds[0].TotalPorc.toFixed(4): 0.00) + '</td>' +
    //    '</tr>');

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
 *  @returns {data} datos
 */
var fn_ConfigEtapas = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "EtapasProcesos/GetByModulo/2",
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
    fn_VistaEstacionFormulas();
};
/** 
 *  metodo que obtiene todos los AccesoriosMaquinasArticulos
 *  @returns {data} datos
 */
var fn_getAccesoriosMaquinasArticulos = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "AccesoriosMaquinasArticulos",
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