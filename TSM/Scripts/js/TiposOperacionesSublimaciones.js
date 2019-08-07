﻿var Permisos;
$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlTpo,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlTpo + "/" + datos.IdTipoOperacionSublimado; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlTpo + "/" + datos.IdTipoOperacionSublimado; },
                type: "DELETE"
            },
            create: {
                url: UrlTpo,
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
                id: "IdTipoOperacionSublimado",
                fields: {
                    IdTipoOperacionSublimado: { type: "number" },
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
                    NoOperariosImpre: { type: "numeric" },
                    CostoManoObraImpresion: { type: "numeric" },
                    CostoManoObraTrans: { type: "numeric" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    NoOperariosTrans: { type: "numeric" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoOperacionSublimado");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoOperacionSublimado", title: "Codigo Tipo Operacion", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "NoOperariosImpre", title: "No Operarios Impresión", editor: Grid_ColNumeric, values: ["required", "0", "999", "#", 0] },
            { field: "CostoManoObraImpresion", title: "Costo Mano Obra Impresion", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:c2}", 2] },
            { field: "CostoManoObraTrans", title: "Costo Mano Obra Trans", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "{0:c2}", 2] },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "NoOperariosTrans", title: "No Operarios Transferencia", editor: Grid_ColNumeric, values: ["required", "0", "999", "#", 0] }
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