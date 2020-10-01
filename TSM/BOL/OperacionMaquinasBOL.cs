using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using TSM.Models;

namespace TSM.BOL
{
    public class OperacionMaquinasBOL : IDisposable
    {

        private List<EstacionMaquina> _confBrazos;

        private int _cantbrazos; // cantidad teórica de brazos en la máquina según tipo 

        private string _direccion;

        private bool _respetavacio;

        private int _cantdesplazar;

        private int _brazoinicial;

        public List<EstacionMaquina> Brazos
        {
            get { return _confBrazos; }
            set { _confBrazos = value; }
        }


        public int CantBrazosMaquina
        {
            get { return _cantbrazos; }
            set { _cantbrazos = value; }
        }

        public string Direccion
        {
            get { return _direccion; }
            set { _direccion = value; }
        }

        public bool RespetaVacio
        {
            get { return _respetavacio; }
            set { _respetavacio = value; }
        }

        public int CantDesplazar
        {
            get { return _cantdesplazar; }
            set { _cantdesplazar = value; }
        }




        public OperacionMaquinasBOL(SolicitudDesplazamiento conf) {
            _confBrazos = conf.Brazos;
            _cantbrazos = Convert.ToInt32(conf.Numbrazos);
            _cantdesplazar = Convert.ToInt32(conf.CantDesplazar); //cantidad de espacios a mover.
            _respetavacio = Convert.ToBoolean(conf.RespetaVacio); // namdera de respetar vacío
            _direccion = conf.Direccion;
            _brazoinicial = Convert.ToInt32(conf.BrazoInicial);
            AgregaBrazosFaltantes(); // rellena espacios vacíos en la máquina hasta igualar cantidad de brazos.
        }


        #region Public Methods
            
        public Dictionary<string,object> DesplazarBrazos()
        {
            Dictionary<string, object> respuesta = new Dictionary<string, object>();
            // crea lista enlazada
            LinkedList<EstacionMaquina> listaBrazos = new LinkedList<EstacionMaquina>(_confBrazos);
            string resumenCambios="";

            try
            {
                switch (_direccion)
                {
                    case "right":
                           _confBrazos =  this.MoveRight(listaBrazos, _brazoinicial, _cantdesplazar, _respetavacio).ToList();
                            resumenCambios = this.ObtenerCambiosMaquina();  // obtiene string con datos.
                        break;
                    case "left":
                            _confBrazos = this.MoveLeft(listaBrazos, _brazoinicial, _cantdesplazar, _respetavacio).ToList();
                            resumenCambios = this.ObtenerCambiosMaquina();  // obtiene string con datos.
                        break;
                }
                respuesta.Add("Resumen",resumenCambios);
            }
            catch (Exception ex)
            {
                respuesta.Add("Error", "true");
                respuesta.Add("Detalle", ex.Message);
                
            }
                 return respuesta;
        }

        #endregion



        #region Private Methods






        private void AgregaBrazosFaltantes()
        {
            var v = Enumerable.Range(1, _cantbrazos).Select(x => new EstacionMaquina() { IdEstacion = x, Ocupado = false });

            var res = from first in v
                      join second in _confBrazos
                      on first.IdEstacion equals second.IdEstacion
                      into joined
                      from j in joined.DefaultIfEmpty(first)
                      select j;

            _confBrazos = res.ToList(); // asigna nuevo valor a la lista.
        }






        //Desplazamiento a la derecha
        private  LinkedList<EstacionMaquina> MoveRight(LinkedList<EstacionMaquina> maquina, int brazoIni, int cantEspacios, bool respetaEspacio = true)
        {
            var brazobusqueda = new EstacionMaquina() { IdEstacion = brazoIni, Ocupado = true };
            int espacios = CheckAvailableSpaces(maquina, "right", respetaEspacio);
            if (espacios < cantEspacios) { throw new Exception("No hay suficientes espacios en la máquina."); }
            LinkedListNode<EstacionMaquina> current; // inicializa la variable 
            LinkedListNode<EstacionMaquina> inicial = maquina.Find(maquina.FirstOrDefault(x => x.IdEstacion == brazoIni));
            LinkedListNode<EstacionMaquina> nodoTope;
            LinkedListNode<EstacionMaquina> refNodoPrevio;


            try
            {
                switch (respetaEspacio)
                {
                    case true:
                        current = maquina.Last; // inicializa con último nodo
                        if (current.Value.Ocupado) { throw new Exception("No se puede desplazar a la derecha. Verifique brazos disponibles."); }

                        //mueve respetando el espacio.
                        for (int i = 0; i <= cantEspacios - 1; i++)
                        {
                            if (current.Value.Ocupado) { throw new Exception("No se puede desplazar la cantidad de estaciones solicitadas a la derecha. Verifique los espacios disponibles."); } //si el actual esta ocupado ya no puede cotinuar desplazamiento respetando espacios.

                            maquina.RemoveLast();
                            maquina.AddBefore(inicial, current);
                            current = maquina.Last;

                        }
                        break;
                    case false:
                        current = inicial; // inicializa el current como el inicial
                        nodoTope = maquina.Last; // el nodo tope es el último de la máquina (no se puede desplazar más allá de ese punto)

                        while (current != nodoTope && cantEspacios > 0)
                        {
                            current = current.Next;
                            if (!current.Value.Ocupado)
                            {
                                refNodoPrevio = current.Previous;
                                maquina.Remove(current);
                                maquina.AddBefore(inicial, current);
                                current = refNodoPrevio; //se posiciona en el siguiente nodo para mantener la referencia y evitar comenzar desde nodo inicial.
                                cantEspacios--; // disminuye el contador para las iteraciones
                            }
                            nodoTope = maquina.Last;
                        };

                        break;
                }

            }
            catch (Exception)
            {
                throw;
            }


            return maquina;

        }



        private LinkedList<EstacionMaquina> MoveLeft(LinkedList<EstacionMaquina> maquina, int brazoIni, int cantEspacios, bool respetaEspacio = true)
        {
          
            int espacios = CheckAvailableSpaces(maquina, "left", respetaEspacio);
            if (espacios < cantEspacios) { throw new Exception("No hay suficientes espacios en la máquina."); }
            LinkedListNode<EstacionMaquina> current; // crea variable
            LinkedListNode<EstacionMaquina> inicial = maquina.Find(maquina.FirstOrDefault(x => x.IdEstacion == brazoIni));
            LinkedListNode<EstacionMaquina> nodoTope;
            LinkedListNode<EstacionMaquina> refNodoPrevio;

            try
            {
                switch (respetaEspacio)
                {
                    case true:
                        current = maquina.First; // inicializa con primer nodo
                        if (current.Value.Ocupado ) { throw new Exception("No se puede desplazar a la izquierda. Verifique los espacios disponibles."); }

                        // mueve hacia la derecha respetando espacio.
                        for (int i = 0; i <= cantEspacios - 1; i++)
                        {
                            if (current.Value.Ocupado) { throw new Exception("No se puede desplazar la cantidad de estaciones solicitadas a la izquierda. Verifique los espacios disponibles."); } //si el actual esta ocupado ya no puede cotinuar desplazamiento respetando espacios.
                            maquina.RemoveFirst();
                            maquina.AddAfter(inicial, current);
                            current = maquina.First;

                        }
                        break;
                    case false:
                        current = inicial; // inicializa el current como el inicial
                        nodoTope = maquina.First; // el nodo tope es el último de la máquina (no se puede desplazar más allá de ese punto)

                        while (current != nodoTope && cantEspacios > 0)
                        {
                            current = current.Previous;
                            if (!current.Value.Ocupado)
                            {
                                refNodoPrevio = current.Next;
                                maquina.Remove(current);
                                maquina.AddAfter(inicial, current);
                                current = refNodoPrevio; //se posiciona en el siguiente nodo para mantener la referencia y evitar comenzar desde nodo inicial.
                                cantEspacios--; // disminuye el contador para las iteraciones
                            }
                            nodoTope = maquina.First;
                        };

                        break;
                }

            }
            catch (Exception)
            {
                throw;
            }
            return maquina;

        }





        private int CheckAvailableSpaces(LinkedList<EstacionMaquina> maquina, string direccion = "right", bool respetaEspacio = true)
        {
            LinkedListNode<EstacionMaquina> Current; // inicializa variable con posición inicial de recorrido
            int Disponibles = 0;

            switch (direccion)
            {
                case "right":
                    Current = maquina.Last;
                    for (int i = maquina.Count - 1; i > -1; i--)
                    {
                        if (maquina.Last.Value.Ocupado != false && respetaEspacio == true) { return Disponibles; } else { if (!Current.Value.Ocupado) { Disponibles++; } }
                        Current = Current.Previous;

                    }
                    break;
                case "left":

                    Current = maquina.First;

                    for (int i = 0; i <= maquina.Count - 1; i++)
                    {
                        if (maquina.Last.Value.Ocupado != false && respetaEspacio == true) { return Disponibles; } else { if (!Current.Value.Ocupado) { Disponibles++; } }
                        Current = Current.Next;

                    }
                    break;
                default:
                    Disponibles = 0;
                    break;

            }
            // revisa de atras para adelante





            return Disponibles;
        }



        private  string ObtenerCambiosMaquina()
        {
            string result = "";
            //recorre lista para generar string
            for (int i = 0; i <= _confBrazos.Count - 1; i++)
            {
                if (_confBrazos[i].IdEstacion != i + 1 && _confBrazos[i].Ocupado != false)
                {
                    result += String.Format("{0}|{1},", i + 1, _confBrazos[i].IdEstacion);
                }
            }
            result = result.Remove(result.Length - 1, 1);


            return result;
        }
        #endregion

        #region IDisposable
        private bool disposedValue = false; // Para detectar llamadas redundantes

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: elimine el estado administrado (objetos administrados).
                }

                disposedValue = true;
            }
        }
     


        // Este código se agrega para implementar correctamente el patrón descartable.
        public void Dispose()
        {
            // No cambie este código. Coloque el código de limpieza en el anterior Dispose(colocación de bool).
            Dispose(true);
            // TODO: quite la marca de comentario de la siguiente línea si el finalizador se ha reemplazado antes.
            // GC.SuppressFinalize(this);
        }
        #endregion




    }
}