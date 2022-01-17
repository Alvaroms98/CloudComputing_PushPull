// requerimos el enrutador
const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
    const bienvenida = {
        mensaje: 'Bienvenido al REST API de PUSH-PULL. Para empezar a usarla: URL/api/', 
    };
    res.json(bienvenida);
});  

module.exports = router;