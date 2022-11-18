var Permisos;
let UrlPPV = TSM_Web_APi + "PerfilPlantillasVentas";
let UrlPPVV = TSM_Web_APi + "PerfilPlantillasVentasVariables";
let UrlPPVC = TSM_Web_APi + "PerfilPlantillasVentasClientes";
let UrlCli = TSM_Web_APi + "Clientes";
var IDPERFIL = 0;

$(document).ready(function () {

    /////////////////////////////////////////////////////////PLANTILLAS//////////////////////////////////////////////////////
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPPV,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPPV + "/" + datos.IdPerfil; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPPV + "/" + datos.IdPerfil; },
                type: "DELETE"
            },
            create: {
                url: UrlPPV,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        change: function (data) {
            Grid_HabilitaToolbar($("#gridPPVV"), false, false, false);
            Grid_HabilitaToolbar($("#gridPPVC"), false, false, false);
        },
        schema: {
            model: {
                id: "IdPerfil",
                fields: {
                    IdPerfil: { type: "number" },
                    Nombre: { type: "string" },
                    Plantilla: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Plantilla']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Estado: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "IdPerfil", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPPV").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPerfil");
            $('[name="Estado"]').data("kendoTextBox").value("ACTIVO");
            $('[name="Estado"]').data("kendoTextBox").trigger("change");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        change: function (e) {

                let selectedRows = this.select();
                let selectedDataItems = [];

                for (let i = 0; i < selectedRows.length; i++) {
                    let dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }

            let IdPerfil = selectedDataItems[0]["id"];

            if (IdPerfil > 0 && IdPerfil != "" && IdPerfil != null && IdPerfil != undefined)
            {
                IDPERFIL = IdPerfil;
                Grid_HabilitaToolbar($("#gridPPVV"), true, true, true);
                Grid_HabilitaToolbar($("#gridPPVC"), true, true, true);
                $("#gridPPVV").data("kendoGrid").dataSource.data([]);
                $("#gridPPVC").data("kendoGrid").dataSource.data([]);
                $("#gridPPVV").data("kendoGrid").setDataSource(dataSource2);
                $("#gridPPVC").data("kendoGrid").setDataSource(dataSource3);
                

            }

        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPerfil", title: "ID", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Plantilla", title: "Plantilla", editor: Grid_ColTextArea, values: ["5"] },
            { field: "Estado", title: "Estado", hidden: true},
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPPV").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#gridPPV").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPPV").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPPV").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridPPV").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPPV"), selectedRows);
    });

    $("#gridPPV").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPPV"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPPV"), $(window).height() - "660");
    });

    Fn_Grid_Resize($("#gridPPV"), $(window).height() - "660");

    /////////////////////////////////////////////////////////FIN PLANTILLAS//////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////VARIABLES//////////////////////////////////////////////////////
    let dataSource2 = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return UrlPPVV + "/GetPorPerfil/" + IDPERFIL; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPPVV + "/" + datos.IdPerfilVariable; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPPVV + "/" + datos.IdPerfilVariable; },
                type: "DELETE"
            },
            create: {
                url: UrlPPVV,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdPerfilVariable",
                fields: {
                    IdPerfilVariable: { type: "number" },
                    IdPerfil: { type: "number" },
                    Campo: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Campo']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Formula']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Formula: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "Codigo", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPPVV").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPerfilVariable");
            $('[name="IdPerfil"]').data("kendoNumericTextBox").value(IDPERFIL);
            $('[name="IdPerfil"]').data("kendoNumericTextBox").trigger("change");
            KdoHideCampoPopup(e.container, "IdPerfil");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Campo");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPerfilVariable", title: "ID", hidden: true },
            { field: "IdPerfil", title: "IdPerfil", hidden: true },
            { field: "Campo", title: "Campo" },
            { field: "Formula", title: "Formula" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPPVV").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#gridPPVV").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPPVV").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPPVV").data("kendoGrid"), dataSource2);

    var selectedRows2 = [];
    $("#gridPPVV").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPPVV"), selectedRows2);
    });

    $("#gridPPVV").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPPVV"), selectedRows2);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPPVV"), $(window).height() - "630");
    });

    Fn_Grid_Resize($("#gridPPVV"), $(window).height() - "630");

/////////////////////////////////////////////////////////FIN VARIABLES//////////////////////////////////////////////////////


/////////////////////////////////////////////////////////CLIENTES//////////////////////////////////////////////////////
    let dataSource3 = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return UrlPPVC + "/GetPorPerfil/" + IDPERFIL; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPPVC + "/" + datos.IdPerfilCliente; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPPVC + "/" + datos.IdPerfilCliente; },
                type: "DELETE"
            },
            create: {
                url: UrlPPVC,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdPerfilCliente",
                fields: {
                    IdPerfilCliente: { type: "number" },
                    IdPerfil: {
                        type: "number",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdCliente']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCliente").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdCliente: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Nombre: { type: "string" }
                }
            }
        },
        sort: { field: "IdPerfilCliente", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPPVC").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPerfilCliente");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            $('[name="IdPerfil"]').data("kendoNumericTextBox").value(IDPERFIL);
            $('[name="IdPerfil"]').data("kendoNumericTextBox").trigger("change");
            KdoHideCampoPopup(e.container, "IdPerfil");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdCliente");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPerfilCliente", title: "ID", hidden: true },
            { field: "IdPerfil", title: "IdPerfil", hidden: true },
            { field: "IdCliente", title: "Cliente", values: ["IdCliente", "Nombre", UrlCli, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Cliente"},
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPPVC").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No, 700);
    SetGrid_CRUD_ToolbarTop($("#gridPPVC").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPPVC").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPPVC").data("kendoGrid"), dataSource3);

    var selectedRows3 = [];
    $("#gridPPVC").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPPVC"), selectedRows3);
    });

    $("#gridPPVC").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPPVC"), selectedRows3);
    });

/////////////////////////////////////////////////////////FIN CLIENTES//////////////////////////////////////////////////////

});

fPermisos = function (datos) {
    Permisos = datos;
};