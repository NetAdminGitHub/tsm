var Permisos;
let Urlse = TSM_Web_APi + "Departamentos";
$(document).ready(function () {

    //#region Depatamentos
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: Urlse,
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return Urlse + "/" + datos.IdDepartamento; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return Urlse + "/" + datos.IdDepartamento; },
                type: "DELETE"
            },
            create: {
                url: Urlse,
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
                id: "IdDepartamento",
                fields: {
                    IdDepartamento: { type: "number" },
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
            KdoHideCampoPopup(e.container, "IdDepartamento");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdDepartamento", title: "Codigo Departamento", hidden: true },
            { field: "Nombre", title: "Nombre Departamento" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    //#endregion

    //#region Creacion deartamentos Roles ...
    var dsDeptoRoles = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "DepartamentosRoles/GetByIdDepartamento/" + Fn_getIdDepto($("#grid").data("kendoGrid")); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "DepartamentosRoles/" + datos.IdDepartamento + "/" + datos.IdRol; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "DepartamentosRoles/" + datos.IdDepartamento + "/" + datos.IdRol; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "DepartamentosRoles/",
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
                    IdDepartamento: { type: "String", defaultValue: function () { return Fn_getIdDepto($("#grid").data("kendoGrid")); } },
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
                    IdUsuarioMod: { type: "IdUsuarioMod" },
                    Nombre: { type: "string" },
                    FechaMod: { type: "date" },
                    Agregar: { type: "bool" },
                    Editar: { type: "bool" },
                    Borrar: { type: "bool" },
                    Procesar: { type: "bool" },
                    Confidencial: { type: "bool" },
                    CambiarEstados: { type: "bool" },

                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDeptoRoles").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdRol");
            }
            else {
                Grid_Focus(e, "IdRol");
            }

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdUsuarioMod", title: "Usuario ", editor: Grid_ColLocked, hidden: true },
            { field: "IdRol", title: "Rol", hidden: true, editor: Grid_Combox, values: ["IdRol", "Nombre", TSM_Web_APi + "Roles", "", "Seleccione...", "required", "", "Requerido"] },
            { field: "Nombre", title: "Nombre del Rol" },
            { field: "FechaMod", title: "Fecha Mod.", hidden: true },
            { field: "EncargadoArea", title: "Puede Agregar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EncargadoArea"); } },
            { field: "Agregar", title: "Puede Agregar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Agregar"); } },
            { field: "Editar", title: "Puede Editar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Editar"); } },
            { field: "Borrar", title: "Puede Borrar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Borrar"); } },
            { field: "Procesar", title: "Puede Procesar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Procesar"); } },
            { field: "Confidencial", title: "Ver data Confidenacial?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Confidencial"); } },
            { field: "CambiarEstados", title: "Cambiar estado?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "CambiarEstados"); } }
        ]

    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDeptoRoles").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDeptoRoles").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridDeptoRoles").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);;
    Set_Grid_DataSource($("#gridDeptoRoles").data("kendoGrid"), dsDeptoRoles);
    Grid_HabilitaToolbar($("#gridDeptoRoles"), false, false, false);
    var selectedRows = [];
    $("#gridDeptoRoles").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDeptoRoles"), selectedRows);

    });

    $("#gridDeptoRoles").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridDeptoRoles"), selectedRows);

    });
    //#endregion  fin creacion usuario Roles

    var selectedRows1 = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows1);
        if ($("#grid").data("kendoGrid").dataSource.total() === 0) {
            Grid_HabilitaToolbar($("#gridDeptoRoles"), false, false, false);
        } else {
            Grid_HabilitaToolbar($("#gridDeptoRoles"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows1);
        $("#gridDeptoRoles").data("kendoGrid").dataSource.data([]);
        $("#gridDeptoRoles").data("kendoGrid").dataSource.read();
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
});

let Fn_getIdDepto = (g) => {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdDepartamento;
};

fPermisos = function (datos) {
    Permisos = datos;
};