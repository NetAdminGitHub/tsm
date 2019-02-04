
var Url_ApiBase_consulta = "";
var Url_ReqDesTec_Consulta = "";
var Url_CApiSisT_Consulta = "";
var Url_CApiP_Consulta = "";
var Url_CApiArte_Consulta = "";
var Url_CRD_Consulta = "";
var Url_CApiTD_Consulta = "";
var Url_CRtin_Consulta = "";
var Url_CUniMed_Consulta = "";
var UrlApiCPre_Consulta = "";
var VarIDReqConsulta = 0;
var RequerimientoDes = function () {

    Url_ApiBase_consulta = TSM_Web_APi + "Bases";
    Url_ReqDesTec_Consulta = TSM_Web_APi + "RequerimientoDesarrollosTecnicas";
    Url_CApiSisT_Consulta = TSM_Web_APi +"sistematintas";
    Url_CApiP_Consulta = TSM_Web_APi + "Prendas";
    Url_CApiArte_Consulta = TSM_Web_APi + "Artes";
    Url_CRD_Consulta = TSM_Web_APi + "RequerimientoDesarrollos";
    Url_CApiTD_Consulta = TSM_Web_APi + "Dimensiones";
    Url_CRtin_Consulta = TSM_Web_APi +"RequerimientoTintas";
    Url_CUniMed_Consulta = TSM_Web_APi + "UnidadesMedidas";
    UrlApiCPre_Consulta = TSM_Web_APi + "CategoriaPrendas";
    //#region Inicialización de variables y controles Kendo
  
    $("#TxtFechaConsulta").kendoDatePicker({ format: "dd/MM/yyyy" });

    Kendo_MultiSelect($("#IdSistemaTinta_Cota"), Url_CApiSisT_Consulta, "Nombre", "IdSistemaTinta", "");
    Kendo_MultiSelect($("#TxtCategoriaPrenda"), UrlApiCPre_Consulta, "Nombre", "IdCategoriaPrenda", "");
    Kendo_CmbFiltrarGrid($("#CmbIdUnidadVelocidadConsulta"), Url_CUniMed_Consulta, "Abreviatura", "IdUnidad", "", "", "", false);
    Kendo_CmbFiltrarGrid($("#CmbIdUnidadMedidaCantidad_Cota"), Url_CUniMed_Consulta, "Abreviatura", "IdUnidad", "","","",false);
    Kendo_CmbFiltrarGrid($("#CmbBase_Cota"), Url_ApiBase_consulta, "Nombre", "IdBase", "", "", "", false);

    $("#NoDocumento_Cota").attr("readonly", true);
    $("#TxtFechaConsulta").attr("readonly", true);
    $("#TxtPrograma").attr("readonly", true);
    $("#TxtUbicacion").attr("readonly", true);
    $("#UbicacionVer_Cota").attr("readonly", true);
    $("#UbicacionHor_Cota").attr("readonly", true);
    $("#CntPiezas_Cota").attr("readonly", true);
    $("#CmbIdUnidadMedidaCantidad_Cota").attr("readonly", true);
    $("#TallaPrincipal_Cota").attr("readonly", true);

    $("#InstruccionesEspeciales_Cota").attr("readonly", true);
    $("#IdSistemaTinta_Cota").attr("readonly", true);
    $("#IdSistemaTinta_Cota").attr("readonly", true);
    $("#TxtCategoriaPrenda").attr("readonly", true);
    $("#NumeroDiseno_Cota").attr("readonly", true);
    $("#EstiloDiseno_Cota").attr("readonly", true);
    $("#TxtDirectorioArchivos_Cota").attr("readonly", true);

    $("#TxtCategoriaConfeccion").attr("readonly", true);
    $("#TxtConstruccionTela").attr("readonly", true);
    $("#TxtComposicionTela").attr("readonly", true);
    $("#Color_Cota").attr("readonly", true);
    $("#Nombre_Cota").attr("readonly", true);

    var multiselect = $("#IdSistemaTinta_Cota").data("kendoMultiSelect");
    multiselect.readonly(true);
    var mulselect = $("#TxtCategoriaPrenda").data("kendoMultiSelect");
    mulselect.readonly(true);

    $("#CantidadColores_Cota").attr("readonly", true);
    $("#CantidadTallas_Cota").attr("readonly", true);
    $("#Montaje_Cota").attr("readonly", true);
    $("#Combo_Cota").attr("readonly", true);
    $("#TxtVelocidadMaquinaConsulta").attr("readonly", true);

    var UMCantidad = $("#CmbIdUnidadMedidaCantidad_Cota").data("kendoComboBox");
    UMCantidad.readonly(true);

    var UVConsulta = $("#CmbIdUnidadVelocidadConsulta").data("kendoComboBox");
    UVConsulta.readonly(true);

    var UVBase = $("#CmbBase_Cota").data("kendoComboBox");
    UVBase.readonly(true);

    //#endregion FIN Inicialización de variables y controles Kendo

    //#region Programación GRID Dimensiones
    var DsDimension = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return Url_CApiTD_Consulta + "/GetbyRequerimiento/" + VarIDReqConsulta; },
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
                id: "Id",
                fields: {
                    Id: {
                        type: "string"

                    },
                    IdRequerimiento: {
                        type: "number"
                    },
                    IdDimension: {
                        type: "number"
                    },
                    IdCategoriaTalla: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    },
                    IdUnidad: {
                        type: "string", defaultValue: 5
                    },
                    Abreviatura: {
                        type: "string"
                    },
                    Alto: {
                        type: "number"
                    },
                    Ancho: {
                        type: "number"
                    },
                    Tallas: {
                        type: "string"
                    },
                    C3: {
                        type: "bool"
                    },
                    DimensionesRelativas: { type: "string" }

                }
            }
        }

    });

    $("#GRDimension_Cota").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Id", title: "Id", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdDimension", title: "Codigó Dimensión", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdCategoriaTalla", title: "Categoría Talla",  hidden: true },
            { field: "Nombre", title: "Categoría Talla" },
            { field: "Tallas", title: "Tallas" },
            { field: "C3", title: "Dimension Relativa:", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "C3"); } },
            { field: "Alto", title: "Alto", editor: Grid_ColNumeric, values: ["required", "0", "9999999999", "n2", 2] },
            { field: "Ancho", title: "Ancho", editor: Grid_ColNumeric, values: ["required", "0", "9999999999", "n2", 2] },
            { field: "IdUnidad", title: "Unidad",  hidden: true },
            { field: "Abreviatura", title: "Unidad de Medida" },
            { field: "DimensionesRelativas", title: "Medidas Relativas" }
        ]

    });

    SetGrid($("#GRDimension_Cota").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRDimension_Cota").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GRDimension_Cota").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#GRDimension_Cota").data("kendoGrid"), DsDimension);
    Grid_HabilitaToolbar($("#GRDimension_Cota"), false, false, false);

    //#endregion Fin CRUD Programación GRID Dimensiones

    //#region Programacion Tecnicas
    var DsReqDesTec = new kendo.data.DataSource({
        transport: {
            read: {
                url: function (datos) { return Url_ReqDesTec_Consulta + "/GetByRequerimiento/" + VarIDReqConsulta; },
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
                id: "IdRequerimientoTecnica",
                fields: {
                    IdRequerimientoTecnica: {
                        type: "number"

                    },
                    IdRequerimiento: {
                        type: "number", defaultValue: function () {
                            return $("#IdRequerimiento").val();
                        }
                    },
                    IdTecnica: {
                        type: "string"
                    },
                    Nombre1: {
                        type: "string"
                    },
                    IdCostoTecnica: {
                        type: "string"
                    },
                    Nombre: {
                        type: "string"
                    }

                }
            }
        }

    });

    $("#GRReqDesTec_Cota").kendoGrid({
        autoBind: false,
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdRequerimientoTecnica", title: "Color Requerimiento Técnica", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", editor: Grid_ColInt64NumSinDecimal, hidden: true },
            { field: "IdTecnica", title: "Técnicas",  hidden: true },
            { field: "Nombre1", title: "Nombre técnica" },
            { field: "IdCostoTecnica", title: "Costo técnica", hidden: true },
            { field: "Nombre", title: "Nombre costo tecnica" }

        ]

    });

    SetGrid($("#GRReqDesTec_Cota").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#GRReqDesTec_Cota").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#GRReqDesTec_Cota").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#GRReqDesTec_Cota").data("kendoGrid"), DsReqDesTec);
    Grid_HabilitaToolbar($("#GRReqDesTec_Cota"), false, false, false);
    //#endregion Programacion Tecnicas
  
}; // FIN DOCUMENT READY

//#region Metodos Generales

function Fn_ConsultaRequerimientoDes(IDReq) {
    VarIDReqConsulta = IDReq;
    getRD(Url_CRD_Consulta + "/" + VarIDReqConsulta);
}

function getRD(Url_CRD_Consulta) {
    kendo.ui.progress($("#DivFrmRD"), true);
    $.ajax({
        url: Url_CRD_Consulta,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (respuesta) {
            $.each(respuesta, function (index, elemento) {

                // cuando el servicio es serigrafia se bloquean los siguientes campos y se ocultan los grid : Dimensiones y Requerimiento Destalle Tecnica

                elemento.IdServicio === 1 ? MostrarColorDimen() : OcultarColorDimen();
                elemento.IdServicio === 1 ? OcultarCamposReq(true) : OcultarCamposReq(false);

                //asignacion de valores a campos en vistas
                
                $("#TxtUbicacion").val(elemento.Nombre1);
                $("#TxtPrograma").val(elemento.Nombre3);
                $("#NoDocumento_Cota").val(elemento.NoDocumento1);
                $("#UbicacionHor_Cota").val(elemento.UbicacionHorizontal);
                $("#UbicacionVer_Cota").val(elemento.UbicacionVertical);
                $("#CntPiezas_Cota").val(elemento.CantidadPiezas);
                $("#CantidadColores_Cota").val(elemento.CantidadColores);
                $("#CantidadTallas_Cota").val(elemento.CantidadTallas);
                $("#Montaje_Cota").val(elemento.Montaje);
                $("#Combo_Cota").val(elemento.Combo);
                $("#TxtFechaConsulta").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(elemento.Fecha), 'dd/MM/yyyy'));
                $("#InstruccionesEspeciales_Cota").val(elemento.InstruccionesEspeciales);
                $('#chkRevisionTecnica_Cota').prop('checked',elemento.RevisionTecnica);
                $("#TxtVelocidadMaquinaConsulta").val(elemento.VelocidadMaquina);
                $("#CmbIdUnidadVelocidadConsulta").data("kendoComboBox").value(elemento.IdUnidadVelocidad);
                $("#CmbBase_Cota").data("kendoComboBox").value(elemento.IdBase);
                $('#chkDisenoFullColorConsulta_Cota').prop('checked',elemento.DisenoFullColor);
                $("#CmbIdUnidadMedidaCantidad_Cota").data("kendoComboBox").value(elemento.IdUnidadMedidaCantidad);
                $("#TallaPrincipal_Cota").val(elemento.TallaPrincipal);
                //consultar grid
                VarIDReqConsulta = elemento.IdRequerimiento;
                $("#GRDimension_Cota").data("kendoGrid").dataSource.read();
                $("#GRReqDesTec_Cota").data("kendoGrid").dataSource.read();
                $("#TxtCategoriaConfeccion").val(elemento.Nombre6);
                $("#TxtConstruccionTela").val(elemento.Nombre7);
                $("#TxtComposicionTela").val(elemento.Nombre8);
                $("#Color_Cota").val(elemento.Color);
                
            });

            kendo.ui.progress($("#DivFrmRD"), false);
           
            getArte(Url_CApiArte_Consulta + "/GetArteByRequerimiento/" + VarIDReqConsulta.toString());
            getSisTintas(Url_CRtin_Consulta + "/GetByRequerimiento/" + VarIDReqConsulta.toString());
            getPrendasMultiSelec(Url_CApiP_Consulta + "/GetByRequerimiento/" + VarIDReqConsulta.toString());

        },
        error: function () {
            kendo.ui.progress($("#DivFrmRD"), false);

        }
    });
}

function getArte(UrlArt) {
    kendo.ui.progress($("#DivFrmRD"), true);
    $.ajax({
        url: UrlArt,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                $("#Nombre_Cota").val(respuesta.Nombre);
                $("#EstiloDiseno_Cota").val(respuesta.EstiloDiseno);
                $("#NumeroDiseno_Cota").val(respuesta.NumeroDiseno);
                $("#TxtDirectorioArchivos_Cota").val(respuesta.DirectorioArchivos);
                kendo.ui.progress($("#DivFrmRD"), false);
            } else {
                kendo.ui.progress($("#DivFrmRD"), false);
            }
        },
        error: function () {
            kendo.ui.progress($("#DivFrmRD"), false);
        }
    });
}

function getSisTintas(UrlST) {
    kendo.ui.progress($("#DivFrmRD"), true);
    $.ajax({
        url: UrlST,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdSistemaTinta + ",";
            });
            $("#IdSistemaTinta_Cota").data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($("#DivFrmRD"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#DivFrmRD"), false);
        }
    });

}


function getPrendasMultiSelec(Url) {
    kendo.ui.progress($("#DivFrmRD"), true);
    $.ajax({
        url: Url,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            var lista = "";
            $.each(respuesta, function (index, elemento) {
                lista = lista + elemento.IdCategoriaPrenda + ",";
            });
            $("#TxtCategoriaPrenda").data("kendoMultiSelect").value(lista.split(","));
            kendo.ui.progress($("#DivFrmRD"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#DivFrmRD"), false);
        }
    });



}

function HabilitaArte(ToF) {
    HabilitaObje("Nombre_Cota", ToF);
    HabilitaObje("NumeroDiseno_Cota", ToF);
    HabilitaObje("EstiloDiseno_Cota", ToF);
    HabilitaObje("TxtDirectorioArchivos_Cota", ToF);
}


function MostrarColorDimen() {
    $("#DimenMsg").show();
    $("#DimenGrid").show();
    $("#ColorMsg").show();
    $("#ColorGrid").show();
}


function OcultarColorDimen() {
    $("#DimenMsg").hide();
    $("#DimenGrid").hide();
    $("#ColorMsg").hide();
    $("#ColorGrid").hide();
}

function OcultarCamposReq(ToF) {

    if (ToF) {
        // mostrar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
        //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
        //el servisio de Serigrafia
        $('#Row4RD').prop('hidden', false);
        $('#Row5RD').prop('hidden', false);

    } else {
        // ocultar fila donde estan los campos, tallas,cantidad de colores, cantidad de tallas,
        //Montaje, combo, Velocidad Maquina, Unidad Velocidad, Base. estos campos son input para 
        //el servisio de Serigrafia
        $('#Row4RD').prop('hidden', true);
        $('#Row5RD').prop('hidden', true);
    }

}
//#endregion Fin metods Generales




