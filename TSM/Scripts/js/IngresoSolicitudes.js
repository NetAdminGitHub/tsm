
var Permisos;
var vIdUsuario;
var vEjecutivo = "";
$(document).ready(function () {
   
    fn_ConfigVisorEtapas();
});
var fn_ConfigVisorEtapas = function () {
    // Smart Wizard
    $("#smartwizard").smartWizard({
        selected: 0,
        theme:  "arrows",
        transitionEffect: 'fade',
        showStepURLhash: false,
        toolbarSettings: {
            toolbarPosition: 'top',
            toolbarExtraButtons: [
                $('<button></button>').text('Finalizar Solicitud')
                    .prop("id","btnFinSol")
                    .on('click', function () {
                        ConfirmacionMsg("Está seguro que desea finalizar el registro de solicitudes?", function () { return fn_finsolicitud(); });
                    })
            ]

        },
        lang: {
            next: 'Siguiente',
            previous: 'Anterior'
        },
        anchorSettings: {
            markDoneStep: true,
            markAllPreviousStepsAsDone: true,
            removeDoneStepOnNavigateBack: true,
            enableAnchorOnDoneStep: true
           
        }
        //contentURL: '/Solicitudes/getstep'
    });

    // modificar pluging de acuerdo standar TSM 
    KdoButton($("#swbtnnext"), "arrow-double-60-right", "Etapa siguiente");
    KdoButton($("#swbtnprev"), "arrow-double-60-left", "Etapa Previa");
    KdoButton($("#btnFinSol"), "file-config", "Finalizar Solicitud");
    $("#swbtnnext").removeClass("btn btn-secondary");
    $("#swbtnprev").removeClass("btn btn-secondary");
    KdoButtonEnable($("#btnFinSol"), false);

    var fn_finsolicitud = function () {
        $.ajax({
            url: UrlSdp + "/FinalizarSolicitudes/" + vIdSolicitud.toString(),
            type: "Post",
            dataType: "json",
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                fn_GetSolicitudesRequerimientos(vIdSolicitud);
                window.location.href = "/Solicitudes";
            },
            error: function (data) {
                ErrorMsg(data);
            }
        });
    };

    $("#smartwizard").on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
        //return confirm("Do you want to leave the step " + stepNumber + "?");
        if (stepDirection === 'forward' && stepNumber ===0) {

            if (vIdSolicitud === 0) {
                $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos y crear el registro", "error");
                return false;
            }
        }

        if (stepDirection === 'forward' && stepNumber === 1) {

            if (fn_GetPrendaUbicacion(vIdSolicitud) === null) {
                $("#kendoNotificaciones").data("kendoNotification").show("Debe completar y agregar al menos una opción de prenda", "error");
                return false;
            }
            
            if (fn_GetPrendaUbicacionesSinSolicitudDiseno(vIdSolicitud) !== 0) {
               return fn_InsertarSolicitudesDisenosPrendas();
            }

            
        }

        
        return true;
    });

    // Initialize the showStep event
    $("#smartwizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection) {
        if (stepNumber === 0) {
            fn_GetSolicitud();
            KdoButtonEnable($("#btnFinSol"), false);
        }
        if (stepNumber === 1) {
            fn_GetSolictudPrenda();
            KdoButtonEnable($("#btnFinSol"), false);
        }
        if (stepNumber === 2) {
            $("#gridInfPieza").data("kendoGrid").dataSource.read();
            setTimeout(function () {
                Fn_Grid_Resize($("#gridInfPieza"), $(window).height() - "371");
            }, 300);
            KdoButtonEnable($("#btnFinSol"), false);
        }
        if (stepNumber === 3) {
            $("#gridInfTela").data("kendoGrid").dataSource.read();
            setTimeout(function () {
                Fn_Grid_Resize($("#gridInfTela"), $(window).height() - "371");
            }, 300);
            KdoButtonEnable($("#btnFinSol"), false);
        }
        if (stepNumber === 4) {
            $("#gridInfUbi").data("kendoGrid").dataSource.read();
            setTimeout(function () {
                Fn_Grid_Resize($("#gridInfUbi"), $(window).height() - "371");
            }, 300);
            KdoButtonEnable($("#btnFinSol"), false);
        }
        if (stepNumber === 5) {
            $("#gridInfMue").data("kendoGrid").dataSource.read();
            setTimeout(function () {
                Fn_Grid_Resize($("#gridInfMue"), $(window).height() - "371");
            }, 300);
           
            KdoButtonEnable($("#btnFinSol"), true);
        }
    });

    // Initialize the beginReset event
    $("#smartwizard").on("beginReset", function (e) {
        return confirm("Do you want to reset the wizard?");
    });

    // Initialize the endReset event
    $("#smartwizard").on("endReset", function (e) {
        alert("endReset called");
    });

    // Initialize the themeChanged event
    $("#smartwizard").on("themeChanged", function (e, theme) {
        alert("Theme changed. New theme name: " + theme);
    });

 
};

let fn_GetSolicitudesRequerimientos = function (idsol) {
    $.ajax({
        url: UrlSdp + "/GetSolicitudesRequerimientos/" + idsol.toString(),
        type: 'GET',
        dataType: "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            fn_SubirArchivo(data);
        },
        error: function (data) {
            ErrorMsg(data);
        }
    });
};

let fn_SubirArchivo = function (ds) {
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/Solicitudes/SubirArchivoReq",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            RequestEndMsg(result, "Post");
        }
    });
}
fPermisos = function (datos) {
    Permisos = datos;
};
