let xCliente = 0;
let xPlanta = 0;

$(document).ready(function () {

    KdoButton($("#btnEtapa"), "gear");
    KdoButton($("#btnRetornar"), "arrow-left", "Regresar");
    KdoButton($("#btnCrearPL"), "plus-outline", "Crear Lista de Empaque");

    $("#dfDespacho").kendoDatePicker({ format: "dd/MM/yyyy" });

    TextBoxEnable($("#txtCliente"), false);
    TextBoxEnable($("#txtPlanta"), false);
    TextBoxEnable($("#txtOrdenDespacho"), false);
    KdoDatePikerEnable($("#dfDespacho"), false);
    fn_Get_DatosCab(xIdDespachoMercancia);

    $("#btnRetornar").click(function () {
        window.location = window.location.origin + `/ConsultaDespacho/${xCliente}/`;
    });


    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "EmbalajesMercancias/GetEmbalajesFinalizadosxDespachar/" + `${xIdDespachoMercancia}` },
                contentType: "application/json; charset=utf-8"
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdEmbalajeMercancia",
                fields: {
                    IdEmbalajeMercancia: { type: "number" },
                    NoDocumento: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridEmbalaje").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEmbalajeMercancia", title: "IdEmbalajeMercancia", hidden: true },
            { field: "NoDocumento", title: "# Embalaje" },
            {
                field: "btnDet", title: "&nbsp;",
                command: {
                    name: "btnDet",
                    iconClass: "k-icon k-i-eye",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                        e.preventDefault();
                        let tr = $(e.target).closest("tr"); 
                        let data = this.dataItem(tr);

                        let strjson = {
                            config: [{
                                Div: "vInfEmbDes",
                                Vista: "~/Views/Shared/_InfoEmbalajeDisponibles.cshtml",
                                Js: "InfoEmbalajeDisponibles.js",
                                Titulo: "Consulta de Embalaje - Contenido de Cortes",
                                Width: "70%",
                                MinWidth: "90%",
                                Height: "90%"
                            }],
                            Param: { IdEmbalajeMercancia: data.IdEmbalajeMercancia },
                            fn: { fnclose: "", fnLoad: "fn_Ini_Info_Emb_Dis", fnReg: "fn_Reg_Info_Emb_Dis", fnActi: "" }
                        };

                        fn_GenLoadModalWindow(strjson);
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
    SetGrid($("#gridEmbalaje").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridEmbalaje").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEmbalaje").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEmbalaje").data("kendoGrid"), dS);


});

fPermisos = function (datos) {
    Permisos = datos;

}

let fn_Get_DatosCab = (IdOD) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DespachosEmbalajesMercancias/GetDatosCab/" + `${IdOD}`,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (dato) {
            if (dato !== null) {
                xCliente = dato.IdCliente;
                xPlanta = dato.IdPlanta;
                $("#txtCliente").val(dato.NombreCliente);
                $("#txtPlanta").val(dato.NombrePlanta);
                $("#txtNoDoc").val(dato.IdDespachoEmbalajeMercancia);
                $("#txtOrdenDespacho").val(dato.NoDocumento);
                $("#txtIdDespachoMerc").val(dato.IdDespachoMercancia);
                $("#dfDespacho").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaEntrega), 'dd/MM/yyyy'));

            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};