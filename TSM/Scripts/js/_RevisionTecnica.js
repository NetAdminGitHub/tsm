var Permisos;
var maq;
let UrlArf = TSM_Web_APi + "AnalisisRequerimientoFactibilidades";
let UrlArfDet = TSM_Web_APi + "AnalisisRequerimientoFactibilidadesRevisiones";
let StrIdCatalogoInsu = "";
let vIdPlan = 0;
let gAlto = 300;

//#region Programacion Analisis Requerimiento Factibilidad
var fn_RTCargarConfiguracion = function () {
    KdoButton($("#btnBT"), "delete", "Limpiar");
    fn_gridColor();
    fn_gridTecnica();
    fn_gridBases();
    fn_gridAccesorios();
    maq = fn_GetMaquinas();
    
    //hablitar el Drop Target de las maquinas
    let vContenedor = $("#container");
    $(vContenedor).kendoDropTarget({
        drop: function (e) { dropElemento(e); },
        group: "gridGroup"
    });

    $("#btnBT").data("kendoButton").bind('click', function () {
        ConfirmacionMsg("¿Esta seguro de eliminar la configuración de todas las estaciones?", function () { return fn_EliminarEstacion(maq[0].IdSeteo); });
        
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
            update: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosColores/" + datos.IdRequerimientoColor; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosColores/" + datos.IdRequerimientoColor; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "RequerimientoDesarrollosColores",
                type: "POST",
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
                    IdRequerimientoColor: {
                        type: "number"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#txtId").val();
                        }
                    },
                    Color: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='Color']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }

                    },
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    }
                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#dgColor").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoColor");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "Color");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoColor", title: "Código. Desarrollo Color", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "Color", title: "Color Diseño" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dgColor").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gAlto);
    SetGrid_CRUD_ToolbarTop($("#dgColor").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#dgColor").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
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
        hint: function (e) {
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Color: ' + dataItem.Color  + '</tr></tbody></table></div>');
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
            update: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas",
                type: "POST",
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
                    IdRequerimientoTecnica: {
                        type: "number"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#txtId").val();
                        }
                    },
                    IdTecnica: {
                        type: "string",
                        validation: {
                            maxlength: function (input) {
                                if (input.is("[name='IdTecnica']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTecnica").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    }
                }
            }
        }

    });

    let Urltec = TSM_Web_APi + "Tecnicas";
    //CONFIGURACION DEL GRID,CAMPOS
    $("#dgTecnica").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "IdRequerimientoTecnica");
            KdoHideCampoPopup(e.container, "IdRequerimiento");
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "IdTecnica");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoTecnica", title: "Código. Muestra Técnica", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdTecnica", title: "Técnicas", editor: Grid_Combox, values: ["IdTecnica", "Nombre", Urltec, "GetbyServicio/" + $("#IdServicio").val(), "Seleccione un Técnica....", "", "", ""], hidden: true },
            { field: "Nombre", title: "Nombre técnica" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#dgTecnica").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, gAlto);
    SetGrid_CRUD_ToolbarTop($("#dgTecnica").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#dgTecnica").data("kendoGrid"), false, Permisos.SNBorrar);
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
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Técnica: ' + dataItem.Nombre + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });


    $("#dgTecnica").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgTecnica").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgTecnica").data("TipoEstacion", "TECNICA"); // guardar nombre archivo JS
};

let fn_gridBases = function () {

    var dsBase = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: TSM_Web_APi + "BasesMuestras",
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
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Base: ' + dataItem.Nombre + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

    $("#dgBases").data("Estacion", "MEstacionColor"); // guardar nombre vista modal
    $("#dgBases").data("EstacionJS", "EstacionColores.js"); // guardar nombre archivo JS
    $("#dgBases").data("TipoEstacion", "BASE"); // guardar nombre archivo JS
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
            let dataItem = grid1.dataItem(e);
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>Accesorio: ' + dataItem.Nombre + '</tr></tbody></table></div>');
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


var fn_GetMaquinas = function () {
    kendo.ui.progress($("#body"), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + $("#txtIdOrdenTrabajo").val() + "/" + $("#txtIdEtapaProceso").val() + "/" + $("#txtItem").val(),
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
            kendo.ui.progress($("#body"), false);
        }
    });

    return result;
};

let fn_EliminarEstacion = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let Urldel = xIdestacion !== undefined ? TSM_Web_APi + "SeteoMaquinasEstaciones/" + xIdSeteo + "/" + xIdestacion : TSM_Web_APi + "SeteoMaquinasEstaciones/Deltodas/" + xIdSeteo;
    $.ajax({
        url: Urldel,
        type: "Delete",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Delete");
            var a = stage.find("#TxtInfo" + xIdestacion);
            if (xIdestacion !== undefined) {
                a.text("");
                maq = fn_GetMaquinas();
                var b = stage.find("#brazo" + xIdestacion);
                b.IdSeteo = 0;
                b.IdTipoFormulacion = "";
                layer.draw();

            } else {
                fn_RTCargarMaquina();
            }
            kendo.ui.progress($("#MEstacionColor"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });
};


fPermisos = function (datos) {
    Permisos = datos;
};