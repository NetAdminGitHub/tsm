var Permisos;

$(document).ready(function () {
    
    var VarIdServicio = 0;
    // combo box
    Kendo_CmbFiltrarGrid($("#CmbServicio"), VistaServiciosUlr, "Nombre", "IdServicio", "Seleccione un Servicio ....");

    var dataSource = new kendo.data.DataSource({
    
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/GetbyServicio/" + VarIdServicio; },
       
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTecnica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdTecnica; },
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
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
                id: "IdTecnica",
                fields: {
                    IdTecnica: { type: "number" },
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
                    EsPapel: {type: "bool"},
                    EsImpresion: { type: "bool" },
                    EsSublimacion: { type: "bool" },
                    EsPlantilla: { type: "bool" },
                    EsEstampado: { type: "bool" },
                    IdServicio: {
                        type: "string",
                        defaultValue: function (e) { return $("#CmbServicio").val(); }
                    },
                    Nombre1: {
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

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdTecnica]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdTecnica]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-edit-label").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdServicio]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdServicio]").parent().next("div .k-edit-field").hide();   
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();   
            e.container.find("label[for=FechaMod]").parent("div .k-edit-label").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();   

            // DESHABILITAR OPCIONES DE CONFIGURACIONES SEGUN EL SERVICIO SELECCIONADO
            switch ($("#CmbServicio").data("kendoComboBox").value()) {
                case "1":

                    e.container.find("label[for=EsImpresion]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsImpresion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsSublimacion]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsSublimacion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsPlantilla]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsPlantilla]").parent().next("div .k-edit-field").hide();

                    break;

                case "2":
                    e.container.find("label[for=EsPapel]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsPapel]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsPlantilla]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsPlantilla]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsEstampado]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsEstampado]").parent().next("div .k-edit-field").hide();


                    break;

                case "3":

                    e.container.find("label[for=EsImpresion]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsImpresion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsSublimacion]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsSublimacion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsEstampado]").parent("div .k-edit-label").hide();
                    e.container.find("label[for=EsEstampado]").parent().next("div .k-edit-field").hide();
         
                
                    break;
            
            }
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTecnica", title: "Codigo de técnica", editor: Grid_ColInt64NumSinDecimal,hidden:true },
            { field: "Nombre", title: "Nombre de técnica" },
            { field: "IdServicio", title: "servicio", hidden: true},
            { field: "Nombre1", title: "Nombre servicio",hidden: true },
            { field: "EsPapel", title: "Es papel?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); } },
            { field: "EsImpresion", title: "Técnica proceso impresión?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsImpresion"); }  },
            { field: "EsSublimacion", title: "Técnica proceso sublimación?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsSublimacion"); } },
            { field: "EsPlantilla", title: "Técnica para plantilla?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPlantilla"); }  },
            { field: "EsEstampado", title: "Técnica para estampado?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsEstampado"); } },
            { field: "IdUsuarioMod", title: "Usuario", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", hidden: true, format: "{0:dd/MM/yyyy HH:mm:ss}" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true,  true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Kendo_CmbFocus($("#CmbServicio"));
    //Deshailitar toolbar.
    Grid_HabilitaToolbar($("#grid"), false, false, false);
    $("#grid").data("kendoGrid").hideColumn("EsImpresion");
    $("#grid").data("kendoGrid").hideColumn("EsSublimacion");
    $("#grid").data("kendoGrid").hideColumn("EsPlantilla");

    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            VarIdServicio = dataItem.IdServicio;
            $("#grid").data("kendoGrid").showColumn("EsImpresion");
            $("#grid").data("kendoGrid").showColumn("EsSublimacion");
            $("#grid").data("kendoGrid").showColumn("EsPlantilla");
            $("#grid").data("kendoGrid").showColumn("EsPapel");
            $("#grid").data("kendoGrid").showColumn("EsEstampado");

            switch (VarIdServicio) {
                case 1:
                    $("#grid").data("kendoGrid").hideColumn("EsImpresion");
                    $("#grid").data("kendoGrid").hideColumn("EsSublimacion");
                    $("#grid").data("kendoGrid").hideColumn("EsPlantilla");
                    break;

                case 2:

                    $("#grid").data("kendoGrid").hideColumn("EsPapel");
                    $("#grid").data("kendoGrid").hideColumn("EsPlantilla");
                    $("#grid").data("kendoGrid").hideColumn("EsEstampado");
                    break;

                case 3:

                    $("#grid").data("kendoGrid").hideColumn("EsImpresion");
                    $("#grid").data("kendoGrid").hideColumn("EsSublimacion");
                    $("#grid").data("kendoGrid").hideColumn("EsEstampado");
                    break;

            }
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), true, true, true);
        }
        else {
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        selectedRows = [];
        if (value === "") {
            VarIdServicio = 0;
            $("#grid").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
});

fPermisos = function (datos) {
    Permisos = datos;
};