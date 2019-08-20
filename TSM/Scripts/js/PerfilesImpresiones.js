var Permisos;
$(document).ready(function () {
    let Urlv = TSM_Web_APi + "UnidadesMedidas";
    let  dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPi,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPi + "/" + datos.IdPerfilesImpresion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPi + "/" + datos.IdPerfilesImpresion; },
                type: "DELETE"
            },
            create: {
                url: UrlPi,
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
                id: "IdPerfilesImpresion",
                fields: {
                    IdPerfilesImpresion: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdUnidadVelocidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadVelocidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadAncho']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadAncho").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NoPasadas: { type: "numeric" },
                    AnchoInicial: { type: "numeric" },
                    AnchoFinal: { type: "numeric" },
                    Velocidad: { type: "numeric" },
                    IdUnidadVelocidad: { type: "string" },
                    Nombre1: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdUnidadAncho: { type: "string" },
                    Nombre2: { type: "string" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPerfilesImpresion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "Nombre2");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPerfilesImpresion", title: "Codigo Perfil", hidden: true },
            { field: "Nombre", title: "Nombre " },
            { field: "NoPasadas", title: "No Pasadas", editor: Grid_ColNumeric, values: ["required", "0", "999", "#", 0] },
            { field: "AnchoInicial", title: "Ancho Inicial", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0] },
            { field: "AnchoFinal", title: "Ancho Final", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0] },
            { field: "IdUnidadAncho", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", Urlv, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre2", title: "Unidad" },
            { field: "Velocidad", title: "Velocidad", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0] },
            { field: "IdUnidadVelocidad", title: "Unidad Velocidad", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", Urlv, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre1", title: "Unidad Velocidad" },
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