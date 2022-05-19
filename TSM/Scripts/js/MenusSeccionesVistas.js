var Permisos;

$(document).ready(function () {
    // validar permisos
    var ValidPermisos = $("#FrmMenuPermiso").kendoValidator().data("kendoValidator");

    var Valid = $("#FrmMenu").kendoValidator(
        {
            rules: {
                MsgEtiquetaMenu: function (input) {
                    if (input.is("[name='TxtEtiquetaMenu']")) {
                        return input.val().length <= 8000;
                    }
                    return true;
                },
                MsgControlador: function (input) {
                    if (input.is("[name='TxtControlador']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                },
                MsgAccion: function (input) {
                    if (input.is("[name='TxtAccion']")) {
                        return input.val().length <= 200;
                    }
                    return true;
                }

            },
            messages: {

                MsgEtiquetaMenu: "Longitud máxima del campo es 8000",
                MsgControlador: "Longitud máxima del campo es 200",
                MsgAccion: "Longitud máxima del campo es 200",
                required: "Requerido"

            }
        }).data("kendoValidator");

    const fn_getMenu = () => {
        kendo.ui.progress($("#MenuTreeView"), true);

        $.ajax({
            url: UrlMenu + "/GetMenusPublicos",
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                kendo.ui.progress($("#MenuTreeView"), false);
                RequestEndMsg(respuesta, "Get");
            },
            error: function (respuesta) {
                kendo.ui.progress($("#MenuTreeView"), false);
                ErrorMsg(respuesta);
            }

        });
    }

    const fn_InsMenuSeccionRol = (IdMenu, IdSeccion, IdRol, IdUsuarioMod) => {
        kendo.ui.progress($("#MenuTreeView"), true);

        let Url = UrlMenusSeccionesVistas + "/InsSecciones/" + IdMenu.toString() + "/" + IdSeccion.toString() + "/" + IdRol.toString() + "/" + IdUsuarioMod;

        $.ajax({
            url: Url,
            type: 'Post',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#RolesTreeView").data("kendoTreeView").dataSource.read();
                RequestEndMsg(data, 'Post');
                kendo.ui.progress($("#MenuTreeView"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#MenuTreeView"), false);
                ErrorMsg(data);
            }
        });
    }

    const fn_BorrarMenuSeccionRol = () => {
        kendo.ui.progress($("#MenuTreeView"), true);

        let selected = $("#RolesTreeView").data("kendoTreeView").select();
        let item = $("#RolesTreeView").data("kendoTreeView").dataItem(selected);

        $.ajax({
            url: UrlMenusSeccionesVistas + "/DelArbolMenuPublico/" + item.IdMenu.toString() + "/" + item.IdSeccion.toString() + "/" + Kendo_CmbGetvalue($("#CmbRoles")).toString(),
            type: "Delete",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#RolesTreeView").data("kendoTreeView").dataSource.read();
                RequestEndMsg(data, "Delete");
                kendo.ui.progress($("#MenuTreeView"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#MenuTreeView"), false);
                ErrorMsg(data);
            }
        });
    }

    const fn_getMenuRol = (IdRol, IdMenu, IdSeccion) => {
        kendo.ui.progress($("#RolesTreeView"), true);
        $.ajax({
            url: UrlMenusSeccionesVistas + "/" + IdRol.toString() + "/" + IdMenu.toString() + "/" + IdSeccion.toString(),
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                if (respuesta !== null) {
                    $("#MenuPermiso").modal();
                    $('#chkAgregar').prop('checked', respuesta.Agregar);
                    $('#chkEditar').prop('checked', respuesta.Editar);
                    $('#chkBorrar').prop('checked', respuesta.Borrar);
                    $('#chkProcesar').prop('checked', respuesta.Procesar);
                    $('#chkConfidencial').prop('checked', respuesta.Confidencial);
                    $('#chkCambiarEstados').prop('checked', respuesta.CambiarEstados);
                }
                kendo.ui.progress($("#RolesTreeView"), false);
                RequestEndMsg(respuesta, "Get");
            },
            error: function (respuesta) {
                kendo.ui.progress($("#RolesTreeView"), false);
                ErrorMsg(respuesta);
            }
        });
    }

    const fn_GuardarMenuRol = (IdRol, IdMenu, IdSeccion, Type, Fecha, IdUsuarioMod, Agregar, Editar, Borrar, Procesar, Confidencial, CambiarEstados) => {
        kendo.ui.progress($("#MenuTreeView"), true);
        let Url = "";
        if (Type === "Post") {
            Url = UrlMenusSeccionesVistas;
        } else {
            Url = UrlMenusSeccionesVistas + "/" + IdRol.toString() + "/" + IdMenu.toString() + "/" + IdSeccion.toString();
        }
        console.log("guardar");

        $.ajax({
            url: Url,
            type: Type,
            dataType: "json",
            data: JSON.stringify({
                IdRol: IdRol,
                IdMenu: IdMenu,
                IdSeccion: IdSeccion,
                Fecha: Fecha,
                IdUsuarioMod: IdUsuarioMod,
                Agregar: Agregar,
                Editar: Editar,
                Borrar: Borrar,
                Procesar: Procesar,
                Confidencial: Confidencial,
                CambiarEstados: CambiarEstados
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                RequestEndMsg(data, Type);
                Type === "Put" ? $("#MenuPermiso").modal('hide') : $("#RolesTreeView").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#MenuTreeView"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#MenuTreeView"), false);
                ErrorMsg(data);
            }
        });
    }

    //#region MenuTree

    var dsMenuTreeView = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: UrlMenu + "/GetMenusPublicos",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: "GET"
            }
        },
        schema: {
            type: "json",
            model: {
                id: "IdMenu",
                hasChildren: "TieneOpciones"
            }
        }
    });

    $("#MenuTreeView").kendoTreeView({
        autoScroll: true,
        loadOnDemand: false,
        dataSource: dsMenuTreeView,
        dataTextField: "EtiquetaMenu",
        dataValueField: "IdMenu",
        dragAndDrop: true
    });

    $("#MenuTreeView").data("kendoTreeView").bind("dataBound", function (e) { //foco en la fila
        if ($("#MenuTreeView").data("kendoTreeView").dataSource.total() === 0) {
            $("#CmbRoles").data("kendoComboBox").enable(false);

        } else {
            $("#CmbRoles").data("kendoComboBox").enable(true);
            var tv = $("#MenuTreeView").data("kendoTreeView");
            tv.expand(".k-item");
        }
    });

    $("#MenuTreeView").data("kendoTreeView").bind("change", function (e) {
        console.log("change");
        var selected = $("#MenuTreeView").data("kendoTreeView").select(),
            item = $("#MenuTreeView").data("kendoTreeView").dataItem(selected);
        if (item) {
            fn_getMenu();
        } else {
            alert('Nothing selected');
        }
    });

    //#endregion MenuTree

    //#region Buttons

    $("#btnFlechaDerecha").kendoButton({ icon: "arrow-chevron-right" });
    $("#btnFlechaIzq").kendoButton({ icon: "arrow-chevron-left" });
    $("#btnFlechaDerecha").data("kendoButton").enable(false);
    $("#btnFlechaIzq").data("kendoButton").enable(false);

    $("#btnFlechaDerecha").click(function (e) {
        e.preventDefault();

        let selected = $("#MenuTreeView").data("kendoTreeView").select();
        let item = $("#MenuTreeView").data("kendoTreeView").dataItem(selected);

        if (item) {
            fn_InsMenuSeccionRol(item.IdMenu, item.IdSeccion, Kendo_CmbGetvalue($("#CmbRoles")), getUser());
        }        
    });

    $("#btnFlechaIzq").click(function (event) {
        event.preventDefault();
        fn_BorrarMenuSeccionRol();
    });

    //#endregion Buttons

    //#region RolesMenu

    Kendo_CmbFiltrarGrid($("#CmbRoles"), UrlRoles, "Nombre", "IdRol", "Seleccione", 350, "");

    $("#CmbRoles").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            var treeview = $("#RolesTreeView").data("kendoTreeView");
            treeview.setDataSource(
                new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: UrlMenusRoles + "/GetMenuRolArbolesPublico/" + this.dataItem(e.item.index()).IdRol,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            type: "GET"
                        }
                    },
                    schema: {
                        type: "json",
                        model: {
                            id: "IdMenu",
                            hasChildren: "TieneOpciones"
                        }
                    }
                }));
            $("#btnFlechaDerecha").data("kendoButton").enable(true);
        }
        else {
            $("#RolesTreeView").data("kendoTreeView").dataSource.data([]);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);
        }
    });

    $("#CmbRoles").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#RolesTreeView").data("kendoTreeView").dataSource.data([]);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);

        }
    });

    var dsMenusRoles = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: UrlMenusRoles + "/GetMenuRolArbolesPublico/" + Kendo_CmbGetvalue($("#CmbRoles")),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: "GET"
            }
        },
        schema: {
            type: "json",
            model: {
                id: "IdMenu",
                hasChildren: "TieneOpciones"
            }
        }
    });

    $("#RolesTreeView").kendoTreeView({
        autoScroll: true,
        loadOnDemand: false,
        dataSource: dsMenusRoles,
        dataTextField: "EtiquetaMenu",
        dataValueField: "IdMenu"
    });

    $("#RolesTreeView").data("kendoTreeView").bind("dataBound", function (e) { //foco en la fila
        if ($("#RolesTreeView").data("kendoTreeView").dataSource.total() === 0) {
            $("#btnFlechaIzq").data("kendoButton").enable(false);
        } else {
            $("#btnFlechaIzq").data("kendoButton").enable(true);
            var tv = $("#RolesTreeView").data("kendoTreeView");
            tv.expand(".k-item");
        }

        $("#RolesTreeView .k-in").on("dblclick", function (e) {
            var node = $(e.target).closest(".k-item");

            if ($("#RolesTreeView").getKendoTreeView().dataItem(node) && $("#RolesTreeView").getKendoTreeView().dataItem(node).Nivel === 2) {
                fn_getMenuRol(Kendo_CmbGetvalue($("#CmbRoles")), $("#RolesTreeView").getKendoTreeView().dataItem(node).IdMenu, $("#RolesTreeView").getKendoTreeView().dataItem(node).IdSeccion);
            }
        });
    });

    //#endregion RolesMenu

    //#region ModalPermisos

    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnAceptar"), "check", "Aceptar");

    $("#btnAceptar").click(function (event) {
        event.preventDefault();
        if (ValidPermisos.validate()) {
            let selected = $("#RolesTreeView").data("kendoTreeView").select();
            let item = $("#RolesTreeView").data("kendoTreeView").dataItem(selected);

            ConfirmacionMsg("¿Está seguro de asignar los permisos a la opción del menu? ", function () {
                return fn_GuardarMenuRol(Kendo_CmbGetvalue($("#CmbRoles")), item.IdMenu, item.IdSeccion, "Put", new Date(), getUser(), $("#chkAgregar").is(':checked'),
                    $("#chkEditar").is(':checked'), $("#chkBorrar").is(':checked'), $("#chkProcesar").is(':checked'), $("#chkConfidencial").is(':checked'), $("#chkCambiarEstados").is(':checked'));
            });
        }
    });

    //#endregion ModalPermisos



});

fPermisos = function (datos) {
    Permisos = datos;
};