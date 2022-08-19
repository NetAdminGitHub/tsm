var Permisos;
let UrlPl = TSM_Web_APi + "EtapasProcesosMacro";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPl + "/" + datos.IdEtapaProcesoMacro; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdEtapaProcesoMacro; },
                type: "DELETE"
            },
            create: {
                url: UrlPl,
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
                id: "IdEtapaProcesoMacro",
                fields: {
                    IdEtapaProcesoMacro: { type: "number", hidden:true },
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 300) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 300");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Orden: { type: "number" },
                    Icono: { type: "string" }
                }
            }
        },
        sort: { field: "IdEtapaProcesoMacro", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdEtapaProcesoMacro");
            Grid_Focus(e, "Nombre");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEtapaProcesoMacro", title: "ID", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "Orden", title: "Orden", editor: Grid_ColIntNumSinDecimal },
            { field: "Icono", title: "Icono" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
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