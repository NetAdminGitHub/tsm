let _IdSeteo;
let _IdOT;
var fn_InicializarVersionesSeteos = function (vIdOt) {
    _IdOT = vIdOt;
    var dsVersionesSeteos = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + _IdOT.toString();
                },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "create") { $("#gridVersionesSeteos").data("kendoGrid").dataSource.read(); }

        },
        schema: {
            model: {
                id: "IdSeteo",
                fields: {
                    IdSeteo: { type: "number" },
                    IdOrdenTrabajo: { type: "number" },
                    NoDocumento: { type: "string" },
                    FechaEstado: { type: "date" },
                    IdEtapaProceso: { type: "number" },
                    NomIdEtapaProceso: { type: "string" },
                    Item: { type: "number" },
                    IdUsuario: { type: "string" },
                    NomIdUsuario: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gridVersionesSeteos").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeteo", title: "IdSeteo", hidden: true, menu: false },
            { field: "IdOrdenTrabajo", title: "Orden de Trabajo", hidden: true, menu: false },
            { field: "NoDocumento", title: "NoDocumento", width: 100, hidden: true, menu: false },
            { field: "FechaEstado", title: "FechaEstado", format: "{0: dd/MM/yyyy HH:mm:ss}", width: 150, filterable: { ui: "datetimepicker" } },
            { field: "IdEtapaProceso", title: "Etapa", hidden: true, menu: false },
            { field: "NomIdEtapaProceso", title: "Etapa", filterable: { multi: true, search: true } },
            { field: "Item", title: "Iteración", width: 100, filterable: { cell: { enabled: false } } },
            { field: "IdUsuario", title: "Usuario", width: 100, hidden: true },
            { field: "NomIdUsuario", title: "Usuario", width: 350, filterable: { multi: true, search: true } },
        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridVersionesSeteos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, false, redimensionable.Si, 350);
    SetGrid_CRUD_ToolbarTop($("#gridVersionesSeteos").data("kendoGrid"), false);
    Set_Grid_DataSource($("#gridVersionesSeteos").data("kendoGrid"), dsVersionesSeteos, 20);

    var verSeteoSelrows = [];
    $("#gridVersionesSeteos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridVersionesSeteos"), verSeteoSelrows);
    });

    $("#gridVersionesSeteos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridVersionesSeteos"), verSeteoSelrows);
        fn_MostrarEstMarcos(this);
        fn_MostrarEstFormulas(this);
    });

    var dsetMar = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetTintasFormulacionesEstaciones/" + _IdSeteo; },
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
                id: "IdFormula",
                fields: {
                    IdFormula: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdTipoFormulacion: { type: "string" },
                    lblEstacion: { type: "string" },
                    Capilar: { type: "number" },
                    NoPasadas: { type: "number" },
                    Letra: { type: "string" },
                    IdTipoEmulsion: { type: "number" },
                    NomEmulsion: { type: "string" },
                    Area: { type: "number" },
                    IdUnidadArea: { type: "number" },
                    DesArea: { type: "string" },
                    Peso: { type: "number" },
                    IdUnidadPeso: { type: "number" },
                    DesPeso: { type: "string" },
                    ResolucionDPI: { type: "numeber" },
                    LineajeLPI: { type: "number" },
                    Pixeles: { type: "number" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gMarcos").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "Letra", title: "Letra" },
            { field: "Capilar", title: "Capilar", format: "{0:n2}" },
            { field: "NoPasadas", title: "NoPasadas" },
            { field: "IdTipoEmulsion", title: "Tipo Emulsion", hidden: true },
            { field: "NomEmulsion", title: "Emulsion" },
            { field: "Area", title: "Area", format: "{0:n2}" },
            { field: "IdUnidadArea", title: "Id Area", hidden: true },
            { field: "DesArea", title: "Unidad Area" },
            { field: "Peso", title: "Peso", format: "{0:n2}" },
            { field: "IdUnidadPeso", title: "Id Uni Peso", hidden: true },
            { field: "DesPeso", title: "Unidad Peso" },
            { field: "ResolucionDPI", title: "Resolucion DPI" },
            { field: "Pixeles", title: "Pixeles" },
            { field: "LineajeLPI", title: "Lineaje" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gMarcos").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gMarcos").data("kendoGrid"), dsetMar);



    let dsFormulas = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetTintasFormulacionesEstaciones/" + _IdSeteo; },
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
                id: "IdFormula",
                fields: {
                    IdFormula: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdTipoFormulacion: { type: "string" },
                    lblEstacion: { type: "string" },
                    TecnicaAplicar: { type: "string" },
                    NomSistemaPigmento: { type: "string" },
                    NomBasePigmento: { type: "string" },
                    NomTipoTinta: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gFor").kendoGrid({
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "TecnicaAplicar", title: "Técnica Aplicar" },
            { field: "NomSistemaPigmento", title: "Sistema Pigmento" },
            { field: "NomBasePigmento", title: "Base Pigmento" },
            { field: "NomTipoTinta", title: "Tipo Tintas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gFor").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gFor").data("kendoGrid"), dsFormulas);

    // gCHFor detalle
    function detailInit(e) {
        let vidFor = e.data.IdFormula === null ? 0 : e.data.IdFormula;
        let VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + vidFor; },
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
                    id: "IdFormula",
                    fields: {
                        IdFormula: { type: "number" },
                        Item: { type: "number" },
                        IdArticulo: { type: "string" },
                        Nombre: { type: "string" },
                        MasaFinal: { type: "number" },
                        PorcentajeFinal: { type: "number" }
                    }
                }
            },
            aggregate: [
                { field: "MasaFinal", aggregate: "sum" },
                { field: "PorcentajeFinal", aggregate: "sum" }
            ],
            filter: { field: "IdFormula", operator: "eq", value: e.data.IdFormula }
        };

        let g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "CodigoColor", title: "Codigo Color", hidden: true },
                { field: "Item", title: "Item" },
                { field: "IdArticulo", title: "Articulo" },
                { field: "Nombre", title: "Nombre" },
                { field: "MasaFinal", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}', sum) : 0 #" },
                { field: "PorcentajeFinal", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidFor);

        let selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsTec);
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 250);
        Set_Grid_DataSource(g, ds);
    }
};

var fn_CargarVersionesSeteos = function (vIdOt) {
    _IdOT = vIdOt;
    $("#gridVersionesSeteos").data("kendoGrid").dataSource.read();
};

let fn_MostrarEstMarcos = function (g) {
    var SelItem = g.dataItem(g.select());
    _IdSeteo = SelItem === null ? 0 : SelItem.IdSeteo;
    $("#gMarcos").data("kendoGrid").dataSource.read();
};

let fn_MostrarEstFormulas = function (g) {
    var SelItem = g.dataItem(g.select());
    _IdSeteo = SelItem === null ? 0 : SelItem.IdSeteo;
    $("#gFor").data("kendoGrid").dataSource.read();
};