var Permisos;
let UrlPAV = TSM_Web_APi + "PerfilesAgrupacionesVentas";
let UrlPAVC = TSM_Web_APi + "PerfilesAgrupacionesVentasClientes";
let UrlCli = TSM_Web_APi + "Clientes";
var IDPERFIL = 0;

$(document).ready(function () {

    /////////////////////////////////////////////////////////PERFILES//////////////////////////////////////////////////////
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPAV,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPAV + "/" + datos.IdPerfil; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPAV + "/" + datos.IdPerfil; },
                type: "DELETE"
            },
            create: {
                url: UrlPAV,
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
            Grid_HabilitaToolbar($("#gridPAVC"), false, false, false);
        },
        schema: {
            model: {
                id: "IdPerfil",
                fields: {
                    IdPerfil: { type: "number" },
                    Nombre: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Proceso: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Proceso']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                return true;
                            }
                        }
                    }
                }
            }
        },
        sort: { field: "IdPerfil", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPAV").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPerfil");
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

            if (IdPerfil > 0 && IdPerfil != "" && IdPerfil != null && IdPerfil != undefined) {
                IDPERFIL = IdPerfil;
                Grid_HabilitaToolbar($("#gridPAVC"), true, true, true);
                $("#gridPAVC").data("kendoGrid").dataSource.data([]);
                $("#gridPAVC").data("kendoGrid").setDataSource(dataSource3);


            }

        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPerfil", title: "ID", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Proceso", title: "Proceso" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPAV").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridPAV").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPAV").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPAV").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridPAV").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPAV"), selectedRows);
    });

    $("#gridPAV").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPAV"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPAV"), $(window).height() - "300");
    });

    Fn_Grid_Resize($("#gridPAV"), $(window).height() - "300");

    /////////////////////////////////////////////////////////FIN PERFILES//////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////CLIENTES//////////////////////////////////////////////////////
    let dataSource3 = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return UrlPAVC + "/GetPorPerfil/" + IDPERFIL; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPAVC + "/" + datos.IdPerfilCliente; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPAVC + "/" + datos.IdPerfilCliente; },
                type: "DELETE"
            },
            create: {
                url: UrlPAVC,
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
    $("#gridPAVC").kendoGrid({
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
            { field: "Nombre", title: "Cliente" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPAVC").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridPAVC").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPAVC").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPAVC").data("kendoGrid"), dataSource3);

    var selectedRows3 = [];
    $("#gridPAVC").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPAVC"), selectedRows3);
    });

    $("#gridPAVC").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPAVC"), selectedRows3);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPAVC"), $(window).height() - "300");
    });

    Fn_Grid_Resize($("#gridPAVC"), $(window).height() - "300");

/////////////////////////////////////////////////////////FIN CLIENTES//////////////////////////////////////////////////////

});

fPermisos = function (datos) {
    Permisos = datos;
};