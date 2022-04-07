var Permisos;
let xCliente = 0;
let xIdBandeoDisenos = 0; //id en la tabla BandeosDisenos
let xIdHojaBandeo = 0;

$(document).ready(function () {


    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un Cliente...");
    

    $("#CmbFmCata").ControlSelecionFMCatalogo();


    //#region crear grid ingresos
    let ds = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                kendo.ui.progress($(document.body), true);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: TSM_Web_APi + "HojasBandeos/GetHojaBandeoFiltrosVineta",
                    data: JSON.stringify({
                        IdCliente: KdoCmbGetValue($("#CmbCliente")),
                        IdBandeosDisenos: null,
                        IdHojaBandeo: null

                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($(document.body), false);
                        datos.success(result);
                    },
                    error: function (result) {
                        kendo.ui.progress($(document.body), false);
                        options.error(result);
                    }
                });
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                IdHojaBandeo: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    NoDocumento: { type: "string" },
                    IdIngreso: { type: "number" },
                    IdCliente: { type: "number" },
                    Rollo: { type: "boolean" },
                    Corte: { type: "string" },
                    Color: { type: "string" },
                    IdPlanta: { type: "number" },
                    Cantidad: { type: "number" },
                    Tallas: { type: "string" },
                    Estilo: { type: "string" },
                    Fecha: { type: "date" },
                    UsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Direccion: { type: "string" },
                    IdCatalogoDiseno: { type: "number" },
                    RowId: {type:"number"}

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDatosVinetas").kendoGrid({
        detailInit: GridDetalleInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        change: function (e) {
            var childRow = this.element.closest("table").next();
            if (this.select().length === false ) {
                childRow.removeClass("k-state-selected");
            } 
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "NoDocumento", title: "NoDocumento" },
            { field: "IdIngreso", title: "IdIngreso",hidden:true },
            { field: "IdCliente", title: "IdCliente", hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "Color", title: "Color" },
            { field: "Cantidad", title: "Total de piezas" },
            { field: "Tallas", title: "Tallas" },
            { field: "Estilo", title: "Estilo" },
            { field: "RowId", title: "rowId", hidden:true},
            { field: "IdCatalogoDiseno", title: "IdCatalogoDiseno", hidden: true },
            { command: { name: "h_print", text: "", iconClass: "k-icon k-i-print", click: fn_ImprimirVinetas }, title: " ", width: "70px" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDatosVinetas").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,undefined,"multiple");
    //SetGrid_CRUD_ToolbarTop($("#gNotaRemi").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDatosVinetas").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDatosVinetas").data("kendoGrid"), ds);

    $("#gridDatosVinetas").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Hojas de bandeo";
        }
    });
    var selectedRows = [];


    $("#gridDatosVinetas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDatosVinetas"), selectedRows);
    });

    $("#gridDatosVinetas").kendoTooltip({
        filter: ".k-grid-h_print",
        content: function (e) {
            return "Generar viñetas";
        }
    });


    function GridDetalleInit(e) {

        var idBandeo = e.data.IdHojaBandeo === null ? 0 : e.data.IdHojaBandeo;
        var rowId = e.data.RowId;
        let dsdetalle = new kendo.data.DataSource({
            //CONFIGURACION DEL CRUD
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "HojasBandeosMercancias/GetByHojaBandeo/" + `${idBandeo}` },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            requestEnd: Grid_requestEnd,
            error: Grid_error,
            schema: {
                model: {
                    id: "IdMercancia",
                    fields: {
                        IdHojaBandeo: { type: "number" },
                        IdMercancia: { type: "number" },
                        NoDocumento: { type: "string" },
                        Talla: { type: "string" },
                        Cantidad: { type: "number" },
                        Docenas: { type: "number" },
                        Estado: { type: "number" },
                        NomEstado: { type: "string" },

                    }
                }
            },
            filter: { field: "IdHojaBandeo", operator: "eq", value: e.data.IdHojaBandeo }
        });



        var detailGrid = $(`<div id= "gridBandeoMercancia${rowId}"></div>`).appendTo(e.detailCell).kendoGrid({
            //Marca fila en grid padre
            change: function (e) {
                var masterRow = this.element.closest("tr").prev();
                if (this.select().length) {
                    masterRow.addClass("k-state-selected");
                   
                } else {
                    masterRow.removeClass("k-state-selected");
                }
            },
               //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { selectable: true, width: "50px" },
                { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
                { field: "IdMercancia", title: "IdMercancia", hidden: true },
                { field: "NoDocumento", title: "Bulto" },
                { field: "Talla", title: "Talla" },
                { field: "Cantidad", title: "Cantidad", format: "{0:n2}" },
                { field: "Docenas", title: "Docenas", format: "{0:n2}" },                
                { field: "Estado", title: "IdEstado", hidden: true },
                { field: "NomEstado", title: "Estado" },
                { command: { name: "b_print", text: "", iconClass: "k-icon k-i-print", click: fn_ImprimirVinetas }, title: " ", width: "70px" }
            ]
        });


        ConfGDetalle(detailGrid.data("kendoGrid"), dsdetalle, "gridBandeoMercancia" + rowId);

        var selectedRowsTec = [];
 

        detailGrid.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(detailGrid, selectedRowsTec);
        });

       


    }


    function ConfGDetalle(g, ds, IdentificadorGridDetalle) {

        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 250, "multiple");
        Set_Grid_DataSource(g, ds);

        $(`#${IdentificadorGridDetalle}`).kendoTooltip({
            filter: ".k-grid-b_print",
            content: function (e) {
                return "Generar viñetas";
            }
        });
    }

});


///Crea JSON para indicar vinetas a imprimir.
let fn_ImprimirVinetas = () => {
    let result = false;

    var grid = $("#gridDatosVinetas").data("kendoGrid");
    var cortes = [];
   
    // obtiene items seleccionado en padre
    grid.select().each(function () {
        cortes.push(grid.dataItem(this));
    });

    if (cortes.length > 0) {
        let vineta = [];
        let JsonVineta = [];
        $.each(cortes, function (index, elemento) {
            let bultos = [];
            let mercancias = [];
           
            let hijo = $(`#gridBandeoMercancia${elemento.RowId}`).data("kendoGrid");
            // obtiene items seleccionado en hijo con el id
            hijo.select().each(function () {
                bultos.push(hijo.dataItem(this));
            });
            $.each(bultos, function (index, elemento) {
                mercancias.push({
                    IdMercancia: Number(elemento.IdMercancia)
                });

            });

            vineta.push({
                IdHojaBandeo: elemento.IdHojaBandeo,
                IdCatalogoDiseno: elemento.IdCatalogoDiseno,
                Mercancias: mercancias
            });
        });
        JsonVineta = JSON.stringify({Vineta:vineta});
        result = fn_GeneraVinetas(JsonVineta);

        } else {
            result = false;
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar al menos un elemento de la lista.", "error");
        }
     return result;
};


let fn_GeneraVinetas = (strVineta) => {
    let result = false;
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: window.location.origin + "/Reportes/Vinetas/",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            rptName: "crptVinetasMercancias",
            controlador: "VinetasMercancias",
            accion: "Generar",
            Vineta: strVineta,
            id:1
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            $("#gridDatosVinetas").data("kendoGrid").dataSource.read();
            let MiRpt = window.open(datos, "_blank");

            if (!MiRpt)
                $("#kendoNotificaciones").data("kendoNotification").show("Bloqueo de ventanas emergentes activado.<br /><br />Debe otorgar permisos para ver el reporte.", "error");

            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            ErrorMsg(data);
            result = false;
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
            //$("#txtSerie").val("");
            //$("#txtNoDocumento").val("");
            //$("#FechaDocumento").data("kendoDatePicker").value(Fhoy());
            //$("#txtDescripcion").val("");
        }
    });
    return result;

}




let fn_ConsultarVinetas = function () {
    let g = $("#grid").data("kendoGrid");
    g.dataSource.read();
    g.pager.page(1);
};
fPermisos = function (datos) {
    Permisos = datos;
};