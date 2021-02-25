var IdServicio = 0;
var Permisos;

$(document).ready(function () {
    Kendo_CmbFiltrarGrid($("#CmbIdServicio"), UrlApiServ, "Nombre", "IdServicio", "Seleccione un servicio ....");

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/GetByServicio/" + IdServicio; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdEstructuraMaquina; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdEstructuraMaquina; },
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdEstructuraMaquina",
                fields: {
                    IdEstructuraMaquina: { type: "number" },
                    IdServicio: { type: "number", defaultValue: function (e) { return $("#CmbIdServicio").val(); } },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Modelo']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='CantidadEstaciones']") && input.val() <= 0) {
                                    input.attr("data-maxlength-msg", "Requed0 mayor que Cero");
                                    return false;
                                }
                                if (input.is("[name='Marca']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitu máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdFormaMaquina']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdFormaMaquina").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdTipoMaquina']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoMaquina").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdCategoriaMaquina']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaMaquina").data("kendoComboBox").selectedIndex >= 0;
                                }

                                return true;
                            }
                        }
                    },
                    Modelo: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Marca: { type: "string" },
                    Descripcion: { type: "string" },
                    CantidadEstaciones:{ type: "number" },
                    IdFormaMaquina: { type: "string" },
                    NombreForma: { type: "string" },
                    IdTipoMaquina: { type: "string" },
                    NombreTipoMaquina: { type: "string" },
                    IdCategoriaMaquina: { type: "string" },
                    NombreCategoriaMaquina: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdServicio");
            KdoHideCampoPopup(e.container, "IdEstructuraMaquina");
            KdoHideCampoPopup(e.container, "NombreForma");
            KdoHideCampoPopup(e.container, "NombreTipoMaquina");
            KdoHideCampoPopup(e.container, "NombreCategoriaMaquina");
            Grid_Focus(e, "Modelo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEstructuraMaquina", title: "Código costo tecnica", hidden: true },
            { field: "IdServicio", title: "IdServicio", hidden: true },
            { field: "Modelo", title: "Modelo" },
            { field: "Nombre", title: "Nombre" },
            { field: "Marca", title: "Marca" },
            { field: "Descripcion", title: "Descripcion" },
            { field: "CantidadEstaciones", title: "Cantidad Estaciones", editor: Grid_ColIntNumSinDecimal },
            { field: "IdFormaMaquina", title: "Forma", editor: Grid_Combox, values: ["IdFormaMaquina", "Nombre", TSM_Web_APi + "FormasMaquinas/GetFormas", "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreForma", title: "Forma" },
            {field: "IdTipoMaquina", title: "Tipo Maquina", editor: Grid_Combox, values: ["IdTipoMaquina", "Nombre", TSM_Web_APi +"TiposMaquinas", "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreTipoMaquina", title: "Tipo Maquina" },
            { field: "IdCategoriaMaquina", title: "Categoría Maquina", editor: Grid_Combox, values: ["IdCategoriaMaquina", "Nombre", TSM_Web_APi + "CategoriaMaquinas", "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NombreCategoriaMaquina", title: "Categoría Maquina" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    Grid_HabilitaToolbar($("#grid"), false, false, false);

    $("#CmbIdServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            IdServicio = dataItem.IdServicio;
            $("#grid").data("kendoGrid").dataSource.read();
            Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            $("#grid").data("kendoGrid").showColumn("Nombre3");
            if (IdServicio === 2 || IdServicio === 3) {
                $("#grid").data("kendoGrid").hideColumn("Nombre3");
            }

        }
        else {
            Grid_HabilitaToolbar($("#grid"), false, false, false);
        }
    });

    $("#CmbIdServicio").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        selectedRows = [];
        if (value === "") {
            IdServicio = 0;
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