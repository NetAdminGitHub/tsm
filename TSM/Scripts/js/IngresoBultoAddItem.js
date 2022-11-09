let  xIngresoBultoAdd = 0;

let fn_Ini_IngresoBultoAddItem = (IngresoBultoAdd) => {
    xIngresoBultoAdd = IngresoBultoAdd;

    // crear realizar
    KdoButton($("#btn_GuardarAddItem"), "check-outline", "Guardar Registro");

    $("#num_Peso").kendoNumericTextBox({
        size: "large",
        min: 0,
        max:  9999999.99,
        format: "{0:n2}",
        restrictDecimals:false ,
        decimals: 2 ,
        value: 0
    });
    $("#num_Cuantia").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 9999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#num_Valor").kendoNumericTextBox({
        size: "large",
        min: 0,
        max: 9999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#txt_Item").focus();
};

let fn_Reg_IngresoBultoAddItem = (IngresoBultoAdd) => {
    xIngresoBultoAdd = IngresoBultoAdd;
    $("#txt_Item").focus();

};