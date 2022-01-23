// Proxy universal de la lógica de la base de datos
// Esto sirve para acabar en un endpoint (rest o zmq)
// que es donde se encuentra la verdadera lógica de la base de datos

// Comunicación por zmq
const zmq = require('zeromq');
const URL = process.env.URL || 'localhost:3001'; // esto hay que pasarlo por configuración


// Como todo proxy esto no implementa ninguna lógica, solo comunicaciones
class proxyDB{

    // Crear el socket request para enviar peticiones a la DB
    constructor(URL){
        this.URL = URL;
        this.conexionDB = zmq.socket('req');
    }

    // En zmq hay que hacer este truquito para poder esperar a las respuestas
    // de las peticiones del socket
    respuestaDB(){
        return new Promise((resolve) => {
            this.conexionDB.on('message', (respuesta) => {
                resolve(respuesta.toString());
            });
        });
    }

    // Establece comunicación con la base de datos
    conectar(){
        this.conexionDB.connect(this.URL);
    }

    // Sirve para llamar cualquier método de la lógica de la 
    // base de datos
    async llamar( funcion, argumentos ){
        // Enviar la petición
        this.conexionDB.send([funcion, argumentos]);

        // Esperar la respuesta
        let respuesta = await this.respuestaDB();
        return respuesta;
    }

    cerrarConexion(){
        this.conexionDB.close();
    }
}

module.exports.proxyDB = proxyDB;