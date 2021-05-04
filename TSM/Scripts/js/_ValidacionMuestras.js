var Permisos;

var fn_VerifMuesCC = function () {
    KdoButton($("#btnAjuste_Valid"), "warning", "Ajuste tinta/marco");
    KdoButton($("#btnCPesosVerifMues"), "search", "Consultar");
    KdoButton($("#btnFinOTVerifMue"), "gear", "Finalizar OT");
    KdoButton($("#btnAcepFinVerifMue"), "check", "Finalizar");
    $("#dFechaFinVerifMue").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaFinVerifMue").data("kendoDatePicker").value(Fhoy());
    $("#MbtnFinVerifMue").kendoDialog({
        height: "auto",
        width: "20%",
        title: "Finalizar Orden de Trabajo",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });

    $("#MbtCVerifMue").kendoDialog({
        height: "70%",
        width: "40%",
        title: "Detalle de pesos en muestra",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    //kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's')
    // colocar grid para arrastre
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    //FINALIZAR OT
    let ValidFrmFinVerifMue = $("#FrmFinVerifMue").kendoValidator({
        rules: {
            FM: function (input) {
                if (input.is("[name='dFechaFinVerifMue']")) {
                    return kendo.toString(kendo.parseDate($("#dFechaFinVerifMue").val()), 's') !== null;
                }
                return true;
            }

        },
        messages: {
            FM: "requerido"
        }
    }).data("kendoValidator");

    $("#btnFinOTVerifMue").click(function () {
        $("#MbtnFinVerifMue").data("kendoDialog").open();
        $("#dFechaFinVerifMue").data("kendoDatePicker").element.focus();
    });

    $("#btnCPesosVerifMues").click(function () {
        $("#MbtCVerifMue").data("kendoDialog").open();
        $("#gridEstacionPesoVerifMue").data("kendoGrid").dataSource.read();
        $("#gridEstacionPesoVerifMue").data("kendoGrid").refresh();
    });

    $("#btnAcepFinVerifMue").click(function () {
        if (ValidFrmFinVerifMue.validate()) { fn_FinOT_VM(); }
    });
    fn_ConsultaPesosVerifMue($("#gridEstacionPesoVerifMue"));



    $("#maquinaValidacionMues").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                    maq = fn_GetMaquinas();
                    $("#maquinaValidacionMues").data("maquinaSerigrafia").cargarDataMaquina(maq);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    var dataCopy = e.detail[0];
                    fn_DuplicarBrazoMaquina($("#maquinaValidacionMues").data("maquinaSerigrafia").maquina, dataCopy);
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    //$("#maquinaValidacionMues").data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio);
                    fn_TrasladarEstacion(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio, $("#maquinaValidacionMues"));
                },
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaValidacionMues").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaValidacionMues"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                        fn_EliminarEstacion(maq[0].IdSeteo, e, $("#maquinaValidacionMues"));
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaValidacionMues").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaValidacionMues"), 1);


                }
            }
        },
        tipoMaquina:
        {
            mostrar: true,
            eventos: {
                onChange: elementoSeleccionado_ValidMues
            }
        },
        accesorios: { mostrar: true }
    });
    fn_GetFormasMaquina($("#maquinaValidacionMues").data("maquinaSerigrafia"));
    $("#maquinaValidacionMues").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
    fn_Accesorios($("#maquinaValidacionMues").data("maquinaSerigrafia"));

    //$("#maquina").data("maquinaSerigrafia").maquinaVue.readOnly(true);
    $("#btnAjuste_Valid").click(function (e) {
        //fn_OpenModalEstacionAjuste();
        fn_SolicitarIngresoAjuste("vSoliIngresoAjuste", idOrdenTrabajo, idEtapaProceso, $("#txtItem").val(), maq[0].IdSeteo, idTipoOrdenTrabajo.toString());

    });


};

var fn_VerifMueCEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnFinOTVerifMue"), vhb);
    $("#maquinaValidacionMues").data("maquinaSerigrafia").activarSoloLectura(!vhb);
};

var elementoSeleccionado_ValidMues = function (e) {
    if (Number(maq[0].IdFormaMaquina) !== Number(e.detail[0].IdFormaMaquina)) {
        if ($("#maquinaValidacionMues").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina) === "OK") {
            fn_UpdFormaRevTec(e.detail[0].CantidadEstaciones, e.detail[0].IdFormaMaquina, e.detail[0].NomFiguraMaquina, $("#maquinaValidacionMues"), 0);
        }
    } 
};


//Agregar a Lista de ejecucion funcion configurar 
fun_List.push(fn_VerifMuesCC);
//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_VerifMueCEtapa;
fun_ListDatos.push(EtapaPush3);

// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = function () { return $("#maquinaValidacionMues").data("maquinaSerigrafia").cargarDataMaquina(maq); };
fun_ListDatos.push(EtapaPush);

let fn_FinOT_VM = function () {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/OrdenesTrabajosFinalizar",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            IdOrdenTrabajo: $("#txtIdOrdenTrabajo").val(),
            IdEtapaProcesoFinalizar: idEtapaProceso,
            FechaFinMuestra: kendo.toString(kendo.parseDate($("#dFechaFinVerifMue").val()), 's')
        }),
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            $("#MbtnFinVerifMue").data("kendoDialog").close();
            CargarInfoEtapa(false);
            
        },
        error: function (data) {
            ErrorMsg(data);
            kendo.ui.progress($(".k-dialog"), false);
            //KdoButtonEnable($("#btnFinOT"), true);
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });

};

let fn_GetArteDis_VM = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "Artes/GetArteByIdReq/" + $("#txtIdRequerimiento").val(),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                var dsres = [{
                    NoDocumento: xvNodocReq,
                    NoReferencia: respuesta.NoReferencia,
                    NombreArchivo: respuesta.NombreArchivo
                }];
                SubirArchivoCatalogo_VM(dsres);

            }
            CargarInfoEtapa(false);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let SubirArchivoCatalogo_VM = function (ds) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/RequerimientoDesarrollos/SubirArchivoCatalogo",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });
};
var fn_ConsultaPesosVerifMue = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteo/" + maq[0].IdSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdEstacion",
                fields: {
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    },
                    Peso: { type: "number" }
                }
            }
        },
        aggregate: [
            { field: "Peso", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS

        columns: [
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50, footerTemplate: "Totales" },
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120 },
            { field: "Peso", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "999999999999.9999", "n2", 2], format: "{0:n2}", footerTemplate: "#: data.Peso ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "PesoUnidadMedida", title: "Unidad", minResizableWidth: 100 }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 550);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow4 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow4);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow4);
    });
};