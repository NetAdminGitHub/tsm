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
        alert(data);
    };

    $.connection.hub.url = TSM_Web_APi.replace("api/", "") + "signalr/hub";
    $.connection.hub.qs = { 'u': Cookies.get("user") };
    $.connection.hub.start().done(function () {
        console.log("Conectado a SignalR: " + $.connection.hub.id);
    })
    .fail(function () { $("#kendoNotificaciones").data("kendoNotification").show('Imposible conectar a WebSocket!', 'error'); });
});