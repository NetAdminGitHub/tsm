﻿var Permisos;
let UrlClie = TSM_Web_APi + "Clientes";
let UrlPro = TSM_Web_APi + "Programas";
let VIdCliente = 0;
let vIdPrograma = 0;
$(document).ready(function () {

    // configurar clientes y servicios
    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), sessionStorage.getItem("CotizacionesMuestras_CmbIdCliente") === null ? "" : sessionStorage.getItem("CotizacionesMuestras_CmbIdCliente")); 
    $("#CmbPrograma").GetCotizacionesMuestrasProgramas();
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("CotizacionesMuestras_CmbPrograma") === null ? "" : sessionStorage.getItem("CotizacionesMuestras_CmbPrograma")); 
    //#region PRGRANMACION DEL GRID citizacion
    var DsRD = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CotizacionesMuestras/GetIdClienteIdPrograma/" + VIdCliente + "/" + vIdPrograma; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CotizacionesMuestras/" + datos.IdCotizacion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "CotizacionesMuestras",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8"

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacion",
                fields: {
                    IdCotizacion: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdPrograma: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NoDocumentoPrograma: { type: "string" },
                    NombrePro: { type: "string" },
                    IdCliente: {
                        type: "string"
                    },
                    NoCuenta: { type: "string" },
                    NombreCli: { type: "string" },
                    FechaCotizacion: { type: "date" },
                    FechaAprobacion: { type: "date" },
                    FechaCreacion: {
                        type: "date"
                    },
                    IdUsuario: { type: "string", defaultValue: getUser() },
                    Comentarios: { type: "string" },
                    Estado: { type: "string", defaultValue: "EDICION" },
                    Contacto: { type: "string" },
                    CotizaPromedio: { type: "bool" },
                    NombreEst: { type: "string" }
                }
            }
        }
    });

    var selectedRows = [];

    $("#gridCotizacion").kendoGrid({
        autoBind: false,
        dataBound: function () {
            let grid = this;
            grid.tbody.find("tr").dblclick(function (e) {
                window.location.href = "/CotizacionesMuestras/CotizacionesMuestrasDatos/" + grid.dataItem(this).IdCotizacion.toString() + "/" + grid.dataItem(this).Estado.toString();
            });
            Grid_SetSelectRow($("#gridCotizacion"), selectedRows);
        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCotizacion");
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "FechaCotizacion");
            KdoHideCampoPopup(e.container, "NombreCli");
            KdoHideCampoPopup(e.container, "NombrePro");
            KdoHideCampoPopup(e.container, "FechaAprobacion");
            KdoHideCampoPopup(e.container, "IdUsuario");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NombreEst");
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "Contacto");
            KdoHideCampoPopup(e.container, "Comentarios");
            KdoHideCampoPopup(e.container, "NoDocumentoPrograma");

            if (!e.model.isNew()) {
                KdoComboBoxEnable($('[name="IdPrograma"]'), false);
            }
            $('[name="FechaCreacion"]').data("kendoDatePicker").enable(false);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCotizacion", title: "Cod. Cotización", hidden: true },
            {
                field: "NoDocumento", title: "No Cotización",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "FechaCotizacion", title: "Fecha Cotización", format: "{0: dd/MM/yyyy}", hidden: true },
            {
                field: "FechaCreacion", title: "Fecha Creación", format: "{0: dd/MM/yyyy}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdCliente", title: "Cliente", hidden: true },
            {
                field: "NoCuenta", title: "NoCuenta",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreCli", title: "Nombre del Cliente",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdPrograma", title: "Programa", editor: Grid_Combox, values: ["IdPrograma", "Nombre", UrlPro, "", "Seleccione....", "required", "CmbIdCliente", "requerido"], hidden: true },
            {
                field: "NoDocumentoPrograma", title: "No Programa",
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NombrePro", title: "Nombre del Programa",
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "FechaAprobacion", title: "Fecha Aprobación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "IdUsuario", title: "Usuario", hidden: true },
            {
                field: "Estado", title: "Estado", hidden: true,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreEst", title: "Estado cotización",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "Contacto", title: "Contacto", hidden: true },
            { field: "Comentarios", title: "Comentarios", hidden: true }
            ]
    });

    SetGrid($("#gridCotizacion").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, true, 0,true,"row");
    SetGrid_CRUD_ToolbarTop($("#gridCotizacion").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCotizacion").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCotizacion").data("kendoGrid"), DsRD);

    Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);

    //#endregion FIN PROGRAMACIÓN DEL GRID cotizacion
    //#region seleccion de servicio y cliente


    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            Fn_ConsultarCotiza(this.dataItem(e.item.index()).IdCliente.toString(), KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("CotizacionesMuestras_CmbIdCliente", this.dataItem(e.item.index()).IdCliente);
            Grid_HabilitaToolbar($("#gridCotizacion"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        } else {
            Fn_ConsultarCotiza(0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("CotizacionesMuestras_CmbIdCliente", "");
            Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            Fn_ConsultarCotiza(0, KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma")));
            sessionStorage.setItem("CotizacionesMuestras_CmbIdCliente", "");
            Grid_HabilitaToolbar($("#gridCotizacion"), false, false, false);
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            KdoCmbSetValue($("#CmbIdCliente"), this.dataItem(e.item.index()).IdCliente);
            Fn_ConsultarCotiza(this.dataItem(e.item.index()).IdCliente, this.dataItem(e.item.index()).IdPrograma);
            sessionStorage.setItem("CotizacionesMuestras_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);
        } else {
            Fn_ConsultarCotiza(KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente")), 0);
            sessionStorage.setItem("CotizacionesMuestras_CmbPrograma", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            Fn_ConsultarCotiza(KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente")), 0);
            sessionStorage.setItem("CotizacionesMuestras_CmbPrograma", "");
        }

    });

    $("#gridCotizacion").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCotizacion"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridCotizacion"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridCotizacion"), ($(window).height() - "371"));
    //#endregion

    //Coloca el filtro de cliente guardado en la sesion
    if ((sessionStorage.getItem("CotizacionesMuestras_CmbIdCliente") === "" ? null : sessionStorage.getItem("CotizacionesMuestras_CmbIdCliente")) !== null || (sessionStorage.getItem("CotizacionesMuestras_CmbPrograma") === "" ? null : sessionStorage.getItem("CotizacionesMuestras_CmbPrograma")) !== null) {
        Fn_ConsultarCotiza(sessionStorage.getItem("CotizacionesMuestras_CmbIdCliente"), sessionStorage.getItem("CotizacionesMuestras_CmbPrograma"));
    }
});

let Fn_ConsultarCotiza = function (IdCliente,IdPrograma) {
    VIdCliente = Number(IdCliente);
    vIdPrograma = Number(IdPrograma);
    //leer grid
    $("#gridCotizacion").data("kendoGrid").dataSource.data([]);
    $("#gridCotizacion").data("kendoGrid").dataSource.read();
};

$.fn.extend({
    GetCotizacionesMuestrasProgramas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder:"Seleccione un programa ...",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CotizacionesMuestras/GetCotizacionesMuestrasProgramas/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "No Programa", width: 100 },
                    { field: "Nombre", title: "Nombre del Programa", width: 200 },
                    { field: "NombreCli", title: "Nombre del Cliente", width: 200 }
                ]
            });
        });
    }
});
var fPermisos = function (datos) {
    Permisos = datos;
};