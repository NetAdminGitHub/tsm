var Permisos;
let UrlArf = TSM_Web_APi + "AnalisisRequerimientoFactibilidades";
let UrlArfDet = TSM_Web_APi + "AnalisisRequerimientoFactibilidadesRevisiones";
let StrIdCatalogoInsu = "";
let vIdPlan = 0;
//#region Programacion Analisis Requerimiento Factibilidad
var fn_RTCargarConfiguracion = function () {
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlArf + "/" + $("#txtId").val(); },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlArf + "/" + datos.IdRequerimiento + "/" + datos.IdPlantillaListaVerificacion; },
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdPlantillaListaVerificacion",
                fields: {
                    IdRequerimiento: { type: "Number" },
                    IdPlantillaListaVerificacion: { type: "string" },
                    Nombre: { type: "string" },
                    Descripcion: { type: "string" },
                    FechaAnalisis: { type: "date" },
                    Observaciones: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Observaciones']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Estado: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridRev").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPlantillaListaVerificacion");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaAnalisis");
            KdoHideCampoPopup(e.container, "Descripcion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "Estado");
            Grid_Focus(e, "Observaciones");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPlantillaListaVerificacion", title: "Cod. Plantilla", hidden: true },
            { field: "IdRequerimiento", title: "Requerimiento", hidden: true },
            { field: "Nombre", title: "Lista" },
            { field: "Descripcion", title: "Descripcion de plantilla", hidden: true },
            { field: "FechaAnalisis", title: "Fecha analisis", format: "{0: dd/MM/yyyy}", hidden: true },
            { field: "Observaciones", title: "Observaciones" },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridRev").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si);
    //SetGrid_CRUD_ToolbarTop($("#gridRev").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridRev").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridRev").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridRev").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRev"), selectedRows);
        if ($("#gridRev").data("kendoGrid").dataSource.total() === 0) {
            vIdPlan = 0;
            $("#gridRevDet").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridRevDet"), false, false, false);
        }
    });

    $("#gridRev").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRev"), selectedRows);
        fn_ConsultarGridConfEP();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridRev"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridRev"), $(window).height() - "371");
    //#endregion

    //#region Programacion Grid Cofiguracion Etapas Ordenes de trabajo
    //CONFIGURACION DEL CRUD
    let daRevdet = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlArfDet + "/GetAnalisisRequerimientoFactibilidadesRevisionesByIdReqIdPla/" + $("#txtId").val() + "/" + vIdPlan; },
                dataType: "json",
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
                id: "Item",
                fields: {
                    IdRequerimiento: {
                        type: "Number"
                    },
                    IdPlantillaListaVerificacion: {
                        type: "string"
                    },
                    Item: {
                        type: "Number"
                    },
                    Descripcion: {
                        type: "string"
                    },
                    Comprobado: {
                        type: "bool"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL gridConfEp,CAMPOS
    $("#gridRevDet").kendoGrid({
        dataBound: function () {
            if ($("#txtEstado").val() === "ACTIVO") {
                $(".k-checkbox").bind("change", function (e) {
                    var grid = $("#gridRevDet").data("kendoGrid");
                    var row = $(e.target).closest("tr");
                    var data = grid.dataItem(row);
                    data.Comprobado = this.checked;
                    kendo.ui.progress($("#gridRevDet"), true);
                    $.ajax({
                        type: "Put",
                        async: false,
                        data: JSON.stringify(Fn_GetFilaSelect(data)),
                        url: UrlArfDet + "/" + data.IdRequerimiento + "/" + data.IdPlantillaListaVerificacion + "/" + data.Item,
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            RequestEndMsg(result, "Put");
                            kendo.ui.progress($("#gridRevDet"), false);
                        },
                        error: function (data) {
                            ErrorMsg(data);
                        }
                    });
                });
            }
          
        },
        columns: [
            { field: "IdRequerimiento", title: "Cod. requerimiento", editor: Grid_ColLocked, hidden: true },
            { field: "IdPlantillaListaVerificacion", title: "Cod. Plantilla", editor: Grid_ColLocked, hidden: true },
            { field: "Item", title: "Item", editor: Grid_ColLocked, hidden: true },
            { field: "Descripcion", title: "Descripción" },
            {
                field: "Comprobado", title: "Verificado",
                editor: Grid_ColCheckbox,
                template: function (dataItem) { return Grid_ColTempCheckBox(dataItem, "Comprobado"); }
            },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }

        ]
    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gridConfEp
    SetGrid($("#gridRevDet").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridRevDet").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridRevDet").data("kendoGrid"), daRevdet);

    Grid_HabilitaToolbar($("#gridRevDet"), false, false, false);

    var selRows = [];
    $("#gridRevDet").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridRevDet"), selRows);
    });

    $("#gridRevDet").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridRevDet"), selRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridRevDet"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridRevDet"), $(window).height() - "371");
    //#endregion

    //Metodo para cargar data a pasar a maquina canvas
    $("#divMaquina").on("dragstart", function (e) {
        e.originalEvent.dataTransfer.setData("perfil", JSON.stringify({ Edad: 30, Nombre: "Omar Rivas" }));
    });
};

var fn_RTMostrarGrid = function () {
    $("#gridRev").data("kendoGrid").dataSource.read();
    let vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
    Grid_HabilitaToolbar($("#gridRev"), vhb, vhb, vhb);
};

fun_List.push(fn_RTCargarConfiguracion);
fun_List.push(fn_RTCargarMaquina);
fun_ListDatos.push(fn_RTMostrarGrid);

let Fn_GetFilaSelect = function (data) {
    let fila = "";
    fila = {
        IdRequerimiento: data.IdRequerimiento,
        IdPlantillaListaVerificacion: data.IdPlantillaListaVerificacion,
        Item: data.Item,
        Descripcion: data.Descripcion,
        Comprobado: data.Comprobado
    };
    return fila;
};

let Grid_ColTempCheckBox = function (data, columna) {
    return "<input id=\"" + data.id + "\" type=\"checkbox\" class=\"k-checkbox\"" + (data[columna] ? "checked=\"checked\"" : "") + "" + ($("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? "disabled =\"disabled\"" : "") +" />" +
        "<label class=\"k-checkbox-label\" for=\"" + data.id + "\"></label>";
};

let fn_ConsultarGridConfEP = function () {
    vIdPlan = fn_GetIdPlan($("#gridRev").data("kendoGrid"));
    $("#gridRevDet").data("kendoGrid").dataSource.read();
    $("#gridRev").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridRevDet"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridRevDet"), false, false, false);
};

let fn_GetIdPlan = function (g) {
    let SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdPlantillaListaVerificacion;
};

fPermisos = function (datos) {
    Permisos = datos;
};