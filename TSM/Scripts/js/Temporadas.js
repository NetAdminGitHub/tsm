var Permisos;

$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: crudServiceBaseUrl,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTemporada; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTemporada; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
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
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdTemporada",
                fields: {
                    IdTemporada: { type: "number" },
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
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#GkTemporadas").kendoGrid({
        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdTemporada]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdTemporada]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTemporada", title: "Código de Temporada", editor: Grid_ColInt64NumSinDecimal,hidden:true },
            { field: "Nombre", title: "Nombre" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#GkTemporadas").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#GkTemporadas").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#GkTemporadas").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#GkTemporadas").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#GkTemporadas").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#GkTemporadas"), selectedRows);
    });

    $("#GkTemporadas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#GkTemporadas"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#GkTemporadas"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#GkTemporadas"), ($(window).height() - "371"));
});

fPermisos = function (datos) {
    Permisos = datos;
}