
// Lógica del frontend

// La lógica establece conexión con la base de datos para pedir
// objetos. También establece conexión con la cola de trabajos
// para poner trabajos que recogerán los "workers".

// Estas conexiones las hace de manera transparente a la lógica,
// para ello utiliza proxies. Un proxy de la base de datos para enviar
// las peticiones. Y otro proxy de los workers

const { proxyDB } = require('./proxys/proxyDB');
const { proxyWorker } = require('./proxys/proxyWorker');

class Logica {

    constructor(){
        this.proxydb = new proxyDB();
        this.proxyworker = new proxyWorker();
    }

    // función asíncrona para que los proxys conecten con sus
    // respectivos endpoints
    async conectar(){

        
        this.proxydb.conectar();
        await this.proxyworker.conectar();
    
        console.log("\n Proxys Conectados!");
    }

    // Se llamará desde un POST del REST API
    // Y pondrá el trabajo en la cola de mensajes
    async guardarObjeto(propietario, objeto){

        const funcion = 'guardarObjeto';


        // Pasamos en los argumentos el objeto que hay que guardar
        // con los argumentos incluidos
        let argumentos = {
            propietario: propietario,
            objeto: objeto
        };

        argumentos = JSON.stringify(argumentos);
        
        let respuesta = await this.proxyworker.llamar(funcion, argumentos);
        
        return respuesta; // ID UNICO

    }

    // Saca todas las instancias de la base de datos
    async sacarTodo(){
        // Le decimos a la base de datos que queremos todo
        const funcion = 'sacarTodo';
        let argumentos = JSON.stringify({});

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

        let argumentos = {
            propietario: propietario,
        };
        argumentos = JSON.stringify(argumentos);


        // Comunicamos con el proxy
        let respuesta = await this.proxydb.llamar(funcion, argumentos);

        
        respuesta = JSON.parse(respuesta);
        console.log(respuesta);
        return respuesta;
    }
}

// Delete
// TODO
// TODO DE PROPIETARIO
// TODO QUE TENGA UN CAMPO
// UN UNICO POST -> ID

module.exports.Logica = Logica;