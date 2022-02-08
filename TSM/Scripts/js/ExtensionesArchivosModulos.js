var Permisos;
let vIdTecnica = 0;
$(document).ready(function () {

    var vIdModulo = 0;
    // combo box
    Kendo_CmbFiltrarGrid($("#CmbModulo"), TSM_Web_APi+"Modulos", "Nombre", "IdModulo", "Seleccione un modulo ....");
    //#region "grid tecnicas "
    var dataSource = new kendo.data.DataSource({

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi +"ExtensionesArchivosModulos/GetbyModuloVista/" + vIdModulo; },

                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi +"ExtensionesArchivosModulos/" + datos.IdExtensionArchivo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "ExtensionesArchivosModulos/" + datos.IdExtensionArchivo; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi +"ExtensionesArchivosModulos",
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
                id: "IdExtensionArchivo",
                fields: {
                    IdExtensionArchivo: { type: "number" },
                    IdModulo: {
                        type: "string",
                        defaultValue: function (e) { return $("#CmbModulo").val(); }
                    },
                    NombreModulo: {
                        type: "string",
                       
                    },
                    Extension: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Extension']") && input.val().length > 10) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
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

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdExtensionArchivo");
            KdoHideCampoPopup(e.container, "IdModulo");
            KdoHideCampoPopup(e.container, "NombreModulo");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            $('[name="Extension"').attr('mayus', 'no');
            Grid_Focus(e, "Extension");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdExtensionArchivo", title: "idextencion", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdModulo", title: "IdModulo", hidden: true },
            { field: "NombreModulo", title: "Modulo", hidden: true},
            { field: "Extension", title: "Extension" },
            { field: "Nombre", title: "Nombre" },
            { field: "IdUsuarioMod", title: "Usuario", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", hidden: true, format: "{0:dd/MM/yyyy HH:mm:ss}" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Kendo_CmbFocus($("#CmbModulo"));
    //Deshailitar toolbar.
    Grid_HabilitaToolbar($("#grid"), false, false, false);
    $("#grid").data("kendoGrid").hideColumn("EsImpresion");
    $("#grid").data("kendoGrid").hideColumn("EsSublimacion");
    $("#grid").data("kendoGrid").hideColumn("EsPlantilla");
    //#endregion




    $("#CmbModulo").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            vIdModulo = dataItem.IdModulo;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), true, true, true);
        }
        else {
            Grid_HabilitaToolbar($("#grid"), false, false, false);

        }
    });

    $("#CmbModulo").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        selectedRows = [];
        if (value === "") {
            vIdModulo = 0;
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

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));
    });

    Fn_Grid_Resize($("#grid"), ($(window).height() - "371"));


});

fPermisos = function (datos) {
    Permisos = datos;
};