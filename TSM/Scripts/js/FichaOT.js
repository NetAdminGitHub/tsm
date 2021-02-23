var Permisos;
let xIdArte = 0;
let xIdSeteo = 0;

$(document).ready(function () {
    xIdOt = xIdOt === undefined ? 0 : xIdOt;
    KdoButton($("#btnIrGOT"), "hyperlink-open-sm");
    // carga carrousel de imagenes 
    var DivCarousel = $("#C_ImgDiseño");
    //Configuracion de panel
    PanelBarConfig($("#bpanel"));
    DivCarousel.append(Fn_Carouselcontent());
    fn_GetOTRequerimiento();
    $("#btnIrGOT").click(function () {
        window.location.href = "/ConsultarFichaOT";
    });

    
});

let fn_GetOTRequerimiento = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosDetalles/GetOrdenesTrabajosDetallesRequerimiento/" + xIdOt,
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#plNomServicio").text(datos.NomServicio);
                $("#plFechaOrdenTrabajo").text(kendo.toString(kendo.parseDate(datos.FechaOrdenTrabajo), 'dd/MM/yyyy'));
                $("#plNodocReq").text(datos.NodocReq);
                $("#plIdCliente").text(datos.IdCliente);
                $("#plNombre").text(datos.Nombre);
                $("#plNombreDiseno").text(datos.NombreDiseno);
                $("#plEstiloDiseno").text(datos.EstiloDiseno);
                $("#plNombrePrenda").text(datos.NombrePrenda);
                $("#plNoDocumento").text(datos.NoDocumento);
                $("#plNombreCFT").text(datos.NombreCFT);
                $("#plNombreEjecutivoCuentas").text(datos.NombreEjecutivoCuentas);
                $("#plNombreTalla").text(datos.NombreTalla);
                $("#plNombreQui").text(datos.NombreQui);
                $("#plNombreCPT").text(datos.NombreCPT);
                $("#plNombreCCT").text(datos.NombreCCT);
                $("#plNombreUbicacion").text(datos.NombreUbicacion);
                $("#plSolicitaTelaSustituta").text(datos.SolicitaTelaSustituta === true ? "Si" : "No");
                $("#plNombreEtapaActual").text(datos.NombreEtapaActual);
                $("#plColor").text(datos.Color);
                xIdArte = datos.IdArte === null ? 0 : datos.IdArte;
                xIdSeteo = datos.IdSeteoActual === null ? 0 : datos.IdSeteoActual;

                fn_getAdjun();
            }
        },
        error: function () { kendo.ui.progress($(document.body), false); },
        complete: function () {
            fn_MostraFormulaCab();
            fn_MostrarEstMarcos();
            fn_OTMostrarEstados();
            fn_DibujarSeccionMaqui();
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_getAdjun = function (UrlAA) {
    //LLena Splitter de imagenes
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + xIdArte.toString(),
        dataType: 'json',
        type: 'GET',
        success: function (datos) {
            Fn_LeerImagenes($("#Mycarousel"), "/Adjuntos/" + $("#plNodocReq").text() + "", datos);
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_MostrarEstMarcos = function () {
    var dsetMar = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetTintasFormulacionesEstaciones/" + xIdSeteo; },
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
                id: "IdFormula",
                fields: {
                    IdFormula: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdTipoFormulacion: { type: "string" },
                    lblEstacion: { type: "string" },
                    Capilar: { type: "number" },
                    NoPasadas: { type: "number" },
                    Letra: { type: "string" },
                    IdTipoEmulsion: { type: "number" },
                    NomEmulsion: { type: "string" },
                    Area: { type: "number" },
                    IdUnidadArea: { type: "number" },
                    DesArea: { type: "string" },
                    Peso: { type: "number" },
                    IdUnidadPeso: { type: "number" },
                    DesPeso: { type: "string" },
                    ResolucionDPI: { type: "numeber" },
                    LineajeLPI: { type: "number" },
                    Pixeles: { type: "number" },
                    IdSeda: { type: "number" },
                    SedaNombre: { type: "string" },
                    DurezaEscurridor: { type: "number" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gMarcos").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "IdSeda", title: "IdSeda", hidden: true },
            { field: "SedaNombre", title: "Seda" },
            { field: "DurezaEscurridor", title: "Dureza Escurridor" },
            { field: "Letra", title: "Letra" },
            { field: "Capilar", title: "Capilar", format: "{0:n2}" },
            { field: "NoPasadas", title: "NoPasadas" },
            { field: "IdTipoEmulsion", title: "Tipo Emulsion", hidden: true },
            { field: "NomEmulsion", title: "Emulsion" },
            { field: "Area", title: "Area", format: "{0:n2}" },
            { field: "IdUnidadArea", title: "Id Area", hidden: true },
            { field: "DesArea", title: "Unidad Area" },
            { field: "Peso", title: "Peso", format: "{0:n2}" },
            { field: "IdUnidadPeso", title: "Id Uni Peso", hidden: true },
            { field: "DesPeso", title: "Unidad Peso" },
            { field: "ResolucionDPI", title: "Resolucion DPI" },
            { field: "Pixeles", title: "Pixeles" },
            { field: "LineajeLPI", title: "Lineaje" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gMarcos").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gMarcos").data("kendoGrid"), dsetMar);
};

let fn_MostraFormulaCab = function () {

    var dataSource = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetTintasFormulacionesEstaciones/" + xIdSeteo; },
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
                id: "IdFormula",
                fields: {
                    IdFormula: { type: "number" },
                    IdEstacion: { type: "number" },
                    IdTipoFormulacion: { type: "string" },
                    lblEstacion: { type: "string" },
                    TecnicaAplicar: { type: "string" },
                    NomSistemaPigmento: { type: "string" },
                    NomBasePigmento: { type: "string" },
                    NomTipoTinta: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gFor").kendoGrid({
        detailInit: detailInit,
        dataBound: function () {
            this.collapseRow(this.tbody.find("tr.k-master-row").first());
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "No Formula", hidden: true },
            { field: "IdEstacion", title: "Estación" },
            { field: "IdTipoFormulacion", title: "Formulación" },
            { field: "lblEstacion", title: "Descripción" },
            { field: "TecnicaAplicar", title: "Técnica Aplicar" },
            { field: "NomSistemaPigmento", title: "Sistema Pigmento" },
            { field: "NomBasePigmento", title: "Base Pigmento" },
            { field: "NomTipoTinta", title: "Tipo Tintas" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gFor").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 0);
    Set_Grid_DataSource($("#gFor").data("kendoGrid"), dataSource);

    // gCHFor detalle
    function detailInit(e) {
        var vidFor = e.data.IdFormula === null ? 0 : e.data.IdFormula;
        var VdS = {
            transport: {
                read: {
                    url: function () { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + vidFor; },
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
                    id: "IdFormula",
                    fields: {
                        IdFormula: { type: "number" },
                        Item: { type: "number" },
                        IdArticulo: { type: "string" },
                        Nombre: { type: "string" },
                        MasaFinal: { type: "number" },
                        PorcentajeFinal: { type: "number" }
                    }
                }
            },
            aggregate: [
                { field: "MasaFinal", aggregate: "sum" },
                { field: "PorcentajeFinal", aggregate: "sum" }
            ],
            filter: { field: "IdFormula", operator: "eq", value: e.data.IdFormula }
        };

        var g = $("<div/>").appendTo(e.detailCell).kendoGrid({
            //DEFICNICIÓN DE LOS CAMPOS
            columns: [
                { field: "CodigoColor", title: "Codigo Color", hidden: true },
                { field: "Item", title: "Item" },
                { field: "IdArticulo", title: "Articulo" },
                { field: "Nombre", title: "Nombre" },
                { field: "MasaFinal", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? kendo.format('{0:n2}', sum) : 0 #" },
                { field: "PorcentajeFinal", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
            ]
        });

        ConfGDetalle(g.data("kendoGrid"), VdS, "gFor_detalle" + vidFor);

        var selectedRowsTec = [];
        g.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
            Grid_SetSelectRow(g, selectedRowsTec);
        });

        g.data("kendoGrid").bind("change", function (e) {
            Grid_SelectRow(g, selectedRowsTec);
        });
    }

    function ConfGDetalle(g, ds, Id_gCHForDetalle) {
        SetGrid(g, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 250);
        Set_Grid_DataSource(g, ds);
    }
};



let fn_OTMostrarEstados = function () {
    var dsetOTEstados = new kendo.data.DataSource({

        transport: {
            read: {
                url: function () { return TSM_Web_APi + "OrdenesTrabajosDetallesEstados/GetByIdOrdenTrabajo/" + xIdOt; },
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
                id: "IDOrdenTrabajo",
                fields: {
                    IDOrdenTrabajo: { type: "number" },
                    FechaEstado: { type: "date" },
                    Item: { type: "number" },
                    IdEtapaProceso: { type: "number" },
                    Nombre: { type: "string" },
                    IdUsuario: { type: "string" },
                    Nombre1: { type: "string" },
                    Estado: { type: "string" },
                    Nombre2: { type: "string" },
                    Motivo: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL gCHFor,CAMPOS
    $("#gEstados").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IDOrdenTrabajo", title: "Código OT", hidden: true },
            { field: "FechaEstado", title: "Fecha Cambio de Etapa", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" ,width:160},
            { field: "Item", title: "Item" ,width:50},
            { field: "IdEtapaProceso", title: "Código Etapa", hidden: true,width:200},
            { field: "Nombre", title: "Etapa del Proceso",width:200 },
            { field: "IdUsuario", title: "Código Usuario", hidden: true,width:100 },
            { field: "Nombre1", title: "Usuario",width:200 },
            { field: "Estado", title: "Estado" ,width:100 },
            { field: "Nombre2", title: "Estado", hidden: true},
            { field: "Motivo", title: "Motivo" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gEstados").data("kendoGrid"), ModoEdicion.EnPopup, true, false, true, false, redimensionable.Si, 350);
    Set_Grid_DataSource($("#gEstados").data("kendoGrid"), dsetOTEstados,20);
};

let fn_DibujarSeccionMaqui = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/" + xIdSeteo,
        type: 'GET',
        success: function (datos) {
            //if (datos !== null) {
                maq=fn_GetMQ(datos.IdEtapaProceso, datos.Item);
                $("#maquinaConsultaOT").maquinaSerigrafia({
                    maquina: {
                        data: maq
                    }
                });
            //}
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};

var fn_GetMQ = function (xetp, xitem) {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/GetSeteoMaquina/" + xIdOt + "/" + xetp + "/" + xitem,
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

    return result;
};

fPermisos = function (datos) {
    Permisos = datos;
};


