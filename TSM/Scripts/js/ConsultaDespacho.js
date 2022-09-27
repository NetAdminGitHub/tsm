"use strict"
var Permisos;

//let idCliente = 0;
let idPlanta = 0;
let idMarca = 0;

$(document).ready(function () {

    //1. defincion de la modal
    Fn_VistaCambioEstado($("#vCambioEstado"), function () { return fn_CloseCmb(); });

    KdoButton($("#btnSolicitarDespacho"), "plus-outline", "Solicitar Despacho");
    KdoButtonEnable($("#btnSolicitarDespacho"), false);

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    KdoComboBoxbyData($("#cmbMarca"), "[]", "Nombre2", "IdMarca", "Seleccione una Marca");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione Planta");

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
            {
                field: "btnGenerarEmbalaje",
                title: "&nbsp;",
                command: {
                    name: "btnGenerarEmbalaje",
                    iconClass: "k-icon k-i-play m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        let dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                        let jsonData = {
                            IdDespachoEmbalajeMercancia: 0,
                            IdUsuario: getUser(),
                            IdPlanta: 0,
                            IdCliente: KdoCmbGetValue($("#cmbCliente")),
                            IdDespachoMercancia: dataItem.IdDespachoMercancia
                        }

                        kendo.ui.progress($(".k-dialog"), true);
                        $.ajax({
                            url: TSM_Web_APi + "EmbalajesMercancias/GenerarEmbalajeMercancia",
                            method: "POST",
                            dataType: "json",
                            data: JSON.stringify(jsonData),
                            contentType: "application/json; charset=utf-8",
                            success: function (resultado) {
                                window.location.href = `/CrearEmbalaje/${KdoCmbGetValue($("#cmbCliente"))}/${dataItem.IdDespachoMercancia}`;
                            },
                            error: function (data) {
                                ErrorMsg(data);
                                kendo.ui.progress($(".k-dialog"), false);
                            }
                        });

                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            },
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
                field: "btnEstado",
                title: "&nbsp;",
                command: {
                    name: "btnEstado",
                    iconClass: "k-icon k-i-gear m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        Fn_VistaCambioEstadoMostrar("DespachosMercancias", dataItem.Estado, TSM_Web_APi + "DespachosMercancias/CambiarEstadoOrdenDespacho", "", dataItem.IdDespachoMercancia, undefined, function () { return fn_RefreshGrid(); }, false);
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
        filter: ".k-grid-btnEstado",
        content: function (e) {
            return "Cambio de Estado";
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



