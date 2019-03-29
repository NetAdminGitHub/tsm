var Permisos;

$(document).ready(function () {
    var vIdCliente = 0;
    Kendo_CmbFiltrarGrid($("#CmbCli"), UrlC, "Nombre", "IdCliente", "Seleccione una Prenda ...");

    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCc + "/GetContactosClienteByIdCliente/" + vIdCliente; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCc + "/" + datos.IdContactoCliente + "/" + datos.IdCliente; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlCc + "/" + datos.IdContactoCliente + "/" + datos.IdCliente; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlCc,
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
                    IdContactoCliente: { type: "string" },
                    Nombre: {
                        type: "string", validation: { required: true }
                    },
                    IdCliente: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbCli").val(); }
                    },
                    NoCuenta: {
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
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "NoCuenta");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            $('[name="IdContactoCliente"]').on('change', function (e) {
                $("[name='Nombre']").val($('[name="IdContactoCliente"]').data("kendoComboBox").text());
                $("[name='Nombre']").trigger("change");
            });
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdContactoCliente");
                Grid_Focus(e, "Nombre");

            } else { Grid_Focus(e, "IdContactoCliente");}
          
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdContactoCliente", title: "Contacto", values: ["IdUsuario", "Nombre", UrlU, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox },
            { field: "Nombre", title: "Nombre" },
            { field: "IdCliente", title: "Codigo Cliente", hidden: true },
            { field: "NoCuenta", title: "NoCuenta"},
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "ContactosClientes", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
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

    Kendo_CmbFocus($("#CmbCli"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbCli").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdCliente = this.dataItem(e.item.index()).IdCliente;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {
            vIdCliente = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbCli").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

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
});

fPermisos = function (datos) {
    Permisos = datos;
};