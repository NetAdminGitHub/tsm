"use strict"
let xidHoja;
let StrIdHojaBandeo = [];
let vFrmG;
let xsDivLe = "";//contiene el nombre de div donde se dibuja la modal
let xsIdListaEmpaque = 0;
var fn_Ini_CrearListaEmpaque = (strjson) => {
    xidHoja = strjson.sIdHb;
    xsDivLe = strjson.sDiv;
    xsIdListaEmpaque = strjson.sIdListaEmpaque;
    KdoButton($("#btnCrea_registro"), "save", "Crear Registro");
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "HojasBandeos/GetSinPakingbyIdIngreso/" + `${xidHoja}`; },
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
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "string" },
                    NoDocumento: { type: "string" },
                    Corte: { type: "string" },
                    Cantidad: { type: "number" },
                    Color: { type: "string" },
                    Estilo: { type: "string" },
                    FM: { type: "string" },
                    NombreDiseno: { type: "string" },
                    PartePrenda: { type: "string" },
                    Tallas: { type: "string" },
                    NombreProceso: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridListaEmpaque").kendoGrid({
        change: function (e) {
            let rows = e.sender.select();
            let items = [];

            rows.each(function (e) {
                let grid = $("#gridListaEmpaque").data("kendoGrid");
                let dataItem = grid.dataItem(this);
                items.push(dataItem.id);
            });
            StrIdHojaBandeo = items;
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdHojaBandeo", title: "id Hoja Bandeo", hidden: true },
            { field: "NoDocumento", title: "Correlativo" },
            { field: "Corte", title: "Corte/Lotes" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "FM", title: "FM/RD" },
            { field: "NombreDiseno", title: "Nombre del Diseño" },
            { field: "Estilo", title: "Estilo" },
            { field: "Tallas", title: "Rango de Tallas" },
            { field: "PartePrenda", title: "Parte" },
            { field: "Color", title: "Color" },
            { field: "NombreProceso", title: "Proceso" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridListaEmpaque").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,undefined,"multiple");
    SetGrid_CRUD_ToolbarTop($("#gridListaEmpaque").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridListaEmpaque").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridListaEmpaque").data("kendoGrid"), dS);

    $("#gridListaEmpaque").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    //var selectedRows = [];
    
    //$("#gridListaEmpaque").data("kendoGrid").bind("change", function (e) {
    //    Grid_SelectRow($("#gridListaEmpaque"), selectedRows);
    //});
    $("#gridListaEmpaque").data("kendoGrid").dataSource.read();

    vFrmG = $("#FrmCrearListEmp").kendoValidator(
        {
            rules: {
                MsgRequerido: function (input) {
                  
                    if (input.is("[name='txtNoRefePackingList']")) {
                        return input.val() !== "";
                    }

                    return true;
                },
                MsgLong: function (input) {
                    if (input.is("[name='txtNoRefePackingList']")) {
                        return input.val().length <= 20;
                    }
                    return true;
                }
            },
            messages: {
                MsgRequerido: "Requerido",
                MsgLong: "Longitud del campo es 20"
             
            }
        }).data("kendoValidator");

    //$("#txtNoRefePackingList").val("");
    //$("#txtObservacionPackingList").val("");
    if (xsIdListaEmpaque === 0) {
        $("#txtNoRefePackingList").val("");
        $("#txtObservacionPackingList").val("");
        TextBoxReadOnly($("#txtNoRefePackingList"), true);
        TextBoxReadOnly($("#txtObservacionPackingList"), true);
        $("#txtNoRefePackingList").focus();
    } else {
        fn_Get_CabLE(xsIdListaEmpaque);
    }

    $("#btnCrea_registro").click(function () {
        fn_CrearReg();
    });
};

let fn_CrearReg = () => {
    let result = false;
    if (vFrmG.validate()) {
        if (StrIdHojaBandeo.length !== 0) {
            let Bandeos = [];
            $.each(StrIdHojaBandeo, function (index, elemento) {
                Bandeos.push({
                    IdHojaBandeo: Number(elemento),
                    Peso: 0,
                    Descripcion: ""
                });
            });
            result = fn_Gen_PakigList(Bandeos);
        } else {
            result = false;
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
        }

    } else {
        result = false;
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
    }
   
    return result;
};

var fn_Reg_CrearListaEmpaque = (strjson) => {
    xidHoja = strjson.sIdHb;
    xsDivLe = strjson.sDiv;
    xsIdListaEmpaque = strjson.sIdListaEmpaque;
    $("#gridListaEmpaque").data("kendoGrid").dataSource.read();
    if (xsIdListaEmpaque === 0) {
        $("#txtNoRefePackingList").val("");
        $("#txtObservacionPackingList").val("");
        TextBoxReadOnly($("#txtNoRefePackingList"), true);
        TextBoxReadOnly($("#txtObservacionPackingList"), true);
    } else {
        fn_Get_CabLE(xsIdListaEmpaque);
    }

    StrIdHojaBandeo = [];
    $("#txtNoRefePackingList").focus();



};

let fn_Gen_PakigList = (strBande) => {
    let resultPak = false;
        kendo.ui.progress($(".k-window"), true);
        $.ajax({
            url: TSM_Web_APi + "ListaEmpaques/Packing",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                NoDocumento: $("#txtNoRefePackingList").val(),
                Observacion: $("#txtObservacionPackingList").val(),
                Peso: 0,
                IdUsuarioMod: getUser(),
                HojasBandeo: strBande,
                IdListaEmpaque: xsIdListaEmpaque
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                $("#gridListaEmpaque").data("kendoGrid").dataSource.read();
                RequestEndMsg(datos, "Post");
                kendo.ui.progress($(".k-window"), false);
                $("#txtNoRefePackingList").val("");
                $("#" + `${xsDivLe}`).data("kendoWindow").close();
                resultPak = true;
                StrIdHojaBandeo = [];
            },
            error: function (data) {
                ErrorMsg(data);
                resultPak = false;
            },
            complete: function () {
                kendo.ui.progress($(".k-window"), false);
            }
        });
    return resultPak;
    
}

var fn_focusLista = () => {
    $("#txtNoRefePackingList").focus()
};

let fn_Get_CabLE = (xId) => {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "ListaEmpaques/" + `${xId}`,
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            if (dato !== null) {
                $("#txtNoRefePackingList").val(dato.NoDocumento);
                $("#txtObservacionPackingList").val(dato.Observacion);
                TextBoxReadOnly($("#txtNoRefePackingList"), false);
                TextBoxReadOnly($("#txtObservacionPackingList"), false);

            } else {
                $("#txtNoRefePackingList").val("");
                $("#txtObservacionPackingList").val("");
                TextBoxReadOnly($("#txtNoRefePackingList"), true);
                TextBoxReadOnly($("#txtObservacionPackingList"), true);
            }
            kendo.ui.progress($(".k-dialog"), false);
        },
        error: function () {
            kendo.ui.progress($(".k-dialog"), false);
        }
    });

};
