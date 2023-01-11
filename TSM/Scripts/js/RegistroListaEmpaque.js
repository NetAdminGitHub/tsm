'use strict'

let pJsonCP = "";

var fn_Ini_RegistrarEmpaque = (xjson) => {
    pJsonCP = xjson;

    KdoButton($("#btnGuardarRegistro"), "save", "Guardar Registro");

    let dataSource = new kendo.data.DataSource({
        data: pJsonCP.pArrayEmbalaje
    });

    $("#gridEmbalajesRevision").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEmbalajeMercancia", title: "id", hidden: true },
            { field: "IdEmbalaje", title: "id Embalaje", hidden: true },
            { field: "NoDocumento", title: "Correlativo" },
            { field: "FechaCreacion", title: "Fecha Registro", format: "{0: dd/MM/yyyy HH:mm:ss}" },
            { field: "UnidadEmbalaje", title: "Unidad Embalaje" },
            { field: "CantidadCortes", title: "Corte" },
            { field: "CantidadMercancia", title: "Mercancía" },
            { field: "Cantidad", title: "Cantidad" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridEmbalajesRevision").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si, 430, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridEmbalajesRevision").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEmbalajesRevision").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEmbalajesRevision").data("kendoGrid"), dataSource);

    $("#btnGuardarRegistro").data("kendoButton").bind("click", function (e) {
        
    });
}

var fn_Reg_RegistrarEmpaque = (xjson) => {
    pJsonCP = xjson;

    let dataSource = new kendo.data.DataSource({
        data: pJsonCP.pArrayEmbalaje
    });

    $("#gridEmbalajesRevision").data("kendoGrid").setDataSource(dataSource);
}
