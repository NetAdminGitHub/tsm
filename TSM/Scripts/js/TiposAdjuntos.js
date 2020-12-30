var Permisos;
let UrlTA = TSM_Web_APi + "TiposAdjuntos";
$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlTA,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlTA + "/" + datos.IdTipoAdjunto; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlTA + "/" + datos.IdTipoAdjunto; },
                type: "DELETE"
            },
            create: {
                url: UrlTA,
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
                id: "IdTipoAdjunto",
                fields: {
                    IdTipoAdjunto: { type: "number" },
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
                    FechaMod: { type: "date" },
                    MostrarImagenEnLista: { type: "bool" },
                    Catalogo: { type: "bool" },
                    Placement: { type: "bool" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdTipoAdjunto");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoAdjunto", title: "Codigo Adjunto", hidden: true },
            { field: "Nombre", title: "Nombre tipo" },
            { field: "MostrarImagenEnLista", title: "Mostrar Imagen en Lista?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_TemplateCheckBoxColumn(dataItem, "MostrarImagenEnLista"); } },
            { field: "Catalogo", title: "Catalogo?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_TemplateCheckBoxColumn(dataItem, "Catalogo"); } },
            { field: "Placement", title: "Placement?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_TemplateCheckBoxColumn(dataItem, "Placement"); } },
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