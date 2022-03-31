"use strict"

let StrJsonNotaRemision;
let declaracion;
let validarRemisionCliente;

var fn_Ini_IngresoNotaRemision = (sidDeclaracion) => {
    declaracion = sidDeclaracion;
    //fecha de ingreso
    $("#FechaDocumento").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#FechaDocumento").data("kendoDatePicker").value(Fhoy());



    //#region crear grid ingresos
    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "DeclaracionMercanciasItems/GetItemDetalleSinNota/" + `${declaracion}` },
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
                id: "Item",
                fields: {
                    IdDeclaracionMercancia: { type: "number", defaultValue: function () { return xIdDeMerca; } },
                    Item: { type: "number" },
                    IdIncisoArancelario: { type: "string" },
                    IncisoArancelario: { type: "string" },
                    DescripcionInciso: { type: "string" },
                    IdPais: { type: "string", defaultValue: function () { return 60; } },
                    NombrePais: { type: "string" },
                    Descripcion: { type: "string" },
                    PesoBruto: { type: "number" },
                    IdUnidadPesoBruto: { type: "string", defaultValue: function () { return 1; } },
                    Abreviatura: { type: "string" },
                    CantidadBultos: { type: "number" },
                    PrecioUnitario: { type: "number" },
                    IdEmbalaje: { type: "string", defaultValue: function () { return 1; } },
                    NombreEmbalaje: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridItemsDmSinNota").kendoGrid({
                   //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "50px" },
            { field: "IdDeclaracionMercancia", title: "id Declaracion", hidden: true },
            { field: "Item", title: "Item" },
            {
                field: "IdIncisoArancelario", title: "Inciso Arancelario", hidden: true,
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" id ="' + options.field + '" />').appendTo(container).ControlSelecionIncisos();
                }
            },

            { field: "IncisoArancelario", title: "IncisoArancelario",hidden:true  },
            { field: "DescripcionInciso", title: "DescripcionInciso", hidden: true },
            { field: "IdPais", title: "Pais", hidden: true },
            { field: "NombrePais", title: "NombrePais", hidden: true },
            { field: "Descripcion", title: "Descripcion" },
            { field: "PesoBruto", title: "Peso", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "IdUnidadPesoBruto", title: "Unidad", editor: Grid_Combox, values: ["IdUnidad", "Nombre", TSM_Web_APi + "UnidadesMedidas", "", "Seleccione...."], hidden: true },
            { field: "Abreviatura", title: "Unidad" },
            { field: "CantidadBultos", title: "Total de Bultos", editor: Grid_ColNumeric, values: ["required", "1", "9999999999999999", "#", 0] },
            { field: "PrecioUnitario", title: "Precio unitario", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "N2", 2], format: "{0:N2}" },
            { field: "Valor", title: "Valor", format: "{0:N2}" },
            { field: "IdEmbalaje", title: "IdEmbalaje", hidden: true /*editor: Grid_Combox, values: ["IdEmbalaje", "Nombre", TSM_Web_APi + "EmbalajeDeclaracionMercancias", "", "Seleccione...."] */ },
            { field: "NombreEmbalaje", title: "NombreEmbalaje" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridItemsDmSinNota").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,undefined,"multiple");
    SetGrid_CRUD_ToolbarTop($("#gridItemsDmSinNota").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridItemsDmSinNota").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridItemsDmSinNota").data("kendoGrid"), dS);

    $("#gridItemsDmSinNota").kendoTooltip({
        filter: ".k-grid-btnIng",
        content: function (e) {
            return "Ingreso de Mercancía";
        }
    });
    var selectedRows = [];


    $("#gridItemsDmSinNota").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridItemsDmSinNota"), selectedRows);
    });
    $("#gridItemsDmSinNota").data("kendoGrid").dataSource.read();

    //#endregion 
    $("#txtSerie").focus();

     validarRemisionCliente = $("#FrmNotaRemisionCliente").kendoValidator(
        {
            rules: {
                MsgRequerido: function (input) {
                    if (input.is("[name='txtSerie']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='txtNoDocumento']")) {
                        return input.val() !== "";
                    }
                    if (input.is("[name='FechaDocumento']")) {
                        return input.data("kendoDatePicker").value();
                    }

                  
                    return true;
                }
            },
            messages: {
                MsgRequerido: "Campo Requerido"
            }
        }).data("kendoValidator");






};



let fn_CreaNotaRemCliente = () => {
    let result = false;

    var grid = $("#gridItemsDmSinNota").data("kendoGrid");
    var selected = [];
    grid.select().each(function () {
        selected.push(grid.dataItem(this));
    });

    if (validarRemisionCliente.validate()) {

        if (selected.length > 0) {
            let ItemsDetalle = [];
            $.each(selected, function (index, elemento) {
                ItemsDetalle.push({
                    Embalaje: Number(elemento.IdEmbalaje),
                    IdUnidad: Number(elemento.IdUnidadPesoBruto),
                    Cantidad: Number(elemento.CantidadBultos),
                    Descripcion: String(elemento.Descripcion),
                    PrecioUnitario: Number(elemento.PrecioUnitario),
                    Monto: Number(elemento.Valor),
                    ItemDM: Number(elemento.Item)

                });
            });
            result = fn_RegistraNota(ItemsDetalle);


        } else {
            result = false;
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar al menos un elemento de la lista.", "error");
        }

    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }

   

    return result;
};



let fn_RegistraNota = (strDetalleNota) => {
    let result = false;
    kendo.ui.progress($(".k-dialog"), true);
    $.ajax({
        url: TSM_Web_APi + "NotasRemision/Nota",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
            Serie: $("#txtSerie").val(),
            NoDocumento: $("#txtNoDocumento").val(),
            IdDeclaracionMercancia: declaracion,
            FechaDocumento: kendo.toString(kendo.parseDate($("#FechaDocumento").val()), 'yyyyMMdd'),
            Descripcion: $("#txtDescripcion").val(),
            IdUsuarioMod: getUser(),
            Despacho: false, //Envía false de manera predeterminada para indicar que es una nota de remisión de cliente 
            Mercancias: strDetalleNota
        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            $("#gridItemsDmSinNota").data("kendoGrid").dataSource.read();
            RequestEndMsg(datos, "Post");
            kendo.ui.progress($(".k-dialog"), false);
            result = true;
        },
        error: function (data) {
            ErrorMsg(data);
            result = false;
        },
        complete: function () {
            kendo.ui.progress($(".k-dialog"), false);
            $("#txtSerie").val("");
            $("#txtNoDocumento").val("");
            $("#FechaDocumento").data("kendoDatePicker").value(Fhoy());
            $("#txtDescripcion").val("");
        }
    });
    return result;

}



var fn_Reg_IngresoNotaRemision = (sIdRegNotaRemi) => {
    declaracion = sIdRegNotaRemi;
    $("#gridItemsDmSinNota").data("kendoGrid").dataSource.read();
    $("#txtSerie").focus();
};
