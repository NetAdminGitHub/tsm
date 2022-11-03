"use strict"
var Permisos;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    KdoComboBoxbyData($("#cmbMarca"), "[]", "Nombre2", "IdMarca", "Seleccione una Marca");
    Kendo_CmbFiltrarGrid($("#cmbPlanta"), TSM_Web_APi + "Plantas", "Nombre", "IdPlanta", "Seleccione la Planta");
    Kendo_CmbFiltrarGrid($("#cmbEtapa"), TSM_Web_APi + "EtapasProcesosMacro", "Nombre", "IdEtapaProcesoMacro", "Seleccione la etapa");
    Kendo_CmbFiltrarGrid($("#cmbServicio"), TSM_Web_APi + "Servicios", "Nombre", "IdServicio", "Seleccione el servicio");
    $("#cmbFm").mlcFmCatalogo();

    if (idCliente !== 0) {
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

    if (FM !== '') {
        $("#cmbFm").data("kendoMultiColumnComboBox").value(FM);
        $("#cmbFm").data("kendoMultiColumnComboBox").trigger("change");
    }

    if (idMarca !== 0) {
        $("#cmbMarca").data("kendoComboBox").value(idMarca);
        $("#cmbMarca").data("kendoComboBox").trigger("change");
    }

    if (idPlanta !== 0) {
        $("#cmbPlanta").data("kendoComboBox").value(idPlanta);
        $("#cmbPlanta").data("kendoComboBox").trigger("change");
    }

    if (idEtapaProcesoMacro !== 0) {
        $("#cmbEtapa").data("kendoComboBox").value(idEtapaProcesoMacro);
        $("#cmbEtapa").data("kendoComboBox").trigger("change");
    }

    if (idServicio !== 0) {
        $("#cmbServicio").data("kendoComboBox").value(idServicio);
        $("#cmbServicio").data("kendoComboBox").trigger("change");
    }

    KdoButton($("#btnGenerarExcel"), "download", "Descargar Data");

    let dataSourceMacro = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify({
                        IdCliente: idCatalogoDiseno > 0 ? idCliente : 0,
                        IdMarca: idMarca,
                        IdPlanta: idPlanta,
                        IdEtapaProcesoMacro: idEtapaProcesoMacro,
                        IdCatalogoDiseno: idCatalogoDiseno,
                        IdServicio: idServicio
                    }),
                    url: TSM_Web_APi + "HojasBandeos/ConsultaMacroEtapas/",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    FM: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    Nombre: { type: "string" },
                    Corte: { type: "string" },
                    ColorTela: { type: "string" },
                    PartePrenda: { type: "string" },
                    Prenda: { type: "string" },
                    Tallas: { type: "string" },
                    CantidadHB: { type: "number" },
                    Segundas: { type: "number" },
                    MacroEtapa: { type: "string" },
                    FechaIngreso: { type: "date" },
                    DiasTransito: { type: "number" },
                    Planta: { type: "string" }
                }
            }
        }
    });

    $("#gridCortes").kendoGrid({
        excel: {
            allPages: true,
            fileName: "Consulta de Corte Macro.xlsx"
        },
        columns: [
            { field: "IdHojaBandeo", title: "Id. HojaBandeo", hidden: true },
            { field: "FM", title: "FM/RD" },
            { field: "EstiloDiseno", title: "Estilo" },
            { field: "Nombre", title: "Diseño" },
            { field: "Corte", title: "Corte" },
            { field: "ColorTela", title: "Color Tela" },
            { field: "PartePrenda", title: "Parte" },
            { field: "Prenda", title: "Producto" },
            { field: "Tallas", title: "Tallas" },
            { field: "CantidadHB", title: "Cantidad" },
            { field: "Segundas", title: "Segundas" },
            {
                field: "MacroEtapa", title: "Etapa",
                template: `# if(MacroEtapa != null) { #
                                <span id='Etapa_#=IdHojaBandeo#' class='badge
                                    #if(MacroEtapa == 'SIN ESTAMPAR') { #badge-sin-estampar# }
                                    else if(MacroEtapa == 'EN PRODUCCIÓN') { #badge-en-produccion# }
                                    else if(MacroEtapa == 'ESTAMPADO') { #badge-estampado# }
                                    else if(MacroEtapa == 'EN PREPARACIÓN') { #badge-en-preparacion# }
                                    else if(MacroEtapa == 'ENVIO') { #badge-envio# }
                                    else { #badge-default# } # f-12'
                                >#=MacroEtapa#</span> #
                            } #`,
                attributes: {
                    style: "text-align: center"
                }
            },
            { field: "Planta", title: "Planta" },
            { field: "FechaIngreso", title: "Ingreso", format: "{0: dd/MM/yyyy HH:mm:ss}" },
            {
                field: "DiasTransito", title: "Días Tránsito",
                template: `<span id='DiaTransito_#=IdHojaBandeo#' class='badge 
                                #if(DiasTransito < 5) { #badge-dia-transito-1# }
                                else if(DiasTransito >= 5 && DiasTransito <= 6 ) { #badge-dia-transito-2# }
                                else if(DiasTransito > 6) { #badge-dia-transito-3# } # f-12'
                            >#=DiasTransito#</span>`,
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: "btnDetalle",
                title: "&nbsp;",
                command: {
                    name: "btnDetalle",
                    iconClass: "k-icon k-i-eye m-0",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        window.location = window.location.origin + "/ConsultaCorteMicro/"
                            + `${dataItem.IdHojaBandeo}/`
                            + `${idCliente}/`
                            + `${idMarca}/`
                            + `${idPlanta}/`
                            + `${idEtapaProcesoMacro}/`
                            + `${idCatalogoDiseno}/`
                            + `${idServicio}/`
                            + `${FM}/`;
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
    SetGrid($("#gridCortes").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridCortes").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridCortes").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridCortes").data("kendoGrid"), dataSourceMacro);

    $("#gridCortes").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });

    let selectedRows = [];
    $("#gridCortes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCortes"), selectedRows);
    });

    $("#gridCortes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCortes"), selectedRows);
    });

    $("#gridCortes").data("kendoGrid").dataSource.read();

    $("#btnGenerarExcel").data("kendoButton").bind("click", function (e) {
        const grid = $("#gridCortes").data("kendoGrid");
        grid.saveAsExcel();
    });

    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        idCliente = this.value() === "" ? 0 : this.value();

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
        idEtapaProcesoMacro = 0;
        idCatalogoDiseno = 0;
        FM = '';
        idServicio = 0;

        $("#cmbFm").data("kendoMultiColumnComboBox").value("");
        $("#cmbFm").data("kendoMultiColumnComboBox").dataSource.read();
        $("#cmbMarca").data("kendoComboBox").value("");
        $("#cmbMarca").data("kendoComboBox").setDataSource(dsm);
        $("#cmbPlanta").data("kendoComboBox").value("");
        $("#cmbEtapa").data("kendoComboBox").value("");
        $("#cmbServicio").data("kendoComboBox").value("");

        $("#gridCortes").data("kendoGrid").dataSource.read();
    });

    $("#cmbFm").data("kendoMultiColumnComboBox").bind("change", function () {
        idCatalogoDiseno = this.value() === "" ? 0 : this.value();
        FM = this.text();
        $("#gridCortes").data("kendoGrid").dataSource.read();
    });

    $("#cmbMarca").data("kendoComboBox").bind("change", function () {
        idMarca = this.value() === "" ? 0 : this.value();
        $("#gridCortes").data("kendoGrid").dataSource.read();
    });

    $("#cmbPlanta").data("kendoComboBox").bind("change", function () {
        idPlanta = this.value() === "" ? 0 : this.value();
        $("#gridCortes").data("kendoGrid").dataSource.read();
    });

    $("#cmbEtapa").data("kendoComboBox").bind("change", function () {
        idEtapaProcesoMacro = this.value() === "" ? 0 : this.value();
        $("#gridCortes").data("kendoGrid").dataSource.read();
    });

    $("#cmbServicio").data("kendoComboBox").bind("change", function () {
        idServicio = this.value() === "" ? 0 : this.value();
        $("#gridCortes").data("kendoGrid").dataSource.read();
    });

});

fPermisos = (datos) => {
    Permisos = datos;
};


$.fn.extend({
    mlcFmCatalogo: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "CatalogoDisenos/GetFiltrobyCliente/"
                                    + `${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente"))}`;
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    }
});
