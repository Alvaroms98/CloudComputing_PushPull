// Servidor web API REST con expressjs

const express = require('express');
const morgan = require('morgan');
const zmq = require('zeromq');
const rutasAPI = require('./rutas/api');

// Lógica
const { Logica } = require('./logica');

// Conf DB
const URL = "localhost:3001";



// Conexión ENDPOINT DB
const conectarDB = () => {
    const conexionDB = zmq.socket('req');
    conexionDB.connect(`tcp://${URL}`);

    return conexionDB;
}




const arrancarAPIREST = (logica) => {
    const app = express();
    
    // Configuración
    // El puerto tiene que configurarse externamente
    app.set('port', process.env.RESTport || 3000);

    // middlewares
    app.use(morgan('dev'));
    app.use(express.json());

    // rutas
    const rutasapi = new rutasAPI(logica);
    app.use(require('./rutas/index'));
    app.use('/api/', rutasapi.router);


    return app;
}


const main = () => {
    // Abrir conexión con la base de datos
    const conexionDB = conectarDB();

    // Llamar a la lógica
    const logica  = new Logica(conexionDB);


    app = arrancarAPIREST(logica);
    const webServer = app.listen(app.get('port'), () => {
        console.log(`REST API on port ${app.get('port')}`);
    });

    process.on('SIGINT', () => {
        console.log("Desconectando de la DB");
        conexionDB.close();
        webServer.close();
    });
}


main();