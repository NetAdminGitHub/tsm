var Permisos;

var fn_DMueCargarConfiguracion = function () {
    KdoButton($("#btnMuest"), "delete", "Limpiar");
    KdoButtonEnable($("#btnMuest"), false);
    KdoButton($("#btnFinOT"), "gear", "Finalizar OT");
    KdoButton($("#btnAceptarFin"), "check", "Finalizar");
    $("#dFechaFinMue").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaFinMue").data("kendoDatePicker").value(Fhoy());
    $("#MbtnFinMue").kendoDialog({
        height: "auto",
        width: "20%",
        title: "Finalizar Orden de Trabajo",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    //kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's')
    // colocar grid para arrastre

    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaMues"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaMues"), false);
    KdoCmbSetValue($("#CmbMaquinaMues"), maq[0].IdMaquina);

    let UrlUMDM = TSM_Web_APi + "UnidadesMedidas";
    Kendo_CmbFiltrarGrid($("#CmbIdUnidad"), UrlUMDM, "Abreviatura", "IdUnidad", "Seleccione...");
    let UrlDM_OP = TSM_Web_APi + "OrientacionPositivos";
    Kendo_CmbFiltrarGrid($("#CmbIdOrientacionPositivo"), UrlDM_OP, "Nombre", "IdOrientacionPositivo", "Seleccione...");
    let UrlDM_TS = TSM_Web_APi + "TiposSeparaciones";
    Kendo_CmbFiltrarGrid($("#CmbIdTipoSeparacion"), UrlDM_TS, "Nombre", "IdTipoSeparacion", "Seleccione...");
    KdoButton($("#btnGuardarDiseñoMues"), "save", "Guardar");

    $("#btnMuest").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
    });

     //FINALIZAR OT
    let ValidFrmFinMue = $("#FrmFinMue").kendoValidator({
        rules: {
            FM: function (input) {
                if (input.is("[name='dFechaFinMue']")) {
                    return kendo.toString(kendo.parseDate($("#dFechaFinMue").val()), 's') !== null;
                }
                return true;
            }

        },
        messages: {
            FM: "requerido"
        }
    }).data("kendoValidator");

    $("#btnFinOT").click(function () {
    
        $("#MbtnFinMue").data("kendoDialog").open();
        $("#dFechaFinMue").data("kendoDatePicker").element.focus();
    });
    $("#btnAceptarFin").click(function () {
        if (ValidFrmFinMue.validate()) { fn_FinOT(); }
    });

};

var fn_DMCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnFinOT"), vhb);
};

// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = fn_RTCargarMaquina;
fun_ListDatos.push(EtapaPush);
//Agregar a Lista de ejecucion funcion configurar 
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_DMueCargarConfiguracion;
fun_ListDatos.push(EtapaPush2);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_DMCargarEtapa;
fun_ListDatos.push(EtapaPush3);

fPermisos = function (datos) {
    Permisos = datos;
};

let fn_FinOT = function () {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/OrdenesTrabajosFinalizar",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            IdOrdenTrabajo: $("#txtIdOrdenTrabajo").val() ,
            IdEtapaProcesoFinalizar: idEtapaProceso,
            FechaFinMuestra: kendo.toString(kendo.parseDate($("#dFechaFinMue").val()), 's')
        }),
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            $("#MbtnFinMue").data("kendoDialog").close();
            //obneter los datos del arte y trasladar el diseño a la carpeta de catalogos
            fn_GetArteDis();
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(".k-dialog"),false);
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });

};

let fn_GetArteDis = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "Artes/GetArteByIdReq/" + $("#txtIdRequerimiento").val(),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                var dsres = [{
                    NoDocumento: xvNodocReq,
                    NoReferencia: respuesta.NoReferencia,
                    NombreArchivo: respuesta.NombreArchivo
                }];
                SubirArchivoCatalogo(dsres);
            
            }
            CargarInfoEtapa(false);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let SubirArchivoCatalogo = function (ds) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/RequerimientoDesarrollos/SubirArchivoCatalogo",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};