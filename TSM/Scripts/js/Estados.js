var Permisos;
$(document).ready(function () {
    $("#TabSimulacion").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });

//#region Grid Estados
    //CONFIGURACION DEL CRUD
    var VarTabla = 0;
    // combo box
    Kendo_CmbFiltrarGrid($("#CmbTabla"), VistaTablasUlr, "Tabla", "Tabla", "Seleccione una Tabla ....");
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function(datos) { return crudServiceBaseUrl + "/" + VarTabla; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.Id; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }

            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.Id; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) { console.log(data); }
            },
            parameterMap: function (data, type) {
                if (type !== "read") {

                    return kendo.stringify(data);
                }


            }

        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        
        //push: function (e) { alert(e.index); },
        // VALIDAR ERROR
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "Id",
                fields: {
                    Id: {
                        type: "string"

                    },
                    Tabla: {
                        type: "string",
                        defaultValue: function(e) { return $("#CmbTabla").val(); }
                    },
                    Estado: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='Estado']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 20");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },

                    Nombre: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    }


                }
            }
        }

    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
       
        edit: function (e) {
            //PERMITE OCULTAR CAMPOS EN EL EDITOR POPUP.
            e.container.find("label[for=Id]").parent("div .k-form-field").hide();
            e.container.find("label[for=Id]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Tabla]").parent("div .k-form-field").hide();
            e.container.find("label[for=Tabla]").parent().next("div .k-edit-field").hide();

            if (!e.model.isNew()) {
                e.container.find("label[for=Estado]").parent("div .k-form-field").hide();
                e.container.find("label[for=Estado]").parent().next("div .k-edit-field").hide();

                Grid_Focus(e, "Nombre");
            }
            else {

                Grid_Focus(e, "Estado");
            }

       
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "Estado", title: "Estado" },
            { field: "Nombre", title: "Descripción del Estado" }

        ]

    });

   
    //$("#grid").data("kendoGrid").bind("change", function (e) { //foco en la fila
      
    //});

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Grid_HabilitaToolbar($("#grid"), false, false, false);
//#endregion Grid Estados

//#region Grid Estados Siguientes
    //CONFIGURACION DEL CRUD
    var dataSourceES = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlES + "/" + VarTabla + "/" + getEstado($("#grid").data("kendoGrid")); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlES + "/" + VarTabla + "/" + getEstado($("#grid").data("kendoGrid")) + "/" + datos.EstadoSiguiente; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlES + "/" + datos.Tabla + "/" + datos.Estado + "/" + datos.EstadoSiguiente; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlES,
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
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "EstadoSiguiente",
                fields: {
                     Tabla: {
                        type: "string",
                        defaultValue: function (e) { return $("#CmbTabla").val(); },
                    },
                    Estado: {
                        type: "string",
                        defaultValue: function (e) { return getEstado($("#grid").data("kendoGrid")); },
                    },
                    EstadoSiguiente: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre: {
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

    $("#gridEstadosSiguientes").kendoGrid({
        edit: function (e) {
            //PERMITE OCULTAR CAMPOS EN EL EDITOR POPUP.
            e.container.find("label[for=Id]").parent("div .k-form-field").hide();
            e.container.find("label[for=Id]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Tabla]").parent("div .k-form-field").hide();
            e.container.find("label[for=Tabla]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Estado]").parent("div .k-form-field").hide();
            e.container.find("label[for=Estado]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();

            var NewDSSub = new kendo.data.DataSource({
                sort: { field: "Nombre", dir: "asc" },
                transport: {
                    read: function (datos) {
                        $.ajax({
                            dataType: 'json',
                            url: crudServiceBaseUrl + "/" + VarTabla,
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                datos.success(result);
                            }
                        });
                    }
                }
            });

            $('[name="EstadoSiguiente"]').data("kendoComboBox").setDataSource(NewDSSub);


            $('[name="EstadoSiguiente"]').data("kendoComboBox").bind("change", function (p) {
                $("#gridEstadosSiguientes").data("kendoGrid").dataItem("tr[data-uid='" + e.model.uid + "']").set("Nombre", $('[name="EstadoSiguiente"]').data("kendoComboBox").text());
            });

            if (!e.model.isNew()) {
                e.container.find("label[for=EstadoSiguiente]").parent("div .k-form-field").hide();
                e.container.find("label[for=EstadoSiguiente]").parent().next("div .k-edit-field").hide();

                Grid_Focus(e, "Nombre");
            }
            else {
                Grid_Focus(e, "EstadoSiguiente");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "EstadoSiguiente", title: "Estado Siguiente", editor: Grid_Combox, values: ["Estado", "Nombre", crudServiceBaseUrl, "", "Seleccione....", "required", "", "Requerido"] },
            { field: "Nombre", title: "Descripción del Estado" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", hidden: true }
        ]
    });

    var selectedRowsES = [];
    $("#gridEstadosSiguientes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridEstadosSiguientes"), selectedRowsES);
    });

    $("#gridEstadosSiguientes").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridEstadosSiguientes"), selectedRowsES);
    });

    SetGrid($("#gridEstadosSiguientes").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridEstadosSiguientes").data("kendoGrid"), false, Permisos.SNBorrar);
    SetGrid_CRUD_ToolbarTop($("#gridEstadosSiguientes").data("kendoGrid"), Permisos.SNAgregar);
    Set_Grid_DataSource($("#gridEstadosSiguientes").data("kendoGrid"), dataSourceES);
    Grid_HabilitaToolbar($("#gridEstadosSiguientes"), false, false, false);
//#endregion Grid Estados Siguientes

//#region Grid Estados Autorizados
    //CONFIGURACION DEL CRUD
    var dataSourceEA = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlEA + "/" + getEstado($("#grid").data("kendoGrid")) + "/" + VarTabla; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlEA + "/" + datos.Estado + "/" + datos.Tabla + "/" + datos.IdRol; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlEA + "/" + datos.Estado + "/" + datos.Tabla + "/" + datos.IdRol; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlEA,
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
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdRol",
                fields: {
                    Tabla: {
                        type: "string",
                        defaultValue: function (e) { return $("#CmbTabla").val(); },
                    },
                    Estado: {
                        type: "string",
                        defaultValue: function (e) { return getEstado($("#grid").data("kendoGrid")); },
                    },
                    IdRol: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre: {
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

    $("#gridEstadosAutorizados").kendoGrid({
        edit: function (e) {
            //PERMITE OCULTAR CAMPOS EN EL EDITOR POPUP.
            e.container.find("label[for=Id]").parent("div .k-form-field").hide();
            e.container.find("label[for=Id]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Tabla]").parent("div .k-form-field").hide();
            e.container.find("label[for=Tabla]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Estado]").parent("div .k-form-field").hide();
            e.container.find("label[for=Estado]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=FechaMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();

            $('[name="IdRol"]').data("kendoComboBox").bind("change", function (p) {
                $("#gridEstadosAutorizados").data("kendoGrid").dataItem("tr[data-uid='" + e.model.uid + "']").set("Nombre", $('[name="IdRol"]').data("kendoComboBox").text());
            });

            if (!e.model.isNew()) {
                e.container.find("label[for=IdRol]").parent("div .k-form-field").hide();
                e.container.find("label[for=IdRol]").parent().next("div .k-edit-field").hide();

                Grid_Focus(e, "Nombre");
            }
            else {
                Grid_Focus(e, "IdRol");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "IdRol", title: "Rol", editor: Grid_Combox, values: ["IdRol", "Nombre", UrlRoles, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre", title: "Nombre Rol" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", hidden: true }
        ]
    });

    var selectedRowsEA = [];
    $("#gridEstadosAutorizados").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridEstadosAutorizados"), selectedRowsEA);
    });

    $("#gridEstadosAutorizados").data("kendoGrid").bind("change", function (e) { //foco en la fila
        Grid_SelectRow($("#gridEstadosAutorizados"), selectedRowsEA);
    });

    SetGrid($("#gridEstadosAutorizados").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridEstadosAutorizados").data("kendoGrid"), false, Permisos.SNBorrar);
    SetGrid_CRUD_ToolbarTop($("#gridEstadosAutorizados").data("kendoGrid"), Permisos.SNAgregar);
    Set_Grid_DataSource($("#gridEstadosAutorizados").data("kendoGrid"), dataSourceEA);
    Grid_HabilitaToolbar($("#gridEstadosAutorizados"), false, false, false);
//#endregion Grid Estados Siguientes


    //recargar grid de estados siguientes y autorizados.

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);

        $("#gridEstadosAutorizados").data("kendoGrid").dataSource.data([]);
        $("#gridEstadosAutorizados").data("kendoGrid").dataSource.read();

        $("#gridEstadosSiguientes").data("kendoGrid").dataSource.data([]);
        $("#gridEstadosSiguientes").data("kendoGrid").dataSource.read();

        //if (VarTabla != "" && getEstado($("#grid").data("kendoGrid"))) {
        //    Set_Grid_DataSource($("#gridEstadosSiguientes").data("kendoGrid"), dataSourceES);
        //    $("#gridEstadosSiguientes").data("kendoGrid").dataSource.read();
        //    Grid_HabilitaToolbar($("#gridEstadosSiguientes"), Permisos.SNAgregar, false, Permisos.SNBorrar);

        //    Set_Grid_DataSource($("#gridEstadosAutorizados").data("kendoGrid"), dataSourceEA);
        //    $("#gridEstadosAutorizados").data("kendoGrid").dataSource.read();
        //    Grid_HabilitaToolbar($("#gridEstadosAutorizados"), Permisos.SNAgregar, false, Permisos.SNBorrar);
        //}
    });

    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
        if ($("#grid").data("kendoGrid").dataSource.total() == 0) {
            $("#gridEstadosSiguientes").data("kendoGrid").dataSource.data([]);
            $("#gridEstadosAutorizados").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridEstadosSiguientes"), false, false, false);
            Grid_HabilitaToolbar($("#gridEstadosAutorizados"), false, false, false);
        } else {
            Grid_HabilitaToolbar($("#gridEstadosSiguientes"), Permisos.SNAgregar, false, Permisos.SNBorrar);
            Grid_HabilitaToolbar($("#gridEstadosAutorizados"), Permisos.SNAgregar, false, Permisos.SNBorrar);
        }
    });

//#region ComboBox de Tablas
    $("#CmbTabla").data("kendoComboBox").bind("select", function(e) {

        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarTabla = dataItem.Tabla;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar , Permisos.SNEditar , Permisos.SNBorrar);
        }
        else {
            VarTabla = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbTabla").data("kendoComboBox").bind("change", function(e) {
        var value = this.value();
        if (value === "") {
            $("#grid").data("kendoGrid").dataSource.data([]);
        }       
    });    

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridEstadosSiguientes"), ($(window).height() - "371"));
        Fn_Grid_Resize($("#gridEstadosAutorizados"), ($(window).height() - "371"));
        Fn_Grid_Resize($("#grid"), ($(window).height() - "401"));
    });

    Fn_Grid_Resize($("#gridEstadosSiguientes"), ($(window).height() - "371"));
    Fn_Grid_Resize($("#gridEstadosAutorizados"), ($(window).height() - "371"));
    Fn_Grid_Resize($("#grid"), ($(window).height() - "401"));
});  
//#endregion ComboBox de tablas.

var getEstado = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;
}

fPermisos = function (datos) {
    Permisos = datos;
}