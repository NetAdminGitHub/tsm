"use strict"
let xidHoja;
let StrIdHojaBandeo = "";
let vFrmG;
let fn_Ini_CrearListaEmpaque = (sIdHb) => {
    xidHoja = sIdHb;


//#region crear grid ingresos

    var ds = new kendo.data.DataSource({
        pageSize: 50,
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "HojasBandeos/GetSinPakingbyIdIngreso/" + `${xidHoja}`; },
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
                id: "IdHojaBandeo",
                fields: {
                    IdHojaBandeo: { type: "string" },
                    NoDocumento: { type: "string" },
                    Corte: { type: "string" },
                    Cantidad: { type: "number" },
                    Color: { type: "string" },
                    Estilo: { type: "string" },
                    Tallas: { type: "string" }
                }
            }
        }
    });
    $("#gridListaEmpaque").kendoGrid({
        dataSource:ds,
        noRecords: {
            template: "No hay datos disponibles. La pagina actual es: #=this.dataSource.page()#"
        },
        scrollable: false,
        persistSelection: true,
        sortable: true,
        change: function (arg) {
            StrIdHojaBandeo = this.selectedKeyNames();
        },
        pageable:{
            input: true,
            refresh: true,
            pageSizes: [20, 50, 100, "all"]
        },
        height: 300,
        resizable: true,
        navigatable: true,
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdHojaBandeo", title: "id Hoja Bandeo", hidden: true },
            { field: "NoDocumento", title: "Correlativo" },
            { field: "Corte", title: "Corte" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Color", title: "Color", },
            { field: "Estilo", title: "Estilo" },
            { field: "Tallas", title: "Tallas" }
        ]
    });

    $("#gridListaEmpaque").data("kendoGrid").dataSource.read();

//#endregion 

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

    $("#txtNoRefePackingList").val("");
    $("#txtNoRefePackingList").focus();

};

let fn_CrearReg = () => {
    let result = false;
    if (vFrmG.validate()) {
        if (StrIdHojaBandeo !== "") {
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

let fn_Reg_CrearListaEmpaque = (siaIdot) => {

    $("#gridListaEmpaque").data("kendoGrid").dataSource.read();
    $("#txtNoRefePackingList").val("");
    $("#txtNoRefePackingList").focus();

};

let fn_Gen_PakigList = (strBande) => {
    let resultPak = false;
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "ListaEmpaques/Packing",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                NoDocumento: $("#txtNoRefePackingList").val(),
                Peso: 0,
                IdUsuarioMod: getUser(),
                HojasBandeo: strBande
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                $("#gridListaEmpaque").data("kendoGrid").dataSource.read();
                RequestEndMsg(datos, "Post");
                kendo.ui.progress($(".k-dialog"), false);
                $("#txtNoRefePackingList").val("");
                resultPak = true;
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
