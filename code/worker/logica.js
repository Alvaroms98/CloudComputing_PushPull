// Lógica del worker

// La lógica establece conexión con la base de datos para poner, actualizar
// y borrar objetos. También establece conexión con la cola de trabajos
// para responder a las peticiones del frontend

// Estas conexiones las hace de manera transparente a la lógica,
// para ello utiliza proxies. Un proxy de la base de datos para enviar
// las peticiones.

const { proxyDB } = require('./proxys/proxyDB');


class Logica {

    constructor(){
        this.proxydb = new proxyDB();
        this.proxydb.conectar();
    }

    // argumentos {
    //      propietario: "nombre",
    //      objeto: JSON
    // }
    async guardarObjeto(argumentos){
        console.log(argumentos);
        return {mensaje: "Hola desde la lógica del worker"}
    }

    

}

module.exports.Logica = Logica;