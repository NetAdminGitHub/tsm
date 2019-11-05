var FilNombreColor = 0;
var FilColorTela = 0;
var FilComposicionTela = 0;
var PeticionFormula = false;
var fn_DRLoadConsultaHis = function (divCcf) {
  
    KdoButton($("#btnCCFH"), "search", "buscar..");
    $("#TxtNombreColor").focus().select();

    fn_gCHForBusqueda(divCcf);

    let FrmCCH = $("#FrmCCH").kendoValidator({
        rules: {
            vnc: function (input) {
                if (input.is("[id='TxtNombreColor']")) {
                    return input.val().length > 0 && input.val().length <= 100;
                }
                return true;
            },
            vct: function (input) {
                if (input.is("[id='TxtColorTela']")) {
                    return input.val().length === 0 ? true : input.val().length >= 3 && input.val().length <= 200;
                }
                return true;
            },
            vcpt: function (input) {
                if (input.is("[id='TxtCompoTela']")) {
                    return input.val().length === 0 ? true : input.val().length >= 3 && input.val().length <= 200;
                }
                return true;
            },
            vcnt: function (input) {
                if (input.is("[id='TxtCompoTela']")) {
                    return input.val().length === 0 ? true : input.val().length >= 3 && input.val().length <= 200;
                }
                return true;
            }
        },
        messages: {
            vnc: "Requerido nombre del color",
            vct: "Requerido como minimo 3 caracteres",
            vcpt: "Requerido como minimo 3 caracteres",
            vcnt: "Requerido como minimo 3 caracteres"
        }
    }).data("kendoValidator");

    $("#btnCCFH").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (FrmCCH.validate()) {
            FilColorTela = $("#TxtColorTela").val();
            FilNombreColor = $("#TxtNombreColor").val();
            FilComposicionTela = $("#TxtCompoTela").val();
            FilConstruccionTela = $("#TxtConstruTela").val();
            PeticionFormula = true;
            $("#gCHFor").data("kendoGrid").dataSource.read();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }       
    });
};
var fn_ConsultaHis = function () {
    PeticionFormula = false;
    $("#FrmCCH").data("kendoValidator").hideMessages();
    $("#TxtNombreColor").val("");
    $("#TxtColorTela").val("");
    $("#TxtCompoTela").val("");
    $("#TxtConstruTela").val("");
    $("#TxtNombreColor").focus().select();
    $("#gCHFor").data("kendoGrid").dataSource.read();

};
let fn_gCHForBusqueda = function (divCcf) {
    var dataSource = new kendo.data.DataSource({
       
        transport: {
            read: function (options) {
                if (PeticionFormula === true) {
                    $.ajax({
                        url: TSM_Web_APi + "TintasFormulaciones/BusquedaHistorica",
                        dataType: "json",
                        type: "post",
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify({
                            NombreColor: FilNombreColor.toString(),
                            ColorTela: FilColorTela.toString(),
                            ComposicionTela: FilComposicionTela.toString(),
                            ConstruccionTela: FilConstruccionTela.toString()
                        }),
                        success: function (result) {
                            options.success(result);
                            PeticionFormula = false;
                        },
                        error: function (result) {
                            options.error(result);
                            PeticionFormula = false;
                        }
                    });
                } else {
                    options.success("");
                }
                
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
                    ComposicionTela: { type: "string" },
                    ConstruccionTela: { type: "string" }
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
            { field: "CodigoColor", title: "Codigo color", hidden: true },
            { field: "CodigoDiseno", title: "Codigo Diseño", hidden: true,menu:false},
            { field: "NombreColor", title: "Nombre del color" },
            { field: "FechaFormula", title: "Fecha formula", format: "{0: dd/MM/yyyy}" },
            { field: "ColorTela", title: "Color Tela" },
            { field: "ComposicionTela", title: "Composición Tela" },
            { field: "ConstruccionTela", title: "Construcción Tela" }
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
            aggregate: [
                { field: "Porcentaje", aggregate: "sum" }
            ],
            filter: { field: "CodigoColor", operator: "eq", value: e.data.CodigoColor }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "CodigoColor", title: "Codigo Color", hidden: true },
                { field: "ItemId", title: "Articulo" },
                { field: "Nombre", title: "Nombre" },
                { field: "Porcentaje", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.Porcentaje ? kendo.format('{0:n2}', sum*100) : 0 # %"  }
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

