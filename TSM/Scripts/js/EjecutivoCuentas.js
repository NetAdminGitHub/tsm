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
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    //#endregion 

  
});

fPermisos = function (datos) {
    Permisos = datos;
};