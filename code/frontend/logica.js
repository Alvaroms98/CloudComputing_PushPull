
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

    constructor(DB_URL, WORKER_URL) {
        this.proxydb = new proxyDB(DB_URL);
        this.proxyworker = new proxyWorker(WORKER_URL);
    }

    // función asíncrona para que los proxys conecten con sus
    // respectivos endpoints
    async conectar() {


        this.proxydb.conectar();
        await this.proxyworker.conectar();

        console.log("\n ************** Proxys Conectados! ******************");
    }

    // ------------------------------- POST (WORKER JOB) --------------------------------------

    // Se llamará desde un POST del REST API
    // Y pondrá el trabajo en la cola de mensajes
    async guardarObjeto(propietario, objeto) {
        try{
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
            console.log(`\n ************** Objeto de ${propietario} guardado *****************`);
            return respuesta; // ID UNICO

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // ------------------------------- GET --------------------------------------

    // Saca todas las instancias de la base de datos
    async sacarTodo() {
        try{
            // Le decimos a la base de datos que queremos todo
            const funcion = 'sacarTodo';
            let argumentos = JSON.stringify({});

            // Comunicamos con el proxy
            let respuesta = await this.proxydb.llamar(funcion, argumentos);

            respuesta = JSON.parse(respuesta);

            console.log("\n ************** Sacar Toda la base de datos ******************");

            return respuesta;

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // Saca las instancias de la base de datos que tengan
    // como propietario "X"
    async buscarObjetoporPropietario(propietario) {
        try{
            const funcion = 'buscarObjetoporPropietario';

            let argumentos = {
                propietario: propietario,
            };
            argumentos = JSON.stringify(argumentos);


            // Comunicamos con el proxy
            let respuesta = await this.proxydb.llamar(funcion, argumentos);


            respuesta = JSON.parse(respuesta);

            console.log(`\n ************** Sacar objetos del propietario ${propietario} ******************`);

            return respuesta;

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // Sacar el objeto por ID (este ID se devuelve en la respusta del POST)
    async buscarPorID(id) {
        try{
            const funcion = 'buscarPorID';
            let argumentos = {
                id: id
            };
            argumentos = JSON.stringify(argumentos);

            let respuesta = await this.proxydb.llamar(funcion, argumentos);

            respuesta = JSON.parse(respuesta);

            console.log(`\n ************** Sacar objeto con ID ${id} ******************`);

            return respuesta;

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // Busca todos los objetos de un propietario que tengan el campo
    async buscarObjetoporPropietarioYCampo(propietario, campo) {
        try{
            let objetosPropietario = await this.buscarObjetoporPropietario(propietario);

            console.log(`\n ************** Sacar Objetos Por Propietario: ${propietario}, y Campo: ${campo} ******************`);

            // Si no se han encontrado objetos del propietario
            if (objetosPropietario === null) {
                return { mensaje: "No se han encontrado objetos" };

            } else { // Si se encuentran objetos hay que filtrarlos
                let objetosMatch = [];
                objetosPropietario.forEach((elemento) => {
                    // Metodo para comprobar si existe un campo
                    if (Array.isArray(elemento.MyData)){
                        let match = false;
                        elemento.MyData.forEach((objeto) => {
                            if (objeto.hasOwnProperty(campo)) {
                                match = true;
                            }
                        });
                        if (match){
                            objetosMatch.push(elemento);
                        }
                    }else{
                        if (elemento.MyData.hasOwnProperty(campo)) {
                            objetosMatch.push(elemento);
                        }
                    }
                });

                // Ahora comprobamos la longitud del array de match
                if (objetosMatch.length === 0) { // Si no hay matches
                    return { mensaje: "No se han encontrado objetos" };

                } else { // Si hay matches los devolvemos directamente
                    return objetosMatch;
                }
            }
        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }


    // ------------------------------- DELETE (WORKER JOB) --------------------------------------

    // Borra toda la tabla de la base de datos
    async borrarTodo() {
        try{
            const funcion = 'borrarTodo';
            let argumentos = JSON.stringify({});

            let respuesta = await this.proxyworker.llamar(funcion, argumentos);


            if (respuesta && respuesta.respuesta.affectedRows > 0) {
                respuesta = {
                    mensaje: `Se han eliminado ${respuesta.respuesta.affectedRows} registros de la base de datos`,
                    estado: respuesta.estado
                }
            }
            else {
                respuesta = {
                    mensaje: `No se han podido eliminar registros`,
                    estado: 'FAIL'
                }
            }

            console.log("\n ************** Borrada toda la base de datos ******************");

            return respuesta;

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // Borrar todos los objetos de un propietario
    async borrarPropietario(propietario) {
        try{
            const funcion = 'borrarPropietario';
            let argumentos = {
                propietario: propietario
            };

            argumentos = JSON.stringify(argumentos);

            let respuesta = await this.proxyworker.llamar(funcion, argumentos);

            if (respuesta && respuesta.respuesta.affectedRows > 0) {
                respuesta = {
                    mensaje: `Se han eliminado ${respuesta.respuesta.affectedRows} registros de ${propietario}`,
                    estado: respuesta.estado
                }
            }
            else {
                respuesta = {
                    mensaje: `No se han podido eliminar registros`,
                    estado: 'FAIL'
                }
            }

            console.log(`\n ************** Datos del propietario ${propietario} borrados ******************`);

            return respuesta;

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // Borrar por ID
    async borrarPorID(id) {
        try{

            const funcion = 'borrarPorID';
            let argumentos = {
                id: id
            };

            argumentos = JSON.stringify(argumentos);

            let respuesta = await this.proxyworker.llamar(funcion, argumentos);
            if (respuesta && respuesta.respuesta.affectedRows > 0) {
                respuesta = {
                    mensaje: `Se ha eliminado ${respuesta.respuesta.affectedRows} registro con ID: ${id}`,
                    estado: respuesta.estado
                }
            }
            else {
                respuesta = {
                    mensaje: `No se han podido eliminar registros`,
                    estado: 'FAIL'
                }
            }

            console.log(`\n ************** Borrado objeto con ID ${id}******************`);

            return respuesta;

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }

    // Borrar todos los objetos de un propietario que tengan un campo en especificio
    async borrarObjetoporPropietarioYCampo(propietario, campo) {
        try{
            // Primero buscamos cuales hay
            let objetosMatch = await this.buscarObjetoporPropietarioYCampo(propietario, campo);

            console.log(`\n ************** Borrar Objeto Por Propietario: ${propietario}, y Campo: ${campo} ******************`);

            if (objetosMatch.hasOwnProperty('mensaje')) {
                let noHayMatch = objetosMatch;
                return noHayMatch;
            } else {
                // Extraemos todos los ids de los objetos encontrados y llamamos
                // en bucle a la funcion borrarPorID
                objetosMatch.forEach(async (elemento) => {
                    let nada = await this.borrarPorID(elemento.Id);
                });
                let respuesta = {
                    mensaje: `${objetosMatch.length} objetos eleminados de la base de datos permanentemente`,
                    objetosEliminados: objetosMatch,
                };
                return respuesta;
            }

        } catch(err){
            console.log(err);
            return { mensaje: "Fallo en la operación"};
        }
    }
}

module.exports.Logica = Logica;