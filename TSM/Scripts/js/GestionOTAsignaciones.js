var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;
let Mul1;
let Mul2;
let Mul3;
var fn_VerOt = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/OrdenesTrabajo/ElementoTrabajo/" + xidOrdenTrabajo + "/" + xidEtapaProceso;
};
$(document).ready(function () {

    let dtfecha = new Date();

    Kendo_CmbFiltrarGrid($("#CmbEtapasProcesos"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/GetbyIdUsuario/" + getUser(), "Nombre", "IdEtapaProceso", "Seleccione una etapa", "");
    KdoCmbSetValue($("#CmbEtapasProcesos"), sessionStorage.getItem("gEOT_CmbEtapasProcesos") === null ? "" : sessionStorage.getItem("gEOT_CmbEtapasProcesos")); 

    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("gEOT_CmbCliente") === null ? "" : sessionStorage.getItem("gEOT_CmbCliente")); 

    $("#CmbPrograma").ControlSelecionPrograma();
    //KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("gEOT_CmbPrograma") === null ? "" : sessionStorage.getItem("gEOT_CmbPrograma")); 
    if (sessionStorage.getItem("gEOT_CmbPrograma") !== null && sessionStorage.getItem("gEOT_CmbPrograma") !== "") {
        Mul3 = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        Mul3.search(sessionStorage.getItem("gEOT_NombrePrograma"));
        Mul3.text(sessionStorage.getItem("gEOT_NombrePrograma") === null ? "" : sessionStorage.getItem("gEOT_NombrePrograma"));
        Mul3.trigger("change");
        Mul3.close();

    }

    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();
    //KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), sessionStorage.getItem("gEOT_CmbOrdenTrabajo") === null ? "" : sessionStorage.getItem("gEOT_CmbOrdenTrabajo")); 
    if (sessionStorage.getItem("gEOT_CmbOrdenTrabajo") !== null && sessionStorage.getItem("gEOT_CmbOrdenTrabajo") !== "") {
        Mul1 = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        Mul1.search(sessionStorage.getItem("gEOT_NoDocumento"));
        Mul1.text(sessionStorage.getItem("gEOT_NoDocumento") === null ? "" : sessionStorage.getItem("gEOT_NoDocumento"));
        Mul1.trigger("change");
        Mul1.close();
    }

    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("gEOT_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("gEOT_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("gEOT_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("gEOT_dFechaHasta"));

    $('#chkRangFechas').prop('checked', sessionStorage.getItem("gEOT_chkRangFechas") === null ? 0 : sessionStorage.getItem("gEOT_chkRangFechas") === "true" ? 1 : 0);

    KdoDatePikerEnable($("#dFechaDesde"), false);
    KdoDatePikerEnable($("#dFechaHasta"), false);
    //Dibujar htmle

    $("#CmbEtapasProcesos").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTsKbAsig(this.dataItem(e.item.index()).IdEtapaProceso.toString(), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );
            sessionStorage.setItem("gEOT_CmbEtapasProcesos", this.dataItem(e.item.index()).IdEtapaProceso);
        } else {
            fn_ObtenerOTsKbAsig(0, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );
            sessionStorage.setItem("gEOT_CmbEtapasProcesos", "");
        }
    });

    $("#CmbEtapasProcesos").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            fn_ObtenerOTsKbAsig(0, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbEtapasProcesos", "");
        }
    });


    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbCliente", "");
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbCliente", "");
        }
    });

 

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbPrograma", "");
            sessionStorage.setItem("gEOT_NombrePrograma","");
        } else {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                data.IdPrograma, $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbPrograma", data.IdPrograma);
            sessionStorage.setItem("gEOT_NombrePrograma", data.Nombre);
        }

    });


    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbOrdenTrabajo", "");
        } else {
            fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), data.IdOrdenTrabajo,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("gEOT_CmbOrdenTrabajo", data.IdOrdenTrabajo);
            sessionStorage.setItem("gEOT_NoDocumento", data.NoDocumento);
        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );

        sessionStorage.setItem("gEOT_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );
        sessionStorage.setItem("gEOT_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });

    $("#chkVerTodas").click(function () {
        fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
            , this.checked, null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );
        sessionStorage.setItem("gEOT_chkVerTodas", this.checked);
    });

    $("#chkRangFechas").click(function () {

        KdoDatePikerEnable($("#dFechaDesde"), this.checked);
        KdoDatePikerEnable($("#dFechaHasta"), this.checked);
        fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),null,
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );

        sessionStorage.setItem("gEOT_chkRangFechas", this.checked);
    });

    if (KanbanEtapa_IdOrdenTrabajo > 0 || KanbanEtapa_IdEtapaProceso > 0) {
        KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), KanbanEtapa_IdOrdenTrabajo);
        KdoCmbSetValue($("#CmbEtapasProcesos"), KanbanEtapa_IdEtapaProceso);
        $('#chkVerTodas').prop('checked', 1);
        fn_ObtenerOTsKbAsig(KanbanEtapa_IdEtapaProceso, KanbanEtapa_IdOrdenTrabajo, null, null, $("#chkVerTodas").is(':checked'), null,null,null);
    } else {
        $('#chkVerTodas').prop('checked', sessionStorage.getItem("gEOT_chkVerTodas") === "true" ? 1 : 0);
        $('#chkRangFechas').prop('checked', sessionStorage.getItem("gEOT_chkRangFechas") === "true" ? 1 : 0);

        KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("gEOT_chkRangFechas") === "true" ? 1 : 0);
        KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("gEOT_chkRangFechas") === "true" ? 1 : 0);

        fn_ObtenerOTsKbAsig(sessionStorage.getItem("gEOT_CmbEtapasProcesos") === null || sessionStorage.getItem("gEOT_CmbEtapasProcesos") === "" ? null : sessionStorage.getItem("gEOT_CmbEtapasProcesos"),
            sessionStorage.getItem("gEOT_CmbOrdenTrabajo") === null || sessionStorage.getItem("gEOT_CmbOrdenTrabajo") === "" ? null : sessionStorage.getItem("gEOT_CmbOrdenTrabajo"),
            sessionStorage.getItem("gEOT_CmbCliente") === null || sessionStorage.getItem("gEOT_CmbCliente") === "" ? null : sessionStorage.getItem("gEOT_CmbCliente"),
            sessionStorage.getItem("gEOT_CmbPrograma") === null || sessionStorage.getItem("gEOT_CmbPrograma") === "" ? null : sessionStorage.getItem("gEOT_CmbPrograma"),
            $("#chkVerTodas").is(':checked'),
            null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("gEOT_dFechaDesde") === null ? $("#dFechaDesde").val() : null), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("gEOT_dFechaHasta") === null ? $("#dFechaHasta").val() : null), 's'));

    }

    $(".Kanban-view-topscroll").scroll(function () {
        $(".board")
            .scrollLeft($(".Kanban-view-topscroll").scrollLeft());
    });
    $(".board").scroll(function () {
        $(".Kanban-view-topscroll")
            .scrollLeft($(".board").scrollLeft());
    });

});

let fn_DibujarKanban = function (ds) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/GetbyIdEtapaProceso/" + (KdoCmbGetValue($("#CmbEtapasProcesos")) === null ? 0 : KdoCmbGetValue($("#CmbEtapasProcesos"))),
        type: 'GET',
        success: function (datos) {
            let MyKanban = $("#myKanban");
            MyKanban.children().remove();
            $.each(datos, function (index, elemento) {
                let UsuarioKB = elemento.Nombre === null ? '</br>' : elemento.Nombre;

                MyKanban.append('<div data-id="_' + elemento.IdUsuario + '" class="kanban-board form-group col-lg-12 sortable-drag" draggable="false">' +
                    '<header class="kanban-board-header">' +
                    '<div class="kanban-title-board"></div>' +
                    '<div class="user">' +
                    '<div class="avatar-sm float-left mr-2" id="MyPhoto1">' +
                    '<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle" draggable="false">' +
                    '</div>' +
                    '<div class="info">' +
                    '<a data-toggle="collapse" aria-expanded="true" class="">' +
                    '<span>' +
                    '<span id="MyUserName">' + UsuarioKB + '</span>' +
                    '</span>' +
                    '</br>' +
                    ' </a>' +
                    '</div>' +
                    '</div>' +
                    '</header>' +
                    '<div><br/></div>'+
                    '<main class="kanban-drag" id="' + elemento.IdUsuario + '">' +
                    '</main>' +
                    '<footer></footer>' +
                    '</div>'
                );
                let filtro = [];
                JSON.parse(JSON.stringify(ds), function (key, value) {
                    if (value !== null)
                    {
                        if (value.IdUsuarioAsignado === elemento.IdUsuario) filtro.push(value);

                    }
                    return value;
                });

                let MainKanba = $("#" + elemento.IdUsuario + "");
                MainKanba.children().remove();
                let usuario = elemento.IdUsuario;

                $.each(filtro, function (index, elemento) {
                    let NoRegPrenda = elemento.NoDocumentoRegPrenda === null ? '' : elemento.NoDocumentoRegPrenda;
                    let NoReferencia = elemento.NoReferencia === null ? '' : elemento.NoReferencia;
                    let StyleEstadoOT = elemento.ColorEstadoOT === null ? "" : 'style=\"background-color:' + elemento.ColorEstadoOT + ';\"';
                    let IdUsuarioKB = (elemento.IdUsuarioAsignado === undefined || elemento.IdUsuarioAsignado === null) ? '' : elemento.IdUsuarioAsignado;
                    let CodigoDisenoAX = (elemento.CodigoDisenoAX === undefined || elemento.CodigoDisenoAX === null) ? '' : elemento.CodigoDisenoAX;
                    let CodigoOTOrigen = elemento.NoOtOrigen === null ? '' : elemento.NoOtOrigen;

                    MainKanba.append('<div class="kanban-item kanban-item-draggable" draggable="false" id="' + elemento.IdRow + '" >' +
                        //'<div class= "form-group col-lg-2">' +
                        '<div class="card border-success mb-3" style="max-width: 18rem;">' +
                        '<div class= "TSM-card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' +
                        //'<a class="btn-link stretched-link" target="_blank" href="/OrdenesTrabajo/ElementoTrabajo/' + elemento.IdOrdenTrabajo + '/' + elemento.IdEtapaProceso + '">' + elemento.NoDocumento + '<a />' +
                        '<ul id="Menu_' + elemento.IdRow + '" ' + StyleEstadoOT + '>' +
                        '<li class="emptyItem">' +
                        '<span class="empty">' + elemento.NoDocumento + '</span>' +
                        '<ul>' +
                        '<li onclick=\"fn_VerOt(' + elemento.IdOrdenTrabajo + "," + elemento.IdEtapaProceso + ');\"> <span class="k-icon k-i-file-txt"></span>Ver orden de trabajo</li>' +
                        '</ul>' +
                        '</li>' +
                        '</ul>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<h5 class="TSM-card-title" style="white-space:normal;font-weight: bold;">' + elemento.NombreDiseño + '</h5>' +
                        '<h1 class="TSM-card-title" style="white-space:normal;font-weight: bold;">' + elemento.TallaDesarrollar + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + NoReferencia + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + elemento.NoPrograma + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + NoRegPrenda + '</h1>' +
                        '<p class="card-text" style="white-space:normal;">Usuario:' + IdUsuarioKB + '&nbsp;&nbsp;' + elemento.Estatus + '<br/><span style="white-space:normal;font-weight: bold;">' + (elemento.NombreTipoOrden === null ? "" : elemento.NombreTipoOrden) + '</span><br/> Programa: ' + elemento.NombrePrograma + "<br/>Prenda: " + elemento.Prenda + "<br/>" +
                        'Color Tela: ' + elemento.ColorTela + (CodigoDisenoAX !== "" ? "<br/>" + 'Diseño AX: ' + CodigoDisenoAX : "") + "<br/>Tallas: " + elemento.Tallas + (CodigoOTOrigen === "" ? "</p>" : "<br/><b>OT Origen: " + CodigoOTOrigen + "</b> </p>") +
                        '</div>' +
                        '<div class="TSM-card-footer bg-transparent border-success" style="white-space:normal;font-weight: bold;">Fecha OT: ' + kendo.toString(kendo.parseDate(elemento.FechaOrdenTrabajo), "dd/MM/yyyy HH:mm:ss") + '</div>' +
                        '</div>' +
                        //'</div>' +
                        '</div>');

                  

                    $("#" + elemento.IdRow + "").data("IdOrdenTrabajo", elemento.IdOrdenTrabajo);
                    $("#" + elemento.IdRow + "").data("IdEtapaProceso", elemento.IdEtapaProceso);
                    $("#" + elemento.IdRow + "").data("Item", elemento.Item);
                    $("#" + elemento.IdRow + "").data("UsuarioFrom", usuario);

                    $("#Menu_" + elemento.IdRow + "").kendoMenu({
                        openOnClick: true
                    });


                });

            });

            $(".scroll-div1").css("width", $(".board")[0].scrollWidth);
            $(".Kanban-view-topscroll").css("width", $(".board")[0].scrollWidth);
            fn_IniciarKanban();
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });


};

let fn_ObtenerOTsKbAsig = function (xIdEtapaProceso, xIdOrdenTrabajo, xIdCliente, xIdPrograma, xSNTodas, xIdTipoOrdenTrabajo, xFechaDesde, xFechaHasta) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosEtapas",
        data: JSON.stringify({
            IdEtapaProceso: xIdEtapaProceso,
            IdOrdenTrabajo: xIdOrdenTrabajo,
            IdCliente: xIdCliente,
            IdPrograma: xIdPrograma,
            SNTodas: xSNTodas,
            IdTipoOrdenTrabajo: xIdTipoOrdenTrabajo,
            FechaDesde: xFechaDesde,
            FechaHasta: xFechaHasta,
            SNAsignadas: false,
            Opcion:1

        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            fn_DibujarKanban(datos);

        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};


let fn_IniciarKanban = function () {

    var TSMboardK_A = {
        init: function init() {

            this.bindUIActions();
        },
        bindUIActions: function bindUIActions() {

            // event handlers
            this.handleBoardStyle();
            this.handleSortable();
        },
        byId: function byId(id) {
            return document.getElementById(id);
        },
        handleBoardStyle: function handleBoardStyle() {
            $(document).on('mouseenter mouseleave', '.kanban-board-header', function (e) {
                var isHover = e.type === 'mouseenter';
                $(this).parent().toggleClass('hover', isHover);
            });
        },
        handleSortable: function handleSortable() {
            //obtener el elemento MyKanban
            var board = this.byId('myKanban');
            // Multi groups
            Sortable.create(board, {
                animation: 150,
                draggable: '.kanban-board', // Especifica qué elementos dentro del elemento deben ser arrastrables
                handle: '.kanban-board-header', // Arrastre el selector de manejadores dentro de los elementos de la lista 
                filter: '.ignore-sort', //Selectores que no conducen al arrastre(String o Function)
                delay: 100,
                forceFallback: true//ignora el comportamiento de DnD HTML5 y fuerza el retroceso para que se active
               
            });
            [].forEach.call(board.querySelectorAll('.kanban-drag'), function (el) {
                Sortable.create(el, {
                    group: 'tasks',
                    animation: 150,
                    filter: '.ignore-sort',
                    delay: 100,
                    forceFallback: true, // ignora el comportamiento de DnD HTML5 y fuerza el retroceso para que se active  
                      //Element dragging started
                    onStart: function (/**Event*/evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        xIdOrdenTrabajo = $("#" + itemEl.id).data("IdOrdenTrabajo");
                        xIdEtapaProceso = $("#" + itemEl.id).data("IdEtapaProceso");
                        xItem = $("#" + itemEl.id).data("Item");
                        xIdUsuarioFrom = $("#" + itemEl.id).data("UsuarioFrom");
                        SeAsigno=true
                    },
                    // Element is dropped into the list from another list
                    onAdd: function (/**Event*/evt) {
                        // same properties as onEnd
                        var itemEl = evt.item;
                        xIdUsuarioTo = evt.to.id;
                        kendo.ui.progress($(document.body), true);
                        $.ajax({
                            url: TSM_Web_APi + "OrdenesTrabajosDetallesUsuarios/AsignarUsuario/",
                            method: "POST",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({
                                IdOrdenTrabajo: xIdOrdenTrabajo,
                                IdEtapaProceso: xIdEtapaProceso,
                                Item: xItem,
                                IdUsuarioTo: xIdUsuarioTo,
                                IdUsuarioFrom: xIdUsuarioFrom
                            }),
                            success: function (datos) {
                                RequestEndMsg(datos, "Post");
                                $("#" + itemEl.id).data("UsuarioFrom", xIdUsuarioTo);
                              
                            },
                            error: function (data) {
                                ErrorMsg(data);
                                fn_ObtenerOTsKbAsig(KdoCmbGetValue($("#CmbEtapasProcesos")) === null ? 0 : KdoCmbGetValue($("#CmbEtapasProcesos")));
                        
                            },
                            complete: function () {
                                kendo.ui.progress($(document.body), false);
                            }
                        });
                      
                    },
                    onMove: function (/**Event*/evt, /**Event*/originalEvent) {
                        //if (SeAsigno === false) {
                        //    return false;
                        //}
                        //alert("prueba");
                   
                    }
                });
            });
        }
    };

    TSMboardK_A.init();

};

fPermisos = function (datos) {
    Permisos = datos;
};