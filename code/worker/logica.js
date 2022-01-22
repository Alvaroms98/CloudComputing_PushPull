// Lógica del worker

// La lógica establece conexión con la base de datos para poner, actualizar
// y borrar objetos. También establece conexión con la cola de trabajos
// para responder a las peticiones del frontend

// Estas conexiones las hace de manera transparente a la lógica,
// para ello utiliza proxies. Un proxy de la base de datos para enviar
// las peticiones.

const { proxyDB } = require('./proxys/proxyDB');


class Logica {

    constructor(DB_URL) {
        this.proxydb = new proxyDB(DB_URL);
        this.proxydb.conectar();
    }

    async guardarObjeto(argumentos) {
        const funcion = 'guardarObjeto';
        let respuesta = await this.proxydb.llamar(funcion, argumentos);
        return respuesta;
    }

    async borrarTodo(argumentos) {
        const funcion = 'borrarTodo';
        let respuesta = await this.proxydb.llamar(funcion, argumentos);
        return respuesta;
    }

    async borrarPropietario(argumentos) {
        const funcion = 'borrarPropietario';
        let respuesta = await this.proxydb.llamar(funcion, argumentos);
        return respuesta;
    }


    async borrarPorID(argumentos) {
        const funcion = 'borrarPorID';
        let respuesta = await this.proxydb.llamar(funcion, argumentos);
        return respuesta;
    }

}

module.exports.Logica = Logica;