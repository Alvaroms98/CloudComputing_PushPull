const database = require("./logicaDB");
const zmq = require("zeromq");

// --------------- CONFIGURACIONES PARA DESPLIEGUE ---------- //
const PASSWORD = process.env.DB_PASSWORD || 'admin1234';
const DB_HOST = process.env.DB_HOST || 'localhost';



function main() {
    const logicaDB = new database.Database(PASSWORD, DB_HOST);
    const conexionResp = zmq.socket("rep");

    process.on('SIGINT', () => {
        console.log('************ SIGINT capturada cerrando **********');
        console.log("Cerrando DB");
        conexionResp.close();

        process.exit(0);
    });

    try {
        conexionResp.on("message", (funcion, argumentos) => {

            // funcion que debe existir en logicaDB
            funcion = funcion.toString();

            //Enviados en formato JSON
            argumentos = argumentos.toString();

            // Esperamos un poco para responder
            setTimeout( async () => {
                let rta = await logicaDB[funcion](argumentos);
                conexionResp.send(JSON.stringify(rta));
            }, 1000);
        });

    }
    catch (error) {
        console.log(error);
    }

    conexionResp.bind('tcp://*:3001', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Respondo al cliente en el puerto 3001");
            console.log("---------------- ENV -----------------");
            console.log("DB_PASSWORD", process.env.DB_PASSWORD);
            console.log("DB_HOST", process.env.DB_HOST);
        }

    });
}


// --------------------------------------------------------
// --------------------------------------------------------

main() 

// --------------------------------------------------------
// --------------------------------------------------------

