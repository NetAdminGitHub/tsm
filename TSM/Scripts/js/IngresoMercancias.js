
var Permisos;
$(document).ready(function () {
    // crear combobox cliente
    Kendo_CmbFiltrarGrid($("#cmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Seleccione un cliente");
 
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
            { field: "NoDocumento", title: "Correlativo" },
            { field: "Corte", title: "Corte" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Color", title: "Color" },
            { field: "Estilo", title: "Estilo" },
            { field: "Tallas", title: "Tallas" },
            { field: "NombrePlanta", title: "Planta" },
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
                url: function () { return TSM_Web_APi + "ListaEmpaques/GetPacking/" + `${xIdIngreso}` },
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
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        group: {
            field:"NoDocumento"
        },
        schema: {
            model: {
                id: "IdListaEmpaqueBandeo",
                fields: {
                    IdListaEmpaqueBandeo: { type: "number"},
                    IdIngreso: { type: "number" },
                    NoDocumento: { type: "string" },
                    Corte: { type: "string" },
                    CantidadTotal: { type: "number" },
                    Color: { type: "string" },
                    Estilos: { type: "string" },
                    Tallas: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridLista").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdListaEmpaqueBandeo", title: "Id Lista Empaque Bandeo", hidden: true },
            { field: "IdIngreso", title: "Id Ingreso",hidden:true },
            { field: "NoDocumento", title: "#Lista",hidden:true },
            { field: "Corte", title: "Corte" },
            { field: "CantidadTotal", title: "Cantidad" },
            { field: "Color", title: "Color" },
            { field: "Estilos", title: "Estilos" },
            { field: "Tallas", title: "Tallas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridLista").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridLista").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridLista").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridLista").data("kendoGrid"), dSlis);

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
            Param: { sIdHb: xIdIngreso, sDiv: "vMod_CrearListaEmpaque" },
            fn: { fnclose: "fn_RefresGridLista", fnLoad: "fn_Ini_CrearListaEmpaque", fnReg: "fn_Reg_CrearListaEmpaque", fnActi:"fn_focusLista" }
        };

        fn_GenLoadModalWindow(strjson);



    });

    //compeltar campos de cabecera

    fn_Get_IngresoMercancia(xIdIngreso);


});
var fn_Imclose = (strjson) => {
    fn_Refrescar_Ingreso();
};
var fn_ImRefres = (strjson) => {
    $("#gridHoja").data("kendoGrid").dataSource.read();
};

var fn_RefresGridLista = () => {
    $("#gridLista").data("kendoGrid").dataSource.read();
};
let fn_Refrescar_Ingreso = () => {
    if (Bandeo != undefined) {
        if (Bandeo !== null && xIdIngreso === 0) {
            kdoNumericSetValue($("#num_Ingreso"), Bandeo[0].IdIngreso);
            xIdIngreso = Bandeo[0].IdIngreso;
            $("#txtEstado").val(Bandeo[0].Estado);
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
         
            } else {
                $("#txtEstado").val("");
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(Fhoy()), 'dd/MM/yyyy'));
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