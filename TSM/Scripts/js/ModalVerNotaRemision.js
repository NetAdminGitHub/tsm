﻿"use strict"

let idNota;
let idDeclaracion;

var fn_Ini_ModalVerNotaRemision = (strjson) => {
    idDeclaracion = strjson.sIdRegNotaRemi;
    //fecha de ingreso
   
    KdoButton($("#btnRegistrarNota"), "plus", "Registrar nota de remisión");

    //#region crear grid ingresos
    let ds= new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "NotasRemision/NotaClienteHeader/" + `${idDeclaracion}` },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "NotasRemision/" + datos.IdNotaRemision; },
                dataType: "json",
                type: "DELETE"
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
                id: "IdNotaRemision",
                fields: {
                    IdNotaRemision: {type:"number"},
                    NoDocumento: { type: "string" },
                    Serie: { type: "string" },
                    IdCliente: { type: "number" },
                    IdBodegaCliente: { type: "number" },
                    IdDeclaracionMercancia: { type: "number" },
                    Descripcion: { type: "string" },
                    FechaDocumento: { type: "date" },
                    UsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Direccion: { type: "string" },
                    TotalCantidad: { type: "number" },
                    TotalMonto: { type: "number" }
                }
            }
        },
        aggregate: [
            { field: "TotalCantidad", aggregate: "sum" },
            { field: "TotalMonto", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gNotaRemi").kendoGrid({
        detailInit: GridDetalleInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCliente");
            KdoHideCampoPopup(e.container, "IdNotaRemision");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "IdDeclaracionMercancia");
            KdoHideCampoPopup(e.container, "IdBodegaCliente");
            KdoHideCampoPopup(e.container, "IdDeclaracionMercancia");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNotaRemision", title: "IdNotaRemision", hidden: true },
            { field: "Serie", title: "Serie", footerTemplate: "Total" },
            { field: "NoDocumento", title: "Número" },
            { field: "TotalCantidad", title: "Total de Bulto", format: "{0:n2}", footerTemplate: "#: data.TotalCantidad ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "TotalMonto", title: "Monto Total", format: "{0:N2}", footerTemplate: "#: data.TotalMonto ? kendo.format('{0:n2}', sum) : 0 #"},
            { field: "Descripcion", title: "Descripción", hidden: false },            
            { field: "Direccion", title: "Dirección", hidden: false },
            { field: "IdCliente", title: "IdCliente", hidden: true },
            { field: "IdBodegaCliente", title: "IdBodegaCliente", hidden: true },
            { field: "IdDeclaracionMercancia", title: "IdDeclaracionMercancia", hidden: true },
            { field: "FechaDocumento", title: "Fecha", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gNotaRemi").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    //SetGrid_CRUD_ToolbarTop($("#gNotaRemi").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gNotaRemi").data("kendoGrid"),false,true);
    Set_Grid_DataSource($("#gNotaRemi").data("kendoGrid"), ds);



    $("#gNotaRemi").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Notas de remisión";
        }
    });
    var selectedRows = [];
    $("#gNotaRemi").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gNotaRemi"), selectedRows);
    });

    $("#gNotaRemi").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gNotaRemi"), selectedRows);
    });




    function GridDetalleInit(e) {

        var idNota = e.data.IdNotaRemision === null ? 0 : e.data.IdNotaRemision;

        let dsdetalle = new kendo.data.DataSource({
            //CONFIGURACION DEL CRUD
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "NotasRemisionMercancias/NotaClienteDetalle/" + `${idDeclaracion}` },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                update: {
                    url: function (datos) { return TSM_Web_APi + "NotasRemisionMercancias/" + datos.IdNotaRemisionMercancia; },
                    type: "PUT",
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
                    id: "IdNotaRemisionMercancia",
                    fields: {
                        IdNotaRemision: { type: "number" },
                        IdNotaRemisionMercancia: { type: "number" },
                        Item: { type: "number" },
                        ItemDM: { type: "number" },
                        IdUnidad: { type: "number" },
                        Abreviatura: { type: "string" },
                        Cantidad: { type: "number" },
                        Descripcion: { type: "string" },
                        PrecioUnitario: { type: "number" },
                        Monto: { type: "number" },
                        IdUsuarioMod: { type: "string" },
                        FechaMod: { type: "date" }


                    }
                }
            },
            filter: { field: "IdNotaRemision", operator: "eq", value: e.data.IdNotaRemision }
        });



        var detailGrid = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS

            edit: function (e) {
                KdoHideCampoPopup(e.container, "IdNotaRemision");
                KdoHideCampoPopup(e.container, "IdNotaRemisionMercancia");
                KdoHideCampoPopup(e.container, "Item");
                KdoHideCampoPopup(e.container, "ItemDM");
                KdoHideCampoPopup(e.container, "Descripcion");
                KdoHideCampoPopup(e.container, "IdUnidad");
                KdoHideCampoPopup(e.container, "Abreviatura");
                KdoHideCampoPopup(e.container, "Cantidad");

                Grid_Focus(e, "PrecioUnitario");
            },
            columns: [
              
               { field: "IdNotaRemision", title: "IdNotaRemision", hidden: true },
                { field: "IdNotaRemisionMercancia", title: "IdNotaRemisionMercancia", hidden: true },
                { field: "Item", title: "Item", hidden: true },
                { field: "ItemDM", title: "ItemDM", hidden: true },
                { field: "Descripcion", title: "Descripción" },
                { field: "Cantidad", title: "Total de Bultos", format: "{0:n2}" },
                { field: "IdUnidad", title: "Unidad", hidden: true },
                { field: "PrecioUnitario", title: "Precio unitario", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}"},
                { field: "Abreviatura", title: "Unidad de medida" },
                { field: "Monto", title: "Monto", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}"}
            ]
        });


        ConfGDetalle(detailGrid.data("kendoGrid"), dsdetalle, "griNotaRemiDetalle" + idNota);
     
            var selectedRowsTec = [];
            detailGrid.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
                Grid_SetSelectRow(detailGrid, selectedRowsTec);
            });
        
            detailGrid.data("kendoGrid").bind("change", function (e) {
                Grid_SelectRow(detailGrid, selectedRowsTec);
            });
            



    }


    function ConfGDetalle(g, ds, IdentificadorGridDetalle) {
        
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0);
        SetGrid_CRUD_Command(g, true, false);
        Set_Grid_DataSource(g, ds);
    }



    $("#btnRegistrarNota").click(function () {
        let strjson = {
            config: [{
                Div: "vIngresoNotaremi",
                Vista: "~/Views/IngresoDeclaracion/_IngresoNotaRemision.cshtml",
                Js: "IngresoNotaRemision.js",
                Titulo: "Ingreso de nota de remisión del cliente",
                Height: "90%",
                Width: "50%",
                MinWidth: "10%"
            }],
            Param: { sidDeclaracion: idDeclaracion, sDiv: "vIngresoNotaremi" },
            fn: { fnclose: "fn_ActualizaGrid", fnLoad: "fn_Ini_IngresoNotaRemision", fnReg: "fn_Reg_IngresoNotaRemision", fnActi: "fn_FocusInNota" }
        };

        fn_GenLoadModalWindow(strjson);
     });


};
var fn_ActualizaGrid = () => { $("#gNotaRemi").data("kendoGrid").dataSource.read();};


var fn_Reg_ModalVerNotaRemision = (strjson) => {
    idDeclaracion = strjson.sIdRegNotaRemi;
    $("#gNotaRemi").data("kendoGrid").dataSource.read();
   
};