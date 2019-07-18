


var fn_VistaEstacionColor = function () {
    InicioColor = true;
    TextBoxEnable($("#TxtOpcSelec"), false);
    KdoButton($("#btnAddMCE"), "check", "Agregar");
    let UrlTT = TSM_Web_APi + "Servicios";
    Kendo_CmbFiltrarGrid($("#CmbTipoTinta_color"), UrlTT, "Nombre", "IdServicio", "Seleccione un tipo tintas ....");

    let UrlST = TSM_Web_APi + "Servicios";
    Kendo_CmbFiltrarGrid($("#CmbSistema_color"), UrlST, "Nombre", "IdServicio", "Seleccione un sitema tintas ....");


    let UrlSed = TSM_Web_APi + "Servicios";
    Kendo_CmbFiltrarGrid($("#CmbSedas_color"), UrlSed, "Nombre", "IdServicio", "Seleccione un sitema tintas ....");

    $("#NumPasadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });

    $("#NumCapilar").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    let frmColor = $("#FrmGenEColor").kendoValidator({
        rules: {
            vST: function (input) {
                if (input.is("[id='CmbSistema_color']")) {
                    return $("#CmbSistema_color").data("kendoComboBox").selectedIndex >= 0;
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
                if (input.is("[id='CmbTipoTinta_color']")) {
                    return $("#CmbTipoTinta_color").data("kendoComboBox").selectedIndex >= 0;
                }
                return true;
            }
            //MsgCombo: function (input) {
            //    if (input.is("[name='Combo']") && Kendo_CmbGetvalue($("#IdServicio")) === "1") {
            //        return $("#Combo").data("kendoNumericTextBox").value() > 0;
            //    }
            //    return true;
            //}
        },
        messages: {
            vST: "Requerido",
            vTT: "Requerido",
            vTSed: "Requerido"
        }
    }).data("kendoValidator");


    $("#btnAddMCE").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        if (frmColor.validate()) {
            fn_GuardarEstacionColor();
           
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

        //ConfirmacionMsg("¿Esta seguro de guardar la información en la estación?", function () { return $("#MEstacionColores").modal('hide'); });
    });


};


//// funciones
let fn_GuardarEstacionColor = function () {

    var idBra = $("#TxtOpcSelec").data("IdBrazo");
    var a = stage.find("#" + idBra);

    a.text($("#TxtOpcSelec").val());
    

    layer.draw();

    $("#MEstacionColor").modal('hide');

};

fn_PWList.push(fn_VistaEstacionColor);