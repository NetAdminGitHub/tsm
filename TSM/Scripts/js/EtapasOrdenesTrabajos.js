var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;

$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbTiposOrdenesTrabajos"), TSM_Web_APi + "TiposOrdenesTrabajos", "Nombre", "IdTipoOrdenTrabajo", "Seleccione un Tipo de Orden de trabajo", "");
    //Dibujar htmle
    //fn_ObtenerOTs();
    $("#CmbTiposOrdenesTrabajos").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTs(this.dataItem(e.item.index()).IdTipoOrdenTrabajo.toString());
        } else {
            fn_ObtenerOTs(0);
        }
    });

    $("#CmbTiposOrdenesTrabajos").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            fn_ObtenerOTs(0);
        }
    });

    fn_ObtenerOTs(0);
});

let fn_DibujarKanban = function (ds) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ConfiguracionEtapasOrdenes/GetByIdTipoOrdenTrabajoVista/" + (KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")) === null ? 0 : KdoCmbGetValue($("#CmbTiposOrdenesTrabajos"))),
        type: 'GET',
        success: function (datos) {
            let MyKanban = $("#myKanban");
            MyKanban.children().remove();
            $.each(datos, function (index, elemento) {
                MyKanban.append('<div data-id="_' + elemento.IdEtapaProceso + '" class="kanban-board form-group col-lg-12 sortable-drag" draggable="false">' +
                    '<header class="kanban-board-header">' +
                    '<div class="kanban-title-board">' + elemento.Nombre + '</div>' +
                    '</header>' +
                    '<div><br/></div>' +
                    '<main class="kanban-drag" id="Etp-' + elemento.IdEtapaProceso + '">' +
                    '</main>' +
                    '<footer></footer>' +
                    '</div>'
                );
                let filtro = [];
                JSON.parse(JSON.stringify(ds), function (key, value) {
                    if (value !== null) {
                        if (value.IdEtapaProceso === elemento.IdEtapaProceso) filtro.push(value);

                    }
                    return value;
                });

                let MainKanba = $("#Etp-" + elemento.IdEtapaProceso + "");
                MainKanba.children().remove();
                let usuario = elemento.IdUsuario;
                $.each(filtro, function (index, elemento) {

                    MainKanba.append('<div class="kanban-item" style="" draggable="false" id="' + elemento.IdRow + '" >' +
                        //'<div class= "form-group col-lg-2">' +
                        '<div class="card border-success mb-3" style="max-width: 18rem;">' +
                        '<div class= "card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' + elemento.NoDocumento + '</div>' +
                        '<div class="card-body">' +
                        '<h5 class="card-title" style="white-space:normal;font-weight: bold;"><a class="btn-link stretched-link" target="_blank" href="/OrdenesTrabajo/ElementoTrabajo/' + elemento.IdOrdenTrabajo + '/' + elemento.IdEtapaProceso + '">' + elemento.NombreDiseño + '</a></h5>' +
                        '<div class="user">' +
                        '<div class="avatar-sm float-left mr-2" id="MyPhoto1">' +
                        '<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle">' +
                        '</div>' +
                        '<div class="info">' +
                        '<a data-toggle="collapse">' +
                        '<span>' +
                        '<span id="MyUserName" style="white-space:normal;">' + elemento.NombreUsuario + '</span>' +
                        '</span>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<p class="card-text" style="white-space:normal;"><br/>Programa: ' + elemento.NoPrograma + " " + elemento.NombrePrograma + "<br/>Prenda: " + elemento.Prenda + "<br/> " +
                        'Color Tela: ' + elemento.ColorTela + '</p>' +
                        '</div>' +
                        '<div class="card-footer bg-transparent border-success" style="white-space:normal;font-weight: bold;">Fecha OT: ' + kendo.toString(kendo.parseDate(elemento.FechaOrdenTrabajo), "dd/MM/yyyy HH:mm:ss") + '</div>' +
                        '</div>' +
                        //'</div>' +
                        '</div>');



                    $("#" + elemento.IdRow + "").data("IdOrdenTrabajo", elemento.IdOrdenTrabajo);
                    $("#" + elemento.IdRow + "").data("IdEtapaProceso", elemento.IdEtapaProceso);
                    $("#" + elemento.IdRow + "").data("Item", elemento.Item);

                });

            });


            fn_IniciarKanban();


        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });


};

let fn_ObtenerOTs = function (vep) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosEtapas",
        type: 'GET',
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

                    },
                    // Element is dropped into the list from another list
                   
                    onMove: function (/**Event*/evt, /**Event*/originalEvent) {
                 
                            return false;
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