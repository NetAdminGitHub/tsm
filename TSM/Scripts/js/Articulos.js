var Permisos;
$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "Articulos/GetConsulta",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "Articulos" + "/" + datos.IdArticulo; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdArticulo",
                fields: {
                    IdArticulo: { type: "string" },
                    Nombre: { type: "string" },
                    Alias: { type: "string" },
                    IdUnidadMedida: { type: "number" },
                    NombreUnidad: { type: "string" },
                    Estado: { type: "string" },
                    NombreEstado: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Costo: { type: "number" },
                    Alto: { type: "number" },
                    Ancho: { type: "number" },
                    Quimica: { type: "string" },
                    TipoTinta: { type: "string" },
                    Especialidad: { type: "string" },
                    ClaseOEKOTEX: { type: "string" },
                    CumpleOEKOTEX: { type: "string" },
                    EstatusOEKOTEX: { type: "string" },
                    TamanoParticula: { type: "string" },
                    TipoUso: { type: "string" },
                    Marca: { type: "string" },
                    AditivoPorcentajeMaxCarga: { type: "number" },
                    PigmentoPorcentajeMaxCarga: { type: "number" }

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        toolbar: ["excel"],
        excel: {
            fileName: "Articulos_Inven_" + kendo.toString(kendo.parseDate(Fhoy()), 'ddMMyyyy') +".xlsx",
            filterable: true,
            allPages: true
        },
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdArticulo");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Alias");
            KdoHideCampoPopup(e.container, "Costo");
            KdoHideCampoPopup(e.container, "Alto");
            KdoHideCampoPopup(e.container, "Ancho");
            KdoHideCampoPopup(e.container, "IdUnidadMedida");
            KdoHideCampoPopup(e.container, "NombreUnidad");
            KdoHideCampoPopup(e.container, "Marca");
            KdoHideCampoPopup(e.container, "Quimica");
            KdoHideCampoPopup(e.container, "Especialidad");
            KdoHideCampoPopup(e.container, "ClaseOEKOTEX");
            KdoHideCampoPopup(e.container, "CumpleOEKOTEX");
            KdoHideCampoPopup(e.container, "EstatusOEKOTEX");
            KdoHideCampoPopup(e.container, "TamanoParticula");
            KdoHideCampoPopup(e.container, "TipoUso");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NombreEstado");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");

            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "IdArticulo", title: "Código de artículo", minResizableWidth: 120,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Nombre", title: "Nombre", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Alias", title: "Alias", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Costo", title: "Costo",  format: "{0:c6}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2],
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["", "0", "9999999999", "n2", 2],
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdUnidadMedida", title: "Código Unidad" },
            {
                field: "NombreUnidad", title: "Unidad Med", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Marca", title: "Marca", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Quimica", title: "Química", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Especialidad", title: "Especialidad", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "ClaseOEKOTEX", title: "Clase OEKOTEX", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "CumpleOEKOTEX", title: "Cumple OEKOTEX", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "EstatusOEKOTEX", title: "Estatus OEKOTEX", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "TamanoParticula", title: "Tamaño Particula", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "TipoUso", title: "Tipo Uso", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "AditivoPorcentajeMaxCarga", title: "Aditivo %Max Carga", editor: Grid_ColNumeric, values: ["required", "0", "100", "P2", 4], format: "{0:P2}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "PigmentoPorcentajeMaxCarga", title: "Pigmento %Max Carga", editor: Grid_ColNumeric, values: ["required", "0", "100", "P2", 4], format: "{0:P2}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "Estado", title: "Cod.Estado", hidden: true },
            {
                field: "NombreEstado", title: "Estado", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0, true, "row");
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "340");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "340");
});

fPermisos = function (datos) {
    Permisos = datos;
};