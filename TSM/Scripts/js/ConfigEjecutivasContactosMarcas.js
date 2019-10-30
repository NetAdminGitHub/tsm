var Permisos;
let UrlCli = TSM_Web_APi + "Clientes";
let UrlEje = TSM_Web_APi + "EjecutivoCuentas";
let UrlRcc = TSM_Web_APi + "RelacionContactosClientes";
let Urlcc = TSM_Web_APi + "ContactosClientes";
let UrlE = TSM_Web_APi + "Estados";
let UrlCmc = TSM_Web_APi + "ClientesMarcas";
let UrlMc = TSM_Web_APi + "Marcas";
let UrlECC = TSM_Web_APi + "EjecutivoCuentasContactosMarcas";
let vIdclien = 0;
let vIdEjeCta = 0;

$(document).ready(function () {
    //Llenar combo box
    Kendo_CmbFiltrarGrid($("#CmbCliente"), UrlCli, "Nombre", "IdCliente", "Selecione un cliente...");
    Kendo_CmbFiltrarGrid($("#CmbEjecu"), UrlEje, "Nombre", "IdEjecutivoCuenta", "Selecione un Ejecutivo(a)...");

    //dibujar panel para la separacion de información
    PanelBarConfig($("#bpecm"));

    //#region Asignacion de contactos

    var dsCli = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlRcc + "/GetByIdCliente/" + vIdclien.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlRcc + "/" + datos.IdContactoCliente + "/" + datos.IdCliente; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlRcc + "/" + datos.IdContactoCliente + "/" + datos.IdCliente; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlRcc,
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
                    IdContactoCliente: {
                        type: "string"
                    },
                    IdCliente: {
                        type: "string",
                        defaultValue: function (e) {
                            return KdoCmbGetValue($("#CmbCliente"));
                        }
                    },
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
    $("#gridContacto").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdContactoCliente");
                Grid_Focus(e, "Estado");
            } else {
                Grid_Focus(e, "IdContactoCliente");
            }

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdContactoCliente", title: "Contacto Cliente", values: ["IdContactoCliente", "Nombre", Urlcc, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Nombre del contacto" },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "Nombre", title: "Nombre Cliente", hidden: true },
            { field: "NoCuenta", title: "NoCuenta", hidden: true },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "RelacionContactosClientes", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridContacto").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridContacto").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridContacto").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridContacto").data("kendoGrid"), dsCli, 20);

    var seleRows = [];
    $("#gridContacto").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridContacto"), seleRows);
    });

    $("#gridContacto").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridContacto"), seleRows);
    });


    //#endregion

    //#region Asignacion de Marcas
    //CONFIGURACION DEL CRUD
    var dsMar = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCmc + "/GetByCliente/" + vIdclien.toString(); },
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
                id: "IdMarca",
                fields: {
                    IdMarca: {
                        type: "string"

                    },
                    IdCliente: {
                        type: "string",
                        defaultValue: function (e) {
                            return KdoCmbGetValue($("#CmbCliente"));
                        }
                    },
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
                                if (input.is("[name='IdMarca']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdMarca").data("kendoComboBox").selectedIndex >= 0;
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
    $("#gridMarca").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
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
            { field: "IdMarca", title: "Codigo Marca", values: ["IdMarca", "Nombre", UrlMc, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Nombre de Marca" },
            { field: "IdCliente", title: "Cliente", hidden: true },
            { field: "Nombre", title: "Nombre Cliente", hidden: true },
            { field: "NoCuenta", title: "NoCuenta", hidden: true },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "ClientesMarcas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridMarca").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridMarca").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridMarca").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridMarca").data("kendoGrid"), dsMar, 20);

    var seleRow1 = [];
    $("#gridMarca").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridMarca"), seleRow1);
    });

    $("#gridMarca").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridMarca"), seleRow1);
    });

    //#endregion

    //#region Asignacion de clientes
    //CONFIGURACION DEL CRUD
    var dsEjecue = new kendo.data.DataSource({
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
                            return KdoCmbGetValue($("#CmbEjecu"));
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
    $("#gridContEjec").kendoGrid({
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
                $('[name="IdMarca"]').data("kendoComboBox").setDataSource(fn_getDsContacto(Idcc));

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
            { field: "IdContactoCliente", title: "Contacto", values: ["IdContactoCliente", "Nombre", Urlcc, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Item", title: "item", hidden: true },
            { field: "Nombre", title: "Contacto" },
            { field: "IdMarca", title: "Marca", values: ["IdMarca", "Nombre", UrlCmc + "/GetClientesMarcabyIdContactoCliente/nothing", "", "Seleccione....", "", "", ""], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Marca" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "EjecutivoCuentasContactosMarcas", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Estado" }
        ]
    });

    SetGrid($("#gridContEjec").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridContEjec").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridContEjec").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridContEjec").data("kendoGrid"), dsEjecue, 20);

    Grid_HabilitaToolbar($("#gridContEjec"), false, false, false);
    var seleRows2 = [];
    $("#gridContEjec").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridContEjec"), seleRows2);
    });

    $("#gridContEjec").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridContEjec"), seleRows2);
    });

    //#endregion 


    Grid_HabilitaToolbar($("#gridContacto"), false, false, false);
    Grid_HabilitaToolbar($("#gridMarca"), false, false, false);
    Grid_HabilitaToolbar($("#gridContEjec"), false, false, false);

    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdclien = this.dataItem(e.item.index()).IdCliente;
            fn_consultar();
            fn_consultarMarco();
            Grid_HabilitaToolbar($("#gridContacto"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#gridMarca"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {
            vIdclien = 0;
            Grid_HabilitaToolbar($("#gridContacto"), false, false, false);
            Grid_HabilitaToolbar($("#gridMarca"), false, false, false);
        }
    });
    $("#CmbCliente").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            vIdclien = 0;
            $("#gridContacto").data("kendoGrid").dataSource.data([]);
            $("#gridMarca").data("kendoGrid").dataSource.data([]);

            Grid_HabilitaToolbar($("#gridContacto"), false, false, false);
            Grid_HabilitaToolbar($("#gridMarca"), false, false, false);
        }
    });

    $("#CmbEjecu").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdEjeCta = this.dataItem(e.item.index()).IdEjecutivoCuenta;
            fn_consultarContEjec();
            Grid_HabilitaToolbar($("#gridContEjec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);

        }
        else {
            vIdEjeCta = 0;
            Grid_HabilitaToolbar($("#gridContEjec"), false, false, false);
        }
    });
    $("#CmbEjecu").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            vIdEjeCta = 0;
            $("#gridContEjec").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridContEjec"), false, false, false);
        }
    });

});

var fn_consultar = function () {
    $("#gridContacto").data("kendoGrid").dataSource.read();
};
var fn_consultarMarco = function () {
    $("#gridMarca").data("kendoGrid").dataSource.read();
};

var fn_consultarContEjec = function () {
    $("#gridContEjec").data("kendoGrid").dataSource.read();
};
let fn_getDsContacto = function (idcontacto) {

    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    url: UrlCmc + "/GetClientesMarcabyIdContactoCliente/" + idcontacto.toString(),
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};
fPermisos = function (datos) {
    Permisos = datos;
};



