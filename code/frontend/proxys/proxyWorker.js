// Proxy de los worker

// Realmente los mensajes transmitidos por este proxy
// son interceptados por una cola de trabajos, donde se almacenan
// dichas peticiones, para ser procesadas por los workers, cuando
// estos estén ociosos de trabajo.

// La cola de trabajos utiliza la tecnología de NATS

// Dependencias
const { ColaDeTrabajos } = require('./ColaDeTrabajos');

// URL para conectarse a la cola de NATS, hay que pasarla por
// variable de entorno
//const NATS_URL = "localhost:4222";

class proxyWorker{

    constructor(NATS_URL){
        this.NATS_URL = NATS_URL;
    }

    async conectar(){
        this.conexionWorker = await new ColaDeTrabajos(this.NATS_URL,
            {
                worker: false,
                nombreCliente: "clienteRandom"
            });
    }

    // El mensaje que se envía se deja en la cola de trabajos
    // pero el formato de envío es como si comunicara directamente
    // con el endpoint de un worker, ya que solicita de su lógica
    // ejecutar la tarea que se está solicitando
    async llamar( funcion, argumentos ){
        var respuesta;
        try{
            // Enviamos el trabajo a la cola y esperamos una respuesta
            respuesta = await this.conexionWorker.anyadirTrabajoEsperando(
                {
                    funcion: funcion,
                    parametros: argumentos
                },
            5000); // 5 segundos de espera máxima

            return respuesta;

        } catch (err){
            return respuesta = {
                mensaje: "La petición no se ha podido realizar"
            }
        }
    }

    // Cerrar la conexión con la cola de trabajos
    async cerrarConexion(){
        await this.conexionWorker.cerrar();
    }

    
}


module.exports.proxyWorker = proxyWorker;