
let xfiltroCliente;
let xNombreDivCD;
let dataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: function () {
                return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoSeleccion/" + xfiltroCliente + "/0/0/" +( KdoMultiColumnCmbGetValue($("#CmbFmCata")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbFmCata"))) + "";
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }
    },
    pageSize: 20
});
var fn_LoadCatalogoDisenos = function (xIdClienCat,divCD) {
    xfiltroCliente = xIdClienCat;
    xNombreDivCD = divCD;
    KdoButton($("#btnGuardarFM"), "save", "Crear FM");
    $("#TxtNombreDis_FM").val("");
    $("#TxtEstiloDis_FM").val("");
    $("#TxtNumeroDis_FM").val("");
    $("#CmbFmCata").ControlSelecionFMCatalogo();
    KdoMultiColumnCmbSetValue($("#CmbFmCata"), "");
    $('#chkVerTodas').prop('checked', 0);

    $("#pager").kendoPager({
        dataSource: dataSource,
        input: true,
        pageSizes: [20, 50, 100, "all"]
    });

    dataSource.bind("change", function () {
        var view = dataSource.view();
        fn_DibujarCatalogo_Seleccion(view);
    });

    $("#FrmModalFM").kendoValidator({
            rules: {
                NombreDis: function (input) {
                        if (input.is("[name='TxtNombreDis_FM']")) {
                            return input.val().length > 0 && input.val().length <= 200;
                        }
                        return true;
                    }
               

            },
            messages: {
                NombreDis: "Requerido"
            }
    });

    $("#btnGuardarFM").data("kendoButton").bind("click", function (e) {
        fn_btnCrearFM();
    });

    $("#TxtNombreDis_FM").focus().select();


    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data !== undefined) {
            dataSource.read();
            $("#pager").data("kendoPager").page(1);
        } else {
            if ($("#chkVerTodas").is(':checked')) {
                dataSource.read();
                $("#pager").data("kendoPager").page(1);
            } else {
                dataSource.data([]);
            }
        }
    });

    $("#chkVerTodas").click(function () {
        if ($("#chkVerTodas").is(':checked')) {
            KdoMultiColumnCmbSetValue($("#CmbFmCata"), "");
            dataSource.read();
            $("#pager").data("kendoPager").page(1);
        } else {
            dataSource.data([]);
            $("#CmbFmCata").data("kendoMultiColumnComboBox").focus();
        }
       
    });


};
var fn_GetCatalogoDisenos = function (xIdClienCat, divCD) {
    xfiltroCliente = xIdClienCat;
    xNombreDivCD = divCD;
    $("#TxtNombreDis_FM").val("");
    $("#TxtEstiloDis_FM").val("");
    $("#TxtNumeroDis_FM").val("");
    KdoMultiColumnCmbSetValue($("#CmbFmCata"), "");
    dataSource.data([]);
    $('#chkVerTodas').prop('checked', 0);
    $("#TxtNombreDis_FM").focus().select();
};
let fn_obtnerIdCatalogoDiseno = function (e) {
    let datoCD = {
        IdCatalogoDiseno: $("#" + e["id"] + "").data("IdCatalogoDiseno"),
        NoReferencia: $("#" + e["id"] + "").data("NoReferencia"),
        NombreDiseno: $("#" + e["id"] + "").data("NombreDiseno")
    };
    $("#" + xNombreDivCD + "").trigger("GetRowCatalogo", [datoCD]);
    $("#" + xNombreDivCD + "").data("kendoDialog").close();

};
var fn_DibujarCatalogo_Seleccion = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

    $.each(data, function (index, elemento) {

        Pn.append('<div class="d-flex align-items-stretch col-md-12 col-lg-4">' +
            '<a class= "card rounded-0 w-100 bg-white mb-4" onClick="fn_obtnerIdCatalogoDiseno(this)" id="CCD-' + elemento.IdCatalogoDiseno + '" data-NombreDis="' + elemento.NombreDiseno + '">' +
            '<img class="card-img-top img-responsive w-50 " src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" alt="Card image cap">' +
            '</p>' +
            '<div class="card-block text-center ">' +
            '<h5 class="card-title">' + elemento.NombreDiseno + '</h5>' +
            '<p class="card-text">' + elemento.NoReferencia + '</p>' +
            '</div>' +
            '</a>' +
            '</div');

        $("#CCD-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno);
        $("#CCD-" + elemento.IdCatalogoDiseno + "").data("NoReferencia", elemento.NoReferencia);
        $("#CCD-" + elemento.IdCatalogoDiseno + "").data("NombreDiseno", elemento.NombreDiseno);
    });
};

var fn_btnCrearFM = function () {
    let creado = false;
    if ($("#FrmModalFM").data("kendoValidator").validate()) {
         fn_CrearFM();
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        $("#TxtNombreDis_FM").focus().select();
    }

    return creado;
};
let fn_CrearFM= function () {
    let creado = false;
    kendo.ui.progress($("#" + xNombreDivCD + ""), true);
    let xType = "Post";
    $.ajax({
        url: TSM_Web_APi + "CatalogoDisenos",
        type: xType,
        data: JSON.stringify({
            IdCatalogoDiseno: 0,
            Nombre: $("#TxtNombreDis_FM").val(),
            Descripcion: $("#TxtNombreDis_FM").val(),
            NoReferencia: null,
            NombreArchivo: "",
            IdCliente: xfiltroCliente,
            EstiloDiseno: $("#TxtEstiloDis_FM").val(),
            NumeroDiseno: $("#TxtNumeroDis_FM").val(),
            Fecha: Fhoy()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#" + xNombreDivCD + "").data("kendoDialog").close();
            let datoCD = {
                IdCatalogoDiseno: data[0].IdCatalogoDiseno,
                NoReferencia: data[0].NoReferencia,
                NombreDiseno: data[0].Nombre
            };
            $("#" + xNombreDivCD + "").trigger("GetRowCatalogo", [datoCD]);
            kendo.ui.progress($("#" + xNombreDivCD + ""), false);
            RequestEndMsg(data, xType);
            creado = true;
        },
        error: function (data) {
            kendo.ui.progress($("#" + xNombreDivCD + ""), false);
            ErrorMsg(data);
            creado = false;
        }
    });
    return creado;
};