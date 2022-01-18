const zmq = require('zeromq');
const datos = require('./DB.json');


class LogicaDB{
    constructor(datos,conexion){
        this.datos = datos;
        this.conexion = conexion;
    }

    sacarTodo(){
        this.conexion.send(JSON.stringify(datos));
    }

    buscarObjetoporPropietario(args){
        let datosPropietario = [];
        datos.forEach((dato) => {
            if (dato.PROPIETARIO === args.propietario){
                datosPropietario.push(dato);
            }
        });

        datosPropietario = JSON.stringify(datosPropietario);
        this.conexion.send(datosPropietario);
    }
}


const main = () => {
    const endpointDB = zmq.socket('rep');
    endpointDB.bindSync(`tcp://*:3001`);
    console.log(`Sirviendo al cliente en el puerto 3001`);

    const logicaDB = new LogicaDB(datos,endpointDB);
    // Proxy universal de la lógica de la base de datos
    endpointDB.on('message', (funcion, argumentos) => {
        try{
            funcion = funcion.toString();

            // Los argumentos son un json
            argumentos = JSON.parse(argumentos.toString());

            console.log("\nHa llegado lo siguiente:");
            console.log(funcion);
            console.log(argumentos);
            console.log("------------------------------------------");
            // Esperamos un poco para responder
            setTimeout(() => {
                logicaDB[funcion](argumentos);
            },2000);
        } catch(err){
            console.log(err);
        }

    });

    // Para matar el programa
    process.on('SIGINT', () => {
        console.log("Cerrando DB");
        endpointDB.close();
    });
}

main();