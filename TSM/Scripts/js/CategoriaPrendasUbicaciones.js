var Permisos;
let vIdCategoriaPrenda = 0;
let vIdServ = 0;
$(document).ready(function () {
  
    Kendo_CmbFiltrarGrid($("#CmbServicio"), TSM_Web_APi + "Servicios", "Nombre", "IdServicio", "Seleccione un servicio ...");
    //#region grid Categoria prendas

    //CONFIGURACION DEL CRUD
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return UrlCpu + "/GetCategoriaPrendasUbicacionByIdCategoriaPrendadIdServ/" + vIdServ + "/" + vIdCategoriaPrenda; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlCpu +"/"+ datos.IdServicio + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "DELETE"
            },
            create: {
                url: UrlCpu,
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdServicio: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbServicio").val(); }
                    },
                    Nombre2: {
                        type: "string"
                    },
                    IdCategoriaPrenda: {
                        type: "Number",
                        defaultValue: function (e) { return fn_GetIdPrenda($("#gridServPre").data("kendoGrid")); }
                    },
                    Nombre: {
                        type: "string"
                        
                    },
                    IdUbicacion: {
                        type: "string",
                        validation: {
                           required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUbicacion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre1: {
                        type: "string"
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

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "IdServicio");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Nombre1");
            Grid_Focus(e, "Nombre");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdServicio", title: "Cod. servicio", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre2", title: "Nombre servicio", editor: Grid_ColLocked, hidden: true },  
            { field: "IdCategoriaPrenda", title: "Cod. prenda", editor: Grid_ColLocked, hidden: true},
            { field: "Nombre", title: "Nombre", editor: Grid_ColLocked, hidden: true },     
            { field: "IdUbicacion", title: "Ubicación", values: ["IdUbicacion", "Nombre", UrlU, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Nombre Ubicación" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    //#endregion

    //#region Prenda Servicios

    //CONFIGURACION DEL CRUD
    var dsServPre = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "RelacionCategoriaPrendasServicios/GetRelacionCategoriaPrendasServicioByidServ/" + vIdServ; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "RelacionCategoriaPrendasServicios/" + datos.IdCategoriaPrenda + "/" + datos.IdServicio; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "RelacionCategoriaPrendasServicios",
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
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCategoriaPrenda",
                fields: {
                    IdServicio: {
                        type: "Number",
                        defaultValue: function (e) { return $("#CmbServicio").val(); }
                    },
                    Nombre1: {
                        type: "string"

                    },
                    IdCategoriaPrenda: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdCategoriaPrenda']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaPrenda").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    },
                    Estado: {
                        type: "string",
                        validation: { required: true}
                      
                    },
                    Nombre2: {
                        type: "string"
                    }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridServPre").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdServicio");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Nombre2");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdServicio", title: "Cod. Servicio", editor: Grid_ColLocked, hidden: true },
            { field: "Nombre1", title: "Nombre", editor: Grid_ColLocked, hidden: true },
            { field: "IdCategoriaPrenda", title: "Prenda", values: ["IdCategoriaPrenda", "Nombre", UrlCp, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Nombre Prenda" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", Urle, "RelacionCategoriaPrendasServicios", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre2", title: "Estado" },
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridServPre").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridServPre").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridServPre").data("kendoGrid"), false, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridServPre").data("kendoGrid"), dsServPre);
    Grid_HabilitaToolbar($("#gridServPre"), false, false, false);

    //#endregion 

    Kendo_CmbFocus($("#CmbServicio"));

    $("#CmbServicio").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdServ = this.dataItem(e.item.index()).IdServicio;
            fn_consultar();
        }
        else {
            vIdServ = 0;
            Grid_HabilitaToolbar($("#gridServPre"), false, false, false);
        }
    });

    $("#CmbServicio").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#gridServPre").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#gridServPre"), false, false, false);
        }
    });

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");


    var seleRows = [];
    $("#gridServPre").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridServPre"), seleRows);
    });

    $("#gridServPre").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridServPre"), seleRows);
        fn_consultarGridCatePrenUbi();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridServPre"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridServPre"), $(window).height() - "371");
});

var fn_consultar = function () {
    $("#gridServPre").data("kendoGrid").dataSource.read().then(function () {
        fn_consultarGridCatePrenUbi();
    });
    Grid_HabilitaToolbar($("#gridServPre"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
};

var fn_consultarGridCatePrenUbi = function () {
    vIdCategoriaPrenda = fn_GetIdPrenda($("#gridServPre").data("kendoGrid"));
    $("#grid").data("kendoGrid").dataSource.read();
    $("#gridServPre").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#grid"), false, false, false);
};

var fn_GetIdPrenda = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdCategoriaPrenda;

};
fPermisos = function (datos) {
    Permisos = datos;
};