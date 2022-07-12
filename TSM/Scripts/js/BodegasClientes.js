var Permisos;
let UrlRF = TSM_Web_APi + "BodegasClientes";

$(document).ready(function () {
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlRF+"/GetBodegasClientes",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlRF + "/" + datos.IdBodegaCliente; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlRF + "/" + datos.IdBodegaCliente; },
                type: "DELETE"
            },
            create: {
                url: UrlRF,
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
            if (e.type === "destroy" || e.type === "update" || e.type === "create") {
                $("#grid").data("kendoGrid").dataSource.read();

            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdBodegaCliente",
                fields: {
                    IdBodegaCliente: { type: "number" },
                    IdCliente: { type: "number" },
                    NombreCliente: {type:"string"},
                    Nombre: {
                        type: "string",
                        validation: {
                            //required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length === 0) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return false;
                                }
                                if (input.is("[name='Descripcion']") && input.val().length > 500) {
                                    input.attr("data-maxlength-msg", "La longitud máxima del campo es 500");
                                    return false;
                                }
                                if (input.is("[name='IdCliente']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCliente").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdRecintoFiscal']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdRecintoFiscal").data("kendoComboBox").selectedIndex >= 0;
                                }
                              
                                return true;
                            }
                        }                        
                    },
                    Descripcion: { type: "string" },
                    IdRecintoFiscal: { type: "number" },
                    NombreRecintoFiscal: {type: "string"},
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Direccion: { type: "string"}
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdBodegaCliente");
            KdoHideCampoPopup(e.container, "NombreCliente");
            KdoHideCampoPopup(e.container, "NombreRecintoFiscal");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");

            $('[name="IdCliente"]').on('change', function (e) {
                $("[name='NombreCliente']").val($('[name="IdCliente"]').data("kendoComboBox").text());
                $("[name='NombreCliente']").trigger("change");
            });
            $('[name="IdRecintoFiscal"]').on('change', function (e) {
                $("[name='NombreRecintoFiscal']").val($('[name="IdRecintoFiscal"]').data("kendoComboBox").text());
                $("[name='NombreRecintoFiscal']").trigger("change");
            });
            Grid_Focus(e, "Nombre");
        },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBodegaCliente", title: "Bodega de cliente", hidden: true },
            { field: "Nombre", title: "Nombre" },
            { field: "IdCliente", title: "Cliente", editor: Grid_Combox, values: ["IdCliente", "Nombre", TSM_Web_APi + "Clientes", "", "Seleccione....","","",""], hidden: true  },
            { field: "NombreCliente", title: "Cliente", hidden: false },
            { field: "Descripcion", title: "Descripción" },
            { field: "Direccion", title: "Dirección" },
            { field: "IdRecintoFiscal", title: "Recinto Fiscal", editor: Grid_Combox, values: ["IdRecintoFiscal", "Nombre", TSM_Web_APi + "RecintosFiscales", "", "Seleccione...."], hidden: true },
            { field: "NombreRecintoFiscal", title: "Recinto Fiscal", hidden: false },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });
     
    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
});

fPermisos = function (datos) {
    Permisos = datos;
};