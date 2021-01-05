var Permisos;

var fn_VerifMuesCC = function () {
    KdoButton($("#btnDespla_VerifMue"), "arrows-kpi", "Desplazar/Intercambiar");
    KdoButton($("#btnDuplicar_VerifMue"), "copy", "Duplicar");
    //KdoButton($("#btnAjuste_Mues"), "warning", "Ajuste tinta/marco");
    //KdoButton($("#btnMuest"), "delete", "Limpiar");
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
        height: "auto",
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
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquina_VerifMue"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquina_VerifMue"), false);
    KdoCmbSetValue($("#CmbMaquina_VerifMue"), maq[0].IdMaquina);

   

    //$("#btnMuest").data("kendoButton").bind('click', function () {
    //    ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
    //});

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


    fn_gridAccesoriosEstacion($("#dgAccesorios_VerifMue"));
    $("#dgAccesorios_VerifMue").data("Estacion", "MEstacionAccesoriosVerifMuest"); // guardar nombre vista modal
    $("#dgAccesorios_VerifMue").data("EstacionJS", "EstacionAccesoriosVerifMuest.js"); // guardar nombre archivo JS
    $("#dgAccesorios_VerifMue").data("TipoEstacion", "ACCESORIO"); // guardar nombre archivo JS
    $("#dgAccesorios_VerifMue").data("Formulacion", ""); //guarda el idformulacion


    $("#btnDespla_VerifMue").click(function (e) {
        fn_OpenModalDesplazamiento();

    });

    $("#btnDuplicar_VerifMue").click(function (e) {
        fn_OpenModalDuplicar();

    });

    //$("#btnAjuste_Mues").click(function (e) {
    //    fn_OpenModalEstacionAjuste();

    //});
};

var fn_VerifMueCEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    KdoButtonEnable($("#btnFinOTVerifMue"), vhb);
    //KdoButtonEnable($("#btnMuest"), vhb);
    KdoButtonEnable($("#btnDespla_VerifMue"), vhb);
    //KdoButtonEnable($("#btnAjuste_Mues"), vhb);
    KdoButtonEnable($("#btnDuplicar_VerifMue"), vhb);
    Grid_HabilitaToolbar($("#dgAccesorios_VerifMue"), vhb, vhb, vhb);
};

// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = fn_RTCargarMaquina;
fun_ListDatos.push(EtapaPush);
//Agregar a Lista de ejecucion funcion configurar 

//Agregar a Lista de ejecucion funcion configurar 
fun_List.push(fn_VerifMuesCC);

//var EtapaPush2 = {};
//EtapaPush2.IdEtapa = idEtapaProceso;
//EtapaPush2.FnEtapa = fn_VerifMuesCC;
//fun_ListDatos.push(EtapaPush2);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_VerifMueCEtapa;
fun_ListDatos.push(EtapaPush3);

// activa DropTarget
var EtapaPush4 = {};
EtapaPush4.IdEtapa = idEtapaProceso;
EtapaPush4.FnEtapa = fn_RTActivaDropTarget;
fun_ListDatos.push(EtapaPush4);


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
            //KdoButtonEnable($("#btnFinOT"), false);
            //obneter los datos del arte y trasladar el diseño a la carpeta de catalogos
            //fn_GetArteDis_VM(); se cometarea ya que ahora el FM del catalogo se genera en la solicitud del cliente.
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