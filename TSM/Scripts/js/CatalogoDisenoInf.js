var DsCatDisInf = "";
var xIdServ = 0; //numero de servicio.
var xidRq = 0; //numero del requerimiento
var ValidarFormularioOT = "";
var srcDef = "/Images/NoImagen.png";
var fn_InfDetalle = function (divCDInf, xidCatalogo) {
    Kendo_CmbFiltrarGrid($("#CmbMotivoDesarrollo"), TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/" + xIdServ, "Nombre", "IdMotivoDesarrollo", "Seleccione...");
    fn_gridOT();
    fn_CargarInfDetalle(divCDInf, xidCatalogo);

    $("#ModalGeneraOT").kendoDialog({
        height: "auto",
        width: "20%",
        maxHeight: "600 px",
        title: "Generar Orden de Trabajo",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCambiar', primary: true, action: function () { return fn_GenerarOT(); } },
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
};


var fn_CargarInfDetalle = function (divCDInf, xidCatalogo) {
    kendo.ui.progress($("#ModalCDinf"), true);
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoByIdCatalogo/" + xidCatalogo.toString(),
        dataType: 'json',
        type: 'GET',
        success: function (dato) {
            DsCatDisInf = dato;
            if (dato.length > 0) {
                $("#InfCliente").text(dato[0].NombreCli);
                $("#InfFecha").text(kendo.toString(kendo.parseDate(dato[0].Fecha), 'dd/MM/yyyy'));
                $("#" + divCDInf + "").data("kendoDialog").title(dato[0].NombreDiseno);
                $("#gConOT").data("kendoGrid").dataSource.read().then(function () { fn_GetAdjuntos(); });
          
            } else {
                $("#InfCliente").text("");
                $("#InfFecha").text("");
                $("#" + divCDInf + "").data("kendoDialog").title("");
                fn_DibujaScrollView($("#scrollView"), "", null);
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
                    IdServicio: {type:"IdServicio"}
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
    SetGrid($("#gConOT").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 350);
    Set_Grid_DataSource($("#gConOT").data("kendoGrid"), dsOT);

    var selectedRowsServ = [];
    $("#gConOT").data("kendoGrid").bind("dataBound", function () { //foco en la fila
        Grid_SetSelectRow($("#gConOT"), selectedRowsServ);
    });

    $("#gConOT").data("kendoGrid").bind("change", function () {
        Grid_SelectRow($("#gConOT"), selectedRowsServ);
    });


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
    if (ValidarFrmGeneraOT.validate()) {
        // obtener indice de la etapa siguiente
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "CatalogoDisenos/GenerarOrdenTrabajoCatalogo/" + fn_getIdRequerimiento($("#gConOT").data("kendoGrid")).toString() + "/" + KdoCmbGetValue($("#CmbMotivoDesarrollo")).toString(),
            method: "POST",
            dataType: "json",
            //data: JSON.stringify({
            //    IdRequerimiento: fn_getIdRequerimiento($("#gConOT").data("kendoGrid")),
            //    IdMotivoDesarrollo: KdoCmbGetValue($("#CmbMotivoDesarrollo"))
            //}),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                Realizado = true;
                RequestEndMsg(datos, "Post");
                $("#ModalGeneraOT").data("kendoDialog").close();
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