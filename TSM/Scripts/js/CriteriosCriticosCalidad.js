var Permisos;
let idPerfil = 0;
let vIdCalCri = 0;
let cliente = "";
$(document).ready(function () {
    //Llenar combo box
    Kendo_CmbFiltrarGrid($("#CmbCalidadCriterios"), TSM_Web_APi +"CalidadCriterios", "Nombre", "IdCalidadCriterio", "Selecione un Calidad Criterio...");

    //dibujar panel para la separacion de información
    PanelBarConfig($("#bpecm"));

    //#region Calidad Criterio

    var dsCTQ = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "CriteriosCriticosCalidad"; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "CriteriosCriticosCalidad/" + datos.IdCriterio; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "CriteriosCriticosCalidad/" + datos.IdCriterio; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "CriteriosCriticosCalidad",
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
                id: "IdCriterio",
                fields: {
                    IdCriterio: {
                        type: "number"
                    },
                    Criterio: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Criterio']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                              return true;
                            }
                        }
                        
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
    $("#gridCtq").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdCriterio");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "Criterio");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCriterio", title: "Id Criterio", hidden: true },
            { field: "Criterio", title: "Nombre del criterio" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridCtq").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCtq").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridCtq").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridCtq").data("kendoGrid"), dsCTQ, 20);

    var seleRows = [];
    $("#gridCtq").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCtq"), seleRows);
    });

    $("#gridCtq").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCtq"), seleRows);
    });


    //#endregion

    //#region Calidad Pruebas
    //CONFIGURACION DEL CRUD
    var dsNivelesExigencia = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "NivelesExigencias/"; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "NivelesExigencias/" + datos.IdNivelExigencia; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "NivelesExigencias/" + datos.IdNivelExigencia; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "NivelesExigencias",
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
                id: "IdNivelExigencia",
                fields: {
                    IdNivelExigencia: {
                        type: "number"

                    },
                    NivelExigencia : {
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
    $("#gridExigencia").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdNivelExigencia");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
          
            Grid_Focus(e, "NivelExigencia");
         

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNivelExigencia", title: "Id Exigencia", hidden: true },
            { field: "NivelExigencia", title: "Nivel de exigencia" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    SetGrid($("#gridExigencia").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridExigencia").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridExigencia").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridExigencia").data("kendoGrid"), dsNivelesExigencia, 20);

    var seleRow1 = [];
    $("#gridExigencia").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridExigencia"), seleRow1);
    });

    $("#gridExigencia").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridExigencia"), seleRow1);
    });

    //#endregion

    //#region gr CalidadCriteriosPruebas
    //CONFIGURACION DEL CRUD
    var dsPerfilesCTQ = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "PerfilesCriteriosCriticosCalidad/GetPerfilesCriteriosCriticosCalidadDetalle"  ; },
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "PerfilesCriteriosCriticosCalidad/"  + datos.IdPerfilCriterio; },
                type: "DELETE"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "PerfilesCriteriosCriticosCalidad/" + datos.IdPerfilCriterio ; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: TSM_Web_APi + "PerfilesCriteriosCriticosCalidad",
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
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "update" || e.type === "create" || e.type === "destroy" ) {
                $("#gridPerfilCriteriosCriticos").data("kendoGrid").dataSource.read();
            }
        },
        // VALIDAR ERROR
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdPerfilCriterio",
                fields: {
                    IdPerfilCriterio: {
                        type: "number"
                         },
                    NombrePerfil: {
                        type: "string"
                    },
                    DescripcionPerfil: {
                        type: "string"
                    },
                    IdCliente: {
                        type: "number", defaultValue: null
                        //validation: {
                        //    required: true,
                        //    maxlength: function (input) {
                        //        if (input.is("[name='IdCliente']")) {
                        //            input.attr("data-maxlength-msg", "Requerido");
                        //            return $("#IdCliente").data("kendoComboBox").selectedIndex >= 0;
                        //        }
                        //        return true;
                        //    }
                        //}
                    },
                    NombreMarca: { type: "string" },
                    NombreCliente: { type: "string" },
                    IdMarca: { type: "number" ,defaultValue: null},
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
    $("#gridPerfilCriteriosCriticos").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPerfilCriterio");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "NombreMarca");
            KdoHideCampoPopup(e.container, "NombreCliente");
            
            $('[name="IdMarca"]').data("kendoComboBox").setDataSource(fn_GetMarcas($('[name="IdCliente"]')[0].value));


            $('[name="IdCliente"]').on('change', function () {
                if (this.value !== "") {
                     $('[name="IdMarca"]').data("kendoComboBox").setDataSource(fn_GetMarcas(this.value  ));
                } else {
                    $('[name="IdMarca"]').data("kendoComboBox").setDataSource("");
                }

            });



            Grid_Focus(e, "IdCalidadPrueba");


        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPerfilCriterio", title: "Id Perfil", hidden: true },
            { field: "NombrePerfil", title: "Nombre de perfil" },
            { field: "DescripcionPerfil", title: "Descripción" },
            { field: "IdCliente", title: "Cliente",  hidden: true, editor: Grid_Combox, values: ["IdCliente", "Nombre", TSM_Web_APi + "Clientes", "", "Seleccione...."] },
            { field: "NombreCliente", title: "Cliente" },
            { field: "IdMarca", title: "Marca", hidden: true, editor: Grid_ComboxData, values: ["IdMarca", "Nombre2", "[]", "", "Seleccione...."] },
            { field: "NombreMarca", title: "Marca" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            
        ]
    });

    SetGrid($("#gridPerfilCriteriosCriticos").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 0);
    SetGrid_CRUD_ToolbarTop($("#gridPerfilCriteriosCriticos").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPerfilCriteriosCriticos").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPerfilCriteriosCriticos").data("kendoGrid"), dsPerfilesCTQ, 20);

    //Grid_HabilitaToolbar($("#gridCalidadCriteriosPruebas"), false, false, false);
    var seleRows2 = [];
    $("#gridPerfilCriteriosCriticos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPerfilCriteriosCriticos"), seleRows2);
    });

    $("#gridPerfilCriteriosCriticos").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPerfilCriteriosCriticos"), seleRows2);
        var rows = e.sender.select();
        let nPerfil = "";
        rows.each(function (e) {
            var grid = $("#gridPerfilCriteriosCriticos").data("kendoGrid");
            var dataItem = grid.dataItem(this);
            idPerfil = dataItem["IdPerfilCriterio"];
            nPerfil = dataItem["NombrePerfil"];
        });

        $("#NPerfil").text(nPerfil);
     

        if (idPerfil != undefined) {

            fn_consultarCriteriosPruebas();
        }
     
    });

    //#endregion 

    //#region listado de criterios"
    var dsItemCriterios = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi + "PerfilesCriteriosCriticosCalidadCriterios/GetPerfilesCriteriosCriticosCalidadCriteriosData/" + idPerfil ;
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) {
                    return TSM_Web_APi + "PerfilesCriteriosCriticosCalidadCriterios/" + datos.IdCriterioItem;
                },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "PerfilesCriteriosCriticosCalidadCriterios/" + datos.IdCriterioItem; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "PerfilesCriteriosCriticosCalidadCriterios",
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
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "update" || e.type === "create" || e.type === "destroy") {
                $("#gridPerfilCriteriosCriticosItems").data("kendoGrid").dataSource.read();
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdCriterioItem",
                fields: {
                    IdCriterioItem: {
                        type: "number",
                        defaultValue: 0
                    },
                    IdPerfilCriterio: {
                        type: "number",
                        defaultValue: function () { return idPerfil; }
                    },
                    IdCriterio: {
                        type: "number",
                        defaultValue:""
                    },
                    Criterio: {
                        type: "string"
                    },
                    IdNivelExigencia: {
                        type: "number",
                        defaultValue: ""
                    },
                    NivelExigencia: {
                        type: "string"
                    },
                    IdComposicionTela: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {

                                if (input.is("[name='IdCriterio']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCriterio").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdNivelExigencia']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdNivelExigencia").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NombreComposicion: {
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
    //CONFIGURACION DEL GRID,CAMPOS

    $("#gridPerfilCriteriosCriticosItems").kendoGrid({
   
        edit: function (e) {
            // BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdCriterioItem");
            KdoHideCampoPopup(e.container, "IdPerfilCriterio");
            KdoHideCampoPopup(e.container, "Criterio");
            KdoHideCampoPopup(e.container, "NivelExigencia");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");

            

            Grid_Focus(e, "Criterio");
         },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCriterioItem", title: "CriteriosItem", hidden: true },
            { field: "IdPerfilCriterio", title: "Perfil criterio", hidden: true },
            { field: "IdCriterio", title: "Criterio a evaluar", hidden: true, editor: Grid_Combox, values: ["IdCriterio", "Criterio", TSM_Web_APi + "CriteriosCriticosCalidad", "", "Seleccione...."] },
            { field: "Criterio", title: "Criterio" },
            { field: "IdNivelExigencia", title: "Nivel de exigencia", hidden: true, editor: Grid_Combox, values: ["IdNivelExigencia", "NivelExigencia", TSM_Web_APi + "NivelesExigencias", "", "Seleccione...."] },
            { field: "NivelExigencia", title: "Nivel de exigencia" },
            { field: "FechaMod", title: "Fecha Mod.", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPerfilCriteriosCriticosItems").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,0);
    SetGrid_CRUD_ToolbarTop($("#gridPerfilCriteriosCriticosItems").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPerfilCriteriosCriticosItems").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridPerfilCriteriosCriticosItems").data("kendoGrid"), dsItemCriterios);

   
    var seleRows3 = [];
    $("#gridPerfilCriteriosCriticosItems").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPerfilCriteriosCriticosItems"), seleRows3);
    });

    $("#gridPerfilCriteriosCriticosItems").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPerfilCriteriosCriticosItems"), seleRows3);
    });

    //#endregion
   



});



var fn_consultarCriteriosPruebas = function () {
    //$("#gridCalidadCriteriosPruebas").data("kendoGrid").dataSource.read();
    $("#gridPerfilCriteriosCriticosItems").data("kendoGrid").dataSource.read();
};

fPermisos = function (datos) {
    Permisos = datos;
};

let fn_GetMarcas = function (id) {
    kendo.ui.progress($("#body"), true);
    let valor = "";
    $.ajax({
        url: TSM_Web_APi + "ClientesMarcas/GetByCliente/" + id,
        async: false,
        type: 'GET',
        success: function (respuesta) {
            valor = respuesta;

        }
    });
    kendo.ui.progress($("#body"), false);
    return valor;
};

