
'use strict'
let pJsonCP = "";

var fn_Ini_StatusOrdenDespacho = (xjson) => {
    pJsonCP = xjson;

    KdoButton($("#btnGenerarUnidad"), "save", "Generar Unidad de Embalaje");


}

var fn_Reg_StatusOrdenDespacho = (xjson) => {
    pJsonCP = xjson;

}
