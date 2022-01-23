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

        // ---------------------- /api/ ------------------------------

        // Este debe pedir toda la base de datos
        this.router.get('/', async (req, res) => {
            const respuesta = await logica.sacarTodo();
            res.json(respuesta);
        });

        // borrar toda la base de datos (peligroso)
        this.router.delete('/', async (req,res) => {
            const respuesta = await logica.borrarTodo();
            res.json(respuesta);
        });



        // ---------------------- /api/propietario/ --------------------

        // Pedir todos los datos de un usuario
        this.router.get('/propietario/:propietario', async (req,res) => {
            const { propietario } = req.params;

            const respuesta = await logica.buscarObjetoporPropietario(propietario);
            res.json(respuesta);
        });

        // Subir una nueva entrada a la base de datos
        this.router.post('/propietario/:propietario', async (req,res) => {
            const { propietario } = req.params;

            // Recoger el objeto JSON que se quiere guardar
            const objeto = req.body;
            //console.log(objeto);

            // Comprobamos si el objeto está vacio o si no se está enviando
            // un objeto json
            if ( Object.keys(objeto).length === 0 ){
                res.status(404).json({"mensaje": "error en el formato (json), o objeto vacío."});
            } else{
                const respuesta = await logica.guardarObjeto(propietario, objeto);
                res.json(respuesta);
            }
        });

        // Eliminar todos los objetos de un propietario
        this.router.delete('/propietario/:propietario', async (req,res) => {
            const { propietario } = req.params;

            const respuesta = await logica.borrarPropietario(propietario);
            res.json(respuesta);
        });

        // ----------------------- /api/propietario/:propietario/campo/ --------

        // Busca todos los objetos de un propietario que tengan el campo
        this.router.get('/propietario/:propietario/campo/:campo', async (req,res) => {
            const { propietario, campo } = req.params;

            const respuesta = await logica.buscarObjetoporPropietarioYCampo(propietario,campo);
            res.json(respuesta);
        });

        // Borrar todos los objetos de un propietario que tengan un campo en especificio
        this.router.delete('/propietario/:propietario/campo/:campo', async (req,res) => {
            const { propietario, campo } = req.params;
            const respuesta = await logica.borrarObjetoporPropietarioYCampo(propietario,campo);
            res.json(respuesta);
        });


        // ----------------------- /api/id/ --------------------------------- 

        // busca un objeto único
        this.router.get('/id/:id', async (req,res) => {
            const { id } = req.params;
            const respuesta = await logica.buscarPorID(id);
            res.json(respuesta);
        });

        // borra un objeto unico
        this.router.delete('/id/:id', async (req,res) => {
            const { id } = req.params;
            const respuesta = await logica.borrarPorID(id);
            res.json(respuesta);
        });

    }
}



module.exports.rutasAPI = rutasAPI;