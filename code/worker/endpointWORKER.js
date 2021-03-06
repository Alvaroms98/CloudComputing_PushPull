// End-Point por donde recibe o solicita los tareas que hay que realizar
// El frontend no se conecta directamente a este endpoint,
// sino, que la cola de trabajos actúa como balanceador de carga.
// Es decir, el worker se conecta a la cola y solicita trabajo cuando esta libre
// estos trabajos son los que deposita el frontend en la cola

// Dependencias

const { ColaDeTrabajos, esperar } = require('./proxys/ColaDeTrabajos');
const { Logica } = require('./logica');

// --------------- CONFIGURACIONES PARA DESPLIEGUE ---------- //
const NATS_URL = process.env.NATS_ENDPOINT || 'localhost:4222';
const DB_URL = process.env.DB_ENDPOINT || 'tcp://localhost:3001';
// --------------------------------------------------------- //

// Para salir del bucle infinito cuando se quiera matar el proceso
let cerrar = false

// La rutina de trabajo consiste en:
// 1. Pedir trabajo a la cola
// 2. Esperar un tiempo aleatorio en responder
// 3. Responder la petición devolviendolo a la cola (cola de respuestas)
const rutinaDeTrabajo = async (worker, logica) => {
    while (!cerrar){
        // Recoger trabajo
        const trabajo = await worker.pedirTrabajo();

        // Si trabajo distinto de null es que hay trabajo
        // por tanto bajamos el contador de intentos a 1
        if (trabajo !== null){

            // Imprimir trabajo
            console.log(`Me han asignado este trabajo: ${trabajo.funcion}`);
            console.log(trabajo.parametros);

            
            // Llamar al método de la lógica correspondiente
            let respuesta = await logica[trabajo.funcion](trabajo.parametros);

            // Responder trabajo
            await worker.responderATrabajo(trabajo,{
                estado: "OK",
                respuesta: JSON.parse(respuesta),
            });

        } else{
            console.log("\n No hay trabajo");
            await esperar( 2000 );
        }

    }
}

// Con esta función el worker empieza la rutina de trabajo
// si se queda sin trabajo lo dice por pantalla, y vuelve a entrar recursivamente
const entroATrabajar = async (worker, logica) => {
    try{
        await rutinaDeTrabajo(worker, logica);
    } catch(err){
        console.log("\n\nEn la rutina de trabajo ha saltado este error:\n");
        console.log(err);
    }
}

const conectarNATS = async () => {
    return new Promise((resolve,reject) => {
        var worker;
        try {
            worker = new ColaDeTrabajos(NATS_URL, { worker: true });
            setTimeout( () => {
                console.log(`Se ha esperado 2 secs para resolver la conexión con NATS`);
            }, 2000);
            resolve(worker);
        } catch(e){
            reject(e);
        }
    });
}



const main = async () => {
    console.log("----------- ENV -----------");
    console.log(`DB_URL: ${DB_URL}`);
    console.log(`NATS_URL: ${NATS_URL}`);
    // Establecer conexion con la cola
    const worker = await conectarNATS();

    // const worker = new ColaDeTrabajos(
    //     NATS_URL,
    //     {
    //         worker: true
    //     }
    // );
    
    
    // llamar a la lógica del worker
    const logica = new Logica(DB_URL);

    // Para matar al trabajador
    process.on('SIGINT', async () => {
        await worker.cerrar();
        logica.proxydb.cerrarConexion();
        cerrar = true;
    });

    // 

    // Comienza el trabajo
    await entroATrabajar(worker, logica);
}


main();