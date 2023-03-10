var Permisos;

$(document).ready(function () {
    //#region Creacion de Usuarios
    var dataSource = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlUsuarios,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlUsuarios + "/" + datos.IdUsuario; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlUsuarios + "/" + datos.IdUsuario; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlUsuarios,
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
                id: "IdUsuario",
                fields: {
                    IdUsuario: {
                        type: "String", validation: { required:true}},
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUsuario']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
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
    $("#gridUsuario").kendoGrid({
        edit: function (e) {
            // SI ESTOY ACTUALIZANDO BLOQUEA CAMPO LLAVE ( ID)
            if (!e.model.isNew()) {
                e.container.find("label[for=IdUsuario]").parent("div .k-edit-label").hide();
                e.container.find("label[for=IdUsuario]").parent().next("div .k-edit-field").hide();
                Grid_Focus(e, "Nombre");
            } else {
                Grid_Focus(e, "IdUsuario");
            }
            $('[name="IdUsuario"').attr('mayus', 'no');
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdUsuario", title: "Usuario "},
            { field: "Nombre", title: "Nombre del Usuario" }
        ]

    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridUsuario").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridUsuario").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridUsuario").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridUsuario").data("kendoGrid"), dataSource);

    var selectedRowsUser = []
    $("#gridUsuario").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridUsuario"), selectedRowsUser);
        if ($("#gridUsuario").data("kendoGrid").dataSource.total() == 0) {
            Grid_HabilitaToolbar($("#gridUsuarioRoles"), false, false, false);
        } else {
            Grid_HabilitaToolbar($("#gridUsuarioRoles"), Permisos.SNAgregar , false, Permisos.SNBorrar);
        }
    });

    //#endregion Fin creacion de usuarios

    //#region Creacion Usuario Roles ...
    var dsUsuarioRol = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlUsuariosRoles + "/" + Fn_getIdUsuario($("#gridUsuario").data("kendoGrid")); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlUsuariosRoles + "/" + datos.IdUsuario + "/" + datos.IdRol; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlUsuariosRoles + "/" + datos.IdUsuario + "/" + datos.IdRol; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlUsuariosRoles,
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
                id: "IdRol",
                fields: {
                    IdUsuario: { type: "String", defaultValue: function () { return Fn_getIdUsuario($("#gridUsuario").data("kendoGrid")); } },
                    IdRol: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdRol']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdRol").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: { type: "string" },
                    Fecha: { type: "date" }

                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridUsuarioRoles").kendoGrid({
        edit: function (e) {

            //e.container.find("label[for=IdUsuario]").parent("div .k-edit-label").hide();
            //e.container.find("label[for=IdUsuario]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre]").parent().next("div .k-edit-field").hide();
            $('[name="Fecha"]').kendoDatePicker({ format: "dd/MM/yyyy" });
            e.container.find("label[for=Fecha]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Fecha]").parent().next("div .k-edit-field").hide();
            Grid_Focus(e, "IdRol");
         
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdUsuario", title: "Usuario ", editor: Grid_ColLocked, hidden: true},
            { field: "IdRol", title: "Rol", hidden: true, editor: Grid_Combox, values: ["IdRol","Nombre",UrlRoles,"","Seleccione...","required","","Requerido"] },
            { field: "Nombre", title: "Nombre del Rol" },
            { field: "Fecha", title: "Fecha de Asignación", format: "{0:dd/MM/yyyy}",hidden:true}
        ]

    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridUsuarioRoles").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop( $("#gridUsuarioRoles").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridUsuarioRoles").data("kendoGrid"), false, Permisos.SNBorrar);;
    Set_Grid_DataSource($("#gridUsuarioRoles").data("kendoGrid"), dsUsuarioRol);
    Grid_HabilitaToolbar($("#gridUsuarioRoles"), false, false, false);
    var selectedRows = [];
    $("#gridUsuarioRoles").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridUsuarioRoles"), selectedRows);
        
    });

    $("#gridUsuarioRoles").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridUsuarioRoles"), selectedRows);

    });
    //#endregion  fin creacion usuario Roles

    //#region navegacion Grid usuario
   
    $("#gridUsuario").data("kendoGrid").bind("change", function (e) { 
        Grid_SelectRow($("#gridUsuario"), selectedRowsUser);
        $("#gridUsuarioRoles").data("kendoGrid").dataSource.data([]);
        $("#gridUsuarioRoles").data("kendoGrid").dataSource.read();
      
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridUsuario"), ($(window).height() - "371"));
        Fn_Grid_Resize($("#gridUsuarioRoles"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridUsuario"), ($(window).height() - "371"));
    Fn_Grid_Resize($("#gridUsuarioRoles"), ($(window).height() - "371"));

    //#endregion fin Navegacion grid Usuario

});

function Fn_getIdUsuario(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdUsuario;

}

fPermisos = function (datos) {
    Permisos = datos;
}









