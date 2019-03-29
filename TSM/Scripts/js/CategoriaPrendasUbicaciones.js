var Permisos;

$(document).ready(function () {
    var vIdCategoriaPrenda = 0;
    Kendo_CmbFiltrarGrid($("#CmbPrenda"), UrlCp, "Nombre", "IdCategoriaPrenda", "Seleccione una Prenda ...");
    //CONFIGURACION DEL CRUD
    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCpu + "/GetCategoriaPrendasUbicacionByIdCategoriaPrenda/" + vIdCategoriaPrenda; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCpu + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "DELETE"
            },
            create: {
                url: UrlCpu,
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
                id: "IdUbicacion",
                fields: {
                    IdCategoriaPrenda: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbPrenda").val(); }
                    },
                    Nombre: {
                        type: "string"
                        
                    },
                    IdUbicacion: {
                        type: "string",
                        validation: {
                           required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUbicacion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
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
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCategoriaPrenda", title: "Cod. prenda", editor: Grid_ColLocked, hidden: true},
            { field: "Nombre", title: "Nombre", editor: Grid_ColLocked, hidden: true },     
            { field: "IdUbicacion", title: "Ubicación", values: ["IdUbicacion", "Nombre", UrlU, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Nombre Ubicación" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    Kendo_CmbFocus($("#CmbPrenda"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbPrenda").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdCategoriaPrenda = this.dataItem(e.item.index()).IdCategoriaPrenda;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {
            vIdCategoriaPrenda = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbPrenda").data("kendoComboBox").bind("change", function (e) {
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