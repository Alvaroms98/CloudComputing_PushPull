// Base de datos de testing

// La lógica es capaz de llamar 
class Logica {
    constructor(conexionDB){
        this.conexionDB = conexionDB;
    }

    // Promesa que devuelve las respuestas de la base de datos
    respuestaDB(){
        return new Promise((resolve) => {
            this.conexionDB.on('message', (respuesta) => {
                resolve(respuesta.toString());
            });
        });
    }
    // Se llamará desde un POST del REST API
    guardarObjeto(propietario, objeto){

    }

    // Saca todas las instancias de la base de datos
    async sacarTodo(){
        // Le decimos a la base de datos que queremos todo
        const funcion = 'sacarTodo';
        let argumentos = JSON.stringify({});

        this.conexionDB.send([funcion,argumentos]);

        let respuesta = await this.respuestaDB();
        respuesta = JSON.parse(respuesta);
        console.log(respuesta);
        return respuesta;
    }

    // Saca las instancias de la base de datos que tengan
    // como propietario "X"
    async buscarObjetoporPropietario(propietario){
        const funcion = 'buscarObjetoporPropietario';
        let argumentos = JSON.stringify({propietario: propietario});

        this.conexionDB.send([funcion, argumentos]);

        let respuesta = await this.respuestaDB();
        respuesta = JSON.parse(respuesta);
        console.log(respuesta);
        return respuesta;
    }
}

module.exports.Logica = Logica;