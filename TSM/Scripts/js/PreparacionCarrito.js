
var Permisos;
var xIdIngreso = 0;
$(document).ready(function () {
    // crear combobox cliente
    
    // crear campo numeric




    // Agregar Corte
    KdoButton($("#btnAgregarCorte"), "gear", "Agregar Corte");
    // crear detakle de preparado
    KdoButton($("#btnDetallePrep"), "gear", "Detalle de Preparado");



    //#region crear grid hojas
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "HojasBandeos/GetbyIdIngreso/" + `${xIdIngreso}` },
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
    $("#gridDetCorte").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdHojaBandeo", title: "Id. Hoja", hidden: true },
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
                        fn_vistaControlBultos("vMod_controlbulto", dataItem.IdHojaBandeo, dataItem.IdIngreso, false, 0, function () { return $("#gridDetCorte").data("kendoGrid").dataSource.read(); },);
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
    SetGrid($("#gridDetCorte").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDetCorte").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDetCorte").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDetCorte").data("kendoGrid"), dS);

    var selectedRows = [];
    $("#gridDetCorte").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetCorte"), selectedRows);
    });

    $("#gridDetCorte").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetCorte"), selectedRows);
    });

    $("#gridDetCorte").data("kendoGrid").dataSource.read();

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
                url: function (datos) { return TSM_Web_APi + "/ListaEmpaques/" + datos.IdListaEmpaqueBandeo; },
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
            field: "NoDocumento"
        },
        schema: {
            model: {
                id: "IdListaEmpaqueBandeo",
                fields: {
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
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDetCortePre").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdListaEmpaqueBandeo", title: "Id Lista Empaque Bandeo", hidden: true },
            { field: "IdIngreso", title: "Id Ingreso", hidden: true },
            { field: "NoDocumento", title: "#Lista", hidden: true },
            { field: "Corte", title: "Corte" },
            { field: "CantidadTotal", title: "Cantidad" },
            { field: "Color", title: "Color" },
            { field: "Estilos", title: "Estilos" },
            { field: "Tallas", title: "Tallas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridDetCortePre").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridDetCortePre").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDetCortePre").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridDetCortePre").data("kendoGrid"), dSlis);

    var selectedRows2 = [];
    $("#gridDetCortePre").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetCortePre"), selectedRows2);
    });

    $("#gridDetCortePre").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetCortePre"), selectedRows2);
    });

    $("#gridDetCortePre").data("kendoGrid").dataSource.read();

    //#endregion 


    //crear hojas de bandeo
    $("#btnAgregarCorte").click(function () {
        fn_vistaControlBultos("vMod_controlbulto", 0, xIdIngreso, true,0, function () { return fn_Refrescar_Ingreso(); });
    });

    $("#btnDetallePrep").click(function () {
        fn_vistaCreacionListaEmpaque("vMod_CrearListaEmpaque", xIdIngreso, function () { return $("#gridDetCortePre").data("kendoGrid").dataSource.read(); });
    });

    //compeltar campos de cabecera

/*    fn_Get_IngresoMercancia(xIdIngreso);*/


});

let fn_Refrescar_Ingreso = () => {
    if (Bandeo !== null && xIdIngreso === 0) {
        kdoNumericSetValue($("#num_Ingreso"), Bandeo[0].IdIngreso);
        xIdIngreso = Bandeo[0].IdIngreso;

        window.history.pushState('', '', "/IngresoMercancias/" + `${xIdClienteIng}/${xIdIngreso}`);
    }

    $("#gridDetCorte").data("kendoGrid").dataSource.read();
};
let fn_Get_IngresoMercancia = (xId) => {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "IngresoMercancias/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
               
                $("#dFecha").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaIngreso), 'dd/MM/yyyy'));

            } else {
             
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