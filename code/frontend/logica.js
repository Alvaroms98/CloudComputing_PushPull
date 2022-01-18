
// Lógica del frontend

// La lógica establece conexión con la base de datos para pedir
// objetos. También establece conexión con la cola de trabajos
// para poner trabajos que recogerán los "workers".

// Estas conexiones las hace de manera transparente a la lógica,
// para ello utiliza proxies. Un proxy de la base de datos para enviar
// las peticiones. Y otro proxy de la cola de trabajos

const { proxyDB } = require('./proxys/proxyDB');

class Logica {
    constructor(){
        //this.conexionDB = conexionDB;

        // Al arrancar la lógica, establecemos la conexión con la base 
        // de datos
        this.proxydb = new proxyDB();
        this.proxydb.conectar();
    }

    // // Promesa que devuelve las respuestas de la base de datos
    // respuestaDB(){
    //     return new Promise((resolve) => {
    //         this.conexionDB.on('message', (respuesta) => {
    //             resolve(respuesta.toString());
    //         });
    //     });
    // }

    // Se llamará desde un POST del REST API
    // Y pondrá el trabajo en la cola de mensajes
    guardarObjeto(propietario, objeto){

    }

    // Saca todas las instancias de la base de datos
    async sacarTodo(){
        // Le decimos a la base de datos que queremos todo
        const funcion = 'sacarTodo';
        let argumentos = JSON.stringify({});

        // 
        //this.conexionDB.send([funcion,argumentos]);
        //let respuesta = await this.respuestaDB();
        // Comunicamos con el proxy
        let respuesta = await this.proxydb.llamar(funcion, argumentos);

        respuesta = JSON.parse(respuesta);
        console.log(respuesta);
        return respuesta;
    }

    // Saca las instancias de la base de datos que tengan
    // como propietario "X"
    async buscarObjetoporPropietario(propietario){
        const funcion = 'buscarObjetoporPropietario';
        let argumentos = JSON.stringify({propietario: propietario});

        //this.conexionDB.send([funcion, argumentos]);
        //let respuesta = await this.respuestaDB();

        // Comunicamos con el proxy
        let respuesta = await this.proxydb.llamar(funcion, argumentos);

        
        respuesta = JSON.parse(respuesta);
        console.log(respuesta);
        return respuesta;
    }
}

module.exports.Logica = Logica;