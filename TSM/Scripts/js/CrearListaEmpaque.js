﻿"use strict"
let xidHoja;
let StrIdHojaBandeo = "";
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


};

let fn_CrearReg = () => {
    let result = false;
    if (StrIdHojaBandeo !== "") {
        let Bandeos = [];
        $.each(StrIdHojaBandeo, function (index, elemento) {
            Bandeos.push({
                IdHojaBandeo: Number(elemento),
                Peso: 0,
                Descripcion: ""
            });
        });
        result= fn_Gen_PakigList(Bandeos);


    } else {
        result = false;
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar campos requeridos", "error");
    }

    return result;
};

let fn_Reg_CrearListaEmpaque = (siaIdot) => {

    $("#gridListaEmpaque").data("kendoGrid").dataSource.read();

};

let fn_Gen_PakigList = (strBande) => {
    let resultPak = false;
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "ListaEmpaques/Packing",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                NoDocumento: "",
                Peso: 0,
                dUsuarioMod: getUser(),
                HojasBandeo: strBande
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                $("#gridListaEmpaque").data("kendoGrid").dataSource.read();
                RequestEndMsg(datos, "Post");
                kendo.ui.progress($(".k-dialog"), false);
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
