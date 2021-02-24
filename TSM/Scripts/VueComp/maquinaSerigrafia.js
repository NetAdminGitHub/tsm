(function ($, window, document) {

    //JSON por defecto
    let defaults = {
        maquina: {
            data: [],
            formaMaquina: "CIRCULAR",
            cantidadBrazos: 12,
            eventos: {
                nuevaEstacion: undefined,
                abrirEstacion: undefined,
                editarEstacion: undefined,
                pegarEstacion: undefined,
                trasladarEstacion: undefined,
                desplazamientoEstacion: undefined,
                eliminarEstacion: undefined,
                reduccionMaquina: undefined
            }
        },
        tipoMaquina: {
            data: [],
            urlImg: "/Content/icons/",
            mostrar: false,
            eventos: {
                onChange: undefined
            }
        },
        colores: {
            data: [],
            urlImg: "/Content/icons/",
            mostrar: false
        },
        tecnicas: {
            data: [],
            urlImg: "/Content/icons/",
            mostrar: false
        },
        bases: {
            data: [],
            urlImg: "/Content/icons/",
            mostrar: false
        },
        accesorios: {
            data: [],
            urlImg: "/Content/icons/",
            mostrar: false
        },
        maquetado: 'Normal'
    };

    /**
     * Clase principal que representa la maquina de serigrafía
     * @param {HTMLElement} element objeto div sobre el cual se dibuja la maquina
     * @param {JSON} options opciones para la construcción de la maquina
     */
    function MaquinaSerigrafia(element, options) {
        this.options = $.extend(true, {}, defaults, options);
        this.divPrincipal = $(element);
        this.idDivPrincipal = this.divPrincipal[0].id;

        //ID's de los diferentes componentes
        this.idMaquinaVue = this.idDivPrincipal + "_MaquinaVue";
        this.idTipoMaquinaVue = this.idDivPrincipal + "_TipoMaquina";
        this.idColoresVue = this.idDivPrincipal + "_Colores";
        this.idTecnicasVue = this.idDivPrincipal + "_Tecnicas";
        this.idBasesVue = this.idDivPrincipal + "_Bases";
        this.idAccesoriosVue = this.idDivPrincipal + "_Accesorios";

        HTMLElement.prototype.setEvento = this.setEvento;

        //Inicializar componentes segun JSON de opciones
        this.init();
    }

    $.extend(MaquinaSerigrafia.prototype, {
        /**Se inicializa todos los componentes de la maquina */
        init: function () {
            this.divPrincipal.addClass("form-row col-lg-12");

            if (this.options.maquetado === 'Normal') {
                //DIV izquierdo
                this.divPrincipal.append("<div name='panelIzq' class='form-row col-lg-4' style='width: 100%;'></div>");
                //DIV derecho
                this.divPrincipal.append("<div name='panelDer' class='from-group col-lg-8'></div>")
            }

            //Se agrega componente tipo maquina
            if (this.options.tipoMaquina.mostrar)
                this._loadTipoMaquinaVue(this.options.maquetado);

            //Se agrega componente colores
            if (this.options.colores.mostrar)
                this._loadColoresVue(this.options.maquetado);

            //Se agrega componente tecnicas
            if (this.options.tecnicas.mostrar)
                this._loadTecnicasVue(this.options.maquetado);

            //Se agrega componente bases
            if (this.options.bases.mostrar)
                this._loadBasesVue(this.options.maquetado);

            //Se agrega componente accesorios
            if (this.options.accesorios.mostrar)
                this._loadAccesoriosVue(this.options.maquetado);

            //Se agrega componente maquina
            this._loadMaquinaVue(this.options.maquetado);

        },

        // Funciones privadas
        _loadMaquinaVue: function (maquetado) {
            if (maquetado === 'Normal') {
                $(`<div class="from-group col-lg-12">
                        <maquina-component baseimgurl="icons/" id="` + this.idMaquinaVue + `"></maquina-component>
                    </div>`).appendTo($("div[id='" + this.idDivPrincipal + "'] > div[name='panelDer']"));
            }

            this.maquina = document.getElementById(this.idMaquinaVue);
            this.maquinaVue = document.getElementById(this.idMaquinaVue).vueComponent;

            this.maquinaVue.initialize(this.options.maquina.cantidadBrazos, this.options.maquina.formaMaquina);

            if (this.options.maquina.eventos.nuevaEstacion)
                this.maquina.setEvento('nueva-configuracion-brazo', this.options.maquina.eventos.nuevaEstacion);

            if (this.options.maquina.eventos.abrirEstacion)
                this.maquina.setEvento('ver-detalle', this.options.maquina.eventos.abrirEstacion);

            if (this.options.maquina.eventos.editarEstacion)
                this.maquina.setEvento('editar-configuracion', this.options.maquina.eventos.editarEstacion);

            if (this.options.maquina.eventos.pegarEstacion)
                this.maquina.setEvento('configuracion-pegada', this.options.maquina.eventos.pegarEstacion);

            if (this.options.maquina.eventos.trasladarEstacion)
                this.maquina.setEvento('traslado-brazos', this.options.maquina.eventos.trasladarEstacion);

            if (this.options.maquina.eventos.desplazamientoEstacion)
                this.maquina.setEvento('desplazamiento-brazo', this.options.maquina.eventos.desplazamientoEstacion);

            if (this.options.maquina.eventos.eliminarEstacion)
                this.maquina.setEvento('configuracion-eliminada', this.options.maquina.eventos.eliminarEstacion);  
            
            if (this.options.maquina.eventos.reduccionMaquina)
                this.maquina.setEvento('cambio-aprobado', this.options.maquina.eventos.reduccionMaquina);     

            this.cargarDataMaquina(this.options.maquina.data);
        },
        _loadTipoMaquinaVue(maquetado) {
            if (maquetado === 'Normal') {
                $(`<div class="from-group col-lg-12">
                        <brazos-element baseimgurl="` + this.options.tipoMaquina.urlImg + `" id="` + this.idTipoMaquinaVue + `" ` + (this.options.tipoMaquina.eventos.onChange ? ('onchange="' + this.options.tipoMaquina.eventos.onChange.name + '(event)"') : '') + `> </brazos-element>
                    </div >`).appendTo($("div[id='" + this.idDivPrincipal + "'] > div[name='panelIzq']"));
            }

            this.tipoMaquina = document.getElementById(this.idTipoMaquinaVue);
            this.tipoMaquinaVue = document.getElementById(this.idTipoMaquinaVue).vueComponent;

            this.cargarDataTipoMaquina(this.options.tipoMaquina.data);
        },
        _loadColoresVue(maquetado) {
            if (maquetado === 'Normal') {
                $(`<div class="from-group col-lg-12">
                        <paleta-colores baseimgurl="` + this.options.colores.urlImg + `" id="` + this.idColoresVue + `""> </paleta-colores>
                    </div >`).appendTo($("div[id='" + this.idDivPrincipal + "'] > div[name='panelIzq']"));
            }

            this.colores = document.getElementById(this.idColoresVue);
            this.coloresVue = document.getElementById(this.idColoresVue).vueComponent;

            this.cargarDataColores(this.options.colores.data);
        },
        _loadTecnicasVue(maquetado) {
            if (maquetado === 'Normal') {
                $(`<div class="from-group col-lg-12">
                        <tecnicas-especiales baseimgurl="` + this.options.tecnicas.urlImg + `" id="` + this.idTecnicasVue + `""> </tecnicas-especiales>
                    </div >`).appendTo($("div[id='" + this.idDivPrincipal + "'] > div[name='panelIzq']"));
            }

            this.tecnicas = document.getElementById(this.idTecnicasVue);
            this.tecnicasVue = document.getElementById(this.idTecnicasVue).vueComponent;

            this.cargarDataTecnicas(this.options.tecnicas.data);
        },
        _loadBasesVue(maquetado) {
            if (maquetado === 'Normal') {
                $(`<div class="from-group col-lg-12">
                        <bases-component baseimgurl="` + this.options.bases.urlImg + `" id="` + this.idBasesVue + `""> </bases-component>
                    </div >`).appendTo($("div[id='" + this.idDivPrincipal + "'] > div[name='panelIzq']"));
            }

            this.bases = document.getElementById(this.idBasesVue);
            this.basesVue = document.getElementById(this.idBasesVue).vueComponent;

            this.cargarDataBases(this.options.bases.data);
        },
        _loadAccesoriosVue(maquetado) {
            if (maquetado === 'Normal') {
                $(`<div class="from-group col-lg-12">
                        <accesorios-basicos baseimgurl="` + this.options.accesorios.urlImg + `" id="` + this.idAccesoriosVue + `""> </accesorios-basicos>
                    </div >`).appendTo($("div[id='" + this.idDivPrincipal + "'] > div[name='panelIzq']"));
            }

            this.accesorios = document.getElementById(this.idAccesoriosVue);
            this.accesoriosVue = document.getElementById(this.idAccesoriosVue).vueComponent;

            this.cargarDataAccesorios(this.options.accesorios.data);
        },

        // HELPER FUNCTIONS

        _mapearData: function (datos) {
            let mapeo = datos.map(function (d) {
                let result = {
                    number: d.IdEstacion,
                    accessories: [{
                        tipo: d.TipoBrazo,
                        Nombre: d.NomIdTecnica,
                        ...d
                    }]
                };

                return result;
            });

            return mapeo;
        },

        // PUBLIC FUNCTIONS

        /**
         * Carga el conjuto de datos al componente maquina
         * @param {JSON} datos Conjunto de datos a cargar.
         */
        cargarDataMaquina: function (datos) {
            if (this.maquinaVue && datos && datos.length > 0) {
                this.maquinaVue.sustituirBrazos(this._mapearData(datos));
                return true;
            }

            return false;
        },
        /**
         * Carga el conjuto de datos al componente tipos de maquinas.
         * @param {JSON} datos Conjunto de datos a cargar.
         */
        cargarDataTipoMaquina: function (datos) {
            if (this.tipoMaquinaVue && datos && datos.length > 0) {
                this.tipoMaquinaVue.setBrazos(datos);

                return true;
            }

            return false;
        },
        /**
         * Carga el conjuto de datos al componente colores.
         * @param {JSON} datos Conjunto de datos a cargar.
         */
        cargarDataColores: function (datos) {
            if (this.coloresVue && datos && datos.length > 0) {
                this.coloresVue.setColores(datos);

                return true;
            }

            return false;
        },
        /**
         * Carga el conjuto de datos al componente tecnicas.
         * @param {JSON} datos Conjunto de datos a cargar.
         */
        cargarDataTecnicas: function (datos) {
            if (this.tecnicasVue && datos && datos.length > 0) {
                this.tecnicasVue.setTecnicasEspeciales(datos);

                return true;
            }

            return false;
        },
        /**
         * Carga el conjuto de datos al componente bases.
         * @param {JSON} datos Conjunto de datos a cargar.
         */
        cargarDataBases: function (datos) {
            if (this.basesVue && datos && datos.length > 0) {
                this.basesVue.setBases(datos);

                return true;
            }

            return false;
        },
        /**
         * Carga el conjuto de datos al componente accesorios.
         * @param {JSON} datos Conjunto de datos a cargar.
         */
        cargarDataAccesorios: function (datos) {
            if (this.accesoriosVue && datos && datos.length > 0) {
                this.accesoriosVue.setAccesorios(datos);

                return true;
            }

            return false;
        },
        /**
         * Metodo que asocia un evento a un función js.
         * @param {string} nombreEvento Nombre del evento del componente.
         * @param {Function} funcion Función a ejecutar tras el dispararse el evento.
         */
        setEvento: function (nombreEvento, funcion) {
            this.addEventListener(nombreEvento, funcion);
        },
        /**
         * Elimina una estación en la maquina.
         * @param {JSON} estacion estacion 
         */
        eliminarEstacion: function (estacion) {
            this.maquinaVue.eliminarConfiguracion(estacion);
        },
        /**
         * Activa la maquina en modo lectura
         * @param {boolean} opcion true or False
         */
        activarSoloLectura: function (opcion) {
            this.maquinaVue.readOnly(opcion);
        }
        

    });

    // Wrapper
    $.fn.maquinaSerigrafia = function (options) {
        let args = arguments;
        let instance;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, "maquinaSerigrafia")) {
                    $.data(this, "maquinaSerigrafia", new MaquinaSerigrafia(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            instance = $.data(this[0], 'maquinaSerigrafia');

            if (options === 'destroy') {
                $.data(this, 'maquinaSerigrafia', null);
            }

            if (instance instanceof SmartWizard && typeof instance[options] === 'function') {
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                return this;
            }
        }
    };
})(jQuery, window, document);