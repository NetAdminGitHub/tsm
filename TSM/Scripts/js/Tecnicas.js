var Permisos;
let vIdTecnica = 0;
$(document).ready(function () {
    
    var VarIdServicio = 0;
    // combo box
    Kendo_CmbFiltrarGrid($("#CmbServicio"), VistaServiciosUlr, "Nombre", "IdServicio", "Seleccione un Servicio ....");
    //#region "grid tecnicas "
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
                    EsPapel: { type: "boolean"},
                    EsImpresion: { type: "boolean" },
                    EsSublimacion: { type: "boolean" },
                    EsPlantilla: { type: "boolean" },
                    EsEstampado: { type: "boolean" },
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
                    },
                    Icono: {
                        type: "string"
                    },
                    AplicaCapilar: {
                        type: "boolean"
                    },
                    AplicaSeda: {
                        type: "boolean"
                    },
                    PermiteArrastrar: {
                        type: "boolean"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdTecnica]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdTecnica]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdServicio]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdServicio]").parent().next("div .k-edit-field").hide();   
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();   
            e.container.find("label[for=FechaMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=FechaMod]").parent().next("div .k-edit-field").hide();   

            KdoHideCampoPopup(e.container, "IconoView");
            $('[name="Icono"').attr('mayus', 'no');

            // DESHABILITAR OPCIONES DE CONFIGURACIONES SEGUN EL SERVICIO SELECCIONADO
            switch ($("#CmbServicio").data("kendoComboBox").value()) {
                case "1":

                    e.container.find("label[for=EsImpresion]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsImpresion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsSublimacion]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsSublimacion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsPlantilla]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsPlantilla]").parent().next("div .k-edit-field").hide();

                    break;

                case "2":
                    e.container.find("label[for=EsPapel]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsPapel]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsPlantilla]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsPlantilla]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsEstampado]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsEstampado]").parent().next("div .k-edit-field").hide();


                    break;

                case "3":

                    e.container.find("label[for=EsImpresion]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsImpresion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsSublimacion]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsSublimacion]").parent().next("div .k-edit-field").hide();

                    e.container.find("label[for=EsEstampado]").parent("div .k-form-field").hide();
                    e.container.find("label[for=EsEstampado]").parent().next("div .k-edit-field").hide();
         
                
                    break;
            
            }
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTecnica", title: "Codigo de técnica", editor: Grid_ColInt64NumSinDecimal,hidden:true },
            { field: "Nombre", title: "Nombre de técnica" },
            { field: "Icono", title: "Icono" },
            { field: "IdServicio", title: "servicio", hidden: true},
            { field: "Nombre1", title: "Nombre servicio",hidden: true },
            { field: "EsPapel", title: "Es papel?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); } },
            { field: "EsImpresion", title: "Técnica proceso impresión?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsImpresion"); }  },
            { field: "EsSublimacion", title: "Técnica proceso sublimación?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsSublimacion"); } },
            { field: "EsPlantilla", title: "Técnica para plantilla?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPlantilla"); }  },
            { field: "EsEstampado", title: "Técnica para estampado?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsEstampado"); } },
            { field: "IdUsuarioMod", title: "Usuario", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", hidden: true, format: "{0:dd/MM/yyyy HH:mm:ss}" },
            { field: "AplicaCapilar", title: "Aplica Capilar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "AplicaCapilar"); } },
            { field: "AplicaSeda", title: "Aplica Seda?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "AplicaSeda"); } },
            { field: "PermiteArrastrar", title: "Permite Arrastrar?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "PermiteArrastrar"); } },
            {
                template: "<div class='customer-photo' style='text-align:-webkit-center;'" +
                    "><span class='#: (data.Icono ===null? '': data.Icono).startsWith('k-i') === true ? 'k-icon ' + data.Icono : data.Icono  #' style='font-size:xx-large;'></span></div>",
                field: "IconoView",
                title: "Ícono"
            }
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
//#endregion

    //#region Articulos sugeridos  
    let UrlArt = TSM_Web_APi + "Articulos";
    let DsArtSugeridos = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "TecnicasArticulos/GetByidTecnica/" + vIdTecnica; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "TecnicasArticulos/" + datos.IdTecnica + "/" + datos.IdArticulo; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "TecnicasArticulos",
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
                id: "IdArticulo",
                fields: {
                    IdTecnica: {
                        type: "number", defaultValue: function () {
                            return Fn_getIdTecnica($("#grid").data("kendoGrid"));
                        }
                    },
                    IdArticulo: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    }
                }
            }
        }



    });

    $("#gridTecnicaArt").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdTecnica");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdArticulo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTecnica", title: "Código Tecnica", hidden: true },
            { field: "IdArticulo", title: "Articulo", editor: Grid_Combox, values: ["IdArticulo", "Nombre", UrlArt, "", "Seleccione un Articulo....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre" }

        ]

    });

    SetGrid($("#gridTecnicaArt").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridTecnicaArt").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridTecnicaArt").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridTecnicaArt").data("kendoGrid"), DsArtSugeridos);
    Grid_HabilitaToolbar($("#gridTecnicaArt"), false, false, false);

    var sRsug = [];
    $("#gridTecnicaArt").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridTecnicaArt"), sRsug);
    });
    $("#gridTecnicaArt").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridTecnicaArt"), sRsug);
    });


    //#endregion 


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
            Grid_HabilitaToolbar($("#gridTecnicaArt"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        selectedRows = [];
        if (value === "") {
            VarIdServicio = 0;
            $("#grid").data("kendoGrid").dataSource.data([]);
            $("#gridTecnicaArt").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
            Grid_HabilitaToolbar($("#gridTecnicaArt"), false, false, false);
        }
    });

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_ConsultarArtSug();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridTecnicaArt"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#gridTecnicaArt"), ($(window).height() - "371"));
});

let fn_ConsultarArtSug = function () {
    vIdTecnica = Fn_getIdTecnica($("#grid").data("kendoGrid"));
    $("#gridTecnicaArt").data("kendoGrid").dataSource.read();
    $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridTecnicaArt"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridTecnicaArt"), false, false, false);
};

let Fn_getIdTecnica = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdTecnica;

};
fPermisos = function (datos) {
    Permisos = datos;
};