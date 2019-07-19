
var fn_VistaEstacionAccesorios = function () {
    InicioAcce = true;
    TextBoxEnable($("#TxtOpcSelecAcce"), false);
    KdoButton($("#btnAddMEA"), "check", "Agregar");

    $("#TxtOpcSelecAcce").val($("#TxtOpcSelecAcce").data("name"));
   
};

fn_PWList.push(fn_VistaEstacionAccesorios);