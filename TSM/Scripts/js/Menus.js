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

    $("#tabstrip-left").kendoTabStrip({
        
        animation: { open: { effects: "fadeIn" } }
    });

    OcultarTab($("#tabstrip-left"), 1)
 
    KdoButton($("#btnNuevo"),"plus","Nuevo");
    KdoButton($("#btnGuardar"),"save","Guardar");
    KdoButton($("#btnEliminar"),"delete","Eliminar");
    KdoButton($("#btnEditar"), "edit" ,"Editar");
    KdoButton($("#btnCancelar"), "cancel", "Cancelar");
    KdoButton($("#btnCerrar"), "cancel", "Cancelar");
    KdoButton($("#btnAceptar"), "check", "Aceptar");
    KdoButton($("#btnSecciones"));


    $("#btnFlechaDerecha").kendoButton({ icon: "arrow-chevron-right" });
    $("#btnFlechaIzq").kendoButton({ icon: "arrow-chevron-left" });
    $("#btnFlechaDerecha").data("kendoButton").enable(false);
    $("#btnFlechaIzq").data("kendoButton").enable(false);
    


    Kendo_CmbFiltrarGrid($("#CmbRoles"), UrlRoles, "Nombre", "IdRol", "Seleccione", 350, "");
    Kendo_CmbFiltrarGrid($("#CmbIdUsuario"), UrlUsuarios, "Nombre", "IdUsuario", "Seleccione ...", "", "");
    Kendo_CmbFiltrarGrid($("#cmbModulo"), UrlModulo, "Nombre", "IdModulo", "Seleccione", 350, "");

    $("#CmbMenuPadre").kendoComboBox({
        dataTextField: "EtiquetaOpcion",
        dataValueField: "IdMenu",
        autoWidth: true,
        filter: "contains",
        autoBind: true,
        placeholder: "Seleccione un valor ....",
        height: 550,
        cascadeFrom: "cmbModulo",
        dataSource: {
            type: "JSON",
            transport: {
                read: {
                    url: UrlMenu + "/GetMenusOpciones"
                }
            }
        }
    });

    $("#CmbIdCatalogoFuente").kendoComboBox({
        dataTextField: "Nombre",
        dataValueField: "IdCatalogoFuente",
        autoWidth: true,
        filter: "contains",
        //autoBind: false,
        placeholder: "Seleccione ...",
        height:  550,
        cascadeFrom: "",
        headerTemplate: '<div class="dropdown-header k-widget k-header">' +
            '<span>Icono</span>' +
            '<span>Fuente</span>' +
            '</div>',
        template: '<span class="#:data.Fuente#" ></span>' +
            '<span class="k-state-default"><h5>#:data.Nombre#</h5><p>#: data.Fuente #</p></span>',
        dataSource: {
            type: "JSON",
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: {
                    url: UrlCatalogoFuentes
                }
            }
        }
    });

    $("#btnGuardar").data("kendoButton").enable(false);
    $("#btnEliminar").data("kendoButton").enable(false);
    $("#btnCancelar").data("kendoButton").enable(false);
    $("#btnNuevo").data("kendoButton").enable(false);
    $("#btnEditar").data("kendoButton").enable(false);
    $("#btnSecciones").data("kendoButton").enable(false);

    fn_Habilitar(false);
    //#region Inicializar
    var dataSource = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: UrlMenu + "/GetbyIdModulo/" + Kendo_CmbGetvalue($("#cmbModulo")),
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
    var dsMenus = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: UrlMenuRoles + "/GetMenuRolArboles/" + Kendo_CmbGetvalue($("#CmbRoles")),
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
    var dsMenusUsuario = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                url: UrlMenuRoles + "/GetMenuRolArboles/" + Kendo_CmbGetvalue($("#CmbRoles")),
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

    $("#treeview").kendoTreeView({
        autoScroll: true,
        loadOnDemand: false,
        dataSource: dataSource,
        dataTextField: "EtiquetaMenu",
        dataValueField: "IdMenu",
        dragAndDrop: true
    });

    $("#treeviewRoles").kendoTreeView({
        autoScroll: true,
        loadOnDemand: false,
        dataSource: dsMenus,
        dataTextField: "EtiquetaMenu",
        dataValueField: "IdMenu"
    });

    $("#treeviewMenuUsuario").kendoTreeView({
        autoScroll: true,
        loadOnDemand: false,
        dataSource: dsMenusUsuario,
        dataTextField: "EtiquetaMenu",
        dataValueField: "IdMenu"
    });

    //#endregion 

    //#region programacion Menu

 
    $("#treeview").data("kendoTreeView").bind("dataBound", function (e) { //foco en la fila
        if($("#treeview").data("kendoTreeView").dataSource.total() === 0) {
            $("#btnEditar").data("kendoButton").enable(false);
            $("#CmbRoles").data("kendoComboBox").enable(false);
          
        } else {
            $("#btnEditar").data("kendoButton").enable(true);
            $("#CmbRoles").data("kendoComboBox").enable(true);
            var tv = $("#treeview").data("kendoTreeView");
            tv.expand(".k-item");
        }

        $("#treeview .k-in").on("dblclick", function (e) {
            var node = $(e.target).closest(".k-item");
            // evaluo se ya fue abierto la ventana modal
            if ($("#vCambioEstado").data("kendoDialog").options.visible == false) {
                Fn_VistaCambioEstadoMostrar("Menus", $("#treeview").getKendoTreeView().dataItem(node).Estado, UrlMenu + "/Menus_CambiarEstado", "", $("#treeview").getKendoTreeView().dataItem(node).IdMenu);
            }
        });

    });

    $("#treeview").data("kendoTreeView").bind("change", function (e) {
        var selected = $("#treeview").data("kendoTreeView").select(),
            item = $("#treeview").data("kendoTreeView").dataItem(selected);
        if (item) {

            fn_Habilitar(false);
            $("#btnGuardar").data("kendoButton").enable(false);
            $("#btnEliminar").data("kendoButton").enable(false);
            $("#btnCancelar").data("kendoButton").enable(false);
            $("#btnEditar").data("kendoButton").enable(true);
            $("#btnNuevo").data("kendoButton").enable(true);

            fn_getMenu(item.IdMenu);
        } else {
            alert('Nothing selected');
        }
        
    });

    $("#treeview").data("kendoTreeView").bind("drop", function (e) {
        var nodoDestino = $("#treeview").data("kendoTreeView").dataItem(e.destinationNode);
        var nodoOrigen = $("#treeview").data("kendoTreeView").dataItem(e.sourceNode);

        if (e.valid && nodoDestino != undefined && nodoOrigen != undefined) {
            kendo.ui.progress($("#treeview"), true);
            $.ajax({
                url: UrlMenu + "/Menu_Reordenar/",
                type: "post",
                async: false,
                data: JSON.stringify({ IdMenuOrigen: nodoOrigen.IdMenu, IdMenuDestino: nodoDestino.IdMenu, colocarAbajo: e.dropPosition == "after" }),
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    kendo.ui.progress($("#treeview"), false);
                    RequestEndMsg(data, "Post");
                },
                error: function (data) {
                    kendo.ui.progress($("#treeview"), false);
                    e.setValid(false);
                    ErrorMsg(data);
                }
            });
        }
        else {
            e.setValid(false);
        }
    });

    $("#treeview").data("kendoTreeView").bind("drag", function (e) {
        var nodoDestino = $("#treeview").data("kendoTreeView").dataItem(e.dropTarget);
        var nodoOrigen = $("#treeview").data("kendoTreeView").dataItem(e.sourceNode);

        if (nodoDestino != undefined) {
            if (nodoDestino.TieneOpciones == true || e.statusClass.indexOf("plus") >= 0) {
                e.setStatusClass("k-i-cancel");
            }
        }
    });

    $("#treeview").data("kendoTreeView").bind("dragstart", function (e) {
        var nodo = $("#treeview").data("kendoTreeView").dataItem(e.sourceNode);

        if (nodo.TieneOpciones == true) e.preventDefault();
    });

    $("#treeviewRoles").data("kendoTreeView").bind("dataBound", function (e) { //foco en la fila
        if ($("#treeviewRoles").data("kendoTreeView").dataSource.total() === 0) {
            $("#btnFlechaIzq").data("kendoButton").enable(false);
        } else {
            $("#btnFlechaIzq").data("kendoButton").enable(true);
            var tv = $("#treeviewRoles").data("kendoTreeView");
            tv.expand(".k-item");
        }

        $("#treeviewRoles .k-in").on("dblclick", function (e) {
            var node = $(e.target).closest(".k-item");
            if ($("#treeviewRoles").getKendoTreeView().dataItem(node) && $("#treeviewRoles").getKendoTreeView().dataItem(node).Nivel===3) {
                fn_getMenuRol(Kendo_CmbGetvalue($("#CmbRoles")), $("#treeviewRoles").getKendoTreeView().dataItem(node).IdMenu);
            }
        });
        
    });

   
   

    $("#treeviewMenuUsuario").data("kendoTreeView").bind("dataBound", function (e) { //foco en la fila
        if ($("#treeviewMenuUsuario").data("kendoTreeView").dataSource.total() === 0) {
            $("#btnFlechaIzq").data("kendoButton").enable(false);
        } else {
            $("#btnFlechaIzq").data("kendoButton").enable(true);
            var tv = $("#treeviewMenuUsuario").data("kendoTreeView");
            tv.expand(".k-item");
        }

        $("#treeviewMenuUsuario .k-in").on("dblclick", function (e) {
            var node = $(e.target).closest(".k-item");
            if ($("#treeviewMenuUsuario").getKendoTreeView().dataItem(node) && $("#treeviewMenuUsuario").getKendoTreeView().dataItem(node).Nivel===3) {
                fn_getMenuUsuario(Kendo_CmbGetvalue($("#CmbIdUsuario")), $("#treeviewMenuUsuario").getKendoTreeView().dataItem(node).IdMenu);
            }
        });

    });

  

    $("#btnEditar").data("kendoButton").bind("click", function (e) {
        fn_Habilitar(true);

        if ($("#TxtNivel").val() === "3") {
            $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(false);
        } else {
            $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(true);
        }

        if ($("#chkMenuPublico").is(':checked')) {
            $("#btnSecciones").data("kendoButton").enable(true);
        }

        HabilitaObje($("#TxtControlador"), true);
        HabilitaObje($("#TxtAccion"), true);
        HabilitaObje($("#TxtUrl"), true);

        $("#btnGuardar").data("kendoButton").enable(true);
        $("#btnEliminar").data("kendoButton").enable(true);
        $("#btnCancelar").data("kendoButton").enable(true);
        $("#btnEditar").data("kendoButton").enable(false);
        $("#btnNuevo").data("kendoButton").enable(false);
        $("#TxtEtiquetaMenu").focus();

    });

    $("#btnCancelar").data("kendoButton").bind("click", function (e) {
        fn_Habilitar(false);
        $("#btnGuardar").data("kendoButton").enable(false);
        $("#btnEliminar").data("kendoButton").enable(false);
        $("#btnCancelar").data("kendoButton").enable(false);
        $("#btnSecciones").data("kendoButton").enable(false);

        if ($("#treeview").data("kendoTreeView").dataSource.total() === 0) {
            $("#btnEditar").data("kendoButton").enable(false);
        } else {
            $("#btnEditar").data("kendoButton").enable(true);
        }

        $("#btnNuevo").data("kendoButton").enable(true);

        let selected = $("#treeview").data("kendoTreeView").select(),
            item = $("#treeview").data("kendoTreeView").dataItem(selected);
        if (item) {fn_getMenu(item.IdMenu); } 
    });

    $("#btnNuevo").data("kendoButton").bind("click", function (e) {
        $("#TxtNivel").val("");
        $("#TxtIdMenu").val("");
        $("#TxtEtiquetaMenu").val("");
        $("#TxtUrl").val("");
        $("#CmbIdCatalogoFuente").data("kendoComboBox").value("");
        $("#TxtControlador").val("");
        $("#TxtAccion").val("");
        $("#CmbMenuPadre").data("kendoComboBox").enable(true);
        HabilitaObje($("#TxtEtiquetaMenu"), true);
        $("#btnGuardar").data("kendoButton").enable(true);
        fn_HabilitaCampodeVista();
        $("#btnEliminar").data("kendoButton").enable(false);
        $("#btnCancelar").data("kendoButton").enable(true);
        $("#btnEditar").data("kendoButton").enable(false);
        $("#btnNuevo").data("kendoButton").enable(false);
        $("#chkMenuPublico").attr("disabled", false);
        $("#chkMenuPublico").prop("checked", false);
        HabilitaObje($("#TxtControlador"), true);
        HabilitaObje($("#TxtAccion"), true);
        HabilitaObje($("#TxtUrl"), true);
        $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(true);
    });

    $("#CmbRoles").data("kendoComboBox").bind("select", function (e) {

        if (e.item) {
            var treeview = $("#treeviewRoles").data("kendoTreeView");
            treeview.setDataSource(
                new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: UrlMenuRoles + "/GetMenuRolArboles/" + this.dataItem(e.item.index()).IdRol,
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
            
            $("#treeviewRoles").data("kendoTreeView").dataSource.data([]);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);
        }

    });

    $("#CmbRoles").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#treeviewRoles").data("kendoTreeView").dataSource.data([]);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);
           
        }
    });

    $("#CmbIdUsuario").data("kendoComboBox").bind("select", function (e) {

        if (e.item) {
            var treeview = $("#treeviewMenuUsuario").data("kendoTreeView");
            treeview.setDataSource(
                new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: UrlMenusUsuarios + "/GetMenusUsuariosArboles/" + this.dataItem(e.item.index()).IdUsuario,
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

            $("#treeviewMenuUsuario").data("kendoTreeView").dataSource.data([]);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);
        }

    });

    $("#CmbIdUsuario").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#treeviewMenuUsuario").data("kendoTreeView").dataSource.data([]);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);

        }
    });

    $("#CmbMenuPadre").data("kendoComboBox").bind("change", function (e) {
   
            fn_HabilitaCampodeVista();
   
    });

    $("#cmbModulo").data("kendoComboBox").bind("select", function (e) {

        if (e.item) {
            var treeview = $("#treeview").data("kendoTreeView");
            treeview.setDataSource(
                new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: UrlMenu + "/GetbyIdModulo/" + this.dataItem(e.item.index()).IdModulo,
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

            $("#btnNuevo").data("kendoButton").enable(true);
            $("#btnGuardar").data("kendoButton").enable(false);
          
        }
        else {

            $("#treeview").data("kendoTreeView").dataSource.data([]);
            $("#btnEditar").data("kendoButton").enable(false);
            $("#btnNuevo").data("kendoButton").enable(false);
        
        }

    });

    $("#cmbModulo").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            $("#treeview").data("kendoTreeView").dataSource.data([]);
            $("#treeviewRoles").data("kendoTreeView").dataSource.data([]);
            $("#CmbRoles").data("kendoComboBox").value("");
            $("#btnEditar").data("kendoButton").enable(false);
            $("#btnFlechaDerecha").data("kendoButton").enable(false);
            $("#btnNuevo").data("kendoButton").enable(false);
            $("#btnGuardar").data("kendoButton").enable(false);
            fn_Limpiar();
          
        }
    });

    function fn_getMenu(IdMenu) {

        kendo.ui.progress($("#treeview"),true);

        $.ajax({
            url: UrlMenu + "/GetMenuByIdMenu/" + IdMenu.toString(),
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                $("#CmbMenuPadre").data("kendoComboBox").value(respuesta.IdMenuPadre);
                $("#TxtIdMenu").val(respuesta.IdMenu);
                $("#TxtNivel").val(respuesta.Nivel);
                $("#TxtUrl").val(respuesta.Url);
                $("#TxtControlador").val(respuesta.Controlador);
                $("#TxtAccion").val(respuesta.Accion);
                $("#TxtEtiquetaMenu").val(respuesta.EtiquetaMenu);
                $("#CmbIdCatalogoFuente").data("kendoComboBox").value(respuesta.IdCatalogoFuente);
                $("#TxtEstado").val(respuesta.Estado);
                $("#chkMenuPublico").prop("checked", respuesta.Publico);
                kendo.ui.progress($("#treeview"), false);
                RequestEndMsg(respuesta, "Get");
            },
            error: function (respuesta) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(respuesta);
            }

        });
    }

    function fn_Limpiar() {
    
        $("#CmbMenuPadre").data("kendoComboBox").value("");
        $("#TxtIdMenu").val("");
        $("#TxtNivel").val("");
        $("#TxtEtiquetaMenu").val("");
        $("#TxtUrl").val("");
        $("#TxtControlador").val("");
        $("#TxtAccion").val("");
        $("#CmbIdCatalogoFuente").data("kendoComboBox").value("");
        $("#chkMenuPublico").prop("checked", false);
    }

    function fn_getSetCodigoMenuPadre(IdMenuPadre) {

        var NewDS = {
            type: "JSON",
            transport: {
                read: function (datos) {
                    $.ajax({
                        type: "Get",
                        dataType: 'json',
                        url: UrlMenu + "/GetMenusOpciones",
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            datos.success(result);
                            $("#CmbMenuPadre").data("kendoComboBox").value(IdMenuPadre);
                        }
                    });
                }

            }
        };
        $("#CmbMenuPadre").data("kendoComboBox").setDataSource(NewDS);
    }

    function fn_Habilitar(bool) {
        $("#TxtIdMenu").val() === "" ? $("#CmbMenuPadre").data("kendoComboBox").enable(bool) : $("#CmbMenuPadre").data("kendoComboBox").enable(false);
        HabilitaObje($("#TxtEtiquetaMenu"), bool);
        HabilitaObje($("#TxtUrl"), bool);
        HabilitaObje($("#TxtControlador"), bool);
        HabilitaObje($("#TxtAccion"), bool);
        $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(bool);
        $("#chkMenuPublico").attr("disabled", !bool);
    }

    function fn_HabilitaCampodeVista() {

        if (Kendo_CmbGetvalue($("#CmbMenuPadre")) !== 0) {
            var selected = $("#CmbMenuPadre").data("kendoComboBox").select(),
                item = $("#CmbMenuPadre").data("kendoComboBox").dataItem(selected)
            $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(false); 
            // cuando el nivel sea del Menu padre , evaluar condicion.
            if (item.Nivel === 2) {
                HabilitaObje($("#TxtUrl"), true);
                HabilitaObje($("#TxtControlador"), true);
                HabilitaObje($("#TxtAccion"), true);
                HabilitaObje($("#TxtEtiquetaMenu"), true);
                $("#chkMenuPublico").attr("disabled", false);
                $("#btnGuardar").data("kendoButton").enable(true);
                $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(true); 
                $("#TxtEtiquetaMenu").focus();
            } else {
                if (item.Nivel === 3) {
                    $("#btnGuardar").data("kendoButton").enable(false);
                    HabilitaObje($("#TxtEtiquetaMenu"), false);
                    $("#chkMenuPublico").attr("disabled", true);
                    Kendo_CmbFocus($("#CmbMenuPadre"));
                }
                item.Nivel === 1 ? $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(true) : $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(false);
                HabilitaObje($("#TxtUrl"), false);
                HabilitaObje($("#TxtControlador"), false);
                HabilitaObje($("#TxtAccion"), false);
                $("#TxtEtiquetaMenu").focus();
            }
        }
        else {
            HabilitaObje($("#TxtUrl"), false);
            HabilitaObje($("#TxtControlador"), false);
            HabilitaObje($("#TxtAccion"), false);
            $("#chkMenuPublico").attr("disabled", true);
            $("#CmbIdCatalogoFuente").data("kendoComboBox").enable(false); 
            $("#btnGuardar").data("kendoButton").enable(true);
            $("#TxtEtiquetaMenu").focus();
        }
    }

    function fn_getMenuRol(IdRol, IdMenu) {
        kendo.ui.progress($("#treeviewRoles"), true);
        $.ajax({
            url: UrlMenuRoles + "/" + IdRol.toString() + "/"+ IdMenu.toString(),
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
                kendo.ui.progress($("#treeviewRoles"), false);
                RequestEndMsg(respuesta, "Get");
            },
            error: function (respuesta) {
                kendo.ui.progress($("#treeviewRoles"), false);
                ErrorMsg(respuesta);
            }

        });
    }

    function fn_getMenuUsuario(IdUsuario, IdMenu) {
        kendo.ui.progress($("#treeviewMenuUsuario"), true);
        $.ajax({
            url: UrlMenusUsuarios + "/" + IdUsuario.toString() + "/" + IdMenu.toString(),
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
                }
                kendo.ui.progress($("#treeviewMenuUsuario"), false);

            },
            error: function (respuesta) {
                kendo.ui.progress($("#treeviewMenuUsuario"), false);
                ErrorMsg(respuesta);
            }

        });
    }

    //#endregion 

    //#region "CRUD Menu"

    $("#btnEliminar").click(function (event) {
        event.preventDefault();
        ConfirmacionMsg("¿Está seguro de eliminar la opcion de menu: " +
            $("#TxtIdMenu").val() + " " + $("#TxtEtiquetaMenu").val() + "?", function () { return fn_Eliminar(); });
    });

    $("#btnGuardar").click(function (event) {
        event.preventDefault();
        if (Valid.validate()) {
            fn_Guardar();
        }
    });

    function fn_Eliminar() {

        kendo.ui.progress($("#treeview"), true);
        $.ajax({
            url: UrlMenu + "/DeleteMenu/" + $("#TxtIdMenu").val(),
            type: "Delete",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                kendo.ui.progress($("#treeview"), false);
                fn_Limpiar();
                fn_Habilitar(false);
                $("#btnGuardar").data("kendoButton").enable(false);
                $("#btnEliminar").data("kendoButton").enable(false);
                $("#btnCancelar").data("kendoButton").enable(false);
                $("#btnSecciones").data("kendoButton").enable(false);
                $("#btnEditar").data("kendoButton").enable(true);
                $("#btnNuevo").data("kendoButton").enable(true);
                $("#treeview").data("kendoTreeView").dataSource.read();
                $("#treeviewRoles").data("kendoTreeView").dataSource.read();
                fn_getSetCodigoMenuPadre("");
                RequestEndMsg(data, "Delete");
            },
            error: function (e) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(e);
            }
        });
    }

    function fn_Guardar() {
        kendo.ui.progress($("#treeview"), true);
        var XType = "";
        var Url = "";
        let estado = "";
        if ($("#TxtIdMenu").val() === "") {
            XType = "Post";
            Url = UrlMenu;
            estado = "REGISTRADO";
        } else {
            XType = "Put";
            Url = UrlMenu + "/" + $("#TxtIdMenu").val();
            estado = $("#TxtEstado").val();
        }

        $.ajax({
            url: Url,//
            type: XType,
            dataType: "json",
            data: JSON.stringify({
                IdMenu: $("#TxtIdMenu").val(),
                EtiquetaMenu: $("#TxtEtiquetaMenu").val(),
                IdMenuPadre: $("#CmbMenuPadre").data("kendoComboBox").value(),
                Url: $("#TxtUrl").val(),
                Controlador: $("#TxtControlador").val(),
                Accion: $("#TxtAccion").val(),
                IdCatalogoFuente: $("#CmbIdCatalogoFuente").data("kendoComboBox").value(),
                IdModulo: $("#cmbModulo").data("kendoComboBox").value(),
                Estado: estado,
                Publico: $("#chkMenuPublico").is(':checked')
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#TxtIdMenu").val(data[0].IdMenu);
                $("#TxtNivel").val(data[0].Nivel);
                $("#TxtEstado").val(data[0].Estado);
                fn_getSetCodigoMenuPadre(data[0].IdMenuPadre);
                fn_Habilitar(false);
                $("#btnGuardar").data("kendoButton").enable(false);
                $("#btnEliminar").data("kendoButton").enable(false);
                $("#btnCancelar").data("kendoButton").enable(false);
                $("#btnSecciones").data("kendoButton").enable(false);
                $("#btnEditar").data("kendoButton").enable(true);
                $("#btnNuevo").data("kendoButton").enable(true);

                $("#treeview").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#treeview"), false);
                RequestEndMsg(data, XType);
            },
            error: function (data) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(data);
            }
        });
    }

    //#endregion

    //#region CRUD MENU ROLES
    $("#btnFlechaDerecha").click(function (event) {
        event.preventDefault();

        var tab = $("#tabstrip-left").data("kendoTabStrip");
        var selected = $("#treeview").data("kendoTreeView").select(),
            item = $("#treeview").data("kendoTreeView").dataItem(selected);
        if (tab.select().index() === 0) {

            if (item) {

                fn_InsMenuRol(Kendo_CmbGetvalue($("#CmbRoles")), item.IdMenu, getUser());
            }
        } else if (tab.select().index() === 1) {

            if (item) {
           
                fn_InsMenuUsuarios(Kendo_CmbGetvalue($("#CmbIdUsuario")), item.IdMenu, getUser());
            }
        }
        
          
    });

    $("#btnFlechaIzq").click(function (event) {
        event.preventDefault();
        var tab = $("#tabstrip-left").data("kendoTabStrip");
        if (tab.select().index() === 0) {
            fn_BorrarMenuRol();
        } else if (tab.select().index() === 1) {
             fn_BorrarMenuUsuarios();
        }
      
    });

    $("#btnAceptar").click(function (event) {
        event.preventDefault();
        if (ValidPermisos.validate()) {
            var tab = $("#tabstrip-left").data("kendoTabStrip");
            if (tab.select().index() === 0) {
                var selected = $("#treeviewRoles").data("kendoTreeView").select(),
                    item = $("#treeviewRoles").data("kendoTreeView").dataItem(selected);

                ConfirmacionMsg("¿Está seguro de asignar los permisos a la opción del menu? ", function () {
                    return fn_GuardarMenuRol(Kendo_CmbGetvalue($("#CmbRoles")), item.IdMenu, "Put", new Date(), getUser(), $("#chkAgregar").is(':checked'),
                        $("#chkEditar").is(':checked'), $("#chkBorrar").is(':checked'), $("#chkProcesar").is(':checked'), $("#chkConfidencial").is(':checked'), $("#chkCambiarEstados").is(':checked'));
                });
            } else if (tab.select().index() === 1) {
                var selected = $("#treeviewMenuUsuario").data("kendoTreeView").select(),
                    item = $("#treeviewMenuUsuario").data("kendoTreeView").dataItem(selected);

                ConfirmacionMsg("¿Está seguro de asignar los permisos a la opción del menu? ", function () {
                    return fn_GuardarMenuUsuarios(Kendo_CmbGetvalue($("#CmbIdUsuario")), item.IdMenu, "Put", new Date(), getUser(), $("#chkAgregar").is(':checked'),
                        $("#chkEditar").is(':checked'), $("#chkBorrar").is(':checked'), $("#chkProcesar").is(':checked'), $("#chkConfidencial").is(':checked'));
                });
            }
           
        }

    });

    function fn_GuardarMenuRol(IdRol, IdMenu, Type, Fecha,IdUsuarioMod,Agregar,Editar,Borrar,Procesar,Confidencial,CambiarEstados) {
        kendo.ui.progress($("#treeview"), true);
      
        var Url = "";
        if (Type==="Post") {
           
            Url = UrlMenuRoles;
        } else {
            Url = UrlMenuRoles + "/" + IdRol.toString() + "/" + IdMenu.toString();
        }

        $.ajax({
            url: Url,//
            type: Type,
            dataType: "json",
            data: JSON.stringify({
                IdRol: IdRol,
                IdMenu: IdMenu,
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
                Type === "Put" ? $("#MenuPermiso").modal('hide'): $("#treeviewRoles").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#treeview"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(data);
            }
        });


    }

    function fn_BorrarMenuRol() {
        var selected = $("#treeviewRoles").data("kendoTreeView").select(),
            item = $("#treeviewRoles").data("kendoTreeView").dataItem(selected);

        kendo.ui.progress($("#treeview"), true);
        $.ajax({
            url: UrlMenuRoles + "/DeleteMenu/" + Kendo_CmbGetvalue($("#CmbRoles")).toString() + "/" + item.IdMenu.toString(),
            type: "Delete",
            dataType: "json",
            data: JSON.stringify({ IdAnalisisDiseno: null }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#treeviewRoles").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#treeview"), false);
                RequestEndMsg(data, "Delete");
            },
            error: function (data) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(data);
            }


        });

    }

    function fn_InsMenuRol(IdRol, IdMenu, IdUsuarioMod) {
        kendo.ui.progress($("#treeview"), true);
        var Url = UrlMenuRoles + "/InsMenu/" + IdRol.toString() + "/" + IdMenu.toString() + "/" + IdUsuarioMod;
        $.ajax({
            url: Url,//
            type: 'Post',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#treeviewRoles").data("kendoTreeView").dataSource.read();
                RequestEndMsg(data, 'Post');
                kendo.ui.progress($("#treeview"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(data);
            }
        });


    }
    //#endregion 

    //#region CRUD MENU Usuarios
   

    function fn_GuardarMenuUsuarios(IdUsuario, IdMenu, Type, Fecha, IdUsuarioMod, Agregar, Editar, Borrar, Procesar, Confidencial) {
        kendo.ui.progress($("#treeviewMenuUsuario"), true);

        var Url = "";
        if (Type === "Post") {

            Url = UrlMenusUsuarios;
        } else {
            Url = UrlMenusUsuarios + "/" + IdUsuario.toString() + "/" + IdMenu.toString();
        }

        $.ajax({
            url: Url,//
            type: Type,
            dataType: "json",
            data: JSON.stringify({
                IdUsuario: IdUsuario,
                IdMenu: IdMenu,
                Fecha: Fecha,
                IdUsuarioMod: IdUsuarioMod,
                Agregar: Agregar,
                Editar: Editar,
                Borrar: Borrar,
                Procesar: Procesar,
                Confidencial: Confidencial

            }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                RequestEndMsg(data, Type);
                Type === "Put" ? $("#MenuPermiso").modal('hide') : $("#treeviewMenuUsuario").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#treeviewMenuUsuario"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#treeviewMenuUsuario"), false);
                ErrorMsg(data);
            }
        });


    }

    function fn_BorrarMenuUsuarios() {
        var selected = $("#treeviewMenuUsuario").data("kendoTreeView").select(),
            item = $("#treeviewMenuUsuario").data("kendoTreeView").dataItem(selected);

        kendo.ui.progress($("#treeview"), true);
        $.ajax({
            url: UrlMenusUsuarios + "/DeleteMenu/" + Kendo_CmbGetvalue($("#CmbIdUsuario")).toString() + "/" + item.IdMenu.toString(),
            type: "Delete",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#treeviewMenuUsuario").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#treeview"), false);
                RequestEndMsg(data, "Delete");
            },
            error: function (data) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(data);
            }


        });

    }

    function fn_InsMenuUsuarios(IdUsuario, IdMenu, IdUsuarioMod) {
        kendo.ui.progress($("#treeview"), true);
        var Url = UrlMenusUsuarios + "/InsMenu/" + IdUsuario.toString() + "/" + IdMenu.toString() + "/" + IdUsuarioMod;
        $.ajax({
            url: Url,//
            type: 'Post',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#treeviewMenuUsuario").data("kendoTreeView").dataSource.read();
                kendo.ui.progress($("#treeview"), false);
                RequestEndMsg(data, 'Post');
            },
            error: function (data) {
                kendo.ui.progress($("#treeview"), false);
                ErrorMsg(data);
            }
        });


    }
    //#endregion 

    $("#tabstrip-left").data("kendoTabStrip").bind("select", function (e) {
        var tab = $("#tabstrip-left").data("kendoTabStrip");
        if (this.select().index() === 1) {
            $("#CmbRoles").data("kendoComboBox").value("");
            $("#btnFlechaDerecha").data("kendoButton").enable(false)
            $("#btnFlechaIzq").data("kendoButton").enable(false);
            if ($("#treeviewRoles").data("kendoTreeView").dataSource.total() !== 0) {
                $("#treeviewRoles").data("kendoTreeView").dataSource.data([]);
            }
        } else if (this.select().index() === 0) {
            $("#CmbIdUsuario").data("kendoComboBox").value("");
            $("#btnFlechaDerecha").data("kendoButton").enable(false)
            $("#btnFlechaIzq").data("kendoButton").enable(false);
            btnFlechaDerecha
            if ($("#treeviewMenuUsuario").data("kendoTreeView").dataSource.total() !== 0) {
                $("#treeviewMenuUsuario").data("kendoTreeView").dataSource.data([]);
            }
        }

    });

    // carga vista para el cambio de estado
    Fn_VistaCambioEstado($("#vCambioEstado"))

    $("#chkMenuPublico").click(function () {
        if ($("#TxtIdMenu").val() !== '') {
            let checked = $("#chkMenuPublico").is(':checked');
            $("#btnSecciones").data("kendoButton").enable(checked);
        }
    });

    $("#btnSecciones").click(function () {
        if ($("#TxtIdMenu").val() != '') {
            let strjson = {
                config: [{
                    Div: "vModIngresarSecciones",
                    Vista: "~/Views/Menus/_SeccionesMenuPublico.cshtml",
                    Js: "SeccionesMenuPublico.js",
                    Titulo: "Secciones de Menús Públicos",
                    Height: "75%",
                    Width: "70%",
                    MinWidth: "10%"
                }],
                Param: { sidMenu: $("#TxtIdMenu").val(), sDiv: "vModIngresarSecciones" },
                fn: { fnclose: "", fnLoad: "fn_Ini_SeccionMenuPublico", fnReg: "fn_Reg_CrearListaEmpaque", fnActi: "" }
            };
            fn_GenLoadModalWindow(strjson);
        }
    });
});

function onCloseCambioEstado(e) {
    $("#treeview").data("kendoTreeView").dataSource.read();
    $("#treeviewRoles").data("kendoTreeView").dataSource.read();
};

function HabilitaObje(e, ToF) {
    ToF === true ? e.removeClass("k-state-disabled").removeAttr("disabled") : e.addClass("k-state-disabled").attr("disabled", "disabled");
    
};

fPermisos = function (datos) {
    Permisos = datos;
};
