﻿
var fn_VistaEstacionColorDocuReady = function () {
    KdoButton($("#btnccc"), "search", "Buscar en formula historicas..");
    KdoButtonEnable($("#btnccc"), false);
    KdoButton($("#btnDelFT"), "delete", "Borrar formula..");
    KdoButtonEnable($("#btnDelFT"), false);

    KdoButton($("#btnAddMCE"), "check", "Agregar");

    $("#EscurridorDureza").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumPasadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0

    });
    $("#NumCapilar").kendoNumericTextBox({
        min: 0,
        max: 4000,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0,
        step: 50

    });

    Kendo_CmbFiltrarGrid($("#CmbIdTipoEstacion"), TSM_Web_APi + "TipoEstaciones/GetTipoEstacionesSinAccesorios", "Nombre", "IdTipoEstacion", "Seleccione ...");    

    Kendo_CmbFiltrarGrid($("#CmbQuimica_color"), TSM_Web_APi + "Quimicas", "Nombre", "IdQuimica", "Seleccione ...");
        
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
            vbmez: "Requerido"
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
        KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), true);
        KdoComboBoxEnable($("#CmbBasePigmento_color"), true);
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
        let idQ = e.dataItem.IdQuimica;
        KdoCmbSetValue($("#CmbTipoTinta_color"), "");
        $("#CmbTipoTinta_color").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(idQ));
    });

    fn_GridEstacionesColor($("#gridEstacionMq_C"));
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
    //setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra); //obtener informacion de la entidad SeteoMarcos Formulaciones por seteo y estación
    //estaMarco = fn_EstacionesMarcos(maq[0].IdSeteo, idBra);
    //EstacionBra = fn_Estaciones(maq[0].IdSeteo, idBra);
    //EstaTintasFormula = fn_EstacionesTintasFormulaDet(maq[0].IdSeteo, idBra, "CREADA");
    //if (EstacionBra === null) {
    //    fn_SeccionMarcosFormulacion(null);
    //    fn_SeccionEstacionMarcos(null);
    //    fn_SeccionTitasFormulas(null);
    //}

};

//// funciones

var fn_Consultar_EC = function (g) {
  
    var SelItem = g.dataItem(g.select());
    //xidEstacion = SelItem === null ? 0 : SelItem.IdEstacion;
    idBra = SelItem === null ? $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion === null ? $("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "") : SelItem.IdEstacion;
    Te = SelItem === null ? $("#TxtOpcSelec").data("Formulacion") : SelItem.IdTipoFormulacion === null ? $("#TxtOpcSelec").data("Formulacion") : SelItem.IdTipoFormulacion;
    KdoCmbSetValue($("#CmbIdTipoEstacion"), "MARCO");
    fn_DeshabilitarCamposMarco(true);
    setFor = null;
    estaMarco = null;
    EstaTintasFormula = null;

    if (InicioModalRT === 1 && Number(idBra) === Number($("#TxtOpcSelec").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "")) || InicioModalRT === 0) {
        fn_GetMarcoFormulacion_EC(maq[0].IdSeteo, idBra);
        fn_EstacionesMarcos_EC(maq[0].IdSeteo, idBra);
        fn_EstacionesTintasFormulaDet_EC(maq[0].IdSeteo, idBra);

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
        switch (setFor.IdTipoFormulacion) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelec").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelec"]').text('Nombre de Color');
                $("#TxtOpcSelec").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                KdoCmbSetValue($("#CmbTecnica_color"), setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                fn_TecnicasArticuloSugerido($("#ArticuloSugerido"), maq[0].IdSeteo, setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                KdoComboBoxEnable($("#CmbTecnica_color"), true);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_color"), true);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), true);

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

        KdoCmbSetValue($("#CmbQuimica_color"), setFor.IdQuimica === undefined ? xIdQuimica : setFor.IdQuimica);

        $("#CmbTipoTinta_color").data("kendoComboBox").setDataSource(Fn_GetTiposTintas(setFor.IdQuimica === undefined ? "" : setFor.IdQuimica));
        $("#CmbBasePigmento_color").data("kendoComboBox").setDataSource(Fn_GetSistemaBases(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));
        $("#CmbSistemaPigmento_Color").data("kendoComboBox").setDataSource(Fn_GetSistemaPigmentos(setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta));

        KdoCmbSetValue($("#CmbTipoTinta_color"), setFor.IdTipoTinta === undefined ? "" : setFor.IdTipoTinta);
        KdoCmbSetValue($("#CmbSistemaPigmento_Color"), setFor.IdSistemaPigmento === undefined ? "" : setFor.IdSistemaPigmento);
        KdoCmbSetValue($("#CmbBasePigmento_color"), setFor.IdBasePigmento === undefined ? "" : setFor.IdBasePigmento);

        KdoComboBoxEnable($("#CmbTipoTinta_color"), KdoCmbGetValue($("#CmbTipoTinta_color")) !== "");
        KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), KdoCmbGetValue($("#CmbSistemaPigmento_Color")) !== "");
        KdoComboBoxEnable($("#CmbBasePigmento_color"), KdoCmbGetValue($("#CmbBasePigmento_color")) !== "");

        //$("#FrmGenEColor").data("kendoValidator").validate();
        Kendo_CmbFocus($("#CmbQuimica_color"));
    }
    else {
        $("#TxtFormulaSug").val("");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), false);
        switch (Te) {
            case "COLOR":
                KdoComboBoxEnable($("#CmbTecnica_color"), true);
                $("#CmbTecnica_color").data("kendoComboBox").dataSource.read();
                KdoComboBoxEnable($("#CmbBasePigmento_color"), true);
                KdoComboBoxEnable($("#CmbSistemaPigmento_Color"), true);
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

var fn_EstacionesTintasFormulaDet_EC = function (xIdSeteo, xIdestacion) {
    kendo.ui.progress($("#MEstacionColor"), true);
    $.ajax({
        url: TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdSeteoIdEstacion/" + xIdSeteo + "/" + xIdestacion,
        //async: false,
        type: 'GET',
        success: function (datos) {
            var filtro = [];
            var data = JSON.parse(JSON.stringify(datos), function (key, value) {
                if (value !== null) {
                    if (value.Estado === "CREADA") filtro.push(value);

                }
                return value;
            });

            if (filtro.length === 0) {
                JSON.parse(JSON.stringify(datos), function (key, value) {
                    if (value !== null) {
                        if (value.Estado === "VIGENTE") filtro.push(value);

                    }
                    return value;
                });
            }
           
            fn_SeccionTitasFormulas(filtro);
           
        },
        complete: function () {
            kendo.ui.progress($("#MEstacionColor"), false);
        }
    });
};

var fn_SeccionTitasFormulas = function (datos) {
    EstaTintasFormula = datos;
    if (EstaTintasFormula.length > 0) {
        $("#TxtIdform").val(EstaTintasFormula[0].IdFormula);
        $("#NumMasaEntre").val(EstaTintasFormula[0].MasaEntregada);
        fn_MostraTablaFormula(EstaTintasFormula, "TablaFormula");
        KdoButtonEnable($("#btnccc"), false);
        KdoButtonEnable($("#btnDelFT"), true);

    } else {
        $("#TxtIdform").val(0);
        KdoButtonEnable($("#btnccc"), true);
        KdoButtonEnable($("#btnDelFT"), false);
        fn_MostraTablaFormula(null, "TablaFormula");
        $("#NumMasaEntre").val(0);
    }
};

var fn_GuardarEstacionColor = function () {

    fn_GuardarEstacion(idBra);
    var a = stage.find("#TxtInfo" + idBra);
    a.text($("#TxtOpcSelec").val());
    var b = stage.find("#brazo" + idBra);
    b.IdSeteo = maq[0].IdSeteo;
    b.IdTipoFormulacion = Te;
     //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    layer.draw();
};

var fn_GuardarEstaMarco = function (xIdBrazo) {

    kendo.ui.progress($("#MEstacionColor"), true);
    let xIdTipoFormulacion;
    //Te contiene una tipologia de la estacion que se usa en este codigo "COLOR", "TECNICA" ,"BASE", "ACCESORIO"
    xIdTipoFormulacion = Te;
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

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
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarMarcoFormu = function (xIdBrazo, xidRequerimientoColor, xidRequerimientoTecnica, xidBase ) {
    kendo.ui.progress($("#MEstacionColor"), true);
    var xType;
    var xFecha = kendo.toString(kendo.parseDate($("#TxtFecha").val()), 's');

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
            maq = fn_GetMaquinas();
          
            if ($("#gridEstacionMq_C").data("kendoGrid").dataSource.total() === 0) {
                fn_MostraTablaFormula(null, "TablaFormula");
                $("#MEstacionColor").data("kendoWindow").close();
              
            }
            RequestEndMsg(data, xType);
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarEstacion = function (xIdBrazo) {
    kendo.ui.progress($("#MEstacionColor"), true);
    var xType;
   
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
        },
        error: function (data) {
            kendo.ui.progress($("#MEstacionColor"), false);
            ErrorMsg(data);
        }
    });

};

var fn_GuardarEstacionFormula = function (xIdBrazo, xCodigoColor) {
    kendo.ui.progress($("#MEstacionColor"), true);
    let xType = "Post";
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
            fn_EstacionesTintasFormulaDet_EC(maq[0].IdSeteo, xIdBrazo);
            //fn_MostraTablaFormula(EstaTintasFormula,"TablaFormula");
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
            fn_MostraTablaFormula(null,"TablaFormula");
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

    KdoComboBoxEnable($("#CmbSedas_color"), habilitarMarco);
    KdoComboBoxEnable($("#CmbTipoEmulsion_color"), habilitarMarco);
    KdoNumerictextboxEnable($("#NumCapilar"), habilitarMarco);
    KdoNumerictextboxEnable($("#NumPasadas"), habilitarMarco);
    KdoNumerictextboxEnable($("#EscurridorDureza"), habilitarMarco);

    if (!habilitarMarco) {
        KdoCmbSetValue($("#CmbSedas_color"), "");
        KdoCmbSetValue($("#CmbTipoEmulsion_color"), "");
        kdoNumericSetValue($("#NumCapilar"), 0);
        kdoNumericSetValue($("#NumPasadas"), 0);
        kdoNumericSetValue($("#EscurridorDureza"), 0);
    }
};

fn_PWList.push(fn_VistaEstacionColor);
fn_PWConfList.push(fn_VistaEstacionColorDocuReady);


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
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120 }
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