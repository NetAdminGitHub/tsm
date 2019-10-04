﻿let xidEstacion;
var vidForm = 0;
var fn_VistaEstacionFormulasDocuReady = function () {
    KdoButton($("#btnAddMForE"), "check", "Guardar");
    KdoButton($("#btnAddMFAjus"), "check", "Guardar");
    KdoButton($("#btnAddMFAjuste"), "gear", "Ajuste");
    KdoButton($("#btnAddMFEditar"), "edit", "Editar");
    KdoButton($("#btnAddMFAHistori"), "search", "Formulas Historica");
    KdoButton($("#btnAcepAjuste"), "check", "Aceptar");
    kdoRbSetValue($("#rbAjuste"), true);

    $("#NumCntRecibida").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#TxtNombreQuiForm").val(NombreQui);

    xidEstacion = 0;
    fn_gridFormulas($("#gridFormulas"));
    fn_gridMateriaPrima($("#gridFormulasMP"));
    fn_gridAjustePrima($("#gridFormulasAjusMP"));

    $("#MbtnAjuste").kendoDialog({
        height: "auto",
        width: "60%",
        title: "Crear Ajuste",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
        //show: onShow
        //initOpen: onInitOpen,
        //open: onOpen,
        //close: onClose
        //show: onShow,
        //hide: onHide

    });
    $("#MbtnEditForm").kendoDialog({
        height: "auto",
        width: "60%",
        title: "Ajuste de formulas",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900,
        //actions: [
        //    { text: '<span class="k-icon k-i-check"></span>&nbspAceptar', primary: true },
        //    { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }

        //],
        //show: onShow
        //initOpen: onInitOpen,
        //open: onOpen,
        close: fn_EditClose
        //show: onShow,
        //hide: onHide

    });

    $("#btnAddMFEditar").bind("click", function () {
        $("#gridFormulasAjusMP").data("kendoGrid").dataSource.read();
        $("#MbtnEditForm").data("kendoDialog").open();
    });

    $("#btnAddMFAjuste").bind("click", function () {
        kdoNumericSetValue($("#NumCntRecibida"), 0.00);
        KdoCmbSetValue($("#CmbMotivoAjus"), "");
        kdoRbSetValue($("#rbAjuste"), true);
        KdoNumerictextboxEnable($("#NumCntRecibida"),true);
        $("#MbtnAjuste").data("kendoDialog").open();
        $("#NumCntRecibida").data("kendoNumericTextBox").focus();
        frmNajus.hideMessages();
    });

    let urtMo = TSM_Web_APi + "MotivosAjustesTintas";
    Kendo_CmbFiltrarGrid($("#CmbMotivoAjus"), urtMo, "Nombre", "IdMotivo", "Seleccione un motivo de ajuste ....");

    let frmNajus = $("#FrmNuevoAjuste").kendoValidator({
        rules: {
            vcnt: function (input) {
                if (input.is("[id='NumCntRecibida']") && KdoRbGetValue($("#rbAjuste")) === true) {
                    return kdoNumericGetValue($("#NumCntRecibida")) > 0;
                }
                return true;
            },
            vMtAjus: function (input) {
                if (input.is("[id='CmbMotivoAjus']")) {
                    return $("#CmbMotivoAjus").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
        },
        messages: {
            vcnt: "Cantidad recibida debe ser mayor a 0",
            vMtAjus: "Requerido"
        }
    }).data("kendoValidator");

    $("#btnAcepAjuste").bind("click", function (e) {
        e.preventDefault();
        if (frmNajus.validate()) {
            fn_Ajuste();

        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar la cantidad devuelta", "error");
        }

    });

    $("#rbAjusteLimpio").click(function () {
        KdoNumerictextboxEnable($("#NumCntRecibida"), false);
        kdoNumericSetValue($("#NumCntRecibida"), 0.00);
        KdoCmbFocus($("#CmbMotivoAjus"));
        frmNajus.hideMessages();

    });

    $("#rbAjuste").click(function () {
        KdoNumerictextboxEnable($("#NumCntRecibida"), true);
        $("#NumCntRecibida").data("kendoNumericTextBox").focus();
        frmNajus.hideMessages();
    });

};

var fn_VistaEstacionFormulas = function () {
    $("#gridFormulas").data("kendoGrid").dataSource.data([]);
    $("#gridFormulasMP").data("kendoGrid").dataSource.data([]);
    TextBoxEnable($("#TxtOpcSelecFormulas"), false);
    TextBoxEnable($("#TxtNombreQuiForm"), false);
    TextBoxEnable($("#TxtFormulaSugTint"), false);
    $("#TxtOpcSelecFormulas").val($("#TxtOpcSelecFormulas").data("name"));
    xidEstacion = $("#TxtOpcSelecFormulas").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    Te = $("#TxtOpcSelecFormulas").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, xidEstacion);
    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Color');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Técnica');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Base');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                break;
        }
        $("#TxtFormulaSugTint").val(setFor.SugerenciaFormula);
    }
    $("#gridFormulas").data("kendoGrid").dataSource.read();


};
let fn_EditClose = function () {
    $("#gridFormulasMP").data("kendoGrid").dataSource.read();
};
var fn_gridFormulas = function (gd) {

    var dsFormulas = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulaciones/GetbySeteoEstacion/" + maq[0].IdSeteo + "/" + xidEstacion; },
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
                    IdFormula: {
                        type: "number"
                    },
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    Fecha: {
                        type: "date"
                    },
                    MasaEntregada: {
                        type: "number"
                    },
                    MasaDevuelta: {
                        type: "number"
                    },
                    C1: {
                        type: "number" // total = Masadevuelta + MasaEntregada
                    },
                    IdMotivo: {
                        type: "number"
                    },
                    Nombre: {
                        type: "string"
                    },
                    Estado: {
                        type: "string"
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
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }     
    });

    let Urltec = TSM_Web_APi + "Tecnicas";
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "Código. Formula", hidden: true  },
            { field: "IdSeteo", title: "Código. IdSeteo", hidden: true  },
            { field: "IdEstacion", title: "N° Estacion", hidden: true },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" },
            { field: "MasaEntregada", title: "Masa Entregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}"},
            { field: "MasaDevuelta", title: "Masa Devuelta", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}"},
            { field: "C1", title: "Masa Total", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}" },
            { field: "IdMotivo", title: "Motivo", hidden:true },
            { field: "Nombre", title: "Nombre Motivo" },
            { field: "Estado", title: "Estado", hidden: true  },
            { field: "Nombre1", title: "Estado" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true}
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si,250);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsFormulas);
    var srow2 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow2);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow2);
        fn_consultarFormulaDet(gd);
    });
};

var fn_gridMateriaPrima = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + vidForm; },
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
                    IdFormula: {
                        type: "number"
                    },
                    Item: {
                        type: "number"
                    },
                    IdArticulo: {
                        type: "string"

                    },
                    Nombre: {
                        type: "string"

                    },
                    MasaInicial: {
                        type: "number"

                    },
                    PorcentajeInicial: {
                        type: "number"

                    },
                    MasaFinal: {
                        type: "number"

                    },
                    PorcentajeFinal: {
                        type: "number"

                    },
                    IdUsuarioMod: {
                        type: "string"
                    },
                    FechaMod: {
                        type: "date"
                    }
                }
            }
        },
        aggregate: [
            { field: "PorcentajeInicial", aggregate: "sum" },
            { field: "MasaInicial", aggregate: "sum" },
            { field: "MasaFinal", aggregate: "sum" },
            { field: "PorcentajeFinal", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "Código. Formula", hidden: true },
            { field: "Item", title: "Item", hidden: true },
            { field: "IdArticulo", title: "Articulo"},
            { field: "Nombre", title: "Nombre"},
            { field: "MasaInicial", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Inicial: #: data.MasaInicial ? sum : 0 #", hidden: true},
            { field: "PorcentajeInicial", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeInicial ? sum*100: 0 # %", hidden: true },
            { field: "MasaFinal", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Final: #: data.MasaFinal ? sum : 0 #"},
            { field: "PorcentajeFinal", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeFinal ? sum*100: 0 # %" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, true, redimensionable.Si,250);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), false, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });

   

};
let  fn_consultarFormulaDet = function (gridcab) {
    vidForm = fn_getIdFormula(gridcab.data("kendoGrid"));
    $("#gridFormulasMP").data("kendoGrid").dataSource.read();
};

let fn_getIdFormula = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdFormula;

};

let fn_Ajuste = function () {
    kendo.ui.progress($(document.body), true);
        $.ajax({
            url: TSM_Web_APi + "TintasFormulaciones/Ajustar/" + maq[0].IdSeteo + "/" + xidEstacion + "/" + kdoNumericGetValue($("#NumCntRecibida")) + "/" + (KdoRbGetValue($("#rbAjusteLimpio"))===true ? "1" : "0") + "/" + KdoCmbGetValue($("#CmbMotivoAjus")),
            type: "Post",
            dataType: "json",
            data: JSON.stringify({ id: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#gridFormulas").data("kendoGrid").dataSource.read();
                kendo.ui.progress($(document.body), false);
                $("#MbtnAjuste").data("kendoDialog").close();
                RequestEndMsg(data, "Post");
            },
            error: function (data) {
                kendo.ui.progress($(document.body), false);
                ErrorMsg(data);
            }
        });
};

var fn_gridAjustePrima = function (gd) {

    var dsAjusMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (data) { return TSM_Web_APi + "TintasFormulacionesDetalles/GetbyIdFormula/" + fn_getIdFormula($("#gridFormulas").data("kendoGrid")); },
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
                            return fn_getIdFormula($("#gridFormulas").data("kendoGrid"));
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
                                    return $("#IdArticulo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Nombre: {
                        type: "string"
                    },
                    MasaInicial: {
                        type: "number"
                    },
                    PorcentajeInicial: {
                        type: "number"
                    },
                    MasaAgregada: {
                        type: "number"
                    },
                    PorcentajeAgregado: {
                        type: "number"
                    },
                    MasaFinal: {
                        type: "number"
                    },
                    PorcentajeFinal: {
                        type: "number"
                    }
                }
            }
        },
        aggregate: [
            { field: "MasaInicial", aggregate: "sum" },
            { field: "PorcentajeInicial", aggregate: "sum" },
            { field: "PorcentajeAgregado", aggregate: "sum" },
            { field: "MasaAgregada", aggregate: "sum" },
            { field: "PorcentajeFinal", aggregate: "sum" },
            { field: "MasaFinal", aggregate: "sum" }
        ],
        requestEnd: function (e) {
            if ((e.type === "create" || e.type === "update" || e.type === "destroy") && e.response) e.sender.read();
            Grid_requestEnd(e);
        }
    });

    let UrlARt = TSM_Web_APi + "Articulos";
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "IdFormula");
            Grid_Focus(e, "IdArticulo");
            $('[name="PorcentajeInicial"]').data("kendoNumericTextBox").enable(false);
            $('[name="MasaInicial"]').data("kendoNumericTextBox").enable(false);
            $('[name="MasaFinal"]').data("kendoNumericTextBox").enable(false);
            $('[name="PorcentajeFinal"]').data("kendoNumericTextBox").enable(false);

            $('[name="MasaAgregada"]').on("change", function (e) {
                let xMasaInicial = $('[name="MasaInicial"]').data("kendoNumericTextBox").value();
                let xMasaAgregada = this.value;

                $('[name="MasaFinal"]').data("kendoNumericTextBox").value(parseFloat(xMasaInicial) + parseFloat(xMasaAgregada));
                $('[name="MasaFinal"]').data("kendoNumericTextBox").trigger("change");
                //$('[name="PrecioVenta"]').data("kendoNumericTextBox").trigger("change");
            });
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdFormula", title: "Código. Formula", hidden: true },
            { field: "IdArticulo", title: "Materia Prima", values: ["IdArticulo", "Nombre", UrlARt, "", "Seleccione....", "required", "", "Requerido"], editor: Grid_Combox},
            { field: "Nombre", title: "Nombre" },
            { field: "MasaInicial", title: "Masa Inicial", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}", footerTemplate: "Inicial: #: data.MasaInicial ? sum : 0 #"},
            { field: "PorcentajeInicial", title: "Porcentaje Inicial", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeInicial ? sum*100: 0 # %" },
            { field: "MasaAgregada", title: "Masa Agregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}",footerTemplate: "Agregada: #: data.MasaAgregada ? sum : 0 #"},
            { field: "PorcentajeAgregado", title: "% Agregado", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeAgregado ? sum*100: 0 # %" },
            { field: "MasaFinal", title: "Masa Final", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2], format: "{0:n2}",footerTemplate: "Final: #: data.MasaFinal ? sum : 0 #"},
            { field: "PorcentajeFinal", title: "% Final", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "#: data.PorcentajeFinal ? sum*100: 0 # %" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsAjusMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });

};
fn_PWList.push(fn_VistaEstacionFormulas);
fn_PWConfList.push(fn_VistaEstacionFormulasDocuReady);