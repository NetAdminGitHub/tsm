
var fn_VistaEstacionAccesoriosDocuReady = function () {
    KdoButton($("#btnAddMEA"), "check", "Agregar");
    $("#btnAddMEA").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        fn_GuardarEstacionAccesorio();
    });
};

var fn_VistaEstacionAccesorios = function () {

 
    //InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce"), false);
    $("#TxtOpcSelecAcce").val($("#TxtOpcSelecAcce").data("name"));
    idBraAcce = $("#TxtOpcSelecAcce").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    EstacionBraAcce = fn_GetEstacion(maq[0].IdSeteo, idBraAcce);

    if (EstacionBraAcce !== null) {
        $("#TxtOpcSelecAcce").val(EstacionBraAcce.Nombre1 === undefined ? "" : EstacionBraAcce.Nombre1);
        $("#TxtOpcSelecAcce").data("IdAccesorio", EstacionBraAcce.IdAccesorio === undefined ? "" : EstacionBraAcce.IdAccesorio);
    } else {
        $("#TxtOpcSelecAcce").data("IdAccesorio", TxtIdsec);
    }

    KdoButtonEnable($("#btnAddMEA"), vhb);
};

var fn_GuardarEstacionAccesorio = function () {
    fn_GuardarEstacionAcce(idBraAcce);
};

var fn_GuardarEstacionAcce = function (xIdBrazo) {
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
      
            $("#MEstacionAccesorios").data("kendoWindow").close();
            RequestEndMsg(data, xType);
            maq = fn_GetMaquinas();
            $("#maquinaRevTec").data("maquinaSerigrafia").cargarDataMaquina(maq);
            fn_ObtCntMaxEstaciones();
            fn_ObtCntMaxEstaciones($("#AlertaEstacion"));
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionAccesorios"), false);
            ErrorMsg(data);
        }
    });
};

fn_PWList.push(fn_VistaEstacionAccesorios);
fn_PWConfList.push(fn_VistaEstacionAccesoriosDocuReady);