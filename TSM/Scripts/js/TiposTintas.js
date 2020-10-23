var Permisos;
let UrlTT = TSM_Web_APi + "TiposTintas";
let UrlQ = TSM_Web_APi + "Quimicas";
let  vIdQui = 0;
$(document).ready(function () {

    //crea combobox
    Kendo_CmbFiltrarGrid($("#CmbQuimica"), UrlQ, "Nombre", "IdQuimica", "Seleccione una Química ....");

    //CONFIGURACION DEL CRUD
    let DsTT = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlTT + "/GetbyIdQuimicaVista/" + vIdQui; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlTT + "/" + datos.IdTipoTinta; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlTT + "/" + datos.IdTipoTinta; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlTT,
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
                id: "IdTipoTinta",
                fields: {
                    IdTipoTinta: {
                        type: "Number",
                        validation: {
                            required: true
                        }
                    },
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
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    IdQuimica: {
                        type: "Number", defaultValue: function () { return KdoCmbGetValue($("#CmbQuimica")); }
                    },
                    NoPasadas: {
                        type: "number",
                        defaultValue: function () { return 0; }
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdQuimica");
            KdoHideCampoPopup(e.container, "IdTipoTinta");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdTipoTinta", title: "Cod. Tipo Tinta", hidden: true },
            { field: "Nombre", title: "Tipo Tinta" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdQuimica", title: "Cod. Química", hidden: true },
            { field: "NoPasadas", title: "No Pasadas", editor: Grid_ColNumeric, values: ["", "0", "999", "#", 0] },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), DsTT);

    Kendo_CmbFocus($("#CmbQuimica"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbQuimica").data("kendoComboBox").bind("select", function (e) {

        if (e.item) {
            let dataItem = this.dataItem(e.item.index());
            vIdQui = dataItem.IdQuimica;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {
            vIdQui = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbQuimica").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
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
}