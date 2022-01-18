const zmq = require('zeromq');
// Conf DB
const URL = "localhost:3001";

var socketParaPedir = zmq.socket('req');


socketParaPedir.on("message", async function (respuesta) {

    const resp = await respuesta.toString();
    console.log("Respuesta recibida", JSON.parse(resp));
    socketParaPedir.close()
    process.exit(0)
    
})

socketParaPedir.connect(`tcp://${URL}`);

enviarMensaje = function (n, origen) {
    setTimeout(function() {
        console.log("Enviando ... funcion:  " + n , "  Argumentos:  ", origen);
        socketParaPedir.send([n, origen])
        
    }, 1000)
}

const funcion = 'sacarTodo';
let argumentos = '{}';

// ....................................................
enviarMensaje (funcion, argumentos);

// ....................................................

process.on('SIGINT', function() {
	console.log ( " ** SIGINT capturada: cerrando !! ** ")
	socketParaPedir.close()
})


