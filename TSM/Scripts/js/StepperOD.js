$(document).ready(function () {

    var etapas;
    var objSteps = '$("#stepperOD").kendoStepper({linear: true,steps: [';

    $.ajax({
        dataType: 'json',
        url: TSM_Web_APi + 'EtapasProcesos/GetbyTabla/Bodega¿DespachosMercancias',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            etapas = result;
            //console.log(etapas);
            etapas.forEach(function (item, index, arr) {
                let ico="";
                if (item.Icono === null) { ico = "image" } else { ico = item.Icono.slice(7); }
                objSteps = objSteps + '{label: "' + item.Nombre + '",icon: "' + ico + '", successIcon: "check" },';
            });

            objSteps = objSteps.slice(0, -1);

            objSteps = objSteps + '] }); ';

            eval(objSteps);

        }
    });

});