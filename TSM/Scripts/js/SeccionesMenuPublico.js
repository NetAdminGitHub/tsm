
let xidMenu = 0;
let xsDivLe = "";

var fn_Ini_SeccionMenuPublico = (strjson) => {

    xidMenu = strjson.sidMenu;
    xsDivLe = strjson.sDiv;

    //CONFIGURACION DEL GRID,CAMPOS
    var dsSecciones = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "MenusSecciones/GetByIdMenu/" + `${xidMenu}` },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "MenusSecciones/" + datos.IdSeccion; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "MenusSecciones/" + datos.IdSeccion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "MenusSecciones/",
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
                id: "IdSeccion",
                fields: {
                    IdSeccion: { type: "number" },
                    IdMenu: { type: "number", defaultValue: function () { return xidMenu; } },
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
                    IdDivReferencia: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdDivReferencia']") && input.val().length > 50) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 50");
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

    $("#gridSecciones").kendoGrid({
        edit: function (e) {
            // SI ESTOY ACTUALIZANDO BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdSeccion]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdSeccion]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeccion", title: "ID Sección", hidden: true },
            { field: "Nombre", title: "Nombre de la Sección" },
            { field: "IdDivReferencia", title: "Div de Referencia" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridSecciones").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridSecciones").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridSecciones").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridSecciones").data("kendoGrid"), dsSecciones);

    var selectedRows = [];
    $("#gridSecciones").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridSecciones"), selectedRows);
    });

    $("#gridSecciones").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridSecciones"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridSecciones"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridSecciones"), ($(window).height() - "371"));

    Grid_HabilitaToolbar($("#gridSecciones"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);


    $("#gridSecciones").data("kendoGrid").dataSource.read();
}

const fn_Reg_CrearListaEmpaque = (strjson) => {

    xidMenu = strjson.sidMenu;
    xsDivLe = strjson.sDiv;

    $("#gridSecciones").data("kendoGrid").dataSource.read();
    Grid_HabilitaToolbar($("#gridSecciones"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
}