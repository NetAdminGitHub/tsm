var Permisos;
$(document).ready(function () {
    var vIdEjeCta = 0;
    //#region Programacion Grid Ejecutivo cuenta
    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlEC + "/GetEjecutivoCuentasVista"; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlEC + "/" + datos.IdEjecutivoCuenta; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlEC + "/" + datos.IdEjecutivoCuenta; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlEC,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdEjecutivoCuenta",
                fields: {
                    IdEjecutivoCuenta: { type: "string" },
                    Nombre: {
                        type: "string", validation: { required: true }
                    },
                    IdEjecutivoReporta: { type: "string" },
                    Estado: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdEjecutivoCuenta']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdEjecutivoCuenta").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdEjecutivoReporta']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdEjecutivoReporta").data("kendoComboBox").text() === "" ? true : $("#IdEjecutivoReporta").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre1: {
                        type: "string"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            $('[name="IdEjecutivoCuenta"]').on('change', function (e) {
                $("[name='Nombre']").val($('[name="IdEjecutivoCuenta"]').data("kendoComboBox").text());
                $("[name='Nombre']").trigger("change");
            });
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdEjecutivoCuenta");
                Grid_Focus(e, "Nombre");

            } else { Grid_Focus(e, "IdEjecutivoCuenta"); }

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEjecutivoCuenta", title: "Ejecutivo Cuenta", values: ["IdUsuario", "Nombre", UrlU, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox },
            { field: "Nombre", title: "Nombre" },
            {
                field: "IdEjecutivoReporta", title: "Reporta", values: ["IdEjecutivoCuenta", "Nombre", UrlEC +"/GetEjecutivoCuentasReporta", "", "Seleccione....", "", "", ""], editor: Grid_Combox },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "EjecutivoCuentas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            vIdEjeCta = 0;
            $("#gridCli").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridCli"), false, false, false);
        }
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_consultarGridCli();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    //#endregion 

    //#region Asignacion de clientes
    //CONFIGURACION DEL CRUD
    dsCli = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlECC + "/GetEjecutivoCuentasContactosMarcaByIdEjecutivoCuenta/" + vIdEjeCta.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlECC + "/" + datos.IdEjecutivoCuenta + "/" + datos.IdContactoCliente + "/" + datos.Item; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlECC + "/" + datos.IdEjecutivoCuenta + "/" + datos.IdContactoCliente + "/" + datos.Item; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlECC,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdContactoCliente",
                fields: {
                    IdEjecutivoCuenta: {
                        type: "string",
                        defaultValue: function (e) {
                            return fn_GetIdEjecutivoCuenta($("#grid").data("kendoGrid"));
                        }
                    },
                    IdMarca: { type: "string" },
                    Nombre2: { type: "string" },
                    IdContactoCliente: { type: "string" },
                    Item: {
                        type: "number", defaultValue: function (e) {
                            return 0;
                        }
                    },
                    Nombre: {
                        type: "string"
                    },
                    Estado: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdMarca']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdMarca").data("kendoComboBox").text() === "" ? true : $("#IdMarca").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdContactoCliente']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdContactoCliente").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre1: {
                        type: "string"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridCli").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdEjecutivoCuenta");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Item");
            $('[name="IdContactoCliente"]').on('change', function (e) {
                let Idcc = Kendo_CmbGetvalue($('[name="IdContactoCliente"]'));
                KdoCmbGetValue($('[name="IdMarca"]'), "");
                $('[name="IdMarca"]').data("kendoComboBox").setDataSource(getDsIdContacto(Idcc));

            });
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdContactoCliente");
                Grid_Focus(e, "Estado");
            } else {
                Grid_Focus(e, "IdContactoCliente");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEjecutivoCuenta", title: "Cod. Ejecutiva Cuenta", hidden: true },
            { field: "IdContactoCliente", title: "Contacto", values: ["IdContactoCliente", "Nombre", UrlCc, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Item", title: "item", hidden: true},
            { field: "Nombre", title: "Contacto" },
            { field: "IdMarca", title: "Marca", values: ["IdMarca", "Nombre", UrlCMc + "/GetClientesMarcabyIdContactoCliente/nothing", "", "Seleccione....", "", "", ""], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Marca" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "EjecutivoCuentasContactosMarcas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Estado" }
        ]
    });

    SetGrid($("#gridCli").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridCli").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCli").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCli").data("kendoGrid"), dsCli);

    Grid_HabilitaToolbar($("#gridCli"), false, false, false);
    var seleRows = [];
    $("#gridCli").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCli"), seleRows);
    });

    $("#gridCli").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCli"), seleRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridCli"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridCli"), $(window).height() - "371");

    var fn_consultarGridCli = function () {
        vIdEjeCta = fn_GetIdEjecutivoCuenta($("#grid").data("kendoGrid"));
        $("#gridCli").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridCli"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridCli"), false, false, false);
    };

    
    //#endregion 
});

let getDsIdContacto=function(idcontacto) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    url: UrlCMc + "/GetClientesMarcabyIdContactoCliente/" + idcontacto.toString(),
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
}

let fn_GetIdEjecutivoCuenta = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdEjecutivoCuenta;

};
fPermisos = function (datos) {
    Permisos = datos;
};