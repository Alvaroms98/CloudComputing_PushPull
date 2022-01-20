
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

    // ------------------------------- POST (WORKER JOB) --------------------------------------

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
        
        let objetoID = respuesta.respuesta.insertId;
        respuesta = {
            mensaje: `Objeto insertado en la base de datos correctamente`,
            identificadorUnico: objetoID
        }

        return respuesta; // ID UNICO

    }

    // ------------------------------- GET --------------------------------------

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

    // Sacar el objeto por ID (este ID se devuelve en la respusta del POST)
    async buscarPorID(id){
        const funcion = 'buscarPorID';
        let argumentos = {
            id: id
        };
        argumentos = JSON.stringify(argumentos);

        let respuesta = await this.proxydb.llamar(funcion, argumentos);

        respuesta = JSON.parse(respuesta);
        console.log(respuesta);
        return respuesta;
    }

    // Busca todos los objetos de un propietario que tengan el campo
    async buscarObjetoporPropietarioYCampo(propietario, campo){
        let objetosPropietario = await this.buscarObjetoporPropietario(propietario);

        // Si no se han encontrado objetos del propietario
        if (objetosPropietario === null){
            return {mensaje: "No se han encontrado objetos"};

        } else { // Si se encuentran objetos hay que filtrarlos
            let objetosMatch = [];
            objetosPropietario.forEach((elemento) => {
                // Metodo para comprobar si existe un campo
                if (elemento.MyData.hasOwnProperty(campo)){
                    objetosMatch.push(elemento);
                }
            });

            // Ahora comprobamos la longitud del array de match
            if (objetosMatch.length === 0){ // Si no hay matches
                return {mensaje: "No se han encontrado objetos"};

            } else { // Si hay matches los devolvemos directamente
                return objetosMatch;
            }
        }
    }


    // ------------------------------- DELETE (WORKER JOB) --------------------------------------

    // Borra toda la tabla de la base de datos
    async borrarTodo(){
        const funcion = 'borrarTodo';
        let argumentos = JSON.stringify({});

        let respuesta = await this.proxyworker.llamar(funcion, argumentos);

        respuesta = JSON.parse(respuesta);
        return respuesta;
    }

    // Borrar todos los objetos de un propietario
    async borrarPropietario(propietario){
        const funcion = 'borrarPropietario';
        let argumentos = {
            propietario: propietario
        };
        argumentos = JSON.parse(argumentos);

        let respuesta = await this.proxyworker.llamar(funcion, argumentos);

        respuesta = JSON.parse(respuesta);
        return respuesta;
    }

    // Borrar por ID
    async borrarPorID(id){
        const funcion = 'borrarPorID';
        let argumentos = {
            id: id
        };

        argumentos = JSON.parse(argumentos);

        let respuesta = await this.proxyworker.llamar(funcion, argumentos);

        respuesta = JSON.parse(respuesta);
        return respuesta;
    }

    // Borrar todos los objetos de un propietario que tengan un campo en especificio
    async borrarObjetoporPropietarioYCampo(propietario,campo){
        // Primero buscamos cuales hay
        let objetosMatch = await this.buscarObjetoporPropietarioYCampo(propietario,campo);

        if (objetosMatch.hasOwnProperty('mensaje')){
            let noHayMatch = objetosMatch;
            return noHayMatch;
        } else{
            // Extraemos todos los ids de los objetos encontrados y llamamos
            // en bucle a la funcion borrarPorID
            objetosMatch.forEach( async (elemento) => {
                _ = await this.borrarPorID(elemento.Id);
            });
            let respuesta = {
                mensaje: "Objetos eleminados de la base de datos permanentemente",
                objetosEliminados: objetosMatch,
            };
            return respuesta;
        }
    }
}

module.exports.Logica = Logica;