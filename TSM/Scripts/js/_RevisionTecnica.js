var Permisos;
let UrlArf = TSM_Web_APi + "AnalisisRequerimientoFactibilidades";
let UrlArfDet = TSM_Web_APi + "AnalisisRequerimientoFactibilidadesRevisiones";
let StrIdCatalogoInsu = "";
let vIdPlan = 0;
let gAlto = 200;
//#region Programacion Analisis Requerimiento Factibilidad
var fn_RTCargarConfiguracion = function () {
    KdoButton($("#btnAddEsta"), "check", "Agregar");
    fn_gridColor();
    fn_gridTecnica();
    fn_gridBases();
    fn_gridAccesorios();

    //hablitar el Drop Target de las maquinas
    let vContenedor = $("#container");
    $(vContenedor).kendoDropTarget({
        drop: function (e) { dropElemento(e); },
        group: "gridGroup"
    });
};


let fn_gridColor = function () {

    var dsColor = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosColores/GetRequerimientoDesarrollosColoresByIdRequerimiento/" + $("#txtId").val(); },
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
                id: "IdRequerimientoColor",
                fields: {
                    IdRequerimientoColor: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    Color: { type: "string" }
                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#dgColor").kendoGrid({
        columns: [
            { field: "IdRequerimientoColor", title: "Requerimiento", hidden: true },
            { field: "IdRequerimiento", title: "Requerimiento", hidden: true },
            { field: "Color", title: "Color" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dgColor").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gAlto);
    Set_Grid_DataSource($("#dgColor").data("kendoGrid"), dsColor);

    var srow1 = [];
    $("#dgColor").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#dgColor"), srow1);
    });

    $("#dgColor").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#dgColor"), srow1);
    });


    let grid1 = $("#dgColor").data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        //dragstart: function (e) {
        //    e.originalEvent.dataTransfer.setData("GridData", this.element);
        //},
        hint: function (e) {
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

    $("#dgColor").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgColor").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgColor").data("TipoEstacion", "COLOR"); // guardar nombre archivo JS
};


let fn_gridTecnica = function () {

    var dsTecnica = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/GetRequerimientoDesarrollosColoresTecnicaByIdRequerimiento/" + $("#txtId").val(); },
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
                id: "IdRequerimientoTecnica",
                fields: {
                    IdRequerimientoTecnica: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    IdTecnica: { type: "string" },
                    Nombre: { type: "string" }
                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#dgTecnica").kendoGrid({
        columns: [
            { field: "IdRequerimientoTecnica", title: "IdRequerimientoTecnica", hidden: true },
            { field: "IdRequerimiento", title: "Requerimiento", hidden: true },
            { field: "IdTecnica", title: "IdTecnica", hidden: true },
            { field: "Nombre", title: "Técnica" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dgTecnica").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gAlto);
    Set_Grid_DataSource($("#dgTecnica").data("kendoGrid"), dsTecnica);

    var srow2 = [];
    $("#dgTecnica").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#dgTecnica"), srow2);
    });

    $("#dgTecnica").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#dgTecnica"), srow2);
    });

    let grid1 = $("#dgTecnica").data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });


    $("#dgTecnica").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgTecnica").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgTecnica").data("TipoEstacion", "TECNICAS"); // guardar nombre archivo JS
};

let fn_gridBases = function () {

    var dsBase = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "Bases",
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
                id: "IdBase",
                fields: {
                    IdBase: { type: "number" },
                    Nombre: {
                        type: "string"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#dgBases").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBase", title: "Código base", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Bases" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dgBases").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gAlto);
    Set_Grid_DataSource($("#dgBases").data("kendoGrid"), dsBase);

    var srow3 = [];
    $("#dgBases").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#dgBases"), srow3);
    });

    $("#dgBases").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#dgBases"), srow3);
    });


    let grid1 = $("#dgBases").data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

    $("#dgBases").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgBases").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgBases").data("TipoEstacion", "BASES"); // guardar nombre archivo JS
};


let fn_gridAccesorios = function () {

    var dsAcce = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "AccesoriosMaquinas",
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
                id: "IdAccesorio",
                fields: {
                    IdAccesorio: { type: "number" },
                    Nombre: {
                        type: "string"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#dgAccesorios").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdAccesorio", title: "Código Accesorios", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Nombre", title: "Accesorios" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dgAccesorios").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gAlto);
    Set_Grid_DataSource($("#dgAccesorios").data("kendoGrid"), dsAcce);

    var srow4 = [];
    $("#dgAccesorios").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#dgAccesorios"), srow4);
    });

    $("#dgAccesorios").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#dgAccesorios"), srow4);
    });


    let grid1 = $("#dgAccesorios").data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

    $("#dgAccesorios").data("Estacion", "MEstacionAccesorios"); // guardar nombre vista modal
    $("#dgAccesorios").data("EstacionJS", "EstacionAccesorios.js"); // guardar nombre archivo JS
    $("#dgAccesorios").data("TipoEstacion", "ACCESORIO"); // guardar nombre archivo JS

};


var fn_RTMostrarGrid = function () {
    $("#dgTecnica").data("kendoGrid").dataSource.read();
    $("#dgColor").data("kendoGrid").dataSource.read();
    $("#dgBases").data("kendoGrid").dataSource.read();
    $("#dgAccesorios").data("kendoGrid").dataSource.read();
    //let vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
    //Grid_HabilitaToolbar($("#gridRev"), vhb, vhb, vhb);
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
    return "<input id=\"" + data.id + "\" type=\"checkbox\" class=\"k-checkbox\"" + (data[columna] ? "checked=\"checked\"" : "") + "" + ($("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? "disabled =\"disabled\"" : "") + " />" +
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