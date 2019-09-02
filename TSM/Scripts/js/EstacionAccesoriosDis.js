var EstacionBraAcce;
var TeAcce;
var idBraAcce;
var fn_VistaEstacionAccesoriosDisDocuReady = function () {
    KdoButton($("#btnAddMEA_Dis"), "check", "Agregar");
    $("#btnAddMEA_Dis").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        fn_GuardarEstacionAccesorioDis();
    });
};

var fn_VistaEstacionAccesoriosDis = function () {
    //InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce_Dis"), false);
    $("#TxtOpcSelecAcce_Dis").val($("#TxtOpcSelecAcce_Dis").data("name"));
    idBraAcce = $("#TxtOpcSelecAcce_Dis").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    TeAcce = $("#TxtOpcSelecAcce_Dis").data("TipoEstacion");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);

    if (EstacionBraAcce !== null) {
        $("#TxtOpcSelecAcce_Dis").val(EstacionBraAcce.Nombre1 === undefined ? "" : EstacionBraAcce.Nombre1);
        $("#TxtOpcSelecAcce_Dis").data("IdAccesorio", EstacionBraAcce.IdAccesorio === undefined ? "" : EstacionBraAcce.IdAccesorio);
    }
};

let fn_GuardarEstacionAccesorioDis = function () {

    fn_GuardarEstacionAcceDis(idBraAcce);
    var a = stage.find("#TxtInfo" + idBraAcce);
    a.text($("#TxtOpcSelecAcce_Dis").val());
    layer.draw();
};

let fn_GuardarEstacionAcceDis = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesoriosDis"), true);
    var xType;

    if (EstacionBraAcce === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstaciones/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdEstacion: xIdBrazo,
            IdSeteo: maq[0].IdSeteo,
            IdTipoEstacion: "ACCESORIO",
            IdAccesorio: $("#TxtOpcSelecAcce_Dis").data("IdAccesorio")
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            maq = fn_GetMaquinas();
            $("#MEstacionAccesoriosDis").modal('hide');
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesoriosDis"), false);
            ErrorMsg(data);
        }
    });
};

fn_PWList.push(fn_VistaEstacionAccesoriosDis);
fn_PWConfList.push(fn_VistaEstacionAccesoriosDisDocuReady);