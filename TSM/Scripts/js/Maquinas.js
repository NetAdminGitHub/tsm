var Permisos;
let UrlMAT = TSM_Web_APi + "Maquinas";
let UrlTM = TSM_Web_APi + "TiposMarcos";
let UrlTMQ = TSM_Web_APi + "TiposMaquinas";
$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlMAT,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlMAT + "/" + datos.IdMaquina; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlMAT + "/" + datos.IdMaquina; },
                type: "DELETE"
            },
            create: {
                url: UrlMAT,
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
                id: "IdMaquina",
                fields: {
                    IdMaquina: { type: "number" },                    
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdTiposMarco']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTiposMarco").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdTipoMaquina']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoMaquina").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }                        
                    },
                    IdTipoMaquina: {
                        type: "string"
                    },
                    NomIdTipoMaquina: { type: "string" },
                    IdTiposMarco: { type: "string" },
                    NomIdTiposMarco: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdMaquina");
            KdoHideCampoPopup(e.container, "NomIdTiposMarco");
            KdoHideCampoPopup(e.container, "NomIdTipoMaquina");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdMaquina", title: "Código Motivo", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "NomIdTipoMaquina", title: "Tipo de Maquina" },
            { field: "IdTipoMaquina", title: "Tipo de Maquina", editor: Grid_Combox, values: ["IdTipoMaquina", "Nombre", UrlTMQ, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
            { field: "NomIdTiposMarco", title: "Tipos de Marco" },
            { field: "IdTiposMarco", title: "Tipos de Marco", editor: Grid_Combox, values: ["IdTiposMarco", "Nombre", UrlTM, "", "Seleccione...", "required", "", "Requerido"], hidden: true },
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
});

fPermisos = function (datos) {
    Permisos = datos;
};