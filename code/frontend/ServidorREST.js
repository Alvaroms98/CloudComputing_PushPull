// Servidor web API REST con expressjs

const express = require('express');
const morgan = require('morgan');

// Rutas REST
const { rutasAPI } = require('./rutasREST/api');

// Lógica
const { Logica } = require('./logica');


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
    app.use(require('./rutasREST/index'));
    app.use('/api/', rutasapi.router);


    return app;
}


const main = async () => {
    // // Abrir conexión con la base de datos
    // const conexionDB = conectarDB();

    // Llamar a la lógica
    const logica = new Logica();

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