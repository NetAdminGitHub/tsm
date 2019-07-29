var Permisos;

$(document).ready(function () {

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: UrlNh + "/GetByIdUsuario/" + getUser(),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }
        },
        pageSize: 10
    });

    dataSource.read();

    $("#pager").kendoPager({
        dataSource: dataSource,
        input: true,
        pageSizes: [10, 20, 50, 100, "all"]
    });

    dataSource.fetch(function () {
        dataSource.page(1);
        var view = dataSource.view();
        fn_MostrarNoti(view);
    });


    dataSource.bind("change", function () {
        var view = dataSource.view();
        fn_MostrarNoti(view);
    });


    var fn_MostrarNoti = function (result) {
        var ListNoti = $("#ListNoti");
        ListNoti.children().remove();
        $.each(result, function (index, elemento) {
            var Noti_Ico = "";
            var Leido = "";
            var StylebgLeido = "";
            switch (elemento.Prioridad) {
                case "M":
                    Noti_Ico = "TSM-notif-icon TSM-notif-Media";
                    break;
                case "B":
                    Noti_Ico = "TSM-notif-icon TSM-notif-Baja";
                    break;
                case "A":
                    Noti_Ico = "TSM-notif-icon TSM-notif-Alta";
                    break;

                default: Noti_Ico = "";
            }

            Leido = elemento.Leido === true ? "read" : "unread";
            StylebgLeido = elemento.Leido === true ? "" : 'style = "background-color: #DFE3EE;"';

            ListNoti.append(' <div class="list-group-item ' + Leido + '" id="List-' + elemento.IdNotificacionHis + '-' + elemento.Item + '" ' + StylebgLeido + ' NotiRead=' + elemento.Leido + ' >' +
                '<div class="list-group-item-figure">' +
                '<div class="' + Noti_Ico + '"> <i class="k-icon k-i-notification"></i> </div>' +
                '</div>' +
                '<div class="list-group-item-body pl-3 pl-md-4" onclick="fn_MarcarLeido(this)" id="body-' + elemento.IdNotificacionHis + '-' + elemento.Item + '"  >' +
                '<div class="form-row">' +
                '<div class="form-group col-lg-10 ">' +
                '<h4 class="list-group-item-title">' +
                '<span>' + elemento.Asunto + '</span>' +
                '</h4>' +
                '<p class="list-group-item-text">' + elemento.Cuerpo + '</p>' +
                '</div>' +
                '<div class="form-group  col-lg-2 text-lg-right">' +
                '<p class="list-group-item-text">' + elemento.Tiempo + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="list-group-item-figure">' +
                '<div class="dropdown">' +
                '<button class="btn-dropdown" data-toggle="dropdown">' +
                '<i class="k-icon k-i-more-vertical"></i>' +
                '</button>' +
                '<div class="dropdown-arrow"></div>' +
                '<div class="dropdown-menu dropdown-menu-right">' +
                '<a onclick="fn_MarcarLeido(this)"  id="ML-' + elemento.IdNotificacionHis + '-' + elemento.Item + '"  class="dropdown-item" >Marcar como leído</a>' +
                '<a onclick="fn_MarcarNoLeido(this)"    id="MNL-' + elemento.IdNotificacionHis + '-' + elemento.Item + '"  class="dropdown-item">Marcar como no leído</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div> ');

            $("#body-" + elemento.IdNotificacionHis + "-" + elemento.Item + "").data("IdNotificacionHis", elemento.IdNotificacionHis);
            $("#body-" + elemento.IdNotificacionHis + "-" + elemento.Item + "").data("Item", elemento.Item);
            $("#ML-" + elemento.IdNotificacionHis + "-" + elemento.Item + "").data("IdNotificacionHis", elemento.IdNotificacionHis);
            $("#ML-" + elemento.IdNotificacionHis + "-" + elemento.Item + "").data("Item", elemento.Item);
            $("#MNL-" + elemento.IdNotificacionHis + "-" + elemento.Item + "").data("IdNotificacionHis", elemento.IdNotificacionHis);
            $("#MNL-" + elemento.IdNotificacionHis + "-" + elemento.Item + "").data("Item", elemento.Item);
        });
    };

    
    //dataSource.fetch(function () {
    //    alert("as");
    //});
});
var fn_MarcarLeido = function (elemento) {
    let vleido = 0;
    let IdNoHis = $("#" + elemento.id + "").data("IdNotificacionHis");
    let ItemNoHis = $("#" + elemento.id + "").data("Item");
    if (elemento.className === "dropdown-item")
    {
        fn_Marcar(IdNoHis, ItemNoHis,true);
    } else
    {
        if ($("#List-" + IdNoHis.toString() + "-" + ItemNoHis.toString() + "")[0].attributes.notiread.value === "false") {
            fn_Marcar(IdNoHis, ItemNoHis, true);
        }
    }
};
var fn_MarcarNoLeido = function (elemento) {
    let IdNoHis = $("#" + elemento.id + "").data("IdNotificacionHis");
    let ItemNoHis = $("#" + elemento.id + "").data("Item");
    fn_Marcar(IdNoHis, ItemNoHis, false);
};
var fn_Marcar = function (id, item,leido) {
 
    kendo.ui.progress($("#pager"), true);
    $.ajax({
        url: UrlNhD + "/UpdNotificacionHisMarcar/" + id.toString() + "/" + item.toString() + "/" + leido,
        type: "Post",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (leido === false) {
                $("#List-" + data[0].IdNotificacionHis + "-" + data[0].Item + "").removeClass("read");
                $("#List-" + data[0].IdNotificacionHis + "-" + data[0].Item + "").addClass("unread");
                $("#List-" + data[0].IdNotificacionHis + "-" + data[0].Item + "").attr("style", "background-color: #DFE3EE;");
            } else {
                $("#List-" + data[0].IdNotificacionHis + "-" + data[0].Item + "").removeClass("unread");
                $("#List-" + data[0].IdNotificacionHis + "-" + data[0].Item + "").addClass("read");
                $("#List-" + data[0].IdNotificacionHis + "-" + data[0].Item + "").attr("style", '');
            }

            $("#List-" + data[0].IdNotificacionHis + "").attr("NotiRead", leido);
       
            RequestEndMsg(data, "Post");
            kendo.ui.progress($("#pager"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#pager"), false);
            ErrorMsg(data);
        }
    });
};
fPermisos = function (datos) {
    Permisos = datos;
};