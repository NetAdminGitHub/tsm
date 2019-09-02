let UrlSD = TSM_Web_APi + "SolicitudesDesarrollos";
let UrlTSD = TSM_Web_APi + "TiposSolicitudesDesarrollos";
let UrlTMQ = TSM_Web_APi + "TiposMaquinas";
let UrlTMU = TSM_Web_APi + "TipoMuestras";

var fn_SDCargarJSEtapa = function () {

    KdoButton($("#btnGuardar"), "save", "Crear Solicitud");
    Kendo_CmbFiltrarGrid($("#CmbTipoSolicitudDesarrollo"), UrlTSD, "Nombre", "IdTipoSolicitudDesarrollo", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbTipoMaquina"), UrlTMQ, "Nombre", "IdTipoMaquina", "Seleccione...");
    KdoComboBoxEnable($("#CmbTipoSolicitudDesarrollo"), false)
    Kendo_CmbFiltrarGrid($("#CmbTipoMuestra"), UrlTMU, "Nombre", "IdTipoMuestra", "Seleccione...");
    KdoComboBoxEnable($("#CmbTipoMuestra"), false);
    $("#dtFechaSolicitudCliente").kendoDatePicker({ format: "dd/MM/yyyy" });
    KdoDatePikerEnable($("#dtFechaSolicitudCliente"), false);
    $("#dtFechaSolicitudDesarrollo").kendoDatePicker({ format: "dd/MM/yyyy" });
    KdoDatePikerEnable($("#dtFechaSolicitudDesarrollo"), false);
    $("#dtFechaEstampado").kendoDatePicker({ format: "dd/MM/yyyy" });
    KdoDatePikerEnable($("#dtFechaEstampado"), false);
    KdoCmbFocus($("#CmbTipoMaquina"));

    $("#btnGuardar").data("kendoButton").bind("click", function () {
        event.preventDefault();
        if ($("#RSoliMue").data("kendoValidator").validate()) {
            fn_GuardarSolictudDesarrollo();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#RSoliMue").kendoValidator(
        {
            rules: {
                MsgTipoMaquina: function (input) {
                    if (input.is("[name='CmbTipoMaquina']")) {
                        return $("#CmbTipoMaquina").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgComentario: function (input) {
                    if (input.is("[name='TxtComentarios']")) {
                        return input.val().length <= 8000;
                    }
                    return true;
                },
               

            },
            messages: {
                MsgTipoMaquina: "Requerido",
                MsgComentario: "Logitu maxima del campo es 8000"
            }
        });
    //#region Grid
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSD + "/GetbyIdOrdenTrabajoIdEtapaProceso/" + $("#txtIdOrdenTrabajo").val() + "/" + $("#txtIdEtapaProceso").val() },
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
                fields: {
                    IdMotivoDesarrollo: { type: "number" },
                    MotivoDesarollo: { type: "string" },
                    IdPrograma: { type: "number" },
                    NombrePrograma: { type: "string" },
                    IdTemporada: { type: "number" },
                    NombreTemporada: { type: "string" },
                    DescripcionDiseno: { type: "string" },
                    TamanoArte: { type: "string" },
                    MateriaPrimas: { type: "string" },
                    ColorTela: { type: "string" },
                    Yarda: { type: "number" },
                    Piezas: { type: "number" },
                    STrikeOff: { type: "number" },
                    TotalPiezas: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridSolDes").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoLuz");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMotivoDesarrollo", title: "Cod. Motivo Desarrollo", hidden: true },
            { field: "MotivoDesarollo", title: "Motivo Desarrollo" },
            { field: "IdPrograma", title: "Cod. Programa", hidden: true },
            { field: "NombrePrograma", title: "Programa" },
            { field: "IdTemporada", title: "Cod. Temporada", hidden: true },
            { field: "NombreTemporada", title: "Temporada" },
            { field: "DescripcionDiseno", title: "Descripcion Diseño" },
            { field: "TamanoArte", title: "Tamano Arte" },
            { field: "MateriaPrimas", title: "Materia Primas" },
            { field: "ColorTela", title: "Color Tela" },
            { field: "Yarda", title: "Yarda" },
            { field: "Piezas", title: "Piezas" },
            { field: "STrikeOff", title: "Strike Off" },
            { field: "TotalPiezas", title: "Total Piezas" }
   
        ]
    });

    SetGrid($("#gridSolDes").data("kendoGrid"), ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si,100);
    Set_Grid_DataSource($("#gridSolDes").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridSolDes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSolDes"), selectedRows);
    });
    //#endregion
};

var fn_SDCargarDatos = function () {
    fn_GetSolicitud();
    let vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
    KdoComboBoxEnable($("#CmbTipoMaquina"), vhb);
    TextBoxEnable($("#TxtComentarios"), vhb);
    KdoCheckBoxEnable($("#chkExisteTela"), vhb);
    KdoButtonEnable($("#btnGuardar"), vhb);
    if (vhb) KdoCmbFocus($("#CmbTipoMaquina"));
};

let fn_GetSolicitud = function () {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlSD + "/GetbyIdOrdenTrabajoIdEtapaProceso/" + $("#txtIdOrdenTrabajo").val() +"/"+ $("#txtIdEtapaProceso").val(),
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                $("#TxtIdSolicitudDesarrollo").val( respuesta.IdSolicitudDesarrollo);
                $("#TxtEstado").val(respuesta.Estado);
                $("#TxtNoDocumento").val(respuesta.NoDocumentoReq);
                KdoCmbSetValue($("#CmbTipoSolicitudDesarrollo"), respuesta.IdTipoSolicitudDesarrollo);
                KdoCmbSetValue($("#CmbTipoMuestra"), respuesta.IdTipoSolicitudDesarrollo);
                $("#dtFechaSolicitudCliente").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaSolicitudCliente), 'dd/MM/yyyy'));
                $("#dtFechaSolicitudDesarrollo").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaSolicitudDesarrollo), 'dd/MM/yyyy'));
                $("#dtFechaEstampado").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaEstampado), 'dd/MM/yyyy'));
                KdoCmbSetValue($("#CmbTipoMaquina"), respuesta.IdTipoMaquina);
                $("#TxtComentarios").val(respuesta.Comentarios);
                $('#chkExisteTela').prop('checked', respuesta.ExisteTela); 
            } else {
                $("#TxtIdSolicitudDesarrollo").val(0);
                $("#TxtEstado").val("");
                KdoButtonEnable($("#btnGuardar"), false);
            }
            kendo.ui.progress($("#body"), false);
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
        }
    });
};

let fn_GuardarSolictudDesarrollo = function () {
    kendo.ui.progress($("#body"), true);
    var xType = "Put";
    var xFechaSolicitudCliente = kendo.toString(kendo.parseDate($("#dtFechaSolicitudCliente").val()), 's');
    var xFechaSolicitudDesarrollo = kendo.toString(kendo.parseDate($("#dtFechaSolicitudDesarrollo").val()), 's');
    var xFechaEstampado = kendo.toString(kendo.parseDate($("#dtFechaEstampado").val()), 's');

    $.ajax({
        url: UrlSD + "/" + $("#TxtIdSolicitudDesarrollo").val(),//
        type: xType,
        //dataType: "json",
        data: JSON.stringify({
            IdSolicitudDesarrollo: $("#TxtIdSolicitudDesarrollo").val(),
            IdTipoSolicitudDesarrollo: KdoCmbGetValue($("#CmbTipoSolicitudDesarrollo")),
            IdRequerimiento: $("#txtIdRequerimiento").val(),
            IdCliente: $("#IdCliente").val(),
            FechaSolicitudCliente: xFechaSolicitudCliente,
            FechaSolicitudDesarrollo: xFechaSolicitudDesarrollo,
            FechaEstampado: xFechaEstampado,
            IdTipoMaquina:  KdoCmbGetValue($("#CmbTipoMaquina")),
            ExisteTela: $("#chkExisteTela").is(':checked'),
            Estado: $("#TxtEstado").val(),
            IdOrdenTrabajo: $("#txtIdOrdenTrabajo").val(),
            NoOrdenTrabajo: $("#txtNoDocumentoOT").val(),
            Comentarios: $("#TxtComentarios").val()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#body"), false);
            $("#gridSolDes").data("kendoGrid").dataSource.read();
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(data);
        }
    });

};

fun_List.push(fn_SDCargarJSEtapa);

fun_ListDatos.push(fn_SDCargarDatos);