let xretIdot = 0;
let xretIdEtapa = 0;
let xretItem = 0;
var dataSource = "";
var fn_InicializaAutorizacion = function (retIdot, retIdEtapa, retItem) {
    xretIdot = retIdot;
    xretIdEtapa = retIdEtapa;
    xretItem = retItem;

    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "OrdenesTrabajosDetallesRetenciones/" + xretIdot + "/" + xretIdEtapa + "/" + xretItem;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }
        },
        pageSize: 10
    });

    $("#pager").kendoPager({
        dataSource: dataSource,
        input: true,
        pageSizes: [10, 20, 50, 100, "all"]
    });

    dataSource.bind("change", function () {
        var view = dataSource.view();
        fn_MostrarNoti(view);
    });
    //1. configurar vista.
    Fn_VistaCambioEstado($("#vCambioEstado"), fn_CambioEstadoBtnClose);
    dataSource.read();
};

var fn_CargarVistaAutorizacion = function (retIdot, retIdEtapa, retItem) {
    xretIdot = retIdot;
    xretIdEtapa = retIdEtapa;
    xretItem = retItem;
    dataSource.read();
    $("#pager").data("kendoPager").page(1);
};
var fn_CambioEstadoBtnClose = function () {
    fn_CargarVistaAutorizacion(xretIdot, xretIdEtapa, xretItem);
};

var fn_MostrarNoti = function (result) {
    var ListRetenciones = $("#ListRetenciones");
    ListRetenciones.children().remove();
    kendo.ui.progress($(".k-dialog"), true);
    if (result.length === 0) {
        ListRetenciones.append('<strong>No hay retenciones para esta orden de trabajo</strong>');
    }

    $.each(result, function (index, elemento) {
        var Reten_Ico = "";
        var Leido = "";
        var StylebgLeido = "";
        switch (elemento.Severidad) {
            case "M":
                Reten_Ico = "TSM-notif-icon TSM-notif-Media";
                break;
            case "L":
                Reten_Ico = "TSM-notif-icon TSM-notif-Baja";
                break;
            case "C":
                Reten_Ico = "TSM-notif-icon TSM-notif-Alta";
                break;
            
            default: Reten_Ico = "";
        }

        Leido = elemento.Estado === "AUTORIZADO" ? "read" : "unread";
        StylebgLeido = elemento.Estado === "AUTORIZADO" ? "" : 'style = "background-color: #DFE3EE;"';
        flagRet = elemento.Estado === "AUTORIZADO" ? true : false;
        ListRetenciones.append(' <div class="list-group-item ' + Leido + '" id="List-' + elemento.IdOrdenTrabajo + '-' + elemento.IdEtapaProceso + '-' + elemento.Item + '-' + elemento.IdRetencion + '" ' + StylebgLeido + ' NotiRead=' + flagRet + ' >' +
            '<div class="list-group-item-figure">' +
            '<div class="' + Reten_Ico + '"> <i class="k-icon k-i-lock"></i> </div>' +
            '</div>' +
            '<div class="list-group-item-body pl-3 pl-md-4">' +
            '<div class="form-row">' +
            '<div class="form-group col-lg-10 ">' +
            '<h4 class="list-group-item-title">' +
            '<span>' + elemento.NombreRet + '</span>' +
            '</h4>' +
            '<p class="list-group-item-text">' + elemento.Descripcion + '<br/><strong>' + elemento.NombreEst + '</strong></p>' +
            '</div>' +
            '<div class="form-group  col-lg-2 text-lg-right">' +
            '<p class="list-group-item-text"></p>' +
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
            '<a onclick="fn_CambioEstado(this)"  id="ret-' + elemento.IdOrdenTrabajo + '-' + elemento.IdEtapaProceso + '-' + elemento.Item + '-' + elemento.IdRetencion + '"  class="dropdown-item">Cambiar Estado</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div> ');

      
        $("#ret-" + elemento.IdOrdenTrabajo + "-" + elemento.IdEtapaProceso + "-" + elemento.Item + "-" + elemento.IdRetencion + "").data("IdOrdenTrabajo", elemento.IdOrdenTrabajo);
        $("#ret-" + elemento.IdOrdenTrabajo + "-" + elemento.IdEtapaProceso + "-" + elemento.Item + "-" + elemento.IdRetencion + "").data("Item", elemento.Item);
        $("#ret-" + elemento.IdOrdenTrabajo + "-" + elemento.IdEtapaProceso + "-" + elemento.Item + "-" + elemento.IdRetencion + "").data("IdEtapaProceso", elemento.IdEtapaProceso);
        $("#ret-" + elemento.IdOrdenTrabajo + "-" + elemento.IdEtapaProceso + "-" + elemento.Item + "-" + elemento.IdRetencion + "").data("IdRetencion", elemento.IdRetencion);
        $("#ret-" + elemento.IdOrdenTrabajo + "-" + elemento.IdEtapaProceso + "-" + elemento.Item + "-" + elemento.IdRetencion + "").data("Estado", elemento.Estado);
     
    });
    kendo.ui.progress($(".k-dialog"), false);
};

var fn_CambioEstado = function (elemento) {
    let IdOrdenTrabajo = $("#" + elemento.id + "").data("IdOrdenTrabajo");
    let IdRetencion = $("#" + elemento.id + "").data("IdRetencion");
    let IdEtapaProceso = $("#" + elemento.id + "").data("IdEtapaProceso");
    let Item = $("#" + elemento.id + "").data("Item");
    let estado = $("#" + elemento.id + "").data("Estado");
        var lstId = {
            IdOrdenTrabajo: IdOrdenTrabajo,
            IdRetencion: IdRetencion,
            IdEtapaProceso: IdEtapaProceso,
            Item: Item

        };
    Fn_VistaCambioEstadoVisualizar("OrdenesTrabajosDetallesRetenciones", estado, TSM_Web_APi + "OrdenesTrabajosDetallesRetenciones/OrdenesTrabajosDetallesRetenciones_CambiarEstado", "", lstId);
};