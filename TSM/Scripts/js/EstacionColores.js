"use strict";
var fn_VistaEstacionColorDocuReady = function () {
    KdoButton($("#btnccc"), "search", "Buscar en formula historicas..");
    KdoButtonEnable($("#btnccc"), false);
    KdoButton($("#btnDelFT"), "delete", "Borrar formula..");
    KdoButtonEnable($("#btnDelFT"), false);

    KdoButton($("#btnAddMCE"), "check", "Agregar");

    $("#EscurridorDureza").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumPasadas").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumCapilar").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });

    Kendo_CmbFiltrarGrid($("#CmbIdTipoEstacion"), TSM_Web_APi + "TipoEstaciones/GetTipoEstacionesSinAccesorios", "Nombre", "IdTipoEstacion", "Seleccione ...");    

    /*  Kendo_CmbFiltrarGrid($("#CmbQuimica_color"), TSM_Web_APi + "Quimicas", "Nombre", "IdQuimica", "Seleccione ...");*/

    KdoComboBoxbyData($("#CmbQuimica_color"), "[]", "Nombre", "IdQuimicaFormula", "Seleccione ....");
    $("#CmbQuimica_color").data("kendoComboBox").setDataSource(Fn_GetQuimicaFormula(0));
        
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_color"), "[]", "Nombre", "IdTipoTinta", "Seleccione un tipo tintas ....");
    $("#CmbTipoTinta_color").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(0));

    KdoComboBoxbyData($("#CmbSistemaPigmento_Color"), "[]", "Nombre", "IdSistemaPigmento", "Seleccione un sitema pigmentos ....", "", "");
    $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(0));
    //var ttsp = TSM_Web_APi + "TiposTintasSistemasPigmentos/GetByTipoTinta/" + 0;
    //Kendo_CmbFiltrarGrid($("#CmbSistemaPigmento_Color"), ttsp, "Nombre", "IdSistemaPigmento", "Seleccione un sitema pigmentos ....");

    let UrlSed = TSM_Web_APi + "Sedas";
    Kendo_CmbFiltrarGrid($("#CmbSedas_color"), UrlSed, "Nombre", "IdSeda", "Seleccione una seda ....");

    let UrlTemul = TSM_Web_APi + "TiposEmulsiones";
    Kendo_CmbFiltrarGrid($("#CmbTipoEmulsion_color"), UrlTemul, "Nombre", "IdTipoEmulsion", "Seleccione una emulsión ....");

    let UrlRqTec = TSM_Web_APi + "SeteoMaquinaTecnicas/GetSeteoMaquinaTecnicasByIdSeteo/" + maq[0].IdSeteo;
    Kendo_CmbFiltrarGrid($("#CmbTecnica_color"), UrlRqTec, "Nombre", "IdRequerimientoTecnica", "Seleccione una Tecnica ....");
    KdoComboBoxEnable($("#CmbTecnica_color"), false);

    KdoComboBoxbyData($("#CmbBasePigmento_color"), "[]", "Nombre", "IdBasePigmento", "Seleccione una Base de mezcla ....");
    $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(0));

    var frmColor = $("#FrmGenEColor").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistemaPigmento_Color']")) {
                  return $("#CmbSistemaPigmento_Color").data("kendoComboBox").text() === "" ? true : $("#CmbSistemaPigmento_Color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vQui: function (input) {
                if (input.is("[id='CmbQuimica_color']")) {
                    return $("#CmbQuimica_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTT: function (input) {
                if (input.is("[id='CmbTipoTinta_color']")) {
                    return $("#CmbTipoTinta_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTSed: function (input) {
                if (input.is("[id='CmbSedas_color']")) {
                    return $("#CmbSedas_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vTemul: function (input) {
                if (input.is("[id='CmbTipoEmulsion_color']")) {
                    return $("#CmbTipoEmulsion_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vsuge: function (input) {
                if (input.is("[name='TxtFormulaSug']")) {
                    return input.val().length <= 200;
                }
                return true;
            },
            vtecapli: function (input) {
                if (input.is("[id='CmbTecnica_color']")) {
                    return $("#CmbTecnica_color").data("kendoComboBox").text() === "" ? true : $("#CmbTecnica_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vbmez: function (input) {
                if (input.is("[id='CmbBasePigmento_color']")) {
                    return $("#CmbBasePigmento_color").data("kendoComboBox").text() === "" ? true : $("#CmbBasePigmento_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            },
            vncapilar: function (input) {
                if (input.is("[id='NumCapilar']") && Te === "TECNICA" ) {
                    return $("#NumCapilar").data("kendoNumericTextBox").value()   !== 0;
                }
                return true;
            }
        },
        messages: {
            vST: "Requerido",
            vQui: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido",
            vTemul: "Requerido",
            vsuge: "Longitud máxima del campo es 200",
            vtecapli: "Requerido",
            vbmez: "Requerido",
            vncapilar: "Requerido"
        }
    }).data("kendoValidator");

    $("#btnAddMCE").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmColor.validate()) {
            fn_GuardarEstacionColor();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    $("#btnccc").data("kendoButton").bind("click", function () {
        //FormulaHist: es el nombre del div en la vista elementoTrabajo
        fn_FormulaHistorica("FormulaHist");
    });
    $("#btnDelFT").data("kendoButton").bind("click", function () {
        fn_DelFormulaHis();
    });

    $("#CmbIdTipoEstacion").data("kendoComboBox").bind("select", function (e) {
        fn_DeshabilitarCamposMarco(e.dataItem.UtilizaMarco);
    });

    $("#CmbTipoTinta_color").data("kendoComboBox").bind("change", function (e) {
        let TipoTin = this.value();

        //Si se vacía el control
        if (TipoTin === "") {
            KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
            KdoCmbSetValue($("#CmbBasePigmento_color"), "");
            $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource([]);
            $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
            KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
        }
    });

    $("#CmbTipoTinta_color").data("kendoComboBox").bind("select", function (e) {
        KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), vhb);
        KdoComboBoxEnable($("#CmbBasePigmento_color"), vhb);
        let TipoTin = e.dataItem.IdTipoTinta;
        KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
        $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(TipoTin));

        KdoCmbSetValue($("#CmbBasePigmento_color"), "");
        $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(TipoTin));


        // obtener el numero de pasadas por sistema de tintas
        if (TipoTin !== null) {
            let data = TipoTintas.find(q => q.IdTipoTinta === TipoTin);
            kdoNumericSetValue($("#NumPasadas"), data.NoPasadas);
        } else {
            kdoNumericSetValue($("#NumPasadas"), 1);
        }
    });

    $("#CmbTecnica_color").data("kendoComboBox").bind("change", function (e) {
        if (this.value() === "") {
            $("#ArticuloSugerido").val("");
        }        
    });

    $("#CmbTecnica_color").data("kendoComboBox").bind("select", function (e) {
        fn_TecnicasArticuloSugerido($("#ArticuloSugerido"), maq[0].IdSeteo, e.dataItem.IdRequerimientoTecnica);
    });
    
    $("#CmbQuimica_color").data("kendoComboBox").bind("change", function (e) {
        let idQ = this.value();

        //Si se vacía el control
        if (idQ === "") {
            KdoCmbSetValue($("#CmbTipoTinta_color"), "");
            $("#CmbTipoTinta_color").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbTipoTinta_color"), false);

            KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
            KdoCmbSetValue($("#CmbBasePigmento_color"), "");
            $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource([]);
            $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource([]);
            KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
            KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
        }
    });

    $("#CmbQuimica_color").data("kendoComboBox").bind("select", function (e) {
        KdoComboBoxEnable($("#CmbTipoTinta_color"), true);
        if (Arrastre_Nuevo === 0) {
            let idQ = e.dataItem.IdQuimicaFormula;
            KdoCmbSetValue($("#CmbTipoTinta_color"), "");
            $("#CmbTipoTinta_color").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(idQ));
        } else {
            Arrastre_Nuevo = 0;
        }
    });

    fn_GridEstacionesColor($("#gridEstacionMq_C"));

    // #region Grid de Materias Primas
    var dsAjusColor_Mp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (data) { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + ($("#TxtIdform").val() === "" ? 0 : $("#TxtIdform").val()); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "TintasFormulacionesDetalles/" + datos.IdFormula + "/" + datos.Item; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "TintasFormulacionesDetalles/" + datos.IdFormula + "/" + datos.Item; },
                type: "DELETE"
            },
            create: {
                url: TSM_Web_APi + "TintasFormulacionesDetalles",
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
                id: "Item",
                fields: {
                    IdFormula: {
                        type: "number",
                        defaultValue: function () {
                            return $("#TxtIdform").val();
                        }
                    },
                    Item: {
                        type: "number"
                    },
                    IdArticulo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdArticulo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("[name='IdArticulo']").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
                    },
                    MasaInicial: {
                        type: "number",
                        default: 0
                    },
                    PorcentajeInicial: {
                        type: "number",
                        default: 0
                    },
                    MasaAgregada: {
                        type: "number",
                        default: 0
                    },
                    PorcentajeAgregado: {
                        type: "number",
                        default: 0
                    },
                    MasaFinal: {
                        type: "number",
                        default: 0
                    },
                    PorcentajeFinal: {
                        type: "number"
                    },
                    Masatotal: {
                        type: "number"
                    }
                }
            }
        },
        aggregate: [
            { field: "PorcentajeFinal", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });

    $("#TablaFormula").kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdFormula");
            KdoHideCampoPopup(e.container, "MasaInicial");
            KdoHideCampoPopup(e.container, "PorcentajeInicial");
            KdoHideCampoPopup(e.container, "MasaAgregada");
            KdoHideCampoPopup(e.container, "PorcentajeAgregado");
            KdoHideCampoPopup(e.container, "MasaFinal");
            KdoHideCampoPopup(e.container, "Masatotal");
            
            if (!e.model.isNew()) {
                Grid_Focus(e, "IdArticulo");
                var multicolumncombobox = $('[name="IdArticulo"]').data("kendoMultiColumnComboBox");
                multicolumncombobox.select(function (dataItem) { return dataItem.IdArticulo === e.model.IdArticulo; });
                multicolumncombobox.search(e.model.Nombre);
                multicolumncombobox.refresh();
                multicolumncombobox.text(e.model.Nombre);
                multicolumncombobox.close();

            } else {
                Grid_Focus(e, "IdArticulo");
            }
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "Código. Formula", hidden: true },
            {
                field: "IdArticulo", title: "Código Articulo",
                editor: function (container, options) {
                    if (CumpleOEKOTEX === false) {
                        $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrima(QuimicaFormula);
                    }
                    else {
                        $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionMateriaPrimaOEKOTEX(QuimicaFormula);
                    }
                }
            },
            { field: "Nombre", title: "Nombre" },
            { field: "MasaInicial", title: "Masa Inicial", hidden: true },
            { field: "PorcentajeInicial", title: "Porcentaje Inicial", hidden: true },
            { field: "MasaAgregada", title: "Masa Agregada", hidden: true },
            { field: "PorcentajeAgregado", title: "% Agregado", hidden: true },
            { field: "MasaFinal", title: "Masa Final", hidden: true },
            { field: "PorcentajeFinal", title: "% Final", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeFinal ? kendo.format('{0:n2}', sum)*100: 0 # %" },
            { field: "Masatotal", title: "Masatotal", menu: false, hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#TablaFormula").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 200);
    SetGrid_CRUD_ToolbarTop($("#TablaFormula").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#TablaFormula").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#TablaFormula").data("kendoGrid"), dsAjusColor_Mp);

    var srowcMP = [];
    $("#TablaFormula").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#TablaFormula"), srowcMP);
    });

    $("#TablaFormula").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#TablaFormula"), srowcMP);
    });
    // #endregion
};

var fn_VistaEstacionColor = function () {
    InicioModalRT = 1;
    TextBoxEnable($("#TxtOpcSelec"), false);
    TextBoxEnable($("#TxtNombreQui"), false);
    TextBoxEnable($("#NumMasaEntre"), false);
    TextBoxReadOnly($("#ArticuloSugerido"), false);
    $("#TxtOpcSelec").val($("#TxtOpcSelec").data("name")); //campo nombre del color, base o tecnica.
    //idBra = $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit",""); //idBra: almacena el idestacion
    //Te = $("#TxtOpcSelec").data("Formulacion"); //Te: guarda el tipo de formulación a configurar (Color,Tenica,Base)

    $("#ArticuloSugerido").val("");
    if ($("#TxtOpcSelec").data().Formulacion === "TECNICA")
        fn_TecnicasArticuloSugerido($("#ArticuloSugerido"), maq[0].IdSeteo, $("#TxtOpcSelec").data().IdRequerimientoTecnica);

    EstacionBra = fn_Estaciones(maq[0].IdSeteo, $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""));
    xIdSeteoMq = EstacionBra === null ? 0 : maq[0].IdSeteo;

    var grid = $("#gridEstacionMq_C").data("kendoGrid");
    grid.dataSource.data([]);
    kendo.ui.progress($("#MEstacionColor"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo + "/" + $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""),
        type: 'GET',
        success: function (datos) {
            if (datos !== null) {
                $("#SeccionColor_1").removeAttr("hidden");
                $("#SeccionColor_2").removeClass('col-lg-12');
                $("#SeccionColor_2").addClass('col-lg-9');
                $("#MEstacionColor").data("kendoWindow").center();
                grid.dataSource.read().then(function () {
                    var items = grid.items();
                    items.each(function (idx, row) {
                        var dataItem = grid.dataItem(row);
                        if (dataItem[grid.dataSource.options.schema.model.id] === Number($("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", ""))) {
                            grid.select(row);
                        }
                    });
                });

            } else {
                $("#SeccionColor_1").attr("hidden", true);
                $("#SeccionColor_2").removeClass('col-lg-9');
                $("#SeccionColor_2").addClass('col-lg-12');
                $("#MEstacionColor").data("kendoWindow").center();
                fn_Consultar_EC(grid);
            }
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    

};

//// funciones

var fn_Consultar_EC = function (g) {
  
    var SelItem = g.dataItem(g.select());
    //xidEstacion = SelItem === null ? 0 : SelItem.IdEstacion;
    idBra = SelItem === null ? $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion === null ? $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion;
    Te = SelItem === null ? $("#TxtOpcSelec").data("Formulacion") : SelItem.IdTipoFormulacion === null ? $("#TxtOpcSelec").data("Formulacion") : SelItem.IdTipoFormulacion;
    KdoCmbSetValue($("#CmbIdTipoEstacion"), "MARCO");
    fn_DeshabilitarCamposMarco(true);
    Grid_HabilitaToolbar($("#TablaFormula"), false, false, false);
    setFor = null;
    estaMarco = null;
    EstaTintasFormula = null;

    if (InicioModalRT === 1 && Number(idBra) === Number($("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "")) || InicioModalRT === 0) {
        Grid_HabilitaToolbar($("#TablaFormula"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
        fn_GetMarcoFormulacion_EC(maq[0].IdSeteo, idBra);
        fn_EstacionesMarcos_EC(maq[0].IdSeteo, idBra);
        fn_TintasFormulaciones_EC(maq[0].IdSeteo, idBra);
        
        $("#MEstacionColor").data("kendoWindow").title("CONFIGURACIÓN ESTACIÓN #" + idBra);
        InicioModalRT = 0;
    }
};

var fn_GetMarcoFormulacion_EC = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMarcosFormulaciones/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionMarcosFormulacion(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        }
    });
};

var fn_SeccionMarcosFormulacion = function (datos) {
    setFor = datos;
    if (setFor !== null) {
        Arrastre_Nuevo = 0;
        switch (setFor.IdTipoFormulacion) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                KdoCmbSetValue($("#CmbTecnica_color"), setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_color"), vhb);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_color"), vhb);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), vhb);

                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Técnica');
                $("#TxtOpcSelec").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Base');
                $("#TxtOpcSelec").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                $("#ArticuloSugerido").val("");
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
        }

        $("#TxtFormulaSug").val(setFor.SugerenciaFormula);

        KdoCmbSetValue($("#CmbIdTipoEstacion"), setFor.IdTipoEstacion === undefined ? "" : setFor.IdTipoEstacion);
        $("#CmbIdTipoEstacion").data("kendoComboBox").trigger("change");
        fn_DeshabilitarCamposMarco($("#CmbIdTipoEstacion").data("kendoComboBox").dataItem().UtilizaMarco);

        $("#CmbQuimica_color").data("kendoComboBox").setDataSource(Fn_GetQuimicaFormula(xIdQuimicaCliente));
        KdoCmbSetValue($("#CmbQuimica_color"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);
        $("#CmbQuimica_color").data("kendoComboBox").trigger("change");

        $("#CmbTipoTinta_color").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));

        KdoCmbSetValue($("#CmbTipoTinta_color"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistemaPigmento_Color"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        KdoCmbSetValue($("#CmbBasePigmento_color"), setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento);

        KdoComboBoxEnable($("#CmbTipoTinta_color"), vhb !== false ? KdoCmbGetValue($("#CmbTipoTinta_color")) !== "" : false);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), vhb !== false ? KdoCmbGetValue($("#CmbSistemaPigmento_Color")) !== "" : false);
        KdoComboBoxEnable($("#CmbBasePigmento_color"), vhb !== false ? KdoCmbGetValue($("#CmbBasePigmento_color")) !== "" : false);

        //$("#FrmGenEColor").data("kendoValidator").validate();
        Kendo_CmbFocus($("#CmbQuimica_color"));

    }
    else {
        $("#TxtFormulaSug").val("");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), false);
     
        if ($("#CmbTipoTinta_color").data("kendoComboBox").dataSource.data().length === 0) {
            Arrastre_Nuevo = 0;
        } else {
            Arrastre_Nuevo = 1;
        }

        $("#CmbQuimica_color").data("kendoComboBox").setDataSource(Fn_GetQuimicaFormula(xIdQuimicaCliente));
        $("#CmbQuimica_color").data("kendoComboBox").search($("#CmbQuimica_color").data("kendoComboBox").value());
        $("#CmbQuimica_color").data("kendoComboBox").trigger("change");
        $("#CmbQuimica_color").data("kendoComboBox").close();

     

        switch (Te) {
            case "COLOR":
                KdoComboBoxEnable($("#CmbTecnica_color"), vhb);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_color"), vhb);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), vhb);
                break;
            case "TECNICA":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
            case "BASE":
                KdoCmbSetValue($("#CmbTecnica_color"), "");
                KdoComboBoxEnable($("#CmbTecnica_color"), false);
                KdoCmbSetValue($("#CmbBasePigmento_color"), "");
                KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
                KdoCmbSetValue($("#CmbSistemaPigmento_Color"), "");
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
                break;
        }

     
        Kendo_CmbFocus($("#CmbQuimica_color"));
   
    
    }

};

var fn_EstacionesMarcos_EC = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    $.ajax({
        url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            fn_SeccionEstacionMarcos(datos);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        }
    });
};

var fn_SeccionEstacionMarcos = function (datos) {
    estaMarco = datos;
    if (estaMarco !== null) {
        $("#NumCapilar").data("kendoNumericTextBox").value(estaMarco.Capilar);
        $("#EscurridorDureza").data("kendoNumericTextBox").value(estaMarco.Dureza);
        $("#NumPasadas").data("kendoNumericTextBox").value(estaMarco.NoPasadas);
        KdoCmbSetValue($("#CmbSedas_color"), estaMarco.IdSeda);
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), estaMarco.IdTipoEmulsion);
        xTxtLetra = estaMarco.Letra;
        xNumPeso_Mues = estaMarco.Peso;
        xCmdIdUnidadPeso_Mues = estaMarco.IdUnidadPeso;
        xAreaDis = estaMarco.Area;
        xIdUnidadAreaDis = estaMarco.IdUnidadArea;
        xNumResolucionDPI_Dis = estaMarco.ResolucionDPI;
        xNumLineajeLPI_Dis = estaMarco.LineajeLPI;
        xNumPixeles_Dis = estaMarco.Pixeles;
        xEstado = estaMarco.Estado;

    } else {
        xNumPeso_Mues = null;
        xCmdIdUnidadPeso_Mues = null;
        xAreaDis = null;
        xIdUnidadAreaDis = null;
        xNumResolucionDPI_Dis = null;
        xNumLineajeLPI_Dis = null;
        xNumPixeles_Dis = null;
        xTxtLetra = null;
        xEstado = null;
    }

};

var fn_EstacionesTintasFormulaDet_EC = function () {
    $("#TablaFormula").blur();
    $("#TablaFormula").data("kendoGrid").dataSource.read();
};

var fn_SeccionTitasFormulas = function (datos) {
    EstaTintasFormula = datos;
    if (EstaTintasFormula.length > 0) {
        $("#TxtIdform").val(EstaTintasFormula[0].IdFormula === "" ? 0 : EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre").val(EstaTintasFormula[0].MasaEntregada);
        //fn_MostraTablaFormula(EstaTintasFormula, "TablaFormula");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), true);

    } else {
        $("#TxtIdform").val(0);
        KdoButtonEnable($("#btnccc"), true);
        KdoButtonEnable($("#btnDelFT"), false);
        //fn_MostraTablaFormula(null, "TablaFormula");
        $("#NumMasaEntre").val(0);
    }
};

var fn_GuardarEstacionColor = function () {
    fn_GuardarEstacion(idBra);
};

var fn_GuardarEstaMarco = function (xIdBrazo) {

    let xIdTipoFormulacion;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    xIdTipoFormulacion = Te;
    let xType;
    let  xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');
    let xUrl;

    if (estaMarco === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/";
        xEstado = "SOLICITADO";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            Capilar: $("#NumCapilar").val(),
            IdEstacion: xIdBrazo,
            IdTipoFormulacion: xIdTipoFormulacion,
            IdSeda: KdoCmbGetValue($("#CmbSedas_color")),
            NoPasadas: $("#NumPasadas").val(),
            Dureza: $("#EscurridorDureza").val(),
            Angulo: null,
            Velocidad: null,
            Presion: null,
            Tension: null,
            OffContact: null,
            Letra: xTxtLetra,
            IdUsuarioMod:getUser(),
            FechaMod: xFecha,
            IdEscurridor: null,
            SerieMarco: null,
            IdTipoEmulsion: KdoCmbGetValue($("#CmbTipoEmulsion_color")),
            IdSeteo: maq[0].IdSeteo,
            Area: xAreaDis,
            IdUnidadArea: xIdUnidadAreaDis,
            Peso: xNumPeso_Mues,
            IdUnidadPeso: xCmdIdUnidadPeso_Mues,
            ResolucionDPI: xNumResolucionDPI_Dis,
            LineajeLPI: xNumLineajeLPI_Dis,
            Pixeles: xNumPixeles_Dis,
            Estado: xEstado

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let vIdtec = Te === "TECNICA" ? $("#TxtOpcSelec").data("IdRequerimientoTecnica") : Te === "COLOR" ? KdoCmbGetValue($("#CmbTecnica_color")) : null;
            let vIdBase = Te === "BASE" ? $("#TxtOpcSelec").data("IdBase") : null;

            fn_GuardarMarcoFormu(xIdBrazo, Te === "COLOR" ? $("#TxtOpcSelec").data("IdRequerimientoColor") : null, vIdtec, vIdBase);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor").data("kendoWindow").element, false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormu = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase ) {
    let xType;
    let xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');
    let xUrl;

    if (setFor===null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMarcosFormulaciones/" + maq[0].IdSeteo +"/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdSeteo: maq[0].IdSeteo,
            IdEstacion: xIdBrazo,
            IdBase: xidBase,
            IdRequerimientoTecnica: xidRequerimientoTecnica,
            IdRequerimientoColor: xidRequerimientoColor,
            SugerenciaFormula: $("#TxtFormulaSug").val(),
            IdSistemasTinta:null,
            IdUsuarioMod: getUser(),
            FechaMod: xFecha,
            IdSistemaPigmento: KdoCmbGetValue($("#CmbSistemaPigmento_Color")),
            IdBasePigmento: KdoCmbGetValue($("#CmbBasePigmento_color")),
            IdTipoTinta: KdoCmbGetValue($("#CmbTipoTinta_color")),
            IdQuimica: KdoCmbGetValue($("#CmbQuimica_color"))
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
         
            if ($("#gridEstacionMq_C").data("kendoGrid").dataSource.total() === 0) {
                $("#MEstacionColor").data("kendoWindow").close();
            }
            else {
                fn_TintasFormulaciones_EC(maq[0].IdSeteo, xIdBrazo);
            }
            RequestEndMsg(data, xType);
            maq = fn_GetMaquinas();
            $("#maquinaRevTec").data("maquinaSerigrafia").cargarDataMaquina(maq);
            fn_ObtCntMaxEstaciones();
            kendo.ui.progress($("#MEstacionColor").data("kendoWindow").element, false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor").data("kendoWindow").element, false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarEstacion = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionColor").data("kendoWindow").element, true);
    let xType;
    let xUrl;
   
    if (EstacionBra === null) {
        xType = "Post";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstaciones/";
    } else {
        xType = "Put";
        xUrl = TSM_Web_APi + "SeteoMaquinasEstaciones/" + maq[0].IdSeteo + "/" + xIdBrazo;
    }

    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdEstacion: xIdBrazo,
            IdSeteo: maq[0].IdSeteo,
            IdTipoEstacion: KdoCmbGetValue($("#CmbIdTipoEstacion")),
            IdAccesorio:null
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            KdoButtonEnable($("#btnccc"), true);
            fn_GuardarEstaMarco(xIdBrazo);
            fn_ObtCntMaxEstaciones($("#AlertaEstacion"));
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor").data("kendoWindow").element, false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarEstacionFormula = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let xType = "Post";
    let xUrl;
    xUrl = TSM_Web_APi + "TintasFormulaciones/InsTintasFormulacion_His";
    $.ajax({
        url: xUrl,
        type: xType,
        data: JSON.stringify({
            IdFormula: 0,
            IdSeteo: maq[0].IdSeteo,
            IdEstacion: xIdBrazo,
            CodigoColor: xCodigoColor
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#TxtIdform").val(data[0].IdFormula);
            EstacionBra = fn_Estaciones(maq[0].IdSeteo, xIdBrazo);
            fn_EstacionesTintasFormulaDet_EC();
            //$("#NumMasaEntre").val(EstaTintasFormula[0].MasaEntregada);
            KdoButtonEnable($("#btnccc"), false);
            KdoButtonEnable($("#btnDelFT"), true);
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

var fn_DelFormulaHis = function () {
    kendo.ui.progress($("#MEstacionColor"), true);
    let xType = "Delete";
    let xUrl;
    xUrl = TSM_Web_APi + "TintasFormulaciones/" + $("#TxtIdform").val();
    $.ajax({
        url: xUrl,
        type: xType,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#TxtIdform").val(0);
            $("#NumMasaEntre").val(0);
            KdoButtonEnable($("#btnccc"), true);
            KdoButtonEnable($("#btnDelFT"), false);
            RequestEndMsg(data, xType);
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

let fn_DeshabilitarCamposMarco = function (utilizaMarco) {
    let habilitarMarco = utilizaMarco;
    let AplicaSeda = Te === "TECNICA" ? !(tecnicasFlags.find(q => q.IdRequerimientoTecnica === $("#TxtOpcSelec").data().IdRequerimientoTecnica && q.AplicaSeda === true) === undefined) && habilitarMarco === true : habilitarMarco;
    let AplicaCapilar = Te === "TECNICA" ? !(tecnicasFlags.find(q => q.IdRequerimientoTecnica === $("#TxtOpcSelec").data().IdRequerimientoTecnica && q.AplicaCapilar === true) === undefined) && habilitarMarco === true : habilitarMarco;
    KdoComboBoxEnable($("#CmbSedas_color"), vhb !== false ? AplicaSeda : false);
    KdoComboBoxEnable($("#CmbTipoEmulsion_color"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#NumCapilar"), vhb !== false ? AplicaCapilar : false);
    KdoNumerictextboxEnable($("#NumPasadas"), vhb !== false ? habilitarMarco : false);
    KdoNumerictextboxEnable($("#EscurridorDureza"), vhb !== false ? habilitarMarco : false);

    if (!habilitarMarco) {
        KdoCmbSetValue($("#CmbSedas_color"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), "");
        kdoNumericSetValue($("#NumCapilar"), 0);
        kdoNumericSetValue($("#NumPasadas"), 0);
        kdoNumericSetValue($("#EscurridorDureza"), 0);
    }

    if (vhb === false) {
        KdoComboBoxEnable($("#CmbIdTipoEstacion"), false);
        KdoButtonEnable($("#btnAddMCE"), false);
        KdoComboBoxEnable($("#CmbQuimica_color"), false);
        KdoComboBoxEnable($("#CmbTipoTinta_color"), false);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), false);
        KdoComboBoxEnable($("#CmbBasePigmento_color"), false);
        TextBoxEnable($("#TxtFormulaSug"), false);
        KdoComboBoxEnable($("#CmbTecnica_color"), false);
        Grid_HabilitaToolbar($("#TablaFormula"), false, false, false);
    } else {
        KdoComboBoxEnable($("#CmbIdTipoEstacion"), true);
        KdoButtonEnable($("#btnAddMCE"), true);
        KdoComboBoxEnable($("#CmbQuimica_color"), true);
        KdoComboBoxEnable($("#CmbTipoTinta_color"), true);
        KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), true);
        KdoComboBoxEnable($("#CmbBasePigmento_color"), true);
        TextBoxEnable($("#TxtFormulaSug"), true);
        KdoComboBoxEnable($("#CmbTecnica_color"), true);
        Grid_HabilitaToolbar($("#TablaFormula"), false, false, false);
    }
};

fn_PWList.push(fn_VistaEstacionColor);
fn_PWConfList.push(fn_VistaEstacionColorDocuReady);

let fn_TintasFormulaciones_EC = function (_idSeteo,_idBrazo) {
    $.ajax({
        url: TSM_Web_APi + "TintasFormulaciones/GetbySeteoEstacion/" + _idSeteo + "/" + _idBrazo,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data && data.length > 0) {
                $("#TxtIdform").val(data[0].IdFormula);
                Grid_HabilitaToolbar($("#TablaFormula"), vhb !== false ? Permisos.SNAgregar : false, vhb !== false ? Permisos.SNEditar : false, vhb !== false ? Permisos.SNBorrar : false);
            }
            else {
                $("#TxtIdform").val(0);
                Grid_HabilitaToolbar($("#TablaFormula"), false, false, false);
            }
            fn_EstacionesTintasFormulaDet_EC();
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });
};

var fn_GridEstacionesColor = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteo/" + xIdSeteoMq; },
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
                    CodigoPantone: {
                        type: "string"
                    },
                    IgualarColor: {
                        type: "string"
                    }

                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
        },
        columns: [
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50 },
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Descripción", minResizableWidth: 120 },
            { field: "CodigoPantone", title: "Pantone", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "IgualarColor", title: "Igualar a:", minResizableWidth: 120 }
         
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si, 550);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
        fn_Consultar_EC(gd.data("kendoGrid"));

    });
};