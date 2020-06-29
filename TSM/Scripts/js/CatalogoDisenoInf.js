var DsCatDisInf = "";
var xIdServ = 0; //numero de servicio.
var xidRq = 0; //numero del requerimiento
var ValidarFormularioOT = "";
var srcDef = "/Images/NoImagen.png";
var fn_InfDetalle = function (divCDInf, xidCatalogo) {
    Kendo_CmbFiltrarGrid($("#CmbMotivoDesarrollo"), TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/" + xIdServ, "Nombre", "IdMotivoDesarrollo", "Seleccione...");
    $("#swchMuestraFisicaAprobada").kendoSwitch();
    $("#swchMuestraCotizada").kendoSwitch();
    $("#swchMuestraPrecioAprobado").kendoSwitch();
    $("#swchCantidadAprobada").kendoSwitch();
    $("#swchMuestraAprobadaProduccion").kendoSwitch();
    $("#swchDesarrolloCobroAprobado").kendoSwitch();
    $("#swchNotaEnvioAprobado").kendoSwitch();
    fn_gridOT();
    $("#tab_inf").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });

    $("#ModalGeneraOT").kendoDialog({
        height: "auto",
        width: "20%",
        maxHeight: "600 px",
        title: "Generar Orden de Trabajo",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCrear OT', primary: true, action: function () { return fn_GenerarOT(); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
        ],
        close: function (e) {
            KdoCmbSetValue($("#CmbMotivoDesarrollo"), "");
        }
    });

    ValidarFrmGeneraOT = $("#FrmGeneraOT").kendoValidator(
        {
            rules: {
                MsgDesarrollo: function (input) {
                    if (input.is("[name='CmbMotivoDesarrollo']")) {
                        return $("#CmbMotivoDesarrollo").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                MsgDesarrollo: "Requerido"
            }
        }).data("kendoValidator");

    $("#gConOT").data("kendoGrid").bind("change", function () {
        fn_GetAdjuntos();
        Fn_getCotizacion($("#gConOT").data("kendoGrid"));
        fn_GetAprobaciones(fn_getIdOT($("#gConOT").data("kendoGrid")));
        $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
        
    });

    fn_CargarInfDetalle(divCDInf, xidCatalogo);
    $("#swchMuestraFisicaAprobada").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });
    $("#swchMuestraCotizada").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });
    $("#swchMuestraPrecioAprobado").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });
    $("#swchCantidadAprobada").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });
    $("#swchMuestraAprobadaProduccion").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });
    $("#swchDesarrolloCobroAprobado").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });
    $("#swchNotaEnvioAprobado").data("kendoSwitch").bind("change", function () { fn_GuardarAprobacion(fn_getIdOT($("#gConOT").data("kendoGrid"))); });

};

var fn_CargarInfDetalle = function (divCDInf, xidCatalogo) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoByIdCatalogo/" + xidCatalogo.toString(),
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            DsCatDisInf = dato;
            fn_DibujaScrollView($("#scrollView"), "", null);
            if (dato.length > 0) {
                $("#InfCliente").val(dato[0].NombreCli);
                $("#InfFecha").val(kendo.toString(kendo.parseDate(dato[0].Fecha), 'dd/MM/yyyy'));
                $("#" + divCDInf + "").data("kendoDialog").title(dato[0].NombreDiseno);
                $("#gConOT").data("kendoGrid").dataSource.read().then(function () { fn_GetAdjuntos(); });
            } else {
                $("#InfCliente").val("");
                $("#InfFecha").val("");
                $("#" + divCDInf + "").data("kendoDialog").title("");
            }

            kendo.ui.progress($("#ModalCDinf"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });

   
};

let fn_gridOT = function () {
    var dsOT = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                options.success(DsCatDisInf);
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdCatalogoDiseno",
                fields: {
                    IdCatalogoDiseno: { type: "number" },
                    NombreDiseno: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    NumeroDiseno: { type: "string" },
                    NoReferencia: { type: "string" },
                    NombreArchivo: { type: "string" },
                    Fecha: { type: "date" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdCliente: { type: "string" },
                    NombreCli: { type: "string" },
                    IdRequerimiento: { type: "number" },
                    IdOrdenTrabajo: { type: "number" },
                    NoOT: { type: "string" },
                    NoReq: { type: "string" },
                    FechaInicio: { type: "date" },
                    FechaFinal: { type: "date" },
                    NombreDisOT: { type: "string" },
                    EstiloDisenoOT: { type: "string" },
                    NumeroDisenoOT: { type: "string" },
                    FechaSolicitud: { type: "date" },
                    IdArte: { type: "number" },
                    IdServicio: { type: "IdServicio" },
                    Tallas: { type:"Tallas"}
                }
            }
        }
    });
    //CONFIGURACION DEL gConOT,CAMPOS
    $("#gConOT").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NombreDisOT", title: "Nombre del Diseño OT" },
            { field: "IdCatalogoDiseno", title: "Cod IdCatalogo", hidden: true },
            { field: "IdRequerimiento", title: "Cod IdRequerimiento", hidden: true },
            { field: "IdOrdenTrabajo", title: "Cod IdOrdenTrabajo", hidden: true },
            { field: "NoOT", title: "Orden de Trabajo" },
            { field: "NoReq", title: "Requerimiento" },
            { field: "FechaSolicitud", title: "Fecha Solicitud", format: "{0: dd/MM/yyyy}" },
            { field: "FechaInicio", title: "Fecha Inicio de OT", format: "{0: dd/MM/yyyy}" },
            { field: "FechaFinal", title: "Fecha Final de OT", format: "{0: dd/MM/yyyy}" },
            {
                command: {
                    name: "Generar OT",
                    iconClass: "k-icon k-i-file",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        $("#ModalGeneraOT").data("kendoDialog").open();
                        xidRq=dataItem.get("IdRequerimiento");
                        xIdServ = dataItem.get("IdServicio");
                        $("#CmbMotivoDesarrollo").data("kendoComboBox").setDataSource(fn_GetMotivoDesarrollo());
                      
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gConOT
    SetGrid($("#gConOT").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 400);
    Set_Grid_DataSource($("#gConOT").data("kendoGrid"), dsOT,20);

    var selectedRowsServ = [];
    $("#gConOT").data("kendoGrid").bind("dataBound", function () { //foco en la fila
        Grid_SetSelectRow($("#gConOT"), selectedRowsServ);
    });

    $("#gConOT").data("kendoGrid").bind("change", function () {
        Grid_SelectRow($("#gConOT"), selectedRowsServ);
    });

    //#region PRGRANMACION DETALLE DE COTIZACION
    var DsCT = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "CotizacionesMuestrasSimulaciones/GetbyIdOrdenTrbajo/" + (fn_getIdOT($("#gConOT").data("kendoGrid")) === null ? 0 : fn_getIdOT($("#gConOT").data("kendoGrid"))); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
           
        },
        error: Grid_error,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "IdCotizacionSimulacion",
                fields: {
                    IdCotizacionSimulacion: { type: "number" },
                    IdCotizacion: { type: "number" },
                    IdOrdenTrabajo: {type:"number"},
                    IdSimulacionRentabilidad: { type: "number" },
                    PorcUtilidadConsiderada: { type: "number" },
                    UtilidadDolares: { type: "number" },
                    PrecioCliente: { type: "number" },
                    PrecioTS: { type: "number" },
                    PrecioVenta: { type: "number" },
                    FacturacionCliente: { type: "number" },
                    FacturacionTS: { type: "number" },
                    FacturacionVenta: { type: "number" },
                    IdSimulacion: { type: "numeric" },
                    NoDocumento: { type:"string"}
                }
            }
        }
    });

    $("#gridCotizacionDetalle").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdCotizacionProgramaSimulacion", title: "Código Cotización programa sim", hidden: true },
            { field: "IdCotizacion", title: "Código Cotización", hidden: true },
            { field: "IdSimulacion", title: "Código Simulación", hidden: true },
            { field: "IdOrdenTrabajo", title: "Código Orden de trabajo", hidden: true },
            { field: "NoDocumento", title: "No Simulación" },
            { field: "IdSimulacionRentabilidad", title: "cod. Simulación Rentabilidad", hidden: true },
            { field: "PorcUtilidadConsiderada", title: "PorcUtilidad Considerada", editor: Grid_ColNumeric, values: ["required", "-100", "100", "P2", 4], format: "{0:P2}", hidden: true },
            { field: "UtilidadDolares", title: "Utilidad Dolares", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioCliente", title: "Precio Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioTS", title: "Precio Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "PrecioVenta", title: "Precio Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionCliente", title: "Facturacion Cliente", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionTS", title: "Facturacion Techno Screen", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            { field: "FacturacionVenta", title: "Facturacion Venta", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c", 2], format: "{0:c2}", hidden: true },
            {
                field: "aprobar", title: "&nbsp;",
                command: {
                    name: "Aprobar",
                    iconClass: "k-icon k-i-success",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        fn_GenerarSolicitudProducciones();
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    SetGrid($("#gridCotizacionDetalle").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, true, 0);
    SetGrid_CRUD_ToolbarTop($("#gridCotizacionDetalle").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridCotizacionDetalle").data("kendoGrid"), false,false);
    Set_Grid_DataSource($("#gridCotizacionDetalle").data("kendoGrid"), DsCT);


 

    var selectedRowsCotiDet = [];
    $("#gridCotizacionDetalle").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);
    });

    $("#gridCotizacionDetalle").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridCotizacionDetalle"), selectedRowsCotiDet);
    });

    //#endregion FIN PROGRAMACIÓN DEL GRID SIMULACIÓN
};

let fn_GetAdjuntos = function () {
    //LLena Splitter de imagenes
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + fn_getIdArte($("#gConOT").data("kendoGrid")),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            fn_DibujaScrollView($("#scrollView"), "/Adjuntos/" + fn_getNoReq($("#gConOT").data("kendoGrid")) + "", respuesta);
            kendo.ui.progress($("#ModalCDinf"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};

let fn_DibujaScrollView = function (Objecarousel, src, DataSource) {

    var lista = Objecarousel;
    //remueve las imagenes del carrousel
    Objecarousel.children().remove();
    if (DataSource === null || DataSource === undefined) {
        lista.append(
            '<div class="photo" style="background-image:url(\'' + srcDef + '\')" data-role="page"></div>'
        );

    } else {
        if (DataSource.length === 0) {
            lista.append(
                '<div class="photo" style="background-image:url(\'' + srcDef + '\')" data-role="page"></div>'
            );
        } else {
            $.each(DataSource, function (index, elemento) {
                lista.append('<div class="photo" style="background-image:url(\'' + src + '/' + elemento.NombreArchivo + '\')" data-role="page" onerror="imgError(this)"></div>');
            });
        }

    }

    lista.kendoScrollView({
        enablePager: true,
        contentHeight: "100%"
    });
};


let fn_getIdArte=function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdArte;
};

let fn_getNoReq = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoReq;
};

let fn_GetMotivoDesarrollo = function () {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/" + xIdServ.toString(),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let fn_GenerarOT = function () {
    let Realizado = false;
    let xNDocReqAnterior = fn_getNodocumentoReq($("#gConOT").data("kendoGrid")).toString();
    let IdArte =fn_getIdArte($("#gConOT").data("kendoGrid"));
    if (ValidarFrmGeneraOT.validate()) {
        // obtener indice de la etapa siguiente
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "CatalogoDisenos/GenerarOrdenTrabajoCatalogo/" + fn_getIdRequerimiento($("#gConOT").data("kendoGrid")).toString() + "/" + KdoCmbGetValue($("#CmbMotivoDesarrollo")).toString(),
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Realizado = true;
                RequestEndMsg(datos, "Post");
                $("#ModalGeneraOT").data("kendoDialog").close();
                fn_GetOTDetalleReq(datos[0], IdArte, xNDocReqAnterior);
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(".k-dialog"), false);
            }
        });
    } else {
        Realizado = false;
    }
    return Realizado;
};

let fn_getIdRequerimiento= function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;

};

let fn_getNodocumentoReq = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoReq;
};

let fn_AdjArchivoRD = function (NodocumentoReqNuevo,idarte, NodocumentoReq) {

    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "ArteAdjuntos/GetByArte/" + idarte,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            $.each(respuesta, function (item, elemento) {
                var dsres = [{
                    NoDocumento: NodocumentoReqNuevo,
                    NoReferencia: NodocumentoReq,
                    NombreArchivo: elemento.NombreArchivo
                }];
                fn_SubirADj(dsres);
            });
           
            kendo.ui.progress($("#ModalCDinf"), false);
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};
let fn_SubirADj = function (ds) {
    $.ajax({
        type: "Post",
        dataType: 'json',
        async: false,
        data: JSON.stringify(ds),
        url: "/RequerimientoDesarrollos/SubirArchivoReq",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

        }
    });
};

let fn_GetOTDetalleReq = function (idot, IdArte, xNDocReqAnterior) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "/OrdenesTrabajosDetalles/GetOrdenesTrabajosDetallesRequerimiento/" + idot,
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                fn_AdjArchivoRD(respuesta.NodocReq, IdArte, xNDocReqAnterior);
            }
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};

let Fn_getCotizacion = function (g) {
    var elemento = g.dataItem(g.select());
    $("#InfTallas").val(elemento.Tallas);
    $("#InfNombreDisOT").val(elemento.NombreDisOT);
    $("#InfEstiloDisenoOT").val(elemento.EstiloDisenoOT);
    $("#InfNumDisenoOT").val(elemento.NumeroDisenoOT);
};

let fn_GuardarAprobacion = function (idot) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosAprobaciones/" + idot,
        dataType: "json",
        type: "PUT",
        data: JSON.stringify({
            IdOrdenTrabajo: idot,
            MuestraFisicaAprobada: $("#swchMuestraFisicaAprobada").data("kendoSwitch").check(),
            MuestraCotizada: $("#swchMuestraCotizada").data("kendoSwitch").check(),
            MuestraPrecioAprobado: $("#swchMuestraPrecioAprobado").data("kendoSwitch").check(),
            CantidadAprobada: $("#swchCantidadAprobada").data("kendoSwitch").check(),
            MuestraAprobadaProduccion: $("#swchMuestraAprobadaProduccion").data("kendoSwitch").check(),
            DesarrolloCobroAprobado: $("#swchDesarrolloCobroAprobado").data("kendoSwitch").check(),
            NotaEnvioAprobado: $("#swchNotaEnvioAprobado").data("kendoSwitch").check()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (respuesta) {
            kendo.ui.progress($("#ModalCDinf"), false);
            RequestEndMsg(respuesta, "Put");
        },
        error: function (respuesta) {
            kendo.ui.progress($("#ModalCDinf"), false);
            ErrorMsg(respuesta);
        }
    });
};

let fn_GetAprobaciones = function (idot) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajosAprobaciones/" + (idot === null ? 0 : idot),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                fn_HabilitarAprobaciones(true);
                $("#swchMuestraFisicaAprobada").data("kendoSwitch").check(respuesta.MuestraFisicaAprobada);
                $("#swchMuestraCotizada").data("kendoSwitch").check(respuesta.MuestraCotizada);
                $("#swchMuestraPrecioAprobado").data("kendoSwitch").check(respuesta.MuestraPrecioAprobado);
                $("#swchCantidadAprobada").data("kendoSwitch").check(respuesta.MuestraPrecioAprobado);
                $("#swchMuestraAprobadaProduccion").data("kendoSwitch").check(respuesta.MuestraAprobadaProduccion);
                $("#swchDesarrolloCobroAprobado").data("kendoSwitch").check(respuesta.DesarrolloCobroAprobado);
                $("#swchNotaEnvioAprobado").data("kendoSwitch").check(respuesta.NotaEnvioAprobado);
            } else {
                fn_HabilitarAprobaciones(false);
                $("#swchMuestraFisicaAprobada").data("kendoSwitch").check(0);
                $("#swchMuestraCotizada").data("kendoSwitch").check(0);
                $("#swchMuestraPrecioAprobado").data("kendoSwitch").check(0);
                $("#swchCantidadAprobada").data("kendoSwitch").check(0);
                $("#swchMuestraAprobadaProduccion").data("kendoSwitch").check(0);
                $("#swchDesarrolloCobroAprobado").data("kendoSwitch").check(0);
                $("#swchNotaEnvioAprobado").data("kendoSwitch").check(0);

            }
        },
        error: function () {
            kendo.ui.progress($("#ModalCDinf"), false);
        }
    });
};

let fn_getIdOT = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdOrdenTrabajo;

};
let fn_getIdSimulacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdSimulacion;
};
let fn_getIdCotizacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdCotizacion;
};
let fn_GenerarSolicitudProducciones = function () {
    kendo.ui.progress($("#ModalGeneraOT"), true);
    $.ajax({
        url: TSM_Web_APi + "SolicitudProducciones/Procesar/" + fn_getIdCotizacion($("#gridCotizacionDetalle").data("kendoGrid")) + "/" + fn_getIdOT($("#gridCotizacionDetalle").data("kendoGrid")) + "/" + fn_getIdSimulacion($("#gridCotizacionDetalle").data("kendoGrid")),
        type: "Post",
        dataType: "json",
        data: JSON.stringify({ IdSimulacionRentabilidad: null }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#gridCotizacionDetalle").data("kendoGrid").dataSource.read();
            kendo.ui.progress($("#ModalGeneraOT"), false);
            RequestEndMsg(data, "Post");
        },
        error: function (data) {
            kendo.ui.progress($("#ModalGeneraOT"), false);
            ErrorMsg(data);
        }
    });
};

fn_HabilitarAprobaciones = function (b) {
    $("#swchMuestraFisicaAprobada").data("kendoSwitch").enable(b);
    $("#swchMuestraCotizada").data("kendoSwitch").enable(b);
    $("#swchMuestraPrecioAprobado").data("kendoSwitch").enable(b);
    $("#swchCantidadAprobada").data("kendoSwitch").enable(b);
    $("#swchMuestraAprobadaProduccion").data("kendoSwitch").enable(b);
    $("#swchDesarrolloCobroAprobado").data("kendoSwitch").enable(b);
    $("#swchNotaEnvioAprobado").data("kendoSwitch").enable(b);
};


