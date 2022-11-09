let VAutCntEst;
var fn_InicializarCntActualizarEstacionesPermitidas = (divCntEstaPermi, cepIdot, cepIdEtapa, cepItem) => {
    KdoButton($("#btnActualizarCntPermi"), "check", "Actualizar");
    $("#TxtCntPermitidas").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });


    VAutCntEst = $("#FrmAnutCntEsta").kendoValidator(
        {
            rules: {
                Msg1: function (input) {
                    if (input.is("[name='TxtComentariosAutorizarPermitida']")) {
                        return input.val().length > 0 && input.val().length <= 2000;
                    }
                    return true;
                }
               
            },
            messages: {
                Msg1: "Requerido"
              

            }
        }).data("kendoValidator");

    KdoNumerictextboxEnable($("#TxtCntPermitidas"), false);
    KdoButtonEnable($("#btnActualizarCntPermi"), false);
    TextBoxEnable($("#TxtComentariosAutorizarPermitida"),false);

    $("#btnActualizarCntPermi").click(function (e) {
        fn_UpdCantidadPermitidas(divCntEstaPermi,cepIdot, cepIdEtapa, cepItem);
    });

    fn_ObtenerCntMaxEstaciones(cepIdot);
    fn_GetAutCambioEstacionPermitida();
    $("#TxtComentariosAutorizarPermitida").val("");
};

var fn_ActualizarCntEstacionesPermitidas = (divCntEstaPermi,cepIdot, cepIdEtapa, cepItem) => {

    fn_ObtenerCntMaxEstaciones(cepIdot);
    fn_GetAutCambioEstacionPermitida();
    $("#TxtComentariosAutorizarPermitida").val("");

};
let fn_ObtenerCntMaxEstaciones = (cepIdot) => {
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosDetalles/GetRequerimientoByOT/" + `${cepIdot}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            kdoNumericSetValue($("#TxtCntPermitidas"), datos[0].CantidadEstacionesPermitidas);
        }
    });
};


let fn_UpdCantidadPermitidas = (divCntEstaPermi,cepIdot, cepIdEtapa, cepItem) =>{
    kendo.ui.progress($(document.body), true);
    if (kdoNumericGetValue($("#TxtCntPermitidas")) > 0) {
        kendo.ui.progress($(document.body), true);

        if (VAutCntEst.validate()) {
            $.ajax({
                url: TSM_Web_APi + "/RequerimientoDesarrollos/UpdCantidadEstacionesPermitidas",//
                type: "post",
                dataType: "json",
                data: JSON.stringify({
                    IdOrdenTrabajo: cepIdot,
                    IdEtapaProceso: cepIdEtapa,
                    Item: cepItem,
                    CantidadEstacionesPermitidas: kdoNumericGetValue($("#TxtCntPermitidas")),
                    Comentarios: $("#TxtComentariosAutorizarPermitida").val()

                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    RequestEndMsg(data, "Post");
                    kendo.ui.progress($(document.body), false);
                    $("#" + divCntEstaPermi + "").data("kendoDialog").close();
                },
                error: function (data) {
                    kendo.ui.progress($(document.body), false);
                    ErrorMsg(data);
                    fn_ObtenerCntMaxEstaciones(cepIdot);
                    $("#TxtCntPermitidas").data("kendoNumericTextBox").focus();
                }
            });
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("CAMPOS REQUERIDOS", "error");
            kendo.ui.progress($(document.body), false);
        }
 
       
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("CANTIDAD DE ESTACIONES DEBE SER MAYOR A CERO", "error");
        fn_ObtenerCntMaxEstaciones(cepIdot);
        kendo.ui.progress($(document.body), false);
        $("#TxtCntPermitidas").data("kendoNumericTextBox").focus();

    }
};


let fn_GetAutCambioEstacionPermitida = () => {
    $.ajax({
        url: TSM_Web_APi + "DepartamentosRoles/GetByIdUsuarioIdDepartamentoIdRol/" + `${getUser()}/${2}`,
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                KdoNumerictextboxEnable($("#TxtCntPermitidas"),  EtpAsignado === true ? true : false);
                KdoButtonEnable($("#btnActualizarCntPermi"), EtpAsignado === true ? true : false);
                TextBoxEnable($("#TxtComentariosAutorizarPermitida"), EtpAsignado === true ? true : false);
                $("#TxtCntPermitidas").data("kendoNumericTextBox").focus();
            } else {
                KdoNumerictextboxEnable($("#TxtCntPermitidas"), false);
                KdoButtonEnable($("#btnActualizarCntPermi"), false);
                TextBoxEnable($("#TxtComentariosAutorizarPermitida"), false);
            }
        }
    });
};