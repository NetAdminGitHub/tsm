
$(document).ready(function () {
 
    var dataSource = new kendo.data.DataSource({
        dataType: "json",

        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: crudServiceBaseUrl,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }

            }
        },

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdBitacora",
                fields: {
                    IdBitacora: { type: "number" },
                    IdError: { type: "number" },
                    Mensaje: { type: "string" },
                    Fecha: { type: "date" },
                    Usuario: { type: "string" }

                }
            }
        }



    });

    //CONFIGURACION DEL GRID,CAMPOS

    $("#grid").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBitacora", title: "Código Bitacora", editor: Grid_ColInt64NumSinDecimal },
            { field: "IdError", title: "Código Error" },
            { field: "Mensaje", title: "Mensaje" },
            { field: "Fecha", title: "Fecha", format: "{0:dd/MM/yyyy}" },
            { field: "Usuario", title: "Usuario" }
        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_Toolbar(e = $("#grid").data("kendoGrid"), false, false, false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    $("#grid").data("kendoGrid").bind("dataBound", function(e) { //foco en la fila
        Grid_SelectRow($("#grid"))
    })


});
