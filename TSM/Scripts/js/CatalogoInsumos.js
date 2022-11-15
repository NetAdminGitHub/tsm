
var Permisos;
var StrIdCatalogoInsu="";
// #region funcion registrar cambio en Ax
function Registar_click() {
    if (StrIdCatalogoInsu !== "") {
        ConfirmacionMsg("¿Está seguro de crear las filas seleccionados en la tabla Catalogo insumos?", function () { return Registro(); });
    }
    else {
        $("#kendoNotificaciones").data("kendoNotification").show("seleccione al menos un registro para continuar", "error");
    }
}
function Registro() {
    kendo.ui.progress($("#gridComparar"), true);
    var Lista = [];
    $.each(StrIdCatalogoInsu, function (index, elemento) {
        Lista.push(selectElementos(elemento));
    });

    $.ajax({
        type: "Post",
        dataType: 'json',
        //async: false,
        data: JSON.stringify(Lista),
        url: crudServiceBaseUrl + "/RegistrarCambio",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            RequestEndMsg(result, "Post");
            $("#gridComparar").data("kendoGrid").dataSource.read();
            kendo.ui.progress($("#gridComparar"), false);
            StrIdCatalogoInsu = "";
        }
    });
    return false
}
//#endregion 

//#region funcion exporta ax
function exportar_click() {
    var grid = $("#gridComparar").data("kendoGrid");
    grid.saveAsExcel();
    //grid.workbook.fileName = "Diferencia TSM vrs AX.xlsx";
    return false
}
//#endregion

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
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCatalogoInsumo; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdCatalogoInsumo; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
                dataType: "json",
                type: "POST",
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
                id: "IdCatalogoInsumo",
                fields: {
                    IdCatalogoInsumo: { type: "number" },
                    Nombre: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Nombre']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='Color']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Color: {
                        type: "string"
                    },
                    Alto: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    Ancho: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    IdUnidadDimension: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Nombre1: {
                        type: "string"                        
                    },
                    Costo: {
                        type: "number",
                        validation: {
                            required: true
                        }
                    },
                    FechaMod: {
                        type: "date",
                        defaultValue: function (e) { return Fhoy();}
                    },
                    CodArticulo: {
                        type: "string"                     
                    },
                    IdTamanoInsumo: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre2: {
                        type: "string"
                    },
                    IdGradoInsumo: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre3: {
                        type: "string"
                    },
                    IdFormaTipoInsumo: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre4: {
                        type: "string"
                    },
                    GrossPorBolsa: {
                        type: "numeric",defaultValue:0
                    },
                    PiedrasPorBolsa: {
                        type: "numeric", defaultValue: 0
                    },
                    IdTecnica: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre5: {
                        type: "string"
                    },
                    IdServicio: {
                        type: "numeric",
                        validation: {
                            required: false
                        }
                    },
                    Nombre6: {
                        type: "string"
                    },
                    EsPapel: { type: "bool" },
                    EsRhinestone: { type: "bool" },
                    IdUsuarioMod: {type:"string"}

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            e.container.find("label[for=IdCatalogoInsumo]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdCatalogoInsumo]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre1]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre1]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre2]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre2]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre3]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre3]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre4]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre4]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre5]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre5]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=Nombre6]").parent("div .k-form-field").hide();
            e.container.find("label[for=Nombre6]").parent().next("div .k-edit-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent("div .k-form-field").hide();
            e.container.find("label[for=IdUsuarioMod]").parent().next("div .k-edit-field").hide();

            $('[name="FechaMod"]').data("kendoDatePicker").enable(false);

            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCatalogoInsumo", title: "Id de Insumo", editor: Grid_ColInt64NumSinDecimal ,hidden:true},
            { field: "Nombre", title: "Nombre de Insumo" },
            { field: "Alto", title: "Largo / Alto", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "n2", 2] },
            { field: "IdUnidadDimension", title: "Unidad Dimensión", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...."], hidden: true },
            { field: "Nombre1", title: "Unidad" },
            { field: "Costo", title: "Costo", editor: Grid_ColNumeric, values: ["required", "0.0000", "999999999999.9999", "n4", 4] },
            { field: "FechaMod", title: "Fecha de Modificación", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "CodArticulo", title: "Código Artículo" },
            { field: "IdTamanoInsumo", title: "Tamaño ", editor: Grid_Combox, values: ["IdTamanoInsumo", "Nombre", UrlTI, "", "Seleccione...."], hidden: true },
            { field: "Nombre2", title: "Tamaño" },
            { field: "IdGradoInsumo", title: "Id Grade ", editor: Grid_Combox, values: ["IdGradoInsumo", "Nombre", UrlGI, "", "Seleccione...."], hidden: true },
            { field: "Nombre3", title: "Grade" },
            { field: "IdFormaTipoInsumo", title: "Id Forma Tipo", editor: Grid_Combox, values: ["IdFormaTipoInsumo", "Nombre", UrlFTI, "", "Seleccione...."], hidden: true },
            { field: "Nombre4", title: "Forma Tipo" },
            { field: "GrossPorBolsa", title: "Gross x Bolsa", editor: Grid_ColIntNumSinDecimal },
            { field: "PiedrasPorBolsa", title: "Piedras x Bolsa", editor: Grid_ColIntNumSinDecimal },
            { field: "IdServicio", title: " Id Servicio", editor: Grid_Combox, values: ["IdServicio", "Nombre", UrlSrv, "", "Seleccione...."], hidden: true },
            { field: "Nombre6", title: "Servicio" },
            { field: "IdTecnica", title: "Id Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione....", "", "IdServicio"], hidden: true },
            { field: "Nombre5", title: "Técnica" },
            { field: "EsPapel", title: "Papel", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); } },
            { field: "EsRhinestone", title: "Rhinestone", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsRhinestone"); } },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true},
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $(window).on("resize", function () {
        var gridWidget = $("#grid").data("kendoGrid");
        gridWidget.wrapper.height($(window).height()-"371");
        gridWidget.resize();

    });
    KdoButton($("#btnMostrarCambios"), "gears", "Sincronizar AX");
    KdoButtonEnable($("#btnMostrarCambios"), Permisos.SNProcesar);

    // #region codigo para implementar la comparacion entre Ax y TSM 

    var ResultadoAxDif = "[]";
    var ResultadoAxNoTSM = "[]";
    var ResultadoTSMnoAX = "[]";

    var AxTrama = JSON.stringify({
        Key: "URLAXDEV",
        Solicitud: "{ 'getItems': { '@dataAreaId': 'tec', '@itemId': '01*' } }"

    });

    var fn_consultarAx = function (opc) {
        kendo.ui.progress($("#gridComparar"), true);
        if (opc === 3 || opc === 1) {kendo.ui.progress($("#gridComparar"), true);}
        if (opc === 2) { kendo.ui.progress($("#gridNoExistenTSM"), true); }
        if (opc === 4) { kendo.ui.progress($("#gridNoExistenAX"), true); }

        $.ajax({
            type: "POST",
            dataType: 'json',
            data: AxTrama,
            url: crudServiceBaseUrl + "/GetInsumosComparar",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (opc === 3) {
                    ResultadoAxDif = result.filter(element => element.IdCatalogoInsumo !== 0 && element.clave === "SAX");
                    ResultadoAxNoTSM = result.filter(element => element.IdCatalogoInsumo === 0 && element.clave === "NTS");
                    ResultadoTSMnoAX = result.filter(element => element.IdCatalogoInsumo !== 0 && element.clave === "NAX");
                    // guardo resultados que existen en el TSM con diferencia.
                    $("#gridComparar").data("kendoGrid").dataSource.read();
                    KdoButtonEnable($("#btnRegistrar"), Permisos.SNEditar);
                    KdoButtonEnable($("#btnexport"), true);
                    // guardo resultados no existen en el TSM .
                    $("#gridNoExistenTSM").data("kendoGrid").dataSource.read();
                    // guardo resultados no existen AX .
                    $("#gridNoExistenAX").data("kendoGrid").dataSource.read();

                    kendo.ui.progress($("#gridComparar"), false);
                }
                if (opc === 1) {
                    ResultadoAxDif = result.filter(element => element.IdCatalogoInsumo !== 0 && element.clave === "SAX");
                    $("#gridComparar").data("kendoGrid").dataSource.read();
                    KdoButtonEnable($("#btnRegistrar"), Permisos.SNEditar);
                    KdoButtonEnable($("#btnexport"), true);
                    kendo.ui.progress($("#gridComparar"), false);
                }
                if (opc === 2) {
                    ResultadoAxNoTSM = result.filter(element => element.IdCatalogoInsumo === 0 && element.clave === "NTS");
                    $("#gridNoExistenTSM").data("kendoGrid").dataSource.read();
                    kendo.ui.progress($("#gridNoExistenTSM"), false);
                }
                if (opc === 4) {
                    ResultadoTSMnoAX = result.filter(element => element.IdCatalogoInsumo !== 0 && element.clave === "NAX");
                    $("#gridNoExistenAX").data("kendoGrid").dataSource.read();
                    kendo.ui.progress($("#gridNoExistenAX"), false); 
                }
            }
        });
    };

    var DsComparar = new kendo.data.DataSource({
        sort: {
            field: "CodArticulo", dir: "asc"
        },
        transport: {
            read: function (datos) {

                if (ResultadoAxDif === "[]") {
                    ResultadoAxDif = "[]"
                    datos.success("");
                    ;
                } else {

                    if (ResultadoAxDif !== "") {
                        datos.success(ResultadoAxDif);
                    } else {
                        fn_consultarAx(1);
                        datos.success(ResultadoAxDif);
                    }
                    ResultadoAxDif = "";
                }

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdCatalogoInsumo",
                fields: {
                    CodArticulo: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    NombreBusqueda: {
                        type: "string"
                    },
                    Alto: {
                        type: "number"
                    },
                    Ancho: {
                        type: "number"
                    },
                    Costo: {
                        type: "number"
                    },
                    IdCatalogoInsumo: {
                        type: "number"
                    },
                    Nombre1: {
                        type: "string"
                    },
                    EsPapel: { type: "bool" },
                    EsRhinestone: { type: "bool" },
                    Alto1: {
                        type: "number"
                    },
                    Ancho1: {
                        type: "number"
                    },
                    Costo1: {
                        type: "number"
                    }
                }
            }
        }

    });
    
    var DsNoTSM = new kendo.data.DataSource({

        sort: {
            field: "CodArticulo", dir: "asc"
        },
        transport: {
            read: function (datos) {

                if (ResultadoAxNoTSM === "[]") {
                    ResultadoAxNoTSM = "[]"
                    datos.success("");
               
                } else {

                    if (ResultadoAxNoTSM !== "") {
                        datos.success(ResultadoAxNoTSM);
                    } else {
                        fn_consultarAx(2);
                        datos.success(ResultadoAxNoTSM);
                    }
                    ResultadoAxNoTSM = "";
                }

            },
            update: function (datos) {
                kendo.ui.progress($("#gridComparar"), true);
                $.ajax({
                    type: "post",
                    dataType: 'json',
                    data: kendo.stringify(datos.data),
                    url: crudServiceBaseUrl,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        kendo.ui.progress($("#gridComparar"), false);
                        datos.success(result);
                    }
                });
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "CodArticulo",
                fields: {
                    CodArticulo: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    NombreBusqueda: {
                        type: "string"
                    },
                    Alto: {
                        type: "number"
                    },
                    Ancho: {
                        type: "number"
                    },
                    Costo: {
                        type: "number"
                    },
                    IdCatalogoInsumo: {
                        type: "number"
                    },
                    Nombre1: {
                        type: "string"
                    },
                    Alto1: {
                        type: "number"
                    },
                    Ancho1: {
                        type: "number"
                    },
                    Costo1: {
                        type: "number"
                    },
                    EsPapel: { type: "bool" },
                    EsRhinestone: { type: "bool" },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    },
                    IdServicio: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    },
                    IdUnidadDimension: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    }


                }
            }
        }

    });

    var DsNoAx = new kendo.data.DataSource({

        sort: {
            field: "CodArticulo", dir: "asc"
        },
        transport: {
            read: function (datos) {

                if (ResultadoTSMnoAX === "[]") {
                    ResultadoTSMnoAX = "[]"
                    datos.success("");
                    ;
                } else {

                    if (ResultadoTSMnoAX !== "") {
                        datos.success(ResultadoTSMnoAX);
                    } else {
                        fn_consultarAx(4);
                        datos.success(ResultadoTSMnoAX);
                    }
                    ResultadoTSMnoAX = "";
                }

            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "CodArticulo",
                fields: {
                    CodArticulo: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    NombreBusqueda: {
                        type: "string"
                    },
                    Alto: {
                        type: "number"
                    },
                    Ancho: {
                        type: "number"
                    },
                    Costo: {
                        type: "number"
                    },
                    IdCatalogoInsumo: {
                        type: "number"
                    },
                    Nombre1: {
                        type: "string"
                    },
                    Alto1: {
                        type: "number"
                    },
                    Ancho1: {
                        type: "number"
                    },
                    Costo1: {
                        type: "number"
                    },
                    EsPapel: { type: "bool" },
                    EsRhinestone: { type: "bool" },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    },
                    IdServicio: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    },
                    IdUnidadDimension: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    }


                }
            }
        }

    });

    $.ajax({
        url: "/CatalogoInsumos/InsumosComparar",
        method: 'GET',
        hidden: true,
        success: function (result) {
            var RList = [];
            $("#viewCataInsumos").kendoDialog({
                height: $(window).height() - "125" + "px",
                width: "85%",
                title: "Catalogo insumos comparar",
                closable: true,
                modal: true,
                content: result,
                visible: false,
                close: Cerrar
            });

            $("#TabCI").kendoTabStrip({
                tabPosition: "left",
                animation: { open: { effects: "fadeIn" } }
            });

            //#region Grid TSM vrs AX
          
            //CONFIGURACION DEL GRID,CAMPOS
            $("#gridComparar").kendoGrid({
                dataBound: function (e) {
               
                    var columns = e.sender.columns;
                    var columnIndex = this.wrapper.find(".k-grid-header [data-field=" + "CodArticulo" + "]").index();

                    var NombreIndex = this.wrapper.find(".k-grid-header [data-field=" + "Nombre" + "]").index();
                    var Nombre1Index = this.wrapper.find(".k-grid-header [data-field=" + "Nombre1" + "]").index();

                    var AnchoIndex = this.wrapper.find(".k-grid-header [data-field=" + "Ancho" + "]").index();
                    var Ancho1Index = this.wrapper.find(".k-grid-header [data-field=" + "Ancho1" + "]").index();

                    var AltoIndex = this.wrapper.find(".k-grid-header [data-field=" + "Alto" + "]").index();
                    var Alto1Index = this.wrapper.find(".k-grid-header [data-field=" + "Alto1" + "]").index();

                    var CostoIndex = this.wrapper.find(".k-grid-header [data-field=" + "Costo" + "]").index();
                    var Costo1Index = this.wrapper.find(".k-grid-header [data-field=" + "Costo1" + "]").index();

                    // iterar las filas y aplicar estilo
                    var rows = e.sender.tbody.children();
                    for (var j = 0; j < rows.length; j++) {
                        var row = $(rows[j]);
                        var dataItem = e.sender.dataItem(row);
                        var rowIdCatalogo = dataItem.get("IdCatalogoInsumo");

                        var Nombrecell = row.children().eq(NombreIndex);
                        var Nombre1cell = row.children().eq(Nombre1Index);
                        var Anchocell = row.children().eq(AnchoIndex);
                        var Ancho1cell = row.children().eq(Ancho1Index);
                        var Altocell = row.children().eq(AltoIndex);
                        var Alto1cell = row.children().eq(Alto1Index);
                        var Costocell = row.children().eq(CostoIndex);
                        var Costo1cell = row.children().eq(Costo1Index);
                        var CodArticuloCell = row.children().eq(columnIndex);

                        if (rowIdCatalogo === 0) {
                            //row.removeClass("k-alt");
                            //row.addClass("new");

                            Nombrecell.addClass("new");
                            Nombre1cell.addClass("new");
                            Anchocell.addClass("new");
                            Ancho1cell.addClass("new");
                            Altocell.addClass("new");
                            Alto1cell.addClass("new");
                            Costocell.addClass("new");
                            Costo1cell.addClass("new");
                            CodArticuloCell.addClass("new");

                        } else {

                            if (dataItem.get("Nombre") !== dataItem.get("Nombre1")) {
                                Nombrecell.addClass("warning");
                                Nombre1cell.addClass("warning");
                            }

                            if (dataItem.get("Ancho") !== dataItem.get("Ancho1")) {
                                Anchocell.addClass("warning2");
                                Ancho1cell.addClass("warning2");
                            }

                            if (dataItem.get("Alto") !== dataItem.get("Alto1")) {
                                Altocell.addClass("warning3");
                                Alto1cell.addClass("warning3");
                            }

                            if (dataItem.get("Costo") !== dataItem.get("Costo1")) {
                                Costocell.addClass("warning4");
                                Costo1cell.addClass("warning4");
                            }

                        }

                    }

                },
                ////DEFICNICIÓN DE LOS CAMPOS
                change: function (arg) {
                    StrIdCatalogoInsu = this.selectedKeyNames();
                },
                persistSelection: false,
                toolbar: [
                    { template: kendo.template($("#template").html()) }
                ],
                excel: {
                    allPages: true,
                    fileName: "Diferencia TSM vrs AX.xlsx"
                },
                columns: [
                    { selectable: true, width: "50px" },
                    {
                        field: "IdCatalogoInsumo", title: "Id de Insumo", editor: Grid_ColInt64NumSinDecimal, hidden: true,
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }},
                    {
                        field: "CodArticulo", title: "Articulo AX", lockable: true,
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "Nombre", title: "Nombre AX",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    { field: "NombreBusqueda", title: "Nombre Busqueda", hidden: true },
                    {
                        field: "Alto", title: "Largo / Alto AX", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Ancho", title: "Ancho AX", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Costo", title: "Costo AX", format: "{0:n4}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Nombre1", title: "Nombre TSM",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "Alto1", title: "Largo / Alto TSM", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Ancho1", title: "Ancho TSM", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Costo1", title: "Costo TSM", format: "{0:n4}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    }

                ]
            });

            // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
            SetGrid($("#gridComparar").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, $(window).height() - "250" + "px",false, "row");
            SetGrid_CRUD_Command($("#gridComparar").data("kendoGrid"), false, false);
            Set_Grid_DataSource($("#gridComparar").data("kendoGrid"), DsComparar);
            KdoButton($("#btnRegistrar"), "save", "Registrar cambios");
            KdoButton($("#btnexport"),"excel","Exporta a Excel")
            KdoButtonEnable($("#btnRegistrar"), false);
            KdoButtonEnable($("#btnexport"), false);

            //#endregion 

            //#region Grid existe en AX y no TSM
            //CONFIGURACION DEL GRID,CAMPOS
            $("#gridNoExistenTSM").kendoGrid({
                edit: function (e) {
                    // S BLOQUEA CAMPO LLAVE ( ID)
                    KdoHideCampoPopup(e.container, "IdCatalogoInsumo");
                    KdoHideCampoPopup(e.container, "NombreBusqueda");
                    TextBoxEnable($('[name="CodArticulo"]'), false);
                    TextBoxEnable($('[name="Nombre"]'), false);
                    KdoNumerictextboxEnable($('[name="Alto"]'), false);
                    KdoNumerictextboxEnable($('[name="Ancho"]'), false);
                    KdoNumerictextboxEnable($('[name="Costo"]'), false);
                    if (e.model.IdCatalogoInsumo !== 0) {
                        KdoComboBoxEnable($('[name="IdServicio"]'),false);
                        KdoHideCampoPopup(e.container, "IdTecnica");
                        KdoCheckBoxEnable($('[name="EsRhinestone"]'),false);
                        KdoCheckBoxEnable($('[name="EsPapel"]'), false);
                        KdoComboBoxEnable($('[name="IdUnidadDimension"]'), false);
                    }

                },
                toolbar: ["excel"],
                excel: {
                    allPages: true
                },
                excelExport: function (e) {
                    e.workbook.fileName = "Art No existen en TSM.xlsx";
                },
                columns: [
                    {
                        field: "IdCatalogoInsumo", title: "Id de Insumo", editor: Grid_ColInt64NumSinDecimal, hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        } },
                    {
                        field: "CodArticulo", title: "Articulo AX",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "Nombre", title: "Nombre"
                    },
                    { field: "NombreBusqueda", title: "Nombre Busqueda", hidden: true },
                    {
                        field: "IdServicio", title: " Id Servicio", editor: Grid_Combox, values: ["IdServicio", "Nombre", UrlSrv, "", "Seleccione...."], hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }
                    },
                    {
                        field: "IdTecnica", title: "Id Técnica", editor: Grid_Combox, values: ["IdTecnica", "Nombre", UrlTec, "", "Seleccione....", "", "IdServicio"], hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }

                    },
                    {
                        field: "Alto", title: "Largo / Alto AX", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Ancho", title: "Ancho AX", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "IdUnidadDimension", title: "Unidad Dimensión", editor: Grid_Combox, values: ["IdUnidad", "Abreviatura", UrlUniMed, "", "Seleccione...."], hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }
                    },
                    {
                        field: "Costo", title: "Costo AX", format: "{0:n4}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "EsPapel", title: "Papel?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); },
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "bool"
                            }
                        }
                    },
                    {
                        field: "EsRhinestone", title: "Rhinestone?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsRhinestone"); },
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "bool"
                            }
                        }
                    }
                  

                ]
            });

            // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
            SetGrid($("#gridNoExistenTSM").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, $(window).height() - "250" + "px",true,"row");
            SetGrid_CRUD_Command($("#gridNoExistenTSM").data("kendoGrid"), Permisos.SNEditar, false);
            Set_Grid_DataSource($("#gridNoExistenTSM").data("kendoGrid"), DsNoTSM);

            var grid = $("#gridNoExistenTSM").data("kendoGrid");
            grid.bind("excelExport", function (e) {
                e.workbook.fileName = "No Existen en TSM.xlsx";
            });
            //#endregion 

            //#region Grid no existe en AX y TSM
            //CONFIGURACION DEL GRID,CAMPOS
            $("#gridNoExistenAX").kendoGrid({
               
                toolbar: ["excel"],
                excel: {
                    allPages: true
                },
                columns: [
                    {
                        field: "IdCatalogoInsumo", title: "Id de Insumo", editor: Grid_ColInt64NumSinDecimal, hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }
                    },
                    {
                        field: "CodArticulo", title: "Articulo AX",
                        filterable: {
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "Nombre", title: "Nombre"
                    },
                    { field: "NombreBusqueda", title: "Nombre Busqueda", hidden: true },
                    {
                        field: "IdServicio", title: " Id Servicio", hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }
                    },
                    {
                        field: "IdTecnica", title: "Id Técnica", hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }

                    },
                    {
                        field: "Alto", title: "Largo / Alto", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "Ancho", title: "Ancho", format: "{0:n2}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "IdUnidadDimension", title: "Unidad Dimensión", hidden: true,
                        filterable: {
                            cell: {
                                enabled: false

                            }
                        }
                    },
                    {
                        field: "Costo", title: "Costo", format: "{0:n4}",
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "number"
                            }
                        }
                    },
                    {
                        field: "EsPapel", title: "Papel?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsPapel"); },
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "bool"
                            }
                        }
                    },
                    {
                        field: "EsRhinestone", title: "Rhinestone?", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "EsRhinestone"); },
                        filterable: {
                            cell: {
                                enabled: false,
                                operator: "bool"
                            }
                        }
                    }


                ]
            });

            // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
            SetGrid($("#gridNoExistenAX").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, $(window).height() - "250" + "px", true, "row");
            SetGrid_CRUD_Command($("#gridNoExistenAX").data("kendoGrid"), false, false);
            Set_Grid_DataSource($("#gridNoExistenAX").data("kendoGrid"), DsNoAx);

            var grid = $("#gridNoExistenAX").data("kendoGrid");
            grid.bind("excelExport", function (e) {
                e.workbook.fileName = "Existen TSM no AX.xlsx";
            });
            //#endregion 

        }
    });

    $("#btnMostrarCambios").on("click", function (e) {
        //consulto AX
        kendo.ui.progress($("#btnMostrarCambios"), true);
        $("#viewCataInsumos").data("kendoDialog").open();
        kendo.ui.progress($("#btnMostrarCambios"), false);
        fn_consultarAx(3);
    });

    function Cerrar() {
        ResultadoAxDif = "[]";
        ResultadoAxNoTSM = "[]";
        ResultadoTSMnoAX = "[]";
        $("#gridComparar").data("kendoGrid").dataSource.read();
        $("#gridNoExistenTSM").data("kendoGrid").dataSource.read();
        $("#gridNoExistenAX").data("kendoGrid").dataSource.read();
    }
    //#endregion 

});

function selectElementos(id) {
    var fila="";
    var grid = $("#gridComparar").data("kendoGrid");
    var item = grid.dataSource.get(id); 
    fila ={
        IdCatalogoInsumo: item.IdCatalogoInsumo,
        Nombre: item.Nombre,
        Alto:item.Alto,
        Ancho: item.Ancho,
        Costo:item.Costo
    }
    
    return fila;
};

fPermisos = function (datos) {
    Permisos = datos;
};
