const database = require("./logicaDB");
const zmq = require("zeromq");


function main() {
    const logicaDB = new database.Database();
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
        }

    });
}


// --------------------------------------------------------
// --------------------------------------------------------

main() 

// --------------------------------------------------------
// --------------------------------------------------------

