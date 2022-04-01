var Permisos;
var XIdCata = 0;
let Mul2;

$(document).ready(function () {
    //KdoMultiColumnCmbSetValue($("#CmbFM"), "");

    $("#CmbFmCata").ControlSelecionFMCatalogo();
    if (sessionStorage.getItem("ForumlasFM_CmbFmCata") !== null && sessionStorage.getItem("ForumlasFM_CmbFmCata") !== "") {
        Mul2 = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        Mul2.search(sessionStorage.getItem("ForumlasFM_NoReferencia"));
        Mul2.text(sessionStorage.getItem("ForumlasFM_NoReferencia") === null ? "" : sessionStorage.getItem("ForumlasFM_NoReferencia"));
        Mul2.trigger("change");
        Mul2.close();
    }

    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetFormulasOTByFM/" + XIdCata; },
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
                    FM: { type: "string" },
                    IDOrdenTrabajo: { type: "number" },
                    OT: { type: "string" },
                    Cliente: { type: "string" },
                    Nombre: { type: "string" },
                    Estacion: { type: "number" },
                    Diseno: { type: "string" },
                    Seda: { type: "number" },
                    Letra: { type: "string" },
                    Dureza: { type: "number" },
                    Quimica: { type: "string" },
                    IdArticulo: { type: "string" },
                    Articulo: { type: "string" },
                    Estado: { type: "string" },                    
                    Porcentaje: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        toolbar: ["excel"],
        excel: {
            fileName: "Articulos_Inven_" + kendo.toString(kendo.parseDate(Fhoy()), 'ddMMyyyy') + ".xlsx",
            filterable: true,
            allPages: true
        },
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "FM", title: "Código FM", minResizableWidth: 120,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "IDOrdenTrabajo", title: "IDOrdenTrabajo", hidden: true, minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "OT", title: "Orden de Trabajo", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Diseno", title: "Diseño", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Cliente", title: "Cliente", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Estacion", title: "Estacion", editor: Grid_ColNumeric,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Nombre", title: "Color", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Quimica", title: "Quimica", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Seda", title: "Seda", minResizableWidth: 200,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Letra", title: "Letra",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Dureza", title: "Dureza",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "IdArticulo", title: "IdArticulo", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Articulo", title: "Nombre Articulo", minResizableWidth: 200,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Estado", title: "Estado Artículo", minResizableWidth: 200,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Porcentaje", title: "Porcentaje", editor: Grid_ColNumeric, format: "{0:p2}",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            }
        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0, true, "row");
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, false);
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

    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            XIdCata = 0;
            dataSource.read();
            sessionStorage.setItem("ForumlasFM_CmbFmCata", "");
            sessionStorage.setItem("ForumlasFM_NoReferencia", "");
            fn_HabilitarControles(false);
        } else {
            XIdCata = data.IdCatalogoDiseno;
            dataSource.read();
            sessionStorage.setItem("ForumlasFM_CmbFmCata", data.IdCatalogoDiseno);
            sessionStorage.setItem("ForumlasFM_NoReferencia", data.NoReferencia);
            fn_HabilitarControles(true);
        }
    });

    if (sessionStorage.getItem("ForumlasFM_CmbFmCata") !== null) {
        XIdCata = sessionStorage.getItem("ForumlasFM_CmbFmCata") === "" || sessionStorage.getItem("ForumlasFM_CmbFmCata") === null ? 0 : sessionStorage.getItem("ForumlasFM_CmbFmCata");
        dataSource.read();
    }
});

let fn_HabilitarControles = function (estado) {
    if (estado) {
        $("#grid").removeClass("k-state-disabled");
    }
    else {
        $("#grid").addClass("k-state-disabled");
    }
};

fPermisos = function (datos) {
    Permisos = datos;
};