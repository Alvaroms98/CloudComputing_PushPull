// Rutas REST API

const { Router } = require('express');

// Requerimos la lógica para invocarla
// en los endpoints REST API, pero se inicializa en el servidor
// esto quiere decir que la conexión con la base de datos se establece
// en "restapi.js" desde aquí solo se llama a las funciones de esta
//const { Logica } = require('../logica');


class rutasAPI {
    constructor(logica){
        this.logica = logica;
        this.router = new Router();


        // Todas las rutas han de llamar a la lógica

        // Este debe pedir toda la base de datos
        this.router.get('/', async (req, res) => {
            const respuesta = await logica.sacarTodo();
            res.json(respuesta);
        });

        // Pedir todos los datos de un usuario
        this.router.get('/:propietario', async (req,res) => {
            const { propietario } = req.params;

            const respuesta = await logica.buscarObjetoporPropietario(propietario);
            res.json(respuesta);
        });
    }
}



module.exports = rutasAPI;