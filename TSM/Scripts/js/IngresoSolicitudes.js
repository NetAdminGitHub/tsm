
var Permisos;
var vIdUsuario;
var vEjecutivo = "";
var xpNodocSol = "";
$(document).ready(function () {
    fn_ConfigVisorEtapas();

    $("#btnCloseMsg").click(function () {
        window.location.href = "/Solicitudes";
    });

    $("#idcloseMod").click(function () {
        $("#myModal").modal('toggle');
        $("#myModal").modal('hide');
    });
});
var fn_ConfigVisorEtapas = function () {
    // Smart Wizard
    $("#smartwizard").smartWizard({
        selected: 0,
        theme:  "arrows",
        transitionEffect: 'fade',
        showStepURLhash: false,
        //cycleSteps:true,
        toolbarSettings: {
            toolbarPosition: 'top',
            toolbarExtraButtons: [
                $('<button></button>').text('')
                    .prop("id","btnFinSol")
                    .on('click', function () {
                        ConfirmacionMsg("Está seguro que desea finalizar el registro de solicitudes?", function () { return fn_finsolicitud(); });
                    }),

                 $('<button></button>').text('')
                     .prop("id", "bntIrSolicitud")
                    .on('click', function () {
                        window.location.href = "/Solicitudes";
                    })
            ],
            showNextButton: false,
            showPreviousButton: false
        },
        lang: {
            next: 'Siguiente',
            previous: 'Anterior'
        },
        anchorSettings: {
            markDoneStep: true,
            markAllPreviousStepsAsDone: true,
            enableAllAnchors: true
        }
        //contentURL: '/Solicitudes/getstep'
    });

    // modificar pluging de acuerdo standar TSM 
    KdoButton($("#swbtnnext"), "arrow-double-60-right", "Etapa siguiente");
    KdoButton($("#swbtnprev"), "arrow-double-60-left", "Etapa Previa");
    KdoButton($("#btnFinSol"), "file-config", "Finalizar Solicitud");
    KdoButton($("#bntIrSolicitud"), "hyperlink-open-sm", "Regresar a lista de solicitudes");
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
                $("#ModalMsgSol").modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                });
                $("#ModalMsgSol").find('.modal-title').text("Solicitud finalizada");
                $("#ModalMsgSol").find('.modal-body h2').text('Su solicitud ha sido recibida. Numero de solicitud : ' + xpNodocSol.toString());

              
            },
            error: function (data) {
                ErrorMsg(data);
            }
        });
    };

    $("#smartwizard").on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
        //return confirm("Do you want to leave the step " + stepNumber + "?");
        //if (stepDirection === 'forward' && stepNumber ===0) {

        //    if (vIdSolicitud === 0) {
        //        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos y crear el registro", "error");
        //        return false;
        //    }
        //}

        if (stepDirection === 'forward' && stepNumber === 0) {

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
            fn_GetSolictudPrenda();
            KdoButtonEnable($("#btnFinSol"), false);
        }
        if (stepNumber === 1) {
            $("#gridInfUbi").data("kendoGrid").dataSource.read().then(function (e) {
                xpNodocSol = $("#gridInfUbi").data("kendoGrid").dataSource.data()[0].NoDocSol;
            });
            setTimeout(function () {
                Fn_Grid_Resize($("#gridInfUbi"), $(window).height() - "371");
            }, 400);
            KdoButtonEnable($("#btnFinSol"), true);
        }
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
        contentType: "application/json; charset=utf-8"
    });
};

let fn_VerImagenModal = function (idcolImg) {
    var modal = document.getElementById("myModal");
    var img = document.getElementById(idcolImg);
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };
};
let fn_clickImg = function (elemento) {
    fn_VerImagenModal(elemento.id);
};

fPermisos = function (datos) {
    Permisos = datos;
};
