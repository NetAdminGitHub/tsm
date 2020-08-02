var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;
var fn_VerOt = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/OrdenesTrabajo/ElementoTrabajo/" + xidOrdenTrabajo + "/" + xidEtapaProceso;
};
$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbEtapasProcesos"), TSM_Web_APi + "ConfiguracionEtapasOrdenesUsuarios/GetbyIdUsuario/" + getUser(), "Nombre", "IdEtapaProceso", "Seleccione una etapa", "");
    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbEtapasProcesos"), "");
    $("#CmbPrograma").ControlSelecionPrograma();
    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();
    //Dibujar htmle
    //fn_ObtenerOTs();
    $("#CmbEtapasProcesos").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTs(this.dataItem(e.item.index()).IdEtapaProceso.toString(), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null);
        } else {
            fn_ObtenerOTs(0, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null);
        }
    });

    $("#CmbEtapasProcesos").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            fn_ObtenerOTs(0, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null);
        }
    });


    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null);
        }
        else {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null);
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null);
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                this.dataItem(e.item.index()).IdPrograma,
                $("#chkVerTodas").is(':checked'), null);

        } else {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), null);
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), null);
        }

    });


    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {

            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), this.dataItem(e.item.index()).IdOrdenTrabajo,
                this.dataItem(e.item.index()).IdCliente,
                this.dataItem(e.item.index()).IdPrograma, $("#chkVerTodas").is(':checked'),
                null);

        } else {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null);
        }
    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null);
        }

    });

    $("#chkVerTodas").click(function () {
        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
            , this.checked, null);
    });

    if (KanbanEtapa_IdOrdenTrabajo > 0 || KanbanEtapa_IdEtapaProceso >0) {
        KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), KanbanEtapa_IdOrdenTrabajo);
        KdoCmbSetValue($("#CmbEtapasProcesos"), KanbanEtapa_IdEtapaProceso);
        $('#chkVerTodas').prop('checked', 1);
        fn_ObtenerOTs(KanbanEtapa_IdEtapaProceso, KanbanEtapa_IdOrdenTrabajo, null, null, $("#chkVerTodas").is(':checked'), null);
    }

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
                    '<span id="MyUserName">' + elemento.Nombre + '</span>' +
                    '</span>' +
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
                    if (value !== null) {
                        if (value.IdUsuarioAsignado === elemento.IdUsuario) filtro.push(value);

                    }
                    return value;
                });

                let MainKanba = $("#" + elemento.IdUsuario + "");
                MainKanba.children().remove();
                let usuario = elemento.IdUsuario;
                $.each(filtro, function (index,elemento) {
                    let StyleEstadoOT = elemento.ColorEstadoOT === null ? "" : 'style=\"background-color:' + elemento.ColorEstadoOT + ';\"';
                    MainKanba.append('<div class="kanban-item" style="" draggable="false" id="' + elemento.IdRow + '" >' +
                        //'<div class= "form-group col-lg-2">' +
                        '<div class="card border-success mb-3" style="max-width: 18rem;">' +
                        '<div class= "card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' +
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
                        '<h5 class="card-title" style="white-space:normal;font-weight: bold;">' + elemento.NombreDiseño + '</h5>' +
                        '<p class="card-text" style="white-space:normal;">Usuario:' + elemento.IdUsuario + '<br/> Programa: ' + elemento.NoPrograma + " " + elemento.NombrePrograma + "<br/>Prenda: " + elemento.Prenda + "<br/>" +
                        'Color Tela: ' + elemento.ColorTela + '</p>' +
                        '</div>' +
                        '<div class="card-footer bg-transparent border-success" style="white-space:normal;font-weight: bold;">Fecha OT: ' + kendo.toString(kendo.parseDate(elemento.FechaOrdenTrabajo), "dd/MM/yyyy HH:mm:ss") + '</div>' +
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


            fn_IniciarKanban();


        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });


};

let fn_ObtenerOTs = function (xIdEtapaProceso, xIdOrdenTrabajo, xIdCliente, xIdPrograma, xSNTodas, xIdTipoOrdenTrabajo) {
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
            IdTipoOrdenTrabajo: xIdTipoOrdenTrabajo

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

    var TSMboardDemo = {
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
                                fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")) === null ? 0 : KdoCmbGetValue($("#CmbEtapasProcesos")));
                        
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

    TSMboardDemo.init();

};

fPermisos = function (datos) {
    Permisos = datos;
};