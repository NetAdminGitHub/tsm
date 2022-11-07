"use strict"
var Permisos;

let idPlanta = 0;
let idMarca = 0;

const NombresControladores = ["CrearEmbalaje", "PackingList", "PedidoVenta", "Factura", "DevolucionDM", "NotaRemision"];
const NombresVistas = ["GestionOrdenDespacho", "Embalaje", "ListaEmpaque", "PedidoVenta", "Facturacion", "DeclaracionMercancia", "NotaRemision"];
let permisos = [];

let perEmb = true;
let perPL = true;
let perPV = true;
let perFac = true;
let perDM = true;
let perNR = true;
let EtapaActual;
let NombreEtapaActual;

$(document).ready(function () {

    //1. defincion de la modal
    Fn_VistaCambioEstado($("#vCambioEstado"), function () { return fn_CloseCmb(); });

    KdoButton($("#btnSolicitarDespacho"), "plus-outline", "Solicitar Despacho");
    KdoButtonEnable($("#btnSolicitarDespacho"), false);

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    KdoComboBoxbyData($("#cmbMarca"), "[]", "Nombre2", "IdMarca", "Seleccione una Marca");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");

    NombresControladores.forEach(function (item, index, arr) {

        $.ajax({
            url: UrlMRSeguridad + "/GetMenusRolesSeguridad",
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({ IdUsuario: getUser(), Url: item }),
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (respuesta) {
                permisos.push(respuesta);
            }
        });

    });

    if (permisos[0] == "" || permisos[0] == null || permisos[0] == undefined) {
        perEmb = false;
    }
    if (permisos[1] == "" || permisos[1] == null || permisos[1] == undefined) {
        perPL = false;
    }
    if (permisos[2] == "" || permisos[2] == null || permisos[2] == undefined) {
        perPV = false;
    }
    if (permisos[3] == "" || permisos[3] == null || permisos[3] == undefined) {
        perFac = false;
    }
    if (permisos[4] == "" || permisos[4] == null || permisos[4] == undefined) {
        perDM = false;
    }
    if (permisos[5] == "" || permisos[5] == null || permisos[5] == undefined) {
        perNR = false;
    }

    if (idCliente !== 0) {
        KdoButtonEnable($("#btnSolicitarDespacho"), true);

        $("#cmbCliente").data("kendoComboBox").value(idCliente);
        $("#cmbCliente").data("kendoComboBox").trigger("change");

        let dsm = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () {
                        return TSM_Web_APi +
                            `ClientesMarcas/GetByCliente/${idCliente === null ? 0 : idCliente}`
                    },
                    contentType: "application/json; charset=utf-8"
                }
            }
        });
        $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);
    }

    let dataSourceDespacho = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + `DespachosMercancias/GetOrdenesDespachar/${idCliente}/${idPlanta}/${idMarca}`
                },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdDespachoMercancia",
                fields: {
                    IdDespachoMercancia: { type: "number" },
                    FechaSolicitud: { type: "date" },
                    UsuarioSolicitante: { type: "string" },
                    CantidadCortes: { type: "number" },
                    cantidadPiezas: { type: "number" },
                    FechaMod: { type: "date" },
                    FechaEntrega: { type: "date" },
                    Estado: { type: "string" },
                    Servicio: { type: "string" },
                    Progreso: { type: "number" }
                }
            }
        }
    });

    $("#gridDespachos").kendoGrid({
        dataBound: function (e) {
            let grid = this;

            grid.table.find("tr").each(function () {
                let dataItem = grid.dataItem(this);

                //Configuracion de grafica porcentaje
                $(this).find(".progress").kendoSparkline({
                    legend: {
                        visible: false
                    },
                    data: [dataItem.Progreso],
                    type: "bar",
                    seriesColors: ["#21C998"],
                    chartArea: {
                        margin: 0,
                        width: 220,
                        background: "transparent"
                    },
                    seriesDefaults: {
                        labels: {
                            visible: true,
                            format: '{0:n2}%',
                            background: 'none'
                        }
                    },
                    categoryAxis: {
                        majorGridLines: {
                            visible: false
                        },
                        majorTicks: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        type: "numeric",
                        min: 0,
                        max: 140,
                        visible: false,
                        labels: {
                            visible: false
                        },
                        minorTicks: { visible: false },
                        majorGridLines: { visible: false }
                    },
                    tooltip: {
                        visible: false
                    }
                });

                kendo.bind($(this), dataItem);

                let etaEmb;
                let etaPL;
                let etaPV;
                let etaFac;
                let etaDM;
                let etaNR;

                let absEmb = false;
                let absPL = false;
                let absPV = false;
                let absFac = false;
                let absDM = false;
                let absNR = false;

                let idOD = dataItem.IdDespachoMercancia;

                $.ajax({
                    url: TSM_Web_APi + "/DespachosMercancias/GetEtapaOD/" + idOD,
                    dataType: 'json',
                    type: 'GET',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (respuesta) {

                        if (jQuery.isEmptyObject(respuesta) || respuesta == null || respuesta == undefined || respuesta.Etapa == NombresVistas[0]) {
                            etaEmb = false;
                            etaPL = false;
                            etaPV = false;
                            etaFac = false;
                            etaDM = false;
                            etaNR = false;
                        }
                        else if (respuesta.Etapa == NombresVistas[1]) {
                            etaEmb = true;
                            etaPL = false;
                            etaPV = false;
                            etaFac = false;
                            etaDM = false;
                            etaNR = false;
                        }
                        else if (respuesta.Etapa == NombresVistas[2]) {
                            etaEmb = false;
                            etaPL = true;
                            etaPV = false;
                            etaFac = false;
                            etaDM = false;
                            etaNR = false;
                        }
                        else if (respuesta.Etapa == NombresVistas[3]) {
                            etaEmb = false;
                            etaPL = false;
                            etaPV = true;
                            etaFac = false;
                            etaDM = false;
                            etaNR = false;
                        }
                        else if (respuesta.Etapa == NombresVistas[4]) {
                            etaEmb = false;
                            etaPL = false;
                            etaPV = false;
                            etaFac = true;
                            etaDM = false;
                            etaNR = false;
                        }
                        else if (respuesta.Etapa == NombresVistas[5]) {
                            etaEmb = false;
                            etaPL = false;
                            etaPV = false;
                            etaFac = false;
                            etaDM = true;
                            etaNR = false;
                        }
                        else if (respuesta.Etapa == NombresVistas[6]) {
                            etaEmb = false;
                            etaPL = false;
                            etaPV = false;
                            etaFac = false;
                            etaDM = false;
                            etaNR = true;
                        }

                        if (perEmb == true && etaEmb == true) {
                            absEmb = true;
                        }
                        if (perPL == true && etaPL == true) {
                            absPL = true;
                        }
                        if (perPV == true && etaPV == true) {
                            absPV = true;
                        }
                        if (perFac == true && etaFac == true) {
                            absFac = true;
                        }
                        if (perDM == true && etaDM == true) {
                            absDM = true;
                        }
                        if (perNR == true && etaNR == true) {
                            absNR = true;
                        }
                    }
                });

                $("#opcOD" + idOD).kendoSplitButton({
                    items: [
                        {
                            id: "opcEmb" + idOD, text: "Embalaje", icon: "plus-outline", click: function () {
                                window.location.href = '/CrearEmbalaje/' + idOD ;
                            }, enabled: absEmb
                        },
                        {
                            id: "opcPL" + idOD, text: "Lista de Empaque", icon: "plus-outline", click: function () {
                                window.location.href = '/PackingList/' + idOD;
                            }, enabled: absPL
                        },
                        {
                            id: "opcPV" + idOD, text: "Pedido de Venta", icon: "plus-outline", click: function () {
                                window.location.href = '/PedidoVenta/' + idOD;
                            }, enabled: absPV
                        },
                        {
                            id: "opcFac" + idOD, text: "Factura", icon: "plus-outline", click: function () {
                                window.location.href = '/Factura/' + idOD;
                            }, enabled: absFac
                        },
                        {
                            id: "opcDM" + idOD, text: "Devolución DM", icon: "plus-outline", click: function () {
                                window.location.href = '/DevolucionDM/' + idOD;
                            }, enabled: absDM
                        },
                        {
                            id: "opcNR" + idOD, text: "Nota de Remisión", icon: "plus-outline", click: function () {
                                window.location.href = '/NotaRemision/' + idOD;
                            }, enabled: absNR
                        }
                    ]
                });

                

            });
        },
        columns: [
            { field: "IdDespachoMercancia", title: "# Despacho" },
            { field: "FechaSolicitud", title: "Fecha solicitud", format: "{0: dd/MM/yyyy}" },
            { field: "UsuarioSolicitante", title: "Solicitante" },
            { field: "CantidadCortes", title: "Cantidad Cortes" },
            { field: "cantidadPiezas", title: "Cantidad" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss}" },
            { field: "Servicio", title: "Servicio" },
            { field: "Estado", title: "Estado" },
            {
                field: "Progreso",
                title: "Progreso",
                template: "<div id='progressChart_#= IdDespachoMercancia#' class='progress'></div>",
                format: "{0:n2}",
                width: 220
            },
            { template: "<div class='opcOD' id='opcOD\#=data.IdDespachoMercancia#\'>Etapas</div>" },
            {
                field: "btnStatus",
                title: "&nbsp;",
                command: {
                    name: "btnStatus",
                    iconClass: "k-icon k-i-eye m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                        let dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                        let strjson = {
                            config: [{
                                Div: "vMod_statusOrdenDespacho",
                                Vista: "~/Views/ConsultaDespacho/_statusOrdenDespacho.cshtml",
                                Js: "statusOrdenDespacho.js",
                                Titulo: `Estatus de Orden de Despacho`,
                                Height: "60%",
                                Width: "50%",
                                MinWidth: "30%"
                            }],
                            Param: {
                                pIdDespachoMercancia: dataItem.IdDespachoMercancia,
                                pvModal: "vCambiarEstado",
                                pIdCliente: KdoCmbGetValue($("#cmbCliente"))
                            },
                            fn: { fnclose: "fn_RefreshGrid", fnLoad: "fn_Ini_StatusOrdenDespacho", fnReg: "fn_Reg_StatusOrdenDespacho", fnActi: "" }
                        };

                        fn_GenLoadModalWindow(strjson);

                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            },
            {//Opcion para modificar/editar despacho
                field: "btnEdit",
                title: "&nbsp;",
                command: {
                    name: "btnEdit",
                    iconClass: "k-icon k-i-edit m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        let fechaEntrega = dataItem.FechaEntrega;
                        let fecha = fechaEntrega.getFullYear() + "-" + (fechaEntrega.getMonth() + 1) + "-" + fechaEntrega.getDate();
                        let planta = dataItem.IdPlanta;
                        window.location.href = `/OrdenDespacho/Edit/${KdoCmbGetValue($("#cmbCliente"))}/${dataItem.IdDespachoMercancia}/${fecha}/${planta}/${dataItem.NoDocumento}`;
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            },
            {//Boton para cambio de estado de las ordenes de despacho propuesta
                field: "btnEtapa",
                title: "&nbsp;",
                command: {
                    name: "btnEtapa",
                    iconClass: "k-icon k-i-gear m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                        let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        let IdOD = dataItem.IdDespachoMercancia;

                        $.ajax({
                            url: TSM_Web_APi + "DespachosMercancias/GetEtapaOD/" + IdOD,
                            dataType: 'json',
                            type: 'GET',
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (respuesta) {
                                EtapaActual = respuesta.IdEtapaProceso;
                                NombreEtapaActual = respuesta.NombreEtapa;
                            }
                        });

                        let strjson = {
                            config: [{
                                Div: "vCambioEtapa",
                                Vista: "~/Views/Shared/_CambioEtapa.cshtml",
                                Js: "CambioEtapa.js",
                                Titulo: "Cambio Etapa",
                                Width: "20%",
                                MinWidth: "20%",
                                Height: "45%"
                            }],
                            Param: { IdEtapaActual: EtapaActual, IdDespachoMercancia: IdOD, NombreEtapaActual: NombreEtapaActual },
                            fn: { fnclose: "", fnLoad: "fn_Ini_ConsultaEtapa", fnReg: "fn_con_ConsultaEtapa", fnActi: "" }
                        };

                        fn_GenLoadModalWindow(strjson);
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDespachos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, false, redimensionable.Si, 700);
    SetGrid_CRUD_ToolbarTop($("#gridDespachos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDespachos").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDespachos").data("kendoGrid"), dataSourceDespacho);

    $("#gridDespachos").kendoTooltip({
        filter: ".k-grid-btnGenerarEmbalaje",
        content: function (e) {
            return "Generar Embalaje";
        }
    });

    $("#gridDespachos").kendoTooltip({
        filter: ".k-grid-btnStatus",
        content: function (e) {
            return "Estatus de Orden de Despacho";
        }
    });

    $("#gridDespachos").kendoTooltip({
        filter: ".k-grid-btnEdit",
        content: function (e) {
            return "Editar";
        }
    });

    $("#gridDespachos").kendoTooltip({
        filter: ".k-grid-btnEtapa",
        content: function (e) {
            return "Cambio de Etapa";
        }
    });

    $("#gridDespachos").data("kendoGrid").dataSource.read();

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        idCliente = this.value() === "" ? 0 : this.value();

        if (idCliente > 0)
            KdoButtonEnable($("#btnSolicitarDespacho"), true);
        else
            KdoButtonEnable($("#btnSolicitarDespacho"), false);

        let dsm = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + `ClientesMarcas/GetByCliente/${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente"))}` },
                    contentType: "application/json; charset=utf-8"
                }
            }
        });

        idMarca = 0;
        idPlanta = 0;

        $("#cmbMarca").data("kendoComboBox").value("");
        $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);

        $("#gridDespachos").data("kendoGrid").dataSource.read();
    });

    $("#cmbMarca").data("kendoComboBox").bind("change", function () {
        idMarca = this.value() === "" ? 0 : this.value();
        $("#gridDespachos").data("kendoGrid").dataSource.read();
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        idPlanta = this.value() === "" ? 0 : this.value();
        $("#gridDespachos").data("kendoGrid").dataSource.read();
    });

    $("#btnSolicitarDespacho").click(function () {
        window.location.href = `/OrdenDespacho/${KdoCmbGetValue($("#cmbCliente"))}`;
    });
});

var fn_RefreshGrid = () => {
    $("#gridDespachos").data("kendoGrid").dataSource.read();
};

const fn_CloseCmb = () => {
    $("#gridDespachos").data("kendoGrid").dataSource.read();
};

fPermisos = function (datos) {
    Permisos = datos;
}



