// Servidor web API REST con expressjs

const express = require('express');
const morgan = require('morgan');

// Rutas REST
const { rutasAPI } = require('./rutasREST/api');

// Lógica
const { Logica } = require('./logica');

// --------------- CONFIGURACIONES PARA DESPLIEGUE ---------- //
// Puerto de escucha
const REST_PORT = process.env.HTTP_REST_API_PORT || '3000';

// Conexiones
const WORKER_URL = process.env.WORKER_ENDPOINT || 'localhost:4222'; //"172.17.0.1:4222";
const DB_URL = process.env.DB_ENDPOINT || 'tcp://localhost:3001'; //"tcp://172.17.0.1:3001";

// --------------------------------------------------------- //

const arrancarAPIREST = (logica) => {
    const app = express();
    
    // Configuración
    // El puerto tiene que configurarse externamente
    app.set('port', REST_PORT);

    // middlewares
    app.use(morgan('dev'));
    app.use(express.json());

    // rutas
    const rutasapi = new rutasAPI(logica);
    app.use(require('./rutasREST/index'));
    app.use('/api/', rutasapi.router);


    return app;
}


const main = async () => {
    // // Abrir conexión con la base de datos
    // const conexionDB = conectarDB();

    // Llamar a la lógica
    const logica = new Logica(DB_URL, WORKER_URL);

    console.log("------------- ENV ------------");
    console.log(`DB_URL: ${DB_URL}`);
    console.log(`WORKER_URL: ${WORKER_URL}`);

    // conectar los proxys de la lógica a sus endpoints
    await logica.conectar();

    // Pasamos la instancia de la lógica
    // al servidor API REST para que pueda utilizarla
    // en las acciones que se ejecuten en los distintos endpoints
    app = arrancarAPIREST(logica);

    const webServer = app.listen(app.get('port'), () => {
        console.log(`REST API sirviendo en el puerto ${app.get('port')}`);
    });

    process.on('SIGINT', async () => {
        console.log("Apagando servidor REST");
        //conexionDB.close();
        webServer.close();
        logica.proxydb.cerrarConexion();
        await logica.proxyworker.cerrarConexion();
    });
}


main();