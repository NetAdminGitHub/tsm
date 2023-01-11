var Permisos;
let xCliente = 0;
let xIdCat = 0; //id en la tabla BandeosDisenos
let xIdHojaBandeo = 0;
var StrIdBulto = [];
var StrIdTalla = [];
var StrIdMercaEtapa = [];


$(document).ready(function () {


    //covertir a kendo combobox
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un Cliente...");

    // crear boton imprimir
    KdoButton($("#btn_print"), "print", "Imprimir");
    

    $("#CmbFmCata").mcBandeoDisenos();


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
                        IdCliente: KdoCmbGetValue($("#cmbCliente")),
                        IdCatalogoDiseno: xIdCat

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
                    RowId: { type: "number" },
                    FM: {type:"string"}

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDatosVinetas").kendoGrid({
        detailInit: GridDetalleInit,
        dataBound: function (e) {
            //this.collapseRow(this.tbody.find("tr.k-master-row").first());
            var grid = e.sender;

            grid.tbody.find("tr.k-master-row").click(function (e) {
                var target = $(e.target);
                if ((target.hasClass("k-i-expand")) || (target.hasClass("k-i-collapse"))) {
                    return;
                }

                var row = target.closest("tr.k-master-row");
                var icon = row.find(".k-i-expand");

                if (icon.length) {
                    grid.expandRow(row);
                } else {
                    grid.collapseRow(row);
                }
            })
        },
        change: function (e) {
            /*var childRow = this.element.closest("table").next();
            if (this.select().length === false ) {
                childRow.removeClass("k-state-selected");
            }*/
            $("tr", ".lump-child-grid").removeClass("k-state-selected");
            let child = this.select().next().find(".lump-child-grid");
            $("tr", child).addClass("k-state-selected");

            let childRow = this.element.closest("table").next();
            if (this.select().length > 0) {
                childRow.removeClass("k-state-selected");
            }

            let grid = $("#gridDatosVinetas").data("kendoGrid");
            let detailRow = grid.element.find(".k-detail-row");

            let items = [];
            let rows = detailRow.find(".idHB-detail");
            setTimeout(function () {

                rows.each(function (currentValue, index, array) {
                    let row = index.closest("tr");
                    let chk = row.querySelector("input");
                    if (chk.checked) {
                        items.push(index.innerText);
                    }
                });
                StrIdBulto = items;

                items = [];
                rows = detailRow.find(".idMercancia-detail");
                rows.each(function (currentValue, index, array) {
                    let row = index.closest("tr");
                    let chk = row.querySelector("input");
                    if (chk.checked)
                        items.push(index.innerText);
                });
                StrIdMercaEtapa = items;

            }, 250);

            let masterRows = e.sender.select();
            let talla = [];

            masterRows.each(function (e) {
                let dataItem = grid.dataItem(this);
                talla.find(x => x == dataItem.Talla) == null ? talla.push(dataItem.Talla) : null;
            });
            StrIdTalla = talla;
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true },
            { field: "NoDocumento", title: "Hoja Bandeo" },
            { field: "IdIngreso", title: "IdIngreso",hidden:true },
            { field: "IdCliente", title: "IdCliente", hidden: true },
            { field: "Corte", title: "Corte", filterable: { cell: {operator:"contains",suggestionOperator:"contains"}} },
            { field: "Color", title: "Color" },
            { field: "Cantidad", title: "Total de piezas" },
            { field: "Tallas", title: "Tallas" },
            { field: "Estilo", title: "Estilo" },
            { field: "FM", title: "Número FM" },
            { field: "RowId", title: "rowId", hidden:true},
            { field: "IdCatalogoDiseno", title: "IdCatalogoDiseno", hidden: true },
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

    //EVENTS
    $("#gridDatosVinetas").data("kendoGrid").tbody.on("change", ".k-checkbox", function (e) {
        let checkbox = $(this);
        let nextRow = checkbox.closest("tr").next();

        if (nextRow.hasClass("k-detail-row")) {
            nextRow.find(":checkbox").prop("checked", checkbox.is(":checked"));
        }
    });

    $("#gridDatosVinetas").data("kendoGrid").thead.on("change", ".k-checkbox", function (e) {
        let checkbox = $(this);
        let content = checkbox.closest(".k-grid-header").next();

        if (content.hasClass("k-grid-content")) {
            let detailRow = content.find("tr.k-detail-row");

            if (detailRow.length > 0) {
                detailRow.find(":checkbox").prop("checked", checkbox.is(":checked"));
            }

            let items = [];
            let rows = detailRow.find(".idHB-detail");
            rows.each(function (currentValue, index, array) {
                let row = index.closest("tr");
                let chk = row.querySelector("input");
                if (chk.checked) {
                    items.push(index.innerText);
                }
            });
            StrIdBulto = items;

            items = [];
            rows = detailRow.find(".idMercancia-detail");
            rows.each(function (currentValue, index, array) {
                let row = index.closest("tr");
                let chk = row.querySelector("input");
                if (chk.checked)
                    items.push(index.innerText);
            });
            StrIdMercaEtapa = items;
        }
    });

    $("#gridDatosVinetas").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDatosVinetas"), selectedRows);
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



        var detailGrid = $(`<div id= "gridBandeoMercancia${rowId}" class='lump-child-grid'></div>`).appendTo(e.detailCell).kendoGrid({
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
                { selectable: true, width: "50px", headerTemplate: ' ' },
                { field: "IdHojaBandeo", title: "IdHojaBandeo", hidden: true, attributes: { "class": "idHB-detail" } },
                { field: "IdMercancia", title: "IdMercancia", hidden: true, attributes: { "class": "idMercancia-detail" } },
                { field: "NoDocumento", title: "Bulto" },
                { field: "Talla", title: "Talla" },
                { field: "Cantidad", title: "Cantidad", format: "{0:n2}" },
                { field: "Docenas", title: "Docenas", format: "{0:n2}" },                
                { field: "Estado", title: "IdEstado", hidden: true },
                { field: "NomEstado", title: "Estado" },
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



    $("#cmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xIdCat = null;
            $("#CmbFmCata").data("kendoMultiColumnComboBox").value("");
            $("#CmbFmCata").data("kendoMultiColumnComboBox").dataSource.read();
            fn_ConsultarVinetas();
        }
    });

    $("#cmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xIdCat = null;
            $("#CmbFmCata").data("kendoMultiColumnComboBox").dataSource.read();
            fn_ConsultarVinetas();
            setTimeout(function () {
                var gridV = $("#gridDatosVinetas").data("kendoGrid");
                $(".k-master-row").each(function (index) {
                    gridV.expandRow(this);
                });

                $(".k-master-row").each(function (index) {
                    gridV.collapseRow(this);
                });
            }, 1800);
        }
        else {
            xIdCat = null;
            $("#CmbFmCata").data("kendoMultiColumnComboBox").value("");
            $("#CmbFmCata").data("kendoMultiColumnComboBox").dataSource.read();
            fn_ConsultarVinetas();

        }
    });


    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            xIdCat = this.dataItem(e.item.index()).IdCatalogoDiseno;
            fn_ConsultarVinetas();

        } else {
            xIdCat = null;
            fn_ConsultarVinetas();
        }
    });

    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        let mlt = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = mlt.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xIdCat = null;
            fn_ConsultarVinetas();
         
        }

    });


    $("#btn_print").click(function () {
        fn_ImprimirVinetas();
    });


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

            if (hijo !== null && hijo !== undefined) {
                if (hijo.select().length > 0) {
                    // obtiene items seleccionado en hijo con el id
                    hijo.select().each(function () {
                        bultos.push(hijo.dataItem(this));
                    });

                    $.each(bultos, function (index, elemento) {
                        mercancias.push({
                            IdMercancia: Number(elemento.IdMercancia)
                        });

                    });
                }
            }
            // si no hay bultos seleccionados.
            if (bultos.length === 0) { mercancias.push({ IdMercancia: 0}); }

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
    kendo.ui.progress($("#gridDatosVinetas"), true);
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

            kendo.ui.progress($("#gridDatosVinetas"), false);
            setTimeout(function () {
                var gridV = $("#gridDatosVinetas").data("kendoGrid");
                $(".k-master-row").each(function (index) {
                    gridV.expandRow(this);
                });

                $(".k-master-row").each(function (index) {
                    gridV.collapseRow(this);
                });
            }, 1800);
        },
        error: function (data) {
            ErrorMsg(data);
            result = false;
         
        },
        complete: function () {
            kendo.ui.progress($("#gridDatosVinetas"), false);
            //$("#txtSerie").val("");
            //$("#txtNoDocumento").val("");
            //$("#FechaDocumento").data("kendoDatePicker").value(Fhoy());
            //$("#txtDescripcion").val("");
        }
    });
    return result;

}




let fn_ConsultarVinetas = function () {
    let g = $("#gridDatosVinetas").data("kendoGrid");
    g.dataSource.read();

};
fPermisos = function (datos) {
    Permisos = datos;
};



$.fn.extend({
    mcBandeoDisenos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                size: "large",
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                //filterFields: ["NoReferencia", "Nombre"],
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetFiltrobyCliente/" + `${KdoCmbGetValue($("#cmbCliente")) === null ? 0 : KdoCmbGetValue($("#cmbCliente"))}`; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    }
});


