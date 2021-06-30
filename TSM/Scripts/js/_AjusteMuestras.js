var Permisos;
var vIdIdDisenoMuestraAjuste;

var fn_CargarEtapaAjuste = function () {
    //obener el registro de la maquina
    maq = fn_GetMaquinas();
    // obtener los tipos de estaciones
    TiEst = fn_GetTipoEstaciones();

    KdoButton($("#btnAddColorDisAjuste"), "plus-circle", "Agregar color o técnica");

    $("#NumAltoDiseno_Ajuste").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumAnchoDiseno_Ajuste").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumLPelicula_Ajuste").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumTiempoTra_Ajuste").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#maquinaAjusteMues").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    var dataCopy = e.detail[0];
                    fn_DuplicarBrazoMaquina($("#maquinaAjusteMues").data("maquinaSerigrafia").maquina, dataCopy);
                },
                trasladarEstacion: function (e) {
                    var informacionTraslado = e.detail[0];
                    //$("#maquinaAjusteMues").data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio);
                    fn_TrasladarEstacion(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio, $("#maquinaAjusteMues"), function () { return fn_Refrescar(); });
                },
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaAjusteMues").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaAjusteMues"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                    fn_EliminarEstacion(maq[0].IdSeteo, e, $("#maquinaAjusteMues"));
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaAjusteMues").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaAjusteMues"), 1);


                }
            }
        },
        tipoMaquina:
        {
            mostrar: true,
            eventos: {
                onChange: elementoSeleccionado
            }
        },
        colores: { mostrar: true },
        tecnicas: { mostrar: true },
        bases: { mostrar: true },
        accesorios: { mostrar: true }
    });

    fn_GetFormasMaquina($("#maquinaAjusteMues").data("maquinaSerigrafia"));
    $("#maquinaAjusteMues").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
    fn_GetColores($("#maquinaAjusteMues").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaAjusteMues").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Bases($("#maquinaAjusteMues").data("maquinaSerigrafia"));
    fn_Accesorios($("#maquinaAjusteMues").data("maquinaSerigrafia"));



    KdoComboBoxbyData($("#CmbIdUnidad_Ajuste"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmbIdUnidad_Ajuste").data("kendoComboBox").setDataSource(fn_UnidadMedida("14,5,19,22"));
    KdoCmbSetValue($("#CmbIdUnidad_Ajuste"), 5);

    KdoComboBoxbyData($("#CmbIdUnidadLP_Ajuste"), "[]", "Abreviatura", "IdUnidad", "Seleccione unidad de area ....");
    $("#CmbIdUnidadLP_Ajuste").data("kendoComboBox").setDataSource(fn_UnidadMedida("5"));
    KdoCmbSetValue($("#CmbIdUnidadLP_Ajuste"), 5);

    let UrlDM_OP = TSM_Web_APi + "OrientacionPositivos";
    Kendo_CmbFiltrarGrid($("#CmbIdOrientacionPositivo_Ajuste"), UrlDM_OP, "Nombre", "IdOrientacionPositivo", "Seleccione...");
    let UrlDM_TS = TSM_Web_APi + "TiposSeparaciones";
    Kendo_CmbFiltrarGrid($("#CmbIdTipoSeparacion_Ajuste"), UrlDM_TS, "Nombre", "IdTipoSeparacion", "Seleccione...");
    let URLImp = TSM_Web_APi + "Impresores";
    Kendo_CmbFiltrarGrid($("#CmbIdImpresor_Ajuste"), URLImp, "Nombre", "IdImpresor", "Seleccione...");

    KdoButton($("#btnGuardarDiseñoMuesAjuste"), "save", "Guardar");
    $("#DtFecha_Ajuste").kendoDatePicker({ format: "dd/MM/yyyy" });
    KdoDatePikerEnable($("#DtFecha_Ajuste"), false);

    KdoNumerictextboxEnable($("#NumAnchoDiseno_Ajuste"), false);
    KdoNumerictextboxEnable($("#NumAltoDiseno_Ajuste"), false);
    KdoComboBoxEnable($("#CmbIdUnidad_Ajuste"), false);
    // varible para validar formularios
    let valFrmDm_Ajuste = $("#FrmDM_Ajuste").kendoValidator({
        rules: {
            cmop: function (input) {
                if (input.is("[name='CmbIdOrientacionPositivo']")) {
                    return $("#CmbIdOrientacionPositivo").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            cmTs: function (input) {
                if (input.is("[name='CmbIdTipoSeparacion']")) {
                    return $("#CmbIdTipoSeparacion").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            cmUm: function (input) {
                if (input.is("[name='CmbIdUnidad']")) {
                    return $("#CmbIdUnidad").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            cmUmLP: function (input) {
                if (input.is("[name='CmbIdUnidadLP']")) {
                    return $("#CmbIdUnidadLP").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            anchod: function (input) {

                if (input.is("[name='NumAnchoDiseno']")) {
                    return $("#NumAnchoDiseno").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            altod: function (input) {

                if (input.is("[name='NumAltoDiseno']")) {
                    return $("#NumAltoDiseno").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            LP: function (input) {

                if (input.is("[name='NumLPelicula']")) {
                    return $("#NumLPelicula").data("kendoNumericTextBox").element[0].disabled === false && $("#NumLPelicula").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            },
            Tt: function (input) {

                if (input.is("[name='NumTiempoTra']")) {
                    return $("#NumTiempoTra").data("kendoNumericTextBox").value() > 0;
                }
                return true;
            }
        },
        messages: {
            cmop: "Requerido",
            cmTs: "Requerido",
            rdpi: "Requerido",
            anchod: "Requerido",
            cmUmLP: "Requerido",
            altod: "Requerido",
            cmUm: "Requerido",
            LP: "Requerido",
            Tt: "requerido"
        }

    }).data("kendoValidator");


    $("#btnGuardarDiseñoMuesAjuste").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (valFrmDm_Ajuste.validate()) {
            fn_GuardarDM_Ajuste();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });

    $("#CmbIdImpresor_Ajuste").data("kendoComboBox").bind("change", function (e) {
        let _usapositivos = false
        if (this.dataItem()) {
            _usapositivos = this.dataItem().Positivos;
        }

        KdoNumerictextboxEnable($("#NumLPelicula"), _usapositivos);
    });


    Kendo_CmbFiltrarGrid($("#cmbTipoMarco_Ajuste"), TSM_Web_APi + "TiposMarcos", "Nombre", "IdTiposMarco", "Seleccione...");
    // crea dataSource para grid
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetResumenbyIdSeteo/" + maq[0]["IdSeteo"],
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    },
                    error: function () {
                        options.error(result);
                    }
                });
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdSeteo",
                fields: {
                    IdSeda: { type: "number" },
                    DesSeda: { type: "string" },
                    IdTipoEmulsion: { type: "number" },
                    DesTipoEmulsion: { type: "string" },
                    CantidadEstaciones: { type: "string" },
                    Estaciones: { type: "string" },
                    Capilar: { type: "string" }

                }
            }
        }
    });

    var selectedRows = [];
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridresumen_Ajuste").kendoGrid({

        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }

            // Grid_SetSelectRow($("#gridresumen_Ajuste"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeteo", title: "IdSeteo", hidden: true },
            { field: "IdSeda", title: "Id Seda", minResizableWidth: 120, hidden: true },
            { field: "DesSeda", title: "Seda", minResizableWidth: 100 },
            { field: "IdTipoEmulsion", title: "Id Tipo Emulsión", minResizableWidth: 120, hidden: true },
            { field: "DesTipoEmulsion", title: "Emulsión", minResizableWidth: 110 },
            { field: "Capilar", title: "Capilar", minResizableWidth: 100 },
            { field: "CantidadEstaciones", title: "Cant. de Marcos", minResizableWidth: 100 },
            { field: "Estaciones", title: "Lista de Estaciones ", minResizableWidth: 100 }

            //{ field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridresumen_Ajuste").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_ToolbarTop($("#gridresumen_Ajuste").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridresumen_Ajuste").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridresumen_Ajuste").data("kendoGrid"), dataSource);

    $("#gridresumen_Ajuste").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridresumen_Ajuste"), selectedRows);
    });

    fn_ConsultaEstacionesCambioEstado_Ajuste($("#gridCamEstadoMarco_Ajuste"));



    $("#cmbTipoMarco_Ajuste").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value !== "") {
            fn_UpdTipoMarco_Ajuste(this.value());
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar un tipo de marco", "error");
        }
    });


    $("#chkTodasEsta_Ajuste").click(function () {
        if (this.checked) {
            fn_UpdFinalizarMarco_Ajuste();
        }
    });
    fn_GetNoFinalizadas_Ajuste(maq[0].IdSeteo);

    fn_GridDetAjusteTinta($("#gridDetAjuste"));

    $("#btnAddColorDisAjuste").click(function () {
        fn_OpenModaAddColoresTecnicas(function () { return fn_closeDis_Ajuste(); });
    });

};

var fn_closeDis_Ajuste = function () {
    fn_GetColores($("#maquinaAjusteMues").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaAjusteMues").data("maquinaSerigrafia"), maq[0].IdSeteo);
};

var fn_ConsultaEstacionesCambioEstado_Ajuste = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteoMaquina/" + maq[0].IdSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/UpdEstatusMarcoFinalizado/" + datos.IdSeteo + "/" + datos.IdEstacion; },
                type: "PUT",
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
                id: "IdEstacion",
                fields: {
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    },
                    Peso: { type: "number" },
                    IdSeda: {
                        type: "number"
                    },
                    NombreSeda: {
                        type: "string"

                    },
                    IdTipoEmulsion: {
                        type: "number"
                    },
                    NombreEmulsion: {
                        type: "string"

                    },
                    Capilar: {
                        type: "number"
                    },
                    Estado: {
                        type: "string"
                    },
                    NombreEstado: {
                        type: "string"

                    },
                    Finalizado: {
                        type: "bool"

                    },
                    Letra: {
                        type: "string"
                    },
                    Comentario: {
                        type: "string"
                    }
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            fn_GetNoFinalizadas_Ajuste(maq[0].IdSeteo);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {

            var grid = gd.data("kendoGrid");
            var data = grid.dataSource.data();
            $.each(data, function (i, row) {
                if (row.Comentario !== '') {
                    if (row.Comentario === undefined) {
                        $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                    } else {
                        $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#e8e855");
                    }

                } else {
                    $('tr[data-uid="' + row.uid + '"] ').removeAttr("style");
                }
            });
        },
        columns: [
            { field: "Finalizado", title: "Finalizado", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Finalizado"); } },
            { field: "Estado", title: "Cod. estado", hidden: true },
            { field: "NombreEstado", title: "Estado", minResizableWidth: 120, hidden: true },
            { field: "Comentario", title: "Comentario de Ajuste", minResizableWidth: 120, hidden: true},
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50 },
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "Letra", title: "Letra" },
            { field: "DescripcionEstacion", title: "Color", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120, hidden: true },
            { field: "IdSeda", title: "Cod. Seda", hidden: true },
            { field: "NombreSeda", title: "Seda", minResizableWidth: 120 },
            { field: "IdTipoEmulsion", title: "Cod. emulsion", hidden: true },
            { field: "NombreEmulsion", title: "Emulsión", minResizableWidth: 120 },
            { field: "Capilar", title: "Capilar" },
            {
                field: "Finalizar", title: "&nbsp;",
                command: {
                    name: "Finalizar",

                    iconClass: "k-icon k-i-success",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        dataItem.set("Estado", "FINALIZADO");
                        this.saveChanges();

                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }


        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), false);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), false, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srowgr = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srowgr);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srowgr);
        $("#gridDetAjuste").data("kendoGrid").dataSource.read();
    });

};

var fn_GetNoFinalizadas_Ajuste = function (IdSeteo) {
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetNoFinalizadas/" + IdSeteo,
        type: 'GET',
        success: function (datos) {
            if (datos === null) {
                $('#chkTodasEsta_Ajuste').prop('checked', true);
                KdoCheckBoxEnable($('#chkTodasEsta_Ajuste'), false);

            } else {
                $('#chkTodasEsta_Ajuste').prop('checked', datos.MarcoPendientes > 0 ? false : true);
                KdoCheckBoxEnable($('#chkTodasEsta_Ajuste'), datos.MarcoPendientes > 0 ? true : false);

            }

        }
    });
};


var fn_MostrarEtapa = function () {

    fn_GetAfectaSecuencia(maq[0].IdSeteo);
    Acceso_Tintas = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || !(dtoTintas === false || EtpAsignado === false || DienoAfectaSecuencia === true); 
    Acceso_Reve = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || !(dtoRevelado === false || EtpAsignado === false || DienoAfectaSecuencia===true); 
    Acceso_Diseno = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || !(dtoDiseno === false || EtpAsignado === false ); 
    fn_GetDisenoMuestra_Ajuste();
    DienoAfectaSecuencia === true ? $("#maquinaAjusteMues").data("maquinaSerigrafia").activarSoloLectura(false) : $("#maquinaAjusteMues").data("maquinaSerigrafia").activarSoloLectura(!Acceso_Tintas || !Acceso_Reve || !Acceso_Diseno);
    $("#gridresumen_Ajuste").data("kendoGrid").dataSource.read();
    $("#gridCamEstadoMarco_Ajuste").data("kendoGrid").dataSource.read();
    Acceso_Reve === true ? $("#gridCamEstadoMarco_Ajuste").data("kendoGrid").showColumn("Finalizar") : $("#gridCamEstadoMarco_Ajuste").data("kendoGrid").hideColumn("Finalizar");
    KdoCmbSetValue($("#cmbTipoMarco_Ajuste"), maq[0].IdTiposMarco);
    fn_GetNoFinalizadas_Ajuste(maq[0].IdSeteo);

    KdoComboBoxEnable($("#CmbIdOrientacionPositivo_Ajuste"), Acceso_Diseno);
    KdoComboBoxEnable($("#CmbIdTipoSeparacion_Ajuste"), Acceso_Diseno);
    KdoComboBoxEnable($("#CmbIdImpresor_Ajuste"), Acceso_Diseno);
    KdoComboBoxEnable($("#CmbIdUnidadLP_Ajuste"), Acceso_Diseno);
    KdoNumerictextboxEnable($("#NumLPelicula_Ajuste"), Acceso_Diseno);
    KdoNumerictextboxEnable($("#NumTiempoTra_Ajuste"), Acceso_Diseno);
    TextBoxEnable($("#TxtObservaciones_Ajuste"), Acceso_Diseno);
    KdoButtonEnable($("#btnGuardarDiseñoMuesAjuste"), Acceso_Diseno);
    DienoAfectaSecuencia === true ? KdoButtonEnable($("#btnAddColorDisAjuste"), Acceso_Diseno) : KdoButtonEnable($("#btnAddColorDisAjuste"), false);


};

var elementoSeleccionado = function (e) {
    if (Number(maq[0].IdFormaMaquina) !== Number(e.detail[0].IdFormaMaquina)) {
        if ($("#maquinaAjusteMues").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina) === "OK") {
            fn_UpdFormaRevTec(e.detail[0].CantidadEstaciones, e.detail[0].IdFormaMaquina, e.detail[0].NomFiguraMaquina, $("#maquinaAjusteMues"), 0);
        }
    }
};

var fn_UpdFinalizarMarco_Ajuste = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/CambiarEstadoEstacionesTodas",//
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdSeteo: maq[0].IdSeteo
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Post");
            $("#gridCamEstadoMarco_Ajuste").data("kendoGrid").dataSource.read();
            kendo.ui.progress($(document.body), false);
            fn_GetNoFinalizadas_Ajuste(maq[0].IdSeteo);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
        }
    });

};


var fn_UpdTipoMarco_Ajuste = function (idTiposMarco) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinas/UpdSeteoMaquinas_TipoMarco/" + maq[0].IdSeteo,
        type: "Put",
        data: JSON.stringify({
            IdTiposMarco: idTiposMarco
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            kendo.ui.progress($(document.body), false);
            RequestEndMsg(data, "Put");
            maq = fn_GetMaquinas();
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
            maq = fn_GetMaquinas();
        }
    });

};

var fn_GridDetAjusteTinta = function () {

    var dsetRegEst = new kendo.data.DataSource({

        transport: {
            read: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasAlertas/GetAlertaRegistroAjustesMarcos/" + maq[0].IdSeteo + "/" + fn_get_IdEstacion($("#gridCamEstadoMarco_Ajuste").data("kendoGrid")); },
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
        group: {
            field: "MotivoAjuste"
        },
        schema: {
            model: {
                id: "ItemSolicitudAjuste",
                fields: {
                    IdRegistroSolicitudAjuste: { type: "number" },
                    IdMotivoSolicitudAjuste: { type: "number" },
                    ItemSolicitudAjuste: { type: "number" },
                    IdSeteo: { type: "number" },
                    IdEstacion: { type: "number" },
                    MotivoAjuste: { type: "string" },
                    Comentarios: { type: "string" },
                    Estado: { type: "string" },
                    NombreEstado: { type: "string" }
                }
            }
        }

    });
    //CONFIGURACION DEL gCHFor,CAMPOS

    $("#gridDetAjuste").kendoGrid({
        columns: [
            { field: "IdRegistroSolicitudAjuste", title: "Cod.Registro", hidden: true },
            { field: "IdMotivoSolicitudAjuste", title: "Cod.Motivo", hidden: true },
            { field: "ItemSolicitudAjuste", title: "Cod.ItemSolicitud", hidden: true },
            { field: "IdSeteo", title: "Cod.IdSeteo", hidden: true },
            { field: "MotivoAjuste", title: "Motivo ", hidden: true },
            { field: "IdEstacion", title: "Estacion", hidden: true },
            { field: "Comentarios", title: "Comentarios" },
            { field: "Estado", title: "Estado", hidden: true },
            { field: "NombreEstado", title: "Estado" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    SetGrid($("#gridDetAjuste").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_ToolbarTop($("#gridDetAjuste").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridDetAjuste").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDetAjuste").data("kendoGrid"), dsetRegEst);

    var srow_Ajuste1 = [];
    $("#gridDetAjuste").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridDetAjuste"), srow_Ajuste1);
    });

    $("#gridDetAjuste").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridDetAjuste"), srow_Ajuste1);
    });


};


var fn_get_IdEstacion = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdEstacion;
};
fun_List.push(fn_CargarEtapaAjuste);


var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_MostrarEtapa;
fun_ListDatos.push(EtapaPush2);

let fn_GetDisenoMuestra_Ajuste = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DisenoMuestras/" + $("#txtId").val(),
        dataType: "json",
        type: 'GET',
        async: false,
        success: function (respuesta) {
            if (respuesta !== null) {
                vIdIdDisenoMuestraAjuste = respuesta.IdDisenoMuestra;
                kendo.ui.progress($("#vistaParcial_Ajuste"), true);
                kdoNumericSetValue($("#NumAltoDiseno_Ajuste"), respuesta.Alto);
                kdoNumericSetValue($("#NumAnchoDiseno_Ajuste"), respuesta.Ancho);
                KdoCmbSetValue($("#CmbIdUnidad_Ajuste"), respuesta.IdUnidad);
                KdoCmbSetValue($("#CmbIdOrientacionPositivo_Ajuste"), respuesta.IdOrientacionPositivo);
                KdoCmbSetValue($("#CmbIdTipoSeparacion_Ajuste"), respuesta.IdTipoSeparacion);
                $("#DtFecha_Ajuste").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.Fecha), 'dd/MM/yyyy'));
                $("#TxtObservaciones_Ajuste").val(respuesta.Observaciones);
                $("#TxtDirectorio_Ajuste").val(respuesta.RutaArchivos);
                KdoCmbSetValue($("#CmbIdImpresor_Ajuste"), respuesta.IdImpresor);
                kdoNumericSetValue($("#NumLPelicula_Ajuste"), respuesta.LongitudPelicula);
                KdoCmbSetValue($("#CmbIdUnidadLP_Ajuste"), respuesta.IdUnidadLongitudPelicula);
                kdoNumericSetValue($("#NumTiempoTra_Ajuste"), respuesta.TiempoTrabajo);

            }
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};

let fn_GuardarDM_Ajuste = function () {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DisenoMuestras/" + vIdIdDisenoMuestraAjuste,
        dataType: "json",
        type: "Put",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            IdDisenoMuestra: vIdIdDisenoMuestraAjuste,
            IdRequerimiento: $("#txtIdRequerimiento_Ajuste").val(),
            Fecha: kendo.toString(kendo.parseDate($("#DtFecha_Ajuste").val()), 's'),
            Alto: kdoNumericGetValue($("#NumAltoDiseno_Ajuste")),
            Ancho: kdoNumericGetValue($("#NumAnchoDiseno_Ajuste")),
            IdUnidad: KdoCmbGetValue($("#CmbIdUnidad_Ajuste")),
            RutaArchivos: $("#TxtDirectorio_Ajuste").val(),
            IdOrientacionPositivo: KdoCmbGetValue($("#CmbIdOrientacionPositivo_Ajuste")),
            IdTipoSeparacion: KdoCmbGetValue($("#CmbIdTipoSeparacion_Ajuste")),
            Observaciones: $("#TxtObservaciones_Ajuste").val(),
            IdImpresor: KdoCmbGetValue($("#CmbIdImpresor_Ajuste")),
            LongitudPelicula: kdoNumericGetValue($("#NumLPelicula_Ajuste")),
            IdUnidadLongitudPelicula: KdoCmbGetValue($("#CmbIdUnidadLP_Ajuste")),
            TiempoTrabajo: kdoNumericGetValue($("#NumTiempoTra_Ajuste"))
        }),
        success: function (data) {
            RequestEndMsg(data, "Put");
            kendo.ui.progress($(document.body), false);
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
            ErrorMsg(data);
            KdoCmbFocus($("CmbIdOrientacionPositivo_Ajuste"));
        }

    });
};

let fn_Refrescar = function () {
    kendo.ui.progress($(document.body), true);
    $("#gridCamEstadoMarco_Ajuste").data("kendoGrid").dataSource.read();
    $("#gridresumen_Ajuste").data("kendoGrid").dataSource.read();
    if ($("#gridDet_Ajuste").length > 0) { $("#gridDet_Ajuste").data("kendoGrid").dataSource.read(); }
    if ($("#gridDet_Ajuste").length > 0) { fn_GetSeteoFormulacion(maq[0].IdSeteo, xidEstacion); }
   
    kendo.ui.progress($(document.body), false);
};

var fn_Refres_Vista_Ajuste = function () {
    fn_Refrescar();
};

var fn_GetSeteoFormulacion = function (xIdSeteo, xIdestacion) {
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        type: 'GET',
        success: function (setFor) {
            if (setFor !== null) {
                $("#TxtFormulaSugTint_Ajuste").val(setFor.SugerenciaFormula);
                $("#TxtNombreQuiForm_Ajuste").val(setFor.NomIdQuimica);
            }
            else {
                $("#TxtFormulaSugTint_Ajuste").val("");
                $("#TxtNombreQuiForm_Ajuste").val("");
            }
        }
    });
};