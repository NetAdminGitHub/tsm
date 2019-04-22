
var fn_MostrarEtapasProceso = function (DivIdElement,IdModulo, forma) {

    var UrlEP = TSM_Web_APi + "EtapasProcesos";
    $.ajax({
        url: UrlEP + "/GetByModulo/" + IdModulo,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null && respuesta.length !== 0) {
                CrearEtapasProcesosModulo(DivIdElement, respuesta, forma);
            }
            RequestEndMsg(respuesta, "Get");
        }
    });  
}