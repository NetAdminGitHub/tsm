
var Permisos;
let Gdet;
$(document).ready(function () {
    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
    KdoButton($("#btnRetornar"), "hyperlink-open-sm", "Regresar");
    // crear campo numeric
    $("#num_Ingreso").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    KdoNumerictextboxEnable($("#num_Ingreso"), false);
    KdoComboBoxEnable($("#cmbCliente"), false);
    KdoCmbSetValue($("#cmbCliente"), xIdClienteIng);
    kdoNumericSetValue($("#num_Ingreso"), xIdIngreso);
    TextBoxEnable($("#txtEstado"), false);
    TextBoxEnable($("#num_Nodoc"), false);

    // crear hoja de bamdeo
    KdoButton($("#btnCrearHoja"), "gear", "Guardar");
    // crear lista de empaque
    KdoButton($("#btnCrearLista"), "gear", "Guardar");

    //crear campo fecha
    $("#dFecha").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFecha").data("kendoDatePicker").value(Fhoy());
    $("#dFecha").data("kendoDatePicker").enable(false);

    //#region crear grid hojas
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "HojasBandeos/GetbyIdIngreso/" +`${xIdIngreso}` },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "/HojasBandeos/" + datos.IdHojaBandeo; },
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
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },

        ],
        schema: {
            model: {
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "number" },
                    IdIngreso: { type: "number" },
                    NoDocumento: { type: "string" },
                    Rollo: { type: "boolean" },
                    Corte: { type: "string" },
                    Cantidad: { type: "number" },
                    Color: { type: "string" },
                    Estilo: { type: "string" },
                    Tallas: { type: "string" },
                    Estado: { type: "string" },
                    IdPlanta: { type: "number" },
                    NombrePlanta: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridHoja").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdHojaBandeo", title: "Id. Hoja" ,hidden: true },
            { field: "IdIngreso", title: "Id. Ingreso", hidden: true },
            { field: "IdPlanta", title: "Id. Planta", hidden: true },
            { field: "NoDocumento", title: "Correlativo", hidden: true },
            { field: "Corte", title: "Corte/Lote", footerTemplate: "Total" },
            { field: "Color", title: "Color" },
            { field: "Estilo", title: "Estilo" },
            { field: "Tallas", title: "Tallas" },
            { field: "NombrePlanta", title: "Planta" },
            { field: "Cantidad", title: "Total Cuantía", footerTemplate: "#: data.Cantidad ? kendo.format('{0:n2}', sum) : 0 #" },
            {
                field: "btnHb", title: "&nbsp;",
                command: {
                    name: "btnHb",
                    iconClass: "k-icon k-i-edit",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        let strjson = {
                            config: [{
                                Div: "vMod_controlbulto",
                                Vista: "~/Views/IngresoMercancias/_ControlBulto.cshtml",
                                Js: "ControlBulto.js",
                                Titulo: "Ingreso de control de bultos",
                                Height: "95%",
                                Width: "90%",
                                MinWidth: "30%"
                            }],
                            Param: { sIdHB: dataItem.IdHojaBandeo, sIdIngreso: dataItem.IdIngreso, esNuevo: false, sIdCliente: KdoCmbGetValue($("#cmbCliente")) },
                            fn: { fnclose: "fn_ImRefres", fnLoad: "fn_Ini_ControlBulto", fnReg: "fn_Reg_ControlBulto", fnActi:"fn_focusControl" }
                        };
                        fn_GenLoadModalWindow(strjson);
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
    SetGrid($("#gridHoja").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridHoja").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridHoja").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridHoja").data("kendoGrid"), dS);

    var selectedRows = [];
    $("#gridHoja").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridHoja"), selectedRows);
    });

    $("#gridHoja").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridHoja"), selectedRows);
    });

    $("#gridHoja").data("kendoGrid").dataSource.read();

    //#endregion 

    //#region crear grid Lista
    let dSlis = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "ListaEmpaques/GetPackingCab/" + `${xIdIngreso}` },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "ListaEmpaques/" + datos.IdListaEmpaque; },
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
        aggregate: [
            { field: "TotalCuantia", aggregate: "sum" },

        ],
        schema: {
            model: {
                id: "IdListaEmpaque",
                fields: {
                    IdListaEmpaque: { type: "number"},
                    NoDocumento: { type: "string" },
                    Peso: { type: "number" },
                    Estado: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Observacion: { type: "string" },
                    TotalCuantia: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridLista").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "IdListaEmpaque", title: "Id Lista Empaque", hidden: true },
            { field: "NoDocumento", title: "No Documento", footerTemplate: "Total"},
            { field: "Peso", title: "Peso", hidden: true },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "TotalCuantia", title: "Total Cuantía", footerTemplate: "#: data.TotalCuantia ? kendo.format('{0:n2}', sum) : 0 #" },
            { field: "Observacion", title: "Observacion" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
           
            {
                field: "btnPL", title: "&nbsp;",
                command: {
                    name: "btnPL",
                    iconClass: "k-icon k-i-edit",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        let strjson = {
                            config: [{
                                Div: "vMod_CrearListaEmpaque",
                                Vista: "~/Views/IngresoMercancias/_CrearListaEmpaque.cshtml",
                                Js: "CrearListaEmpaque.js",
                                Titulo: "Creación de Lista de Empaque",
                                Height: "92%",
                                Width: "70%",
                                MinWidth: "10%"
                            }],
                            Param: { sIdHb: xIdIngreso, sDiv: "vMod_CrearListaEmpaque", sIdListaEmpaque: dataItem.IdListaEmpaque },
                            fn: { fnclose: "fn_RefresGridLista", fnLoad: "fn_Ini_CrearListaEmpaque", fnReg: "fn_Reg_CrearListaEmpaque", fnActi: "fn_focusLista" }
                        };

                        fn_GenLoadModalWindow(strjson);
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
    SetGrid($("#gridLista").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridLista").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridLista").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridLista").data("kendoGrid"), dSlis);

    // gCHFor detalle
    function detailInit(e) {
     
        var vidLe = e.data.IdListaEmpaque === null ? 0 : e.data.IdListaEmpaque;
        var VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "ListaEmpaques/GetPackingDet/" + vidLe; },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                destroy: {
                    url: function (datos) { return TSM_Web_APi + "ListaEmpaquesBandeos/" + datos.IdListaEmpaqueBandeo; },
                    dataType: "json",
                    type: "DELETE"
                },
                parameterMap: function (data, type) {
                    if (type !== "read") {
                        return kendo.stringify(data);
                    }
                }
            },
            requestEnd: function (e) {
                Grid_requestEnd(e);
                if (Gdet !== undefined) {
                    if (Gdet.dataSource.total() === 0 && e.type ==="destroy") {
                        $("#gridLista").data("kendoGrid").dataSource.read();
                    }
                }
               
            },
            error: Grid_error,
            schema: {
                model: {
                    id: "IdListaEmpaque",
                    fields: {
                        IdListaEmpaque: { type: "number" },
                        IdListaEmpaqueBandeo: { type: "number" },
                        IdIngreso: { type: "number" },
                        NoDocumento: { type: "string" },
                        Corte: { type: "string" },
                        CantidadTotal: { type: "number" },
                        Color: { type: "string" },
                        Estilos: { type: "string" },
                        Tallas: { type: "string" }
                    }
                }
            },
            filter: { field: "IdListaEmpaque", operator: "eq", value: e.data.IdListaEmpaque }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "IdListaEmpaque", title: "Id Lista Empaque", hidden: true },
                { field: "IdListaEmpaqueBandeo", title: "Id Lista Empaque Bandeo", hidden: true },
                { field: "IdIngreso", title: "Id Ingreso", hidden: true },
                { field: "NoDocumento", title: "#Lista", hidden: true },
                { field: "Corte", title: "Corte" },
                { field: "Estilos", title: "Estilos" },
                { field: "Tallas", title: "Tallas" },
                { field: "Color", title: "Color" },
                { field: "CantidadTotal", title: "Cantidad" }
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidLe);

        var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsTec);

            Gdet = g.data("kendoGrid");
            
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si,0);
        SetGrid_CRUD_Command(g, false, Permisos.SNBorrar, Id_gCHForDetalle);
        Set_Grid_DataSource(g, ds);
    }




    var selectedRows2 = [];
    $("#gridLista").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridLista"), selectedRows2);
    });

    $("#gridLista").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridLista"), selectedRows2);
    });

    $("#gridLista").data("kendoGrid").dataSource.read();

    //#endregion 


    //crear hojas de bandeo
    $("#btnCrearHoja").click(function () {
        let strjson = {
            config: [{
                Div: "vMod_controlbulto",
                Vista: "~/Views/IngresoMercancias/_ControlBulto.cshtml",
                Js: "ControlBulto.js",
                Titulo: "Ingreso de control de bultos",
                Height: "95%",
                Width: "90%",
                MinWidth: "30%"
            }],
            Param: { sIdHB: 0, sIdIngreso: xIdIngreso, esNuevo: true, sIdCliente: KdoCmbGetValue($("#cmbCliente")) },
            fn: { fnclose: "fn_Imclose", fnLoad: "fn_Ini_ControlBulto", fnReg: "fn_Reg_ControlBulto", fnActi:"fn_focusControl"}
        };

        fn_GenLoadModalWindow(strjson);
    });

    $("#btnCrearLista").click(function () {
      
        let strjson = {
            config: [{
                Div: "vMod_CrearListaEmpaque",
                Vista: "~/Views/IngresoMercancias/_CrearListaEmpaque.cshtml",
                Js: "CrearListaEmpaque.js",
                Titulo: "Creación de Lista de Empaque",
                Height: "92%",
                Width: "70%",
                MinWidth: "10%"
            }],
            Param: { sIdHb: xIdIngreso, sDiv: "vMod_CrearListaEmpaque", sIdListaEmpaque:0},
            fn: { fnclose: "fn_RefresGridLista", fnLoad: "fn_Ini_CrearListaEmpaque", fnReg: "fn_Reg_CrearListaEmpaque", fnActi:"fn_focusLista" }
        };

        fn_GenLoadModalWindow(strjson);



    });

    //compeltar campos de cabecera

    fn_Get_IngresoMercancia(xIdIngreso);

    $("#btnRetornar").click(function () {
        window.location.href = "/ControlIngresos/index"
    });



});
var fn_Imclose = (strjson) => {
    fn_Refrescar_Ingreso();
};
var fn_ImRefres = (strjson) => {
    $("#gridHoja").data("kendoGrid").dataSource.read();
};

var fn_RefresGridLista = () => {
    $("#gridLista").data("kendoGrid").dataSource.read();
    $("#gridLista").data("kendoGrid").dataSource.read("[]");
};
let fn_Refrescar_Ingreso = () => {
    if (Bandeo != undefined) {
        if (Bandeo !== null && xIdIngreso === 0) {
            kdoNumericSetValue($("#num_Ingreso"), Bandeo[0].IdIngreso);
            xIdIngreso = Bandeo[0].IdIngreso;
            $("#txtEstado").val(Bandeo[0].Estado);
            $("#num_Nodoc").val(Bandeo[0].NoDocumento);
            window.history.pushState('', '', "/IngresoMercancias/" + `${xIdClienteIng}/${xIdIngreso}`);
        }
    }
    $("#gridHoja").data("kendoGrid").dataSource.read();
};
let fn_Get_IngresoMercancia = (xId) => {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "IngresoMercancias/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                $("#txtEstado").val(dato.Estado);
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaIngreso), 'dd/MM/yyyy'));
                $("#num_Nodoc").val(dato.NoDocumento);
         
            } else {
                $("#txtEstado").val("");
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(Fhoy()), 'dd/MM/yyyy'));
                $("#num_Nodoc").val("");
            }
            kendo.ui.progress($(".k-dialog"), false);
        },
        error: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });

};

fPermisos = function (datos) {
    Permisos = datos;
}