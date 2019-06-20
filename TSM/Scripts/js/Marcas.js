var Permisos;
$(document).ready(function () {
    //#region Marcas
    let vIdMarca = 0;
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: Urlmc,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return Urlmc + "/" + datos.IdMarca; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return Urlmc + "/" + datos.IdMarca; },
                type: "DELETE"
            },
            create: {
                url: Urlmc,
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdMarca",
                fields: {
                    IdMarca: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdMarca");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMarca", title: "Codigo marca", hidden: true },
            { field: "Nombre", title: "Nombre marca " },
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
            vIdMarca = 0;
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
    var dsCli = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCmc + "/GetClientesMarcaByIdMarca/" + vIdMarca.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCmc + "/" + datos.IdMarca + "/" + datos.IdCliente; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlCmc + "/" + datos.IdMarca + "/" + datos.IdCliente; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlCmc,
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
                id: "IdCliente",
                fields: {
                    IdMarca: {
                        type: "string",
                        defaultValue: function (e) {
                            return fn_GetIdMarca($("#grid").data("kendoGrid"));
                        }
                    },
                    IdCliente: { type: "string" },
                    NoCuenta: { type: "string" },
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
                                if (input.is("[name='IdCliente']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCliente").data("kendoComboBox").selectedIndex >= 0;
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
            KdoHideCampoPopup(e.container, "IdMarca");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdCliente");
                Grid_Focus(e, "IdUsuarioMod");
            } else {
                Grid_Focus(e, "IdCliente");
            }

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMarca", title: "Codigo Marca", hidden: true },
            { field: "IdCliente", title: "Cliente", values: ["IdCliente", "Nombre", UrlCli, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Nombre Cliente" },
            { field: "NoCuenta", title: "NoCuenta" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "ClientesMarcas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
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
        vIdMarca = fn_GetIdMarca($("#grid").data("kendoGrid"));
        $("#gridCli").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridCli"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridCli"), false, false, false);
    };
    //#endregion 
});

let fn_GetIdMarca = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdMarca;

};
fPermisos = function (datos) {
    Permisos = datos;
};