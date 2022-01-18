const mariadb = require('mariadb');
const password = process.env.PASSWORD || 'admin';
const respuesta = [];
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: password,
     database: 'pushpull',
     connectionLimit: 5
});

class Database
{
  constructor() {

  }

  /**
   * Extrae todas las filas de la base de datos, creando una conexión
   * a base de datos de MariaDB se hace uso de `query()` para hacer una
   * consulta a la tabla correspondiente.
   * @returns Devuelve toda la data en la DB
   */
  async sacarTodo() {
    let conn;
  
    try{
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM JSON_OBJECT");
      return rows;
    }
    catch(err){
      throw new Error(err.message);
    }
    finally {
      if (conn){
        conn.end();
      } 
     //process.exit(0);
    }
  }

  /**
   * Extrae las filas de la base de datos que coinciden con el filtro enviado 
   * como argumento. Se crea una conexión a la base de datos de MariaDB
   * se hace uso de `query()` para hacer una consulta a la tabla correspondiente.
   * @param {*} args { propietario: name }
   * @returns Devuelve data de la DB filtradas por 'Propietario'
   */
  async buscarObjetoporPropietario(args){
    let conn;
  
    try{
      //Convierto string a JSON y extraigo el propietario
      var propietario = JSON.parse(args);

      conn = await pool.getConnection();
      let myQuery = `SELECT * FROM JSON_OBJECT WHERE Propietario ='${propietario.propietario}'`;
      const rows = await conn.query(myQuery);
      return rows; 
      
    }
    catch(err){
      throw new Error(err.message);
    }
    finally {
      if (conn){
        conn.end();
      } 
     //process.exit(0);
    }
  }

}

module.exports.Database = Database;

