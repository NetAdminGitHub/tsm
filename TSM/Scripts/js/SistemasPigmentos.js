var Permisos;
let UrlSisPig = TSM_Web_APi + "SistemasPigmentos";
let UrlTT = TSM_Web_APi + "TiposTintas";
let UrlTtSp = TSM_Web_APi + "TiposTintasSistemasPigmentos";
let vIdTit = 0;
$(document).ready(function () {
    //Llenar combo box
    Kendo_CmbFiltrarGrid($("#CmbTiposTintas"), UrlTT, "Nombre", "IdTipoTinta", "Selecione un tipo...");
    //dibujar panel para la separacion de información
    PanelBarConfig($("#bpbm"));
    //#region Matenimiento basepigmentos

    let dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlSisPig,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSisPig + "/" + datos.IdSistemaPigmento; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlSisPig + "/" + datos.IdSistemaPigmento; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlSisPig,
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
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdSistemaPigmento",
                fields: {
                    IdSistemaPigmento: { type: "number" },
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
            KdoHideCampoPopup(e.container, "IdSistemaPigmento");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSistemaPigmento", title: "Código sistema pigmento", editor: Grid_ColIntNumSinDecimal, hidden: true },
            { field: "Nombre", title: "Nombre sistema" },
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


    //#region Asigancion de Tintas a Bases
    var dsMar = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlTtSp + "/GetByTipoTinta/" + vIdTit.toString(); },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlTtSp + "/" + datos.IdTipoTinta + "/" + datos.IdSistemaPigmento; },
                type: "DELETE"
            },
            create: {
                url: UrlTtSp,
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
                id: "IdSistemaPigmento",
                fields: {
                    IdSistemaPigmento: {
                        type: "string"

                    },
                    IdTipoTinta: {
                        type: "string",
                        defaultValue: function (e) {
                            return KdoCmbGetValue($("#CmbTiposTintas"));
                        }
                    },
                    Nombre: {
                        type: "string"
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

    $("#gridTtSm").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoTinta");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdTipoTinta");
                Grid_Focus(e, "Nombre");
            } else {
                Grid_Focus(e, "IdTipoTinta");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSistemaPigmento", title: "Cod. sistema pigmento", values: ["IdSistemaPigmento", "Nombre", UrlSisPig, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Nombre sistema pigmento" },
            { field: "IdTipoTinta", title: "Tipo tinta", hidden: true },
            { field: "Nombre1", title: "Nombre tipo tinta", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridTtSm").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si, 350);
    SetGrid_CRUD_ToolbarTop($("#gridTtSm").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridTtSm").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridTtSm").data("kendoGrid"), dsMar, 20);

    var seleRow1 = [];
    $("#gridTtSm").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridTtSm"), seleRow1);
    });

    $("#gridTtSm").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridTtSm"), seleRow1);
    });
    //#endregion 

    Grid_HabilitaToolbar($("#gridTtSm"), false, false, false);

    $("#CmbTiposTintas").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdTit = this.dataItem(e.item.index()).IdTipoTinta;
            fn_consultar();
        }
        else {
            vIdTit = 0;
            Grid_HabilitaToolbar($("#gridTtSm"), false, false, false);
        }
    });
    $("#CmbTiposTintas").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            vIdTit = 0;
            $("#gridTtSm").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridTtSm"), false, false, false);
        }
    });

});

let fn_consultar = function () {
    $("#gridTtSm").data("kendoGrid").dataSource.read();
    Grid_HabilitaToolbar($("#gridTtSm"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
};

fPermisos = function (datos) {
    Permisos = datos;
};