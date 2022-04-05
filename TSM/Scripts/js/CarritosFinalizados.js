var Permisos;
$(document).ready(function () {

    let UrlPl = TSM_Web_APi + "Carritos";
    //Codigo del Grid
    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: UrlPl,
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPl + "/" + datos.IdCarrito; },
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //Ordenando GRID

        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdCarrito",
                fields: {
                    IdCarrito: { type: "number" },
                    IdBandeosDisenos: { type: "number" },
                    IdHojaBandeo: {type: "number"},
                    IdCatalogoMaquina: { type: "number" },
                    NombreMaquina: { type: "string" },
                    Estado: { type: "string" },
                    NombreDiseno: { type: "string" },
                    Color: { type: "string" },
                    Estilo: { type: "string" },
                    IdCorte: { type: "string" },
                    Corte: { type: "string" },
                    RangoTallas: { type: "string" },
                    TotalBultos: { type: "number" },
                    TotalPiezas: { type: "number"},
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        },
        sort: { field: "IdCarrito", dir: "asc" }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            Grid_Focus(e, "IdCarrito");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCarrito", title: "Código de Preparación", sortable: { initialDirection: "asc" }},
            { field: "IdBandeosDisenos", title: "Bandeo Diseños"},
            { field: "IdHojaBandeo", title: "Hoja de Bandeo" },
            { field: "Diseno", title: "Diseño" },
            { field: "Color", title: "Color" },
            { field: "Estilo", title: "Estilo" },
            { field: "Corte", title: "Corte" },
            { field: "RangoTallas", title: "Rango de Tallas" },
            { field: "TotalBultos", title: "Total de Bultos" },
            { field: "TotalPiezas", title: "Total de Piezas" },
            { field: "NombreMaquina", title: "Máquina" },
            { field: "Estado", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            {
                field: "btnEntrega", title: "&nbsp;",
                command: {
                    name: "btnEntrega",
                    iconClass: "k-icon k-i-cart k - i - shopping - cart",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.No);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, Permisos.SNBorrar);
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