$(function () {
    var notif = $.connection.notificacionesHub;
    
    notif.client.mostrarNotificaciones = function (asunto, cuerpo, prioridad) {
        $("#kendoNotificaciones").data("kendoNotification").setOptions({
            autoHideAfter: 10000
        });

        $("#kendoNotificaciones").data("kendoNotification").show("<b>" + asunto + "</b><br/>" + "<p>" + cuerpo + "</p>", prioridad == "B" ? "info" : prioridad == "M" ? "success" : "error");

        $("#kendoNotificaciones").data("kendoNotification").setOptions({
            autoHideAfter: 5000
        });

        fn_getNotificaciones();
    };

    notif.client.actualizarVista = function (data) {
        let d = JSON.parse(data);
        if (d.Vista === loadedview && (loadedview !== undefined || loadedview !== "") && idOrdenTrabajo === d.Data.IdOrdenTrabajo && Number(idEtapaProceso) !== d.Data.IdEtapa && d.Data.IdUsuario !== getUser()) {
            fn_AlertActualizaVista(d);
        } 
          //  else {
        //    if (d.Vista === loadedview && (loadedview !== undefined || loadedview !== "") && idOrdenTrabajo === d.Data.IdOrdenTrabajo && Number(idEtapaProceso) !== d.Data.IdEtapa && d.Data.IdUsuario === getUser()) {
        //        $("#" + d.Vista + "_action").trigger("Action");
        //    }
        //}
        
    };

    $.connection.hub.url = TSM_Web_APi.replace("api/", "") + "signalr/hub";
    $.connection.hub.qs = { 'u': Cookies.get("user") };
    $.connection.hub.start().done(function () {
        console.log("Conectado a SignalR: " + $.connection.hub.id);
    })
    .fail(function () { $("#kendoNotificaciones").data("kendoNotification").show('Imposible conectar a WebSocket!', 'error'); });
});


let fn_AlertActualizaVista = function (dt) {
    $("#KendoAlerta").kendoAlert({
        content: '<div class="form-row">' +
            '<div class= "form-group col-lg-4 text-center" >' +
            '<i class="k-icon k-i-warning" style="font-size:120px;"></i>' +
            '</div >' +
            '<div class="form-group col-lg-8">' +
            '<h2>' + dt.Mensaje + '</h2>' +
            '</div>' +
            '</div >',
        title: "warning!",
        height: "auto",
        width: "30%",
        actions: [{
            action: function (e) {
                $("#" + dt.Vista + "_action").trigger("Action");
                return true;
            },
            primary: true
        }],
        messages: {
            okText: "OK"
        }
    }).data("kendoAlert");

  
};
