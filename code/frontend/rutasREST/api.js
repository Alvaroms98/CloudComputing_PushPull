// Rutas REST API

const { Router } = require('express');

// Requerimos la lógica para invocarla
// en los endpoints REST API, pero se inicializa en el servidor
// esto quiere decir que la conexión con la base de datos se establece
// en "restapi.js" desde aquí solo se llama a las funciones de esta


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

        // Subir una nueva entrada a la base de datos
        this.router.post('/:propietario', async (req,res) => {
            const { propietario } = req.params;

            // Recoger el objeto JSON que se quiere guardar
            const objeto = req.body;
            console.log(objeto);

            // Comprobamos si el objeto está vacio o si no se está enviando
            // un objeto json
            if ( Object.keys(objeto).length === 0 ){
                res.json({"mensaje": "error en el formato (json), o objeto vacío."});
            } else{

                res.json({"mensaje": "petición recibida con éxito"});
            }
            
            
        });
    }
}



module.exports = rutasAPI;