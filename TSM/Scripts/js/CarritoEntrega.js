let xIdCarritoFin = 0;
let strResultQR;
let xdivmod= "";
var fn_Ini_CarritoEnt = (xjson) => {
    xdivmod = xjson.divmod;
    xIdCarritoFin = 0;
    Kendo_CmbFiltrarGrid($("#dropdMaquina"), TSM_Web_APi + "CatalogoMaquinas", "NoMaquina", "IdCatalogoMaquina", "Seleccione Máquina");
    KdoButton($("#btnRegistrar"), "save", "Registrar");
    KdoButton($("#btnCancelar"), "close", "cerrar");
    TextBoxEnable($("#txtFm"), false);
    TextBoxEnable($("#txtNoBulto"), false);
    $("#txtBulto").val("");

    KdoButtonEnable($("#btnRegistrar"), false);
    //#region crear grid Lista
    let dSlis = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CarritosDetallesMercancias/GetCarritosFinalizado/" + `${xIdCarritoFin}` },
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
                id: "IdCarrito",
                fields: {
                    IdCarrito: { type: "number" },
                    IdMercancia: { type: "number" },
                    IdCatalogoDiseno: { type: "number" },
                    NoDocumento: { type: "string" },
                    Color: { type: "string" },
                    Talla: { type: "string" },
                    Cantidad: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gCarritoFinlizado").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCarrito", title: "Id Carrito", hidden: true },
            { field: "IdMercancia", title: "Id Mercancia", hidden: true },
            { field: "IdCatalogoDiseno", title: "Id Mercancia", hidden: true },
            { field: "NoDocumento", title: "Bulto/Rollo:" },
            { field: "Color", title: "Color" },
            { field: "Talla", title: "Talla" },
            { field: "Cantidad", title: "Cantidad" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gCarritoFinlizado").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,300);
    SetGrid_CRUD_ToolbarTop($("#gCarritoFinlizado").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gCarritoFinlizado").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gCarritoFinlizado").data("kendoGrid"), dSlis);

    var selectedRows2 = [];
    //$("#gCarritoFinlizado").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
    //    Grid_SetSelectRow($("#gCarritoFinlizado"), selectedRows2);
    //});

    $("#gCarritoFinlizado").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gCarritoFinlizado"), selectedRows2);
    });

    $("#gCarritoFinlizado").data("kendoGrid").dataSource.read();

    //#endregion 


    $("#txtBulto").on('keypress', function (e) {
        if (e.which == 13) {
            let xval = $("#txtBulto").val();
            strResultQR = xval.split("|");
            if (strResultQR[3] !== undefined) {
                $("#txtFm").val(strResultQR[0]);
                $("#txtNoBulto").val(strResultQR[3]);
                fn_Get_CarritoFin(strResultQR[3]);
                $("#txtBulto").focus();
                KdoCmbSetValue($("#dropdMaquina"), "");
                $("#txtBulto").val("");

            } else {
                $("#kendoNotificaciones").data("kendoNotification").show("Formato no valido", "error");
                $("#txtFm").val("");
                $("#txtNoBulto").val("");
                $("#txtBulto").focus();
                KdoCmbSetValue($("#dropdMaquina"), "");
                xIdCarritoFin = 0;
                $("#gCarritoFinlizado").data("kendoGrid").dataSource.read();
                KdoButtonEnable($("#btnRegistrar"), false);
            }
           
        }
    });
    $("#btnCancelar").click(function () {
        $("#" + `${xdivmod}`).data("kendoWindow").close();
    });
    $("#btnRegistrar").click(function () {
        if (KdoCmbGetValue($("#dropdMaquina")) === null ) {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione un maquina", "error");
            return;
        }

        if (!($("#dropdMaquina").data("kendoComboBox").selectedIndex >= 0)) {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione un maquina", "error");
            return;
        }

        if (xIdCarritoFin === 0) {
            $("#kendoNotificaciones").data("kendoNotification").show("Seleccione un # bulto", "error");
        } else {
            fn_Gen_entrega(xIdCarritoFin)
        }

        $("#txtBulto").focus();
    });
    
}


let fn_Get_CarritoFin = (idMercancia) => {
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "CarritosDetallesMercancias/GetCarritoFinbyBulto",
        dataType: 'json',
        data: JSON.stringify({ idMercancia: idMercancia }),
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        success: function (dato) {
            if (dato !== null) {
                xIdCarritoFin = dato.IdCarrito;
                $("#gCarritoFinlizado").data("kendoGrid").dataSource.read();
                KdoButtonEnable($("#btnRegistrar"), true);
            } else {

                xIdCarritoFin = 0;
                $("#gCarritoFinlizado").data("kendoGrid").dataSource.read();
                $("#txtFm").val("");
                $("#txtNoBulto").val("");
                KdoButtonEnable($("#btnRegistrar"), false);

            }
           
            kendo.ui.progress($(".k-dialog"), false);
            RequestEndMsg(dato, "Post");
        },
        error: function (dato) {
            ErrorMsg(dato);
            kendo.ui.progress($(".k-dialog"), false);
            KdoButtonEnable($("#btnRegistrar"), false);
        }
    });

};

var fn_Reg_CarritoEnt = (xjson) => {
    xdivmod = xjson.divmod;
    xIdCarritoFin = 0;
    $("#gCarritoFinlizado").data("kendoGrid").dataSource.read();
    $("#txtFm").val("");
    $("#txtNoBulto").val("");
    KdoCmbSetValue($("#dropdMaquina"), "");
    $("#txtBulto").val("");
    $("#txtBulto").focus();
    KdoButtonEnable($("#btnRegistrar"), false);

}

let fn_Gen_entrega = (xidC) => {

    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "Carritos/Entregar",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            IdCarrito: xidC,
            IdCatalogoMaquina: Number( KdoCmbGetValue($("#dropdMaquina")))
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            RequestEndMsg(datos, "Post");
            kendo.ui.progress($(".k-dialog"), false);
            xIdCarritoFin = 0;
            $("#" + `${xdivmod}`).data("kendoWindow").close();

        },
        error: function (data) {
            ErrorMsg(data);
            $("#txtBulto").focus();
            kendo.ui.progress($(".k-dialog"), false);
        }
       
    });
}

var fn_focusCarritoEnt = () => {
    $("#txtBulto").focus();
};