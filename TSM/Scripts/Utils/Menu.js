$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $("#sidebar-wrapper").toggleClass("border-right");

    if ($("#wrapper2").hasClass("toggled"))
        $("#wrapper2").toggleClass("toggled");

    if ($(".sidebar-SubMenu").hasClass("border-right"))
        $(".sidebar-SubMenu").toggleClass("border-right");
});

$(document).mouseup(function (e) {
    var menu = $("#wrapper");
    var submenu = $("#wrapper2");
    var btn = $("#menu-toggle");

    if (menu.hasClass("toggled")) {
        //que el clic no sea al boton ni a los menus (o sus componentes)
        if ((!btn.is(e.target) && btn.has(e.target).length === 0) && (!menu.is(e.target) && menu.has(e.target).length === 0) && (!submenu.is(e.target) && submenu.has(e.target).length === 0)) {
            menu.removeClass("toggled");
            submenu.removeClass("toggled");
            $(".sidebar-SubMenu").removeClass("border-right");
        }
    }
});

function MostarOpcionesMenu(e) {
    e.preventDefault();
    MostrarSubMenu();

    $("#sidebar-wrapper2").children().hide();
    $("#" + e.target.dataset.target).show();
};

function MostrarSubMenu() {
    if (!$("#wrapper2").hasClass("toggled")) {
        $("#wrapper2").toggleClass("toggled");
        $(".sidebar-SubMenu").toggleClass("border-right");
    }
};

var ReadyMenuJs = function () {
    
    getOpcionesMenu();
};

function getOpcionesMenu() {
    kendo.ui.progress($("#body"), true);
    $.ajax({ 
        url: UrlMenu + "/GetMenusbyUsuario/" + getUser(),
        dataType: 'json',
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                CrearOpcionesMenu(respuesta);
            }
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(respuesta, "Get");
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
            ErrorMsg(respuesta);
        }

       
    });
}

function CrearOpcionesMenu(opciones) {
    var navbarMP=  $("#navbarMP");
    $("#navbarMP").children().remove();
    $("#sidebar-wrapper2").children().remove();
    $.each(opciones, function (index, elemento) {
        if (elemento.Nivel===1) {
            navbarMP.append(
                '<li class="nav-item" id="NavMPItem-' + elemento.IdMenu + '">' +
                '<a class= "nav-link dropdown-toggle text-nowrap" data-toggle="collapse" href = "#Panel1-N1-' + elemento.IdMenu + '" aria-expanded="false" aria-controls="Panel1-N1-' + elemento.IdMenu +'" >' + elemento.EtiquetaMenu +
                '</a>' +
                '</li >'
            );


            if (elemento.TieneOpciones) {
                var NavMPItem = $("#NavMPItem-" + elemento.IdMenu + "");
                NavMPItem.append(
                    '<div id="Panel1-N1-' + elemento.IdMenu + '" class="collapse" style="margin-left: 30px;">' +
                    '<ul class="navbar-nav" id="Panel2-N2-' + elemento.IdMenu + '">' +
                    '</ul>' +
                    '</div>');

                CrearOpcionesMenuNivel2(opciones, elemento.IdMenu, "Panel2-N2-" + elemento.IdMenu + "");


            }
        }
       

    });
}

function CrearOpcionesMenuNivel2(opciones,IdMenuPadre,NavBarN2IdMenu) {
    var filtro = [];
    var data = JSON.parse(JSON.stringify(opciones), function (key, value) {
        if ((value !== null) ) {
            if (value.IdMenuPadre === IdMenuPadre) filtro.push(value);
           
        }
        return value;
    });

    $.each(filtro, function (index, elemento) {
        //Dibuja las opciones de nivel dos
        var NavbarN2 = $("#" + NavBarN2IdMenu + "");
        NavbarN2.append(
            '<li class="nav-item small">' +
            '<button class="btn btn-link nav-link" id="Submenu-N2-' + elemento.IdMenu + '-toggle" data-target="Panel-Target-N2-' + elemento.IdMenu + '" onclick="MostarOpcionesMenu(event)">' +
            '<span class="' + elemento.Fuente + '" style="color: #A05EB5;" data-target="Panel-Target-N2-' + elemento.IdMenu + '" onclick="MostarOpcionesMenu(event)" ></span>' + elemento.EtiquetaMenu +
            '</button>' +
            '</li>');
        // crea los panel que contendran las opciones del nivel 2

        if (elemento.TieneOpciones) {

            var sidebarwrapper2 = $("#sidebar-wrapper2");
            sidebarwrapper2.append(
                '<nav id="Panel-Target-N2-' + elemento.IdMenu + '" class="navbar navbar-light small">' +
                '<ul class="navbar-nav" id="Panel-Opc-N2-' + elemento.IdMenu + '">' +
                '</ul>' +
                '</nav>');


            CrearOpcionesMenuNivel3(opciones, elemento.IdMenu, "Panel-Opc-N2-" + elemento.IdMenu + "");

        }
    });
    

}

function CrearOpcionesMenuNivel3(opciones, IdMenuPadre, NavBarN2Opciones) {

    var filtro = [];
    var data = JSON.parse(JSON.stringify(opciones), function (key, value) {
        if (value !== null) {
            if (value.IdMenuPadre === IdMenuPadre) filtro.push(value);

        }
        return value;
    });

    $.each(filtro, function (index, elemento) {
        //alert(elemento.EtiquetaMenu);
        var NavBarN2Opc = $("#" + NavBarN2Opciones + "");
        NavBarN2Opc.append(
            '<li class="nav-item text-nowrap">' +
            '<a href="' + elemento.UrlMenu + '" class="nav-link" >' + elemento.EtiquetaMenu +'</a>' +
            '</li>');

    });
}

