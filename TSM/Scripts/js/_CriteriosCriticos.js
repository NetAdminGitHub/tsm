let _idPiezaDesarrollada;
var fn_InicializarCriteriosCriticos = function (vIdPiezaDesarrollada) {
    _idPiezaDesarrollada = vIdPiezaDesarrollada;
    var dsCriteriosCriticos = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () {
                        return TSM_Web_APi + "PiezasDesarrolladasCriteriosCriticos/" + _idPiezaDesarrollada;
                    },
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function (datos) { return TSM_Web_APi + "PiezasDesarrolladasCriteriosCriticos/" + datos.IdPiezaDesarrollada + "/" + datos.IdCriterioItem; },
                    type: "PUT",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify({
                            IdPiezaDesarrollada: data.IdPiezaDesarrollada,
                            IdCriterioItem: data.IdCriterioItem,
                            Cumple: data.Cumple,
                            Comentario: data.Comentario,
                            IdUsuarioMod: null,
                            FechaMod: null
                        });
                    }
                }
            },
            requestEnd: Grid_requestEnd,
        schema: {
            model: {
                id: "IdCriterioItem",
                fields: {
                    IdPiezaDesarrollada: { type: "number" },
                    IdCriterioItem: { type: "number" },
                    IdCriterio: { type: "number" },
                    Criterio: { type: "string" },
                    Cumple: { type: "boolean" },
                    IdPerfilCriterio: { type: "number" },
                    IdNivelExigencia: { type: "number" },
                    NivelExigencia: { type: "string" },
                    Comentario: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gridCriteriosCriticos").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPiezaDesarrollada");
            KdoHideCampoPopup(e.container, "IdCriterioItem");
            KdoHideCampoPopup(e.container, "IdCriterio");
            KdoHideCampoPopup(e.container, "IdPerfilCriterio");
            KdoHideCampoPopup(e.container, "IdNivelExigencia");
            KdoHideCampoPopup(e.container, "Criterio");
            KdoHideCampoPopup(e.container, "NivelExigencia");

            Grid_Focus(e, "Comentario");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPiezaDesarrollada", title: "IdPiezaDesarrollada", hidden: true, menu: false },
            { field: "IdCriterioItem", title: "IdCriterioItem", hidden: true, menu: false },
            { field: "IdCriterio", title: "IdCriterio", hidden: true, menu: false },
            { field: "Criterio", title: "Criterio" },
            { field: "NivelExigencia", title: "Nivel Exigencia" },
            { field: "Comentario", title: "Comentario" },
            { field: "Cumple", title: "Cumple", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Cumple"); } },
            { field: "IdPerfilCriterio", title: "IdPerfilCriterio", width: 100, hidden: true },
            { field: "IdNivelExigencia", title: "IdNivelExigencia", hidden: true }            
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridCriteriosCriticos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, false, redimensionable.Si, 450);
    SetGrid_CRUD_ToolbarTop($("#gridCriteriosCriticos").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridCriteriosCriticos").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridCriteriosCriticos").data("kendoGrid"), dsCriteriosCriticos, 20);

    var verSeteoSelrows = [];
    $("#gridCriteriosCriticos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCriteriosCriticos"), verSeteoSelrows);
    });

    $("#gridCriteriosCriticos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCriteriosCriticos"), verSeteoSelrows);
    });
};

var fn_CargarCriteriosCriticos = function (vIdPiezaDesarrollada) {
    _idPiezaDesarrollada = vIdPiezaDesarrollada;
    $("#gridCriteriosCriticos").data("kendoGrid").dataSource.read();
};