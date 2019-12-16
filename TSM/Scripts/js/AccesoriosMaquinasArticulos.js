var Permisos;
let UrlAMA = TSM_Web_APi + "AccesoriosMaquinasArticulos";
let UrlAM = TSM_Web_APi + "AccesoriosMaquinas/GetFoil";
let UrlArt = TSM_Web_APi + "Articulos/GetListaFoil";
let vidAcc = 0;
$(document).ready(function () {

    //crea combobox
    Kendo_CmbFiltrarGrid($("#CmbAcces"), UrlAM, "Nombre", "IdAccesorio", "Seleccione un Accesorio ....");

    //CONFIGURACION DEL CRUD
    let DsAma = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlAMA + "/GetAccesoriosMaquinasArticulosVista/" + vidAcc; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlAMA + "/" + datos.IdAccesorio + "/" + datos.IdArticulo; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlAMA + "/" + datos.IdAccesorio + "/" + datos.IdArticulo; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlAMA,
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
                id: "IdArticulo",
                fields: {
                    IdArticulo: {
                        type: "string",
                        validation: {
                            required: true,
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
                    },
                    IdAccesorio: {
                        type: "string", defaultValue: function () { return KdoCmbGetValue($("#CmbAcces")); }
                    },
                    Ancho: {
                        type: "number",
                        defaultValue: function () { return 0; }
                    },
                    Alto: {
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
            KdoHideCampoPopup(e.container, "IdAccesorio");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Alto");
            KdoHideCampoPopup(e.container, "Ancho");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "IdArticulo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdAccesorio", title: "Cod. Accesorio", hidden: true },
            { field: "IdArticulo", title: "Cod. Articulo", values: ["IdArticulo", "Nombre", UrlArt, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox },
            { field: "Nombre", title: "Nombre Articulo" },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2] },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), DsAma);

    Kendo_CmbFocus($("#CmbAcces"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbAcces").data("kendoComboBox").bind("select", function (e) {

        if (e.item) {
            let dataItem = this.dataItem(e.item.index());
            vidAcc = dataItem.IdAccesorio;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        }
        else {
            vidAcc = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbAcces").data("kendoComboBox").bind("change", function (e) {
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