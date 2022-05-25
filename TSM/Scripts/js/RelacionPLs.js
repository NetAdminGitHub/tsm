let xidDeclaracionMercancia;
let StrIdListaEmp = "";
let xitem = 0;
let xsDiv;
var fn_Ini_RelacionPLs = (strjson) => {
    xidDeclaracionMercancia = strjson.idDeclaracionMercancia;
    xitem = strjson.item;
    xsDiv = strjson.sDiv;
    KdoButton($("#btnCrea_registroPlAsig"), "save", "Crear Registro");
    ////#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "ListaEmpaques/GetListasEmpaqueByDM/" + `${xidDeclaracionMercancia}`; },
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
                id: "IdListaEmpaque",
                fields: {
                    IdListaEmpaque: { type: "string" },
                    NoDocumento: { type: "string" },
                    Cantidad: { type: "number" },
                    Docenas: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridListasEmpaques").kendoGrid({
        change: function (arg) {
            StrIdListaEmp = this.selectedKeyNames();
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdListaEmpaque", title: "id Lista Empaque", hidden: true },
            { field: "NoDocumento", title: "No Documento" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Docenas", title: "Docenas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridListasEmpaques").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, undefined, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridListasEmpaques").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridListasEmpaques").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridListasEmpaques").data("kendoGrid"), dS);

    $("#gridListasEmpaques").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    var selectedRows = [];
   

    $("#gridListasEmpaques").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridListasEmpaques"), selectedRows);
    });
    $("#gridListasEmpaques").data("kendoGrid").dataSource.read();

    ////#endregion 
   
    $("#btnCrea_registroPlAsig").click(function () {
        fn_Crear_Reg()
    });

};

var fn_Reg_RelacionPLs = (strjson) => {
    xidDeclaracionMercancia = strjson.idDeclaracionMercancia;
    xitem = strjson.item;
    xsDiv = strjson.sDiv;
    $("#gridListasEmpaques").data("kendoGrid").dataSource.read();
};

let fn_Crear_Reg = () => {
    let result = false;
    if (StrIdListaEmp !== "") {
        let PLs = [];
        $.each(StrIdListaEmp, function (index, elemento) {
            PLs.push({
                IdDeclaracionMercancias: Number(xidDeclaracionMercancia),
                Item: Number(xitem),
                IdListaEmpaque: Number(elemento),
                IdHojaBandeo: null,
                IdMercancia: null
            });
        });
        result = fn_AgregarPL(PLs);


    } else {
        result = false;
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
    }

    return result;
};

let fn_AgregarPL = (strPLs) => {
    let resultPak = false;
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "DeclaracionItemsMercancias/CrearRelacionDM_PL",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            IdUsuarioMod: getUser(),
            ListasEmpaques: strPLs
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            $("#gridListasEmpaques").data("kendoGrid").dataSource.read();
            RequestEndMsg(datos, "Post");
            kendo.ui.progress($(".k-dialog"), false);
            resultPak = true;
            $("#" + `${xsDiv}`).data("kendoWindow").close();
        },
        error: function (data) {
            ErrorMsg(data);
            resultPak = false;
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });
    return resultPak;

}