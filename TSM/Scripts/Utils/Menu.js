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
}

function MostrarSubMenu() {
    if (!$("#wrapper2").hasClass("toggled")) {
        $("#wrapper2").toggleClass("toggled");
        $(".sidebar-SubMenu").toggleClass("border-right");
    }
}

var ReadyMenuJs = function () {
    Fn_getOpcionesMenu();
};

var ReadyMenuPerfil = function () {
    fn_getPerfilUsuario(getUser());
}

//#region Generarion de menu primera version 
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
        if (value !== null)  {
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
//#endregion Generarion de menu primera version 

//#region Generacion de Menu Nueva Version 

// variables globales
var MapNivel1 = "";
var MapNivel2 = "";
var MapNivel3 = "";
var m = new Map();
/**
 * funcion para obtener las opciones de menu asignadas al usuario
 */
function Fn_getOpcionesMenu() {
    kendo.ui.progress($("#body"), true);
    $.ajax({
        url: UrlMenu + "/GetMenusbyUsuario/" + getUser(),
        dataType: 'json',
        async: false,
        type: 'GET',
        success: function (respuesta) {
            if (respuesta !== null) {
                fn_CrearOpcionesMenu(respuesta);
            }
            kendo.ui.progress($("#body"), false);
            RequestEndMsg(respuesta, "Get");
        },
        error: function (respuesta) {
            kendo.ui.progress($("#body"), false);
          
        }


    });
}


/**
 * crear opcion del Menu nivel superrior
 * @param {any} opciones listado de opciones del menu 
 */
function fn_CrearOpcionesMenu(opciones) {
    $("#MPContenedor").children().remove();
    var MPContenedor = $("#MPContenedor");
   
    MPContenedor.append(
        '<div class="user">' +
        '<div class="avatar-sm float-left mr-2" id="MyPhoto1">' +
        '<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle" />' +
        '</div>' +
        '<div class="info">' +
        '<a data-toggle="collapse" href="#collapseExample" aria-expanded="true">' +
        '<span>' +
        '<span Id="MyUserName"></span >'+ //aqui se coloca el nombre del usuario
        '<span class="user-level"><span id="MyPosition"></span></span>' +  //aqui se coloca el cargo en la compañia
        '<span class="caret"></span>' +
        '</span>' +
        '</a>' +
        '<div class="clearfix"></div>' +
        '<div class="collapse in" id="collapseExample">' +
        '<ul class="nav">' +
        '<li>' +
        '<a href="#profile">' +
        '<span class="link-collapse"></span>' +
        '</a>' +
        '</li>' +
        '<li>' +
        '<a href="#edit">' +
        '<span class="link-collapse"></span>' +
        '</a>' +
        '</li>' +
        '<li>' +
        '<a href="#settings">' +
        '<span class="link-collapse"></span>' +
        '</a>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>'

    );

    // crear etiqueta lista
    MPContenedor.append('<ul class="nav" id="MPLista"></ul>');
    var MPLista = $("#MPLista");

    $.each(opciones, function (index, elemento) {
        if (elemento.Nivel === 1) {
            MPLista.append(
                '<li class= "nav-section">' +
                '<span class="sidebar-mini-icon">' +
                '<i class="k-icon k-i-more-horizontal ficonm"></i>' +
                '</span>' +
                '<h4 class="text-section">' + elemento.EtiquetaMenu + '</h4>' +
                '</li>'
            );

            //asignar a variable codigo html, para construir el nivel 1 Mapa de Sitio
            MapNivel1 = '<li class="nav-home">' +
                '<a href ="/" >'+
                '<i class="TS-icon-HOME ficonm"></i>' +
                '</a >' +
                '</li >' +
                '<li class="separator">' +
                '<i class="k-icon k-i-arrow-chevron-right"></i>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a href="#">' + elemento.EtiquetaMenu + '</a>' +
                '</li>';

            if (elemento.TieneOpciones) {
                fn_CrearOpcionesMenuNivel2(opciones, elemento.IdMenu);
            }
        }

    });
}

/**
 * * crear opcion del Menu nivel 2
 * @param {any} opciones listado de opciones del menu
 * @param {number} IdMenuPadre codigo o Id padre de la opcion de menu
 */
function fn_CrearOpcionesMenuNivel2(opciones, IdMenuPadre) {
    var filtro = [];
    var data = JSON.parse(JSON.stringify(opciones), function (key, value) {
        if (value !== null) {
            if (value.IdMenuPadre === IdMenuPadre) filtro.push(value);

        }
        return value;
    });
    var MPLista = $("#MPLista");
    $.each(filtro, function (index, elemento) {
        //Dibuja las opciones de nivel dos
        MPLista.append(
            '<li class="nav-item">' +
            '<a data-toggle="collapse" href="#OpcMN2-' + elemento.IdMenu + '"" class="collapsed" aria-expanded="false">' +
            '<i class="'+elemento.Fuente+' ficonm"></i>' +
            '<p>' + elemento.EtiquetaMenu + '</p>' +
            '<span class="caret"></span>' +
            '</a>' +
            '<div class="collapse" id="OpcMN2-' + elemento.IdMenu + '" style>' +
            '<ul class="nav nav-collapse"  id="OpcMN3-' + elemento.IdMenu + '" ></ul>'+
            '</div>' +
            '</li>'
        );

        MapNivel2 = '<li class="separator">' +
            '<i class="k-icon k-i-arrow-chevron-right"></i>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a href="#">' + elemento.EtiquetaMenu + '</a>' +
            '</li>';
        // crea los panel que contendran las opciones del nivel 2

        if (elemento.TieneOpciones) {

            fn_CrearOpcionesMenuNivel3(opciones, elemento.IdMenu, "OpcMN3-" + elemento.IdMenu + "");

        }
    });


}

/**
 * crear opcion de menu nivel 3
 * @param {any} opciones  listado de opciones del menu
 * @param {number} IdMenuPadre  codigo o Id padre de la opcion de menu
 * @param {string} OpcMN3Opciones Id de la opcion de nivel 2 
 */
function fn_CrearOpcionesMenuNivel3(opciones, IdMenuPadre, OpcMN3Opciones) {

    var filtro = [];
    var data = JSON.parse(JSON.stringify(opciones), function (key, value) {
        if (value !== null) {
            if (value.IdMenuPadre === IdMenuPadre) filtro.push(value);

        }
        return value;
    });

    $.each(filtro, function (index, elemento) {

        MapNivel3 = '<li class="separator">' +
            '<i class="k-icon k-i-arrow-chevron-right"></i>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a href="#">' + elemento.EtiquetaMenu + '</a>' +
            '</li>';

        // Almacenar la estructura mapa del sitio, concatenando las 3 variables de nivel
        // esta informacion se guarda en el Objeto Map qe almacena pares de Clave y Valor
        // Uso de Colecciones.
        m.set(elemento.IdMenu, MapNivel1 + MapNivel2 + MapNivel3);

        var OpcMN3Opc = $("#" + OpcMN3Opciones + "");
        OpcMN3Opc.append(
            '<li>' +
            '<a href="' + elemento.UrlMenu + '" data-idmapa="' + elemento.IdMenu+ '">' +
            '<span class="sub-item" >' + elemento.EtiquetaMenu + '</span>' +
            '</a>' +
            '</li>'
        );

       

    });

}

/**
 * muestra mapa de opcion o vista cargada.
 * @param {number} Idmenu opcion del menu.
 */
function MostrarMapaSitio(Idmenu) {
    $("#MapaSitio").append(m.get(Idmenu));
}

//#endregion

//#region generación del perfil e informacion del usuario

var fn_getPerfilUsuario = function (user) {

    $.ajax({
        url: '/PerfilUsuarios/GetPerfilUsuario',
        data: { User: user }
    }).done(function (data) {
        fn_MostrarPerfil(data);
    });

};

var fn_MostrarPerfil = function (data) {
    // Mostrar Nombre del Usuario
    $("#dropDowNombreUser").children().remove();
    $("#dropDowNombreUser").append(fn_FiltrarJsonResult(data, "displayname"));

    $("#MyUserName").children().remove();
    $("#MyUserName").append(fn_FiltrarJsonResult(data, "givenname"));

    // mostrar Mail del Usuario
    $("#MailSeccion1").children().remove();
    $("#MailSeccion1").append(fn_FiltrarJsonResult(data, "mail"));


    // mostrar cargo en la compañia
    $("#MyPosition").children().remove();
    $("#MyPosition").append(fn_FiltrarJsonResult(data, "description"));

    // mostrar Mail del Usuario
    //$("#btnVerPerfil").children().remove();
    //$("#btnVerPerfil").append("Ver Perfil");

    // Mostrar Photo
    $("#MyPhoto1").children().remove();
    $("#MyPhoto1").append('<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle" />' )
    
    $("#MyPhoto2").children().remove();
    $("#MyPhoto2").append('<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle" />')

    $("#MyPhoto3").children().remove();
    $("#MyPhoto3").append('<img src="/Images/DefaultUser.png" alt="image profile" class="avatar-img rounded">')

};

//#endregion generación del perfil e informacion del usuario