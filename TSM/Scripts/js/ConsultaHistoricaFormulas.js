var fn_DRLoadConsultaHis = function (divCcf) {
  
    KdoButton($("#btnCCFH"), "search", "buscar..");
    $("#TxtNombreColor").focus().select();
    fn_gCHForBusqueda(divCcf);
 
};
var fn_gCHForBusqueda = function (divCcf) {

    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "AXFormulaciones/GetbyCodigoColor/FC-0086881"; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "CodigoColor",
                fields: {
                    CodigoColor: { type: "string" },
                    CodigoDiseno: { type: "string" },
                    FechaFormula: { type: "date" },
                    NombreColor: { type: "string" },
                    ColorTela: { type: "string" },
                    ComposicionTela: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gCHFor").kendoGrid({
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "CodigoColor", title: "Codigo Color", hidden: true },
            { field: "CodigoDiseno", title: "Codigo Diseno" },
            { field: "FechaFormula", title: "Fecha Formula", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" },
            { field: "NombreColor", title: "Nombre del Color" },
            { field: "ColorTela", title: "Color Tela" },
            { field: "ComposicionTela", title: "Composicion Tela" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gCHFor").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 250);
    Set_Grid_DataSource($("#gCHFor").data("kendoGrid"), dataSource);

    var selectedRowsServ = [];
    $("#gCHFor").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gCHFor"), selectedRowsServ);
        let grid = this;
        grid.tbody.find("tr").dblclick(function (e) {
            $("#" + divCcf + "").trigger("ObtenerFormula", [grid.dataItem(this).CodigoColor]);
            $("#" + divCcf + "").data("kendoDialog").close();
        });
    });

    $("#gCHFor").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gCHFor"), selectedRowsServ);
    });

    // gCHFor detalle
    function detailInit(e) {
        var vCColor = e.data.CodigoColor;
        var VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "AXFormulacionesDetalles/GetbyCodigoColor/" + vCColor; },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            schema: {
                model: {
                    id: "CodigoColor",
                    fields: {
                        CodigoColor: { type: "string" },
                        ItemId: { type: "string" },
                        Nombre: { type: "string" },
                        Porcentaje: { type: "number" }
                    }
                }
            },
            filter: { field: "CodigoColor", operator: "eq", value: e.data.CodigoColor }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "CodigoColor", title: "Codigo Color", hidden: true },
                { field: "ItemId", title: "Articulo" },
                { field: "Nombre", title: "Nombre" },
                { field: "Porcentaje", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}" }
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gCHFor_detalle" + vCColor);

        var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsTec);
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 250);
        Set_Grid_DataSource(g, ds);
    }

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gCHFor"), $(window).height() - "500");
    });

    Fn_Grid_Resize($("#gCHFor"), $(window).height() - "500");



};