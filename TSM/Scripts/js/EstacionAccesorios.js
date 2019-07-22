var EstacionBraAcce;
var TeAcce;
var idBraAcce;

var fn_VistaEstacionAccesorios = function () {
    InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce"), false);
    KdoButton($("#btnAddMEA"), "check", "Agregar");

    $("#TxtOpcSelecAcce").val($("#TxtOpcSelecAcce").data("name"));

    idBraAcce = $("#TxtOpcSelecAcce").data("IdBrazo").replace("TxtInfo", "");
    TeAcce = $("#TxtOpcSelecAcce").data("TipoEstacion");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);

    $("#btnAddMEA").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        fn_GuardarEstacionAccesorio();
    });
};

fn_PWList.push(fn_VistaEstacionAccesorios);

let fn_GuardarEstacionAccesorio = function () {

    fn_GuardarEstacionAcce(idBraAcce);
    var a = stage.find("#TxtInfo" + idBraAcce);
    a.text($("#TxtOpcSelecAcce").val());
    layer.draw();
};

let fn_GuardarEstacionAcce = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionAccesorios"), true);
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
            IdAccesorio: $("#TxtOpcSelecAcce").data("IdAccesorio")
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($("#MEstacionAccesorios"), false);
            maq = fn_GetMaquinas();
            $("#MEstacionAccesorios").modal('hide');
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesorios"), false);
            ErrorMsg(data);
        }
    });
};

let fn_GetEstacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionAccesorios"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstaciones/" + xIdSeteo + "/" + xIdestacion,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
            kendo.ui.progress($("#MEstacionAccesorios"), false);
        }
    });

    return result;
};